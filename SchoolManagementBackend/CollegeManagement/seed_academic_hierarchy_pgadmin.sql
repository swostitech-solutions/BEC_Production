BEGIN;

CREATE TEMP TABLE tmp_batches (
    batch_code text,
    start_year integer,
    end_year integer
) ON COMMIT DROP;

INSERT INTO tmp_batches (batch_code, start_year, end_year) VALUES
('2024-2028', 2024, 2028),
('2024-2027', 2024, 2027),
('2023-2027', 2023, 2027),
('2023-2026', 2023, 2026),
('2022-2026', 2022, 2026),
('2022-2025', 2022, 2025),
('2021-2025', 2021, 2025);

CREATE TEMP TABLE tmp_courses (
    course_code text,
    course_name text,
    duration_years integer,
    total_semesters integer
) ON COMMIT DROP;

INSERT INTO tmp_courses (course_code, course_name, duration_years, total_semesters) VALUES
('BTECH', 'BTECH', 4, 8),
('DIPLOMA', 'Diploma', 3, 6),
('MBA', 'MBA', 2, 4);

CREATE TEMP TABLE tmp_departments (
    course_code text,
    department_code text,
    department_description text
) ON COMMIT DROP;

INSERT INTO tmp_departments (course_code, department_code, department_description) VALUES
('BTECH', 'AGRI', 'Agriculture Engineering'),
('BTECH', 'FOODTECH', 'Food Engineering & Technology'),
('BTECH', 'AERO', 'Aeronautical Engineering'),
('BTECH', 'AME', 'Aircraft Maintenance Engineering'),
('BTECH', 'CIVIL', 'Civil Engineering'),
('BTECH', 'CIVILENV', 'Civil & Environmental Engineering'),
('BTECH', 'CSE', 'Computer Science & Engineering'),
('BTECH', 'CSEDS', 'Computer Science & Engineering (Data Science)'),
('BTECH', 'EE', 'Electrical Engineering'),
('BTECH', 'ECE', 'Electrical & Computer Engineering'),
('BTECH', 'MECH', 'Mechanical Engineering'),
('BTECH', 'MECHAM', 'Mechanical & Mechatronics Engineering (Additive Manufacturing)'),
('DIPLOMA', 'CIVIL', 'Civil Engineering'),
('DIPLOMA', 'EE', 'Electrical Engineering'),
('DIPLOMA', 'MECH', 'Mechanical Engineering'),
('DIPLOMA', 'AME', 'Aircraft Maintenance Engineering'),
('DIPLOMA', 'AERO', 'Aeronautical Engineering'),
('MBA', 'MKT', 'Marketing'),
('MBA', 'FIN', 'Finance'),
('MBA', 'HR', 'Human Resource'),
('MBA', 'SYS', 'Systems'),
('MBA', 'OPS', 'Operations Management'),
('MBA', 'AGRI', 'Agri-Business');

INSERT INTO "Acadix_batch" (
    batch_code,
    batch_description,
    date_from,
    date_to,
    is_active,
    created_by,
    updated_by,
    created_at,
    updated_at,
    organization_id,
    branch_id
)
SELECT
    UPPER(b.batch_code),
    b.batch_code,
    make_date(b.start_year, 7, 1),
    make_date(b.end_year, 6, 30),
    TRUE,
    1,
    1,
    NOW(),
    NOW(),
    1,
    1
FROM tmp_batches b
WHERE NOT EXISTS (
    SELECT 1
    FROM "Acadix_batch" existing
    WHERE existing.organization_id = 1
      AND existing.branch_id = 1
      AND existing.batch_code = UPPER(b.batch_code)
);

INSERT INTO "Acadix_course" (
    course_code,
    course_name,
    description,
    duration_years,
    total_semesters,
    is_active,
    created_by,
    updated_by,
    created_at,
    updated_at,
    organization_id,
    branch_id,
    batch_id
)
SELECT
    c.course_code,
    c.course_name,
    c.course_name || ' seeded for ' || b.batch_code,
    c.duration_years,
    c.total_semesters,
    TRUE,
    1,
    1,
    NOW(),
    NOW(),
    1,
    1,
    b.id
FROM "Acadix_batch" b
CROSS JOIN tmp_courses c
WHERE b.organization_id = 1
  AND b.branch_id = 1
  AND EXISTS (
      SELECT 1 FROM tmp_batches tb WHERE UPPER(tb.batch_code) = b.batch_code
  )
  AND NOT EXISTS (
      SELECT 1
      FROM "Acadix_course" existing
      WHERE existing.organization_id = 1
        AND existing.branch_id = 1
        AND existing.batch_id = b.id
        AND existing.course_code = c.course_code
  );

