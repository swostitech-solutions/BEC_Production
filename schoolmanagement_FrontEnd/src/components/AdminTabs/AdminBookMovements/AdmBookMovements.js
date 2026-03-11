
import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import SelectStudentModal from "../AdminAttendanceEntry/SelectStudentModal";
import SelectStaffModal from "./SelectStaffModal ";
import useFetchBookCategories from "../../hooks/useFetchBookCategories";
import useFetchBookSubCategories from "../../hooks/useFetchBookSubCategories";
import { ApiUrl } from "../../../ApiUrl";
import ReactPaginate from "react-paginate";

const AdmBookMovements = () => {
  const [showModal, setShowModal] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const [bookCategory, setBookCategory] = useState("");
  const [bookSubCategory, setBookSubCategory] = useState("");
  const { subCategories } = useFetchBookSubCategories(bookCategory);
  const { categories } = useFetchBookCategories();
  const [classId, setClassId] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [addNo, setAddno] = useState("");
  const [barCode, setBarCode] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [bookBarcode, setBookBarcode] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const dateRef = useRef(null);
  const bookTitleRef = useRef(null);
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const [searchResults, setSearchResults] = useState([]);
  const [flag, setFlag] = useState("A");
  const [selectedReturns, setSelectedReturns] = useState({});
  const [penaltyAmount, setPenaltyAmount] = useState(0);
  const [employeeName, setEmployeeName] = useState([]);
  const [employeeId, setEmployeeId] = useState([]);
  const [academicyearId, setacAdemicyearId] = useState("A");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // New state variables for API-driven dropdowns (cascading)
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [sections, setSections] = useState([]);

  const offset = currentPage * itemsPerPage;
  const currentItems = searchResults.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(searchResults.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  // or any number you prefer

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name, // Label for display
  }));
  // Map sub-categories to React Select options
  const subCategoryOptions = subCategories.map((subCategory) => ({
    value: subCategory.id,
    label: subCategory.name, // Label for display
  }));


  // Handle category change
  const handleCategoryChange = (selectedOption) => {
    const selectedCategoryId = selectedOption ? selectedOption.value : null;
    setBookCategory(selectedCategoryId); // Update selected category
    setBookSubCategory(null); // Reset sub-category when category changes
    console.log("Selected Category Value:", selectedCategoryId);
  };
  // Handle sub-category change
  const handleSubCategoryChange = (selectedOption) => {
    setBookSubCategory(selectedOption ? selectedOption.value : null); // Update selected sub-category
    console.log("Selected Sub Category Value:", selectedOption?.value);
  };

  const handleClear = () => {
    setEmployeeName("");
    setEmployeeId("");
    setStudentName("");
    setStudentId("");
    setClassId(null);
    setSectionId(null);
    setAddno("");
    setBarCode("");
    setBookCategory("");
    setBookSubCategory(null);
    setBookTitle("");
    setBookBarcode("");
    setIssueDate("");
    setReturnDate("");
    setSearchResults([]);
    setSelectedReturns({});
    setReturnDates({});
    // Reset cascading dropdowns
    setSelectedSession(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
    // Clearing the input fields manually if needed
    if (dateRef.current) {
      dateRef.current.value = "";
    }
  };
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleClose = () => {
    navigate("/admin/dashboard");
  };
  // select Student =========================================
  const handleSelectStudent = (selectedStudent) => {
    const studentData = selectedStudent.studentBasicDetails || selectedStudent;
    const fullName = [
      studentData.first_name || "",
      studentData.middle_name || "",
      studentData.last_name || "",
    ]
      .filter(Boolean)
      .join(" ");

    // Set studentId when selecting a student (this will trigger the search)
    setStudentId(studentData.id || "");
    setStudentName(fullName);
    setClassId(studentData.addmitted_class || studentData.course_id || null);
    setSectionId(studentData.addmitted_section || studentData.section_id || null);
    setAddno(studentData.college_admission_no || studentData.school_admission_no || "");
    setBarCode(studentData.barcode || studentData.college_admission_no || "");

    handleCloseModal();
  };


  // Fetch Sessions (Batch) on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const branch_id = sessionStorage.getItem("branch_id");
        const organization_id = sessionStorage.getItem("organization_id");

        if (!branch_id || !organization_id) {
          console.error("Branch ID or Organization ID not found in session storage.");
          return;
        }

        const response = await fetch(
          `${ApiUrl.apiurl}Batch/GetBatch/?organization_id=${organization_id}&branch_id=${branch_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
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
            label: item.batch_description || item.batch_code || `Batch ${item.id}`,
          }));
          setSessions(sessionOptions);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  // Fetch Courses when Session changes
  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedSession?.value) {
        setCourses([]);
        return;
      }

      try {
        const token = sessionStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value;

        if (!organization_id || !branch_id || !batch_id) {
          console.warn("Missing required parameters for courses");
          return;
        }

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
        } else {
          console.error("Unexpected API response format:", data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [selectedSession]);

  // Fetch Departments when Session and Course change
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!selectedSession?.value || !selectedCourse?.value) {
        setDepartments([]);
        return;
      }

      try {
        const token = sessionStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value;
        const course_id = selectedCourse.value;

        if (!token || !organization_id || !branch_id) {
          console.warn("Missing required identifiers");
          return;
        }

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
          throw new Error(`Network response not ok: ${response.status}`);
        }

        const result = await response.json();

        if (Array.isArray(result)) {
          const departmentOptions = result.map((item) => ({
            value: item.id || item.department_id,
            label: item.department_name || item.description || item.department_description || "Unnamed Department",
          }));
          setDepartments(departmentOptions);
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          const departmentOptions = result.data.map((item) => ({
            value: item.id || item.department_id,
            label: item.department_name || item.description || item.department_description || "Unnamed Department",
          }));
          setDepartments(departmentOptions);
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

  // Fetch Academic Years when Session, Course, and Department change
  useEffect(() => {
    const fetchAcademicYears = async () => {
      if (!selectedSession?.value || !selectedCourse?.value || !selectedDepartment?.value) {
        setAcademicYears([]);
        return;
      }

      try {
        const token = sessionStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value;
        const course_id = selectedCourse.value;
        const department_id = selectedDepartment.value;

        if (!token || !organization_id || !branch_id) {
          console.warn("Missing required parameters");
          return;
        }

        const url = `${ApiUrl.apiurl}AcademicYear/GetAcademicYear/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Network response not ok: ${response.status}`);
        }

        const result = await response.json();

        if (Array.isArray(result)) {
          const options = result.map((item) => ({
            value: item.id || item.academic_year_id,
            label: item.academic_year_description || item.academic_year_code || "Unnamed Year",
          }));
          setAcademicYears(options);
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          const options = result.data.map((item) => ({
            value: item.id || item.academic_year_id,
            label: item.academic_year_description || item.academic_year_code || "Unnamed Year",
          }));
          setAcademicYears(options);
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

  // Fetch Semesters when Session, Course, Department, and Academic Year change
  useEffect(() => {
    const fetchSemesters = async () => {
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
        const token = sessionStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");

        const url = `${ApiUrl.apiurl}Semester/GetSemester/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${selectedSession.value}&course_id=${selectedCourse.value}&department_id=${selectedDepartment.value}&academic_year_id=${selectedAcademicYear.value}`;

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (Array.isArray(result)) {
          setSemesters(
            result.map((item) => ({
              value: item.id,
              label: item.semester_description || item.semester_code,
            }))
          );
        } else {
          setSemesters([]);
        }
      } catch (error) {
        console.error("Error fetching semesters:", error);
        setSemesters([]);
      }
    };

    fetchSemesters();
  }, [selectedSession, selectedCourse, selectedDepartment, selectedAcademicYear]);

  // Fetch Sections when all above dropdowns are selected
  useEffect(() => {
    const fetchSections = async () => {
      if (
        !selectedSession?.value ||
        !selectedCourse?.value ||
        !selectedDepartment?.value ||
        !selectedAcademicYear?.value ||
        !selectedSemester?.value
      ) {
        setSections([]);
        return;
      }

      try {
        const token = sessionStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value;
        const course_id = selectedCourse.value;
        const department_id = selectedDepartment.value;
        const academic_year_id = selectedAcademicYear.value;
        const semester_id = selectedSemester.value;

        if (!token || !organization_id || !branch_id) {
          console.warn("Missing required identifiers");
          return;
        }

        const url = `${ApiUrl.apiurl}Section/GetSection/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}&academic_year_id=${academic_year_id}&semester_id=${semester_id}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Network response not ok: ${response.status}`);
        }

        const result = await response.json();

        if (Array.isArray(result)) {
          const sectionOptions = result.map((item) => ({
            value: item.id || item.section_id,
            label: item.section_name || item.section_description || "Unnamed Section",
          }));
          setSections(sectionOptions);
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          const sectionOptions = result.data.map((item) => ({
            value: item.id || item.section_id,
            label: item.section_name || item.section_description || "Unnamed Section",
          }));
          setSections(sectionOptions);
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
  }, [selectedSession, selectedCourse, selectedDepartment, selectedAcademicYear, selectedSemester]);

  useEffect(() => {
    handleAllSearch(); // Fetch initial data when component mounts
  }, [flag]);

  const handleSelectEmployee = (selectedEmployee) => {
    console.log("Selected Employee:", selectedEmployee);

    setEmployeeId(selectedEmployee.id || "");
    setEmployeeName(selectedEmployee.employeeName);
  };

  const academicId = sessionStorage.getItem("academicSessionId") || "1";
  // GetIssueReturnSearchList Api Call
  const handleAllSearch = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        console.error("Access token not found in sessionStorage.");
        alert("Unauthorized: Missing access token.");
        return;
      }
      let queryParams = [];
      // Map frontend field names to backend API parameter names
      if (employeeId) queryParams.push(`professor_id=${employeeId}`);
      if (studentId) queryParams.push(`student_id=${studentId}`);
      // Use cascading dropdown values if available, otherwise use student-selected values
      const courseId = selectedCourse?.value || classId;
      const sectionIdValue = selectedSection?.value || sectionId;
      if (courseId) queryParams.push(`course_id=${courseId}`);
      if (sectionIdValue) queryParams.push(`section_id=${sectionIdValue}`);
      if (selectedDepartment?.value) queryParams.push(`department_id=${selectedDepartment.value}`);
      if (selectedSemester?.value) queryParams.push(`semester_id=${selectedSemester.value}`);
      if (bookTitle) queryParams.push(`book_title=${bookTitle}`);
      if (bookCategory) queryParams.push(`category_id=${bookCategory}`);
      if (bookSubCategory) queryParams.push(`subcategory_id=${bookSubCategory}`);
      if (issueDate) queryParams.push(`issue_date=${issueDate}`);
      if (returnDate) queryParams.push(`return_date=${returnDate}`);
      if (bookBarcode) queryParams.push(`book_barcode_no=${bookBarcode}`);
      if (flag) queryParams.push(`flag=${flag}`);
      // Use cascading academic year if selected, otherwise use session storage
      const academicYearId = selectedAcademicYear?.value || academicId;
      queryParams.push(`academic_year_id=${academicYearId}`);
      // Construct the API URL
      const apiUrl = `${ApiUrl.apiurl
        }ISSUEBOOK/BOOKISSUESEARCHLIST/?${queryParams.join("&")}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.message === "success") {
        setSearchResults(data.data); // Update the table with filtered results
        setPenaltyAmount(data.Penality_amount); // Update penalty amount
      } else {
        console.log("No records found for the given criteria.");
        setSearchResults([]); // Clear table if no data is found
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert("Error fetching data. Please try again.");
    }
  };
  // Trigger search when the student name is entered
  const handleStudentNameChange = (e) => {
    setStudentName(e.target.value);
    // If student name is entered, trigger the search with studentId
    if (e.target.value && studentId) {
      handleAllSearch();
    } else {
      // Clear the search results if the input is empty or studentId is not set
      setSearchResults([]);
    }
  };
  // Penalty
  const calculatePenalty = (dueDate, returnDate) => {
    if (!dueDate || !returnDate) return 0;

    const due = new Date(dueDate);
    const ret = new Date(returnDate);

    if (ret <= due) return null; // No penalty if returned on or before due date

    const diffDays = Math.ceil((ret - due) / (1000 * 60 * 60 * 24));
    return diffDays * penaltyAmount;
  };
  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Book Return Function
  const [returnDates, setReturnDates] = useState({});
  const userId = sessionStorage.getItem("userId");
  const academicYearId = sessionStorage.getItem("academicSessionId") || "1";
  const orgId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");
  // Handle checkbox change
  const handleCheckboxChange = (index) => {
    setSelectedReturns((prev) => {
      const newSelectedReturns = { ...prev, [index]: !prev[index] };
      // If checkbox is checked, set the current date by default
      if (newSelectedReturns[index]) {
        setReturnDates((prevDates) => ({
          ...prevDates,
          [index]: getCurrentDate(),
        }));
      } else {
        setReturnDates((prevDates) => {
          const updatedDates = { ...prevDates };
          delete updatedDates[index]; // Remove return date if unchecked
          return updatedDates;
        });
      }
      return newSelectedReturns;
    });
  };

  // Handle return date input
  const handleReturnDateChange = (index, value) => {
    const formattedDate = new Date(value).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
    setReturnDates((prev) => ({
      ...prev,
      [index]: formattedDate,
    }));
  };

  const handleReturnBooks = async () => {
    const selectedBooks = searchResults
      .map((item, index) => {
        if (selectedReturns[index] && returnDates[index]) {
          // Calculate penalty only for students, not for teachers
          // Penalty is only applied if professor_id is null (i.e., it's a student)
          const penalty = !item.professor_id
            ? calculatePenalty(item.due_date, returnDates[index])
            : null;

          return {
            studentId: item.student_id || null,
            tracherId: item.professor_id || null, // Note: backend expects 'tracherId' (with typo)
            bookIssuedId: item.book_issue_id,
            return_date: returnDates[index],
            returned_by: parseInt(userId),
            penalty_amount: penalty && penalty > 0 ? penalty : null,
          };
        }
        return null;
      })
      .filter((book) => book !== null);

    if (selectedBooks.length === 0) {
      alert("Please select a book and enter a return date to proceed further.");
      return;
    }

    const requestBody = {
      ReturnBooks: selectedBooks,
      academic_year_id: parseInt(academicYearId),
      organization_id: parseInt(orgId),
      branch_id: parseInt(branchId),
    };

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        alert("Unauthorized: Missing access token.");
        return;
      }
      const response = await fetch(`${ApiUrl.apiurl}ISSUEBOOK/BOOKRETURN/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.message === "Success") {
        alert("Books returned successfully!");
        // Reset selections
        setSelectedReturns({});
        setReturnDates({});
        handleAllSearch(); // Refresh table with latest search parameters
      } else {
        alert(data.message || "Failed to return books. Please try again.");
      }
    } catch (error) {
      console.error("Error returning books:", error);
      alert("An error occurred. Please try again.");
    }
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
                BOOK MOVEMENTS
              </p>
              <div className="row mb-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleAllSearch}
                  >
                    Search
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
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={() => navigate("/issue-page")}
                  >
                    Issue
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleReturnBooks}
                  >
                    Return
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row p-2 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mb-4">
                      <div
                        className="col-12 col-md-3 mb-1"
                        style={{ minWidth: "250px" }}
                      >
                        <label htmlFor="student-name" className="form-label">
                          Student Name
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            className="form-control detail"
                            placeholder="Enter student name"
                            value={studentName}
                            onChange={handleStudentNameChange}
                            style={{ width: "100%" }}
                            disabled
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
                        <SelectStudentModal
                          show={showModal}
                          handleClose={handleCloseModal}
                          onSelectStudent={handleSelectStudent}
                        />
                      </div>

                      <div
                        className="col-12 col-md-3 mb-1"
                        style={{ minWidth: "250px" }}
                      >
                        <label htmlFor="teacher-name" className="form-label">
                          Teacher Name
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="teacher-name"
                            className="form-control detail"
                            value={employeeName}
                            placeholder="Enter teacher name"
                            disabled
                            style={{ width: "100%" }}
                          />
                          <button
                            type="button"
                            className="btn btn-primary ms-2 mb-0 mt-0"
                            onClick={openModal}
                            style={{ width: "50px", padding: "3px" }}
                          >
                            ...
                          </button>
                          <SelectStaffModal
                            isVisible={isModalVisible}
                            onClose={closeModal}
                            onSelectEmployee={handleSelectEmployee}
                          />
                        </div>
                      </div>

                      <div
                        className="col-12 col-md-3 mb-1"
                        style={{ minWidth: "250px" }}
                      >
                        <label htmlFor="admission-no" className="form-label">
                          College Admission No
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="admission-no"
                            className="form-control detail"
                            value={addNo}
                            placeholder="Enter college admission no"
                            disabled
                            style={{ width: "100%" }}
                          />
                        </div>
                      </div>

                      <div
                        className="col-12 col-md-3 mb-1"
                        style={{ minWidth: "250px" }}
                      >
                        <label htmlFor="student-barcode" className="form-label">
                          Student Barcode
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="student-barcode"
                            className="form-control detail"
                            value={barCode}
                            placeholder="Enter student barcode"
                            disabled
                            style={{ width: "100%" }}
                          />
                        </div>
                      </div>

                      {/* Session Dropdown */}
                      <div className="col-md-3" style={{ minWidth: "250px" }}>
                        <label style={{ fontWeight: "700" }}>Session</label>
                        <Select
                          options={sessions}
                          className="detail"
                          placeholder="Select Session"
                          value={selectedSession}
                          onChange={(option) => {
                            setSelectedSession(option);
                            setSelectedCourse(null);
                            setSelectedDepartment(null);
                            setSelectedAcademicYear(null);
                            setSelectedSemester(null);
                            setSelectedSection(null);
                          }}
                          styles={{
                            control: (base) => ({ ...base, width: "100%" }),
                          }}
                        />
                      </div>

                      {/* Course Dropdown */}
                      <div className="col-md-3" style={{ minWidth: "250px" }}>
                        <label style={{ fontWeight: "700" }}>Course</label>
                        <Select
                          options={courses}
                          className="detail"
                          placeholder="Select Course"
                          value={selectedCourse}
                          onChange={(option) => {
                            setSelectedCourse(option);
                            setSelectedDepartment(null);
                            setSelectedAcademicYear(null);
                            setSelectedSemester(null);
                            setSelectedSection(null);
                          }}
                          isDisabled={!selectedSession}
                          styles={{
                            control: (base) => ({ ...base, width: "100%" }),
                          }}
                        />
                      </div>

                      {/* Department Dropdown */}
                      <div className="col-md-3" style={{ minWidth: "250px" }}>
                        <label style={{ fontWeight: "700" }}>Department</label>
                        <Select
                          options={departments}
                          className="detail"
                          isClearable
                          placeholder="Select Department"
                          value={selectedDepartment}
                          onChange={(option) => {
                            setSelectedDepartment(option);
                            setSelectedAcademicYear(null);
                            setSelectedSemester(null);
                            setSelectedSection(null);
                          }}
                          isDisabled={!selectedCourse}
                          styles={{
                            control: (base) => ({ ...base, width: "100%" }),
                          }}
                        />
                      </div>

                      {/* Academic Year Dropdown */}
                      <div className="col-md-3" style={{ minWidth: "250px" }}>
                        <label style={{ fontWeight: "700" }}>Academic Year</label>
                        <Select
                          options={academicYears}
                          className="detail"
                          isClearable
                          placeholder="Select Academic Year"
                          value={selectedAcademicYear}
                          onChange={(option) => {
                            setSelectedAcademicYear(option);
                            setSelectedSemester(null);
                            setSelectedSection(null);
                          }}
                          isDisabled={!selectedDepartment}
                          styles={{
                            control: (base) => ({ ...base, width: "100%" }),
                          }}
                        />
                      </div>

                      {/* Semester Dropdown */}
                      <div className="col-md-3" style={{ minWidth: "250px" }}>
                        <label style={{ fontWeight: "700" }}>Semester</label>
                        <Select
                          options={semesters}
                          className="detail"
                          isClearable
                          placeholder="Select Semester"
                          value={selectedSemester}
                          onChange={(option) => {
                            setSelectedSemester(option);
                            setSelectedSection(null);
                          }}
                          isDisabled={!selectedAcademicYear}
                          styles={{
                            control: (base) => ({ ...base, width: "100%" }),
                          }}
                        />
                      </div>

                      {/* Section Dropdown */}
                      <div className="col-md-3" style={{ minWidth: "250px" }}>
                        <label style={{ fontWeight: "700" }}>Section</label>
                        <Select
                          options={sections}
                          className="detail"
                          isClearable
                          placeholder="Select Section"
                          value={selectedSection}
                          onChange={setSelectedSection}
                          isDisabled={!selectedSemester}
                          styles={{
                            control: (base) => ({ ...base, width: "100%" }),
                          }}
                        />
                      </div>

                      <div
                        className="col-12 col-md-3 mb-1"
                        style={{ minWidth: "250px" }}
                      >
                        <label htmlFor="book-title" className="form-label">
                          Book Title
                        </label>
                        <input
                          type="text"
                          id="book-title"
                          className="form-control detail"
                          placeholder="Enter book title"
                          ref={bookTitleRef}
                          value={bookTitle}
                          onChange={(e) => setBookTitle(e.target.value)}
                          style={{ width: "100%" }}
                        />
                      </div>

                      <div
                        className="col-12 col-md-3 mb-1"
                        style={{ minWidth: "250px" }}
                      >
                        <label
                          htmlFor="book-accession-no"
                          className="form-label"
                        >
                          Book Accession No
                        </label>
                        <input
                          type="text"
                          id="book-accession-no"
                          className="form-control detail"
                          placeholder="Enter book accession no"
                          value={bookBarcode}
                          onChange={(e) => setBookBarcode(e.target.value)}
                          style={{ width: "100%" }}
                        />
                      </div>

                      <div
                        className="col-12 col-md-3 mb-0"
                        style={{ minWidth: "250px" }}
                      >
                        <label htmlFor="category" className="form-label">
                          Category
                        </label>
                        <Select
                          id="category"
                          options={categoryOptions}
                          onChange={handleCategoryChange}
                          placeholder="Select Category"
                          className="detail"
                          // classNamePrefix="react-select-category"
                          value={
                            bookCategory
                              ? categoryOptions.find(
                                (option) => option.value === bookCategory
                              )
                              : null
                          }
                          styles={{
                            control: (base) => ({ ...base, width: "100%" }),
                          }}
                        />
                      </div>

                      <div
                        className="col-12 col-md-3 mb-0"
                        style={{ minWidth: "250px" }}
                      >
                        <label htmlFor="sub-category" className="form-label">
                          Sub Category
                        </label>
                        <Select
                          id="sub-category"
                          options={subCategoryOptions}
                          onChange={handleSubCategoryChange}
                          placeholder={
                            subCategoryOptions.length
                              ? "Select Sub Category"
                              : "No Sub Categories Available"
                          }
                          // classNamePrefix="react-select-sub-category"
                          className="detail"
                          value={
                            bookSubCategory
                              ? subCategoryOptions.find(
                                (option) => option.value === bookSubCategory
                              )
                              : null
                          }
                          isDisabled={!subCategoryOptions.length}
                          styles={{
                            control: (base) => ({
                              ...base,
                              width: "100%",
                              fontSize: "13px",
                            }),
                          }}
                        />
                      </div>

                      <div
                        className="col-12 col-md-3 mb-2"
                        style={{ minWidth: "250px" }}
                      >
                        <label htmlFor="issue-date" className="form-label">
                          Issue Date
                        </label>
                        <input
                          type="date"
                          id="issue-date"
                          className="form-control detail"
                          ref={dateRef}
                          value={issueDate}
                          onChange={(e) => setIssueDate(e.target.value)}
                          style={{ width: "100%" }}
                        />
                      </div>

                      <div
                        className="col-12 col-md-3 mb-2"
                        style={{ minWidth: "250px" }}
                      >
                        <label htmlFor="return-date" className="form-label">
                          Return Date
                        </label>
                        <input
                          type="date"
                          id="return-date"
                          className="form-control detail"
                          ref={dateRef}
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          style={{ width: "100%" }}
                        />
                      </div>

                      <div className="d-flex align-items-center me-2">
                        <div className="form-check me-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="viewAttendanceType"
                            id="viewIssued"
                            value="I"
                            checked={flag === "I"}
                            onChange={(e) => setFlag(e.target.value)}
                            onClick={handleAllSearch}
                          />
                          <label
                            className="form-check-label ms-1"
                            htmlFor="viewIssued"
                          >
                            Issued
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="viewAttendanceType"
                            id="viewAll"
                            value="A"
                            checked={flag === "A"}
                            onChange={(e) => setFlag(e.target.value)}
                            onClick={handleAllSearch}
                          />
                          <label
                            className="form-check-label ms-1"
                            htmlFor="viewAll"
                          >
                            All
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row p-2 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="table-responsive mt-3">
                    <table
                      responsive
                      className="table table-bordered"
                    >
                      <thead className="thead-dark">
                        <tr>
                          <th>Sr No</th>
                          <th>Name</th>
                          <th>College Admission No</th>
                          <th>Student BarCode</th>
                          <th>Course</th>
                          <th>Section</th>
                          <th>Book</th>
                          <th>Book Accession No</th>
                          <th>Issue Date</th>
                          <th>Issued By</th>
                          <th>Due Date</th>
                          <th>Return Date</th>
                          <th>Returned By</th>
                          <th>Select</th>
                          <th>Return</th>
                          <th>Penalty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResults.length > 0 ? (
                          currentItems.map((item, index) => {
                            const isReturned = !!item.return_date;
                            const returnDateValue = returnDates[offset + index];
                            const isChecked = !!selectedReturns[offset + index];
                            // Calculate penalty only for students, not for teachers
                            const penalty = isChecked && !item.professor_id
                              ? calculatePenalty(item.due_date, returnDateValue)
                              : "";
                            // Handle both student and professor responses
                            const displayName = item.name || item.professor_name || "";
                            const admissionNo = item.college_admission_no || "";
                            const studentBarcode = item.student_barcode || "";
                            const courseName = item.course_name || "";
                            const sectionName = item.section_name || "";
                            const bookName = item.bookName || item.book_name || "";
                            return (
                              <tr key={index}>
                                <td>{offset + index + 1}</td>
                                <td>{displayName}</td>
                                <td>{admissionNo}</td>
                                <td>{studentBarcode}</td>
                                <td>{courseName}</td>
                                <td>{sectionName}</td>
                                <td>{bookName}</td>
                                <td>{item.barcode}</td>
                                <td>
                                  {item.issue_date
                                    ? new Date(item.issue_date)
                                      .toISOString()
                                      .split("T")[0]
                                      .split("-")
                                      .reverse()
                                      .join("-")
                                    : ""}
                                </td>
                                <td>{displayName || ""}</td>
                                <td>
                                  {item.due_date
                                    ? new Date(item.due_date)
                                      .toISOString()
                                      .split("T")[0]
                                      .split("-")
                                      .reverse()
                                      .join("-")
                                    : ""}
                                </td>
                                <td>
                                  {item.return_date
                                    ? new Date(item.return_date)
                                      .toISOString()
                                      .split("T")[0]
                                      .split("-")
                                      .reverse()
                                      .join("-")
                                    : ""}
                                </td>
                                <td>{isReturned ? (displayName || "") : ""}</td>
                                <td>
                                  <input
                                    type="checkbox"
                                    name="bookSelect"
                                    checked={!!selectedReturns[offset + index]}
                                    onChange={() => handleCheckboxChange(offset + index)}
                                    disabled={isReturned}
                                  />
                                </td>
                                <td>
                                  {!isReturned && (
                                    <input
                                      type="date"
                                      value={returnDateValue || ""}
                                      onChange={(e) =>
                                        handleReturnDateChange(
                                          offset + index,
                                          e.target.value
                                        )
                                      }
                                      max={getCurrentDate()}
                                    />
                                  )}
                                </td>
                                <td>{penalty}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="16" className="text-center">
                              No records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmBookMovements;
