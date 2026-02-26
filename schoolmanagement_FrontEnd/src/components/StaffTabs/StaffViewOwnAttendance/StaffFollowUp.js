// import React, { useRef, useState,useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import SelectSearchParty from "../AdminSearchExpense/SelectSearchParty";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { ApiUrl } from "../../../ApiUrl";


// const AdmAttendanceEntry = () => {
//   const [showModal, setShowModal] = useState(false);
//   const navigate = useNavigate();
//     const [data, setData] = useState([]);
//   const [mentors, setMentors] = useState([]);
//   const [students, setStudents] = useState([]);
//    const [selectedStudent, setSelectedStudent] = useState(null);
//    const [selectedMentor, setSelectedMentor] = useState(null);

//   const dateRef = useRef(null);
//   const fromClassRef = useRef(null);
//   const toClassRef = useRef(null);
//   const admissionNoRef = useRef(null);
//   const barcodeRef = useRef(null);
//   const smsToRef = useRef(null);

//   const handleClear = () => {
//     if (dateRef.current) dateRef.current.value = "";
//     if (fromClassRef.current) fromClassRef.current.value = "";
//     if (toClassRef.current) toClassRef.current.value = "";
//     if (admissionNoRef.current) admissionNoRef.current.value = "";
//     if (barcodeRef.current) barcodeRef.current.value = "";
//     if (smsToRef.current) smsToRef.current.checked = false;
//   };


//     useEffect(() => {
//         const fetchMentors = async () => {
//           try {
//             const response = await fetch(
//               `${ApiUrl.apiurl}Teacher/GetEmployeeList/?orgId=1&branchId=1`
//             );
//             const data = await response.json();
//             if (data && data.data) {
//               // Mapping data to match React Select options format
//               const formattedMentors = data.data.map((mentor) => ({
//                 value: mentor.id,
//                 label: mentor.employeeName,
//               }));
//               setMentors(formattedMentors);
//             }
//           } catch (error) {
//             console.error("Error fetching mentors:", error);
//           }
//         };

//         fetchMentors();
//       }, []);

//     const branchId = localStorage.getItem("branchId");
//      const orgId = localStorage.getItem("orgId");
//      const academicYearId = localStorage.getItem("academicSessionId");

//        useEffect(() => {
//          if (!selectedMentor) return;

//          const fetchStudents = async () => {
//            try {
//              const url = `${ApiUrl.apiurl}Mentor/mentorWiseStudentList/?academic_year_id=${academicYearId}&org_id=${orgId}&branch_id=${branchId}&teacher_id=${selectedMentor.value}`;
//              const response = await fetch(url);
//              const data = await response.json();

//              if (data && data.data) {
//                const formattedStudents = data.data.map((student) => ({
//                  value: student.student_id, // Corrected key mapping
//                  label: student.student_name, // Corrected key mapping
//                }));
//                setStudents(formattedStudents);
//              }
//            } catch (error) {
//              console.error("Error fetching students:", error);
//            }
//          };

//          fetchStudents();
//        }, [selectedMentor, academicYearId, orgId, branchId]);



// const handleSearch = async () => {
//   const branchId = localStorage.getItem("branchId");
//   const orgId = localStorage.getItem("orgId");
//   const academicYearId = localStorage.getItem("academicSessionId");

//   if (!branchId || !orgId || !academicYearId) {
//     console.error(
//       "Mandatory fields are missing: branchId, orgId, academicYearId"
//     );
//     return;
//   }

//   const studentId = selectedStudent ? selectedStudent.value : "";
//   const teacherId = selectedMentor ? selectedMentor.value : "";

//   const apiUrl = `${ApiUrl.apiurl}Mentor_Student_Communication/studentcommunicationSearchList/?academic_year_id=${academicYearId}&org_id=${orgId}&branch_id=${branchId}&student_id=${studentId}&teacher_id=${teacherId}`;

