from django.core.management.base import BaseCommand
from Acadix.models import Organization, Branch, UserType


class Command(BaseCommand):
    help = 'Creates initial required data (Organization, Branch, UserType) for the system'

    def handle(self, *args, **options):
        self.stdout.write('Setting up initial data...\n')

        # Create default Organization
        org, created = Organization.objects.get_or_create(
            id=1,
            defaults={
                'organization_code': 'DEFAULT',
                'organization_description': 'Default Organization',
                'is_active': True,
                'created_by': 1,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'✓ Created Organization: {org.organization_code}'))
        else:
            self.stdout.write(f'✓ Organization already exists: {org.organization_code}')

        # Create default Branch
        branch, created = Branch.objects.get_or_create(
            id=1,
            defaults={
                'branch_code': 'MAIN',
                'branch_name': 'Main Branch',
                'organization': org,
                'is_active': True,
                'created_by': 1,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'✓ Created Branch: {branch.branch_name}'))
        else:
            self.stdout.write(f'✓ Branch already exists: {branch.branch_name}')

        # Create default UserType
        user_type, created = UserType.objects.get_or_create(
            id=1,
            defaults={
                'user_type': 'Administrator',
                'description': 'System Administrator',
                'is_active': True,
                'created_by': 1,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'✓ Created UserType: {user_type.user_type}'))
        else:
            self.stdout.write(f'✓ UserType already exists: {user_type.user_type}')

        self.stdout.write(self.style.SUCCESS('\n✅ Initial data setup complete! You can now create a superuser.'))
