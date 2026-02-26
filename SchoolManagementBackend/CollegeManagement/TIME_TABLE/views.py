from django.utils import timezone

from django.db import DatabaseError
from django.db.models import Q
from django.http import Http404
from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from Acadix.models import ExceptionTrack, TimeTable, AcademicYear, Organization, Branch, EmployeeMaster, \
    Course, Section, CourseDepartmentSubject, Period, Lecture, Batch, Department, Semester, LecturePeriod
from TIME_TABLE.models import SubjectTopic, LecturePlan
from TIME_TABLE.serializers import TimeTableSerializer, TimeTableSearchBasedOnCriteria, \
    GetTimeTableEntryListSerializer, GetTopicBasedOnSubjectWiseSerializer, LecturePlanAddSerializer, \
    GetTimeTableListBasedOnProfessorSubjectSerializer, GetSubjectListBasedOnTermSerializer, LecturePlanUpdateSerializer, \
    LecturePlanListSearchCriteriaSerializer, LecturePeriod_Serializer


# Create your views here.
# class GetTermListAPIView(ListAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = GetTermListBasedOnClass
#
#     def list(self, request, *args, **kwargs):
#         try:
#             serializer = self.get_serializer(data=request.query_params)
#             serializer.is_valid(raise_exception=True)
#
#             # filter Record Into DB
#             try:
#                 classwiseTermList = SCH_CLASS_TERMS.objects.filter(org_id=serializer.validated_data.get('org_id'),
#                                                                    branch_id=serializer.validated_data.get('branch_id'),
#                                                                    academic_year_id=serializer.validated_data.get(
#                                                                        'academic_year_id'),
#                                                                    class_id=serializer.validated_data.get("class_id"),
#                                                                    is_active=True)
#             except:
#                 classwiseTermList = None
#
#             if classwiseTermList:
#                 responsedata = []
#                 for item in classwiseTermList:
#                     data = {
#                         'CLASS_TERMS_ID': item.CLASS_TERMS_ID,
#                         'term_id': item.term_id.Term_Id,
#                         'term_desc': item.term_id.term_desc
#                     }
#
#                     responsedata.append(data)
#
#                 return Response({'message': 'success', 'data': responsedata}, status=status.HTTP_200_OK)
#             else:
#                 return Response({'message': 'No record Found'}, status=status.HTTP_200_OK)
#
#
#         except ValidationError as e:
#
#             return Response({'message': e.detail}, status=status.HTTP_400_BAD_REQUEST)
#
#         except Http404:
#
#             return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)
#
#         except Exception as e:
#
#             # Log the exception
#
#             error_message = str(e)
#
#             self.log_exception(request, error_message)
#
#             return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#
#     def log_exception(self, request, error_message):
#
#         ExceptionTrack.objects.create(
#
#             request=str(request),
#
#             process_name='GetTermListBasedOnClass',
#
#             message=error_message,
#
#         )
#

