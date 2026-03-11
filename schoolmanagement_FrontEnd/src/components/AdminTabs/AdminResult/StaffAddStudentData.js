import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Table } from "react-bootstrap";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import "./StaffAddStudentData.css";
import { ApiUrl } from "../../../ApiUrl";

const AddStudentExamData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student;
  const [isSaving, setIsSaving] = useState(false);

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingReport, setExistingReport] = useState(null);

  // Fetch existing report card data
  useEffect(() => {
    const fetchExistingData = async () => {
      if (!student?.student_course_id) {
        return;
      }

      setExistingReport(null);

      try {
        // Fetch existing PDF reports for this student/course
        const response = await fetch(
          `${ApiUrl.apiurl}reportcard/get-reports/${student.student_course_id}/`
        );
        const data = await response.json();

        if (data.status === "success" && data.data && data.data.length > 0) {
          // Get the most recent report
          setExistingReport(data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching existing data:", error);
      }
    };

    fetchExistingData();
  }, [student?.student_course_id]);

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Save/Upload PDF
  const handleSave = async () => {
    if (!student?.student_course_id) {
      alert("No student data available. Please select a student first.");
      return;
    }

    if (!selectedFile) {
      alert("Please select a document to upload.");
      return;
    }

    setIsSaving(true);

    try {
      const academicYearId = localStorage.getItem("academicSessionId");
      const createdBy = sessionStorage.getItem("userId");

      const formData = new FormData();
      formData.append("student_course_id", student.student_course_id);
      formData.append("academic_year_id", academicYearId);
      formData.append("semester_id", student.semester_id);
      formData.append("created_by", createdBy);
      formData.append("pdf_file", selectedFile);
      formData.append("remarks", "Uploaded via Staff/Admin Panel");

      const response = await fetch(`${ApiUrl.apiurl}reportcard/save-pdf/`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        alert("Document uploaded successfully!");
        navigate(-1); // Go back
      } else {
        alert(`Error uploading document: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("An error occurred while uploading the document.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

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
                STUDENT DOCUMENT UPLOAD
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Uploading..." : "Upload"}
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

              {/* Student Information Section */}
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
                        Semester: <span>{student?.semester_name || "-"}</span>
                      </p>
                      <p>
                        Academic Year:{" "}
                        <span>{student?.academic_year_code || "-"}</span>
                      </p>

                      <p>
                        Course: <span>{student?.course_name || "-"}</span>
                      </p>
                      <p>
                        Section: <span>{student?.section_name || "-"}</span>
                      </p>
                      <p>
                        Admission No:{" "}
                        <span>{student?.admission_no || "-"}</span>
                      </p>
                    </Col>
                    <Col>
                      <p>
                        Name: <span>{student?.full_name || "-"}</span>
                      </p>
                      <p>
                        Date of Birth:{" "}
                        <span>{student?.date_of_birth || "-"}</span>
                      </p>
                      <p>
                        Mother's Name:{" "}
                        <span>{student?.mother_name || "-"}</span>
                      </p>
                      <p>
                        Father/Guardian's Name:{" "}
                        <span>{student?.father_name || "-"}</span>
                      </p>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="row mt-3 mx-2">
                <div className="col-12">
                  <div
                    className="custom-section-box p-3"
                    style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                  >
                    <h5 className="mb-3">Upload Document</h5>
                    <Form.Group controlId="formFile" className="mb-3">
                      <Form.Label>Select Document</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={handleFileChange}
                      />
                    </Form.Group>

                    {existingReport && (
                      <div className="mt-3">
                        <p className="text-muted">
                          <strong>Last Uploaded Document:</strong>{" "}
                          <a
                            href={`${ApiUrl.apiurl.replace(/\/api\/$/, "")}${
                              existingReport.pdf_url
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary"
                          >
                            View Document
                          </a>
                          <span className="ms-2 small text-muted">
                            (
                            {new Date(
                              existingReport.generated_date
                            ).toLocaleDateString()}
                            )
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentExamData;