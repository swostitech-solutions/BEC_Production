import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import "jspdf-autotable";
import dayjs from "dayjs";
import Select from "react-select";


const AdmAttendanceEntry = () => {
  const [visitorData, setVisitorData] = useState([]);
  const [name, setName] = useState("");
  const [whomToMeet, setWhomToMeet] = useState("");
  const [phone, setPhone] = useState("");

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
  const [visitors, setVisitors] = useState([]);


  const navigate = useNavigate();
  const dateRef = useRef(null);
  const fromClassRef = useRef(null);
  const toClassRef = useRef(null);
  const admissionNoRef = useRef(null);

  const handleClear = () => {
    setName("");
    setWhomToMeet("");
    setPhone("");
    // Reset to today's date instead of empty
    const today = getTodayDate();
    setFromDate(today);
    setToDate(today);
    // Fetch today's data (add 1 day to to_date for inclusive range)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    fetchVisitors({ from_date: today, to_date: tomorrowStr });
  };


  const handleNewClick = () => {
    navigate("/admin/new-visitor");
  };

  const fetchVisitors = async (filters = {}) => {
    // Retrieve mandatory fields from sessionStorage with fallback defaults
    const orgId = sessionStorage.getItem("organization_id") || "1";
    const branchId = sessionStorage.getItem("branch_id") || "1";

    const params = new URLSearchParams({
      organization_id: orgId,
      branch_id: branchId,
      ...filters,
    });

    try {
      const token = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${ApiUrl.apiurl}Visitor/list/?${params.toString()}`,
        {
          headers: headers,
        }
      );

      // Handle 204 No Content (no visitors found)
      if (response.status === 204) {
        setVisitorData([]);
        return;
      }

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        alert(`Error loading visitors: ${response.status} - ${response.statusText}`);
        return;
      }

      const result = await response.json();
      console.log("Visitor List API Response:", result);
      if (result.message === "success") {
        console.log("Setting visitor data:", result.data);
        setVisitorData(result.data || []);
      } else {
        console.error("API returned non-success:", result);
        setVisitorData([]);
      }
    } catch (error) {
      console.error("Error fetching visitor data:", error);
      alert("Failed to load visitors. Please check console for details.");
    }
  };

  useEffect(() => {
    // Load today's data on page open
    const today = getTodayDate();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    fetchVisitors({ from_date: today, to_date: tomorrowStr });
  }, []);

  const handleSearch = () => {
    const filters = {};
    if (name) filters.visitor_name = name;
    if (whomToMeet) filters.whom_to_visit = whomToMeet;
    if (phone) filters.phone = phone;
    if (fromDate) filters.from_date = fromDate;

    // Add 1 day to to_date to make it inclusive (backend timezone issue)
    if (toDate) {
      const toDateObj = new Date(toDate);
      toDateObj.setDate(toDateObj.getDate() + 1);
      const adjustedToDate = toDateObj.toISOString().split('T')[0];
      filters.to_date = adjustedToDate;
    }

    fetchVisitors(filters);
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";

    try {
      // Parse time string (format: HH:MM:SS or HH:MM:SS.ffffff)
      let time = timeString.includes(".") ? timeString.split(".")[0] : timeString;

      // If it includes 'T' it's a full datetime
      if (timeString.includes("T")) {
        return dayjs(timeString).format("hh:mm:ss A");
      }

      // Parse the time parts
      const [hours, minutes, seconds] = time.split(":");
      let hour = parseInt(hours, 10);
      const minute = minutes;
      const second = seconds;

      // Add 5 hours 30 minutes to convert UTC to IST
      hour = hour + 5;
      let extraMinutes = 30;
      let totalMinutes = parseInt(minute) + extraMinutes;

      if (totalMinutes >= 60) {
        hour = hour + 1;
        totalMinutes = totalMinutes - 60;
      }

      if (hour >= 24) {
        hour = hour - 24;
      }

      // Convert to 12-hour format
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      const displayMinute = String(totalMinutes).padStart(2, '0');

      return `${displayHour}:${displayMinute}:${second} ${period}`;
    } catch (error) {
      return timeString; // Return original if parsing fails
    }
  };

  // Already imported
  const handleMarkOut = async (visitorId) => {
    // Get current local time as ISO datetime string with timezone offset
    const now = new Date();
    // Format: YYYY-MM-DDTHH:MM:SS+05:30 (for IST)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+05:30`;

    try {
      const token = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${ApiUrl.apiurl}Visitor/update/?visitor_id=${visitorId}`,
        {
          method: "PUT",
          headers: headers,
          body: JSON.stringify({
            out_time: currentTime,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Mark Out Response:", data);

        alert("Visitor marked out successfully!");

        // ✅ Preserve current filters when refreshing data
        const currentFilters = {};
        if (name) currentFilters.visitor_name = name;
        if (whomToMeet) currentFilters.whom_to_visit = whomToMeet;
        if (phone) currentFilters.phone = phone;
        // Always include date filters with +1 day to to_date for inclusive range
        currentFilters.from_date = fromDate;
        if (toDate) {
          const toDateObj = new Date(toDate);
          toDateObj.setDate(toDateObj.getDate() + 1);
          const adjustedToDate = toDateObj.toISOString().split('T')[0];
          currentFilters.to_date = adjustedToDate;
        }

        console.log("Refreshing with filters:", currentFilters);
        // Refresh table with current filters maintained
        fetchVisitors(currentFilters);

      } else {
        const errorData = await response.json();
        console.error("Failed to mark out:", errorData);
        alert("Failed to mark out visitor.");
      }
    } catch (error) {
      console.error("Error while marking out:", error);
      alert("Error while marking out visitor.");
    }
  };

  const handleDelete = async (visitorId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this visitor record?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${ApiUrl.apiurl}Visitor/delete/${visitorId}/`,
        {
          method: "DELETE",
          headers: headers,
        }
      );

      if (response.ok) {
        // Remove from local state
        setVisitorData(visitorData.filter((item) => item.visitor_id !== visitorId));
        alert("Visitor deleted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to delete:", errorData);
        alert("Failed to delete visitor.");
      }
    } catch (error) {
      console.error("Error deleting visitor:", error);
      alert("Error deleting visitor.");
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
                SEARCH VISITORS
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
                    New visitors
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

              {/* feild data */}
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
                        <label htmlFor="name" className="form-label">
                          Name
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="name"
                            className="form-control detail"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="whom-to-meet" className="form-label">
                          Whom To Meet
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="whom-to-meet"
                            className="form-control detail"
                            placeholder="Enter whom to meet"
                            value={whomToMeet}
                            onChange={(e) => setWhomToMeet(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="phone" className="form-label">
                          phone
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="phone-number"
                            className="form-control detail"
                            placeholder="Enter phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
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
                        <label htmlFor="To-date" className="form-label">
                          To Date
                        </label>
                        <input
                          type="date"
                          id="To-date"
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



              {/* Table data */}
              <div className="row">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>Sr.No</th>
                          <th>Name</th>
                          <th>Purpose Of Visit</th>
                          <th>Whom To Visit</th>
                          <th>Department</th>
                          <th>Phone</th>
                          <th>Email</th>
                          <th>Address</th>
                          <th>Vehicle No.</th>
                          <th>Visit Date </th>
                          <th>In Time</th>
                          <th>Photo</th>
                          <th>Out Time</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visitorData.length === 0 ? (
                          <tr>
                            <td colSpan="14" className="text-center text-danger">
                              No record found
                            </td>
                          </tr>
                        ) : (
                          visitorData.map((visitor, index) => (
                            <tr key={visitor.visitor_id}>
                              <td>{index + 1}</td>
                              <td>{visitor.visitor_name || "N/A"}</td>
                              <td>{visitor.purpose_of_visit || "N/A"}</td>
                              <td>{visitor.whom_to_visit || "N/A"}</td>
                              <td>{visitor.department || "N/A"}</td>
                              <td>{visitor.phone || "N/A"}</td>
                              <td>{visitor.email || "N/A"}</td>
                              <td>{visitor.address || "N/A"}</td>
                              <td>{visitor.vehicle_no || "N/A"}</td>
                              <td>{visitor.visit_date || "N/A"}</td>
                              <td>{formatTime(visitor.InTime) || "N/A"}</td>
                              <td>
                                {visitor.image ? (
                                  <img
                                    src={
                                      visitor.image.startsWith("http") || visitor.image.startsWith("https")
                                        ? visitor.image
                                        : `data:image/jpeg;base64,${visitor.image}`
                                    }
                                    alt="visitor"
                                    style={{ width: "50px", height: "50px" }}
                                  />
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td>
                                {visitor.outTime ? (
                                  formatTime(visitor.outTime)
                                ) : (
                                  <button
                                    className="btn btn-link p-0"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleMarkOut(visitor.visitor_id);
                                    }}
                                  >
                                    Mark Out
                                  </button>
                                )}
                              </td>
                              <td>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(visitor.visitor_id);
                                  }}
                                  className="text-danger"
                                >
                                  Delete
                                </a>
                              </td>
                            </tr>
                          ))
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

export default AdmAttendanceEntry;
