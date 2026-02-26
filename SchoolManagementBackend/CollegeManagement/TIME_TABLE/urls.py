from django.urls import path

from TIME_TABLE import views

urlpatterns = [

    # path('api/TIME_TABLE/GetTermList/',views.GetTermListAPIView.as_view(),name='GetTermListBasedOnClass'),
    path('api/TIME_TABLE/TimeTableCreate/',views.TimeTableEntryForProfessors.as_view(),name='TimeTableCreate'),
    path('api/TIME_TABLE/GetSearchedTimeTableList/',views.GetSearchedTimeTableListAPIView.as_view(),name='GetSearchedTimeTableEntry'),
    path('api/TIME_TABLE/GetTimeTableEntryDifSearchBasisList/',views.GetTimeTableEntryDifSearchBasisListAPIView.as_view(),name='GetTimeTableEntryDifSearchBasisList'),
    path('api/TIME_TABLE/delete/',views.GetTimeTableEntryDestroyAPIView.as_view(),name='deletetimetable'),
    path('api/LECTURE_PLAN/GetLectureList/',views.GetTopicListAPIView.as_view(),name='GettopicListBasedOnSubject'),
    path('api/LecturePeriod/GetLecturePeriodList/',views.GetLecturePeriodList.as_view(),name='GetLecturePeriodList'),
    path('api/LECTURE_PLAN/LecturePlanCreate/',views.LecturePlanCreateAPIView.as_view(),name='LessionPlanCreate'),
    path('api/LECTURE_PLAN/GetProfessorLecturePlanList/',views.GetProfessorLecturePlanListAPIView.as_view(),name='GetTeacherlessonplanlist'),
    path('api/TERM_SUBJECT_LIST/GetTermSubjectList/',views.GetSubjectListBasedOnTermListAPIView.as_view(),name='GettermBasedOnSubjectlist'),
    path('api/LECTURE_PLAN/GetProfessorLecturePlanUpdate/',views.ProfessorLectureUpdateAPIView.as_view(),name='GetTeacherlessonplanupdate'),
    path('api/LECTURE_PLAN/GetProfessorLecturePlanSearchList/',views.TeacherLessonPlanSearchCriteriaListAPIView.as_view(),name='Professorlecturesearchlist'),

    ]


