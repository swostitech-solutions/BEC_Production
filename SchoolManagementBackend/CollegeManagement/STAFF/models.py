from django.db import models


from Acadix.models import EmployeeMaster, Department, Designation, StudentAssignment, Organization, Branch, \
    AcademicYear, Document, Course, Batch, Gender
from EXPENSE.models import PartyMaster


class EmployeeAssignment(models.Model):
    employee_assignment_id = models.AutoField(primary_key=True, db_column='employee_assignment_id')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)

    employee_master = models.ForeignKey(EmployeeMaster,on_delete=models.CASCADE)
    department = models.ForeignKey(Department,on_delete=models.CASCADE)
    designation = models.ForeignKey(Designation,on_delete=models.CASCADE)
    date_from = models.DateField(null=False,blank=False)
    date_to = models.DateField(null=False, blank=False)

    #assignment_id = models.ForeignKey(StudentAssignment, on_delete=models.CASCADE)  # need to confirm
    # nature_of_appointment = models.CharField(max_length=50,null=True,blank=True)
    # party_id = models.ForeignKey(PartyMaster,on_delete=models.SET_NULL,null=True,blank=True)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'EmployeeAssignment'


class EmployeeCourse(models.Model):

    employee_course_id = models.AutoField(primary_key=True, db_column='employee_course_id')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    # batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    # course = models.ForeignKey(Course, on_delete=models.CASCADE)
    # department = models.ForeignKey(Department, on_delete=models.CASCADE)
    employee = models.ForeignKey(EmployeeMaster, on_delete=models.CASCADE)
    # Is it needed
    # org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    # branch_id = models.ForeignKey(Branches, on_delete=models.CASCADE)
    # academic_year_id = models.ForeignKey(Academic_Session_Year, on_delete=models.CASCADE)



    course_name = models.CharField(max_length=200,null=False,blank=False)
    course_place = models.CharField(max_length=200,null=False,blank=False)
    date_from = models.DateField(null=False,blank=False)
    date_to = models.DateField(null=False,blank=False)
    valid_upto = models.DateField(null=True,blank=True)
    course_results = models.CharField(max_length=50,null=True)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'EmployeeCourse'


class EmployeeExperience(models.Model):
    employee_experience_id= models.AutoField(primary_key=True, db_column='employee_experience_id')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    # batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    # course = models.ForeignKey(Course, on_delete=models.CASCADE)
    # department = models.ForeignKey(Department, on_delete=models.CASCADE)
    employee = models.ForeignKey(EmployeeMaster, on_delete=models.CASCADE)
    previous_company_worked = models.CharField(max_length=100,null=False,blank=False)
    date_from = models.DateField(null=False,blank=False)
    date_to = models.DateField(null=False,blank=False)
    reason_for_leaving = models.CharField(max_length=500,null=False,blank=False)
    experience_letter_provided = models.BooleanField(null=False,blank=False)

    # org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    # branch_id = models.ForeignKey(Branches, on_delete=models.CASCADE)
    # academic_year_id = models.ForeignKey(Academic_Session_Year, on_delete=models.CASCADE)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'EmployeeExperience'


class EmployeeFamilyDetail(models.Model):
    family_detail_id = models.AutoField(primary_key=True, db_column='family_detail_id')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    # batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    # course = models.ForeignKey(Course, on_delete=models.CASCADE)
    # department = models.ForeignKey(Department, on_delete=models.CASCADE)
    employee = models.ForeignKey(EmployeeMaster, on_delete=models.CASCADE)
    employee_relation= models.CharField(max_length=50,null=False,blank=False)
    relation_title = models.CharField(max_length=50,null=False,blank=False)
    relation_first_name = models.CharField(max_length=100, null=False, blank=False)
    relation_middle_name = models.CharField(max_length=100, null=True, blank=True)
    relation_last_name = models.CharField(max_length=100, null=False, blank=False)
    relation_dob = models.DateField(null=False,blank=False)
    relation_gender = models.ForeignKey(Gender,on_delete=models.CASCADE,null=False,blank=False)
    relation_marital_status = models.CharField(max_length=50,null=False,blank=False)
    relation_employed = models.CharField(max_length=50,null=False,blank=False)
    relation_occupation = models.CharField(max_length=100,null=False,blank=False)
    relation_dependent = models.CharField(max_length=1,null=False,blank=False)
    relation_pf_nominee = models.CharField(max_length=1,null=False,blank=False)
    relation_pf_share = models.FloatField(default=0.0)

    # org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    # branch_id = models.ForeignKey(Branches, on_delete=models.CASCADE)
    # academic_year_id = models.ForeignKey(Academic_Session_Year, on_delete=models.CASCADE)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'EmployeeFamilyDetail'


class EmployeeLanguage(models.Model):
    employee_language_id = models.AutoField(primary_key=True, db_column='employee_language_id')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    # batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    # course = models.ForeignKey(Course, on_delete=models.CASCADE)
    # department = models.ForeignKey(Department, on_delete=models.CASCADE)
    employee = models.ForeignKey(EmployeeMaster,on_delete=models.CASCADE)
    language_code = models.CharField(max_length=200)

    # org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    # branch_id = models.ForeignKey(Branches, on_delete=models.CASCADE)
    # academic_year_id = models.ForeignKey(Academic_Session_Year, on_delete=models.CASCADE)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'EmployeeLanguage'


class EmployeeQualification(models.Model):
    employee_qualification_id = models.AutoField(primary_key=True, db_column='employee_qualification_id')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    # batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    # course = models.ForeignKey(Course, on_delete=models.CASCADE)
    # department = models.ForeignKey(Department, on_delete=models.CASCADE)
    employee = models.ForeignKey(EmployeeMaster, on_delete=models.CASCADE)
    qualification = models.CharField(max_length=50,null=False,blank=False)
    highest_qualification = models.CharField(max_length=50,null=False,blank=False)
    date_from = models.DateField(null=False,blank=False)
    date_to = models.DateField(null=False, blank=False)
    university= models.CharField(max_length=200,null=False,blank=False)
    institution = models.CharField(max_length=200,null=True,blank=True)
    marks = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)

    # org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    # branch_id = models.ForeignKey(Branches, on_delete=models.CASCADE)
    # academic_year_id = models.ForeignKey(Academic_Session_Year, on_delete=models.CASCADE)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'EmployeeQualification'

# class SCH_EMPLOYEE_TYPE(models.Model):
#     employee_type_id = models.AutoField(primary_key=True, db_column='employee_type_id')
#     employee_type = models.CharField(max_length=100,null=False,blank=False)
#     employee_type_desc = models.CharField(max_length=100, null=True, blank=True)
#     is_active = models.BooleanField(default=True)
#
#
#     class Meta:
#         db_table = 'SCH_EMPLOYEE_TYPE'

class EmployeeDocument(models.Model):
    document_id = models.AutoField(primary_key=True, db_column='document_id')
    employee = models.ForeignKey(EmployeeMaster, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    # batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    # course = models.ForeignKey(Course, on_delete=models.CASCADE)
    # department = models.ForeignKey(Department, on_delete=models.CASCADE)
    # org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    # branch_id = models.ForeignKey(Branches, on_delete=models.CASCADE)
    document_type = models.ForeignKey(Document,on_delete=models.CASCADE)
    document_number = models.CharField(max_length=50,null=False,blank=False)
    document_file = models.FileField(upload_to="employee_documents/",max_length=500,null=True,blank=True)
    document_path= models.CharField(max_length=1000, null=True, blank=True)
    valid_from = models.DateField(null=True,blank=True)
    valid_to = models.DateField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'EmployeeDocument'



