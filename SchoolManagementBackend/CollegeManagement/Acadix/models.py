# from datetime import timezone

from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator, RegexValidator
from django.db import models
# from rest_framework.utils import timezone
from django.utils import timezone
from datetime import timedelta

# from django.utils import timezone


# from TIME_TABLE.models import SCH_CLASS_TERMS
# Create your models here.

class Organization(models.Model):   # done
    organization_code= models.CharField(max_length=10,null=False,blank=False)
    organization_description= models.CharField(max_length=255,null=False,blank=False)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.organization_code

class Branch(models.Model):    # done
    organization = models.ForeignKey(Organization,models.CASCADE)
    branch_code = models.CharField(max_length=255,null=False,blank=False)
    branch_name = models.CharField(max_length=255,null=False,blank=False)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.branch_name

class Address(models.Model):
    reference_id = models.PositiveIntegerField(null=False, blank=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, default=1)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1)
    usertype = models.CharField(max_length=100, null=False, blank=False)
    present_address = models.CharField(max_length=250, null=False, blank=False)
    present_pincode = models.CharField(
        max_length=6,
        validators=[RegexValidator(regex=r'^\d{6}$', message='Pincode must be exactly 6 digits')],
        null=False,
        blank=False
    )
    present_city = models.CharField(max_length=200, null=False, blank=False)
    present_state = models.CharField(max_length=200, null=False, blank=False)
    present_country = models.CharField(max_length=200, null=False, blank=False)
    present_phone_number = models.CharField(
        max_length=10,
        validators=[RegexValidator(regex=r'^\d{10}$', message='Phone number must be exactly 10 digits')],
        null=True,
        blank=True
    )

    permanent_address = models.CharField(max_length=250, null=False, blank=False)
    permanent_pincode = models.CharField(
        max_length=6,
        validators=[RegexValidator(regex=r'^\d{6}$', message='Pincode must be exactly 6 digits')],
        null=False,
        blank=False
    )
    permanent_city = models.CharField(max_length=200, null=False, blank=False)
    permanent_state = models.CharField(max_length=200, null=False, blank=False)
    permanent_country = models.CharField(max_length=200, null=False, blank=False)
    permanent_phone_number = models.CharField(
        max_length=10,
        validators=[RegexValidator(regex=r'^\d{10}$', message='Phone number must be exactly 10 digits')],
        null=True,
        blank=True
    )

    # Meta fields
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class House(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1)
    house_code = models.CharField(max_length=10, unique=True)  # e.g., 'Blue', 'Pink', 'Yellow'
    house_name = models.CharField(max_length=50, unique=True)  # e.g., 'Ganga', 'kaveri', 'Mahanadi'
    house_color = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.house_name


class Religion(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1)
    religion_code = models.CharField(max_length=10, unique=True)  # e.g., 'Hindu', 'Muslim', 'Sikh'
    religion_name = models.CharField(max_length=50, unique=True)  # e.g., 'Hindu', 'Muslim', 'Sikh'
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.religion_name


class Gender(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1)
    gender_code = models.CharField(max_length=10, unique=True)  # e.g., 'M', 'F', 'O'
    gender_name = models.CharField(max_length=50, unique=True)  # e.g., 'Male', 'Female', 'Other'
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.gender_name


class Blood(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1)
    blood_code = models.CharField(max_length=10, unique=True)  # e.g., 'A+', 'B+', 'O+'
    blood_name = models.CharField(max_length=50, unique=True)  # e.g., 'A+', 'A+', 'A+'
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.blood_name


class MotherTongue(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1)
    mother_tongue_code = models.CharField(max_length=10, unique=True)  # e.g., 'Hin', 'Eng', 'Urd'
    mother_tongue_name = models.CharField(max_length=50, unique=True)  # e.g., 'Hindi', 'English', 'Urdu'
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.mother_tongue_name


class Category(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1)
    category_code = models.CharField(max_length=10, unique=True)  # e.g., 'Gen', 'OBC', 'SC'
    category_name = models.CharField(max_length=50,unique=True)  # e.g., 'General', 'Other Backward Classes', 'Scheduled Caste'
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.category_name


class Nationality(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1)
    nationality_code = models.CharField(max_length=10, unique=True)  # e.g., 'IND', 'USA', 'AUS'
    nationality_name = models.CharField(max_length=50, unique=True)  # e.g., 'Indian', 'American', 'Australian'
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nationality_name


class Country(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1)
    country_code = models.CharField(max_length=10, unique=True)  # e.g., 'IND', 'USA', 'AUS'
    country_name = models.CharField(max_length=50, unique=True)  # e.g., 'India', 'America', 'Australia'
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.country_name


class State(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1)
    state_code = models.CharField(max_length=10, unique=True)  # e.g., 'DEL', 'BOM', 'BLR'
    state_name = models.CharField(max_length=50, unique=True)  # e.g., 'Delhi', 'Mumbai', 'Bangalore'
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.state_name


class City(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1)
    city_code = models.CharField(max_length=50, unique=True)
    city_name = models.CharField(max_length=50, unique=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.city_name



class Batch(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1)
    batch_code = models.CharField(max_length=50, null=False, blank=False)
    batch_description = models.CharField(max_length=50, null=True, blank=True)
    date_from = models.DateField()
    date_to = models.DateField()

    # course = models.ForeignKey(Course, on_delete=models.CASCADE)
    # department = models.ForeignKey(Department, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.batch_code}, {self.organization}'

class Course(models.Model):   # done
    organization = models.ForeignKey("Organization", on_delete=models.CASCADE, related_name="courses", null=True)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1)
    course_code = models.CharField(max_length=20)
    course_name = models.CharField(max_length=20,null=False)
    description = models.CharField(max_length=250,null=True)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    duration_years = models.PositiveIntegerField(null=False)  # e.g., 3 years
    total_semesters = models.PositiveIntegerField(null=False)  # e.g., 6 semesters
    is_active = models.BooleanField(default=False)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['batch', 'course_code']

    def __str__(self):
        return self.course_name

class Department(models.Model):    # done
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1)
    department_code = models.CharField(max_length=20,null=False,blank=False)
    department_description = models.CharField(max_length=255,null=False,blank=False)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    hod_name = models.CharField(max_length=100)
    office_contact = models.CharField(max_length=15)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.department_description

class AcademicYear(models.Model):   # done
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    academic_year_code = models.CharField(max_length=50,null=False,blank=False)
    academic_year_description = models.CharField(max_length=50, null=True, blank=True)
    date_from = models.DateField()
    date_to = models.DateField()
    display_order = models.IntegerField(default=0)  # For sorting academic years properly

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.batch.batch_code},{self.course.course_code},{self.department.department_code},{self.academic_year_code}'


