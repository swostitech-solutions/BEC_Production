from django.contrib import admin

from STAFF.models import EmployeeAssignment, EmployeeCourse, EmployeeExperience,EmployeeFamilyDetail, EmployeeLanguage, EmployeeQualification, EmployeeDocument

admin.site.register(EmployeeAssignment)
admin.site.register(EmployeeCourse)
admin.site.register(EmployeeExperience)

admin.site.register(EmployeeFamilyDetail)
admin.site.register(EmployeeLanguage)
admin.site.register(EmployeeQualification)


admin.site.register(EmployeeDocument)



