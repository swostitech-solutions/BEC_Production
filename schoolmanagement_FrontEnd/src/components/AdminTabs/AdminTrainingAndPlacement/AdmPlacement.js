import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdmPlacement.css";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import { Row, Col, Form } from "react-bootstrap";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";

const AdmAttendanceEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get orgId and branchId first, before any other declarations
  const orgId = sessionStorage.getItem("organization_id") || "1";
  const branchId = sessionStorage.getItem("branch_id") || "1";

  // const placementData = location.state?.placementData || {}; // Retrieve passed data

  const placementData = location.state?.placementData || null;

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [submitMessage, setSubmitMessage] = useState({
    type: "",
    text: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    organizationName: "",
    trainingModule: "",
    duration: "",
    numParticipants: "",
    hrName: "",
  });

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);

  const { BatchList } = useFetchSessionList(orgId, branchId);

  const { CourseList } = useFetchCourseByFilter(orgId, selectedBatch?.value);

  const { BranchList: DepartmentList } = useFetchBranch(orgId, branchId, selectedBatch?.value, selectedCourse?.value);

  const { AcademicYearList } = useFetchAcademicYearByFilter(orgId, branchId, selectedBatch?.value, selectedCourse?.value, selectedDepartment?.value);

  const { SemesterList } = useFetchSemesterByFilter(orgId, branchId, selectedBatch?.value, selectedCourse?.value, selectedDepartment?.value, selectedAcademicYear?.value);

  const fromClassRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);

  const handleClear = () => {
    // Clear controlled form fields
    setFormData({
      organizationName: "",
      trainingModule: "",
      duration: "",
      numParticipants: "",
      hrName: "",
    });

    // Clear date fields
    setFromDate(null);
    setToDate(null);
    setSelectedBatch(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSubmitMessage({ type: "", text: "" });
    setFieldErrors({});

    // Clear uncontrolled input refs if used elsewhere
    if (fromClassRef.current) fromClassRef.current.value = "";
    if (admissionNoRef.current) admissionNoRef.current.value = "";
    if (barcodeRef.current) barcodeRef.current.value = "";
    if (smsToRef.current) smsToRef.current.checked = false;
  };

  // Prefill form when placementData is available
  useEffect(() => {
    if (placementData) {
      setFormData({
        organizationName: placementData.company_name || "",
        trainingModule: placementData.module || "",
        duration: placementData.duration
          ? placementData.duration.replace(/\\/g, "\\\\")
          : "",
        numParticipants: placementData.participants || "",
        hrName: placementData.hr_name || "",
      });

      setFromDate(placementData.from_date || "");
      setToDate(placementData.to_date || "");

      // Prefill batch if available
      if (placementData.batch_id && BatchList.length > 0) {
        const batch = BatchList.find((b) => b.id === placementData.batch_id);
        if (batch) {
          setSelectedBatch({ value: batch.id, label: batch.batch_description });
        }
      }

      // Prefill course if available
      if (placementData.course_id && CourseList.length > 0) {
        const course = CourseList.find((c) => c.id === placementData.course_id);
        if (course) {
          setSelectedCourse({ value: course.id, label: course.course_name });
        }
      }

      // Prefill department if available
      if (placementData.department_id && DepartmentList.length > 0) {
        const department = DepartmentList.find((d) => d.id === placementData.department_id);
        if (department) {
          setSelectedDepartment({ value: department.id, label: department.department_description });
        }
      }

      // Prefill academic year if available
      if (placementData.academic_year_id && AcademicYearList.length > 0) {
        const academicYear = AcademicYearList.find((y) => y.id === placementData.academic_year_id);
        if (academicYear) {
          setSelectedAcademicYear({ value: academicYear.id, label: academicYear.academic_year_description });
        }
      }

      // Prefill semester if available
      if (placementData.semester_id && SemesterList.length > 0) {
        const semester = SemesterList.find((s) => s.id === placementData.semester_id);
        if (semester) {
          setSelectedSemester({ value: semester.id, label: semester.semester_description });
        }
      }
    }
  }, [placementData, BatchList, CourseList, DepartmentList, AcademicYearList, SemesterList]);
  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation for Duration and Number of Participants: only allow numbers
    if (name === "duration" || name === "numParticipants") {
      // Allow empty string or numbers only
      if (value === "" || /^\d+$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (setter, fieldName) => (selectedValue) => {
    setter(selectedValue);
    setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const formatLocalDate = (date) => {
    if (!(date instanceof Date)) return date;
    const offset = date.getTimezoneOffset() * 60000; // Get timezone offset in milliseconds
    return new Date(date.getTime() - offset).toISOString().split("T")[0]; // Adjust for timezone
  };

  const getErrorMessage = (errorData) => {
    if (!errorData) return "Error saving placement. Please try again.";
    if (typeof errorData === "string") return errorData;
    if (errorData.detail) return errorData.detail;

    const firstKey = Object.keys(errorData)[0];
    if (!firstKey) return "Error saving placement. Please try again.";

    const fieldError = errorData[firstKey];
    if (Array.isArray(fieldError) && fieldError.length > 0) {
      return `${firstKey}: ${fieldError[0]}`;
    }
    if (typeof fieldError === "string") {
      return `${firstKey}: ${fieldError}`;
    }

    return "Error saving placement. Please try again.";
  };

  const getFieldErrorText = (value) => {
    if (Array.isArray(value)) return value[0] || "Invalid value.";
    if (typeof value === "string") return value;
    return "Invalid value.";
  };

  const mapApiErrorsToFields = (errorData) => {
    if (!errorData || typeof errorData !== "object") {
      return { mappedErrors: {}, message: "" };
    }

    const apiToUiFieldMap = {
      company_name: "organizationName",
      module: "trainingModule",
      duration: "duration",
      from_date: "fromDate",
      to_date: "toDate",
      participants: "numParticipants",
      hr_name: "hrName",
      batch: "batch",
      course: "course",
      department: "department",
      academic_year: "academicYear",
      semester: "semester",
    };

    const mappedErrors = {};
    const nonFieldMessages = [];

    Object.entries(errorData).forEach(([key, value]) => {
      const text = getFieldErrorText(value);
      const uiField = apiToUiFieldMap[key];

      if (uiField) {
        mappedErrors[uiField] = text;
      } else if (key === "detail" || key === "non_field_errors") {
        nonFieldMessages.push(text);
      } else {
        nonFieldMessages.push(`${key}: ${text}`);
      }
    });

    return {
      mappedErrors,
      message: nonFieldMessages.join(" "),
    };
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.organizationName.trim()) {
      errors.organizationName = "Organization/Company name is required";
    }
    if (!formData.trainingModule.trim()) {
      errors.trainingModule = "Training module is required";
    }
    if (!formData.duration || Number(formData.duration) <= 0) {
      errors.duration = "Duration is required";
    }
    if (!fromDate) {
      errors.fromDate = "From date is required";
    }
    if (!toDate) {
      errors.toDate = "To date is required";
    }
    if (!selectedBatch) {
      errors.batch = "Session is required";
    }
    if (!selectedCourse) {
      errors.course = "Course is required";
    }
    if (!selectedDepartment) {
      errors.department = "Department is required";
    }
    if (!selectedAcademicYear) {
      errors.academicYear = "Academic year is required";
    }
    if (!formData.numParticipants || Number(formData.numParticipants) <= 0) {
      errors.numParticipants = "Number of participants is required";
    }

    if (fromDate && toDate) {
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(toDate);
      end.setHours(0, 0, 0, 0);

      if (end < start) {
        errors.toDate = "To date cannot be earlier than from date";
      }

      if (formData.duration && Number(formData.duration) > 0 && end >= start) {
        const durationDays = parseInt(formData.duration, 10);
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (diffDays !== durationDays) {
          errors.duration = `Duration must match selected date range (${diffDays} days)`;
        }
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitMessage({ type: "", text: "" });
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    const userId = sessionStorage.getItem("userId") || "1";

    const formattedFromDate = formatLocalDate(fromDate);
    const formattedToDate = formatLocalDate(toDate);

    const payload = {
      company_name: formData.organizationName,
      module: formData.trainingModule,
      duration: formData.duration,
      from_date: formattedFromDate,
      to_date: formattedToDate,
      participants: formData.numParticipants,
      hr_name: formData.hrName,
      organization: orgId,
      branch: branchId,
      created_by: userId,
    };

    // Add batch if selected
    if (selectedBatch) {
      payload.batch = selectedBatch.value;
    }

    // Add course if selected
    if (selectedCourse) {
      payload.course = selectedCourse.value;
    }

    // Add department if selected
    if (selectedDepartment) {
      payload.department = selectedDepartment.value;
    }

    // Add academic year if selected
    if (selectedAcademicYear) {
      payload.academic_year = selectedAcademicYear.value;
    }

    // Add semester if selected
    if (selectedSemester) {
      payload.semester = selectedSemester.value;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      let response;
      if (placementData?.id) {
        // If placementData exists and has an ID, update the record
        response = await fetch(
          `${ApiUrl.apiurl}TrainingPlacement/Update/?id=${placementData.id}`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify(payload),
          }
        );
      } else {
        // Otherwise, create a new record
        response = await fetch(
          `${ApiUrl.apiurl}TrainingPlacement/create/`,
          {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
          }
        );
      }

     if (response.ok) {
       const data = await response.json();

       // Show popup alert
       alert(
         placementData?.id
           ? "Training updated successfully!"
           : "Training saved successfully!",
       );

       console.log(
         placementData?.id
           ? "Placement updated successfully:"
           : "Placement created successfully:",
         data,
       );

       // Clear the form after saving
       handleClear();
     } else {
       const errorData = await response.json();
       const { mappedErrors, message } = mapApiErrorsToFields(errorData);
       if (Object.keys(mappedErrors).length > 0) {
         setFieldErrors(mappedErrors);
       }
    
       console.error("Error saving placement:", errorData);
     }
    } catch (error) {
      setSubmitMessage({
        type: "danger",
        text: "Something went wrong. Please check your internet connection and try again.",
      });
      console.error("Error saving placement:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-2">
            <div className="card-body">
              <p
                className="text-center fw-bold mb-3"
                style={{ fontSize: "18px" }}
              >
                STUDENT PLACEMENTS/WORKSHOPS/SEMINARS
              </p>

              <div className="row mb-3 mt-3">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ width: "120px" }}
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    style={{ width: "120px" }}
                    onClick={() => navigate("/admin/training")}
                  >
                    Close
                  </button>
                </div>
              </div>

              {submitMessage.text && (
                <div
                  className={`alert alert-${submitMessage.type}`}
                  role="alert"
                >
                  {submitMessage.text}
                </div>
              )}

              {/* <div
                className="col-12"
                style={{
                  border: "1px solid #ccc",
                  marginTop: "10px",
                  padding: "15px",
                }}
              >
                <div className="settings-section">
                  <label className="settings-label">
                    Name of Organization/Company
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                  />
                </div>

                <div className="settings-section">
                  <label className="settings-label">Training Module*</label>
                  <input
                    type="text"
                    className="input-field"
                    name="trainingModule"
                    value={formData.trainingModule}
                    onChange={handleChange}
                  />
                </div>

                <div className="settings-section">
                  <label className="settings-label">Duration*</label>
                  <input
                    type="number"
                    className="input-field"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="input-field"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                </div>

                <div className="settings-section">
                  <label className="settings-label">From Date*</label>
                  <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    className="input-field"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select From Date"
                  />
                </div>

                <div className="settings-section">
                  <label className="settings-label">To Date*</label>
                  <DatePicker
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    className="input-field"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select To Date"
                  />
                </div>

                <div className="settings-section">
                  <label className="settings-label">Batch</label>
                  {batchesLoading ? (
                    <p>Loading batches...</p>
                  ) : (
                    <Select
                      isLoading={batchesLoading}
                      options={
                        BatchList?.map((batch) => ({
                          value: batch.id,
                          label: batch.batch_description,
                        })) || []
                      }
                      value={selectedBatch}
                      onChange={setSelectedBatch}
                      placeholder="Select Batch"
                      isClearable
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          minHeight: "38px",
                        }),
                      }}
                    />
                  )}
                </div>

                <div className="settings-section">
                  <label className="settings-label">
                    Number of Participants
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    name="numParticipants"
                    value={formData.numParticipants}
                    onChange={handleChange}
                  />
                </div>

                <div className="settings-section">
                  <label className="settings-label">HR Name</label>
                  <input
                    type="text"
                    className="input-field"
                    name="hrName"
                    value={formData.hrName}
                    onChange={handleChange}
                  />
                </div>
              </div> */}

              <Row className="justify-content-center">
                <Col
                  className="p-3"
                  xs={12}
                  md={8}
                  style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                >
                  <Form>
                    <Row className="mb-3">
                      <Col xs={12} md={6}>
                        <Form.Label>
                          Name of Organization{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Control
                          type="text"
                          className="form-control detail"
                          name="organizationName"
                          value={formData.organizationName}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Label>
                          Training Module{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                      </Col>
                      <Col md={6}>
                        <Form.Control
                          type="text"
                          className="form-control detail"
                          name="trainingModule"
                          value={formData.trainingModule}
                          onChange={handleChange}
                        />
                        {fieldErrors.trainingModule && (
                          <small className="text-danger">
                            {fieldErrors.trainingModule}
                          </small>
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Label>
                          Duration <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                      </Col>
                      <Col md={6}>
                        <Form.Control
                          type="number"
                          name="duration"
                          className="form-control detail"
                          value={formData.duration}
                          onChange={handleChange}
                          min="1"
                          placeholder="Enter days"
                        />
                        {fieldErrors.duration && (
                          <small className="text-danger">
                            {fieldErrors.duration}
                          </small>
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Label>
                          From Date <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                      </Col>
                      <Col md={6}>
                        <Form.Control
                          type="date"
                          className="form-control detail"
                          value={fromDate || ""}
                          onChange={(e) => {
                            setFromDate(e.target.value);
                            setFieldErrors((prev) => ({
                              ...prev,
                              fromDate: "",
                            }));
                          }}
                        />
                        {fieldErrors.fromDate && (
                          <small className="text-danger">
                            {fieldErrors.fromDate}
                          </small>
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Label>
                          To Date <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                      </Col>
                      <Col md={6}>
                        <Form.Control
                          type="date"
                          className="form-control detail"
                          value={toDate || ""}
                          onChange={(e) => {
                            setToDate(e.target.value);
                            setFieldErrors((prev) => ({ ...prev, toDate: "" }));
                          }}
                        />
                        {fieldErrors.toDate && (
                          <small className="text-danger">
                            {fieldErrors.toDate}
                          </small>
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Label>
                          Session <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                      </Col>
                      <Col md={6}>
                        <Select
                          className="detail"
                          options={
                            BatchList?.map((batch) => ({
                              value: batch.id,
                              label: batch.batch_description,
                            })) || []
                          }
                          value={selectedBatch}
                          onChange={handleSelectChange(
                            setSelectedBatch,
                            "batch",
                          )}
                          placeholder="Select Session"
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              minHeight: "38px",
                              borderColor: fieldErrors.batch
                                ? "#dc3545"
                                : provided.borderColor,
                            }),
                          }}
                        />
                        {fieldErrors.batch && (
                          <div
                            className="text-danger mt-1"
                            style={{ fontSize: "0.875rem" }}
                          >
                            {fieldErrors.batch}
                          </div>
                        )}
                      </Col>
                    </Row>

                    {/* Course Dropdown */}
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Label>
                          Course <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                      </Col>
                      <Col md={6}>
                        <Select
                          className="detail"
                          options={
                            CourseList?.map((course) => ({
                              value: course.id,
                              label: course.course_name,
                            })) || []
                          }
                          value={selectedCourse}
                          onChange={handleSelectChange(
                            setSelectedCourse,
                            "course",
                          )}
                          placeholder="Select Course"
                          isDisabled={!selectedBatch}
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              minHeight: "38px",
                              borderColor: fieldErrors.course
                                ? "#dc3545"
                                : provided.borderColor,
                            }),
                          }}
                        />
                        {fieldErrors.course && (
                          <div
                            className="text-danger mt-1"
                            style={{ fontSize: "0.875rem" }}
                          >
                            {fieldErrors.course}
                          </div>
                        )}
                      </Col>
                    </Row>

                    {/* Department Dropdown */}
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Label>
                          Department <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                      </Col>
                      <Col md={6}>
                        <Select
                          className="detail"
                          options={
                            DepartmentList?.map((dept) => ({
                              value: dept.id,
                              label: dept.department_description,
                            })) || []
                          }
                          value={selectedDepartment}
                          onChange={handleSelectChange(
                            setSelectedDepartment,
                            "department",
                          )}
                          placeholder="Select Department"
                          isDisabled={!selectedCourse}
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              minHeight: "38px",
                              borderColor: fieldErrors.department
                                ? "#dc3545"
                                : provided.borderColor,
                            }),
                          }}
                        />
                        {fieldErrors.department && (
                          <div
                            className="text-danger mt-1"
                            style={{ fontSize: "0.875rem" }}
                          >
                            {fieldErrors.department}
                          </div>
                        )}
                      </Col>
                    </Row>

                    {/* Academic Year Dropdown */}
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Label>
                          Academic Year <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                      </Col>
                      <Col md={6}>
                        <Select
                          className="detail"
                          options={
                            AcademicYearList?.map((year) => ({
                              value: year.id,
                              label: year.academic_year_description,
                            })) || []
                          }
                          value={selectedAcademicYear}
                          onChange={handleSelectChange(
                            setSelectedAcademicYear,
                            "academicYear",
                          )}
                          placeholder="Select Academic Year"
                          isDisabled={!selectedDepartment}
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              minHeight: "38px",
                              borderColor: fieldErrors.academicYear
                                ? "#dc3545"
                                : provided.borderColor,
                            }),
                          }}
                        />
                        {fieldErrors.academicYear && (
                          <div
                            className="text-danger mt-1"
                            style={{ fontSize: "0.875rem" }}
                          >
                            {fieldErrors.academicYear}
                          </div>
                        )}
                      </Col>
                    </Row>

                    {/* Semester Dropdown */}
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Label>Semester</Form.Label>
                      </Col>
                      <Col md={6}>
                        <Select
                          className="detail"
                          options={
                            SemesterList?.map((sem) => ({
                              value: sem.id,
                              label: sem.semester_description,
                            })) || []
                          }
                          value={selectedSemester}
                          onChange={handleSelectChange(
                            setSelectedSemester,
                            "semester",
                          )}
                          placeholder="Select Semester"
                          isDisabled={!selectedAcademicYear}
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              minHeight: "38px",
                              borderColor: fieldErrors.semester
                                ? "#dc3545"
                                : provided.borderColor,
                            }),
                          }}
                        />
                        {fieldErrors.semester && (
                          <div
                            className="text-danger mt-1"
                            style={{ fontSize: "0.875rem" }}
                          >
                            {fieldErrors.semester}
                          </div>
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Label>
                          Number of Participants{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                      </Col>
                      <Col md={6}>
                        <Form.Control
                          type="number"
                          name="numParticipants"
                          className="form-control detail"
                          value={formData.numParticipants}
                          onChange={handleChange}
                        />
                        {fieldErrors.numParticipants && (
                          <small className="text-danger">
                            {fieldErrors.numParticipants}
                          </small>
                        )}
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Label>Trainer Name</Form.Label>
                      </Col>
                      <Col md={6}>
                        <Form.Control
                          type="text"
                          className="form-control detail"
                          name="hrName"
                          value={formData.hrName}
                          onChange={handleChange}
                        />
                        {fieldErrors.hrName && (
                          <small className="text-danger">
                            {fieldErrors.hrName}
                          </small>
                        )}
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdmAttendanceEntry;



