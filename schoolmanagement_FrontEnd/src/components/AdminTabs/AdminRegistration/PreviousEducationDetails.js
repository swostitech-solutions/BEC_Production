import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import Select from "react-select";
const PreviousEducationDetails = ({ formData, setFormData }) => {
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
  const handleAddRow = () => {
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
    updateParent(rows);
  };
  const handleInputChange = (index, field, value) => {
    const rows = previousEducation.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    updateParent(rows);
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
                      required
                    />
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
                    />
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
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (!value) return;
                        const yearTo = value.split("-")[0];
                        const fromDate = row?.year_from;
                        if (!fromDate) return; // no comparison if from date not selected
                        const yearFrom = fromDate.split("-")[0];
                        // :no_entry_sign: Show message ONLY AFTER full date entered & field completed
                        if (Number(yearTo) < Number(yearFrom)) {
                          alert(
                            "Year Attended To must be greater than or equal to Year Attended From"
                          );
                          handleInputChange(index, "year_to", "");
                        }
                      }}
                    />
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
