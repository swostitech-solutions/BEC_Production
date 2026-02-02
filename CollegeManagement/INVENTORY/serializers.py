from rest_framework import serializers
from INVENTORY.models import InventoryCategory, InventorySubCategory, InventoryItem


class InventoryCategoryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryCategory
        fields = ['organization', 'branch', 'category_name', 'created_by']


class InventoryCategoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryCategory
        fields = ['category_id', 'organization', 'branch', 'category_name', 'is_active', 
                  'created_by', 'created_at', 'updated_at']


class InventorySubCategoryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventorySubCategory
        fields = ['organization', 'branch', 'category', 'sub_category_name', 'is_active', 'created_by']


class InventorySubCategoryUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventorySubCategory
        fields = ['category', 'sub_category_name', 'is_active', 'updated_by']


class InventorySubCategoryListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.category_name', read_only=True)
    
    class Meta:
        model = InventorySubCategory
        fields = ['sub_category_id', 'organization', 'branch', 'category', 'category_name',
                  'sub_category_name', 'is_active', 'created_by', 'created_at', 'updated_at']


class InventoryItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = ['organization', 'branch', 'category', 'sub_category', 'item_name', 
                  'item_value', 'quantity', 'inventory_type', 'status', 'purchase_date', 
                  'description', 'created_by']


class InventoryItemUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = ['category', 'sub_category', 'item_name', 'item_value', 'quantity', 
                  'inventory_type', 'status', 'purchase_date', 'description', 
                  'is_active', 'updated_by']


class InventoryItemListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.category_name', read_only=True)
    sub_category_name = serializers.CharField(source='sub_category.sub_category_name', read_only=True)
    
    class Meta:
        model = InventoryItem
        fields = ['item_id', 'organization', 'branch', 'category', 'category_name',
                  'sub_category', 'sub_category_name', 'item_name', 'item_value', 
                  'quantity', 'inventory_type', 'status', 'purchase_date', 'description',
                  'is_active', 'created_by', 'created_at', 'updated_at']
