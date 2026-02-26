


import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Modal, Button } from "react-bootstrap";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

// Define session options
const sessionOptions = [
  { value: "2024-2025", label: "2024-2025" },
  { value: "2022-2023", label: "2022-2023" },
  { value: "2021-2022", label: "2021-2022" },
];

// Define events data
const eventsData = {
  "2024-2025": [
    {
      date: "2023-09-01",
      event: "Event 1 in 2023-2024",
      description: "Description for Event 1 in 2023-2024",
      venue: "Venue 1",
    },
    {
      date: "2023-10-15",
      event: "Event 2 in 2023-2024",
      description: "Description for Event 2 in 2023-2024",
      venue: "Venue 2",
    },
    {
      date: "2023-10-15",
      event: "Event 2 in 2023-2024",
      description: "Description for Event 2 in 2023-2024",
      venue: "Venue 2",
    },
    {
      date: "2023-10-15",
      event: "Event 2 in 2023-2024",
      description: "Description for Event 2 in 2023-2024",
      venue: "Venue 2",
    },
    {
      date: "2023-10-15",
      event: "Event 2 in 2023-2024",
      description: "Description for Event 2 in 2023-2024",
      venue: "Venue 2",
    },
    {
      date: "2023-10-15",
      event: "Event 2 in 2023-2024",
      description: "Description for Event 2 in 2023-2024",
      venue: "Venue 2",
    },
    {
      date: "2023-10-15",
      event: "Event 2 in 2023-2024",
      description: "Description for Event 2 in 2023-2024",
      venue: "Venue 2",
    },
    {
      date: "2023-10-15",
      event: "Event 2 in 2023-2024",
      description: "Description for Event 2 in 2023-2024",
      venue: "Venue 2",
    },
    {
      date: "2023-10-15",
      event: "Event 2 in 2023-2024",
      description: "Description for Event 2 in 2023-2024",
      venue: "Venue 2",
    },
    {
      date: "2023-10-15",
      event: "Event 2 in 2023-2024",
      description: "Description for Event 2 in 2023-2024",
      venue: "Venue 2",
    },
    
  ],
  "2022-2023": [
    {
      date: "2022-09-01",
      event: "Event 1 in 2022-2023",
      description: "Description for Event 1 in 2022-2023",
      venue: "Venue 3",
    },
    {
      date: "2022-10-15",
      event: "Event 2 in 2022-2023",
      description: "Description for Event 2 in 2022-2023",
      venue: "Venue 4",
    },
  ],
  "2021-2022": [
    {
      date: "2021-09-01",
      event: "Event 1 in 2021-2022",
      description: "Description for Event 1 in 2021-2022",
      venue: "Venue 5",
    },
    {
      date: "2021-10-15",
      event: "Event 2 in 2021-2022",
      description: "Description for Event 2 in 2021-2022",
      venue: "Venue 6",
    },
  ],
};

// Function to get the current session year
const getCurrentSessionYear = () => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  return `${currentYear}-${nextYear}`;
};

const SessionEvents = () => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // Set the current session year when the component mounts
    const currentSessionYear = getCurrentSessionYear();
    const session = sessionOptions.find(
      (option) => option.value === currentSessionYear
    );
    setSelectedSession(session);
  }, []);

  useEffect(() => {
    // Update the events when the selected session changes
    if (selectedSession) {
      setEvents(eventsData[selectedSession.value] || []);
    }
  }, [selectedSession]);

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  return (
    <Container
      style={{
        backgroundColor: "#F0F0F0",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <Row className="mt-5">
        <Col>
          <h3>Select Session Year</h3>
          <div style={{ width: "50%" }}>
            <Select
              options={sessionOptions}
              onChange={setSelectedSession}
              value={selectedSession}
              placeholder="Select Session Year"
              isClearable
            />
          </div>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Table
            striped
            bordered
            hover
            responsive
            style={{ border: "1px solid black" }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    backgroundColor: "#87CEEB",
                    fontWeight: "bold",
                    color: "black",
                    border: "1px solid #000",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    backgroundColor: "#87CEEB",
                    fontWeight: "bold",
                    color: "black",
                    border: "1px solid #000",
                  }}
                >
                  Event
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(event)}
                  style={{ cursor: "pointer" }}
                >
                  <td style={{ border: "1px solid black" }}>{event.date}</td>
                  <td style={{ border: "1px solid black" }}>{event.event}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Modal for displaying event details */}
      {selectedEvent && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Event Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Date:</strong> {selectedEvent.date}
            </p>
            <p>
              <strong>Event:</strong> {selectedEvent.event}
            </p>
            <p>
              <strong>Description:</strong> {selectedEvent.description}
            </p>
            <p>
              <strong>Venue:</strong> {selectedEvent.venue}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default SessionEvents;




