import base64
import mimetypes
import os
import uuid
from urllib.parse import urlparse
from datetime import datetime


from django.core.files.storage import default_storage
from django.db import DatabaseError
from django.db.models import Max, Q
from django.http import Http404
from django.shortcuts import render
from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView
from rest_framework.response import Response

from Acadix.models import ExceptionTrack, Organization, Batch, StudentCourse, StudentRegistration, Course, Semester, \
    Department, AcademicYear, Section, Branch
from GRIEVANCE.models import GrievanceType, GrievancePriority, GrievanceSeverity, Grievance
from GRIEVANCE.serializers import GrievanceTypeSerializer, GrievancePrioritySerializer, GrievanceSeveritySerializer, \
    GrievanceCreateSerializer, GetGrievanceByStudentSerializer, GetSearchedGrievanceSerializer, \
    GrievanceDetailsUpdateSerializer
from Swostitech_Acadix import settings


# Create your views here.

class GetGrievanceTypeListAPIView(ListAPIView):
    serializer_class = GrievanceTypeSerializer

    def list(self, request, *args, **kwargs):
        try:
            # Get SCH_GrievanceType List
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')

            if not (organization_id and branch_id):
                return Response({"message":"organization_id and branch_id is required !!!"},status=status.HTTP_400_BAD_REQUEST)

            try:
                GrievanceTypeRecord = GrievanceType.objects.filter(organization=organization_id,branch=branch_id,is_active=True)
            except:
                GrievanceTypeRecord= None


            if GrievanceTypeRecord:
                responseData = []
                for item in GrievanceTypeRecord:
                    data={
                        'grievance_type_id': item.id,
                        'grievance_type': item.grievance_type_code,
                        'grievance_type_description': item.grievance_type_description
                    }
                    responseData.append(data)

                return Response({'message':'success','data':responseData},status=status.HTTP_200_OK)
            else:
                return Response({'message':'Record Not found'},status=status.HTTP_200_OK)

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

            process_name='GrievanceTypeList',

            message=error_message,

        )


class GetGrievancePriorityListAPIView(ListAPIView):
    serializer_class = GrievancePrioritySerializer

    def list(self, request, *args, **kwargs):
        try:
            # Get SCH_GrievanceType List
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')

            if not (organization_id and branch_id):
                return Response({"message": "organization_id and branch_id is required !!!"},
                                status=status.HTTP_400_BAD_REQUEST)
            try:
                GrievancePriorityRecord = GrievancePriority.objects.filter(organization=organization_id,branch=branch_id,is_active=True)
            except:
                SCH_GrievancePriorityRecord= None


            if GrievancePriorityRecord:
                responseData = []
                for item in GrievancePriorityRecord:
                    data={
                        'grievance_priority_id': item.id,
                        'priority_type': item.priority_type,
                        'PriorityTypeDesc': item.priority_type_description
                    }
                    responseData.append(data)

                return Response({'message':'success','data':responseData},status=status.HTTP_200_OK)
            else:
                return Response({'message':'Record Not found'},status=status.HTTP_200_OK)

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

            process_name='GrievancePriorityList',

            message=error_message,

        )


class GetGrievanceSeverityListAPIView(ListAPIView):
    serializer_class = GrievanceSeveritySerializer

    def list(self, request, *args, **kwargs):
        try:
            # Get SCH_GrievanceType List
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')

            if not (organization_id and branch_id):
                return Response({"message": "organization_id and branch_id is required !!!"},
                                status=status.HTTP_400_BAD_REQUEST)
            try:
                SCH_GrievanceSeverityRecord = GrievanceSeverity.objects.filter(organization=organization_id,branch=branch_id,is_active=True)
            except:
                SCH_GrievanceSeverityRecord= None


            if SCH_GrievanceSeverityRecord:
                responseData = []
                for item in SCH_GrievanceSeverityRecord:
                    data={
                        'severity_id': item.id,
                        'severity_type': item.severity_type,
                        'severity_type_description': item.severity_type_description
                    }
                    responseData.append(data)

                return Response({'message':'success','data':responseData},status=status.HTTP_200_OK)
            else:
                return Response({'message':'Record Not found'},status=status.HTTP_200_OK)

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

            process_name='GrievanceSeverityList',

            message=error_message,

        )


