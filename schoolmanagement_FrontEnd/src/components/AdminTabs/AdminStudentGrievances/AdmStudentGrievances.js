import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SelectSearchParty from "../AdminSearchExpense/SelectSearchParty";
import { useNavigate } from "react-router-dom";
// import SelectStudentFeeModal from "../FeeStudentModal/SelectStudentFeeModal";
import ModalClass from "../AdminStudentClass/ModalClass";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import { Modal, Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";
import "../AdmAssignmentEntry/AdmAttendanceEntry.css";

const AdmAttendanceEntry = () => {
  const token = localStorage.getItem("accessToken");

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [grievanceTypeId, setGrievanceTypeId] = useState(null);
  const [grievancePriorityId, setGrievancePriorityId] = useState(null);
  const [grievanceSeverityId, setGrievanceSeverityId] = useState(null);
  const [grievanceStatus, setGrievanceStatus] = useState(""); // Avoid using "status"
  const [loading, setLoading] = useState("");
  const [grievanceList, setGrievanceList] = useState([]);

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
  const [showStudentSearchModal, setShowStudentSearchModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [severityOptions, setSeverityOptions] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState(null);
  const [options, setOptions] = useState([]);
  // const [grievances, setGrievances] = useState([]);
  const [selectedGrievanceType, setSelectedGrievanceType] = useState(null);
  const [selectedGrievancePriority, setSelectedGrievancePriority] =
    useState(null);
  const [selectedGrievanceSeverity, setSelectedGrievanceSeverity] =
    useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [remark, setRemark] = useState("");
  const [studentTransportDetails, setStudentTransportDetails] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const fromClassRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);

  const organizationId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");

  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

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

  const handleClear = () => {
    setStudentName("");
    setStudentId("");
    setSelectedBatch("");
    setSelectedCourse("");
    setSelectedDepartment("");
    setSelectedAcademicYear("");
    setSelectedSemester("");
    setSelectedSection("");
    setSelectedGrievanceType(null);
    setSelectedPriority(null);
    setSelectedSeverity(null);
    setSelectedStatus(null);
    setFromDate("");
    setToDate("");
    setGrievanceList([]); // ✅ clear table data
    setCurrentPage(0); // ✅ reset pagination
    handleClose();
  };

  // Slice data for pagination
  // const offset = currentPage * itemsPerPage;
  // const currentData = transportData.slice(offset, offset + itemsPerPage);
  // const pageCount = Math.ceil(transportData.length / itemsPerPage);

  const offset = currentPage * itemsPerPage;
  const currentData = grievanceList.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(grievanceList.length / itemsPerPage);

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSelectStudent = (selected) => {
    console.log("Student selected:", selected);

    // 1️⃣ Set Student Input Box
    setStudentName(selected.studentBasicDetails.first_name || "");
    setStudentId(selected.studentBasicDetails.id);

    // 2️⃣ Auto-select all dropdown values
    setSelectedBatch(selected.academicDetails.batch_id || "");
    setSelectedCourse(selected.academicDetails.course_id || "");
    setSelectedDepartment(selected.academicDetails.department_id || "");
    setSelectedAcademicYear(selected.academicDetails.academic_year_id || "");
    setSelectedSemester(selected.academicDetails.semester_id || "");
    setSelectedSection(selected.academicDetails.section_id || "");

    // 3️⃣ Also set class + section (if you use these)
    setClassId(selected.academicDetails.semester_id || "");
    setSectionId(selected.academicDetails.section_id || "");

    // 4️⃣ Close modal
    handleClose();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setStudentTransportDetails(null);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      const organizationId = sessionStorage.getItem("organization_id");
      const branchId = sessionStorage.getItem("branch_id");

      // BASE URL
      let url = `${ApiUrl.apiurl}Grievance/list/?organization_id=${organizationId}&branch_id=${branchId}`;

      // 🔹 Append student filters
      if (studentId) url += `&studentId=${studentId}`;
      if (studentName) url += `&student_name=${studentName}`;

      // 🔹 Append academic filters
      if (selectedBatch) url += `&batch_id=${selectedBatch}`;
      if (selectedCourse) url += `&course_id=${selectedCourse}`;
      if (selectedDepartment) url += `&department_id=${selectedDepartment}`;
      if (selectedAcademicYear)
        url += `&academic_year_id=${selectedAcademicYear}`;
      if (selectedSemester) url += `&semester_id=${selectedSemester}`;
      if (selectedSection) url += `&section_id=${selectedSection}`;

      // 🔹 Append grievance filters
      if (selectedGrievanceType)
        url += `&grievancetypeId=${selectedGrievanceType.value}`;
      if (selectedGrievancePriority)
        url += `&grievancepriorityId=${selectedGrievancePriority.value}`;
      if (selectedGrievanceSeverity)
        url += `&grievancesecurityId=${selectedGrievanceSeverity.value}`;
      if (selectedStatus) url += `&status=${selectedStatus.value}`;

      // 🔹 Append Date range
      if (fromDate) url += `&from_date=${fromDate}`;
      if (toDate) url += `&to_date=${toDate}`;

      console.log("FINAL API:", url);

      // const response = await fetch(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      // ✅ Sort by latest first (most recent at top)
      const sortedData = (data?.data || []).sort((a, b) => {
        // Assuming there's a created_at, CreatedDate, or Grievance_id field
        // If using date field:
        if (a.CreatedDate && b.CreatedDate) {
          return new Date(b.CreatedDate) - new Date(a.CreatedDate);
        }
        // If using ID (higher ID = newer):
        if (a.Grievance_id && b.Grievance_id) {
          return b.Grievance_id - a.Grievance_id;
        }
        return 0;
      });

      setGrievanceList(sortedData); // ✅ update table data with sorted data
      setCurrentPage(0); // ✅ reset pagination
      setLoading(false);
    } catch (error) {
      console.error("Error fetching grievances:", error);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    const token = localStorage.getItem("accessToken");
    const userId = Number(sessionStorage.getItem("userId")) || 1;

    // 🔹 Filter rows that have status selected
    const rowsToUpdate = grievanceList.filter(
      (row) => row.status !== undefined && row.status !== ""
    );

    if (rowsToUpdate.length === 0) {
      alert("⚠️ Please change any status before saving.");
      return;
    }

    // 🔥 BULK PAYLOAD FORMAT
    const payload = {
      grievance_ids: rowsToUpdate.map((row) => row.Grievance_id),
      updated_by_list: rowsToUpdate.map(() => userId),
      status_list: rowsToUpdate.map((row) => row.status),
    };

    console.log("📦 Final Bulk Payload:", payload);

    try {
      const response = await fetch(`${ApiUrl.apiurl}Grievance/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("✅ Status Updated Successfully");
        handleSearch(); // refresh table
      } else {
        alert("❌ Update Failed");
      }
    } catch (err) {
      console.error("❌ ERROR:", err);
      alert("⚠️ Something went wrong!");
    }
  };

  const handleShowUpdateModal = (event, grievance) => {
    event.preventDefault(); // Prevent default anchor behavior
    setSelectedGrievance(grievance);
    setRemark(grievance.remark || "");
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedGrievance(null);
    setRemark("");
  };

  // For Grievance Dropdown
  useEffect(() => {
    const fetchGrievanceType = async () => {
      try {
        // const response = await fetch(
        //   `${ApiUrl.apiurl}GrievanceType/list/?organization_id=${organizationId}&branch_id=${branchId}`
        // );
        const response = await fetch(
          `${ApiUrl.apiurl}GrievanceType/list/?organization_id=${organizationId}&branch_id=${branchId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data?.data) {
          const formattedOptions = data.data.map((item) => ({
            value: item.grievance_type_id,
            label: item.grievance_type,
          }));
          setOptions(formattedOptions);
        }
      } catch (error) {
        console.error("Error fetching grievance types:", error);
      }
    };

    fetchGrievanceType();
  }, [organizationId, branchId]);

  // For Grievance Priority Dropdown
  useEffect(() => {
    const fetchGrievancePriority = async () => {
      try {
        // const response = await fetch(
        //   `${ApiUrl.apiurl}GrievancePriority/list/?organization_id=${organizationId}&branch_id=${branchId}`
        // );
        const response = await fetch(
          `${ApiUrl.apiurl}GrievancePriority/list/?organization_id=${organizationId}&branch_id=${branchId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data?.data) {
          const formattedOptions = data.data.map((item) => ({
            value: item.grievance_priority_id,
            label: item.priority_type,
          }));
          setPriorityOptions(formattedOptions);
        }
      } catch (error) {
        console.error("Error fetching grievance priority:", error);
      }
    };

    fetchGrievancePriority();
  }, [organizationId, branchId]);

  // For Grievance Severity Dropdown
  useEffect(() => {
    const fetchGrievanceSeverity = async () => {
      try {
        // const response = await fetch(
        //   `${ApiUrl.apiurl}GrievanceSeverity/list/?organization_id=${organizationId}&branch_id=${branchId}`
        // );
        const response = await fetch(
          `${ApiUrl.apiurl}GrievanceSeverity/list/?organization_id=${organizationId}&branch_id=${branchId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data?.data) {
          const formattedOptions = data.data.map((item) => ({
            value: item.severity_id,
            label: item.severity_type,
          }));
          setSeverityOptions(formattedOptions);
        }
      } catch (error) {
        console.error("Error fetching grievance severity:", error);
      }
    };

    fetchGrievanceSeverity();
  }, [organizationId, branchId]);

  // For Grievance Table List
  useEffect(() => {
    const fetchGrievanceList = async () => {
      try {
        // const response = await fetch(
        //   `${ApiUrl.apiurl}Grievance/list/?organization_id=${organizationId}&branch_id=${branchId}`
        // );
        const response = await fetch(
          `${ApiUrl.apiurl}Grievance/list/?organization_id=${organizationId}&branch_id=${branchId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data?.data) {
          setGrievanceList(data.data);
        }
      } catch (error) {
        console.error("Error fetching grievance list:", error);
      }
    };

    fetchGrievanceList();
  }, [organizationId, branchId]);

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
                STUDENT GRIEVANCES
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

                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: "150px" }}
                    onClick={handleUpdateStatus} // ✅ just call the bulk function
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-1">
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
                            className="btn btn-primary ms-2 mb-0 mt-0"
                            onClick={handleShow}
                            style={{ width: "50px", padding: "3px" }}
                          >
                            ...
                          </button>
                        </div>
                      </div>

                      <ModalClass
                        show={show}
                        handleClose={handleClose}
                        onSelectStudent={handleSelectStudent}
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

                      <div className="col-md-3 mb-3">
                        <label htmlFor="grievance-type" className="form-label">
                          Grievance Type
                        </label>
                        <Select
                          classNamePrefix="react-select"
                          isClearable={true}
                          className="detail"
                          placeholder="Select"
                          options={options}
                          value={selectedGrievanceType}
                          onChange={(selectedOption) =>
                            setSelectedGrievanceType(selectedOption)
                          }
                        />
                      </div>

                      <div className="col-md-3 mb-1">
                        <label
                          htmlFor="grievance-priority"
                          className="form-label"
                        >
                          Grievance Priority
                        </label>
                        <Select
                          classNamePrefix="react-select"
                          isClearable={true}
                          className="detail"
                          placeholder="Select"
                          options={priorityOptions}
                          value={selectedPriority}
                          onChange={(selectedOption) =>
                            setSelectedPriority(selectedOption)
                          }
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <label
                          htmlFor="grievance-severity"
                          className="form-label"
                        >
                          Grievance Severity
                        </label>
                        <Select
                          classNamePrefix="react-select"
                          isClearable={true}
                          className="detail"
                          placeholder="Select"
                          options={severityOptions}
                          value={selectedSeverity}
                          onChange={(selectedOption) =>
                            setSelectedSeverity(selectedOption)
                          }
                        />
                      </div>

                      <div className="col-md-3">
                        <label htmlFor="status" className="form-label">
                          Status
                        </label>
                        <Select
                          classNamePrefix="react-select"
                          isClearable={true}
                          className="detail"
                          placeholder="Select"
                          options={[
                            { value: "A", label: "All" },
                            { value: "Y", label: "Action Taken" },
                            { value: "N", label: "Action Not Taken" },
                          ]}
                          value={selectedStatus}
                          onChange={(selectedOption) =>
                            setSelectedStatus(selectedOption)
                          }
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <label style={{ fontWeight: "700" }}>From Date</label>
                        <input
                          type="date"
                          className="form-control detail"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <label style={{ fontWeight: "700" }}>To Date</label>
                        <input
                          type="date"
                          className="form-control detail"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  {loading ? (
                    <p>Loading grievances...</p>
                  ) : (
                    <table className="table table-bordered table-striped mt-3">
                      <thead
                        style={{
                          backgroundColor: "#f5f5f5",
                          fontWeight: "bold",
                        }}
                      >
                        <tr>
                          <th>Sl No.</th>
                          <th>Grievance No</th>
                          <th>Student Name</th>
                          <th>Course</th>
                          <th>Department</th>
                          <th>Academic Year</th>
                          <th>Semester</th>
                          <th>Section</th>
                          {/* <th>Barcode</th> */}
                          <th>Type</th>
                          <th>Priority</th>
                          <th>Severity</th>
                          <th>Details</th>
                          <th>Submitted Date</th>
                          <th>File</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.length > 0 ? (
                          currentData.map((row, index) => (
                            <tr key={row.Grievance_id}>
                              <td>{offset + index + 1}</td>
                              <td>{row.GrievanceNumber}</td>
                              <td>{row.student_name}</td>
                              <td>{row.course_name}</td>
                              <td>{row.department_name}</td>
                              <td>{row.academic_year}</td>
                              <td>{row.semester}</td>
                              <td>{row.section}</td>
                              {/* <td>{row.barcode}</td> */}
                              <td>{row.GrievanceType}</td>
                              <td>{row.GrievancePriority}</td>
                              <td>{row.GrievanceSeverity}</td>
                              <td>
                                <textarea
                                  value={row.details || "No Details"}
                                  readOnly
                                  rows={3}
                                  className="form-control"
                                  style={{
                                    height: "80px",
                                    width: "400px",
                                    resize: "none",
                                    overflowY: "auto",
                                    fontSize: "13px",
                                    backgroundColor: "#fff",
                                  }}
                                />
                              </td>
                              <td>{row.submitted_date}</td>
                              <td>
                                {row.file_path ? (
                                  <a
                                    href={row.file_path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View
                                  </a>
                                ) : (
                                  "No File"
                                )}
                              </td>
                              <td>
                                <td>
                                  <select
                                    className="form-select"
                                    value={row.status}
                                    onChange={(e) => {
                                      const selectedValue =
                                        e.target.value === "true";
                                      setGrievanceList((prev) =>
                                        prev.map((g) =>
                                          g.Grievance_id === row.Grievance_id
                                            ? { ...g, status: selectedValue }
                                            : g
                                        )
                                      );
                                    }}
                                    style={{
                                      width: "160px",
                                      minWidth: "160px",
                                      height: "38px",
                                      padding: "6px 12px",
                                      fontSize: "14px",
                                      borderRadius: "4px",
                                      border: "1px solid #ced4da",
                                      backgroundColor: "#fff",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <option value="true">Pending</option>
                                    <option value="false">Resolved</option>
                                  </select>
                                </td>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="15" className="text-center">
                              No Records Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                  {grievanceList.length > itemsPerPage && (
                    <ReactPaginate
                      previousLabel="Previous"
                      nextLabel="Next"
                      breakLabel="..."
                      pageCount={pageCount}
                      onPageChange={handlePageClick}
                      forcePage={currentPage}
                      containerClassName="pagination justify-content-center mt-3"
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      nextClassName="page-item"
                      nextLinkClassName="page-link"
                      breakClassName="page-item"
                      breakLinkClassName="page-link"
                      activeClassName="active"
                      marginPagesDisplayed={1}
                      pageRangeDisplayed={5}
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
