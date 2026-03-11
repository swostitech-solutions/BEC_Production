import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";

const SelectStudentModal = ({ show, handleClose, onSelectStudent }) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [studentData, setStudentData] = useState([]);
  const [fullStudentData, setFullStudentData] = useState([]);

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

  const [filters, setFilters] = useState({
    studentName: "",
    admissionNo: "",
    barcode: "",
    classId: "",
    section: "",
    fatherName: "",
    motherName: "",
    schoolAdmissionNo: "",
  });

  useEffect(() => {
    const fetchStudentCourseData = async () => {
      try {
        const organizationId = sessionStorage.getItem("organization_id");
        const branchId = sessionStorage.getItem("branch_id");
        const token = localStorage.getItem("accessToken"); // ✅ Get token

        // const response = await fetch(
        //   `${ApiUrl.apiurl}StudentCourse/StudentCourseRecordFilter/?organization_id=${organizationId}&branch_id=${branchId}`
        // );
        const response = await fetch(
          `${ApiUrl.apiurl}StudentCourse/StudentCourseRecordFilter/?organization_id=${organizationId}&branch_id=${branchId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ Add token
            },
          }
        );

        if (!response.ok)
          throw new Error("Failed to fetch student course data");

        const data = await response.json();

        if (data?.data) {
          setFullStudentData(data.data);
          setStudentData(data.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchStudentCourseData();
  }, []);

  // Reset modal state when closed
  useEffect(() => {
    if (!show) {
      setFilters({
        studentName: "",
        admissionNo: "",
        barcode: "",
        classId: "",
        section: "",
        fatherName: "",
        motherName: "",
        schoolAdmissionNo: "",
      });
      setSelectedClass("");
      setSelectedSection("");
      setStudentData(fullStudentData);
      setSelectedStudents(new Set());
    }
  }, [show, fullStudentData]);

  const handleSelectStudent = (student) => {
    setSelectedStudents((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(student)) {
        newSelected.delete(student);
      } else {
        newSelected.add(student);
      }
      return newSelected;
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedStudents(new Set(studentData));
    } else {
      setSelectedStudents(new Set());
    }
  };

  const handleSelect = () => {
    if (typeof onSelectStudent === "function") {
      onSelectStudent(Array.from(selectedStudents));
      handleClose();
    } else {
      console.error("onSelectStudent is not a function");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    try {
      const organizationId = sessionStorage.getItem("organization_id");
      const branchId = sessionStorage.getItem("branch_id");
      const token = localStorage.getItem("accessToken"); // ✅ Get token

      const params = new URLSearchParams();

      params.append("organization_id", organizationId);
      params.append("branch_id", branchId);

      // Text inputs
      if (filters.studentName)
        params.append("student_name", filters.studentName);
      if (filters.admissionNo)
        params.append("college_admission_no", filters.admissionNo);
      if (filters.schoolAdmissionNo)
        params.append("registration_no", filters.schoolAdmissionNo);
      if (filters.fatherName) params.append("father_name", filters.fatherName);
      if (filters.motherName) params.append("mother_name", filters.motherName);
      if (filters.barcode) params.append("barcode", filters.barcode);

      // Dropdowns
      if (selectedBatch) params.append("batch_id", selectedBatch);
      if (selectedCourse) params.append("course_id", selectedCourse);
      if (selectedDepartment)
        params.append("department_id", selectedDepartment);
      if (selectedAcademicYear)
        params.append("academic_year_id", selectedAcademicYear);
      if (selectedSemester) params.append("semester_id", selectedSemester);
      if (selectedSection) params.append("section_id", selectedSection);

      const url = `${
        ApiUrl.apiurl
      }StudentCourse/StudentCourseRecordFilter/?${params.toString()}`;

      console.log("SEARCH URL:", url);

      // const response = await fetch(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Add token
        },
      });
      if (!response.ok) throw new Error("Search API failed");

      const result = await response.json();

      setStudentData(result.data || []);
    } catch (err) {
      console.error("Search Error:", err);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      studentName: "",
      admissionNo: "",
      barcode: "",
      classId: "",
      section: "",
      fatherName: "",
      motherName: "",
      schoolAdmissionNo: "",
    });

    // Reset dropdowns
    setSelectedBatch(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);

    setStudentData(fullStudentData);
    setSelectedStudents(new Set());
  };

  return (
    <Modal
      show={show}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onClick={handleClose}></Modal.Header>
      <Modal.Body style={{ maxHeight: "75vh", overflowY: "auto" }}>
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
                      <button
                        type="button"
                        className="btn btn-primary me-2"
                        style={{ width: "150px" }}
                        onClick={handleSelect}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                  {/* Search Fields */}
                  <div className="row mt-3">
                    <div className="col-3">
                      <label
                        htmlFor="school-admission-no"
                        className="form-label"
                      >
                        {" "}
                        Student Name{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control detail"
                        name="studentName"
                        value={filters.studentName}
                        onChange={handleInputChange}
                        placeholder="Student Name"
                      />
                    </div>
                    <div className="col-3">
                      <label
                        htmlFor="school-admission-no"
                        className="form-label"
                      >
                        {" "}
                        Admission No{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control detail"
                        name="admissionNo"
                        value={filters.admissionNo}
                        onChange={handleInputChange}
                        placeholder="Admission No"
                      />
                    </div>
                    <div className="col-3">
                      <label
                        htmlFor="school-admission-no"
                        className="form-label"
                      >
                        {" "}
                        Student Barcode{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control detail"
                        name="barcode"
                        value={filters.barcode}
                        onChange={handleInputChange}
                        placeholder="Barcode"
                      />
                    </div>
                    <div className="col-3">
                      <label className="form-label">Session</label>
                      <Select
                        className=" detail"
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
                  <div className="row mt-3">
                    <div className="col-3">
                      <label className="form-label">Course</label>
                      <Select
                        className=" detail"
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
                          setSelectedDepartment(null);
                          setSelectedAcademicYear(null);
                          setSelectedSemester(null);
                          setSelectedSection(null);
                        }}
                        placeholder="Select Course"
                      />
                    </div>
                    <div className="col-3">
                      <label className="form-label">Department</label>
                      <Select
                        className=" detail"
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
                          setSelectedAcademicYear(null);
                          setSelectedSemester(null);
                          setSelectedSection(null);
                        }}
                        placeholder="Select Department"
                      />
                    </div>

                    {/* Academic Year */}
                    <div className="col-3">
                      <label className="form-label">Academic Year</label>
                      <Select
                        className=" detail"
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
                          setSelectedSemester(null);
                          setSelectedSection(null);
                        }}
                        placeholder="Select Academic Year"
                      />
                    </div>

                    {/* Semester */}
                    <div className="col-3">
                      <label className="form-label">Semester</label>
                      <Select
                        className=" detail"
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
                          setSelectedSection(null);
                        }}
                        placeholder="Select Semester"
                      />
                    </div>

                    {/* Section */}
                    <div className="col-3">
                      <label className="form-label">Section</label>
                      <Select
                        className=" detail"
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
                        onChange={(opt) => setSelectedSection(opt?.value || "")}
                        placeholder="Select Section"
                      />
                    </div>
                    <div className="col-3">
                      <label
                        htmlFor="school-admission-no"
                        className="form-label"
                      >
                        {" "}
                        Father's Name{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control detail"
                        name="fatherName"
                        value={filters.fatherName}
                        onChange={handleInputChange}
                        placeholder="Father Name"
                      />
                    </div>
                    <div className="col-3">
                      <label
                        htmlFor="school-admission-no"
                        className="form-label"
                      >
                        {" "}
                        Mother's Name{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control detail"
                        name="motherName"
                        value={filters.motherName}
                        onChange={handleInputChange}
                        placeholder="Mother Name"
                      />
                    </div>
                    <div className="col-3">
                      <label
                        htmlFor="school-admission-no"
                        className="form-label"
                      >
                        {" "}
                        ONMRC Registration No{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control detail"
                        name="schoolAdmissionNo"
                        value={filters.schoolAdmissionNo}
                        onChange={handleInputChange}
                        placeholder="ONMRC Registration No"
                      />
                    </div>
                  </div>
                  {/* Students Table */}
                  <div
                    className="table-responsive mt-3"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              onChange={handleSelectAll}
                              checked={
                                selectedStudents.size === studentData.length
                              }
                            />
                          </th>
                          <th>Student Name</th>
                          <th>ONMRC Registration No</th>
                          <th>Admission No</th>
                          <th>Session</th>
                          <th>Course</th>
                          <th>Department</th>
                          <th>Academic Year</th>
                          <th>Semester</th>
                          <th>Section</th>
                          <th>Father Name</th>
                          <th>Mother Name</th>
                          <th>Student Barcode</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentData.map((student, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={selectedStudents.has(student)}
                                  onChange={() => handleSelectStudent(student)}
                                />
                              </td>
                              <td>{student.student_name}</td>
                              <td>{student.registration_no}</td>
                              <td>{student.college_admission_no}</td>
                              <td>{student.batch_code}</td>
                              <td>{student.course_name}</td>
                              <td>{student.department_code}</td>
                              <td>{student.academic_year_code}</td>
                              <td>{student.semester_name}</td>
                              <td>{student.section_name}</td>
                              <td>{student.father_name}</td>
                              <td>{student.mother_name}</td>
                              <td>{student.barcode}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
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
