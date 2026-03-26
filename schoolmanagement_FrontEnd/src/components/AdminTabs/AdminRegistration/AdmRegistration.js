import React, { useState, useEffect, useMemo, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdmRegistration.css";
import { useNavigate } from "react-router-dom";
import useFetchOrganizationList from "../../hooks/useFetchOrganizationList";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";
import useFetchCategories from "../../hooks/useFetchCategories ";
import useFetchOrganizationBranch from "../../hooks/useFetchBranchByOrganization";
import useFetchGenderList from "../../hooks/fetchGenderList";

import Select from "react-select";
import { Link } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ReactPaginate from "react-paginate";

const AdmAttendanceEntry = ({ formData, setFormData }) => {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedOrgBranch, setSelectedOrgBranch] = useState(null); // for Organization Branch
  const [selectedDepartment, setSelectedDepartment] = useState(null); // for Academic Department

  const { OrganizationList, error: orgError } = useFetchOrganizationList();
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const { BatchList, loading: batchLoading, error: batchError } = useFetchSessionList(
    selectedOrganization?.value,
    selectedOrgBranch?.value
  );

  const [selectedSession, setSelectedSession] = useState(null);
  const { CourseList, loading: courseLoading, error: courseError } = useFetchCourseByFilter(
    selectedOrganization?.value, // ✅ pass ID, not object
    selectedSession               // batch_id
  );
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { BranchList, loading: branchLoading, error: branchError } = useFetchBranch(
    selectedOrganization?.value,  // organization_id
    selectedOrgBranch?.value,     // branch_id
    selectedSession,              // batch_id
    selectedCourse                // course_id
  );

  // ✅ Call hook using correct IDs
  const { AcademicYearList, loading: academicYearLoading, error: academicYearError } =
    useFetchAcademicYearByFilter(
      selectedOrganization?.value,  // organization_id
      selectedOrgBranch?.value,     // branch_id
      selectedSession,              // batch_id
      selectedCourse,               // course_id
      selectedDepartment            // department_id
    );

  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const { SemesterList, loading: semesterLoading, error: semesterError } =
    useFetchSemesterByFilter(
      selectedOrganization?.value,  // organization_id
      selectedOrgBranch?.value,     // branch_id
      selectedSession,              // batch_id
      selectedCourse,               // course_id
      selectedDepartment,           // department_id
      selectedAcademicYear          // academic_year_id
    );

  const [selectedSemester, setSelectedSemester] = useState(null);
  const { SectionList, loading: sectionFilterLoading, error: sectionError } =
    useFetchSectionByFilter(
      selectedOrganization?.value,  // organization_id
      selectedOrgBranch?.value,     // branch_id
      selectedSession,              // batch_id
      selectedCourse,               // course_id
      selectedDepartment,           // department_id
      selectedAcademicYear,         // academic_year_id
      selectedSemester              // semester_id
    );

  const { genders, loading: genderLoading, error: genderError } = useFetchGenderList();
  const [selectedSectionFiltered, setSelectedSectionFiltered] = useState(null);
  const { categories, loading: loadingCategories, error: categoryError } = useFetchCategories();
  const {
    branches: organizationBranches,
    loading: orgBranchLoading,
    error: orgBranchError,
  } = useFetchOrganizationBranch();

  const [studentData, setStudentData] = useState([]);
  const [fullStudentData, setFullStudentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 10;

 const filteredStudentData = useMemo(() => {
   if (!searchQuery?.trim()) return studentData;

   const lowerQuery = searchQuery.trim().toLowerCase();
   const queryWords = lowerQuery.split(/\s+/).filter(Boolean);

   return studentData.filter((student) => {
     const basic = student?.studentBasicDetails || {};
     const address = student?.addressDetails?.[0] || {};
     if (!Object.keys(basic).length && !Object.keys(address).length) return false;

     const fullName = [basic.first_name, basic.middle_name, basic.last_name]
       .filter(Boolean)
       .join(" ")
       .toLowerCase();

     const searchableText = [
       fullName,
       basic.registration_no,
       basic.admission_no,
       basic.school_admission_no,
       basic.barcode,
       basic.rollno,
       basic.roll_no,
       basic.father_name,
       basic.mother_name,
       basic.gender_name,
       basic.gender,
       basic.religion_name,
       basic.category_name,
       basic.batch_description,
       basic.course_name,
       basic.department_description,
       basic.academic_year_description,
       basic.semester_description,
       basic.section_name,
       basic.organization_description,
       basic.branch_name,
       address.present_address,
       address.present_city,
       address.present_state,
       address.present_country,
       address.present_pincode,
       address.permanent_address,
       address.permanent_city,
       address.permanent_state,
       address.permanent_country,
       address.permanent_pincode,
     ]
       .filter(Boolean)
       .join(" ")
       .toLowerCase();

     const isNameMatch = queryWords.every((word) => fullName.includes(word));
     const isSearchableFieldMatch = queryWords.every((word) =>
       searchableText.includes(word)
     );

     return isNameMatch || isSearchableFieldMatch;
   });
 }, [studentData, searchQuery]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredStudentData.length / rowsPerPage);

  // Pagination Safety Guard
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages); // Fallback to last valid page
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1); // Reset to page 1 if data is completely empty
    }
  }, [totalPages, currentPage]);

  // Reset pagination precisely when global user search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  // Get the current rows for the table
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredStudentData.slice(indexOfFirstRow, indexOfLastRow);
  console.log("hiiiii");

  const [filters, setFilters] = useState({
    studentName: "",
    classId: "",
    section: "",
    admissionNo: "",
    barcode: "",
    fatherName: "",
    motherName: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    status: "ACTIVE",
  });
  const [reportType, setReportType] = useState("");
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchAbortRef = useRef(null);

  // 03-12-2025
  useEffect(() => {
    const organizationId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");

    if (organizationId) {
      setSelectedOrganization({ value: organizationId, label: "" });
    }

    if (branchId) {
      setSelectedOrgBranch({ value: branchId, label: "" });
    }
  }, []);


  useEffect(() => {
    const fetchFullStudentData = async () => {
      setIsSearching(true);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Access token not found in localStorage.");
          return;
        }

        const organizationId = sessionStorage.getItem("organization_id");
        const branchId = sessionStorage.getItem("branch_id");

        if (!organizationId || !branchId) {
          console.error("Organization ID or Branch ID not found in session storage");
          return;
        }

        const academicYearId = localStorage.getItem("academicYearId") || 1;
        if (!academicYearId) {
          console.error("No academic year ID found in local storage");
          return;
        }

        // const apiUrl = `${ApiUrl.apiurl}StudentRegistrationApi/GetAllSTUDENTList/?organization_id=${organizationId}&branch_id=${branchId}&academic_year_id=${academicYearId}`;
        const apiUrl = `${ApiUrl.apiurl}StudentRegistrationApi/GetAllSTUDENTList/?organization_id=${organizationId}&branch_id=${branchId}&student_status=ACTIVE`;

        console.log("Fetch Full Student API URL:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
          setFullStudentData(data.data);
          setStudentData(data.data);
        } else {
          console.log("error", data.data);

          console.warn("No data found for the given parameters");
          setFullStudentData([]);
          setStudentData([]);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchFullStudentData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Allow only letters & spaces for these fields
    if (name === "fatherName" || name === "motherName") {
      const regex = /^[A-Za-z\s]*$/; // only alphabets & spaces

      if (!regex.test(value)) return; // stop update if invalid
    }
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleCancelCloseButton = () => {
    navigate("/admin/dashboard");
  };

  const handleSearch = async () => {
    // Cancel any previous in-flight request
    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
    }
    const controller = new AbortController();
    searchAbortRef.current = controller;

    setIsSearching(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Access token not found");
        return;
      }

      const organizationId = sessionStorage.getItem("organization_id");
      const branchId = sessionStorage.getItem("branch_id");

      const params = new URLSearchParams();

      const appendIfValid = (key, value) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value);
        }
      };

      // ✅ Mandatory
      appendIfValid("organization_id", organizationId);
      appendIfValid("branch_id", branchId);

      // 📚 Academic Filters (FIXED)
      appendIfValid("batch_id", selectedSession);
      appendIfValid("course_id", selectedCourse);
      appendIfValid("department_id", selectedDepartment);
      appendIfValid("academic_year_id", selectedAcademicYear);
      appendIfValid("semester_id", selectedSemester);
      appendIfValid("section_id", selectedSectionFiltered);

      appendIfValid("student_name", filters.studentName);
      appendIfValid("admission_no", filters.admissionNo);
      appendIfValid("barcode", filters.barcode);
      appendIfValid("father_name", filters.fatherName);
      appendIfValid("mother_name", filters.motherName);
      appendIfValid("school_admission_no", filters.schoolAdmissionNo);
      appendIfValid("student_status", filters.status);
      appendIfValid("gender", filters.gender);
      appendIfValid("from_date", fromDate);
      appendIfValid("to_date", toDate);

      const apiUrl = `${ApiUrl.apiurl}StudentRegistrationApi/GetAllSTUDENTList/?${params.toString()}`;
      console.log("Search API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.message === "Success" && Array.isArray(data.data)) {
        setStudentData(data.data);
        setFullStudentData(data.data);
      } else {
        setStudentData([]);
        setFullStudentData([]);
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        // Previous request was cancelled — not an error
        return;
      }
      console.error("Search API Error:", error);
      setStudentData([]);
      setFullStudentData([]);
    } finally {
      setIsSearching(false);
    }
  };

  const flattenStudentData = (data) => {
    return data.map((student, index) => {
      const basic = student.studentBasicDetails || {};
      const address = (student.addressDetails && student.addressDetails[0]) || {};
      const fee = (student.feeDetails && student.feeDetails[0]) || {};

      return {
        SerialNo: index + 1,
        AdmissionNo: basic.admission_no,
        FirstName: basic.first_name,
        LastName: basic.last_name,
        Organization: basic.organization_description,
        Branch: basic.branch_name,
        Batch: basic.batch_description,
        Course: basic.course_name,
        Department: basic.department_description,
        AcademicYear: basic.academic_year_description,
        Semester: basic.semester_description,
        Section: basic.section_name,
        Gender: basic.gender_name,
        DOB: basic.date_of_birth,
        Email: basic.email,
        StudentAdharNo: basic.student_aadhaar_no,
        FatherName: basic.father_name,
        FatherContactNo: basic.father_contact_number,
        FatherAdharNo: basic.father_aadhaar_no,
        MotherName: basic.mother_name,
        MotherContactNo: basic.mother_contact_number,
        MotherAdharNo: basic.mother_aadhaar_no,
        PresentAddress: address.present_address,
        PresentCity: address.present_city,
        PresentState: address.present_state,
        PresentCountry: address.present_country,
        PresentPincode: address.present_pincode,
        PermanentAddress: address.permanent_address,
        PermanentCity: address.permanent_city,
        PermanentState: address.permanent_state,
        PermanentCountry: address.permanent_country,
        PermanentPincode: address.permanent_pincode,
      };
    });
  };

  const handleClear = () => {
    // ✅ Clear all filter values
    setFilters({
      studentName: "",
      classId: "",
      section: "",
      admissionNo: "",
      barcode: "",
      fatherName: "",
      motherName: "",
      gender: "",
      status: "ACTIVE",
      courseId: "",
      branchId: "",
      academicYearId: "",
      semesterId: "",
      sectionId: "",
      organizationId: "",
      sessionId: "",
    });

    // ✅ Clear all dropdown selections
    // setSelectedOrganization(null);
    // setSelectedOrgBranch(null);
    const organizationId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");

    setSelectedOrganization({ value: organizationId, label: "" });
    setSelectedOrgBranch({ value: branchId, label: "" });
    setSelectedSession(null);
    setSelectedCourse(null);
    setSelectedBranch(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSectionFiltered(null);

    // ✅ Clear dates
    setFromDate("");
    setToDate("");
    setSearchQuery("");

    // ✅ Reset data back to full list
    setStudentData(fullStudentData);

    // ✅ Reset pagination
    setCurrentPage(1);

    // ✅ Optional: clear any errors or messages
    setError(null);

    // ✅ Clear formData if applicable (profile pic, etc.)
    try {
      sessionStorage.removeItem("profile_pic_base64");
      sessionStorage.removeItem("profile_pic_name");
      sessionStorage.removeItem("profile_pic_type");

      setFormData((prev) => ({
        ...prev,
        profile_pic: null,
        profile_pic_preview: "",
      }));

      const fileInput = document.getElementById("profilePic");
      if (fileInput) fileInput.value = "";

      const previewImg = document.querySelector('img[alt="Profile Picture Preview"]');
      if (previewImg) previewImg.removeAttribute("src");
    } catch (err) {
      console.warn("Error clearing profile pic:", err);
    }
  };

  // Export to PDF function
  const exportToPDF = () => {
    if (!fullStudentData || fullStudentData.length === 0) {
      alert("No student data available to export!");
      return;
    }

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const primaryRGB = [13, 110, 253];
    const sectionBg = [33, 45, 62];
    const labelBg = [232, 240, 255];
    const borderRGB = [189, 208, 255];

    const drawPageHeader = () => {
      // Top bar
      doc.setFillColor(...primaryRGB);
      doc.rect(0, 0, pageWidth, 24, "F");
      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("STUDENT REGISTRATION REPORT", pageWidth / 2, 11, { align: "center" });
      // Subtitle line
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
      doc.text(
        `Generated: ${dateStr}  |  Total Students: ${fullStudentData.length}`,
        pageWidth / 2,
        19,
        { align: "center" }
      );
      // Bottom accent line
      doc.setDrawColor(...borderRGB);
      doc.setLineWidth(0.5);
      doc.line(0, 24, pageWidth, 24);
    };

    drawPageHeader();
    let yPos = 28;

    const addSection = (doc, title, rows) => {
      // Always show all fields; missing values display as —
      const filtered = rows.map(([label, v]) => [label, (v !== undefined && v !== null && v !== "") ? v : "—"]);
      if (filtered.length === 0) return;

      // Check space for at least the header + 1 row
      if (yPos > pageHeight - 22) {
        doc.addPage();
        yPos = 10;
      }

      // Section header bar
      doc.setFillColor(...sectionBg);
      doc.rect(10, yPos, pageWidth - 20, 6, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.text(title, 14, yPos + 4.2);
      yPos += 6;

      // Build 2-column label-value table rows
      const pairedRows = [];
      for (let i = 0; i < filtered.length; i += 2) {
        pairedRows.push([
          filtered[i][0],
          String(filtered[i][1] ?? "—"),
          filtered[i + 1] ? filtered[i + 1][0] : "",
          filtered[i + 1] ? String(filtered[i + 1][1] ?? "—") : "",
        ]);
      }

      autoTable(doc, {
        startY: yPos,
        margin: { left: 10, right: 10, top: 28 },
        body: pairedRows,
        theme: "grid",
        styles: { fontSize: 7.5, cellPadding: 1.8, valign: "middle", textColor: [33, 37, 41] },
        columnStyles: {
          0: { fontStyle: "bold", fillColor: labelBg, cellWidth: 38, textColor: [13, 71, 161] },
          1: { cellWidth: 52 },
          2: { fontStyle: "bold", fillColor: labelBg, cellWidth: 38, textColor: [13, 71, 161] },
          3: { cellWidth: 52 },
        },
        tableWidth: pageWidth - 20,
        showHead: "never",
        tableLineColor: borderRGB,
        tableLineWidth: 0.2,
      });

      yPos = doc.lastAutoTable.finalY + 3;
    };

    // Helper: render a list section where each item is a numbered block of key-value rows
    const addListSection = (doc, title, items, fieldExtractor) => {
      if (!items || items.length === 0) {
        // Still show the section title with "No records" note
        if (yPos > pageHeight - 22) { doc.addPage(); yPos = 10; }
        doc.setFillColor(...sectionBg);
        doc.rect(10, yPos, pageWidth - 20, 6, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "bold");
        doc.text(title, 14, yPos + 4.2);
        yPos += 6;
        doc.setFontSize(7.5);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "italic");
        doc.text("   No records found.", 14, yPos + 4);
        yPos += 9;
        return;
      }
      if (yPos > pageHeight - 22) { doc.addPage(); yPos = 10; }
      doc.setFillColor(...sectionBg);
      doc.rect(10, yPos, pageWidth - 20, 6, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.text(title, 14, yPos + 4.2);
      yPos += 6;

      items.forEach((item, i) => {
        const rows = fieldExtractor(item, i);
        const allRows = rows.map(([label, v]) => [label, (v !== undefined && v !== null && v !== "") ? String(v) : "—"]);
        const pairedRows = [];
        for (let r = 0; r < allRows.length; r += 2) {
          pairedRows.push([
            allRows[r][0], allRows[r][1],
            allRows[r + 1] ? allRows[r + 1][0] : "",
            allRows[r + 1] ? allRows[r + 1][1] : "",
          ]);
        }
        // Sub-item label
        if (yPos > pageHeight - 14) { doc.addPage(); yPos = 10; }
        doc.setFillColor(210, 225, 255);
        doc.rect(10, yPos, pageWidth - 20, 5, "F");
        doc.setTextColor(13, 71, 161);
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text(`  Record ${i + 1}`, 14, yPos + 3.5);
        yPos += 5;

        autoTable(doc, {
          startY: yPos,
          margin: { left: 10, right: 10, top: 10 },
          body: pairedRows,
          theme: "grid",
          styles: { fontSize: 7.5, cellPadding: 1.8, valign: "middle", textColor: [33, 37, 41] },
          columnStyles: {
            0: { fontStyle: "bold", fillColor: labelBg, cellWidth: 38, textColor: [13, 71, 161] },
            1: { cellWidth: 52 },
            2: { fontStyle: "bold", fillColor: labelBg, cellWidth: 38, textColor: [13, 71, 161] },
            3: { cellWidth: 52 },
          },
          tableWidth: pageWidth - 20,
          showHead: "never",
          tableLineColor: borderRGB,
          tableLineWidth: 0.2,
        });
        yPos = doc.lastAutoTable.finalY + 2;
      });
      yPos += 2;
    };

    fullStudentData.forEach((student, idx) => {
      const basic = student.studentBasicDetails || {};
      const address = (student.addressDetails && student.addressDetails[0]) || {};
      const siblings = student.sibilingsDetails || [];
      const emergencyContacts = student.emegencyContact || [];
      const authorizedPickups = student.authorizedpickup || [];
      const documents = student.documentsDetails || [];
      const prevEducations = student.previousEducationDetails || [];
      const feeList = student.feeDetails || [];

      // Add spacing between records; let content flow naturally
      if (idx > 0) {
        yPos += 8;
        if (yPos > pageHeight - 22) { doc.addPage(); yPos = 10; }
      }

      // Student title bar
      doc.setFillColor(...primaryRGB);
      doc.roundedRect(10, yPos, pageWidth - 20, 9, 1.5, 1.5, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      const sName = [basic.first_name, basic.middle_name, basic.last_name].filter(Boolean).join(" ");
      const sInfo = `${idx + 1}. ${sName || "N/A"}   |   Adm No: ${basic.admission_no || "N/A"}   |   Reg No: ${basic.registration_no || "N/A"}`;
      doc.text(sInfo, 14, yPos + 6);
      yPos += 12;

      // 1. BASIC INFORMATION
      addSection(doc, "BASIC INFORMATION", [
        ["First Name", basic.first_name],
        ["Middle Name", basic.middle_name],
        ["Last Name", basic.last_name],
        ["Date of Birth", basic.date_of_birth],
        ["Gender", basic.gender_name],
        ["Blood Group", basic.blood_name],
        ["Nationality", basic.nationality_name],
        ["Religion", basic.religion_name],
        ["Category", basic.category_name],
        ["Mother Tongue", basic.mother_tongue_name],
        ["House", basic.house_name],
        ["Email", basic.email],
        ["Aadhaar No", basic.student_aadhaar_no],
        ["Roll No", basic.barcode],
        ["Enrollment No", basic.enrollment_no],
        ["Status", basic.status],
        ["Children in Family", basic.children_in_family],
        ["Primary Guardian", basic.primary_guardian],
        ["Username", basic.user_name],
        ["Referred By", basic.referred_by],
        ["Remarks", basic.remarks],
      ]);

      // 2. ACADEMIC INFORMATION
      addSection(doc, "ACADEMIC INFORMATION", [
        ["Organization", basic.organization_description],
        ["Branch", basic.branch_name],
        ["Session / Batch", basic.batch_description],
        ["Course", basic.course_name],
        ["Department", basic.department_description],
        ["Academic Year", basic.academic_year_description],
        ["Semester", basic.semester_description],
        ["Section", basic.section_name],
        ["Admission No", basic.admission_no],
        ["Registration No", basic.registration_no],
        ["College Adm No", basic.college_admission_no],
        ["Date of Admission", basic.date_of_admission],
        ["Date of Join", basic.date_of_join],
        ["Admission Type", basic.admission_type],
      ]);

      // 3. PARENT / GUARDIAN INFORMATION
      addSection(doc, "PARENT / GUARDIAN INFORMATION", [
        ["Father Name", basic.father_name],
        ["Father Contact", basic.father_contact_number],
        ["Father Email", basic.father_email],
        ["Father Aadhaar", basic.father_aadhaar_no],
        ["Father Profession", basic.father_profession],
        ["Mother Name", basic.mother_name],
        ["Mother Contact", basic.mother_contact_number],
        ["Mother Email", basic.mother_email],
        ["Mother Aadhaar", basic.mother_aadhaar_no],
        ["Mother Profession", basic.mother_profession],
      ]);

      // 4. ADDRESS INFORMATION
      addSection(doc, "ADDRESS INFORMATION", [
        ["Present Address", address.present_address],
        ["Present City", address.present_city],
        ["Present State", address.present_state],
        ["Present Country", address.present_country],
        ["Present Pincode", address.present_pincode],
        ["Present Phone", address.present_phone_number],
        ["Permanent Address", address.permanent_address],
        ["Permanent City", address.permanent_city],
        ["Permanent State", address.permanent_state],
        ["Permanent Country", address.permanent_country],
        ["Permanent Pincode", address.permanent_pincode],
        ["Permanent Phone", address.permanent_phone_number],
      ]);

      // 5. FEE DETAILS (list)
      addListSection(doc, "FEE DETAILS", feeList, (item) => [
        ["Fee Group", item.fee_group],
        ["Applied From Semester", item.semester],
      ]);

      // 6. SIBLING DETAILS (list)
      addListSection(doc, "SIBLING DETAILS", siblings, (item) => [
        ["Sibling Name", `${item.sibling_firstname || ""} ${item.sibling_lastname || ""}`.trim()],
        ["College Adm No", item.college_admission_no],
        ["Course", item.course_name],
        ["Section", item.section_name],
      ]);

      // 7. EMERGENCY CONTACTS (list)
      addListSection(doc, "EMERGENCY CONTACTS", emergencyContacts, (item) => [
        ["Name", item.name],
        ["Relationship", item.relationship],
        ["Mobile Number", item.mobile_number],
        ["Remark", item.remark],
      ]);

      // 8. AUTHORISED PICKUP (list)
      addListSection(doc, "AUTHORISED PICKUP", authorizedPickups, (item) => [
        ["Name", item.name],
        ["Relationship", item.relationship],
        ["Mobile Number", item.mobile_number],
        ["Email", item.email],
        ["Address", item.address],
        ["Remark", item.remark],
      ]);

      // 9. DOCUMENTS SUBMITTED (list)
      addListSection(doc, "DOCUMENTS SUBMITTED", documents, (item) => [
        ["Document Type", item.document_type],
        ["Document No", item.document_no],
        ["Valid From", item.start_from],
        ["Valid To", item.end_to],
        ["Document URL", item.document_url],
      ]);

      // 10. PREVIOUS EDUCATION DETAILS (list)
      addListSection(doc, "PREVIOUS EDUCATION DETAILS", prevEducations, (item) => [
        ["Institution Name", item.name_of_institution],
        ["Location", item.location],
        ["Course Completed", item.course_completed],
        ["Year From", item.year_from],
        ["Year To", item.year_to],
        ["Language of Instruction", item.language_of_instruction],
        ["Transfer Certificate", item.transfer_certificate],
        ["Result", item.result],
      ]);
    });

    // Page numbers
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(10, pageHeight - 8, pageWidth - 10, pageHeight - 8);
      doc.setFontSize(7);
      doc.setTextColor(128, 128, 128);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Page ${i} of ${totalPages}  •  Acadix School Management System`,
        pageWidth / 2,
        pageHeight - 3,
        { align: "center" }
      );
    }

    const fileName = `Student_Registration_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  };

  // Export to Excel function
  const exportToExcel = () => {
    if (fullStudentData && fullStudentData.length > 0) {
      const flattened = flattenStudentData(fullStudentData);
      const worksheet = XLSX.utils.json_to_sheet(flattened);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "StudentData");
      XLSX.writeFile(workbook, "Registration_Data.xlsx");
    } else {
      alert("No data available to export!");
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1); // react-paginate is 0-based, so add 1
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
                STUDENT SEARCH
              </p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={() => navigate("/admstudentregistration")}
                  >
                    New
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={handleCancelCloseButton}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={exportToExcel}
                  >
                    Export To Excel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={exportToPDF}
                  >
                    Export To PDF
                  </button>
                  {/*  -- Temporarily Hidden for future use --
                  <button
                    type="button"
                    className="btn btn-info text-white me-2"
                    onClick={() => navigate("/admin/student-location-stats", { state: { studentData: fullStudentData } })}
                  >
                    Location Stats
                  </button>
                  */}
                </div>
              </div>
              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mt-2">
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="studentName" className="form-label">
                          Student Name
                        </label>
                        <input
                          type="text"
                          id="studentName"
                          name="studentName"
                          className="form-control detail"
                          placeholder="Enter student name"
                          value={filters.studentName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="admissionNo" className="form-label">
                          Admission No
                        </label>
                        <input
                          type="text"
                          id="admissionNo"
                          name="admissionNo"
                          className="form-control detail"
                          placeholder="Enter admission number"
                          value={filters.admissionNo}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="barcode" className="form-label">
                          Roll No
                        </label>
                        <input
                          type="text"
                          id="barcode"
                          name="barcode"
                          className="form-control detail"
                          placeholder="Enter Roll No"
                          value={filters.barcode}
                          onChange={handleInputChange}
                        />
                      </div>

                      {/* 🔹 Session Dropdown */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="admitted-batch" className="form-label">
                          Session
                        </label>
                        <Select
                          id="admitted-batch"
                          classNamePrefix="detail"
                          placeholder={
                            !selectedOrganization || !selectedOrgBranch
                              ? "Select Branch first"
                              : batchLoading
                                ? "Loading Session..."
                                : "Select Session"
                          }
                          isDisabled={batchLoading}
                          isLoading={batchLoading}
                          options={BatchList.map((batch) => ({
                            value: batch.id,
                            label: batch.batch_description,
                          }))}
                          value={
                            selectedSession
                              ? {
                                value: selectedSession,
                                label:
                                  BatchList.find((b) => b.id === selectedSession)
                                    ?.batch_description || "",
                              }
                              : null
                          }
                          onChange={(selectedOption) => {
                            const value = selectedOption ? selectedOption.value : null;
                            setSelectedSession(value);
                            setFilters((prev) => ({ ...prev, sessionId: value }));
                          }}
                        />
                      </div>
                      {/* 🔹 Course Dropdown */}
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="admitted-class" className="form-label">
                          Course
                        </label>
                        <Select
                          id="admitted-class"
                          className="detail"
                          classNamePrefix="detail"
                          placeholder={!selectedSession ? "Select Session first" : "Select Course"}
                          isDisabled={!selectedOrganization || !selectedSession}
                          isLoading={courseLoading}
                          options={CourseList.map((course) => ({
                            value: course.id,
                            label: `${course.course_name}`,
                          }))}
                          value={CourseList
                            .map((course) => ({ value: course.id, label: course.course_name }))
                            .find((option) => option.value === selectedCourse) || null}
                          onChange={(selectedOption) => {
                            const value = selectedOption ? selectedOption.value : null;
                            setSelectedCourse(value);
                            setFilters((prev) => ({ ...prev, courseId: value }));
                            // ✅ Removed the line that resets branch (no hiding anymore)
                          }}
                        />
                      </div>
                      {/* 🔹 Department Dropdown */}
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="department" className="form-label">
                          Department
                        </label>
                        <Select
                          id="department"
                          className="detail"
                          classNamePrefix="detail"
                          placeholder={!selectedCourse ? "Select Course first" : "Select Department"}
                          isDisabled={!selectedOrganization || !selectedSession || !selectedCourse}
                          isLoading={branchLoading}
                          options={
                            BranchList.map((dept) => ({
                              value: dept.id,
                              label: `${dept.department_description}`,
                            })) || []
                          }
                          value={
                            BranchList.map((dept) => ({
                              value: dept.id,
                              label: `${dept.department_description}`,
                            })).find((option) => option.value === selectedDepartment) || null
                          }
                          onChange={(selectedOption) => {
                            const value = selectedOption ? selectedOption.value : null;
                            setSelectedDepartment(value);
                            setFilters((prev) => ({ ...prev, branchId: value }));
                          }}
                        />
                      </div>
                      {/* 🔹 Academic Year Dropdown */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="academic-year" className="form-label">
                          Academic Year
                        </label>
                        <Select
                          id="academic-year"
                          className="detail"
                          classNamePrefix="detail"
                          placeholder={!selectedDepartment ? "Select Department first" : "Select Academic Year"}
                          isDisabled={!selectedOrganization || !selectedSession || !selectedCourse || !selectedDepartment}
                          isLoading={academicYearLoading}
                          options={
                            AcademicYearList.map((year) => ({
                              value: year.id,
                              label: `${year.academic_year_description}`,
                            })) || []
                          }
                          value={
                            AcademicYearList.map((year) => ({
                              value: year.id,
                              label: `${year.academic_year_description}`,
                            })).find((option) => option.value === selectedAcademicYear) || null
                          }
                          onChange={(selectedOption) => {
                            const value = selectedOption ? selectedOption.value : "";
                            setSelectedAcademicYear(value);
                            setFilters((prev) => ({ ...prev, academicYearId: value }));
                          }}
                        />
                      </div>
                      {/* 🔹 Semester Dropdown */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="semester" className="form-label">
                          Semester
                        </label>
                        <Select
                          id="semester"
                          className="detail"
                          classNamePrefix="detail"
                          placeholder={!selectedAcademicYear ? "Select Academic Year first" : "Select Semester"}
                          isDisabled={
                            !selectedOrganization ||
                            !selectedSession ||
                            !selectedCourse ||
                            !selectedDepartment ||
                            !selectedAcademicYear
                          }
                          isLoading={semesterLoading}
                          options={
                            SemesterList.map((sem) => ({
                              value: sem.id,
                              label: `${sem.semester_description}`,
                            })) || []
                          }
                          value={
                            SemesterList.map((sem) => ({
                              value: sem.id,
                              label: `${sem.semester_description}`,
                            })).find((option) => option.value === selectedSemester) || null
                          }
                          onChange={(selectedOption) => {
                            const value = selectedOption ? selectedOption.value : "";
                            setSelectedSemester(value);
                            setFilters((prev) => ({ ...prev, semesterId: value }));
                          }}
                        />
                      </div>
                      {/* 🔹 Section Dropdown */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="section" className="form-label">
                          Section
                        </label>
                        <Select
                          id="section"
                          className="detail"
                          classNamePrefix="detail"
                          placeholder={!selectedSemester ? "Select Semester first" : "Select Section"}
                          isDisabled={
                            !selectedOrganization ||
                            !selectedSession ||
                            !selectedCourse ||
                            !selectedDepartment ||
                            !selectedAcademicYear ||
                            !selectedSemester
                          }
                          isLoading={sectionFilterLoading}
                          options={
                            SectionList.map((sec) => ({
                              value: sec.id,
                              label: `${sec.section_name}`,
                            })) || []
                          }
                          value={
                            SectionList.map((sec) => ({
                              value: sec.id,
                              label: `${sec.section_name}`,
                            })).find((option) => option.value === selectedSectionFiltered) || null
                          }
                          onChange={(selectedOption) => {
                            const value = selectedOption ? selectedOption.value : "";
                            setSelectedSectionFiltered(value);
                            setFilters((prev) => ({ ...prev, sectionId: value }));
                          }}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="fatherName" className="form-label">
                          Father's Name
                        </label>
                        <input
                          type="text"
                          id="fatherName"
                          name="fatherName"
                          className="form-control detail"
                          placeholder="Enter father's name"
                          value={filters.fatherName}
                          onChange={handleInputChange}
                        />{" "}
                      </div>
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="motherName" className="form-label">
                          Mother's Name
                        </label>
                        <input
                          type="text"
                          id="motherName"
                          name="motherName"
                          className="form-control detail"
                          placeholder="Enter mother's name"
                          value={filters.motherName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="gender" className="form-label">
                          Gender
                        </label>
                        <Select
                          id="gender"
                          name="gender"
                          className="detail"
                          classNamePrefix="gender-dropdown"
                          placeholder={
                            genderLoading
                              ? "Loading genders..."
                              : genderError
                                ? "Error loading genders"
                                : "Select Gender"
                          }
                          isLoading={genderLoading}
                          isDisabled={genderLoading || !!genderError}
                          options={
                            Array.isArray(genders)
                              ? genders.map((g) => ({
                                value: g.id,
                                label: g.gender_name,
                              }))
                              : []
                          }
                          value={
                            Array.isArray(genders)
                              ? genders
                                .map((g) => ({
                                  value: g.id,
                                  label: g.gender_name,
                                }))
                                .find((opt) => Number(opt.value) === Number(filters.gender)) || null
                              : null
                          }
                          onChange={(selectedOption) => {
                            const value = selectedOption ? selectedOption.value : "";
                            setFilters((prev) => ({
                              ...prev,
                              gender: value, // ✅ updates gender filter value
                            }));
                          }}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="from-date" className="form-label">
                          From Date
                        </label>
                        <input
                          type="date"
                          id="from-date"
                          className="form-control detail"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="to-date" className="form-label">
                          To Date
                        </label>
                        <input
                          type="date"
                          id="to-date"
                          className="form-control detail"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="status" className="form-label">
                          Status
                        </label>
                        <Select
                          id="status"
                          className="detail"
                          classNamePrefix="status-select"
                          options={[
                            { value: "", label: "Select Status" },
                            { value: "ACTIVE", label: "ACTIVE" },
                            { value: "INACTIVE", label: "INACTIVE" },
                          ]}
                          value={[
                            { value: "", label: "Select Status" },
                            { value: "ACTIVE", label: "ACTIVE" },
                            { value: "INACTIVE", label: "INACTIVE" },
                          ].find((option) => option.value === filters.status)}
                          onChange={(selectedOption) =>
                            setFilters((prevFilters) => ({
                              ...prevFilters,
                              status: selectedOption
                                ? selectedOption.value
                                : "",
                            }))
                          }
                        />
                      </div>

                      {/* Full-width Search Bar inside container */}
                      <div className="col-12 mt-4 mb-2">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control detail"
                            placeholder="Search: name, admission no, session, course, address, city, state ..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          {searchQuery && (
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => setSearchQuery("")}
                            >
                              X
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover table-sm">
                      <thead className="table-dark">
                        <tr>
                          <th scope="col">Sl No.</th>
                          <th scope="col">Student Name</th>
                          <th scope="col">ONMRC Registration No</th>
                          <th scope="col">Admission No</th>
                          <th scope="col">Session</th>
                          <th scope="col">Course</th>
                          <th scope="col">Department</th>
                          <th scope="col">Academic Year</th>
                          <th scope="col">Semester</th>
                          <th scope="col">Section</th>
                          <th scope="col">Father's Name</th>
                          <th scope="col">Mother's Name</th>
                          <th scope="col">Religion</th>
                          <th scope="col">Address</th>
                          <th scope="col">City</th>
                          <th scope="col">State</th>
                          <th scope="col">Roll No</th>
                          <th scope="col">Category</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRows.length > 0 ? (
                          currentRows.map((student, index) => {
                            const studentBasicDetails = student?.studentBasicDetails;

                            return (
                              <tr key={index}>
                                <td>{indexOfFirstRow + index + 1}</td>

                                <td>
                                  {`${studentBasicDetails?.first_name || ""} 
              ${studentBasicDetails?.middle_name || ""} 
              ${studentBasicDetails?.last_name || ""}`}
                                </td>
                                <td>{studentBasicDetails?.registration_no || "—"}</td>
                                <td>{studentBasicDetails?.admission_no || "—"}</td>
                                <td>{studentBasicDetails?.batch_description || "—"}</td>
                                <td>{studentBasicDetails?.course_name || "—"}</td>
                                <td>{studentBasicDetails?.department_description || "—"}</td>
                                <td>{studentBasicDetails?.academic_year_description || "—"}</td>
                                <td>{studentBasicDetails?.semester_description || "—"}</td>
                                <td>{studentBasicDetails?.section_name || "—"}</td>
                                <td>{studentBasicDetails?.father_name || "—"}</td>
                                <td>{studentBasicDetails?.mother_name || "—"}</td>
                                <td>{studentBasicDetails?.religion_name || "—"}</td>
                                <td>{student?.addressDetails?.[0]?.present_address || "—"}</td>
                                <td>{student?.addressDetails?.[0]?.present_city || "—"}</td>
                                <td>{student?.addressDetails?.[0]?.present_state || "—"}</td>
                                <td>{studentBasicDetails?.barcode || "—"}</td>
                                <td>{studentBasicDetails?.category_name || "—"}</td>

                                <td>
                                  {studentBasicDetails?.id ? (
                                    <Link
                                      to={`/admstudentregistration/${studentBasicDetails.id}?organization_id=${studentBasicDetails.organization}&branch_id=${studentBasicDetails.branch}`}
                                      className="btn btn-sm btn-primary"
                                    >
                                      Edit
                                    </Link>
                                  ) : (
                                    "—"
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="19" style={{ textAlign: "center" }}>
                              No Data Available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {/* Pagination controls */}
                    <ReactPaginate
                      previousLabel={"Previous"}
                      nextLabel={"Next"}
                      breakLabel={"..."}
                      breakClassName={"page-item"}
                      breakLinkClassName={"page-link"}
                      pageCount={totalPages}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageChange}
                      containerClassName={"pagination justify-content-center"}
                      pageClassName={"page-item"}
                      pageLinkClassName={"page-link"}
                      previousClassName={"page-item"}
                      previousLinkClassName={"page-link"}
                      nextClassName={"page-item"}
                      nextLinkClassName={"page-link"}
                      activeClassName={"active"}
                      forcePage={currentPage - 1} // keep sync with state
                    />
                  </div>
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
