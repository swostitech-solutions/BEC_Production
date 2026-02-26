import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Swostitech_Acadix.settings')
django.setup()

from Acadix.models import StudentRegistration, StudentCourse, FeeStructureDetail

def check_student_fee_config(student_name):
    print(f"Checking configuration for student: {student_name}")
    
    # 1. Find Student
    student = StudentRegistration.objects.filter(first_name__icontains=student_name).first()
    if not student:
        print("Student not found.")
        return

    print(f"Found Student: {student.first_name} {student.last_name}")

    # 2. Find Course/Fee Group
    sc = StudentCourse.objects.filter(student=student, is_active=True).first()
    if not sc:
        print("No active course found.")
        return

    fee_group = sc.fee_group
    if not fee_group:
        print("No Fee Group assigned.")
        return

    print(f"Assigned Fee Group: {fee_group.fee_structure_description} (ID: {fee_group.id})")

    # 3. Print Fee Rules
    details = FeeStructureDetail.objects.filter(fee_structure_master=fee_group)
    print("\n--- Fee Structure Configuration (What SHOULD be charged) ---")
    print(f"{'Element':<20} | {'Sem 1':<10} | {'Sem 2':<10} | {'Sem 3':<10} | {'Sem 4':<10} | {'Sem 5':<10} | {'Sem 6':<10}")
    print("-" * 100)
    for d in details:
        name = d.element_type.element_name
        s1 = d.semester_1 or 0
        s2 = d.semester_2 or 0
        s3 = d.semester_3 or 0
        s4 = d.semester_4 or 0
        s5 = d.semester_5 or 0
        s6 = d.semester_6 or 0
        print(f"{name:<20} | {s1:<10} | {s2:<10} | {s3:<10} | {s4:<10} | {s5:<10} | {s6:<10}")

if __name__ == "__main__":
    check_student_fee_config("Supriya")
