from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db import models

from NON_TEACHING_STAFF.models import NonTeachingStaffMaster
from NON_TEACHING_STAFF.serializers import (
    NonTeachingStaffCreateSerializer,
    NonTeachingStaffUpdateSerializer,
    NonTeachingStaffListSerializer,
    NonTeachingStaffDetailSerializer,
    NonTeachingStaffAddressUpdateSerializer
)


class NonTeachingStaffCreateAPIView(generics.CreateAPIView):
    """
    API endpoint to create a new non-teaching staff member
    POST /api/NON_TEACHING_STAFF/Create/
    """
    queryset = NonTeachingStaffMaster.objects.all()
    serializer_class = NonTeachingStaffCreateSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            return Response({
                'message': 'Non-teaching staff created successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'message': f'Error creating non-teaching staff: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)


class NonTeachingStaffListAPIView(generics.ListAPIView):
    """
    API endpoint to list all non-teaching staff
    GET /api/NON_TEACHING_STAFF/List/?organization_id=X&branch_id=Y&status=Active
    """
    serializer_class = NonTeachingStaffListSerializer

    def get_queryset(self):
        queryset = NonTeachingStaffMaster.objects.filter(is_active=True)
        
        # Filter by organization
        organization_id = self.request.query_params.get('organization_id')
        if organization_id:
            queryset = queryset.filter(organization_id=organization_id)
        
        # Filter by branch
        branch_id = self.request.query_params.get('branch_id')
        if branch_id:
            queryset = queryset.filter(branch_id=branch_id)
        
        # Filter by status
        staff_status = self.request.query_params.get('status')
        if staff_status:
            queryset = queryset.filter(status=staff_status)
        
        # Search by name or staff code
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(first_name__icontains=search) |
                models.Q(last_name__icontains=search) |
                models.Q(staff_code__icontains=search)
            )
        
        return queryset.order_by('-created_at')

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            
            return Response({
                'message': 'Non-teaching staff list retrieved successfully',
                'data': serializer.data,
                'count': queryset.count()
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'message': f'Error retrieving non-teaching staff list: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)


class NonTeachingStaffDetailAPIView(generics.RetrieveAPIView):
    """
    API endpoint to get details of a specific non-teaching staff member
    GET /api/NON_TEACHING_STAFF/Details/<nts_id>/
    """
    queryset = NonTeachingStaffMaster.objects.all()
    serializer_class = NonTeachingStaffDetailSerializer
    lookup_field = 'nts_id'

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            
            return Response({
                'message': 'Non-teaching staff details retrieved successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'message': f'Error retrieving non-teaching staff details: {str(e)}'
            }, status=status.HTTP_404_NOT_FOUND)


class NonTeachingStaffUpdateAPIView(generics.UpdateAPIView):
    """
    API endpoint to update non-teaching staff basic information
    PUT /api/NON_TEACHING_STAFF/Update/<nts_id>/
    """
    queryset = NonTeachingStaffMaster.objects.all()
    serializer_class = NonTeachingStaffUpdateSerializer
    lookup_field = 'nts_id'

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
            return Response({
                'message': 'Non-teaching staff updated successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'message': f'Error updating non-teaching staff: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)


class NonTeachingStaffAddressUpdateAPIView(generics.UpdateAPIView):
    """
    API endpoint to update non-teaching staff address information
    PUT /api/NON_TEACHING_STAFF/UpdateAddress/<nts_id>/
    """
    queryset = NonTeachingStaffMaster.objects.all()
    serializer_class = NonTeachingStaffAddressUpdateSerializer
    lookup_field = 'nts_id'

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
            return Response({
                'message': 'Non-teaching staff address updated successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'message': f'Error updating address: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)


class NonTeachingStaffDeleteAPIView(generics.DestroyAPIView):
    """
    API endpoint to delete (soft delete) a non-teaching staff member
    DELETE /api/NON_TEACHING_STAFF/Delete/<nts_id>/
    """
    queryset = NonTeachingStaffMaster.objects.all()
    lookup_field = 'nts_id'

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            # Soft delete - set is_active to False and status to Inactive
            instance.is_active = False
            instance.status = 'Inactive'
            instance.save()
            
            return Response({
                'message': 'Non-teaching staff deleted successfully'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'message': f'Error deleting non-teaching staff: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
