
// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   ListGroup,
//   Form,
//   Button,
//   Table,
//   Modal,
// } from "react-bootstrap";
// import Select from "react-select";
// import DatePicker from "react-datepicker";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPrint, faDownload } from "@fortawesome/free-solid-svg-icons";
// import "react-datepicker/dist/react-datepicker.css";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import * as XLSX from "xlsx";
// import "./ViewAttendance.css";
// import { ApiUrl } from "../../../ApiUrl";

// const ViewAttendance = () => {
//   const [subjectOptions, setSubjectOptions] = useState([]);
//   const [classOptions, setClassOptions] = useState([]);
//   const [exportStatus, setExportStatus] = useState("");
//   const [subject, setSubject] = useState("");
//   const [selectDate, setSelectDate] = useState(new Date());
//   const [startDate, setStartDate] = useState(new Date());
//   const [className, setClassName] = useState("");
//   const [attendanceStatus, setAttendanceStatus] = useState("");
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [viewModalShow, setViewModalShow] = useState(false);
//   const [selectedAttendance, setSelectedAttendance] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(5);
//   const [savedAttendance, setSavedAttendance] = useState(false);
//   const [totalAttendance, setTotalAttendance] = useState({
//     present: 0,
//     absent: 0,
//     late: 0,
//   });
//   const [totalCountText, setTotalCountText] = useState("Total Present");

//   const [isHovered, setIsHovered] = useState(false);

//   // Validation state
//   const [subjectError, setSubjectError] = useState("");
//   const [classNameError, setClassNameError] = useState("");
//   const [startDateError, setStartDateError] = useState("");
//   const [attendanceStatusError, setAttendanceStatusError] = useState("");

//   // const PageSizeSelector = ({ pageSize, handlePageSizeChange }) => {
//   const options = [
//     { value: 5, label: "5" },
//     { value: 10, label: "10" },
//     { value: 20, label: "20" },
//   ];
//   // const handleChange = (selectedOption) => {
//   //   setPageSize(selectedOption.value);
//   //   // Add any additional logic to handle the page size change
//   // };
//   const handlePageSizeChange = (event) => {
//     setPageSize(event.target.value);
//     // Add any additional logic to handle the page size change, e.g., fetching new data
//   };

//   const handleChange = (selectedOption) => {
//     handlePageSizeChange({ target: { value: selectedOption.value } });
//   };

// useEffect(() => {
//   const fetchSubjects = async () => {
//     try {
//       const response = await fetch(
//         `${ApiUrl.apiurl}api/Subject/GetAllSubject/`
//       );
//       const responseData = await response.json();

//       if (
//         responseData.message === "success" &&
//         Array.isArray(responseData.data)
//       ) {
//         const subjects = responseData.data.map((subjectInfo) => ({
//           login_id: localStorage.getItem("loginId"),
//           value: subjectInfo.id,
//           label: subjectInfo.subject_name,
//           description: subjectInfo.description,
//         }));
//         setSubjectOptions(subjects);
//       } else {
//         console.error("Unexpected data format:", responseData);
//       }
//     } catch (error) {
//       console.error("Error fetching subjects:", error);
//     }
//   };

//   fetchSubjects();
// }, []);



// useEffect(() => {
//   const fetchClasses = async () => {
//     try {
//       const response = await fetch(`${ApiUrl.apiurl}api/Course/GetAllCourse/`);
//       const responseData = await response.json();

//       if (
//         responseData.message === "success" &&
//         Array.isArray(responseData.data)
//       ) {
//         const classes = responseData.data.map((classInfo) => ({
//           value: `${classInfo.class_name} - ${classInfo.section_class}`,
//           label: `${classInfo.class_name} - ${classInfo.section_class}`,
//         }));
//         setClassOptions(classes);
//       } else {
//         console.error("Unexpected data format:", responseData);
//       }
//     } catch (error) {
//       console.error("Error fetching classes:", error);
//     }
//   };

//   fetchClasses();
// }, []);

 
//   const generateRandomData = () => {
//     const names = ["John Doe", "Jane Doe", "Alice Smith", "Bob Johnson"];
//     const emails = [
//       "john@example.com",
//       "jane@example.com",
//       "alice@example.com",
//       "bob@example.com",
//     ];
//     const rollNumbers = ["A123", "B456", "C789", "D012"];
//     const statuses = ["present", "absent"]; // Only present and absent statuses

//     const randomIndex = Math.floor(Math.random() * names.length);
//     const randomStatusIndex = Math.floor(Math.random() * statuses.length);

//     return {
//       studentName: names[randomIndex],
//       email: emails[randomIndex],
//       rollNumber: rollNumbers[randomIndex],
//       status: statuses[randomStatusIndex], // Randomly choose between present and absent
//     };
//   };

  

//   const handleSave = () => {
//     let isValid = true;
//     if (!subject) {
//       setSubjectError("Subject is required");
//       isValid = false;
//     } else {
//       setSubjectError("");
//     }

//     if (!className) {
//       setClassNameError("Class Name is required");
//       isValid = false;
//     } else {
//       setClassNameError("");
//     }
//     if (!startDate) {
//       setStartDateError("Date is required");
//       isValid = false;
//     } else {
//       setStartDateError("");
//     }

//     if (!attendanceStatus) {
//       setAttendanceStatusError("Attendance Status is required");
//       isValid = false;
//     } else {
//       setAttendanceStatusError("");
//     }

//     if (!isValid) {
//       return;
//     }

//     const entriesCount = Math.floor(Math.random() * (6 - 5 + 1)) + 5; // Randomly generate between 5 to 6 entries
//     const newEntries = [];

