from rest_framework import serializers

from MENTOR.models import StudentMentor


# class MentorSerializer(serializers.ModelSerializer):
#     class Meta:
#         models = STUDENT_MENTOR
#         fields = ['Assigned_id', 'teacher_id', 'student_id','academic_year_id', 'org_id', 'branch_id','date', 'is_active','created_by']

class StudentMentorAssignSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True, allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    batch_id = serializers.IntegerField(allow_null=False,required=True)
    course_id = serializers.IntegerField(allow_null=False,required=True)
    department_id = serializers.IntegerField(allow_null=False,required=True)
    academic_year_id = serializers.IntegerField(required=True,allow_null=False)
    semester_id = serializers.IntegerField(required=True,allow_null=False)
    section_id = serializers.IntegerField(required=True, allow_null=False)
    professor_id = serializers.IntegerField(allow_null=False,required=True)
    student_ids = serializers.ListField(required=True)
    date = serializers.DateField(required=True,allow_null=False)
    created_by = serializers.IntegerField(required=True,allow_null=False)

class StudentMentorSearchSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True, allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    batch_id = serializers.IntegerField(allow_null=False, required=True)
    course_id = serializers.IntegerField(allow_null=False, required=True)
    department_id = serializers.IntegerField(allow_null=False, required=True)
    academic_year_id = serializers.IntegerField(required=True, allow_null=False)
    semester_id = serializers.IntegerField(required=True, allow_null=False)
    section_id = serializers.IntegerField(required=True, allow_null=False)
    professor_id = serializers.IntegerField(allow_null=False, required=False)
    student_id = serializers.IntegerField(required=False)

    def validate_teacher_id(self, value):
        """Validate that teacher_id is an integer."""
        if not isinstance(value, int):
            raise serializers.ValidationError("Invalid teacher_id. It must be an integer.")
        return value

    def validate_student_id(self, value):
        """Validate that student_id is a integers."""
        if not isinstance(value, int):
            raise serializers.ValidationError("Invalid teacher_id. It must be an integer.")
        return value

class StudentAssignListBasedOnMentorSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True, allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    batch_id = serializers.IntegerField(allow_null=False, required=True)
    course_id = serializers.IntegerField(allow_null=False, required=True)
    department_id = serializers.IntegerField(allow_null=False, required=True)
    academic_year_id = serializers.IntegerField(required=True, allow_null=False)
    semester_id = serializers.IntegerField(required=True, allow_null=False)
    professor_id = serializers.IntegerField(allow_null=False, required=False)

class StudentMentorCommunicationSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True, allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    batch_id = serializers.IntegerField(required=True,allow_null=False)
    course_id = serializers.IntegerField(allow_null=False, required=True)
    department_id = serializers.IntegerField(allow_null=False, required=True)
    academic_year_id = serializers.IntegerField(required=True, allow_null=False)
    semester_id = serializers.IntegerField(required=True, allow_null=False)
    section_id = serializers.IntegerField(required=True, allow_null=False)
    date= serializers.DateField(required=True,allow_null=False)
    professor_id = serializers.IntegerField(required=True,allow_null=False)
    student_id = serializers.IntegerField(required=True, allow_null=False)
    communicated_with = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)
    communicated_via = serializers.CharField(max_length=255, allow_null=False, allow_blank=False)
    remarks  = serializers.CharField(max_length=1000, allow_null=False, allow_blank=False)
    # created_by = serializers.IntegerField(required=True,allow_null=False)


class StudentCommunicationSearchListSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True, allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    batch_id = serializers.IntegerField(required=True, allow_null=False)
    course_id = serializers.IntegerField(allow_null=False, required=True)
    department_id = serializers.IntegerField(allow_null=False, required=True)
    academic_year_id = serializers.IntegerField(required=True, allow_null=False)
    semester_id = serializers.IntegerField(required=True, allow_null=False)
    section_id = serializers.IntegerField(required=True, allow_null=False)
    Professor_id = serializers.IntegerField(required=False, allow_null=True)
    student_id = serializers.IntegerField(required=True, allow_null=True)


class StudentDetailsBarcodeRegistrationSearchSerializer(serializers.Serializer):
    registration_no = serializers.IntegerField(required=False,allow_null=True)
    barcode = serializers.CharField(max_length=50,allow_null=True,allow_blank=True)
from Acadix.models import EmployeeMaster, StudentRegistration, Organization, Branch, AcademicYear
from .models import Mentor, StudentMentorAssignment, MentorStudentCommunication


class MentorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mentor
        fields = [
            "id",
            "organization",
            "branch",
            "employee",
            "department",
            "max_students",
            "expertise",
            "is_active",
            "created_by",
            "updated_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class MentorListSerializer(serializers.ModelSerializer):
    employee_code = serializers.CharField(source="employee.employee_code", read_only=True)
    employee_name = serializers.SerializerMethodField()
    department_name = serializers.CharField(
        source="department.department_description", read_only=True
    )

    class Meta:
        model = Mentor
        fields = [
            "id",
            "organization",
            "branch",
            "employee",
            "employee_code",
            "employee_name",
            "department",
            "department_name",
            "max_students",
            "expertise",
            "is_active",
        ]

    def get_employee_name(self, obj: Mentor) -> str:
        parts = [obj.employee.title, obj.employee.first_name, obj.employee.middle_name, obj.employee.last_name]
        return " ".join(p for p in parts if p)


class StudentMentorAssignmentCreateSerializer(serializers.Serializer):
    """
    Serializer to validate payload for POST /api/Mentor/studentmentorAssign/

    Expected payload example:
    {
      "org_id": 1,
      "branch_id": 1,
      "academic_year_id": 1,
      "date": "2025-12-01",
      "teacher_id": 1,
      "student_id": [22, 23],
      "created_by": 0
    }
    """

    org_id = serializers.IntegerField(required=True)
    branch_id = serializers.IntegerField(required=True)
    academic_year_id = serializers.IntegerField(required=True)
    date = serializers.DateField(required=True)
    teacher_id = serializers.IntegerField(required=True)
    student_id = serializers.ListField(
        child=serializers.IntegerField(), allow_empty=False
    )
    created_by = serializers.IntegerField(required=True)


class StudentMentorAssignmentListSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    mentor_name = serializers.SerializerMethodField()
    mentor_employee_code = serializers.CharField(
        source="mentor.employee.employee_code", read_only=True
    )

    class Meta:
        model = StudentMentorAssignment
        fields = [
            "id",
            "organization",
            "branch",
            "academic_year",
            "mentor",
            "mentor_employee_code",
            "mentor_name",
            "student",
            "student_name",
            "assignment_date",
            "is_primary",
            "status",
            "remarks",
            "is_active",
            "created_by",
            "updated_by",
            "created_at",
            "updated_at",
        ]

    def get_student_name(self, obj: StudentMentorAssignment) -> str:
        parts = [
            obj.student.first_name,
            obj.student.middle_name,
            obj.student.last_name,
        ]
        return " ".join(p for p in parts if p)

    def get_mentor_name(self, obj: StudentMentorAssignment) -> str:
        e = obj.mentor.employee
        parts = [e.title, e.first_name, e.middle_name, e.last_name]
        return " ".join(p for p in parts if p)


class AssignedStudentSerializer(serializers.Serializer):
    """
    Serializer for student info in mentor-with-students view
    """
    assignment_id = serializers.IntegerField()
    student_id = serializers.IntegerField()
    student_name = serializers.CharField()
    admission_no = serializers.CharField(allow_null=True)
    college_admission_no = serializers.CharField(allow_null=True)
    barcode = serializers.CharField(allow_null=True)
    course_name = serializers.CharField(allow_null=True)
    section_name = serializers.CharField(allow_null=True)
    father_name = serializers.CharField(allow_null=True)
    mother_name = serializers.CharField(allow_null=True)
    assignment_date = serializers.DateField()
    status = serializers.CharField()
    is_primary = serializers.BooleanField()


class MentorWiseStudentSerializer(serializers.Serializer):
    """
    Serializer for listing students assigned to a specific mentor
    """
    assignment_id = serializers.IntegerField()
    student_id = serializers.IntegerField()
    student_name = serializers.CharField()
    admission_no = serializers.CharField(allow_null=True)
    college_admission_no = serializers.CharField(allow_null=True)
    barcode = serializers.CharField(allow_null=True)
    email = serializers.CharField(allow_null=True)
    course_id = serializers.IntegerField(allow_null=True)
    course_name = serializers.CharField(allow_null=True)
    department_id = serializers.IntegerField(allow_null=True)
    department_name = serializers.CharField(allow_null=True)
    section_id = serializers.IntegerField(allow_null=True)
    section_name = serializers.CharField(allow_null=True)
    semester_id = serializers.IntegerField(allow_null=True)
    semester_name = serializers.CharField(allow_null=True)
    academic_year_id = serializers.IntegerField()
    academic_year_code = serializers.CharField(allow_null=True)
    assignment_date = serializers.DateField()
    status = serializers.CharField()
    is_primary = serializers.BooleanField()


class MentorWithStudentsSerializer(serializers.Serializer):
    """
    Serializer for mentor list with assigned students - for main table in add mentor UI
    """
    mentor_id = serializers.IntegerField()
    mentor_name = serializers.CharField()
    employee_code = serializers.CharField()
    employee_id = serializers.IntegerField()
    department_id = serializers.IntegerField(allow_null=True)
    department_name = serializers.CharField(allow_null=True)
    max_students = serializers.IntegerField(allow_null=True)
    current_student_count = serializers.IntegerField()
    assigned_students = AssignedStudentSerializer(many=True)


class StudentMentorAssignmentDeleteSerializer(serializers.Serializer):
    """
    Serializer to validate payload for DELETE /api/Mentor/studentmentorAssign/
    
    Either provide assignment_id OR provide mentor_id + student_id + academic_year_id
    """
    assignment_id = serializers.IntegerField(required=False)
    mentor_id = serializers.IntegerField(required=False)
    student_id = serializers.IntegerField(required=False)
    academic_year_id = serializers.IntegerField(required=False)
    
    def validate(self, data):
        assignment_id = data.get('assignment_id')
        mentor_id = data.get('mentor_id')
        student_id = data.get('student_id')
        academic_year_id = data.get('academic_year_id')
        
        if assignment_id:
            # If assignment_id is provided, that's enough
            return data
        elif mentor_id and student_id and academic_year_id:
            # If all three are provided, that's enough
            return data
        else:
            raise serializers.ValidationError(
                "Either provide 'assignment_id' OR provide all of 'mentor_id', 'student_id', and 'academic_year_id'"
            )


class MentorStudentCommunicationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating mentor-student communication records.
    """

    class Meta:
        model = MentorStudentCommunication
        fields = [
            "organization",
            "branch",
            "academic_year",
            "mentor",
            "student",
            "communication_date",
            "communicated_with",
            "communicated_via",
            "communication_details",
            "remarks",
            "created_by",
        ]


class MentorStudentCommunicationListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing/searching mentor-student communication records.
    Includes nested student and mentor names for display.
    """

    student_name = serializers.SerializerMethodField()
    student_admission_no = serializers.SerializerMethodField()
    student_college_admission_no = serializers.SerializerMethodField()
    mentor_name = serializers.SerializerMethodField()
    mentor_employee_code = serializers.SerializerMethodField()
    course_name = serializers.SerializerMethodField()
    section_name = serializers.SerializerMethodField()

    class Meta:
        model = MentorStudentCommunication
        fields = [
            "id",
            "organization",
            "branch",
            "academic_year",
            "mentor",
            "mentor_employee_code",
            "mentor_name",
            "student",
            "student_name",
            "student_admission_no",
            "student_college_admission_no",
            "course_name",
            "section_name",
            "communication_date",
            "communicated_with",
            "communicated_via",
            "communication_details",
            "remarks",
            "is_active",
            "created_by",
            "updated_by",
            "created_at",
            "updated_at",
        ]

    def get_student_name(self, obj: MentorStudentCommunication) -> str:
        if not obj.student:
            return None
        parts = [
            obj.student.first_name,
            obj.student.middle_name,
            obj.student.last_name,
        ]
        return " ".join(p for p in parts if p)

    def get_student_admission_no(self, obj: MentorStudentCommunication) -> str:
        return obj.student.admission_no if obj.student else None

    def get_student_college_admission_no(self, obj: MentorStudentCommunication) -> str:
        return obj.student.college_admission_no if obj.student else None

    def get_mentor_name(self, obj: MentorStudentCommunication) -> str:
        if not obj.mentor or not obj.mentor.employee:
            return None
        e = obj.mentor.employee
        parts = [e.title, e.first_name, e.middle_name, e.last_name]
        return " ".join(p for p in parts if p)

    def get_mentor_employee_code(self, obj: MentorStudentCommunication) -> str:
        if not obj.mentor or not obj.mentor.employee:
            return None
        return obj.mentor.employee.employee_code

    def get_course_name(self, obj: MentorStudentCommunication) -> str:
        if not obj.student:
            return None
        from Acadix.models import StudentCourse

        try:
            student_course = (
                StudentCourse.objects.filter(
                    student=obj.student, is_active=True
                )
                .order_by("-created_at")
                .first()
            )
            if student_course and student_course.course:
                return student_course.course.course_name
        except Exception:
            pass
        return None

    def get_section_name(self, obj: MentorStudentCommunication) -> str:
        if not obj.student:
            return None
        from Acadix.models import StudentCourse

        try:
            student_course = (
                StudentCourse.objects.filter(
                    student=obj.student, is_active=True
                )
                .order_by("-created_at")
                .first()
            )
            if student_course and student_course.section:
                return student_course.section.section_name
        except Exception:
            pass
        return None


class MentorStudentCommunicationSearchSerializer(serializers.Serializer):
    """
    Serializer for validating search query parameters.
    All fields are optional for flexible filtering.
    """

    academic_year_id = serializers.IntegerField(required=False)
    org_id = serializers.IntegerField(required=False)
    branch_id = serializers.IntegerField(required=False)
    student_id = serializers.IntegerField(required=False)
    teacher_id = serializers.IntegerField(required=False)
    mentor_id = serializers.IntegerField(required=False)
    date_from = serializers.DateField(required=False)
    date_to = serializers.DateField(required=False)
    communicated_with = serializers.CharField(required=False)
    communicated_via = serializers.CharField(required=False)
