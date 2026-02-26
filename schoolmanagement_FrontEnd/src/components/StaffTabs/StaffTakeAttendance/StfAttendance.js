import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";
import useFetchLectureList from "../../hooks/fetchLectureList";
import useFetchSubjectListBasedOnLecture from "../../hooks/fetchSubjectListBasedOnLecture";
import useFetchProfessorListBasedOnSubject from "../../hooks/fetchProfessorListBasedOnSubject";

const StfAttendance = () => {
  const dateRef = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    classId: "",
    sectionId: "",
    feeappfrom: "",
    subject: "",
    teacher: "",
    studentName: "",
    admissionNo: "",
  });
  const [assignmentDate, setAssignmentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedOrgBranch, setSelectedOrgBranch] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const organizationId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");
  const loggedInUserId = sessionStorage.getItem("userId"); // 🔹 Get logged-in staff ID

  const { BatchList, loading: loadingBatch, error: errorBatch } = useFetchSessionList(organizationId, branchId);

  const [selectedSession, setSelectedSession] = useState(null);
  const batchId = formData.batch;
  const { CourseList, loading: loadingCourses, error: errorCourses } =
    useFetchCourseByFilter(organizationId, batchId);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const courseId = formData.course;
  const {
    BranchList,
    loading: loadingBranches,
    error: errorBranches,
  } = useFetchBranch(organizationId, branchId, batchId, courseId);
  const departmentId = formData.branch;

  const {
    AcademicYearList,
    loading: loadingAcademicYears,
    error: errorAcademicYears,
  } = useFetchAcademicYearByFilter(
    organizationId,
    branchId,
    batchId,
    courseId,
    departmentId
  );

  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const academicYearId = formData.academic_year;

  const {
    SemesterList,
    loading: loadingSemesters,
    error: errorSemesters,
  } = useFetchSemesterByFilter(
    organizationId,
    branchId,
    batchId,
    courseId,
    departmentId,
    academicYearId
  );

  const [selectedSemester, setSelectedSemester] = useState(null);
  const semesterId = formData.semester;



  const {
    SectionList,
    loading: loadingSections,
    error: errorSections,
  } = useFetchSectionByFilter(
    organizationId,
    branchId,
    batchId,
    courseId,
    departmentId,
    academicYearId,
    semesterId
  );

  // ✅ Fetch Lecture List using updated hook (now uses LecturePeriod API internally)
  const {
    LectureList,
    loading: loadingLectures,
    error: errorLectures,
  } = useFetchLectureList(
    organizationId,
    branchId,
    batchId,
    courseId,
    departmentId,
    academicYearId,
    semesterId,
    formData.addmitted_section
  );

  const { SubjectList, loading: loadingSubjects, error: errorSubjects } =
    useFetchSubjectListBasedOnLecture(
      organizationId,
      branchId,
      batchId,
      courseId,
      departmentId,
      academicYearId,
      semesterId,
      formData.addmitted_section,
      formData.feeappfrom,
      assignmentDate
    );

  const { ProfessorList, loading: loadingProfessors, error: errorProfessors } =
    useFetchProfessorListBasedOnSubject(
      organizationId,
      branchId,
      batchId,
      courseId,
      departmentId,
      academicYearId,
      semesterId,
      formData.addmitted_section,
      formData.subject,
      formData.feeappfrom,
      assignmentDate
    );

  // 🔹 Auto-select logged-in professor/teacher
  useEffect(() => {
    if (ProfessorList && ProfessorList.length > 0 && loggedInUserId) {
      const loggedInProfessor = ProfessorList.find(
        (p) => p.professor_id === parseInt(loggedInUserId)
      );

      if (loggedInProfessor) {
        setFormData((prev) => ({ ...prev, teacher: loggedInProfessor.professor_id }));
      }
    }
  }, [ProfessorList, loggedInUserId]);

  const [selectedMonths, setSelectedMonths] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [smsTo, setSmsTo] = useState("B");

  const fromClassRef = useRef(null);
  const toClassRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);
  const [periods, setPeriods] = useState([]);

  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [filteredStudents, setFilteredStudents] = useState([]);
  const [tableVisible, setTableVisible] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [subjectsList, setSubjectsList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * rowsPerPage;
  const currentRows = attendanceData.slice(offset, offset + rowsPerPage);
  const pageCount = Math.ceil(attendanceData.length / rowsPerPage);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsEditing(false);

      const token = localStorage.getItem("accessToken");
      const userId = sessionStorage.getItem("userId");

      const date = dateRef.current?.value || new Date().toISOString().split("T")[0];
      const currentDate = new Date().toISOString().split("T")[0];

      if (date !== currentDate) {
        alert("Only today's attendance can be edited.");
        return;
      }

      const organization_id = sessionStorage.getItem("organization_id");
      const branch_id = sessionStorage.getItem("branch_id");
      const batch_id = formData.batch;
      const course_id = formData.course;
      const department_id = formData.branch;
      const academic_year_id = formData.academic_year;
      const semester_id = formData.semester;
      const section_id = formData.addmitted_section;
      const lecture_id = formData.feeappfrom || 1;
      const subject_id = formData.subject || 1;
      const professor_id = formData.teacher || 1;

      if (
        !organization_id ||
        !branch_id ||
        !batch_id ||
        !course_id ||
        !department_id ||
        !academic_year_id ||
        !semester_id ||
        !section_id
      ) {
        alert("Please ensure all dropdowns are selected before saving.");
        return;
      }

      const update_detail = attendanceData.map((student, index) => {
        const mark_Attendance =
          student.present === "P" || student.present === "present"
            ? "P"
            : "A";

        if (
          student.father_contact_number &&
          student.father_contact_number.length !== 10
        ) {
          alert(
            `Row ${index + 1}: Father's number for ${student.student_name} must be 10 digits.`
          );
          throw new Error("Validation failed");
        }

        if (
          student.mother_contact_number &&
          student.mother_contact_number.length !== 10
        ) {
          alert(
            `Row ${index + 1}: Mother's number for ${student.student_name} must be 10 digits.`
          );
          throw new Error("Validation failed");
        }

        return {
          student_id: student.student_id,
          father_contact_number: student.father_contact_number || "",
          mother_contact_number: student.mother_contact_number || "",
          mark_Attendance,
          remarks: student.remarks || "",
          send_sms_to: "B",
        };
      });

      const payload = {
        login_id: userId ? parseInt(userId) : 1,
        date,
        organization_id: parseInt(organization_id),
        branch_id: parseInt(branch_id),
        batch_id: parseInt(batch_id),
        course_id: parseInt(course_id),
        department_id: parseInt(department_id),
        academic_year_id: parseInt(academic_year_id),
        semester_id: parseInt(semester_id),
        section_id: parseInt(section_id),
        professor_id: parseInt(professor_id),
        subject_id: parseInt(subject_id),
        lecture_id: parseInt(lecture_id),
        update_detail,
      };

      console.log("📤 Saving Attendance Payload:", payload);

      const response = await fetch(
        `${ApiUrl.apiurl}StudentAttendance/CreateOrUpdateAttendance/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("📥 Save Response:", result);

      if (response.ok && result.message === "Success") {
        alert("✅ Attendance saved successfully!");
      } else {
        alert(`❌ Failed to save attendance: ${result.message || "Unknown error."}`);
      }
    } catch (error) {
      console.error("❌ Error while saving attendance:", error);
      alert("Error while saving attendance: " + error.message);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [studentsData, setStudentsData] = useState([]);

  const handleClassChange = (e) => {
    const classId = e.target.value;

    if (classId) {
      localStorage.setItem("selectedStudentClassId", classId);
    } else {
      localStorage.removeItem("selectedStudentClassId");
    }

    setFormData({
      classId: classId,
      sectionId: "",
      feeappfrom: "",
      subject: "",
      teacher: "",
      studentName: "",
      admissionNo: "",
    });

    setAttendanceData([]);
    setFilteredStudents([]);
    setTableVisible(false);
    setSubject("");
    setTeacher("");
    setAttendanceStatus("");
    setStudentError("");

    localStorage.removeItem("selectedStudentSectionId");
    localStorage.removeItem("selectedPeriodId");
    localStorage.removeItem("subjectId");
    localStorage.removeItem("teacherId");
    localStorage.removeItem("studentId");
  };

  const handleSectionChange = (e) => {
    const sectionId = e.target.value;

    if (sectionId) {
      localStorage.setItem("selectedStudentSectionId", sectionId);
    } else {
      localStorage.removeItem("selectedStudentSectionId");
    }

    localStorage.removeItem("selectedPeriodId");
    localStorage.removeItem("subjectId");
    localStorage.removeItem("teacherId");

    setFormData((prev) => ({
      ...prev,
      sectionId,
      feeappfrom: "",
      subject: "",
      teacher: "",
    }));

    setSubject("");
    setTeacher("");
    setSubjectsList([]);
    setTeachersList([]);
  };

  const handleClear = () => {
    setFormData({
      organization: "",
      branch: "",
      batch: "",
      course: "",
      department: "",
      academic_year: "",
      semester: "",
      addmitted_section: "",
      feeappfrom: "",
      subject: "",
      teacher: "",
      attendanceStatus: "",
    });

    setAttendanceData([]);

    if (dateRef.current) {
      dateRef.current.value = "";
    }

    setIsEditing(false);
    setAttendanceStatus("");
    setSmsTo("");

    console.log("✅ All fields and attendance data cleared.");
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleInputChange = (e) => {
    if (!e || !e.target) {
      console.error("Invalid event object", e);
      return;
    }

    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "feeappfrom") {
      localStorage.setItem("selectedPeriodId", value);
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setAssignmentDate(selectedDate);
    localStorage.setItem("assignmentDate", selectedDate);
  };

  useEffect(() => {
    if (attendanceData.length > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [attendanceData]);

  const fetchAttendanceData = async () => {
    const date = dateRef.current?.value;
    const organization_id = sessionStorage.getItem("organization_id");
    const branch_id = sessionStorage.getItem("branch_id");
    const batch_id = formData.batch;
    const course_id = formData.course;
    const department_id = formData.branch;
    const academic_year_id = formData.academic_year;
    const semester_id = formData.semester;
    const section_id = formData.addmitted_section;
    const lecture_id = formData.feeappfrom || "";
    const subject_id = formData.subject;
    const professor_id = formData.teacher;

    if (
      !date ||
      !organization_id ||
      !branch_id ||
      !batch_id ||
      !course_id ||
      !department_id ||
      !academic_year_id ||
      !semester_id ||
      !section_id ||
      !lecture_id ||
      !subject_id ||
      !professor_id
    ) {
      alert("Please fill all the required fields before displaying attendance.");
      return;
    }

    const apiUrl = `${ApiUrl.apiurl}StudentAttendance/GetSearchAttendanceByDateCourseDepartmentSemesterPeriod/?date=${date}&organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}&academic_year_id=${academic_year_id}&semester_id=${semester_id}&section_id=${section_id}&lecture_id=${lecture_id}&subject_id=${subject_id}&professor_id=${professor_id}`;

    console.log("Fetching Attendance Data from:", apiUrl);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log("Attendance API Response:", result);

      if (result.message === "success" && Array.isArray(result.data)) {
        setAttendanceData(result.data);
      } else {
        setAttendanceData([]);
        alert("No records found for the selected criteria.");
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      alert("An error occurred while fetching attendance data.");
    }
  };

  const handleContactNumberChange = (studentId, field, value) => {
    setAttendanceData((prevData) =>
      prevData.map((student) =>
        student.student_id === studentId
          ? { ...student, [field]: value }
          : student
      )
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                ATTENDANCE
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12  d-flex flex-wrap gap-2 ">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={fetchAttendanceData}
                  >
                    Display
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleEdit}
                    disabled={isEditing || isDisabled}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSave}
                    disabled={!isEditing}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={() => navigate("/staff/dashboard")}
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="row mt-3 mx-2">
                <div
                  className="col-12 custom-section-box"
                  style={{
                    minHeight: "260px",
                    padding: "20px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                  }}
                >
                  <div className="row mt-3">
                    {/* Date */}
                    <div className="col-md-3 mb-3">
                      <label htmlFor="date" className="form-label">
                        Date <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        id="date"
                        className="form-control detail"
                        defaultValue={assignmentDate}
                        ref={dateRef}
                        onChange={handleDateChange}
                      />
                    </div>

                    {/* Batch / Session */}
                    <div className="col-md-3">
                      <label className="form-label">
                        Session<span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        className="detail"
                        isLoading={loadingBatch}
                        options={
                          BatchList?.map((b) => ({
                            value: b.id,
                            label: b.batch_description,
                          })) || []
                        }
                        value={
                          BatchList?.find((b) => b.id === Number(formData.batch))
                            ? {
                              value: formData.batch,
                              label: BatchList.find((b) => b.id === Number(formData.batch))?.batch_description,
                            }
                            : null
                        }
                        onChange={(opt) => {
                          setFormData((prev) => ({ ...prev, batch: opt?.value || "" }));
                        }}
                        placeholder={
                          loadingBatch
                            ? "Loading Session..."
                            : errorBatch
                              ? "Error loading Session"
                              : "Select Session"
                        }
                      />
                    </div>

                    {/* Course */}
                    <div className="col-md-3">
                      <label className="form-label">
                        Course<span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        className="detail"
                        isLoading={loadingCourses}
                        options={
                          CourseList?.map((course) => ({
                            value: course.id,
                            label:
                              course.course_name ||
                              course.description ||
                              course.course_description ||
                              "Unnamed Course",
                          })) || []
                        }
                        value={
                          CourseList.find((c) => c.id === Number(formData.course))
                            ? {
                              value: formData.course,
                              label:
                                CourseList.find((c) => c.id === Number(formData.course))
                                  ?.course_name ||
                                CourseList.find((c) => c.id === Number(formData.course))
                                  ?.description ||
                                "Unnamed Course",
                            }
                            : null
                        }
                        onChange={(opt) =>
                          setFormData((prev) => ({
                            ...prev,
                            course: opt?.value || "",
                            branch: "",
                          }))
                        }
                        placeholder={
                          loadingCourses
                            ? "Loading courses..."
                            : errorCourses
                              ? "Error loading courses"
                              : "Select Course"
                        }
                      />
                    </div>

                    {/* Department */}
                    <div className="col-md-3">
                      <label className="form-label">
                        Department<span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        className="detail"
                        isLoading={loadingBranches}
                        options={
                          BranchList?.map((b) => ({
                            value: b.id,
                            label:
                              b.department_description ||
                              b.department_code ||
                              b.branch_name ||
                              "Unnamed Department",
                          })) || []
                        }
                        value={
                          BranchList.find((b) => b.id === Number(formData.branch))
                            ? {
                              value: formData.branch,
                              label:
                                BranchList.find((b) => b.id === Number(formData.branch))
                                  ?.department_description ||
                                BranchList.find((b) => b.id === Number(formData.branch))
                                  ?.department_code ||
                                "Unnamed Department",
                            }
                            : null
                        }
                        onChange={(opt) =>
                          setFormData((prev) => ({ ...prev, branch: opt?.value || "" }))
                        }
                        placeholder={
                          loadingBranches
                            ? "Loading departments..."
                            : errorBranches
                              ? "Error loading departments"
                              : "Select Department"
                        }
                      />
                    </div>

                    {/* Academic Year */}
                    <div className="col-md-3">
                      <label className="form-label">
                        Academic Year<span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        className="detail"
                        isLoading={loadingAcademicYears}
                        options={
                          AcademicYearList?.map((y) => ({
                            value: y.id,
                            label:
                              y.academic_year_description ||
                              y.academic_year_name ||
                              y.year_name ||
                              "Unnamed Academic Year",
                          })) || []
                        }
                        value={
                          AcademicYearList.find((y) => y.id === Number(formData.academic_year))
                            ? {
                              value: formData.academic_year,
                              label:
                                AcademicYearList.find(
                                  (y) => y.id === Number(formData.academic_year)
                                )?.academic_year_description ||
                                "Unnamed Academic Year",
                            }
                            : null
                        }
                        onChange={(opt) =>
                          setFormData((prev) => ({
                            ...prev,
                            academic_year: opt?.value || "",
                          }))
                        }
                        placeholder={
                          loadingAcademicYears
                            ? "Loading Academic Years..."
                            : errorAcademicYears
                              ? "Error loading academic years"
                              : "Select Academic Year"
                        }
                      />
                    </div>

                    {/* Semester */}
                    <div className="col-md-3">
                      <label className="form-label">
                        Semester<span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        className="detail"
                        isLoading={loadingSemesters}
                        options={
                          SemesterList?.map((s) => ({
                            value: s.id,
                            label:
                              s.semester_description ||
                              s.semester_name ||
                              s.description ||
                              "Unnamed Semester",
                          })) || []
                        }
                        value={
                          SemesterList.find((s) => s.id === Number(formData.semester))
                            ? {
                              value: formData.semester,
                              label:
                                SemesterList.find((s) => s.id === Number(formData.semester))
                                  ?.semester_description || "Unnamed Semester",
                            }
                            : null
                        }
                        onChange={(opt) =>
                          setFormData((prev) => ({
                            ...prev,
                            semester: opt?.value || "",
                          }))
                        }
                        placeholder={
                          loadingSemesters
                            ? "Loading Semesters..."
                            : errorSemesters
                              ? "Error loading semesters"
                              : "Select Semester"
                        }
                      />
                    </div>

                    {/* Section */}
                    <div className="col-md-3">
                      <label className="form-label">
                        Section<span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        className="detail"
                        isLoading={loadingSections}
                        options={
                          SectionList?.map((s) => ({
                            value: s.id,
                            label: s.section_name || s.section_description || "Unnamed Section",
                          })) || []
                        }
                        value={
                          SectionList.find((s) => s.id === Number(formData.addmitted_section))
                            ? {
                              value: formData.addmitted_section,
                              label:
                                SectionList.find(
                                  (s) => s.id === Number(formData.addmitted_section)
                                )?.section_name || "Unnamed Section",
                            }
                            : null
                        }
                        onChange={(opt) =>
                          setFormData((prev) => ({
                            ...prev,
                            addmitted_section: opt?.value || "",
                          }))
                        }
                        placeholder={
                          loadingSections
                            ? "Loading Sections..."
                            : errorSections
                              ? "Error loading sections"
                              : "Select Section"
                        }
                      />
                    </div>

                    {/* Period (formerly Lecture) */}
                    <div className="col-md-3 mb-3">
                      <label className="form-label">
                        Period<span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        className="detail"
                        isLoading={loadingLectures}
                        options={
                          LectureList?.map((l) => ({
                            value: l.id,
                            label: `${l.lecture_period_name} (${l.time_from} - ${l.time_to})`,
                          })) || []
                        }
                        value={
                          LectureList.find(
                            (l) => l.id === Number(formData.feeappfrom)
                          )
                            ? {
                              value: formData.feeappfrom,
                              label: `${LectureList.find(
                                (l) => l.id === Number(formData.feeappfrom)
                              )?.lecture_period_name
                                } (${LectureList.find(
                                  (l) => l.id === Number(formData.feeappfrom)
                                )?.time_from
                                } - ${LectureList.find(
                                  (l) => l.id === Number(formData.feeappfrom)
                                )?.time_to
                                })`,
                            }
                            : null
                        }
                        onChange={(opt) =>
                          setFormData((prev) => ({
                            ...prev,
                            feeappfrom: opt?.value || "",
                            subject: "",
                            teacher: "",
                          }))
                        }
                        placeholder={
                          loadingLectures
                            ? "Loading Periods..."
                            : errorLectures
                              ? "Error loading Periods"
                              : "Select Period"
                        }
                      />
                    </div>

                    {/* Subject */}
                    <div className="col-md-3 mb-3">
                      <label className="form-label">
                        Subject<span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        className="detail"
                        isLoading={loadingSubjects}
                        options={
                          SubjectList?.map((s) => ({
                            value: s.id,
                            label: `${s.subjectcode} - ${s.subjectdescription}`,
                          })) || []
                        }
                        value={
                          SubjectList.find((s) => s.id === Number(formData.subject))
                            ? {
                              value: formData.subject,
                              label: `${SubjectList.find(
                                (s) => s.id === Number(formData.subject)
                              )?.subjectcode} - ${SubjectList.find((s) => s.id === Number(formData.subject))
                                ?.subjectdescription
                                }`,
                            }
                            : null
                        }
                        onChange={(opt) =>
                          setFormData((prev) => ({
                            ...prev,
                            subject: opt?.value || "",
                            teacher: "",
                          }))
                        }
                        placeholder={
                          loadingSubjects
                            ? "Loading subjects..."
                            : errorSubjects
                              ? "Error loading subjects"
                              : "Select Subject"
                        }
                      />
                    </div>

                    {/* Lecture (formerly Professor) - Auto-selected and Disabled */}
                    <div className="col-md-3 mb-3">
                      <label className="form-label">
                        Lecture<span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        className="detail"
                        isLoading={loadingProfessors}
                        options={
                          ProfessorList?.map((p) => ({
                            value: p.professor_id,
                            label: p.professor_name,
                          })) || []
                        }
                        value={
                          ProfessorList.find((p) => p.professor_id === Number(formData.teacher))
                            ? {
                              value: formData.teacher,
                              label: ProfessorList.find(
                                (p) => p.professor_id === Number(formData.teacher)
                              )?.professor_name,
                            }
                            : null
                        }
                        onChange={(opt) =>
                          setFormData((prev) => ({ ...prev, teacher: opt?.value || "" }))
                        }
                        placeholder={
                          loadingProfessors
                            ? "Loading lectures..."
                            : errorProfessors
                              ? "Error loading lectures"
                              : "Select Lecture"
                        }
                        isDisabled={true}
                      />
                    </div>

                    {/* SMS + Attendance Row */}
                    <div className="row mb-3">
                      {/* Send SMS To Section */}
                      <div className="col-12 col-md-6 mb-3 mb-md-0">
                        <div className="border p-3 rounded h-100">
                          <div className="fw-bold mb-2">Send SMS to:</div>
                          <div className="d-flex flex-wrap gap-3">
                            <div className="d-flex align-items-center">
                              <input
                                className="form-check-input me-2"
                                type="radio"
                                name="smsTo"
                                id="smsToFather"
                                checked={smsTo === "F"}
                                onChange={() => setSmsTo("F")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="smsToFather"
                              >
                                Father
                              </label>
                            </div>
                            <div className="d-flex align-items-center">
                              <input
                                className="form-check-input me-2"
                                type="radio"
                                name="smsTo"
                                id="smsToMother"
                                checked={smsTo === "M"}
                                onChange={() => setSmsTo("M")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="smsToMother"
                              >
                                Mother
                              </label>
                            </div>
                            <div className="d-flex align-items-center">
                              <input
                                className="form-check-input me-2"
                                type="radio"
                                name="smsTo"
                                id="smsToBoth"
                                checked={smsTo === "B"}
                                onChange={() => setSmsTo("B")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="smsToBoth"
                              >
                                Both
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Attendance Status Section */}
                      <div className="col-12 col-md-6">
                        <div className="border p-3 rounded h-100">
                          <div className="fw-bold mb-2">Attendance Status:</div>
                          <div className="d-flex flex-wrap">
                            <div className="form-check me-4 mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="attendanceStatus"
                                id="markAllPresent"
                                checked={attendanceStatus === "present"}
                                onChange={() => {
                                  setAttendanceStatus("present");
                                  if (isEditing) {
                                    setAttendanceData((prevData) =>
                                      prevData.map((student) => ({
                                        ...student,
                                        present: "P",
                                      }))
                                    );
                                  }
                                }}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="markAllPresent"
                              >
                                Mark All Present
                              </label>
                            </div>
                            <div className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="attendanceStatus"
                                id="markAllAbsent"
                                checked={attendanceStatus === "absent"}
                                onChange={() => {
                                  setAttendanceStatus("absent");
                                  if (isEditing) {
                                    setAttendanceData((prevData) =>
                                      prevData.map((student) => ({
                                        ...student,
                                        present: "A",
                                      }))
                                    );
                                  }
                                }}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="markAllAbsent"
                              >
                                Mark All Absent
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <p
                    className="mb-0"
                    style={{
                      fontWeight: "bold",
                      textDecoration: "underline",
                      fontSize: "14px",
                    }}
                  >
                    Please Note:
                  </p>
                  <p className="mb-0" style={{ fontSize: "14px" }}>
                    1. Only current date Attendance can be edited.
                  </p>
                  <p style={{ fontSize: "14px" }}>
                    2. Past date and Current date Attendance can be viewed.
                  </p>
                </div>
              </div>

              {/* Table */}
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered ">
                    <thead>
                      <tr>
                        <th>Sl.No</th>
                        <th>Session</th>
                        <th>Course</th>
                        <th>Department</th>
                        <th>Academic Year</th>
                        <th>Semester</th>
                        <th>Section</th>
                        <th>Roll No</th>
                        <th>College Admission No</th>
                        <th>Student Name</th>
                        <th>Mark Attendance</th>
                        <th>BarCode</th>
                        <th>Primary Guardian</th>
                        <th>Father Mobile No</th>
                        <th>Mother Mobile No</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.length === 0 ? (
                        <tr>
                          <td colSpan="16" className="text-center">
                            No records found
                          </td>
                        </tr>
                      ) : (
                        currentRows.map((student, index) => (
                          <tr key={student.student_id}>
                            <td>{currentPage * rowsPerPage + index + 1}</td>
                            <td>{student.batch || "N/A"}</td>
                            <td>{student.course_name}</td>
                            <td>{student.department || "N/A"}</td>
                            <td>{student.academic_year}</td>
                            <td>{student.semester || "N/A"}</td>
                            <td>{student.section_name}</td>
                            <td>{student.enrollment_no || "N/A"}</td>
                            <td>{student.college_admission_no}</td>
                            <td>{student.student_name}</td>
                            <td>
                              <select
                                className="form-select"
                                value={student.present ?? ""}
                                onChange={(e) =>
                                  handleContactNumberChange(student.student_id, "present", e.target.value)
                                }
                                disabled={!isEditing}
                              >
                                <option value="">Select</option>
                                <option value="P">Present</option>
                                <option value="A">Absent</option>
                              </select>
                            </td>
                            <td>{student.barcode}</td>
                            <td>{student.primary_guardian}</td>
                            <td>
                              <input
                                type="text"
                                className="form-control detail"
                                value={student.father_contact_number}
                                onChange={(e) =>
                                  handleContactNumberChange(
                                    student.student_id,
                                    "father_contact_number",
                                    e.target.value
                                  )
                                }
                                disabled={!isEditing}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control detail"
                                value={student.mother_contact_number}
                                onChange={(e) =>
                                  handleContactNumberChange(
                                    student.student_id,
                                    "mother_contact_number",
                                    e.target.value
                                  )
                                }
                                disabled={!isEditing}
                              />
                            </td>
                            <td>
                              <textarea
                                className="form-control detail"
                                value={student.remarks}
                                onChange={(e) =>
                                  handleContactNumberChange(
                                    student.student_id,
                                    "remarks",
                                    e.target.value
                                  )
                                }
                                disabled={!isEditing}
                                style={{
                                  resize: isEditing ? "both" : "none",
                                }}
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {attendanceData.length > rowsPerPage && (
                    <ReactPaginate
                      previousLabel={"Previous"}
                      nextLabel={"Next"}
                      breakLabel={"..."}
                      pageCount={pageCount}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageClick}
                      containerClassName={"pagination justify-content-center mt-3"}
                      pageClassName={"page-item"}
                      pageLinkClassName={"page-link"}
                      previousClassName={"page-item"}
                      previousLinkClassName={"page-link"}
                      nextClassName={"page-item"}
                      nextLinkClassName={"page-link"}
                      activeClassName={"active"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StfAttendance;
