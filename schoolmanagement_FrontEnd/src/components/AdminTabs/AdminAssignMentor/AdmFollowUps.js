import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";

const AdmAttendanceEntry = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedCommunicatedWith, setSelectedCommunicatedWith] = useState(null);
  const [selectedCommunicatedVia, setSelectedCommunicatedVia] = useState(null);

  const dateFromRef = useRef(null);
  const dateToRef = useRef(null);

  const handleClear = () => {
    // Clear input fields
    if (dateFromRef.current) dateFromRef.current.value = "";
    if (dateToRef.current) dateToRef.current.value = "";

    // Clear state variables
    setSelectedStudent(null);
    setSelectedMentor(null);
    setSelectedCommunicatedWith(null);
    setSelectedCommunicatedVia(null);
    setStudents([]);
    setData([]);
  };

  // Options for communicated_with dropdown
  const communicatedWithOptions = [
    { value: "STUDENT", label: "Student" },
    { value: "PARENT", label: "Parent" },
    { value: "GUARDIAN", label: "Guardian" },
    { value: "FATHER", label: "Father" },
    { value: "MOTHER", label: "Mother" },
    { value: "OTHER", label: "Other" },
  ];

  // Options for communicated_via dropdown
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
          // Mapping data to match React Select options format
          const formattedMentors = data.data.map((mentor) => ({
            value: mentor.id,
            label: mentor.employeeName,
          }));
          setMentors(formattedMentors);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };

    fetchMentors();
  }, []);

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
        
        const url = `${ApiUrl.apiurl}Mentor/mentorWiseStudentList/?academic_year_id=${academicYearId}&org_id=${orgId}&branch_id=${branchId}&teacher_id=${selectedMentor.value}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.data) {
          const formattedStudents = data.data.map((student) => ({
            value: student.student_id,
            label: student.student_name,
          }));
          setStudents(formattedStudents);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [selectedMentor]);

  const handleSearch = async () => {
    const orgId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
    const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");
    const academicYearId = localStorage.getItem("academicSessionId");

    if (!branchId || !orgId || !academicYearId) {
      alert("Mandatory fields are missing: organization, branch, or academic year");
      return;
    }

    // Build query parameters
    const params = new URLSearchParams({
      academic_year_id: academicYearId,
      org_id: orgId,
      branch_id: branchId,
    });

    // Add optional filters
    if (selectedStudent?.value) {
      params.append("student_id", selectedStudent.value);
    }

    if (selectedMentor?.value) {
      params.append("teacher_id", selectedMentor.value);
      params.append("mentor_id", selectedMentor.value);
    }

    if (dateFromRef.current?.value) {
      params.append("date_from", dateFromRef.current.value);
    }

    if (dateToRef.current?.value) {
      params.append("date_to", dateToRef.current.value);
    }

    if (selectedCommunicatedWith?.value) {
      params.append("communicated_with", selectedCommunicatedWith.value);
    }

    if (selectedCommunicatedVia?.value) {
      params.append("communicated_via", selectedCommunicatedVia.value);
    }

    const apiUrl = `${ApiUrl.apiurl}Mentor_Student_Communication/studentcommunicationSearchList/?${params.toString()}`;

    try {
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (result.message === "success") {
        setData(result.data || []);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("An error occurred while fetching data: " + error.message);
      setData([]);
    }
  };

  const handleAssignMentorClick = () => {
    navigate("/admin/student-mentor-communication");
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
                STUDENT MENTOR
              </p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleAssignMentorClick} // Navigate to the mentor assignment page
                  >
                    New
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handleClear}
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
                    onClick={() => navigate("/admin/dashboard")}
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
                        <label
                          htmlFor="mentor"
                          className="form-label me-2"
                          style={{ whiteSpace: "nowrap", minWidth: "80px" }}
                        >
                          Mentor
                        </label>
                        <Select
                          id="mentor"
                          className="detail"
                          options={mentors}
                          value={selectedMentor}
                          onChange={setSelectedMentor}
                          placeholder="Select Mentor"
                          classNamePrefix="mentor-dropdown"
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-4">
                        <label
                          htmlFor="student-name"
                          className="form-label me-2 "
                          style={{ whiteSpace: "nowrap", minWidth: "110px" }}
                        >
                          Student Name
                        </label>
                        <Select
                          id="student-name"
                          classNamePrefix="student-name-dropdown"
                          className="flex-grow-1 detail"
                          options={students}
                          placeholder="Select Student"
                          isDisabled={!selectedMentor}
                          value={selectedStudent}
                          onChange={setSelectedStudent}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-4">
                        <label
                          htmlFor="date-from"
                          className="form-label me-2"
                          style={{ whiteSpace: "nowrap", minWidth: "80px" }}
                        >
                          From Date
                        </label>
                        <input
                          type="date"
                          id="date-from"
                          ref={dateFromRef}
                          className="form-control detail"
                          placeholder="From Date"
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-4">
                        <label
                          htmlFor="date-to"
                          className="form-label me-2"
                          style={{ whiteSpace: "nowrap", minWidth: "80px" }}
                        >
                          To Date
                        </label>
                        <input
                          type="date"
                          id="date-to"
                          ref={dateToRef}
                          className="form-control detail "
                          placeholder="To Date"
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-4">
                        <label
                          htmlFor="communicated-with"
                          className="form-label me-2"
                          style={{ whiteSpace: "nowrap", minWidth: "120px" }}
                        >
                          Communicated With
                        </label>
                        <Select
                          id="communicated-with"
                          className="detail"
                          options={communicatedWithOptions}
                          value={selectedCommunicatedWith}
                          onChange={setSelectedCommunicatedWith}
                          placeholder="Select"
                          classNamePrefix="communicated-with-dropdown"
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-4">
                        <label
                          htmlFor="communicated-via"
                          className="form-label me-2"
                          style={{ whiteSpace: "nowrap", minWidth: "120px" }}
                        >
                          Communicated Via
                        </label>
                        <Select
                          id="communicated-via"
                          options={communicatedViaOptions}
                          value={selectedCommunicatedVia}
                          className="detail"
                          onChange={setSelectedCommunicatedVia}
                          placeholder="Select"
                          classNamePrefix="communicated-via-dropdown"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Date</th>
                        <th>Student Name</th>
                        <th>course</th>
                        <th>Section</th>
                        <th>Mentor</th>
                        <th>Communicated With</th>
                        <th>Communicated Via</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length > 0 ? (
                        data.map((item, index) => (
                          <tr key={item.id || index}>
                            <td>{index + 1}</td>
                            <td>
                              {item.communication_date
                                ? new Date(
                                    item.communication_date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td>{item.student_name || "N/A"}</td>
                            <td>{item.course_name || "N/A"}</td>
                            <td>{item.section_name || "N/A"}</td>
                            <td>{item.mentor_name || "N/A"}</td>
                            <td>{item.communicated_with || "N/A"}</td>
                            <td>{item.communicated_via || "N/A"}</td>
                            <td>
                              {item.remarks ||
                                item.communication_details ||
                                "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmAttendanceEntry;
