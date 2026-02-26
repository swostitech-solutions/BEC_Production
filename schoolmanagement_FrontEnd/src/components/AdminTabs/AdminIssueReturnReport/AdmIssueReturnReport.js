import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";
import { ApiUrl } from "../../../ApiUrl"; // Import xlsx library
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

const AdmIssueReturnReport = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [filterFlag, setFilterFlag] = useState("A"); // Default to "All"
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const offset = currentPage * itemsPerPage;
  const currentItems = tableData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(tableData.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Function to fetch data based on filters
  const fetchData = () => {
    let url = `${ApiUrl.apiurl}LIBRARYBOOK/GetIssueReturnSearchList?flag=${filterFlag}`;

    if (fromDate) url += `&fromDate=${fromDate}`;
    if (toDate) url += `&toDate=${toDate}`;
    if (registrationNo) url += `&registrationNo=${registrationNo}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success") {
          setTableData(data.data);
        } else {
          setTableData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setTableData([]);
      });
  };

  // Handle the Search button click
  const handleSearch = () => {
    setCurrentPage(0); // Reset to first page when searching
    fetchData();
  };

  // Function to export table data to an Excel file
  const handleExportToExcel = () => {
    if (tableData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(tableData); // Convert JSON data to a worksheet
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Issue_Return_Report"); // Append worksheet to the workbook

    // Export the workbook to an Excel file
    XLSX.writeFile(wb, "Issue_Return_Report.xlsx");
  };


  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setRegistrationNo("");
    setFilterFlag("A"); // Reset to "All"
    setTableData([]); // Clear table data
    setCurrentPage(0); // Reset pagination
  };

  // Handle filter change and auto-trigger search
  const handleFilterChange = (value) => {
    setFilterFlag(value);
    setCurrentPage(0); // Reset to first page
    // Auto-trigger search after a short delay to ensure state is updated
    setTimeout(() => {
      let url = `${ApiUrl.apiurl}LIBRARYBOOK/GetIssueReturnSearchList?flag=${value}`;
      if (fromDate) url += `&fromDate=${fromDate}`;
      if (toDate) url += `&toDate=${toDate}`;
      if (registrationNo) url += `&registrationNo=${registrationNo}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "success") {
            setTableData(data.data);
          } else {
            setTableData([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setTableData([]);
        });
    }, 100);
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
                ISSUE RETURN REPORT
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleExportToExcel}
                  >
                    Export to Excel
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    style={{ width: "150px" }}
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{ width: "150px" }}
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="row mt-2">
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
                      <label htmlFor="to-date" className="form-label">
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
                      <label htmlFor="regn-number" className="form-label">
                        Regn Number
                      </label>
                      <input
                        type="text"
                        id="regn-number"
                        className="form-control detail"
                        placeholder="Enter regn number"
                        value={registrationNo}
                        onChange={(e) => setRegistrationNo(e.target.value)}
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-3 mt-3">
                      <div className="d-flex flex-wrap">
                        <div className="form-check me-3">
                          <input
                            className="form-check-input details"
                            type="radio"
                            name="filterFlag"
                            id="all"
                            value="A"
                            checked={filterFlag === "A"}
                            onChange={(e) => handleFilterChange(e.target.value)}
                          />
                          <label
                            className="form-check-label mt-3"
                            htmlFor="all"
                          >
                            All
                          </label>
                        </div>
                        <div className="form-check me-3">
                          <input
                            className="form-check-input details"
                            type="radio"
                            name="filterFlag"
                            id="issued"
                            value="I"
                            checked={filterFlag === "I"}
                            onChange={(e) => handleFilterChange(e.target.value)}
                          />
                          <label
                            className="form-check-label mt-3"
                            htmlFor="issued"
                          >
                            Issued
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input details"
                            type="radio"
                            name="filterFlag"
                            id="returned"
                            value="R"
                            checked={filterFlag === "R"}
                            onChange={(e) => handleFilterChange(e.target.value)}
                          />
                          <label
                            className="form-check-label mt-3"
                            htmlFor="returned"
                          >
                            Return
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Name</th>
                        <th>Admission No</th>
                        <th>Student BarCode</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Book Accession No</th>
                        <th>Issue Date</th>
                        <th>Issued By</th>
                        <th>Return Date</th>
                        <th>Returned By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((book, index) => (
                          <tr key={index}>
                            <td>{offset + index + 1}</td>
                            <td>{book.studentName}</td>
                            <td>{book.admissionNo}</td>
                            <td>{book.schoolBarcode}</td>
                            <td>{book.bookName}</td>
                            <td>{book.authorName}</td>
                            <td>{book.barcode}</td>
                            <td>{book.issueDate}</td>
                            <td>{book.IssuesBy}</td>
                            <td>{book.returnDate}</td>
                            <td>{book.ReturnedBy}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="11" className="text-center">
                            No records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {pageCount > 1 && (
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
    </div>
  );
};

export default AdmIssueReturnReport;
