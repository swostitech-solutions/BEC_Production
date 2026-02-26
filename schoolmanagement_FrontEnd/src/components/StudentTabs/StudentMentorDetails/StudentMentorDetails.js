import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Card, Row, Form } from "react-bootstrap";
import { ApiUrl } from "../../../ApiUrl";

const MentorDetail = ({ onClose }) => {
  const navigate = useNavigate();
  const [mentorDetails, setMentorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch mentor details
  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get required IDs from storage
        const studentId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
        const organizationId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
        const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");
        const academicYearId = sessionStorage.getItem("academicSessionId") || localStorage.getItem("academicSessionId") || "1";
        const token = localStorage.getItem("accessToken");

        if (!studentId || !organizationId || !branchId) {
          setError("Required information not found. Please login again.");
          setLoading(false);
          return;
        }

        // Build query parameters for mentor search
        const queryParams = new URLSearchParams({
          organization_id: organizationId,
          branch_id: branchId,
          academic_year_id: academicYearId,
          student_id: studentId,
        });

        const apiUrl = `${ApiUrl.apiurl}Mentor/mentorsWithStudents/?${queryParams.toString()}`;
        console.log("Fetching mentor details from:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Try to parse error response for more details
          let errorMessage = "Unable to fetch mentor details. Please try again later.";

          try {
            const errorData = await response.json();
            // Check if error response contains validation errors
            if (errorData.message && typeof errorData.message === 'object') {
              // Handle validation errors (400 Bad Request)
              errorMessage = "Student information is incomplete. Please contact administration.";
            } else if (errorData.error || errorData.message) {
              // Don't show technical database errors to users
              const technicalError = typeof errorData.error === 'string' ? errorData.error :
                (typeof errorData.message === 'string' ? errorData.message : '');
              if (technicalError.includes("no such table") ||
                technicalError.includes("database") ||
                technicalError.includes("table")) {
                errorMessage = "No record found.";
              } else if (technicalError.includes("permission") ||
                technicalError.includes("unauthorized")) {
                errorMessage = "Authentication failed. Please login again.";
              }
            }
          } catch (parseError) {
            // If JSON parsing fails, use default messages based on status code
            console.error("Error parsing error response:", parseError);
          }

          // Handle different HTTP status codes with user-friendly messages
          if (response.status === 400) {
            // Validation errors - already handled above, but ensure user-friendly message
            if (errorMessage === "Unable to fetch mentor details. Please try again later.") {
              errorMessage = "Student information is incomplete. Please contact administration.";
            }
          } else if (response.status === 404) {
            errorMessage = "No record found.";
          } else if (response.status === 401 || response.status === 403) {
            errorMessage = "Authentication failed. Please login again.";
          } else if (response.status >= 500) {
            // Use the parsed error message or default to server error
            if (errorMessage === "Unable to fetch mentor details. Please try again later.") {
              errorMessage = "Server error. Please try again later.";
            }
          }

          setError(errorMessage);
          setLoading(false);
          return;
        }

        const result = await response.json();
        console.log("Mentor details response:", result);

        if (result.message === "success" && Array.isArray(result.data) && result.data.length > 0) {
          // Find the mentor that has this student assigned, or take the first one
          let mentorData = result.data.find(mentor =>
            mentor.assigned_students &&
            mentor.assigned_students.some(student => student.student_id == studentId)
          ) || result.data[0];

          // Extract only the three required fields
          const mentor = {
            mentor_name: mentorData.mentor_name || "N/A",
            mentor_email: mentorData.mentor_email || "N/A",
            mentor_phone: mentorData.mentor_phone || "N/A",
          };
          setMentorDetails(mentor);
        } else if (result.message === "No Record Found") {
          setError("No record found.");
        } else {
          setError("No record found.");
        }
      } catch (err) {
        console.error("Error fetching mentor details:", err);
        // Show user-friendly error message without technical details
        if (err.message && err.message.includes("HTTP error")) {
          setError("Unable to fetch mentor details. Please try again later.");
        } else if (err.message && err.message.includes("Failed to fetch")) {
          setError("Network error. Please check your connection and try again.");
        } else {
          setError("Unable to fetch mentor details. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMentorDetails();
  }, []);

  // Helper function to properly format mentor name with title
  const formatMentorName = (name) => {
    if (!name || name === "N/A") return "N/A";

    // Common title prefixes and their proper format
    const titleMap = {
      'mr': 'Mr.',
      'ms': 'Ms.',
      'mrs': 'Mrs.',
      'miss': 'Miss',
      'dr': 'Dr.',
      'prof': 'Prof.',
      'professor': 'Prof.',
    };

    // Split the name by spaces
    const parts = name.trim().split(/\s+/);

    if (parts.length === 0) return "N/A";

    // Check if first part is a title
    const firstPartLower = parts[0].toLowerCase().replace(/\./g, '');

    if (titleMap[firstPartLower]) {
      // Found a title, format it properly
      const properTitle = titleMap[firstPartLower];
      const restOfName = parts.slice(1).map(part =>
        // Capitalize first letter of each name part
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      ).join(' ');

      return restOfName ? `${properTitle} ${restOfName}` : properTitle;
    } else {
      // No title found, just capitalize each part properly
      return parts.map(part =>
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      ).join(' ');
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/student/dashboards");
    }
  };


  if (error || !mentorDetails) {
    return (
      <div className="container-fluid mt-3">
        <div className="row mx-0">
          <div className="col-12">
            <div style={{ backgroundColor: "#e8f4fc", padding: "20px", borderRadius: "12px", display: "inline-block", width: "100%" }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ width: "120px", borderRadius: "6px" }}
                  onClick={handleClose}
                >
                  Close
                </button>
                <p
                  style={{
                    marginBottom: "0px",
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#333",
                    flex: 1,
                  }}
                >
                  MENTOR DETAILS
                </p>
                <div style={{ width: "120px" }}></div>
              </div>
              <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>

                <div className="row mt-3">
                  <Col md={12}>
                    <div className="row mt-3">
                      <Col md={12}>
                        <Form.Group className="mb-3 row">
                          <Form.Label className="col-sm-3 col-form-label">
                            <strong>Mentor Name:</strong>
                          </Form.Label>
                          <div className="col-sm-9">
                            <Form.Control
                              value="No mentor found"
                              disabled
                              readOnly
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-3 row">
                          <Form.Label className="col-sm-3 col-form-label">
                            <strong>Mentor Email:</strong>
                          </Form.Label>
                          <div className="col-sm-9">
                            <Form.Control
                              value="N/A"
                              disabled
                              readOnly
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-3 row">
                          <Form.Label className="col-sm-3 col-form-label">
                            <strong>Mentor Phone:</strong>
                          </Form.Label>
                          <div className="col-sm-9">
                            <Form.Control
                              value="N/A"
                              disabled
                              readOnly
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </div>
                  </Col>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-3">
      <div className="row mx-0">
        <div className="col-12">
          <div style={{ backgroundColor: "#e8f4fc", padding: "20px", borderRadius: "12px", display: "inline-block", width: "100%" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <button
                type="button"
                className="btn btn-danger"
                style={{ width: "120px", borderRadius: "6px" }}
                onClick={handleClose}
              >
                Close
              </button>
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#333",
                  flex: 1,
                }}
              >
                MENTOR DETAILS
              </p>
              <div style={{ width: "120px" }}></div>
            </div>
            <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>

              <div className="row mt-3">
                <Col md={12}>
                  <div className="row mt-3">
                    <Col md={12}>
                      <Form.Group className="mb-3 row">
                        <Form.Label className="col-sm-3 col-form-label">
                          <strong>Mentor Name:</strong>
                        </Form.Label>
                        <div className="col-sm-9">
                          <Form.Control
                            value={formatMentorName(mentorDetails.mentor_name)}
                            disabled
                            readOnly
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3 row">
                        <Form.Label className="col-sm-3 col-form-label">
                          <strong>Mentor Email:</strong>
                        </Form.Label>
                        <div className="col-sm-9">
                          <Form.Control
                            value={mentorDetails.mentor_email || "N/A"}
                            disabled
                            readOnly
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3 row">
                        <Form.Label className="col-sm-3 col-form-label">
                          <strong>Mentor Phone:</strong>
                        </Form.Label>
                        <div className="col-sm-9">
                          <Form.Control
                            value={mentorDetails.mentor_phone || "N/A"}
                            disabled
                            readOnly
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </div>
                </Col>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDetail;
