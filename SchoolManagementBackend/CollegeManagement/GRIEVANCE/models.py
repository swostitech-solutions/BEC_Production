from django.db import models

from Acadix.models import Organization, Batch, Branch, AcademicYear, Department, Course, Semester, Section, \
    StudentCourse, StudentRegistration


# Create your models here.

class GrievanceType(models.Model):
    # grievance_type_id= models.AutoField(primary_key=True, db_column='giv_id')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    grievance_type_code= models.CharField(max_length=255,null=False,blank=False)
    grievance_type_description = models.CharField(max_length=255,null=True,blank=True)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "GrievanceType"

class GrievancePriority(models.Model):
    # GP_id = models.AutoField(primary_key=True, db_column='GP_id')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    priority_type = models.CharField(max_length=255, null=False, blank=False)
    priority_type_description = models.CharField(max_length=255, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "GrievancePriority"


class GrievanceSeverity(models.Model):
    # Sev_id = models.AutoField(primary_key=True, db_column='Sev_id')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    severity_type = models.CharField(max_length=255, null=False, blank=False)
    severity_type_description = models.CharField(max_length=255, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "GrievanceSeverity"

class Grievance(models.Model):
    # Grievance_id = models.AutoField(primary_key=True, db_column='Grievance_id')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    student_course = models.ForeignKey(StudentCourse, on_delete=models.CASCADE, null=True)
    grievance_number = models.BigIntegerField(null=False,blank=False)
    grievance_type = models.ForeignKey(GrievanceType,on_delete=models.CASCADE)
    grievance_priority = models.ForeignKey(GrievancePriority, on_delete=models.CASCADE)
    grievance_severity = models.ForeignKey(GrievanceSeverity, on_delete=models.CASCADE)
    details = models.CharField(max_length=5000,null=False,blank=False)
    status = models.BooleanField(default=True) # is it work like Action open or close
    anonymous = models.BooleanField(default=False)
    action_taken= models.CharField(max_length=5000,null=True,blank=True)  # Get message like remarks
    action_taken_by = models.PositiveIntegerField(null=True,blank=True)   # Get User which is take reply
    action_taken_date_time = models.DateTimeField(null=True,blank=True)
    doc_name = models.CharField(max_length=100,null=True,blank=True)
    doc_file = models.FileField(upload_to='grievance_documents/',null=True, blank=True)
    doc_path = models.CharField(max_length=255,null=True,blank=True)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    # created_by = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE, null=True, blank=True )
    # updated_by = models.PositiveIntegerField(null=True, blank=True)
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "Grievance"

