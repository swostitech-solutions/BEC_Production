from django.urls import path
from NON_TEACHING_STAFF import views

urlpatterns = [
    # Create non-teaching staff
    path('api/NON_TEACHING_STAFF/Create/',
         views.NonTeachingStaffCreateAPIView.as_view(),
         name='non-teaching-staff-create'),
    
    # List all non-teaching staff
    path('api/NON_TEACHING_STAFF/List/',
         views.NonTeachingStaffListAPIView.as_view(),
         name='non-teaching-staff-list'),
    
    # Get specific non-teaching staff details
    path('api/NON_TEACHING_STAFF/Details/<int:nts_id>/',
         views.NonTeachingStaffDetailAPIView.as_view(),
         name='non-teaching-staff-detail'),
    
    # Update non-teaching staff basic info
    path('api/NON_TEACHING_STAFF/Update/<int:nts_id>/',
         views.NonTeachingStaffUpdateAPIView.as_view(),
         name='non-teaching-staff-update'),
    
    # Update non-teaching staff address
    path('api/NON_TEACHING_STAFF/UpdateAddress/<int:nts_id>/',
         views.NonTeachingStaffAddressUpdateAPIView.as_view(),
         name='non-teaching-staff-address-update'),
    
    # Delete non-teaching staff (soft delete)
    path('api/NON_TEACHING_STAFF/Delete/<int:nts_id>/',
         views.NonTeachingStaffDeleteAPIView.as_view(),
         name='non-teaching-staff-delete'),
]
