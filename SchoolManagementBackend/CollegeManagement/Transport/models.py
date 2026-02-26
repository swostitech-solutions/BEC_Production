from django.db import models
from Acadix.models import *

class RouteMaster(models.Model):
    transport_name = models.CharField(max_length=100,null=False,blank=False)
    organization = models.ForeignKey(Organization,on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch,on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f'{self.transport_name}'


class PickupPoint(models.Model):
    pickup_point_name = models.CharField(max_length=100, null=False,blank=False)
    organization = models.ForeignKey(Organization,on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    # route_master = models.ForeignKey(RouteMaster, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=18, decimal_places=2,null=False,blank=False)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.pickup_point_name}'


class RouteDetail(models.Model):
    route_master = models.ForeignKey(RouteMaster,on_delete=models.CASCADE)
    pickup_point = models.ForeignKey(PickupPoint, on_delete=models.CASCADE)
    pickup_time = models.TimeField(null=False,blank=False)
    pickup_sequence = models.PositiveIntegerField(null=False,blank=False)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.route_master}'





