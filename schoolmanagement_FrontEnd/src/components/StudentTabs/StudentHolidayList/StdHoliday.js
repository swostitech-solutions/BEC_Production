import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Container, Form, Row, ListGroup, Spinner } from "react-bootstrap";
import { FiCalendar, FiGift } from "react-icons/fi";
import "./StdHoliday.css";
import { ApiUrl } from "../../../ApiUrl";
const HolidayCalender = () => {
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
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                Upcoming Events
              </p>
              <Form className="staff-holiday-form">
                <Form.Group className="mb-3 staff-holiday-search-bar">
                  <Form.Control
                    type="text"
                    placeholder="Search by Occasion or Date"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </Form.Group>
              </Form>
              <Row>
                {loading ? (
                  <div className="loading-spinner">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <Table
                    striped
                    bordered
                    hover
                    responsive
                    className="result-table-text-center"
                    style={{
                      border: "1px solid #000",
                      borderCollapse: "collapse", // important
                      marginTop: "20px"
                    }}
                  >

                    <thead style={{ border: "1px solid #000" }}>
                      <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
                        <th
                        >
                          <FiCalendar className="icon" /> Date
                        </th>
                        <th
                        >
                          <FiGift className="icon" /> Occasion
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.map((event) => (
                        <tr key={event.id}>
                          <td style={{ border: "1px solid #000", textAlign: "center" }}>
                            {event.date}
                          </td>
                          <td style={{ border: "1px solid #000", textAlign: "center" }}>
                            {event.Holiday_Name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HolidayCalender;