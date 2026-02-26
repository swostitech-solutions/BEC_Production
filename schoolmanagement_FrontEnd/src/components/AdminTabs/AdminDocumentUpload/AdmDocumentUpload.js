import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { ApiUrl } from "../../../ApiUrl";

// Robust date formatting function
const formatDate = (dateString) => {
  // Return "-" if dateString is falsy, empty, or not a string/number
  if (!dateString || (typeof dateString !== "string" && typeof dateString !== "number")) {
    return "-";
  }

  // Convert to string if it's a number
  const dateStr = String(dateString).trim();
  
  // Return "-" if empty after trimming
  if (!dateStr || dateStr === "null" || dateStr === "undefined") {
    return "-";
  }

  try {
    // Parse the date
    const date = new Date(dateStr);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString);
      return "-";
    }

    // Format the date with error handling
    const formatted = date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    // Double check if formatting failed
    if (!formatted || formatted === "Invalid Date") {
      // Fallback to simple format
      const fallback = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      return fallback;
    }

    return formatted;
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "-";
  }
};

const AdmDocumentUpload = () => {
  const navigate = useNavigate();

  // Filter states
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  // Document list state
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dropdown options
  const [teacherOptions, setTeacherOptions] = useState([]);

  // Get IDs from session/localStorage (prefilled)
  const orgId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
  const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");

  // Fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        if (!orgId || !branchId) {
          console.warn("Missing org/branch IDs");
          return;
        }

        const response = await fetch(
          `${ApiUrl.apiurl}Teacher/GetEmployeeList/?orgId=${orgId}&branchId=${branchId}`
        );
        const data = await response.json();
        if (data && data.data) {
          const formatted = data.data.map((teacher) => ({
            value: teacher.id,
            label: teacher.employeeName,
          }));
          setTeacherOptions(formatted);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, [orgId, branchId]);

  // Fetch documents based on filters
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      if (!orgId) {
        alert("Missing organization information.");
        return;
      }

      const params = {
        organization_id: orgId,
      };
      
      // Add teacher filter (using uploaded_by or teacher_id)
      if (selectedTeacher?.value) {
        params.uploaded_by = selectedTeacher.value;
        params.teacher_id = selectedTeacher.value;
      }
      
      // Add date range filters
      if (fromDate) params.from_date = fromDate;
      if (toDate) params.to_date = toDate;

      const response = await api.get('Documents/files/', { params });
      const result = response.data;

      let docs = [];
      if (Array.isArray(result?.data)) {
        docs = result.data;
      } else if (Array.isArray(result)) {
        docs = result;
      }

      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      alert("Failed to fetch documents: " + error.message);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };


  // View/Download document
  const handleViewDocument = async (doc) => {
    try {
      const fileName = doc.original_name || "document";
      const mimeType = doc.mime_type || "application/octet-stream";

      // Option 1: Use base64 data if available
      if (doc.file_data_base64) {
        try {
          const base64Data = doc.file_data_base64;
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mimeType });

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.target = "_blank";
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 100);
          return;
        } catch (base64Error) {
          console.warn("Failed to handle base64 data, trying download endpoint:", base64Error);
        }
      }

      // Option 2: Use download endpoint
      if (doc.id) {
        const response = await api.get(`Documents/files/${doc.id}/download/`, {
          responseType: 'blob'
        });

        const blob = response.data;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    } catch (error) {
      console.error("Error viewing document:", error);
      alert("Failed to view document: " + error.message);
    }
  };

  const handleClear = () => {
    setSelectedTeacher(null);
    setFromDate("");
    setToDate("");
    fetchDocuments(); // Reload all documents
  };

  const handleClose = () => {
    navigate("/admin/dashboard");
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
                ACADEMICS DOCUMENTS UPLOAD
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={fetchDocuments}
                  >
                    Display
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
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="row flex-grow-1 p-2 mt-3 mb-3">
                    {/* Teacher Dropdown */}
                    <div className="col-12 col-md-4 mb-3">
                      <label htmlFor="teacher" className="form-label">
                        Teacher
                      </label>
                      <Select
                        id="teacher"
                        options={teacherOptions}
                        className="detail"
                        classNamePrefix="react-select"
                        placeholder="Select Teacher"
                        value={selectedTeacher}
                        onChange={setSelectedTeacher}
                        isClearable
                      />
                    </div>

                    {/* From Date */}
                    <div className="col-12 col-md-4 mb-3">
                      <label htmlFor="fromDate" className="form-label">
                        From Date
                      </label>
                      <input
                        type="date"
                        id="fromDate"
                        className="form-control detail"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                    </div>

                    {/* To Date */}
                    <div className="col-12 col-md-4 mb-3">
                      <label htmlFor="toDate" className="form-label">
                        To Date
                      </label>
                      <input
                        type="date"
                        id="toDate"
                        className="form-control detail"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Table */}
              <div className="col-12 mt-3">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Teacher Name</th>
                        <th>Created At</th>

                        <th>View Attachment</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="text-center">
                            Loading...
                          </td>
                        </tr>
                      ) : documents.length > 0 ? (
                        documents.map((doc, index) => {
                          // Get created_at or updated_at from response
                          const createdAtValue = doc.created_at || doc.updated_at || null;
                          
                          return (
                            <tr key={doc.id || index}>
                              <td>{index + 1}</td>
                              <td>
                                {doc.uploaded_by_name || 
                                 doc.teacher_name || 
                                 doc.employeeName ||
                                 doc.user?.name ||
                                 "-"}
                              </td>
                              <td>
                                {formatDate(createdAtValue)}
                              </td>
                              <td>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleViewDocument(doc);
                                  }}
                                  style={{ color: "blue", textDecoration: "underline" }}
                                  title={doc.original_name}
                                >
                                  {doc.original_name || "View"}
                                </a>
                              </td>
                              <td>
                                {doc.remarks || doc.remark || "-"}
                              </td>
                          
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No documents found.
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
  );
};

export default AdmDocumentUpload;
