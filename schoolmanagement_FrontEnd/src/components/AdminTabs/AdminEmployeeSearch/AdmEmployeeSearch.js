import React, { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "bootstrap/dist/css/bootstrap.min.css";
import SelectStudentModal from "../AdminAttendanceEntry/SelectStudentModal";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import ReactPaginate from "react-paginate";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const AdmAttendanceEntry = () => {

  const [employeeData, setEmployeeData] = useState([]);
  const [employeeTypeOptions, setEmployeeTypeOptions] = useState([]);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchAbortRef = useRef(null);
  const navigate = useNavigate(); // Initialize the navigate function
  const [editData, setEditData] = useState(null);
  const [searchParams, setSearchParams] = useState({
    employeeCode: "",
    firstName: "",
    middleName: "",
    lastName: "",
    employeeType: null, // for react-select
    status: "ACTIVE", // default to ACTIVE like student page
  });

  // Function to properly format name with correct prefix capitalization
  const formatEmployeeName = (name) => {
    if (!name) return "";

    // Split name into parts
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "";

    // Check if first part is a prefix
    const firstPart = parts[0].toLowerCase();
    const prefixMap = {
      'mr': 'Mr.',
      'mr.': 'Mr.',
      'ms': 'Ms',
      'ms.': 'Ms',
      'mrs': 'Mrs',
      'mrs.': 'Mrs',
      'dr': 'Dr.',
      'dr.': 'Dr.'
    };

    // If first part is a prefix, format it properly
    if (prefixMap[firstPart]) {
      const formattedPrefix = prefixMap[firstPart];
      const restOfName = parts.slice(1).map(part =>
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      ).join(' ');
      return `${formattedPrefix} ${restOfName}`;
    }

    // If no prefix found, just capitalize each word
    return parts.map(part =>
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    ).join(' ');
  };



  const dateFromRef = useRef(null);
  const dateToRef = useRef(null);
  const messageTypeRef = useRef(null);
  const studentNameRef = useRef(null);
  const initiatedByRef = useRef(null);
  const sectionRef = useRef(null);
  const classRef = useRef(null);
  const itemsPerPage = 10; // You can change this value
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployeeData = useMemo(() => {
    if (!searchQuery) return employeeData;
    const lowerQuery = searchQuery.toLowerCase().trim();
    return employeeData.filter((employee) => {
      const searchStr = `
        ${employee.employee_code || ""}
        ${formatEmployeeName(employee.employee_name) || ""}
        ${employee.date_of_birth || ""}
        ${employee.phone_number || ""}
        ${employee.email || ""}
        ${employee.date_of_joining || ""}
      `.toLowerCase();

      const empType = (employee.employee_type || "").toLowerCase();
      let typeMatch = false;

      // Handle the specific issue: searching "teaching" returns "non teaching"
      if (lowerQuery.includes("teach") && !lowerQuery.includes("non")) {
        // If query relates to 'teach' but not 'non', only match types that START with 'teach'
        typeMatch = empType.startsWith("teach");
      } else {
        typeMatch = empType.includes(lowerQuery);
      }

      return searchStr.includes(lowerQuery) || typeMatch;
    });
  }, [employeeData, searchQuery]);

  // Calculate total pages
  const pageCount = Math.ceil(filteredEmployeeData.length / itemsPerPage);

  // Pagination Safety Guard (0-indexed)
  useEffect(() => {
    if (pageCount > 0 && currentPage >= pageCount) {
      setCurrentPage(pageCount - 1); // Fallback to last valid page
    } else if (pageCount === 0 && currentPage !== 0) {
      setCurrentPage(0); // Reset to page 0 if data is completely empty
    }
  }, [pageCount, currentPage]);

  // Reset pagination precisely when global user search query changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  // Get current page data
  const getCurrentPageData = () => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredEmployeeData.slice(start, end);
  };

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleClear = () => {
    // Clear all search fields
    setSearchParams({
      employeeCode: "",
      firstName: "",
      middleName: "",
      lastName: "",
      employeeType: null,
      status: "ACTIVE",
    });
    setSearchQuery("");

    // Clear the employee data table
    setEmployeeData([]);
    setCurrentPage(0);
  };

  const handleClose = () => {
    // Navigate back to admin dashboard or home
    navigate("/admin/dashboard");
  };

  const exportToPDF = async () => {
    if (!employeeData || employeeData.length === 0) {
      alert("No employee data available to export!");
      return;
    }

    setIsPdfLoading(true);

    try {
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const primaryRGB = [13, 110, 253];
      const sectionBg = [33, 45, 62];
      const labelBg = [232, 240, 255];
      const borderRGB = [189, 208, 255];

      const drawPageHeader = () => {
        doc.setFillColor(...primaryRGB);
        doc.rect(0, 0, pageWidth, 24, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("EMPLOYEE REGISTRATION REPORT", pageWidth / 2, 11, { align: "center" });
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        const now = new Date();
        const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
        doc.text(
          `Generated: ${dateStr}  |  Total Employees: ${employeeData.length}`,
          pageWidth / 2, 19, { align: "center" }
        );
        doc.setDrawColor(...borderRGB);
        doc.setLineWidth(0.5);
        doc.line(0, 24, pageWidth, 24);
      };

      let yPos = 28;
      drawPageHeader();

      // Helper: render key-value section (always show all fields with — for missing)
      const addSection = (title, rows) => {
        const allRows = rows.map(([label, v]) => [label, (v !== undefined && v !== null && v !== "") ? String(v) : "—"]);
        if (allRows.length === 0) return;
        if (yPos > pageHeight - 22) { doc.addPage(); yPos = 10; }
        doc.setFillColor(...sectionBg);
        doc.rect(10, yPos, pageWidth - 20, 6, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "bold");
        doc.text(title, 14, yPos + 4.2);
        yPos += 6;
        const pairedRows = [];
        for (let i = 0; i < allRows.length; i += 2) {
          pairedRows.push([
            allRows[i][0], allRows[i][1],
            allRows[i + 1] ? allRows[i + 1][0] : "",
            allRows[i + 1] ? allRows[i + 1][1] : "",
          ]);
        }
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
        yPos = doc.lastAutoTable.finalY + 3;
      };

      // Helper: render a list section where each item = numbered block
      const addListSection = (title, items, fieldExtractor) => {
        if (yPos > pageHeight - 22) { doc.addPage(); yPos = 10; }
        doc.setFillColor(...sectionBg);
        doc.rect(10, yPos, pageWidth - 20, 6, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "bold");
        doc.text(title, 14, yPos + 4.2);
        yPos += 6;

        if (!items || items.length === 0) {
          doc.setFontSize(7.5);
          doc.setTextColor(100, 100, 100);
          doc.setFont("helvetica", "italic");
          doc.text("   No records found.", 14, yPos + 4);
          yPos += 9;
          return;
        }

        items.forEach((item, i) => {
          const rows = fieldExtractor(item, i).map(([label, v]) => [label, (v !== undefined && v !== null && v !== "") ? String(v) : "—"]);
          const pairedRows = [];
          for (let r = 0; r < rows.length; r += 2) {
            pairedRows.push([rows[r][0], rows[r][1], rows[r + 1] ? rows[r + 1][0] : "", rows[r + 1] ? rows[r + 1][1] : ""]);
          }
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

      // ─── Single bulk API call — current filtered employees, all sections ───
      const empIds = employeeData.map((e) => e.id).join(",");
      const bulkRes = await fetch(
        `${ApiUrl.apiurl}STAFF/AllEmployeeDetailsForPDF/?organization_id=${orgId}&branch_id=${branchId}&employee_ids=${empIds}`
      );
      if (!bulkRes.ok) throw new Error(`Bulk fetch failed: ${bulkRes.status}`);
      const bulkJson = await bulkRes.json();
      const allRecords = (bulkJson.message === "Success" && Array.isArray(bulkJson.data))
        ? bulkJson.data
        : [];

      if (allRecords.length === 0) {
        alert("No employee data returned from server.");
        return;
      }

      for (let idx = 0; idx < allRecords.length; idx++) {
        const record = allRecords[idx];
        const b = record.basic || {};
        const addr = record.address || {};
        const relList = Array.isArray(record.family) ? record.family : [];
        const eduList = Array.isArray(record.education) ? record.education : [];
        const courseList = Array.isArray(record.courses) ? record.courses : [];
        const expList = Array.isArray(record.experience) ? record.experience : [];
        const docList = Array.isArray(record.documents) ? record.documents : [];
        const langStr = record.language_code || "—";

        // Add spacing between records; let content flow naturally
        if (idx > 0) {
          yPos += 8;
          if (yPos > pageHeight - 22) { doc.addPage(); yPos = 10; }
        }

        // ── Employee title bar ──
        doc.setFillColor(...primaryRGB);
        doc.roundedRect(10, yPos, pageWidth - 20, 9, 1.5, 1.5, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        const empName = formatEmployeeName(b.employee_name || `${b.first_name || ""} ${b.last_name || ""}`.trim());
        const titleText = `${idx + 1}. ${empName || "N/A"}   |   Code: ${b.employee_code || "N/A"}   |   Type: ${b.employee_type || "N/A"}`;
        doc.text(titleText, 14, yPos + 6);
        yPos += 12;

        // 1. BASIC INFORMATION
        addSection("BASIC INFORMATION", [
          ["Employee Code", b.employee_code],
          ["Title", b.title],
          ["First Name", b.first_name],
          ["Middle Name", b.middle_name],
          ["Last Name", b.last_name],
          ["NUID", b.nuid],
          ["Date of Birth", b.date_of_birth],
          ["Place of Birth", b.place_of_birth],
          ["Gender", b.gender],
          ["Marital Status", b.marital_status],
          ["Blood Group", b.blood_group],
          ["Nationality", b.nationality],
          ["Religion", b.religion],
          ["Mother Tongue", b.mother_tongue],
          ["Employee Type", b.employee_type],
          ["Designation", b.designation],
          ["Date of Joining", b.date_of_joining],
          ["Date of Leaving", b.date_of_leaving],
          ["Email", b.email],
          ["Office Email", b.office_email],
          ["Phone Number", b.phone_number],
          ["Emergency Contact No", b.emergency_contact_number],
          ["Highest Qualification", b.highest_qualification],
          ["Status", b.is_active ? "ACTIVE" : "INACTIVE"],
        ]);

        // 2. ADDRESS INFORMATION
        addSection("ADDRESS INFORMATION", [
          ["Present Address", addr.present_address],
          ["Present City", addr.present_city],
          ["Present State", addr.present_state],
          ["Present Country", addr.present_country],
          ["Present Pincode", addr.present_pincode],
          ["Present Phone", addr.present_phone_number],
          ["Permanent Address", addr.permanent_address],
          ["Permanent City", addr.permanent_city],
          ["Permanent State", addr.permanent_state],
          ["Permanent Country", addr.permanent_country],
          ["Permanent Pincode", addr.permanent_pincode],
          ["Permanent Phone", addr.permanent_phone_number],
        ]);

        // 3. FAMILY / RELATION DETAILS
        addListSection("FAMILY / RELATION DETAILS", relList, (item) => [
          ["Name", item.employee_relation_name],
          ["Relation", item.employee_relation],
          ["Date of Birth", item.relation_dob],
          ["Gender", item.relation_gender],
          ["Marital Status", item.relation_marital_status],
          ["Employed", item.relation_employed],
          ["Occupation", item.relation_occupation],
          ["Dependent", item.relation_dependent === "T" ? "Yes" : item.relation_dependent === "F" ? "No" : item.relation_dependent],
          ["PF Nominee", item.relation_pf_nominee === "T" ? "Yes" : item.relation_pf_nominee === "F" ? "No" : item.relation_pf_nominee],
          ["PF Share %", item.relation_pf_share],
        ]);

        // 4. EDUCATIONAL DETAILS
        addListSection("EDUCATIONAL DETAILS", eduList, (item) => [
          ["Qualification", item.qualification],
          ["Highest Qualification", item.highest_qualification],
          ["University", item.university],
          ["Institution", item.institution],
          ["Year From", item.date_from ? String(item.date_from).split("-")[0] : ""],
          ["Year To", item.date_to ? String(item.date_to).split("-")[0] : ""],
          ["Marks / Division", item.marks],
        ]);

        // 5. COURSES / TRAINING DETAILS
        addListSection("COURSES / TRAINING DETAILS", courseList, (item) => [
          ["Course Name", item.course_name],
          ["Course Place", item.course_place],
          ["Date From", item.date_from],
          ["Date To", item.date_to],
          ["Valid Up To", item.valid_upto],
          ["Grade / Result", item.course_results],
        ]);

        // 6. LANGUAGES KNOWN
        addSection("LANGUAGES KNOWN", [
          ["Languages", langStr],
        ]);

        // 7. PREVIOUS EXPERIENCE
        addListSection("PREVIOUS EXPERIENCE", expList, (item) => [
          ["Organization", item.previous_company_worked],
          ["Date From", item.date_from],
          ["Date To", item.date_to],
          ["Reason for Leaving", item.reason_for_leaving],
          ["Experience Letter", item.experience_letter_provided ? "Provided" : "Not Provided"],
        ]);

        // 8. DOCUMENT DETAILS
        addListSection("DOCUMENT DETAILS", docList, (item) => [
          ["Document Type", item.document_name],
          ["Document Number", item.document_number],
          ["Valid From", item.valid_from],
          ["Valid To", item.valid_to],
          ["Document URL", item.document_path],
        ]);
      }

      // ── Footer: page numbers on every page ──
      const totalPagesCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPagesCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.2);
        doc.line(10, pageHeight - 8, pageWidth - 10, pageHeight - 8);
        doc.setFontSize(7);
        doc.setTextColor(128, 128, 128);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Page ${i} of ${totalPagesCount}  •  Acadix School Management System`,
          pageWidth / 2, pageHeight - 3, { align: "center" }
        );
      }

      const fileName = `Employee_Registration_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error("PDF export error:", err);
      alert("An error occurred while generating the PDF.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  const exportToExcel = async () => {
    if (!employeeData || employeeData.length === 0) {
      alert("No data available to export!");
      return;
    }

    try {
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");
      const empIds = employeeData.map((e) => e.id).join(",");

      const bulkRes = await fetch(
        `${ApiUrl.apiurl}STAFF/AllEmployeeDetailsForPDF/?organization_id=${orgId}&branch_id=${branchId}&employee_ids=${empIds}`
      );
      if (!bulkRes.ok) throw new Error(`Bulk fetch failed: ${bulkRes.status}`);
      const bulkJson = await bulkRes.json();
      const allRecords = (bulkJson.message === "Success" && Array.isArray(bulkJson.data))
        ? bulkJson.data
        : [];

      if (allRecords.length === 0) {
        alert("No employee data returned from server.");
        return;
      }

      const rows = allRecords.map((record, index) => {
        const b = record.basic || {};
        const addr = record.address || {};
        const relList = Array.isArray(record.family) ? record.family : [];
        const langStr = record.language_code || "";

        const row = {
          SerialNo: index + 1,
          // ── BASIC INFORMATION ──
          EmployeeCode: b.employee_code || "",
          Title: b.title || "",
          FirstName: b.first_name || "",
          MiddleName: b.middle_name || "",
          LastName: b.last_name || "",
          NUID: b.nuid || "",
          DateOfBirth: b.date_of_birth || "",
          PlaceOfBirth: b.place_of_birth || "",
          Gender: b.gender || "",
          MaritalStatus: b.marital_status || "",
          BloodGroup: b.blood_group || "",
          Nationality: b.nationality || "",
          Religion: b.religion || "",
          MotherTongue: b.mother_tongue || "",
          EmployeeType: b.employee_type || "",
          Designation: b.designation || "",
          DateOfJoining: b.date_of_joining || "",
          DateOfLeaving: b.date_of_leaving || "",
          Email: b.email || "",
          OfficeEmail: b.office_email || "",
          PhoneNumber: b.phone_number || "",
          EmergencyContactNo: b.emergency_contact_number || "",
          Status: b.is_active ? "ACTIVE" : "INACTIVE",
          // ── ADDRESS INFORMATION ──
          PresentAddress: addr.present_address || "",
          PresentCity: addr.present_city || "",
          PresentState: addr.present_state || "",
          PresentCountry: addr.present_country || "",
          PresentPincode: addr.present_pincode || "",
          PresentPhone: addr.present_phone_number || "",
          PermanentAddress: addr.permanent_address || "",
          PermanentCity: addr.permanent_city || "",
          PermanentState: addr.permanent_state || "",
          PermanentCountry: addr.permanent_country || "",
          PermanentPincode: addr.permanent_pincode || "",
          PermanentPhone: addr.permanent_phone_number || "",
        };

        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "EmployeeData");
      XLSX.writeFile(workbook, `Employee_Registration_Data_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error("Excel export error:", err);
      alert("An error occurred while generating the Excel file.");
    }
  };

  const handleNew = () => {
    localStorage.removeItem("employeeId");
    localStorage.removeItem("employeeType");
    localStorage.removeItem("employeeTypeId");
    sessionStorage.removeItem("tempFormData");
    sessionStorage.removeItem("tempFrontCover");

    navigate("/AdmStaffDetails");
  };

  useEffect(() => {
    const fetchEmployeeTypes = async () => {
      try {
        const response = await fetch(
          `${ApiUrl.apiurl}Staff/EmployeeTypeList/`
        );
        const result = await response.json();

        if (response.ok && result.data) {
          // Map API response to react-select format
          const formattedOptions = result.data.map((item) => ({
            value: item.id,
            label: item.employee_type_description,
          }));
          setEmployeeTypeOptions(formattedOptions);
        } else {
          console.error("Failed to load employee types:", result);
        }
      } catch (error) {
        console.error("Error fetching employee types:", error);
      }
    };

    fetchEmployeeTypes();
  }, []);


  const fetchEmployeeData = async () => {
    // Cancel any previous in-flight request
    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
    }
    const controller = new AbortController();
    searchAbortRef.current = controller;

    setIsSearching(true);
    try {
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");

      const params = new URLSearchParams({
        organization_id: orgId,
        branch_id: branchId,
      });

      // Optional search params
      if (searchParams.employeeCode)
        params.append("employee_code", searchParams.employeeCode);
      if (searchParams.firstName)
        params.append("first_name", searchParams.firstName);
      if (searchParams.middleName)
        params.append("middle_name", searchParams.middleName);
      if (searchParams.lastName)
        params.append("last_name", searchParams.lastName);
      if (searchParams.employeeType?.value)
        params.append("employee_type", searchParams.employeeType.value);
      if (searchParams.status)
        params.append("is_active", searchParams.status === "ACTIVE" ? "true" : "false");

      const response = await fetch(
        `${ApiUrl.apiurl}STAFF/RegistrationstaffList/?${params.toString()}`,
        { signal: controller.signal }
      );

      const result = await response.json();
      if (response.ok && result.data) {
        console.log("Employee Data:", result.data); // Debug log
        setEmployeeData(result.data);
      } else {
        console.error("Failed to fetch employee data:", result);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        // Previous request was cancelled — not an error
        return;
      }
      console.error("Error fetching employee data:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Initial page load — no abort logic so it always completes
  useEffect(() => {
    const loadInitialData = async () => {
      setIsSearching(true);
      try {
        const orgId = localStorage.getItem("orgId");
        const branchId = localStorage.getItem("branchId");

        const params = new URLSearchParams({
          organization_id: orgId,
          branch_id: branchId,
          is_active: "true",
        });

        const response = await fetch(
          `${ApiUrl.apiurl}STAFF/RegistrationstaffList/?${params.toString()}`
        );

        const result = await response.json();
        if (response.ok && result.data) {
          console.log("Employee Data (initial load):", result.data);
          setEmployeeData(result.data);
        } else {
          console.error("Failed to fetch employee data:", result);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setIsSearching(false);
      }
    };

    loadInitialData();
  }, []);


  // const handleEdit = async (employeeId) => {
  //   try {
  //     const response = await fetch(
  //       `${ApiUrl.apiurl}STAFF/registrationBasicDetailsRetreive/${employeeId}/`
  //     );
  //     const result = await response.json();

  //     if (response.ok && result.data) {
  //       setEditData(result.data); // Set response in state
  //       navigate("/AdmStaffDetails", {
  //         state: { employeeDetails: result.data },
  //       }); // Pass via location state
  //     } else {
  //       console.error("Failed to fetch employee details:", result);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching employee details:", error);
  //   }
  // };

  const handleEdit = async (employeeId) => {
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}STAFF/RegistrationBasicDetailsRetrieve/?organization_id=${localStorage.getItem("orgId")}&branch_id=${localStorage.getItem("branchId")}&employee_id=${employeeId}`
      );
      const result = await response.json();

      if (response.ok && result.data) {
        // Optional if needed
        localStorage.setItem("employeeId", result.data.id);
        localStorage.setItem("employeeType", result.data.employee_type);
        localStorage.setItem("employeeTypeId", result.data.employee_type_id); //  Save this

        //  Set response in state and navigate
        setEditData(result.data);
        navigate("/AdmStaffDetails", {
          state: { employeeDetails: result.data },
        });
      } else {
        console.error("Failed to fetch employee details:", result);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
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
                EMPLOYEE SEARCH
              </p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleNew} // Add the onClick event to trigger navigation
                  >
                    New
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={fetchEmployeeData}
                    disabled={isSearching}
                  >
                    {isSearching ? "Searching..." : "Search"}
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
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={exportToExcel}
                  >
                    Export To Excel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={exportToPDF}
                    disabled={isPdfLoading}
                  >
                    {isPdfLoading ? "Generating..." : "Export To PDF"}
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mt-3  mb-3">
                      <div className="col-md-2 mb-3">
                        <label htmlFor="employee-code" className="form-label">
                          Employee Code
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="employee-code"
                            className="form-control detail"
                            placeholder="Enter employee code"
                            value={searchParams.employeeCode}
                            onChange={(e) =>
                              setSearchParams({
                                ...searchParams,
                                employeeCode: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-5 mb-3">
                        <label htmlFor="student-name" className="form-label">
                          Employee Name
                        </label>
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="text"
                            className="form-control detail"
                            placeholder="First name"
                            value={searchParams.firstName}
                            onChange={(e) =>
                              setSearchParams({
                                ...searchParams,
                                firstName: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            className="form-control detail"
                            placeholder="Middle name"
                            value={searchParams.middleName}
                            onChange={(e) =>
                              setSearchParams({
                                ...searchParams,
                                middleName: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            className="form-control detail"
                            placeholder="Last name"
                            value={searchParams.lastName}
                            onChange={(e) =>
                              setSearchParams({
                                ...searchParams,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="employee-type" className="form-label">
                          Employee Type
                        </label>
                        <Select
                          inputId="employee-type"
                          className="detail"
                          classNamePrefix="employee-type-select"
                          options={employeeTypeOptions}
                          value={searchParams.employeeType}
                          onChange={(selectedOption) =>
                            setSearchParams({
                              ...searchParams,
                              employeeType: selectedOption,
                            })
                          }
                        />
                      </div>
                      <div className="col-12 col-md-2 mb-3">
                        <label htmlFor="employee-status" className="form-label">
                          Status
                        </label>
                        <Select
                          inputId="employee-status"
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
                          ].find((option) => option.value === searchParams.status) || null}
                          onChange={(selectedOption) =>
                            setSearchParams((prev) => ({
                              ...prev,
                              status: selectedOption ? selectedOption.value : "",
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
                            placeholder="Search: name, employee code, type, email, phone..."
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

              <div className="row">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sr.No</th>
                          <th>Employee Code</th>
                          <th>Name</th>
                          <th>Employee Type</th>
                          <th>Date Of Birth</th>
                          <th>Mobile No</th>
                          <th>Email ID</th>
                          <th>Date Of Joining</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCurrentPageData().length > 0 ? (
                          getCurrentPageData().map((employee, index) => (
                            <tr key={employee.employee_id}>
                              <td>{currentPage * itemsPerPage + index + 1}</td>
                              <td>{employee.employee_code}</td>
                              <td>{formatEmployeeName(employee.employee_name)}</td>
                              <td>{employee.employee_type}</td>
                              <td>{employee.date_of_birth}</td>
                              <td>{employee.phone_number}</td>
                              <td>{employee.email}</td>
                              <td>{employee.date_of_joining}</td>
                              <td>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleEdit(employee.id)}
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={9} className="text-center">
                              No Data Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
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
