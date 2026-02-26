#!/usr/bin/env python
"""
One-time script to create superuser
Run this via Render's console or add to build.sh
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Swostitech_Acadix.settings')
django.setup()

from django.contrib.auth import get_user_model
from Acadix.models import Organization, Branch, UserType

User = get_user_model()

# Create required dependencies
org, _ = Organization.objects.get_or_create(
    id=1,
    defaults={
        'organization_code': 'ORG001',
        'organization_description': 'Default Organization',
        'created_by': 0
    }
)

branch, _ = Branch.objects.get_or_create(
    id=1,
    defaults={
        'organization': org,
        'branch_code': 'MAIN',
        'branch_name': 'Main Branch',
        'created_by': 0
    }
)

user_type, _ = UserType.objects.get_or_create(
    id=1,
    defaults={
        'user_type': 'Admin',
        'description': 'Administrator',
        'created_by': 0
    }
)

# Create superuser
username = 'admin'
password = 'admin123'  # Change this!

if not User.objects.filter(user_name=username).exists():
    User.objects.create_superuser(
        user_name=username,
        password=password,
        organization=org,
        branch=branch,
        user_type=user_type
    )
    print(f'✅ Superuser "{username}" created!')
    print(f'Username: {username}')
    print(f'Password: {password}')
else:
    print(f'⚠️ Superuser "{username}" already exists')
