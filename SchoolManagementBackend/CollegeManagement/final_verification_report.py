import os
import django
import sys
from django.db.models import Sum, Count, Q

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Swostitech_Acadix.settings')
django.setup()

from Acadix.models import StudentCourse, StudentFeeDetail, AcademicYear, Semester

def final_verification_report():
    print("==================================================================================")
    print("                        FINAL FEE DATABASE VERIFICATION REPORT                     ")
    print("==================================================================================")

    # ================= EXPECTATIONS CONFIGURATION =================
    
    # GNM: Annual System. Key = Batch Start Year. Value = { YearNum: {Element: Amount} }
    # Logic: Expect "Default Semester" + Academic Year "Nth year"
    gnm_expectations = {
        "2023": {
            1: {"Course Fee": 102000, "Hostel Fee": 48000},
            2: {"Course Fee": 102000, "Hostel Fee": 60000},
            3: {"Course Fee": 102000, "Hostel Fee": 60000},
        },
        "2024": {
            1: {"Course Fee": 165000, "Hostel Fee": 60000},
            2: {"Course Fee": 165000, "Hostel Fee": 60000},
        },
        "2025": {
            1: {"Course Fee": 105000, "Hostel Fee": 60000},
        }
    }

    # BSC: Semester System. Key = Batch Start Year. Value = { SemName: {Element: Amount} }
    # Logic: Expect ODD sems to have fees, EVEN sems to have 0 (or not be checked if 0 is implied empty)
    # We will check explicitly for the ODD sems having the right amount.
    bsc_expectations = {
        "2023": {
            "1st Semester": {"Course Fee": 112000, "Hostel Fee": 48000},
            "2nd Semester": {"Course Fee": 0, "Hostel Fee": 0},
            "3rd Semester": {"Course Fee": 112000, "Hostel Fee": 53000},
            "4th Semester": {"Course Fee": 0, "Hostel Fee": 0},
            "5th Semester": {"Course Fee": 112000, "Hostel Fee": 53000},
        },
        "2024": {
            "1st Semester": {"Course Fee": 115000, "Hostel Fee": 60000},
            "2nd Semester": {"Course Fee": 0, "Hostel Fee": 0},
            "3rd Semester": {"Course Fee": 115000, "Hostel Fee": 60000},
        },
        "2025": {
            "1st Semester": {"Course Fee": 115000, "Hostel Fee": 66000},
        }
    }

    # ================= PROCESSING GNM =================
    print("\n--- GNM (Annual System Logic Check) ---")
    print("Logic Handle: All records linked to 'Default Semester'. Differentiated by 'Academic Year' field (1st, 2nd, 3rd).")
    
    for batch_year, rules in gnm_expectations.items():
        print(f"\n[Batch GNM {batch_year}] Verifying...")
        
        # Find Students
        students = StudentCourse.objects.filter(
            course__course_name__icontains="GNM",
            batch__batch_code__startswith=batch_year,
            is_active=True
        )
        total_studs = students.count()
        if total_studs == 0:
            print(f"  No students found for GNM starting {batch_year} ??")
            continue
            
        print(f"  Checking {total_studs} students...")
        
        perfect_count = 0
        issues = []
        
        for sc in students:
            is_perfect = True
            
            # Get all active fee details for student
            fees = StudentFeeDetail.objects.filter(student=sc.student, is_active=True)
            
            # Check each Expected Year
            for year, expected_amts in rules.items():
                
                # Filter fees matching this Year (by checking academic_year name)
                # And ensure semester is Default
                year_fees = [f for f in fees if f"year" in f.academic_year.academic_year_code.lower() and f"{year}" in f.academic_year.academic_year_code and "default" in f.semester.semester_description.lower()]
                
                if not year_fees:
                    # If the student is OLDER than this year, it's an error. 
                    # If they are currently IN this year, or have passed it, it must exist.
                    # We assume verification against their MAX current year.
                    # Simple check: Does record exist?
                    # Note: If student is in 1st year, they won't have 2nd year data.
                    # We should only check up to their CURRENT Academic Year.
                    
                    student_curr_year_str = sc.academic_year.academic_year_code.lower()
                    curr_year_num = 1
                    if "2nd" in student_curr_year_str: curr_year_num = 2
                    elif "3rd" in student_curr_year_str: curr_year_num = 3
                    
                    if year > curr_year_num:
                        # Future year, expected to be missing. OK.
                        continue
                    else:
                        is_perfect = False
                        issues.append(f"Student {sc.student.url_id if hasattr(sc.student,'url_id') else sc.student.first_name} missing records for Year {year}")
                        break

                # Verify Amount
                for el_type, amt in expected_amts.items():
                    matched_amt = None
                    for f in year_fees:
                        if el_type.lower() in f.element_name.lower():
                            matched_amt = f.element_amount
                            break
                    
                    if matched_amt is None:
                        is_perfect = False
                        issues.append(f"Student {sc.student.first_name} missing {el_type} for Year {year}")
                    elif float(matched_amt) != float(amt):
                        is_perfect = False
                        issues.append(f"Student {sc.student.first_name} Year {year} {el_type}: Found {matched_amt}, Expected {amt}")
            
            if is_perfect: perfect_count += 1
            if len(issues) > 5: break # Don't spam
            
        print(f"  Result: {perfect_count}/{total_studs} students are 100% correct up to their current year.")
        if issues:
            print("  Sample Issues:")
            for i in issues[:3]: print(f"   - {i}")

    # ================= PROCESSING BSC =================
    print("\n--- BSC (Semester System Logic Check) ---")
    print("Logic Handle: Records separated by Semester. Odd Sems have full fee. Even Sems have 0.")

    for batch_year, rules in bsc_expectations.items():
        print(f"\n[Batch BSC {batch_year}] Verifying...")
        
        students = StudentCourse.objects.filter(
            course__course_name__icontains="BSC",
            batch__batch_code__startswith=batch_year,
            is_active=True
        )
        total_studs = students.count()
        if total_studs == 0:
            print(f"  No students found for BSC starting {batch_year}")
            continue
            
        print(f"  Checking {total_studs} students...")
        perfect_count = 0
        issues = []
        
        for sc in students:
            is_perfect = True
            fees = StudentFeeDetail.objects.filter(student=sc.student, is_active=True)
            
            # Determine current Sem Number (to avoid checking future sems)
            curr_sem_str = sc.semester.semester_description.lower()
            curr_sem_num = 1
            if "2nd" in curr_sem_str: curr_sem_num = 2
            elif "3rd" in curr_sem_str: curr_sem_num = 3
            elif "4th" in curr_sem_str: curr_sem_num = 4
            elif "5th" in curr_sem_str: curr_sem_num = 5
            elif "6th" in curr_sem_str: curr_sem_num = 6
            
            for sem_name, expected_amts in rules.items():
                # Extract sem num from rule key "1st Semester" -> 1
                rule_sem_num = int(sem_name.split('st')[0].split('nd')[0].split('rd')[0].split('th')[0].strip())
                
                if rule_sem_num > curr_sem_num:
                    continue # Future sem
                
                # Get Fees for this sem
                sem_fees = [f for f in fees if f.semester.semester_description.strip().lower() == sem_name.lower()]
                
                # If sem fee should be 0, we accept either "No Record" or "Record with 0"
                should_be_zero = (expected_amts["Course Fee"] == 0)
                
                if not sem_fees:
                    if should_be_zero:
                        continue # OK
                    else:
                        is_perfect = False
                        issues.append(f"Student {sc.student.first_name} missing records for {sem_name}")
                        continue
                
                for el_type, amt in expected_amts.items():
                    matched_amt = 0 # Default if checking for 0 and no record found
                    found_record = False
                    for f in sem_fees:
                        if el_type.lower() in f.element_name.lower():
                            matched_amt = f.element_amount
                            found_record = True
                            break
                    
                    if not found_record and amt > 0:
                        is_perfect = False
                        issues.append(f"Student {sc.student.first_name} missing {el_type} in {sem_name}")
                    elif float(matched_amt) != float(amt):
                        is_perfect = False
                        issues.append(f"Student {sc.student.first_name} {sem_name} {el_type}: Found {matched_amt}, Expected {amt}")

            if is_perfect: perfect_count += 1
            if len(issues) > 5: break
            
        print(f"  Result: {perfect_count}/{total_studs} students are 100% correct up to their current semester.")
        if issues:
            for i in issues[:3]: print(f"   - {i}")

if __name__ == "__main__":
    final_verification_report()
