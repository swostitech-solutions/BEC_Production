import React, { useState,  } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
// import { ApiUrl } from "../../../ApiUrl";
import "react-datepicker/dist/react-datepicker.css";
import {  Row, Col, Form ,Table} from "react-bootstrap";
import { FaPlus } from "react-icons/fa";


const AdmAttendanceEntry = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    viewOption: "outstanding",
  });
const [showAdditionalTable, setShowAdditionalTable] = useState({});

const handleToggle = (index) => {
  setShowAdditionalTable((prev) => ({
    ...prev,
    [index]: !prev[index],
  }));
};

const sampleReceipts = [
  {
    period: "Jan 2025",
    receiptDate: "2025-01-10",
    receiptAmount: 5000,
    discountAmount: 500,
    details: [
      { feeHead: "Tuition", amount: 3000, paid: 3000, balance: 0 },
      { feeHead: "Library", amount: 2000, paid: 1500, balance: 500 },
    ],
  },
  {
    period: "Feb 2025",
    receiptDate: "2025-02-10",
    receiptAmount: 4000,
    discountAmount: 0,
    details: [{ feeHead: "Tuition", amount: 4000, paid: 4000, balance: 0 }],
  },
];

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  //  Redirect based on selection
  if (name === "viewOption" && value === "payment") {
    navigate("/student/payment-gateway");
  }
};

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-2">
            <div className="card-body">
              <p
                className="text-center fw-bold mb-3"
                style={{ fontSize: "18px" }}
              >
                PAYMENT DETAILS
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{
                      width: "150px",
                    }}
                    onClick={() => navigate("/admin/training")}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2 mt-2">
                <div className="col-12 custom-section-box">
                  <Row className="justify-content-center">
                    <Col
                      className="p-3"
                      xs={12}
                      sm={8}
                      // style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                    >
                      <Form>
                        <Row className="mb-1 mt-4">
                          <Col md={6} className="py-0">
                            <Form.Label className="mb-1">
                              Student Name{" "}
                            </Form.Label>
                          </Col>
                          <Col md={6} className="py-0">
                            <Form.Control
                              type="text"
                              className="form-control form-control-sm detail"
                              name="organizationName"
                              value={formData.organizationName}
                              onChange={handleChange}
                            />
                          </Col>
                        </Row>

                        <Row className="mb-1">
                          <Col md={6}>
                            <Form.Label>
                              Class <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                          </Col>
                          <Col md={6}>
                            <Form.Control
                              type="text"
                              name="numParticipants"
                              className="form-control detail"
                              value={formData.numParticipants}
                              onChange={handleChange}
                            />
                          </Col>
                        </Row>

                        <Row className="mb-1">
                          <Col md={6}>
                            <Form.Label>Section</Form.Label>
                          </Col>
                          <Col md={6}>
                            <Form.Control
                              type="text"
                              className="form-control detail"
                              name="trainingModule"
                              value={formData.trainingModule}
                              onChange={handleChange}
                            />
                          </Col>
                        </Row>
                        <Row className="mb-1">
                          <Col md={6}>
                            <Form.Label>Academic Session</Form.Label>
                          </Col>
                          <Col md={6}>
                            <Form.Control
                              type="text"
                              className="form-control detail"
                              name="trainingModule"
                              value={formData.trainingModule}
                              onChange={handleChange}
                            />
                          </Col>
                        </Row>

                        <Row className="mb-3 mt-5">
                          <Col
                            md={{ span: 7, offset: 7 }}
                            className="d-flex justify-content-end"
                          >
                            <Form.Check
                              type="radio"
                              id="viewOutstanding"
                              label="View Outstanding Details"
                              name="viewOption"
                              value="outstanding"
                              checked={formData.viewOption === "outstanding"}
                              onChange={handleChange}
                              className="me-3"
                            />
                            <Form.Check
                              type="radio"
                              id="viewPayment"
                              label="View Payment Details"
                              name="viewOption"
                              value="payment"
                              checked={formData.viewOption === "payment"}
                              onChange={handleChange}
                            />
                          </Col>
                        </Row>
                      </Form>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="col-12">
                <div className="table-responsive">
                  <Table bordered>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Sr.No</th>
                        <th>Period</th>
                        <th>Total Amount</th>
                        <th>Paid Amount</th>
                        <th>Discount </th>
                        <th>Pay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleReceipts.map((receipt, idx) => (
                        <React.Fragment key={idx}>
                          {/* Main Row */}
                          <tr>
                            <td>
                              <FaPlus
                                onClick={() => handleToggle(idx)}
                                style={{ cursor: "pointer" }}
                              />
                            </td>
                            <td>{idx + 1}</td>
                            <td>{receipt.period}</td>
                            <td>{receipt.receiptDate}</td>
                            <td>{receipt.receiptAmount}</td>
                            <td>{receipt.discountAmount}</td>
                            <td>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  alert(`Proceed to pay for ${receipt.period}`)
                                }
                              >
                                Pay Now
                              </button>
                            </td>
                          </tr>

                          {/* Expandable Row */}
                          {showAdditionalTable[idx] && (
                            <tr>
                              <td colSpan="7">
                                <Table bordered>
                                  <thead>
                                    <tr>
                                      <th>Element Name</th>
                                      <th>Amount</th>
                                      <th>Paid</th>
                                      <th>Balance</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {receipt.details.map((item, itemIdx) => (
                                      <tr key={itemIdx}>
                                        <td>{item.feeHead}</td>
                                        <td>{item.amount}</td>
                                        <td>{item.paid}</td>
                                        <td>{item.balance}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdmAttendanceEntry;
