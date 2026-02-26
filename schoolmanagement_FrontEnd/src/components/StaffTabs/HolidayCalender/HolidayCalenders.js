// HolidayCalender.jsx
import React from "react";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import "./HolidayCalenders.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const timeSlots = {
  morning: ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00"],
  afternoon: ["01:00 - 02:00", "02:00 - 03:00", "03:00 - 04:00", "04:00 - 05:00"]
};

const schedule = {
  Monday: ["Math", "Physics", "Break", "Biology", "English", "Chemistry", "Free", "History"],
  Tuesday: ["English", "Chemistry", "Break", "Math", "Physics", "Free", "Biology", "History"],
  Wednesday: ["Chemistry", "Math", "Break", "Physics", "English", "Biology", "History", "Free"],
  Thursday: ["Biology", "History", "Break", "Chemistry", "Math", "Free", "Physics", "English"],
  Friday: ["Physics", "English", "Break", "Math", "Chemistry", "Biology", "History", "Free"]
};

const subjectClassMap = {
  Math: "primary",
  Physics: "info",
  Chemistry: "danger",
  English: "warning",
  Biology: "success",
  History: "secondary",
  Break: "light text-muted",
  Free: "dark text-white"
};

const HolidayCalender = () => {
  const renderTable = (shift, timeArr, startIndex) => (
    <Card className="mb-5 border-0 rounded-4 shadow-lg overflow-hidden">
      <Card.Header className="text-white p-4 timetable-header">
        <h5 className="m-0 fw-bold text-uppercase">{shift} Shift</h5>
        <small className="opacity-75">Timings: {timeArr[0]} to {timeArr[timeArr.length - 1]}</small>
      </Card.Header>

      <div className="table-responsive">
        <Table className="table-timetable mb-0 text-center align-middle">
          <thead>
            <tr className="table-head-row">
              <th className="timetable-time-col">Time</th>
              {days.map((day) => (
                <th key={day} className="text-uppercase">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeArr.map((time, i) => (
              <tr key={time}>
                <td className="fw-semibold">{time}</td>
                {days.map((day) => {
                  const subject = schedule[day][startIndex + i];
                  const variant = subjectClassMap[subject] || "secondary";
                  return (
                    <td key={`${day}-${time}`}>
                      <Badge bg={variant} className="badge-subject">{subject}</Badge>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );

  return (
    <Container className="py-5">
      <Row className="text-center mb-5">
        <Col>
          <h2 className="fw-bold text-primary display-6">📚 Teacher Weekly Timetable</h2>
          <p className="text-muted">Academic Year 2025-2026</p>
        </Col>
      </Row>
      <Row>
        <Col>{renderTable("Morning", timeSlots.morning, 0)}</Col>
      </Row>
      <Row>
        <Col>{renderTable("Afternoon", timeSlots.afternoon, 4)}</Col>
      </Row>
    </Container>
  );
};

export default HolidayCalender;
