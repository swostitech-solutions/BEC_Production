

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./PaymentDetails.css";
import { useLocation } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";




const FeeDetails = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const passedDate = location.state?.selectedDate || null;

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredFeeData, setFilteredFeeData] = useState([]);
  const academicSessionId = localStorage.getItem("academicSessionId");
  const orgId = localStorage.getItem("orgId");
  const branchId = localStorage.getItem("branchId");

  useEffect(() => {
    if (passedDate) {
      const parsedDate = new Date(passedDate);
      if (!isNaN(parsedDate)) {
        setStartDate(parsedDate);
        setEndDate(parsedDate);
      }
    }
  }, [passedDate]);

  // useEffect(() => {
  //   if (startDate && endDate) {
  //     const fromDate = startDate.toISOString().split("T")[0]; // Convert to yyyy-mm-dd
  //     const toDate = endDate.toISOString().split("T")[0]; // Convert to yyyy-mm-dd

  //     const apiUrl = `${ApiUrl.apiurl}FeesDashBoard/feesReceiptsearch/?academic_year_id=${academicSessionId}&org_id=${orgId}&branch_id=${branchId}&from_date=${fromDate}&to_date=${toDate}`;

  //     fetch(apiUrl)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (data.message === "success" && data.data) {
  //           setFilteredFeeData(data.data);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching data:", error);
  //       });
  //   }
  // }, [startDate, endDate, academicSessionId, orgId, branchId]);


  // Sample data - replace with actual data

  // const handleSearch = (
  //   customStartDate = startDate,
  //   customEndDate = endDate
  // ) => {
  //   let apiUrl = `${ApiUrl.apiurl}FeesDashBoard/feesReceiptsearch/?academic_year_id=${academicSessionId}&org_id=${orgId}&branch_id=${branchId}`;

  //   if (customStartDate) {
  //     const fromDate = customStartDate.toISOString().split("T")[0];
  //     apiUrl += `&from_date=${fromDate}`;
  //   }

  //   if (customEndDate) {
  //     const toDate = customEndDate.toISOString().split("T")[0];
  //     apiUrl += `&to_date=${toDate}`;
  //   }

  //   fetch(apiUrl)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.message === "success" && data.data) {
  //         setFilteredFeeData(data.data);
  //       } else {
  //         setFilteredFeeData([]);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // };


  // useEffect(() => {
  //   handleSearch(); // Load all data initially (no filters)
  // }, []);




  const fetchFeeData = (customStartDate, customEndDate) => {
    let apiUrl = `${ApiUrl.apiurl}FeeReceipt/GetFilterFeeReceipts/?organization_id=${orgId}&branch_id=${branchId}&view_receipt=true&view_cancel_receipt=false`;

    if (customStartDate && customEndDate) {
      // Use local date string to avoid timezone shifts (e.g. UTC conversion reducing the day by 1)
      // Assuming customStartDate is a Date object created from YYYY-MM-DD string,
      // or we want the local representation of the selected date.
      const fromDate = customStartDate.toLocaleDateString("en-CA");
      const toDate = customEndDate.toLocaleDateString("en-CA");
      apiUrl += `&date_from=${fromDate}&date_to=${toDate}`;
    }

    console.log("Fetching Fee Data from:", apiUrl);

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fee Data API Response:", data);
        if (data.message === "success" && data.data) {
          setFilteredFeeData(data.data);
        } else {
          setFilteredFeeData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };


  useEffect(() => {
    if (startDate && endDate) {
      fetchFeeData(startDate, endDate);
    }
  }, [startDate, endDate, academicSessionId, orgId, branchId]);

  const handleSearchClick = () => {
    fetchFeeData(startDate, endDate);
  };





  const formatDate = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    return isNaN(parsedDate) ? "" : parsedDate.toLocaleDateString("en-GB");
  };

  const generatePDF = (row) => {
    const doc = new jsPDF();
    const startY = 50;

    doc.setFontSize(12);
    // doc.text("Vinayak Vidya Mandir Sr. Sec. School", 80, 20);
    // doc.text("Kumashpur, SONIPAT, HARYANA-131021", 75, 30);

    doc.setFontSize(10);
    doc.text(`Receipt No: ${row.receipt_no}`, 20, startY);
    doc.text(`Session: 2024-25`, 160, startY);
    doc.text(`Receipt Date: ${formatDate(row.receiptDate)}`, 20, startY + 10);
    doc.text(`Class: ${row.course_name}`, 160, startY + 10);
    doc.text(`Student Name: ${row.student_name}`, 20, startY + 20);
    doc.text(`Section: ${row.section_name}`, 160, startY + 20);
    doc.text(`Admission No: ${row.college_admission_no}`, 20, startY + 30);
    doc.text(`Father Name: ${row.father_name || "Naresh"}`, 160, startY + 30);
    doc.text(`Fee Periods: ${row.semester_description}`, 20, startY + 40);

    doc.autoTable({
      startY: startY + 50,
      head: [["Sr.No", "Element", "Amount"]],
      body: [
        ["1", "TUITION FEES", "5,000.00"],
        ["2", "ANNUAL CHARGES", "4,930.00"],
        ["3", "OLD NOTE BOOKS", "860.00"],
        ["4", "CONCESSION", row.discount_amount || 0],
      ],
      theme: "grid",
      margin: { top: 10 },
    });

    const finalY = doc.previousAutoTable.finalY;

    doc.text(`Total: ${row.amount}`, 160, finalY + 10);

    doc.text("Payment Method", 20, finalY + 30);
    doc.text(row.payment_detail?.payment_type || "", 160, finalY + 30);

    doc.text("Payment Reference", 20, finalY + 40);
    doc.text(`Amount: ${row.amount}`, 160, finalY + 40);

    doc.text("Total Session Fees: 20,790.00", 20, finalY + 60);
    doc.text(
      "Balance Till Current Fee Period (AUG24): 1,250.00",
      160,
      finalY + 60
    );

    doc.text("Total Paid: 10,530.00", 20, finalY + 70);
    doc.text("Total Discount: 260.00", 160, finalY + 70);

    doc.text("Total Balance: 10,000.00", 20, finalY + 90);

    doc.save(`FeeDetails_${row.receipt_no}.pdf`);
  };
  const exportToExcel = () => {
    // If there's no data to export, show an alert and return
    if (!filteredFeeData || filteredFeeData.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Continue export if data is available
    const ws = XLSX.utils.json_to_sheet(filteredFeeData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FeeDetails");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "FeeDetails.xlsx"
    );
  };




  // const exportToPDF = () => {
  //   const input = document.getElementById("feeTable");

  //   if (!input) {
  //     console.error("Element with ID 'feeTable' not found.");
  //     alert(
  //       "Table not found. Make sure the element with ID 'feeTable' exists."
  //     );
  //     return;
  //   }

  //   html2canvas(input).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const imgWidth = 210;
  //     const pageHeight = 297;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     let heightLeft = imgHeight;
  //     let position = 0;

  //     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;

  //     while (heightLeft >= 0) {
  //       position = heightLeft - imgHeight;
  //       pdf.addPage();
  //       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;
  //     }

  //     pdf.save("FeeDetails.pdf");
  //   });
  // };

  // const exportToPDF = () => {
  //   const originalTable = document.getElementById("feeTable");

  //   if (!originalTable) {
  //     console.error("Element with ID 'feeTable' not found.");
  //     alert(
  //       "Table not found. Make sure the element with ID 'feeTable' exists."
  //     );
  //     return;
  //   }

  //   // Clone the table
  //   const clonedTable = originalTable.cloneNode(true);

  //   // Create header with college name and date range
  //   const header = document.createElement("div");
  //   header.style.textAlign = "center";
  //   header.style.marginBottom = "20px";

  //   const collegeName = document.createElement("h3");
  //   collegeName.textContent = "Vinayak Vidya Mandir Sr. Sec. School";
  //   collegeName.style.margin = "0";
  //   collegeName.style.fontWeight = "bold";

  //   const address = document.createElement("p");
  //   address.textContent = "Kumashpur, SONIPAT, HARYANA-131021";
  //   address.style.margin = "0";
  //   address.style.fontSize = "14px";

  //   const dateRange = document.createElement("p");
  //   const fromDateStr = startDate
  //     ? startDate.toLocaleDateString("en-GB")
  //     : "N/A";
  //   const toDateStr = endDate ? endDate.toLocaleDateString("en-GB") : "N/A";
  //   dateRange.textContent = `From: ${fromDateStr}  |  To: ${toDateStr}`;
  //   dateRange.style.marginTop = "8px";
  //   dateRange.style.fontSize = "14px";
  //   dateRange.style.fontWeight = "bold";

  //   header.appendChild(collegeName);
  //   header.appendChild(address);
  //   header.appendChild(dateRange);

  //   // Create hidden container and append header + table
  //   const hiddenContainer = document.createElement("div");
  //   hiddenContainer.style.position = "absolute";
  //   hiddenContainer.style.top = "0";
  //   hiddenContainer.style.left = "-9999px";
  //   hiddenContainer.style.width = "auto";
  //   hiddenContainer.style.padding = "20px";
  //   hiddenContainer.style.background = "#fff";
  //   hiddenContainer.appendChild(header);
  //   hiddenContainer.appendChild(clonedTable);
  //   document.body.appendChild(hiddenContainer);

  //   // Render after layout
  //   setTimeout(() => {
  //     html2canvas(hiddenContainer, {
  //       scale: 2,
  //       useCORS: true,
  //       logging: false,
  //     }).then((canvas) => {
  //       const imgData = canvas.toDataURL("image/png");

  //       const imgWidth = 210; // A4 width
  //       const pageHeight = 297;
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //       const pdf = new jsPDF("p", "mm", "a4");
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

  //       pdf.save("FeeDetails.pdf");

  //       document.body.removeChild(hiddenContainer);
  //     });
  //   }, 100);
  // };


  const exportToPDF = () => {
    if (!filteredFeeData || filteredFeeData.length === 0) {
      alert("No data available to export.");
      return;
    }
    const originalTable = document.getElementById("feeTable");

    if (!originalTable) {
      alert("Table not found. Make sure the element with ID 'feeTable' exists.");
      return;
    }

    // Check if table has more than just summary rows
    const rows = originalTable.querySelectorAll("tbody tr");
    const filteredDataRows = Array.from(rows).filter(
      (row) =>
        !row.innerText.includes("Total Receipt Amt.") &&
        !row.innerText.includes("Total Discount")
    );

    if (filteredDataRows.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Clone the table
    const clonedTable = originalTable.cloneNode(true);

    // Create header with college name and date range
    const header = document.createElement("div");
    header.style.textAlign = "center";
    header.style.marginBottom = "20px";

    const collegeName = document.createElement("h3");
    collegeName.textContent = "Vinayak Vidya Mandir Sr. Sec. School";
    collegeName.style.margin = "0";
    collegeName.style.fontWeight = "bold";

    const address = document.createElement("p");
    address.textContent = "Kumashpur, SONIPAT, HARYANA-131021";
    address.style.margin = "0";
    address.style.fontSize = "14px";

    const dateRange = document.createElement("p");
    const fromDateStr = startDate
      ? startDate.toLocaleDateString("en-GB")
      : "N/A";
    const toDateStr = endDate ? endDate.toLocaleDateString("en-GB") : "N/A";
    dateRange.textContent = `From: ${fromDateStr}  |  To: ${toDateStr}`;
    dateRange.style.marginTop = "8px";
    dateRange.style.fontSize = "14px";
    dateRange.style.fontWeight = "bold";

    header.appendChild(collegeName);
    header.appendChild(address);
    header.appendChild(dateRange);

    // Create hidden container and append header + table
    const hiddenContainer = document.createElement("div");
    hiddenContainer.style.position = "absolute";
    hiddenContainer.style.top = "0";
    hiddenContainer.style.left = "-9999px";
    hiddenContainer.style.width = "auto";
    hiddenContainer.style.padding = "20px";
    hiddenContainer.style.background = "#fff";
    hiddenContainer.appendChild(header);
    hiddenContainer.appendChild(clonedTable);
    document.body.appendChild(hiddenContainer);

    // Render after layout
    setTimeout(() => {
      html2canvas(hiddenContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const imgWidth = 210; // A4 width
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pdf = new jsPDF("p", "mm", "a4");
        let position = 0;
        let heightLeft = imgHeight;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("FeeDetails.pdf");
        document.body.removeChild(hiddenContainer);
      });
    }, 100);
  };



  const handleClose = () => {
    navigate("/admin/fee-dashboard");
  };


  const handleClear = () => {
    setSearchTerm(""); // Clear search input if used
    setStartDate(null); // Clear From Date
    setEndDate(null); // Clear To Date
    setFilteredFeeData([]); // Clear table data
  };


  const handlePrint = () => {
    window.print();
  };

  // Calculate totals for display
  const totalReceiptAmt = filteredFeeData.reduce(
    (total, row) => total + (parseFloat(row.amount) || 0),
    0
  );
  const totalDiscount = filteredFeeData.reduce(
    (total, row) => total + (parseFloat(row.discount_amount) || 0),
    0
  );



  const handleReceiptLinkClick = async (receiptNo) => {
    const academicSessionId = localStorage.getItem("academicSessionId");

    if (!academicSessionId) {
      alert("Academic session ID not found.");
      return;
    }

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}FeeReceipt/GetFeeReceiptsBasedOnReceiptNo/?organization_id=${orgId}&branch_id=${branchId}&receipt_no=${receiptNo}`
      );
      const result = await response.json();

      if (response.ok && result.receipt_data) {
        // Format the date from ISO to readable format
        const formatReceiptDate = (isoDate) => {
          if (!isoDate) return "";
          const date = new Date(isoDate);
          return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
        };

        // Handle student_name array
        const studentName = Array.isArray(result.receipt_data.student_name)
          ? result.receipt_data.student_name.join(" ")
          : result.receipt_data.student_name || "";

        // Handle fee_semesters array
        const feeSemesters = Array.isArray(result.receipt_data.fee_semesters)
          ? result.receipt_data.fee_semesters.join(", ")
          : result.receipt_data.fee_semesters || "";

        const receiptHtml = `
        <div id="pdf-content">
          <div style="width: 70%; border: 1px solid black; padding: 8px; font-family: Arial, sans-serif; font-size: 12px; margin: auto;">
            
            <div style="text-align: center; font-size: 14px; font-weight: bold; margin-bottom: 8px;">Fee Receipt</div>

            <table style="width: 100%; border-collapse: collapse; border: 1px solid black; margin-top: 8px;">
              <tbody>
                <tr>
                  <td style="padding: 10px; width: 25%;"><strong>Receipt No:</strong></td>
                  <td style="padding: 10px; width: 25%;">${result.receipt_data.receipt_no}</td>
                  <td style="padding: 10px; width: 25%;"><strong>Academic Year:</strong></td>
                  <td style="padding: 10px; width: 25%;">${result.receipt_data.academic_year_code || ""}</td>
                </tr>
                <tr>
                  <td style="padding: 10px;"><strong>Receipt Date:</strong></td>
                  <td style="padding: 10px;">${formatReceiptDate(result.receipt_data.receipt_date)}</td>
                  <td style="padding: 10px;"><strong>Section:</strong></td>
                  <td style="padding: 10px;">${result.receipt_data.section_name || ""}</td>
                </tr>
                <tr>
                  <td style="padding: 10px;"><strong>Student Name:</strong></td>
                  <td style="padding: 10px;">${studentName}</td>
                  <td style="padding: 10px;"><strong>Father's Name:</strong></td>
                  <td style="padding: 10px;">${result.receipt_data.father_name || ""}</td>
                </tr>
                <tr>
                  <td style="padding: 10px;"><strong>Admission No:</strong></td>
                  <td style="padding: 10px;">${result.receipt_data.admission_no || ""}</td>
                  <td style="padding: 10px;"><strong>Fee Period:</strong></td>
                  <td style="padding: 10px;">${feeSemesters}</td>
                </tr>
                <tr>
                  <td style="padding: 10px;"><strong>Course:</strong></td>
                  <td style="padding: 10px;">${result.receipt_data.course_name || ""}</td>
                  <td style="padding: 10px;"><strong>Department:</strong></td>
                  <td style="padding: 10px;">${result.receipt_data.department_name || ""}</td>
                </tr>
                <tr>
                  <td style="padding: 10px;"><strong>Semester:</strong></td>
                  <td style="padding: 10px;">${result.receipt_data.semester_name || ""}</td>
                  <td style="padding: 10px;"><strong>Amount Paid:</strong></td>
                  <td style="padding: 10px;"><strong>₹${Number(result.receipt_data.amount || 0).toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>

            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <thead>
                <tr>
                  <th style="border: 1px solid black; padding: 8px; background-color: #f0f0f0; text-align: left;">Sr. No.</th>
                  <th style="border: 1px solid black; padding: 8px; background-color: #f0f0f0; text-align: left;">Fee Element</th>
                  <th style="border: 1px solid black; padding: 8px; background-color: #f0f0f0; text-align: right;">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${Object.values(result.receipt_data.payment_element_list || {})
            .map(
              (element, index) => `
                  <tr>
                    <td style="border: 1px solid black; padding: 8px; text-align: center;">${index + 1}</td>
                    <td style="border: 1px solid black; padding: 8px;">${element.element_name}</td>
                    <td style="border: 1px solid black; padding: 8px; text-align: right;">${Number(element.amount || 0).toFixed(2)}</td>
                  </tr>`
            )
            .join("")}
                <tr style="background-color: #f0f0f0;">
                  <td colspan="2" style="border: 1px solid black; padding: 8px; text-align: right;"><strong>Total Amount Paid:</strong></td>
                  <td style="border: 1px solid black; padding: 8px; text-align: right;"><strong>₹${Number(result.receipt_data.amount || 0).toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>

            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <thead>
                <tr>
                  <th style="border: 1px solid black; padding: 8px; background-color: #f0f0f0; text-align: left;">Payment Method</th>
                  <th style="border: 1px solid black; padding: 8px; background-color: #f0f0f0; text-align: left;">Payment Reference</th>
                  <th style="border: 1px solid black; padding: 8px; background-color: #f0f0f0; text-align: left;">Remark</th>
                  <th style="border: 1px solid black; padding: 8px; background-color: #f0f0f0; text-align: right;">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid black; padding: 8px;">${result.receipt_data.payment_method || "-"}</td>
                  <td style="border: 1px solid black; padding: 8px;">${result.receipt_data.payment_reference || "-"}</td>
                  <td style="border: 1px solid black; padding: 8px;">${result.receipt_data.remarks || "-"}</td>
                  <td style="border: 1px solid black; padding: 8px; text-align: right;">${Number(result.receipt_data.amount || 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <thead>
                <tr>
                  <th colspan="2" style="border: 1px solid black; padding: 8px; background-color: #f0f0f0; text-align: center;">Fee Summary</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid black; padding: 8px; width: 70%;">Total Academic Year Fees</td>
                  <td style="border: 1px solid black; padding: 8px; text-align: right; width: 30%;">₹${Number(result.receipt_data.total_academic_year_fees || 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid black; padding: 8px;">Total Paid Till Date</td>
                  <td style="border: 1px solid black; padding: 8px; text-align: right;">₹${Number(result.receipt_data.total_paid || 0).toFixed(2)}</td>
                </tr>
                <tr style="background-color: #f0f0f0;">
                  <td style="border: 1px solid black; padding: 8px;"><strong>Remaining Balance</strong></td>
                  <td style="border: 1px solid black; padding: 8px; text-align: right;"><strong>₹${Number(result.receipt_data.remaining_amount || 0).toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>

            <div style="margin-top: 20px; padding: 10px; border-top: 1px solid #ccc;">
              <p style="margin: 5px 0; font-size: 10px; text-align: center; color: #666;">
                This is a computer-generated receipt and does not require a signature.
              </p>
            </div>
          </div>
        </div>
      `;

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = receiptHtml;
        document.body.appendChild(tempDiv);

        const opt = {
          margin: 0.5,
          filename: `Receipt_${result.receipt_data.receipt_no}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };


        const worker = html2pdf().from(tempDiv).set(opt);

        const blob = await worker.outputPdf("blob");

        // Open PDF in a new tab
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");

        // Clean up
        document.body.removeChild(tempDiv);
      } else {
        alert(result.message || "Failed to fetch receipt details.");
      }
    } catch (error) {
      console.error("Error fetching receipt details:", error);
      alert("An error occurred. Please try again.");
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
                FEE DAY BOOK
              </p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12  d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSearchClick}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={exportToExcel}
                  >
                    Export to Excel
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
                    onClick={handleClose}
                  >
                    Close
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
                    onClick={handlePrint}
                  >
                    Print Receipts
                  </button>
                </div>
              </div>
              <div id="printArea">
                <div className="row mt-3 mx-1">
                  <div className="col-12  custom-section-box">
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                      <div className="row flex-grow-1 mb-3">
                        <div className="col-12 col-md-4 mb-2">
                          <label htmlFor="fromDate" className="form-label">
                            From Date
                          </label>
                          <input
                            type="date"
                            id="fromDate"
                            className="form-control"
                            value={
                              startDate
                                ? startDate.toLocaleDateString("en-CA")
                                : ""
                            }
                            onChange={(e) =>
                              setStartDate(new Date(e.target.value))
                            }
                          />
                        </div>

                        <div className="col-12 col-md-4 mb-2">
                          <label htmlFor="toDate" className="form-label">
                            To Date
                          </label>
                          <input
                            type="date"
                            id="toDate"
                            className="form-control"
                            value={
                              endDate ? endDate.toLocaleDateString("en-CA") : ""
                            }
                            onChange={(e) =>
                              setEndDate(new Date(e.target.value))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Debug Info: Show record count */}
                <div className="row mx-1">
                  <div className="col-12">
                    <div className="alert alert-info py-1">
                      Records found: {filteredFeeData ? filteredFeeData.length : 0}
                    </div>
                  </div>
                </div>
                <div id="feeTable" className="col-12">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sr No</th>
                          <th>Date</th>
                          <th>Receipt No</th>
                          <th>Fee Period</th>
                          <th>Name</th>
                          <th>Class</th>
                          <th>Section</th>
                          <th>School Admission No</th>
                          <th>Payment Method</th>
                          <th>Discount</th>
                          <th>Received Fees</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredFeeData.map((row, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{formatDate(row.receiptDate)}</td>
                            <td>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleReceiptLinkClick(row.receipt_no);
                                }}
                                style={{
                                  textDecoration: "underline",
                                  color: "blue",
                                }}
                              >
                                {row.receipt_no}
                              </a>
                            </td>
                            <td>{row.semester_description}</td>
                            <td>{row.student_name}</td>
                            <td>{row.course_name}</td>
                            <td>{row.section_name}</td>
                            <td>{row.college_admission_no}</td>
                            <td>{row.payment_detail?.payment_type}</td>
                            <td>{row.discount_amount || 0}</td>
                            <td>{row.amount}</td>
                          </tr>
                        ))}

                        {/* Summary Row */}
                        <tr>
                          <td colSpan="11">
                            <div className="row">
                              <div className="col-md-6">
                                <table className="table table-bordered">
                                  <thead>
                                    <tr>
                                      <th>Payment Method</th>
                                      <th>Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Object.entries(
                                      filteredFeeData.reduce((acc, row) => {
                                        const method =
                                          row.payment_detail?.payment_type ||
                                          "Unknown";
                                        const amount =
                                          parseFloat(row.amount) || 0;
                                        acc[method] =
                                          (acc[method] || 0) + amount;
                                        return acc;
                                      }, {})
                                    ).map(([method, amount], index) => (
                                      <tr key={index}>
                                        <td>{method}</td>
                                        <td>{amount.toFixed(2)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              <div className="col-md-6">
                                <table className="table">
                                  <tbody>
                                    <tr>
                                      <td className="text-end fw-bold">
                                        Total Receipt Amt.:
                                      </td>
                                      <td className="fw-bold">
                                        {totalReceiptAmt.toFixed(2)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-end fw-bold">
                                        Total Discount:
                                      </td>
                                      <td className="fw-bold">
                                        {totalDiscount.toFixed(2)}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
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

export default FeeDetails;