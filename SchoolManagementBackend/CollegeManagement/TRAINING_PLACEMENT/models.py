from django.db import models

from Acadix.models import AcademicYear, Organization, Branch, Batch


# Create your models here.

# class SCH_TRAINING_PLACEMENT(models.Model):
#     companyname= models.CharField(max_length=250,null=False,blank=False)
#     module= models.CharField(max_length=250,null=False,blank=False)
#     duration = models.CharField(max_length=250,null=False,blank=False)
#     fromdate = models.DateField(null=False,blank=False)
#     todate = models.DateField(null=False,blank=False)
#     participants = models.IntegerField(null=True,blank=True)
#     HRName = models.CharField(max_length=255,null=True,blank=True)
#     academic_year_id = models.ForeignKey(Academic_Session_Year, on_delete=models.CASCADE)
#     org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
#     branch_id = models.ForeignKey(Branches, on_delete=models.CASCADE)
#
#     is_active = models.BooleanField(default=True)
#     created_by = models.PositiveIntegerField()
#     updated_by = models.PositiveIntegerField(null=True, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#
#     class Meta:
#         db_table = 'SCH_TRAINING_PLACEMENT'

# class TrainingPlacement(models.Model):
#     company_name= models.CharField(max_length=250,null=False,blank=False)
#     module= models.CharField(max_length=250,null=False,blank=False)
#     duration = models.CharField(max_length=250,null=False,blank=False)
#     from_date = models.DateField(null=False,blank=False)
#     to_date = models.DateField(null=False,blank=False)
#     participants = models.IntegerField(null=True,blank=True)
#     hr_name = models.CharField(max_length=255,null=True,blank=True)
#     academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
#     organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
#     branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
#     batch = models.ForeignKey(Batch, on_delete=models.CASCADE, null=True, blank=True)

#     is_active = models.BooleanField(default=True)
#     created_by = models.PositiveIntegerField()
#     updated_by = models.PositiveIntegerField(null=True, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return self.company_name

    # class Meta:
from django.db import models

from Acadix.models import AcademicYear, Organization, Branch, Batch


# Create your models here.

# class SCH_TRAINING_PLACEMENT(models.Model):
#     companyname= models.CharField(max_length=250,null=False,blank=False)
#     module= models.CharField(max_length=250,null=False,blank=False)
#     duration = models.CharField(max_length=250,null=False,blank=False)
#     fromdate = models.DateField(null=False,blank=False)
#     todate = models.DateField(null=False,blank=False)
#     participants = models.IntegerField(null=True,blank=True)
#     HRName = models.CharField(max_length=255,null=True,blank=True)
#     academic_year_id = models.ForeignKey(Academic_Session_Year, on_delete=models.CASCADE)
#     org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
#     branch_id = models.ForeignKey(Branches, on_delete=models.CASCADE)
#
#     is_active = models.BooleanField(default=True)
#     created_by = models.PositiveIntegerField()
#     updated_by = models.PositiveIntegerField(null=True, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#
#     class Meta:
#         db_table = 'SCH_TRAINING_PLACEMENT'

class TrainingPlacement(models.Model):
    company_name= models.CharField(max_length=250,null=False,blank=False)
    module= models.CharField(max_length=250,null=False,blank=False)
    duration = models.CharField(max_length=250,null=False,blank=False)
    from_date = models.DateField(null=False,blank=False)
    to_date = models.DateField(null=False,blank=False)
    participants = models.IntegerField(null=True,blank=True)
    hr_name = models.CharField(max_length=255,null=True,blank=True)

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, null=True, blank=True)
    
    # Add new fields for course, department, academic year, and semester
    course = models.ForeignKey('Acadix.Course', on_delete=models.CASCADE, null=True, blank=True)
    department = models.ForeignKey('Acadix.Department', on_delete=models.CASCADE, null=True, blank=True)
    academic_year = models.ForeignKey('Acadix.AcademicYear', on_delete=models.CASCADE, null=True, blank=True)
    semester = models.ForeignKey('Acadix.Semester', on_delete=models.CASCADE, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.company_name

    class Meta:
        db_table = 'TrainingPlacement'