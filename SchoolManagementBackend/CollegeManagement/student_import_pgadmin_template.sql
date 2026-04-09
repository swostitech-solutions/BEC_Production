-- Student import template for pgAdmin
-- Scope for current seed:
--   batch            = 2024-2028
--   course           = BTECH
--   department       = Agriculture Engineering
--   academic year    = 1st Year
--   current semester = 2nd Semester
--   section          = Section A
--   fee group        = 2024-2028 BTECH Agriculture 1st year
--   fee applied from = 1st Semester for Regular / 3rd Semester for Lateral
--
-- How to use:
-- 1. Run the staging-table block once.
-- 2. Import your Excel CSV into public.stg_student_import using pgAdmin Import/Export.
-- 3. Run the processing block.
-- 4. Review the verification queries at the end.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.stg_student_import (
    session_batch text,
    course text,
    department text,
    academic_year text,
    semester text,
    section text,
    onmrc_registration_no text,
    first_name text,
    middle_name text,
    last_name text,
    gender text,
    date_of_birth text,
    religion text,
    category text,
    nationality text,
    blood_group text,
    mother_tongue text,
    admission_type text,
    student_phone_number text,
    student_email_id text,
    student_aadhar_number text,
    father_name text,
    father_profession text,
    father_phone_number text,
    father_email_id text,
    father_aadhar_number text,
    mother_name text,
    mother_profession text,
    mother_phone_number text,
    mother_email_id text,
    mother_aadhar_number text,
    address_in_details text
);

-- Optional before each fresh import:
-- TRUNCATE TABLE public.stg_student_import;

BEGIN;

