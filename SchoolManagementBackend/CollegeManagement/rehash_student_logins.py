import os
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Swostitech_Acadix.settings")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import django

django.setup()

from django.db import transaction
from Acadix.models import UserLogin


def main():
    queryset = UserLogin.objects.filter(user_type_id=2).exclude(password__startswith="pbkdf2_sha256$")

    updated = 0
    skipped = 0

    with transaction.atomic():
        for user in queryset.iterator():
            if not user.plain_password:
                skipped += 1
                continue

            user.set_password(user.plain_password)
            user.save(update_fields=["password"])
            updated += 1

    print(f"UPDATED={updated}")
    print(f"SKIPPED={skipped}")


if __name__ == "__main__":
    main()
