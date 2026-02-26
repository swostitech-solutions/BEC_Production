import json
from xml.dom.minidom import DocumentType

from django.core.validators import MinValueValidator, RegexValidator
from rest_framework import serializers, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from Acadix.models import UserType, Employee, Login, AcademicYear, Course, Section, \
    SiblingDetail, StudentEmergencyContact, AuthorisedPickup, StudentDocument, \
    StudentPreviousEducation, Organization, Batch, StudentRegistration, StudentCourse, FeeStructureMaster, \
    FeeStructureDetail, Period, UserLogin, Address, StudentFeeDetail, FeeElementType, House, \
    Religion, Category, Nationality, Country, State, City, \
    Profession, StudentDocument, Language, MotherTongue, Blood, FeeFrequency, \
    PaymentMethod, CourseDepartmentSubject, MessageType, MessageInitiated, \
    StudentCircular, Bank, BankAccountDetail, StudentAssignment, \
    EmployeeMaster, EmployeeType, City, SiblingDetail, Lecture, EmployeeDetail, CourseSemesterSectionBind, Department, \
    Semester, Document, Branch, Gender, StudentTransferCertificate, StudentCharacterCertificate, \
    StudentBonafideCertificate, StudentFeeCertificate


class Organization_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'organization_code', 'organization_description']


class Branch_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'branch_code', 'branch_name']


class Batch_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = ['id', 'batch_code', 'batch_description']


class Course_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'course_code', 'course_name', 'description']


class Department_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'department_code', 'department_description']


class AcademicYear_Serializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = ['id', 'academic_year_code', 'academic_year_description']


class Semester_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = ['id', 'semester_code', 'semester_description']


class Section_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['id', 'section_code', 'section_name']


class FeeStructureDetail_Serializer(serializers.ModelSerializer):
    class Meta:
        model = FeeStructureDetail
        fields = ['id', 'amount', 'semester_1', 'semester_2', 'semester_3', 'semester_4', 'semester_5', 'semester_6',
                  'semester_7', 'semester_8', 'adjustment_flag']


class FeeFrequency_Serializer(serializers.ModelSerializer):
    class Meta:
        model = FeeFrequency
        fields = ['organization', 'branch', 'batch', 'course', 'department', 'fee_frequency_name', 'frequency_period',
                  'is_active']


class UserTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserType
        fields = ['id', 'user_type', 'description', 'is_active', 'created_by', 'created_at', 'updated_at']

    def validate_usertype(self, value):
        if not value.strip():
            raise serializers.ValidationError("Name cannot be empty or only whitespace.")
        return value


class UserTypeUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserType
        fields = ['id', 'usertype', 'description', 'is_active', 'updated_by', 'created_at', 'updated_at']

    def validate_usertype(self, value):
        if not value.strip():
            raise serializers.ValidationError("Name cannot be empty or only whitespace.")
        return value


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'organization', 'branch', 'user_type', 'first_name', 'last_name', 'guardian_name', 'email',
                  'mobile_number', 'date_of_birth', 'gender', 'postal_code', 'address', 'aadhaar_no', 'profile_pic',
                  'is_active', 'created_at', 'updated_at']

    def validate_user_type(self, value):
        if not value:
            raise serializers.ValidationError("usertype need to be choose.")
        return value

    def validate_first_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Name cannot be empty or only whitespace.")
        return value

    def validate_guardian_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("GuardianName cannot be empty or only whitespace")
        return value

    def validate_email(self, value):
        if not value.strip():
            raise serializers.ValidationError("Email cannot be empty or only whitespace.")
        return value

    def validate_mobile_number(self, mobile_number):
        if len(mobile_number) != 10:
            raise serializers.ValidationError("mobile_number must be exactly 10 digits.")
        return mobile_number

    def validate_date_of_birth(self, value):
        if not value:
            raise serializers.ValidationError("Dob Can not be blank.")
        return value

    def validate_gender(self, value):
        if not value:
            raise serializers.ValidationError("Gender Can not be blank.")
        return value

    def validate_postal_code(self, Postalcode):
        if len(Postalcode) != 6:
            raise serializers.ValidationError("Postalcode must be exactly 6 digits.")
        return Postalcode

    def validate_address(self, value):
        if not value.strip():
            raise serializers.ValidationError("Address cannot be empty or only whitespace.")
        return value

    def validate_aadhaar_no(self, aadhaar_no):
        if aadhaar_no is not None and len(aadhaar_no) != 12:
            raise serializers.ValidationError("Aadhaar number must be exactly 12 digits.")
        return aadhaar_no


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    organization_id = serializers.IntegerField(required=True)
    branch_id = serializers.IntegerField(required=True)


class LoginModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = ['id', 'organization', 'branch', 'username', 'employee', 'is_superuser', 'is_staff']


class ChangePasswordSerializer(serializers.Serializer):
    # user_id = serializers.IntegerField(required=True)
    username = serializers.CharField(max_length=200,required=True)
    old_password = serializers.CharField(required=False)
    new_password = serializers.CharField(required=True, min_length=6)
    confirm_password = serializers.CharField(required=True)

    def validate_username(self, username):
        try:
            user = UserLogin.objects.get(user_name__iexact=username,is_active=True)

        except UserLogin.DoesNotExist:
            raise serializers.ValidationError("This user does not exist.")
        return user

    def validate(self, data):

        username = data.get('username')
        # old_password = data.get('old_password')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')

        # if not user.check_password(old_password):
        #     raise serializers.ValidationError("Old password is incorrect.")

        if new_password != confirm_password:
            raise serializers.ValidationError("New password and confirm password do not match.")

        return data


class CreateAdminUserSerializer(serializers.Serializer):
    user_name = serializers.CharField(required=True, min_length=3)
    password = serializers.CharField(required=True, min_length=6)
    role_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    organization_id = serializers.IntegerField(required=True)
    branch_id = serializers.IntegerField(required=True)
    reference_id = serializers.IntegerField(required=False, allow_null=True)
    accessible_modules = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )

    def validate_user_name(self, value):
        if UserLogin.objects.filter(user_name=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        return value

    def validate_organization_id(self, value):
        if not Organization.objects.filter(id=value).exists():
            raise serializers.ValidationError("Organization does not exist.")
        return value

    def validate_branch_id(self, value):
        if not Branch.objects.filter(id=value).exists():
            raise serializers.ValidationError("Branch does not exist.")
        return value


class EmployeeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeDetail
        fields = ['id', 'EmployeeId', 'Documents', 'Degree', 'Institution', 'Duration_Start', 'Duration_EndDate',
                  'Grade', 'Specialization', 'is_active', 'created_at', 'updated_at']

    def validate_Documents(self, value):
        if not value:
            raise serializers.ValidationError("Document cannot be empty or only none.")
        return value

    def validate_Degree(self, value):
        if not value.strip():
            raise serializers.ValidationError("Degree cannot be empty or none")
        return value

    def validate_Institution(self, value):
        if not value.strip():
            raise serializers.ValidationError("Institution cannot be empty or none.")
        return value


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'organization', 'branch_code', 'branch_name', 'is_active', 'created_by', 'created_at',
                  'updated_at']

    def validate_organization(self, value):
        if not Organization.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Organization with this ID does not exist.")
        return value

    def validate_branch_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("branch_name can not be blank.")
        return value


class BranchUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'organization', 'branch_code', 'branch_name', 'is_active', 'updated_by', 'created_at',
                  'updated_at']

    def validate_organization(self, value):
        if not Organization.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Organization with this ID does not exist.")
        return value

    def validate_branch_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("branch_name can not be blank.")
        return value


class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = ['id', 'batch_code', 'batch_description', 'organization', 'branch', 'is_active', 'created_by',
                  'created_at', 'updated_at']

    def validate_organization(self, value):
        if not Organization.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Organization with this ID does not exist.")
        return value

    def validate_batch_code(self, value):
        if not value.strip():
            raise serializers.ValidationError("batch_code can not be blank.")
        return value


class BatchUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = ['id', 'batch_code', 'batch_description', 'organization', 'branch', 'is_active', 'created_by',
                  'created_at', 'updated_at']

    def validate_organization(self, value):
        if not Organization.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Organization with this ID does not exist.")
        return value

    def validate_batch_code(self, value):
        if not value.strip():
            raise serializers.ValidationError("batch_code can not be blank.")
        return value


class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = ['id', 'academic_year_code', 'academic_year_description', 'date_from', 'date_to', 'organization',
                  'is_active', 'created_by', 'created_at', 'updated_at']

    def validate_sesion_code(self, value):
        if not value:
            raise serializers.ValidationError("Academic_year_code cannot be empty .")
        return value

    def validate_date_from(self, value):
        if not value:
            raise serializers.ValidationError("date_from cannot be empty .")
        return value

    def validate_date_to(self, value):
        if not value:
            raise serializers.ValidationError("date_to cannot be empty .")
        return value

    def validate(self, attrs):
        """
        Validate that date_from is less than date_to.
        """
        date_from = attrs.get('date_from')
        date_to = attrs.get('date_to')

        if date_from and date_to and date_from >= date_to:
            raise serializers.ValidationError("date_from must be less than date_to.")

        return attrs


class AcademicYearUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = ['id', 'academic_year_code', 'academic_year_description', 'date_from', 'date_to', 'organization',
                  'is_active', 'updated_by', 'created_at', 'updated_at']
        extra_kwargs = {
            'updated_by': {'required': True},  # Make updated_by required
        }

    def validate_updated_by(self, value):
        if not value:
            raise serializers.ValidationError("updated_by required!! .")
        return value

    def validate_sesion_code(self, value):
        if not value:
            raise serializers.ValidationError("Session_code cannot be empty .")
        return value

    def validate_date_from(self, value):
        if not value:
            raise serializers.ValidationError("date_from cannot be empty .")
        return value

    def validate_date_to(self, value):
        if not value:
            raise serializers.ValidationError("date_to cannot be empty .")
        return value

    def validate(self, attrs):
        """
        Validate that date_from is less than date_to.
        """
        date_from = attrs.get('date_from')
        date_to = attrs.get('date_to')

        if date_from and date_to and date_from >= date_to:
            raise serializers.ValidationError("date_from must be less than date_to.")

        return attrs


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'course_name', 'description', 'is_active', 'created_by', 'created_at', 'updated_at']

    def validate_classname(self, value):
        if not value.strip():
            raise serializers.ValidationError("Course Name Can not be blank.")
        return value


class CourseUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'course_name', 'description', 'is_active', 'updated_by', 'created_at', 'updated_at']

    def validate_classname(self, value):
        if not value.strip():
            raise serializers.ValidationError("Course Name Can not be blank.")
        return value


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'department_code', 'department_description', 'organization', 'course', 'batch', 'hod_name',
                  'office_contact', 'is_active', 'created_by', 'created_at', 'updated_at']

    def validate_department_code(self, value):
        if not value.strip():
            raise serializers.ValidationError("Department Code Can not be blank.")
        return value


class DepartmentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'department_code', 'department_description', 'organization', 'course', 'batch', 'hod_name',
                  'office_contact', 'is_active', 'created_by', 'created_at', 'updated_at']

    def validate_department_code(self, value):
        if not value.strip():
            raise serializers.ValidationError("Department Code Can not be blank.")
        return value


class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = ['id', 'semester_code', 'semester_description', 'organization', 'course', 'batch', 'is_active',
                  'created_by', 'created_at', 'updated_at']

    def validate_semester_code(self, value):
        if not value.strip():
            raise serializers.ValidationError("Semester Code Can not be blank.")
        return value


class SemesterUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = ['id', 'semester_code', 'semester_description', 'organization', 'course', 'batch', 'is_active',
                  'created_by', 'created_at', 'updated_at']

    def validate_semester_code(self, value):
        if not value.strip():
            raise serializers.ValidationError("Semester Code Can not be blank.")
        return value


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['id', 'section_name', 'is_active', 'created_by', 'created_at', 'updated_at']

    def validate_sectio_nname(self, value):
        if not value.strip():
            raise serializers.ValidationError("Section Name Can not be blank.")
        return value


class SectionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['id', 'section_name', 'is_active', 'updated_by', 'created_at', 'updated_at']

    def validate_section_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Section Name Can not be blank.")
        return value


class CourseSemesterSectionBindSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseSemesterSectionBind
        fields = ['id', 'batch', 'course', 'semester', 'department', 'section', 'is_active', 'created_by', 'created_at',
                  'updated_at']

    def validate_course(self, value):
        if not Course.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Course with this ID does not exist.")
        return value

    def validate_section(self, value):
        if not Section.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Section with this ID does not exist.")
        return value


class CourseSemesterSectionBindUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseSemesterSectionBind
        fields = ['id', 'course', 'semester', 'department', 'section', 'is_active', 'updated_by', 'created_at',
                  'updated_at']

    def validate_course_name(self, value):
        if not Course.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Course with this ID does not exist.")
        return value

    def validate_section_name(self, value):
        if not Section.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Section with this ID does not exist.")
        return value


# class StudentRegistrationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Student_Registration
#         fields = ['id','academic_year','admission_no','parent_id','studentname','addmitted_class','addmitted_section','primary_guardian',
#                  'gender','date_of_admission','doj','fee_group','feeappfrom','rollno','barcode','registration_no',
#                   'school_admission_no','cbse_reg_no','house','religion','category','nativelanguage','bloodgroup','nationality',
#                   'email','dob','childreninfamily','studentaadharno','username','remarks','profile_pic','father_name',
#                   'father_profession','father_contact_number','father_email','father_aadharno','mother_name','mother_profession',
#                   'mother_contact_number','mother_email','mother_aadharno','residence_address','permanent_address','is_active','created_at','updated_at']


class StudentSiblingDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiblingDetail
        fields = ['id', 'sibling', 'is_active', 'created_by', 'created_at', 'updated_at']

    # def validate_student(self, value):
    #     if not value:
    #         raise serializers.ValidationError("Please choose a student.")
    #     # Check if the student_id exists in Student_Registration
    #     if not StudentRegistration.objects.filter(id=value.id).exists():
    #         raise serializers.ValidationError("The selected student does not exist.")
    #     return value

    def validate_sibling(self, value):
        if not value:
            raise serializers.ValidationError("Please choose a sibling.")
        # Check if the siblings_id exists in Student_Registration
        if not StudentRegistration.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("The selected sibling does not exist.")
        return value

    # def validate(self, data):
    #     # student_id = data.get('student')
    #     siblings_id = data.get('sibling')
    #
    #     # Ensure student_id and siblings_id are not the same
    #     if student_id.id == siblings_id.id:
    #         raise serializers.ValidationError("Student ID and Sibling ID cannot be the same.")
    #
    #     return data


class SiblingDetailUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiblingDetail
        fields = ['id', 'student', 'sibling', 'is_active', 'updated_by', 'created_at', 'updated_at']

    def validate_student_id(self, value):
        if not value:
            raise serializers.ValidationError("Please choose a student.")
        # Check if the student_id exists in Student_Registration
        if not StudentRegistration.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("The selected student does not exist.")
        return value

    def validate_siblings_id(self, value):
        if not value:
            raise serializers.ValidationError("Please choose a sibling.")
        # Check if the siblings_id exists in Student_Registration
        if not StudentRegistration.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("The selected sibling does not exist.")
        return value

    def validate(self, data):
        student_id = data.get('student')
        siblings_id = data.get('sibling')

        # Ensure student_id and siblings_id are not the same
        if student_id.id == siblings_id.id:
            raise serializers.ValidationError("Student and Sibling cannot be the same.")

        return data


class StudentEmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentEmergencyContact
        fields = ['id', 'student', 'name', 'relationship', 'mobile_number', 'remark', 'is_active', 'created_by',
                  'created_at', 'updated_at']

    def validate_student_id(self, value):
        if not value:
            raise serializers.ValidationError("Please choose a student.")
        # Check if the student_id exists in Student_Registration
        if not StudentRegistration.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("The selected student does not exist.")
        return value

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Name Can not be blank.")
        return value

    def validate_relationship(self, value):
        if not value.strip():
            raise serializers.ValidationError("Relationship Can not be blank.")
        return value

    def validate_mobile_number(self, value):
        if not value.strip():
            raise serializers.ValidationError("Mobile Number Can not be blank.")
        return value


class StudentEmergencyUpdateContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentEmergencyContact
        fields = ['id', 'student', 'name', 'relationship', 'mobile_number', 'remark', 'is_active', 'updated_by',
                  'created_at', 'updated_at']

    def validate_student(self, value):
        if not value:
            raise serializers.ValidationError("Please choose a student.")
        # Check if the student_id exists in Student_Registration
        if not StudentRegistration.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("The selected student does not exist.")
        return value

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Name Can not be blank.")
        return value

    def validate_relationship(self, value):
        if not value.strip():
            raise serializers.ValidationError("Relationship Can not be blank.")
        return value

    def validate_mobile_number(self, value):
        if not value.strip():
            raise serializers.ValidationError("Mobile Number Can not be blank.")
        return value


class AuthorisedPickupSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthorisedPickup
        fields = ['id', 'student', 'name', 'relationship', 'mobile_number', 'remark', 'is_active', 'created_by',
                  'created_at', 'updated_at']

    def validate_student(self, value):
        if not value:
            raise serializers.ValidationError("Please choose a student.")
        # Check if the student_id exists in Student_Registration
        if not StudentRegistration.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("The selected student does not exist.")
        return value

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Name Can not be blank.")
        return value

    def validate_relationship(self, value):
        if not value.strip():
            raise serializers.ValidationError("Relationship Can not be blank.")
        return value

    def validate_mobile_number(self, value):
        if not value.strip():
            raise serializers.ValidationError("Mobile Number Can not be blank.")
        return value


class AuthorisedPickupUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthorisedPickup
        fields = ['id', 'student', 'name', 'relationship', 'mobile_number', 'remark', 'is_active', 'updated_by',
                  'created_at', 'updated_at']

    def validate_student(self, value):
        if not value:
            raise serializers.ValidationError("Please choose a student.")
        # Check if the student_id exists in Student_Registration
        if not StudentRegistration.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("The selected student does not exist.")
        return value

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Name Can not be blank.")
        return value

    def validate_relationship(self, value):
        if not value.strip():
            raise serializers.ValidationError("Relationship Can not be blank.")
        return value

    def validate_mobile_number(self, value):
        if not value.strip():
            raise serializers.ValidationError("Mobile Number Can not be blank.")
        return value


class StudentDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentDocument
        fields = ['id', 'student', 'document_no', 'document_type', 'document_pic', 'start_from', 'end_to', 'is_active',
                  'created_by', 'created_at', 'updated_at']

    def validate_student_id(self, value):
        if not value:
            raise serializers.ValidationError("Please choose a student.")
        # Check if the student_id exists in Student_Registration
        if not StudentRegistration.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("The selected student does not exist.")
        return value

    def validate_document_no(self, value):
        if not value.strip():
            raise serializers.ValidationError("document_no Can not be blank.")
        return value

    def validate_document_type(self, value):
        if not value.strip():
            raise serializers.ValidationError("document_type Can not be blank.")
        return value


class StudentDocumentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentDocument
        fields = ['id', 'student', 'document_no', 'document_type', 'document_pic', 'start_from', 'end_to', 'is_active',
                  'created_by', 'created_at', 'updated_at']

    def validate_student_id(self, value):
        if not value:
            raise serializers.ValidationError("Please choose a student.")
        # Check if the student_id exists in Student_Registration
        if not StudentRegistration.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("The selected student does not exist.")
        return value

    def validate_document_no(self, value):
        if not value.strip():
            raise serializers.ValidationError("document_no Can not be blank.")
        return value

    def validate_document_type(self, value):
        if not value.strip():
            raise serializers.ValidationError("document_type Can not be blank.")
        return value


class StudentPreviousEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentPreviousEducation
        fields = ['id', 'student', 'name_of_institution', 'location', 'course_completed', 'year_from', 'year_to',
                  'language_of_instruction', 'transfer_certificate', 'result', 'is_active', 'created_by', 'created_at',
                  'updated_at']

    def validate_student(self, value):
        if not value:
            raise serializers.ValidationError("Please choose a student.")
        # Check if the student_id exists in Student_Registration
        if not StudentRegistration.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("The selected student does not exist.")
        return value

    def validate_name_of_institution(self, value):
        if not value.strip():
            raise serializers.ValidationError("name of school Can not be blank.")
        return value

    def validate_year_from(self, value):
        if not value:
            raise serializers.ValidationError("year_from Can not be blank.")
        return value

    def validate_year_to(self, value):
        if not value:
            raise serializers.ValidationError("year_to Can not be blank.")
        return value


class StudentPreviousEducationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentPreviousEducation
        fields = ['id', 'student', 'name_of_institution', 'location', 'class_completed', 'year_from', 'year_to',
                  'language_of_instruction', 'transfer_certificate', 'result', 'is_active', 'updated_by', 'created_at',
                  'updated_at']

    def validate_student(self, value):
        if not value:
            raise serializers.ValidationError("Please choose a student.")
        # Check if the student_id exists in Student_Registration
        if not StudentRegistration.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("The selected student does not exist.")
        return value

    def validate_name_of_institution(self, value):
        if not value.strip():
            raise serializers.ValidationError("name of school Can not be blank.")
        return value

    def validate_year_from(self, value):
        if not value:
            raise serializers.ValidationError("year_from Can not be blank.")
        return value

    def validate_year_to(self, value):
        if not value:
            raise serializers.ValidationError("year_to Can not be blank.")
        return value


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'organization_code', 'organization_description', 'is_active', 'created_by', 'created_at',
                  'updated_at']

    def validate_organization_code(self, value):
        if not value.strip():
            raise serializers.ValidationError("organization_code can not be blank.")
        return value

    def validate_organization_description(self, value):
        if not value.strip():
            raise serializers.ValidationError("organization_description can not be blank.")
        return value


class OrganizationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'organization_code', 'organization_description', 'is_active', 'updated_by', 'created_at',
                  'updated_at']

    def validate_organization_code(self, value):
        if not value.strip():
            raise serializers.ValidationError("organization_code can not be blank.")
        return value

    def validate_organization_description(self, value):
        if not value.strip():
            raise serializers.ValidationError("description can not be blank.")
        return value


# class BatchSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Batch
#         fields = ['id', 'organization','batch_code', 'batch_description','is_active','created_by', 'created_at', 'updated_at']
#
#     def validate_organization(self, value):
#         if not Organization.objects.filter(id=value.id).exists():
#             raise serializers.ValidationError("Organization with this ID does not exist.")
#         return value
#     def validate_branch_name(self, value):
#         if not value.strip():
#             raise serializers.ValidationError("branch_name can not be blank.")
#         return value
#
#
# class BatchUpdateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Batch
#         fields = ['id', 'organization', 'batch_description','is_active','updated_by', 'created_at', 'updated_at']
#
#     def validate_organization(self, value):
#         if not Organization.objects.filter(id=value.id).exists():
#             raise serializers.ValidationError("Organization with this ID does not exist.")
#         return value
#     def validate_batch_description(self, value):
#         if not value.strip():
#             raise serializers.ValidationError("branch_name can not be blank.")
#         return value
#

# class StudentRegistrationSerializer(serializers.ModelSerializer):
#     # Extra fields that are not in the model
#
#     transport_availed = serializers.BooleanField(required=False, allow_null=True,default=False)
#     choice_month = serializers.CharField(required=False, allow_null=True, allow_blank=True, default='')
#     route_id = serializers.IntegerField(required=False, allow_null=True,default=None)
#     rollno = serializers.IntegerField(required=False, allow_null=True, default=None)
#     primary_guardian = serializers.CharField(allow_null=True, required=False, allow_blank=True)
#     student_status = serializers.CharField(allow_null=True, required=False, allow_blank=True)
#
#     barcode = serializers.CharField(allow_null=True, required=False, allow_blank=True)
#     school_admission_no = serializers.IntegerField(allow_null=True, required=False,validators=[MinValueValidator(1)])
#     username = serializers.CharField(allow_null=True, required=False, allow_blank=True)
#
#     class Meta:
#         model = StudentRegistration
#         fields = ['id','academic_year','first_name','middle_name','last_name','addmitted_class','addmitted_section',
#                   'gender','date_of_admission','doj','barcode','registration_no','school_admission_no',
#                   'cbse_reg_no','house','religion','category','nativelanguage','rollno','primary_guardian','student_status',
#                   'bloodgroup','nationality','email','dob','childreninfamily','studentaadharno','username',
#                   'remarks','profile_pic','father_name','father_profession','father_contact_number','father_email','father_aadharno',
#                   'mother_name','mother_profession','mother_contact_number','mother_email','mother_aadharno',
#                   'transport_availed','choice_month','route_id','is_active','created_by']  # ,'fee_group','feeappfrom'
#
#     def validate_academic_year(self, value):
#         if not AcademicYear.objects.filter(id=value.id).exists():
#             raise serializers.ValidationError("AcademicYear with this ID does not exist.")
#         return value
#
#
#     def validate_first_name(self, value):
#         if not value.strip():
#             raise serializers.ValidationError("first_name can not be blank.")
#         return value
#
#     def validate_addmitted_class(self, value):
#         if not Class.objects.filter(id=value.id).exists():
#             raise serializers.ValidationError("addmitted_class with this ID does not exist.")
#         return value
#
#     def validate_addmitted_section(self, value):
#         if not Section.objects.filter(id=value.id).exists():
#             raise serializers.ValidationError("Section with this ID does not exist.")
#         return value
#     def validate_gender(self, value):
#         if not value.strip():
#             raise serializers.ValidationError("gender can not be blank.")
#         return value
#     def validate_date_of_admission(self, value):
#         if not value:
#             raise serializers.ValidationError("date_of_admission can not be blank.")
#         return value
#     def validate_doj(self, value):
#         if not value:
#             raise serializers.ValidationError("doj can not be blank.")
#         return value
#     def validate_house(self, value):
#         if not value.strip():
#             raise serializers.ValidationError("house can not be blank.")
#         return value
#     def validate_religion(self, value):
#         if not value.strip():
#             raise serializers.ValidationError("religion can not be blank.")
#         return value
#     def validate_category(self, value):
#         if not value.strip():
#             raise serializers.ValidationError("category can not be blank.")
#         return value
#     def validate_nationality(self, value):
#         if not value.strip():
#             raise serializers.ValidationError("nationality can not be blank.")
#         return value
#     def validate_dob(self, value):
#         if not value:
#             raise serializers.ValidationError("dob can not be blank.")
#         return value
#     def validate_father_name(self, value):
#         if not value.strip():
#             raise serializers.ValidationError("father_name can not be blank.")
#         return value
#
#     def validate_father_profession(self, value):
#         if not value.strip():
#             raise serializers.ValidationError("father_profession can not be blank.")
#         return value
#
#     def validate_father_contact_number(self, value):
#         if not value.strip():
#             raise serializers.ValidationError("father_contact_number can not be blank.")
#         return value
#
#     def validate_mother_name(self, value):
#         if not value.strip():
#             raise serializers.ValidationError("mother_name can not be blank.")
#         return value
#     def validate_mother_profession(self, value):
#         if not value.strip():
#             raise serializers.ValidationError("mother_profession can not be blank.")
#         return value
#     def validate_mother_contact_number(self, value):
#         if not value.strip():
#             raise serializers.ValidationError("mother_contact_number can not be blank.")
#         return value
#


class StudentCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentCourse
        fields = ['id', 'student', 'course', 'section', 'fee_group', 'fee_applied_from', 'enrollment_no', 'house',
                  'is_active', 'updated_by']


