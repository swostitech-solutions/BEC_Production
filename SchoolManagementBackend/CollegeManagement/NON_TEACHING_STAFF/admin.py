from django.contrib import admin
from NON_TEACHING_STAFF.models import NonTeachingStaffMaster


@admin.register(NonTeachingStaffMaster)
class NonTeachingStaffMasterAdmin(admin.ModelAdmin):
    list_display = [
        'nts_id', 'staff_code', 'full_name', 'phone_number',
        'email', 'status', 'date_of_joining', 'organization', 'branch'
    ]
    list_filter = ['status', 'organization', 'branch', 'gender']
    search_fields = ['staff_code', 'first_name', 'last_name', 'phone_number', 'email']
    readonly_fields = ['nts_id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('organization', 'branch', 'staff_code', 'title', 'first_name',
                      'middle_name', 'last_name', 'date_of_birth', 'gender')
        }),
        ('Contact Information', {
            'fields': ('phone_number', 'email')
        }),
        ('Employment Details', {
            'fields': ('date_of_joining', 'date_of_leaving', 'status', 'blood_group',
                      'profile_pic', 'profile_photo_path')
        }),
        ('Address Information', {
            'fields': ('address_line1', 'address_line2', 'city', 'state', 'country', 'pincode')
        }),
        ('Audit Information', {
            'fields': ('is_active', 'created_by', 'updated_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
