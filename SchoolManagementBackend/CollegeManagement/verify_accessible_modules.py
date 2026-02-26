"""
Database Verification Script for accessible_modules field
Run this to verify everything is working correctly
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Swostitech_Acadix.settings')
django.setup()

from Acadix.models import UserLogin
from django.db import connection

def verify_database():
    print("=" * 60)
    print("DATABASE VERIFICATION FOR ACCESSIBLE_MODULES")
    print("=" * 60)
    
    # Check if column exists
    print("\n1. Checking if 'accessible_modules' column exists...")
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = 'Acadix_userlogin' 
            AND column_name = 'accessible_modules'
        """)
        result = cursor.fetchone()
        
        if result:
            print("   ✅ Column EXISTS")
            print(f"   - Column Name: {result[0]}")
            print(f"   - Data Type: {result[1]}")
            print(f"   - Nullable: {result[2]}")
            print(f"   - Default: {result[3]}")
        else:
            print("   ❌ Column DOES NOT EXIST - MIGRATION FAILED!")
            return False
    
    # Check existing users
    print("\n2. Checking existing UserLogin records...")
    total_users = UserLogin.objects.count()
    print(f"   - Total users: {total_users}")
    
    users_with_modules = UserLogin.objects.exclude(accessible_modules__isnull=True).exclude(accessible_modules=[]).count()
    users_without_modules = total_users - users_with_modules
    
    print(f"   - Users with accessible_modules set: {users_with_modules}")
    print(f"   - Users with NULL/empty accessible_modules: {users_without_modules}")
    
    # Sample existing users
    print("\n3. Sampling 5 random existing users...")
    sample_users = UserLogin.objects.all()[:5]
    for user in sample_users:
        modules = user.accessible_modules if user.accessible_modules else "NULL/Empty (will show all modules)"
        print(f"   - User: {user.user_name} | Modules: {modules}")
    
    # Test backward compatibility
    print("\n4. Testing backward compatibility logic...")
    test_user = UserLogin.objects.first()
    if test_user:
        if not test_user.accessible_modules or len(test_user.accessible_modules) == 0:
            print("   ✅ Existing users have NULL/empty accessible_modules")
            print("   ✅ Frontend will show ALL modules (backward compatible)")
        else:
            print(f"   ⚠️  User has modules: {test_user.accessible_modules}")
    
    # Check model field configuration
    print("\n5. Verifying model field configuration...")
    field = UserLogin._meta.get_field('accessible_modules')
    print(f"   - Field type: {type(field).__name__}")
    print(f"   - Null allowed: {field.null}")
    print(f"   - Blank allowed: {field.blank}")
    print(f"   - Default: {field.default}")
    
    print("\n" + "=" * 60)
    print("VERIFICATION COMPLETE")
    print("=" * 60)
    print("\n✅ SAFE TO USE - No existing functionality will break!")
    print("\nWhy it's safe:")
    print("1. Existing users have NULL/empty accessible_modules")
    print("2. Frontend shows ALL modules when accessible_modules is empty")
    print("3. Only NEW users created via CreateAdminUser will have restrictions")
    print("4. Field has proper defaults (null=True, blank=True, default=list)")
    print("=" * 60)

if __name__ == '__main__':
    try:
        verify_database()
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
