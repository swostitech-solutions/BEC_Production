import React, { useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Table, Row, Col } from "react-bootstrap";
import { ApiUrl } from "../../../ApiUrl";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const AdmAttendanceEntry = () => {
  const navigate = useNavigate();
  const [expenseDetails, setExpenseDetails] = useState([]);
  const [incomeDetails, setIncomeDetails] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  const handleClear = () => {
    if (fromDateRef.current) fromDateRef.current.value = "";
    if (toDateRef.current) toDateRef.current.value = "";
    setExpenseDetails([]);
    setIncomeDetails([]);
    setTotalExpense(0);
    setTotalIncome(0);
  };
  const handleClose = () => {
    navigate("/admin/dashboard");
  };
 const fetchProfitLossData = async () => {
   const fromDate = fromDateRef.current?.value;
   const toDate = toDateRef.current?.value;

   if (!fromDate || !toDate) {
     alert("Please select both 'From Date' and 'To Date'.");
     return;
   }

   // Validate that from date is not after to date
   if (new Date(fromDate) > new Date(toDate)) {
     alert("'From Date' cannot be after 'To Date'. Please select valid dates.");
     return;
   }

   // Get organization_id and batch_id from sessionStorage
   const organization_id = sessionStorage.getItem("organization_id");
   const batch_id = sessionStorage.getItem("batch_id") || sessionStorage.getItem("branch_id");

   if (!organization_id || !batch_id) {
     alert("Missing organization or batch information. Please ensure you are properly logged in.");
     return;
   }

   // Build API URL with parameters matching the serializer
   const apiUrl = `${ApiUrl.apiurl}EXPENSE/PROFIT_LOSS/profitlossGetList/?organization_id=${organization_id}&batch_id=${batch_id}&from_date=${fromDate}&date=${toDate}`;

   try {
     const response = await fetch(apiUrl);
     const data = await response.json();

     if (data.message === "success") {
       setExpenseDetails(data.data.ExpenseDetails);
       setIncomeDetails(data.data.IncomeDetails);

       const totalExp = data.data.ExpenseDetails.reduce(
         (sum, item) => sum + item.total_amount,
         0
       );
       const totalInc = data.data.IncomeDetails.reduce(
         (sum, item) => sum + item.total_amount,
         0
       );

       setTotalExpense(totalExp);
       setTotalIncome(totalInc);
     } else {
       alert("Error fetching data.");
     }
   } catch (error) {
     console.error("Error fetching profit & loss data:", error);
   }
 };
  const reportRef = useRef();
  const generatePDF = () => {
    if (incomeDetails.length === 0 && expenseDetails.length === 0) {
      alert("No table data found!");
      return;
    }
    const input = reportRef.current;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      // Add logo
      const logo = new Image();
      logo.src = "/Assets/sparsh.jpeg";
      pdf.addImage(logo, "PNG", 10, 5, 40, 20);

      // Add title
      pdf.setFontSize(16);
      pdf.text("Income & Expense Report", 70, 30);

      // Add captured HTML as image
      pdf.addImage(imgData, "PNG", 10, 40, 190, 0);

      // Save the PDF
      pdf.save("Finance Report.pdf");
    });
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
                PROFIT & LOSS
              </p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12  d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={fetchProfitLossData}
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
                    onClick={generatePDF}
                  >
                    Export to PDF
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
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-center align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="from-date" className="form-label">
                          From Date
                        </label>
                        <input
                          type="date"
                          id="from-date"
                          className="form-control detail"
                          ref={fromDateRef}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="to-date" className="form-label">
                          To Date
                        </label>
                        <input
                          type="date"
                          id="to-date"
                          className="form-control detail"
                          ref={toDateRef}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div ref={reportRef} className="p-3">
                <Row>
                  {/* Expenses Table */}
                  <Col md={6}>
                    <div className="border p-3">
                      <h4 style={{ color: "black" }}>EXPENSES</h4>
                      <div className="table-responsive">
                        <Table bordered hover>
                          <thead className="thead-dark">
                            <tr>
                              <th>PARTICULARS</th>
                              <th>AMOUNT</th>
                            </tr>
                          </thead>
                          <tbody>
                            {expenseDetails.length > 0 ? (
                              <>
                                {expenseDetails.map((item, index) => (
                                  <tr key={index}>
                                    <td>{item.expense_category}</td>
                                    <td>{item.total_amount.toFixed(2)}</td>
                                  </tr>
                                ))}
                                <tr>
                                  <td>
                                    <strong>Total</strong>
                                  </td>
                                  <td>
                                    <strong>{totalExpense.toFixed(2)}</strong>
                                  </td>
                                </tr>
                              </>
                            ) : (
                              <tr>
                                <td colSpan="2" className="text-center">
                                  No record found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="border p-3">
                      <h4 style={{ color: "black" }}>INCOME</h4>
                      <div className="table-responsive">
                        <Table bordered hover>
                          <thead className="thead-dark">
                            <tr>
                              <th>PARTICULARS</th>
                              <th>AMOUNT</th>
                            </tr>
                          </thead>
                          <tbody>
                            {incomeDetails.length > 0 ? (
                              <>
                                {incomeDetails.map((item, index) => (
                                  <tr key={index}>
                                    <td>{item.expense_category}</td>
                                    <td>{item.total_amount.toFixed(2)}</td>
                                  </tr>
                                ))}
                                <tr>
                                  <td>
                                    <strong>Total</strong>
                                  </td>
                                  <td>
                                    <strong>{totalIncome.toFixed(2)}</strong>
                                  </td>
                                </tr>
                              </>
                            ) : (
                              <tr>
                                <td colSpan="2" className="text-center">
                                  No record found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </Col>
                </Row>
                {/* Summary Section */}
                <Row className="mt-4">
                  <Col md={12} className="text-end">
                    <p>
                      <strong>Total Income:</strong> {totalIncome.toFixed(2)}
                    </p>
                    <p>
                      <strong>Total Expense:</strong> {totalExpense.toFixed(2)}
                    </p>
                    <p>
                      <strong>Net Income:</strong>{" "}
                      {(totalIncome - totalExpense).toFixed(2)}
                    </p>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmAttendanceEntry;
