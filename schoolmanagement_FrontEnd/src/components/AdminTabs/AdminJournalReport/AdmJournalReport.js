import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";// Import XLSX for exporting to Excel
import ReactPaginate from "react-paginate";

const AdmJournalReport = () => {
  // State to store fetched journal data
  const [journalData, setJournalData] = useState([]);
  const navigate = useNavigate();
  const itemsPerPage = 10; // Change as needed
  const [currentPage, setCurrentPage] = useState(0);



  const pageCount = Math.ceil(journalData.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = journalData.slice(offset, offset + itemsPerPage);

  // Fetch data from API when the component mounts
  useEffect(() => {
    const fetchJournalData = async () => {
      try {
        // Retrieve academicSessionId from local storage
        const academicSessionId = localStorage.getItem("academicSessionId");

        if (!academicSessionId) {
          console.error("Academic Session ID not found in local storage");
          return;
        }

        // Construct the API URL with the academic year ID
        const apiUrl = `${ApiUrl.apiurl}LIBRARYBOOK/GetAllJournalList/${academicSessionId}`;

        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.message === "success") {
          setJournalData(result.data); // Set the data to the state
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchJournalData();
  }, []);
  // Empty dependency array means this will run once when the component mounts

  // Function to export data to Excel
  const exportToExcel = () => {

    if (!journalData || journalData.length === 0) {
      alert("No data available to export!");
      return;
    }
    // Convert the table data to a format suitable for Excel export
    const exportData = journalData.map((journal, index) => ({
      "Sr.No": index + 1,
      "Name Of Journal": journal.BookName,
      ISSN: journal.ISBN,
      Publisher: journal.publisher,
      "Volume No.": journal.volume,
      "Issue No.": journal.IssueNo,
      Periodical: journal.Period,
      "No. of Copies": journal.no_of_copies,
      Status: journal.book_status,
    }));

    // Create a new workbook and append the data
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Journals Data");

    // Export the workbook as an Excel file
    XLSX.writeFile(wb, "journal_report.xlsx");
  };

  const handleClear = () => {
    setJournalData([]); // Clear the table data
    // You can add additional states here to reset if there are form inputs like bookTitle, bookAuthor, etc.
  };

  return (
    <div className="container-fluid ">
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
                JOURNAL REPORT
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={exportToExcel} // Attach the export function to the button
                  >
                    Export to Excel
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

              
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Name Of Journal</th>
                        <th>ISSN</th>
                        <th>Publisher</th>
                        <th>Volume No.</th>
                        <th>Issue No.</th>
                        <th>Periodical</th>
                        <th>No. of Copies</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((journal, index) => (
                          <tr key={journal.id}>
                            <td>{offset + index + 1}</td>
                            <td>{journal.BookName || "-"}</td>
                            <td>{journal.ISBN || "-"}</td>
                            <td>{journal.publisher || "-"}</td>
                            <td>{journal.volume ?? "-"}</td>
                            <td>{journal.IssueNo || "-"}</td>
                            <td>{journal.Period || "-"}</td>
                            <td>{journal.no_of_copies ?? "-"}</td>
                            <td>{journal.book_status || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center">
                            No Data Available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
        

              {pageCount >= 1 && (
                <div className="d-flex justify-content-center mt-3">
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmJournalReport;
