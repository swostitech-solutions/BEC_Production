from django.urls import path

from STAFF import views
urlpatterns = [

    path('api/STAFF/RegistrationCreate/',
         views.StaffRegistrationBasicInfoCreateAPIView.as_view(),name='Staff-Registration-Create'),

    path('api/STAFF/RegistrationAddressCreateUpdate/',
         views.StaffRegistrationAddressCreateUpdateAPIView.as_view(),name='Staff-Address-Create-Update'),

    path('api/STAFF/RegistrationDocumentUploadCreateUpdate/',
         views.StaffRegistrationDocumentCreateUpdateAPIView.as_view(), name='Staff-Document-Create-Update'),

    path('api/STAFF/RegistrationFamilyRelationCreateUpdate/',
         views.StaffRegistrationFamilyCreateUpdateAPIView.as_view(), name='Staff-Family-Relation-Create-Update'),

    path('api/STAFF/RegistrationQualificationCreateUpdate/',
         views.StaffRegistrationQualificationCreateUpdateAPIView.as_view(), name='Staff-Qualification-Create-Update'),

    path('api/STAFF/RegistrationCourseCreateUpdate/',
         views.StaffRegistrationCourseCreateUpdateAPIView.as_view(), name='Staff-Course-Create-Update'),

    path('api/STAFF/RegistrationLANGUAGECreateUpdate/',
         views.StaffRegistrationLANGUAGECreateUpdateAPIView.as_view(), name='Staff-Language-Create-Update'),

    path('api/STAFF/RegistrationEXPERIENCECreateUpdate/',
         views.StaffRegistrationExperienceCreateUpdateAPIView.as_view(), name='Staff-Experience-Create-Update'),

    path('api/STAFF/RegistrationBasicDetailsRetrieve/',
         views.StaffRegistrationDetailsRetrieveAPIView.as_view(), name='Staff-Basic-Details-Retrieve'),
    path('api/STAFF/RegistrationAddressDetailsRetrieve/',
         views.StaffAddressDetailsRetrieveAPIView.as_view(), name='Staff-Address-Retrieve'),

    path('api/STAFF/RegistrationDocumentDetailsRetrieve/',
         views.StaffDocumentDetailsRetrieveAPIView.as_view(), name='Staff-Document-Retrieve'),

    path('api/STAFF/RegistrationRelationDetailsRetrieve/',
         views.StaffFamilyDetailsRetrieveAPIView.as_view(), name='Staff-Relation-Retrieve'),

    path('api/STAFF/RegistrationEducationDetailsRetrieve/',
         views.StaffEducationDetailsRetrieveAPIView.as_view(), name='Staff-Education-Retrieve'),

    path('api/STAFF/RegistrationCourseDetailsRetrieve/',
         views.StaffCourseDetailsRetrieveAPIView.as_view(), name='Staff-Course-Retrieve'),

    path('api/STAFF/RegistrationLanguageDetailsRetrieve/',
         views.StaffLanguageDetailsRetrieveAPIView.as_view(), name='Staff-Language-Retrieve'),

    path('api/STAFF/RegistrationExperienceDetailsRetrieve/',
         views.StaffExperienceDetailsRetrieveAPIView.as_view(), name='Staff-Experience-Retrieve'),

    path('api/STAFF/RegistrationstaffList/',
         views.EmployeeDetailsListAPIView.as_view(), name='StaffList'),

    path('api/STAFF/AllEmployeeDetailsForPDF/',
         views.StaffAllDetailsForPDFAPIView.as_view(), name='Staff-All-Details-For-PDF'),

    # path('api/STAFF/EmployeeTypeList/',
    #      views.EmployeeTypeListAPIView.as_view(), name='EmployeeTypelist'),

]
