from django.db.models import Sum, Case, When, F, Count
from django.db.models import Sum, Case, When, Value, DecimalField
from django.db.models.functions import TruncDate
from django.http import Http404

from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from Acadix.models import Attendance, StudentCourse, ExceptionTrack, Course, Section, CourseSemesterSectionBind, \
    StudentFeeReceiptHeader, StudentFeeReceiptDetail, StudentFeeDetail, AcademicYear, Department, Batch
from DASHBOARD_APP.serializers import AttendanceDashboardSerializer, FeesDashboardSerializer, FeesDuesSerializer, \
    FeesDuesSearchSerializer, LibraryDashboardSerializer
from Library.models import LibraryBooksIssues, LibraryBooksBarcode


# Create your views here.

class AttendanceDashBoardListAPIView(ListAPIView):
    serializer_class = AttendanceDashboardSerializer

    def list(self, request, *args, **kwargs):
        try:
            serializer= self.get_serializer(data=request.query_params)
            serializer.is_valid(raise_exception=True)

            # get Attendance Student on this date
            try:
                Attendance_Record = Attendance.objects.filter(
                            # academic_year_id=serializer.validated_data.get('academic_year_id'),
                            organization=serializer.validated_data.get('organization_id'),
                            branch=serializer.validated_data.get('branch_id'),
                            batch=serializer.validated_data.get('batch_id'),
                            attendance_date=serializer.validated_data.get('date'),
                            is_active=True
                        )




            except:
                Attendance_Record =[]

            total_student = StudentCourse.objects.filter(
                                                         organization=serializer.validated_data.get('organization_id'),
                                                         branch=serializer.validated_data.get('branch_id'),
                                                         batch= serializer.validated_data.get('batch_id'),
                                                         is_active=True
                                                         ).count()


            if Attendance_Record:
                present_student= Attendance_Record.filter(present__iexact="P").count()
                absent_student = Attendance_Record.filter(present__iexact="A").count()
                leave_student = Attendance_Record.filter(present__iexact="L").count()
                not_marked_student= Attendance_Record.filter(present__iexact="").count()

                response_data={
                    'total_student':total_student,
                    'present_student': present_student,
                    'absent_student': absent_student,
                    'leave_student': leave_student,
                    'not_marked_student': not_marked_student
                }

                return Response({'message':'success','data':response_data},status=status.HTTP_200_OK)
            else:
                response_data={
                    'total_student': total_student,
                    'present_student': 0,
                    'absent_student': 0,
                    'leave_student': 0,
                    'not_marked_student': 0

                }

                return Response({'message':'success','data':response_data},status=status.HTTP_200_OK)


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

            process_name='AttendanceDashboard',

            message=error_message,

        )
