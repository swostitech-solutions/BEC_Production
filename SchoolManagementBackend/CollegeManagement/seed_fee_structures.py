#!/usr/bin/env python
import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Swostitech_Acadix.settings")
django.setup()

from Acadix.models import (  # noqa: E402
    AcademicYear,
    Department,
    FeeElementType,
    FeeFrequency,
    FeeStructureDetail,
    FeeStructureMaster,
    Semester,
)
from django.contrib.auth import get_user_model  # noqa: E402


FEE_ELEMENT_NAME = "Academic Fees"
DEFAULT_AMOUNT = 100000
DEFAULT_VERSION = 1
DEFAULT_NEW_EXISTING = "N"


def get_created_by():
    user = get_user_model().objects.filter(is_superuser=True).order_by("id").first()
    return user.id if user else 1


def semester_payload(semesters):
    payload = {}
    for index in range(1, 9):
        payload[f"semester_{index}"] = semesters[index - 1].id if index <= len(semesters) else None
    return payload


def seed():
    created_by = get_created_by()
    element = FeeElementType.objects.get(element_name=FEE_ELEMENT_NAME)

    master_created = 0
    master_updated = 0
    detail_created = 0
    detail_updated = 0

    for department in Department.objects.select_related(
        "organization",
        "branch",
        "batch",
        "course",
    ).all():
        batch = department.batch
        course = department.course
        org = department.organization
        branch = department.branch

        fee_frequency = FeeFrequency.objects.get(
            organization=org,
            branch=branch,
            batch=batch,
            course=course,
            department=department,
            is_active=True,
        )

        first_year = AcademicYear.objects.get(
            organization=org,
            branch=branch,
            batch=batch,
            course=course,
            department=department,
            academic_year_code="1st Year",
        )
        first_semester = Semester.objects.get(
            organization=org,
            branch=branch,
            batch=batch,
            course=course,
            department=department,
            academic_year=first_year,
            semester_code="1st Semester",
        )

        ordered_semesters = list(
            Semester.objects.filter(
                organization=org,
                branch=branch,
                batch=batch,
                course=course,
                department=department,
            ).order_by("display_order", "id")
        )

        if len(ordered_semesters) != fee_frequency.frequency_period:
            raise ValueError(
                f"Semester count mismatch for {batch.batch_code} / {course.course_code} / "
                f"{department.department_description}: expected {fee_frequency.frequency_period}, "
                f"found {len(ordered_semesters)}"
            )

        structure_name = f"{batch.batch_code} {course.course_code} {department.department_description}"

        master, was_created = FeeStructureMaster.objects.get_or_create(
            organization=org,
            branch=branch,
            batch=batch,
            course=course,
            department=department,
            academic_year=first_year,
            semester=first_semester,
            fee_structure_code=structure_name,
            defaults={
                "fee_structure_description": structure_name,
                "enabled": "Y",
                "version_no": DEFAULT_VERSION,
                "new_existing": DEFAULT_NEW_EXISTING,
                "category": None,
                "is_active": True,
                "created_by": created_by,
            },
        )

        if was_created:
            master_created += 1
        else:
            changed = False
            for field, value in {
                "fee_structure_description": structure_name,
                "enabled": "Y",
                "version_no": DEFAULT_VERSION,
                "new_existing": DEFAULT_NEW_EXISTING,
                "category": None,
                "is_active": True,
            }.items():
                if getattr(master, field) != value:
                    setattr(master, field, value)
                    changed = True
            if changed:
                master.updated_by = created_by
                master.save()
                master_updated += 1

        detail_defaults = {
            "element_type": element,
            "element_frequency": fee_frequency,
            "amount": DEFAULT_AMOUNT,
            "adjustment_flag": "N",
            "is_active": True,
            "created_by": created_by,
            **semester_payload(ordered_semesters),
        }

        detail, was_created = FeeStructureDetail.objects.get_or_create(
            fee_structure_master=master,
            element_type=element,
            defaults=detail_defaults,
        )

        if was_created:
            detail_created += 1
        else:
            changed = False
            for field, value in detail_defaults.items():
                if getattr(detail, field) != value:
                    setattr(detail, field, value)
                    changed = True
            if changed:
                detail.updated_by = created_by
                detail.save()
                detail_updated += 1

    print("Fee structure seed completed.")
    print(f"master_created: {master_created}")
    print(f"master_updated: {master_updated}")
    print(f"detail_created: {detail_created}")
    print(f"detail_updated: {detail_updated}")
    print(f"master_total: {FeeStructureMaster.objects.count()}")
    print(f"detail_total: {FeeStructureDetail.objects.count()}")


if __name__ == "__main__":
    seed()
