
import os
import django
import sys

# Setup (not needed for shell execution but good for ref)
# sys.path.append('d:\\intern2\\SchoolManagementBackend\\CollegeManagement')
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CollegeManagement.settings')
# django.setup()

from STAFF.models import EmployeeDocument
from django.conf import settings

def fix_document_paths():
    print("Fixing Document Paths...")
    docs = EmployeeDocument.objects.all()
    count = 0
    updated = 0
    
    # We need a request object to build absolute URI, or we can just construct it relative/absolute manually
    # Since we can't easily get 'request' here, we will check if the path looks wrong and fix it based on MEDIA_URL
    # Or better: Just ensure it matches the file field's url
    
    base_url = "http://127.0.0.1:8000" # Assuming localhost for fix, or just use relative path if frontend handles it? 
    # The views.py uses request.build_absolute_uri.
    # We can try to keep the existing domain if present, or just fix the path part.
    
    for d in docs:
        count += 1
        if not d.document_file:
            continue
            
        current_path = d.document_path or ""
        file_url = d.document_file.url # Should be /SWOSTITECH_CMS/employee_documents/filename.pdf
        
        # Check if the current_path ends with the file_url (ignoring domain)
        if not current_path.endswith(file_url):
            print(f"Mismatch for ID {d.document_id}:")
            print(f"  Current: {current_path}")
            print(f"  Correct: {base_url}{file_url}")
            
            # Update it
            d.document_path = f"{base_url}{file_url}"
            d.save()
            updated += 1
            print("  ✅ Updated.")
    
    print(f"Processed {count} documents. Updated {updated}.")

if __name__ == "__main__":
    fix_document_paths()
