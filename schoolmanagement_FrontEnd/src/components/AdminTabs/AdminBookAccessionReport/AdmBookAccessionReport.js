import React, { useState, useEffect, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";
import { ApiUrl } from "../../../ApiUrl"; // Import XLSX for Excel export
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

const AdmBookAccessionReport = () => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState([]);
  const [allData, setAllData] = useState([]); // Store all fetched data
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10; // Adjust as needed
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = useMemo(() => {
    return reportData.slice(offset, offset + itemsPerPage);
  }, [reportData, offset]);
  const pageCount = Math.ceil(reportData.length / itemsPerPage);

  // Fetch data when the page loads
  useEffect(() => {
    fetchData(); // Initial data fetch
  }, []);

  // Helper function to filter data by date range on the frontend
  const filterDataByDate = (data, from, to) => {
    if (!from && !to) return data;

    return data.filter(item => {
      // Use createdDate or created_at field from the response
      const itemDateStr = item.createdDate || item.created_at;
      if (!itemDateStr) return true; // Include items without date

      // Parse the item date (handle both date string formats)
      const itemDate = new Date(itemDateStr);
      itemDate.setHours(0, 0, 0, 0); // Reset time for comparison

      const fromDateObj = from ? new Date(from) : null;
      const toDateObj = to ? new Date(to) : null;

      if (fromDateObj) fromDateObj.setHours(0, 0, 0, 0);
      if (toDateObj) toDateObj.setHours(23, 59, 59, 999); // End of day

      if (fromDateObj && toDateObj) {
        return itemDate >= fromDateObj && itemDate <= toDateObj;
      } else if (fromDateObj) {
        return itemDate >= fromDateObj;
      } else if (toDateObj) {
        return itemDate <= toDateObj;
      }
      return true;
    });
  };

  // Fetch the report data (without date filters - we filter on frontend)
  const fetchData = async (applyDateFilter = false) => {
    const academicYearId = localStorage.getItem("academicSessionId") || "";

    // Fetch all data without date filters
    let apiUrl = `${ApiUrl.apiurl}LIBRARYBOOK/BookReportlist/?academic_year_id=${academicYearId}`;

    console.log("API URL:", apiUrl); // Debug log
    console.log("From Date:", fromDate, "To Date:", toDate); // Debug log

    setLoading(true);
    try {
      const response = await fetch(apiUrl);
      const result = await response.json();
      console.log("API Response:", result); // Debug log

      if (response.ok) {
        if (result.message === "success" && result.data) {
          setAllData(result.data); // Store all data

          // Apply date filter if requested
          if (applyDateFilter && (fromDate || toDate)) {
            const filteredData = filterDataByDate(result.data, fromDate, toDate);
            setReportData(filteredData);
            console.log("Filtered Data:", filteredData); // Debug log
            if (filteredData.length === 0) {
              alert("No data found for the selected date range");
            }
          } else {
            setReportData(result.data);
          }
          setCurrentPage(0);
        } else if (result.message === "No Record Found") {
          // Handle "No Record Found" response
          setAllData([]);
          setReportData([]);
          setCurrentPage(0);
          if (applyDateFilter) {
            alert("No records found");
          }
        } else {
          setAllData([]);
          setReportData([]);
          setCurrentPage(0);
        }
      } else {
        setAllData([]);
        setReportData([]);
        setCurrentPage(0);
        alert("Failed to fetch data. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      setAllData([]);
      setReportData([]); // Clear data on error
      setCurrentPage(0);
      alert("Error fetching data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger the search when the search button is clicked
  const handleSearch = () => {
    // Validate dates if both are provided
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      alert("From Date cannot be later than To Date");
      return;
    }

    // If we already have data, filter it locally; otherwise fetch new data
    if (allData.length > 0) {
      const filteredData = filterDataByDate(allData, fromDate, toDate);
      setReportData(filteredData);
      setCurrentPage(0);
      console.log("Filtered Data (local):", filteredData); // Debug log
      if (filteredData.length === 0 && (fromDate || toDate)) {
        alert("No data found for the selected date range");
      }
    } else {
      fetchData(true); // Fetch with date filter flag
    }
  };

  // Function to export table data to Excel
  const exportToExcel = () => {

    if (!reportData || reportData.length === 0) {
      alert("No data available to export!");
      return;
    }
    // Convert the report data to a format suitable for Excel
    const exportData = reportData.map((item, index) => ({
      "Sr.No": index + 1,
      "Book Name": item.book_name,
      "Book Code": item.book_code,
      "Accession No.": item.bookBarcode,
      "ISBN No": item.ISBN,
      "No. of Copies": item.no_of_copies,
      Category: item.book_category,
      "Sub Category": item.book_sub_category,
      Publisher: item.publisher,
      "Author Name": item.author,
      "Publish Year": item.publish_year,
      "Library Branch": item.library_branch,
    }));

    // Create a new workbook and append the data
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Accession Report");

    // Export the workbook as an Excel file
    XLSX.writeFile(wb, "accession_report.xlsx");
  };

  // Clear the input fields and report data
  const handleClear = () => {
    setFromDate(""); // Reset fromDate to empty
    setToDate(""); // Reset toDate to empty
    setReportData([]); // Clear the report data
    setCurrentPage(0); // Reset to first page
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
                ACCESSION LIST REPORT
              </p>

              <div className="row mb-4  mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSearch} // Trigger the search
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Search"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={exportToExcel} // Trigger Excel export
                  >
                    Export to Excel
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleClear} // Clear the data and input fields
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
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="from-date" className="form-label ">
                          From Date
                        </label>
                        <input
                          type="date"
                          id="from-date"
                          className="form-control detail"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)} // Update fromDate state
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
                          onChange={(e) => setToDate(e.target.value)} // Update toDate state
                        />
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
                        <th>Book Name</th>
                        <th>Book Code</th>
                        <th>Accession No.</th>
                        <th>ISBN No</th>
                        <th>No. of Copies</th>
                        <th>Category</th>
                        <th>Sub Category</th>
                        <th>Publisher</th>
                        <th>Author Name</th>
                        <th>Publish Year</th>
                        <th>Library Branch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                          <tr key={`${item.book_code}-${index}`}>
                            <td>{offset + index + 1}</td>
                            <td>{item.book_name}</td>
                            <td>{item.book_code}</td>
                            <td>{item.bookBarcode}</td>
                            <td>{item.ISBN}</td>
                            <td>{item.no_of_copies}</td>
                            <td>{item.book_category}</td>
                            <td>{item.book_sub_category}</td>
                            <td>{item.publisher}</td>
                            <td>{item.author}</td>
                            <td>{item.publish_year}</td>
                            <td>{item.library_branch}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="12" className="text-center">
                            No Data Available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {pageCount > 1 && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmBookAccessionReport;
