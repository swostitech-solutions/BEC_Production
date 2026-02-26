import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";
import { ApiUrl } from "../../../ApiUrl";

const ModalClass = ({ show, onSelectStudent, handleClose }) => {
  const token = localStorage.getItem("accessToken");
  const [students, setStudents] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
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
  const [showModal, setShowModal] = useState(false);
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

  // Trigger modal open logic (you might have this somewhere else in your code)
  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleSearch = async () => {
    try {
      let url = `${ApiUrl.apiurl}StudentCourse/StudentCourseRecordFilter/?organization_id=${organizationId}&branch_id=${branchId}`;

      url += `&hostel_availed=true`;

      // Append filters only if they have values
      if (filters.studentName) url += `&student_name=${filters.studentName}`;
      if (filters.admissionNo) url += `&admission_no=${filters.admissionNo}`;
      if (filters.barcode) url += `&barcode=${filters.barcode}`;
      if (filters.fatherName) url += `&father_name=${filters.fatherName}`;
      if (filters.motherName) url += `&mother_name=${filters.motherName}`;
      if (filters.schoolAdmissionNo)
        url += `&school_admission_no=${filters.schoolAdmissionNo}`;

      // Dropdown filters
      if (selectedBatch) url += `&batch_id=${selectedBatch}`;
      if (selectedCourse) url += `&course_id=${selectedCourse}`;
      if (selectedDepartment) url += `&department_id=${selectedDepartment}`;
      if (selectedAcademicYear)
        url += `&academic_year_id=${selectedAcademicYear}`;
      if (selectedSemester) url += `&semester_id=${selectedSemester}`;
      if (selectedSection) url += `&section_id=${selectedSection}`;

      console.log("FINAL FILTER URL:", url);

      // const response = await fetch(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (response.ok && Array.isArray(result.data)) {
        const mappedData = result.data.map((s) => ({
          id: s.id,
          student_id: s.student_id,
          studentname: s.student_name,
          // ✅ Correct fields from API
          registration_no: s.registration_no, // ONMRC Registration No
          college_admission_no: s.college_admission_no, // Admission No
          rollno: s.enrollment_no,
          batch_code: s.batch_code,
          course_name: s.course_name,
          department_code: s.department_code,
          academic_year_code: s.academic_year_code,
          semester_name: s.semester_name,
          section_name: s.section_name,
          barcode: s.barcode,
          father_name: s.father_name,
          mother_name: s.mother_name,
          rawData: s,
        }));

        setStudentData(mappedData);
        setFullStudentData(mappedData);
        setStudentError("");
      } else {
        setStudentData([]);
        setFullStudentData([]);
        setStudentError("No Record Found");
      }
    } catch (err) {
      console.error(err);
      setStudentError("Error fetching student data");
      setStudentData([]);
      setFullStudentData([]);
    }
  };

  const handleSelectStudent = (student) => {
    const formatted = {
      studentBasicDetails: {
        id: student.student_id,
        first_name: student.studentname,
        admission_no: student.admission_no,
        school_admission_no: student.school_admission_no,
        barcode: student.barcode,
        classname: student.course_name,
        sectionname: student.section_name,
        father_name: student.father_name,
        mother_name: student.mother_name,
        rollno: student.rollno,
        hostel_availed: student.rawData.hostel_availed,
      },

      academicDetails: {
        batch_id: student.rawData.batch_id,
        course_id: student.rawData.course_id,
        department_id: student.rawData.department_id,
        academic_year_id: student.rawData.academic_year_id,
        semester_id: student.rawData.semester_id,
        section_id: student.rawData.section,
      },

      raw: student.rawData,
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

    // 🔹 Reset dropdowns
    setSelectedBatch(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);

    // 🔹 Reset data
    setStudentData(fullStudentData);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  // ✅ Reset modal state every time it closes
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
      setStudentData([]);
      setFullStudentData([]);
      setStudentError("");
    }
  }, [show]);

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
                        {" "}
                        Student Name{" "}
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
                        {" "}
                        Admission No{" "}
                      </label>
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
                      <label
                        htmlFor="school-admission-no"
                        className="form-label"
                      >
                        {" "}
                        Student Barcode{" "}
                      </label>
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
                  <div className="row mt-2">
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
                        {" "}
                        Father's Name{" "}
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
                        {" "}
                        Mother's Name{" "}
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
                      <input
                        type="text"
                        name="schoolAdmissionNo"
                        value={filters.schoolAdmissionNo}
                        onChange={handleInputChange}
                        className="form-control detail"
                        placeholder="ONMRC Registration No"
                        style={{ height: "38px", padding: "0.375rem 0.75rem" }}
                      />
                    </div>
                  </div>
                  {/* Students Table */}
                  <div className="table-responsive mt-3">
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
                        {studentData.map((student, index) => (
                          <tr key={index}>
                            <td>{student.studentname}</td>
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

export default ModalClass;
