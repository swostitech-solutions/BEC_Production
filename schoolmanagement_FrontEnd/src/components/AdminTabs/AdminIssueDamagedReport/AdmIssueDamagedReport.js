import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import ReactPaginate from "react-paginate";

const AdmIssueDamagedReport = () => {
  const navigate = useNavigate();
  const statusOptions = [
    { value: "ALL", label: "ALL" },
    { value: "ACTIVE", label: "ACTIVE" },
    { value: "INACTIVE", label: "INACTIVE" },
    { value: "LOST", label: "LOST" },
    { value: "DAMAGED", label: "DAMAGED" },
  ];

  const [bookStatus, setBookStatus] = useState("ALL");
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

  const fetchData = (status) => {
    const url = `${ApiUrl.apiurl}LIBRARYBOOK/LostDamagedlist/?flag=${status}`;
    setLoading(true);
    setError(null);
    setCurrentPage(0);

    fetch(url)
      .then((response) => {
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
      .catch((fetchError) => {
        console.error("Error fetching data:", fetchError);
        setError(
          "Unable to fetch data. The server may be experiencing issues. Please try again later.",
        );
        setTableData([]);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    fetchData(bookStatus);
  };

  const handleClear = () => {
    setBookStatus("ALL");
    setTableData([]);
    setError(null);
    setCurrentPage(0);
  };

  const handleExportToExcel = () => {
    if (!tableData || tableData.length === 0) {
      alert("No data available to export!");
      return;
    }

    const exportData = tableData.map((book, index) => ({
      "Sr.No": index + 1,
      "Book Name": book.book_name,
      "Book Code": book.book_code,
      "Accession No.": book.barcode,
      Category: book.category,
      "Sub Category": book.subCategory,
      Publisher: book.publisher,
      "Author Name": book.author,
      "Accession Status": book.book_status,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Books");
    XLSX.writeFile(wb, "Accession_List_Report.xlsx");
  };

  React.useEffect(() => {
    fetchData("ALL");
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
                    onClick={handleExportToExcel}
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
                            Accession Status
                          </label>
                          <div className="flex-grow-1">
                            <Select
                              inputId="bookStatus"
                              name="bookStatus"
                              className="detail"
                              classNamePrefix="react-select"
                              options={statusOptions}
                              value={
                                statusOptions.find(
                                  (option) => option.value === bookStatus,
                                ) || statusOptions[0]
                              }
                              onChange={(selectedOption) =>
                                setBookStatus(
                                  selectedOption ? selectedOption.value : "ALL",
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
                        <th>Category</th>
                        <th>Sub Category</th>
                        <th>Publisher</th>
                        <th>Author Name</th>
                        <th>Accession Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="9" className="text-center py-4">
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            <p className="mt-2 mb-0">Loading data...</p>
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan="9" className="text-center py-4 text-danger">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {error}
                          </td>
                        </tr>
                      ) : tableData.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="text-center py-4">
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
                            <td>{book.category}</td>
                            <td>{book.subCategory}</td>
                            <td>{book.publisher}</td>
                            <td>{book.author}</td>
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
