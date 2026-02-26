// import React from "react";

// function CharacterCertificate() {
//   return (
//     <div className="container p-4 border mt-5 bg-white">
//       <h3 className="text-center mb-4">Character Certificate</h3>

//       {/* Action Buttons */}
//       <div className="row mb-2">
//         <div className="col-12" style={{ border: "1px solid #ccc" }}>
//           <button
//             type="button"
//             className="btn btn-primary me-2"
//             style={{
//               "--bs-btn-padding-y": ".25rem",
//               "--bs-btn-padding-x": ".5rem",
//               "--bs-btn-font-size": ".75rem",
//               width: "150px",
//             }}
//           >
//             Save
//           </button>

//           <button
//             type="button"
//             className="btn btn-primary me-2"
//             style={{
//               "--bs-btn-padding-y": ".25rem",
//               "--bs-btn-padding-x": ".5rem",
//               "--bs-btn-font-size": ".75rem",
//               width: "150px",
//             }}
//           >
//             Clear
//           </button>
//           <button
//             type="button"
//             className="btn btn-primary me-2"
//             style={{
//               "--bs-btn-padding-y": ".25rem",
//               "--bs-btn-padding-x": ".5rem",
//               "--bs-btn-font-size": ".75rem",
//               width: "150px",
//             }}
//           >
//             Close
//           </button>
//         </div>
//       </div>

//       <form>
//         {/* Transfer Certificate Section */}

//         <div className="row mb-3">
//           <div className="col-md-6 d-flex align-items-center">
//             <label className="form-label me-3" style={{ width: "200px" }}>  Document No.   </label>
//             <input type="text" className="form-control" />
//           </div>
//           <div className="col-md-6 d-flex align-items-center">
//             <label className="form-label me-3" style={{ width: "200px" }}>  School Admission No.  </label>
//             <input type="text" className="form-control" />
//           </div>
//         </div>
//         <div className="row mb-3">
//           <div className="col-md-6 d-flex align-items-center">
//             <label className="form-label me-3" style={{ width: "200px" }}>  Student Barcode  </label>
//             <input type="text" className="form-control" />
//           </div>
//           <div className="col-md-6 d-flex align-items-center">
//             <label className="form-label me-3" style={{ width: "200px" }}>  Cancelled On  </label>
//             <input type="date" className="form-control" />
//           </div>
//         </div>
//         <div className="row mb-3">
//           <div className="col-md-6 d-flex align-items-center">
//             <label className="form-label me-3" style={{ width: "200px" }}>  Status  </label>
//             <select className="form-select">
//               <option value="New">Approved</option>
//               <option value="Cancelled">Cancelled</option>
//             </select>
//           </div>
//           <div className="col-md-6 d-flex align-items-start">
//             <label className="form-label me-3" style={{ width: "200px" }}>  Cancellation Remarks  </label>
//             <textarea className="form-control" rows="2"></textarea>
//           </div>
//         </div>
//         <h3 className="text-left mb-4">Character Certificate</h3>
//         <ul className="list-unstyled">
//           <li className="mb-3 d-flex align-items-center">
//             <span className="col-sm-1 text-end">1.</span>
//             <label className="col-sm-3 col-form-label ms-2">Student Name</label>
//             <div className="col-sm-8">
//               <input type="text" className="form-control" placeholder="" />
//             </div>
//           </li>

//           <li className="mb-3 d-flex align-items-center">
//             <span className="col-sm-1 text-end">2.</span>
//             <label className="col-sm-3 col-form-label ms-2">  Father's/ Guardian's Name  </label>
//             <div className="col-sm-8">
//               <input  type="text"  className="form-control"  placeholder="Enter father's/guardian's name"  />
//             </div>
//           </li>

//           <li className="mb-3 d-flex align-items-center">
//             <span className="col-sm-1 text-end">3.</span>
//             <label className="col-sm-3 col-form-label ms-2">  Mother's Name  </label>
//             <div className="col-sm-8">
//               <input  type="text"  className="form-control"  placeholder="Enter mother's name"  />
//             </div>
//           </li>

