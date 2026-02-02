from django.urls import path
from MENTOR import views

urlpatterns = [
    path('api/Mentor/studentmentorAssign/',views.StudentMentorAssignCreateAPIView.as_view(),name='studentmentorAssign'),
    path('api/Mentor/studentmentorAssignSearch/',views.StudentMentorAssignSearchListAPIView.as_view(),name='studentmentorAssignList'),
    path('api/Mentor/mentorWiseStudentList/',views.StudentAssignListBasedOnMentorListAPIView.as_view(),name='MentorWiseStudentList'),

    path('api/Mentor_Student_Communication/studentMentorCommunication/',views.StudentMentorCommunicationCreateAPIView.as_view(),name='studentMentorCommunication'),

    path('api/Mentor_Student_Communication/studentcommunicationSearchList/',views.StudentCommunicationSearchListAPIView.as_view(),name='studentcommunicationSearchList'),
    path('api/STUDENT_DETAILS/StudentDetailsList/',views.StudentDetailsListAPIView.as_view(),name='studentDetailsList'),

    path('api/STUDENT_DETAILS/StudentDetailsBasedOnRegistrationNoBarcodeList/',views.GetSearchStudentDetailsBasedRegistrationBarcodeListAPIView.as_view(),name='studentDetailsBarcodeRegistrationNoBased'),


    ]

from MENTOR import views

urlpatterns = [
    # Mentor CRUD
    path("api/Mentor/mentors/", views.MentorListCreateAPIView.as_view(), name="mentor-list-create"),
    path(
        "api/Mentor/mentors/<int:pk>/",
        views.MentorRetrieveUpdateDestroyAPIView.as_view(),
        name="mentor-detail",
    ),
    # Student–Mentor assignment
    path(
        "api/Mentor/studentmentorAssign/",
        views.StudentMentorAssignAPIView.as_view(),
        name="student-mentor-assign",
    ),
    # Student–Mentor assignment search
    path(
        "api/Mentor/studentmentorAssignSearch/",
        views.StudentMentorAssignSearchListAPIView.as_view(),
        name="studentmentorAssignList",
    ),
    # Remove student-mentor assignment
    path(
        "api/Mentor/studentmentorAssign/<int:pk>/",
        views.StudentMentorAssignmentDeleteAPIView.as_view(),
        name="student-mentor-assign-delete",
    ),
    # Mentor with assigned students (for main table UI)
    path(
        "api/Mentor/mentorsWithStudents/",
        views.MentorWithStudentsListAPIView.as_view(),
        name="mentor-with-students-list",
    ),
    # Get students for a specific mentor/teacher
    path(
        "api/Mentor/mentorWiseStudentList/",
        views.MentorWiseStudentListAPIView.as_view(),
        name="mentor-wise-student-list",
    ),
    # Mentor-Student Communication
    path(
        "api/Mentor_Student_Communication/studentcommunicationSearchList/",
        views.MentorStudentCommunicationListCreateAPIView.as_view(),
        name="mentor-student-communication-list-create",
    ),
    path(
        "api/Mentor_Student_Communication/studentcommunicationSearchList/<int:pk>/",
        views.MentorStudentCommunicationDeleteAPIView.as_view(),
        name="mentor-student-communication-delete",
    ),
]
