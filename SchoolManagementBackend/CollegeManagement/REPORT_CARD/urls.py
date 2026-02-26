from django.urls import path
from . import views

urlpatterns = [
    # Student list for report card
    path('api/reportcard/studentlist/', views.ReportCardStudentListAPIView.as_view(), name='reportcard-studentlist'),

    # New exam result APIs (recommended approach)
    path('api/reportcard/save-result/', views.SaveExamResultAPIView.as_view(), name='reportcard-save-result'),
    path('api/reportcard/get-result/<int:student_course_id>/', views.GetExamResultAPIView.as_view(),
         name='reportcard-get-result'),
    path('api/reportcard/get-result-by-student/<int:student_id>/', views.GetExamResultByStudentIdAPIView.as_view(),
         name='reportcard-get-result-by-student'),
    path('api/reportcard/get-all-results/', views.GetAllExamResultsAPIView.as_view(),
         name='reportcard-get-all-results'),

    # Legacy PDF APIs (kept for backward compatibility)
    path('api/reportcard/save-pdf/', views.SaveReportCardPDFAPIView.as_view(), name='reportcard-save-pdf'),
    path('api/reportcard/get-reports/<int:student_course_id>/', views.GetStudentReportCardsAPIView.as_view(),
         name='reportcard-get-reports'),
    path('api/reportcard/get-reports-by-student/<int:student_id>/', views.GetStudentReportCardsByStudentIdAPIView.as_view(),
         name='reportcard-get-reports-by-student'),
]