import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaBookOpen,
  FaClipboardList,
  FaClock,
  FaGripLinesVertical,
} from "react-icons/fa";
import { ApiUrl } from "../../ApiUrl";

const Dashboard = () => {
  // Updated class data with from–to time
  const classes = [
    {
      timeFrom: "09:00 AM",
      timeTo: "10:00 AM",
      subject: "Mathematics",
      teacher: "Dr. Anita Sharma",
    },
    {
      timeFrom: "10:30 AM",
      timeTo: "11:30 AM",
      subject: "Physics",
      teacher: "Mr. Rajeev Singh",
    },
    {
      timeFrom: "12:00 PM",
      timeTo: "01:00 PM",
      subject: "Computer Science",
      teacher: "Prof. Michael Johnson",
    },
    {
      timeFrom: "02:00 PM",
      timeTo: "03:00 PM",
      subject: "English Literature",
      teacher: "Ms. Priya Das",
    },
  ];

  const [teacherProfile, setTeacherProfile] = useState(null);
  const [classStats, setClassStats] = useState({
    total: 0,
    ongoing: 0,
    completed: 0,
  });

  // Initialize academic session ID if not present
  useEffect(() => {
    const initializeAcademicYear = async () => {
      const orgId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
      const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");

      let academicSessionId = localStorage.getItem("academicSessionId");

      // Only fetch if academicSessionId is missing
      if (!academicSessionId && orgId && branchId) {
        try {
          console.log("Fetching academic years to initialize session...");
          const response = await fetch(
            `${ApiUrl.apiurl}AcademicYear/GetAllAcademicYear/?organization_id=${orgId}&branch_id=${branchId}`
          );
          const data = await response.json();

          if (data?.data?.length > 0) {
            const currentDate = new Date();
            const currentYear = data.data.find((year) => {
              const dateFrom = new Date(year.date_from);
              const dateTo = new Date(year.date_to);
              return currentDate >= dateFrom && currentDate <= dateTo;
            });

            const selectedYear = currentYear || data.data[0];
            localStorage.setItem("academicSessionId", selectedYear.id);
            console.log("✅ Academic session ID initialized:", selectedYear.id);
          }
        } catch (error) {
          console.error("❌ Error fetching academic years:", error);
        }
      } else if (academicSessionId) {
        console.log("✅ Academic session ID already set:", academicSessionId);
      }
    };

    initializeAcademicYear();
  }, []);

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const orgId = sessionStorage.getItem("organization_id");
        const branchId = sessionStorage.getItem("branch_id");

        if (!userId || !orgId || !branchId) {
          console.warn(
            "Missing userId, organization_id, or branch_id in session storage"
          );
          return;
        }

        const response = await fetch(
          `${ApiUrl.apiurl}STAFF/RegistrationBasicDetailsRetrieve/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${userId}`
        );
        const result = await response.json();

        if (response.ok && result?.data) {
          setTeacherProfile(result.data);
        } else {
          console.error("Failed to fetch teacher profile:", result);
        }
      } catch (error) {
        console.error("Error fetching teacher profile:", error);
      }
    };

    const fetchClassStats = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const orgId = sessionStorage.getItem("organization_id");
        const branchId = sessionStorage.getItem("branch_id");
        const academicYearId = localStorage.getItem("academicSessionId");

        if (!userId || !orgId || !branchId || !academicYearId) {
          console.warn("Missing required IDs for class stats");
          return;
        }

        const response = await fetch(
          `${ApiUrl.apiurl}LECTURE_PLAN/GetProfessorLecturePlanSearchList/?organization_id=${orgId}&branch_id=${branchId}&professor_id=${userId}&academic_year_id=${academicYearId}`
        );
        if (response.status === 204) {
          setClassStats({ total: 0, ongoing: 0, completed: 0 });
          return;
        }

        const result = await response.json();

        if (response.ok && result?.data) {
          const total = result.data.length;
          const completed = result.data.filter(
            (item) => item.taught_date
          ).length;
          const ongoing = total - completed;

          setClassStats({ total, ongoing, completed });
        }
      } catch (error) {
        console.error("Error fetching class stats:", error);
      }
    };

    fetchTeacherProfile();
    fetchClassStats();
  }, []);

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
                        {teacherProfile?.profile ? (
                          <img
                            src={teacherProfile.profile}
                            alt="Profile"
                            className="rounded-circle border border-3 border-primary shadow-sm"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="rounded-circle border border-3 border-primary shadow-sm d-flex align-items-center justify-content-center bg-light text-primary"
                            style={{
                              width: "80px",
                              height: "80px",
                              fontSize: "30px",
                              fontWeight: "bold",
                            }}
                          >
                            {teacherProfile?.first_name?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                      <div>
                        <h5 className="fw-bold text-primary d-flex align-items-center gap-2 mb-1">
                          <FaChalkboardTeacher
                            className="text-primary"
                            size={20}
                          />
                          {teacherProfile
                            ? `${teacherProfile.first_name} ${teacherProfile.last_name || ""
                            }`
                            : "Loading..."}
                        </h5>
                        <p
                          className="text-muted mb-0 small"
                          style={{ fontSize: "14px", lineHeight: "1.4" }}
                        >
                          {teacherProfile?.highest_qualification || ""}
                        </p>
                        <p
                          className="text-muted mb-0 small"
                          style={{ fontSize: "12px" }}
                        >
                          {teacherProfile?.email || ""}
                        </p>
                      </div>
                    </div>

                    {/* Centered badge */}
                    {teacherProfile?.employee_type && (
                      <div className="d-flex justify-content-center mt-3">
                        <span
                          className="bg-primary text-white rounded-pill px-3 py-1"
                          style={{ fontSize: "12px", fontWeight: "500" }}
                        >
                          {teacherProfile.employee_type}
                        </span>
                      </div>
                    )}

                    <div
                      className="mt-3 text-muted small text-center"
                      style={{ fontSize: "13px", opacity: "0.8" }}
                    >
                      {teacherProfile?.date_of_joining
                        ? `Joined: ${new Date(
                          teacherProfile.date_of_joining
                        ).toLocaleDateString()}`
                        : ""}
                    </div>
                  </div>
                </Col>

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
                        <h6
                          className="text-success fw-semibold mb-1"
                          style={{ fontSize: "14px" }}
                        >
                          Total Classes
                        </h6>
                        <h2 className="fw-bold text-success mb-1">{classStats.total}</h2>
                        <p
                          className="text-muted mb-2"
                          style={{ fontSize: "13px" }}
                        >
                          Active this semester
                        </p>
                        <div
                          className="d-flex align-items-center justify-content-between text-success fw-medium"
                          style={{ fontSize: "14px" }}
                        >
                          <span className="d-flex align-items-center gap-2">
                            <FaBookOpen size={14} />
                            {classStats.ongoing} Ongoing
                          </span>

                          <FaGripLinesVertical
                            size={14}
                            className="text-secondary"
                          />

                          <span className="d-flex align-items-center gap-2">
                            <FaBookOpen size={14} />{classStats.completed} Completed
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
                {/* Assignments & Lesson Plan */}
                <Col md={4} className="mb-3 d-flex">
                  <div
                    className="rounded-4 p-4 shadow-sm hover:shadow-lg transition-all duration-300 w-100 d-flex flex-column"
                    style={{
                      background: "linear-gradient(145deg, #ffffff, #f9fafc)",
                      borderRadius: "16px",
                      padding: "24px",
                      boxShadow: "0 8px 28px rgba(0, 0, 0, 0.1)",
                      width: "100%",
                      minHeight: "100%",
                      transition: "transform 0.4s ease, box-shadow 0.4s ease",
                      border: "1px solid rgba(229, 231, 235, 0.5)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow =
                        "0 16px 40px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 28px rgba(0, 0, 0, 0.1)";
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
                      <span style={{ fontSize: "24px", color: "#6366f1" }}>
                        🚀
                      </span>{" "}
                      Actions
                    </h6>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                        gap: "16px",
                        flexGrow: 1,
                        alignContent: "center",
                      }}
                    >
                      <Link
                        to="/staff/assignment-entry"
                        style={{ textDecoration: "none" }}
                      >
                        <div
                          style={{
                            background: "#ffffff",
                            border: "1px solid #ef444440",
                            borderRadius: "12px",
                            padding: "20px 12px",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "12px",
                            cursor: "pointer",
                            fontSize: "15px",
                            color: "#1e293b",
                            fontWeight: "600",
                            transition: "all 0.3s ease",
                            boxShadow: "0 3px 8px rgba(0, 0, 0, 0.06)",
                            height: "100%",
                            justifyContent: "center",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#ef444410";
                            e.currentTarget.style.borderColor = "#ef4444";
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow =
                              "0 6px 16px rgba(239, 68, 68, 0.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#ffffff";
                            e.currentTarget.style.borderColor = "#ef444440";
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow =
                              "0 3px 8px rgba(0, 0, 0, 0.06)";
                          }}
                        >
                          <div style={{ color: "#ef4444" }}>
                            <FaClipboardList size={28} />
                          </div>
                          <span>Upload Assignment</span>
                        </div>
                      </Link>

                      <Link
                        to="/staff/lesson-plan"
                        style={{ textDecoration: "none" }}
                      >
                        <div
                          style={{
                            background: "#ffffff",
                            border: "1px solid #3b82f640",
                            borderRadius: "12px",
                            padding: "20px 12px",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "12px",
                            cursor: "pointer",
                            fontSize: "15px",
                            color: "#1e293b",
                            fontWeight: "600",
                            transition: "all 0.3s ease",
                            boxShadow: "0 3px 8px rgba(0, 0, 0, 0.06)",
                            height: "100%",
                            justifyContent: "center",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#3b82f610";
                            e.currentTarget.style.borderColor = "#3b82f6";
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow =
                              "0 6px 16px rgba(59, 130, 246, 0.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#ffffff";
                            e.currentTarget.style.borderColor = "#3b82f640";
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow =
                              "0 3px 8px rgba(0, 0, 0, 0.06)";
                          }}
                        >
                          <div style={{ color: "#3b82f6" }}>
                            <FaBookOpen size={28} />
                          </div>
                          <span>Lesson Plan</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
              {/* Today's Classes - Full Width */}
              < Row className="mb-4" >
                < Col md={12} className="d-flex" >
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)",
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
                      e.currentTarget.style.boxShadow =
                        "0 15px 40px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 30px rgba(0, 0, 0, 0.1)";
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
                      <FaChalkboardTeacher
                        style={{ color: "#2563eb", fontSize: "24px" }}
                      />
                      Today's Classes
                    </h6>

                    {/* Class List Scroll Area */}
                    <div
                      style={{
                        overflowY: "auto",
                        maxHeight: "1000px",
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
                            background:
                              "linear-gradient(to right, #ffffff, #f8fafc)",
                            border: `1px solid ${cls.color || "#e5e7eb"}`,
                            marginBottom: "12px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `linear-gradient(to right, ${cls.color || "#e0f2fe"
                              }10, ${cls.color || "#bfdbfe"}20)`;
                            e.currentTarget.style.transform = "scale(1.03)";
                            e.currentTarget.style.boxShadow =
                              "0 8px 20px rgba(0, 0, 0, 0.12)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "linear-gradient(to right, #ffffff, #f8fafc)";
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 12px rgba(0, 0, 0, 0.06)";
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
                    <div
                      style={{
                        textAlign: "right",
                        marginTop: "auto",
                        paddingTop: "12px",
                      }}
                    >
                      <Link
                        to="/staff/staff-time-table"
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
                      </Link>
                    </div>
                  </div>
                </Col >
              </Row >

            </div >
          </div >
        </Col >
      </Row >
    </div >
  );
};



export default Dashboard;