//     for (let i = 0; i < entriesCount; i++) {
//       const randomData = generateRandomData();

//       let status = attendanceStatus; // Default to selected attendance status
//       if (attendanceStatus === "all") {
//         status = randomData.status; // Randomly assign status if "all" is selected
//       }

//       const newAttendance = {
//         id: attendanceData.length + 1 + i, // Ensure each ID is unique
//         subject,
//         date: selectDate.toLocaleDateString(),
//         className,
//         status,
//         recordedOn: new Date().toLocaleDateString(),
//         approvalStatus: Math.random() < 0.5 ? "Approved" : "Pending",
//         authorityResponse: "",
//         studentName: randomData.studentName,
//         email: randomData.email,
//         rollNumber: randomData.rollNumber,
//       };

//       newEntries.push(newAttendance);
//     }

//     setAttendanceData([...attendanceData, ...newEntries]);

//     const updatedTotalAttendance = { ...totalAttendance };
//     updatedTotalAttendance.present += newEntries.filter(
//       (entry) => entry.status === "present"
//     ).length;
//     updatedTotalAttendance.absent += newEntries.filter(
//       (entry) => entry.status === "absent"
//     ).length;

//     setTotalAttendance(updatedTotalAttendance);

//     // Reset input fields and states
//     setSubject("");
//     setSelectDate(new Date());
//     setClassName("");
//     setAttendanceStatus("");
//     setSavedAttendance(true);
//     setCurrentPage(1);
//   };

//   const handleViewDetails = (attendance) => {
//     setSelectedAttendance(attendance);
//     setViewModalShow(true);
//   };

//   useEffect(() => {
//     const presentCount = attendanceData.filter(
//       (attendance) => attendance.status === "present"
//     ).length;
//     const absentCount = attendanceData.filter(
//       (attendance) => attendance.status === "absent"
//     ).length;
//     setTotalAttendance({ present: presentCount, absent: absentCount });
//   }, [attendanceData]);

//   const indexOfLastItem = currentPage * pageSize;
//   const indexOfFirstItem = indexOfLastItem - pageSize;


// const currentItems = attendanceData
//   .filter((attendance) => {
//     const searchTextLower = searchText.toLowerCase();

//     const subject =
//       typeof attendance.subject === "string" ? attendance.subject : "";
//     const className =
//       typeof attendance.className === "string" ? attendance.className : "";
//     const status =
//       typeof attendance.status === "string" ? attendance.status : "";
//     const approvalStatus =
//       typeof attendance.approvalStatus === "string"
//         ? attendance.approvalStatus
//         : "";
//     const authorityResponse =
//       typeof attendance.authorityResponse === "string"
//         ? attendance.authorityResponse
//         : "";
//     const studentName =
//       typeof attendance.studentName === "string" ? attendance.studentName : "";
//     const email = typeof attendance.email === "string" ? attendance.email : "";
//     const rollNumber =
//       typeof attendance.rollNumber === "string" ? attendance.rollNumber : "";

//     return (
//       subject.toLowerCase().includes(searchTextLower) ||
//       attendance.date.includes(searchTextLower) ||
//       className.toLowerCase().includes(searchTextLower) ||
//       status.toLowerCase().includes(searchTextLower) ||
//       approvalStatus.toLowerCase().includes(searchTextLower) ||
//       authorityResponse.toLowerCase().includes(searchTextLower) ||
//       studentName.toLowerCase().includes(searchTextLower) ||
//       email.toLowerCase().includes(searchTextLower) ||
//       rollNumber.toLowerCase().includes(searchTextLower)
//     );
//   })
//   .filter((attendance) => {
//     if (attendanceStatus === "present") {
//       return attendance.status === "present";
//     } else if (attendanceStatus === "absent") {
//       return attendance.status === "absent";
//     } else {
//       return true; // Include all entries if attendanceStatus is "all"
//     }
//   })
//   .slice(indexOfFirstItem, indexOfLastItem);



