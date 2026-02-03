import React, { useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";

const AdmNewMOU = () => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [mouDetails, setMouDetails] = useState("");
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);

  const orgId = sessionStorage.getItem("organization_id") || "1";
  const branchId = sessionStorage.getItem("branch_id") || "1";

  const validateFields = () => {
    const newErrors = {};

    if (!mouDetails.trim()) {
      newErrors.mouDetails = "MOU Details are required";
    }

    if (!uploadedFile) {
      newErrors.uploadedFile = "Please upload a file";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClear = () => {
    setMouDetails("");
    setUploadedFile(null);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!validateFields()) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const userId = sessionStorage.getItem("userId") || "1";

      if (!orgId || !branchId || !userId) {
        alert("Missing required details. Please check storage values.");
        return;
      }

      const formData = new FormData();
      formData.append("created_by", userId);
      formData.append("org_id", orgId);
      formData.append("branch_id", branchId);
      formData.append("mou_details", mouDetails);
      // Add current date and time when saving
      formData.append("mou_date", new Date().toISOString());
      formData.append("upload_file", uploadedFile);

      const response = await fetch(`${ApiUrl.apiurl}MOU/Moucreate/`, {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        alert("MOU saved successfully!");
        navigate("/admin/mou-list");
      } else {
        const errorMsg = responseData.error
          ? JSON.stringify(responseData.error)
          : "Unknown error";
        alert(`Failed to save MOU: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error saving MOU data:", error);
      alert("An error occurred while saving MOU.");
    }
  };

  const handleClose = () => {
    navigate("/admin/mou-list");
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card p-2">
            <div className="card-body">
              <p
                className="text-center fw-bold mb-3"
                style={{ fontSize: "20px" }}
              >
                NEW MOU ENTRY
              </p>

              {/* Buttons Section */}
              <div className="col-12 mb-3">
                <button
                  type="button"
                  className="btn btn-primary me-2"
                  style={{
                    width: "150px",
                  }}
                  onClick={handleSave}
                >
                  Save
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
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>

              {/* Form Section */}
              <div
                className="d-flex justify-content-center"
                style={{
                  border: "1px solid #ccc",
                  marginTop: "10px",
                  padding: "15px",
                  backgroundColor: "#EEF5FF",
                }}
              >
                <div
                  className="form-wrapper"
                  style={{ width: "100%", maxWidth: "600px" }}
                >
                  <form className="row">
                    {/* MOU Details Field */}
                    <div className="col-12 d-flex align-items-center mb-3 justify-content-center">
                      <label
                        className="me-3 text-end"
                        style={{ minWidth: "160px", fontWeight: "500" }}
                      >
                        MOU Details <span style={{ color: "red" }}>*</span>
                      </label>
                      <div style={{ width: "60%" }}>
                        <input
                          type="text"
                          className="form-control detail"
                          placeholder="Enter MOU details"
                          value={mouDetails}
                          onChange={(e) => setMouDetails(e.target.value)}
                        />
                        {errors.mouDetails && (
                          <small className="text-danger">
                            {errors.mouDetails}
                          </small>
                        )}
                      </div>
                    </div>

                    {/* Upload File Field */}
                    <div className="col-12 d-flex align-items-center mb-3 justify-content-center">
                      <label
                        className="me-3 text-end"
                        style={{ minWidth: "160px", fontWeight: "500" }}
                      >
                        Upload File <span style={{ color: "red" }}>*</span>
                      </label>
                      <div style={{ width: "60%" }}>
                        <input
                          type="file"
                          className="form-control detail"
                          accept="*/*"
                          onChange={(e) => setUploadedFile(e.target.files[0])}
                          ref={fileInputRef}
                        />
                        {errors.uploadedFile && (
                          <small className="text-danger">
                            {errors.uploadedFile}
                          </small>
                        )}
                        {uploadedFile && (
                          <small className="text-success d-block mt-1">
                            Selected: {uploadedFile.name}
                          </small>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmNewMOU;