class GrievanceCreateAPIView(CreateAPIView):

    serializer_class = GrievanceCreateSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Get Validate Data
            organization_id = serializer.validated_data.get('organization_id')
            branch_id = serializer.validated_data.get('branch_id')
            batch_id = serializer.validated_data.get('batch_id')
            course_id = serializer.validated_data.get('course_id')
            department_id = serializer.validated_data.get('department_id')
            academic_year_id = serializer.validated_data.get('academic_year_id')
            semester_id = serializer.validated_data.get('semester_id')
            section_id = serializer.validated_data.get('section_id')
            student_id=serializer.validated_data.get('student_id')
            grievance_type_id = serializer.validated_data.get('grievance_type_id')
            grievance_priority_id = serializer.validated_data.get('grievance_priority_id')
            grievance_severity_id = serializer.validated_data.get('grievance_severity_id')
            details = serializer.validated_data.get('details')
            anonymous = serializer.validated_data.get('is_anonymous')
            upload_file = serializer.validated_data.get('upload_file')
            created_by = serializer.validated_data.get('created_by')



            # Initialize file_name & file path
            file_name = None
            full_file_path = None

            # if not Anonymous:
            #     Student_Instance = REGISTRATIONBYSTUDENT.objects.get(id=created_by)
            # if upload_file:
                # Generate a Unique UUID string for upload file & image uniqueness
                # Generate a unique 8-character string using UUID
                # unique_string = str(uuid.uuid4())[:8]

                # Generate a dynamic folder and file path
                # folder_name = "GRIEVANCE_DOCUMENTS"

                # file_name = f"{os.path.splitext(upload_file.name)[0]}_{unique_string}{os.path.splitext(upload_file.name)[1]}"
                # file_path = os.path.join(folder_name, file_name)  # This is the relative file path

                # Get the full path relative to the media directory
                # full_file_path = os.path.join(settings.MEDIA_ROOT, file_path)

                # Ensure the directory exists
                # if not os.path.exists(os.path.dirname(full_file_path)):
                #     os.makedirs(os.path.dirname(full_file_path))

                # Save the file
                # with default_storage.open(full_file_path, 'wb+') as destination:
                #     for chunk in upload_file.chunks():
                #         destination.write(chunk)

            # Generate Grievance Number
            max_grievance_number = Grievance.objects.aggregate(Max('grievance_number')).get('grievance_number__max', 0) or 0

            # If no expense_no exists, start from 1
            next_grievance_number = (max_grievance_number + 1) if max_grievance_number else 1

            # Grievance Type Instance
            if grievance_type_id:
                try:
                    grievanceTypeInstance = GrievanceType.objects.get(id=grievance_type_id,is_active=True)
                except:
                    return Response({'message':'Grievance Type Not Found '},status=status.HTTP_404_NOT_FOUND)

            # GrievancePriority Instance
            if grievance_priority_id:
                try:
                    grievancePriorityInstance = GrievancePriority.objects.get(id=grievance_priority_id,is_active=True)
                except:
                    return Response({'message':'Grievance Priority Not Found '},status=status.HTTP_404_NOT_FOUND)

            # GrievanceSeverity Instance
            if grievance_severity_id:
                try:
                    grievanceSeverityInstance = GrievanceSeverity.objects.get(id=grievance_severity_id,is_active=True)
                except:
                    return Response({'message':'Grievance Severity Not Found '},status=status.HTTP_404_NOT_FOUND)

            # Organization Instance
            if organization_id:
                try:
                    OrganizationInstance = Organization.objects.get(id=organization_id,is_active=True)
                except:
                    return Response({'message': 'Organization  Not Found '}, status=status.HTTP_404_NOT_FOUND)

            # Branch Instance
            if branch_id:
                try:
                    BranchInstance = Branch.objects.get(id=branch_id, is_active=True)
                except:
                    return Response({'message': 'Branch Not Found '}, status=status.HTTP_404_NOT_FOUND)


            # Batch Instance
            if batch_id:
                try:
                    BatchInstance = Batch.objects.get(id=batch_id, is_active=True)
                except:
                    return Response({'message': 'Batch Not Found '}, status=status.HTTP_404_NOT_FOUND)

            # Course Instance
            if course_id:
                try:
                    CourseInstance = Course.objects.get(id=course_id, is_active=True)
                except:
                    return Response({'message': 'Course Not Found '}, status=status.HTTP_404_NOT_FOUND)

            # Department Instance
            if department_id:
                try:
                    DepartmentInstance = Department.objects.get(id=department_id, is_active=True)
                except:
                    return Response({'message': 'Department Not Found '}, status=status.HTTP_404_NOT_FOUND)

            # Academic year Instance
            if academic_year_id:
                try:
                    AcademicYearInstance = AcademicYear.objects.get(id=academic_year_id, is_active=True)
                except:
                    return Response({'message': 'AcademicYear Not Found '}, status=status.HTTP_404_NOT_FOUND)

            # Semester Instance
            if semester_id:
                try:
                    SemesterInstance = Semester.objects.get(id=semester_id, is_active=True)
                except:
                    return Response({'message': 'Semester Not Found '}, status=status.HTTP_404_NOT_FOUND)

            # Section Instance
            if section_id:
                try:
                    SectionInstance = Section.objects.get(id=section_id, is_active=True)
                except:
                    return Response({'message': 'Section Not Found '}, status=status.HTTP_404_NOT_FOUND)

            # Student Instance
            if student_id:
                try:
                    StudentCourseInstance = StudentCourse.objects.get(student=student_id, is_active=True)
                except:
                    return Response({'message': 'Student course record Not Found '}, status=status.HTTP_404_NOT_FOUND)

            # Create Grievance post
            # if anonymous:
            GrievanceCreateInstance = Grievance.objects.create(
                organization= StudentCourseInstance.organization,
                branch= StudentCourseInstance.branch,
                batch= StudentCourseInstance.batch,
                course= StudentCourseInstance.course,
                department= StudentCourseInstance.department,
                academic_year= StudentCourseInstance.academic_year,
                semester=StudentCourseInstance.semester,
                section=StudentCourseInstance.section,
                grievance_number= next_grievance_number,
                grievance_type = grievanceTypeInstance,
                grievance_priority= grievancePriorityInstance,
                grievance_severity = grievanceSeverityInstance,
                student_course = StudentCourseInstance,
                details =details,
                anonymous=anonymous,
                created_by = 1,
                updated_by = created_by,
                doc_name = file_name,
                doc_file=upload_file,
                doc_path = ''

            )

            GrievanceCreateInstance.doc_path = request.build_absolute_uri(GrievanceCreateInstance.doc_file.url)
            GrievanceCreateInstance.save()

            return Response({'message':'success'},status=status.HTTP_200_OK)
            # else StudentCourseInstance:
            #     GrievanceCreateInstance = Grievance.objects.create(
            #         organization=OrganizationInstance,
            #         branch=BranchInstance,
            #         batch=BatchInstance,
            #         course=CourseInstance,
            #         department=DepartmentInstance,
            #         academic_year=AcademicYearInstance,
            #         semester=SemesterInstance,
            #         section=SectionInstance,
            #         student_course=StudentCourseInstance,
            #         grievance_number=next_grievance_number,
            #         grievance_type=grievanceTypeInstance,
            #         grievance_priority=grievancePriorityInstance,
            #         grievance_severity=grievanceSeverityInstance,
            #         details=details,
            #         anonymous=anonymous,
            #         created_by=1,
            #         updated_by=created_by,
            #         doc_name=file_name,
            #         doc_file=upload_file,
            #         doc_path=''
            #     )

                # GrievanceCreateInstance.doc_path = request.build_absolute_uri(GrievanceCreateInstance.doc_file.url)
                # GrievanceCreateInstance.save()
                #
                # return Response({'message': 'success'}, status=status.HTTP_200_OK)

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

            return Response({'error': 'An unexpected error occurred: ' + str(e)},

                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='grievancecreate',

            message=error_message,

        )


