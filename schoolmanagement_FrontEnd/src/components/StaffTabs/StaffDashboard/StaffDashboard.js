import React, { useState, useEffect } from "react";
import { Row, Col, Dropdown } from "react-bootstrap";
import Select from "react-select";
import { Link } from "react-router-dom";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBell,
  FaCalendarAlt, FaCheckCircle,
  FaBookOpen,
  FaClipboardList,
  FaClock, FaGripLinesVertical,
} from "react-icons/fa";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ApiUrl } from "../../ApiUrl";

const Dashboard = () => {
  // Updated class data with from–to time
  const classes = [
    { timeFrom: "09:00 AM", timeTo: "10:00 AM", subject: "Mathematics", teacher: "Dr. Anita Sharma" },
    { timeFrom: "10:30 AM", timeTo: "11:30 AM", subject: "Physics", teacher: "Mr. Rajeev Singh" },
    { timeFrom: "12:00 PM", timeTo: "01:00 PM", subject: "Computer Science", teacher: "Prof. Michael Johnson" },
    { timeFrom: "02:00 PM", timeTo: "03:00 PM", subject: "English Literature", teacher: "Ms. Priya Das" },
  ];

  return (
    <div className="container-fluid">
      <Row>
        <Col>
          <div className="card p-0">
            <div className="card-body">
              {/* Teacher Details */}
              <Row className="mb-4">
                {/* Enhanced Teacher Card */}
                <Col md={4} className="mb-3 d-flex">
                  <div
                    className="rounded-4 p-4 shadow-sm hover:shadow-lg transition-all duration-300 w-100 d-flex flex-column justify-between"
                    style={{
                      background: "white",
                      minHeight: "100%",
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="position-relative">
                        <img
                          src="https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk"
                          alt="Teacher"
                          className="rounded-circle border border-3 border-primary shadow-sm"
                          style={{ width: "80px", height: "80px", objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <h5 className="fw-bold text-primary d-flex align-items-center gap-2 mb-1">
                          <FaChalkboardTeacher className="text-primary" size={20} />
                          Prof. Michael Johnson
                        </h5>
                        <p className="text-muted mb-0 small" style={{ fontSize: "14px", lineHeight: "1.4" }}>
                          Senior Professor, Computer Science Dept.
                        </p>
                      </div>
                    </div>

                    {/* Centered badge */}
                    <div className="d-flex justify-content-center mt-3">
                      <span
                        className="bg-primary text-white rounded-pill px-3 py-1"
                        style={{ fontSize: "12px", fontWeight: "500" }}
                      >
                        Head of Department
                      </span>
                    </div>

                    <div className="mt-3 text-muted small text-center" style={{ fontSize: "13px", opacity: "0.8" }}>
                      Teaching since 2005 | Expert in AI & Data Science
                    </div>
                  </div>
                </Col>

                {/* Total Classes */}
                <Col md={4} className="mb-3 d-flex">
                  <div
                    className="rounded-4 p-4 shadow-sm hover:shadow-lg transition-all duration-300 w-100 d-flex flex-column justify-between"
                    style={{
                      background: "linear-gradient(135deg, #bbf7d0, #dcfce7)",
                      minHeight: "100%",
                    }}
                  >
                    <div className="d-flex align-items-start gap-3">
                      <div
                        style={{
                          background: "#22c55e",
                          borderRadius: "12px",
                          padding: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaBookOpen color="#fff" size={20} />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="text-success fw-semibold mb-1" style={{ fontSize: "14px" }}>
                          Total Classes
                        </h6>
                        <h2 className="fw-bold text-success mb-1">24</h2>
                        <p className="text-muted mb-2" style={{ fontSize: "13px" }}>Active this semester</p>
                        <div className="d-flex align-items-center justify-content-between text-success fw-medium" style={{ fontSize: "14px" }}>
                          <span className="d-flex align-items-center gap-2">
                            <FaBookOpen size={14} />
                            18 Ongoing
                          </span>

                          <FaGripLinesVertical size={14} className="text-secondary" />

                          <span className="d-flex align-items-center gap-2">
                            <FaBookOpen size={14} />
                            6 Completed
                          </span>
                        </div>


                      </div>
                    </div>
                    <a
                      href="#"
                      className="text-primary mt-3 d-inline-block text-decoration-underline"
                      style={{ fontSize: "13px" }}
                    >
                      View all classes ➜
                    </a>
                  </div>
                </Col>
                {/* Pending Assignments */}
                {/* <Col md={4} className="mb-3 d-flex">
                  <div
                    className="rounded-4 p-4 shadow-sm hover:shadow-lg transition-all duration-300 w-100 d-flex flex-column justify-between"
                    style={{
                      background: "linear-gradient(135deg, #e9d5ff, #f3e8ff)",
                      minHeight: "100%",
                    }}
                  >
                    <div className="d-flex align-items-start gap-3">
                      <div
                        style={{
                          background: "#a855f7",
                          borderRadius: "12px",
                          padding: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaClipboardList color="#fff" size={20} />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="text-purple fw-semibold mb-1" style={{ fontSize: "14px" }}>
                          Pending Assignments
                        </h6>
                        <h2 className="fw-bold text-purple mb-1">12</h2>
                        <p className="text-muted mb-2" style={{ fontSize: "13px" }}>To be reviewed</p>
                        <div className="d-flex align-items-center justify-content-between text-purple fw-medium" style={{ fontSize: "14px" }}>
                          <span className="d-flex align-items-center gap-2">
                            <FaClipboardList size={14} />
                            8 New
                          </span>

                          <FaGripLinesVertical size={14} className="text-secondary" />

                          <span className="d-flex align-items-center gap-2">
                            <FaClipboardList size={14} />
                            4 Overdue
                          </span>
                        </div>
                      </div>
                    </div>
                    <a
                      href="#"
                      className="text-primary mt-3 d-inline-block text-decoration-underline"
                      style={{ fontSize: "13px" }}
                    >
                      Review assignments ➜
                    </a>
                  </div>
                </Col> */}
              </Row>
              {/* Progress and Notifications */}
              <Row className="mb-4">
                {/* Student Progress */}
                <Col md={6} className="d-flex">
                  <div
                    style={{
                      ...sectionCardStyle,
                      width: "100%",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    className="d-flex flex-column h-100"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)";
                    }}
                  >
                    {/* Header */}
                    <div style={cardHeaderStyle}>
                      <span
                        style={{
                          fontWeight: "700",
                          fontSize: "18px",
                          color: "#1e293b",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          letterSpacing: "0.3px",
                        }}
                      >
                        <FaCalendarAlt style={{ color: "#3b82f6", fontSize: "20px" }} />
                        Teacher Progress
                      </span>
                    </div>

                    {/* Progress Circle */}
                    <div style={{ marginTop: "24px", textAlign: "center", flexGrow: 1 }}>
                      <div
                        style={{
                          width: 200,
                          height: 200,
                          margin: "0 auto",
                          transition: "transform 0.4s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <CircularProgressbarWithChildren
                          value={89.2}
                          styles={buildStyles({
                            pathColor: "#ef4444",
                            trailColor: "#e5e7eb",
                            pathTransitionDuration: 1.5,
                            strokeLinecap: "round",
                          })}
                        >
                          <div
                            style={{
                              fontSize: "24px",
                              fontWeight: "700",
                              color: "#1e293b",
                              marginTop: "-5px",
                              letterSpacing: "0.5px",
                            }}
                          >
                            89.2%
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#6b7280",
                              marginTop: "4px",
                            }}
                          >
                            Overall Score
                          </div>
                        </CircularProgressbarWithChildren>
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#4b5563",
                          marginTop: "16px",
                          letterSpacing: "0.2px",
                        }}
                      >
                        You're doing amazing!
                      </div>
                    </div>
                  </div>
                </Col>
                {/* Today's Classes */}
                <Col md={6} className="d-flex">
                  <div
                    style={{
                      background: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)",
                      borderRadius: "16px",
                      padding: "24px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.4s ease, box-shadow 0.4s ease",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                    }}
                    className="d-flex flex-column h-100"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    {/* Title */}
                    <h6
                      style={{
                        fontWeight: "700",
                        fontSize: "20px",
                        color: "#1e293b",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        letterSpacing: "0.3px",
                        borderBottom: "1px solid rgba(59, 130, 246, 0.2)",
                        paddingBottom: "8px",
                      }}
                    >
                      <FaChalkboardTeacher style={{ color: "#2563eb", fontSize: "24px" }} />
                      Today's Classes
                    </h6>

                    {/* Class List Scroll Area */}
                    <div
                      style={{
                        overflowY: "auto",
                        maxHeight: "320px",
                        paddingRight: "8px",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#60a5fa #f1f5f9",
                      }}
                      className="custom-scrollbar"
                    >
                      {classes.map((cls, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "16px 20px",
                            borderRadius: "12px",
                            background: "linear-gradient(to right, #ffffff, #f8fafc)",
                            border: `1px solid ${cls.color || "#e5e7eb"}`,
                            marginBottom: "12px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `linear-gradient(to right, ${cls.color || "#e0f2fe"}10, ${cls.color || "#bfdbfe"
                              }20)`;
                            e.currentTarget.style.transform = "scale(1.03)";
                            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.12)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "linear-gradient(to right, #ffffff, #f8fafc)";
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.06)";
                          }}
                        >
                          {/* Left Side: Subject & Teacher */}
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: "17px",
                                fontWeight: "600",
                                color: cls.color || "#1e293b",
                                letterSpacing: "0.2px",
                              }}
                            >
                              {cls.subject}
                            </div>
                            <div
                              style={{
                                fontSize: "14px",
                                color: "#6b7280",
                                marginTop: "4px",
                              }}
                            >
                              {cls.teacher}
                            </div>
                          </div>

                          {/* Time Badge */}
                          <div
                            style={{
                              background: cls.color
                                ? `linear-gradient(to right, ${cls.color}, ${cls.color}CC)`
                                : "linear-gradient(to right, #3b82f6, #60a5fa)",
                              padding: "8px 14px",
                              borderRadius: "24px",
                              fontSize: "14px",
                              color: "#ffffff",
                              fontWeight: "500",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              whiteSpace: "nowrap",
                              boxShadow: "0 3px 10px rgba(0, 0, 0, 0.15)",
                              transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.08)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                          >
                            <FaClock style={{ fontSize: "14px" }} />
                            {cls.timeFrom} - {cls.timeTo}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer link */}
                    <div style={{ textAlign: "right", marginTop: "auto", paddingTop: "12px" }}>
                      <a
                        href="#"
                        style={{
                          color: "#2563eb",
                          fontSize: "15px",
                          fontWeight: "600",
                          textDecoration: "none",
                          transition: "color 0.3s ease, transform 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#1e40af";
                          e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#2563eb";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        View Full Timetable
                      </a>
                    </div>
                  </div>
                </Col>
              </Row>
              {/* Recent Activities */}
              <Row className="mb-4">
                <Col md={6} className="mb-4 d-flex">
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: "12px",
                      padding: "20px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    <h6
                      style={{
                        fontWeight: "600",
                        fontSize: "18px",
                        color: "#1a202c",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        borderBottom: "1px solid #edf2f7",
                        paddingBottom: "8px",
                      }}
                    >
                      <span style={{ fontSize: "20px" }}>🕘</span> Recent Activities
                    </h6>

                    <div
                      style={{
                        overflowY: "auto",
                        maxHeight: "320px",
                        paddingRight: "8px",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#a0aec0 #edf2f7",
                      }}
                    >
                      {[
                        { time: "Just now", message: "John submitted his assignment", icon: <FaClipboardList size={16} /> },
                        { time: "20 mins ago", message: "New notice: Semester II results published", icon: <FaBell size={16} /> },
                        { time: "1 hour ago", message: "Priya completed Physics quiz", icon: <FaCheckCircle size={16} /> },
                        { time: "Yesterday", message: "English class was rescheduled", icon: <FaCalendarAlt size={16} /> },
                        { time: "2 days ago", message: "New student registered: Rahul Verma", icon: <FaUserGraduate size={16} /> },
                      ].map((item, i) => (
                        <div
                          key={i}
                          style={{
                            marginBottom: "12px",
                            padding: "12px 16px",
                            borderRadius: "8px",
                            background: "#f7fafc",
                            borderLeft: "4px solid #38bdf8",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#e6f3ff";
                            e.currentTarget.style.transform = "translateY(-2px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#f7fafc";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          <div style={{ color: "#38bdf8" }}>{item.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "14px", color: "#4a5568", fontWeight: "500" }}>{item.time}</div>
                            <div style={{ fontWeight: "600", fontSize: "15px", color: "#2d3748" }}>{item.message}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Col>
                {/* Quick Actions */}
                <Col md={6} className="mb-4 d-flex">
                  <div
                    style={{
                      background: "linear-gradient(145deg, #ffffff, #f9fafc)",
                      borderRadius: "16px",
                      padding: "24px",
                      boxShadow: "0 8px 28px rgba(0, 0, 0, 0.1)",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.4s ease, box-shadow 0.4s ease",
                      border: "1px solid rgba(229, 231, 235, 0.5)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow = "0 16px 40px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 8px 28px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    <h6
                      style={{
                        fontWeight: "700",
                        fontSize: "20px",
                        color: "#1a202c",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        borderBottom: "1px solid #e5e7eb",
                        paddingBottom: "8px",
                      }}
                    >
                      <span style={{ fontSize: "24px", color: "#3b82f6" }}>⚡</span> Quick Actions
                    </h6>

                    {/* Actions Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                        gap: "16px",
                      }}
                    >
                      {[
                        { icon: <FaUserGraduate size={24} />, label: "Add Student", color: "#10b981" },
                        { icon: <FaChalkboardTeacher size={24} />, label: "Schedule Class", color: "#f59e0b" },
                        { icon: <FaClipboardList size={24} />, label: "Upload Assignment", color: "#ef4444" },
                        { icon: <FaBell size={24} />, label: "Send Notification", color: "#3b82f6" },
                      ].map((action, i) => (
                        <button
                          key={i}
                          style={{
                            background: "#ffffff",
                            border: `1px solid ${action.color}40`,
                            borderRadius: "12px",
                            padding: "16px 12px",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "10px",
                            cursor: "pointer",
                            fontSize: "14px",
                            color: "#1e293b",
                            fontWeight: "600",
                            transition: "all 0.3s ease",
                            boxShadow: "0 3px 8px rgba(0, 0, 0, 0.06)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${action.color}10`;
                            e.currentTarget.style.borderColor = action.color;
                            e.currentTarget.style.transform = "scale(1.08)";
                            e.currentTarget.style.boxShadow = `0 6px 16px ${action.color}30`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#ffffff";
                            e.currentTarget.style.borderColor = `${action.color}40`;
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 3px 8px rgba(0, 0, 0, 0.06)";
                          }}
                        >
                          <div style={{ color: action.color, transition: "transform 0.3s ease" }} className="hover:scale-110">
                            {action.icon}
                          </div>
                          <span>{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const summaryTextStyle = { fontSize: "16px", fontWeight: "600" };
const summaryValueStyle = { marginTop: "5px", fontWeight: "700" };
const sectionCardStyle = {
  transition: "all 0.3s ease",
  borderRadius: "20px",
  padding: "24px",
  background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
};

const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: "12px",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const summaryCardStyle = (startColor, endColor) => ({
  background: `linear-gradient(135deg, ${startColor}, ${endColor})`,
  padding: "20px",
  borderRadius: "16px",
  color: "#1f2937",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  display: "flex",
  alignItems: "center",
  gap: "15px",
});

export default Dashboard;