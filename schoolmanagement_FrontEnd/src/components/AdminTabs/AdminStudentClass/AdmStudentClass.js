import React, { useState, useRef, useEffect } from "react";
import { Form, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalClass from "./ModalClass";
import useFetchSections from "../../hooks/useFetchSections";
import useFetchHouses from "../../hooks/useFetchHouses";
import useFetchRoutes from "../../hooks/useFetchRoutes ";
import useFeeGroups from "../../hooks/useFeeGroups";
import useFetchPickupPoints from "../../hooks/useFetchPickupPoints ";
import { ApiUrl } from "../../../ApiUrl";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";

const AdmAttendanceEntry = () => {
  const [formData, setFormData] = useState({
    feeappfrom: "",
    feegroup: "",
    routeid: "",
    selectedPickUpPoint: "",
    transportAvailed: false,
    amount: "",
    choice_month: [],
    house_id: "",
  });
  const [selectedClassId, setSelectedClassId] = useState("");
  const navigate = useNavigate();
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState("");

  const organizationId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");

  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [apiStudentIds, setApiStudentIds] = useState({});

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

  const [previousYearBalance, setPreviousYearBalance] = useState(0);

  // ✅ Clear stored filters on initial page load
  useEffect(() => {
    localStorage.removeItem("selectedStudentClassId");
    localStorage.removeItem("selectedStudentSectionId");
    localStorage.removeItem("selectedClassStudentId");
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can change this to show more/less per page
  const {
    sections,
    loading: sectionLoading,
    error: sectionError,
  } = useFetchSections(formData.classId);
  const [studentsData, setStudentsData] = useState([]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = studentsData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(studentsData.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1); // react-paginate gives 0-based index
  };
  const [selectedStudentName, setSelectedStudentName] = useState("");

  const [amount, setAmount] = useState("");
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [isTransportAvailed, setIsTransportAvailed] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedPickUpPoint, setSelectedPickUpPoint] = useState("");
  // Skip auto-filling amount from pickup-point API on initial modal load
  // (we already have the real saved amount from the transport retrieve API)
  const skipAmountAutoFill = useRef(false);

  const [selectedAction, setSelectedAction] = useState(null);
  const [isTransportEditable, setIsTransportEditable] = useState(false);

  const {
    pickupPoints,
    loading: pickupLoading,
    error: pickupError,
  } = useFetchPickupPoints(formData.routeid);
  const {
    routes,
    loading: routeLoading,
    error: routeError,
  } = useFetchRoutes(isTransportAvailed);

  const [showStudentSelectionModal, setShowStudentSelectionModal] =
    useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const studentNameRef = useRef(null);
  const [periods, setPeriods] = useState([]);
  const {
    houses,
    loading: loadingHouses,
    error: errorHouses,
  } = useFetchHouses();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const {
    feeGroups = [],
    loading: feeLoading,
    error: feeError,
  } = useFeeGroups(formData.classId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [initialChoiceSemesterIds, setInitialChoiceSemesterIds] = useState([]);
  const [paidSemesters, setPaidSemesters] = useState([]); // 🔒 Store paid semester IDs (flag="no")
  const [lockAllSemesters, setLockAllSemesters] = useState(false);
  const [semesterDataList, setSemesterDataList] = useState([]); // 🔥 Store actual semester data with IDs

  // Function to close the modal
  const modalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (routes.length > 0 && selectedStudent?.routeid) {
      // Ensure the selected route exists in routes
      const routeExists = routes.some(
        (route) => route.id === selectedStudent.routeid
      );
      if (routeExists) {
        setSelectedRoute(selectedStudent.routeid);
      } else {
        setSelectedRoute(""); // Fallback if route is missing
      }
    }
  }, [routes, selectedStudent]);

  // Synchronize form data with student data when editing
  useEffect(() => {
    if (selectedStudent) {
      setFormData((prev) => ({
        ...prev,
        routeid: selectedStudent.routeid || "",
        selectedPickUpPoint: selectedStudent.pickuppoitId || "",
      }));

      setIsTransportAvailed(selectedStudent.transport_availed || false);
      setSelectedPickUpPoint(selectedStudent.pickuppoitId || "");
    }
  }, [selectedStudent]);

  // Synchronize selectedPickUpPoint when pickupPoints are fetched
  useEffect(() => {
    if (pickupPoints.length > 0 && formData.selectedPickUpPoint) {
      const matchingPoint = pickupPoints.find(
        (point) => point.routeDetailsId === formData.selectedPickUpPoint
      );

      if (matchingPoint) {
        setSelectedPickUpPoint(matchingPoint.routeDetailsId);
      } else {
        setSelectedPickUpPoint("");
      }
    }
  }, [pickupPoints, formData.selectedPickUpPoint]);

  // const handleEditClick = async (student) => {
  //   try {
  //     // RESET modal state
  //     setSelectedMonths({});
  //     setFormData((prev) => ({
  //       ...prev,
  //       choice_month: [],
  //     }));
  //     setIsTransportAvailed(false);

  //     const organizationId = sessionStorage.getItem("organization_id");
  //     const branchId = sessionStorage.getItem("branch_id");
  //     const token = localStorage.getItem("accessToken"); // ✅ Get token

  //     const apiUrl = `${ApiUrl.apiurl}StudentCourse/GetStudentDataBasedId/?student_id=${student.student_id}&branch_id=${branchId}&organization_id=${organizationId}`;

  //     // const response = await fetch(apiUrl);
  //     const response = await fetch(apiUrl, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`, // ✅ Add token
  //       },
  //     });
  //     const result = await response.json();

  //     if (result.message === "Success" && result.data) {
  //       const s = result.data;

  //       // ✅ STORE API IDS FOR SAVE PAYLOAD
  //       setApiStudentIds({
  //         batch_id: s.batch_id,
  //         course_id: s.course_id,
  //         department_id: s.department_id,
  //         academic_year_id: s.academic_year_id,
  //         semester_id: s.semester_id,
  //         section_id: s.section_id,
  //         house_id: s.house_id,
  //         fee_group_id: s.FeeStructureMasterId,
  //         fee_applied_from_id: s.fee_applied_fromId,
  //       });

  //       // 🔒 Modal View-Only
  //       // setIsDisabled(true);
  //       setIsDisabled(true); // Student details locked
  //       setIsTransportEditable(true); // Transport section editable
  //       setSelectedStudent({
  //         student_id: s.student_id,
  //         studentname: s.student_name,
  //         admission_no: s.admission_no,
  //         college_admission_no: s.college_admission_no,
  //         registration_no: s.registration_no,
  //         barcode: s.barcode,
  //         father_name: s.father_name,
  //         mother_name: s.mother_name,
  //         batch: s.batch,
  //         course_name: s.course_name,
  //         department: s.department,
  //         academic_year: s.academic_year,
  //         semester_name: s.semester_name,
  //         section_name: s.section_name,
  //         house: s.house,
  //         // enrollment_no: s.enrollment_no,
  //         transport_availed: s.transport_availed,
  //         routeid: s.routeid,
  //         pickuppoitId: s.pickuppoitId,
  //         choice_semester: s.choice_semester || [],
  //       });

  //       // 🟢 2. Fee App From + Fee Group (Input fields)
  //       const feeAppFromText = s.fee_applied_from || ""; // "1st Semester"
  //       const feeGroupName = s.FeeStructureMaster || ""; // "FSC2025"

  //       setFormData((prev) => ({
  //         ...prev,
  //         feeappfrom: feeAppFromText, // show text
  //         feegroup: feeGroupName, // show text
  //         feeappfromId: s.fee_applied_fromId,
  //         feegroupId: s.FeeStructureMasterId,
  //         routeid: s.routeid || "",
  //         selectedPickUpPoint: s.pickuppoitId || "",
  //         amount: s.amount || "",
  //         house_id: s.house_id || "",
  //         sectionId: s.section_id,
  //       }));

  //       // 🟢 3. Transport Availed
  //       setIsTransportAvailed(Boolean(s.transport_availed));

  //       let semesterSelection = {};
  //       let selectedSemesterIds = [];

  //       // ✅ total semesters from API (example: 6)
  //       const totalSemesters = s.total_semesters || 0;

  //       const selectedIds = Array.isArray(s.choice_semester)
  //         ? s.choice_semester.map((sem) => sem.id)
  //         : [];

  //       setInitialChoiceSemesterIds(selectedIds);

  //       // 🔒 check if all semesters already selected
  //       if (selectedIds.length === s.total_semesters) {
  //         setLockAllSemesters(true);
  //       } else {
  //         setLockAllSemesters(false);
  //       }

  //       // ✅ build ALL checkboxes
  //       for (let i = 1; i <= totalSemesters; i++) {
  //         semesterSelection[i] = selectedIds.includes(i);
  //         if (selectedIds.includes(i)) {
  //           selectedSemesterIds.push(i);
  //         }
  //       }

  //       setSelectedMonths(semesterSelection);

  //       setFormData((prev) => ({
  //         ...prev,
  //         choice_month: [], // 🚫 do NOT preload old data
  //       }));

  //       setCurrentStudentId(student.student_id);
  //       setShowEditModal(true);
  //     } else {
  //       alert("No record found for the selected student.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching student:", error);
  //     alert("Failed to fetch student details.");
  //   }
  // };

  const handleEditClick = async (student) => {
    try {
      // RESET modal state
      setSelectedMonths({});
      setFormData((prev) => ({
        ...prev,
        choice_month: [],
      }));
      setIsTransportAvailed(false);

      const organizationId = sessionStorage.getItem("organization_id");
      const branchId = sessionStorage.getItem("branch_id");
      const token = localStorage.getItem("accessToken");

      // 🔥 STEP 1: Fetch transport details (ALL semesters) like TransportSearch
      const transportApiUrl = `${ApiUrl.apiurl}Transport/TransportDetailsRetereiveByStudent/?student_id=${student.student_id}&branch_id=${branchId}&organization_id=${organizationId}`;

      const transportResponse = await fetch(transportApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const transportResult = await transportResponse.json();
      console.log("🚀 Transport API Response:", transportResult);

      // 🔥 STEP 2: Also fetch basic student data for IDs
      const apiUrl = `${ApiUrl.apiurl}StudentCourse/GetStudentDataBasedId/?student_id=${student.student_id}&branch_id=${branchId}&organization_id=${organizationId}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.message === "Success" && result.data) {
        const s = result.data;

        // ✅ STORE API IDS FOR SAVE PAYLOAD
        setApiStudentIds({
          batch_id: s.batch_id,
          course_id: s.course_id,
          department_id: s.department_id,
          academic_year_id: s.academic_year_id,
          semester_id: s.semester_id,
          section_id: s.section_id,
          house_id: s.house_id,
          fee_group_id: s.FeeStructureMasterId,
          fee_applied_from_id: s.fee_applied_fromId,
        });

        setIsDisabled(true);
        setIsTransportEditable(true);

        setSelectedStudent({
          student_id: s.student_id,
          studentname: s.student_name,
          admission_no: s.admission_no,
          college_admission_no: s.college_admission_no,
          registration_no: s.registration_no,
          barcode: s.barcode,
          father_name: s.father_name,
          mother_name: s.mother_name,
          batch: s.batch,
          course_name: s.course_name,
          department: s.department,
          academic_year: s.academic_year,
          semester_name: s.semester_name,
          section_name: s.section_name,
          house: s.house,
          transport_availed: s.transport_availed,
          routeid: s.routeid,
          pickuppoitId: s.pickuppoitId,
        });

        // 🟢 Transport Availed - Use data from Transport API
        const transportData = transportResult.data || {};
        setIsTransportAvailed(Boolean(transportData.transport_avail));

        // 🟢 Fee App From + Fee Group + Transport Data
        // Mark that the NEXT pickup-point useEffect run should be skipped
        // because we're about to populate the form with the real saved amount
        skipAmountAutoFill.current = true;
        setFormData((prev) => ({
          ...prev,
          feeappfrom: s.fee_applied_from || "",
          feegroup: s.FeeStructureMaster || "",
          feeappfromId: s.fee_applied_fromId,
          feegroupId: s.FeeStructureMasterId,
          routeid: transportData.routeId || "",
          selectedPickUpPoint: transportData.pickup_point_id || "",
          amount: transportData.amount || "",
          house_id: s.house_id || "",
          sectionId: s.section_id,
        }));

        // ===================== 🔥 NEW FIX - USE TRANSPORT API (ALL SEMESTERS) 🔥 =====================

        console.log("🔍 Transport API - choice_semester:", transportData.choice_semester);
        console.log("🔍 Transport API - transport_paid_sems:", transportData.transport_paid_sems);

        // ✅ 1. STORE THE ACTUAL SEMESTER DATA (with IDs) - Now includes ALL semesters
        const semesterList = Array.isArray(transportData.choice_semester) ? transportData.choice_semester : [];
        
        // 🔥 Map semester data to match our component structure
        const mappedSemesterList = semesterList.map((sem) => ({
          id: sem.semester_id,
          semester: sem.semester_name,
          selected: sem.selected, // true if previously selected
          flag: sem.flag, // "No" if paid, "Yes" if can select
        }));
        
        setSemesterDataList(mappedSemesterList); // 🔥 Save for rendering checkboxes

        console.log("✅ Semester List with IDs (ALL SEMESTERS):", mappedSemesterList);

        // ✅ 2. PAID SEMESTER IDs (flag="no" - these are locked)
        const paidSemesterIds = mappedSemesterList
          .filter((sem) => String(sem.flag).toLowerCase() === "no")
          .map((sem) => Number(sem.id));

        console.log("🔒 Paid Semester IDs:", paidSemesterIds);
        setPaidSemesters(paidSemesterIds); // 🔥 Store paid semesters
        setInitialChoiceSemesterIds(paidSemesterIds);

        // ✅ 3. SELECTED SEMESTER IDs (build checkbox state using actual IDs)
        const semesterSelection = {};
        mappedSemesterList.forEach((sem) => {
          const semId = Number(sem.id);
          // Use the 'selected' flag from API to determine if checkbox should be checked
          semesterSelection[semId] = sem.selected === true;
        });

        console.log("📋 Semester Selection State (by ID):", semesterSelection);

        // ✅ 4. APPLY TO UI
        setSelectedMonths(semesterSelection);

        // 🔒 5. LOCK ALL IF ALL ARE PAID
        setLockAllSemesters(paidSemesterIds.length === mappedSemesterList.length && mappedSemesterList.length > 0);

        console.log("🔥 Final - selectedMonths set with actual IDs:", semesterSelection);

        // ===================== 🔥 FIX ENDS 🔥 =====================

        setCurrentStudentId(student.student_id);
        setShowEditModal(true);
      } else {
        alert("No record found for the selected student.");
      }
    } catch (error) {
      console.error("Error fetching student:", error);
      alert("Failed to fetch student details.");
    }
  };

  // This useEffect hook listens for classId changes to trigger section fetching
  useEffect(() => {
    if (formData.classId) {
    }
  }, [formData.classId]);

  const [error, setError] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState({});
  
  // ❌ COMMENTED OUT - This was clearing the selectedMonths after we set it in handleEditClick
  // useEffect(() => {
  //   if (formData.transportAvailed) {
  //     const updatedMonths = formData.selectedMonths || {};
  //     setSelectedMonths(updatedMonths);
  //   }
  // }, [formData]);

  const handleModalClose = () => {
    setShowEditModal(false);
    setShowStudentSelectionModal(false);

    // Reset all edit-related states
    setFormData({
      classId: "",
      sectionId: "",
      routeid: "",
      selectedPickUpPoint: "",
      feeappfrom: "",
      feegroup: "",
      rollno: "",
      house: "",
      choice_month: [],
      amount: "",
    });
    setSelectedStudent(null);
    setIsTransportAvailed(false);
    setSelectedRoute("");
    setSelectedPickUpPoint("");
    setSelectedMonths({});

    setIsTransportEditable(false);
  };

  const handleClear = () => {
    setFormData({
      classId: "",
      sectionId: "",
      feeappfrom: "",
      feegroup: "",
      routeid: "",
      selectedPickUpPoint: "",
      rollno: "",
      house: "",
      choice_month: [],
      amount: "",
      studentId: "",
    });

    if (studentNameRef.current) {
      studentNameRef.current.value = "";
    }

    // ⭐ RESET STUDENT NAME
    setSelectedStudentName("");

    setSelectedBatch("");
    setSelectedCourse("");
    setSelectedDepartment("");
    setSelectedAcademicYear("");
    setSelectedSemester("");
    setSelectedSection("");

    setSelectedRoute("");
    setSelectedPickUpPoint("");
    setIsTransportAvailed(false);
    setSelectedMonths({});

    // ⭐ EMPTY TABLE
    setStudentsData([]);
    setCurrentPage(1);
  };

  // Trigger section fetching whenever selectedClassId changes
  useEffect(() => {
    if (selectedClassId) {
    }
  }, [selectedClassId]);

  useEffect(() => {
    if (!selectedBatch || !selectedCourse || !selectedDepartment) return;

    const org = sessionStorage.getItem("organization_id");
    const branch = sessionStorage.getItem("branch_id");
    const token = localStorage.getItem("accessToken"); // ✅ Get token

    const apiUrl = `${ApiUrl.apiurl}Semester/GetSemesterByDepartment/?organization_id=${org}&branch_id=${branch}&batch_id=${selectedBatch}&course_id=${selectedCourse}&department_id=${selectedDepartment}`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Add token
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPeriods(data || []);

        // Initialize selectedMonths state
        const initialMonths = {};
        (data || []).forEach((sem) => {
          initialMonths[sem.id] = false;
        });
        setSelectedMonths(initialMonths);
      })
      .catch(() => setError("Failed to load semesters."));
  }, [selectedBatch, selectedCourse, selectedDepartment]);

  // Fetch Student Course Records
  const fetchStudentCourseRecord = async () => {
    try {
      const organizationId = sessionStorage.getItem("organization_id");
      const branchId = sessionStorage.getItem("branch_id");
      const token = localStorage.getItem("accessToken"); // ✅ Get token

      if (!organizationId || !branchId) {
        alert("Organization ID or Branch ID missing in session.");
        return;
      }

      // Build API URL dynamically
      let apiUrl = `${ApiUrl.apiurl}StudentCourse/StudentCourseRecordFilter/?organization_id=${organizationId}&branch_id=${branchId}`;

      if (selectedBatch) apiUrl += `&batch_id=${selectedBatch}`;
      if (selectedCourse) apiUrl += `&course_id=${selectedCourse}`;
      if (selectedDepartment) apiUrl += `&department_id=${selectedDepartment}`;
      if (selectedAcademicYear)
        apiUrl += `&academic_year_id=${selectedAcademicYear}`;
      if (selectedSemester) apiUrl += `&semester_id=${selectedSemester}`;
      if (selectedSection) apiUrl += `&section_id=${selectedSection}`;
      if (selectedStudentName) apiUrl += `&student_name=${selectedStudentName}`;

      console.log("FINAL API URL:", apiUrl);

      // const response = await fetch(apiUrl);
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Add token
        },
      });
      if (!response.ok) throw new Error("API error");

      const result = await response.json();

      if (result.data && Array.isArray(result.data)) {
        setStudentsData(result.data); // <-- SHOW DATA IN TABLE
      } else {
        setStudentsData([]);
        alert("No data found.");
      }
    } catch (error) {
      console.error("Error fetching student course data", error);
      alert("Failed to fetch student course data");
    }
  };

  const handleSearch = () => {
    fetchStudentCourseRecord();
  };

  useEffect(() => {
    handleSearch(); // Auto call on page load
  }, []);

  const handleInputChange = (e) => {
    if (isDisabled) return;

    const { name, value } = e.target;

    if (name === "house") {
      if (value) {
        localStorage.setItem("selectedHouseId", value);
      } else {
        localStorage.removeItem("selectedHouseId");
      }
    }

    if (name === "feeappfrom") {
      if (value) {
        localStorage.setItem("selectedFeeAppFromId", value);
      } else {
        localStorage.removeItem("selectedFeeAppFromId");
      }
    }

    if (name === "feegroup") {
      if (value) {
        localStorage.setItem("selectedFeeGroupId", value);
      } else {
        localStorage.removeItem("selectedFeeGroupId");
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTransportAvailedChange = () => {
    if (!isTransportEditable) return;

    const newValue = !isTransportAvailed;
    setIsTransportAvailed(newValue);

    if (!newValue) {
      // 🔴 Transport unchecked → clear everything
      setSelectedRoute("");
      setSelectedPickUpPoint("");

      setSelectedMonths({});
      setFormData((prev) => ({
        ...prev,
        transport_availed: false,
        routeid: "",
        selectedPickUpPoint: "",
        choice_month: [],
        amount: "",
      }));

      localStorage.removeItem("choice_month");
      localStorage.removeItem("selectedRouteId");
    } else {
      // 🟢 Transport checked → allow user selection
      setFormData((prev) => ({
        ...prev,
        transport_availed: true,
      }));
    }
  };

  // const handleMonthChange = (monthId) => {
  //   setSelectedMonths((prev) => {
  //     const updatedMonths = {
  //       ...prev,
  //       [monthId]: !prev[monthId], // Toggle the specific month's checked state
  //     };

  //     const selectedMonthIds = Object.keys(updatedMonths)
  //       .filter((month) => updatedMonths[month])
  //       .map((month) => parseInt(month));

  //     setFormData((prevData) => ({
  //       ...prevData,
  //       choice_month: selectedMonthIds,
  //     }));

  //     if (isTransportAvailed) {
  //       localStorage.setItem("choice_month", JSON.stringify(selectedMonthIds));
  //     }

  //     return updatedMonths;
  //   });
  // };

  //12182025

  const handleMonthChange = (monthId) => {
    // 🔒 Do not allow change for PAID semesters only (flag="no")
    if (paidSemesters.includes(monthId)) return;

    setSelectedMonths((prev) => {
      const updatedMonths = {
        ...prev,
        [monthId]: !prev[monthId], // Toggle checkbox
      };

      const selectedMonthIds = Object.keys(updatedMonths)
        .filter((month) => updatedMonths[month])
        .map((month) => parseInt(month));

      setFormData((prevData) => ({
        ...prevData,
        choice_month: selectedMonthIds,
      }));

      if (isTransportAvailed) {
        localStorage.setItem("choice_month", JSON.stringify(selectedMonthIds));
      }

      return updatedMonths;
    });
  };

  const handleRouteChange = (e) => {
    if (!isTransportEditable) return;

    const routeId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      routeid: routeId,
      selectedPickUpPoint: "", // reset pickup point
      amount: "",
    }));
  };

  useEffect(() => {
    const savedRouteId = localStorage.getItem("selectedRouteId");
    if (savedRouteId) {
      setSelectedRoute(savedRouteId);
      setFormData((prev) => ({
        ...prev,
        route_id: savedRouteId,
      }));
    }
  }, []);

  // 12-18-2025
  const handlePickUpPointChange = (e) => {
    const pickupId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      selectedPickUpPoint: pickupId,
    }));
  };

  const handleSaveStudentCourse = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const userId = sessionStorage.getItem("userId") || sessionStorage.getItem("login_id");

      if (!selectedStudent?.student_id) {
        alert("Student ID missing");
        return;
      }

      if (!userId) {
        alert("User ID is missing in session!");
        return;
      }

      // ✅ Send ALL currently selected semesters (excluding paid ones)
      const paidSet = new Set(paidSemesters.map(Number));
      
      const semestersToSend = Object.keys(selectedMonths)
        .filter(
          (semesterId) =>
            selectedMonths[semesterId] === true && // Currently checked
            !paidSet.has(Number(semesterId)) // Not already paid
        )
        .map(Number);

      console.log("🚀 Semesters to send (ALL selected, excluding paid):", semestersToSend);

      // 🔥 Use Transport API (like TransportSearch) for updating transport details
      const payload = {
        student_id: Number(selectedStudent.student_id),
        transport_avail: isTransportAvailed,
        choice_semesters: semestersToSend, // ALL selected (excluding paid)
        route_id: isTransportAvailed ? Number(formData.routeid) : null,
        pickup_point_id: isTransportAvailed ? Number(formData.selectedPickUpPoint) : null,
        amount: isTransportAvailed ? Number(formData.amount) : 0,
        created_by: Number(userId),
      };

      console.log("UPDATE PAYLOAD 👉", payload);

      const response = await fetch(
        `${ApiUrl.apiurl}Transport/UpdateStudentTransport/`,
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

      if (response.ok) {
        alert("✅ Student Transport Updated Successfully");
        handleModalClose();
        fetchStudentCourseRecord(); // refresh table
      } else {
        console.error("API Error:", result);
        alert(result.message || result.error || "Update failed");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Something went wrong while saving: " + error.message);
    }
  };

  useEffect(() => {
    if (formData.routeid && formData.selectedPickUpPoint) {
      // Skip once on initial form population — we already have the real saved amount
      if (skipAmountAutoFill.current) {
        skipAmountAutoFill.current = false;
        return;
      }
      const org = sessionStorage.getItem("organization_id");
      const branch = sessionStorage.getItem("branch_id");
      const token = localStorage.getItem("accessToken"); // ✅ Get token

      fetch(
        `${ApiUrl.apiurl}Transport/GetAllPickupPointBasedOnRoute/?route_id=${formData.routeid}&organization_id=${org}&branch_id=${branch}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Add token
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          const list = data?.data || [];

          const match = list.find(
            (p) =>
              String(p.routeDetailsId) === String(formData.selectedPickUpPoint)
          );

          if (match) {
            setFormData((prev) => ({
              ...prev,
              amount: match.amount,
            }));
          }
        })
        .catch((err) =>
          console.error("Error fetching pickup point amount:", err)
        );
    }
  }, [formData.routeid, formData.selectedPickUpPoint]);

  useEffect(() => {
    fetchStudentCourseRecord();
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
                STUDENT COURSE
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={handleSearch}
                    style={{
                      width: "150px",
                    }}
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
                    onClick={() => navigate("/admin/dashboard")}
                    style={{
                      width: "150px",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mb-3 mt-3">
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="student-name" className="form-label">
                          Student Name
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="student-name"
                            className="form-control detail"
                            placeholder="Enter student name"
                            ref={studentNameRef}
                            disabled={isInputDisabled} // Dynamically control the disabled state
                            onInput={(e) => {
                              if (!e.target.value.trim()) {
                                localStorage.removeItem(
                                  "selectedClassStudentId"
                                );
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-primary ms-2 mb-0 mt-0"
                            onClick={() => setShowStudentSelectionModal(true)}
                            style={{ width: "50px", padding: "3px" }}
                          >
                            ...
                          </button>
                        </div>
                      </div>

                      <ModalClass
                        show={showStudentSelectionModal}
                        handleClose={handleModalClose}
                        onSelectStudent={(selected) => {
                          // 1️⃣ Set Student Name in input box
                          studentNameRef.current.value =
                            selected.studentBasicDetails.first_name || "";
                          setSelectedStudentName(
                            selected.studentBasicDetails.first_name || ""
                          );
                          // 3️⃣ Set Dropdown values from Modal
                          setSelectedBatch(selected.academicDetails.batch_id);
                          setSelectedCourse(selected.academicDetails.course_id);
                          setSelectedDepartment(
                            selected.academicDetails.department_id
                          );
                          setSelectedAcademicYear(
                            selected.academicDetails.academic_year_id
                          );
                          setSelectedSemester(
                            selected.academicDetails.semester_id
                          );
                          setSelectedSection(
                            selected.academicDetails.section_id
                          );
                          // 4️⃣ Save student ID also (optional)
                          setFormData((prev) => ({
                            ...prev,
                            studentId: selected.studentBasicDetails.id,
                          }));
                          // 5️⃣ Close modal
                          handleModalClose();
                        }}
                      />

                      {/* Batch */}
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="batch" className="form-label">
                          Session
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
                          className="detail"
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
                          className="detail"
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
                          className="detail"
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
                          className="detail"
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
                          className="detail"
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table" id="studentclassid">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Student Name</th>
                        <th>ONMRC Registration No</th>
                        <th>Admission No</th>
                        <th>BarCode</th>
                        <th>Session</th>
                        <th>Course</th>
                        <th>Department</th>
                        <th>Academic Year</th>
                        <th>Semester</th>
                        <th>Section</th>
                        <th>Father Name</th>
                        <th>Mother Name</th>
                        <th>House</th>
                        <th>Status</th>
                        <th>Transport Availed</th>

                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentStudents.length > 0 ? (
                        currentStudents.map((student, index) => (
                          <tr key={student.id}>
                            <td>{indexOfFirstItem + index + 1}</td>

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

                            <td>{student.house}</td>

                            <td>{student.student_status}</td>

                            <td>{student.transport_availed ? "Yes" : "No"}</td>

                            <td>
                              <button
                                className="btn btn-warning"
                                onClick={() => handleEditClick(student)}
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="12" className="text-center">
                            No students found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div className="modal show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-scrollable modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">View Student Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleModalClose}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row mb-2">
                  <div className="col-12" style={{ border: "1px solid #ccc" }}>
                    <h5>Student Details</h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">Student Name</label>
                    <input
                      type="text"
                      className="form-control detail"
                      value={selectedStudent?.studentname || ""}
                      disabled
                    />
                  </div>
                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">ONMRC Registration No</label>
                    <input
                      type="text"
                      className="form-control detail"
                      value={selectedStudent.registration_no}
                      disabled
                    />
                  </div>
                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">Admission No</label>
                    <input
                      type="text"
                      className="form-control detail"
                      value={selectedStudent.admission_no}
                      disabled
                    />
                  </div>
                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">Student Barcode</label>
                    <input
                      type="text"
                      className="form-control detail"
                      value={selectedStudent.barcode}
                      disabled
                    />
                  </div>
                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">Father Name</label>
                    <input
                      type="text"
                      className="form-control detail"
                      value={selectedStudent?.father_name || ""}
                      disabled
                    />
                  </div>

                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">Mother Name</label>
                    <input
                      type="text"
                      className="form-control detail"
                      value={selectedStudent?.mother_name || ""}
                      disabled
                    />
                  </div>
                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">Session</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedStudent?.batch || ""}
                      disabled
                    />
                  </div>

                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">Course</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedStudent?.course_name || ""}
                      disabled
                    />
                  </div>

                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedStudent?.department || ""}
                      disabled
                    />
                  </div>

                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">Academic Year</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedStudent?.academic_year || ""}
                      disabled
                    />
                  </div>

                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">Semester</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedStudent?.semester_name || ""}
                      disabled
                    />
                  </div>

                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">Section</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedStudent?.section_name || ""}
                      disabled
                    />
                  </div>

                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">House</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedStudent?.house || ""}
                      disabled
                    />
                  </div>
                </div>

                <div className="row mb-2" style={{ marginTop: "10px" }}>
                  <div className="col-12" style={{ border: "1px solid #ccc" }}>
                    <h5>Student Class Details</h5>
                  </div>
                </div>
                <div className="row"></div>

                <div className="row">
                  <div className="col-12 border">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-6 mb-1">
                        <label className="form-label">Fee App From</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.feeappfrom || ""}
                          disabled
                        />
                      </div>

                      <div className="col-12 col-md-6 mb-2">
                        <label className="form-label">Fee Group</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.feegroup || ""}
                          disabled
                        />
                      </div>
                    </div>
                    <div
                      className="col-12"
                      style={{ border: "1px solid #ccc", marginTop: "10px" }}
                    >
                      <h5>Transport Details</h5>
                    </div>
                    <Form.Check
                      type="checkbox"
                      className="mb-3 d-flex align-items-center"
                      style={{ fontWeight: "700" }}
                      checked={isTransportAvailed}
                      onChange={handleTransportAvailedChange}
                      // disabled={isDisabled}
                      disabled={!isTransportEditable}
                      label={
                        <span style={{ marginLeft: "10px" }}>
                          Transport Availed
                        </span>
                      }
                    />

                    {/* 🔥 Use actual semester data like TransportSearch */}
                    {semesterDataList.length > 0 && (
                      <div
                        style={{
                          maxHeight: "200px",
                          overflowY: "auto",
                          border: "1px solid #ccc",
                          padding: "10px",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        {semesterDataList.map((semesterData) => {
                          const semesterId = Number(semesterData.id);
                          const semesterName = semesterData.semester || `Semester ${semesterId}`;
                          
                          // 🔥 Use FLAG field to determine if paid (like EditTransportModal)
                          const isPaid = String(semesterData.flag).toLowerCase() === "no"; // "no" = paid
                          
                          return (
                            <div
                              key={semesterId}
                              style={{
                                flex: "1 1 calc(25% - 10px)",
                                minWidth: "120px",
                              }}
                            >
                              <Form.Check
                                type="checkbox"
                                id={`semester-${semesterId}`}
                                label={
                                  <span>
                                    {semesterName}
                                    {isPaid && (
                                      <span
                                        style={{
                                          marginLeft: "5px",
                                        }}
                                        title="This semester has been paid and cannot be modified"
                                      >
                                        {" 🔒"}
                                      </span>
                                    )}
                                  </span>
                                }
                                checked={selectedMonths[semesterId] || false}
                                onChange={() => handleMonthChange(semesterId)}
                                disabled={
                                  !isTransportEditable ||
                                  isPaid // 🔒 Only paid semesters are disabled
                                }
                                style={{
                                  opacity: (!isTransportEditable || isPaid) ? 0.6 : 1,
                                  cursor: (!isTransportEditable || isPaid) ? "not-allowed" : "pointer",
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <Row className="mt-3">
                      <Col md={6} className="mb-2">
                        <Form.Group controlId="formRoute">
                          <Form.Label>Route</Form.Label>
                          <Form.Select
                            onChange={handleRouteChange}
                            // disabled={!isTransportAvailed || isDisabled}
                            disabled={
                              !isTransportAvailed || !isTransportEditable
                            }
                            // value={selectedRoute || ""}
                            value={formData.routeid || ""}
                          >
                            <option value="">Select Route</option>
                            {routeLoading && <option>Loading...</option>}
                            {routeError && (
                              <option>Error loading routes</option>
                            )}
                            {!routeLoading &&
                              !routeError &&
                              routes.map((route) => (
                                <option key={route.id} value={route.id}>
                                  {route.transport_name}
                                </option>
                              ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-2">
                        <Form.Group controlId="formPickUpPoint">
                          <Form.Label>Pick Up Point</Form.Label>
                          <Form.Select
                            onChange={handlePickUpPointChange}
                            // disabled={
                            //   !isTransportAvailed ||
                            //   !formData.routeid ||
                            //   isDisabled
                            // }
                            disabled={
                              !isTransportAvailed ||
                              !formData.routeid ||
                              !isTransportEditable
                            }
                            value={formData.selectedPickUpPoint || ""}
                          >
                            <option value="">Select Pick Up Point</option>
                            {pickupLoading && <option>Loading...</option>}
                            {pickupError && (
                              <option>
                                Error loading pick-up points: {pickupError}
                              </option>
                            )}
                            {!pickupLoading &&
                              !pickupError &&
                              pickupPoints.map((pickupPoint) => (
                                <option
                                  key={pickupPoint.routeDetailsId}
                                  value={pickupPoint.routeDetailsId}
                                >
                                  {pickupPoint.pickup_point_name}
                                </option>
                              ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="amount" className="form-label">
                          Amount
                        </label>

                        <input
                          type="text"
                          id="amount"
                          value={formData.amount || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                          }
                          // disabled={!isTransportAvailed || isDisabled}
                          disabled={!isTransportAvailed || !isTransportEditable}
                          className="form-control detail"
                          placeholder="Enter amount"
                          onInput={(e) => {
                            const numericValue = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            setAmount(numericValue);
                          }}
                          // Disabled
                        />
                      </div>
                    </Row>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleModalClose}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveStudentCourse}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmAttendanceEntry;
