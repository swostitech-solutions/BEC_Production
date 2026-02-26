import React, { useState, useEffect } from "react";
import { Button, Table, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import api from "../../../utils/api";

const ViewStudentReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student;

  const [uploadedReports, setUploadedReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (student?.id && student?.semester_id) {
      fetchUploadedReports();
    } else {
      setLoading(false);
    }
  }, [student]);

  const fetchUploadedReports = async () => {
    try {
      const response = await api.get(`reportcard/get-reports-by-student/${student.id}/`);
      if (response.data.status === "success" && Array.isArray(response.data.data)) {
        // Filter reports by the selected semester
        const filteredReports = response.data.data.filter(
          report => report.semester_id === student.semester_id
        );
        setUploadedReports(filteredReports);
      } else {
        setUploadedReports([]);
      }
    } catch (error) {
      console.error("Error fetching uploaded reports:", error);
      setUploadedReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  // Handle file download for uploaded reports - based on StaffDocumentUpload implementation
  const handleDownloadFile = async (fileUrl) => {
    try {
      // Extract filename from URL
      const fileName = fileUrl.split('/').pop();

      // Construct full URL
      const fullUrl = `${ApiUrl.apiurl.replace(/\/api\/$/, '')}${fileUrl}`;

      console.log("Downloading from:", fullUrl);

      // Fetch the file as blob using XMLHttpRequest to avoid CORS
      const xhr = new XMLHttpRequest();
      xhr.open('GET', fullUrl, true);
      xhr.responseType = 'blob';

      // Add auth token if available
      const token = sessionStorage.getItem('access_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.onload = function () {
        if (xhr.status === 200) {
          const blob = xhr.response;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 100);
        } else {
          throw new Error(`Failed to download: ${xhr.status}`);
        }
      };

      xhr.onerror = function () {
        throw new Error('Network error while downloading file');
      };

      xhr.send();

    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
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
                STUDENT REPORT CARDS
              </p>

              {/* Student Information */}
              <div className="row mt-4 mb-3 mx-2">
                <div className="col-md-6">
                  <p><strong>Name:</strong> {student.full_name || "-"}</p>
                  <p><strong>Enrollment No:</strong> {student.enrollment_no || "-"}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Course:</strong> {student.course_name || "-"}</p>
                  <p><strong>Semester:</strong> {student.semester_name || "-"}</p>
                </div>
              </div>

              <div className="row mb-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
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
                  <p className="mt-2">Loading report cards...</p>
                </div>
              ) : uploadedReports.length === 0 ? (
                <div
                  className="text-center py-4 mx-3"
                  style={{
                    border: "1px dashed #ccc",
                    borderRadius: "5px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <p className="text-muted mb-0">
                    No report cards found for this student in semester: {student.semester_name || "-"}
                  </p>
                  <p className="text-muted small">
                    Report cards will appear here once they are uploaded for this semester.
                  </p>
                </div>
              ) : (
                <div className="col-12 container-fluid mt-4">
                  <h5 className="mb-3">Uploaded Report Cards - {student.semester_name || "Selected Semester"}</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead className="table-primary">
                        <tr>
                          <th>Sr.No</th>
                          {/* <th>Course</th> */}
                          <th>Semester</th>
                          {/* <th>Academic Year</th> */}
                          {/* <th>Upload Date</th> */}
                          <th>View Document</th>
                          <th>Download Document</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uploadedReports.map((report, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            {/* <td>{report.course_name || "-"}</td> */}
                            <td>{report.semester_code || "-"}</td>
                            {/* <td>{report.academic_year_code || "-"}</td> */}
                            {/* <td>{new Date(report.generated_date).toLocaleDateString()}</td> */}
                            <td>
                              {report.pdf_url ? (
                                <a
                                  href={`${ApiUrl.apiurl.replace(/\/api\/$/, '')}${report.pdf_url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-primary"
                                  style={{ color: "white", textDecoration: "none" }}
                                >
                                  View
                                </a>
                              ) : (
                                <span className="text-muted">No File</span>
                              )}
                            </td>
                            <td>
                              {report.pdf_url ? (
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDownloadFile(report.pdf_url);
                                  }}
                                  className="btn btn-sm btn-primary"
                                  style={{ color: "white", textDecoration: "none", cursor: "pointer" }}
                                >
                                  Download
                                </a>
                              ) : (
                                <span className="text-muted">No File</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentReport;