class GrievanceDetailsByStudent(ListAPIView):
    serializer_class = GetGrievanceByStudentSerializer

    def list(self, request, *args, **kwargs):
        try:
            student_course_id = request.query_params.get('student_course_id')
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')


            # Get Posted Grievance by student
            try:
                GrievanceRecord = Grievance.objects.filter(
                    organization = organization_id,
                    branch= branch_id,
                    student_course = student_course_id,
                    is_active= True
                )

            except:
                GrievanceRecord= None

            if GrievanceRecord:
                responseData = []

                for item in GrievanceRecord:


                    data={
                        'Grievance_id': item.id,
                        'created_at': item.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                        'GrievanceNumber': item.grievance_number,
                        'GrievanceTypeId': item.grievance_type.id,
                        'GrievanceType': item.grievance_type.grievance_type_description,
                        'GrievancePriorityId': item.grievance_priority.id,
                        'GrievancePriority': item.grievance_priority.priority_type,
                        'GrievanceSeverityId': item.grievance_severity.id,
                        'GrievanceSeverity': item.grievance_severity.severity_type,
                        'details': item.details,
                        'ActionTaken': item.action_taken,
                        'ActionTakenDateTime': item.action_taken_date_time.strftime("%Y-%m-%d %H:%M:%S") if item.action_taken_date_time else None
                    }
                    responseData.append(data)

                return Response({'message':'success','data':responseData},status=status.HTTP_200_OK)
            else:
                return Response({'message':'No record Found'},status=status.HTTP_200_OK)

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

            process_name='GrievanceListByStudent',

            message=error_message,

        )


