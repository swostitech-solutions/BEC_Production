from django.core.validators import RegexValidator
from django.db import models
from Acadix.models import Organization, Batch, City, State, Country, Bank, \
    BankAccountDetail, AcademicYear


class ExpenseCategoryMaster(models.Model):
    expense_category_id = models.AutoField(primary_key=True)
    expense_category = models.CharField(max_length=200)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    enabled = models.CharField(max_length=1, default='Y')
    category_type = models.CharField(max_length=1, null=True, blank=True)
    category_flag = models.CharField(max_length=1, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'EXPENSE_CATEGORY_MASTER'


class PartyMaster(models.Model):
    party_id = models.AutoField(primary_key=True)
    party_name = models.CharField(max_length=200)
    customer_supplier = models.CharField(max_length=50)
    enabled = models.CharField(max_length=1, default='Y')
    address = models.CharField(max_length=100, null=True, blank=True)
    city = models.ForeignKey(
        City, on_delete=models.SET_NULL, null=True, blank=True
    )
    state = models.ForeignKey(
        State, on_delete=models.SET_NULL, null=True, blank=True
    )
    country = models.ForeignKey(
        Country, on_delete=models.SET_NULL,  null=True, blank=True
    )
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    gst_no = models.CharField(max_length=50, null=True, blank=True)
    # phone = models.IntegerField(null=True,blank=True)
    phone = models.CharField(max_length=10, null=True, blank=True, validators=[
        RegexValidator(
            regex=r'^\d{10}$',
            message="Phone number must be exactly 10 digits."
        )
    ])
    email_id = models.EmailField(max_length=100, null=True, blank=True)
    party_flag = models.CharField(max_length=1, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'PARTY_MASTER'


class ExpenseHeader(models.Model):
    expense_header_id = models.AutoField(primary_key=True)
    date = models.DateField()
    expense_no = models.BigIntegerField()
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    party = models.ForeignKey(PartyMaster, on_delete=models.CASCADE)
    party_reference = models.CharField(max_length=250, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=18, decimal_places=2)
    paid_amount = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    balance_amount = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'EXPENSE_HEADER'


class ExpenseDetail(models.Model):   # main table
    expense_detail_id = models.AutoField(primary_key=True)
    expense_header = models.ForeignKey(ExpenseHeader, on_delete=models.CASCADE)
    expense_category = models.ForeignKey(ExpenseCategoryMaster, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=18, decimal_places=0)
    remarks = models.CharField(max_length=5000, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'EXPENSE_DETAIL'


class ExpensePayment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    payment_no = models.BigIntegerField()
    ExpenseHeaderId = models.ForeignKey(ExpenseHeader, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=50)  # In By Default cash so no need to change it
    payment_amount = models.DecimalField(max_digits=18, decimal_places=2)
    payment_reference = models.CharField(max_length=250, null=True, blank=True)
    payment_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'EXPENSE_PAYMENT'


class ExpensePaymentDetail(models.Model):
    payment_detail_id = models.AutoField(primary_key=True)
    ExpensePaymentId = models.ForeignKey(ExpensePayment, on_delete=models.CASCADE)
    applied_amount = models.DecimalField(max_digits=18, decimal_places=2)
    applied_date = models.DateField()
    payment_method = models.CharField(max_length=50, null=True, blank=True)
    bankId = models.ForeignKey(Bank, on_delete=models.CASCADE, null=True, blank=True)
    bank_accountId = models.ForeignKey(
        BankAccountDetail, on_delete=models.CASCADE, null=True, blank=True
    )
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'EXPENSE_PAYMENT_DETAILS'


class OtherIncome(models.Model):
    income_id = models.AutoField(primary_key=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    income_no = models.IntegerField()
    income_date = models.DateField()
    party_id = models.ForeignKey(PartyMaster, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=50)
    bank_id = models.ForeignKey(
        Bank, on_delete=models.SET_NULL, null=True, blank=True
    )
    account_id = models.ForeignKey(
        BankAccountDetail, on_delete=models.SET_NULL, null=True, blank=True
    )
    reference_no = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'OtherIncome'


class OtherIncomeDetail(models.Model):
    income_detail_id = models.AutoField(primary_key=True)
    income_id = models.ForeignKey(OtherIncome, on_delete=models.CASCADE)
    category_id = models.ForeignKey(ExpenseCategoryMaster,on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    remarks = models.CharField(max_length=250, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'OtherIncomeDetail'

