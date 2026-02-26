import React, { useState, useEffect } from "react";
import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";

function Circular() {
  const [circulars, setCirculars] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    fetchStudentData();
  }, []);

  useEffect(() => {
    if (studentData) {
      fetchCirculars();
    }
  }, [studentData]);

  const fetchStudentData = async () => {
    try {
      const studentId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
      const organizationId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
      const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");
      const token = localStorage.getItem("accessToken");

      if (!studentId || !organizationId || !branchId) {
        setError("Required information not found. Please login again.");
        return;
      }

      const url = `${ApiUrl.apiurl}StudentCourse/GetStudentDataBasedId/?student_id=${studentId}&branch_id=${branchId}&organization_id=${organizationId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.message === "Success" && result.data) {
          setStudentData(result.data);
        } else {
          setError("Failed to fetch student data.");
        }
      } else {
        setError("Failed to fetch student data.");
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("An error occurred while fetching student data.");
    }
  };

  const fetchCirculars = async () => {
    try {
      setError(null);

      if (!studentData) {
        return;
      }

      const organizationId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
      const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");

      if (!organizationId || !branchId) {
        setError("Required information not found. Please login again.");
        return;
      }

      // Build query parameters for filtering circulars
      // The API expects JSON arrays for course_ids, department_ids, etc.
      const params = new URLSearchParams({
        organization_id: organizationId,
        branch_id: branchId,
      });

      // Add student's course, section, batch, etc. to filter circulars
      if (studentData.batch_id) {
        params.append("batch_id", studentData.batch_id.toString());
      }
      if (studentData.course_id) {
        params.append("course_ids", JSON.stringify([studentData.course_id]));
      }
      if (studentData.department_id) {
        params.append("department_ids", JSON.stringify([studentData.department_id]));
      }
      if (studentData.academic_year_id) {
        params.append("academic_year_ids", JSON.stringify([studentData.academic_year_id]));
      }
      if (studentData.semester_id) {
        params.append("semester_ids", JSON.stringify([studentData.semester_id]));
      }
      if (studentData.section_id) {
        params.append("section_ids", JSON.stringify([studentData.section_id]));
      }

      const apiUrl = `${ApiUrl.apiurl}CircularMessage/GetAllCircularMessageList/?${params.toString()}`;
      console.log("Fetching circulars from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Circulars response:", result);

      if (result.message === "Success" && Array.isArray(result.data)) {
        // Filter only active and non-cancelled circulars
        const activeCirculars = result.data.filter(
          (circular) => !circular.is_cancelled && circular.circular_status !== "C"
        );
        // Sort by date (newest first)
        activeCirculars.sort((a, b) => new Date(b.circular_date) - new Date(a.circular_date));
        setCirculars(activeCirculars);
      } else if (result.message === "No Record Found !!!" || result.message === "No Record Found!") {
        setCirculars([]);
      } else {
        setError("Failed to fetch circulars.");
      }
    } catch (err) {
      console.error("Error fetching circulars:", err);
      setError("An error occurred while fetching circulars.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (error) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card p-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4 px-3 mt-3">
                  <Button variant="danger" onClick={() => navigate("/student/dashboards")} style={{ width: "120px" }}>
                    Close
                  </Button>
                  <p
                    style={{
                      margin: 0,
                      textAlign: "center",
                      fontSize: "20px",
                      fontWeight: "700",
                      flex: 1,
                    }}
                  >
                    CIRCULARS & NOTIFICATIONS
                  </p>
                  <div style={{ width: "120px" }}></div>
                </div>
                <div className="mt-4">
                  <Alert variant="danger">{error}</Alert>
                </div>
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
              <div className="d-flex justify-content-between align-items-center mb-4 px-3 mt-3">
                <Button variant="danger" onClick={() => navigate("/student/dashboards")} style={{ width: "120px" }}>
                  Close
                </Button>
                <p
                  style={{
                    margin: 0,
                    textAlign: "center",
                    fontSize: "20px",
                    fontWeight: "700",
                    flex: 1,
                  }}
                >
                  CIRCULARS & NOTIFICATIONS
                </p>
                <div style={{ width: "120px" }}></div>
              </div>

              <div className="col-12 container-fluid mt-4">
                {circulars.length === 0 ? (
                  <Alert variant="white" className="text-center" style={{ backgroundColor: "#ffffff", border: "1px solid #dee2e6" }}>
                    No circulars or notifications found.
                  </Alert>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-primary">
                        <tr>
                          <th style={{ width: "15%" }}>Date</th>
                          <th style={{ width: "20%" }}>Initiated By</th>
                          <th>Details</th>
                          <th style={{ width: "10%" }}>File</th>
                        </tr>
                      </thead>
                      <tbody>
                        {circulars.map((circular, index) => (
                          <tr key={circular.circular_id || index}>
                            <td>{formatDate(circular.circular_date)}</td>
                            <td>{circular.InitiatedBy || "N/A"}</td>
                            <td>
                              <div
                                style={{
                                  maxHeight: "100px",
                                  overflowY: "auto",
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                {circular.circular_details || "N/A"}
                              </div>
                            </td>
                            <td className="text-center">
                              {circular.circular_file ? (
                                <a
                                  href={circular.circular_file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary"
                                  download
                                >
                                  <i className="fas fa-download"></i> Download
                                </a>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Circular;