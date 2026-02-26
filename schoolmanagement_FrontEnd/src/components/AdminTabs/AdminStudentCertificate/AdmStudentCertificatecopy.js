import React from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ApiUrl } from "../../../ApiUrl";

function ExportToExcelButton() {
  const handleExportToExcel = async () => {
    try {
      // Retrieve values from localStorage
      const academicYearId = localStorage.getItem("academicSessionId");
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");

      // API URL
      const apiUrl = `${ApiUrl.apiurl}STUDENT_CERTIFICATE/GetStudentCertificates/?academic_year_id=${academicYearId}&orgId=${orgId}&branchId=${branchId}`;

      // Fetch API data
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (result.message !== "success") {
        throw new Error("Failed to fetch data");
      }

      const data = result.data;

      // Map documentType and status codes
      const documentTypeMap = {
        TC: "Transfer Certificate",
        BC: "Bonafide Certificate",
        CC: "Character Certificate",
        FE: "Fee Certificate",
      };

      const statusMap = {
        C: "Canceled",
        A: "Approved",
        N: "New",
      };

      // Prepare data for Excel
      const excelData = data.map((item, index) => ({
        "Sr.No": index + 1,
        "Document Type": documentTypeMap[item.documentType] || "Unknown",
        "Applied On": item.tc_applied_date,
        "Issued On": item.tc_issued_date || "Not Issued",
        "Document No": item.transfer_certificate_no,
        "Student Name": item.studentname,
        "School Admission No": item.school_admission_no,
        Class: item.classname,
        Section: item.sectionname,
        Reason: item.reason_for_tc || "N/A",
        Status: statusMap[item.status] || "Unknown",
      }));

      // Create a new workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Certificates");

      // Write the Excel file and trigger download
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, "StudentCertificates.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export data. Please try again.");
    }
  };

  return (
    <button
      type="button"
      className="btn btn-primary me-2"
      style={{
        width: "150px",
      }}
      onClick={handleExportToExcel}
    >
      Export to Excel
    </button>
  );
}

export default ExportToExcelButton;
