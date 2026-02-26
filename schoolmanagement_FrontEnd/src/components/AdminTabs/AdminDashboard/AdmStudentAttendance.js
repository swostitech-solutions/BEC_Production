import React from "react";
import { Navbar, Dropdown, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

const AdmStudentAttendance = () => {
  const handleViewClick = () => {
    window.location.href = "/admin/staff-view-student-attendance";
  };
  const data = [
    // { value: 5, label: 'A' },
    // { value: 10, label: 'B' },
    { value: 100, label: "Present" },
    { value: 15, label: "Absent" },
  ];

  const size = {
    width: 330,
    height: 200,
  };
  return (
    <div>
      <Navbar bg="primary" variant="dark" style={{ padding: "5px 10px" }}>
        <Navbar.Brand>Student Attendance</Navbar.Brand>
      </Navbar>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <Dropdown style={{ marginRight: "10px" }}>
          <Dropdown.Toggle variant="success" id="dropdown-class">
            Class
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Class 1</Dropdown.Item>
            <Dropdown.Item>Class 2</Dropdown.Item>
            <Dropdown.Item>Class 3</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-subject">
            Subject
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Subject 1</Dropdown.Item>
            <Dropdown.Item>Subject 2</Dropdown.Item>
            <Dropdown.Item>Subject 3</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <PieChart
  series={[
    {
      arcLabel: (item) => `${item.label} (${item.value})`,
      arcLabelMinAngle: 45,
      data,
      fill: ({ label }) => (label === 'Present' ? 'green' : 'red'),
    },
  ]}
  sx={{
    [`& .${pieArcLabelClasses.root}`]: {
      fill: 'white',
      fontWeight: 'bold',
    },
  }}
  {...size}
/>


      <div style={{ display: "flex", justifyContent: "flex-end", margin: "0" }}>
        <Button variant="primary" onClick={handleViewClick}>
          View
        </Button>
      </div>
    </div>
  );
};

export default AdmStudentAttendance;