DROP TABLE IF EXISTS tmp_student_norm;
CREATE TEMP TABLE tmp_student_norm AS
WITH cleaned AS (
    SELECT
        trim(session_batch) AS session_batch,
        upper(trim(course)) AS course_code,
        CASE
            WHEN lower(trim(department)) = 'agriculture' THEN 'Agriculture Engineering'
            WHEN replace(lower(trim(department)), ' ', '') IN ('cse(ds)', 'cseds') THEN 'Computer Science & Engineering (Data Science)'
            ELSE trim(department)
        END AS department_name,
        CASE
            WHEN lower(trim(academic_year)) = '1st year' THEN '1st Year'
            WHEN lower(trim(academic_year)) = '2nd year' THEN '2nd Year'
            WHEN lower(trim(academic_year)) = '3rd year' THEN '3rd Year'
            WHEN lower(trim(academic_year)) = '4th year' THEN '4th Year'
            ELSE initcap(trim(academic_year))
        END AS academic_year_name,
        CASE
            WHEN lower(replace(trim(semester), ' ', '')) IN ('semester2', '2ndsemester') THEN '2nd Semester'
            WHEN lower(replace(trim(semester), ' ', '')) IN ('semester1', '1stsemester') THEN '1st Semester'
            WHEN lower(replace(trim(semester), ' ', '')) IN ('semester3', '3rdsemester') THEN '3rd Semester'
            WHEN lower(replace(trim(semester), ' ', '')) IN ('semester4', '4thsemester') THEN '4th Semester'
            WHEN lower(replace(trim(semester), ' ', '')) IN ('semester5', '5thsemester') THEN '5th Semester'
            WHEN lower(replace(trim(semester), ' ', '')) IN ('semester6', '6thsemester') THEN '6th Semester'
            WHEN lower(replace(trim(semester), ' ', '')) IN ('semester7', '7thsemester') THEN '7th Semester'
            WHEN lower(replace(trim(semester), ' ', '')) IN ('semester8', '8thsemester') THEN '8th Semester'
            ELSE trim(semester)
        END AS semester_name,
        btrim(section) AS section_name,
        NULLIF(trim(onmrc_registration_no), '') AS registration_no,
        NULLIF(btrim(first_name), '') AS first_name,
        NULLIF(btrim(middle_name), '') AS middle_name,
        NULLIF(btrim(last_name), '') AS last_name,
        CASE
            WHEN lower(trim(gender)) = 'male' THEN 'Male'
            WHEN lower(trim(gender)) = 'female' THEN 'Female'
            WHEN lower(trim(gender)) = 'other' THEN 'Other'
            ELSE NULLIF(initcap(trim(gender)), '')
        END AS gender_name,
        CASE
            WHEN NULLIF(trim(date_of_birth), '') IS NOT NULL THEN to_date(trim(date_of_birth), 'DD-MM-YYYY')
            ELSE NULL
        END AS dob,
        NULLIF(initcap(trim(religion)), '') AS religion_name,
        CASE
            WHEN upper(trim(category)) = 'GENERAL' THEN 'General'
            WHEN upper(trim(category)) = 'OBC' THEN 'OBC'
            WHEN upper(trim(category)) = 'SC' THEN 'SC'
            WHEN upper(trim(category)) = 'ST' THEN 'ST'
            ELSE NULLIF(initcap(trim(category)), '')
        END AS category_name,
        NULLIF(initcap(trim(nationality)), '') AS nationality_name,
        NULLIF(upper(trim(blood_group)), '') AS blood_name,
        CASE
            WHEN upper(trim(mother_tongue)) = 'ODIA' THEN 'Odia'
            ELSE NULLIF(initcap(trim(mother_tongue)), '')
        END AS mother_tongue_name,
        CASE
            WHEN upper(trim(COALESCE(admission_type, 'Regular'))) = 'LATERAL' THEN 'LATERAL'
            ELSE 'Regular'
        END AS admission_type,
        NULLIF(substring(regexp_replace(COALESCE(student_phone_number, ''), '\D', '', 'g') FROM 1 FOR 10), '') AS student_phone,
        NULLIF(btrim(student_email_id), '') AS student_email,
        NULLIF(substring(regexp_replace(COALESCE(student_aadhar_number, ''), '\D', '', 'g') FROM 1 FOR 12), '') AS student_aadhaar,
        NULLIF(btrim(father_name), '') AS father_name,
        NULLIF(btrim(father_profession), '') AS father_profession,
        NULLIF(substring(regexp_replace(COALESCE(father_phone_number, ''), '\D', '', 'g') FROM 1 FOR 10), '') AS father_phone,
        NULLIF(btrim(father_email_id), '') AS father_email,
        NULLIF(substring(regexp_replace(COALESCE(father_aadhar_number, ''), '\D', '', 'g') FROM 1 FOR 12), '') AS father_aadhaar,
        NULLIF(btrim(mother_name), '') AS mother_name,
        NULLIF(btrim(mother_profession), '') AS mother_profession,
        NULLIF(substring(regexp_replace(COALESCE(mother_phone_number, ''), '\D', '', 'g') FROM 1 FOR 10), '') AS mother_phone,
        NULLIF(btrim(mother_email_id), '') AS mother_email,
        NULLIF(substring(regexp_replace(COALESCE(mother_aadhar_number, ''), '\D', '', 'g') FROM 1 FOR 12), '') AS mother_aadhaar,
        NULLIF(btrim(address_in_details), '') AS raw_address,
        COALESCE(NULLIF(btrim(address_in_details), ''), 'Address not provided') AS full_address,
        COALESCE((regexp_match(COALESCE(address_in_details, ''), '([0-9]{6})'))[1], '000000') AS detected_pincode,
        trim(session_batch) || ' ' || upper(trim(course)) || ' ' || trim(department) || ' ' || lower(trim(academic_year)) AS fee_structure_desc_raw
    FROM public.stg_student_import
    WHERE NULLIF(trim(onmrc_registration_no), '') IS NOT NULL
),
resolved AS (
    SELECT
        c.*,
        1::integer AS organization_id,
        1::integer AS branch_id,
        b.id AS batch_id,
        cr.id AS course_id,
        d.id AS department_id,
        ay.id AS academic_year_id,
        sem.id AS semester_id,
        sec.id AS section_id,
        fee.id AS fee_group_id,
        fee_from.id AS fee_applied_from_id
    FROM cleaned c
    JOIN "Acadix_batch" b
      ON b.batch_code = c.session_batch
    JOIN "Acadix_course" cr
      ON cr.batch_id = b.id
     AND cr.course_code = c.course_code
    JOIN "Acadix_department" d
      ON d.batch_id = b.id
     AND d.course_id = cr.id
     AND lower(d.department_description) = lower(c.department_name)
    JOIN "Acadix_academicyear" ay
      ON ay.batch_id = b.id
     AND ay.course_id = cr.id
     AND ay.department_id = d.id
     AND lower(ay.academic_year_code) = lower(c.academic_year_name)
    JOIN "Acadix_semester" sem
      ON sem.batch_id = b.id
     AND sem.course_id = cr.id
     AND sem.department_id = d.id
     AND sem.academic_year_id = ay.id
     AND lower(sem.semester_description) = lower(c.semester_name)
    JOIN "Acadix_section" sec
      ON sec.batch_id = b.id
     AND sec.course_id = cr.id
     AND sec.department_id = d.id
     AND sec.academic_year_id = ay.id
     AND sec.semester_id = sem.id
     AND lower(sec.section_name) = lower(c.section_name)
    JOIN "Acadix_feestructuremaster" fee
      ON fee.batch_id = b.id
     AND fee.course_id = cr.id
     AND fee.department_id = d.id
     AND fee.academic_year_id = ay.id
     AND lower(fee.fee_structure_description) = lower(c.fee_structure_desc_raw)
    JOIN "Acadix_semester" fee_from
      ON fee_from.batch_id = b.id
     AND fee_from.course_id = cr.id
     AND fee_from.department_id = d.id
     AND fee_from.is_active = true
     AND lower(fee_from.semester_description) = lower(
         CASE
             WHEN c.admission_type = 'LATERAL' THEN '3rd Semester'
             ELSE '1st Semester'
         END
     )
)
SELECT * FROM resolved;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM public.stg_student_import s
        LEFT JOIN tmp_student_norm t
          ON t.registration_no = NULLIF(trim(s.onmrc_registration_no), '')
        WHERE NULLIF(trim(s.onmrc_registration_no), '') IS NOT NULL
          AND t.registration_no IS NULL
    ) THEN
        RAISE EXCEPTION 'Some staging rows could not be mapped to batch/course/department/academic year/semester/section/fee group';
    END IF;
