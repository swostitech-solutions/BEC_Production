import React, { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";

const ExpenseDetail = () => {
  const [rows, setRows] = useState([
    { id: 1, category: "", amount: "0.00", remarks: "" },
    { id: 2, category: "", amount: "0.00", remarks: "" },
    { id: 3, category: "", amount: "0.00", remarks: "" },
  ]);
  const [bankList, setBankList] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountList, setAccountList] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [errorBanks, setErrorBanks] = useState("");
  const [errorAccounts, setErrorAccounts] = useState("");
  const [expenseCategory, setExpenseCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const orgId = localStorage.getItem("orgId");
  const branchId = localStorage.getItem("branchId");

  // Fetch Bank List on Component Mount
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch(`${ApiUrl.apiurl}BANK/GetAllBankList/`);
        const result = await response.json();

        if (response.ok && result.data) {
          setBankList(result.data);
        } else {
          throw new Error("Failed to fetch bank list");
        }
      } catch (err) {
        setErrorBanks("Error fetching banks");
      } finally {
        setLoadingBanks(false);
      }
    };
    fetchBanks();
  }, []);
  // Fetch Account Details When a Bank is Selected
  const fetchAccountDetails = async (bankId) => {
    if (!bankId) return;
    setLoadingAccounts(true);
    setErrorAccounts(""); // Reset error message

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}Account_Details/GetAccountDetailsBasedOnBankId/${bankId}`
      );
      const result = await response.json();

      if (response.ok) {
        if (result.message === "No record found!!") {
          setAccountList([]);
          setErrorAccounts("No accounts found for this bank.");
        } else if (result.data) {
          setAccountList(result.data);
        }
      } else {
        throw new Error("Failed to fetch account details.");
      }
    } catch (err) {
      setErrorAccounts("Error fetching account details");
      setAccountList([]);
    } finally {
      setLoadingAccounts(false);
    }
  };
  // Handle Bank Selection
  const handleBankChange = (event) => {
    const bankId = event.target.value;
    setSelectedBank(bankId);
    fetchAccountDetails(bankId);
  };

  // Fetch expense categories
  useEffect(() => {
    const fetchExpenseCategory = async () => {
      try {
        const response = await fetch(
          `${ApiUrl.apiurl}EXPENSE/EXPENSE_INCOME/ListBasedOnCategory/?org_id=${orgId}&branch_id=${branchId}&flag=E`
        );
        const data = await response.json();
        if (data.message === "success" && Array.isArray(data.data)) {
          setExpenseCategory(data.data);
        }
      } catch (error) {
        console.error("Error fetching expense categories:", error);
      }
    };
    fetchExpenseCategory();
  }, []);

  // const handleInputChange = (index, field, value) => {
  //   const updatedRows = [...rows];
  //   updatedRows[index][field] = value;
  //   setRows(updatedRows);
  // };
  // Handle Input Change & Update Total Amount
  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] =
      field === "amount" ? parseFloat(value) || 0 : value;
    setRows(updatedRows);

    // Calculate Total Amount & Ensure it's a Number
    const total = updatedRows.reduce(
      (sum, row) => sum + (parseFloat(row.amount) || 0),
      0
    );
    setTotalAmount(total);
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

  // const handleRemoveRow = (index) => {
  //   const updatedRows = rows.filter((row, i) => i !== index);
  //   setRows(updatedRows);
  // };

  // const handlePaymentChange = (field, value) => {
  //   setPayment({ ...payment, [field]: value });
  // };

  // Remove Row
  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);

    // Recalculate Total Amount After Removing a Row
    const total = updatedRows.reduce(
      (sum, row) => sum + parseFloat(row.amount)
    );
    setTotalAmount(total);
  };

  return (
    <div className="container-fluid">
      <div className="mt-2">
        <h3 style={{ color: "black" }}>Expense Detail</h3>
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
                      handleInputChange(index, "category", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {expenseCategory.map((category) => (
                      <option
                        key={category.expense_category_id}
                        value={category.expense_category}
                      >
                        {category.expense_category}
                      </option>
                    ))}
                  </Form.Control>
                </td>
                {/* <td>
                  <Form.Control
                    type="text"
                    value={row.amount}
                    onChange={(e) =>
                      handleInputChange(index, "amount", e.target.value)
                    }
                  />
                </td> */}
                <td>
                  <Form.Control
                    type="text"
                    // value={setTotalAmount(rows.reduce((sum, row) => sum + (parseFloat(row.amount)), 0))}
                    onChange={(e) =>
                      handleInputChange(index, "amount", e.target.value)
                    }
                    // onBlur={() => setTotalAmount(rows.reduce((sum, row) => sum + (parseFloat(row.amount)), 0))}
                    onFocus={(e) => e.target.select()}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={row.remarks}
                    onChange={(e) =>
                      handleInputChange(index, "remarks", e.target.value)
                    }
                  />
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveRow(index)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="primary" onClick={handleAddRow}>
          Add New Row
        </Button>
      </div>
      <hr></hr>

      {/* Cash Input Field */}
      <Row className="align-items-center mb-2">
        <Col xs={2}>
          <strong>CASH</strong>
        </Col>
        <Col xs={4}>
          <Form.Control type="text" value={totalAmount.toFixed(2)} />
        </Col>
      </Row>

      {/* Bank Selection */}
      <Row className="align-items-center mt-3">
        <Col xs={2}>
          <strong>BANK</strong>
        </Col>
        <Col xs={2}>
          <Form.Select onChange={handleBankChange} value={selectedBank}>
            <option value="">Select Bank</option>
            {loadingBanks ? (
              <option>Loading...</option>
            ) : errorBanks ? (
              <option>{errorBanks}</option>
            ) : (
              bankList.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.bankname}
                </option>
              ))
            )}
          </Form.Select>
        </Col>

        {/* Branch Selection Dropdown */}
        <Col xs={2}>
          <Form.Select disabled={!selectedBank || loadingAccounts}>
            <option value="">
              {loadingAccounts
                ? "Loading..."
                : errorAccounts
                ? errorAccounts
                : "Select Branch"}
            </option>
            {!loadingAccounts &&
              !errorAccounts &&
              accountList.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.branch_name} - {account.ifsc}
                </option>
              ))}
          </Form.Select>
        </Col>

        <Col xs={4}>
          <Form.Control type="text" placeholder="Enter bank amount" />
        </Col>
      </Row>
    </div>
  );
};

export default ExpenseDetail;
