from rest_framework import serializers

from Acadix.models import LecturePeriod


# class GetTermListBasedOnClass(serializers.Serializer):
#     academic_year_id = serializers.IntegerField(required=True,allow_null=False)
#     organization_id = serializers.IntegerField(required=True, allow_null=False)
#     branch_id = serializers.IntegerField(required=True, allow_null=False)
#     class_id = serializers.IntegerField(required=True,allow_null=False)

class TimeTableSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True, allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    batch_id = serializers.IntegerField(required=True, allow_null=False)
    course_id = serializers.IntegerField(required=True, allow_null=False)
    department_id = serializers.IntegerField(required=True, allow_null=False)
    academic_year_id = serializers.IntegerField(required=True, allow_null=False)
    semester_id = serializers.IntegerField(required=False, allow_null=True)
    section_id = serializers.IntegerField(required=False, allow_null=True)
    professor_id = serializers.IntegerField(required=True, allow_null=False)

    subject_id = serializers.IntegerField(required=True, allow_null=False)
    lecture_id = serializers.IntegerField(required=True, allow_null=False)
    # term_id = serializers.IntegerField(required=True, allow_null=False)
    total_no_of_lectures = serializers.IntegerField(default=0)
    days = serializers.ListField(
        child=serializers.CharField(max_length=15),
        required=True
    )
    created_by = serializers.IntegerField(required=True,allow_null=False)


class TimeTableSearchBasedOnCriteria(serializers.Serializer):

    organization_id = serializers.IntegerField(required=True, allow_null=True)
    branch_id = serializers.IntegerField(required=True, allow_null=True)
    batch_id = serializers.IntegerField(required=True, allow_null=True)
    course_id = serializers.IntegerField(required=False, allow_null=True)
    department_id = serializers.IntegerField(required=False, allow_null=True)
    academic_year_id = serializers.IntegerField(required=False, allow_null=True)
    semester_id = serializers.IntegerField(required=False, allow_null=True)
    section_id = serializers.IntegerField(required=False, allow_null=True)
    professor_id = serializers.IntegerField(required=False,allow_null=True)
    subject_id = serializers.IntegerField(required=False, allow_null=True)
    # term_id = serializers.IntegerField(required=False, allow_null=True)

class GetTimeTableEntryListSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True, allow_null=True)
    branch_id = serializers.IntegerField(required=True, allow_null=True)
    course_id = serializers.IntegerField(required=False, allow_null=True)
    department_id = serializers.IntegerField(required=False, allow_null=True)
    academic_year_id = serializers.IntegerField(required=False, allow_null=True)
    semester_id = serializers.IntegerField(required=False, allow_null=True)
    section_id = serializers.IntegerField(required=False, allow_null=True)
    professor_id = serializers.IntegerField(required=False, allow_null=True)
    subject_id = serializers.IntegerField(required=False, allow_null=True)
    lecture_id = serializers.IntegerField(required=False,allow_null=True)
    # term_id = serializers.IntegerField(required=False,allow_null=True)
    # days = serializers.ListField(
    #     child=serializers.CharField(max_length=1000),
    #     required=False
    # )
    days = serializers.ListField(child=serializers.CharField(max_length=100),required=False,max_length=1000,allow_null=True)


class GetTopicBasedOnSubjectWiseSerializer(serializers.Serializer):
    # academic_year_id= serializers.IntegerField(required=True,allow_null=False)
    organization_id = serializers.IntegerField(required=True, allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    batch_id = serializers.IntegerField(required=True, allow_null=False)
    course_id = serializers.IntegerField(required=True, allow_null=False)
    department_id = serializers.IntegerField(required=True, allow_null=False)
    academic_year_id = serializers.IntegerField(required=True, allow_null=False)
    semester_id = serializers.IntegerField(required=True, allow_null=False)
    section_id = serializers.IntegerField(required=True, allow_null=False)
    subject_id = serializers.IntegerField(required=True,allow_null=False)

class LectureDetailSerializer(serializers.Serializer):
    lecture_no = serializers.IntegerField(required=True,allow_null=False)
    module_no = serializers.CharField(max_length=100,allow_null=True,allow_blank=True)
    topic_id= serializers.IntegerField(required=True,allow_null=False)
    propose_date = serializers.DateField(required=True,allow_null=False)

class LecturePeriod_Serializer(serializers.ModelSerializer):
    class Meta:
        model = LecturePeriod
        fields = ['id','lecture_period_name','lecture_period_description','time_from','time_to','day_attendance']


class LecturePlanAddSerializer(serializers.Serializer):

    organization_id = serializers.IntegerField(required=True, allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    batch_id = serializers.IntegerField(required=True, allow_null=False)

    course_id = serializers.IntegerField(required=True, allow_null=False)
    department_id = serializers.IntegerField(required=True, allow_null=False)
    academic_year_id = serializers.IntegerField(required=True, allow_null=False)
    semester_id = serializers.IntegerField(required=True, allow_null=False)
    section_id = serializers.IntegerField(required=True, allow_null=False)
    # term_id = serializers.IntegerField(required=True, allow_null=False)

    subject_id = serializers.IntegerField(required=True, allow_null=False)
    professor_id = serializers.IntegerField(required=True, allow_null=False)
    lecture_details = serializers.ListSerializer(child=LectureDetailSerializer(),
                                                 allow_null=False,
                                                 allow_empty=False,
                                                 required=True)
    created_by = serializers.IntegerField(required=True,allow_null=False)


class GetTimeTableListBasedOnProfessorSubjectSerializer(serializers.Serializer):

    organization_id = serializers.IntegerField(required=True, allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    batch_id = serializers.IntegerField(required=True, allow_null=False)
    course_id = serializers.IntegerField(required=True, allow_null=False)
    department_id = serializers.IntegerField(required=True, allow_null=False)
    academic_year_id = serializers.IntegerField(required=True, allow_null=False)
    semester_id = serializers.IntegerField(required=True, allow_null=False)
    section_id = serializers.IntegerField(required=True, allow_null=False)
    professor_id = serializers.IntegerField(required=True,allow_null=False)
    subject_id = serializers.IntegerField(required=True,allow_null=False)


class GetSubjectListBasedOnTermSerializer(serializers.Serializer):
    academic_year_id= serializers.IntegerField(required=True,allow_null=False)
    organization_id = serializers.IntegerField(required=True, allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    # term_id = serializers.IntegerField(required=True,allow_null=False)

class LecturePlanUpdateSerializer(serializers.Serializer):
    # LESSON_PLAN_ID = serializers.IntegerField(required=True,allow_null=False)
    taught_date = serializers.DateField(required=True)
    percentage_completed = serializers.CharField(max_length=100,allow_null=True,allow_blank=True)
    remarks = serializers.CharField(max_length=500,required=False,allow_blank=True,allow_null=True)
    updated_by = serializers.IntegerField(required=True,allow_null=False)

class LecturePlanListSearchCriteriaSerializer(serializers.Serializer):

    organization_id = serializers.IntegerField(required=True, allow_null=False)
    branch_id = serializers.IntegerField(required=True, allow_null=False)
    batch_id = serializers.IntegerField(required=False, allow_null=True)
    course_id= serializers.IntegerField(required=False)
    department_id = serializers.IntegerField(required=False)
    academic_year_id = serializers.IntegerField(required=False, allow_null=True)
    semester_id = serializers.IntegerField(required=False, allow_null=True)
    section_id = serializers.IntegerField(required=False)
    professor_id = serializers.IntegerField(required=False)
    # term_id = serializers.IntegerField(required=False)
    subject_id = serializers.IntegerField(required=False)