class FeeStructureMasterSerializer(serializers.ModelSerializer):
    # organization = serializers.SerializerMethodField()
    # course = serializers.SerializerMethodField()
    # academic_year = serializers.SerializerMethodField()
    # category = serializers.SerializerMethodField()

    class Meta:
        model = FeeStructureMaster
        fields = ['id', 'fee_structure_code', 'fee_structure_description', 'enabled', 'organization', 'branch', 'batch',
                  'course', 'department', 'academic_year', 'semester', 'version_no',
                  'category', 'new_existing', 'created_by']

    # def get_organization(self, obj):
    #     if obj.organization:
    #         return obj.organization.organization_description
    #     return None

    # def get_organization_id(self, obj):
    #     if obj.organization:
    #         return obj.organization.id
    #     return None

    # def get_course(self, obj):
    #     if obj.organization:
    #         return obj.course.course_name
    #     return None
    #
    # def get_academic_year(self, obj):
    #     if obj.organization:
    #         return obj.academic_year.academic_year_code
    #     return None
    #
    # def get_category(self, obj):
    #     if obj.category.category_name:
    #         return obj.category.category_name
    #     return None


class FeeStructureDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeStructureDetail
        fields = ['id', 'fee_structure_master', 'element_type', 'element_frequency', 'amount', 'period_1',
                  'period_2', 'period_3', 'period_4', 'period_5', 'period_6', 'adjustment_flag', 'is_active',
                  'created_by']


class FeeStructureDetailUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeStructureDetail
        fields = ['id', 'fee_structure_master', 'element_type', 'element_frequency', 'amount', 'period_1',
                  'period_2', 'period_3', 'period_4', 'period_5', 'period_6', 'adjustment_flag', 'updated_by']

        extra_kwargs = {
            'updated_by': {'required': True},  # Make updated_by required
        }

    def validate_updated_by(self, value):
        if not value:
            raise serializers.ValidationError("updated_by required!! .")
        return value


class PeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Period
        fields = ['id', 'period_name', 'period_description', 'fees_exempt', 'organization',
                  'no_of_months', 'sorting_order', 'academic_year', 'period_start_date', 'period_end_date', 'is_active',
                  'created_by']

    def validate_period_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("period_name required!! .")
        return value

    def validate_no_of_months(self, value):
        if not value:
            raise serializers.ValidationError("no_of_months required!! .")
        return value

    def validate_sorting_order(self, value):
        if not value:
            raise serializers.ValidationError("sorting_order required!! .")
        return value

    def validate_period_start_date(self, value):
        if not value:
            raise serializers.ValidationError("period_start_date required!! .")
        return value

    def validate_period_end_date(self, value):
        if not value:
            raise serializers.ValidationError("period_end_date required!! .")
        return value


class PeriodUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Period
        fields = ['id', 'period_name', 'period_description', 'fees_exempt', 'organization', 'batch',
                  'no_of_months', 'sorting_order', 'academic_year', 'period_start_date', 'period_end_date', 'is_active',
                  'updated_by']

    def validate_period_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("period_name required!! .")
        return value

    def validate_no_of_months(self, value):
        if not value:
            raise serializers.ValidationError("no_of_months required!! .")
        return value

    def validate_sorting_order(self, value):
        if not value:
            raise serializers.ValidationError("sorting_order required!! .")
        return value

    def validate_period_start_date(self, value):
        if not value:
            raise serializers.ValidationError("period_start_date required!! .")
        return value

    def validate_period_end_date(self, value):
        if not value:
            raise serializers.ValidationError("period_end_date required!! .")
        return value


class AddressSerializer(serializers.ModelSerializer):
    usertype = serializers.CharField(read_only=True)  # Add usertype as a read-only field

    class Meta:
        model = Address
        fields = ['id', 'reference_id', 'usertype', 'present_address', 'present_pincode', 'present_city',
                  'present_state', 'present_country',
                  'present_phone_number', 'permanent_address', 'permanent_pincode', 'permanent_city', 'permanent_state',
                  'permanent_country', 'permanent_phone_number', 'is_active', 'created_by']

    def validate_reference_id(self, value):
        if not value:
            raise serializers.ValidationError("reference_id required!! .")
        return value

    def validate_present_address(self, value):
        if not value.strip():
            raise serializers.ValidationError("present_address required!! .")
        return value

    def validate_present_pincode(self, present_pincode):
        if present_pincode is None:
            raise serializers.ValidationError("present_pincode must be required.")

        if present_pincode is not None and len(present_pincode) != 6:
            raise serializers.ValidationError("present_pincode must be exactly 6 digits.")
        return present_pincode

    def validate_present_city(self, value):
        if not value.strip():
            raise serializers.ValidationError("permanent_city required!! .")
        return value

    def validate_present_state(self, value):
        if not value.strip():
            raise serializers.ValidationError("present_state required!! .")
        return value

    def validate_present_country(self, value):
        if not value.strip():
            raise serializers.ValidationError("present_country required!! .")
        return value

    def validate_present_phone_number(self, present_phone_number):
        if present_phone_number:  # Check if phone number is provided
            if len(present_phone_number) != 10 or not present_phone_number.isdigit():
                raise serializers.ValidationError("present_phone_number must be exactly 10 digits.")
        return present_phone_number

    def validate_permanent_address(self, value):
        if not value.strip():
            raise serializers.ValidationError("permanent_address required!! .")
        return value

    def validate_permanent_pincode(self, permanent_pincode):
        if permanent_pincode is None:
            raise serializers.ValidationError("permanent_pincode must be required.")
        if permanent_pincode is not None and len(permanent_pincode) != 6:
            raise serializers.ValidationError("present_pincode must be exactly 6 digits.")
        return permanent_pincode

    def validate_permanent_city(self, value):
        if not value.strip():
            raise serializers.ValidationError("permanent_city required!! .")
        return value

    def validate_permanent_state(self, value):
        if not value.strip():
            raise serializers.ValidationError("permanent_state required!! .")
        return value

    def validate_permanent_country(self, value):
        if not value.strip():
            raise serializers.ValidationError("permanent_country required!! .")
        return value

    def validate_permanent_phone_number(self, permanent_phone_number):
        if permanent_phone_number:  # Check if phone number is provided
            if len(permanent_phone_number) != 10 or not permanent_phone_number.isdigit():
                raise serializers.ValidationError("permanent_phone_number must be exactly 10 digits.")
        return permanent_phone_number


class AddressUpdateSerializer(serializers.ModelSerializer):
    # usertype = serializers.CharField(read_only=True)  # Add usertype as a read-only field
    class Meta:
        model = Address
        fields = ['id', 'present_address', 'present_pincode', 'present_district', 'present_state', 'present_country',
                  'present_phone_number', 'permanent_address', 'permanent_pincode', 'permanent_district',
                  'permanent_state',
                  'permanent_country', 'permanent_phone_number', 'updated_by']

    # def validate_reference_id(self, value):
    #     if not value:
    #         raise serializers.ValidationError("reference_id required!! .")
    #     return value
    def validate_present_address(self, value):
        if not value.strip():
            raise serializers.ValidationError("present_address required!! .")
        return value

    def validate_present_pincode(self, present_pincode):
        if present_pincode is None:
            raise serializers.ValidationError("present_pincode must be required.")

        if present_pincode is not None and len(present_pincode) != 6:
            raise serializers.ValidationError("present_pincode must be exactly 6 digits.")
        return present_pincode

    def validate_present_district(self, value):
        if not value.strip():
            raise serializers.ValidationError("present_district required!! .")
        return value

    def validate_present_state(self, value):
        if not value.strip():
            raise serializers.ValidationError("present_state required!! .")
        return value

    def validate_present_country(self, value):
        if not value.strip():
            raise serializers.ValidationError("present_country required!! .")
        return value

    def validate_present_phone_number(self, present_phone_number):
        if present_phone_number:  # Check if phone number is provided
            if len(present_phone_number) != 10 or not present_phone_number.isdigit():
                raise serializers.ValidationError("present_phone_number must be exactly 10 digits.")
        return present_phone_number

    def validate_permanent_address(self, value):
        if not value.strip():
            raise serializers.ValidationError("permanent_address required!! .")
        return value

    def validate_permanent_pincode(self, permanent_pincode):
        if permanent_pincode is None:
            raise serializers.ValidationError("permanent_pincode must be required.")
        if permanent_pincode is not None and len(permanent_pincode) != 6:
            raise serializers.ValidationError("present_pincode must be exactly 6 digits.")
        return permanent_pincode

    def validate_permanent_district(self, value):
        if not value.strip():
            raise serializers.ValidationError("permanent_district required!! .")
        return value

    def validate_permanent_state(self, value):
        if not value.strip():
            raise serializers.ValidationError("permanent_state required!! .")
        return value

    def validate_permanent_country(self, value):
        if not value.strip():
            raise serializers.ValidationError("permanent_country required!! .")
        return value

    def validate_permanent_phone_number(self, permanent_phone_number):
        if permanent_phone_number:  # Check if phone number is provided
            if len(permanent_phone_number) != 10 or not permanent_phone_number.isdigit():
                raise serializers.ValidationError("permanent_phone_number must be exactly 10 digits.")
        return permanent_phone_number


class StudentDetailsGetSerializer(serializers.Serializer):
    academic_year_id = serializers.IntegerField()
    student_id = serializers.IntegerField()
    # class Meta:
    #     model = StudentRegistration
    #     fields = ['academic_year', 'id']


class StudentFeeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentFeeDetail
        fields = ['id', 'student', 'fee_structure_details', 'element_name', 'fee_applied_from', 'paid', 'academic_year',
                  'organization', 'multiplying_factor', 'element_amount', 'total_element_period_amount', 'paid_amount',
                  'remarks', 'reverse_flag', 'is_active', 'created_by', 'created_at', 'updated_at']


class FeeElementTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeElementType
        fields = ['id', 'element_name', 'element_description', 'branch', 'organization', 'sequence_order',
                  'element_type', 'is_active']


# class StudentGetBasedOnClassSectionSerializer(serializers.Serializer):
#     classId= serializers.IntegerField()
#     sectionId= serializers.IntegerField()

class StudentGetBasedOnCourseSectionSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True)
    branch_id = serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)
    course_ids = serializers.ListField(required=True)
    department_ids = serializers.ListField(required=True)
    academic_year_id = serializers.IntegerField(required=True)
    semester_ids = serializers.ListField(required=True)
    section_ids = serializers.ListField(required=True)


class FeeElementSerializer(serializers.Serializer):
    element_id = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    remarks = serializers.CharField(max_length=255)


class InsertFeesForSelectedStudent(serializers.Serializer):
    studentIds = serializers.ListField(
        child=serializers.IntegerField(), required=True
    )
    periodIds = serializers.ListField(
        child=serializers.IntegerField(), required=True
    )
    feeElementIds = serializers.ListField(
        child=FeeElementSerializer(), required=True
    )
    created_by = serializers.IntegerField(required=True)


class HouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = House
        fields = ['id', 'house_code', 'house_name', 'house_color', 'organization', 'is_active']


class ReligionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Religion
        fields = ['id', 'religion_code', 'religion_name', 'is_active']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'category_code', 'category_name', 'is_active']


class NationalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Nationality
        fields = ['id', 'nationality_code', 'nationality_name', 'is_active']


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'country_code', 'country_name', 'is_active']


class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ['id', 'country_id', 'state_code', 'state_name', 'is_active']


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'city_name', 'state_id', 'country_id', 'is_active']


class ProfessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profession
        fields = ['id', 'profession_code', 'profession_description', 'is_active']


class DocumentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'document_code', 'document_desc', 'is_active']


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'language_code', 'language_desc', 'is_active']


class MotherTongueSerializer(serializers.ModelSerializer):
    class Meta:
        model = MotherTongue
        fields = ['id', 'organization', 'branch', 'mother_tongue_code', 'mother_tongue_name', 'is_active']


class BloodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blood
        fields = ['id', 'blood_code', 'blood_name', 'is_active']


class GenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gender
        fields = ['id', 'organization', 'branch', 'gender_code', 'gender_name', 'is_active']

# student_details":[{"hostel_availed":true,"hostel_choice_semester":"[1, 2, 3, 4, 5, 6]","transport_availed":false,"choice_semester":""}],

# class StudentPromotionDetailSerializer(serializers.Serializer):
#     hostel_availed = serializers.BooleanField()
#     hostel_choice_semester = serializers.CharField(max_length=200,allow_null=True,allow_blank=True)
#     transport_availed = serializers.BooleanField()
#     choice_semester = serializers.CharField(max_length=200,allow_null=True,allow_blank=True)
#

class StudentPromotionSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(allow_null=False)
    branch_id = serializers.IntegerField(allow_null=False)
    batch_id = serializers.IntegerField(allow_null=False)
    course_id = serializers.IntegerField(allow_null=False)
    department_id = serializers.IntegerField(allow_null=False)
    next_academic_year_id = serializers.IntegerField(allow_null=False)
    next_semester_id = serializers.IntegerField(allow_null=False)
    next_section_id = serializers.IntegerField(allow_null=False)
    hostel_availed = serializers.BooleanField(default=False)
    hostel_choice_semester = serializers.BooleanField(default=False)
    student_id = serializers.ListField(
        child=serializers.IntegerField(), required=True
    )
    # student_details = serializers.ListSerializer(child=StudentPromotionDetailSerializer(), required=False)
    student_status = serializers.CharField(max_length=50, allow_null=False, allow_blank=False)
    created_by = serializers.IntegerField()


