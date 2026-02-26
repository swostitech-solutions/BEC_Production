from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import MOU
from .serializers import MOUSerializer
from Acadix.models import ExceptionTrack
import os

class MouCreateAPIView(APIView):
    def post(self, request):
        try:
            data = request.data
            serializer_data = {
                'organization': data.get('org_id'),
                'branch': data.get('branch_id'),
                'mou_details': data.get('mou_details'),
                'mou_date': data.get('mou_date'),  # Accept date/time from frontend
                'created_by': data.get('created_by'),
                'document_file': request.FILES.get('upload_file')
            }
            
            serializer = MOUSerializer(data=serializer_data)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'success'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MouDetailsListAPIView(APIView):
    def get(self, request, org_id, branch_id):
        try:
            from datetime import datetime, timedelta
            from django.utils import timezone
            
            # Handle 'null' string from frontend if it happens
            if org_id == 'null' or branch_id == 'null':
                 return Response({'message': 'success', 'data': []}, status=status.HTTP_200_OK)

            
            # Build filter dictionary
            filters = {
                'organization_id': org_id,
                'branch_id': branch_id
            }
            
            mous = MOU.objects.filter(**filters)
            
            # Apply date filters if provided
            from_date = request.query_params.get('from_date')
            to_date = request.query_params.get('to_date')
            
            # Fix timezone-aware datetime filtering
            if from_date:
                # Convert from_date string to start of day in local timezone
                from_datetime = timezone.make_aware(datetime.strptime(from_date, '%Y-%m-%d'))
                mous = mous.filter(mou_date__gte=from_datetime)
            if to_date:
                # Convert to_date string to end of day in local timezone
                to_datetime = timezone.make_aware(datetime.strptime(to_date, '%Y-%m-%d')) + timedelta(days=1) - timedelta(seconds=1)
                mous = mous.filter(mou_date__lte=to_datetime)
            
            data = []
            for mou in mous:
                doc_url = request.build_absolute_uri(mou.document_file.url) if mou.document_file else None
                doc_name = os.path.basename(mou.document_file.name) if mou.document_file else "document"
                
                # Convert to local timezone before extracting date and time
                local_datetime = timezone.localtime(mou.mou_date) if mou.mou_date else None
                
                data.append({
                    'mou_id': mou.mou_id,
                    'mou_details': mou.mou_details,
                    'mou_date': local_datetime.date() if local_datetime else None,
                    'mou_time': local_datetime.time() if local_datetime else None,
                    'doc_url': doc_url,
                    'doc_name': doc_name,
                })
            
            return Response({'message': 'success', 'data': data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MouDeleteAPIView(APIView):
    def delete(self, request, pk):
        try:
            mou = MOU.objects.get(pk=pk)
            mou.delete()
            return Response({'message': 'success'}, status=status.HTTP_200_OK)
        except MOU.DoesNotExist:
             return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
