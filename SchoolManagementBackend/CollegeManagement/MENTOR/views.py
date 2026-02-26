from django.db import DatabaseError, transaction
from django.http import Http404
from django.shortcuts import render
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.response import Response

from Acadix.models import EmployeeMaster, AcademicYear, Organization, Branch, StudentCourse, ExceptionTrack, \
    StudentRegistration, Course, Batch, Department, Semester, Section
from MENTOR.models import StudentMentor, StudentCommunication
from MENTOR.serializers import StudentMentorAssignSerializer, StudentMentorSearchSerializer, \
    StudentAssignListBasedOnMentorSerializer, StudentMentorCommunicationSerializer, \
    StudentCommunicationSearchListSerializer, StudentDetailsBarcodeRegistrationSearchSerializer


# Create your views here.

class StudentMentorAssignCreateAPIView(CreateAPIView):
    serializer_class = StudentMentorAssignSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Get validated data
            organization_id = serializer.validated_data.get('organization_id')
            branch_id = serializer.validated_data.get('branch_id')
            batch_id = serializer.validated_data.get('batch_id')
            course_id = serializer.validated_data.get('course_id')
            department_id = serializer.validated_data.get('department_id')
            academic_year_id = serializer.validated_data.get('academic_year_id')
            semester_id = serializer.validated_data.get('semester_id')
            section_id = serializer.validated_data.get('section_id')
            professor_id = serializer.validated_data.get('professor_id')
            student_ids = serializer.validated_data.get('student_ids')
            date = serializer.validated_data.get('date')
            created_by = serializer.validated_data.get('created_by')

            # Validate required fields
            required_fields = [
                ('organization_id', organization_id),
                ('branch_id', branch_id),
                ('batch_id', batch_id),
                ('course_id', course_id),
                ('department_id', department_id),
                ('academic_year_id', academic_year_id),
                ('semester_id', semester_id),
                ('section_id', section_id),
                ('professor_id', professor_id),
                ('student_ids', student_ids),
                ('date', date),
                ('created_by', created_by)
            ]

            for field_name, value in required_fields:
                if not value:
                    return Response(
                        {"error": f"{field_name} is required !!!"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Fetch instances
            EmployeeInstance = EmployeeMaster.objects.get(id=professor_id, is_active=True)
            academicyearInstance = AcademicYear.objects.get(id=academic_year_id, is_active=True)
            OrganizationInstance = Organization.objects.get(id=organization_id, is_active=True)
            branchInstance = Branch.objects.get(id=branch_id, is_active=True)
            batchInstance = Batch.objects.get(id=batch_id, is_active=True)
            courseInstance = Course.objects.get(id=course_id, is_active=True)
            departmentInstance = Department.objects.get(id=department_id, is_active=True)
            semesterInstance = Semester.objects.get(id=semester_id, is_active=True)
            sectionInstance = Section.objects.get(id=section_id, is_active=True)

            already_assigned = []

            with transaction.atomic():
                for student_course_id in student_ids:
                    Student_Course_Instance = StudentCourse.objects.get(id=student_course_id, is_active=True)
                    Student_Instance = StudentRegistration.objects.get(id=Student_Course_Instance.student.id,
                                                                       is_active=True)

                    # Use get_or_create to prevent duplicates
                    obj, created = StudentMentor.objects.get_or_create(
                        student=Student_Instance,
                        professor=EmployeeInstance,
                        academic_year=academicyearInstance,
                        defaults={
                            'organization': OrganizationInstance,
                            'branch': branchInstance,
                            'batch': batchInstance,
                            'course': courseInstance,
                            'department': departmentInstance,
                            'semester': semesterInstance,
                            'section': sectionInstance,
                            'student_course': Student_Course_Instance,
                            'date': date,
                            'created_by': created_by
                        }
                    )

                    if not created:
                        already_assigned.append({
                            "student_id": Student_Instance.id,
                            "student_name": Student_Instance.first_name
                        })

            if already_assigned:
                return Response(
                    {
                        'message': 'Some students were already assigned to a mentor:',
                        'already_assigned': already_assigned
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response({'message': 'Mentor assignment successful'}, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            self.log_exception(request, str(e))
            return Response(
                {'error': 'An unexpected error occurred: ' + str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def log_exception(self, request, error_message):
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:100],
                process_name='studentmentorAssign',
                message=str(error_message)[:200] if error_message else '',
            )
        except Exception:
            # Avoid secondary failures
            pass


from django.http import Http404
from django.db.models import Q
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView, DestroyAPIView
from rest_framework.response import Response

from Acadix.models import (
    Organization,
    Branch,
    AcademicYear,
    EmployeeMaster,
    StudentRegistration,
    ExceptionTrack,
)
from .models import Mentor, StudentMentorAssignment, MentorStudentCommunication
from .serializers import (
    MentorSerializer,
    MentorListSerializer,
    StudentMentorAssignmentCreateSerializer,
    StudentMentorAssignmentListSerializer,
    MentorWithStudentsSerializer,
    StudentMentorAssignmentDeleteSerializer,
    MentorStudentCommunicationCreateSerializer,
    MentorStudentCommunicationListSerializer,
    MentorStudentCommunicationSearchSerializer,
    MentorWiseStudentSerializer,
)


class MentorListCreateAPIView(ListCreateAPIView):
    queryset = Mentor.objects.all()
    serializer_class = MentorSerializer

    def get_serializer_class(self):
        if self.request.method == "GET":
            return MentorListSerializer
        return MentorSerializer


class MentorRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Mentor.objects.all()
    serializer_class = MentorSerializer


class StudentMentorAssignAPIView(ListAPIView):
    """
    POST: Assign a mentor (teacher) to one or more students.
    GET: Optional listing of assignments filtered by query params.
    """

    serializer_class = StudentMentorAssignmentListSerializer

    def get_queryset(self):
        queryset = StudentMentorAssignment.objects.filter(is_active=True)

        mentor_id = self.request.query_params.get("mentor_id")
        student_id = self.request.query_params.get("student_id")
        academic_year_id = self.request.query_params.get("academic_year_id")

        if mentor_id:
            queryset = queryset.filter(mentor_id=mentor_id)
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        if academic_year_id:
            queryset = queryset.filter(academic_year_id=academic_year_id)

        return queryset

    def post(self, request, *args, **kwargs):
        try:
            payload_serializer = StudentMentorAssignmentCreateSerializer(data=request.data)
            payload_serializer.is_valid(raise_exception=True)
            data = payload_serializer.validated_data

            org_id = data["org_id"]
            branch_id = data["branch_id"]
            academic_year_id = data["academic_year_id"]
            assignment_date = data["date"]
            teacher_id = data["teacher_id"]
            student_ids = data["student_id"]
            created_by = data["created_by"]

            # Validate org/branch/academic year
            try:
                organization = Organization.objects.get(id=org_id)
                branch = Branch.objects.get(id=branch_id)
                academic_year = AcademicYear.objects.get(id=academic_year_id)
            except (Organization.DoesNotExist, Branch.DoesNotExist, AcademicYear.DoesNotExist):
                return Response(
                    {"message": "Invalid organization_id, branch_id or academic_year_id"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get or create mentor profile for given teacher (EmployeeMaster)
            try:
                employee = EmployeeMaster.objects.get(id=teacher_id, is_active=True)
            except EmployeeMaster.DoesNotExist:
                return Response(
                    {"message": "Teacher/mentor not found"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            mentor, _ = Mentor.objects.get_or_create(
                organization=organization,
                branch=branch,
                employee=employee,
                defaults={"created_by": created_by},
            )

            created_assignments = []
            skipped_students = []

            for sid in student_ids:
                try:
                    student = StudentRegistration.objects.get(
                        id=sid,
                        organization=organization,
                        branch=branch,
                        is_active=True,
                    )
                except StudentRegistration.DoesNotExist:
                    # Skip invalid student IDs but continue processing others
                    skipped_students.append({
                        'student_id': sid,
                        'reason': 'Student not found or inactive'
                    })
                    continue

                # Check if an active assignment already exists for this student-mentor-academic_year
                existing_assignment = StudentMentorAssignment.objects.filter(
                    organization=organization,
                    branch=branch,
                    academic_year=academic_year,
                    mentor=mentor,
                    student=student,
                    is_active=True,
                    status='ACTIVE'
                ).first()

                if existing_assignment:
                    # Assignment already exists - skip it
                    skipped_students.append({
                        'student_id': sid,
                        'student_name': f"{student.first_name} {student.last_name}".strip(),
                        'reason': 'Already assigned to this mentor for this academic year'
                    })
                    continue

                # Create new assignment only if it doesn't exist
                assignment = StudentMentorAssignment.objects.create(
                    organization=organization,
                    branch=branch,
                    academic_year=academic_year,
                    mentor=mentor,
                    student=student,
                    assignment_date=assignment_date,
                    is_primary=True,
                    status="ACTIVE",
                    remarks="",
                    is_active=True,
                    created_by=created_by,
                )
                created_assignments.append(assignment)

            if not created_assignments:
                return Response(
                    {
                        "message": "No new student assignments created",
                        "skipped": skipped_students,
                        "reason": "All students are already assigned to this mentor or invalid student IDs"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            response_serializer = StudentMentorAssignmentListSerializer(
                created_assignments, many=True
            )

            response_data = {
                "message": "success",
                "data": response_serializer.data,
            }

            # Include skipped students info if any
            if skipped_students:
                response_data["skipped"] = skipped_students
                response_data[
                    "message"] = f"Successfully assigned {len(created_assignments)} student(s). {len(skipped_students)} student(s) were skipped (already assigned or invalid)."

            return Response(
                response_data,
                status=status.HTTP_201_CREATED,
            )

        except Http404:
            return Response(
                {"message": "Record not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response(
                {"error": error_message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def log_exception(self, request, error_message: str) -> None:
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:100],
                process_name="StudentMentorAssign",
                message=error_message[:200] if error_message else '',
            )
        except Exception:
            # Avoid secondary failures
            pass


class MentorWithStudentsListAPIView(ListAPIView):
    """
    GET: List all mentors with their assigned students.
    Useful for showing main table in "Add Mentor" UI.

    Query params (all optional):
    - organization_id: Filter by organization
    - branch_id: Filter by branch
    - academic_year_id: Filter by academic year
    - student_id: Filter to show only mentors assigned to this student
    - mentor_id: Filter to show only this specific mentor
    - teacher_id: Filter to show only this teacher/mentor (EmployeeMaster ID)
    """

    serializer_class = MentorWithStudentsSerializer

    def list(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            academic_year_id = request.query_params.get('academic_year_id')
            student_id = request.query_params.get('student_id')
            mentor_id = request.query_params.get('mentor_id')
            teacher_id = request.query_params.get('teacher_id')

            # Get active assignments first (needed for student_id filtering)
            assignments_queryset = StudentMentorAssignment.objects.filter(
                is_active=True,
                status='ACTIVE'
            )

            if organization_id:
                assignments_queryset = assignments_queryset.filter(organization_id=organization_id)
            if branch_id:
                assignments_queryset = assignments_queryset.filter(branch_id=branch_id)
            if academic_year_id:
                assignments_queryset = assignments_queryset.filter(academic_year_id=academic_year_id)
            if student_id:
                assignments_queryset = assignments_queryset.filter(student_id=student_id)

            # Determine which mentors to show
            if student_id:
                # If filtering by student_id, get only mentors assigned to that student
                mentor_ids = assignments_queryset.values_list('mentor_id', flat=True).distinct()
                mentors_queryset = Mentor.objects.filter(
                    id__in=mentor_ids,
                    is_active=True
                )
            elif mentor_id:
                # Filter by specific mentor_id
                mentors_queryset = Mentor.objects.filter(id=mentor_id, is_active=True)
            elif teacher_id:
                # Filter by teacher_id (EmployeeMaster ID)
                mentors_queryset = Mentor.objects.filter(
                    employee_id=teacher_id,
                    is_active=True
                )
            else:
                # Base queryset: all active mentors
                mentors_queryset = Mentor.objects.filter(is_active=True)

            # Apply org/branch filters to mentors queryset
            if organization_id:
                mentors_queryset = mentors_queryset.filter(organization_id=organization_id)
            if branch_id:
                mentors_queryset = mentors_queryset.filter(branch_id=branch_id)

            response_data = []
            for mentor in mentors_queryset:
                # Get assignments for this mentor (already filtered by student_id if provided)
                mentor_assignments = assignments_queryset.filter(mentor=mentor)

                # Build student list
                assigned_students = []
                for assignment in mentor_assignments:
                    student = assignment.student

                    # Get course/section from StudentCourse if available
                    from Acadix.models import StudentCourse
                    course_name = None
                    section_name = None
                    try:
                        student_course = StudentCourse.objects.filter(
                            student=student,
                            is_active=True
                        ).order_by('-created_at').first()
                        if student_course:
                            course_name = student_course.course.course_name if student_course.course else None
                            section_name = student_course.section.section_name if student_course.section else None
                    except:
                        pass

                    student_name_parts = [
                        student.first_name,
                        student.middle_name,
                        student.last_name
                    ]
                    student_name = " ".join(p for p in student_name_parts if p)

                    assigned_students.append({
                        'assignment_id': assignment.id,
                        'student_id': student.id,
                        'student_name': student_name,
                        'admission_no': student.admission_no,
                        'college_admission_no': student.college_admission_no,
                        'barcode': student.barcode,
                        'course_name': course_name,
                        'section_name': section_name,
                        'father_name': student.father_name,
                        'mother_name': student.mother_name,
                        'assignment_date': assignment.assignment_date,
                        'status': assignment.status,
                        'is_primary': assignment.is_primary,
                    })

                # Build mentor employee name
                employee = mentor.employee
                mentor_name_parts = [
                    employee.title,
                    employee.first_name,
                    employee.middle_name,
                    employee.last_name
                ]
                mentor_name = " ".join(p for p in mentor_name_parts if p)

                mentor_data = {
                    'mentor_id': mentor.id,
                    'mentor_name': mentor_name,
                    'employee_code': employee.employee_code,
                    'employee_id': employee.id,
                    'mentor_email': employee.email,
                    'mentor_phone': employee.phone_number,
                    'department_id': mentor.department.id if mentor.department else None,
                    'department_name': mentor.department.department_description if mentor.department else None,
                    'max_students': mentor.max_students,
                    'current_student_count': len(assigned_students),
                    'assigned_students': assigned_students,
                }

                response_data.append(mentor_data)

            return Response(
                {'message': 'success', 'data': response_data},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response(
                {'error': error_message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def log_exception(self, request, error_message: str) -> None:
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:100],
                process_name="MentorWithStudentsList",
                message=error_message[:200] if error_message else '',
            )
        except Exception:
            # Avoid secondary failures
            pass


class StudentMentorAssignSearchListAPIView(ListAPIView):
    serializer_class = StudentMentorSearchSerializer

    def list(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.query_params)
            serializer.is_valid(raise_exception=True)
            validated_data = serializer.validated_data

            organization_id = validated_data.get('organization_id')
            branch_id = validated_data.get('branch_id')
            batch_id = validated_data.get('batch_id')
            course_id = validated_data.get('course_id')
            department_id = validated_data.get('department_id')
            academic_year_id = validated_data.get('academic_year_id')
            semester_id = validated_data.get('semester_id')
            section_id = validated_data.get('section_id')
            professor_id = validated_data.get('professor_id')
            student_id = validated_data.get('student_id')

            # academicyearId = self.request.query_params.get('academic_year_id')
            # orgId = self.request.query_params.get('org_id')
            # branchId = self.request.query_params.get('branch_id')
            # teacherId = self.request.query_params.get('teacher_id')
            # studentId = self.request.query_params.get('student_id')
            #
            # if not academicyearId:
            #     return Response({'message': 'Please Provide academicyearId'}, status=status.HTTP_400_BAD_REQUEST)
            #
            # if not orgId:
            #     return Response({'message': 'Please Provide orgId'}, status=status.HTTP_400_BAD_REQUEST)
            #
            # if not branchId:
            #     return Response({'message': 'Please Provide branchId'}, status=status.HTTP_400_BAD_REQUEST)

            # Filter the record
            try:
                filterdata = StudentMentor.objects.filter(academic_year=academic_year_id, organization=organization_id,
                                                          branch=branch_id, is_active=True)
            except:
                filterdata = None

            if filterdata:
                if professor_id:
                    filterdata = filterdata.filter(professor=professor_id)

                if student_id:
                    filterdata = filterdata.filter(student_course__student=student_id)

                if filterdata:
                    responseData = []
                    for item in filterdata:
                        print(item.student_course, type(item.student_course.id))
                        # Get Current academic year Instance
                        try:
                            studentCourseInstance = StudentCourse.objects.get(id=item.student_course.id,
                                                                              is_active=True)
                        except Exception as e:
                            return Response({'message': 'Student Details Not Found' + str(e)},
                                            status=status.HTTP_404_NOT_FOUND)

                        # Student Name construct
                        name_part = filter(None, [
                            studentCourseInstance.student.first_name,
                            studentCourseInstance.student.middle_name,
                            studentCourseInstance.student.last_name

                        ])
                        student_name = " ".join(name_part)

                        # mentor name construct
                        name_part = filter(None, [
                            item.professor.title,
                            item.professor.first_name,
                            item.professor.middle_name,
                            item.professor.last_name

                        ])
                        teacher_name = " ".join(name_part)

                        data = {
                            'organization_id': organization_id,
                            'branch_id': branch_id,
                            'batch_id': batch_id,
                            'course_id': course_id,
                            'department_id': department_id,
                            'academic_year_id': academic_year_id,
                            'semester_id': semester_id,
                            'student_id': student_id,

                            'course_name': studentCourseInstance.course.course_name,
                            'section_name': studentCourseInstance.section.section_name,
                            'enrollment_no': studentCourseInstance.enrollment_no,
                            'studentname': student_name,
                            'registration_no': studentCourseInstance.student.registration_no,
                            'barcode': studentCourseInstance.student.barcode,
                            'father_name': studentCourseInstance.student.father_name,
                            'professor_id': professor_id
                        }

                        responseData.append(data)

                    return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)

                else:
                    return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)

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
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:100],
                process_name='studentmentorAssignList',
                message=str(error_message)[:200] if error_message else '',
            )
        except Exception:
            # Avoid secondary failures
            pass


class StudentAssignListBasedOnMentorListAPIView(ListAPIView):
    serializer_class = StudentAssignListBasedOnMentorSerializer

    def list(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            batch_id = request.query_params.get('batch_id')
            course_id = request.query_params.get('course_id')
            department_id = request.query_params.get('department_id')
            academic_year_id = request.query_params.get('academic_year_id')
            semester_id = request.query_params.get('semester_id')
            section_id = request.query_params.get('section_id')
            professor_id = request.query_params.get('professor_id')

            if not organization_id:
                return Response({'message': 'Please Provide organization_id'}, status=status.HTTP_400_BAD_REQUEST)

            if not branch_id:
                return Response({'message': 'Please Provide branch_id'}, status=status.HTTP_400_BAD_REQUEST)

            if not batch_id:
                return Response({'message': 'Please Provide batch_id'}, status=status.HTTP_400_BAD_REQUEST)

            if not course_id:
                return Response({'message': 'Please Provide course_id'}, status=status.HTTP_400_BAD_REQUEST)

            if not department_id:
                return Response({'message': 'Please Provide department_id'}, status=status.HTTP_400_BAD_REQUEST)

            if not academic_year_id:
                return Response({'message': 'Please Provide academic_year_id'}, status=status.HTTP_400_BAD_REQUEST)

            if not semester_id:
                return Response({'message': 'Please Provide semester_id'}, status=status.HTTP_400_BAD_REQUEST)

            if not section_id:
                return Response({'message': 'Please Provide section_id'}, status=status.HTTP_400_BAD_REQUEST)

            if not professor_id:
                return Response({'message': 'Please Provide professor_id'}, status=status.HTTP_400_BAD_REQUEST)

            # Filter all assign record with teacher Id
            try:
                STUDENT_MENTOR_Record = StudentMentor.objects.filter(professor=professor_id,
                                                                     academic_year=academic_year_id,
                                                                     organization=organization_id,
                                                                     branch=branch_id, is_active=True)
            except:
                STUDENT_MENTOR_Record = None

            if STUDENT_MENTOR_Record:
                responseData = []
                for item in STUDENT_MENTOR_Record:
                    # Student Name construct
                    name_part = filter(None, [
                        item.student.first_name,
                        item.student.middle_name,
                        item.student.last_name

                    ])
                    student_name = " ".join(name_part)

                    name_part = filter(None, [
                        item.professor.first_name,
                        item.professor.middle_name,
                        item.professor.last_name

                    ])
                    professor_name = " ".join(name_part)

                    data = {
                        'mentor_name': professor_name,
                        'student_id': item.student.id,
                        'student_name': student_name
                    }

                    responseData.append(data)

                return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)




        except Http404:

            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)



        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:100],
                process_name='MentorWiseStudentList',
                message=str(error_message)[:200] if error_message else '',
            )
        except Exception:
            # Avoid secondary failures
            pass


class StudentMentorCommunicationCreateAPIView(CreateAPIView):
    serializer_class = StudentMentorCommunicationSerializer

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
            student_id = serializer.validated_data.get('student_id')
            communicated_with = serializer.validated_data.get('communicated_with')
            communicated_via = serializer.validated_data.get('communicated_via')
            remarks = serializer.validated_data.get('remarks')
            # created_by = serializer.validated_data.get('created_by')
            date = serializer.validated_data.get('date')
            professor_id = serializer.validated_data.get('professor_id')
            # Get STUDENT_MENTOR Instance
            try:
                STUDENT_MENTOR_INSTANCE = StudentMentor.objects.get(professor=professor_id, student=student_id,
                                                                    academic_year=academic_year_id,
                                                                    organization=organization_id,
                                                                    branch=branch_id, is_active=True)

            except:
                return Response(
                    {'message': 'provides Student teacher combination not matched on this particular academic year'},
                    status=status.HTTP_400_BAD_REQUEST)

            # Insert Data Into Database
            STUDENT_COMMUNICATION_INSTANCE = StudentCommunication.objects.create(
                organization=Organization.objects.get(id=organization_id) if organization_id else Response(
                    {"error": "organization_id is required !!!"}, status=status.HTTP_400_BAD_REQUEST),
                branch=Branch.objects.get(id=branch_id) if branch_id else Response(
                    {"error": "branch_id is required !!!"}, status=status.HTTP_400_BAD_REQUEST),
                batch=Batch.objects.get(id=batch_id) if batch_id else Response({"error": "batch_id is required !!!"},
                                                                               status=status.HTTP_400_BAD_REQUEST),
                course=Course.objects.get(id=course_id) if course_id else Response(
                    {"error": "course_id is required !!!"}, status=status.HTTP_400_BAD_REQUEST),
                department=Department.objects.get(id=department_id) if department_id else Response(
                    {"error": "department_id is required !!!"}, status=status.HTTP_400_BAD_REQUEST),
                academic_year=AcademicYear.objects.get(id=academic_year_id) if academic_year_id else Response(
                    {"error": "academic_id is required !!!"}, status=status.HTTP_400_BAD_REQUEST),
                semester=Semester.objects.get(id=semester_id) if semester_id else Response(
                    {"error": "semester_id is required !!!"}, status=status.HTTP_400_BAD_REQUEST),
                section=Section.objects.get(id=section_id) if section_id else Response(
                    {"error": "section_id is required !!!"}, status=status.HTTP_400_BAD_REQUEST),
                assigned_id=STUDENT_MENTOR_INSTANCE,
                communicated_with=communicated_with,
                communicated_via=communicated_via,
                remarks=remarks,
                date=date,
                created_by=professor_id

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

            return Response({'error': 'An unexpected error occurred: ' + str(e)},

                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:100],
                process_name='studentMentorCommunication',
                message=str(error_message)[:200] if error_message else '',
            )
        except Exception:
            # Avoid secondary failures
            pass


class StudentCommunicationSearchListAPIView(ListAPIView):
    serializer_class = StudentCommunicationSearchListSerializer

    def list(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            batch_id = request.query_params.get('batch_id')
            course_id = request.query_params.get('course_id')
            department_id = request.query_params.get("department_id")
            academic_year_id = request.query_params.get('academic_year_id')
            semester_id = request.query_params.get("semester_id")
            section_id = request.query_params.get("section_id")
            professor_id = request.query_params.get('professor_id')
            student_id = request.query_params.get('student_id')

            if not organization_id:
                return Response({'message': 'Please Provide organization_id'}, status=status.HTTP_400_BAD_REQUEST)

            if not branch_id:
                return Response({'message': 'Please Provide branch_id'}, status=status.HTTP_400_BAD_REQUEST)

            if not batch_id:
                return Response({'message': 'Please Provide batch_id'}, status=status.HTTP_400_BAD_REQUEST)

            if not course_id:
                return Response({'message': 'Please Provide course_id'}, status=status.HTTP_400_BAD_REQUEST)

            if not department_id:
                return Response({'message': 'Please Provide department_id'}, status=status.HTTP_400_BAD_REQUEST)

            if not academic_year_id:
                return Response({'message': 'Please Provide academic_year_id'}, status=status.HTTP_400_BAD_REQUEST)

            if not semester_id:
                return Response({'message': 'Please Provide semester_id'}, status=status.HTTP_400_BAD_REQUEST)

            if not section_id:
                return Response({'message': 'Please Provide section_id'}, status=status.HTTP_400_BAD_REQUEST)

            if not professor_id:
                return Response({'message': 'Please Provide professor_id'}, status=status.HTTP_400_BAD_REQUEST)

            if not student_id:
                return Response({'message': 'Please Provide student_id'}, status=status.HTTP_400_BAD_REQUEST)

            # Filter Data Into STUDENT_COMMUNICATION
            try:
                STUDENT_COMMUNICATION_RECORDS = StudentCommunication.objects.filter(
                    academic_year_id=academic_year_id,
                    organization_id=organization_id,
                    branch_id=branch_id,
                    is_active=True)
            except:
                STUDENT_COMMUNICATION_RECORDS = None

            if STUDENT_COMMUNICATION_RECORDS:
                if professor_id:
                    STUDENT_COMMUNICATION_RECORDS = STUDENT_COMMUNICATION_RECORDS.filter(
                        assigned_id__professor_id=professor_id)

                if student_id:
                    STUDENT_COMMUNICATION_RECORDS = STUDENT_COMMUNICATION_RECORDS.filter(
                        assigned_id__student_id=student_id)

                responseData = []
                # Iterate the filter data
                for item in STUDENT_COMMUNICATION_RECORDS:

                    # print(item.assigned_id.teacher_id.id)

                    # Get StudentCourse Instance
                    try:
                        studentCourseInstance = StudentCourse.objects.get(student=item.assigned_id.student,
                                                                          is_active=True)
                    except:
                        return Response({'message': 'Student Class Details Not Found'},
                                        status=status.HTTP_400_BAD_REQUEST)

                    try:
                        Professor_Instance = EmployeeMaster.objects.get(id=item.assigned_id.professor_id,
                                                                        is_active=True)
                    except:
                        return Response({'message': 'professor Details Not Found'}, status=status.HTTP_400_BAD_REQUEST)

                    # Student name construct
                    name_part = filter(None, [
                        studentCourseInstance.student.first_name,
                        studentCourseInstance.student.middle_name,
                        studentCourseInstance.student.last_name

                    ])
                    student_name = " ".join(name_part)

                    # Mentor Name Construct
                    Professor_part = filter(None, [
                        Professor_Instance.title,
                        Professor_Instance.first_name,
                        Professor_Instance.middle_name,
                        Professor_Instance.last_name

                    ])

                    professor_name = " ".join(Professor_part)

                    data = {
                        'studentname': student_name,
                        'course_name': studentCourseInstance.course.course_name,
                        'section_name': studentCourseInstance.section.section_name,
                        'professor_name': professor_name,
                        'communicated_with': item.communicated_with,
                        'communicated_via': item.communicated_via,
                        'remarks': item.remarks,
                        'date': item.date
                    }
                    responseData.append(data)
                return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No record Found'}, status=status.HTTP_400_BAD_REQUEST)


        except Http404:

            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)


        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:100],
                process_name='studentcommunicationSearchList',
                message=str(error_message)[:200] if error_message else '',
            )
        except Exception:
            # Avoid secondary failures
            pass


class StudentDetailsListAPIView(ListAPIView):
    serializer_class = StudentCommunicationSearchListSerializer

    def list(self, request, *args, **kwargs):

        try:
            student_id = request.query_params.get('student_id')
            if not student_id:
                return Response({'message': 'Please provide student_id'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                student_id = int(student_id)
            except ValueError:
                return Response({'message': 'Invalid student_id'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                studentCourseInstance = StudentCourse.objects.get(student_id=student_id, is_active=True)
            except:
                return Response({'message': 'Student Details Not Found'}, status=status.HTTP_404_NOT_FOUND)

            # Student name construct
            name_part = filter(None, [
                studentCourseInstance.student.first_name,
                studentCourseInstance.student.middle_name,
                studentCourseInstance.student.last_name

            ])
            student_name = " ".join(name_part)

            data = {
                "student_name": student_name,
                "admission_no": studentCourseInstance.student.admission_no,
                "course_name": studentCourseInstance.course.course_name,
                "section_name": studentCourseInstance.section.section_name,
                "father_name": studentCourseInstance.student.father_name,
                "mother_name": studentCourseInstance.student.mother_name,
                "father_contact_number": studentCourseInstance.student.father_contact_number,
                "mother_contact_number": studentCourseInstance.student.mother_contact_number,
                "father_email": studentCourseInstance.student.father_email,
                "mother_email": studentCourseInstance.student.mother_email,
                "student_mobile_no": "No",
                "student_email": studentCourseInstance.student.email

            }

            return Response({'message': 'success', 'data': data}, status=status.HTTP_200_OK)


        except Http404:

            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)



        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:100],
                process_name='studentDetailsList',
                message=str(error_message)[:200] if error_message else '',
            )
        except Exception:
            # Avoid secondary failures
            pass


class GetSearchStudentDetailsBasedRegistrationBarcodeListAPIView(ListAPIView):
    serializer_class = StudentDetailsBarcodeRegistrationSearchSerializer

    def list(self, request, *args, **kwargs):
        try:
            registration_no = request.query_params.get('registration_no')
            barcode = request.query_params.get('barcode')

            if not registration_no and not barcode:
                return Response({'message': 'Please provide At least registration_no or barcode value'},
                                status=status.HTTP_400_BAD_REQUEST)

            if registration_no and barcode:
                return Response({'message': 'Please provide One value at a time'},
                                status=status.HTTP_400_BAD_REQUEST)

            studentCourseInstance = None
            if registration_no:

                # Get Registration Instance
                try:
                    studentCourseInstance = StudentCourse.objects.get(student_id__registration_no=registration_no,
                                                                      is_active=True)
                except:
                    return Response({'message': 'Student Not Found On this Registration No'},
                                    status=status.HTTP_400_BAD_REQUEST)

            if barcode:
                # Get Registration Instance
                try:
                    studentCourseInstance = StudentCourse.objects.get(student_id__barcode=barcode,
                                                                      is_active=True)
                except:
                    return Response({'message': 'Student Not Found On this barcode'},
                                    status=status.HTTP_400_BAD_REQUEST)

            if studentCourseInstance:
                # Student name construct
                name_part = filter(None, [
                    studentCourseInstance.student.first_name,
                    studentCourseInstance.student.middle_name,
                    studentCourseInstance.student.last_name

                ])
                student_name = " ".join(name_part)
                data = {
                    'student_id': studentCourseInstance.student.id,
                    'student_name': student_name,
                    'registration_no': studentCourseInstance.student.registration_no,
                    'barcode': studentCourseInstance.student.barcode,
                    'course_name': studentCourseInstance.course.course_name,
                    'section_name': studentCourseInstance.section.section_name,
                    'father_name': studentCourseInstance.student.father_name,
                    'mother_name': studentCourseInstance.student.mother_name,

                }
                return Response({'message': 'success', 'data': data}, status=status.HTTP_200_OK)

        except Http404:

            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)



        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:100],
                process_name='studentDetailsBarcodeRegistrationNoBased',
                message=str(error_message)[:200] if error_message else '',
            )
        except Exception:
            # Avoid secondary failures
            pass


from django.shortcuts import render


class StudentMentorAssignmentDeleteAPIView(DestroyAPIView):
    """
    DELETE: Remove/unassign student-mentor relationship.

    Accepts either:
    1. assignment_id in URL path: DELETE /api/Mentor/studentmentorAssign/<assignment_id>/
    2. JSON body with assignment_id OR (mentor_id + student_id + academic_year_id)
    """

    queryset = StudentMentorAssignment.objects.all()
    serializer_class = StudentMentorAssignmentDeleteSerializer

    def delete(self, request, *args, **kwargs):
        try:
            assignment_id = kwargs.get('pk')  # From URL path

            # If assignment_id is in URL, use it
            if assignment_id:
                try:
                    assignment = StudentMentorAssignment.objects.get(
                        id=assignment_id,
                        is_active=True
                    )
                    assignment.is_active = False
                    assignment.status = 'INACTIVE'
                    assignment.save()
                    return Response(
                        {'message': 'Student-mentor assignment removed successfully'},
                        status=status.HTTP_200_OK
                    )
                except StudentMentorAssignment.DoesNotExist:
                    return Response(
                        {'message': 'Assignment not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )

            # Otherwise, try to get from request body
            delete_serializer = StudentMentorAssignmentDeleteSerializer(data=request.data)
            delete_serializer.is_valid(raise_exception=True)
            data = delete_serializer.validated_data

            assignment_id = data.get('assignment_id')
            mentor_id = data.get('mentor_id')
            student_id = data.get('student_id')
            academic_year_id = data.get('academic_year_id')

            if assignment_id:
                try:
                    assignment = StudentMentorAssignment.objects.get(
                        id=assignment_id,
                        is_active=True
                    )
                except StudentMentorAssignment.DoesNotExist:
                    return Response(
                        {'message': 'Assignment not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
            elif mentor_id and student_id and academic_year_id:
                try:
                    assignment = StudentMentorAssignment.objects.get(
                        mentor_id=mentor_id,
                        student_id=student_id,
                        academic_year_id=academic_year_id,
                        is_active=True
                    )
                except StudentMentorAssignment.DoesNotExist:
                    return Response(
                        {'message': 'Assignment not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                except StudentMentorAssignment.MultipleObjectsReturned:
                    # If multiple found, deactivate all
                    assignments = StudentMentorAssignment.objects.filter(
                        mentor_id=mentor_id,
                        student_id=student_id,
                        academic_year_id=academic_year_id,
                        is_active=True
                    )
                    assignments.update(is_active=False, status='INACTIVE')
                    return Response(
                        {'message': f'{assignments.count()} student-mentor assignment(s) removed successfully'},
                        status=status.HTTP_200_OK
                    )
            else:
                return Response(
                    {
                        'message': 'Invalid request. Provide assignment_id or (mentor_id + student_id + academic_year_id)'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Soft delete: set is_active=False and status=INACTIVE
            assignment.is_active = False
            assignment.status = 'INACTIVE'
            assignment.save()

            return Response(
                {'message': 'Student-mentor assignment removed successfully'},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response(
                {'error': error_message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def log_exception(self, request, error_message: str) -> None:
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:100],
                process_name="StudentMentorAssignmentDelete",
                message=error_message[:200] if error_message else '',
            )
        except Exception:
            # Avoid secondary failures
            pass


class MentorStudentCommunicationListCreateAPIView(ListCreateAPIView):
    """
    GET: Search/list mentor-student communication records with flexible filters.
    POST: Create a new communication record.

    Query params for GET (all optional):
    - academic_year_id
    - org_id
    - branch_id
    - student_id
    - teacher_id (maps to mentor via EmployeeMaster)
    - mentor_id
    - date_from
    - date_to
    - communicated_with
    - communicated_via
    """

    serializer_class = MentorStudentCommunicationListSerializer

    def get_queryset(self):
        queryset = MentorStudentCommunication.objects.filter(is_active=True)

        # Validate and apply filters
        search_serializer = MentorStudentCommunicationSearchSerializer(
            data=self.request.query_params
        )
        if search_serializer.is_valid():
            data = search_serializer.validated_data

            if data.get("academic_year_id"):
                queryset = queryset.filter(academic_year_id=data["academic_year_id"])
            if data.get("org_id"):
                queryset = queryset.filter(organization_id=data["org_id"])
            if data.get("branch_id"):
                queryset = queryset.filter(branch_id=data["branch_id"])
            if data.get("student_id"):
                queryset = queryset.filter(student_id=data["student_id"])
            if data.get("mentor_id"):
                queryset = queryset.filter(mentor_id=data["mentor_id"])
            if data.get("teacher_id"):
                # Map teacher_id (EmployeeMaster) to mentor
                queryset = queryset.filter(mentor__employee_id=data["teacher_id"])
            if data.get("date_from"):
                queryset = queryset.filter(communication_date__gte=data["date_from"])
            if data.get("date_to"):
                queryset = queryset.filter(communication_date__lte=data["date_to"])
            if data.get("communicated_with"):
                queryset = queryset.filter(communicated_with=data["communicated_with"])
            if data.get("communicated_via"):
                queryset = queryset.filter(communicated_via=data["communicated_via"])

        return queryset.order_by("-communication_date", "-created_at")

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()

            # Check if queryset is empty (table might not exist yet)
            if not queryset.exists() and not MentorStudentCommunication.objects.exists():
                # Table might not exist - return empty list instead of error
                return Response(
                    {"message": "success", "data": []},
                    status=status.HTTP_200_OK,
                )

            serializer = self.get_serializer(queryset, many=True)
            return Response(
                {"message": "success", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            import traceback
            error_message = str(e)
            error_traceback = traceback.format_exc()
            self.log_exception(request, f"{error_message}\n{error_traceback}")
            return Response(
                {"error": error_message, "details": error_traceback},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create(self, request, *args, **kwargs):
        try:
            # Get data before serializer validation to handle mentor auto-creation
            mentor_id_or_employee_id = request.data.get('mentor')
            student_id = request.data.get('student')
            organization_id = request.data.get('organization')
            branch_id = request.data.get('branch')
            created_by = request.data.get('created_by', 0)

            # Validate student exists
            if student_id:
                try:
                    student = StudentRegistration.objects.get(id=student_id, is_active=True)
                except StudentRegistration.DoesNotExist:
                    return Response(
                        {"error": f"Student with ID {student_id} does not exist or is not active"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            # Handle mentor: try as mentor ID first, then as employee ID (auto-create mentor if needed)
            mentor = None
            if mentor_id_or_employee_id and organization_id and branch_id:
                try:
                    # First, try to get existing mentor
                    mentor = Mentor.objects.get(id=mentor_id_or_employee_id, is_active=True)
                except Mentor.DoesNotExist:
                    # If mentor doesn't exist, treat it as employee_id and create mentor profile
                    try:
                        employee = EmployeeMaster.objects.get(id=mentor_id_or_employee_id, is_active=True)
                        organization = Organization.objects.get(id=organization_id)
                        branch = Branch.objects.get(id=branch_id)

                        # Auto-create mentor profile for this employee (all teachers are mentors)
                        mentor, created = Mentor.objects.get_or_create(
                            organization=organization,
                            branch=branch,
                            employee=employee,
                            defaults={"created_by": created_by, "is_active": True}
                        )
                        if not mentor.is_active:
                            mentor.is_active = True
                            mentor.save()
                    except EmployeeMaster.DoesNotExist:
                        return Response(
                            {
                                "error": f"Neither Mentor ID {mentor_id_or_employee_id} nor Employee ID {mentor_id_or_employee_id} exists or is not active"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    except (Organization.DoesNotExist, Branch.DoesNotExist):
                        return Response(
                            {"error": "Invalid organization_id or branch_id"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

            # Update request data with the actual mentor ID
            if mentor:
                request_data = request.data.copy()
                request_data['mentor'] = mentor.id
                serializer = MentorStudentCommunicationCreateSerializer(data=request_data)
            else:
                serializer = MentorStudentCommunicationCreateSerializer(data=request.data)

            serializer.is_valid(raise_exception=True)
            communication = serializer.save()

            response_serializer = MentorStudentCommunicationListSerializer(communication)
            return Response(
                {"message": "success", "data": response_serializer.data},
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            import traceback
            error_message = str(e)
            error_traceback = traceback.format_exc()
            self.log_exception(request, f"{error_message}\n{error_traceback}")

            # Check for common foreign key errors
            if "does not exist" in error_message.lower() or "foreign key constraint" in error_message.lower():
                return Response(
                    {"error": f"Invalid reference: {error_message}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response(
                {"error": error_message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def log_exception(self, request, error_message: str) -> None:
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:100],
                process_name="MentorStudentCommunication",
                message=error_message[:200] if error_message else '',
            )
        except Exception:
            # Avoid secondary failures
            pass


class MentorStudentCommunicationDeleteAPIView(DestroyAPIView):
    """
    DELETE: Soft delete a mentor-student communication record.
    """

    queryset = MentorStudentCommunication.objects.all()

    def delete(self, request, *args, **kwargs):
        try:
            communication_id = kwargs.get("pk")
            try:
                communication = MentorStudentCommunication.objects.get(
                    id=communication_id, is_active=True
                )
                communication.is_active = False
                communication.save()
                return Response(
                    {"message": "Communication record deleted successfully"},
                    status=status.HTTP_200_OK,
                )
            except MentorStudentCommunication.DoesNotExist:
                return Response(
                    {"message": "Communication record not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Exception as e:
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response(
                {"error": error_message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def log_exception(self, request, error_message: str) -> None:
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:100],
                process_name="MentorStudentCommunicationDelete",
                message=error_message[:200] if error_message else '',
            )
        except Exception:
            # Avoid secondary failures
            pass


class MentorWiseStudentListAPIView(ListAPIView):
    """
    GET: Get all students assigned to a specific mentor/teacher.

    Query params:
    - teacher_id: Required - EmployeeMaster ID (teacher/mentor)
    - academic_year_id: Optional - Filter by academic year
    - org_id: Optional - Filter by organization
    - branch_id: Optional - Filter by branch
    """

    serializer_class = MentorWiseStudentSerializer

    def list(self, request, *args, **kwargs):
        try:
            teacher_id = request.query_params.get('teacher_id')
            academic_year_id = request.query_params.get('academic_year_id')
            org_id = request.query_params.get('org_id')
            branch_id = request.query_params.get('branch_id')

            if not teacher_id:
                return Response(
                    {'message': 'teacher_id is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get mentor from teacher_id (EmployeeMaster)
            try:
                employee = EmployeeMaster.objects.get(id=teacher_id, is_active=True)
            except EmployeeMaster.DoesNotExist:
                return Response(
                    {'message': 'Teacher/mentor not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Get or find mentor profile
            try:
                mentor = Mentor.objects.get(employee=employee, is_active=True)
            except Mentor.DoesNotExist:
                # If mentor profile doesn't exist, return empty list
                return Response(
                    {'message': 'success', 'data': []},
                    status=status.HTTP_200_OK
                )

            # Get active assignments for this mentor
            assignments_queryset = StudentMentorAssignment.objects.filter(
                mentor=mentor,
                is_active=True,
                status='ACTIVE'
            )

            if org_id:
                assignments_queryset = assignments_queryset.filter(organization_id=org_id)
            if branch_id:
                assignments_queryset = assignments_queryset.filter(branch_id=branch_id)
            if academic_year_id:
                assignments_queryset = assignments_queryset.filter(academic_year_id=academic_year_id)

            response_data = []
            for assignment in assignments_queryset:
                student = assignment.student

                # Get student name
                student_name_parts = [
                    student.first_name,
                    student.middle_name,
                    student.last_name
                ]
                student_name = " ".join(p for p in student_name_parts if p)

                # Get course/section/semester from StudentCourse
                from Acadix.models import StudentCourse
                course_id = None
                course_name = None
                department_id = None
                department_name = None
                section_id = None
                section_name = None
                semester_id = None
                semester_name = None

                try:
                    student_course = StudentCourse.objects.filter(
                        student=student,
                        is_active=True
                    ).order_by('-created_at').first()

                    if student_course:
                        if student_course.course:
                            course_id = student_course.course.id
                            course_name = student_course.course.course_name
                        if student_course.department:
                            department_id = student_course.department.id
                            department_name = student_course.department.department_code
                        if student_course.section:
                            section_id = student_course.section.id
                            section_name = student_course.section.section_name
                        if student_course.semester:
                            semester_id = student_course.semester.id
                            semester_name = student_course.semester.semester_description
                except Exception:
                    pass

                student_data = {
                    'assignment_id': assignment.id,
                    'student_id': student.id,
                    'student_name': student_name,
                    'admission_no': student.admission_no,
                    'college_admission_no': student.college_admission_no,
                    'barcode': student.barcode,
                    'email': student.email,
                    'course_id': course_id,
                    'course_name': course_name,
                    'department_id': department_id,
                    'department_name': department_name,
                    'section_id': section_id,
                    'section_name': section_name,
                    'semester_id': semester_id,
                    'semester_name': semester_name,
                    'academic_year_id': assignment.academic_year.id,
                    'academic_year_code': assignment.academic_year.academic_year_code,
                    'assignment_date': assignment.assignment_date,
                    'status': assignment.status,
                    'is_primary': assignment.is_primary,
                }

                response_data.append(student_data)

            return Response(
                {'message': 'success', 'data': response_data},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response(
                {'error': error_message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def log_exception(self, request, error_message: str) -> None:
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:100],
                process_name="MentorWiseStudentList",
                message=error_message[:200] if error_message else '',
            )
        except Exception:
            # Avoid secondary failures
            pass