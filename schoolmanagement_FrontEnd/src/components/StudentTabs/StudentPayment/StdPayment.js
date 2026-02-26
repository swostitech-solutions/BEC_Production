import React, { useState, useEffect, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Alert,
  Form,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useStudentDetails from "../../hooks/useStudentDetails";
import useStudentFeeFilterData from "../../hooks/useStudentFeeFilterData";
import useStudentFeeReceipts from "../../hooks/useStudentFeeReceipts";
import api from "../../../utils/api";

const StdPayment = () => {
  const navigate = useNavigate();

  // Get student ID from sessionStorage
  const studentId = sessionStorage.getItem("userId");

  // First, fetch student details to get college_admission_no
  const {
    studentDetails,
    loading: studentDetailsLoading,
    error: studentDetailsError,
  } = useStudentDetails(studentId);

  // Extract college_admission_no from student details
  const basicDetails = studentDetails?.student_basic_details;
  const collegeAdmissionNo = basicDetails?.college_admission_no ||
    basicDetails?.admission_no ||
    sessionStorage.getItem("college_admission_no") ||
    "";

  // Store college_admission_no in sessionStorage when available
  useEffect(() => {
    if (collegeAdmissionNo) {
      sessionStorage.setItem("college_admission_no", collegeAdmissionNo);
    }
  }, [collegeAdmissionNo]);

  // Fetch student fee data using new API (only when we have college_admission_no)
  const {
    studentData,
    feedetails = [],
    loading: feeDataLoading,
    error: feeDataError,
    refetch: refetchFeeData,
  } = useStudentFeeFilterData(collegeAdmissionNo);

  // Fetch fee receipts (payment history)
  const {
    receipts = [],
    error: receiptsError,
    refetch: refetchReceipts,
  } = useStudentFeeReceipts({
    student_id: studentId,
    enabled: !!studentId,
  });

  // State management
  const [activeTab, setActiveTab] = useState("outstanding"); // "outstanding" or "payment"
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState(null);

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFeeGroup, setSelectedFeeGroup] = useState(null);
  const [selectedSubFeeIds, setSelectedSubFeeIds] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Collapsible rows state
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Selected sub-fees state (by sub-fee ID)
  const [selectedSubFees, setSelectedSubFees] = useState({});

  // Format date helper
  const formatDate = (dateString) => {
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

  // Format period from semester or date
  const formatPeriod = (semester, date) => {
    if (semester) return semester;
    if (date) {
      const d = new Date(date);
      const month = d.toLocaleDateString("en-GB", { month: "short" });
      const year = d.getFullYear();
      return `${month} ${year}`;
    }
    return "-";
  };

  // Group fees by semester_id only - all fees in the same semester are grouped together
  const groupedFees = useMemo(() => {
    if (!feedetails || feedetails.length === 0) return [];

    const groups = {};

    feedetails.forEach((fee) => {
      // Create group key: semester_id only (all fees in same semester grouped together)
      const groupKey = `semester_${fee.semester_id}`;

      if (!groups[groupKey]) {
        groups[groupKey] = {
          groupId: groupKey,
          semester_id: fee.semester_id,
          semester: fee.semester || fee.semester_name || "-",
          subFees: [],
        };
      }

      groups[groupKey].subFees.push(fee);
    });

    // Calculate totals for each group (excluding sub-fees where all values are zero)
    return Object.values(groups).map((group) => {
      const totals = group.subFees
        .filter((subFee) => {
          // Exclude sub-fees where total, paid, and discount are all zero
          const elementAmount = parseFloat(subFee.element_amount || 0);
          const paidAmount = parseFloat(subFee.paid_amount || 0);
          const discountAmount = parseFloat(subFee.discount || 0);
          return !(elementAmount === 0 && paidAmount === 0 && discountAmount === 0);
        })
        .reduce(
          (acc, subFee) => {
            const elementAmount = parseFloat(subFee.element_amount || 0);
            const paidAmount = parseFloat(subFee.paid_amount || 0);
            const balance = elementAmount - paidAmount;
            return {
              totalAmount: acc.totalAmount + elementAmount,
              totalPaid: acc.totalPaid + paidAmount,
              totalDue: acc.totalDue + (balance > 0 ? balance : 0),
              totalDiscount: acc.totalDiscount + parseFloat(subFee.discount || 0),
            };
          },
          { totalAmount: 0, totalPaid: 0, totalDue: 0, totalDiscount: 0 }
        );

      return {
        ...group,
        ...totals,
      };
    });
  }, [feedetails]);

  // Toggle row expansion
  const toggleRowExpansion = (groupId) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // Toggle sub-fee selection
  const toggleSubFeeSelection = (subFeeId, groupId) => {
    setSelectedSubFees((prev) => {
      const newState = { ...prev };
      if (newState[subFeeId]) {
        delete newState[subFeeId];
      } else {
        newState[subFeeId] = { subFeeId, groupId };
      }
      return newState;
    });
  };

  // Calculate totals for outstanding tab (based on all groups)
  const outstandingTotals = useMemo(() => {
    return groupedFees.reduce(
      (acc, group) => {
        return {
          totalAmount: acc.totalAmount + group.totalAmount,
          totalPaid: acc.totalPaid + group.totalPaid,
          totalDue: acc.totalDue + group.totalDue,
        };
      },
      { totalAmount: 0, totalPaid: 0, totalDue: 0 }
    );
  }, [groupedFees]);

  // Calculate totals for payment history tab
  const paymentTotals = receipts.reduce(
    (acc, receipt) => {
      return {
        totalPaid:
          acc.totalPaid +
          parseFloat(receipt.receipt_amount || receipt.payment_amount || 0),
        totalDiscount:
          acc.totalDiscount +
          parseFloat(receipt.discount || receipt.discount_amount || 0),
        totalReceipts: acc.totalReceipts + 1,
      };
    },
    { totalPaid: 0, totalDiscount: 0, totalReceipts: 0 }
  );

  // Handle receipt link click
  const handleReceiptClick = async (receiptId) => {
    if (!receiptId) return;

    try {
      setSelectedReceipt(receiptId);

      const orgId =
        localStorage.getItem("orgId") ||
        sessionStorage.getItem("organization_id");
      const branchId =
        localStorage.getItem("branchId") || sessionStorage.getItem("branch_id");

      const response = await api.get(
        "FeeReceipt/GetFeeReceiptBasedOnReceiptId/",
        {
          params: {
            receipt_id: receiptId,
            organization_id: orgId,
            branch_id: branchId,
          },
        }
      );

      const result = response.data;
      if (result && result.data) {
        setReceiptDetails(result.data);  // Access the nested 'data' property
        setShowReceiptModal(true);
      }
    } catch (err) {
      console.error("Error fetching receipt details:", err);
      alert("Failed to load receipt details");
    }
  };

  // Calculate due amount from selected sub-fees in a group
  const calculateSelectedDueAmount = (groupId) => {
    const group = groupedFees.find((g) => g.groupId === groupId);
    if (!group) return 0;

    const selectedSubFeeIds = Object.keys(selectedSubFees).filter(
      (id) => selectedSubFees[id].groupId === groupId
    );

    if (selectedSubFeeIds.length === 0) {
      // If no sub-fees selected, use total due for the group
      return group.totalDue;
    }

    // Calculate from selected sub-fees only
    return group.subFees
      .filter((subFee) => selectedSubFeeIds.includes(String(subFee.id)))
      .reduce((sum, subFee) => {
        const elementAmount = parseFloat(subFee.element_amount || 0);
        const paidAmount = parseFloat(subFee.paid_amount || 0);
        const balance = elementAmount - paidAmount;
        return sum + (balance > 0 ? balance : 0);
      }, 0);
  };

  // Handle Pay Now button click
  const handlePayNow = (feeGroup) => {
    const selectedIds = Object.keys(selectedSubFees).filter(
      (id) => selectedSubFees[id].groupId === feeGroup.groupId
    );

    // If no sub-fees selected, select all sub-fees with due amount > 0
    if (selectedIds.length === 0) {
      const subFeesWithDue = feeGroup.subFees
        .filter((subFee) => {
          const elementAmount = parseFloat(subFee.element_amount || 0);
          const paidAmount = parseFloat(subFee.paid_amount || 0);
          return elementAmount - paidAmount > 0;
        })
        .map((subFee) => String(subFee.id));

      const newSelected = {};
      subFeesWithDue.forEach((id) => {
        newSelected[id] = { subFeeId: id, groupId: feeGroup.groupId };
      });
      setSelectedSubFees((prev) => ({ ...prev, ...newSelected }));
      setSelectedSubFeeIds(subFeesWithDue);
    } else {
      setSelectedSubFeeIds(selectedIds);
    }

    const dueAmount = calculateSelectedDueAmount(feeGroup.groupId);
    setSelectedFeeGroup(feeGroup);
    setPaymentAmount(dueAmount > 0 ? dueAmount.toFixed(2) : "");
    setPaymentMethod("");
    setShowPaymentModal(true);
  };

  // Handle payment amount change
  const handlePaymentAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setPaymentAmount(value);
    }
  };

  // Handle payment submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (selectedSubFeeIds.length === 0) {
      alert("Please select at least one fee to pay");
      return;
    }

    const amount = parseFloat(paymentAmount);
    const dueAmount = calculateSelectedDueAmount(selectedFeeGroup?.groupId || "");

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }

    if (amount > dueAmount) {
      alert(
        `Payment amount cannot exceed the due amount of ₹${dueAmount.toFixed(
          2
        )}`
      );
      return;
    }

    try {
      setPaymentProcessing(true);

      // TODO: Implement actual payment API call with selected sub-fee IDs
      // For now, show confirmation
      const confirmMessage = `Confirm payment of ₹${amount.toFixed(
        2
      )} via ${paymentMethod} for ${selectedSubFeeIds.length} selected fee(s)?`;
      if (window.confirm(confirmMessage)) {
        // Here you would call the payment API with selected sub-fee IDs
        // await api.post("FeeReceipt/FeeReceiptCreate/", { 
        //   student_id: studentId,
        //   fee_detail_ids: selectedSubFeeIds,
        //   payment_amount: amount,
        //   payment_method: paymentMethod,
        //   ... 
        // });

        alert(
          `Payment of ₹${amount.toFixed(
            2
          )} will be processed for ${selectedSubFeeIds.length} selected fee(s).\n\nNote: Payment integration will be implemented here.`
        );

        // Close modal and reset
        setShowPaymentModal(false);
        setSelectedFeeGroup(null);
        setSelectedSubFeeIds([]);
        setPaymentAmount("");
        setPaymentMethod("");

        // Clear selected sub-fees for this group
        setSelectedSubFees((prev) => {
          const newState = { ...prev };
          selectedSubFeeIds.forEach((id) => {
            delete newState[id];
          });
          return newState;
        });

        // Refetch data to update the UI
        refetchFeeData();
        refetchReceipts();
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to process payment. Please try again.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Close payment modal
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedFeeGroup(null);
    setSelectedSubFeeIds([]);
    setPaymentAmount("");
    setPaymentMethod("");
  };

  // Handle page close
  const handleClose = () => {
    navigate("/student/dashboards");
  };

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-12">
          {/* Close Button */}
          <div className="card" style={{ border: "1px solid #dee2e6", borderRadius: "8px", backgroundColor: "white" }}>
            <div className="card-body" style={{ padding: "24px", backgroundColor: "rgba(55, 123, 241, 0.1)" }}>
              {/* Close Button */}
              <div className="mb-3">
                <Button variant="danger" onClick={handleClose} style={{ width: "120px", borderRadius: "6px" }}>
                  Close
                </Button>
              </div>
              <p
                style={{
                  marginBottom: "20px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                PAYMENT DETAILS
              </p>

              {/* Student Information Card with Tab Selection */}
              <div className="card" style={{ border: "1px solid #dee2e6", borderRadius: "8px", marginBottom: "20px", backgroundColor: "white" }}>
                <div className="card-body" style={{ padding: "20px 25px", backgroundColor: "white" }}>
                  <Row>
                    <Col md={7}>
                      <Form>
                        <div className="mb-1 d-flex align-items-center">
                          <Form.Label className="mb-0" style={{ fontSize: "13px", fontWeight: "500", color: "#333", minWidth: "120px", marginRight: "10px" }}>
                            Student Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            readOnly
                            disabled
                            size="sm"
                            value={
                              studentData?.student_name ||
                              (basicDetails
                                ? `${basicDetails.first_name || ""} ${basicDetails.middle_name || ""} ${basicDetails.last_name || ""}`.trim()
                                : "-")
                            }
                            style={{
                              backgroundColor: "white",
                              fontSize: "13px",
                              padding: "3px 8px",
                              height: "28px",
                              flex: "1",
                              maxWidth: "300px",
                              border: "1px solid #e0e0e0",
                              borderRadius: "3px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
                            }}
                          />
                        </div>
                        <div className="mb-1 d-flex align-items-center">
                          <Form.Label className="mb-0" style={{ fontSize: "13px", fontWeight: "500", color: "#333", minWidth: "120px", marginRight: "10px" }}>
                            Session
                          </Form.Label>
                          <Form.Control
                            type="text"
                            readOnly
                            disabled
                            size="sm"
                            value={basicDetails?.batch_name || studentData?.batch_name || "-"}
                            style={{
                              backgroundColor: "white",
                              fontSize: "13px",
                              padding: "3px 8px",
                              height: "28px",
                              flex: "1",
                              maxWidth: "300px",
                              border: "1px solid #e0e0e0",
                              borderRadius: "3px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
                            }}
                          />
                        </div>
                        <div className="mb-1 d-flex align-items-center">
                          <Form.Label className="mb-0" style={{ fontSize: "13px", fontWeight: "500", color: "#333", minWidth: "120px", marginRight: "10px" }}>
                            Course
                          </Form.Label>
                          <Form.Control
                            type="text"
                            readOnly
                            disabled
                            size="sm"
                            value={studentData?.course_name || basicDetails?.course_name || "-"}
                            style={{
                              backgroundColor: "white",
                              fontSize: "13px",
                              padding: "3px 8px",
                              height: "28px",
                              flex: "1",
                              maxWidth: "300px",
                              border: "1px solid #e0e0e0",
                              borderRadius: "3px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
                            }}
                          />
                        </div>
                        <div className="mb-1 d-flex align-items-center">
                          <Form.Label className="mb-0" style={{ fontSize: "13px", fontWeight: "500", color: "#333", minWidth: "120px", marginRight: "10px" }}>
                            Department
                          </Form.Label>
                          <Form.Control
                            type="text"
                            readOnly
                            disabled
                            size="sm"
                            value={basicDetails?.department_description || studentData?.department_description || basicDetails?.department_name || "-"}
                            style={{
                              backgroundColor: "white",
                              fontSize: "13px",
                              padding: "3px 8px",
                              height: "28px",
                              flex: "1",
                              maxWidth: "300px",
                              border: "1px solid #e0e0e0",
                              borderRadius: "3px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
                            }}
                          />
                        </div>
                        <div className="mb-1 d-flex align-items-center">
                          <Form.Label className="mb-0" style={{ fontSize: "13px", fontWeight: "500", color: "#333", minWidth: "120px", marginRight: "10px" }}>
                            Academic Year
                          </Form.Label>
                          <Form.Control
                            type="text"
                            readOnly
                            disabled
                            size="sm"
                            value={studentData?.academicYearName || basicDetails?.academic_year || "-"}
                            style={{
                              backgroundColor: "white",
                              fontSize: "13px",
                              padding: "3px 8px",
                              height: "28px",
                              flex: "1",
                              maxWidth: "300px",
                              border: "1px solid #e0e0e0",
                              borderRadius: "3px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
                            }}
                          />
                        </div>
                        <div className="mb-0 d-flex align-items-center">
                          <Form.Label className="mb-0" style={{ fontSize: "13px", fontWeight: "500", color: "#333", minWidth: "120px", marginRight: "10px" }}>
                            Semester
                          </Form.Label>
                          <Form.Control
                            type="text"
                            readOnly
                            disabled
                            size="sm"
                            value={basicDetails?.semester_description || studentData?.semester || "-"}
                            style={{
                              backgroundColor: "white",
                              fontSize: "13px",
                              padding: "3px 8px",
                              height: "28px",
                              flex: "1",
                              maxWidth: "300px",
                              border: "1px solid #e0e0e0",
                              borderRadius: "3px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
                            }}
                          />
                        </div>
                      </Form>
                    </Col>
                    <Col md={5} className="d-flex align-items-end justify-content-end">
                      <div className="d-flex gap-3">
                        <Form.Check
                          type="radio"
                          id="view-outstanding"
                          name="view-type"
                          checked={activeTab === "outstanding"}
                          onChange={() => setActiveTab("outstanding")}
                          label="View OutStanding Details"
                          style={{ fontSize: "12px", margin: "0" }}
                        />
                        <Form.Check
                          type="radio"
                          id="view-payment"
                          name="view-type"
                          checked={activeTab === "payment"}
                          onChange={() => setActiveTab("payment")}
                          label="View Payment Details"
                          style={{ fontSize: "12px", margin: "0" }}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Outstanding Payments Tab */}
              {activeTab === "outstanding" && (
                <div>
                  {studentDetailsLoading || feeDataLoading ? (
                    <div className="text-center p-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : studentDetailsError ? (
                    <Alert variant="danger">
                      {studentDetailsError}
                      {!collegeAdmissionNo && (
                        <div className="mt-2">
                          <small>Unable to fetch admission number. Please ensure you are logged in correctly.</small>
                        </div>
                      )}
                    </Alert>
                  ) : feeDataError ? (
                    <Alert variant="danger">{feeDataError}</Alert>
                  ) : !collegeAdmissionNo ? (
                    <Alert variant="warning">
                      College admission number not found. Please contact administrator.
                    </Alert>
                  ) : (
                    <div className="table-responsive">
                      <table className="text-center table table-bordered" style={{ border: "1px solid #dee2e6", backgroundColor: "white" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
                            <th style={{ width: "80px", minWidth: "80px", maxWidth: "80px" }}></th>
                            <th>Semester</th>
                            <th>Total Amount</th>
                            <th>Paid Amount</th>
                            <th>Discount</th>
                            <th>Balance</th>
                            <th>Pay</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupedFees && groupedFees.filter(group => group.totalDue > 0).length > 0 ? (
                            groupedFees.filter(group => group.totalDue > 0).map((group, index) => {
                              const isExpanded = expandedRows.has(group.groupId);
                              const hasDue = group.totalDue > 0;
                              const groupSubFees = group.subFees || [];

                              return (
                                <React.Fragment key={group.groupId}>
                                  <tr style={{ backgroundColor: "white" }}>
                                    <td style={{ width: "40px", minWidth: "40px", maxWidth: "40px", textAlign: "center", padding: "8px" }}>
                                      <Button
                                        variant="link"
                                        size="sm"
                                        onClick={() => toggleRowExpansion(group.groupId)}
                                        style={{
                                          padding: "0",
                                          minWidth: "22px",
                                          width: "22px",
                                          color: "#000",
                                          textDecoration: "none",
                                          fontSize: "18px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {isExpanded ? "−" : "+"}
                                      </Button>
                                    </td>

                                    <td>{group.semester || "-"}</td>
                                    <td>₹{group.totalAmount.toFixed(2)}</td>
                                    <td>₹{group.totalPaid.toFixed(2)}</td>
                                    <td>₹{group.totalDiscount.toFixed(2)}</td>
                                    <td>₹{group.totalDue.toFixed(2)}</td>
                                    <td>
                                      {hasDue ? (
                                        <Button
                                          variant="primary"
                                          size="sm"
                                          onClick={() => handlePayNow(group)}
                                          style={{ minWidth: "80px" }}
                                        >
                                          Pay Now
                                        </Button>
                                      ) : (
                                        "-"
                                      )}
                                    </td>
                                  </tr>
                                  {isExpanded && groupSubFees.filter((subFee) => {
                                    const elementAmount = parseFloat(subFee.element_amount || 0);
                                    const paidAmount = parseFloat(subFee.paid_amount || 0);
                                    const balance = elementAmount - paidAmount;
                                    return balance > 0;
                                  }).length > 0 && (
                                      <tr>
                                        <td colSpan="6" style={{ padding: "0", border: "none" }}>
                                          <div style={{ margin: "10px", backgroundColor: "#f8f9fa" }}>
                                            <table className="table table-bordered table-sm" style={{ margin: "0 0 0 20px", backgroundColor: "white" }}>
                                              <thead>
                                                <tr style={{ backgroundColor: "#e9ecef" }}>
                                                  <th>Element Name</th>
                                                  <th>Amount</th>
                                                  <th>Paid</th>
                                                  <th>Balance</th>
                                                  <th style={{ width: "60px" }}>Pay</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {groupSubFees
                                                  .filter((subFee) => {
                                                    // Filter out sub-fees where balance is zero
                                                    const elementAmount = parseFloat(subFee.element_amount || 0);
                                                    const paidAmount = parseFloat(subFee.paid_amount || 0);
                                                    const balance = elementAmount - paidAmount;
                                                    return balance > 0;
                                                  })
                                                  .map((subFee) => {
                                                    const elementAmount = parseFloat(subFee.element_amount || 0);
                                                    const paidAmount = parseFloat(subFee.paid_amount || 0);
                                                    const balance = elementAmount - paidAmount;
                                                    const isSelected = selectedSubFees[String(subFee.id)]?.groupId === group.groupId;
                                                    const hasBalance = balance > 0;

                                                    return (
                                                      <tr key={subFee.id} style={{ backgroundColor: isSelected ? "#e7f3ff" : "white" }}>
                                                        <td>{subFee.element_name || "-"}</td>
                                                        <td>₹{elementAmount.toFixed(2)}</td>
                                                        <td>₹{paidAmount.toFixed(2)}</td>
                                                        <td>₹{balance > 0 ? balance.toFixed(2) : "0.00"}</td>
                                                        <td style={{ textAlign: "center" }}>
                                                          <Form.Check
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => toggleSubFeeSelection(subFee.id, group.groupId)}
                                                            disabled={!hasBalance}
                                                          />
                                                        </td>
                                                      </tr>
                                                    );
                                                  })}
                                              </tbody>
                                            </table>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                </React.Fragment>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">
                                No outstanding payments found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Payment History Tab */}
              {activeTab === "payment" && (
                <div>
                  <div className="table-responsive">
                    <table className="text-center table table-bordered" style={{ border: "1px solid #dee2e6", backgroundColor: "white" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
                          <th>Sr.No</th>
                          <th>Semester</th>
                          <th>Receipt Date</th>
                          <th>Receipt Amount</th>
                          <th>Discount Amount</th>
                          <th>Payment Method</th>
                          <th>Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receipts && receipts.length > 0 ? (
                          receipts.map((receipt, index) => (
                            <tr key={receipt.receipt_id || receipt.id || index} style={{ backgroundColor: "white" }}>
                              <td>{index + 1}</td>
                              <td>
                                {formatPeriod(
                                  receipt.semester ||
                                  receipt.fee_applied_from,
                                  receipt.receipt_date
                                )}
                              </td>
                              <td>{formatDate(receipt.receipt_date)}</td>
                              <td>
                                {parseFloat(
                                  receipt.receipt_amount ||
                                  receipt.payment_amount ||
                                  0
                                ).toFixed(2)}
                              </td>
                              <td>
                                {parseFloat(
                                  receipt.discount ||
                                  receipt.discount_amount ||
                                  0
                                ).toFixed(2)}
                              </td>
                              <td>
                                {receipt.payment_method ||
                                  receipt.payment_method_name ||
                                  "-"}
                              </td>
                              <td>
                                {receipt.receipt_id || receipt.id ? (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() =>
                                      handleReceiptClick(
                                        receipt.receipt_id || receipt.id
                                      )
                                    }
                                    style={{
                                      color: "#007bff",
                                      textDecoration: "underline",
                                      padding: 0,
                                    }}
                                  >
                                    View Receipt
                                  </Button>
                                ) : (
                                  "-"
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center">
                              No payment history found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Receipt Details Modal */}
              <Modal
                show={showReceiptModal}
                onHide={() => {
                  setShowReceiptModal(false);
                  setReceiptDetails(null);
                }}
                size="lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title>Receipt Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {receiptDetails ? (
                    <div>
                      <Row className="mb-3">
                        <Col md={6}>
                          <strong>Receipt Number:</strong>{" "}
                          {receiptDetails.receipt_no || "-"}
                        </Col>
                        <Col md={6}>
                          <strong>Receipt Date:</strong>{" "}
                          {formatDate(receiptDetails.receipt_date)}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={6}>
                          <strong>Student Name:</strong>{" "}
                          {receiptDetails.student_name || "-"}
                        </Col>
                        <Col md={6}>
                          <strong>Payment Method:</strong>{" "}
                          {receiptDetails.payment_method || "-"}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={6}>
                          <strong>Receipt Amount:</strong> ₹
                          {parseFloat(
                            receiptDetails.receipt_amount || 0
                          ).toFixed(2)}
                        </Col>
                        <Col md={6}>
                          <strong>Discount:</strong> ₹
                          {parseFloat(
                            receiptDetails.discount_amount || 0
                          ).toFixed(2)}
                        </Col>
                      </Row>
                      {receiptDetails.fee_details &&
                        receiptDetails.fee_details.length > 0 && (
                          <div className="mt-3">
                            <strong>Fee Breakdown:</strong>
                            <Table bordered className="mt-2">
                              <thead>
                                <tr>
                                  <th>Fee Element</th>
                                  <th>Amount</th>
                                  <th>Discount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {receiptDetails.fee_details.map((fee, idx) => (
                                  <tr key={idx}>
                                    <td>
                                      {fee.element_name || fee.fee_head || "-"}
                                    </td>
                                    <td>
                                      ₹{parseFloat(fee.amount || 0).toFixed(2)}
                                    </td>
                                    <td>
                                      ₹
                                      {parseFloat(
                                        fee.discount_amount || 0
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                        )}
                    </div>
                  ) : (
                    <Alert
                      variant="warning"
                      style={{ backgroundColor: "#ffffff", border: "1px solid #dee2e6" }}
                    >
                      Receipt details not available.
                    </Alert>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowReceiptModal(false);
                      setReceiptDetails(null);
                    }}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>

              {/* Payment Modal */}
              <Modal
                show={showPaymentModal}
                onHide={handleClosePaymentModal}
                size="md"
                centered
              >
                <Modal.Header
                  closeButton
                  style={{ backgroundColor: "#007bff", color: "#fff" }}
                >
                  <Modal.Title>Make Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedFeeGroup && (
                    <Form onSubmit={handlePaymentSubmit}>
                      {/* Fee Information */}
                      <div
                        className="mb-4 p-3"
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                        }}
                      >
                        <Row>
                          <Col md={6}>
                            <div style={{ fontSize: "14px", color: "#666" }}>
                              Semester:
                            </div>
                            <div
                              style={{ fontSize: "16px", fontWeight: "600" }}
                            >
                              {selectedFeeGroup.semester || "-"}
                            </div>
                          </Col>
                          <Col md={6}>
                            <div style={{ fontSize: "14px", color: "#666" }}>
                              Fee Types:
                            </div>
                            <div
                              style={{ fontSize: "16px", fontWeight: "600" }}
                            >
                              {selectedFeeGroup.subFees && selectedFeeGroup.subFees.length > 0
                                ? selectedFeeGroup.subFees
                                  .map((subFee) => subFee.element_name || subFee.fee_structure_description || "-")
                                  .filter((name, index, self) => self.indexOf(name) === index) // Remove duplicates
                                  .join(", ") || "Multiple"
                                : "-"}
                            </div>
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col md={6}>
                            <div style={{ fontSize: "14px", color: "#666" }}>
                              Total Amount:
                            </div>
                            <div
                              style={{
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#007bff",
                              }}
                            >
                              ₹{selectedFeeGroup.totalAmount.toFixed(2)}
                            </div>
                          </Col>
                          <Col md={6}>
                            <div style={{ fontSize: "14px", color: "#666" }}>
                              Already Paid:
                            </div>
                            <div
                              style={{
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#28a745",
                              }}
                            >
                              ₹{selectedFeeGroup.totalPaid.toFixed(2)}
                            </div>
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col>
                            <div style={{ fontSize: "14px", color: "#666" }}>
                              Due Amount:
                            </div>
                            <div
                              style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "#dc3545",
                              }}
                            >
                              ₹{calculateSelectedDueAmount(selectedFeeGroup.groupId).toFixed(2)}
                            </div>
                          </Col>
                        </Row>
                        {selectedSubFeeIds.length > 0 && (
                          <Row className="mt-3">
                            <Col>
                              <div style={{ fontSize: "14px", color: "#666" }}>
                                Selected Fees ({selectedSubFeeIds.length}):
                              </div>
                              <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                                {selectedFeeGroup.subFees
                                  .filter((subFee) => selectedSubFeeIds.includes(String(subFee.id)))
                                  .map((subFee) => subFee.element_name)
                                  .join(", ")}
                              </div>
                            </Col>
                          </Row>
                        )}
                      </div>

                      {/* Payment Amount Input */}
                      <Form.Group className="mb-3">
                        <Form.Label style={{ fontWeight: "600" }}>
                          Payment Amount <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <div style={{ position: "relative" }}>
                          <span
                            style={{
                              position: "absolute",
                              left: "15px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              fontSize: "18px",
                              fontWeight: "600",
                              color: "#666",
                            }}
                          >
                            ₹
                          </span>
                          <Form.Control
                            type="text"
                            value={paymentAmount}
                            onChange={handlePaymentAmountChange}
                            placeholder="0.00"
                            required
                            style={{
                              fontSize: "18px",
                              fontWeight: "600",
                              textAlign: "center",
                              border: `2px solid ${paymentAmount &&
                                parseFloat(paymentAmount) >
                                calculateSelectedDueAmount(selectedFeeGroup?.groupId || "")
                                ? "#dc3545"
                                : "#007bff"
                                }`,
                              borderRadius: "8px",
                              padding: "12px 12px 12px 35px",
                            }}
                          />
                        </div>
                        {paymentAmount &&
                          parseFloat(paymentAmount) >
                          calculateSelectedDueAmount(selectedFeeGroup?.groupId || "") ? (
                          <Form.Text
                            style={{ color: "#dc3545", fontSize: "14px" }}
                          >
                            Amount cannot exceed due amount of ₹
                            {calculateSelectedDueAmount(selectedFeeGroup?.groupId || "").toFixed(2)}
                          </Form.Text>
                        ) : (
                          <Form.Text className="text-muted">
                            You can pay any amount up to ₹
                            {calculateSelectedDueAmount(selectedFeeGroup?.groupId || "").toFixed(2)}
                          </Form.Text>
                        )}
                      </Form.Group>

                      {/* Payment Method */}
                      <Form.Group className="mb-3">
                        <Form.Label style={{ fontWeight: "600" }}>
                          Payment Method <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Form.Select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          required
                          style={{
                            border: "2px solid #007bff",
                            borderRadius: "8px",
                            padding: "10px",
                          }}
                        >
                          <option value="">Select Payment Method</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="UPI">UPI</option>
                        </Form.Select>
                      </Form.Group>

                      {/* Payment Summary */}
                      {paymentAmount && parseFloat(paymentAmount) > 0 && (
                        <div
                          className="mt-3 p-3"
                          style={{
                            backgroundColor: "#e7f3ff",
                            borderRadius: "8px",
                          }}
                        >
                          <Row>
                            <Col>
                              <div style={{ fontSize: "14px", color: "#666" }}>
                                Amount to Pay:
                              </div>
                              <div
                                style={{
                                  fontSize: "20px",
                                  fontWeight: "bold",
                                  color: "#007bff",
                                }}
                              >
                                ₹{parseFloat(paymentAmount || 0).toFixed(2)}
                              </div>
                            </Col>
                          </Row>
                          {parseFloat(paymentAmount) <
                            calculateSelectedDueAmount(selectedFeeGroup?.groupId || "") && (
                              <Row className="mt-2">
                                <Col>
                                  <div
                                    style={{ fontSize: "12px", color: "#856404" }}
                                  >
                                    Remaining after payment: ₹
                                    {(
                                      calculateSelectedDueAmount(selectedFeeGroup?.groupId || "") -
                                      parseFloat(paymentAmount || 0)
                                    ).toFixed(2)}
                                  </div>
                                </Col>
                              </Row>
                            )}
                        </div>
                      )}

                      <Modal.Footer className="px-0">
                        <Button
                          variant="secondary"
                          onClick={handleClosePaymentModal}
                          disabled={paymentProcessing}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={
                            paymentProcessing ||
                            !paymentAmount ||
                            !paymentMethod ||
                            parseFloat(paymentAmount) <= 0 ||
                            parseFloat(paymentAmount) >
                            calculateSelectedDueAmount(selectedFeeGroup?.groupId || "") ||
                            selectedSubFeeIds.length === 0
                          }
                          style={{ minWidth: "120px" }}
                        >
                          {paymentProcessing ? "Processing..." : "Proceed to Pay"}
                        </Button>
                      </Modal.Footer>
                    </Form>
                  )}
                </Modal.Body>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StdPayment;
