from rest_framework import serializers

from TRAINING_PLACEMENT.models import TrainingPlacement


class TrainingPlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingPlacement
        fields = ['id', 'company_name', 'module','duration','from_date','to_date','participants','hr_name','organization','branch', 'batch', 'course', 'department', 'academic_year', 'semester', 'is_active','created_by','created_at','updated_at']

# class Training_PlacementSerializers(serializers.ModelSerializer):
#     class Meta:
#         model = TRAINING_PLACEMENT
#         fields = ['id', 'companyname', 'module', 'duration', 'fromdate', 'todate', 'participants', 'HRName', 'academic_year_id', 'org_id', 'branch_id', 'is_active', 'created_by', 'created_at', 'updated_at']
#         extra_kwargs = {
#             'HRName': {'required': True},
#             'participants': {'required': True},
#         }


class TrainingPlacementSearchSerializer(serializers.Serializer):

    organization_id= serializers.IntegerField(allow_null=False,required=True)
    branch_id = serializers.IntegerField(allow_null=False, required=True)
    batch_id = serializers.IntegerField(allow_null=False, required=True)
    company_name= serializers.CharField(max_length=255,allow_null=True,allow_blank=True,required=False)
    module = serializers.CharField(max_length=255,allow_blank=True,allow_null=True,required=False)
    from_date = serializers.DateField(allow_null=True,required=False)
    to_date = serializers.DateField(allow_null=True,required=False)