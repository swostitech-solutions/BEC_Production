from rest_framework import serializers

from .models import ExpenseCategoryMaster, PartyMaster, ExpenseHeader, OtherIncome,OtherIncomeDetail


class ExpenseCategoryMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategoryMaster
        fields = [
            'expense_category_id',
            'expense_category',
            'organization',
            'batch',
            'enabled',
            'category_type',
            'category_flag',
            'is_active',
            'created_by'
        ]

class ExpenseCategoryMasterUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategoryMaster
        fields = [
            'expense_category_id',
            'expense_category',
            'organization',
            'batch',
            'enabled',
            'category_type',
            'updated_by'
        ]

class PartyMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartyMaster
        fields = [
            'party_id',
            'party_name',
            'customer_supplier',
            'enabled',
            'address',
            'city',
            'state',
            'country',
            'organization',
            'batch',
            'gst_no',
            'phone',
            'email_id',
            'is_active',
            'created_by'
        ]

class PartyMasterUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartyMaster
        fields = [
            'party_name',
            'customer_supplier',
            'enabled',
            'address',
            'city',
            'state',
            'country',
            'organization',
            'batch',
            'gst_no',
            'phone',
            'email_id',
            'is_active',
            'updated_by'
        ]

class PartyMasterSearchSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True)
    batch_id= serializers.IntegerField(required=True)
    party_name = serializers.CharField(allow_null=True,allow_blank=True)
    party_type= serializers.CharField(allow_blank=True,allow_null=True)
    gst_no = serializers.IntegerField(allow_null=True)
    address = serializers.CharField(allow_null=True,allow_blank=True)
    city_id = serializers.CharField(allow_blank=True,allow_null=True)
    state_id = serializers.CharField(allow_null=True,allow_blank=True)
    is_active = serializers.BooleanField(required=False)

class ExpenseHeaderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseHeader
        fields = [
            'date',
            'expense_no',
            'organization',
            'batch',
            'party',
            'party_reference',
            'total_amount',
            'paid_amount',
            'balance_amount',
            'is_active'
        ]

class ExpenseHeaderAddSerializer(serializers.Serializer):
    created_by = serializers.IntegerField(required=True)
    org_id = serializers.IntegerField(required=True)
    branch_id = serializers.IntegerField(required=True)
    partymasterId = serializers.IntegerField(required=True)
    date = serializers.DateField(required=True)
    expense_no = serializers.CharField(required=False, allow_blank=True)
    party_reference = serializers.CharField(max_length=250,required=False, allow_blank=True)
    total_amount = serializers.DecimalField(max_digits=18, decimal_places=2,required=False)
    paid_amount = serializers.DecimalField(max_digits=18,decimal_places=2,required=False)
    balance_amount = serializers.DecimalField(max_digits=18,decimal_places=2,required=False)

class ExpenseDetailsSerializer(serializers.Serializer):
    expensecategoryId = serializers.IntegerField(required=True)
    amount= serializers.DecimalField(max_digits=18, decimal_places=2,required=True)
    remarks = serializers.CharField(max_length=5000,required=False)

class PaymentBasedOnCash(serializers.Serializer):
    payment_method = serializers.CharField(max_length=50,required=True)
    cash_amount = serializers.DecimalField(max_digits=18, decimal_places=2,required=True)

class PaymentBasedOnBank(serializers.Serializer):
    payment_method = serializers.CharField(max_length=50, required=False)
    bank_amount = serializers.DecimalField(max_digits=18, decimal_places=2, required=False)
    bankId = serializers.IntegerField(required=False)
    bank_accountId = serializers.IntegerField(required=False)


class ExpenseAddSerializer(serializers.Serializer):
    ExpenseHeaderadd = ExpenseHeaderAddSerializer(required=True)
    ExpenseDetails = serializers.ListSerializer(child=ExpenseDetailsSerializer(),required=True)
    PaymentBasedOnCash = PaymentBasedOnCash(required=False)
    PaymentBasedOnBank = PaymentBasedOnBank(required=False)

class ExpenseHeaderUpdateSerializer(serializers.Serializer):
    updated_by = serializers.IntegerField(required=True)
    organization_id = serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)
    partymasterId = serializers.IntegerField(required=True)
    date = serializers.DateField(required=True)
    expense_no = serializers.IntegerField(required=True)
    party_reference = serializers.CharField(max_length=250,required=True)
    total_amount = serializers.DecimalField(max_digits=18, decimal_places=2,required=True)
    paid_amount = serializers.DecimalField(max_digits=18,decimal_places=2,required=True)
    balance_amount = serializers.DecimalField(max_digits=18,decimal_places=2,required=True)



class ExpenseUpdateDetailsSerializer(serializers.Serializer):
    expense_detail_id = serializers.IntegerField(required=True)
    expensecategoryId = serializers.IntegerField(required=True)
    amount= serializers.DecimalField(max_digits=18, decimal_places=2,required=True)
    remarks = serializers.CharField(max_length=5000,required=False)

class paymentUpdateBasedCash(serializers.Serializer):
    payment_detail_id = serializers.IntegerField(required=False)
    payment_method = serializers.CharField(max_length=50,required=True)
    cash_amount = serializers.DecimalField(max_digits=18, decimal_places=2,required=True)

class paymentUpdateBasedOnBank(serializers.Serializer):
    payment_detail_id = serializers.IntegerField(required=False)
    payment_method = serializers.CharField(max_length=50, required=True)
    bank_amount = serializers.DecimalField(max_digits=18, decimal_places=2, required=True)
    bankId = serializers.IntegerField(required=True)
    bank_accountId = serializers.IntegerField(required=True)


