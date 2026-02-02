from django.urls import path
from GRIEVANCE import views
urlpatterns = [
    path('api/GrievanceType/list/',views.GetGrievanceTypeListAPIView.as_view(),name='GrievanceTypeList'),
    path('api/GrievancePriority/list/',views.GetGrievancePriorityListAPIView.as_view(),name='GrievancePriorityList'),
    path('api/GrievanceSeverity/list/',views.GetGrievanceSeverityListAPIView.as_view(),name='GrievanceSeverityList'),

    path('api/Grievance/create/',views.GrievanceCreateAPIView.as_view(),name='GrievanceCreate'),
    path('api/Grievance/listByStudent/',views.GrievanceDetailsByStudent.as_view(),name='GrievanceListByStudent'),
    path('api/Grievance/list/',views.GrievanceDetailsListAPIView.as_view(),name='GrievanceDetailsList'),

    path('api/Grievance/update/',views.GrievanceDetailsUpdateAPIView.as_view(),name='GrievanceActionTakenUpdate'),








    ]