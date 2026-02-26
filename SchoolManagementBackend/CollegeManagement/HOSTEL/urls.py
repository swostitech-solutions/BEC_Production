from django.urls import path


from HOSTEL import views


urlpatterns = [


    path('api/HOSTEL/GetHostelList/',views.GetHostelList.as_view(), name='GetHostelList'),
    path('api/HOSTEL/GetHostelBlockList/',views.GetHostelBlockList.as_view(), name='GetHostelBlockList'),
    path('api/HOSTEL/GetHostelBlockFloorList/',views.GetHostelBlockFloorList.as_view(), name='GetHostelBlockFloorList'),
    path('api/HOSTEL/GetHostelRoomTypeList/',views.GetHostelRoomTypeList.as_view(), name='GetHostelBlockFloorList'),
    path('api/HOSTEL/GetHostelRoomList/',views.GetHostelRoomList.as_view(), name='GetHostelBlockFloorList'),
    path('api/HOSTEL/GetHostelRoomBedList/',views.GetHostelRoomBedList.as_view(), name='GetHostelBlockFloorList'),


    path('api/HOSTEL/GetStudentHostelList/',views.GetStudentHostelListAPIView.as_view(), name='StudentHostelList'),
    path('api/HOSTEL/HostelDetailsRetrieveByStudent/',views.StudentHostelDetailsRetrieveAPIView.as_view(), name='GetHostelDetailsByStudent'),
    path('api/HOSTEL/UpdateStudentHostel/', views.UpdateHostelDetailsUpdateAPIView.as_view(),name='HostelDetailsUpdate'),

    path('api/HOSTEL/StudentHostelAssign/', views.AssignStudentHostelCreate_UpdateAPI.as_view(),name='StudentHostelAssign'),

    path('api/HOSTEL/HostelChargesCalculateBasedOnStudent/', views.StudentHostelFeesListAPIView.as_view(),
         name='HostelChargesCalculateList'),

    path('api/HOSTEL/HostelChargesCalculateBasedOnStudent_PDF/', views.StudentAllFeesCalculationBasedOnElement.as_view(),
         name='HostelChargesCalculate'),





    ]