//   const totalPages = Math.ceil(attendanceData.length / pageSize);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const handlePrintPDF = () => {
//     if (exportStatus === "pdf") {
//       const doc = new jsPDF();
//       const tableData = currentItems.map((item) => [
//         item.studentName,
//         item.date,
//         item.rollNumber,
//         item.status,
//         item.remark,
//       ]);
//       doc.autoTable({
//         head: [["Student Name", "Date", "Roll Number", "Attendance", "Remark"]],
//         body: tableData,
//       });
//       doc.save("attendance.pdf");
//     } else if (exportStatus === "excel") {
//       const workbook = XLSX.utils.book_new();
//       const worksheet = XLSX.utils.aoa_to_sheet([
//         ["Student Name", "Date", "Roll Number", "Attendance", "Remark"],
//         ...currentItems.map((item) => [
//           item.studentName,
//           item.date,
//           item.rollNumber,
//           item.status,
//           item.remark,
//         ]),
//       ]);
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
//       XLSX.writeFile(workbook, "attendance.xlsx");
//     }
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <Container
//       fluid
//       className="container-staff-view-attendance"
//       style={{
//         border: "1px solid #ddd",
//         backgroundColor: "white",
//         width: "100%",
//       }}
//     >
//       <Row>
//         <ListGroup
//           className="mb-4"
//           style={{
//             border: "1px solid #ddd",
//             borderRadius: "5px",
//             marginBottom: "20px", // Add some margin at the bottom
//           }}
//         ></ListGroup>{" "}
//         <ListGroup.Item
//           style={{
//             fontSize: "1.2em",
//             fontWeight: "bold",
//             marginBottom: "30px",
//             textAlign: "center", // Increased margin-bottom for more space
//           }}
//         >
//           View Attendance
//         </ListGroup.Item>
//       </Row>
//       <Row style={{ marginBottom: "10px" }}>
//         <Col xs={12}>
//           <div className="d-flex justify-content-end">
//             <div className="ml-auto">
//               <Form.Label className="mb-0 bold">Export</Form.Label>
//               <FontAwesomeIcon
//                 icon={faDownload}
//                 style={{
//                   marginLeft: "10px",
//                   cursor: "pointer",
//                   color: "#007BFF",
//                 }}
//                 onClick={handlePrintPDF}
//               />
//               <FontAwesomeIcon
//                 icon={faPrint}
//                 style={{
//                   marginLeft: "10px",
//                   cursor: "pointer",
//                   color: "#007BFF",
//                 }}
//                 onClick={handlePrint}
//               />
//               <Select
//                 options={[
//                   { value: "excel", label: "Excel" },
//                   { value: "pdf", label: "PDF" },
//                 ]}
//                 value={{
//                   value: exportStatus,
//                   label: exportStatus,
//                 }}
//                 onChange={(selected) => setExportStatus(selected.value)}
//                 name="exportStatus"
//                 style={{ marginLeft: "10px", width: "100px" }}
//               />
//             </div>
//           </div>
//         </Col>
//       </Row>
//       <Row>
//         <Col md={3}>
//           <Form.Group
//             controlId="className"
//             className="input-select-staff-view-attendance"
//           >
//             <Row>
//               <Col md={4}>
//                 <Form.Label className="mb-0 bold">Class Name</Form.Label>
//               </Col>
//               <Col md={8}>
//                 <Select
//                   options={classOptions}
//                   value={
//                     classOptions.find((option) => option.value === className) ||
//                     null
//                   }
//                   onChange={(selected) =>
//                     setClassName(selected ? selected.value : "")
//                   }
//                   name="className"
//                   id="classNameId"
//                   placeholder="Select class"
//                 />
//                 {classNameError && (
//                   <Form.Text className="text-danger">
//                     {classNameError}
//                   </Form.Text>
//                 )}
//               </Col>
//             </Row>
//           </Form.Group>
//         </Col>

//         <Col md={3}>
//           <Form.Group
//             controlId="subject"
//             className="input-select-staff-view-attendance"
//           >
//             <Row>
//               <Col md={4}>
//                 <Form.Label className="mb-0 bold">Subject</Form.Label>
//               </Col>

//               <Col md={8}>
//                 <Select
//                   className="react-select-container-staff-take-attendance"
//                   classNamePrefix="react-select-staff-take-attendance"
//                   options={subjectOptions}
//                   value={
//                     subjectOptions.find((option) => option.value === subject) ||
//                     null
//                   } // Correctly find the selected option
//                   onChange={(selected) =>
//                     setSubject(selected ? selected.value : "")
//                   } // Update subject state on selection
//                   menuPlacement="auto"
//                   styles={{
//                     container: (provided) => ({
//                       ...provided,
//                       // fontSize: "1.2em",
//                     }),
//                     control: (provided) => ({
//                       ...provided,
//                       height: "45px",
//                     }),
//                   }}
//                   placeholder="Select subject"
//                 />
//                 {subjectError && (
//                   <Form.Text className="text-danger">{subjectError}</Form.Text>
//                 )}
//               </Col>
//             </Row>
//           </Form.Group>
//         </Col>

//         <Col md={3}>
//           <Form.Group
//             controlId="selectDate"
//             className="input-select-staff-leaves"
//           >
//             <Row>
//               <Col md={4}>
//                 <Form.Label className="mb-0 bold">Select Date</Form.Label>
//               </Col>
//               <Col md={8}>
//                 <DatePicker
//                   selected={startDate}
//                   onChange={(date) => setStartDate(date)}
//                   dateFormat="dd/MM/yyyy"
//                   maxDate={new Date()}
//                   className="form-control"
//                 />
//                 {startDateError && (
//                   <Form.Text className="text-danger">
//                     {startDateError}
//                   </Form.Text>
//                 )}
//               </Col>
//             </Row>
//           </Form.Group>
//         </Col>

//         <Col md={3}>
//           <Form.Group
//             controlId="attendanceStatus"
//             className="input-select-staff-view-attendance"
//           >
//             <Row>
//               <Col md={4}>
//                 <Form.Label className="mb-0 bold">
//                   {" "}
//                   Attendance Status
//                 </Form.Label>
//               </Col>
//               <Col md={8}>
//                 <Select
//                   options={[
//                     { value: "present", label: "Present" },
//                     { value: "absent", label: "Absent" },
//                     { value: "all", label: "All" },
//                   ]}
//                   value={{
//                     value: attendanceStatus,
//                     label: attendanceStatus,
//                   }}
//                   onChange={(selected) => setAttendanceStatus(selected.value)}
//                   name="attendanceStatus"
//                   id="attendanceStatusId"
//                 />
//                 {attendanceStatusError && (
//                   <Form.Text className="text-danger">
//                     {attendanceStatusError}
//                   </Form.Text>
//                 )}
//               </Col>
//             </Row>
//           </Form.Group>
//         </Col>
//         {/* <Button
//           variant="primary"
//           type="button"
//           onClick={handleSave}
//           style={{
//             backgroundColor: "blue",
//             width: "70px",
//             textAlign: "right",
//             marginLeft: "auto", // This will move the button to the right end
//           }}
//         >
//           Save
//         </Button> */}
//         <Button
//           variant="primary"
//           type="button"
//           onClick={handleSave}
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//           style={{
           
