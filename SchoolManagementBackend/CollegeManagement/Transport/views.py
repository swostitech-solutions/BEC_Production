import ast
import json
# from itertools import batched
# from complexity_analyzer import complexity
from django.db import DatabaseError
from django.db.models import Q, Sum
from django.http import Http404
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView, DestroyAPIView,RetrieveAPIView
from rest_framework.response import Response

from Acadix.models import ExceptionTrack, Organization, Branch, StudentCourse, StudentFeeDetail, Period, Semester
from Acadix.serializers import PeriodSerializer, SemesterSerializer
from .models import RouteMaster, PickupPoint, RouteDetail
from .serializers import RouteMasterSerializer, PickupPointSerializer, RouteDetailSerializer, \
    RouteDetailUpdateSerializer, PickupPointUpdateSerializer, RouteMasterUpdateSerializer, \
    GetRouteDetailANDPICKUPPOINTSerializer, GetStudentTransportAvailOrNotListSerializer, \
    UpdateTransportAvailOrNotUpdateSerializer, StudentTransportFeeSearchSerializer, \
    StudentFeeGetBasedOnFeeAppliedFromSerializer


# Create your views here.

class RouteMasterCreateAPIView(CreateAPIView):
    queryset = RouteMaster.objects.all()
    serializer_class = RouteMasterSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer=self.get_serializer(data= request.data)
            serializer.is_valid(raise_exception=True)

            #Get validate data
            transport_name = serializer.validated_data.get('transport_name').upper()
            organization_id = serializer.validated_data.get('organization_id')
            branch_id = serializer.validated_data.get('branch_id')
            created_by = serializer.validated_data.get('created_by')

            #Check transport name exist or not

            if RouteMaster.objects.filter(transport_name=transport_name,organization=organization_id,branch=branch_id,is_active=True).exists():
                return Response({'message': 'This transport name already exist'},status=status.HTTP_400_BAD_REQUEST)


            # create & save tranport data

            RouteMaster_instance = RouteMaster(
                transport_name=transport_name,
                organization=organization_id,
                branch=branch_id,
                created_by= created_by,
                updated_by= created_by
            )

            RouteMaster_instance.save()

            # Make response data based on serializer
            data = RouteMasterSerializer(RouteMaster_instance).data

            return Response({'message': 'Route Master Created successfully', 'data': data}, status=status.HTTP_201_CREATED)

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
            process_name='routemasternameAdd',
            message=error_message,
        )
class RouteMasterListAPIView(ListAPIView):
    queryset = RouteMaster.objects.all()
    serializer_class = RouteMasterSerializer

    def list(self, request, *args, **kwargs):
        try:
            # response = super().list(request,*args,**kwargs)
            # resdata = response.data
            organization_id= request.query_params.get('organization_id')
            branch_id= request.query_params.get('branch_id')

            # get filter data based on organization and branch
            try:
                resdata= RouteMaster.objects.filter(organization=organization_id,branch=branch_id,is_active=True)
            except:
                resdata= None

            if resdata:
                responsedata=[]
                for item in resdata:
                    responsedata.append({
                        'id': item.id,
                        'transport_name': item.transport_name,

                    })
                    # if item.get('is_active') == True:

                        # #Get Data
                        # organization_id= item.get('organization_id')
                        # branch_id = item.get('branch_id')
                        #
                        # Organization_instance = Organization.objects.get(pk=organization_id)
                        #
                        # branch_instance = Branches.objects.get(pk=branch_id)

                        # Prepare the custom response data
                        # responsedata.append({
                        #     'id': item.get('id'),
                        #     'transport_name': item.get('transport_name'),
                        #     # 'organization_id': Organization_instance.id,
                        #     # 'organization_code': Organization_instance.organization_code,
                        #     # 'branch_id' : branch_instance.id,
                        #     # 'branch_name' : branch_instance.branch_name,
                        #
                        #
                        # })
                    # else:
                    #     continue
                if responsedata:

                    return Response(responsedata, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)

        except Exception as e:
            # Log the exception
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='routemasterlist',
            message=error_message,
        )
