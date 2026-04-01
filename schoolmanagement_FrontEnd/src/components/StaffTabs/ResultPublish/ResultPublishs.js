import React, { useState, useEffect } from "react";
import { Form, Button, Table, Container } from "react-bootstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";

const ResultPublishs = () => {
  const navigate = useNavigate();
  
  // Get organization and branch from sessionStorage
  const organizationId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");

  const [formData, setFormData] = useState({
    studentName: "",
    admissionNo: "",
    studentBarcode: "",
    fatherName: "",
    motherName: "",
    session: "",
    course: "",
    department: "",
    academic_year: "",
    semester: "",
    section: "",
    rollNo: "",
    schoolAdmissionNo: "",
    status: "ACTIVE",
  });

  const [isViewClicked, setIsViewClicked] = useState(false);

  // Dropdown state management
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  // Fetch data using hooks
  const { BatchList, loading: loadingBatch } = useFetchSessionList(organizationId, branchId);
  const { CourseList, loading: loadingCourse } = useFetchCourseByFilter(organizationId, selectedSession?.value);
  const { BranchList, loading: loadingDept } = useFetchBranch(organizationId, branchId, selectedSession?.value, selectedCourse?.value);
  const { AcademicYearList, loading: loadingAY } = useFetchAcademicYearByFilter(organizationId, branchId, selectedSession?.value, selectedCourse?.value, selectedDepartment?.value);
  const { SemesterList, loading: loadingSem } = useFetchSemesterByFilter(organizationId, branchId, selectedSession?.value, selectedCourse?.value, selectedDepartment?.value, selectedAcademicYear?.value);
  const { SectionList, loading: loadingSec } = useFetchSectionByFilter(organizationId, branchId, selectedSession?.value, selectedCourse?.value, selectedDepartment?.value, selectedAcademicYear?.value, selectedSemester?.value);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearch = () => {
    setIsViewClicked(true);
  };

  const handleClear = () => {
    setFormData({
      studentName: "",
      admissionNo: "",
      studentBarcode: "",
      fatherName: "",
      motherName: "",
      session: "",
      course: "",
      department: "",
      academic_year: "",
      semester: "",
      section: "",
      rollNo: "",
      schoolAdmissionNo: "",
      status: "ACTIVE",
    });
    setSelectedSession(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
    setIsViewClicked(false);
  };

  const handleClose = () => {
    setIsViewClicked(false);
  };

  const handleAddDataClick = () => {
    navigate("/staff/staff-add-student-data");
  };

  // 🔹 Auto-select first section when sections are loaded and semester is selected
  useEffect(() => {
    if (!selectedSemester) {
      // Clear section when semester is cleared
      setSelectedSection(null);
      setFormData((prev) => ({
        ...prev,
        section: "",
      }));
      return;
    }

    if (SectionList && SectionList.length > 0) {
      const firstSection = SectionList[0];
      setSelectedSection({
        value: firstSection.id,
        label: firstSection.section_description || firstSection.section_code || firstSection.section_name || firstSection.sectionname || firstSection.name,
      });
      setFormData((prev) => ({
        ...prev,
        section: firstSection.id,
      }));
    } else {
      // No sections available
      setSelectedSection(null);
      setFormData((prev) => ({
        ...prev,
        section: "",
      }));
    }
  }, [SectionList, selectedSemester]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
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
                <div className="col-12 ">
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
                    className="btn btn-primary me-2"
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
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div
                  className="col-12 custom-section-box"
                  style={{
                    minHeight: "140px",
                    padding: "20px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                  }}
                >
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-4 mb-1">
                        <label htmlFor="student-name" className="form-label">
                          Student Name
                        </label>
                        <input
                          type="text"
                          id="student-name"
                          className="form-control detail"
                          placeholder="Enter student name"
                          name="studentName"
                          value={formData.studentName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 mb-1">
                        <label htmlFor="admission-no" className="form-label">
                          Admission No
                        </label>
                        <input
                          type="text"
                          id="admission-no"
                          className="form-control detail"
                          placeholder="Enter admission no"
                          name="admissionNo"
                          value={formData.admissionNo}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 mb-1">
                        <label htmlFor="roll-no" className="form-label">
                          Roll No
                        </label>
                        <input
                          type="text"
                          id="roll-no"
                          className="form-control detail"
                          placeholder="Enter roll no"
                          name="rollNo"
                          value={formData.rollNo}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="session" className="form-label">
                          Session
                        </label>
                        <Select
                          id="session"
                          options={
                            BatchList?.map((b) => ({
                              value: b.id,
                              label: b.batch_description || b.batch_code || b.batch_name || b.name,
                            })) || []
                          }
                          className="detail"
                          value={selectedSession}
                          onChange={(opt) => {
                            setSelectedSession(opt);
                            setFormData((prev) => ({ ...prev, session: opt?.value || "" }));
                            setSelectedCourse(null);
                            setSelectedDepartment(null);
                            setSelectedAcademicYear(null);
                            setSelectedSemester(null);
                            setSelectedSection(null);
                          }}
                          placeholder="Select Session"
                          isClearable
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="course" className="form-label">
                          Course
                        </label>
                        <Select
                          id="course"
                          options={
                            CourseList?.map((c) => ({
                              value: c.id,
                              label: c.course_name || c.coursename || c.name,
                            })) || []
                          }
                          className="detail"
                          value={selectedCourse}
                          onChange={(opt) => {
                            setSelectedCourse(opt);
                            setFormData((prev) => ({ ...prev, course: opt?.value || "" }));
                            setSelectedDepartment(null);
                            setSelectedAcademicYear(null);
                            setSelectedSemester(null);
                            setSelectedSection(null);
                          }}
                          placeholder="Select Course"
                          isClearable
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="department" className="form-label">
                          Department
                        </label>
                        <Select
                          id="department"
                          options={
                            BranchList?.map((b) => ({
                              value: b.id,
                              label: b.department_description || b.department_name || b.name,
                            })) || []
                          }
                          className="detail"
                          value={selectedDepartment}
                          onChange={(opt) => {
                            setSelectedDepartment(opt);
                            setFormData((prev) => ({ ...prev, department: opt?.value || "" }));
                            setSelectedAcademicYear(null);
                            setSelectedSemester(null);
                            setSelectedSection(null);
                          }}
                          placeholder="Select Department"
                          isClearable
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="academic-year" className="form-label">
                          Academic Year
                        </label>
                        <Select
                          id="academic-year"
                          options={
                            AcademicYearList?.map((y) => ({
                              value: y.id,
                              label: y.academic_year_description || y.academic_year || y.name,
                            })) || []
                          }
                          className="detail"
                          value={selectedAcademicYear}
                          onChange={(opt) => {
                            setSelectedAcademicYear(opt);
                            setFormData((prev) => ({ ...prev, academic_year: opt?.value || "" }));
                            setSelectedSemester(null);
                            setSelectedSection(null);
                          }}
                          placeholder="Select Academic Year"
                          isClearable
                        />
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="semester" className="form-label">
                          Semester
                        </label>
                        <Select
                          id="semester"
                          options={
                            SemesterList?.map((s) => ({
                              value: s.id,
                              label: s.semester_description || s.semester_name || s.name,
                            })) || []
                          }
                          className="detail"
                          value={selectedSemester}
                          onChange={(opt) => {
                            setSelectedSemester(opt);
                            setFormData((prev) => ({ ...prev, semester: opt?.value || "" }));
                          }}
                          placeholder="Select Semester"
                          isClearable
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="section" className="form-label">
                          Section
                        </label>
                        <Select
                          id="section"
                          options={
                            SectionList?.map((sec) => ({
                              value: sec.id,
                              label: sec.section_description || sec.section_code || sec.section_name || sec.sectionname || sec.name,
                            })) || []
                          }
                          className="detail"
                          value={selectedSection}
                          onChange={(opt) => {
                            setSelectedSection(opt);
                            setFormData((prev) => ({ ...prev, section: opt?.value || "" }));
                          }}
                          placeholder="Select Section"
                            isDisabled={true}
                          isClearable
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="status" className="form-label">
                          Status
                        </label>
                        <select
                          id="status"
                          className="form-select"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="INACTIVE">INACTIVE</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-4 mb-1">
                        <label htmlFor="father-name" className="form-label">
                          Father Name
                        </label>
                        <input
                          type="text"
                          id="father-name"
                          className="form-control detail"
                          placeholder="Enter father name"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 mb-1">
                        <label htmlFor="mother-name" className="form-label">
                          Mother Name
                        </label>
                        <input
                          type="text"
                          id="mother-name"
                          className="form-control detail"
                          placeholder="Enter mother name"
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleInputChange}
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
                        <th>Class</th>
                        <th>Section</th>
                        <th>Student Name</th>
                        <th>Admission No</th>
                        <th>Roll No</th>
                        <th>Roll no</th>
                        <th>Father Name</th>
                        <th>Mother Name</th>
                        <th>Select Term</th>
                        <th>Add Exam Data</th>
                        <th>View Exam Report</th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ResultPublishs;