END $$;

INSERT INTO "Acadix_gender" (
    gender_code, gender_name, organization_id, branch_id, is_active, created_by, updated_by, created_at, updated_at
)
SELECT DISTINCT
    CASE
        WHEN lower(gender_name) = 'male' THEN 'M'
        WHEN lower(gender_name) = 'female' THEN 'F'
        WHEN lower(gender_name) = 'other' THEN 'O'
        ELSE upper(left(gender_name, 1))
    END,
    gender_name,
    1, 1, true, 1, 1, now(), now()
FROM tmp_student_norm
WHERE gender_name IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM "Acadix_gender" g WHERE lower(g.gender_name) = lower(tmp_student_norm.gender_name)
  );

INSERT INTO "Acadix_religion" (
    religion_code, religion_name, organization_id, branch_id, is_active, created_by, updated_by, created_at, updated_at
)
SELECT DISTINCT
    upper(left(religion_name, 10)),
    religion_name,
    1, 1, true, 1, 1, now(), now()
FROM tmp_student_norm
WHERE religion_name IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM "Acadix_religion" r WHERE lower(r.religion_name) = lower(tmp_student_norm.religion_name)
  );

INSERT INTO "Acadix_category" (
    category_code, category_name, organization_id, branch_id, is_active, created_by, updated_by, created_at, updated_at
)
SELECT DISTINCT
    upper(left(category_name, 10)),
    category_name,
    1, 1, true, 1, 1, now(), now()
FROM tmp_student_norm
WHERE category_name IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM "Acadix_category" c WHERE lower(c.category_name) = lower(tmp_student_norm.category_name)
  );

INSERT INTO "Acadix_nationality" (
    nationality_code, nationality_name, organization_id, branch_id, is_active, created_by, updated_by, created_at, updated_at
)
SELECT DISTINCT
    upper(left(nationality_name, 10)),
    nationality_name,
    1, 1, true, 1, 1, now(), now()
FROM tmp_student_norm
WHERE nationality_name IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM "Acadix_nationality" n WHERE lower(n.nationality_name) = lower(tmp_student_norm.nationality_name)
  );

INSERT INTO "Acadix_blood" (
    blood_code, blood_name, organization_id, branch_id, is_active, created_by, updated_by, created_at, updated_at
)
SELECT DISTINCT
    blood_name,
    blood_name,
    1, 1, true, 1, 1, now(), now()
FROM tmp_student_norm
WHERE blood_name IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM "Acadix_blood" b WHERE upper(b.blood_name) = upper(tmp_student_norm.blood_name)
  );

INSERT INTO "Acadix_mothertongue" (
    mother_tongue_code, mother_tongue_name, organization_id, branch_id, is_active, created_by, updated_by, created_at, updated_at
)
SELECT DISTINCT
    upper(left(mother_tongue_name, 10)),
    mother_tongue_name,
    1, 1, true, 1, 1, now(), now()
