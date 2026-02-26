
import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import SelectSearchParty from "../AdminSearchExpense/SelectSearchParty";
import Select from "react-select";
import { Table, Form, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
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
  const { banks, loading: loadingBanks } = useBanks();
  const { accounts, loading: loadingAccounts } = useBankAccounts(selectedBank?.value);

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
  const fromClassRef = useRef(null);
  const toClassRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);

  const handleClear = () => {
    setSelectedPayment(null);
    setSelectedBank(null);
    setSelectedAccount(null);
    setPartyReference(null);
    setPartyDetails({
      party_id: "",
      party_name: "",
      party_type: "",
    });
    setRows([{ id: Date.now(), category: "", amount: "", remarks: "" }]);

    // Reset Party Reference

    // Do NOT clear incomeNo and currentDate
  };

  useEffect(() => {
    if (location.state?.incomeData) {
      const incomeData = location.state.incomeData;

      // ✅ Set selected payment method
      setSelectedPayment(
        paymentOptions.find(
          (option) => option.label === incomeData.payment_method
        ) || null
      );

      // ✅ Set selected bank
      setSelectedBank(
        bankOptions.find((option) => option.value === incomeData.bank_id) ||
        null
      );

      // ✅ Set selected account
      setSelectedAccount(
        accountOptions.find(
          (option) => option.value === incomeData.account_id
        ) || null
      );

      // ✅ Set party details
      setPartyDetails({
        party_id: incomeData.party_id || "",
        party_name: incomeData.party_name || "",
        party_type: incomeData.party_type || "",
      });

      // ✅ Set other fields
      setCurrentDate(incomeData.income_date || "");
      setIncomeNo(incomeData.income_no || "");
      setPartyReference(incomeData.party_reference || "");

      // ✅ Map income details
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
    accountOptions,
    categoryOptions,
  ]);


  useEffect(() => {
    if (location.state?.incomeDetails) {
      const incomeData = location.state.incomeDetails;

      // ✅ Set selected payment method
      setSelectedPayment(
        paymentOptions.find(
          (option) => option.label === incomeData.payment_method
        ) || null
      );

      // ✅ Set selected bank
      setSelectedBank(
        bankOptions.find((option) => option.value === incomeData.bank_id) ||
        null
      );

      // ✅ Set selected account
      setSelectedAccount(
        accountOptions.find(
          (option) => option.value === incomeData.account_id
        ) || null
      );

      // ✅ Set party details
      setPartyDetails({
        party_id: incomeData.party_id || "",
        party_name: incomeData.party_name || "",
      });

      // ✅ Set other fields
      setCurrentDate(incomeData.income_date || "");
      setIncomeNo(incomeData.income_no || "");
      setPartyReference(incomeData.party_reference || "");

      // ✅ Map income details
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
    accountOptions,
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

    // If payment method is "CASH", clear the selected bank
    if (selectedOption?.label === "CASH") {
      setSelectedBank(null);
    }
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
    navigate("/admin/search-income");
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

              <div className="row mb-2">
                <div className="col-12  d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    // onClick={handleSave}
                    disabled
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
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-12" style={{ border: "1px solid #ccc" }}>
                  <span style={{ fontWeight: 700 }}>Income Header</span>
                </div>
              </div>

              <div className="row">
                <div className="col-12" style={{ border: "1px solid #ccc" }}>
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="payment-method" className="form-label">
                          Payment Method
                        </label>
                        <Select
                          id="payment-method"
                          classNamePrefix="payment-select"
                          options={paymentOptions}
                          value={selectedPayment}
                          onChange={(selectedOption) => {
                            setSelectedPayment(selectedOption);
                            if (selectedOption?.label === "BANK") {
                              setSelectedBank(null); // Clear bank selection when switching
                            }
                          }}
                          placeholder="Select payment method"
                          isDisabled={true}
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="bank" className="form-label">
                          Bank
                        </label>
                        <Select
                          id="bank"
                          classNamePrefix="bank-select"
                          options={bankOptions}
                          value={selectedBank}
                          onChange={setSelectedBank}
                          placeholder="Select bank"
                          isDisabled={selectedPayment?.label !== "BANK"} // Enable only if "BANK" is selected
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="account-no" className="form-label">
                          Account No
                        </label>
                        <Select
                          id="account-no"
                          classNamePrefix="account-select"
                          options={accountOptions}
                          value={selectedAccount}
                          onChange={setSelectedAccount}
                          placeholder="Select Account No"
                          isDisabled={true}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-0">
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
                          disabled
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

                      <div className="col-12 col-md-3 mb-0">
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
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Income Detail Table */}
              <h3 style={{ color: "black" }}>Income Detail</h3>
              <div className="table-responsive">
                <Table bordered hover>
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
                          <Select
                            value={
                              row.category
                                ? {
                                  label: row.category.label,
                                  value: row.category.value,
                                } // Ensure proper structure for value
                                : null
                            }
                            onChange={(selectedOption) =>
                              handleInputChange(
                                index,
                                "category",
                                selectedOption
                              )
                            }
                            options={categoryOptions}
                            placeholder="Select Category"
                            isDisabled={true} // ✅ Proper way to disable React Select
                          />
                        </td>

                        <td>
                          <Form.Control
                            type="number"
                            value={row.amount}
                            onChange={(e) =>
                              handleInputChange(index, "amount", e.target.value)
                            }
                            disabled
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
                            disabled
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
