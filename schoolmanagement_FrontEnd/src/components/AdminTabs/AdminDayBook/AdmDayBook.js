// import React, { useRef, useState ,useEffect} from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Table, Row, Col } from "react-bootstrap";
// import Select from "react-select";
// import { useNavigate } from "react-router-dom";
// import { ApiUrl } from "../../../ApiUrl";


// const AdmAttendanceEntry = () => {

// const [paymentMethods, setPaymentMethods] = useState([]);
// const [selectedMethod, setSelectedMethod] = useState(null);
// const [feeReceiptsData, setFeeReceiptsData] = useState([]);
// const [expensesData, setExpensesData] = useState([]);
// const [otherIncomeData, setOtherIncomeData] = useState([]);

// const [fromDate, setFromDate] = useState("");
// const [toDate, setToDate] = useState("");
// const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
// const navigate = useNavigate();


//        useEffect(() => {
//          const fetchPaymentMethods = async () => {
//            try {
//              const response = await fetch(
//                `${ApiUrl.apiurl}PAYMENTMETHOD/GetAllpaymentmethodList/`
//              );
//              const data = await response.json();
//              if (data && data.data) {
//                // Transform data to match React Select format
//                const formattedOptions = data.data.map((method) => ({
//                  value: method.id,
//                  label: method.paymentmethod,
//                }));
//                setPaymentMethods(formattedOptions);
//              }
//            } catch (error) {
//              console.error("Error fetching payment methods:", error);
//            }
//          };

//          fetchPaymentMethods();
//        }, []);

//    const handleSearch = async () => {
//      try {
//        const orgId = localStorage.getItem("orgId") || "";
//        const branchId = localStorage.getItem("branchId") || "";
//        const paymentMethodId = selectedPaymentMethod
//          ? selectedPaymentMethod.value
//          : "";

//        if (!fromDate) {
//          alert("Please select a 'From Date'.");
//          return;
//        }

//        if (!toDate) {
//          alert("Please select a 'To Date'.");
//          return;
//        }

//        if (!paymentMethodId) {
//          alert("Please select a 'Payment Method'.");
//          return;
//        }

//        const apiUrl = `${ApiUrl.apiurl}EXPENSE/DayBook/ExpenseIncomeList/?org_id=${orgId}&branch_id=${branchId}&from_date=${fromDate}&to_date=${toDate}&payment_methodId=${paymentMethodId}`;

//        const response = await fetch(apiUrl);
//        const data = await response.json();

//        if (data && data.data) {
//          setFeeReceiptsData(data.data.FeeReceiptRecordData || []);
//          setExpensesData(data.data.ExpenseRecodData || []);
//          setOtherIncomeData(data.data.OtherIncomeRecordData || []);
//        }
//      } catch (error) {
//        console.error("Error fetching data:", error);
//      }
//    };




//       const handleReceiptLinkClick = async (receiptNo) => {
//         // Fetch academicSessionId from local storage
//         const academicSessionId = localStorage.getItem("academicSessionId");

//         if (!academicSessionId) {
//           alert("Academic session ID not found.");
//           return;
//         }

//         try {
//           // Call the API to fetch receipt details based on the receipt ID and academic session ID
//           const response = await fetch(
//             `${ApiUrl.apiurl}FEESRECIPTS/GetFeeReceiptsBasedOnReceiptNo/${receiptNo}/${academicSessionId}`
//           );

//           const result = await response.json();

//           if (response.ok) {
//             // Receipt data successfully fetched, now generate HTML for the receipt
//             const receiptHtml = `
//       <html>
//         <head>
//           <title>Receipt</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               line-height: 1.4;
//               margin: 10px;
//               display: flex;
//               justify-content: center;
//               align-items: center;
//             }
//             .receipt-container {
//               width: 60%;
//               border: 1px solid black;
//               padding: 8px;
//               box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//               font-size: 12px;
//             }
//             .header {
//               text-align: center;
//               font-weight: bold;
//               font-size: 16px;
//               margin-bottom: 8px;
//             }
//             .sub-header {
//               text-align: center;
//               font-size: 12px;
//               margin-bottom: 8px;
//             }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//               margin-top: 8px;
//               font-size: 14px;
//             }
//             table, th, td {
//               border: 1px solid black;
//             }
//             th, td {
//               text-align: left;
//               padding: 4px;
//               font-weight: bold;
//               font-size: 16px;
//             }
//             .details {
//               margin-bottom: 8px;
//             }
//             .details p {
//               margin: 2px 0;
//               font-size: 12px;
//             }
//             .summary {
//               margin-top: 8px;
//               border-top: 1px solid black;
//               padding-top: 4px;
//               font-size: 12px;
//             }
//             .right-align {
//               text-align: right;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="receipt-container">
//             <div class="header">Synergy Institute of Engineering & Technology</div>
//             <div class="sub-header">Fee Receipt</div>

//             <table border="1" style="width: 100%; border-collapse: collapse;">
//               <tbody>
//                 <tr>
//                   <td style="width: 25%; padding: 10px;"><strong>Receipt No:</strong></td>
//                   <td style="width: 25%; padding: 10px;">${
//                     result.receipt_data.receipt_no
//                   }</td>
//                   <td style="width: 25%; padding: 10px;"><strong>Section:</strong></td>
//                   <td style="width: 25%; padding: 10px;">${
//                     result.receipt_data.sectionname
//                   }</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px;"><strong>Receipt Date:</strong></td>
//                   <td style="padding: 10px;">${
//                     result.receipt_data.receipt_date
//                   }</td>
//                   <td style="padding: 10px;"><strong>Father's Name:</strong></td>
//                   <td style="padding: 10px;">${
//                     result.receipt_data.fathername
//                   }</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px;"><strong>Student Name:</strong></td>
//                   <td style="padding: 10px;">${
//                     result.receipt_data.studentname
//                   }</td>
//                   <td style="padding: 10px;"><strong>Fee Period:</strong></td>
//                   <td style="padding: 10px;">${
//                     result.receipt_data.feeperiods
//                   }</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px;"><strong>Admission No:</strong></td>
//                   <td style="padding: 10px;">${
//                     result.receipt_data.admission_no
//                   }</td>
//                   <td style="padding: 10px;"><strong>Amount:</strong></td>
//                   <td style="padding: 10px;">${result.receipt_data.amount.toFixed(
//                     2
//                   )}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px;"><strong>Class:</strong></td>
//                   <td style="padding: 10px;">${
//                     result.receipt_data.classname
//                   }</td>
//                   <td colspan="2"></td>
//                 </tr>
//               </tbody>
//             </table>

