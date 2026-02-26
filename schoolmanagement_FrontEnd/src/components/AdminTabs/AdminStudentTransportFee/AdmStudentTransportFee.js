import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form } from "react-bootstrap";
// import SelectStudentModal from "../AdminAttendanceEntry/SelectStudentModal";
import { ApiUrl } from "../../../ApiUrl";
import SelectStudentFeeModal from "../FeeStudentModal/SelectStudentFeeModal";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactPaginate from "react-paginate";

const AdmAttendanceEntry = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [classId, setClassId] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [selectedFeePeriod, setSelectedFeePeriod] = useState("");
  const [feePeriod, setFeePeriod] = useState(null);
  const [showUnpaid, setShowUnpaid] = useState(false);
  const [transportData, setTransportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pickupPoint, setPickupPoint] = useState(null);
  const [pickupPoints, setPickupPoints] = useState([]);
  const orgId = localStorage.getItem("orgId");
  const branchId = localStorage.getItem("branchId");
  const academicyearId = localStorage.getItem("academicSessionId");
  const [showUnpaidFee, setShowUnpaidFee] = useState(false);
    // State for Academic Year dropdown
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
       const [studentDetails, setStudentDetails] = useState(null); 
        const [selectedStudent, setSelectedStudent] = useState({
           name: "",
           barcode: "",
           admissionNo: "",
           fatherName: "",
           motherName: "",
           schoolAdmissionNo: "",
         });
 const handleClear = () => {
   // Basic Student Filters
   setStudentId("");
   setStudentName("");
   setSelectedStudent({
     name: "",
     barcode: "",
     admissionNo: "",
     fatherName: "",
     motherName: "",
     schoolAdmissionNo: "",
   });

   // Class / Section
   setClassId(null);
   setSectionId(null);

   // Fee / Transport
   setSelectedFeePeriod("");
   setFeePeriod(null);
   setPickupPoint(null);
   setPickupPoints([]);
   setTransportData([]);
   setShowUnpaid(false);
   setShowUnpaidFee(false);

   // Academic Year & Other Dropdown Levels
   setSelectedAcademicYear(null);
   setAcademicYears([]);
   setSelectedSemester(null);
   setSemesters([]);
   setSelectedSection(null);
   setSections([]);
   setSelectedSession(null);
   setSessions([]);
   setSelectedCourse(null);
   setCourses([]);
   setSelectedDepartment(null);
   setDepartments([]);
   setSelectedSessionId(null);

   // Student Details
   setStudentDetails(null);

   // Modal reset (if needed)
   // setShowModal(false);
 };

  const handleClose = () => {
    navigate("/admin/dashboard");
  };
const itemsPerPage = 10;
const [currentPage, setCurrentPage] = useState(0);
const handlePageClick = (event) => {
  setCurrentPage(event.selected);
};
const offset = currentPage * itemsPerPage;
const currentItems = transportData.slice(offset, offset + itemsPerPage);
const pageCount = Math.ceil(transportData.length / itemsPerPage);
  const handleOpenModal = (student) => {
    setShowModal(true);
    setSelectedStudent(student);
  };

  const handleCloseModal = () => {
    setShowModal(false);
     setSelectedStudent(null);
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


  useEffect(() => {
    const saved = localStorage.getItem("selectedClubStudentId");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.student_id) {
          setStudentId(String(parsed.student_id));
        }
      } catch {
        // in case saved was string
        setStudentId(String(saved));
      }
    }
  }, []);
