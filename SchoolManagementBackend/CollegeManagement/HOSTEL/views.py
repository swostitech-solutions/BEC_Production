import ast
import datetime
import json
from logging import raiseExceptions

from django.db import DatabaseError
from django.db.models import Q, Sum
from django.http import Http404
from datetime import datetime
# from utils import load_data_student_hostel
from django.shortcuts import render
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView, get_object_or_404, CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from Acadix.models import StudentCourse, ExceptionTrack, StudentFeeDetail, Period, FeeStructureMaster, \
    FeeStructureDetail, Batch, Organization, Semester, Branch
from Acadix.serializers import PeriodSerializer
from HOSTEL.models import StudentHostelDetail, Hostel, HostelBlock, HostelBlockFloor, HostelRoomType, HostelRoom, \
    HostelRoomBed

from HOSTEL.serializers import GetStudentHostelAvailOrNotListSerializer, \
    studentHostelFeesSearchSerializer, Hostel_Serializer, HostelDetailUpdateSerializer, Hostel_Block_Serializer, \
    Hostel_Block_Floor_Serializer, Hostel_Room_Type_Serializer, Hostel_Room_Serializer, Hostel_Room_Bed_Serializer, \
    UpdateHostelAvailOrNotUpdateSerializer, StudentHostelFeeGetBasedOnFeeAppliedFromSerializer
from Transport.serializers import StudentFeeGetBasedOnFeeAppliedFromSerializer


# UpdateHostelAvailOrNotUpdateSerializer


# Create your views here.


# class GetStudentHostelListAPIView(ListAPIView):
#     serializer_class = GetStudentHostelAvailOrNotListSerializer
#
#     def list(self, request, *args, **kwargs):
#         try:
#
#             serializer = self.get_serializer(data = request.query_params)
#             serializer.is_valid(raise_exception=True)
#
#             organization_id = serializer.validated_data.get('organization_id')
#             branch_id = serializer.validated_data.get('branch_id')
#             batch_id = serializer.validated_data.get('batch_id')
#             course_id = serializer.validated_data.get('course_id')
#             department_id = serializer.validated_data.get('department_id')
#             academic_year_id= serializer.validated_data.get('academic_year_id')
#             semester_id = serializer.validated_data.get('semester_id')
#             section_id = serializer.validated_data.get('section_id')
#             student_id = serializer.validated_data.get('student_id')
#             hostel_id = serializer.validated_data.get('hostel_id')
#             hostel_block_id = serializer.validated_data.get('hostel_block_id')
#             block_floor_id = serializer.validated_data.get('block_floor_id')
#             room_id = serializer.validated_data.get('room_id')
#             room_type_id = serializer.validated_data.get('room_type_id')
#             bed_id = serializer.validated_data.get('bed_id')
#
#             # section_id=1
#
#             if organization_id and branch_id:
#                 try:
#                     filterdata = StudentCourse.objects.filter(organization=organization_id, branch=branch_id,is_active=True).order_by('-updated_at')
#                 except StudentCourse.DoesNotExist:
#                     return Response({"message":"student course record not found !!!"}, status=status.HTTP_404_NOT_FOUND)
#             else:
#                 return Response({"message":"organization_id and branch_id is required !!!"}, status=status.HTTP_404_NOT_FOUND)
#
#             if organization_id and branch_id:
#                 try:
#                     filterdata = StudentCourse.objects.filter(organization=organization_id, branch=branch_id,is_active=True).order_by('-updated_at')
#                 except StudentCourse.DoesNotExist:
#                     return Response({"message":"student course record not found !!!"}, status=status.HTTP_404_NOT_FOUND)
#             else:
#                 return Response({"message":"organization_id and branch_id is required !!!"}, status=status.HTTP_404_NOT_FOUND)
#             # if not organization_id and not branch_id:
#             #     return Response({'message':'Please provide organization_id and branch_id'},status=status.HTTP_400_BAD_REQUEST)
#
#             # try:
#             #     filterdata= StudentCourse.objects.filter(organization=organization_id,branch=branch_id,is_active=True)
#             #
#             # except:
#             #     filterdata= None
#             # student_course_hostel_record = []
#
#             # student_course_hostel_record.append(filterdata)
#             filterdatacombined = []
#             try:
#                 hostelfilterdata= StudentHostelDetail.objects.filter(organization=organization_id,branch=branch_id,is_active=True)
#                 # filterdata = list(filterdata)
#                 # hostelfilterdata = list(hostelfilterdata)
#                 for item in hostelfilterdata:
#                     filterdatacombined.append(item)
#             except:
#                 filterdata= None
#
#             # print(filterdata)
#             responseData=[]
#             if filterdatacombined:
#                 filterdata = filterdatacombined
#                 if batch_id:
#                     filterdata = filterdata.filter(batch=batch_id)
#
#                 if course_id:
#                     filterdata = filterdata.filter(course=course_id)
#
#                 if department_id:
#                     filterdata = filterdata.filter(department=department_id)
#
#                 if academic_year_id:
#                     filterdata = filterdata.filter(academic_year=academic_year_id)
#
#                 if semester_id:
#                     filterdata = filterdata.filter(semester=semester_id)
#
#                 if section_id:
#                     filterdata = filterdata.filter(section=section_id)
#
#                 if student_id:
#                     filterdata = filterdata.filter(student=student_id)
#
#
#                 # if hostel_id:
#                 #     filterdata_id_list = filterdata.values_list('id',flat=True)
#                 #     filterdata = StudentHostelDetail.objects.filter(student_course__in = filterdata_id_list, is_active=True)
#                 #     # filterdata = filterdata.filter(hostel=hostel_id)
#                 #
#                 # if hostel_block_id:
#                 #     filterdata = filterdata.filter(hostel_block=section_id)
#                 #
#                 # if block_floor_id:
#                 #     filterdata = filterdata.filter(block_floor=block_floor_id)
#                 #
#                 # if room_type_id:
#                 #     filterdata = filterdata.filter(block_floor=block_floor_id)
#                 #
#                 # if room_id:
#                 #     filterdata = filterdata.filter(room=room_id)
#                 #
#                 # if bed_id:
#                 #     filterdata = filterdata.filter(bed=bed_id)
#                 #
#                 #
#
#
#
#                 # if bed_id:
#
#
#                 # Now check filter data availble or not
#
#                 if filterdata:
#                     # if hostel_id:
#                     for record in filterdata:
#                         name_parts = filter(
#                             None,
#                             [
#                                 record.student.first_name,
#                                 record.student.middle_name,
#                                 record.student.last_name,
#
#                             ],
#                         )
#                         student_name = " ".join(name_parts)
#
#                         # if not record.student_course:
#                         data = {
#                             "organization_id": organization_id,
#                             "organization_description": record.organization.organization_description,
#                             "branch_id": branch_id,
#                             "branch": record.branch.branch_name,
#                             "batch_id": batch_id,
#                             "batch": record.batch.batch_description,
#                             "course_id": record.course.id,
#                             "course_name": record.course.course_name,
#                             "department_id": record.department.id,
#                             "department_name": record.department.department_description,
#                             "academic_year_id": record.department.id,
#                             "academic_year_code": record.academic_year.academic_year_code,
#                             "section_id": record.section.id,
#                             "section_name": record.section.section_name,
#                             "enrollment_no": record.enrollment_no,
#                             "student_id": record.student.id,
#                             "student_name": student_name,
#                             "admission_no": record.student.admission_no,
#                             "barcode": record.student.barcode,
#                             "fatherName": record.student.father_name,
#                             "motherName": record.student.mother_name,
#                             "house_id": record.house.id,
#                             "house_nam": record.house.id,
#                             "hostel_availed": record.hostel_availed
#                         }
#                         responseData.append(data)
#                         # else:
#                         #     data = {
#                         #         "organization_id": organization_id,
#                         #         "organization_description": record.organization.organization_description,
#                         #         "branch_id": branch_id,
#                         #         "branch": record.branch.branch_name,
#                         #         "batch_id": batch_id,
#                         #         "batch": record.student_course.batch.batch_description,
#                         #         "course_id": record.student_course.course.id,
#                         #         "course_name": record.student_course.course.course_name,
#                         #         "department_id": record.student_course.department.id,
#                         #         "department_name": record.student_course.department.department_description,
#                         #         "academic_year_id": record.student_course.department.id,
#                         #         "academic_year_code": record.student_course.academic_year.academic_year_code,
#                         #         "section_id": record.student_course.section.id,
#                         #         "section_name": record.student_course.section.section_name,
#                         #         "enrollment_no": record.student_course.enrollment_no,
#                         #         "student_id": record.student_course.student.id,
#                         #         "student_name": student_name,
#                         #         "admission_no": record.student_course.student.admission_no,
#                         #         "barcode": record.student.barcode,
#                         #         "fatherName": record.student.father_name,
#                         #         "motherName": record.student.mother_name,
#                         #         "house_id": record.student_course.house.id,
#                         #         "house_nam": record.student_course.house.id,
#                         #         "hostel_availed": record.student_course.hostel_availed
#                         #
#                         #     }
#                         #     responseData.append(data)
#                     return Response({'message':'success','data':responseData},status=status.HTTP_200_OK)
#
#
#                 else:
#                     return Response({'message':'No Record Found'},status=status.HTTP_200_OK)
#
#             else:
#                 return Response({'message':'No record found'},status=status.HTTP_200_OK)
#
#         except Exception as e:
#             # Log the exception
#             error_message = str(e)
#             self.log_exception(request, error_message)
#             return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#
#     def log_exception(self, request, error_message):
#         ExceptionTrack.objects.create(
#             request=str(request),
#             process_name='StudentHostelList',
#             message=error_message,
#
#         )

