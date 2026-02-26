///diby vai code ///

// import React, { useRef, useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { ApiUrl } from "../../../ApiUrl";
// import { fetchTeacherList } from "../../hooks/fetchTeacherList";
// import { fetchClassList } from "../../hooks/fetchClassList";
// import useFetchSections from "../../hooks/useFetchSections";
// import { fetchSubjectList } from "../../hooks/fetchSubjectList";
// import "./AdmAttendanceEntry.css";

// const AdmAttendanceEntry = () => {
//   // const dateRef = useRef(null);
//   const dateRef = useRef();
//   const teacherRef = useRef(null);
//   const classRef = useRef(null);
//   const sectionRef = useRef(null);
//   const periodRef = useRef(null);
//   const subjectRef = useRef(null);
//   const assignmentDetailsRef = useRef(null);
//   const fatherSmsRef = useRef(null);
//   const motherSmsRef = useRef(null);
//   const uploadRef = useRef(null);

//   const [showModal, setShowModal] = useState(false);
//   const [remainingChars, setRemainingChars] = useState(5000);
//   const [classes, setClasses] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [formData, setFormData] = useState({
//     selectedClassId: "",
//     admitted_section: "",
//     subjectId: "",
//     periodId: "",
//     assignmentDate: "",
//   });

//   const [periods, setPeriods] = useState([]);
//   const [subjects, setSubjects] = useState([]);

//   const { sections } = useFetchSections(formData.selectedClassId);
//   const [assignments, setAssignments] = useState([]);
//   const [dropdownData, setDropdownData] = useState({
//     teacherName: "",
//     classname: "",
//     sectionname: "",
//     subjectName: "",
//     periodName: "",
//   });
//   const [smsRecipient, setSmsRecipient] = useState("B");
//   const todayDate = new Date().toISOString().split("T")[0];

//   useEffect(() => {
//     const currentDate = new Date().toISOString().split("T")[0];
//     setFormData((prevData) => ({ ...prevData, assignmentDate: currentDate }));
//     fetchTeacherListData(currentDate);
//   }, []);

//   const fetchTeacherListData = async (assignmentDate) => {
//     const academicYearId = 1;
//     try {
//       const teacherList = await fetchTeacherList(
//         academicYearId,
//         assignmentDate
//       );
//       setTeachers(teacherList);
//     } catch (error) {
//       console.error("Error fetching teacher list:", error);
//     }
//   };

//   const handleDateChange = (e) => {
//     const selectedDate = e.target.value;

//     setFormData((prevData) => ({
//       ...prevData,
//       assignmentDate: selectedDate,
//     }));

//     localStorage.setItem("assignmentDate", selectedDate);

//     fetchTeacherListData(selectedDate);
//   };

//   useEffect(() => {
//     const fetchAssignments = async () => {
//       try {
//         const orgId = localStorage.getItem("orgId");
//         const branchId = localStorage.getItem("branchId");
//         const academicYearId = localStorage.getItem("academicSessionId");

//         if (!orgId || !branchId || !academicYearId) {
//           console.error("Missing required parameters in localStorage");
//           return;
//         }

//         const apiUrl = `${ApiUrl.apiurl}ASSIGNMENT/GetAllassignmentList/${orgId}/${branchId}/${academicYearId}`;

//         const response = await fetch(apiUrl);
//         const data = await response.json();

//         if (data.message === "Success") {
//           setAssignments(data.data);
//         } else {
//           console.error("Error fetching assignments:", data.message);
//         }
//       } catch (error) {
//         console.error("Error:", error);
//       }
//     };

//     fetchAssignments();
//   }, []);

//   const handleDownload = (fileUrl) => {
//     if (!fileUrl) {
//       console.error("No file URL provided");
//       return;
//     }

//     const link = document.createElement("a");
//     link.href = fileUrl;

//     link.download = fileUrl.split("/").pop();

//     document.body.appendChild(link);
//     link.click();

//     document.body.removeChild(link);
//   };

//   const handleClear = () => {
//     // Clear form fields
//     if (teacherRef.current) teacherRef.current.value = "";
//     if (classRef.current) classRef.current.value = "";
//     if (sectionRef.current) sectionRef.current.value = "";
//     if (periodRef.current) periodRef.current.value = "";
//     if (subjectRef.current) subjectRef.current.value = "";
//     if (assignmentDetailsRef.current) assignmentDetailsRef.current.value = "";
//     if (fatherSmsRef.current) fatherSmsRef.current.checked = false;
//     if (motherSmsRef.current) motherSmsRef.current.checked = false;
//     if (uploadRef.current) uploadRef.current.value = null;

//     // Retain specific keys in localStorage
//     const keysToRetain = [
//       "academicSessionId",
//       "orgId",
//       "branchId",
//       "nextAcademicSessionId",
//     ];

//     // Get all keys from localStorage
//     const allKeys = Object.keys(localStorage);

//     // Clear all items except the ones that should be retained
//     allKeys.forEach((key) => {
//       if (!keysToRetain.includes(key)) {
//         localStorage.removeItem(key);
//       }
//     });

//     // Optionally reload the page
//     window.location.reload();
//   };

//   const [message, setMessage] = useState("");
//   const [isSmsChecked, setIsSmsChecked] = useState(false);

//   const handleTextareaChange = (event) => {
//     const inputMessage = event.target.value;

//     setFormData((prevState) => ({
//       ...prevState,
//       assignmentDetails: inputMessage,
//     }));

//     if (remainingChars <= 0 && inputMessage.length > message.length) {
//       return;
//     }

//     setMessage(inputMessage);
//     if (isSmsChecked) {
//       setRemainingChars(159 - inputMessage.length);
//     } else {
//       setRemainingChars(5000 - inputMessage.length);
//     }
//   };

//   const handleRadioChange = () => {
//     setIsSmsChecked((prevState) => {
//       const newState = !prevState;
//       if (newState) {
//         setRemainingChars(159 - message.length);
//       } else {
//         setRemainingChars(5000 - message.length);
//       }
//       return newState;
//     });
//   };
//   useEffect(() => {
//     const today = new Date();
//     const formattedDate = today.toISOString().split("T")[0];

//     if (dateRef.current) {
//       dateRef.current.value = formattedDate;

//       localStorage.setItem("assignmentDate", formattedDate);
//     }
//   }, []);

//   const [errors, setError] = useState(null);

//   useEffect(() => {
//     const academicYearId = localStorage.getItem("academicSessionId");
//     const assignmentDate = localStorage.getItem("assignmentDate");

//     if (academicYearId && assignmentDate) {
//       fetchTeacherList(academicYearId, assignmentDate)
//         .then((data) => setTeachers(data))
//         .catch((err) => {
//           console.error("Error:", err);
//           setError("Failed to load teachers");
//         });
//     }
//   }, [
//     localStorage.getItem("academicSessionId"),
//     localStorage.getItem("assignmentDate"),
//   ]);

//   const handleTeacherChange = (event) => {
//     const selectedTeacherId = event.target.value;

//     if (selectedTeacherId) {
//       localStorage.setItem("selectedTeacherId", selectedTeacherId);
//       console.log(`Teacher ID ${selectedTeacherId} stored in localStorage`);

//       setFormData((prevData) => ({
//         ...prevData,
//         teacherId: selectedTeacherId,
//       }));

//       fetchClassList()
//         .then((data) => {
//           setClasses(data);
//         })
//         .catch((err) => {
//           console.error("Error:", err);
//           setError("Failed to load classes");
//         });
//     } else {
//       setClasses([]);
//     }
//   };

//   useEffect(() => {
//     fetchClassList().then((data) => {
//       setClasses(data);
//     });
//   }, []);

