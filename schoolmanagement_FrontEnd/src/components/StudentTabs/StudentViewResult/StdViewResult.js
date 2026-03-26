import React, { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useStudentDetails from "../../hooks/useStudentDetails";
import api from "../../../utils/api";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ApiUrl } from "../../../ApiUrl";

const StdResults = () => {
  // Get student ID from sessionStorage
  const studentId = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/student/dashboards");
  };

  // Fetch student details
  const { studentDetails, error: studentDetailsError } =
    useStudentDetails(studentId);

  // State for exam results (Entered Marks)
  const [examResults, setExamResults] = useState([]);

  // State for uploaded report cards (PDFs)
  const [uploadedReports, setUploadedReports] = useState([]);

  // Fetch exam results (Marks)
  useEffect(() => {
    const fetchExamResults = async () => {
      if (!studentId) {
        setExamResults([]);
        return;
      }

      try {
        const response = await api.get(
          `reportcard/get-result-by-student/${studentId}/`
        );

        const result = response.data;

        if (result.status === "success" && Array.isArray(result.data)) {
          setExamResults(result.data);
        } else if (result.data && Array.isArray(result.data)) {
          setExamResults(result.data);
        } else {
          setExamResults([]);
        }
      } catch (err) {
        console.error("Error fetching exam results:", err);
        setExamResults([]);
      }
    };

    // Fetch Uploaded Report Cards
    const fetchUploadedReports = async () => {
      if (!studentId) {
        setUploadedReports([]);
        return;
      }
      try {
        const response = await api.get(`reportcard/get-reports-by-student/${studentId}/`);
        if (response.data.status === "success" && Array.isArray(response.data.data)) {
          setUploadedReports(response.data.data);
        } else {
          setUploadedReports([]);
        }
      } catch (err) {
        console.error("Error fetching uploaded reports:", err);
      }
    };

    fetchExamResults();
    fetchUploadedReports();
  }, [studentId]);

  // Helper function to load logo image
  const loadLogoImage = () => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = (err) => reject(err);
      img.src = "/Assets/sparsh.jpeg";
    });
  };

  // Generate PDF for exam result (Marks)
  const generateResultPDF = async (result) => {
    try {
      const doc = new jsPDF("portrait", "mm", "a4");
      let startY = 20;

      try {
        const logoData = await loadLogoImage();
        doc.addImage(logoData, "JPEG", 10, 10, 20, 20);
      } catch (error) {
        console.error("Error loading logo:", error);
      }

      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(16);
      const headerText = "Sparsh College of Nursing and Allied Sciences";
      const textWidth =
        (doc.getStringUnitWidth(headerText) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const textX = (pageWidth - textWidth) / 2;
      doc.text(headerText, textX, 22);

      doc.setFontSize(14);
      doc.text("EXAM RESULT REPORT", pageWidth / 2, 30, { align: "center" });

      startY = 40;

      const basicDetails = studentDetails?.student_basic_details || {};
      const studentInfo = [
        ["Student Name:", result.student_name || basicDetails.first_name || "-"],
        ["Enrollment No:", result.enrollment_no || "-"],
        ["Academic Year:", result.academic_year_code || "-"],
        ["Semester:", result.semester_code || "-"],
      ];

      if (basicDetails.course_name) {
        studentInfo.push(["Class:", basicDetails.course_name]);
      }

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Student Information", 15, startY);
      startY += 8;

      doc.autoTable({
        startY: startY,
        body: studentInfo,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fontSize: 10, fontStyle: "bold" },
        margin: { left: 15, right: 15 },
      });

      startY = doc.lastAutoTable.finalY + 10;

      // ... (Rest of PDF generation logic for marks) ...
      // Simplified for brevity if unused, but kept for robustness
      // Overall Result Summary
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Overall Result", 15, startY);
      startY += 8;

      const overallResult = [
        ["Total Marks:", result.total_marks || "0"],
        ["Obtained Marks:", result.obtained_marks || "0"],
        ["Percentage:", result.percentage ? `${result.percentage}%` : "-"],
        ["Grade:", result.overall_grade || "-"],
        ["Rank:", result.rank || "-"],
      ];

      doc.autoTable({
        startY: startY,
        body: overallResult,
        theme: "grid",
        styles: { fontSize: 10, fontStyle: "bold" },
        margin: { left: 15, right: 15 },
      });

      const filename = `Result_${result.student_name}.pdf`;
      doc.save(filename);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF.");
    }
  };

  const handleDownloadPDF = (result) => {
    generateResultPDF(result);
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

  if (studentDetailsError) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <Alert variant="danger">
              <Alert.Heading>Error</Alert.Heading>
              <p>{studentDetailsError}</p>
            </Alert>
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
                EXAM RESULT
              </p>

              {/* Uploaded Report Cards Section */}
              {uploadedReports.length > 0 && (
                <div className="col-12 container-fluid mt-4">
                  <h5 className="mb-3">Uploaded Report Cards</h5>
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

              {/* Legacy Exam Results Section (Marks) */}
              {examResults.length > 0 && (
                <div className="col-12 container-fluid mt-4">
                  <h5 className="mb-3">Generated Exam Results</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sr.No</th>
                          <th>Semester</th>
                          <th>Total Marks</th>
                          <th>Obtained Marks</th>
                          <th>Percentage</th>
                          <th>Grade</th>
                          <th>Result PDF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {examResults.map((result, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{result.semester_code || "-"}</td>
                            <td>{result.total_marks || "-"}</td>
                            <td>{result.obtained_marks || "-"}</td>
                            <td>{result.percentage ? `${result.percentage}%` : "-"}</td>
                            <td>{result.overall_grade || "-"}</td>
                            <td>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDownloadPDF(result);
                                }}
                                style={{
                                  color: "#007bff",
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }}
                              >
                                Generate PDF
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {uploadedReports.length === 0 && examResults.length === 0 && (
                <div className="col-12 container-fluid mt-5 text-center">
                  <p className="text-muted">No exam results or report cards found for this student.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StdResults;