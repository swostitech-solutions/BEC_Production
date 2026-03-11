import React, { useState ,useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdmMentor.css";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";


const AdmMentorStudentDetails = () => {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Get academic year from localStorage
  const academicYearId = localStorage.getItem("academicSessionId");
  const orgId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
  const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");

  const handleClear = () => {
    setSelectedMentor(null);
    setSelectedStudent(null);
    setStudents([]);
    setStudentDetails(null);
  };



  // Fetch mentors/teachers on component mount
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        if (!orgId || !branchId) {
          return;
        }

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

  // Fetch students when mentor is selected
  useEffect(() => {
    if (!selectedMentor) {
      setStudents([]);
      setSelectedStudent(null);
          return;
        }

    const fetchStudents = async () => {
      try {
        setLoading(true);
        
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
            label: student.student_name || `${student.admission_no || ""} - Unknown`,
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
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedMentor, orgId, branchId, academicYearId]);

  // Fetch student details when student is selected
  useEffect(() => {
    if (!selectedStudent || !selectedStudent.value) {
      setStudentDetails(null);
        return;
      }

    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        if (!academicYearId) {
          console.warn("Academic year not available for fetching student details");
          return;
        }

        const studentId = selectedStudent.value;
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
      } finally {
        setLoading(false);
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
              <div className="row mb-3 mt-3 mx-0">
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
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Mentor and Student Selection */}
              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="row">
                    {/* Mentor */}
                    <div className="col-12 col-md-4 mb-3">
                      <label className="form-label fw-bold">
                        Select Mentor
                      </label>
                      <Select
                        options={mentors}
                        value={selectedMentor}
                        onChange={setSelectedMentor}
                        placeholder="Select Mentor"
                        className="detail"
                        isLoading={loading && !selectedMentor}
                      />
                    </div>

                    {/* Student */}
                    <div className="col-12 col-md-4 mb-3">
                      <label className="form-label fw-bold">
                        Select Student
                      </label>
                      <Select
                        className="detail"
                        options={students}
                        value={selectedStudent}
                        onChange={setSelectedStudent}
                        placeholder={
                          selectedMentor
                            ? "Select Student"
                            : "Select Mentor first"
                        }
                        isDisabled={!selectedMentor || students.length === 0}
                        isClearable
                        isLoading={
                          loading && selectedMentor && !selectedStudent
                        }
                        noOptionsMessage={() =>
                          selectedMentor
                            ? "No students assigned to this mentor"
                            : "Select a mentor first"
                        }
                      />
                    </div>

                    {/* Student Count Info */}
                    {selectedMentor && (
                      <div className="col-12 col-md-4 mb-3 d-flex align-items-end">
                        <span className="text-muted">
                          {students.length} student(s) assigned to this mentor
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Student Details Table */}
              {studentDetails && (
                <div className="container-fluid mt-4">
                  <div className="table-responsive">
                    <table className="table custom-table">
                      <tbody>
                        <tr>
                          <td className="fw-bold text-start">Student Name</td>
                          <td className="text-start">
                            {studentDetails?.student_name ||
                              `${studentDetails?.first_name || ""} ${
                                studentDetails?.middle_name || ""
                              } ${studentDetails?.last_name || ""}`.trim() ||
                              " "}
                          </td>
                          <td className="fw-bold text-start">Admission No</td>
                          <td className="text-start">
                            {studentDetails?.admission_no || " "}
                          </td>
                          <td className="fw-bold text-start">
                            College Admission No
                          </td>
                          <td className="text-start">
                            {studentDetails?.college_admission_no || " "}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-start">Barcode</td>
                          <td className="text-start">
                            {studentDetails?.barcode || " "}
                          </td>
                          <td className="fw-bold text-start">Course</td>
                          <td className="text-start">
                            {studentDetails?.course_name || " "}
                          </td>
                          <td className="fw-bold text-start">Section</td>
                          <td className="text-start">
                            {studentDetails?.section_name || " "}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-start">
                            Student Mobile No
                          </td>
                          <td className="text-start">
                            {studentDetails?.student_mobile_no || " "}
                          </td>
                          <td className="fw-bold text-start">Student Email</td>
                          <td className="text-start">
                            {studentDetails?.student_email || " "}
                          </td>
                          <td colSpan="2"></td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-start">Father Name</td>
                          <td className="text-start">
                            {studentDetails?.father_name || " "}
                          </td>
                          <td className="fw-bold text-start">
                            Father Mobile No
                          </td>
                          <td className="text-start">
                            {studentDetails?.father_mobile_no || " "}
                          </td>
                          <td className="fw-bold text-start">Father Email</td>
                          <td className="text-start">
                            {studentDetails?.father_email || " "}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-start">Mother Name</td>
                          <td className="text-start">
                            {studentDetails?.mother_name || " "}
                          </td>
                          <td className="fw-bold text-start">
                            Mother Mobile No
                          </td>
                          <td className="text-start">
                            {studentDetails?.mother_mobile_no || " "}
                          </td>
                          <td className="fw-bold text-start">Mother Email</td>
                          <td className="text-start">
                            {studentDetails?.mother_email || " "}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmMentorStudentDetails;
