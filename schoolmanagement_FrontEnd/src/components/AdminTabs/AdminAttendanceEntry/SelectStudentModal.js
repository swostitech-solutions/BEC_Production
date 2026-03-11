import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import "./SelectStudentModal.css";

import { ApiUrl } from "../../../ApiUrl";

const SelectStudentModal = ({ show, handleClose, onSelectStudent }) => {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
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

  // Reset to first page when student data changes
  useEffect(() => {
    setCurrentPage(0);
  }, [studentData]);

  // Extract unique semesters from student data - no API call needed!
  const SemesterList = useMemo(() => {
    if (!fullStudentData || fullStudentData.length === 0) return [];

    const semestersMap = new Map();

    fullStudentData.forEach((student) => {
      const details = student.studentBasicDetails || student;
      // The API returns 'semester' field (not semester_id)
      const semesterId = details.semester || details.semester_id || details.addmitted_semester;
      // Check multiple possible field names for semester name
      const semesterName = details.semester_name || details.semester_description ||
        details.semester_code || `Semester ${semesterId}`;

      if (semesterId && !semestersMap.has(semesterId)) {
        semestersMap.set(semesterId, {
          value: semesterId,
          label: semesterName,
        });
      }
    });

    return Array.from(semestersMap.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [fullStudentData]);

  const semesterLoading = false; // No API call needed

  // Extract unique sections from student data based on selected semester
  // This avoids needing to call the Section API which requires all cascading parameters
  const SectionList = useMemo(() => {
    if (!fullStudentData || fullStudentData.length === 0) return [];

    const sectionsMap = new Map();

    fullStudentData.forEach((student) => {
      const details = student.studentBasicDetails || student;
      // The API returns 'semester' field (not semester_id)
      const studentSemesterId = details.semester || details.semester_id || details.addmitted_semester;

      // Filter by semester if selected
      if (selectedSemester && studentSemesterId?.toString() !== selectedSemester.toString()) {
        return;
      }

      // The API returns 'section' field (not section_id)
      const sectionId = details.section || details.section_id || details.addmitted_section;
      // Check multiple possible field names for section name
      const sectionName = details.section_name || details.section_description || `Section ${sectionId}`;

      if (sectionId && !sectionsMap.has(sectionId)) {
        sectionsMap.set(sectionId, {
          value: sectionId,
          label: sectionName,
        });
      }
    });

    return Array.from(sectionsMap.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [fullStudentData, selectedSemester]);

  const sectionLoading = false; // No API call needed

  // Fetch Students Data when modal is shown
  useEffect(() => {
    if (!show) return; // Only fetch when modal is shown

    const fetchFullStudentData = async () => {
      setStudentLoading(true);

      try {
        const academicSessionId = localStorage.getItem("academicSessionId");

        if (!academicSessionId) {
          console.error("No academic session ID found in local storage");
          setStudentError("No academic session ID found");
          setStudentLoading(false);
          return;
        }

        console.log("Fetching students for academic session:", academicSessionId);

        const response = await fetch(
          `${ApiUrl.apiurl}StudentCourseApi/GetAllSTUDENTList/${academicSessionId}/`
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error("Error fetching student data");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        if (data.data) {
          setFullStudentData(data.data);
          setStudentData(data.data);
          // Debug: Log first student to see available fields
          if (data.data.length > 0) {
            console.log("First student data structure:", data.data[0]);
            console.log("studentBasicDetails fields:", data.data[0].studentBasicDetails);
          }
        } else {
          console.warn("No data found for the given academic session ID");
          setStudentData([]);
          setFullStudentData([]);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setStudentError(error.message);
      } finally {
        setStudentLoading(false);
      }
    };
    fetchFullStudentData();
  }, [show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    const filteredData = fullStudentData.filter((student) => {
      const studentDetails = student.studentBasicDetails || student;
      const fullName = `${studentDetails.first_name || studentDetails.student_name || ""} ${studentDetails.middle_name || ""
        } ${studentDetails.last_name || ""}`
        .trim()
        .toLowerCase();
      const searchParts = filters.studentName
        .toLowerCase()
        .split(" ")
        .filter(Boolean);
      const nameMatches = searchParts.every((part) => fullName.includes(part));

      // Check admission number - it should match college_admission_no or admission_no
      const admissionNoMatch = !filters.admissionNo ||
        (studentDetails.college_admission_no?.toString().includes(filters.admissionNo)) ||
        (studentDetails.admission_no?.toString().includes(filters.admissionNo));

      // Check school admission number (College Admission No field)
      const schoolAdmissionNoMatch = !filters.schoolAdmissionNo ||
        (studentDetails.college_admission_no?.toString().includes(filters.schoolAdmissionNo));

      // Check semester - the API returns 'semester' field
      const studentSemesterId = studentDetails.semester || studentDetails.semester_id || studentDetails.addmitted_semester;
      const semesterMatch = !selectedSemester ||
        studentSemesterId?.toString() === selectedSemester.toString();

      // Check section - the API returns 'section' field
      const studentSectionId = studentDetails.section || studentDetails.section_id || studentDetails.addmitted_section;
      const sectionMatch = !selectedSection ||
        studentSectionId?.toString() === selectedSection.toString();

      // Only Semester and Section filter the data (along with text fields)
      return (
        (!filters.studentName || nameMatches) &&
        admissionNoMatch &&
        (!filters.barcode ||
          studentDetails.barcode?.toString().includes(filters.barcode)) &&
        schoolAdmissionNoMatch &&
        semesterMatch &&
        sectionMatch &&
        (!filters.fatherName ||
          studentDetails.father_name
            ?.toLowerCase()
            .includes(filters.fatherName.toLowerCase())) &&
        (!filters.motherName ||
          studentDetails.mother_name
            ?.toLowerCase()
            .includes(filters.motherName.toLowerCase()))
      );
    });
    setStudentData(filteredData);
  };

  const getSemesterName = (semesterId) => {
    const semesterObj = SemesterList?.find((sem) => sem.value?.toString() === semesterId?.toString());
    return semesterObj ? semesterObj.label : "N/A";
  };

  const getSectionName = (sectionId) => {
    const sectionObj = SectionList?.find((sec) => sec.value?.toString() === sectionId?.toString());
    return sectionObj ? sectionObj.label : "N/A";
  };

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

    setSelectedSemester(""); // Clear the selected semester
    setSelectedSection(""); // Clear the selected section
    setStudentData(fullStudentData); // Reset the student data to the full list
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
                          <label className="form-label">Student Barcode</label>
                          <input
                            type="text"
                            name="barcode"
                            value={filters.barcode}
                            onChange={handleInputChange}
                            className="form-control detail"
                            placeholder="Student Barcode"
                            style={{ height: "38px", padding: "0.375rem 0.75rem" }}
                          />
                        </div>
                        <div className="col-12 col-md-3 mb-2">
                          <label className="form-label">Semester</label>
                          <Select
                            className="detail"
                            classNamePrefix="detail"
                            options={SemesterList || []}
                            onChange={(selectedOption) => {
                              setSelectedSemester(selectedOption?.value || "");
                              setSelectedSection(""); // Reset section when semester changes
                            }}
                            placeholder="Select Semester"
                            isLoading={semesterLoading}
                            value={
                              selectedSemester
                                ? {
                                  label: getSemesterName(selectedSemester),
                                  value: selectedSemester,
                                }
                                : null
                            }
                            isClearable
                          />
                        </div>

                        {/* Row 2 */}
                        <div className="col-12 col-md-3 mb-2">
                          <label className="form-label">Section</label>
                          <Select
                            className="detail"
                            classNamePrefix="detail"
                            options={SectionList || []}
                            onChange={(selectedOption) =>
                              setSelectedSection(selectedOption?.value || "")
                            }
                            placeholder="Select Section"
                            isLoading={sectionLoading}
                            value={
                              selectedSection
                                ? {
                                  label: getSectionName(selectedSection),
                                  value: selectedSection,
                                }
                                : null
                            }
                            isDisabled={!selectedSemester}
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
                          <th>Student Barcode</th>
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