class TimeTableEntryForProfessors(CreateAPIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = TimeTableSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Get Validated Data
            organization_id = serializer.validated_data.get('organization_id')
            branch_id = serializer.validated_data.get('branch_id')
            batch_id = serializer.validated_data.get('batch_id')
            course_id = serializer.validated_data.get('course_id')
            department_id = serializer.validated_data.get('department_id')
            academic_year_id = serializer.validated_data.get('academic_year_id')
            semester_id=serializer.validated_data.get('semester_id')
            section_id=serializer.validated_data.get('section_id')
            professor_id = serializer.validated_data.get('professor_id')
            # class_id = serializer.validated_data.get('class_id')
            # section_id = serializer.validated_data.get('section_id')
            subject_id = serializer.validated_data.get('subject_id')
            lecture_period_id = serializer.validated_data.get('lecture_id')
            # term_id = serializer.validated_data.get('term_id')
            days = serializer.validated_data.get('days')
            created_by = serializer.validated_data.get('created_by')

            # print(academic_year_id,type(academic_year_id))

            # check if the class, section,class period assign on this day for this academic year

            # Build query for multiple days
            query = Q(

                organization=organization_id,
                branch=branch_id,
                batch=batch_id,
                course=course_id,
                department=department_id,
                academic_year=academic_year_id,
                semester=semester_id,
                section=section_id,
                lecture_period=lecture_period_id,
                # term_id=term_id,
                is_active=True
            )

            # Add multiple days check
            day_query = Q()
            for day in days:
                day_query |= Q(schedule_day__icontains=day)

            # Combine main query with days query
            if TimeTable.objects.filter(query & day_query).exists():
                return Response(
                    {
                        'message': 'A time table entry already exists for the course, department, lecture on this day for this semester '},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # check if the teacher is already assigned to another class at the same at the same time

            teacher_query = Q(
                organization=organization_id,
                branch=branch_id,
                batch=batch_id,
                course=course_id,
                department=department_id,
                academic_year=academic_year_id,
                semester=semester_id,
                section=section_id,
                lecture_period=lecture_period_id,
                # term_id=term_id,
                professor=professor_id,
                is_active=True

            )

            # Combine main query with days query
            if TimeTable.objects.filter(teacher_query & day_query).exists():
                return Response(
                    {
                        'message': 'This Teacher already assign this academic year for other class on this particular day and period '},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # TimeTable Insert the record

            # Get Instance of academic ,org, branch, teacher,class, section,subject,period,term Instance


            try:
                organizationInstance = Organization.objects.get(id=organization_id, is_active=True)
            except Organization.DoesNotExist:
                return Response({'message': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)

            try:
                branchInstance = Branch.objects.get(id=branch_id,
                                                      is_active=True)  # Fix: Use branch_id instead of org_id
            except Branch.DoesNotExist:
                return Response({'message': 'Branch not found'}, status=status.HTTP_404_NOT_FOUND)

            try:
                batchInstance = Batch.objects.get(id=batch_id,is_active=True)  # Fix: Use branch_id instead of org_id
            except Batch.DoesNotExist:
                return Response({'message': 'Batch not found'}, status=status.HTTP_404_NOT_FOUND)

            try:
                courseInstance = Course.objects.get(id=course_id, is_active=True)
            except Course.DoesNotExist:
                return Response({'message': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

            try:
                departmentInstance = Department.objects.get(id=department_id, is_active=True)
            except Department.DoesNotExist:
                return Response({'message': 'Department not found'}, status=status.HTTP_404_NOT_FOUND)

            try:
                academicyearInstance = AcademicYear.objects.get(id=academic_year_id, is_active=True)
            except AcademicYear.DoesNotExist:
                return Response({'message': 'Academic Year not found'}, status=status.HTTP_404_NOT_FOUND)

            try:
                semesterInstance = Semester.objects.get(id=semester_id, is_active=True)
            except Semester.DoesNotExist:
                return Response({'message': 'Semester not found'}, status=status.HTTP_404_NOT_FOUND)

            try:
                sectionInstance = Section.objects.get(id=section_id, is_active=True)
            except Section.DoesNotExist:
                return Response({'message': 'Section not found'}, status=status.HTTP_404_NOT_FOUND)

            try:
                subjectInstance = CourseDepartmentSubject.objects.get(id=subject_id, is_active=True)
            except CourseDepartmentSubject.DoesNotExist:
                return Response({'message': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)

            try:
                lecturePeriodInstance = LecturePeriod.objects.get(id=lecture_period_id, is_active=True)
            except Lecture.DoesNotExist:
                return Response({'message': 'Period not found'}, status=status.HTTP_404_NOT_FOUND)

            try:
                EmployeeInstance = EmployeeMaster.objects.get(id=professor_id, is_active=True)
            except EmployeeMaster.DoesNotExist:
                return Response({'message': 'Professor not found'}, status=status.HTTP_404_NOT_FOUND)

            # try:
            #     TermInstance = SCH_TERM_MASTER.objects.get(Term_Id=term_id, is_active=True)
            # except SCH_TERM_MASTER.DoesNotExist:
            #     return Response({'message': 'Term not found'}, status=status.HTTP_404_NOT_FOUND)

            for day in days:
                # create a TimeTable Entry

                TimeTableEntryInstance = TimeTable.objects.create(

                    organization=organizationInstance,
                    branch=branchInstance,
                    batch=batchInstance,
                    course=courseInstance,
                    department=departmentInstance,
                    academic_year=academicyearInstance,
                    semester=semesterInstance,
                    section=sectionInstance,
                    professor=EmployeeInstance,
                    subject=subjectInstance,
                    lecture_period=lecturePeriodInstance,
                    # term_id=TermInstance,
                    schedule_day=day,
                    created_by=created_by
                )

            return Response({'message': 'success'}, status=status.HTTP_200_OK)










        except ValidationError as e:

            # Rollback the transaction on validation error

            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)



        except DatabaseError as e:

            # Rollback the transaction on database error

            self.log_exception(request, str(e))

            return Response({'error': 'A database error occurred: ' + str(e)},

                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)





        except Exception as e:

            # Rollback the transaction on any other exception

            self.log_exception(request, str(e))

            return Response({'error': f'An unexpected error occurred: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='TimeTableCreate',

            message=error_message,

        )


class GetSearchedTimeTableListAPIView(ListAPIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = TimeTableSearchBasedOnCriteria

    def list(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.query_params)
            serializer.is_valid(raise_exception=True)

            # filter Record Into DB Based On academic,org and branch
            ## Get Basic/Mandatory Filter
            try:
                filterdata = TimeTable.objects.filter(
                    organization=serializer.validated_data.get('organization_id'),
                    branch=serializer.validated_data.get('branch_id'),
                    batch=serializer.validated_data.get('batch_id'),
                    is_active=True)
            except:
                filterdata = None

            if filterdata:
                responseData = []
                if serializer.validated_data.get('professor_id'):
                    filterdata = filterdata.filter(professor=serializer.validated_data.get('professor_id'))

                if serializer.validated_data.get('course_id'):
                    filterdata = filterdata.filter(course=serializer.validated_data.get('course_id'))
                if serializer.validated_data.get('department_id'):
                    filterdata = filterdata.filter(department=serializer.validated_data.get('department_id'))
                if serializer.validated_data.get('academic_year_id'):
                    filterdata = filterdata.filter(academic_year=serializer.validated_data.get('academic_year_id'))
                if serializer.validated_data.get('semester_id'):
                    filterdata = filterdata.filter(semester=serializer.validated_data.get('semester_id'))
                if serializer.validated_data.get('section_id'):
                    filterdata = filterdata.filter(section=serializer.validated_data.get('section_id'))
                if serializer.validated_data.get('subject_id'):
                    filterdata = filterdata.filter(subject_id=serializer.validated_data.get('subject_id'))

                # if serializer.validated_data.get('term_id'):
                #     filterdata = filterdata.filter(term_id=serializer.validated_data.get('term_id'))

                for item in filterdata:
                    name_part = filter(None, [
                        item.professor.title,
                        item.professor.first_name,
                        item.professor.middle_name,
                        item.professor.last_name

                    ])
                    professor_name = " ".join(name_part)

                    data = {

                        'course_id': item.course.id,
                        'course': item.course.course_name,
                        'department_id': item.department.id,
                        'department': item.department.department_description,
                        'academic_year_id': item.academic_year.id,
                        'academic_year': item.academic_year.academic_year_code,
                        'semester_id': item.semester.id,
                        'semester': item.semester.semester_code,
                        'section_id': item.section.id,
                        'section': item.section.section_name,
                        'lecture': item.lecture_period.lecture_period_name,
                        'subject': item.subject.subject_code,
                        # 'subject': item.subject_id.subject_description,
                        'professor_name': professor_name,
                        # 'term': item.term_id.term_desc,
                        'schedule_day': item.schedule_day
                    }

                    responseData.append(data)

                return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)


            else:
                return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)


        except ValidationError as e:

            return Response({'message': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Http404:

            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='GetSearchedTimeTableEntry',

            message=error_message,

        )


class GetTimeTableEntryDifSearchBasisListAPIView(ListAPIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = GetTimeTableEntryListSerializer

    def list(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.query_params)
            serializer.is_valid(raise_exception=True)

            organization_id = serializer.validated_data.get('organization_id')
            branch_id = serializer.validated_data.get('branch_id')
            course_id = serializer.validated_data.get('course_id')
            department_id = serializer.validated_data.get('department_id')
            academic_year_id = serializer.validated_data.get('academic_year_id')
            semester_id = serializer.validated_data.get('semester_id')
            section_id = serializer.validated_data.get('section_id')
            professor_id = serializer.validated_data.get('professor_id')
            subject_id = serializer.validated_data.get('subject_id')
            lecture_period_id = serializer.validated_data.get('lecture_period_id')
            days = serializer.validated_data.get('days')

            try:
                TimeTableEntryRecords = TimeTable.objects.filter(
                    # academic_year_id=serializer.validated_data.get('academic_year_id'),
                    organization=organization_id,
                    branch=branch_id,
                    is_active=True)
            except:
                TimeTableEntryRecords = None

            if professor_id:
                TimeTableEntryRecords = TimeTableEntryRecords.filter(professor=professor_id)

            if course_id:
                TimeTableEntryRecords = TimeTableEntryRecords.filter(course=course_id)

            if department_id:
                TimeTableEntryRecords = TimeTableEntryRecords.filter(
                    department=department_id)

            if academic_year_id:
                TimeTableEntryRecords = TimeTableEntryRecords.filter(
                    academic_year=academic_year_id)

            if semester_id:
                TimeTableEntryRecords = TimeTableEntryRecords.filter(
                    semester=semester_id)

            if section_id:
                TimeTableEntryRecords = TimeTableEntryRecords.filter(
                    section=section_id)

            if subject_id:
                TimeTableEntryRecords = TimeTableEntryRecords.filter(
                    subject=subject_id)

            if lecture_period_id:
                TimeTableEntryRecords = TimeTableEntryRecords.filter(
                    lecture=lecture_period_id)

            # if serializer.validated_data.get('term_id'):
            #     TimeTableEntryRecords = TimeTableEntryRecords.filter(term_id=serializer.validated_data.get('term_id'))

            if days:
                # days = serializer.validated_data.get('days', '')

                # if days:
                days_list = days.split(',')  # Convert comma-separated string into a list
                # print("Filtering for days:", days_list)  # Debugging
                TimeTableEntryRecords = TimeTableEntryRecords.filter(schedule_day__in=days_list)

            # if serializer.validated_data.get('days'):
            #     result=[]
            #     days=serializer.validated_data.get('days')
            #     for day in days:
            #         partial_record= TimeTableEntryRecords.filter(schedule_day=day)
            #         result.extend(partial_record)
            #
            #     TimeTableEntryRecords=result

            # TimeTableEntryRecords = TimeTableEntryRecords.filter(schedule_day__in=serializer.validated_data.get('days'))

            if TimeTableEntryRecords:
                responseData = []
                for item in TimeTableEntryRecords:
                    name_part = filter(None, [
                        item.professor.title,
                        item.professor.first_name,
                        item.professor.middle_name,
                        item.professor.last_name

                    ])
                    professor_name = " ".join(name_part)

                    data = {
                        'id': item.id,
                        'day': item.schedule_day,
                        'organization': item.organization.organization_description,
                        'branch': item.branch.branch_name,
                        'batch': item.batch.batch_code,
                        'course': item.course.course_name,
                        'department': item.department.department_description,
                        'academic_year': item.academic_year.academic_year_code,
                        'semester': item.semester.semester_code,
                        'section': item.section.section_name,
                        'subject': item.subject.subject_description,
                        'lecture_period': item.lecture_period.lecture_period_name,
                        'professor': professor_name,
                        # 'term': item.term_id.term_desc

                    }
                    responseData.append(data)
                return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)


        except ValidationError as e:

            return Response({'message': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Http404:

            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='GetTimeTableEntryDifSearchBasisList',

            message=error_message,

        )


class GetTimeTableEntryDestroyAPIView(DestroyAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = TimeTable.objects.all()
    serializer_class = TimeTableSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            time_table_id = request.query_params.get('time_table_id')
            # instance = self.get_object()
            instance = TimeTable.objects.get(organization=organization_id,branch=branch_id, id=time_table_id)
            if instance.is_active:
                instance.is_active = False
                instance.save()

                return Response({'message': 'success'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Time Table Record already Deactivated.'},
                                status=status.HTTP_400_BAD_REQUEST)

        except Http404:
            return Response({'message': 'record not found'}, status=status.HTTP_404_NOT_FOUND)


class GetTopicListAPIView(ListAPIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = GetTopicBasedOnSubjectWiseSerializer

    def list(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.query_params)
            serializer.is_valid(raise_exception=True)

            organization_id = serializer.validated_data.get('organization_id')
            branch_id = serializer.validated_data.get('branch_id')
            batch_id = serializer.validated_data.get('batch_id')
            course_id = serializer.validated_data.get('course_id')
            department_id = serializer.validated_data.get('department_id')
            academic_year_id = serializer.validated_data.get('academic_year_id')
            semester_id = serializer.validated_data.get('semester_id')
            section_id = serializer.validated_data.get('section_id')
            subject_id = serializer.validated_data.get('subject_id')

            # Get Topic List Based on Subject

            try:
                topic_list = SubjectTopic.objects.filter(
                    organization=organization_id,
                    branch_id=branch_id,
                    is_active=True
                )
            except:
                topic_list = None

            if batch_id:
                topic_list = SubjectTopic.objects.filter(batch = batch_id)

            if course_id:
                topic_list = SubjectTopic.objects.filter(course=course_id)

            if department_id:
                topic_list = SubjectTopic.objects.filter(department=department_id)

            if academic_year_id:
                topic_list = SubjectTopic.objects.filter(academic_year=academic_year_id)

            if semester_id:
                topic_list = SubjectTopic.objects.filter(semester=semester_id)

            if section_id:
                topic_list = SubjectTopic.objects.filter(section=section_id)

            if subject_id:
                topic_list = SubjectTopic.objects.filter(subject=subject_id)

            if topic_list:
                responseData = []

                for item in topic_list:
                    data = {
                        "topicId": item.topic_id,
                        "topic_name": item.topic_name
                    }
                    responseData.append(data)
                return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No record found'}, status=status.HTTP_204_NO_CONTENT)





        except ValidationError as e:

            return Response({'message': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Http404:

            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='GettopicListBasedOnSubject',

            message=error_message,

        )

class GetLecturePeriodList(APIView):
    def get(self, request, *args, **kwargs):
        organization_id = request.query_params.get('organization_id')
        branch_id = request.query_params.get('branch_id')

        if not (organization_id and branch_id):
            return Response({'message': 'Please provide required data !!!'}, status=status.HTTP_400_BAD_REQUEST)
        lecture_periods = LecturePeriod.objects.filter(organization=organization_id, branch=branch_id,is_active=True)
        serializer = LecturePeriod_Serializer(lecture_periods, many=True)
        return Response(serializer.data)


class LecturePlanCreateAPIView(CreateAPIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = LecturePlanAddSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Get Instances

            try:
                organizationInstance = Organization.objects.get(id=serializer.validated_data.get('organization_id'),
                                                                is_active=True)
            except Exception as e:
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            try:
                branchInstance = Branch.objects.get(id=serializer.validated_data.get('branch_id'), is_active=True)
            except Exception as e:
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            try:
                batchInstance = Batch.objects.get(id=serializer.validated_data.get('batch_id'), is_active=True)
            except Exception as e:
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            try:
                courseInstance = Course.objects.get(id=serializer.validated_data.get('course_id'), is_active=True)
            except Exception as e:
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            try:
                departmentInstance = Department.objects.get(id=serializer.validated_data.get('department_id'), is_active=True)
            except Exception as e:
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            try:
                academicYearInstance = AcademicYear.objects.get(
                    id=serializer.validated_data.get('academic_year_id'),
                    is_active=True)
            except Exception as e:
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            try:
                semesterInstance = Semester.objects.get(id=serializer.validated_data.get('semester_id'), is_active=True)
            except Exception as e:
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


            try:
                sectionInstance = Section.objects.get(id=serializer.validated_data.get('section_id'), is_active=True)
            except Exception as e:
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            try:
                professorInstance = EmployeeMaster.objects.get(id=serializer.validated_data.get('professor_id'),
                                                             is_active=True)
            except Exception as e:
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            # try:
            #     terminstance = SCH_TERM_MASTER.objects.get(Term_Id=serializer.validated_data.get('term_id'),
            #                                                is_active=True)
            # except Exception as e:
            #     return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            try:
                subject_instance = CourseDepartmentSubject.objects.get(id=serializer.validated_data.get('subject_id'),is_active=True)
            except CourseDepartmentSubject.DoesNotExist:
                return Response({'message': "CourseDepartmentSubject record not found !!!"}, status=status.HTTP_400_BAD_REQUEST)



            # Get How Many Records

            lecture_details_list = serializer.validated_data.get('lecture_details')

            for record in lecture_details_list:

                try:
                    SubjectTopicinstance = SubjectTopic.objects.get(
                        topic_id=record['topic_id'], is_active=True)
                except Exception as e:
                    return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

                LecturePlan.objects.create(
                    organization=organizationInstance,
                    branch=branchInstance,
                    batch=batchInstance,
                    course=courseInstance,
                    department=departmentInstance,
                    academic_year=academicYearInstance,
                    semester=semesterInstance,
                    section=sectionInstance,
                    subject=subject_instance,
                    professor=professorInstance,
                    lecture_no=record['lecture_no'],
                    module_no=record['module_no'],
                    topic=SubjectTopicinstance,
                    proposed_date=record['propose_date'],
                    created_by=serializer.validated_data.get('created_by')
                )

            return Response({'message': 'lesson plan created successfully !!!',}, status=status.HTTP_200_OK)

        except ValidationError as e:

            # Rollback the transaction on validation error

            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as e:

            # Rollback the transaction on database error

            self.log_exception(request, str(e))

            return Response({'error': 'A database error occurred: ' + str(e)},

                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        except Exception as e:

            # Rollback the transaction on any other exception

            self.log_exception(request, str(e))

            return Response({'error': f'An unexpected error occurred: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='LessionPlanCreate',

            message=error_message,

        )


class GetProfessorLecturePlanListAPIView(ListAPIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = GetTimeTableListBasedOnProfessorSubjectSerializer

    def list(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.query_params)
            serializer.is_valid(raise_exception=True)

            try:
                LecturePlanRecord = LecturePlan.objects.filter(

                    organization=serializer.validated_data.get('organization_id'),
                    branch=serializer.validated_data.get('branch_id'),
                    batch=serializer.validated_data.get('batch_id'),
                    course=serializer.validated_data.get('course_id'),
                    department=serializer.validated_data.get('department_id'),
                    academic_year=serializer.validated_data.get('academic_year_id'),
                    semester=serializer.validated_data.get('semester_id'),
                    section=serializer.validated_data.get('section_id'),
                    professor=serializer.validated_data.get('professor_id'),
                    # subject=serializer.validated_data.get('subject_id'),
                    # term_id=serializer.validated_data.get('term_id'),
                    # topicId_id= serializer.validated_data.get('subject_id'),
                    is_active=True
                )
            except:
                LecturePlanRecord = None

            if LecturePlanRecord:
                ResponseData = []
                for item in LecturePlanRecord:
                    data = {
                        'lecture_plan_id': item.lecture_plan_id,
                        'lecture_no': item.lecture_no,
                        'module_no': item.module_no,
                        'topic_details': item.topic.topic_name,
                        'proposed_date': item.proposed_date,
                        'taught_date': item.taught_date,
                        'percentage_completed': item.percentage_completed,
                        'remarks': item.remarks,
                        'document_file': request.build_absolute_uri(item.document_file) if item.document_file else None  # Return full URL
                    }

                    ResponseData.append(data)

                return Response({'message': 'success', 'data': ResponseData}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No Record Found'}, status=status.HTTP_204_NO_CONTENT)


        except ValidationError as e:

            return Response({'message': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Http404:

            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='GetTeacherlessonplanlist',

            message=error_message,

        )


class GetSubjectListBasedOnTermListAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GetSubjectListBasedOnTermSerializer

    def list(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.query_params)
            serializer.is_valid(raise_exception=True)

            try:
                subjectList_record = CourseDepartmentSubject.objects.filter(
                    academic_year_id=serializer.validated_data.get('academic_year_id'),
                    org_id=serializer.validated_data.get('org_id'),
                    branch_id=serializer.validated_data.get('branch_id'),
                    term_id=serializer.validated_data.get('term_id'),
                    is_active=True)
            except:
                subjectList_record = None

            # ckeck if record exist
            if subjectList_record:
                responseData = []
                for item in subjectList_record:
                    data = {
                        'subject_id': item.subject_master_id.id,
                        'subject_code': item.subject_master_id.subject_code
                    }

                    responseData.append(data)

                return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No record found'}, status=status.HTTP_204_NO_CONTENT)

        except ValidationError as e:

            return Response({'message': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Http404:

            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='GettermBasedOnSubjectlist',

            message=error_message,

        )


class ProfessorLectureUpdateAPIView(UpdateAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = LecturePlan.objects.filter(is_active=True)
    serializer_class = LecturePlanUpdateSerializer

    # Set lookup field to match your primary key
    # lookup_field = "LESSON_PLAN_ID"

    def update(self, request, *args, **kwargs):
        try:
            # Determine if this is a partial update
            # partial = kwargs.pop('partial', False)

            # Fetch the record based on LESSON_PLAN_ID (from URL)
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            lecture_plan_id = request.query_params.get('lecture_plan_id')
            instance = LecturePlan.objects.get(lecture_plan_id=lecture_plan_id,is_active=True)
            # instance = self.get_object()

            # Validate and update data
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)

            # Update The record
            instance.taught_date = serializer.validated_data.get('taught_date')
            instance.percentage_completed = serializer.validated_data.get('percentage_completed')
            instance.remarks = serializer.validated_data.get('remarks')
            instance.updated_by = serializer.validated_data.get('updated_by')
            
            # Handle file upload if present
            if 'document_file' in request.FILES:
                import os
                import uuid
                from django.conf import settings
                
                uploaded_file = request.FILES['document_file']
                
                # Create directory if it doesn't exist (use SWOSTITECH_CMS instead of media)
                upload_dir = os.path.join('SWOSTITECH_CMS', 'lesson_plan_documents')
                full_upload_dir = os.path.join(settings.BASE_DIR, upload_dir)
                os.makedirs(full_upload_dir, exist_ok=True)
                
                # Generate unique filename using UUID
                file_extension = os.path.splitext(uploaded_file.name)[1]
                unique_filename = f"{uuid.uuid4()}{file_extension}"
                
                # Save file
                file_path = os.path.join(full_upload_dir, unique_filename)
                with open(file_path, 'wb+') as destination:
                    for chunk in uploaded_file.chunks():
                        destination.write(chunk)
                
                # Store relative path in database
                instance.document_file = f'/SWOSTITECH_CMS/lesson_plan_documents/{unique_filename}'
            
            instance.updated_at = timezone.now()
            instance.save()

            return Response({'message': 'success', }, status=status.HTTP_200_OK)


        except Http404:
            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as e:
            self.log_exception(request, str(e))
            return Response({'error': 'A database error occurred.' + str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            self.log_exception(request, str(e))
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='GetTeacherlessonplanupdate',
            message=error_message,
        )


class TeacherLessonPlanSearchCriteriaListAPIView(ListAPIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = LecturePlanListSearchCriteriaSerializer

    def list(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.query_params)
            serializer.is_valid(raise_exception=True)

            try:
                professorLectureList = LecturePlan.objects.filter(
                    # academic_year_id=serializer.validated_data.get('academic_year_id'),
                    organization=serializer.validated_data.get('organization_id'),
                    branch=serializer.validated_data.get('branch_id'),
                    is_active=True)
            except:
                professorLectureList = None

            if professorLectureList:
                if serializer.validated_data.get('professor_id'):
                    professorLectureList = professorLectureList.filter(professor=serializer.validated_data.get('professor_id'))

                if serializer.validated_data.get('batch_id'):
                    professorLectureList = professorLectureList.filter(batch=serializer.validated_data.get('batch_id'))

                if serializer.validated_data.get('course_id'):
                    professorLectureList = professorLectureList.filter(course=serializer.validated_data.get('course_id'))

                if serializer.validated_data.get('department_id'):
                    professorLectureList = professorLectureList.filter(department=serializer.validated_data.get('department_id'))

                if serializer.validated_data.get('academic_year_id'):
                    professorLectureList = professorLectureList.filter(academic_year=serializer.validated_data.get('academic_year_id'))

                if serializer.validated_data.get('semester_id'):
                    professorLectureList = professorLectureList.filter(semester=serializer.validated_data.get('semester_id'))

                if serializer.validated_data.get('section_id'):
                    professorLectureList = professorLectureList.filter(section=serializer.validated_data.get('section_id'))

                # if serializer.validated_data.get('term_id'):
                #     professorLectureList = professorLectureList.filter(term_id=serializer.validated_data.get('term_id'))

                if serializer.validated_data.get('subject_id'):
                    professorLectureList = professorLectureList.filter(subject=serializer.validated_data.get('subject_id'))



                if professorLectureList:
                    ResponseData = []
                    for item in professorLectureList:
                        data = {
                            'LESSON_PLAN_ID': item.lecture_plan_id,
                            'lecture_no': item.lecture_no,
                            'module_no': item.module_no,
                            'topic_details': item.topic.topic_name,
                            'proposedDate': item.proposed_date,
                            'taught_date': item.taught_date,
                            'percentage_completed': item.percentage_completed,
                            'remarks': item.remarks
                        }

                        ResponseData.append(data)
                    return Response({'message': 'success', 'data': ResponseData}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'No Record Found'}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({'message': 'No Record Found'}, status=status.HTTP_204_NO_CONTENT)


        except Http404:

            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='Teacherlessonsearchlist',

            message=error_message,

        )