class AttendanceCourseSemesterSectionWiseListAPIView(ListAPIView):
    serializer_class = AttendanceDashboardSerializer

    def list(self, request, *args, **kwargs):
        try:
            serializer= self.get_serializer(data=request.query_params)
            serializer.is_valid(raise_exception=True)

            organization_id = serializer.validated_data.get('organization_id')
            branch_id = serializer.validated_data.get('branch_id')
            batch_id = serializer.validated_data.get('batch_id')
            attendance_date = serializer.validated_data.get('date')

            try:
                # ATTENDANCE_RECORD= Attendance.objects.filter(
                #     # academic_year_id= serializer.validated_data.get('academic_year_id'),
                #     organization= organization_id,
                #     branch = branch_id,
                #     batch = batch_id,
                #     attendance_date = attendance_date,
                #     is_active=True
                # ).order_by('course','department','academic_year','semester','section')
                ATTENDANCE_RECORD = Attendance.objects.filter(
                    organization=organization_id,
                    branch=branch_id,
                    batch=batch_id,
                    attendance_date=attendance_date,
                    is_active=True
                )
                Attendance_data = (ATTENDANCE_RECORD.values(
                    'course__course_name',
                    'department__department_description',
                    'academic_year__academic_year_code',
                    'semester__semester_description',
                    'section__section_name',
                ).annotate(
                    total_student=Count('student', distinct=True),
                    # total_present=Count()
                ).order_by(
                    'course',
                    'department',
                    'academic_year',
                    'semester',
                    'section',
                ))

            except:
                ATTENDANCE_RECORD=[]



            # Get Class And Section List

            # course_list = Course.objects.filter(organization=organization_id,branch=branch_id,batch=batch_id,is_active=True)
            # for course in course_list:
            #     department_list = Department.objects.filter(organization=organization_id,branch=branch_id,batch=batch_id,course=course,is_active=True)
            #     for department in department_list:
            #         academic_year_list = AcademicYear.objects.filter(organization=organization_id,branch=branch_id,batch=batch_id,is_active=True)
            #     semester_list = AcademicYear.objects.filter(organization=organization_id,branch=branch_id,batch=batch_id,is_active=True)
            #     section_list= Section.objects.filter(organization=organization_id,branch=branch_id,batch=batch_id,is_active=True)

            if ATTENDANCE_RECORD :
                response_data=[]

                total_present_student = ATTENDANCE_RECORD.filter(present__iexact="P").count()
                total_absent_student = ATTENDANCE_RECORD.filter(present__iexact="A").count()
                total_leave_student = ATTENDANCE_RECORD.filter(present__iexact="L").count()
                not_marked_student = ATTENDANCE_RECORD.filter(present__iexact="").count()
                for item in Attendance_data:
                    data = {
                        'course_name': item.get('course__course_name'),
                        'department': item.get('department__department_description'),
                        'academic_year': item.get('academic_year__academic_year_code'),
                        'semester': item.get('semester__semester_description'),
                        'section_name': item.get('section__section_name'),
                        'total_student': item.get('total_student'),
                        # 'total_student': ATTENDANCE_RECORD.count(),
                        'total_present': total_present_student,
                        'total_absent': total_absent_student,
                        'total_leave': total_leave_student,
                        'not_marked_student': not_marked_student
                    }
                    response_data.append(data)
                return Response({'message': 'success', 'data': response_data}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No Record Found'}, status=status.HTTP_204_NO_CONTENT)
            #     for course in course_list:
            #         for sec in section_list:
            #
            #
            #             # filter the record based on class and section
            #             try:
            #                 courseSemesterSectionBindInstance= CourseSemesterSectionBind.objects.get(course=course.id,sectionname= sec.id,is_active=True)
            #             except:
            #                 continue
            #                # return Response({'message':f'not bind {cls.classname} with {sec.sectionname} '},status=status.HTTP_404_NOT_FOUND)
            #
            #
            #             try:
            #
            #                 coursewiserecord= ATTENDANCE_RECORD.filter(class_session_id=courseSemesterSectionBindInstance.id)
            #             except:
            #                 coursewiserecord = None
            #
            #
            #             if coursewiserecord:
            #
            #
            #                 total_present_student = coursewiserecord.filter(present__iexact="P").count()
            #                 total_absent_student = coursewiserecord.filter(present__iexact="A").count()
            #                 total_leave_student = coursewiserecord.filter(present__iexact="L").count()
            #                 not_marked_student = coursewiserecord.filter(present__iexact="").count()
            #
            #
            #
            #                 data={
            #                     'course_name': courseSemesterSectionBindInstance.course.classname,
            #                     'section_name': courseSemesterSectionBindInstance.section.sectionname,
            #                     'total_student': coursewiserecord.count(),
            #                     'total_present': total_present_student,
            #                     'total_absent': total_absent_student,
            #                     'total_leave': total_leave_student,
            #                     'not_marked_student': not_marked_student
            #                 }
            #                 response_data.append(data)
            #
            #             else:
            #                 # Count Student available on this particular class and section
            #                 student_course_record= StudentCourse.objects.filter(academic_year=serializer.validated_data.get('academic_year_id'),
            #                                                                     organization= serializer.validated_data.get('organization_id'),
            #                                                                     branch= serializer.validated_data.get('branch_id'),
            #                                                                     course=course.id,
            #                                                                     section=sec,
            #                                                                     is_active=True)
            #                 data = {
            #                     'course_name':course.course_name,
            #                     'section_name': sec.section_name,
            #                     'total_student': student_course_record.count(),
            #                     'total_present': 0,
            #                     'total_absent': 0,
            #                     'total_leave': 0,
            #                     'not_marked_student': 0
            #                 }
            #                 response_data.append(data)
            #
            #     return Response({'message':'success','data':response_data},status=status.HTTP_200_OK)
            #
            #
            # else:
            #     return Response({'message':'No Record Found'},status=status.HTTP_204_NO_CONTENT)


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

            process_name='AttendanceDashboardBasedOnDependencyFilters',

            message=error_message,

        )

