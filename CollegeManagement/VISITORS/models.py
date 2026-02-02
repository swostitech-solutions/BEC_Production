from django.core.validators import RegexValidator
from django.db import models

from Acadix.models import Organization, Branch, Department


class Visitor(models.Model):
    visitor_id = models.AutoField(primary_key=True, db_column='visitor_id')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True)
    visitor_name= models.CharField(max_length=100,null=False,blank=False)
    purpose_of_visit = models.CharField(max_length=100,null=False,blank=False)
    whom_to_visit = models.CharField(max_length=100,null=False,blank=False)
    phone = models.CharField(max_length=10, null=True, blank=True, validators=[
        RegexValidator(
            regex=r'^\d{10}$',
            message="contact number must be exactly 10 digits."
        )
    ])
    email = models.EmailField(null=True, blank=True)
    vehicle_no = models.CharField(max_length=50,null=True,blank=True)
    photo_file = models.FileField(upload_to='visitors_image/', null=True,blank=True)
    photo_path = models.CharField(max_length=250,null=True,blank=True)
    visit_date = models.DateTimeField(null=True,blank=True)
    visit_end_date = models.DateTimeField(null=True,blank=True)

    address = models.CharField(max_length=1000,null=False,blank=False)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Visitor'