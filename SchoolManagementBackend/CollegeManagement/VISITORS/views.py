import base64
import mimetypes
import os
import uuid

from django.core.files.storage import default_storage
from django.db import DatabaseError
from django.http import Http404
from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response

from Acadix.models import ExceptionTrack
from Swostitech_Acadix import settings
from VISITORS.models import Visitor
from VISITORS.serializers import VisitorCreateSerializer, VisitorSearchSerializer, VisitorUpdateSerializer

# from STAFF.utils import save_image
# Create your views here.

class VisitorCreateAPIView(CreateAPIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = VisitorCreateSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            # full_file_path = ''
            upload_file = request.FILES.get('upload_file')
            # if upload_file:
                # print(upload_file)
                # full_file_path = save_image(upload_file)
                # print(full_file_path)
                #
                # # Generate a Unique UUID string for upload file & image uniqueness
                # # Generate a unique 8-character string using UUID
                # unique_string = str(uuid.uuid4())[:8]
                #
                # # Generate a dynamic folder and file path
                # folder_name = "VISITOR_IMAGE"
                #
                # file_name = f"{os.path.splitext(upload_file.name)[0]}_{unique_string}{os.path.splitext(upload_file.name)[1]}"
                # file_path = os.path.join(folder_name, file_name)  # This is the relative file path
                #
                # # Get the full path relative to the media directory
                # full_file_path = os.path.join(settings.MEDIA_ROOT, file_path)
                #
                # # Ensure the directory exists
                # if not os.path.exists(os.path.dirname(full_file_path)):
                #     os.makedirs(os.path.dirname(full_file_path))

                # # Save the file
                # with default_storage.open(full_file_path, 'wb+') as destination:
                #     for chunk in upload_file.chunks():
                #         destination.write(chunk)
            #


            #Create Visitor details
# {organization,branch,visitor_name,purpose_of_visit,whom_to_visit,phone,email,vehicle_no,visit_date,department,address,created_by}
            visitorcreateinstance = Visitor.objects.create(
                organization = serializer.validated_data.get('organization'),
                branch= serializer.validated_data.get('branch'),
                visitor_name = serializer.validated_data.get('visitor_name'),
                purpose_of_visit = serializer.validated_data.get('purpose_of_visit'),
                whom_to_visit = serializer.validated_data.get('whom_to_visit'),
                phone = serializer.validated_data.get('phone'),
                email = serializer.validated_data.get('email'),
                vehicle_no = serializer.validated_data.get('vehicle_no'),
                photo_file = upload_file,
                photo_path = '',
                visit_date= serializer.validated_data.get('visit_date'),
                department = serializer.validated_data.get('department'),
                address = serializer.validated_data.get('address'),
                created_by = serializer.validated_data.get('created_by')
            )
            if visitorcreateinstance.photo_file:
                visitorcreateinstance.photo_path = request.build_absolute_uri(visitorcreateinstance.photo_file.url)
                visitorcreateinstance.save()

            return Response({'message':'success'},status=status.HTTP_200_OK)

        except ValidationError as e:

            # Rollback the transaction on validation error

            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as e:

            # Rollback the transaction on database error

            self.log_exception(request, str(e))

            return Response({'error': 'A database error occurred: ' + str(e)},

                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:

            # Rollback the transaction on any other exception

            self.log_exception(request, str(e))

            return Response({'error': 'An unexpected error occurred: ' + str(e)},

                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='visitorcreate',

            message=error_message,

        )

class VisitorSearchListAPIView(ListAPIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = VisitorSearchSerializer

    def list(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.query_params)
            serializer.is_valid(raise_exception=True)

            visitorlistrecord = Visitor.objects.filter(
                organization=serializer.validated_data.get('organization_id'),
                branch=serializer.validated_data.get('branch_id'),
                is_active=True
            )

            if serializer.validated_data.get('visitor_name'):
                visitorlistrecord = visitorlistrecord.filter(visitor_name__icontains=serializer.validated_data.get('visitor_name'))

            if serializer.validated_data.get('whom_to_visit'):
                visitorlistrecord = visitorlistrecord.filter(whom_to_visit__icontains=serializer.validated_data.get('whom_to_visit'))

            if serializer.validated_data.get('phone'):
                visitorlistrecord = visitorlistrecord.filter(phone__icontains=serializer.validated_data.get('phone'))

            if serializer.validated_data.get('from_date'):
                # Filter records starting from this date (inclusive)
                visitorlistrecord = visitorlistrecord.filter(visit_date__gte=serializer.validated_data.get('from_date'))

            if serializer.validated_data.get('to_date'):
                # For partial date matching in DateTimeField, ensure we include the stored date
                # Using date() comparison if possible, or just standard lte
                # Note: lte with date usually implies midnight. We rely on standard Django behavior here.
                # If to_date is 2026-01-28, we likely want everything UP TO end of 2026-01-28?
                # Usually standard filtering is precise.
                visitorlistrecord = visitorlistrecord.filter(visit_date__lte=serializer.validated_data.get('to_date'))
            
            # Additional ordering for better UX
            visitorlistrecord = visitorlistrecord.order_by('-visit_date')

            if visitorlistrecord.exists():
                responseData = []
                for item in visitorlistrecord:
                    data = {
                        'visitor_id': item.visitor_id,
                        'visitor_name': item.visitor_name,
                        'purpose_of_visit': item.purpose_of_visit,
                        'whom_to_visit': item.whom_to_visit,
                        'phone': item.phone,
                        'email': item.email,
                        'image': item.photo_path,
                        'file_type': '',
                        'address': item.address,
                        'department': item.department.department_description if item.department else None,
                        'vehicle_no': item.vehicle_no,
                        'visit_date': item.visit_date.date() if item.visit_date else None,
                        'InTime': item.visit_date.time() if item.visit_date else None,
                        'outTime': item.visit_end_date.time() if item.visit_end_date else None
                    }
                    responseData.append(data)
                return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)
            else:
                # Return empty list with success instead of 204 error, safer for frontend tables
                return Response({'message': 'No Record Found', 'data': []}, status=status.HTTP_200_OK)
        except ValidationError as e:

            return Response({'message': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Http404:

            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='GetTeacherlessonplanlist',

            message=error_message,

        )


class VisitorUpdateOutTimeUpdateAPIView(UpdateAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = Visitor.objects.all()
    serializer_class = VisitorUpdateSerializer

    # Set lookup field to match your primary key
    # lookup_field = "visitor_id"

    def update(self, request, *args, **kwargs):
        print('data comming')
        try:
            # Determine if this is a partial update
            partial = kwargs.pop('partial', False)
            visitor_id = request.query_params.get('visitor_id')
            # Fetch the record based on reg_id (from URL)
            # instance = self.get_object()
            instance = Visitor.objects.get(visitor_id=visitor_id)
            # print(instance)

            # Validate and update data
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)

            print(serializer.validated_data.get('out_time'))

            # Update The record
            instance.visit_end_date = serializer.validated_data.get('out_time')

            instance.save()

            return Response({'message': 'success', }, status=status.HTTP_200_OK)


        except Http404:
            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as e:
            self.log_exception(request, str(e))
            return Response({'error': 'A database error occurred.' + str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            self.log_exception(request, str(e))
            print(str(e))
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='visitorouttimeupdate',
            message=error_message,
        )


class VisitorDeleteAPIView(APIView):
    """
    API View to delete a visitor record
    """
    # permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            visitor = Visitor.objects.get(pk=pk)
            visitor.delete()
            return Response({'message': 'success'}, status=status.HTTP_200_OK)
        except Visitor.DoesNotExist:
            return Response({'error': 'Visitor not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            self.log_exception(request, str(e))
            return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='visitordelete',
            message=error_message,
        )
