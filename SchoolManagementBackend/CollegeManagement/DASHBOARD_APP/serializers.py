from rest_framework import serializers

class AttendanceDashboardSerializer(serializers.Serializer):

    organization_id = serializers.IntegerField(required=True, allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    batch_id = serializers.IntegerField(required=True, allow_null=False)
    date= serializers.DateField(required=True, allow_null=False)



class FeesDashboardSerializer(serializers.Serializer):
    # academic_year_id = serializers.IntegerField(required=True, allow_null=False)
    organization_id = serializers.IntegerField(required=True, allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    batch_id = serializers.IntegerField(required=True, allow_null=False)
    from_date = serializers.DateField(required=True,allow_null=True)
    to_date = serializers.DateField(required=True,allow_null=True)

class FeesDuesSerializer(serializers.Serializer):
    # academic_year_id = serializers.IntegerField(required=True, allow_null=False)
    organization_id = serializers.IntegerField(required=True, allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    batch_id = serializers.IntegerField(required=True, allow_null=False)
    year = serializers.IntegerField(required=False, allow_null=True)

class FeesDuesSearchSerializer(serializers.Serializer):
    # academic_year_id = serializers.IntegerField(required=True, allow_null=False)
    organization_id = serializers.IntegerField(required=True, allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    batch_id = serializers.IntegerField(required=True, allow_null=False)
    from_date= serializers.DateField(required=True)
    to_date= serializers.DateField(required=True)

class LibraryDashboardSerializer(serializers.Serializer):
    organization_id= serializers.IntegerField(required=True)
    branch_id= serializers.IntegerField(required=True)
    batch_id= serializers.IntegerField(required=True)
















