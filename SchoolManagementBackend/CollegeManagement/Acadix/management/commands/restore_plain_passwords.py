"""
Django management command to restore plain passwords from first names
This fixes the issue where plain_password was cleared but should contain first name
"""

from django.core.management.base import BaseCommand
from Acadix.models import UserLogin, StudentRegistration


class Command(BaseCommand):
    help = 'Restore plain passwords to first name for student accounts'

    def handle(self, *args, **options):
        # Find all student users (user_type_id = 2)
        student_users = UserLogin.objects.filter(user_type_id=2)
        
        total = student_users.count()
        self.stdout.write(f'\nProcessing {total} student users to normalize plain passwords\n')
        
        if total == 0:
            self.stdout.write(self.style.SUCCESS('All students already have plain passwords!'))
            return
        
        # Process each student user
        restored_count = 0
        for user in student_users:
            try:
                # Get the student record
                student = StudentRegistration.objects.get(id=user.reference_id)
                
                # Normalize first_name: lowercase, no spaces, no dots (matching username logic)
                normalized_name = student.first_name.lower().replace('.', '').replace(' ', '')
                
                # Set plain_password to normalized first_name
                user.plain_password = normalized_name
                user.save()
                
                restored_count += 1
                
                if restored_count % 50 == 0:
                    self.stdout.write(f'Processed {restored_count}/{total}...')
                    
            except StudentRegistration.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f'Student not found for user {user.user_name}')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error restoring password for user {user.user_name}: {str(e)}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'\n✅ Successfully restored {restored_count} plain passwords!')
        )
        
        # Verify
        remaining = UserLogin.objects.filter(
            user_type_id=2,
            plain_password=''
        ).count()
        
        if remaining > 0:
            self.stdout.write(
                self.style.WARNING(f'\n⚠️  {remaining} students still have empty plain passwords')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS('\n✅ All student plain passwords restored!')
            )
