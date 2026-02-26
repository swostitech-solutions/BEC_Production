
from rest_framework import serializers

from HOSTEL.models import Hostel, HostelBlock, HostelBlockFloor, HostelRoomType, HostelRoom, HostelRoomBed


class GetStudentHostelAvailOrNotListSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True,allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    batch_id = serializers.IntegerField(required=False, allow_null=True)
    course_id = serializers.IntegerField(required=False, allow_null=True)
    department_id = serializers.IntegerField(required=False, allow_null=True)
    academic_year_id = serializers.IntegerField(required=False, allow_null=True)
    semester_id = serializers.IntegerField(required=False, allow_null=True)
    section_id = serializers.IntegerField(required=False, allow_null=True)
    student_id = serializers.IntegerField(required=False, allow_null=True)
    hostel_id = serializers.IntegerField(required=False, allow_null=True)
    hostel_block_id = serializers.IntegerField(required=False, allow_null=True)
    block_floor_id = serializers.IntegerField(required=False, allow_null=True)
    room_id = serializers.IntegerField(required=False, allow_null=True)
    room_type_id = serializers.IntegerField(required=False, allow_null=True)
    bed_id = serializers.IntegerField(required=False, allow_null=True)


# organization,branch,hostel,hostel_block,hostel_block_floor,room_type,room,bed,choice_semester,student,student_course
class HostelDetailUpdateSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True,allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    hostel_id = serializers.IntegerField(required=True, allow_null=False)
    hostel_block_id = serializers.IntegerField(required=True, allow_null=False)
    hostel_block_floor_id = serializers.IntegerField(required=True, allow_null=False)
    room_type_id = serializers.IntegerField(required=True, allow_null=False)
    room_id = serializers.IntegerField(required=True, allow_null=False)
    bed_id = serializers.IntegerField(required=True, allow_null=False)
    choice_semester_ids = serializers.ListField(child=serializers.IntegerField(),required=True, allow_null=False)
    student_id = serializers.IntegerField(required=True, allow_null=False)
    # student_course_id = serializers.IntegerField(required=True, allow_null=False)
    hostel_avail = serializers.BooleanField(required=True)
    created_by = serializers.IntegerField(required=True, allow_null=False)

class UpdateHostelAvailOrNotUpdateSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True,allow_null=False)
    branch_id = serializers.IntegerField(required=True,allow_null=False)
    created_by = serializers.IntegerField(required=True,allow_null=False)
    # hostel_details = serializers.ListSerializer(child=HostelDetailUpdateSerializer, required=True)
    choice_semester_ids = serializers.ListSerializer(child=serializers.IntegerField(), required=False)
    student_id = serializers.IntegerField(required=True, allow_null=False)
    hostel_avail = serializers.BooleanField(required=True)
   # period_month = serializers.ListSerializer(
       # child=serializers.IntegerField(), required=False)

class studentHostelFeesSearchSerializer(serializers.Serializer):
    academic_year_id = serializers.IntegerField(allow_null=False,required=True)
    organization_id = serializers.IntegerField(allow_null=False,required=True)
    branch_id = serializers.IntegerField(allow_null=False,required=True)
    batch_id = serializers.IntegerField(allow_null=False,required=True)
    student_id = serializers.IntegerField(allow_null=True,required=False)
    course_id = serializers.IntegerField(allow_null=True,required=False)
    section_id = serializers.IntegerField(allow_null=True, required=False)
    fee_applied_from_id = serializers.IntegerField(allow_null=True,required=False)
    paid_unpaid= serializers.BooleanField(allow_null=False,required=True)

class StudentHostelFeeGetBasedOnFeeAppliedFromSerializer(serializers.Serializer):
    student_id= serializers.IntegerField(required=True,allow_null=False)
    fee_applied_from_id = serializers.IntegerField(required=True,allow_null=False)
    academic_year_id= serializers.IntegerField(required=True,allow_null=False)
    organization_id = serializers.IntegerField(required=True, allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)



class Hostel_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Hostel
        fields = ['id','organization','branch','hostel_name','hostel_description','is_active']

class Hostel_Block_Serializer(serializers.ModelSerializer):
    class Meta:
        model = HostelBlock
        fields = ['id','organization','branch','hostel','block_name','block_description','is_active']

class Hostel_Block_Floor_Serializer(serializers.ModelSerializer):
    class Meta:
        model = HostelBlockFloor
        fields = ['id','organization','branch','hostel','hostel_block','floor_number','is_available','is_active']

class Hostel_Room_Type_Serializer(serializers.ModelSerializer):
    class Meta:
        model = HostelRoomType
        fields = ['id','organization','branch','hostel','room_type','room_type_description','is_active']

class Hostel_Room_Serializer(serializers.ModelSerializer):
    class Meta:
        model = HostelRoom
        fields = ['id','organization','branch','hostel','hostel_block','hostel_block_floor','room_type','room_number','is_available','is_active']

class Hostel_Room_Bed_Serializer(serializers.ModelSerializer):
    class Meta:
        model = HostelRoomBed
        fields = ['id','organization','branch','hostel','hostel_block','hostel_block_floor','room_type','room','bed_number','bed_cost','is_available','is_active']