//   const handleClassChange = (event) => {
//     const selectedClassId = event.target.value;

//     // Update form data with selected class ID and reset the section value
//     setFormData((prevData) => ({
//       ...prevData,
//       selectedClassId: selectedClassId,
//       sectionId: "",
//     }));

//     localStorage.setItem("selectedClassId", selectedClassId);
//   };

//   useEffect(() => {
//     // Retrieve stored data from localStorage
//     const academicSessionId = localStorage.getItem("academicSessionId");
//     const assignmentDate = localStorage.getItem("assignmentDate");
//     const selectedTeacherId = localStorage.getItem("selectedTeacherId");
//     const selectedClassId = localStorage.getItem("selectedClassId");
//     const admittedSection = localStorage.getItem("admitted_section");
//     const selectedSubject = localStorage.getItem("selected_subject");

//     fetchSubjects();

//     if (selectedSubject) {
//       fetchPeriods(
//         academicSessionId,
//         assignmentDate,
//         selectedTeacherId,
//         selectedClassId,
//         admittedSection,
//         selectedSubject
//       );
//     }
//   }, []);

//   const fetchSubjects = async () => {
//     const response = await fetch("/api/subjects");
//     const data = await response.json();
//     setSubjects(data);
//   };

//   const fetchPeriods = async (
//     academicSessionId,
//     assignmentDate,
//     selectedTeacherId,
//     selectedClassId,
//     admittedSection,
//     selectedSubject
//   ) => {
//     if (
//       academicSessionId &&
//       assignmentDate &&
//       selectedTeacherId &&
//       selectedClassId &&
//       admittedSection &&
//       selectedSubject
//     ) {
//       const apiUrl = `${ApiUrl.apiurl}Teacher/GetPeriodListBasedOnSubject/${academicSessionId}/${assignmentDate}/${selectedTeacherId}/${selectedClassId}/${admittedSection}/${selectedSubject}`;
//       const response = await fetch(apiUrl);
//       const result = await response.json();

//       if (result && result.data) {
//         setPeriods(result.data);
//       } else {
//         setPeriods([]);
//       }
//     }
//   };

//   const handleSectionChange = async (e) => {
//     const sectionId = e.target.value;

//     setSubjects([]);

//     setFormData((prevData) => ({
//       ...prevData,
//       sectionId: sectionId,
//     }));

//     localStorage.setItem("admitted_section", sectionId);

//     const academicYearId = localStorage.getItem("academicSessionId");
//     const date = localStorage.getItem("assignmentDate");
//     const teacherId = localStorage.getItem("selectedTeacherId");
//     const classId = localStorage.getItem("selectedClassId");

//     if (academicYearId && date && teacherId && classId && sectionId) {
//       try {
//         const fetchedSubjects = await fetchSubjectList({
//           academicYearId,
//           date,
//           teacherId,
//           classId,
//           sectionId,
//         });

//         if (
//           fetchedSubjects.message === "success!!" &&
//           Array.isArray(fetchedSubjects.data)
//         ) {
//           setSubjects(fetchedSubjects.data);
//         } else {
//           console.error("API response did not contain valid data.");
//           setSubjects([]);
//         }
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//         setSubjects([]);
//       }
//     } else {
//       console.error("Missing required parameters for API call");
//     }
//   };

//   useEffect(() => {
//     const admittedSection = localStorage.getItem("admitted_section");
//     if (admittedSection) {
//       setFormData((prevData) => ({
//         ...prevData,
//         admitted_section: admittedSection,
//       }));
//     }
//   }, []);

//   const handleSubjectChange = (e) => {
//     const subjectId = e.target.value;

//     setFormData((prevData) => ({
//       ...prevData,
//       subjectId,
//       periodId: "",
//     }));

//     localStorage.setItem("selected_subject", subjectId);

//     fetchPeriodsFromAPI(subjectId);
//   };

//   const fetchPeriodsFromAPI = (subjectId) => {
//     const academicSessionId = localStorage.getItem("academicSessionId");
//     const assignmentDate = localStorage.getItem("assignmentDate");
//     const selectedTeacherId = localStorage.getItem("selectedTeacherId");
//     const selectedClassId = localStorage.getItem("selectedClassId");
//     const admittedSection = localStorage.getItem("admitted_section");

//     fetchPeriods(
//       academicSessionId,
//       assignmentDate,
//       selectedTeacherId,
//       selectedClassId,
//       admittedSection,
//       subjectId
//     );
//   };

//   const handleEditClick = async (assignmentId) => {
//     try {
//       const response = await fetch(
//         `${ApiUrl.apiurl}ASSIGNMENT/GetAssignmentBasedId/${assignmentId}`
//       );
//       const data = await response.json();
//       console.log(data);

//       if (data.message === "Success") {
//         const assignmentDetails = data.data;

//         // Update form data with fetched assignment details
//         setFormData({
//           assignmentId: assignmentDetails.id,
//           assignmentDate: assignmentDetails.assignment_date || "",
//           teacherId: assignmentDetails.teacherId || "", // Ensure teacherId is set here
//           classId: assignmentDetails.classId || "",
//           sectionId: assignmentDetails.sectionId || "",
//           subjectId: assignmentDetails.subjectId || "",
//           periodId: assignmentDetails.classperiodId || "",
//           assignmentDetails: assignmentDetails.assignment_details || "",
//           sendSms: assignmentDetails.send_sms || "N",
//           smsSentTo: assignmentDetails.sms_sent_to || "B",
//         });

//         // Update dropdown labels with the current assignment values
//         setDropdownData({
//           teacherName: assignmentDetails.teacherName || "",
//           classname: assignmentDetails.classname || "",
//           sectionname: assignmentDetails.sectionname || "",
//           subjectName: assignmentDetails.subjectName || "",
//           periodName: assignmentDetails.classperiodName || "",
//         });

//         // Set SMS recipient checkboxes
//         setSmsRecipient(assignmentDetails.sms_sent_to || "B");

//         // Set the selected assignment data in the localStorage for further use
//         localStorage.setItem("assignmentId", assignmentDetails.id || "");

//         localStorage.setItem(
//           "assignmentDate",
//           assignmentDetails.assignment_date || ""
//         );
//         localStorage.setItem(
//           "selectedTeacherId",
//           assignmentDetails.teacherId || ""
//         );
//         localStorage.setItem(
//           "selectedClassId",
//           assignmentDetails.classId || ""
//         );
//         localStorage.setItem(
//           "selectedSectionId",
//           assignmentDetails.sectionId || ""
//         );
//         localStorage.setItem(
//           "selectedSubjectId",
//           assignmentDetails.subjectId || ""
//         );
//         localStorage.setItem(
//           "selectedPeriodId",
//           assignmentDetails.classperiodId || ""
//         );

//         // Fetch the teacher list based on the assignment date
//         const academicSessionId = localStorage.getItem("academicSessionId");
//         const assignmentDate = assignmentDetails.assignment_date || "";

//         if (academicSessionId && assignmentDate) {
//           const teacherListResponse = await fetch(
//             `${ApiUrl.apiurl}Teacher/GetTeacherListBasedOnDay/${academicSessionId}/${assignmentDate}`
//           );
//           const teacherListData = await teacherListResponse.json();

//           if (teacherListData && teacherListData.message === "Success") {
//             setTeachers(teacherListData.data || []);
//           } else {
//             console.error(
//               "Failed to fetch teacher list:",
//               teacherListData.message
//             );
//           }
//         } else {
//           console.error("Academic Session ID or Assignment Date is missing");
//         }
//       } else {
//         console.error("Error fetching assignment details:", data.message);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const handleSave = async () => {
//     const formDataToSend = new FormData();

