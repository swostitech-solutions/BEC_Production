import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";

const StudentSearch = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    admissionNo: "",
    studentBarcode: "",
    fatherName: "",
    motherName: "",
    rollNo: "",
    schoolAdmissionNo: "",
    status: "ACTIVE",
  });

  // Dropdown options state
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [sections, setSections] = useState([]);

  // Selected values state
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const [studentData, setStudentData] = useState([]);
  const [termOptions, setTermOptions] = useState([]);
  const [selectedTerms, setSelectedTerms] = useState({});

  const [isViewClicked, setIsViewClicked] = useState(false);
  const navigate = useNavigate();

  const statusOptions = [
    { value: "ACTIVE", label: "ACTIVE" },
    { value: "INACTIVE", label: "INACTIVE" },
  ];

  // Fetch Sessions (Batch) on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const branch_id = sessionStorage.getItem("branch_id");
        const organization_id = sessionStorage.getItem("organization_id");

        if (!branch_id || !organization_id) {
          console.error("Branch ID or Organization ID not found in session storage.");
          return;
        }

        const response = await fetch(
          `${ApiUrl.apiurl}Batch/GetBatch/?organization_id=${organization_id}&branch_id=${branch_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const sessionOptions = data.map((item) => ({
            value: item.id,
            label: item.batch_description,
          }));
          setSessions(sessionOptions);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  // Fetch Courses when Session changes
  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedSession?.value) {
        setCourses([]);
        setSelectedCourse(null);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value;

        if (!organization_id || !branch_id || !batch_id) {
          console.warn("Missing required parameters for courses");
          return;
        }

        const response = await fetch(
          `${ApiUrl.apiurl}Course/GetCourse/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const courseOptions = data.map((item) => ({
            value: item.id,
            label: item.course_name,
          }));
          setCourses(courseOptions);
        } else {
          console.error("Unexpected API response format:", data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [selectedSession]);

  // Fetch Departments when Session and Course change
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!selectedSession?.value || !selectedCourse?.value) {
        setDepartments([]);
        setSelectedDepartment(null);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value;
        const course_id = selectedCourse.value;

        if (!token || !organization_id || !branch_id) {
          console.warn("Missing required identifiers");
          return;
        }

        const response = await fetch(
          `${ApiUrl.apiurl}Department/GetDepartment/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Network response not ok: ${response.status}`);
        }

        const result = await response.json();

        if (Array.isArray(result)) {
          const departmentOptions = result.map((item) => ({
            value: item.id || item.department_id,
            label: item.department_name || item.description || item.department_description || "Unnamed Department",
          }));
          setDepartments(departmentOptions);
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          const departmentOptions = result.data.map((item) => ({
            value: item.id || item.department_id,
            label: item.department_name || item.description || item.department_description || "Unnamed Department",
          }));
          setDepartments(departmentOptions);
        } else {
          console.warn("Unexpected API format:", result);
          setDepartments([]);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, [selectedSession, selectedCourse]);

  // Fetch Academic Years when Session, Course, and Department change
  useEffect(() => {
    const fetchAcademicYears = async () => {
      if (!selectedSession?.value || !selectedCourse?.value || !selectedDepartment?.value) {
        setAcademicYears([]);
        setSelectedAcademicYear(null);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value;
        const course_id = selectedCourse.value;
        const department_id = selectedDepartment.value;

        if (!token || !organization_id || !branch_id) {
          console.warn("Missing required parameters");
          return;
        }

        const url = `${ApiUrl.apiurl}AcademicYear/GetAcademicYear/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Network response not ok: ${response.status}`);
        }

        const result = await response.json();

        if (Array.isArray(result)) {
          const options = result.map((item) => ({
            value: item.id || item.academic_year_id,
            label: item.academic_year_description || item.academic_year_code || "Unnamed Year",
          }));
          setAcademicYears(options);
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          const options = result.data.map((item) => ({
            value: item.id || item.academic_year_id,
            label: item.academic_year_description || item.academic_year_code || "Unnamed Year",
          }));
          setAcademicYears(options);
        } else {
          console.warn("Unexpected API format:", result);
          setAcademicYears([]);
        }
      } catch (error) {
        console.error("Error fetching academic years:", error);
        setAcademicYears([]);
      }
    };

    fetchAcademicYears();
  }, [selectedSession, selectedCourse, selectedDepartment]);

  // Fetch Semesters when Session, Course, Department, and Academic Year change
  useEffect(() => {
    const fetchSemesters = async () => {
      if (
        !selectedSession?.value ||
        !selectedCourse?.value ||
        !selectedDepartment?.value ||
        !selectedAcademicYear?.value
      ) {
        setSemesters([]);
        setSelectedSemester(null);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");

        const url = `${ApiUrl.apiurl}Semester/GetSemester/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${selectedSession.value}&course_id=${selectedCourse.value}&department_id=${selectedDepartment.value}&academic_year_id=${selectedAcademicYear.value}`;

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (Array.isArray(result)) {
          setSemesters(
            result.map((item) => ({
              value: item.id,
              label: item.semester_description || item.semester_code,
            }))
          );
        } else {
          setSemesters([]);
        }
      } catch (error) {
        console.error("Error fetching semesters:", error);
        setSemesters([]);
      }
    };

    fetchSemesters();
  }, [selectedSession, selectedCourse, selectedDepartment, selectedAcademicYear]);

  // Fetch Sections when all above dropdowns are selected
  useEffect(() => {
    const fetchSections = async () => {
      if (
        !selectedSession?.value ||
        !selectedCourse?.value ||
        !selectedDepartment?.value ||
        !selectedAcademicYear?.value ||
        !selectedSemester?.value
      ) {
        setSections([]);
        setSelectedSection(null);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value;
        const course_id = selectedCourse.value;
        const department_id = selectedDepartment.value;
        const academic_year_id = selectedAcademicYear.value;
        const semester_id = selectedSemester.value;

        if (!token || !organization_id || !branch_id) {
          console.warn("Missing required identifiers");
          return;
        }

        const url = `${ApiUrl.apiurl}Section/GetSection/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}&academic_year_id=${academic_year_id}&semester_id=${semester_id}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Network response not ok: ${response.status}`);
        }

        const result = await response.json();

        if (Array.isArray(result)) {
          const sectionOptions = result.map((item) => ({
            value: item.id || item.section_id,
            label: item.section_name || item.section_description || "Unnamed Section",
          }));
          setSections(sectionOptions);
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          const sectionOptions = result.data.map((item) => ({
            value: item.id || item.section_id,
            label: item.section_name || item.section_description || "Unnamed Section",
          }));
          setSections(sectionOptions);
        } else {
          console.warn("Unexpected API format:", result);
          setSections([]);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        setSections([]);
      }
    };

    fetchSections();
  }, [selectedSession, selectedCourse, selectedDepartment, selectedAcademicYear, selectedSemester]);

  // Fetch Term Options for the table dropdown
  useEffect(() => {
    const fetchTermOptions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const academicSessionId = localStorage.getItem("academicSessionId");
        const orgId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
        const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");

        const termApi = `${ApiUrl.apiurl}Semester/GetAllSemester/?academic_year_id=${academicSessionId}&org_id=${orgId}&branch_id=${branchId}`;

        const response = await fetch(termApi, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
          const options = data.data.map((sem) => ({
            value: sem.id,
            label: sem.semester_code || sem.semester_name || sem.name,
          }));
          setTermOptions(options);
        }
      } catch (error) {
        console.error("Error fetching term options:", error);
      }
    };

    fetchTermOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearch = async () => {
    const token = localStorage.getItem("accessToken");
    const academicSessionId = localStorage.getItem("academicSessionId");
    const orgId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
    const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");

    const classId = selectedCourse?.value;
    if (!classId) {
      alert("Please select a Course.");
      return;
    }

    const queryParams = new URLSearchParams({
      academic_year_id: academicSessionId,
      org_id: orgId,
      branch_id: branchId,
      class_id: classId,
      is_active: formData.status === "ACTIVE" ? "1" : "0",
    });

    if (formData.studentName) queryParams.append("student_name", formData.studentName);
    if (formData.admissionNo) queryParams.append("admission_no", formData.admissionNo);
    if (formData.studentBarcode) queryParams.append("barcord", formData.studentBarcode);
    if (selectedSection?.value) queryParams.append("section_id", selectedSection.value);
    if (formData.rollNo) queryParams.append("roll_no", formData.rollNo);
    if (formData.fatherName) queryParams.append("father_name", formData.fatherName);
    if (formData.motherName) queryParams.append("mother_name", formData.motherName);
    if (formData.schoolAdmissionNo) queryParams.append("registration_no", formData.schoolAdmissionNo);

    const apiUrl = `${ApiUrl.apiurl}reportcard/studentlist/?${queryParams.toString()}`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setStudentData(data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClear = () => {
    setFormData({
      studentName: "",
      admissionNo: "",
      studentBarcode: "",
      fatherName: "",
      motherName: "",
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
    setStudentData([]);
    setSelectedTerms({});
    setIsViewClicked(false);
  };

  const handleClose = () => {
    navigate("/staff/dashboard");
  };

  const handleTermChange = (studentId, termValue) => {
    setSelectedTerms((prev) => ({
      ...prev,
      [studentId]: termValue,
    }));
  };

  const handleAddDataClick = (student) => {
    const selectedTermId = selectedTerms[student.student_course_id];
    if (!selectedTermId) {
      alert("Please select a Term first.");
      return;
    }
    const selectedTermOption = termOptions.find((t) => t.value === parseInt(selectedTermId));
    navigate("/staff/add-student-data", {
      state: {
        student: {
          ...student,
          semester_id: parseInt(selectedTermId),
          semester_name: selectedTermOption?.label || "",
        },
      },
    });
  };

  const handleViewReport = (student) => {
    const selectedTermId = selectedTerms[student.student_course_id];
    if (!selectedTermId) {
      alert("Please select a Term first.");
      return;
    }
    const selectedTermOption = termOptions.find((t) => t.value === parseInt(selectedTermId));
    navigate("/staff/view-student-report", {
      state: {
        student: {
          ...student,
          semester_id: parseInt(selectedTermId),
          semester_name: selectedTermOption?.label || "",
        },
      },
    });
  };

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
                STUDENT SEARCH
              </p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
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
                    onClick={handleClear}
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

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mt-2">
                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="student-name" className="form-label">
                          Student Name
                        </label>
                        <input
                          type="text"
                          id="student-name"
                          name="studentName"
                          className="form-control detail"
                          value={formData.studentName}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="admission-number" className="form-label">
                          Admission Number
                        </label>
                        <input
                          type="text"
                          name="admissionNo"
                          className="form-control detail"
                          value={formData.admissionNo}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="student-barcode" className="form-label">
                          Student BarCode
                        </label>
                        <input
                          type="text"
                          name="studentBarcode"
                          className="form-control detail"
                          value={formData.studentBarcode}
                          onChange={handleInputChange}
                        />
                      </div>

                      {/* Session Dropdown */}
                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="session" className="form-label">
                          Session
                        </label>
                        <Select
                          id="session"
                          className="detail"
                          options={sessions}
                          value={selectedSession}
                          placeholder="Select Session"
                          onChange={(option) => {
                            setSelectedSession(option);
                            setSelectedCourse(null);
                            setSelectedDepartment(null);
                            setSelectedAcademicYear(null);
                            setSelectedSemester(null);
                            setSelectedSection(null);
                          }}
                          isClearable
                        />
                      </div>

                      {/* Course Dropdown */}
                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="course" className="form-label">
                          Course
                        </label>
                        <Select
                          id="course"
                          className="detail"
                          options={courses}
                          value={selectedCourse}
                          placeholder="Select Course"
                          onChange={(option) => {
                            setSelectedCourse(option);
                            setSelectedDepartment(null);
                            setSelectedAcademicYear(null);
                            setSelectedSemester(null);
                            setSelectedSection(null);
                          }}
                          isDisabled={!selectedSession}
                          isClearable
                        />
                      </div>

                      {/* Department Dropdown */}
                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="department" className="form-label">
                          Department
                        </label>
                        <Select
                          id="department"
                          className="detail"
                          options={departments}
                          value={selectedDepartment}
                          placeholder="Select Department"
                          onChange={(option) => {
                            setSelectedDepartment(option);
                            setSelectedAcademicYear(null);
                            setSelectedSemester(null);
                            setSelectedSection(null);
                          }}
                          isDisabled={!selectedCourse}
                          isClearable
                        />
                      </div>

                      {/* Academic Year Dropdown */}
                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="academic-year" className="form-label">
                          Academic Year
                        </label>
                        <Select
                          id="academic-year"
                          className="detail"
                          options={academicYears}
                          value={selectedAcademicYear}
                          placeholder="Select Academic Year"
                          onChange={(option) => {
                            setSelectedAcademicYear(option);
                            setSelectedSemester(null);
                            setSelectedSection(null);
                          }}
                          isDisabled={!selectedDepartment}
                          isClearable
                        />
                      </div>

                      {/* Semester Dropdown */}
                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="semester" className="form-label">
                          Semester
                        </label>
                        <Select
                          id="semester"
                          className="detail"
                          options={semesters}
                          value={selectedSemester}
                          placeholder="Select Semester"
                          onChange={(option) => {
                            setSelectedSemester(option);
                            setSelectedSection(null);
                          }}
                          isDisabled={!selectedAcademicYear}
                          isClearable
                        />
                      </div>

                      {/* Section Dropdown */}
                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="section" className="form-label">
                          Section
                        </label>
                        <Select
                          id="section"
                          className="detail"
                          options={sections}
                          value={selectedSection}
                          placeholder="Select Section"
                          onChange={setSelectedSection}
                          isDisabled={!selectedSemester}
                          isClearable
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="roll-number" className="form-label">
                          Roll Number
                        </label>
                        <input
                          type="text"
                          name="rollNo"
                          className="form-control detail"
                          value={formData.rollNo}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="father-name" className="form-label">
                          Father Name
                        </label>
                        <input
                          type="text"
                          name="fatherName"
                          className="form-control detail"
                          value={formData.fatherName}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="mother-name" className="form-label">
                          Mother Name
                        </label>
                        <input
                          type="text"
                          className="form-control detail"
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="regn-number" className="form-label">
                          Registration No
                        </label>
                        <input
                          type="text"
                          name="schoolAdmissionNo"
                          className="form-control detail"
                          value={formData.schoolAdmissionNo}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="status" className="form-label">
                          Status
                        </label>
                        <Select
                          id="status"
                          className="detail"
                          value={statusOptions.find((option) => option.value === formData.status)}
                          onChange={(option) =>
                            setFormData({ ...formData, status: option?.value || "ACTIVE" })
                          }
                          options={statusOptions}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Course</th>
                        <th>Section</th>
                        <th>Student Name</th>
                        <th>Enrollment No</th>
                        <th>Roll No</th>
                        <th>BarCode</th>
                        <th>Father Name</th>
                        <th>Mother Name</th>
                        <th>Select Term</th>
                        <th>Add Exam Data</th>
                        <th>View Exam Report</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentData.length > 0 ? (
                        studentData.map((student, index) => (
                          <tr key={student.id || index}>
                            <td>{index + 1}</td>
                            <td>{student.course_name}</td>
                            <td>{student.section_name}</td>
                            <td>{student.full_name}</td>
                            <td>{student.enrollment_no}</td>
                            <td>{student.rollno || "-"}</td>
                            <td>{student.barcode || "-"}</td>
                            <td>{student.father_name || "-"}</td>
                            <td>{student.mother_name || "-"}</td>
                            <td>
                              <select
                                name="term"
                                className="form-select w-100"
                                value={selectedTerms[student.student_course_id] || ""}
                                onChange={(e) =>
                                  handleTermChange(student.student_course_id, e.target.value)
                                }
                              >
                                <option value="">Select Term</option>
                                {termOptions.map((option, idx) => (
                                  <option key={idx} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleAddDataClick(student)}
                              >
                                Add Data
                              </Button>
                            </td>
                            <td>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleViewReport(student)}
                              >
                                View Report
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="12" className="text-center">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
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

export default StudentSearch;
