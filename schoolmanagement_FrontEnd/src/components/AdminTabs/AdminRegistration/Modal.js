import React, { useState, useEffect } from "react";
import { Modal, Table, Button } from "react-bootstrap";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import useFetchOrganizationBranch from "../../hooks/useFetchBranchByOrganization";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";
import { ApiUrl } from "../../../ApiUrl"

const SelectStudentModal = ({ show, handleClose, onSelectStudent }) => {

  // ✅ Get organization and branch directly from sessionStorage
  const storedOrgId = sessionStorage.getItem("organization_id");
  const storedBranchId = sessionStorage.getItem("branch_id");

  const [selectedOrganization, setSelectedOrganization] = useState(
    storedOrgId ? { value: parseInt(storedOrgId), label: `Org-${storedOrgId}` } : null
  );
  const [selectedOrgBranch, setSelectedOrgBranch] = useState(
    storedBranchId ? { value: parseInt(storedBranchId), label: `Branch-${storedBranchId}` } : null
  );

  const [selectedDepartment, setSelectedDepartment] = useState(null); // for Academic Department

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
  const [selectedSectionFiltered, setSelectedSectionFiltered] = useState(null);
  const {
    branches: organizationBranches,
    loading: orgBranchLoading,
    error: orgBranchError,
  } = useFetchOrganizationBranch();
  const [filters, setFilters] = useState({

  });

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [students, setStudents] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");

  const fetchStudents = async () => {
    const organizationId = selectedOrganization?.value;
    const branchId = selectedOrgBranch?.value;
    const batchId = selectedSession;
    const courseId = selectedCourse;
    const departmentId = selectedDepartment;
    const academicYearId = selectedAcademicYear;
    const semesterId = selectedSemester;
    const sectionId = selectedSectionFiltered;

    // ✅ Validate required fields before calling API
    if (
      !organizationId ||
      !branchId ||
      !batchId ||
      !courseId ||
      !departmentId ||
      !academicYearId ||
      !semesterId ||
      !sectionId
    ) {
      console.warn("⚠️ Missing parameters — cannot fetch students yet.");
      return;
    }

    setStudentLoading(true);
    setStudentError("");
    setStudents([]);

    try {
      const token = localStorage.getItem("accessToken");

      // ✅ Build dynamic API URL
      const apiUrl = `${ApiUrl.apiurl}Filter/GetStudentBasedCourseSection/?organization_id=${organizationId}&branch_id=${branchId}&batch_id=${batchId}&course_ids=${courseId}&department_ids=${departmentId}&academic_year_id=${academicYearId}&semester_ids=${semesterId}&section_ids=${sectionId}`;

      console.log("📡 Fetching Students from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(`HTTP Error ${response.status} while fetching students`);

      const result = await response.json();
      console.log("✅ Student API Response:", result);

      if (result?.data && Array.isArray(result.data)) {
        setStudents(result.data);
      } else {
        setStudentError("No students found.");
      }
    } catch (err) {
      console.error("❌ Error fetching students:", err);
      setStudentError(err.message || "Failed to load students.");
    } finally {
      setStudentLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedClass, selectedSection]);

  const handleClear = () => {
    // ✅ Reset all dropdown selections
    setSelectedSession(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSectionFiltered(null);

    // ✅ Clear filters state
    setFilters({
      sessionId: "",
      courseId: "",
      branchId: "",
      academicYearId: "",
      semesterId: "",
      sectionId: "",
    });

    // ✅ Clear students and errors
    setStudents([]);
    setStudentError("");
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
  };

  const handleSectionChange = (e) => {
    const sectionId = e.target.value;
    setSelectedSection(sectionId);
  };

  const handleSelectStudent = (student) => {
    onSelectStudent(student);
    handleClose();
  };

  return (
    <Modal show={show} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton onClick={handleClose}></Modal.Header>
      <Modal.Body>
        <div className="container p-1">
          <div className="row">
            <div className="col-12">
              <div className="card p-0">
                <div className="card-body">
                  <p style={{ marginBottom: "14px" }}>STUDENT SEARCH</p>
                  <div className="row mb-2">
                    <div className="col-12">
                      <button type="button" className="btn btn-primary me-2" style={{ width: "150px" }} onClick={fetchStudents}>
                        Search
                      </button>
                      <button type="button" className="btn btn-secondary me-2" style={{ width: "150px" }} onClick={handleClear}>
                        Clear
                      </button>
                      <button type="button" className="btn btn-danger me-2" style={{ width: "150px" }} onClick={handleClose}>
                        Close
                      </button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="row" style={{ marginTop: "20px" }}>
                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="admitted-batch" className="form-label">
                        Session<span style={{ color: "red" }}>*</span>
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
                        isDisabled={!selectedOrganization || !selectedOrgBranch || batchLoading}
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
                    <div className="col-12 col-md-3 mb-1">
                      <label htmlFor="admitted-class" className="form-label">
                        Course<span style={{ color: "red" }}>*</span>
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
                    <div className="col-12 col-md-3 mb-1">
                      <label htmlFor="department" className="form-label">
                        Department<span style={{ color: "red" }}>*</span>
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
                            label: `${dept.department_code} - ${dept.department_description}`,
                          })) || []
                        }
                        value={
                          BranchList.map((dept) => ({
                            value: dept.id,
                            label: `${dept.department_code} - ${dept.department_description}`,
                          })).find((option) => option.value === selectedDepartment) || null
                        }
                        onChange={(selectedOption) => {
                          const value = selectedOption ? selectedOption.value : null;
                          setSelectedDepartment(value);
                          setFilters((prev) => ({ ...prev, branchId: value }));
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="academic-year" className="form-label">
                        Academic Year<span style={{ color: "red" }}>*</span>
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
                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="semester" className="form-label">
                        Semester<span style={{ color: "red" }}>*</span>
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
                  </div>

                  {/* Table to Display Student Data */}
                  <div className="row mt-2">
                    <div className="table-responsive">
                      <Table className="table table-bordered ">
                        <thead>
                          <tr>
                            <th>Session</th>
                            <th>Course</th>
                            <th>Branch</th>
                            <th>Academic Year</th>
                            <th>Semester</th>
                            <th>Section</th>
                            <th>Student Name</th>
                            <th>Admission No</th>
                            <th>BarCode</th>
                            <th>Father Name</th>
                            <th>Select</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentLoading ? (
                            <tr><td colSpan="12">Loading...</td></tr>
                          ) : studentError ? (
                            <tr><td colSpan="12">{studentError}</td></tr>
                          ) : students.length > 0 ? (
                            students.map((student) => (
                              <tr key={student.student_id}>
                                <td>{student.batch}</td>
                                <td>{student.course_name}</td>
                                <td>{student.branch}</td>
                                <td>{student.academic_year}</td>
                                <td>{student.semester}</td>
                                <td>{student.section}</td>
                                <td>{student.student_name}</td>
                                <td>{student.college_admission_no}</td>
                                <td>{student.barcode}</td>
                                <td>{student.father_name}</td>
                                <td>
                                  <button type="button" className="btn btn-primary btn-sm" onClick={() => handleSelectStudent(student)}>
                                    Select
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan="12">No students found</td></tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
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

export default SelectStudentModal;
