from django.db import models
from Acadix.models import StudentCourse, AcademicYear, Semester


class ExamType(models.Model):
    """Types of exams like Mid-Term, Final, Unit Test, etc."""
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'exam_type'

    def __str__(self):
        return self.name


class StudentExamResult(models.Model):
    """Main exam result record for a student"""
    student_course = models.ForeignKey(
        StudentCourse,
        on_delete=models.CASCADE,
        related_name='exam_results'
    )
    academic_year = models.ForeignKey(
        AcademicYear,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    semester = models.ForeignKey(
        Semester,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    exam_type = models.ForeignKey(
        ExamType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    exam_date = models.DateField(null=True, blank=True)
    total_marks = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    obtained_marks = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    overall_grade = models.CharField(max_length=10, null=True, blank=True)
    rank = models.IntegerField(null=True, blank=True)
    remarks = models.TextField(null=True, blank=True)
    is_published = models.BooleanField(default=False)
    created_by = models.IntegerField(null=True, blank=True)

    # Health status fields
    height = models.CharField(max_length=50, null=True, blank=True,
                              help_text="Height (can be string or number, e.g., '150', '150cm', or 150)")
    weight = models.CharField(max_length=50, null=True, blank=True,
                              help_text="Weight (can be string or number, e.g., '45', '45kg', or 45)")
    as_on_date = models.DateField(null=True, blank=True,
                                  help_text="Date when health status was recorded (YYYY-MM-DD format)")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_exam_result'
        ordering = ['-created_at']

    def __str__(self):
        return f"Result - {self.student_course.student.first_name} ({self.semester})"


class SubjectResult(models.Model):
    """Individual subject marks for an exam result"""
    exam_result = models.ForeignKey(
        StudentExamResult,
        on_delete=models.CASCADE,
        related_name='subject_results'
    )
    subject_name = models.CharField(max_length=200)
    max_marks = models.DecimalField(max_digits=10, decimal_places=2, default=100)
    obtained_marks = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    grade = models.CharField(max_length=10, null=True, blank=True)

    # Additional assessment components
    periodic_assessment = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    notebook_maintenance = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    subject_enrichment = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    practical_marks = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    theory_marks = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    is_pass = models.BooleanField(default=True)
    remarks = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'subject_result'

    def __str__(self):
        return f"{self.subject_name} - {self.obtained_marks}/{self.max_marks}"


class AttendanceRecord(models.Model):
    """Attendance record for report card"""
    exam_result = models.OneToOneField(
        StudentExamResult,
        on_delete=models.CASCADE,
        related_name='attendance'
    )
    actual_attendance = models.IntegerField(null=True, blank=True)
    possible_attendance = models.IntegerField(null=True, blank=True)
    attendance_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = 'attendance_record'


class CoScholasticResult(models.Model):
    """Co-scholastic activities and grades"""
    exam_result = models.ForeignKey(
        StudentExamResult,
        on_delete=models.CASCADE,
        related_name='co_scholastic_results'
    )
    activity_name = models.CharField(max_length=200)
    grade = models.CharField(max_length=10, null=True, blank=True)
    remarks = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'co_scholastic_result'

    def __str__(self):
        return f"{self.activity_name} - {self.grade}"


class TeacherRemarks(models.Model):
    """Teacher remarks and other comments"""
    exam_result = models.OneToOneField(
        StudentExamResult,
        on_delete=models.CASCADE,
        related_name='teacher_remarks'
    )
    class_teacher_remarks = models.TextField(null=True, blank=True)
    principal_remarks = models.TextField(null=True, blank=True)
    activities = models.TextField(null=True, blank=True)
    competitions = models.TextField(null=True, blank=True)
    co_curricular_participation = models.TextField(null=True, blank=True)
    holiday_homework = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'teacher_remarks'


# Keep the old model for backward compatibility
class StudentReportCard(models.Model):
    student_course = models.ForeignKey(
        StudentCourse,
        on_delete=models.CASCADE,
        related_name='report_cards'
    )
    academic_year = models.ForeignKey(
        AcademicYear,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    semester = models.ForeignKey(
        Semester,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    report_pdf = models.FileField(upload_to='report_cards/')
    generated_date = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField(null=True, blank=True)
    remarks = models.TextField(null=True, blank=True)
    is_published = models.BooleanField(default=False)

    class Meta:
        db_table = 'student_report_card'
        ordering = ['-generated_date']

    def __str__(self):
        return f"Report Card - {self.student_course.student.first_name} ({self.generated_date})"