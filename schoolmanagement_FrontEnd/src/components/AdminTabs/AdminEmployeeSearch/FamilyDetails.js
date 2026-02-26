
// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// const App = ({ goToTab }) => {
//   return (
//     <div className="container-fluid ">
//       <div className="table-responsive">
//         <table className="table">
//           <thead>
//             <tr>
//               <th>Sr.No</th>

//               <th>Name</th>
//               <th>Relation</th>

//               <th>D.O.B</th>
//               <th>Gender</th>
//               <th>Married</th>
//               <th>Employed</th>
//               <th>Occupation</th>
//               <th>Dependent</th>
//               <th>PF Nominee</th>
//               <th>% PF Share</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>
//                 <input type="text" className="form-control" />
//               </td>
//               {/* <td>
//         <input type="text" className="form-control" />
//       </td> */}
//               <td>
//                 <select className="form-select">
//                   <option>Select</option>
//                 </select>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="First Name"
//                 />
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Second Name"
//                 />
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Last Name"
//                 />
//               </td>
//               <td>
//                 <input type="text" className="form-control" />
//               </td>

//               <td>
//                 <input type="date" className="form-control" />
//               </td>
//               <td>
//                 <select className="form-select">
//                   <option>Select</option>
//                 </select>
//               </td>
//               <td>
//                 <select className="form-select">
//                   <option>Select</option>
//                 </select>
//               </td>
//               <td>
//                 <div className="form-check">
//                   <input
//                     type="radio"
//                     className="form-check-input"
//                     name="dependent"
//                   />
//                   <label className="form-check-label">Yes</label>
//                 </div>
//                 <br></br>
//                 <div className="form-check">
//                   <input
//                     type="radio"
//                     className="form-check-input"
//                     name="dependent"
//                   />
//                   <label className="form-check-label">No</label>
//                 </div>
//               </td>
//               <td>
//                 <input type="text" className="form-control" />
//               </td>
//               <td>
//                 <div className="form-check">
//                   <input
//                     type="radio"
//                     className="form-check-input"
//                     name="dependent"
//                   />
//                   <label className="form-check-label">Yes</label>
//                 </div>
//                 <br></br>
//                 <div className="form-check">
//                   <input
//                     type="radio"
//                     className="form-check-input"
//                     name="dependent"
//                   />
//                   <label className="form-check-label">No</label>
//                 </div>
//               </td>
//               <td>
//                 <div className="form-check">
//                   <input
//                     type="radio"
//                     className="form-check-input"
//                     name="dependent"
//                   />
//                   <label className="form-check-label">Yes</label>
//                 </div>
//                 <br></br>
//                 <div className="form-check">
//                   <input
//                     type="radio"
//                     className="form-check-input"
//                     name="dependent"
//                   />
//                   <label className="form-check-label">No</label>
//                 </div>
//               </td>
//               <td>
//                 <input type="text" className="form-control" />
//               </td>
//               <td>
//                 <button className="btn btn-primary">Add</button>{" "}
//                 {/* Add button */}
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//       <div className="d-flex justify-content-end mb-3">
//         <button className="btn btn-primary border" onClick={() => goToTab(4)}>
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default App;



import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";