class FeesDashboardListAPIView(ListAPIView):
    serializer_class = FeesDashboardSerializer

    def list(self, request, *args, **kwargs):
        try:
            serializer= self.get_serializer(data=request.query_params)
            serializer.is_valid(raise_exception=True)

            organization_id = serializer.validated_data.get('organization_id')
            branch_id = serializer.validated_data.get('branch_id')
            batch_id = serializer.validated_data.get('batch_id')
            from_date = serializer.validated_data.get('from_date')
            to_date = serializer.validated_data.get('to_date')

            # default search based on academic & org and branch ID

            try:
                filterdata = StudentFeeReceiptDetail.objects.filter(
                    # receipt__academic_year_id=serializer.validated_data.get('academic_year_id'),
                    receipt__organization= organization_id,
                    receipt__branch = branch_id,
                    receipt__batch = batch_id,
                    receipt_id__receipt_status='APPROVED',
                    is_active=True
                )
            except:
                return Response({'message':'No Record Found'},status=status.HTTP_204_NO_CONTENT)

            print(filterdata)



            # try:
            #     filterdata = SCHStdFeeReceiptHeader.objects.filter(
            #         academic_year_id=serializer.validated_data.get('academic_year_id'),
            #         student_id__org_id= serializer.validated_data.get('org_id'),
            #         student_id__branch_id = serializer.validated_data.get('branch_id'),
            #         receipt_status='APPROVED',
            #         is_active=True
            #     )
            # except:
            #     return Response({'message':'No Record Found'},status=status.HTTP_204_NO_CONTENT)

            # make validation from_date or to_date must be needed
            # if serializer.validated_data.get('from_date') or serializer.validated_data.get('to_date'):
            #     return Response({'message':'Must be pass from_date or to_date'},status=status.HTTP_400_BAD_REQUEST)

            # search based on from date

            if from_date:
                filterdata = filterdata.filter(
                    receipt__receipt_date__gte=serializer.validated_data.get('from_date')
                )

            if to_date:
                filterdata = filterdata.filter(
                    receipt__receipt_date__lte=serializer.validated_data.get('to_date')
                )

            if filterdata:

                grouped_data = (
                    filterdata
                    .annotate(receipt_date=TruncDate('receipt__receipt_date'))
                    .values('receipt_date')
                    .annotate(
                        total_amount=Sum(
                            Case(
                                When(amount__gte=0, then='amount'),  # Only include non-negative amounts
                                default=Value(0),
                                output_field=DecimalField()
                            )
                        ),
                        total_discount=Sum('discount_amount'),  # Includes both positive and negative
                    )
                    .order_by('receipt_date')
                )

                response_data=[]
                for item in grouped_data:

                    data={
                        "receipt_date":item.get("receipt_date"),
                        "received_amount": item.get("total_amount"),
                        "discount_amount": item.get("total_discount")

                    }

                    response_data.append(data)

                return Response({'message':'success','data':response_data},status=status.HTTP_200_OK)

            else:
                return Response({'message':'No Record Found'},status=status.HTTP_204_NO_CONTENT)
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

            process_name='FeesDashboard',

            message=error_message,

        )
class FeesDuesListAPIView(ListAPIView):
    serializer_class = FeesDuesSerializer

    def list(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.query_params)
            serializer.is_valid(raise_exception=True)

            # Get record based on academic & org_id and branch_id
            organization_id = serializer.validated_data.get('organization_id')
            branch_id = serializer.validated_data.get('branch_id')
            batch_id = serializer.validated_data.get('batch_id')

            try:
                filterdata = StudentFeeDetail.objects.filter(
                    # academic_year_id=serializer.validated_data.get('academic_year_id'),
                    organization= organization_id,
                    branch= branch_id,
                    student_course__batch= batch_id,
                    is_active=True

                )
            except:

                filterdata=[]

            if filterdata:

                # Calculate element amount, paid amount,discount amount and
                group_data = filterdata.annotate(
                    element_positive=Case(
                        When(element_amount__gt=0, then=F('element_amount')),
                        default=Value(0),
                        output_field=DecimalField()
                    ),
                    element_negative=Case(
                        When(element_amount__lt=0, then=F('element_amount')),
                        default=Value(0),
                        output_field=DecimalField()
                    ),
                    paid_positive=Case(
                        When(paid_amount__gt=0, then=F('paid_amount')),
                        default=Value(0),
                        output_field=DecimalField()
                    )
                )

                # Get academic year Instance
                try:
                    batchInstance = Batch.objects.get(id=batch_id)
                except:
                    return Response({'message':'No Batch record found'},status=status.HTTP_400_BAD_REQUEST)

                batch= {'batch':batchInstance.batch_code}
                result = group_data.aggregate(

                    element_amount=Sum('element_positive'),
                    total_paid_amount=Sum('paid_positive'),
                    total_discount_amount=Sum('element_negative')

                        # output_field=DecimalField()
                    )

                # Include academic year
                result.update(batch)





                return Response({'message':'success','data':result},status=status.HTTP_200_OK)

            else:
                return Response({'message':'No Record Found'},status=status.HTTP_204_NO_CONTENT)

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

            process_name='FeesDashBoardCalculate',

            message=error_message,

        )
