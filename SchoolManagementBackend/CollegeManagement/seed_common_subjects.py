import os

import django


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Swostitech_Acadix.settings")
django.setup()

from Acadix.models import Batch, Branch, CourseDepartmentSubject, Department, Organization, Semester


SEMESTER_SUBJECTS = {
    "1st Semester": [
        "Basic Electrical Engineering",
        "Programming In C &Data Structure",
        "MATH-1",
        "Basic Civil Engineering",
        "PHYSICS",
        "Universal Human Values",
    ],
    "2nd Semester": [
        "Basic Electronics",
        "Engineering Mechanics",
        "Basic Mechanical Engineering",
        "MATH-II",
        "CHEMISTRY",
        "Communicative English for Technical Writting",
    ],
}


def main():
    organization = Organization.objects.get(id=1)
    branch = Branch.objects.get(id=1)
    created = 0

    semesters = {
        name: Semester.objects.filter(
            organization=organization,
            branch=branch,
            semester_code=name,
            is_active=True,
        )
        for name in SEMESTER_SUBJECTS
    }

    departments = Department.objects.filter(
        organization=organization,
        branch=branch,
        is_active=True,
    ).select_related("batch", "course")

    for department in departments:
        batch = department.batch
        course = department.course
        for semester_name, subject_names in SEMESTER_SUBJECTS.items():
            semester = semesters[semester_name].filter(
                batch=batch,
                course=course,
                department=department,
            ).first()
            if not semester:
                continue

            for subject_name in subject_names:
                _, was_created = CourseDepartmentSubject.objects.get_or_create(
                    organization=organization,
                    branch=branch,
                    batch=batch,
                    course=course,
                    department=department,
                    semester=semester,
                    subject_code=subject_name,
                    defaults={
                        "subject_description": subject_name,
                        "grade_marks": "",
                        "change_font": False,
                        "is_active": True,
                        "is_extra": False,
                    },
                )
                if was_created:
                    created += 1

    print({"subjects_created": created})


if __name__ == "__main__":
    main()