const App = ({ goToTab, relationDetails, setEducationDetailsInParent, setRelationDetails }) => {
  const [formData, setFormData] = useState({
    srNo: "",
    name: { first: "", second: "", last: "", title: "Select" },
    relation: "",
    dob: "",
    gender: "Select",
    married: "Select",
    employed: "",
    occupation: "",
    dependent: "",
    pfNominee: "",
    pfShare: "",
  });

  // Initialize dataList from parent if available (handles when user navigates back)
  const [dataList, setDataList] = useState(() => {
    if (relationDetails && relationDetails.length > 0) {
      // Check if already in local format
      if (relationDetails[0].name !== undefined) {
        return relationDetails;
      }
    }
    return [];
  });
  const [genderList, setGenderList] = useState([]);

  useEffect(() => {
    // Fetch Gender List
    const fetchGenders = async () => {
      try {
        const response = await fetch(`${ApiUrl.apiurl}Gender/GetAllGenderList/`);
        const data = await response.json();
        if (data.message === "Success") {
          setGenderList(data.data);
        }
      } catch (error) {
        console.error("Error fetching genders:", error);
      }
    };
    fetchGenders();
  }, []);
  useEffect(() => {
    if (relationDetails && relationDetails.length > 0) {
      // Check if already in local format (has name property with first/last etc)
      if (relationDetails[0].name !== undefined) {
        console.log("FamilyDetails: Data already in local format, using directly");
        setDataList(relationDetails);
        return;
      }

      // Map from API format
      const formatted = relationDetails.map((item, index) => {
        const getGenderId = (val) => {
          if (!val) return "Select";
          if (typeof val === 'object') return val.id || "Select";
          // Check if it's already an ID (numeric or string number)
          if (genderList.some(g => g.id == val)) return val;
          // Check name match
          const match = genderList.find(g => g.gender_name?.toLowerCase() === String(val).toLowerCase());
          return match ? match.id : "Select";
        };

        return {
          srNo: index + 1,
          name: {
            title: item.relation_title || "Select",
            first: item.relation_first_name || "",
            second: item.relation_middle_name || "", // Fixed: backend returns relation_middle_name
            last: item.relation_last_name || "",
          },
          relation: item.employee_relation || "", // Fixed: backend returns employee_relation not emp_relation
          dob: item.relation_dob || "",
          gender: getGenderId(item.relation_gender || item.relation_gender_id),
          married: (item.relation_marital_status?.id || item.relation_marital_status) || "Select",
          employed: (item.relation_employed?.id || item.relation_employed) || "",
          occupation: item.relation_occupation || "",
          dependent: item.relation_dependent === 1 ? 1 : 0,
          pfNominee: item.relation_pf_nominee === "T" ? "T" : "F", // Keep T/F format
          pfShare: item.relation_pf_share || "",
          family_details_id: item.family_details_id || item.family_detail_id || item.id, // Store ID for updates
        }
      });

      // Load ALL rows into the table
      setDataList(formatted);

      // Reset form data to empty state
      setFormData({
        srNo: "",
        name: { first: "", second: "", last: "", title: "Select" },
        relation: "",
        dob: "",
        gender: "Select",
        married: "Select",
        employed: "",
        occupation: "",
        dependent: "",
        pfNominee: "",
        pfShare: "",
      });
    }
  }, [relationDetails, genderList]);

  // Sync with Parent removed (handled in handlers)



  const handleChange = (field, value, subfield = null) => {
    if (subfield) {
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [subfield]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAdd = () => {
    const newEntry = {
      ...formData,
      srNo: dataList.length + 1, // Assign next serial number
    };

    const newList = [...dataList, newEntry];
    setDataList(newList); // Add at the bottom

    if (setRelationDetails) {
      const backendFormat = newList.map(entry => ({
        family_details_id: entry.family_details_id,
        employee_relation: entry.relation,
        relation_title: entry.name.title,
        relation_first_name: entry.name.first,
        relation_middle_name: entry.name.second,
        relation_last_name: entry.name.last,
        relation_dob: entry.dob,
        relation_gender: entry.gender === "Select" ? "" : entry.gender,
        relation_marital_status: entry.married === "Select" ? "" : entry.married,
        relation_employed: entry.employed,
        relation_occupation: entry.occupation,
        relation_dependent: entry.dependent,
        relation_pf_nominee: entry.pfNominee,
        relation_pf_share: entry.pfShare
      }));
      setRelationDetails(backendFormat);
    }

    // Reset form
    setFormData({
      srNo: "",
      name: { first: "", second: "", last: "", title: "Select" },
      relation: "",
      dob: "",
      gender: "Select",
      married: "Select",
      employed: "",
      occupation: "",
      dependent: "",
      pfNominee: "",
      pfShare: "",
    });
  };

  const handleRemove = (index) => {
    // Remove the row at the given index
    const updatedData = dataList.filter((_, i) => i !== index);

    // Update serial numbers
    const reNumberedData = updatedData.map((row, i) => ({
      ...row,
      srNo: i + 1,
    }));

    setDataList(reNumberedData);

    if (setRelationDetails) {
      const backendFormat = reNumberedData.map(entry => ({
        family_details_id: entry.family_details_id,
        employee_relation: entry.relation,
        relation_title: entry.name.title,
        relation_first_name: entry.name.first,
        relation_middle_name: entry.name.second,
        relation_last_name: entry.name.last,
        relation_dob: entry.dob,
        relation_gender: entry.gender === "Select" ? "" : entry.gender,
        relation_marital_status: entry.married === "Select" ? "" : entry.married,
        relation_employed: entry.employed,
        relation_occupation: entry.occupation,
        relation_dependent: entry.dependent,
        relation_pf_nominee: entry.pfNominee,
        relation_pf_share: entry.pfShare
      }));
      setRelationDetails(backendFormat);
    }
  };

  // const handleNext = () => {
  //   const employeeId = localStorage.getItem("employeeId");
  //   const userId = sessionStorage.getItem("userId");

  //   const formattedFamilyDetails = dataList.map((entry) => ({
  //     emp_relation: entry.relation,
  //     relation_title: entry.name.title,
  //     relation_first_name: entry.name.first,
  //     relation_second_name: entry.name.second || "", // optional if applicable
  //     relation_last_name: entry.name.last,
  //     relation_dob: entry.dob,
  //     relation_gender: entry.gender,
  //     relation_marital_status: entry.married,
  //     relation_employed: entry.employed,
  //     relation_occupation: entry.occupation,
  //     relation_dependent: entry.dependent,
  //     relation_pf_nominee: entry.pfNominee,
  //     relation_pf_share: entry.pfShare,
  //   }));

  //   const payload = {
  //     created_by: userId,
  //     family_details: formattedFamilyDetails,
  //   };

  //   fetch(
  //     `${ApiUrl.apiurl}STAFF/registrationFamilyRelationCreateUpdate/${employeeId}/`,
  //     {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     }
  //   )
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Failed to submit data");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log("Submission successful:", data);
  //       goToTab(4);
  //     })
  //     .catch((error) => {
  //       console.error("Error submitting data:", error);
  //       alert("Failed to submit family details.");
  //     });
  // };

  const handleNext = async () => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      const userId = sessionStorage.getItem("userId");

      if (!employeeId || !userId) {
        alert("Employee ID or User ID not found.");
        return;
      }

      // Validate that we have at least one family member to submit
      if (dataList.length === 0) {
        alert("Please add at least one family member before proceeding.");
        return;
      }

      // Validate all entries have required fields
      for (let i = 0; i < dataList.length; i++) {
        const entry = dataList[i];
        if (!entry.gender || entry.gender === "Select" || entry.gender === "") {
          alert(`Family member ${i + 1}: Please select Gender`);
          return;
        }
        if (!entry.married || entry.married === "Select" || entry.married === "") {
          alert(`Family member ${i + 1}: Please select Marital Status`);
          return;
        }
      }

      // Format family details - using exact field names from Postman collection
      const formattedFamilyDetails = dataList.map((entry) => ({
        family_details_id: entry.family_details_id, // include ID for updates
        employee_relation: entry.relation, // Changed from emp_relation
        relation_title: entry.name.title,
        relation_first_name: entry.name.first,
        relation_middle_name: entry.name.second || "", // Changed from relation_second_name
        relation_last_name: entry.name.last,
        relation_dob: entry.dob,
        relation_gender: parseInt(entry.gender), // Convert to integer (validated above)
        relation_marital_status: parseInt(entry.married), // Convert to integer (validated above)
        relation_employed: entry.employed,
        relation_occupation: entry.occupation,
        relation_dependent: entry.dependent,
        relation_pf_nominee: entry.pfNominee,
        relation_pf_share: entry.pfShare,
      }));

      const payload = {
        created_by: userId,
        family_details: formattedFamilyDetails,
      };

      // Step 1: Submit Family Details
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");

      const familyUrl = `${ApiUrl.apiurl}STAFF/RegistrationFamilyRelationCreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`;
      const familyResponse = await fetch(familyUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const familyText = await familyResponse.text();
      let familyResult = {};

      try {
        familyResult = familyText ? JSON.parse(familyText) : {};
      } catch (err) {
        console.error("Failed to parse family details response:", familyText);
        alert("Invalid response from family API.");
        return;
      }

      if (
        !familyResponse.ok ||
        familyResult.message?.toLowerCase() !== "success"
      ) {
        console.warn("Family API failed:", familyResult);
        console.error("Full error details:", JSON.stringify(familyResult, null, 2)); // Detailed logging

        // Show detailed error message
        let errorMsg = familyResult.message || "Family details submission failed.";
        if (familyResult.error) {
          errorMsg += "\n\nValidation Errors:\n" + JSON.stringify(familyResult.error, null, 2);
        }
        alert(errorMsg);
        return;
      }

      console.log("Family API Success:", familyResult);

      // Step 2: Fetch Education Details
      const educationUrl = `${ApiUrl.apiurl}STAFF/RegistrationEducationDetailsRetrieve/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`;
      const eduResponse = await fetch(educationUrl);

      if (eduResponse.status === 204) {
        console.warn("Education API returned 204 No Content");
        goToTab(4); // Proceed anyway
        return;
      }

      const eduText = await eduResponse.text();
      let eduResult = {};

      try {
        eduResult = eduText ? JSON.parse(eduText) : {};
      } catch (err) {
        console.error("Failed to parse education details response:", eduText);
        alert("Invalid response from education API.");
        return;
      }

      console.log("Education API Success:", eduResult);

      if (eduResponse.ok && eduResult.message?.toLowerCase() === "success") {
        if (setEducationDetailsInParent && eduResult.data) {
          setEducationDetailsInParent(eduResult.data); // Optional if you want to use in next tab
        }

        goToTab(4); // Move to Education Tab
      } else {
        alert(eduResult.message || "Failed to retrieve education details.");
      }
    } catch (error) {
      console.error("Error in handleNext:", error);
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Name</th>
              <th>Relation</th>
              <th>D.O.B</th>
              <th>Gender</th>
              <th>Married</th>
              <th>Employed</th>
              <th>Occupation</th>
              <th>Dependent</th>
              <th>PF Nominee</th>
              <th>% PF Share</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((data, idx) => (
              <tr key={idx}>
                <td>{data.srNo}</td>
                <td>
                  {data.name.title} {data.name.first} {data.name.second}{" "}
                  {data.name.last}
                </td>
                <td>{data.relation}</td>
                <td>{data.dob}</td>
                <td>
                  {genderList.find((g) => g.id == data.gender)?.gender_name || data.gender}
                </td>
                <td>{data.married}</td>
                <td>{data.employed}</td>
                <td>{data.occupation}</td>
                {/* <td>{data.dependent}</td> */}
                <td>{data.dependent === 1 ? "Yes" : "No"}</td>

                <td>{data.pfNominee}</td>

                <td>{data.pfShare}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemove(idx)}
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
                  className="form-select mb-1"
                  value={formData.name.title}
                  onChange={(e) =>
                    handleChange("name", e.target.value, "title")
                  }
                >
                  <option>Select</option>
                  <option>Mr</option>
                  <option>Ms</option>
                </select>
                <input
                  type="text"
                  className="form-control mb-1"
                  placeholder="First Name"
                  value={formData.name.first}
                  onChange={(e) =>
                    handleChange("name", e.target.value, "first")
                  }
                />
                <input
                  type="text"
                  className="form-control mb-1"
                  placeholder="Second Name"
                  value={formData.name.second}
                  onChange={(e) =>
                    handleChange("name", e.target.value, "second")
                  }
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                  value={formData.name.last}
                  onChange={(e) => handleChange("name", e.target.value, "last")}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={formData.relation}
                  onChange={(e) => handleChange("relation", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="date"
                  className="form-control"
                  value={formData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                />
              </td>
              <td>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                >
                  <option value="">Select</option>
                  {genderList.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.gender_name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  className="form-select"
                  value={formData.married}
                  onChange={(e) => handleChange("married", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="1">Yes</option>
                  <option value="2">No</option>
                </select>
              </td>
              <td>
                <div className="form-check form-check-inline me-3">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="employed"
                    value="Yes"
                    checked={formData.employed === "Yes"}
                    onChange={(e) => handleChange("employed", e.target.value)}
                  />
                  <label className="form-check-label">Yes</label>
                </div>
                <br></br>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="employed"
                    value="No"
                    checked={formData.employed === "No"}
                    onChange={(e) => handleChange("employed", e.target.value)}
                  />
                  <label className="form-check-label">No</label>
                </div>
              </td>

              <td>
                <input
                  type="text"
                  className="form-control"
                  value={formData.occupation}
                  onChange={(e) => handleChange("occupation", e.target.value)}
                />
              </td>
              <td>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="dependent"
                    value={1}
                    checked={formData.dependent === 1}
                    onChange={() => handleChange("dependent", 1)}
                  />
                  <label className="form-check-label">Yes</label>
                </div>
                <br />
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="dependent"
                    value={0}
                    checked={formData.dependent === 0}
                    onChange={() => handleChange("dependent", 0)}
                  />
                  <label className="form-check-label">No</label>
                </div>
              </td>

              <td>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="pfNominee"
                    value="T"
                    checked={formData.pfNominee === "T"}
                    onChange={(e) => handleChange("pfNominee", e.target.value)}
                  />
                  <label className="form-check-label">Yes</label>
                </div>
                <br></br>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="pfNominee"
                    value="F"
                    checked={formData.pfNominee === "F"}
                    onChange={(e) => handleChange("pfNominee", e.target.value)}
                  />
                  <label className="form-check-label">No</label>
                </div>
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={formData.pfShare}
                  onChange={(e) => handleChange("pfShare", e.target.value)}
                />
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






