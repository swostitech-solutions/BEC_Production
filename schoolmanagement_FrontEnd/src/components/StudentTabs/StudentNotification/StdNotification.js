import React from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const StudentProfileCard = ({ studentData, onClose }) => {
   const navigate = useNavigate();
  const data = studentData || {
    studentName: "ABHISHEK",
    admissionNo: "2101316001",
    classSection: "B.TECH A",
    rollNo: "01",
    fatherName: "MANAS RANJAN MOHANTY",
    fatherMobile: "9437032717",
    motherName: "SASMITA MOHANTY",
    motherMobile: "8327704520",
    aadharNo: "421840574850",
    userName: "2101316001",
  };

  const handleClose = () => {
    navigate(-1); // This goes one step back in history
  };

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
                STUDENT PROFILE
              </p>

              {/* White box */}
              <div className="row mt-3 mx-2">
                <div
                  className="col-12 custom-section-box"
                  style={{
                    minHeight: "39px",
                    backgroundColor: "#ffffff",
                    padding: "15px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                >
                  {/* Close button aligned right */}
                  <div className="d-flex justify-content-end mb-3">
                    <Button variant="secondary" size="sm" onClick={handleClose}>
                      Close
                    </Button>
                  </div>


                </div>
              </div>

              {/* Optional: empty table if you still want to keep it */}
              <Row className="mt-4">
                <Col>
                  {/* Table with student details */}
                  <Table
                    bordered
                    size="sm"
                    style={{
                      fontSize: "14px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #888",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td><strong>Student Name</strong></td>
                        <td>{data.studentName}</td>
                        <td><strong>Admission No</strong></td>
                        <td>{data.admissionNo}</td>
                      </tr>
                      <tr>
                        <td><strong>Class/Section</strong></td>
                        <td>{data.classSection}</td>
                        <td><strong>Roll No</strong></td>
                        <td>{data.rollNo}</td>
                      </tr>
                      <tr>
                        <td><strong>Father Name</strong></td>
                        <td>{data.fatherName}</td>
                        <td><strong>Father Mobile No</strong></td>
                        <td>{data.fatherMobile}</td>
                      </tr>
                      <tr>
                        <td><strong>Mother Name</strong></td>
                        <td>{data.motherName}</td>
                        <td><strong>Mother Mobile No</strong></td>
                        <td>{data.motherMobile}</td>
                      </tr>
                      <tr>
                        <td><strong>Aadhar No</strong></td>
                        <td>{data.aadharNo}</td>
                        <td><strong>User Name</strong></td>
                        <td>{data.userName}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileCard;
