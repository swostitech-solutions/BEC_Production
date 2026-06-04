import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../AdminRegistration/AdmRegistration.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import { ApiUrl } from "../../../ApiUrl";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";

const AdmAlumni = () => {
  const navigate = useNavigate();
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [selectedOrgBranch, setSelectedOrgBranch] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [alumniData, setAlumniData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [filters, setFilters] = useState({
    studentName: "",
    admissionNo: "",
    registrationNo: "",
    enrollmentNo: "",
    contactNo: "",
  });

  const { BatchList, loading: batchLoading } = useFetchSessionList(
    selectedOrganization?.value,
    selectedOrgBranch?.value
  );
  const { CourseList, loading: courseLoading } = useFetchCourseByFilter(
    selectedOrganization?.value,
    selectedSession
  );
  const { BranchList, loading: branchLoading } = useFetchBranch(
    selectedOrganization?.value,
    selectedOrgBranch?.value,
    selectedSession,
    selectedCourse
  );
  const { AcademicYearList, loading: academicYearLoading } =
    useFetchAcademicYearByFilter(
      selectedOrganization?.value,
      selectedOrgBranch?.value,
      selectedSession,
      selectedCourse,
      selectedDepartment
    );
  const { SemesterList, loading: semesterLoading } = useFetchSemesterByFilter(
    selectedOrganization?.value,
    selectedOrgBranch?.value,
    selectedSession,
    selectedCourse,
    selectedDepartment,
    selectedAcademicYear
  );
  const { SectionList, loading: sectionLoading } = useFetchSectionByFilter(
    selectedOrganization?.value,
    selectedOrgBranch?.value,
    selectedSession,
    selectedCourse,
    selectedDepartment,
    selectedAcademicYear,
    selectedSemester
  );

  useEffect(() => {
    const organizationId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");

    if (organizationId) {
      setSelectedOrganization({ value: Number(organizationId), label: "" });
    }
    if (branchId) {
      setSelectedOrgBranch({ value: Number(branchId), label: "" });
    }
  }, []);

  const filteredAlumniData = useMemo(() => {
    if (!searchQuery.trim()) return alumniData;

    const normalize = (value) =>
      String(value || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

    const query = normalize(searchQuery);
    const queryWords = query.split(" ").filter(Boolean);
    const fieldMatchesQuery = (fieldValue) => {
      const normalizedField = normalize(fieldValue);
      if (!normalizedField) return false;

      return (
        normalizedField.includes(query) ||
        queryWords.every((word) => normalizedField.includes(word))
      );
    };

    return alumniData.filter((row) =>
      [
        row.student_name,
        row.college_admission_no,
        row.admission_no,
        row.registration_no,
        row.enrollment_no,
        row.batch_description,
        row.course_name,
        row.department_description,
        row.academic_year_description,
        row.semester_description,
        row.section_name,
        row.father_name,
        row.mother_name,
        row.contact_no,
        row.email,
        row.present_city,
        row.present_state,
      ].some(fieldMatchesQuery)
    );
  }, [alumniData, searchQuery]);

  const totalPages = Math.ceil(filteredAlumniData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredAlumniData.slice(indexOfFirstRow, indexOfLastRow);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const buildQueryParams = (overrideFilters = {}, overrideSelections = {}) => {
    const params = new URLSearchParams();
    const organizationId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");

    if (organizationId) params.append("organization_id", organizationId);
    if (branchId) params.append("branch_id", branchId);

    const mergedFilters = { ...filters, ...overrideFilters };
    const selectionState = {
      session: selectedSession,
      course: selectedCourse,
      department: selectedDepartment,
      academicYear: selectedAcademicYear,
      semester: selectedSemester,
      section: selectedSection,
      ...overrideSelections,
    };

    if (selectionState.session) params.append("batch_id", selectionState.session);
    if (selectionState.course) params.append("course_id", selectionState.course);
    if (selectionState.department) params.append("department_id", selectionState.department);
    if (selectionState.academicYear) params.append("academic_year_id", selectionState.academicYear);
    if (selectionState.semester) params.append("semester_id", selectionState.semester);
    if (selectionState.section) params.append("section_id", selectionState.section);
    if (mergedFilters.studentName) params.append("student_name", mergedFilters.studentName);
    if (mergedFilters.admissionNo) params.append("admission_no", mergedFilters.admissionNo);
    if (mergedFilters.registrationNo) params.append("registration_no", mergedFilters.registrationNo);
    if (mergedFilters.enrollmentNo) params.append("enrollment_no", mergedFilters.enrollmentNo);
    if (mergedFilters.contactNo) params.append("contact_no", mergedFilters.contactNo);

    return params;
  };

  const fetchAlumniList = async (overrideFilters = {}, overrideSelections = {}) => {
    setIsSearching(true);
    try {
      const token = localStorage.getItem("accessToken");
      const params = buildQueryParams(overrideFilters, overrideSelections);
      const response = await fetch(
        `${ApiUrl.apiurl}AlumniRegistration/GetAllALUMNIList/?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      setAlumniData(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Error fetching alumni list:", error);
      setAlumniData([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (selectedOrganization?.value && selectedOrgBranch?.value) {
      fetchAlumniList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrganization, selectedOrgBranch]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    await fetchAlumniList();
    setCurrentPage(1);
  };

  const handleClear = async () => {
    setFilters({
      studentName: "",
      admissionNo: "",
      registrationNo: "",
      enrollmentNo: "",
      contactNo: "",
    });
    setSelectedSession(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
    setSearchQuery("");
    setCurrentPage(1);
    await fetchAlumniList(
      {
        studentName: "",
        admissionNo: "",
        registrationNo: "",
        enrollmentNo: "",
        contactNo: "",
      },
      {
        session: null,
        course: null,
        department: null,
        academicYear: null,
        semester: null,
        section: null,
      }
    );
  };

  const handleClose = () => {
    navigate("/admin/dashboard");
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className="container-fluid px-3 py-3">
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
                ALUMINI DETAILS
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="row flex-grow-1 mt-2">
                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="studentName" className="form-label">
                        Student Name
                      </label>
                      <input
                        type="text"
                        id="studentName"
                        name="studentName"
                        className="form-control detail"
                        placeholder="Enter student name"
                        value={filters.studentName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="admissionNo" className="form-label">
                        College Admission No
                      </label>
                      <input
                        type="text"
                        id="admissionNo"
                        name="admissionNo"
                        className="form-control detail"
                        placeholder="Enter college admission no"
                        value={filters.admissionNo}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="registrationNo" className="form-label">
                        BPUT Registration No
                      </label>
                      <input
                        type="text"
                        id="registrationNo"
                        name="registrationNo"
                        className="form-control detail"
                        placeholder="Enter registration no"
                        value={filters.registrationNo}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="enrollmentNo" className="form-label">
                        Enrollment No
                      </label>
                      <input
                        type="text"
                        id="enrollmentNo"
                        name="enrollmentNo"
                        className="form-control detail"
                        placeholder="Enter enrollment no"
                        value={filters.enrollmentNo}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="contactNo" className="form-label">
                        Contact No
                      </label>
                      <input
                        type="text"
                        id="contactNo"
                        name="contactNo"
                        className="form-control detail"
                        placeholder="Enter contact no"
                        value={filters.contactNo}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="alumni-session" className="form-label">
                        Session
                      </label>
                      <Select
                        id="alumni-session"
                        classNamePrefix="detail"
                        placeholder={
                          batchLoading ? "Loading Session..." : "Select Session"
                        }
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
                                  BatchList.find((item) => item.id === selectedSession)
                                    ?.batch_description || "",
                              }
                            : null
                        }
                        onChange={(selectedOption) => {
                          const value = selectedOption ? selectedOption.value : null;
                          setSelectedSession(value);
                          setSelectedCourse(null);
                          setSelectedDepartment(null);
                          setSelectedAcademicYear(null);
                          setSelectedSemester(null);
                          setSelectedSection(null);
                        }}
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="alumni-course" className="form-label">
                        Course
                      </label>
                      <Select
                        id="alumni-course"
                        classNamePrefix="detail"
                        placeholder={!selectedSession ? "Select Session first" : "Select Course"}
                        isDisabled={!selectedSession}
                        isLoading={courseLoading}
                        options={CourseList.map((course) => ({
                          value: course.id,
                          label: course.course_name,
                        }))}
                        value={
                          CourseList.map((course) => ({
                            value: course.id,
                            label: course.course_name,
                          })).find((option) => option.value === selectedCourse) || null
                        }
                        onChange={(selectedOption) => {
                          const value = selectedOption ? selectedOption.value : null;
                          setSelectedCourse(value);
                          setSelectedDepartment(null);
                          setSelectedAcademicYear(null);
                          setSelectedSemester(null);
                          setSelectedSection(null);
                        }}
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="alumni-department" className="form-label">
                        Department
                      </label>
                      <Select
                        id="alumni-department"
                        classNamePrefix="detail"
                        placeholder={!selectedCourse ? "Select Course first" : "Select Department"}
                        isDisabled={!selectedCourse}
                        isLoading={branchLoading}
                        options={BranchList.map((dept) => ({
                          value: dept.id,
                          label: dept.department_description,
                        }))}
                        value={
                          BranchList.map((dept) => ({
                            value: dept.id,
                            label: dept.department_description,
                          })).find((option) => option.value === selectedDepartment) || null
                        }
                        onChange={(selectedOption) => {
                          const value = selectedOption ? selectedOption.value : null;
                          setSelectedDepartment(value);
                          setSelectedAcademicYear(null);
                          setSelectedSemester(null);
                          setSelectedSection(null);
                        }}
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="alumni-academic-year" className="form-label">
                        Academic Year
                      </label>
                      <Select
                        id="alumni-academic-year"
                        classNamePrefix="detail"
                        placeholder={!selectedDepartment ? "Select Department first" : "Select Academic Year"}
                        isDisabled={!selectedDepartment}
                        isLoading={academicYearLoading}
                        options={AcademicYearList.map((year) => ({
                          value: year.id,
                          label: year.academic_year_description,
                        }))}
                        value={
                          AcademicYearList.map((year) => ({
                            value: year.id,
                            label: year.academic_year_description,
                          })).find((option) => option.value === selectedAcademicYear) || null
                        }
                        onChange={(selectedOption) => {
                          const value = selectedOption ? selectedOption.value : null;
                          setSelectedAcademicYear(value);
                          setSelectedSemester(null);
                          setSelectedSection(null);
                        }}
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="alumni-semester" className="form-label">
                        Semester
                      </label>
                      <Select
                        id="alumni-semester"
                        classNamePrefix="detail"
                        placeholder={!selectedAcademicYear ? "Select Academic Year first" : "Select Semester"}
                        isDisabled={!selectedAcademicYear}
                        isLoading={semesterLoading}
                        options={SemesterList.map((sem) => ({
                          value: sem.id,
                          label: sem.semester_description,
                        }))}
                        value={
                          SemesterList.map((sem) => ({
                            value: sem.id,
                            label: sem.semester_description,
                          })).find((option) => option.value === selectedSemester) || null
                        }
                        onChange={(selectedOption) => {
                          const value = selectedOption ? selectedOption.value : null;
                          setSelectedSemester(value);
                          setSelectedSection(null);
                        }}
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="alumni-section" className="form-label">
                        Section
                      </label>
                      <Select
                        id="alumni-section"
                        classNamePrefix="detail"
                        placeholder={!selectedSemester ? "Select Semester first" : "Select Section"}
                        isDisabled={!selectedSemester}
                        isLoading={sectionLoading}
                        options={SectionList.map((section) => ({
                          value: section.id,
                          label: section.section_name,
                        }))}
                        value={
                          SectionList.map((section) => ({
                            value: section.id,
                            label: section.section_name,
                          })).find((option) => option.value === selectedSection) || null
                        }
                        onChange={(selectedOption) => {
                          setSelectedSection(selectedOption ? selectedOption.value : null);
                        }}
                      />
                    </div>

                    <div className="col-12 mt-4 mb-2">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control detail"
                          placeholder="Search: name, admission no, registration no, session, course, contact, city ..."
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

              <div className="row mt-2">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover table-sm">
                      <thead className="table-dark">
                        <tr>
                          <th scope="col">Sl No.</th>
                          <th scope="col">Student Name</th>
                          <th scope="col">College Admission No</th>
                          <th scope="col">BPUT Registration No</th>
                          <th scope="col">Enrollment No</th>
                          <th scope="col">Session</th>
                          <th scope="col">Course</th>
                          <th scope="col">Department</th>
                          <th scope="col">Academic Year</th>
                          <th scope="col">Semester</th>
                          <th scope="col">Section</th>
                          <th scope="col">Father's Name</th>
                          <th scope="col">Mother's Name</th>
                          <th scope="col">Gender</th>
                          <th scope="col">Category</th>
                          <th scope="col">Contact No</th>
                          <th scope="col">Email</th>
                          <th scope="col">City</th>
                          <th scope="col">State</th>
                          <th scope="col">Graduated On</th>
                          <th scope="col">Status</th>
                          <th scope="col">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRows.length > 0 ? (
                          currentRows.map((row, index) => (
                            <tr key={row.id}>
                              <td>{indexOfFirstRow + index + 1}</td>
                              <td>{row.student_name || "—"}</td>
                              <td>{row.college_admission_no || row.admission_no || "—"}</td>
                              <td>{row.registration_no || "—"}</td>
                              <td>{row.enrollment_no || "—"}</td>
                              <td>{row.batch_description || "—"}</td>
                              <td>{row.course_name || "—"}</td>
                              <td>{row.department_description || "—"}</td>
                              <td>{row.academic_year_description || "—"}</td>
                              <td>{row.semester_description || "—"}</td>
                              <td>{row.section_name || "—"}</td>
                              <td>{row.father_name || "—"}</td>
                              <td>{row.mother_name || "—"}</td>
                              <td>{row.gender_name || "—"}</td>
                              <td>{row.category_name || "—"}</td>
                              <td>{row.contact_no || "—"}</td>
                              <td>{row.email || "—"}</td>
                              <td>{row.present_city || "—"}</td>
                              <td>{row.present_state || "—"}</td>
                              <td>{formatDate(row.graduated_on)}</td>
                              <td>{row.alumni_status || row.status || "—"}</td>
                              <td>{row.graduation_remarks || "—"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="22" style={{ textAlign: "center" }}>
                              No Data Available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    <ReactPaginate
                      previousLabel={"Previous"}
                      nextLabel={"Next"}
                      breakLabel={"..."}
                      breakClassName={"page-item"}
                      breakLinkClassName={"page-link"}
                      pageCount={totalPages}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageChange}
                      containerClassName={"pagination justify-content-center"}
                      pageClassName={"page-item"}
                      pageLinkClassName={"page-link"}
                      previousClassName={"page-item"}
                      previousLinkClassName={"page-link"}
                      nextClassName={"page-item"}
                      nextLinkClassName={"page-link"}
                      activeClassName={"active"}
                      forcePage={Math.max(currentPage - 1, 0)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmAlumni;
