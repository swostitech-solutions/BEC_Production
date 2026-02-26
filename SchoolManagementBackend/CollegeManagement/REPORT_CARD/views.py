from django.db.models import Q
from django.db import transaction
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import base64
import datetime
from django.core.files.base import ContentFile

from Acadix.models import StudentCourse, StudentRegistration, AcademicYear, Batch
from .models import (
    StudentReportCard, StudentExamResult, SubjectResult,
    AttendanceRecord, CoScholasticResult, TeacherRemarks, ExamType
)


class ReportCardStudentListAPIView(ListAPIView):
    """
    API View to get student list for report card based on filters
    """

    def list(self, request, *args, **kwargs):
        try:
            query_params = request.query_params

            academic_year_id = query_params.get('academic_year_id')
            org_id = query_params.get('org_id')
            branch_id = query_params.get('branch_id')
            class_id = query_params.get('class_id')
            is_active = query_params.get('is_active')
            student_name = query_params.get('student_name')

            filters = Q()

            print(f"DEBUG: Params - AY={academic_year_id}, Org={org_id}, Branch={branch_id}, Class={class_id}, Active={is_active}")

            if academic_year_id:
                # Resolve Batch ID from Academic Year ID
                # Because detailed records like StudentCourse might be linked to the Batch (15) 
                # but the frontend sends an AY ID (25) which is just a timeframe marker.
                # Shell check confirmed SC has batch_id=15 but ay_id!=25.
                try:
                    ay = AcademicYear.objects.filter(id=academic_year_id).first()
                    print(f"DEBUG: AY Found: {ay}")
                    if ay:
                         # Get the active batch for this branch
                         # If the AY belongs to a batch directly, we could use that, 
                         # but consistent with other fixes, we usually look for the active batch in the branch.
                         branch_id_from_ay = ay.branch.id
                         print(f"DEBUG: Branch from AY: {branch_id_from_ay}")
                         # Collect active batch IDs for this branch
                         active_batches = list(Batch.objects.filter(branch_id=branch_id_from_ay, is_active=True).values_list('id', flat=True))
                         print(f"DEBUG: Active Batches: {active_batches}")
                         
                         if active_batches:
                             # Filter by the active batch(es) instead of just the AY ID.
                             # If we strictly filter by AY=25 we get 0. 
                             # We filter by Batch IN active_batches.
                             filters &= Q(batch_id__in=active_batches)
                             print("DEBUG: Applied Batch Filter")
                         else:
                             # Fallback to AY ID if no active batch found (unlikely)
                             filters &= Q(academic_year_id=academic_year_id)
                             print("DEBUG: Applied AY Filter (Fallback 1)")
                    else:
                        filters &= Q(academic_year_id=academic_year_id)
                        print("DEBUG: Applied AY Filter (Fallback 2)")
                except Exception as e:
                    print(f"DEBUG: Exception in AY logic: {e}")
                    filters &= Q(academic_year_id=academic_year_id)
            
            if org_id:
                filters &= Q(organization_id=org_id)
            if branch_id:
                 # If we haven't already filtered by batch via AY resolution, check branch here
                 # If AY logic ran, it implicitly covered branch via batch selection.
                 # But we can keep it as a safeguard or for cases where AY wasn't sent.
                 if not academic_year_id:
                     filters &= Q(branch_id=branch_id)
                 else:
                     # Strict branch Match
                      filters &= Q(branch_id=branch_id)
            if class_id:
                filters &= Q(course_id=class_id)
            if is_active is not None:
                is_active_bool = is_active in ['1', 'true', 'True', True]
                filters &= Q(is_active=is_active_bool)

            student_courses = StudentCourse.objects.filter(filters).select_related(
                'student', 'academic_year', 'organization', 'branch', 'course', 'semester', 'section'
            )

            if student_name:
                name_parts = student_name.strip().split()
                name_filter = Q()

                if len(name_parts) == 1:
                    first = name_parts[0].strip()
                    name_filter = (
                            Q(student__first_name__icontains=first) |
                            Q(student__middle_name__icontains=first) |
                            Q(student__last_name__icontains=first)
                    )
                elif len(name_parts) == 2:
                    first, last = name_parts
                    name_filter = (
                            Q(student__first_name__icontains=first, student__last_name__icontains=last) |
                            Q(student__first_name__icontains=first) |
                            Q(student__last_name__icontains=last)
                    )
                elif len(name_parts) >= 3:
                    first, middle, last = name_parts[0], name_parts[1], name_parts[2]
                    name_filter = Q(
                        student__first_name__icontains=first,
                        student__middle_name__icontains=middle,
                        student__last_name__icontains=last
                    )

                student_courses = student_courses.filter(name_filter)

            student_list = []
            for sc in student_courses:
                student = sc.student
                student_data = {
                    'id': student.id,
                    'student_course_id': sc.id,
                    'first_name': student.first_name,
                    'middle_name': student.middle_name,
                    'last_name': student.last_name,
                    'full_name': f"{student.first_name} {student.middle_name or ''} {student.last_name or ''}".strip(),
                    'admission_no': student.admission_no,
                    'enrollment_no': student.enrollment_no,
                    'roll_no': sc.enrollment_no,  # Using StudentCourse enrollment_no as roll number
                    'barcode': student.barcode,
                    'father_name': student.father_name,
                    'mother_name': student.mother_name,
                    'email': student.email,
                    'contact_no': student.contact_no,
                    'date_of_birth': student.date_of_birth,
                    'gender_id': student.gender_id,
                    'academic_year_id': sc.academic_year_id,
                    'academic_year_code': sc.academic_year.academic_year_code if sc.academic_year else None,
                    'organization_id': sc.organization_id,
                    'branch_id': sc.branch_id,
                    'course_id': sc.course_id,
                    'course_name': sc.course.course_name if sc.course else None,
                    'semester_id': sc.semester_id,
                    'semester_code': sc.semester.semester_code if sc.semester else None,
                    'section_id': sc.section_id,
                    'section_name': sc.section.section_name if sc.section else None,
                    'is_active': sc.is_active,
                    'student_status': sc.student_status,
                    'profile_pic': student.profile_pic.url if student.profile_pic else None,
                }
                student_list.append(student_data)
            
            return Response({
                'status': 'success',
                'count': len(student_list),
                'data': student_list
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SaveExamResultAPIView(APIView):
    """
    API View to save exam results data to the backend
    """
    parser_classes = (JSONParser,)

    def to_decimal(self, value):
        """Convert empty string or None to None, otherwise return the value"""
        if value is None or value == '' or value == '':
            return None
        try:
            return float(value)
        except (ValueError, TypeError):
            return None

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            data = request.data

            student_course_id = data.get('student_course_id')
            academic_year_id = data.get('academic_year_id')
            semester_id = data.get('semester_id')
            exam_type_id = data.get('exam_type_id')
            created_by = data.get('created_by')

            # Subject results
            subjects = data.get('subjects', [])

            # Co-scholastic results
            co_scholastic = data.get('co_scholastic', [])

            # Attendance
            attendance_data = data.get('attendance', {})

            # Teacher remarks
            remarks_data = data.get('remarks', {})

            # Health status
            health_status = data.get('health_status', {})

            if not student_course_id:
                return Response({
                    'status': 'error',
                    'message': 'student_course_id is required'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Validate student course exists
            try:
                student_course = StudentCourse.objects.get(id=student_course_id)
            except StudentCourse.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': 'Student course not found'
                }, status=status.HTTP_404_NOT_FOUND)

            # Calculate totals
            total_marks = 0
            obtained_marks = 0
            for subject in subjects:
                max_m = self.to_decimal(subject.get('max_marks')) or 0
                obt_m = self.to_decimal(subject.get('obtained_marks')) or 0
                total_marks += max_m
                obtained_marks += obt_m

            percentage = (obtained_marks / total_marks * 100) if total_marks > 0 else 0

            # Determine overall grade based on percentage
            overall_grade = self.calculate_grade(percentage)

            # Prepare health status data
            health_height = health_status.get('height') if health_status else None
            health_weight = health_status.get('weight') if health_status else None
            health_as_on_date = health_status.get('as_on_date') if health_status else None

            # Convert as_on_date string to date object if provided
            health_date_obj = None
            if health_as_on_date:
                try:
                    if isinstance(health_as_on_date, str):
                        health_date_obj = datetime.datetime.strptime(health_as_on_date, '%Y-%m-%d').date()
                    else:
                        health_date_obj = health_as_on_date
                except (ValueError, TypeError):
                    health_date_obj = None

            # Create or update exam result
            exam_result, created = StudentExamResult.objects.update_or_create(
                student_course_id=student_course_id,
                academic_year_id=academic_year_id,
                semester_id=semester_id,
                defaults={
                    'exam_type_id': exam_type_id,
                    'total_marks': total_marks,
                    'obtained_marks': obtained_marks,
                    'percentage': round(percentage, 2),
                    'overall_grade': overall_grade,
                    'created_by': created_by,
                    'remarks': remarks_data.get('principal_remarks', ''),
                    'height': str(health_height) if health_height is not None and health_height != '' else None,
                    'weight': str(health_weight) if health_weight is not None and health_weight != '' else None,
                    'as_on_date': health_date_obj,
                }
            )

            # Clear existing subject results and add new ones
            SubjectResult.objects.filter(exam_result=exam_result).delete()
            for subject in subjects:
                SubjectResult.objects.create(
                    exam_result=exam_result,
                    subject_name=subject.get('subject_name', ''),
                    max_marks=self.to_decimal(subject.get('max_marks')) or 100,
                    obtained_marks=self.to_decimal(subject.get('obtained_marks')),
                    grade=subject.get('grade', ''),
                    periodic_assessment=self.to_decimal(subject.get('periodic_assessment')),
                    notebook_maintenance=self.to_decimal(subject.get('notebook_maintenance')),
                    subject_enrichment=self.to_decimal(subject.get('subject_enrichment')),
                    practical_marks=self.to_decimal(subject.get('practical_marks')),
                    theory_marks=self.to_decimal(subject.get('theory_marks')),
                )

            # Clear and add co-scholastic results
            CoScholasticResult.objects.filter(exam_result=exam_result).delete()
            for activity in co_scholastic:
                CoScholasticResult.objects.create(
                    exam_result=exam_result,
                    activity_name=activity.get('activity_name', ''),
                    grade=activity.get('grade', ''),
                    remarks=activity.get('remarks', ''),
                )

            # Update or create attendance record
            if attendance_data:
                actual = self.to_decimal(attendance_data.get('actual_attendance'))
                possible = self.to_decimal(attendance_data.get('possible_attendance'))
                att_percentage = (actual / possible * 100) if possible and possible > 0 and actual is not None else None

                AttendanceRecord.objects.update_or_create(
                    exam_result=exam_result,
                    defaults={
                        'actual_attendance': int(actual) if actual is not None else None,
                        'possible_attendance': int(possible) if possible is not None else None,
                        'attendance_percentage': round(att_percentage, 2) if att_percentage else None,
                    }
                )

            # Update or create teacher remarks
            if remarks_data:
                TeacherRemarks.objects.update_or_create(
                    exam_result=exam_result,
                    defaults={
                        'class_teacher_remarks': remarks_data.get('class_teacher_remarks', ''),
                        'principal_remarks': remarks_data.get('principal_remarks', ''),
                        'activities': remarks_data.get('activities', ''),
                        'competitions': remarks_data.get('competitions', ''),
                        'co_curricular_participation': remarks_data.get('co_curricular_participation', ''),
                        'holiday_homework': remarks_data.get('holiday_homework', ''),
                    }
                )

            return Response({
                'status': 'success',
                'message': 'Exam result saved successfully',
                'data': {
                    'id': exam_result.id,
                    'student_course_id': exam_result.student_course_id,
                    'total_marks': str(exam_result.total_marks),
                    'obtained_marks': str(exam_result.obtained_marks),
                    'percentage': str(exam_result.percentage),
                    'overall_grade': exam_result.overall_grade,
                    'created_at': exam_result.created_at
                }
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def calculate_grade(self, percentage):
        if percentage >= 91:
            return 'A1'
        elif percentage >= 81:
            return 'A2'
        elif percentage >= 71:
            return 'B1'
        elif percentage >= 61:
            return 'B2'
        elif percentage >= 51:
            return 'C1'
        elif percentage >= 41:
            return 'C2'
        elif percentage >= 33:
            return 'D'
        else:
            return 'E'


class GetExamResultAPIView(APIView):
    """
    API View to get exam results for a student
    """

    def get(self, request, student_course_id, *args, **kwargs):
        try:
            semester_id = request.query_params.get('semester_id')

            filters = {'student_course_id': student_course_id}
            if semester_id:
                filters['semester_id'] = semester_id

            exam_results = StudentExamResult.objects.filter(**filters).select_related(
                'student_course', 'academic_year', 'semester', 'exam_type'
            ).prefetch_related(
                'subject_results', 'co_scholastic_results', 'attendance', 'teacher_remarks'
            ).order_by('-created_at')

            data = []
            for result in exam_results:
                # Get student info
                student = result.student_course.student

                result_data = {
                    'id': result.id,
                    'student_course_id': result.student_course_id,
                    'student_name': f"{student.first_name} {student.middle_name or ''} {student.last_name or ''}".strip(),
                    'enrollment_no': student.enrollment_no,
                    'academic_year_id': result.academic_year_id,
                    'academic_year_code': result.academic_year.academic_year_code if result.academic_year else None,
                    'semester_id': result.semester_id,
                    'semester_code': result.semester.semester_code if result.semester else None,
                    'exam_type': result.exam_type.name if result.exam_type else None,
                    'exam_date': result.exam_date,
                    'total_marks': str(result.total_marks) if result.total_marks else None,
                    'obtained_marks': str(result.obtained_marks) if result.obtained_marks else None,
                    'percentage': str(result.percentage) if result.percentage else None,
                    'overall_grade': result.overall_grade,
                    'rank': result.rank,
                    'is_published': result.is_published,
                    'created_at': result.created_at,

                    # Subject results
                    'subjects': [
                        {
                            'id': sr.id,
                            'subject_name': sr.subject_name,
                            'max_marks': str(sr.max_marks),
                            'obtained_marks': str(sr.obtained_marks) if sr.obtained_marks else None,
                            'grade': sr.grade,
                            'periodic_assessment': str(sr.periodic_assessment) if sr.periodic_assessment else None,
                            'notebook_maintenance': str(sr.notebook_maintenance) if sr.notebook_maintenance else None,
                            'subject_enrichment': str(sr.subject_enrichment) if sr.subject_enrichment else None,
                            'practical_marks': str(sr.practical_marks) if sr.practical_marks else None,
                            'theory_marks': str(sr.theory_marks) if sr.theory_marks else None,
                            'is_pass': sr.is_pass,
                        }
                        for sr in result.subject_results.all()
                    ],

                    # Co-scholastic results
                    'co_scholastic': [
                        {
                            'id': cs.id,
                            'activity_name': cs.activity_name,
                            'grade': cs.grade,
                            'remarks': cs.remarks,
                        }
                        for cs in result.co_scholastic_results.all()
                    ],

                    # Attendance
                    'attendance': None,

                    # Teacher remarks
                    'remarks': None,

                    # Health status
                    'health_status': None,
                }

                # Add attendance if exists
                try:
                    att = result.attendance
                    result_data['attendance'] = {
                        'actual_attendance': att.actual_attendance,
                        'possible_attendance': att.possible_attendance,
                        'attendance_percentage': str(att.attendance_percentage) if att.attendance_percentage else None,
                    }
                except AttendanceRecord.DoesNotExist:
                    pass

                # Add teacher remarks if exists
                try:
                    tr = result.teacher_remarks
                    result_data['remarks'] = {
                        'class_teacher_remarks': tr.class_teacher_remarks,
                        'principal_remarks': tr.principal_remarks,
                        'activities': tr.activities,
                        'competitions': tr.competitions,
                        'co_curricular_participation': tr.co_curricular_participation,
                        'holiday_homework': tr.holiday_homework,
                    }
                except TeacherRemarks.DoesNotExist:
                    pass

                # Add health status
                if result.height or result.weight or result.as_on_date:
                    result_data['health_status'] = {
                        'height': result.height if result.height else None,
                        'weight': result.weight if result.weight else None,
                        'as_on_date': result.as_on_date.strftime('%Y-%m-%d') if result.as_on_date else None,
                    }

                data.append(result_data)

            return Response({
                'status': 'success',
                'count': len(data),
                'data': data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetExamResultByStudentIdAPIView(APIView):
    """
    API View to get exam results for a student by student_id (instead of student_course_id)
    This is more intuitive as it returns all results for a student across all courses/semesters
    """

    def get(self, request, student_id, *args, **kwargs):
        try:
            # Optional filters
            semester_id = request.query_params.get('semester_id')
            academic_year_id = request.query_params.get('academic_year_id')

            # Filter by student_id through student_course relationship
            filters = {'student_course__student_id': student_id}
            if semester_id:
                filters['semester_id'] = semester_id
            if academic_year_id:
                filters['academic_year_id'] = academic_year_id

            exam_results = StudentExamResult.objects.filter(**filters).select_related(
                'student_course', 'student_course__student', 'academic_year', 'semester', 'exam_type'
            ).prefetch_related(
                'subject_results', 'co_scholastic_results', 'attendance', 'teacher_remarks'
            ).order_by('-created_at')

            data = []
            for result in exam_results:
                # Get student info
                student = result.student_course.student

                result_data = {
                    'id': result.id,
                    'student_id': student.id,
                    'student_course_id': result.student_course_id,
                    'student_name': f"{student.first_name} {student.middle_name or ''} {student.last_name or ''}".strip(),
                    'enrollment_no': student.enrollment_no,
                    'academic_year_id': result.academic_year_id,
                    'academic_year_code': result.academic_year.academic_year_code if result.academic_year else None,
                    'semester_id': result.semester_id,
                    'semester_code': result.semester.semester_code if result.semester else None,
                    'exam_type': result.exam_type.name if result.exam_type else None,
                    'exam_date': result.exam_date,
                    'total_marks': str(result.total_marks) if result.total_marks else None,
                    'obtained_marks': str(result.obtained_marks) if result.obtained_marks else None,
                    'percentage': str(result.percentage) if result.percentage else None,
                    'overall_grade': result.overall_grade,
                    'rank': result.rank,
                    'is_published': result.is_published,
                    'created_at': result.created_at,

                    # Subject results
                    'subjects': [
                        {
                            'id': sr.id,
                            'subject_name': sr.subject_name,
                            'max_marks': str(sr.max_marks),
                            'obtained_marks': str(sr.obtained_marks) if sr.obtained_marks else None,
                            'grade': sr.grade,
                            'periodic_assessment': str(sr.periodic_assessment) if sr.periodic_assessment else None,
                            'notebook_maintenance': str(sr.notebook_maintenance) if sr.notebook_maintenance else None,
                            'subject_enrichment': str(sr.subject_enrichment) if sr.subject_enrichment else None,
                            'practical_marks': str(sr.practical_marks) if sr.practical_marks else None,
                            'theory_marks': str(sr.theory_marks) if sr.theory_marks else None,
                            'is_pass': sr.is_pass,
                        }
                        for sr in result.subject_results.all()
                    ],

                    # Co-scholastic results
                    'co_scholastic': [
                        {
                            'id': cs.id,
                            'activity_name': cs.activity_name,
                            'grade': cs.grade,
                            'remarks': cs.remarks,
                        }
                        for cs in result.co_scholastic_results.all()
                    ],

                    # Attendance
                    'attendance': None,

                    # Teacher remarks
                    'remarks': None,
                }

                # Add attendance if exists
                try:
                    att = result.attendance
                    result_data['attendance'] = {
                        'actual_attendance': att.actual_attendance,
                        'possible_attendance': att.possible_attendance,
                        'attendance_percentage': str(att.attendance_percentage) if att.attendance_percentage else None,
                    }
                except AttendanceRecord.DoesNotExist:
                    pass

                # Add teacher remarks if exists
                try:
                    tr = result.teacher_remarks
                    result_data['remarks'] = {
                        'class_teacher_remarks': tr.class_teacher_remarks,
                        'principal_remarks': tr.principal_remarks,
                        'activities': tr.activities,
                        'competitions': tr.competitions,
                        'co_curricular_participation': tr.co_curricular_participation,
                        'holiday_homework': tr.holiday_homework,
                    }
                except TeacherRemarks.DoesNotExist:
                    pass

                data.append(result_data)

            return Response({
                'status': 'success',
                'count': len(data),
                'data': data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetAllExamResultsAPIView(APIView):
    """
    Debug/Admin API View to get all exam results (for verifying database data)
    """

    def get(self, request, *args, **kwargs):
        try:
            # Optional filters
            student_course_id = request.query_params.get('student_course_id')
            academic_year_id = request.query_params.get('academic_year_id')
            semester_id = request.query_params.get('semester_id')

            filters = {}
            if student_course_id:
                filters['student_course_id'] = student_course_id
            if academic_year_id:
                filters['academic_year_id'] = academic_year_id
            if semester_id:
                filters['semester_id'] = semester_id

            exam_results = StudentExamResult.objects.filter(**filters).select_related(
                'student_course', 'academic_year', 'semester', 'exam_type'
            ).order_by('-created_at')

            data = []
            for result in exam_results:
                try:
                    student = result.student_course.student
                    student_name = f"{student.first_name} {student.middle_name or ''} {student.last_name or ''}".strip()
                except:
                    student_name = "N/A"

                data.append({
                    'id': result.id,
                    'student_course_id': result.student_course_id,
                    'student_name': student_name,
                    'academic_year_id': result.academic_year_id,
                    'academic_year_code': result.academic_year.academic_year_code if result.academic_year else None,
                    'semester_id': result.semester_id,
                    'semester_code': result.semester.semester_code if result.semester else None,
                    'exam_type': result.exam_type.name if result.exam_type else None,
                    'total_marks': str(result.total_marks) if result.total_marks else None,
                    'obtained_marks': str(result.obtained_marks) if result.obtained_marks else None,
                    'percentage': str(result.percentage) if result.percentage else None,
                    'overall_grade': result.overall_grade,
                    'created_at': result.created_at,
                    'subject_count': result.subject_results.count(),
                    'has_attendance': hasattr(result, 'attendance'),
                    'has_remarks': hasattr(result, 'teacher_remarks'),
                })

            return Response({
                'status': 'success',
                'count': len(data),
                'total_in_db': StudentExamResult.objects.count(),
                'data': data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SaveReportCardPDFAPIView(APIView):
    """
    API View to save report card PDF to the backend (legacy support)
    """
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        try:
            student_course_id = request.data.get('student_course_id')
            academic_year_id = request.data.get('academic_year_id')
            semester_id = request.data.get('semester_id')
            created_by = request.data.get('created_by')
            remarks = request.data.get('remarks', '')

            pdf_base64 = request.data.get('pdf_base64')
            pdf_file = request.FILES.get('pdf_file')

            if not student_course_id:
                return Response({
                    'status': 'error',
                    'message': 'student_course_id is required'
                }, status=status.HTTP_400_BAD_REQUEST)

            try:
                student_course = StudentCourse.objects.get(id=student_course_id)
            except StudentCourse.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': 'Student course not found'
                }, status=status.HTTP_404_NOT_FOUND)

            report_card = StudentReportCard(
                student_course=student_course,
                academic_year_id=academic_year_id,
                semester_id=semester_id,
                created_by=created_by,
                remarks=remarks
            )

            if pdf_file:
                report_card.report_pdf = pdf_file
            elif pdf_base64:
                try:
                    if ',' in pdf_base64:
                        pdf_base64 = pdf_base64.split(',')[1]

                    pdf_data = base64.b64decode(pdf_base64)
                    student_name = student_course.student.first_name.replace(' ', '_')
                    file_name = f"report_card_{student_name}_{student_course_id}.pdf"
                    report_card.report_pdf.save(file_name, ContentFile(pdf_data), save=False)
                except Exception as e:
                    return Response({
                        'status': 'error',
                        'message': f'Invalid PDF data: {str(e)}'
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({
                    'status': 'error',
                    'message': 'Either pdf_file or pdf_base64 is required'
                }, status=status.HTTP_400_BAD_REQUEST)

            report_card.save()

            return Response({
                'status': 'success',
                'message': 'Report card saved successfully',
                'data': {
                    'id': report_card.id,
                    'student_course_id': report_card.student_course_id,
                    'pdf_url': report_card.report_pdf.url if report_card.report_pdf else None,
                    'generated_date': report_card.generated_date
                }
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetStudentReportCardsAPIView(APIView):
    """
    API View to get all report cards for a student (legacy support)
    """

    def get(self, request, student_course_id, *args, **kwargs):
        try:
            report_cards = StudentReportCard.objects.filter(
                student_course_id=student_course_id
            ).order_by('-generated_date')

            data = []
            for rc in report_cards:
                data.append({
                    'id': rc.id,
                    'student_course_id': rc.student_course_id,
                    'academic_year_id': rc.academic_year_id,
                    'semester_id': rc.semester_id,
                    'pdf_url': rc.report_pdf.url if rc.report_pdf else None,
                    'generated_date': rc.generated_date,
                    'is_published': rc.is_published,
                    'remarks': rc.remarks
                })

            return Response({
                'status': 'success',
                'count': len(data),
                'data': data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetStudentReportCardsByStudentIdAPIView(APIView):
    """
    API View to get all report cards for a student by student_id
    """

    def get(self, request, student_id, *args, **kwargs):
        try:
            report_cards = StudentReportCard.objects.filter(
                student_course__student_id=student_id
            ).select_related('student_course', 'academic_year', 'semester').order_by('-generated_date')

            data = []
            for rc in report_cards:
                course_name = None
                try:
                    if rc.student_course.course:
                        course_name = rc.student_course.course.course_name
                except:
                    pass

                data.append({
                    'id': rc.id,
                    'student_course_id': rc.student_course_id,
                    'course_name': course_name,
                    'academic_year_id': rc.academic_year_id,
                    'academic_year_code': rc.academic_year.academic_year_code if rc.academic_year else None,
                    'semester_id': rc.semester_id,
                    'semester_code': rc.semester.semester_code if rc.semester else None,
                    'pdf_url': rc.report_pdf.url if rc.report_pdf else None,
                    'generated_date': rc.generated_date,
                    'is_published': rc.is_published,
                    'remarks': rc.remarks
                })

            return Response({
                'status': 'success',
                'count': len(data),
                'data': data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)