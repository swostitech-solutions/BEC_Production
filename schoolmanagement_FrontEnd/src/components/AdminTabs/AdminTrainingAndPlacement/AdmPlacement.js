import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SelectSearchParty from "../AdminSearchExpense/SelectSearchParty";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdmPlacement.css";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import { Container, Row, Col, Form } from "react-bootstrap";
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
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatLocalDate = (date) => {
    if (!(date instanceof Date)) return date;
    const offset = date.getTimezoneOffset() * 60000; // Get timezone offset in milliseconds
    return new Date(date.getTime() - offset).toISOString().split("T")[0]; // Adjust for timezone
  };

  const handleSubmit = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From Date and To Date");
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

    // Validate Duration vs Date Range
    if (formData.duration && fromDate && toDate) {
      const durationDays = parseInt(formData.duration, 10);

      // Normalize dates to midnight to ensure accurate day calculation
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(toDate);
      end.setHours(0, 0, 0, 0);

      const diffTime = end - start;
      // Calculate difference in days (inclusive of start date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays !== durationDays) {
        alert(
          `Date range mismatch! You selected a range of ${diffDays} days, but the Duration is set to ${durationDays} days. Please adjust the dates or the duration.`
        );
        return; // Stop submission
      }
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
        alert(
          placementData?.id
            ? "Placement updated successfully!"
            : "Placement created successfully!"
        );
        console.log(
          placementData?.id
            ? "Placement updated successfully:"
            : "Placement created successfully:",
          data
        );
      } else {
        const errorData = await response.json();
        alert("Error saving placement. Please try again.");
        console.error("Error saving placement:", errorData);
      }
    } catch (error) {
      alert(
        "Something went wrong. Please check your internet connection and try again."
      );
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
                      <Col md={6}>
                        <Form.Label>
                          Name of Organization/Company{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                      </Col>
                      <Col md={6}>
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
                          onChange={(e) => setFromDate(e.target.value)}
                        />
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
                          onChange={(e) => setToDate(e.target.value)}
                        />
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
                          onChange={setSelectedBatch}
                          placeholder="Select Session"
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              minHeight: "38px",
                            }),
                          }}
                        />
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
                          onChange={setSelectedCourse}
                          placeholder="Select Course"
                          isDisabled={!selectedBatch}
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              minHeight: "38px",
                            }),
                          }}
                        />
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
                          onChange={setSelectedDepartment}
                          placeholder="Select Department"
                          isDisabled={!selectedCourse}
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              minHeight: "38px",
                            }),
                          }}
                        />
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
                          onChange={setSelectedAcademicYear}
                          placeholder="Select Academic Year"
                          isDisabled={!selectedDepartment}
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              minHeight: "38px",
                            }),
                          }}
                        />
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
                          onChange={setSelectedSemester}
                          placeholder="Select Semester"
                          isDisabled={!selectedAcademicYear}
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              minHeight: "38px",
                            }),
                          }}
                        />
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



