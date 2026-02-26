// import React, { useState, useEffect } from "react";
// import { Form, Container, Button, Table } from "react-bootstrap";
// import { FaUser, FaCalendarAlt, FaClock } from "react-icons/fa";
// import "./StaffTakeOwnAttendance.css";
// import { ApiUrl } from "../../../ApiUrl";

// const StaffOwnAttendance = () => {
//   const [userName, setUserName] = useState("");
//   const [currentDate, setCurrentDate] = useState(
//     new Date().toLocaleDateString()
//   );
//   const [currentTime, setCurrentTime] = useState(
//     new Date().toLocaleTimeString()
//   );
//   const [punchInClicked, setPunchInClicked] = useState(false);
//   const [punchOutClicked, setPunchOutClicked] = useState(false);
//   const [attendanceData, setAttendanceData] = useState([]);

//   const usernames = ["User1", "User2", "User3", "User4", "User5"];

//   const generateRandomUsername = () => {
//     const randomIndex = Math.floor(Math.random() * usernames.length);
//     return usernames[randomIndex];
//   };

//   useEffect(() => {
//     const randomUsername = generateRandomUsername();
//     setUserName(randomUsername);

//     // Update the date every 24 hours
//     const dateInterval = setInterval(() => {
//       setCurrentDate(new Date().toLocaleDateString());
//     }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

//     // Update the time every second
//     const timeInterval = setInterval(() => {
//       setCurrentTime(new Date().toLocaleTimeString());
//     }, 1000);

//     return () => {
//       clearInterval(dateInterval);
//       clearInterval(timeInterval);
//     };
//   }, []);

//   const handlePunchIn = () => {
//     const now = new Date();
//     const punchInTime = now.toLocaleTimeString();
//     setPunchInClicked(true);
//     setPunchOutClicked(false);

//     // Automatically switch to "Punch In" after 24 hours
//     const punchInTimeout = setTimeout(() => {
//       setPunchInClicked(false);
//       setPunchOutClicked(false);
//     }, 24 * 60 * 60 * 2000); // 24 hours in milliseconds

//     // Clear the timeout if "Punch Out" is clicked before the timeout triggers
//     const clearPunchInTimeout = () => clearTimeout(punchInTimeout);

//     setAttendanceData([
//       ...attendanceData,
//       {
//         userName,
//         currentDate,
//         punchInTime,
//         punchOutTime: "-",
//         clearPunchInTimeout,
//       },
//     ]);
//   };

//   const handlePunchOut = () => {
//     const now = new Date();
//     const punchOutTime = now.toLocaleTimeString();
//     setPunchInClicked(false);
//     setPunchOutClicked(true);

//     const updatedAttendanceData = attendanceData.map((entry) => {
//       if (entry.punchOutTime === "-") {
//         return {
//           ...entry,
//           punchOutTime,
//         };
//       }
//       return entry;
//     });

//     // Clear the "Punch In" timeout when "Punch Out" is clicked
//     const clearPunchInTimeout =
//       attendanceData[attendanceData.length - 1].clearPunchInTimeout;
//     if (clearPunchInTimeout) {
//       clearPunchInTimeout();
//     }

//     setAttendanceData(updatedAttendanceData);
//   };

//   return (
//     <div className="custom-container-staff-own-attendance">
//       <Container>
//         <Form className="custom-form-staff-own-attendance">
//           <Form.Label className="custom-username-label">
//             <FaUser /> {userName}
//           </Form.Label>

//           <Form.Group controlId="currentDate" className="mb-3">
//             <Form.Label className="custom-label-staff-own-attendance">
//               <FaCalendarAlt /> Current date
//             </Form.Label>
//             <input
//               type="text"
//               value={currentDate}
//               readOnly
//               className="custom-input-staff-own-attendance form-control-lg"
//             />
//           </Form.Group>

