from django.urls import path


from TRAINING_PLACEMENT import views

urlpatterns = [
    path('api/TrainingPlacement/create/', views.TrainingPlacementCreateAPIView.as_view(), name='Training_PlacementCreate'),
    path('api/TrainingPlacement/List/', views.TrainingPlacementListAPIView.as_view(), name='Training_PlacementList'),
    path('api/TrainingPlacement/Retrieve/', views.TrainingPlacementRetrieveAPIView.as_view(),name='Training_PlacementRetrieve'),
    path('api/TrainingPlacement/Update/',views.TrainingPlacementUpdateAPIView.as_view(),name='Training_PlacementUpdate'),
    path('api/TrainingPlacement/Delete/', views.TrainingPlacementDeleteView.as_view(), name='Training_Placementdelete'),

]