#!/usr/bin/env python
import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Swostitech_Acadix.settings")
django.setup()

from Acadix.models import Course, Department, FeeFrequency  # noqa: E402
from django.contrib.auth import get_user_model  # noqa: E402


FREQUENCY_BY_COURSE = {
    "BTECH": ("semesters", 8),
    "DIPLOMA": ("semesters", 6),
    "MBA": ("semesters", 4),
}


def get_created_by():
    user = get_user_model().objects.filter(is_superuser=True).order_by("id").first()
    return user.id if user else 1


def seed():
    created_by = get_created_by()
    created = 0
    updated = 0

    for department in Department.objects.select_related(
        "organization",
        "branch",
        "batch",
        "course",
    ).all():
        course = department.course
        if course.course_code not in FREQUENCY_BY_COURSE:
            continue

        fee_frequency_name, frequency_period = FREQUENCY_BY_COURSE[course.course_code]

        obj, was_created = FeeFrequency.objects.get_or_create(
            organization=department.organization,
            branch=department.branch,
            batch=department.batch,
            course=course,
            department=department,
            defaults={
                "fee_frequency_name": fee_frequency_name,
                "frequency_period": frequency_period,
                "is_active": True,
                "created_by": created_by,
            },
        )

        if was_created:
            created += 1
        else:
            changed = False
            if obj.fee_frequency_name != fee_frequency_name:
                obj.fee_frequency_name = fee_frequency_name
                changed = True
            if obj.frequency_period != frequency_period:
                obj.frequency_period = frequency_period
                changed = True
            if not obj.is_active:
                obj.is_active = True
                changed = True
            if changed:
                obj.updated_by = created_by
                obj.save()
                updated += 1

    print("Fee frequency seed completed.")
    print(f"created: {created}")
    print(f"updated: {updated}")
    print(f"total: {FeeFrequency.objects.count()}")


if __name__ == "__main__":
    seed()
