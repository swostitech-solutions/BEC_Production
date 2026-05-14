
import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  ListGroup,
  Row,
  Col,
  Button,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaBell,
  FaTrophy,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import useStudentDetails from "../../components/hooks/useStudentDetails";
import useStudentCirculars from "../../components/hooks/useStudentCirculars";
import useStudentFeeFilterData from "../../components/hooks/useStudentFeeFilterData";
import useStudentAttendance from "../../components/hooks/useStudentAttendance";
import StudentAttendanceChart from "../../components/StudentTabs/StudentAttendanceChart/StudentAttendanceChart";
// import "./Dashboards.css";

const toNumber = (value) => Number(value) || 0;

const isDiscountLikeFee = (item) => {
  const elementName = String(item?.element_name || "").toLowerCase();

  return (
    toNumber(item?.element_amount) < 0 ||
    toNumber(item?.paid_amount) < 0 ||
    /discount|scholarship|merit/.test(elementName)
  );
};

const getDiscountValue = (item) => {
  const elementAmount = toNumber(item?.element_amount);
  const paidAmount = toNumber(item?.paid_amount);
  const explicitDiscount = Math.max(
    0,
    toNumber(item?.discount || item?.element_discount_amount)
  );
  const elementName = String(item?.element_name || "").toLowerCase();
  const isNamedDiscount = /discount|scholarship|merit/.test(elementName);

  if (explicitDiscount > 0) {
    return explicitDiscount;
  }

  if (!isDiscountLikeFee(item)) {
    return 0;
  }

  if (isNamedDiscount) {
    return Math.max(Math.abs(elementAmount), Math.abs(paidAmount));
  }

  return Math.max(
    Math.abs(Math.min(elementAmount, 0)),
    Math.abs(Math.min(paidAmount, 0))
  );
};

const buildOutstandingSummary = (feedetails = []) => {
  if (!Array.isArray(feedetails) || feedetails.length === 0) {
    return null;
  }

  const semesterGroups = {};

  feedetails.forEach((fee) => {
    const semesterKey = `semester_${fee.semester_id || fee.semester || "default"}`;

    if (!semesterGroups[semesterKey]) {
      semesterGroups[semesterKey] = [];
    }

    semesterGroups[semesterKey].push(fee);
  });

  const semesterSummaries = Object.values(semesterGroups).map((subFees) => {
    const aggregatedMap = {};

    subFees.forEach((subFee) => {
      const dedupeKey = [
        subFee.semester_id ?? "",
        subFee.academic_year_id ?? "",
        String(subFee.element_name || "").trim().toUpperCase(),
      ].join("|");

      if (!aggregatedMap[dedupeKey]) {
        aggregatedMap[dedupeKey] = {
          ...subFee,
          element_amount: toNumber(subFee.element_amount),
          paid_amount: toNumber(subFee.paid_amount),
          discount: getDiscountValue(subFee),
        };
        return;
      }

      aggregatedMap[dedupeKey].element_amount += toNumber(subFee.element_amount);
      aggregatedMap[dedupeKey].paid_amount += toNumber(subFee.paid_amount);
      aggregatedMap[dedupeKey].discount += getDiscountValue(subFee);
    });

    const normalizedSubFees = Object.values(aggregatedMap).filter((item) => {
      const balance =
        toNumber(item.element_amount) -
        toNumber(item.paid_amount) -
        toNumber(item.discount);

      return (
        toNumber(item.element_amount) !== 0 ||
        toNumber(item.paid_amount) !== 0 ||
        toNumber(item.discount) !== 0 ||
        balance !== 0
      );
    });

    const totals = normalizedSubFees.reduce(
      (acc, subFee) => {
        const elementAmount = toNumber(subFee.element_amount);
        const paidAmount = toNumber(subFee.paid_amount);
        const discountAmount = toNumber(subFee.discount);
        const isDiscountEntry = isDiscountLikeFee(subFee);

        return {
          totalAmount: acc.totalAmount + (isDiscountEntry ? 0 : elementAmount),
          totalPaid: acc.totalPaid + paidAmount,
          totalDiscount: acc.totalDiscount + discountAmount,
        };
      },
      { totalAmount: 0, totalPaid: 0, totalDiscount: 0 }
    );

    return {
      ...totals,
      totalDue: Math.max(
        totals.totalAmount - totals.totalPaid - totals.totalDiscount,
        0
      ),
    };
  });

  return semesterSummaries.reduce(
    (acc, semester) => ({
      totalAmount: acc.totalAmount + semester.totalAmount,
      totalPaid: acc.totalPaid + semester.totalPaid,
      totalDiscount: acc.totalDiscount + semester.totalDiscount,
      balance: acc.balance + semester.totalDue,
    }),
    { totalAmount: 0, totalPaid: 0, totalDiscount: 0, balance: 0 }
  );
};

