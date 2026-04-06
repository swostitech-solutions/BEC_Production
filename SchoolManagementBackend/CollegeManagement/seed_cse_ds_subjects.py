import os

import django


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Swostitech_Acadix.settings")
django.setup()

from Acadix.models import Branch, CourseDepartmentSubject, Department, Organization, Semester


SEMESTER_SUBJECTS = {
    "3rd Semester": [
        "ACC1",
        "OOPS",
        "Data Structure",
        "Discrete Math",
    ],
    "4th Semester": [
        "DAA",
        "DBE",
        "CN",
        "COA",
        "ACC2(IOT &CLOUD)",
        "DATA MINING &DATA WAREHOUSING",
    ],
    "5th Semester": [
        "DBMS",
        "OS",
        "AI",
        "FLAT",
        "CG",
    ],
    "6th Semester": [
        "SE",
        "CC",
        "CD",
    ],
    "7th Semester": [
        "IOT",
        "SPM",
    ],
    "8th Semester": [
        "Major Project",
    ],
}


def main():
    organization = Organization.objects.get(id=1)
    branch = Branch.objects.get(id=1)
    created = 0

    department_qs = Department.objects.filter(
        organization=organization,
        branch=branch,
        course__course_code="BTECH",
        department_code="Computer Science & Engineering (Data Science)",
        is_active=True,
    ).select_related("batch", "course")

    semesters = {
        name: list(
            Semester.objects.filter(
                organization=organization,
                branch=branch,
                semester_code=name,
                is_active=True,
            ).select_related("batch", "course", "department")
        )
        for name in SEMESTER_SUBJECTS
    }

    semester_map = {
        name: {(s.batch_id, s.course_id, s.department_id): s for s in semester_list}
        for name, semester_list in semesters.items()
    }

    for department in department_qs:
        key = (department.batch_id, department.course_id, department.id)
        for semester_name, subject_names in SEMESTER_SUBJECTS.items():
            semester = semester_map[semester_name].get(key)
            if not semester:
                continue

            for subject_name in subject_names:
                _, was_created = CourseDepartmentSubject.objects.get_or_create(
                    organization=organization,
                    branch=branch,
                    batch=department.batch,
                    course=department.course,
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