class RouteMasterUpdateAPIView(UpdateAPIView):
    queryset = RouteMaster.objects.all()
    serializer_class = RouteMasterUpdateSerializer

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial',False)
            instance = self.get_object()


            # validate input data
            serializer = self.get_serializer(instance,data =request.data,partial=partial)
            serializer.is_valid(raise_exception=True)


            #Access serializer data
            transport_name = serializer.validated_data.get('transport_name').upper()
            organization_id = serializer.validated_data.get('organization_id')
            branch_id = serializer.validated_data.get('branch_id')
            updated_by = serializer.validated_data.get('updated_by')


            # Check if no changes were made
            if (instance.transport_name == transport_name and
                    instance.organization_id == organization_id and
                    instance.branch_id == branch_id
            ):
                return Response({'message': 'No changes identified'}, status=status.HTTP_200_OK)

            # Check if a similar record already exists
            if RouteMaster.objects.exclude(pk=instance.pk).filter(

                    transport_name=transport_name,
                    organization_id=organization_id,
                    branch_id=branch_id,
                    is_active= True

            ).exists():
                return Response({'message': 'This Route name already exists in this branch.'}, status=status.HTTP_400_BAD_REQUEST)

            # Update instance with new data
            instance.transport_name = transport_name
            instance.organization_id = organization_id
            instance.branch_id = branch_id
            instance.updated_by = updated_by

            instance.save()

            return Response({'message': 'Route  updated successfully.'}, status=status.HTTP_200_OK)

        except Http404:
            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as e:
            self.log_exception(request, str(e))
            return Response({'error': 'A database error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            self.log_exception(request, str(e))
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='RoutemasterUpdate',
            message=error_message,
        )
class RouteMasterDestroyAPIView(DestroyAPIView):
    queryset = RouteMaster.objects.all()
    serializer_class = RouteMasterSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            if instance.is_active:
                instance.is_active = False
                instance.save()

                return Response({'message':'Route Deactivated Successfully'},status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Route already Deactivated.'}, status=status.HTTP_400_BAD_REQUEST)

        except Http404:
            return Response({'message': 'record not found'}, status=status.HTTP_404_NOT_FOUND)
class PickUpPointCreateAPIView(CreateAPIView):
    queryset = PickupPoint.objects.all()
    serializer_class = PickupPointSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer= self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            #Get validate data

            pickup_point_name = serializer.validated_data.get('pickup_point_name').upper()
            organization_id = serializer.validated_data.get('organization_id')
            branch_id = serializer.validated_data.get('branch_id')
            amount = serializer.validated_data.get('amount')
            created_by = serializer.validated_data.get('created_by')


            # Check pickup point already exist or not

            if PickupPoint.objects.filter(pickup_point_name=pickup_point_name,organization=organization_id,branch=branch_id,is_active=True).exists():
                return Response({'message':'PickUp point already exist on this branch'},status=status.HTTP_400_BAD_REQUEST)

            # save PickUp points

            pickuppoint_instance = PickupPoint(
                pickup_point_name = pickup_point_name,
                organization = organization_id,
                branch = branch_id,
                amount= amount,
                created_by= created_by,
                updated_by=created_by
            )

            #Save the data in DB

            pickuppoint_instance.save()

            # Make response data based on serializer
            data = PickupPointSerializer(pickuppoint_instance).data

            return Response({'message': 'Route Master Created successfully', 'data': data},status=status.HTTP_201_CREATED)

        except ValidationError as e:
            # Rollback the transaction on validation error
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as e:
            # Rollback the transaction on database error
            self.log_exception(request, str(e))
            return Response({'error': 'A database error occurred: ' + str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            # Rollback the transaction on any other exception
            self.log_exception(request, str(e))
            return Response({'error': 'An unexpected error occurred: ' + str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='pickuppointAdd',
            message=error_message,
        )
class PickUpPointListAPIView(ListAPIView):
    queryset = PickupPoint.objects.all()
    serializer_class = PickupPointSerializer

    def list(self, request, *args, **kwargs):
        try:
            # response = super().list(request, *args, **kwargs)
            # resdata = response.data
            organization_id= request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')

            try:
                resdata= PickupPoint.objects.filter(organization=organization_id,branch=branch_id,is_active=True)
            except:
                resdata= None

            if resdata:
                responsedata = []
                for item in resdata:
                    # Prepare the custom response data
                    responsedata.append({
                        'id': item.id,
                        'pickup_point_name': item.pickup_point_name,
                        'amount': item.amount

                    })
                    # if item.get('is_active') == True:
                    #
                    #     # Get Data
                    #     organization_id = item.get('organization_id')
                    #     branch_id = item.get('branch_id')
                    #
                    #     Organization_instance = Organization.objects.get(pk=organization_id)
                    #
                    #     branch_instance = Branches.objects.get(pk=branch_id)
                    #
                    #     # Prepare the custom response data
                    #     responsedata.append({
                    #         'id': item.get('id'),
                    #         'pickup_point_name': item.get('pickup_point_name'),
                    #         'organization_id': Organization_instance.id,
                    #         'organization_code': Organization_instance.organization_code,
                    #         'branch_id': branch_instance.id,
                    #         'branch_name': branch_instance.branch_name,
                    #         'amount': item.get('amount')
                    #
                    #     })
                    # else:
                    #     continue
                if responsedata:

                    return Response({'message':'Success','data':responsedata}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)

        except Exception as e:
            # Log the exception
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='pickuppointlist',
            message=error_message,
        )
class PickUpPointUpdateAPIView(UpdateAPIView):
    queryset = PickupPoint.objects.all()
    serializer_class = PickupPointUpdateSerializer

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial',False)
            instance = self.get_object()


            # validate input data
            serializer = self.get_serializer(instance,data =request.data,partial=partial)
            serializer.is_valid(raise_exception=True)


            #Access serializer data
            pickup_point_name = serializer.validated_data.get('pickup_point_name').upper()
            organization_id = serializer.validated_data.get('organization_id')
            branch_id = serializer.validated_data.get('branch_id')
            amount = int(serializer.validated_data.get('amount'))
            updated_by = serializer.validated_data.get('updated_by')



            # Check if no changes were made
            if (instance.pickup_point_name == pickup_point_name and
                    instance.organization == organization_id and
                    instance.branch == branch_id and
                    instance.amount == amount
            ):
                return Response({'message': 'No changes identified'}, status=status.HTTP_200_OK)

            # Check if a similar record already exists
            if PickupPoint.objects.exclude(pk=instance.pk).filter(

                    pickup_point_name=pickup_point_name,
                    organization_id=organization_id,
                    branch_id=branch_id,
                    is_active = True

            ).exists():
                return Response({'message': 'This pickup point already exists on this branch.'}, status=status.HTTP_400_BAD_REQUEST)

            # Update instance with new data
            instance.pickup_point_name = pickup_point_name
            instance.organization_id = organization_id
            instance.branch_id = branch_id
            instance.amount = amount
            instance.updated_by = updated_by

            instance.save()

            return Response({'message': 'pickup point  updated successfully.'}, status=status.HTTP_200_OK)

        except Http404:
            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as e:
            self.log_exception(request, str(e))
            return Response({'error': 'A database error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            self.log_exception(request, str(e))
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='PickupPointUpdate',
            message=error_message,
        )

class PickUpPointDestroyAPIView(DestroyAPIView):
    queryset = PickupPoint.objects.all()
    serializer_class = PickupPointSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            if instance.is_active:
                instance.is_active = False
                instance.save()

                return Response({'message':'PickUp Point Deactivated Successfully'},status=status.HTTP_200_OK)
            else:
                return Response({'message': 'PickUp Point already Deactivated.'}, status=status.HTTP_400_BAD_REQUEST)

        except Http404:
            return Response({'message': 'record not found'}, status=status.HTTP_404_NOT_FOUND)

class RouteDetailsCreateAPIView(CreateAPIView):
    queryset = RouteDetail.objects.all()
    serializer_class = RouteDetailSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer= self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            #Get validate data

            route_master_id = serializer.validated_data.get('route_master_id')
            pickup_point_id = serializer.validated_data.get('pickup_point_id')
            pickup_time = serializer.validated_data.get('pickup_time')
            pickup_sequence = serializer.validated_data.get('pickup_sequence')
            created_by = serializer.validated_data.get('created_by')


            # Check pickup point already exist or not

            if RouteDetail.objects.filter(route_master_id=route_master_id,pickup_point_id=pickup_point_id,is_active=True).exists():
                return Response({'message':'PickUp point already added on this route'},status=status.HTTP_400_BAD_REQUEST)

            # save PickUp points

            RouteDetail_instance = RouteDetail(
                route_master_id = route_master_id,
                pickup_point_id = pickup_point_id,
                pickup_time = pickup_time,
                pickup_sequence= pickup_sequence,
                created_by= created_by,
                updated_by=created_by
            )

            #Save the data in DB

            RouteDetail_instance.save()

            # Make response data based on serializer
            data = RouteDetailSerializer(RouteDetail_instance).data

            return Response({'message': 'PickUp Point Added successfully', 'data': data},status=status.HTTP_201_CREATED)

        except ValidationError as e:
            # Rollback the transaction on validation error
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as e:
            # Rollback the transaction on database error
            self.log_exception(request, str(e))
            return Response({'error': 'A database error occurred: ' + str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            # Rollback the transaction on any other exception
            self.log_exception(request, str(e))
            return Response({'error': 'An unexpected error occurred: ' + str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='pickuppointAddonroute',
            message=error_message,
        )

class RouteDetailsListAPIView(ListAPIView):
    queryset = RouteDetail.objects.all()
    serializer_class = RouteDetailSerializer

    def list(self, request, *args, **kwargs):
        try:
            # response = super().list(request, *args, **kwargs)
            # resdata = response.data
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')

            resdata = RouteDetail.objects.filter(is_active=True)

            if resdata:
                responsedata = []
                for item in resdata:
                    # if item.get('is_active') == True:

                        # Get Data
                    route_master_id = item.route_master.id
                    pickup_point_id = item.pickup_point.id

                    RouteMaster_instance = RouteMaster.objects.get(pk=route_master_id,organization=organization_id,branch=branch_id)

                    PickupPoint_instance = PickupPoint.objects.get(pk=pickup_point_id,organization=organization_id,branch=branch_id)

                    # Prepare the custom response data
                    responsedata.append({
                        'id': item.id,
                        'route_master_id': RouteMaster_instance.id,
                        'transport_name': RouteMaster_instance.transport_name,
                        'PickupPoint_id': PickupPoint_instance.id,
                        'pickup_point_name': PickupPoint_instance.pickup_point_name,
                        'pickup_time': item.pickup_time,
                        'pickup_sequence': item.pickup_sequence

                    })
                # else:
                #     continue
                if responsedata:

                    return Response({'message':'Success','data':responsedata}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)

        except Exception as e:
            # Log the exception
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='pickuppointlist',
            message=error_message,
        )

class RouteDetailsUpdateAPIView(UpdateAPIView):
    queryset = RouteDetail.objects.all()
    serializer_class = RouteDetailUpdateSerializer

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial',False)
            instance = self.get_object()


            # validate input data
            serializer = self.get_serializer(instance,data =request.data,partial=partial)
            serializer.is_valid(raise_exception=True)


            #Access serializer data
            route_master_id = serializer.validated_data.get('route_master_id')
            pickup_point_id = serializer.validated_data.get('pickup_point_id')
            pickup_time = serializer.validated_data.get('pickup_time')
            pickup_sequence = int(serializer.validated_data.get('pickup_sequence'))
            updated_by = serializer.validated_data.get('updated_by')



            # Check if no changes were made
            if (instance.route_master_id == route_master_id and
                    instance.pickup_point_id == pickup_point_id and
                    instance.pickup_time == pickup_time and
                    instance.pickup_sequence == pickup_sequence
            ):
                return Response({'message': 'No changes identified'}, status=status.HTTP_200_OK)

            # Check if a similar record already exists
            if RouteDetail.objects.exclude(pk=instance.pk).filter(

                    route_master_id=route_master_id,
                    pickup_point_id=pickup_point_id,
                    is_active = True,


            ).exists():
                return Response({'message': 'This RouteDetail already exists on this route.'}, status=status.HTTP_400_BAD_REQUEST)

            # Update instance with new data
            instance.route_master_id = route_master_id
            instance.pickup_point_id = pickup_point_id
            instance.pickup_time = pickup_time
            instance.pickup_sequence = pickup_sequence
            instance.updated_by = updated_by

            instance.save()

            return Response({'message': 'Route Details  updated successfully.'}, status=status.HTTP_200_OK)

        except Http404:
            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as e:
            self.log_exception(request, str(e))
            return Response({'error': 'A database error occurred.'+str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            self.log_exception(request, str(e))
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='RouteDetailsUpdate',
            message=error_message,
        )


class RouteDetailsDestroyAPIView(DestroyAPIView):
    queryset = RouteDetail.objects.all()
    serializer_class = RouteDetailSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            if instance.is_active:
                instance.is_active = False
                instance.save()

                return Response({'message':'Route Details pickup point Deactivated Successfully'},status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Route Details pickup point already Deactivated.'}, status=status.HTTP_400_BAD_REQUEST)

        except Http404:
            return Response({'message': 'record not found'}, status=status.HTTP_404_NOT_FOUND)

# class GetPickupPointBasedOnRouteMaster(ListAPIView):
#     serializer_class = PickupPointSerializer  # or your custom serializer
#
#     def get_queryset(self):
#         routeId = self.kwargs.get('pk')
#
#         # Return the filtered RouteDetail queryset
#         return RouteDetail.objects.filter(route_master_id_id=routeId, is_active=True)
#
#     def list(self, request, *args, **kwargs):
#         # Get the queryset from the get_queryset method
#         route_details_data = self.get_queryset()
#
#         print(route_details_data)
#
#         # Prepare custom response with route_detail_id and pickup_point details
#         response_data = []
#         for item in route_details_data:
#             # Get the actual PickupPoint instance
#             pickup_point = get_object_or_404(PickupPoint, id=item.pickup_point_id_id)
#
#             # Serialize the PickupPoint instance
#             serialized_pickup_point = PickupPointSerializer(pickup_point).data
#
#             # Add route_detail_id to the serialized data
#             serialized_pickup_point['route_detail_id'] = item.id
#             response_data.append(serialized_pickup_point)
#
#         # Return the response data
#         return Response(response_data, status=status.HTTP_200_OK)



class GetPickupPointBasedOnRouteMaster(ListAPIView):
    serializer_class = GetRouteDetailANDPICKUPPOINTSerializer   #PickupPointSerializer


    def list(self, request, *args, **kwargs):
        try:
            route_id = request.query_params.get('route_id')
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')

            route_details_data = RouteDetail.objects.filter(
                route_master__organization = organization_id,
                route_master__branch = branch_id,
                route_master=route_id,
                is_active=True
            )

            #print(route_details_data)

            if route_details_data:

                # Make response data
                responsedata=[]

                # Iterate data into Queryset data of route details record

                for item in route_details_data:
                    # Gat the actual Pickup_Point instance
                    pickup_point = get_object_or_404(PickupPoint, id=item.pickup_point.id)

                    #print(pickup_point)

                    # Extract only the pickup_point_name and route_detail_id
                    response_item = {
                        'organization_description' : item.route_master.organization.organization_description,
                        'branch_name' : item.route_master.branch.branch_name,
                        'routeDetailsId': item.id,  # Extract route_details_id
                        'pickup_point_name': pickup_point.pickup_point_name,  # Extract pickup_point_name
                        'amount': pickup_point.amount

                    }

                    responsedata.append(response_item)

                return Response({'message':'Success','data':responsedata},status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No data Found!'},status=status.HTTP_200_OK)


        except Exception as e:
            # Log the exception
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='findpickuppointtlist',
            message=error_message,

        )

    # def list(self, request, *args, **kwargs):
    #     try:
    #         response = super().list(request, *args, **kwargs)
    #         resdata = response.data
    #         print(resdata)
            #
            # if resdata:
            #     responsedata = []
            #     # print(resdata)
            #     for item in resdata:
            #         # Prepare the custom response data
            #         responsedata.append({
            #             'RouteId': self.kwargs.get('pk'),
            #             'pickuppointname': item.get('pickup_point_name')
            #
            #         })
            #
            #     if responsedata:
            #         return Response({'message': 'Success', 'data': responsedata}, status=status.HTTP_200_OK)
            #     else:
            #         return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)
            #
            # else:
            #     return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)

    #     except Exception as e:
    #         # Log the exception
    #         error_message = str(e)
    #         self.log_exception(request, error_message)
    #         return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    #
    # def log_exception(self, request, error_message):
    #     ExceptionTrack.objects.create(
    #         request=str(request),
    #         process_name='findpickuppointtlist',
    #         message=error_message,
    #
    #     )


class GetFilterRouteBasedOnOrganizationBranch(ListAPIView):
    serializer_class = RouteMasterSerializer

    # def get_queryset(self):
    #     organization_id = self.kwargs.get('organization_id')
    #     branch_id = self.kwargs.get('branch_id')
    #
    #     return RouteMaster.objects.filter(
    #         organization=organization_id,
    #         branch=branch_id,
    #         is_active=True
    #     )

    def list(self, request, *args, **kwargs):
        try:
            # response = super().list(request, *args, **kwargs)
            # resdata = response.data

            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')

            resdata = RouteMaster.objects.filter(
                    organization=organization_id,
                    branch=branch_id,
                    is_active=True
                )

            if resdata:
                responsedata = []
                #print(resdata)
                for item in resdata:
                    # Prepare the custom response data
                    # OrganizationInstance = Organization.objects.get(id=item.get('organization'))
                    # BranchOrganization = Branch.objects.get(id=item.get('branch'))
                    responsedata.append({
                        'id': item.id,
                        'organization_id': item.organization.id,
                        'organization_description': item.organization.organization_description,
                        'branch_id': item.branch.id,
                        'branch_name': item.branch.branch_name,
                        'transport_name': item.transport_name
                    })

                if responsedata:
                    return Response({'message': 'Success', 'data': responsedata}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)

        except Exception as e:
            # Log the exception
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='findRoutelist',
            message=error_message,

        )


class GetStudentTransportListAPIView(ListAPIView):
    serializer_class = GetStudentTransportAvailOrNotListSerializer

    def list(self, request, *args, **kwargs):
        try:

            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            batch_id = request.query_params.get('batch_id')
            student_id = request.query_params.get('student_id')
            course_id = request.query_params.get('course_id')
            department_id = request.query_params.get('department_id')
            academic_year_id= request.query_params.get('academic_year_id')
            semester_id = request.query_params.get('semester_id')
            section_id = request.query_params.get('section_id')


            # organization_id,branch_id,batch_id,course_id,department_id,academic_year_id,semester_id,section_id,student_id

            if not organization_id and not branch_id:
                return Response({'message':'Please provide organization and branch'},status=status.HTTP_400_BAD_REQUEST)

            try:
                filterdata= StudentCourse.objects.filter(organization=organization_id,branch=branch_id,is_active=True)

            except:
                filterdata= None

            # print(filterdata)
            responseData=[]
            if filterdata:
                if student_id:
                    filterdata = filterdata.filter(student=student_id)

                if course_id:
                    filterdata = filterdata.filter(course=course_id)

                if department_id:
                    filterdata = filterdata.filter(department=department_id)

                if academic_year_id:
                    filterdata = filterdata.filter(academic_year=academic_year_id)

                if semester_id:
                    filterdata = filterdata.filter(semester=semester_id)

                if section_id:
                    filterdata = filterdata.filter(section=section_id)

                # Now check filter data availble or not

                if filterdata:
                    for record in filterdata:
                        name_parts = filter(
                            None,
                            [
                                record.student.first_name,
                                record.student.middle_name,
                                record.student.last_name,

                            ],
                        )
                        student_name = " ".join(name_parts)

                        data={
                            "batch_name": record.batch.batch_code,
                            "academic_year": record.academic_year.academic_year_code,
                            "semester": record.semester.semester_code,
                            "course_id":record.course.id,
                            "course_name": record.course.course_name,
                            "department_id":record.department.id,
                            "department_description":record.department.department_description,
                            "section_id": record.section.id,
                            "section_name": record.section.section_name,
                            "enrollment_no": record.enrollment_no,
                            "student_id":record.student.id,
                            "student_name": student_name,
                            "college_admission_no": record.student.college_admission_no,
                            "barcode": record.student.barcode,
                            "father_name": record.student.father_name,
                            "mother_name": record.student.mother_name,
                            "house_id": record.house.id if record.house else None,
                            "house_name": record.house.house_name if record.house else None,
                            "transport_availed": record.transport_availed

                        }

                        responseData.append(data)
                    return Response({'message':'success','data':responseData},status=status.HTTP_200_OK)


                else:
                    return Response({'message':'No Record Found'},status=status.HTTP_200_OK)

            else:
                return Response({'message':'No record found'},status=status.HTTP_200_OK)

        except Exception as e:
            # Log the exception
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='StudentTransportList',
            message=error_message,

        )

# @complexity
class UpdateTransportDetailsUpdateAPIView(UpdateAPIView):
    serializer_class = UpdateTransportAvailOrNotUpdateSerializer

    def update(self, request, *args, **kwargs):
        try:
            # created_by,student_id,transport_avail,period_month,route_id,pickup_point_id,amount
            # Get
            created_by= request.data.get("created_by")
            student_id = request.data.get("student_id")
            transport_avail = request.data.get("transport_avail")
            choice_semesters = request.data.get("choice_semesters")
            route_id = request.data.get("route_id")  # not used
            pickup_point_id = request.data.get("pickup_point_id")
            amount = request.data.get("amount")

            # print(created_by,student_id,transport_avail,period_month,routeId,pickuppointId,amount)

            # validation part
            if not student_id:
                return Response({'message':'Please provide student Id'},status=status.HTTP_400_BAD_REQUEST)

            if transport_avail == True and not choice_semesters:
                return Response({'message': 'Please choose at least one period month'}, status=status.HTTP_400_BAD_REQUEST)

            # if transport_avail == True:
            #     periods = []
            #     periods_data = Period.objects.all()
            #     for period in periods:
            #         periods.append(period)
            #



            # Get Student Instance
            try:
                studentcourseInstance = StudentCourse.objects.get(student=student_id,is_active=True)
            except:
                return Response({'message':'Student Record Not Found'},status=status.HTTP_404_NOT_FOUND)

           #print(studentclassInstance)
            # TRANSPORT CHARGES

            # Get Student fee details

            try:
                studentfeedetails_record = StudentFeeDetail.objects.filter(
                    student=studentcourseInstance.student,
                    element_name="Transport Fees",
                    # academic_year= studentcourseInstance.academic_year,
                    organization= studentcourseInstance.student.organization,
                    branch= studentcourseInstance.student.branch,
                    is_active=True
                ).filter(Q(paid_amount=0) | Q(paid_amount__isnull=True))

                # Check if records exist
                if studentfeedetails_record.exists():
                    studentfeedetails_record.update(is_active=False)

            except StudentFeeDetail.DoesNotExist:
                studentfeedetails_record = None


            if choice_semesters:
                # Validate all semester IDs upfront
                invalid_semester_ids = []
                valid_semesters = []
                
                for semester_id in choice_semesters:
                    try:
                        semester = Semester.objects.get(id=semester_id)
                        valid_semesters.append(semester)
                    except Semester.DoesNotExist:
                        invalid_semester_ids.append(semester_id)
                
                # If any semester IDs are invalid, return error with all invalid IDs
                if invalid_semester_ids:
                    self.log_exception(request, f'Invalid semester IDs: {invalid_semester_ids}, choice_semesters={choice_semesters}')
                    return Response({
                        'message': f'Invalid semester selection. Semester IDs {invalid_semester_ids} do not exist in the database. Please select valid semesters.'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Get fee_applied_from (first valid semester)
                if studentcourseInstance.choice_semester:
                    try:
                        # Try to get the first semester from existing choice_semester
                        existing_semesters = ast.literal_eval(studentcourseInstance.choice_semester)
                        if isinstance(existing_semesters, list) and len(existing_semesters) > 0:
                            fee_applied_from = Semester.objects.get(id=existing_semesters[0])
                        else:
                            fee_applied_from = valid_semesters[0]
                    except (Semester.DoesNotExist, ValueError, SyntaxError, IndexError):
                        # If parsing or lookup fails, use the first valid semester
                        fee_applied_from = valid_semesters[0]
                else:
                    fee_applied_from = valid_semesters[0]

                # Create fee details for each valid semester
                for semesterInstance in valid_semesters:
                    
                    # Insert Record Into DB
                    try:
                        student_fee_details_Instance = StudentFeeDetail.objects.create(
                            student= studentcourseInstance.student,
                            student_course= studentcourseInstance,
                            organization=studentcourseInstance.student.organization,
                            branch=studentcourseInstance.student.branch,
                            # batch=studentcourseInstance.student.batch,
                            # course=studentcourseInstance.student.course,
                            department=studentcourseInstance.student.department,
                            academic_year=semesterInstance.academic_year,
                            # academic_year=studentcourseInstance.student.academic_year,
                            element_name = 'Transport Fees',
                            # element_name = 'TRANSPORT CHARGES',
                            fee_applied_from= fee_applied_from,
                            semester= semesterInstance,
                            paid= 'N',
                            # academic_year= studentcourseInstance.academic_year,

                            element_amount= amount,
                            total_element_period_amount= amount,
                            paid_amount = 0.00,
                            created_by= created_by,
                            updated_by= created_by

                        )
                    except Exception as e:
                        return Response({'message':f'Transport not updated: {str(e)}'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # update the student record

            studentcourseInstance.transport_availed=transport_avail
            # Update choice_semester with the new selection (replace, not append)
            if choice_semesters:
                studentcourseInstance.choice_semester = str(choice_semesters)
            studentcourseInstance.route_id= pickup_point_id # here we pass route details id

            studentcourseInstance.save()

            return Response({'message':'success'},status=status.HTTP_200_OK)

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
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='RouteDetailsUpdate',
            message=error_message,
        )

class StudentTransportDetailsRetriveAPIView(RetrieveAPIView):
    serializer_class = PeriodSerializer

    def retrieve(self, request, *args, **kwargs):
        try:
            student_id = request.query_params.get('student_id')
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')

            # Get Student Details Into StudentCourse Table
            if not (student_id and organization_id and branch_id):
                return Response({"message":"student_id, organization_id and branch_id is required !!!"}, status=status.HTTP_400_BAD_REQUEST)
            try:

                studentCourseInstance= StudentCourse.objects.get(organization=organization_id,branch=branch_id,student=student_id,is_active=True)
            except:
                return Response({'message':'student course record not found'},status=status.HTTP_404_NOT_FOUND)

            # Get choose month details list
            transport_choice_semester=[]



            # step -1 convert string to list
            # Convert choice_month from string to list safely
            previously_selected_semester_ids = []
            if isinstance(studentCourseInstance.choice_semester, str) and studentCourseInstance.choice_semester:
                try:
                    previously_selected_semester_ids = json.loads(studentCourseInstance.choice_semester)
                except json.JSONDecodeError:
                    previously_selected_semester_ids = []
            elif studentCourseInstance.choice_semester:
                previously_selected_semester_ids = studentCourseInstance.choice_semester



            # Check TRANSPORT CHARGES paid or not on this particular academic year & month
            feeappfrom_ids = StudentFeeDetail.objects.filter(
                student=studentCourseInstance.student,
                element_name="Transport Fees",
                academic_year=studentCourseInstance.academic_year,
                organization=studentCourseInstance.organization,
                branch=studentCourseInstance.branch,
                paid_amount__gt=0.00,  # Changed from __gte to __gt (strictly greater than 0)
                is_active=True
            ).values_list('fee_applied_from', flat=True)  # Extracts only 'feeappfrom' values as a list

            # Always fetch ALL semesters for the student's course
            all_semesters = Semester.objects.filter(
                organization=studentCourseInstance.organization,
                branch=studentCourseInstance.branch,
                batch=studentCourseInstance.batch,
                course=studentCourseInstance.course,
                department=studentCourseInstance.department,
                is_active=True
            ).order_by('display_order', 'id')
            
            # Build response with selected and paid flags
            for semesterInstance in all_semesters:
                transport_choice_semester.append({
                    "semester_id": semesterInstance.id,
                    "semester_name": semesterInstance.semester_description,
                    "semester_code": semesterInstance.semester_code,
                    "selected": semesterInstance.id in previously_selected_semester_ids,  # Previously selected by student
                    "flag": "No" if semesterInstance.id in feeappfrom_ids else "Yes"  # "No" = paid, "Yes" = can select
                })

            # Get RouteDetails Data
            try:
                routedetailsInstance = RouteDetail.objects.get(id=studentCourseInstance.route_id, is_active=True)
            except RouteDetail.DoesNotExist:
                routedetailsInstance = None

                # Make Response Data
            name_parts = filter(
                None,
                [
                    studentCourseInstance.student.first_name,
                    studentCourseInstance.student.middle_name,
                    studentCourseInstance.student.last_name,

                ],
            )
            student_name = " ".join(name_parts)

            transport_paid_sems = StudentFeeDetail.objects.filter(organization_id=organization_id,branch_id=branch_id,student=studentCourseInstance.student,paid__iexact='Y',is_active=True).values('semester_id')

            data={
                "student_name": student_name,
                "admission_no": studentCourseInstance.student.admission_no,
                "barcode": studentCourseInstance.student.barcode,
                "father_name": studentCourseInstance.student.father_name,
                "mother_name": studentCourseInstance.student.mother_name,
                "college_admission_no": studentCourseInstance.student.college_admission_no,
                "transport_avail": studentCourseInstance.transport_availed,
                "choice_semester":transport_choice_semester,
                "current_semester_id": studentCourseInstance.semester.id,  # Current semester of the student
                "routeId": routedetailsInstance.route_master.id if routedetailsInstance else None,
                "route_name": routedetailsInstance.route_master.transport_name if routedetailsInstance else None,
                "pickup_point_id": routedetailsInstance.pickup_point.id if routedetailsInstance else None,
                "pickup_point_name": routedetailsInstance.pickup_point.pickup_point_name if routedetailsInstance else None,
                # Use the actual saved transport fee amount from StudentFeeDetail (custom amount).
                # Fall back to the pickup point's default only if no fee record exists yet.
                "amount": (
                    StudentFeeDetail.objects.filter(
                        student=studentCourseInstance.student,
                        element_name="Transport Fees",
                        organization=studentCourseInstance.organization,
                        branch=studentCourseInstance.branch,
                        is_active=True
                    ).order_by('-id').values_list('element_amount', flat=True).first()
                    or (routedetailsInstance.pickup_point.amount if routedetailsInstance else None)
                ),
                "total_semesters": studentCourseInstance.course.total_semesters,
                "transport_paid_sems":transport_paid_sems
            }

            return Response({'message':'success',"data":data},status=status.HTTP_200_OK)

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

            process_name='GetTransportDetailsByStudent',

            message=error_message,

        )

class StudentTransportFeesListAPIView(ListAPIView):
    serializer_class = StudentTransportFeeSearchSerializer

    def list(self, request, *args, **kwargs):
        try:
            student_id = request.query_params.get('student_id')
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            batch_id = request.query_params.get('batch_id')
            course_id = request.query_params.get('course_id')
            department_id= request.query_params.get('department_id')
            academic_year_id = request.query_params.get('academic_year_id')
            semester_id = request.query_params.get('semester_id')
            section_id = request.query_params.get('section_id')
            pickup_point_id = request.query_params.get('pickup_point_id')
            fee_applied_from = request.query_params.get('fee_applied_from')
            paid = request.query_params.get('paid')
            # academic_year_id,organization_id,branch_id,student_id,course_id,department_id,semester_id,section_id,pickup_point_id,fee_applied_from,paid_unpaid
            # print(academicyearId, orgId, branchId)

            if  not (organization_id and branch_id and paid):
                return Response({'message':'Please provide organization and branch and paid'},status=status.HTTP_400_BAD_REQUEST)


            # Get student_class record based on academic year & Organization And branch
            try:
                filterdata = StudentCourse.objects.filter(organization=organization_id,branch=branch_id,is_active=True)
            except StudentCourse.DoesNotExist:
                return Response({"message":"Student course record not found !!!"}, status=status.HTTP_404_NOT_FOUND)
                # filterdata=None

            if filterdata:

                # Filter student Id
                if student_id:
                    filterdata=filterdata.filter(student=student_id)

                if batch_id:
                    filterdata=filterdata.filter(batch=batch_id)

                if course_id:
                    filterdata= filterdata.filter(course= course_id)

                if department_id:
                    filterdata = filterdata.filter(department=department_id)

                if academic_year_id:
                    filterdata = filterdata.filter(academic_year=academic_year_id)

                if semester_id:
                    filterdata = filterdata.filter(semester=semester_id)

                if section_id:
                    filterdata= filterdata.filter(section=section_id)

                if pickup_point_id:

                    # try:
                    #     routeDetailsRecord = RouteDetail.objects.filter(pickup_point=pickup_point_id,is_active=True)
                    # except:
                    #     routeDetailsRecord=None

                    # print(routeDetailsRecord)


                    filterdata = filterdata.filter(route_id=pickup_point_id)



                # Extract student IDs from the filtered student_class queryset
                student_ids = filterdata.values_list('student', flat=True)

                if not student_ids:
                    return Response({'message': 'No matching student records found'}, status=status.HTTP_200_OK)

                # Filter student_fee_details based on the filtered student_ids
                student_fee_qs = StudentFeeDetail.objects.filter(
                    # academic_year=academic_year_id,
                    organization=organization_id,
                    branch=branch_id,
                    student__in=student_ids,
                    # element_name="TRANSPORT CHARGES",
                    element_name="Transport Fees",
                    is_active=True
                )

                if fee_applied_from:

                    # Get feeappfrom range

                    # semester = get_object_or_404(Semester, id=fee_applied_from)
                    try:
                        semesterInstance = Semester.objects.get(id=fee_applied_from)
                    except Semester.DoesNotExist:
                        return

                    # Filter periods where sorting_order is less than or equal to the current period's sorting_order
                    # filtered_periods = Period.objects.filter(sorting_order__lte=semester.sorting_order)
                    # filtered_semesters = Semester.objects.filter(course=course_id,department=department_id)

                    # Extract only the list of IDs
                    # filtered_semester_ids = list(filtered_semesters.values_list('id', flat=True))
                    # filtered_period_ids = list(filtered_periods.values_list('id', flat=True))

                    # Filter student_fee_qs where feeapplicable_from is in filtered_period_ids
                    student_fee_qs = student_fee_qs.filter(semester=fee_applied_from)

                # calculate student wise chage amount and paid amount
                studentWise_data = student_fee_qs.values('student_id','element_name').annotate(
                    total_element_amount=Sum('element_amount'),
                    total_paid_amount=Sum('paid_amount')

                )

                if paid.lower() == 'true':
                    studentWise_data = studentWise_data.filter(total_paid_amount=0)
                    # studentWise_data = StudentFeeDetail.objects.filter(student=student_id,element_name__iexact='Transport Fees',paid__iexact='Y')


                if studentWise_data:
                    responseData=[]
                    for item in studentWise_data:
                        student_id = item.get('student_id')
                        try:
                            studentCourseInstance = StudentCourse.objects.get(student=student_id,is_active=True)
                        except:
                            return Response({'message': f'Student Record not found {student_id}'},status=status.HTTP_404_NOT_FOUND)

                        try:
                            routedetailsinstance = RouteDetail.objects.get(id=studentCourseInstance.route_id,is_active=True)
                        except:
                            routedetailsinstance= None

                        name_parts = filter(
                            None,
                            [
                                studentCourseInstance.student.first_name,
                                studentCourseInstance.student.middle_name,
                                studentCourseInstance.student.last_name,

                            ],
                        )
                        student_name = " ".join(name_parts)
                        data={
                            "fee_applied_from": Semester.objects.filter(is_active=True).values_list('id', flat=True).first(),
                            # "fee_applied_from": Period.objects.filter(is_active=True).order_by('-sorting_order').values_list('id', flat=True).first(),
                            "course_id": studentCourseInstance.course.id,
                            "course_name": studentCourseInstance.course.course_name,
                            "department_id": studentCourseInstance.department.id,
                            "department_description": studentCourseInstance.department.department_description,
                            # "academic_year": Semester.objects.get(id=item.get('semester')).academic_year.id,
                            # "semester": item.get('semester'),
                            "section_name": studentCourseInstance.section.section_name,
                            "student_id": studentCourseInstance.student.id,
                            "student_name": student_name,
                            "college_admission_no": studentCourseInstance.student.college_admission_no,
                            "father_name": studentCourseInstance.student.father_name,
                            "pick_up_point": routedetailsinstance.pickup_point.pickup_point_name if routedetailsinstance else None,

                            "element_name":item.get('element_name'),
                            "total_fees": item.get("total_element_amount"),
                            "paid_fees": item.get("total_paid_amount"),
                            'paid': item.get("paid")
                        }

                        responseData.append(data)
                    return Response({'message':'success','data':responseData},status=status.HTTP_200_OK)

                else:
                    return Response({'message':'No Record Found'},status=status.HTTP_200_OK)

            else:
                return Response({'message':'No record Found'},status=status.HTTP_200_OK)

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

            process_name='TransportChargesCalculate',

            message=error_message,

        )

class StudentAllFeesCalculationBasedOnElement(ListAPIView):
    serializer_class = StudentFeeGetBasedOnFeeAppliedFromSerializer

    def list(self, request, *args, **kwargs):
        try:
            student_id= request.query_params.get("student_id")
            fee_applied_from_id = request.query_params.get("fee_applied_from_id")
            academic_year_id= request.query_params.get("academic_year_id")
            organization_id= request.query_params.get("organization_id")
            branch_id = request.query_params.get("branch_id")

            #print(student_id,feeappfrom,academicyearId,organization_id,branch_id)

            if not student_id :
                return Response({'message':"please provide student_Id"},status=status.HTTP_400_BAD_REQUEST)
            if not fee_applied_from_id :
                return Response({'message':"please provide fee_applied_from_id"},status=status.HTTP_400_BAD_REQUEST)
            #dmessage':"please provide academic_year_id"},status=status.HTTP_400_BAD_REQUEST)
            if not organization_id :
                return Response({'message':"please provide  organization_id"},status=status.HTTP_400_BAD_REQUEST)
            if not branch_id:
                return Response({'message':"please provide branch_id"},status=status.HTTP_400_BAD_REQUEST)

            try:
                student_fee_record= StudentFeeDetail.objects.filter(student=student_id,organization=organization_id,
                                                                       branch=branch_id,semester=fee_applied_from_id,element_name='Transport Fees',is_active=True)
            except:
                student_fee_record= None
            if not student_fee_record.exists():
                return Response({'message':"No Record Found"},status=status.HTTP_200_OK)

            fee_summary = student_fee_record.values('semester', "element_name").annotate(
                total_amount=Sum("element_amount"),
                total_paid_amount=Sum("paid_amount")
            )

            if fee_summary:
                responseData=[]
                for item in fee_summary:
                    try:
                        semesterInstance = Semester.objects.get(id=item.get("semester"))
                    except:
                        return Response({'message':"No fee_applied_from record found"},status=status.HTTP_400_BAD_REQUEST)
                    data={
                        # "fee_applied_from": semesterInstance.semester_description,
                        "semester": semesterInstance.semester_description,
                        "element_name": item.get("element_name"),
                        "total_amount": item.get("total_amount"),
                        "total_paid_amount": item.get("total_paid_amount")
                    }
                    responseData.append(data)

                return Response({'message':'success','data':responseData},status=status.HTTP_200_OK)


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

            process_name='MonthlyElemetWiseStudentFees',

            message=error_message,

        )