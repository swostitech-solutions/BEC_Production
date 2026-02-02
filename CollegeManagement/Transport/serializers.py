from rest_framework import serializers

from Transport.models import RouteMaster, PickupPoint, RouteDetail


class RouteMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteMaster
        fields = ['id', 'transport_name','organization', 'branch','is_active','created_by']


    def validate_transport_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Transport Name cannot be empty or only whitespace.")
        return value

class RouteMasterUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = RouteMaster
        fields = ['id', 'transport_name', 'organization_id', 'branch_id', 'updated_by']
        extra_kwargs = {
            'updated_by': {'required': True},  # Make updated_by required
        }

    def validate_transport_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Transport Name cannot be empty or only whitespace.")
        return value

    def validate_updated_by(self, value):
        if not value:
            raise serializers.ValidationError("updated_by required!! .")
        return value



class PickupPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupPoint
        fields = ['id', 'pickup_point_name','organization_id', 'branch_id','amount','is_active','created_by']

    def validate_pickup_point_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("PickUp Point Name cannot be empty or only whitespace.")
        return value

    def validate_amount(self, value):
        if not value:
            raise serializers.ValidationError("amount cannot be empty or only whitespace.")
        return value

class PickupPointUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupPoint
        fields = ['id', 'pickup_point_name','organization_id', 'branch_id','amount','updated_by']

        extra_kwargs = {
            'updated_by': {'required': True},  # Make updated_by required
        }

    def validate_pickup_point_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("PickUp Point Name cannot be empty or only whitespace.")
        return value

    def validate_amount(self, value):
        if not value:
            raise serializers.ValidationError("amount cannot be empty or only whitespace.")
        return value
    def validate_updated_by(self, value):
        if not value:
            raise serializers.ValidationError("updated_by required!! .")
        return value



class RouteDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteDetail
        fields = ['id', 'route_master_id', 'pickup_point_id', 'pickup_time', 'pickup_sequence', 'is_active', 'created_by']

    def validate_pickup_time(self, value):
        if not value:
            raise serializers.ValidationError("pickup_time can not be blank.")
        return value


class RouteDetailUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteDetail
        fields = ['id', 'route_master_id', 'pickup_point_id', 'pickup_time', 'pickup_sequence','updated_by']

        extra_kwargs = {
            'updated_by': {'required': True},  # Make updated_by required
        }

    def validate_pickup_time(self, value):
        if not value:
            raise serializers.ValidationError("pickup_time can not be blank.")
        return value

    def validate_updated_by(self, value):
        if not value:
            raise serializers.ValidationError("updated_by required!! .")
        return value


class RouteMasterFilterBasedOrganizationIdBranchIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteMaster
        fields = ['organization_id', 'branch_id']



class GetRouteDetailANDPICKUPPOINTSerializer(serializers.ModelSerializer):
    route_detail_id = serializers.IntegerField()
    class Meta:
        model = PickupPoint
        fields = ['id', 'pickup_point_name', 'organization', 'branch', 'amount', 'is_active', 'created_by',
                  'route_detail_id']


class GetStudentTransportAvailOrNotListSerializer(serializers.Serializer):
    academic_year_id = serializers.IntegerField(required=True,allow_null=False)
    organization_id = serializers.IntegerField(required=True,allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    student_id = serializers.IntegerField(required=True, allow_null=False)
    course_id = serializers.IntegerField(required=True, allow_null=False)
    semester_id = serializers.IntegerField(required=True, allow_null=False)

class UpdateTransportAvailOrNotUpdateSerializer(serializers.Serializer):
    created_by = serializers.IntegerField(required=True,allow_null=False)

    student_id = serializers.IntegerField(required=True, allow_null=False)
    transport_availed = serializers.BooleanField(required=True)
    choice_semesters = serializers.ListSerializer(
        child=serializers.IntegerField(), required=False
    )
    route_id = serializers.IntegerField(required=False)
    pickup_point_id =serializers.IntegerField(required=False)
    amount = serializers.DecimalField(max_digits=18, decimal_places=2,required=False,allow_null=True)



class StudentTransportFeeSearchSerializer(serializers.Serializer):
    academic_year_id = serializers.IntegerField(allow_null=False,required=True)
    organization_id = serializers.IntegerField(allow_null=False,required=True)
    branch_id = serializers.IntegerField(allow_null=False,required=True)
    student_id = serializers.IntegerField(allow_null=True,required=False)
    course_id = serializers.IntegerField(allow_null=True,required=False)
    semester_id = serializers.IntegerField(allow_null=True, required=False)
    pickup_point_id = serializers.IntegerField(allow_null=True,required=False)
    fee_applied_from_id = serializers.IntegerField(allow_null=True,required=False)
    paid_unpaid= serializers.BooleanField(allow_null=False,required=True)

class StudentFeeGetBasedOnFeeAppliedFromSerializer(serializers.Serializer):
    student_id= serializers.IntegerField(required=True,allow_null=False)
    fee_applied_from_id = serializers.IntegerField(required=True,allow_null=False)
    academic_year_id= serializers.IntegerField(required=True,allow_null=False)
    organization_id = serializers.IntegerField(required=True, allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)