//           <Form.Group controlId="currentTime" className="mb-3">
//             <Form.Label className="custom-label-staff-own-attendance">
//               <FaClock /> Current time
//             </Form.Label>
//             <input
//               type="text"
//               value={currentTime}
//               readOnly
//               className="custom-input-staff-own-attendance form-control-lg"
//             />
//           </Form.Group>

//           <Button
//             variant="primary"
//             onClick={handlePunchIn}
//             disabled={punchInClicked || punchOutClicked}
//             className="me-3"
//           >
//             Punch In
//           </Button>

//           <Button
//             variant="danger"
//             onClick={handlePunchOut}
//             disabled={punchOutClicked || !punchInClicked}
//           >
//             Punch Out
//           </Button>
//         </Form>
//       </Container>

//       {attendanceData.length > 0 && (
//         <Table
//           responsive
//           bordered
//           hover
//           className="custom-table-staff-own-attendance mt-4"
//         >
//           <thead>
//             <tr>
//               <th>Current Date</th>
//               <th>Punch In</th>
//               <th>Punch Out</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceData.map((entry, index) => (
//               <tr key={index}>
//                 <td>{entry.currentDate}</td>
//                 <td>{entry.punchInTime}</td>
//                 <td>{entry.punchOutTime}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </div>
//   );
// };

// export default StaffOwnAttendance;



import React, { useState, useEffect } from "react";
import { Form, Container, Button, Table } from "react-bootstrap";
import { FaUser, FaCalendarAlt, FaClock } from "react-icons/fa";
import "./AdmOwnAttendance.css";
import { ApiUrl } from "../../../ApiUrl";

