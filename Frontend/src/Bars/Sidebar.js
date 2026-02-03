

// import React, { useState, useEffect } from "react";
// import "./Sidebar.css";
// import Box from "@mui/material/Box";
// import Drawer from "@mui/material/Drawer";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import { MdDashboard } from "react-icons/md";
// import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
// import { useNavigate, useLocation } from "react-router-dom";

// function Sidebar({ state, setState }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [expandedSections, setExpandedSections] = useState({});
//   const [userRole, setUserRole] = useState("guest");

//   useEffect(() => {
//     const storedUserRole = sessionStorage.getItem("userRole");
//     console.log("UserRole:", storedUserRole);
//     if (storedUserRole) {
//       setUserRole(storedUserRole);
//     }
//   }, []);

//   const handleToggle = (section) => () => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   const handleNavigation = (path) => () => {
//     navigate(path);
//     setState((prevState) => ({ ...prevState, left: false }));
//   };

//   const createExpandableSection = (sectionName, icon, items) => (
//     <>
//       <ListItem disablePadding>
//         <ListItemButton
//           sx={{ minHeight: 48, px: 2.5 }}
//           onClick={handleToggle(sectionName)}
//           style={{ display: "flex", justifyContent: "space-between" }}
//         >
//           <ListItemIcon sx={{ minWidth: 10, justifyContent: "center" }}>
//             {expandedSections[sectionName] ? "➖" : "➕"}
//           </ListItemIcon>
//           <ListItemText primary={sectionName} sx={{ marginLeft: "10px" }} />
//         </ListItemButton>
//       </ListItem>
//       {expandedSections[sectionName] &&
//         items.map((item, index) => (
//           <ListItem key={index} disablePadding>
//             <ListItemButton
//               sx={{
//                 minHeight: 48,
//                 px: 2.5,
//                 marginLeft: "50px",
//                 backgroundColor:
//                   location.pathname === item.path ? "blue" : "transparent",
//                 // color: location.pathname === item.path ? "white" : "inherit",
//                 color: location.pathname === item.path ? "black" : "inherit",
//               }}
//               onClick={handleNavigation(item.path)}
//             >
//               <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
//                 {item.icon}
//               </ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//     </>
//   );
//   const sidebarWidth = 220;

//   const list = (anchor) => (
//     // <Box
//     //   sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 300 }}
//     //   role="presentation"
//     // >

//     <Box
//       sx={{
//         width: anchor === "top" || anchor === "bottom" ? "auto" : sidebarWidth,
//       }}
//       role="presentation"
//     >
//       <List>
//         {userRole === "principal" && (
//           <>
//             {createExpandableSection("Student", <MdDashboard />, [
//               { path: "/admin/registration", text: "Registration" },

//               { path: "/admin/Attendance-update", text: "Attendance" },

//               { path: "/admin/assignment-entry", text: "Assignment" },

//               { path: "/admin/student-promotion", text: "Promotion" },
//               { path: "/admin/student-class", text: "Student Class" },
//               { path: "/admin/student-confirm", text: "Student Confirm" },
//               {
//                 path: "/admin/student-certificate",
//                 text: "Student Certificate",
//               },
//               { path: "/admin/student-message", text: "Student Message" },
//               { path: "/admin/student-club", text: "Student Club" },
//             ])}
//             {createExpandableSection("Others", <PersonAddOutlinedIcon />, [
//               { path: "/admin/circular-entry", text: "Circulars" },
//             ])}
//             {createExpandableSection("Staff", <PersonAddOutlinedIcon />, [
//               { path: "/admin/employee-search", text: "Registration" },
//             ])}
//             {createExpandableSection("Fee", <PersonAddOutlinedIcon />, [
//               { path: "/admin/fee-search", text: "Search" },
//               { path: "/admin/adhoc-fees", text: "ADHOC Fees" },
//               { path: "/admin/fee-ledger", text: "Fee Ledger" },
//               { path: "/admin/student-fee", text: "Student Fee" },
//               { path: "/admin/fee-structure", text: "Fee Structure" },
//             ])}
//             {createExpandableSection("Library", <PersonAddOutlinedIcon />, [
//               { path: "/admin/book-dashboard", text: "Book Dashboard" },

