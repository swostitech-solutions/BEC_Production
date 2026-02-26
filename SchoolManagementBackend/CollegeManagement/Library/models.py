from django.db import models

from Acadix.models import Organization, Batch, AcademicYear, StudentRegistration, Employee, EmployeeMaster
from Acadix.serializers import ProfessionSerializer


# Create your models here.
class LibraryBranch(models.Model):
    library_branch_id = models.AutoField(primary_key=True, db_column='library_branch')
    library_branch_name = models.CharField(max_length=500, null=False, blank=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "LibraryBranch"


class BookCategory(models.Model):
    category_name = models.CharField(max_length=250, null=False, blank=False)
    category_description = models.CharField(max_length=250, null=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    is_active = models.BooleanField()
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.category_name


class BookSubCategory(models.Model):
    category = models.ForeignKey(BookCategory, on_delete=models.CASCADE)
    sub_category_name = models.CharField(max_length=250, null=False, blank=False)
    sub_category_description = models.CharField(max_length=250, null=True, blank=True)
    is_active = models.BooleanField()
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class BookLocation(models.Model):
    book_location = models.CharField(max_length=250, null=False, blank=False)
    book_location_desc = models.CharField(max_length=250, null=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    is_active = models.BooleanField()
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class LibraryBook(models.Model):
    book_code = models.CharField(max_length=50)
    book_name = models.CharField(max_length=200)
    book_category = models.ForeignKey(BookCategory, on_delete=models.CASCADE)
    book_sub_category = models.ForeignKey(BookSubCategory, on_delete=models.CASCADE)
    library_branch = models.ForeignKey(LibraryBranch, on_delete=models.CASCADE, null=True, blank=True)
    book_status = models.CharField(max_length=20)
    no_of_copies = models.IntegerField(null=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    publisher = models.CharField(max_length=100, null=True, blank=True)
    author = models.CharField(max_length=100, null=True, blank=True)
    publish_year = models.CharField(max_length=50, null=True, blank=True)
    volume = models.IntegerField(null=True, blank=True)
    front_cover = models.CharField(max_length=1000, null=True, blank=True)  # models.ImageField(null=True, blank=True)
    back_cover = models.CharField(max_length=1000, null=True, blank=True)
    edition = models.CharField(max_length=50, null=True, blank=True)
    pages = models.IntegerField(null=True, blank=True)
    barcode_auto_generated = models.BooleanField(default=True)
    ISBN = models.CharField(max_length=50, null=True, blank=True)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    createdDate = models.DateField(null=True, blank=True)
    allow_issue = models.CharField(max_length=1, null=True, blank=True)
    type = models.CharField(max_length=50, null=True, blank=True)
    IssueNo = models.CharField(max_length=50, null=True, blank=True)
    Period = models.CharField(max_length=50, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.book_name} ({self.book_code})"


class LibraryPurchase(models.Model):
    book = models.ForeignKey(LibraryBook, on_delete=models.CASCADE)
    purchase_date = models.DateField(null=True, blank=True)
    purchase_from = models.CharField(max_length=100, null=True, blank=True)
    bill_no = models.CharField(max_length=100, null=True, blank=True)
    bill_value = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    bill_concession = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    no_of_copies = models.IntegerField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Purchase from {self.purchase_from} on {self.purchase_date}"


class LibraryBooksBarcode(models.Model):
    book = models.ForeignKey(LibraryBook, on_delete=models.CASCADE)
    barcode = models.BigIntegerField(null=False, blank=False)
    book_barcode_status = models.CharField(max_length=20)
    remarks = models.CharField(max_length=200, null=True, blank=True)
    barcode_auto_generated = models.BooleanField(default=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    location_id = models.ForeignKey(BookLocation, on_delete=models.CASCADE, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Barcode: {self.barcode}, Status: {self.book_barcode_status}"


class LibraryBooksIssues(models.Model):
    book_issue_id = models.AutoField(primary_key=True, db_column='book_issue_id')
    student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE, null=True, blank=True)
    professor = models.ForeignKey(EmployeeMaster, on_delete=models.CASCADE, null=True, blank=True)
    book_detail = models.ForeignKey(LibraryBooksBarcode, on_delete=models.CASCADE)
    issue_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    lost = models.CharField(max_length=1, null=True, blank=True)
    remarks = models.CharField(max_length=500, null=True, blank=True)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    issued_by = models.IntegerField(null=False, blank=False)
    returned_by = models.IntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "LibraryBooksIssues"

    def __str__(self):
        return f"Library book issued: {self.book_issue_id}"


class ParameterValue(models.Model):
    parameter_name = models.CharField(max_length=250, primary_key=True, db_column='parameter_name')
    parameter_value = models.CharField(max_length=500, null=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    org_value = models.CharField(max_length=50, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "ParameterValue"
