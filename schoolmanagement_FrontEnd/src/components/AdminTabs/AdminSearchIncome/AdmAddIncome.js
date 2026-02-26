import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {  useNavigate } from "react-router-dom";
import SelectSearchParty from "../AdminSearchExpense/SelectSearchParty";
import Select from "react-select";
import { Table, Form, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "./AdmAddIncome.css";
import { ApiUrl } from "../../../ApiUrl";
import api from "../../../utils/api";
import useExpenseIncomeCategories from "../../hooks/useExpenseIncomeCategories";
import useBanks from "../../hooks/useBanks";
import useBankAccounts from "../../hooks/useBankAccounts";

const AdmAttendanceEntry = () => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [selectedBank, setSelectedBank] = useState(null);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [partyId, setPartyId] = useState("");
  const [partyName, setPartyName] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // Custom hooks for fetching data
  const { categories, loading: loadingCategories } = useExpenseIncomeCategories("I");
  const { banks, loading: loadingBanks, error: errorBanks } = useBanks();
  const { accounts, loading: loadingAccounts, error: errorAccounts } = useBankAccounts(selectedBank?.value);

  // Transform to React Select format
  const categoryOptions = categories.map((cat) => ({
    value: cat.value || cat.expense_category_id,
    label: cat.label || cat.expense_category,
  }));

  const bankOptions = banks.map((bank) => ({
    value: bank.id,
    label: bank.bank_name || bank.bankname || "Unknown Bank",
  }));

  const accountOptions = accounts.map((account) => ({
    value: account.id,
    label: account.bank_account ? account.bank_account.toString() : "Unknown Account",
  }));

  const [partyDetails, setPartyDetails] = useState({
    party_id: "",
    party_name: "",
    party_type: "",
  });
  const [rows, setRows] = useState([
    { id: Date.now(), category: "", amount: "", remarks: "" },
  ]);
  const [incomeNo, setIncomeNo] = useState("");
  const [partyReference, setPartyReference] = useState(""); //  Declare state

  const dateRef = useRef(null);

  const handleClear = () => {
    setSelectedPayment(null);
    setSelectedBank(null);
    setSelectedAccount(null);
    setPartyReference("");
    setPartyDetails({
      party_id: "",
      party_name: "",
      party_type: "",
    });
    setRows([{ id: Date.now(), category: "", amount: "", remarks: "" }]);
    // Do NOT clear incomeNo and currentDate
  };

  // Store income data account ID for later use
  const [pendingAccountId, setPendingAccountId] = useState(null);

  // Set account when accounts are loaded and we have a pending account ID
  useEffect(() => {
    if (pendingAccountId && accountOptions.length > 0) {
      const account = accountOptions.find(
        (option) => option.value === pendingAccountId
      ) || null;
      setSelectedAccount(account);
      setPendingAccountId(null); // Clear pending ID
    }
  }, [accountOptions, pendingAccountId]);

  useEffect(() => {
    if (location.state?.incomeData) {
      const incomeData = location.state.incomeData;

      //  Set selected payment method
      const payment = paymentOptions.find(
        (option) => option.label === incomeData.payment_method
      ) || null;
      setSelectedPayment(payment);

      //  Set selected bank
      const bank = bankOptions.find((option) => option.value === incomeData.bank_id) || null;
      setSelectedBank(bank);

      // Store account ID to set after accounts are fetched
      if (incomeData.account_id) {
        setPendingAccountId(incomeData.account_id);
      }

      //  Set party details
      setPartyDetails({
        party_id: incomeData.party_id || "",
        party_name: incomeData.party_name || "",
        party_type: incomeData.party_type || "",
      });

      //  Set other fields
      setCurrentDate(incomeData.income_date || "");
      setIncomeNo(incomeData.income_no || "");
      setPartyReference(incomeData.party_reference || "");

      //  Map income details
      if (Array.isArray(incomeData.IncomeDetailsdata)) {
        setRows(
          incomeData.IncomeDetailsdata.map((detail) => ({
            id: detail.income_detail_id || Date.now(),
            category:
              categoryOptions.find((opt) => opt.value === detail.category_id) ||
              null,
            amount: detail.amount || "",
            remarks: detail.remarks || "",
          }))
        );
      } else {
        setRows([{ id: Date.now(), category: null, amount: "", remarks: "" }]);
      }
    }
  }, [
    location.state,
    paymentOptions,
    bankOptions,
    categoryOptions,
  ]);


  // Fetch Income No. from the API
  useEffect(() => {
    const fetchIncomeNo = async () => {
      try {
        const response = await api.get('EXPENSE/INCOME/GetIncomeNo/');
        const data = response.data;
        if (data.message === "success") {
          setIncomeNo(data.income_no); // Set the fetched income_no
        }
      } catch (error) {
        console.error("Error fetching income number:", error);
      }
    };
    fetchIncomeNo();
  }, []);

  // Set the current date in the 'yyyy-mm-dd' format when the component mounts
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Get month (0-based)
    const day = String(today.getDate()).padStart(2, "0"); // Ensure two digits

    // Format the date to 'yyyy-mm-dd'
    const formattedDate = `${year}-${month}-${day}`;
    setCurrentDate(formattedDate); // Set the current date
  }, []);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const orgId = localStorage.getItem("orgId");
        const branchId = localStorage.getItem("branchId");
        const response = await api.get('PaymentMethod/GetAllPaymentMethodList/', {
          params: {
            organization_id: orgId,
            branch_id: branchId
          }
        });
        const data = response.data;
        if (data && data.data) {
          // Transform data to match React Select format
          const formattedOptions = data.data.map((method) => ({
            value: method.id,
            label: method.paymentmethod || method.payment_method,
          }));
          setPaymentOptions(formattedOptions);
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handlePaymentChange = (selectedOption) => {
    setSelectedPayment(selectedOption);
    // Clear bank and account when payment method changes away from BANK
    if (selectedOption?.label?.toUpperCase() !== "BANK") {
      setSelectedBank(null);
      setSelectedAccount(null);
    }
  };

  // Handle Bank Selection
  const handleBankChange = (selectedBankOption) => {
    setSelectedBank(selectedBankOption);
    setSelectedAccount(null); // Clear selected account when bank changes
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleSelectedParty = (selectedParty) => {
    console.log("Selected Party:", selectedParty);

    setPartyDetails({
      party_id: selectedParty.party_id || "",
      party_name: selectedParty.party_name || "",
      party_type: selectedParty.party_type || "",
      gst_no: selectedParty.gst_no || "",
      city: selectedParty.city || "",
      state: selectedParty.state || "",
      address: selectedParty.address || "",
      phone: selectedParty.phone || "",
      email_id: selectedParty.email_id || "",
    });

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Handle input change for each field in the table
  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  // Handle removing a row
  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  // Handle adding a new row
  const handleAddRow = () => {
    setRows([
      ...rows,
      { id: Date.now(), category: "", amount: "", remarks: "" },
    ]);
  };


  const handleSave = async () => {
    // Retrieve org_id, branch_id, and academic_year_id from local storage
    const orgId = localStorage.getItem("orgId");
    const branchId = localStorage.getItem("branchId");
    const academicSessionId = localStorage.getItem("academicSessionId");

    // Retrieve userId from session storage
    const userId = sessionStorage.getItem("userId");

    // Check if required values exist in localStorage and sessionStorage
    if (!orgId || !branchId || !academicSessionId || !userId) {
      alert("Missing required data. Please check.");
      return;
    }

    const incomeHeaderDetails = {
      created_by: userId,
      org_id: orgId,
      batch_id: branchId,
      academic_year_id: academicSessionId,
      payment_method: selectedPayment?.label || "",
      bank: selectedBank?.value || null,
      account: selectedAccount?.value || null,
      party_id: partyDetails.party_id || null,
      date: currentDate,
      income_no: incomeNo,
      party_reference: partyReference,
      total_amount: totalAmount,
    };

    // Filter and map rows to income details, ensuring category_id is a valid integer
    const incomeDetails = rows
      .filter((row) => {
        // Only include rows with valid category and amount
        const categoryId = row.category?.value || row.category;
        return categoryId && row.amount;
      })
      .map((row) => {
        // Extract category_id - handle both object and direct value
        const categoryId = row.category?.value || row.category;
        const parsedCategoryId = parseInt(categoryId, 10);
        
        // Validate that category_id is a valid integer
        if (isNaN(parsedCategoryId) || parsedCategoryId <= 0) {
          console.error("Invalid category_id:", categoryId);
          return null;
        }
        
        return {
          category_id: parsedCategoryId, // Ensure it's an integer
          amount: parseFloat(row.amount) || 0,
          remarks: row.remarks || "",
        };
      })
      .filter((detail) => detail !== null); // Remove any invalid entries

    // Validate that we have at least one income detail
    if (incomeDetails.length === 0) {
      alert("Please add at least one income detail with a valid category and amount.");
      return;
    }

    const payload = {
      IncomeHeaderDetails: incomeHeaderDetails,
      IncomeDetails: incomeDetails,
    };

    try {
      //  Check if it's an update request
      if (location.state?.incomeData?.income_id) {
        const incomeId = location.state.incomeData.income_id;
        await api.put(`EXPENSE/INCOME/IncomeUpdate/${incomeId}`, payload);
      } else {
        await api.post('EXPENSE/INCOME/IncomeCreate/', payload);
      }

      alert(
        location.state?.incomeData?.income_id
          ? "Income details updated successfully!"
          : "Income details saved successfully!"
      );

      // Clear all fields after successful save/update
      handleClear();
    } catch (error) {
      console.error("Error saving/updating income details:", error);
      const errorMessage = error.response?.data?.message || "Failed to save/update income details.";
      alert(errorMessage);
    }
  };

  const totalAmount = rows.reduce(
    (sum, row) => sum + parseFloat(row.amount || 0),
    0
  );

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
                ADD INCOME
              </p>

              <div className="row mb-3 mt-3 mx-0">
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
                    onClick={() => navigate("/admin/Search-income")}
                  >
                    Close
                  </button>
                </div>
              </div>

    
              <div className="row  mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="payment-method" className="form-label">
                          Payment Method
                        </label>
                        <Select
                          id="payment-method"
                          className="detail"
                          classNamePrefix="payment-select"
                          options={paymentOptions}
                          value={selectedPayment}
                          onChange={handlePaymentChange}
                          placeholder="Select payment method"
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="bank" className="form-label">
                          Bank
                        </label>
                        <Select
                          id="bank"
                          className="detail"
                          classNamePrefix="bank-select"
                          options={bankOptions}
                          value={selectedBank}
                          onChange={handleBankChange}
                          placeholder={
                            !selectedPayment
                              ? "Select payment method first"
                              : selectedPayment?.label?.toUpperCase() !== "BANK"
                              ? "Select BANK payment method"
                              : loadingBanks
                              ? "Loading banks..."
                              : bankOptions.length === 0
                              ? "No banks available"
                              : "Select bank"
                          }
                          isDisabled={!selectedPayment || selectedPayment?.label?.toUpperCase() !== "BANK" || loadingBanks} // Enable only if "BANK" is selected (case-insensitive)
                          noOptionsMessage={() => "No banks available"}
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="account-no" className="form-label">
                          Account No
                        </label>
                        <Select
                          id="account-no"
                          className="detail"
                          classNamePrefix="account-select"
                          options={accountOptions}
                          value={selectedAccount}
                          onChange={setSelectedAccount}
                          placeholder={
                            loadingAccounts
                              ? "Loading..."
                              : errorAccounts
                              ? errorAccounts
                              : !selectedBank
                              ? "Select bank first"
                              : "Select Account No"
                          }
                          isDisabled={!selectedBank || loadingAccounts}
                          noOptionsMessage={() => errorAccounts || "No accounts available"}
                        />
                        {errorAccounts && (
                          <small className="text-danger">{errorAccounts}</small>
                        )}
                      </div>
                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="select-party" className="form-label">
                          Select Party
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="select-party"
                            className="form-control detail"
                            placeholder="Enter select-party"
                            value={partyDetails.party_name}
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
                          value={currentDate}
                          onChange={(e) => setCurrentDate(e.target.value)}
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-0">
                        <label htmlFor="income-no" className="form-label">
                          Income No.
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="income-no"
                            className="form-control detail"
                            placeholder="Income no"
                            value={incomeNo} // Set the value from the fetched income_no
                            disabled // Disable the field so the user cannot edit it
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="total-amount" className="form-label">
                          Total Amount
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="total-amount"
                            className="form-control detail"
                            value={totalAmount.toFixed(2)} // Display the sum with 2 decimal places
                            disabled // Disable the input field
                            readOnly // Make the field read-only
                            placeholder="Total amount"
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="party-reference" className="form-label">
                          Party Reference{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="party-reference"
                            className="form-control detail"
                            placeholder="Enter party reference"
                            value={partyReference} // Bind value to state
                            onChange={(e) => setPartyReference(e.target.value)} // Update state on change
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Income Detail Table */}
              <h3 style={{ color: "black" }}>Income Detail</h3>
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table">
                    <thead className="thead-dark">
                      <tr>
                        <th>Sr.No</th>
                        <th>
                          Income Category
                          <span style={{ color: "red" }}>*</span>
                        </th>
                        <th>
                          Amount
                          <span style={{ color: "red" }}>*</span>
                        </th>
                        <th>Remarks</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={row.id}>
                          <td>{index + 1}</td>
                          <td>
    

                            <select
                              className="form-select detail"
                              value={row.category?.value || row.category || ""}
                              onChange={(e) => {
                                const selectedValue = e.target.value;
                                if (!selectedValue) {
                                  // Clear category if empty selection
                                  handleInputChange(index, "category", null);
                                  return;
                                }
                                const selected = categoryOptions.find(
                                  (option) => String(option.value) === String(selectedValue)
                                );
                                if (selected) {
                                  handleInputChange(index, "category", selected);
                                } else {
                                  console.error("Category not found for value:", selectedValue);
                                }
                              }}
                            >
                              <option value="">Select Category</option>
                              {categoryOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              className="form-control detail no-arrows"
                              // className="form-control detail"
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
                              className="form-control detail no-arrows"
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
                  </table>
                </div>
              </div>
              <Button
                variant="primary"
                onClick={handleAddRow}
                className="ms-auto d-block"
              >
                Add New Row
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmAttendanceEntry;