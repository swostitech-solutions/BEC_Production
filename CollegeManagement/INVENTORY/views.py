from django.db import DatabaseError
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication, BasicAuthentication

from INVENTORY.models import InventoryCategory, InventorySubCategory, InventoryItem
from INVENTORY.serializers import (
    InventoryCategoryCreateSerializer,
    InventoryCategoryListSerializer,
    InventorySubCategoryCreateSerializer,
    InventorySubCategoryUpdateSerializer,
    InventorySubCategoryListSerializer,
    InventoryItemCreateSerializer,
    InventoryItemUpdateSerializer,
    InventoryItemListSerializer
)


class InventoryCategoryCreateAPIView(generics.CreateAPIView):
    """API View to create a new inventory category"""
    authentication_classes = []  # Disable authentication
    permission_classes = []  # Disable permissions
    serializer_class = InventoryCategoryCreateSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            
            if not serializer.is_valid():
                return Response({
                    'status': 'error',
                    'message': 'Validation failed',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if category already exists
            org_id = serializer.validated_data.get('organization')
            branch_id = serializer.validated_data.get('branch')
            category_name = serializer.validated_data.get('category_name')
            
            if InventoryCategory.objects.filter(
                organization=org_id,
                branch=branch_id,
                category_name__iexact=category_name
            ).exists():
                return Response({
                    'status': 'error',
                    'message': 'Category with this name already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Save the category
            category = serializer.save()
            
            return Response({
                'status': 'success',
                'message': 'Inventory Category created successfully',
                'data': {
                    'category_id': category.category_id,
                    'category_name': category.category_name
                }
            }, status=status.HTTP_201_CREATED)
            
        except DatabaseError as e:
            return Response({
                'status': 'error',
                'message': f'Database error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class InventoryCategoryListAPIView(generics.ListAPIView):
    """API View to list all inventory categories"""
    authentication_classes = []  # Disable authentication
    permission_classes = []  # Disable permissions
    serializer_class = InventoryCategoryListSerializer

    def list(self, request, *args, **kwargs):
        try:
            org_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            
            if not org_id or not branch_id:
                return Response({
                    'status': 'error',
                    'message': 'organization_id and branch_id are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            categories = InventoryCategory.objects.filter(
                organization_id=org_id,
                branch_id=branch_id
            ).order_by('-created_at')
            
            serializer = self.get_serializer(categories, many=True)
            
            return Response({
                'status': 'success',
                'message': 'Categories retrieved successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class InventorySubCategoryCreateAPIView(generics.CreateAPIView):
    """API View to create a new inventory sub-category"""
    authentication_classes = []  # Disable authentication
    permission_classes = []  # Disable permissions
    serializer_class = InventorySubCategoryCreateSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            
            if not serializer.is_valid():
                return Response({
                    'status': 'error',
                    'message': 'Validation failed',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if sub-category already exists
            org_id = serializer.validated_data.get('organization')
            branch_id = serializer.validated_data.get('branch')
            category_id = serializer.validated_data.get('category')
            sub_category_name = serializer.validated_data.get('sub_category_name')
            
            if InventorySubCategory.objects.filter(
                organization=org_id,
                branch=branch_id,
                category=category_id,
                sub_category_name__iexact=sub_category_name
            ).exists():
                return Response({
                    'status': 'error',
                    'message': 'Sub-category with this name already exists for this category'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Save the sub-category
            sub_category = serializer.save()
            
            return Response({
                'status': 'success',
                'message': 'Inventory Sub-Category created successfully',
                'data': {
                    'sub_category_id': sub_category.sub_category_id,
                    'sub_category_name': sub_category.sub_category_name
                }
            }, status=status.HTTP_201_CREATED)
            
        except DatabaseError as e:
            return Response({
                'status': 'error',
                'message': f'Database error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class InventorySubCategoryListAPIView(generics.ListAPIView):
    """API View to list inventory sub-categories with optional category filter"""
    authentication_classes = []  # Disable authentication
    permission_classes = []  # Disable permissions
    serializer_class = InventorySubCategoryListSerializer

    def list(self, request, *args, **kwargs):
        try:
            org_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            category_id = request.query_params.get('category_id')
            
            if not org_id or not branch_id:
                return Response({
                    'status': 'error',
                    'message': 'organization_id and branch_id are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Base query
            queryset = InventorySubCategory.objects.filter(
                organization_id=org_id,
                branch_id=branch_id
            )
            
            # Filter by category if provided
            if category_id:
                queryset = queryset.filter(category_id=category_id)
            
            queryset = queryset.order_by('-created_at')
            
            serializer = self.get_serializer(queryset, many=True)
            
            return Response({
                'status': 'success',
                'message': 'Sub-categories retrieved successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class InventorySubCategoryUpdateAPIView(generics.UpdateAPIView):
    """API View to update an inventory sub-category"""
    authentication_classes = []  # Disable authentication
    permission_classes = []  # Disable permissions
    queryset = InventorySubCategory.objects.all()
    serializer_class = InventorySubCategoryUpdateSerializer
    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        try:
            sub_category_id = kwargs.get('pk')
            
            try:
                sub_category = InventorySubCategory.objects.get(sub_category_id=sub_category_id)
            except InventorySubCategory.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': 'Sub-category not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            serializer = self.get_serializer(sub_category, data=request.data, partial=True)
            
            if not serializer.is_valid():
                return Response({
                    'status': 'error',
                    'message': 'Validation failed',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check for duplicate name if category or name is being changed
            if 'category' in serializer.validated_data or 'sub_category_name' in serializer.validated_data:
                category_id = serializer.validated_data.get('category', sub_category.category)
                sub_category_name = serializer.validated_data.get('sub_category_name', sub_category.sub_category_name)
                
                duplicate = InventorySubCategory.objects.filter(
                    organization=sub_category.organization,
                    branch=sub_category.branch,
                    category=category_id,
                    sub_category_name__iexact=sub_category_name
                ).exclude(sub_category_id=sub_category_id)
                
                if duplicate.exists():
                    return Response({
                        'status': 'error',
                        'message': 'Sub-category with this name already exists for this category'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            
            return Response({
                'status': 'success',
                'message': 'Sub-category updated successfully',
                'data': InventorySubCategoryListSerializer(sub_category).data
            }, status=status.HTTP_200_OK)
            
        except DatabaseError as e:
            return Response({
                'status': 'error',
                'message': f'Database error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class InventorySubCategoryDeleteAPIView(APIView):
    """API View to delete an inventory sub-category"""
    authentication_classes = []  # Disable authentication
    permission_classes = []  # Disable permissions
    
    def delete(self, request, pk):
        try:
            sub_category = InventorySubCategory.objects.get(sub_category_id=pk)
            sub_category.delete()
            
            return Response({
                'status': 'success',
                'message': 'Sub-category deleted successfully'
            }, status=status.HTTP_200_OK)
            
        except InventorySubCategory.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Sub-category not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class InventoryItemCreateAPIView(generics.CreateAPIView):
    """API View to create a new inventory item"""
    authentication_classes = []  # Disable authentication
    permission_classes = []  # Disable permissions
    serializer_class = InventoryItemCreateSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            
            if not serializer.is_valid():
                return Response({
                    'status': 'error',
                    'message': 'Validation failed',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Save the inventory item
            item = serializer.save()
            
            return Response({
                'status': 'success',
                'message': 'Inventory Item created successfully',
                'data': {
                    'item_id': item.item_id,
                    'item_name': item.item_name
                }
            }, status=status.HTTP_201_CREATED)
            
        except DatabaseError as e:
            return Response({
                'status': 'error',
                'message': f'Database error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class InventoryItemListAPIView(generics.ListAPIView):
    """API View to list and search inventory items"""
    authentication_classes = []  # Disable authentication
    permission_classes = []  # Disable permissions
    serializer_class = InventoryItemListSerializer

    def list(self, request, *args, **kwargs):
        try:
            org_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            
            if not org_id or not branch_id:
                return Response({
                    'status': 'error',
                    'message': 'organization_id and branch_id are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Base query
            queryset = InventoryItem.objects.filter(
                organization_id=org_id,
                branch_id=branch_id
            )
            
            # Optional filters
            category_id = request.query_params.get('category_id')
            sub_category_id = request.query_params.get('sub_category_id')
            item_name = request.query_params.get('item_name')
            inventory_type = request.query_params.get('inventory_type')
            item_status = request.query_params.get('status')
            from_date = request.query_params.get('from_date')
            to_date = request.query_params.get('to_date')
            
            if category_id:
                queryset = queryset.filter(category_id=category_id)
            
            if sub_category_id:
                queryset = queryset.filter(sub_category_id=sub_category_id)
            
            if item_name:
                queryset = queryset.filter(item_name__icontains=item_name)
            
            if inventory_type:
                queryset = queryset.filter(inventory_type=inventory_type)
            
            if item_status:
                queryset = queryset.filter(status=item_status)
            
            if from_date:
                queryset = queryset.filter(purchase_date__gte=from_date)
            
            if to_date:
                queryset = queryset.filter(purchase_date__lte=to_date)
            
            queryset = queryset.order_by('-created_at')
            
            serializer = self.get_serializer(queryset, many=True)
            
            return Response({
                'status': 'success',
                'message': 'Inventory items retrieved successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class InventoryItemUpdateAPIView(generics.UpdateAPIView):
    """API View to update an inventory item"""
    authentication_classes = []  # Disable authentication
    permission_classes = []  # Disable permissions
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemUpdateSerializer
    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        try:
            item_id = kwargs.get('pk')
            
            try:
                item = InventoryItem.objects.get(item_id=item_id)
            except InventoryItem.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': 'Inventory item not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            serializer = self.get_serializer(item, data=request.data, partial=True)
            
            if not serializer.is_valid():
                return Response({
                    'status': 'error',
                    'message': 'Validation failed',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            
            return Response({
                'status': 'success',
                'message': 'Inventory item updated successfully',
                'data': InventoryItemListSerializer(item).data
            }, status=status.HTTP_200_OK)
            
        except DatabaseError as e:
            return Response({
                'status': 'error',
                'message': f'Database error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class InventoryItemDeleteAPIView(APIView):
    """API View to delete an inventory item"""
    authentication_classes = []  # Disable authentication
    permission_classes = []  # Disable permissions
    
    def delete(self, request, pk):
        try:
            item = InventoryItem.objects.get(item_id=pk)
            item.delete()
            
            return Response({
                'status': 'success',
                'message': 'Inventory item deleted successfully'
            }, status=status.HTTP_200_OK)
            
        except InventoryItem.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Inventory item not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

