from django.db import models

from Acadix.models import (
    EmployeeMaster,
    Organization,
    Branch,
    AcademicYear,
    StudentCourse,
    Batch,
    Course,
    Department,
    Semester,
    Section,
    StudentRegistration,
)


class StudentMentor(models.Model):
    """
    Legacy model for student-mentor assignments.
    Consider migrating to the new Mentor/StudentMentorAssignment structure.
    """
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, null=True, blank=True)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, null=True, blank=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, null=True, blank=True)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, null=True, blank=True)
    section = models.ForeignKey(Section, on_delete=models.CASCADE, null=True, blank=True)
    Assigned_id = models.AutoField(primary_key=True, db_column='Assigned_id')
    student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    professor = models.ForeignKey(EmployeeMaster, on_delete=models.CASCADE)
    student_course = models.ForeignKey(StudentCourse, on_delete=models.CASCADE)
    date = models.DateField(null=False, blank=False)

    class Meta:
        db_table = "StudentMentor"

    def __str__(self) -> str:
        return f"StudentMentor: {self.student.first_name} - {self.professor.first_name}"


class Mentor(models.Model):
    """
    Mentor profile linked to an existing teacher/professor (EmployeeMaster).
    Designed to be extensible with workload, expertise, etc.
    """
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    employee = models.OneToOneField(
        EmployeeMaster,
        on_delete=models.CASCADE,
        related_name="mentor_profile",
    )
    department = models.ForeignKey(
        "Acadix.Department",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="mentors",
    )
    max_students = models.PositiveIntegerField(null=True, blank=True)
    expertise = models.CharField(max_length=255, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "Mentor"

    def __str__(self) -> str:
        return f"Mentor: {self.employee.first_name} {self.employee.last_name} ({self.employee.employee_code})"


class StudentCommunication(models.Model):
    """
    Legacy model for student communication tracking.
    Consider migrating to MentorStudentCommunication.
    """
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, null=True, blank=True)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, null=True, blank=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, null=True, blank=True)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, null=True, blank=True)
    section = models.ForeignKey(Section, on_delete=models.CASCADE, null=True, blank=True)
    communication_id = models.AutoField(primary_key=True, db_column='communication_id')
    assigned_id = models.ForeignKey(StudentMentor, on_delete=models.CASCADE)
    communicated_with = models.CharField(max_length=255, null=False, blank=False)
    communicated_via = models.CharField(max_length=255, null=False, blank=False)
    remarks = models.CharField(max_length=1000, null=False, blank=False)
    date = models.DateField(null=False, blank=False)

    class Meta:
        db_table = "StudentCommunication"

    def __str__(self) -> str:
        return f"Communication: {self.assigned_id.student.first_name} on {self.date}"


class StudentMentorAssignment(models.Model):
    """
    Links students to mentors.
    Schema supports multiple mentors per student and multiple students per mentor.
    Business rules (e.g. only one primary mentor) can be enforced in view logic.
    """

    STATUS_CHOICES = (
        ("ACTIVE", "Active"),
        ("INACTIVE", "Inactive"),
    )

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(
        AcademicYear, on_delete=models.CASCADE, related_name="mentor_assignments"
    )

    mentor = models.ForeignKey(
        Mentor, on_delete=models.CASCADE, related_name="student_assignments"
    )
    student = models.ForeignKey(
        StudentRegistration,
        on_delete=models.CASCADE,
        related_name="mentor_assignments",
    )

    assignment_date = models.DateField()
    is_primary = models.BooleanField(default=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="ACTIVE"
    )
    remarks = models.CharField(max_length=500, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "StudentMentorAssignment"
        unique_together = ("academic_year", "mentor", "student", "is_primary")

    def __str__(self) -> str:
        return f"StudentMentorAssignment: student={self.student_id}, mentor={self.mentor_id}, academic_year={self.academic_year_id}"


class MentorStudentCommunication(models.Model):
    """
    Tracks communication between mentors and students/parents.
    Used for maintaining communication history and records.
    """

    COMMUNICATED_WITH_CHOICES = (
        ("STUDENT", "Student"),
        ("PARENT", "Parent"),
        ("GUARDIAN", "Guardian"),
        ("FATHER", "Father"),
        ("MOTHER", "Mother"),
        ("OTHER", "Other"),
    )

    COMMUNICATED_VIA_CHOICES = (
        ("PHONE", "Phone"),
        ("EMAIL", "Email"),
        ("IN_PERSON", "In Person"),
        ("SMS", "SMS"),
        ("WHATSAPP", "WhatsApp"),
        ("VIDEO_CALL", "Video Call"),
        ("LETTER", "Letter"),
        ("OTHER", "Other"),
    )

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(
        AcademicYear,
        on_delete=models.CASCADE,
        related_name="mentor_communications",
    )

    mentor = models.ForeignKey(
        Mentor, on_delete=models.CASCADE, related_name="communications"
    )
    student = models.ForeignKey(
        StudentRegistration,
        on_delete=models.CASCADE,
        related_name="mentor_communications",
    )

    communication_date = models.DateField()
    communicated_with = models.CharField(
        max_length=20, choices=COMMUNICATED_WITH_CHOICES
    )
    communicated_via = models.CharField(max_length=20, choices=COMMUNICATED_VIA_CHOICES)
    communication_details = models.TextField(null=True, blank=True)
    remarks = models.TextField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "MentorStudentCommunication"
        ordering = ["-communication_date", "-created_at"]

    def __str__(self) -> str:
        return f"Communication: {self.mentor.employee.employee_code} - {self.student.first_name} on {self.communication_date}"