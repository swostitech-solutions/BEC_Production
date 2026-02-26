import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import UploadAssignments from "../../components/StaffTabs/UploadAssignment/UploadAssignments";
import SubjectAssign from "../../components/StaffTabs/UploadAssignment/SubjectAssign";
import UserAssign from "../../components/StaffTabs/UploadAssignment/UserAssign";

const UploadAssignment = () => {
  const [activeTab, setActiveTab] = useState("uploadassignments");

  return (
    <Tabs
      id="main-tabs"
      activeKey={activeTab}
      onSelect={(key) => setActiveTab(key)}
    >
      <Tab eventKey="uploadassignments" title="Upload Assignment">
        <UploadAssignments />
      </Tab>

      <Tab eventKey="subjectassign" title="Subject Assign">
        <SubjectAssign />
      </Tab>

      <Tab eventKey="userassign" title="User Assign">
        <UserAssign/>
      </Tab>
      {/* Add more tabs here if needed */}
    </Tabs>
  );
};

export default UploadAssignment;