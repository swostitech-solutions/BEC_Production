///Staff Assignment Entry - Based on Admin Assignment Entry///
import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";
import "./AdmAttendanceEntry.css";
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

const StaffAssignmentEntry = () => {
  const dateRef = useRef();
  const uploadRef = useRef(null);
  const assignmentDetailsRef = useRef(null);
  const fatherSmsRef = useRef(null);
  const motherSmsRef = useRef(null);
  const navigate = useNavigate();

  const [remainingChars, setRemainingChars] = useState(5000);
  const [formData, setFormData] = useState({
    batch: "",
    course: "",
    branch: "",
    academic_year: "",
    semester: "",
    addmitted_section: "",
    lectureId: "",
    subjectId: "",
    professorId: "",
    assignmentDate: "",
    assignmentDetails: "",
  });
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  const organizationId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");
  const userId = sessionStorage.getItem("userId"); // Get logged-in staff user ID

  const {
    BatchList,
    loading: loadingBatch,
    error: errorBatch,
  } = useFetchSessionList(organizationId, branchId);

  const [selectedSession, setSelectedSession] = useState(null);
  const batchId = formData.batch;
  const {
    CourseList,
    loading: loadingCourses,
    error: errorCourses,
  } = useFetchCourseByFilter(organizationId, batchId);

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

  // ---- Lecture, Subject, and Professor dependent dropdowns ----
  const lectureParams = {
    organizationId,
    branchId,
    batchId: formData.batch,
    courseId: formData.course,
    departmentId: formData.branch,
    academicYearId: formData.academic_year,
    semesterId: formData.semester,
    sectionId: formData.addmitted_section,
  };

  const {
    LectureList,
    loading: loadingLectures,
    error: errorLectures,
  } = useFetchLectureList(
    lectureParams.organizationId,
    lectureParams.branchId,
    lectureParams.batchId,
    lectureParams.courseId,
    lectureParams.departmentId,
    lectureParams.academicYearId,
    lectureParams.semesterId,
    lectureParams.sectionId
  );

  const {
    SubjectList,
    loading: loadingSubjects,
    error: errorSubjects,
  } = useFetchSubjectListBasedOnLecture(
    lectureParams.organizationId,
    lectureParams.branchId,
    lectureParams.batchId,
    lectureParams.courseId,
    lectureParams.departmentId,
    lectureParams.academicYearId,
    lectureParams.semesterId,
    lectureParams.sectionId,
    formData.lectureId || "",
    formData.assignmentDate || ""
  );

  const {
    ProfessorList,
    loading: loadingProfessors,
    error: errorProfessors,
  } = useFetchProfessorListBasedOnSubject(
    lectureParams.organizationId,
    lectureParams.branchId,
    lectureParams.batchId,
    lectureParams.courseId,
    lectureParams.departmentId,
    lectureParams.academicYearId,
    lectureParams.semesterId,
    lectureParams.sectionId,
    formData.subjectId || "",
    formData.lectureId || "",
    formData.assignmentDate || ""
  );

  const [smsRecipient, setSmsRecipient] = useState("B");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssignments = assignments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(assignments.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const todayDate = new Date().toISOString().split("T")[0];

  // Auto-select professor when ProfessorList changes
  useEffect(() => {
    if (ProfessorList && ProfessorList.length > 0 && userId) {
      // Find the professor that matches the logged-in staff user ID
      const loggedInProfessor = ProfessorList.find(
        (prof) => String(prof.professor_id) === String(userId)
      );

      if (loggedInProfessor) {
        // Auto-select the logged-in professor
        setFormData((prev) => ({
          ...prev,
          professorId: loggedInProfessor.professor_id,
        }));
      }
    }
  }, [ProfessorList, userId]);

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setFormData((prevData) => ({ ...prevData, assignmentDate: currentDate }));
  }, []);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    setFormData((prevData) => ({
      ...prevData,
      assignmentDate: selectedDate,
    }));

    localStorage.setItem("assignmentDate", selectedDate);
  };

  const resetAssignmentFields = () => {
    setFormData({
      batch: "",
      course: "",
      branch: "",
      academic_year: "",
      semester: "",
      addmitted_section: "",
      lectureId: "",
      subjectId: "",
      professorId: "",
      assignmentDate: todayDate,
      assignmentDetails: "",
    });

    if (uploadRef.current) uploadRef.current.value = null;
    if (assignmentDetailsRef.current) assignmentDetailsRef.current.value = "";
    if (fatherSmsRef.current) fatherSmsRef.current.checked = false;
    if (motherSmsRef.current) motherSmsRef.current.checked = false;

    setIsSmsChecked(false);
    setSmsRecipient("B");
    setMessage("");
    setRemainingChars(5000);
  };

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const organization_id = sessionStorage.getItem("organization_id");
      const branch_id = sessionStorage.getItem("branch_id");

      const academic_year_id = formData.academic_year || "";
      const course_id = formData.course || "";
      const department_id = formData.branch || "";
      const semester_id = formData.semester || "";
      const section_id = formData.addmitted_section || "";
      const subject_id = formData.subjectId || "";
      const lecture_id = formData.lectureId || "";
      const professor_id = formData.professorId || "";
      const assignment_date = formData.assignmentDate || "";

      let apiUrl = `${ApiUrl.apiurl}Assignment/GetAllAssignmentList/?organization_id=${organization_id}&branch_id=${branch_id}`;

      if (academic_year_id) apiUrl += `&academic_year_id=${academic_year_id}`;
      if (course_id) apiUrl += `&course_id=${course_id}`;
      if (department_id) apiUrl += `&department_id=${department_id}`;
      if (semester_id) apiUrl += `&semester_id=${semester_id}`;
      if (section_id) apiUrl += `&section_id=${section_id}`;
      if (subject_id) apiUrl += `&subject_id=${subject_id}`;
      if (lecture_id) apiUrl += `&lecture_id=${lecture_id}`;
      if (professor_id) apiUrl += `&professor_id=${professor_id}`;
      if (assignment_date) apiUrl += `&assignment_date=${assignment_date}`;

      console.log("FINAL API:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.message === "Success" && Array.isArray(result.data)) {
        setAssignments(result.data);
      } else {
        setAssignments([]);
        alert("No assignments found.");
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDownload = (fileUrl) => {
    if (!fileUrl) {
      console.error("No file URL provided");
      return;
    }

    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileUrl.split("/").pop());
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => console.error("Download error:", err));
  };

  const handleClear = () => {
    setFormData({
      batch: "",
      course: "",
      branch: "",
      academic_year: "",
      semester: "",
      addmitted_section: "",
      lectureId: "",
      subjectId: "",
      professorId: "",
      assignmentDate: todayDate,
      assignmentDetails: "",
    });

    if (uploadRef.current) uploadRef.current.value = null;
    if (assignmentDetailsRef.current) assignmentDetailsRef.current.value = "";
    if (fatherSmsRef.current) fatherSmsRef.current.checked = false;
    if (motherSmsRef.current) motherSmsRef.current.checked = false;

    setIsSmsChecked(false);
    setSmsRecipient("B");
    setMessage("");
    setRemainingChars(5000);

    const keysToRetain = [
      "academicSessionId",
      "orgId",
      "branchId",
      "nextAcademicSessionId",
      "assignmentDate",
      "accessToken",
      "userId",
      "organization_id",
      "branch_id",
    ];

    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (!keysToRetain.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    setIsEditMode(false);
  };

  const [message, setMessage] = useState("");
  const [isSmsChecked, setIsSmsChecked] = useState(false);

  const handleTextareaChange = (event) => {
    let inputMessage = event.target.value;

    if (isSmsChecked && inputMessage.length > 159) {
      inputMessage = inputMessage.slice(0, 159);
    }

    setFormData((prevState) => ({
      ...prevState,
      assignmentDetails: inputMessage,
    }));

    setMessage(inputMessage);
    setRemainingChars(
      isSmsChecked ? 159 - inputMessage.length : 5000 - inputMessage.length
    );
  };

  const handleRadioChange = () => {
    setIsSmsChecked((prevState) => {
      const newState = !prevState;
      if (newState) {
        setRemainingChars(159 - message.length);
      } else {
        setRemainingChars(5000 - message.length);
      }
      return newState;
    });
  };

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    if (dateRef.current) {
      dateRef.current.value = formattedDate;

      localStorage.setItem("assignmentDate", formattedDate);
    }
  }, []);

  const handleEditClick = async (assignmentId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = `${ApiUrl.apiurl}Assignment/GetAssignmentBasedId/?assignment_id=${assignmentId}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      console.log("Assignment Edit Response:", result);

      if (result.message === "Success" && result.data) {
        const data = result.data;

        setIsEditMode(true);

        setFormData({
          assignmentId: data.id || "",
          organization_id: data.organization_id || "",
          branch_id: data.branch_id || "",
          batch: data.batch_id || "",
          course: data.course_id || "",
          branch: data.department_id || "",
          academic_year: data.academic_year_id || "",
          semester: data.semester_id || "",
          addmitted_section: data.section_id || "",
          lectureId: data.lecture_id || "",
          subjectId: data.subject_id || "",
          professorId: data.professor_id || "",
          assignmentDate: data.assignment_date || "",
          assignmentDetails: data.assignment_details || "",
        });

        setIsSmsChecked(data.send_sms === "Y");
        setSmsRecipient(data.sms_sent_to || "B");

        setTimeout(() => {
          syncDropdownSelections(data);
        }, 1000);

        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        alert("Failed to fetch assignment details.");
      }
    } catch (error) {
      console.error("Error fetching assignment details:", error);
      alert("Something went wrong while loading assignment data.");
    }
  };

  const handleSave = async () => {
    const {
      batch,
      course,
      branch,
      academic_year,
      semester,
      addmitted_section,
      lectureId,
      subjectId,
      professorId,
      assignmentDate,
      assignmentDetails,
    } = formData;

    if (
      !batch ||
      !course ||
      !branch ||
      !academic_year ||
      !semester ||
      !addmitted_section ||
      !lectureId ||
      !subjectId ||
      !professorId ||
      !assignmentDate ||
      !assignmentDetails
    ) {
      alert("⚠️ Please fill all mandatory fields before saving.");
      return;
    }

    const organizationId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");
    const createdBy = sessionStorage.getItem("userId") || 1;
    const token = localStorage.getItem("accessToken");

    const file = uploadRef.current?.files[0];

    const formDataToSend = new FormData();
    formDataToSend.append("organization_id", organizationId);
    formDataToSend.append("branch_id", branchId);
    formDataToSend.append("batch_id", batch);
    formDataToSend.append("course_id", course);
    formDataToSend.append("department_id", branch);
    formDataToSend.append("academic_year_id", academic_year);
    formDataToSend.append("semester_id", semester);
    formDataToSend.append("section_id", addmitted_section);
    formDataToSend.append("subject_id", subjectId);
    formDataToSend.append("assignment_date", assignmentDate);
    formDataToSend.append("assignment_details", assignmentDetails);
    formDataToSend.append("lecture_id", lectureId);
    formDataToSend.append("professor_id", professorId);
    formDataToSend.append("send_sms", isSmsChecked ? "Y" : "N");
    formDataToSend.append("sms_sent_to", smsRecipient);
    formDataToSend.append("created_by", createdBy);

    if (file) {
      formDataToSend.append("assignment_file", file);
    }

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}Assignment/CreateAllAssignment/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const result = await response.json();
      console.log("Assignment Create Response:", result);

      if (response.ok && result.message === "Assignment Added sucessfully!!") {
        alert("✅ Assignment Created Successfully!");
        fetchAssignments();
        handleClear();
      } else {
        alert(
          `❌ Failed to create assignment: ${result.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error while creating assignment:", error);
      alert("❌ Something went wrong while creating assignment.");
    }
  };

  const handleUpdateClick = async () => {
    const assignmentId = formData.assignmentId;

    if (!assignmentId) {
      alert("Assignment ID missing!");
      return;
    }

    const organizationId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");
    const updatedBy = sessionStorage.getItem("userId") || 1;
    const token = localStorage.getItem("accessToken");

    const {
      batch,
      course,
      branch,
      academic_year,
      semester,
      addmitted_section,
      lectureId,
      subjectId,
      professorId,
      assignmentDate,
      assignmentDetails,
    } = formData;

    if (
      !batch ||
      !course ||
      !branch ||
      !academic_year ||
      !semester ||
      !addmitted_section ||
      !lectureId ||
      !subjectId ||
      !professorId ||
      !assignmentDate ||
      !assignmentDetails
    ) {
      alert("⚠️ Please fill all required fields before updating.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("organization", organizationId);
    formDataToSend.append("branch", branchId);
    formDataToSend.append("batch", batch);
    formDataToSend.append("course", course);
    formDataToSend.append("department", branch);
    formDataToSend.append("academic_year", academic_year);
    formDataToSend.append("semester", semester);
    formDataToSend.append("section", addmitted_section);
    formDataToSend.append("subject", subjectId);
    formDataToSend.append("assignment_date", assignmentDate);
    formDataToSend.append("assignment_details", assignmentDetails);
    formDataToSend.append("lecture_period", lectureId);
    formDataToSend.append("professor", professorId);
    formDataToSend.append("send_sms", isSmsChecked ? "Y" : "N");
    formDataToSend.append("sms_sent_to", smsRecipient);
    formDataToSend.append("updated_by", updatedBy);

    if (uploadRef.current && uploadRef.current.files[0]) {
      formDataToSend.append("assignment_file", uploadRef.current.files[0]);
    }

    try {
      const updateUrl = `${ApiUrl.apiurl}Assignment/UpdateAssignment/?assignment_id=${assignmentId}`;
      console.log("Updating Assignment API URL:", updateUrl);

      const response = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();
      console.log("Assignment Update Response:", result);

      if (response.ok && result.message?.toLowerCase().includes("success")) {
        alert("✅ Assignment Updated Successfully!");
        await fetchAssignments();
        handleClear();
        setIsEditMode(false);
      } else {
        alert(`❌ Update failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      alert("❌ Failed to update assignment. Please try again.");
    }
  };

  const [data, setData] = useState(assignments);

  const handleDelete = async (assignmentId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this assignment?"
    );
    if (!confirmation) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Unauthorized: Missing access token.");
        return;
      }

      const apiUrl = `${ApiUrl.apiurl}Assignment/DeleteAssignment/?assignment_id=${assignmentId}`;
      console.log("🗑️ Deleting assignment:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log("Delete Response:", result);

      if (result.message?.toLowerCase().includes("success")) {
        alert("✅ Assignment deleted successfully.");

        setData((prevData) => {
          const updatedList = prevData.filter(
            (item) => item.id !== assignmentId
          );
          console.log("Updated List After Delete:", updatedList);
          return updatedList;
        });
      } else {
        alert(
          `❌ Failed to delete assignment: ${result.message || "Unknown error."
          }`
        );
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert(
        "An error occurred while deleting the assignment: " + error.message
      );
    }
  };

  const syncDropdownSelections = (data) => {
    if (
      !BatchList?.length ||
      !CourseList?.length ||
      !BranchList?.length ||
      !AcademicYearList?.length ||
      !SemesterList?.length ||
      !SectionList?.length ||
      !LectureList?.length ||
      !SubjectList?.length ||
      !ProfessorList?.length
    ) {
      console.log("⏳ Dropdown data not ready, retrying...");
      setTimeout(() => syncDropdownSelections(data), 500);
      return;
    }

    console.log("✅ Syncing dropdowns with API data");

    setFormData((prev) => ({
      ...prev,
      batch: BatchList.find((b) => b.id === data.batch_id)?.id || prev.batch,
      course:
        CourseList.find((c) => c.id === data.course_id)?.id || prev.course,
      branch:
        BranchList.find((d) => d.id === data.department_id)?.id || prev.branch,
      academic_year:
        AcademicYearList.find((a) => a.id === data.academic_year_id)?.id ||
        prev.academic_year,
      semester:
        SemesterList.find((s) => s.id === data.semester_id)?.id ||
        prev.semester,
      addmitted_section:
        SectionList.find((sec) => sec.id === data.section_id)?.id ||
        prev.addmitted_section,
      lectureId:
        LectureList.find((l) => l.id === data.lecture_id)?.id || prev.lectureId,
      subjectId:
        SubjectList.find((sub) => sub.id === data.subject_id)?.id ||
        prev.subjectId,
      professorId:
        ProfessorList.find((p) => p.professor_id === data.professor_id)
          ?.professor_id || prev.professorId,
    }));
  };

  return (
    <div className="container-fluid ">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                ASSIGNMENT
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={fetchAssignments}
                  >
                    Display
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleSave}
                    disabled={isEditMode}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleUpdateClick}
                    disabled={!isEditMode}
                  >
                    Update
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    style={{ width: "150px" }}
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{ width: "150px" }}
                    onClick={() => navigate("/staff/dashboard")}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mt-3">
                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="assignment-date" className="form-label">
                          Assignment Date{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="date"
                          id="assignment-date"
                          className="form-control detail"
                          ref={dateRef}
                          value={formData.assignmentDate}
                          onChange={handleDateChange}
                        />
                      </div>

                      {/* Batch / Session */}
                      <div className="col-12 col-md-3 mb-1">
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
                            BatchList?.find(
                              (b) => b.id === Number(formData.batch)
                            )
                              ? {
                                value: formData.batch,
                                label: BatchList.find(
                                  (b) => b.id === Number(formData.batch)
                                )?.batch_description,
                              }
                              : null
                          }
                          onChange={(opt) => {
                            setFormData((prev) => ({
                              ...prev,
                              batch: opt?.value || "",
                            }));
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
                      <div className="col-12 col-md-3 mb-1">
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
                            CourseList.find(
                              (c) => c.id === Number(formData.course)
                            )
                              ? {
                                value: formData.course,
                                label:
                                  CourseList.find(
                                    (c) => c.id === Number(formData.course)
                                  )?.course_name ||
                                  CourseList.find(
                                    (c) => c.id === Number(formData.course)
                                  )?.description ||
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
                      <div className="col-12 col-md-3 mb-1">
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
                            BranchList.find(
                              (b) => b.id === Number(formData.branch)
                            )
                              ? {
                                value: formData.branch,
                                label:
                                  BranchList.find(
                                    (b) => b.id === Number(formData.branch)
                                  )?.department_description ||
                                  BranchList.find(
                                    (b) => b.id === Number(formData.branch)
                                  )?.department_code ||
                                  "Unnamed Department",
                              }
                              : null
                          }
                          onChange={(opt) =>
                            setFormData((prev) => ({
                              ...prev,
                              branch: opt?.value || "",
                            }))
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
                      <div className="col-12 col-md-3 mb-1">
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
                            AcademicYearList.find(
                              (y) => y.id === Number(formData.academic_year)
                            )
                              ? {
                                value: formData.academic_year,
                                label:
                                  AcademicYearList.find(
                                    (y) =>
                                      y.id === Number(formData.academic_year)
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
                      <div className="col-12 col-md-3 mb-1">
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
                            SemesterList.find(
                              (s) => s.id === Number(formData.semester)
                            )
                              ? {
                                value: formData.semester,
                                label:
                                  SemesterList.find(
                                    (s) => s.id === Number(formData.semester)
                                  )?.semester_description ||
                                  "Unnamed Semester",
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
                      <div className="col-12 col-md-3 mb-1">
                        <label className="form-label">
                          Section<span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                          className="detail"
                          isLoading={loadingSections}
                          options={
                            SectionList?.map((s) => ({
                              value: s.id,
                              label:
                                s.section_name ||
                                s.section_description ||
                                "Unnamed Section",
                            })) || []
                          }
                          value={
                            SectionList.find(
                              (s) => s.id === Number(formData.addmitted_section)
                            )
                              ? {
                                value: formData.addmitted_section,
                                label:
                                  SectionList.find(
                                    (s) =>
                                      s.id ===
                                      Number(formData.addmitted_section)
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
                      {/* Period Dropdown */}
                      <div className="col-12 col-md-3 mb-1">
                        <label className="form-label">
                          Period <span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                          className="detail"
                          isLoading={loadingLectures}
                          options={
                            LectureList?.map((lec) => ({
                              value: lec.id,
                              label: lec.lecture_period_name,
                            })) || []
                          }
                          value={
                            LectureList.find(
                              (lec) => lec.id === Number(formData.lectureId)
                            )
                              ? {
                                value: formData.lectureId,
                                label: LectureList.find(
                                  (lec) =>
                                    lec.id === Number(formData.lectureId)
                                )?.lecture_period_name,
                              }
                              : null
                          }
                          onChange={(opt) => {
                            setFormData((prev) => ({
                              ...prev,
                              lectureId: opt?.value || "",
                              subjectId: "",
                              professorId: "",
                            }));
                          }}
                          placeholder={
                            loadingLectures
                              ? "Loading Periods..."
                              : errorLectures
                                ? "Error loading Periods"
                                : "Select Period"
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row flex-grow-1">
                    {/* Subject Dropdown */}
                    <div className="col-12 col-md-3 mb-1">
                      <label className="form-label">
                        Subject <span style={{ color: "red" }}>*</span>
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
                          SubjectList.find(
                            (s) => s.id === Number(formData.subjectId)
                          )
                            ? {
                              value: formData.subjectId,
                              label: SubjectList.find(
                                (s) => s.id === Number(formData.subjectId)
                              )?.subjectdescription,
                            }
                            : null
                        }
                        onChange={(opt) =>
                          setFormData((prev) => ({
                            ...prev,
                            subjectId: opt?.value || "",
                            professorId: "",
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
                    {/* Lecture (Professor) Dropdown - Auto-selected for staff */}
                    <div className="col-12 col-md-3 mb-1">
                      <label className="form-label">
                        Lecture <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        className="detail"
                        isLoading={loadingProfessors}
                        isDisabled={true} // Disabled for staff as it's auto-selected
                        options={
                          ProfessorList?.map((p) => ({
                            value: p.professor_id,
                            label: p.professor_name,
                          })) || []
                        }
                        value={
                          ProfessorList.find(
                            (p) =>
                              p.professor_id === Number(formData.professorId)
                          )
                            ? {
                              value: formData.professorId,
                              label: ProfessorList.find(
                                (p) =>
                                  p.professor_id ===
                                  Number(formData.professorId)
                              )?.professor_name,
                            }
                            : null
                        }
                        onChange={(opt) =>
                          setFormData((prev) => ({
                            ...prev,
                            professorId: opt?.value || "",
                          }))
                        }
                        placeholder={
                          loadingProfessors
                            ? "Loading professors..."
                            : errorProfessors
                              ? errorProfessors
                              : "Select Professor"
                        }
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-0">
                      <label htmlFor="upload" className="form-label">
                        Upload Assignment
                      </label>
                      <input
                        type="file"
                        name="upload"
                        id="upload"
                        ref={uploadRef}
                        className="form-control detail"
                      />
                    </div>

                    <div className="row mb-3 me-2">
                      <div className="col-12">
                        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center flex-wrap">
                          <span className="fw-bold me-md-3 mb-2 mb-md-0">
                            Send SMS to:
                          </span>
                          <div className="d-flex flex-wrap gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="smsRecipient"
                                id="flexRadioDefault1"
                                value="F"
                                checked={smsRecipient === "F"}
                                onChange={(e) =>
                                  setSmsRecipient(e.target.value)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexRadioDefault1"
                              >
                                Father
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="smsRecipient"
                                id="flexRadioDefault2"
                                value="M"
                                checked={smsRecipient === "M"}
                                onChange={(e) =>
                                  setSmsRecipient(e.target.value)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexRadioDefault2"
                              >
                                Mother
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="smsRecipient"
                                id="flexRadioDefault3"
                                value="B"
                                checked={smsRecipient === "B"}
                                onChange={(e) =>
                                  setSmsRecipient(e.target.value)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexRadioDefault3"
                              >
                                Both
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
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center flex-grow-1">
                      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center flex-grow-1">
                          <div className="mb-2 me-2 d-flex align-items-center">
                            <span
                              className="me-3"
                              style={{ fontWeight: "700" }}
                            >
                              Send SMS:
                            </span>
                            <div className="d-flex flex-column me-2">
                              <div className="form-check mb-2">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="smsTo"
                                  id="smsToFather"
                                  checked={isSmsChecked}
                                  onChange={handleRadioChange}
                                  style={{ width: "18px", height: "18px" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex flex-column flex-grow-1 me-md-2">
                        <label
                          htmlFor="assignmentDetails"
                          className="form-label"
                        >
                          Assignment Details{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <textarea
                          className="form-control"
                          id="assignmentDetails"
                          rows="3"
                          name="assignmentDetails"
                          ref={assignmentDetailsRef}
                          value={formData.assignmentDetails}
                          onChange={handleTextareaChange}
                          style={{
                            resize: "vertical",
                            overflow: "auto",
                            maxHeight: "150px",
                            width: "100%",
                            boxSizing: "border-box",
                          }}
                        ></textarea>
                        <div className="d-flex justify-content-middle mt-1">
                          <small className="text-muted">
                            Remaining characters:{" "}
                            <span style={{ color: "red" }}>
                              {remainingChars}
                            </span>
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  1. Only current date Assignments can be edited.<br></br>
                  2. When Send SMS is selected, Assignments details field length
                  will be limited to 159 characters.
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Date</th>
                        <th>Batch</th>
                        <th>Course</th>
                        <th>Department</th>
                        <th>Academic Year</th>
                        <th>Semester</th>
                        <th>Section</th>
                        <th>Subject</th>
                        <th>Period</th>
                        <th>Teacher</th>
                        <th>Assignment</th>
                        <th>Attachment</th>
                        <th>Send SMS</th>
                        <th>Send SMS to</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.length > 0 ? (
                        assignments.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.assignment_date}</td>
                            <td>{item.batch_code}</td>
                            <td>{item.course_name}</td>
                            <td>{item.department_code}</td>
                            <td>{item.academic_year_}</td>
                            <td>{item.semester_code}</td>
                            <td>{item.section_name}</td>
                            <td>{item.subjectName}</td>
                            <td>{item.lecture_name}</td>
                            <td>{item.professor_name}</td>
                            <td>
                              <div className="hoverable-text">
                                {item.assignment_details.length > 50
                                  ? `${item.assignment_details.substring(
                                    0,
                                    50
                                  )}...`
                                  : item.assignment_details}
                                <div className="hover-popup">
                                  {item.assignment_details}
                                </div>
                              </div>
                            </td>
                            <td>
                              {item.assignment_file ? (
                                <button
                                  className="btn btn-link"
                                  onClick={() =>
                                    handleDownload(item.assignment_file)
                                  }
                                >
                                  Download
                                </button>
                              ) : (
                                "No file"
                              )}
                            </td>
                            <td>{item.send_sms === "Y" ? "Yes" : "No"}</td>
                            <td>{item.sms_sent_to}</td>
                            <td>
                              <button
                                disabled={item.assignment_date !== todayDate}
                                className="btn btn-primary"
                                onClick={() => handleEditClick(item.id)}
                              >
                                Edit
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(item.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="13" className="text-center">
                            No assignments found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* ✅ Pagination Below Table */}
                  <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName={
                      "pagination justify-content-center mt-3"
                    }
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    activeClassName={"active"}
                    forcePage={currentPage - 1}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAssignmentEntry;