class GrievanceDetailsListAPIView(ListAPIView):
    serializer_class = GetSearchedGrievanceSerializer

    def list(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            batch_id = request.query_params.get('batch_id')
            student_id= request.query_params.get('student_id')
            course_id = request.query_params.get('course_id')
            section_id = request.query_params.get('section_id')
            grievance_type_id = request.query_params.get('grievance_type_id')
            grievance_priority_id = request.query_params.get('grievance_priority_id')
            grievance_security_id = request.query_params.get('grievance_security_id')
            from_date = request.query_params.get('from_date')
            to_date = request.query_params.get('to_date')
            status_data = request.query_params.get('status')
            student_name = request.query_params.get('student_name')


            # Get Filter Data
            try:
                filterdata = Grievance.objects.filter(organization=organization_id,branch=branch_id,is_active=True)
            except:
                filterdata= None

            if filterdata:
                if student_name:
                    # studentName = request.query_params.get('studentName')
                    name_parts = student_name.strip().split()
                    if len(name_parts) == 1:
                        first = name_parts[0].strip()
                        filterdata = filterdata.filter(
                            Q(student_course__student__first_name__icontains=first) | Q(student_course__student__middle_name__icontains=first) | Q(
                                student_course__student__last_name__icontains=first)
                            , is_active=True
                            ).order_by('-updated_at')

                    elif len(name_parts) == 2:  # First + Last
                        first, last = name_parts
                        filterdata = filterdata.filter(
                            Q(student_course__student__first_name__iexact=first, student_course__student__last_name__iexact=last) |
                            Q(student_course__student__first_name__iexact=first, student_course__student__middle_name__isnull=False, student_course__student__last_name__iexact=last)
                            , is_active=True
                        ).order_by('-updated_at')

                    elif len(name_parts) == 3:  # First + Middle + Last
                        first, middle, last = name_parts
                        filterdata = filterdata.filter(
                            student_course__student__first_name__iexact=first,
                            student_course__student__middle_name__iexact=middle,
                            student_course__student__last_name__iexact=last,
                            is_active=True
                        ).order_by('-updated_at')

                if status_data:
                    if status_data.strip().upper() == "Y":
                        filterdata= filterdata.filter(status=True)
                    elif status_data.strip().upper() == "N":
                        filterdata= filterdata.filter(status=False)
                if student_id:
                    filterdata = filterdata.filter(student_course__student_id=student_id)

                # if student_name:

                if grievance_type_id:
                    filterdata= filterdata.filter(GrievanceType= grievance_type_id)
                if grievance_priority_id:
                    filterdata= filterdata.filter(GrievancePriority=grievance_priority_id)
                if grievance_security_id:
                    filterdata= filterdata.filter(GrievanceSeverity=grievance_security_id)
                if from_date:
                    filterdata = filterdata.filter(created_at__gte=from_date)

                if to_date:
                    filterdata = filterdata.filter(created_at__lte= to_date)

                if course_id:
                    # Get student Ids in this class
                    # students = StudentCourse.objects.filter(
                    #     student__organization=organization_id,
                    #     student__batch=batch_id,
                    #     course=course_id,
                    #     is_active=True
                    # ).values_list('student', flat=True)  # Here academic year id not comming so that
                                                             # we expect is_active only specific
                    filterdata = filterdata.filter(course=course_id)
                    # filterdata = filterdata.filter(created_by__in=students)




                if section_id:
                    # Get student Ids in this class
                    # students = StudentCourse.objects.filter(
                    #     student__organization=organization_id,
                    #     student__batch=batch_id,
                    #     course=course_id,
                    #     section = section_id,
                    #     is_active=True
                    # ).values_list('student', flat=True)

                    filterdata = filterdata.filter(section=section_id)
                    # filterdata = filterdata.filter(created_by__in=students)




                if filterdata:
                    responseData=[]
                    for item in filterdata:

                        date_time = item.created_at
                        date = date_time.date()

                        # Get uploaded file

                        # upload_file_binary = None
                        # file_type= None
                        #
                        # if item.doc_path:
                        #     # document type
                        #     parsed = urlparse(item.doc_path)
                        #     relative_path = parsed.path.lstrip("/")
                        #     file_type, _ = mimetypes.guess_type(relative_path)
                        #
                        #     # make binary file
                        #     with open(relative_path, 'rb') as f:
                        #         binary_data = f.read()
                        #
                        #         upload_file_binary = base64.b64encode(binary_data).decode('utf-8')

                        # When user submit as a Anonymous User
                        if item.anonymous:

                            data={
                                'Grievance_id': item.id,
                                'GrievanceNumber': item.grievance_number,
                                'student_name':"Anonymous",
                                'organization_id':item.organization.id,
                                'organization_description': item.organization.organization_description,
                                'branch_id': item.branch.id,
                                'branch_name': item.branch.branch_name,
                                'batch_id': item.batch.id,
                                'batch_name': item.batch.batch_code,
                                'course_id': item.course.id,
                                'course_name':item.course.course_name,
                                'department_id': item.department.id,
                                'department_name': item.department.department_description,
                                'academic_year_id': item.academic_year.id,
                                'academic_year': item.academic_year.academic_year_code,
                                'semester_id':item.semester.id,
                                'semester':item.semester.semester_description,
                                'section_id': item.section.id,
                                'section': item.section.section_name,
                                'barcode':None,
                                'GrievanceType': item.grievance_type.grievance_type_description,
                                'GrievancePriority': item.grievance_priority.priority_type,
                                'GrievanceSeverity': item.grievance_severity.severity_type,
                                'details': item.details,
                                'submitted_date': date.strftime("%Y-%m-%d"),
                                # 'submitted_date': item.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                                # 'file_type':file_type,
                                # 'upload_file_binary':upload_file_binary,
                                'file_path':item.doc_path,
                                'ActionTaken': item.action_taken,
                                'ActionTakenDateTime': item.action_taken_date_time.strftime(
                                    "%Y-%m-%d %H:%M:%S") if item.action_taken_date_time else None,
                                'status': item.status
                            }
                        # elif item.student_course:
                        # # elif student_id or course_id or section_id:
                        #     # Get Student current class
                        #     try:
                        #         REGISTRATIONBYSTUDENT_Instance = StudentRegistration.objects.get(id=item.student_course.student.id,is_active=True)
                        #         StudentCourseInstance = StudentCourse.objects.get(id=item.student_course.id,is_active=True)
                        #         # course_instance = Course.objects.get(id=REGISTRATIONBYSTUDENT_Instance.course.id)
                        #         # course_name = course_instance.course_name
                        #         # section_instance = Section.objects.get(id=REGISTRATIONBYSTUDENT_Instance.section.id)
                        #         # section_Name = section_instance.section_name
                        #
                        #
                        #     except Exception as e:
                        #         return Response({'message':'Student Details Not Found'+ str(e)},status=status.HTTP_404_NOT_FOUND)
                        #
                        #     # Student Name construct
                        #     name_part = filter(None, [
                        #         REGISTRATIONBYSTUDENT_Instance.first_name,
                        #         REGISTRATIONBYSTUDENT_Instance.middle_name,
                        #         REGISTRATIONBYSTUDENT_Instance.last_name
                        #
                        #     ])
                        #     student_name = " ".join(name_part)
                        #
                        #
                        #
                        #     # Make Response
                        #     data = {
                        #         'Grievance_id': item.id,
                        #         'GrievanceNumber': item.grievance_number,
                        #         'student_name': student_name,
                        #         'course_name': StudentCourseInstance.course.course_name,
                        #         'department_name':StudentCourseInstance.department.department_description,
                        #         'academic_year':StudentCourseInstance.academic_year.academic_year_code,
                        #         'semester_name': StudentCourseInstance.semester.semester_description,
                        #         'section_Name': StudentCourseInstance.section.section_name,
                        #         'barcode': REGISTRATIONBYSTUDENT_Instance.barcode,
                        #         'GrievanceType': item.grievance_type.grievance_type_description,
                        #         'GrievancePriority': item.grievance_priority.priority_type,
                        #         'GrievanceSeverity': item.grievance_severity.severity_type,
                        #         'details': item.details,
                        #         'submitted_date': item.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                        #         # 'file_type': file_type,
                        #         # 'upload_file_binary': upload_file_binary,
                        #         'file_path': item.doc_path,
                        #         'status': item.status
                        #     }
                        else:
                            try:
                                # REGISTRATIONBYSTUDENT_Instance = StudentRegistration.objects.get(id=item.created_by,is_active=True)
                                # course_instance = Course.objects.get(id=REGISTRATIONBYSTUDENT_Instance.course.id)
                                # course_name = course_instance.course_name
                                # section_instance = Section.objects.get(id=REGISTRATIONBYSTUDENT_Instance.section.id)
                                # section_name = section_instance.section_name

                                # Student Name construct
                                name_part = filter(None, [
                                    item.student_course.student.first_name,
                                    item.student_course.student.middle_name,
                                    item.student_course.student.last_name

                                ])
                                student_name = " ".join(name_part)


                            except Exception as e:
                                return Response({'message':'Student Details Not Found'+ str(e)},status=status.HTTP_404_NOT_FOUND)
                            data = {
                                'Grievance_id': item.id,
                                'GrievanceNumber': item.grievance_number,
                                'student_name': student_name,
                                'organization_id':item.organization.id,
                                'organization_description': item.organization.organization_description,
                                'branch_id': item.branch.id,
                                'branch_name': item.branch.branch_name,
                                'batch_id': item.batch.id,
                                'batch_name': item.batch.batch_code,
                                'course_id': item.course.id,
                                'course_name':item.course.course_name,
                                'department_id': item.department.id,
                                'department_name': item.department.department_description,
                                'academic_year_id': item.academic_year.id,
                                'academic_year': item.academic_year.academic_year_code,
                                'semester_id':item.semester.id,
                                'semester':item.semester.semester_description,
                                'section_id': item.section.id,
                                'section': item.section.section_name,
                                'barcode':None,
                                'GrievanceType': item.grievance_type.grievance_type_description,
                                'GrievancePriority': item.grievance_priority.priority_type,
                                'GrievanceSeverity': item.grievance_severity.severity_type,
                                'details': item.details,
                                'submitted_date':date.strftime("%Y-%m-%d"),
                                # 'submitted_date': item.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                                # 'file_type': file_type,
                                # 'upload_file_binary': upload_file_binary,
                                'file_path': item.doc_path,
                                'ActionTaken': item.action_taken,
                                'ActionTakenDateTime': item.action_taken_date_time.strftime("%Y-%m-%d %H:%M:%S") if item.action_taken_date_time else None,
                                'status': item.status
                            }

                        responseData.append(data)
                    return Response({'message':'success','data':responseData},status=status.HTTP_200_OK)

                else:
                    return Response({'message':'No record found'},status=status.HTTP_200_OK)


            else:
                return Response({'message':'No Record Found'},status=status.HTTP_200_OK)
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

            process_name='GrievanceDetailsList',

            message=error_message,

        )