//   try {
//     const response = await fetch(apiUrl);
//     const result = await response.json();

//     if (result.message === "success") {
//       setData(result.data);
//     } else {
//       setData([]);
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };




//   const handleAssignMentorClick = () => {
//     navigate("/admin/student-mentor-communication");
//   };


//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12">
//           <div className="card p-0">
//             <div className="card-body">
//               <p
//                 style={{
//                   marginBottom: "0px",
//                   textAlign: "center",
//                   fontSize: "20px",
//                   fontWeight: "700",
//                 }}
//               >
//                 STUDENT MENTOR
//               </p>
//               <div className="row mb-3 mt-3 mx-0">
//                 <div className="col-12">
//                   <button
//                     type="button"
//                     className="btn btn-primary me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                     onClick={handleAssignMentorClick} // Navigate to the mentor assignment page
//                   >
//                     New
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-primary me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                     onClick={handleSearch}
//                   >
//                     Search
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-secondary me-2"
//                     onClick={handleClear}
//                     style={{
//                       width: "150px",
//                     }}
//                   >
//                     Clear
//                   </button>

//                   <button
//                     type="button"
//                     className="btn btn-danger me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>

//               <div className="row mt-3 mx-2">
//                 <div className="col-12 custom-section-box">
//                   <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
//                     <div className="row flex-grow-1 mt-2">
//                       <div className="col-12 col-md-4 mb-4">
//                         <label
//                           htmlFor="mentor"
//                           className="form-label me-2"
//                           style={{ whiteSpace: "nowrap", minWidth: "80px" }}
//                         >
//                           Mentor
//                         </label>
//                         <Select
//                           id="mentor"
//                           options={mentors}
//                           value={selectedMentor}
//                           onChange={setSelectedMentor}
//                           placeholder="Select Mentor"
//                           classNamePrefix="mentor-dropdown"
//                         />
//                       </div>
//                       <div className="col-12 col-md-4 mb-4">
//                         <label
//                           htmlFor="student-name"
//                           className="form-label me-2"
//                           style={{ whiteSpace: "nowrap", minWidth: "110px" }}
//                         >
//                           Student Name
//                         </label>
//                         <Select
//                           id="student-name"
//                           classNamePrefix="student-name-dropdown"
//                           className="flex-grow-1"
//                           options={students} // Dropdown values appear only after selecting a mentor
//                           placeholder="Select Student"
//                           isDisabled={!selectedMentor} // Disables dropdown until a mentor is selected
//                           value={selectedStudent}
//                           onChange={setSelectedStudent}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div  className="col-12">
//                 <div className="table-responsive">
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         <th>Sr.No</th>
//                         <th>Date</th>
//                         <th>Student Name</th>
//                         <th>class</th>
//                         <th>Section</th>
//                         <th>Mentor</th>
//                         <th>Communicated With</th>
//                         <th>Communicated Via</th>
//                         <th>Remarks</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {data.length > 0 ? (
//                         data.map((item, index) => (
//                           <tr key={index}>
//                             <td>{index + 1}</td>
//                             <td>{item.date}</td>
//                             <td>{item.studentname}</td>
//                             <td>{item.classname}</td>
//                             <td>{item.sectionname}</td>
//                             <td>{item.mentorname}</td>
//                             <td>{item.communicated_with}</td>
//                             <td>{item.communicated_via}</td>
//                             <td>{item.remarks}</td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan="9" className="text-center">
//                             No data available
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdmAttendanceEntry;


import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";

