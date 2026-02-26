import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import ReactPaginate from "react-paginate";

// Import xlsx library

const AdmIssueDamagedReport = () => {
  const navigate = useNavigate();
  const [bookStatus, setBookStatus] = useState("both");
  const [tableData, setTableData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const offset = currentPage * itemsPerPage;
  const currentItems = tableData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(tableData.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Function to fetch data based on book status
  const fetchData = (status) => {
    const url = `${ApiUrl.apiurl}LIBRARYBOOK/LostDamagedlist/?flag=${status}`;
    setLoading(true);
    setError(null);

    fetch(url)
      .then((response) => {
        // Check if response is OK (status 200-299)
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "success") {
          setTableData(data.data);
        } else {
          setTableData([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Unable to fetch data. The server may be experiencing issues. Please try again later.");
        setTableData([]);
        setLoading(false);
      });
  };

  // Handle the Search button click
  const handleSearch = () => {
    if (bookStatus === "both") {
      fetchData("b"); // both
    } else if (bookStatus === "lost") {
      fetchData("l"); // lost
    } else if (bookStatus === "damaged") {
      fetchData("d"); // damaged
    }
  };

  // Handle the Export to Excel button click
  const handleExportToExcel = () => {

    if (!tableData || tableData.length === 0) {
      alert("No data available to export!");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(tableData); // Convert table data to worksheet
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Books"); // Append worksheet to the workbook

    // Write the workbook to an Excel file
    XLSX.writeFile(wb, "Accession_List_Report.xlsx");
  };

  // Initial data fetch for 'both' book status
  React.useEffect(() => {
    fetchData("b");
  }, []);

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
                Lost/Damaged Report
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
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
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleExportToExcel} // Export to Excel functionality
                  >
                    Export to Excel
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={() => setTableData([])} // Clear table data
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

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-center justify-content-center">
                    <div className="row flex-grow-1 justify-content-center">
                      <div className="col-md-4 mb-5 mt-5">
                        <div className="d-flex align-items-center">
                          <label
                            htmlFor="bookStatus"
                            className="form-label me-3 mb-0"
                            style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
                          >
                            Book Status
                          </label>
                          <div className="flex-grow-1">
                            <Select
                              inputId="bookStatus"
                              name="bookStatus"
                              className="detail"
                              classNamePrefix="react-select"
                              options={[
                                { value: "both", label: "BOTH" },
                                { value: "lost", label: "LOST" },
                                { value: "damaged", label: "DAMAGED" },
                              ]}
                              value={{
                                value: bookStatus,
                                label: bookStatus.toUpperCase(),
                              }}
                              onChange={(selectedOption) =>
                                setBookStatus(
                                  selectedOption ? selectedOption.value : ""
                                )
                              }
                              isSearchable={false}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered ">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Book Name</th>
                        <th>Book Code</th>
                        <th>Accession No.</th>
                        <th>ISBN No</th>
                        <th>Category</th>
                        <th>Sub Category</th>
                        <th>Publisher</th>
                        <th>Author Name</th>
                        <th>Publish Year</th>
                        <th>Library Branch</th>
                        <th>Book Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="12" className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2 mb-0">Loading data...</p>
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan="12" className="text-center py-4 text-danger">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {error}
                          </td>
                        </tr>
                      ) : tableData.length === 0 ? (
                        <tr>
                          <td colSpan="12" className="text-center py-4">
                            No records found
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((book, index) => (
                          <tr key={book.id}>
                            <td>{offset + index + 1}</td>
                            <td>{book.book_name}</td>
                            <td>{book.book_code}</td>
                            <td>{book.barcode}</td>
                            <td>{book.isbnNo}</td>
                            <td>{book.category}</td>
                            <td>{book.subCategory}</td>
                            <td>{book.publisher}</td>
                            <td>{book.author}</td>
                            <td>{book.publish_year}</td>
                            <td>{book.library_branch}</td>
                            <td>{book.book_status}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
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

export default AdmIssueDamagedReport;
