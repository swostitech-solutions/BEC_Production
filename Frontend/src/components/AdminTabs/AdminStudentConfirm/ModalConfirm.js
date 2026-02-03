import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import useFetchClasses from "../../hooks/useFetchClasses";
import Select from "react-select";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";
import { ApiUrl } from "../../../ApiUrl";

const ModalConfirm = ({ show, handleClose, onSelectStudent }) => {
  const [students, setStudents] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");

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

  const [studentData, setStudentData] = useState([]);
  const [fullStudentData, setFullStudentData] = useState([]);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchStudentConfirmData = async () => {
      try {
        const organizationId = sessionStorage.getItem("organization_id") || 1;
        const branchId = sessionStorage.getItem("branch_id") || 1;
        const token = localStorage.getItem("accessToken"); // ✅ TOKEN

        // const response = await fetch(
        //   `${ApiUrl.apiurl}StudentCourse/StudentCourseConfirmRECORDFilter/?organization_id=${organizationId}&branch_id=${branchId}`
        // );
        const response = await fetch(
          `${ApiUrl.apiurl}StudentCourse/StudentCourseConfirmRECORDFilter/?organization_id=${organizationId}&branch_id=${branchId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ ADD TOKEN
            },
          }
        );

        if (!response.ok)
          throw new Error("Error fetching student confirmation data");

        const data = await response.json();
        if (data.message === "success!!" && Array.isArray(data.data)) {
          setFullStudentData(data.data);
          setStudentData(data.data);
        } else {
          setFullStudentData([]);
          setStudentData([]);
        }
      } catch (error) {
        console.error("Error fetching confirmation data:", error);
      }
    };

    fetchStudentConfirmData();
  }, []);

  //08202025
  const handleSearch = async () => {
    try {
      const organizationId = sessionStorage.getItem("organization_id") || 1;
      const branchId = sessionStorage.getItem("branch_id") || 1;
      const token = localStorage.getItem("accessToken"); // ✅ TOKEN

      let url = `${ApiUrl.apiurl}StudentCourse/StudentCourseConfirmRECORDFilter/?organization_id=${organizationId}&branch_id=${branchId}`;

      // ✅ Dynamically append filters
      if (filters.studentName)
        url += `&student_name=${encodeURIComponent(filters.studentName)}`;
      if (filters.admissionNo)
        url += `&admission_no=${encodeURIComponent(filters.admissionNo)}`;
      if (filters.barcode)
        url += `&barcode=${encodeURIComponent(filters.barcode)}`;
      if (filters.fatherName)
        url += `&fatherName=${encodeURIComponent(filters.fatherName)}`;
      if (filters.motherName)
        url += `&motherName=${encodeURIComponent(filters.motherName)}`;
      if (filters.schoolAdmissionNo)
        url += `&college_admission_no=${encodeURIComponent(
          filters.schoolAdmissionNo
        )}`;
      if (selectedCourse) url += `&course_id=${selectedCourse}`;
      if (selectedDepartment) url += `&department_id=${selectedDepartment}`;
      if (selectedAcademicYear)
        url += `&academic_year_id=${selectedAcademicYear}`;
      if (selectedSemester) url += `&semester_id=${selectedSemester}`;
      if (selectedSection) url += `&section_id=${selectedSection}`;

      console.log("🔍 API URL:", url); // (For debugging — optional)

      // const response = await fetch(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ TOKEN ADDED
        },
      });

      if (!response.ok)
        throw new Error("Error fetching student confirmation data");

      const data = await response.json();
      if (data.message === "success!!" && Array.isArray(data.data)) {
        setFullStudentData(data.data);
        setStudentData(data.data);
      } else {
        setFullStudentData([]);
        setStudentData([]);
      }
    } catch (error) {
      console.error("Error fetching confirmation data:", error);
    }
  };

  const handleSelectStudent = (student) => {
    const formatted = {
      studentId: student.student_id,
      studentname: student.student_name,
      admission_no: student.admission_no,
      college_admission_no: student.college_admission_no,
      barcode: student.barcode,

      batch_id: student.batch_id,
      course_id: student.course_id,
      department_id: student.department_id,
      academic_year_id: student.academic_year_id,
      semester_id: student.semester_id,
      section_id: student.section_id,

      batch_code: student.batch_code,
      course_name: student.course_name,
      department_description: student.department_description,
      academic_year_code: student.academic_year_code,
      semester_code: student.semester_code,
      section_name: student.section_name,

      raw: student,
    };

    onSelectStudent(formatted);
    handleClose();
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

    // Reset dropdown selections
    setSelectedBatch(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);

    // Reset student data
    setStudentData(fullStudentData);
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
                        className="btn btn-primary me-2"
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
                      <label className="form-label">Student Name</label>
                      <input
                        type="text"
                        name="studentName"
                        value={filters.studentName}
                        onChange={handleInputChange}
                        className="form-control detail"
                        placeholder="Student Name"
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
                      />
                    </div>
                    {/* Batch */}
                    <div className="col-12 col-md-3 mb-2">
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
                    {/* ====================== FILTERED DROPDOWNS ====================== */}
                    <div className="row mt-3 mb-3">
                      {/* Course */}
                      <div className="col-12 col-md-3 mb-2">
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
                      {/* Department */}
                      <div className="col-12 col-md-3 mb-2">
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
                      <div className="col-12 col-md-3 mb-2">
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
                      <div className="col-12 col-md-3 mb-2">
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
                      <div className="col-12 col-md-3 mb-2">
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
                          onChange={(opt) =>
                            setSelectedSection(opt?.value || "")
                          }
                          placeholder="Select Section"
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
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label className="form-label">
                          College Admission No
                        </label>
                        <input
                          type="text"
                          name="schoolAdmissionNo"
                          value={filters.schoolAdmissionNo}
                          onChange={handleInputChange}
                          className="form-control detail"
                          placeholder="College Admission No"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Students Table */}
                  <div className="table-responsive mt-3">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>College Admission No</th>
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
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentData.map((student, index) => (
                          <tr key={index}>
                            <td>{student.student_name}</td>
                            <td>{student.college_admission_no}</td>
                            <td>{student.barcode}</td>
                            <td>{student.batch_code}</td>
                            <td>{student.course_name}</td>
                            <td>{student.department_description}</td>
                            <td>{student.academic_year_code}</td>
                            <td>{student.semester_code}</td>
                            <td>{student.section_name}</td>
                            <td>{student.fatherName}</td>
                            <td>{student.motherName}</td>
                            <td>{student.barcode}</td>
                            <td>{student.student_status}</td>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalConfirm;
