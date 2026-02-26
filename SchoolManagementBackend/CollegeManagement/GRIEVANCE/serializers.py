from rest_framework import serializers

from GRIEVANCE.models import GrievanceType, GrievancePriority, GrievanceSeverity, Grievance


class GrievanceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        models= GrievanceType
        fields = ['grievance_type','grievance_type_description','organization','branch','is_active']

class GrievancePrioritySerializer(serializers.ModelSerializer):
    class Meta:
        models= GrievancePriority
        fields = ['priority_type','priority_type_description','organization','branch','is_active']

class GrievanceSeveritySerializer(serializers.ModelSerializer):
    class Meta:
        models= GrievanceSeverity
        fields = ['severity_type','severity_type_desc','organization','branch','is_active']

class GrievanceCreateSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True)
    branch_id = serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)
    course_id = serializers.IntegerField(required=True)
    department_id = serializers.IntegerField(required=True)
    academic_year_id = serializers.IntegerField(required=True)
    semester_id = serializers.IntegerField(required=True)
    section_id = serializers.IntegerField(required=True)
    student_id = serializers.IntegerField(required=True)
    grievance_type_id= serializers.IntegerField(allow_null=False,required=True)
    grievance_priority_id = serializers.IntegerField(allow_null=False,required=True)
    grievance_severity_id = serializers.IntegerField(allow_null=False,required=True)
    details = serializers.CharField(allow_null=False,allow_blank=False,required=True)
    is_anonymous = serializers.BooleanField(required=True)
    upload_file = serializers.FileField(allow_null=True,allow_empty_file=True)
    created_by = serializers.IntegerField(allow_null=False,required=True)


class GetGrievanceByStudentSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)
    student_id = serializers.IntegerField(required=True)




class GetSearchedGrievanceSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)
    studentId = serializers.IntegerField(required=False)
    course_id = serializers.IntegerField(required=False)
    department_id = serializers.IntegerField(required=False)
    semester_id = serializers.IntegerField(required=False)
    section_id = serializers.IntegerField(required=False)
    grievance_type_id = serializers.IntegerField(required=False)
    grievance_priority_id = serializers.IntegerField(required=False)
    grievance_security_id = serializers.IntegerField(required=False)
    from_date = serializers.DateField(required=False)
    to_date = serializers.DateField(required=False)
    status= serializers.CharField(max_length=1)  # A - All, Y- Action Taken, N- Action not taken


class GrievanceDetailsUpdateSerializer(serializers.Serializer):
    grievance_ids = serializers.ListSerializer(child=serializers.IntegerField(required=False),required=True)
    updated_by_list = serializers.ListSerializer(child=serializers.IntegerField(required=False),required=True)
    # action_taken_list = serializers.ListSerializer(child=serializers.CharField(required=False),required=True)
    status_list = serializers.ListSerializer(child=serializers.BooleanField(required=False),required=True)







