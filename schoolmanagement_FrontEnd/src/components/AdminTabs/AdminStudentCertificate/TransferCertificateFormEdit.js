import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import  useCourses from "../../hooks/useFetchClasses";
import { ApiUrl } from "../../../ApiUrl"
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

  useEffect(() => {
    const documentType = localStorage.getItem("selectedDocumentType");
    if (documentType === "TC") {
      setIsFieldsDisabled(true);
    }
  }, []);

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


  const handleSave = async () => {
    // Initialize useNavigate inside your function

    try {
      // Validate from_month
      // if (!formData.from_month) {
      //   alert("From Month is required.");
      //   return; // Stop execution if validation fails
      // }

      // // Validate to_month
      // if (!formData.to_month) {
      //   alert("To Month is required.");
      //   return; // Stop execution if validation fails
      // }

      // Retrieve values from local storage
      const student = localStorage.getItem("studentId");
      const session = localStorage.getItem("academicSessionId");
      const org_id = localStorage.getItem("orgId");
      const branch_id = localStorage.getItem("branchId");
      const document_type = localStorage.getItem("document_type");
      const transferCertificateId = localStorage.getItem("transfer_certificate_id") || 0;
      // Ensure the Document No. is split and validated
      const [prefix, ...rest] = (formData.document_no || "").split("/");
      const postfix = rest.join("/");

      if (!prefix || !postfix) {
        alert("Please provide a valid Document No. in the format 'prefix/postfix'.");
        return;
      }

      // Default value for transfer_certificate_no
      const transferCertificateNo = formData.transfer_certificate_no || "";

      // Get current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split('T')[0]; // Get the date part (YYYY-MM-DD)

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
        total_no_working_days_present: formData.total_no_working_days_present || "",
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
        const nextAcademicSessionId = localStorage.getItem("nextAcademicSessionId");
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


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card-body">
            <div className="card p-0">
              <h3 className="text-center mb-4">Transfer Certificate</h3>
              <div className="row mb-2 mt-3 mx-0">
                <div className="col-12 mb-3 mt-3 d-flex flex-wrap gap-2">
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
                    className="btn btn-secondary me-2"
                    style={{
                      width: "150px",
                    }}
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
                <div className="col-12 mb-3 ms-2 custom-section-box">
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
                        className="detail"
                        value={formData.status || "A"} // This sets the default value to 'A'
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                      >
                        {/* <option value="">Select Gender</option> */}
                        <option value="A">Approved</option>
                        <option value="C">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Additional fields */}
                <ul className="list-unstyled  mb-3 mt-3 mx-1 custom-section-box">
                  <li className="mb-3 d-flex  align-items-center">
                    <span className="col-sm-1 text-end">1.</span>
                    <label className="col-sm-3 col-form-label mt-2 ms-2 ">
                      Pupil Student Name
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        // defaultValue={formData.studentname || ""}
                        defaultValue={formData.studentname || ""}
                      />{" "}
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">2.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      Father's/ Guardian's Name
                    </label>
                    <div className="col-sm-6">
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
                    <div className="col-sm-6">
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
                      Nationality
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        defaultValue={formData.nationality || ""}
                      />
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">5.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      Whether the candidate belongs to SC/ST/OBC
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        defaultValue={formData.category || ""}
                      />
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">6.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      Date of admission in the school
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        defaultValue={formData.date_of_admission || ""}
                      />
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">7.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      Date of birth (in Christian Era) according to the
                      Admission Register (in figures) (in words)
                    </label>
                    <div className="col-sm-6">
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
                        className="form-control disabled"
                        disabled
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
                    <span className="col-sm-1 text-end">9.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      School/ Board Examination last taken with result{" "}
                    </label>
                    <div className="col-sm-6">
                      {" "}
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        placeholder=""
                        value={formData.school_board_last_taken || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            school_board_last_taken: e.target.value,
                          })
                        }
                      />{" "}
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">10.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      Whether failed, if so, once/twice in the same class{" "}
                    </label>
                    <div className="col-sm-6">
                      {" "}
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        placeholder=""
                        value={formData.whether_failed || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            whether_failed: e.target.value,
                          })
                        }
                      />{" "}
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">11.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      Subjects studied{" "}
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
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
                    <span className="col-sm-1 text-end">12.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      Whether qualified for promotion to the higher class, if
                      yes, to which class{" "}
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        placeholder=""
                        value={formData.qualified_for_promotion || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            qualified_for_promotion: e.target.value,
                          })
                        }
                      />
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">13.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      Month up to which the pupil/student has paid the school
                      dues{" "}
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        placeholder=""
                        value={formData.month_fee_paid || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            month_fee_paid: e.target.value,
                          })
                        }
                      />
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">14.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      Any Fee Concession availed of: if so, the nature of such
                      concession{" "}
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        placeholder=""
                        value={formData.fee_concession_availed || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fee_concession_availed: e.target.value,
                          })
                        }
                      />
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">15.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      Total No. of working days
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        // defaultValue={formData.total_working_day || "0"}
                        value={formData.total_no_working_days || "0"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            total_no_working_days: e.target.value,
                          })
                        }
                      />
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">16.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      Total No. of working days present
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        // defaultValue={formData.total_present_day || "0"}
                        value={formData.total_no_working_days_present || "0"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            total_no_working_days_present: e.target.value,
                          })
                        }
                      />
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">17.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      Whether NCC Cadet/ Boy Scout/ Girl Guide (details may be
                      given){" "}
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
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
                    <span className="col-sm-1 text-end">18.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      Games played or extra-curricular activities in which the
                      pupil/student usually took part (mention achievement level
                      only: State or National){" "}
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        placeholder=""
                        value={formData.games_played_details || ""}
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
                    <span className="col-sm-1 text-end">19.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      General conduct{" "}
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
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
                  {/* <li className="mb-3 d-flex align-items-center">
            <span className="col-sm-1 text-end">20.</span>
            <label className="col-sm-3 col-form-label ms-2">  Date of Application for Certificate*  </label>
            <div className="col-sm-8">  <input type="date" className="form-control" />   </div>
          </li> */}

                  <li className="mb-3 d-flex  mx-2 align-items-center">
                    <span className="col-sm-1 text-end">20.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      Date of Application for Certificate
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-sm-6">
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
                    <span className="col-sm-1 text-end">21.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      Date of Issue of Certificate*{" "}
                    </label>
                    <div className="col-sm-6">
                      {" "}
                      <input
                        type="date"
                        className="form-control disabled"
                        disabled
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
                    <span className="col-sm-1 text-end">22.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      Reason for Leaving the School
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
                        placeholder="Enter reason"
                        value={formData.reason_for_tc || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reason_for_tc: e.target.value,
                          })
                        }
                      />
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">23.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      {" "}
                      Any other remarks{" "}
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control disabled"
                        disabled
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