INSERT INTO "Acadix_department" (
    department_code,
    department_description,
    hod_name,
    office_contact,
    is_active,
    created_by,
    updated_by,
    created_at,
    updated_at,
    organization_id,
    branch_id,
    batch_id,
    course_id
)
SELECT
    d.department_code,
    d.department_description,
    'TBD',
    '0000000000',
    TRUE,
    1,
    1,
    NOW(),
    NOW(),
    1,
    1,
    b.id,
    c.id
FROM "Acadix_batch" b
JOIN "Acadix_course" c
    ON c.batch_id = b.id
   AND c.organization_id = 1
   AND c.branch_id = 1
JOIN tmp_departments d
    ON d.course_code = c.course_code
WHERE b.organization_id = 1
  AND b.branch_id = 1
  AND EXISTS (
      SELECT 1 FROM tmp_batches tb WHERE UPPER(tb.batch_code) = b.batch_code
  )
  AND NOT EXISTS (
      SELECT 1
      FROM "Acadix_department" existing
      WHERE existing.organization_id = 1
        AND existing.branch_id = 1
        AND existing.batch_id = b.id
        AND existing.course_id = c.id
        AND existing.department_code = d.department_code
  );

INSERT INTO "Acadix_academicyear" (
    academic_year_code,
    academic_year_description,
    date_from,
    date_to,
    display_order,
    is_active,
    created_by,
    updated_by,
    created_at,
    updated_at,
    organization_id,
    branch_id,
    batch_id,
    course_id,
    department_id
)
SELECT
    CASE gs.year_no
        WHEN 1 THEN '1st Year'
        WHEN 2 THEN '2nd Year'
        WHEN 3 THEN '3rd Year'
        WHEN 4 THEN '4th Year'
    END AS academic_year_code,
    CASE gs.year_no
        WHEN 1 THEN '1st Year'
        WHEN 2 THEN '2nd Year'
        WHEN 3 THEN '3rd Year'
        WHEN 4 THEN '4th Year'
    END AS academic_year_description,
    make_date(tb.start_year + gs.year_no - 1, 7, 1),
    make_date(tb.start_year + gs.year_no, 6, 30),
    gs.year_no,
    TRUE,
    1,
    1,
    NOW(),
    NOW(),
    1,
    1,
    b.id,
    c.id,
    d.id
FROM tmp_batches tb
JOIN "Acadix_batch" b
    ON b.batch_code = UPPER(tb.batch_code)
   AND b.organization_id = 1
   AND b.branch_id = 1
JOIN "Acadix_course" c
    ON c.batch_id = b.id
   AND c.organization_id = 1
   AND c.branch_id = 1
JOIN "Acadix_department" d
    ON d.batch_id = b.id
   AND d.course_id = c.id
   AND d.organization_id = 1
   AND d.branch_id = 1
JOIN generate_series(1, 4) AS gs(year_no)
    ON gs.year_no <= c.duration_years
WHERE NOT EXISTS (
    SELECT 1
    FROM "Acadix_academicyear" existing
    WHERE existing.organization_id = 1
      AND existing.branch_id = 1
      AND existing.batch_id = b.id
      AND existing.course_id = c.id
      AND existing.department_id = d.id
      AND existing.academic_year_code = CASE gs.year_no
          WHEN 1 THEN '1st Year'
          WHEN 2 THEN '2nd Year'
          WHEN 3 THEN '3rd Year'
          WHEN 4 THEN '4th Year'
      END
);

INSERT INTO "Acadix_semester" (
    semester_code,
    semester_description,
    date_from,
    date_to,
    display_order,
    is_active,
    created_by,
    updated_by,
    created_at,
    updated_at,
    organization_id,
    branch_id,
    batch_id,
    course_id,
    department_id,
    academic_year_id
)
SELECT
    'SEM-' || sem.sem_no,
    CASE sem.sem_no
        WHEN 1 THEN '1st Semester'
        WHEN 2 THEN '2nd Semester'
        WHEN 3 THEN '3rd Semester'
        WHEN 4 THEN '4th Semester'
        WHEN 5 THEN '5th Semester'
        WHEN 6 THEN '6th Semester'
        WHEN 7 THEN '7th Semester'
        WHEN 8 THEN '8th Semester'
    END,
    CASE WHEN sem.sem_no % 2 = 1
        THEN ay.date_from::timestamp
        ELSE make_timestamp(EXTRACT(YEAR FROM ay.date_from)::int + 1, 1, 1, 0, 0, 0)
    END,
    CASE WHEN sem.sem_no % 2 = 1
        THEN make_timestamp(EXTRACT(YEAR FROM ay.date_from)::int, 12, 31, 23, 59, 59)
        ELSE make_timestamp(EXTRACT(YEAR FROM ay.date_from)::int + 1, 6, 30, 23, 59, 59)
    END,
    sem.sem_no,
    TRUE,
    1,
    1,
    NOW(),
    NOW(),
    1,
    1,
    ay.batch_id,
    ay.course_id,
    ay.department_id,
    ay.id
