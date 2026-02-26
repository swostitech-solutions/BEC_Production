import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Form,
  Button,
  Table,
  Pagination,
  Modal,
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";

const LeaveLimit = () => {
  const [leaveTypeOptions, setLeaveTypeOptions] = useState([]);
  const [leaveType, setLeaveType] = useState(null);
  const [leaveTypeLimits, setLeaveTypeLimits] = useState("");
  const [description, setDescription] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredAttendanceData, setFilteredAttendanceData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [leaveTypeError, setLeaveTypeError] = useState("");
  const [leaveTypeLimitsError, setLeaveTypeLimitsError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [showTable, setShowTable] = useState(true); // State to control table visibility
  const [showModal, setShowModal] = useState(false);
  const [modalLeaveType, setModalLeaveType] = useState(null);
  const [modalLeaveTypeLimits, setModalLeaveTypeLimits] = useState("");
  const [modalDescription, setModalDescription] = useState("");

  const generateRandomData = () => {
    const names = ["John Doe", "Jane Doe", "Alice Smith", "Bob Johnson"];
    const rollNumbers = ["A123", "B456", "C789", "D012"];

    const randomIndex = Math.floor(Math.random() * names.length);
    return {
      studentName: names[randomIndex],
      rollNumber: rollNumbers[randomIndex],
    };
  };

  // const handleModalClose = () => setShowModal(false);
  const handleModalClose = () => {
    setShowModal(false);
    setModalLeaveType(null);
    setModalLeaveTypeLimits("");
    setModalDescription("");
  };

  // Fetch leave limits function

  useEffect(() => {
    // Fetch leave type data from API
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}api/LeaveType/GetAllLeaveType/`
      );
      const data = await response.json();

      if (data.message === "success" && Array.isArray(data.data)) {
        const formattedData = data.data.map((type) => ({
          value: type.id,
          label: type.leave_type,
        }));
        setLeaveTypeOptions(formattedData);
      }
    } catch (error) {
      console.error("Error fetching leave types:", error);
    }
  };

  const handleCreate = async () => {
    // Reset errors
    setLeaveTypeError("");
    setLeaveTypeLimitsError("");
    setDescriptionError("");

    // Validate fields
    if (!leaveType) {
      setLeaveTypeError("Leave type is required");
      return;
    }
    if (!leaveTypeLimits) {
      setLeaveTypeLimitsError("Leave type limits are required");
      return;
    }
    if (!description) {
      setDescriptionError("Description is required");
      return;
    }

    const newAttendance = {
      login_id: 1, // Replace with the actual login ID integer
      leave_type: leaveType.value,
      leave_limit: leaveTypeLimits,
      description,
      appliedOn: new Date().toLocaleDateString(),
      status: Math.random() < 0.5 ? "Approved" : "Pending",
      authorityReply: "",
      ...generateRandomData(),
    };

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}api/LeaveLimit/LeaveLimitcreate/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAttendance),
        }
      );

      // Throw an error if the response is not OK
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      // Directly update state with new data if the result is valid
      const newEntry = {
        id: result.data.id, // Assuming API returns the new record's ID
        leaveTypeName: leaveType.label,
        leaveTypeLimits: leaveTypeLimits,
        description: description,
      };
      setAttendanceData((prevData) => [newEntry, ...prevData]);
      setFilteredAttendanceData((prevData) => [newEntry, ...prevData]);

      // Reset the form fields
      setLeaveType(null);
      setLeaveTypeLimits("");
      setDescription("");
    } catch (error) {
      console.error("Error saving leave limit:", error);
    }
  };

  const fetchLeaveLimits = async () => {
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}api/LeaveLimit/GetAllLeaveLimit/`
      );
      const data = await response.json();
      if (data.message === "success" && Array.isArray(data.data)) {
        const formattedData = data.data.map((item) => ({
          ...item,
          leaveTypeName: item.leave_type || "N/A",
          leaveTypeLimits: item.leave_limit || "N/A",
        }));
        setAttendanceData(formattedData);
        setFilteredAttendanceData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching leave limits:", error);
    }
  };

  // Fetch leave limits on component mount
  useEffect(() => {
    fetchLeaveLimits();
  }, []);

  const handleEditSave = async () => {
    const Id = JSON.parse(localStorage.getItem("loginId"));
    console.log(Id);
    if (!modalLeaveType || !modalLeaveTypeLimits || !modalDescription) {
      console.error("All fields are required.");
      return;
    }

    const updatedAttendance = {
      login_id: Id,
      leave_type: modalLeaveType.value,
      leave_limit: modalLeaveTypeLimits,
      description: modalDescription,
      is_active: false,
      created_by: Id,
    };

    console.log("Payload for update:", updatedAttendance);

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}api/LeaveLimit/updateLeaveLimit/${currentEditId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAttendance),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API response:", result);

      if (result.message === "success") {
        fetchLeaveLimits();
        handleModalClose();
      } else {
        console.error("Failed to update leave limit:", result.message);
      }
    } catch (error) {
      console.error("Error updating leave limit:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this leave limit?")) {
      try {
        const response = await fetch(
          `${ApiUrl.apiurl}api/LeaveLimit/deleteLeaveLimit/${id}/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result, attendanceData);
        const updatedLeave = attendanceData.filter((leave) => leave.id !== id);
        setAttendanceData(updatedLeave);
      } catch (error) {
        console.error("Error deleting leave limit:", error);
      }
    }
  };
  const handleSearchInputChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    setSearchText(searchText);

    // Filter attendance data based on search input
    const filteredData = attendanceData.filter((attendance) => {
      // Ensure each field is a string before calling toLowerCase
      const leaveType = (attendance.leaveTypeName || "")
        .toString()
        .toLowerCase();
      const leaveTypeLimits = (attendance.leaveTypeLimits || "")
        .toString()
        .toLowerCase();
      const description = (attendance.description || "")
        .toString()
        .toLowerCase();

      return (
        leaveType.includes(searchText) ||
        leaveTypeLimits.includes(searchText) ||
        description.includes(searchText)
      );
    });

    setFilteredAttendanceData(filteredData);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchText
    ? filteredAttendanceData.slice(indexOfFirstItem, indexOfLastItem)
    : attendanceData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container
      className="container-staff-view-attendance"
      style={{ border: "1px solid #ddd", backgroundColor: "#F0F0F0" }}
    >
      {/* Row for "Add Details" */}
      <Row>
        <ListGroup
          className="mb-4"
          style={{
            border: "1px solid #ddd",
            borderRadius: "5px",
            marginBottom: "20px", // Add some margin at the bottom
          }}
        ></ListGroup>{" "}
        <ListGroup.Item
          style={{
            fontSize: "2em", // Increased font size
            fontWeight: "bold", // Made text bold
            marginBottom: "30px",
            textAlign: "center", // Increased margin-bottom for more space
          }}
        >
          Leave Limit
        </ListGroup.Item>
      </Row>
      <br /> {/* Added <br> tag for space */}
      {/* Row for form inputs */}
      <Row>
        <Col md={4}>
          <Form.Group
            controlId="leaveType"
            className="input-select-staff-view-attendance"
          >
            <Row>
              <Col md={4} className="align-self-center">
                <Form.Label
                  className="mb-0"
                  style={{ fontSize: "1.2em", fontWeight: "bold" }}
                >
                  Leave Type
                </Form.Label>
              </Col>
              <Col md={8}>
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={leaveTypeOptions}
                  value={leaveType}
                  onChange={(selected) => setLeaveType(selected)}
                  menuPlacement="auto"
                  placeholder="SelectLeaveType"
                />
                {leaveTypeError && (
                  <Form.Text className="text-danger">
                    {leaveTypeError}
                  </Form.Text>
                )}
              </Col>
            </Row>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group
            controlId="leaveTypeLimits"
            className="input-select-admin-leave-limit"
          >
            <Row>
              <Col md={4} className="align-self-center">
                <Form.Label
                  className="mb-0"
                  style={{
                    fontSize: "1.2em",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Leave Limits
                </Form.Label>
              </Col>
              <Col md={8}>
                <Form.Control
                  type="text"
                  value={leaveTypeLimits}
                  onChange={(e) => setLeaveTypeLimits(e.target.value)}
                  placeholder="Enter Leave Type Limits"
                />
                {leaveTypeLimitsError && (
                  <Form.Text className="text-danger">
                    {leaveTypeLimitsError}
                  </Form.Text>
                )}
              </Col>
            </Row>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group
            controlId="description"
            className="input-select-admin-leave-limit"
          >
            <Row>
              <Col md={4} className="align-self-center">
                <Form.Label
                  className="mb-0"
                  style={{ fontSize: "1.2em", fontWeight: "bold" }}
                >
                  Description
                </Form.Label>
              </Col>
              <Col md={8}>
                <Form.Control
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Description"
                />
                {descriptionError && (
                  <Form.Text className="text-danger">
                    {descriptionError}
                  </Form.Text>
                )}
              </Col>
            </Row>
          </Form.Group>
        </Col>
        <Row>
          <Col className="text-center">
            <Button
              variant="primary"
              className="custom-button-admin-leave-limit"
              style={{ float: "right" }}
              onClick={editMode ? handleEditSave : handleCreate}
            >
              {editMode ? "Update" : "Save"}
            </Button>
          </Col>
        </Row>
      </Row>
      {/* Conditionally render horizontal line */}
      {showTable && <hr style={{ border: "1px solid #000" }} />}
      {/* Conditionally render search bar and table based on showTable state */}
      {showTable && (
        <>
          {/* Row for search bar */}
          <Row className="mb-4">
            <Col md={12} className="d-flex justify-content-end">
              <Form.Control
                type="text"
                placeholder="Search by any field..."
                value={searchText}
                onChange={handleSearchInputChange}
                style={{ maxWidth: "50%" }} // Adjust width as needed
              />
            </Col>
          </Row>

          {/* Row for table */}
          <Row>
            <Col>
              <Table
                striped
                bordered
                hover
                responsive
                style={{ border: "1px solid #000" }}
                className="custom-table-staff-leave text-center"
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
                      Leave Type
                    </th>
                    <th
                      style={{
                        backgroundColor: "#87CEEB",
                        fontWeight: "bold",
                        color: "black",
                        border: "1px solid #000",
                      }}
                    >
                      Leave Limits
                    </th>
                    <th
                      style={{
                        backgroundColor: "#87CEEB",
                        fontWeight: "bold",
                        color: "black",
                        border: "1px solid #000",
                      }}
                    >
                      Description
                    </th>
                    <th
                      style={{
                        backgroundColor: "#87CEEB",
                        fontWeight: "bold",
                        color: "black",
                        border: "1px solid #000",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <pre>
                    {console.log(modalLeaveType, currentItems, "hiiiii")}
                  </pre>
                  {currentItems.map((attendance) => (
                    <tr key={attendance.id}>
                      <td style={{ border: "1px solid #000" }}>
                        {attendance.leaveTypeName}
                      </td>
                      <td style={{ border: "1px solid #000" }}>
                        {attendance.leaveTypeLimits}
                      </td>
                      <td style={{ border: "1px solid #000" }}>
                        {attendance.description}
                      </td>
                      <td style={{ border: "1px solid #000" }}>
                        <Button
                          variant="warning"
                          onClick={() => {
                            setModalLeaveType({
                              value: attendance.leave_type_id, // Use the correct leave type ID
                              label: attendance.leave_type,
                            });
                            setModalLeaveTypeLimits(attendance.leave_limit);
                            setModalDescription(attendance.description);
                            setCurrentEditId(attendance.id);
                            setShowModal(true);
                          }}
                        >
                          <FaEdit />
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() => handleDelete(attendance.id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>

          {/* Row for pagination */}
          <Row className="justify-content-center">
            <Col md="auto">
              <Pagination>
                {Array.from(
                  {
                    length: Math.ceil(
                      searchText
                        ? filteredAttendanceData.length / itemsPerPage
                        : attendanceData.length / itemsPerPage
                    ),
                  },
                  (_, index) => (
                    <Pagination.Item
                      key={index}
                      active={index + 1 === currentPage}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  )
                )}
              </Pagination>
            </Col>
          </Row>
        </>
      )}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Leave Limit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Leave Type</Form.Label>
              <Select
                value={modalLeaveType}
                onChange={(option) => setModalLeaveType(option)}
                options={leaveTypeOptions}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Leave Type Limits</Form.Label>
              <Form.Control
                type="number"
                value={modalLeaveTypeLimits}
                onChange={(e) => setModalLeaveTypeLimits(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={modalDescription}
                onChange={(e) => setModalDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LeaveLimit;