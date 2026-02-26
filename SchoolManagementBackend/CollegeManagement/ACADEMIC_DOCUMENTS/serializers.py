import base64
from django.db.models import Max
from rest_framework import serializers

from Acadix.models import (
    Organization,
    Branch,
    Batch,
    Course,
    Department,
    AcademicYear,
    Semester,
    Section,
    StudentRegistration,
    EmployeeMaster,
    CourseDepartmentSubject,
)
from Library.models import LibraryBranch
from .models import DocumentGroup, DocumentFile


class DocumentGroupSerializer(serializers.ModelSerializer):
    batch_id = serializers.SerializerMethodField()
    batch_code = serializers.SerializerMethodField()
    course_id = serializers.SerializerMethodField()
    course_name = serializers.SerializerMethodField()
    course_code = serializers.SerializerMethodField()
    section_id = serializers.SerializerMethodField()
    section_name = serializers.SerializerMethodField()
    section_code = serializers.SerializerMethodField()
    subject_id = serializers.SerializerMethodField()
    subject_code = serializers.SerializerMethodField()
    subject_description = serializers.SerializerMethodField()

    def get_batch_id(self, obj):
        return obj.batch.id if obj.batch else None

    def get_batch_code(self, obj):
        return obj.batch.batch_code if obj.batch else None

    def get_course_id(self, obj):
        return obj.course.id if obj.course else None

    def get_course_name(self, obj):
        return obj.course.course_name if obj.course else None

    def get_course_code(self, obj):
        return obj.course.course_code if obj.course else None

    def get_section_id(self, obj):
        return obj.section.id if obj.section else None

    def get_section_name(self, obj):
        return obj.section.section_name if obj.section else None

    def get_section_code(self, obj):
        return obj.section.section_code if obj.section else None

    def get_subject_id(self, obj):
        return obj.subject.id if obj.subject else None

    def get_subject_code(self, obj):
        return obj.subject.subject_code if obj.subject else None

    def get_subject_description(self, obj):
        return obj.subject.subject_description if obj.subject else None

    class Meta:
        model = DocumentGroup
        fields = [
            "id",
            "code",
            "name",
            "description",
            "group_type",
            "organization",
            "branch",
            "batch",
            "batch_id",
            "batch_code",
            "course",
            "course_id",
            "course_name",
            "course_code",
            "department",
            "academic_year",
            "semester",
            "section",
            "section_id",
            "section_name",
            "section_code",
            "subject",
            "subject_id",
            "subject_code",
            "subject_description",
            "student",
            "employee",
            "library_branch",
            "is_active",
            "created_at",
            "updated_at",
        ]


class DocumentFileSerializer(serializers.ModelSerializer):
    group = DocumentGroupSerializer(read_only=True)
    organization_id = serializers.IntegerField(source="group.organization_id", read_only=True)
    branch_id = serializers.IntegerField(source="group.branch_id", read_only=True)
    student_name = serializers.SerializerMethodField()
    employee_name = serializers.SerializerMethodField()
    uploaded_by_name = serializers.SerializerMethodField()
    # Return file as base64-encoded string for frontend to reconstruct
    file_data_base64 = serializers.SerializerMethodField()

    class Meta:
        model = DocumentFile
        fields = [
            "id",
            "group",
            "organization_id",
            "branch_id",
            "original_name",
            "mime_type",
            "size",
            "storage_backend",
            "path_or_url",
            "file_data_base64",
            "version",
            "is_current",
            "is_active",
            "uploaded_by",
            "uploaded_by_name",
            "uploaded_at",
            "updated_at",
            "remarks",
            "student_name",
            "employee_name",
            "from_date",
            "to_date",
        ]

    def get_file_data_base64(self, obj):
        """Convert binary file data to base64 string for JSON response"""
        if obj.file_data:
            return base64.b64encode(obj.file_data).decode('utf-8')
        return None

    def get_student_name(self, obj):
        student = obj.group.student
        if not student:
            return None
        parts = [student.first_name, student.middle_name, student.last_name]
        return " ".join(p for p in parts if p)

    def get_employee_name(self, obj):
        employee = obj.group.employee
        if not employee:
            return None
        parts = [employee.first_name, employee.middle_name, employee.last_name]
        return " ".join(p for p in parts if p)

    def get_uploaded_by_name(self, obj):
        """Get the name of the teacher/staff who uploaded the document"""
        if not obj.uploaded_by:
            return None
        try:
            employee = EmployeeMaster.objects.get(id=obj.uploaded_by, is_active=True)
            parts = [employee.first_name, employee.middle_name, employee.last_name]
            return " ".join(p for p in parts if p)
        except EmployeeMaster.DoesNotExist:
            return None


