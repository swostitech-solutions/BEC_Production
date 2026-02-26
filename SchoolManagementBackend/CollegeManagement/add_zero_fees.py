import os
import django
import sys
from django.db import transaction

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Swostitech_Acadix.settings')
django.setup()

from Acadix.models import (
    StudentCourse, StudentFeeDetail, FeeStructureDetail, Semester, AcademicYear
)

def add_zero_fees_for_even_sems():
    print("Generating Zero-Fee Records for Even Semesters (for display purposes)...")

    # CONFIG: Semesters that should exist but have 0 fees
    # Batch Code -> List of Even Sems to Ensure
    CONFIG = {
        "2024-2028": ["2nd Semester", "4th Semester"], # 4th might be future, but let's add 2nd at least
        "2023-2027": ["2nd Semester", "4th Semester", "6th Semester"],
        "2025-2029": ["2nd Semester"]
    }

    # Find BSC Students
    for batch_code, target_sem_names in CONFIG.items():
        print(f"\nProcessing Batch {batch_code}...")
        
        students = StudentCourse.objects.filter(
            batch__batch_code=batch_code,
            course__course_name__icontains="BSC",
            is_active=True
        ).select_related('fee_group')
        
        if not students.exists():
            print("  No students found.")
            continue

        # Cache Semester Objects for this batch
        # Map: "2nd semester" -> {Object}
        sems_map = {}
        batch_sems = Semester.objects.filter(batch__batch_code=batch_code, course__course_name__icontains="BSC")
        for s in batch_sems:
            sems_map[s.semester_description.strip().lower()] = s
            
        count_added = 0
        
        with transaction.atomic():
            for sc in students:
                # We need "Course Fee" and "Hostel Fee" usually, to show row. 
                # Just "Course Fee" at 0 is enough to trigger the row display.
                
                rules = FeeStructureDetail.objects.filter(fee_structure_master=sc.fee_group)
                if not rules.exists(): continue
                rule_obj = rules.first() # Just for FK
                
                # Determine current student progress.
                # Don't add "4th Semester" if they are only in 3rd. 
                # Rule: Only add if Sem Number <= Current Sem
                
                curr_sem_str = sc.semester.semester_description.lower()
                curr_sem_num = 1
                if "2nd" in curr_sem_str: curr_sem_num = 2
                elif "3rd" in curr_sem_str: curr_sem_num = 3
                elif "4th" in curr_sem_str: curr_sem_num = 4
                elif "5th" in curr_sem_str: curr_sem_num = 5
                elif "6th" in curr_sem_str: curr_sem_num = 6

                for sem_name in target_sem_names:
                    # Check if this sem is valid for current student
                    target_num = int(sem_name.split('nd')[0].split('th')[0])
                    
                    if target_num > curr_sem_num:
                        continue # Skip future semesters
                        
                    target_sem_obj = sems_map.get(sem_name.lower())
                    if not target_sem_obj: continue
                    
                    # Need associated Academic Year for that semester
                    target_ay = target_sem_obj.academic_year
                    
                    # Check if exists
                    exists = StudentFeeDetail.objects.filter(
                        student=sc.student,
                        semester=target_sem_obj
                    ).exists()
                    
                    if exists: continue
                    
                    # Create Zero Record
                    # We create one entry "Course Fee" = 0.
                    StudentFeeDetail.objects.create(
                        student=sc.student,
                        student_course=sc,
                        organization=sc.organization,
                        branch=sc.branch,
                        department=sc.department,
                        academic_year=target_ay,
                        semester=target_sem_obj,
                        fee_group=sc.fee_group,
                        fee_structure_details=rule_obj,
                        element_name="Course Fee", # Placeholder element
                        element_amount=0,
                        total_element_period_amount=0,
                        paid_amount=0,
                        paid='N',
                        is_active=True,
                        created_by=1
                    )
                    count_added += 1

        print(f"  -> Added {count_added} zero-fee records.")

if __name__ == "__main__":
    add_zero_fees_for_even_sems()
