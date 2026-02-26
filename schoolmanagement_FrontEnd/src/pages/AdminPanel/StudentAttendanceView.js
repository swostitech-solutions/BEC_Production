import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import AdmStaffViewStudentAttendance from "../../components/AdminTabs/AdminStaffViewStudentAttendance/AdmStaffViewStudentAttendance"
import AdmIndivisualStudent from "../../components/AdminTabs/AdminStaffViewStudentAttendance/AdmIndivisualStudent";

const ViewStudentAttendance = () => {
  const [activeTab, setActiveTab] = useState("ViewAttendance");
  return (
    <Tabs
      id="main-tabs"
      activeKey={activeTab}
      onSelect={(key) => setActiveTab(key)}
    >
      <Tab eventKey="ViewAttendance" title="ViewAttendance">
        <AdmStaffViewStudentAttendance />
      </Tab>

      <Tab eventKey="student" title="Student">
        <AdmIndivisualStudent />
      </Tab>
    </Tabs>
  );
};

export default ViewStudentAttendance;
