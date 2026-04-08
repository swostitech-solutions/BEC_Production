import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import "./SelectStudentModal.css";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";

import { ApiUrl } from "../../../ApiUrl";

const SelectStudentModal = ({ show, handleClose, onSelectStudent }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [fullStudentData, setFullStudentData] = useState([]);
  const [filters, setFilters] = useState({
    studentName: "",
    admissionNo: "",
    barcode: "",
    fatherName: "",
    motherName: "",
    schoolAdmissionNo: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Pagination calculations
  const offset = currentPage * itemsPerPage;
  const currentItems = studentData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(studentData.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Session & Course from hooks (same pattern as registration page)
  const organizationId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");
  const { BatchList, loading: sessionLoading } = useFetchSessionList(organizationId, branchId);
  const { CourseList, loading: courseLoading } = useFetchCourseByFilter(
    organizationId,
    selectedSession?.value || null
  );

  // Reset to first page when student data changes
  useEffect(() => {
    setCurrentPage(0);
  }, [studentData]);

  useEffect(() => {
    if (!show) return;

    setStudentError("");
    setStudentData([]);
    setFullStudentData([]);
  }, [show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    // If session is selected, course must also be selected
    if (selectedSession && !selectedCourse) {
      alert("Please select a Course before searching.");
      return;
    }

    setStudentLoading(true);
    setStudentError("");

    try {
      const academicSessionId = localStorage.getItem("academicSessionId");

      if (!academicSessionId) {
        setStudentError("No session found.");
        setStudentLoading(false);
        return;
      }

      const params = new URLSearchParams();
      if (selectedCourse?.value) params.set("course_id", selectedCourse.value);
      if (filters.studentName.trim()) params.set("studentName", filters.studentName.trim());
      if (filters.admissionNo.trim()) params.set("admissionNo", filters.admissionNo.trim());
      if (filters.barcode.trim()) params.set("barcode", filters.barcode.trim());
      if (filters.fatherName.trim()) params.set("fatherName", filters.fatherName.trim());
      if (filters.motherName.trim()) params.set("motherName", filters.motherName.trim());
      if (filters.schoolAdmissionNo.trim()) params.set("admission_no", filters.schoolAdmissionNo.trim());

      const response = await fetch(
        `${ApiUrl.apiurl}StudentCourseApi/GetAllSTUDENTList/${academicSessionId}/${params.toString() ? `?${params.toString()}` : ""}`
      );
      if (!response.ok) throw new Error("Error fetching student data");
      const data = await response.json();
      const filteredData = data.data || [];

      setFullStudentData(filteredData);
      setStudentData(filteredData);
    } catch (error) {
      console.error("Search fetch error:", error);
      setStudentError(error.message);
    } finally {
      setStudentLoading(false);
    }
  };

  const getCourseName = (course) => course?.label || "N/A";

  const handleSelectStudent = (student) => {
    if (onSelectStudent) {
      onSelectStudent(student);
    } else {
      console.error("onSelectStudent is NOT passed!");
    }
    handleClose();
  };

  const handleClearFilters = () => {
    // Reset all filters and state variables
    setFilters({
      studentName: "",
      admissionNo: "",
      barcode: "",
      fatherName: "",
      motherName: "",
      schoolAdmissionNo: "",
    });

    setSelectedSession(null); // Clear session
    setSelectedCourse(null); // Clear course
    setStudentData([]);
    setFullStudentData([]);
    setStudentError("");
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
                  <div className="row mb-2 mt-3">
                    <div className="col-12">
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

                  {/* Simplified Filters - No cascading dropdowns! */}
                  <div className="row mt-3 mx-2">
                    <div className="col-12 custom-section-box">
                      <div className="row mt-3 mb-3">
                        {/* Text Filters Row 1 */}
                        <div className="col-12 col-md-3 mb-2">
                          <label className="form-label">Student Name</label>
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
                          <label className="form-label">Admission No</label>
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
                          <label className="form-label">Roll No</label>
                          <input
                            type="text"
                            name="barcode"
                            value={filters.barcode}
                            onChange={handleInputChange}
                            className="form-control detail"
                            placeholder="Student Roll No"
                            style={{ height: "38px", padding: "0.375rem 0.75rem" }}
                          />
                        </div>
                        <div className="col-12 col-md-3 mb-2">
                          <label className="form-label">Session</label>
                          <Select
                            className="detail"
                            classNamePrefix="detail"
                            options={BatchList?.map((b) => ({
                              value: b.id,
                              label: b.batch_description || b.batch_code || b.name,
                            })) || []}
                            onChange={(selectedOption) => {
                              setSelectedSession(selectedOption || null);
                              setSelectedCourse(null);
                            }}
                            placeholder="Select Session"
                            isLoading={sessionLoading}
                            value={selectedSession}
                            isClearable
                          />
                        </div>
                        <div className="col-12 col-md-3 mb-2">
                          <label className="form-label">Course</label>
                          <Select
                            className="detail"
                            classNamePrefix="detail"
                            options={CourseList?.map((c) => ({
                              value: c.id,
                              label: c.course_name,
                            })) || []}
                            onChange={(selectedOption) =>
                              setSelectedCourse(selectedOption || null)
                            }
                            placeholder="Select Course"
                            isLoading={courseLoading}
                            isDisabled={!selectedSession}
                            value={selectedCourse}
                            isClearable
                          />
                        </div>
                        <div className="col-12 col-md-3 mb-2">
                          <label className="form-label">Father's Name</label>
                          <input
                            type="text"
                            name="fatherName"
                            value={filters.fatherName}
                            onChange={handleInputChange}
                            className="form-control detail"
                            placeholder="Father's Name"
                            style={{ height: "38px", padding: "0.375rem 0.75rem" }}
                          />
                        </div>
                        <div className="col-12 col-md-3 mb-2">
                          <label className="form-label">Mother's Name</label>
                          <input
                            type="text"
                            name="motherName"
                            value={filters.motherName}
                            onChange={handleInputChange}
                            className="form-control detail"
                            placeholder="Mother's Name"
                            style={{ height: "38px", padding: "0.375rem 0.75rem" }}
                          />
                        </div>
                        <div className="col-12 col-md-3 mb-2">
                          <label className="form-label">College Admission No</label>
                          <input
                            type="text"
                            name="schoolAdmissionNo"
                            value={filters.schoolAdmissionNo}
                            onChange={handleInputChange}
                            className="form-control detail"
                            placeholder="College Admission No"
                            style={{ height: "38px", padding: "0.375rem 0.75rem" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Students Table */}
                  <div className="table-responsive mt-3">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>Admission No</th>
                          <th>Course</th>
                          <th>Section</th>
                          <th>Father Name</th>
                          <th>Mother Name</th>
                          <th>Roll No</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentLoading && studentData.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              Loading students...
                            </td>
                          </tr>
                        ) : studentError && studentData.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center text-danger">
                              Error: {studentError}
                            </td>
                          </tr>
                        ) : studentData.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              No students found
                            </td>
                          </tr>
                        ) : (
                          currentItems.map((student, index) => {
                            const studentDetails = student.studentBasicDetails;
                            return (
                              <tr key={index}>
                                <td>
                                  {studentDetails.first_name}{" "}
                                  {studentDetails.middle_name}{" "}
                                  {studentDetails.last_name}
                                </td>
                                <td>{studentDetails.admission_no}</td>
                                <td>
                                  {studentDetails.course_name || "N/A"}
                                </td>
                                <td>
                                  {studentDetails.section_name || "N/A"}
                                </td>
                                <td>{studentDetails.father_name}</td>
                                <td>{studentDetails.mother_name}</td>
                                <td>{studentDetails.barcode}</td>
                                <td>
                                  <input
                                    type="radio"
                                    name="selectedStudent"
                                    onChange={() => handleSelectStudent(student)}
                                  />
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Component */}
                  {pageCount > 1 && (
                    <div className="d-flex justify-content-center mt-3">
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
                        containerClassName={"pagination justify-content-center"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        activeClassName={"active"}
                        forcePage={currentPage}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SelectStudentModal;
