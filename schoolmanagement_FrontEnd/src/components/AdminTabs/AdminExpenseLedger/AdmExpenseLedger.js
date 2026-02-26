import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SelectSearchParty from "../AdminSearchExpense/SelectSearchParty";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import api from "../../../utils/api";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactPaginate from "react-paginate";

const AdmAttendanceEntry = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [partyDetails, setPartyDetails] = useState({
    party_id: "",
    party_name: "",
    party_type: "",
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [expenseData, setExpenseData] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [expenseCategories, setExpenseCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [academicYearId, setAcademicYearId] = useState("");
  const [partyId, setPartyId] = useState("");
  const [expenseCategoryId, setExpenseCategoryId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const dateRef = useRef(null);
  const fromClassRef = useRef(null);
  const toClassRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);

  // const handleClear = () => {
  //   if (dateRef.current) dateRef.current.value = "";
  //   if (fromClassRef.current) fromClassRef.current.value = "";
  //   if (toClassRef.current) toClassRef.current.value = "";
  //   if (admissionNoRef.current) admissionNoRef.current.value = "";
  //   if (barcodeRef.current) barcodeRef.current.value = "";
  //   if (smsToRef.current) smsToRef.current.checked = false;
  // };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setSelectedPaymentMethod(null);
    setPaymentMethod("");
    setSelectedCategory(null);
    setExpenseCategoryId("");
    setPartyDetails({
      party_id: "",
      party_name: "",
      party_type: "",
    });
    setPartyId("");
    setAcademicYearId("");
    setExpenseData([]);
    setCurrentPage(0);

    // If you're still using any uncontrolled inputs with refs:
    if (dateRef.current) dateRef.current.value = "";
    if (fromClassRef.current) fromClassRef.current.value = "";
    if (toClassRef.current) toClassRef.current.value = "";
    if (admissionNoRef.current) admissionNoRef.current.value = "";
    if (barcodeRef.current) barcodeRef.current.value = "";
    if (smsToRef.current) smsToRef.current.checked = false;
  };

  // Pagination handler
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
    setPartyId(selectedParty.party_id || "");

    handleCloseModal();
  };
  // const handleNewClick = () => {
  //   navigate('/addexpense');
  // };

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
          // Formatting data for React Select
          const formattedOptions = data.data.map((method) => ({
            value: method.id,
            label: method.paymentmethod || method.payment_method,
          }));
          setPaymentMethods(formattedOptions);
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    const fetchExpenseCategories = async () => {
      try {
        const orgId = localStorage.getItem("orgId");
        const academicSessionId = localStorage.getItem("academicSessionId");

        const response = await api.get('EXPENSE/EXPENSE_INCOME/ListBasedOnCategory/', {
          params: {
            organization_id: orgId,
            batch_id: academicSessionId,
            flag: 'E'
          }
        });

        const result = response.data;

        if (result.message === "success") {
          const options = result.data.map((item) => ({
            value: item.expense_category_id,
            label: item.expense_category,
          }));
          setExpenseCategories(options);
        } else {
          setExpenseCategories([]);
        }
      } catch (error) {
        console.error("Error fetching expense categories:", error);
        setExpenseCategories([]);
      }
    };

    fetchExpenseCategories();
  }, []);

  const handleSearch = async () => {
    const orgId = localStorage.getItem("orgId") || "";
    const branchId = localStorage.getItem("branchId") || "";

    if (!fromDate || !toDate) {
      alert("Please select both From Date and To Date.");
      return;
    }

    const params = {
      organization_id: orgId,
      batch_id: branchId,
      from_date: fromDate,
      to_date: toDate,
    };

    if (partyId) params.party_id = partyId;
    if (expenseCategoryId) params.Expense_category_id = expenseCategoryId;
    if (paymentMethod) params.payment_method = paymentMethod;

    try {
      const response = await api.get('EXPENSE/ExpenseLedger/ExpenseLidgerList/', { params });
      const result = response.data;

      if (result.message === "success") {
        setExpenseData(result.data);
      } else {
        alert("No data found!");
        setExpenseData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data!");
    }
  };

  // Helper function to get unique expense headers (one row per expenseHeaderId)
  const getUniqueExpenseHeaders = (data) => {
    const headerMap = new Map();

    // Group by expenseHeaderId and keep only the first occurrence of each header
    data.forEach((item) => {
      const headerId = item.expenseHeaderId;
      if (headerId && !headerMap.has(headerId)) {
        headerMap.set(headerId, item);
      }
    });

    // Return array of unique expense headers
    return Array.from(headerMap.values());
  };

  // Helper function to calculate total amount by unique expense header
  const calculateUniqueTotalAmount = (data) => {
    const uniqueHeaders = getUniqueExpenseHeaders(data);
    return uniqueHeaders.reduce((sum, item) => sum + item.total_amount, 0);
  };

  const exportToPDF = () => {
    if (!expenseData || expenseData.length === 0) {
      alert("No data available to export!");
      return;
    }

    const doc = new jsPDF();

    // Table Column Headers
    const columns = [
      "Sr.",
      "Date",
      "Payment Method",
      "Remarks",
      "Dr. Amount",
      "Amount",
    ];

    // Get unique expense headers (one row per expenseHeaderId)
    const uniqueExpenseData = getUniqueExpenseHeaders(expenseData);

    // Table Data Rows - Cumulative sum of Dr. Amount
    let cumulativeAmount = 0;
    const rows = uniqueExpenseData.map((item, index) => {
      cumulativeAmount += item.total_amount;

      return [
        index + 1,
        item.date,
        item.payment_method || "N/A",
        item.remarks || "-",
        item.total_amount.toFixed(2),
        cumulativeAmount.toFixed(2),
      ];
    });

    // Add Title
    doc.text("Expense Report", 14, 15);

    // AutoTable
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 25,
    });

    // Add Totals row - sum total_amount only once per unique expenseHeaderId
    const totalDr = calculateUniqueTotalAmount(expenseData).toFixed(2);
    const totalAmount = totalDr; // Cumulative total is same as total Dr. Amount

    doc.autoTable({
      body: [
        [
          {
            content: "Total",
            colSpan: 4,
            styles: { halign: "right", fontStyle: "bold" },
          },
          { content: totalDr, styles: { fontStyle: "bold" } },
          { content: totalAmount, styles: { fontStyle: "bold" } },
        ],
      ],
      startY: doc.autoTable.previous.finalY + 5,
      theme: "plain",
    });

    // Save the PDF
    doc.save("expense_report.pdf");
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
                EXPENSE LEDGER
              </p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12  d-flex flex-wrap gap-2">
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
                    onClick={handleClear}
                    style={{
                      width: "150px",
                    }}
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={exportToPDF}
                  >
                    Export to PDF
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
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="party" className="form-label">
                          Party
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="party"
                            className="form-control detail"
                            placeholder="Enter party "
                            ref={admissionNoRef}
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

                      <div className="col-12 col-md-3 mb-2">
                        <label
                          htmlFor="expense-category"
                          className="form-label"
                        >
                          Expense Category
                        </label>
                        <Select
                          id="expense-category"
                          className="detail"
                          options={expenseCategories}
                          value={selectedCategory}
                          onChange={(selectedOption) => {
                            setSelectedCategory(selectedOption);
                            setExpenseCategoryId(
                              selectedOption ? selectedOption.value : ""
                            ); // 🔹 Update expenseCategoryId
                          }}
                          isSearchable={false}
                          placeholder="Select expense category"
                          classNamePrefix="expense-category-select"
                        />
                      </div>

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
                          id="To-date"
                          className="form-control detail"
                          ref={dateRef}
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="payment-method" className="form-label">
                          Payment Method
                        </label>
                        <Select
                          id="payment-method"
                          options={paymentMethods}
                          className="detail"
                          value={selectedPaymentMethod}
                          onChange={(selectedOption) => {
                            setSelectedPaymentMethod(selectedOption);
                            setPaymentMethod(
                              selectedOption ? selectedOption.value : ""
                            ); // 🔹 Update paymentMethod
                          }}
                          classNamePrefix="payment-method-select"
                          placeholder="Select payment method"
                          isSearchable={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table  table-bordered">
                    <thead>
                      <tr>
                        <th>Sr.</th>
                        <th>Date</th>
                        <th>Payment Method</th>
                        <th>Remarks</th>
                        <th>Dr. Amount</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenseData.length > 0 ? (
                        (() => {
                          // Get unique expense headers (one row per expenseHeaderId)
                          const uniqueExpenseData = getUniqueExpenseHeaders(expenseData);

                          // Apply pagination on unique data
                          const offset = currentPage * itemsPerPage;
                          const paginatedData = uniqueExpenseData.slice(offset, offset + itemsPerPage);

                          // Calculate cumulative from the beginning up to current page
                          let cumulativeAmount = uniqueExpenseData
                            .slice(0, offset)
                            .reduce((sum, item) => sum + item.total_amount, 0);

                          return paginatedData.map((item, index) => {
                            cumulativeAmount += item.total_amount;

                            return (
                              <tr key={item.expenseHeaderId || item.id}>
                                <td>{offset + index + 1}</td>
                                <td>{item.date}</td>
                                <td>{item.payment_method || "N/A"}</td>
                                <td>{item.remarks || "-"}</td>
                                <td>{item.total_amount.toFixed(2)}</td>
                                <td>{cumulativeAmount.toFixed(2)}</td>
                              </tr>
                            );
                          });
                        })()
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No records found
                          </td>
                        </tr>
                      )}
                    </tbody>

                    {/* Footer Row for Totals */}
                    {expenseData.length > 0 && (
                      <tfoot>
                        <tr>
                          <td colSpan="5" className="text-end fw-bold">
                            Total:
                          </td>
                          <td className="fw-bold">
                            {calculateUniqueTotalAmount(expenseData).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
                {/* Pagination */}
                {(() => {
                  const uniqueExpenseData = getUniqueExpenseHeaders(expenseData);
                  const pageCount = Math.ceil(uniqueExpenseData.length / itemsPerPage);
                  return pageCount > 1 ? (
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
                  ) : null;
                })()}
              </div>

              {/* <div className="row mt-3">
                <div className="col-12">
                  <div className="d-flex justify-content-end">
                    <div className="me-4">
                      <h6>Total: 100000000.00</h6>
                    </div>
                    <div className="me-4">
                      <h6>Paid: 100000.00</h6>
                    </div>
                    <div>
                      <h6>Balance:1000000.00</h6>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmAttendanceEntry;