//           <li className="mb-3 d-flex align-items-center">
//             <span className="col-sm-1 text-end">4.</span>
//             <label className="col-sm-3 col-form-label ms-2">Class</label>
//             <div className="col-sm-2">
//               <select className="form-select">
//                 <option value="New">New</option>
//                 <option value="Cancelled">Cancelled</option>
//               </select>
//             </div>
//           </li>

//           <li className="mb-3 d-flex align-items-center">
//             <span className="col-sm-1 text-end">5.</span>
//             <label className="col-sm-3 col-form-label ms-2">  Date Of Birth  </label>
//             <div className="col-sm-8">
//               <input type="text" className="form-control" placeholder="" />
//             </div>
//           </li>

//           <li className="mb-3 d-flex align-items-center">
//             <span className="col-sm-1 text-end">6.</span>
//             <label className="col-sm-3 col-form-label ms-2">  CBSE Registration No  </label>
//             <div className="col-sm-8">
//               <input type="text" className="form-control" placeholder="" />
//             </div>
//           </li>

//           <li className="mb-3 d-flex align-items-center">
//             <span className="col-sm-1 text-end">7.</span>
//             <label className="col-sm-3 col-form-label ms-2">  Board Roll No.  </label>
//             <div className="col-sm-8">
//               <input type="text" className="form-control" placeholder="" />
//             </div>
//           </li>

//           <li className="mb-3 d-flex align-items-center">
//             <span className="col-sm-1 text-end">8.</span>
//             <label className="col-sm-3 col-form-label ms-2">Marks</label>
//             {/* <div className="col-sm-2"> */}
//             <div className="col-sm-8">
//               <input type="text" className="form-control" placeholder="" />
//             </div>
//             {/* </div> */}
//           </li>

//           <li className="mb-3 d-flex align-items-center">
//             <span className="col-sm-1 text-end">9.</span>
//             <label className="col-sm-3 col-form-label ms-2">Subjects</label>
//             <div className="col-sm-8">
//               <input type="text" className="form-control" placeholder="" />
//             </div>
//           </li>

//           <li className="mb-3 d-flex align-items-center">
//             <span className="col-sm-1 text-end">10.</span>
//             <label className="col-sm-3 col-form-label ms-2">  Conduct and Behaviour  </label>
//             <div className="col-sm-8">
//               <input type="text" className="form-control" placeholder="" />
//             </div>
//           </li>

//           <li className="mb-3 d-flex align-items-center">
//             <span className="col-sm-1 text-end">11.</span>
//             <label className="col-sm-3 col-form-label ms-2">  NSS/NCC/SCOUT/GUIDE  </label>
//             <div className="col-sm-8">
//               <input type="text" className="form-control" placeholder="" />
//             </div>
//           </li>

//           <li className="mb-3 d-flex align-items-center">
//             <span className="col-sm-1 text-end">12.</span>
//             <label className="col-sm-3 col-form-label ms-2">  CULTURAL ACTIVITIES  </label>
//             <div className="col-sm-8">
//               <input type="text" className="form-control" placeholder="" />
//             </div>
//           </li>

//           <li className="mb-3 d-flex align-items-center">
//             <span className="col-sm-1 text-end">13.</span>
//             <label className="col-sm-3 col-form-label ms-2">   GAMES & SPORTS  </label>
//             <div className="col-sm-8">
//               <input type="text" className="form-control" placeholder="" />
//             </div>
//           </li>

//           <li className="mb-3 d-flex align-items-center">
//             <span className="col-sm-1 text-end">14.</span>
//             <label className="col-sm-3 col-form-label ms-2">   OTHER ACTIVITIES  </label>
//             <div className="col-sm-8">
//               <input type="text" className="form-control" placeholder="" />
//             </div>
//           </li>