//               { path: "/admin/book-category", text: "Book Category" },
//               { path: "/admin/book-search", text: "Search" },
//               {
//                 path: "/admin/book-Configurations",
//                 text: "Book Configurations",
//               },
//               { path: "/admin/book-movements", text: "Issue/Return" },
//               { path: "/admin/book-barcode", text: "Book Barcode" },
//               { path: "/admin/book-title-report", text: "Book Title Report" },
//               { path: "/admin/book-journal-report", text: "Journal Report" },
//               {
//                 path: "/admin/book-accession-report",
//                 text: "	Book Accession Report",
//               },
//               {
//                 path: "/admin/book-issue-return-report",
//                 text: "Issue/Return Report",
//               },
//               {
//                 path: "/admin/book-issue-damaged-report",
//                 text: "	Lost/Damaged Report",
//               },
//               {
//                 path: "/admin/book-most-circulated",
//                 text: "Most Circulated Book Report",
//               },
//             ])}
//             {createExpandableSection(
//               "Exam Results",
//               <PersonAddOutlinedIcon />,
//               [{ path: "/admin/result", text: "Result" }]
//             )}
//             {createExpandableSection("Transport", <PersonAddOutlinedIcon />, [
//               {
//                 path: "/admin/transport-search",
//                 text: " Search",
//               },

//               {
//                 path: "/admin/student-transport-fee",
//                 text: "Student Transport",
//               },
//             ])}
//             {createExpandableSection("Expense", <PersonAddOutlinedIcon />, [
//               { path: "/admin/search-expense", text: "Search Expense" },
//               {
//                 path: "/admin/expense-category",
//                 text: "Expense/Income Category",
//               },
//               { path: "/admin/party-master", text: "Party Master" },
//               { path: "/admin/expense-ledger", text: "Expense Ledger" },
//               { path: "/admin/profit-loss", text: "Profit & Loss" },
//               { path: "/admin/day-book", text: "Day Book" },
//             ])}
//             {createExpandableSection(
//               "Other Income",
//               <PersonAddOutlinedIcon />,
//               [{ path: "/admin/Search-income", text: "Search Income" }]
//             )}
//             {createExpandableSection("Hostel", <PersonAddOutlinedIcon />, [
//               { path: "/admin/search-hostel", text: "Search " },
//               {
//                 path: "/admin/student-hostel-fee",
//                 text: "Student Hostel Fee ",
//               },
//             ])}
//             {createExpandableSection("TimeTable", <PersonAddOutlinedIcon />, [
//               { path: "/admin/class-time-table", text: "Class TimeTable" },
//               { path: "/admin/teacher-time-table", text: "Teacher TimeTable" },
//               { path: "/admin/lesson-plan", text: "Lesson Plan" },
//               {
//                 path: "/admin/teacher-lesson-plan",
//                 text: "Teacher Lesson Plan",
//               },
//             ])}
//             {createExpandableSection("Mentor", <PersonAddOutlinedIcon />, [
//               { path: "/admin/assign-mentor", text: "Assign Mentor" },
//               { path: "/admin/follows-ups", text: "Follow Ups" },
//               { path: "/admin/student-details", text: "Student Details" },
//             ])}
//             {createExpandableSection("Academics", <PersonAddOutlinedIcon />, [
//               { path: "/admin/document-upload", text: "Document Upload" },
//             ])}

