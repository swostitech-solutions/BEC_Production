import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Container, Form, Row, ListGroup, Spinner } from "react-bootstrap";
import { FiCalendar, FiGift } from "react-icons/fi";
import "./AdmStudentHolidayList.css";
import { ApiUrl } from "../../../ApiUrl";

const StdHoliday = () => {
  const [eventData, setEventData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${ApiUrl.apiurl}api/Holiday/GetAllHoliday/`
        );
        const result = await response.json();
        console.log("API response:", result); // Log the response for debugging

        if (result.message === "success" && Array.isArray(result.data)) {
          setEventData(result.data);
        } else {
          console.error("Unexpected response format:", result);
        }
      } catch (error) {
        console.error("API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEvents = eventData.filter(
    (event) =>
      (event.Holiday_Name &&
        event.Holiday_Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.date &&
        event.date.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  console.log("Filtered Events:", filteredEvents); // Log filtered events for debugging

  return (
    <Container
      style={{
        border: "1px solid #ccc",
        backgroundColor: "#f0f0f0",
        width: "80%",
        marginTop: "10px",
      }}
    >
      <Row>
        <ListGroup.Item
          className="list-group-heading-std-assignment"
          style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}
        >
          Upcoming Events
        </ListGroup.Item>
        <Form className="std-assignment-form">
          <br />
          <Form.Group className="mb-3" style={{ border: "1px solid #000" }}>
            <Form.Control
              type="text"
              placeholder="Search by Occasion or Date"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Form.Group>
        </Form>
      </Row>
      <br />
      <Row>
        {loading ? (
          <div style={{ textAlign: "center", width: "100%" }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table
            striped
            bordered
            hover
            responsive
            className="custom-table-staff-holiday text-center"
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
                  <FiCalendar className="icon" /> Date
                </th>
                <th
                  style={{
                    backgroundColor: "#87CEEB",
                    fontWeight: "bold",
                    color: "black",
                    border: "1px solid #000",
                  }}
                >
                  <FiGift className="icon" /> Occasion
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td style={{ border: "1px solid black" }}>{event.date}</td>
                  <td style={{ border: "1px solid black" }}>
                    {event.Holiday_Name}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Row>
    </Container>
  );
};

export default StdHoliday;
