import os

import django


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Swostitech_Acadix.settings")
django.setup()

from Acadix.models import Branch, CourseDepartmentSubject, Department, Organization, Semester


DEPARTMENT_SUBJECTS = {
    "Civil Engineering": {
        "1st Semester": [
            "Basic Civil Engineering",
            "Engineering Graphics & Design Lab.",
        ],
        "2nd Semester": [
            "Basic Civil Engineering",
            "Engineering Graphics & Design Lab.",
        ],
        "3rd Semester": [
            "Mathematics - III",
            "Mechanics of Solids",
            "Engineering Survey",
            "Fluid Mechanics",
            "Engineering Economics / Organizational Behaviour",
            "IT Fundamentals for Cybersecurity - I",
            "Building Drawing Practice",
            "Fluid Mechanics Lab.",
            "Material Testing Lab.",
            "IT Fundamentals for Cybersecurity - I Lab",
        ],
        "4th Semester": [
            "Structural Analysis",
            "Fluid Dynamics",
            "ENVIRONMENTAL IMPACT ASSESSMENT ",
            "Engineering Economics / Organisational Behaviour",
            "Geotechnical Engineering",
            "Water Supply Engineering",
            "Water Supply and Sanitary Engineering",
            "Internet of Things And Cloud (Elective)",
            "Surveying Field Work",
            "Water Supply and Sanitary Engineering Lab",
            "Computer Aided Design",
            "Geotechnical Laboratory",
        ],
        "5th Semester": [
            "Design of Concrete Structures",
            "Water and Waste Water Engineering",
            "Geotechnical Engineering",
            "Structural Analysis-II (Elective)",
            "Railway and Airport Engineering (Elective)",
            "Design of Concrete Structures Lab",
            "Water and Waste Water Engineering Lab",
            "Geotechnical Engineering Lab",
            "Evaluation of Summer Internship",
        ],
        "6th Semester": [
            "Design of Steel Structures",
            "Hydrology &Irrigation Engineering",
            "Optimization in Engineering",
            "Microbial Technology & Biotechnology",
            "Ground Improvement Techniques (Elective)",
            "Artificial Intelligence and Machine Learning (Elective)",
            "Essence of Indian Knowledge Tradition-I",
            "Steel Structures Lab",
            "Irrigation Engineering Lab",
            "Future Ready Contributor Develop Model Lab",
            "Seminar - I",
        ],
        "7th Semester": [
            "Entrepreneurship Development",
            "Prestressed Concrete (Elective)",
            "Water Resource Engineering (Elective)",
            "Green Technology (Elective)",
            "Disaster Management (Elective)",
            "Internet of Things (Elective)",
            "Essence of Indian Knowledge Tradition - II",
            "Minor Project",
            "Seminar - II",
            "Comprehensive Viva",
        ],
        "8th Semester": [
            "Major Project",
        ],
    },
    "Aeronautical Engineering": {
        "3rd Semester": [
            "Mathematics-III (HSBS2001)",
            "Aero Engneering Thermodynamics(AEPC2001)",
            "Elements of Aircraft Engineering & Design(AEPC2002)",
            "Mechanics Of Solid(MEPC2001)",
            "IT Fundamentals for Cybersecurity-I(ACC-1)(PCAC2007)",
            "Engineering Economics (HSHS2001)",
        ],
        "4th Semester": [
            "Aerodynamics-1(AEPC2003)",
            "Aircraft Structure-1(AEPC2004)",
            "Aircraft Maintenance and Practice (AEPC2005)",
            "Aircraft Materials and Manufacturing (AEPC2006)",
            "Internet of Things and Cloud (ACC-2)(PCAC2012)",
            "Computer Aided Aircraft Drawing Lab(AEPC2203)",
            "Aerospace Structural Design Lab.(AEPC2204)",
            "Design of Aircraft Elements (AEPC2206)",
        ],
        "5th Semester": [
            "Aerodynamics-2(RAE5C001)",
            "Aircraft Performance(RAE5C002)",
            "Aerospace Propulsion (RAE5C003)",
            "Aircraft System and Instrumentation (RAE5D002)",
            "Helicopter engneering (RAE5D005)",
            "Universal Human Values (RUH5F001)",
            "Aircraft system Lab(RAE5C201)",
            "Computer Aided Modeling Lab (RAE5C202)",
            "Propulsion Lab (RAE5C203)",
            "Evaluation of Summer Internship",
        ],
        "6th Semester": [
            "Aircraft Structure-2(RAE6C001)",
            "Aircraft stabilityand control (RAEC002)",
            "Optimization in engineering (ROE6A001)",
            "Wind tunnel testing (RAC6D001)",
            "Finite element Method (RAE69001)",
            "Essence of indian knowledge tradition (RIK6F001)",
            "Aerodynamics-2 Lab (RAE6C201)",
            "Aircraft design Lab (RAE6C202)",
            "Future ready contributor programme (RFC6H201)",
            "Seminar-1 (RSM6H202)",
        ],
        "7th Semester": [
            "Entrepreneurship development (RED7E001)",
            "Avionics (RAE7D001)",
            "Launch Vehicle Aerodynamics (RAE7D002)",
            "Space Dynamics (RAE7D003)",
            "Rocket and Missile (RAE7D004)",
            "UAV systems (RAE7D005)",
            "Aircraft Navigation System (RAE7D006)",
            "Inter of things (RIT7D001)",
            "Electric and Hybrid Vehicles (REL6D002)",
            "Green Technology (RGT6A003)",
            "Internet and web technology (RIT6D002)",
            "Artificial intelligence and machine learning (RCS5D007)",
            "Soft computing (RCS7D007)",
            "Industrial safety engineering (RIS7B001)",
            "Intellectual property right (RIP7E002)",
            "Disaster management (REV5D004)",
            "Essential of indian knowledge tradition -II (RIKVD004)",
            "Minor Project (RMP7H201)",
            "Seminar-II (RSM7H202)",
            "Comprehensive viva (RCV7H203)",
        ],
        "8th Semester": [
            "Major Project",
        ],
    },
    "Aircraft Maintenance Engineering": {
        "3rd Semester": [
            "Mathematics-III (HSBS2001)",
            "Aero Engneering Thermodynamics(AEPC2001)",
            "Elements of Aircraft Engineering & Design(AEPC2002)",
            "Mechanics Of Solid(MEPC2001)",
            "IT Fundamentals for Cybersecurity-I(ACC-1)(PCAC2007)",
            "Engineering Economics (HSHS2001)",
        ],
        "4th Semester": [
            "Aerodynamics-1(AEPC2003)",
            "Aircraft Structure-1(AEPC2004)",
            "Aircraft Maintenance and Practice (AEPC2005)",
            "Aircraft Materials and Manufacturing (AEPC2006)",
            "Internet of Things and Cloud (ACC-2)(PCAC2012)",
            "Computer Aided Aircraft Drawing Lab(AEPC2203)",
            "Aerospace Structural Design Lab.(AEPC2204)",
            "Design of Aircraft Elements (AEPC2206)",
        ],
        "5th Semester": [
            "Aerodynamics-2(RAE5C001)",
            "Aircraft Performance(RAE5C002)",
            "Aerospace Propulsion (RAE5C003)",
            "Aircraft System and Instrumentation (RAE5D002)",
            "Helicopter engneering (RAE5D005)",
            "Universal Human Values (RUH5F001)",
            "Aircraft system Lab(RAE5C201)",
            "Computer Aided Modeling Lab (RAE5C202)",
            "Propulsion Lab (RAE5C203)",
            "Evaluation of Summer Internship",
        ],
        "6th Semester": [
            "Aircraft Structure-2(RAE6C001)",
            "Aircraft stabilityand control (RAEC002)",
            "Optimization in engineering (ROE6A001)",
            "Wind tunnel testing (RAC6D001)",
            "Finite element Method (RAE69001)",
            "Essence of indian knowledge tradition (RIK6F001)",
            "Aerodynamics-2 Lab (RAE6C201)",
            "Aircraft design Lab (RAE6C202)",
            "Future ready contributor programme (RFC6H201)",
            "Seminar-1 (RSM6H202)",
        ],
        "7th Semester": [
            "Entrepreneurship development (RED7E001)",
            "Avionics (RAE7D001)",
            "Launch Vehicle Aerodynamics (RAE7D002)",
            "Space Dynamics (RAE7D003)",
            "Rocket and Missile (RAE7D004)",
            "UAV systems (RAE7D005)",
            "Aircraft Navigation System (RAE7D006)",
            "Inter of things (RIT7D001)",
            "Electric and Hybrid Vehicles (REL6D002)",
            "Green Technology (RGT6A003)",
            "Internet and web technology (RIT6D002)",
            "Artificial intelligence and machine learning (RCS5D007)",
            "Soft computing (RCS7D007)",
            "Industrial safety engineering (RIS7B001)",
            "Intellectual property right (RIP7E002)",
            "Disaster management (REV5D004)",
            "Essential of indian knowledge tradition -II (RIKVD004)",
            "Minor Project (RMP7H201)",
            "Seminar-II (RSM7H202)",
            "Comprehensive viva (RCV7H203)",
        ],
        "8th Semester": [
            "Major Project",
        ],
    },
    "Agriculture Engineering": {
        "3rd Semester": [
            "AGPC2003 Engineering properties of agricultureal produce",
            "HSBS2001 Mathematics",
            "HSHS2001 Engineering econimics",
            "AGPC2001Farm Machinery & Equipment-I",
            "AGPC2002 Agriculture for Engineering",
            "Adv. Competency Course-I",
        ],
        "4th Semester": [
            "AGPC2004TES & C",
            "AGPC2005M & OCH",
            "AGPC2006FM & E-II",
            "AGPC2007PHECPO",
            "PCAC2012IOT and Cloud",
            "HSHS2002OB",
        ],
        "5th Semester": [
            "RAG5C001Farm Machinery & Equipment II",
            "RAG5C002Hydrology, Soil and Water Conservation Engineering",
            "RAG5C003Post-Harvest Engineering of Cereals, Pulses and Oilseeds",
            "RAG5D001Food Packaging & Storage Technology",
            "RAG5D004Application of Statistical Methods",
            "RUH5F001Universal Human Values",
        ],
        "6th Semester": [
            "RAG6C001Irrigation & Drainage Engineering",
            "RAG6C002Dairy & Food Engineering",
            "ROE6A001Optimization in Engineering",
            "RAG6D002Watershed Planning & Management",
            "REL5D005Renewable Power Generation Systems",
            "RIK6F001Essence of Indian Knowledge Tradition - I",
        ],
        "7th Semester": [
            "RED7E001Entrepreneurship Development",
            "RAG7D003Food Quality and Control",
            "RAG7D006Design of Soil and Water Conservation Structures",
            "RME7D005Refrigeration and Air Conditioning",
            "RIT7D001Internet of Things",
            "RCS5D002Artificial Intelligence & Machine Learning",
            "RIK7F001Essence of Indian Knowledge Tradition - II",
        ],
        "8th Semester": [
            "RMP8H201Internship/ Major Project",
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
            course__course_code="BTECH",
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
