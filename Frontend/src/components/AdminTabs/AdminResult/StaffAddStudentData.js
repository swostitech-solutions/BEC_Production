import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Table } from "react-bootstrap";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import "./StaffAddStudentData.css";
import { ApiUrl } from "../../../ApiUrl";

const gradeOptions = [
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "B1", label: "B1" },
  { value: "B2", label: "B2" },
  { value: "C1", label: "C1" },
  { value: "C2", label: "C2" },
  { value: "D", label: "D" },
  { value: "E", label: "E" },
];

// Default values - defined outside component to avoid stale closure issues
const defaultSubjects = [
  { subject_name: "English", periodic_assessment: "", notebook_maintenance: "", subject_enrichment: "", theory_marks: "", max_marks: 100, obtained_marks: "", grade: "" },
  { subject_name: "Hindi", periodic_assessment: "", notebook_maintenance: "", subject_enrichment: "", theory_marks: "", max_marks: 100, obtained_marks: "", grade: "" },
  { subject_name: "Maths", periodic_assessment: "", notebook_maintenance: "", subject_enrichment: "", theory_marks: "", max_marks: 100, obtained_marks: "", grade: "" },
  { subject_name: "EVS", periodic_assessment: "", notebook_maintenance: "", subject_enrichment: "", theory_marks: "", max_marks: 100, obtained_marks: "", grade: "" },
];

const defaultCoScholastic = [
  { activity_name: "General Knowledge", grade: "" },
  { activity_name: "Computer", grade: "" },
];

const defaultAttendance = {
  actual_attendance: "",
  possible_attendance: "",
};

const defaultRemarks = {
  class_teacher_remarks: "",
  activities: "",
  competitions: "",
  co_curricular_participation: "",
  holiday_homework: "",
};

const defaultHealthStatus = {
  height: "",
  weight: "",
  as_on_date: "",
};

// Helpers to avoid accidental mutation of defaults (deep-ish clone)
const getDefaultSubjects = () => defaultSubjects.map((s) => ({ ...s }));
const getDefaultCoScholastic = () => defaultCoScholastic.map((a) => ({ ...a }));