//             <table>
//               <thead>
//                 <tr>
//                   <th>Sr. No.</th>
//                   <th>Element</th>
//                   <th>Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${Object.values(result.receipt_data.payment_element_list)
//                   .map(
//                     (element, index) => `
//                       <tr>
//                         <td>${index + 1}</td>
//                         <td>${element.element_name}</td>
//                         <td class="right-align">${element.amount.toFixed(
//                           2
//                         )}</td>
//                       </tr>
//                     `
//                   )
//                   .join("")}
//                 <tr>
//                   <td></td>
//                   <td><strong>Total:</strong></td>
//                   <td class="right-align"><strong>${result.receipt_data.amount.toFixed(
//                     2
//                   )}</strong></td>
//                 </tr>
//               </tbody>
//             </table>

//             <table>
//               <thead>
//                 <tr>
//                   <th>Payment Method</th>
//                   <th>Payment Reference</th>
//                   <th>Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>${result.receipt_data.payment_method}</td>
//                   <td>${result.receipt_data.payment_reference}</td>
//                   <td class="right-align">${result.receipt_data.amount.toFixed(
//                     2
//                   )}</td>
//                 </tr>
//               </tbody>
//             </table>

//             <table>
//               <tbody>
//                 <tr>
//                   <td>Total Session Fee</td>
//                   <td class="right-align">${result.receipt_data.total_academic_year_fees.toFixed(
//                     2
//                   )}</td>
//                 </tr>
//                 <tr>
//                   <td>Total Paid</td>
//                   <td class="right-align">${result.receipt_data.total_paid.toFixed(
//                     2
//                   )}</td>
//                 </tr>
//                 <tr>
//                   <td>Total Balance</td>
//                   <td class="right-align">${result.receipt_data.remaining_amount.toFixed(
//                     2
//                   )}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </body>
//       </html>
//     `;

//             // Open the receipt in a new tab
//             const newWindow = window.open();
//             newWindow.document.write(receiptHtml);
//             newWindow.document.close();

//             // Automatically trigger download
//             const blob = new Blob([receiptHtml], { type: "text/html" });
//             const link = document.createElement("a");
//             link.href = URL.createObjectURL(blob);
//             link.download = `Receipt_${result.receipt_data.receipt_no}.html`;
//             link.click();
//           } else {
//             // Handle error in API response
//             alert(result.message || "Failed to fetch receipt details.");
//           }
//         } catch (error) {
//           console.error("Error fetching receipt details:", error);
//           alert("An error occurred. Please try again.");
//         }
//       };


//       const handleIncomeClick = async (incomeNo) => {
//         try {
//           const apiUrl = `${ApiUrl.apiurl}EXPENSE/IncomeDetails/IncomeNo/${incomeNo}/`;
//           const response = await fetch(apiUrl);
//           const data = await response.json();

//           if (data && data.data) {
//             navigate("/admin/income-detail", {
//               state: { incomeDetails: data.data },
//             });
//           } else {
//             alert("No data found for the selected income number.");
//           }
//         } catch (error) {
//           console.error("Error fetching income details:", error);
//           alert("Failed to fetch income details.");
//         }
//       };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12">
//           <div className="card p-0">
//             <div className="card-body">
//               <p
//                 style={{
//                   marginBottom: "0px",
//                   textAlign: "center",
//                   fontSize: "20px",
//                   fontWeight: "700",
//                 }}
//               >
//                 DAY BOOK
//               </p>
//               <div className="row mb-3 mt-3 mx-0">
//                 <div className="col-12">
//                   <button
//                     type="button"
//                     className="btn btn-primary me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                     onClick={handleSearch}
//                   >
//                     Search
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-secondary me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                   >
//                     Clear
//                   </button>

//                   <button
//                     type="button"
//                     className="btn btn-primary me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                   >
//                     Export to PDF
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-danger me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                   >
//                     Close
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-primary me-2"
//                     style={{
//                       width: "210px",
//                     }}
//                   >
//                     Export Multiple Day Book
//                   </button>
//                 </div>
//               </div>

//               <div className="row mt-3 mx-2 mb-3 ">
//                 <div className="col-12 custom-section-box">
//                   <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
//                     <div className="row flex-grow-1">
//                       <div className="col-12 col-md-3 mb-3">
//                         <label htmlFor="from-date" className="form-label">
//                           From Date
//                         </label>
//                         <input
//                           type="date"
//                           id="from-date"
//                           className="form-control detail"
//                           value={fromDate}
//                           onChange={(e) => setFromDate(e.target.value)}
//                         />
//                       </div>
//                       <div className="col-12 col-md-3 mb-3">
//                         <label htmlFor="To-date" className="form-label">
//                           To Date
//                         </label>
//                         <input
//                           type="date"
//                           id="to-date"
//                           className="form-control detail"
//                           value={toDate}
//                           onChange={(e) => setToDate(e.target.value)}
//                         />
//                       </div>
//                       <div className="col-12 col-md-3 mb-3">
//                         <label htmlFor="payment-method" className="form-label">
//                           Payment Method
//                         </label>
//                         <Select
//                           id="payment-method"
//                           className="detail"
//                           options={paymentMethods}
//                           value={selectedPaymentMethod}
//                           onChange={setSelectedPaymentMethod}
//                           classNamePrefix="payment-method-dropdown"
//                           placeholder="Select payment method"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <Row className="mb-4 mx-0">
//                 <Col md={6}>
//                   <div className="border p-3">
//                     <h5 style={{ color: "black" }}>FEE RECEIPTS</h5>
//                     <div
//                       className="table-responsive"
//                       style={{ maxHeight: "400px", overflowY: "auto" }}
//                     >
//                       <table className="table">
//                         <thead className="thead-dark">
//                           <tr>
//                             <th>Receipt No.</th>
//                             <th>Student Name</th>
//                             <th>School Admission No</th>
//                             <th>Class</th>
//                             <th>Section</th>
//                             <th>Receipt Amt.</th>
//                             <th>Payment</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {feeReceiptsData.map((receipt, index) => (
//                             <tr key={index}>
//                               <td>
//                                 <a
//                                   href="#"
//                                   style={{
//                                     color: "blue",
//                                     textDecoration: "underline",
//                                   }}
//                                   onClick={(e) => {
//                                     e.preventDefault(); // Prevent default anchor behavior
//                                     handleReceiptLinkClick(receipt.receipt_no);
//                                   }}
//                                 >
//                                   {receipt.receipt_no}
//                                 </a>
//                               </td>

