from django.urls import path

from EXPENSE import views

urlpatterns = [

    path('api/EXPENSE/EXPENSE_INCOME/CategoryCreate/',views.ExpenseIncomeCategoryCreateAPIView.as_view(),name='ExpenseIncomeCategoryCreate'),

    path('api/EXPENSE/EXPENSE_INCOME/CategoryList/',views.ExpenseIncomeCategoryListAPIView.as_view(),name='ExpenseIncomeCategoryList'),

    path('api/EXPENSE/EXPENSE_INCOME/CategoryUpdate/<int:pk>',views.ExpenseIncomeCategoryUpdateAPIView.as_view(),name='ExpenseIncomeCategoryUpdate'),

    path('api/EXPENSE/PARTY_MASTER/PartyMasterCreate/',views.PartyMasterCreateAPIView.as_view(),name='PartyMasterCreate'),

    path('api/EXPENSE/PARTY_MASTER/PartyMasterList/',views.PartyMasterListAPIView.as_view(),name='PartyMasterCreate'),

    path('api/EXPENSE/PARTY_MASTER/PartyMasterRetrieve/', views.PartyMasterRetrieveAPIView.as_view(),name='PartyMasterRetrieve'),

    path('api/EXPENSE/PARTY_MASTER/PARTYMASTERUpdate/<int:pk>',views.PartyMasterUpdateAPIView.as_view(),name='PartyMasterUpdate'),

    path('api/EXPENSE/PARTY_MASTER/PartyMasterSearchList/',views.PartyMasterSearchListAPIView.as_view(), name='PartySearchList'),

    path('api/EXPENSE/EXPENSE_HEADER/GetExpenseNo/',views.ExpenseNoGenerateListAPIView.as_view(), name='ExpenseNoList'),

    path('api/EXPENSE/EXPENSE_HEADER/ExpenseCreate/', views.AddExpenseCreateAPIView.as_view(),name='ExpenseAdd'),

    path('api/EXPENSE/EXPENSE_INCOME/ListBasedOnCategory/', views.ExpenseIncomeListBasedOnCategory.as_view(),name='ExpenseIncomeBasedOnCategoryList'),

    path('api/EXPENSE/EXPENSE_HEADER/ExpenseSearchList/', views.ExpenseSearchListAPIView.as_view(),name='ExpenseSearchList'),

    path('api/EXPENSE/EXPENSE_HEADER/ExpanseDetailsRetrieve/<int:pk>', views.ExpenseRetriveListAPIView.as_view(),name='ExpansedetialsRetrieve'),

    path('api/EXPENSE/EXPENSE_HEADER/ExpenseUpdate/<int:pk>',views.ExpenseUpdateAPIView.as_view(),name='ExpenseUpdate'),

    path('api/EXPENSE/INCOME/GetIncomeNo/',views.IncomeNoGenerateListAPIView.as_view(), name='IncomeNoList'),

    path('api/EXPENSE/INCOME/IncomeCreate/', views.AddIncomeCreateAPIView.as_view(),name='IncomeAdd'),

    path('api/EXPENSE/INCOME/IncomeSearchList/', views.IncomeSearchListAPIView.as_view(),name='IncomeSearchList'),

    path('api/EXPENSE/INCOME/IncomeDetailsRetrieve/<int:pk>/', views.IncomeRetriveListAPIView.as_view(),name='IncomedetialsRetrieve'),

    path('api/EXPENSE/INCOME/IncomeUpdate/<int:pk>',views.IncomeUpdateAPIView.as_view(),name='IncomeUpdate'),
    # path('api/EXPENSE/INCOME/IncomeDetailDataDelete/<int:pk>',views.IncomeUpdateAPIView.as_view(),name='IncomeUpdate'),

    path('api/EXPENSE/PROFIT_LOSS/profitlossGetList/', views.ProfitLoseByDayListAPIView.as_view(),name='ProfitLossListByDay'),

    path('api/EXPENSE/DayBook/ExpenseIncomeList/', views.DayBookListAPIView.as_view(),name='ProfitLossListByDay'),

    path('api/EXPENSE/ExpenseLedger/ExpenseLidgerList/', views.ExpenseLedgerListAPIView.as_view(),name='ExpenseLidgerList'),

    path('api/EXPENSE/ExpenseDetails/ExpenseNo/<int:expense_no>/', views.FetchExpenseDetailsBasedOnExpenseNo.as_view(),name='ExpenseDetailsList'),

    path('api/EXPENSE/IncomeDetails/IncomeNo/<int:Income_no>/', views. FetchInComeDetailsBasedOnIncomeNo.as_view(),
         name='IncomedetialsList'),

    path('api/EXPENSE/DayBook/VerifyFeeReceiptData/', views.VerifyFeeReceiptDataAPIView.as_view(),
         name='VerifyFeeReceiptData'),


]