from django.urls import path


from Transport import views


urlpatterns = [

    path('api/Transport/routemastercreate/',views.RouteMasterCreateAPIView.as_view(),name='routemasternameAdd'),
    path('api/Transport/routemasterlist/',views.RouteMasterListAPIView.as_view(),name='routemasterlist'),
    path('api/Transport/routemasterupdate/<int:pk>',views.RouteMasterUpdateAPIView.as_view(),name='RoutemasterUpdate'),
    path('api/Transport/routemasterdelete/<int:pk>',views.RouteMasterDestroyAPIView.as_view(),name='Routemasterdelete'),

    path('api/PICKUP_POINT/pickuppointcreate/',views.PickUpPointCreateAPIView.as_view(),name='pickuppointAdd'),
    path('api/PICKUP_POINT/pickuppointlist/',views.PickUpPointListAPIView.as_view(),name='pickuppointlist'),
    path('api/PICKUP_POINT/pickuppointupdate/<int:pk>',views.PickUpPointUpdateAPIView.as_view(),name='PickupPointUpdate'),
    path('api/PICKUP_POINT/pickuppointdelete/<int:pk>',views.PickUpPointDestroyAPIView.as_view(),name='PickupPointdelete'),

    path('api/PICKUP_POINT_Add_On_Route/PickUpPointAddOnRouteCreate/',views.RouteDetailsCreateAPIView.as_view(),name='pickuppointAddonroute'),
    path('api/PICKUP_POINT_Add_On_Route/PickUpPointAddOnRoutelist/',views.RouteDetailsListAPIView.as_view(),name='pickuppointlist'),
    path('api/PICKUP_POINT_Add_On_Route/PickUpPointAddOnRouteupdate/<int:pk>', views.RouteDetailsUpdateAPIView.as_view(),name='RouteDetailsUpdate'),
    path('api/PICKUP_POINT_Add_On_Route/PickUpPointAddOnRoutedelete/<int:pk>', views.RouteDetailsDestroyAPIView.as_view(),name='RouteDetailsdelete'),

    path('api/Transport/GetAllPickupPointBasedOnRoute/',views.GetPickupPointBasedOnRouteMaster.as_view(), name='findpickuppointlist'),

    path('api/Transport/GetAllRouteBasedOnOrganizationBranch/',views.GetFilterRouteBasedOnOrganizationBranch.as_view(), name='findRoutelist'),

    path('api/Transport/GetStudentTransportList/',views.GetStudentTransportListAPIView.as_view(), name='StudentTransportList'),

    path('api/Transport/UpdateStudentTransport/',views.UpdateTransportDetailsUpdateAPIView.as_view(), name='UpdateStudentTransport'),

    path('api/Transport/TransportDetailsRetereiveByStudent/',views.StudentTransportDetailsRetriveAPIView.as_view(), name='GetTransportDetailsByStudent'),

    path('api/Transport/TransportChargesCalculateBasedOnStudent/', views.StudentTransportFeesListAPIView.as_view(),
         name='TransportChargesCalculate'),

    path('api/Transport/MonthlyElemetWiseStudentFees/', views.StudentAllFeesCalculationBasedOnElement.as_view(),
         name='MonthlyElemetWiseStudentFees'),



    ]