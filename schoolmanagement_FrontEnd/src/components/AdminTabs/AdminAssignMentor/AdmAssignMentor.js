import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import SelectStudentFeeModal from "../FeeStudentModal/SelectStudentFeeModal";

const AdmAttendanceEntry = () => {
  const [tableData, setTableData] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  
  // Student selection states
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  
  const navigate = useNavigate();
  const orgId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");
  const academicYearId = localStorage.getItem("academicSessionId");

  const handleAssignMentorClick = () => {
    // Simply navigate to the assign mentor page without passing any data
    navigate("/admin/assign-student-mentor");
  };

  // Fetch academic year data to check response
  useEffect(() => {
    const fetchAcademicYear = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const apiUrl = `${ApiUrl.apiurl}AcademicYear/GetAcademicYearByOrgBranch/?organization_id=${orgId}&branch_id=${branchId}`;

        console.log("Fetching Academic Year from:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await response.json();
        console.log("Academic Year Response:", data);
        console.log("Academic Year Data:", data.data);
      } catch (error) {
        console.error("Error fetching academic year:", error);
      }
    };

    if (orgId && branchId) {
      fetchAcademicYear();
    }
  }, [orgId, branchId]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await fetch(
          `${ApiUrl.apiurl}Teacher/GetEmployeeList/?orgId=${orgId}&branchId=${branchId}`
        );
        const data = await response.json();
        if (data && data.data) {
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
  }, [orgId, branchId]);

  // Fetch students when a mentor is selected
  useEffect(() => {
    const fetchMentorStudents = async () => {
      if (!selectedMentor) {
        setStudents([]);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        let queryParams = [];
        if (orgId) queryParams.push(`organization_id=${orgId}`);
        if (branchId) queryParams.push(`branch_id=${branchId}`);
        if (academicYearId) queryParams.push(`academic_year_id=${academicYearId}`);
        queryParams.push(`teacher_id=${selectedMentor.value}`);

        const apiUrl = `${ApiUrl.apiurl}Mentor/mentorsWithStudents/?${queryParams.join("&")}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        
        if (data.message === "success" && Array.isArray(data.data)) {
          // Extract all students from the mentor's assigned_students array
          const allStudents = data.data.flatMap((mentor) => 
            (mentor.assigned_students || []).map((student) => ({
              value: student.student_id,
              label: student.student_name,
              fullData: student,
            }))
          );
          setStudents(allStudents);
        } else {
          setStudents([]);
        }
      } catch (error) {
        console.error("Error fetching mentor's students:", error);
        setStudents([]);
      }
    };

    fetchMentorStudents();
  }, [selectedMentor, orgId, branchId, academicYearId]);

  const handleSearch = async () => {
    const mentorId = selectedMentor ? selectedMentor.value : "";
    const studentId = selectedStudent ? selectedStudent.value : "";

    let queryParams = [];
    if (orgId) queryParams.push(`organization_id=${orgId}`);
    if (branchId) queryParams.push(`branch_id=${branchId}`);
    if (academicYearId) queryParams.push(`academic_year_id=${academicYearId}`);
    
    // Add mentor or student filter based on what's selected
    if (studentId) {
      // Reverse search: Find mentors for a specific student
      queryParams.push(`student_id=${studentId}`);
    } else if (mentorId) {
      // Normal search: Find students for a specific mentor
      queryParams.push(`teacher_id=${mentorId}`);
    }

    const apiUrl = `${ApiUrl.apiurl}Mentor/mentorsWithStudents/?${queryParams.join("&")}`;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      
      if (data.message === "success" && Array.isArray(data.data)) {
        setTableData(data.data);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableData([]);
    }
  };

  const handleClear = () => {
    setSelectedMentor(null);
    setSelectedStudent(null);
    setStudents([]);
    setTableData([]);
  };

  // Handle student selection from modal
  const handleSelectStudentFromModal = (studentData) => {
    console.log("Student selected from modal:", studentData);
    
    // Extract student ID and name
    const studentId = studentData?.student_id || studentData?.id;
    const studentName = studentData?.student_name || studentData?.name || "Unknown Student";
    
    if (studentId) {
      setSelectedStudent({
        value: studentId,
        label: studentName,
        fullData: studentData,
      });
      
      // Clear mentor selection when student is selected from modal (for reverse search)
      setSelectedMentor(null);
      setStudents([]);
    }
  };

  // Handle mentor selection change
  const handleMentorChange = (selectedOption) => {
    setSelectedMentor(selectedOption);
    // Clear student selection when mentor changes
    setSelectedStudent(null);
  };

  // Handle student selection from dropdown
  const handleStudentChange = (selectedOption) => {
    setSelectedStudent(selectedOption);
    // If student is selected from dropdown, don't clear mentor
    // as they are related (student belongs to this mentor)
  };

  const handleCloseBut = () => {
    navigate("/admin/dashboard");
  };

  const handleDeleteAssignment = async (assignmentId) => {
    // Confirmation dialog
    const confirmation = window.confirm(
      "Are you sure you want to delete this mentor-student assignment?"
    );
    if (!confirmation) return;

    if (!assignmentId) {
      alert("Assignment ID is missing. Cannot delete assignment.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = `${ApiUrl.apiurl}Mentor/studentmentorAssign/${assignmentId}/`;

      console.log("Deleting mentor-student assignment with ID:", assignmentId);

      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const result = await response.json();
      console.log("Delete Response:", result);

      if (response.ok && result.message?.toLowerCase().includes("success")) {
        alert("Assignment deleted successfully!");

        // Refresh the table by removing the deleted student from the UI
        setTableData((prevData) => {
          return prevData.map((mentor) => {
            const updatedStudents = mentor.assigned_students.filter(
              (student) => student.assignment_id !== assignmentId
            );
            return {
              ...mentor,
              assigned_students: updatedStudents,
              current_student_count: updatedStudents.length,
            };
          }).filter((mentor) => {
            // Remove mentors with no students if they had students before
            return mentor.assigned_students.length > 0 || mentor.current_student_count === 0;
          });
        });

        // Optionally refresh the search to get updated data
        // handleSearch();
      } else {
        alert(
          `Failed to delete assignment: ${result.message || result.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert("An error occurred while deleting the assignment: " + error.message);
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
                STUDENT MENTOR
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleAssignMentorClick}
                  >
                    Assign Mentor
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handleClear}
                    style={{ width: "150px" }}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={handleCloseBut}
                    style={{ width: "150px" }}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 p-2 mt-3 mb-3">
                      {/* Mentor Dropdown */}
                      <div className="col-12 col-md-6 mb-3 d-flex align-items-center">
                        <label htmlFor="mentor" className="form-label me-2" style={{ minWidth: "80px" }}>
                          Mentor
                        </label>
                        <Select
                          id="mentor"
                          options={mentors}
                          className="detail flex-grow-1"
                          value={selectedMentor}
                          onChange={handleMentorChange}
                          placeholder="Select Mentor"
                          classNamePrefix="mentor-dropdown"
                          isClearable
                        />
                      </div>

                      {/* Student Selection: Single Component - Dropdown when mentor selected, disabled input otherwise */}
                      <div className="col-12 col-md-6 mb-3 d-flex align-items-center">
                        <label htmlFor="student-name" className="form-label me-2" style={{ minWidth: "120px" }}>
                          Student Name
                        </label>
                        {/* Show dropdown when mentor is selected, otherwise show disabled input */}
                        {selectedMentor && students.length > 0 ? (
                          <Select
                            id="student-select"
                            options={students}
                            className="detail flex-grow-1"
                            value={selectedStudent}
                            onChange={handleStudentChange}
                            placeholder="Select Student from Mentor"
                            classNamePrefix="student-dropdown"
                          />
                        ) : (
                          <input
                            type="text"
                            id="student-name"
                            className="form-control detail"
                            placeholder="Enter student name"
                            value={selectedStudent?.label || ""}
                            disabled
                            style={{ flex: 1 }}
                          />
                        )}
                        {/* Three-Dot Button (always visible) */}
                        <button
                          type="button"
                          className="btn btn-primary ms-2 mb-0 mt-0"

                          onClick={() => setShowStudentModal(true)}
                          title="Search Student"
                          style={{ width: "50px", padding: "3px" }}
                        >
                          <span style={{ fontSize: "16px", lineHeight: "1" }}>⋯</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Modal */}
              <SelectStudentFeeModal
                show={showStudentModal}
                handleClose={() => setShowStudentModal(false)}
                onSelectStudent={handleSelectStudentFromModal}
              />

              {/* Table Data */}
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Mentor Name</th>
                        <th>Current Count</th>
                        <th>Student Name</th>
                        <th>Admission No</th>
                        <th>BarCode</th>
                        <th>Course</th>
                        <th>Section</th>
                        <th>Assignment Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.length > 0 ? (
                        tableData.map((mentor, mentorIndex) => {
                          // If mentor has students, show them
                          if (mentor.assigned_students && mentor.assigned_students.length > 0) {
                            return mentor.assigned_students.map((student, studentIndex) => (
                              <tr key={`${mentorIndex}-${studentIndex}`}>
                                {/* Show mentor info only for first student row */}
                                {studentIndex === 0 ? (
                                  <>
                                    <td rowSpan={mentor.assigned_students.length}>
                                      {mentorIndex + 1}
                                    </td>
                                    <td rowSpan={mentor.assigned_students.length}>
                                      {mentor.mentor_name}
                                    </td>
                                  
                                    
                               
                                    <td rowSpan={mentor.assigned_students.length}>
                                      {mentor.current_student_count || 0}
                                    </td>
                                  </>
                                ) : null}
                                {/* Student details */}
                                <td>{student.student_name}</td>
                                <td>{student.admission_no || "N/A"}</td>
                                <td>{student.barcode || "N/A"}</td>
                                <td>{student.course_name || "N/A"}</td>
                                <td>{student.section_name || "N/A"}</td>
                                <td>
                                  {student.assignment_date
                                    ? new Date(student.assignment_date).toLocaleDateString()
                                    : "N/A"}
                                </td>
                                <td>
                                  <span
                                    className={`badge ${
                                      student.status === "ACTIVE"
                                        ? "bg-success"
                                        : "bg-secondary"
                                    }`}
                                  >
                                    {student.status || "N/A"}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() =>
                                      handleDeleteAssignment(student.assignment_id)
                                    }
                                    title="Delete Assignment"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ));
                          } else {
                            // Show mentor with no students
                            return (
                              <tr key={mentorIndex}>
                                <td>{mentorIndex + 1}</td>
                                <td>{mentor.mentor_name}</td>
                                <td>{mentor.current_student_count || 0}</td>
                                <td colSpan="9" className="text-center text-muted">
                                  No students assigned
                                </td>
                              </tr>
                            );
                          }
                        })
                      ) : (
                        <tr>
                          <td colSpan="12" className="text-center">
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