// import React from "react";
// import { jsPDF } from "jspdf";
// // import SynergyLogo from "../../../img/SynergyLogo.gif";


// const SchoolLeavingCertificate = () => {
//   const generatePDF = () => {
//     const doc = new jsPDF();

//     // Add the image to the PDF (left side)
//     const imgWidth = 30; // Width of the image
//     const imgHeight = 30; // Height of the image
//     const imgX = 10; // X position of the image
//     const imgY = 10; // Y position of the image
//     doc.addImage(SynergyLogo, "PNG", imgX, imgY, imgWidth, imgHeight);

//     // Add heading text in bold and color (right side of the image)
//     const headingX = 50; // X position for text on the right side
//     const headingY = 15; // Y position for text
//     doc.setFontSize(14);
//     doc.setTextColor(0, 0, 255); // Blue color
//     doc.setFont("Helvetica", "bold");
//     doc.text("SYNERGY INSTITUTE OF ENGINEERING & TECHNOLOGY", headingX, headingY);

//     // Add additional details in normal font (below heading)
//     doc.setFontSize(12);
//     doc.setTextColor(0, 0, 0); // Black color
//     doc.setFont("Helvetica", "normal");
//     doc.text("Affiliated to", headingX, headingY + 6);
//     doc.text("Affiliation No.:  School Code: SYNERGY", headingX, headingY + 12);
//     doc.text("Tel. No.:", headingX, headingY + 18);
//     doc.text("https://www.synergyinstitute.net/", headingX, headingY + 24);

//     // Add title below the image and details
//     doc.setFontSize(16);
//     doc.setFont("Helvetica", "bold");
//     doc.setTextColor(0, 0, 0); // Black color
//     doc.text("BONAFIDE CERTIFICATE", 105, 50, { align: "center" });

//     doc.setFont("Helvetica", "normal");
//     doc.setFontSize(12); // Smaller font size for this text
//     doc.text("TO WHOM IT MAY CONCERN", 105, 57, { align: "center" });

//     let yPositionForText = 70;
//     doc.setFontSize(12);
//     doc.setFont("Helvetica", "normal");
//     doc.text("No.: 1/2024-28", 10, yPositionForText);
//     doc.text("Date: 01/01/1900", 200, yPositionForText, { align: "right" });

//     // Add the main content text
//     let contentYPosition = yPositionForText + 10;
//     doc.text("This is to certify that Manish panda s/o d.panda and k.panda. Studying in Class BTech(Elec 2024-28)", 10, contentYPosition);
//     doc.text("is a bonafide student of our school. His residence is Cuttack, ROHTAK, HARYANA-123456. His Date of", 10, contentYPosition + 6);
//     doc.text("Birth is 06/03/2003 as per school record.", 10, contentYPosition + 12);

//     // Add space between the paragraphs (bottom margin)
//     const paragraphMargin = 5; // Adjust this value to increase or decrease the bottom margin
//     contentYPosition = contentYPosition + 18 + paragraphMargin; // Y position for the next paragraph

//     doc.text("He bears a good moral character.", 10, contentYPosition);

//     // Define top and bottom margin for this line
//     const topMargin = 15;  // Adjust this value to add space above the line
//     const bottomMargin = 15;  // Adjust this value to add space below the line

//     // Calculate Y position for the line with top margin
//     let lineYPosition = contentYPosition + topMargin;

//     // Add the line of text with paragraph margin
//     doc.text("This certificate is being issued on parent's request only", 10, lineYPosition);

//     // Adjust contentYPosition by adding bottom margin for subsequent text
//     contentYPosition = lineYPosition + bottomMargin;

//     // --- Add "Checked by" line with top and bottom margin ---
//     const checkedByTopMargin = 10;  // Top margin for "Checked by" line
//     const checkedByBottomMargin = 10;  // Bottom margin for "Checked by" line

//     // Calculate Y position for the "Checked by" line with top margin
//     const checkedByYPosition = contentYPosition + checkedByTopMargin;

//     // Add the "Checked by" text
//     doc.text("Checked by", 10, checkedByYPosition);

//     // Adjust contentYPosition by adding bottom margin for subsequent text after "Checked by"
//     contentYPosition = checkedByYPosition + checkedByBottomMargin;

//     // --- Add "Authorized Signatory" text on the right ---
//     const authorizedSignatoryTopMargin = 10;  // Top margin for "Authorized Signatory"
//     const authorizedSignatoryBottomMargin = 10;  // Bottom margin for "Authorized Signatory"

//     const authorizedSignatoryYPosition = contentYPosition + authorizedSignatoryTopMargin;

//     doc.setFont("Helvetica", "bold");
//     doc.text("Authorized Signatory", 200, authorizedSignatoryYPosition, { align: "right" });