// Define the formatTime function
const formatTime = (time) => {
  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const seconds = String(time.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const StaffOwnAttendance = () => {
  const [userName, setUserName] = useState("");
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );
  const [currentTime, setCurrentTime] = useState(
    formatTime(new Date()) // Initialize with the current time
  );
  const [punchInClicked, setPunchInClicked] = useState(false);
  const [punchOutClicked, setPunchOutClicked] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);

  const usernames = ["User1"];

  const generateRandomUsername = () => {
    const randomIndex = Math.floor(Math.random() * usernames.length);
    return usernames[randomIndex];
  };

  useEffect(() => {
    fetchData();
    const randomUsername = generateRandomUsername();
    setUserName(randomUsername);

    const dateInterval = setInterval(() => {
      setCurrentDate(new Date().toLocaleDateString());
    }, 24 * 60 * 60 * 1000);

    const timeInterval = setInterval(() => {
      setCurrentTime(formatTime(new Date())); // Update current time every second
    }, 1000);

    return () => {
      clearInterval(dateInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${ApiUrl.apiurl}staffattendancelist`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePunchIn = async () => {
    try {
      const now = new Date();
      const punchInTime = formatTime(now);
      setPunchInClicked(true);
      setPunchOutClicked(false);

      const response = await fetch(`${ApiUrl.apiurl}staffattendancecreate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_id: parseInt(localStorage.getItem("loginId")),
          date: now.toISOString().split("T")[0],
          in_time: punchInTime,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      await fetchData(); // Fetch latest data after Punch In
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePunchOut = async () => {
    try {
      const now = new Date();
      const punchOutTime = formatTime(now);
      setPunchInClicked(false);
      setPunchOutClicked(true);

      const response = await fetch(`${ApiUrl.apiurl}staffattendanceupdate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_id: parseInt(localStorage.getItem("loginId")),
          date: now.toISOString().split("T")[0],
          out_time: punchOutTime,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      await fetchData(); // Fetch latest data after Punch Out
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="custom-container-staff-own-attendance">
      <Container>
        <Form className="custom-form-staff-own-attendance">
          <Form.Label className="custom-username-label">
            <FaUser /> {userName}
          </Form.Label>

          <Form.Group controlId="currentDate" className="mb-3">
            <Form.Label className="custom-label-staff-own-attendance">
              <FaCalendarAlt /> Current date
            </Form.Label>
            <input
              type="text"
              value={currentDate}
              readOnly
              className="custom-input-staff-own-attendance form-control-lg"
            />
          </Form.Group>

          <Form.Group controlId="currentTime" className="mb-3">
            <Form.Label className="custom-label-staff-own-attendance">
              <FaClock /> Current time
            </Form.Label>
            <input
              type="text"
              value={currentTime}
              readOnly
              className="custom-input-staff-own-attendance form-control-lg"
            />
          </Form.Group>

          <Button
            variant="primary"
            onClick={handlePunchIn}
            disabled={punchInClicked || punchOutClicked}
            className="me-3"
          >
            Punch In
          </Button>

          <Button
            variant="danger"
            onClick={handlePunchOut}
            disabled={punchOutClicked || !punchInClicked}
          >
            Punch Out
          </Button>
        </Form>
      </Container>

      {attendanceData.length > 0 && (
        <Table
          responsive
          bordered
          hover
          className="custom-table-staff-own-attendance mt-4"
        >
          <thead>
            <tr>
              <th>Current Date</th>
              <th>Punch In</th>
              <th>Punch Out</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.in_time}</td>
                <td>{entry.out_time}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default StaffOwnAttendance;















// import React, { useState, useEffect } from "react";
// import { Form, Container, Button, Table } from "react-bootstrap";
// import { FaUser, FaCalendarAlt, FaClock } from "react-icons/fa";
// import "./StaffTakeOwnAttendance.css";
// import { ApiUrl } from "../../../ApiUrl";

// const StaffOwnAttendance = () => {
//   const [userName, setUserName] = useState("");
//   const [currentDate, setCurrentDate] = useState("");
//   const [currentTime, setCurrentTime] = useState("");
//   const [punchInClicked, setPunchInClicked] = useState(false);
//   const [punchOutClicked, setPunchOutClicked] = useState(false);
//   const [attendanceData, setAttendanceData] = useState([]);

//   const usernames = ["User1"];

//   const generateRandomUsername = () => {
//     const randomIndex = Math.floor(Math.random() * usernames.length);
//     return usernames[randomIndex];
//   };

//   useEffect(() => {
//     const randomUsername = generateRandomUsername();
//     setUserName(randomUsername);

//     const initialSystemTime = localStorage.getItem("initialSystemTime");
//     if (!initialSystemTime) {
//       const now = new Date();
//       setCurrentDate(now.toLocaleDateString());
//       setCurrentTime(now.toLocaleTimeString());
//       localStorage.setItem("initialSystemTime", now.getTime());
//     } else {
//       const now = new Date(parseInt(initialSystemTime));
//       setCurrentDate(now.toLocaleDateString());
//       setCurrentTime(now.toLocaleTimeString());
//     }

//     const dateInterval = setInterval(() => {
//       setCurrentDate(new Date().toLocaleDateString());
//     }, 24 * 60 * 60 * 1000);

//     const timeInterval = setInterval(() => {
//       setCurrentTime(new Date().toLocaleTimeString());
//     }, 1000);

//     return () => {
//       clearInterval(dateInterval);
//       clearInterval(timeInterval);
//     };
//   }, []);

//   useEffect(() => {
//     const fetchAttendanceData = async () => {
//       try {
//         const response = await fetch(`${ApiUrl.apiurl}staffattendancelist`);
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         setAttendanceData(data);
//       } catch (error) {
//         console.error("Error fetching attendance data:", error);
//       }
//     };

//     fetchAttendanceData();
//   }, []);

//   const formatTime = (time) => {
//     const date = new Date(time);
//     const hh = String(date.getHours()).padStart(2, "0");
//     const mm = String(date.getMinutes()).padStart(2, "0");
//     const ss = String(date.getSeconds()).padStart(2, "0");
//     const uuuuuu = String(date.getMilliseconds()).padStart(6, "0");
//     return `${hh}:${mm}:${ss}.${uuuuuu}`;
//   };

//   const formatDate = (date) => {
//     const yyyy = date.getFullYear();
//     const mm = String(date.getMonth() + 1).padStart(2, "0");
//     const dd = String(date.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   };

//   const handlePunchIn = async () => {
//     try {
//       const now = new Date(); // Get client-side time
//       const punchInTime = formatTime(now);
//       setPunchInClicked(true);
//       setPunchOutClicked(false);

//       // Send punch in request to server
//       const response = await fetch(`${ApiUrl.apiurl}staffattendancecreate`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           login_id: parseInt(localStorage.getItem("loginId")),
//           date: formatDate(now),
//           in_time: punchInTime,
//           system_time: formatTime(new Date()), // Send actual system time to server
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const responseData = await response.json();

//       // Update attendance data immediately after punch in
//       setAttendanceData((prevAttendanceData) => {
//         return [
//           ...prevAttendanceData,
//           {
//             userName: responseData.login_id,
//             date: formatDate(now),
//             in_time: punchInTime,
//             out_time: null,
//             id: responseData.id, // Add ID for proper mapping
//           },
//         ];
//       });
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const handlePunchOut = async (id) => {
//     try {
//       const now = new Date();
//       const punchOutTime = formatTime(now);
//       setPunchInClicked(false);
//       setPunchOutClicked(true);

//       // Send punch out request to server
//       const response = await fetch(
//         `${ApiUrl.apiurl}staffattendanceouttimeupdate/${id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             out_time: punchOutTime,
//             system_time: formatTime(new Date()), // Send actual system time to server
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       // Update the punch out time in the local state
//       const updatedAttendanceData = attendanceData.map((entry) => {
//         if (entry.id === id) {
//           return {
//             ...entry,
//             out_time: punchOutTime,
//           };
//         }
//         return entry;
//       });

//       // Update attendance data state
//       setAttendanceData(updatedAttendanceData);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div className="custom-container-staff-own-attendance">
//       <Container>
//         <Form className="custom-form-staff-own-attendance">
//           <Form.Label className="custom-username-label">
//             <FaUser /> {userName}
//           </Form.Label>

//           <Form.Group controlId="currentDate" className="mb-3">
//             <Form.Label className="custom-label-staff-own-attendance">
//               <FaCalendarAlt /> Current date
//             </Form.Label>
//             <input
//               type="text"
//               value={currentDate}
//               readOnly
//               className="custom-input-staff-own-attendance form-control-lg"
//             />
//           </Form.Group>

//           <Form.Group controlId="currentTime" className="mb-3">
//             <Form.Label className="custom-label-staff-own-attendance">
//               <FaClock /> Current time
//             </Form.Label>
//             <input
//               type="text"
//               value={currentTime}
//               readOnly
//               className="custom-input-staff-own-attendance form-control-lg"
//             />
//           </Form.Group>

//           <Button
//             variant="primary"
//             onClick={handlePunchIn}
//             disabled={punchInClicked || punchOutClicked}
//             className="me-3"
//           >
//             Punch In
//           </Button>

//           <Button
//             variant="danger"
//             onClick={() =>
//               handlePunchOut(attendanceData[attendanceData.length - 1]?.id)
//             }
//             disabled={punchOutClicked || !punchInClicked}
//           >
//             Punch Out
//           </Button>
//         </Form>
//       </Container>

//       {attendanceData.length > 0 && (
//         <Table
//           responsive
//           bordered
//           hover
//           className="custom-table-staff-own-attendance mt-4"
//         >
//           <thead>
//             <tr>
//               <th>Current Date</th>
//               <th>Punch In</th>
//               <th>Punch Out</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceData.map((entry, index) => (
//               <tr key={index}>
//                 <td>{entry.date}</td>
//                 <td>{entry.in_time}</td>
//                 <td>{entry.out_time ? entry.out_time : "Not punched out"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </div>
//   );
// };

// export default StaffOwnAttendance;

