import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

import { ApiUrl } from "../../../ApiUrl";

const FeeCertificatePDF = () => {
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    const transferCertificateId = localStorage.getItem(
      "transfer_certificate_id"
    );
    const studentId = localStorage.getItem("studentId");
    const documentType = localStorage.getItem("documentType");

    if (documentType === "FC") {
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
   if (!certificate) {
     alert("Certificate data is missing!");
     return;
   }

   const doc = new jsPDF();

   try {
     // Add the logo (left side)
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

     // Add heading text (right side of the logo)
     const headingX = 50;
     const headingY = 15;
     doc.setFontSize(14);
     doc.setTextColor(0, 0, 255); // Blue
     doc.setFont("Helvetica", "bold");
     doc.text(
       "Sparsh College of Nursing and Allied Sciences", //  Updated heading
       headingX,
       headingY
     );

     // Add additional details in normal font
     doc.setFontSize(12);
     doc.setTextColor(0, 0, 0); // Black
     doc.setFont("Helvetica", "normal");
     doc.text("Affiliated to", headingX, headingY + 6);
     doc.text("Affiliation No.: School Code: SPARSH", headingX, headingY + 12);
     doc.text("Tel. No.:", headingX, headingY + 18);
     doc.text(
       "https://sparshhospitals.com/nursing-college-admission/",
       headingX,
       headingY + 24
     );

     // Add title below the image and details
     doc.setFontSize(16);
     doc.setFont("Helvetica", "bold");
     doc.setTextColor(0, 0, 0); // Black
     doc.text("TO WHOMSOEVER IT MAY CONCERN", 105, 50, { align: "center" });

     // Add date and reference number fields
     let yPositionForText = 70;
     doc.setFontSize(12);
     doc.setFont("Helvetica", "normal");
     doc.text(
       `No.: ${certificate.transfer_certificate_no_prefix}/${certificate.transfer_certificate_no_postfix}`,
       10,
       yPositionForText
     );
     doc.text(`Date: ${certificate.tc_applied_date}`, 200, yPositionForText, {
       align: "right",
     });

     // Add certificate content
     yPositionForText += 20; // Adjust vertical position
     doc.setFontSize(12);
     doc.setFont("Helvetica", "normal");
     doc.text(
       `This is to certify that ${certificate.studentname} S/D/o ${certificate.fathername} is studying in`,
       10,
       yPositionForText
     );

     // Add school name
     yPositionForText += 8;
     doc.setFont("Helvetica", "bold");
     doc.text(
       `${certificate.organizationName}, ${certificate.branchName}`,
       10,
       yPositionForText
     );
     doc.setFont("Helvetica", "normal");
     yPositionForText += 8;
     doc.text(
       `in CLASS - ${certificate.classname} (${certificate.sectionname})`,
       10,
       yPositionForText
     );

     // Add fee details
     yPositionForText += 12;
     doc.text(
       `His/Her Tuition Fee is Rs. ${
         certificate.tution_fees || "N/A"
       } for the period ${certificate.fee_period || "N/A"}.`,
       10,
       yPositionForText
     );

     // Add purpose of certificate
     yPositionForText += 12;
     doc.text(
       "This certificate is being issued to him/her on his/her request for Children",
       10,
       yPositionForText
     );
     yPositionForText += 8;
     doc.text("Education Allowance only.", 10, yPositionForText);

     // Add signature lines
     yPositionForText += 20;
     doc.text("(Checked by)", 10, yPositionForText);
     doc.text("(Prepared by)", 105, yPositionForText, { align: "center" });
     doc.text("PRINCIPAL", 200, yPositionForText, { align: "right" });

     // Generate PDF Blob and open it in a new tab
     const pdfBlob = doc.output("blob");
     const pdfUrl = URL.createObjectURL(pdfBlob); // Create a URL for the Blob
     window.open(pdfUrl, "_blank"); // Open the generated PDF in a new tab
   } catch (error) {
     console.error("Error generating PDF:", error);
     alert("An error occurred while generating the PDF.");
   }
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

export default FeeCertificatePDF;
