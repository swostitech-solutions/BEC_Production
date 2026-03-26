import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ModalCertificate from "./ModalCertificate";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import { jsPDF } from "jspdf";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";

const AdmAttendanceEntry = () => {
  const [formData, setFormData] = useState({
    document_no: "",
    school_admission_no: "",
    barcode: "",
    cancellationRemarks: "",
    cancelledOn: "",
    studentname: "",
    father_name: "",
    mother_name: "",
    nationality: "",
    category: "",
    date_of_admission: "",
    dob: "",
    classId: "",
    subjects_studied: "",
    total_working_day: "",
    total_present_day: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [selectedStudentData, setSelectedStudentData] = useState(null);

  const [showStudentSelectionModal, setShowStudentSelectionModal] =
    useState(false);

  const organizationId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  // Fetch dropdown data dynamically based on selections
  const { BatchList, loading: loadingBatch } = useFetchSessionList(organizationId, branchId);
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

  // const dateToRef = useRef(null);
  // const dateFromRef = useRef(null);
  const fromClassRef = useRef(null);
  const toDocumentRef = useRef(null);
  const studentNameRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // adjust rows per page
  useEffect(() => {
    // Clear filter values when module opens
    localStorage.removeItem("selectedCertificateClassId");
    localStorage.removeItem("selectedCertificateSectionId");
    localStorage.removeItem("selectedDocumentType");
    localStorage.removeItem("selectedCertificateStudentId");
  }, []);

const handleClear = () => {
  // Reset input refs
  if (admissionNoRef.current) admissionNoRef.current.value = "";
  if (barcodeRef.current) barcodeRef.current.value = "";
  if (studentNameRef.current) studentNameRef.current.value = "";

  // Reset React states
  setSelectedDocumentType(null);
  setSelectedBatch(null);
  setSelectedCourse(null);
  setSelectedDepartment(null);
  setSelectedAcademicYear(null);
  setSelectedSemester(null);
  setSelectedSection(null);
  setSelectedStudentData(null);

  // ✅ Clear table data
  setCertificates([]);
  setMessage("");
  setCurrentPage(0);

  // Remove localStorage filters
  localStorage.removeItem("selectedCertificateClassId");
  localStorage.removeItem("selectedCertificateSectionId");
  localStorage.removeItem("selectedDocumentType");
  localStorage.removeItem("selectedCertificateStudentId");
};


  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setShowStudentSelectionModal(false);
  };

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const organizationId = sessionStorage.getItem("organization_id");
        const branchId = sessionStorage.getItem("branch_id");
        const response = await fetch(
          `${ApiUrl.apiurl}StudentCertificate/list/?branch_id=${branchId}&organization_id=${organizationId}`
        );

        if (response.status === 204) {
          setCertificates([]);
          setMessage("No records found.");
          return;
        }

        const result = await response.json();

        if (Array.isArray(result)) {
          setCertificates(result);
          setMessage("");
        } else {
          setCertificates([]);
          setMessage("No records found.");
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
        setCertificates([]);
        setMessage("No records found.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);


  const handleClassChange = (e) => {
    const classId = e.target.value;

    if (classId) {
      localStorage.setItem("selectedCertificateClassId", classId);
    } else {
      localStorage.removeItem("selectedCertificateClassId");
    }

    setFormData((prev) => ({
      ...prev,
      classId,
      sectionId: "",
    }));

    setSelectedClassId(classId);
  };

  const handleSectionChange = (e) => {
    const sectionId = e.target.value;

    if (sectionId) {
      localStorage.setItem("selectedCertificateSectionId", sectionId);
    } else {
      localStorage.removeItem("selectedCertificateSectionId");
    }

    setFormData((prev) => ({ ...prev, sectionId }));
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "") {
      localStorage.removeItem("selectedDocumentType");
    } else {
      localStorage.setItem("selectedDocumentType", selectedValue);
    }
  };

  const navigate = useNavigate();

  const handleNewButtonClick = async () => {
    const studentName = studentNameRef.current?.value;
    const documentType = selectedDocumentType?.value;

    if (!studentName) {
      alert("Please enter or select a student name.");
      return;
    }
    if (!documentType) {
      alert("Please select a document type.");
      return;
    }

    const academicYearId = localStorage.getItem("academicSessionId");
    const orgId =
      localStorage.getItem("orgId") || sessionStorage.getItem("organization_id");
    const branchId =
      localStorage.getItem("branchId") || sessionStorage.getItem("branch_id");
    const studentId = localStorage.getItem("selectedCertificateStudentId");

    if (!orgId || !branchId) {
      alert(
        "Your session seems to be expired or incomplete. Please login again and try once more.",
      );
      navigate("/login");
      return;
    }

    try {
      const apiUrl = `${ApiUrl.apiurl}StudentCertificate/GetDetailsBasedOnDocumentTypeStudentId/?academic_year_id=${academicYearId}&organization_id=${orgId}&branch_id=${branchId}&document_type=${documentType}&student_id=${studentId}`;

      const response = await fetch(apiUrl, { method: "GET" });

      if (response.status === 204) {
        // No certificate exists yet. Proceed to create a new one with basic student data.
        let stateData = {};
        if (selectedStudentData) {
            stateData = {
                student_id: selectedStudentData.id,
                studentname: `${selectedStudentData.first_name || ""} ${selectedStudentData.middle_name || ""} ${selectedStudentData.last_name || ""}`.trim().replace(/\s+/g, " "),
                father_name: selectedStudentData.father_name,
                mother_name: selectedStudentData.mother_name,
                school_admission_no: selectedStudentData.admission_no || selectedStudentData.school_admission_no,
                registration_no: selectedStudentData.rollno || selectedStudentData.registration_no,
                course: selectedStudentData.classname,
                section: selectedStudentData.sectionname,
                barcode: selectedStudentData.barcode,
            };
        }

        switch (documentType) {
          case "TC":
            navigate("/transfercertificateform", { state: stateData });
            break;
          case "CC":
            navigate("/charactercertificate", { state: stateData });
            break;
          case "BC":
            navigate("/bonafidecertificate", { state: stateData });
            break;
          default:
            alert("Invalid document type.");
            break;
        }
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch student details.");
      }

      const result = await response.json();

      if (result.message === "success") {
        console.log("Student Details:", result.data);

        setFormData({
          ...formData,
          class_last_studied: result.data.class_last_studied || "",
        });

        switch (documentType) {
          case "TC":
            navigate("/transfercertificateform", { state: { certificate: result.data } });
            break;
          case "CC":
            navigate("/charactercertificate", { state: { certificate: result.data } });
            break;
          case "BC":
            navigate("/bonafidecertificate", { state: { certificate: result.data } });
            break;
          default:
            alert("Invalid document type.");
            break;
        }
      } else {
        alert("Failed to fetch student details: " + result.message);
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      alert(
        "An error occurred while fetching student details. Please try again."
      );
    }
  };

  useEffect(() => {
    const storedClassId = localStorage.getItem("selectedCertificateClassId");
    const storedSectionId = localStorage.getItem(
      "selectedCertificateSectionId"
    );

    if (storedClassId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        classId: storedClassId,
      }));
    }

    if (storedSectionId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        sectionId: storedSectionId,
      }));
    }
  }, [showStudentSelectionModal]);

  const documentTypeMapping = {
    TC: "Transfer Certificate",
    BC: "Bonafide Certificate",
    CC: "Conduct Certificate",
  };

  const handleSearch = () => {
    setLoading(true);
    const orgId = sessionStorage.getItem("organization_id") || 1;
    const brId = sessionStorage.getItem("branch_id") || 1;
    
    let url = `${ApiUrl.apiurl}StudentCertificate/list/?organization_id=${orgId}&branch_id=${brId}`;
    
    if (selectedStudentData && selectedStudentData.id) url += `&student_id=${selectedStudentData.id}`;
    if (selectedBatch) url += `&batch_id=${selectedBatch}`;
    if (selectedCourse) url += `&course_id=${selectedCourse}`;
    if (selectedDepartment) url += `&department_id=${selectedDepartment}`;
    if (selectedAcademicYear) url += `&academic_year_id=${selectedAcademicYear}`;
    if (selectedSemester) url += `&semester_id=${selectedSemester}`;
    if (selectedSection) url += `&section_id=${selectedSection}`;
    if (selectedDocumentType?.value) url += `&document_type=${selectedDocumentType.value}`;

    fetch(url)
      .then((response) => {
        if (response.status === 204) {
          setCertificates([]);
          setMessage("No records found.");
          setLoading(false);
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (!data) return;
        if (Array.isArray(data)) {
          setCertificates(data);
          setMessage("");
        } else {
          setCertificates([]);
          setMessage("No records found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setCertificates([]);
        setMessage("No records found.");
        setLoading(false);
      });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleButtonClick = async (certificate, action) => {
    localStorage.setItem("document_type", certificate.document_type);
    localStorage.setItem("selectedCertificateStudentId", certificate.student_id);
    localStorage.setItem("selectedDocumentType", certificate.document_type);
    localStorage.setItem(
      "transfer_certificate_id",
      certificate.transfer_certificate_id || certificate.character_certificate_id || certificate.bonafide_certificate_id || certificate.fee_certificate_id || 0
    );

    const academicYearId = localStorage.getItem("academicSessionId");
    const orgId = localStorage.getItem("orgId");
    const branchId = localStorage.getItem("branchId");
    const documentType = localStorage.getItem("document_type");
    const studentId = localStorage.getItem("selectedCertificateStudentId");
    const transferCertificateId = localStorage.getItem(
      "transfer_certificate_id"
    );

    const apiUrl = `${ApiUrl.apiurl}StudentCertificate/GetDetailsBasedOnDocumentTypeStudentId/?academic_year_id=${academicYearId}&organization_id=${orgId}&branch_id=${branchId}&document_type=${documentType}&student_id=${studentId}&transfer_certificate_id=${transferCertificateId}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        alert("Failed to fetch certificate details. Please try again.");
        return;
      }
      const result = await response.json();
      
      if (!result.data) {
        console.error("No data returned from API:", result);
        alert(result.message || "No certificate data found.");
        return;
      }

      switch (documentType) {
        case "TC":
          if (action === "view" || action === "view-new") {
            navigate("/transfercertificateform", {
              state: { certificate: result.data, viewMode: true },
            });
          } else {
            navigate("/transfercertificateform", {
              state: { certificate: result.data },
            });
          }
          break;
        case "CC":
          if (action === "view" || action === "view-new") {
            navigate("/charactercertificate", {
              state: { certificate: result.data, viewMode: true },
            });
          } else {
            navigate("/charactercertificate", {
              state: { certificate: result.data },
            });
          }
          break;
        case "BC":
          if (action === "view" || action === "view-new") {
            navigate("/bonafidecertificate", {
              state: { certificate: result.data, viewMode: true },
            });
          } else {
            navigate("/bonafidecertificate", {
              state: { certificate: result.data },
            });
          }
          break;
        default:
          alert("Invalid document type.");
          break;
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      alert("An error occurred while fetching certificate details.");
    }
  };

  const handleGenerateCertificatePDF = async (certificate) => {
    const certId = certificate.transfer_certificate_id || certificate.character_certificate_id || certificate.bonafide_certificate_id || 0;
    const studentId = certificate.student_id;
    const documentType = certificate.document_type;
    const orgId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");

    try {
      // Fetch certificate details from API using correct parameters
      const response = await fetch(
        `${ApiUrl.apiurl}StudentCertificate/pdf/?organization_id=${orgId}&branch_id=${branchId}&student_id=${studentId}&document_type=${documentType}&student_certificate_id=${certId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch certificate data");
      }

      const data = await response.json();

      if (data?.message === "success" && data?.data) {
        const cert = data.data;
        const doc = new jsPDF();

        // Add logo
        try {
          doc.addImage("/Assets/sparsh.jpeg", "JPEG", 10, 10, 30, 30);
        } catch (e) {
          console.warn("Logo not found, continuing without it");
        }

        // Header
        doc.setFontSize(14);
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(0, 0, 255);
        doc.text("Sparsh College of Nursing and Allied Sciences", 50, 15);

        doc.setFontSize(12);
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text("Affiliated to", 50, 21);
        doc.text("Affiliation No.: School Code: SPARSH", 50, 27);
        doc.text("Tel. No.:", 50, 33);
        doc.text("https://sparshhospitals.com/nursing-college-admission/", 50, 39);

        // Certificate title
        doc.setFontSize(16);
        doc.setFont("Helvetica", "bold");
        const title = documentType === "TC" ? "School Leaving Certificate" : 
                     documentType === "CC" ? "Character Certificate" : 
                     "Bonafide Certificate";
        doc.text(title, 105, 50, { align: "center" });

        // Certificate number
        doc.setFontSize(10);
        doc.setFont("Helvetica", "normal");
        const certNumber = documentType === "TC" ? cert.tc_number : 
                          documentType === "CC" ? cert.cc_number : 
                          documentType === "BC" ? cert.bc_number : 
                          cert.fc_number || "";
        
        doc.text("Admission No.: " + (cert.admission_no || ""), 10, 60);
        doc.text("SRN: ", 105, 60, { align: "center" });
        doc.text(`Ref No.: ${certNumber}`, 200, 60, { align: "right" });

        // Certificate details
        const details = [
          { key: "1. Name of Student", value: cert.student_name || "" },
          { key: "2. Father's Name", value: cert.father_name || "" },
          { key: "3. Mother's Name", value: cert.mother_name || "" },
          { key: "4. Date of Birth", value: cert.date_of_birth ? cert.date_of_birth.split("T")[0] : "" },
          { key: "5. Nationality", value: cert.nationality || "" },
          { key: "6. Category", value: cert.category || "" },
          { key: "7. Date of Admission", value: cert.date_of_admission ? cert.date_of_admission.split("T")[0] : "" },
        ];

        if (documentType === "TC" && cert.course_name) {
          details.push(
            { key: "8. Class/Course", value: cert.course_name || "" },
            { key: "9. Subjects Studied", value: cert.subjects_studied || "" }
          );
        }

        let yPosition = 70;
        doc.setFontSize(10);
        doc.setFont("Helvetica", "normal");

        details.forEach((detail) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`${detail.key}: ${detail.value || "-"}`, 10, yPosition);
          yPosition += 8;
        });

        // Generate PDF and open in new window
        const pdfBlob = doc.output("blob");
        window.open(URL.createObjectURL(pdfBlob), "_blank");
      } else {
        alert("Certificate data not found or invalid response from server.");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    }
  };

  const handleViewPDFClick = (certificate) => {
    // Navigate to certificate page in view mode instead of generating PDF
    const documentType = certificate.document_type;
    const routePath = documentType === "TC" ? "/transfercertificateform" : 
                     documentType === "CC" ? "/charactercertificate" : 
                     "/bonafidecertificate";
    
    navigate(routePath, { 
      state: { 
        certificate: certificate,
        viewMode: true  // Flag to indicate this is view-only mode
      } 
    });
  };

  const handleExportToExcel = async () => {
    try {
      // Retrieve values from localStorage
      const orgId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
      const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");

      // API URL
      let apiUrl = `${ApiUrl.apiurl}StudentCertificate/list/?organization_id=${orgId}&branch_id=${branchId}`;
      if (selectedStudentData && selectedStudentData.id) apiUrl += `&student_id=${selectedStudentData.id}`;
      if (selectedBatch) apiUrl += `&batch_id=${selectedBatch}`;
      if (selectedCourse) apiUrl += `&course_id=${selectedCourse}`;
      if (selectedDepartment) apiUrl += `&department_id=${selectedDepartment}`;
      if (selectedAcademicYear) apiUrl += `&academic_year_id=${selectedAcademicYear}`;
      if (selectedSemester) apiUrl += `&semester_id=${selectedSemester}`;
      if (selectedSection) apiUrl += `&section_id=${selectedSection}`;
      if (selectedDocumentType?.value) apiUrl += `&document_type=${selectedDocumentType.value}`;

      // Fetch API data
      const response = await fetch(apiUrl);
      
      if (response.status === 204) {
        alert("No records found.");
        return;
      }
      
      const result = await response.json();

      let data = [];
      if (Array.isArray(result)) {
        data = result;
      } else {
        throw new Error("Failed to fetch data");
      }

      // Prepare data for Excel
      const excelData = data.map((item, index) => ({
        "Sl.No": index + 1,
        "Document Type": documentTypeMapping[item.document_type] || item.document_type || "N/A",
        "Student Name": item.student_name || "",
        "Session": item.batch || "",
        "Academic Year": item.academic_year || "",
        "Course": item.course || "",
      }));

      // Create a new workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Certificates");

      // Write the Excel file and trigger download
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(blob, "StudentCertificates.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export data. Please try again.");
    }
  };

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const currentPageData = certificates.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(certificates.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
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
                STUDENT CERTIFICATE SEARCH
              </p>
              <div className="row  mb-3 mt-3 mx-0">
                <div
                  className="col-12  d-flex
                      flex-wrap
                      gap-2"
                >
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleNewButtonClick}
                  >
                    New
                  </button>
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
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleExportToExcel}
                  >
                    Export to Excel
                  </button>
                </div>
              </div>
              <div className="row mt-3 mx-2 custom-section-box">
                <div className="col-12 ">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mb-3  mt-3">
                      <div className="col-12 col-md-3  ">
                        <label htmlFor="student-name" className="form-label">
                          Student Name<span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="student-name"
                            className="form-control detail"
                            placeholder="Enter student name"
                            ref={studentNameRef}
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

                      <ModalCertificate
                        show={showStudentSelectionModal}
                        handleClose={handleModalClose}
                        onSelectStudent={(student) => {
                          const s = student.studentBasicDetails;

                          setSelectedStudentData(s);

                          // ✅ Input fields
                          admissionNoRef.current.value = s.admission_no || "";
                          barcodeRef.current.value = s.rollno || "";
                          studentNameRef.current.value = `${s.first_name || ""} ${s.middle_name || ""} ${s.last_name || ""}`;

                          // ✅ IMPORTANT: Dropdown mapping
                          setSelectedBatch(s.batch_id || null);
                          setSelectedCourse(s.course_id || null);
                          setSelectedDepartment(s.department_id || null);
                          setSelectedAcademicYear(s.academic_year_id || null);
                          setSelectedSemester(s.semester_id || null);
                          setSelectedSection(s.section_id || null);

                          // Remove stored filters
                          localStorage.removeItem("selectedCertificateClassId");
                          localStorage.removeItem(
                            "selectedCertificateSectionId",
                          );

                          handleModalClose();
                        }}
                      />

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="admission-no" className="form-label">
                          {" "}
                          Admission No <span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="admission-no"
                            className="form-control detail"
                            placeholder="Enter admission no"
                            ref={admissionNoRef}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="student-barcode" className="form-label">
                          Roll No<span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="student-barcode"
                            className="form-control detail"
                            placeholder="Enter Roll No"
                            ref={barcodeRef}
                          />
                        </div>
                      </div>

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
                                    (b) => b.id === selectedBatch,
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
                          placeholder="Select Batch"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
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
                                    (c) => c.id === selectedCourse,
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
                          Department <span style={{ color: "red" }}>*</span>
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
                                    (d) => d.id === selectedDepartment,
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
                          Academic Year <span style={{ color: "red" }}>*</span>
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
                              (a) => a.id === selectedAcademicYear,
                            )
                              ? {
                                  value: selectedAcademicYear,
                                  label: AcademicYearList.find(
                                    (a) => a.id === selectedAcademicYear,
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
                          Semester <span style={{ color: "red" }}>*</span>
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
                                    (s) => s.id === selectedSemester,
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
                          Section <span style={{ color: "red" }}>*</span>
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
                                    (s) => s.id === selectedSection,
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

                      {/* Document Type */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="document-type" className="form-label">
                          Document Type <span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                          id="document-type"
                          className="detail"
                          classNamePrefix="react-select"
                          options={[
                            { value: "TC", label: "Transfer Certificate" },
                            { value: "BC", label: "Bonafide Certificate" },
                            { value: "CC", label: "Conduct Certificate" },
                          ]}
                          value={selectedDocumentType}
                          onChange={(selectedOption) => {
                            setSelectedDocumentType(selectedOption);
                            handleSelectChange({
                              target: { value: selectedOption?.value },
                            });
                          }}
                          placeholder="Select"
                        />
                      </div>

                      {/* Date From */}
                      {/* <div
                        className="mb-2 me-md-2"
                        style={{ width: "100%", maxWidth: "150px" }}
                      >
                        <label htmlFor="date-from" className="form-label">
                          Date From
                        </label>
                        <input
                          type="date"
                          id="date-from"
                          className="form-control detail"
                          ref={dateFromRef}
                        />
                      </div> */}
                      {/* Date To */}
                      {/* <div
                        className="mb-3 me-md-2"
                        style={{ width: "100%", maxWidth: "150px" }}
                      >
                        <label htmlFor="date-to" className="form-label">
                          Date To
                        </label>
                        <input
                          type="date"
                          id="date-to"
                          className="form-control detail"
                          ref={dateToRef}
                        />
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered ">
                    <thead>
                      <tr>
                        <th>Sl.No</th>
                        <th>Document Type</th>
                        <th>Student Name</th>
                        <th>Session</th>
                        <th>Academic Year</th>
                        <th>Course</th>
                        <th>Edit</th>
                        <th>View PDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="8" className="text-center">
                            Loading...
                          </td>
                        </tr>
                      ) : certificates.length > 0 ? (
                        currentPageData.map((certificate, index) => (
                          <tr
                            key={
                              certificate.transfer_certificate_id ||
                              certificate.character_certificate_id ||
                              certificate.bonafide_certificate_id ||
                              certificate.fee_certificate_id ||
                              index
                            }
                          >
                            <td>{offset + index + 1}</td>

                            {/* Document Type */}
                            <td>
                              {documentTypeMapping[certificate.document_type] ||
                                certificate.document_type ||
                                "N/A"}
                            </td>

                            {/* Student Name */}
                            <td>{certificate.student_name || ""}</td>

                            {/* Session */}
                            <td>{certificate.batch || ""}</td>

                            {/* Academic Year */}
                            <td>{certificate.academic_year || ""}</td>

                            {/* Class / Course */}
                            <td>{certificate.course || ""}</td>

                            {/* View/Edit Button */}
                            <td>
                              <button
                                className="btn btn-sm btn-primary d-flex align-items-center"
                                onClick={() =>
                                  handleButtonClick(certificate, "edit")
                                }
                              >
                                <i className="fas fa-edit me-2"></i>
                                Edit
                              </button>
                            </td>

                            {/* View PDF */}
                            <td>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleButtonClick(certificate, "view-new");
                                }}
                              >
                                View
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center text-muted">
                            {message || "No records found."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
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
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
                  />
                </div>
              </div>
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default AdmAttendanceEntry;
