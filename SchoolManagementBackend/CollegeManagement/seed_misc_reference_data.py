import os

import django


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Swostitech_Acadix.settings")
django.setup()

from datetime import time

from Acadix.models import Branch, EmployeeType, LecturePeriod, MessageType, Organization
from GRIEVANCE.models import GrievancePriority, GrievanceSeverity, GrievanceType


ORG_ID = 1
BRANCH_ID = 1
CREATED_BY = 1


LECTURE_PERIODS = [
    ("Period 1", "Period 1", time(8, 0, 0), time(9, 0, 0), "T"),
    ("Period 2", "Period 2", time(9, 0, 0), time(10, 0, 0), "T"),
    ("Period 3", "Period 3", time(10, 0, 0), time(11, 0, 0), "T"),
    ("Period 4", "Period 4", time(11, 0, 0), time(12, 0, 0), "T"),
    ("Period 5", "Period 5", time(12, 0, 0), time(13, 0, 0), "T"),
    ("Period 6", "Period 6", time(13, 0, 0), time(14, 0, 0), "T"),
    ("Period 7", "Period 7", time(14, 0, 0), time(15, 0, 0), "T"),
    ("Period 8", "Period 8", time(15, 0, 0), time(16, 0, 0), "T"),
]

MESSAGE_TYPES = [
    "Indiscipline",
    "Fees",
    "Attendance",
    "Others",
]

EMPLOYEE_TYPES = [
    "Non-Teaching Staff",
    "Teaching Staff",
    "Nursing Tutor",
    "Hostel Warden",
    "Regular Staff",
    "Permanent Staff",
]

GRIEVANCE_SEVERITIES = [
    "Low",
    "Minor",
    "Major",
    "Critical",
]

GRIEVANCE_PRIORITIES = [
    "Low",
    "Medium",
    "High",
    "Critical",
]

GRIEVANCE_TYPES = [
    "Examination",
    "Fees",
]


def main():
    organization = Organization.objects.get(id=ORG_ID)
    branch = Branch.objects.get(id=BRANCH_ID)

    lecture_period_count = 0
    for name, description, time_from, time_to, day_attendance in LECTURE_PERIODS:
        _, created = LecturePeriod.objects.get_or_create(
            organization=organization,
            branch=branch,
            lecture_period_name=name,
            defaults={
                "lecture_period_description": description,
                "time_from": time_from,
                "time_to": time_to,
                "day_attendance": day_attendance,
                "created_by": CREATED_BY,
                "is_active": True,
            },
        )
        if created:
            lecture_period_count += 1

    message_type_count = 0
    for value in MESSAGE_TYPES:
        _, created = MessageType.objects.get_or_create(
            organization=organization,
            branch=branch,
            message_type=value,
            defaults={
                "message_type_description": value,
                "message_default_text": "",
                "is_active": True,
            },
        )
        if created:
            message_type_count += 1

    employee_type_count = 0
    for value in EMPLOYEE_TYPES:
        _, created = EmployeeType.objects.get_or_create(
            organization=organization,
            branch=branch,
            employee_type_code=value,
            defaults={
                "employee_type_description": value,
                "is_active": True,
            },
        )
        if created:
            employee_type_count += 1

    grievance_severity_count = 0
    for value in GRIEVANCE_SEVERITIES:
        _, created = GrievanceSeverity.objects.get_or_create(
            organization=organization,
            branch=branch,
            severity_type=value,
            defaults={
                "severity_type_description": value,
                "created_by": CREATED_BY,
                "updated_by": CREATED_BY,
                "is_active": True,
            },
        )
        if created:
            grievance_severity_count += 1

    grievance_priority_count = 0
    for value in GRIEVANCE_PRIORITIES:
        _, created = GrievancePriority.objects.get_or_create(
            organization=organization,
            branch=branch,
            priority_type=value,
            defaults={
                "priority_type_description": value,
                "created_by": CREATED_BY,
                "updated_by": CREATED_BY,
                "is_active": True,
            },
        )
        if created:
            grievance_priority_count += 1

    grievance_type_count = 0
    for value in GRIEVANCE_TYPES:
        _, created = GrievanceType.objects.get_or_create(
            organization=organization,
            branch=branch,
            grievance_type_code=value,
            defaults={
                "grievance_type_description": value,
                "created_by": CREATED_BY,
                "updated_by": CREATED_BY,
                "is_active": True,
            },
        )
        if created:
            grievance_type_count += 1

    print(
        {
            "lecture_periods_created": lecture_period_count,
            "message_types_created": message_type_count,
            "employee_types_created": employee_type_count,
            "grievance_severities_created": grievance_severity_count,
            "grievance_priorities_created": grievance_priority_count,
            "grievance_types_created": grievance_type_count,
        }
    )


if __name__ == "__main__":
    main()
