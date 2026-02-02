from django.contrib import admin

from GRIEVANCE.models import GrievanceType,GrievancePriority,GrievanceSeverity,Grievance

admin.site.register(GrievanceType)
admin.site.register(GrievancePriority)
admin.site.register(GrievanceSeverity)
admin.site.register(Grievance)