class GetStudentHostelListAPIView(ListAPIView):
    serializer_class = GetStudentHostelAvailOrNotListSerializer

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
            student_id = serializer.validated_data.get('student_id')
            hostel_id = serializer.validated_data.get('hostel_id')
            hostel_block_id = serializer.validated_data.get('hostel_block_id')
            block_floor_id = serializer.validated_data.get('block_floor_id')
            room_type_id = serializer.validated_data.get('room_type_id')
            room_id = serializer.validated_data.get('room_id')

            bed_id = serializer.validated_data.get('bed_id')

            # section_id=1

            if organization_id and branch_id:
                try:
                    filterdata = StudentHostelDetail.objects.filter(organization=organization_id, branch=branch_id,
                                                              is_active=True).order_by('-updated_at')
                except StudentHostelDetail.DoesNotExist:
                    return Response({"message": "Student Hostel Detail record not found !!!"},
                                    status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"message": "organization_id and branch_id is required !!!"},
                                status=status.HTTP_404_NOT_FOUND)

            # if organization_id and branch_id:
            #     try:
            #         filterdata = StudentCourse.objects.filter(organization=organization_id, branch=branch_id,
            #                                                   is_active=True).order_by('-updated_at')
            #     except StudentCourse.DoesNotExist:
            #         return Response({"message": "student course record not found !!!"},
            #                         status=status.HTTP_404_NOT_FOUND)
            # else:
            #     return Response({"message": "organization_id and branch_id is required !!!"},
            #                     status=status.HTTP_404_NOT_FOUND)
            # if not organization_id and not branch_id:
            #     return Response({'message':'Please provide organization_id and branch_id'},status=status.HTTP_400_BAD_REQUEST)

            # try:
            #     filterdata= StudentCourse.objects.filter(organization=organization_id,branch=branch_id,is_active=True)
            #
            # except:
            #     filterdata= None
            # student_course_hostel_record = []

            # student_course_hostel_record.append(filterdata)
            # filterdatacombined = []
            # try:
            #     hostelfilterdata = StudentHostelDetail.objects.filter(organization=organization_id, branch=branch_id,
            #                                                           is_active=True)
            #     # filterdata = list(filterdata)
            #     # hostelfilterdata = list(hostelfilterdata)
            #     for item in hostelfilterdata:
            #         filterdatacombined.append(item)
            # except:
            #     filterdata = None

            # print(filterdata)
            responseData = []
            if filterdata:
                # filterdata = filterdatacombined
                if student_id:
                    filterdata = filterdata.filter(student=student_id)

                if batch_id:
                    filterdata = filterdata.filter(batch=batch_id)

                if course_id:
                    filterdata = filterdata.filter(student_course__course=course_id)

                if department_id:
                    filterdata = filterdata.filter(student_course__department=department_id)

                if academic_year_id:
                    filterdata = filterdata.filter(student_course__academic_year=academic_year_id)

                if semester_id:
                    filterdata = filterdata.filter(student_course__semester=semester_id)

                if section_id:
                    filterdata = filterdata.filter(student_course__section=section_id)

                if hostel_id:
                    filterdata = filterdata.filter(hostel=hostel_id)
                    # filterdata_id_list = filterdata.values_list('id',flat=True)
                    # filterdata = StudentHostelDetail.objects.filter(student_course__in = filterdata_id_list, is_active=True)
                    # filterdata = filterdata.filter(hostel=hostel_id)

                if hostel_block_id:
                    filterdata = filterdata.filter(hostel_block=section_id)

                if block_floor_id:
                    filterdata = filterdata.filter(hostel_block_floor=block_floor_id)

                if room_type_id:
                    filterdata = filterdata.filter(room_type=room_type_id)

                if room_id:
                    filterdata = filterdata.filter(room=room_id)

                if bed_id:
                    filterdata = filterdata.filter(bed=bed_id)


                # Now check filter data availble or not

                if filterdata:
                    # if hostel_id:
                    for record in filterdata:
                        name_parts = filter(
                            None,
                            [
                                record.student.first_name,
                                record.student.middle_name,
                                record.student.last_name,

                            ],
                        )
                        student_name = " ".join(name_parts)

                        # if not record.student_course:
                        data = {
                            "student_id": record.student.id,
                            "student_course_id": record.student_course.id,
                            "student_name": student_name,
                            "organization_id": organization_id,
                            "organization_description": record.organization.organization_description,
                            "branch_id": branch_id,
                            "branch": record.branch.branch_name,
                            "batch_id": batch_id,
                            "batch": record.student_course.batch.batch_description,
                            "course_id": record.student_course.course.id,
                            "course_name": record.student_course.course.course_name,
                            "department_id": record.student_course.department.id,
                            "department_name": record.student_course.department.department_description,
                            "academic_year_id": record.student_course.department.id,
                            "academic_year_code": record.student_course.academic_year.academic_year_code,
                            "semester_id": record.student_course.semester.id,
                            "semester_name": record.student_course.semester.semester_description,
                            "section_id": record.student_course.section.id,
                            "section_name": record.student_course.section.section_name,
                            "college_admission_no":record.student.college_admission_no,
                            "registration_no":record.student.registration_no,
                            "barcode":record.student.barcode,
                            # add key College Admission No.Barcode,Semester
                            "hostel_id": record.hostel.id,
                            "hostel_name": record.hostel.hostel_name,
                            "hostel_block_id": record.hostel_block.id,
                            "hostel_block_name": record.hostel_block.block_name,
                            "hostel_floor_id": record.hostel_block_floor.id,
                            "hostel_floor_number": record.hostel_block_floor.floor_number,
                            "hostel_room_type": record.room_type.id,
                            "hostel_room_type_name": record.room_type.room_type,
                            "hostel_room_id": record.room.id,
                            "hostel_room_number": record.room.room_number,
                            "hostel_bed_id": record.bed.id,
                            "hostel_bed_number": record.bed.bed_number,
                            "hostel_bed_cost": record.bed.bed_cost,
                            "choice_semester": record.choice_semester,
                            # "enrollment_no": record.enrollment_no,
                            # "student_id": record.student.id,

                            # "admission_no": record.student.admission_no,
                            # "barcode": record.student.barcode,
                            # "fatherName": record.student.father_name,
                            # "motherName": record.student.mother_name,
                            # "house_id": record.house.id,
                            # "house_nam": record.house.id,
                            # "hostel_availed": record.hostel_availed
                        }
                        responseData.append(data)

                    return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)


                else:
                    return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No record found'}, status=status.HTTP_200_OK)

        except Exception as e:
            # Log the exception
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='StudentHostelList',
            message=error_message,

        )


class StudentHostelDetailsRetrieveAPIView(RetrieveAPIView):
    # serializer_class = PeriodSerializer

    def retrieve(self, request, *args, **kwargs):
        # fee_Structure_Data = []
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            student_id = request.query_params.get('student_id')

            # Get Student Details Into StudentCourse Table

            if organization_id and branch_id and student_id:
                try:
                    StudentHostelDetailInstance = StudentHostelDetail.objects.get(organization=organization_id, branch=branch_id, student=student_id, is_active=True)
                except StudentHostelDetail.DoesNotExist:
                    return Response({"message":"student hostel detail record not found !!!"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"message":"organization_id, branch_id and student_id is required !!!"}, status=status.HTTP_404_NOT_FOUND)



            # try:
            #
            #     studentCourseInstance= StudentCourse.objects.get(organization=organization_id,branch=branch_id,student=student_id,is_active=True)
            # except:
            #     return Response({'message':'student course record not found'},status=status.HTTP_404_NOT_FOUND)



            # Get Hostel Applied Month Details
            # hostel_choose_month=[]
            # try:
            #     HostelAppliedDetailsRecord = StudentFeeDetail.objects.filter(
            #         academic_year=studentCourseInstance.academic_year.id,
            #         organization=studentCourseInstance.student.organization.id,
            #         batch=studentCourseInstance.student.batch.id,
            #         branch=studentCourseInstance.student.branch.id,
            #         student=student_id,
            #         element_name="HOSTEL FEES",is_active=True)
            #
            # except :
            #     HostelAppliedDetailsRecord= None

            # Get Particular month list which applied by student
            # semester_list =[]
            # fee_applied_from = []
            #
            # if HostelAppliedDetailsRecord:
            #     for record in HostelAppliedDetailsRecord:
            #         if record.fee_applied_from not in semester_list:
            #             semester_list.append(record.fee_applied_from)






            # Check HOSTEL FEES paid or not on this particular academic year & month
            # feeappfrom_ids = StudentFeeDetail.objects.filter(
            # student=studentCourseInstance.student,
            # element_name="HOSTEL FEES",
            # academic_year=studentCourseInstance.academic_year,
            # organization=studentCourseInstance.student.organization,
            # # batch=studentCourseInstance.student.batch,
            # branch=studentCourseInstance.student.branch,
            # paid_amount__gt=0.00,
            # is_active=True
            # ).values_list('fee_applied_from__id', flat=True)


            # for semester in semester_list:
            #     # Get Period Instance
            #     try:
            #         semesterInstance = Semester.objects.get(id=semester,is_active=True)
            #     except:
            #         return Response
            #
            #     data={
            #         'id': semesterInstance.id,
            #         'semester_description': semesterInstance.semester_description,
            #         # 'period_start_date': semesterInstance.period_start_date,
            #         # 'period_end_date': semesterInstance.period_end_date,
            #         'flag': "No" if semester in feeappfrom_ids else "Yes"
            #     }
            #
            #     hostel_choose_month.append(data)












            #     # Make Response Data

            name_parts = filter(
                None,
                [
                    StudentHostelDetailInstance.student.first_name,
                    StudentHostelDetailInstance.student.middle_name,
                    StudentHostelDetailInstance.student.last_name,

                ],
            )
            student_name = " ".join(name_parts)

            # if not feeappfrom_ids:
            #     fee_Structure_Instance = FeeStructureDetail.objects.all()
            #     for record in fee_Structure_Instance:
            #         data = {
            #             'id': record.id,
            #             'FeeStructureMaster_id_id': record.FeeStructureMaster_id_id,
            #             'element_type_id_id': record.element_type_id_id,
            #             'element_frequency_id': record.element_frequency_id,
            #             'amount': record.amount,
            #             'period_1': record.period_1,
            #             'period_2':record.period_2,
            #             'period_3':record.period_3,
            #             'period_4':record.period_4,
            #             'period_5':record.period_5,
            #             'period_6':record.period_6,
            #             'adjustment_flag':record.adjustment_flag,
            #             'is_active':record.is_active,
            #             'created_by':record.created_by,
            #             'updated_by':record.updated_by,
            #             'created_at':record.created_at,
            #             'updated_at':record.updated_at
            #         }
            #         fee_Structure_Data.append(data)


            # if not hostel_choose_month:
            #     semesterInstance = Semester.objects.all()
            #     for record in semesterInstance:
            #         data = {
            #             'id': record.id,
            #             'semester_description': record.semester_description,
            #             # 'period_start_date': record.period_start_date,
            #             # 'period_end_date': record.period_end_date,
            #             'flag': studentCourseInstance.hostel_availed
            #             # 'flag': "No" if record in feeappfrom_ids else "Yes"
            #         }
            #
            #         hostel_choose_month.append(data)
            choice_semester_list = []
            if StudentHostelDetailInstance.choice_semester != None:
                choice_semester_list.append(ast.literal_eval(StudentHostelDetailInstance.choice_semester))

            responseData={
                "student_id":StudentHostelDetailInstance.student.id,
                "student_name": student_name,
                "admission_no": StudentHostelDetailInstance.student.admission_no,
                "barcode": StudentHostelDetailInstance.student.barcode,
                "father_name": StudentHostelDetailInstance.student.father_name,
                "mother_name": StudentHostelDetailInstance.student.mother_name,
                "college_admission_no": StudentHostelDetailInstance.student.college_admission_no,
                "hostel_id": StudentHostelDetailInstance.hostel.id,
                "hostel_name": StudentHostelDetailInstance.hostel.hostel_name,
                "block_id": StudentHostelDetailInstance.hostel_block.id,
                "block_name": StudentHostelDetailInstance.hostel_block.block_name,
                "floor_id": StudentHostelDetailInstance.hostel_block_floor.id,
                "floor_number": StudentHostelDetailInstance.hostel_block_floor.floor_number,
                "room_type_id": StudentHostelDetailInstance.room_type.id,
                "room_type": StudentHostelDetailInstance.room_type.room_type,
                "room_id": StudentHostelDetailInstance.room.id,
                "room_number": StudentHostelDetailInstance.room.room_number,
                "bed_id": StudentHostelDetailInstance.bed.id,
                "bed_number": StudentHostelDetailInstance.bed.bed_number,
                "fee_applied_from_id": choice_semester_list[0] if choice_semester_list else ""
                # "hostel_avail": studentCourseInstance.hostel_availed,
                # "choice_month":hostel_choose_month,
                # "fee_structure":fee_Structure_Data

            }

            return Response({'message':'success',"data":responseData},status=status.HTTP_200_OK)

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

            process_name='GetHostelDetailsByStudent',

            message=error_message,

        )