FROM "Acadix_academicyear" ay
JOIN generate_series(1, 8) AS sem(sem_no)
    ON sem.sem_no BETWEEN ((ay.display_order - 1) * 2 + 1) AND (ay.display_order * 2)
JOIN "Acadix_course" c
    ON c.id = ay.course_id
WHERE ay.organization_id = 1
  AND ay.branch_id = 1
  AND sem.sem_no <= c.total_semesters
  AND NOT EXISTS (
      SELECT 1
      FROM "Acadix_semester" existing
      WHERE existing.organization_id = 1
        AND existing.branch_id = 1
        AND existing.batch_id = ay.batch_id
        AND existing.course_id = ay.course_id
        AND existing.department_id = ay.department_id
        AND existing.academic_year_id = ay.id
        AND existing.semester_code = 'SEM-' || sem.sem_no
  );

INSERT INTO "Acadix_section" (
    section_code,
    section_name,
    is_active,
    created_by,
    updated_by,
    created_at,
    updated_at,
    organization_id,
    branch_id,
    batch_id,
    course_id,
    department_id,
    academic_year_id,
    semester_id
)
SELECT
    'A',
    'Section A',
    TRUE,
    1,
    1,
    NOW(),
    NOW(),
    1,
    1,
    sem.batch_id,
    sem.course_id,
    sem.department_id,
    sem.academic_year_id,
    sem.id
FROM "Acadix_semester" sem
WHERE sem.organization_id = 1
  AND sem.branch_id = 1
  AND NOT EXISTS (
      SELECT 1
      FROM "Acadix_section" existing
      WHERE existing.organization_id = 1
        AND existing.branch_id = 1
        AND existing.batch_id = sem.batch_id
        AND existing.course_id = sem.course_id
        AND existing.department_id = sem.department_id
        AND existing.academic_year_id = sem.academic_year_id
        AND existing.semester_id = sem.id
        AND existing.section_code = 'A'
  );

INSERT INTO "Acadix_coursesemestersectionbind" (
    is_active,
    created_by,
    updated_by,
    created_at,
    updated_at,
    organization_id,
    branch_id,
    batch_id,
    course_id,
    department_id,
    academic_year_id,
    semester_id,
    section_id
)
SELECT
    TRUE,
    1,
    1,
    NOW(),
    NOW(),
    1,
    1,
    sec.batch_id,
    sec.course_id,
    sec.department_id,
    sec.academic_year_id,
    sec.semester_id,
    sec.id
FROM "Acadix_section" sec
WHERE sec.organization_id = 1
  AND sec.branch_id = 1
  AND NOT EXISTS (
      SELECT 1
      FROM "Acadix_coursesemestersectionbind" existing
      WHERE existing.organization_id = 1
        AND existing.branch_id = 1
        AND existing.batch_id = sec.batch_id
        AND existing.course_id = sec.course_id
        AND existing.department_id = sec.department_id
        AND existing.academic_year_id = sec.academic_year_id
        AND existing.semester_id = sec.semester_id
        AND existing.section_id = sec.id
  );

COMMIT;

SELECT
    (SELECT COUNT(*) FROM "Acadix_batch" WHERE organization_id = 1 AND branch_id = 1) AS batches,
    (SELECT COUNT(*) FROM "Acadix_course" WHERE organization_id = 1 AND branch_id = 1) AS courses,
    (SELECT COUNT(*) FROM "Acadix_department" WHERE organization_id = 1 AND branch_id = 1) AS departments,
    (SELECT COUNT(*) FROM "Acadix_academicyear" WHERE organization_id = 1 AND branch_id = 1) AS academic_years,
    (SELECT COUNT(*) FROM "Acadix_semester" WHERE organization_id = 1 AND branch_id = 1) AS semesters,
    (SELECT COUNT(*) FROM "Acadix_section" WHERE organization_id = 1 AND branch_id = 1) AS sections,
    (SELECT COUNT(*) FROM "Acadix_coursesemestersectionbind" WHERE organization_id = 1 AND branch_id = 1) AS binds;
