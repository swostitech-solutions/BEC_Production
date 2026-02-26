import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import "./AdmAttendanceDashboard.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ApiUrl } from "../../../ApiUrl";

ChartJS.register(ArcElement, Tooltip, Legend);

const AttendancePage = () => {
  const today = new Date();

  const [chartData, setChartData] = useState([0, 0, 0, 0]);
  const [attendanceCounts, setAttendanceCounts] = useState({
    present: 0,
    absent: 0,
    leave: 0,
    notMarked: 0,
  });

  const [selectedDateForChart, setSelectedDateForChart] = useState(new Date());
  const [selectedDateForTable, setSelectedDateForTable] = useState(new Date());
  const [rows, setRows] = useState([]);

  // Fetch attendance data - Using ONLY API from collection
  // This single API call provides data for BOTH pie chart and table
  const fetchAttendanceData = async (date) => {
    const formattedDate = date.toISOString().split("T")[0];

    // Get dynamic values from localStorage
    const orgId = localStorage.getItem("orgId");
    const branchId = localStorage.getItem("branchId");
    const batchId = localStorage.getItem("academicSessionId");

    // ONLY API from collection: dashboardBasedOnCourseSemesterSection
    const apiUrl = `${ApiUrl.apiurl}AttendanceDashBoard/dashboardBasedOnCourseSemesterSection/?organization_id=${orgId}&branch_id=${branchId}&batch_id=${batchId}&date=${formattedDate}`;
    console.log("📊 Fetching attendance data from (collection API):", apiUrl);

    try {
      const response = await fetch(apiUrl);

      // Check if response is ok before parsing
      if (!response.ok) {
        console.error("❌ API Error:", response.status, response.statusText);
        const text = await response.text();
        console.error("Response:", text);

        // Set empty data
        setRows([]);
        setChartData([0, 0, 0, 0]);
        setAttendanceCounts({
          present: 0,
          absent: 0,
          leave: 0,
          notMarked: 0,
        });
        return;
      }

      // Check if response has content before parsing JSON
      const contentLength = response.headers.get('content-length');
      if (contentLength === '0') {
        console.warn("⚠️ API returned empty response (Content-Length: 0)");
        setRows([]);
        setChartData([0, 0, 0, 0]);
        setAttendanceCounts({
          present: 0,
          absent: 0,
          leave: 0,
          notMarked: 0,
        });
        return;
      }

      // Get the text first to check if it's empty
      const text = await response.text();
      if (!text || text.trim().length === 0) {
        console.warn("⚠️ API returned empty body");
        setRows([]);
        setChartData([0, 0, 0, 0]);
        setAttendanceCounts({
          present: 0,
          absent: 0,
          leave: 0,
          notMarked: 0,
        });
        return;
      }

      // Parse the JSON
      const result = JSON.parse(text);
      console.log("✅ Attendance data received:", result);

      // Set table data
      const classData = Array.isArray(result.data) ? result.data : [];
      setRows(classData);

      // Calculate totals for pie chart by aggregating class-wise data
      let totalPresent = 0;
      let totalAbsent = 0;
      let totalLeave = 0;
      let totalNotMarked = 0;

      classData.forEach((row) => {
        totalPresent += row.total_present || 0;
        totalAbsent += row.total_absent || 0;
        totalLeave += row.total_leave || 0;
        totalNotMarked += row.not_marked_student || 0;
      });

      console.log("📊 Calculated totals:", {
        present: totalPresent,
        absent: totalAbsent,
        leave: totalLeave,
        notMarked: totalNotMarked
      });

      // Set pie chart data
      setChartData([totalPresent, totalAbsent, totalLeave, totalNotMarked]);
      setAttendanceCounts({
        present: totalPresent,
        absent: totalAbsent,
        leave: totalLeave,
        notMarked: totalNotMarked,
      });

    } catch (error) {
      console.error("❌ Error fetching attendance data:", error);

      // Set empty data on error
      setRows([]);
      setChartData([0, 0, 0, 0]);
      setAttendanceCounts({
        present: 0,
        absent: 0,
        leave: 0,
        notMarked: 0,
      });
    }
  };

  useEffect(() => {
    fetchAttendanceData(selectedDateForChart);
  }, [selectedDateForChart]);

  useEffect(() => {
    fetchAttendanceData(selectedDateForTable);
  }, [selectedDateForTable]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <p className="text-center fw-bold fs-5">Attendance List</p>

              {/*  Pie Chart + Counts Section */}
              <div className="d-flex justify-content-center">
                <div
                  className="attendance-container shadow bg-white p-3 d-flex"
                  style={{ width: "90%", maxWidth: "1000px" }}
                >
                  <div style={{ flex: 1 }}>
                    <div className="d-flex align-items-center flex-wrap justify-content-center mb-3">
                      <label className="me-2 d-flex align-items-center">
                        Date
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="ms-2"
                        />
                      </label>
                      <DatePicker
                        selected={selectedDateForChart}
                        onChange={(date) => setSelectedDateForChart(date)}
                        dateFormat="dd/MM/yyyy"
                        maxDate={today}
                      />
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      <div style={{ width: "100%", height: "300px" }}>
                        <Pie
                          data={{
                            labels: [
                              "Present",
                              "Absent",
                              "Leave",
                              "Not Marked",
                            ],
                            datasets: [
                              {
                                data: chartData,
                                backgroundColor: [
                                  "#00FF00",
                                  "#FF4D4D",
                                  "#FFA500",
                                  "#C0C0C0",
                                ],
                                borderWidth: 1,
                              },
                            ],
                          }}
                          options={{
                            plugins: {
                              legend: { display: false },
                              tooltip: {
                                callbacks: {
                                  label: (context) => {
                                    const total = context.dataset.data.reduce(
                                      (a, b) => a + b,
                                      0
                                    );
                                    const value = context.raw;
                                    const percentage = (
                                      (value / total) *
                                      100
                                    ).toFixed(1);
                                    return `${context.label}: ${value} (${percentage}%)`;
                                  },
                                },
                              },
                            },
                            maintainAspectRatio: false,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/*  Attendance Counts */}
                  <div style={{ width: "250px", marginLeft: "20px" }}>
                    <h6 className="fw-bold mb-3">Attendance Summary</h6>
                    <ul className="list-unstyled fs-6">
                      <li className="d-flex align-items-center mb-2">
                        <span
                          style={{
                            width: "14px",
                            height: "14px",
                            backgroundColor: "#00FF00",
                          }}
                          
                          className="me-2 rounded-1"
                        ></span>
                        Present: {attendanceCounts.present}
                      </li>
                      <li className="d-flex align-items-center mb-2">
                        <span
                          style={{
                            width: "14px",
                            height: "14px",
                            backgroundColor: "#FF4D4D",
                          }}
                          className="me-2 rounded-1"
                        ></span>
                        Absent: {attendanceCounts.absent}
                      </li>
                      {/* <li className="d-flex align-items-center mb-2">
                        <span style={{ width: "14px", height: "14px", backgroundColor: "#FFA500" }} className="me-2 rounded-1"></span>
                        Leave: {attendanceCounts.leave}
                      </li> */}
                      <li className="d-flex align-items-center">
                        <span
                          style={{
                            width: "14px",
                            height: "14px",
                            backgroundColor: "#C0C0C0",
                          }}
                          className="me-2 rounded-1"
                        ></span>
                        Not Marked: {attendanceCounts.notMarked}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 📘 Table Section */}
              <div className="row mt-3 mx-2 custom-section-box">
                <div className="d-flex align-items-center mb-2">
                  <label className="me-2 d-flex align-items-center">
                    Date
                    <FontAwesomeIcon icon={faCalendarAlt} className="ms-2" />
                  </label>
                  <DatePicker
                    selected={selectedDateForTable}
                    onChange={(date) => setSelectedDateForTable(date)}
                    dateFormat="dd/MM/yyyy"
                    className="datepicker"
                    maxDate={today}
                  />
                </div>
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Course</th>
                          <th>Section</th>
                          <th>Department</th>
                          <th>Total Students</th>
                          <th>Present</th>
                          <th>Absent</th>
                          {/* <th>Leave</th> */}
                          {/* <th>Not Marked</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(rows) && rows.length > 0 ? (
                          rows.map((row, index) => (
                            <tr key={index}>
                              <td>{row.course_name}</td>
                              <td>{row.section_name}</td>
                              <td>{row.department}</td>
                              <td>{row.total_student}</td>
                              <td>{row.total_present}</td>
                              <td>{row.total_absent}</td>
                              {/* <td>{row.total_leave}</td>
                              <td>{row.not_marked_student}</td> */}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center text-muted">
                              No records found.
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
    </div>
  );
};

export default AttendancePage;