class Semester(models.Model):   # done
    organization = models.ForeignKey(Organization, models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1)
    semester_code= models.CharField(max_length=20,null=False)
    semester_description= models.CharField(max_length=250,null=True)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    date_from = models.DateTimeField(null=True,blank=True)
    date_to = models.DateTimeField(null=True,blank=True)
    display_order = models.IntegerField(default=0)  # For sorting semesters properly
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.semester_code


class Section(models.Model):   # done
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1)
    section_code = models.CharField(max_length=20, null=False)
    section_name= models.CharField(max_length=20,null=False)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.section_name


class CourseSemesterSectionBind(models.Model):   # done
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.course.course_name}-{self.section.section_name}'



class Lecture(models.Model):
    # lecture_code = models.CharField(max_length=20,null=False,blank=False)
    lecture_name = models.CharField(max_length=20,null=False,blank=False)
    lecture_description = models.CharField(max_length=50,null=True,blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, null=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, null=True)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, null=True)
    section = models.ForeignKey(Section, on_delete=models.CASCADE, null=True)
    time_from = models.TimeField(null=True, blank=True)
    time_to = models.TimeField(null=True, blank=True)
    day_attendance = models.CharField(max_length=1, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.lecture_name} - {self.lecture_description}"


class LecturePeriod(models.Model):

    lecture_period_name = models.CharField(max_length=20,null=False,blank=False)
    lecture_period_description = models.CharField(max_length=50,null=True,blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    time_from = models.TimeField(null=True, blank=True)
    time_to = models.TimeField(null=True, blank=True)
    day_attendance = models.CharField(max_length=1, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.lecture_period_name} - {self.lecture_period_description}"



class CourseDepartmentSubject(models.Model):
    subject_code = models.CharField(max_length=50, null=False, blank=False)
    subject_description = models.CharField(max_length=200, null=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    grade_marks = models.CharField(max_length=1, null=True, blank=True)
    change_font = models.BooleanField(null=False, blank=False)  # flag
    is_active = models.BooleanField(default=True)
    is_extra = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.subject_code}'


class EmployeeType(models.Model):
    # id = models.AutoField(primary_key=True, db_column='employee_type_id')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    employee_type_code = models.CharField(max_length=100,null=False,blank=False)
    employee_type_description = models.CharField(max_length=100, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'EmployeeType'

    def __str__(self):
        return self.employee_type_description


class Designation(models.Model):
    designation_name = models.CharField(max_length=50, null=False, blank=False)
    designation_description = models.CharField(max_length=200, null=True, blank=True)
    enabled = models.CharField(max_length=1, null=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.designation_description

    class Meta:
        db_table = 'Designation'

# organization,branch,department,designation,employee_code,title,first_name,middle_name,last_name,date_of_birth,marital_status,gender,nationality,religion,
# email,phone_number,office_email,employee_type,date_of_joining,date_of_leaving,payroll_group,place_of_birth,blood_group,highest_qualification,emergency_contact_number
# mother_tongue, status,profile_photo_path,is_active,created_by,created_at,updated_at
class EmployeeMaster(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    # department = models.ForeignKey(Department, on_delete=models.CASCADE)
    designation = models.ForeignKey(Designation, on_delete=models.CASCADE,default=1)  # NOT iN fRONTEND
    employee_code = models.CharField(max_length=50,null=False,blank=False)
    nuid = models.CharField(max_length=50, null=True, blank=True)
    title = models.CharField(max_length=10,null=False,blank=False)
    first_name = models.CharField(max_length=50,null=False,blank=False)
    middle_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    date_of_birth = models.DateField(null=False,blank=False)
    marital_status = models.CharField(max_length=50,null=False,blank=False)
    gender = models.ForeignKey(Gender, on_delete=models.CASCADE,null=False,blank=False)
    nationality = models.ForeignKey(Nationality,on_delete=models.CASCADE)
    religion = models.ForeignKey(Religion,on_delete=models.CASCADE)
    email= models.EmailField(max_length=100, null=True, blank=True)
    phone_number = models.CharField(
        max_length=10,
        validators=[RegexValidator(regex=r'^\d{10}$', message='Phone number must be exactly 10 digits')],
        null=False,
        blank=False
    )
    office_email = models.EmailField(max_length=100, null=True, blank=True)
    employee_type = models.ForeignKey(EmployeeType,on_delete=models.CASCADE)
    date_of_joining = models.DateField(null=False,blank=False)
    date_of_leaving = models.DateField(null=True, blank=True)
    payroll_group = models.CharField(max_length=50, null=True, blank=True)
    place_of_birth = models.CharField(max_length=50, null=True, blank=True)
    blood_group = models.ForeignKey(Blood,on_delete=models.CASCADE)
    highest_qualification = models.CharField(max_length=200, null=True, blank=True)
    emergency_contact_number = models.CharField(
        max_length=10,
        validators=[RegexValidator(regex=r'^\d{10}$', message='Phone number must be exactly 10 digits')],
        null=True,
        blank=True
    )
    mother_tongue = models.ForeignKey(MotherTongue,on_delete=models.CASCADE)
    status = models.CharField(max_length=20,null=False,blank=False)
    profile_pic = models.FileField(upload_to='employee_master_pic/', max_length=255,null=True, blank=True)
    profile_photo_path= models.CharField(max_length=1000, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.employee_code})"


class TimeTable(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch =  models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch =  models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    lecture_period = models.ForeignKey(LecturePeriod, on_delete=models.CASCADE, db_column='lecture_id')
    # lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    professor = models.ForeignKey(EmployeeMaster, on_delete=models.CASCADE)
    subject = models.ForeignKey(CourseDepartmentSubject, on_delete=models.CASCADE)
    enabled = models.CharField(max_length=1, null=False, blank=False)
    schedule_day = models.CharField(max_length=15)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Day: {self.schedule_day}"


class StudentRegistration(models.Model):
    first_name = models.CharField(max_length=100, null=False)
    middle_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    admission_type = models.CharField(max_length=50, null=False, default='Regular')
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    # Made optional for flexible student registration
    date_of_admission = models.DateField(null=True, blank=True)
    date_of_join = models.DateField(null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    college_admission_no = models.CharField(max_length=20, null=True, blank=True)
    religion = models.ForeignKey(Religion, on_delete=models.CASCADE, null=True, blank=True)
    gender = models.ForeignKey(Gender, on_delete=models.CASCADE, null=True, blank=True)
    nationality = models.ForeignKey(Nationality, on_delete=models.CASCADE, null=True, blank=True)
    house = models.ForeignKey(House, on_delete=models.CASCADE, null=True, blank=True, default=None)
    contact_no = models.CharField(max_length=10, null=True)
    blood = models.ForeignKey(Blood, on_delete=models.CASCADE, null=True, blank=True)
    enrollment_no = models.CharField(max_length=20, null=True)
    barcode = models.CharField(max_length=20, null=True)
    admission_no = models.CharField(max_length=20, null=True, blank=True)
    registration_no = models.CharField(max_length=20, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    mother_tongue = models.ForeignKey(MotherTongue, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=20,default='ACTIVE', null=False, blank=False)
    email = models.EmailField(unique=False, null=True, blank=True)
    children_in_family = models.CharField(max_length=10, null=True)
    student_aadhaar_no = models.CharField(max_length=12, null=True)
    user_name = models.CharField(max_length=30, null=True)
    remarks = models.CharField(max_length=50, null=True)
    referred_by = models.CharField(max_length=200, null=True, blank=True)
    # fee_group = models.ForeignKey(FeeStructureMaster, on_delete=models.CASCADE)
    # fee_applied_from = models.ForeignKey(Period, on_delete=models.CASCADE)
    father_name = models.CharField(max_length=200, null=True, blank=True)
    mother_name = models.CharField(max_length=200, null=True, blank=True)
    mother_aadhaar_no = models.CharField(max_length=12,null=True,blank=True,validators=[
        RegexValidator(regex=r'^\d{12}$', message='Aadhaar number must be exactly 12 digits.',
                       code='invalid_aadhaar_no'
                       )
    ])
    mother_profession = models.CharField(max_length=50, null=True, blank=True)
    mother_contact_number = models.CharField(max_length=12, null=True, blank=True,validators=[
        RegexValidator(
            regex=r'^\d{10}$',
            message="father contact number must be exactly 10 digits."
        )
    ])
    mother_email = models.EmailField(max_length=244, null=True, blank=True)
    father_aadhaar_no = models.CharField(max_length=12, null=True,blank=True,validators=[
        RegexValidator(regex=r'^\d{12}$', message='Aadhaar number must be exactly 12 digits.',
                       code='invalid_aadhaar_no'
                       )
    ])
    father_profession = models.CharField(max_length=50, null=True, blank=True)
    father_contact_number = models.CharField(max_length=10, null=True, blank=True,validators=[
        RegexValidator(
            regex=r'^\d{10}$',
            message="father contact number must be exactly 10 digits."
        )
    ])
    father_email = models.EmailField(max_length=244, null=True, blank=True)
    primary_guardian = models.CharField(max_length=255, default="FATHER", null=True, blank=True)
    profile_pic = models.FileField(upload_to='profile_pic/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.first_name}-{self.course}'


class Attendance(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    subject = models.ForeignKey(CourseDepartmentSubject, on_delete=models.CASCADE)
    lecture_period = models.ForeignKey(LecturePeriod, on_delete=models.CASCADE, null=True)
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE, null=True)

    professor = models.ForeignKey(EmployeeMaster, on_delete=models.CASCADE)
    attendance_date = models.DateField()
    student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    present = models.CharField(max_length=1, null=False, blank=False)
    remarks = models.CharField(max_length=100, null=True, blank=True)

    father_contact_number = models.CharField(max_length=10, null=True, blank=True, validators=[
        RegexValidator(
            regex=r'^\d{10}$',
            message="father contact number must be exactly 10 digits."
        )
    ])

    mother_contact_number = models.CharField(max_length=10, null=True, blank=True, validators=[
        RegexValidator(
            regex=r'^\d{10}$',
            message="mother contact number must be exactly 10 digits."
        )
    ])
    send_to_sms = models.CharField(max_length=1, null=False, blank=False)
    is_sms_sent = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class UserType(models.Model):   # done
    user_type = models.CharField(max_length=250,null=False, blank=False,default=1)
    description = models.TextField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user_type


class FeeFrequency(models.Model):   # done
    organization=models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch=models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch=models.ForeignKey(Batch, on_delete=models.CASCADE)
    course=models.ForeignKey(Course, on_delete=models.CASCADE)
    department=models.ForeignKey(Department, on_delete=models.CASCADE)
    # department=models.ForeignKey(Department, on_delete=models.CASCADE)
    fee_frequency_name= models.CharField(max_length=50,blank=False,null=False)
    frequency_period = models.IntegerField(null=False,blank=False)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.fee_frequency_name}'


class FeeStructureMaster(models.Model):   # done
    fee_structure_code = models.CharField(max_length=50,null=False,blank=False)
    fee_structure_description = models.CharField(max_length=200,null=False,blank=False)

    organization = models.ForeignKey(Organization,on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    enabled = models.CharField(max_length=1, null=False, blank=False)
    version_no = models.PositiveIntegerField(null=False,blank=False)

    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    new_existing= models.CharField(max_length=1,blank=True,null=True)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.fee_structure_description


class FeeElementType(models.Model):    # done
    element_name= models.CharField(max_length=150,unique=True,null=False,blank=False)
    element_description = models.CharField(max_length=150,null=False,blank=False)
    organization = models.ForeignKey(Organization,on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    # batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    # course = models.ForeignKey(Course, on_delete=models.CASCADE)
    # department = models.ForeignKey(Department,on_delete=models.CASCADE)
    # academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    # semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    sequence_order = models.PositiveIntegerField(null=False,blank=False)
    element_type = models.CharField(max_length=10, null=False, blank=False)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.element_name}, Organization - {self.organization.organization_code}'


class FeeStructureDetail(models.Model):    # done
    fee_structure_master = models.ForeignKey(FeeStructureMaster,on_delete=models.CASCADE)
    element_type = models.ForeignKey(FeeElementType,on_delete=models.CASCADE)
    element_frequency = models.ForeignKey(FeeFrequency,on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=18, decimal_places=2,null=True,blank=True)
    semester_1 = models.IntegerField(null=True)
    semester_2 = models.IntegerField(null=True)
    semester_3 = models.IntegerField(null=True)
    semester_4 = models.IntegerField(null=True)
    semester_5 = models.IntegerField(null=True)
    semester_6 = models.IntegerField(null=True)
    semester_7 = models.IntegerField(null=True)
    semester_8 = models.IntegerField(null=True)

    # organization = models.ForeignKey(Organization,on_delete=models.CASCADE)  # not need
    # period_1 = models.CharField(max_length=50,null=True,blank=True)
    # period_2 = models.CharField(max_length=50, null=True, blank=True)
    # period_3 = models.CharField(max_length=50, null=True, blank=True)
    # period_4 = models.CharField(max_length=50, null=True, blank=True)
    # period_5 = models.CharField(max_length=50, null=True, blank=True)
    # period_6 = models.CharField(max_length=50, null=True, blank=True)
    adjustment_flag = models.CharField(max_length=1,null=True,blank=True)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.fee_structure_master.fee_structure_description)


class ExceptionTrack(models.Model):
    request= models.CharField(max_length=500)
    process_name= models.CharField(max_length=100)
    message= models.TextField(blank=True, default='')  # Changed to TextField for unlimited length
    data= models.CharField(max_length=500, blank=True, default='')
    created_date= models.DateTimeField(auto_now_add=True)
    updated_date= models.DateTimeField(auto_now_add=True)


from django.contrib.auth.models import BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self, user_name, password=None, **extra_fields):
        if not user_name:
            raise ValueError("The user_name field must be set")
        user = self.model(user_name=user_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, user_name, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        return self.create_user(user_name, password, **extra_fields)


class Employee(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, default=1)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    user_type = models.ForeignKey(UserType, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50,null=False,blank=False)
    last_name = models.CharField(max_length=50,null=True)
    guardian_name = models.CharField(max_length=50,null=False,blank=False)
    email = models.EmailField(null=False,blank=False,unique=True, validators=[EmailValidator()])
    mobile_number= models.CharField(max_length=10, null=False,blank=False, validators=[
        RegexValidator(
            regex=r'^\d{10}$',
            message="Phone number must be exactly 10 digits."
        )
    ])
    date_of_birth = models.DateField(null=False)
    gender = models.CharField(max_length=10,null=False)
    postal_code= models.CharField(max_length=6,null=False,blank=False,validators=[
        RegexValidator(
            regex=r'^\d{6}$',
            message="postalcode number must be 6 digits."
        )
    ])
    address = models.TextField(null=False,blank=False)
    aadhaar_no = models.CharField(max_length=12, null=True, unique=False, validators=[
        RegexValidator(
            regex=r'^\d{12}$',
            message="Aadhaar number must be 12 digits."
        )
    ])
    profile_pic = models.ImageField(upload_to='employee_profile_pic', blank=True, null=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class Login(AbstractBaseUser):  # Not need
    # organization = models.ForeignKey(Organization, on_delete=models.CASCADE, default=1,null=True,blank=True)
    # branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=1,null=True,blank=True)
    username = models.EmailField(unique=True)
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE)

    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return True

    def __str__(self):
        return self.username


class EmployeeDetail(models.Model):
    # Eduction= models.CharField(max_length=1000,null=False, blank=False)
    Employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    document = models.FileField(upload_to='Details_Document/')
    degree = models.CharField(max_length=255, null=False, blank=False)  # e.g., Bachelor's, Master's, PhD
    institution = models.CharField(max_length=255, null=False, blank=False)  # Name of the institution
    duration_start = models.DateField(null=True, blank=True)  # When the course started
    duration_end_date = models.DateField(null=True, blank=True)  # When the course ended or is expected to end
    grade = models.CharField(max_length=50, null=True, blank=True)  # e.g., A+, 4.0 GPA
    specialization = models.CharField(max_length=255, null=True,
                                      blank=True)  # e.g., Computer Science, Mechanical Engineering
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        try:
            instants = EmployeeDetail.objects.get(id=self.id)
            if instants.document != self.document:
                instants.document.delete(save=False)
        except:
            pass  # Handle the case where it's a new object (so there is no previous document)

        super(EmployeeDetail, self).save(*args, **kwargs)


class Period(models.Model):
    period_name = models.CharField(max_length=50,null=False,blank=False)
    period_description = models.CharField(max_length=50,null=True,blank=True)
    fees_exempt = models.CharField(max_length=10,null=True,blank=True)
    organization = models.ForeignKey(Organization,on_delete=models.CASCADE)
    # branch = models.ForeignKey(Department,on_delete=models.CASCADE)
    no_of_months = models.PositiveIntegerField(null=False,blank=False)
    sorting_order= models.PositiveIntegerField(null=False,blank=False)
    academic_year = models.ForeignKey(AcademicYear,on_delete=models.CASCADE)
    period_start_date = models.DateField(null=False,blank=False)
    period_end_date = models.DateField(null=False,blank=False)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.period_name} '


class SiblingDetail(models.Model):
    student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE, null=True, blank=True)
    sibling = models.ForeignKey(StudentRegistration,on_delete=models.CASCADE, related_name='sibling_id')
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.student}'


class StudentEmergencyContact(models.Model):
    student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    relationship = models.CharField(max_length=255)
    mobile_number = models.CharField(max_length=10, null=False, blank=False, validators=[
        RegexValidator(
            regex=r'^\d{10}$',
            message="Phone number must be exactly 10 digits."
        )
    ])
    remark = models.CharField(max_length=255,null=True,blank=True)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class AuthorisedPickup(models.Model):
    student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    relationship = models.CharField(max_length=255)
    mobile_number = models.CharField(max_length=10, null=False, blank=False, validators=[
        RegexValidator(
            regex=r'^\d{10}$',
            message="Phone number must be exactly 10 digits."
        )
    ])
    remark = models.CharField(max_length=255, null=True, blank=True)
    address = models.CharField(max_length=500, null=True, blank=True)
    email = models.EmailField(max_length=255, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.student.first_name

class StudentDocument(models.Model):
    student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    document_no = models.CharField(max_length=255,null=False,blank=False)
    document_type = models.CharField(max_length=255,null=False,blank=False)
    document_url = models.CharField(max_length=255,null=True,blank=True)
    document_pic = models.FileField(upload_to='student_documents/',null=True, blank=True)
    start_from = models.DateField(null=True,blank=True)
    end_to = models.DateField(null=True,blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.student.first_name


class StudentPreviousEducation(models.Model):
    student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    name_of_institution = models.CharField(max_length=255,null=False,blank=False)
    location = models.CharField(max_length=255,null=True,blank=True)
    course_completed = models.CharField(max_length=255, null=True, blank=True)
    year_from = models.DateField(null=False,blank=False)
    year_to = models.DateField(null=False,blank=False)
    language_of_instruction = models.CharField(max_length=255, null=True, blank=True)
    transfer_certificate= models.CharField(max_length=255, null=True, blank=True)
    result = models.CharField(max_length=255, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.student.first_name



class Parent(models.Model):
    parent_id = models.PositiveIntegerField(unique=True, null=False, blank=False)
    student = models.ForeignKey(StudentRegistration,on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return str(self.student.first_name)


class StudentCourse(models.Model):
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)  # course
    department = models.ForeignKey(Department, on_delete=models.CASCADE)  # department
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)  # section
    fee_group = models.ForeignKey(FeeStructureMaster, on_delete=models.CASCADE, null=True)
    fee_applied_from = models.ForeignKey(Semester, on_delete=models.CASCADE, null=True, related_name='student_course')
    enrollment_no = models.PositiveIntegerField(null=True, blank=True)
    house = models.ForeignKey(House, on_delete=models.CASCADE, null=True, blank=True)
    hostel_availed = models.BooleanField(default=False)
    hostel_choice_semester = models.CharField(max_length=250, null=True, blank=True)
    temp_hostel_choice_semester = models.CharField(max_length=250, null=True, blank=True)
    transport_availed = models.BooleanField(null=True, blank=True)
    choice_semester = models.CharField(max_length=250, null=True, blank=True)
    route_id = models.IntegerField(null=True, blank=True)  # here i store routedetailsId not route_id in db
    student_status = models.CharField(max_length=100, default='active', null=False, blank=False)
    is_active = models.BooleanField(default=True)
    is_promoted = models.BooleanField(default=False)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(f"{self.student}")


class UserLogin(AbstractBaseUser, PermissionsMixin):
    user_name = models.CharField(max_length=255, unique=True, null=False, blank=False)
    plain_password = models.CharField(max_length=255)  # Consider removing this for security
    role_name = models.CharField(max_length=255, null=True, blank=True)  # Role name for admin users
    user_type = models.ForeignKey('UserType', default=1, on_delete=models.CASCADE)
    reference_id = models.IntegerField(default=0, null=True, blank=True)  # Link to employee/staff/student (0 = not linked)
    organization = models.ForeignKey(Organization,default=1, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch,default=1, on_delete=models.CASCADE)
    accessible_modules = models.JSONField(default=list, blank=True, null=True)  # Store accessible modules for admin users
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Required for Django admin
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'user_name'
    REQUIRED_FIELDS = []  # Add required fields for createsuperuser (other than username)

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return True

    def __str__(self):
        return self.user_name


class StudentFeeDetail(models.Model):
    # fee_applied_from = models.ForeignKey(Period, on_delete=models.CASCADE)
    # fee_structure_id = models.IntegerField(null=True, blank=True)
    # fee_structure_details_id = models.IntegerField(null=True,blank=True)
    # fee_structure_id = models.ForeignKey(fee_structure_master, on_delete=models.CASCADE)  #integer null = true
    # fee_structure_details_id = models.ForeignKey(fee_Structure_Details, on_delete=models.CASCADE)   #integer null = true
    student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    student_course = models.ForeignKey(StudentCourse, on_delete=models.CASCADE)
    fee_group = models.ForeignKey(FeeStructureMaster, on_delete=models.CASCADE, null=True, blank=True)
    fee_structure_details = models.ForeignKey(FeeStructureDetail, on_delete=models.CASCADE, null=True, blank=True)
    element_name = models.CharField(max_length=100, null=False, blank=False)
    fee_applied_from = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='fee_applied_from', null=True)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, null=True)
    paid = models.CharField(max_length=10, default='N')

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    multiplying_factor = models.IntegerField(default=1)
    element_amount = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    element_discount_amount = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    total_element_period_amount = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    paid_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    remarks = models.CharField(max_length=50, null=True, blank=True)
    reverse_flag = models.CharField(max_length=50, null=True, blank=True)

    # Meta fields
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Student Fee Details for Student ID: {self.student}"




class Profession(models.Model):
    profession_code = models.CharField(max_length=100, null=False, blank=False)
    profession_description = models.CharField(max_length=100, null=False, blank=False)
    # Meta fields
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Document(models.Model):
    document_code = models.CharField(max_length=100, null=False, blank=False)
    document_desc = models.CharField(max_length=100, null=False, blank=False)
    # Meta fields
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Language(models.Model):
    language_code = models.CharField(max_length=100, null=False, blank=False)
    language_desc = models.CharField(max_length=100, null=False, blank=False)
    # Meta fields
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.language_code


class ClubGroup(models.Model):
    club_group_code = models.CharField(max_length=50, null=False, blank=False)
    club_group_description = models.CharField(max_length=200, null=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)

    sorting_order = models.IntegerField(null=False, blank=False)
    # checkbox_group = models.CharField(max_length=1, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.club_group_code} '


class Club(models.Model):
    club_group = models.ForeignKey(ClubGroup, on_delete=models.CASCADE)
    club_code = models.CharField(max_length=50, null=False, blank=False)
    club_description = models.CharField(max_length=200, null=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    grade_marks = models.CharField(max_length=1, null=True, blank=True)
    change_font = models.BooleanField(null=False, blank=False)  # flag
    is_active = models.BooleanField(default=True)
    # is_club = models.BooleanField(default=False)
    # created_by = models.PositiveIntegerField()
    # updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.club_description}'


# class CourseClub(models.Model):  # not insert
#     club_group = models.ForeignKey(ClubGroup, on_delete=models.CASCADE)
#     club_master = models.ForeignKey(ClubMaster, on_delete=models.CASCADE)
#     course = models.ForeignKey(Course, on_delete=models.CASCADE)  # Class Id Forignkey
#     semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
#     section = models.ForeignKey(Section, on_delete=models.CASCADE)
#     academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
#     organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
#     sorting_order = models.IntegerField(null=False, blank=False)
#     grade_marks = models.CharField(max_length=1, null=True, blank=True)  # G,m,b
#
#     is_active = models.BooleanField(default=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#
#     def __str__(self):
#         return f'Class: {self.course.course_name} | Club: {self.club_master} | AcademicYear: {self.academic_year} | Term: {self.semester}'


class StudentClub(models.Model):  # not inserted
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    # student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    student_course = models.ForeignKey(StudentCourse, on_delete=models.CASCADE)
    club_group = models.ForeignKey(ClubGroup, on_delete=models.CASCADE)
    club = models.ForeignKey(Club, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Student Club ID: {self.id} - Student : {self.student_course} - Club : {self.club}"




# class Subject(models.Model):  # not insert
#     academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
#     organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
#     batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
#     course = models.ForeignKey(Course,on_delete=models.CASCADE)
#     department = models.ForeignKey(Department,on_delete=models.CASCADE)
#     semester = models.ForeignKey(Semester,on_delete=models.CASCADE)  #Semester
#     subject_code = models.CharField(max_length=100, null=True, blank=False)
#     subject_description = models.CharField(max_length=100, null=True, blank=False)
#     sorting_order = models.IntegerField(null=False, blank=False)
#     grade_marks = models.CharField(max_length=1, null=True, blank=True)       #G,m,b
#     optional = models.BooleanField(default=False)
#     is_active = models.BooleanField(default=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
# 
#     def __str__(self):
#         return f'Course: {self.course}, Subject: {self.subject_code}, AcademicYear: {self.academic_year}, Semester: {self.semester}'


# class StudentSubject(models.Model):  # not inserted
#     student = models.ForeignKey(StudentRegistration,on_delete=models.CASCADE)
#     subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
#     course = models.ForeignKey(Course, on_delete=models.CASCADE)
#     academic_year = models.ForeignKey(AcademicYear,on_delete=models.CASCADE)
#     organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
#     batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
#     is_active = models.BooleanField(default=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
# 
#     def __str__(self):
#         return f"Student Subject ID: {self.student, self.subject}"

# 
# class CourseSemesterSubjects(models.Model):  # not insert
#     subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
#     # subject_master_id = models.ForeignKey(SCHSubjectMaster, on_delete=models.CASCADE)
#     course = models.ForeignKey(Course, on_delete=models.CASCADE)  # Class Id Forignkey
#     semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
#     academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
#     organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
#     
#     sorting_order = models.IntegerField(null=False, blank=False)
#     grade_marks = models.CharField(max_length=1, null=True, blank=True)  # G,m,b
#     is_active = models.BooleanField(default=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
# 
#     def __str__(self):
#         return f'Course: {self.course.course_name} | Subject: {self.subject} | AcademicYear: {self.academic_year} | Semester: {self.semester}'


class PaymentMethod(models.Model):
    payment_method = models.CharField(max_length=50)
    payment_method_desc = models.CharField(max_length=200)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.payment_method} - {self.payment_method_desc}"


def validate_payment_details(value):
    if not isinstance(value, dict):
        raise ValidationError("Must be a JSON object")

    # required_keys = ["name", "age"]
    required_keys = []
    if value["payment_type"].lower() == 'bank':
        required_keys = ["payment_type","beneficiary_bank_id", "beneficiary_account_id", "reference_date", "amount", "reference"]
        for key in required_keys:
            if key not in value:
                raise ValidationError(f"Missing key: {key}")
        if not isinstance(value["payment_type"], str):
            raise ValidationError("payment_type must be string")

        if not isinstance(value["beneficiary_bank_id"], int):
            raise ValidationError("beneficiary_bank_id must be integer")

        if not isinstance(value["beneficiary_account_id"], int):
            raise ValidationError("beneficiary_account_id must be integer")

        if not isinstance(value["reference_date"], str):
            raise ValidationError("reference_date must be string")

        if not isinstance(value["amount"], int):
            raise ValidationError("amount must be integer")

        if not isinstance(value["reference"], str):
            raise ValidationError("reference must be string")

    if value["payment_type"].lower() == 'cash':
        required_keys = ["payment_type","reference_date", "amount", "reference"]
        for key in required_keys:
            if key not in value:
                raise ValidationError(f"Missing key: {key}")

        if not isinstance(value["payment_type"], str):
            raise ValidationError("payment_type must be string")

        if not isinstance(value["reference_date"], str):
            raise ValidationError("reference_date must be string")

        if not isinstance(value["amount"], int):
            raise ValidationError("amount must be integer")

        if not isinstance(value["reference"], str):
            raise ValidationError("reference must be string")

    if value["payment_type"].lower() == 'cheque':
        required_keys = ["payment_type","cheque_number", "bank_name", "branch_name", "reference_date", "amount", "reference",
                       "beneficiary_bank_id", "beneficiary_account_id"]
        for key in required_keys:
            if key not in value:
                raise ValidationError(f"Missing key: {key}")

        if not isinstance(value["payment_type"], str):
            raise ValidationError("payment_type must be string")

        if not isinstance(value["cheque_number"], int):
            raise ValidationError("cheque_number must be integer")

        if not isinstance(value["bank_name"], str):
            raise ValidationError("bank_name must be string")

        if not isinstance(value["branch_name"], str):
            raise ValidationError("branch_name must be string")

        if not isinstance(value["reference_date"], str):
            raise ValidationError("reference_date must be string")

        if not isinstance(value["amount"], int):
            raise ValidationError("amount must be integer")

        if not isinstance(value["reference"], str):
            raise ValidationError("reference must be string")

        if not isinstance(value["beneficiary_bank_id"], int):
            raise ValidationError("beneficiary_bank_id must be integer")

        if not isinstance(value["beneficiary_account_id"], int):
            raise ValidationError("beneficiary_account_id must be integer")

    if value["payment_type"].lower() == 'dd':
        required_keys = ["payment_type","dd_number", "issuing_bank_name", "reference_date", "amount", "reference", "beneficiary_bank_id",
                   "beneficiary_account_id"]
        for key in required_keys:
            if key not in value:
                raise ValidationError(f"Missing key: {key}")
        if not isinstance(value["payment_type"], str):
            raise ValidationError("payment_type must be string")

        if not isinstance(value["dd_number"], str):
            raise ValidationError("dd_number must be string")

        if not isinstance(value["issuing_bank_name"], str):
            raise ValidationError("issuing_bank_name must be string")

        if not isinstance(value["reference_date"], str):
            raise ValidationError("reference_date must be string")

        if not isinstance(value["amount"], int):
            raise ValidationError("amount must be integer")

        if not isinstance(value["reference"], str):
            raise ValidationError("reference must be string")

        if not isinstance(value["beneficiary_bank_id"], int):
            raise ValidationError("beneficiary_bank_id must be integer")

        if not isinstance(value["beneficiary_account_id"], int):
            raise ValidationError("beneficiary_account_id must be integer")

    if value["payment_type"].lower() == 'rtgs_neft':
        required_keys = ["payment_type","utr_number", "sender_bank_name", "account_number", "reference_date", "amount", "reference",
                          "beneficiary_bank_id", "beneficiary_account_id"]
        for key in required_keys:
            if key not in value:
                raise ValidationError(f"Missing key: {key}")

        if not isinstance(value["payment_type"], str):
            raise ValidationError("payment_type must be string")

        if not isinstance(value["utr_number"], str):
            raise ValidationError("utr_number must be string")

        if not isinstance(value["sender_bank_name"], str):
            raise ValidationError("sender_bank_name must be string")

        if not isinstance(value["account_number"], str):
            raise ValidationError("account_number must be string")

        if not isinstance(value["reference_date"], str):
            raise ValidationError("reference_date must be string")

        if not isinstance(value["amount"], int):
            raise ValidationError("amount must be integer")

        if not isinstance(value["reference"], str):
            raise ValidationError("reference must be string")

        if not isinstance(value["beneficiary_bank_id"], int):
            raise ValidationError("beneficiary_bank_id must be integer")

        if not isinstance(value["beneficiary_account_id"], int):
            raise ValidationError("beneficiary_account_id must be integer")

    if value["payment_type"].lower() == 'upi':
        required_keys = ["utr_number", "reference_date", "amount", "reference", "beneficiary_bank_id",
                    "beneficiary_account_id"]
        for key in required_keys:
            if key not in value:
                raise ValidationError(f"Missing key: {key}")

        if not isinstance(value["payment_type"], str):
            raise ValidationError("payment_type must be string")

        if not isinstance(value["utr_number"], str):
            raise ValidationError("utr_number must be string")

        if not isinstance(value["reference_date"], str):
            raise ValidationError("reference_date must be string")

        if not isinstance(value["amount"], int):
            raise ValidationError("amount must be integer")

        if not isinstance(value["reference"], str):
            raise ValidationError("reference must be string")

        if not isinstance(value["beneficiary_bank_id"], int):
            raise ValidationError("beneficiary_bank_id must be integer")

        if not isinstance(value["beneficiary_account_id"], int):
            raise ValidationError("beneficiary_account_id must be integer")

    # for key in required_keys:
    #     if key not in value:
    #         raise ValidationError(f"Missing key: {key}")
    #
    # if not isinstance(value["age"], int):
    #     raise ValidationError("Age must be integer")

class StudentFeeReceiptHeader(models.Model):
    receipt_no = models.BigIntegerField(null=False, blank=False)  # Big int # Auto generate
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    receipt_date = models.DateTimeField()
    student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    receipt_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    receipt_status = models.CharField(max_length=50, null=True, blank=True)
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE)
    # payment_reference = models.CharField(max_length=250, null=True, blank=True)
    # payment_date = models.DateTimeField(null=True, blank=True)
    payment_detail = models.JSONField(default=dict, validators=[validate_payment_details])
    cancellation_remarks = models.CharField(max_length=500, null=True, blank=True)
    remarks = models.CharField(max_length=500, null=True, blank=True)
    balance = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Receipt {self.receipt_no} - Student {self.student}"



class StudentFeeReceiptDetail(models.Model):
    receipt = models.ForeignKey(StudentFeeReceiptHeader,on_delete=models.CASCADE)
    fee_detail = models.ForeignKey(StudentFeeDetail,on_delete=models.CASCADE)
    #fee_detail_id = models.DecimalField(max_digits=18, decimal_places=0)   # foregin key studentfeedetails
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Receipt Detail for Receipt {self.receipt.id}"


class Bank(models.Model):  # done
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    bank_name = models.CharField(max_length=255, null=False, blank=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.bank_name}"


class BankAccountDetail(models.Model):  # not insert

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE)
    bank_branch_address = models.CharField(max_length=500, null=False, blank=False)
    bank_account = models.BigIntegerField(null=False, blank=False)
    ifsc = models.CharField(max_length=50, null=False, blank=False)
    swift_code = models.CharField(max_length=50, null=True, blank=True)
    account_type = models.CharField(max_length=1, null=False, blank=False)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class StudentPayment(models.Model):
    # organization= models.ForeignKey(Organization, on_delete=models.CASCADE)
    # branch= models.ForeignKey(Branch, on_delete=models.CASCADE)
    receipt = models.ForeignKey(StudentFeeReceiptHeader, on_delete=models.CASCADE)
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE, null=True, blank=True)
    # bank_id = models.IntegerField(null=True, blank=True)
    bank_account = models.ForeignKey(BankAccountDetail, on_delete=models.CASCADE, null=True, blank=True)
    # bank_account_id = models.CharField(max_length=200,null=True, blank=True)
    payment_reference = models.CharField(max_length=50, null=True, blank=True)
    payment_date = models.DateTimeField()
    reference_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Payment  for Receipt {self.receipt}"


class MessageType(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    message_type = models.CharField(max_length=100, null=False, blank=False)
    message_type_description = models.CharField(max_length=100, null=False, blank=False)
    message_default_text = models.CharField(max_length=250, null=True, blank=True)
    # academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class MessageInitiated(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    initiated_by = models.CharField(max_length=100, null=False, blank=False)
    initiated_by_description = models.CharField(max_length=100, null=False, blank=False)
    # academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class StudentMessagesHistory(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    message = models.CharField(max_length=250, null=False, blank=False)
    message_type = models.ForeignKey(MessageType, on_delete=models.CASCADE)
    message_date = models.DateField(null=False, blank=False)
    initiated_by = models.ForeignKey(MessageInitiated, on_delete=models.CASCADE)
    initiated_remarks = models.CharField(max_length=100, null=False, blank=False)
    message_status = models.CharField(max_length=1, null=True, blank=True)
    message_sent_to = models.CharField(max_length=1, null=True, blank=True)
    count = models.IntegerField(null=True)
    message_time = models.TimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class StudentAssignment(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    subject = models.ForeignKey(CourseDepartmentSubject, on_delete=models.CASCADE)
    assignment_date = models.DateField()
    assignment_file_url = models.CharField(max_length=255, null=True, blank=True)
    assignment_file = models.FileField(upload_to='assignments/', null=True, blank=True, max_length=500)
    assignment_details = models.TextField(null=True, blank=True)

    lecture_period = models.ForeignKey(LecturePeriod, on_delete=models.CASCADE)
    # lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    professor = models.ForeignKey(EmployeeMaster, on_delete=models.CASCADE)
    send_sms = models.CharField(max_length=1, null=True, blank=True)
    sms_sent_to = models.CharField(max_length=1, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class StudentCircular(models.Model):  # done
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    circular_date = models.DateField(null=False, blank=False)
    circular_file = models.FileField(null=True, blank=True)
    circular_file_url = models.CharField(max_length=100, blank=True)
    circular_details = models.TextField(null=False, blank=False)
    initiated_by = models.ForeignKey(MessageInitiated, on_delete=models.CASCADE)
    circular_status = models.CharField(max_length=1, default='N')  # default N,Aprove A & cancel C
    send_sms = models.CharField(max_length=1, null=True, blank=True)
    message_status = models.CharField(max_length=1, default='P')
    circular_sent_to = models.CharField(max_length=1, null=True, blank=True)
    circular_time = models.TimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_cancelled = models.BooleanField(default=False)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Circular {self.circular_details}"



# class StudentCertificate(models.Model):
#     student = models.ForeignKey(
#         'StudentRegistration',
#         on_delete=models.CASCADE,
#         db_column='student'
#     )
#     # organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
#     # branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
#     # batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
#     # course = models.ForeignKey(Course, on_delete=models.CASCADE)
#     # department = models.ForeignKey(Department, on_delete=models.CASCADE)
#     # academic_year = models.ForeignKey(
#     #     'AcademicYear',
#     #     on_delete=models.CASCADE,
#     #     db_column='academic_year'
#     # )
#     # semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
#
#     tc_applied_date = models.DateField()  #
#     reason_for_tc = models.CharField(max_length=500, null=True, blank=True)
#     tc_issued_date = models.DateField(null=True, blank=True)
#     transfer_certificate_id = models.AutoField(primary_key=True, db_column='transfer_certificate_id')
#     transfer_certificate_no = models.CharField(max_length=100, null=True, blank=True)
#     transfer_certificate_no_prefix = models.DecimalField(
#         max_digits=18, decimal_places=0, null=False, blank=False
#     )  # max value/ session code name    #need to be make mandatory field
#
#     transfer_certificate_no_postfix = models.CharField(max_length=50, null=False, blank=False)
#     ncc_cadet_details = models.CharField(max_length=500, null=True, blank=True)
#     games_played_details = models.CharField(max_length=500, null=True, blank=True)
#     general_conduct = models.CharField(max_length=500, null=True, blank=True)
#     other_remarks = models.CharField(max_length=500, null=True, blank=True)
#     status = models.CharField(max_length=100, null=True, blank=True)
#     # school_board_last_taken = models.CharField(max_length=200, null=True, blank=True)
#     whether_failed = models.CharField(max_length=200, null=True, blank=True)
#     subjects_studied = models.CharField(max_length=500, null=True, blank=True)
#     qualified_for_promotion = models.CharField(max_length=200, null=True, blank=True)
#     month_fee_paid = models.CharField(max_length=200, null=True, blank=True)
#     fee_concession_availed = models.CharField(max_length=200, null=True, blank=True)
#     total_no_working_days = models.CharField(max_length=50, null=True, blank=True)
#     total_no_working_days_present = models.CharField(max_length=50, null=True, blank=True)
#     document_type = models.CharField(max_length=100, null=True, blank=True)
#     cancelled_on = models.DateField(null=True, blank=True)
#     cancelled_remarks = models.CharField(max_length=500, null=True, blank=True)
#     cancelled_by = models.CharField(max_length=30, null=True, blank=True)
#     enrollment_no = models.CharField(max_length=50, null=True, blank=True)
#     cultural_activities = models.CharField(max_length=500, null=True, blank=True)
#     other_activities = models.CharField(max_length=500, null=True, blank=True)
#     marks_obtained = models.CharField(max_length=100, null=True, blank=True)
#     from_month = models.CharField(max_length=50, null=True, blank=True)
#     to_month = models.CharField(max_length=50, null=True, blank=True)
#     course_last_studied = models.ForeignKey(Course, on_delete=models.CASCADE,related_name='student_certificate')  # need to store id
#     is_active = models.BooleanField(default=True)
#
#     class Meta:
#         db_table = 'StudentCertificate'
#
#     def __str__(self):
#         return f"StudentCertificate {self.transfer_certificate_id} - {self.transfer_certificate_no}"


class ReAdmissionEligibility(models.TextChoices):
    Eligible = 'Eligible', 'Eligible'
    Ineligible = 'Ineligible', 'Ineligible'

class CertificateStatus(models.TextChoices):
    Pending = 'Pending', 'Pending'
    Approved = 'Approved', 'Approved'

class StudentTransferCertificate(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    tc_number = models.CharField(max_length=1000, null=False, blank=False)
    issue_date = models.DateField(null=True, blank=True)
    date_of_leaving = models.DateField(null=True, blank=True)
    reason_of_leaving = models.CharField(max_length=500, null=True, blank=True)
    student_behaviour = models.CharField(max_length=500, null=True, blank=True)
    certificate_status = models.CharField(max_length=100, choices=CertificateStatus, default=CertificateStatus.Pending)
    readmission_eligibility = models.CharField(max_length=100,choices=ReAdmissionEligibility, default=ReAdmissionEligibility.Eligible)   #options : eligible or ineligible
    created_by = models.PositiveIntegerField(default=1)
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



class StudentBonafideCertificate(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    bc_number = models.CharField(max_length=1000, null=True, blank=True)
    issue_date = models.DateField(null=True, blank=True)
    purpose = models.CharField(max_length=5000, null=True, blank=True)
    certificate_status = models.CharField(max_length=100, choices=CertificateStatus, default=CertificateStatus.Pending)
    created_by = models.PositiveIntegerField(default=1)
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class StudentBehaviour(models.TextChoices):
    excellent = 'Excellent', 'Excellent'
    good = 'Good', 'Good'
    satisfactory = 'Satisfactory', 'Satisfactory'
    bad = 'Bad', 'Bad'


class StudentCharacterCertificate(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    cc_number = models.CharField(max_length=1000, null=True, blank=True)
    issue_date = models.DateField(null=True, blank=True)
    certificate_status = models.CharField(max_length=100, choices=CertificateStatus, default=CertificateStatus.Pending)
    student_behaviour = models.CharField(max_length=5000, null=True, blank=True)
    created_by = models.PositiveIntegerField(default=1)
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class StudentFeeCertificate(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    fc_number = models.CharField(max_length=1000, null=True, blank=True)
    issue_date = models.DateField(null=True, blank=True)
    purpose = models.CharField(max_length=5000, null=True, blank=True)
    certificate_status = models.CharField(max_length=100, choices=CertificateStatus, default=CertificateStatus.Pending)
    created_by = models.PositiveIntegerField(default=1)
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



# class StudentCertificate(models.Model):
#     student = models.ForeignKey(
#         'StudentRegistration',
#         on_delete=models.CASCADE,
#         db_column='student'
#     )
#     organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
#     branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
#     batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
#     course = models.ForeignKey(Course, on_delete=models.CASCADE)
#     department = models.ForeignKey(Department, on_delete=models.CASCADE)
#     academic_year = models.ForeignKey(
#         'AcademicYear',
#         on_delete=models.CASCADE,
#         db_column='academic_year'
#     )
#     # semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
#
#     certificate_applied_date = models.DateField()  #
#     reason_for_certificate = models.CharField(max_length=500, null=True, blank=True)
#     certificate_issued_date = models.DateField(null=True, blank=True)
#     certificate_id = models.AutoField(primary_key=True, db_column='certificate_id')
#     certificate_no = models.CharField(max_length=100, null=True, blank=True)
#     certificate_no_prefix = models.DecimalField(
#         max_digits=18, decimal_places=0, null=False, blank=False
#     )  # max value/ session code name    #need to be make mandatory field
#
#     certificate_no_postfix = models.CharField(max_length=50, null=False, blank=False)
#     ncc_cadet_details = models.CharField(max_length=500, null=True, blank=True)
#     games_played_details = models.CharField(max_length=500, null=True, blank=True)
#     general_conduct = models.CharField(max_length=500, null=True, blank=True)
#     other_remarks = models.CharField(max_length=500, null=True, blank=True)
#     status = models.CharField(max_length=100, null=True, blank=True)
#     # school_board_last_taken = models.CharField(max_length=200, null=True, blank=True)
#     whether_failed = models.CharField(max_length=200, null=True, blank=True)
#     subjects_studied = models.CharField(max_length=500, null=True, blank=True)
#     qualified_for_promotion = models.CharField(max_length=200, null=True, blank=True)
#     month_fee_paid = models.CharField(max_length=200, null=True, blank=True)
#     fee_concession_availed = models.CharField(max_length=200, null=True, blank=True)
#     total_no_working_days = models.CharField(max_length=50, null=True, blank=True)
#     total_no_working_days_present = models.CharField(max_length=50, null=True, blank=True)
#     document_type = models.CharField(max_length=100, null=True, blank=True)
#     cancelled_on = models.DateField(null=True, blank=True)
#     cancelled_remarks = models.CharField(max_length=500, null=True, blank=True)
#     cancelled_by = models.CharField(max_length=30, null=True, blank=True)
#     enrollment_no = models.CharField(max_length=50, null=True, blank=True)
#     cultural_activities = models.CharField(max_length=500, null=True, blank=True)
#     other_activities = models.CharField(max_length=500, null=True, blank=True)
#     marks_obtained = models.CharField(max_length=100, null=True, blank=True)
#     from_month = models.CharField(max_length=50, null=True, blank=True)
#     to_month = models.CharField(max_length=50, null=True, blank=True)
#     course_last_studied = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="student_certificate")  # need to store id
#     is_active = models.BooleanField(default=True)
#
#     class Meta:
#         db_table = 'StudentCertificate'
#
#     def __str__(self):
#         return f"StudentCertificate {self.certificate_id} - {self.certificate_no}"
#


class PasswordResetOTP(models.Model):
    user_login = models.ForeignKey(UserLogin, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=5)

