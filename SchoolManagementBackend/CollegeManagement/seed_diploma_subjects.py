import os

import django


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Swostitech_Acadix.settings")
django.setup()

from Acadix.models import Branch, CourseDepartmentSubject, Department, Organization, Semester


DEPARTMENT_SUBJECTS = {
    "Electrical Engineering": {
        "1st Semester": [
            "Fundamentals of Electrical & Electronics Engineering (Th-4(a))",
            "Fundamentals of Electrical & Electronics Engineering Lab (Pr-4(a))",
        ],
        "2nd Semester": [
            "Fundamentals of Electrical & Electronics Engineering (Th-4(a))",
            "Fundamentals of Electrical & Electronics Engineering Lab (Pr-4(a))",
        ],
        "3rd Semester": [
            "Engineering Mathematics III (Th-1)",
            "Circuit & Network Theory (Th-2)",
            "Element of Mechanical Engineering (Th-3)",
            "Electrical Engineering Material (Th-4)",
            "Environmental Studies ( Th-5)",
            "Mechanical engineering Lab (Pr-1)",
            "Circuit & Simulation Lab (Pr-2)",
            "Mechanical Workshop (Pr-3)",
        ],
        "4th Semester": [
            "Energy Conversion-I (Th-1)",
            "Analog Electronics & OPAMP (Th-2)",
            "Electrical Measurement & Instrumentation (Th-3)",
            "Generation, Transmission and Distribution (Th-4)",
            "Electrical Machine-I Lab (Pr-1)",
            "Analog Electronics Lab(Pr-2)",
            "Simulation Practice on MATLAB (Pr-3)",
            "Electrical Drawing (Pr-4)",
        ],
        "5th Semester": [
            "Entrepreneurship and Management & Smart Technology (Th-1)",
            "Energy Conversion-II (Th-2)",
            "Digital Electronics & Microprocessor (Th-3)",
            "Utilization of Electrical Energy & Traction (Th-4)",
            "Power Electronics & PLC (Th-5)",
            "Electrical Machine-II Lab (Pr-1)",
            "Power Electronics & PLC Lab (Pr-2)",
            "Digital Electronics & Microprocessor Lab (Pr-3)",
            "Project Phase-I",
        ],
        "6th Semester": [
            "Electrical Installation and Estimating (Th-1)",
            "Switch Gear and Protective Devices (Th-2)",
            "Control System Engineering (Th-3)",
            "Renewable Energy (Th-4)",
            "Electrical Workshop (Pr-1)",
            "Project Phase-II (Pr-2)",
            "Life Skill (Pr-3)",
        ],
    },
    "Civil Engineering": {
        "1st Semester": [
            "Communication Skills in English",
            "Applied Physics-I",
            "Mathematics-I",
            "Fundamentals of Electrical & Electronics Engineering",
            "Environmental Science",
            "Communication Skills in English Lab",
            "Applied Physics-I Lab",
            "Engineering Graphics",
            "Fundamentals of Electrical & Electronics Engineering Lab",
            "Sports and Yoga",
        ],
        "2nd Semester": [
            "Introduction to IT Systems",
            "Applied Physics-II",
            "Mathematics-II",
            "Engineering Mechanics",
            "Applied Chemistry",
            "Introduction to IT Systems Lab",
            "Applied Physics-II Lab",
            "Engineering Workshop Practice",
            "Engineering Mechanics Lab",
            "Applied Chemistry Lab",
        ],
        "3rd Semester": [
            "Structural Mechanics",
            "Geotechnical Engineering",
            "Building Materials & Construction Technology",
            "Estimation &Cost Evaluation- I",
            "Environmental studies",
            "Civil Engg. Lab-I",
            "Civil Engg. Drawing-I",
            "Estimation Practice-I (Computer-Aided)",
            "Student Centered Activities (SCA)",
        ],
        "4th Semester": [
            "Structural Design-I",
            "Hydraulic & Irrigation Engineering",
            "Land Surveying – I",
            "Highway Engineering",
            "Land Survey Practice-I",
            "Civil Engg. Drawing- II",
            "Technical Seminar",
            "Student Centered Activities (SCA)",
        ],
        "5th Semester": [
            "Entrepreneurship and Management & Smart Technology",
            "Structural Design-II",
            "Railway & Bridge Engineering",
            "Water Supply & Waste Water Engineering",
            "Estimating & Cost Evaluation- II",
            "Civil Engg. Lab-II",
            "Estimation Practice-II (Computer-Aided)",
            "Project Phase-I",
            "Student Centered Activities (SCA)",
        ],
        "6th Semester": [
            "Land Survey - II",
            "Construction Management",
            "Advanced Construction Techniques & Equipment",
            "Concrete Technology (Elective)",
            "Disaster Management (Elective)",
            "Construction Workshop Practice & MS Project",
            "Land Survey Practice-II",
            "CADD Lab and Design & Detailing Practice",
            "Project Phase-II",
            "Life Skill",
            "Student Centered Activities (SCA)",
        ],
    },
    "Aeronautical Engineering": {
        "3rd Semester": [
            "Production Technology",
            "Strength of Material",
            "Engineering Material",
            "Thermal Engineering-1",
            "Environmental Studies",
            "Mechanical Engineering Drawing",
            "Mechanical Engineering Lab-1",
            "Workshop-II",
        ],
        "4th Semester": [
            "Basic Aerodynamics(TH-1)",
            "Manufacturing Technology(TH-2)",
            "Fluid Mechanics(TH-3)",
            "Aircraft Electrical System(TH-4)",
            "Aerodynamics lab(PR-1)",
            "Mechanical Enginerring Lab(PR-2)",
            "Workshop Practice(PR-3)",
            "Techanical Seminar(PR-4)",
        ],
        "5th Semester": [
            "Enterpreneurship and Management & Smart Technology",
            "Aircraft piston engine",
            "Aircraft structure",
            "Aircraft System",
            "Aircraft Maintenance and Management",
            "Aircraft Propulsion Lab",
            "Aircraft Structure Lab",
            "Project phase_1",
        ],
        "6th Semester": [
            "Aircraft Instrumentation",
            "Aircraft Jet Engine",
            "Basic Helicoptor",
            "Aircraft inspection, Maintenance and repair",
            "Aircraft Jet Engine Lab",
            "Aircraft System Lab",
            "CAD/CAM Lab",
            "Project Phase-II",
            "Life Skill",
        ],
    },
    "Aircraft Maintenance Engineering": {
        "3rd Semester": [
            "Production Technology",
            "Strength of Material",
            "Engineering Material",
            "Thermal Engineering-1",
            "Environmental Studies",
            "Mechanical Engineering Drawing",
            "Mechanical Engineering Lab-1",
            "Workshop-II",
        ],
        "4th Semester": [
            "Basic Aerodynamics(TH-1)",
            "Manufacturing Technology(TH-2)",
            "Fluid Mechanics(TH-3)",
            "Aircraft Electrical System(TH-4)",
            "Aerodynamics lab(PR-1)",
            "Mechanical Enginerring Lab(PR-2)",
            "Workshop Practice(PR-3)",
            "Techanical Seminar(PR-4)",
        ],
        "5th Semester": [
            "Enterpreneurship and Management & Smart Technology",
            "Aircraft piston engine",
            "Aircraft structure",
            "Aircraft System",
            "Aircraft Maintenance and Management",
            "Aircraft Propulsion Lab",
            "Aircraft Structure Lab",
            "Project phase_1",
        ],
        "6th Semester": [
            "Aircraft Instrumentation",
            "Human Factor",
            "Aircraft inspection, Maintenance and repair",
            "Civil Aviation Regulation",
            "Aircraft System Lab",
            "Aircraft Jet Engine Lab",
            "CAD/CAM Lab",
            "Project Phase-II",
            "Life Skill",
        ],
    },
}


def main():
    organization = Organization.objects.get(id=1)
    branch = Branch.objects.get(id=1)
    created = 0

    all_semesters = {
        semester_code: list(
            Semester.objects.filter(
                organization=organization,
                branch=branch,
                semester_code=semester_code,
                is_active=True,
            ).select_related("batch", "course", "department")
        )
        for semester_code in {
            code
            for subjects_by_sem in DEPARTMENT_SUBJECTS.values()
            for code in subjects_by_sem
        }
    }

    semester_maps = {
        semester_code: {
            (semester.batch_id, semester.course_id, semester.department_id): semester
            for semester in semester_list
        }
        for semester_code, semester_list in all_semesters.items()
    }

    for department_name, subjects_by_semester in DEPARTMENT_SUBJECTS.items():
        departments = Department.objects.filter(
            organization=organization,
            branch=branch,
            course__course_code="DIPLOMA",
            department_code=department_name,
            is_active=True,
        ).select_related("batch", "course")

        for department in departments:
            key = (department.batch_id, department.course_id, department.id)
            for semester_code, subject_names in subjects_by_semester.items():
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
