import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdmLessonPlanCompletionReport = () => {
  const navigate = useNavigate();
  const [lessonPlans, setLessonPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const organizationId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");

  const fetchData = useCallback(async () => {
    if (!organizationId || !branchId) {
      setError("Session data missing. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearched(true);

      const url = `${ApiUrl.apiurl}LECTURE_PLAN/GetProfessorLecturePlanSearchList/?organization_id=${organizationId}&branch_id=${branchId}`;
      const response = await fetch(url);

      if (response.status === 204) {
        setLessonPlans([]);
        return;
      }

      const data = await response.json();

      if (data && data.message === "success" && Array.isArray(data.data)) {
        setLessonPlans(data.data);
      } else {
        setLessonPlans([]);
      }
    } catch (err) {
      console.error("Error fetching course completion data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [organizationId, branchId]);

  // Auto-load on page visit
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    fetchData();
  };

  const handleClose = () => {
    navigate("/admin/dashboard");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF("landscape", "pt", "a4");

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Lesson Plan Completion Report", doc.internal.pageSize.getWidth() / 2, 40, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated on: ${new Date().toLocaleDateString("en-IN")}`,
      doc.internal.pageSize.getWidth() / 2,
      58,
      { align: "center" }
    );

    const tableColumns = [
      { header: "Sr. No.", dataKey: "srno" },
      { header: "Teacher Name", dataKey: "professor_name" },
      { header: "Lecture No", dataKey: "lecture_no" },
      { header: "Module No", dataKey: "module_no" },
      { header: "Topic Details", dataKey: "topic_details" },
      { header: "Proposed Date", dataKey: "proposedDate" },
      { header: "Taught Date", dataKey: "taught_date" },
      { header: "% Coverage", dataKey: "percentage_completed" },
      { header: "Remarks", dataKey: "remarks" },
    ];

    const tableRows = [];
    let srNo = 1;

    // Grouping for PDF to handle cell spans
    const teacherSpans = {}; 
    let currentRowIndex = 0;

    // Group the lessonPlans by professor_name
    const groupedPlans = lessonPlans.reduce((acc, curr) => {
      const name = curr.professor_name || "-";
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(curr);
      return acc;
    }, {});

    Object.entries(groupedPlans).forEach(([teacherName, plans]) => {
      teacherSpans[currentRowIndex] = plans.length;
      
      plans.forEach((item, index) => {
        tableRows.push({
          srno: index === 0 ? srNo++ : "", // Only show srno on first row of group
          professor_name: index === 0 ? teacherName : "", // Only show name on first row
          lecture_no: item.lecture_no || "-",
          module_no: item.module_no || "-",
          topic_details: item.topic_details || "-",
          proposedDate: item.proposedDate || "-",
          taught_date: item.taught_date || "-",
          percentage_completed: item.percentage_completed != null ? `${item.percentage_completed}%` : "-",
          remarks: item.remarks || "-",
        });
        currentRowIndex++;
      });
    });

    autoTable(doc, {
      startY: 70,
      columns: tableColumns,
      body: tableRows,
      headStyles: {
        fillColor: [13, 110, 253],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8,
        halign: "center",
      },
      columnStyles: {
        topic_details: { halign: "left" },
        remarks: { halign: "left" },
        professor_name: { halign: "left", fontStyle: "bold" },
      },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      styles: { overflow: "linebreak", cellPadding: 4, lineColor: [200, 200, 200], lineWidth: 0.1 },
      margin: { top: 70, left: 20, right: 20 },
      didParseCell: function (data) {
          // Merge cells logic for Teacher Name and Sr No
          if (data.section === 'body') {
             if (data.column.dataKey === 'professor_name' || data.column.dataKey === 'srno') {
                 if (teacherSpans[data.row.index]) {
                     data.rowSpan = teacherSpans[data.row.index];
                 } else {
                     // If it's not the start of a span, we hide the cell
                     // (autoTable will automatically expand the first cell over these)
                 }
             }
          }
      }
    });

    doc.save("Lesson_Plan_Completion_Report.pdf");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              {/* Page Title */}
              <p
                style={{
                  marginBottom: "10px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                LESSON PLAN COMPLETION REPORT
              </p>

              {/* Action Buttons */}
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Search"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{ width: "150px" }}
                    onClick={handleClose}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "160px" }}
                    onClick={handleExportPDF}
                    disabled={loading || lessonPlans.length === 0}
                  >
                    Export to PDF
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="d-flex justify-content-center align-items-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span className="ms-3 text-muted">Loading lesson plans...</span>
                </div>
              )}

              {/* Error State */}
              {!loading && error && (
                <div className="alert alert-danger mx-3" role="alert">
                  {error}
                </div>
              )}

              {/* No Data State */}
              {!loading && !error && searched && lessonPlans.length === 0 && (
                <div className="alert alert-info mx-3" role="alert">
                  No lesson plan records found.
                </div>
              )}

              {/* Table */}
              {!loading && !error && lessonPlans.length > 0 && (() => {
                // Pre-process Data for grouping in HTML table
                const groupedData = [];
                let srNo = 1;

                const groupedPlans = lessonPlans.reduce((acc, curr) => {
                  const name = curr.professor_name || "-";
                  if (!acc[name]) {
                    acc[name] = [];
                  }
                  acc[name].push(curr);
                  return acc;
                }, {});

                Object.entries(groupedPlans).forEach(([teacherName, plans]) => {
                  plans.forEach((item, index) => {
                    groupedData.push({
                      ...item,
                      isFirstInGroup: index === 0,
                      groupLength: plans.length,
                      displaySrNo: index === 0 ? srNo++ : null,
                      displayTeacherName: teacherName
                    });
                  });
                });

                return (
                  <div className="col-12 mt-2">
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover align-middle">
                        <thead className="table-primary text-center">
                          <tr>
                            <th>Sr. No.</th>
                            <th>Teacher Name</th>
                            <th>Lecture No</th>
                            <th>Module No</th>
                            <th>Topic Details</th>
                            <th>Proposed Date</th>
                            <th>Taught Date</th>
                            <th>% Course Coverage</th>
                            <th>Remarks</th>
                            <th>Uploaded Document</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupedData.map((item, index) => (
                            <tr key={item.LESSON_PLAN_ID || index}>
                              {item.isFirstInGroup && (
                                <>
                                  <td className="text-center fw-bold" rowSpan={item.groupLength}>
                                    {item.displaySrNo}
                                  </td>
                                  <td className="fw-bold align-middle" rowSpan={item.groupLength}>
                                    {item.displayTeacherName}
                                  </td>
                                </>
                              )}
                              <td className="text-center">{item.lecture_no || "-"}</td>
                              <td className="text-center">{item.module_no || "-"}</td>
                              <td>{item.topic_details || "-"}</td>
                              <td className="text-center">{item.proposedDate || "-"}</td>
                              <td className="text-center">
                                {item.taught_date ? (
                                  <span className="badge bg-success">{item.taught_date}</span>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                              <td className="text-center">
                                {item.percentage_completed != null ? (
                                  <span className="fw-semibold">{item.percentage_completed}%</span>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                              <td>{item.remarks || "-"}</td>
                              <td className="text-center">
                                {item.document_file ? (
                                  <a
                                    href={item.document_file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary fw-semibold"
                                  >
                                    View
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
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmLessonPlanCompletionReport;
