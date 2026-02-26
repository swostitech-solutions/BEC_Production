from django.db import models
from Acadix.models import Organization, Branch

# InventoryCategory,InventorySubCategory,InventoryItem,

class InventoryCategory(models.Model):
    category_id = models.AutoField(primary_key=True, db_column='category_id')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    category_name = models.CharField(max_length=100, null=False, blank=False)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'InventoryCategory'
        unique_together = ('organization', 'branch', 'category_name')


class InventorySubCategory(models.Model):
    sub_category_id = models.AutoField(primary_key=True, db_column='sub_category_id')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    category = models.ForeignKey(InventoryCategory, on_delete=models.CASCADE, related_name='subcategories')
    sub_category_name = models.CharField(max_length=100, null=False, blank=False)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'InventorySubCategory'
        unique_together = ('organization', 'branch', 'category', 'sub_category_name')


class InventoryItem(models.Model):
    INVENTORY_TYPE_CHOICES = [
        ('Consumable', 'Consumable'),
        ('Non-Consumable', 'Non-Consumable'),
        ('Asset', 'Asset'),
    ]
    
    STATUS_CHOICES = [
        ('Available', 'Available'),
        ('In Use', 'In Use'),
        ('Under Maintenance', 'Under Maintenance'),
        ('Damaged', 'Damaged'),
        ('Disposed', 'Disposed'),
    ]

    item_id = models.AutoField(primary_key=True, db_column='item_id')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    category = models.ForeignKey(InventoryCategory, on_delete=models.CASCADE, related_name='items')
    sub_category = models.ForeignKey(InventorySubCategory, on_delete=models.CASCADE, related_name='items')
    item_name = models.CharField(max_length=200, null=False, blank=False)
    item_value = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    quantity = models.IntegerField(default=0)
    inventory_type = models.CharField(max_length=50, choices=INVENTORY_TYPE_CHOICES, default='Consumable')
    status = models.CharField(max_length=50, null=True, blank=True)  # Note: Used to store Asset Code No (free text field)
    purchase_date = models.DateField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'InventoryItem'
