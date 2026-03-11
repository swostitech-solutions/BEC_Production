import React, { useEffect, useRef, useState } from "react";
import { fetchMessageTypes } from "../../hooks/fetchMessageTypes ";
import { fetchInitiatedByList } from "../../hooks/fetchInitiatedByList";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import ModalStudent from "./ModalStudent";
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
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [data, setData] = useState([]);
  const [messageTypes, setMessageTypes] = useState([]);
  const [initiatedByList, setInitiatedByList] = useState([]);
  //New Added Usestate
  const [selectedMessageType, setSelectedMessageType] = useState(null);
  const [selectedInitiatedBy, setSelectedInitiatedBy] = useState(null);

  const organizationId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

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

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const navigate = useNavigate();
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleNewMessage = () => {
    navigate("/admstudentmessagelist");
  };

  const dateFromRef = useRef(null);
  const dateToRef = useRef(null);
  const messageTypeRef = useRef(null);
  const studentNameRef = useRef(null);
  const initiatedByRef = useRef(null);
  const [isInputDisabled, setIsInputDisabled] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * rowsPerPage;
  const currentRows = data.slice(offset, offset + rowsPerPage);
  const pageCount = Math.ceil(data.length / rowsPerPage);

  useEffect(() => {
    const loadMessageTypes = async () => {
      const types = await fetchMessageTypes();
      setMessageTypes(types);
    };
    const loadInitiatedByOptions = async () => {
      const list = await fetchInitiatedByList();
      setInitiatedByList(list);
    };
    loadMessageTypes();
    loadInitiatedByOptions();
  }, []);

  const handleMessageTypeChange = (selectedOption) => {
    setSelectedMessageType(selectedOption); // NEW
    const selectedMessageId = selectedOption?.value || "";
    localStorage.setItem("selectedMessageTypeId", selectedMessageId);
  };

  const messageTypeOptions = messageTypes.map((type) => ({
    value: type.id,
    label: type.message_type_description, // ✅ correct property
  }));

  const initiatedByOptions = initiatedByList.map((item) => ({
    value: item.id,
    label: item.initiated_by_description, // ✅ correct property
  }));

  // Handle change for Initiated Select
  const handleInitiatedByChange = (selectedOption) => {
    setSelectedInitiatedBy(selectedOption); // NEW
    const selectedId = selectedOption?.value || "";
    localStorage.setItem("selectedInitiatedById", selectedId);
  };

  const handleSelectStudent = (student) => {
    // Set the input field
    const fullName = student.student_name;
    setSelectedStudentName(fullName);
    if (studentNameRef.current) {
      studentNameRef.current.value = fullName;
    }

    // Auto-fill dropdowns
    setSelectedBatch(student.batch_id);
    setSelectedCourse(student.course_id);
    setSelectedDepartment(student.department_id);
    setSelectedAcademicYear(student.academic_year_id);
    setSelectedSemester(student.semester_id);
    setSelectedSection(student.section_id);

    // Store ID if you need it later
    localStorage.setItem("selectedMessageStudentId", student.student_id);

    handleCloseModal();
  };

  const handleSearch = async () => {
    const organizationId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");
    const token = localStorage.getItem("accessToken"); // ✅ Get token

    const batchId = selectedBatch || "";
    const courseId = selectedCourse || "";
    const deptId = selectedDepartment || "";
    const ayId = selectedAcademicYear || "";
    const semId = selectedSemester || "";
    const sectionId = selectedSection || "";

    const dateFrom = dateFromRef.current?.value || "";
    const dateTo = dateToRef.current?.value || "";

    // 🔥 Build URL with all parameters
    const apiUrl = `${ApiUrl.apiurl}MessageSend/StudentMessageHistoryFilter/
    ?organization_id=${organizationId}
    &branch_id=${branchId}
    &batch_id=${batchId}
    &course_id=${courseId}
    &department_id=${deptId}
    &academic_year_id=${ayId}
    &semester_id=${semId}
    &section_id=${sectionId}
    &date_from=${dateFrom}
    &date_to=${dateTo}`.replace(/\s+/g, ""); // remove spaces

    console.log("SEARCH URL:", apiUrl);

    try {
      // const response = await fetch(apiUrl);
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Add token
        },
      });
      const result = await response.json();

      if (result.message === "success" && Array.isArray(result.data)) {
        setData(result.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setData([]);
    }
  };

  const handleClear = () => {
    // Clear input fields
    if (dateFromRef.current) dateFromRef.current.value = "";
    if (dateToRef.current) dateToRef.current.value = "";
    if (studentNameRef.current) studentNameRef.current.value = "";

    setSelectedStudentName("");

    // Clear dropdown states
    setSelectedBatch(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);

    setSelectedMessageType(null);
    setSelectedInitiatedBy(null);

    // Clear table data
    setData([]);

    // Clear localStorage
    localStorage.removeItem("selectedMessageTypeId");
    localStorage.removeItem("selectedMessageStudentId");
    localStorage.removeItem("selectedInitiatedById");
    localStorage.removeItem("selectedMessageClass");
    localStorage.removeItem("selectedMessageSection");

    console.log("All filters cleared.");
  };

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
                STUDENT MESSAGE
              </p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleNewMessage}
                  >
                    New Message
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
                </div>
              </div>
              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mt-2">
                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="message-type" className="form-label">
                          Message Type
                        </label>
                        <Select
                          inputId="message-type"
                          className="detail"
                          classNamePrefix="detail"
                          options={messageTypeOptions}
                          onChange={handleMessageTypeChange}
                          value={selectedMessageType}
                          placeholder="Select message type"
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-0">
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
                            disabled={isInputDisabled}
                            value={selectedStudentName}
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
                      {/* </div> */}
                      <div className="col-12 col-md-3 mb-0">
                        <label htmlFor="from-class" className="form-label">
                          Initiated By
                        </label>
                        <Select
                          inputId="from-class"
                          className="detail"
                          classNamePrefix="detail"
                          options={initiatedByOptions}
                          onChange={handleInitiatedByChange}
                          value={selectedInitiatedBy} // NEW
                          placeholder="Select initiated by"
                        />
                      </div>

                      {/* Batch */}
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="batch" className="form-label">
                          Session
                        </label>
                        <Select
                          className=" detail"
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
                          className=" detail"
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
                          className=" detail"
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
                          className=" detail"
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
                          className=" detail"
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
                          className=" detail"
                          options={
                            SectionList?.map((s) => ({
                              value: s.id,
                              label: s.section_name,
                            })) || []
                          }
                          value={
                            SectionList?.some((s) => s.id == selectedSection)
                              ? {
                                  value: selectedSection,
                                  label: SectionList.find(
                                    (s) => s.id == selectedSection
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

                      <div className="col-12 col-md-3 mb-1">
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
                      <div className="col-12 col-md-3 mb-1">
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

                      <ModalStudent
                        show={showModal}
                        handleClose={handleCloseModal}
                        onSelectStudent={handleSelectStudent}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table  table-bordered">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Course</th>
                        <th>Department</th>
                        <th>Section</th>
                        <th>Student Name</th>
                        <th>ONMRC Registration No</th>
                        <th>Admission No</th>
                        <th>BarCode</th>
                        <th>Father Name</th>
                        <th>Message Type</th>
                        <th>Message Date</th>
                        <th>Initiated By</th>
                        <th>Initiated Remarks</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length > 0 ? (
                        currentRows.map((row, index) => (
                          <tr key={index}>
                            <td>{currentPage * rowsPerPage + index + 1}</td>

                            {/* Class */}
                            <td>{row.course_name}</td>

                            {/* Department */}
                            <td>{row.department_description}</td>

                            {/* Section */}
                            <td>{row.section_name}</td>

                            {/* Student Name */}
                            <td>{row.studentName}</td>

                            {/* Registration No */}
                            <td>{row.registration_no}</td>

                            {/* College Admission No */}
                            <td>{row.college_admission_no}</td>

                            {/* Barcode */}
                            <td>{row.barcode}</td>

                            {/* Father Name */}
                            <td>{row.fatherName}</td>

                            {/* Message Type */}
                            <td>{row.messageType}</td>

                            {/* Message Date */}
                            <td>{row.message_date}</td>

                            {/* Initiated By */}
                            <td>{row.InitiatedBy}</td>

                            {/* Initiated Remarks */}
                            <td>{row.initiated_remarks}</td>

                            {/* Message */}
                            <td>{row.message}</td>

                            {/* Status */}
                            {/* <td>
                              {row.message_status === "P" ? "Pending" : "Completed"}
                            </td> */}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="14" className="text-center">
                            No data found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {data.length > rowsPerPage && (
                    <ReactPaginate
                      previousLabel={"Previous"}
                      nextLabel={"Next"}
                      breakLabel={"..."}
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
