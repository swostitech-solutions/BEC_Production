import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";

const App = ({ goToTab, prefilledCourses, setLanguageDataInParent, setCourseDetails }) => {
  const [formData, setFormData] = useState({
    courseName: "",
    coursePlace: "",
    dateFrom: "",
    dateTo: "",
    validUpTo: "",
    grade: "",
  });

  // Initialize tableData from parent if available (handles when user navigates back)
  const [tableData, setTableData] = useState(() => {
    if (prefilledCourses && Array.isArray(prefilledCourses) && prefilledCourses.length > 0) {
      // Check if already in local format (has courseName property)
      if (prefilledCourses[0].courseName !== undefined) {
        return prefilledCourses;
      }
    }
    return [];
  });

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

      const updated = [newRow, ...tableData];
      setTableData(updated);
      if (setCourseDetails) setCourseDetails(updated); // Sync to parent handled in handlers

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
    if (setCourseDetails) setCourseDetails(reNumberedData);
  };

  useEffect(() => {
    if (
      prefilledCourses &&
      Array.isArray(prefilledCourses) &&
      prefilledCourses.length > 0
    ) {
      // Check if already in local format (has courseName property)
      if (prefilledCourses[0].courseName !== undefined) {
        console.log("Courses: Data already in local format, using directly");
        setTableData(prefilledCourses);
        return;
      }

      // Map from API format
      const formatted = prefilledCourses.map((item, index) => ({
        srNo: index + 1,
        courseName: item.course_name || "",
        coursePlace: item.course_place || "",
        dateFrom: item.date_from || "",
        dateTo: item.date_to || "",
        validUpTo: item.valid_upto || "",
        grade: item.course_results || "",
        employee_course_id: item.employee_course_id, // Store ID
      }));

      setTableData(formatted); // Load ALL rows into the table
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

  // Navigate to next tab - NO API calls here
  // Data is already synced to parent via handleAdd/handleRemove
  const handleNext = () => {
    // Sync current data to parent before navigating
    if (setCourseDetails) {
      setCourseDetails(tableData);
    }
    goToTab(6); // Navigate to Languages Known tab
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
    </div>
  );
};

export default App;
