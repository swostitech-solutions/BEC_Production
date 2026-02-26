// import React from "react";
// import ViewAttendance from "../../components/StaffTabs/StaffViewAttendance/ViewAttendance"

// const ViewStudentAttendance = () => {
//   return (
//     <div>

//       <ViewAttendance/>
//     </div>
//   );
// };

// export default ViewStudentAttendance;

import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import AdminStudentAttendanceView from "../../components/AdminTabs/AdminStudentAttendanceView/AdmStudentAttendanceView"
import AdmStudentAttendance from "../../components/AdminTabs/AdminStudentAttendanceView/AdmStudentView"

const ViewStudentAttendance = () => {
  const [activeTab, setActiveTab] = useState("ViewAttendance");
  return (
    <Tabs
      id="main-tabs"
      activeKey={activeTab}
      onSelect={(key) => setActiveTab(key)}
    >
      <Tab eventKey="ViewAttendance" title="ViewAttendance">
        <AdminStudentAttendanceView />
      </Tab>

      <Tab eventKey="student" title="Student">
        <AdmStudentAttendance />
      </Tab>
    </Tabs>
  );
};

export default ViewStudentAttendance;

// import React, { useState } from "react";
// import { Tab, Tabs } from "react-bootstrap";
// import ResultPublishs from "../../components/StaffTabs/ResultPublish/ResultPublishs";
// import Result from "../../components/StaffTabs/ResultPublish/Result";

// const ResultPublish = () => {
//   const [activeTab, setActiveTab] = useState("resultPublishs");

//   return (

//       <Tabs
//         id="main-tabs"
//         activeKey={activeTab}
//         onSelect={(key) => setActiveTab(key)}
//       >
//         <Tab eventKey="resultPublishs" title="Result Publishs">
//           <ResultPublishs />
//         </Tab>

//         <Tab eventKey="result" title="Result">
//           <Result />
//         </Tab>

//         {/* Add more tabs here if needed */}
//       </Tabs>

//   );
// };

// export default ResultPublish;
