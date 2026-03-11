import React, { useState, useRef, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalConfirm from "./ModalConfirm";
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
    classId: "",
    sectionId: "",
    routeid: "",
    selectedPickUpPoint: "",
    feeappfrom: "",
    feegroup: "",
  });
  const [selectedClassId, setSelectedClassId] = useState("");
  const navigate = useNavigate();
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState("");

  const organizationId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedFeeGroup, setSelectedFeeGroup] = useState(null);
  const [dynamicFeeGroups, setDynamicFeeGroups] = useState([]);

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

  const [studentsData, setStudentsData] = useState([]);

  const [amount, setAmount] = useState("");
  const [previousYearBalance, setPreviousYearBalance] = useState("");

  const [isTransportAvailed, setIsTransportAvailed] = useState(false);

  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedAction, setSelectedAction] = useState(null);
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
  const [selectedPickUpPoint, setSelectedPickUpPoint] = useState("");

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
  } = useFeeGroups();
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transportData, setTransportData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loadingFilter, setLoadingFilter] = useState(false);

  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedStudentName, setSelectedStudentName] = useState("");

  const [filters, setFilters] = useState({
    batch_id: "",
    course_id: "",
    department_id: "",
    academic_year_id: "",
    semester_id: "",
    section_id: "",
  });
  const [initialChoiceSemesters, setInitialChoiceSemesters] = useState([]);
  const [allSemestersLocked, setAllSemestersLocked] = useState(false);

  const fetchFeeGroupsByCourse = async (orgId, academicYearId, courseId) => {
    try {
      const token = localStorage.getItem("accessToken"); // ✅ Get token
      const url = `${ApiUrl.apiurl}FeeStructure/GetAllFeeStructureBasedOnCourse/?organization_id=${orgId}&academic_year_id=${academicYearId}&course_id=${courseId}`;

      // const res = await fetch(url);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Add token
        },
      });
      const data = await res.json();

      if (data?.data?.length > 0) {
        setDynamicFeeGroups(data.data);
      } else {
        setDynamicFeeGroups([]);
      }
    } catch (err) {
      console.error("Error loading fee groups:", err);
      setDynamicFeeGroups([]);
    }
  };

  useEffect(() => {
    setFormData({
      classId: "",
      sectionId: "",
      routeid: "",
      selectedPickUpPoint: "",
      feeappfrom: "",
      feegroup: "",
    });
  }, []);

  useEffect(() => {
    const navType = performance.getEntriesByType("navigation")[0]?.type;

    const isHardReload = navType === "reload" || navType === "navigate"; // refresh or route enter

    if (isHardReload) {
      localStorage.removeItem("selectedStudentClassId");
      localStorage.removeItem("selectedStudentSectionId");
      localStorage.removeItem("selectedClassConfirmStudentId");
      localStorage.removeItem("status");
    }
  }, []);

  useEffect(() => {
    const orgId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");

    const studentId = selectedStudent?.student_id;
    const semesterId = selectedStudent?.semester_id;

    if (!orgId || !branchId || !studentId || !semesterId) return;

    const token = localStorage.getItem("accessToken"); // ✅ Get token

    const apiUrl = `${ApiUrl.apiurl}StudentCourse/GetPreviousYearFees/?organization_id=${orgId}&branch_id=${branchId}&student_id=${studentId}&semester_id=${semesterId}`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Add token
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success!!" && data.data) {
          setPreviousYearBalance(data.data.total_remaining_amount);
        }
      })
      .catch((error) => {
        console.error("Error fetching previous year balance:", error);
      });
  }, [selectedStudent]);

  const modalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isTransportAvailed) return;
    if (!routes?.length) return;
    if (!selectedStudent?.route_id) return;

    const routeId = Number(selectedStudent.route_id);

    const exists = routes.some((r) => Number(r.id) === routeId);

    if (exists) {
      setSelectedRoute(routeId);
      setFormData((prev) => ({
        ...prev,
        routeid: routeId,
      }));
    }
  }, [routes, selectedStudent, isTransportAvailed]);

  useEffect(() => {
    if (pickupPoints.length > 0) {
      // Try to reselect previously chosen pickup point
      const prevSelected = formData.selectedPickUpPoint;

      if (prevSelected) {
        const exists = pickupPoints.some(
          (p) => p.routeDetailsId === Number(prevSelected)
        );
        if (exists) {
          setSelectedPickUpPoint(prevSelected);
        } else {
          setSelectedPickUpPoint("");
          setFormData((prev) => ({ ...prev, selectedPickUpPoint: "" }));
        }
      } else {
        // If no pickup point selected yet, reset on route change
        setSelectedPickUpPoint("");
        setFormData((prev) => ({ ...prev, selectedPickUpPoint: "" }));
      }
    } else {
      // If no pickup points fetched, reset
      setSelectedPickUpPoint("");
      setFormData((prev) => ({ ...prev, selectedPickUpPoint: "" }));
    }
  }, [pickupPoints, formData.routeid]);

  useEffect(() => {
    if (!selectedFeeGroup) return;

    const allFeeGroups = [...(feeGroups || []), ...(dynamicFeeGroups || [])];

    const exists = allFeeGroups.some(
      (f) => Number(f.id) === Number(selectedFeeGroup)
    );

    if (exists) {
      setFormData((prev) => ({
        ...prev,
        feegroup: selectedFeeGroup,
      }));
    }
  }, [selectedFeeGroup, feeGroups, dynamicFeeGroups]);

  useEffect(() => {
    if (!selectedFeeGroup?.id) return;

    setFormData((prev) => ({
      ...prev,
      feegroup: String(selectedFeeGroup.id),
    }));
  }, [selectedFeeGroup]);

  const handleEditClick = async (student) => {
    try {
      setSelectedMonths({});
      setFormData((prev) => ({ ...prev, choice_month: [] }));

      const organizationId = sessionStorage.getItem("organization_id");
      const branchId = sessionStorage.getItem("branch_id");
      const token = localStorage.getItem("accessToken");

      const apiUrl = `${ApiUrl.apiurl}StudentCourse/StudentCourseConfirmRECORDFilter/?organization_id=${organizationId}&branch_id=${branchId}&student_id=${student.student_id}`;

      // const response = await fetch(apiUrl);
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Add token
        },
      });
      const result = await response.json();

      if (result.message === "success!!" && result.data?.length > 0) {
        const s = result.data[0];

        // Set student
        setSelectedStudent({
          student_id: s.student_id,
          studentname: s.student_name,
          admission_no: s.admission_no,
          college_admission_no: s.college_admission_no,
          barcode: s.barcode,
          fatherName: s.fatherName,
          motherName: s.motherName,
          student_status: s.student_status,
          batch_code: s.batch_code,
          course_name: s.course_name,
          department_description: s.department_description,
          academic_year_code: s.academic_year_code,
          semester_code: s.semester_code,
          section_name: s.section_name,
          semester_id: s.semester_id,
          transport_availed: s.transport_availed,
          route_id: s.route_id,
          pickup_point_id: s.pickup_point_id,
          choice_semester: s.choice_semester,
        });

        // Dropdown autofill
        setSelectedBatch(s.batch_id);
        setSelectedCourse(s.course_id);
        setSelectedDepartment(s.department_id);
        setSelectedAcademicYear(s.academic_year_id);
        setSelectedSemester(s.semester_id);
        setSelectedSection(s.section_id);
        setSelectedRoute(s.route_id || "");
        setSelectedHouse(s.house_id || "");
        setFormData((prev) => ({
          ...prev,
          house_id: s.house_id || "",
        }));

        // Always store fee_group_id in state ONLY
        // ⭐⭐⭐ FEE GROUP FIX (FINAL) ⭐⭐⭐
        setSelectedFeeGroup({
          id: s.fee_group_id,
          label: s.fee_group,
        });

        // fetch dynamic if needed
        if (!s.fee_group_id) {
          await fetchFeeGroupsByCourse(
            s.organization_id,
            s.academic_year_id,
            s.course_id
          );
        }

        // Transport
        setIsTransportAvailed(s.transport_availed);
        setSelectedRoute(s.route_id || "");
        setSelectedPickUpPoint(s.pickup_point_id || "");

        // Monthly semester fix
        let selectedSemesters = [];

        if (s.choice_semester) {
          try {
            selectedSemesters = Array.isArray(s.choice_semester)
              ? s.choice_semester
              : JSON.parse(s.choice_semester);
          } catch {
            selectedSemesters = [];
          }
        }

        // const checked = {};
        // selectedSemesters.forEach((id) => (checked[id] = true));

        // setSelectedMonths(checked);
        // setFormData((prev) => ({
        //   ...prev,
        //   choice_month: selectedSemesters,
        // }));

        const checked = {};
        selectedSemesters.forEach((id) => (checked[id] = true));

        setInitialChoiceSemesters(selectedSemesters); // ⭐ store original
        setSelectedMonths(checked);

        // 🔒 check if ALL semesters are already selected
        if (periods.length > 0 && selectedSemesters.length === periods.length) {
          setAllSemestersLocked(true); // disable all
        } else {
          setAllSemestersLocked(false);
        }

        setCurrentStudentId(student.student_id);
        setShowEditModal(true);
      } else {
        alert("No record found!");
      }
    } catch (error) {
      console.error("Error fetching record:", error);
      alert("Failed to fetch student details.");
    }
  };

  useEffect(() => {
    if (!showEditModal || !currentStudentId) return;

    const organizationId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");
    const token = localStorage.getItem("accessToken"); // ✅ Get token

    const apiUrl = `${ApiUrl.apiurl}StudentCourse/StudentCourseConfirmRECORDFilter/?organization_id=${organizationId}&branch_id=${branchId}&student_id=${currentStudentId}`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Add token
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.message === "success!!" && result.data?.length > 0) {
          const s = result.data[0];

          // 🧡 SET STUDENT DISPLAY FIELDS
          setSelectedStudent({
            student_id: s.student_id,
            studentname: s.student_name,
            admission_no: s.admission_no,
            college_admission_no: s.college_admission_no,
            barcode: s.barcode,
            fatherName: s.fatherName,
            motherName: s.motherName,
            student_status: s.student_status,
            semester_id: s.semester_id,
            batch_code: s.batch_code,
            course_name: s.course_name,
            department_description: s.department_description,
            academic_year_code: s.academic_year_code,
            semester_code: s.semester_code,
            section_name: s.section_name,
          });

          // 🧡 UPDATE DROPDOWN VALUES
          setSelectedBatch(s.batch_id);
          setSelectedCourse(s.course_id);
          setSelectedDepartment(s.department_id);
          setSelectedAcademicYear(s.academic_year_id);
          setSelectedSemester(s.semester_id);
          setSelectedSection(s.section_id);

          // 🧡 SET TRANSPORT FIELDS
          setIsTransportAvailed(s.transport_availed === true);
          setSelectedRoute(s.route_id || "");
          setSelectedPickUpPoint(s.pickup_point_id || "");

          // 🧡 SET MONTH CHECKBOXES (choice_semester)
          if (s.choice_semester) {
            const months = JSON.parse(s.choice_semester); // e.g., "[1,2,3]"
            const obj = {};

            months.forEach((id) => {
              obj[id] = true;
            });

            setSelectedMonths(obj);

            setFormData((prev) => ({
              ...prev,
              choice_month: months,
            }));
          } else {
            setSelectedMonths({});
          }

          // 🧡 UPDATE FORM DATA
          setFormData((prev) => ({
            ...prev,
            feeappfrom: s.fee_applied_from_id,
            feegroup: s.fee_group_id,
            routeid: s.route_id || "",
            selectedPickUpPoint: s.pickup_point_id || "",
            amount: s.amount || "",
            transportAvailed: s.transport_availed || false,
          }));
        }
      });
  }, [showEditModal]);

  useEffect(() => {
    if (formData.classId) {
    }
  }, [formData.classId]);

  const [error, setError] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState({});

  const handleStudentSelect = (data) => {
    setFormData((prev) => ({
      ...prev,
      studentId: data.studentId,
      student_name: data.student_name,
      admission_no: data.admission_no,
      college_admission_no: data.college_admission_no,
      barcode: data.barcode,
      batch: data.batch_code,
      course: data.course_name,
      department: data.department_description,
      academic_year: data.academic_year_code,
      semester: data.semester_code,
      section: data.section_name,
      status: data.student_status,
    }));
  };

  const handleModalClose = () => {
    // Clear specific fields in localStorage
    const fieldsToClear = [
      "selectedFeeStudentId",
      "studentData",
      "selectedFeeAppFromId",
      "selectedFeeGroupId",
      "transport_availed",
      "choice_month",
      "selectedRouteId",
      "selectedPickUpPointId",
      "previousYearBalance",
      "selectedStudentClassId", // 🔹 also clear classId
      "selectedStudentSectionId", // 🔹 also clear sectionId
    ];

    fieldsToClear.forEach((field) => localStorage.removeItem(field));

    // ✅ Reset class and section in formData
    setFormData((prev) => ({
      ...prev,
      classId: "",
      sectionId: "",
    }));

    // ✅ Reset selectedClassId state too
    setSelectedClassId("");

    // Close the modals
    setShowEditModal(false);
    setShowStudentSelectionModal(false);
  };

  const handleSaveChanges = () => {
    const login_id = sessionStorage.getItem("userId");
    const organization_id = sessionStorage.getItem("organization_id");
    const branch_id = sessionStorage.getItem("branch_id");
    const token = localStorage.getItem("accessToken"); // ✅ Get token

    const student_id = selectedStudent?.student_id;
    if (!student_id) {
      alert("Student ID not found!");
      return;
    }

    const batch_id = selectedBatch;
    const course_id = selectedCourse;
    const department_id = selectedDepartment;
    const academic_year_id = selectedAcademicYear;
    const semester_id = selectedSemester;
    const section_id = selectedSection;

    const fee_group_id = formData.feegroup;
    const fee_applied_from_id = formData.feeappfrom;

    if (!fee_group_id || !fee_applied_from_id) {
      alert("Fee Group and Fee App From are mandatory.");
      return;
    }

    // Build correct format for choice_semester
    // const choice_semester = Object.keys(selectedMonths)
    //   .filter((id) => selectedMonths[id])
    //   .map((id) => Number(id));

    const choice_semester = Object.keys(selectedMonths)
      .filter(
        (id) =>
          selectedMonths[id] === true &&
          !initialChoiceSemesters.includes(Number(id)) // ⭐ only NEW
      )
      .map((id) => Number(id));

    const route_id = formData.routeid || 0;
    const amount = formData.amount || 0;
    const previous_year_balance = previousYearBalance || 0;

    const update_or_confirm = "C";
    const carry_or_delete = selectedAction === "Carry Forward" ? "Y" : "Y";

    const hasNewSemesters = choice_semester.length > 0;

    // ✅ FINAL PAYLOAD CORRECT FORMAT
    const payload = {
      login_id: Number(login_id),
      organization_id: Number(organization_id),
      branch_id: Number(branch_id),
      batch_id: Number(batch_id),
      course_id: Number(course_id),
      department_id: Number(department_id),
      academic_year_id: Number(academic_year_id),
      semester_id: Number(semester_id),
      section_id: Number(section_id),
      enrollment_no: Number(selectedStudent?.admission_no),
      house_id: Number(selectedHouse),
      fee_group_id: Number(fee_group_id),
      fee_applied_from_id: Number(fee_applied_from_id),
      transport_availed: isTransportAvailed ? true : false,
      choice_semester,
      route_id: Number(route_id),
      amount: Number(amount),
      previous_year_balance: Number(previous_year_balance),
      update_or_confirm,
      carry_or_delete,
    };

    // ✅ ONLY ADD IF NEEDED
    if (hasNewSemesters && !allSemestersLocked) {
      payload.choice_semester = choice_semester;
    }
    console.log("Final Payload Payload ⬇⬇⬇", payload);

    const url = `${ApiUrl.apiurl}StudentCourse/UpdateStudentCourse/?student_id=${student_id}&is_promoted=true`;

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Add token
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Update Response:", data);

        if (data.message) alert(data.message);
        else alert("✅ Student Updated Successfully!");

        setShowEditModal(false);
        // handleSearch();
        // ✅ Remove only confirmed student from table
        setFilteredStudents((prev) =>
          prev.filter((s) => s.student_id !== selectedStudent.student_id)
        );

        // ✅ CLEAR MAIN PAGE DROPDOWNS
        setSelectedBatch(null);
        setSelectedCourse(null);
        setSelectedDepartment(null);
        setSelectedAcademicYear(null);
        setSelectedSemester(null);
        setSelectedSection(null);

        // ✅ Clear status dropdown
        setSelectedStatus(null);

        // ✅ Clear student name input
        if (studentNameRef.current) {
          studentNameRef.current.value = "";
        }

        // ✅ Clear related localStorage filters
        const keysToRemove = [
          "selectedClassConfirmStudentId",
          "selectedStudentClassId",
          "selectedStudentSectionId",
          "status",
        ];
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      })
      .catch((err) => {
        console.error("Update Error:", err);
        alert("Something went wrong while saving changes.");
      });
  };

  const handleClear = () => {
    // 🔹 Reset form data fields
    setFormData({
      classId: "",
      sectionId: "",
      routeid: "",
      selectedPickUpPoint: "",
      feeappfrom: "",
      feegroup: "",
    });

    // 🔹 Reset dropdown selections
    setSelectedBatch(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
    setSelectedStudentName("");

    // 🔹 Reset input fields
    if (studentNameRef.current) {
      studentNameRef.current.value = "";
    }

    // 🔹 Clear table and status
    setStudentsData([]);
    setSelectedStatus(null);

    // 🔹 Clear localStorage values used for filtering/searching
    const keysToRemove = [
      "selectedStudentClassId",
      "selectedStudentSectionId",
      "selectedClassConfirmStudentId",
      "status",
    ];
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    console.log("✅ All fields cleared successfully.");
  };

  useEffect(() => {
    if (selectedClassId) {
    }
  }, [selectedClassId]);

  // Load Periods (Semesters)
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
        setPeriods(data || []); // ✔ only set periods
      })
      .catch(() => setError("Failed to load semesters."));
  }, [selectedBatch, selectedCourse, selectedDepartment]);

  // 🔥 Apply checked values ONLY after periods load
  useEffect(() => {
    if (!periods || periods.length === 0) return;
    if (!formData.choice_month || formData.choice_month.length === 0) return;

    const obj = {};
    formData.choice_month.forEach((id) => {
      obj[id] = true;
    });

    setSelectedMonths(obj);
  }, [periods, formData.choice_month]);

  const handleSearch = async () => {
    const organization_id = sessionStorage.getItem("organization_id") || 1;
    const branch_id = sessionStorage.getItem("branch_id") || 1;
    const token = localStorage.getItem("accessToken");

    // Build query params dynamically
    const params = new URLSearchParams({
      organization_id,
      branch_id,
    });

    // ✅ ADD STUDENT NAME FILTER
    if (selectedStudentName) {
      params.append("student_name", selectedStudentName);
    }

    if (selectedBatch) params.append("batch_id", selectedBatch);
    if (selectedCourse) params.append("course_id", selectedCourse);
    if (selectedDepartment) params.append("department_id", selectedDepartment);
    if (selectedAcademicYear)
      params.append("academic_year_id", selectedAcademicYear);
    if (selectedSemester) params.append("semester_id", selectedSemester);
    if (selectedSection) params.append("section_id", selectedSection);

    const apiUrl = `${
      ApiUrl.apiurl
    }StudentCourse/StudentCourseConfirmRECORDFilter/?${params.toString()}`;
    console.log("📡 Fetching Filtered Data:", apiUrl);

    try {
      setLoadingFilter(true);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log("✅ Filtered Result:", result);

      if (response.ok) {
        setFilteredStudents(result.data || []);
      } else {
        alert("⚠️ Failed to fetch filtered data!");
        setFilteredStudents([]);
      }
    } catch (error) {
      console.error("🚨 Error fetching filtered students:", error);
      alert("Something went wrong while fetching data.");
    } finally {
      setLoadingFilter(false);
    }
  };

  const handleConfirmSelectStudent = (data) => {
    const basic = data.studentBasicDetails;
    const academic = data.academicDetails;

    setFormData((prev) => ({
      ...prev,
      studentId: basic.id,
      student_name: basic.first_name,
      admission_no: basic.admission_no,
      college_admission_no: basic.school_admission_no,
      barcode: basic.barcode,
      batch: academic.batch_id,
      course: academic.course_id,
      department: academic.department_id,
      academic_year: academic.academic_year_id,
      semester: academic.semester_id,
      section: academic.section_id,
    }));

    // set dropdown selected values
    setSelectedBatch(academic.batch_id);
    setSelectedCourse(academic.course_id);
    setSelectedDepartment(academic.department_id);
    setSelectedAcademicYear(academic.academic_year_id);
    setSelectedSemester(academic.semester_id);
    setSelectedSection(academic.section_id);

    setShowStudentSelectionModal(false);
  };

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
    if (isDisabled) return;

    const checked = !isTransportAvailed;
    setIsTransportAvailed(checked);

    // Do NOT reset semesters ✔
    setFormData((prev) => ({
      ...prev,
      transport_availed: checked,
    }));

    localStorage.setItem("transport_availed", JSON.stringify(checked));
  };

  const handleMonthChange = (monthId) => {
    if (isDisabled) return;

    const isCurrentlySelected = selectedMonths[monthId] || false;

    const updatedMonths = {
      ...selectedMonths,
      [monthId]: !isCurrentlySelected,
    };

    setSelectedMonths(updatedMonths);

    const selectedMonthIds = Object.keys(updatedMonths)
      .filter((key) => updatedMonths[key] === true) // Only include months that are checked
      .map((key) => parseInt(key));

    setFormData((prevData) => ({
      ...prevData,
      choice_month: selectedMonthIds, // Pass the selected months array
    }));

    const currentMonths = JSON.parse(
      localStorage.getItem("choice_month") || "[]"
    );

    if (!isCurrentlySelected) {
      currentMonths.push(parseInt(monthId)); // Add to localStorage
      localStorage.setItem("choice_month", JSON.stringify(currentMonths));
    } else {
      const updatedStorageMonths = currentMonths.filter(
        (id) => id !== parseInt(monthId)
      );
      localStorage.setItem(
        "choice_month",
        JSON.stringify(updatedStorageMonths) // Update localStorage
      );
    }
  };

  const handleRouteChange = (e) => {
    if (isDisabled) return;

    const selectedRouteId = e.target.value;
    console.log("Selected Route ID:", selectedRouteId);

    if (!selectedRouteId) {
      localStorage.removeItem("selectedRouteId");
      setSelectedRoute("");
      setFormData((prevData) => ({
        ...prevData,
        routeid: "",
      }));
    } else {
      localStorage.setItem("selectedRouteId", selectedRouteId);
      setSelectedRoute(selectedRouteId);
      setFormData((prevData) => ({
        ...prevData,
        routeid: selectedRouteId,
      }));
    }
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

  const handlePickUpPointChange = (e) => {
    if (isDisabled) return;

    const selectedPickupPointId = e.target.value;

    if (!selectedPickupPointId) {
      localStorage.removeItem("selectedPickUpPointId");
      setSelectedPickUpPoint("");
      setFormData((prevData) => ({
        ...prevData,
        selectedPickUpPoint: "",
      }));
    } else {
      localStorage.setItem("selectedPickUpPointId", selectedPickupPointId);
      setSelectedPickUpPoint(selectedPickupPointId);
      setFormData((prevData) => ({
        ...prevData,
        selectedPickUpPoint: selectedPickupPointId,
      }));
    }
  };

  // ✅ Auto-update amount when Route or Pickup Point changes
  useEffect(() => {
    const orgId = sessionStorage.getItem("organization_id") || 1;
    const branchId = sessionStorage.getItem("branch_id") || 1;
    const token = localStorage.getItem("accessToken"); // ✅ Get token

    if (formData.routeid && formData.selectedPickUpPoint) {
      const url = `${ApiUrl.apiurl}Transport/GetAllPickupPointBasedOnRoute/?route_id=${formData.routeid}&organization_id=${orgId}&branch_id=${branchId}`;

      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Add token
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.data?.length > 0) {
            // 🔥 FIXED: compare using routeDetailsId
            const match = data.data.find(
              (p) => p.routeDetailsId === Number(formData.selectedPickUpPoint)
            );

            if (match) {
              setFormData((prev) => ({
                ...prev,
                amount: match.amount || "",
              }));
            } else {
              setFormData((prev) => ({
                ...prev,
                amount: "",
              }));
            }
          }
        });
    } else {
      setFormData((prev) => ({
        ...prev,
        amount: "",
      }));
    }
  }, [formData.routeid, formData.selectedPickUpPoint]);

  useEffect(() => {
    const storedStatus = localStorage.getItem("status");
    if (storedStatus) {
      const statusMap = {
        Promoted: { value: "A", label: "Promoted" },
        Demoted: { value: "B", label: "Demoted" },
        Fail: { value: "C", label: "Fail" },
      };
      setSelectedStatus(statusMap[storedStatus] || null);
    }
  }, []);

  const handleStatusChange = (event) => {
    const statusValue = event.target.value;

    if (statusValue === "") {
      localStorage.removeItem("status");
      setSelectedStatus(null);
    } else {
      let statusName = "";
      switch (statusValue) {
        case "A":
          statusName = "Promoted";
          break;
        case "B":
          statusName = "Demoted";
          break;
        case "C":
          statusName = "Fail";
          break;
        default:
          statusName = "";
      }
      localStorage.setItem("status", statusName);
    }
  };

  //New code
  // ✅ Keep only one pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const studentsPerPage = 10;

  // ✅ ReactPaginate handler
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // ✅ Slice studentsData based on page
  const offset = currentPage * studentsPerPage;
  const currentStudents = studentsData.slice(offset, offset + studentsPerPage);

  // ✅ Page count based on studentsData
  const pageCount = Math.ceil(studentsData.length / studentsPerPage);

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
                STUDENT CONFIRM
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
                <div className="col-12 custom-section-box ">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mb-4 mt-3">
                      <div className="col-12 col-md-3 ">
                        <label htmlFor="student-name" className="form-label">
                          Student Name
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="student-name"
                            className="form-control detail"
                            placeholder="Enter student name"
                            disabled={isInputDisabled}
                            ref={studentNameRef}
                            onInput={(e) => {
                              if (!e.target.value.trim()) {
                                localStorage.removeItem(
                                  "selectedClassConfirmStudentId"
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

                      <ModalConfirm
                        show={showStudentSelectionModal}
                        handleClose={handleModalClose}
                        onSelectStudent={(student) => {
                          // Fill the input text
                          studentNameRef.current.value = student.studentname;
                          setSelectedStudentName(student.studentname);

                          // Save student ID
                          localStorage.setItem(
                            "selectedClassConfirmStudentId",
                            student.studentId
                          );

                          // Auto-fill dropdowns
                          setSelectedBatch(student.batch_id);
                          setSelectedCourse(student.course_id);
                          setSelectedDepartment(student.department_id);
                          setSelectedAcademicYear(student.academic_year_id);
                          setSelectedSemester(student.semester_id);
                          setSelectedSection(student.section_id);

                          // Update formData
                          setFormData((prev) => ({
                            ...prev,
                            studentId: student.studentId,
                            student_name: student.studentname,
                            admission_no: student.admission_no,
                            barcode: student.barcode,
                            batch: student.batch_code,
                            course: student.course_name,
                            department: student.department_description,
                            academic_year: student.academic_year_code,
                            semester: student.semester_code,
                            section: student.section_name,
                          }));

                          handleModalClose();
                        }}
                      />
                      {/* Batch */}
                      <div className="col-12 col-md-3 mb-2">
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
                      <div className="col-12 col-md-3 mb-2">
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
                      <div className="col-12 col-md-3 mb-2">
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
                      <div className="col-12 col-md-3 mb-2">
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
                      <div className="col-12 col-md-3 mb-2">
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
                      <div className="col-12 col-md-3 mb-2">
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

                      {/* Status*/}
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="status" className="form-label">
                          Status
                        </label>
                        {/* <Select
                          id="status"
                          className=" detail"
                          options={[
                            { value: "A", label: "Promoted" },
                            { value: "B", label: "Demoted" },
                            { value: "C", label: "Fail" },
                          ]}
                          placeholder="Select Status"
                          isClearable
                          onChange={(selectedOption) =>
                            handleStatusChange({
                              target: {
                                value: selectedOption
                                  ? selectedOption.value
                                  : "",
                              },
                            })
                          }
                        /> */}
                        <Select
                          id="status"
                          className="detail"
                          options={[
                            { value: "A", label: "Promoted" },
                            { value: "B", label: "Demoted" },
                            { value: "C", label: "Fail" },
                          ]}
                          placeholder="Select Status"
                          isClearable
                          value={selectedStatus} // 🔥 CONTROLLED VALUE
                          onChange={(selectedOption) => {
                            setSelectedStatus(selectedOption); // 🔥 Update state
                            handleStatusChange({
                              target: {
                                value: selectedOption
                                  ? selectedOption.value
                                  : "",
                              },
                            });
                          }}
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
                        <th>Seriel No</th>
                        <th>Student Name</th>
                        <th>ONMRC Registration No</th>
                        <th>Admission No</th>
                        <th>Barcode</th>
                        <th>Session</th>
                        <th>Course</th>
                        <th>Department</th>
                        <th>Academic Year</th>
                        <th>Semester</th>
                        <th>Section</th>
                        <th>Father Name</th>
                        <th>Mother Name</th>
                        <th>Status</th>
                        <th>Confirm</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                          <tr key={student.student_id || index}>
                            <td>{index + 1}</td>
                            <td>{student.student_name}</td>
                            <td>{student.registration_no}</td>
                            <td>{student.college_admission_no}</td>
                            <td>{student.barcode}</td>
                            <td>{student.batch_code}</td>
                            <td>{student.course_name}</td>
                            <td>{student.department_description}</td>
                            <td>{student.academic_year_code}</td>
                            <td>{student.semester_code}</td>
                            <td>{student.section_name}</td>
                            <td>{student.fatherName}</td>
                            <td>{student.motherName}</td>
                            <td>{student.student_status}</td>
                            <td>
                              <button
                                className="btn btn-warning"
                                onClick={() => handleEditClick(student)}
                              >
                                Confirm
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="15" className="text-center">
                            No records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {studentsData.length > studentsPerPage && (
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

      {showEditModal && selectedStudent && (
        <div className="modal show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-scrollable modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Student Details</h5>
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
                    <label className="form-label">College Admission No</label>
                    <input
                      type="text"
                      className="form-control detail"
                      value={selectedStudent.college_admission_no}
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
                      value={selectedStudent?.fatherName || ""}
                      disabled
                    />
                  </div>

                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">Mother Name</label>
                    <input
                      type="text"
                      className="form-control detail"
                      value={selectedStudent?.motherName || ""}
                      disabled
                    />
                  </div>
                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">Session</label>
                    <input
                      type="text"
                      className="form-control detail"
                      value={selectedStudent?.batch_code || ""}
                      disabled
                    />
                  </div>
                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">Course</label>
                    <input
                      type="text"
                      className="form-control detail"
                      value={selectedStudent?.course_name || ""}
                      disabled
                    />
                  </div>
                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      className="form-control detail"
                      value={selectedStudent?.department_description || ""}
                      disabled
                    />
                  </div>
                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">Academic Year</label>
                    <input
                      type="text"
                      className="form-control detail"
                      value={selectedStudent?.academic_year_code || ""}
                      disabled
                    />
                  </div>
                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">Semester</label>
                    <input
                      type="text"
                      className="form-control detail"
                      value={selectedStudent?.semester_code || ""}
                      disabled
                    />
                  </div>
                  <div className="col-12 col-md-3 mb-2">
                    <label className="form-label">Section</label>
                    <input
                      type="text"
                      className="form-control detail"
                      value={selectedStudent?.section_name || ""}
                      disabled
                    />
                  </div>

                  <Col md={3} className="mb-2">
                    <Form.Group controlId="formHouse">
                      <Form.Label>House</Form.Label>
                      <Form.Select
                        value={selectedHouse || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedHouse(value);

                          setFormData((prev) => ({
                            ...prev,
                            house_id: value,
                          }));
                        }}
                        style={{
                          pointerEvents: "none",
                          backgroundColor: "#e9ecef",
                        }}
                      >
                        <option value="">Select House</option>
                        {houses.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.house_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </div>

                <div className="row mb-2" style={{ marginTop: "10px" }}>
                  <div className="col-12" style={{ border: "1px solid #ccc" }}>
                    <h5>Student Class Details</h5>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 border">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-6 mb-1">
                        <label htmlFor="fee-app-from" className="form-label">
                          Fee App From<span style={{ color: "red" }}>*</span>
                        </label>
                        {error ? (
                          <p style={{ color: "red" }}>{error}</p>
                        ) : (
                          <select
                            id="fee-app-from"
                            className="form-select"
                            value={formData.feeappfrom}
                            onChange={handleInputChange}
                            name="feeappfrom"
                            // disabled={isDisabled}
                            disabled
                          >
                            <option value="">Select Fee App From</option>
                            {periods.map((sem) => (
                              <option key={sem.id} value={sem.id}>
                                {sem.semester_description}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div className="col-12 col-md-6 mb-2">
                        <label htmlFor="fee-group" className="form-label">
                          Fee Group<span style={{ color: "red" }}>*</span>
                        </label>
                        {feeLoading ? (
                          <p>Loading fee groups...</p>
                        ) : feeError ? (
                          <p style={{ color: "red" }}>
                            Error loading fee groups: {feeError}
                          </p>
                        ) : (
                          <select
                            id="fee-group"
                            className="form-select"
                            value={formData.feegroup || ""}
                            onChange={handleInputChange}
                            name="feegroup"
                            disabled
                          >
                            <option value="">Select Fee Group</option>

                            {/* 🔥 FORCE SELECTED VALUE */}
                            {selectedFeeGroup?.id && (
                              <option value={selectedFeeGroup.id}>
                                {selectedFeeGroup.label}
                              </option>
                            )}

                            {/* Normal Fee Groups */}
                            {feeGroups.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.fee_structure_description}
                              </option>
                            ))}

                            {dynamicFeeGroups.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.fee_structure_description}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                    <div
                      className="col-12"
                      style={{ border: "1px solid #ccc" }}
                    >
                      <h5>Transport Details</h5>
                    </div>
                    <Form.Check
                      type="checkbox"
                      className="mb-3 d-flex align-items-center"
                      style={{ fontWeight: "700" }}
                      checked={isTransportAvailed}
                      onChange={handleTransportAvailedChange}
                      disabled={isDisabled}
                      label={
                        <span style={{ marginLeft: "10px" }}>
                          Transport Availed
                        </span>
                      }
                    />

                    {periods.length > 0 && (
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
                        {periods.map((sem) => (
                          <div
                            key={sem.id}
                            style={{
                              flex: "1 1 calc(25% - 10px)",
                              minWidth: "100px",
                            }}
                          >
                            {/* <Form.Check
                              type="checkbox"
                              id={`semester-${sem.id}`}
                              label={sem.semester_description}
                              checked={selectedMonths[sem.id] || false}
                              onChange={() => handleMonthChange(sem.id)}
                              disabled={isDisabled}
                            /> */}
                            <Form.Check
                              type="checkbox"
                              id={`semester-${sem.id}`}
                              label={sem.semester_description}
                              checked={selectedMonths[sem.id] || false}
                              onChange={() => handleMonthChange(sem.id)}
                              disabled={
                                allSemestersLocked || // 🔒 all locked
                                initialChoiceSemesters.includes(sem.id) // 🔒 already selected
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <Row className="mt-3">
                      <Col md={6} className="mb-2">
                        <Form.Group controlId="formRoute">
                          <Form.Label>Route</Form.Label>
                          <Form.Select
                            onChange={handleRouteChange}
                            disabled={!isTransportAvailed || isDisabled}
                            value={selectedRoute || ""}
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
                            disabled={
                              !isTransportAvailed ||
                              !formData.routeid ||
                              isDisabled
                            }
                            value={selectedPickUpPoint || ""}
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
                          disabled={!isTransportAvailed || isDisabled}
                          className="form-control detail"
                          placeholder="Enter amount"
                          onInput={(e) => {
                            const numericValue = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            setAmount(numericValue);
                          }}
                          Disabled
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label
                          htmlFor="previousYearBalance"
                          className="form-label"
                        >
                          Previous Semester Balance
                        </label>
                        <input
                          type="text"
                          id="previousYearBalance"
                          value={previousYearBalance}
                          className="form-control detail"
                          placeholder="Enter previous year balance"
                          onInput={(e) => {
                            const numericValue = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            setPreviousYearBalance(numericValue);
                          }}
                          disabled
                        />
                      </div>
                    </Row>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    // Reset main form fields but keep class/section
                    setFormData((prev) => ({
                      ...prev,
                      rollno: "",
                      house: "",
                      feeappfrom: "",
                      feegroup: "",
                      routeid: "",
                      selectedPickUpPoint: "",
                      amount: "",
                      transportAvailed: false,
                      selectedMonths: {},
                    }));

                    // Reset related state
                    setAmount("");
                    setSelectedRoute("");
                    setSelectedPickUpPoint("");
                    setIsTransportAvailed(false);

                    // Uncheck all 12-month checkboxes
                    const clearedMonths = Object.keys(selectedMonths).reduce(
                      (acc, monthId) => {
                        acc[monthId] = false;
                        return acc;
                      },
                      {}
                    );
                    setSelectedMonths(clearedMonths);

                    // Remove stored transport/fee selections
                    localStorage.removeItem("selectedHouseId");
                    localStorage.removeItem("selectedFeeAppFromId");
                    localStorage.removeItem("selectedFeeGroupId");
                    localStorage.removeItem("selectedRouteId");
                    localStorage.removeItem("selectedPickUpPointId");
                    localStorage.removeItem("choice_month");
                    localStorage.removeItem("transport_availed");
                  }}
                >
                  Clear
                </button>
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
                  onClick={handleSaveChanges}
                >
                  Save Changes
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
