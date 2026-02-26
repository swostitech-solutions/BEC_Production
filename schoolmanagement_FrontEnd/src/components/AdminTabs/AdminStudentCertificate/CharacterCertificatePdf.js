import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

import { ApiUrl } from "../../../ApiUrl";

const CharacterCertificate = () => {
  // const [certificate, setcertificate] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch certificate data using transfer_certificate_id, studentId, and documentType from localStorage
    const transferCertificateId = localStorage.getItem(
      "transfer_certificate_id"
    );
    const studentId = localStorage.getItem("studentId");
    const documentType = localStorage.getItem("documentType");

    if (documentType === "CC") {
      const apiUrl = `${ApiUrl.apiurl}STUDENT_CERTIFICATE/GetCertificatePDF/?transfer_certificate_id=${transferCertificateId}&studentId=${studentId}&documentType=${documentType}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "success" && data.data.length > 0) {
            setCertificate(data.data[0]); // Set the certificate data
          } else {
            alert("Failed to fetch certificate data.");
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, []);

  useEffect(() => {
    if (certificate) {
      generatePDF(certificate); // Generate the PDF when data is available
    }
  }, [certificate]);

  const generatePDF = (certificate) => {
    const {
      admission_no,
      studentname,
      fathername,
      mothername,
      dob,
      resident_address,
      school_board_last_taken,
      registration_no,
      marks_obtained,
      subjects_studied,
      classname,
      sectionname,
      academic_year,
    } = certificate;

    const doc = new jsPDF();

    // Logo
    if ("/Assets/sparsh.jpeg") {
      doc.addImage("/Assets/sparsh.jpeg", "JPEG", 10, 10, 30, 30);
    }

    // Heading
    doc.setFontSize(14).setTextColor(0, 0, 255).setFont("Helvetica", "bold");
    doc.text("Sparsh College of Nursing and Allied Sciences", 50, 15);

    doc.setFontSize(12).setTextColor(0, 0, 0).setFont("Helvetica", "normal");
    doc.text("Affiliated to", 50, 21);
    doc.text("Affiliation No.:  School Code: SPARSH", 50, 27);
    doc.text("Tel. No.:", 50, 33);
    doc.text("https://sparshhospitals.com/nursing-college-admission/", 50, 39);

    // Title
    doc.setFontSize(16).setFont("Helvetica", "bold").setTextColor(0, 0, 0);
    doc.text("PROVISIONAL/CHARACTER CERTIFICATE", 105, 50, { align: "center" });

    // Admission details
    doc.setFontSize(12).setFont("Helvetica", "normal");
    doc.text(`Admission No.: ${admission_no}`, 10, 60);
    doc.text(`Class: ${classname} (${sectionname})`, 105, 60, {
      align: "center",
    });
    doc.text(`Date: ${dob}`, 200, 60, { align: "right" });

    // Address and intro
    let y = 68;
    doc.setFontSize(10);
    doc.text(`This is to certify that ${studentname},`, 10, y);
    doc.text(`S/D/o ${fathername} and ${mothername},`, 10, y + 7);
    doc.text(`Date of Birth: ${dob}`, 10, y + 14);
    doc.text(`Resident Address: ${resident_address}`, 10, y + 21);
    doc.text(
      `Passed/Failed/Appeared in the Sec./Sr. Sec. Examination conducted by C.B.S.E., Delhi`,
      10,
      y + 28
    );

    // Table
    const startX = 10;
    const startY = y + 40;
    const cellWidth = [40, 20, 40, 20, 70];
    const headerHeight = 10;
    const dataRowHeight = 25;

    const headers = ["Examination", "Year", "Regn. No.", "Marks", "Subjects"];
    const tableData = [
      [
        school_board_last_taken || "",
        academic_year || "",
        registration_no || "",
        marks_obtained || "",
        subjects_studied || "",
      ],
    ];

    doc.setFontSize(10).setFont("Helvetica", "bold");
    let xOffset = startX;

    headers.forEach((header, index) => {
      doc.rect(xOffset, startY, cellWidth[index], headerHeight);
      doc.text(header, xOffset + 2, startY + 7);
      xOffset += cellWidth[index];
    });

    doc.setFont("Helvetica", "normal");
    let rowYStart = startY + headerHeight;

    tableData.forEach((row) => {
      xOffset = startX;
      row.forEach((data, colIndex) => {
        doc.rect(xOffset, rowYStart, cellWidth[colIndex], dataRowHeight);
        const wrappedText = doc.splitTextToSize(data, cellWidth[colIndex] - 2);
        wrappedText.forEach((line, lineIndex) => {
          doc.text(line, xOffset + 2, rowYStart + 5 + lineIndex * 5);
        });
        xOffset += cellWidth[colIndex];
      });
      rowYStart += dataRowHeight;
    });

    rowYStart += 15;
    doc.text(
      "He/She did not involve himself/herself in any act of indiscipline.",
      10,
      rowYStart
    );
    doc.text(
      "His/Her conduct and behaviour was satisfactory.",
      10,
      rowYStart + 10
    );
    doc.text(
      "I wish Him/Her all the best in future endeavors.",
      10,
      rowYStart + 20
    );

    // Co-scholastic section
    rowYStart += 40;
    doc.setFont("Helvetica", "bold");
    doc.text("Co-Scholastic Activities", 10, rowYStart);

    doc.setFont("Helvetica", "normal");
    doc.text("NSS/NCC/Scout/Guide -", 10, rowYStart + 10);
    doc.text("Cultural Activities -", 10, rowYStart + 20);
    doc.text("Games & Sports -", 10, rowYStart + 30);
    doc.text("Other Activities -", 10, rowYStart + 40);
    doc.text("General Remarks -", 10, rowYStart + 50);

    // Signature section
    rowYStart += 70;
    const width = doc.internal.pageSize.width;
    const margin = 10;
    const ySignature = rowYStart;

    doc.line(margin, ySignature, width / 3 - margin, ySignature);
    doc.line(width / 3, ySignature, (2 * width) / 3 - margin, ySignature);
    doc.line((2 * width) / 3, ySignature, width - margin, ySignature);

    doc.text("Prepared by", margin, ySignature + 5);
    doc.text("Checked by", width / 3, ySignature + 5);
    doc.text("Principal", (2 * width) / 3, ySignature + 5);

    //  Render inline instead of opening new tab
    const pdfBlobUrl = doc.output("bloburl");
    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100vh";
    iframe.src = pdfBlobUrl;

    document.body.innerHTML = ""; // clear "Generating PDF..."
    document.body.appendChild(iframe);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="text-center mt-4">
      {certificate ? (
        <p>Generating PDF...</p>
      ) : (
        <p>Loading certificate data...</p>
      )}
    </div>
  );
};

export default CharacterCertificate;