FROM tmp_student_norm
WHERE mother_tongue_name IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM "Acadix_mothertongue" m WHERE lower(m.mother_tongue_name) = lower(tmp_student_norm.mother_tongue_name)
  );

WITH admission_base AS (
    SELECT COALESCE(MAX(admission_no::integer), 1000) AS max_admission_no
    FROM "Acadix_studentregistration"
    WHERE admission_no ~ '^[0-9]+$'
),
to_insert AS (
    SELECT
        t.*,
        ROW_NUMBER() OVER (ORDER BY t.registration_no) AS rn,
        g.id AS gender_id,
        r.id AS religion_id,
        c.id AS category_id,
        n.id AS nationality_id,
        b.id AS blood_id,
        mt.id AS mother_tongue_id
    FROM tmp_student_norm t
    LEFT JOIN "Acadix_gender" g
      ON t.gender_name IS NOT NULL
     AND lower(g.gender_name) = lower(t.gender_name)
    LEFT JOIN "Acadix_religion" r
      ON t.religion_name IS NOT NULL
     AND lower(r.religion_name) = lower(t.religion_name)
    LEFT JOIN "Acadix_category" c
      ON t.category_name IS NOT NULL
     AND lower(c.category_name) = lower(t.category_name)
    LEFT JOIN "Acadix_nationality" n
      ON t.nationality_name IS NOT NULL
     AND lower(n.nationality_name) = lower(t.nationality_name)
    LEFT JOIN "Acadix_blood" b
      ON t.blood_name IS NOT NULL
     AND upper(b.blood_name) = upper(t.blood_name)
    LEFT JOIN "Acadix_mothertongue" mt
      ON t.mother_tongue_name IS NOT NULL
     AND lower(mt.mother_tongue_name) = lower(t.mother_tongue_name)
    WHERE NOT EXISTS (
        SELECT 1
        FROM "Acadix_studentregistration" s
        WHERE s.registration_no = t.registration_no
    )
),
inserted AS (
    INSERT INTO "Acadix_studentregistration" (
        first_name,
        middle_name,
        last_name,
        organization_id,
        branch_id,
        batch_id,
        admission_type,
        course_id,
        department_id,
        academic_year_id,
        semester_id,
        section_id,
        date_of_birth,
        college_admission_no,
        religion_id,
        gender_id,
        nationality_id,
        contact_no,
        blood_id,
        enrollment_no,
        barcode,
        admission_no,
        registration_no,
        category_id,
        mother_tongue_id,
        status,
        email,
        children_in_family,
        student_aadhaar_no,
        user_name,
        remarks,
        referred_by,
        father_name,
        mother_name,
        mother_aadhaar_no,
        mother_profession,
        mother_contact_number,
        mother_email,
        father_aadhaar_no,
        father_profession,
        father_contact_number,
        father_email,
        primary_guardian,
        is_active,
        created_by,
        updated_by,
        created_at,
        updated_at
    )
    SELECT
        ti.first_name,
        ti.middle_name,
        ti.last_name,
        ti.organization_id,
        ti.branch_id,
        ti.batch_id,
        ti.admission_type,
        ti.course_id,
        ti.department_id,
        ti.academic_year_id,
        ti.semester_id,
        ti.section_id,
        ti.dob,
        (ab.max_admission_no + ti.rn)::text,
        ti.religion_id,
        ti.gender_id,
        ti.nationality_id,
        NULL,
        ti.blood_id,
        NULL,
        '',
        (ab.max_admission_no + ti.rn)::text,
        ti.registration_no,
        ti.category_id,
        ti.mother_tongue_id,
        'ACTIVE',
        ti.student_email,
        NULL,
        ti.student_aadhaar,
        regexp_replace(COALESCE(ti.first_name, 'STUDENT'), '\s+', '', 'g') || (ab.max_admission_no + ti.rn)::text,
        NULL,
        NULL,
        ti.father_name,
        ti.mother_name,
        ti.mother_aadhaar,
        ti.mother_profession,
        ti.mother_phone,
        ti.mother_email,
        ti.father_aadhaar,
        ti.father_profession,
        ti.father_phone,
        ti.father_email,
        'FATHER',
        true,
        1,
        1,
        now(),
        now()
    FROM to_insert ti
    CROSS JOIN admission_base ab
    RETURNING id, registration_no, user_name, first_name
)
SELECT COUNT(*) AS inserted_student_rows FROM inserted;

