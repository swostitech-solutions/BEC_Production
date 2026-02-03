

// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import Select from "react-select";
// import { Form, Button, Container, Table, Row, Col } from "react-bootstrap";
// import { ApiUrl } from "../../../ApiUrl"; // Adjust the import path as needed

// const ViewAttendance = () => {
//   const currentDate = new Date();

//   const [startDate, setStartDate] = useState(currentDate);
//   const [endDate, setEndDate] = useState(currentDate);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [isViewClicked, setIsViewClicked] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedClass, setSelectedClass] = useState(null);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [studentOptions, setStudentOptions] = useState([]);
//   const [subjectOptions, setSubjectOptions] = useState([]);
//   const [classNameOptions, setClassNameOptions] = useState([]);

//   const subjects = ["Math", "Science", "History", "Geography", "SocialScience"];

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await fetch(`${ApiUrl.apiurl}api/Course/GetAllCourse/`);
//         const responseData = await response.json();

//         if (
//           responseData.message === "success" &&
//           Array.isArray(responseData.data)
//         ) {
//           const classes = responseData.data.map((classInfo) => ({
//             value: `${classInfo.class_name} - ${classInfo.section_class}`,
//             label: `${classInfo.class_name} - ${classInfo.section_class}`,
//           }));
//           setClassNameOptions(classes);
//         } else {
//           console.error("Unexpected data format:", responseData);
//         }
//       } catch (error) {
//         console.error("Error fetching classes:", error);
//       }
//     };

//     fetchClasses();
//   }, []);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await fetch(
//           `${ApiUrl.apiurl}api/Student/GetAllStudent/`
//         );
//         const responseData = await response.json();

//         if (Array.isArray(responseData)) {
//           const students = responseData.map((studentInfo) => ({
//             value: studentInfo.id, // Use the student id for the value
//             label: `${studentInfo.first_name} ${studentInfo.last_name}`, // Use first and last names for the label
//           }));
//           setStudentOptions(students);
//         } else {
//           console.error("Unexpected data format:", responseData);
//         }
//       } catch (error) {
//         console.error("Error fetching students:", error);
//       }
//     };

//     fetchStudents();
//   }, []);

//   useEffect(() => {
//     const filtered = attendanceData.filter((entry) =>
//       Object.values(entry)
//         .join(" ")
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase())
//     );
//     setFilteredData(filtered);
//   }, [searchQuery, attendanceData]);

//   const handleViewClick = async () => {
//     const newErrors = {};

//     if (!startDate) {
//       newErrors.startDate = "Start Date is required";
//     }
//     if (!endDate) {
//       newErrors.endDate = "End Date is required";
//     }
//     if (!selectedClass) {
//       newErrors.class = "Class Name is required";
//     }
//     if (!selectedStudent) {
//       newErrors.student = "Student Name is required";
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setErrors({});
//     const dateRange = getDateRange(startDate, endDate);

//     const mockAttendanceData = dateRange.flatMap((date) =>
//       subjects.map((subject) => ({
//         date: date.toDateString(),
//         subject,
//         class: selectedClass?.label || "N/A",
//         student: selectedStudent?.label || "N/A",
//         attendance: Math.random() < 0.5 ? "Present" : "Absent",
//       }))
//     );

//     setAttendanceData(mockAttendanceData);
//     setFilteredData(mockAttendanceData);
//     setIsViewClicked(true);
//   };

//   const getDateRange = (start, end) => {
//     const dateRange = [];
//     let currentDate = new Date(start);

//     while (currentDate <= end) {
//       dateRange.push(new Date(currentDate));
//       currentDate.setDate(currentDate.getDate() + 1);
//     }

//     return dateRange;
//   };

