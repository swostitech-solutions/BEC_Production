from django.db import models

from Acadix.models import Course, Period, Organization, Branch, AcademicYear, Section, \
    EmployeeMaster, CourseDepartmentSubject, Department, Semester, Batch


# class SCH_CLASS_TERMS(models.Model):
#     CLASS_TERMS_ID = models.AutoField(primary_key=True, db_column='CLASS_TERMS_ID')
#     class_id = models.ForeignKey(Class,on_delete=models.CASCADE)
#     # term_id = models.ForeignKey(SCH_TERM_MASTER,on_delete=models.CASCADE)
#     Fees_Validation_Period = models.ForeignKey(Period,on_delete=models.SET_NULL,null=True,blank=True)
#     Term_Freeze = models.BooleanField(default=False)
#     org_id = models.ForeignKey(Organization,on_delete=models.CASCADE)
#     branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
#     academic_year_id = models.ForeignKey(AcademicYear,on_delete=models.CASCADE)
#     Allow_Entry = models.BooleanField(default=False)
#     Allow_View= models.BooleanField(default=False)
#     Allow_Parent_View = models.BooleanField(default=False)
#     TermMarks = models.IntegerField(null=True,blank=True)
#     is_active = models.BooleanField(default=True)
#     created_by = models.PositiveIntegerField()
#     updated_by = models.PositiveIntegerField(null=True, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#
#     class Meta:
#         db_table = 'SCH_CLASS_TERMS'


class SubjectTopic(models.Model):
    topic_id = models.AutoField(primary_key=True, db_column='topicId')
    topic_name = models.CharField(max_length=1000,null=False,blank=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    subject = models.ForeignKey(CourseDepartmentSubject, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'SubjectTopic'


class LecturePlan(models.Model):
    lecture_plan_id = models.AutoField(primary_key=True, db_column='lecture_plan_id')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department= models.ForeignKey(Department, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    professor = models.ForeignKey(EmployeeMaster, on_delete=models.CASCADE)
    subject = models.ForeignKey(CourseDepartmentSubject, on_delete=models.CASCADE)
    lecture_no= models.IntegerField(null=False,blank=False)
    module_no= models.CharField(max_length=100,null=True,blank=True)
    topic = models.ForeignKey(SubjectTopic,on_delete=models.CASCADE)
    proposed_date = models.DateField(null=True,blank=True)
    taught_date = models.DateField(null=True, blank=True)
    percentage_completed = models.CharField(max_length=100,null=True,blank=True)
    remarks = models.CharField(max_length=500,null=True,blank=True)
    document_file = models.CharField(max_length=255, null=True, blank=True)  # Stores file path/URL
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.lecture_plan_id)
    class Meta:
        db_table = 'LecturePlan'





