




import React, { useState } from "react";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./PaymentDetails.css";

const FeeDetails = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(new Date("2024-08-01"));
  const [endDate, setEndDate] = useState(new Date("2024-08-01"));

  // Sample data - replace with actual data
  const feeData = [
    {
      date: "2024-08-01",
      receiptNo: "12345",
      feePeriod: "APR24",
      name: "Jo Doe",
      class: "10",
      section: "A",
      admissionNo: "001",
      paymentMethod: "CASH",
      discount: "260.00",
      receivedFees: "10,530.00",
    },
    {
      date: "2024-08-01",
      receiptNo: "12345",
      feePeriod: "APR24",
      name: "Jo Doe",
      class: "10",
      section: "A",
      admissionNo: "001",
      paymentMethod: "CASH",
      discount: "260.00",
      receivedFees: "10,530.00",
    },
    {
      date: "2024-08-01",
      receiptNo: "12345",
      feePeriod: "APR24",
      name: "Jo Doe",
      class: "10",
      section: "A",
      admissionNo: "001",
      paymentMethod: "CASH",
      discount: "260.00",
      receivedFees: "10,530.00",
    },
    // Add more data as needed
  ];

  const filterByDateRange = (data) => {
    return data.filter((row) => {
      const date = new Date(row.date);
      return date >= startDate && date <= endDate;
    });
  };

  const filteredFeeData = filterByDateRange(
    feeData.filter((row) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const generatePDF = (row) => {
    const doc = new jsPDF();
    const startY = 50;

    doc.setFontSize(12);
    doc.text("Vinayak Vidya Mandir Sr. Sec. School", 80, 20);
    doc.text("Kumashpur, SONIPAT, HARYANA-131021", 75, 30);

    doc.setFontSize(10);
    doc.text(`Receipt No: ${row.receiptNo}`, 20, startY);
    doc.text(`Session: 2024-25`, 160, startY);
    doc.text(`Receipt Date: ${row.date}`, 20, startY + 10);
    doc.text(`Class: ${row.class}`, 160, startY + 10);
    doc.text(`Student Name: ${row.name}`, 20, startY + 20);
    doc.text(`Section: ${row.section}`, 160, startY + 20);
    doc.text(`Admission No: ${row.admissionNo}`, 20, startY + 30);
    doc.text(`Father Name: Naresh`, 160, startY + 30);
    doc.text(`Fee Periods: ${row.feePeriod}`, 20, startY + 40);

    doc.autoTable({
      startY: startY + 50,
      head: [["Sr.No", "Element", "Amount"]],
      body: [
        ["1", "TUITION FEES", "5,000.00"],
        ["2", "ANNUAL CHARGES", "4,930.00"],
        ["3", "OLD NOTE BOOKS", "860.00"],
        ["4", "CONCESSION", row.discount],
      ],
      theme: "grid",
      margin: { top: 10 },
    });

    const finalY = doc.previousAutoTable.finalY;

    doc.text(`Total: ${row.receivedFees}`, 160, finalY + 10);

    doc.text("Payment Method", 20, finalY + 30);
    doc.text(row.paymentMethod, 160, finalY + 30);

    doc.text("Payment Reference", 20, finalY + 40);
    doc.text(`Amount: ${row.receivedFees}`, 160, finalY + 40);

    doc.text("Total Session Fees: 20,790.00", 20, finalY + 60);
    doc.text(
      "Balance Till Current Fee Period (AUG24): 1,250.00",
      160,
      finalY + 60
    );

    doc.text("Total Paid: 10,530.00", 20, finalY + 70);
    doc.text("Total Discount: 260.00", 160, finalY + 70);

    doc.text("Total Balance: 10,000.00", 20, finalY + 90);

    doc.save(`FeeDetails_${row.receiptNo}.pdf`);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredFeeData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FeeDetails");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "FeeDetails.xlsx"
    );
  };

  const exportToPDF = () => {
    const input = document.getElementById("feeTable");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("FeeDetails.pdf");
    });
  };

  const handleClose = () => {
    alert("Close functionality not implemented.");
  };

  const handleClear = () => {
    setSearchTerm("");
    setStartDate(new Date("2024-08-01"));
    setEndDate(new Date("2024-08-01"));
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate totals for display
  const totalReceiptAmt = filteredFeeData.reduce(
    (total, row) => total + parseFloat(row.receivedFees.replace(/,/g, "")),
    0
  );
  const totalDiscount = filteredFeeData.reduce(
    (total, row) => total + parseFloat(row.discount.replace(/,/g, "")),
    0
  );

  return (
    <div
      className="container-fee"
      style={{
        backgroundColor: "#F0F0F0",
        padding: "15px",
        maxWidth: "80%",
        margin: "0 auto",
      }}
    >
      <div
        className="button-box header"
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          marginBottom: "10px",
        }}
      >
        <button onClick={() => alert("Search functionality not implemented.")}>
          Search
        </button>
        <button onClick={exportToExcel}>Export to Excel</button>
        <button onClick={exportToPDF}>Export to PDF</button>
        <button variant="danger" onClick={handleClose}>Close</button>
        <button onClick={handleClear}>Clear</button>
        <button onClick={handlePrint}>Print Receipts</button>
      </div>
      <div className="date-range" style={{ marginTop: "10px" }}>
        <div style={{ display: "inline-block", marginRight: "20px" }}>
          <label>From Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <div style={{ display: "inline-block" }}>
          <label>To Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </div>
      <table
        id="feeTable"
        className="fee-details-list"
        style={{
          width: "100%",
          marginTop: "10px",
          borderCollapse: "collapse",
          backgroundColor: "#FFFFFF", // Ensures table background is white
        }}
      >
        <thead style={{ backgroundColor: "#87CEEB" }}>
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
              <td>{row.date}</td>
              <td>
                <a
                  href="#"
                  onClick={() => generatePDF(row)}
                  style={{ textDecoration: "underline", color: "blue" }}
                >
                  {row.receiptNo}
                </a>
              </td>
              <td>{row.feePeriod}</td>
              <td>{row.name}</td>
              <td>{row.class}</td>
              <td>{row.section}</td>
              <td>{row.admissionNo}</td>
              <td>{row.paymentMethod}</td>
              <td>{row.discount}</td>
              <td>{row.receivedFees}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="totals" style={{ textAlign: "right", marginTop: "20px" }}>
        <p>Total Receipt Amt: {totalReceiptAmt.toLocaleString()}</p>
        <p>Total Discount: {totalDiscount.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default FeeDetails;










