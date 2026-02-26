from django.urls import path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from Acadix import views

schema_view = get_schema_view(
    openapi.Info(
        title="Swostitech_ACADIX API",
        default_version='v1',
        description="API Description",
        terms_of_service="https://www.example.com/policies/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
)

urlpatterns = [

    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/UserType/create/', views.UserTypeCreateView.as_view(), name='usertypecreate'),
    path('api/UserType/GetAllUsertype/', views.UserTypeListView.as_view(), name='usertypelist'),
    path('api/UserType/GetSearchUsertype/<int:pk>/', views.UserTypeDetailView.as_view(), name='usertyperetrive'),
    path('api/UserType/updateUsertype/<int:pk>/', views.UserTypeUpdateView.as_view(), name='UserTypeupdate'),
    path('api/UserType/deleteUsertype/<int:pk>/', views.UserTypeDeleteView.as_view(), name='usertypedelete'),

    path('api/Employee/create/', views.EmployeeCreateView.as_view(), name='EmployeeCreate'),
    path('api/Employee/GetAllEmployeeDetails/', views.EmployeeListView.as_view(), name='EmployeeList'),
    path('api/Employee/GetSearchEmployee/<int:pk>/', views.EmployeeDetailView.as_view(), name='EmployeeRetrieve'),
    path('api/Employee/updateEmployee/<int:pk>/', views.EmployeeUpdateView.as_view(), name='EmployeeUpdate'),
    path('api/Employee/deleteEmployee/<int:pk>/', views.EmployeeDeleteView.as_view(), name='EmployeeDelete'),

    path('api/LoginUserList/GetAllLogin/', views.LoginListView.as_view(), name='LoginList'),
    path('api/LoginUserList/GetSearchLogin/<int:pk>/', views.LoginListDetailView.as_view(), name='LoginRetrieve'),

    path('api/RegisterEmployee/Login/', views.RegisterUserLoginAPIView.as_view(), name='Login'),
    path('api/RegisterEmployee/ChangePassword/', views.RegisterUserChangePasswordAPIView.as_view(),
         name='UserChangePassword'),
    path('api/AdminUser/Create/', views.CreateAdminUserAPIView.as_view(), name='CreateAdminUser'),
    path('api/AdminUser/List/', views.ListAdminUserAPIView.as_view(), name='ListAdminUser'),
    path('api/AdminUser/Update/<int:pk>/', views.UpdateAdminUserAPIView.as_view(), name='UpdateAdminUser'),

    path('api/EducationDetails/create/', views.EmployeeEducationDetailCreateView.as_view(),
         name='EmployeeEducationDetailsCreate'),
    path('api/EducationDetails/GetAllEducationDetails/', views.EducationDetailsListView.as_view(),
         name='EmployeeEducationDetailsList'),
    path('api/EducationDetails/GetSearchEducationDetails/<int:pk>/', views.EducationDetailsDetailView.as_view(),
         name='EmployeeEducationDetailsRetrieve'),
    path('api/EducationDetails/UpdateEducationDetails/<int:pk>/', views.EducationDetailsUpdateView.as_view(),
         name='EmployeeEducationDetailsUpdate'),
    path('api/EducationDetails/DeleteEducationDetails/<int:pk>/', views.EducationDetailsDeleteView.as_view(),
         name='EmployeeEducationDetailDelete'),

    path('api/Branch/GetBranch/', views.GetBranchData.as_view(), name='GetBranch'),
    path('api/Batch/GetBatch/', views.GetBatchData.as_view(), name='GetBatch'),

    path('api/Course/GetCourse/', views.GetCourseData.as_view(), name='GetCourse'),

    path('api/Department/GetDepartment/', views.GetDepartmentData.as_view(), name='GetDepartment'),
    path('api/AcademicYear/GetAcademicYear/', views.GetAcademicYearData.as_view(), name='GetAcademicYear'),
    path('api/AcademicYear/GetAcademicYearByOrgBranch/', views.GetAcademicYearByOrgBranch.as_view(),
         name='GetAcademicYearByOrgBranch'),
    path('api/Semester/GetSemester/', views.GetSemesterData.as_view(), name='GetSemester'),
    path('api/Semester/GetSemesterByDepartment/', views.GetSemesterDataByDepartment.as_view(),
         name='GetSemesterByDepartment'),
    path('api/Section/GetSection/', views.GetSectionData.as_view(), name='GetSection'),

    path('api/FeeStructure/GetFeeStructureDetail/', views.GetFeeStructureDetail.as_view(),
         name='GetFeeStructureDetail'),

    path('api/FeeFrequency/GetFeeFrequencyById/', views.GetFeeFrequencyDetail.as_view(), name='GetFeeFrequency'),

    path('api/Organization/create/', views.OrganizationCreateView.as_view(), name='OrganizationAdd'),
    path('api/Organization/GetAllOrganization/', views.OrganizationListView.as_view(), name='OrganizationList'),
    path('api/Organization/updateOrganization/<int:pk>/', views.OrganizationUpdateView.as_view(),
         name='OrganizationUpdate'),
    path('api/Organization/deleteOrganization/<int:pk>/', views.OrganizationDeleteView.as_view(),
         name='OrganizationDelete'),

    path('api/Batch/create/', views.BatchCreateView.as_view(), name='BatchAdd'),
    path('api/Batch/GetAllBatch/', views.BatchListView.as_view(), name='BatchList'),
    path('api/Batch/GetAllBatchByBranch/', views.GetBatchData.as_view(), name='GetAllBatchDetailsByBranch'),
    # path('api/Batch/GetBatchDetailById/', views.GetBatchDetailById.as_view(), name='GetAllBatchDetailsByOrganization'),
    # path('api/OrganizationBranches/updateOrganizationBranches/<int:pk>/',views.BranchesUpdateView.as_view(), name='OrganizationBranchesUpdate'),
    # path('api/OrganizationBranches/deleteOrganizationBranches/<int:pk>/',views.BranchesDeleteView.as_view(), name='OrganizationBranchesdelete'),

    path('api/OrganizationBranch/create/', views.BranchCreateView.as_view(), name='BranchAdd'),
    path('api/OrganizationBranch/GetAllOrganizationBranch/', views.BranchListView.as_view(),
         name='OrganizationBranchList'),
    path('api/OrganizationBranch/GetAllOrganizationBranchByOrganization/',
         views.GetAllBranchDetailsByOrganization.as_view(), name='GetAllOrganizationBranchList'),
    path('api/OrganizationBranch/updateOrganizationBranch/<int:pk>/', views.BranchUpdateView.as_view(),
         name='OrganizationBranchUpdate'),
    path('api/OrganizationBranch/deleteOrganizationBranch/<int:pk>/', views.BranchDeleteView.as_view(),
         name='OrganizationBranchDelete'),

    path('api/AcademicYear/create/', views.AcademicSessionYearCreateView.as_view(), name='AcademicCreate'),
    path('api/AcademicYear/GetAllAcademicYear/', views.AcademicSessionYearListView.as_view(),
         name='AcademicSessionYearList'),
    path('api/AcademicYear/GetAllAcademicYearByFilter/', views.GetAllAcademicSessionYearDetailByFilterView.as_view(),
         name='GetAllAcademicSessionYearDetailByFilterView'),
    path('api/AcademicYear/GetSearchAcademicYear/<int:pk>/', views.AcademicSessionYearDetailView.as_view(),
         name='AcademicYearRetrieve'),
    path('api/AcademicYear/updateAcademicYear/<int:pk>/', views.AcademicSessionYearUpdateView.as_view(),
         name='AcademicYearUpdate'),
    path('api/AcademicYear/deleteAcademicYear/<int:pk>/', views.AcademicSessionYearDeleteView.as_view(),
         name='AcademicYearDelete'),

    path('api/Course/create/', views.CourseCreateView.as_view(), name='CourseCreate'),
    path('api/Course/GetAllCourse/', views.CourseListView.as_view(), name='CourseList'),
    path('api/Course/GetSearchCourse/<int:pk>/', views.CourseDetailView.as_view(), name='CourseRetrieve'),
    path('api/Course/GetAllCourseByFilter/', views.GetAllCourseDetailsByFilter.as_view(),
         name='GetAllCourseDetailsByFilter'),
    path('api/Course/UpdateCourse/<int:pk>/', views.CourseUpdateView.as_view(), name='CourseUpdate'),
    path('api/Course/DeleteCourse/<int:pk>/', views.CourseDeleteView.as_view(), name='CourseDelete'),
    path('api/Course/GetAllCourseByBatch/', views.GetAllCourseDetailsByBatch.as_view(),
         name='GetAllCourseDetailsByBatch'),

    path('api/Department/create/', views.DepartmentCreateView.as_view(), name='DepartmentCreate'),
    path('api/Department/GetAllDepartment/', views.DepartmentListView.as_view(), name='DepartmentList'),
    path('api/Department/GetSearchDepartment/<int:pk>/', views.DepartmentDetailView.as_view(),
         name='DepartmentRetrieve'),
    path('api/Department/UpdateDepartment/<int:pk>/', views.DepartmentUpdateView.as_view(), name='DepartmentUpdate'),
    path('api/Department/DeleteDepartment/<int:pk>/', views.DepartmentDeleteView.as_view(), name='DepartmentDelete'),
    path('api/Department/GetDepartmentListByFilter/', views.GetAllDepartmentDetailsByFilters.as_view(),
         name='GetAllDepartmentDetailsByFilters'),
    path('api/Department/GetDepartmentListByCourse/', views.GetAllDepartmentDetailsByCourse.as_view(),
         name='GetAllDepartmentDetailsByCourse'),

    path('api/Semester/create/', views.SemesterCreateView.as_view(), name='SemesterCreate'),
    path('api/Semester/GetAllSemester/', views.SemesterListView.as_view(), name='SemesterList'),
    path('api/Semester/GetSearchSemester/<int:pk>/', views.SemesterDetailView.as_view(), name='SemesterRetrieve'),
    path('api/Semester/UpdateSemester/<int:pk>/', views.SemesterUpdateView.as_view(), name='SemesterUpdate'),
    path('api/Semester/DeleteSemester/<int:pk>/', views.SemesterDeleteView.as_view(), name='SemesterDelete'),
    path('api/Semester/GetSemesterListByFilter/', views.SemesterDetailByFilters.as_view(),
         name='SemesterDetailByFilter'),

    path('api/Section/create/', views.SectionCreateView.as_view(), name='sectioncreate'),
    path('api/Section/GetAllSection/', views.SectionListView.as_view(), name='sectionlist'),
    path('api/Section/GetAllSectionByFilter/', views.GetAllSectionByFilterListView.as_view(),
         name='sectionlistbyfilter'),
    path('api/Section/GetSearchSection/<int:pk>/', views.SectionDetailView.as_view(), name='sectionretrive'),
    path('api/Section/updateSection/<int:pk>/', views.SectionUpdateView.as_view(), name='sectionupdate'),
    path('api/Section/deleteSection/<int:pk>/', views.SectionDeleteView.as_view(), name='sectiondelete'),

    path('api/CourseSemesterSectionBind/create/', views.CourseSemesterSectionBindCreateView.as_view(),
         name='ClassSectionBindcreate'),
    path('api/CourseSemesterSectionBind/GetAllCourseSemesterSectionBind/',
         views.CourseSemesterSectionBindListView.as_view(), name='ClassSectionBindlist'),
    path('api/CourseSemesterSectionBind/GetSearchCourseSemesterSectionBind/<int:pk>/',
         views.CourseSemesterSectionBindDetailView.as_view(), name='ClassSectionBindretrive'),
    path('api/CourseSemesterSectionBind/updateCourseSemesterSectionBind/<int:pk>/',
         views.CourseSemesterSectionBindUpdateView.as_view(), name='ClassSectionBindupdate'),
    path('api/CourseSemesterSectionBind/deleteCourseSemesterSectionBind/<int:pk>/',
         views.CourseSemesterSectionBindDeleteView.as_view(), name='ClassSectionBinddelete'),
    path('api/CourseSemesterSectionBind/GetAllCourseSemesterSectionBind/<int:pk>/',
         views.GetAllSectionBindWithCourseSemester.as_view(), name='GetsectionlistByClass'),

    # path('api/StudentRegistration/create/', views.StudentRegistrationCreateView.as_view(), name='studentregistration'),
    # path('api/StudentRegistration/GetAllStudentRegistration/', views.StudentRegistrationListView.as_view(),name='registrationlist'),
    # path('api/StudentRegistration/GetSearchStudentRegistration/<int:pk>/', views.StudentRegistrationDetailView.as_view(),name='registrationretrive'),
    # path('api/StudentRegistration/updateStudentRegistration/<int:pk>/', views.StudentRegistrationUpdateView.as_view(),name='registrationupdate'),
    # path('api/StudentRegistration/deleteStudentRegistration/<int:pk>/', views.StudentRegistrationDeleteView.as_view(), name='registrationdelete'),

    path('api/SiblingDetail/create/', views.SiblingDetailCreateView.as_view(), name='sibilingsAdd'),
    path('api/SiblingDetail/GetAllList/', views.SiblingDetailListAPIView.as_view(), name='siblinglist'),
    path('api/SiblingDetail/GetAllSiblingsByStudent/<int:student_id>/', views.GetAllSibilingsByStudent.as_view(),
         name='GetAllsiblinglist'),
    path('api/SiblingDetail/updateSiblingDetails/<int:pk>/', views.SiblingDetailUpdateView.as_view(),
         name='Siblingupdate'),
    path('api/SiblingDetail/deleteSiblingDetails/<int:pk>/', views.SiblingDetailDeleteView.as_view(),
         name='Siblingdelete'),

    path('api/EmergencyDetails/create/', views.StudentEmergencyContactCreateView.as_view(), name='EmergencyDetailsAdd'),
    path('api/EmergencyDetails/GetAllList/', views.StudentEmergencyContactListAPIView.as_view(),
         name='StudentEmergencyDetailslist'),
    path('api/EmergencyDetails/GetAllEmergencyContactByStudent/<int:student_id>/',
         views.GetAllEmergencyContactDetailsByStudent.as_view(), name='GetAllEmergencyContactByStudentlist'),
    path('api/EmergencyDetails/UpdateEmergencyContact/<int:pk>/', views.EmergencyContactUpdateView.as_view(),
         name='EmergencyContactupdate'),
    path('api/EmergencyDetails/DeleteEmergencyContact/<int:pk>/', views.EmergencyContactDeleteView.as_view(),
         name='EmergencyContactdelete'),

    path('api/Authorised_Pickup/create/', views.AuthorisedPickupCreateView.as_view(), name='Authorised_PickupAdd'),
    path('api/Authorised_Pickup/GetAllAuthorised_PickupByStudent/<int:student_id>/',
         views.GetAllAuthorisedPickupDetailsByStudent.as_view(), name='GetAllAuthorised_PickupStudentlist'),
    path('api/Authorised_Pickup/updateAuthorisedPickup/<int:pk>/', views.AuthorisedPickupUpdateView.as_view(),
         name='AuthorisedPickupupdate'),
    path('api/Authorised_Pickup/deleteAuthorisedPickup/<int:pk>/', views.AuthorisedPickupDeleteView.as_view(),
         name='AuthorisedPickupdelete'),

    path('api/Student_Document/create/', views.StudentDocumentCreateView.as_view(), name='Student_DocumentAdd'),
    path('api/Student_Document/GetAllStudent_DocumentByStudent/<int:student_id>/',
         views.GetAllStudentDocumentDetailsByStudent.as_view(), name='GetAllStudent_Documentlist'),
    path('api/Student_Document/UpdateStudent_Document/<int:pk>/', views.StudentDocumentUpdateView.as_view(),
         name='Student_DocumentUpdate'),
    path('api/Student_Document/DeleteStudent_Document/<int:pk>/', views.StudentDocumentDeleteView.as_view(),
         name='Student_Documentdelete'),

    path('api/Student_Previous_Education/create/', views.StudentPreviousEducationCreateView.as_view(),
         name='Previous_EducationAdd'),
    path('api/Student_Previous_Education/GetAllPrevious_EducationByStudent/<int:student_id>/',
         views.GetAllStudentPreviousEducationDetailsByStudent.as_view(), name='GetAllPrevious_Educationlist'),
    path('api/Student_Previous_Education/UpdatePrevious_Education/<int:pk>/',
         views.StudentPreviousEducationUpdateView.as_view(), name='Prevoius_EducationUpdate'),
    path('api/Student_Previous_Education/DeletePrevious_Education/<int:pk>/',
         views.StudentPreviousEducationDeleteView.as_view(), name='Prevoius_Educationdelete'),

    # path('api/StudentRegistration/create/', views.STUDENTREGISTRATIONCreateView.as_view(), name='studentAdd'),
    # path('api/StudentRegistration/GetAllStudentRegistration/', views.STUDENTREGISTRATIONListAPIVIew.as_view(),name='registerstudentlist'),
    # path('api/StudentRegistration/updateStudentRegistration/<int:pk>/', views.STUDENTREGISTRATIONUpdateAPIView.as_view(),name='STUDENTREGISTRATIONUpdate'),
    # path('api/StudentRegistration/deleteStudentRegistration/<int:pk>/',views.STUDENTRAGISTRATIONDeleteAPIVIEW.as_view(), name='STUDENTREGISTRATIONdelete'),

    path('api/StudentCourse/GetAllStudentClassList/', views.StudentCourseListAPIView.as_view(),
         name='studentclasslist'),
    # path('api/StudentCourse/updateStudentClass/<int:pk>/', views.StudentCourseUpdateAPIView.as_view(),name='StudentCourseUpdate'),

    path('api/FeeStructure/create/', views.FeeStructureMasterCreateAPIView.as_view(), name='feestructureAdd'),
    path('api/FeeStructureDetails/create/', views.FeeStructureDetailsCreateAPIView.as_view(),
         name='feestructuredetailsAdd'),

    path('api/FeeStructureDetails/GetAllfeeStructure_Details/', views.FeeStructureDetailsListAPIView.as_view(),
         name='fee_Structure_Details_Get'),
    path('api/FeeStructureDetails/updatefeeStructure_Details/<int:pk>/',
         views.FeeStructureDetailsUpdateAPIView.as_view(), name='feestuructuedetailsUpdate'),
    path('api/FeeStructureDetails/deleteStructure_Details/<int:pk>/', views.FeeStructureDetailsDeleteAPIVIEW.as_view(),
         name='feestuructuedetailsdelete'),

    path('api/Period/create/', views.PeriodCreateAPIView.as_view(), name='periodsAdd'),
    path('api/Period/GetAllPeriod/', views.PeriodListAPIView.as_view(), name='periodlist'),
    path('api/Period/updatePeriod/<int:pk>/', views.PeriodUpdateAPIView.as_view(), name='periodUpdate'),
    path('api/Period/deletePeriod/<int:pk>/', views.PeriodDestroyAPIView.as_view(), name='periodsdelete'),

    path('api/StudentAddress/create/', views.StudentAddressCreateAPIView.as_view(), name='addressAdd'),

    path('api/StudentAddress/GetStudentAddress/<int:pk>/', views.StudentAddressListAPIView.as_view(),
         name='studentaddresslist'),

    path('api/StudentAddress/UpdateStudentAddress/<int:pk>/', views.StudentAddressUpdateAPIView.as_view(),
         name='studentaddressUpdate'),

    path('api/StudentAddress/DeleteStudentAddress/<int:pk>/', views.StudentAddressDestroyAPIView.as_view(),
         name='studentaddressdelete'),

    path('api/StudentDetails/GetStudentDetails/<int:academic_id>/<int:student_id>',
         views.StudentDetailsGetListAPIView.as_view(), name='studentdetailsGet'),
    path('api/StudentDetails/GetStudentFullDetails/', views.StudentFullDetailsAPIView.as_view(),
         name='student-full-details'),
    path('api/StudentFeeDetail/GetStudentFeeDetail/<int:academic_id>/<int:student_id>',
         views.StudentFeeDetailGetListAPIView.as_view(), name='studentfeedetailsGet'),
    path('api/FeeElementType/GetAllFeeElements/<str:elementType>', views.FeeElementTypeListAPIView.as_view(),
         name='fee_element_typelist'),

    path('api/Filter/GetStudentBasedCourseSection/', views.GetStudentBasedOnCourseSection.as_view(),
         name='students-by-course-section'),
    # path('api/Filter/GetstudentBasedClassSection/<str:classlist>/<str:sectionlist>/',views.StudentGetBasedOnClassSection.as_view(), name='students-by-class-section'), #pass class id & section id in comaseparate value like /api/students/class/[1,2,3]/section/[a,b,c]/

    path('api/Filter/GetFeeDetailsBasedOnFeeStructureAcademicSession/<int:academic_id>/<int:fee_structure>',
         views.GetFeeElementBasedOnFeeStructureAcademicSession.as_view(),
         name='GetFilterdatabasedonacademic&feestructure'),

    path('api/ADHOC/StudentFeesCreate/', views.ADHOCFessInsertInStudentFeeStructureDetailsCreateAPIView.as_view(),
         name='StudentADHOCfeesAdd'),

    path('api/CollegeHouse/GetAllHouse/', views.HouseListAPIView.as_view(), name='findhouselist'),

    path('api/RELIGION/GetAllReligion/', views.ReligionListAPIView.as_view(), name='findreligionlist'),

    path('api/CATEGORY/GetAllCategory/', views.CategoryListAPIView.as_view(), name='findcategorylist'),

    path('api/NATIONALITY/GetAllNationality/', views.NationalityListAPIView.as_view(), name='findnationalitylist'),

    path('api/COUNTRY/GetAllCountry/', views.CountryListAPIView.as_view(), name='findcountrylist'),

    path('api/STATE/GetAllState/', views.StateListAPIView.as_view(), name='findstatelist'),

    path('api/CITY/GetAllCity/', views.CityListAPIView.as_view(), name='findcitylist'),

    path('api/CITY/GetCityDetails/<int:pk>', views.GetSTATECOUNTRYBASEDCITYDetailView.as_view(),
         name='GetIndividualCityRecord'),

    path('api/PROFESSION/GetAllProfession/', views.ProfessionListAPIView.as_view(), name='findprofessionlist'),

    path('api/DOCUMENT/GetAllDocumentList/', views.DocumentListAPIView.as_view(), name='finddocumentlist'),

    # path('api/FeeStructure/GetAllFeeStructureBasedOnClass/<int:class_id>/<int:academic_year_id>/<int:org_id>/<int:branch_id>/', views.GetFilteredFeeStructureListAPIView.as_view(), name='findfeestructuretlist'),

    path('api/FeeStructure/GetAllFeeStructureBasedOnCourse/', views.GetFilteredFeeStructureListAPIView.as_view(),
         name='findfeestructuretlist'),

    path('api/LANGUAGE/GetAllLanguageList/', views.LanguageListAPIView.as_view(), name='findlanguagelist'),

    path('api/MOTHERTONGUE/GetAllMotherTongueList/', views.MotherTongueListAPIView.as_view(), name='find mothertong uelist'),

    path('api/BLOODGROUP/GetAllBloodGroupList/', views.BloodGroupListAPIView.as_view(), name='findbloodlist'),

    path('api/Gender/GetAllGenderList/', views.GenderListAPIView.as_view(), name='genderlist'),

    path('api/FeeStructure/FeeStructureCreate/', views.FeeStructureDetailCreateAPI.as_view(),
         name='feestructureDetailsAdd'),

    path('api/StudentRegistration/create', views.StudentRegistrationCreate.as_view(),
         name='Student-Registration-create'),
    path('api/StudentRegistrationApi/GetAllSTUDENTList/', views.StudentRegistrationListAPIView.as_view(),
         name='StudentRegistrationList'),
    path('api/StudentRegistrationApi/UpdateStudentRecord/', views.StudentRegistrationUpdateAPIView.as_view(),
         name='studentRegistrationUpdate'),
    path('api/StudentRegistrationApi/GetStudentDetailsBasedOnId/', views.StudentRegistrationBasedOnIdAPIView.as_view(),
         name='StudentGetBasedOnId'),

    path('api/Filter/GetFilterSTUDENTList/', views.StudentFilterListAPIView.as_view(), name='studentGetlist'),
    path('api/Filter/GetStudentListBasedOnClassAndSectionGroup/',
         views.GetStudentListBasedOnGroupCourseSubject.as_view(), name='studentListBasedOnGroup'),

    path('api/Filter/GetStudentListBasedOnClub/', views.GetStudentListBasedOnClub.as_view(),
         name='studentListBasedOnGroup'),

    path('api/StudentCourse/StudentCourseRecordFilter/', views.SearchStudentCourseListAPIView.as_view(),
         name='Student-Course-Record-Filter'),

    path('api/StudentCourse/UpdateStudentCourse/', views.StudentCourseUpdateAPIView.as_view(),
         name='StudentCourseRecordUpdate'),
    path('api/StudentCourseApi/GetAllSTUDENTList/<int:academic_year_id>/', views.StudentCourseListAPIView.as_view(),
         name='studentClassList'),
    path('api/StudentCourse/GetStudentDataBasedId/', views.StudentCourseRetriveAPIView.as_view(),
         name='GetStudentDataBasedOnId'),
    path('api/StudentCourse/StudentCourseConfirmRECORDFilter/', views.StudentConfirmFilterListAPIView.as_view(),
         name='Student-Course-Confirm-Record-Filter'),
    path('api/StudentCourse/GetPreviousYearFees/', views.GetPreviousYearRemainingAmount.as_view(),
         name='previousyearamount'),

    path('api/StudentPromotion/StudentCourseSemesterPromotion/', views.StudentPromotionCreateAPI.as_view(),
         name='StudentPromotion'),

    path('api/FeeStructure/GetFeeStructureListByFilter/', views.GetFeeStructureMasterAndDetailsListAPIView.as_view(),
         name='feestructureDetailsList'),
    path('api/FeeStructure/GetFeeStructureBasedOnAcademicYear/<int:academic_year_id>/',
         views.GetFeeStructureMasterBasedOnAcademicYear.as_view(), name='findfeestructuretlistBasedOnAcademic'),
    # path('api/Filter/GetFilterSTUDENTList/<int:student_id>/<int:school_admission_no>/<str:barcodeno>', views.StudentFilterListAPIView.as_view(), name='studentGetlist'),

    path('api/FeeStructureDetails/GetFeeStructureBasedOnStudent/', views.GetStudentFeeDetailListAPIView.as_view(),
         name='studentGetlist'),

    path('api/StudentFeeDetails/StudentFeesManagement/', views.StudentFeeManagementAPIView.as_view(),
         name='StudentFeesManagement'),

    path('api/AcademicYear/GetPreviousAcademicYear/<int:academic_year_id>/<int:org_id>/<int:branch_id>',
         views.GetPreviousAcademicYearBasedOnCurrentAcademicYearListAPIView.as_view(),
         name='previousacademicsessionyearlist'),

    path('api/FeeFrequency/GetAllFrequencyPeriodList/', views.FrequencyPeriodListAPIView.as_view(),
         name='FrequencyPeriodlist'),
    path('api/FeeStructureCopy/CopyFeeStructure/', views.CopyFeeStructureToDifferentCourse.as_view(),
         name='StudentFeesManagement'),
    path('api/FeeStructure/GetFeeDetailsBasedOnFeeStructure/<int:fee_structure_master_id>',
         views.GetFeeDetailsBasedOnFeeMasterListAPIView.as_view(), name='feestructuremasterfeestructureDetailsGet'),

    path('api/Subjects/GetSubjectListBasedOnCourseAndSemester/', views.CourseSubjectsFilterAPIView.as_view(),
         name='class-subjects-filter'),

    path('api/Subjects/GetSubjectListBasedOnCourseDepartment/', views.GetSubjectsFilterByDepartmentAPIView.as_view(),
         name='get-subjects-by-department'),
    path('api/Subjects/GetSubjectListBasedOnLecture/', views.GetSubjectsBasedonLectureAPIView.as_view(),
         name='class-subjects-filter'),

    # path('api/SUBJECTS/GetSubjectListBasedOnClassAndSection/<int:org_id>/<int:branch_id>/<int:academic_year_id>/<int:subject_group_id>/<int:class_id>/<int:section_id>/', views.SCHClassSubjectsFilterAPIView.as_view(), name='class-subjects-filter'),

    # path('api/Filter/GetStudentListBasedOnClassAndSectionGroup/<int:org_id>/<int:branch_id>/<int:academic_year_id>/<int:class_id>/<int:section_id>/<int:subject_master_id>/<int:student_id>',views.SCHGetStudentListBasedOnGroupClassSubject.as_view(), name='studentListBasedOnGroup'),

    # path('api/SUBJECTS/updatestudentclub/<int:student_id>', views.SCHStudentClubUpdateAPIView.as_view(),name='studentclubUpdate'),

    path('api/Club/GetClubGroupList/', views.ClubGroupFilterAPIView.as_view(), name='club-list'),
    path('api/Club/GetClubGroupListById/', views.ClubGroupFilterAPIView.as_view(), name='club-list-by-id'),

    path('api/Club/GetClubList/', views.ClubFilterAPIView.as_view(), name='club-list'),
    path('api/Club/GetClubListById/', views.ClubFilterAPIView.as_view(), name='club-list-by-id'),
    path('api/Club/UpdateOrCreateStudentClub/', views.StudentClubUpdateorCreateAPIView.as_view(),
         name='studentclubUpdate'),

    path('api/Filter/GetFilterStudentFilterdataBasedOnCondition/',
         views.StudentSearchBasedOnIdBarcodeCollegeAdmissionNo.as_view(), name='studentfilterdata'),

    path('api/PaymentMethod/GetAllPaymentMethodList/', views.PaymentMethodListAPIView.as_view(),
         name='paymentmethodlist'),

    # path('api/SubjectGroups/GetAllSubjectGroupsList/<int:org_id>/<int:branch_id>/', views.SubjectGroupListAPIView.as_view(), name='subjectgrouplist'),

    path('api/FeeReceipt/FeeReceiptCreate/', views.StudentFeeReceiptCreateAPIView.as_view(), name='feereciptscreate'),

    path('api/FeeReceipt/GetFilterFeeReceipts/', views.StudentFeeReceiptSearchBasedOnCondition.as_view(),
         name='filterfeereceipts'),

    path('api/FeeReceipt/GetFeeReceiptsBasedOnReceiptNo/', views.GetFeeReceiptBasedOnReceiptNo.as_view(),
         name='studentlist'),

    path('api/MessageType/GetAllMessageTypeList/', views.GetMessageTypeListAPIView.as_view(), name='Message_Type_List'),

    path('api/MessageInitiated/GetAllMessageInitiatedList/', views.MessageInitiatedListAPIView.as_view(),
         name='Message_InitiatedList'),

    path('api/MessageSend/StudentMessageCreate/', views.StudentMessageSaveCreateAPIView.as_view(),
         name='studentmessagecreate'),

    path('api/MessageSend/StudentMessageHistoryFilter/', views.StudentMessageHistoryFilterListAPIView.as_view(),
         name='StudentMessageHistoryFilter'),

    path('api/FeeReceipt/FeeReceiptsCancelCreate/', views.StudentFeeReceiptCancelCreateAPIView.as_view(),
         name='feereceiptscancel'),

    path('api/Professor/GetProfessorListBasedOnDay/<int:academic_year_id>/<str:date>',
         views.GetListOfProfessorListAPIView.as_view(), name='Teacher_list_byDay'),

    path('api/Professor/GetCourseListBasedOnDay/<int:academic_year_id>/<str:date>/<int:professorId>',
         views.GetListOfCourseBasedOnProfessorOndate.as_view(), name='ClassList_byDay'),

    path(
        'api/Professor/GetSubjectListBasedOnDay/<int:academic_year_id>/<str:date>/<int:professorId>/<int:courseId>/<int:sectionId>',
        views.GetListOfSubjectBasedOnProfessorOndate.as_view(), name='subjectListByTeacher'),

    path(
        'api/Professor/GetPeriodListBasedOnSubject/<int:academic_year_id>/<str:date>/<int:professorId>/<int:courseId>/<int:sectionId>/<int:subjectId>',
        views.GetListOfCourseLectureBasedOnProfessorOndate.as_view(), name='periodListByTeacher'),

    path('api/Professor/GetProfessorListBasedOnSubject/', views.GetProfessorBasedOnSubject.as_view(),
         name='periodListByTeacher'),

    path('api/Assignment/GetAllAssignmentList/', views.GetListOfAssignmentListAPIView.as_view(), name='Assignmentlist'),

    path('api/Assignment/CreateAllAssignment/', views.AssignmentCreateAPIView.as_view(), name='assignmentcreate'),

    path('api/Assignment/UpdateAssignment/', views.AssignmentUpdateAPIView.as_view(), name='AssignmentUpdate'),

    path('api/Assignment/DeleteAssignment/', views.AssignmentDeleteAPIView.as_view(), name='Assignmentdelete'),

    path('api/Assignment/GetAssignmentBasedId/', views.GetAssignmentBasedOnId.as_view(), name='AssignmentBasedOnId'),

    path('api/CircularMessage/CreateCircularMessage/', views.StudentCircularCreateAPIView.as_view(),
         name='circularmessagecreate'),
    path('api/CircularMessage/GetAllCircularMessageList/', views.StudentCircularListAPIView.as_view(),
         name='circularmessagelist'),
    path('api/CircularMessage/UpdateCircularMessage/', views.StudentCircularUpdateAPIView.as_view(),
         name='CircularMessageUpdate'),
    path('api/CircularMessage/DeleteCircularMessage/', views.StudentCircularDeleteAPIView.as_view(),
         name='circularmessagedelete'),
    path('api/CircularMessage/CancelCircularMessage/', views.StudentCircularCancelAPIView.as_view(),
         name='circularmessagecancel'),

    path('api/CircularMessage/CircularMessageFilter/', views.CircularMessageFilterAPIView.as_view(),
         name='CIRCULARMESSAGEFilter'),

    path('api/CircularMessage/GetCircularMessageBasedId/', views.CircularMessageRetriveAPIView.as_view(),
         name='CircularMessageBasedOnId'),

    path('api/Period/GetAllUnpaidPeriodsList/<int:orgId>/<int:branchId>/<int:academic_year_id>/<int:studentId>/',
         views.GetUnpaidPeriodListAPIView.as_view(), name='circularmessagelist'),

    path('api/FeeReceipt/GetFeeReceiptBasedOnReceiptId/', views.GetReceiptDetailsListAPIView.as_view(),
         name='GetFeeDetailsBasedOnId'),

    path('api/FeeReceipt/UpdatePaymentDetailBasedOnReceipt/', views.UpdateStudentFeeRecordBasedOnReceiptId.as_view(),
         name='FEESDETAILSUpdate'),

    path('api/BANK/GetAllBankList/', views.GetAllBANKListAPIView.as_view(), name='banklist'),

    path('api/AccountDetails/GetAccountDetailsBasedOnBankId/', views.GetAccountDetailsListAPIView.as_view(),
         name='AccountDetailsList'),

    path('api/FeeLedger/GetFeeLedgerBasedOnCondition/', views.StudentFeeLedgerFilterListAPIView.as_view(),
         name='GetStudentFeeLedger'),
    path('api/FeeLedger/GetStudentFeesDetailsPDFBasedOnStudentId/',
         views.GetStudentFeesDetailsPDFBasedOnStudentId.as_view(), name='StudentFeeDetails'),
    path('api/FeeLedger/GetStudentFeeDueReceiptStudentId/', views.GetStudentFeeDueReceiptListAPIView.as_view(),
         name='StudentFeeDueReceiptDetails'),
    path('api/FeeLedger/GetStudentFeeBalanceReceiptStudentId/', views.GetStudentFeeBalanceReceiptListAPIView.as_view(),
         name='StudentFeeBalanceReceiptDetails'),
    path('api/FeeLedger/GetStudentSemesterWiseReceiptStudentId/',
         views.GetStudentFeeDetailSemesterWiseListAPIView.as_view(), name='StudentMonthReceiptDetails'),
    path('api/FeeLedger/GetStudentPaymentMethodWiseReceiptStudentId/',
         views.GetStudentPaymentMethodWiseFeeListAPIView.as_view(), name='StudentPaymentMethodWiseReceiptDetails'),
    path('api/FeeLedger/GetStudentSemesterElementWiseReceiptStudentId/',
         views.GetStudentperiodwiseFeeListAPIView.as_view(), name='StudentMonthlyElementWiseReceiptDetails'),

    path('api/StudentCertificate/create/', views.StudentCertificateCreateAPIView.as_view(),name='student-certificate-create'),
    path('api/StudentCertificate/list/', views.StudentCertificateList.as_view(),name='student-certificate-list'),
    path('api/StudentCertificate/update/', views.StudentCertificateUpdateView.as_view(),name='student-certificate-update'),
    path('api/StudentCertificate/pdf/', views.StudentCertificatePDFGenerateAPIView.as_view(),name='student-certificate-pdf'),
    # path('api/StudentCertificate/create/', views.StudentCertificateCreateAPIView.as_view(),
    #      name='StudentTransferCertificateCreate'),
    # path('api/StudentCertificate/update/', views.StudentCertificateUpdateView.as_view(),
    #      name='StudentTransferCertificateUpdate'),

    # path('api/StudentCharacterCertificate/create/', views.StudentCharacterCertificateCreateAPIView.as_view(), name='StudentCharacterCertificateCreate'),
    # path('api/StudentCharacterCertificate/update/', views.StudentCharacterCertificateUpdateView.as_view(), name='StudentCharacterCertificateUpdate'),

    # path('api/StudentBonafideCertificate/create/', views.StudentBonafideCertificateCreateAPIView.as_view(), name='StudentBonafideCertificateCreate'),
    # path('api/StudentBonafideCertificate/update/', views.StudentBonafideCertificateUpdateView.as_view(), name='StudentBonafideCertificateUpdate'),

    # path('api/StudentFeeCertificate/create/', views.StudentFeeCertificateCreateAPIView.as_view(), name='StudentFeeCertificateCreate'),
    # path('api/StudentFeeCertificate/update/', views.StudentFeeCertificateUpdateView.as_view(), name='StudentFeeCertificateUpdate'),

    # path('api/GetAllCertificates/', views.GetTransferCertificateAPIView.as_view(), name='GetStudentCertificateList'),
    # path('api/StudentCertificate/GetStudentCertificates/', views.CertificateDetailsListAPIView.as_view(),
    #      name='GetStudentCertificates'),
    path('api/StudentCertificate/GetDetailsBasedOnDocumentTypeStudentId/',
         views.GetStudentCertificateDetailBasedOnDocumentTypeStudentId.as_view(),
         name='Get-Student-Certificate-Detail'),
    # path('api/StudentCertificate/GetCertificatePDF/', views.StudentCertificatePDFGenerateListAPIView.as_view(),
    #      name='GetCertificatePDF'),

    path('api/StudentAttendance/GetSearchAttendanceByDateCourseDepartmentSemesterPeriod/',
         views.StudentAttendanceSearchListAPIView.as_view(), name='GetSearchAttendanceDetails'),
    path('api/StudentAttendance/CreateOrUpdateAttendance/', views.StudentAttendanceCreate_UpdateAPI.as_view(),
         name='Attendance_create_or_update'),

    path('api/Filter/GetSubjectProfessorBasedOnLecture/', views.GetSubjectProfessorListAPIView.as_view(),
         name='GetSubjectProfessorList'),
    path('api/Lecture/GetLectureList/', views.GetLectureListAPIView.as_view(), name='GetLectureList'),
    path('api/Lecture/GetLectureListByTimeTable/', views.GetLectureListByTimeTableAPIView.as_view(),
         name='GetLectureList'),
    path('api/Lecture/GetLecture/', views.GetLectureAPIView.as_view(), name='GetLectureById'),

    path('api/Professor/GetEmployeeList/', views.GetSearchProfessorBasedOnConditionListAPIView.as_view(),
         name='GetSearchEmployee'),

    path('api/State/GetStateListBasedOnCountryId/<int:country_id>', views.GetStateBasedOnCountryListAPIView.as_view(),
         name='GetAllStateListBasedOnCountry'),
    path('api/City/GetCityListBasedOnStateId/<int:state_id>', views.GetCityBasedOnStateListAPIView.as_view(),
         name='GetAllCityListBasedOnState'),

    path('api/TERM/GetTermList/', views.TermListAPIView.as_view(), name='GetAllTermList'),

    path('api/Staff/EmployeeTypeList/', views.EmployeeTypeListAPIView.as_view(), name='EmployeeTypelist'),
    path('api/Student/GetStudentList/', views.StudentsListAPIView.as_view(), name='StudentsListAPIView'),
    path('api/Teacher/GetEmployeeList/', views.GetTeacherListAPIView.as_view(), name='TeacherEmployeeList'),

    path('api/ForgotPassword/send-otp/', views.SendOTPView.as_view(), name='ForgotPasswordSendOtp'),
    path('api/ForgotPassword/verify-otp/', views.VerifyOTPView.as_view(), name='ForgotPasswordVerifyOtp'),

]