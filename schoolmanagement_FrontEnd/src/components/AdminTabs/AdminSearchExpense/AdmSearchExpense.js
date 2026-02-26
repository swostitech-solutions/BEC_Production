
import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Table } from "react-bootstrap";
import SelectSearchParty from "../AdminSearchExpense/SelectSearchParty";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import api from "../../../utils/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Select from "react-select";
import ReactPaginate from "react-paginate";


const AdmAttendanceEntry = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dateRef = useRef(null);
  const fromClassRef = useRef(null);
  const toClassRef = useRef(null);
  const admissionNoRef = useRef(null);
  const [partyId, setPartyId] = useState("");
  const [partyName, setPartyName] = useState("");
  const [partyType, setPartyType] = useState("");

  const orgId = localStorage.getItem("orgId");
  const academicSessionId = localStorage.getItem("academicSessionId");

  const [expenseCategory, setExpenseCategory] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  // const [expenseCategory, setExpenseCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const handleClear = () => {
    if (dateRef.current) dateRef.current.value = "";
    if (fromClassRef.current) fromClassRef.current.value = "";
    if (toClassRef.current) toClassRef.current.value = "";
    if (admissionNoRef.current) admissionNoRef.current.value = "";
    setPartyName("");
    setExpenseData([]);
    setCurrentPage(0);
  };

  // Pagination handler
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // Calculate paginated data
  const offset = currentPage * itemsPerPage;
  const currentExpenseData = expenseData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(expenseData.length / itemsPerPage);
  const handleClose = () => {
    navigate("/admin/dashboard");
  };
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleNewClick = () => {
    navigate("/addexpense");
  };
  const handleSelectedParty = (selectedParty) => {
    console.log("Selected Party:", selectedParty);
    setPartyId(selectedParty.party_id || "");
    setPartyName(selectedParty.party_name || "");
    setPartyType(selectedParty.party_type || "");
    handleCloseModal();
  };
  // Fetch expense categories
  useEffect(() => {
    const fetchExpenseCategory = async () => {
      try {
        const response = await api.get('EXPENSE/EXPENSE_INCOME/ListBasedOnCategory/', {
          params: {
            organization_id: orgId,
            batch_id: academicSessionId,
            flag: 'E'
          }
        });
        const data = response.data;
        console.log("Expense Categories Response:", data);
        if (data.message === "success" && Array.isArray(data.data)) {
          console.log("Expense Categories:", data.data);
          setExpenseCategory(data.data);
        }
      } catch (error) {
        console.error("Error fetching expense categories:", error);
      }
    };
    fetchExpenseCategory();
  }, []);
  // Handle Search Button Click
  const handleSearch = async () => {
    const fromDate = dateRef.current?.value;
    const toDate = toClassRef.current?.value;
    const expenseCategoryValue = fromClassRef.current?.value;
    const reference = admissionNoRef.current?.value;

    try {
      const params = {
        organization_id: orgId,
        batch_id: academicSessionId,
        from_date: fromDate || '',
        to_date: toDate || '',
        expense_category: expenseCategoryValue || '',
        reference: reference || '',
      };

      if (partyId) params.party_id = partyId;

      const response = await api.get('EXPENSE/EXPENSE_HEADER/ExpenseSearchList/', { params });
      const data = response.data;

      if (data.message === "success" && Array.isArray(data.data)) {
        setExpenseData(data.data);
      } else {
        setExpenseData([]);
      }
    } catch (error) {
      console.error("Error fetching expense data:", error);
      setExpenseData([]);
    }
  };
  const handleExcel = () => {
    // if (setExpenseData.length === 0) {
    if (!Array.isArray(expenseData) || expenseData.length === 0) {
      alert("No data to export!");
      return;
    }
    // Define the table headers
    const headers = [
      [
        "Expense No",
        "Expense Date	",
        "Party Name",
        "Reference",
        "Payment Method",
        "Total",
        "Paid",
        "Balance",
      ],
    ];
    // Map searchResults into a format suitable for Excel
    const data = expenseData.map((expense) => [
      expense.expense_no,
      expense.date,
      expense.party_name,
      expense.party_reference,
      Array.isArray(expense.payment_method)
        ? expense.payment_method.join(", ")
        : expense.payment_method,
      Number(expense.total_amount).toFixed(2),
      Number(expense.paid_amount).toFixed(2),
      Number(expense.balance_amount).toFixed(2),
    ]);
    // Calculate total amount
    // const totalAmount = expenseData
    //   .reduce((sum, expense) => sum + expense.total_amount, 0)
    //   .toFixed(2);
    const totalAmount = expenseData
      .reduce((sum, expense) => sum + Number(expense.total_amount), 0)
      .toFixed(2);
    const paidAmount = expenseData
      .reduce((sum, expense) => sum + Number(expense.paid_amount), 0)
      .toFixed(2);
    const balAmount = expenseData
      .reduce((sum, expense) => sum + Number(expense.balance_amount), 0)
      .toFixed(2);

    // Add total row
    // data.push(["", "", "", "", "", "", "Total:", totalAmount]);
    data.push(["", "", "", "", "", "", "Total:", totalAmount]);
    data.push(["", "", "", "", "", "", "Paid:", paidAmount]);
    data.push(["", "", "", "", "", "", "Balance:", balAmount]);
    // Create a worksheet
    const ws = XLSX.utils.aoa_to_sheet([...headers, ...data]);
    // Create a workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Income Data");
    // Export the Excel file
    XLSX.writeFile(wb, "Expense_Data.xlsx");
  };
  const handlePDF = () => {
    if (!Array.isArray(expenseData) || expenseData.length === 0) {
      alert("No data to export!");
      return;
    }
    const doc = new jsPDF();
    const logoPath = "/Assets/sparsh.jpeg";
    doc.setFontSize(16);
    doc.text("Sparsh College of Nursing and Allied Sciences", 80, 20);
    const img = new Image();
    img.src = logoPath;
    img.onload = () => {
      doc.addImage(img, "JPEG", 15, 10, 30, 20);
      const headers = [
        [
          "Expense No",
          "Expense Date",
          "Party Name",
          "Reference",
          "Payment Method",
          "Total",
          "Paid",
          "Balance",
        ],
      ];
      const data = expenseData.map((expense) => [
        expense.expense_no,
        expense.date,
        expense.party_name,
        expense.party_reference,
        Array.isArray(expense.payment_method)
          ? expense.payment_method.join(", ")
          : expense.payment_method,
        Number(expense.total_amount).toFixed(2),
        Number(expense.paid_amount).toFixed(2),
        Number(expense.balance_amount).toFixed(2),
      ]);
      const totalAmount = expenseData
        .reduce((sum, expense) => sum + Number(expense.total_amount), 0)
        .toFixed(2);
      const paidAmount = expenseData
        .reduce((sum, expense) => sum + Number(expense.paid_amount), 0)
        .toFixed(2);
      const balAmount = expenseData
        .reduce((sum, expense) => sum + Number(expense.balance_amount), 0)
        .toFixed(2);

      data.push(["", "", "", "", "", "", "Total:", totalAmount]);
      data.push(["", "", "", "", "", "", "Paid:", paidAmount]);
      data.push(["", "", "", "", "", "", "Balance:", balAmount]);

      doc.autoTable({
        startY: 40,
        head: headers,
        body: data,
        theme: "grid",
      });

      doc.save("Expense_Data.pdf");
    };
  };
  const handleEdit = async (expense_header_id) => {
    try {
      const response = await api.get(`EXPENSE/EXPENSE_HEADER/ExpanseDetailsRetrieve/${expense_header_id}`);
      const result = response.data;

      if (result.message === "success") {
        console.log("Navigating to /admin/expense_edit (edit mode) with state:", result.data);

        navigate("/admin/expense_edit", {
          state: { expenseData: result.data, mode: "edit" },
        });
      } else {
        console.error("Failed to fetch Expense details: " + result.message);
      }
    } catch (error) {
      console.error("Error fetching expense details:", error);
    }
  };

  const handleView = async (expense_header_id) => {
    try {
      const response = await api.get(`EXPENSE/EXPENSE_HEADER/ExpanseDetailsRetrieve/${expense_header_id}`);
      const result = response.data;

      if (result.message === "success") {
        setSelectedExpense(result.data);
        setShowReceiptModal(true);
      } else {
        console.error("Failed to fetch Expense details: " + result.message);
      }
    } catch (error) {
      console.error("Error fetching expense details:", error);
    }
  };

  const handleCloseReceiptModal = () => {
    setShowReceiptModal(false);
    setSelectedExpense(null);
  };

  const handleDownloadReceipt = () => {
    if (!selectedExpense) return;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Expense Receipt", 105, 20, null, null, "center");

    doc.setFontSize(14);
    doc.text("Sparsh College of Nursing and Allied Sciences", 105, 30, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Expense No: ${selectedExpense.expense_no}`, 15, 45);
    doc.text(`Date: ${selectedExpense.date}`, 140, 45);
    doc.text(`Party Name: ${selectedExpense.party_name || ""}`, 15, 55);
    doc.text(`Reference: ${selectedExpense.party_reference || ""}`, 140, 55);

    const tableColumn = ["Sr.No", "Category", "Remarks", "Amount"];
    const tableRows = [];

    if (selectedExpense.ExpenseDetailsdata && Array.isArray(selectedExpense.ExpenseDetailsdata)) {
      selectedExpense.ExpenseDetailsdata.forEach((item, index) => {
        const rowData = [
          index + 1,
          item.expense_category_name || "",
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
    if (selectedExpense.PaymentDetailsData && Array.isArray(selectedExpense.PaymentDetailsData) && selectedExpense.PaymentDetailsData.length > 0) {
      doc.text("Payment Details", 15, currentY);
      const payColumn = ["Method", "Amount", "Details"];
      const payRows = selectedExpense.PaymentDetailsData.map(p => {
        let details = "-";
        if (p.payment_method === 'Bank') {
          const bankName = p.bank_name || p.bankName || "";
          const acc = p.bank_account || p.bank_accountId || "";
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

    // Totals
    doc.text(`Total Amount: ${Number(selectedExpense.total_amount).toFixed(2)}`, 140, currentY);
    doc.text(`Paid Amount: ${Number(selectedExpense.paid_amount).toFixed(2)}`, 140, currentY + 10);
    doc.text(`Balance Amount: ${Number(selectedExpense.balance_amount).toFixed(2)}`, 140, currentY + 20);

    doc.save(`Receipt_${selectedExpense.expense_no}.pdf`);
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
                SEARCH EXPENSES
              </p>
              <div className="row mb-3 mt-3">
                <div className="col-12  d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleNewClick}
                  >
                    New Expense
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={handleSearch}
                    style={{
                      width: "150px",
                    }}
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
                    onClick={handleClose}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handlePDF}
                  >
                    Export to PDF
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleExcel}
                  >
                    Export to Excel
                  </button>
                </div>
              </div>

              {/* feild data */}
              <div className="row p-2">
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
                        <label htmlFor="party-name" className="form-label">
                          Party Name
                        </label>
                        <div className="d-flex align-items-baseline">
                          <input
                            type="text"
                            id="party-name"
                            className="form-control detail"
                            placeholder="Enter party name"
                            value={partyName}
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
                      <div className="col-12 col-md-3 mb-0">
                        <label htmlFor="from-date" className="form-label">
                          From Date
                        </label>
                        <input
                          type="date"
                          id="from-date"
                          className="form-control detail"
                          ref={dateRef}
                          onKeyDown={(e) => e.preventDefault()}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-0">
                        <label htmlFor="To-date" className="form-label">
                          To Date
                        </label>
                        <input
                          type="date"
                          id="To-date"
                          className="form-control detail"
                          ref={toClassRef}
                          onKeyDown={(e) => e.preventDefault()}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label
                          htmlFor="expense-category"
                          className="form-label"
                        >
                          Expense Category
                        </label>
                        <Select
                          className=" detail"
                          id="expense-category"
                          classNamePrefix="react-select"
                          options={expenseCategory.map((category) => ({
                            value: category.expense_category,
                            label: category.expense_category,
                          }))}
                          value={
                            selectedCategory
                              ? {
                                value: selectedCategory,
                                label: selectedCategory,
                              }
                              : null
                          }
                          onChange={(selectedOption) =>
                            setSelectedCategory(
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          placeholder="Select"
                        />
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
                            ref={admissionNoRef}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table data */}
              <div className="row mt-3">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>Expense No</th>
                          <th>Expense Date</th>
                          <th>Party Name</th>
                          <th>Reference</th>
                          <th>Payment Method</th>
                          <th>Total</th>
                          <th>Paid</th>
                          <th>Balance</th>
                          <th>View</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentExpenseData.length > 0 ? (
                          currentExpenseData.map((expense) => (
                            <tr key={expense.expense_header_id}>
                              <td>{expense.expense_no}</td>
                              <td>{expense.date}</td>
                              <td>{expense.party_name}</td>
                              <td>{expense.party_reference}</td>
                              <td>
                                {Array.isArray(expense.payment_method)
                                  ? expense.payment_method.join(", ")
                                  : expense.payment_method}
                              </td>
                              {/* <td>{expense.payment_method}</td> */}
                              <td>{expense.total_amount}</td>
                              <td>{expense.paid_amount}</td>
                              <td>{expense.balance_amount}</td>
                              {/* <td>
                                  <button className="btn btn-info btn-sm">View</button>
                                </td>
                                <td>
                                  <button className="btn btn-warning btn-sm">Edit</button>
                                </td> */}
                              <td>
                                <a
                                  href="#"
                                  className="text-info"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleView(expense.expense_header_id);
                                  }}
                                >
                                  View
                                </a>
                              </td>
                              <td>
                                <a
                                  href="#"
                                  className="text-warning"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleEdit(expense.expense_header_id);
                                  }}
                                >
                                  Edit
                                </a>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="10" className="text-center">
                              No records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination */}
                  {pageCount > 1 && (
                    <ReactPaginate
                      previousLabel={"Previous"}
                      nextLabel={"Next"}
                      breakLabel={"..."}
                      breakClassName={"page-item"}
                      breakLinkClassName={"page-link"}
                      pageCount={pageCount}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageClick}
                      containerClassName={"pagination justify-content-center"}
                      pageClassName={"page-item"}
                      pageLinkClassName={"page-link"}
                      previousClassName={"page-item"}
                      previousLinkClassName={"page-link"}
                      nextClassName={"page-item"}
                      nextLinkClassName={"page-link"}
                      activeClassName={"active"}
                    />
                  )}
                </div>
              </div>

              {/* Summary Row */}
              <div className="row mt-3">
                <div className="col-12">
                  <div className="d-flex justify-content-end">
                    <div className="me-4">
                      <h6>
                        Total:{" "}
                        {expenseData
                          .reduce(
                            (sum, exp) => sum + Number(exp.total_amount || 0),
                            0
                          )
                          .toFixed(2)}
                      </h6>
                    </div>
                    <div className="me-4">
                      <h6>
                        Paid:{" "}
                        {expenseData
                          .reduce(
                            (sum, exp) => sum + Number(exp.paid_amount || 0),
                            0
                          )
                          .toFixed(2)}
                      </h6>
                    </div>
                    <div>
                      <h6>
                        Balance:{" "}
                        {expenseData
                          .reduce(
                            (sum, exp) => sum + Number(exp.balance_amount || 0),
                            0
                          )
                          .toFixed(2)}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showReceiptModal} onHide={handleCloseReceiptModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Expense Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedExpense && (
            <div>
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <strong>Party Name:</strong> {selectedExpense.party_name} <br />
                  <strong>Reference:</strong> {selectedExpense.party_reference}
                </div>
                <div>
                  <strong>Expense No:</strong> {selectedExpense.expense_no} <br />
                  <strong>Date:</strong> {selectedExpense.date}
                </div>
              </div>

              <h6 className="mt-3">Expense Details</h6>
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
                  {selectedExpense.ExpenseDetailsdata && selectedExpense.ExpenseDetailsdata.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.expense_category_name}</td>
                      <td>{item.remarks}</td>
                      <td>{Number(item.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Payment Details Section in Modal */}
              {selectedExpense.PaymentDetailsData && selectedExpense.PaymentDetailsData.length > 0 && (
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
                      {selectedExpense.PaymentDetailsData.map((p, index) => {
                        let details = "-";
                        if (p.payment_method === 'Bank') {
                          const bankName = p.bank_name || p.bankName || "";
                          const acc = p.bank_account || p.bank_accountId || "";
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
              )}

              <div className="d-flex justify-content-end mt-3">
                <div style={{ textAlign: 'right' }}>
                  <p><strong>Total Amount:</strong> {Number(selectedExpense.total_amount).toFixed(2)}</p>
                  <p><strong>Paid Amount:</strong> {Number(selectedExpense.paid_amount).toFixed(2)}</p>
                  <p><strong>Balance Amount:</strong> {Number(selectedExpense.balance_amount).toFixed(2)}</p>
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
    </div>
  );
};

export default AdmAttendanceEntry;
