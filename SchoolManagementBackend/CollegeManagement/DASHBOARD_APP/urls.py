from django.urls import path
from DASHBOARD_APP import views

urlpatterns = [

    path('api/AttendanceDashBoard/dashboard/',views.AttendanceDashBoardListAPIView.as_view(),name='AttendanceDashboard'),
    path('api/AttendanceDashBoard/dashboardBasedOnCourseSemesterSection/',views.AttendanceCourseSemesterSectionWiseListAPIView.as_view(),name='AttendanceDashboardBasedOnDependencyFilters'),
    path('api/FeesDashBoard/dashboard/',views.FeesDashboardListAPIView.as_view(),name='FeesDashboard'),
    path('api/FeesDashBoard/FeesCalculateBasedOnBatch/',views.FeesDuesListAPIView.as_view(),name='FeesDashBoardCalculate'),
    path('api/FeesDashBoard/FeesReceiptSearch/',views.FeesDuesSearchListAPIView.as_view(),name='FeesDueSearch'),

    path('api/LibraryDashBoard/dashboard/',views.LibraryDashBoardListAPIView.as_view(),name='LibraryDashBoard'),
    path('api/DashBoard/GetDashboardData/',views.GetDashBoardData.as_view(),name='GetDashBoard')

    ]