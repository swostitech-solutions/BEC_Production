import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";

const AdmMOUList = () => {
  const navigate = useNavigate();
  const [mouData, setMouData] = useState([]);

  // Get today's date in YYYY-MM-DD format (local timezone)
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [fromDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getTodayDate());

  const orgId = sessionStorage.getItem("organization_id") || "1";
  const branchId = sessionStorage.getItem("branch_id") || "1";

  useEffect(() => {
    // Load today's data on page open
    fetchMouDetails({ from_date: getTodayDate(), to_date: getTodayDate() });
  }, []);

  const fetchMouDetails = async (filters = {}) => {
    try {
      const params = new URLSearchParams({
        ...filters,
      });

      let url = `${ApiUrl.apiurl}MOU/MouDetailsList/${orgId}/${branchId}/?${params.toString()}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.message === "success") {
        setMouData(data.data);
      }
    } catch (error) {
      console.error("Error fetching MOU details:", error);
    }
  };

  const handleClear = () => {
    setFromDate(getTodayDate());
    setToDate(getTodayDate());
    // Fetch today's data after clearing
    fetchMouDetails({ from_date: getTodayDate(), to_date: getTodayDate() });
  };

  const handleSearch = () => {
    const filters = {};
    if (fromDate) filters.from_date = fromDate;
    if (toDate) filters.to_date = toDate;

    fetchMouDetails(filters);
  };

  const handleNewClick = () => {
    navigate("/admin/new-mou");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}MOU/deleteMouDetails/${id}/`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setMouData(mouData.filter((item) => item.mou_id !== id));
        alert("MOU record deleted successfully!");
      } else {
        console.error("Failed to delete record.");
        alert("Failed to delete MOU record.");
      }
    } catch (error) {
      console.error("Error deleting MOU detail:", error);
      alert("Error deleting MOU record.");
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";

    try {
      // Remove microseconds if present (e.g., 18:53:53.213000 -> 18:53:53)
      let time = timeString.includes(".") ? timeString.split(".")[0] : timeString;

      // Parse the time (format: HH:MM:SS)
      const [hours, minutes, seconds] = time.split(":");
      let hour = parseInt(hours, 10);
      const minute = minutes;
      const second = seconds;

      // Convert to 12-hour format
      const period = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12; // Convert 0 to 12 for midnight, and 13-23 to 1-11

      return `${hour}:${minute}:${second} ${period}`;
    } catch (error) {
      return timeString; // Return original if parsing fails
    }
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
                SEARCH MOUs
              </p>
              <div className="row mb-3 mt-3">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleNewClick}
                  >
                    New MOU
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={handleSearch}
                    style={{
                      width: "150px",
                    }}
                  >
                    Search
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

              {/* Filter Section */}
              <div className="row p-2">
                <div
                  className="col-12 p-2"
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    background: "white",
                  }}
                >
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="from-date" className="form-label">
                          From Date
                        </label>
                        <input
                          type="date"
                          id="from-date"
                          className="form-control detail"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          onKeyDown={(e) => e.preventDefault()}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="to-date" className="form-label">
                          To Date
                        </label>
                        <input
                          type="date"
                          id="to-date"
                          className="form-control detail"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          onKeyDown={(e) => e.preventDefault()}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="row">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>Sr.No</th>
                          <th>MOU Date</th>
                          <th>MOU Time</th>
                          <th>Details</th>
                          <th>Document</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mouData.length > 0 ? (
                          mouData.map((item, index) => (
                            <tr key={item.mou_id}>
                              <td>{index + 1}</td>
                              <td>{item.mou_date || "N/A"}</td>
                              <td>{formatTime(item.mou_time) || "N/A"}</td>
                              <td>{item.mou_details}</td>
                              <td>
                                <a
                                  href={item.doc_url}
                                  download={item.doc_name}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View
                                </a>
                              </td>
                              <td>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(item.mou_id);
                                  }}
                                  className="text-danger"
                                >
                                  Delete
                                </a>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center text-danger">
                              No record found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmMOUList;
