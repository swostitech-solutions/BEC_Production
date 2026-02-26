from django.contrib import admin

from Acadix.models import Department, Organization, AcademicYear, Course, Batch, Semester, Section, UserLogin, \
    StudentRegistration, StudentCourse, FeeStructureMaster, FeeStructureDetail, Period, Gender, House, MotherTongue, \
    Category, Blood, Religion, City, State, Country, Nationality, FeeElementType, FeeFrequency, StudentFeeDetail, \
    SiblingDetail, StudentEmergencyContact, AuthorisedPickup, StudentDocument, StudentPreviousEducation, Parent, \
    UserType, ExceptionTrack, Employee, CourseSemesterSectionBind, Address, \
     CourseDepartmentSubject, EmployeeType, Designation, EmployeeMaster, TimeTable, \
    Attendance, EmployeeDetail, Profession, Document, Language, ClubGroup, Club, \
    StudentClub, PaymentMethod, StudentFeeReceiptHeader, StudentFeeReceiptDetail, StudentPayment, MessageType, \
    MessageInitiated, \
    StudentMessagesHistory, StudentAssignment, StudentCircular, Bank, BankAccountDetail, Branch, \
    Login, LecturePeriod, StudentTransferCertificate, StudentFeeCertificate, StudentCharacterCertificate, \
    StudentBonafideCertificate

# Register your models here.

admin.site.register(UserLogin)
admin.site.register(UserType)
admin.site.register(ExceptionTrack)

admin.site.register(Login)


admin.site.register(Organization)
admin.site.register(Branch)
admin.site.register(Batch)
admin.site.register(Course)
admin.site.register(Department)
admin.site.register(AcademicYear)
admin.site.register(Semester)
admin.site.register(Section)
admin.site.register(Period)

admin.site.register(Gender)
admin.site.register(House)
admin.site.register(MotherTongue)
admin.site.register(Category)
admin.site.register(Blood)
admin.site.register(Religion)
admin.site.register(City)
admin.site.register(State)
admin.site.register(Country)
admin.site.register(Nationality)
admin.site.register(AuthorisedPickup)
admin.site.register(Parent)

admin.site.register(StudentRegistration)
admin.site.register(StudentCourse)
admin.site.register(StudentFeeDetail)
admin.site.register(SiblingDetail)
admin.site.register(StudentEmergencyContact)
admin.site.register(StudentDocument)
admin.site.register(StudentPreviousEducation)

admin.site.register(FeeStructureMaster)
admin.site.register(FeeStructureDetail)
admin.site.register(FeeElementType)
admin.site.register(FeeFrequency)

admin.site.register(Employee)

admin.site.register(CourseSemesterSectionBind)
admin.site.register(CourseDepartmentSubject)
admin.site.register(LecturePeriod)

admin.site.register(Attendance)
admin.site.register(Address)

admin.site.register(Profession)

admin.site.register(EmployeeType)
admin.site.register(Designation)
admin.site.register(EmployeeMaster)
admin.site.register(TimeTable)
admin.site.register(EmployeeDetail)

admin.site.register(Document)
admin.site.register(Language)

admin.site.register(ClubGroup)
admin.site.register(Club)
# admin.site.register(CourseClub)
admin.site.register(StudentClub)

admin.site.register(PaymentMethod)
admin.site.register(StudentFeeReceiptHeader)
admin.site.register(StudentFeeReceiptDetail)
admin.site.register(StudentPayment)

admin.site.register(MessageType)
admin.site.register(MessageInitiated)
admin.site.register(StudentMessagesHistory)
admin.site.register(StudentAssignment)

admin.site.register(StudentCircular)
admin.site.register(Bank)
admin.site.register(BankAccountDetail)
# admin.site.register(StudentCertificate)
admin.site.register(StudentTransferCertificate)
admin.site.register(StudentFeeCertificate)
admin.site.register(StudentCharacterCertificate)
admin.site.register(StudentBonafideCertificate)