WITH target_students AS (
    SELECT
        s.id AS student_id,
        s.registration_no,
        s.user_name,
        s.first_name,
        n.*
    FROM tmp_student_norm n
    JOIN "Acadix_studentregistration" s
      ON s.registration_no = n.registration_no
)
INSERT INTO "Acadix_address" (
    reference_id,
    organization_id,
    branch_id,
    usertype,
    present_address,
    present_pincode,
    present_city,
    present_state,
    present_country,
    present_phone_number,
    permanent_address,
    permanent_pincode,
    permanent_city,
    permanent_state,
    permanent_country,
    permanent_phone_number,
    is_active,
    created_by,
    updated_by,
    created_at,
    updated_at
)
SELECT
    ts.student_id,
    ts.organization_id,
    ts.branch_id,
    'STUDENT',
    left(ts.full_address, 250),
    ts.detected_pincode,
    'Unknown',
    'Odisha',
    'India',
    ts.student_phone,
    left(ts.full_address, 250),
    ts.detected_pincode,
    'Unknown',
    'Odisha',
    'India',
    ts.student_phone,
    true,
    1,
    1,
    now(),
    now()
FROM target_students ts
WHERE ts.raw_address IS NOT NULL
  AND ts.raw_address <> ''
  AND NOT EXISTS (
    SELECT 1
    FROM "Acadix_address" a
    WHERE a.reference_id = ts.student_id
      AND upper(a.usertype) = 'STUDENT'
);

WITH target_students AS (
    SELECT s.id AS student_id
    FROM tmp_student_norm n
    JOIN "Acadix_studentregistration" s
      ON s.registration_no = n.registration_no
),
parent_base AS (
    SELECT COALESCE(MAX(parent_id), 100) AS max_parent_id
    FROM "Acadix_parent"
),
parent_todo AS (
    SELECT
        ts.student_id,
        ROW_NUMBER() OVER (ORDER BY ts.student_id) AS rn
    FROM target_students ts
    WHERE NOT EXISTS (
        SELECT 1 FROM "Acadix_parent" p WHERE p.student_id = ts.student_id
    )
)
INSERT INTO "Acadix_parent" (
    parent_id,
    student_id,
    is_active
)
SELECT
    pb.max_parent_id + pt.rn,
    pt.student_id,
    true
FROM parent_todo pt
CROSS JOIN parent_base pb;

WITH target_students AS (
    SELECT
        s.id AS student_id,
        s.user_name,
        s.first_name,
        n.*
    FROM tmp_student_norm n
    JOIN "Acadix_studentregistration" s
      ON s.registration_no = n.registration_no
)
INSERT INTO "Acadix_studentcourse" (
    academic_year_id,
    student_id,
    organization_id,
    branch_id,
    batch_id,
    course_id,
    department_id,
    semester_id,
    section_id,
    fee_group_id,
    fee_applied_from_id,
    enrollment_no,
    house_id,
    hostel_availed,
    hostel_choice_semester,
    temp_hostel_choice_semester,
    transport_availed,
    choice_semester,
    route_id,
    student_status,
    is_active,
    is_promoted,
    created_by,
    updated_by,
    created_at,
    updated_at
)
SELECT
    ts.academic_year_id,
    ts.student_id,
    ts.organization_id,
    ts.branch_id,
    ts.batch_id,
    ts.course_id,
    ts.department_id,
    ts.semester_id,
    ts.section_id,
    ts.fee_group_id,
    ts.fee_applied_from_id,
    NULL,
    (SELECT id FROM "Acadix_house" ORDER BY id LIMIT 1),
    false,
    NULL,
    NULL,
    false,
    '',
    NULL,
    'ACTIVE',
    true,
    false,
    1,
    1,
    now(),
    now()
FROM target_students ts
WHERE NOT EXISTS (
    SELECT 1
    FROM "Acadix_studentcourse" sc
    WHERE sc.student_id = ts.student_id
      AND sc.is_active = true
);

