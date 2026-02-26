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





  return (
    <div className="container p-4 border mt-5 bg-white">
      <h3 className="text-center mb-4">Transfer Certificate</h3>
      <div className="row mb-2">
        <div className="col-12 ">
          <button
            type="button"
            className="btn btn-primary me-2"
            style={{
              width: "150px",
            }}

          >
            Save
          </button>
          <button
            type="button"
            className="btn btn-primary me-2"
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
          // onClick={handleClose}
          >
            {" "}
            Close{" "}
          </button>
        </div>
      </div>
      <form>
        <div className="row mb-3">
          <div className="col-md-6 d-flex align-items-center">
            <label className="form-label me-3" style={{ width: "200px" }}>
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
            <label className="form-label me-3" style={{ width: "200px" }}>
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
            <label className="form-label me-3" style={{ width: "200px" }}>
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
            <label className="form-label me-3" style={{ width: "200px" }}>
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
            <label className="form-label me-3" style={{ width: "200px" }}>
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
            <label className="form-label me-3" style={{ width: "200px" }}>
              Status
            </label>
            <select
              className="form-select"
              value={formData.status || ""} // Default to "N" if no value is set
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value })) // Update status in formData
              }
            >
              <option value="N">New</option>
            </select>
          </div>


        </div>
        {/* Additional fields */}
        <ul className="list-unstyled">
          <li className="mb-3 d-flex align-items-center">
            <span className="col-sm-1 text-end">1.</span>
            <label className="col-sm-3 col-form-label ms-2">
              Pupil Student Name
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control detail"
                disabled={isFieldsDisabled}
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
            <div className="col-sm-8">
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
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control detail"
                disabled={isFieldsDisabled}
                defaultValue={formData.mother_name || ""}
              />
            </div>
          </li>
          <li className="mb-3 d-flex align-items-center">
            <span className="col-sm-1 text-end">4.</span>
            <label className="col-sm-3 col-form-label ms-2">Nationality</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control detail"
                disabled={isFieldsDisabled}
                defaultValue={formData.nationality || ""}
              />
            </div>
          </li>
          <li className="mb-3 d-flex align-items-center">
            <span className="col-sm-1 text-end">5.</span>
            <label className="col-sm-3 col-form-label ms-2">
              Whether the candidate belongs to SC/ST/OBC
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control detail"
                disabled={isFieldsDisabled}
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
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control detail"
                disabled={isFieldsDisabled}
                defaultValue={formData.date_of_admission || ""}
              />
            </div>
          </li>
          <li className="mb-3 d-flex align-items-center">
            <span className="col-sm-1 text-end">7.</span>
            <label className="col-sm-3 col-form-label ms-2">
              {" "}
              Date of birth (in Christian Era) according to the Admission
              Register (in figures) (in words)
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control detail"
                disabled={isFieldsDisabled}
                defaultValue={formData.dob || ""}
              />
            </div>
          </li>
          <li className="mb-3 d-flex align-items-center">
            <span className="col-sm-1 text-end">3.</span>
            <label className="col-sm-3 col-form-label ms-2">
              {" "}
              Class {" "}
            </label>
            <div className="col-sm-2">
              <select
                id="admitted-class"
                className="form-select"
                value={formData.classId}
                onChange={handleClassChange}
                disabled={isFieldsDisabled}
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
            <div className="col-sm-8">
              {" "}
              <input type="text" className="form-control" placeholder=""
                value={formData.school_board_last_taken || ""}
                onChange={(e) =>
                  setFormData({ ...formData, school_board_last_taken: e.target.value })
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
            <div className="col-sm-8">
              {" "}
              <input type="text" className="form-control" placeholder=""
                value={formData.whether_failed || ""}
                onChange={(e) =>
                  setFormData({ ...formData, whether_failed: e.target.value })
                }
              />{" "}
            </div>
          </li>
          <li className="mb-3 d-flex align-items-center">
            <span className="col-sm-1 text-end">11.</span>
            <label className="col-sm-3 col-form-label ms-2">
              Subjects studied{" "}
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control detail"
                // disabled={isFieldsDisabled}

                value={formData.subjects_studied || ""}
                onChange={(e) =>
                  setFormData({ ...formData, subjects_studied: e.target.value })
                }

              />
            </div>
          </li>
          <li className="mb-3 d-flex align-items-center">
            <span className="col-sm-1 text-end">12.</span>
            <label className="col-sm-3 col-form-label ms-2">
              {" "}
              Whether qualified for promotion to the higher class, if yes, to
              which class{" "}
            </label>
            <div className="col-sm-8">
              <input type="text" className="form-control" placeholder=""
                value={formData.qualified_for_promotion || ""}
                onChange={(e) =>
                  setFormData({ ...formData, qualified_for_promotion: e.target.value })
                }
              />
            </div>
          </li>

          <li className="mb-3 d-flex align-items-center">
            <span className="col-sm-1 text-end">20.</span>
            <label className="col-sm-3 col-form-label ms-2">
              Date of Application for Certificate<span style={{ color: "red" }}>*</span>
            </label>
            <div className="col-sm-8">
              <input
                type="date"
                className="form-control"
                value={formData.tc_applied_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tc_applied_date: e.target.value })
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
            <div className="col-sm-8">
              {" "}
              <input type="date" className="form-control"
                value={formData.tc_issued_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tc_issued_date: e.target.value })
                }
              />{" "}
            </div>
          </li>
          <li className="mb-3 d-flex align-items-center">
            <span className="col-sm-1 text-end">22.</span>
            <label className="col-sm-3 col-form-label ms-2">
              {" "}
              Reason for Leaving the School<span style={{ color: "red" }}>*</span>
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                placeholder="Enter reason"
                value={formData.reason_for_tc || ""}
                onChange={(e) =>
                  setFormData({ ...formData, reason_for_tc: e.target.value })
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
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                placeholder="Enter remarks"
                style={{ resize: "both", overflow: "auto" }}
                rows="3"
                value={formData.other_remarks || ""}
                onChange={(e) =>
                  setFormData({ ...formData, other_remarks: e.target.value })
                }
              />
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
};

export default TransferCertificateForm;