//           <li className="mb-3 d-flex align-items-center">
//             <span className="col-sm-1 text-end">15.</span>
//             <label className="col-sm-3 col-form-label ms-2">  Date of Application for Certificate  <span style={{ color: "red" }}>*</span>
//             </label>
//             <div className="col-sm-8">  <input type="date" className="form-control" />  </div>
//           </li>

//           <li className="mb-3 d-flex align-items-center">
//             <span className="col-sm-1 text-end">16.</span>
//             <label className="col-sm-3 col-form-label ms-2">  Date of Issue of Certificate
//               <span style={{ color: "red" }}>*</span>  </label>
//             <div className="col-sm-8">
//               <input type="date" className="form-control" />
//             </div>
//           </li>

//           <li className="mb-3 d-flex align-items-center">
//             <span className="col-sm-1 text-end">17.</span>
//             <label className="col-sm-3 col-form-label ms-2">Remarks</label>
//             <div className="col-sm-8">
//               <input type="text" className="form-control" placeholder="" />
//             </div>
//           </li>
//         </ul>
//       </form>
//     </div>
//   );
// }

// export default CharacterCertificate;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import  useCourses from "../../hooks/useFetchClasses";
import { ApiUrl } from "../../../ApiUrl";
const TransferCertificateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const studentData = location.state || {}; // Retrieve the state (student data) passed from HomePage
  const {
    classes,
    loading: classLoading,
    error: classError,
  } =  useCourses();
  const [formData, setFormData] = useState({
    ...studentData,
    ...studentData.studentcertificatedetails,
  });
  const [isFieldsDisabled, setIsFieldsDisabled] = useState(false);
  useEffect(() => {
    if (location.state) {
      const { certificate, viewMode } = location.state;

      setFormData({
        ...certificate,
        ...(certificate?.studentcertificatedetails || {}), // Use optional chaining and default to empty object
      });

      setIsFieldsDisabled(viewMode); // Disable fields in view mode
      setViewMode(viewMode); // Set view mode
    }
  }, [location.state]);

  const [selectedClass, setSelectedClass] = useState(
    localStorage.getItem("selectedClassId") || ""
  );
  const handleClose = () => {
    const keysToRetain = [
      "academicSessionId",
      "branchId",
      "nextAcademicSessionId",
      "orgId",
    ];
    const retainedValues = keysToRetain.reduce((acc, key) => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {});
    localStorage.clear();
    Object.entries(retainedValues).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    navigate("/admin/student-certificate");
  };
  const handleClassChange = (e) => {
    const classId = e.target.value;

    if (classId) {
      localStorage.setItem("selectedStudentClassId", classId);
    } else {
      localStorage.removeItem("selectedStudentClassId");
    }

    // Update formData with the new classId and reset sectionId
    setFormData((prev) => ({
      ...prev,
      classId,
      sectionId: "", // Reset section when class changes
    }));

    setSelectedClassId(classId); // Trigger sections fetch with the selected class ID
  };

  // const handleSave = async () => {
  //   try {
  //     // Validate tc_applied_date
  //     if (!formData.tc_applied_date) {
  //       alert("Date of Application for Certificate is required.");
  //       return; // Stop execution if validation fails
  //     }

  //     // Validate tc_issued_date
  //     if (!formData.tc_issued_date) {
  //       alert("Date of Issue of Certificate is required.");
  //       return; // Stop execution if validation fails
  //     }

  //     // Retrieve values from local storage
  //     const student = localStorage.getItem("selectedCertificateStudentId");
  //     const session = localStorage.getItem("academicSessionId");
  //     const org_id = localStorage.getItem("orgId");
  //     const branch_id = localStorage.getItem("branchId");
  //     const document_type = localStorage.getItem("selectedDocumentType");

  //     // Ensure the Document No. is split and validated
  //     const [prefix, ...rest] = (formData.document_no || "").split("/");
  //     const postfix = rest.join("/");

  //     if (!prefix || !postfix) {
  //       alert("Please provide a valid Document No. in the format 'prefix/postfix'.");
  //       return;
  //     }

  //     // Default value for transfer_certificate_no
  //     const transferCertificateNo = formData.transfer_certificate_no || "4";

  //     // Prepare the payload
  //     const payload = {
  //       student,
  //       session,
  //       org_id,
  //       branch_id,
  //       document_type,
  //       transfer_certificate_no_prefix: prefix,
  //       transfer_certificate_no_postfix: postfix,
  //       transfer_certificate_no: transferCertificateNo, // Defaulted to 4 if not provided
  //       transfer_certificate_id: 0,
  //       tc_applied_date: formData.tc_applied_date || null,
  //       reason_for_tc: formData.reason_for_tc || "",
  //       tc_issued_date: formData.tc_issued_date || null,
  //       ncc_cadet_details: formData.ncc_cadet_details || "",
  //       games_played_details: formData.games_played_details || "",
  //       general_conduct: formData.general_conduct || "",
  //       other_remarks: formData.other_remarks || "",
  //       status: formData.status || "N",
  //       school_board_last_taken: formData.school_board_last_taken || "",
  //       whether_failed: formData.whether_failed || "",
  //       subjects_studied: formData.subjects_studied || "",
  //       qualified_for_promotion: formData.qualified_for_promotion || "",
  //       month_fee_paid: formData.month_fee_paid || "",
  //       fee_concession_availed: formData.fee_concession_availed || "",
  //       total_no_working_days: formData.total_no_working_days || "",
  //       total_no_working_days_present: formData.total_no_working_days_present || "",
  //       cancelled_on: formData.cancelled_on || null,
  //       cancelled_remarks: formData.cancelled_remarks || "",
  //       cancelled_by: formData.cancelled_by || "",
  //       rollno: formData.rollno || "",
  //       cultural_activities: formData.cultural_activities || "",
  //       other_activities: formData.other_activities || "",
  //       marks_obtained: formData.marks_obtained || "",
  //       from_month: formData.from_month || "",
  //       to_month: formData.to_month || "",
  //       class_last_studied: formData.classId || "", // Mapping classId to class_last_studied
  //     };

  //     // API Call
  //     const response = await fetch(`${ApiUrl.apiurl}transfer-certificate/`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       alert("Character Certificate saved successfully!");
  //       console.log(result);

  //       // After the successful API call, clear the specified fields from localStorage
  //       // Retain the specific fields
  //       const academicSessionId = localStorage.getItem("academicSessionId");
  //       const branchId = localStorage.getItem("branchId");
  //       const nextAcademicSessionId = localStorage.getItem("nextAcademicSessionId");
  //       const orgId = localStorage.getItem("orgId");

  //       // Clear all other fields from localStorage
  //       localStorage.clear(); // This will clear everything

  //       // Retain the necessary fields after clearing
  //       localStorage.setItem("academicSessionId", academicSessionId);
  //       localStorage.setItem("branchId", branchId);
  //       localStorage.setItem("nextAcademicSessionId", nextAcademicSessionId);
  //       localStorage.setItem("orgId", orgId);

  //       // Navigate to the student certificate page
  //       navigate("/admin/student-certificate");
  //     } else {
  //       const error = await response.json();
  //       alert(`Error saving Transfer Certificate: ${error.message}`);
  //     }
  //   } catch (error) {
  //     console.error("Error while saving:", error);
  //     alert("An error occurred while saving the Transfer Certificate.");
  //   }
  // };

  const handleSave = async () => {
    // Initialize useNavigate inside your function

    try {
      // Validate from_month
      if (!formData.from_month) {
        alert("From Month is required.");
        return; // Stop execution if validation fails
      }

      // Validate to_month
      if (!formData.to_month) {
        alert("To Month is required.");
        return; // Stop execution if validation fails
      }

      // Retrieve values from local storage
      const student = localStorage.getItem("studentId");
      const session = localStorage.getItem("academicSessionId");
      const org_id = localStorage.getItem("orgId");
      const branch_id = localStorage.getItem("branchId");
      const document_type = localStorage.getItem("document_type");
      const transferCertificateId =
        localStorage.getItem("transfer_certificate_id") || 0;
      // Ensure the Document No. is split and validated
      const [prefix, ...rest] = (formData.document_no || "").split("/");
      const postfix = rest.join("/");

      if (!prefix || !postfix) {
        alert(
          "Please provide a valid Document No. in the format 'prefix/postfix'."
        );
        return;
      }

      // Default value for transfer_certificate_no
      const transferCertificateNo = formData.transfer_certificate_no || "";

      // Get current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0]; // Get the date part (YYYY-MM-DD)

      // Prepare the payload
      const payload = {
        student,
        session,
        org_id,
        branch_id,
        document_type,
        transfer_certificate_no_prefix: prefix,
        transfer_certificate_no_postfix: postfix,
        transfer_certificate_no: transferCertificateNo,
        transfer_certificate_id: 0,
        tc_applied_date: currentDate,
        reason_for_tc: formData.reason_for_tc || "",
        tc_issued_date: formData.tc_issued_date || null,
        ncc_cadet_details: formData.ncc_cadet_details || "",
        games_played_details: formData.games_played_details || "",
        general_conduct: formData.general_conduct || "",
        other_remarks: formData.other_remarks || "",
        status: formData.status || "A", // Ensure 'A' is passed if no value is selected
        school_board_last_taken: formData.school_board_last_taken || "",
        whether_failed: formData.whether_failed || "",
        subjects_studied: formData.subjects_studied || "",
        qualified_for_promotion: formData.qualified_for_promotion || "",
        transfer_certificate_id: transferCertificateId,
        month_fee_paid: formData.month_fee_paid || "",
        fee_concession_availed: formData.fee_concession_availed || "",
        total_no_working_days: formData.total_no_working_days || "",
        total_no_working_days_present:
          formData.total_no_working_days_present || "",
        cancelled_on: formData.cancelled_on || null,
        cancelled_remarks: formData.cancelled_remarks || "",
        cancelled_by: formData.cancelled_by || "",
        rollno: formData.rollno || "",
        cultural_activities: formData.cultural_activities || "",
        other_activities: formData.other_activities || "",
        marks_obtained: formData.marks_obtained || "",
        from_month: formData.from_month || "",
        to_month: formData.to_month || "",
        class_last_studied: formData.classId || "",
      };

      // API Call
      const response = await fetch(`${ApiUrl.apiurl}transfer-certificate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Fee Certificate saved successfully!");
        console.log(result);

        const academicSessionId = localStorage.getItem("academicSessionId");
        const branchId = localStorage.getItem("branchId");
        const nextAcademicSessionId = localStorage.getItem(
          "nextAcademicSessionId"
        );
        const orgId = localStorage.getItem("orgId");

        // Clear all other fields from localStorage
        localStorage.clear(); // This will clear everything

        // Retain the necessary fields after clearing
        localStorage.setItem("academicSessionId", academicSessionId);
        localStorage.setItem("branchId", branchId);
        localStorage.setItem("nextAcademicSessionId", nextAcademicSessionId);
        localStorage.setItem("orgId", orgId);

        // Navigate to the new page after successful save
        navigate("/admin/student-certificate");
      } else {
        const error = await response.json();
        alert(`Error saving Transfer Certificate: ${error.message}`);
      }
    } catch (error) {
      console.error("Error while saving:", error);
      alert("An error occurred while saving the Transfer Certificate.");
    }
  };

  const handleClearForm = () => {
    setFormData({
      document_no: "",
      transfer_certificate_no_prefix: "",
      transfer_certificate_no_postfix: "",
      transfer_certificate_no: "",
      tc_applied_date: "",
      reason_for_tc: "",
      tc_issued_date: "",
      ncc_cadet_details: "",
      games_played_details: "",
      general_conduct: "",
      other_remarks: "",
      status: "A",
      school_board_last_taken: "",
      whether_failed: "",
      subjects_studied: "",
      qualified_for_promotion: "",
      month_fee_paid: "",
      fee_concession_availed: "",
      total_no_working_days: "",
      total_no_working_days_present: "",
      cancelled_on: "",
      cancelled_remarks: "",
      cancelled_by: "",
      rollno: "",
      cultural_activities: "",
      other_activities: "",
      marks_obtained: "",
      from_month: "",
      to_month: "",
      classId: "",
      studentname: "",
      father_name: "",
      mother_name: "",
      school_admission_no: "",
      barcode: "",
    });

    setSelectedClassId("");
    localStorage.removeItem("selectedStudentClassId");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <h3 className="text-center mb-4">Character Certificate</h3>
              <div className="row mb-2 mt-3 mx-0">
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleClearForm}
                  >
                    {" "}
                    Clear{" "}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleClose}
                  >
                    {" "}
                    Close{" "}
                  </button>
                </div>
              </div>
              <form>
                <div className="col-12 mb-3  mt-3 custom-section-box">
                  <div className="row mb-3">
                    <div className="col-md-6 d-flex align-items-center">
                      <label
                        className="form-label me-3"
                        style={{ width: "200px" }}
                      >
                        Document No.
                      </label>
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        defaultValue={formData.document_no || ""}
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          // Extract prefix and postfix based on the example format "4/2024-25"
                          const [prefix, ...rest] = value.split("/"); // Split on "/"
                          const postfix = rest.join("/"); // Join the remaining parts for postfix

                          setFormData({
                            ...formData,
                            document_no: value,
                            transfer_certificate_no_prefix: prefix || "", // "4"
                            transfer_certificate_no_postfix: postfix || "", // "2024-25"
                          });
                        }}
                      />
                    </div>

                    <div className="col-md-6 d-flex align-items-center">
                      <label
                        className="form-label me-3"
                        style={{ width: "200px" }}
                      >
                        {" "}
                        School Admission No.{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        defaultValue={formData.school_admission_no || ""}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6 d-flex align-items-center">
                      <label
                        className="form-label me-3"
                        style={{ width: "200px" }}
                      >
                        {" "}
                        Student Barcode{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        defaultValue={formData.barcode || ""}
                      />
                    </div>
                    <div className="col-md-6 d-flex align-items-center">
                      <label
                        className="form-label me-3"
                        style={{ width: "200px" }}
                      >
                        {" "}
                        Cancellation Remarks{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        defaultValue={formData.cancellationRemarks || ""}
                      />
                    </div>
                    <div className="col-md-6 d-flex align-items-center">
                      <label
                        className="form-label me-3"
                        style={{ width: "200px" }}
                      >
                        {" "}
                        Cancelled On{" "}
                      </label>
                      <input
                        type="date"
                        className="form-control disabled"
                        disabled
                        defaultValue={formData.cancelledOn || ""}
                      />
                    </div>
                    <div className="col-md-6 d-flex align-items-center">
                      <label
                        className="form-label me-3"
                        style={{ width: "200px" }}
                      >
                        Status
                      </label>
                      <select
                        className="form-select"
                        value={formData.status || "A"} // This sets the default value to 'A'
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                      >
                        <option value="A">Approved</option>
                        <option value="C">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Additional fields */}
                <ul className="list-unstyled  mb-3 mt-3 custom-section-box">
                  <li className="mb-3 d-flex mt-3 align-items-center">
                    <span className="col-sm-1 text-end">1.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      Student Name
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        defaultValue={formData.studentname || ""}
                      />{" "}
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">2.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      Father's/ Guardian's Name
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        defaultValue={formData.father_name || ""}
                      />
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">3.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      Mother's Name
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        defaultValue={formData.mother_name || ""}
                      />
                    </div>
                  </li>

                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">4.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      Date of birth (in Christian Era) according to the
                      Admission Register (in figures) (in words)
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        defaultValue={formData.dob || ""}
                      />
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">3.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      Class{" "}
                    </label>
                    <div className="col-sm-2">
                      <select
                        id="admitted-class"
                        className="form-select"
                        value={formData.classId}
                        onChange={handleClassChange}
                        required
                      >
                        <option value="">Select Class</option>
                        {classes.map((classItem) => (
                          <option key={classItem.id} value={classItem.id}>
                            {classItem.classname}
                          </option>
                        ))}
                      </select>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">6.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      CBSE Registration No{" "}
                    </label>
                    <div className="col-sm-8">
                      {" "}
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        placeholder=""
                      />{" "}
                    </div>
                  </li>

                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">7.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      Board Roll No.{" "}
                    </label>
                    <div className="col-sm-8">
                      {" "}
                      <input
                        type="text"
                        className="form-control detail"
                        placeholder=""
                        value={formData.rollno || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, rollno: e.target.value })
                        }
                      />{" "}
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">8.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      Marks{" "}
                    </label>
                    <div className="col-sm-8">
                      {" "}
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        placeholder=""
                        value={formData.marks_obtained || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            marks_obtained: e.target.value,
                          })
                        }
                      />{" "}
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">9.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      Subjects{" "}
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control detail"
                        // disabled={isFieldsDisabled}

                        value={formData.subjects_studied || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            subjects_studied: e.target.value,
                          })
                        }
                      />
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">10.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      Conduct and Behaviour{" "}
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control "
                        placeholder=""
                        value={formData.general_conduct || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            general_conduct: e.target.value,
                          })
                        }
                      />
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">11.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      NSS/NCC/SCOUT/GUIDE{" "}
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control "
                        placeholder=""
                        value={formData.ncc_cadet_details || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ncc_cadet_details: e.target.value,
                          })
                        }
                      />
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">12.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      CULTURAL ACTIVITIES{" "}
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control "
                        placeholder=""
                        value={formData.cultural_activities || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cultural_activities: e.target.value,
                          })
                        }
                      />
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">13.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      GAMES & SPORTS
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control "
                        // defaultValue={formData.total_working_day || "0"}
                        value={formData.games_played_details}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            games_played_details: e.target.value,
                          })
                        }
                      />
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">14.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      OTHER ACTIVITIES
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control "
                        // defaultValue={formData.total_present_day || "0"}
                        value={formData.other_activities}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            other_activities: e.target.value,
                          })
                        }
                      />
                    </div>
                  </li>

                  {/* <li className="mb-3 d-flex align-items-center">
            <span className="col-sm-1 text-end">20.</span>
            <label className="col-sm-3 col-form-label ms-2">  Date of Application for Certificate*  </label>
            <div className="col-sm-8">  <input type="date" className="form-control" />   </div>
          </li> */}

                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">15.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      Date of Application for Certificate
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="date"
                        className="form-control disabled"
                        disabled
                        value={formData.tc_applied_date || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tc_applied_date: e.target.value,
                          })
                        }
                      />
                    </div>
                  </li>

                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">16.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      Date of Issue of Certificate
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-sm-8">
                      {" "}
                      <input
                        type="date"
                        className="form-control detail"
                        value={formData.tc_issued_date || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tc_issued_date: e.target.value,
                          })
                        }
                      />{" "}
                    </div>
                  </li>

                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">17.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      Remarks{" "}
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control detail"
                        placeholder="Enter remarks"
                        style={{ resize: "both", overflow: "auto" }}
                        rows="3"
                        value={formData.other_remarks || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            other_remarks: e.target.value,
                          })
                        }
                      />
                    </div>
                  </li>
                </ul>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferCertificateForm;
