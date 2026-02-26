
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
  const [accessibleModules, setAccessibleModules] = useState([]);

  useEffect(() => {
    const storedUserRole = sessionStorage.getItem("userRole");
    console.log("UserRole:", storedUserRole);
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }

    // Get accessible modules for admin users
    const modulesStr = sessionStorage.getItem("accessible_modules");
    if (modulesStr) {
      try {
        const modules = JSON.parse(modulesStr);
        setAccessibleModules(modules);
        console.log("Accessible Modules:", modules);
      } catch (error) {
        console.error("Error parsing accessible modules:", error);
        setAccessibleModules([]);
      }
    }
  }, []);

  // Helper function to check if module is accessible
  const isModuleAccessible = (moduleCode) => {
    // If no modules specified, show all (for backward compatibility)
    if (!accessibleModules || accessibleModules.length === 0) {
      return true;
    }

    // Check if user has parent-level access (backward compatibility)
    if (accessibleModules.includes(moduleCode)) {
      return true;
    }

    // Check if user has any child-level access for this parent
    const hasChildAccess = accessibleModules.some(m => m.startsWith(moduleCode + "."));
    return hasChildAccess;
  };

  // Helper function to check if specific child menu is accessible
  const isChildAccessible = (childCode) => {
    // If no modules specified, show all (for backward compatibility)
    if (!accessibleModules || accessibleModules.length === 0) {
      return true;
    }

    // Extract parent from child code (e.g., "student.registration" -> "student")
    const parent = childCode.split('.')[0];

    // If user has parent-level access, show all children (backward compatibility)
    if (accessibleModules.includes(parent)) {
      return true;
    }

    // Check if user has specific child access
    const hasAccess = accessibleModules.includes(childCode);
    return hasAccess;
  };

  const handleToggle = (section) => () => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };


  const handleNavigation = (path) => () => {
    navigate(path);
    setState((prevState) => ({ ...prevState, left: false }));
  };

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
            {isModuleAccessible("dashboard") && createExpandableSection("Dashboards", <MdDashboard />, [
              isChildAccessible("dashboard.fee_dashboard") && { path: "/admin/fee-dashboard", text: "Fee" },
              isChildAccessible("dashboard.attendance") && { path: "/admin/student-attendance-list", text: "Attendance" },
            ].filter(Boolean))}
            {isModuleAccessible("student") && createExpandableSection("Student", <PiStudentBold />, [
              isChildAccessible("student.registration") && { path: "/admin/registration", text: "Registration" },
              isChildAccessible("student.attendance") && { path: "/admin/Attendance-update", text: "Attendance" },
              isChildAccessible("student.assignment") && { path: "/admin/assignment-entry", text: "Assignment" },
              isChildAccessible("student.promotion") && { path: "/admin/student-promotion", text: "Promotion" },
              isChildAccessible("student.class") && { path: "/admin/student-class", text: "Student Course" },
              isChildAccessible("student.confirm") && { path: "/admin/student-confirm", text: "Student Confirm" },
              isChildAccessible("student.certificate") && { path: "/admin/student-certificate", text: "Student Certificate" },
              isChildAccessible("student.message") && { path: "/admin/student-message", text: "Student Message" },
              isChildAccessible("student.club") && { path: "/admin/student-club", text: "Student Club" },
              isChildAccessible("student.circular") && { path: "/admin/circular-entry", text: "Circulars" },
            ].filter(Boolean))}
            {/* {createExpandableSection("Others", <PersonAddOutlinedIcon />, [])} */}
            {isModuleAccessible("staff") && createExpandableSection("Staff", <PiChalkboardTeacherFill />, [
              isChildAccessible("staff.registration") && { path: "/admin/employee-search", text: "Registration" },
            ].filter(Boolean))}
            {isModuleAccessible("fee") && createExpandableSection("Fee", <BsCashCoin />, [
              isChildAccessible("fee.search") && { path: "/admin/fee-search", text: "Search" },
              isChildAccessible("fee.adhoc") && { path: "/admin/adhoc-fees", text: "ADHOC Fees" },
              isChildAccessible("fee.ledger") && { path: "/admin/fee-ledger", text: "Fee Ledger" },
              isChildAccessible("fee.student_fee") && { path: "/admin/student-fee", text: "Student Fee" },
              isChildAccessible("fee.structure") && { path: "/admin/fee-structure", text: "Fee Structure" },
            ].filter(Boolean))}
            {isModuleAccessible("library") && createExpandableSection("Library", <HiOutlineLibrary />, [
              isChildAccessible("library.dashboard") && { path: "/admin/book-dashboard", text: "Book Dashboard" },
              isChildAccessible("library.category") && { path: "/admin/book-category", text: "Book Category" },
              isChildAccessible("library.search") && { path: "/admin/book-search", text: "Search" },
              isChildAccessible("library.configurations") && { path: "/admin/book-Configurations", text: "Book Configurations" },
              isChildAccessible("library.movements") && { path: "/admin/book-movements", text: "Issue/Return" },
              isChildAccessible("library.barcode") && { path: "/admin/book-barcode", text: "Book Barcode" },
              isChildAccessible("library.title_report") && { path: "/admin/book-title-report", text: "Book Title Report" },
              isChildAccessible("library.journal_report") && { path: "/admin/book-journal-report", text: "Journal Report" },
              isChildAccessible("library.accession_report") && { path: "/admin/book-accession-report", text: "	Book Accession Report" },
              isChildAccessible("library.issue_return_report") && { path: "/admin/book-issue-return-report", text: "Issue/Return Report" },
              isChildAccessible("library.damaged_report") && { path: "/admin/book-issue-damaged-report", text: "	Lost/Damaged Report" },
              isChildAccessible("library.most_circulated") && { path: "/admin/book-most-circulated", text: "Most Circulated Book Report" },
            ].filter(Boolean))}
            {isModuleAccessible("exam_results") && createExpandableSection("Exam Results", <PiExam />, [
              isChildAccessible("exam_results.result") && { path: "/admin/result", text: "Result" },
            ].filter(Boolean))}
            {isModuleAccessible("transport") && createExpandableSection("Transport", <FaBusAlt />, [
              isChildAccessible("transport.search") && { path: "/admin/transport-search", text: " Search" },
              isChildAccessible("transport.student_fee") && { path: "/admin/student-transport-fee", text: "Student Transport" },
            ].filter(Boolean))}
            {isModuleAccessible("expense") && createExpandableSection("Expense", <FaMoneyBillTransfer />, [
              isChildAccessible("expense.search") && { path: "/admin/search-expense", text: "Search Expense" },
              isChildAccessible("expense.category") && { path: "/admin/expense-category", text: "Expense/Income Category" },
              isChildAccessible("expense.party_master") && { path: "/admin/party-master", text: "Party Master" },
              isChildAccessible("expense.ledger") && { path: "/admin/expense-ledger", text: "Expense Ledger" },
              isChildAccessible("expense.profit_loss") && { path: "/admin/profit-loss", text: "Profit & Loss" },
              isChildAccessible("expense.day_book") && { path: "/admin/day-book", text: "Day Book" },
            ].filter(Boolean))}
            {isModuleAccessible("other_income") && createExpandableSection("Other Income", <GiMoneyStack />, [
              isChildAccessible("other_income.search") && { path: "/admin/Search-income", text: "Search Income" },
            ].filter(Boolean))}
            {isModuleAccessible("hostel") && createExpandableSection("Hostel", <MdOutlineAddHomeWork />, [
              isChildAccessible("hostel.search") && { path: "/admin/search-hostel", text: "Search " },
              isChildAccessible("hostel.student_details") && { path: "/admin/student-hostel-details", text: "Student Hostel Details" },
              isChildAccessible("hostel.student_fee") && { path: "/admin/student-hostel-fee", text: "Student Hostel Fee " },
            ].filter(Boolean))}
            {isModuleAccessible("timetable") && createExpandableSection("TimeTable", <FaRegCalendarTimes />, [
              isChildAccessible("timetable.class") && { path: "/admin/class-time-table", text: "Class TimeTable" },
              isChildAccessible("timetable.teacher") && { path: "/admin/teacher-time-table", text: "Teacher TimeTable" },
            ].filter(Boolean))}
            {isModuleAccessible("lessonplan") && createExpandableSection("LessonPlan", <FaBookOpen />, [
              isChildAccessible("lessonplan.lesson_plan") && { path: "/admin/lesson-plan", text: "Lesson Plan" },
              isChildAccessible("lessonplan.teacher") && { path: "/admin/teacher-lesson-plan", text: "Teacher Lesson Plan" },
            ].filter(Boolean))}
            {isModuleAccessible("mentor") && createExpandableSection("Mentor", <PiChalkboardTeacher />, [
              isChildAccessible("mentor.assign") && { path: "/admin/assign-mentor", text: "Assign Mentor" },
              isChildAccessible("mentor.follow_ups") && { path: "/admin/follows-ups", text: "Follow Ups" },
              isChildAccessible("mentor.student_details") && { path: "/admin/student-details", text: "Student Details" },
            ].filter(Boolean))}
            {isModuleAccessible("academics") && createExpandableSection("Academics", <HiOutlineAcademicCap />, [
              isChildAccessible("academics.document_upload") && { path: "/admin/document-upload", text: "Document Upload" },
            ].filter(Boolean))}

            {isModuleAccessible("grievance") && createExpandableSection("Grievance", <LuBaggageClaim />, [
              isChildAccessible("grievance.student") && { path: "/admin/student-grievance", text: "Student Grievances" },
            ].filter(Boolean))}
            {isModuleAccessible("visitors") && createExpandableSection("Visitors", <FaPeopleGroup />, [
              isChildAccessible("visitors.list") && { path: "/admin/visitors-list", text: "Visitors List" },
            ].filter(Boolean))}
            {isModuleAccessible("mou") && createExpandableSection("MOU", <RiNewspaperLine />, [
              isChildAccessible("mou.list") && { path: "/admin/mou-list", text: "Mou List" },
            ].filter(Boolean))}
            {isModuleAccessible("training_placements") && createExpandableSection("Training and Placements", <ImOffice />, [
              isChildAccessible("training_placements.training") && { path: "/admin/training", text: "Training" },
            ].filter(Boolean))}
            {isModuleAccessible("inventory") && createExpandableSection("Inventory Management", <FaWarehouse />, [
              isChildAccessible("inventory.category") && { path: "/admin/inventory", text: "Inventory Category" },
              isChildAccessible("inventory.search") && { path: "/admin/inventory-search", text: "Inventory Search" },
            ].filter(Boolean))}
            {isModuleAccessible("role") && createExpandableSection("Role", <PersonAddOutlinedIcon />, [
              isChildAccessible("role.create_admin_user") && { path: "/admin/create-admin-user", text: "Create New Role" },
              isChildAccessible("role.change_password") && { path: "/admin/change-password", text: "Change Password" },
            ].filter(Boolean))}
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
              // {
              //   path: "/student/submit-application",
              //   text: "RTGS Submit Application",
              // },
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




