
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";

const App = ({ goToTab, educationData, setCourseDetailsInParent }) => {
  const [formData, setFormData] = useState({
    qualification: "",
    yearFrom: "",
    yearTo: "",
    university: "",
    institution: "",
    div: "",
    highestQualification: "",
  });

  const [dataList, setDataList] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  useEffect(() => {
    if (educationData && educationData.length > 0) {
      const formatted = educationData.map((item, index) => ({
        qualification: item.qualification || "",
        yearFrom: item.date_from ? item.date_from.split("-")[0] : "",
        yearTo: item.date_to ? item.date_to.split("-")[0] : "",
        university: item.university || "",
        institution: item.institution || "",
        div: item.marks || "",
        highestQualification: item.highest_qualification || item.qualification || "",
      }));

      // Set the first item into input fields
      setFormData(formatted[0] || {
        qualification: "",
        yearFrom: "",
        yearTo: "",
        university: "",
        institution: "",
        div: "",
        highestQualification: "",
      });

      // Put remaining items in table
      setDataList(formatted.slice(1));
    }
  }, [educationData]);



  const handleAdd = () => {
    // Add the form data to the end of the list
    setDataList((prev) => [...prev, formData]);

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

  const handleNext = async () => {
    const employeeId = localStorage.getItem("employeeId");

    if (!employeeId) {
      alert("Employee ID not found in local storage.");
      return;
    }

    // Validate that we have at least one qualification to submit
    if (dataList.length === 0) {
      alert("Please add at least one qualification before proceeding.");
      return;
    }

    // Validate all entries have required fields
    for (let i = 0; i < dataList.length; i++) {
      const entry = dataList[i];
      if (!entry.qualification || entry.qualification === "") {
        alert(`Qualification ${i + 1}: Please select Qualification`);
        return;
      }
      if (!entry.yearFrom || entry.yearFrom.length !== 4) {
        alert(`Qualification ${i + 1}: Please enter valid Year From (4 digits)`);
        return;
      }
      if (!entry.yearTo || entry.yearTo.length !== 4) {
        alert(`Qualification ${i + 1}: Please enter valid Year To (4 digits)`);
        return;
      }
      if (!entry.highestQualification || entry.highestQualification === "") {
        alert(`Qualification ${i + 1}: Please select Highest Qualification`);
        return;
      }
    }

    const formatYearToDate = (year) => {
      if (!year || year.length !== 4) return null;
      return `${year}-01-01`;
    };

    const payload = {
      created_by: sessionStorage.getItem("userId") || "1",
      qualifications_details: dataList.map((item) => ({
        employee_qualification_id: 0, // For new qualifications
        qualification: item.qualification, // Changed from qualification_type
        highest_qualification: item.highestQualification, // Added this required field
        date_from: formatYearToDate(item.yearFrom), // Changed from year_from
        date_to: formatYearToDate(item.yearTo), // Changed from year_to
        university: item.university,
        institution: item.institution,
        marks: item.div,
      })),
    };

    try {
      // Step 1: Submit qualification details
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");

      const qualificationUrl = `${ApiUrl.apiurl}STAFF/RegistrationQualificationCreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`;
      const qualificationResponse = await fetch(qualificationUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const qualificationText = await qualificationResponse.text();
      let qualificationResult = {};

      try {
        qualificationResult = qualificationText
          ? JSON.parse(qualificationText)
          : {};
      } catch (err) {
        console.error(
          "Failed to parse qualification response:",
          qualificationText
        );
        alert("Invalid response from qualification API.");
        return;
      }

      if (
        !qualificationResponse.ok ||
        qualificationResult.message?.toLowerCase() !== "success"
      ) {
        console.warn("Qualification API failed:", qualificationResult);
        alert(
          qualificationResult.message || "Qualification submission failed."
        );
        return;
      }

      console.log("Qualification API Success:", qualificationResult);

      // Step 2: Fetch Course Details
      const courseUrl = `${ApiUrl.apiurl}STAFF/RegistrationCourseDetailsRetrieve/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`;
      const courseResponse = await fetch(courseUrl);

      if (courseResponse.status === 204) {
        console.warn("Course API returned 204 No Content");
        goToTab(5); // Proceed anyway
        return;
      }

      const courseText = await courseResponse.text();
      let courseResult = {};

      try {
        courseResult = courseText ? JSON.parse(courseText) : {};
      } catch (err) {
        console.error("Failed to parse course details response:", courseText);
        alert("Invalid response from course API.");
        return;
      }

      console.log("Course API Success:", courseResult);

      if (
        courseResponse.ok &&
        courseResult.message?.toLowerCase() === "success"
      ) {
        // Optionally pass course data to parent here if needed
        setCourseDetailsInParent(courseResult.data);

        goToTab(5); // Move to Courses tab
      } else {
        alert(courseResult.message || "Failed to retrieve course details.");
      }
    } catch (error) {
      console.error("Error in handleNext:", error);
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div className="container-fluid my-4">
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Sr.No</th>
              <th>Qualification</th>
              <th>Year From</th>
              <th>Year To</th>
              <th>University</th>
              <th>Institution</th>
              <th>Div%</th>
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
                  <option value="B.Sc">B.Sc</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="PhD">PhD</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="yearFrom"
                  value={formData.yearFrom}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="yearTo"
                  value={formData.yearTo}
                  onChange={handleChange}
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
                  type="text"
                  className="form-control"
                  name="div"
                  value={formData.div}
                  onChange={handleChange}
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
                  <option value="B.Sc">B.Sc</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="PhD">PhD</option>
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
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary border" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default App;


