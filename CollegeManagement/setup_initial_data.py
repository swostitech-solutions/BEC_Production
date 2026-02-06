"""
Setup script to create initial required data for superuser creation
Run this in Render shell: python manage.py shell < setup_initial_data.py
"""
from Acadix.models import Organization, Branch, UserType

# Create default Organization if it doesn't exist
org, created = Organization.objects.get_or_create(
    id=1,
    defaults={
        'code': 'DEFAULT',
        'name': 'Default Organization',
        'is_active': True,
        'created_by': 1,
    }
)
if created:
    print(f"✓ Created Organization: {org.name}")
else:
    print(f"✓ Organization already exists: {org.name}")

# Create default Branch if it doesn't exist
branch, created = Branch.objects.get_or_create(
    id=1,
    defaults={
        'code': 'MAIN',
        'name': 'Main Branch',
        'organization': org,
        'is_active': True,
        'created_by': 1,
    }
)
if created:
    print(f"✓ Created Branch: {branch.name}")
else:
    print(f"✓ Branch already exists: {branch.name}")

# Create default UserType if it doesn't exist
user_type, created = UserType.objects.get_or_create(
    id=1,
    defaults={
        'code': 'ADMIN',
        'name': 'Administrator',
        'is_active': True,
        'created_by': 1,
    }
)
if created:
    print(f"✓ Created UserType: {user_type.name}")
else:
    print(f"✓ UserType already exists: {user_type.name}")

print("\n✅ Initial data setup complete! You can now create a superuser.")
