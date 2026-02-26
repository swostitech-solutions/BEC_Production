from django.db import models
from django.core.validators import RegexValidator

from Acadix.models import (
    Organization,
    Branch,
    Gender,
    Blood,
    Nationality,
    Religion,
    City,
    State,
    Country
)


class NonTeachingStaffMaster(models.Model):
    """
    Non-Teaching Staff Master table - Minimal fields for administrative staff
    Completely independent from EmployeeMaster (Teaching Staff)
    """
    nts_id = models.AutoField(primary_key=True, db_column='nts_id')
    
    # Organization info
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    
    # Basic Information
    staff_code = models.CharField(max_length=50, unique=True, null=False, blank=False)
    title = models.CharField(max_length=10, null=False, blank=False)  # Mr/Mrs/Ms/Dr
    first_name = models.CharField(max_length=50, null=False, blank=False)
    middle_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    date_of_birth = models.DateField(null=False, blank=False)
    place_of_birth = models.CharField(max_length=100, null=True, blank=True)
    marital_status = models.CharField(max_length=20, null=True, blank=True)
    gender = models.ForeignKey(Gender, on_delete=models.CASCADE, null=False, blank=False)
    
    # Contact Information
    phone_number = models.CharField(
        max_length=10,
        validators=[RegexValidator(regex=r'^\d{10}$', message='Phone number must be exactly 10 digits')],
        null=False,
        blank=False
    )
    email = models.EmailField(max_length=100, null=True, blank=True)
    official_email = models.EmailField(max_length=100, null=True, blank=True)
    emergency_contact_number = models.CharField(max_length=10, null=True, blank=True)
    
    # Additional Info
    blood_group = models.ForeignKey(Blood, on_delete=models.CASCADE, null=True, blank=True)
    nationality = models.ForeignKey(Nationality, on_delete=models.CASCADE, null=True, blank=True)
    religion = models.ForeignKey(Religion, on_delete=models.CASCADE, null=True, blank=True)
    date_of_joining = models.DateField(null=False, blank=False)
    date_of_leaving = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, null=False, blank=False, default='Active')  # Active/Inactive
    profile_pic = models.FileField(upload_to='non_teaching_staff_pics/', max_length=255, null=True, blank=True)
    profile_photo_path = models.CharField(max_length=1000, null=True, blank=True)
    
    # Address Information
    address_line1 = models.CharField(max_length=255, null=True, blank=True)
    address_line2 = models.CharField(max_length=255, null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=True, blank=True)
    state = models.ForeignKey(State, on_delete=models.CASCADE, null=True, blank=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, null=True, blank=True)
    pincode = models.CharField(
        max_length=6,
        validators=[RegexValidator(regex=r'^\d{6}$', message='Pincode must be exactly 6 digits')],
        null=True,
        blank=True
    )
    
    # Audit fields
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'NonTeachingStaffMaster'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['organization', 'branch', 'status']),
            models.Index(fields=['staff_code']),
        ]

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.staff_code})"

    @property
    def full_name(self):
        """Returns full name of non-teaching staff"""
        parts = [self.first_name]
        if self.middle_name:
            parts.append(self.middle_name)
        if self.last_name:
            parts.append(self.last_name)
        return " ".join(parts)

    @property
    def full_address(self):
        """Returns formatted full address"""
        address_parts = []
        if self.address_line1:
            address_parts.append(self.address_line1)
        if self.address_line2:
            address_parts.append(self.address_line2)
        if self.city:
            address_parts.append(self.city.city_name)
        if self.state:
            address_parts.append(self.state.state_name)
        if self.country:
            address_parts.append(self.country.country_name)
        if self.pincode:
            address_parts.append(self.pincode)
        return ", ".join(address_parts)
