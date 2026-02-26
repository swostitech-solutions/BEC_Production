// import React, { useRef, useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import useFetchSections from "../../hooks/useFetchSections";
// import  useCourses from "../../hooks/useFetchClasses";
// import { ApiUrl } from "../../../ApiUrl";

// const AdmAttendanceEntry = () => {

//   const dateRef = useRef(null);
//   const [selectedMonths, setSelectedMonths] = useState({});
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [assignmentDate, setAssignmentDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   const [smsTo, setSmsTo] = useState("B");
//   const fromClassRef = useRef(null);
//   const toClassRef = useRef(null);
//   const admissionNoRef = useRef(null);
//   const barcodeRef = useRef(null);
//   const smsToRef = useRef(null);
//   const [periods, setPeriods] = useState([]);
//   const [formData, setFormData] = useState({
//     classId: "",
//     sectionId: "",
//     feeappfrom: "",
//     subject: "",
//     teacher: "",
//   });
//   const [students, setStudents] = useState([]);
//   const [error, setError] = useState("");
//   const [subject, setSubject] = useState("");
//   const [teacher, setTeacher] = useState("");
//   const [isDisabled, setIsDisabled] = useState(false);

//   const [selectedClassId, setSelectedClassId] = useState("");
//   const [isEditing, setIsEditing] = useState(false);

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   // const handleSave = async () => {
//   //   setIsEditing(false); // Disable editing mode

//   //   // Collect necessary data from storage
//   //   const userId = sessionStorage.getItem("userId");
//   //   const academicSessionId = localStorage.getItem("academicSessionId");
//   //   const selectedStudentClassId = localStorage.getItem(
//   //     "selectedStudentClassId"
//   //   );
//   //   const selectedStudentSectionId = localStorage.getItem(
//   //     "selectedStudentSectionId"
//   //   );
//   //   const selectedPeriodId = localStorage.getItem("selectedPeriodId");
//   //   const subjectId = localStorage.getItem("subjectId");
//   //   const teacherId = localStorage.getItem("teacherId");
//   //   const studentId = localStorage.getItem("studentId"); // Retrieve studentId from localStorage

//   //   // Collect date from the form
//   //   const date = dateRef.current.value;

//   //   // Validate mobile numbers to ensure they are exactly 10 digits
//   //   for (let index = 0; index < attendanceData.length; index++) {
//   //     const student = attendanceData[index];
//   //     const { father_contact_number, mother_contact_number } = student;

//   //     // Check if father's contact number is valid
//   //     if (father_contact_number && father_contact_number.length !== 10) {
//   //       alert(
//   //         `Sl.No. ${index + 1}: Father's contact number for student ${
//   //           student.studentId
//   //         } should be exactly 10 digits.`
//   //       );
//   //       return; // Stop execution if validation fails
//   //     }

//   //     // Check if mother's contact number is valid
//   //     if (mother_contact_number && mother_contact_number.length !== 10) {
//   //       alert(
//   //         `Sl.No. ${index + 1}: Mother's contact number for student ${
//   //           student.studentId
//   //         } should be exactly 10 digits.`
//   //       );
//   //       return; // Stop execution if validation fails
//   //     }
//   //   }

//   //   // Prepare the payload for the API
//   //   const updateDetails = attendanceData.map((student) => {
//   //     // Map the attendance values (Present -> P, Absent -> A, Leave -> L)
//   //     const markAttendance =
//   //       student.present === "present"
//   //         ? "P"
//   //         : student.present === "absent"
//   //         ? "A"
//   //         : student.present === "leave"
//   //         ? "L"
//   //         : "P"; // Default to 'P' (Present) if status not recognized

//   //     return {
//   //       studentId: student.studentId,
//   //       father_contact_number: student.father_contact_number,
//   //       mother_contact_number: student.mother_contact_number,
//   //       mark_Attendance: markAttendance, // P, A, or L
//   //       remarks: student.remarks,
//   //       send_sms_to: smsTo, // Send SMS to Father, Mother, or Both (F, M, or B)
//   //     };
//   //   });

//   //   const payload = {
//   //     loginId: userId,
//   //     academic_year_id: academicSessionId,
//   //     date: date,
//   //     classId: selectedStudentClassId,
//   //     sectionId: selectedStudentSectionId,
//   //     claasPeriodId: selectedPeriodId,
//   //     subjectId: subjectId,
//   //     teacherId: teacherId,
//   //     updateDetails: updateDetails, // Pass the updated attendance and SMS data
//   //   };

//   //   console.log(payload); // Log the payload for debugging

//   //   try {
//   //     // Send the API request
//   //     const response = await fetch(
//   //       "${ApiUrl.apiurl}StudentAttendance/CreateOrUpdateAttendance/",
//   //       {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify(payload),
//   //       }
//   //     );

//   //     const result = await response.json();

//   //     // Handle API response
//   //     if (response.ok) {
//   //       // Success - Show success message in alert
//   //       alert("Attendance saved successfully!");
//   //       console.log("Attendance saved successfully:", result);
//   //       // Handle success (e.g., update UI, clear form, etc.)
//   //     } else {
//   //       // Failure - Show error message in alert
//   //       alert(`Error saving attendance: ${result.message || "Unknown error"}`);
//   //       console.error("Error saving attendance:", result);
//   //       // Handle failure (e.g., show an error message on the UI)
//   //     }
//   //   } catch (error) {
//   //     console.error("Error while making the API call:", error);
//   //     // Handle network or other errors
//   //     alert(`Error while making the API call: ${error.message}`);
//   //   }
//   // };

//   const handleSave = async () => {
//     setIsEditing(false);

//     const userId = sessionStorage.getItem("userId");
//     const academicSessionId = localStorage.getItem("academicSessionId");
//     const selectedStudentClassId = localStorage.getItem(
//       "selectedStudentClassId"
//     );
//     const selectedStudentSectionId = localStorage.getItem(
//       "selectedStudentSectionId"
//     );
//     const selectedPeriodId = localStorage.getItem("selectedPeriodId");
//     const subjectId = localStorage.getItem("subjectId");
//     const teacherId = localStorage.getItem("teacherId");
//     const studentId = localStorage.getItem("studentId");

//     const date = dateRef.current.value;

//     const currentDate = new Date().toISOString().split("T")[0];
//     if (date !== currentDate) {
//       alert("Only today's attendance can be edited.");
//       return;
//     }

//     for (let index = 0; index < attendanceData.length; index++) {
//       const student = attendanceData[index];
//       const { father_contact_number, mother_contact_number } = student;

//       if (father_contact_number && father_contact_number.length !== 10) {
//         alert(
//           `Sl.No. ${index + 1}: Father's contact number for student ${student.studentId
//           } should be exactly 10 digits.`
//         );
//         return;
//       }

//       if (mother_contact_number && mother_contact_number.length !== 10) {
//         alert(
//           `Sl.No. ${index + 1}: Mother's contact number for student ${student.studentId
//           } should be exactly 10 digits.`
//         );
//         return;
//       }
//     }

//     const updateDetails = attendanceData.map((student) => {

//       const markAttendance =
//         student.present === "present"
//           ? "P"
//           : student.present === "absent"
//             ? "A"
//             : student.present === "leave"
//               ? "L"
//               : "P";

//       return {
//         studentId: student.studentId,
//         father_contact_number: student.father_contact_number,
//         mother_contact_number: student.mother_contact_number,
//         mark_Attendance: markAttendance,
//         remarks: student.remarks,
//         send_sms_to: smsTo,
//       };
//     });

//     const payload = {
//       loginId: userId,
//       academic_year_id: academicSessionId,
//       date: date,
//       classId: selectedStudentClassId,
//       sectionId: selectedStudentSectionId,
//       claasPeriodId: selectedPeriodId,
//       subjectId: subjectId,
//       teacherId: teacherId,
//       updateDetails: updateDetails,
//     };

//     console.log(payload);

//     try {

//       const response = await fetch(
//         `${ApiUrl.apiurl}StudentAttendance/CreateOrUpdateAttendance/`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const result = await response.json();

//       if (response.ok) {

//         alert("Attendance saved successfully!");
//         console.log("Attendance saved successfully:", result);

//       } else {

//         alert(`Error saving attendance: ${result.message || "Unknown error"}`);
//         console.error("Error saving attendance:", result);

//       }
//     } catch (error) {
//       console.error("Error while making the API call:", error);

//       alert(`Error while making the API call: ${error.message}`);
//     }
//   };

//   const [showModal, setShowModal] = useState(false);
//   const {
//     classes,
//     loading: classLoading,
//     error: classError,
//   } =  useCourses();

//   const {
//     sections,
//     loading: sectionLoading,
//     error: sectionError,
//   } = useFetchSections(formData.classId);

//   const [studentsData, setStudentsData] = useState([]);
//   const handleClassChange = (e) => {
//     const classId = e.target.value;

//     if (classId) {
//       localStorage.setItem("selectedStudentClassId", classId);
//     } else {
//       localStorage.removeItem("selectedStudentClassId");
//     }

//     setFormData((prev) => ({
//       ...prev,
//       classId,
//       sectionId: "",
//     }));

//     setSelectedClassId(classId);
//   };
//   const handleSectionChange = (e) => {
//     const sectionId = e.target.value;

//     if (sectionId) {
//       localStorage.setItem("selectedStudentSectionId", sectionId);
//     } else {
//       localStorage.removeItem("selectedStudentSectionId");
//     }

//     setFormData((prev) => ({ ...prev, sectionId }));
//   };
//   const handleClear = () => {

//     const retainedFields = [
//       "academicSessionId",
//       "branchId",
//       "nextAcademicSessionId",
//       "orgId",
//     ];
//     const retainedValues = {};

//     retainedFields.forEach((key) => {
//       retainedValues[key] = localStorage.getItem(key);
//     });

//     localStorage.clear();

//     Object.keys(retainedValues).forEach((key) => {
//       if (retainedValues[key] !== null) {
//         localStorage.setItem(key, retainedValues[key]);
//       }
//     });

//     setFormData((prevData) => ({
//       ...prevData,
//       classId: "",
//       sectionId: "",
//       feeappfrom: "",
//       subject: prevData.subject,
//       teacher: prevData.teacher,
//     }));

//     window.location.reload();
//   };

//   const handleShow = () => setShowModal(true);
//   const handleClose = () => setShowModal(false);

//   useEffect(() => {

//     fetch(`${ApiUrl.apiurl}Periods/GetAllPeriods/`)
//       .then((response) =>
//         response.ok ? response.json() : Promise.reject(response.status)
//       )
//       .then((data) => {
//         setPeriods(data.data || []);
//       })
//       .catch(() => setError("Failed to load periods."));
//   }, []);

//   useEffect(() => {
//     const {
//       academicSessionId,
//       orgId,
//       branchId,
//       selectedStudentClassId,
//       selectedStudentSectionId,
//       selectedPeriodId,
//     } = localStorage;

//     if (formData.feeappfrom && assignmentDate) {

//       const apiUrl = `${ApiUrl.apiurl}FILTER/GetSUBJECTTEACHERBASEDONPERIOD/?academic_year_id=${academicSessionId}&org_id=${orgId}&branch_id=${branchId}&date=${assignmentDate}&classId=${selectedStudentClassId}&sectionId=${selectedStudentSectionId}&claasPeriodId=${selectedPeriodId}`;

//       fetch(apiUrl)
//         .then((response) =>
//           response.ok ? response.json() : Promise.reject(response.status)
//         )
//         .then((data) => {
//           if (data.message === "success" && data.data) {
//             const { teacherId, teachername, subjectId, subjectname } =
//               data.data;

//             localStorage.setItem("teacherId", teacherId);
//             localStorage.setItem("subjectId", subjectId);

//             setSubject(subjectname || "");
//             setTeacher(teachername || "");
//           } else {
//             setSubject("");
//             setTeacher("");
//           }
//         })
//         .catch(() => {
//           setError("Failed to fetch subject and teacher.");
//           setSubject("");
//           setTeacher("");
//         });
//     }
//   }, [formData.feeappfrom, assignmentDate]);

//   const handleInputChange = (e) => {
//     if (!e || !e.target) {
//       console.error("Invalid event object", e);
//       return;
//     }

//     const { name, value } = e.target;

//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));

//     if (name === "feeappfrom") {
//       localStorage.setItem("selectedPeriodId", value);
//     }
//   };

//   const handleDateChange = (e) => {
//     const selectedDate = e.target.value;
//     setAssignmentDate(selectedDate);
//     localStorage.setItem("assignmentDate", selectedDate);
//   };

//   const fetchAttendanceData = async () => {
//     const date = dateRef.current.value;
//     const classId = formData.classId;
//     const sectionId = formData.sectionId;
//     const periodId = formData.feeappfrom;

//     if (!date) {
//       alert("Please select a date.");
//       return;
//     }
//     if (!classId) {
//       alert("Please select a class.");
//       return;
//     }
//     if (!sectionId) {
//       alert("Please select a section.");
//       return;
//     }
//     if (!periodId) {
//       alert("Please select a period.");
//       return;
//     }

//     const selectedDate = new Date(date);
//     const currentDate = new Date();

//     selectedDate.setHours(0, 0, 0, 0);
//     currentDate.setHours(0, 0, 0, 0);

//     if (selectedDate > currentDate) {
//       alert("You cannot view attendance for a future date.");
//       return;
//     }

//     const academicSessionId = localStorage.getItem("academicSessionId");
//     const subjectId = localStorage.getItem("subjectId");
//     const teacherId = localStorage.getItem("teacherId");

//     const url = `${ApiUrl.apiurl}StudentAttendance/GetSearchAttendanceByDateclassperiod/?academic_year_id=${academicSessionId}&date=${date}&classId=${classId}&sectionId=${sectionId}&claasPeriodId=${periodId}&subjectId=${subjectId}&teacherId=${teacherId}`;

//     try {
//       const response = await fetch(url);
//       const result = await response.json();
//       if (result.message === "success") {
//         setAttendanceData(result.data);

//         if (result.data && result.data.length > 0) {
//           const studentId = result.data[0].studentId;
//           localStorage.setItem("studentId", studentId);
//         }
//       } else {
//         alert("Failed to fetch data.");
//       }
//     } catch (error) {
//       console.error("Error fetching attendance data:", error);
//       alert("An error occurred while fetching attendance data.");
//     }
//   };

//   const handleContactNumberChange = (studentId, field, value) => {
//     setAttendanceData((prevData) =>
//       prevData.map((student) =>
//         student.studentId === studentId
//           ? { ...student, [field]: value }
//           : student
//       )
//     );
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12">
//           <div className="card">
//             <div className="card-body">
//               <p
//                 style={{
//                   marginBottom: "0px",
//                   textAlign: "center",
//                   fontSize: "20px",
//                   fontWeight: "700",
//                 }}
//               >
//                 ATTENDANCE
//               </p>

//               <div className="row mb-3 mt-3 mx-0">
//                 <div className="col-12 ">
//                   <button
//                     type="button"
//                     className="btn btn-primary me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                     onClick={fetchAttendanceData}
//                   >
//                     Display
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-primary me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                     onClick={handleEdit}
//                     disabled={isEditing}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-primary me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                     onClick={handleSave}
//                     disabled={!isEditing}
//                   >
//                     Save
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-secondary me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                     onClick={handleClear}
//                   >
//                     Clear
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-danger me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                     onClick={handleShow}
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>

//               {/* Form Fields */}
//               <div className="row  mt-3 mx-2">
//                 <div className="col-12 custom-section-box">
//                   <div className="row  mt-3 ">
//                     <div className="col-md-3 mb-3  ">
//                       <label htmlFor="date" className="form-label">
//                         Date <span style={{ color: "red" }}>*</span>
//                       </label>
//                       <input
//                         type="date"
//                         id="date"
//                         className="form-control detail"
//                         defaultValue={assignmentDate}
//                         ref={dateRef}
//                         onChange={handleDateChange}
//                       />
//                     </div>

//                     <div className="col-md-3">
//                       <label htmlFor="admitted-class" className="form-label">
//                         Admitted Class <span style={{ color: "red" }}>*</span>
//                       </label>
//                       {classLoading ? (
//                         <p>Loading classes...</p>
//                       ) : classError ? (
//                         <p style={{ color: "red" }}>
//                           Error loading classes: {classError}
//                         </p>
//                       ) : (
//                         <select
//                           id="admitted-class"
//                           className="form-select detail"
//                           value={formData.classId}
//                           onChange={handleClassChange}
//                           required
//                         >
//                           <option value="">Select Class</option>
//                           {classes.map((classItem) => (
//                             <option key={classItem.id} value={classItem.id}>
//                               {classItem.classname}
//                             </option>
//                           ))}
//                         </select>
//                       )}
//                     </div>

//                     <div className="col-md-3">
//                       <label htmlFor="admitted-section" className="form-label">
//                         Admitted Section <span style={{ color: "red" }}>*</span>
//                       </label>
//                       {sectionLoading ? (
//                         <p>Loading sections...</p>
//                       ) : sectionError ? (
//                         <p style={{ color: "red" }}>
//                           Error loading sections: {sectionError}
//                         </p>
//                       ) : (
//                         <select
//                           id="admitted-section"
//                           className="form-select detail"
//                           value={formData.sectionId}
//                           onChange={handleSectionChange}
//                           required
//                         >
//                           <option value="">Select Section</option>
//                           {sections.map((section) => (
//                             <option
//                               key={section.section_id}
//                               value={section.section_id}
//                             >
//                               {section.sectionname}
//                             </option>
//                           ))}
//                         </select>
//                       )}
//                     </div>

//                     <div className="col-12 col-md-3 mb-1">
//                       <label htmlFor="fee-app-from" className="form-label">
//                         Period<span style={{ color: "red" }}>*</span>
//                       </label>
//                       {error ? (
//                         <p style={{ color: "red" }}>{error}</p>
//                       ) : (
//                         <select
//                           id="fee-app-from"
//                           className="form-select detail"
//                           value={formData.feeappfrom}
//                           onChange={handleInputChange}
//                           name="feeappfrom"
//                           disabled={isDisabled}
//                         >
//                           <option value="">Select period</option>
//                           {periods.map((period) => (
//                             <option key={period.id} value={period.id}>
//                               {period.period_name}
//                             </option>
//                           ))}
//                         </select>
//                       )}
//                     </div>

//                     {/* Subject Display */}
//                     <div className="col-md-3 mb-4">
//                       <label htmlFor="subject" className="form-label">
//                         Subject <span style={{ color: "red" }}>*</span>
//                       </label>
//                       <select id="subject" className="form-select detail">
//                         <option value="">{subject || "Select Subject"}</option>
//                       </select>
//                     </div>

//                     {/* Teacher Display */}
//                     <div className="col-md-3">
//                       <label htmlFor="teacher" className="form-label">
//                         Teacher <span style={{ color: "red" }}>*</span>
//                       </label>
//                       <select id="teacher" className="form-select detail">
//                         <option value="">{teacher || "Select Teacher"}</option>
//                       </select>
//                     </div>

//                     <div className="col-md-6 d-flex align-items-center">
//                       <span className="me-3" style={{ fontWeight: "700" }}>
//                         Send SMS to:
//                       </span>
//                       <div className="form-check me-3">
//                         <input
//                           className="form-check-input details"
//                           type="radio"
//                           name="smsTo"
//                           id="smsToFather"
//                           checked={smsTo === "F"}
//                           onChange={() => setSmsTo("F")}
//                         />
//                         <label
//                           className="form-check-label"
//                           htmlFor="smsToFather"
//                         >
//                           Father
//                         </label>
//                       </div>
//                       <div className="form-check me-3">
//                         <input
//                           className="form-check-input details"
//                           type="radio"
//                           name="smsTo"
//                           id="smsToMother"
//                           checked={smsTo === "M"}
//                           onChange={() => setSmsTo("M")}
//                         />
//                         <label
//                           className="form-check-label"
//                           htmlFor="smsToMother"
//                         >
//                           Mother
//                         </label>
//                       </div>
//                       <div className="form-check">
//                         <input
//                           className="form-check-input details"
//                           type="radio"
//                           name="smsTo"
//                           id="smsToBoth"
//                           checked={smsTo === "B"}
//                           onChange={() => setSmsTo("B")}
//                         />
//                         <label className="form-check-label" htmlFor="smsToBoth">
//                           Both
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="row mt-3 mx-2">
//                 <div className="col-12 custom-section-box">
//                   <p
//                     className="mb-0"
//                     style={{
//                       fontWeight: "bold",
//                       textDecoration: "underline",
//                       fontSize: "14px",
//                     }}
//                   >
//                     Please Note:
//                   </p>
//                   <p className="mb-0" style={{ fontSize: "14px" }}>
//                     1. Only current date Attendance can be edited.
//                   </p>
//                   <p style={{ fontSize: "14px" }}>
//                     2. Past date and Current date Attendance can be viewed.
//                   </p>
//                 </div>
//               </div>

//               {/* Table */}

//                 <div className="col-12">
//                   <div className="table-responsive">
//                     <table className="table table-bordered table-striped">
//                       <thead>
//                         <tr>
//                           <th>Sl.No</th>
//                           <th>Class</th>
//                           <th>Section</th>
//                           <th>Roll No</th>
//                           <th>School Admission No</th>
//                           <th>BarCode</th>
//                           <th>Student Name</th>
//                           <th>Primary Guardian</th>
//                           <th>Father Mobile No</th>
//                           <th>Mother Mobile No</th>
//                           <th>Mark Attendance</th>
//                           <th>Remarks</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {attendanceData.length === 0 ? (
//                           <tr>
//                             <td colSpan="12" className="text-center">
//                               No records found
//                             </td>
//                           </tr>
//                         ) : (
//                           attendanceData.map((student, index) => (
//                             <tr key={student.studentId}>
//                               <td>{index + 1}</td>
//                               <td>{student.classname}</td>
//                               <td>{student.sectionname}</td>
//                               <td>{student.rollno || "N/A"}</td>
//                               <td>{student.school_admission_no}</td>
//                               <td>{student.barcode}</td>
//                               <td>{student.studentname}</td>
//                               <td>{student.primary_guardian}</td>
//                               <td>
//                                 <input
//                                   type="text"
//                                   className="form-control detail"
//                                   value={student.father_contact_number}
//                                   onChange={(e) =>
//                                     handleContactNumberChange(
//                                       student.studentId,
//                                       "father_contact_number",
//                                       e.target.value
//                                     )
//                                   }
//                                   disabled={!isEditing}
//                                 />
//                               </td>
//                               <td>
//                                 <input
//                                   type="text"
//                                   className="form-control detail"
//                                   value={student.mother_contact_number}
//                                   onChange={(e) =>
//                                     handleContactNumberChange(
//                                       student.studentId,
//                                       "mother_contact_number",
//                                       e.target.value
//                                     )
//                                   }
//                                   disabled={!isEditing}
//                                 />
//                               </td>
//                               <td>
//                                 <select
//                                   className="form-select"
//                                   value={student.present || "present"}
//                                   onChange={(e) =>
//                                     handleContactNumberChange(
//                                       student.studentId,
//                                       "present",
//                                       e.target.value
//                                     )
//                                   }
//                                   disabled={!isEditing}
//                                 >
//                                   <option value="present">Present</option>
//                                   <option value="absent">Absent</option>
//                                   <option value="leave">Leave</option>
//                                 </select>
//                               </td>

//                               <td>
//                                 <textarea
//                                   className="form-control detail"
//                                   value={student.remarks}
//                                   onChange={(e) =>
//                                     handleContactNumberChange(
//                                       student.studentId,
//                                       "remarks",
//                                       e.target.value
//                                     )
//                                   }
//                                   disabled={!isEditing}
//                                   style={{
//                                     resize: isEditing ? "both" : "none",
//                                   }}
//                                 />
//                               </td>
//                             </tr>
//                           ))
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

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
import useFetchSections from "../../hooks/useFetchSections";
import  useCourses from "../../hooks/useFetchClasses";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AdmAttendanceEntry = () => {
  const dateRef = useRef(null);
  const navigate = useNavigate();
  const [selectedMonths, setSelectedMonths] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const [assignmentDate, setAssignmentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [smsTo, setSmsTo] = useState("B");
  // const [smsTo, setSmsTo] = useState("F");
  const fromClassRef = useRef(null);
  const toClassRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);
  const [periods, setPeriods] = useState([]);
  const [formData, setFormData] = useState({
    classId: "",
    sectionId: "",
    feeappfrom: "",
    subject: "",
    teacher: "",
    studentName: "",
    admissionNo: "",
  });
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [filteredStudents, setFilteredStudents] = useState([]);
  const [tableVisible, setTableVisible] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [subjectsList, setSubjectsList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  // const handleSave = async () => {
  //   setIsEditing(false); // Disable editing mode

  //   // Collect necessary data from storage
  //   const userId = sessionStorage.getItem("userId");
  //   const academicSessionId = localStorage.getItem("academicSessionId");
  //   const selectedStudentClassId = localStorage.getItem(
  //     "selectedStudentClassId"
  //   );
  //   const selectedStudentSectionId = localStorage.getItem(
  //     "selectedStudentSectionId"
  //   );
  //   const selectedPeriodId = localStorage.getItem("selectedPeriodId");
  //   const subjectId = localStorage.getItem("subjectId");
  //   const teacherId = localStorage.getItem("teacherId");
  //   const studentId = localStorage.getItem("studentId"); // Retrieve studentId from localStorage

  //   // Collect date from the form
  //   const date = dateRef.current.value;

  //   // Validate mobile numbers to ensure they are exactly 10 digits
  //   for (let index = 0; index < attendanceData.length; index++) {
  //     const student = attendanceData[index];
  //     const { father_contact_number, mother_contact_number } = student;

  //     // Check if father's contact number is valid
  //     if (father_contact_number && father_contact_number.length !== 10) {
  //       alert(
  //         `Sl.No. ${index + 1}: Father's contact number for student ${
  //           student.studentId
  //         } should be exactly 10 digits.`
  //       );
  //       return; // Stop execution if validation fails
  //     }

  //     // Check if mother's contact number is valid
  //     if (mother_contact_number && mother_contact_number.length !== 10) {
  //       alert(
  //         `Sl.No. ${index + 1}: Mother's contact number for student ${
  //           student.studentId
  //         } should be exactly 10 digits.`
  //       );
  //       return; // Stop execution if validation fails
  //     }
  //   }

  //   // Prepare the payload for the API
  //   const updateDetails = attendanceData.map((student) => {
  //     // Map the attendance values (Present -> P, Absent -> A, Leave -> L)
  //     const markAttendance =
  //       student.present === "present"
  //         ? "P"
  //         : student.present === "absent"
  //         ? "A"
  //         : student.present === "leave"
  //         ? "L"
  //         : "P"; // Default to 'P' (Present) if status not recognized

  //     return {
  //       studentId: student.studentId,
  //       father_contact_number: student.father_contact_number,
  //       mother_contact_number: student.mother_contact_number,
  //       mark_Attendance: markAttendance, // P, A, or L
  //       remarks: student.remarks,
  //       send_sms_to: smsTo, // Send SMS to Father, Mother, or Both (F, M, or B)
  //     };
  //   });

  //   const payload = {
  //     loginId: userId,
  //     academic_year_id: academicSessionId,
  //     date: date,
  //     classId: selectedStudentClassId,
  //     sectionId: selectedStudentSectionId,
  //     claasPeriodId: selectedPeriodId,
  //     subjectId: subjectId,
  //     teacherId: teacherId,
  //     updateDetails: updateDetails, // Pass the updated attendance and SMS data
  //   };

  //   console.log(payload); // Log the payload for debugging

  //   try {
  //     // Send the API request
  //     const response = await fetch(
  //       "${ApiUrl.apiurl}StudentAttendance/CreateOrUpdateAttendance/",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     const result = await response.json();

  //     // Handle API response
  //     if (response.ok) {
  //       // Success - Show success message in alert
  //       alert("Attendance saved successfully!");
  //       console.log("Attendance saved successfully:", result);
  //       // Handle success (e.g., update UI, clear form, etc.)
  //     } else {
  //       // Failure - Show error message in alert
  //       alert(`Error saving attendance: ${result.message || "Unknown error"}`);
  //       console.error("Error saving attendance:", result);
  //       // Handle failure (e.g., show an error message on the UI)
  //     }
  //   } catch (error) {
  //     console.error("Error while making the API call:", error);
  //     // Handle network or other errors
  //     alert(`Error while making the API call: ${error.message}`);
  //   }
  // };

  const handleSave = async () => {
    setIsEditing(false);

    const userId = sessionStorage.getItem("userId");
    const academicSessionId = localStorage.getItem("academicSessionId");
    const selectedStudentClassId = localStorage.getItem(
      "selectedStudentClassId"
    );
    const selectedStudentSectionId = localStorage.getItem(
      "selectedStudentSectionId"
    );
    const selectedPeriodId = localStorage.getItem("selectedPeriodId");
    const subjectId = localStorage.getItem("subjectId");
    const teacherId = localStorage.getItem("teacherId");
    const studentId = localStorage.getItem("studentId");

    const date = dateRef.current.value;

    const currentDate = new Date().toISOString().split("T")[0];
    if (date !== currentDate) {
      alert("Only today's attendance can be edited.");
      return;
    }

    for (let index = 0; index < attendanceData.length; index++) {
      const student = attendanceData[index];
      const { father_contact_number, mother_contact_number } = student;

      if (father_contact_number && father_contact_number.length !== 10) {
        alert(
          `Sl.No. ${index + 1}: Father's contact number for student ${student.studentId
          } should be exactly 10 digits.`
        );
        return;
      }

      if (mother_contact_number && mother_contact_number.length !== 10) {
        alert(
          `Sl.No. ${index + 1}: Mother's contact number for student ${student.studentId
          } should be exactly 10 digits.`
        );
        return;
      }
    }

    const updateDetails = attendanceData.map((student) => {
      const markAttendance =
        student.present === "present"
          ? "P"
          : student.present === "absent"
            ? "A"
            : student.present === "leave"
              ? "L"
              : "P";

      return {
        studentId: student.studentId,
        father_contact_number: student.father_contact_number,
        mother_contact_number: student.mother_contact_number,
        mark_Attendance: markAttendance,
        remarks: student.remarks,
        send_sms_to: smsTo,
      };
    });

    const payload = {
      loginId: userId,
      academic_year_id: academicSessionId,
      date: date,
      classId: selectedStudentClassId,
      sectionId: selectedStudentSectionId,
      claasPeriodId: selectedPeriodId,
      subjectId: subjectId,
      teacherId: teacherId,
      updateDetails: updateDetails,
    };

    console.log(payload);

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}StudentAttendance/CreateOrUpdateAttendance/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Attendance saved successfully!");
        console.log("Attendance saved successfully:", result);
      } else {
        alert(`Error saving attendance: ${result.message || "Unknown error"}`);
        console.error("Error saving attendance:", result);
      }
    } catch (error) {
      console.error("Error while making the API call:", error);

      alert(`Error while making the API call: ${error.message}`);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const {
    classes,
    loading: classLoading,
    error: classError,
  } =  useCourses();

  const {
    sections,
    loading: sectionLoading,
    error: sectionError,
  } = useFetchSections(formData.classId);

  const [studentsData, setStudentsData] = useState([]);
  // const handleClassChange = (e) => {
  //   const classId = e.target.value;

  //   if (classId) {
  //     localStorage.setItem("selectedStudentClassId", classId);
  //   } else {
  //     localStorage.removeItem("selectedStudentClassId");
  //   }

  //   setFormData((prev) => ({
  //     ...prev,
  //     classId,
  //     sectionId: "",
  //   }));

  //   setSelectedClassId(classId);
  // };

  const handleClassChange = (e) => {
    const classId = e.target.value;

    // Update localStorage
    if (classId) {
      localStorage.setItem("selectedStudentClassId", classId);
    } else {
      localStorage.removeItem("selectedStudentClassId");
    }

    // Clear all form fields, attendance data and localStorage student info
    setFormData({
      classId: classId,
      sectionId: "",
      feeappfrom: "",
      subject: "",
      teacher: "",
      studentName: "",
      admissionNo: "",
    });

    setAttendanceData([]); // clear table data
    setFilteredStudents([]); // if used
    setTableVisible(false); // hide table if you're using this flag
    setSubject(""); // clear subject
    setTeacher(""); // clear teacher
    setAttendanceStatus(""); // reset radio group
    setStudentError(""); // reset error message if any

    // Remove stale entries from localStorage
    localStorage.removeItem("selectedStudentSectionId");
    localStorage.removeItem("selectedPeriodId");
    localStorage.removeItem("subjectId");
    localStorage.removeItem("teacherId");
    localStorage.removeItem("studentId");
  };

  // const handleSectionChange = (e) => {
  //   const sectionId = e.target.value;

  //   if (sectionId) {
  //     localStorage.setItem("selectedStudentSectionId", sectionId);
  //   } else {
  //     localStorage.removeItem("selectedStudentSectionId");
  //   }

  //   setFormData((prev) => ({ ...prev, sectionId }));
  // };

  const handleSectionChange = (e) => {
    const sectionId = e.target.value;

    if (sectionId) {
      localStorage.setItem("selectedStudentSectionId", sectionId);
    } else {
      localStorage.removeItem("selectedStudentSectionId");
    }

    // Clear period, subject, teacher selections and related localStorage
    localStorage.removeItem("selectedPeriodId");
    localStorage.removeItem("subjectId");
    localStorage.removeItem("teacherId");

    setFormData((prev) => ({
      ...prev,
      sectionId,
      feeappfrom: "", // clear selected period
      subject: "",
      teacher: "",
    }));

    setSubject("");
    setTeacher("");
    setSubjectsList([]);
    setTeachersList([]);
  };

  // const handleClear = () => {
  //   const retainedFields = [
  //     "academicSessionId",
  //     "branchId",
  //     "nextAcademicSessionId",
  //     "orgId",
  //   ];
  //   const retainedValues = {};

  //   retainedFields.forEach((key) => {
  //     retainedValues[key] = localStorage.getItem(key);
  //   });

  //   localStorage.clear();

  //   Object.keys(retainedValues).forEach((key) => {
  //     if (retainedValues[key] !== null) {
  //       localStorage.setItem(key, retainedValues[key]);
  //     }
  //   });

  //   setFormData((prevData) => ({
  //     ...prevData,
  //     classId: "",
  //     sectionId: "",
  //     feeappfrom: "",
  //     subject: prevData.subject,
  //     teacher: prevData.teacher,
  //   }));

  //   window.location.reload();
  // };

  //New code 07242025
  const handleClear = () => {
    const retainedFields = [
      "academicSessionId",
      "branchId",
      "nextAcademicSessionId",
      "orgId",
    ];
    const retainedValues = {};

    retainedFields.forEach((key) => {
      retainedValues[key] = localStorage.getItem(key);
    });

    localStorage.clear();

    Object.keys(retainedValues).forEach((key) => {
      if (retainedValues[key] !== null) {
        localStorage.setItem(key, retainedValues[key]);
      }
    });

    setFormData((prevData) => ({
      ...prevData,
      classId: "",
      sectionId: "",
      feeappfrom: "",
      subject: "",
      teacher: "",
      // subject: prevData.subject,
      // teacher: prevData.teacher,
    }));
    setSubject("");
    setTeacher("");
    setSubjectsList([]);
    setTeachersList([]);

    // window.location.reload();
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    const orgId = localStorage.getItem("orgId");
    const branchId = localStorage.getItem("branchId");

    const apiUrl = `${ApiUrl.apiurl}CLASS_PERIOD/GetCLASSPERIODLIST/${orgId}/${branchId}`;

    fetch(apiUrl)
      .then((response) =>
        response.ok ? response.json() : Promise.reject(response.status)
      )
      .then((data) => {
        setPeriods(data.data || []);
      })
      .catch(() => setError("Failed to load periods."));
  }, []);

  // useEffect(() => {
  //   const {
  //     academicSessionId,
  //     orgId,
  //     branchId,
  //     selectedStudentClassId,
  //     selectedStudentSectionId,
  //     selectedPeriodId,
  //   } = localStorage;

  //   if (formData.feeappfrom && assignmentDate) {
  //     const apiUrl = `${ApiUrl.apiurl}FILTER/GetSUBJECTTEACHERBASEDONPERIOD/?academic_year_id=${academicSessionId}&org_id=${orgId}&branch_id=${branchId}&date=${assignmentDate}&classId=${selectedStudentClassId}&sectionId=${selectedStudentSectionId}&claasPeriodId=${selectedPeriodId}`;

  //     fetch(apiUrl)
  //       .then((response) =>
  //         response.ok ? response.json() : Promise.reject(response.status)
  //       )
  //       .then((data) => {
  //         if (data.message === "success" && data.data) {
  //           const { teacherId, teachername, subjectId, subjectname } =
  //             data.data;

  //           localStorage.setItem("teacherId", teacherId);
  //           localStorage.setItem("subjectId", subjectId);

  //           setSubject(subjectname || "");
  //           setTeacher(teachername || "");
  //         } else {
  //           setSubject("");
  //           setTeacher("");
  //         }
  //       })
  //       .catch(() => {
  //         setError("Failed to fetch subject and teacher.");
  //         setSubject("");
  //         setTeacher("");
  //       });
  //   }
  // }, [formData.feeappfrom, assignmentDate]);

  //New Updated Code
  // useEffect(() => {
  //   const {
  //     academicSessionId,
  //     orgId,
  //     branchId,
  //     selectedStudentClassId,
  //     selectedStudentSectionId,
  //     selectedPeriodId,
  //   } = localStorage;

  //   if (formData.feeappfrom && assignmentDate) {
  //     const apiUrl = `${ApiUrl.apiurl}FILTER/GetSUBJECTTEACHERBASEDONPERIOD/?academic_year_id=${academicSessionId}&org_id=${orgId}&branch_id=${branchId}&date=${assignmentDate}&classId=${selectedStudentClassId}&sectionId=${selectedStudentSectionId}&claasPeriodId=${selectedPeriodId}`;

  //     fetch(apiUrl)
  //       .then((response) =>
  //         response.ok ? response.json() : Promise.reject(response.status)
  //       )
  //       .then((data) => {
  //         if (data.message === "success" && Array.isArray(data.data)) {
  //           const subjectOptions = data.data.map((item) => ({
  //             id: item.subjectId,
  //             name: item.subjectname,
  //           }));
  //           const teacherOptions = data.data.map((item) => ({
  //             id: item.teacherId,
  //             name: item.teachername,
  //           }));

  //           // Set first values by default
  //           if (data.data.length > 0) {
  //             const { subjectId, teacherId } = data.data[0];
  //             localStorage.setItem("subjectId", subjectId);
  //             localStorage.setItem("teacherId", teacherId);
  //           }

  //           setSubjectsList(subjectOptions);
  //           setTeachersList(teacherOptions);

  //           // Optional: set default subject & teacher names
  //           setSubject(data.data[0].subjectname);
  //           setTeacher(data.data[0].teachername);
  //         } else {
  //           setSubjectsList([]);
  //           setTeachersList([]);
  //           setSubject("");
  //           setTeacher("");
  //         }
  //       })
  //       .catch(() => {
  //         setError("Failed to fetch subject and teacher.");
  //         setSubjectsList([]);
  //         setTeachersList([]);
  //         setSubject("");
  //         setTeacher("");
  //       });
  //   }
  // }, [formData.feeappfrom, assignmentDate]);

  useEffect(() => {
    const {
      academicSessionId,
      orgId,
      branchId,
      selectedStudentClassId,
      selectedStudentSectionId,
      selectedPeriodId,
    } = localStorage;

    if (formData.feeappfrom && assignmentDate) {
      const apiUrl = `${ApiUrl.apiurl}FILTER/GetSUBJECTTEACHERBASEDONPERIOD/?academic_year_id=${academicSessionId}&org_id=${orgId}&branch_id=${branchId}&date=${assignmentDate}&classId=${selectedStudentClassId}&sectionId=${selectedStudentSectionId}&claasPeriodId=${selectedPeriodId}`;

      fetch(apiUrl)
        .then((response) =>
          response.ok ? response.json() : Promise.reject(response.status)
        )
        .then((data) => {
          if (
            data.message === "success" &&
            Array.isArray(data.data) &&
            data.data.length > 0
          ) {
            const subjectOptions = data.data.map((item) => ({
              id: item.subjectId,
              name: item.subjectname,
            }));
            const teacherOptions = data.data.map((item) => ({
              id: item.teacherId,
              name: item.teachername,
            }));

            // Set first values by default
            const { subjectId, teacherId, subjectname, teachername } =
              data.data[0];
            localStorage.setItem("subjectId", subjectId);
            localStorage.setItem("teacherId", teacherId);

            setSubjectsList(subjectOptions);
            setTeachersList(teacherOptions);
            setSubject(subjectname);
            setTeacher(teachername);
          } else {
            // No data case
            setSubjectsList([]);
            setTeachersList([]);
            setSubject("");
            setTeacher("");
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
          setSubjectsList([]);
          setTeachersList([]);
          setSubject("");
          setTeacher("");
          // Don’t set error that breaks UI — just let dropdown show fallback
        });
    }
  }, [formData.feeappfrom, assignmentDate]);

  const handleInputChange = (e) => {
    if (!e || !e.target) {
      console.error("Invalid event object", e);
      return;
    }

    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "feeappfrom") {
      localStorage.setItem("selectedPeriodId", value);
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setAssignmentDate(selectedDate);
    localStorage.setItem("assignmentDate", selectedDate);
  };

  // const fetchAttendanceData = async () => {
  //   const date = dateRef.current.value;
  //   const classId = formData.classId;
  //   const sectionId = formData.sectionId;
  //   const periodId = formData.feeappfrom;
  //   // const teacher = formData.teacher;
  //   // const subject = formData.subject;
  //   if (!date) {
  //     alert("Please select a date.");
  //     return;
  //   }
  //   if (!classId) {
  //     alert("Please select a class.");
  //     return;
  //   }
  //   if (!sectionId) {
  //     alert("Please select a section.");
  //     return;
  //   }
  //   if (!periodId) {
  //     alert("Please select a period.");
  //     return;
  //   }

  //   const selectedDate = new Date(date);
  //   const currentDate = new Date();

  //   selectedDate.setHours(0, 0, 0, 0);
  //   currentDate.setHours(0, 0, 0, 0);

  //   if (selectedDate > currentDate) {
  //     alert("You cannot view attendance for a future date.");
  //     return;
  //   }

  //   const academicSessionId = localStorage.getItem("academicSessionId");
  //   const subjectId = localStorage.getItem("subjectId");
  //   const teacherId = localStorage.getItem("teacherId");

  //   const url = `${ApiUrl.apiurl}StudentAttendance/GetSearchAttendanceByDateclassperiod/?academic_year_id=${academicSessionId}&date=${date}&classId=${classId}&sectionId=${sectionId}&claasPeriodId=${periodId}&subjectId=${subjectId}&teacherId=${teacherId}`;

  //   try {
  //     const response = await fetch(url);
  //     const result = await response.json();
  //     if (result.message === "success") {
  //       setAttendanceData(result.data);

  //       if (result.data && result.data.length > 0) {
  //         const studentId = result.data[0].studentId;
  //         localStorage.setItem("studentId", studentId);
  //       }
  //     } else {
  //       alert("Failed to fetch data.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching attendance data:", error);
  //     alert("An error occurred while fetching attendance data.");
  //   }
  // };

  const fetchAttendanceData = async () => {
    const date = dateRef.current.value;
    const classId = formData.classId;
    const sectionId = formData.sectionId;
    const periodId = formData.feeappfrom;

    if (!date) {
      alert("Please select a date.");
      return;
    }
    if (!classId) {
      alert("Please select a class.");
      return;
    }
    if (!sectionId) {
      alert("Please select a section.");
      return;
    }
    if (!periodId) {
      alert("Please select a period.");
      return;
    }

    const selectedDate = new Date(date);
    const currentDate = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate > currentDate) {
      alert("You cannot view attendance for a future date.");
      return;
    }

    const academicSessionId = localStorage.getItem("academicSessionId");
    const subjectId = localStorage.getItem("subjectId");
    const teacherId = localStorage.getItem("teacherId");

    const url = `${ApiUrl.apiurl}StudentAttendance/GetSearchAttendanceByDateclassperiod/?academic_year_id=${academicSessionId}&date=${date}&classId=${classId}&sectionId=${sectionId}&claasPeriodId=${periodId}&subjectId=${subjectId}&teacherId=${teacherId}`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      if (result.message === "success") {
        const formattedData = result.data.map((student) => ({
          ...student,
          present:
            student.present === "P"
              ? "present"
              : student.present === "A"
                ? "absent"
                : student.present === "L"
                  ? "leave"
                  : "",
        }));

        setAttendanceData(formattedData);

        if (formattedData.length > 0) {
          const studentId = formattedData[0].studentId;
          localStorage.setItem("studentId", studentId);
        }
      } else {
        alert("Failed to fetch data.");
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      alert("An error occurred while fetching attendance data.");
    }
  };

  const handleContactNumberChange = (studentId, field, value) => {
    setAttendanceData((prevData) =>
      prevData.map((student) =>
        student.studentId === studentId
          ? { ...student, [field]: value }
          : student
      )
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                ATTENDANCE
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12  d-flex flex-wrap gap-2 ">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={fetchAttendanceData}
                  >
                    Display
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleEdit}
                    disabled={isEditing}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSave}
                    disabled={!isEditing}
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
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              {/* <div className="row  mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="row  mt-3 ">
                    <div className="col-md-3 mb-3  ">
                      <label htmlFor="date" className="form-label">
                        Date <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        id="date"
                        className="form-control detail"
                        defaultValue={assignmentDate}
                        ref={dateRef}
                        onChange={handleDateChange}
                      />
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="admitted-class" className="form-label">
                        Admitted Class <span style={{ color: "red" }}>*</span>
                      </label>
                      {classLoading ? (
                        <p>Loading classes...</p>
                      ) : classError ? (
                        <p style={{ color: "red" }}>
                          Error loading classes: {classError}
                        </p>
                      ) : (
                        <select
                          id="admitted-class"
                          className="form-select detail"
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
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="admitted-section" className="form-label">
                        Admitted Section <span style={{ color: "red" }}>*</span>
                      </label>
                      {sectionLoading ? (
                        <p>Loading sections...</p>
                      ) : sectionError ? (
                        <p style={{ color: "red" }}>
                          Error loading sections: {sectionError}
                        </p>
                      ) : (
                        <select
                          id="admitted-section"
                          className="form-select detail"
                          value={formData.sectionId}
                          onChange={handleSectionChange}
                          required
                        >
                          <option value="">Select Section</option>
                          {sections.map((section) => (
                            <option
                              key={section.section_id}
                              value={section.section_id}
                            >
                              {section.sectionname}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="col-12 col-md-3 mb-1">
                      <label htmlFor="fee-app-from" className="form-label">
                        Period<span style={{ color: "red" }}>*</span>
                      </label>
                      {error ? (
                        <p style={{ color: "red" }}>{error}</p>
                      ) : (
                        <select
                          id="fee-app-from"
                          className="form-select detail"
                          value={formData.feeappfrom}
                          onChange={handleInputChange}
                          name="feeappfrom"
                          disabled={isDisabled}
                        >
                          <option value="">Select period</option>
                          {periods.map((period) => (
                            <option key={period.id} value={period.id}>
                              {period.period_name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="col-md-3 mb-4">
                      <label htmlFor="subject" className="form-label">
                        Subject <span style={{ color: "red" }}>*</span>
                      </label>
                      <select id="subject" className="form-select detail">
                        <option value="">{subject || "Select Subject"}</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="teacher" className="form-label">
                        Teacher <span style={{ color: "red" }}>*</span>
                      </label>
                      <select id="teacher" className="form-select detail">
                        <option value="">{teacher || "Select Teacher"}</option>
                      </select>
                    </div>

                    <div className="col-md-6 d-flex align-items-center">
                      <span className="me-3" style={{ fontWeight: "700" }}>
                        Send SMS to:
                      </span>
                      <div className="form-check me-3">
                        <input
                          className="form-check-input details"
                          type="radio"
                          name="smsTo"
                          id="smsToFather"
                          checked={smsTo === "F"}
                          onChange={() => setSmsTo("F")}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="smsToFather"
                        >
                          Father
                        </label>
                      </div>
                      <div className="form-check me-3">
                        <input
                          className="form-check-input details"
                          type="radio"
                          name="smsTo"
                          id="smsToMother"
                          checked={smsTo === "M"}
                          onChange={() => setSmsTo("M")}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="smsToMother"
                        >
                          Mother
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input details"
                          type="radio"
                          name="smsTo"
                          id="smsToBoth"
                          checked={smsTo === "B"}
                          onChange={() => setSmsTo("B")}
                        />
                        <label className="form-check-label" htmlFor="smsToBoth">
                          Both
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="row mt-3 mx-2">
                <div
                  className="col-12 custom-section-box"
                  style={{
                    minHeight: "260px",
                    padding: "20px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                  }}
                >
                  <div className="row mt-3">
                    {/* Date */}
                    <div className="col-md-3 mb-3">
                      <label htmlFor="date" className="form-label">
                        Date <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        id="date"
                        className="form-control detail"
                        defaultValue={assignmentDate}
                        ref={dateRef}
                        onChange={handleDateChange}
                      />
                    </div>

                    {/* Class */}
                    <div className="col-md-3">
                      <label htmlFor="admitted-class" className="form-label">
                        Class <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        id="admitted-class"
                        className="detail"
                        classNamePrefix="react-select"
                        options={classes.map((classItem) => ({
                          value: classItem.id,
                          label: classItem.classname,
                        }))}
                        value={
                          classes
                            .map((classItem) => ({
                              value: classItem.id,
                              label: classItem.classname,
                            }))
                            .find(
                              (option) => option.value === formData.classId
                            ) || null
                        }
                        onChange={(selectedOption) =>
                          handleClassChange({
                            target: { value: selectedOption?.value },
                          })
                        }
                        placeholder="Select Class"
                      />
                    </div>

                    {/* Section */}
                    <div className="col-md-3">
                      <label htmlFor="admitted-section" className="form-label">
                        Admitted Section <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        id="admitted-section"
                        className="detail"
                        classNamePrefix="react-select"
                        options={sections.map((section) => ({
                          value: section.section_id,
                          label: section.sectionname,
                        }))}
                        value={
                          sections
                            .map((section) => ({
                              value: section.section_id,
                              label: section.sectionname,
                            }))
                            .find(
                              (option) => option.value === formData.sectionId
                            ) || null
                        }
                        onChange={(selectedOption) =>
                          handleSectionChange({
                            target: { value: selectedOption?.value },
                          })
                        }
                        placeholder="Select Section"
                      />
                    </div>

                    {/* Period */}
                    <div className="col-12 col-md-3 mb-1">
                      <label htmlFor="fee-app-from" className="form-label">
                        Period <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        id="fee-app-from"
                        className="detail"
                        classNamePrefix="react-select"
                        isDisabled={isDisabled}
                        options={
                          periods.length > 0
                            ? periods.map((period) => ({
                              value: period.id,
                              label: period.period_name,
                            }))
                            : [
                              {
                                value: "",
                                label: "No Periods Available",
                                isDisabled: true,
                              },
                            ]
                        }
                        value={
                          periods
                            .map((period) => ({
                              value: period.id,
                              label: period.period_name,
                            }))
                            .find(
                              (option) => option.value === formData.feeappfrom
                            ) || null
                        }
                        onChange={(selectedOption) =>
                          handleInputChange({
                            target: {
                              name: "feeappfrom",
                              value: selectedOption?.value,
                            },
                          })
                        }
                        placeholder="Select Period"
                      />
                    </div>

                    {/* Subject */}
                    <div className="col-md-3 mb-4">
                      <label htmlFor="subject" className="form-label">
                        Subject <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        id="subject"
                        className="detail"
                        classNamePrefix="react-select"
                        options={subjectsList.map((s) => ({
                          value: s.id,
                          label: s.name,
                        }))}
                        value={
                          subjectsList
                            .map((s) => ({
                              value: s.id,
                              label: s.name,
                            }))
                            .find((option) => option.label === subject) || null
                        }
                        onChange={(selectedOption) =>
                          setSubject(selectedOption ? selectedOption.label : "")
                        }
                        placeholder="Select Subject"
                      />
                    </div>
                    {/* Teacher */}
                    <div className="col-md-3">
                      <label htmlFor="teacher" className="form-label">
                        Teacher <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        id="teacher"
                        className="detail"
                        classNamePrefix="react-select"
                        options={teachersList.map((t) => ({
                          value: t.id,
                          label: t.name,
                        }))}
                        value={
                          teachersList
                            .map((t) => ({
                              value: t.id,
                              label: t.name,
                            }))
                            .find((option) => option.label === teacher) || null
                        }
                        onChange={(selectedOption) =>
                          setTeacher(selectedOption ? selectedOption.label : "")
                        }
                        placeholder="Select Teacher"
                      />
                    </div>

                    {/* SMS + Attendance Row */}
                    <div className="row mb-3">
                      {/* Send SMS To Section */}
                      <div className="col-12 col-md-6 mb-3 mb-md-0">
                        <div className="border p-3 rounded h-100">
                          <div className="fw-bold mb-2">Send SMS to:</div>
                          <div className="d-flex flex-wrap gap-3">
                            <div className="d-flex align-items-center">
                              <input
                                className="form-check-input me-2"
                                type="radio"
                                name="smsTo"
                                id="smsToFather"
                                checked={smsTo === "F"}
                                onChange={() => setSmsTo("F")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="smsToFather"
                              >
                                Father
                              </label>
                            </div>
                            <div className="d-flex align-items-center">
                              <input
                                className="form-check-input me-2"
                                type="radio"
                                name="smsTo"
                                id="smsToMother"
                                checked={smsTo === "M"}
                                onChange={() => setSmsTo("M")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="smsToMother"
                              >
                                Mother
                              </label>
                            </div>
                            <div className="d-flex align-items-center">
                              <input
                                className="form-check-input me-2"
                                type="radio"
                                name="smsTo"
                                id="smsToBoth"
                                checked={smsTo === "B"}
                                onChange={() => setSmsTo("B")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="smsToBoth"
                              >
                                Both
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Attendance Status Section */}
                      <div className="col-12 col-md-6">
                        <div className="border p-3 rounded h-100">
                          <div className="fw-bold mb-2">Attendance Status:</div>
                          <div className="d-flex flex-wrap">
                            <div className="form-check me-4 mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="attendanceStatus"
                                id="markAllPresent"
                                checked={attendanceStatus === "present"}
                                onChange={() => {
                                  setAttendanceStatus("present");
                                  if (isEditing) {
                                    setAttendanceData((prevData) =>
                                      prevData.map((student) => ({
                                        ...student,
                                        present: "present",
                                      }))
                                    );
                                  }
                                }}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="markAllPresent"
                              >
                                Mark All Present
                              </label>
                            </div>
                            <div className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="attendanceStatus"
                                id="markAllAbsent"
                                checked={attendanceStatus === "absent"}
                                onChange={() => {
                                  setAttendanceStatus("absent");
                                  if (isEditing) {
                                    setAttendanceData((prevData) =>
                                      prevData.map((student) => ({
                                        ...student,
                                        present: "absent",
                                      }))
                                    );
                                  }
                                }}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="markAllAbsent"
                              >
                                Mark All Absent
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <p
                    className="mb-0"
                    style={{
                      fontWeight: "bold",
                      textDecoration: "underline",
                      fontSize: "14px",
                    }}
                  >
                    Please Note:
                  </p>
                  <p className="mb-0" style={{ fontSize: "14px" }}>
                    1. Only current date Attendance can be edited.
                  </p>
                  <p style={{ fontSize: "14px" }}>
                    2. Past date and Current date Attendance can be viewed.
                  </p>
                </div>
              </div>

              {/* Table */}
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered ">
                    <thead>
                      <tr>
                        <th>Sl.No</th>
                        <th>Class</th>
                        <th>Section</th>
                        <th>Roll No</th>
                        <th>School Admission No</th>
                        <th>BarCode</th>
                        <th>Student Name</th>
                        <th>Primary Guardian</th>
                        <th>Father Mobile No</th>
                        <th>Mother Mobile No</th>
                        <th>Mark Attendance</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.length === 0 ? (
                        <tr>
                          <td colSpan="12" className="text-center">
                            No records found
                          </td>
                        </tr>
                      ) : (
                        attendanceData.map((student, index) => (
                          <tr key={student.studentId}>
                            <td>{index + 1}</td>
                            <td>{student.classname}</td>
                            <td>{student.sectionname}</td>
                            <td>{student.rollno || "N/A"}</td>
                            <td>{student.school_admission_no}</td>
                            <td>{student.barcode}</td>
                            <td>{student.studentname}</td>
                            <td>{student.primary_guardian}</td>
                            <td>
                              <input
                                type="text"
                                className="form-control detail"
                                value={student.father_contact_number}
                                onChange={(e) =>
                                  handleContactNumberChange(
                                    student.studentId,
                                    "father_contact_number",
                                    e.target.value
                                  )
                                }
                                disabled={!isEditing}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control detail"
                                value={student.mother_contact_number}
                                onChange={(e) =>
                                  handleContactNumberChange(
                                    student.studentId,
                                    "mother_contact_number",
                                    e.target.value
                                  )
                                }
                                disabled={!isEditing}
                              />
                            </td>
                            <td>
                              <select
                                className="form-select"
                                value={student.present || "present"}
                                onChange={(e) =>
                                  handleContactNumberChange(
                                    student.studentId,
                                    "present",
                                    e.target.value
                                  )
                                }
                                disabled={!isEditing}
                              >
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                {/* <option value="leave">Leave</option> */}
                              </select>
                            </td>

                            <td>
                              <textarea
                                className="form-control detail"
                                value={student.remarks}
                                onChange={(e) =>
                                  handleContactNumberChange(
                                    student.studentId,
                                    "remarks",
                                    e.target.value
                                  )
                                }
                                disabled={!isEditing}
                                style={{
                                  resize: isEditing ? "both" : "none",
                                }}
                              />
                            </td>
                          </tr>
                        ))
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
