import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import useStudentDetails from "../../hooks/useStudentDetails";
import api from "../../../utils/api";
import jsPDF from "jspdf";
import "jspdf-autotable";

const StdResults = () => {
  // Get student ID from sessionStorage
  const studentId = sessionStorage.getItem("userId");

  // Fetch student details
  const { studentDetails, error: studentDetailsError } =
    useStudentDetails(studentId);

  // State for exam results
  const [examResults, setExamResults] = useState([]);

  // Fetch exam results using the new API endpoint
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
        console.log("Exam Results API Response:", result);

        // Handle the response structure: { status: "success", count: 1, data: [...] }
        if (result.status === "success" && Array.isArray(result.data)) {
          setExamResults(result.data);
        } else if (result.data && Array.isArray(result.data)) {
          setExamResults(result.data);
        } else {
          // No results found - handle gracefully, don't show error
          setExamResults([]);
        }
      } catch (err) {
        console.error("Error fetching exam results:", err);
        // Handle errors gracefully - don't show to user, just set empty results
        setExamResults([]);
      }
    };

    fetchExamResults();
  }, [studentId]);

  // Log for debugging
  useEffect(() => {
    if (studentDetails) {
      console.log("📚 Student Details:", studentDetails);
      console.log("🆔 Student ID:", studentId);
    }
  }, [studentDetails, studentId]);

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
      img.src = "/Assets/bec.jpeg";
    });
  };

  // Generate PDF for exam result
  const generateResultPDF = async (result) => {
    try {
      const doc = new jsPDF("portrait", "mm", "a4");
      let startY = 20;

      // Load and add logo
      try {
        const logoData = await loadLogoImage();
        doc.addImage(logoData, "JPEG", 10, 10, 20, 20);
      } catch (error) {
        console.error("Error loading logo:", error);
      }

      // Header
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(16);
      const headerText = "Bhubaneswar Engineering College";
      const textWidth =
        (doc.getStringUnitWidth(headerText) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const textX = (pageWidth - textWidth) / 2;
      doc.text(headerText, textX, 22);

      doc.setFontSize(14);
      doc.text("EXAM RESULT REPORT", pageWidth / 2, 30, { align: "center" });

      startY = 40;

      // Student Information Section
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
      if (basicDetails.section_name) {
        studentInfo.push(["Section:", basicDetails.section_name]);
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

      startY = doc.lastAutoTable.finalY + 10;

      // Subjects Section
      if (result.subjects && result.subjects.length > 0) {
        // Check if we need a new page
        if (startY > 200) {
          doc.addPage();
          startY = 20;
        }

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Subject-wise Marks", 15, startY);
        startY += 8;

        const subjectsTable = result.subjects.map((subject) => [
          subject.subject_name || "-",
          subject.max_marks || "0",
          subject.obtained_marks || "0",
          subject.grade || "-",
          subject.periodic_assessment || "0",
          subject.notebook_maintenance || "0",
          subject.subject_enrichment || "0",
          subject.theory_marks || "0",
          subject.practical_marks || "-",
          subject.is_pass ? "Pass" : "Fail",
        ]);

        doc.autoTable({
          startY: startY,
          head: [
            [
              "Subject",
              "Max Marks",
              "Obtained",
              "Grade",
              "PA",
              "NB",
              "SE",
              "Theory",
              "Practical",
              "Status",
            ],
          ],
          body: subjectsTable,
          theme: "grid",
          styles: { fontSize: 8 },
          headStyles: { fontSize: 8, fontStyle: "bold" },
          margin: { left: 15, right: 15 },
        });

        startY = doc.lastAutoTable.finalY + 10;
      }

      // Co-Scholastic Activities
      if (result.co_scholastic && result.co_scholastic.length > 0) {
        // Check if we need a new page
        if (startY > 220) {
          doc.addPage();
          startY = 20;
        }

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Co-Scholastic Activities", 15, startY);
        startY += 8;

        const coScholasticTable = result.co_scholastic.map((activity) => [
          activity.activity_name || "-",
          activity.grade || "-",
          activity.remarks || "-",
        ]);

        doc.autoTable({
          startY: startY,
          head: [["Activity", "Grade", "Remarks"]],
          body: coScholasticTable,
          theme: "grid",
          styles: { fontSize: 10 },
          headStyles: { fontSize: 10, fontStyle: "bold" },
          margin: { left: 15, right: 15 },
        });

        startY = doc.lastAutoTable.finalY + 10;
      }

      // Attendance Section
      if (result.attendance) {
        // Check if we need a new page
        if (startY > 240) {
          doc.addPage();
          startY = 20;
        }

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Attendance", 15, startY);
        startY += 8;

        const attendanceData = [
          ["Actual Attendance:", result.attendance.actual_attendance || "0"],
          ["Possible Attendance:", result.attendance.possible_attendance || "0"],
          [
            "Attendance Percentage:",
            result.attendance.attendance_percentage
              ? `${result.attendance.attendance_percentage}%`
              : "-",
          ],
        ];

        doc.autoTable({
          startY: startY,
          body: attendanceData,
          theme: "grid",
          styles: { fontSize: 10 },
          margin: { left: 15, right: 15 },
        });

        startY = doc.lastAutoTable.finalY + 10;
      }

      // Remarks Section
      if (result.remarks) {
        // Check if we need a new page
        if (startY > 240) {
          doc.addPage();
          startY = 20;
        }

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Remarks", 15, startY);
        startY += 8;

        const remarksData = [];
        if (result.remarks.class_teacher_remarks) {
          remarksData.push([
            "Class Teacher Remarks:",
            result.remarks.class_teacher_remarks,
          ]);
        }
        if (result.remarks.principal_remarks) {
          remarksData.push([
            "Principal Remarks:",
            result.remarks.principal_remarks,
          ]);
        }
        if (result.remarks.activities) {
          remarksData.push(["Activities:", result.remarks.activities]);
        }
        if (result.remarks.competitions) {
          remarksData.push(["Competitions:", result.remarks.competitions]);
        }
        if (result.remarks.co_curricular_participation) {
          remarksData.push([
            "Co-Curricular Participation:",
            result.remarks.co_curricular_participation,
          ]);
        }
        if (result.remarks.holiday_homework) {
          remarksData.push([
            "Holiday Homework:",
            result.remarks.holiday_homework,
          ]);
        }

        if (remarksData.length > 0) {
          doc.autoTable({
            startY: startY,
            body: remarksData,
            theme: "grid",
            styles: { fontSize: 10 },
            margin: { left: 15, right: 15 },
          });
        }
      }

      // Open PDF in new tab and also allow download
      const filename = `Result_${result.student_name || "Student"}_${
        result.semester_code || ""
      }_${new Date().getFullYear()}.pdf`;
      
      // Open in new tab for viewing
      const pdfBlob = doc.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl, "_blank");
      
      // Also trigger download
      doc.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Handle PDF download
  const handleDownloadPDF = (result) => {
    if (!result) {
      alert("No result data available to download.");
      return;
    }
    generateResultPDF(result);
  };

  // Show error if student details fetch failed
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

              {/* Show results table */}
              <div className="col-12 container-fluid mt-4">
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
                      {examResults.length > 0 ? (
                        examResults.map((result, index) => (
                          <tr key={result.id || index}>
                            <td>{index + 1}</td>
                            <td>{result.semester_code || "-"}</td>
                            <td>{result.total_marks || "-"}</td>
                            <td>{result.obtained_marks || "-"}</td>
                            <td>{result.percentage ? `${result.percentage}%` : "-"}</td>
                            <td>{result.overall_grade || "-"}</td>
                            <td>
                              {result ? (
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
                                  View PDF
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
                            No exam results found.
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
};
export default StdResults;