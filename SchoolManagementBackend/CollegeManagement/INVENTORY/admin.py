from django.contrib import admin

# Register your models here.


from INVENTORY.models import InventoryCategory,InventorySubCategory,InventoryItem

admin.site.register(InventoryCategory)
admin.site.register(InventorySubCategory)
admin.site.register(InventoryItem)