const AddStudentExamData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student;
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  // State for subject marks
  const [subjects, setSubjects] = useState(getDefaultSubjects);

  // State for co-scholastic activities
  const [coScholastic, setCoScholastic] = useState(getDefaultCoScholastic);

  // State for attendance
  const [attendance, setAttendance] = useState({ ...defaultAttendance });

  // State for remarks
  const [remarks, setRemarks] = useState({ ...defaultRemarks });

  // State for health status
  const [healthStatus, setHealthStatus] = useState({ ...defaultHealthStatus });

  // Fetch existing exam data on component mount
  useEffect(() => {
    const fetchExistingData = async () => {
      if (!student?.student_course_id) {
        setIsLoading(false);
        return;
      }

      // Reset to defaults first before fetching
      setIsLoading(true);
      setSubjects(getDefaultSubjects());
      setCoScholastic(getDefaultCoScholastic());
      setAttendance({ ...defaultAttendance });
      setRemarks({ ...defaultRemarks });
      setHealthStatus({ ...defaultHealthStatus });
      setIsEditMode(false);

      try {
        const response = await fetch(
          `${ApiUrl.apiurl}reportcard/get-result/${student.student_course_id}/?semester_id=${student.semester_id}`
        );
        const data = await response.json();

        if (data.status === "success" && data.count > 0) {
          const existingData = data.data[0]; // Get the most recent result
          setIsEditMode(true);

          // Populate subjects - use defaultSubjects instead of state
          if (existingData.subjects && existingData.subjects.length > 0) {
            const populatedSubjects = defaultSubjects.map((defaultSubject) => {
              const matchingSubject = existingData.subjects.find(
                (s) => s.subject_name === defaultSubject.subject_name
              );
              if (matchingSubject) {
                return {
                  subject_name: matchingSubject.subject_name,
                  periodic_assessment: matchingSubject.periodic_assessment || "",
                  notebook_maintenance: matchingSubject.notebook_maintenance || "",
                  subject_enrichment: matchingSubject.subject_enrichment || "",
                  theory_marks: matchingSubject.theory_marks || "",
                  max_marks: parseFloat(matchingSubject.max_marks) || 100,
                  obtained_marks: matchingSubject.obtained_marks || "",
                  grade: matchingSubject.grade || "",
                };
              }
              return { ...defaultSubject };
            });
            setSubjects(populatedSubjects);
          }

          // Populate co-scholastic activities - use defaultCoScholastic instead of state
          if (existingData.co_scholastic && existingData.co_scholastic.length > 0) {
            const populatedCoScholastic = defaultCoScholastic.map((defaultActivity) => {
              const matchingActivity = existingData.co_scholastic.find(
                (a) => a.activity_name === defaultActivity.activity_name
              );
              if (matchingActivity) {
                return {
                  activity_name: matchingActivity.activity_name,
                  grade: matchingActivity.grade || "",
                };
              }
              return { ...defaultActivity };
            });
            setCoScholastic(populatedCoScholastic);
          }

          // Populate attendance
          if (existingData.attendance) {
            setAttendance({
              actual_attendance: existingData.attendance.actual_attendance?.toString() || "",
              possible_attendance: existingData.attendance.possible_attendance?.toString() || "",
            });
          }

          // Populate remarks
          if (existingData.remarks) {
            setRemarks({
              class_teacher_remarks: existingData.remarks.class_teacher_remarks || "",
              activities: existingData.remarks.activities || "",
              competitions: existingData.remarks.competitions || "",
              co_curricular_participation: existingData.remarks.co_curricular_participation || "",
              holiday_homework: existingData.remarks.holiday_homework || "",
            });
          }

          // Populate health status
          if (existingData.health_status) {
            setHealthStatus({
              height: existingData.health_status.height || "",
              weight: existingData.health_status.weight || "",
              as_on_date: existingData.health_status.as_on_date || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching existing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingData();
  }, [student?.student_course_id, student?.semester_id]);

  // Handle subject input change
  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = subjects.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    
    // Auto-calculate total and grade
    if (["periodic_assessment", "notebook_maintenance", "subject_enrichment", "theory_marks"].includes(field)) {
      const pa = parseFloat(updatedSubjects[index].periodic_assessment) || 0;
      const nm = parseFloat(updatedSubjects[index].notebook_maintenance) || 0;
      const se = parseFloat(updatedSubjects[index].subject_enrichment) || 0;
      const tm = parseFloat(updatedSubjects[index].theory_marks) || 0;
      const total = pa + nm + se + tm;
      updatedSubjects[index].obtained_marks = total.toFixed(2);
      updatedSubjects[index].grade = calculateGrade(total);
    }
    
    setSubjects(updatedSubjects);
  };

  // Calculate grade based on marks
  const calculateGrade = (marks) => {
    if (marks >= 91) return "A1";
    if (marks >= 81) return "A2";
    if (marks >= 71) return "B1";
    if (marks >= 61) return "B2";
    if (marks >= 51) return "C1";
    if (marks >= 41) return "C2";
    if (marks >= 33) return "D";
    return "E";
  };

  // Handle co-scholastic grade change
  const handleCoScholasticChange = (index, grade) => {
    setCoScholastic((prev) =>
      prev.map((a, i) => (i === index ? { ...a, grade } : a))
    );
  };

  // Save exam data to backend
  const handleSave = async () => {
    if (!student?.student_course_id) {
      alert("No student data available. Please select a student first.");
      return;
    }

    setIsSaving(true);

    try {
      const academicYearId = localStorage.getItem("academicSessionId");
      const createdBy = sessionStorage.getItem("userId");

      const requestData = {
        student_course_id: student.student_course_id,
        academic_year_id: academicYearId,
        semester_id: student.semester_id,
        created_by: createdBy,
        subjects: subjects,
        co_scholastic: coScholastic,
        attendance: attendance,
        remarks: remarks,
        health_status: healthStatus,
      };

      const response = await fetch(`${ApiUrl.apiurl}reportcard/save-result/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (data.status === "success") {
        alert(isEditMode ? "Exam result updated successfully!" : "Exam result saved successfully!");
        navigate(-1);
      } else {
        alert(`Error saving exam result: ${data.message}`);
      }
    } catch (error) {
      console.error("Error saving exam result:", error);
      alert("An error occurred while saving the exam result.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    setSubjects(getDefaultSubjects());
    setCoScholastic(getDefaultCoScholastic());
    setAttendance({ ...defaultAttendance });
    setRemarks({ ...defaultRemarks });
    setHealthStatus({ ...defaultHealthStatus });
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card p-0">
              <div className="card-body exam-data-container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading exam data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body exam-data-container">
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                ClASS EXAM RESULT {isEditMode && <span className="badge bg-warning text-dark ms-2">Editing Existing Data</span>}
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12">
                  <button
                    type="button"
                    className={`btn ${isEditMode ? "btn-warning" : "btn-primary"} me-2`}
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : isEditMode ? "Update" : "Save"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Student Information Section with Border */}
              <div className="row mt-3 mx-2">
                <div
                  className="student-info-box custom-section-box"
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "20px",
                  }}
                >
                  <Row>
                    <Col>
                      <p>
                        Term: <span><strong>{student?.semester_name || "-"}</strong></span>
                      </p>
                      <p>
                        Admission No: <span>{student?.admission_no || "-"}</span>
                      </p>
                      <p>
                        Course: <span>{student?.course_name || "-"}</span>
                      </p>
                      <p>
                        Name: <span><strong>{student?.full_name || "-"}</strong></span>
                      </p>
                      <p>
                        Mother's Name: <span>{student?.mother_name || "-"}</span>
                      </p>
                    </Col>
                    <Col>
                      <p>
                        Session: <span>{student?.academic_year_code || "-"}</span>
                      </p>
                      <p>
                        Section: <span>{student?.section_name || "-"}</span>
                      </p>
                      <p>
                        Date of Birth: <span>{student?.date_of_birth || "-"}</span>
                      </p>
                      <p>
                        Father/Guardian's Name: <span>{student?.father_name || "-"}</span>
                      </p>
                    </Col>
                  </Row>

                  {/* Health Status Section - Below Student Information */}
                  <div
                    className="health-status-box"
                    style={{ marginTop: "20px" }}
                  >
                    <Table bordered={false} className="health-status-table">
                      <tbody>
                        <tr>
                          <td className="table-header">Health Status:</td>
                          <td>
                            <div className="input-container">
                              <label className="input-label">Height</label>
                              <Form.Control
                                className="small-input"
                                type="text"
                                value={healthStatus.height}
                                onChange={(e) => setHealthStatus({ ...healthStatus, height: e.target.value })}
                              />
                              <span>cms</span>
                            </div>
                          </td>
                          <td>
                            <div className="input-container">
                              <label className="input-label">Weight</label>
                              <Form.Control
                                className="small-input"
                                type="text"
                                value={healthStatus.weight}
                                onChange={(e) => setHealthStatus({ ...healthStatus, weight: e.target.value })}
                              />
                              <span>kgs</span>
                            </div>
                          </td>
                          <td>
                            <div className="date-input-container">
                              <label className="input-label">As on Date</label>
                              <Form.Control
                                type="date"
                                value={healthStatus.as_on_date}
                                onChange={(e) => setHealthStatus({ ...healthStatus, as_on_date: e.target.value })}
                                style={{ minWidth: "180px", fontSize: "14px" }}
                              />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>

              {/* Marks Table - Added below Health Status Table */}
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered ">
                    <thead>
                      <tr>
                        <th>Main Subjects</th>
                        <th>Periodic Assessment (10)</th>
                        <th>Notebook Maintenance (5)</th>
                        <th>Subject Enrichment (5)</th>
                        <th>Half Yearly (80)</th>
                        <th>Total Mark</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              border: "1px solid #000",
                              textAlign: "center",
                            }}
                          >
                            {subject.subject_name}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              textAlign: "center",
                            }}
                          >
                            <Form.Control
                              type="number"
                              placeholder="10.00"
                              value={subject.periodic_assessment}
                              onChange={(e) => handleSubjectChange(index, "periodic_assessment", e.target.value)}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              textAlign: "center",
                            }}
                          >
                            <Form.Control
                              type="number"
                              placeholder="5.00"
                              value={subject.notebook_maintenance}
                              onChange={(e) => handleSubjectChange(index, "notebook_maintenance", e.target.value)}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              textAlign: "center",
                            }}
                          >
                            <Form.Control
                              type="number"
                              placeholder="5.00"
                              value={subject.subject_enrichment}
                              onChange={(e) => handleSubjectChange(index, "subject_enrichment", e.target.value)}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              textAlign: "center",
                            }}
                          >
                            <Form.Control
                              type="number"
                              placeholder="80.00"
                              value={subject.theory_marks}
                              onChange={(e) => handleSubjectChange(index, "theory_marks", e.target.value)}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              textAlign: "center",
                            }}
                          >
                            <Form.Control
                              type="number"
                              placeholder="100.00"
                              value={subject.obtained_marks}
                              readOnly
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              textAlign: "center",
                            }}
                          >
                            <Form.Control
                              type="text"
                              placeholder="Grade"
                              value={subject.grade}
                              readOnly
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Co-Scholastic Activities Table */}
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Co-Scholastic Activities</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coScholastic.map((activity, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              border: "1px solid #000",
                              textAlign: "center",
                            }}
                          >
                            {activity.activity_name}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              textAlign: "center",
                            }}
                          >
                            <Select
                              options={gradeOptions}
                              className="grade-select"
                              classNamePrefix="react-select"
                              value={gradeOptions.find(opt => opt.value === (activity.grade || "").trim()) || null}
                              onChange={(selected) => handleCoScholasticChange(index, selected?.value || "")}
                              placeholder="Select"
                              styles={{
                                container: (provided) => ({
                                  ...provided,
                                  width: "140px",
                                }),
                                control: (provided) => ({
                                  ...provided,
                                  minHeight: "40px",
                                  height: "40px",
                                  fontSize: "0.95rem",
                                }),
                                valueContainer: (provided) => ({
                                  ...provided,
                                  height: "40px",
                                  padding: "0 10px",
                                }),
                                indicatorSeparator: () => ({
                                  display: "none",
                                }),
                                dropdownIndicator: (provided) => ({
                                  ...provided,
                                  padding: "0 10px",
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  zIndex: 9999,
                                }),
                                menuPortal: (provided) => ({
                                  ...provided,
                                  zIndex: 9999,
                                }),
                              }}
                              menuPortalTarget={document.body}
                              menuShouldScrollIntoView={false}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* New Box with Three Input Fields */}
              <div className="three-input-box custom-section-box mt-3 mx-1">
                <h4>Term-1-Attendance</h4>
                <Row>
                  <Col md={4}>
                    <Form.Group controlId="input1">
                      <Form.Label>ACTUAL ATTENDANCE</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter a value"
                        value={attendance.actual_attendance}
                        onChange={(e) => setAttendance({ ...attendance, actual_attendance: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="input2">
                      <Form.Label>POSSIBLE ATTENDANCE</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter a value"
                        value={attendance.possible_attendance}
                        onChange={(e) => setAttendance({ ...attendance, possible_attendance: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="input3">
                      <Form.Label>HOLIDAY HOMEWORK</Form.Label>
                      <Select
                        options={[
                          { value: "Submitted", label: "Submitted" },
                          { value: "Not Submitted", label: "Not Submitted" },
                          { value: "Partial", label: "Partial" },
                        ]}
                        placeholder="Select an option"
                        classNamePrefix="react-select"
                        value={remarks.holiday_homework ? { value: remarks.holiday_homework, label: remarks.holiday_homework } : null}
                        onChange={(selected) => setRemarks({ ...remarks, holiday_homework: selected?.value || "" })}
                        styles={{
                          container: (provided) => ({
                            ...provided,
                            minWidth: "150px",
                          }),
                          control: (provided) => ({
                            ...provided,
                            minHeight: "30px",
                            height: "36px",
                          }),
                          valueContainer: (provided) => ({
                            ...provided,
                            height: "30px",
                            padding: "0 6px",
                          }),
                          indicatorSeparator: () => ({
                            display: "none",
                          }),
                          dropdownIndicator: (provided) => ({
                            ...provided,
                            padding: "0 8px",
                          }),
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Additional Details Section */}
              <div className="additional-details-box custom-section-box mt-3 mx-1">
                <Form.Group
                  controlId="coCurricularField"
                  className="mb-3 px-3"
                  style={{ marginTop: "20px", margin: " 20px" }}
                >
                  <Form.Label>
                    RECORD OF PARTICIPATION IN CO-CURRICULAR ACTIVITIES
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter a value"
                    className="medium-input"
                    value={remarks.co_curricular_participation}
                    onChange={(e) => setRemarks({ ...remarks, co_curricular_participation: e.target.value })}
                  />
                </Form.Group>

                {/* New Fields */}
                <Form.Group
                  controlId="classTeacherRemarks"
                  className="mb-3 px-3"
                  style={{ marginTop: "20px", margin: " 20px" }}
                >
                  <Form.Label>LECTURE REMARKS</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter a value"
                    className="medium-input"
                    value={remarks.class_teacher_remarks}
                    onChange={(e) => setRemarks({ ...remarks, class_teacher_remarks: e.target.value })}
                  />
                </Form.Group>

                <Form.Group
                  controlId="activitiesField"
                  className="mb-3 px-3"
                  style={{ marginTop: "10px", margin: " 20px" }}
                >
                  <Form.Label>ACTIVITIES</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter a value"
                    className="medium-input"
                    value={remarks.activities}
                    onChange={(e) => setRemarks({ ...remarks, activities: e.target.value })}
                  />
                </Form.Group>

                <Form.Group
                  controlId="competitionField"
                  className="mb-3 px-3"
                  style={{ marginTop: "10px", margin: " 20px" }}
                >
                  <Form.Label>COMPETITION</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter a value"
                    className="medium-input"
                    value={remarks.competitions}
                    onChange={(e) => setRemarks({ ...remarks, competitions: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentExamData;