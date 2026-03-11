import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, label } from "react-bootstrap";
// import SelectStudentModal from "../AdminAttendanceEntry/SelectStudentModal";
import { ApiUrl } from "../../../ApiUrl";
// import SelectStudentFeeModal from "../FeeStudentModal/SelectStudentFeeModal";
// import ModalClass from "../AdminStudentClass/ModalClass";
import ModalHostel from "./ModalHostel";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AdmAttendanceEntry = () => {
  const token = localStorage.getItem("accessToken");

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [classId, setClassId] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [classOptions, setClassOptions] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [sectionOptions, setSectionOptions] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [period, setPeriod] = useState(null);
  const [feePeriod, setFeePeriod] = useState(null);

  const [hostelData, setHostelData] = useState([]);
  const [pickupPoint, setPickupPoint] = useState(null);
  const [loading, setLoading] = useState(false);
  const orgId = localStorage.getItem("orgId");
  const branchId = localStorage.getItem("branchId");
  const academicyearId = localStorage.getItem("academicSessionId");
  const [showUnpaidFee, setShowUnpaidFee] = useState(false);
  // const [selectedFeePeriod, setSelectedFeePeriod] = useState("");
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
  const [semesterList, setSemesterList] = useState([]);

  const [selectedStudentAcademic, setSelectedStudentAcademic] = useState(null);

  const handleClear = () => {
    setStudentName("");
    setStudentId("");
    setSelectedStudentAcademic(null);

    setSelectedSession(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);

    setFeePeriod("");
    setHostelData([]);
    setShowUnpaidFee(false);
  };

  const handleClose = () => {
    navigate("/admin/dashboard");
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSelectStudent = (data) => {
    const fullName = [
      data.studentBasicDetails.first_name,
      data.studentBasicDetails.middle_name,
      data.studentBasicDetails.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    setStudentId(data.studentBasicDetails.id);
    setStudentName(fullName);

    setSelectedStudentAcademic(data.academicDetails); // add this line
    handleCloseModal();
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
    fetchSemesterList();
  }, [selectedSession, selectedCourse, selectedDepartment]);

  const fetchSemesterList = async () => {
    if (
      !selectedSession?.value ||
      !selectedCourse?.value ||
      !selectedDepartment?.value
    ) {
      setSemesterList([]);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const organization_id = sessionStorage.getItem("organization_id");
      const branch_id = sessionStorage.getItem("branch_id");

      const batch_id = selectedSession.value;
      const course_id = selectedCourse.value;
      const department_id = selectedDepartment.value;

      const url = `${ApiUrl.apiurl}Semester/GetSemesterByDepartment/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}`;

      console.log("Fetching Fee Period Semesters:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (Array.isArray(data)) {
        setSemesterList(data);
      } else if (data?.message === "Success" && Array.isArray(data.data)) {
        setSemesterList(data.data);
      } else {
        setSemesterList([]);
      }
    } catch (error) {
      console.error("Error fetching semester list:", error);
      setSemesterList([]);
    }
  };

  useEffect(() => {
    if (!selectedStudentAcademic) return;

    setSelectedSession(
      sessions.find((s) => s.value === selectedStudentAcademic.batch_id) || null
    );
    setSelectedCourse(
      courses.find((c) => c.value === selectedStudentAcademic.course_id) || null
    );
    setSelectedDepartment(
      departments.find(
        (d) => d.value === selectedStudentAcademic.department_id
      ) || null
    );
    setSelectedAcademicYear(
      academicYears.find(
        (a) => a.value === selectedStudentAcademic.academic_year_id
      ) || null
    );
    setSelectedSemester(
      semesters.find((s) => s.value === selectedStudentAcademic.semester_id) ||
        null
    );
    setSelectedSection(
      sections.find(
        (sec) => sec.value === selectedStudentAcademic.section_id
      ) || null
    );
  }, [
    sessions,
    courses,
    departments,
    academicYears,
    semesters,
    sections,
    selectedStudentAcademic,
  ]);

  const handleSearch = async () => {
    // ✅ VALIDATION FIRST
    if (
      !selectedSession?.value ||
      !selectedCourse?.value ||
      !selectedDepartment?.value ||
      !selectedAcademicYear?.value ||
      !selectedSemester?.value ||
      !selectedSection?.value
    ) {
      alert("Please select all required fields (*) before searching.");
      return;
    }
    setLoading(true);

    const organization_id = sessionStorage.getItem("organization_id");
    const branch_id = sessionStorage.getItem("branch_id");

    const queryParams = new URLSearchParams({
      academic_year_id: selectedAcademicYear?.value || "",
      organization_id,
      branch_id,
    });

    if (selectedSession?.value)
      queryParams.append("batch_id", selectedSession.value);

    if (studentId) queryParams.append("student_id", studentId);

    if (selectedCourse?.value)
      queryParams.append("course_id", selectedCourse.value);

    if (selectedSemester?.value)
      queryParams.append("semester_id", selectedSemester.value);

    if (selectedSection?.value)
      queryParams.append("section_id", selectedSection.value);

    // if (selectedFeePeriod)
    // queryParams.append("fee_applied_from_id", selectedFeePeriod);
    if (feePeriod) {
      queryParams.append("fee_applied_from_id", feePeriod);
    }

    queryParams.append("unpaid", showUnpaidFee ? "true" : "false");

    try {
      const response = await fetch(
        `${
          ApiUrl.apiurl
        }HOSTEL/HostelChargesCalculateBasedOnStudent/?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ TOKEN
          },
        }
      );

      const data = await response.json();

      if (data.message === "success" && Array.isArray(data.data)) {
        setHostelData(data.data); // ✅ SET TABLE DATA HERE
      } else {
        setHostelData([]); // No data fallback
      }
    } catch (error) {
      console.error("API Error:", error);
      setHostelData([]);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (hostelData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      hostelData.map((item, index) => ({
        // "Sr.No": index + 1,
        "Student Name": item.student_name,
        "Admission No": item.course_admission_no,
        Course: item.course_name,
        Section: item.section_name,
        "Father Name": item.father_name,
        "Total Hostel Fees": item.total_fees,
        "Fees Paid": item.paid_fees,
        Balance: item.total_fees - item.paid_fees,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hostel Data");

    // Save the Excel file
    XLSX.writeFile(workbook, "HostelData.xlsx");
  };

  const fetchViewPDF = async (student_id, feePeriod) => {
    try {
      const orgId = sessionStorage.getItem("organization_id");
      const branchId = sessionStorage.getItem("branch_id");

      // ⛳ Build URL dynamically
      let url = `${ApiUrl.apiurl}HOSTEL/HostelChargesCalculateBasedOnStudent/?academic_year_id=${selectedAcademicYear?.value}&organization_id=${orgId}&branch_id=${branchId}&batch_id=${selectedSession?.value}&student_id=${student_id}&course_id=${selectedCourse?.value}&section_id=${selectedSection?.value}&unpaid=${showUnpaidFee}`;

      // 🚨 If Fee Period selected, then add parameter
      if (feePeriod) {
        url += `&fee_applied_from_id=${feePeriod}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.message === "success" && Array.isArray(result.data)) {
        // 📝 If fee period blank → pass whole object so PDF can use semester_list
        generatePDF(
          feePeriod
            ? result.data[0]
            : {
                ...result.data[0],
                semester_list: result.data[0]?.semester_list,
              }
        );
      } else {
        alert("No record found for PDF view");
      }
    } catch (error) {
      console.error("Fetch PDF Error:", error);
    }
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Hostel Fee Report", 14, 15);

    let startY = 22;

    // 🔥 If no fee_period, show semester_list instead
    if (
      !data.fee_period &&
      Array.isArray(data.semester_list) &&
      data.semester_list.length > 0
    ) {
      // Join semesters as comma separated string
      const semesterNames = data.semester_list
        .map((s) => s.semester)
        .join(", ");

      doc.autoTable({
        startY,
        head: [[`Semester List (${semesterNames})`]], // 👉 Show in braces
        theme: "grid",
        styles: {
          fillColor: [200, 200, 200],
          fontStyle: "bold",
          halign: "left",
        },
      });
    } else {
      // 📌 If fee_period exists, show normally
      const feeAppliedFromLabel = data?.fee_period ?? "-";
      doc.autoTable({
        startY,
        head: [[`Fee Applied From : ${feeAppliedFromLabel}`]],
        theme: "grid",
        styles: {
          fillColor: [200, 200, 200],
          fontStyle: "bold",
          halign: "left",
        },
      });
    }

    startY = doc.lastAutoTable.finalY + 8;

    const totalFees = Number(data.total_fees) || 0;
    const totalPaid = Number(data.paid_fees) || 0;
    const totalDiscount = 0;
    const balance = totalFees - totalPaid;

    // Main Table (Fee Element rows)
    doc.autoTable({
      startY,
      head: [["Fee Element", "Total Amt", "Paid", "Balance"]],
      body: [
        [
          "Hostel Fees",
          totalFees.toFixed(2),
          totalPaid.toFixed(2),
          balance.toFixed(2),
        ],
      ],
      theme: "grid",
    });

    // Total Row
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 2,
      body: [
        [
          "Total",
          totalFees.toFixed(2),
          totalPaid.toFixed(2),
          balance.toFixed(2),
        ],
      ],
      styles: { fontStyle: "bold" },
      theme: "grid",
    });

    // Final Summary
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      body: [
        ["Total Fees", totalFees.toFixed(2)],
        ["Total Paid", totalPaid.toFixed(2)],
        ["Total Discount", totalDiscount.toFixed(2)],
        ["Final Balance", balance.toFixed(2)],
      ],
      theme: "grid",
      styles: { fontStyle: "bold", halign: "right" },
    });

    const pdfBlob = doc.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);
    window.open(pdfURL);
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
                STUDENT HOSTEL FEE
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

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mt-3">
                      <div className="col-12 col-md-3 mb-2  ">
                        <label htmlFor="student-name" className="form-label">
                          Student Name
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="student-name"
                            className="form-control detail"
                            placeholder="Enter student name"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
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

                      <ModalHostel
                        show={showModal}
                        handleClose={handleCloseModal}
                        onSelectStudent={handleSelectStudent}
                      />
                      {/* Session */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="session" className="form-label">
                          Session<span style={{ color: "red" }}>*</span>
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
                          Course<span style={{ color: "red" }}>*</span>
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
                          Department<span style={{ color: "red" }}>*</span>
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
                          Academic Year<span style={{ color: "red" }}>*</span>
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
                          Semester<span style={{ color: "red" }}>*</span>
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
                          Section<span style={{ color: "red" }}>*</span>
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
                        <label htmlFor="fee-period" className="form-label">
                          Fee Period<span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                          className="detail"
                          placeholder="Select Fee Period"
                          options={semesterList.map((sem) => ({
                            value: sem.id,
                            label: sem.semester_description,
                          }))}
                          value={
                            semesterList
                              .map((sem) => ({
                                value: sem.id,
                                label: sem.semester_description,
                              }))
                              .find((option) => option.value === feePeriod) ||
                            null
                          }
                          onChange={(option) =>
                            setFeePeriod(option ? option.value : "")
                          }
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
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

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered ">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Student Name</th>
                        <th>ONMRC Registration No</th>
                        <th>Admission No</th>
                        <th>Course</th>
                        <th>Section</th>
                        <th>Father Name</th>
                        <th>Total Hostel Fees</th>
                        <th>Fees Paid</th>
                        <th>Balance</th>
                        <th>View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="11" className="text-center">
                            Loading...
                          </td>
                        </tr>
                      ) : hostelData.length > 0 ? (
                        hostelData.map((item, index) => (
                          <tr key={index}>
                            {/* ⭐ Sr.No */}
                            <td>{index + 1}</td>

                            {/* Student Name */}
                            <td>{item.student_name}</td>

                            {/* Registration No */}
                            <td>{item.registration_no}</td>

                            {/* Admission No */}
                            <td>{item.course_admission_no}</td>

                            {/* Class Name */}
                            <td>{item.course_name}</td>

                            {/* Section Name */}
                            <td>{item.section_name}</td>

                            {/* Father Name */}
                            <td>{item.father_name}</td>

                            {/* Total Fees */}
                            <td>{item.total_fees}</td>

                            {/* Paid Fees */}
                            <td>{item.paid_fees}</td>

                            {/* Balance */}
                            <td>
                              {Number(item.total_fees) - Number(item.paid_fees)}
                            </td>

                            {/* View Button */}
                            <td>
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() =>
                                  fetchViewPDF(item.student_id, feePeriod)
                                }
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="11" className="text-center">
                            No Data Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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