class FeesDuesSearchListAPIView(ListAPIView):
    serializer_class = FeesDuesSearchSerializer

    def list(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.query_params)
            serializer.is_valid(raise_exception=True)

            organization_id = serializer.validated_data.get('organization_id')
            branch_id = serializer.validated_data.get('branch_id')
            batch_id = serializer.validated_data.get('batch_id')
            from_date = serializer.validated_data.get('from_date')
            to_date = serializer.validated_data.get('to_date')

            # Filter data SCHStdFeeReceiptHeader
            filterdata= StudentFeeReceiptHeader.objects.filter(
                # academic_year_id=serializer.validated_data.get('academic_year_id'),
                organization= organization_id,
                branch= branch_id,
                receipt_date__gte= from_date,
                receipt_date__lte = to_date,
                receipt_status= 'APPROVED',
                is_active=True
            )

            # make response
            response_data=[]
            for item in filterdata:

                # Student Class Instance
                studentCourseInstance = StudentCourse.objects.get(student_id=item.student.id,is_active=True)

                name_part = filter(None, [
                    studentCourseInstance.student.first_name,
                    studentCourseInstance.student.middle_name,
                    studentCourseInstance.student.last_name

                ])
                student_name = " ".join(name_part)


                data={
                    'date':item.receipt_date,
                    'receipt_no': item.receipt_no,
                    'fee_applied_from':item.semester.semester_description,
                    'student_name':student_name,
                    'course_name':studentCourseInstance.course.course_name,
                    'department_name':studentCourseInstance.department.department_description,
                    'section_name': studentCourseInstance.section.section_name,
                    'registration_no': studentCourseInstance.student.registration_no,
                    'payment_method': item.payment_method.payment_method,
                    'receipt_amount': item.receipt_amount,
                }
                response_data.append(data)
            return Response({'message':'success','data':response_data},status=status.HTTP_200_OK)

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

            process_name='FeesDueSearch',

            message=error_message,

        )



class LibraryDashBoardListAPIView(ListAPIView):
    serializer_class = LibraryDashboardSerializer

    def list(self, request, *args, **kwargs):
        try:
            serializer=self.get_serializer(data=request.query_params)
            serializer.is_valid(raise_exception=True)

            organization_id= serializer.validated_data.get('organization_id')
            branch_id= serializer.validated_data.get('branch_id')
            batch_id= serializer.validated_data.get('batch_id')

            # Get No of different user issued


            # Count distinct student IDs who have issued books
            distinct_student_ids = LibraryBooksIssues.objects.filter(
                is_active=True,
                student__isnull=False,
                book_detail__book__organization= organization_id,
                book_detail__book__batch__branch=branch_id,
                book_detail__book__batch=batch_id
            ).values_list('student_id', flat=True).distinct()

            # Count distinct teacher IDs who have issued books
            distinct_professor_ids = LibraryBooksIssues.objects.filter(
                is_active=True,
                professor__isnull=False,
                book_detail__book__organization=organization_id,
                book_detail__book__batch__branch=branch_id,
                book_detail__book__batch=batch_id
            ).values_list('professor_id', flat=True).distinct()

            # Combine both and calculate total unique users
            unique_user_ids = set(distinct_student_ids).union(set(distinct_professor_ids))
            total_distinct_users = len(unique_user_ids)

            # print(total_distinct_users)

            # Total No of books count
            no_of_books = LibraryBooksBarcode.objects.filter(
                organization=organization_id,
                batch__branch=branch_id,
                batch=batch_id,
                is_active=True
            )
            total_no_of_books = len(no_of_books)
            # print(total_no_of_books)

            # count total book title
            no_of_book_title = no_of_books.values('book_id').distinct().count()

            # count total issued book
            book_issued_result = LibraryBooksIssues.objects.filter(
                book_detail__book__organization = organization_id,
                book_detail__book__batch__branch = branch_id,
                book_detail__book__batch = batch_id,
                # return_date__isnull=False,
                is_active=True
            )

            total_book_issued = len(book_issued_result)

            # Count return books
            return_books_result= book_issued_result.filter(return_date__isnull=False)

            total_return_book=len(return_books_result)

            data={
                'total_no_of_books':total_no_of_books,
                'no_of_book_title':no_of_book_title,
                'total_book_issued':total_book_issued,
                'total_return_book':total_return_book
            }

            return Response({'message':'success','data':data},status=status.HTTP_200_OK)


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

            process_name='LibraryDashBoard',

            message=error_message,

        )