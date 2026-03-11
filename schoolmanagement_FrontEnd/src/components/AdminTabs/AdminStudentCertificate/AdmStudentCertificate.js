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
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);

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

  const dateToRef = useRef(null);
  const dateFromRef = useRef(null);
  const fromClassRef = useRef(null);
  const toStatusRef = useRef(null);
  const toDocumentRef = useRef(null);
  const studentNameRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // adjust rows per page

  const handleClear = () => {
    // Reset input refs
    if (dateToRef.current) dateToRef.current.value = "";
    if (dateFromRef.current) dateFromRef.current.value = "";
    if (admissionNoRef.current) admissionNoRef.current.value = "";
    if (barcodeRef.current) barcodeRef.current.value = "";
    if (studentNameRef.current) studentNameRef.current.value = "";

    // Reset formData fields
    setFormData({
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
      sectionId: "",
      subjects_studied: "",
      total_working_day: "",
      total_present_day: "",
    });

    // Reset React Selects
    setSelectedStatus(null);
    setSelectedDocumentType(null);

    // Clear localStorage (except critical keys)
    const keysToKeep = [
      "academicSessionId",
      "branchId",
      "nextAcademicSessionId",
      "orgId",
    ];
    const tempStorage = {};
    keysToKeep.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value !== null) tempStorage[key] = value;
    });
    localStorage.clear();
    Object.entries(tempStorage).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
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
          `${ApiUrl.apiurl}STUDENT_CERTIFICATE/GetStudentCertificates/?branch_id=${branchId}&organization_id=${organizationId}`
        );

        const result = await response.json();

        if (result.message === "success") {
          setCertificates(result.data);
        } else {
          setCertificates([]);
          console.error("Failed:", result.message);
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
        setCertificates([]);
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
    const orgId = localStorage.getItem("orgId");
    const branchId = localStorage.getItem("branchId");
    const studentId = localStorage.getItem("selectedCertificateStudentId");

    try {
      const apiUrl = `${ApiUrl.apiurl}STUDENT_CERTIFICATE/GetStudentDetailsBasedOnDocumentTypeStudentId/?academic_year_id=${academicYearId}&orgId=${orgId}&branchId=${branchId}&document_type=${documentType}&studentId=${studentId}`;

      const response = await fetch(apiUrl, { method: "GET" });

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
            navigate("/transfercertificateform", { state: result.data });
            break;
          case "CC":
            navigate("/charactercertificate", { state: result.data });
            break;
          case "BC":
            navigate("/bonafidecertificate", { state: result.data });
            break;
          case "FC":
            navigate("/feecertificate", { state: result.data });
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
    CC: "Character Certificate",
    BC: "Bonified Certificate",
    FC: "Fee Certificate",
  };

  const handleSearch = () => {
    setLoading(true);
    const orgId = sessionStorage.getItem("organization_id") || 1;
    const brId = sessionStorage.getItem("branch_id") || 1;
    fetch(`${ApiUrl.apiurl}STUDENT_CERTIFICATE/GetStudentCertificates/?organization_id=${orgId}&branch_id=${brId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success") {
          setCertificates(data.data);
          setMessage("");
        } else {
          setCertificates([]);
          setMessage("No data found");
        }
        setLoading(false);
      })
      .catch(() => {
        setCertificates([]);
        setMessage("Error fetching data");
        setLoading(false);
      });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleButtonClick = async (certificate, action) => {
    localStorage.setItem("document_type", certificate.documentType);
    localStorage.setItem("studentId", certificate.studentId);
    localStorage.setItem(
      "transfer_certificate_id",
      certificate.transfer_certificate_id
    );

    const academicYearId = localStorage.getItem("academicSessionId");
    const orgId = localStorage.getItem("orgId");
    const branchId = localStorage.getItem("branchId");
    const documentType = localStorage.getItem("document_type");
    const studentId = localStorage.getItem("studentId");
    const transferCertificateId = localStorage.getItem(
      "transfer_certificate_id"
    );

    const apiUrl = `${ApiUrl.apiurl}STUDENT_CERTIFICATE/GetStudentDetailsBasedOnDocumentTypeStudentId/?academic_year_id=${academicYearId}&orgId=${orgId}&branchId=${branchId}&document_type=${documentType}&studentId=${studentId}&transfer_certificate_id=${transferCertificateId}`;

    try {
      const response = await fetch(apiUrl);
      const result = await response.json();

      switch (documentType) {
        case "TC":
          if (action === "view") {
            navigate("/transfercertificateformview", {
              state: { certificate: result.data },
            });
          } else {
            navigate("/transfercertificateformedit", {
              state: { certificate: result.data },
            });
          }
          break;
        case "CC":
          if (action === "view") {
            navigate("/charactercertificateview", {
              state: { certificate: result.data },
            });
          } else {
            navigate("/charactercertificateedit", {
              state: { certificate: result.data },
            });
          }
          break;
        case "BC":
          if (action === "view") {
            navigate("/bonafidecertificateview", {
              state: { certificate: result.data },
            });
          } else {
            navigate("/bonafidecertificateedit", {
              state: { certificate: result.data },
            });
          }
          break;
        case "FC":
          if (action === "view") {
            navigate("/feecertificateview", {
              state: { certificate: result.data },
            });
          } else {
            navigate("/feecertificateedit", {
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
    }
  };

  const handleViewPDFClick = (certificate) => {
    localStorage.setItem(
      "transfer_certificate_id",
      certificate.transfer_certificate_id
    );
    localStorage.setItem("studentId", certificate.studentId);
    localStorage.setItem("documentType", certificate.documentType);

    // Open PDF viewer in a new tab
    switch (certificate.documentType) {
      case "TC":
        window.open("/transfercertificatepdf", "_blank");
        break;
      case "CC":
        window.open("/charactercertificatepdf", "_blank");
        break;
      case "BC":
        window.open("/bonafidecertificatepdf", "_blank");
        break;
      case "FC":
        window.open("/feecertificatepdf", "_blank");
        break;
      default:
        alert("Invalid document type.");
        break;
    }
  };

  const handleExportToExcel = async () => {
    try {
      // Retrieve values from localStorage
      const academicYearId = localStorage.getItem("academicSessionId");
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");

      // API URL
      const apiUrl = `${ApiUrl.apiurl}STUDENT_CERTIFICATE/GetStudentCertificates/?academic_year_id=${academicYearId}&orgId=${orgId}&branchId=${branchId}`;

      // Fetch API data
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (result.message !== "success") {
        throw new Error("Failed to fetch data");
      }

      const data = result.data;

      // Map documentType and status codes
      const documentTypeMap = {
        TC: "Transfer Certificate",
        BC: "Bonafide Certificate",
        CC: "Character Certificate",
        FC: "Fee Certificate",
      };

      const statusMap = {
        C: "Canceled",
        A: "Approved",
        N: "New",
      };

      // Prepare data for Excel
      const excelData = data.map((item, index) => ({
        "Sr.No": index + 1,
        "Document Type": documentTypeMap[item.documentType] || "Unknown",
        "Applied On": item.tc_applied_date,
        "Issued On": item.tc_issued_date || "Not Issued",
        "Document No": item.transfer_certificate_no,
        "Student Name": item.studentname,
        "School Admission No": item.school_admission_no,
        Section: item.sectionname,
        Reason: item.reason_for_tc || "N/A",
        Status: statusMap[item.status] || "Unknown",
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
                            disabled
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
                          const studentDetails = student.studentBasicDetails;

                          admissionNoRef.current.value =
                            studentDetails.admission_no;
                          barcodeRef.current.value = studentDetails.barcode;
                          studentNameRef.current.value = `${studentDetails.first_name
                            } ${studentDetails.middle_name || ""} ${studentDetails.last_name
                            }`;

                          const classId = localStorage.getItem(
                            "selectedCertificateClassId"
                          );
                          const sectionId = localStorage.getItem(
                            "selectedCertificateSectionId"
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
                            disabled
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="student-barcode" className="form-label">
                          Student BarCode<span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="student-barcode"
                            className="form-control detail"
                            placeholder="Enter student BarCode"
                            ref={barcodeRef}
                            disabled
                          />
                        </div>
                      </div>

                      {/* Batch */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="batch" className="form-label">Batch</label>
                        <Select
                          isLoading={loadingBatch}
                          options={BatchList?.map(b => ({ value: b.id, label: b.batch_description })) || []}
                          value={
                            BatchList?.find(b => b.id === selectedBatch)
                              ? { value: selectedBatch, label: BatchList.find(b => b.id === selectedBatch)?.batch_description }
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
                        <label htmlFor="course" className="form-label">Course</label>
                        <Select
                          isLoading={loadingCourse}
                          options={CourseList?.map(c => ({ value: c.id, label: c.course_name })) || []}
                          value={
                            CourseList?.find(c => c.id === selectedCourse)
                              ? { value: selectedCourse, label: CourseList.find(c => c.id === selectedCourse)?.course_name }
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
                          isLoading={loadingDept}
                          options={BranchList?.map(d => ({ value: d.id, label: d.department_description })) || []}
                          value={
                            BranchList?.find(d => d.id === selectedDepartment)
                              ? { value: selectedDepartment, label: BranchList.find(d => d.id === selectedDepartment)?.department_description }
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
                          isLoading={loadingAY}
                          options={AcademicYearList?.map(a => ({ value: a.id, label: a.academic_year_description })) || []}
                          value={
                            AcademicYearList?.find(a => a.id === selectedAcademicYear)
                              ? { value: selectedAcademicYear, label: AcademicYearList.find(a => a.id === selectedAcademicYear)?.academic_year_description }
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
                          isLoading={loadingSem}
                          options={SemesterList?.map(s => ({ value: s.id, label: s.semester_description })) || []}
                          value={
                            SemesterList?.find(s => s.id === selectedSemester)
                              ? { value: selectedSemester, label: SemesterList.find(s => s.id === selectedSemester)?.semester_description }
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
                          isLoading={loadingSec}
                          options={SectionList?.map(s => ({ value: s.id, label: s.section_name })) || []}
                          value={
                            SectionList?.find(s => s.id === selectedSection)
                              ? { value: selectedSection, label: SectionList.find(s => s.id === selectedSection)?.section_name }
                              : null
                          }
                          onChange={(opt) => setSelectedSection(opt?.value || "")}
                          placeholder="Select Section"
                        />
                      </div>

                      {/* Status */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="status" className="form-label">
                          Status
                        </label>
                        <Select
                          id="status"
                          className="detail"
                          classNamePrefix="react-select"
                          options={[
                            { value: "New", label: "New" },
                            { value: "Approved", label: "Approved" },
                            { value: "Cancelled", label: "Cancelled" },
                          ]}
                          value={selectedStatus}
                          onChange={(selectedOption) => {
                            setSelectedStatus(selectedOption);

                            const statusValue = selectedOption?.value || "";
                            const statusMapping = {
                              New: "N",
                              Approved: "A",
                              Cancelled: "C",
                            };

                            if (statusValue) {
                              localStorage.setItem(
                                "status",
                                statusMapping[statusValue] || ""
                              );
                            } else {
                              localStorage.removeItem("status");
                            }
                          }}
                          placeholder="Select"
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
                            { value: "CC", label: "Character Certificate" },
                            { value: "BC", label: "Bonafide Certificate" },
                            { value: "FC", label: "Fee Certificate" },
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
                      <div
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
                      </div>
                      {/* Date To */}
                      <div
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sl.No</th>
                        <th>Document Type</th>
                        <th>Applied On</th>
                        <th>Issued On</th>
                        <th>Document No</th>
                        <th>Student Name</th>
                        <th>School Admission No</th>
                        <th>Course</th>
                        <th>Section</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>View/Edit</th>
                        <th>View PDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="13" className="text-center">Loading...</td>
                        </tr>
                      ) : certificates.length > 0 ? (
                        currentPageData.map((certificate, index) => (
                          <tr key={certificate.transfer_certificate_id}>
                            <td>{offset + index + 1}</td>

                            {/* Document Type */}
                            <td>
                              {documentTypeMapping[certificate.documentType] || "N/A"}
                            </td>

                            {/* Applied On */}
                            <td>{certificate.tc_applied_date || ""}</td>

                            {/* Issued On */}
                            <td>{certificate.tc_issued_date || ""}</td>

                            {/* Document Number */}
                            <td>
                              {certificate.transfer_certificate_no_prefix &&
                                certificate.transfer_certificate_no_postfix
                                ? `${certificate.transfer_certificate_no_prefix}/${certificate.transfer_certificate_no_postfix}`
                                : certificate.transfer_certificate_no || "N/A"}
                            </td>

                            {/* Student Name */}
                            <td>{certificate.studentname}</td>

                            {/* School Admission No */}
                            <td>{certificate.admission_no}</td>

                            {/* Class / Course */}
                            <td>{certificate.course_name}</td>

                            {/* Section */}
                            <td>{certificate.section_name}</td>

                            {/* Reason */}
                            <td>{certificate.reason_for_tc || ""}</td>

                            {/* Status */}
                            <td>
                              {certificate.status === "A" && "Approved"}
                              {certificate.status === "C" && "Cancelled"}
                              {certificate.status === "N" && "New"}
                              {!certificate.status && "N/A"}
                            </td>

                            {/* View/Edit Button */}
                            <td>
                              {certificate.status === "C" ? (
                                <button
                                  className="btn btn-sm btn-primary d-flex align-items-center"
                                  onClick={() => handleButtonClick(certificate, "view")}
                                >
                                  <i className="fas fa-eye me-2"></i>
                                  View
                                </button>
                              ) : (
                                <button
                                  className="btn btn-sm btn-primary d-flex align-items-center"
                                  onClick={() => handleButtonClick(certificate, "edit")}
                                >
                                  <i className="fas fa-edit me-2"></i>
                                  Edit
                                </button>
                              )}
                            </td>

                            {/* View PDF */}
                            <td>
                              {certificate.status === "A" && (
                                <button
                                  className="btn btn-sm btn-secondary d-flex align-items-center"
                                  onClick={() => handleViewPDFClick(certificate)}
                                >
                                  <i className="fas fa-file-pdf me-2"></i>
                                  View PDF
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="13" className="text-center text-muted">
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
                    containerClassName={"pagination justify-content-center mt-3"}
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
