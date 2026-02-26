from django.urls import path

from VISITORS import views

urlpatterns = [
    path('api/Visitor/create',views.VisitorCreateAPIView.as_view(),name='visitorcreate'),
    path('api/Visitor/list/',views.VisitorSearchListAPIView.as_view(),name='visitorlist'),
    path('api/Visitor/update/',views.VisitorUpdateOutTimeUpdateAPIView.as_view(),name='visitorouttimeupdate'),
    path('api/Visitor/delete/<int:pk>/',views.VisitorDeleteAPIView.as_view(),name='visitordelete'),


    ]