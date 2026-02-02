from django.contrib import admin

from EXPENSE.models import ExpenseCategoryMaster, PartyMaster,ExpenseHeader,ExpenseDetail,ExpensePayment,ExpensePaymentDetail,OtherIncome,OtherIncomeDetail

admin.site.register(ExpenseCategoryMaster)
admin.site.register(PartyMaster)
admin.site.register(ExpenseHeader)
admin.site.register(ExpenseDetail)
admin.site.register(ExpensePayment)
admin.site.register(ExpensePaymentDetail)
admin.site.register(OtherIncome)
admin.site.register(OtherIncomeDetail)