const handleSelectStudent = async (selectedStudent) => {
  try {
    if (!selectedStudent || !selectedStudent.student_id) {
      console.error(
        "Student ID missing from selected student:",
        selectedStudent
      );
      return;
    }

    const sid = selectedStudent.student_id;

    // Set student ID immediately
    setStudentId(sid);

    // Save name for display (temporary)
    setStudentName(selectedStudent.student_name || "");

    // Store ID in localStorage
    localStorage.setItem(
      "selectedClubStudentId",
      JSON.stringify({ student_id: sid })
    );

    // NOW fetch complete details from API
    await fetchStudentDetails(sid);

    handleCloseModal();
  } catch (error) {
    console.error("Error handling selected student:", error);
  }
};
   
    const fetchStudentDetails = async (sid) => {
      try {
        if (!sid) return;
   
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
   
        const url = `${ApiUrl.apiurl}StudentCourse/GetStudentDataBasedId/?student_id=${sid}&branch_id=${branch_id}&organization_id=${organization_id}`;
   
        console.log("Fetching details from:", url);
   
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
   
        const result = await response.json();
        console.log("Student Full Details:", result);
   
        if (result.message === "Success" && result.data) {
          const student = result.data;
   
          // Save everything
          setStudentDetails(student);
          setStudentName(student.student_name || "");
   
          // ALSO fill dropdowns (optional)
          setSelectedCourse({
            value: student.course_id,
            label: student.course_name,
          });
          setSelectedDepartment({
            value: student.department_id,
            label: student.department,
          });
          setSelectedSession({ value: student.batch_id, label: student.batch });
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
   
          console.log("All Student Data Loaded");
        }
      } catch (error) {
        console.error(" Error fetching details:", error);
      }
    };
  
useEffect(() => {
  if (selectedSession && selectedCourse && selectedDepartment) {
    fetchSemesters(); // or fetchFeePeriod() depending on your API
  }
}, [selectedSession, selectedCourse, selectedDepartment]);

const fetchSemesters = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const organization_id = sessionStorage.getItem("organization_id");
    const branch_id = sessionStorage.getItem("branch_id");

    const batch_id = selectedSession?.value || "";
    const course_id = selectedCourse?.value || "";
    const department_id = selectedDepartment?.value || "";

    if (!organization_id || !branch_id) {
      console.error("Missing organization_id or branch_id");
      return;
    }

    const url = `${ApiUrl.apiurl}Semester/GetSemesterByDepartment/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}`;

    console.log("Fetching Semesters:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch semesters");
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      const semesterOptions = data.map((item) => ({
        value: item.id,
        label: item.semester_code, // e.g., "1st Sem"
      }));

      setFeePeriod(semesterOptions);
    } else {
      console.error("Unexpected API response:", data);
      setFeePeriod([]);
    }
  } catch (error) {
    console.error("Error fetching semesters:", error);
    setFeePeriod([]);
  }
};


