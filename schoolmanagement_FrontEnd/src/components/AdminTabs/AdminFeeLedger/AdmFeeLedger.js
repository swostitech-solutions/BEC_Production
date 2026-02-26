
import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SelectStudentModal from "../AdminAttendanceEntry/SelectStudentModal";
import SelectStudentFeeModal from "../FeeStudentModal/SelectStudentFeeModal";
import useCourses from "../../hooks/useFetchClasses";
import Select from "react-select";
import * as XLSX from "xlsx";
import "jspdf-autotable";
// import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";

import { jsPDF } from "jspdf"; // Import jsPDF from npm package
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";


const AdmAttendanceEntry = () => {
  const navigate = useNavigate();

  // const [academicYearId, setAcademicYearId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sectionId, setSectionId] = useState(null);

  const [studentName, setStudentName] = useState("");
  const [classId, setClassId] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [statusData, setStatusData] = useState("");
  const [fromPeriod, setFromPeriod] = useState("");
  const [toPeriod, setToPeriod] = useState("");
  const [classOptions, setClassOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showBalanceFees, setShowBalanceFees] = useState(true);

  const [viewOption, setViewOption] = useState("viewReceipts");
  const [periodOptions, setPeriodOptions] = useState([]);

  const [isChecked, setIsChecked] = useState(true); // Default active
  const [showFees, setShowFees] = useState("F"); // Default to "Show All Students"
  const [report, setReport] = useState(null); // State to store selected report option

  const [isAllSelected, setIsAllSelected] = useState(false);
  const [feeAppFrom, setFeeAppFrom] = useState(null); // Update to store selected option
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // State for Academic Year dropdown
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  // const [studentId, setStudentId] = useState(null);

  const [selectedSession, setSelectedSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [studentDetails, setStudentDetails] = useState();
  const [selectedStudent, setSelectedStudent] = useState({
    name: "",
    barcode: "",
    admissionNo: "",
    fatherName: "",
    motherName: "",
    schoolAdmissionNo: "",
  });

  const itemsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(0);
  // Store fetched periods
  const pageCount = Math.ceil(tableData.length / itemsPerPage);

  const offset = currentPage * itemsPerPage;
  const currentItems = tableData.slice(offset, offset + itemsPerPage);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleClear = () => {
    // Student identity fields
    setStudentName("");
    setStudentId("");
    setSelectedStudent({
      name: "",
      barcode: "",
      admissionNo: "",
      fatherName: "",
      motherName: "",
      schoolAdmissionNo: "",
    });
    setStudentDetails(null);

    // RESET SESSION / COURSE / BRANCH / YEAR / SEMESTER / SECTION
    setSelectedSession(null);
    setSelectedSessionId(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);

    // RESET OTHER FIELDS
    setClassId(null);
    setSectionId(null);
    setStatusData("");
    setFromPeriod(null);
    setToPeriod(null);
    setReport(null);

    // RESET RADIO / CHECKBOX
    setShowFees("F");
    setIsChecked(true);
    setShowBalanceFees(true);
    setFeeAppFrom(null);

    // TABLE
    setTableData([]);
    setShowTable(false);

    // CHECKBOX SELECT ALL
    setIsAllSelected(false);
    setSelectedStudentIds([]);

    console.log("All fields cleared successfully");
  };

  const handleToggle = () => {
    setIsChecked((prev) => !prev); // Toggle the checked state
  };

  const statusOptions = [
    { value: "1", label: "ACTIVE" },
    { value: "0", label: "INACTIVE" },
  ];

  const reportOptions = [
    { value: "A", label: "Fee Due Receipt" },
    { value: "B", label: "Month wise Fee" },
    { value: "C", label: "Fee Balance" },
    { value: "D", label: "Fee Collection(Student Wise)" },
    { value: "E", label: "Fee Collection (Payment Type Wise)" },
    { value: "F", label: "Export To Excel" },
    { value: "G", label: "Fee Receipt Details" },
    // { value: "H", label: "Fee Details" },
  ];

  const handleRowCheckboxChange = (index) => {
    const updatedTableData = [...tableData];
    updatedTableData[index].isSelected = !updatedTableData[index].isSelected;
    setTableData(updatedTableData);

    // Update master checkbox state
    const allSelected = updatedTableData.every((item) => item.isSelected);
    setIsAllSelected(allSelected);

    // ⭐ Update selectedStudentIds
    const selectedIds = updatedTableData
      .filter((item) => item.isSelected)
      .map((item) => item.studentId);

    setSelectedStudentIds(selectedIds);
  };

  const handleMasterCheckboxChange = () => {
    const newSelectState = !isAllSelected;

    const updatedData = tableData.map((item) => ({
      ...item,
      isSelected: newSelectState,
    }));

    setTableData(updatedData);
    setIsAllSelected(newSelectState);

    //  Update selectedStudentIds
    const selectedIds = newSelectState
      ? updatedData.map((item) => item.studentId)
      : [];

    setSelectedStudentIds(selectedIds);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleSelectStudent = async (selectedStudent) => {
    try {
      // Extract student_id correctly from all possible sources
      const extractedId =
        selectedStudent?.fullData?.student ||
        selectedStudent?.studentBasicDetails?.student_id ||
        selectedStudent?.student_id ||
        selectedStudent?.student_id ||
        null;

      if (!extractedId) {
        console.error("No valid student ID found in selected student");
        return;
      }

      // Save ID to state
      setStudentId(String(extractedId));

      // Save to localStorage (if needed)
      localStorage.setItem(
        "selectedClubStudentId",
        JSON.stringify({ student_id: extractedId })
      );

      // Fetch full details
      await fetchStudentDetails(extractedId);

      handleCloseModal();
    } catch (error) {
      console.error("Error handling selected student:", error);
    }
  };

  const fetchStudentDetails = async (student_id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const organization_id = sessionStorage.getItem("organization_id");
      const branch_id = sessionStorage.getItem("branch_id");

      if (!student_id || !organization_id || !branch_id || !token) {
        console.error("Missing identifiers for fetching student data");
        return;
      }

      const url = `${ApiUrl.apiurl}StudentCourse/GetStudentDataBasedId/?student_id=${student_id}&branch_id=${branch_id}&organization_id=${organization_id}`;

      console.log("Fetching from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch student details");

      const result = await response.json();

      console.log("API Response:", result);

      if (result.message === "Success" && result.data) {
        const student = result.data;

        setStudentDetails(student);

        // ⭐ KEEP BACKEND VERIFIED STUDENT ID
        setStudentId(student.student_id?.toString() || "");

        setStudentName(student.student_name || "");
        setSelectedStudent({
          name: student.student_name || "",
          barcode: student.barcode || "",
          admissionNo: student.college_admission_no || "",
        });

        setSelectedSession({
          value: student.batch_id,
          label: student.batch,
        });

        setSelectedCourse({
          value: student.course_id,
          label: student.course_name,
        });

        setSelectedDepartment({
          value: student.department_id,
          label: student.department,
        });

        setSelectedAcademicYear({
          value: student.academic_year_id,
          label: student.academic_year,
        });

        setSelectedSemester({
          value: student.semester_id,
          label: student.semester_name,
        });

        setSelectedSection({
          value: student.section_id,
          label: student.section_name,
        });
      } else {
        console.warn("No data found for student_id:", student_id);
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
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
    const fetchPeriods = async () => {
      console.log("fetchPeriods Effect Triggered");

      const organization_id = sessionStorage.getItem("organization_id") || 1;
      const branch_id = sessionStorage.getItem("branch_id") || 1;

      //  Use proper logic: Only fetch if session/course/dept are selected.
      //  Do NOT default to hardcoded IDs like 24, 13, 11 etc.
      if (
        !selectedSession?.value ||
        !selectedCourse?.value ||
        !selectedDepartment?.value
      ) {
        setPeriodOptions([]); // clear if missing selections
        return;
      }

      const batch_id = selectedSession.value;
      const course_id = selectedCourse.value;
      const department_id = selectedDepartment.value;

      console.log(
        `Fetching Periods with: Org=${organization_id}, Branch=${branch_id}, Batch=${batch_id}, Course=${course_id}, Dept=${department_id}`
      );

      try {
        const response = await fetch(
          `${ApiUrl.apiurl}Semester/GetSemesterByDepartment/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}`
        );

        const result = await response.json();

        if (Array.isArray(result)) {
          console.log("Periods fetched:", result);
          const options = result.map((item) => ({
            value: item.id,
            label: item.semester_code, // Use semester_code as the label
          }));

          // Sort by ID ascending
          options.sort((a, b) => a.value - b.value);

          setPeriodOptions(options);
        } else {
          console.error("Unexpected response format:", result);
          setPeriodOptions([]);
        }
      } catch (error) {
        console.error("Error fetching semesters:", error);
        setPeriodOptions([]);
      }
    };

    fetchPeriods();
  }, [selectedSession, selectedCourse, selectedDepartment]);

  const handleSearch = async () => {
    const token = localStorage.getItem("accessToken");
    const organization_id = sessionStorage.getItem("organization_id");
    const branch_id = sessionStorage.getItem("branch_id");

    // Mandatory fields check
    if (!organization_id || !branch_id) {
      console.error("Organization ID and Branch ID are mandatory.");
      return;
    }

    // Build dynamic query parameters
    const params = new URLSearchParams();

    params.append("organization_id", organization_id);
    params.append("branch_id", branch_id);

    if (selectedSession?.value)
      params.append("batch_id", selectedSession.value);
    if (selectedCourse?.value) params.append("course_id", selectedCourse.value);
    if (selectedDepartment?.value)
      params.append("department_id", selectedDepartment.value);
    if (selectedSemester?.value)
      params.append("semester_id", selectedSemester.value);
    if (selectedSection?.value)
      params.append("section_id", selectedSection.value);
    if (studentId) params.append("student_id", studentId);
    if (statusData) params.append("status_data", statusData);
    if (fromPeriod) params.append("from_semester", fromPeriod);
    if (toPeriod) params.append("to_semester", toPeriod);
    if (report?.value) params.append("report", report.value);

    params.append("show_fees", showFees || "");
    if (showBalanceFees) params.append("show_balance_fees", true);

    const apiUrl = `${ApiUrl.apiurl
      }FeeLedger/GetFeeLedgerBasedOnCondition/?${params.toString()}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.message === "success!!") {
        const studentIds = result.data.map((student) => student.studentId);

        setSelectedStudentIds(studentIds);
        setTableData(result.data);
        setShowTable(true);
      } else {
        console.error("Failed to fetch data:", result.message);
        setSelectedStudentIds([]);
        setTableData([]);
        setShowTable(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setSelectedStudentIds([]);
      setTableData([]);
      setShowTable(false);
    }
  };

  const handlePrint = async () => {
    if (!report) {
      alert("Please select a valid report!");
      return;
    }

    const organization_id = sessionStorage.getItem("organization_id");
    const branch_id = sessionStorage.getItem("branch_id");
    const token = localStorage.getItem("accessToken");

    if (!organization_id || !branch_id || !token) {
      alert("Missing authentication or organization details!");
      return;
    }

    // ⭐ Extract student_id from selected rows
    const studentIds = tableData
      .filter((item) => item.isSelected)
      .map((item) => item.student_id || item.studentId)
      .filter(Boolean); // remove null/undefined

    console.log("Selected IDs =>", studentIds);

    // Report F does not require student ids
    if (!studentIds.length && report.value !== "F") {
      alert("Please select at least one student to print!");
      return;
    }

    const studentIdsParam = JSON.stringify(studentIds);

    const fee_due_from = fromPeriod || "";
    const fee_due_to = toPeriod || "";

    // Validation: Ensure valid periods are selected for reports that require them
    if (["A", "B", "C", "G"].includes(report.value)) {
      if (!fee_due_from || !fee_due_to) {
        alert(
          "Please select both 'Fee Due Period From' and 'Fee Due Period To' to generate this report."
        );
        return;
      }
    }

    try {
      let url = "";

      //  EXPORT WITHOUT API
      if (report.value === "F") {
        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        XLSX.writeFile(workbook, "ExportedReport.xlsx");
        alert("Report downloaded successfully!");
        return;
      }

      //  API URL SWITCH
      switch (report.value) {
        case "A":
          url = `${ApiUrl.apiurl}FeeLedger/GetStudentFeeDueReceiptStudentId/?organization_id=${organization_id}&branch_id=${branch_id}&studentIds=${encodeURIComponent(
            studentIdsParam
          )}&fee_applied_from=${fee_due_from}&fee_applied_to=${fee_due_to}`;
          break;

        case "B":
          url = `${ApiUrl.apiurl}FeeLedger/GetStudentSemesterWiseReceiptStudentId/?organization_id=${organization_id}&branch_id=${branch_id}&studentIds=${encodeURIComponent(
            studentIdsParam
          )}&fee_due_from=${fee_due_from}&fee_due_to=${fee_due_to}`;
          break;

        case "C":
          url = `${ApiUrl.apiurl}FeeLedger/GetStudentFeeBalanceReceiptStudentId/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${selectedSession?.value || ""
            }&course_id=${selectedCourse?.value || ""}&department_id=${selectedDepartment?.value || ""
            }&studentIds=${encodeURIComponent(
              studentIdsParam
            )}&fee_due_from=${fee_due_from}&fee_due_to=${fee_due_to}`;
          break;

        case "E":
          url = `${ApiUrl.apiurl}FeeLedger/GetStudentPaymentMethodWiseReceiptStudentId/?organization_id=${organization_id}&branch_id=${branch_id}&studentIds=${encodeURIComponent(
            studentIdsParam
          )}`;
          break;

        case "G":
          url = `${ApiUrl.apiurl}FeeLedger/GetStudentSemesterElementWiseReceiptStudentId/?organization_id=${organization_id}&branch_id=${branch_id}&studentIds=${encodeURIComponent(
            studentIdsParam
          )}&fee_due_from=${fee_due_from}&fee_due_to=${fee_due_to}`;
          break;

        default:
          alert("The selected report is not supported.");
          return;
      }

      // ⭐ FETCH WITH TOKEN
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data?.message === "success" && data?.data?.length) {
        const worksheet = XLSX.utils.json_to_sheet(data.data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        XLSX.writeFile(workbook, `${report.label}.xlsx`);
        alert("Report downloaded successfully!");
      } else {
        alert("No data found for the selected report.");
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      alert("Failed to fetch report data. Please try again.");
    }
  };

  const handleViewClick = async (academicYearId, studentId) => {
    const organization_id = sessionStorage.getItem("organization_id");
    const branch_id = sessionStorage.getItem("branch_id");

    if (!organization_id || !branch_id) {
      alert("Organization ID or Branch ID is missing!");
      return;
    }

    if (!studentId) {
      alert("Student ID not found.");
      return;
    }

    try {
      console.log("Fetching PDF data =>", {
        organization_id,
        branch_id,
        studentId,
      });

      const url = `${ApiUrl.apiurl}FeeLedger/GetStudentFeesDetailsPDFBasedOnStudentId/?organization_id=${organization_id}&branch_id=${branch_id}&student_id=${studentId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch data: ${errorMessage}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (result.message === "success" && result.data) {
        generatePDF(result.data);
      } else {
        alert("No data found to generate the PDF.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(`Error fetching data: ${error.message}`);
    }
  };

  // Convert image to Base64
  const toBase64 = (url) =>
    fetch(url)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          })
      );

  const generatePDF = async (data) => {
    const doc = new jsPDF("portrait", "mm", "a4");

    // Load Sparsh logo
    const sparshLogo = await toBase64("/Assets/sparsh.jpeg");

    // Image positioning
    const imgX = 10;
    const imgY = 10;
    const imgWidth = 20;
    const imgHeight = 20;

    // Add the logo
    try {
      doc.addImage(sparshLogo, "JPEG", imgX, imgY, imgWidth, imgHeight);
    } catch (error) {
      console.error("Error adding image:", error);
    }

    // ====== INSTITUTION HEADER (CENTERED) ======
    const pageWidth = doc.internal.pageSize.getWidth();
    const headerText = "Sparsh College of Nursing and Allied Sciences";

    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");

    // Center text according to actual width
    const textWidth =
      (doc.getStringUnitWidth(headerText) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;

    const textX = (pageWidth - textWidth) / 2;

    doc.text(headerText, textX, 22);

    // ========== STUDENT DETAILS TABLE ==========
    const studentDetails = [
      ["Student Name", data.studentname, "Session", data.session_code],
      ["Father Name", data.fathername, "Course", data.course_name],
      ["Mother Name", data.mothername, "Section", data.section_name],
      ["Admission No", data.admission_no, "Barcode", data.barcode],
    ];

    doc.autoTable({
      startY: 30,
      body: studentDetails,
      tableWidth: 180,
      didDrawCell: (cellData) => {
        doc.setDrawColor(0);
        doc.rect(
          cellData.cell.x,
          cellData.cell.y,
          cellData.cell.width,
          cellData.cell.height,
          "S"
        );
      },
    });

    // ========== FEE DETAILS ==========

    const feeDetails = data.feesdetails.map((fee) => [
      fee.semester_name,
      fee.element_name,
      fee.total_amount,
      fee.paid_amount,
      fee.remaining_amount,
    ]);

    // Totals rows
    const totalRows = [
      ["", "", "", "Total Fees", data.total_fees],
      ["", "", "", "Total Paid", data.total_paid],
      ["", "", "", "Total Discount", data.total_discount],
      ["", "", "", "Balance", data.remaining_amount],
    ];

    feeDetails.push(...totalRows);

    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 10,
      head: [["Fee Period", "Fee Element", "Total Amt.", "Paid", "Balance"]],
      body: feeDetails,
      tableWidth: 180,
      didDrawCell: (cellData) => {
        doc.setDrawColor(0);
        doc.rect(
          cellData.cell.x,
          cellData.cell.y,
          cellData.cell.width,
          cellData.cell.height,
          "S"
        );
      },
    });

    // Output the PDF
    const pdfBlob = doc.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, "_blank");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <p className="text-center fw-bold" style={{ fontSize: "20px" }}>
                STUDENT FEE LEDGER
              </p>

              {/* Button Group */}

              <div className="row mb-3 mt-3  mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
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
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handlePrint}
                  >
                    Print
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
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="row">
                    <div className="col-12 col-md-3 mb-3">
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
                          className="btn btn-primary ms-2"
                          onClick={handleOpenModal}
                          style={{ width: "50px", padding: "3px" }}
                        >
                          ...
                        </button>
                      </div>
                    </div>

                    <SelectStudentFeeModal
                      show={showModal}
                      handleClose={handleCloseModal}
                      onSelectStudent={handleSelectStudent}
                    />

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="session" className="form-label">
                        Session
                      </label>

                      <Select
                        id="session"
                        className="detail"
                        options={sessions}
                        value={selectedSession || null}
                        onChange={(selectedOption) => {
                          setSelectedSession(selectedOption);
                          handleSessionChange(selectedOption);
                        }}
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="admitted-course" className="form-label">
                        Course
                      </label>
                      <Select
                        className="detail"
                        id="admitted-course"
                        options={courses}
                        value={selectedCourse || null}
                        onChange={setSelectedCourse}
                        placeholder="Select Course"
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="branch" className="form-label">
                        Department
                      </label>
                      <Select
                        id="department"
                        className="detail"
                        options={departments}
                        value={selectedDepartment || null}
                        onChange={setSelectedDepartment}
                        placeholder="Select Department"
                      />
                    </div>

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
                        value={selectedAcademicYear || null}
                        // onChange={(option) => setSelectedAcademicYear(option)}
                        onChange={setSelectedAcademicYear}
                      />
                    </div>
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
                        // onChange={(option) => setSelectedSemester(option)}

                        onChange={setSelectedSemester}
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="section" className="form-label">
                        Section
                      </label>
                      <Select
                        id="section"
                        className="detail"
                        options={sections}
                        value={selectedSection || null}
                        onChange={setSelectedSection}
                        placeholder="Select Section"
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <Select
                        id="status"
                        options={statusOptions}
                        className="detail"
                        placeholder="Select Status"
                        classNamePrefix="react-select"
                        defaultValue={statusOptions.find(
                          (option) => option.value === "1"
                        )}
                        onChange={(selectedOption) => {
                          console.log("Selected Status: ", selectedOption);
                          setStatusData(
                            selectedOption ? selectedOption.value : ""
                          ); // Set selected value to state
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-3">
                      <label
                        htmlFor="fee-due-period-from"
                        className="form-label"
                      >
                        Fee Due Period From
                      </label>
                      <Select
                        classNamePrefix="react-select"
                        className="detail"
                        options={periodOptions}
                        placeholder="Select Period"
                        value={
                          periodOptions.find(
                            (opt) => opt.value === fromPeriod
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          setFromPeriod(
                            selectedOption ? selectedOption.value : null
                          )
                        }
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="fee-due-period-to" className="form-label">
                        Fee Due Period To
                      </label>
                      <Select
                        classNamePrefix="react-select"
                        className="detail"
                        options={periodOptions}
                        placeholder="Select Period"
                        value={
                          periodOptions.find((opt) => opt.value === toPeriod) ||
                          null
                        }
                        onChange={(selectedOption) =>
                          setToPeriod(
                            selectedOption ? selectedOption.value : null
                          )
                        }
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="report" className="form-label">
                        Report
                      </label>
                      <Select
                        id="report"
                        className="detail"
                        options={reportOptions}
                        placeholder="Select Report"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) => {
                          console.log("Selected Report: ", selectedOption);
                          setReport(selectedOption);
                        }}
                      />
                    </div>

                    {/* Radio Buttons Section */}
                    <div className="col-12 col-md-8 mb-3 mt-3">
                      <div
                        className="d-flex flex-wrap gap-3 justify-content-start align-items-start p-3"
                        style={{
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                        }}
                      >
                        <div className="form-check me-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                            value="F"
                            checked={showFees === "F"}
                            onChange={(e) => setShowFees(e.target.value)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault1"
                          >
                            Show Students With Fees
                          </label>
                        </div>

                        <div className="form-check me-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault2"
                            value="A"
                            checked={showFees === "A"}
                            onChange={(e) => setShowFees(e.target.value)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault2"
                          >
                            Show All Students
                          </label>
                        </div>

                        <div className="form-check me-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault3"
                            value="Z"
                            checked={showFees === "Z"}
                            onChange={(e) => setShowFees(e.target.value)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault3"
                          >
                            Show Students with Zero Fees Only
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-4 mb-1">
                      <div className="d-flex flex-row p-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="flexRadioDefault"
                            id="flexRadioDefault4"
                            checked={showBalanceFees} // Bind state to checkbox
                            onChange={(e) =>
                              setShowBalanceFees(e.target.checked)
                            } // Update state on toggle
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault4"
                          >
                            Show Students with Balance Fees
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              {/* Table */}
              {showTable && (
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>Admission No</th>
                          <th>BarCode</th>
                          <th>Course</th>
                          <th>Section</th>
                          <th>Father Name</th>
                          <th>Mother Name</th>
                          <th>Total Fees</th>
                          <th>Fees Paid</th>
                          <th>Discount</th>
                          <th>Balance</th>
                          <th>View</th>
                          <th>
                            Print
                            <br />
                            <input
                              type="checkbox"
                              checked={isAllSelected}
                              onChange={handleMasterCheckboxChange}
                            />
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {currentItems.length > 0 ? (
                          currentItems.map((item, index) => (
                            <tr key={offset + index}>
                              <td>{item.student_name}</td>
                              <td>{item.college_admission_no}</td>
                              <td>{item.barcode}</td>
                              <td>{item.course_name}</td>
                              <td>{item.section_name}</td>
                              <td>{item.fatherName}</td>
                              <td>{item.motherName}</td>
                              <td>{item.total_fees}</td>
                              <td>{item.total_paid}</td>
                              <td>{item.discount_fees}</td>
                              <td>{item.remaining_fees}</td>
                              <td>
                                <button
                                  className="btn btn-link"
                                  onClick={() =>
                                    handleViewClick(
                                      item.academic_year_id,
                                      item.studentId
                                    )
                                  }
                                >
                                  View
                                </button>
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={item.isSelected || false}
                                  onChange={() =>
                                    handleRowCheckboxChange(offset + index)
                                  }
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="13" className="text-center">
                              No data found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    {tableData.length > itemsPerPage && (
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
                        containerClassName="pagination justify-content-center mt-3"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        activeClassName="active"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmAttendanceEntry;