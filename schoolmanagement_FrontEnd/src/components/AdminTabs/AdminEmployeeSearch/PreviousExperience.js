


// import React, { useState, useEffect } from "react";

// const PreviousExperience = ({ goToTab, setExperienceData, experienceData }) => {
//   const [formData, setFormData] = useState({
//     srNo: "",
//     organization: "",
//     monthYearFrom: "",
//     monthYearTo: "",
//     reasonForLeaving: "",
//     experienceLetterProvided: false,
//   });

//   const [dataList, setDataList] = useState([]);

// useEffect(() => {
//   setFormData((prev) => ({
//     ...prev,
//     srNo: dataList.length + 2, // considering first one is in form
//   }));
// }, [dataList]);



//  useEffect(() => {
//    if (
//      experienceData &&
//      Array.isArray(experienceData) &&
//      experienceData.length > 0
//    ) {
//      const formatted = experienceData.map((item, index) => ({
//        srNo: index + 1,
//        organization: item.previous_company_worked || "",
//        monthYearFrom: item.month_year_from || "",
//        monthYearTo: item.month_year_to || "",
//        reasonForLeaving: item.reason_for_leaving || "",
//        experienceLetterProvided: item.experience_letter_provided || false,
//      }));

//      setFormData({ ...formatted[0] }); // Display first in input
//      setDataList(formatted.slice(1)); // Others in table
//    }
//  }, [experienceData]);



//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

// const handleAdd = () => {
//   if (
//     !formData.organization ||
//     !formData.monthYearFrom ||
//     !formData.monthYearTo ||
//     !formData.reasonForLeaving
//   ) {
//     alert("Please fill all fields before adding.");
//     return;
//   }

//  const newItem = {
//    ...formData,
//    srNo: dataList.length + 2, // +2 because one record is already in form
//  };


//   const updatedList = [newItem, ...dataList];
//   setDataList(updatedList);
//   setExperienceData(updatedList); // send to parent

//   // Reset form
//  setFormData({
//    srNo: dataList.length + 2, // pre-fill next srNo
//    organization: "",
//    monthYearFrom: "",
//    monthYearTo: "",
//    reasonForLeaving: "",
//    experienceLetterProvided: false,
//  });
// };


//   return (
//     <div className="container my-4">
//       <h5>Previous Experience Details</h5>
//       <div className="table-responsive">
//         <table className="table table-bordered">
//           <thead>
//             <tr>
//               <th>Sr.No</th>
//               <th>Organization</th>
//               <th>Month/Year From</th>
//               <th>Month/Year To</th>
//               <th>Reason for Leaving</th>
//               <th>Experience Letter Provided</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {dataList.map((data, index) => (
//               <tr key={index}>
//                 <td>{data.srNo}</td>
//                 <td>{data.organization}</td>
//                 <td>{data.monthYearFrom}</td>
//                 <td>{data.monthYearTo}</td>
//                 <td>{data.reasonForLeaving}</td>
//                 <td className="text-center">
//                   <input
//                     type="checkbox"
//                     checked={data.experienceLetterProvided}
//                     readOnly
//                   />
//                 </td>
//                 <td>--</td>
//               </tr>
//             ))}
//             <tr>
//               <td>
//                 <input
//                   className="form-control"
//                   value={formData.srNo}
//                   disabled
//                 />
//               </td>
//               <td>
//                 <input
//                   className="form-control"
//                   name="organization"
//                   value={formData.organization}
//                   onChange={handleChange}
//                 />
//               </td>
//               <td>
//                 <input
//                   className="form-control"
//                   type="date" // this ensures value is always in YYYY-MM-DD
//                   name="monthYearFrom"
//                   value={formData.monthYearFrom}
//                   onChange={handleChange}
//                 />
//               </td>
//               <td>
//                 <input
//                   className="form-control"
//                   type="date" // ensures YYYY-MM-DD
//                   name="monthYearTo"
//                   value={formData.monthYearTo}
//                   onChange={handleChange}
//                 />
//               </td>

//               <td>
//                 <input
//                   className="form-control"
//                   name="reasonForLeaving"
//                   value={formData.reasonForLeaving}
//                   onChange={handleChange}
//                 />
//               </td>
//               <td className="text-center">
//                 <input
//                   type="checkbox"
//                   name="experienceLetterProvided"
//                   checked={formData.experienceLetterProvided}
//                   onChange={handleChange}
//                 />
//               </td>
//               <td>
//                 <button className="btn btn-primary btn-sm" onClick={handleAdd}>
//                   Add
//                 </button>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PreviousExperience;