//     contentYPosition = authorizedSignatoryYPosition + authorizedSignatoryBottomMargin;

//     // Open PDF in a new tab
//     window.open(doc.output("bloburl"), "_blank");
//   };

//   return (
//     <div className="text-center mt-4">
//       <button className="btn btn-secondary btn-sm" onClick={generatePDF}>
//         View PDF
//       </button>
//     </div>
//   );
// };

// export default SchoolLeavingCertificate;

import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

import { ApiUrl } from "../../../ApiUrl";

const SchoolLeavingCertificate = () => {
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    // Fetch certificate data using transfer_certificate_id, studentId, and documentType from localStorage
    const transferCertificateId = localStorage.getItem(
      "transfer_certificate_id"
    );
    const studentId = localStorage.getItem("studentId");
    const documentType = localStorage.getItem("documentType");

    if (documentType === "BC") {
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

  const generatePDF = () => {
    if (!certificate) return; // If data is not loaded yet, do nothing

    const doc = new jsPDF();

    // Add the image to the PDF (left side)
    const imgWidth = 30;
    const imgHeight = 30;
    const imgX = 10;
    const imgY = 10;
    doc.addImage(
      "/Assets/sparsh.jpeg",
      "JPEG",
      imgX,
      imgY,
      imgWidth,
      imgHeight
    );

    // Add heading text in bold and color (right side of the image)
    const headingX = 50;
    const headingY = 15;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 255); // Blue color
    doc.setFont("Helvetica", "bold");
    doc.text(
      "Sparsh College of Nursing and Allied Sciences", //  Updated heading
      headingX,
      headingY
    );

    // Add additional details in normal font (below heading)
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    doc.setFont("Helvetica", "normal");
    doc.text("Affiliated to", headingX, headingY + 6);
    doc.text(`Affiliation No.: School Code: SPARSH`, headingX, headingY + 12);
    doc.text("Tel. No.:", headingX, headingY + 18);
    doc.text(
      "https://sparshhospitals.com/nursing-college-admission/",
      headingX,
      headingY + 24
    );

    // Add title below the image and details
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(0, 0, 0); // Black color
    doc.text("BONAFIDE CERTIFICATE", 105, 50, { align: "center" });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12); // Smaller font size for this text
    doc.text("TO WHOM IT MAY CONCERN", 105, 57, { align: "center" });

    let yPositionForText = 70;
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    doc.text(
      `No.: ${certificate.transfer_certificate_no_prefix}-${certificate.transfer_certificate_no_postfix}`,
      10,
      yPositionForText
    );
    doc.text(
      `Date: ${certificate.tc_issued_date || "01/01/1900"}`,
      200,
      yPositionForText,
      { align: "right" }
    );

    // Add the main content text
    // Add the main content text as a single line
    let contentYPosition = yPositionForText + 10;
    const contentText = `This is to certify that ${certificate.studentname} s/o ${certificate.fathername} and ${certificate.mothername}. Studying in Class ${certificate.classname} (${certificate.sectionname}).`;

    doc.text(contentText, 10, contentYPosition);

    doc.text(
      `is a bonafide student of our school. His residence is ${certificate.resident_address}.`,
      10,
      contentYPosition + 12
    );
    doc.text(
      `His Date of Birth is ${certificate.dob} as per school record.`,
      10,
      contentYPosition + 18
    );

    // Add space between the paragraphs (bottom margin)
    const paragraphMargin = 5;
    contentYPosition = contentYPosition + 18 + paragraphMargin;

    doc.text("He bears a good moral character.", 10, contentYPosition);

    // Add line text with margin
    const topMargin = 15;
    const bottomMargin = 15;
    let lineYPosition = contentYPosition + topMargin;
    doc.text(
      "This certificate is being issued on parent's request only",
      10,
      lineYPosition
    );

    contentYPosition = lineYPosition + bottomMargin;

    // Add "Checked by" line
    const checkedByTopMargin = 10;
    const checkedByBottomMargin = 10;
    const checkedByYPosition = contentYPosition + checkedByTopMargin;
    doc.text("Checked by", 10, checkedByYPosition);
    contentYPosition = checkedByYPosition + checkedByBottomMargin;

    // Add "Authorized Signatory" text on the right
    const authorizedSignatoryTopMargin = 10;
    const authorizedSignatoryBottomMargin = 10;
    const authorizedSignatoryYPosition =
      contentYPosition + authorizedSignatoryTopMargin;
    doc.setFont("Helvetica", "bold");
    doc.text("Authorized Signatory", 200, authorizedSignatoryYPosition, {
      align: "right",
    });

    contentYPosition =
      authorizedSignatoryYPosition + authorizedSignatoryBottomMargin;

    // Open PDF in a new tab
    window.open(doc.output("bloburl"), "_blank");
  };

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

export default SchoolLeavingCertificate;
