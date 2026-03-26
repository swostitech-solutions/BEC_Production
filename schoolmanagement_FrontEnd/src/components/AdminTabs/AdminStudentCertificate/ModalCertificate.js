import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import useFetchClasses from "../../hooks/useFetchClasses";
import useFetchSections from "../../hooks/useFetchSections";
import Select from "react-select";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";
import { ApiUrl } from "../../../ApiUrl";
import ReactPaginate from "react-paginate";

const ModalCertificate = ({ show, onSelectStudent, handleClose }) => {

  // ====================== DROPDOWN STATES ======================
  const organizationId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  // ====================== HOOK CALLS (Filtered) ======================
  const { BatchList } = useFetchSessionList(organizationId, branchId);
  const { CourseList } = useFetchCourseByFilter(organizationId, selectedBatch);
  const { BranchList } = useFetchBranch(
    organizationId,
    branchId,
    selectedBatch,
    selectedCourse
  );
  const { AcademicYearList } = useFetchAcademicYearByFilter(
    organizationId,
    branchId,
    selectedBatch,
    selectedCourse,
    selectedDepartment
  );
  const { SemesterList } = useFetchSemesterByFilter(
    organizationId,
    branchId,
    selectedBatch,
    selectedCourse,
    selectedDepartment,
    selectedAcademicYear
  );
  const { SectionList } = useFetchSectionByFilter(
    organizationId,
    branchId,
    selectedBatch,
    selectedCourse,
    selectedDepartment,
    selectedAcademicYear,
    selectedSemester
  );

  const [students, setStudents] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [studentData, setStudentData] = useState([]);
  const [fullStudentData, setFullStudentData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    studentName: "",
    admissionNo: "",
    barcode: "",
    classId: "",
    section: "",
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };
const [currentPage, setCurrentPage] = useState(0);
const itemsPerPage = 10;
const offset = currentPage * itemsPerPage;

const currentStudents = studentData.slice(offset, offset + itemsPerPage);

const pageCount = Math.ceil(studentData.length / itemsPerPage);

const handlePageClick = (event) => {
  setCurrentPage(event.selected);
};
  // Trigger modal open logic (you might have this somewhere else in your code)
  const handleOpen = () => {
    setIsModalOpen(true);
  };

const handleSearch = async () => {
  try {
    const orgId = sessionStorage.getItem("organization_id");
    const brId = sessionStorage.getItem("branch_id");

    let url = `${ApiUrl.apiurl}StudentCourse/StudentCourseRecordFilter/?organization_id=${orgId}&branch_id=${brId}`;

    // Text filters
    if (filters.studentName)
      url += `&student_name=${encodeURIComponent(filters.studentName)}`;
    if (filters.admissionNo)
      url += `&admission_no=${encodeURIComponent(filters.admissionNo)}`;
    if (filters.barcode)
      url += `&barcode=${encodeURIComponent(filters.barcode)}`;

    // Dropdown filters
    if (selectedBatch) url += `&batch_id=${selectedBatch}`;
    if (selectedCourse) url += `&course_id=${selectedCourse}`;
    if (selectedDepartment) url += `&department_id=${selectedDepartment}`;
    if (selectedAcademicYear) url += `&academic_year_id=${selectedAcademicYear}`;
    if (selectedSemester) url += `&semester_id=${selectedSemester}`;
    if (selectedSection) url += `&section_id=${selectedSection}`;

    console.log("🔍 Certificate Search URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error fetching student record");
    }

    const data = await response.json();

    if (data.message === "success!!") {
      let results = data.data;

      setStudentData(results);
      setFullStudentData(data.data);

      // ✅ IMPORTANT FIX (Pagination reset)
      setCurrentPage(0);

    } else {
      setStudentData([]);
      setFullStudentData([]);
      console.warn("No student data found.");
    }
  } catch (error) {
    console.error("API ERROR:", error);
  }
};
  const handleSelectStudent = (student) => {

 const formattedStudent = {
  studentBasicDetails: {
    id: student.student_id,
    first_name: student.student_name,
    admission_no: student.college_admission_no,
    barcode: student.barcode,
    father_name: student.father_name,
    mother_name: student.mother_name,
    rollno: student.enrollment_no,

    // ✅ ADD THESE (IMPORTANT)
    batch_id: student.batch_id,
    course_id: student.course_id,
    department_id: student.department_id,
    academic_year_id: student.academic_year_id,
    semester_id: student.semester_id,
    section_id: student.section
  }
};

    localStorage.setItem("selectedCertificateStudentId", student.student_id);

    onSelectStudent(formattedStudent);
    setStudentData([]);
    handleClose();
  };

  const handleClearFilters = () => {
    setFilters({
      studentName: "",
      admissionNo: "",
      barcode: "",
      classId: "",
      section: "",
    });

    // Reset dropdown selections
    setSelectedBatch(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);

    setStudentData(fullStudentData);
    setCurrentPage(0);
  };

  // Reset everything when modal is closed
  const handleModalClose = () => {
    setFilters({
      studentName: "",
      admissionNo: "",
      barcode: "",
      classId: "",
      section: "",
    });
    setSelectedSection("");
    setStudentData([]);
    setFullStudentData([]);

    // Clear localStorage student info
    localStorage.removeItem("selectedCertificateClassId");
    localStorage.removeItem("selectedCertificateSectionId");
    localStorage.removeItem("selectedCertificateStudentId");

    handleClose(); // call parent close
  };

  return (
    <Modal
      show={show}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onClick={handleClose}></Modal.Header>

      <Modal.Body>
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
                  <div className="row mb-2">
                    <div
                      className="col-12  d-flex
                      flex-wrap
                      gap-2"
                      // style={{ border: "1px solid #ccc" }}
                    >
                      <button
                        type="button"
                        className="btn btn-primary me-2"
                        style={{ width: "150px" }}
                        onClick={handleSearch}
                      >
                        Search
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        style={{ width: "150px" }}
                        onClick={handleClearFilters}
                      >
                        Clear
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger me-2"
                        style={{ width: "150px" }}
                        onClick={handleClose}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                  {/* Search Fields */}
                  <div className="row mt-3">
                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="studentName" className="form-label">
                        Student Name
                      </label>
                      <input
                        type="text"
                        name="studentName"
                        value={filters.studentName}
                        onChange={handleInputChange}
                        className="form-control detail"
                        placeholder="Student Name"
                        style={{ height: "38px", padding: "0.375rem 0.75rem" }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="admissionNo" className="form-label">
                        Admission No
                      </label>
                      <input
                        type="text"
                        name="admissionNo"
                        value={filters.admissionNo}
                        onChange={handleInputChange}
                        className="form-control detail"
                        placeholder="Admission No"
                        style={{ height: "38px", padding: "0.375rem 0.75rem" }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="barcode" className="form-label">
                        Roll No
                      </label>
                      <input
                        type="text"
                        name="barcode"
                        value={filters.barcode}
                        onChange={handleInputChange}
                        className="form-control detail"
                        placeholder="Roll No"
                        style={{ height: "38px", padding: "0.375rem 0.75rem" }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label className="form-label">Session</label>
                      <Select
                        className="detail"
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
                          setSelectedCourse(null);
                          setSelectedDepartment(null);
                          setSelectedAcademicYear(null);
                          setSelectedSemester(null);
                          setSelectedSection(null);
                        }}
                        placeholder="Select Session"
                      />
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-12 col-md-3 mb-2">
                      <label className="form-label">Course</label>
                      <Select
                        className="detail"
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
                          setSelectedDepartment(null);
                          setSelectedAcademicYear(null);
                          setSelectedSemester(null);
                          setSelectedSection(null);
                        }}
                        placeholder="Select Course"
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label className="form-label">Department</label>
                      <Select
                        className="detail"
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
                          setSelectedAcademicYear(null);
                          setSelectedSemester(null);
                          setSelectedSection(null);
                        }}
                        placeholder="Select Department"
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label className="form-label">Academic Year</label>
                      <Select
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
                          setSelectedSemester(null);
                          setSelectedSection(null);
                        }}
                        placeholder="Select Academic Year"
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label className="form-label">Semester</label>
                      <Select
                        className="detail"
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
                          setSelectedSection(null);
                        }}
                        placeholder="Select Semester"
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label className="form-label">Section</label>
                      <Select
                        className="detail"
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
                        onChange={(opt) => setSelectedSection(opt?.value || "")}
                        placeholder="Select Section"
                      />
                    </div>
                  </div>
                  {/* Students Table */}
                  <div className="table-responsive mt-3">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>Sr No</th>
                          <th>Student Name</th>
                          <th>Admission No</th>
                          <th>Session</th>
                          <th>Course</th>
                          <th>Department</th>
                          <th>Academic Year</th>
                          <th>Semester</th>
                          <th>Section</th>
                          <th>Roll No</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentStudents.map((student, index) => (
                          <tr key={index}>
                            <td>{offset + index + 1}</td>
                            <td>{student.student_name}</td>
                            <td>{student.college_admission_no}</td>
                            <td>{student.batch_code}</td>
                            <td>{student.course_name}</td>
                            <td>{student.department_code}</td>
                            <td>{student.academic_year_code}</td>
                            <td>{student.semester_name}</td>
                            <td>{student.section_name}</td>
                            <td>{student.barcode}</td>
                            <td>
                              <button
                                className="btn btn-success"
                                onClick={() => handleSelectStudent(student)}
                              >
                                Select
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="d-flex justify-content-center mt-3">
                    <ReactPaginate
                      previousLabel={"← Previous"}
                      nextLabel={"Next →"}
                      pageCount={pageCount}
                      onPageChange={handlePageClick}
                      containerClassName={"pagination"}
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
      </Modal.Body>
    </Modal>
  );
};

export default ModalCertificate;
