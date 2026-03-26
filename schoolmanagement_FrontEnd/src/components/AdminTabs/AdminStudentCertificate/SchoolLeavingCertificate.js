
import React, { useEffect } from "react";
import { jsPDF } from "jspdf";
import { ApiUrl } from "../../../ApiUrl";

const SchoolLeavingCertificate = () => {
  useEffect(() => {
    const fetchAndShowPDF = async () => {
      const transferCertificateId = localStorage.getItem(
        "transfer_certificate_id"
      );
      const studentId = localStorage.getItem("studentId");
      const documentType = localStorage.getItem("documentType");

      const response = await fetch(
        `${ApiUrl.apiurl}STUDENT_CERTIFICATE/GetCertificatePDF/?transfer_certificate_id=${transferCertificateId}&studentId=${studentId}&documentType=${documentType}`
      );
      const data = await response.json();

      if (data?.message === "success" && data?.data?.length > 0) {
        const certificate = data.data[0];
        const doc = new jsPDF();

        doc.addImage("/Assets/sparsh.jpeg", "JPEG", 10, 10, 30, 30);
        doc.setFontSize(14);
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(0, 0, 255);
        doc.text("Sparsh College of Nursing and Allied Sciences", 50, 15);
        doc.setFontSize(12);
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text("Affiliated to", 50, 21);
        doc.text("Affiliation No.: School Code: SPARSH", 50, 27);
        doc.text("Tel. No.:", 50, 33);
        doc.text(
          "https://sparshhospitals.com/nursing-college-admission/",
          50,
          39
        );
        doc.setFontSize(16);
        doc.text("School Leaving Certificate", 105, 50, { align: "center" });

        const tcNumber = `${certificate.transfer_certificate_no_prefix}/${certificate.transfer_certificate_no_postfix}`;
        doc.setFontSize(10);
        doc.text("Admission No.: 8307246237", 10, 60);
        doc.text("SRN: ", 105, 60, { align: "center" });
        doc.text(`TC No.: ${tcNumber}`, 200, 60, { align: "right" });

        const details = [
          { key: "1. Name of Pupil", value: certificate.studentname },
          { key: "2. Father's Name", value: certificate.fathername },
          { key: "3. Mother's Name", value: certificate.mothername },
          { key: "4. Nationality", value: certificate.nationality },
          { key: "5. Category", value: certificate.category },
          {
            key: "6. Date of Admission",
            value: certificate.school_admission_date,
          },
          { key: "7. Date of Birth", value: certificate.dob },
          {
            key: "8. Class Last Studied",
            value: certificate.student_last_studied,
          },
          {
            key: "9. Board Exam Result",
            value: certificate.school_board_last_taken,
          },
          { key: "10. Whether Failed", value: certificate.whether_failed },
          { key: "11. Subjects Studied", value: certificate.subjects_studied },
          {
            key: "12. Qualified for Promotion",
            value: certificate.qualified_for_promotion,
          },
          {
            key: "13. Month upto which fees paid",
            value: certificate.month_fee_paid,
          },
          {
            key: "14. Fee Concession",
            value: certificate.fee_concession_availed,
          },
          {
            key: "15. Total Working Days",
            value: certificate.total_no_working_days,
          },
          {
            key: "16. Days Present",
            value: certificate.total_no_working_days_present,
          },
          { key: "17. NCC Details", value: certificate.ncc_cadet_details },
          {
            key: "18. Extra Activities",
            value: certificate.games_played_details,
          },
          { key: "19. Conduct", value: certificate.general_conduct },
          {
            key: "20. Date of Application",
            value: certificate.tc_applied_date,
          },
          { key: "21. Date of Issue", value: certificate.tc_issued_date },
          { key: "22. Reason for Leaving", value: certificate.reason_for_tc },
          { key: "23. Other Remarks", value: certificate.other_remarks },
        ];

        let y = 70;
        details.forEach((item) => {
          const lines = doc.splitTextToSize(
            `${item.key}: ${item.value || "N/A"}`,
            180
          );
          doc.text(lines, 10, y);
          y += lines.length * 6;
        });

        doc.text("Principal", 180, y + 10);

        const pdfBlobUrl = doc.output("bloburl");
        window.location.href = pdfBlobUrl;
      }
    };

    fetchAndShowPDF();
  }, []);

  return null; // No UI needed
};

export default SchoolLeavingCertificate;