//     const assignmentId = localStorage.getItem("editAssignmentId");
//     const isEdit = !!assignmentId;

//     const academicYearId = localStorage.getItem("academicSessionId");
//     const classId = localStorage.getItem("selectedClassId");
//     const sectionId = localStorage.getItem("admitted_section");
//     const subjectId = localStorage.getItem("selected_subject");
//     const classPeriodId = localStorage.getItem("selected_periodId");
//     const assignmentDetails = formData.assignmentDetails || "";
//     const teacherId = localStorage.getItem("selectedTeacherId");

//     // Append mandatory fields
//     formDataToSend.append("academic_year_id", academicYearId);
//     formDataToSend.append("class_id", classId);
//     formDataToSend.append("section_id", sectionId);
//     formDataToSend.append("subject_id", subjectId);
//     formDataToSend.append("assignment_date", dateRef.current.value);
//     formDataToSend.append("assignment_details", assignmentDetails);
//     formDataToSend.append("org_id", localStorage.getItem("orgId"));
//     formDataToSend.append("branch_id", localStorage.getItem("branchId"));
//     formDataToSend.append("class_period_id", classPeriodId);
//     formDataToSend.append("teacher_id", teacherId);

//     // Get the selected SMS option
//     const selectedSmsOption = document.querySelector(
//       'input[name="smsRecipient"]:checked'
//     );
//     const smsRecipient = selectedSmsOption ? selectedSmsOption.value : "B";

//     // Append optional fields
//     formDataToSend.append("send_sms", isSmsChecked ? "Y" : "N");
//     formDataToSend.append("sms_sent_to", smsRecipient);
//     formDataToSend.append("is_active", true);
//     formDataToSend.append("created_by", sessionStorage.getItem("userId"));

//     // Handle file upload
//     const fileInput = uploadRef.current.files[0];
//     if (fileInput) {
//       formDataToSend.append("assignment_file", fileInput);
//     } else {
//       console.log("No file uploaded, skipping file attachment.");
//     }

//     try {
//       const apiUrl = isEdit
//         ? `${ApiUrl.apiurl}ASSIGNMENT/UpdateAssignment/${assignmentId}`
//         : `${ApiUrl.apiurl}ASSIGNMENT/CreateAllassignment/`;

//       const response = await fetch(apiUrl, {
//         method: isEdit ? "PUT" : "POST",
//         body: formDataToSend,
//       });

//       if (response.ok) {
//         const result = await response.json();
//         alert(
//           result.message ||
//             (isEdit
//               ? "Assignment Updated Successfully!"
//               : "Assignment Added Successfully!")
//         );

//         if (isEdit) {
//           localStorage.removeItem("editAssignmentId");
//         }

//         // Reload the window or clear form
//         // window.location.reload();
//       } else {
//         const error = await response.json();
//         console.error("Error response:", error);
//         alert(
//           error.assignment_file?.[0] ||
//             (isEdit
//               ? "Failed to update assignment for the specified criteria!"
//               : "Assignment already exists for the specified criteria!")
//         );
//       }
//     } catch (error) {
//       console.error("Error saving assignment:", error);
//     }
//   };

//   const handleUpdateClick = async () => {
//     const assignmentId = formData.assignmentId;

//     if (!assignmentId) {
//       console.error("Assignment ID is missing.");
//       return;
//     }

//     const updatedAssignmentData = {
//       academic_year_id: localStorage.getItem("academicSessionId") || null,
//       class_id: formData.classId || null,
//       section_id: formData.sectionId || null,
//       subject_id: formData.subjectId || null,
//       assignment_date: formData.assignmentDate || null,
//       assignment_file: null,
//       assignment_details: formData.assignmentDetails || "",
//       org_id: localStorage.getItem("orgId") || null,
//       branch_id: localStorage.getItem("branchId") || null,
//       class_period_id: formData.periodId || null,
//       teacher_id: formData.teacherId || null,
//       send_sms: formData.sendSms || "",
//       sms_sent_to: formData.smsSentTo || "",
//       updated_by: sessionStorage.getItem("userId") || null,
//     };

//     try {
//       console.log("Sending update request with data:", updatedAssignmentData);

//       const updateResponse = await fetch(
//         `${ApiUrl.apiurl}ASSIGNMENT/updateassignment/${assignmentId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(updatedAssignmentData),
//         }
//       );

//       const updateData = await updateResponse.json();

//       console.log("API response:", updateData);

//       if (updateData.message === "Assignment updated successfully.") {
//         alert("Updated successfully!");
//         // Handle failure or unexpected response
//         console.error("Failed to update assignment:", updateData.message);
//         alert("Failed to update assignment. Please try again.");
//       }
//     } catch (error) {
//       // Catch and log any error that occurs during the API call
//       console.error("Error updating assignment:", error);
//       alert("Failed to update assignment. Please try again.");
//     }
//   };

//   const [data, setData] = useState(assignments);

