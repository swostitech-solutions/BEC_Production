from django.urls import path
from . import views

urlpatterns = [
    path('api/MOU/Moucreate/', views.MouCreateAPIView.as_view(), name='mou_create'),
    path('api/MOU/MouDetailsList/<str:org_id>/<str:branch_id>/', views.MouDetailsListAPIView.as_view(), name='mou_list'),
    path('api/MOU/deleteMouDetails/<int:pk>/', views.MouDeleteAPIView.as_view(), name='mou_delete'),
]
