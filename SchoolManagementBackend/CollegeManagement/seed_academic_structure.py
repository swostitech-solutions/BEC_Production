#!/usr/bin/env python
import os
from datetime import date, datetime

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Swostitech_Acadix.settings")
django.setup()

from Acadix.models import (  # noqa: E402
    AcademicYear,
    Batch,
    Branch,
    Course,
    CourseSemesterSectionBind,
    Department,
    Organization,
    Section,
    Semester,
)
from django.contrib.auth import get_user_model  # noqa: E402


BATCH_CODES = [
    "2024-2028",
    "2024-2027",
    "2024-2026",
    "2024-2025",
    "2023-2027",
    "2023-2026",
    "2023-2025",
    "2022-2026",
    "2022-2025",
    "2021-2025",
]

COURSES = {
    "BTECH": {
        "course_name": "BTECH",
        "duration_years": 4,
        "total_semesters": 8,
        "departments": [
            "Agriculture Engineering",
            "Food Engineering & Technology",
            "Aeronautical Engineering",
            "Aircraft Maintenance Engineering",
            "Civil Engineering",
            "Civil & Environmental Engineering",
            "Computer Science & Engineering",
            "Computer Science & Engineering (Data Science)",
            "Electrical Engineering",
            "Electrical & Computer Engineering",
            "Mechanical Engineering",
            "Mechanical & Mechatronics Engineering (Additive Manufacturing)",
        ],
        "academic_years": ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    },
    "DIPLOMA": {
        "course_name": "Diploma",
        "duration_years": 3,
        "total_semesters": 6,
        "departments": [
            "Civil Engineering",
            "Electrical Engineering",
            "Mechanical Engineering",
            "Aircraft Maintenance Engineering",
            "Aeronautical Engineering",
        ],
        "academic_years": ["1st Year", "2nd Year", "3rd Year"],
    },
    "MBA": {
        "course_name": "MBA",
        "duration_years": 2,
        "total_semesters": 4,
        "departments": ["General"],
        "academic_years": ["1st Year", "2nd Year"],
    },
}

SEMESTER_MAP = {
    "1st Year": ["1st Semester", "2nd Semester"],
    "2nd Year": ["3rd Semester", "4th Semester"],
    "3rd Year": ["5th Semester", "6th Semester"],
    "4th Year": ["7th Semester", "8th Semester"],
}


def get_created_by():
    user = get_user_model().objects.filter(is_superuser=True).order_by("id").first()
    return user.id if user else 1


def batch_dates(batch_code):
    start_year, end_year = [int(part) for part in batch_code.split("-")]
    return date(start_year, 7, 1), date(end_year, 6, 30)


def academic_year_dates(batch_start_year, year_index):
    start_year = batch_start_year + year_index
    end_year = start_year + 1
    return date(start_year, 7, 1), date(end_year, 6, 30)


def semester_dates(batch_start_year, year_index, semester_index_in_year):
    start_year = batch_start_year + year_index
    if semester_index_in_year == 0:
        return (
            datetime(start_year, 7, 1, 0, 0, 0),
            datetime(start_year, 12, 31, 23, 59, 59),
        )
    return (
        datetime(start_year + 1, 1, 1, 0, 0, 0),
        datetime(start_year + 1, 6, 30, 23, 59, 59),
    )