useEffect(() => {
  const fetchPickupPoints = async () => {
    try {
      const token = localStorage.getItem("accessToken"); //  Token added

      const organization_id = sessionStorage.getItem("organization_id");
      const branch_id = sessionStorage.getItem("branch_id");

      if (!organization_id || !branch_id) {
        console.error(
          "Missing organization_id or branch_id in session storage"
        );
        return;
      }

      const response = await fetch(
        `${ApiUrl.apiurl}PICKUP_POINT/pickuppointlist/?organization_id=${organization_id}&branch_id=${branch_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, //  Token added
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.message === "Success" &&
        Array.isArray(data.data)
      ) {
        const formattedPickupPoints = data.data.map((point) => ({
          value: point.id,
          label: point.pickup_point_name,
        }));

        setPickupPoints(formattedPickupPoints);
      } else {
        console.error("Failed to fetch pickup points:", data.message);
        setPickupPoints([]);
      }
    } catch (error) {
      console.error("Error fetching pickup points:", error);
      setPickupPoints([]);
    }
  };

  fetchPickupPoints();
}, []);


  // Function to Export Data to Excel
const handleSearch = async () => {
  setLoading(true);

  try {
    const token = localStorage.getItem("accessToken");
    const organization_id = sessionStorage.getItem("organization_id") || 1;
    const branch_id = sessionStorage.getItem("branch_id") || 1;

    // Mandatory params — ALWAYS sent
    const queryParams = new URLSearchParams({
      organization_id,
      branch_id,
      paid: showUnpaidFee ? "false" : "true",
    });

    // Optional filters — ONLY when selected
    if (selectedSession?.value)
      queryParams.append("batch_id", selectedSession.value);

    if (selectedCourse?.value)
      queryParams.append("course_id", selectedCourse.value);

    if (selectedDepartment?.value)
      queryParams.append("department_id", selectedDepartment.value);

    if (selectedAcademicYear?.value)
      queryParams.append("academic_year_id", selectedAcademicYear.value);

    if (selectedSemester?.value)
      queryParams.append("semester_id", selectedSemester.value);

    if (selectedSection?.value)
      queryParams.append("section_id", selectedSection.value);

    if (pickupPoint) queryParams.append("pickup_point_id", pickupPoint);

    if (selectedFeePeriod)
      queryParams.append("fee_applied_from", selectedFeePeriod);

    if (studentId) queryParams.append("student_id", studentId);

    // Final URL
    const finalUrl = `${
      ApiUrl.apiurl
    }Transport/TransportChargesCalculateBasedOnStudent/?${queryParams.toString()}`;

    console.log("FINAL URL:", finalUrl);

    // API CALL
    const response = await fetch(finalUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Transport API Response:", result);

    if (result.message === "success" && Array.isArray(result.data)) {
      setTransportData(result.data);
      setCurrentPage(0);
    } else {
      setTransportData([]);
    }
  } catch (error) {
    console.error("Error fetching transport fee data:", error);
    setTransportData([]);
  } finally {
    setLoading(false);
  }
};


  const exportToExcel = () => {
  if (!transportData || transportData.length === 0) {
    alert("No data available to export.");
    return;
  }

  const worksheetData = transportData.map((item, index) => ({
    "Sr.No": index + 1,
    "Student Name": item.student_name || "",
    Class: item.course_name || "",
    Section: item.section_name || "",
    "Father Name": item.father_name || "",
    "Pick Up Point": item.pick_up_point || "",
    "Total Transport Fees": item.total_fees || 0,
    "Fees Paid": item.paid_fees || 0,
    Balance: (item.total_fees || 0) - (item.paid_fees || 0),
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Transport Data");

  XLSX.writeFile(workbook, "TransportData.xlsx");
};


const fetchViewPDF = async (student_id, fee_applied_from) => {
  try {
   const organization_id = sessionStorage.getItem("organization_id") || "";
   const branch_id = sessionStorage.getItem("branch_id") || "";

    const token = localStorage.getItem("accessToken");

    if (!student_id) {
      alert("Student ID missing!");
      return;
    }

    if (!fee_applied_from) {
      alert("Fee Applied From is missing!");
      return;
    }

    if (!organization_id || !branch_id ) {
      alert("Organization / Branch  is missing!");
      return;
    }

    const url = `${ApiUrl.apiurl}Transport/MonthlyElemetWiseStudentFees/?student_id=${student_id}&fee_applied_from_id=${fee_applied_from}&organization_id=${organization_id}&branch_id=${branch_id}`;

    console.log("PDF API URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.message === "success") {
      generatePDF(result.data);
    } else {
      alert(result.message || "Failed to fetch PDF data");
    }
  } catch (error) {
    console.error("Error fetching PDF:", error);
  }
};


const generatePDF = (data) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Monthly Fee Report", 14, 15);

  let startY = 25;

  //  GROUP BY SEMESTER
  const groupedData = data.reduce((acc, item) => {
    const key = item.semester || "N/A";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  let totalFees = 0,
    totalPaid = 0,
    totalDiscount = 0;

  Object.entries(groupedData).forEach(([semester, records]) => {
    let subtotalAmount = 0,
      subtotalPaid = 0,
      semesterDiscount = 0;

    const filteredRecords = records.filter((item) => {
      if (item.element_name === "DISCOUNT") {
        semesterDiscount += item.total_paid_amount;
        totalDiscount += item.total_paid_amount;
        return false;
      }
      return true;
    });

    if (filteredRecords.length === 0) return;

    //  Semester Header
    doc.autoTable({
      startY,
      head: [[`Semester: ${semester}`]],
      theme: "grid",
      styles: { fillColor: [220, 220, 220], fontStyle: "bold" },
    });

    const tableData = filteredRecords.map((item) => {
      subtotalAmount += item.total_amount;
      subtotalPaid += item.total_paid_amount;
      return [
        item.element_name,
        item.total_amount.toFixed(2),
        item.total_paid_amount.toFixed(2),
        (item.total_amount - item.total_paid_amount).toFixed(2),
      ];
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 5,
      head: [["Fee Element", "Total Amount", "Paid", "Balance"]],
      body: tableData,
      theme: "grid",
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 2,
      body: [
        [
          "Total",
          subtotalAmount.toFixed(2),
          subtotalPaid.toFixed(2),
          (subtotalAmount - subtotalPaid - semesterDiscount).toFixed(2),
        ],
      ],
      styles: { fontStyle: "bold" },
      theme: "grid",
    });

    totalFees += subtotalAmount;
    totalPaid += subtotalPaid;
    startY = doc.lastAutoTable.finalY + 10;
  });

  const totalBalance = totalFees - totalPaid - totalDiscount;

  doc.autoTable({
    startY,
    body: [
      ["Total Fees", totalFees.toFixed(2)],
      ["Total Paid", totalPaid.toFixed(2)],
      ["Total Discount", totalDiscount.toFixed(2)],
      ["Final Balance", totalBalance.toFixed(2)],
    ],
    theme: "grid",
    styles: { fontStyle: "bold", halign: "right" },
  });

  const pdfBlob = doc.output("blob");
  window.open(URL.createObjectURL(pdfBlob));
};



  const groupByMonth = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.month]) {
        acc[item.month] = [];
      }
      acc[item.month].push(item);
      return acc;
    }, {});
  };

  const handleCheckboxChange = (e) => {
    setShowUnpaidFee(e.target.checked);
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
                STUDENT TRANSPORT FEE
              </p>

              <div className="row mb-3 mt-3 mx-0">
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
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={exportToExcel}
                  >
                    Export to Excel
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
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* SearchFeild */}
              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-md-3 mb-0">
                        <label htmlFor="student-name" className="form-label">
                          Student Name
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="student-name"
                            className="form-control detail"
                            placeholder="Enter student name"
                            // ref={studentNameRef}
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            disabled
                          />
                          <button
                            type="button"
                            className="btn btn-primary ms-0 mb-0 mt-0"
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

                      <div className="col-md-3">
                        <label htmlFor="pick-up-point" className="form-label">
                          Pick Up Point
                        </label>
                        <Select
                          options={pickupPoints}
                          className="detail"
                          classNamePrefix="react-select"
                          placeholder="Select Pick Up Point"
                          isClearable
                          value={
                            pickupPoints.find(
                              (option) => option.value === pickupPoint
                            ) || null
                          }
                          onChange={(selectedOption) => {
                            console.log(
                              "Selected Pickup Point ID:",
                              selectedOption?.value
                            ); // Debugging
                            setPickupPoint(
                              selectedOption ? selectedOption.value : null
                            );
                          }}
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <label htmlFor="fee-period" className="form-label">
                          Fee Period
                        </label>
                        <Select
                          id="fee-period"
                          options={feePeriod}
                          className="detail"
                          placeholder={
                            !selectedCourse || !selectedDepartment
                              ? "Select Course & Branch first"
                              : "Select Fee Period"
                          }
                          value={
                            feePeriod?.find(
                              (option) => option.value === selectedFeePeriod
                            ) || null
                          }
                          onChange={(selectedOption) =>
                            setSelectedFeePeriod(
                              selectedOption ? selectedOption.value : null
                            )
                          }
                          isDisabled={!selectedCourse || !selectedDepartment} //  FIXED
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <br />
                        <label htmlFor="club" className="form-label">
                          <Form.Check
                            type="checkbox"
                            label="Show Unpaid Fee"
                            checked={showUnpaidFee}
                            onChange={handleCheckboxChange}
                          />
                        </label>
                      </div>
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
                      <th>Course</th>
                      <th>Section</th>
                      <th>Father Name</th>
                      <th>Pick Up Point</th>
                      <th>Total Transport Fees</th>
                      <th>Fees Paid</th>
                      <th>Balance</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((item, index) => (
                        <tr key={index}>
                          <td>{offset + index + 1}</td>
                          <td>{item.student_name}</td>
                          <td>{item.course_name}</td>
                          <td>{item.section_name}</td>
                          <td>{item.father_name}</td>
                          <td>{item.pick_up_point}</td>
                          <td>{item.total_fees}</td>
                          <td>{item.paid_fees}</td>
                          <td>
                            {(item.total_fees || 0) - (item.paid_fees || 0)}
                          </td>
                          <td>
                            <button
                              className="btn btn-info btn-sm"
                              onClick={() =>
                                fetchViewPDF(
                                  item.student_id,
                                  item.fee_applied_from
                                )
                              }
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center">
                          No Data Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ✅ Pagination */}
              {transportData.length > itemsPerPage && (
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
  );
};

export default AdmAttendanceEntry;
