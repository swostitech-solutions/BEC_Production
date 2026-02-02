
from django.contrib import admin

from Transport.models import RouteMaster,PickupPoint,RouteDetail

admin.site.register(RouteMaster)
admin.site.register(PickupPoint)
admin.site.register(RouteDetail)