# class ADHOCELEMENTSERIALIZER(serializers.Serializer):
#     elementId = serializers.IntegerField()
#     amount = serializers.DecimalField(max_digits=10, decimal_places=2)
#     remarks = serializers.CharField(max_length=255)
#
#
# class ADHOCFEESASSIGNSERIALIZER(serializers.Serializer):
#     studentIds = serializers.CharField(required=True)  # Accept as a string
#     periodIds = serializers.CharField(required=True)  # Accept as a string
#     feeElementIds = serializers.CharField(required=True)  # Accept as a string (JSON-like structure)
#     created_by = serializers.IntegerField(required=True)
#
#     def validate(self, data):
#         # Convert studentIds and periodIds into lists of integers
#         data['studentIds'] = [int(id.strip()) for id in data['studentIds'].split(',')]
#         data['periodIds'] = [int(id.strip()) for id in data['periodIds'].split(',')]
#
#         # Parse feeElementIds as a JSON-like string, convert it into a list of dictionaries
#         try:
#             fee_elements_str = f"[{data['feeElementIds']}]"  # Wrap it in brackets to treat as a JSON list
#             fee_elements = json.loads(fee_elements_str)
#
#             # Validate each fee element with the nested serializer
#             for element in fee_elements:
#                 serializer = ADHOCELEMENTSERIALIZER(data=element)
#                 serializer.is_valid(raise_exception=True)
#
#             data['feeElementIds'] = fee_elements
#         except (ValueError, TypeError) as e:
#             raise serializers.ValidationError(f"Invalid format for feeElementIds: {str(e)}")
#
#         return data


# class ADHOCELEMENTSERIALIZER(serializers.Serializer):
#     elementId = serializers.IntegerField()
#     amount = serializers.DecimalField(max_digits=10, decimal_places=2)
#     remarks = serializers.CharField(max_length=255)
#
#
# class ADHOCFEESASSIGNSERIALIZER(serializers.Serializer):
#     studentIds = serializers.CharField(required=True)  # Accept as a string
#     periodIds = serializers.CharField(required=True)  # Accept as a string
#     feeElementIds = serializers.CharField(required=True)  # Accept as a comma-separated string
#     created_by = serializers.IntegerField(required=True)
#
#     def validate(self, data):
#         # Convert studentIds and periodIds into lists of integers
#         data['studentIds'] = [int(id.strip()) for id in data['studentIds'].split(',')]
#         data['periodIds'] = [int(id.strip()) for id in data['periodIds'].split(',')]
#
#         # Manually parse feeElementIds from the string format
#         fee_element_str = data['feeElementIds']
#         try:
#             # Split the string data into lists
#             element_ids = [int(e) for e in fee_element_str.split("'elementId':'")[1].split("'")[0].split(',')]
#             amounts = [float(a) for a in fee_element_str.split("'amount':'")[1].split("'")[0].split(',')]
#             remarks = fee_element_str.split("'remark':'")[1].split("'")[0].split(',')
#
#             # Combine them into a list of dictionaries
#             fee_elements = []
#             for i in range(len(element_ids)):
#                 fee_elements.append({
#                     'elementId': element_ids[i],
#                     'amount': amounts[i],
#                     'remarks': remarks[i].strip()
#                 })
#
#             # Validate each fee element with the nested serializer
#             for element in fee_elements:
#                 serializer = ADHOCELEMENTSERIALIZER(data=element)
#                 serializer.is_valid(raise_exception=True)
#
#             data['feeElementIds'] = fee_elements
#
#         except Exception as e:
#             raise serializers.ValidationError(f"Invalid format for feeElementIds: {str(e)}")
#
#         return data

# class StudentBasicDetailsSerializer(serializers.Serializer):
#     academic_year= serializers.IntegerField(allow_null=False)
#     admission_no= serializers.IntegerField(allow_null=True)
#     first_name = serializers.CharField(max_length=50,allow_null=False,allow_blank=False)
#     middle_name = serializers.CharField(max_length=50,allow_null=True,allow_blank=True)
#     last_name = serializers.CharField(max_length=50,allow_null=True,allow_blank=True)
#     addmitted_class = serializers.IntegerField(allow_null=False)
#     addmitted_section = serializers.IntegerField(allow_null=False)
#     gender = serializers.CharField(max_length=20,allow_null=False,allow_blank=False)
#     date_of_admission = serializers.DateTimeField(allow_null=False)
#     doj = serializers.DateField(allow_null=False)
#     barcode = serializers.CharField(max_length=50,null=True,blank=True)
#     registration_no = serializers.CharField(max_length=10, null=True, blank=True)
#     school_admission_no = serializers.IntegerField(allow_null=True)
#     cbse_reg_no = serializers.IntegerField(allow_null=True)
#     house = serializers.CharField(max_length=500, allow_null=False, allow_blank=False)
#     religion = serializers.CharField(max_length=500, allow_null=False, allow_blank=False)
#     category = serializers.CharField(max_length=100, allow_blank=False, allow_null=False)
#     nativelanguage = serializers.CharField(max_length=255, allow_null=False, allow_blank=False)
#     bloodgroup = serializers.CharField(max_length=255, allow_null=False, allow_blank=False)
#     nationality = serializers.CharField(max_length=255, allow_null=False, allow_blank=False)
#     email = serializers.EmailField(allow_null=True, allow_blank=True)
#     dob = serializers.DateField(allow_null=False)
#     childreninfamily = serializers.IntegerField(allow_null=True)
#     studentaadharno = serializers.CharField(max_length=12, allow_null=True, allow_blank=True)
#     username = serializers.CharField(max_length=255, allow_null=True, allow_blank=True)
#     remarks = serializers.CharField(max_length=255, allow_blank=True, allow_null=True)
#     profile_pic = serializers.ImageField(allow_null=True, allow_empty_file=True)
#     rollno = serializers.IntegerField(allow_null=True)
#     primary_guardian = serializers.CharField(max_length=255, allow_null=False, allow_blank=False)
#     student_status = serializers.CharField(max_length=50, allow_null=False, allow_blank=False)
#     father_name = serializers.CharField(max_length=255, allow_null=False, allow_blank=False)
#
#     fee_group = serializers.IntegerField(allow_null=False)
#     feeappfrom = serializers.IntegerField(allow_null=False)
#
#     father_profession= serializers.CharField(max_length=50,allow_null=False,allow_blank=False)
#     father_contact_number = serializers.CharField(max_length=10,allow_null=False,allow_blank=False)
#     father_email = serializers.EmailField(allow_null=True,allow_blank=True)
#     father_aadharno = serializers.CharField(max_length=12,allow_null=True,allow_blank=True)
#     mother_name = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)
#     mother_profession = serializers.CharField(max_length=50, allow_null=False, allow_blank=False)
#     mother_contact_number = serializers.CharField(max_length=10, allow_null=False, allow_blank=False)
#     mother_email = serializers.EmailField(allow_null=True, allow_blank=True)
#     mother_aadharno = serializers.CharField(max_length=12, allow_null=True, allow_blank=True)
#
#     created_by = serializers.IntegerField(allow_null=False)

