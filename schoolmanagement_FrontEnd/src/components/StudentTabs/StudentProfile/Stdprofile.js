import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import useStudentDetails from "../../hooks/useStudentDetails";

const StudentProfileCard = ({ studentData, onClose }) => {
  const navigate = useNavigate();

  // Get student ID from localStorage or sessionStorage
  const studentId = sessionStorage.getItem("userId");
  // Fetch student details using the hook
  const { studentDetails, loading, error } = useStudentDetails(studentId);

  // Extract data from API response
  const basicDetails = studentDetails?.student_basic_details;

  // Map API data to display format
  const data = basicDetails
    ? {
      studentName: `${basicDetails.first_name || ""} ${basicDetails.middle_name || ""
        } ${basicDetails.last_name || ""}`.trim(),
      admissionNo: basicDetails.admission_no || "-",
      classSection:
        `${basicDetails.course_name || ""} ${basicDetails.section_name || ""
          }`.trim() || "-",
      rollNo:
        basicDetails.registration_no ||
        basicDetails.college_admission_no ||
        "-",
      fatherName: basicDetails.father_name || "-",
      fatherMobile: basicDetails.father_contact_number || "-",
      motherName: basicDetails.mother_name || "-",
      motherMobile: basicDetails.mother_contact_number || "-",
      aadharNo: basicDetails.student_aadhaar_no || "-",
      userName: basicDetails.username || basicDetails.admission_no || "-",
    }
    : studentData || {
      studentName: "-",
      admissionNo: "-",
      classSection: "-",
      rollNo: "-",
      fatherName: "-",
      fatherMobile: "-",
      motherName: "-",
      motherMobile: "-",
      aadharNo: "-",
      userName: "-",
    };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/student/dashboards"); // This goes to student dashboard
    }
  };

  // Helper function to render simple row item
  const SimpleRowItem = ({ label, value }) => (
    <div
      style={{
        padding: "12px 0",
        borderBottom: "1px solid #e9ecef",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          flex: "0 0 40%",
          fontWeight: "bold",
          color: "#333",
          fontSize: "14px",
        }}
      >
        {label}:
      </div>
      <div style={{ flex: "1", color: "#333", fontSize: "14px" }}>
        {typeof value === "object" && value !== null ? value : value || "-"}
      </div>
    </div>
  );

  return (
    <div
      style={{ width: "100%", margin: 0, padding: "20px", minHeight: "100vh" }}
    >
      <div className="row" style={{ margin: 0 }}>
        <div className="col-12" style={{ padding: "10px" }}>
          <div style={{ backgroundColor: "#e8f4fc", padding: "20px", borderRadius: "12px" }}>
            {/* Title and Close Button */}
            <div className="mb-4 d-flex justify-content-between align-items-center">
              <Button
                variant="danger"
                onClick={handleClose}
                style={{ width: "120px", borderRadius: "6px" }}
              >
                Close
              </Button>
              <h2
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#333",
                  textAlign: "center",
                  flex: 1,
                }}
              >
                STUDENT PROFILE
              </h2>
              <div style={{ width: "120px" }}></div> {/* Spacer for centering */}
            </div>

            {/* Error State */}
            {error && !loading && (
              <Alert variant="danger" className="mb-4">
                <Alert.Heading>Error</Alert.Heading>
                <p>{error}</p>
              </Alert>
            )}

            {/* CV-Style Profile */}
            {!loading && !error && basicDetails && (
              <>
                {/* Header Section - Matching Dashboard Design */}
                <Card
                  style={{
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    backgroundColor: "white",
                  }}
                >
                  <Card.Header
                    style={{
                      backgroundColor: "white",
                      color: "#333",
                      marginBottom: 0,
                      padding: "16px 20px",
                      fontSize: "18px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    <FaUser size={20} color="#0080ff" />
                    Student Information
                  </Card.Header>
                  <Card.Body
                    style={{ padding: "20px", backgroundColor: "white" }}
                  >
                    <Row className="align-items-center">
                      <Col md={3} className="text-center mb-3 mb-md-0">
                        {basicDetails.profile_pic ? (
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
                              e.target.src = "/img/logo.png";
                              e.target.onerror = () => {
                                e.target.style.display = "none";
                              };
                            }}
                          />
                        ) : null}
                        <div
                          style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            backgroundColor: "#0080ff",
                            color: "white",
                            display: basicDetails.profile_pic ? "none" : "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "48px",
                            fontWeight: "bold",
                            margin: "0 auto",
                          }}
                        >
                          {basicDetails.first_name?.[0]?.toUpperCase() || "S"}
                        </div>
                      </Col>
                      <Col md={9}>
                        <Row>
                          <Col md={6}>
                            <div
                              style={{ marginBottom: "12px", fontSize: "14px" }}
                            >
                              <strong
                                style={{
                                  color: "#555",
                                  minWidth: "140px",
                                  display: "inline-block",
                                }}
                              >
                                Name:
                              </strong>{" "}
                              <span style={{ color: "#333" }}>
                                {data.studentName}
                              </span>
                            </div>
                            <div
                              style={{ marginBottom: "12px", fontSize: "14px" }}
                            >
                              <strong
                                style={{
                                  color: "#555",
                                  minWidth: "140px",
                                  display: "inline-block",
                                }}
                              >
                                Admission No:
                              </strong>{" "}
                              <span style={{ color: "#333" }}>
                                {data.admissionNo}
                              </span>
                            </div>
                            <div
                              style={{ marginBottom: "12px", fontSize: "14px" }}
                            >
                              <strong
                                style={{
                                  color: "#555",
                                  minWidth: "140px",
                                  display: "inline-block",
                                }}
                              >
                                ONMRC Registration No:
                              </strong>{" "}
                              <span style={{ color: "#333" }}>{data.rollNo}</span>
                            </div>
                            {basicDetails.email && (
                              <div
                                style={{ marginBottom: "12px", fontSize: "14px" }}
                              >
                                <strong
                                  style={{
                                    color: "#555",
                                    minWidth: "140px",
                                    display: "inline-block",
                                  }}
                                >
                                  Email:
                                </strong>{" "}
                                <span style={{ color: "#333" }}>
                                  {basicDetails.email}
                                </span>
                              </div>
                            )}
                            <div
                              style={{ marginBottom: "12px", fontSize: "14px" }}
                            >
                              <strong
                                style={{
                                  color: "#555",
                                  minWidth: "140px",
                                  display: "inline-block",
                                }}
                              >
                                Date of Birth:
                              </strong>{" "}
                              <span style={{ color: "#333" }}>
                                {basicDetails.date_of_birth
                                  ? new Date(
                                    basicDetails.date_of_birth
                                  ).toLocaleDateString()
                                  : "-"}
                              </span>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div
                              style={{ marginBottom: "12px", fontSize: "14px" }}
                            >
                              <strong
                                style={{
                                  color: "#555",
                                  minWidth: "140px",
                                  display: "inline-block",
                                }}
                              >
                                Course:
                              </strong>{" "}
                              <span style={{ color: "#333" }}>
                                {basicDetails.course_name || "-"}
                              </span>
                            </div>
                            <div
                              style={{ marginBottom: "12px", fontSize: "14px" }}
                            >
                              <strong
                                style={{
                                  color: "#555",
                                  minWidth: "140px",
                                  display: "inline-block",
                                }}
                              >
                                Section:
                              </strong>{" "}
                              <span style={{ color: "#333" }}>
                                {basicDetails.section_name || "-"}
                              </span>
                            </div>
                            <div
                              style={{ marginBottom: "12px", fontSize: "14px" }}
                            >
                              <strong
                                style={{
                                  color: "#555",
                                  minWidth: "140px",
                                  display: "inline-block",
                                }}
                              >
                                Academic Year:
                              </strong>{" "}
                              <span style={{ color: "#333" }}>
                                {basicDetails.academic_year || "-"}
                              </span>
                            </div>
                            <div
                              style={{ marginBottom: "12px", fontSize: "14px" }}
                            >
                              <strong
                                style={{
                                  color: "#555",
                                  minWidth: "140px",
                                  display: "inline-block",
                                }}
                              >
                                Semester:
                              </strong>{" "}
                              <span style={{ color: "#333" }}>
                                {basicDetails.semester_description || "-"}
                              </span>
                            </div>
                            <div
                              style={{ marginBottom: "12px", fontSize: "14px" }}
                            >
                              <strong
                                style={{
                                  color: "#555",
                                  minWidth: "140px",
                                  display: "inline-block",
                                }}
                              >
                                Status:
                              </strong>{" "}
                              <span
                                style={{
                                  color:
                                    basicDetails.status === "ACTIVE"
                                      ? "#008000"
                                      : "#FF0000",
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

                {/* Simple Profile Card - Matching Image Design */}
                <Card
                  style={{
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    backgroundColor: "white",
                  }}
                >
                  <Card.Body style={{ padding: "24px", backgroundColor: "white" }}>
                    <Row>
                      {/* Left Column */}
                      <Col md={6}>
                        <SimpleRowItem
                          label="Father Name"
                          value={data.fatherName}
                        />
                        <SimpleRowItem
                          label="Mother Name"
                          value={data.motherName}
                        />
                        <SimpleRowItem label="Aadhar No" value={data.aadharNo} />
                        <SimpleRowItem
                          label="Gender"
                          value={basicDetails.gender_name}
                        />
                        <SimpleRowItem
                          label="Blood Group"
                          value={basicDetails.blood_group}
                        />
                        <SimpleRowItem label="User Name" value={data.userName} />
                      </Col>
                      {/* Right Column */}
                      <Col md={6}>
                        <SimpleRowItem
                          label="Father Mobile No"
                          value={data.fatherMobile}
                        />
                        <SimpleRowItem
                          label="Mother Mobile No"
                          value={data.motherMobile}
                        />
                        <SimpleRowItem
                          label="Department"
                          value={basicDetails.department_description}
                        />
                        {/* <SimpleRowItem
                        label="Organization"
                        value={basicDetails.organization_description}
                      /> */}
                        <SimpleRowItem
                          label="Branch"
                          value={basicDetails.branch_name}
                        />
                        <SimpleRowItem
                          label="Batch"
                          value={basicDetails.batch_name}
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileCard;