//             width: "70px",
//             textAlign: "right",
//             marginLeft: "auto", // This will move the button to the right end
//             color: "white", // Text color
//             border: "none", // Remove default border
//             padding: "5px 10px", // Padding for the button
//             cursor: "pointer", // Cursor change on hover
//              // Smooth transition for background color
//           }}
//         >
//           Save
//         </Button>
//       </Row>

//       {savedAttendance && (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "flex-end",
//             marginBottom: "10px",
//           }}
//         >
//           <Form.Group controlId="searchFilter" style={{ width: "20%" }}>
//             <Form.Label>Search:</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter search text"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//             />
//           </Form.Group>
//         </div>
//       )}

//       {savedAttendance && (
//         <>
//           <ListGroup
//             style={{
//               border: "1px solid #ddd",
//               borderRadius: "5px",
//             }}
//           >
//             <ListGroup.Item>
//               <Table
//                 striped
//                 bordered
//                 hover
//                 responsive
//                 style={{ border: "1px solid #000" }}
//                 className="custom-table-staff-attendance text-center"
//               >
//                 <thead>
//                   <tr>
//                     <th
//                       style={{
//                         backgroundColor: "#87CEEB",
//                         fontWeight: "bold",
//                         color: "black",
//                         border: "1px solid #000",
//                         textAlign: "center",
//                       }}
//                     >
//                       Student Name
//                     </th>
//                     <th
//                       style={{
//                         backgroundColor: "#87CEEB",
//                         fontWeight: "bold",
//                         color: "black",
//                         border: "1px solid #000",
//                         textAlign: "center",
//                       }}
//                     >
//                       Date
//                     </th>
//                     <th
//                       style={{
//                         backgroundColor: "#87CEEB",
//                         fontWeight: "bold",
//                         color: "black",
//                         border: "1px solid #000",
//                         textAlign: "center",
//                       }}
//                     >
//                       Roll Number
//                     </th>
//                     <th
//                       style={{
//                         backgroundColor: "#87CEEB",
//                         fontWeight: "bold",
//                         color: "black",
//                         border: "1px solid #000",
//                         textAlign: "center",
//                       }}
//                     >
//                       Attendance
//                     </th>
//                     <th
//                       style={{
//                         backgroundColor: "#87CEEB",
//                         fontWeight: "bold",
//                         color: "black",
//                         border: "1px solid #000",
//                         textAlign: "center",
//                       }}
//                     >
//                       Remark
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentItems.map((attendance) => (
//                     <tr key={attendance.id}>
//                       <td
//                         style={{
//                           border: "1px solid #000",
//                           textAlign: "center",
//                         }}
//                       >
//                         {attendance.studentName}
//                       </td>
//                       <td
//                         style={{
//                           border: "1px solid #000",
//                           textAlign: "center",
//                         }}
//                       >
//                         {attendance.date}
//                       </td>
//                       <td
//                         style={{
//                           border: "1px solid #000",
//                           textAlign: "center",
//                         }}
//                       >
//                         {attendance.rollNumber}
//                       </td>
//                       <td
//                         style={{
//                           border: "1px solid #000",
//                           textAlign: "center",
//                         }}
//                       >
//                         {attendance.status}
//                       </td>
//                       <td
//                         style={{
//                           border: "1px solid #000",
//                           textAlign: "center",
//                         }}
//                       >
//                         <input
//                           type="text"
//                           value={attendance.remark}
//                           onChange={(e) => {
//                             const updatedAttendance = { ...attendance };
//                             updatedAttendance.remark = e.target.value;
//                             const updatedAttendanceData = attendanceData.map(
//                               (item) =>
//                                 item.id === updatedAttendance.id
//                                   ? updatedAttendance
//                                   : item
//                             );
//                             setAttendanceData(updatedAttendanceData);
//                           }}
//                         />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//               <div
//                 className="d-flex justify-content-end"
//                 style={{ marginTop: "1%" }}
//               >
//                 <ul className="pagination mr-2">
//                   <li className="page-item">
//                     <a className="page-link" href="#" aria-label="Previous">
//                       <span aria-hidden="true">&laquo;</span>
//                     </a>
//                   </li>
//                   <li className="page-item">
//                     <a className="page-link" href="#">
//                       1
//                     </a>
//                   </li>
//                   <li className="page-item">
//                     <a className="page-link" href="#">
//                       2
//                     </a>
//                   </li>
//                   <li className="page-item">
//                     <a className="page-link" href="#">
//                       3
//                     </a>
//                   </li>
//                   <li className="page-item">
//                     <a className="page-link" href="#" aria-label="Next">
//                       <span aria-hidden="true">&raquo;</span>
//                     </a>
//                   </li>
//                 </ul>

//                 <Select
//                   value={options.find((option) => option.value === pageSize)}
//                   onChange={handleChange}
//                   options={options}
//                   placeholder="Items per page:"
//                   isClearable={false}
//                 />
//               </div>
//             </ListGroup.Item>
//             <ListGroup.Item>
//               <Row>
             
//                 <Col>
//                   {/* <div className="d-flex justify-content-between align-items-center"> */}
//                   <div>Total Present: {totalAttendance.present}</div>
//                   <div>Total Absent: {totalAttendance.absent}</div>
//                   {attendanceStatus === "all" && (
//                     <div>All data is displayed.</div>
//                   )}
//                   {attendanceStatus === "present" && (
//                     <div>Only present data is displayed.</div>
//                   )}
//                   {attendanceStatus === "absent" && (
//                     <div>Only absent data is displayed.</div>
//                   )}
//                   {/* </div> */}
//                 </Col>
//               </Row>
//             </ListGroup.Item>
//           </ListGroup>
//         </>
//       )}

//       {selectedAttendance && (
//         <ViewAttendanceModal
//           attendance={selectedAttendance}
//           onHide={() => setViewModalShow(false)}
//         />
//       )}
//       <div id="printable-content" style={{ display: "none" }}>
//         <Container fluid className="container-staff-view-attendance">
//           <Row>
//             <Col md={12}>
//               <ListGroup>
//                 <ListGroup.Item
//                   className="list-group-heading-staff-view-attendance"
//                   style={{ backgroundColor: "#007BFF", color: "white" }}
//                 >
//                   View Attendance
//                 </ListGroup.Item>
//                 <ListGroup.Item>
//                   <Table
//                     responsive
//                     className="custom-table-staff-attendance text-center"
//                   >
//                     <thead>
//                       <tr>
//                         <th>Student Name</th>
//                         <th>Date</th>
//                         <th>Roll Number</th>
//                         <th>Attendance</th>
//                         <th>Remark</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {currentItems.map((attendance) => (
//                         <tr key={attendance.id}>
//                           <td>{attendance.studentName}</td>
//                           <td>{attendance.date}</td>
//                           <td>{attendance.rollNumber}</td>
//                           <td>{attendance.status}</td>
//                           <td>Null</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </ListGroup.Item>
//                 <ListGroup.Item>
//                   <Row>
//                     {/* <Col>
//                       {totalCountText === "Total Present"
//                         ? "Total Present:"
//                         : "Total Absent:"}
//                       {totalCountText === "Total Present"
//                         ? totalAttendance.present
//                         : totalAttendance.absent}
//                     </Col> */}
//                   </Row>
//                 </ListGroup.Item>
//               </ListGroup>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </Container>
//   );
// };

// const ViewAttendanceModal = ({ attendance, onHide }) => {
//   return (
//     <Container
//       fluid
//       className="container-staff-view-attendance"
//       style={{ width: "90%", backgroundColor: "#F0F0F0" }} // Added backgroundColor style
//     >
//       <Modal
//         show={true}
//         onHide={onHide}
//         size="lg"
//         aria-labelledby="contained-modal-title-vcenter"
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title id="contained-modal-title-vcenter">
//             {attendance.studentName}'s Attendance Details
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Row>
//             <Col>
//               <p>
//                 <strong>Student Name:</strong> {attendance.studentName}
//               </p>
//               <p>
//                 <strong>Email:</strong> {attendance.email}
//               </p>
//               <p>
//                 <strong>Roll Number:</strong> {attendance.rollNumber}
//               </p>
//               <p>
//                 <strong>Date:</strong> {attendance.date}
//               </p>
//               <p>
//                 <strong>Attendance:</strong> {attendance.status}
//               </p>
//               <p>
//                 <strong>Remark:</strong> {attendance.remark}
//               </p>
//               <p>
//                 <strong>Recorded On:</strong> {attendance.recordedOn}
//               </p>
//               <p>
//                 <strong>Approval Status:</strong> {attendance.approvalStatus}
//               </p>
//               <p>
//                 <strong>Authority Response:</strong>{" "}
//                 {attendance.authorityResponse}
//               </p>
//             </Col>
//           </Row>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button onClick={onHide}>Close</Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default ViewAttendance;




import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Form,
  Button,
  Table,
  Modal,
} from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faDownload } from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import "./ViewAttendance.css";
import { ApiUrl } from "../../../ApiUrl";