def seed():
    organization = Organization.objects.get(id=1)
    branch = Branch.objects.get(id=1)
    created_by = get_created_by()

    stats = {
        "batches": 0,
        "courses": 0,
        "departments": 0,
        "academic_years": 0,
        "semesters": 0,
        "sections": 0,
        "bindings": 0,
    }

    for batch_code in BATCH_CODES:
        batch_start, batch_end = batch_dates(batch_code)
        batch, created = Batch.objects.get_or_create(
            organization=organization,
            branch=branch,
            batch_code=batch_code,
            defaults={
                "batch_description": batch_code,
                "date_from": batch_start,
                "date_to": batch_end,
                "is_active": True,
                "created_by": created_by,
            },
        )
        if not created:
            changed = False
            if batch.batch_description != batch_code:
                batch.batch_description = batch_code
                changed = True
            if batch.date_from != batch_start:
                batch.date_from = batch_start
                changed = True
            if batch.date_to != batch_end:
                batch.date_to = batch_end
                changed = True
            if not batch.is_active:
                batch.is_active = True
                changed = True
            if changed:
                batch.updated_by = created_by
                batch.save()
        else:
            stats["batches"] += 1

        start_year = int(batch_code.split("-")[0])

        for course_code, course_meta in COURSES.items():
            course, created = Course.objects.get_or_create(
                organization=organization,
                branch=branch,
                batch=batch,
                course_code=course_code,
                defaults={
                    "course_name": course_meta["course_name"],
                    "description": course_meta["course_name"],
                    "duration_years": course_meta["duration_years"],
                    "total_semesters": course_meta["total_semesters"],
                    "is_active": True,
                    "created_by": created_by,
                },
            )
            if not created:
                changed = False
                for field, value in {
                    "course_name": course_meta["course_name"],
                    "description": course_meta["course_name"],
                    "duration_years": course_meta["duration_years"],
                    "total_semesters": course_meta["total_semesters"],
                    "is_active": True,
                }.items():
                    if getattr(course, field) != value:
                        setattr(course, field, value)
                        changed = True
                if changed:
                    course.updated_by = created_by
                    course.save()
            else:
                stats["courses"] += 1

            for department_name in course_meta["departments"]:
                department_code = department_name
                department, created = Department.objects.get_or_create(
                    organization=organization,
                    branch=branch,
                    batch=batch,
                    course=course,
                    department_code=department_code,
                    defaults={
                        "department_description": department_name,
                        "hod_name": "TBD",
                        "office_contact": "0000000000",
                        "is_active": True,
                        "created_by": created_by,
                    },
                )
                if not created:
                    changed = False
                    for field, value in {
                        "department_code": department_code,
                        "department_description": department_name,
                        "hod_name": "TBD",
                        "office_contact": "0000000000",
                        "is_active": True,
                    }.items():
                        if getattr(department, field) != value:
                            setattr(department, field, value)
                            changed = True
                    if changed:
                        department.updated_by = created_by
                        department.save()
                else:
                    stats["departments"] += 1

                for year_index, academic_year_name in enumerate(course_meta["academic_years"]):
                    ay_start, ay_end = academic_year_dates(start_year, year_index)
                    academic_year, created = AcademicYear.objects.get_or_create(
                        organization=organization,
                        branch=branch,
                        batch=batch,
                        course=course,
                        department=department,
                        academic_year_code=academic_year_name,
                        defaults={
                            "academic_year_description": academic_year_name,
                            "date_from": ay_start,
                            "date_to": ay_end,
                            "display_order": year_index + 1,
                            "is_active": True,
                            "created_by": created_by,
                        },
                    )
                    if not created:
                        changed = False
                        for field, value in {
                            "academic_year_description": academic_year_name,
                            "date_from": ay_start,
                            "date_to": ay_end,
                            "display_order": year_index + 1,
                            "is_active": True,
                        }.items():
                            if getattr(academic_year, field) != value:
                                setattr(academic_year, field, value)
                                changed = True
                        if changed:
                            academic_year.updated_by = created_by
                            academic_year.save()
                    else:
                        stats["academic_years"] += 1

                    for semester_index, semester_name in enumerate(SEMESTER_MAP[academic_year_name]):
                        sem_start, sem_end = semester_dates(start_year, year_index, semester_index)
                        display_order = (year_index * 2) + semester_index + 1
                        semester, created = Semester.objects.get_or_create(
                            organization=organization,
                            branch=branch,
                            batch=batch,
                            course=course,
                            department=department,
                            academic_year=academic_year,
                            semester_code=semester_name,
                            defaults={
                                "semester_description": semester_name,
                                "date_from": sem_start,
                                "date_to": sem_end,
                                "display_order": display_order,
                                "is_active": True,
                                "created_by": created_by,
                            },
                        )
                        if not created:
                            changed = False
                            for field, value in {
                                "semester_description": semester_name,
                                "date_from": sem_start,
                                "date_to": sem_end,
                                "display_order": display_order,
                                "is_active": True,
                            }.items():
                                if getattr(semester, field) != value:
                                    setattr(semester, field, value)
                                    changed = True
                            if changed:
                                semester.updated_by = created_by
                                semester.save()
                        else:
                            stats["semesters"] += 1

                        section, created = Section.objects.get_or_create(
                            organization=organization,
                            branch=branch,
                            batch=batch,
                            course=course,
                            department=department,
                            academic_year=academic_year,
                            semester=semester,
                            section_code="A",
                            defaults={
                                "section_name": "Section A",
                                "is_active": True,
                                "created_by": created_by,
                            },
                        )
                        if not created:
                            changed = False
                            if section.section_name != "Section A":
                                section.section_name = "Section A"
                                changed = True
                            if not section.is_active:
                                section.is_active = True
                                changed = True
                            if changed:
                                section.updated_by = created_by
                                section.save()
                        else:
                            stats["sections"] += 1

                        _, created = CourseSemesterSectionBind.objects.get_or_create(
                            organization=organization,
                            branch=branch,
                            batch=batch,
                            course=course,
                            department=department,
                            academic_year=academic_year,
                            semester=semester,
                            section=section,
                            defaults={
                                "is_active": True,
                                "created_by": created_by,
                            },
                        )
                        if created:
                            stats["bindings"] += 1

    print("Seed completed.")
    for key, value in stats.items():
        print(f"{key}: {value}")


if __name__ == "__main__":
    seed()
