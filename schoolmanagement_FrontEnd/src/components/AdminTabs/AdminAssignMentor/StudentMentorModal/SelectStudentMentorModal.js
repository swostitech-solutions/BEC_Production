import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import { ApiUrl } from "../../../../ApiUrl";

const SelectStudentModal = ({ show, handleClose, onSelectStudent }) => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [sections, setSections] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  
  const [filters, setFilters] = useState({
    studentName: "",
    admissionNo: "",
    barcode: "",
    fatherName: "",
    motherName: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Fetch Sessions (Batches)
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

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        if (Array.isArray(data)) {
          const sessionOptions = data.map((item) => ({
            value: item.id,
            label: item.batch_description,
          }));
          setSessions(sessionOptions);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  // Fetch Courses based on selected Session
  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedSession?.value) {
        setCourses([]);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value;

        if (!organization_id || !branch_id || !batch_id) return;

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

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();

        if (Array.isArray(data)) {
          const courseOptions = data.map((item) => ({
            value: item.id,
            label: item.course_name,
          }));
          setCourses(courseOptions);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [selectedSession]);

  // Fetch Departments based on Session and Course
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!selectedSession?.value || !selectedCourse?.value) {
        setDepartments([]);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value;
        const course_id = selectedCourse.value;

        if (!token || !organization_id || !branch_id) return;

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

        if (!response.ok) throw new Error(`Network response not ok: ${response.status}`);

        const result = await response.json();

        if (Array.isArray(result)) {
          const departmentOptions = result.map((item) => ({
            value: item.id || item.department_id,
            label: item.department_name || item.description || "Unnamed Department",
          }));
          setDepartments(departmentOptions);
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          const departmentOptions = result.data.map((item) => ({
            value: item.id || item.department_id,
            label: item.department_name || item.description || "Unnamed Department",
          }));
          setDepartments(departmentOptions);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, [selectedSession, selectedCourse]);

  // Fetch Academic Years
  useEffect(() => {
    const fetchAcademicYears = async () => {
      if (!selectedSession?.value || !selectedCourse?.value || !selectedDepartment?.value) {
        setAcademicYears([]);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value;
        const course_id = selectedCourse.value;
        const department_id = selectedDepartment.value;

        if (!token || !organization_id || !branch_id) return;

        const url = `${ApiUrl.apiurl}AcademicYear/GetAcademicYear/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Network response not ok: ${response.status}`);

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
        }
      } catch (error) {
        console.error("Error fetching academic years:", error);
      }
    };

    fetchAcademicYears();
  }, [selectedSession, selectedCourse, selectedDepartment]);

  // Fetch Semesters
  useEffect(() => {
    const fetchSemesters = async () => {
      if (
        !selectedSession?.value ||
        !selectedCourse?.value ||
        !selectedDepartment?.value ||
        !selectedAcademicYear?.value
      ) {
        setSemesters([]);
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

        if (!token || !organization_id || !branch_id) return;

        const url = `${ApiUrl.apiurl}Semester/GetSemester/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}&academic_year_id=${academic_year_id}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Network response not ok: ${response.status}`);

        const result = await response.json();

        if (Array.isArray(result)) {
          const options = result.map((item) => ({
            value: item.id || item.semester_id,
            label: item.semester_description || item.semester_code || "Unnamed Semester",
          }));
          setSemesters(options);
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          const options = result.data.map((item) => ({
            value: item.id || item.semester_id,
            label: item.semester_description || item.semester_code || "Unnamed Semester",
          }));
          setSemesters(options);
        }
      } catch (error) {
        console.error("Error fetching semesters:", error);
      }
    };

    fetchSemesters();
  }, [selectedSession, selectedCourse, selectedDepartment, selectedAcademicYear]);

  // Fetch Sections
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

        if (!token || !organization_id || !branch_id) return;

        const url = `${ApiUrl.apiurl}Section/GetSection/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}&academic_year_id=${academic_year_id}&semester_id=${semester_id}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Network response not ok: ${response.status}`);

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
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    fetchSections();
  }, [selectedSession, selectedCourse, selectedDepartment, selectedAcademicYear, selectedSemester]);

  // Search Students
  const handleSearch = async () => {
    try {
      const organization_id = sessionStorage.getItem("organization_id");
      const branch_id = sessionStorage.getItem("branch_id");
      const token = localStorage.getItem("accessToken");

      if (!organization_id || !branch_id || !token) {
        console.error("Missing required authentication data");
        return;
      }

      const params = new URLSearchParams({
        organization_id,
        branch_id,
        batch_id: selectedSession?.value || "",
        course_id: selectedCourse?.value || "",
        department_id: selectedDepartment?.value || "",
        academic_year_id: selectedAcademicYear?.value || "",
        semester_id: selectedSemester?.value || "",
        section_id: selectedSection?.value || "",
      });

      const url = `${ApiUrl.apiurl}StudentCourse/StudentCourseRecordFilter/?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch student data");

      const result = await response.json();
      
      if (result.message === "success!!" && Array.isArray(result.data)) {
        const mappedStudents = result.data.map((student) => ({
          id: student.id,
          studentBasicDetails: {
            id: student.student_id,
            student_name: student.student_name || "",
            course_name: student.course_name || "",
            sectionname: student.section_name || "",
            father_name: student.father_name || "",
            mother_name: student.mother_name || "",
            barcode: student.barcode || "",
          },
          fullData: student,
        }));

        // Apply client-side filters
        const filtered = mappedStudents.filter((student) => {
          const s = student.studentBasicDetails;
          const full = student.fullData || {};

          const nameFilter = (filters.studentName || "").toLowerCase();
          const admFilter = (filters.admissionNo || "").toLowerCase();
          const barcodeFilter = (filters.barcode || "").toLowerCase();
          const fatherFilter = (filters.fatherName || "").toLowerCase();
          const motherFilter = (filters.motherName || "").toLowerCase();

          const nameMatches = !nameFilter || (s.student_name || "").toLowerCase().includes(nameFilter);
          const admissionSource = full.enrollment_no || full.college_admission_no || full.school_admission_no || "";
          const admissionMatches = !admFilter || String(admissionSource).toLowerCase().includes(admFilter);
          const barcodeMatches = !barcodeFilter || String(s.barcode || "").toLowerCase().includes(barcodeFilter);
          const fatherMatches = !fatherFilter || (s.father_name || "").toLowerCase().includes(fatherFilter);
          const motherMatches = !motherFilter || (s.mother_name || "").toLowerCase().includes(motherFilter);

          return nameMatches && admissionMatches && barcodeMatches && fatherMatches && motherMatches;
        });

        setStudentData(filtered);
        setShowTable(true);
      } else {
        setStudentData([]);
        setShowTable(true);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setShowTable(true);
    }
  };

  const handleSelectStudent = (selectedStudent) => {
    setSelectedStudents((prevSelected) => {
      const exists = prevSelected.some(
        (s) => s.studentBasicDetails.id === selectedStudent.studentBasicDetails.id
      );

      if (selectAll) {
        setSelectAll(false);
        return [];
      }

      return exists
        ? prevSelected.filter((s) => s.studentBasicDetails.id !== selectedStudent.studentBasicDetails.id)
        : [...prevSelected, selectedStudent];
    });
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      setSelectedStudents(studentData);
    } else {
      setSelectedStudents([]);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      studentName: "",
      admissionNo: "",
      barcode: "",
      fatherName: "",
      motherName: "",
    });
    setSelectedSession(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
    setStudentData([]);
    setShowTable(false);
  };

  const handleSubmit = () => {
    if (typeof onSelectStudent === "function") {
      onSelectStudent(selectedStudents);
      handleClose();
      return;
    }

    navigate("/admin/assign-student-mentor", { state: { selectedStudents } });
    handleClose();
  };

  return (
    <Modal show={show} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton onClick={handleClose}></Modal.Header>
      <Modal.Body>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card p-0">
                <div className="card-body">
                  <p style={{ marginBottom: "0px", textAlign: "center", fontSize: "20px", fontWeight: "700" }}>
                    STUDENT SEARCH
                  </p>
                  
                  <div className="row mb-2">
                    <div className="col-12 d-flex flex-wrap gap-2">
                      <button type="button" className="btn btn-primary me-2" style={{ width: "150px" }} onClick={handleSearch}>
                        Search
                      </button>
                      <button type="button" className="btn btn-primary me-2" style={{ width: "150px" }} onClick={handleClearFilters}>
                        Clear
                      </button>
                      <button type="button" className="btn btn-danger me-2" style={{ width: "150px" }} onClick={handleClose}>
                        Close
                      </button>
                      <button type="button" className="btn btn-success me-2" style={{ width: "150px" }} onClick={handleSubmit}>
                        Submit
                      </button>
                    </div>
                  </div>

                  {/* Search Fields */}
                  <div className="row mt-3">
                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="student-name" className="form-label">Student Name</label>
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
                      <label htmlFor="admission-no" className="form-label">Admission No</label>
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
                      <label htmlFor="barcode" className="form-label">Student Barcode</label>
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
                      <label htmlFor="session" className="form-label">Session</label>
                      <Select
                        id="session"
                        options={sessions}
                        className="detail"
                        value={selectedSession}
                        placeholder="Select Session"
                        classNamePrefix="react-select"
                        onChange={setSelectedSession}
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="course" className="form-label">Course</label>
                      <Select
                        className="detail"
                        id="course"
                        options={courses}
                        value={selectedCourse}
                        onChange={setSelectedCourse}
                        placeholder="Select Course"
                      />
                    </div>
                    
                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="department" className="form-label">Department</label>
                      <Select
                        id="department"
                        className="detail"
                        options={departments}
                        value={selectedDepartment}
                        onChange={setSelectedDepartment}
                        placeholder="Select Department"
                      />
                    </div>
                    
                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="academic-year" className="form-label">Academic Year</label>
                      <Select
                        id="academic-year"
                        className="detail"
                        placeholder="Select Academic Year"
                        classNamePrefix="react-select"
                        options={academicYears}
                        value={selectedAcademicYear}
                        onChange={setSelectedAcademicYear}
                      />
                    </div>
                    
                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="semester" className="form-label">Semester</label>
                      <Select
                        id="semester"
                        className="detail"
                        placeholder="Select Semester"
                        classNamePrefix="react-select"
                        options={semesters}
                        value={selectedSemester}
                        onChange={setSelectedSemester}
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="section" className="form-label">Section</label>
                      <Select
                        id="section"
                        className="detail"
                        options={sections}
                        value={selectedSection}
                        onChange={setSelectedSection}
                        placeholder="Select Section"
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="father-name" className="form-label">Father's Name</label>
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
                      <label htmlFor="mother-name" className="form-label">Mother's Name</label>
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
                  </div>

                  {/* Students Table */}
                  {showTable && (
                    <div className="table-responsive mt-3">
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>Student Name</th>
                            <th>Course Name</th>
                            <th>Section</th>
                            <th>Father Name</th>
                            <th>Mother Name</th>
                            <th>Student Barcode</th>
                            <th>
                              Select
                              <br />
                              <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectAll}
                                title="Select All"
                              />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(studentData) && studentData.length > 0 ? (
                            studentData.map((student, index) => {
                              const s = student.studentBasicDetails;
                              return (
                                <tr key={index}>
                                  <td>{s.student_name}</td>
                                  <td>{s.course_name}</td>
                                  <td>{s.sectionname}</td>
                                  <td>{s.father_name}</td>
                                  <td>{s.mother_name}</td>
                                  <td>{s.barcode}</td>
                                  <td>
                                    <input
                                      type="checkbox"
                                      onChange={() => handleSelectStudent(student)}
                                      checked={selectedStudents.some(
                                        (sel) => sel.studentBasicDetails.id === student.studentBasicDetails.id
                                      )}
                                    />
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="7" className="text-center">
                                No student data found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
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