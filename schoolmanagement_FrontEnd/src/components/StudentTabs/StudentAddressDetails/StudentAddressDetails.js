import React from "react";
import { Card, Row, Col, Button, Alert, Form } from "react-bootstrap";
import useStudentDetails from "../../hooks/useStudentDetails";
import { useNavigate } from "react-router-dom";

const ParentDetailsForm = ({
  goToTab,
  addressDetails,
  setDocumentDetailsInParent,
}) => {
  const navigate = useNavigate();

  // Get student ID from sessionStorage
  const studentId = sessionStorage.getItem("userId");

  // Fetch student details using the hook
  const { studentDetails, error } = useStudentDetails(studentId);

  // Extract address details from API response
  const addressData = studentDetails?.address_details?.[0] || addressDetails;

  const handleClose = () => {
    navigate("/student/dashboards");
  };

  // Check if addresses are same
  const isSameAddress =
    addressData?.present_address === addressData?.permanent_address &&
    addressData?.present_pincode === addressData?.permanent_pincode;

  return (
    <div style={{ width: "100%", padding: "20px", minHeight: "100vh" }}>
      <Row style={{ margin: 0 }}>
        <Col style={{ padding: "10px" }}>

          <Card
            style={{
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              backgroundColor: "white",
            }}
          >
            <Card.Body style={{ padding: "24px", backgroundColor: "rgba(55, 123, 241, 0.1)" }}>
              {/* Close Button */}
              <div className="mb-3">
                <Button variant="danger" onClick={handleClose} style={{ width: "120px", borderRadius: "6px" }}>
                  Close
                </Button>
              </div>
              {/* Error State */}
              {error && (
                <Alert variant="danger">
                  <Alert.Heading>Error</Alert.Heading>
                  <p>{error}</p>
                </Alert>
              )}

              {/* Address Details - Only show when no error */}
              {!error && addressData && (
                <>
                  <Row>
                    {/* Residence Address Section */}
                    <Col md={6}>
                      <Card
                        style={{
                          border: "1px solid #dee2e6",
                          borderRadius: "8px",
                          marginBottom: "20px",
                          backgroundColor: "white",
                        }}
                      >
                        <Card.Header
                          style={{
                            backgroundColor: "#007bff",
                            color: "white",
                            padding: "12px 16px",
                            fontSize: "16px",
                            fontWeight: "600",
                            borderRadius: "8px 8px 0 0",
                          }}
                        >
                          Residence Address
                        </Card.Header>
                        <Card.Body style={{ padding: "20px", backgroundColor: "white" }}>
                          <Form>
                            {/* Address */}
                            <Form.Group className="mb-3">
                              <Form.Label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                                Address
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={addressData?.present_address || ""}
                                placeholder="Enter address"
                                readOnly
                                disabled
                              />
                            </Form.Group>

                            {/* Country and State Row */}
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                                    Country<span className="text-danger">*</span>
                                  </Form.Label>
                                  <Form.Select disabled>
                                    <option>{addressData?.present_country || "Select..."}</option>
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                                    State<span className="text-danger">*</span>
                                  </Form.Label>
                                  <Form.Select disabled>
                                    <option>{addressData?.present_state || "Select..."}</option>
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                            </Row>

                            {/* City/District and Pincode Row */}
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                                    City/District<span className="text-danger">*</span>
                                  </Form.Label>
                                  <Form.Select disabled>
                                    <option>{addressData?.present_city || "Select..."}</option>
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                                    Pincode<span className="text-danger">*</span>
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={addressData?.present_pincode || ""}
                                    placeholder="Enter pincode"
                                    readOnly
                                    disabled
                                  />
                                </Form.Group>
                              </Col>
                            </Row>

                            {/* Phone */}
                            <Form.Group className="mb-3">
                              <Form.Label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                                Phone
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={addressData?.present_phone_number || ""}
                                placeholder="Enter phone number"
                                readOnly
                                disabled
                              />
                            </Form.Group>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* Permanent Address Section */}
                    <Col md={6}>
                      <Card
                        style={{
                          border: "1px solid #dee2e6",
                          borderRadius: "8px",
                          marginBottom: "20px",
                          backgroundColor: "white",
                        }}
                      >
                        <Card.Header
                          style={{
                            backgroundColor: "#007bff",
                            color: "white",
                            padding: "12px 16px",
                            fontSize: "16px",
                            fontWeight: "600",
                            borderRadius: "8px 8px 0 0",
                          }}
                        >
                          Permanent Address
                        </Card.Header>
                        <Card.Body style={{ padding: "20px", backgroundColor: "white" }}>
                          <Form>
                            {/* Address */}
                            <Form.Group className="mb-3">
                              <Form.Label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                                Address
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={addressData?.permanent_address || ""}
                                placeholder="Enter address"
                                readOnly
                                disabled
                              />
                            </Form.Group>

                            {/* Country and State Row */}
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                                    Country
                                  </Form.Label>
                                  <Form.Select disabled>
                                    <option>{addressData?.permanent_country || "Select..."}</option>
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                                    State
                                  </Form.Label>
                                  <Form.Select disabled>
                                    <option>{addressData?.permanent_state || "Select..."}</option>
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                            </Row>

                            {/* City/District and Pincode Row */}
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                                    City/District
                                  </Form.Label>
                                  <Form.Select disabled>
                                    <option>{addressData?.permanent_city || "Select..."}</option>
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                                    Pincode
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={addressData?.permanent_pincode || ""}
                                    placeholder="Enter pincode"
                                    readOnly
                                    disabled
                                  />
                                </Form.Group>
                              </Col>
                            </Row>

                            {/* Phone */}
                            <Form.Group className="mb-3">
                              <Form.Label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                                Phone
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={addressData?.permanent_phone_number || ""}
                                placeholder="Enter phone number"
                                readOnly
                                disabled
                              />
                            </Form.Group>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Checkbox for Same Address */}
                  <Row>
                    <Col md={6}>
                      <Form.Check
                        type="checkbox"
                        id="same-address-checkbox"
                        label="Permanent address is same as Residence"
                        checked={isSameAddress}
                        disabled
                        style={{
                          marginTop: "10px",
                          fontSize: "14px",
                        }}
                      />
                    </Col>
                  </Row>
                </>
              )}

              {/* No Data State */}
              {!error && !addressData && (
                <div className="text-center py-5">
                  <p className="text-muted">No address details available</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ParentDetailsForm;
