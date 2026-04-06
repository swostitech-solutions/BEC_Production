import os

import django


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Swostitech_Acadix.settings")
django.setup()

from Acadix.models import Branch, CourseDepartmentSubject, Department, Organization, Semester


DEPARTMENT_SUBJECTS = {
    "Electrical Engineering": {
        "1st Semester": [
            "Basic Electrical Engineering (23ES1001)",
            "Basic Electronics Engineering (23ES1002)",
            "Basic Electrical Engineering LAB (23ES1201)",
            "Basic Electronics Engineering  LAB (23ES1202)",
        ],
        "2nd Semester": [
            "Basic Electrical Engineering (23ES1001)",
            "Basic Electronics Engineering (23ES1002)",
            "Basic Electrical Engineering LAB (23ES1201)",
            "Basic Electronics Engineering  LAB (23ES1202)",
        ],
        "3rd Semester": [
            "Electrical Circuit Analysis (EEPC2001)",
            "Analog & Digital Electronics Circuit (EOPC2002)",
            "Electrical Machine-I (EEPC2002)",
            "Advance Competency Course - I(Cyber security) (PCAC2007)",
            "Engineering Economics (HSHS2001)",
            "Math-III (HSBS2001)",
            "Electrical Circuit Analysis LAB (EEPC2201)",
            "Analog & Digital Electronics Circuit LAB (EOPC2202)",
            "Electrical Machine-I LAB(EEPC2202)",
            "Advance Competency Course - I Lab (Cyber security) (PCAC2207)",
        ],
        "4th Semester": [
            "Electrical Machine-II (EEPC2003)",
            "Electrical Measurement & Instrumentation (EEPC2004)",
            "Power Electronics (EEPC2005)",
            "Signal & Systems (EOPC2003)",
            "Organisational Behaviour (HSHS2002)",
            "Advance Competency Course - II(Internet of Things and Cloud) (PCAC2012)",
            "Electrical Machine-II Lab (EEPC2203)",
            "Electrical Measurement & Instrumentation Lab (EEPC2204)",
            "Power Electronics Lab (ECPC2202)",
            "Signal & Systems Lab (EOPC2203)",
        ],
        "5th Semester": [
            "Electrical Power Transmission and Distribution (REL5C001)",
            "Control System (REL5C002)",
            "Electrical Machine-II (REL5C003)",
            "Industrial Process Control and Dynamics (REL5D003)",
            "Renewable Power Generating System (REL5D005)",
            "Electrical Power Transmission and Distribution Lab (REL5C201)",
            "Control & Instrumentation Lab (REL5C202)",
            "Electrical Machine-II Lab (REL5C203)",
        ],
        "6th Semester": [
            "Power System operation and Control (REL6C001)",
            "Microprocessor & Microcontroller (REE6C002)",
            "Optimization Engineering (ROE6A001)",
            "Electrical Power System Protection (REL6D001)",
            "Artificial Intelligence and Machine Learning",
            "Power System operation and Control Lab (REL6C201)",
            "Microprocessor & Microcontroller Lab (REE6C202)",
            "Seminar - I (RSM6H202)",
            "Future-ready Contributor Program (RFC6H201)",
        ],
        "7th Semester": [
            "Entrepreneurship Development (RED7E001)",
            "High Voltage Systems and DC Transmission (REL7D002)",
            "Flexible AC Transmission Systems (REL7D004)",
            "Internet of Things (RIT7D001)",
            "Green Technology (RGT6A003)",
            "Soft Computing (RCS7D007)",
            "Minor Project (RMP7H201)",
            "Seminar - II (RSM7H202)",
            "Comprehensive Viva (RCV7H203)",
        ],
        "8th Semester": [
            "Major Project",
            "Grand Viva-voice",
        ],
    },
    "Electrical & Computer Engineering": {
        "1st Semester": [
            "Basic Electrical Engineering (23ES1001)",
            "Basic Electronics Engineering (23ES1002)",
            "Basic Electrical Engineering LAB (23ES1201)",
            "Basic Electronics Engineering  LAB (23ES1202)",
        ],
        "2nd Semester": [
            "Basic Electrical Engineering (23ES1001)",
            "Basic Electronics Engineering (23ES1002)",
            "Basic Electrical Engineering LAB (23ES1201)",
            "Basic Electronics Engineering  LAB (23ES1202)",
        ],
        "3rd Semester": [
            "Electrical Circuit Analysis (EEPC2001)",
            "Analog & Digital Electronics Circuit (EOPC2002)",
            "Data Structures (CSPC2002)",
            "Advance Competency Course - I(Cyber security) (PCAC2007)",
            "Engineering Economics (HSHS2001)",
            "Math-III (HSBS2001)",
            "Electrical Circuit Analysis LAB (EEPC2201)",
            "Analog & Digital Electronics Circuit LAB (EOPC2202)",
            "Data Structures  Lab (CSPC2202)",
            "Advance Competency Course - I Lab (Cyber security) (PCAC2207)",
        ],
        "4th Semester": [
            "Electrical Machine (ECPC2001)",
            "Design and Analysis of Algorithms (CSPC2006)",
            "Power Electronics (EEPC2005)",
            "Database Engineering (CSPC2004)",
            "Organisational Behaviour (HSHS2002)",
            "Advance Competency Course - II(Internet of Things and Cloud) (PCAC2012)",
            "Electrical Machine Lab (ECPC2201)",
            "Design and Analysis of Algorithms  Lab (CSPC2206)",
            "Power Electronics Lab (ECPC2202)",
            "Database Engineering Lab(CSPC2204)",
        ],
        "5th Semester": [
            "Computer Organization and Architecture (RCS4C003)",
            "Control System (REL5C002)",
            "Operating Systems (RCS5C003)",
            "Power Electronics (REL4C003)",
            "Artificial Intelligence & Machine Learning (RCS5D002)",
            "Computer Organization and Architecture  Lab (RCS4C203)",
            "Control & Instrumentation Lab (REL5C202)",
            "Operating Systems Lab (RCS5C203)",
        ],
        "6th Semester": [
            "Software Engineering (RCS6C001)",
            "Electrical Power Transmission and Distribution (REL5C001)",
            "Optimization Engineering (ROE6A001)",
            "Embedded Systems (REC7D002)",
            "Renewable Power Generating System (REL5D005)",
            "Software Engineering Lab (RCS6C201)",
            "Electrical Power Transmission and Distribution Lab (REL5C201)",
            "Seminar - I (RSM6H202)",
            "Future-ready Contributor Program (RFC6H201)",
        ],
        "7th Semester": [
            "Entrepreneurship Development (RED7E001)",
            "Wireless Communication",
            "Smart Grid (REL7D003)",
            "Industrial safety Engineering",
            "Green Technology (RGT6A003)",
            "Disaster Management (REV5D004)",
            "Minor Project (RMP7H201)",
            "Seminar - II (RSM7H202)",
            "Comprehensive Viva (RCV7H203)",
        ],
        "8th Semester": [
            "Major Project",
            "Grand Viva-voice",
        ],
    },
    "Mechanical Engineering": {
        "1st Semester": [
            "Engineering Mechanics(23ES1004)",
            "Basic Mechanical Engineering(23ES1006)",
        ],
        "2nd Semester": [
            "Engineering Mechanics(23ES1004)",
            "Basic Mechanical Engineering(23ES1006)",
        ],
        "3rd Semester": [
            "Mechanics of Solid(MEPC2001)",
            "Engineering Thermodynamics(MEPC2002)",
            "Introduction to Physical Metallurgy & Engineering Materials(MFPC2002)",
        ],
        "4th Semester": [
            "Basic Manufacturing Process(MEPC2006)",
            "Fluid Mechanics and Hydraulic Machines(MEPC2003)",
            "Kinematics and dynamics of Machines(MEPC2004)",
            "Design of Machine Elements-I (MEPC2005)",
        ],
        "5th Semester": [
            "Basic Manufacturing Process(PC11)",
            "Mechanisms and Machines(PC12)",
            "Heat Transfer(PC13)",
            "Automobile Engineering(PE2)",
            "Non-Convensional Energy Sources(PE3)",
        ],
        "6th Semester": [
            "Design of Machine Element(RME6C001)",
            "Machining Science and Technology(RME6C002)",
            "Smart and Composite Materials(RME6D001)",
        ],
        "7th Semester": [
            "Product Design and Product Tooling(PE)",
            "Refrigeration and Air Conditioning (PE)",
        ],
        "8th Semester": [
            "Major Project",
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