//             {createExpandableSection("Dashboard", <PersonAddOutlinedIcon />, [
//               { path: "/admin/fee-dashboard", text: "Fee" },
//               { path: "/admin/student-attendance-list", text: "Attendance" },
//             ])}
//             {createExpandableSection("Grievance", <PersonAddOutlinedIcon />, [
//               { path: "/admin/student-grievance", text: "Student Grievances" },
//             ])}
//             {createExpandableSection("Visitors", <PersonAddOutlinedIcon />, [
//               { path: "/admin/visitors-list", text: "Visitors List" },
//             ])}
//             {createExpandableSection("MOU", <PersonAddOutlinedIcon />, [
//               { path: "/admin/mou-list", text: "Mou List" },
//             ])}
//             {createExpandableSection(
//               "Training and Placements",
//               <PersonAddOutlinedIcon />,
//               [{ path: "/admin/training", text: "Training" }]
//             )}
//           </>
//         )}
//         {userRole === "student" && (
//           <>
//             {createExpandableSection("Student", <MdDashboard />, [
//               { path: "/student/dashboards", text: "Dashboard" },
//               { path: "/student/StudentProfileCard", text: "Student Profile" },

//               {
//                 path: "/student/StudentAddressDetail",
//                 text: "Address Details",
//               },
//               {
//                 path: "/student/StudentChangePassword",
//                 text: "Change Password",
//               },

//               { path: "/student/view-attendance", text: "View Attendance" },
//               { path: "/student/view-result", text: "View Result" },
//               { path: "/student/assignment", text: "Assignment" },

//               { path: "/student/payment-gateway", text: "Payment" },
//               { path: "/student/hostel-detail", text: "Hostel Details" },
//               { path: "/student/online-class", text: "Online Class" },
//               { path: "/student/mentor-details", text: "Mentor Details" },
//               { path: "/student/time-table", text: "Time Table" },
//               { path: "/student/circular", text: "Circular" },
//               { path: "/student/grievance", text: "Grievance" },

//               { path: "/student/library", text: "Library" },
//               { path: "/student/leave-detail", text: "Leave Details" },
//               {
//                 path: "/student/previous-education",
//                 text: "Previous Education",
//               },
//               {
//                 path: "/student/submit-application",
//                 text: "RTGS Submit Application",
//               },
//               {
//                 path: "/student/download-demand-letter",
//                 text: "Download Demand letter",
//               },
//             ])}
//           </>
//         )}
//         {userRole === "staff" && (
//           <>
//             {createExpandableSection("Staff", <MdDashboard />, [
//               { path: "/staff/dashboard", text: "Dashboard" },
//               { path: "/staff/take-student-attendance", text: "Attendance" },
//               {
//                 path: "/staff/staff-time-table",
//                 text: "Time Table",
//               },
//               {
//                 path: "/staff/follow-up",
//                 text: "Follow Up",
//               },
//               { path: "/staff/staff-student-profile", text: "Student Details" },

//               { path: "/staff/assignment-entry", text: "Assignment Entry" },
//               { path: "/staff/document-upload", text: "Document Upload" },

//               { path: "/staff/exam-result", text: "Exam Result" },
//               { path: "/staff/lesson-plan", text: "Lesson Plan" },
//             ])}
//           </>
//         )}
//       </List>
//     </Box>
//   );

//   return (
//     <div>
//       {["left"].map((anchor) => (
//         <React.Fragment key={anchor}>
//           <Drawer
//             anchor={anchor}
//             open={state[anchor]}
//             onClose={() =>
//               setState((prevState) => ({ ...prevState, [anchor]: false }))
//             }
//           >
//             {list(anchor)}
//           </Drawer>
//         </React.Fragment>
//       ))}
//     </div>
//   );
// }

// export default Sidebar;





