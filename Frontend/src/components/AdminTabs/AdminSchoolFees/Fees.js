// import * as React from "react";
// import Box from "@mui/material/Box";
// import Tab from "@mui/material/Tab";
// import TabContext from "@mui/lab/TabContext";
// import TabList from "@mui/lab/TabList";
// import TabPanel from "@mui/lab/TabPanel";
// import Quaterly from "./Quaterly";
// import FullPayment from "./FullPayment";

// export default function LabTabs() {
//   const [value, setValue] = React.useState("1");
//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };
//   return (
//     <Box sx={{ width: "100%", typography: "body1" }}>
//       <TabContext value={value}>
//         <Box
//           sx={{ borderBottom: 1, borderColor: "divider", textAlign: "center" }}
//         >
//           <TabList
//             onChange={handleChange}
//             aria-label="lab API tabs example"
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Tab label="QUARTERLY PAYMENT" value="1" />
//             <Tab label="FULL PAYMENT" value="2" />
//           </TabList>
//         </Box>
//         <TabPanel value="1">
//           <Quaterly />
//         </TabPanel>
//         <TabPanel value="2">
//           <FullPayment />
//         </TabPanel>
//       </TabContext>
//     </Box>
//   );
// }





import React, { useState } from "react";
import "./Fees.css"; // Import your CSS file for styling
import Quaterly from "./Quaterly";
import FullPayment from "./FullPayment";

export default function LabTabs() {
  const [value, setValue] = useState("1");

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <div className="lab-tabs-container">
      <div className="tab-header">
        <button
          className={`tab-button ${value === "1" ? "active" : ""}`}
          onClick={() => handleChange("1")}
        >
          QUARTERLY PAYMENT
        </button>
        <button
          className={`tab-button ${value === "2" ? "active" : ""}`}
          onClick={() => handleChange("2")}
        >
          FULL PAYMENT
        </button>
      </div>
      <div className="tab-content">
        {value === "1" && <Quaterly />}
        {value === "2" && <FullPayment />}
      </div>
    </div>
  );
}