class DocumentFileCreateSerializer(serializers.Serializer):
    """
    Serializer used for uploads.
    Either provide an existing group_id or enough info to create/locate a group.
    """

    # Existing group
    group_id = serializers.IntegerField(required=False)

    # Group identity (if creating/finding automatically)
    code = serializers.CharField(max_length=100, required=False)
    name = serializers.CharField(max_length=255, required=False)
    description = serializers.CharField(max_length=500, required=False, allow_blank=True, allow_null=True)
    group_type = serializers.ChoiceField(
        choices=DocumentGroup.GroupType.choices, required=False
    )

    # Context / entity linkage
    organization_id = serializers.IntegerField(required=True)
    branch_id = serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=False, allow_null=True)
    course_id = serializers.IntegerField(required=False, allow_null=True)
    department_id = serializers.IntegerField(required=False, allow_null=True)
    academic_year_id = serializers.IntegerField(required=False, allow_null=True)
    semester_id = serializers.IntegerField(required=False, allow_null=True)
    section_id = serializers.IntegerField(required=False, allow_null=True)
    subject_id = serializers.IntegerField(required=False, allow_null=True)
    student_id = serializers.IntegerField(required=False, allow_null=True)
    employee_id = serializers.IntegerField(required=False, allow_null=True)
    library_branch_id = serializers.IntegerField(required=False, allow_null=True)

    # File & metadata - accept either base64 string or multipart file
    file = serializers.FileField(required=False, allow_null=True)
    file_data_base64 = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    original_name = serializers.CharField(max_length=255, required=False, allow_null=True, allow_blank=True)
    mime_type = serializers.CharField(max_length=100, required=False, allow_null=True, allow_blank=True)
    size = serializers.IntegerField(required=False, allow_null=True)

    # Teacher/Staff who is uploading (optional - defaults to request.user if not provided)
    uploaded_by = serializers.IntegerField(required=False, allow_null=True,
                                           help_text="Teacher/Staff ID who is uploading. If not provided, uses authenticated user.")

    # Remarks/Notes about the document
    remarks = serializers.CharField(required=False, allow_null=True, allow_blank=True,
                                    help_text="Notes or remarks about this document")

    # Validity period for the document
    from_date = serializers.DateField(required=False, allow_null=True, help_text="Valid from date")
    to_date = serializers.DateField(required=False, allow_null=True, help_text="Valid to date")

    def validate(self, attrs):
        group_id = attrs.get("group_id")
        code = attrs.get("code")
        group_type = attrs.get("group_type")

        # If group_id is provided, we don't need code/group_type
        if group_id:
            return attrs

        # If no group_id, we need group_type
        if not group_type:
            raise serializers.ValidationError(
                "Either 'group_id' or 'group_type' must be provided."
            )

        # Auto-generate code if not provided
        if not code:
            # Generate code based on group_type and context
            org_id = attrs.get("organization_id")
            branch_id = attrs.get("branch_id")
            subject_id = attrs.get("subject_id")
            student_id = attrs.get("student_id")
            employee_id = attrs.get("employee_id")

            if group_type == "SUBJECT_DOCUMENT" and subject_id:
                code = f"SUBJECT_{subject_id}_DOCS"
            elif group_type == "STUDENT" and student_id:
                code = f"STUDENT_{student_id}_DOCS"
            elif group_type == "EMPLOYEE" and employee_id:
                code = f"EMPLOYEE_{employee_id}_DOCS"
            elif group_type == "ORG" and org_id:
                code = f"ORG_{org_id}_DOCS"
            elif group_type == "BRANCH" and branch_id:
                code = f"BRANCH_{branch_id}_DOCS"
            else:
                code = f"{group_type}_{org_id}_{branch_id}"

            attrs["code"] = code

        file = attrs.get("file")
        file_data_base64 = attrs.get("file_data_base64")

        if not file and not file_data_base64:
            raise serializers.ValidationError(
                "Either 'file' (multipart) or 'file_data_base64' (base64 string) must be provided."
            )

        return attrs

    def create(self, validated_data):
        group_id = validated_data.pop("group_id", None)
        organization_id = validated_data.pop("organization_id")
        branch_id = validated_data.pop("branch_id")
        batch_id = validated_data.pop("batch_id", None)
        course_id = validated_data.pop("course_id", None)
        department_id = validated_data.pop("department_id", None)
        academic_year_id = validated_data.pop("academic_year_id", None)
        semester_id = validated_data.pop("semester_id", None)
        section_id = validated_data.pop("section_id", None)
        subject_id = validated_data.pop("subject_id", None)
        student_id = validated_data.pop("student_id", None)
        employee_id = validated_data.pop("employee_id", None)
        library_branch_id = validated_data.pop("library_branch_id", None)

        code = validated_data.pop("code", None)
        name = validated_data.pop("name", None)
        description = validated_data.pop("description", None)
        group_type = validated_data.pop("group_type", None)

        upload_file = validated_data.pop("file", None)
        file_data_base64 = validated_data.pop("file_data_base64", None)
        original_name = validated_data.pop("original_name", None)
        mime_type = validated_data.pop("mime_type", None)
        size = validated_data.pop("size", None)
        uploaded_by_id = validated_data.pop("uploaded_by", None)
        remarks = validated_data.pop("remarks", None)
        from_date = validated_data.pop("from_date", None)
        to_date = validated_data.pop("to_date", None)

        # Convert file to binary data
        file_binary_data = None
        if upload_file:
            # Read multipart file
            file_binary_data = upload_file.read()
            if not original_name:
                original_name = upload_file.name
            if not mime_type:
                # Try to infer from file extension or use default
                mime_type = getattr(upload_file, 'content_type', 'application/octet-stream')
            if not size:
                size = len(file_binary_data)
        elif file_data_base64:
            # Decode base64 string
            try:
                file_binary_data = base64.b64decode(file_data_base64)
                if not size:
                    size = len(file_binary_data)
            except Exception as e:
                raise serializers.ValidationError(f"Invalid base64 file data: {str(e)}")

        # Resolve base FKs
        organization = Organization.objects.get(id=organization_id, is_active=True)
        branch = Branch.objects.get(id=branch_id, is_active=True)
        batch = Batch.objects.get(id=batch_id) if batch_id else None
        course = Course.objects.get(id=course_id) if course_id else None
        department = Department.objects.get(id=department_id) if department_id else None
        academic_year = (
            AcademicYear.objects.get(id=academic_year_id) if academic_year_id else None
        )
        semester = Semester.objects.get(id=semester_id) if semester_id else None
        section = Section.objects.get(id=section_id) if section_id else None
        subject = CourseDepartmentSubject.objects.get(id=subject_id) if subject_id else None
        student = (
            StudentRegistration.objects.get(id=student_id) if student_id else None
        )
        employee = EmployeeMaster.objects.get(id=employee_id) if employee_id else None
        library_branch = (
            LibraryBranch.objects.get(id=library_branch_id)
            if library_branch_id
            else None
        )

        if group_id:
            group = DocumentGroup.objects.get(id=group_id, is_active=True)
        else:
            # Auto-generate name if not provided
            if not name:
                if group_type == "SUBJECT_DOCUMENT" and subject:
                    name = f"Subject Documents - {subject.subject_code}"
                elif group_type == "STUDENT" and student:
                    student_name = " ".join(filter(None, [student.first_name, student.middle_name, student.last_name]))
                    name = f"Student Documents - {student_name}"
                elif group_type == "EMPLOYEE" and employee:
                    employee_name = " ".join(
                        filter(None, [employee.first_name, employee.middle_name, employee.last_name]))
                    name = f"Employee Documents - {employee_name}"
                else:
                    name = code or f"{group_type} Documents"

            # Create or reuse logical group based on code + group_type + org/branch + entity context
            group, created = DocumentGroup.objects.get_or_create(
                code=code,
                group_type=group_type,
                organization=organization,
                branch=branch,
                batch=batch,
                course=course,
                department=department,
                academic_year=academic_year,
                semester=semester,
                section=section,
                subject=subject,
                student=student,
                employee=employee,
                library_branch=library_branch,
                defaults={
                    "name": name,
                    "description": description,
                    "is_active": True,
                },
            )

            # If group was soft-deleted, restore it
            if not created and not group.is_active:
                group.is_active = True
                group.save(update_fields=["is_active"])

        # Determine next version
        last_version = (
                DocumentFile.objects.filter(group=group).aggregate(max_v=Max("version"))[
                    "max_v"
                ]
                or 0
        )
        new_version = last_version + 1

        # Mark older versions as not current
        DocumentFile.objects.filter(group=group, is_current=True).update(
            is_current=False
        )

        if not file_binary_data:
            raise serializers.ValidationError("File data is required.")

        # Calculate checksum (simple MD5 for integrity)
        import hashlib
        checksum = hashlib.md5(file_binary_data).hexdigest()

        # Use uploaded_by from request data if provided, otherwise use from context (request.user)
        final_uploaded_by = uploaded_by_id or self.context.get("uploaded_by")

        document = DocumentFile.objects.create(
            group=group,
            file_data=file_binary_data,
            storage_backend=DocumentFile.StorageBackend.LOCAL,
            original_name=original_name,
            mime_type=mime_type or 'application/octet-stream',
            size=size,
            checksum=checksum,
            version=new_version,
            is_current=True,
            is_active=True,
            uploaded_by=final_uploaded_by,
            remarks=remarks,
            from_date=from_date,
            to_date=to_date,
        )

        return document


class DocumentSearchSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=False, allow_null=True)
    branch_id = serializers.IntegerField(required=False, allow_null=True)
    batch_id = serializers.IntegerField(required=False, allow_null=True)
    course_id = serializers.IntegerField(required=False, allow_null=True)
    department_id = serializers.IntegerField(required=False, allow_null=True)
    academic_year_id = serializers.IntegerField(required=False, allow_null=True)
    semester_id = serializers.IntegerField(required=False, allow_null=True)
    section_id = serializers.IntegerField(required=False, allow_null=True)
    subject_id = serializers.IntegerField(required=False, allow_null=True)
    student_id = serializers.IntegerField(required=False, allow_null=True)
    employee_id = serializers.IntegerField(required=False, allow_null=True)
    library_branch_id = serializers.IntegerField(required=False, allow_null=True)
    group_type = serializers.ChoiceField(
        choices=DocumentGroup.GroupType.choices, required=False, allow_null=True
    )
    group_code = serializers.CharField(
        max_length=100, required=False, allow_null=True, allow_blank=True
    )
    include_history = serializers.BooleanField(required=False, default=False)
    search_query = serializers.CharField(
        max_length=255, required=False, allow_null=True, allow_blank=True
    )
    from_date = serializers.DateField(required=False, allow_null=True)
    to_date = serializers.DateField(required=False, allow_null=True)
    uploaded_by = serializers.IntegerField(required=False, allow_null=True,
                                           help_text="Filter by teacher/staff ID who uploaded the document")
    teacher_id = serializers.IntegerField(required=False, allow_null=True,
                                          help_text="Alias for uploaded_by - filter by teacher/staff ID who uploaded")

