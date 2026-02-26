import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SelectSearchParty from "../AdminSearchExpense/SelectSearchParty";
import { useNavigate } from "react-router-dom";
// import SelectStudentFeeModal from "../FeeStudentModal/SelectStudentFeeModal";
import ModalClass from "../AdminStudentClass/ModalClass";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import HostelEdit from "../AdminStudentHostelFee/HostelEdit";
import ReactPaginate from "react-paginate";

const AdmAttendanceEntry = () => {
  const token = localStorage.getItem("accessToken");

  const [showModal, setShowModal] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentCourseData, setStudentCourseData] = useState([]);
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState({
    name: "",
    barcode: "",
    admissionNo: "",
    fatherName: "",
    motherName: "",
    schoolAdmissionNo: "",
  });
  const [sectionId, setSectionId] = useState(null);
  const [classId, setClassId] = useState(null);
  //  const [classOptions, setClassOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [transportData, setTransportData] = useState([]);
  const [showStudentSearchModal, setShowStudentSearchModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentTransportDetails, setStudentTransportDetails] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const fromClassRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const handleClear = () => {
    setStudentName("");
    // setStudentId(null);
    setStudentId("");

    // Clear dropdown states
    setSelectedSession(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);

    // Clear all dependent data
    setCourses([]);
    setDepartments([]);
    setAcademicYears([]);
    setSemesters([]);
    setSections([]);

    // Clear student table
    setStudentCourseData([]);
    setTransportData([]);

    // reset pagination
    setCurrentPage(0);
  };

  // Slice data for pagination
  // const offset = currentPage * itemsPerPage;
  // const currentData = transportData.slice(offset, offset + itemsPerPage);
  // const pageCount = Math.ceil(transportData.length / itemsPerPage);

  const offset = currentPage * itemsPerPage;
  const currentData = studentCourseData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(studentCourseData.length / itemsPerPage);

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSelectStudent = (selected) => {
    // 1. Set Student Name
    setStudentName(selected.studentBasicDetails.first_name || "");
    setStudentId(selected.studentBasicDetails.id);

    // 2. Set Dropdowns
    setSelectedSession({
      value: selected.academicDetails.batch_id,
      label: selected.raw.batch_code,
    });

    setSelectedCourse({
      value: selected.academicDetails.course_id,
      label: selected.raw.course_name,
    });

    setSelectedDepartment({
      value: selected.academicDetails.department_id,
      label: selected.raw.department_code,
    });

    setSelectedAcademicYear({
      value: selected.academicDetails.academic_year_id,
      label: selected.raw.academic_year_code,
    });

    setSelectedSemester({
      value: selected.academicDetails.semester_id,
      label: selected.raw.semester_name,
    });

    setSelectedSection({
      value: selected.academicDetails.section_id,
      label: selected.raw.section_name,
    });

    // Close Modal
    handleClose();
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // get token from local storage
        const branch_id = sessionStorage.getItem("branch_id"); // get branch ID from session storage
        const organization_id = sessionStorage.getItem("organization_id"); // get organization ID from session storage

        if (!branch_id || !organization_id) {
          console.error(
            "Branch ID or Organization ID not found in session storage."
          );
          return;
        }

        const response = await fetch(
          `${ApiUrl.apiurl}Batch/GetBatch/?organization_id=${organization_id}&branch_id=${branch_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // attach token
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const sessionOptions = data.map((item) => ({
            value: item.id,
            label: item.batch_description, // display "2025-2028"
          }));
          setSessions(sessionOptions); // store mapped data in state
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      // If no session is selected, clear the course list and return
      if (!selectedSession?.value) {
        setCourses([]);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value; // Get selected session’s batch_id

        if (!organization_id || !branch_id || !batch_id) {
          console.warn("Missing required parameters:", {
            organization_id,
            branch_id,
            batch_id,
          });
          return;
        }

        console.log(
          `Fetching courses for organization_id=${organization_id}, branch_id=${branch_id}, batch_id=${batch_id}`
        );

        const response = await fetch(
          `${ApiUrl.apiurl}Course/GetCourse/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const courseOptions = data.map((item) => ({
            value: item.id,
            label: item.course_name,
          }));

          setCourses(courseOptions);
          console.log("Fetched course list successfully:", courseOptions);
        } else {
          console.error("Unexpected API response format:", data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [selectedSession]);

  useEffect(() => {
    const fetchDepartments = async () => {
      // Only call API when both session and course are selected
      if (!selectedSession?.value || !selectedCourse?.value) {
        setDepartments([]);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value; //  batch_id from selected session
        const course_id = selectedCourse.value; //  course_id from selected course

        // Validation
        if (!token || !organization_id || !branch_id) {
          console.warn("Missing required identifiers:", {
            token: !!token,
            organization_id,
            branch_id,
          });
          return;
        }

        console.log(
          `Fetching departments for organization_id=${organization_id}, branch_id=${branch_id}, batch_id=${batch_id}, course_id=${course_id}`
        );

        const response = await fetch(
          `${ApiUrl.apiurl}Department/GetDepartment/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Network response not ok: ${response.status} - ${errorText}`
          );
        }

        const result = await response.json();
        console.log("Department API Response:", result);

        // Map department data
        if (Array.isArray(result)) {
          // Some APIs return raw arrays (no "message" or "data" field)
          const departmentOptions = result.map((item) => ({
            value: item.id || item.department_id,
            label:
              item.department_name ||
              item.description ||
              item.department_description ||
              "Unnamed Department",
          }));
          setDepartments(departmentOptions);
          console.log("Mapped departments:", departmentOptions);
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          const departmentOptions = result.data.map((item) => ({
            value: item.id || item.department_id,
            label:
              item.department_name ||
              item.description ||
              item.department_description ||
              "Unnamed Department",
          }));
          setDepartments(departmentOptions);
          console.log("Mapped departments:", departmentOptions);
        } else {
          console.warn("Unexpected API format:", result);
          setDepartments([]);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, [selectedSession, selectedCourse]);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      // Only call API when session, course, and department are selected
      if (
        !selectedSession?.value ||
        !selectedCourse?.value ||
        !selectedDepartment?.value
      ) {
        setAcademicYears([]);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value; // from session dropdown
        const course_id = selectedCourse.value; // from course dropdown
        const department_id = selectedDepartment.value; // from department dropdown

        //  Validation
        if (!token || !organization_id || !branch_id) {
          console.warn("Missing required parameters:", {
            token: !!token,
            organization_id,
            branch_id,
          });
          return;
        }

        //  Construct correct API URL
        const url = `${ApiUrl.apiurl}AcademicYear/GetAcademicYear/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}`;
        console.log("Fetching Academic Years from:", url);

        //  Fetch data
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Network response not ok: ${response.status} - ${errorText}`
          );
        }

        const result = await response.json();
        console.log("Academic Year API Response:", result);

        //  Handle both possible response formats
        if (Array.isArray(result)) {
          const options = result.map((item) => ({
            value: item.id || item.academic_year_id,
            label:
              item.academic_year_description ||
              item.academic_year_code ||
              "Unnamed Year",
          }));
          setAcademicYears(options);
          console.log("Mapped academic years:", options);
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          const options = result.data.map((item) => ({
            value: item.id || item.academic_year_id,
            label:
              item.academic_year_description ||
              item.academic_year_code ||
              "Unnamed Year",
          }));
          setAcademicYears(options);
          console.log("Mapped academic years:", options);
        } else {
          console.warn("Unexpected API format:", result);
          setAcademicYears([]);
        }
      } catch (error) {
        console.error("Error fetching academic years:", error);
        setAcademicYears([]);
      }
    };

    fetchAcademicYears();
  }, [selectedSession, selectedCourse, selectedDepartment]);

  useEffect(() => {
    const fetchSemesters = async () => {
      // Only call API when session, course, department, and academic year are selected
      if (
        !selectedSession?.value ||
        !selectedCourse?.value ||
        !selectedDepartment?.value ||
        !selectedAcademicYear?.value
      ) {
        setSemesters([]);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value;
        const course_id = selectedCourse.value;
        const department_id = selectedDepartment.value;
        const academic_year_id = selectedAcademicYear.value;

        //  Validation
        if (!token || !organization_id || !branch_id) {
          console.warn("Missing required identifiers:", {
            token: !!token,
            organization_id,
            branch_id,
          });
          return;
        }

        //  Correct API endpoint
        const url = `${ApiUrl.apiurl}Semester/GetSemester/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}&academic_year_id=${academic_year_id}`;
        console.log("Fetching Semesters from:", url);

        //  Fetch data
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Network response not ok: ${response.status} - ${errorText}`
          );
        }

        const result = await response.json();
        console.log("Semester API Response:", result);

        //  Handle both response formats (array or { message: 'Success', data: [...] })
        if (Array.isArray(result)) {
          const options = result.map((item) => ({
            value: item.id || item.semester_id,
            label:
              item.semester_description ||
              item.semester_code ||
              "Unnamed Semester",
          }));
          setSemesters(options);
          console.log("Mapped Semesters:", options);
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          const options = result.data.map((item) => ({
            value: item.id || item.semester_id,
            label:
              item.semester_description ||
              item.semester_code ||
              "Unnamed Semester",
          }));
          setSemesters(options);
          console.log("Mapped Semesters:", options);
        } else {
          console.warn("Unexpected API format:", result);
          setSemesters([]);
        }
      } catch (error) {
        console.error("Error fetching semesters:", error);
        setSemesters([]);
      }
    };

    fetchSemesters();
  }, [
    selectedSession,
    selectedCourse,
    selectedDepartment,
    selectedAcademicYear,
  ]);

  useEffect(() => {
    const fetchSections = async () => {
      // Only call API when all required dropdowns are selected
      if (
        !selectedSession?.value ||
        !selectedCourse?.value ||
        !selectedDepartment?.value ||
        !selectedAcademicYear?.value ||
        !selectedSemester?.value
      ) {
        setSections([]); // clear section list when dependencies are missing
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value;
        const course_id = selectedCourse.value;
        const department_id = selectedDepartment.value;
        const academic_year_id = selectedAcademicYear.value;
        const semester_id = selectedSemester.value;

        //  Validation
        if (!token || !organization_id || !branch_id) {
          console.warn("Missing required identifiers:", {
            token: !!token,
            organization_id,
            branch_id,
          });
          return;
        }

        //  Construct API URL
        const url = `${ApiUrl.apiurl}Section/GetSection/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}&academic_year_id=${academic_year_id}&semester_id=${semester_id}`;
        console.log("Fetching Sections from:", url);

        //  Fetch data
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, //  Pass auth token
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Network response not ok: ${response.status} - ${errorText}`
          );
        }

        const result = await response.json();
        console.log("Section API Response:", result);

        //  Handle both response types (array or object with data)
        if (Array.isArray(result)) {
          const sectionOptions = result.map((item) => ({
            value: item.id || item.section_id,
            label:
              item.section_name ||
              item.section_description ||
              "Unnamed Section",
          }));
          setSections(sectionOptions);
          console.log("Mapped Sections:", sectionOptions);
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          const sectionOptions = result.data.map((item) => ({
            value: item.id || item.section_id,
            label:
              item.section_name ||
              item.section_description ||
              "Unnamed Section",
          }));
          setSections(sectionOptions);
          console.log("Mapped Sections:", sectionOptions);
        } else {
          console.warn("Unexpected API format:", result);
          setSections([]);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        setSections([]);
      }
    };

    fetchSections();
  }, [
    selectedSession,
    selectedCourse,
    selectedDepartment,
    selectedAcademicYear,
    selectedSemester,
  ]);

  const handleSessionChange = (selectedOption) => {
    setSelectedSessionId(selectedOption.value);
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const orgId = localStorage.getItem("orgId");
        const branchId = localStorage.getItem("branchId");

        if (!orgId || !branchId) {
          console.error("Missing orgId or branchId in local storage");
          return;
        }

        const response = await fetch(
          `/api/Transport/routemasterlist/${orgId}/${branchId}/`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch routes");
        }

        const data = await response.json();
        const options = data.map((route) => ({
          value: route.id,
          label: route.transport_name,
        }));

        setRoutes(options);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    fetchRoutes();
  }, []);

  const handleSearch = async () => {
    try {
      const organization_id = sessionStorage.getItem("organization_id") || 1;
      const branch_id = sessionStorage.getItem("branch_id") || 1;
      const batch_id = selectedSession?.value || "";
      const course_id = selectedCourse?.value || "";
      const department_id = selectedDepartment?.value || "";
      const academic_year_id = selectedAcademicYear?.value || "";
      const semester_id = selectedSemester?.value || "";
      const section_id = selectedSection?.value || "";
      const hostel_availed = ""; // true / false / empty

      // const url = `${ApiUrl.apiurl}StudentCourse/StudentCourseRecordFilter/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}&academic_year_id=${academic_year_id}&semester_id=${semester_id}&section_id=${section_id}&student_id=${studentId}&hostel_availed=${hostel_availed}`;

      let url = `${ApiUrl.apiurl}StudentCourse/StudentCourseRecordFilter/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}&academic_year_id=${academic_year_id}&semester_id=${semester_id}&section_id=${section_id}&hostel_availed=${hostel_availed}`;

      if (studentId) {
        url += `&student_id=${studentId}`;
      }

      console.log("SEARCH URL:", url);

      // const response = await fetch(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (result.message === "success!!") {
        setStudentCourseData(result.data);
      } else {
        setStudentCourseData([]);
      }
    } catch (error) {
      console.error("API Error:", error);
      setStudentCourseData([]);
    }
  };

  const handleOpenModal = async (student) => {
    setShowModal(true);
    setSelectedStudent(student);

    try {
      const organization_id = sessionStorage.getItem("organization_id") || 1;
      const branch_id = sessionStorage.getItem("branch_id") || 1;

      const url = `${ApiUrl.apiurl}StudentCourse/GetStudentDataBasedId/?student_id=${student.student_id}&branch_id=${branch_id}&organization_id=${organization_id}`;
      console.log("Fetching Edit Data:", url);

      // const response = await fetch(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (result.message === "Success") {
        setStudentTransportDetails(result.data);
      } else {
        setStudentTransportDetails(null);
      }
    } catch (error) {
      console.error("Error fetching edit data:", error);
      setStudentTransportDetails(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setStudentTransportDetails(null);
  };

  const refreshTable = () => {
    handleSearch(); // reload table data
  };

  useEffect(() => {
    handleSearch();
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
                STUDENT HOSTEL
              </p>
              <div className="row mb-2 mt-3 mx-0">
                <div className="col-12  d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handleClear}
                    style={{
                      width: "150px",
                    }}
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2 mt-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mb-3 mt-3">
                      <div className="col-12 col-md-3 ">
                        <label htmlFor="student-name" className="form-label">
                          Student Name
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            className="form-control detail"
                            placeholder="Enter student name"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn btn-primary ms-2 mb-0 mt-0"
                            onClick={handleShow}
                            style={{ width: "50px", padding: "3px" }}
                          >
                            ...
                          </button>
                        </div>
                      </div>

                      <ModalClass
                        show={show}
                        handleClose={handleClose}
                        onSelectStudent={handleSelectStudent}
                      />

                      {/* Session */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="session" className="form-label">
                          Session
                        </label>

                        <Select
                          id="session"
                          options={sessions}
                          className="detail"
                          value={selectedSession}
                          placeholder="Select Session"
                          classNamePrefix="react-select"
                          onChange={(selectedOption) => {
                            setSelectedSession(selectedOption);
                            handleSessionChange(selectedOption);
                          }}
                        />
                      </div>

                      {/* Course */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="admitted-course" className="form-label">
                          Course
                        </label>
                        <Select
                          className="detail"
                          id="admitted-course"
                          options={courses}
                          value={selectedCourse}
                          onChange={setSelectedCourse}
                          placeholder="Select Course"
                        />
                      </div>
                      {/* Branch */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="branch" className="form-label">
                          Branch
                        </label>
                        <Select
                          id="department"
                          className="detail"
                          options={departments}
                          value={selectedDepartment}
                          onChange={setSelectedDepartment}
                          placeholder="Select Department"
                        />
                      </div>
                      {/* Academic Year */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="session" className="form-label">
                          Academic Year
                        </label>

                        <Select
                          id="academic-year"
                          className="detail"
                          placeholder="Select Academic Year"
                          classNamePrefix="react-select"
                          options={academicYears}
                          value={selectedAcademicYear}
                          onChange={(option) => setSelectedAcademicYear(option)}
                        />
                      </div>
                      {/* Semester */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="semester" className="form-label">
                          Semester
                        </label>
                        <Select
                          id="semester"
                          className="detail"
                          placeholder="Select Semester"
                          classNamePrefix="react-select"
                          options={semesters}
                          value={selectedSemester}
                          onChange={(option) => setSelectedSemester(option)}
                        />
                      </div>
                      {/* Section */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="section" className="form-label">
                          Section
                        </label>
                        <Select
                          id="section"
                          className="detail"
                          options={sections}
                          value={selectedSection}
                          onChange={setSelectedSection}
                          placeholder="Select Section"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Student Name</th>
                        <th>ONMRC Registration No</th>
                        <th>Admission No.</th>
                        <th>Barcode</th>
                        <th>Session</th>
                        <th>Course</th>
                        <th>Department</th>
                        <th>Academic Year</th>
                        <th>Semester</th>
                        <th>Section</th>
                        <th>Father Name</th>
                        <th>Mother Name</th>
                        <th>Hostel Availed</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.length > 0 ? (
                        currentData.map((student, index) => (
                          <tr key={student.id}>
                            {/* <td>{index + 1}</td> */}
                            <td>{offset + index + 1}</td>
                            <td>{student.student_name}</td>
                            <td>{student.registration_no}</td>
                            <td>{student.college_admission_no}</td>
                            <td>{student.barcode}</td>
                            <td>{student.batch_code}</td>
                            <td>{student.course_name}</td>
                            <td>{student.department_code}</td>
                            <td>{student.academic_year_code}</td>
                            <td>{student.semester_name}</td>
                            <td>{student.section_name}</td>
                            <td>{student.father_name}</td>
                            <td>{student.mother_name}</td>
                            <td>{student.hostel_availed ? "Yes" : "No"}</td>
                            <td>
                              <a
                                href="#"
                                className="text-primary text-decoration-none"
                                onClick={() => handleOpenModal(student)}
                              >
                                Edit
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="14" className="text-center">
                            No Data Available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <HostelEdit
                    show={showModal}
                    handleClose={handleCloseModal}
                    studentData={selectedStudent}
                    transportDetails={studentTransportDetails}
                    routes={routes}
                    onUpdate={refreshTable}
                  />
                  {studentCourseData.length > itemsPerPage && (
                    <ReactPaginate
                      previousLabel="Previous"
                      nextLabel="Next"
                      breakLabel="..."
                      breakClassName="page-item"
                      breakLinkClassName="page-link"
                      pageCount={pageCount}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageClick}
                      containerClassName="pagination justify-content-center mt-3"
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      nextClassName="page-item"
                      nextLinkClassName="page-link"
                      activeClassName="active"
                      forcePage={currentPage} // ↩️ keeps highlight synced
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

export default AdmAttendanceEntry;
