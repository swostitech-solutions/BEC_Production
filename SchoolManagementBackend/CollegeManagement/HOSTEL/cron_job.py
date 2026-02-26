# myapp/cron.py
from .models import StudentHostelDetail
from Acadix.models import StudentCourse
from .models import Temp_Table_Hostel_Student
from django.utils import timezone
from datetime import timedelta

def load_temp_data():
    # clear old temp records
    Temp_Table_Hostel_Student.objects.all().delete()

    # load today's orders
    # orders = Order.objects.filter(
    #     created_at__gte=timezone.now() - timedelta(days=1)
    # )

    student_course_list = StudentCourse.objects.all()
    student_hostel_list = StudentHostelDetail.objects.all()
    # temp_objects = [
    #     TempOrderData(
    #         order_id=o.id,
    #         user_id=o.user_id,
    #         amount=o.amount
    #     )
    #     for o in orders
    # ]
    temp_objects = [
            Temp_Table_Hostel_Student(
                organization=student_course.organization,
                branch=student_course.branch,
                batch=student_course.batch,
                course=student_course.course,
                department=student_course.department,
                academic_year=student_course.academic_year,
                semester=student_course.semester,
                section=student_course.section,
                hostel=student_hostel.hostel,
                hostel_block=student_hostel.hostel_block,
                hostel_block_floor=student_hostel.hostel_block_floor,
                room_type=student_hostel.room_type,
                room=student_hostel.room,
                bed=student_hostel.bed,
                student_course=student_hostel.student_course,
                hostel_availed=student_course.hostel_availed,
                # is_active=student_hostel.organization
            )
            for student_course, student_hostel in zip(student_course_list,student_hostel_list)
        ]

    Temp_Table_Hostel_Student.objects.bulk_create(temp_objects)

    print("Temp table loaded:", len(temp_objects))
