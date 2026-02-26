"""
URL configuration for Swostitech_Acadix project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('Acadix.urls')),
    path('',include('Transport.urls')),
    path('',include('Library.urls')),
    path('',include('EXPENSE.urls')),
    path('',include('HOSTEL.urls')),
    # path('',include('MOU.urls')),
    path('',include('TRAINING_PLACEMENT.urls')),
    path('',include('ACADEMIC_DOCUMENTS.urls')),
    # path('',include('HOSTEL.urls')),
    path('',include('MOU.urls')),
    path('',include('TRAINING_PLACEMENT.urls')),
    # path('',include('ACADEMIC_DOCUMENTS.urls')),
    path('',include('GRIEVANCE.urls')),
    path('',include('MENTOR.urls')),
    path('',include('TIME_TABLE.urls')),
    path('',include('VISITORS.urls')),
    path('',include('DASHBOARD_APP.urls')),
    path('',include('STAFF.urls')),
    path('',include('REPORT_CARD.urls')),
    # path('',include('REPORT_CARD.urls')),
    path('',include('INVENTORY.urls')),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh')  # refresh
]
from django.conf import settings
from django.conf.urls.static import static

# Serve media files in development
# Serve media files (Enabled for production to fix 404 on Render)
from django.urls import re_path
from django.views.static import serve

# Serve media files manually to ensure they work in production (DEBUG=False)
urlpatterns += [
    re_path(r'^SWOSTITECH_CMS/(?P<path>.*)$', serve, {
        'document_root': settings.MEDIA_ROOT,
    }),
]