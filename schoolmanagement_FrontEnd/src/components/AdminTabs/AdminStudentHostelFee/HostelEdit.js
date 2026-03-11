import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
const HostelEdit = ({
  show,
  handleClose,
  studentData,
  transportDetails,
  onUpdate,
}) => {
  const [hostelAvailed, setHostelAvailed] = useState(false);
  const [monthStatus, setMonthStatus] = useState([]);
  const [paidHostelSemesterIds, setPaidHostelSemesterIds] = useState([]);

  // useEffect(() => {
  //   if (!transportDetails) return;

  //   let selectedSemesters = [];

  //   try {
  //     selectedSemesters = typeof transportDetails.hostel_choice_semester === "string"
  //       ? JSON.parse(transportDetails.hostel_choice_semester)
  //       : transportDetails.hostel_choice_semester || [];
  //   } catch {
  //     selectedSemesters = [];
  //   }

  //   const semestersArray = Array.from(
  //     { length: transportDetails.total_semesters || 0 },
  //     (_, index) => {
  //       const id = index + 1;
  //       return {
  //         id,
  //         name: `${id} Semester`,
  //         checked: selectedSemesters.includes(id),
  //         disabled: selectedSemesters.includes(id) // 🔥 DISABLE FROM API
  //       };
  //     }
  //   );

  //   setMonthStatus(semestersArray);
  // }, [transportDetails]);

  useEffect(() => {
    if (!transportDetails) return;

    // ✅ selected hostel semesters
    let selectedSemesters = [];
    try {
      selectedSemesters =
        typeof transportDetails.hostel_choice_semester === "string"
          ? JSON.parse(transportDetails.hostel_choice_semester)
          : transportDetails.hostel_choice_semester || [];
    } catch {
      selectedSemesters = [];
    }

    // ✅ PAID hostel semesters (LOCKED)
    const paidIds = Array.isArray(transportDetails.hostel_paid_sems)
      ? transportDetails.hostel_paid_sems.map((s) => s.semester_id)
      : [];

    setPaidHostelSemesterIds(paidIds);

    // Helper to extract numeric value
    const getNumber = (name) => {
      if (!name) return 0;
      const match = name.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };

    let currentSemNum = 0;
    const semName = transportDetails.semester_name || "";

    // If Semester is "Default", use Academic Year to calculate restrictions
    if (semName.toLowerCase().includes("default")) {
      const yearVal = getNumber(transportDetails.academic_year);
      // If 1st Year (1) -> start at 1.
      // If 2nd Year (2) -> start at 3 (disable 1,2).
      // If 3rd Year (3) -> start at 5 (disable 1,2,3,4).
      if (yearVal > 0) {
        currentSemNum = (yearVal - 1) * 2 + 1;
      } else {
        currentSemNum = 1;
      }
    } else {
      // Normal Case: Extract number from "1st Semester"
      currentSemNum = getNumber(semName);
    }

    const semestersArray = Array.from(
      { length: transportDetails.total_semesters || 0 },
      (_, index) => {
        const id = index + 1;
        const isPastSemester = id < currentSemNum; // Disable previous semesters

        return {
          id,
          name: `${id} Semester`,
          checked: selectedSemesters.includes(id),
          disabled: paidIds.includes(id) || isPastSemester, // 🔒 DISABLE PAID & PAST SEMESTERS
        };
      }
    );

    setMonthStatus(semestersArray);
  }, [transportDetails]);

  useEffect(() => {
    if (!transportDetails) return;

    setHostelAvailed(
      transportDetails.hostel_availed === true ||
      transportDetails.hostel_availed === "true"
    );
  }, [transportDetails]);

  const handleMonthToggle = (id) => {
    setMonthStatus((prev) =>
      prev.map((month) =>
        month.id === id && !month.disabled
          ? { ...month, checked: !month.checked }
          : month
      )
    );
  };

  const handleSaveChanges = async () => {
    if (!studentData?.student_id) {
      alert("Student ID is missing!");
      return;
    }

    const token = localStorage.getItem("accessToken");
    const userId = sessionStorage.getItem("userId"); // created_by
    const organizationId = sessionStorage.getItem("organization_id") || 1;
    const branchId = sessionStorage.getItem("branch_id") || 1;

    if (!userId) {
      alert("User ID is missing in session!");
      return;
    }

    // const selectedSemesterIds = monthStatus
    //   .filter((month) => month.checked)
    //   .map((month) => month.id);
    const selectedSemesterIds = monthStatus
      .filter((month) => month.checked && !month.disabled) // 🚀 ONLY USER SELECTED
      .map((month) => month.id);

    // if (selectedSemesterIds.length === 0) {
    //   alert("Please select at least one semester.");
    //   return;
    // }

    const payload = {
      organization_id: Number(organizationId),
      branch_id: Number(branchId),
      created_by: Number(userId),
      student_id: Number(studentData.student_id),
      hostel_avail: hostelAvailed,
      choice_semester_ids: selectedSemesterIds,
    };

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}HOSTEL/UpdateStudentHostel/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to update hostel details");

      alert("✅ Hostel details updated successfully!");
      if (onUpdate) onUpdate(); // 🔥 Refresh table in main page
      handleClose();
    } catch (error) {
      console.error("Error updating hostel:", error);
      alert("Failed to update hostel details. Please try again.");
    }
  };

  // const handleHostelAvailedToggle = () => {
  //   const newValue = !hostelAvailed;
  //   setHostelAvailed(newValue);

  //   const updatedMonths = monthStatus.map((m) => {
  //     // 🔒 If semester is PAID (disabled), do NOT change its checked state
  //     if (m.disabled) {
  //       return m;
  //     }

  //     // Otherwise toggle based on Hostel Availed checkbox
  //     return {
  //       ...m,
  //       checked: newValue,
  //     };
  //   });

  //   setMonthStatus(updatedMonths);
  // };

  const handleHostelAvailedToggle = () => {
    const newValue = !hostelAvailed;
    setHostelAvailed(newValue);

    // If Hostel Availed is turned OFF → clear only unpaid semesters
    if (!newValue) {
      const updatedMonths = monthStatus.map((m) => {
        // 🔒 Do not touch paid (disabled) semesters
        if (m.disabled) return m;

        return {
          ...m,
          checked: false,
        };
      });

      setMonthStatus(updatedMonths);
    }

    // If Hostel Availed is turned ON → do NOTHING
    // User will manually select semesters
  };

  const currentMonth = new Date().getMonth() + 1;

  if (!studentData) {
    console.log("No Student Data Found");
    return null;
  }
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Hostel Details</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "75vh", overflowY: "auto" }}>
        {/* Search Section */}
        <div className="container-fluid">
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveChanges}
            >
              Save
            </Button>
            <Button type="button" className="btn btn-secondary">
              Clear
            </Button>
            <Button
              onClick={handleClose}
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
            >
              Close
            </Button>
          </div>
          {/* Student Info */}
          <div className="border p-3 rounded">
            <div className="row g-2">
              <div className="col-md-4">
                <label className="form-label">Student Name</label>
                <input
                  type="text"
                  className="form-control detail"
                  value={studentData.student_name || ""}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Admission No</label>
                <input
                  type="text"
                  className="form-control detail"
                  value={
                    transportDetails?.admission_no ||
                    studentData.college_admission_no
                  }
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Student Barcode</label>
                <input
                  type="text"
                  className="form-control detail"
                  value={studentData.barcode || ""}
                  readOnly
                  disabled
                />
              </div>
            </div>
            <div className="row g-2 mt-2">
              <div className="col-md-4">
                <label className="form-label">Father Name</label>
                <input
                  type="text"
                  className="form-control detail"
                  value={transportDetails?.father_name || ""}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Mother Name</label>
                <input
                  type="text"
                  className="form-control detail"
                  value={transportDetails?.mother_name || ""}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label className="form-label"> Registration No</label>
                <input
                  type="text"
                  className="form-control detail"
                  value={studentData.registration_no || ""}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>
          {/* Transport Details */}
          <div className="border p-3 rounded mt-3">
            <fieldset className="p-3">
              <legend className="fw-bold">Student Hostel Details</legend>
              <div className="d-flex justify-content-end">
                <label className="form-check-label fw-bold">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={hostelAvailed}
                    onChange={handleHostelAvailedToggle}
                  />
                  Hostel Availed
                </label>
              </div>
              {/* Months Selection */}
              <div className="row g-2 mt-3">
                {monthStatus && monthStatus.length > 0 ? (
                  monthStatus.map((month) => (
                    <div key={month.id} className="form-check mb-2">
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={month.checked}
                        disabled={month.disabled || !hostelAvailed} // Only enable if Hostel Availed is checked
                        onChange={() => {
                          if (!month.disabled && hostelAvailed) {
                            handleMonthToggle(month.id);
                          }
                        }}
                      />
                      <label className="form-check-label">{month.name}</label>
                    </div>
                  ))
                ) : (
                  <p>No semester data found</p>
                )}
              </div>
            </fieldset>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default HostelEdit;