class ExpenseUpdateSerializer(serializers.Serializer):
    ExpenseHeaderadd= ExpenseHeaderUpdateSerializer(required=True)
    ExpenseDetails = serializers.ListSerializer(child=ExpenseUpdateDetailsSerializer(),required=True)
    PaymentBasedOnCash = paymentUpdateBasedCash(required=False)
    PaymentBasedOnBank = paymentUpdateBasedOnBank(required=False)


class ExpenseIncomeCategoryList(serializers.Serializer):
    organization_id= serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)
    flag = serializers.CharField(max_length=1,required=True)

class ExpenseSearchSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)

    party_id= serializers.IntegerField(required=False)
    from_date = serializers.DateField(required=False)
    to_date = serializers.DateField(required=False)
    ExpenseCategoryId = serializers.IntegerField(required=False)
    PartyReference = serializers.CharField(required=False)


class IncomeHeaderSerializer(serializers.Serializer):
    created_by = serializers.IntegerField(required=True)
    org_id = serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)
    academic_year_id = serializers.IntegerField(required=True)
    payment_method = serializers.CharField(max_length=10, required=True)
    bank = serializers.IntegerField(required=False, allow_null=True)
    account = serializers.IntegerField(required=False, allow_null=True)
    party_id = serializers.IntegerField(required=True)
    date = serializers.DateField(required=True)
    income_no = serializers.IntegerField(required=True)
    party_reference = serializers.CharField(max_length=50, required=False, allow_null=True, allow_blank=True)
    total_amount = serializers.DecimalField(max_digits=18, decimal_places=2, required=True)
    
    def validate(self, data):
        # Convert empty strings to None for optional fields
        if 'bank' in data and data['bank'] == '':
            data['bank'] = None
        if 'account' in data and data['account'] == '':
            data['account'] = None
        if 'party_reference' in data and data['party_reference'] == '':
            data['party_reference'] = None
        if 'batch_id' in data and data['batch_id'] == '':
            data['batch_id'] = None
        return data

class IncomeDetailsSerializer(serializers.Serializer):
    category_id = serializers.IntegerField(required=False, allow_null=True)
    amount = serializers.DecimalField(max_digits=18, decimal_places=2, required=True)
    remarks = serializers.CharField(max_length=50, allow_null=True, allow_blank=True, required=False)
    
    def validate(self, data):
        # Convert empty strings to None
        if 'category_id' in data and data['category_id'] == '':
            data['category_id'] = None
        if 'remarks' in data and data['remarks'] == '':
            data['remarks'] = None
        return data


class AddIncomeSerializer(serializers.Serializer):
    IncomeHeaderDetails = IncomeHeaderSerializer(required=True)
    IncomeDetails = serializers.ListSerializer(child=IncomeDetailsSerializer(), required=True)


class IncomeHeaderUpdateSerializer(serializers.Serializer):
    updated_by = serializers.IntegerField(required=True)
    organization_id= serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)
    academic_year_id = serializers.IntegerField(required=True)
    payment_method= serializers.CharField(max_length=10,required=True)
    bank= serializers.IntegerField(required=False)
    account= serializers.IntegerField(required=False)
    party_id= serializers.IntegerField(required=True)
    date = serializers.DateField(required=True)
    income_no = serializers.IntegerField(required=True)
    party_reference= serializers.CharField(max_length=50)
    total_amount = serializers.DecimalField(max_digits=18, decimal_places=2,required=True)


class IncomeDetailsUpdateSerializer(serializers.Serializer):
    income_detail_id= serializers.IntegerField(required=False)
    category_id= serializers.IntegerField(required=True)
    amount=serializers.DecimalField(max_digits=18, decimal_places=2,required=True)
    remarks = serializers.CharField(max_length=50,allow_null=True,allow_blank=True)

class AddIncomeUpdateSerializer(serializers.Serializer):
    IncomeHeaderDetails = IncomeHeaderUpdateSerializer(required=True)
    IncomeDetails = serializers.ListSerializer(child=IncomeDetailsUpdateSerializer(),required=True)


class OtherIncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = OtherIncome
        fields = [
            'income_id',
            'organization_id',
            'batch_id',
            'academic_year_id',
            'income_no',
            'income_date',
            'party_id',
            'payment_method',
            'bank_id',
            'account_id',
            'reference_no',
            'amount',
            'is_active'
        ]


class IncomeSearchSerializer(serializers.Serializer):
    organization_id= serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)
    academic_year_id = serializers.IntegerField(required=True)
    party_id = serializers.IntegerField(required=False)
    from_date = serializers.DateField(required=False)
    to_date = serializers.DateField(required=False)
    payment_method = serializers.CharField(max_length=50,required=False)
    bankId = serializers.IntegerField(required=False)
    accountId = serializers.IntegerField(required=False)
    party_reference = serializers.CharField(max_length=50,required=False)


class ProfitLossSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)
    from_date = serializers.DateField(required=True)
    date = serializers.DateField(required=True)

class DayBookSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)
    from_date = serializers.DateField(required=True)
    to_date = serializers.DateField(required=True)

    payment_methodId= serializers.IntegerField(required=True)
    bankId= serializers.IntegerField(required=False)
    accountId = serializers.IntegerField(required=False)



class ExpenseLedgerSerializer(serializers.Serializer):
    # academic_year_id= serializers.IntegerField(required=False)
    organization_id= serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)
    party_id = serializers.IntegerField(required=False)
    Expense_category_id= serializers.IntegerField(required=False)
    from_date = serializers.DateField(required=True)
    to_date = serializers.DateField(required=True)
    payment_method = serializers.IntegerField(required=False)





