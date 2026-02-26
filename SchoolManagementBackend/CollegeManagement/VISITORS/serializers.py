import re

from django.core.validators import validate_email
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from VISITORS.models import Visitor


# class VisitorsCreateSerializer(serializers.Serializer):
#     academic_year_id= serializers.IntegerField(required=True,allow_null=False)
#     org_id= serializers.IntegerField(required=True,allow_null=False)
#     branch_id= serializers.IntegerField(required=True,allow_null=False)
#     visitor_name = serializers.CharField(max_length=100,required=True)
#     purpose_of_visit = serializers.CharField(max_length=100,required=True)
#     whomToVisit = serializers.CharField(max_length=100,required=True)
#     phone= serializers.CharField(max_length=10,required=False)
#     email = serializers.EmailField(allow_null=True,allow_blank=True,required=False)
#     VehicleNo = serializers.CharField(max_length=50,allow_null=True,allow_blank=True,required=False)
#     upload_file = serializers.FileField(required=False,allow_null=True,allow_empty_file=True)
#     visitDate = serializers.DateTimeField(required=False,allow_null=True)
#     # visitEndDate= serializers.DateTimeField(required=False,allow_null=True)
#     department = serializers.CharField(max_length=50,allow_null=True,allow_blank=True,required=False)
#     address = serializers.CharField(max_length=1000,required=True)
#     created_by = serializers.IntegerField(required=True,allow_null=False)

class VisitorCreateSerializer(serializers.ModelSerializer):
    upload_file = serializers.FileField(write_only=True, required=False)

    class Meta:
        model= Visitor
        fields = ['organization','branch','visitor_name','purpose_of_visit','whom_to_visit','phone','email','upload_file',
                   'vehicle_no','visit_date','department','address','created_by']

    def validate_phone(self, value):

        if value and not re.fullmatch(r'^\d{10}$', value):
            raise serializers.ValidationError("Phone number must be exactly 10 digits.")
        return value

    def validate_email(self, value):

        if value:
            try:
                validate_email(value)
            except ValidationError:
                raise serializers.ValidationError("Enter a valid email address.")
        return value

class VisitorSearchSerializer(serializers.Serializer):
    organization_id= serializers.IntegerField(required=True,allow_null=False)
    branch_id= serializers.IntegerField(required=True,allow_null=False)
    visitor_name = serializers.CharField(max_length=100,required=False)
    whom_to_visit = serializers.CharField(max_length=100, required=False)
    phone = serializers.CharField(max_length=10, required=False)
    from_date = serializers.DateField(required=False,allow_null=True)
    to_date = serializers.DateField(required=False, allow_null=True)

class VisitorUpdateSerializer(serializers.Serializer):
    out_time=serializers.DateTimeField(required=True,allow_null=False)

