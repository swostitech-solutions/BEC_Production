import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import useFetchSections from "../../hooks/useFetchSections";
import Select from "react-select";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";
import { ApiUrl } from "../../../ApiUrl";
// import useFetchCourseList from "../../hooks/fetchCourseList";

const ModalStudent = ({ show, handleClose, onSelectStudent }) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [fullStudentData, setFullStudentData] = useState([]);
  // const { courseList } = useFetchCourseList();
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

  // Fetch Students Data
  useEffect(() => {
    const fetchStudentCourseData = async () => {
      try {
        const orgId = sessionStorage.getItem("organization_id") || 1;
        const branchId = sessionStorage.getItem("branch_id") || 1;
        const token = localStorage.getItem("accessToken"); // ✅ Get token

        const url = `${ApiUrl.apiurl}StudentCourse/StudentCourseRecordFilter/?organization_id=${orgId}&branch_id=${branchId}`;
        console.log("Fetching student course data:", url);

        setStudentLoading(true);
        // const response = await fetch(url);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Add token
          },
        });
        const data = await response.json();

        if (response.ok && Array.isArray(data) && data.length > 0) {
          setFullStudentData(data);
          setStudentData(data);
        } else if (response.ok && Array.isArray(data.data)) {
          setFullStudentData(data.data);
          setStudentData(data.data);
        } else {
          setFullStudentData([]);
          setStudentData([]);
          setStudentError(data.message || "No records found");
        }
      } catch (error) {
        console.error("Error fetching StudentCourseRecordFilter:", error);
        setStudentError("Error fetching student course data");
      } finally {
        setStudentLoading(false);
      }
    };

    fetchStudentCourseData();
  }, []);

  // Fetch Classes and Sections
  const {
    sections,
    loading: sectionLoading,
    error: sectionError,
  } = useFetchSections(selectedClass);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    const filteredData = fullStudentData.filter((student) => {
      const studentDetails = {
        first_name: student.student_name || "",
        middle_name: "",
        last_name: "",
        admission_no: student.enrollment_no || "",
        school_admission_no: student.college_admission_no || "",
        barcode: student.barcode || "",
        addmitted_class: student.batch_id || "",
        addmitted_section: student.section_name || "",
        father_name: student.father_name || "",
        mother_name: student.mother_name || "",
      };

      const fullName =
        `${studentDetails.first_name} ${studentDetails.middle_name} ${studentDetails.last_name}`
          .trim()
          .toLowerCase();

      const searchParts = filters.studentName
        .toLowerCase()
        .trim()
        .split(" ")
        .filter(Boolean);
      const nameMatches = searchParts.every((part) => fullName.includes(part));

      // return (
      //   (!filters.studentName || nameMatches) &&
      //   (!filters.admissionNo || studentDetails.school_admission_no.toString().includes(filters.admissionNo)) &&
      //   (!filters.barcode || studentDetails.barcode.toString().includes(filters.barcode)) &&
      //   (!filters.schoolAdmissionNo || studentDetails.admission_no.toString().includes(filters.schoolAdmissionNo)) &&
      //   (!filters.classId || studentDetails.addmitted_class.toString() === filters.classId.toString()) &&
      //   (!filters.section || studentDetails.addmitted_section === filters.section) &&
      //   (!filters.fatherName || studentDetails.father_name.toLowerCase().includes(filters.fatherName.toLowerCase())) &&
      //   (!filters.motherName || studentDetails.mother_name.toLowerCase().includes(filters.motherName.toLowerCase()))
      // );
      return (
        (!filters.studentName || nameMatches) &&
        (!filters.admission_no ||
          student.college_admission_no
            ?.toString()
            .includes(filters.admission_no)) &&
        (!filters.registration_no ||
          student.registration_no
            ?.toString()
            .includes(filters.registration_no)) &&
        (!filters.barcode ||
          student.barcode?.toString().includes(filters.barcode)) &&
        (!filters.classId ||
          student.batch_id?.toString() === filters.classId.toString()) &&
        (!filters.section || student.section_name === filters.section) &&
        (!filters.fatherName ||
          student.father_name
            ?.toLowerCase()
            .includes(filters.fatherName.toLowerCase())) &&
        (!filters.motherName ||
          student.mother_name
            ?.toLowerCase()
            .includes(filters.motherName.toLowerCase()))
      );
    });

    setStudentData(filteredData);
  };

  const handleSelectStudent = (student) => {
    const formattedStudent = {
      student_id: student.student_id,
      student_name: student.student_name,
      admission_no: student.enrollment_no,
      college_admission_no: student.college_admission_no,
      barcode: student.barcode,

      batch_id: student.batch_id,
      batch_code: student.batch_code,

      course_id: student.course_id,
      course_name: student.course_name,

      department_id: student.department_id,
      department_description: student.department_description,

      academic_year_id: student.academic_year_id,
      academic_year_code: student.academic_year_code,

      semester_id: student.semester_id,
      semester_description: student.semester_code,

      section_id: student.section_id,
      section_name: student.section_name,

      father_name: student.father_name,
      mother_name: student.mother_name,
    };

    onSelectStudent(formattedStudent);
    handleClose();
  };

  // const handleClearFilters = () => {
  //   // Reset all filters and state variables
  //   setFilters({
  //     studentName: "",
  //     admissionNo: "",
  //     barcode: "",
  //     classId: "",
  //     section: "",
  //     fatherName: "",
  //     motherName: "",
  //     schoolAdmissionNo: "",
  //   });
  //   setSelectedClass("");
  //   setSelectedSection("");
  //   setStudentData(fullStudentData);
  // };

  const handleClearFilters = () => {
    setFilters({
      studentName: "",
      admission_no: "",
      registration_no: "",
      barcode: "",
      classId: "",
      section: "",
      fatherName: "",
      motherName: "",
    });

    setSelectedClass("");
    setSelectedSection("");
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
                    </div>
                  </div>
                  {/* Search Fields */}
                  <div className="row mt-3">
                    <div className="col-12 col-md-3 mb-2">
                      <label
                        htmlFor="school-admission-no"
                        className="form-label"
                      >
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
                      <label
                        htmlFor="school-admission-no"
                        className="form-label"
                      >
                        Admission No
                      </label>
                      {/* <input
                        type="text"
                        name="admissionNo"
                        value={filters.admissionNo}
                        onChange={handleInputChange}
                        className="form-control detail"
                        placeholder="Admission No"
                        style={{ height: "38px", padding: "0.375rem 0.75rem" }}
                      /> */}
                      <input
                        type="text"
                        name="admission_no"
                        value={filters.admission_no}
                        onChange={handleInputChange}
                        className="form-control detail"
                        placeholder="Admission No"
                        style={{ height: "38px", padding: "0.375rem 0.75rem" }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="barcodeNo" className="form-label">
                        Student Barcode
                      </label>
                      <input
                        type="text"
                        name="collegeadmissionNo"
                        className="form-control detail"
                        placeholder="Barcode No"
                        style={{ height: "38px", padding: "0.375rem 0.75rem" }}
                      />
                    </div>
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
                  </div>
                  <div className="row mt-2">
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
                        onChange={(opt) => setSelectedSection(opt?.value || "")}
                        placeholder="Select Section"
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label
                        htmlFor="school-admission-no"
                        className="form-label"
                      >
                        Father's Name
                      </label>
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
                      <label
                        htmlFor="school-admission-no"
                        className="form-label"
                      >
                        Mother's Name
                      </label>
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
                      <label
                        htmlFor="school-admission-no"
                        className="form-label"
                      >
                        ONMRC Registration No
                      </label>
                      {/* <input
                        type="text"
                        name="collegeadmissionNo"
                        className="form-control detail"
                        placeholder="Registration No"
                        style={{ height: "38px", padding: "0.375rem 0.75rem" }}
                      /> */}
                      <input
                        type="text"
                        name="registration_no"
                        value={filters.registration_no}
                        onChange={handleInputChange}
                        className="form-control detail"
                        placeholder="ONMRC Registration No"
                        style={{ height: "38px", padding: "0.375rem 0.75rem" }}
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
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentData.length > 0 ? (
                          studentData.map((student, index) => (
                            <tr key={index}>
                              <td>{student.student_name}</td>
                              <td>{student.registration_no}</td>
                              <td>{student.college_admission_no}</td>
                              <td>{student.batch_code}</td>
                              <td>{student.course_name}</td>
                              <td>{student.department_code}</td>
                              <td>{student.academic_year_code}</td>
                              <td>{student.course_name}</td>
                              <td>{student.section_name}</td>
                              <td>{student.father_name}</td>
                              <td>{student.mother_name}</td>
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
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center">
                              {studentError || "No student records found"}
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
      </Modal.Body>
    </Modal>
  );
};

export default ModalStudent;
