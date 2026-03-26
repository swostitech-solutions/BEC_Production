import React, { useRef, useState, useEffect } from "react";
import SelectStudentModal from "../AdminAttendanceEntry/SelectStudentModal";
import { useNavigate, useLocation } from "react-router-dom";
import ExpenseDetail from "./ExpenseDetail";
import SelectSearchParty from "../AdminSearchExpense/SelectSearchParty";
import { ApiUrl } from "../../../ApiUrl";
import api from "../../../utils/api";
import { Button, Table, Form, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SelectSearchParty.css";
import useExpenseIncomeCategories from "../../hooks/useExpenseIncomeCategories";
import useBanks from "../../hooks/useBanks";
import useBankAccounts from "../../hooks/useBankAccounts";

const AdmAttendanceEntry = () => {
  const [showModal, setShowModal] = useState(false);
  const [expenseNo, setExpenseNo] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [expenseHeaderId, setExpenseHeaderId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const dateRef = useRef(null);
  const [partyId, setPartyId] = useState("");
  const [partyName, setPartyName] = useState("");
  const [partyReference, setPartyReference] = useState("");
  const [balPay, setBalPay] = useState("");
  const [paidPay, setPaidPay] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [rows, setRows] = useState([
    { id: 1, category: "", amount: "", remarks: "" },
  ]);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [cashAmount, setCashAmount] = useState(0);
  const [bankAmount, setBankAmount] = useState();
  const [pendingAccountId, setPendingAccountId] = useState(null); // For setting account after accounts load
  const [errors, setErrors] = useState({});
  const [saveMsg, setSaveMsg] = useState({ type: "", text: "" });
  const [rowErrors, setRowErrors] = useState({});

  // Custom hooks for fetching data
  const { categories: expenseCategory, loading: loadingCategories } = useExpenseIncomeCategories("E");
  const { banks: bankList, loading: loadingBanks, error: errorBanks } = useBanks();
  const { accounts: accountList, loading: loadingAccounts, error: errorAccounts } = useBankAccounts(selectedBank);

  // Set account when accounts are loaded and we have a pending account ID
  useEffect(() => {
    if (pendingAccountId && accountList.length > 0 && !loadingAccounts) {
      setSelectedAccount(pendingAccountId);
      setPendingAccountId(null);
    }
  }, [accountList, loadingAccounts, pendingAccountId]);

  const orgId = localStorage.getItem("orgId");
  const batchId = localStorage.getItem("academicSessionId");
  const branchId = localStorage.getItem("branchId");
  // Fetch expense number from API
  useEffect(() => {
    const fetchExpenseNo = async () => {
      try {
        const response = await api.get('EXPENSE/EXPENSE_HEADER/GetExpenseNo/');
        const data = response.data;
        if (data.message === "success") {
          setExpenseNo(data.expense_no);
        }
      } catch (error) {
        console.error("Error fetching expense number:", error);
      }
    };
    fetchExpenseNo();
  }, []);
  const handleSelectedParty = (selectedParty) => {
    console.log("Selected Party:", selectedParty);
    setPartyId(selectedParty.party_id || "");
    setPartyName(selectedParty.party_name || "");
    setErrors((prev) => ({ ...prev, partyId: "" }));
    handleCloseModal();
  };

  const handleClear = () => {
    // if (dateRef.current) dateRef.current.value = "";
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setPartyName("");
    setPartyReference("");
    setPaidPay("");
    setBalPay(0.0);
    setTotalAmount(0.0);
    setCashAmount(0.0);
    setBankAmount("");
    setSelectedBank("");
    setSelectedAccount("");
    setRows([{ id: 1, category: "", amount: "", remarks: "" }]);
    setErrors({});
    setSaveMsg({ type: "", text: "" });
    setRowErrors({});
  };
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    // navigate("/admin/search-expense");
    setShowModal(false);
  };
  const handleCloseBut = () => {
    navigate("/admin/search-expense");
  };
  // Handle Bank Selection
  const handleBankChange = (event) => {
    const bankId = event.target.value;
    setSelectedBank(bankId);
    setSelectedAccount(""); // Reset account when bank changes
  };
  const handleAddRow = () => {
    const newRow = {
      id: rows.length + 1,
      category: "",
      amount: 0,
      remarks: "",
    };
    setRows([...rows, newRow]);
  };
  // Remove Row
  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };
  // Calculate Total Paid Amount (Cash + Bank)
  // useEffect(() => {
  //   const totalPaid = parseFloat(cashAmount) + parseFloat(bankAmount);
  //   setPaidPay(totalPaid.toFixed(2));
  // }, [cashAmount, bankAmount]);

  useEffect(() => {
    const cash = parseFloat(cashAmount) || 0;
    const bank = parseFloat(bankAmount) || 0;
    setPaidPay(cash + bank);
  }, [cashAmount, bankAmount]);

  // Calculate Balance Amount
  useEffect(() => {
    const balanceAmount = parseFloat(totalAmount) - parseFloat(paidPay);
    setBalPay(balanceAmount.toFixed(2));
  }, [totalAmount, paidPay]);
  // Validate remarks: only valid characters, not starting with number
  const validateRemarks = (value) => {
    if (!value || value.trim() === "") {
      return true; // Allow empty remarks
    }
    // Check if starts with a number
    if (/^\d/.test(value)) {
      return false;
    }
    // Allow only alphanumeric characters, spaces, and common punctuation
    const validPattern = /^[a-zA-Z0-9\s.,!?@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/]*$/;
    return validPattern.test(value);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    // Only allow numbers (with optional decimal) in amount field
    if (field === "amount" && value !== "" && !/^\d*\.?\d*$/.test(value)) return;
    updatedRows[index][field] = value;
    // Clear row error for this cell
    const rowId = updatedRows[index].id;
    if (field === "category" || field === "amount") {
      setRowErrors((prev) => ({ ...prev, [rowId]: { ...prev[rowId], [field]: "" } }));
    }

    if (field === "amount") {
      const newTotalAmount = updatedRows.reduce(
        (acc, row) => acc + parseFloat(row.amount || 0),
        0
      );
      setTotalAmount(newTotalAmount);
      // setCashAmount(newTotalAmount.toFixed(2));
      // setBankAmount(newTotalAmount.toFixed(2));
    }

    setRows(updatedRows);
  };

  const handleCashChange = (e) => {
    const cashVal = e.target.value;
    if (cashVal !== "" && !/^\d*\.?\d*$/.test(cashVal)) return;
    setErrors((prev) => ({ ...prev, payment: "", cashAmount: "" }));
    if (cashVal === "" || parseFloat(cashVal) === 0) {
      setCashAmount("");
      return;
    }
    const newCash = parseFloat(cashVal) || 0;
    const bank = parseFloat(bankAmount) || 0;
    const newPaid = newCash + bank;
    if (newPaid > totalAmount) {
      setErrors((prev) => ({ ...prev, cashAmount: "Payment amount cannot exceed total amount." }));
      return;
    }
    setCashAmount(cashVal);
  };

  const handleBankAmountChange = (e) => {
    const bankVal = e.target.value;
    if (bankVal !== "" && !/^\d*\.?\d*$/.test(bankVal)) return;
    setErrors((prev) => ({ ...prev, payment: "", bankAmount: "" }));
    if (bankVal === "" || parseFloat(bankVal) === 0) {
      setBankAmount("");
      return;
    }
    const cash = parseFloat(cashAmount) || 0;
    const newBank = parseFloat(bankVal) || 0;
    const newPaid = cash + newBank;
    if (newPaid > totalAmount) {
      setErrors((prev) => ({ ...prev, bankAmount: "Payment amount cannot exceed total amount." }));
      return;
    }
    setBankAmount(bankVal);
  };

  const handleAccountChange = (event) => {
    setSelectedAccount(event.target.value);
  };

  useEffect(() => {
    if (location.state?.expenseData) {
      const expenseData = location.state.expenseData;
      console.log("Received expenseData:", expenseData);
      setIsEditMode(true);
      setExpenseHeaderId(expenseData.expense_header_id || null);
      setPartyId(expenseData.party_id || "");
      setPartyName(expenseData.party_name || "");
      setPartyReference(expenseData.party_reference || "");
      setExpenseNo(expenseData.expense_no || "");
      setBalPay(expenseData.balance_amount || "");
      setPaidPay(expenseData.paid_amount || "");
      setSelectedDate(
        expenseData.date || new Date().toISOString().split("T")[0]
      );
      setTotalAmount(expenseData.total_amount || 0);
      // Map rows
      if (Array.isArray(expenseData.ExpenseDetailsdata)) {
        setRows(
          expenseData.ExpenseDetailsdata.map((detail) => ({
            id: detail.expense_detail_id || Date.now(),
            category: detail.expense_categoryId || null,
            category_name: detail.expense_category_name || "",
            amount: detail.amount || "",
            remarks: detail.remarks || "",
          }))
        );
      } else {
        setRows([
          {
            id: Date.now(),
            category: null,
            category_name: "",
            amount: "",
            remarks: "",
          },
        ]);
      }
      // Payment details
      const cashPayment = expenseData.PaymentDetailsData?.find(
        (p) => p.payment_method === "Cash"
      );
      const bankPayment = expenseData.PaymentDetailsData?.find(
        (p) => p.payment_method === "Bank"
      );
      setCashAmount(cashPayment ? cashPayment.applied_amount : "");
      if (bankPayment) {
        const bankId = bankPayment.bankId;
        setSelectedBank(bankId || "");
        setBankAmount(bankPayment.applied_amount || "");
        // Store account ID to set after accounts are loaded
        setPendingAccountId(bankPayment.bank_accountId || "");
      }
    }
  }, [location.state]);


  const handleSave = async () => {
    const fieldErrors = {};
    if (!partyId) fieldErrors.partyId = "Please select a party.";
    if (!partyReference || partyReference.trim() === "") fieldErrors.partyReference = "Party Reference is required.";

    // Validate cash/bank: at least one must have a valid positive value
    const cashVal = parseFloat(cashAmount);
    const bankVal = parseFloat(bankAmount);
    const hasCash = !isNaN(cashVal) && cashVal > 0;
    const hasBank = !isNaN(bankVal) && bankVal > 0;
    const hasCashInput = cashAmount && String(cashAmount).trim() !== "";
    const hasBankInput = bankAmount && String(bankAmount).trim() !== "";

    if (!hasCash && !hasBank) {
      fieldErrors.payment = "Please enter Cash or Bank payment amount.";
    }
    if (hasCashInput && !hasCash) {
      fieldErrors.cashAmount = "Please enter a valid cash amount.";
    }
    if (hasBankInput && !hasBank) {
      fieldErrors.bankAmount = "Please enter a valid bank amount.";
    }

    // Per-row validation
    const newRowErrors = {};
    rows.forEach((row) => {
      const rowErr = {};
      if (!row.category) rowErr.category = "Required";
      if (!row.amount || isNaN(parseFloat(row.amount)) || parseFloat(row.amount) <= 0) rowErr.amount = "Required";
      if (Object.keys(rowErr).length) newRowErrors[row.id] = rowErr;
    });

    if (Object.keys(fieldErrors).length || Object.keys(newRowErrors).length) {
      setErrors(fieldErrors);
      setRowErrors(newRowErrors);
      return;
    }
    setErrors({});
    setRowErrors({});

    const filteredExpenseDetails = rows.filter(
      (row) => row.category && row.amount
    );

    const requestBody = {
      ExpenseHeaderadd: {
        created_by: sessionStorage.getItem("userId"),
        org_id: orgId,
        branch_id: branchId,
        batch_id: batchId,
        partymasterId: partyId,
        date: selectedDate,
        expense_no: expenseNo,
        party_reference: partyReference,
        total_amount: parseFloat(totalAmount),
        paid_amount: parseFloat(paidPay),
        balance_amount: parseFloat(balPay),
      },
      ExpenseDetails: rows.map((row) => {
        const expenseDetail = {
          expensecategoryId: row.category,
          amount: parseFloat(row.amount),
        };
        // Only include remarks if it has a value
        if (row.remarks && row.remarks.trim() !== "") {
          expenseDetail.remarks = row.remarks.trim();
        }
        return expenseDetail;
      }),
    };

    // Conditionally add cash or bank payment sections
    if (parseFloat(cashAmount) > 0) {
      requestBody.PaymentBasedOnCash = {
        payment_method: "Cash",
        cash_amount: parseFloat(cashAmount),
      };
    }

    if (parseFloat(bankAmount) > 0) {
      requestBody.PaymentBasedOnBank = {
        payment_method: "Bank",
        bank_amount: parseFloat(bankAmount),
        bankId: selectedBank,
        bank_accountId: selectedAccount,
      };
    }

    try {
      const isEdit = !!expenseHeaderId;
      const url = isEdit
        ? `EXPENSE/EXPENSE_HEADER/ExpenseUpdate/${expenseHeaderId}`
        : `EXPENSE/EXPENSE_HEADER/ExpenseCreate/`;

      if (isEdit) {
        await api.put(url, requestBody);
      } else {
        await api.post(url, requestBody);
      }
alert(
  isEdit
    ? "Expense updated successfully!"
    : "Expense entry saved successfully!",
);

navigate("/admin/search-expense");
    } catch (error) {
      console.error("Error saving expense entry:", error);
      const errorMessage = error.response?.data?.message || "An error occurred while saving expense entry.";
      setSaveMsg({ type: "danger", text: errorMessage });
    }
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
                ADD EXPENSE
              </p>
              <div className="row mb-3 mt-3">
                <div className="col-12  d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleCloseBut}
                  >
                    Close
                  </button>
                </div>
              </div>

              {saveMsg.text && (
                <div className={`alert alert-${saveMsg.type} mx-2 mt-2`} role="alert">
                  {saveMsg.text}
                </div>
              )}

              <div className="row p-2 mt-3 position-relative">
                {/* Line with Hidden Section for Text */}
                <div className="position-relative w-100">
                  <div className="expense-header-line"></div>
                  {/* <h5 className="expense-header">Expense Header</h5> */}
                </div>

                <div
                  className="col-12 p-2"
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    background: "white",
                  }}
                >
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-0">
                        <label htmlFor="select-party" className="form-label">
                          Select Party<span style={{ color: "red" }}> *</span>
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="select-party"
                            className="form-control detail"
                            value={partyName}
                            placeholder="Enter select-party"
                            disabled
                          />
                          <button
                            type="button"
                            className="btn btn-primary ms-2 mb-0 mt-0"
                            onClick={handleOpenModal}
                            style={{ width: "50px", padding: "3px" }}
                          >
                            ...
                          </button>
                        </div>
                        {errors.partyId && <small className="text-danger">{errors.partyId}</small>}
                      </div>
                      <SelectSearchParty
                        show={showModal}
                        handleClose={handleCloseModal}
                        onSelect={handleSelectedParty}
                      />
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="date" className="form-label">
                          Date <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="date"
                          id="date"
                          className="form-control detail"
                          ref={dateRef}
                          max={new Date().toISOString().split("T")[0]}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-0">
                        <label htmlFor="expense-no" className="form-label">
                          Expense No.
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="expense-no"
                            className="form-control detail"
                            value={expenseNo}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-3 mb-0">
                        <label htmlFor="party-reference" className="form-label">
                          Party Reference{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="party-reference"
                            className={`form-control detail ${errors.partyReference ? "is-invalid" : ""}`}
                            value={partyReference}
                            onChange={(e) => {
                              setPartyReference(e.target.value);
                              setErrors((prev) => ({ ...prev, partyReference: "" }));
                            }}
                            placeholder="Enter party reference"
                          />
                        </div>
                        {errors.partyReference && <small className="text-danger">{errors.partyReference}</small>}
                      </div>
                      <div className="col-12 col-md-3 mb-0">
                        <label htmlFor="total-amount" className="form-label">
                          Total Amount
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="total-amount"
                            className="form-control detail"
                            placeholder="0.00"
                            value={totalAmount.toFixed(2)}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="paid-amount" className="form-label">
                          Paid Amount
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="paid-amount"
                            className="form-control detail"
                            value={paidPay}
                            placeholder="0.00"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-3 mb-0">
                        <label htmlFor="balance-amount" className="form-label">
                          Balance Amount
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="balance-amount"
                            className="form-control detail"
                            value={balPay}
                            placeholder="0.00"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row p-2">
                <div
                  className="col-12 mt-3"
                  style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                >
                  {/* <div className="mt-2">
                    <h5 style={{ color: "black" }}>Expense Detail</h5>
                    <Table bordered hover>
                      <thead className="thead-dark">
                        <tr>
                          <th>Sr.No</th>
                          <th>Expense Category</th>
                          <th>Amount</th>
                          <th>Remarks</th>
                          <th>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <Form.Control
                                as="select"
                                className="form-select"
                                value={row.category}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "category",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select</option>
                                {expenseCategory.map((category) => (
                                  <option
                                    key={category.expense_category_id}
                                    // value={category.expense_category}
                                    value={category.expense_category_id}
                                  >
                                    {category.expense_category}
                                  </option>
                                ))}
                              </Form.Control>
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={row.amount}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "amount",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={row.remarks}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "remarks",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <Button
                                variant="danger"
                                onClick={() => handleRemoveRow(index)}
                                disabled={rows.length === 1}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <div className="d-flex justify-content-end">
                      <Button
                        className="mb-3"
                        variant="primary"
                        onClick={handleAddRow}
                      >
                        Add New Row
                      </Button>
                    </div>
                  </div> */}
                  <div className="mt-2">
                    <h5 style={{ color: "black" }}>Expense Detail</h5>

                    {/* Responsive wrapper */}
                    <div className="table-responsive">
                      <Table bordered hover>
                        <thead className="thead-dark">
                          <tr>
                            <th>Sr.No</th>
                            <th>Expense Category</th>
                            <th>Amount</th>
                            <th>Remarks</th>
                            <th>Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <Form.Control
                                  as="select"
                                  className={`form-select ${rowErrors[row.id]?.category ? "is-invalid" : ""}`}
                                  value={row.category}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "category",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">Select</option>
                                  {expenseCategory.map((category) => (
                                    <option
                                      key={category.expense_category_id}
                                      value={category.expense_category_id}
                                    >
                                      {category.expense_category}
                                    </option>
                                  ))}
                                </Form.Control>
                                {rowErrors[row.id]?.category && <small className="text-danger">{rowErrors[row.id].category}</small>}
                              </td>
                              <td>
                                <Form.Control
                                  type="text"
                                  className={rowErrors[row.id]?.amount ? "is-invalid" : ""}
                                  value={row.amount}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "amount",
                                      e.target.value
                                    )
                                  }
                                />
                                {rowErrors[row.id]?.amount && <small className="text-danger">{rowErrors[row.id].amount}</small>}
                              </td>
                              <td>
                                <Form.Control
                                  type="text"
                                  value={row.remarks}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "remarks",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <Button
                                  variant="danger"
                                  onClick={() => handleRemoveRow(index)}
                                  disabled={rows.length === 1}
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>

                    <div className="d-flex justify-content-end">
                      <Button
                        className="mb-3"
                        variant="primary"
                        onClick={handleAddRow}
                      >
                        Add New Row
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row p-2">
                <div
                  className="col-12 p-2 mt-3"
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    background: "white",
                  }}
                >
                  {/* Cash Input Field */}
                  <Row className="align-items-center mb-2">
                    <Col xs={2}>
                      <strong>CASH</strong>
                    </Col>
                    <Col xs={4}>
                      <Form.Control
                        type="text"
                        className={errors.cashAmount ? "is-invalid" : ""}
                        value={cashAmount}
                        onChange={handleCashChange}
                      />
                      {errors.cashAmount && <small className="text-danger">{errors.cashAmount}</small>}
                    </Col>
                  </Row>
                  {errors.payment && (
                    <small className="text-danger d-block mb-2">{errors.payment}</small>
                  )}
                  {/* Bank Selection */}
                  <Row className="align-items-center mt-3">
                    <Col xs={2}>
                      <strong>BANK</strong>
                    </Col>
                    <Col xs={2}>
                      <Form.Select
                        onChange={handleBankChange}
                        value={selectedBank}
                        disabled={loadingBanks}
                      >
                        <option value="">Select Bank</option>
                        {loadingBanks ? (
                          <option>Loading...</option>
                        ) : bankList.length === 0 ? (
                          <option>No banks available</option>
                        ) : (
                          bankList.map((bank) => (
                            <option key={bank.id} value={bank.id}>
                              {bank.bank_name}
                            </option>
                          ))
                        )}
                      </Form.Select>
                      {errorBanks && (
                        <small className="text-danger d-block mt-1">{errorBanks}</small>
                      )}
                    </Col>
                    {/* Branch Selection Dropdown */}
                    <Col xs={2}>
                      <Form.Select
                        disabled={!selectedBank || loadingAccounts}
                        onChange={handleAccountChange}
                        value={selectedAccount}
                      >
                        <option value="">
                          {loadingAccounts
                            ? "Loading..."
                            : accountList.length === 0
                            ? "No accounts available"
                            : "Select Account"}
                        </option>
                        {!loadingAccounts &&
                          accountList.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.bank_account} - {account.ifsc}
                            </option>
                          ))}
                      </Form.Select>
                      {errorAccounts && (
                        <small className="text-danger d-block mt-1">{errorAccounts}</small>
                      )}
                    </Col>
                    <Col xs={4} className="d-flex">
                      <div className="w-100">
                        <Form.Control
                          disabled={!selectedBank && !bankAmount}
                          type="text"
                          className={errors.bankAmount ? "is-invalid" : ""}
                          value={bankAmount}
                          onChange={handleBankAmountChange}
                          placeholder="Enter bank amount"
                        />
                        {errors.bankAmount && <small className="text-danger">{errors.bankAmount}</small>}
                      </div>
                    </Col>
                  </Row>
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
