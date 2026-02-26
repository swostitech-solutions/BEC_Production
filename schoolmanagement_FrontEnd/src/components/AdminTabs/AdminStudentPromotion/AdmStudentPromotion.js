import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Table, Button, Label, Input } from "reactstrap";
import "./AdmStudentPromotion.css";
import { ApiUrl } from "../../../ApiUrl";
import Select from "react-select";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";

const StudentPromotion = () => {
  const organizationId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [promotedStudents, setPromotedStudents] = useState([]);
  const [selectedToClass, setSelectedToClass] = useState("");
  const [showTableData, setShowTableData] = useState(false);
  const navigate = useNavigate();

  /* ---------------- From Dropdowns ---------------- */
  const [fromBatch, setFromBatch] = useState(null);
  const [fromCourse, setFromCourse] = useState(null);
  const [fromDepartment, setFromDepartment] = useState(null);
  const [fromAcademicYear, setFromAcademicYear] = useState(null);
  const [fromSemester, setFromSemester] = useState(null);
  const [fromSection, setFromSection] = useState(null);

  /* ---------------- To Dropdowns ---------------- */
  const [toBatch, setToBatch] = useState(null);
  const [toCourse, setToCourse] = useState(null);
  const [toDepartment, setToDepartment] = useState(null);
  const [toAcademicYear, setToAcademicYear] = useState(null);
  const [toSemester, setToSemester] = useState(null);
  const [toSection, setToSection] = useState(null);

  /* ---------------- Hook Calls (shared data source) ---------------- */
  const {
    BatchList,
    loading: loadingBatch,
    error: errorBatch,
  } = useFetchSessionList(organizationId, branchId);
  const {
    CourseList,
    loading: loadingCourse,
    error: errorCourse,
  } = useFetchCourseByFilter(organizationId, fromBatch || toBatch);
  const {
    BranchList,
    loading: loadingBranch,
    error: errorBranch,
  } = useFetchBranch(
    organizationId,
    branchId,
    fromBatch || toBatch,
    fromCourse || toCourse
  );
  const {
    AcademicYearList,
    loading: loadingAY,
    error: errorAY,
  } = useFetchAcademicYearByFilter(
    organizationId,
    branchId,
    fromBatch || toBatch,
    fromCourse || toCourse,
    fromDepartment || toDepartment
  );
  const {
    SemesterList,
    loading: loadingSem,
    error: errorSem,
  } = useFetchSemesterByFilter(
    organizationId,
    branchId,
    fromBatch || toBatch,
    fromCourse || toCourse,
    fromDepartment || toDepartment,
    fromAcademicYear || toAcademicYear
  );
  const {
    SectionList,
    loading: loadingSec,
    error: errorSec,
  } = useFetchSectionByFilter(
    organizationId,
    branchId,
    fromBatch || toBatch,
    fromCourse || toCourse,
    fromDepartment || toDepartment,
    fromAcademicYear || toAcademicYear,
    fromSemester || toSemester
  );

  const [selectedToSection, setSelectedToSection] = useState("");

  // New UseState (From Side)
  const { CourseList: fromCourseList } = useFetchCourseByFilter(
    organizationId,
    fromBatch
  );

  const { BranchList: fromDepartmentList } = useFetchBranch(
    organizationId,
    branchId,
    fromBatch,
    fromCourse
  );

  const { AcademicYearList: fromAcademicYearList } =
    useFetchAcademicYearByFilter(
      organizationId,
      branchId,
      fromBatch,
      fromCourse,
      fromDepartment
    );

  const { SemesterList: fromSemesterList } = useFetchSemesterByFilter(
    organizationId,
    branchId,
    fromBatch,
    fromCourse,
    fromDepartment,
    fromAcademicYear
  );

  const { SectionList: fromSectionList } = useFetchSectionByFilter(
    organizationId,
    branchId,
    fromBatch,
    fromCourse,
    fromDepartment,
    fromAcademicYear,
    fromSemester
  );

  // To Side
  const { CourseList: toCourseList } = useFetchCourseByFilter(
    organizationId,
    toBatch
  );

  const { BranchList: toDepartmentList } = useFetchBranch(
    organizationId,
    branchId,
    toBatch,
    toCourse
  );

  const { AcademicYearList: toAcademicYearList } = useFetchAcademicYearByFilter(
    organizationId,
    branchId,
    toBatch,
    toCourse,
    toDepartment
  );

  const { SemesterList: toSemesterList } = useFetchSemesterByFilter(
    organizationId,
    branchId,
    toBatch,
    toCourse,
    toDepartment,
    toAcademicYear
  );

  const { SectionList: toSectionList } = useFetchSectionByFilter(
    organizationId,
    branchId,
    toBatch,
    toCourse,
    toDepartment,
    toAcademicYear,
    toSemester
  );

  // ---------------------

  const [formData, setFormData] = useState({});
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [errorStudents, setErrorStudents] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");

  useEffect(() => {
    const handleSessionChange = () => {
      //  Clear all fields and data
      setSelectedClass("");
      setSelectedToClass("");
      setSelectedToSection("");
      setSelectedStudents([]);
      setPromotedStudents([]);
      setStudents([]);
      setShowTableData(false);

      if (fromClassRef.current) fromClassRef.current.value = "";
      if (fromSectionRef.current) fromSectionRef.current.value = "";
      if (toClassRef.current) toClassRef.current.value = "";
      if (toSectionRef.current) toSectionRef.current.value = "";
    };

    window.addEventListener("academicSessionChanged", handleSessionChange);
    return () =>
      window.removeEventListener("academicSessionChanged", handleSessionChange);
  }, []);

  // const handleClassChange = (e) => {
  //   const classId = e.target.value;
  //   setSelectedClass(classId);
  //   localStorage.setItem("selectedClassId", classId); // Store in local storage
  // };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    localStorage.setItem("selectedClassId", classId); // Store in local storage

    // 🔄 Clear all dependent dropdowns and data
    setSelectedToClass("");
    setSelectedToSection("");
    setSelectedStudents([]);
    setPromotedStudents([]);
    setStudents([]);

    // 🔄 Optionally clear related localStorage
    localStorage.removeItem("selectedSectionId");
    localStorage.removeItem("selectedToClassId");
    localStorage.removeItem("selectedToSectionId");
    localStorage.removeItem("selectedClassConfirmStudentId");
  };

  const fetchStudents = async () => {
    // 🔹 Validation for required fields
    if (
      !fromBatch ||
      !fromCourse ||
      !fromDepartment ||
      !fromAcademicYear ||
      !fromSemester ||
      !fromSection
    ) {
      setStudentError("Please select all required fields.");
      return;
    }

    setStudentLoading(true);
    setStudentError("");

    try {
      const token = localStorage.getItem("accessToken"); // ✅ Get token
      const url = `${ApiUrl.apiurl}StudentCourse/StudentCourseRecordFilter/?organization_id=${organizationId}&branch_id=${branchId}&batch_id=${fromBatch}&course_id=${fromCourse}&department_id=${fromDepartment}&academic_year_id=${fromAcademicYear}&semester_id=${fromSemester}&section_id=${fromSection}`;

      console.log("📡 Fetching students from:", url);

      // const response = await fetch(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Add token here
        },
      });
      const result = await response.json();

      if (
        result.message?.toLowerCase().includes("success") &&
        Array.isArray(result.data)
      ) {
        setStudents(result.data);
        setStudentError("");
      } else {
        setStudents([]);
        setStudentError("No students found for the selected filters.");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudentError("Error fetching student data.");
      setStudents([]);
    } finally {
      setStudentLoading(false);
    }
  };

  const handleDisplayClick = () => {
    setShowTableData(true); // This triggers table to display
    fetchStudents(); // Call API to get student data
  };

  const handleCheckboxChange = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const allStudentIds = students.map((student) => student.student_id);
      setSelectedStudents(allStudentIds);
    } else {
      setSelectedStudents([]);
    }
  };

  const handlePromoteStudents = () => {
    const newPromotedStudents = students.filter((student) =>
      selectedStudents.includes(student.student_id)
    );
    setPromotedStudents((prev) => [...prev, ...newPromotedStudents]);
    setStudents((prev) =>
      prev.filter((student) => !selectedStudents.includes(student.student_id))
    );
    setSelectedStudents([]);
  };

  const handleDemoteStudents = () => {
    const demotedStudents = promotedStudents.filter((student) =>
      selectedStudents.includes(student.student_id)
    );
    setPromotedStudents((prev) =>
      prev.filter((student) => !selectedStudents.includes(student.student_id))
    );
    setStudents((prev) => [...prev, ...demotedStudents]);
    setSelectedStudents([]);
  };

  const handleSelectAllPromoted = (event) => {
    if (event.target.checked) {
      const allPromotedIds = promotedStudents.map(
        (student) => student.student_id
      );
      setSelectedStudents(allPromotedIds);
    } else {
      setSelectedStudents([]);
    }
  };

  const updateStudentStatus = async (status) => {
    const userId = sessionStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");

    // ✅ Validate all required fields
    if (
      !fromBatch ||
      !fromCourse ||
      !fromDepartment ||
      !fromAcademicYear ||
      !fromSemester ||
      !fromSection ||
      !toAcademicYear ||
      !toSemester ||
      !toSection
    ) {
      alert("Please select all 'From' and 'To' fields before promotion.");
      return;
    }

    // ✅ Collect selected promoted student IDs
    const studentIds = promotedStudents.map((s) => s.student_id);
    if (studentIds.length === 0) {
      alert("No students selected for promotion.");
      return;
    }

    // For Future Developemennt (Not Required Now)
    const promotedStudentPayload = promotedStudents.map((student) => ({
      // student_id: student.student_id,
      hostel_availed: student.hostel_availed,
      hostel_choice_semester: student.hostel_choice_semester,
      transport_availed: student.transport_availed,
      choice_semester: student.choice_semester,
    }));

    // ✅ Build payload including new keys
    const payload = {
      organization_id: Number(organizationId),
      branch_id: Number(branchId),
      batch_id: Number(fromBatch),
      course_id: Number(fromCourse),
      department_id: Number(fromDepartment),
      academic_year_id: Number(fromAcademicYear),
      semester_id: Number(fromSemester),
      section_id: Number(fromSection),
      next_academic_year_id: Number(toAcademicYear),
      next_semester_id: Number(toSemester),
      next_section_id: Number(toSection),
      student_id: studentIds,
      student_details: promotedStudentPayload,
      student_status: status.toUpperCase(),
      created_by: Number(userId) || 1,
    };

    console.log("📤 Promotion Payload:", payload);

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}StudentPromotion/StudentCourseSemesterPromotion/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("📥 API Response:", result);

      if (response.ok && result.message) {
        // ✅ Show the exact message from backend
        alert(`✅ ${result.message}`);
        setPromotedStudents([]);
      } else {
        alert(`⚠️ Error: ${result.message || "Promotion failed"}`);
      }
    } catch (error) {
      console.error("❌ Error during promotion:", error);
      alert("❌ Error updating student promotion status");
    }
  };

  const fromClassRef = useRef();
  const fromSectionRef = useRef();
  const toClassRef = useRef();
  const toSectionRef = useRef();

  const handleClear = () => {
    // 🔹 Reset "From" dropdowns
    setFromBatch(null);
    setFromCourse(null);
    setFromDepartment(null);
    setFromAcademicYear(null);
    setFromSemester(null);
    setFromSection(null);

    // 🔹 Reset "To" dropdowns
    setToBatch(null);
    setToCourse(null);
    setToDepartment(null);
    setToAcademicYear(null);
    setToSemester(null);
    setToSection(null);

    // 🔹 Reset other form data if present
    setFormData({});

    // 🔹 Optional: also clear localStorage/sessionStorage if you store selection
    localStorage.removeItem("selectedFromBatch");
    localStorage.removeItem("selectedToBatch");

    console.log("✅ All dropdowns cleared successfully.");
  };

  const handleNewClick = () => {
    navigate("/admin/dashboard");
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
                STUDENT PROMOTION
              </p>
              <Row className="mb-3 mx-2 mt-2 custom-section-box">
                {/* FROM Fields - Left Side with Border */}
                <Col xs={12} md={6}>
                  <div
                    style={{
                      border: "1px solid #ccc",
                      padding: "15px",
                      borderRadius: "5px",
                      height: "90%",
                      margin: "20px 0",
                    }}
                  >
                    <h5 className="mb-3">From Details</h5>
                    <Row>
                      <Col xs={12} sm={6} className="mb-3">
                        <Label htmlFor="from-class" className="form-label">
                          From Batch
                          <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Select
                          className="detail"
                          isLoading={loadingBatch}
                          options={
                            BatchList?.map((b) => ({
                              value: b.id,
                              label: b.batch_description,
                            })) || []
                          }
                          value={
                            BatchList?.find((b) => b.id === fromBatch)
                              ? {
                                  value: fromBatch,
                                  label: BatchList.find(
                                    (b) => b.id === fromBatch
                                  )?.batch_description,
                                }
                              : null
                          }
                          onChange={(opt) => {
                            setFromBatch(opt?.value || "");
                            setFromCourse("");
                            setFromDepartment("");
                            setFromAcademicYear("");
                            setFromSemester("");
                            setFromSection("");
                          }}
                          placeholder="Select Batch"
                        />
                      </Col>

                      <Col xs={12} sm={6} className="mb-3">
                        <Label htmlFor="from-class" className="form-label">
                          From Course
                          <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Select
                          className="detail"
                          options={fromCourseList.map((c) => ({
                            value: c.id,
                            label: c.course_name,
                          }))}
                          onChange={(opt) => {
                            setFromCourse(opt?.value);
                            setFromDepartment(null);
                            setFromAcademicYear(null);
                            setFromSemester(null);
                            setFromSection(null);
                          }}
                          placeholder="Select Course"
                        />
                      </Col>

                      <Col xs={12} sm={6} className="mb-3">
                        <Label htmlFor="from-class" className="form-label">
                          From Department
                          <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Select
                          className="detail"
                          isLoading={loadingBranch}
                          options={
                            BranchList?.map((d) => ({
                              value: d.id,
                              label: d.department_description,
                            })) || []
                          }
                          value={
                            BranchList?.find((d) => d.id === fromDepartment)
                              ? {
                                  value: fromDepartment,
                                  label: BranchList.find(
                                    (d) => d.id === fromDepartment
                                  )?.department_description,
                                }
                              : null
                          }
                          onChange={(opt) => {
                            setFromDepartment(opt?.value || "");
                            setFromAcademicYear("");
                            setFromSemester("");
                            setFromSection("");
                          }}
                          placeholder="Select Department"
                        />
                      </Col>

                      <Col xs={12} sm={6} className="mb-3">
                        <Label className="form-label">
                          From Academic Year
                          <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Select
                          className="detail"
                          isLoading={loadingAY}
                          options={
                            AcademicYearList?.map((a) => ({
                              value: a.id,
                              label: a.academic_year_description,
                            })) || []
                          }
                          value={
                            AcademicYearList?.find(
                              (a) => a.id === fromAcademicYear
                            )
                              ? {
                                  value: fromAcademicYear,
                                  label: AcademicYearList.find(
                                    (a) => a.id === fromAcademicYear
                                  )?.academic_year_description,
                                }
                              : null
                          }
                          onChange={(opt) => {
                            setFromAcademicYear(opt?.value || "");
                            setFromSemester("");
                            setFromSection("");
                          }}
                          placeholder="Select Academic Year"
                        />
                      </Col>

                      <Col xs={12} sm={6} className="mb-3">
                        <Label className="form-label">
                          From Semester
                          <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Select
                          className="detail"
                          isLoading={loadingSem}
                          options={
                            SemesterList?.map((s) => ({
                              value: s.id,
                              label: s.semester_description,
                            })) || []
                          }
                          value={
                            SemesterList?.find((s) => s.id === fromSemester)
                              ? {
                                  value: fromSemester,
                                  label: SemesterList.find(
                                    (s) => s.id === fromSemester
                                  )?.semester_description,
                                }
                              : null
                          }
                          onChange={(opt) => {
                            setFromSemester(opt?.value || "");
                            setFromSection("");
                          }}
                          placeholder="Select Semester"
                        />
                      </Col>

                      <Col xs={12} sm={6} className="mb-3">
                        <Label htmlFor="from-section" className="form-label">
                          From Section
                          <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Select
                          className="detail"
                          isLoading={loadingSec}
                          options={
                            SectionList?.map((s) => ({
                              value: s.id,
                              label: s.section_name,
                            })) || []
                          }
                          value={
                            SectionList?.find((s) => s.id === fromSection)
                              ? {
                                  value: fromSection,
                                  label: SectionList.find(
                                    (s) => s.id === fromSection
                                  )?.section_name,
                                }
                              : null
                          }
                          onChange={(opt) => setFromSection(opt?.value || "")}
                          placeholder="Select Section"
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>

                {/* TO Fields - Right Side with Border */}
                <Col xs={12} md={6}>
                  <div
                    style={{
                      border: "1px solid #ccc",
                      padding: "15px",
                      borderRadius: "5px",
                      height: "90%",
                      margin: "20px 0",
                    }}
                  >
                    <h5 className="mb-3">To Details</h5>
                    <Row>
                      <Col xs={12} sm={6} className="mb-3">
                        <Label htmlFor="from-class" className="form-label">
                          To Batch
                          <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Select
                          className="detail"
                          isLoading={loadingBatch}
                          options={
                            BatchList?.map((b) => ({
                              value: b.id,
                              label: b.batch_description,
                            })) || []
                          }
                          value={
                            BatchList?.find((b) => b.id === toBatch)
                              ? {
                                  value: toBatch,
                                  label: BatchList.find((b) => b.id === toBatch)
                                    ?.batch_description,
                                }
                              : null
                          }
                          onChange={(opt) => {
                            setToBatch(opt?.value || "");
                            setToCourse("");
                            setToDepartment("");
                            setToAcademicYear("");
                            setToSemester("");
                            // setToSection("");
                            setToSection(null);
                          }}
                          placeholder="Select Batch"
                        />
                      </Col>

                      <Col xs={12} sm={6} className="mb-3">
                        <Label htmlFor="from-class" className="form-label">
                          To Course
                          <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Select
                          className="detail"
                          options={toCourseList.map((c) => ({
                            value: c.id,
                            label: c.course_name,
                          }))}
                          onChange={(opt) => {
                            setToCourse(opt?.value);
                            setToDepartment(null);
                            setToAcademicYear(null);
                            setToSemester(null);
                            setToSection(null);
                          }}
                          placeholder="Select Course"
                        />
                      </Col>

                      <Col xs={12} sm={6} className="mb-3">
                        <Label htmlFor="from-class" className="form-label">
                          To Department
                          <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Select
                          className="detail"
                          isLoading={loadingBranch}
                          options={
                            BranchList?.map((d) => ({
                              value: d.id,
                              label: d.department_description,
                            })) || []
                          }
                          value={
                            BranchList?.find((d) => d.id === toDepartment)
                              ? {
                                  value: toDepartment,
                                  label: BranchList.find(
                                    (d) => d.id === toDepartment
                                  )?.department_description,
                                }
                              : null
                          }
                          onChange={(opt) => {
                            setToDepartment(opt?.value || "");
                            setToAcademicYear("");
                            setToSemester("");
                            // setToSection("");
                            setToSection(null);
                          }}
                          placeholder="Select Department"
                        />
                      </Col>

                      <Col xs={12} sm={6} className="mb-3">
                        <Label className="form-label">
                          To Academic Year
                          <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Select
                          className="detail"
                          isLoading={loadingAY}
                          options={
                            AcademicYearList?.map((a) => ({
                              value: a.id,
                              label: a.academic_year_description,
                            })) || []
                          }
                          value={
                            AcademicYearList?.find(
                              (a) => a.id === toAcademicYear
                            )
                              ? {
                                  value: toAcademicYear,
                                  label: AcademicYearList.find(
                                    (a) => a.id === toAcademicYear
                                  )?.academic_year_description,
                                }
                              : null
                          }
                          onChange={(opt) => {
                            setToAcademicYear(opt?.value || "");
                            setToSemester("");
                            // setToSection("");
                            setToSection(null);
                          }}
                          placeholder="Select Academic Year"
                        />
                      </Col>

                      <Col xs={12} sm={6} className="mb-3">
                        <Label className="form-label">
                          To Semester
                          <span style={{ color: "red" }}>*</span>
                        </Label>
                        {/* <Select
                          className="detail"
                          isLoading={loadingSem}
                          // options={SemesterList?.map(s => ({ value: s.id, label: s.semester_description })) || []}
                          options={toSemesterList?.map(s => ({
                            value: s.id,
                            label: s.semester_description
                          })) || []}
                          // value={SemesterList?.find(s => s.id === toSemester) ? { value: toSemester, label: SemesterList.find(s => s.id === toSemester)?.semester_description } : null}
                          value={
                            toSemester
                              ? {
                                value: Number(toSemester),
                                label: toSemesterList?.find(
                                  s => Number(s.id) === Number(toSemester)
                                )?.semester_description,
                              }
                              : null
                          }
                          // onChange={(opt) => {
                          //   setToSemester(opt?.value || "");
                          //   setToSection("");
                          // }}
                          onChange={(opt) => {
                            setToSemester(opt ? Number(opt.value) : null);
                            setToSection(null);   // MUST reset
                          }}
                          placeholder="Select Semester"
                        /> */}
                        <Select
                          className="detail"
                          isLoading={loadingSem}
                          options={
                            toSemesterList?.map((s) => ({
                              value: Number(s.id),
                              label: s.semester_description,
                            })) || []
                          }
                          value={
                            toSemester
                              ? {
                                  value: Number(toSemester),
                                  label: toSemesterList?.find(
                                    (s) => Number(s.id) === Number(toSemester)
                                  )?.semester_description,
                                }
                              : null
                          }
                          onChange={(opt) => {
                            setToSemester(opt ? Number(opt.value) : null);
                            setToSection(null); // reset section when semester changes
                          }}
                          placeholder="Select Semester"
                        />
                      </Col>

                      <Col xs={12} sm={6} className="mb-3">
                        <Label htmlFor="to-section" className="form-label">
                          To Section
                          <span style={{ color: "red" }}>*</span>
                        </Label>
                        {/* <Select
                          className="detail"
                          isLoading={loadingSec}
                          options={SectionList?.map(s => ({ value: s.id, label: s.section_name })) || []}
                          value={SectionList?.find(s => s.id === toSection) ? { value: toSection, label: SectionList.find(s => s.id === toSection)?.section_name } : null}
                          onChange={(opt) => setToSection(opt?.value || "")}
                          placeholder="Select Section"
                        /> */}
                        <Select
                          className="detail"
                          isLoading={loadingSec}
                          options={
                            toSectionList?.map((s) => ({
                              value: Number(s.id),
                              label: s.section_name,
                            })) || []
                          }
                          value={
                            toSection
                              ? {
                                  value: Number(toSection),
                                  label: toSectionList.find(
                                    (s) => Number(s.id) === Number(toSection)
                                  )?.section_name,
                                }
                              : null
                          }
                          onChange={(opt) => {
                            setToSection(opt ? Number(opt.value) : null);
                          }}
                          placeholder="Select Section"
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>

              <Row className="mx-2" style={{ border: "1px solid #ccc" }}>
                <Col xs={12} md={5} className="mb-3 mt-3  ">
                  <div
                    style={{
                      maxHeight: "340px",
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    <div className="row">
                      <div className="col-12">
                        <div className="table-responsive">
                          <table className="table table-bordered table-hover">
                            <thead>
                              <tr>
                                <th>
                                  <Input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={
                                      students.length > 0 &&
                                      selectedStudents.length ===
                                        students.length
                                    }
                                  />
                                </th>
                                <th>ONMRC Registration No</th>
                                <th>Admission No</th>
                                <th>Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {showTableData ? (
                                studentLoading ? (
                                  <tr>
                                    <td
                                      colSpan="4"
                                      style={{ textAlign: "center" }}
                                    >
                                      Loading students...
                                    </td>
                                  </tr>
                                ) : studentError ? (
                                  <tr>
                                    <td
                                      colSpan="4"
                                      style={{ textAlign: "center" }}
                                    >
                                      {studentError}
                                    </td>
                                  </tr>
                                ) : students.length > 0 ? (
                                  students.map((student) => (
                                    <tr key={student.student_id}>
                                      <td>
                                        <Input
                                          type="checkbox"
                                          checked={selectedStudents.includes(
                                            student.student_id
                                          )}
                                          onChange={() =>
                                            handleCheckboxChange(
                                              student.student_id
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        {student.registration_no !== null
                                          ? student.registration_no
                                          : "N/A"}
                                      </td>
                                      <td>{student.college_admission_no}</td>
                                      <td>{student.student_name}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="4"
                                      style={{ textAlign: "center" }}
                                    >
                                      No students found
                                    </td>
                                  </tr>
                                )
                              ) : (
                                <tr>
                                  <td
                                    colSpan="4"
                                    style={{ textAlign: "center" }}
                                  >
                                    Select filters and click Display to load
                                    students.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col
                  xs={10}
                  md={2}
                  className="d-flex justify-content-center align-items-center mb-3 mt-3 mx-auto"
                >
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{ minWidth: "140px", width: "100%" }}
                  >
                    <Button
                      color="primary"
                      className="mb-2 w-100"
                      onClick={handleDisplayClick}
                    >
                      Display
                    </Button>
                    <Button
                      color="primary"
                      className="mb-2 w-100"
                      onClick={handlePromoteStudents}
                    >
                      {" > "}
                    </Button>
                    <Button
                      color="primary"
                      className="mb-2 w-100"
                      onClick={handleDemoteStudents}
                    >
                      {" < "}
                    </Button>
                    <Button
                      color="primary"
                      className="mb-2 w-100"
                      onClick={() => updateStudentStatus("promoted")}
                      disabled={!toAcademicYear}
                    >
                      Promotion
                    </Button>
                    <Button
                      color="primary"
                      className="mb-2 w-100"
                      onClick={() => updateStudentStatus("Fail")}
                      disabled={!toAcademicYear}
                    >
                      Failed
                    </Button>
                    <Button
                      color="primary"
                      className="mb-2 w-100"
                      onClick={() => updateStudentStatus("demoted")}
                      disabled={!selectedToClass || !selectedToSection}
                    >
                      Demotion
                    </Button>
                    <Button
                      color="warning"
                      onClick={handleClear}
                      className="mb-2 w-100"
                    >
                      Clear
                    </Button>
                    <Button
                      color="danger"
                      className="mb-2 w-100"
                      onClick={handleNewClick}
                    >
                      Close
                    </Button>
                  </div>
                </Col>

                <Col xs={12} md={5} className="mt-3">
                  <div
                    style={{
                      maxHeight: "340px",
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    <div className="row">
                      <div className="col-12">
                        <div className="table-responsive">
                          <table className="table table-bordered ">
                            <thead>
                              <tr>
                                <th>
                                  <Input
                                    type="checkbox"
                                    onChange={handleSelectAllPromoted}
                                    checked={
                                      selectedStudents.length ===
                                        promotedStudents.length &&
                                      promotedStudents.length > 0
                                    }
                                  />
                                </th>
                                <th>ONMRC Registration No</th>
                                <th>Admission No</th>
                                <th>Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {promotedStudents.length > 0 ? (
                                promotedStudents.map((student) => (
                                  <tr key={student.student_id}>
                                    <td>
                                      <Input
                                        type="checkbox"
                                        checked={selectedStudents.includes(
                                          student.student_id
                                        )}
                                        onChange={() =>
                                          handleCheckboxChange(
                                            student.student_id
                                          )
                                        } // Ensure this function is working properly
                                      />
                                    </td>
                                    <td>
                                      {student.registration_no !== null
                                        ? student.registration_no
                                        : "N/A"}
                                    </td>
                                    <td>{student.college_admission_no}</td>
                                    <td>{student.student_name}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="5">
                                    No students available for promotion.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPromotion;
