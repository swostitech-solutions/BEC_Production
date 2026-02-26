import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";

const StaffNewFollowUp = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [communicationDetails, setCommunicationDetails] = useState("");
  const [remarks, setRemarks] = useState("");
  const [students, setStudents] = useState([]);
  const maxCharacters = 5000;
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCommunicatedWith, setSelectedCommunicatedWith] =
    useState(null);
  const [selectedCommunicatedVia, setSelectedCommunicatedVia] = useState(null);

  const userId = sessionStorage.getItem("userId");

  const handleClear = () => {
    setSelectedDate("");
    // Don't clear selectedMentor if it's the logged-in user
    // setSelectedMentor(null); 
    setSelectedStudent(null);
    setSelectedCommunicatedWith(null);
    setSelectedCommunicatedVia(null);
    setCommunicationDetails("");
    setRemarks("");
  };

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const orgId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
        const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");

        const response = await fetch(
          `${ApiUrl.apiurl}Teacher/GetEmployeeList/?orgId=${orgId}&branchId=${branchId}`
        );
        const data = await response.json();
        if (data && data.data) {
          let formattedMentors = data.data.map((mentor) => ({
            value: mentor.id,
            label: mentor.employeeName,
          }));

          // Filter for logged-in user if userId exists (Staff Logic)
          if (userId) {
            const loggedInMentor = formattedMentors.find(m => String(m.value) === String(userId));
            if (loggedInMentor) {
              formattedMentors = [loggedInMentor];
              setSelectedMentor(loggedInMentor);
            }
          }

          setMentors(formattedMentors);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };

    fetchMentors();
  }, [userId]);

  useEffect(() => {
    if (!selectedMentor) {
      setStudents([]);
      return;
    }

    const fetchStudents = async () => {
      try {
        const orgId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
        const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");
        const academicYearId = localStorage.getItem("academicSessionId");

        if (!orgId || !branchId || !academicYearId) {
          console.error("Missing required parameters for fetching students");
          setStudents([]);
          return;
        }

        const url = `${ApiUrl.apiurl}Mentor/mentorWiseStudentList/?academic_year_id=${academicYearId}&org_id=${orgId}&branch_id=${branchId}&teacher_id=${selectedMentor.value}`;

        console.log("Fetching students for mentor:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.message === "success" && Array.isArray(result.data)) {
          const formattedStudents = result.data.map((student) => ({
            value: student.student_id,
            label: student.student_name || `${student.admission_no || ""} - ${student.student_name || "Unknown"}`,
            // Store additional info for potential future use
            fullData: student,
          }));
          setStudents(formattedStudents);
          console.log(`Loaded ${formattedStudents.length} students for mentor`);
        } else {
          console.warn("Unexpected response format:", result);
          setStudents([]);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        alert("Failed to fetch students. Please try again.");
        setStudents([]);
      }
    };

    fetchStudents();
  }, [selectedMentor]);

  const communicatedWithOptions = [
    { value: "STUDENT", label: "Student" },
    { value: "PARENT", label: "Parent" },
    { value: "GUARDIAN", label: "Guardian" },
    { value: "FATHER", label: "Father" },
    { value: "MOTHER", label: "Mother" },
    { value: "OTHER", label: "Other" },
  ];

  const communicatedViaOptions = [
    { value: "PHONE", label: "Phone" },
    { value: "EMAIL", label: "Email" },
    { value: "IN_PERSON", label: "In Person" },
    { value: "SMS", label: "SMS" },
    { value: "WHATSAPP", label: "WhatsApp" },
    { value: "VIDEO_CALL", label: "Video Call" },
    { value: "LETTER", label: "Letter" },
    { value: "OTHER", label: "Other" },
  ];

  const handleSave = async () => {
    // Validation
    if (
      !selectedDate ||
      !selectedMentor ||
      !selectedStudent ||
      !selectedCommunicatedWith ||
      !selectedCommunicatedVia
    ) {
      alert("Please fill all required fields.");
      return;
    }

    // Get required IDs - check localStorage first (as user mentioned org and batch are stored there)
    const orgId = parseInt(
      localStorage.getItem("organization_id") ||
      localStorage.getItem("orgId") ||
      sessionStorage.getItem("organization_id") ||
      "0",
      10
    );
    const branchId = parseInt(
      localStorage.getItem("branch_id") ||
      localStorage.getItem("branchId") ||
      localStorage.getItem("batch_id") ||
      sessionStorage.getItem("branch_id") ||
      "0",
      10
    );

    // Get academic_year_id from selected student data (stored in fullData)
    let academicYearId = null;
    if (selectedStudent.fullData && selectedStudent.fullData.academic_year_id) {
      academicYearId = parseInt(selectedStudent.fullData.academic_year_id, 10);
      console.log("Using academic_year_id from student data:", academicYearId);
    } else {
      // Fallback to localStorage
      academicYearId = parseInt(localStorage.getItem("academicSessionId") || "0", 10);
      console.log("Using academic_year_id from localStorage:", academicYearId);
    }

    const createdBy = sessionStorage.getItem("userId") || localStorage.getItem("userId");

    console.log("Form submission data:", {
      orgId,
      branchId,
      academicYearId,
      createdBy,
      studentData: selectedStudent.fullData
    });

    // Validate required fields
    if (!orgId || orgId === 0) {
      alert("Missing organization information. Please ensure you are properly logged in.");
      console.error("Organization ID not found. Available keys:", {
        sessionStorage: sessionStorage.getItem("organization_id"),
        localStorage: localStorage.getItem("organization_id") || localStorage.getItem("orgId")
      });
      return;
    }

    if (!branchId || branchId === 0) {
      alert("Missing branch/batch information. Please ensure you are properly logged in.");
      console.error("Branch ID not found. Available keys:", {
        sessionStorage: sessionStorage.getItem("branch_id"),
        localStorage: localStorage.getItem("branch_id") || localStorage.getItem("branchId") || localStorage.getItem("batch_id")
      });
      return;
    }

    if (!academicYearId || academicYearId === 0) {
      alert("Missing academic year information. Please select a student first.");
      console.error("Academic Year ID not found. Student data:", selectedStudent);
      return;
    }


    // Date is already in YYYY-MM-DD format from input type="date"
    const communicationDate = selectedDate;

    // IMPORTANT: The backend expects mentor_id (from MENTOR_mentor table), not employee_id
    // We need to fetch the mentor_id that corresponds to this teacher/employee
    let mentorId = null;
    try {
      // Fetch all mentors (GET endpoint returns array, not paginated)
      const mentorResponse = await fetch(
        `${ApiUrl.apiurl}Mentor/mentors/`
      );
      const mentorData = await mentorResponse.json();

      // Filter for the current employee in the current org/branch
      if (Array.isArray(mentorData) && mentorData.length > 0) {
        const matchingMentor = mentorData.find(
          m => m.employee === parseInt(selectedMentor.value, 10) &&
            m.organization === orgId &&
            m.branch === branchId &&
            m.is_active === true
        );

        if (matchingMentor) {
          mentorId = matchingMentor.id;
          console.log("Found existing mentor ID:", mentorId, "for employee ID:", selectedMentor.value);
        } else {
          alert("Error: Mentor record not found for the logged-in teacher. Please contact administrator.");
          console.error("No mentor found for employee:", selectedMentor.value, "org:", orgId, "branch:", branchId);
          console.log("Available mentors:", mentorData);
          return;
        }
      } else {
        alert("Error: No mentor records found. Please contact administrator.");
        console.error("No mentors returned from API:", mentorData);
        return;
      }
    } catch (error) {
      console.error("Error fetching mentor ID:", error);
      alert("Failed to fetch mentor information. Please try again.");
      return;
    }

    // Build payload according to new API structure
    const payload = {
      organization: orgId,
      branch: branchId,
      academic_year: academicYearId,
      mentor: mentorId, // Use the mentor ID, not employee ID
      student: parseInt(selectedStudent.value, 10),
      communication_date: communicationDate,
      communicated_with: selectedCommunicatedWith.value,
      communicated_via: selectedCommunicatedVia.value,
      communication_details: communicationDetails.trim() || "",
      remarks: remarks.trim() || "",
      created_by: createdBy,
    };


    // POST /api/Mentor_Student_Communication/studentcommunicationSearchList/
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}Mentor_Student_Communication/studentcommunicationSearchList/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok && data.message?.toLowerCase().includes("success")) {
        alert("Communication record saved successfully!");
        // Clear the form
        handleClear();
      } else {
        alert(`Error: ${data.message || data.error || "Something went wrong!"}`);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data: " + error.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                STUDENT MENTOR COMMUNICATION
              </p>
              <div className="row mb-2 mt-3 mx-0">
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
                    onClick={handleClear}
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={() => navigate("/staff/follow-up")}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mt-2">
                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="date" className="form-label">
                          Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          className="form-control detail"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          placeholder="Select date"
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="mentor" className="form-label ">
                          Mentor
                        </label>
                        <Select
                          id="mentor"
                          options={mentors}
                          className="detail"
                          value={selectedMentor}
                          onChange={setSelectedMentor}
                          placeholder="Select Mentor"
                          classNamePrefix="mentor-dropdown"
                          isDisabled={true}
                        />
                      </div>
                      {/* Student Dropdown (Appears only if mentor is selected) */}
                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="student-name" className="form-label ">
                          Student Name
                        </label>
                        <Select
                          id="student-name"
                          classNamePrefix="student-name-dropdown"
                          className="flex-grow-1 detail"
                          options={students} // Dropdown values appear only after selecting a mentor
                          placeholder="Select Student"
                          isDisabled={!selectedMentor} // Disables dropdown until a mentor is selected
                          value={selectedStudent}
                          onChange={setSelectedStudent}
                        />
                      </div>
                      {/* Communicated With Dropdown */}
                      <div className="col-12 col-md-3 mb-4 ">
                        <label
                          htmlFor="communicated-with"
                          className="form-label"
                        >
                          Communicated With*
                        </label>
                        <Select
                          id="communicated-with"
                          classNamePrefix="communicated-with-dropdown"
                          className="flex-grow-1 detail"
                          options={communicatedWithOptions}
                          value={selectedCommunicatedWith}
                          onChange={setSelectedCommunicatedWith}
                          placeholder="Select "
                        />
                      </div>

                      {/* Communicated Via Dropdown */}
                      <div className="col-12 col-md-3 mb-4">
                        <label
                          htmlFor="communicated-via"
                          className="form-label "
                        >
                          Communicated Via*
                        </label>
                        <Select
                          id="communicated-via"
                          classNamePrefix="communicated-via-dropdown"
                          className="flex-grow-1 detail"
                          options={communicatedViaOptions}
                          placeholder="Select"
                          value={selectedCommunicatedVia}
                          onChange={setSelectedCommunicatedVia}
                        />
                      </div>
                      {/* Communication Details Input Field */}
                      <div className="col-12 col-md-6 mb-4 ">
                        <label
                          htmlFor="communication-details"
                          className="form-label"
                        >
                          Communication Details (Optional)
                        </label>
                        <textarea
                          id="communication-details"
                          className="form-control detail"
                          rows="4"
                          maxLength={maxCharacters}
                          style={{ height: "100px" }}
                          value={communicationDetails}
                          onChange={(e) =>
                            setCommunicationDetails(e.target.value)
                          }
                          placeholder="Enter communication details..."
                        />
                        <small className="text-muted">
                          {maxCharacters - communicationDetails.length} characters remaining
                        </small>
                      </div>
                      {/* Remarks Input Field (Optional) */}
                      <div className="col-12 col-md-6 mb-4 ">
                        <label
                          htmlFor="remarks"
                          className="form-label"
                        >
                          Remarks (Optional)
                        </label>
                        <textarea
                          id="remarks"
                          className="form-control detail"
                          rows="4"
                          style={{ height: "100px" }}
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Enter any additional remarks..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffNewFollowUp;