//                               <td>{receipt.student_name}</td>
//                               <td>{receipt.school_admission_no}</td>
//                               <td>{receipt.class_name}</td>
//                               <td>{receipt.section_name}</td>
//                               <td>{receipt.payment_amount.toFixed(2)}</td>
//                               <td>{receipt.payment_amount.toFixed(2)}</td>
//                             </tr>
//                           ))}
//                           {/* Total Row */}
//                           <tr style={{ fontWeight: "bold" }}>
//                             <td colSpan="6" className="text-right">
//                               Total:
//                             </td>
//                             <td>
//                               {feeReceiptsData
//                                 .reduce(
//                                   (sum, receipt) =>
//                                     sum + receipt.payment_amount,
//                                   0
//                                 )
//                                 .toFixed(2)}
//                             </td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </Col>

//                 {/* </Row> */}

//                 {/* Expenses Section */}
//                 {/* <Row className="mb-4"> */}
//                 <Col md={6}>
//                   <div className="border p-3">
//                     <h5 style={{ color: "black" }}>EXPENSES</h5>
//                     <div
//                       className="table-responsive"
//                       style={{ maxHeight: "400px", overflowY: "auto" }}
//                     >
//                       <table className="table">
//                         <thead className="thead-dark">
//                           <tr>
//                             <th>Expense No.</th>
//                             <th>Party Name</th>
//                             <th>Party Reference</th>
//                             <th>Expense Amt.</th>
//                             <th>Payment</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {expensesData.map((expense, index) => (
//                             <tr key={index}>
//                               <td>
//                                 <a
//                                   href={`#`} // Replace `#` with the actual link if needed
//                                   style={{
//                                     color: "blue",
//                                   }}
//                                 >
//                                   {expense.expense_no}
//                                 </a>
//                               </td>
//                               <td>{expense.party_name}</td>
//                               <td>{expense.party_reference}</td>
//                               <td>{expense.payment_amount.toFixed(2)}</td>
//                               <td>{expense.payment_amount.toFixed(2)}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                         <tfoot>
//                           <tr style={{ fontWeight: "bold" }}>
//                             <td colSpan="4" className="text-right">
//                               Total:
//                             </td>
//                             <td>
//                               {expensesData
//                                 .reduce(
//                                   (sum, expense) =>
//                                     sum + expense.payment_amount,
//                                   0
//                                 )
//                                 .toFixed(2)}
//                             </td>
//                           </tr>
//                         </tfoot>
//                       </table>
//                     </div>
//                   </div>
//                 </Col>
//               </Row>

//               {/* Other Income Section */}
//               <Row className="mb-4 mx-0">
//                 <Col md={6}>
//                   <div className="border p-3">
//                     <h5 style={{ color: "black" }}>OTHER INCOME</h5>
//                     <div
//                       className="table-responsive"
//                       style={{ maxHeight: "400px", overflowY: "auto" }}
//                     >
//                       <table className="table">
//                         <thead className="thead-dark">
//                           <tr>
//                             <th>Income No.</th>
//                             <th>Party Name</th>
//                             <th>Party Reference</th>
//                             <th>Amount</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {otherIncomeData.map((income, index) => (
//                             <tr key={index}>
//                               <td>
//                                 <a
//                                   href="#"
//                                   style={{ color: "blue" }}
//                                   onClick={(e) => {
//                                     e.preventDefault();
//                                     handleIncomeClick(income.income_no);
//                                   }}
//                                 >
//                                   {income.income_no}
//                                 </a>
//                                 ;
//                               </td>
//                               <td>{income.party_name}</td>
//                               <td>{income.party_reference}</td>
//                               <td>{income.payment_amount.toFixed(2)}</td>
//                             </tr>
//                           ))}
//                           {/* Total Row */}
//                           <tr style={{ fontWeight: "bold" }}>
//                             <td colSpan="3" className="text-right">
//                               Total:
//                             </td>
//                             <td>
//                               {otherIncomeData
//                                 .reduce(
//                                   (sum, income) => sum + income.payment_amount,
//                                   0
//                                 )
//                                 .toFixed(2)}
//                             </td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </Col>

//                 {/* Calculation Section on the Right Side */}
//                 <Col md={6}>
//                   <div className="border p-3">
//                     <h5 style={{ color: "black" }}>CALCULATION</h5>
//                     <table className="table">
//                       <tbody>
//                         <tr>
//                           <td>
//                             <b>Total Inward Amount:</b>
//                           </td>
//                           <td>
//                             {(
//                               feeReceiptsData.reduce(
//                                 (sum, receipt) => sum + receipt.payment_amount,
//                                 0
//                               ) +
//                               otherIncomeData.reduce(
//                                 (sum, income) => sum + income.payment_amount,
//                                 0
//                               )
//                             ).toFixed(2)}
//                           </td>
//                         </tr>
//                         <tr>
//                           <td>
//                             <b>Total Outward Amount:</b>
//                           </td>
//                           <td>
//                             {expensesData
//                               .reduce(
//                                 (sum, expense) => sum + expense.payment_amount,
//                                 0
//                               )
//                               .toFixed(2)}
//                           </td>
//                         </tr>
//                         <tr>
//                           <td>
//                             <b>Balance:</b>
//                           </td>
//                           <td>
//                             {(
//                               feeReceiptsData.reduce(
//                                 (sum, receipt) => sum + receipt.payment_amount,
//                                 0
//                               ) +
//                               otherIncomeData.reduce(
//                                 (sum, income) => sum + income.payment_amount,
//                                 0
//                               ) -
//                               expensesData.reduce(
//                                 (sum, expense) => sum + expense.payment_amount,
//                                 0
//                               )
//                             ).toFixed(2)}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </Col>
//               </Row>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdmAttendanceEntry;



import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import api from "../../../utils/api";
import html2pdf from "html2pdf.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";