import React, { useState, useEffect } from "react";

const PreviousExperience = ({ goToTab, setExperienceData, experienceData }) => {
  const [formData, setFormData] = useState({
    organization: "",
    monthYearFrom: "",
    monthYearTo: "",
    reasonForLeaving: "",
    experienceLetterProvided: false,
  });

  // Initialize dataList from parent if available (handles when user navigates back)
  const [dataList, setDataList] = useState(() => {
    if (experienceData && Array.isArray(experienceData) && experienceData.length > 0) {
      // Check if already in local format (has organization property)
      if (experienceData[0].organization !== undefined) {
        return experienceData;
      }
    }
    return [];
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only load data once on initial mount - DO NOT re-run when experienceData changes from handleAdd
    if (
      !isInitialized &&
      experienceData &&
      Array.isArray(experienceData) &&
      experienceData.length > 0
    ) {
      // Check if already in local format (has organization property)
      if (experienceData[0].organization !== undefined) {
        console.log("PreviousExperience: Data already in local format, using directly");
        setDataList(experienceData);
        setIsInitialized(true);
        return;
      }

      // Map from API format
      const formatted = experienceData.map((exp, index) => ({
        srNo: index + 1,
        organization: exp.previous_company_worked || "",
        monthYearFrom: exp.date_from || "",
        monthYearTo: exp.date_to || "",
        reasonForLeaving: exp.reason_for_leaving || "",
        experienceLetterProvided: exp.experience_letter_provided || false,
      }));

      setDataList(formatted);
      setIsInitialized(true);
    }
  }, [experienceData, isInitialized]);





  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAdd = () => {
    const { organization, monthYearFrom, monthYearTo, reasonForLeaving } =
      formData;

    if (!organization || !monthYearFrom || !monthYearTo || !reasonForLeaving) {
      alert("Please fill all fields before adding.");
      return;
    }

    const newItem = {
      organization,
      monthYearFrom,
      monthYearTo,
      reasonForLeaving,
      experienceLetterProvided: formData.experienceLetterProvided,
    };

    console.log("Adding new item:", newItem); // Debug log

    // Update dataList state
    const updatedList = [newItem, ...dataList];

    // Recalculate serial numbers
    const reNumberedList = updatedList.map((item, index) => ({
      ...item,
      srNo: index + 1,
    }));

    console.log("Renumbered list:", reNumberedList); // Debug log

    // Update local state
    setDataList(reNumberedList);

    // Update parent state (for save operation)
    setExperienceData(reNumberedList);

    // Reset input
    setFormData({
      organization: "",
      monthYearFrom: "",
      monthYearTo: "",
      reasonForLeaving: "",
      experienceLetterProvided: false,
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
    setExperienceData(reNumberedData); // Update parent as well
  };




  return (
    <div className="container-fluid my-4">
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Sr.No</th>
              <th>Organization</th>
              <th>Month/Year From</th>
              <th>Month/Year To</th>
              <th>Reason for Leaving</th>
              <th>Experience Letter Provided</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((data, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{data.organization}</td>
                <td>{data.monthYearFrom}</td>
                <td>{data.monthYearTo}</td>
                <td>{data.reasonForLeaving}</td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={data.experienceLetterProvided}
                    readOnly
                  />
                </td>
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
            {/* Input row */}
            <tr>
              <td>{dataList.length + 1}</td>
              <td>
                <input
                  className="form-control"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  className="form-control"
                  type="date"
                  name="monthYearFrom"
                  value={formData.monthYearFrom}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  className="form-control"
                  type="date"
                  name="monthYearTo"
                  value={formData.monthYearTo}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  className="form-control"
                  name="reasonForLeaving"
                  value={formData.reasonForLeaving}
                  onChange={handleChange}
                />
              </td>
              <td className="text-center">
                <input
                  type="checkbox"
                  name="experienceLetterProvided"
                  checked={formData.experienceLetterProvided}
                  onChange={handleChange}
                />
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm w-100"
                  onClick={handleAdd}
                >
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

export default PreviousExperience;






