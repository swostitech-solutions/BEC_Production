import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "./Modal";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";

const AdmAttendanceEntry = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [clubId, setClubId] = useState(null);
  const [clubOptions, setClubOptions] = useState([]);
  const [studentClubOptions, setStudentClubOptions] = useState({});
  const [selectedClubGroups, setSelectedClubGroups] = useState({});

  const organizationId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  // Fetch dropdown data dynamically based on selections
  const { BatchList, loading: loadingBatch } = useFetchSessionList(
    organizationId,
    branchId
  );
  const { CourseList, loading: loadingCourse } = useFetchCourseByFilter(
    organizationId,
    selectedBatch
  );
  const { BranchList, loading: loadingDept } = useFetchBranch(
    organizationId,
    branchId,
    selectedBatch,
    selectedCourse
  );
  const { AcademicYearList, loading: loadingAY } = useFetchAcademicYearByFilter(
    organizationId,
    branchId,
    selectedBatch,
    selectedCourse,
    selectedDepartment
  );
  const { SemesterList, loading: loadingSem } = useFetchSemesterByFilter(
    organizationId,
    branchId,
    selectedBatch,
    selectedCourse,
    selectedDepartment,
    selectedAcademicYear
  );
  const { SectionList, loading: loadingSec } = useFetchSectionByFilter(
    organizationId,
    branchId,
    selectedBatch,
    selectedCourse,
    selectedDepartment,
    selectedAcademicYear,
    selectedSemester
  );

  const [clubGroupList, setClubGroupList] = useState([]);
  const [selectedClubGroup, setSelectedClubGroup] = useState("");

  const [selectedClub, setSelectedClub] = useState("");
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState();
  const [filteredStudentList, setFilteredStudentList] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [errorStudents, setErrorStudents] = useState(null);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [selectedClubs, setSelectedClubs] = useState({});
  const navigate = useNavigate();
  const dateFromRef = useRef(null);
  const dateToRef = useRef(null);
  const messageTypeRef = useRef(null);
  const studentNameRef = useRef(null);
  const initiatedByRef = useRef(null);
  const sectionRef = useRef(null);
  const classRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // adjust as needed
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  useEffect(() => {
    const orgId = localStorage.getItem("orgId");
    const branchId = localStorage.getItem("branchId");
    if (orgId && branchId) {
      fetchSubjectGroups(orgId, branchId);
    }
  }, []);

  const fetchSubjectGroups = async (orgId, branchId) => {
    try {
      const token = localStorage.getItem("accessToken"); // ✅ TOKEN
      // const response = await fetch(
      //   `${ApiUrl.apiurl}SubjectGroups/GetAllSubjectGroupsList/${orgId}/${branchId}`
      // );
      const response = await fetch(
        `${ApiUrl.apiurl}SubjectGroups/GetAllSubjectGroupsList/${orgId}/${branchId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ ADD TOKEN
          },
        }
      );
      const result = await response.json();
      if (
        response.ok &&
        result.message === "Success" &&
        Array.isArray(result.data) &&
        result.data.length > 0
      ) {
        const firstSubjectId = result.data[0].id;
        setClubId(firstSubjectId);
        console.log("Club ID set to:", firstSubjectId);
      } else {
        console.error("Error fetching subject groups:", result.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  // Fetch Clubs by Group ID
  const fetchClubs = async (groupId, studentId = null) => {
    try {
      const orgId = sessionStorage.getItem("organization_id") || 1;
      const branchId = sessionStorage.getItem("branch_id") || 1;
      const token = localStorage.getItem("accessToken"); // ✅ TOKEN

      // const response = await fetch(
      //   `${ApiUrl.apiurl}Club/GetClubListById/?organization_id=${orgId}&branch_id=${branchId}&club_group_id=${groupId}`
      // );
      const response = await fetch(
        `${ApiUrl.apiurl}Club/GetClubListById/?organization_id=${orgId}&branch_id=${branchId}&club_group_id=${groupId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ ADD TOKEN
          },
        }
      );

      const result = await response.json();

      if (
        response.ok &&
        result.message?.toLowerCase() === "success" &&
        Array.isArray(result.data)
      ) {
        if (studentId) {
          // ✅ Store club options for this specific student only
          setStudentClubOptions((prev) => ({
            ...prev,
            [studentId]: result.data,
          }));

          // ✅ Automatically select the student's existing club if present in result
          const existingClubId = result.data.find(
            (c) => c.club_id === selectedClubs[studentId]
          )?.club_id;

          if (existingClubId) {
            setSelectedClubs((prev) => ({
              ...prev,
              [studentId]: existingClubId,
            }));
          }
        } else {
          // ✅ Global filter club options
          setClubOptions(result.data);
        }
      } else {
        if (studentId) {
          setStudentClubOptions((prev) => ({ ...prev, [studentId]: [] }));
        } else {
          setClubOptions([]);
        }
      }
    } catch (error) {
      console.error("❌ Error fetching clubs:", error);
    }
  };

  const handleSearchClick = async () => {
    try {
      const orgId = sessionStorage.getItem("organization_id") || 1;
      const branchId = sessionStorage.getItem("branch_id") || 1;
      const token = localStorage.getItem("accessToken"); // ✅ TOKEN

      // Build query parameters dynamically from selected dropdowns
      const queryParams = new URLSearchParams({
        organization_id: orgId,
        branch_id: branchId,
      });

      if (selectedBatch) queryParams.append("batch_id", selectedBatch);
      if (selectedCourse) queryParams.append("course_id", selectedCourse);
      if (selectedDepartment)
        queryParams.append("department_id", selectedDepartment);
      if (selectedAcademicYear)
        queryParams.append("academic_year_id", selectedAcademicYear);
      if (selectedSemester) queryParams.append("semester_id", selectedSemester);
      if (selectedSection) queryParams.append("section_id", selectedSection);
      if (selectedClubGroup)
        queryParams.append("club_group_id", selectedClubGroup);
      if (selectedClub) queryParams.append("club_id", selectedClub);
      if (selectedStudent?.student_id)
        queryParams.append("student_id", selectedStudent.student_id);

      const url = `${
        ApiUrl.apiurl
      }Filter/GetStudentListBasedOnClub/?${queryParams.toString()}`;

      console.log("📤 Fetching filtered students:", url);

      setLoadingStudents(true);
      // const response = await fetch(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ ADD TOKEN
        },
      });
      const result = await response.json();
      if (
        response.ok &&
        result.message?.toLowerCase().includes("success") &&
        Array.isArray(result.data)
      ) {
        setFilteredStudentList(result.data);
        setErrorStudents(null);

        const groupMap = {};
        const clubMap = {};

        result.data.forEach((student) => {
          const sid = student.student_id || student.studentId;

          groupMap[sid] = student.club_group_id || "";
          clubMap[sid] = student.club_id || "";

          if (student.club_group_id) {
            fetchClubs(student.club_group_id, sid);
          }
        });

        setSelectedClubGroups(groupMap);
        setSelectedClubs(clubMap);
      }
    } catch (error) {
      console.error("🚨 Error fetching filtered students:", error);
      setErrorStudents("❌ Failed to fetch data. Please try again.");
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // 🔄 Reset all dropdowns and data before fetching
        setSelectedClubGroups({});
        setSelectedClubs({});
        setStudentClubOptions({});
        setFilteredStudentList([]);

        const orgId = sessionStorage.getItem("organization_id") || 1;
        const branchId = sessionStorage.getItem("branch_id") || 1;
        const token = localStorage.getItem("accessToken"); // ✅ TOKEN

        // const response = await fetch(
        //   `${ApiUrl.apiurl}Filter/GetStudentListBasedOnClub/?organization_id=${orgId}&branch_id=${branchId}`
        // );
        const response = await fetch(
          `${ApiUrl.apiurl}Filter/GetStudentListBasedOnClub/?organization_id=${orgId}&branch_id=${branchId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ ADD TOKEN
            },
          }
        );

        const result = await response.json();
        console.log("📘 Student API Response:", result);

        if (
          response.ok &&
          result.message?.toLowerCase().includes("success") &&
          Array.isArray(result.data)
        ) {
          // ✅ Load fresh table data
          setFilteredStudentList(result.data);

          // 🚫 No auto pre-selection for any row
          const groupMap = {};
          const clubMap = {};

          result.data.forEach((student) => {
            const sid = student.student_id || student.studentId;
            if (!sid) return;

            // ✅ Set existing selections (from API)
            groupMap[sid] = student.club_group_id || "";
            clubMap[sid] = student.club_id || "";

            // ✅ Only fetch clubs for this student if that group exists
            if (student.club_group_id) {
              fetchClubs(student.club_group_id, sid);
            }
          });

          // ✅ Apply state *after* mapping all
          setSelectedClubGroups(groupMap);
          setSelectedClubs(clubMap);
        } else {
          setFilteredStudentList([]);
          console.error("❌ No student data found or API error:", result);
        }
      } catch (error) {
        console.error("🚨 Error fetching student data:", error);
        setFilteredStudentList([]);
      }
    };

    fetchStudentData();
  }, []);

  //New code 08012025
  const handleClear = () => {
    if (studentNameRef.current) studentNameRef.current.value = "";
    if (dateFromRef.current) dateFromRef.current.value = "";
    if (dateToRef.current) dateToRef.current.value = "";
    if (messageTypeRef.current) messageTypeRef.current.value = "";
    if (initiatedByRef.current) initiatedByRef.current.value = "";

    // Reset dropdown states
    setSelectedBatch(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);

    setSelectedClub("");
    setSelectedClubGroup("");

    // Reset student selection
    setSelectedStudent(null);
    setSelectedStudentId(null);

    // Reset club mappings
    setSelectedClubs({});
    setSelectedClubGroups({});
    setStudentClubOptions({});
    setSelectedStudentIds([]);

    // Reset table data
    setFilteredStudentList([]);

    // Reset pagination
    setCurrentPage(0);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSelectStudent = (selected) => {
    // 1️⃣ SET NAME IN TEXTBOX
    studentNameRef.current.value =
      selected.studentBasicDetails.first_name || "";

    // 2️⃣ SET MAIN PAGE DROPDOWNS LIKE CLASS MODULE
    setSelectedBatch(selected.academicDetails.batch_id);
    setSelectedCourse(selected.academicDetails.course_id);
    setSelectedDepartment(selected.academicDetails.department_id);
    setSelectedAcademicYear(selected.academicDetails.academic_year_id);
    setSelectedSemester(selected.academicDetails.semester_id);
    setSelectedSection(selected.academicDetails.section_id);

    // 3️⃣ SAVE STUDENT FOR FILTERS
    setSelectedStudent({
      student_id: selected.studentBasicDetails.id,
      name: selected.studentBasicDetails.first_name,
    });

    handleCloseModal();
  };

  const handleGeneralClubChange = (event) => {
    const clubId = event.target.value;
    setSelectedClub(clubId);
  };

  const handleStudentClubChange = (studentId, event) => {
    const clubId = event.target.value;
    setSelectedClubs((prevSelectedClubs) => ({
      ...prevSelectedClubs,
      [studentId]: clubId,
    }));
  };

  const updateClub = async (studentId) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 0));

      const orgId = Number(sessionStorage.getItem("organization_id")) || 1;
      const branchId = Number(sessionStorage.getItem("branch_id")) || 1;
      const token = localStorage.getItem("accessToken");

      const groupId = selectedClubGroups[studentId];
      const clubId = selectedClubs[studentId];

      if (!groupId) {
        alert("⚠️ Please select a Club Group before updating.");
        return;
      }
      if (!clubId) {
        alert("⚠️ Please select a Club before updating.");
        return;
      }

      // ✅ Updated payload structure (arrays instead of single values)
      const payload = {
        organization_id: orgId,
        branch_id: branchId,
        club_group_ids: [Number(groupId)],
        club_ids: [Number(clubId)],
        student_ids: [Number(studentId)],
      };

      console.log("📤 Sending updated club payload:", payload);

      const response = await fetch(
        `${ApiUrl.apiurl}Club/UpdateOrCreateStudentClub/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("📥 Update response:", result);

      if (response.ok && result.message?.toLowerCase().includes("success")) {
        // alert(`✅ ${result.message}`);
        alert(`✅ Club record updated successfully.`);

        // ✅ Reflect updated club/group immediately
        if (result.data && result.data.length > 0) {
          const updated = result.data[0];
          const sid = updated.student_id;
          setSelectedClubGroups((prev) => ({
            ...prev,
            [sid]: updated.club_group_id,
          }));
          setSelectedClubs((prev) => ({
            ...prev,
            [sid]: updated.club_id,
          }));
        }
      } else {
        alert(
          `⚠️ Failed to update club: ${result.message || response.statusText}`
        );
      }
    } catch (error) {
      console.error("🚨 Error updating club:", error);
      alert("❌ Something went wrong while updating club.");
    }
  };

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredStudentList.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredStudentList.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  //New code
  const handleCheckboxChange = (studentId, checked) => {
    if (checked) {
      setSelectedStudentIds((prev) => [...prev, studentId]);
    } else {
      setSelectedStudentIds((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = filteredStudentList.map(
        (s) => s.student_id || s.studentId
      );
      setSelectedStudentIds(allIds);
    } else {
      setSelectedStudentIds([]);
    }
  };

  const updateSelectedClubs = async () => {
    if (selectedStudentIds.length === 0) {
      alert("⚠️ Please select at least one student.");
      return;
    }

    // Collect organization and branch IDs
    const organizationId =
      Number(sessionStorage.getItem("organization_id")) || 1;
    const branchId = Number(sessionStorage.getItem("branch_id")) || 1;
    const token = localStorage.getItem("accessToken"); // ✅ TOKEN

    // Prepare arrays for club_group_ids, club_ids, and student_ids
    const clubGroupIds = [];
    const clubIds = [];
    const studentIds = [];

    selectedStudentIds.forEach((sid) => {
      const groupId = selectedClubGroups[sid];
      const clubId = selectedClubs[sid];

      if (!groupId || !clubId) {
        console.warn(`Student ${sid} is missing a group or club.`);
        return;
      }

      clubGroupIds.push(Number(groupId));
      clubIds.push(Number(clubId));
      studentIds.push(Number(sid));
    });

    if (studentIds.length === 0) {
      alert(
        "⚠️ Please make sure selected students have both club group and club selected."
      );
      return;
    }

    const payload = {
      organization_id: organizationId,
      branch_id: branchId,
      club_group_ids: clubGroupIds,
      club_ids: clubIds,
      student_ids: studentIds,
    };

    console.log("📤 Sending bulk update payload:", payload);

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}Club/UpdateOrCreateStudentClub/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ ADD TOKEN
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("📥 API Response:", result);

      if (response.ok && result.message?.toLowerCase().includes("success")) {
        alert("✅ Clubs updated successfully for selected students!");
      } else {
        alert(`⚠️ Update failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("🚨 Network error:", error);
      alert("❌ Something went wrong while updating clubs.");
    }
  };

  // Fetch Club Groups
  useEffect(() => {
    const fetchClubGroups = async () => {
      try {
        const orgId = sessionStorage.getItem("organization_id") || 1;
        const brId = sessionStorage.getItem("branch_id") || 1;
        const token = localStorage.getItem("accessToken"); // ✅ TOKEN

        // const response = await fetch(
        //   `${ApiUrl.apiurl}Club/GetClubGroupList/?organization_id=${orgId}&branch_id=${brId}`
        // );

        const response = await fetch(
          `${ApiUrl.apiurl}Club/GetClubGroupList/?organization_id=${orgId}&branch_id=${brId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ ADD TOKEN
            },
          }
        );

        const result = await response.json();

        if (
          response.ok &&
          result.message?.toLowerCase() === "success" &&
          Array.isArray(result.data)
        ) {
          setClubGroupList(result.data);
        } else {
          console.error("No club group data found:", result);
          setClubGroupList([]);
        }
      } catch (error) {
        console.error("Network error fetching club groups:", error);
        setClubGroupList([]);
      }
    };
    fetchClubGroups();
  }, []);

  return (
    <div className="container-fluid">
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
                STUDENT CLUB
              </p>
              <div className="row mb-3 mt-3  ">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleSearchClick}
                  >
                    Search
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
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-primary mb-2"
                    style={{ width: "150px" }}
                    onClick={updateSelectedClubs}
                  >
                    Bulk Update
                  </button>
                </div>
              </div>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mt-2">
                      <div className="col-12 col-md-3  mb-4">
                        <label htmlFor="student-name" className="form-label">
                          {" "}
                          Student Name{" "}
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="student-name"
                            className="form-control"
                            placeholder="Enter student name"
                            ref={studentNameRef}
                            disabled={isInputDisabled}
                          />
                          <button
                            type="button"
                            className="btn btn-primary ms-2 mb-0 mt-0"
                            onClick={handleOpenModal}
                            style={{ width: "50px", padding: "3px" }}
                          >
                            ...
                          </button>
                        </div>
                      </div>

                      {/* Batch */}
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="batch" className="form-label">
                          Session
                        </label>
                        <Select
                          className=" detail"
                          isLoading={loadingBatch}
                          options={
                            BatchList?.map((b) => ({
                              value: b.id,
                              label: b.batch_description,
                            })) || []
                          }
                          value={
                            BatchList?.find((b) => b.id === selectedBatch)
                              ? {
                                  value: selectedBatch,
                                  label: BatchList.find(
                                    (b) => b.id === selectedBatch
                                  )?.batch_description,
                                }
                              : null
                          }
                          onChange={(opt) => {
                            setSelectedBatch(opt?.value || "");
                            setSelectedCourse("");
                            setSelectedDepartment("");
                            setSelectedAcademicYear("");
                            setSelectedSemester("");
                            setSelectedSection("");
                          }}
                          placeholder="Select Session"
                        />
                      </div>

                      {/* Course */}
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="course" className="form-label">
                          Course
                        </label>
                        <Select
                          className=" detail"
                          isLoading={loadingCourse}
                          options={
                            CourseList?.map((c) => ({
                              value: c.id,
                              label: c.course_name,
                            })) || []
                          }
                          value={
                            CourseList?.find((c) => c.id === selectedCourse)
                              ? {
                                  value: selectedCourse,
                                  label: CourseList.find(
                                    (c) => c.id === selectedCourse
                                  )?.course_name,
                                }
                              : null
                          }
                          onChange={(opt) => {
                            setSelectedCourse(opt?.value || "");
                            setSelectedDepartment("");
                            setSelectedAcademicYear("");
                            setSelectedSemester("");
                            setSelectedSection("");
                          }}
                          placeholder="Select Course"
                        />
                      </div>

                      {/* Department */}
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="department" className="form-label">
                          Department
                        </label>
                        <Select
                          className=" detail"
                          isLoading={loadingDept}
                          options={
                            BranchList?.map((d) => ({
                              value: d.id,
                              label: d.department_description,
                            })) || []
                          }
                          value={
                            BranchList?.find((d) => d.id === selectedDepartment)
                              ? {
                                  value: selectedDepartment,
                                  label: BranchList.find(
                                    (d) => d.id === selectedDepartment
                                  )?.department_description,
                                }
                              : null
                          }
                          onChange={(opt) => {
                            setSelectedDepartment(opt?.value || "");
                            setSelectedAcademicYear("");
                            setSelectedSemester("");
                            setSelectedSection("");
                          }}
                          placeholder="Select Department"
                        />
                      </div>

                      {/* Academic Year */}
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="academic-year" className="form-label">
                          Academic Year
                        </label>
                        <Select
                          className=" detail"
                          isLoading={loadingAY}
                          options={
                            AcademicYearList?.map((a) => ({
                              value: a.id,
                              label: a.academic_year_description,
                            })) || []
                          }
                          value={
                            AcademicYearList?.find(
                              (a) => a.id === selectedAcademicYear
                            )
                              ? {
                                  value: selectedAcademicYear,
                                  label: AcademicYearList.find(
                                    (a) => a.id === selectedAcademicYear
                                  )?.academic_year_description,
                                }
                              : null
                          }
                          onChange={(opt) => {
                            setSelectedAcademicYear(opt?.value || "");
                            setSelectedSemester("");
                            setSelectedSection("");
                          }}
                          placeholder="Select Academic Year"
                        />
                      </div>

                      {/* Semester */}
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="semester" className="form-label">
                          Semester
                        </label>
                        <Select
                          className=" detail"
                          isLoading={loadingSem}
                          options={
                            SemesterList?.map((s) => ({
                              value: s.id,
                              label: s.semester_description,
                            })) || []
                          }
                          value={
                            SemesterList?.find((s) => s.id === selectedSemester)
                              ? {
                                  value: selectedSemester,
                                  label: SemesterList.find(
                                    (s) => s.id === selectedSemester
                                  )?.semester_description,
                                }
                              : null
                          }
                          onChange={(opt) => {
                            setSelectedSemester(opt?.value || "");
                            setSelectedSection("");
                          }}
                          placeholder="Select Semester"
                        />
                      </div>

                      {/* Section */}
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="section" className="form-label">
                          Section
                        </label>
                        <Select
                          className=" detail"
                          isLoading={loadingSec}
                          options={
                            SectionList?.map((s) => ({
                              value: s.id,
                              label: s.section_name,
                            })) || []
                          }
                          value={
                            SectionList?.find((s) => s.id === selectedSection)
                              ? {
                                  value: selectedSection,
                                  label: SectionList.find(
                                    (s) => s.id === selectedSection
                                  )?.section_name,
                                }
                              : null
                          }
                          onChange={(opt) =>
                            setSelectedSection(opt?.value || "")
                          }
                          placeholder="Select Section"
                        />
                      </div>

                      {/* Club Group */}
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="club-group" className="form-label">
                          Club Group
                        </label>
                        <Select
                          className=" detail"
                          options={clubGroupList.map((group) => ({
                            value: group.club_group_id,
                            label: group.club_group_description,
                          }))}
                          value={
                            selectedClubGroup
                              ? {
                                  value: selectedClubGroup,
                                  label:
                                    clubGroupList.find(
                                      (g) =>
                                        g.club_group_id === selectedClubGroup
                                    )?.club_group_description || "",
                                }
                              : null
                          }
                          onChange={(option) => {
                            const groupId = option?.value || "";
                            setSelectedClubGroup(groupId);
                            setSelectedClub("");

                            // ✅ Fetch clubs for this selected group
                            if (groupId) {
                              fetchClubs(groupId); // Automatically fills the club dropdown
                            } else {
                              setClubOptions([]);
                            }
                          }}
                          placeholder="Select Club Group"
                        />
                      </div>

                      {/* Club */}
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="club" className="form-label">
                          Club
                        </label>
                        <Select
                          className=" detail"
                          options={clubOptions.map((club) => ({
                            value: club.club_id,
                            label: club.club_description,
                          }))}
                          value={
                            selectedClub
                              ? {
                                  value: selectedClub,
                                  label:
                                    clubOptions.find(
                                      (c) => c.club_id === selectedClub
                                    )?.club_description || "",
                                }
                              : null
                          }
                          onChange={(option) =>
                            handleGeneralClubChange({
                              target: { value: option?.value || "" },
                            })
                          }
                          placeholder={
                            clubOptions.length === 0
                              ? // ? "No clubs available for this group"
                                "Select Club Group First"
                              : "Select Club"
                          }
                        />
                      </div>

                      <Modal
                        show={showModal}
                        handleClose={handleCloseModal}
                        onSelectStudent={handleSelectStudent}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  {loadingStudents ? (
                    <p>Loading students...</p>
                  ) : errorStudents ? (
                    <p style={{ color: "red" }}>{errorStudents}</p>
                  ) : (
                    <table className="table ">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              onChange={(e) =>
                                handleSelectAll(e.target.checked)
                              }
                              checked={
                                selectedStudentIds.length ===
                                filteredStudentList.length
                              }
                            />
                          </th>
                          <th>Sr.No</th>
                          <th>Student Name</th>
                          <th>ONMRC Registration No</th>
                          <th>Admission No</th>
                          <th>Barcode</th>
                          <th>Course</th>
                          <th>Section</th>
                          <th>Father Name</th>
                          <th>Mother Name</th>
                          <th>House</th>
                          <th>Club Group</th>
                          <th>Club</th>
                          <th>Update</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.length > 0 ? (
                          currentPageData.map((student, index) => {
                            const sid = student.student_id || student.studentId; // normalized id

                            return (
                              <tr key={sid}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={selectedStudentIds.includes(sid)}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        sid,
                                        e.target.checked
                                      )
                                    }
                                  />
                                </td>
                                <td>{offset + index + 1}</td>
                                <td>{student.studentName}</td>
                                <td>{student.registration_no}</td>
                                <td>{student.college_admission_no}</td>
                                <td>{student.barcode}</td>
                                <td>{student.course_name}</td>
                                <td>{student.section_name}</td>
                                <td>{student.father_name}</td>
                                <td>{student.mother_name}</td>
                                <td>{student.house}</td>

                                {/* Club Group */}
                                <td key={`clubGroup-${sid}`}>
                                  <Select
                                    key={`clubGroupSelect-${sid}`}
                                    options={clubGroupList.map((group) => ({
                                      value: group.club_group_id,
                                      label: group.club_group_description,
                                    }))}
                                    value={
                                      selectedClubGroups[sid]
                                        ? {
                                            value: selectedClubGroups[sid],
                                            label:
                                              clubGroupList.find(
                                                (g) =>
                                                  g.club_group_id ===
                                                  selectedClubGroups[sid]
                                              )?.club_group_description || "",
                                          }
                                        : null
                                    }
                                    onChange={(option) => {
                                      const groupId = option?.value || "";

                                      // set only this student's group
                                      setSelectedClubGroups((prev) => ({
                                        ...prev,
                                        [sid]: groupId,
                                      }));

                                      // clear only this student's club selection
                                      setSelectedClubs((prev) => ({
                                        ...prev,
                                        [sid]: "",
                                      }));

                                      // fetch clubs only for this student's group
                                      if (groupId) fetchClubs(groupId, sid);
                                      else {
                                        // if cleared, ensure this student's club options are empty
                                        setStudentClubOptions((prev) => ({
                                          ...prev,
                                          [sid]: [],
                                        }));
                                      }
                                    }}
                                    placeholder="Select Club Group"
                                    styles={{
                                      container: (provided) => ({
                                        ...provided,
                                        width: 180,
                                      }),
                                      control: (provided) => ({
                                        ...provided,
                                        minHeight: 32,
                                        fontSize: 13,
                                      }),
                                    }}
                                  />
                                </td>

                                {/* Club */}
                                <td key={`club-${sid}`}>
                                  <Select
                                    key={`clubSelect-${sid}`}
                                    options={
                                      (studentClubOptions[sid] || []).map(
                                        (club) => ({
                                          value: club.club_id,
                                          label: club.club_description,
                                        })
                                      ) || []
                                    }
                                    value={
                                      selectedClubs[sid]
                                        ? {
                                            value: selectedClubs[sid],
                                            label:
                                              studentClubOptions[sid]?.find(
                                                (c) =>
                                                  c.club_id ===
                                                  selectedClubs[sid]
                                              )?.club_description || "",
                                          }
                                        : null
                                    }
                                    onChange={(option) => {
                                      const clubId = option?.value || "";
                                      setSelectedClubs((prev) => ({
                                        ...prev,
                                        [sid]: clubId,
                                      }));
                                    }}
                                    placeholder={
                                      !selectedClubGroups[sid]
                                        ? "Select Club Group first"
                                        : (studentClubOptions[sid] || [])
                                            .length === 0
                                        ? "No clubs available for this group"
                                        : "Select Club"
                                    }
                                    isDisabled={!selectedClubGroups[sid]}
                                    styles={{
                                      container: (provided) => ({
                                        ...provided,
                                        width: 180,
                                      }),
                                      control: (provided) => ({
                                        ...provided,
                                        minHeight: 32,
                                        fontSize: 13,
                                      }),
                                    }}
                                  />
                                </td>

                                <td>
                                  <button
                                    onClick={() => updateClub(sid)}
                                    type="button"
                                    className="btn btn-primary me-2"
                                    style={{
                                      width: "150px",
                                    }}
                                  >
                                    Update
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="13" style={{ textAlign: "center" }}>
                              No students available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                  <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={
                      "pagination justify-content-center mt-3"
                    }
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
                  />
                </div>
              </div>
            </div>
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default AdmAttendanceEntry;
