import os
import django
import sys

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Swostitech_Acadix.settings')
django.setup()

from Acadix.models import Semester

def check_default_semesters():
    print("Checking 'Default Semester' entries in Master Table...")
    
    sems = Semester.objects.filter(semester_description__iexact="Default Semester")
    
    if not sems.exists():
        print("No semester named 'Default Semester' found.")
        return

    print(f"Found {sems.count()} rows named 'Default Semester':")
    print(f"{'ID':<6} | {'Academic Year':<20} | {'Batch':<15}")
    print("-" * 50)
    
    for s in sems:
        # Assuming linked to AcademicYear and Batch
        ay = s.academic_year.academic_year_code if s.academic_year else "None"
        batch = s.batch.batch_code if s.batch else "None"
        print(f"{s.id:<6} | {ay:<20} | {batch:<15}")

if __name__ == "__main__":
    check_default_semesters()