import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { MdDashboard } from "react-icons/md";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import { PiStudentBold } from "react-icons/pi";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { BsCashCoin } from "react-icons/bs";
import { HiOutlineLibrary } from "react-icons/hi";
import { PiExam } from "react-icons/pi";
import { FaBusAlt, FaWarehouse, FaBookOpen } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { MdOutlineAddHomeWork } from "react-icons/md";
import { FaRegCalendarTimes } from "react-icons/fa";
import { PiChalkboardTeacher } from "react-icons/pi";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { LuBaggageClaim } from "react-icons/lu";
import { FaPeopleGroup } from "react-icons/fa6";
import { RiNewspaperLine } from "react-icons/ri";
import { ImOffice } from "react-icons/im";
import { GiTeacher } from "react-icons/gi";


function Sidebar({ state, setState }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState(null);

  const [userRole, setUserRole] = useState("guest");

  useEffect(() => {
    const storedUserRole = sessionStorage.getItem("userRole");
    console.log("UserRole:", storedUserRole);
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  const handleToggle = (section) => () => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };


  const handleNavigation = (path) => () => {
    navigate(path);
    setState((prevState) => ({ ...prevState, left: false }));
  };

  // const createExpandableSection = (sectionName, icon, items) => (
  //   <>
  //     <ListItem disablePadding>
  //       <ListItemButton
  //         sx={{ minHeight: 48, px: 2.5 }}
  //         onClick={handleToggle(sectionName)}
  //         style={{ display: "flex", justifyContent: "space-between" }}
  //       >
  //         <ListItemIcon sx={{ minWidth: 10, justifyContent: "center" }}>
  //           {expandedSections[sectionName] ? "➖" : "➕"}
  //         </ListItemIcon>
  //         <ListItemText primary={sectionName} sx={{ marginLeft: "10px" }} />
  //       </ListItemButton>
  //     </ListItem>
  //     {expandedSections[sectionName] &&
  //       items.map((item, index) => (
  //         <ListItem key={index} disablePadding>
  //           <ListItemButton
  //             sx={{
  //               minHeight: 48,
  //               px: 2.5,
  //               marginLeft: "50px",
  //               backgroundColor:
  //                 location.pathname === item.path ? "blue" : "transparent",
  //               // color: location.pathname === item.path ? "white" : "inherit",
  //               color: location.pathname === item.path ? "black" : "inherit",
  //             }}
  //             onClick={handleNavigation(item.path)}
  //           >
  //             <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
  //               {item.icon}
  //             </ListItemIcon>
  //             <ListItemText primary={item.text} />
  //           </ListItemButton>
  //         </ListItem>
  //       ))}
  //   </>
  // );
  const createExpandableSection = (sectionName, sectionIcon, items) => (
    <>
      <ListItem disablePadding>
        <ListItemButton
          sx={{ minHeight: 48, px: 2.5 }}
          onClick={handleToggle(sectionName)}
        >
          <ListItemIcon sx={{ minWidth: 30, justifyContent: "center" }}>
            {sectionIcon}
          </ListItemIcon>
          <ListItemText primary={sectionName} />
        </ListItemButton>
      </ListItem>

      {expandedSection === sectionName &&
        items.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              sx={{
                minHeight: 40,
                px: 2,
                pl: 6,
                backgroundColor:
                  location.pathname === item.path ? "blue" : "transparent",
                color: location.pathname === item.path ? "black" : "inherit",
              }}
              onClick={handleNavigation(item.path)}
            >
              {item.icon && (
                <ListItemIcon sx={{ minWidth: 30, justifyContent: "center" }}>
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
    </>
  );


  const sidebarWidth = 220;

  const list = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : sidebarWidth,
      }}
      role="presentation"
    >
      <List>
        {(userRole === "principal" || userRole === "admin") && (
          <>
            {createExpandableSection("Dashboards", <MdDashboard />, [
              { path: "/admin/fee-dashboard", text: "Fee" },
              { path: "/admin/student-attendance-list", text: "Attendance" },
            ])}
            {createExpandableSection("Student", <PiStudentBold />, [
              { path: "/admin/registration", text: "Registration" },

              { path: "/admin/Attendance-update", text: "Attendance" },

              { path: "/admin/assignment-entry", text: "Assignment" },

              { path: "/admin/student-promotion", text: "Promotion" },
              { path: "/admin/student-class", text: "Student Course" },
              { path: "/admin/student-confirm", text: "Student Confirm" },
              {
                path: "/admin/student-certificate",
                text: "Student Certificate",
              },
              { path: "/admin/student-message", text: "Student Message" },
              { path: "/admin/student-club", text: "Student Club" },

              { path: "/admin/circular-entry", text: "Circulars" },
            ])}
            {/* {createExpandableSection("Others", <PersonAddOutlinedIcon />, [])} */}
            {createExpandableSection("Staff", <PiChalkboardTeacherFill />, [
              { path: "/admin/employee-search", text: "Registration" },
            ])}
            {createExpandableSection("Fee", <BsCashCoin />, [
              { path: "/admin/fee-search", text: "Search" },
              { path: "/admin/adhoc-fees", text: "ADHOC Fees" },
              { path: "/admin/fee-ledger", text: "Fee Ledger" },
              { path: "/admin/student-fee", text: "Student Fee" },
              { path: "/admin/fee-structure", text: "Fee Structure" },
            ])}
            {createExpandableSection("Library", <HiOutlineLibrary />, [
              { path: "/admin/book-dashboard", text: "Book Dashboard" },

              { path: "/admin/book-category", text: "Book Category" },
              { path: "/admin/book-search", text: "Search" },
              {
                path: "/admin/book-Configurations",
                text: "Book Configurations",
              },
              { path: "/admin/book-movements", text: "Issue/Return" },
              { path: "/admin/book-barcode", text: "Book Barcode" },
              { path: "/admin/book-title-report", text: "Book Title Report" },
              { path: "/admin/book-journal-report", text: "Journal Report" },
              {
                path: "/admin/book-accession-report",
                text: "	Book Accession Report",
              },
              {
                path: "/admin/book-issue-return-report",
                text: "Issue/Return Report",
              },
              {
                path: "/admin/book-issue-damaged-report",
                text: "	Lost/Damaged Report",
              },
              {
                path: "/admin/book-most-circulated",
                text: "Most Circulated Book Report",
              },
            ])}
            {createExpandableSection("Exam Results", <PiExam />, [
              { path: "/admin/result", text: "Result" },
            ])}
            {createExpandableSection("Transport", <FaBusAlt />, [
              {
                path: "/admin/transport-search",
                text: " Search",
              },

              {
                path: "/admin/student-transport-fee",
                text: "Student Transport",
              },
            ])}
            {createExpandableSection("Expense", <FaMoneyBillTransfer />, [
              { path: "/admin/search-expense", text: "Search Expense" },
              {
                path: "/admin/expense-category",
                text: "Expense/Income Category",
              },
              { path: "/admin/party-master", text: "Party Master" },
              { path: "/admin/expense-ledger", text: "Expense Ledger" },
              { path: "/admin/profit-loss", text: "Profit & Loss" },
              { path: "/admin/day-book", text: "Day Book" },
            ])}
            {createExpandableSection("Other Income", <GiMoneyStack />, [
              { path: "/admin/Search-income", text: "Search Income" },
            ])}
            {createExpandableSection("Hostel", <MdOutlineAddHomeWork />, [
              { path: "/admin/search-hostel", text: "Search " },
              {
                path: "/admin/student-hostel-details",
                text: "Student Hostel Details",
              },
              {
                path: "/admin/student-hostel-fee",
                text: "Student Hostel Fee ",
              },
            ])}
            {createExpandableSection("TimeTable", <FaRegCalendarTimes />, [
              { path: "/admin/class-time-table", text: "Class TimeTable" },
              { path: "/admin/teacher-time-table", text: "Teacher TimeTable" },
              { path: "/admin/lesson-plan", text: "Lesson Plan" },
              {
                path: "/admin/teacher-lesson-plan",
                text: "Teacher Lesson Plan",
              },
            ])}
            {createExpandableSection("LessonPlan", <FaBookOpen />, [
              { path: "/admin/lesson-plan", text: "Lesson Plan" },
              {
                path: "/admin/teacher-lesson-plan",
                text: "Teacher Lesson Plan",
              },
            ])}
            {createExpandableSection("Mentor", <PiChalkboardTeacher />, [
              { path: "/admin/assign-mentor", text: "Assign Mentor" },
              { path: "/admin/follows-ups", text: "Follow Ups" },
              { path: "/admin/student-details", text: "Student Details" },
            ])}
            {createExpandableSection("Academics", <HiOutlineAcademicCap />, [
              { path: "/admin/document-upload", text: "Document Upload" },
            ])}

            {createExpandableSection("Grievance", <LuBaggageClaim />, [
              { path: "/admin/student-grievance", text: "Student Grievances" },
            ])}
            {createExpandableSection("Visitors", <FaPeopleGroup />, [
              { path: "/admin/visitors-list", text: "Visitors List" },
            ])}
            {createExpandableSection("MOU", <RiNewspaperLine />, [
              { path: "/admin/mou-list", text: "Mou List" },
            ])}
            {createExpandableSection("Training and Placements", <ImOffice />, [
              { path: "/admin/training", text: "Training" },
            ])}
            {createExpandableSection("Inventory Management", <FaWarehouse />, [
              { path: "/admin/inventory", text: "Inventory Category" },
              { path: "/admin/inventory-search", text: "Inventory Search" },
            ])}
          </>
        )}
        {userRole === "student" && (
          <>
            {createExpandableSection("Student", <PiStudentBold />, [
              { path: "/student/dashboards", text: "Dashboard" },
              { path: "/student/StudentProfileCard", text: "Student Profile" },

              {
                path: "/student/StudentAddressDetail",
                text: "Address Details",
              },
              {
                path: "/student/StudentChangePassword",
                text: "Change Password",
              },

              { path: "/student/view-attendance", text: "View Attendance" },
              { path: "/student/view-result", text: "View Result" },
              { path: "/student/assignment", text: "Assignment" },

              { path: "/student/payment-gateway", text: "Payment" },
              { path: "/student/hostel-detail", text: "Hostel Details" },
              { path: "/student/online-class", text: "Online Class" },
              { path: "/student/mentor-details", text: "Mentor Details" },
              { path: "/student/time-table", text: "Time Table" },
              { path: "/student/circular", text: "Circular" },
              { path: "/student/grievance", text: "Grievance" },
              {
                path: "/student/training-placement",
                text: "Training & Placement",
              },

              { path: "/student/library", text: "Library" },

              {
                path: "/student/previous-education",
                text: "Previous Education",
              },
              {
                path: "/student/submit-application",
                text: "RTGS Submit Application",
              },
            ])}
          </>
        )}
        {userRole === "staff" && (
          <>
            {createExpandableSection("Staff", <GiTeacher />, [
              { path: "/staff/dashboard", text: "Dashboard" },
              { path: "/staff/take-student-attendance", text: "Attendance" },
              {
                path: "/staff/staff-time-table",
                text: "Time Table",
              },
              {
                path: "/staff/follow-up",
                text: "Follow Up",
              },
              { path: "/staff/staff-student-profile", text: "Student Details" },

              { path: "/staff/assignment-entry", text: "Assignment Entry" },
              { path: "/staff/document-upload", text: "Document Upload" },

              { path: "/staff/exam-result", text: "Exam Result" },
              { path: "/staff/lesson-plan", text: "Lesson Plan" },
              { path: "/staff/change-password", text: "Change Password" },
            ])}
          </>
        )}
      </List>
    </Box>
  );

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={() =>
              setState((prevState) => ({ ...prevState, [anchor]: false }))
            }
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Sidebar;




