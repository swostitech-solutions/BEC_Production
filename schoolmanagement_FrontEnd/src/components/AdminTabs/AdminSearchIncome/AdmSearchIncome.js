import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Table } from "react-bootstrap";
import SelectSearchParty from "../AdminSearchExpense/SelectSearchParty";
import { useNavigate } from 'react-router-dom';
import Select from "react-select";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from "../../../utils/api";
import useBanks from "../../hooks/useBanks";
import useBankAccounts from "../../hooks/useBankAccounts";



const AdmAttendanceEntry = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [selectedBank, setSelectedBank] = useState(null);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);

  // Custom hooks for fetching data
  const { banks, loading: loadingBanks, error: errorBanks } = useBanks();
  const { accounts, loading: loadingAccounts, error: errorAccounts } = useBankAccounts(selectedBank?.value);

  // Transform banks to React Select format
  const bankOptions = banks.map((bank) => ({
    value: bank.id,
    label: bank.bank_name || bank.bankname || bank.name || "Unknown Bank",
  }));

  // Transform accounts to React Select format
  const accountOptions = accounts.map((account) => ({
    value: account.id,
    label: account.bank_account ? account.bank_account.toString() : "Unknown Account",
  }));

  const [searchResults, setSearchResults] = useState([]);

  const [partyDetails, setPartyDetails] = useState({
    party_id: "",
    party_name: "",
    party_type: "",
    gst_no: "",
    city: "",
    state: "",
    address: "",
    phone: "",
    email_id: "",
  });


  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [partyReference, setPartyReference] = useState("");
  const [incomeDetails, setIncomeDetails] = useState(null);





  const dateRef = useRef(null);
  const fromClassRef = useRef(null);
  const toClassRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);


  const handleEdit = async (incomeId) => {
    try {
      const response = await api.get(`EXPENSE/INCOME/IncomeDetailsRetrieve/${incomeId}/`);
      const result = response.data;

      if (result.message === "success") {
        console.log("Fetched Income Details:", result.data); // Log API response
        navigate("/admin/edit-income", { state: { incomeData: result.data } }); // Navigate to edit page with data
      } else {
        console.error("Failed to fetch income details: " + result.message);
      }
    } catch (error) {
      console.error("Error fetching income details:", error);
    }
  };

  const handleView = async (incomeId) => {
    try {
      const response = await api.get(`EXPENSE/INCOME/IncomeDetailsRetrieve/${incomeId}/`);
      const result = response.data;

      if (result.message === "success") {
        console.log("Fetched Income Details:", result.data); // Log API response
        setSelectedIncome(result.data);
        setShowReceiptModal(true);
      } else {
        console.error("Failed to fetch income details: " + result.message);
      }
    } catch (error) {
      console.error("Error fetching income details:", error);
    }
  };

  const handleCloseReceiptModal = () => {
    setShowReceiptModal(false);
    setSelectedIncome(null);
  };

  // Helper to safely get total amount
  const getSafeTotalAmount = (income) => {
    if (income.total_amount) return income.total_amount;
    if (income.amount) return income.amount;

    // Calculate from details if root total is missing
    const details = income.IncomeDetailsdata || income.incomeDetaildata || [];
    if (Array.isArray(details) && details.length > 0) {
      return details.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    }
    return 0;
  };

  const handleDownloadReceipt = () => {
    if (!selectedIncome) return;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Income Receipt", 105, 20, null, null, "center");

    doc.setFontSize(14);
    doc.text("Sparsh College of Nursing and Allied Sciences", 105, 30, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Income No: ${selectedIncome.income_no || ""}`, 15, 45);
    doc.text(`Date: ${selectedIncome.income_date || selectedIncome.date || ""}`, 140, 45);
    doc.text(`Party Name: ${selectedIncome.party_name || selectedIncome.partyName || ""}`, 15, 55);
    doc.text(`Reference: ${selectedIncome.party_reference || ""}`, 140, 55);

    const tableColumn = ["Sr.No", "Category", "Remarks", "Amount"];
    const tableRows = [];

    const detailsData = selectedIncome.IncomeDetailsdata || selectedIncome.incomeDetaildata || [];

    if (Array.isArray(detailsData)) {
      detailsData.forEach((item, index) => {
        const rowData = [
          index + 1,
          item.income_category_name || item.expense_category_name || "",
          item.remarks || "",
          Number(item.amount || 0).toFixed(2)
        ];
        tableRows.push(rowData);
      });
    }

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 65,
      theme: 'grid',
    });

    let currentY = doc.lastAutoTable.finalY + 10;

    // Payment Details Section
    // Check if PaymentDetailsData exists, otherwise construct from root fields
    let paymentDataArray = [];
    if (selectedIncome.PaymentDetailsData && Array.isArray(selectedIncome.PaymentDetailsData) && selectedIncome.PaymentDetailsData.length > 0) {
      paymentDataArray = selectedIncome.PaymentDetailsData;
    } else if (selectedIncome.payment_method) {
      // Construct single payment entry from root fields if available
      paymentDataArray.push({
        payment_method: selectedIncome.payment_method,
        applied_amount: getSafeTotalAmount(selectedIncome), // Use safe total here too
        bank_name: selectedIncome.bank_name || "",
        bank_account: selectedIncome.bank_account || selectedIncome.account_name || ""
      });
    }

    if (paymentDataArray.length > 0) {
      doc.text("Payment Details", 15, currentY);
      const payColumn = ["Method", "Amount", "Details"];
      const payRows = paymentDataArray.map(p => {
        let details = "-";
        if (p.payment_method === 'Bank' || p.payment_method === 'BANK') {
          const bankName = p.bank_name || p.bankName || "";
          const acc = p.bank_account || p.bank_accountId || p.account_name || "";
          details = `${bankName} ${acc ? `(${acc})` : ''}`;
        }
        return [p.payment_method, Number(p.applied_amount || 0).toFixed(2), details];
      });

      doc.autoTable({
        head: [payColumn],
        body: payRows,
        startY: currentY + 5,
        theme: 'grid'
      });
      currentY = doc.lastAutoTable.finalY + 10;
    }

    // Total
    const totalAmount = getSafeTotalAmount(selectedIncome);
    doc.text(`Total Amount: ${Number(totalAmount).toFixed(2)}`, 140, currentY);
    // doc.text(`Paid Amount: ${Number(selectedIncome.paid_amount).toFixed(2)}`, 140, currentY + 10);
    // doc.text(`Balance Amount: ${Number(selectedIncome.balance_amount).toFixed(2)}`, 140, currentY + 20);

    doc.save(`Receipt_${selectedIncome.income_no || "Doc"}.pdf`);
  };

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

  // Handle Bank Selection
  const handleBankChange = (selectedBankOption) => {
    setSelectedBank(selectedBankOption);
    setSelectedAccount(null); // Clear selected account when bank changes
  };

  const handleSearch = async () => {
    // Retrieve org_id, branch_id, and academic_year_id from local storage
    const orgId = localStorage.getItem("orgId");
    const branchId = localStorage.getItem("branchId");
    const academicSessionId = localStorage.getItem("academicSessionId");

    // Validate if all required values exist
    if (!orgId || !branchId || !academicSessionId) {
      alert("Missing required data from local storage. Please check.");
      return;
    }

    // Construct query parameters dynamically based on user inputs
    const params = {
      org_id: orgId,
      batch_id: branchId,
      academic_year_id: academicSessionId,
    };

    // Append additional filters if they have values
    if (partyDetails.party_id) params.party_id = partyDetails.party_id;
    if (fromDate) params.from_date = fromDate;
    if (toDate) params.to_date = toDate;
    if (selectedPayment?.label) params.payment_method = selectedPayment.label;
    if (selectedBank?.value) params.bankId = selectedBank.value;
    if (selectedAccount?.value) params.accountId = selectedAccount.value;
    if (partyReference) params.party_reference = partyReference;

    try {
      const response = await api.get('EXPENSE/INCOME/IncomeSearchList', { params });
      const data = response.data;

      if (data.message === "success") {
        setSearchResults(data.data); // Store the filtered API response in state
      } else {
        console.error("Failed to fetch income search results:", data.message);
        setSearchResults([]); // Reset the search results on failure
      }
    } catch (error) {
      console.error("Error fetching income search results:", error);
      setSearchResults([]); // Reset the search results on error
    }
  };



  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleNewClick = () => {
    navigate("/admin/addincome");
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


  const handleExportToExcel = () => {
    if (searchResults.length === 0) {
      alert("No data to export!");
      return;
    }

    // Define the table headers
    const headers = [
      [
        "Income ID",
        "Income No",
        "Date",
        "Party Name",
        "Payment Method",
        "Bank Name",
        "Account No",
        "Amount",
      ],
    ];

    // Map searchResults into a format suitable for Excel
    const data = searchResults.map((income) => [
      income.income_id,
      income.income_no,
      income.income_date,
      income.partyName,
      income.payment_method,
      income.bankName || "N/A",
      income.account_name ? income.account_name : "N/A",
      income.amount.toFixed(2),
    ]);

    // Calculate total amount
    const totalAmount = searchResults
      .reduce((sum, income) => sum + income.amount, 0)
      .toFixed(2);

    // Add total row
    data.push(["", "", "", "", "", "", "Total:", totalAmount]);

    // Create a worksheet
    const ws = XLSX.utils.aoa_to_sheet([...headers, ...data]);

    // Create a workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Income Data");

    // Export the Excel file
    XLSX.writeFile(wb, "Income_Data.xlsx");
  };


  const handleExportToPDF = () => {
    if (searchResults.length === 0) {
      alert("No data to export!");
      return;
    }

    const doc = new jsPDF();

    // Set logo path
    const logoPath = "/SynergyLogo.gif"; // Relative path inside public folder

    // Add college name
    doc.setFontSize(16);
    doc.text("Synergy College", 80, 20); // Adjust position as needed

    // Add logo
    const img = new Image();
    img.src = logoPath;
    img.onload = () => {
      doc.addImage(img, "PNG", 15, 10, 30, 20); // X, Y, Width, Height

      // Define table headers
      const headers = [
        [
          "Income ID",
          "Income No",
          "Date",
          "Party Name",
          "Payment Method",
          "Bank Name",
          "Account No",
          "Amount",
        ],
      ];

      // Map searchResults into a format suitable for PDF
      const data = searchResults.map((income) => [
        income.income_id,
        income.income_no,
        income.income_date,
        income.partyName,
        income.payment_method,
        income.bankName || "N/A",
        income.account_name ? income.account_name : "N/A",
        income.amount.toFixed(2),
      ]);

      // Calculate total amount
      const totalAmount = searchResults
        .reduce((sum, income) => sum + income.amount, 0)
        .toFixed(2);

      // Add total row
      data.push(["", "", "", "", "", "", "Total:", totalAmount]);

      // Generate table
      doc.autoTable({
        startY: 40, // Adjust based on logo position
        head: headers,
        body: data,
        theme: "grid",
      });

      // Save the PDF
      doc.save("Income_Data.pdf");
    };
  };

  const handleClear = () => {
    setSelectedPayment(null);
    setSelectedBank(null);
    setSelectedAccount(null);
    setPartyDetails({
      party_id: "",
      party_name: "",
      party_type: "",
      gst_no: "",
      city: "",
      state: "",
      address: "",
      phone: "",
      email_id: "",
    });
    setFromDate("");
    setToDate("");
    setPartyReference("");
    setSearchResults([]); // Clear table data
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
                SEARCH INCOME
              </p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12  d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleNewClick}
                  >
                    New Income
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSearch}
                  >
                    Search
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
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleExportToPDF}
                  >
                    Export to PDF
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleExportToExcel}
                  >
                    Export to Excel
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="party-name" className="form-label">
                          Party Name
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="party-name"
                            className="form-control detail"
                            placeholder="Enter party name"
                            ref={admissionNoRef}
                            value={partyDetails.party_name}
                            disabled
                          />
                          <button
                            type="button"
                            className="btn btn-primary ms-2 mb-3 mt-0"
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
                        <label htmlFor="from-date" className="form-label">
                          From Date
                        </label>
                        <input
                          type="date"
                          id="from-date"
                          className="form-control detail"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="To-date" className="form-label">
                          To Date
                        </label>
                        <input
                          type="date"
                          id="to-date"
                          className="form-control detail"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor=" payment-method" className="form-label">
                          Payment Method
                        </label>
                        <Select
                          id="payment-method"
                          classNamePrefix="payment-select"
                          className="detail"
                          options={paymentOptions}
                          value={selectedPayment}
                          onChange={(selectedOption) => {
                            setSelectedPayment(selectedOption);
                            // Clear bank and account when payment method changes
                            if (selectedOption?.label?.toUpperCase() !== "BANK") {
                              setSelectedBank(null);
                              setSelectedAccount(null);
                            }
                          }}
                          placeholder="Select payment method"
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor=" Bank" className="form-label">
                          Bank
                        </label>
                        <Select
                          id="bank"
                          classNamePrefix="bank-select"
                          className="detail"
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
                        <label htmlFor=" account-no" className="form-label">
                          Account No
                        </label>
                        <Select
                          id="account-no"
                          classNamePrefix="account-select"
                          className="detail"
                          options={accountOptions}
                          value={selectedAccount}
                          onChange={setSelectedAccount}
                          placeholder={
                            loadingAccounts
                              ? "Loading..."
                              : errorAccounts
                                ? errorAccounts
                                : "Select Account No"
                          }
                          isDisabled={!selectedBank || loadingAccounts}
                        />
                        {errorAccounts && (
                          <small className="text-danger">{errorAccounts}</small>
                        )}
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="party-reference" className="form-label">
                          Party Reference
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="party-reference"
                            className="form-control detail"
                            placeholder="Enter party reference"
                            value={partyReference}
                            onChange={(e) => setPartyReference(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                {searchResults.length > 0 && (
                  <div className="table-responsive">
                    <table className="table">
                      <thead className="thead-dark">
                        <tr>
                          <th>Income ID</th>
                          <th>Income No</th>
                          <th>Date</th>
                          <th>Party Name</th>
                          <th>Payment Method</th>
                          <th>Bank Name</th>
                          <th>Account No</th>
                          <th>Amount</th>
                          <th>View</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResults.map((income) => (
                          <tr key={income.income_id}>
                            <td>{income.income_id}</td>
                            <td>{income.income_no}</td>
                            <td>{income.income_date}</td>
                            <td>{income.partyName}</td>
                            <td>{income.payment_method}</td>
                            <td>{income.bankName || "N/A"}</td>
                            <td>
                              {income.account_name
                                ? income.account_name
                                : "N/A"}
                            </td>
                            <td>{income.amount.toFixed(2)}</td>
                            <td>
                              <a
                                href="#"
                                className="text-primary"
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent default anchor behavior
                                  handleView(income.income_id); // Call handleEdit with income ID
                                }}
                              >
                                View
                              </a>
                            </td>
                            <td>
                              <a
                                href="#"
                                className="text-primary"
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent default anchor behavior
                                  handleEdit(income.income_id); // Call handleEdit with income ID
                                }}
                              >
                                Edit
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {/* Add Total Row */}
                      <tfoot>
                        <tr>
                          <td colSpan="7" className="text-end fw-bold">
                            Total:
                          </td>
                          <td className="fw-bold">
                            {searchResults
                              .reduce((sum, income) => sum + income.amount, 0)
                              .toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>

              {/* End of Total, Paid, Balance row */}
            </div>
          </div>
        </div>
      </div>
      <Modal show={showReceiptModal} onHide={handleCloseReceiptModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Income Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedIncome && (
            <div>
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <strong>Party Name:</strong> {selectedIncome.party_name || selectedIncome.partyName} <br />
                  <strong>Reference:</strong> {selectedIncome.party_reference}
                </div>
                <div>
                  <strong>Income No:</strong> {selectedIncome.income_no} <br />
                  <strong>Date:</strong> {selectedIncome.income_date || selectedIncome.date}
                </div>
              </div>

              <h6 className="mt-3">Income Details</h6>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Category</th>
                    <th>Remarks</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedIncome.IncomeDetailsdata || selectedIncome.incomeDetaildata || []).map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.income_category_name || item.expense_category_name}</td>
                      <td>{item.remarks}</td>
                      <td>{Number(item.amount || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Payment Details Section in Modal */}
              {(() => {
                let paymentDataArray = [];
                if (selectedIncome.PaymentDetailsData && Array.isArray(selectedIncome.PaymentDetailsData) && selectedIncome.PaymentDetailsData.length > 0) {
                  paymentDataArray = selectedIncome.PaymentDetailsData;
                } else if (selectedIncome.payment_method) {
                  paymentDataArray.push({
                    payment_method: selectedIncome.payment_method,
                    applied_amount: getSafeTotalAmount(selectedIncome),
                    bank_name: selectedIncome.bank_name || "",
                    bank_account: selectedIncome.bank_account || selectedIncome.account_name || ""
                  });
                }

                if (paymentDataArray.length > 0) {
                  return (
                    <>
                      <h6 className="mt-3">Payment Details</h6>
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>Method</th>
                            <th>Amount</th>
                            <th>Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentDataArray.map((p, index) => {
                            let details = "-";
                            if (p.payment_method === 'Bank' || p.payment_method === 'BANK') {
                              const bankName = p.bank_name || p.bankName || "";
                              const acc = p.bank_account || p.bank_accountId || p.account_name || "";
                              details = `${bankName} ${acc ? `(${acc})` : ''}`;
                            }
                            return (
                              <tr key={index}>
                                <td>{p.payment_method}</td>
                                <td>{Number(p.applied_amount || 0).toFixed(2)}</td>
                                <td>{details}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </>
                  );
                }
                return null;
              })()}

              <div className="d-flex justify-content-end mt-3">
                <div style={{ textAlign: 'right' }}>
                  <p><strong>Total Amount:</strong> {Number(getSafeTotalAmount(selectedIncome)).toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseReceiptModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDownloadReceipt}>
            Download Receipt
          </Button>
        </Modal.Footer>
      </Modal>
    </div >
  );
};

export default AdmAttendanceEntry;
