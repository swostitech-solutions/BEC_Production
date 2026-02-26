from rest_framework import serializers

from Acadix.models import EmployeeMaster, Address
from STAFF.models import EmployeeAssignment, EmployeeCourse, EmployeeExperience,EmployeeFamilyDetail, EmployeeLanguage, EmployeeQualification, EmployeeDocument


# serializers.py
from rest_framework import serializers
# from drf_extra_fields.fields import Base64ImageField
from .models import EmployeeMaster

class staffRegistrationserializer(serializers.ModelSerializer):
    # image_url = serializers.SerializerMethodField()
    # employee_id = serializers.IntegerField(required=False)
    class Meta:
        model = EmployeeMaster
        fields = ['id','organization','branch','batch','employee_code','title','first_name','middle_name',
                  'last_name','date_of_birth','place_of_birth','marital_status','blood_group','nationality',
                  'religion','gender','mother_tongue','employee_type','email','office_email','profile_pic',
                  'phone_number','emergency_contact_number','created_by', 'nuid']
        # fields = ['id', 'first_name', 'upload_image', 'profile_photo']
        # read_only_fields = ['profile_photo_path']

    # def get_image_url(self, obj):
    #     request = self.context.get('request')
    #     if obj.image and hasattr(obj.image, 'url'):
    #         return request.build_absolute_uri(obj.image.url)
    #     return None


class staffRegistrationserializer1(serializers.ModelSerializer):
    # upload_image = serializers.ImageField(write_only=True, required=False)
    employee_id= serializers.IntegerField(required=False)
    class Meta:
        model = EmployeeMaster
        fields = [
            'employee_id',
            'org_id',
            'branch_id',
            'employee_code',
            'title',
            'first_name',
            'middle_name',
            'last_name',
            'dob',
            'place_of_birth',
            'marital_status',
            'blood_group',
            'nationality',
            'religion',
            'gender',
            'mother_tongue',
            'employee_type',
            'email',
            'office_email',
            'phone_number',
            'emergency_contact_number',
            'created_by',
            'nuid',
        ]

class staffRegistrationAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields= ['present_address','present_pincode','present_city','present_state','present_country',
                'present_phone_number','permanent_address','permanent_pincode','permanent_city','permanent_state',
                 'permanent_country','permanent_phone_number','created_by']


class staffRegistrationDocumentSerializer(serializers.ModelSerializer):
    upload_file = serializers.FileField(write_only=True, required=False,allow_null=True,allow_empty_file=True)
    class Meta:
        model = EmployeeDocument
        fields = ['organization','branch','batch','document_type_id','document_file','document_number','valid_from','valid_to']

class staffRegistrationListDocumentcreateUpdateSerializer(serializers.Serializer):
    created_by = serializers.IntegerField(required=True,allow_null=False)
    document_details = serializers.ListSerializer(child=staffRegistrationDocumentSerializer(),required=True)


class staffRegistrationFamilyDetailsSerializer(serializers.ModelSerializer):
    family_details_id = serializers.IntegerField(required=False)
    class Meta:
        model = EmployeeFamilyDetail
        fields = ['family_details_id','employee_relation','relation_title','relation_first_name','relation_middle_name','relation_last_name',
                  'relation_dob','relation_gender','relation_marital_status','relation_occupation','relation_dependent',
                  'relation_pf_nominee','relation_pf_share','relation_employed']

class staffRegistrationFamilyDetailsUpdateSerializer(serializers.Serializer):
    created_by = serializers.IntegerField(required=True, allow_null=False)
    family_details = serializers.ListSerializer(child=staffRegistrationFamilyDetailsSerializer(), required=True)


class staffRegistrationQUALIFICATIONSDetailsSerializer(serializers.ModelSerializer):
    qualification_id = serializers.IntegerField(required=False)
    class Meta:
        model = EmployeeQualification
        fields = ['qualification_id','qualification','highest_qualification','date_from','date_to','university','institution','marks']

class staffRegistrationQualificationDetailsUpdateSerializer(serializers.Serializer):
    created_by = serializers.IntegerField(required=True, allow_null=False)
    qualifications_details = serializers.ListSerializer(child=staffRegistrationQUALIFICATIONSDetailsSerializer(),required=True)

class staffRegistrationCourseDetailsSerializer(serializers.ModelSerializer):
    course_id=serializers.IntegerField(required=False)
    class Meta:
        model = EmployeeCourse
        fields = ['course_id','course_name','course_place','date_from','date_to','valid_upto','course_results']

class staffRegistrationCourseDetailsUpdateSerializer(serializers.Serializer):
    created_by = serializers.IntegerField(required=True, allow_null=False)
    course_details = serializers.ListSerializer(child=staffRegistrationCourseDetailsSerializer(),required=True)


class staffRegistrationLanguageDetailsSerializer(serializers.ModelSerializer):
    employee_language_id=serializers.IntegerField(required=False)
    # language_code= serializers.ListSerializer(child=serializers.IntegerField(required=False))
    class Meta:
        model = EmployeeLanguage
        fields = ['employee_language_id','language_code','created_by']

class staffRegistrationExperienceDetailsSerializer(serializers.ModelSerializer):
    experience_id=serializers.IntegerField(required=False)
    class Meta:
        model = EmployeeExperience
        fields = ['experience_id','previous_company_worked','date_from','date_to','reason_for_leaving','experience_letter_provided']

class staffRegistrationExperienceDetailsUpdateSerializer(serializers.Serializer):
    created_by = serializers.IntegerField(required=True, allow_null=False)
    experience_details = serializers.ListSerializer(child=staffRegistrationExperienceDetailsSerializer(),required=True)

class staffDetailsFilterSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True)
    branch_id= serializers.IntegerField(required=True)
    employee_code = serializers.CharField(max_length=50,required=False)
    first_name = serializers.CharField(max_length=50,required=False)
    middle_name = serializers.CharField(max_length=50,required=False)
    last_name = serializers.CharField(max_length=50, required=False)
    employee_type = serializers.IntegerField(required=False)


# class staffEmployeeTypeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model=SCH_EMPLOYEE_TYPE
#         fields = ['employee_type_id','employee_type','employee_type_desc','is_active']