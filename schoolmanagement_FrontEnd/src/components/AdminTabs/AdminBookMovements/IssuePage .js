import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Table, Button, Form } from "react-bootstrap";
import AdmBook from "../AdminBookBarcode/AdmBook";
import { ApiUrl } from "../../../ApiUrl";
import SelectStudentModal from "../AdminAttendanceEntry/SelectStudentModal";
import SelectStaffModal from "./SelectStaffModal ";
import SelectBookSearch from "./SelectBookSearch";

const IssuePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const [isStudentModalVisible, setStudentModalVisible] = useState(false);

  // Issue Book
  const handleIssueBook = async () => {
    const token = sessionStorage.getItem("accessToken");
    // Get the academic year ID from:
    // 1. Selected student's data (most accurate)
    // 2. Selected academic year dropdown
    // 3. Session storage as fallback
    const academicYearId = selectedStudentData?.academic_year
      || selectedAcademicYear?.value
      || sessionStorage.getItem("academicSessionId")
      || localStorage.getItem("academicSessionId");
    const createdBy = sessionStorage.getItem("userId");
    const issueDateValue = document.getElementById("issue-date")?.value || ""; // Get issue date from input
    const storedStudentId = sessionStorage.getItem("studentId");

    if (!token) {
      alert("Unauthorized: Missing access token.");
      return;
    }

    // Get book barcode IDs from rows that have books selected
    const bookBarcodeIds = rows
      .filter((row) => row.bookCode && row.bookBarcodeId) // Only include rows with books selected
      .map((row) => row.bookBarcodeId);

    // Check if we're issuing to student or staff
    // Note: employeeId might be an array or string, so check properly
    const hasStudent = storedStudentId && storedStudentId !== "";
    const hasStaff = employeeId && employeeId !== "" && (!Array.isArray(employeeId) || employeeId.length > 0);
    const issuingToStudent = hasStudent;
    const issuingToStaff = hasStaff;

    if (!academicYearId || !createdBy || !issueDateValue || bookBarcodeIds.length === 0) {
      console.log("academicYearId", academicYearId, "createdBy", createdBy, "issueDateValue", issueDateValue, "bookBarcodeIds", bookBarcodeIds);
      alert("Please fill all required fields before issuing books."
      );
      return;
    }

    if (!hasStudent && !hasStaff) {
      alert("Please select either a student or a teacher to issue books.");
      return;
    }

    // Frontend validation: Check if any book has 0 available copies
    const booksWithNoAvailability = rows.filter(
      (row) => row.bookBarcodeId && row.availableCopies === 0
    );

    if (booksWithNoAvailability.length > 0) {
      const bookNames = booksWithNoAvailability.map((row) => row.bookName).join(", ");
      alert(`Cannot issue books with no available copies: ${bookNames}`);
      return;
    }

    // Use snake_case field names to match backend API
    const requestBody = {
      academic_year_id: Number(academicYearId),
      staff_id: hasStaff ? Number(employeeId) : null,
      student_id: hasStudent ? Number(storedStudentId) : null,
      issue_date: issueDateValue,
      issues_book_details: bookBarcodeIds,
      created_by: Number(createdBy),
      issued_by: Number(createdBy),
    };

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}ISSUEBOOK/BOOKISSUE_CREATE/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      if (data.message === "success") {
        alert("Books issued successfully!");
        handleCloseModals();
        sessionStorage.removeItem("studentId");
      } else {
        // Display detailed error message from backend
        const errorMsg = data.error || data.message || "Failed to issue books";
        alert(`Error: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error issuing books:", error);
      alert("An error occurred while issuing books. Please try again.");
    }
  };

  const handleCloseModals = () => {
    navigate("/admin/book-movements");
  };
  const addNewRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        bookBarcodeId: null, // Actual book barcode ID from database
        bookCode: "",
        bookName: "",
        barcode: "",
        categoryName: "",
        subcategoryName: "",
        availableCopies: undefined,
        totalCopies: undefined,
      },
    ]);
  };
  const deleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };
  const handleInputChange = (id, event) => {
    const { name, value } = event.target;
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [name]: value } : row))
    );
  };
  const dateRef = useRef(null);
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (dateRef.current) {
      dateRef.current.value = today; // Set default value to current date
      dateRef.current.max = today; // Restrict future dates
    }
  }, []);
  const handleClear = () => {
    // Clear student data
    setStudentName("");
    setStudentId("");
    setAddno("");
    setBarCode("");
    setSelectedStudentData(null);

    // Clear employee/staff data
    setEmployeeId([]);
    setEmployeeName([]);

    // Clear session storage
    sessionStorage.removeItem("studentId");

    // Clear cascading dropdowns
    setSelectedSession(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);

    // Clear options
    setCourses([]);
    setDepartments([]);
    setAcademicYears([]);
    setSemesters([]);
    setSections([]);

    // Reset book rows to initial state
    setRows(
      Array.from({ length: 6 }, (_, index) => ({
        id: index + 1,
        bookBarcodeId: null,
        bookCode: "",
        bookName: "",
        barcode: "",
        categoryName: "",
        subcategoryName: "",
        availableCopies: undefined,
        totalCopies: undefined,
      }))
    );

    // Reset issue date to today
    const today = new Date().toISOString().split("T")[0];
    if (dateRef.current) {
      dateRef.current.value = today;
    }
  };
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  // Book List Modal
  const [rows, setRows] = useState(
    Array.from({ length: 6 }, (_, index) => ({
      id: index + 1,
      bookBarcodeId: null, // Actual book barcode ID from database
      bookCode: "",
      bookName: "",
      barcode: "",
      categoryName: "",
      subcategoryName: "",
      availableCopies: undefined,
      totalCopies: undefined,
    }))
  );
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const handleBookSelection = (selectedBook) => {
    const { id, bookCode, bookName, barcode, categoryName, subcategoryName, bookBarcodeStatus, availableCopies, totalCopies, isAvailable } =
      selectedBook;

    console.log("=== SELECTED BOOK FROM MODAL ===", selectedBook);

    // Just pass the book to the row - backend will validate on submit
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === selectedRowId
          ? {
            ...row,
            bookBarcodeId: id, // Store the actual book barcode ID from database
            bookCode: bookCode || "",
            bookName: bookName || "",
            barcode: barcode || "",
            categoryName: categoryName || "",
            subcategoryName: subcategoryName || "",
            availableCopies: availableCopies,
            totalCopies: totalCopies,
          }
          : row
      )
    );
    setShowBookModal(false); // Close modal after selection
  };
  const handleBarcodeChange = async (e, rowId) => {
    const enteredBarcode = e.target.value;

    // Update barcode field while typing
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId ? { ...row, barcode: enteredBarcode } : row
      )
    );

    if (enteredBarcode.trim() === "") return; // Prevent API call if input is empty

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        console.error("Access token not found in sessionStorage.");
        return;
      }
      const response = await fetch(
        `${ApiUrl.apiurl}LIBRARYBOOK/GetAllBooksDetails?barcodeNo=${enteredBarcode}&onlyAvailable=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      console.log("=== FULL API Response ===", data);

      if (data.message === "success" && data.data && data.data.length > 0) {
        const matchedBook = data.data[0]; // Assuming the response data contains a single book object

        console.log("=== Matched Book ===", matchedBook);

        if (matchedBook) {
          // Check if book is available (both 'Available' and 'ACTIVE' are valid)
          const validStatuses = ['Available', 'ACTIVE'];
          console.log("bookBarcodeStatus:", matchedBook.bookBarcodeStatus);
          console.log("validStatuses:", validStatuses);
          console.log("includes check:", validStatuses.includes(matchedBook.bookBarcodeStatus));

          if (!validStatuses.includes(matchedBook.bookBarcodeStatus)) {
            alert(`Book "${matchedBook.bookName}" (Barcode: ${matchedBook.barcode}) is not available for issue.`);
            // Clear the row
            setRows((prevRows) =>
              prevRows.map((row) =>
                row.id === rowId
                  ? {
                    ...row,
                    bookBarcodeId: null,
                    barcode: "",
                    bookCode: "",
                    bookName: "",
                    categoryName: "",
                    subcategoryName: "",
                  }
                  : row
              )
            );
            return;
          }

          // Check if available copies exist
          if (matchedBook.availableCopies === 0) {
            alert(`No available copies for book "${matchedBook.bookName}". All ${matchedBook.totalCopies} copies are currently issued.`);
            // Clear the row
            setRows((prevRows) =>
              prevRows.map((row) =>
                row.id === rowId
                  ? {
                    ...row,
                    bookBarcodeId: null,
                    barcode: "",
                    bookCode: "",
                    bookName: "",
                    categoryName: "",
                    subcategoryName: "",
                  }
                  : row
              )
            );
            return;
          }

          setRows((prevRows) =>
            prevRows.map((row) =>
              row.id === rowId
                ? {
                  ...row,
                  bookBarcodeId: matchedBook.id, // Store the actual book barcode ID
                  barcode: matchedBook.barcode || enteredBarcode,
                  bookCode: matchedBook.bookCode || "",
                  bookName: matchedBook.bookName || "",
                  categoryName: matchedBook.categoryName || "",
                  subcategoryName: matchedBook.subcategoryName || "",
                  availableCopies: matchedBook.availableCopies || 0,
                  totalCopies: matchedBook.totalCopies || 0,
                }
                : row
            )
          );
        }
      } else {
        console.log("=== No book found or API error ===");
        console.log("Message:", data.message);
        console.log("Data length:", data.data ? data.data.length : "No data");
        alert(`Book with barcode ${enteredBarcode} not found.`);
        // Clear the row
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === rowId
              ? {
                ...row,
                bookBarcodeId: null,
                barcode: "",
                bookCode: "",
                bookName: "",
                categoryName: "",
                subcategoryName: "",
              }
              : row
          )
        );
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
      alert("Error fetching book data. Please try again.");
    }
  };
  const handleOpenBookModal = (rowId) => {
    setSelectedRowId(rowId);
    setShowBookModal(true);
  };
  const handleCloseBookModal = () => {
    setShowBookModal(false);
  };

  // select Student =========================================
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [addNo, setAddno] = useState("");
  const [barCode, setBarCode] = useState("");
  const [employeeId, setEmployeeId] = useState([]);
  const [employeeName, setEmployeeName] = useState([]);

  // Cascading dropdown states (like AdmFeeStructure)
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  const [selectedStudentData, setSelectedStudentData] = useState(null);

  const handleSelectStudent = (selectedStudent) => {
    const fullName = [
      selectedStudent.studentBasicDetails.first_name || "",
      selectedStudent.studentBasicDetails.middle_name || "",
      selectedStudent.studentBasicDetails.last_name || "",
    ]
      .filter(Boolean)
      .join(" ");

    const studentId = selectedStudent.studentBasicDetails.id || "";
    setStudentId(studentId);
    sessionStorage.setItem("studentId", studentId);
    setStudentName(fullName);
    setAddno(selectedStudent.studentBasicDetails.school_admission_no || selectedStudent.studentBasicDetails.college_admission_no || null);
    setBarCode(selectedStudent.studentBasicDetails.barcode || selectedStudent.studentBasicDetails.college_admission_no || null);

    // Store student data to populate dropdowns
    setSelectedStudentData(selectedStudent.studentBasicDetails);

    handleCloseModal();
  };

  // Effect to populate dropdowns when student is selected and options are available
  useEffect(() => {
    if (!selectedStudentData) return;

    const studentDetails = selectedStudentData;

    // Set Session (Batch)
    if (studentDetails.batch && sessions.length > 0) {
      const matchedSession = sessions.find(s => s.value === studentDetails.batch);
      if (matchedSession && (!selectedSession || selectedSession.value !== matchedSession.value)) {
        setSelectedSession(matchedSession);
      }
    }

    // Set Course (needs session to be selected first, so it will be handled by next effect)
  }, [selectedStudentData, sessions]);

  // Effect to set Course after Session is selected
  useEffect(() => {
    if (!selectedStudentData || !selectedSession) return;

    if (selectedStudentData.course && courses.length > 0) {
      const matchedCourse = courses.find(c => c.value === selectedStudentData.course);
      if (matchedCourse && (!selectedCourse || selectedCourse.value !== matchedCourse.value)) {
        setSelectedCourse(matchedCourse);
      }
    }
  }, [selectedStudentData, selectedSession, courses]);

  // Effect to set Department after Course is selected
  useEffect(() => {
    if (!selectedStudentData || !selectedCourse) return;

    if (selectedStudentData.department && departments.length > 0) {
      const matchedDepartment = departments.find(d => d.value === selectedStudentData.department);
      if (matchedDepartment && (!selectedDepartment || selectedDepartment.value !== matchedDepartment.value)) {
        setSelectedDepartment(matchedDepartment);
      }
    }
  }, [selectedStudentData, selectedCourse, departments]);

  // Effect to set Academic Year after Department is selected
  useEffect(() => {
    if (!selectedStudentData || !selectedDepartment) return;

    if (selectedStudentData.academic_year && academicYears.length > 0) {
      const matchedAcademicYear = academicYears.find(ay => ay.value === selectedStudentData.academic_year);
      if (matchedAcademicYear && (!selectedAcademicYear || selectedAcademicYear.value !== matchedAcademicYear.value)) {
        setSelectedAcademicYear(matchedAcademicYear);
      }
    }
  }, [selectedStudentData, selectedDepartment, academicYears]);

  // Effect to set Semester after Academic Year is selected
  useEffect(() => {
    if (!selectedStudentData || !selectedAcademicYear) return;

    if (selectedStudentData.semester && semesters.length > 0) {
      const matchedSemester = semesters.find(s => s.value === selectedStudentData.semester);
      if (matchedSemester && (!selectedSemester || selectedSemester.value !== matchedSemester.value)) {
        setSelectedSemester(matchedSemester);
      }
    }
  }, [selectedStudentData, selectedAcademicYear, semesters]);

  // Effect to set Section after Semester is selected
  useEffect(() => {
    if (!selectedStudentData || !selectedSemester) return;

    if (selectedStudentData.section && sections.length > 0) {
      const matchedSection = sections.find(s => s.value === selectedStudentData.section);
      if (matchedSection && (!selectedSection || selectedSection.value !== matchedSection.value)) {
        setSelectedSection(matchedSection);
      }
    }
  }, [selectedStudentData, selectedSemester, sections]);
  const handleSelectEmployee = (selectedEmployee) => {
    console.log("Selected Employee:", selectedEmployee);

    setEmployeeId(selectedEmployee.id || "");
    setEmployeeName(selectedEmployee.employeeName);
  };
  // Fetch Sessions (Batch) on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
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

  // Fetch Courses when Session is selected
  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedSession?.value) {
        setCourses([]);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value;

        if (!organization_id || !branch_id || !batch_id) {
          console.warn("Missing required parameters");
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

  // Fetch Departments when Session and Course are selected
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!selectedSession?.value || !selectedCourse?.value) {
        setDepartments([]);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
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
          setDepartments([]);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, [selectedSession, selectedCourse]);

  // Fetch Academic Years when Session, Course, and Department are selected
  useEffect(() => {
    const fetchAcademicYears = async () => {
      if (!selectedSession?.value || !selectedCourse?.value || !selectedDepartment?.value) {
        setAcademicYears([]);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
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
          setAcademicYears([]);
        }
      } catch (error) {
        console.error("Error fetching academic years:", error);
        setAcademicYears([]);
      }
    };

    fetchAcademicYears();
  }, [selectedSession, selectedCourse, selectedDepartment]);

  // Fetch Semesters when Session, Course, Department, and Academic Year are selected
  useEffect(() => {
    const fetchSemesters = async () => {
      if (!selectedSession?.value || !selectedCourse?.value || !selectedDepartment?.value || !selectedAcademicYear?.value) {
        setSemesters([]);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
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

  // Fetch Sections when all dependencies are selected
  useEffect(() => {
    const fetchSections = async () => {
      if (!selectedSession?.value || !selectedCourse?.value || !selectedDepartment?.value || !selectedAcademicYear?.value || !selectedSemester?.value) {
        setSections([]);
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
            value: item.id,
            label: item.section_name || item.section_description || "Unnamed Section",
          }));
          setSections(sectionOptions);
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          const sectionOptions = result.data.map((item) => ({
            value: item.id,
            label: item.section_name || item.section_description || "Unnamed Section",
          }));
          setSections(sectionOptions);
        } else {
          setSections([]);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        setSections([]);
      }
    };

    fetchSections();
  }, [selectedSession, selectedCourse, selectedDepartment, selectedAcademicYear, selectedSemester]);

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
                BOOK ISSUE
              </p>
              <div className="row mb-2 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleIssueBook}
                  >
                    Issue Book
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
                    onClick={handleCloseModals}
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mb-3 ">
                      <div className="col-12 col-md-3 mb-3 ">
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
                            onClick={handleOpenModal}
                            style={{ width: "50px", padding: "3px" }}
                          >
                            ...
                          </button>
                        </div>
                      </div>
                      <SelectStudentModal
                        show={showModal}
                        handleClose={handleCloseModal}
                        onSelectStudent={handleSelectStudent}
                      />
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="teacher-name" className="form-label">
                          Teacher Name
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="teacher-name"
                            value={employeeName}
                            className="form-control detail"
                            placeholder="Enter teacher name"
                          />
                          <Button
                            type="button"
                            className="btn btn-primary ms-2 mb-0 mt-0"
                            onClick={openModal}
                            style={{ width: "50px", padding: "3px" }}
                          >
                            ...
                          </Button>
                        </div>
                        <SelectStaffModal
                          isVisible={isModalVisible}
                          onClose={closeModal}
                          onSelectEmployee={handleSelectEmployee}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="admission-no" className="form-label">
                          Admission No
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="admission-no"
                            className="form-control detail"
                            value={addNo}
                            placeholder="Enter admission no"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-3 mb-1">
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
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <label htmlFor="session" className="form-label">
                          Session
                        </label>
                        <Select
                          options={sessions}
                          className="detail"
                          classNamePrefix="react-select"
                          placeholder="Select Session"
                          value={selectedSession}
                          onChange={(selectedOption) => {
                            setSelectedSession(selectedOption);
                            // Reset dependent dropdowns
                            setSelectedCourse(null);
                            setSelectedDepartment(null);
                            setSelectedAcademicYear(null);
                            setSelectedSemester(null);
                            setSelectedSection(null);
                          }}
                        />
                      </div>
                      <div className="col-md-3">
                        <label htmlFor="course" className="form-label">
                          Course
                        </label>
                        <Select
                          options={courses}
                          className="detail"
                          classNamePrefix="react-select"
                          placeholder="Select Course"
                          value={selectedCourse}
                          isDisabled={!selectedSession}
                          onChange={(selectedOption) => {
                            setSelectedCourse(selectedOption);
                            // Reset dependent dropdowns
                            setSelectedDepartment(null);
                            setSelectedAcademicYear(null);
                            setSelectedSemester(null);
                            setSelectedSection(null);
                          }}
                        />
                      </div>
                      <div className="col-md-3">
                        <label htmlFor="department" className="form-label">
                          Department
                        </label>
                        <Select
                          options={departments}
                          className="detail"
                          classNamePrefix="react-select"
                          placeholder="Select Department"
                          value={selectedDepartment}
                          isDisabled={!selectedCourse}
                          onChange={(selectedOption) => {
                            setSelectedDepartment(selectedOption);
                            // Reset dependent dropdowns
                            setSelectedAcademicYear(null);
                            setSelectedSemester(null);
                            setSelectedSection(null);
                          }}
                        />
                      </div>
                      <div className="col-md-3">
                        <label htmlFor="academic-year" className="form-label">
                          Academic Year
                        </label>
                        <Select
                          options={academicYears}
                          className="detail"
                          classNamePrefix="react-select"
                          placeholder="Select Academic Year"
                          value={selectedAcademicYear}
                          isDisabled={!selectedDepartment}
                          onChange={(selectedOption) => {
                            setSelectedAcademicYear(selectedOption);
                            // Reset dependent dropdowns
                            setSelectedSemester(null);
                            setSelectedSection(null);
                          }}
                        />
                      </div>
                      <div className="col-md-3">
                        <label htmlFor="semester" className="form-label">
                          Semester
                        </label>
                        <Select
                          options={semesters}
                          className="detail"
                          classNamePrefix="react-select"
                          placeholder="Select Semester"
                          value={selectedSemester}
                          isDisabled={!selectedAcademicYear}
                          onChange={(selectedOption) => {
                            setSelectedSemester(selectedOption);
                            // Reset dependent dropdowns
                            setSelectedSection(null);
                          }}
                        />
                      </div>
                      <div className="col-md-3">
                        <label htmlFor="section" className="form-label">
                          Section
                        </label>
                        <Select
                          options={sections}
                          className="detail"
                          classNamePrefix="react-select"
                          isClearable={true}
                          placeholder="Select Section"
                          value={selectedSection}
                          isDisabled={!selectedSemester}
                          onChange={(selectedOption) => {
                            setSelectedSection(selectedOption);
                          }}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="issue-date" className="form-label">
                          Issue Date
                        </label>
                        <input
                          type="date"
                          id="issue-date"
                          className="form-control detail"
                          ref={dateRef}
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
                        <th>Sr No</th>
                        <th>Book Code</th>
                        <th>Book Name</th>
                        <th>Book Accession No</th>
                        <th>Category</th>
                        <th>Sub-Category</th>
                        <th>Available Copies</th>
                        <th>Delete</th>
                        <th>Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={row.id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Form.Control
                                type="text"
                                name="bookCode"
                                className="form-control detail me-2"
                                value={row.bookCode}
                              // onChange={(e) => updateBookCode(row.id, e)}
                              // className="me-2"
                              />
                              <button
                                type="button"
                                className="btn btn-primary mb-0 mt-0"
                                onClick={() => handleOpenBookModal(row.id)}
                                style={{ width: "50px", padding: "3px" }}
                              >
                                ...
                              </button>
                            </div>
                            <AdmBook
                              show={showBookModal}
                              handleClose={handleCloseBookModal}
                              selectedRowId={selectedRowId}
                              onSelectBook={handleBookSelection}
                              onlyAvailable={true}
                            />
                          </td>

                          <td>
                            <Form.Control
                              type="text"
                              className="form-control detail"
                              name="bookName"
                              value={row.bookName}
                              onChange={(e) => handleInputChange(row.id, e)}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              className="form-control detail"
                              name="bookAccessionNo"
                              value={row.barcode}
                              onChange={(e) => handleBarcodeChange(e, row.id)}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              name="category"
                              className="form-control detail"
                              value={row.categoryName}
                              onChange={(e) => handleInputChange(row.id, e)}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              className="form-control detail"
                              name="subCategory"
                              value={row.subcategoryName}
                              onChange={(e) => handleInputChange(row.id, e)}
                            />
                          </td>
                          <td>
                            {row.availableCopies !== undefined && row.totalCopies !== undefined && row.bookBarcodeId ? (
                              <span className={row.availableCopies > 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                                {row.availableCopies} / {row.totalCopies}
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            <Button
                              variant="link"
                              onClick={() => deleteRow(row.id)}
                            >
                              Delete
                            </Button>
                          </td>
                          <td>{ }</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-end">
                  <Button variant="primary" onClick={addNewRow}>
                    Add New Row
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuePage;
