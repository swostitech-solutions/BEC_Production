
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";

const App = ({ goToTab, educationData, setCourseDetailsInParent, setEducationData }) => {
  const [formData, setFormData] = useState({
    qualification: "",
    yearFrom: "",
    yearTo: "",
    university: "",
    institution: "",
    div: "",
    highestQualification: "",
  });

  // Initialize dataList from parent if available (handles when user navigates back)
  const [dataList, setDataList] = useState(() => {
    if (educationData && educationData.length > 0) {
      // Check if already in local format (has yearFrom property)
      if (educationData[0].yearFrom !== undefined) {
        return educationData;
      }
    }
    return [];
  });

  const [isInitialized, setIsInitialized] = useState(false);
const qualificationOptions = [
  { value: "PhD", label: "Ph.D." },
  { value: "PDF", label: "Post-Doctoral Fellowship (PDF)" },
  { value: "UGC_NET", label: "UGC-NET / CSIR-NET" },
  { value: "SET_SLET", label: "SET / SLET" },
  { value: "MPhil", label: "M.Phil." },
  { value: "Postgraduate", label: "Postgraduate" },
  { value: "4yr_bachelor_research", label: "4-Year Bachelor’s with Research" },
  { value: "Undergraduate", label: "Undergraduate" },
  { value: "Professor_of_Practice", label: "Professor of Practice" },
  { value: "Other_Certification", label: "Other Professional Certification" },
];
  // Simple handleChange - just update local form state, NO parent sync
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  // Only load from API format once on mount
  useEffect(() => {
    if (
      !isInitialized &&
      educationData &&
      educationData.length > 0 &&
      educationData[0].yearFrom === undefined // Only API format
    ) {
      // Map from API format
      const formatted = educationData.map((item, index) => ({
        qualification: item.qualification || "",
        yearFrom: item.date_from ? item.date_from.split("-")[0] : "",
        yearTo: item.date_to ? item.date_to.split("-")[0] : "",
        university: item.university || "",
        institution: item.institution || "",
        div: item.marks || "",
        highestQualification: item.highest_qualification || item.qualification || "",
        employee_qualification_id: item.employee_qualification_id, // Store ID
      }));

      // Load ALL rows into the table
      setDataList(formatted);
      setIsInitialized(true);
    }
  }, [educationData, isInitialized]);

  // Sync with Parent removed (handled in handlers)



  const handleAdd = () => {
    // Validation: Year From and Year To must be exactly 4 digits
    const yearRegex = /^\d{4}$/;

    if (!formData.qualification) {
      alert("Please select a Qualification.");
      return;
    }

    if (!formData.yearFrom || !yearRegex.test(formData.yearFrom)) {
      alert("Year From must be exactly 4 digits (e.g., 2020).");
      return;
    }

    if (!formData.yearTo || !yearRegex.test(formData.yearTo)) {
      alert("Year To must be exactly 4 digits (e.g., 2024).");
      return;
    }

    // Optional: Check that yearTo >= yearFrom
    if (parseInt(formData.yearTo) < parseInt(formData.yearFrom)) {
      alert("Year To cannot be earlier than Year From.");
      return;
    }

    if (!formData.university.trim()) {
      alert("Please enter University.");
      return;
    }

    if (!formData.institution.trim()) {
      alert("Please enter Institution.");
      return;
    }

    if (formData.div === "" || formData.div === null || formData.div === undefined) {
      alert("Please enter Div%.");
      return;
    }
    const divVal = parseFloat(formData.div);
    if (isNaN(divVal) || divVal < 0 || divVal > 100) {
      alert("Div% must be a number between 0 and 100.");
      return;
    }

    if (!formData.highestQualification) {
      alert("Please select Highest Qualification.");
      return;
    }

    // Add the form data to the end of the list
    const updatedList = [...dataList, formData];
    setDataList(updatedList);

    if (setEducationData) {
      // Sync updated list (formData is about to be cleared, so ignored)
      setEducationData(updatedList);
    }

    // Reset the form
    setFormData({
      qualification: "",
      yearFrom: "",
      yearTo: "",
      university: "",
      institution: "",
      div: "",
      highestQualification: "",
    });
  };

  const handleRemove = (index) => {
    // Remove the row at the given index
    const updatedData = dataList.filter((_, i) => i !== index);
    setDataList(updatedData);

    if (setEducationData) {
      // Sync only the actual rows, NOT the in-progress form
      setEducationData(updatedData);
    }
  };

  // const handleNext = async () => {
  //   const employeeId = localStorage.getItem("employeeId");

  //   if (!employeeId) {
  //     alert("Employee ID not found in local storage.");
  //     return;
  //   }

  //   if (dataList.length === 0) {
  //     alert("Please add at least one qualification before proceeding.");
  //     return;
  //   }

  //   // Helper to format year to full date
  //   const formatYearToDate = (year) => {
  //     if (!year || year.length !== 4) return null;
  //     return `${year}-01-01`;
  //   };

  //   // Construct payload
  //   const payload = {
  //     created_by: 0,
  //     qualifications_details: dataList.map((item) => ({
  //       qualification_id: 0, // hardcoded or replace with actual if available
  //       qualification_type: item.qualification,
  //       year_from: formatYearToDate(item.yearFrom),
  //       year_to: formatYearToDate(item.yearTo),
  //       university: item.university,
  //       institution: item.institution,
  //       marks: item.div,
  //     })),
  //   };

  //   try {
  //     const response = await fetch(
  //       `${ApiUrl.apiurl}STAFF/registrationQualificationCreateUpdate/${employeeId}/`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     if (response.ok) {
  //       const result = await response.json();
  //       console.log("Successfully submitted:", result);
  //       goToTab(5); // Proceed to the next tab
  //     } else {
  //       const errorData = await response.json();
  //       console.error("Failed to submit data:", errorData);
  //       alert("Error submitting qualifications. Check console for details.");
  //     }
  //   } catch (error) {
  //     console.error("Error during API call:", error);
  //     alert("Something went wrong while submitting the data.");
  //   }
  // };

  // Navigate to next tab - NO API calls here
  // Data is already synced to parent via handleAdd/handleRemove/handleChange
  const handleNext = () => {
    // Sync only the actual rows to parent before navigating
    if (setEducationData) {
      setEducationData(dataList);
    }
    goToTab(5); // Navigate to Courses tab
  };

  return (
    <div className="container-fluid my-4">
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Sr.No</th>
              <th>Qualification</th>
              <th style={{ minWidth: "100px" }}>Year From</th>
              <th style={{ minWidth: "100px" }}>Year To</th>
              <th>University</th>
              <th>Institution</th>
              <th style={{ minWidth: "85px" }}>Div%</th>
              <th>Highest Qualification</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{row.qualification}</td>
                <td>{row.yearFrom}</td>
                <td>{row.yearTo}</td>
                <td>{row.university}</td>
                <td>{row.institution}</td>
                <td>{row.div}</td>
                <td>{row.highestQualification}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td>{dataList.length + 1}</td>
              <td>
                <select
                  className="form-select"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {qualificationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  name="yearFrom"
                  value={formData.yearFrom}
                  min="1900"
                  max="9999"
                  placeholder="e.g. 2020"
                  style={{ minWidth: "90px" }}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || (val.length <= 4 && /^\d+$/.test(val))) {
                      handleChange(e);
                    }
                  }}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  name="yearTo"
                  value={formData.yearTo}
                  min="1900"
                  max="9999"
                  placeholder="e.g. 2024"
                  style={{ minWidth: "90px" }}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || (val.length <= 4 && /^\d+$/.test(val))) {
                      handleChange(e);
                    }
                  }}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  name="div"
                  value={formData.div}
                  min="0"
                  max="100"
                  placeholder="0-100"
                  style={{ minWidth: "75px" }}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (
                      val === "" ||
                      (parseFloat(val) >= 0 && parseFloat(val) <= 100)
                    ) {
                      handleChange(e);
                    }
                  }}
                />
              </td>
              <td>
                <select
                  className="form-select"
                  name="highestQualification"
                  value={formData.highestQualification}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {qualificationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button className="btn btn-primary" onClick={handleAdd}>
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;


