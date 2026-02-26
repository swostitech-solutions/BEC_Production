import React, { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Form, Table, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useStudentAttendance from "../../hooks/useStudentAttendance";

// Chart setup
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StaffViewAttendance = () => {
  // Get student ID from sessionStorage
  const studentId = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/student/dashboards");
  };

  // Initialize dates with current date
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showSummary, setShowSummary] = useState(true);

  // Check if student ID is missing
  const isStudentIdMissing = !studentId;

  // Format date to YYYY-MM-DD for API
  const formatDateForAPI = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch attendance data using the hook
  // Only pass date params if they are set (null means don't filter by that date)
  const {
    attendanceData: apiAttendanceData,
    loading: attendanceLoading,
    error: attendanceError,
    refetch: refetchAttendance,
  } = useStudentAttendance({
    student_id: studentId,
    from_date: formatDateForAPI(startDate),
    to_date: formatDateForAPI(endDate),
    enabled: !!studentId, // Only fetch if studentId exists
  });

  // Transform API data to component format - handle errors gracefully
  const transformedData = useMemo(() => {
    try {
      if (!apiAttendanceData || !Array.isArray(apiAttendanceData)) {
        return [];
      }

      return apiAttendanceData
        .map((record) => {
          try {
            if (!record || !record.attendance_date) {
              return null;
            }
            // Format date from YYYY-MM-DD to "DD MMM YYYY"
            const dateObj = new Date(record.attendance_date);
            if (isNaN(dateObj.getTime())) {
              // Invalid date, skip this record
              return null;
            }
            const day = String(dateObj.getDate()).padStart(2, "0");
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames[dateObj.getMonth()];
            const year = dateObj.getFullYear();
            const formattedDate = `${day} ${month} ${year}`;

            // Convert "P" to "Present", "A" to "Absent"
            const attendance = record.present === "P" ? "Present" : record.present === "A" ? "Absent" : record.present || "Unknown";

            return {
              date: formattedDate,
              subject: record.course_name || record.department || "-",
              attendance: attendance,
              remarks: record.remarks || "",
              rawDate: record.attendance_date, // Keep for sorting/filtering if needed
            };
          } catch (err) {
            console.error("Error processing attendance record:", err, record);
            return null; // Skip invalid records
          }
        })
        .filter((record) => record !== null) // Remove invalid records
        .sort((a, b) => {
          try {
            // Sort by date (oldest first)
            return new Date(a.rawDate) - new Date(b.rawDate);
          } catch (err) {
            return 0; // If sorting fails, maintain order
          }
        });
    } catch (err) {
      console.error("Error transforming attendance data:", err);
      return []; // Return empty array on error
    }
  }, [apiAttendanceData]);

  // Calculate statistics
  const totalPresent = transformedData.filter((d) => d.attendance === "Present").length;
  const totalAbsent = transformedData.filter((d) => d.attendance === "Absent").length;
  const total = transformedData.length;

  // Get unique months from data for chart - handle errors gracefully
  const getMonthLabels = () => {
    try {
      if (!transformedData || transformedData.length === 0) {
        return [];
      }
      const months = transformedData
        .map((record) => {
          try {
            if (!record || !record.rawDate) return null;
            const date = new Date(record.rawDate);
            if (isNaN(date.getTime())) return null;
            return date.toLocaleString("default", { month: "short" });
          } catch (err) {
            return null;
          }
        })
        .filter((month) => month !== null);
      return [...new Set(months)].sort((a, b) => {
        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthOrder.indexOf(a) - monthOrder.indexOf(b);
      });
    } catch (err) {
      console.error("Error getting month labels:", err);
      return [];
    }
  };

  // Calculate present/absent by month - handle errors gracefully
  const getMonthlyData = () => {
    try {
      const monthlyData = {};
      if (!transformedData || transformedData.length === 0) {
        return monthlyData;
      }
      transformedData.forEach((record) => {
        try {
          if (!record || !record.rawDate) return;
          const date = new Date(record.rawDate);
          if (isNaN(date.getTime())) return;
          const month = date.toLocaleString("default", { month: "short" });
          if (!monthlyData[month]) {
            monthlyData[month] = { present: 0, absent: 0 };
          }
          if (record.attendance === "Present") {
            monthlyData[month].present++;
          } else if (record.attendance === "Absent") {
            monthlyData[month].absent++;
          }
        } catch (err) {
          console.error("Error processing record for monthly data:", err, record);
        }
      });
      return monthlyData;
    } catch (err) {
      console.error("Error getting monthly data:", err);
      return {};
    }
  };

  const monthlyData = getMonthlyData();
  const monthLabels = getMonthLabels();

  const chartData = {
    labels: monthLabels.length > 0 ? monthLabels : ["No Data"],
    datasets: [
      {
        label: "Present",
        data: monthLabels.length > 0
          ? monthLabels.map((month) => monthlyData[month]?.present || 0)
          : [0],
        backgroundColor: "#28a745",
      },
      {
        label: "Absent",
        data: monthLabels.length > 0
          ? monthLabels.map((month) => monthlyData[month]?.absent || 0)
          : [0],
        backgroundColor: "#dc3545",
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
    plugins: { legend: { position: "bottom" } },
    responsive: true,
    maintainAspectRatio: false,
  };

  const handleSummary = () => {
    setShowSummary(true);
  };

  const handleDetails = () => {
    setShowSummary(false);
  };

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">

              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                ATTENDANCE SUMMARY
              </p>
              {/* White Div with Summary & Details Buttons */}
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={handleSummary}
                    style={{
                      width: "150px",
                      fontWeight: "600",
                    }}
                  >
                    Summary
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={handleDetails}
                    style={{
                      width: "150px",
                      fontWeight: "600",
                    }}
                  >
                    Details
                  </button>
                  <Button
                    variant="danger"
                    onClick={handleClose}
                    className="me-2"
                    style={{
                      width: "150px",
                      fontWeight: "600",
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
              {/* Grey Div for all other content */}
              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box mt-3 mb-4  ">
                  {/* Content - Always show, handle errors gracefully */}
                  <>
                    {showSummary ? (
                      <>
                        <Row className="mb-4 mt-3">
                          <Col md={5}>
                            <Form.Label>
                              From Date <FaCalendarAlt className="ms-1" />
                            </Form.Label>
                            <DatePicker
                              selected={startDate}
                              onChange={(date) => {
                                setStartDate(date);
                                if (date && endDate && date > endDate) {
                                  setEndDate(date);
                                }
                              }}
                              maxDate={endDate || new Date()}
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                              placeholderText="Select start date (optional)"
                              onChangeRaw={(e) => e.preventDefault()}
                              onKeyDown={(e) => {
                                if (e.key !== "Tab" && e.key !== "Enter") {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </Col>
                          <Col md={5}>
                            <Form.Label>
                              To Date <FaCalendarAlt className="ms-1" />
                            </Form.Label>
                            <DatePicker
                              selected={endDate}
                              onChange={(date) => {
                                setEndDate(date);
                                if (date && startDate && date < startDate) {
                                  setStartDate(date);
                                }
                              }}
                              minDate={startDate}
                              maxDate={new Date()}
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                              placeholderText="Select end date (optional)"
                              onChangeRaw={(e) => e.preventDefault()}
                              onKeyDown={(e) => {
                                if (e.key !== "Tab" && e.key !== "Enter") {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </Col>
                        </Row>

                        {/* Attendance Summary Table - Always show */}
                        <Table
                          bordered
                          responsive
                          className="text-center mb-4"
                          style={{
                            maxWidth: "700px",
                            margin: "auto",
                            border: "1px solid #ccc",
                          }}
                        >
                          <thead>
                            <tr style={{ backgroundColor: "#d89443" }}>
                              <th>Total Present</th>
                              <th>Total Absent</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{totalPresent}</td>
                              <td>{totalAbsent}</td>
                              <td>{total}</td>
                            </tr>
                          </tbody>
                        </Table>

                        {/* Attendance Chart - Always show, even if empty */}
                        <div
                          style={{
                            width: "300px",
                            height: "250px",
                            margin: "0 auto",
                            padding: "10px",
                            backgroundColor: "#fff",
                            border: "1px solid #ccc",
                          }}
                        >
                          <Bar data={chartData} options={chartOptions} />
                        </div>
                      </>
                    ) : (
                      <>
                        <Row className="mb-4 mt-3">
                          <Col md={5}>
                            <Form.Label>
                              From Date <FaCalendarAlt className="ms-1" />
                            </Form.Label>
                            <div style={{ position: "relative" }}>
                              <DatePicker
                                selected={startDate}
                                onChange={(date) => {
                                  setStartDate(date);
                                  if (date && endDate && date > endDate) {
                                    setEndDate(date);
                                  }
                                }}
                                maxDate={endDate || new Date()}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                placeholderText="Select start date (optional)"
                                onChangeRaw={(e) => e.preventDefault()}
                                onKeyDown={(e) => {
                                  if (e.key !== "Tab" && e.key !== "Enter") {
                                    e.preventDefault();
                                  }
                                }}
                                wrapperClassName="date-picker-wrapper"
                              />
                            </div>
                          </Col>
                          <Col md={5}>
                            <Form.Label>
                              To Date <FaCalendarAlt className="ms-1" />
                            </Form.Label>
                            <div style={{ position: "relative" }}>
                              <DatePicker
                                selected={endDate}
                                onChange={(date) => {
                                  setEndDate(date);
                                  if (date && startDate && date < startDate) {
                                    setStartDate(date);
                                  }
                                }}
                                minDate={startDate}
                                maxDate={new Date()}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                placeholderText="Select end date (optional)"
                                onChangeRaw={(e) => e.preventDefault()}
                                onKeyDown={(e) => {
                                  if (e.key !== "Tab" && e.key !== "Enter") {
                                    e.preventDefault();
                                  }
                                }}
                                wrapperClassName="date-picker-wrapper"
                              />
                            </div>
                          </Col>
                        </Row>
                        {/* Details Table - Always show, even if empty */}
                        <Table
                          striped
                          bordered
                          responsive
                          className="text-center mt-4"
                          style={{
                            maxWidth: "100%",
                            margin: "auto",
                            border: "1px solid #ccc",
                          }}
                        >
                          <thead>
                            <tr style={{ backgroundColor: "#d89443" }}>
                              <th>Sr. No</th>
                              <th>Date</th>
                              <th>Subject</th>
                              <th>Attendance</th>
                              <th>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transformedData.length > 0 ? (
                              transformedData.map((record, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{record.date}</td>
                                  <td>{record.subject}</td>
                                  <td>
                                    <span
                                      style={{
                                        color: record.attendance === "Present" ? "#28a745" : "#dc3545",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {record.attendance}
                                    </span>
                                  </td>
                                  <td>{record.remarks || "-"}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center" style={{ color: "#999" }}>
                                  No records to display
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </>
                    )}
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffViewAttendance;