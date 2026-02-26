import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const StfDocumentUpload = () => {
  const navigate = useNavigate();

  // Filter states
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split("T")[0]);
  const [remarks, setRemarks] = useState("");

  // Document list state
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Upload states
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Dropdown options
  const [mentorOptions, setMentorOptions] = useState([]);

  // Get IDs from session/localStorage
  const orgId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
  const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");
  const userId = sessionStorage.getItem("userId"); // Logged-in staff user ID

  // Fetch mentors and auto-select logged-in staff (similar to UploadAssignments.js)
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        if (!orgId || !branchId) {
          console.error("Org ID or Branch ID missing");
          return;
        }

        const response = await api.get('Teacher/GetEmployeeList/', {
          params: {
            orgId: orgId,
            branchId: branchId,
          }
        });

        const data = response.data;
        if (data && data.data) {
          let formattedMentors = data.data.map((mentor) => ({
            value: mentor.id,
            label: mentor.employeeName,
          }));

          // Auto-select logged-in staff user
          if (userId) {
            const loggedInMentor = formattedMentors.find(m => String(m.value) === String(userId));
            if (loggedInMentor) {
              formattedMentors = [loggedInMentor];
              setSelectedMentor(loggedInMentor);
            }
          }

          setMentorOptions(formattedMentors);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };

    fetchMentors();
  }, [orgId, branchId, userId]);

  // Fetch documents based on filters (to be updated with new API)
  const fetchDocuments = async () => {
    try {
      setLoading(true);

      if (!orgId || !branchId) {
        alert("Missing organization or branch information.");
        return;
      }

      const params = {
        organization_id: orgId,
        branch_id: branchId,
        group_type: "EMPLOYEE", // Staff/Mentor documents
      };

      // Filter by logged-in staff (uploaded_by)
      if (userId) {
        params.uploaded_by = userId;
        params.employee_id = userId; // Also filter by employee_id
      }

      console.log("📄 Fetching documents with params:", params);

      const response = await api.get('Documents/files/', { params });
      const result = response.data;

      let docs = [];
      if (result.message === "success" && Array.isArray(result?.data)) {
        docs = result.data;
      } else if (Array.isArray(result)) {
        docs = result;
      }

      console.log(`✅ Fetched ${docs.length} documents`);

      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      alert("Failed to fetch documents: " + error.message);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };


  // Delete document
  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      await api.delete(`Documents/files/${docId}/`);
      alert("Document deleted successfully!");
      fetchDocuments(); // Refresh list
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document: " + error.message);
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

  // Upload document handler (using API utility with FormData)
  const handleUpload = async () => {
    // Validation
    if (!selectedMentor) {
      alert("Please select a mentor");
      return;
    }
    if (!uploadDate) {
      alert("Please select upload date");
      return;
    }
    if (!uploadFile) {
      alert("Please select a file to upload");
      return;
    }

    try {
      setUploading(true);

      // Validate file object
      if (!(uploadFile instanceof File)) {
        alert("Invalid file selected. Please select a file again.");
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("organization_id", orgId);
      formData.append("branch_id", branchId);
      formData.append("group_type", "EMPLOYEE"); // Staff/Mentor documents
      formData.append("employee_id", selectedMentor.value); // Mentor's employee ID

      // Add upload date and remarks if provided
      if (uploadDate) {
        formData.append("upload_date", uploadDate);
      }
      if (remarks) {
        formData.append("remarks", remarks);
      }

      // Add uploaded_by field with staff userId
      if (userId) {
        formData.append("uploaded_by", userId);
      }

      // Debug: Log FormData contents
      console.log("📤 Uploading document:");
      console.log("  - File:", uploadFile.name, "Size:", uploadFile.size, "Type:", uploadFile.type);
      console.log("  - Mentor:", selectedMentor.label);
      console.log("  - Upload Date:", uploadDate);
      console.log("  - Remarks:", remarks || "None");

      // Upload using API utility
      const response = await api.post('Documents/files/', formData);

      console.log("✅ Upload response:", response.data);
      alert("✅ Document uploaded successfully!");

      // Reset form
      setUploadDate(new Date().toISOString().split("T")[0]);
      setRemarks("");
      setUploadFile(null);

      // Reset file input
      const fileInput = document.getElementById("uploadFile");
      if (fileInput) fileInput.value = "";

      // Refresh documents list
      fetchDocuments();
    } catch (error) {
      console.error("❌ Error uploading document:", error);
      const errorMessage = error.response?.data?.message || error.message || "Upload failed";
      alert("❌ Failed to upload document: " + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setUploadDate(new Date().toISOString().split("T")[0]);
    setRemarks("");
    setUploadFile(null);
    // Reset file input
    const fileInput = document.getElementById("uploadFile");
    if (fileInput) fileInput.value = "";
    fetchDocuments(); // Reload all documents
  };

  const handleClose = () => {
    navigate("/staff/dashboard");
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
                    onClick={handleUpload}
                    disabled={uploading || !selectedMentor || !uploadDate || !uploadFile}
                  >
                    {uploading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Uploading...
                      </>
                    ) : (
                      "Upload"
                    )}
                  </button>
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
                    {/* Mentor Dropdown - Auto-selected and disabled */}
                    <div className="col-12 col-md-3 mb-3">
                      <label htmlFor="mentor" className="form-label">
                        Mentor<span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        id="mentor"
                        options={mentorOptions}
                        className="detail"
                        classNamePrefix="react-select"
                        placeholder="Select Mentor"
                        value={selectedMentor}
                        onChange={setSelectedMentor}
                        isDisabled={true} // Disabled for staff - auto-selected
                      />
                    </div>

                    {/* Upload Date */}
                    <div className="col-12 col-md-3 mb-3">
                      <label htmlFor="uploadDate" className="form-label">
                        Upload Date<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        id="uploadDate"
                        className="form-control detail"
                        value={uploadDate}
                        onChange={(e) => setUploadDate(e.target.value)}
                      />
                    </div>

                    {/* Remarks */}
                    <div className="col-12 col-md-3 mb-3">
                      <label htmlFor="remarks" className="form-label">
                        Remarks
                      </label>
                      <input
                        type="text"
                        id="remarks"
                        className="form-control detail"
                        placeholder="Enter remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        maxLength={255}
                      />
                    </div>

                    {/* File Upload */}
                    <div className="col-12 col-md-3 mb-3">
                      <label htmlFor="uploadFile" className="form-label">
                        Select Document<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="file"
                        id="uploadFile"
                        className="form-control detail"
                        onChange={(e) => setUploadFile(e.target.files[0])}
                        disabled={uploading || !selectedMentor}
                      />
                      {uploadFile && (
                        <small className="text-success mt-1 d-block">
                          ✓ {uploadFile.name}
                        </small>
                      )}
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
                        <th>Mentor</th>
                        <th>Date</th>
                        <th>Remarks</th>
                        <th>Attachment</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="text-center">
                            Loading...
                          </td>
                        </tr>
                      ) : documents.length > 0 ? (
                        documents.map((doc, index) => (
                          <tr key={doc.id || index}>
                            <td>{index + 1}</td>
                            <td>
                              {doc.mentor_name ||
                                doc.uploaded_by_name ||
                                "-"}
                            </td>
                            <td>
                              {doc.upload_date ||
                                doc.uploaded_at?.split('T')[0] ||
                                doc.created_at?.split('T')[0] ||
                                "-"}
                            </td>
                            <td>
                              {doc.remarks || "-"}
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
                                {doc.original_name || "Download"}
                              </a>
                            </td>
                            <td>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDelete(doc.id);
                                }}
                                style={{ color: "red", textDecoration: "underline", cursor: "pointer" }}
                              >
                                Delete
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
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

export default StfDocumentUpload;
