import React, { useEffect, useState } from "react";
const PreviousEducationDetails = ({
  formData,
  setFormData,
  submitErrors = {},
}) => {
  const [dateOrderErrors, setDateOrderErrors] = useState({});
  const [rowErrors, setRowErrors] = useState({});
  const [addRowError, setAddRowError] = useState("");

  useEffect(() => {
    if (!Array.isArray(formData.previousEducationDetails) || formData.previousEducationDetails.length === 0) {
      setFormData((prev) => ({
        ...prev,
        previousEducationDetails: [
          {
            nameofschool: "",
            location: "",
            class_completed: "",
            year_from: "",
            year_to: "",
            language_of_instruction: "",
            transfer_certificate: "",
            result: "",
          },
        ],
      }));
    }
  }, [formData.previousEducationDetails, setFormData]);

  const previousEducation = formData.previousEducationDetails?.length
    ? formData.previousEducationDetails
    : [
        {
          nameofschool: "",
          location: "",
          class_completed: "",
          year_from: "",
          year_to: "",
          language_of_instruction: "",
          transfer_certificate: "",
          result: "",
        },
      ];
  const updateParent = (rows) => {
    setFormData((prev) => ({
      ...prev,
      previousEducationDetails: rows,
    }));
  };

  const validateDateOrder = (row) => {
    if (!row?.year_from || !row?.year_to) return "";
    const fromDate = new Date(row.year_from);
    const toDate = new Date(row.year_to);
    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
      return "";
    }
    if (toDate < fromDate) {
      return "Years Attended To must be greater than or equal to Years Attended From";
    }
    return "";
  };

  const validateRequiredFields = (row) => {
    const errors = {};
    if (!row?.nameofschool || String(row.nameofschool).trim() === "") {
      errors.nameofschool = "This field is required";
    }
    if (!row?.year_from || String(row.year_from).trim() === "") {
      errors.year_from = "This field is required";
    }
    if (!row?.year_to || String(row.year_to).trim() === "") {
      errors.year_to = "This field is required";
    }
    return errors;
  };

  const validateRow = (row) => {
    const errors = validateRequiredFields(row);
    const dateError = validateDateOrder(row);
    if (dateError) {
      errors.year_to = dateError;
    }
    return errors;
  };

  const handleAddRow = () => {
    const updatedRowErrors = {};
    let hasError = false;

    previousEducation.forEach((row, index) => {
      const errors = validateRow(row);
      if (Object.keys(errors).length > 0) {
        updatedRowErrors[index] = errors;
        hasError = true;
      }
    });

    setRowErrors(updatedRowErrors);

    if (hasError) {
      setAddRowError("Complete required fields before adding a new row.");
      return;
    }

    setAddRowError("");

    const rows = [
      ...previousEducation,
      {
        nameofschool: "",
        location: "",
        class_completed: "",
        year_from: "",
        year_to: "",
        language_of_instruction: "",
        transfer_certificate: "",
        result: "",
        isNew: true,
      },
    ];
    updateParent(rows);
  };
  const handleRemoveRow = (index) => {
    const row = previousEducation[index];
    if (!row?.isNew) {
      alert("Only newly added rows can be removed.");
      return;
    }
    const rows = previousEducation.filter((_, i) => i !== index);
    const reorderedRowErrors = {};
    Object.keys(rowErrors).forEach((key) => {
      const rowIndex = Number(key);
      if (rowIndex < index) {
        reorderedRowErrors[rowIndex] = rowErrors[rowIndex];
      }
      if (rowIndex > index) {
        reorderedRowErrors[rowIndex - 1] = rowErrors[rowIndex];
      }
    });

    const reorderedDateErrors = {};
    Object.keys(dateOrderErrors).forEach((key) => {
      const rowIndex = Number(key);
      if (rowIndex < index) {
        reorderedDateErrors[rowIndex] = dateOrderErrors[rowIndex];
      }
      if (rowIndex > index) {
        reorderedDateErrors[rowIndex - 1] = dateOrderErrors[rowIndex];
      }
    });

    setRowErrors(reorderedRowErrors);
    setDateOrderErrors(reorderedDateErrors);
    updateParent(rows);
  };
  const handleInputChange = (index, field, value) => {
    const rows = previousEducation.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    const rowError = validateDateOrder(rows[index]);
    setDateOrderErrors((prev) => ({
      ...prev,
      [index]: rowError,
    }));

    const requiredErrors = validateRequiredFields(rows[index]);
    setRowErrors((prev) => ({
      ...prev,
      [index]: requiredErrors,
    }));

    setAddRowError("");
    updateParent(rows);
  };

  const handleFieldBlur = (index, field) => {
    const row = previousEducation[index] || {};
    const value = row[field];

    if (!value || String(value).trim() === "") {
      setRowErrors((prev) => ({
        ...prev,
        [index]: {
          ...(prev[index] || {}),
          [field]: "This field is required",
        },
      }));
      return;
    }

    setRowErrors((prev) => {
      const next = { ...prev };
      if (!next[index]) return next;
      const nextRow = { ...next[index] };
      delete nextRow[field];
      next[index] = nextRow;
      return next;
    });
  };
  return (
    <div className="container-fluid form-container">
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>
                Name Of School <span className="red-text">*</span>
              </th>
              <th>Location</th>
              <th>Class Completed</th>
              <th>
                Years Attended From <span className="red-text">*</span>
              </th>
              <th>
                Years Attended To <span className="red-text">*</span>
              </th>
              <th>Language of Instruction</th>
              <th>Transfer Certificate Provided</th>
              <th>Result</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {(previousEducation.length === 0 ? [0] : previousEducation).map(
              (row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {/* :white_check_mark: Name Of School - Only letters and spaces */}
                  <td>
                    <input
                      type="text"
                      value={row?.nameofschool || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        ); // only letters & spaces
                        handleInputChange(index, "nameofschool", value);
                      }}
                      onBlur={() => handleFieldBlur(index, "nameofschool")}
                      required
                    />
                    {submitErrors.previousEducationDetails?.[index]?.nameofschool && (
                      <small style={{ color: "red" }}>
                        {submitErrors.previousEducationDetails[index].nameofschool}
                      </small>
                    )}
                    {!submitErrors.previousEducationDetails?.[index]?.nameofschool &&
                      rowErrors[index]?.nameofschool && (
                        <small style={{ color: "red" }}>
                          {rowErrors[index].nameofschool}
                        </small>
                      )}
                  </td>
                  {/* :white_check_mark: Location - Only letters and spaces */}
                  <td>
                    <input
                      type="text"
                      value={row?.location || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        );
                        handleInputChange(index, "location", value);
                      }}
                    />
                  </td>
                  {/* :white_check_mark: Class Completed - Only digits */}
                  <td>
                    <input
                      type="text"
                      value={row?.class_completed || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                        handleInputChange(index, "class_completed", value);
                      }}
                      maxLength={2} // optional limit, can be adjusted
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={row?.year_from || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const year = value.split("-")[0];
                        if (year.length > 4) return;
                        handleInputChange(index, "year_from", value);
                      }}
                      onBlur={() => handleFieldBlur(index, "year_from")}
                    />
                    {submitErrors.previousEducationDetails?.[index]?.year_from && (
                      <small style={{ color: "red" }}>
                        {submitErrors.previousEducationDetails[index].year_from}
                      </small>
                    )}
                    {!submitErrors.previousEducationDetails?.[index]?.year_from &&
                      rowErrors[index]?.year_from && (
                        <small style={{ color: "red" }}>
                          {rowErrors[index].year_from}
                        </small>
                      )}
                  </td>
                  <td>
                    <input
                      type="date"
                      value={row?.year_to || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const year = value.split("-")[0];
                        if (year.length > 4) return; // Restrict year typing
                        handleInputChange(index, "year_to", value);
                      }}
                      onBlur={() => handleFieldBlur(index, "year_to")}
                    />
                    {submitErrors.previousEducationDetails?.[index]?.year_to && (
                      <small style={{ color: "red" }}>
                        {submitErrors.previousEducationDetails[index].year_to}
                      </small>
                    )}
                    {!submitErrors.previousEducationDetails?.[index]?.year_to &&
                      rowErrors[index]?.year_to && (
                        <small style={{ color: "red" }}>
                          {rowErrors[index].year_to}
                        </small>
                      )}
                    {!submitErrors.previousEducationDetails?.[index]?.year_to &&
                      !rowErrors[index]?.year_to &&
                      dateOrderErrors[index] && (
                        <small style={{ color: "red" }}>
                          {dateOrderErrors[index]}
                        </small>
                      )}
                  </td>
                  {/* :white_check_mark: Language of Instruction - Only letters and spaces */}
                  <td>
                    <input
                      type="text"
                      value={row?.language_of_instruction || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        );
                        handleInputChange(
                          index,
                          "language_of_instruction",
                          value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <select
                      value={row?.transfer_certificate || ""}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "transfer_certificate",
                          e.target.value
                        )
                      }
                      style={{ width: "200px" }}
                    >
                      <option value="">Select</option>
                      <option value="Y">Yes</option>
                      <option value="N">No</option>
                    </select>
                  </td>
                  {/* :white_check_mark: Result - Only digits */}
                  <td>
                    <input
                      type="text"
                      value={row?.result || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                        handleInputChange(index, "result", value);
                      }}
                      maxLength={3} // optional limit
                    />
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
              )
            )}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-end">
        {addRowError && (
          <small style={{ color: "red", marginRight: "12px" }}>
            {addRowError}
          </small>
        )}
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddRow}
        >
          Add New Row
        </button>
      </div>
    </div>
  );
};
export default PreviousEducationDetails;
