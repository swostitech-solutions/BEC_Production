import React, { useRef, useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Table, } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";
import "./AdmClassTimeTable.css";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";

const AdmAttendanceEntry = () => {

  // Get org and branch from sessionStorage
  const organizationId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");

  // Function to properly format name with correct prefix capitalization
  const formatEmployeeName = (name) => {
    if (!name) return "";
    
    // Split name into parts
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "";
    
    // Check if first part is a prefix
    const firstPart = parts[0].toLowerCase();
    const prefixMap = {
      'mr': 'Mr.',
      'mr.': 'Mr.',
      'ms': 'Ms',
      'ms.': 'Ms',
      'mrs': 'Mrs',
      'mrs.': 'Mrs',
      'dr': 'Dr.',
      'dr.': 'Dr.'
    };
    
    // If first part is a prefix, format it properly
    if (prefixMap[firstPart]) {
      const formattedPrefix = prefixMap[firstPart];
      const restOfName = parts.slice(1).map(part => 
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      ).join(' ');
      return `${formattedPrefix} ${restOfName}`;
    }
    
    // If no prefix found, just capitalize each word
    return parts.map(part => 
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    ).join(' ');
  };

  const [classOptions, setClassOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [periodOptions, setPeriodOptions] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [sessionOptions, setSessionOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);

  // Fetch dropdown data using hooks
  const { BatchList, loading: loadingBatch } = useFetchSessionList(organizationId, branchId);
  const { CourseList, loading: loadingCourse } = useFetchCourseByFilter(
    organizationId,
    selectedSession?.value
  );
  const { BranchList, loading: loadingDept } = useFetchBranch(
    organizationId,
    branchId,
    selectedSession?.value,
    selectedCourse?.value
  );
  const { AcademicYearList, loading: loadingAY } = useFetchAcademicYearByFilter(
    organizationId,
    branchId,
    selectedSession?.value,
    selectedCourse?.value,
    selectedBranch?.value
  );
  const { SemesterList, loading: loadingSem } = useFetchSemesterByFilter(
    organizationId,
    branchId,
    selectedSession?.value,
    selectedCourse?.value,
    selectedBranch?.value,
    selectedAcademicYear?.value
  );
  const { SectionList, loading: loadingSec } = useFetchSectionByFilter(
    organizationId,
    branchId,
    selectedSession?.value,
    selectedCourse?.value,
    selectedBranch?.value,
    selectedAcademicYear?.value,
    selectedSemester?.value
  );


  const navigate = useNavigate();
  // const [totalLectures, setTotalLectures] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);

  // Debug: Log selected values
  useEffect(() => {
    console.log("🔍 Selected values:", {
      session: selectedSession,
      course: selectedCourse,
      branch: selectedBranch,
      academicYear: selectedAcademicYear,
      semester: selectedSemester,
      section: selectedSection
    });
  }, [selectedSession, selectedCourse, selectedBranch, selectedAcademicYear, selectedSemester, selectedSection]);

  // Populate Session dropdown
  useEffect(() => {
    if (BatchList && BatchList.length > 0) {
      console.log("Populating Session dropdown with:", BatchList);
      const options = BatchList.map((batch) => ({
        value: batch.id,
        label: batch.batch_description || batch.batch_code || batch.batch_name || batch.name,
      }));
      setSessionOptions([{ value: "", label: "Select Session" }, ...options]);
    } else {
      setSessionOptions([{ value: "", label: "Select Session" }]);
    }
  }, [BatchList]);

  // Populate Course dropdown
  useEffect(() => {
    if (CourseList && CourseList.length > 0) {
      console.log("Populating Course dropdown with:", CourseList);
      const options = CourseList.map((course) => ({
        value: course.id,
        label: course.coursename || course.course_name || course.name,
      }));
      setCourseOptions([{ value: "", label: "Select Course" }, ...options]);
    } else {
      setCourseOptions([{ value: "", label: "Select Course" }]);
    }
  }, [CourseList]);

  // Populate Branch (Department) dropdown
  useEffect(() => {
    if (BranchList && BranchList.length > 0) {
      console.log("Populating Branch dropdown with:", BranchList);
      const options = BranchList.map((branch) => ({
        value: branch.id,
        label: branch.department_description || branch.department_code || branch.department_name || branch.name,
      }));
      setBranchOptions([{ value: "", label: "Select Branch" }, ...options]);
      console.log("Branch options set:", options);
    } else {
      console.log("No Branch data available");
      setBranchOptions([{ value: "", label: "Select Branch" }]);
    }
  }, [BranchList]);

  // Populate Academic Year dropdown
  useEffect(() => {
    if (AcademicYearList && AcademicYearList.length > 0) {
      console.log("Populating Academic Year dropdown with:", AcademicYearList);
      const options = AcademicYearList.map((year) => ({
        value: year.id,
        label: year.academic_year_description || year.academic_year_code || year.academic_year_name || year.name,
      }));
      setAcademicYearOptions([{ value: "", label: "Select Academic Year" }, ...options]);
      console.log("Academic Year options set:", options);
    } else {
      console.log("No Academic Year data available, waiting for dependencies");
      setAcademicYearOptions([{ value: "", label: "Select Academic Year" }]);
    }
  }, [AcademicYearList]);

  const handleClear = () => {
    // Clear dropdowns (Select)
    setSelectedSession(null);
    setSelectedCourse(null);
    setSelectedBranch(null);
    setSelectedAcademicYear(null);
    setSelectedClass(null);
    setSelectedSection(null);
    setSelectedSubject(null);
    setSelectedPeriod(null);
    setSelectedMentor(null);
    setSelectedSemester(null);

    // Clear Days checkboxes
    setSelectedDays([]);

    // Clear Table Data
    setTableData([]);

    // Hide Table if needed
    setShowTable(false);
  };


  // Days array - lowercase to match backend API format
  const allDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  // Fetch all classes


  // Populate Semester dropdown from hook
  useEffect(() => {
    console.log("SemesterList updated:", SemesterList);
    if (SemesterList && SemesterList.length > 0) {
      const options = SemesterList.map((sem) => ({
        value: sem.id,
        label: sem.semester_description || sem.semester_code || sem.semester_name || sem.name || sem.term_desc,
      }));
      setSemesterOptions([{ value: "", label: "Select Semester" }, ...options]);
      console.log("Semester options set:", options);
    } else {
      console.log("No Semester data available yet");
      setSemesterOptions([{ value: "", label: "Select Semester" }]);
    }
  }, [SemesterList]);
  // Populate Section dropdown from hook
  useEffect(() => {
    console.log("SectionList updated:", SectionList);
    if (SectionList && SectionList.length > 0) {
      const options = SectionList.map((section) => ({
        value: section.id,
        label: section.section_description || section.section_code || section.section_name || section.sectionname || section.name,
      }));
      setSectionOptions([{ value: "", label: "Select Section" }, ...options]);
      console.log("Section options set:", options);
    } else {
      console.log("No Section data available yet");
      setSectionOptions([{ value: "", label: "Select Section" }]);
    }
  }, [SectionList]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const orgId = sessionStorage.getItem("organization_id");
        const brnchId = sessionStorage.getItem("branch_id");

        if (!orgId || !brnchId) {
          console.error("Missing organization_id or branch_id in sessionStorage");
          return;
        }

        const response = await fetch(
          `${ApiUrl.apiurl}Teacher/GetEmployeeList/?orgId=${orgId}&branchId=${brnchId}`
        );
        const data = await response.json();
        if (data && data.data) {
          // Mapping data to match React Select options format
          const formattedMentors = data.data.map((mentor) => ({
            value: mentor.id,
            label: mentor.employeeName,
          }));
          setMentors(formattedMentors);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };

    fetchMentors();
  }, []);

  // Fetch Period list using new LecturePeriod API - only requires organization_id and branch_id
  useEffect(() => {
    const fetchPeriods = async () => {
      const orgId = sessionStorage.getItem("organization_id");
      const branchId = sessionStorage.getItem("branch_id");

      if (!orgId || !branchId) {
        console.error("❌ Missing organization_id or branch_id in sessionStorage");
        setPeriodOptions([{ value: "", label: "Select Period" }]);
        return;
      }

      try {
        const apiUrl = `${ApiUrl.apiurl}LecturePeriod/GetLecturePeriodList/?organization_id=${orgId}&branch_id=${branchId}`;
        console.log("🔄 Fetching Periods from new API:", apiUrl);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          console.error(`❌ Period API Error ${response.status}`);
          setPeriodOptions([{ value: "", label: "Period API Error" }]);
          return;
        }

        // Check if response has content
        const text = await response.text();
        if (!text || text.trim() === '') {
          console.error("❌ Empty response from Period API");
          setPeriodOptions([{ value: "", label: "No Periods Found" }]);
          return;
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error("❌ Failed to parse period response:", text);
          setPeriodOptions([{ value: "", label: "⚠️ Invalid API Response" }]);
          return;
        }

        console.log("✅ Period API Response:", data);

        // Handle response structure - adjust based on actual API response
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          const options = data.data.map((period) => ({
            value: period.id || period.period_id || period.lecture_period_id,
            label: `${period.period_name || period.lecture_period_name || period.name || `Period ${period.period_no || period.id}`} (${period.time_from || ''} - ${period.time_to || ''})`,
          }));
          setPeriodOptions([
            { value: "", label: "Select Period" },
            ...options,
          ]);
          console.log("✅ Period options set:", options);
        } else if (data && Array.isArray(data) && data.length > 0) {
          // Handle if API returns array directly
          const options = data.map((period) => ({
            value: period.id || period.period_id || period.lecture_period_id,
            label: `${period.period_name || period.lecture_period_name || period.name || `Period ${period.period_no || period.id}`} (${period.time_from || ''} - ${period.time_to || ''})`,
          }));
          setPeriodOptions([
            { value: "", label: "Select Period" },
            ...options,
          ]);
          console.log("✅ Period options set:", options);
        } else {
          console.error("❌ API returned empty data - No periods configured");
          setPeriodOptions([{ value: "", label: "No Periods Found" }]);
        }
      } catch (error) {
        console.error("❌ Error fetching periods:", error);
        setPeriodOptions([{ value: "", label: "⚠️ Failed to Load Periods" }]);
      }
    };

    fetchPeriods();
  }, []); // No dependencies - fetch once when component mounts!


  useEffect(() => {
    const fetchSubjects = async () => {
      const orgId = sessionStorage.getItem("organization_id");
      const brnchId = sessionStorage.getItem("branch_id");

      if (!selectedSession || !selectedCourse || !selectedBranch || !selectedAcademicYear || !selectedSemester) {
        console.log("Subject fetch waiting for dependencies");
        setSubjectOptions([{ value: "", label: "Select Subject" }]);
        return;
      }

      const searchParams = new URLSearchParams({
        organization_id: orgId,
        branch_id: brnchId,
        batch_id: selectedSession.value,
        course_id: selectedCourse.value,
        department_id: selectedBranch.value,
        academic_year_id: selectedAcademicYear.value,
        semester_id: selectedSemester.value,
        subject_group_id: 1,
      });

      try {
        const apiUrl = `${ApiUrl.apiurl}Subjects/GetSubjectListBasedOnCourseAndSemester/?${searchParams}`;
        console.log("Fetching Subjects from:", apiUrl);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Subject API Response:", data);

        if (data && data.data && Array.isArray(data.data)) {
          const options = data.data.map((subject) => ({
            value: subject.id,
            label: subject.subject_name || subject.subjectcode || subject.name,
          }));
          setSubjectOptions([
            { value: "", label: "Select Subject" },
            ...options,
          ]);
          console.log("Subject options set:", options);
        } else if (Array.isArray(data)) {
          const options = data.map((subject) => ({
            value: subject.id,
            label: subject.subject_name || subject.subjectcode || subject.name,
          }));
          setSubjectOptions([
            { value: "", label: "Select Subject" },
            ...options,
          ]);
          console.log("Subject options set:", options);
        } else {
          console.log("No subjects found in response");
          setSubjectOptions([{ value: "", label: "Select Subject" }]);
        }
      } catch (error) {
        console.error("Error fetching subject data:", error);
        setSubjectOptions([{ value: "", label: "Select Subject" }]);
      }
    };

    fetchSubjects();
  }, [selectedSession, selectedCourse, selectedBranch, selectedAcademicYear, selectedSemester]);

  // const handleSave = () => {
  //   const orgId = sessionStorage.getItem("organization_id");
  //   const brnchId = sessionStorage.getItem("branch_id");
  //   const createdBy = sessionStorage.getItem("userId");

  //   if (
  //     !selectedMentor ||
  //     !selectedSession ||
  //     !selectedCourse ||
  //     !selectedBranch ||
  //     !selectedAcademicYear ||
  //     !selectedSemester ||
  //     !selectedSection ||
  //     !selectedSubject ||
  //     !selectedPeriod ||
  //     selectedDays.length === 0
  //   ) {
  //     alert("Please fill all required fields including Period/Lecture.");
  //     return;
  //   }

  //   // Map frontend values to backend parameter names
  //   const requestBody = {
  //     organization_id: orgId,
  //     branch_id: brnchId,
  //     batch_id: selectedSession.value,           // Session → batch_id
  //     course_id: selectedCourse.value,           // Course → course_id
  //     department_id: selectedBranch.value,       // Branch → department_id
  //     academic_year_id: selectedAcademicYear.value, // Academic Year → academic_year_id
  //     semester_id: selectedSemester.value,       // Semester → semester_id
  //     section_id: selectedSection.value,         // Section → section_id
  //     professor_id: selectedMentor.value,        // Teacher → professor_id
  //     subject_id: selectedSubject.value,         // Subject → subject_id
  //     lecture_id: selectedPeriod.value,          // Period → lecture_id (REQUIRED)
  //     days: selectedDays,                        // Days → days[]
  //     created_by: createdBy,
  //   };

  //   console.log("Request Body:", requestBody);

  //   fetch(`${ApiUrl.apiurl}TIME_TABLE/TimeTableCreate/`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(requestBody),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Response:", data);
  //       if (data.message) {
  //         alert(data.message);
  //         if (data.message.toLowerCase().includes("success")) {
  //           handleDisplay(); // Refresh the table
  //         }
  //       } else if (data.success || data.status === "success") {
  //         alert("Time Table Entry Saved Successfully!");
  //         handleDisplay(); // Refresh the table
  //       } else {
  //         alert("Something went wrong. Please try again.");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error saving Time Table Entry:", error);
  //       alert("Error saving Time Table Entry.");
  //     });
  // };


  // Handle Day Selection
  
  const handleSave = () => {
    const orgId = sessionStorage.getItem("organization_id");
    const brnchId = sessionStorage.getItem("branch_id");
    const createdBy = sessionStorage.getItem("userId");

    //  Validation
    if (
      !selectedMentor ||
      !selectedSession ||
      !selectedCourse ||
      !selectedBranch ||
      !selectedAcademicYear ||
      !selectedSemester ||
      !selectedSection ||
      !selectedSubject ||
      !selectedPeriod ||
      selectedDays.length === 0
    ) {
      alert("Please fill all required fields including Period/Lecture.");
      return;
    }

    //  Request Body
    const requestBody = {
      organization_id: Number(orgId),
      branch_id: Number(brnchId),
      batch_id: selectedSession.value,
      course_id: selectedCourse.value,
      department_id: selectedBranch.value,
      academic_year_id: selectedAcademicYear.value,
      semester_id: selectedSemester.value,
      section_id: selectedSection.value,
      professor_id: selectedMentor.value,
      subject_id: selectedSubject.value,
      lecture_id: selectedPeriod.value, // REQUIRED
      days: selectedDays,
      created_by: Number(createdBy),
    };

    console.log(" Time Table Request:", requestBody);

    fetch(`${ApiUrl.apiurl}TIME_TABLE/TimeTableCreate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then(async (response) => {
        const data = await response.json();
        console.log(" API Response:", data);

        //  SUCCESS CONDITION (ALL CASES HANDLED)
        if (
          response.ok &&
          (data.status === "success" ||
            data.success === true ||
            data.message?.toLowerCase().includes("success"))
        ) {
          alert("Time Table Entry Saved Successfully!");
          handleDisplay(); // refresh table
          return;
        }

        //  FAILURE WITH MESSAGE
        if (data.message) {
          alert(data.message);
          return;
        }

        //  UNKNOWN FAILURE
        alert("Something went wrong. Please try again.");
      })
      .catch((error) => {
        console.error(" Error saving Time Table Entry:", error);
        alert("Error saving Time Table Entry.");
      });
  };

  
  
  const handleDayChange = (day) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };


  const handleDisplay = async () => {
    const orgId = sessionStorage.getItem("organization_id");
    const brnchId = sessionStorage.getItem("branch_id");

    const params = new URLSearchParams({
      organization_id: orgId,
      branch_id: brnchId,
    });

    // Add optional filters using correct backend parameter names
    if (selectedSession?.value) params.append("batch_id", selectedSession.value);
    if (selectedCourse?.value) params.append("course_id", selectedCourse.value);
    if (selectedBranch?.value) params.append("department_id", selectedBranch.value);
    if (selectedAcademicYear?.value) params.append("academic_year_id", selectedAcademicYear.value);
    if (selectedSemester?.value) params.append("semester_id", selectedSemester.value);
    if (selectedSection?.value) params.append("section_id", selectedSection.value);
    if (selectedMentor?.value) params.append("professor_id", selectedMentor.value);
    if (selectedSubject?.value) params.append("subject_id", selectedSubject.value);
    if (selectedPeriod?.value) params.append("lecture_id", selectedPeriod.value);

    // Note: Days parameter NOT sent to backend (causes 500 error - backend doesn't support it yet)
    // Will filter by days on frontend instead

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}TIME_TABLE/GetTimeTableEntryDifSearchBasisList/?${params.toString()}`
      );

      if (!response.ok) {
        console.error(`Display API Error: ${response.status}`);
        setTableData([]);
        setShowTable(true);
        alert(`Error fetching timetable data: ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log("Display API Response:", data);
      if (data && data.message === "success") {
        let filteredData = data.data && data.data.length > 0 ? data.data : [];

        // Filter by selected days on frontend (backend doesn't support days parameter yet)
        if (selectedDays.length > 0) {
          filteredData = filteredData.filter(item =>
            selectedDays.some(day => item.day?.toLowerCase() === day.toLowerCase())
          );
          console.log(`Filtered by days [${selectedDays.join(', ')}]:`, filteredData);
        }

        setTableData(filteredData);
        setShowTable(true);
      } else {
        setTableData([]);
        setShowTable(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableData([]);
      setShowTable(true);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (!confirmDelete) return;

    const orgId = sessionStorage.getItem("organization_id");
    const brnchId = sessionStorage.getItem("branch_id");

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}TIME_TABLE/delete/?organization_id=${orgId}&branch_id=${brnchId}&time_table_id=${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        console.error(`Delete API Error: ${response.status}`);
        alert(`Failed to delete entry. Error: ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log("Delete API Response:", data);

      if (data && (data.message === "success" || data.status === "success")) {
        alert("Entry deleted successfully!");
        // Remove the deleted item from table
        setTableData((prevData) => prevData.filter((item) => item.id !== id));
      } else {
        alert(data.message || "Failed to delete entry.");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Error deleting entry. Please try again.");
    }
  };

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
                CLASS TIMETABLE
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleDisplay}
                  >
                    Display
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleSave}
                  >
                    Save
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
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <Row>
                    {[
                      {
                        label: "Teacher",
                        id: "teacher",
                        component: (
                          <Select
                            id="mentor"
                            options={mentors}
                            className="detail"
                            value={selectedMentor}
                            onChange={setSelectedMentor}
                            placeholder="Select Mentor"
                            classNamePrefix="mentor-dropdown"
                          />
                        ),
                      },
                      {
                        label: "Session",
                        id: "session",
                        component: (
                          <Select
                            options={sessionOptions}
                            className="detail"
                            classNamePrefix="session-dropdown"
                            placeholder="Select Session"
                            value={selectedSession}
                            onChange={setSelectedSession}
                          />
                        ),
                      },
                      {
                        label: "Course",
                        id: "course",
                        component: (
                          <Select
                            options={courseOptions}
                            className="detail"
                            classNamePrefix="course-dropdown"
                            placeholder="Select Course"
                            value={selectedCourse}
                            onChange={setSelectedCourse}
                          />
                        ),
                      },
                      {
                        label: "Department",
                        id: "branch",
                        component: (
                          <Select
                            options={branchOptions}
                            className="detail"
                            classNamePrefix="branch-dropdown"
                            placeholder="Select Branch"
                            value={selectedBranch}
                            onChange={setSelectedBranch}
                          />
                        ),
                      },
                      {
                        label: "Academic Year",
                        id: "academicYear",
                        component: (
                          <Select
                            options={academicYearOptions}
                            className="detail"
                            classNamePrefix="academic-year-dropdown"
                            placeholder="Select Academic Year"
                            value={selectedAcademicYear}
                            onChange={setSelectedAcademicYear}
                          />
                        ),
                      },
                      {
                        label: "Semester",
                        id: "semester",
                        component: (
                          <Select
                            options={semesterOptions}
                            className="detail"
                            classNamePrefix="semester-dropdown"
                            placeholder="Select Semester"
                            isDisabled={!selectedAcademicYear}
                            value={selectedSemester}
                            onChange={setSelectedSemester}
                          />
                        ),
                      },

                      {
                        label: "Section",
                        id: "section",
                        component: (
                          <Select
                            options={sectionOptions}
                            className="detail"
                            classNamePrefix="section-dropdown"
                            placeholder="Select Section"
                            isDisabled={!selectedSemester}
                            value={selectedSection}
                            onChange={setSelectedSection}
                          />
                        ),
                      },
                      {
                        label: "Subject",
                        id: "subject",
                        component: (
                          <Select
                            options={subjectOptions}
                            className="detail"
                            classNamePrefix="subject-dropdown"
                            placeholder="Select Subject"
                            isDisabled={!selectedSection}
                            value={selectedSubject}
                            onChange={setSelectedSubject}
                          />
                        ),
                      },
                      {
                        label: "Period",
                        id: "period",
                        component: (
                          <Select
                            options={periodOptions}
                            className="detail"
                            classNamePrefix="period-dropdown"
                            placeholder="Select Period"
                            value={selectedPeriod}
                            onChange={setSelectedPeriod}
                          />
                        ),
                      },
                    ].map((field, index) => (
                      <Col xs={12} md={4} key={index} className="mb-3">
                        <Form.Group controlId={field.id}>
                          <Form.Label>
                            {field.label} <span className="text-danger">*</span>
                          </Form.Label>
                          {field.component ? (
                            field.component
                          ) : (
                            <Form.Select>
                              {field.options.map((option, i) => (
                                <option key={i} value={i}>
                                  {option}
                                </option>
                              ))}
                            </Form.Select>
                          )}
                        </Form.Group>
                      </Col>
                    ))}

                    <Col xs={12} md={8} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          Days <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="day-checkbox-grid">
                          {allDays.map((day, i) => (
                            <Form.Check
                              key={i}
                              type="checkbox"
                              label={day}
                              checked={selectedDays.includes(day)}
                              onChange={() => handleDayChange(day)}
                            />
                          ))}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>

              <div className="col-12">
                <Col>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sr.No</th>
                          <th>Day</th>
                          <th>Course</th>
                          <th>Branch</th>
                          <th>Section</th>
                          <th>Subject</th>
                          <th>Period</th>
                          <th>Teacher</th>
                          <th>Semester</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.length > 0 ? (
                          tableData.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{item.day}</td>
                              <td>{item.course}</td>
                              <td>{item.department}</td>
                              <td>{item.section}</td>
                              <td>{item.subject}</td>
                              <td>{item.lecture_period}</td>
                              <td>{formatEmployeeName(item.professor)}</td>
                              <td>{item.semester}</td>
                              <td>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="btn btn-sm btn-danger"
                                  style={{ border: 'none', background: 'transparent', color: '#dc3545', cursor: 'pointer' }}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="10" className="text-center">
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Col>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default AdmAttendanceEntry;
