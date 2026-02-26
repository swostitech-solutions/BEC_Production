// import React, { useState } from "react";
// import { Tab, Tabs } from "react-bootstrap";
// import StaffClassBind from "../../components/StaffTabs/StaffCLassBinding/StaffStudentBind";
// import StaffSubjectBind from "../../components/StaffTabs/StaffCLassBinding/StaffSubjectBind"
// const StaffCLassBinding = () => {
//   const [activeTab, setActiveTab] = useState("studentassign");
//   const tabStyle = {
//     fontWeight: "bold",
//     fontSize: "1.2rem",
//   };
//   return (
//     <Tabs
//       id="main-tabs"
//       activeKey={activeTab}
//       onSelect={(key) => setActiveTab(key)}
//     >
//       <Tab
//         eventKey="studentassign"
//         title={<span style={tabStyle}>STUDENT ASSIGN</span>}
//       >
//         <StaffClassBind />
//       </Tab>
//       <Tab
//         eventKey="subjectassign"
//         title={<span style={tabStyle}>SUBJECT ASSIGN</span>}
//       >
//         <StaffSubjectBind />
//       </Tab>
//     </Tabs>
//   );
// };
// export default StaffCLassBinding;




import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import StaffClassBind from "../../components/StaffTabs/StaffCLassBinding/StaffStudentBind";
import StaffSubjectBind from "../../components/StaffTabs/StaffCLassBinding/StaffSubjectBind";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function StaffCLassBinding() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabStyle = {
    fontWeight: "bold",
    fontSize: "1.2rem", // Adjust the size as needed
  };

  const borderStyle = {
    border: "1px solid black", // Add border
    margin: "2px", // Space outside the border
    padding: "10px", // Add padding inside the border
  };

  return (
    <Box sx={{ width: "100%" }} style={borderStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        Staff Class Binding
      </h2>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="STUDENT ASSIGN" {...a11yProps(0)} style={tabStyle} />
          <Tab label="SUBJECT ASSIGN" {...a11yProps(1)} style={tabStyle} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <StaffClassBind /> {/* STUDENT ASSIGN content */}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <StaffSubjectBind /> {/* SUBJECT ASSIGN content */}
      </CustomTabPanel>
    </Box>
  );
}
