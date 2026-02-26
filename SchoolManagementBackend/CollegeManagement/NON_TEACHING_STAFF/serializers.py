from rest_framework import serializers
from NON_TEACHING_STAFF.models import NonTeachingStaffMaster
from Acadix.models import Gender, Blood, Nationality, Religion, City, State, Country


class NonTeachingStaffCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating non-teaching staff"""
    
    class Meta:
        model = NonTeachingStaffMaster
        fields = [
            'organization', 'branch', 'staff_code', 'title', 'first_name',
            'middle_name', 'last_name', 'date_of_birth', 'place_of_birth',
            'marital_status', 'gender', 'phone_number', 'email',
            'official_email', 'emergency_contact_number', 'blood_group',
            'nationality', 'religion', 'date_of_joining',
            'date_of_leaving', 'status', 'profile_pic', 'profile_photo_path',
            'address_line1', 'address_line2', 'city', 'state', 'country',
            'pincode', 'created_by'
        ]

    def validate_staff_code(self, value):
        """Ensure staff code is unique"""
        if NonTeachingStaffMaster.objects.filter(staff_code=value).exists():
            if self.instance and self.instance.staff_code == value:
                return value
            raise serializers.ValidationError("Staff code already exists")
        return value

    def validate_phone_number(self, value):
        """Validate phone number format"""
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError("Phone number must be exactly 10 digits")
        return value

    def validate_pincode(self, value):
        """Validate pincode format"""
        if value and (not value.isdigit() or len(value) != 6):
            raise serializers.ValidationError("Pincode must be exactly 6 digits")
        return value


class NonTeachingStaffUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating non-teaching staff"""
    
    class Meta:
        model = NonTeachingStaffMaster
        fields = [
            'title', 'first_name', 'middle_name', 'last_name', 'date_of_birth',
            'place_of_birth', 'marital_status', 'gender', 'phone_number',
            'email', 'official_email', 'emergency_contact_number', 'blood_group',
            'nationality', 'religion', 'date_of_joining',
            'date_of_leaving', 'status', 'profile_pic', 'profile_photo_path',
            'address_line1', 'address_line2', 'city', 'state', 'country',
            'pincode', 'updated_by'
        ]


class NonTeachingStaffListSerializer(serializers.ModelSerializer):
    """Serializer for listing non-teaching staff in table"""
    full_name = serializers.CharField(read_only=True)
    gender_name = serializers.CharField(source='gender.gender', read_only=True)
    city_name = serializers.CharField(source='city.city_name', read_only=True)
    state_name = serializers.CharField(source='state.state_name', read_only=True)
    organization_name = serializers.CharField(source='organization.organization_code', read_only=True)
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)

    class Meta:
        model = NonTeachingStaffMaster
        fields = [
            'nts_id', 'staff_code', 'full_name', 'first_name', 'middle_name',
            'last_name', 'phone_number', 'email', 'gender_name', 'city_name',
            'state_name', 'status', 'date_of_joining', 'organization_name',
            'branch_name', 'created_at'
        ]


class NonTeachingStaffDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed view of non-teaching staff"""
    full_name = serializers.CharField(read_only=True)
    full_address = serializers.CharField(read_only=True)
    gender_name = serializers.CharField(source='gender.gender', read_only=True)
    blood_group_name = serializers.CharField(source='blood_group.blood', read_only=True)
    city_name = serializers.CharField(source='city.city_name', read_only=True)
    state_name = serializers.CharField(source='state.state_name', read_only=True)
    country_name = serializers.CharField(source='country.country_name', read_only=True)

    class Meta:
        model = NonTeachingStaffMaster
        fields = '__all__'


class NonTeachingStaffAddressUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating only address information"""
    
    class Meta:
        model = NonTeachingStaffMaster
        fields = [
            'address_line1', 'address_line2', 'city', 'state',
            'country', 'pincode', 'updated_by'
        ]
