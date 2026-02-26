"""
Quick script to manually add accessible_modules column
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Swostitech_Acadix.settings')
django.setup()

from django.db import connection

with connection.cursor() as cursor:
    try:
        # Add the accessible_modules column
        cursor.execute("""
            ALTER TABLE "Acadix_userlogin" 
            ADD COLUMN "accessible_modules" jsonb NULL
        """)
        print("✅ Successfully added accessible_modules column!")
    except Exception as e:
        if 'already exists' in str(e):
            print("⚠️  Column already exists, skipping...")
        else:
            print(f"❌ Error: {e}")
            raise

# Now mark the migration as applied
from django.db import connection
from django.db.migrations.recorder import MigrationRecorder

recorder = MigrationRecorder(connection)
recorder.record_applied('Acadix', '0004_studentfeereceiptheader_receipt_amount_and_more')
print("✅ Marked migration as applied!")
print("\n🎉 Done! You can now use the role-based access control feature.")