WITH target_students AS (
    SELECT
        s.id AS student_id,
        s.registration_no,
        n.fee_group_id,
        n.fee_applied_from_id,
        n.organization_id,
        n.branch_id,
        n.academic_year_id,
        n.department_id
    FROM tmp_student_norm n
    JOIN "Acadix_studentregistration" s
      ON s.registration_no = n.registration_no
),
student_course_map AS (
    SELECT
        ts.student_id,
        ts.registration_no,
        ts.fee_group_id,
        ts.fee_applied_from_id,
        ts.organization_id,
        ts.branch_id,
        ts.academic_year_id,
        ts.department_id,
        sc.id AS student_course_id
    FROM target_students ts
    JOIN "Acadix_studentcourse" sc
      ON sc.student_id = ts.student_id
     AND sc.is_active = true
),
fee_rows AS (
    SELECT
        scm.student_id,
        scm.student_course_id,
        scm.fee_group_id,
        scm.fee_applied_from_id,
        scm.organization_id,
        scm.branch_id,
        scm.academic_year_id,
        scm.department_id,
        fsd.id AS fee_structure_details_id,
        fet.element_name,
        fsd.amount,
        sem_map.semester_id
    FROM student_course_map scm
    JOIN "Acadix_feestructuredetail" fsd
      ON fsd.fee_structure_master_id = scm.fee_group_id
     AND fsd.is_active = true
    JOIN "Acadix_feeelementtype" fet
      ON fet.id = fsd.element_type_id
    JOIN "Acadix_semester" fee_from_sem
      ON fee_from_sem.id = scm.fee_applied_from_id
    CROSS JOIN LATERAL (
        VALUES
            (fsd.semester_1),
            (fsd.semester_2),
            (fsd.semester_3),
            (fsd.semester_4),
            (fsd.semester_5),
            (fsd.semester_6),
            (fsd.semester_7),
            (fsd.semester_8)
    ) AS sem_map(semester_id)
    JOIN "Acadix_semester" fee_sem
      ON fee_sem.id = sem_map.semester_id
    WHERE sem_map.semester_id IS NOT NULL
      AND COALESCE(fee_sem.display_order, fee_sem.id) >= COALESCE(fee_from_sem.display_order, fee_from_sem.id)
)
INSERT INTO "Acadix_studentfeedetail" (
    student_id,
    student_course_id,
    fee_group_id,
    fee_structure_details_id,
    element_name,
    fee_applied_from_id,
    semester_id,
    paid,
    organization_id,
    branch_id,
    academic_year_id,
    department_id,
    multiplying_factor,
    element_amount,
    element_discount_amount,
    total_element_period_amount,
    paid_amount,
    remarks,
    reverse_flag,
    is_active,
    created_by,
    updated_by,
    created_at,
    updated_at
)
SELECT
    fr.student_id,
    fr.student_course_id,
    fr.fee_group_id,
    fr.fee_structure_details_id,
    fr.element_name,
    fr.fee_applied_from_id,
    fr.semester_id,
    'N',
    fr.organization_id,
    fr.branch_id,
    fr.academic_year_id,
    fr.department_id,
    1,
    fr.amount,
    NULL,
    fr.amount,
    0,
    NULL,
    NULL,
    true,
    1,
    1,
    now(),
    now()
FROM fee_rows fr
WHERE NOT EXISTS (
    SELECT 1
    FROM "Acadix_studentfeedetail" sfd
    WHERE sfd.student_id = fr.student_id
      AND COALESCE(sfd.student_course_id, 0) = fr.student_course_id
      AND COALESCE(sfd.fee_structure_details_id, 0) = fr.fee_structure_details_id
      AND COALESCE(sfd.semester_id, 0) = fr.semester_id
      AND sfd.element_name = fr.element_name
);

COMMIT;

-- Verification
SELECT COUNT(*) AS staged_rows FROM public.stg_student_import;

SELECT
    COUNT(*) AS inserted_students
FROM "Acadix_studentregistration"
WHERE registration_no IN (
    SELECT NULLIF(trim(onmrc_registration_no), '')
    FROM public.stg_student_import
);

SELECT
    COUNT(*) AS inserted_student_courses
FROM "Acadix_studentcourse" sc
JOIN "Acadix_studentregistration" s
  ON s.id = sc.student_id
WHERE s.registration_no IN (
    SELECT NULLIF(trim(onmrc_registration_no), '')
    FROM public.stg_student_import
);

SELECT
    COUNT(*) AS inserted_fee_rows
FROM "Acadix_studentfeedetail" sfd
JOIN "Acadix_studentregistration" s
  ON s.id = sfd.student_id
WHERE s.registration_no IN (
    SELECT NULLIF(trim(onmrc_registration_no), '')
    FROM public.stg_student_import
);
