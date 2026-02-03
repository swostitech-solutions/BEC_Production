import React, { useState, useEffect, useRef } from "react";
import { Button, Row, Col, Table, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ViewStudentReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student;
  const reportRef = useRef(null);

  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    if (student?.student_course_id) {
      fetchExamResults();
    } else {
      setLoading(false);
    }
  }, [student]);

  const fetchExamResults = async () => {
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}reportcard/get-result/${student.student_course_id}/`
      );
      const data = await response.json();

      if (data.status === "success") {
        setExamResults(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedResult(data.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching exam results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (reportRef.current) {
      const canvas = await html2canvas(reportRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -heightLeft, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${student?.full_name || "student"}-report.pdf`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!student) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card p-4">
              <div className="text-center">
                <h4>No student data available</h4>
                <Button variant="primary" onClick={() => navigate(-1)}>
                  Go Back
                </Button>
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
            <div className="card-body">
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                STUDENT EXAM REPORT
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <Button
                    variant="primary"
                    style={{ width: "150px" }}
                    onClick={handlePrint}
                    disabled={!selectedResult}
                  >
                    Print
                  </Button>
                  <Button
                    variant="success"
                    style={{ width: "150px" }}
                    onClick={handleDownloadPDF}
                    disabled={!selectedResult}
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="danger"
                    style={{ width: "150px" }}
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading exam results...</p>
                </div>
              ) : examResults.length === 0 ? (
                <div
                  className="text-center py-4 mx-3"
                  style={{
                    border: "1px dashed #ccc",
                    borderRadius: "5px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <p className="text-muted mb-0">
                    No exam results found for this student.
                  </p>
                  <p className="text-muted small">
                    Exam results will appear here once they are entered and saved.
                  </p>
                </div>
              ) : (
                <>
                  {/* Exam Results List */}
                  {examResults.length > 1 && (
                    <div className="row mt-3 mx-2 mb-3">
                      <div className="col-12">
                        <h6>Select Exam Result:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {examResults.map((result, index) => (
                            <Button
                              key={result.id}
                              variant={selectedResult?.id === result.id ? "primary" : "outline-primary"}
                              size="sm"
                              onClick={() => setSelectedResult(result)}
                            >
                              {result.semester_code || `Result ${index + 1}`} - {formatDate(result.created_at)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Report Content */}
                  {selectedResult && (
                    <div ref={reportRef} className="p-3" style={{ backgroundColor: "#fff" }}>
                      {/* Student Information Section */}
                      <div
                        style={{
                          border: "1px solid #000",
                          padding: "15px",
                          marginBottom: "20px",
                        }}
                      >
                        <h5 className="text-center mb-3" style={{ fontWeight: "bold" }}>
                          STUDENT REPORT CARD
                        </h5>
                        <Row>
                          <Col md={6}>
                            <p><strong>Name:</strong> {selectedResult.student_name || student.full_name}</p>
                            <p><strong>Enrollment No:</strong> {selectedResult.enrollment_no || student.enrollment_no}</p>
                            <p><strong>Course:</strong> {student.course_name}</p>
                            <p><strong>Section:</strong> {student.section_name}</p>
                          </Col>
                          <Col md={6}>
                            <p><strong>Semester:</strong> {selectedResult.semester_code || student.semester_code}</p>
                            <p><strong>Academic Year:</strong> {selectedResult.academic_year_code}</p>

                            <p><strong>Exam Date:</strong> {formatDate(selectedResult.created_at)}</p>
                          </Col>
                        </Row>
                      </div>

                      {/* Subject Results Table */}
                      <div style={{ marginBottom: "20px" }}>
                        <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Subject-wise Marks</h6>
                        <Table bordered size="sm">
                          <thead style={{ backgroundColor: "#f0f0f0" }}>
                            <tr>
                              <th>Subject</th>
                              <th className="text-center">Periodic Assessment</th>
                              <th className="text-center">Notebook</th>
                              <th className="text-center">Enrichment</th>
                              <th className="text-center">Theory</th>
                              <th className="text-center">Total</th>
                              <th className="text-center">Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedResult.subjects && selectedResult.subjects.length > 0 ? (
                              selectedResult.subjects.map((subject, index) => (
                                <tr key={index}>
                                  <td>{subject.subject_name}</td>
                                  <td className="text-center">{subject.periodic_assessment || "-"}</td>
                                  <td className="text-center">{subject.notebook_maintenance || "-"}</td>
                                  <td className="text-center">{subject.subject_enrichment || "-"}</td>
                                  <td className="text-center">{subject.theory_marks || "-"}</td>
                                  <td className="text-center">{subject.obtained_marks || "-"}</td>
                                  <td className="text-center"><strong>{subject.grade || "-"}</strong></td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="7" className="text-center text-muted">
                                  No subject results available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>

                      {/* Co-Scholastic Results */}
                      {selectedResult.co_scholastic && selectedResult.co_scholastic.length > 0 && (
                        <div style={{ marginBottom: "20px" }}>
                          <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Co-Scholastic Activities</h6>
                          <Table bordered size="sm">
                            <thead style={{ backgroundColor: "#f0f0f0" }}>
                              <tr>
                                <th>Activity</th>
                                <th className="text-center">Grade</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedResult.co_scholastic.map((activity, index) => (
                                <tr key={index}>
                                  <td>{activity.activity_name}</td>
                                  <td className="text-center"><strong>{activity.grade || "-"}</strong></td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      )}

                      {/* Attendance */}
                      {selectedResult.attendance && (
                        <div style={{ marginBottom: "20px" }}>
                          <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Attendance</h6>
                          <Row>
                            <Col md={4}>
                              <p><strong>Actual Attendance:</strong> {selectedResult.attendance.actual_attendance || "-"}</p>
                            </Col>
                            <Col md={4}>
                              <p><strong>Possible Attendance:</strong> {selectedResult.attendance.possible_attendance || "-"}</p>
                            </Col>
                            <Col md={4}>
                              <p><strong>Percentage:</strong> {selectedResult.attendance.attendance_percentage || "-"}%</p>
                            </Col>
                          </Row>
                        </div>
                      )}

                      {/* Summary Section */}
                      <div
                        style={{
                          border: "1px solid #000",
                          padding: "15px",
                          marginBottom: "20px",
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Result Summary</h6>
                        <Row>
                          <Col md={3}>
                            <p><strong>Total Marks:</strong> {selectedResult.total_marks || "-"}</p>
                          </Col>
                          <Col md={3}>
                            <p><strong>Obtained Marks:</strong> {selectedResult.obtained_marks || "-"}</p>
                          </Col>
                          <Col md={3}>
                            <p><strong>Percentage:</strong> {selectedResult.percentage || "-"}%</p>
                          </Col>
                          <Col md={3}>
                            <p><strong>Overall Grade:</strong> <span style={{ fontSize: "18px", fontWeight: "bold", color: "#007bff" }}>{selectedResult.overall_grade || "-"}</span></p>
                          </Col>
                        </Row>
                      </div>

                      {/* Teacher Remarks */}
                      {selectedResult.remarks && (
                        <div style={{ marginBottom: "20px" }}>
                          <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Remarks</h6>
                          {selectedResult.remarks.class_teacher_remarks && (
                            <p><strong>Class Teacher's Remarks:</strong> {selectedResult.remarks.class_teacher_remarks}</p>
                          )}
                          {selectedResult.remarks.activities && (
                            <p><strong>Activities:</strong> {selectedResult.remarks.activities}</p>
                          )}
                          {selectedResult.remarks.competitions && (
                            <p><strong>Competitions:</strong> {selectedResult.remarks.competitions}</p>
                          )}
                          {selectedResult.remarks.co_curricular_participation && (
                            <p><strong>Co-Curricular Participation:</strong> {selectedResult.remarks.co_curricular_participation}</p>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="mt-4 pt-3" style={{ borderTop: "1px solid #ccc" }}>
                        <Row>
                          <Col md={4} className="text-center">
                            <p style={{ marginTop: "40px", borderTop: "1px solid #000", paddingTop: "5px" }}>
                              Class Teacher's Signature
                            </p>
                          </Col>
                          <Col md={4} className="text-center">
                            <p style={{ marginTop: "40px", borderTop: "1px solid #000", paddingTop: "5px" }}>
                              Parent's Signature
                            </p>
                          </Col>
                          <Col md={4} className="text-center">
                            <p style={{ marginTop: "40px", borderTop: "1px solid #000", paddingTop: "5px" }}>
                              Principal's Signature
                            </p>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentReport;
