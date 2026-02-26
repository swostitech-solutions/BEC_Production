"""
Django management command to hash all plain text passwords
This will find all UserLogin records with plain_password set and hash them
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from Acadix.models import UserLogin


class Command(BaseCommand):
    help = 'Hash all plain text passwords for student accounts'

    def handle(self, *args, **options):
        # Find all users with plain passwords
        users_with_plain = UserLogin.objects.filter(
            plain_password__isnull=False
        ).exclude(plain_password='')
        
        total = users_with_plain.count()
        self.stdout.write(f'\nFound {total} users with plain passwords\n')
        
        if total == 0:
            self.stdout.write(self.style.SUCCESS('No plain passwords to hash!'))
            return
        
        # Process each user
        hashed_count = 0
        for user in users_with_plain:
            try:
                # Hash the plain password (keep plain_password for reference)
                plain_pwd = user.plain_password
                user.password = make_password(plain_pwd)
                # Don't clear plain_password - it's used for password reset and admin reference
                user.save()
                
                hashed_count += 1
                
                if hashed_count % 50 == 0:
                    self.stdout.write(f'Processed {hashed_count}/{total}...')
                    
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error hashing password for user {user.user_name}: {str(e)}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'\n✅ Successfully hashed {hashed_count} passwords!')
        )
        
        # Verify
        remaining = UserLogin.objects.filter(
            plain_password__isnull=False
        ).exclude(plain_password='').count()
        
        if remaining > 0:
            self.stdout.write(
                self.style.WARNING(f'\n⚠️  {remaining} users still have plain passwords')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS('\n✅ All passwords are now hashed!')
            )