const AdmAttendanceEntry = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [feeReceiptsData, setFeeReceiptsData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [otherIncomeData, setOtherIncomeData] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingMultiple, setIsExportingMultiple] = useState(false);
  const navigate = useNavigate();
  const pdfRef = useRef();

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setSelectedPaymentMethod(null);
    setFeeReceiptsData([]);
    setExpensesData([]);
    setOtherIncomeData([]);
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
          setPaymentMethods(formattedOptions);
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleSearch = async () => {
    try {
      const orgId = sessionStorage.getItem("organization_id") || "";
      const branchId = sessionStorage.getItem("batch_id") || sessionStorage.getItem("branch_id") || "";
      const paymentMethodId = selectedPaymentMethod
        ? selectedPaymentMethod.value
        : "";

      if (!fromDate) {
        alert("Please select a 'From Date'.");
        return;
      }

      if (!toDate) {
        alert("Please select a 'To Date'.");
        return;
      }

      if (!paymentMethodId) {
        alert("Please select a 'Payment Method'.");
        return;
      }

      const response = await api.get('EXPENSE/DayBook/ExpenseIncomeList/', {
        params: {
          organization_id: orgId,
          batch_id: branchId,
          from_date: fromDate,
          to_date: toDate,
          payment_methodId: paymentMethodId
        }
      });

      const data = response.data;

      if (data && data.data) {
        console.log("Search API Response:", data.data);
        console.log("Fee Receipts Sample:", data.data.FeeReceiptRecordData?.[0]);
        setFeeReceiptsData(data.data.FeeReceiptRecordData || []);
        setExpensesData(data.data.ExpenseRecodData || []);
        setOtherIncomeData(data.data.OtherIncomeRecordData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleReceiptLinkClick = async (receiptNo) => {
    const orgId = localStorage.getItem("orgId");
    const branchId = localStorage.getItem("branchId");

    if (!orgId || !branchId) {
      alert("Organization or Branch ID not found.");
      return;
    }

    try {
      const response = await api.get(`FeeReceipt/GetFeeReceiptsBasedOnReceiptNo/`, {
        params: {
          organization_id: orgId,
          branch_id: branchId,
          receipt_no: receiptNo
        }
      });
      const result = response.data;

      if (result.receipt_data) {
        //  Directly generate PDF from result data
        await generatePDF(result.receipt_data);
      } else {
        alert(result.message || "Failed to fetch receipt details.");
      }
    } catch (error) {
      console.error("Error fetching receipt details:", error);
      alert("An error occurred. Please try again.");
    }
  };

  //  Generate PDF with updated layout
  const generatePDF = async (data) => {
    const doc = new jsPDF("portrait", "mm", "a4");

    // --- Load logo image ---
    const toBase64 = (url) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg"));
        };
        img.onerror = (err) => reject(err);
        img.src = url;
      });

    try {
      const sparshLogo = await toBase64("/Assets/sparsh.jpeg");
      doc.addImage(sparshLogo, "JPEG", 10, 10, 20, 20);
    } catch (error) {
      console.error("Error adding image:", error);
    }

    // --- Header ---
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    const headerText = "Sparsh College of Nursing and Allied Sciences";
    const textWidth =
      (doc.getStringUnitWidth(headerText) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const textX = (pageWidth - textWidth) / 2;
    doc.text(headerText, textX, 22);

    doc.setFontSize(12);
    doc.text("Fee Receipt", pageWidth / 2, 30, { align: "center" });

    // Format date from ISO to readable format
    const formatReceiptDate = (isoDate) => {
      if (!isoDate) return "";
      const date = new Date(isoDate);
      return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
    };

    // Handle student_name array
    const studentName = Array.isArray(data.student_name)
      ? data.student_name.join(" ")
      : data.student_name || "";

    // Handle fee_semesters array
    const feeSemesters = Array.isArray(data.fee_semesters)
      ? data.fee_semesters.join(", ")
      : data.fee_semesters || "";

    // --- Receipt Info Table ---
    const receiptDetails = [
      ["Receipt No", data.receipt_no || "-", "Academic Year", data.academic_year_code || "-"],
      ["Receipt Date", formatReceiptDate(data.receipt_date), "Section", data.section_name || "-"],
      ["Student Name", studentName, "Father's Name", data.father_name || "-"],
      ["Admission No", data.admission_no || "-", "Fee Period", feeSemesters],
      ["Course", data.course_name || "-", "Department", data.department_name || "-"],
      ["Semester", data.semester_name || "-", "Amount Paid", "Rs. " + Number(data.amount || 0).toFixed(2)],
    ];

    doc.autoTable({
      startY: 35,
      body: receiptDetails,
      theme: "grid",
      styles: { fontSize: 10, fontStyle: "bold" },
      margin: { left: 15 },
      tableWidth: 180,
    });

    // --- Fee Elements Table ---
    const feeElements = Object.values(data.payment_element_list || {}).map(
      (el, index) => [index + 1, el.element_name, Number(el.amount || 0).toFixed(2)]
    );
    feeElements.push(["", "Total Amount Paid", Number(data.amount || 0).toFixed(2)]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 8,
      head: [["Sr. No.", "Fee Element", "Amount (Rs.)"]],
      body: feeElements,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fontStyle: "bold", fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      columnStyles: { 2: { halign: "right" } },
      margin: { left: 15 },
      tableWidth: 180,
    });

    // --- Payment Method Table ---
    const paymentData = [
      [data.payment_method || "-", data.payment_reference || "-", Number(data.amount || 0).toFixed(2)],
    ];

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 8,
      head: [["Payment Method", "Payment Reference", "Amount (Rs.)"]],
      body: paymentData,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fontStyle: "bold", fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      columnStyles: { 2: { halign: "right" } },
      margin: { left: 15 },
      tableWidth: 180,
    });

    // --- Fee Summary Table ---
    const summaryData = [
      ["Total Academic Year Fees", Number(data.total_academic_year_fees || 0).toFixed(2)],
      ["Total Paid Till Date", Number(data.total_paid || 0).toFixed(2)],
      ["Remaining Balance", Number(data.remaining_amount || 0).toFixed(2)],
    ];

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 8,
      head: [["Fee Summary", "Amount (Rs.)"]],
      body: summaryData,
      theme: "grid",
      styles: { fontSize: 10, fontStyle: "bold" },
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      columnStyles: { 1: { halign: "right" } },
      margin: { left: 15 },
      tableWidth: 180,
    });

    // --- Footer ---
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(8);
    doc.setFont("Helvetica", "normal");
    doc.text(
      "This is a computer-generated receipt and does not require a signature.",
      pageWidth / 2,
      finalY,
      { align: "center" }
    );

    // Open in new tab
    window.open(doc.output("bloburl"), "_blank");
  };


  const handleIncomeClick = async (incomeNo) => {
    try {
      const response = await api.get(`EXPENSE/IncomeDetails/IncomeNo/${incomeNo}/`);
      const data = response.data;

      if (data && data.data) {
        navigate("/admin/income-detail", {
          state: { incomeDetails: data.data },
        });
      } else {
        alert("No data found for the selected income number.");
      }
    } catch (error) {
      console.error("Error fetching income details:", error);
      alert("Failed to fetch income details.");
    }
  };

  // const exportToPDF = () => {
  //   const mainContainer = document.getElementById("dayBookContent");

  //   if (!mainContainer) {
  //     alert("Content not found. Ensure it has id='dayBookContent'");
  //     return;
  //   }

  //   // Check if content is empty
  //   if (!mainContainer.innerText.trim()) {
  //     alert("No data available to export.");
  //     return;
  //   }

  //   const clonedContent = mainContainer.cloneNode(true);

  //   // Create hidden container for rendering
  //   const hiddenContainer = document.createElement("div");
  //   hiddenContainer.style.position = "absolute";
  //   hiddenContainer.style.left = "-9999px";
  //   hiddenContainer.style.top = "0";
  //   hiddenContainer.style.backgroundColor = "#fff";
  //   hiddenContainer.style.padding = "20px";
  //   hiddenContainer.style.width = "auto";

  //   hiddenContainer.appendChild(clonedContent);
  //   document.body.appendChild(hiddenContainer);

  //   setTimeout(() => {
  //     html2canvas(hiddenContainer, {
  //       scale: 2,
  //       useCORS: true,
  //     }).then((canvas) => {
  //       const imgData = canvas.toDataURL("image/png");

  //       const pdf = new jsPDF("p", "mm", "a4");
  //       const imgWidth = 210;
  //       const pageHeight = 297;
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //       let position = 0;
  //       let heightLeft = imgHeight;

  //       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;

  //       while (heightLeft > 0) {
  //         position = heightLeft - imgHeight;
  //         pdf.addPage();
  //         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //         heightLeft -= pageHeight;
  //       }

  //       // Open in new tab
  //       const pdfBlob = pdf.output("blob");
  //       const pdfUrl = URL.createObjectURL(pdfBlob);
  //       window.open(pdfUrl);

  //       // Clean up
  //       document.body.removeChild(hiddenContainer);
  //     });
  //   }, 100);
  // };

  const exportToPDF = async () => {
    // Validation: Check if data exists
    const hasData =
      (feeReceiptsData && feeReceiptsData.length > 0) ||
      (expensesData && expensesData.length > 0) ||
      (otherIncomeData && otherIncomeData.length > 0);

    if (!hasData) {
      alert("No data available to export. Please search for data first.");
      return;
    }

    // Validation: Check if dates are selected
    if (!fromDate || !toDate) {
      alert("Please select date range before exporting.");
      return;
    }

    if (!selectedPaymentMethod) {
      alert("Please select a payment method before exporting.");
      return;
    }

    if (isExporting) {
      return; // Prevent multiple clicks
    }

    setIsExporting(true);

    try {
      const doc = new jsPDF("portrait", "mm", "a4");
      let startY = 20;

      // Load and add logo
      try {
        const logoData = await loadLogoImage();
        doc.addImage(logoData, "JPEG", 10, 10, 20, 20);
      } catch (error) {
        console.error("Error loading logo:", error);
      }

      // Header
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(16);
      const headerText = "Sparsh College of Nursing and Allied Sciences";
      const textWidth =
        (doc.getStringUnitWidth(headerText) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const textX = (pageWidth - textWidth) / 2;
      doc.text(headerText, textX, 22);

      doc.setFontSize(12);
      doc.text("Day Book Report", pageWidth / 2, 30, { align: "center" });

      // Date range and Payment Method info
      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      doc.text(`From Date: ${fromDate}`, 15, 40);
      doc.text(`To Date: ${toDate}`, 15, 46);
      doc.text(`Payment Method: ${selectedPaymentMethod.label}`, 15, 52);

      startY = 60;

      // Fee Receipts Section
      if (feeReceiptsData && feeReceiptsData.length > 0) {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(12);
        doc.text("FEE RECEIPTS", 15, startY);
        startY += 8;

        const feeReceiptsTable = feeReceiptsData.map((receipt, index) => [
          index + 1,
          receipt.receipt_no || "-",
          receipt.student_name || "-",
          receipt.college_admission_no || receipt.school_admission_no || "-",
          receipt.course_name || receipt.class_name || "-",
          receipt.department_name || "-",
          receipt.semester_name || "-",
          parseFloat(receipt.payment_amount || 0).toFixed(2),
        ]);

        const feeTotal = feeReceiptsData.reduce(
          (sum, receipt) => sum + parseFloat(receipt.payment_amount || 0),
          0
        );

        feeReceiptsTable.push([
          "",
          "",
          "",
          "",
          "",
          "",
          "Total:",
          feeTotal.toFixed(2),
        ]);

        doc.autoTable({
          startY: startY,
          head: [["Sr.", "Receipt No.", "Student Name", "Admission No", "Course", "Department", "Semester Name", "Amount"]],
          body: feeReceiptsTable,
          theme: "grid",
          styles: { fontSize: 8 },
          headStyles: { fontSize: 8, fontStyle: "bold" },
          columnStyles: { 7: { halign: "right" } },
          margin: { left: 15, right: 15 },
        });

        startY = doc.lastAutoTable.finalY + 10;
      }

      // Expenses Section
      if (expensesData && expensesData.length > 0) {
        // Check if we need a new page
        if (startY > 250) {
          doc.addPage();
          startY = 20;
        }

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(12);
        doc.text("EXPENSES", 15, startY);
        startY += 8;

        const expensesTable = expensesData.map((expense, index) => [
          index + 1,
          expense.expense_no || "-",
          expense.party_name || "-",
          expense.party_reference || "-",
          parseFloat(expense.payment_amount || 0).toFixed(2),
        ]);

        const expenseTotal = expensesData.reduce(
          (sum, expense) => sum + parseFloat(expense.payment_amount || 0),
          0
        );

        expensesTable.push(["", "", "", "Total:", expenseTotal.toFixed(2)]);

        doc.autoTable({
          startY: startY,
          head: [["Sr.", "Expense No.", "Party Name", "Reference", "Amount"]],
          body: expensesTable,
          theme: "grid",
          styles: { fontSize: 8 },
          headStyles: { fontSize: 8, fontStyle: "bold" },
          columnStyles: { 4: { halign: "right" } },
          margin: { left: 15, right: 15 },
        });

        startY = doc.lastAutoTable.finalY + 10;
      }

      // Other Income Section
      if (otherIncomeData && otherIncomeData.length > 0) {
        // Check if we need a new page
        if (startY > 250) {
          doc.addPage();
          startY = 20;
        }

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(12);
        doc.text("OTHER INCOME", 15, startY);
        startY += 8;

        const otherIncomeTable = otherIncomeData.map((income, index) => [
          index + 1,
          income.income_no || "-",
          income.party_name || "-",
          income.party_reference || "-",
          parseFloat(income.payment_amount || 0).toFixed(2),
        ]);

        const otherIncomeTotal = otherIncomeData.reduce(
          (sum, income) => sum + parseFloat(income.payment_amount || 0),
          0
        );

        otherIncomeTable.push(["", "", "", "Total:", otherIncomeTotal.toFixed(2)]);

        doc.autoTable({
          startY: startY,
          head: [["Sr.", "Income No.", "Party Name", "Reference", "Amount"]],
          body: otherIncomeTable,
          theme: "grid",
          styles: { fontSize: 8 },
          headStyles: { fontSize: 8, fontStyle: "bold" },
          columnStyles: { 4: { halign: "right" } },
          margin: { left: 15, right: 15 },
        });

        startY = doc.lastAutoTable.finalY + 10;
      }

      // Calculation Section
      // Check if we need a new page
      if (startY > 250) {
        doc.addPage();
        startY = 20;
      }

      const totalInward =
        (feeReceiptsData.reduce(
          (sum, receipt) => sum + parseFloat(receipt.payment_amount || 0),
          0
        ) || 0) +
        (otherIncomeData.reduce(
          (sum, income) => sum + parseFloat(income.payment_amount || 0),
          0
        ) || 0);

      const totalOutward = expensesData.reduce(
        (sum, expense) => sum + parseFloat(expense.payment_amount || 0),
        0
      ) || 0;

      const balance = totalInward - totalOutward;

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.text("CALCULATION", 15, startY);
      startY += 8;

      const calculationData = [
        ["Total Inward Amount:", totalInward.toFixed(2)],
        ["Total Outward Amount:", totalOutward.toFixed(2)],
        ["Balance:", balance.toFixed(2)],
      ];

      doc.autoTable({
        startY: startY,
        body: calculationData,
        theme: "grid",
        styles: { fontSize: 10, fontStyle: "bold" },
        columnStyles: { 1: { halign: "right" } },
        margin: { left: 15, right: 15 },
      });

      // Save PDF
      const filename = `DayBook_${fromDate}_to_${toDate}.pdf`;
      doc.save(filename);

      setIsExporting(false);
    } catch (error) {
      console.error("Error in exportToPDF:", error);
      alert("An error occurred while exporting. Please try again.");
      setIsExporting(false);
    }
  };

  // Helper function to generate date range array
  const getDateRange = (startDate, endDate) => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split('T')[0]);
    }

    return dates;
  };

  // Helper function to load logo image
  const loadLogoImage = () => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = (err) => reject(err);
      img.src = "/Assets/sparsh.jpeg";
    });
  };

  // Add a day's data as a page to an existing PDF document - Modified to show only Fee Receipts
  const addDayPageToPDF = async (doc, dayData, date, paymentMethodName, isFirstPage = false) => {
    // Add new page if not the first page
    if (!isFirstPage) {
      doc.addPage();
    }

    let startY = 20;

    // Load and add logo on every page
    try {
      const logoData = await loadLogoImage();
      doc.addImage(logoData, "JPEG", 10, 10, 20, 20);
    } catch (error) {
      console.error("Error loading logo:", error);
    }

    // Header
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    const headerText = "Sparsh College of Nursing and Allied Sciences";
    const textWidth =
      (doc.getStringUnitWidth(headerText) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const textX = (pageWidth - textWidth) / 2;
    doc.text(headerText, textX, 22);

    doc.setFontSize(12);
    doc.text("Day Book Report - Fee Receipts", pageWidth / 2, 30, { align: "center" });

    // Date and Payment Method info
    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    doc.text(`Date: ${date}`, 15, 40);
    doc.text(`Payment Method: ${paymentMethodName}`, 15, 46);

    startY = 55;

    const feeReceipts = dayData.FeeReceiptRecordData || [];

    // Fee Receipts Section - Only section to show
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("FEE RECEIPTS", 15, startY);
    startY += 8;

    let feeReceiptsTable = [];
    if (feeReceipts.length > 0) {
      feeReceiptsTable = feeReceipts.map((receipt, index) => [
        index + 1,
        receipt.receipt_no || "-",
        receipt.student_name || "-",
        receipt.college_admission_no || receipt.school_admission_no || "-",
        receipt.course_name || receipt.class_name || "-",
        receipt.department_name || "-",
        receipt.semester_name || "-",
        parseFloat(receipt.payment_amount || 0).toFixed(2),
      ]);

      const feeTotal = feeReceipts.reduce(
        (sum, receipt) => sum + parseFloat(receipt.payment_amount || 0),
        0
      );

      feeReceiptsTable.push([
        "",
        "",
        "",
        "",
        "",
        "",
        "Total:",
        feeTotal.toFixed(2),
      ]);
    } else {
      feeReceiptsTable = [["", "", "No data available", "", "", "", "", ""]];
    }

    doc.autoTable({
      startY: startY,
      head: [["Sr.", "Receipt No.", "Student Name", "Admission No", "Course", "Department", "Semester Name", "Amount"]],
      body: feeReceiptsTable,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fontSize: 8, fontStyle: "bold" },
      columnStyles: { 7: { halign: "right" } },
      margin: { left: 15, right: 15 },
    });

    // Return the doc (don't save here - will be saved after all pages are added)
    return doc;
  };

  // Generate structured PDF for a single day (kept for backward compatibility if needed)
  const generateDayPDF = async (dayData, date, paymentMethodName) => {
    const doc = new jsPDF("portrait", "mm", "a4");
    await addDayPageToPDF(doc, dayData, date, paymentMethodName, true);
    const filename = `DayBook_${date}.pdf`;
    doc.save(filename);
  };

  // Export Multiple Day Book function
  const exportMultipleDayBook = async () => {
    // Validation
    if (!fromDate) {
      alert("Please select a 'From Date'.");
      return;
    }

    if (!toDate) {
      alert("Please select a 'To Date'.");
      return;
    }

    if (!selectedPaymentMethod) {
      alert("Please select a 'Payment Method'.");
      return;
    }

    if (isExportingMultiple) {
      return; // Prevent multiple clicks
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    if (startDate > endDate) {
      alert("'From Date' cannot be greater than 'To Date'.");
      return;
    }

    // Check date range size (warn if too large)
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    if (daysDiff > 30) {
      const confirmExport = window.confirm(
        `You are about to export ${daysDiff} days. This may take a while. Do you want to continue?`
      );
      if (!confirmExport) {
        return;
      }
    }

    setIsExportingMultiple(true);

    try {
      const orgId = sessionStorage.getItem("organization_id") || "";
      const branchId = sessionStorage.getItem("batch_id") || sessionStorage.getItem("branch_id") || "";
      const paymentMethodId = selectedPaymentMethod.value;
      const paymentMethodName = selectedPaymentMethod.label;

      // Make individual API calls for each date
      const dateDataMap = {};
      let currentDate = new Date(startDate);

      console.log(`Fetching data from ${fromDate} to ${toDate}`);

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

        try {
          const response = await api.get("EXPENSE/DayBook/ExpenseIncomeList/", {
            params: {
              organization_id: orgId,
              batch_id: branchId,
              from_date: dateStr,
              to_date: dateStr,
              payment_methodId: paymentMethodId,
            },
          });

          const data = response.data;
          console.log(`Data for ${dateStr}:`, data);

          // If we get fee receipts for this date, store them with this date
          if (data && data.data && data.data.FeeReceiptRecordData && data.data.FeeReceiptRecordData.length > 0) {
            dateDataMap[dateStr] = data.data.FeeReceiptRecordData;
            console.log(`Found ${data.data.FeeReceiptRecordData.length} receipts for ${dateStr}`);
          }
        } catch (error) {
          console.error(`Error fetching data for ${dateStr}:`, error);
          // Continue to next date even if one fails
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      console.log("Dates with data:", Object.keys(dateDataMap));

      // Check if we have any data
      if (Object.keys(dateDataMap).length === 0) {
        setIsExportingMultiple(false);
        alert(
          `No fee receipts found for the selected date range (${fromDate} to ${toDate}).\n\nPlease check:\n1. Date range has fee receipt data\n2. Correct payment method is selected`
        );
        return;
      }

      // Create PDF with multiple pages (one per day with data)
      const doc = new jsPDF("portrait", "mm", "a4");
      let isFirstPage = true;
      let pageCount = 0;

      // Sort dates
      const sortedDates = Object.keys(dateDataMap).sort();

      console.log("Creating PDF with pages for dates:", sortedDates);

      for (const date of sortedDates) {
        const dayReceipts = dateDataMap[date];

        console.log(`Creating page for date: ${date} with ${dayReceipts.length} receipts`);

        if (!isFirstPage) {
          doc.addPage();
        }

        pageCount++;

        // Add logo
        try {
          const logoData = await loadLogoImage();
          doc.addImage(logoData, "JPEG", 10, 10, 20, 20);
        } catch (error) {
          console.error("Error loading logo:", error);
        }

        // Header
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(16);
        const headerText = "Sparsh College of Nursing and Allied Sciences";
        const textWidth =
          (doc.getStringUnitWidth(headerText) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const textX = (pageWidth - textWidth) / 2;
        doc.text(headerText, textX, 22);

        doc.setFontSize(12);
        doc.text("Day Book Report - Fee Receipts", pageWidth / 2, 30, { align: "center" });

        // Date and Payment Method info - use the actual date from receipts
        doc.setFontSize(10);
        doc.setFont("Helvetica", "normal");
        doc.text(`Date: ${date}`, 15, 40);
        doc.text(`Payment Method: ${paymentMethodName}`, 15, 46);

        let startY = 55;

        // Fee Receipts Section
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(12);
        doc.text("FEE RECEIPTS", 15, startY);
        startY += 8;

        const feeReceiptsTable = dayReceipts.map((receipt, index) => [
          index + 1,
          receipt.receipt_no || "-",
          receipt.student_name || "-",
          receipt.college_admission_no || receipt.school_admission_no || "-",
          receipt.course_name || receipt.class_name || "-",
          receipt.department_name || "-",
          receipt.semester_name || "-",
          parseFloat(receipt.payment_amount || 0).toFixed(2),
        ]);

        const feeTotal = dayReceipts.reduce(
          (sum, receipt) => sum + parseFloat(receipt.payment_amount || 0),
          0
        );

        feeReceiptsTable.push([
          "",
          "",
          "",
          "",
          "",
          "",
          "Total:",
          feeTotal.toFixed(2),
        ]);

        doc.autoTable({
          startY: startY,
          head: [["Sr.", "Receipt No.", "Student Name", "Admission No", "Course", "Department", "Semester Name", "Amount"]],
          body: feeReceiptsTable,
          theme: "grid",
          styles: { fontSize: 8 },
          headStyles: { fontSize: 8, fontStyle: "bold" },
          columnStyles: { 7: { halign: "right" } },
          margin: { left: 15, right: 15 },
        });

        isFirstPage = false;
      }

      // Save PDF
      const filename = `DayBook_FeeReceipts_${fromDate}_to_${toDate}.pdf`;
      doc.save(filename);

      setIsExportingMultiple(false);
      alert(`Export completed! PDF generated with ${pageCount} page(s) - one for each day with fee receipts.`);
    } catch (error) {
      console.error("Error in exportMultipleDayBook:", error);
      alert("An error occurred while exporting. Please try again.");
      setIsExportingMultiple(false);
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
                DAY BOOK
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
                    style={{
                      width: "150px",
                    }}
                    onClick={handleClear}
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
                    disabled={isExporting || isExportingMultiple}
                  >
                    {isExporting ? "Exporting..." : "Export to PDF"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={() => navigate("/admin/dashboard")}
                    disabled={isExporting || isExportingMultiple}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "210px",
                    }}
                    onClick={exportMultipleDayBook}
                    disabled={isExporting || isExportingMultiple}
                  >
                    {isExportingMultiple ? "Exporting..." : "Export Multiple Day Book"}
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2 mb-3 ">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-3">
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
                      <div className="col-12 col-md-3 mb-3">
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
                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="payment-method" className="form-label">
                          Payment Method
                        </label>
                        <Select
                          id="payment-method"
                          className="detail"
                          options={paymentMethods}
                          value={selectedPaymentMethod}
                          onChange={setSelectedPaymentMethod}
                          classNamePrefix="payment-method-dropdown"
                          placeholder="Select payment method"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div id="dayBookContent">
                <Row className="mb-4 mx-0">
                  <Col md={6}>
                    <div className="border p-3">
                      <h5 style={{ color: "black" }}>FEE RECEIPTS</h5>
                      <div
                        className="table-responsive"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                      >
                        <table className="table">
                          <thead className="thead-dark">
                            <tr>
                              <th>Receipt No.</th>
                              <th>Student Name</th>
                              <th>Admission No</th>
                              <th>Course</th>
                              <th>Department</th>
                              <th>Semester Name</th>
                              <th>Receipt Amt.</th>
                              <th>Payment</th>
                            </tr>
                          </thead>
                          <tbody>
                            {feeReceiptsData.map((receipt, index) => (
                              <tr key={index}>
                                <td>
                                  <a
                                    href="#"
                                    style={{
                                      color: "blue",
                                      textDecoration: "underline",
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault(); // Prevent default anchor behavior
                                      handleReceiptLinkClick(
                                        receipt.receipt_no
                                      );
                                    }}
                                  >
                                    {receipt.receipt_no}
                                  </a>
                                </td>

                                <td>{receipt.student_name || "-"}</td>
                                <td>{receipt.college_admission_no || receipt.school_admission_no || "-"}</td>
                                <td>{receipt.course_name || receipt.class_name || "-"}</td>
                                <td>{receipt.department_name || "-"}</td>
                                <td>{receipt.semester_name || "-"}</td>
                                <td>{receipt.payment_amount.toFixed(2)}</td>
                                <td>{receipt.payment_amount.toFixed(2)}</td>
                              </tr>
                            ))}
                            {/* Total Row */}
                            <tr style={{ fontWeight: "bold" }}>
                              <td colSpan="7" className="text-right">
                                Total:
                              </td>
                              <td>
                                {feeReceiptsData
                                  .reduce(
                                    (sum, receipt) =>
                                      sum + receipt.payment_amount,
                                    0
                                  )
                                  .toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Col>

                  {/* </Row> */}

                  {/* Expenses Section */}
                  {/* <Row className="mb-4"> */}
                  <Col md={6}>
                    <div className="border p-3">
                      <h5 style={{ color: "black" }}>EXPENSES</h5>
                      <div
                        className="table-responsive"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                      >
                        <table className="table">
                          <thead className="thead-dark">
                            <tr>
                              <th>Expense No.</th>
                              <th>Party Name</th>
                              <th>Party Reference</th>
                              <th>Expense Amt.</th>
                              <th>Payment</th>
                            </tr>
                          </thead>
                          <tbody>
                            {expensesData.map((expense, index) => (
                              <tr key={index}>
                                <td>
                                  <a
                                    href={`#`} // Replace `#` with the actual link if needed
                                    style={{
                                      color: "blue",
                                    }}
                                  >
                                    {expense.expense_no}
                                  </a>
                                </td>
                                <td>{expense.party_name}</td>
                                <td>{expense.party_reference}</td>
                                <td>{expense.payment_amount.toFixed(2)}</td>
                                <td>{expense.payment_amount.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr style={{ fontWeight: "bold" }}>
                              <td colSpan="4" className="text-right">
                                Total:
                              </td>
                              <td>
                                {expensesData
                                  .reduce(
                                    (sum, expense) =>
                                      sum + expense.payment_amount,
                                    0
                                  )
                                  .toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Other Income Section */}
                <Row className="mb-4 mx-0">
                  <Col md={6}>
                    <div className="border p-3">
                      <h5 style={{ color: "black" }}>OTHER INCOME</h5>
                      <div
                        className="table-responsive"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                      >
                        <table className="table">
                          <thead className="thead-dark">
                            <tr>
                              <th>Income No.</th>
                              <th>Party Name</th>
                              <th>Party Reference</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {otherIncomeData.map((income, index) => (
                              <tr key={index}>
                                <td>
                                  <a
                                    href="#"
                                    style={{ color: "blue" }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleIncomeClick(income.income_no);
                                    }}
                                  >
                                    {income.income_no}
                                  </a>
                                  ;
                                </td>
                                <td>{income.party_name}</td>
                                <td>{income.party_reference}</td>
                                <td>{income.payment_amount.toFixed(2)}</td>
                              </tr>
                            ))}
                            {/* Total Row */}
                            <tr style={{ fontWeight: "bold" }}>
                              <td colSpan="3" className="text-right">
                                Total:
                              </td>
                              <td>
                                {otherIncomeData
                                  .reduce(
                                    (sum, income) =>
                                      sum + income.payment_amount,
                                    0
                                  )
                                  .toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Col>

                  {/* Calculation Section on the Right Side */}
                  <div className="col-12 col-md-6 mb-4">
                    <div className="border p-3 h-100">
                      <h5 className="text-dark">CALCULATION</h5>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <tbody>
                            <tr>
                              <td>
                                <strong>Total Inward Amount:</strong>
                              </td>
                              <td>
                                {(
                                  feeReceiptsData.reduce(
                                    (sum, receipt) =>
                                      sum + receipt.payment_amount,
                                    0
                                  ) +
                                  otherIncomeData.reduce(
                                    (sum, income) =>
                                      sum + income.payment_amount,
                                    0
                                  )
                                ).toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Total Outward Amount:</strong>
                              </td>
                              <td>
                                {expensesData
                                  .reduce(
                                    (sum, expense) =>
                                      sum + expense.payment_amount,
                                    0
                                  )
                                  .toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Balance:</strong>
                              </td>
                              <td>
                                {(
                                  feeReceiptsData.reduce(
                                    (sum, receipt) =>
                                      sum + receipt.payment_amount,
                                    0
                                  ) +
                                  otherIncomeData.reduce(
                                    (sum, income) =>
                                      sum + income.payment_amount,
                                    0
                                  ) -
                                  expensesData.reduce(
                                    (sum, expense) =>
                                      sum + expense.payment_amount,
                                    0
                                  )
                                ).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
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