const ViewAttendance = () => {
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [exportStatus, setExportStatus] = useState("");
  const [subject, setSubject] = useState("");
  const [selectDate, setSelectDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [className, setClassName] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [viewModalShow, setViewModalShow] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [savedAttendance, setSavedAttendance] = useState(false);
  const [totalAttendance, setTotalAttendance] = useState({
    present: 0,
    absent: 0,
    late: 0,
  });
  const [totalCountText, setTotalCountText] = useState("Total Present");

  const [isHovered, setIsHovered] = useState(false);

  // Validation state
  const [subjectError, setSubjectError] = useState("");
  const [classNameError, setClassNameError] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [attendanceStatusError, setAttendanceStatusError] = useState("");

  // const PageSizeSelector = ({ pageSize, handlePageSizeChange }) => {
  const options = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 20, label: "20" },
  ];
  // const handleChange = (selectedOption) => {
  //   setPageSize(selectedOption.value);
  //   // Add any additional logic to handle the page size change
  // };
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    // Add any additional logic to handle the page size change, e.g., fetching new data
  };

  const handleChange = (selectedOption) => {
    handlePageSizeChange({ target: { value: selectedOption.value } });
  };

useEffect(() => {
  const fetchSubjects = async () => {
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}api/Subject/GetAllSubject/`
      );
      const responseData = await response.json();

      if (
        responseData.message === "success" &&
        Array.isArray(responseData.data)
      ) {
        const subjects = responseData.data.map((subjectInfo) => ({
          login_id: localStorage.getItem("loginId"),
          value: subjectInfo.id,
          label: subjectInfo.subject_name,
          description: subjectInfo.description,
        }));
        setSubjectOptions(subjects);
      } else {
        console.error("Unexpected data format:", responseData);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  fetchSubjects();
}, []);



useEffect(() => {
  const fetchClasses = async () => {
    try {
      const response = await fetch(`${ApiUrl.apiurl}Course/GetAllCourse/`);
      const result = await response.json();

      if (result.message === "Success") {
        const classes = result.data.map((classItem) => ({
          value: classItem.id, // Map id to value
          label: classItem.classname, // Map classname to label
        }));
        setClassOptions(classes);
      } else {
        console.error("Failed to fetch classes:", result.message);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  fetchClasses();
}, []);

 
  const generateRandomData = () => {
    const names = ["John Doe", "Jane Doe", "Alice Smith", "Bob Johnson"];
    const emails = [
      "john@example.com",
      "jane@example.com",
      "alice@example.com",
      "bob@example.com",
    ];
    const rollNumbers = ["A123", "B456", "C789", "D012"];
    const statuses = ["present", "absent"]; // Only present and absent statuses

    const randomIndex = Math.floor(Math.random() * names.length);
    const randomStatusIndex = Math.floor(Math.random() * statuses.length);

    return {
      studentName: names[randomIndex],
      email: emails[randomIndex],
      rollNumber: rollNumbers[randomIndex],
      status: statuses[randomStatusIndex], // Randomly choose between present and absent
    };
  };

  

  const handleSave = () => {
    let isValid = true;
    if (!subject) {
      setSubjectError("Subject is required");
      isValid = false;
    } else {
      setSubjectError("");
    }

    if (!className) {
      setClassNameError("Class Name is required");
      isValid = false;
    } else {
      setClassNameError("");
    }
    if (!startDate) {
      setStartDateError("Date is required");
      isValid = false;
    } else {
      setStartDateError("");
    }

    if (!attendanceStatus) {
      setAttendanceStatusError("Attendance Status is required");
      isValid = false;
    } else {
      setAttendanceStatusError("");
    }

    if (!isValid) {
      return;
    }

    const entriesCount = Math.floor(Math.random() * (6 - 5 + 1)) + 5; // Randomly generate between 5 to 6 entries
    const newEntries = [];

    for (let i = 0; i < entriesCount; i++) {
      const randomData = generateRandomData();

      let status = attendanceStatus; // Default to selected attendance status
      if (attendanceStatus === "all") {
        status = randomData.status; // Randomly assign status if "all" is selected
      }

      const newAttendance = {
        id: attendanceData.length + 1 + i, // Ensure each ID is unique
        subject,
        date: selectDate.toLocaleDateString(),
        className,
        status,
        recordedOn: new Date().toLocaleDateString(),
        approvalStatus: Math.random() < 0.5 ? "Approved" : "Pending",
        authorityResponse: "",
        studentName: randomData.studentName,
        email: randomData.email,
        rollNumber: randomData.rollNumber,
      };

      newEntries.push(newAttendance);
    }

    setAttendanceData([...attendanceData, ...newEntries]);

    const updatedTotalAttendance = { ...totalAttendance };
    updatedTotalAttendance.present += newEntries.filter(
      (entry) => entry.status === "present"
    ).length;
    updatedTotalAttendance.absent += newEntries.filter(
      (entry) => entry.status === "absent"
    ).length;

    setTotalAttendance(updatedTotalAttendance);

    // Reset input fields and states
    setSubject("");
    setSelectDate(new Date());
    setClassName("");
    setAttendanceStatus("");
    setSavedAttendance(true);
    setCurrentPage(1);
  };

  const handleViewDetails = (attendance) => {
    setSelectedAttendance(attendance);
    setViewModalShow(true);
  };

  useEffect(() => {
    const presentCount = attendanceData.filter(
      (attendance) => attendance.status === "present"
    ).length;
    const absentCount = attendanceData.filter(
      (attendance) => attendance.status === "absent"
    ).length;
    setTotalAttendance({ present: presentCount, absent: absentCount });
  }, [attendanceData]);

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;


const currentItems = attendanceData
  .filter((attendance) => {
    const searchTextLower = searchText.toLowerCase();

    const subject =
      typeof attendance.subject === "string" ? attendance.subject : "";
    const className =
      typeof attendance.className === "string" ? attendance.className : "";
    const status =
      typeof attendance.status === "string" ? attendance.status : "";
    const approvalStatus =
      typeof attendance.approvalStatus === "string"
        ? attendance.approvalStatus
        : "";
    const authorityResponse =
      typeof attendance.authorityResponse === "string"
        ? attendance.authorityResponse
        : "";
    const studentName =
      typeof attendance.studentName === "string" ? attendance.studentName : "";
    const email = typeof attendance.email === "string" ? attendance.email : "";
    const rollNumber =
      typeof attendance.rollNumber === "string" ? attendance.rollNumber : "";

    return (
      subject.toLowerCase().includes(searchTextLower) ||
      attendance.date.includes(searchTextLower) ||
      className.toLowerCase().includes(searchTextLower) ||
      status.toLowerCase().includes(searchTextLower) ||
      approvalStatus.toLowerCase().includes(searchTextLower) ||
      authorityResponse.toLowerCase().includes(searchTextLower) ||
      studentName.toLowerCase().includes(searchTextLower) ||
      email.toLowerCase().includes(searchTextLower) ||
      rollNumber.toLowerCase().includes(searchTextLower)
    );
  })
  .filter((attendance) => {
    if (attendanceStatus === "present") {
      return attendance.status === "present";
    } else if (attendanceStatus === "absent") {
      return attendance.status === "absent";
    } else {
      return true; // Include all entries if attendanceStatus is "all"
    }
  })
  .slice(indexOfFirstItem, indexOfLastItem);



  const totalPages = Math.ceil(attendanceData.length / pageSize);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrintPDF = () => {
    if (exportStatus === "pdf") {
      const doc = new jsPDF();
      const tableData = currentItems.map((item) => [
        item.studentName,
        item.date,
        item.rollNumber,
        item.status,
        item.remark,
      ]);
      doc.autoTable({
        head: [["Student Name", "Date", "Roll Number", "Attendance", "Remark"]],
        body: tableData,
      });
      doc.save("attendance.pdf");
    } else if (exportStatus === "excel") {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet([
        ["Student Name", "Date", "Roll Number", "Attendance", "Remark"],
        ...currentItems.map((item) => [
          item.studentName,
          item.date,
          item.rollNumber,
          item.status,
          item.remark,
        ]),
      ]);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
      XLSX.writeFile(workbook, "attendance.xlsx");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Container
      fluid
      className="container-staff-view-attendance"
      style={{
        border: "1px solid #ddd",
        backgroundColor: "white",
        width: "100%",
      }}
    >
      <Row>
        <ListGroup
          className="mb-4"
          style={{
            border: "1px solid #ddd",
            borderRadius: "5px",
            marginBottom: "20px", // Add some margin at the bottom
          }}
        ></ListGroup>{" "}
        {/* <ListGroup.Item
          style={{
            fontSize: "1.2em",
            fontWeight: "bold",
            marginBottom: "30px",
            textAlign: "center", // Increased margin-bottom for more space
          }}
        >
          View Attendance
        </ListGroup.Item> */}
      </Row>
      <Row style={{ marginBottom: "10px" }}>
        <Col xs={12}>
          <div className="d-flex justify-content-end">
            <div className="ml-auto">
              <Form.Label className="mb-0 bold">Export</Form.Label>
              <FontAwesomeIcon
                icon={faDownload}
                style={{
                  marginLeft: "10px",
                  cursor: "pointer",
                  color: "#007BFF",
                }}
                onClick={handlePrintPDF}
              />
              <FontAwesomeIcon
                icon={faPrint}
                style={{
                  marginLeft: "10px",
                  cursor: "pointer",
                  color: "#007BFF",
                }}
                onClick={handlePrint}
              />
              <Select
                options={[
                  { value: "excel", label: "Excel" },
                  { value: "pdf", label: "PDF" },
                ]}
                value={{
                  value: exportStatus,
                  label: exportStatus,
                }}
                onChange={(selected) => setExportStatus(selected.value)}
                name="exportStatus"
                style={{ marginLeft: "10px", width: "100px" }}
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <Form.Group
            controlId="className"
            className="input-select-staff-view-attendance"
          >
            <Row>
              <Col md={4}>
                <Form.Label className="mb-0 bold">Class Name</Form.Label>
              </Col>
              <Col md={8}>
                <Select
                  options={classOptions}
                  value={
                    classOptions.find((option) => option.value === className) ||
                    null
                  }
                  onChange={(selected) =>
                    setClassName(selected ? selected.value : "")
                  }
                  name="className"
                  id="classNameId"
                  placeholder="Select class"
                />
                {classNameError && (
                  <Form.Text className="text-danger">
                    {classNameError}
                  </Form.Text>
                )}
              </Col>
            </Row>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group
            controlId="subject"
            className="input-select-staff-view-attendance"
          >
            <Row>
              <Col md={4}>
                <Form.Label className="mb-0 bold">Subject</Form.Label>
              </Col>

              <Col md={8}>
                <Select
                  className="react-select-container-staff-take-attendance"
                  classNamePrefix="react-select-staff-take-attendance"
                  options={subjectOptions}
                  value={
                    subjectOptions.find((option) => option.value === subject) ||
                    null
                  } // Correctly find the selected option
                  onChange={(selected) =>
                    setSubject(selected ? selected.value : "")
                  } // Update subject state on selection
                  menuPlacement="auto"
                  styles={{
                    container: (provided) => ({
                      ...provided,
                      // fontSize: "1.2em",
                    }),
                    control: (provided) => ({
                      ...provided,
                      height: "45px",
                    }),
                  }}
                  placeholder="Select subject"
                />
                {subjectError && (
                  <Form.Text className="text-danger">{subjectError}</Form.Text>
                )}
              </Col>
            </Row>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group
            controlId="selectDate"
            className="input-select-staff-leaves"
          >
            <Row>
              <Col md={4}>
                <Form.Label className="mb-0 bold">Select Date</Form.Label>
              </Col>
              <Col md={8}>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  maxDate={new Date()}
                  className="form-control detail"
                />
                {startDateError && (
                  <Form.Text className="text-danger">
                    {startDateError}
                  </Form.Text>
                )}
              </Col>
            </Row>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group
            controlId="attendanceStatus"
            className="input-select-staff-view-attendance"
          >
            <Row>
              <Col md={4}>
                <Form.Label className="mb-0 bold">
                  {" "}
                  Attendance Status
                </Form.Label>
              </Col>
              <Col md={8}>
                <Select
                  options={[
                    { value: "present", label: "Present" },
                    { value: "absent", label: "Absent" },
                    { value: "all", label: "All" },
                  ]}
                  value={{
                    value: attendanceStatus,
                    label: attendanceStatus,
                  }}
                  onChange={(selected) => setAttendanceStatus(selected.value)}
                  name="attendanceStatus"
                  id="attendanceStatusId"
                />
                {attendanceStatusError && (
                  <Form.Text className="text-danger">
                    {attendanceStatusError}
                  </Form.Text>
                )}
              </Col>
            </Row>
          </Form.Group>
        </Col>
        {/* <Button
          variant="primary"
          type="button"
          onClick={handleSave}
          style={{
            backgroundColor: "blue",
            width: "70px",
            textAlign: "right",
            marginLeft: "auto", // This will move the button to the right end
          }}
        >
          Save
        </Button> */}
        <Button
          variant="primary"
          type="button"
          onClick={handleSave}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
           
            width: "70px",
            textAlign: "right",
            marginLeft: "auto", // This will move the button to the right end
            color: "white", // Text color
            border: "none", // Remove default border
            padding: "5px 10px", // Padding for the button
            cursor: "pointer", // Cursor change on hover
             // Smooth transition for background color
          }}
        >
          Save
        </Button>
      </Row>

      {savedAttendance && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
          <Form.Group controlId="searchFilter" style={{ width: "20%" }}>
            <Form.Label>Search:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter search text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Form.Group>
        </div>
      )}

      {savedAttendance && (
        <>
          <ListGroup
            style={{
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            <ListGroup.Item>
              <Table
                striped
                bordered
                hover
                responsive
                style={{ border: "1px solid #000" }}
                className="custom-table-staff-attendance text-center"
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        backgroundColor: "#87CEEB",
                        fontWeight: "bold",
                        color: "black",
                        border: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      Student Name
                    </th>
                    <th
                      style={{
                        backgroundColor: "#87CEEB",
                        fontWeight: "bold",
                        color: "black",
                        border: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      Date
                    </th>
                    <th
                      style={{
                        backgroundColor: "#87CEEB",
                        fontWeight: "bold",
                        color: "black",
                        border: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      Roll Number
                    </th>
                    <th
                      style={{
                        backgroundColor: "#87CEEB",
                        fontWeight: "bold",
                        color: "black",
                        border: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      Attendance
                    </th>
                    <th
                      style={{
                        backgroundColor: "#87CEEB",
                        fontWeight: "bold",
                        color: "black",
                        border: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      Remark
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((attendance) => (
                    <tr key={attendance.id}>
                      <td
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                        }}
                      >
                        {attendance.studentName}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                        }}
                      >
                        {attendance.date}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                        }}
                      >
                        {attendance.rollNumber}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                        }}
                      >
                        {attendance.status}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                        }}
                      >
                        <input
                          type="text"
                          value={attendance.remark}
                          onChange={(e) => {
                            const updatedAttendance = { ...attendance };
                            updatedAttendance.remark = e.target.value;
                            const updatedAttendanceData = attendanceData.map(
                              (item) =>
                                item.id === updatedAttendance.id
                                  ? updatedAttendance
                                  : item
                            );
                            setAttendanceData(updatedAttendanceData);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div
                className="d-flex justify-content-end"
                style={{ marginTop: "1%" }}
              >
                <ul className="pagination mr-2">
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                </ul>

                <Select
                  value={options.find((option) => option.value === pageSize)}
                  onChange={handleChange}
                  options={options}
                  placeholder="Items per page:"
                  isClearable={false}
                />
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
             
                <Col>
                  {/* <div className="d-flex justify-content-between align-items-center"> */}
                  <div>Total Present: {totalAttendance.present}</div>
                  <div>Total Absent: {totalAttendance.absent}</div>
                  {attendanceStatus === "all" && (
                    <div>All data is displayed.</div>
                  )}
                  {attendanceStatus === "present" && (
                    <div>Only present data is displayed.</div>
                  )}
                  {attendanceStatus === "absent" && (
                    <div>Only absent data is displayed.</div>
                  )}
                  {/* </div> */}
                </Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </>
      )}

      {selectedAttendance && (
        <ViewAttendanceModal
          attendance={selectedAttendance}
          onHide={() => setViewModalShow(false)}
        />
      )}
      <div id="printable-content" style={{ display: "none" }}>
        <Container fluid className="container-staff-view-attendance">
          <Row>
            <Col md={12}>
              <ListGroup>
                <ListGroup.Item
                  className="list-group-heading-staff-view-attendance"
                  style={{ backgroundColor: "#007BFF", color: "white" }}
                >
                  View Attendance
                </ListGroup.Item>
                <ListGroup.Item>
                  <Table
                    responsive
                    className="custom-table-staff-attendance text-center"
                  >
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Date</th>
                        <th>Roll Number</th>
                        <th>Attendance</th>
                        <th>Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((attendance) => (
                        <tr key={attendance.id}>
                          <td>{attendance.studentName}</td>
                          <td>{attendance.date}</td>
                          <td>{attendance.rollNumber}</td>
                          <td>{attendance.status}</td>
                          <td>Null</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    {/* <Col>
                      {totalCountText === "Total Present"
                        ? "Total Present:"
                        : "Total Absent:"}
                      {totalCountText === "Total Present"
                        ? totalAttendance.present
                        : totalAttendance.absent}
                    </Col> */}
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </div>
    </Container>
  );
};

const ViewAttendanceModal = ({ attendance, onHide }) => {
  return (
    <Container
      fluid
      className="container-staff-view-attendance"
      style={{ width: "90%", backgroundColor: "#F0F0F0" }} // Added backgroundColor style
    >
      <Modal
        show={true}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {attendance.studentName}'s Attendance Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <p>
                <strong>Student Name:</strong> {attendance.studentName}
              </p>
              <p>
                <strong>Email:</strong> {attendance.email}
              </p>
              <p>
                <strong>Roll Number:</strong> {attendance.rollNumber}
              </p>
              <p>
                <strong>Date:</strong> {attendance.date}
              </p>
              <p>
                <strong>Attendance:</strong> {attendance.status}
              </p>
              <p>
                <strong>Remark:</strong> {attendance.remark}
              </p>
              <p>
                <strong>Recorded On:</strong> {attendance.recordedOn}
              </p>
              <p>
                <strong>Approval Status:</strong> {attendance.approvalStatus}
              </p>
              <p>
                <strong>Authority Response:</strong>{" "}
                {attendance.authorityResponse}
              </p>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ViewAttendance;







