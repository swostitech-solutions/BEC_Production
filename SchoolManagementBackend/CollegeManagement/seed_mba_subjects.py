import os

import django


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Swostitech_Acadix.settings")
django.setup()

from Acadix.models import Branch, CourseDepartmentSubject, Department, Organization, Semester


SEMESTER_SUBJECTS = {
    "1st Semester": [
        "MANAGEMENT PRINCIPLES & ORGANIZATIONAL BEHAVIOUR  MBPC1001",
        "MARKETING MANAGEMENT MBPC1002",
        "Financial Accounting and Analysis MBPC1003",
        "Managerial Economics MBEV1001",
        "Quantitative Techniques MBQT1001",
        "Business Communication MBEV1002",
        "Universal Human Values, Ethics and Environment MBEV1003",
        "Entrepreneurship & Legal environment MBEV1004",
        "Management Lessons from Ancient India MBEV1005",
        "Business Communication Lab MBEV1201",
        "IT Skills for Managers MBPC1201",
    ],
    "2nd Semester": [
        "Corporate Finance MBPC1004",
        "Cost and Management Accounting MBPC1005",
        "Human Resources Management  MBPC1006",
        "Business Research MBQT1002",
        "Operations Management MBPC1007",
        "Business Analytics MBPC1008",
        "Management Information System MBPC1009",
        "Strategic Management MBPC1010",
        "Health & Wellness  MBEV1202",
        "Introduction to AI MBPC1011",
    ],
    "3rd Semester": [
        "Consumer Behaviour 18MBA301A",
        "Sales & Distribution Management 18MBA302A",
        "Digital Marketing 161MN303A",
        "Service Marketing 18MBA304A",
        "Internship",
        "Security Analysis Portfolio Management & 18MBA301B",
        "Financial Derivatives 18MBA302B",
        "Advanced Management Accounting 18MBA303B",
        "Project Appraisal & Financing 18MBA304B",
        "Internship",
        "Manpower Planning 18MBA301C",
        "Employee Relations 18MBA302C",
        "Compensation and Benefit Management 18MBA303C",
        "Performance Management System 18MBA304C",
        "Internship",
        "Supply Chain Management & Logistics 18MBA301D",
        "Pricing and Revenue Management 18MBA302D",
        "Operations Strategy 18MBA303D",
        "Sales and Operation Planning 18MBA304D",
        "Internship",
        "Data Mining for Business Decisions 18MBA301E",
        "Business Analytics 18MBA302E",
        "E-Commerce and Digital Markets 18MBA303E",
        "Managing Digital Platforms 18MBA304E",
        "Internship",
        "Agribusiness Management 18MBA301F",
        "Agricultural Commodity Trading 19MBA302G",
        "Agricultural Marketing Management 19MBA303G",
        "Agricultural Input Management 19MBA304G",
        "Internship",
    ],
    "4th Semester": [
        "Retail Management 18 MBA401A",
        "Product & Branding Management 18MBA402A",
        "B2B Marketing 18MBA403A",
        "Seminar",
        "Business Taxation 18MBA401B",
        "Behaviour Finance 18MBA402B",
        "Mergers & Corporate Restructuring 18MBA403B",
        "Seminar",
        "Team Dynamics at work 18MBA401C",
        "Strategic HRM 18MBA402C",
        "Industrial Legislation 18MBA403C",
        "Seminar",
        "Management of Manufacturing System 18MBA401D",
        "Sourcing Management 18MBA402D",
        "Operations Research Applications 18MBA403D",
        "Seminar",
        "Strategic Management of IT 18MBA401E",
        "Managing Digital Innovation and Transformation 18MBA402E",
        "Managing Software Projects 18MBA403E",
        "Seminar",
        "Agricultural Supply Chain Management 19MBA401G",
        "AgrifoodProcessing Management 19MBA402G",
        "International Trade in Agriculture 19MBA403G",
        "Seminar",
    ],
}


def main():
    organization = Organization.objects.get(id=1)
    branch = Branch.objects.get(id=1)
    created = 0

    semesters = {
        semester_code: list(
            Semester.objects.filter(
                organization=organization,
                branch=branch,
                semester_code=semester_code,
                is_active=True,
            ).select_related("batch", "course", "department")
        )
        for semester_code in SEMESTER_SUBJECTS
    }

    semester_maps = {
        semester_code: {
            (semester.batch_id, semester.course_id, semester.department_id): semester
            for semester in semester_list
        }
        for semester_code, semester_list in semesters.items()
    }

    departments = Department.objects.filter(
        organization=organization,
        branch=branch,
        course__course_code="MBA",
        department_code="General",
        is_active=True,
    ).select_related("batch", "course")

    for department in departments:
        key = (department.batch_id, department.course_id, department.id)
        for semester_code, subject_names in SEMESTER_SUBJECTS.items():
            semester = semester_maps[semester_code].get(key)
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