//   const handleDelete = async (id) => {
//     const confirmation = window.confirm(
//       "Are you sure you want to delete this assignment?"
//     );
//     if (!confirmation) {
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${ApiUrl.apiurl}ASSIGNMENT/deleteassignment/${id}`,
//         {
//           method: "DELETE",
//         }
//       );

//       const result = await response.json();

//       if (result.message === "Assignment Deleted Successfully") {
//         setData((prevData) => prevData.filter((item) => item.id !== id));
//         alert("Assignment deleted successfully.");
//       } else {
//         alert(`Failed to delete the assignment: ${result.message}`);
//       }
//     } catch (error) {
//       console.error("Error deleting assignment:", error);
//       alert("An error occurred while deleting the assignment.");
//     }
//   };

//   return (
//     <div className="container-fluid ">
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
//                 Assignment Entry
//               </p>

//               <div className="row mb-3 mt-3 mx-0">
//                 <div className="col-12">
//                   <button
//                     type="button"
//                     className="btn btn-primary me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                     onClick={handleUpdateClick}
//                   >
//                     Update
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
//                     className="btn btn-primary me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                     onClick={handleSave}
//                   >
//                     Save
//                   </button>

//                   <button
//                     type="button"
//                     className="btn btn-danger me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                   >
//                     {" "}
//                     Close{" "}
//                   </button>
//                 </div>
//               </div>

//               <div className="row mt-3 mx-2">
//                 <div className="col-12 custom-section-box">
//                   <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
//                     <div className="row flex-grow-1 mt-3">
//                       <div className="col-12 col-md-3 mb-3">
//                         <label htmlFor="assignment-date" className="form-label">
//                           Assignment Date{" "}
//                           <span style={{ color: "red" }}>*</span>
//                         </label>
//                         <input
//                           type="date"
//                           id="assignment-date"
//                           className="form-control detail"
//                           ref={dateRef}
//                           value={formData.assignmentDate}
//                           onChange={handleDateChange}
//                         />
//                       </div>
//                       <div className="col-12 col-md-3 mb-1">
//                         <label htmlFor="teacher" className="form-label">
//                           Teacher<span style={{ color: "red" }}>*</span>
//                         </label>
//                         <select
//                           id="teacher"
//                           className="detail"
//                           value={formData.teacherId}
//                           onChange={handleTeacherChange}
//                         >
//                           <option value="">{"Select Teacher"}</option>
//                           {teachers.map((teacher) => (
//                             <option
//                               key={teacher.teacherId}
//                               value={teacher.teacherId}
//                             >
//                               {teacher.TeacherName}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       <div className="col-12 col-md-3 mb-1">
//                         <label htmlFor="class" className="form-label">
//                           Class <span style={{ color: "red" }}>*</span>
//                         </label>
//                         <select
//                           id="class"
//                           className="detail"
//                           value={formData.selectedClassId}
//                           onChange={handleClassChange}
//                         >
//                           <option value="">
//                             {dropdownData.classname || "Select Class"}{" "}
//                             {/* Default option */}
//                           </option>
//                           {classes.map((classItem) => (
//                             <option
//                               key={classItem.classId}
//                               value={classItem.classId}
//                             >
//                               {classItem.classname}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div className="col-12 col-md-3 mb-1">
//                         <label
//                           htmlFor="admitted-section"
//                           className="form-label"
//                         >
//                           Admitted Section{" "}
//                           <span style={{ color: "red" }}>*</span>
//                         </label>
//                         <select
//                           id="admitted-section"
//                           className="detail"
//                           value={formData.sectionId}
//                           onChange={handleSectionChange}
//                         >
//                           <option value="">
//                             {dropdownData.sectionname || "Select Section"}{" "}
//                             {/* Default option */}
//                           </option>
//                           {sections.map((section) => (
//                             <option
//                               key={section.section_id}
//                               value={section.section_id}
//                             >
//                               {section.sectionname}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
//                     <div className="row flex-grow-1">
//                       {/* Subject Selection */}
//                       <div className="col-12 col-md-3 mb-3">
//                         <label htmlFor="subject" className="form-label">
//                           Subject <span style={{ color: "red" }}>*</span>
//                         </label>

//                         <select
//                           id="subject"
//                           className="detail"
//                           value={formData.subjectId}
//                           onChange={handleSubjectChange}
//                         >
//                           <option value="">
//                             {dropdownData.subjectName || "Select Subject"}{" "}
//                             {/* Default option */}
//                           </option>
//                           {subjects.map((subject) => (
//                             <option
//                               key={subject.subjectId}
//                               value={subject.subjectId}
//                             >
//                               {subject.subjectname}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       {/* Period Selection */}
//                       <div className="col-12 col-md-3 mb-2">
//                         <label htmlFor="period" className="form-label">
//                           Period<span style={{ color: "red" }}>*</span>
//                         </label>
//                         <select
//                           id="period"
//                           className="detail"
//                           value={formData.periodId}
//                           onChange={(e) => {
//                             const selectedPeriodId = e.target.value;

//                             setFormData((prevData) => ({
//                               ...prevData,
//                               periodId: selectedPeriodId,
//                             }));

//                             localStorage.setItem(
//                               "selected_periodId",
//                               selectedPeriodId
//                             );
//                           }}
//                         >
//                           {/* Default option */}
//                           <option value="">
//                             {dropdownData.periodName || "Select Period"}
//                           </option>

//                           {/* Render options dynamically */}
//                           {periods.map((period) => (
//                             <option
//                               key={period.classperiodId}
//                               value={period.classperiodId}
//                             >
//                               {period.periodName}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div className="col-12 col-md-3 mb-0">
//                         <label htmlFor="upload" className="form-label">
//                           {" "}
//                           Upload Assignment{" "}
//                         </label>
//                         <input
//                           type="file"
//                           name="upload"
//                           id="upload"
//                           ref={uploadRef}
//                           className="form-control detail"
//                         />
//                       </div>
//                       <div className="mb-3 me-2 d-flex align-items-center">
//                         <span className="me-3" style={{ fontWeight: "700" }}>
//                           Send SMS to:
//                         </span>
//                         <div className="form-check me-3 mb-2">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="smsRecipient"
//                             id="flexRadioDefault1"
//                             value="F"
//                             checked={smsRecipient === "F"}
//                             onChange={(e) => setSmsRecipient(e.target.value)}
//                           />
//                           <label
//                             className="form-check-label"
//                             htmlFor="flexRadioDefault1"
//                           >
//                             Father
//                           </label>
//                         </div>
//                         <div className="form-check me-3 mb-2">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="smsRecipient"
//                             id="flexRadioDefault2"
//                             value="M"
//                             checked={smsRecipient === "M"}
//                             onChange={(e) => setSmsRecipient(e.target.value)}
//                           />
//                           <label
//                             className="form-check-label"
//                             htmlFor="flexRadioDefault2"
//                           >
//                             Mother
//                           </label>
//                         </div>
//                         <div className="form-check mb-2">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="smsRecipient"
//                             id="flexRadioDefault3"
//                             value="B"
//                             checked={smsRecipient === "B"}
//                             onChange={(e) => setSmsRecipient(e.target.value)}
//                           />
//                           <label
//                             className="form-check-label"
//                             htmlFor="flexRadioDefault3"
//                           >
//                             Both
//                           </label>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="row  mt-3 mx-2">
//                 <div className="col-12 custom-section-box">
//                   <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
//                     <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center flex-grow-1">
//                       <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
//                         <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center flex-grow-1">
//                           <div className="mb-2 me-2 d-flex align-items-center">
//                             <span
//                               className="me-3"
//                               style={{ fontWeight: "700" }}
//                             >
//                               Send SMS:
//                             </span>
//                             <div className="d-flex flex-column me-2">
//                               <div className="form-check mb-2">
//                                 <input
//                                   className="form-check-input"
//                                   type="checkbox"
//                                   name="smsTo"
//                                   id="smsToFather"
//                                   checked={isSmsChecked}
//                                   onChange={handleRadioChange}
//                                   style={{ width: "18px", height: "18px" }} // Adjust size as needed
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="d-flex flex-column flex-grow-1 me-md-2">
//                         <label
//                           htmlFor="assignmentDetails"
//                           className="form-label"
//                         >
//                           Assignment Details{" "}
//                           <span style={{ color: "red" }}>*</span>
//                         </label>
//                         <textarea
//                           className="form-control detail"
//                           id="assignmentDetails"
//                           rows="3"
//                           name="assignmentDetails"
//                           value={formData.assignmentDetails}
//                           onChange={handleTextareaChange}
//                           style={{ resize: "both", overflow: "auto" }}
//                         ></textarea>
//                         <div className="d-flex justify-content-middle">
//                           <small className="text-muted">
//                             Remaining characters:{" "}
//                             <span style={{ color: "red" }}>
//                               {remainingChars}
//                             </span>
//                           </small>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="row mt-3 mx-2">
//                 <div className="col-12 custom-section-box">
//                   1. Only current date Assignments can be edited.<br></br>
//                   2. When Send SMS is selected, Assignments details field length
//                   will be limited to 159 characters.
//                 </div>
//               </div>

//                 <div className="col-12" >
//                   <div className="table-responsive">
//                     <table className="table">
//                       <thead>
//                         <tr>
//                           <th>Sr.No</th>
//                           <th>Date</th>
//                           <th>Class</th>
//                           <th>Section</th>
//                           <th>Subject</th>
//                           <th>Period</th>
//                           <th>Teacher</th>
//                           <th>Assignment</th>
//                           <th>Attachment</th>
//                           <th>Send SMS to</th>
//                           <th>Edit</th>
//                           <th>Delete</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {assignments.map((assignment, index) => (
//                           <tr key={assignment.id}>
//                             <td>{index + 1}</td>
//                             <td>{assignment.assignment_date}</td>
//                             <td>{assignment.classname}</td>
//                             <td>{assignment.sectionname}</td>
//                             <td>{assignment.subjectName}</td>
//                             <td>{assignment.classperiodName}</td>
//                             <td>{assignment.teacherName}</td>
//                             <td>
//                               <div className="hoverable-text">
//                                 {assignment.assignment_details.length > 50
//                                   ? `${assignment.assignment_details.substring(
//                                       0,
//                                       50
//                                     )}...`
//                                   : assignment.assignment_details}
//                                 <div className="hover-popup">
//                                   {assignment.assignment_details}
//                                 </div>
//                               </div>
//                             </td>

//                             <td>
//                               {assignment.assignment_file ? (
//                                 <button
//                                   className="btn btn-link"
//                                   onClick={() =>
//                                     handleDownload(assignment.assignment_file)
//                                   }
//                                 >
//                                   Download
//                                 </button>
//                               ) : (
//                                 "No file"
//                               )}
//                             </td>
//                             <td>
//                               {assignment.send_sms === "Y" ? "Yes" : "No"}
//                             </td>
//                             <td>
//                               <button
//                                 disabled={
//                                   assignment.assignment_date !== todayDate
//                                 }
//                                 className="btn btn-primary"
//                                 onClick={() => handleEditClick(assignment.id)}
//                               >
//                                 Edit
//                               </button>
//                             </td>
//                             <td>
//                               <button
//                                 className="btn btn-danger"
//                                 onClick={() => handleDelete(assignment.id)}
//                               >
//                                 Delete
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
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

///priyabrat code //
import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";
import { fetchClassList } from "../../hooks/fetchClassList";
import useFetchSections from "../../hooks/useFetchSections";
import { fetchSubjectList } from "../../hooks/fetchSubjectList";
import "./AdmAttendanceEntry.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AdmAttendanceEntry = () => {
  const dateRef = useRef();
  const teacherRef = useRef(null);
  const classRef = useRef(null);
  const sectionRef = useRef(null);
  const periodRef = useRef(null);
  const subjectRef = useRef(null);
  const assignmentDetailsRef = useRef(null);
  const fatherSmsRef = useRef(null);
  const motherSmsRef = useRef(null);
  const uploadRef = useRef(null);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [remainingChars, setRemainingChars] = useState(5000);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    selectedClassId: "",
    admitted_section: "",
    subjectId: "",
    periodId: "",
    assignmentDate: "",
  });

  const [periods, setPeriods] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const { sections } = useFetchSections(formData.selectedClassId);
  const [assignments, setAssignments] = useState([]);
  const [dropdownData, setDropdownData] = useState({
    teacherName: "",
    classname: "",
    sectionname: "",
    subjectName: "",
    periodName: "",
  });
  const [smsRecipient, setSmsRecipient] = useState("B");
  const todayDate = new Date().toISOString().split("T")[0];

  // Retrieve IDs from storage
  const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");
  const orgId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
  const userId = sessionStorage.getItem("userId");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setFormData((prevData) => ({ ...prevData, assignmentDate: currentDate }));
    if (orgId && branchId) {
      fetchTeacherListData(currentDate);
    }
  }, [orgId, branchId, userId]);

  const fetchTeacherListData = async (assignmentDate) => {
    if (!orgId || !branchId) {
      console.error("Missing orgId or branchId");
      return;
    }

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}Teacher/GetEmployeeList/?orgId=${orgId}&branchId=${branchId}`
      );
      const data = await response.json();

      if (data && data.data) {
        let teacherList = data.data.map((teacher) => ({
          teacherId: teacher.id,
          TeacherName: teacher.employeeName,
        }));

        // Filter for logged-in user if userId exists
        if (userId) {
          const loggedInTeacher = teacherList.find(t => String(t.teacherId) === String(userId));
          if (loggedInTeacher) {
            teacherList = [loggedInTeacher];
            // Auto-select the logged-in teacher
            setFormData((prevData) => ({
              ...prevData,
              teacherId: loggedInTeacher.teacherId,
            }));
            localStorage.setItem("selectedTeacherId", loggedInTeacher.teacherId);
            // Fetch classes for this teacher
            fetchClassList().then((data) => {
              setClasses(data);
            }).catch(err => {
              console.error("Error fetching classes:", err);
            });
          }
        }

        setTeachers(teacherList);
      }
    } catch (error) {
      console.error("Error fetching teacher list:", error);
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    setFormData((prevData) => ({
      ...prevData,
      assignmentDate: selectedDate,
    }));

    localStorage.setItem("assignmentDate", selectedDate);

    fetchTeacherListData(selectedDate);
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const academicYearId = localStorage.getItem("academicSessionId");

        if (!orgId || !branchId || !academicYearId) {
          console.error("Missing required parameters for fetching assignments");
          return;
        }

        const apiUrl = `${ApiUrl.apiurl}ASSIGNMENT/GetAllassignmentList/${orgId}/${branchId}/${academicYearId}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.message === "Success") {
          setAssignments(data.data);
        } else {
          console.error("Error fetching assignments:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (orgId && branchId) {
      fetchAssignments();
    }
  }, [orgId, branchId]);

  const handleDownload = (fileUrl) => {
    if (!fileUrl) {
      console.error("No file URL provided");
      return;
    }

    const link = document.createElement("a");
    link.href = fileUrl;

    link.download = fileUrl.split("/").pop();

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  // const handleClear = () => {
  //   if (teacherRef.current) teacherRef.current.value = "";
  //   if (classRef.current) classRef.current.value = "";
  //   if (sectionRef.current) sectionRef.current.value = "";
  //   if (periodRef.current) periodRef.current.value = "";
  //   if (subjectRef.current) subjectRef.current.value = "";
  //   if (assignmentDetailsRef.current) assignmentDetailsRef.current.value = "";
  //   if (fatherSmsRef.current) fatherSmsRef.current.checked = false;
  //   if (motherSmsRef.current) motherSmsRef.current.checked = false;
  //   if (uploadRef.current) uploadRef.current.value = null;

  //   const keysToRetain = [
  //     "academicSessionId",
  //     "orgId",
  //     "branchId",
  //     "nextAcademicSessionId",
  //   ];

  //   const allKeys = Object.keys(localStorage);

  //   allKeys.forEach((key) => {
  //     if (!keysToRetain.includes(key)) {
  //       localStorage.removeItem(key);
  //     }
  //   });

  //   // window.location.reload();
  // };

  const handleClear = () => {
    // Reset all controlled form data except teacherId for staff
    setFormData({
      selectedClassId: "",
      admitted_section: "",
      subjectId: "",
      periodId: "",
      assignmentDate: todayDate,
      assignmentDetails: "",
      teacherId: formData.teacherId, // Keep the logged-in teacher selected
      sectionId: "",
    });

    // Clear react-select dropdowns by resetting the formData which they use
    setDropdownData({
      teacherName: "",
      classname: "",
      sectionname: "",
      subjectName: "",
      periodName: "",
    });

    // Reset lists except teachers
    setPeriods([]);
    setSubjects([]);
    setClasses([]);
    // Don't clear teachers list for staff

    // Clear file, checkboxes, and textarea
    if (uploadRef.current) uploadRef.current.value = null;
    if (assignmentDetailsRef.current) assignmentDetailsRef.current.value = "";
    if (fatherSmsRef.current) fatherSmsRef.current.checked = false;
    if (motherSmsRef.current) motherSmsRef.current.checked = false;

    // Reset SMS state
    setIsSmsChecked(false);
    setSmsRecipient("B");
    setMessage("");
    setRemainingChars(5000);

    // Clean unnecessary localStorage but keep selectedTeacherId for staff
    const keysToRetain = [
      "academicSessionId",
      "orgId",
      "branchId",
      "nextAcademicSessionId",
      "assignmentDate",
      "selectedTeacherId", // Keep this for staff
    ];
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (!keysToRetain.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  };

  const [message, setMessage] = useState("");
  const [isSmsChecked, setIsSmsChecked] = useState(false);

  // const handleTextareaChange = (event) => {
  //   const inputMessage = event.target.value;

  //   setFormData((prevState) => ({
  //     ...prevState,
  //     assignmentDetails: inputMessage,
  //   }));

  //   if (remainingChars <= 0 && inputMessage.length > message.length) {
  //     return;
  //   }

  //   setMessage(inputMessage);
  //   if (isSmsChecked) {
  //     setRemainingChars(159 - inputMessage.length);
  //   } else {
  //     setRemainingChars(5000 - inputMessage.length);
  //   }
  // };

  const handleTextareaChange = (event) => {
    let inputMessage = event.target.value;

    // If SMS is checked, limit to 159 chars
    if (isSmsChecked && inputMessage.length > 159) {
      inputMessage = inputMessage.slice(0, 159);
    }

    setFormData((prevState) => ({
      ...prevState,
      assignmentDetails: inputMessage,
    }));

    setMessage(inputMessage);
    setRemainingChars(
      isSmsChecked ? 159 - inputMessage.length : 5000 - inputMessage.length
    );
  };

  const handleRadioChange = () => {
    setIsSmsChecked((prevState) => {
      const newState = !prevState;
      if (newState) {
        setRemainingChars(159 - message.length);
      } else {
        setRemainingChars(5000 - message.length);
      }
      return newState;
    });
  };

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    if (dateRef.current) {
      dateRef.current.value = formattedDate;

      localStorage.setItem("assignmentDate", formattedDate);
    }
  }, []);

  const [errors, setError] = useState(null);

  // This useEffect is no longer needed as we handle teacher fetching in the initial useEffect
  // and when we auto-select the logged-in teacher in fetchTeacherListData

  const handleTeacherChange = (event) => {
    const selectedTeacherId = event.target.value;

    // Clear all fields and localStorage when a new teacher is selected
    if (teacherRef.current) teacherRef.current.value = selectedTeacherId;
    if (classRef.current) classRef.current.value = "";
    if (sectionRef.current) sectionRef.current.value = "";
    if (periodRef.current) periodRef.current.value = "";
    if (subjectRef.current) subjectRef.current.value = "";
    if (assignmentDetailsRef.current) assignmentDetailsRef.current.value = "";
    if (uploadRef.current) uploadRef.current.value = null;
    setFormData({
      selectedClassId: "",
      admitted_section: "",
      subjectId: "",
      periodId: "",
      assignmentDate: formData.assignmentDate,
    });
    setPeriods([]);
    setSubjects([]);
    setDropdownData({
      teacherName: "",
      classname: "",
      sectionname: "",
      subjectName: "",
      periodName: "",
    });
    setMessage("");
    setRemainingChars(5000);
    setIsSmsChecked(false);
    setSmsRecipient("B");

    const keysToRetain = [
      "academicSessionId",
      "orgId",
      "branchId",
      "nextAcademicSessionId",
      "assignmentDate",
    ];
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (!keysToRetain.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    if (selectedTeacherId) {
      localStorage.setItem("selectedTeacherId", selectedTeacherId);
      console.log(`Teacher ID ${selectedTeacherId} stored in localStorage`);

      setFormData((prevData) => ({
        ...prevData,
        teacherId: selectedTeacherId,
      }));

      fetchClassList()
        .then((data) => {
          setClasses(data);
        })
        .catch((err) => {
          console.error("Error:", err);
          setError("Failed to load classes");
        });
    } else {
      setClasses([]);
    }
  };

  // Classes are fetched automatically when the teacher is selected in fetchTeacherListData
  // No need to fetch on mount for staff users

  const handleClassChange = (event) => {
    const selectedClassId = event.target.value;

    setFormData((prevData) => ({
      ...prevData,
      selectedClassId: selectedClassId,
      sectionId: "",
    }));

    localStorage.setItem("selectedClassId", selectedClassId);
  };

  useEffect(() => {
    const academicSessionId = localStorage.getItem("academicSessionId");
    const assignmentDate = localStorage.getItem("assignmentDate");
    const selectedTeacherId = localStorage.getItem("selectedTeacherId");
    const selectedClassId = localStorage.getItem("selectedClassId");
    const admittedSection = localStorage.getItem("admitted_section");
    const selectedSubject = localStorage.getItem("selected_subject");

    // fetchSubjects() removed - subjects are fetched when section is selected

    if (selectedSubject) {
      fetchPeriods(
        academicSessionId,
        assignmentDate,
        selectedTeacherId,
        selectedClassId,
        admittedSection,
        selectedSubject
      );
    }
  }, []);

  const fetchSubjects = async () => {
    const response = await fetch("/api/subjects");
    const data = await response.json();
    setSubjects(data);
  };

  const fetchPeriods = async (
    academicSessionId,
    assignmentDate,
    selectedTeacherId,
    selectedClassId,
    admittedSection,
    selectedSubject
  ) => {
    if (
      academicSessionId &&
      assignmentDate &&
      selectedTeacherId &&
      selectedClassId &&
      admittedSection &&
      selectedSubject
    ) {
      const apiUrl = `${ApiUrl.apiurl}Teacher/GetPeriodListBasedOnSubject/${academicSessionId}/${assignmentDate}/${selectedTeacherId}/${selectedClassId}/${admittedSection}/${selectedSubject}`;
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (result && result.data) {
        setPeriods(result.data);
      } else {
        setPeriods([]);
      }
    }
  };

  const handleSectionChange = async (e) => {
    const sectionId = e.target.value;

    setSubjects([]);

    setFormData((prevData) => ({
      ...prevData,
      sectionId: sectionId,
    }));

    localStorage.setItem("admitted_section", sectionId);

    const academicYearId = localStorage.getItem("academicSessionId");
    const date = localStorage.getItem("assignmentDate");
    const teacherId = localStorage.getItem("selectedTeacherId");
    const classId = localStorage.getItem("selectedClassId");

    if (academicYearId && date && teacherId && classId && sectionId) {
      try {
        const fetchedSubjects = await fetchSubjectList({
          academicYearId,
          date,
          teacherId,
          classId,
          sectionId,
        });

        if (
          fetchedSubjects.message === "success!!" &&
          Array.isArray(fetchedSubjects.data)
        ) {
          setSubjects(fetchedSubjects.data);
        } else {
          console.error("API response did not contain valid data.");
          setSubjects([]);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
      }
    } else {
      console.error("Missing required parameters for API call");
    }
  };

  useEffect(() => {
    const admittedSection = localStorage.getItem("admitted_section");
    if (admittedSection) {
      setFormData((prevData) => ({
        ...prevData,
        admitted_section: admittedSection,
      }));
    }
  }, []);

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;

    setFormData((prevData) => ({
      ...prevData,
      subjectId,
      periodId: "",
    }));

    localStorage.setItem("selected_subject", subjectId);

    fetchPeriodsFromAPI(subjectId);
  };

  const fetchPeriodsFromAPI = (subjectId) => {
    const academicSessionId = localStorage.getItem("academicSessionId");
    const assignmentDate = localStorage.getItem("assignmentDate");
    const selectedTeacherId = localStorage.getItem("selectedTeacherId");
    const selectedClassId = localStorage.getItem("selectedClassId");
    const admittedSection = localStorage.getItem("admitted_section");

    fetchPeriods(
      academicSessionId,
      assignmentDate,
      selectedTeacherId,
      selectedClassId,
      admittedSection,
      subjectId
    );
  };

  const handleEditClick = async (assignmentId) => {
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}ASSIGNMENT/GetAssignmentBasedId/${assignmentId}`
      );
      const data = await response.json();
      console.log(data);

      if (data.message === "Success") {
        const assignmentDetails = data.data;

        setFormData({
          assignmentId: assignmentDetails.id,
          assignmentDate: assignmentDetails.assignment_date || "",
          teacherId: assignmentDetails.teacherId || "",
          classId: assignmentDetails.classId || "",
          sectionId: assignmentDetails.sectionId || "",
          subjectId: assignmentDetails.subjectId || "",
          periodId: assignmentDetails.classperiodId || "",
          assignmentDetails: assignmentDetails.assignment_details || "",
          sendSms: assignmentDetails.send_sms || "N",
          smsSentTo: assignmentDetails.sms_sent_to || "B",
        });

        setDropdownData({
          teacherName: assignmentDetails.teacherName || "",
          classname: assignmentDetails.classname || "",
          sectionname: assignmentDetails.sectionname || "",
          subjectName: assignmentDetails.subjectName || "",
          periodName: assignmentDetails.classperiodName || "",
        });

        setSmsRecipient(assignmentDetails.sms_sent_to || "B");

        localStorage.setItem("assignmentId", assignmentDetails.id || "");
        localStorage.setItem(
          "assignmentDate",
          assignmentDetails.assignment_date || ""
        );
        localStorage.setItem(
          "selectedTeacherId",
          assignmentDetails.teacherId || ""
        );
        localStorage.setItem(
          "selectedClassId",
          assignmentDetails.classId || ""
        );
        localStorage.setItem(
          "selectedSectionId",
          assignmentDetails.sectionId || ""
        );
        localStorage.setItem(
          "selectedSubjectId",
          assignmentDetails.subjectId || ""
        );
        localStorage.setItem(
          "selectedPeriodId",
          assignmentDetails.classperiodId || ""
        );

        const academicSessionId = localStorage.getItem("academicSessionId");
        const assignmentDate = assignmentDetails.assignment_date || "";

        if (academicSessionId && assignmentDate) {
          const teacherListResponse = await fetch(
            `${ApiUrl.apiurl}Teacher/GetTeacherListBasedOnDay/${academicSessionId}/${assignmentDate}`
          );
          const teacherListData = await teacherListResponse.json();

          if (teacherListData && teacherListData.message === "success!!") {
            setTeachers(teacherListData.data || []);
          } else {
            console.error(
              "Failed to fetch teacher list:",
              teacherListData.message
            );
          }
        } else {
          console.error("Academic Session ID or Assignment Date is missing");
        }
      } else {
        console.error("Error fetching assignment details:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSave = async () => {
    const formDataToSend = new FormData();

    const assignmentId = localStorage.getItem("editAssignmentId");
    const isEdit = !!assignmentId;

    const academicYearId = localStorage.getItem("academicSessionId");
    const classId = localStorage.getItem("selectedClassId");
    const sectionId = localStorage.getItem("admitted_section");
    const subjectId = localStorage.getItem("selected_subject");
    const classPeriodId = localStorage.getItem("selected_periodId");
    const assignmentDetails = formData.assignmentDetails || "";
    const teacherId = localStorage.getItem("selectedTeacherId");

    formDataToSend.append("academic_year_id", academicYearId);
    formDataToSend.append("class_id", classId);
    formDataToSend.append("section_id", sectionId);
    formDataToSend.append("subject_id", subjectId);
    formDataToSend.append("assignment_date", dateRef.current.value);
    formDataToSend.append("assignment_details", assignmentDetails);
    formDataToSend.append("org_id", localStorage.getItem("orgId"));
    formDataToSend.append("branch_id", localStorage.getItem("branchId"));
    formDataToSend.append("class_period_id", classPeriodId);
    formDataToSend.append("teacher_id", teacherId);

    const selectedSmsOption = document.querySelector(
      'input[name="smsRecipient"]:checked'
    );
    const smsRecipient = selectedSmsOption ? selectedSmsOption.value : "B";

    formDataToSend.append("send_sms", isSmsChecked ? "Y" : "N");
    formDataToSend.append("sms_sent_to", smsRecipient);
    formDataToSend.append("is_active", true);
    formDataToSend.append("created_by", sessionStorage.getItem("userId"));

    const fileInput = uploadRef.current.files[0];
    if (fileInput) {
      formDataToSend.append("assignment_file", fileInput);
    } else {
      console.log("No file uploaded, skipping file attachment.");
    }

    try {
      const apiUrl = isEdit
        ? `${ApiUrl.apiurl}ASSIGNMENT/UpdateAssignment/${assignmentId}`
        : `${ApiUrl.apiurl}ASSIGNMENT/CreateAllassignment/`;

      const response = await fetch(apiUrl, {
        method: isEdit ? "PUT" : "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        alert(
          result.message ||
          (isEdit
            ? "Assignment Updated Successfully!"
            : "Assignment Added Successfully!")
        );

        if (isEdit) {
          localStorage.removeItem("editAssignmentId");
        }

        window.location.reload();
      } else {
        const error = await response.json();
        console.error("Error response:", error);
        alert(
          error.assignment_file?.[0] ||
          (isEdit
            ? "Failed to update assignment for the specified criteria!"
            : "Assignment already exists for the specified criteria!")
        );
      }
    } catch (error) {
      console.error("Error saving assignment:", error);
    }
  };

  const handleUpdateClick = async () => {
    const assignmentId = formData.assignmentId;

    if (!assignmentId) {
      console.error("Assignment ID is missing.");
      return;
    }

    const updatedAssignmentData = {
      academic_year_id: localStorage.getItem("academicSessionId") || null,
      class_id: formData.classId || null,
      section_id: formData.sectionId || null,
      subject_id: formData.subjectId || null,
      assignment_date: formData.assignmentDate || null,
      assignment_file: null,
      assignment_details: formData.assignmentDetails || "",
      org_id: localStorage.getItem("orgId") || null,
      branch_id: localStorage.getItem("branchId") || null,
      class_period_id: formData.periodId || null,
      teacher_id: formData.teacherId || null,
      send_sms: formData.sendSms || "",
      sms_sent_to: formData.smsSentTo || "",
      updated_by: sessionStorage.getItem("userId") || null,
    };

    try {
      console.log("Sending update request with data:", updatedAssignmentData);

      const updateResponse = await fetch(
        `${ApiUrl.apiurl}ASSIGNMENT/updateassignment/${assignmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAssignmentData),
        }
      );

      const updateData = await updateResponse.json();

      console.log("API response:", updateData);

      if (updateData.message === "Assignment updated successfully.") {
        alert("Updated successfully!");
      } else {
        console.error("Failed to update assignment:", updateData.message);
        alert("Failed to update assignment. Please try again.");
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      alert("Failed to update assignment. Please try again.");
    }
  };

  const [data, setData] = useState(assignments);

  const handleDelete = async (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this assignment?"
    );
    if (!confirmation) {
      return;
    }

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}ASSIGNMENT/deleteassignment/${id}/`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.message === "Assignment Deleted Successfully") {
        window.location.reload();
        setData((prevData) => prevData.filter((item) => item.id !== id));
        alert("Assignment deleted successfully.");
      } else {
        alert(`Failed to delete the assignment: ${result.message}`);
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert("An error occurred while deleting the assignment.");
    }
  };

  return (
    <div className="container-fluid ">
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
                ASSIGNMENT
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleUpdateClick}
                  >
                    Display
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    style={{ width: "150px" }}
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleSave}
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{ width: "150px" }}
                    onClick={() => navigate("/staff/dashboard")}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mt-3">
                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="assignment-date" className="form-label">
                          Assignment Date{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="date"
                          id="assignment-date"
                          className="form-control detail"
                          ref={dateRef}
                          value={formData.assignmentDate}
                          onChange={handleDateChange}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="teacher" className="form-label">
                          Teacher<span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                          id="teacher"
                          className="detail"
                          classNamePrefix="react-select"
                          options={teachers.map((teacher) => ({
                            value: teacher.teacherId,
                            label: teacher.TeacherName,
                          }))}
                          value={
                            teachers
                              .map((teacher) => ({
                                value: teacher.teacherId,
                                label: teacher.TeacherName,
                              }))
                              .find(
                                (option) => option.value === formData.teacherId
                              ) || null
                          }
                          onChange={(selectedOption) =>
                            handleTeacherChange({
                              target: { value: selectedOption?.value },
                            })
                          }
                          placeholder="Select Teacher"
                          isDisabled={true}
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="class" className="form-label">
                          Class <span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                          id="class"
                          className="detail"
                          classNamePrefix="react-select"
                          options={classes.map((classItem) => ({
                            value: classItem.classId,
                            label: classItem.classname,
                          }))}
                          value={
                            classes
                              .map((classItem) => ({
                                value: classItem.classId,
                                label: classItem.classname,
                              }))
                              .find(
                                (option) =>
                                  option.value === formData.selectedClassId
                              ) || null
                          }
                          onChange={(selectedOption) =>
                            handleClassChange({
                              target: { value: selectedOption?.value },
                            })
                          }
                          placeholder={dropdownData.classname || "Select Class"}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-1">
                        <label
                          htmlFor="admitted-section"
                          className="form-label"
                        >
                          Section
                          <span style={{ color: "red" }}>*</span>
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
                          placeholder={
                            dropdownData.sectionname || "Select Section"
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row flex-grow-1">
                    <div className="col-12 col-md-3 mb-1">
                      <label htmlFor="subject" className="form-label">
                        Subject <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        id="subject"
                        className="detail"
                        classNamePrefix="react-select"
                        options={subjects.map((subject) => ({
                          value: subject.subjectId,
                          label: subject.subjectname,
                        }))}
                        value={
                          subjects
                            .map((subject) => ({
                              value: subject.subjectId,
                              label: subject.subjectname,
                            }))
                            .find(
                              (option) => option.value === formData.subjectId
                            ) || null
                        }
                        onChange={(selectedOption) =>
                          handleSubjectChange({
                            target: { value: selectedOption?.value },
                          })
                        }
                        placeholder={
                          dropdownData.subjectName || "Select Subject"
                        }
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-2">
                      <label htmlFor="period" className="form-label">
                        Period <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        id="period"
                        className="detail"
                        classNamePrefix="react-select"
                        options={periods.map((period) => ({
                          value: period.classperiodId,
                          label: period.periodName,
                        }))}
                        value={
                          periods
                            .map((period) => ({
                              value: period.classperiodId,
                              label: period.periodName,
                            }))
                            .find(
                              (option) => option.value === formData.periodId
                            ) || null
                        }
                        onChange={(selectedOption) => {
                          const selectedPeriodId = selectedOption?.value || "";
                          setFormData((prevData) => ({
                            ...prevData,
                            periodId: selectedPeriodId,
                          }));
                          localStorage.setItem(
                            "selected_periodId",
                            selectedPeriodId
                          );
                        }}
                        placeholder={dropdownData.periodName || "Select Period"}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-0">
                      <label htmlFor="upload" className="form-label">
                        Upload Assignment
                      </label>
                      <input
                        type="file"
                        name="upload"
                        id="upload"
                        ref={uploadRef}
                        className="form-control detail"
                      />
                    </div>
                    <div className="row mb-3 me-2">
                      <div className="col-12">
                        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center flex-wrap">
                          <span className="fw-bold me-md-3 mb-2 mb-md-0">
                            Send SMS to:
                          </span>
                          <div className="d-flex flex-wrap gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="smsRecipient"
                                id="flexRadioDefault1"
                                value="F"
                                checked={smsRecipient === "F"}
                                onChange={(e) =>
                                  setSmsRecipient(e.target.value)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexRadioDefault1"
                              >
                                Father
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="smsRecipient"
                                id="flexRadioDefault2"
                                value="M"
                                checked={smsRecipient === "M"}
                                onChange={(e) =>
                                  setSmsRecipient(e.target.value)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexRadioDefault2"
                              >
                                Mother
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="smsRecipient"
                                id="flexRadioDefault3"
                                value="B"
                                checked={smsRecipient === "B"}
                                onChange={(e) =>
                                  setSmsRecipient(e.target.value)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexRadioDefault3"
                              >
                                Both
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
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center flex-grow-1">
                      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center flex-grow-1">
                          <div className="mb-2 me-2 d-flex align-items-center">
                            <span
                              className="me-3"
                              style={{ fontWeight: "700" }}
                            >
                              Send SMS:
                            </span>
                            <div className="d-flex flex-column me-2">
                              <div className="form-check mb-2">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="smsTo"
                                  id="smsToFather"
                                  checked={isSmsChecked}
                                  onChange={handleRadioChange}
                                  style={{ width: "18px", height: "18px" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex flex-column flex-grow-1 me-md-2">
                        <label
                          htmlFor="assignmentDetails"
                          className="form-label"
                        >
                          Assignment Details{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <textarea
                          className="form-control"
                          id="assignmentDetails"
                          rows="3"
                          name="assignmentDetails"
                          ref={assignmentDetailsRef}
                          value={formData.assignmentDetails}
                          onChange={handleTextareaChange}
                          style={{
                            resize: "vertical",
                            overflow: "auto",
                            maxHeight: "150px",
                            width: "100%",
                            boxSizing: "border-box",
                          }}
                        ></textarea>
                        <div className="d-flex justify-content-middle mt-1">
                          <small className="text-muted">
                            Remaining characters:{" "}
                            <span style={{ color: "red" }}>
                              {remainingChars}
                            </span>
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  1. Only current date Assignments can be edited.<br></br>
                  2. When Send SMS is selected, Assignments details field length
                  will be limited to 159 characters.
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Date</th>
                        <th>Class</th>
                        <th>Section</th>
                        <th>Subject</th>
                        <th>Period</th>
                        <th>Teacher</th>
                        <th>Assignment</th>
                        <th>Attachment</th>
                        <th>Send SMS to</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((assignment, index) => (
                        <tr key={assignment.id}>
                          <td>{index + 1}</td>
                          <td>{assignment.assignment_date}</td>
                          <td>{assignment.classname}</td>
                          <td>{assignment.sectionname}</td>
                          <td>{assignment.subjectName}</td>
                          <td>{assignment.classperiodName}</td>
                          <td>{assignment.teacherName}</td>
                          <td>
                            <div className="hoverable-text">
                              {assignment.assignment_details.length > 50
                                ? `${assignment.assignment_details.substring(
                                  0,
                                  50
                                )}...`
                                : assignment.assignment_details}
                              <div className="hover-popup">
                                {assignment.assignment_details}
                              </div>
                            </div>
                          </td>
                          <td>
                            {assignment.assignment_file ? (
                              <button
                                className="btn btn-link"
                                onClick={() =>
                                  handleDownload(assignment.assignment_file)
                                }
                              >
                                Download
                              </button>
                            ) : (
                              "No file"
                            )}
                          </td>
                          <td>{assignment.send_sms === "Y" ? "Yes" : "No"}</td>
                          <td>
                            <button
                              disabled={
                                assignment.assignment_date !== todayDate
                              }
                              className="btn btn-primary"
                              onClick={() => handleEditClick(assignment.id)}
                            >
                              Edit
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(assignment.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
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
