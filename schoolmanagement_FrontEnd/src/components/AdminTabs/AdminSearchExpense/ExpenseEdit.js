import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import SelectSearchParty from "../AdminSearchExpense/SelectSearchParty";
import { Button, Table, Form, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import api from "../../../utils/api";
import useExpenseIncomeCategories from "../../hooks/useExpenseIncomeCategories";
import useBanks from "../../hooks/useBanks";
import useBankAccounts from "../../hooks/useBankAccounts";

const AdmAttendanceEntry = () => {
  const [expenseNo, setExpenseNo] = useState("");
  const [expenseHeaderId, setExpenseHeaderId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode || "view"; // "view" or "edit"
  const isReadOnly = mode !== "edit";
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
    { id: 1, category: "", amount: "0.00", remarks: "" },
  ]);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [cashAmount, setCashAmount] = useState(0);
  const [bankAmount, setBankAmount] = useState(0);
  const [cashPaymentId, setCashPaymentId] = useState(null);
  const [bankPaymentId, setBankPaymentId] = useState(null);
  const [pendingAccountId, setPendingAccountId] = useState(null); // For setting account after accounts load

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

  const orgId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("batch_id") || sessionStorage.getItem("branch_id");

  useEffect(() => {
    if (location.state?.expenseData) {
      const expenseData = location.state.expenseData;
      console.log("Received expenseData:", expenseData);

      // Store header id for update
      setExpenseHeaderId(expenseData.expense_header_id || null);

      //  Set party details
      setPartyId(expenseData.party_id || "");
      setPartyName(expenseData.party_name || "");
      setPartyReference(expenseData.party_reference || "");

      //  Set payment details
      setExpenseNo(expenseData.expense_no || "");
      setBalPay(expenseData.balance_amount || "");
      setPaidPay(expenseData.paid_amount || "");
      setSelectedDate(
        expenseData.date || new Date().toISOString().split("T")[0]
      );
      setTotalAmount(expenseData.total_amount || 0);

      //  Map expense details
      if (Array.isArray(expenseData.ExpenseDetailsdata)) {
        setRows(
          expenseData.ExpenseDetailsdata.map((detail) => ({
            id: detail.expense_detail_id || Date.now(),
            expense_detail_id: detail.expense_detail_id || null, // Store original ID for update
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
            expense_detail_id: null,
            category: null,
            category_name: "",
            amount: "",
            remarks: "",
          },
        ]);
      }

      //  Fetch payment details directly
      if (
        Array.isArray(expenseData.PaymentDetailsData) &&
        expenseData.PaymentDetailsData.length > 0
      ) {
        const cashPayment = expenseData.PaymentDetailsData.find(
          (payment) => payment.payment_method === "Cash"
        );
        const bankPayment = expenseData.PaymentDetailsData.find(
          (payment) => payment.payment_method === "Bank"
        );

        //  Set values for cash and bank directly
        setCashAmount(cashPayment ? cashPayment.applied_amount : "");
        setCashPaymentId(cashPayment ? cashPayment.payment_detail_id || null : null);
        const bankId = bankPayment ? bankPayment.bankId : "";
        setSelectedBank(bankId);
        setBankAmount(bankPayment ? bankPayment.applied_amount : "");
        setBankPaymentId(bankPayment ? bankPayment.payment_detail_id || null : null);
        // Store account ID to set after accounts are loaded
        if (bankPayment) {
          setPendingAccountId(bankPayment.bank_accountId || bankPayment.bank_account || "");
        }
      }
    }
  }, [location.state]);

  // Handle Bank Selection
  const handleBankChange = (event) => {
    const bankId = event.target.value;
    setSelectedBank(bankId);
    setSelectedAccount(""); // Clear selected account when bank changes
    setPendingAccountId(null); // Clear pending account
  };

  const handleAccountChange = (event) => {
    setSelectedAccount(event.target.value);
  };

  const handleAddRow = () => {
    const newRow = {
      id: rows.length + 1,
      category: "",
      amount: "",
      remarks: "",
      expense_detail_id: null, // New row, no existing ID
    };
    setRows([...rows, newRow]);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleInputChange = (index, field, value) => {
    if (field === "remarks" && /\d/.test(value)) {
      return; // Do not allow numbers
    }

    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    if (field === "amount") {
      const newTotalAmount = updatedRows.reduce(
        (acc, row) => acc + parseFloat(row.amount || 0),
        0
      );
      setTotalAmount(newTotalAmount);
      // Don't auto-set cashAmount - let user choose payment method
    }

    setRows(updatedRows);
  };
  const handleCashChange = (e) => {
    const cashVal = e.target.value || "";

    // Allow clearing
    if (cashVal === "" || parseFloat(cashVal) === 0) {
      setCashAmount("");
      return;
    }

    const newCash = parseFloat(cashVal) || 0;
    const bank = parseFloat(bankAmount) || 0;
    const newPaid = newCash + bank;

    if (newPaid > totalAmount) {
      alert("The payment amount cannot be greater than total amount.");
      return;
    }

    setCashAmount(cashVal);
  };

  const handleBankAmountChange = (e) => {
    const bankVal = e.target.value || "";

    // Allow clearing
    if (bankVal === "" || parseFloat(bankVal) === 0) {
      setBankAmount("");
      return;
    }

    const cash = parseFloat(cashAmount) || 0;
    const newBank = parseFloat(bankVal) || 0;
    const newPaid = cash + newBank;

    if (newPaid > totalAmount) {
      alert("The payment amount cannot be greater than total amount.");
      return;
    }

    setBankAmount(bankVal);
  };

  // Calculate Total Paid Amount (Cash + Bank)
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


  const handleClose = () => {
    navigate("/admin/search-expense");
  };

  const handleSave = async () => {
    if (isReadOnly) return;

    if (!expenseHeaderId) {
      alert("Missing expense identifier. Cannot update record.");
      return;
    }

    if (!partyId) {
      alert("Enter Party name");
      return;
    }
    if (!partyReference || partyReference.trim() === "") {
      alert("Enter Party Reference");
      return;
    }

    const filteredExpenseDetails = rows.filter(
      (row) => row.category && row.amount
    );
    if (filteredExpenseDetails.length === 0) {
      alert("Enter ExpenseDetails data");
      return;
    }

    const userId = parseInt(sessionStorage.getItem("userId") || "0", 10);
    const organizationId = parseInt(orgId || "0", 10);
    const batchId = parseInt(branchId || "0", 10);
    const partyMasterId = parseInt(partyId || "0", 10);
    const expenseNoNum = parseInt(expenseNo || "0", 10);

    const requestBody = {
      ExpenseHeaderadd: {
        updated_by: userId,
        organization_id: organizationId,
        batch_id: batchId,
        partymasterId: partyMasterId,
        date: selectedDate, // Already in YYYY-MM-DD format
        expense_no: expenseNoNum,
        party_reference: partyReference,
        total_amount: parseFloat(totalAmount) || 0,
        paid_amount: parseFloat(paidPay) || 0,
        balance_amount: parseFloat(balPay) || 0,
      },
      ExpenseDetails: filteredExpenseDetails.map((row) => ({
        expense_detail_id: row.expense_detail_id || 0, // 0 = create new, existing ID = update
        expensecategoryId: parseInt(row.category || "0", 10),
        amount: parseFloat(row.amount) || 0,
        remarks: row.remarks || "",
      })),
    };

    // Add cash payment if amount > 0
    const cashAmt = parseFloat(cashAmount) || 0;
    if (cashAmt > 0) {
      requestBody.PaymentBasedOnCash = {
        payment_detail_id: cashPaymentId || 0, // 0 or omitted = create new, existing ID = update
        payment_method: "Cash",
        cash_amount: cashAmt,
      };
    }

    // Add bank payment if amount > 0
    const bankAmt = parseFloat(bankAmount) || 0;
    if (bankAmt > 0) {
      requestBody.PaymentBasedOnBank = {
        payment_detail_id: bankPaymentId || 0, // 0 or omitted = create new, existing ID = update
        payment_method: "Bank",
        bank_amount: bankAmt,
        bankId: parseInt(selectedBank || "0", 10),
        bank_accountId: parseInt(selectedAccount || "0", 10),
      };
    }

    try {
      await api.put(`EXPENSE/EXPENSE_HEADER/ExpenseUpdate/${expenseHeaderId}`, requestBody);
      alert("Expense updated successfully!");
      navigate("/admin/search-expense");
    } catch (error) {
      console.error("Error updating expense entry:", error);
      const errorMessage = error.response?.data?.message || "An error occurred while updating expense entry.";
      alert(errorMessage);
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
                {isReadOnly ? "VIEW EXPENSE" : "EDIT EXPENSE"}
              </p>
              <div className="row mb-3-mt-3">
                <div
                  className="col-12"
                  d-flex
                  flex-wrap
                  gap-2
                // style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                >
                  {!isReadOnly && (
                    <>
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
                    </>
                  )}
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row p-2">
                <span style={{ fontWeight: 700 }}>Expense Header</span>
                <div
                  className="col-12"
                  style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                >
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-0">
                        <label htmlFor="select-party" className="form-label">
                          Select Party<span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="select-party"
                            className="form-control details"
                            value={partyName}
                            placeholder="Enter select-party"
                            disabled
                          />
                          {/* <button
                            type="button"
                            className="btn btn-primary ms-2 mb-0 mt-0"
                            onClick={handleOpenModal}
                          >
                            ...
                          </button> */}
                        </div>
                      </div>
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="date" className="form-label">
                          Date <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="date"
                          id="date"
                          className="form-control details"
                          ref={dateRef}
                          max={new Date().toISOString().split("T")[0]}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          disabled={isReadOnly}
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
                            className="form-control details"
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
                            className="form-control details"
                            value={partyReference}
                            onChange={(e) => setPartyReference(e.target.value)}
                            placeholder="Enter party reference"
                            disabled={isReadOnly}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-3 mb-0">
                        <label htmlFor="total-amount" className="form-label">
                          Total Amount
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="total-amount"
                            className="form-control details"
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
                            className="form-control details"
                            value={typeof paidPay === 'number' ? paidPay.toFixed(2) : paidPay}
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
                            className="form-control details"
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

              <div className="row">
                <div
                  className="col-12"
                  style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                >
                  <div className="mt-2">
                    <h3 style={{ color: "black" }}>Expense Detail</h3>
                    <Table bordered hover disabled>
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
                                disabled={isReadOnly}
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
                                disabled={isReadOnly}
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
                                disabled={isReadOnly}
                              />
                            </td>
                            <td>
                              <Button
                                variant="danger"
                                onClick={() => handleRemoveRow(index)}
                                disabled={isReadOnly || rows.length === 1}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {!isReadOnly && (
                      <div className="d-flex justify-content-end mb-3">
                        <Button variant="primary" onClick={handleAddRow}>
                          Add New Row
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div
                  className="col-12 p-2"
                  style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                >
                  {/* Cash Input Field */}
                  <Row className="align-items-center mb-2">
                    <Col xs={2}>
                      <strong>CASH</strong>
                    </Col>
                    <Col xs={4}>
                      <Form.Control
                        type="text"
                        value={cashAmount}
                        onChange={handleCashChange}
                        disabled={isReadOnly}
                        placeholder="Enter cash amount"
                      />
                    </Col>
                  </Row>
                  {/* Bank Selection */}
                  <Row className="align-items-center mt-3">
                    <Col xs={2}>
                      <strong>BANK</strong>
                    </Col>
                    <Col xs={2}>
                      <Form.Select
                        disabled={isReadOnly || loadingBanks}
                        onChange={handleBankChange}
                        value={selectedBank}
                      >
                        <option value="">Select Bank</option>
                        {loadingBanks ? (
                          <option>Loading...</option>
                        ) : bankList.length === 0 ? (
                          <option>No banks available</option>
                        ) : (
                          bankList.map((bank) => (
                            <option key={bank.id} value={bank.id}>
                              {bank.bankname || bank.bank_name}
                            </option>
                          ))
                        )}
                      </Form.Select>
                      {errorBanks && (
                        <small className="text-danger d-block mt-1">{errorBanks}</small>
                      )}
                    </Col>
                    {/* Account Selection Dropdown */}
                    <Col xs={2}>
                      <Form.Select
                        disabled={isReadOnly || !selectedBank || loadingAccounts}
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
                      <Form.Control
                        type="text"
                        value={bankAmount}
                        onChange={handleBankAmountChange}
                        placeholder="Enter bank amount"
                        disabled={isReadOnly}
                      />
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
