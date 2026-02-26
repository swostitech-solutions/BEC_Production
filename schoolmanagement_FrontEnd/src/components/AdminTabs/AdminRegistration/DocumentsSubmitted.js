import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./AdmOtherDetails.css";
import { ApiUrl } from "../../../ApiUrl";

const AdmOtherDetails = ({ formData, setFormData }) => {
  const { id } = useParams();
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize documentsDetails if not already set
  useEffect(() => {
    if (!formData.documentsDetails || formData.documentsDetails.length === 0) {
      setFormData((prevData) => ({
        ...prevData,
        documentsDetails: [
          {
            document_no: "",
            document_type: "",
            document_pic: "",
            start_from: "",
            end_to: "",
          },
        ],
      }));
    }
  }, [formData, setFormData]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        // ✅ Get organization_id and branch_id from sessionStorage
        const organization_id = sessionStorage.getItem("organization_id") || 1;
        const branch_id = sessionStorage.getItem("branch_id") || 1;
        const token = localStorage.getItem("accessToken"); // ✅ token

        // ✅ Construct the new API URL
        const apiUrl = `${ApiUrl.apiurl}StudentRegistrationApi/GetStudentDetailsBasedOnId/?organization_id=${organization_id}&branch_id=${branch_id}&student_id=${id}`;

        console.log("📡 Fetching Document Details from:", apiUrl);

        // ✅ Main API call with token
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data?.data?.documents_details) {
          const documentsDetails = await Promise.all(
            data.data.documents_details.map(async (doc) => {
              // ✅ Use absolute URL if only relative path provided
              const previewUrl =
                doc.document_url || `${ApiUrl.apiurl}${doc.document_pic || ""}`;

              let base64Preview = "";

              if (previewUrl) {
                try {
                  // ✅ Fetch document file with token
                  const fileRes = await fetch(previewUrl, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });

                  // ✅ Check if file exists before processing
                  if (fileRes.ok) {
                    const blob = await fileRes.blob();

                    // ✅ Convert image blob to base64 for preview
                    base64Preview = await new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.onloadend = () => resolve(reader.result);
                      reader.readAsDataURL(blob);
                    });

                    // ✅ Store file info in sessionStorage
                    sessionStorage.setItem("document_pic_base64", base64Preview);
                    sessionStorage.setItem(
                      "document_pic_name",
                      doc.document_type || "document"
                    );
                    sessionStorage.setItem("document_pic_type", blob.type);
                  } else {
                    console.warn(
                      `⚠️ Document file not found (${fileRes.status}): ${previewUrl}`
                    );
                  }
                } catch (err) {
                  console.warn("⚠️ Failed to load document_pic:", err);
                }
              }

              return {
                document_no: doc.document_no || "",
                document_type: doc.document_type || "",
                document_url:
                  doc.document_url && doc.document_url.startsWith("http")
                    ? doc.document_url
                    : doc.document_pic
                    ? `${ApiUrl.apiurl.replace(/\/$/, "")}${doc.document_pic}`
                    : "",
                preview_url:
                  doc.document_url && doc.document_url.startsWith("http")
                    ? doc.document_url
                    : doc.document_pic
                    ? `${ApiUrl.apiurl.replace(/\/$/, "")}${doc.document_pic}`
                    : "",
                start_from: doc.start_from || "",
                end_to: doc.end_to || "",
              };
            })
          );

          // ✅ Update formData with processed documents
          setFormData((prev) => ({
            ...prev,
            documentsDetails,
          }));
        }
      } catch (err) {
        console.error("❌ Error fetching student details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStudentDetails();
  }, [id]);

  // Fetch document types
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Access token not found in localStorage.");
          setError("Unauthorized: Missing access token.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${ApiUrl.apiurl}DOCUMENT/GetAllDocumentList/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ Added token
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data?.message === "Success" && Array.isArray(data.data)) {
          setDocumentTypes(data.data);
        } else {
          console.error("Unexpected data format:", data);
          setDocumentTypes([]);
        }
      } catch (error) {
        console.error("Error fetching document types:", error);
        setError("Failed to fetch document types.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentTypes();
  }, []);

  const handleAddRow = () => {
    const incompleteDocuments = formData.documentsDetails.filter(
      (doc) => !doc.document_no
    );
    // if (incompleteDocuments.length > 0) {
    //   alert(
    //     "Please fill in all required fields (Document No) for documents before adding a new one."
    //   );
    //   return;
    // }

    setFormData((prev) => ({
      ...prev,
      documentsDetails: [
        ...prev.documentsDetails,
        {
          document_no: "",
          document_type: "",
          document_pic: "",
          start_from: "",
          end_to: "",
        },
      ],
    }));
  };

  const handleRemoveRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      documentsDetails: prev.documentsDetails.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (index, field, value) => {
    const updatedDocs = [...formData.documentsDetails];

    if (field === "document_type") {
      // If user changes document type and document_no is filled, reset document_no
      if (updatedDocs[index].document_no) {
        updatedDocs[index].document_no = "";
      }
    }

    updatedDocs[index][field] = value;

    setFormData((prev) => ({ ...prev, documentsDetails: updatedDocs }));
  };

  //new code 07242025
  // const handleFileChange = (index, file) => {
  //   const updatedDocs = [...formData.documentsDetails];

  //   // Store the uploaded file
  //   updatedDocs[index]["document_pic"] = file;

  //   // Create a persistent preview URL (for images or download/view link)
  //   updatedDocs[index]["preview_url"] = URL.createObjectURL(file);

  //   // Update the formData state
  //   setFormData((prev) => ({
  //     ...prev,
  //     documentsDetails: updatedDocs,
  //   }));
  // };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Allow only image and PDF files
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, JPEG, PNG, and PDF files are allowed.");

      // ❌ Clear file input
      e.target.value = "";
      return;
    }

    // ✅ Max file size: 500 KB
    const maxSize = 500 * 1024; // 500 KB in bytes
    if (file.size > maxSize) {
      alert("File size must not exceed 500 KB.");

      // ❌ Clear file input
      e.target.value = "";
      return;
    }

    const updatedDocs = [...formData.documentsDetails];

    // ✅ Store valid file
    updatedDocs[index]["document_pic"] = file;

    // ✅ Create preview URL
    updatedDocs[index]["preview_url"] = URL.createObjectURL(file);

    // ✅ Update state
    setFormData((prev) => ({
      ...prev,
      documentsDetails: updatedDocs,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = new FormData();
    formData.documentsDetails.forEach((doc, index) => {
      payload.append(`documents[${index}][document_no]`, doc.document_no);
      payload.append(`documents[${index}][document_type]`, doc.document_type);
      payload.append(`documents[${index}][start_from]`, doc.start_from);
      payload.append(`documents[${index}][end_to]`, doc.end_to);
      if (doc.document_pic) {
        payload.append(`documents[${index}][document_pic]`, doc.document_pic);
      }
    });

    fetch("your_api_endpoint", {
      method: "POST",
      body: payload,
    })
      .then((response) => response.json())
      .then((data) => console.log("Success:", data))
      .catch((error) => console.error("Error:", error));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="container-fluid form-container">
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>
                Document Type<span className="red-text">*</span>
              </th>
              <th>
                Document No.<span className="red-text">*</span>
              </th>
              <th>
                Upload Document<span className="red-text">*</span>
              </th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(formData.documentsDetails) &&
            formData.documentsDetails.length > 0 ? (
              formData.documentsDetails.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <select
                      value={row.document_type || ""}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "document_type",
                          e.target.value
                        )
                      }
                      required
                    >
                      <option value="">Select Document Type</option>
                      {documentTypes.map((docType) => (
                        <option key={docType.id} value={docType.document_desc}>
                          {docType.document_desc}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.document_no}
                      maxLength={
                        row.document_type === "Aadhaar card"
                          ? 12
                          : row.document_type === "Pan Card"
                          ? 10
                          : 100
                      }
                      onChange={(e) => {
                        const inputValue = e.target.value.toUpperCase();

                        if (row.document_type === "Aadhaar card") {
                          // ✅ Aadhaar validation: only digits, up to 12
                          if (/^\d{0,12}$/.test(inputValue)) {
                            handleInputChange(index, "document_no", inputValue);
                          }
                        } else if (row.document_type === "Pan Card") {
                          // ✅ PAN validation: 5 letters + 4 digits + 1 letter
                          if (
                            /^[A-Z]{0,5}[0-9]{0,4}[A-Z]{0,1}$/.test(inputValue)
                          ) {
                            handleInputChange(index, "document_no", inputValue);
                          }
                        } else {
                          // ✅ Generic: accept all text
                          handleInputChange(index, "document_no", inputValue);
                        }
                      }}
                      placeholder={
                        row.document_type === "Aadhaar card"
                          ? "Enter 12-digit Aadhaar number"
                          : row.document_type === "Pan Card"
                          ? "Enter 10-char PAN (e.g. ABCDE1234F)"
                          : "Enter Document Number"
                      }
                      disabled={!row.document_type} // 🔒 disable until document type selected
                      style={{
                        backgroundColor: !row.document_type
                          ? "#f5f5f5"
                          : "white",
                        cursor: !row.document_type ? "not-allowed" : "text",
                      }}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, application/pdf"
                      // onChange={(e) =>
                      //   handleFileChange(index, e.target.files[0])
                      // }
                      onChange={(e) => handleFileChange(index, e)}
                    />
                    {row.preview_url && (
                      <div className="mt-2">
                        <a
                          href={row.preview_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Uploaded File
                        </a>
                      </div>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleRemoveRow(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", color: "#888" }}>
                  No document records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-primary add-row"
          onClick={handleAddRow}
        >
          Add New Row
        </button>
      </div>
    </form>
  );
};

export default AdmOtherDetails;
