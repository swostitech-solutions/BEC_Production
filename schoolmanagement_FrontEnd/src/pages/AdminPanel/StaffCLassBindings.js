import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";

import StaffClassBind from "../../components/StaffTabs/StaffCLassBinding/StaffStudentBind";
import StaffSubjectBind from "../../components/StaffTabs/StaffCLassBinding/StaffSubjectBind"

const StaffCLassBinding = () => {
  const [activeTab, setActiveTab] = useState("studentassign");

  return (
    <Tabs
      id="main-tabs"
      activeKey={activeTab}
      onSelect={(key) => setActiveTab(key)}
    >
      <Tab eventKey="studentassign" title="Student Assign">
        <StaffClassBind />
      </Tab>

      <Tab eventKey="subjectassign" title="Subject Assign">
        <StaffSubjectBind />
      </Tab>
    </Tabs>
  );
};

export default StaffCLassBinding;
