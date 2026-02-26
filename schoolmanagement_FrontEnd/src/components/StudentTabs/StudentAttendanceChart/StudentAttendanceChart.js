import React, { useState, useMemo } from "react";
import { Card, Row, Col, Form, Spinner, Alert } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { FaChartLine, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import useStudentAttendance from "../../hooks/useStudentAttendance";

const COLORS = ["#28a745", "#dc3545"];

const StudentAttendanceChart = () => {
  const [selectedMonth, setSelectedMonth] = useState("all");
  
  // Get student ID from sessionStorage
  const studentId = sessionStorage.getItem("userId");

  // Fetch attendance data using the hook (no date filters to get all data)
  const {
    attendanceData: apiAttendanceData,
    loading: attendanceLoading,
    error: attendanceError,
  } = useStudentAttendance({
    student_id: studentId,
    enabled: !!studentId, // Only fetch if studentId exists
  });

  // Transform API data to calculate monthly attendance
  const monthlyAttendanceData = useMemo(() => {
    if (!apiAttendanceData || !Array.isArray(apiAttendanceData) || apiAttendanceData.length === 0) {
      return [];
    }

    // Group by month
    const monthlyMap = {};
    
    apiAttendanceData.forEach((record) => {
      if (!record.attendance_date) return;
      
      const dateObj = new Date(record.attendance_date);
      if (isNaN(dateObj.getTime())) return;
      
      const month = dateObj.toLocaleString("default", { month: "short" });
      
      if (!monthlyMap[month]) {
        monthlyMap[month] = {
          month,
          Present: 0,
          Absent: 0,
          total: 0,
        };
      }
      
      monthlyMap[month].total++;
      if (record.present === "P") {
        monthlyMap[month].Present++;
      } else if (record.present === "A") {
        monthlyMap[month].Absent++;
      }
    });

    // Convert to array and sort by month order
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return Object.values(monthlyMap).sort((a, b) => {
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });
  }, [apiAttendanceData]);

  // Calculate overall attendance data
  const attendanceData = useMemo(() => {
    if (!apiAttendanceData || !Array.isArray(apiAttendanceData) || apiAttendanceData.length === 0) {
      return {
        totalStudents: 0,
        present: 0,
        absent: 0,
      };
    }

    let present = 0;
    let absent = 0;

    apiAttendanceData.forEach((record) => {
      if (record.present === "P") {
        present++;
      } else if (record.present === "A") {
        absent++;
      }
    });

    return {
      totalStudents: present + absent,
      present,
      absent,
    };
  }, [apiAttendanceData]);

  // Get unique months from data
  const availableMonths = useMemo(() => {
    if (!monthlyAttendanceData || monthlyAttendanceData.length === 0) return [];
    return [
      { value: "all", label: "All Months" },
      ...monthlyAttendanceData.map((item) => ({
        value: item.month,
        label: item.month,
      })),
    ];
  }, [monthlyAttendanceData]);

  // Calculate pie chart data based on selected month
  const pieChartData = useMemo(() => {
    if (selectedMonth === "all") {
      // Aggregate all months
      return [
        {
          name: "Present",
          value: attendanceData?.present || 0,
        },
        {
          name: "Absent",
          value: attendanceData?.absent || 0,
        },
      ];
    } else {
      // Filter by selected month
      const monthData = monthlyAttendanceData.find(
        (item) => item.month === selectedMonth
      );
      if (!monthData) {
        return [
          { name: "Present", value: 0 },
          { name: "Absent", value: 0 },
        ];
      }
      return [
        {
          name: "Present",
          value: monthData.Present || 0,
        },
        {
          name: "Absent",
          value: monthData.Absent || 0,
        },
      ];
    }
  }, [selectedMonth, monthlyAttendanceData, attendanceData]);

  // Calculate totals for display
  const totalDays = useMemo(() => {
    if (selectedMonth === "all") {
      return attendanceData?.totalStudents || 0;
    } else {
      const monthData = monthlyAttendanceData.find(
        (item) => item.month === selectedMonth
      );
      return monthData?.total || 0;
    }
  }, [selectedMonth, monthlyAttendanceData, attendanceData]);

  const presentCount = pieChartData[0]?.value || 0;
  const absentCount = pieChartData[1]?.value || 0;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage =
        totalDays > 0
          ? ((data.value / totalDays) * 100).toFixed(1)
          : 0;
      return (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #dee2e6",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
            {data.name}
          </p>
          <p style={{ margin: "4px 0 0 0", color: data.payload.fill }}>
            {data.value} days ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label function
  const renderLabel = (entry) => {
    const percentage =
      totalDays > 0 ? ((entry.value / totalDays) * 100).toFixed(1) : 0;
    return `${entry.name}: ${percentage}%`;
  };

  return (
    <Card
      className="mb-4"
      style={{
        height: "500px",
        border: "none",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Card.Header
        className="sticky-top"
        style={{
          background: "linear-gradient(135deg, #0080ff 0%, #0056b3 100%)",
          color: "white",
          marginBottom: 0,
          padding: "16px 20px",
          fontSize: "18px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <FaChartLine size={20} />
        Student Attendance
        <div style={{ flex: 1 }}></div>
        <Link to="/student/view-attendance" style={{ textDecoration: "none" }}>
          <Button
            variant="outline-light"
            size="sm"
            style={{
              fontSize: "12px",
              fontWeight: "600",
              padding: "4px 12px",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              color: "white",
              backgroundColor: "transparent",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.borderColor = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)";
            }}
          >
            <FaClock size={12} style={{ marginRight: "4px" }} />
            View Details
          </Button>
        </Link>
      </Card.Header>
      <div
        style={{
          height: "calc(100% - 56px)",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Student ID Missing */}
        {!studentId && !attendanceLoading && (
          <div style={{ padding: "20px" }}>
            <Alert variant="warning">
              <Alert.Heading>Student ID Missing</Alert.Heading>
              <p className="mb-0">Unable to identify student. Please log in again.</p>
            </Alert>
          </div>
        )}

        {/* Loading State */}
        {attendanceLoading && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3" style={{ color: "#666" }}>
              Loading attendance data...
            </p>
          </div>
        )}

        {/* Error State - Only show if it's a real error, not 204/no data */}
        {attendanceError && !attendanceLoading && studentId && (
          <div style={{ padding: "20px" }}>
            <Alert variant="danger">
              <Alert.Heading>Error Loading Attendance</Alert.Heading>
              <p className="mb-0">{attendanceError}</p>
            </Alert>
          </div>
        )}

        {/* No Data State */}
        {!attendanceLoading &&
          !attendanceError &&
          studentId &&
          (!apiAttendanceData ||
            !Array.isArray(apiAttendanceData) ||
            apiAttendanceData.length === 0) && (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
              <h5 style={{ color: "#666", marginBottom: "8px" }}>
                No Attendance Records Found
              </h5>
              <p style={{ color: "#999", fontSize: "14px", textAlign: "center" }}>
                No attendance records available. Attendance data will appear here once
                records are added.
              </p>
            </div>
          )}

        {/* Content - Show when we have data */}
        {!attendanceLoading &&
          !attendanceError &&
          studentId &&
          apiAttendanceData &&
          Array.isArray(apiAttendanceData) &&
          apiAttendanceData.length > 0 && (
            <>
              {/* Month Selection Dropdown */}
              <div style={{ marginBottom: "16px" }}>
                <Form.Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={{
                    width: "200px",
                    fontSize: "14px",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    padding: "6px 12px",
                  }}
                >
                  {availableMonths.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </Form.Select>
              </div>

              {/* Summary Stats */}
              <Row className="mb-3">
                <Col xs={4}>
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "#e7f3ff",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      Total Days
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#0080ff",
                      }}
                    >
                      {totalDays}
                    </div>
                  </div>
                </Col>
                <Col xs={4}>
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "#d4edda",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      Present
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#28a745",
                      }}
                    >
                      {presentCount}
                    </div>
                  </div>
                </Col>
                <Col xs={4}>
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "#f8d7da",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      Absent
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#dc3545",
                      }}
                    >
                      {absentCount}
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Pie Chart */}
              <div style={{ flex: 1, minHeight: "200px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: "12px" }}
                      iconType="circle"
                      formatter={(value) => value}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
      </div>
    </Card>
  );
};

export default StudentAttendanceChart;

