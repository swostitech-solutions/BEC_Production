import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdmMentor.css";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";


const AdmMentorStudentDetails = () => {
  const [selectedMentor, setSelectedMentor] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const navigate = useNavigate();

  const handleClear = () => {
    // Don't clear selectedMentor - it's the logged-in staff user
    // setSelectedMentor("");
    setSelectedStudent("");
    // Don't clear students list - keep it for the selected mentor
    // setStudents([]);
    setStudentDetails(null);
  };



  // useEffect(() => {
  //   const fetchMentors = async () => {
  //     try {
  //       const response = await fetch(
  //         `${ApiUrl.apiurl}Teacher/GetEmployeeList/?orgId=1&branchId=1`
  //       );
  //       const data = await response.json();
  //       if (data && data.data) {
  //         // Mapping data to match React Select options format
  //         const formattedMentors = data.data.map((mentor) => ({
  //           value: mentor.id,
  //           label: mentor.employeeName,
  //         }));
  //         setMentors(formattedMentors);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching mentors:", error);
  //     }
  //   };

  //   fetchMentors();
  // }, []);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");
        const orgId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
        const userId = sessionStorage.getItem("userId");

        if (!orgId || !branchId) {
          console.error("Org ID or Branch ID missing");
          return;
        }

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
  }, []);

  const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");
  const orgId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
  const academicYearId = localStorage.getItem("academicSessionId");

  useEffect(() => {
    if (!selectedMentor) return;

    const fetchStudents = async () => {
      try {
        const url = `${ApiUrl.apiurl}Mentor/mentorWiseStudentList/?academic_year_id=${academicYearId}&org_id=${orgId}&branch_id=${branchId}&teacher_id=${selectedMentor.value}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.data) {
          const formattedStudents = data.data.map((student) => ({
            value: student.student_id, // Corrected key mapping
            label: student.student_name, // Corrected key mapping
          }));
          setStudents(formattedStudents);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [selectedMentor, academicYearId, orgId, branchId]);

  // Fetch student details when a student is selected
  useEffect(() => {
    if (!selectedStudent) return;

    const fetchStudentDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const studentId = selectedStudent.value;

        if (!studentId) {
          console.warn("Student ID not available");
          return;
        }

        if (!academicYearId) {
          console.warn("Academic year not available for fetching student details");
          return;
        }

        const url = `${ApiUrl.apiurl}StudentDetails/GetStudentFullDetails/?student_id=${studentId}&academic_year_id=${academicYearId}`;

        console.log("Fetching student full details:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.message === "success" && result.data) {
          setStudentDetails(result.data);
          console.log("Student details loaded:", result.data);
        } else {
          console.warn("Unexpected response format:", result);
          setStudentDetails(null);
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
        setStudentDetails(null);
      }
    };

    fetchStudentDetails();
  }, [selectedStudent, academicYearId]);



  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <h4 className="text-center fw-bold">Student Profile</h4>

              {/* Buttons */}
              <div className=" row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-secondary me-2"
                    style={{ width: "150px" }}
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    className="btn btn-danger me-2"
                    style={{ width: "150px" }}
                    onClick={() => navigate("/staff/dashboard")}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Mentor and Student Dropdowns */}
              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mt-2">
                      {/* Mentor Dropdown */}
                      <div className="col-12 col-md-4 mb-4">
                        <label className="form-label">Mentor</label>
                        <Select
                          id="mentor"
                          options={mentors}
                          value={selectedMentor}
                          onChange={setSelectedMentor}
                          placeholder="Select Mentor"
                          classNamePrefix="mentor-dropdown"
                          isDisabled={true}
                        />
                      </div>

                      {/* Student Dropdown */}
                      <div className="col-12 col-md-4 mb-4">
                        <label className="form-label">Student</label>
                        <Select
                          id="student-name"
                          classNamePrefix="student-name-dropdown"
                          // className="flex-grow-1"
                          options={students} // Dropdown values appear only after selecting a mentor
                          placeholder="Select Student"
                          isDisabled={!selectedMentor} // Disables dropdown until a mentor is selected
                          value={selectedStudent}
                          onChange={setSelectedStudent}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Details Table */}
              <div className="container-fluid mt-4 ">
                <div className="table-responsive">
                  <table className="table custom-table">
                    <tbody>
                      <tr>
                        <td className="fw-bold text-start">Student Name</td>
                        <td className="text-start">
                          {studentDetails?.student_name || " "}
                        </td>
                        <td className="fw-bold text-start">Admission No</td>
                        <td className="text-start">
                          {studentDetails?.admission_no || " "}
                        </td>
                        <td className="fw-bold text-start">Course/Section</td>
                        <td className="text-start">
                          {studentDetails?.course_name || " "}{" "}
                          {studentDetails?.section_name || ""}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold text-start">Father Name</td>
                        <td className="text-start">
                          {studentDetails?.father_name || " "}
                        </td>
                        <td className="fw-bold text-start">Father Mobile No</td>
                        <td className="text-start">
                          {studentDetails?.father_mobile_no || " "}
                        </td>
                        <td colSpan="2"></td>
                      </tr>
                      <tr>
                        <td className="fw-bold text-start">Mother Name</td>
                        <td className="text-start">
                          {studentDetails?.mother_name || " "}
                        </td>
                        <td className="fw-bold text-start">Mother Mobile No</td>
                        <td className="text-start">
                          {studentDetails?.mother_mobile_no || " "}
                        </td>
                        <td colSpan="2"></td>
                      </tr>
                      <tr>
                        <td className="fw-bold text-start">
                          Student Mobile No
                        </td>
                        <td className="text-start">
                          {studentDetails?.student_mobile_no || "N/A"}
                        </td>
                        <td className="fw-bold text-start">Student Email</td>
                        <td className="text-start">
                          {studentDetails?.student_email || " "}
                        </td>
                        <td colSpan="2"></td>
                      </tr>
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

export default AdmMentorStudentDetails;
