
import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SelectSearchParty from "../AdminSearchExpense/SelectSearchParty";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import api from "../../../utils/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Select from "react-select";


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

  const handleClear = () => {
    if (dateRef.current) dateRef.current.value = "";
    if (fromClassRef.current) fromClassRef.current.value = "";
    if (toClassRef.current) toClassRef.current.value = "";
    if (admissionNoRef.current) admissionNoRef.current.value = "";
    setPartyName("");
    setExpenseData([]);
  };
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
    const logoPath = "/Assets/bec.jpeg";
    doc.setFontSize(16);
    doc.text("Bhubaneswar Engineering College", 80, 20);
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
        console.log("Navigating to /admin/expense_edit (view mode) with state:", result.data);

        navigate("/admin/expense_edit", {
          state: { expenseData: result.data, mode: "view" },
        });
      } else {
        console.error("Failed to fetch Expense details: " + result.message);
      }
    } catch (error) {
      console.error("Error fetching expense details:", error);
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
                        {expenseData.length > 0 ? (
                          expenseData.map((expense) => (
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
                            <td colSpan="9" className="text-center">
                              No records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
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
    </div>
  );
};

export default AdmAttendanceEntry;
