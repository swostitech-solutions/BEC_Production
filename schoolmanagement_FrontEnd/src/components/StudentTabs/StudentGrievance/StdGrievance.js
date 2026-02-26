import React, { useEffect, useState } from "react";
import { Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";

const AdmAttendanceEntry = () => {
  const navigate = useNavigate();
  const [grievances, setGrievances] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      setError(null);

      const organizationId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
      const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");
      const studentId = sessionStorage.getItem("userId") || localStorage.getItem("userId");

      if (!organizationId || !branchId || !studentId) {
        setError("Required information not found. Please login again.");
        return;
      }

      // First, try to get student_course_id from student data
      // We need student_course_id for the listByStudent endpoint
      let studentCourseId = null;

      try {
        const studentDataUrl = `${ApiUrl.apiurl}StudentCourse/GetStudentDataBasedId/?student_id=${studentId}&branch_id=${branchId}&organization_id=${organizationId}`;
        const studentDataResponse = await fetch(studentDataUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (studentDataResponse.ok) {
          const studentDataResult = await studentDataResponse.json();
          // The response doesn't include student_course_id directly
          // We'll use the list endpoint with student_id filter instead
        }
      } catch (e) {
        console.warn("Could not fetch student data:", e);
      }

      // Use the list endpoint with student_id filter (filters by created_by)
      // This should work as the backend filters by created_by=student_id
      const apiUrl = `${ApiUrl.apiurl}Grievance/list/?organization_id=${organizationId}&branch_id=${branchId}&student_id=${studentId}`;

      console.log("Fetching grievances from:", apiUrl);

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
      console.log("Grievances response:", result);

      if (result.message === "success" && Array.isArray(result.data)) {
        setGrievances(result.data);
      } else if (result.message === "No record Found" || result.message === "No Record Found") {
        setGrievances([]);
      } else {
        console.warn("Unexpected response:", result);
        setGrievances([]);
      }
    } catch (err) {
      console.error("Error fetching grievances:", err);
      setError("An error occurred while fetching grievances: " + err.message);
    }
  };

  if (error) {
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
                  STUDENT GRIEVANCES
                </p>
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
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                STUDENT GRIEVANCES
              </p>

              {/* Buttons Row */}
              <div className="row mb-3 mt-2">
                <div className="col-12 d-flex justify-content-start gap-3">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: "150px" }}
                    onClick={() => navigate("/student/new-grievance")}
                  >
                    New Grievance
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{ width: "150px" }}
                    onClick={() => navigate("/student/dashboards")}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Grievance Table */}
              <div className="row mt-2">
                <div className="col-12">
                  <Col>
                    <div className="table-responsive">
                      <table className="table table-bordered" style={{ tableLayout: "fixed", width: "100%" }}>
                        <thead className="table-primary text-center">
                          <tr>
                            <th style={{ width: "5%" }}>Sr.No</th>
                            <th style={{ width: "12%" }}>Grievance Number</th>
                            <th style={{ width: "10%" }}>Type</th>
                            <th style={{ width: "10%" }}>Priority</th>
                            <th style={{ width: "10%" }}>Severity</th>
                            <th style={{ width: "25%" }}>Grievance</th>
                            <th style={{ width: "15%" }}>Action Taken</th>
                            <th style={{ width: "13%" }}>Action Date</th>
                          </tr>
                        </thead>
                        <tbody style={{ backgroundColor: "#ffffff" }}>
                          {grievances.length > 0 ? (
                            grievances.map((item, index) => (
                              <tr key={item.Grievance_id || item.GrievanceNumber || index} style={{ backgroundColor: "#ffffff" }}>
                                <td style={{ wordWrap: "break-word", whiteSpace: "normal" }}>{index + 1}</td>
                                <td style={{ wordWrap: "break-word", whiteSpace: "normal" }}>{item.GrievanceNumber || "N/A"}</td>
                                <td style={{ wordWrap: "break-word", whiteSpace: "normal" }}>{item.GrievanceType || "N/A"}</td>
                                <td style={{ wordWrap: "break-word", whiteSpace: "normal" }}>{item.GrievancePriority || "N/A"}</td>
                                <td style={{ wordWrap: "break-word", whiteSpace: "normal" }}>{item.GrievanceSeverity || "N/A"}</td>
                                <td style={{ wordWrap: "break-word", whiteSpace: "normal" }}>{item.details || "N/A"}</td>
                                <td style={{ wordWrap: "break-word", whiteSpace: "normal" }}>{item.ActionTaken || "Pending"}</td>
                                <td style={{ wordWrap: "break-word", whiteSpace: "normal" }}>
                                  {item.ActionTakenDateTime ? item.ActionTakenDateTime.split(' ')[0] : "Pending"}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr style={{ backgroundColor: "#ffffff" }}>
                              <td colSpan="8" className="text-center p-3">
                                No grievances found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmAttendanceEntry;
