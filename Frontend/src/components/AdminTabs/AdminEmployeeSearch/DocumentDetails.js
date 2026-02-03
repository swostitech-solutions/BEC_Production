import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";

const App = ({ goToTab, documentDetails, setRelationDetailsInParent }) => {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [tableData, setTableData] = useState([]);

  // Input field states
  const [formData, setFormData] = useState({
    srNo: "",
    documentType: "",
    documentNumber: "",
    documentFile: "",
    validFrom: "",
    validTo: "",
    enabled: false,
  });
  // const [relationDetails, setRelationDetails] = useState([]);

  useEffect(() => {
    console.log("DocumentDetails received from parent:", documentDetails);
    if (documentDetails?.length > 0) {
      const mappedData = documentDetails.map((doc, index) => ({
        srNo: index + 1,
        documentType: doc.document_type_id,
        documentNumber: doc.document_number,
        documentFile: doc.document_path,
        validFrom: doc.valid_from,
        validTo: doc.valid_to, // Fixed: backend returns valid_to not to_from
        enabled: doc.is_active,
      }));

      console.log("Mapped document data:", mappedData);

      // Load only the FIRST row into input form
      setFormData(mappedData[0] || {
        srNo: "",
        documentType: "",
        documentNumber: "",
        documentFile: "",
        validFrom: "",
        validTo: "",
        enabled: false,
      });

      // Show remaining rows in the table (excluding the first)
      setTableData(mappedData.slice(1));
      console.log("Document form data set to:", mappedData[0]);
      console.log("Document table data set to:", mappedData.slice(1));
    } else {
      console.log("No document details received or empty array");
    }
  }, [documentDetails]);



  useEffect(() => {
    fetch(`${ApiUrl.apiurl}DOCUMENT/GetAllDocumentList/`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Document Types API Response:", data); // Debug log
        if (data.message === "Success") {
          const formattedOptions = data.data.map((doc) => {
            console.log("Document item:", doc); // Debug each item
            return {
              value: doc.id,
              label: doc.document_desc, // Correct field name with underscore
            };
          });
          console.log("Formatted Options:", formattedOptions); // Debug final options
          setDocumentTypes(formattedOptions);
        }
      })
      .catch((error) => {
        console.error("Error fetching document types:", error);
      });
  }, []);



  const handleNextClick = async () => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      const userId = sessionStorage.getItem("userId");

      if (!employeeId || !userId) {
        alert("Employee ID or User ID not found.");
        return;
      }

      const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      const formattedDocuments = await Promise.all(
        tableData.map(async (doc) => {
          let base64File = "";
          let filename = "";

          if (typeof doc.documentFile === "string") {
            base64File = doc.documentFile;
          } else if (doc.documentFile) {
            base64File = await convertFileToBase64(doc.documentFile);
            filename = doc.documentFile.name;
          }

          return {
            document_type_id: doc.documentType,
            document_number: doc.documentNumber,
            document_file: base64File,
            filename: filename,
            valid_from: doc.validFrom,
            valid_to: doc.validTo,
            enabled: doc.enabled,
          };
        })
      );

      const payload = {
        created_by: userId,
        document_details: formattedDocuments,
      };

      // Step 1: Upload documents
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");

      const uploadUrl = `${ApiUrl.apiurl}STAFF/RegistrationDocumentUploadCreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`;
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const uploadText = await uploadResponse.text();
      let uploadResult = {};

      try {
        uploadResult = uploadText ? JSON.parse(uploadText) : {};
      } catch (err) {
        console.error("Failed to parse document upload response:", uploadText);
        alert("Invalid response from document upload API.");
        return;
      }

      if (
        !uploadResponse.ok ||
        uploadResult.message?.toLowerCase() !== "success"
      ) {
        console.warn("Document Upload Failed:", uploadResult);
        alert(uploadResult.message || "Document upload failed.");
        return;
      }

      console.log("Document Upload Response:", uploadResult);
      localStorage.setItem(
        "documentUploadResponse",
        JSON.stringify(uploadResult)
      );

      // Step 2: Fetch relation details  
      const empId = uploadResult.employee_id || employeeId;
      const relationUrl = `${ApiUrl.apiurl}STAFF/RegistrationRelationDetailsRetrieve/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${empId}`;
      const relationResponse = await fetch(relationUrl);

      //  Handle 204 No Content
      if (relationResponse.status === 204) {
        console.warn("Relation API returned 204 No Content");
        goToTab(3);
        return;
      }

      const relationText = await relationResponse.text();
      let relationResult = {};

      try {
        relationResult = relationText ? JSON.parse(relationText) : {};
      } catch (err) {
        console.error(
          "Failed to parse relation details response:",
          relationText
        );
        alert("Invalid response from relation details API.");
        return;
      }

      console.log("Relation Details Response:", relationResult);
      if (
        relationResponse.ok &&
        relationResult.message?.toLowerCase() === "success"
      ) {
        if (setRelationDetailsInParent) {
          setRelationDetailsInParent(relationResult.data);
        }

        goToTab(3);
      } else {
        alert(relationResult.message || "Failed to retrieve relation details.");
      }
    } catch (error) {
      console.error("Error in handleNextClick:", error);
      alert("An error occurred: " + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    const updatedValue =
      type === "checkbox" ? checked : type === "file" ? files[0] : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };

  const handleAddRow = () => {
    const newRow = { ...formData, srNo: tableData.length + 1 };

    setTableData([...tableData, newRow]); // Add at top
    // Clear input fields
    setFormData({
      srNo: "",
      documentType: "",
      documentNumber: "",
      documentFile: "",
      validFrom: "",
      validTo: "",
      enabled: false,
    });
  };

  const handleRemoveRow = (index) => {
    // Remove the row at the given index
    const updatedData = tableData.filter((_, i) => i !== index);

    // Update serial numbers
    const reNumberedData = updatedData.map((row, i) => ({
      ...row,
      srNo: i + 1,
    }));

    setTableData(reNumberedData);
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Document Type</th>
                <th>Document Number</th>
                <th>Document</th>
                <th>Valid From</th>
                <th>Valid To</th>
                <th>Enabled</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* Existing added rows */}
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.srNo}</td>
                  <td>
                    {
                      documentTypes.find(
                        (doc) =>
                          doc.value.toString() === row.documentType.toString()
                      )?.label
                    }
                  </td>
                  <td>{row.documentNumber}</td>
                  <td>
                    {typeof row.documentFile === "string" ? (
                      <a
                        href={row.documentFile}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {row.documentFile.split("/").pop()}
                      </a>
                    ) : (
                      row.documentFile?.name
                    )}
                  </td>

                  <td>{row.validFrom}</td>
                  <td>{row.validTo}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={row.enabled}
                      disabled
                      className="form-check-input"
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveRow(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}

              {/* Input row */}
              <tr>
                <td>{tableData.length + 1}</td>

                <td>
                  <select
                    className="form-select"
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    {documentTypes.map((doc) => (
                      <option key={doc.value} value={doc.value}>
                        {doc.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="documentNumber"
                    value={formData.documentNumber}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="file"
                    className="form-control"
                    name="documentFile"
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    className="form-control"
                    name="validFrom"
                    value={formData.validFrom}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    className="form-control"
                    name="validTo"
                    value={formData.validTo}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="enabled"
                    checked={formData.enabled}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <button className="btn btn-primary" onClick={handleAddRow}>
                    Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary border" onClick={handleNextClick}>
          Next
        </button>
      </div>
    </div>
  );
};

export default App;