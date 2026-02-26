from django.urls import path
from INVENTORY import views

urlpatterns = [
    # Category endpoints
    path('api/Inventory/Category/create', views.InventoryCategoryCreateAPIView.as_view(), name='inventory-category-create'),
    path('api/Inventory/Category/list/', views.InventoryCategoryListAPIView.as_view(), name='inventory-category-list'),
    
    # Sub-category endpoints
    path('api/Inventory/SubCategory/create', views.InventorySubCategoryCreateAPIView.as_view(), name='inventory-subcategory-create'),
    path('api/Inventory/SubCategory/list/', views.InventorySubCategoryListAPIView.as_view(), name='inventory-subcategory-list'),
    path('api/Inventory/SubCategory/update/<int:pk>/', views.InventorySubCategoryUpdateAPIView.as_view(), name='inventory-subcategory-update'),
    path('api/Inventory/SubCategory/delete/<int:pk>/', views.InventorySubCategoryDeleteAPIView.as_view(), name='inventory-subcategory-delete'),
    
    # Inventory Item endpoints
    path('api/Inventory/Item/create', views.InventoryItemCreateAPIView.as_view(), name='inventory-item-create'),
    path('api/Inventory/Item/list/', views.InventoryItemListAPIView.as_view(), name='inventory-item-list'),
    path('api/Inventory/Item/update/<int:pk>/', views.InventoryItemUpdateAPIView.as_view(), name='inventory-item-update'),
    path('api/Inventory/Item/delete/<int:pk>/', views.InventoryItemDeleteAPIView.as_view(), name='inventory-item-delete'),
]
