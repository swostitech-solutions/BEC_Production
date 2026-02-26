from django.db import models

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


class DocumentGroup(models.Model):
    """
    Logical bucket of documents for a given entity and context.
    Examples:
    - Org registration documents
    - Student semester-1 result
    - Library book attachments
    """

    class GroupType(models.TextChoices):
        ORG = "ORG", "Organization"
        BRANCH = "BRANCH", "Branch / Campus"
        STUDENT = "STUDENT", "Student"
        EMPLOYEE = "EMPLOYEE", "Employee / Staff"
        LIBRARY = "LIBRARY", "Library"
        CIRCULAR = "CIRCULAR", "Circular / Notice"
        SUBJECT_DOCUMENT = "SUBJECT_DOCUMENT", "Subject Document"
        OTHER = "OTHER", "Other"

    code = models.CharField(max_length=100)  # e.g. STUDENT_SEM_RESULT
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=500, null=True, blank=True)
    group_type = models.CharField(
        max_length=20,
        choices=GroupType.choices,
    )

    # Multi-tenant / academic context
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, null=True, blank=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, null=True, blank=True)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, null=True, blank=True)
    section = models.ForeignKey(Section, on_delete=models.CASCADE, null=True, blank=True)
    subject = models.ForeignKey(CourseDepartmentSubject, on_delete=models.CASCADE, null=True, blank=True)

    # Entity linkage
    student = models.ForeignKey(
        StudentRegistration, on_delete=models.CASCADE, null=True, blank=True
    )
    employee = models.ForeignKey(
        EmployeeMaster, on_delete=models.CASCADE, null=True, blank=True
    )
    library_branch = models.ForeignKey(
        LibraryBranch, on_delete=models.CASCADE, null=True, blank=True
    )
    # For circulars / notices we can link indirectly via academic context; explicit FK can be added later if needed.

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField(null=True, blank=True)
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "DocumentGroup"
        indexes = [
            models.Index(fields=["organization", "branch", "group_type", "code"]),
        ]

    def __str__(self) -> str:
        return f"{self.code} - {self.name}"


class DocumentFile(models.Model):
    """
    Physical/versioned file under a DocumentGroup.
    """

    class StorageBackend(models.TextChoices):
        LOCAL = "LOCAL", "Local Storage"
        S3 = "S3", "Amazon S3"

    group = models.ForeignKey(
        DocumentGroup, on_delete=models.CASCADE, related_name="files"
    )

    # Binary storage in database (for now; can migrate to S3 later)
    file_data = models.BinaryField(null=True, blank=True)

    storage_backend = models.CharField(
        max_length=20,
        choices=StorageBackend.choices,
        default=StorageBackend.LOCAL,
    )
    # For future S3 migration: store URL here when storage_backend=S3
    path_or_url = models.CharField(max_length=1000, null=True, blank=True)
    original_name = models.CharField(max_length=255, null=True, blank=True)
    mime_type = models.CharField(max_length=100, null=True, blank=True)
    size = models.BigIntegerField(null=True, blank=True)
    checksum = models.CharField(max_length=255, null=True, blank=True)

    version = models.PositiveIntegerField(default=1)
    is_current = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    remarks = models.TextField(null=True, blank=True, help_text="Notes or remarks about this document version")
    from_date = models.DateField(null=True, blank=True, help_text="Valid from date")
    to_date = models.DateField(null=True, blank=True, help_text="Valid to date")
    uploaded_by = models.PositiveIntegerField(null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "DocumentFile"
        ordering = ["-uploaded_at"]
        indexes = [
            models.Index(fields=["group", "is_current", "is_active"]),
        ]

    def __str__(self) -> str:
        return f"{self.group.code} v{self.version} - {self.original_name or self.path_or_url}"
