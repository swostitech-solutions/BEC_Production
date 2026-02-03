import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";

const App = ({ goToTab, prefilledCourses, setLanguageDataInParent }) => {
  const [formData, setFormData] = useState({
    courseName: "",
    coursePlace: "",
    dateFrom: "",
    dateTo: "",
    validUpTo: "",
    grade: "",
  });

  const [tableData, setTableData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAdd = () => {
    if (
      formData.courseName &&
      formData.coursePlace &&
      formData.dateFrom &&
      formData.dateTo &&
      formData.validUpTo &&
      formData.grade
    ) {
      const newSrNo = tableData.length + 1; // Auto-generated Sr.No

      const newRow = {
        srNo: newSrNo,
        ...formData,
      };

      setTableData([newRow, ...tableData]);

      setFormData({
        courseName: "",
        coursePlace: "",
        dateFrom: "",
        dateTo: "",
        validUpTo: "",
        grade: "",
      });
    } else {
      alert("Please fill all fields before adding.");
    }
  };

  const handleRemove = (index) => {
    // Remove the row at the given index
    const updatedData = tableData.filter((_, i) => i !== index);

    // Update serial numbers
    const reNumberedData = updatedData.map((row, i) => ({
      ...row,
      srNo: i + 1,
    }));

    setTableData(reNumberedData);
  };

  useEffect(() => {
    if (
      prefilledCourses &&
      Array.isArray(prefilledCourses) &&
      prefilledCourses.length > 0
    ) {
      const formatted = prefilledCourses.map((item, index) => ({
        srNo: index + 1,
        courseName: item.course_name || "",
        coursePlace: item.course_place || "",
        dateFrom: item.date_from || "",
        dateTo: item.date_to || "",
        validUpTo: item.valid_upto || "",
        grade: item.course_results || "",
      }));

      setFormData(formatted[0]); // Fill the first course into input fields
      setTableData(formatted.slice(1)); // Put the rest in table
    }
  }, [prefilledCourses]);


  // const handleNext = async () => {
  //   if (tableData.length === 0) {
  //     alert("Please add at least one course before proceeding.");
  //     return;
  //   }

  //   const employeeId = localStorage.getItem("employeeId");
  //   const createdBy = sessionStorage.getItem("userId");

  //   const payload = {
  //     created_by: parseInt(createdBy),
  //     course_details: tableData.map((row) => ({
  //       course_id: 0,
  //       course_name: row.courseName,
  //       course_place: row.coursePlace,
  //       date_from: row.dateFrom,
  //       date_to: row.dateTo,
  //       valid_upto: row.validUpTo,
  //       course_results: row.grade,
  //     })),
  //   };

  //   try {
  //     const response = await fetch(
  //       `${ApiUrl.apiurl}STAFF/registrationCourseCreateUpdate/${employeeId}/`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log("API Response:", data);
  //       alert("Data saved successfully!");
  //       goToTab(6);
  //     } else {
  //       const errorData = await response.json();
  //       console.error("API Error:", errorData);
  //       alert("Failed to save data.");
  //     }
  //   } catch (error) {
  //     console.error("Network Error:", error);
  //     alert("Network error occurred.");
  //   }
  // };

  const handleNext = async () => {
    if (tableData.length === 0) {
      alert("Please add at least one course before proceeding.");
      return;
    }

    const employeeId = localStorage.getItem("employeeId");
    const createdBy = sessionStorage.getItem("userId");

    if (!employeeId || !createdBy) {
      alert("Employee ID or User ID is missing.");
      return;
    }

    const payload = {
      created_by: parseInt(createdBy),
      course_details: tableData.map((row) => ({
        course_id: 0,
        course_name: row.courseName,
        course_place: row.coursePlace,
        date_from: row.dateFrom,
        date_to: row.dateTo,
        valid_upto: row.validUpTo,
        course_results: row.grade,
      })),
    };

    try {
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");

      const courseUrl = `${ApiUrl.apiurl}STAFF/RegistrationCourseCreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`;
      const courseResponse = await fetch(courseUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const courseText = await courseResponse.text();
      let courseResult = {};

      try {
        courseResult = courseText ? JSON.parse(courseText) : {};
      } catch (err) {
        console.error("Failed to parse course response:", courseText);
        alert("Invalid response from course API.");
        return;
      }

      if (
        !courseResponse.ok ||
        courseResult.message?.toLowerCase() !== "success"
      ) {
        alert(courseResult.message || "Course submission failed.");
        return;
      }

      console.log("Course Submission Success:", courseResult);

      // Navigate directly to Languages tab
      goToTab(6);
    } catch (error) {
      console.error("Error in handleNext:", error);
      alert("An error occurred: " + error.message);
    }
  };



  return (
    <div className="container-fluid my-4">
      {/* Courses */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Sr.No</th>
              <th>Course Name</th>
              <th>Course Place</th>
              <th>Date From</th>
              <th>Date To</th>
              <th>Valid Up To</th>
              <th>Grade%</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.srNo}</td>
                <td>{row.courseName}</td>
                <td>{row.coursePlace}</td>
                <td>{row.dateFrom}</td>
                <td>{row.dateTo}</td>
                <td>{row.validUpTo}</td>
                <td>{row.grade}</td>
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
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={tableData.length + 1} // Auto-generated value
                  readOnly
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="coursePlace"
                  value={formData.coursePlace}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="date"
                  className="form-control"
                  name="dateFrom"
                  value={formData.dateFrom}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="date"
                  className="form-control"
                  name="dateTo"
                  value={formData.dateTo}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="date"
                  className="form-control"
                  name="validUpTo"
                  value={formData.validUpTo}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                />
              </td>
              <td>
                <button className="btn btn-primary w-100" onClick={handleAdd}>
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