//   return (
//     <div className="custom-container-staff-attendance">
//       <Container
//         fluid
//         style={{
//           boxShadow: isViewClicked ? "0 0 10px rgba(0, 0, 0, 0.1)" : "none",
//           padding: "20px",
//           marginBottom: "30px",
//           // backgroundColor: "#f2f2f2",
//           border: "1px solid #ced4da",
//           borderRadius: "5px",
//           marginTop: "30px",
//           width: "100%",
//         }}
//       >
//         <h4 className="text-center">View Attendance</h4>
//         <div
//           style={{
//             marginBottom: "30px",
//             // backgroundColor: "#f2f2f2",
//             padding: "10px",
//             marginTop: "50px",
//           }}
//         >
//           <Row className="justify-content-between align-items-center">
//             <Col md={3}>
//               <Form.Group
//                 controlId="startDate"
//                 className="d-flex align-items-center"
//               >
//                 <Form.Label className="custom-label-staff-attendance mb-0 mr-2">
//                   Start Date
//                 </Form.Label>
//                 <DatePicker
//                   selected={startDate}
//                   onChange={(date) => setStartDate(date || currentDate)}
//                   dateFormat="yyyy/MM/dd"
//                   showYearDropdown
//                   showMonthDropdown
//                   dropdownMode="select"
//                   className="custom-datepicker-staff-attendance"
//                   maxDate={currentDate}
//                 />
//               </Form.Group>
//               {errors.startDate && (
//                 <div className="text-danger">{errors.startDate}</div>
//               )}
//             </Col>
//             <Col md={3}>
//               <Form.Group
//                 controlId="endDate"
//                 className="d-flex align-items-center"
//               >
//                 <Form.Label className="custom-label-staff-attendance mb-0 mr-2">
//                   End Date
//                 </Form.Label>
//                 <DatePicker
//                   selected={endDate}
//                   onChange={(date) => setEndDate(date || currentDate)}
//                   dateFormat="yyyy/MM/dd"
//                   showYearDropdown
//                   showMonthDropdown
//                   dropdownMode="select"
//                   className="custom-datepicker-staff-attendance"
//                   maxDate={currentDate}
//                 />
//               </Form.Group>
//               {errors.endDate && (
//                 <div className="text-danger">{errors.endDate}</div>
//               )}
//             </Col>
//             <Col md={3}>
//               <Form.Group
//                 controlId="classSelect"
//                 className="d-flex align-items-center"
//               >
//                 <Form.Label className="custom-label-staff-attendance mb-0 mr-2">
//                   Class Name
//                 </Form.Label>
//                 <Select
//                   value={selectedClass}
//                   onChange={(option) => setSelectedClass(option)}
//                   options={classNameOptions}
//                   placeholder="Select Class"
//                   isClearable
//                   className="flex-grow-1"
//                 />
//               </Form.Group>
//               {errors.class && (
//                 <div className="text-danger">{errors.class}</div>
//               )}
//             </Col>
//             <Col md={3}>
//               <Form.Group
//                 controlId="studentSelect"
//                 className="d-flex align-items-center"
//               >
//                 <Form.Label className="custom-label-staff-attendance mb-0 mr-2">
//                   Student Name
//                 </Form.Label>
//                 <Select
//                   value={selectedStudent}
//                   onChange={(option) => setSelectedStudent(option)}
//                   options={studentOptions}
//                   placeholder="Select Student"
//                   isClearable
//                   className="flex-grow-1"
//                 />
//               </Form.Group>
//               {errors.student && (
//                 <div className="text-danger">{errors.student}</div>
//               )}
//             </Col>
//           </Row>
//         </div>
//         <Row className="justify-content-end">
//           <Col xs="auto">
//             <Button
//               variant="primary"
//               onClick={handleViewClick}
//               className="custom-button-staff-attendance"
//               style={{ marginBottom: "20px" }}
//             >
//               View
//             </Button>
//           </Col>
//         </Row>
//         {isViewClicked && (
//           <>
//             <hr
//               style={{
//                 border: "none",
//                 borderBottom: "2px solid #333",
//                 width: "100%",
//               }}
//             />
//             <div
//               className="search-bar-result-publish"
//               style={{ width: "30%", float: "right" }}
//             >
//               <Form.Control
//                 type="text"
//                 placeholder="Search..."
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <Table
//               striped
//               bordered
//               hover
//               responsive
//               className="custom-table-staff-attendance text-center"
//               style={{ border: "1px solid #222",width:"95%" }}
//             >
//               <thead>
//                 <tr>
//                   <th
//                     style={{
//                       backgroundColor: "#87CEEB",
//                       fontWeight: "bold",
//                       color: "black",
//                       border: "1px solid #000",
//                       textAlign: "center",
//                     }}
//                   >
//                     Date
//                   </th>
//                   <th
//                     style={{
//                       backgroundColor: "#87CEEB",
//                       fontWeight: "bold",
//                       color: "black",
//                       border: "1px solid #000",
//                       textAlign: "center",
//                     }}
//                   >
//                     Subject
//                   </th>
//                   <th
//                     style={{
//                       backgroundColor: "#87CEEB",
//                       fontWeight: "bold",
//                       color: "black",
//                       border: "1px solid #000",
//                       textAlign: "center",
//                     }}
//                   >
//                     Class
//                   </th>
//                   <th
//                     style={{
//                       backgroundColor: "#87CEEB",
//                       fontWeight: "bold",
//                       color: "black",
//                       border: "1px solid #000",
//                       textAlign: "center",
//                     }}
//                   >
//                     Student
//                   </th>
//                   <th
//                     style={{
//                       backgroundColor: "#87CEEB",
//                       fontWeight: "bold",
//                       color: "black",
//                       border: "1px solid #000",
//                       textAlign: "center",
//                     }}
//                   >
//                     Attendance
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.map((entry, index) => (
//                   <tr key={index}>
//                     <td
//                       style={{ border: "1px solid #000", textAlign: "center" }}
//                     >
//                       {entry.date}
//                     </td>
//                     <td
//                       style={{ border: "1px solid #000", textAlign: "center" }}
//                     >
//                       {entry.subject}
//                     </td>
//                     <td
//                       style={{ border: "1px solid #000", textAlign: "center" }}
//                     >
//                       {entry.class}
//                     </td>
//                     <td
//                       style={{ border: "1px solid #000", textAlign: "center" }}
//                     >
//                       {entry.student}
//                     </td>
//                     <td
//                       style={{ border: "1px solid #000", textAlign: "center" }}
//                     >
//                       {entry.attendance}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </>
//         )}
//       </Container>
//     </div>
//   );
// };

// export default ViewAttendance;


import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { Form, Button, Container, Table, Row, Col } from "react-bootstrap";
import { ApiUrl } from "../../../ApiUrl"; // Adjust the import path as needed

const ViewAttendance = () => {
  const currentDate = new Date();

  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isViewClicked, setIsViewClicked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [errors, setErrors] = useState({});
  const [studentOptions, setStudentOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [classNameOptions, setClassNameOptions] = useState([]);

  const subjects = ["Math", "Science", "History", "Geography", "SocialScience"];

 const fetchClasses = async () => {
   try {
     const response = await fetch(`${ApiUrl.apiurl}Course/GetAllCourse/`);
     const result = await response.json();

     if (result.message === "Success") {
       const classes = result.data.map((classItem) => ({
         value: classItem.id, // Map id to value
         label: classItem.classname, // Map classname to label
       }));
       setClassNameOptions(classes);
     } else {
       console.error("Failed to fetch classes:", result.message);
     }
   } catch (error) {
     console.error("Error fetching classes:", error);
   }
 };

 useEffect(() => {
   fetchClasses();
 }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${ApiUrl.apiurl}api/Student/GetAllStudent/`
        );
        const responseData = await response.json();

        if (Array.isArray(responseData)) {
          const students = responseData.map((studentInfo) => ({
            value: studentInfo.id, // Use the student id for the value
            label: `${studentInfo.first_name} ${studentInfo.last_name}`, // Use first and last names for the label
          }));
          setStudentOptions(students);
        } else {
          console.error("Unexpected data format:", responseData);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = attendanceData.filter((entry) =>
      Object.values(entry)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, attendanceData]);

  const handleViewClick = async () => {
    const newErrors = {};

    if (!startDate) {
      newErrors.startDate = "Start Date is required";
    }
    if (!endDate) {
      newErrors.endDate = "End Date is required";
    }
    if (!selectedClass) {
      newErrors.class = "Class Name is required";
    }
    if (!selectedStudent) {
      newErrors.student = "Student Name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const dateRange = getDateRange(startDate, endDate);

    const mockAttendanceData = dateRange.flatMap((date) =>
      subjects.map((subject) => ({
        date: date.toDateString(),
        subject,
        class: selectedClass?.label || "N/A",
        student: selectedStudent?.label || "N/A",
        attendance: Math.random() < 0.5 ? "Present" : "Absent",
      }))
    );

    setAttendanceData(mockAttendanceData);
    setFilteredData(mockAttendanceData);
    setIsViewClicked(true);
  };

  const getDateRange = (start, end) => {
    const dateRange = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      dateRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateRange;
  };

  return (
    <div className="custom-container-staff-attendance">
      <Container
        fluid
        style={{
          boxShadow: isViewClicked ? "0 0 10px rgba(0, 0, 0, 0.1)" : "none",
          padding: "20px",
          marginBottom: "30px",
          border: "1px solid #ced4da",
          borderRadius: "5px",
          marginTop: "30px",
          width: "100%",
        }}
      >
        {/* <h4 className="text-center">View Attendance</h4> */}
        <div
          style={{
            marginBottom: "30px",
            padding: "10px",
            marginTop: "50px",
          }}
        >
          <Row className="justify-content-between align-items-center">
            <Col md={3}>
              <Form.Group
                controlId="startDate"
                className="d-flex align-items-center"
              >
                <Form.Label className="custom-label-staff-attendance mb-0 mr-2">
                  Start Date
                </Form.Label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date || currentDate)}
                  dateFormat="yyyy/MM/dd"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  className="custom-datepicker-staff-attendance"
                  maxDate={currentDate}
                />
              </Form.Group>
              {errors.startDate && (
                <div className="text-danger">{errors.startDate}</div>
              )}
            </Col>
            <Col md={3}>
              <Form.Group
                controlId="endDate"
                className="d-flex align-items-center"
              >
                <Form.Label className="custom-label-staff-attendance mb-0 mr-2">
                  End Date
                </Form.Label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date || currentDate)}
                  dateFormat="yyyy/MM/dd"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  className="custom-datepicker-staff-attendance"
                  maxDate={currentDate}
                />
              </Form.Group>
              {errors.endDate && (
                <div className="text-danger">{errors.endDate}</div>
              )}
            </Col>
            <Col md={3}>
              <Form.Group
                controlId="classSelect"
                className="d-flex align-items-center"
              >
                <Form.Label className="custom-label-staff-attendance mb-0 mr-2">
                  Class Name
                </Form.Label>
                <Select
                  value={selectedClass}
                  onChange={(option) => setSelectedClass(option)}
                  options={classNameOptions}
                  placeholder="Select Class"
                  isClearable
                  className="flex-grow-1"
                />
              </Form.Group>
              {errors.class && (
                <div className="text-danger">{errors.class}</div>
              )}
            </Col>
            <Col md={3}>
              <Form.Group
                controlId="studentSelect"
                className="d-flex align-items-center"
              >
                <Form.Label className="custom-label-staff-attendance mb-0 mr-2">
                  Student Name
                </Form.Label>
                <Select
                  value={selectedStudent}
                  onChange={(option) => setSelectedStudent(option)}
                  options={studentOptions}
                  placeholder="Select Student"
                  isClearable
                  className="flex-grow-1"
                />
              </Form.Group>
              {errors.student && (
                <div className="text-danger">{errors.student}</div>
              )}
            </Col>
          </Row>
        </div>
        <Row className="justify-content-end">
          <Col xs="auto">
            <Button
              variant="primary"
              onClick={handleViewClick}
              className="custom-button-staff-attendance"
              style={{ marginBottom: "20px" }}
            >
              View
            </Button>
          </Col>
        </Row>
        {isViewClicked && (
          <>
            <hr
              style={{
                border: "none",
                borderBottom: "2px solid #333",
                width: "100%",
              }}
            />

            <Form.Control
              style={{ width: "30%", marginLeft: "70%" }}
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Table
              striped
              bordered
              hover
              responsive
              className="custom-table-staff-attendance text-center"
              style={{
                border: "1px solid #333",
                borderRadius: "5px",
                marginTop: "50px",
                width: "100%",
              }}
            >
              <thead className="table-head-staff-attendance">
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
                    Subject
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
                    Class
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
                    Student
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
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((entry, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                        }}
                      >
                        {entry.date}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                        }}
                      >
                        {entry.subject}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                        }}
                      >
                        {entry.class}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                        }}
                      >
                        {entry.student}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                        }}
                      >
                        {entry.attendance}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No data found.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        )}
      </Container>
    </div>
  );
};

export default ViewAttendance;