class GrievanceDetailsUpdateAPIView(UpdateAPIView):

    serializer_class =GrievanceDetailsUpdateSerializer

    def update(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            grievance_ids= serializer.validated_data.get("grievance_ids")
            updated_by_list = serializer.validated_data.get("updated_by_list")
            # action_taken_list = serializer.validated_data.get("action_taken_list")
            status_list = serializer.validated_data.get("status_list")

            if not grievance_ids:
                return Response({'message':'Please provide Grievance_id'},status=status.HTTP_400_BAD_REQUEST)

            if not updated_by_list:
                return Response({'message':'Please provide updated_by Id'},status=status.HTTP_400_BAD_REQUEST)

            if not status_list:
                return Response({'message':'Please provide your status_list'},status=status.HTTP_400_BAD_REQUEST)



            for grievance_id, updated_by, grievance_status in zip(grievance_ids,updated_by_list,status_list):
                if grievance_id:

                    # Get Grievance Instance
                    try:
                        GrievanceInstance = Grievance.objects.get(id=grievance_id, is_active=True)
                    except:
                        return Response({'message': 'Grievance not exist'}, status=status.HTTP_404_NOT_FOUND)

                    # GrievanceInstance.action_taken = "Resolved" if grievance_status else "Pending"
                    if  grievance_status :
                        GrievanceInstance.action_taken = "Pending"
                    else:
                        GrievanceInstance.action_taken = "Resolved"

                    GrievanceInstance.action_taken_by = updated_by

                    GrievanceInstance.action_taken_date_time = timezone.now()

                    GrievanceInstance.status= grievance_status

                    GrievanceInstance.save()

                else:
                    return Response({'message':'No Record Found'},status=status.HTTP_404_NOT_FOUND)
            return Response({'message': 'success'}, status=status.HTTP_200_OK)
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
            process_name='GrievanceActionTakenUpdate',
            message=error_message,
        )