class StudentBasicDetailSerializer(serializers.ModelSerializer):
    admission_no = serializers.CharField(required=False, allow_null=True, default=None)
    enrollment_no = serializers.CharField(required=False, allow_null=True, default=None)
    primary_guardian = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    status = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    barcode = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    children_in_family = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    remarks = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    college_admission_no = serializers.CharField(allow_null=True, required=False,
                                                 validators=[MinValueValidator(1)])
    user_name = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    referred_by = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    profile_pic = serializers.ImageField(required=False, allow_null=True)
    
    # Optional fields for student registration - using IntegerField for FK fields
    date_of_admission = serializers.DateField(required=False, allow_null=True)
    date_of_join = serializers.DateField(required=False, allow_null=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    email = serializers.EmailField(required=False, allow_null=True, allow_blank=True)
    student_aadhaar_no = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    registration_no = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    
    # Optional parent details
    father_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    father_profession = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    father_contact_number = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    father_email = serializers.EmailField(required=False, allow_null=True, allow_blank=True)
    father_aadhaar_no = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    mother_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    mother_profession = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    mother_contact_number = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    mother_email = serializers.EmailField(required=False, allow_null=True, allow_blank=True)
    mother_aadhaar_no = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = StudentRegistration
        fields = [
            'id', 'organization', 'branch', 'batch', 'admission_type', 'course', 'department', 'academic_year',
            'semester', 'section', 'admission_no', 'first_name', 'middle_name', 'last_name',
            'gender', 'date_of_admission',
            'date_of_join', 'barcode', 'registration_no', 'college_admission_no',
            'house', 'religion', 'category', 'mother_tongue',
            'enrollment_no', 'primary_guardian', 'status', 'blood',
            'nationality', 'email', 'date_of_birth', 'children_in_family', 'student_aadhaar_no',
            'user_name', 'remarks', 'referred_by', 'profile_pic', 'father_name',
            'father_profession', 'father_contact_number', 'father_email',
            'father_aadhaar_no', 'mother_name', 'mother_profession',
            'mother_contact_number', 'mother_email', 'mother_aadhaar_no', 'status',
            'is_active', 'created_by'
        ]

    def to_internal_value(self, data):
        # Handle empty string dates by converting them to None
        date_fields = ['date_of_admission', 'date_of_join', 'date_of_birth']
        for field in date_fields:
            if field in data and data[field] == '':
                data[field] = None
        return super().to_internal_value(data)

    def validate_first_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("first_name cannot be blank.")
        return value

    def validate_admission_type(self, value):
        if not value.strip():
            raise serializers.ValidationError("admission_type cannot be blank.")
        return value

    def validate_course(self, value):
        if not value:
            raise serializers.ValidationError("course cannot be blank.")
        return value

    def validate_section(self, value):
        if not value:
            raise serializers.ValidationError("section cannot be blank.")
        return value

    def validate_semester(self, value):
        if not value:
            raise serializers.ValidationError("semester cannot be blank.")
        return value

    # The following fields are now OPTIONAL for student registration:
    # gender, date_of_admission, date_of_join, house, religion, category,
    # nationality, date_of_birth, father_name, father_profession, 
    # father_contact_number, mother_name, mother_profession, mother_contact_number

    def validate_email(self, value):
        if value and StudentRegistration.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value


class StudentBasicDetailUpdateSerializer(serializers.ModelSerializer):
    admission_no = serializers.IntegerField(required=False, allow_null=True, default=None)
    enrollment_no = serializers.IntegerField(required=False, allow_null=True, default=None)
    primary_guardian = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    status = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    barcode = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    college_admission_no = serializers.IntegerField(allow_null=True, required=False, validators=[MinValueValidator(1)])
    user_name = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    referred_by = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    profile_pic = serializers.ImageField(required=False, allow_null=True)
    registration_no = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    children_in_family = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    remarks = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    student_aadhaar_no = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = StudentRegistration

        fields = [
            'id', 'academic_year', 'organization', 'branch', 'admission_type', 'department', 'semester', 'batch',
            'admission_no', 'first_name',
            'middle_name', 'last_name',
            'course', 'section', 'gender', 'date_of_admission',
            'date_of_join', 'barcode', 'registration_no', 'college_admission_no',
            'house', 'religion', 'category', 'mother_tongue',
            'enrollment_no', 'primary_guardian', 'status', 'blood',
            'nationality', 'email', 'date_of_birth', 'children_in_family', 'student_aadhaar_no',
            'user_name', 'remarks', 'referred_by', 'profile_pic', 'father_name',
            'father_profession', 'father_contact_number', 'father_email',
            'father_aadhaar_no', 'mother_name', 'mother_profession',
            'mother_contact_number', 'mother_email', 'mother_aadhaar_no',
            'is_active', 'created_by'
        ]

    # def validate_email(self, value):
    #     if not value.strip():
    #         raise serializers.ValidationError("admission cannot be blank.")
    #     return value

    def validate_first_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("first_name cannot be blank.")
        return value

    # Strict validators for optional fields (gender, house, religion, etc.) have been removed 
    # to allow updates with partial data or empty values.


class StudentFeeAppliedDetail(serializers.Serializer):
    fee_group = serializers.IntegerField(allow_null=False, required=True)
    fee_applied_from = serializers.IntegerField(allow_null=False, required=True)


class StudentTransportAvailedDetail(serializers.Serializer):
    transport_availed = serializers.BooleanField(allow_null=True, default=False)
    choice_semester = serializers.ListField(allow_null=True, default=None)
    route_id = serializers.IntegerField(allow_null=True, default=None)
    route_detail = serializers.IntegerField(allow_null=True, default=None)


class AddressDetailsSerializer(serializers.ModelSerializer):
    usertype = serializers.CharField(read_only=True)  # Add usertype as a read-only field
    
    # Make all fields optional
    present_address = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    present_pincode = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    present_city = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    present_state = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    present_country = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    present_phone_number = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    permanent_address = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    permanent_pincode = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    permanent_city = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    permanent_state = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    permanent_country = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    permanent_phone_number = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Address
        fields = ['id', 'usertype', 'present_address', 'present_pincode', 'present_city',
                  'present_state', 'present_country',
                  'present_phone_number', 'permanent_address', 'permanent_pincode', 'permanent_city',
                  'permanent_state',
                  'permanent_country', 'permanent_phone_number', 'is_active']

        # def validate_reference_id(self, value):
        #     if not value:
        #         raise serializers.ValidationError("reference_id required!! .")
        #     return value

        def validate_present_address(self, value):
            if not value.strip():
                raise serializers.ValidationError("present_address required!! .")
            return value

        def validate_present_pincode(self, present_pincode):
            if present_pincode is None:
                raise serializers.ValidationError("present_pincode must be required.")

            if present_pincode is not None and len(present_pincode) != 6:
                raise serializers.ValidationError("present_pincode must be exactly 6 digits.")
            return present_pincode

        def validate_present_district(self, value):
            if not value.strip():
                raise serializers.ValidationError("present_district required!! .")
            return value

        def validate_present_state(self, value):
            if not value.strip():
                raise serializers.ValidationError("present_state required!! .")
            return value

        def validate_present_country(self, value):
            if not value.strip():
                raise serializers.ValidationError("present_country required!! .")
            return value

        def validate_present_phone_number(self, present_phone_number):
            if present_phone_number:  # Check if phone number is provided
                if len(present_phone_number) != 10 or not present_phone_number.isdigit():
                    raise serializers.ValidationError("present_phone_number must be exactly 10 digits.")
            return present_phone_number

        def validate_permanent_address(self, value):
            if not value.strip():
                raise serializers.ValidationError("permanent_address required!! .")
            return value

        def validate_permanent_pincode(self, permanent_pincode):
            if permanent_pincode is None:
                raise serializers.ValidationError("permanent_pincode must be required.")
            if permanent_pincode is not None and len(permanent_pincode) != 6:
                raise serializers.ValidationError("present_pincode must be exactly 6 digits.")
            return permanent_pincode

        def validate_permanent_district(self, value):
            if not value.strip():
                raise serializers.ValidationError("permanent_district required!! .")
            return value

        def validate_permanent_state(self, value):
            if not value.strip():
                raise serializers.ValidationError("permanent_state required!! .")
            return value

        def validate_permanent_country(self, value):
            if not value.strip():
                raise serializers.ValidationError("permanent_country required!! .")
            return value

        def validate_permanent_phone_number(self, permanent_phone_number):
            if permanent_phone_number:  # Check if phone number is provided
                if len(permanent_phone_number) != 10 or not permanent_phone_number.isdigit():
                    raise serializers.ValidationError("permanent_phone_number must be exactly 10 digits.")
            return permanent_phone_number


# class StudentSiblingDetailSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = SiblingDetails
#         fields = '__all__'
#
#     def validate_siblings_id(self, value):
#         if not value:
#             raise serializers.ValidationError("Please choose a sibling.")
#         # Check if the siblings_id exists in Student_Registration
#         if not StudentRegistration.objects.filter(id=value.id).exists():
#             raise serializers.ValidationError("The selected sibling does not exist.")
#         return value
#

class StudentEmergencyContactDetailsSerializer(serializers.ModelSerializer):
    # Make all fields optional
    name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    relationship = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    mobile_number = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    remark = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = StudentEmergencyContact
        fields = ['id', 'name', 'relationship', 'mobile_number', 'remark', 'is_active', 'created_at', 'updated_at']


class AuthorisedPickupDetailsSerializer(serializers.ModelSerializer):
    # Make all fields optional
    name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    relationship = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    mobile_number = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    remark = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = AuthorisedPickup
        fields = ['id', 'name', 'relationship', 'mobile_number', 'remark', 'address', 'email', 'is_active', 'created_at', 'updated_at']


class StudentDocumentDetailsSerializer(serializers.ModelSerializer):
    # Make all fields optional
    document_no = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    document_type = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = StudentDocument
        fields = ['id', 'document_no', 'document_type', 'document_pic', 'document_url', 'start_from', 'end_to',
                  'is_active', 'created_at',
                  'updated_at']


class StudentPreviousEducationDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentPreviousEducation
        fields = ['id', 'name_of_institution', 'location', 'course_completed', 'year_from', 'year_to',
                  'language_of_instruction', 'transfer_certificate', 'result', 'is_active', 'created_at', 'updated_at']

    def validate_name_of_school(self, value):
        if not value.strip():
            raise serializers.ValidationError("name of school Can not be blank.")
        return value

    def validate_year_from(self, value):
        if not value:
            raise serializers.ValidationError("year_from Can not be blank.")
        return value

    def validate_year_to(self, value):
        if not value:
            raise serializers.ValidationError("year_to Can not be blank.")
        return value


class StudentRegistrationSerializer(serializers.Serializer):
    student_basic_detail = StudentBasicDetailSerializer(required=True)
    fee_detail = StudentFeeAppliedDetail(required=True)
    transport_detail = StudentTransportAvailedDetail(required=False, allow_null=True)
    address_detail = AddressDetailsSerializer(required=False, allow_null=True)
    sibling_detail = serializers.ListSerializer(child=StudentSiblingDetailSerializer(), required=False)
    emergency_contact = serializers.ListSerializer(child=StudentEmergencyContactDetailsSerializer(), required=False)
    authorized_pickup = serializers.ListSerializer(child=AuthorisedPickupDetailsSerializer(), required=False)
    document_detail = serializers.ListSerializer(child=StudentDocumentDetailsSerializer(), required=False)
    previous_education_detail = serializers.ListSerializer(child=StudentPreviousEducationDetailsSerializer(),
                                                           required=False)


class StudentRegistrationListSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(allow_null=False, required=True, error_messages={
        'required': 'organization_id and branch_id is required.'})
    branch_id = serializers.IntegerField(allow_null=False, required=True,
                                         error_messages={'required': 'organization_id and branch_id is required.'})
    batch_id = serializers.IntegerField(allow_null=True, required=False)
    course_id = serializers.IntegerField(allow_null=True, required=False)
    department_id = serializers.IntegerField(allow_null=True, required=False)
    academic_year_id = serializers.IntegerField(allow_null=True, required=False)
    semester_id = serializers.IntegerField(allow_null=True, required=False)
    section_id = serializers.IntegerField(allow_null=True, required=False)
    student_name = serializers.CharField(allow_null=True, required=False)
    gender = serializers.IntegerField(allow_null=True, required=False)
    admission_no = serializers.CharField(allow_null=True, required=False)
    from_date = serializers.DateField(allow_null=True, required=False)
    to_date = serializers.DateField(allow_null=True, required=False)
    student_status = serializers.CharField(allow_null=True, required=False)
    barcode = serializers.CharField(allow_null=True, required=False)
    college_admission_no = serializers.CharField(allow_null=True, required=False)
    father_name = serializers.CharField(allow_null=True, required=False)
    mother_name = serializers.CharField(allow_null=True, required=False)

    # def validate(self, data):
    #     # Ensure that at least one field is provided
    #     if not (data.get('organization_id') and data.get('branch_id')):
    #         # return Response({"message":"organization_id and branch_is is required !!!"},status=status.HTTP_400_BAD_REQUEST)
    #         raise serializers.ValidationError(
    #             "organization_id and branch_id is required !!!")
    #     return data


class FeeStructureDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeStructureDetail
        fields = ['id', 'element_type', 'element_frequency', 'amount', 'semester_1',
                  'semester_2', 'semester_3', 'semester_4', 'semester_5', 'semester_6', 'semester_7', 'semester_8',
                  'adjustment_flag', 'is_active']


class FeeStructureMasterRequestSerializer(serializers.Serializer):
    fee_structure_master_detail = FeeStructureMasterSerializer(required=True)
    fee_structure_detail = serializers.ListSerializer(child=FeeStructureDetailsSerializer(), required=True)


class StudentRegistrationUpdateSerializer(serializers.Serializer):
    student_basic_detail = StudentBasicDetailUpdateSerializer(required=True)
    # feeDetails= StudentFeeAppliedDetails(required=True)
    # transportDetails= StudentTransport_availedDetails(required=False)
    address_detail = AddressDetailsSerializer(required=False, allow_null=True)
    sibling_detail = serializers.ListSerializer(child=StudentSiblingDetailSerializer(), required=False)
    emergency_contact = serializers.ListSerializer(child=StudentEmergencyContactDetailsSerializer(), required=False)
    authorized_pickup = serializers.ListSerializer(child=AuthorisedPickupDetailsSerializer(), required=False)
    document_detail = serializers.ListSerializer(child=StudentDocumentDetailsSerializer(), required=False)
    previous_education_detail = serializers.ListSerializer(child=StudentPreviousEducationDetailsSerializer(),
                                                           required=False)


class StudentFilterSerializer(serializers.Serializer):
    student_id = serializers.IntegerField(required=False)
    barcode = serializers.CharField(required=False)
    school_admission_no = serializers.IntegerField(required=False)

    def validate(self, data):
        # Ensure that at least one field is provided
        if not (data.get('student_id') or data.get('barcode') or data.get('school_admission_no')):
            raise serializers.ValidationError(
                "At least one of 'student_id', 'barcode', or 'school_admission_no' must be provided.")
        return data


# class GetFeeDetailsBasedOnAcademicyearStudentId(serializers.Serializer):
#     studentId= serializers.IntegerField()
#     academicyearId = serializers.IntegerField()


class studentFeeDetailsSerializer(serializers.Serializer):
    student_fee_details_id = serializers.IntegerField()
    update_amount = serializers.DecimalField(max_digits=18, decimal_places=2)
    update_flag = serializers.BooleanField(allow_null=True)
    remove_flag = serializers.BooleanField(allow_null=True)

    def validate(self, data):
        # If both 'updateflag' and 'removeflag' are missing
        if data.get('update_flag') is None and data.get('remove_flag') is None:
            raise serializers.ValidationError({
                "update_flag/remove_flag": "At least one of 'update_flag' or 'remove_flag' is required."
            })

        # If 'updateflag' is True, then 'updateamount' must have a value
        if data.get('update_flag') is True and data.get('update_amount') is None:
            raise serializers.ValidationError({
                "update_amount": "This field is required when 'update_flag' is True."
            })

        return data


class StudentfeeElementUpdate(serializers.Serializer):
    fee_element = serializers.CharField()
    student_id = serializers.IntegerField()
    # academicyearId = serializers.IntegerField()
    update_amount = serializers.DecimalField(max_digits=18, decimal_places=2)
    update_flag = serializers.BooleanField(allow_null=True)
    remove_flag = serializers.BooleanField(allow_null=True)

    def validate(self, data):
        # Check if 'Feeelement' is present
        if not data.get('fee_element'):
            raise serializers.ValidationError({"fee_element": "This field is required."})

        # Check if 'studentId' is present
        if data.get('student_id') is None:
            raise serializers.ValidationError({"student_id": "This field is required."})

        # Check if 'academicyearId' is present
        # if data.get('academicyearId') is None:
        #     raise serializers.ValidationError({"academicyearId": "This field is required."})

        # If both 'updateflag' and 'removeflag' are missing
        if data.get('update_flag') is None and data.get('remove_flag') is None:
            raise serializers.ValidationError({
                "update_flag/remove_flag": "At least one of 'update_flag' or 'remove_flag' is required."
            })

        # If 'updateflag' is True, then 'updateamount' must have a value
        if data.get('update_flag') is True and data.get('update_amount') is None:
            raise serializers.ValidationError({
                "update_amount": "This field is required when 'update_amount' is True."
            })

        return data


class NewFeeStructureDetailsSerializer(serializers.Serializer):
    student_id = serializers.IntegerField(allow_null=False, required=True,
                                          error_messages={'required': 'Student ID is required.'})
    # academic_year_id = serializers.IntegerField(allow_null=False, required=True, error_messages={'required': 'Academic Year ID is required.'})
    element_name = serializers.CharField(allow_null=False, allow_blank=False, required=True,
                                         error_messages={'required': 'Element name is required.'})
    frequency_id = serializers.IntegerField(allow_null=False, required=True,
                                            error_messages={'required': 'Frequency ID is required.'})
    # semester_id = serializers.IntegerField(allow_null=False,required=True,error_messages={'required': 'semester_id is required.'})
    # period_month = serializers.CharField(allow_null=False, allow_blank=False, required=True, error_messages={'required': 'Period month is required.'})
    organization_id = serializers.IntegerField(allow_null=False, required=True,
                                               error_messages={'required': 'Organization ID is required.'})
    branch_id = serializers.IntegerField(allow_null=False, required=True,
                                         error_messages={'required': 'Branch ID is required.'})
    amount = serializers.DecimalField(max_digits=18, decimal_places=2, allow_null=False, required=True,
                                      error_messages={'required': 'Amount is required.'})
    semester_1 = serializers.IntegerField(allow_null=True, required=False)
    semester_2 = serializers.IntegerField(allow_null=True, required=False)
    semester_3 = serializers.IntegerField(allow_null=True, required=False)
    semester_4 = serializers.IntegerField(allow_null=True, required=False)
    semester_5 = serializers.IntegerField(allow_null=True, required=False)
    semester_6 = serializers.IntegerField(allow_null=True, required=False)
    semester_7 = serializers.IntegerField(allow_null=True, required=False)
    semester_8 = serializers.IntegerField(allow_null=True, required=False)


class StudentFeeManageSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(allow_null=False, required=True,
                                               error_messages={'required': 'organization_id is required.'})
    branch_id = serializers.IntegerField(allow_null=False, required=True,
                                         error_messages={'required': 'branch_id is required.'})
    loginUser = serializers.IntegerField(allow_null=False, required=True,
                                         error_messages={'required': 'Login user ID is required.'})
    studentIndividualFeeDetails = serializers.ListSerializer(child=studentFeeDetailsSerializer(), required=False)
    studentFeeDetails = serializers.ListSerializer(child=StudentfeeElementUpdate(), required=False)
    addfeeElement = serializers.ListSerializer(child=NewFeeStructureDetailsSerializer(), required=False)

    def validate(self, data):
        login_user = data.get('loginUser')

        if login_user is None:
            raise serializers.ValidationError({"loginUser": "Login user ID is required."})

        return data


class FeeFrequencySerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeFrequency
        fields = ['id', 'fee_frequency_name', 'frequency_period', 'is_active']

    def validate_fee_frequency_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("FeeFrequency_name Can not be blank.")
        return value

    def validate_frequency_period(self, value):
        if not value:
            raise serializers.ValidationError("frequency_period Can not be blank.")
        return value


class CopyFeeStructureSerializers(serializers.Serializer):
    loginUser = serializers.IntegerField(allow_null=False, required=True,
                                         error_messages={'required': 'login user required.'})
    # academicyearId = serializers.IntegerField(allow_null=False, required=True,error_messages={'required': 'Academic year Id is required.'})
    # previous_academicyearId = serializers.IntegerField(allow_null=False, required=True,
    #                                           error_messages={'required': 'Previous Academic year Id is required.'})

    # previous_fee_structure_id = serializers.IntegerField(allow_null=False, required=True,error_messages={'required': 'Previous Fee Structure ID is required.'})
    organization_id = serializers.IntegerField(allow_null=False, required=True,
                                               error_messages={'required': 'organization_id is required.'})
    branch_id = serializers.IntegerField(allow_null=False, required=True,
                                         error_messages={'required': 'branch_id is required.'})
    previous_fee_structure_ids = serializers.ListSerializer(child=serializers.IntegerField(), allow_null=False,
                                                            required=True, error_messages={
            'required': 'fee_structure_ids is required.', 'invalid': 'fee_structure_ids must be a list of integers.'})
    batch_ids = serializers.ListSerializer(child=serializers.IntegerField(), allow_null=False, required=True,
                                           error_messages={'required': 'Batch_ids is required.',
                                                           'invalid': 'Batch_ids must be a list of integers.'})
    course_ids = serializers.ListSerializer(child=serializers.IntegerField(), allow_null=False, required=True,
                                            error_messages={'required': 'Course_ids is required.',
                                                            'invalid': 'Course_ids must be a list of integers.'})
    department_ids = serializers.ListSerializer(child=serializers.IntegerField(), allow_null=False, required=True,
                                                error_messages={'required': 'department_ids is required.',
                                                                'invalid': 'department_ids must be a list of integers.'})
    academic_year_ids = serializers.ListSerializer(child=serializers.IntegerField(), allow_null=False, required=True,
                                                   error_messages={'required': 'academic_year_ids is required.',
                                                                   'invalid': 'academic_year_ids must be a list of integers.'})
    semester_ids = serializers.ListSerializer(child=serializers.IntegerField(), allow_null=False, required=True,
                                              error_messages={'required': 'semester_ids is required.',
                                                              'invalid': 'semester_ids must be a list of integers.'})
    fee_frequency_list = serializers.ListSerializer(
        child=serializers.ListSerializer(child=serializers.IntegerField(allow_null=True), allow_null=True,
                                         required=False), allow_null=True, required=True,
        error_messages={'required': 'fee_frequency_list is required.',
                        'invalid': 'fee_frequency_list must be a list of list of integer eg. [[1,2,3,4]].'})


class GetClubBasedOnCourseDepartmentSerializer(serializers.Serializer):
    organization = serializers.IntegerField(required=True)
    branch_id = serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)
    club_id = serializers.IntegerField(required=False)
    course_id = serializers.IntegerField(required=True)
    department_id = serializers.IntegerField(required=False)


class GetClubSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True)
    branch_id = serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=False)
    club_group_id = serializers.IntegerField(required=False)
    club_id = serializers.IntegerField(required=False)
    # course_id = serializers.IntegerField(required=True)
    # department_id = serializers.IntegerField(required=False)


class GetClubGroupSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True)
    branch_id = serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=False)
    club_group_id = serializers.IntegerField(required=False)
    # course_id = serializers.IntegerField(required=True)
    # department_id = serializers.IntegerField(required=False)


# class GetSemesterSubjectListSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = SemesterSubject
#         fields=['id','course_department_subject','semester']

class GetSubjectBasedOnCourseDepartmentSemesterSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True)
    branch_id = serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)
    course_id = serializers.IntegerField(required=False)
    department_id = serializers.IntegerField(required=False)
    academic_year_id = serializers.IntegerField(required=False)
    semester_id = serializers.IntegerField(required=False)
    subject_group_id = serializers.IntegerField(required=False)


class GetSubjectBasedOnLectureSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True)
    branch_id = serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)
    course_id = serializers.IntegerField(required=True)
    department_id = serializers.IntegerField(required=False)
    academic_year_id = serializers.IntegerField(required=True)
    semester_id = serializers.IntegerField(required=False)
    section_id = serializers.IntegerField(required=False)
    lecture_id = serializers.IntegerField(required=False)
    date = serializers.DateField(required=True)
    # subject_group_id= serializers.IntegerField(required=False)


class GetStudentListBasedOnGroupCourseSubjectSerializer(serializers.Serializer):
    academic_year_id = serializers.IntegerField(required=True)
    organization = serializers.IntegerField(required=True)
    branch_id = serializers.IntegerField(required=True)
    subject_group_id = serializers.IntegerField(required=False)
    course_id = serializers.IntegerField(required=False)
    section_id = serializers.IntegerField(required=False)
    student_id = serializers.IntegerField(required=False)


class StudentListBasedOnClubSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(allow_null=False, required=True)
    branch_id = serializers.IntegerField(allow_null=False, required=True)
    batch_id = serializers.IntegerField(allow_null=True, required=False)
    course_id = serializers.IntegerField(allow_null=True, required=False)
    department_id = serializers.IntegerField(allow_null=True, required=False)
    academic_year_id = serializers.IntegerField(allow_null=True, required=False)
    semester_id = serializers.IntegerField(allow_null=True, required=False)
    section_id = serializers.IntegerField(allow_null=True, required=False)
    club_group_id = serializers.IntegerField(allow_null=True, required=False)
    club_id = serializers.IntegerField(allow_null=True, required=False)
    student_id = serializers.IntegerField(allow_null=True, required=False)


# class StudentGetBasedOnClassGroupSection(serializers.Serializer):
#     class

class StudentGroupBasedOnCourseSection(serializers.Serializer):
    studentId = serializers.IntegerField()
    course_name = serializers.CharField()
    section_name = serializers.CharField()
    enrollment_no = serializers.IntegerField()
    studentName = serializers.CharField()
    school_admission_no = serializers.IntegerField()
    barcode = serializers.CharField()
    father_name = serializers.CharField()
    mother_name = serializers.CharField()
    house = serializers.CharField()
    subject_name = serializers.CharField()


class ClubUpdateSerializer(serializers.Serializer):
    clubmasterId = serializers.IntegerField()
    organization = serializers.IntegerField()
    branch_id = serializers.IntegerField()
    academic_year_id = serializers.IntegerField()


class StudentClubUpdateCreateSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(allow_null=False)
    branch_id = serializers.IntegerField(allow_null=False)
    # batch_id = serializers.IntegerField(allow_null=False)
    # course_id = serializers.IntegerField(allow_null=False)
    # department_id = serializers.IntegerField(allow_null=False)
    # academic_year_id = serializers.IntegerField(allow_null=False)
    # semester_id = serializers.IntegerField(allow_null=False)
    # semester_id = serializers.IntegerField(allow_null=False)
    club_group_ids = serializers.ListField(allow_null=False)
    club_ids = serializers.ListField(allow_null=False)
    student_ids = serializers.ListField(allow_null=False)


class StudentFilterBasedOnIdBarcodeAdmissionNoSerializer(serializers.Serializer):
    flag = serializers.BooleanField()
    student_id = serializers.IntegerField(allow_null=True)
    student_course_id = serializers.IntegerField(allow_null=True)
    barcode = serializers.CharField(allow_null=True, allow_blank=True)
    college_admission_no = serializers.IntegerField(allow_null=True)
    academic_year_id = serializers.IntegerField(allow_null=True)

    # def validate(self, data):
    #     # Get a list of fields that are not null or empty
    #     filled_fields = [field for field in ['studentId', 'barcode', 'schooladmissionno'] if data.get(field)]
    #
    #     # Check that at least one field is provided
    #     if not filled_fields:
    #         raise serializers.ValidationError(
    #             "At least one of 'studentId', 'barcode', or 'schooladmissionno' must be provided."
    #         )
    #
    #     # Check that at most one field is provided
    #     if len(filled_fields) > 1:
    #         raise serializers.ValidationError(
    #             "Only one of 'studentId', 'barcode', or 'schooladmissionno' can be provided at a time."
    #         )
    #
    #     return data


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['id', 'payment_method', 'payment_method_desc', 'organization', 'branch', 'is_active']