const StaffFollowUp = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);

  const dateRef = useRef(null);
  const fromClassRef = useRef(null);
  const toClassRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);

  // Retrieve IDs from storage
  const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");
  const orgId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
  const academicYearId = localStorage.getItem("academicSessionId");
  const userId = sessionStorage.getItem("userId");

  const handleClear = () => {
    // Clear input fields
    if (dateRef.current) dateRef.current.value = "";
    if (fromClassRef.current) fromClassRef.current.value = "";
    if (toClassRef.current) toClassRef.current.value = "";
    if (admissionNoRef.current) admissionNoRef.current.value = "";
    if (barcodeRef.current) barcodeRef.current.value = "";
    if (smsToRef.current) smsToRef.current.checked = false;

    // Clear state variables
    setSelectedStudent(null);
    // Don't clear selectedMentor if it's the logged-in user
    // setSelectedMentor(null); 
    setStudents([]);
    setData([]);
  };


  useEffect(() => {
    const fetchMentors = async () => {
      if (!orgId || !branchId) {
        console.error("Org ID or Branch ID missing");
        return;
      }
      try {
        const response = await fetch(
          `${ApiUrl.apiurl}Teacher/GetEmployeeList/?orgId=${orgId}&branchId=${branchId}`
        );
        const data = await response.json();
        if (data && data.data) {
          // Flatten the list if it's not already flattened? 
          // Assuming data.data is an array of objects.

          let formattedMentors = data.data.map((mentor) => ({
            value: mentor.id,
            label: mentor.employeeName,
          }));

          // Filter for logged-in user if userId exists
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
  }, [orgId, branchId, userId]);



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

  // Auto-load data when mentor is selected (on page mount)
  useEffect(() => {
    if (selectedMentor && academicYearId && orgId && branchId) {
      handleSearch();
    }
  }, [selectedMentor]); // Run when mentor is auto-selected

  const handleSearch = async () => {
    if (!branchId || !orgId || !academicYearId) {
      console.error(
        "Mandatory fields are missing: branchId, orgId, academicYearId"
      );
      return;
    }

    const studentId = selectedStudent ? selectedStudent.value : "";
    const teacherId = selectedMentor ? selectedMentor.value : "";

    const apiUrl = `${ApiUrl.apiurl}Mentor_Student_Communication/studentcommunicationSearchList/?academic_year_id=${academicYearId}&org_id=${orgId}&branch_id=${branchId}&student_id=${studentId}&teacher_id=${teacherId}`;

    try {
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (result.message === "success") {
        setData(result.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAssignMentorClick = () => {
    navigate("/staff/student-mentor-communication");
  };

  const toSentenceCase = (str) => {
    if (!str) return "-";
    const lower = str.toLowerCase().replace(/_/g, " ");
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const formatMentorName = (name) => {
    if (!name) return "-";
    // Title case the whole string first
    let formatted = name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Handle specific prefixes
    const parts = formatted.split(" ");
    if (parts[0] === "Mr") parts[0] = "Mr.";
    if (parts[0] === "Mrs") parts[0] = "Mrs.";
    if (parts[0] === "Dr") parts[0] = "Dr.";
    // Ms stays Ms

    return parts.join(" ");
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
                    onClick={() => navigate("/staff/dashboard")}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mt-2">
                      <div className="col-12 col-md-4 mb-4">
                        <label
                          htmlFor="mentor"
                          className="form-label me-2"
                          style={{ whiteSpace: "nowrap", minWidth: "80px" }}
                        >
                          Mentor
                        </label>
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
                      <div className="col-12 col-md-4 mb-4">
                        <label
                          htmlFor="student-name"
                          className="form-label me-2"
                          style={{ whiteSpace: "nowrap", minWidth: "110px" }}
                        >
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
                        <th>class</th>
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
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.communication_date || "-"}</td>
                            <td>{item.student_name || "-"}</td>
                            <td>{item.course_name || "-"}</td>
                            <td>{item.section_name || "-"}</td>
                            <td>{formatMentorName(item.mentor_name)}</td>
                            <td>
                              {toSentenceCase(item.communicated_with)}
                            </td>
                            <td>
                              {toSentenceCase(item.communicated_via)}
                            </td>
                            <td>{item.remarks || "-"}</td>
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

export default StaffFollowUp;
