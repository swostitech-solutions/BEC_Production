

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import  useCourses from "../../hooks/useFetchClasses";
import { ApiUrl } from "../../../ApiUrl"

const TransferCertificateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [periods, setPeriods] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState({});
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
    const documentType = localStorage.getItem("selectedDocumentType");
    if (documentType === "FC") {
      setIsFieldsDisabled(true);
    }
  }, []);

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
  // const handleClassChange = (e) => {
  //   const classId = e.target.value;
  //   setSelectedClass(classId);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     addmitted_class: classId,
  //   }));
  //   localStorage.setItem("selectedClassId", classId);
  // };

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
      const student = localStorage.getItem("selectedCertificateStudentId");
      const session = localStorage.getItem("academicSessionId");
      const org_id = localStorage.getItem("orgId");
      const branch_id = localStorage.getItem("branchId");
      const document_type = localStorage.getItem("selectedDocumentType");

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
        transfer_certificate_no: transferCertificateNo, // Defaulted to 4 if not provided
        transfer_certificate_id: 0,
        tc_applied_date: currentDate,  // Map current date as tc_applied_date in YYYY-MM-DD format
        reason_for_tc: formData.reason_for_tc || "",
        tc_issued_date: formData.tc_issued_date || null,
        ncc_cadet_details: formData.ncc_cadet_details || "",
        games_played_details: formData.games_played_details || "",
        general_conduct: formData.general_conduct || "",
        other_remarks: formData.other_remarks || "",
        status: formData.status || "N",
        school_board_last_taken: formData.school_board_last_taken || "",
        whether_failed: formData.whether_failed || "",
        subjects_studied: formData.subjects_studied || "",
        qualified_for_promotion: formData.qualified_for_promotion || "",
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
        class_last_studied: formData.classId || "",  // Mapping the classId to class_last_studied
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





  useEffect(() => {
    fetch(`${ApiUrl.apiurl}Periods/GetAllPeriods/`)
      .then((response) =>
        response.ok ? response.json() : Promise.reject(response.status)
      )
      .then((data) => {
        setPeriods(data.data || []);
        const initialMonths = (data.data || []).reduce((acc, period) => {
          acc[period.id] = false;
          return acc;
        }, {});
        setSelectedMonths(initialMonths);
      })
      .catch(() => setError("Failed to load periods."));
  }, []);

  // const handleInputChange = (e) => {
  //   if (isDisabled) return;
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };



  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <h3 className="text-center mb-4">Fee Certificate</h3>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
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
                  
                    Clear
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
                <div className="col-12 mb-3 custom-section-box">
                  <div className="row mb-3 mt-3">
                    <div className="col-md-6 d-flex align-items-center">
                      <label
                        className="form-label me-3"
                        style={{ width: "200px" }}
                      >
                        Document No.
                      </label>
                      <input
                        type="text"
                        className="form-control detail"
                        disabled={isFieldsDisabled}
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
                        className="form-control detail"
                        disabled={isFieldsDisabled}
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
                        className="form-control detail"
                        disabled={isFieldsDisabled}
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
                        className="form-control detail"
                        disabled={isFieldsDisabled}
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
                        className="form-control detail"
                        disabled={isFieldsDisabled}
                        defaultValue={formData.cancelledOn || ""}
                      />
                    </div>
                    <div className="col-md-6 d-flex align-items-center">
                      <label
                        className="form-label me-3"
                        style={{ width: "200px" }}
                      >
                        {" "}
                        Status{" "}
                      </label>
                      <select className="form-select">
                        {" "}
                        <option value="">New</option>{" "}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional fields */}
                <ul className="list-unstyled  mb-3 mt-3 custom-section-box">
                  <li className="mb-3 d-flex  mt-3 align-items-center">
                    <span className="col-sm-1 text-end">1.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      Student Name
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control detail"
                        disabled={isFieldsDisabled}
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
                        className="form-control detail"
                        disabled={isFieldsDisabled}
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
                        className="form-control detail"
                        disabled={isFieldsDisabled}
                        defaultValue={formData.mother_name || ""}
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
                        className="detail"
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

                  {/* <div className="col-12 col-md-4 mb-2">
                        <label htmlFor="admitted-class" className="form-label">
                          Admitted Class<span style={{ color: "red" }}>*</span>
                        </label>
                        {classLoading ? (
                          <p>Loading classes...</p>
                        ) : classError ? (
                          <p>Error loading classes: {classError}</p>
                        ) : (
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
                        )}
                      </div> */}

                  <li className="mb-3 d-flex align-items-center">
                    <span className="col-sm-1 text-end">5.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      From Month<span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-sm-2">
                      <select
                        id="fee-app-from"
                        className="detail"
                        value={formData.from_month} // Bind to `from_month`
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            from_month: e.target.value,
                          })
                        } // Update state on change
                        name="from_month"
                        disabled={isDisabled}
                      >
                        <option value="">Select period</option>
                        {periods.map((period) => (
                          <option key={period.id} value={period.id}>
                            {period.period_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </li>

                  <li className="mb-3 d-flex align-items-center mx-2">
                    <span className="col-sm-1 text-end">5.</span>
                    <label className="col-sm-3 col-form-label ms-2">
                      To Month<span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-sm-2">
                      <select
                        id="fee-app-to"
                        className="detail"
                        value={formData.to_month} // Bind to `to_month`
                        onChange={(e) =>
                          setFormData({ ...formData, to_month: e.target.value })
                        } // Update state on change
                        name="to_month"
                        disabled={isDisabled}
                      >
                        <option value="">Select period</option>
                        {periods.map((period) => (
                          <option key={period.id} value={period.id}>
                            {period.period_name}
                          </option>
                        ))}
                      </select>
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