def validate_payment_details(value):
    if not isinstance(value, dict):
        raise ValidationError("Must be a JSON object")

    # required_keys = ["name", "age"]
    required_keys = []
    if value["payment_type"].lower() == 'bank':
        required_keys = ["payment_type","beneficiary_bank_id", "beneficiary_account_id", "reference_date", "total_amount", "reference"]
        for key in required_keys:
            if key not in value:
                raise ValidationError(f"Missing key: {key}")
        if not isinstance(value["payment_type"], str):
            raise ValidationError("payment_type must be string")

        if not isinstance(value["beneficiary_bank_id"], int):
            raise ValidationError("Beneficiary bank_id must be integer")

        if not isinstance(value["beneficiary_account_id"], int):
            raise ValidationError("beneficiary_account_id must be integer")

        if not isinstance(value["reference_date"], str):
            raise ValidationError("reference_date must be string")

        if not isinstance(value["total_amount"], int):
            raise ValidationError("total_amount must be integer")

        if not isinstance(value["reference"], str):
            raise ValidationError("reference must be string")

    if value["payment_type"].lower() == 'cash':
        required_keys = ["payment_type","reference_date", "total_amount", "reference"]
        for key in required_keys:
            if key not in value:
                raise ValidationError(f"Missing key: {key}")

        if not isinstance(value["payment_type"], str):
            raise ValidationError("payment_type must be string")

        if not isinstance(value["reference_date"], str):
            raise ValidationError("reference_date must be string")

        if not isinstance(value["total_amount"], int):
            raise ValidationError("total_amount must be integer")

        if not isinstance(value["reference"], str):
            raise ValidationError("reference must be string")

    if value["payment_type"].lower() == 'cheque':
        required_keys = ["payment_type","cheque_number", "cheque_bank_name", "cheque_branch_name", "reference_date", "total_amount", "reference",
                       "beneficiary_bank_id", "beneficiary_account_id"]
        for key in required_keys:
            if key not in value:
                raise ValidationError(f"Missing key: {key}")

        if not isinstance(value["payment_type"], str):
            raise ValidationError("payment_type must be string")

        if not isinstance(value["cheque_number"], int):
            raise ValidationError("cheque_number must be integer")

        if not isinstance(value["cheque_bank_name"], str):
            raise ValidationError("cheque_bank_name must be string")

        if not isinstance(value["cheque_branch_name"], str):
            raise ValidationError("cheque_branch_name must be string")

        if not isinstance(value["reference_date"], str):
            raise ValidationError("reference_date must be string")

        if not isinstance(value["total_amount"], int):
            raise ValidationError("total_amount must be integer")

        if not isinstance(value["reference"], str):
            raise ValidationError("reference must be string")

        if not isinstance(value["beneficiary_bank_id"], int):
            raise ValidationError("beneficiary_bank must be integer")

        if not isinstance(value["beneficiary_account_id"], int):
            raise ValidationError("beneficiary_account_id must be integer")

    if value["payment_type"].lower() == 'dd':
        required_keys = ["payment_type","dd_number", "issuing_bank_name", "reference_date", "total_amount", "reference", "beneficiary_bank_id",
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

        if not isinstance(value["total_amount"], int):
            raise ValidationError("total_amount must be integer")

        if not isinstance(value["reference"], str):
            raise ValidationError("reference must be string")

        if not isinstance(value["beneficiary_bank_id"], int):
            raise ValidationError("beneficiary_bank must be integer")

        if not isinstance(value["beneficiary_account_id"], int):
            raise ValidationError("beneficiary_account_id must be integer")

    if value["payment_type"].lower() == 'rtgs_neft':
        required_keys = ["payment_type","utr_number", "sender_bank_name", "account_number", "reference_date", "total_amount", "reference",
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

        if not isinstance(value["total_amount"], int):
            raise ValidationError("total_amount must be integer")

        if not isinstance(value["reference"], str):
            raise ValidationError("reference must be string")

        if not isinstance(value["beneficiary_bank_id"], int):
            raise ValidationError("beneficiary_bank must be integer")

        if not isinstance(value["beneficiary_account_id"], int):
            raise ValidationError("beneficiary_account_id must be integer")

    if value["payment_type"].lower() == 'upi':
        required_keys = ["utr_number", "reference_date", "total_amount", "reference", "beneficiary_bank_id",
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

        if not isinstance(value["total_amount"], int):
            raise ValidationError("total_amount must be integer")

        if not isinstance(value["reference"], str):
            raise ValidationError("reference must be string")

        if not isinstance(value["beneficiary_bank_id"], int):
            raise ValidationError("beneficiary_bank must be integer")

        if not isinstance(value["beneficiary_account_id"], int):
            raise ValidationError("beneficiary_account_id must be integer")



class StudentFeeReceiptSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(allow_null=False)
    branch_id = serializers.IntegerField(allow_null=False)
    batch_id = serializers.IntegerField(allow_null=False)
    course_id = serializers.IntegerField(allow_null=False)
    department_id = serializers.IntegerField(allow_null=False)
    academic_year_id = serializers.IntegerField(allow_null=False)
    semester_ids = serializers.ListField(allow_null=False)  # list of periods
    login_id = serializers.IntegerField(allow_null=False)
    student_id = serializers.IntegerField(allow_null=False)

    receipt_date = serializers.DateField(allow_null=False)
    payment_method_id = serializers.IntegerField(allow_null=False)
    # bank_id = serializers.IntegerField(allow_null=True)
    # account_number = serializers.IntegerField(allow_null=True)
    remarks = serializers.CharField(allow_null=True, allow_blank=True, required=False)  # payment remark
    # reference_date = serializers.DateField(allow_null=False)
    student_fee_details_ids = serializers.ListField(allow_null=False)

    late_fee = serializers.DecimalField(max_digits=18, decimal_places=2, allow_null=True)
    discount_fee = serializers.DecimalField(max_digits=18, decimal_places=2, allow_null=True)
    check_bounce_fee = serializers.DecimalField(max_digits=18, decimal_places=2, allow_null=True)
    readmission_fees = serializers.DecimalField(max_digits=18, decimal_places=2, allow_null=True)
    # total_amount = serializers.DecimalField(max_digits=18, decimal_places=2, allow_null=True)
    payment_detail = serializers.JSONField(validators=[validate_payment_details])

class SubjectGroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseDepartmentSubject
        fields = ['id', 'subject_group', 'subject_group_desc', 'organization', 'branch_id', 'sorting_order',
                  'is_active']


class StudentFeeReceiptSearchSerializer(serializers.Serializer):
    academic_year_id = serializers.IntegerField(allow_null=False)
    course = serializers.IntegerField(allow_null=True)
    section = serializers.IntegerField(allow_null=True)
    studentId = serializers.IntegerField(allow_null=True)
    receipt_from = serializers.DateField(allow_null=True)
    receipt_to = serializers.DateField(allow_null=True)
    receiptNo = serializers.IntegerField(allow_null=True)
    view_receipt = serializers.BooleanField(default=True)
    view_cancel_receipt = serializers.BooleanField(default=False)
    feePeriod = serializers.IntegerField(allow_null=True)


class MessageTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageType
        fields = ['id', 'messageType', 'messageType_desc', 'message_default_text', 'academic_year_id', 'is_active']


class MessageInitiatedSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageInitiated
        fields = ['id', 'InitiatedBy', 'InitiatedBy_desc', 'academic_year_id', 'is_active']


class StudentMessageHistorySerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(allow_null=False)
    branch_id = serializers.IntegerField(allow_null=False)
    batch_id = serializers.IntegerField(allow_null=False)
    course_id = serializers.IntegerField(allow_null=True)
    department_id = serializers.IntegerField(allow_null=True)
    academic_year_id = serializers.IntegerField(allow_null=True)
    semester_id = serializers.IntegerField(allow_null=True)
    section_id = serializers.IntegerField(allow_null=True)
    login_id = serializers.IntegerField()
    message_type = serializers.IntegerField()
    message_date = serializers.DateField()
    message_time = serializers.TimeField()
    message_sent_to = serializers.CharField()
    # academic_year = serializers.IntegerField()
    student_ids = serializers.ListField(allow_null=False)
    message_list = serializers.ListField(allow_null=False)
    initiated_by_ids = serializers.ListField(allow_null=False)
    # initiated_by = serializers.IntegerField(allow_null=False)
    initiated_remark_list = serializers.ListField(allow_null=False)
    # initiated_remarks = serializers.CharField(allow_null=False)


class StudentMessageHistoryFilterSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(allow_null=False, required=True)
    branch_id = serializers.IntegerField(allow_null=False, required=True)
    batch_id = serializers.IntegerField(allow_null=True, required=False)
    course_id = serializers.IntegerField(allow_null=True, required=False)
    department_id = serializers.IntegerField(allow_null=True, required=False)
    academic_year_id = serializers.IntegerField(allow_null=True, required=False)
    semester_id = serializers.IntegerField(allow_null=True, required=False)
    section_id = serializers.IntegerField(allow_null=True, required=False)
    message_type = serializers.IntegerField(allow_null=True, required=False)
    student_id = serializers.IntegerField(allow_null=True, required=False)
    # student_id= serializers.IntegerField(allow_null=True)
    initiated_by = serializers.IntegerField(allow_null=True, required=False)
    date_from = serializers.DateField(allow_null=True, required=False)
    date_to = serializers.DateField(allow_null=True, required=False)


class StudentFeeReceiptCancelSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(allow_null=False)
    branch_id = serializers.IntegerField(allow_null=False)
    receipt_id = serializers.IntegerField(allow_null=False)
    cancel_remark = serializers.CharField(allow_null=False, allow_blank=False)


class EmployeeMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeMaster
        fields = ['id', 'organization', 'branch_id', 'employee_code', 'nuid', 'title', 'first_name', 'middle_name', 'last_name',
                  'marital_status', 'gender',
                  'nationality', 'religion', 'email', 'phone_number', 'office_email', 'employee_type',
                  'date_of_joining', 'date_of_leaving', 'payroll_group', 'place_of_birth',
                  'blood_group', 'highest_qualification', 'emergency_contact_number', 'mother_tongue', 'status',
                  'is_active', 'created_by']


# class StudentAssignmentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = StudentAssignment
#         fields = ['id','academic_year_id','course_id','section_id','subject_id','assignment_date','assignment_file','assignment_details','organization','branch_id',
#         'class_period_id','teacher_id','send_sms','sms_sent_to','is_active','created_by','created_at','updated_at']


class StudentAssignmentSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(allow_null=False)
    branch_id = serializers.IntegerField(allow_null=False)
    batch_id = serializers.IntegerField(allow_null=False)
    course_id = serializers.IntegerField(allow_null=False)
    department_id = serializers.IntegerField(allow_null=False)
    academic_year_id = serializers.IntegerField(allow_null=False)
    semester_id = serializers.IntegerField(allow_null=False)
    section_id = serializers.IntegerField(allow_null=False)
    subject_id = serializers.IntegerField(allow_null=False)
    assignment_date = serializers.DateField()
    assignment_file = serializers.FileField(required=False, allow_null=True)
    assignment_details = serializers.CharField(max_length=2000, allow_null=True, allow_blank=True)

    lecture_id = serializers.IntegerField(allow_null=False)
    professor_id = serializers.IntegerField(allow_null=False)
    send_sms = serializers.CharField(max_length=1, allow_blank=True, allow_null=True)
    sms_sent_to = serializers.CharField(max_length=1, allow_blank=True, allow_null=True)
    created_by = serializers.IntegerField(allow_null=False)


class StudentAssignmentSearchSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(allow_null=False, required=True)
    branch_id = serializers.IntegerField(allow_null=False, required=True)
    batch_id = serializers.IntegerField(allow_null=True, required=False)
    course_id = serializers.IntegerField(allow_null=True, required=False)
    department_id = serializers.IntegerField(allow_null=True, required=False)
    academic_year_id = serializers.IntegerField(allow_null=True, required=False)
    semester_id = serializers.IntegerField(allow_null=True, required=False)
    section_id = serializers.IntegerField(allow_null=True, required=False)
    lecture_id = serializers.IntegerField(allow_null=True, required=False)
    subject_id = serializers.IntegerField(allow_null=True, required=False)
    professor_id = serializers.IntegerField(allow_null=True, required=False)
    assignment_date = serializers.DateField(allow_null=True, required=False)
    # assignment_file = serializers.FileField(required=False, allow_null=True)
    # assignment_details = serializers.CharField(max_length=2000,allow_null=True,allow_blank=True)

    # send_sms = serializers.CharField(max_length=1,allow_blank=True,allow_null=True)
    # sms_sent_to = serializers.CharField(max_length=1,allow_blank=True,allow_null=True)
    # created_by = serializers.IntegerField(allow_null=False)


class StudentAssignmentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAssignment
        fields = ['id', 'organization', 'branch', 'batch', 'course', 'department', 'academic_year', 'semester',
                  'section', 'subject', 'assignment_date', 'assignment_file', 'assignment_details',
                  'lecture_period', 'professor', 'send_sms', 'sms_sent_to', 'updated_by', 'created_at', 'updated_at']


class StudentCircularSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(allow_null=False)
    branch_id = serializers.IntegerField(allow_null=False)
    batch_id = serializers.IntegerField(allow_null=True, required=False)
    batch_ids = serializers.ListField(allow_null=True, required=False)
    course_ids = serializers.ListField(allow_null=False, allow_empty=False)
    department_ids = serializers.ListField(allow_null=False, allow_empty=False)
    academic_year_ids = serializers.ListField(allow_null=False)
    semester_ids = serializers.ListField(allow_null=False, allow_empty=False)
    section_ids = serializers.ListField(allow_null=False, allow_empty=False)
    circular_date = serializers.DateField(allow_null=False)
    circular_file = serializers.FileField(allow_null=True, allow_empty_file=True)
    # circular_file_url = serializers.CharField(allow_null=True,allow_blank=True)
    circular_detail = serializers.CharField(allow_null=False, allow_blank=False)
    initiated_by = serializers.IntegerField(allow_null=False)

    circular_status = serializers.CharField(allow_null=True, allow_blank=True)
    send_sms = serializers.CharField(allow_null=True, allow_blank=True)
    message_status = serializers.CharField(allow_blank=True, allow_null=True)
    circular_sent_to = serializers.CharField(allow_null=True, allow_blank=True)
    circular_time = serializers.TimeField(allow_null=False)
    created_by = serializers.IntegerField(allow_null=False)


class CircularMessageFilterSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(allow_null=False, required=True)
    branch_id = serializers.IntegerField(allow_null=False, required=True)
    batch_id = serializers.IntegerField(allow_null=True, required=False)
    course_ids = serializers.ListField(allow_null=True, required=False)
    department_ids = serializers.ListField(allow_null=True, required=False)
    academic_year_ids = serializers.ListField(allow_null=True, required=False)
    semester_ids = serializers.ListField(allow_null=True, required=False)
    section_ids = serializers.ListField(allow_null=True, required=False)
    circular_date = serializers.DateField(allow_null=True, required=False)
    initiatedBy = serializers.IntegerField(allow_null=True, required=False)


class CircularMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentCircular

        fields = ['id', 'organization', 'branch', 'batch', 'course', 'department', 'academic_year', 'semester',
                  'section', 'circular_date', 'circular_file',
                  'circular_details', 'initiated_by',
                  'circular_status', 'send_sms', 'message_status', 'circular_sent_to', 'circular_time', 'is_active',
                  'updated_by']


class SearchStudentListSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(allow_null=False, required=True)
    branch_id = serializers.IntegerField(allow_null=False, required=True)
    batch_id = serializers.IntegerField(allow_null=True, required=False)
    course_id = serializers.IntegerField(allow_null=True, required=False)
    department_id = serializers.IntegerField(allow_null=True, required=False)
    # <<<<<<< HEAD
    #     academic_year_id = serializers.IntegerField(allow_null=True,required=False)
    #     semester_id = serializers.IntegerField(allow_null=True,required=False)
    #     section_id = serializers.IntegerField(allow_null=True,required=False)
    #     student_id = serializers.IntegerField(allow_null=True,required=False)
    #     student_name = serializers.CharField(allow_null=True,required=False)
    #     admission_no = serializers.CharField(allow_null=True,required=False)
    #     barcode = serializers.CharField(allow_null=True,required=False)
    #     father_name = serializers.CharField(allow_null=True,required=False)
    #     mother_name = serializers.CharField(allow_null=True,required=False)
    #     college_admission_no = serializers.CharField(allow_null=True,required=False)
    hostel_availed = serializers.CharField(allow_null=True, required=False)
    # =======
    academic_year_id = serializers.IntegerField(allow_null=True, required=False)
    semester_id = serializers.IntegerField(allow_null=True, required=False)
    section_id = serializers.IntegerField(allow_null=True, required=False)
    student_id = serializers.IntegerField(allow_null=True, required=False)
    student_name = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    admission_no = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    registration_no = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    barcode = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    father_name = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    mother_name = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    college_admission_no = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    mentor_id = serializers.IntegerField(allow_null=True, required=False)
    teacher_id = serializers.IntegerField(allow_null=True, required=False)
    search_query = serializers.CharField(allow_null=True, required=False, allow_blank=True)

    def validate(self, data):
        # Convert empty strings to None for integer fields
        for field in ['batch_id', 'course_id', 'department_id', 'academic_year_id',
                      'semester_id', 'section_id', 'student_id', 'mentor_id', 'teacher_id']:
            if field in data and data[field] == '':
                data[field] = None

        # Convert empty strings to None for string fields
        for field in ['student_name', 'admission_no', 'barcode', 'father_name',
                      'mother_name', 'college_admission_no', 'search_query']:
            if field in data and data[field] == '':
                data[field] = None

        return data





class StudentCourseUpdateSerializer(serializers.Serializer):
    # studentId = serializers.IntegerField(allow_null=False)
    login_id = serializers.IntegerField(allow_null=False)
    organization_id = serializers.IntegerField(allow_null=False)
    branch_id = serializers.IntegerField(allow_null=False)
    batch_id = serializers.IntegerField(allow_null=False)
    course_id = serializers.IntegerField(allow_null=False)
    department_id = serializers.IntegerField(allow_null=False)
    academic_year_id = serializers.IntegerField(allow_null=False)
    semester_id = serializers.IntegerField(allow_null=False)
    section_id = serializers.IntegerField(allow_null=False)
    # enrollment_no = serializers.IntegerField(allow_null=True)
    # registration_no = serializers.IntegerField(allow_null=True)
    # barcode = serializers.IntegerField(allow_null=True)
    house_id = serializers.CharField(allow_null=True, allow_blank=True)
    fee_group_id = serializers.IntegerField(allow_null=True)
    fee_applied_from_id = serializers.IntegerField(allow_null=True)
    transport_availed = serializers.BooleanField(default=True)
    choice_semester = serializers.ListField(allow_null=True, allow_empty=True)
    route_id = serializers.IntegerField(allow_null=True)
    amount = serializers.DecimalField(max_digits=18, decimal_places=2, allow_null=True)
    previous_year_balance = serializers.DecimalField(max_digits=18, decimal_places=2, allow_null=True)
    update_or_confirm = serializers.CharField(allow_null=False, allow_blank=False,
                                              max_length=1)  # for update U & confirm C
    carry_or_delete = serializers.CharField(allow_null=True, allow_blank=True, max_length=1)  # for carry C & Delete D


class FeeReceiptUpdateSerializer(serializers.Serializer):
    receipt_date = serializers.DateField(allow_null=False)
    payment_method = serializers.IntegerField(allow_null=False)
    bank_id = serializers.IntegerField(allow_null=True)
    account_number = serializers.IntegerField(allow_null=True)
    payment_reference = serializers.CharField(allow_null=True, allow_blank=True)
    reference_date = serializers.DateField(allow_null=False)


# class BankSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Bank
#         fields = ['id', 'bank_name','is_active']


class BankAccountDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccountDetail
        fields = ['id', 'bank', 'branch_name', 'bank_branch_address', 'bank_account', 'ifsc', 'swift_code',
                  'account_type', 'organization', 'branch_id', 'is_active']


class FeeLedgerSerializer(serializers.Serializer):
    academic_year_id = serializers.IntegerField(allow_null=False)
    studentId = serializers.IntegerField(allow_null=True)
    course = serializers.IntegerField(allow_null=True)
    section = serializers.IntegerField(allow_null=True)
    statusdata = serializers.BooleanField(default=True)
    fromperiod = serializers.IntegerField(allow_null=True)
    toperiod = serializers.IntegerField(allow_null=True)
    report = serializers.IntegerField(allow_null=True)
    showfees = serializers.CharField(default='F', allow_null=False, allow_blank=False)
    showbalancefees = serializers.BooleanField(default=True)


class studentsearchconfirmSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(allow_null=False, required=True)
    branch_id = serializers.IntegerField(allow_null=False, required=True)
    batch_id = serializers.IntegerField(allow_null=True, required=False)
    course_id = serializers.IntegerField(allow_null=True, required=False)
    department_id = serializers.IntegerField(allow_null=True, required=False)
    academic_year_id = serializers.IntegerField(allow_null=True, required=False)
    semester_id = serializers.IntegerField(allow_null=True, required=False)
    section_id = serializers.IntegerField(allow_null=True, required=False)
    studentId = serializers.IntegerField(allow_null=True, required=False)
    statusdata = serializers.CharField(allow_null=True, required=False)
    college_admission_no = serializers.CharField(allow_null=True, required=False)
    admission_no = serializers.CharField(allow_null=True, required=False)
    barcode = serializers.CharField(allow_null=True, required=False)
    student_name = serializers.CharField(allow_null=True, required=False)
    father_name = serializers.CharField(allow_null=True, required=False)
    mother_name = serializers.CharField(allow_null=True, required=False)


class StudentFeeDueReceiptSerializer(serializers.Serializer):
    academic_year_id = serializers.IntegerField(allow_null=False)
    studentIds = serializers.ListField(allow_null=False, allow_empty=False)
    feeappfrom = serializers.IntegerField(allow_null=False)


class StudentFeeBalanceReceiptSerializer(serializers.Serializer):
    academic_year_id = serializers.IntegerField(allow_null=False)
    studentIds = serializers.ListField(allow_null=False, allow_empty=False)
    fee_applied_from = serializers.IntegerField(allow_null=False)
    fee_applied_to = serializers.IntegerField(allow_null=True)


class StudentPaymentMethodWiseFeesSerializer(serializers.Serializer):
    academic_year_id = serializers.IntegerField(allow_null=False)
    studentIds = serializers.ListField(allow_null=False, allow_empty=False)


class studentperiodwiseSerializer(serializers.Serializer):
    academic_year_id = serializers.IntegerField(allow_null=False)
    studentIds = serializers.ListField(allow_null=False, allow_empty=False)
    feeappfrom = serializers.IntegerField(allow_null=False)
    feeappto = serializers.IntegerField(allow_null=False)


# Manish sir API's

# class CertificateSerializer(serializers.ModelSerializer):
#     transfer_certificate_id = serializers.IntegerField(write_only=True)
#
#     class Meta:
#         model = StudentCertificate
#         fields = [
#             'student',
#             # 'session',
#             'organization',
#             'branch',
#             'tc_applied_date',
#             'reason_for_tc',
#             'tc_issued_date',
#             'transfer_certificate_id',
#             'transfer_certificate_no',
#             'transfer_certificate_no_prefix',
#             'transfer_certificate_no_postfix',
#             'ncc_cadet_details',
#             'games_played_details',
#             'general_conduct',
#             'other_remarks',
#             'status',
#             # 'school_board_last_taken',
#             'whether_failed',
#             'subjects_studied',
#             'qualified_for_promotion',
#             'month_fee_paid',
#             'fee_concession_availed',
#             'total_no_working_days',
#             'total_no_working_days_present',
#             'document_type',
#             'cancelled_on',
#             'cancelled_remarks',
#             'cancelled_by',
#             'enrollment_no',
#             'cultural_activities',
#             'other_activities',
#             'marks_obtained',
#             'from_month',
#             'to_month',
#             'course_last_studied',
#         ]


#
# # Manish sir API's
#
class StudentTCSerializer(serializers.Serializer):
    # certificate_type = serializers.CharField(required=True,allow_null=False)
    student_id = serializers.IntegerField(required=True,allow_null=False)
    issue_date = serializers.DateField(required=True,allow_null=False)
    date_of_leaving = serializers.DateField(required=True,allow_null=False)
    reason_of_leaving = serializers.CharField(required=True,allow_null=False)
    student_behaviour = serializers.CharField(required=True,allow_null=False)
    readmission_eligibility = serializers.CharField(required=True,allow_null=False)
    certificate_status = serializers.CharField(required=True, allow_null=False)


class StudentCCSerializer(serializers.Serializer):
    # certificate_type = serializers.CharField(required=True,allow_null=False)
    student_id = serializers.IntegerField(required=True,allow_null=False)
    issue_date = serializers.DateField(required=True,allow_null=False)
    student_behaviour = serializers.CharField(required=True,allow_null=False)
    certificate_status = serializers.CharField(required=True, allow_null=False)

class StudentBCSerializer(serializers.Serializer):
    # certificate_type = serializers.CharField(required=True,allow_null=False)
    student_id = serializers.IntegerField(required=True,allow_null=False)
    issue_date = serializers.DateField(required=True,allow_null=False)
    purpose = serializers.CharField(required=True,allow_null=False)
    certificate_status = serializers.CharField(required=True, allow_null=False)

class StudentFCSerializer(serializers.Serializer):
    # certificate_type = serializers.CharField(required=True,allow_null=False)
    student_id = serializers.IntegerField(required=True,allow_null=False)
    issue_date = serializers.DateField(required=True,allow_null=False)
    purpose = serializers.CharField(required=True,allow_null=False)
    certificate_status = serializers.CharField(required=True, allow_null=False)




class StudentTransferCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentTransferCertificate
        fields = ['id','student','issue_date','date_of_leaving','reason_of_leaving','student_behaviour','readmission_eligibility','created_at','created_by','updated_by','updated_at']

class StudentCharacterCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentCharacterCertificate
        fields = ['id','student','cc_number','issue_date','purpose','created_at','created_by','updated_by','updated_at']

class StudentBonafideCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentBonafideCertificate
        fields = ['id','student','bc_number','issue_date','purpose','created_at','created_by','updated_by','updated_at']

class StudentFeeCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentFeeCertificate
        fields = ['id','student','fc_number','issue_date','purpose','created_at','created_by','updated_by','updated_at']

class StudentCertificateSerializer(serializers.Serializer):
    student_transfer_certificate = StudentTransferCertificateSerializer()
    student_character_certificate = StudentTransferCertificateSerializer()
    student_bonafide_certificate = StudentTransferCertificateSerializer()
    student_fee_certificate = StudentTransferCertificateSerializer()
    # student_transfer_certificate = serializers.ListSerializer(
    #     child=serializers.Serializer(StudentTransferCertificateSerializer,allow_null=True,allow_empty=True),
    # )
    # student_character_certificate = serializers.ListSerializer(
    #     child = serializers.Serializer(StudentCharacterCertificateSerializer, allow_null=True, allow_empty=True),
    # )
    # student_bonafide_certificate = serializers.ListSerializer(
    #     child=serializers.Serializer(StudentBonafideCertificateSerializer, allow_null=True, allow_empty=True),
    # )
    # student_fee_certificate = serializers.ListSerializer(
    #     child=serializers.Serializer(StudentFeeCertificateSerializer, allow_null=True, allow_empty=True),
    # )




# class StudentCertificateSerializer(serializers.ModelSerializer):
#     # certificate_id = serializers.IntegerField(write_only=True)
#     class Meta:
#         model=StudentCertificate
#         fields = [
#             'student',
#
#             'organization',
#             'branch',
#             'batch',
#             # 'academic_year',
#             'certificate_applied_date',
#             'reason_for_tc',
#             'certificate_issued_date',
#             'certificate_id',
#             'certificate_no',
#             'certificate_no_prefix',
#             'certificate_no_postfix',
#             'ncc_cadet_details',
#             'games_played_details',
#             'general_conduct',
#             'other_remarks',
#             'status',
#             # 'school_board_last_taken',
#             'whether_failed',
#             'subjects_studied',
#             'qualified_for_promotion',
#             'month_fee_paid',
#             'fee_concession_availed',
#             'total_no_working_days',
#             'total_no_working_days_present',
#             'document_type',
#             'cancelled_on',
#             'cancelled_remarks',
#             'cancelled_by',
#             'enrollment_no',
#             'cultural_activities',
#             'other_activities',
#             'marks_obtained',
#             'from_month',
#             'to_month',
#             'course_last_studied',
#         ]
#

class TransferCertificateFilterSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(allow_null=False, required=True)
    branch_id = serializers.IntegerField(allow_null=False, required=True)
    batch_id = serializers.IntegerField(allow_null=False, required=False)
    course_id = serializers.IntegerField(allow_null=False, required=False)
    department_id = serializers.IntegerField(allow_null=False, required=False)
    academic_year_id = serializers.IntegerField(allow_null=False, required=False)
    semester_id = serializers.IntegerField(allow_null=False, required=False)
    section_id = serializers.IntegerField(allow_null=False, required=False)
    student_id = serializers.IntegerField(allow_null=False, required=False)

    status = serializers.IntegerField(allow_null=False, required=False)
    document_type = serializers.CharField(max_length=100, required=False, allow_blank=True)
    date_from = serializers.DateField(allow_null=True, required=False)
    date_to = serializers.DateField(allow_null=True, required=False)


class GetCertificateDetailsBasedOnStudentId(serializers.Serializer):
    academic_year_id = serializers.IntegerField(allow_null=False, required=True)
    orgId = serializers.IntegerField(allow_null=False, required=True)
    branchId = serializers.IntegerField(allow_null=False, required=True)
    studentId = serializers.IntegerField(allow_null=False, required=True)
    document_type = serializers.CharField(allow_null=False, required=True)
    transfer_certificate_id = serializers.IntegerField(allow_null=True, required=False)


class AttendanceSearchSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(allow_null=False, required=True)
    branch_id = serializers.IntegerField(allow_null=False, required=True)
    batch_id = serializers.IntegerField(allow_null=True, required=False)
    course_id = serializers.IntegerField(allow_null=True, required=False)
    department_id = serializers.IntegerField(allow_null=True, required=False)
    academic_year_id = serializers.IntegerField(allow_null=True, required=False)
    semester_id = serializers.IntegerField(allow_null=True, required=False)
    section_id = serializers.IntegerField(allow_null=True, required=False)
    lecture_period_id = serializers.IntegerField(allow_null=True, required=False)
    subject_id = serializers.IntegerField(allow_null=True, required=False)
    professor_id = serializers.IntegerField(allow_null=True, required=False)
    student_id = serializers.IntegerField(allow_null=True, required=False)
    date = serializers.DateField(allow_null=True, required=False)
    from_date = serializers.DateField(allow_null=True, required=False)
    to_date = serializers.DateField(allow_null=True, required=False)


class AttendanceUpdateSerializer(serializers.Serializer):
    student_id = serializers.IntegerField(allow_null=False, required=True)
    father_contact_number = serializers.CharField(max_length=10, allow_null=True, allow_blank=True, validators=[
        RegexValidator(
            regex=r'^\d{10}$',
            message="father contact number must be exactly 10 digits."
        )
    ])

    mother_contact_number = serializers.CharField(max_length=10, allow_null=True, allow_blank=True, validators=[
        RegexValidator(
            regex=r'^\d{10}$',
            message="mother contact number must be exactly 10 digits."
        )
    ])
    mark_Attendance = serializers.CharField(max_length=1, allow_null=False, allow_blank=False, required=True)
    remarks = serializers.CharField(allow_null=True, allow_blank=True, required=False)
    send_sms_to = serializers.CharField(max_length=1, allow_null=False, allow_blank=False, required=True)
    # is_sms_send = serializers.CharField(max_length=1, allow_null=False, allow_blank=False, required=True)


class StudentAttendanceSerializer(serializers.Serializer):
    login_id = serializers.IntegerField(allow_null=False, required=True)

    organization_id = serializers.IntegerField(allow_null=False, required=True)
    branch_id = serializers.IntegerField(allow_null=False, required=True)
    batch_id = serializers.IntegerField(allow_null=False, required=True)
    course_id = serializers.IntegerField(allow_null=False, required=True)
    department_id = serializers.IntegerField(allow_null=False, required=True)
    academic_year_id = serializers.IntegerField(allow_null=False, required=True)
    semester_id = serializers.IntegerField(allow_null=False, required=True)
    section_id = serializers.IntegerField(allow_null=False, required=True)
    date = serializers.DateField(allow_null=False, required=True)

    lecture_id = serializers.IntegerField(allow_null=False, required=True)
    subject_id = serializers.IntegerField(allow_null=False, required=True)
    professor_id = serializers.IntegerField(allow_null=False, required=True)
    update_detail = serializers.ListSerializer(child=AttendanceUpdateSerializer(), required=True)


class TimeTableSerializer(serializers.Serializer):
    academic_year_id = serializers.IntegerField(allow_null=False)
    organization = serializers.IntegerField(allow_null=False)
    branch_id = serializers.IntegerField(allow_null=False)
    date = serializers.DateField(allow_null=False)
    course_id = serializers.IntegerField(allow_null=False)
    section_id = serializers.IntegerField(allow_null=False)
    class_period_id = serializers.IntegerField(allow_null=False)


class LectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = [
            'lecture_name',
            'lecture_description',
            'created_by'
        ]


class StudentCertificatePDFGenerateSerializer(serializers.Serializer):
    transfer_certificate_id = serializers.IntegerField(allow_null=False)
    studentId = serializers.IntegerField(allow_null=False)
    documentType = serializers.CharField(allow_null=False, allow_blank=False)


class EmployeeSearchSerializer(serializers.Serializer):
    orgId = serializers.IntegerField(required=True, allow_null=False)
    branchId = serializers.IntegerField(required=True, allow_null=False)
    employeeId = serializers.IntegerField(required=False, allow_null=True)
    # employeeName = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    employee_code = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    department_id = serializers.IntegerField(required=False, allow_null=True)
    designation_id = serializers.IntegerField(required=False, allow_null=True)


class TermSerializer(serializers.Serializer):
    organization = serializers.IntegerField(required=True, allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    academic_year_id = serializers.IntegerField(required=True, allow_null=False)


class StaffEmployeeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeType
        fields = ['id', 'employee_type_code', 'employee_type_description', 'is_active']


class StudentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentRegistration
        fields = '__all__'



