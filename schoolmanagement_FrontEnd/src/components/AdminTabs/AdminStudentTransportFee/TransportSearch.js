import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import SelectStudentFeeModal from "../FeeStudentModal/SelectStudentFeeModal";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import EditTransportModal from "../AdminStudentTransportFee/EditTransportModal";
import ReactPaginate from "react-paginate";

const AdmAttendanceEntry = () => {
  const [showModal, setShowModal] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
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

  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentTransportDetails, setStudentTransportDetails] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Number of rows per page

  const fromClassRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);

  const handleClear = () => {
    // Filters
    setSearchStudentId(""); // ✅ IMPORTANT
    setStudentId(""); // internal
    localStorage.removeItem("selectedClubStudentId");
    //  setStudentId("");
    setStudentName("");
    setClassId("");
    setSectionId("");

    setSelectedStudent({
      name: "",
      barcode: "",
      admissionNo: "",
      fatherName: "",
      motherName: "",
      schoolAdmissionNo: "",
    });

    // Dropdowns
    setSelectedDepartment(null);
    setSelectedCourse(null);
    setSelectedSession(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);

    setDepartments([]);
    setCourses([]);
    setSemesters([]);
    setSections([]);
    setAcademicYears([]);
    setSectionOptions([]);
    setClassOptions([]);

    // Transport
    setTransportData([]);
    setSelectedStudentId(null);
    setStudentTransportDetails(null);
    setSelectedRoute(null);
    setRoutes([]);

    // Pagination
    setCurrentPage(0);

    // Fee element
    setFeeElement({
      element_type_id: "",
      name: "",
      frequency: "",
      amount: "",
      periods: Array(6).fill(null),
    });

    // Clear inputs
    fromClassRef.current && (fromClassRef.current.value = "");
    admissionNoRef.current && (admissionNoRef.current.value = "");
    barcodeRef.current && (barcodeRef.current.value = "");
    smsToRef.current && (smsToRef.current.value = "");
  };

  // Slice data for pagination
  const offset = currentPage * itemsPerPage;
  const currentData = transportData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(transportData.length / itemsPerPage);

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  // const [studentId, setStudentId] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // State for Academic Year dropdown
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchStudentId, setSearchStudentId] = useState("");

  // Use refs for the fields that don't rely on state

  const [feeElement, setFeeElement] = useState({
    element_type_id: "",
    name: "",
    frequency: "",
    amount: "",
    periods: Array(6).fill(null),
  });

  const newExistingOptions = [
    { value: "N", label: "New" },
    { value: "E", label: "Existing" },
  ];

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

  // Load student_id on page load
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
  // const handleSelectStudent = async (selectedStudent) => {
  //   try {
  //     if (!selectedStudent || !selectedStudent.student_id) {
  //       console.error(
  //         "Student ID missing from selected student:",
  //         selectedStudent
  //       );
  //       return;
  //     }

  //     const sid = selectedStudent.student_id;

  //     // Set student ID immediately
  //     setStudentId(sid);

  //     // Save name for display (temporary)
  //     setStudentName(selectedStudent.student_name || "");

  //     // Store ID in localStorage
  //     localStorage.setItem(
  //       "selectedClubStudentId",
  //       JSON.stringify({ student_id: sid })
  //     );

  //     // NOW fetch complete details from API
  //     await fetchStudentDetails(sid);

  //     handleCloseModal();
  //   } catch (error) {
  //     console.error("Error handling selected student:", error);
  //   }
  // };


  // const handleSelectStudent = async (selectedStudent) => {
  //   try {
  //     const studentId =
  //       selectedStudent?.fullData?.student ||
  //       selectedStudent?.studentBasicDetails?.student_id ||
  //       selectedStudent?.student_id ||
  //       null;

  //     if (!studentId) {
  //       console.error("No valid student ID found in selected student");
  //       return;
  //     }

  //     // Store in state (IMPORTANT FIX)
  //     setStudentId(studentId);
  //     setStudentName(
  //       selectedStudent?.fullData?.studentName ||
  //         selectedStudent?.student_name ||
  //         ""
  //     );

  //     // Store in localStorage
  //     localStorage.setItem(
  //       "selectedClubStudentId",
  //       JSON.stringify({ student_id: studentId })
  //     );

  //     console.log("Stored student_id:", studentId);

  //     await fetchStudentDetails(studentId);

  //     handleCloseModal();
  //   } catch (error) {
  //     console.error("Error handling selected student:", error);
  //   }
  // };

  // const fetchStudentDetails = async (student_id) => {
  //   try {
  //     const token = localStorage.getItem("accessToken");
  //     const organization_id = sessionStorage.getItem("organization_id");
  //     const branch_id = sessionStorage.getItem("branch_id");

  //     if (!student_id) {
  //       console.error("Missing student_id");
  //       return;
  //     }

  //     setStudentId(student_id); // IMPORTANT FIX

  //     const url = `${ApiUrl.apiurl}StudentCourse/GetStudentDataBasedId/?student_id=${student_id}&branch_id=${branch_id}&organization_id=${organization_id}`;
  //     console.log("Fetching from:", url);

  //     const response = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (!response.ok) throw new Error("Failed to fetch student details");

  //     const result = await response.json();
  //     console.log("API Response:", result);

  //     if (result.message === "Success" && result.data) {
  //       const student = result.data;

  //       setStudentDetails(student);
  //       setStudentName(student.student_name || "");

  //       setSelectedCourse({
  //         value: student.course_id,
  //         label: student.course_name,
  //       });

  //       setSelectedDepartment({
  //         value: student.department_id,
  //         label: student.department,
  //       });

  //       setSelectedSession({
  //         value: student.batch_id,
  //         label: student.batch,
  //       });

  //       setSelectedAcademicYear({
  //         value: student.academic_year_id,
  //         label: student.academic_year,
  //       });

  //       setSelectedSemester({
  //         value: student.semester_id,
  //         label: student.semester_name,
  //       });

  //       setSelectedSection({
  //         value: student.section_id,
  //         label: student.section_name,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching student details:", error);
  //   }
  // };

  const handleSelectStudent = async (selectedStudent) => {
    try {
      if (!selectedStudent || !selectedStudent.student_id) return;

      const sid = String(selectedStudent.student_id);

      // ✅ SET BOTH
      setStudentId(sid);
      setSearchStudentId(sid); // 🔥 IMPORTANT FIX
      setStudentName(selectedStudent.student_name || "");

      localStorage.setItem(
        "selectedClubStudentId",
        JSON.stringify({ student_id: sid })
      );

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
      console.error("❌ Error fetching details:", error);
    }
  };


  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const orgId = localStorage.getItem("orgId");
        const branchId = localStorage.getItem("branchId");
        const token = localStorage.getItem("accessToken"); //  Get token

        if (!orgId || !branchId) {
          console.error("Missing orgId or branchId in local storage");
          return;
        }

        if (!token) {
          console.error("Missing access token in local storage");
          return;
        }

        const response = await fetch(
          `/api/Transport/routemasterlist/${orgId}/${branchId}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, //  Include token
              "Content-Type": "application/json",
            },
          }
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

  // const handleSearch = async () => {
  //   try {
  //     const token = localStorage.getItem("accessToken");
  //     const organization_id = sessionStorage.getItem("organization_id");
  //     const branch_id = sessionStorage.getItem("branch_id");

  //     if (!organization_id || !branch_id) {
  //       console.error("Missing mandatory fields");
  //       return;
  //     }

  //     const queryParams = new URLSearchParams({
  //       organization_id,
  //       branch_id,
  //     });

  //     // NOW studentId exists because setStudentId() is fixed
  //     if (studentId) {
  //       queryParams.append("student_id", studentId);
  //     }
  //     if (classId) {
  //       queryParams.append("class_id", classId);
  //     }
  //     if (sectionId) {
  //       queryParams.append("section_id", sectionId);
  //     }

  //     const response = await fetch(
  //       `${
  //         ApiUrl.apiurl
  //       }Transport/GetStudentTransportList/?${queryParams.toString()}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = await response.json();
  //     console.log("API Response:", data);

  //     if (
  //       data.message?.toLowerCase() === "success" &&
  //       Array.isArray(data.data)
  //     ) {
  //       const formatted = data.data.map((item) => ({
  //         className: item.course_name,
  //         sectionName: item.section_name,
  //         rollNo: item.enrollment_no,
  //         studentId: item.student_id,
  //         studentName: item.student_name,
  //         schoolAdmissionNo: item.college_admission_no,
  //         barcode: item.barcode,
  //         fatherName: item.father_name,
  //         motherName: item.mother_name,
  //         houseName: item.house_name,
  //         transportAvailed: item.transport_availed,
  //       }));

  //       setTransportData(formatted);
  //     } else {
  //       setTransportData([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching transport data:", error);
  //     setTransportData([]);
  //   }
  // };

  // const handleSearch = async () => {
  //   try {
  //     const token = localStorage.getItem("accessToken");
  //     const organization_id = sessionStorage.getItem("organization_id");
  //     const branch_id = sessionStorage.getItem("branch_id");

  //     if (!token || !organization_id || !branch_id) {
  //       alert("Missing required session data");
  //       return;
  //     }

  //     // 🔄 Clear old results
  //     setTransportData([]);
  //     setCurrentPage(0);

  //     const queryParams = new URLSearchParams({
  //       organization_id,
  //       branch_id,
  //     });

  //     // ✅ ONLY use searchStudentId
  //     if (searchStudentId?.trim()) {
  //       queryParams.append("student_id", searchStudentId.trim());
  //     }

  //     if (classId) {
  //       queryParams.append("class_id", classId);
  //     }

  //     if (sectionId) {
  //       queryParams.append("section_id", sectionId);
  //     }

  //     const response = await fetch(
  //       `${
  //         ApiUrl.apiurl
  //       }Transport/GetStudentTransportList/?${queryParams.toString()}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = await response.json();
  //     console.log("Transport API Response:", data);

  //     if (response.ok && Array.isArray(data.data)) {
  //       const formattedData = data.data.map((item) => ({
  //         className: item.course_name,
  //         sectionName: item.section_name,
  //         rollNo: item.enrollment_no,
  //         studentId: item.student_id,
  //         studentName: item.student_name,
  //         schoolAdmissionNo: item.college_admission_no,
  //         barcode: item.barcode,
  //         fatherName: item.father_name,
  //         motherName: item.mother_name,
  //         houseName: item.house_name,
  //         transportAvailed: item.transport_availed,
  //       }));

  //       setTransportData(formattedData);
  //     } else {
  //       setTransportData([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching transport data:", error);
  //     setTransportData([]);
  //   }
  // };




  // useEffect(() => {
  //   const fetchSectionData = async () => {
  //     if (!classId) {
  //       setSectionOptions([]); // Clear sections if no class selected
  //       return;
  //     }

  //     console.log("Fetching sections for classId:", classId); // Debugging

  //     try {
  //       const response = await fetch(
  //         `${ApiUrl.apiurl}ClassSectionBind/GetAllSectionBindWithClass/${classId}`
  //       );
  //       const data = await response.json();

  //       console.log("Section API response:", data); // Debugging

  //       if (data.message === "success") {
  //         const formattedSections = data.data.map((sectionItem) => ({
  //           value: sectionItem.id,
  //           label: sectionItem.sectionname,
  //         }));
  //         setSectionOptions(formattedSections);
  //       } else {
  //         console.error("Failed to fetch sections: ", data.message);
  //         setSectionOptions([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching section data:", error);
  //       setSectionOptions([]);
  //     }
  //   };

  //   fetchSectionData();
  // }, [classId]);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const organization_id = sessionStorage.getItem("organization_id");
      const branch_id = sessionStorage.getItem("branch_id");

      if (!token || !organization_id || !branch_id) {
        alert("Missing required session data");
        return;
      }

      setTransportData([]);
      setCurrentPage(0);

      const queryParams = new URLSearchParams({
        organization_id,
        branch_id,
      });

      // ✅ Priority 1: Student selected
      if (searchStudentId?.trim()) {
        queryParams.append("student_id", searchStudentId.trim());
      }
      // ✅ Priority 2: Other filters
      else {
        if (selectedCourse?.value) {
          queryParams.append("course_id", selectedCourse.value);
        }
        if (selectedSection?.value) {
          queryParams.append("section_id", selectedSection.value);
        }
      }

      const response = await fetch(
        `${ApiUrl.apiurl
        }Transport/GetStudentTransportList/?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok && Array.isArray(data.data)) {
        const formattedData = data.data.map((item) => ({
          className: item.course_name,
          sectionName: item.section_name,
          rollNo: item.enrollment_no,
          studentId: item.student_id,
          studentName: item.student_name,
          schoolAdmissionNo: item.college_admission_no,
          barcode: item.barcode,
          fatherName: item.father_name,
          motherName: item.mother_name,
          houseName: item.house_name,
          transportAvailed: item.transport_availed,
          // New fields
          batchName: item.batch_name,
          academicYear: item.academic_year,
          semester: item.semester,
        }));

        setTransportData(formattedData);
      } else {
        setTransportData([]);
      }
    } catch (error) {
      console.error("Error fetching transport data:", error);
      setTransportData([]);
    }
  };


  const handleOpenModal = async (student) => {
    setShowModal(true);
    setSelectedStudent(student);

    try {
      const token = localStorage.getItem("accessToken");
      const organization_id = sessionStorage.getItem("organization_id");
      const branch_id = sessionStorage.getItem("branch_id");

      const url = `${ApiUrl.apiurl}Transport/TransportDetailsRetereiveByStudent/?organization_id=${organization_id}&branch_id=${branch_id}&student_id=${student.studentId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Transport Details API Response:", data);

      if (data.message?.toLowerCase() === "success" && data.data) {
        const formattedDetails = {
          student_id: student.studentId,

          student_name: data.data.student_name || "",
          admission_no: data.data.admission_no || "",
          barcode: data.data.barcode || "",
          father_name: data.data.father_name || "",
          mother_name: data.data.mother_name || "",
          college_admission_no: data.data.college_admission_no || "",
          academic_year: student.academicYear, // Pass academic year for validation logic
          semester_name: student.semester, // Pass semester name for validation logic

          transport_avail: Boolean(data.data.transport_avail),

          routeId: data.data.routeId,
          route_name: data.data.route_name,

          pickup_point_id: data.data.pickup_point_id,
          pickup_point_name: data.data.pickup_point_name,
          amount: data.data.amount,

          // ✅ Availed semesters
          choice_semester: Array.isArray(data.data.choice_semester)
            ? data.data.choice_semester.map((sem) => ({
              semester_id: Number(sem.semester_id),
              semester_name: sem.semester_name,
              semester_code: sem.semester_code,  // ✅ Keep semester_code
              selected: sem.selected,  // ✅ Keep selected flag
              flag: sem.flag,
            }))
            : [],

          // 🔒 PAID semesters (IMPORTANT)
          transport_paid_sems: Array.isArray(data.data.transport_paid_sems)
            ? data.data.transport_paid_sems.map((s) => ({
              semester_id: Number(s.semester_id),
            }))
            : [],

          // Current semester ID to disable past semesters
          current_semester_id: data.data.current_semester_id,

          // 🔢 Total semesters
          total_semesters: data.data.total_semesters || 0,
        };

        setStudentTransportDetails(formattedDetails);
      } else {
        setStudentTransportDetails(null);
      }
    } catch (error) {
      console.error("Error fetching transport details:", error);
      setStudentTransportDetails(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setStudentTransportDetails(null);
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
                STUDENT TRANSPORT
              </p>
              <div className="row mb-3 mt-3 mx-0">
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

              <div className="row  mt-3 mx-2">
                <div className="col-12  custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mb-3 mt-2">
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
                            className="btn btn-primary ms-2"
                            style={{ width: "50px", padding: "3px" }}
                            onClick={() => setShow(true)}
                          >
                            ...
                          </button>
                        </div>
                      </div>

                      <SelectStudentFeeModal
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered ">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Session</th>
                        <th>Academic Year</th>
                        <th>Semester</th>
                        <th>Student Name</th>
                        <th>Barcode</th>
                        <th>Father Name</th>
                        <th>Mother Name</th>
                        <th>House</th>
                        <th>Transport Availed</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.length > 0 ? (
                        currentData.map((student, index) => (
                          <tr key={student.studentId}>
                            <td>{offset + index + 1}</td>
                            <td>{student.batchName || "N/A"}</td>
                            <td>{student.academicYear || "N/A"}</td>
                            <td>{student.semester || "N/A"}</td>
                            <td>{student.studentName || "N/A"}</td>
                            <td>{student.barcode || "N/A"}</td>
                            <td>{student.fatherName || "N/A"}</td>
                            <td>{student.motherName || "N/A"}</td>
                            <td>{student.houseName || "N/A"}</td>{" "}
                            {/*  Fixed here */}
                            <td>{student.transportAvailed ? "Yes" : "No"}</td>
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
                          <td colSpan="12" className="text-center">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <EditTransportModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    studentData={selectedStudent}
                    transportDetails={studentTransportDetails}
                    routes={routes}
                  />

                  {/* Pagination Component */}
                  {transportData.length > itemsPerPage && (
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
