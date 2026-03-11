import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import ReactPaginate from "react-paginate";

const SelectStudentModal = ({ show, handleClose, onSelectStudent }) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [students, setStudents] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  // const [studentData, setStudentData] = useState([]);
  const [fullStudentData, setFullStudentData] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [sections, setSections] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [filters, setFilters] = useState({
    studentName: "",
    admissionNo: "",
    barcode: "",
    classId: "",
    section: "",
    fatherName: "",
    motherName: "",
    schoolAdmissionNo: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const offset = currentPage * itemsPerPage;
  const currentItems = studentData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(studentData.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Reset to first page when student data changes
  useEffect(() => {
    setCurrentPage(0);
  }, [studentData]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
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
  }, [selectedSession, selectedCourse, selectedDepartment, selectedAcademicYear]);



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
              item.section_name || item.section_description || "Unnamed Section",
          }));
          setSections(sectionOptions);
          console.log("Mapped Sections:", sectionOptions);
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          const sectionOptions = result.data.map((item) => ({
            value: item.id || item.section_id,
            label:
              item.section_name || item.section_description || "Unnamed Section",
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

  const handleSearch = useCallback(async () => {
    try {
      const organization_id = sessionStorage.getItem("organization_id");
      const branch_id = sessionStorage.getItem("branch_id");
      const token = localStorage.getItem("accessToken");

      if (!organization_id || !branch_id) {
        console.error("Missing organization_id or branch_id in session storage");
        return;
      }

      if (!token) {
        console.error("Missing access token in local storage");
        return;
      }

      const params = new URLSearchParams({
        organization_id,
        branch_id,
        student_name: filters.studentName || "",
        admission_no: filters.admissionNo || "",
        barcode: filters.barcode || "",
        student_id: filters.studentId || "",
        batch_id: selectedSession?.value || "",
        course_id: selectedCourse?.value || "",
        department_id: selectedDepartment?.value || "",
        academic_year_id: selectedAcademicYear?.value || "",
        semester_id: selectedSemester?.value || "",
        section_id: selectedSection?.value || "",
      });

      const url = `${
        ApiUrl.apiurl
      }StudentCourse/StudentCourseRecordFilter/?${params.toString()}`;
      console.log("Fetching student records from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, //  Pass token here
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch student data");

      const result = await response.json();
      if (result.message === "success!!" && Array.isArray(result.data)) {
        const mappedStudents = result.data.map((student) => ({
          id: student.id,
          studentBasicDetails: {
            id: student.student_id,
            student_name: student.student_name || "",
            registration_no: student.registration_no || "",
            enrollment_no: student.college_admission_no || "",
            batch_code: student.batch_code || "",
            course_name: student.course_name || "",
            department_code: student.department_code || "",
            academic_year_code: student.academic_year_code || "",
            semester_name: student.semester_name || "",
            section_name: student.section_name || "",
            father_name: student.father_name || "",
            mother_name: student.mother_name || "",
            barcode: student.barcode || "",
          },
          fullData: student,
        }));

        setStudentData(mappedStudents);
        setShowTable(true);
      } else {
        console.warn("No student data found or invalid response format");
        setStudentData([]);
        setShowTable(true);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setShowTable(true);
    }
  }, [selectedSession, selectedCourse, selectedDepartment, selectedAcademicYear, selectedSemester, selectedSection, filters]);

  // Debounced search when student name input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.studentName && filters.studentName.trim() !== "") {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.studentName, handleSearch]);

  const handleSelectStudent = (student) => {
    console.log(" Selected student object:", student);

    // Extract both IDs directly from fullData or top-level student object
    const recordId =
      student?.fullData?.id ||
      student?.id ||
      student?.studentBasicDetails?.recordId ||
      null;

    const studentId =
      student?.fullData?.student_id || student?.studentBasicDetails?.id || null;

    // Validation
    if (!recordId || !studentId) {
      console.error(" Missing recordId or studentId:", { recordId, studentId });
      return;
    }

    //  Store both IDs in localStorage
    localStorage.setItem("selectedClubRecordId", String(recordId));
    localStorage.setItem("selectedClubStudentId", String(studentId));

    console.log(" Stored successfully:", {
      selectedClubRecordId: recordId,
      selectedClubStudentId: studentId,
    });

    //  Notify parent (optional)
    if (onSelectStudent) {
      onSelectStudent(student.fullData || student);
    }

    //  Close modal
    handleClose();
  };






const handleClearFilters = () => {
  // Reset filter input fields
  setFilters({
    studentName: "",
    admissionNo: "",
    barcode: "",
    studentId: "",
    classId: "",
    section: "",
    fatherName: "",
    motherName: "",
    schoolAdmissionNo: "",
  });

  // Reset dropdown selections
  setSelectedClass("");
  setSelectedSection("");
  setSelectedAcademicYear(null);
  setSelectedSemester(null);
  setSelectedSession(null);
  setSelectedCourse(null);
  setSelectedDepartment(null);
  setSelectedSessionId(null);

  // Reset dependent dropdown lists (optional)
  setSemesters([]);
  setSections([]);
  setSessions([]);
  setCourses([]);
  setDepartments([]);
  setAcademicYears([]);

  // Reset student table data
  setStudentData(fullStudentData); // full list back
  setShowTable(false); // hide table after clearing (optional)

  // Reset students fetch status
  setStudentError("");
  setStudentLoading(false);
};


  return (
    <Modal
      show={show}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onClick={handleClose}></Modal.Header>
      <Modal.Body>
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
                    STUDENT SEARCH
                  </p>
                  <div className="row mb-2">
                    <div className="col-12  d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-primary me-2"
                        style={{ width: "150px" }}
                        onClick={handleSearch}
                      >
                        Search
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        style={{ width: "150px" }}
                        onClick={handleClearFilters}
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger me-2"
                        style={{ width: "150px" }}
                        onClick={handleClose}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                  {/* Search Fields */}
                  <div className="row mt-3">
                    <div className="col-12 col-md-3 mb-2">
                      <label
                        htmlFor="school-admission-no"
                        className="form-label"
                      >
                        Student Name
                      </label>
                      <input
                        type="text"
                        name="studentName"
                        value={filters.studentName}
                        onChange={handleInputChange}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                        className="form-control detail"
                        placeholder="Student Name"
                        style={{ height: "38px", padding: "0.375rem 0.75rem" }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label
                        htmlFor="school-admission-no"
                        className="form-label"
                      >
                        Admission No
                      </label>
                      <input
                        type="text"
                        name="admissionNo"
                        value={filters.admissionNo}
                        onChange={handleInputChange}
                        className="form-control detail"
                        placeholder="Admission No"
                        style={{ height: "38px", padding: "0.375rem 0.75rem" }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label
                        htmlFor="school-admission-no"
                        className="form-label"
                      >
                        Student Barcode
                      </label>
                      <input
                        type="text"
                        name="barcode"
                        value={filters.barcode}
                        onChange={handleInputChange}
                        className="form-control detail"
                        placeholder="Student Barcode"
                        style={{ height: "38px", padding: "0.375rem 0.75rem" }} // Inline style to set height and padding
                      />
                    </div>

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
                        Department
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
                  </div>
                  <div className="row mt-3">
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
                    <div className="col-12 col-md-3 mb-2">
                      <label
                        htmlFor="school-admission-no"
                        className="form-label"
                      >
                        Father's Name
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        className="form-control detail"
                        placeholder="Father's Name"
                        style={{ height: "38px", padding: "0.375rem 0.75rem" }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label
                        htmlFor="school-admission-no"
                        className="form-label"
                      >
                        Mother's Name
                      </label>
                      <input
                        type="text"
                        name="motherName"
                        className="form-control detail"
                        placeholder="Mother's Name"
                        style={{ height: "38px", padding: "0.375rem 0.75rem" }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label
                        htmlFor="school-admission-no"
                        className="form-label"
                      >
                        College Admission No
                      </label>
                      <input
                        type="text"
                        name="schoolAdmissionNo"
                        className="form-control detail"
                        placeholder="College Admission No"
                        style={{ height: "38px", padding: "0.375rem 0.75rem" }}
                      />
                    </div>
                  </div>

                  {/* Students Table */}
                  {showTable && (
                    <>
                      <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped">
                          <thead>
                            <tr>
                              <th>Student Name</th>
                              <th>ONMRC Registration No</th>
                              <th>Admission No</th>
                              <th>Session</th>
                              <th>Course</th>
                              <th>Department</th>
                              <th>Academic Year</th>
                              <th>Semester</th>
                              <th>Section</th>
                              <th>Father Name</th>
                              <th>Mother Name</th>
                              <th>Student Barcode</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentData.length > 0 ? (
                              currentItems.map((student, index) => {
                                const s = student.studentBasicDetails;
                                return (
                                  <tr key={offset + index}>
                                    <td>{s.student_name}</td>
                                    <td>{s.registration_no }</td>
                                    <td>{s.enrollment_no}</td>
                                    <td>{s.batch_code}</td>
                                    <td>{s.course_name}</td>
                                    <td>{s.department_code}</td>
                                    <td>{s.academic_year_code}</td>
                                    <td>{s.semester_name}</td>
                                    <td>{s.section_name}</td>
                                    <td>{s.father_name}</td>
                                    <td>{s.mother_name}</td>
                                    <td>{s.barcode}</td>
                                    <td>
                                      <input
                                        type="radio"
                                        name="selectedStudent"
                                        onChange={() =>
                                          handleSelectStudent(student)
                                        }
                                      />
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="13" className="text-center">
                                  No student data found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {pageCount > 1 && (
                        <div className="d-flex justify-content-center mt-3">
                          <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            breakLabel={"..."}
                            breakClassName={"page-item"}
                            breakLinkClassName={"page-link"}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination justify-content-center"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            activeClassName={"active"}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SelectStudentModal;