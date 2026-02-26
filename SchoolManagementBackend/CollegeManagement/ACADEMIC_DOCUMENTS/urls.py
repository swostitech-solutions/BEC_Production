from django.urls import path

from . import views

urlpatterns = [
    # Generic document files API
    path(
        "api/Documents/files/",
        views.DocumentFileListCreateAPIView.as_view(),
        name="document-file-list-create",
    ),
    path(
        "api/Documents/files/<int:pk>/",
        views.DocumentFileRetrieveUpdateDestroyAPIView.as_view(),
        name="document-file-detail",
    ),
    path(
        "api/Documents/files/<int:pk>/restore/",
        views.DocumentFileRestoreAPIView.as_view(),
        name="document-file-restore",
    ),
    path(
        "api/Documents/files/<int:pk>/download/",
        views.DocumentFileDownloadAPIView.as_view(),
        name="document-file-download",
    ),
    # Document groups (admin / reporting)
    path(
        "api/Documents/groups/",
        views.DocumentGroupListAPIView.as_view(),
        name="document-group-list",
    ),
]