function Dashboard() {
  // Get student ID from sessionStorage (consistent with other student components)
  const studentId = sessionStorage.getItem("userId");

  // Fetch student details using the hook
  const { studentDetails, loading: studentLoading, error: studentError } = useStudentDetails(studentId);



  // Extract student basic details
  const basicDetails = studentDetails?.student_basic_details;
  const collegeAdmissionNo =
    basicDetails?.college_admission_no ||
    basicDetails?.admission_no ||
    sessionStorage.getItem("college_admission_no") ||
    "";

  const [upcomingSemesters, setUpcomingSemesters] = useState([]);

  useEffect(() => {
    if (basicDetails) {
      let displayTitle = "";
      let description = "Examination results and academic performance";

      // Check if semester is default (case insensitive check for 'default' string)
      const semesterName = basicDetails.semester_description || "";
      const isDefault = semesterName.toLowerCase().includes("default");

      if (isDefault) {
        displayTitle = basicDetails.academic_year || "Academic Year";
      } else {
        displayTitle = semesterName;
      }

      setUpcomingSemesters([
        {
          semester: displayTitle,
          description: description,
        }
      ]);
    }
  }, [basicDetails]);

  const getRandomDate = () => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 90)); // Adding random days up to 90 for the quarter duration
    return endDate.toDateString();
  };

  // Fetch real attendance data from API
  const {
    attendanceData: apiAttendanceData,
    loading: attendanceLoading,
    error: attendanceError,
  } = useStudentAttendance({
    student_id: studentId,
    enabled: !!studentId,
  });

  // Calculate attendance statistics from real API data
  const attendanceStats = React.useMemo(() => {
    if (!apiAttendanceData || !Array.isArray(apiAttendanceData) || apiAttendanceData.length === 0) {
      return {
        totalDays: 0,
        present: 0,
        absent: 0,
        percentage: 0,
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

    const totalDays = present + absent;
    const percentage = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;

    return {
      totalDays,
      present,
      absent,
      percentage,
    };
  }, [apiAttendanceData]);



  // Fetch circulars using student's class information
  const {
    circulars,
    loading: circularsLoading,
    error: circularsError,
  } = useStudentCirculars({
    course_id: basicDetails?.course_id,
    academic_year_id: basicDetails?.academic_year_id,
    semester_id: basicDetails?.semester_id,
    section_id: basicDetails?.section_id,
    batch_id: basicDetails?.batch_id,
    enabled: !!(
      basicDetails?.course_id &&
      basicDetails?.academic_year_id &&
      basicDetails?.section_id
    ),
  });

  const {
    feedetails = [],
    loading: feeFilterLoading,
  } = useStudentFeeFilterData(collegeAdmissionNo);

  const outstandingSummary = React.useMemo(
    () => buildOutstandingSummary(feedetails),
    [feedetails]
  );

  const dashboardDueAmount = Math.max(
    toNumber(outstandingSummary?.balance),
    0
  );

  const hasAssignedFees = !!outstandingSummary && (
    outstandingSummary.totalAmount > 0 ||
    outstandingSummary.totalDiscount > 0 ||
    outstandingSummary.totalPaid > 0
  );

  const feeDueValue = feeFilterLoading
    ? "..."
    : hasAssignedFees
      ? (dashboardDueAmount > 0 ? `Rs. ${dashboardDueAmount.toFixed(2)}` : "Paid")
      : "N/A";

  const feeDueColor = dashboardDueAmount > 0
    ? "#dc3545"
    : hasAssignedFees
      ? "#28a745"
      : "#6c757d";

  const feeDueBgColor = dashboardDueAmount > 0
    ? "#f8d7da"
    : hasAssignedFees
      ? "#d4edda"
      : "#e2e3e5";

  const feeDueSubtitle = feeFilterLoading
    ? "Checking..."
    : dashboardDueAmount > 0
      ? "Due"
      : hasAssignedFees
        ? "All Clear"
        : "No Info";

  // Format date for display
  const formatCircularDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Quick stats data
  const quickStats = [
    {
      icon: <FaCalendarCheck size={32} />,
      title: "Attendance",
      value: attendanceLoading ? "..." : attendanceError ? "N/A" : `${attendanceStats.percentage}%`,
      color: "#28a745",
      bgColor: "#d4edda",
      link: "/student/view-attendance",
    },
    {
      icon: <FaMoneyBillWave size={32} />,
      value: feeDueValue,
      color: feeDueColor,
      bgColor: feeDueBgColor,
      subtitle: feeDueSubtitle,
      link: "/student/payment-gateway",
    },
    {
      icon: <FaBell size={32} />,
      title: "Notifications",
      value: circulars?.length || 0,
      color: "#0080ff",
      bgColor: "#e7f3ff",
      subtitle: "New",
      link: "#notifications",
    },
  ];

  return (
    <Container fluid style={{ width: "100%", backgroundColor: "rgba(55, 123, 241, 0.1)" }}>
      {/* Quick Stats Cards */}
      {!studentLoading && basicDetails && (
        <Row style={{ marginTop: "20px" }}>
          {quickStats.map((stat, index) => (
            <Col key={index} md={4} sm={6} className="mb-3">
              <Link to={stat.link} style={{ textDecoration: "none" }}>
                <Card
                  style={{
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    height: "140px",
                  }}
                  className="quick-stat-card"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 12px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                  }}
                >
                  <Card.Body>
                    <Row>
                      <Col xs={4}>
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "12px",
                            backgroundColor: stat.bgColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: stat.color,
                          }}
                        >
                          {stat.icon}
                        </div>
                      </Col>
                      <Col xs={8} className="text-end">
                        <div style={{ fontSize: "13px", color: "#666", marginBottom: "8px" }}>
                          {stat.title}
                        </div>
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: stat.color,
                            marginBottom: "4px",
                          }}
                        >
                          {stat.value}
                        </div>
                        {stat.subtitle && (
                          <div style={{ fontSize: "12px", color: "#999" }}>{stat.subtitle}</div>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}

      {/* Student Information Header */}
      {studentLoading ? (
        <Row style={{ marginTop: "20px" }}>
          <Col>
            <Card style={{ border: "1px solid #DEE2E6" }}>
              <Card.Header
                style={{
                  backgroundColor: "#0080ff",
                  color: "white",
                  marginBottom: 0,
                }}
              >
                Student Information
              </Card.Header>
              <Card.Body>
                <div className="text-center">Loading student information...</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : studentError ? (
        <Row style={{ marginTop: "20px" }}>
          <Col>
            <Card style={{ border: "1px solid #DEE2E6" }}>
              <Card.Header
                style={{
                  backgroundColor: "#0080ff",
                  color: "white",
                  marginBottom: 0,
                }}
              >
                Student Information
              </Card.Header>
              <Card.Body>
                <div className="text-center text-danger">Error: {studentError}</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : basicDetails ? (
        <Row style={{ marginTop: "20px" }}>
          <Col>
            <Card
              style={{
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                overflow: "hidden",
              }}
            >
              <Card.Header
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
                <FaUser size={20} />
                Student Information
              </Card.Header>
              <Card.Body style={{ padding: "20px" }}>
                <Row>
                  <Col md={3} className="mb-3">
                    {basicDetails.profile_pic ? (
                      <div className="text-center">
                        <img
                          src={basicDetails.profile_pic}
                          alt="Profile"
                          style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "3px solid #0080ff",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                          onError={(e) => {
                            // If image fails to load, show fallback logo
                            e.target.src = "/img/logo.png";
                            // If logo also fails, hide image and show initial
                            e.target.onerror = () => {
                              e.target.style.display = "none";
                            };
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        className="text-center"
                        style={{
                          width: "120px",
                          height: "120px",
                          borderRadius: "50%",
                          backgroundColor: "#0080ff",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "48px",
                          fontWeight: "bold",
                          margin: "0 auto",
                        }}
                      >
                        {basicDetails.first_name?.[0]?.toUpperCase() || "S"}
                      </div>
                    )}
                  </Col>
                  <Col md={9}>
                    <Row>
                      <Col md={6}>
                        <div style={{ marginBottom: "12px", fontSize: "14px" }}>
                          <strong style={{ color: "#555", minWidth: "140px", display: "inline-block" }}>Name:</strong>{" "}
                          <span style={{ color: "#333" }}>
                            {`${basicDetails.first_name || ""} ${basicDetails.middle_name || ""
                              } ${basicDetails.last_name || ""}`.trim() || "-"}
                          </span>
                        </div>
                        <div style={{ marginBottom: "12px", fontSize: "14px" }}>
                          <strong style={{ color: "#555", minWidth: "140px", display: "inline-block" }}>Admission No:</strong>{" "}
                          <span style={{ color: "#333" }}>{basicDetails.admission_no || "-"}</span>
                        </div>
                        <div style={{ marginBottom: "12px", fontSize: "14px" }}>
                          <strong style={{ color: "#555", minWidth: "140px", display: "inline-block" }}> BPUT Registration No:</strong>{" "}
                          <span style={{ color: "#333" }}>{basicDetails.registration_no || "-"}</span>
                        </div>
                        <div style={{ marginBottom: "12px", fontSize: "14px" }}>
                          <strong style={{ color: "#555", minWidth: "140px", display: "inline-block" }}>Email:</strong>{" "}
                          <span style={{ color: "#333" }}>{basicDetails.email || "-"}</span>
                        </div>
                        <div style={{ marginBottom: "12px", fontSize: "14px" }}>
                          <strong style={{ color: "#555", minWidth: "140px", display: "inline-block" }}>Date of Birth:</strong>{" "}
                          <span style={{ color: "#333" }}>
                            {basicDetails.date_of_birth
                              ? new Date(basicDetails.date_of_birth).toLocaleDateString()
                              : "-"}
                          </span>
                        </div>
                      </Col>
                      <Col md={6}>

                        <div style={{ marginBottom: "12px", fontSize: "14px" }}>
                          <strong style={{ color: "#555", minWidth: "140px", display: "inline-block" }}>Course:</strong>{" "}
                          <span style={{ color: "#333" }}>{basicDetails.course_name || "-"}</span>
                        </div>
                        <div style={{ marginBottom: "12px", fontSize: "14px" }}>
                          <strong style={{ color: "#555", minWidth: "140px", display: "inline-block" }}>Department:</strong>{" "}
                          <span style={{ color: "#333" }}>{basicDetails.department_description || "-"}</span>
                        </div>
                        <div style={{ marginBottom: "12px", fontSize: "14px" }}>
                          <strong style={{ color: "#555", minWidth: "140px", display: "inline-block" }}>Academic Year:</strong>{" "}
                          <span style={{ color: "#333" }}>{basicDetails.academic_year || "-"}</span>
                        </div>
                        <div style={{ marginBottom: "12px", fontSize: "14px" }}>
                          <strong style={{ color: "#555", minWidth: "140px", display: "inline-block" }}>Semester:</strong>{" "}
                          <span style={{ color: "#333" }}>{basicDetails.semester_description || "-"}</span>
                        </div>
                        <div style={{ marginBottom: "12px", fontSize: "14px" }}>
                          <strong style={{ color: "#555", minWidth: "140px", display: "inline-block" }}>Status:</strong>{" "}
                          <span
                            style={{
                              color: basicDetails.status === "ACTIVE" ? "#008000" : "#FF0000",
                              fontWeight: "bold",
                            }}
                          >
                            {basicDetails.status || "-"}
                          </span>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : null}

      <Row className="row-staff-dashboard -1" style={{ marginTop: "30px" }}>
        <Col>
          <StudentAttendanceChart />
        </Col>
      </Row>
      <Row className="row-staff-dashboard -2" style={{ marginTop: "20px", gap: "0" }} id="notifications">
        <Col md={6} className="pe-2">
          <Card
            className="mb-4"
            style={{
              height: "380px",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            <Card.Header
              className="sticky-top"
              style={{
                background: "linear-gradient(135deg, #0080ff 0%, #0056b3 100%)",
                color: "white",
                marginBottom: "5px",
                padding: "16px 20px",
                fontSize: "18px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FaBell size={20} />
              Notifications
              {circulars && circulars.length > 0 && (
                <Badge
                  bg="danger"
                  style={{ marginLeft: "auto", fontSize: "12px" }}
                >
                  {circulars.length}
                </Badge>
              )}
            </Card.Header>
            <div
              className="custom-scrollbar"
              style={{ height: "calc(100% - 56px)", overflowY: "auto" }}
            >
              {circularsLoading ? (
                <div className="text-center p-3">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2" style={{ fontSize: "14px" }}>Loading notifications...</p>
                </div>
              ) : circularsError ? (
                <div className="text-center p-3 text-danger" style={{ fontSize: "14px" }}>
                  {circularsError}
                </div>
              ) : circulars && circulars.length > 0 ? (
                <ListGroup variant="flush">
                  {circulars.slice(0, 5).map((circular, index) => (
                    <ListGroup.Item
                      key={circular.circular_id || index}
                      style={{
                        textAlign: "left",
                        padding: "16px",
                        borderBottom: "1px solid #f0f0f0",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f8f9fa";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                      }}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            backgroundColor: "#e7f3ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <FaBell size={18} color="#0080ff" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <strong style={{ color: "#0080ff", fontSize: "14px" }}>
                              {formatCircularDate(circular.circular_date)}
                            </strong>
                            {circular.circular_status === "A" && (
                              <Badge bg="success" style={{ fontSize: "10px" }}>
                                Active
                              </Badge>
                            )}
                          </div>
                          <div style={{ marginBottom: "6px", fontSize: "13px", color: "#666" }}>
                            <strong style={{ color: "#333" }}>From:</strong> {circular.InitiatedBy || "-"}
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "#555",
                              lineHeight: "1.5",
                              marginBottom: "8px",
                            }}
                          >
                            {circular.circular_details?.length > 100
                              ? circular.circular_details.substring(0, 100) + "..."
                              : circular.circular_details || "-"}
                          </div>
                          {circular.circular_file && (
                            <a
                              href={circular.circular_file}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#0080ff",
                                textDecoration: "none",
                                fontSize: "12px",
                                fontWeight: "600",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              📎 View Attachment
                            </a>
                          )}
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center p-3" style={{ fontSize: "14px", color: "#666" }}>
                  No notifications available
                </div>
              )}
            </div>
          </Card>
        </Col>
        <Col md={6} className="ps-2">
          <Card
            className="mb-4"
            style={{
              height: "380px",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            <Card.Header
              className="sticky-top"
              style={{
                background: "linear-gradient(135deg, #0080ff 0%, #0056b3 100%)",
                color: "white",
                marginBottom: "5px",
                padding: "16px 20px",
                fontSize: "18px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FaTrophy size={20} />
              Exam Results
            </Card.Header>
            <div
              className="custom-scrollbar"
              style={{ height: "calc(100% - 56px)", overflowY: "auto" }}
            >
              {upcomingSemesters && upcomingSemesters.length > 0 ? (
                <ListGroup variant="flush">
                  {upcomingSemesters.map((semester, index) => (
                    <Link
                      key={index}
                      to="/student/view-result"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <ListGroup.Item
                        style={{
                          textAlign: "left",
                          padding: "16px",
                          borderBottom: "1px solid #f0f0f0",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f8f9fa";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "white";
                        }}
                      >
                        <div className="d-flex align-items-start gap-3">
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "8px",
                              backgroundColor: "#fff3cd",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <FaTrophy size={18} color="#ffc107" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ marginBottom: "8px" }}>
                              <strong style={{ color: "#0080ff", fontSize: "15px" }}>
                                {semester.semester}
                              </strong>
                            </div>
                            <div style={{ fontSize: "13px", color: "#666" }}>
                              {semester.description}
                            </div>
                          </div>
                        </div>
                      </ListGroup.Item>
                    </Link>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center p-4" style={{ color: "#999" }}>
                  <FaTrophy size={48} style={{ marginBottom: "16px", opacity: 0.3 }} />
                  <div>No exam results available</div>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
