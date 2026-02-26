import React, { useState, useEffect } from "react";
import "./StdAssignment.css";
import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useStudentDetails from "../../hooks/useStudentDetails";
import useStudentAssignments from "../../hooks/useStudentAssignments";

function Assignment() {
  // Get student ID from sessionStorage
  const studentId = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/student/dashboards");
  };

  // Fetch student details
  const { studentDetails, error: studentDetailsError } =
    useStudentDetails(studentId);

  // Extract student information for assignment filters
  const studentBasicDetails = studentDetails?.student_basic_details;
  const courseId = studentBasicDetails?.course_id;
  const sectionId = studentBasicDetails?.section_id;
  const semesterId = studentBasicDetails?.semester_id;

  // Fetch assignments using student's course, section, and semester
  const {
    assignments = [],
    error: assignmentsError,
    refetch: refetchAssignments,
  } = useStudentAssignments({
    course_id: courseId,
    section_id: sectionId,
    semester_id: semesterId,
    enabled: !!(courseId && sectionId), // Only fetch when we have required filters
  });

  // Log for debugging
  useEffect(() => {
    if (studentDetails) {
      console.log("📚 Student Details:", studentDetails);
      console.log("📋 Assignment Filters:", {
        courseId,
        sectionId,
        semesterId,
      });
    }
  }, [studentDetails, courseId, sectionId, semesterId]);

  useEffect(() => {
    if (assignments && assignments.length > 0) {
      console.log("✅ Assignments loaded:", assignments);
    }
  }, [assignments]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              {/* Close Button */}
              <div className="mb-3">
                <Button variant="danger" onClick={handleClose} style={{ width: "120px", borderRadius: "6px" }}>
                  Close
                </Button>
              </div>
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                ASSIGNMENT SUMMARY
              </p>

              {/* Error Alert for Student Details */}
              {studentDetailsError && (
                <Alert
                  variant="warning"
                  className="mt-3"
                  style={{ backgroundColor: "#ffffff", border: "1px solid #dee2e6" }}
                >
                  <Alert.Heading>Warning</Alert.Heading>
                  <p className="mb-0">{studentDetailsError}</p>
                </Alert>
              )}

              {/* Error Alert for Assignments */}
              {assignmentsError && (
                <Alert
                  variant="warning"
                  className="mt-3"
                  style={{ backgroundColor: "#ffffff", border: "1px solid #dee2e6" }}
                >
                  {assignmentsError}
                </Alert>
              )}

              {/* Show assignments table */}
              <div className="col-12 container-fluid mt-4">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Date</th>
                        <th>Subject</th>
                        <th>Period</th>
                        <th>Professor</th>
                        <th>Assignment Details</th>
                        <th>Attachment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments && assignments.length > 0 ? (
                        assignments.map((assignment, index) => (
                          <tr key={assignment.id || index}>
                            <td>{index + 1}</td>
                            <td>
                              {formatDate(assignment.assignment_date)}
                            </td>
                            <td>
                              {assignment.subjectName || "-"}
                            </td>
                            <td>
                              {assignment.lecture_name || "-"}
                            </td>
                            <td>
                              {assignment.professor_name || "-"}
                            </td>
                            <td>
                              {assignment.assignment_details || "-"}
                            </td>
                            <td>
                              {assignment.assignment_file ? (
                                <a
                                  href={assignment.assignment_file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "#007bff",
                                    textDecoration: "underline",
                                  }}
                                >
                                  Download
                                </a>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">
                            {assignmentsError
                              ? "No Record Found"
                              : "No assignments found."}
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
    </div>
  );
}

export default Assignment;