class UpdateHostelDetailsUpdateAPIView(UpdateAPIView):
    serializer_class = UpdateHostelAvailOrNotUpdateSerializer

    def update(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # organization,branch,hostel,hostel_block,hostel_block_floor,room_type,room,bed,choice_semester,student,student_course
            organization_id = serializer.validated_data.get("organization_id")
            branch_id = serializer.validated_data.get("branch_id")
            choice_semester_ids = serializer.validated_data.get("choice_semester_ids")
            hostel_avail = serializer.validated_data.get("hostel_avail")
            student_id = serializer.validated_data.get("student_id")
            created_by = serializer.validated_data.get("created_by")
            # hostel_id = serializer.validated_data.get("hostel_id")
            # hostel_block_id = serializer.validated_data.get("hostel_block_id")
            # hostel_block_floor_id = serializer.validated_data.get("hostel_block_floor_id")
            # room_type_id = serializer.validated_data.get("room_type_id")
            # room_id = serializer.validated_data.get("room_id")
            # bed_id = serializer.validated_data.get("bed_id")



            # student_course_id = serializer.validated_data.get("student_course_id")



            # HostelInstance = Hostel.objects.get(id=hostel_id, organization=organization_id,branch=branch_id,is_active=True)
            # HostelBlockInstance = HostelBlock.objects.get(id=hostel_block_id,organization=organization_id,branch=branch_id,is_active=True)
            # HostelBlockFloorInstance = HostelBlockFloor.objects.get(id=hostel_block_floor_id,organization=organization_id,branch=branch_id,is_active=True)
            # HostelRoomTypeInstance = HostelRoomType.objects.get(id=room_type_id,organization=organization_id,branch=branch_id,is_active=True)
            # HostelRoomInstance = HostelRoom.objects.get(id=room_id,organization=organization_id,branch=branch_id,is_active=True)
            # HostelRoomBedInstance = HostelRoomBed.objects.get(id=bed_id,organization=organization_id,branch=branch_id,is_active=True)


            # validation part
            if not student_id:
                return Response({'message': 'Please provide student Id'}, status=status.HTTP_400_BAD_REQUEST)

            if hostel_avail == True and not choice_semester_ids:
                return Response({'message': 'Please choose at least one choice_semester'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Get Student Instance
            try:
                studentCourseInstance = StudentCourse.objects.get(student=student_id, is_active=True)
            except:
                return Response({'message': 'Student Record Not Found'}, status=status.HTTP_404_NOT_FOUND)

            # Get Student fee details

            # try:
            #     studentfeedetails_record = StudentFeeDetail.objects.filter(
            #         student=studentCourseInstance.student.id,
            #         # academic_year= studentCourseInstance.academic_year.id,
            #         organization= studentCourseInstance.student.organization_id,
            #         branch= studentCourseInstance.student.batch.id,
            #         element_name="Hostel Fees",
            #         is_active=True
            #     ).filter(Q(paid_amount=0) | Q(paid_amount__isnull=True))
            #
            #     # Check if records exist
            #     if studentfeedetails_record.exists():
            #         studentfeedetails_record.update(is_active=False)
            #
            # except StudentFeeDetail.DoesNotExist:
            #     studentfeedetails_record = None



            if choice_semester_ids:
                # semester_instance = Semester.objects.get()

                # Get Hostel fee structure Instance

                # try:
                #     fee_structure_detail_instance = FeeStructureDetail.objects.get(
                #         # fee_structure_master__academic_year=studentCourseInstance.academic_year,
                #         fee_structure_master__organization=studentCourseInstance.student.organization,
                #         fee_structure_master__branch=studentCourseInstance.student.branch,
                #         fee_structure_master__batch=studentCourseInstance.student.batch,
                #         fee_structure_master__course=studentCourseInstance.course,
                #         fee_structure_master__department=studentCourseInstance.department,
                #         fee_structure_master__academic_year=studentCourseInstance.academic_year,
                #         fee_structure_master__semester__in=choice_semester_ids,
                #         # fee_structure_master__section=studentCourseInstance.section,
                #         element_type__element_name="Hostel Fees",
                #         element_frequency_id = 1,
                #         fee_structure_master__is_active=True,
                #         is_active=True
                #     )
                #
                #     # total_amount = fee_structure_detail_instance.aggregate(total_amount=Sum('amount'))['total_amount']
                #
                #     if fee_structure_detail_instance.amount is None:
                #         return Response({'message': 'No fee structure details found for this academic year.'},
                #                         status=status.HTTP_404_NOT_FOUND)
                #
                #
                #
                # except Exception as e:
                #     return Response({'message': 'An error occurred.', 'error': str(e)},
                #                     status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                #


                # get Fee Master Instance
                # try:
                #     hostelfeestructureInstance = FeeStructureMaster.objects.get(
                #         organization=studentCourseInstance.student.organization,
                #         branch=studentCourseInstance.student.branch,
                #         batch=studentCourseInstance.student.batch,
                #         course=studentCourseInstance.course,
                #         department=studentCourseInstance.department,
                #         academic_year=studentCourseInstance.academic_year,
                #         semester=studentCourseInstance.semester,
                #         fee_structure_description= "Hostel Fees",
                #         is_active=True
                #     )
                # except FeeStructureMaster.DoesNotExist:
                #     return Response({'message': 'Fee structure not found for this academic year.'},
                #                     status=status.HTTP_404_NOT_FOUND)
                # except Exception as e:
                #     return Response({'message': 'An error occurred.' + str(e)},
                #                     status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                # organization,branch,hostel,hostel_block,hostel_block_floor,room_type,room,bed,choice_semester,student,student_course
                # Update Student Hostel Record
                # student_hostel_detail_instance = StudentHostelDetail.objects.get(student=student_id, is_active=True)
                # if student_hostel_detail_instance:
                #     student_hostel_detail_instance.organization = Organization.objects.get(id=organization_id)
                #     student_hostel_detail_instance.branch = Branch.objects.get(id=branch_id)
                #     student_hostel_detail_instance.hostel = HostelInstance
                #     student_hostel_detail_instance.hostel_block = HostelBlockInstance
                #     student_hostel_detail_instance.hostel_block_floor = HostelBlockFloorInstance
                #     student_hostel_detail_instance.room_type = HostelRoomTypeInstance
                #     student_hostel_detail_instance.room = HostelRoomInstance
                #     student_hostel_detail_instance.bed = HostelRoomBedInstance
                #     student_hostel_detail_instance.choice_semester = choice_semester_ids
                #     student_hostel_detail_instance.student = studentCourseInstance.student
                #     student_hostel_detail_instance.student_course= studentCourseInstance
                #     student_hostel_detail_instance.save()
                #
                # else:
                #     try:
                #         StudentHostelDetail.objects.create(
                #             organization = studentCourseInstance.organization,
                #             branch = studentCourseInstance.branch,
                #             hostel = HostelInstance,
                #             hostel_block=HostelBlockInstance,
                #             hostel_block_floor=HostelBlockFloorInstance,
                #             room_type=HostelRoomTypeInstance,
                #             room=HostelRoomInstance,
                #             bed=HostelRoomBedInstance,
                #             choice_semester=choice_semester_ids,
                #             student=studentCourseInstance.student,
                #             student_course=studentCourseInstance,
                #             is_active=True,
                #             created_by = created_by,
                #             created_at  = datetime.now()
                #         )
                #     except Exception as e:
                #         return Response({'message': 'error occurs' + str(e)},
                #                     status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                # for choice_semester in choice_semester_ids:
                #     try:
                #         choice_semester_instance = Semester.objects.get(id=choice_semester,is_active=True)
                #     except Semester.DoesNotExist:
                #         return Response({"message":f"Semester record not found with id {choice_semester} !!!"}, status=status.HTTP_404_NOT_FOUND)
                    # try:
                    #     fee_structure_detail_instance = FeeStructureDetail.objects.get(
                    #         # fee_structure_master__academic_year=studentCourseInstance.academic_year,
                    #         fee_structure_master__organization=studentCourseInstance.student.organization,
                    #         fee_structure_master__branch=studentCourseInstance.student.branch,
                    #         fee_structure_master__batch=studentCourseInstance.student.batch,
                    #         fee_structure_master__course=studentCourseInstance.course,
                    #         fee_structure_master__department=studentCourseInstance.department,
                    #         fee_structure_master__academic_year=studentCourseInstance.academic_year,
                    #         fee_structure_master__semester=choice_semester_instance,
                    #         # fee_structure_master__section=studentCourseInstance.section,
                    #         element_type__element_name="Hostel Fees",
                    #         element_frequency_id=1,
                    #         fee_structure_master__is_active=True,
                    #         is_active=True
                    #     )

                        # total_amount = fee_structure_detail_instance.aggregate(total_amount=Sum('amount'))['total_amount']

                        # if fee_structure_detail_instance.amount is None:
                        #     return Response({'message': 'No fee structure details found for this academic year.'},
                        #                     status=status.HTTP_404_NOT_FOUND)



                    # except Exception as e:
                    #     return Response({'message': 'An error occurred.', 'error': str(e)},
                    #                     status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    # Insert the record into student details database
                    # try:
                    #     student_fee_details= StudentFeeDetail.objects.create(
                    #         student=studentCourseInstance.student,
                    #         student_course=studentCourseInstance,
                    #         fee_group=None,
                    #         # fee_group=hostelfeestructureInstance,
                    #         fee_structure_details=None,
                    #         element_name= "Hostel Fees" ,
                    #         fee_applied_from=choice_semester_instance,
                    #         paid='N',
                    #         academic_year= studentCourseInstance.academic_year,
                    #         organization= studentCourseInstance.student.organization,
                    #         branch= studentCourseInstance.student.branch,
                    #         department=studentCourseInstance.department,
                    #         multiplying_factor= 1,
                    #         element_amount= fee_structure_detail_instance.amount,
                    #         # element_amount= total_amount,
                    #         total_element_period_amount= fee_structure_detail_instance.amount,
                    #         # total_element_period_amount= total_amount,
                    #         paid_amount= 0.00,
                    #         created_by= created_by,
                    #         updated_by = created_by
                    #     )
                    # except Exception as e:
                    #     return Response({'message':'error occurs'+str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Update the student record
            #     prev choice semesters
                if studentCourseInstance.hostel_choice_semester:
                    choice_semesters = ast.literal_eval(studentCourseInstance.hostel_choice_semester)
                else:
                    choice_semesters = []
                # new choice semester
                for item in choice_semester_ids:
                    choice_semesters.append(item)
                studentCourseInstance.temp_hostel_choice_semester = choice_semester_ids
                studentCourseInstance.hostel_availed = hostel_avail
                studentCourseInstance.hostel_choice_semester = choice_semesters    # updated choice semester
                studentCourseInstance.save()

            return Response({'message':'success'},status=status.HTTP_200_OK)


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
            process_name='HostelDetailsUpdate',
            message=error_message,
        )





class AssignStudentHostelCreate_UpdateAPI(CreateAPIView):
    serializer_class = HostelDetailUpdateSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # organization,branch,hostel,hostel_block,hostel_block_floor,room_type,room,bed,choice_semester,student,student_course
            organization_id = serializer.validated_data.get("organization_id")
            branch_id = serializer.validated_data.get("branch_id")
            hostel_id = serializer.validated_data.get("hostel_id")
            hostel_block_id = serializer.validated_data.get("hostel_block_id")
            hostel_block_floor_id = serializer.validated_data.get("hostel_block_floor_id")
            room_type_id = serializer.validated_data.get("room_type_id")
            room_id = serializer.validated_data.get("room_id")
            bed_id = serializer.validated_data.get("bed_id")
            choice_semester_ids = serializer.validated_data.get("choice_semester_ids")
            hostel_avail = serializer.validated_data.get("hostel_avail")
            student_id = serializer.validated_data.get("student_id")
            # student_course_id = serializer.validated_data.get("student_course_id")
            created_by = serializer.validated_data.get("created_by")


            HostelInstance = Hostel.objects.get(id=hostel_id, organization=organization_id,branch=branch_id,is_active=True)
            HostelBlockInstance = HostelBlock.objects.get(id=hostel_block_id,organization=organization_id,branch=branch_id,is_active=True)
            HostelBlockFloorInstance = HostelBlockFloor.objects.get(id=hostel_block_floor_id,organization=organization_id,branch=branch_id,is_active=True)
            HostelRoomTypeInstance = HostelRoomType.objects.get(id=room_type_id,organization=organization_id,branch=branch_id,is_active=True)
            HostelRoomInstance = HostelRoom.objects.get(id=room_id,organization=organization_id,branch=branch_id,is_active=True)
            HostelRoomBedInstance = HostelRoomBed.objects.get(id=bed_id,organization=organization_id,branch=branch_id,is_active=True)


            # validation part
            if not student_id:
                return Response({'message': 'Please provide student Id'}, status=status.HTTP_400_BAD_REQUEST)

            # if hostel_avail == True and not choice_semester_ids:
            #     return Response({'message': 'Please choose at least one choice_semester'},
            #                     status=status.HTTP_400_BAD_REQUEST)

            # Get Student Instance
            try:
                studentCourseInstance = StudentCourse.objects.get(student=student_id, is_active=True)
            except:
                return Response({'message': 'Student course Record Not Found'}, status=status.HTTP_404_NOT_FOUND)

            # Get Student fee details

            # try:
            #     studentfeedetails_record = StudentFeeDetail.objects.filter(
            #         student=studentCourseInstance.student.id,
            #         # academic_year= studentCourseInstance.academic_year.id,
            #         organization= studentCourseInstance.student.organization_id,
            #         branch= studentCourseInstance.student.batch.id,
            #         element_name="Hostel Fees",
            #         is_active=True
            #     ).filter(Q(paid_amount=0) | Q(paid_amount__isnull=True))
            #
            #     # Check if records exist
            #     if studentfeedetails_record.exists():
            #         studentfeedetails_record.update(is_active=False)

            # except StudentFeeDetail.DoesNotExist:
            #     studentfeedetails_record = None

            if not hostel_avail:
                return Response({"message":"Hostel not availed by student !!!"}, status=status.HTTP_404_NOT_FOUND)

            if hostel_avail:

                # Get Hostel fee structure Instance

                # try:
                #     fee_structure_detail_instance = FeeStructureDetail.objects.filter(
                #         # fee_structure_master__academic_year=studentCourseInstance.academic_year,
                #         fee_structure_master__organization=studentCourseInstance.student.organization,
                #         fee_structure_master__branch=studentCourseInstance.student.branch,
                #         fee_structure_master__fee_structure_description="Hostel Fees",
                #         element_frequency_id = 1,
                #         fee_structure_master__is_active=True,
                #         is_active=True
                #     )
                #
                #     total_amount = fee_structure_detail_instance.aggregate(total_amount=Sum('amount'))['total_amount']
                #
                #     if total_amount is None:
                #         return Response({'message': 'No fee structure details found for this academic year.'},
                #                         status=status.HTTP_404_NOT_FOUND)
                #
                #
                #
                # except Exception as e:
                #     return Response({'message': 'An error occurred.', 'error': str(e)},
                #                     status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                #
                #
                #
                # # get Fee Master Instance
                # try:
                #     hostelfeestructureInstance = FeeStructureMaster.objects.get(
                #         academic_year=studentCourseInstance.academic_year,
                #         organization=studentCourseInstance.student.organization,
                #         batch=studentCourseInstance.student.batch,
                #         fee_structure_description= "Hostel Fees",
                #         is_active=True
                #     )
                # except FeeStructureMaster.DoesNotExist:
                #     return Response({'message': 'Fee structure not found for this academic year.'},
                #                     status=status.HTTP_404_NOT_FOUND)
                # except Exception as e:
                #     return Response({'message': 'An error occurred.' + str(e)},
                #                     status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                # organization,branch,hostel,hostel_block,hostel_block_floor,room_type,room,bed,choice_semester,student,student_course
                # Update Student Hostel Record
                # student_hostel_detail_instance = StudentHostelDetail.objects.get(student=student_id, is_active=True)
                # if student_hostel_detail_instance:
                #     student_hostel_detail_instance.organization = Organization.objects.get(id=organization_id)
                #     student_hostel_detail_instance.branch = Branch.objects.get(id=branch_id)
                #     student_hostel_detail_instance.hostel = HostelInstance
                #     student_hostel_detail_instance.hostel_block = HostelBlockInstance
                #     student_hostel_detail_instance.hostel_block_floor = HostelBlockFloorInstance
                #     student_hostel_detail_instance.room_type = HostelRoomTypeInstance
                #     student_hostel_detail_instance.room = HostelRoomInstance
                #     student_hostel_detail_instance.bed = HostelRoomBedInstance
                #     student_hostel_detail_instance.choice_semester = choice_semester_ids
                #     student_hostel_detail_instance.student = studentCourseInstance.student
                #     student_hostel_detail_instance.student_course= studentCourseInstance
                #     student_hostel_detail_instance.save()
                #
                #     bed = student_hostel_detail_instance.bed
                #     bed.is_available = False
                #     bed.save()
                #
                # else:
                #     try:
                #         StudentHostelRecord = StudentHostelDetail.objects.create(
                #             organization = studentCourseInstance.organization,
                #             branch = studentCourseInstance.branch,
                #             hostel = HostelInstance,
                #             hostel_block=HostelBlockInstance,
                #             hostel_block_floor=HostelBlockFloorInstance,
                #             room_type=HostelRoomTypeInstance,
                #             room=HostelRoomInstance,
                #             bed=HostelRoomBedInstance,
                #             choice_semester=choice_semester_ids,
                #             student=studentCourseInstance.student,
                #             student_course=studentCourseInstance,
                #             is_active=True,
                #             created_by = created_by,
                #             created_at  = datetime.now()
                #         )
                #         bed = StudentHostelRecord.bed
                #         bed.is_available = False
                #         bed.save()
                #     except Exception as e:
                #         return Response({'message': 'error occurs' + str(e)},
                #                     status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                # Update Student Course Instance logic
                if studentCourseInstance.hostel_choice_semester:
                    try:
                        choice_semesters = ast.literal_eval(studentCourseInstance.hostel_choice_semester)
                        if not isinstance(choice_semesters, list):
                            choice_semesters = []
                    except:
                        choice_semesters = []
                else:
                    choice_semesters = []

                if choice_semester_ids:
                    for item in choice_semester_ids:
                        if item not in choice_semesters:
                            choice_semesters.append(item)
                
                studentCourseInstance.temp_hostel_choice_semester = str(choice_semester_ids)
                studentCourseInstance.hostel_choice_semester = str(choice_semesters)
                studentCourseInstance.hostel_availed = hostel_avail
                studentCourseInstance.save()
                
                # Retrieve existing hostel detail logic
                try:
                    StudentHostelDetailRecord = StudentHostelDetail.objects.filter(student=student_id,is_active=True).first()
                except Exception:
                    StudentHostelDetailRecord = None

                # Update or Create Hostel Detail
                try:
                    StudentHostelRecord, created = StudentHostelDetail.objects.update_or_create(
                        student = student_id,
                        defaults={
                            "organization" : studentCourseInstance.organization,
                            "branch" : studentCourseInstance.branch,
                            "hostel" : HostelInstance,
                            "hostel_block" : HostelBlockInstance,
                            "hostel_block_floor" : HostelBlockFloorInstance,
                            "room_type" : HostelRoomTypeInstance,
                            "room" : HostelRoomInstance,
                            "bed" : HostelRoomBedInstance,
                            "choice_semester" : studentCourseInstance.hostel_choice_semester,
                            "student" : studentCourseInstance.student,
                            "student_course" : studentCourseInstance,
                            "is_active" : True,
                            "created_by" : created_by,
                            "created_at" : datetime.now()
                        }
                    )
                    
                    # Manage bed availability
                    if created:
                        bed = StudentHostelRecord.bed
                        bed.is_available = False
                        bed.save()
                    else:
                        # If updated and bed changed
                        if StudentHostelDetailRecord and StudentHostelDetailRecord.bed.id != bed_id:
                            prev_bed = StudentHostelDetailRecord.bed
                            prev_bed.is_available = True
                            prev_bed.save()
                            bed = StudentHostelRecord.bed
                            bed.is_available = False
                            bed.save()
                except Exception as e:
                    return Response({'message': 'error occurs' + str(e)},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                # Fee Details Creation
                # Fee Details Creation
                if choice_semester_ids:
                    # Determine fee_applied_from - take the first semester in the choice list as the starting point
                    fee_applied_from_instance = None
                    try:
                         # Use the first semester from the payload as fee_applied_from
                         first_sem_id = choice_semester_ids[0]
                         fee_applied_from_instance = Semester.objects.get(id=first_sem_id, is_active=True)
                    except Exception as e:
                         # Log error but proceed? Or fail? Best to fail if we can't determine base semester
                         pass

                    for choice_semester in choice_semester_ids:
                        try:
                            choice_semester_instance = Semester.objects.get(id=choice_semester,is_active=True)
                            
                            # Check if fee already exists to prevent duplicates
                            existing_fee = StudentFeeDetail.objects.filter(
                                student=studentCourseInstance.student,
                                student_course=studentCourseInstance,
                                element_name__iexact="Hostel Fees",
                                semester=choice_semester_instance,
                                is_active=True
                            ).exists()

                            if not existing_fee and fee_applied_from_instance:
                                StudentFeeDetail.objects.create(
                                    student=studentCourseInstance.student,
                                    student_course=studentCourseInstance,
                                    fee_group=None,
                                    fee_structure_details=None,
                                    element_name= "Hostel Fees" ,
                                    fee_applied_from=fee_applied_from_instance,
                                    semester=choice_semester_instance,
                                    paid='N',
                                    academic_year= studentCourseInstance.academic_year,
                                    organization= studentCourseInstance.student.organization,
                                    branch= studentCourseInstance.student.branch,
                                    department=studentCourseInstance.department,
                                    multiplying_factor= 1,
                                    element_amount= StudentHostelRecord.bed.bed_cost,
                                    total_element_period_amount= StudentHostelRecord.bed.bed_cost,
                                    paid_amount= 0.00,
                                    created_by= created_by,
                                    updated_by = created_by,
                                    is_active=True
                                )
                        except Exception as e:
                            # Log or handle individual failure? For now assuming if one fails we might want to return error or continue
                            return Response({'message':'error occurs creating fee details: '+str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Cleanup temp field
            studentCourseInstance.temp_hostel_choice_semester = None
            studentCourseInstance.hostel_availed = hostel_avail
            studentCourseInstance.save()



            return Response({'message':'success'},status=status.HTTP_200_OK)


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
            process_name='StudentHostelAssign',
            message=error_message,
        )




class StudentHostelFeesListAPIView(ListAPIView):
    serializer_class = studentHostelFeesSearchSerializer

    def list(self, request, *args, **kwargs):
        try:
            academic_year_id = request.query_params.get('academic_year_id')
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            batch_id = request.query_params.get('batch_id')
            student_id = request.query_params.get('student_id')
            course_id = request.query_params.get('course_id')
            section_id =request.query_params.get('section_id')
            fee_applied_from_id = request.query_params.get('fee_applied_from_id')
            unpaid = request.query_params.get('unpaid')

            # print(academic_year_id, organization_id, batch_id)

            if not organization_id and not batch_id:
                return Response({'message':'Please provide organization_id and branch_id'},status=status.HTTP_400_BAD_REQUEST)


            # Get student_class record based on academic year & Organization And branch
            try:
                filterdata = StudentCourse.objects.filter(academic_year= academic_year_id,organization=organization_id,branch=branch_id,batch=batch_id,hostel_availed=True,is_active=True)
            except:
                filterdata=None

            if filterdata:

                # Filter student Id
                if student_id:
                    filterdata=filterdata.filter(student=student_id)

                if course_id:
                    filterdata= filterdata.filter(course= course_id)

                # if section_id:
                #     filterdata= filterdata.filter(section=section_id)





                # Extract student IDs from the filtered student_class queryset
                students = filterdata.values_list('student', flat=True)

                if not students:
                    return Response({'message': 'No matching student records found'}, status=status.HTTP_200_OK)

                # Filter student_fee_details based on the filtered student_ids
                student_fee_qs = StudentFeeDetail.objects.filter(
                    # academic_year=academic_year_id,
                    organization= organization_id,
                    # batch=batch_id,
                    branch=branch_id,
                    student__in=students,
                    element_name__iexact="Hostel Fees",
                    # element_name="HOSTEL FEES",
                    is_active=True
                )



                # calculate student wise chage amount and paid amount


                semester_list = []
                if fee_applied_from_id:


                    # Get feeappfrom range

                    # semester = get_object_or_404(Semester, id=fee_applied_from_id)

                    # Filter periods where sorting_order is less than or equal to the current period's sorting_order
                    # filtered_semesters = Semester.objects.filter(id__lte=semester.id)

                    # Extract only the list of IDs
                    # filtered_semester_ids = list(filtered_semesters.values_list('id', flat=True))

                    # Filter student_fee_qs where feeapplicable_from is in filtered_period_ids
                    student_fee_qs = student_fee_qs.filter(semester_id=fee_applied_from_id)
                    for item in student_fee_qs:
                        semester_instance = Semester.objects.get(id=item.semester.id)
                        semester_list.append(
                            {"id": semester_instance.id,"semester": semester_instance.semester_description}
                        )
                    # student_fee_qs = student_fee_qs.filter(fee_applied_from__in=filtered_semester_ids)
                else:

                    # student_fee_qs = StudentFeeDetail.objects.filter(semester_id=)

                    for item in student_fee_qs:
                        semester_instance = Semester.objects.get(id=item.semester.id)
                        semester_list.append(
                            {"id": semester_instance.id,"semester": semester_instance.semester_description}
                        )

                studentWise_data = student_fee_qs.values('student_id', 'semester').annotate(
                    total_element_amount=Sum('element_amount'),
                    total_paid_amount=Sum('paid_amount')
                )

                if unpaid.lower() == 'true'  :
                    studentWise_data = studentWise_data.filter(total_paid_amount=0)

                total_amount = 0
                total_paid_amount = 0
                if studentWise_data:
                    responseData=[]
                    for item in studentWise_data:
                        try:
                            studentcourseInstance = StudentCourse.objects.get(student=item.get('student_id'),is_active=True)
                        except:
                            return Response({'message': 'Student Record not found'},status=status.HTTP_404_NOT_FOUND)

                        total_amount += item.get("total_element_amount")
                        total_paid_amount += item.get("total_paid_amount")

                        name_parts = filter(
                            None,
                            [
                                studentcourseInstance.student.first_name,
                                studentcourseInstance.student.middle_name,
                                studentcourseInstance.student.last_name,

                            ],
                        )
                        student_name = " ".join(name_parts)
                        fee_period = ""
                        if fee_applied_from_id:
                            try:
                                fee_period = Semester.objects.get(id=fee_applied_from_id).semester_description
                            except Semester.DoesNotExist:
                                fee_period = ""
                    data={
                        "course_id": studentcourseInstance.course.id,
                        "course_name": studentcourseInstance.course.course_name,
                        "semester_id":studentcourseInstance.semester.id,
                        "semester":studentcourseInstance.semester.semester_description,
                        "section_id": studentcourseInstance.section.id,
                        "section_name": studentcourseInstance.section.section_name,
                        # "fee_period_id":fee_applied_from_id,
                        # "fee_period":fee_period,
                        "semester_list": semester_list,
                        "student_id": studentcourseInstance.student.id,
                        "student_name": student_name,
                        "course_admission_no": studentcourseInstance.student.college_admission_no,
                        "registration_no": studentcourseInstance.student.registration_no,
                        "father_name": studentcourseInstance.student.father_name,
                        "total_fees": total_amount,
                        "paid_fees": total_paid_amount
                    }

                    responseData.append(data)
                    return Response({'message':'success','data':responseData},status=status.HTTP_200_OK)

                else:
                    return Response({'message':'No Record Found'},status=status.HTTP_200_OK)

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

            process_name='HostelChargesCalculate',

            message=error_message,

        )


class StudentAllFeesCalculationBasedOnElement(ListAPIView):
    serializer_class = StudentHostelFeeGetBasedOnFeeAppliedFromSerializer

    def list(self, request, *args, **kwargs):
        try:
            student_id= request.query_params.get("student_id")
            fee_applied_from_id = request.query_params.get("fee_applied_from_id")
            academic_year_id = request.query_params.get("academic_year_id")
            organization_id = request.query_params.get("organization_id")
            branch_id = request.query_params.get("branch_id")

            #print(student_id,feeappfrom,academicyearId,organization_id,branch_id)

            if not student_id :
                return Response({'message':"please provide student_Id"},status=status.HTTP_400_BAD_REQUEST)
            if not fee_applied_from_id :
                return Response({'message':"please provide fee_applied_from_id"},status=status.HTTP_400_BAD_REQUEST)
            #dmessage':"please provide academic_year_id"},status=status.HTTP_400_BAD_REQUEST)
            if not organization_id :
                return Response({'message':"please provide  organization_id"},status=status.HTTP_400_BAD_REQUEST)
            if not branch_id:
                return Response({'message':"please provide branch_id"},status=status.HTTP_400_BAD_REQUEST)

            try:
                student_fee_record= StudentFeeDetail.objects.filter(student=student_id,organization=organization_id,
                                                                       branch=branch_id,fee_applied_from=fee_applied_from_id,element_name__iexact='Hostel Fees',is_active=True)
            except:
                student_fee_record= None
            if not student_fee_record.exists():
                return Response({'message':"No Record Found"},status=status.HTTP_200_OK)

            fee_summary = student_fee_record.values("fee_applied_from", "element_name","semester").annotate(
                total_amount=Sum("element_amount"),
                total_paid_amount=Sum("paid_amount")
            ).order_by("fee_applied_from")

            semester_list=[]
            for item in fee_summary:
                semester_instance = Semester.objects.get(id=item.get("semester"))
                semester_list.append([{"id":semester_instance.id},{"semester":semester_instance.semester_description}])


            if fee_summary:
                responseData=[]
                for item in fee_summary:
                    try:
                        semesterInstance = Semester.objects.get(id=item.get("fee_applied_from"))
                    except:
                        return Response({'message':"No fee_applied_from record found"},status=status.HTTP_400_BAD_REQUEST)
                    data={
                        "fee_applied_from": semesterInstance.semester_description,
                        "semester": semesterInstance.semester_description,
                        "element_name": item.get("element_name"),
                        "total_amount": item.get("total_amount"),
                        "total_paid_amount": item.get("total_paid_amount"),
                        "semester_list": semester_list
                    }
                    responseData.append(data)

                return Response({'message':'success','data':responseData},status=status.HTTP_200_OK)


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

            process_name='MonthlyElemetWiseStudentFees',

            message=error_message,

        )



class GetHostelList(APIView):
    def get(self,request):
        organization_id = request.query_params.get('organization_id')
        branch_id = request.query_params.get('branch_id')

        if not (organization_id and branch_id):
            return Response({"message":"organization_id and branch_id is required !!!"}, status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                hostels = Hostel.objects.filter(organization=organization_id, branch=branch_id, is_active=True)
            except Hostel.DoesNotExist:
                return Response({"message": "hostel record not found !!!"},
                                status=status.HTTP_404_NOT_FOUND)
            serializer = Hostel_Serializer(hostels, many=True)
            return Response(serializer.data)

class GetHostelBlockList(APIView):
    def get(self,request):
        organization_id = request.query_params.get('organization_id')
        branch_id = request.query_params.get('branch_id')
        hoste_id = request.query_params.get('hostel_id')

        if not (organization_id and branch_id and hoste_id):
            return Response({"message":"organization_id, branch_id and hostel_id is required !!!"}, status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                hostelblock= HostelBlock.objects.filter(organization=organization_id, branch=branch_id,hostel=hoste_id, is_active=True)
            except HostelBlock.DoesNotExist:
                return Response({"message": "hostel_block record not found !!!"},
                                status=status.HTTP_404_NOT_FOUND)
            serializer = Hostel_Block_Serializer(hostelblock, many=True)
            return Response(serializer.data)


class GetHostelBlockFloorList(APIView):
    def get(self,request):
        organization_id = request.query_params.get('organization_id')
        branch_id = request.query_params.get('branch_id')
        hoste_id = request.query_params.get('hostel_id')
        hostel_block_id = request.query_params.get('hostel_block_id')

        if not (organization_id and branch_id and hoste_id and hostel_block_id):
            return Response({"message":"organization_id, branch_id, hostel_id and hostel_block_id is required !!!"}, status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                hostel_block_floor_instance= HostelBlockFloor.objects.filter(organization=organization_id, branch=branch_id,hostel=hoste_id,hostel_block=hostel_block_id, is_active=True)
            except HostelBlockFloor.DoesNotExist:
                return Response({"message": "hostel_block record not found !!!"},
                                status=status.HTTP_404_NOT_FOUND)
            serializer = Hostel_Block_Floor_Serializer(hostel_block_floor_instance, many=True)
            return Response(serializer.data)


class GetHostelRoomTypeList(APIView):
    def get(self,request):
        organization_id = request.query_params.get('organization_id')
        branch_id = request.query_params.get('branch_id')
        hoste_id = request.query_params.get('hostel_id')
        # hostel_block_id = request.query_params.get('hostel_block_id')
        # hostel_block_floor_id = request.query_params.get('hostel_block_floor_id')

        if not (organization_id and branch_id and hoste_id):
            return Response({"message":"organization_id, branch_id, hostel_id is required !!!"}, status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                hostel_room_type_instance= HostelRoomType.objects.filter(organization=organization_id, branch=branch_id,hostel=hoste_id,is_active=True)
            except HostelRoomType.DoesNotExist:
                return Response({"message": "hostel_room_type record not found !!!"},
                                status=status.HTTP_404_NOT_FOUND)
            serializer = Hostel_Room_Type_Serializer(hostel_room_type_instance, many=True)
            return Response(serializer.data)

class GetHostelRoomList(APIView):
    def get(self,request):
        organization_id = request.query_params.get('organization_id')
        branch_id = request.query_params.get('branch_id')
        hostel_id = request.query_params.get('hostel_id')
        hostel_block_id = request.query_params.get('hostel_block_id')
        hostel_block_floor_id = request.query_params.get('hostel_block_floor_id')
        room_type_id = request.query_params.get('room_type_id')
        # hostel_room_type = request.query_params.get('hostel_room_type')


        if not (organization_id and branch_id and hostel_id and hostel_block_id and hostel_block_floor_id and room_type_id):
            return Response({"message":"organization_id, branch_id, hostel_id, hostel_block_id and room_type_id is required !!!"}, status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                hostel_room_instance= HostelRoom.objects.filter(organization=organization_id, branch=branch_id,hostel=hostel_id,hostel_block=hostel_block_id,hostel_block_floor=hostel_block_floor_id,room_type=room_type_id, is_active=True)
            except HostelBlockFloor.DoesNotExist:
                return Response({"message": "hostel_record not found !!!"},
                                status=status.HTTP_404_NOT_FOUND)
            serializer = Hostel_Room_Serializer(hostel_room_instance, many=True)
            return Response(serializer.data)

class GetHostelRoomBedList(APIView):
    def get(self,request):
        organization_id = request.query_params.get('organization_id')
        branch_id = request.query_params.get('branch_id')
        hostel_id = request.query_params.get('hostel_id')
        hostel_block_id = request.query_params.get('hostel_block_id')
        hostel_block_floor_id = request.query_params.get('hostel_block_floor_id')
        room_type_id = request.query_params.get('room_type_id')
        room_id = request.query_params.get('room_id')
        # hostel_room_type = request.query_params.get('hostel_room_type')


        if not (organization_id and branch_id and hostel_id and hostel_block_id and hostel_block_floor_id and room_type_id and room_id):
            return Response({"message":"organization_id, branch_id, hostel_id, hostel_block_id,hostel_block_floor_id,room_type_id and room_id is required !!!"}, status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                hostel_room_bed_instance= HostelRoomBed.objects.filter(organization=organization_id, branch=branch_id,hostel=hostel_id,hostel_block=hostel_block_id,hostel_block_floor_id=hostel_block_floor_id,room_type_id=room_type_id,room=room_id, is_active=True)
            except HostelRoomBed.DoesNotExist:
                return Response({"message": "hostel_room_bed record not found !!!"},
                                status=status.HTTP_404_NOT_FOUND)
            serializer = Hostel_Room_Bed_Serializer(hostel_room_bed_instance, many=True)
            return Response(serializer.data)




