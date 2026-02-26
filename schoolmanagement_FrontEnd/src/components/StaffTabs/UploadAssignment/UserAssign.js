



import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Modal,
} from "react-bootstrap";
import Select from "react-select";
import { FaEdit, FaTrash } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./UserAssign.css";

const UserAssign = () => {
  const [classSessionOptions, setClassSessionOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [assignmentOptions, setAssignmentOptions] = useState([]);
  const [classSession, setClassSession] = useState(null);
  const [subject, setSubject] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
    ;
    const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
   const [errors, setErrors] = useState({});


    const handleSearch = () => {
      const filteredData = tableData.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setTableData(filteredData);
    };

  useEffect(() => {
    fetchClassSessions();
    fetchSubjects();
    fetchAssignments();
    fetchUserAssignments();
  }, []);

  const fetchClassSessions = async () => {
    try {
      // Mocking API call, replace with your actual fetch logic
      const data = [
        { id: 1, class_name: "Class 1", section: "A" },
        { id: 2, class_name: "Class 2", section: "B" },
        { id: 3, class_name: "Class 3", section: "C" },
      ];
      const mappedOptions = data.map((session) => ({
        value: session.id,
        label: `${session.class_name} - ${session.section}`,
      }));
      setClassSessionOptions(mappedOptions);
    } catch (error) {
      console.error("Error fetching class sessions:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      // Mocking API call, replace with your actual fetch logic
      const data = [
        { id: 1, subject_name: "Subject 1" },
        { id: 2, subject_name: "Subject 2" },
        { id: 3, subject_name: "Subject 3" },
      ];
      const mappedOptions = data.map((subject) => ({
        value: subject.id,
        label: subject.subject_name,
      }));
      setSubjectOptions(mappedOptions);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchAssignments = async () => {
    try {
      // Mocking API call, replace with your actual fetch logic
      const data = [
        { id: 1, assignment_name: "Assignment 1" },
        { id: 2, assignment_name: "Assignment 2" },
        { id: 3, assignment_name: "Assignment 3" },
      ];
      const mappedOptions = data.map((assignment) => ({
        value: assignment.id,
        label: assignment.assignment_name,
      }));
      setAssignmentOptions(mappedOptions);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const fetchUserAssignments = async () => {
    try {
      // Mocking API call, replace with your actual fetch logic
      const data = [
        {
          id: 1,
          class_session_id: 1,
          subject_id: 1,
          assignment_id: 1,
          start_date: "2024-05-10",
          end_date: "2024-05-20",
        },
        {
          id: 2,
          class_session_id: 2,
          subject_id: 2,
          assignment_id: 2,
          start_date: "2024-05-15",
          end_date: "2024-05-25",
        },
      ];
      setTableData(data);
    } catch (error) {
      console.error("Error fetching user assignments:", error);
    }
  };

  const handleSubmit = async () => {
   if (validateForm()) {
     try {
       // Mocking API call, replace with your actual fetch logic
       console.log("Class Session:", classSession);
       console.log("Subject:", subject);
       console.log("Assignment:", assignment);
       console.log("Start Date:", startDate);
       console.log("End Date:", endDate);
      alert("User assignment updated successfully!")
     } catch (error) {
       console.error("Error creating user assignment:", error);
     }
   } else {
    //  alert("Please fill in all fields before submitting.");
   }
  };

  
  const validateForm = () => {
    let errors = {};

    if (!classSession) {
      errors.classSession = "Please select a class session.";
    }
    if (!subject) {
      errors.subject = "Please select a subject.";
    }
    if (!assignment) {
      errors.assignment = "Please select an assignment.";
    }
    if (!startDate) {
      errors.startDate = "Please select a start date.";
    }
    if (!endDate) {
      errors.endDate = "Please select an end date.";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleEdit = (index) => {
    const selectedItem = tableData[index];
    setClassSession({
      value: selectedItem.class_session_id,
      label: `Class ${selectedItem.class_session_id}`,
    });
    setSubject({
      value: selectedItem.subject_id,
      label: `Subject ${selectedItem.subject_id}`,
    });
    setAssignment({
      value: selectedItem.assignment_id,
      label: `Assignment ${selectedItem.assignment_id}`,
    });
    setStartDate(new Date(selectedItem.start_date));
    setEndDate(new Date(selectedItem.end_date));
    setEditIndex(index);
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
  if (validateForm()) {
    try {
      // Mocking API call, replace with your actual fetch logic
      console.log("Updated Class Session:", classSession);
      console.log("Updated Subject:", subject);
      console.log("Updated Assignment:", assignment);
      console.log("Updated Start Date:", startDate);
      console.log("Updated End Date:", endDate);
      setShowEditModal(false);
      setEditIndex(null);
    } catch (error) {
      console.error("Error updating user assignment:", error);
    }
  } else {
    // alert("Please fill in all fields before submitting.");
  }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditIndex(null);
  };

  const handleDelete = async (index) => {
    try {
      // Mocking API call, replace with your actual fetch logic
      console.log("Deleted item:", tableData[index]);
    } catch (error) {
      console.error("Error deleting user assignment:", error);
    }
  };

  return (
    <Container
      style={{
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        marginBottom: "30px",
        backgroundColor: "#f2f2f2",
        border: "1px solid #ced4da",
        borderRadius: "5px",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>User Assign</h1>
      <br />
      <Row className="justify-content-center">
        <Col>
          <div className="mb-3">
            <Form>
              <Row>
                <Col md={4}>
                  <Form.Group controlId="assignment">
                    <Row>
                      <Col md={4} className="align-self-center">
                        <Form.Label className="mb-0">Assignment</Form.Label>
                      </Col>
                      <Col md={8}>
                        <Select
                          className="react-select-container"
                          classNamePrefix="react-select"
                          options={assignmentOptions}
                          value={assignment}
                          onChange={(selectedOption) =>
                            setAssignment(selectedOption)
                          }
                          menuPlacement="auto"
                          styles={{
                            container: (provided) => ({
                              ...provided,
                              width: "100%", // Adjust the width as needed
                            }),
                          }}
                        />
                        {errors.assignment && (
                          <div className="text-danger mt-1">
                            {errors.assignment}
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="subject">
                    <Row>
                      <Col md={4} className="align-self-center">
                        <Form.Label className="mb-0">Subject</Form.Label>
                      </Col>
                      <Col md={8}>
                        <Select
                          className="react-select-container"
                          classNamePrefix="react-select"
                          options={subjectOptions}
                          value={subject}
                          onChange={(selectedOption) =>
                            setSubject(selectedOption)
                          }
                          menuPlacement="auto"
                          styles={{
                            container: (provided) => ({
                              ...provided,
                              width: "100%", // Adjust the width as needed
                            }),
                          }}
                        />
                        {errors.subject && (
                          <Form.Text className="text-danger">
                            {errors.subject}
                          </Form.Text>
                        )}
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="className">
                    <Row>
                      <Col md={4} className="align-self-center">
                        <Form.Label className="mb-0">Class Name</Form.Label>
                      </Col>
                      <Col md={8}>
                        <Select
                          className="react-select-container"
                          classNamePrefix="react-select"
                          options={classSessionOptions}
                          value={classSession}
                          onChange={(selectedOption) =>
                            setClassSession(selectedOption)
                          }
                          menuPlacement="auto"
                          styles={{
                            container: (provided) => ({
                              ...provided,
                              width: "100%", // Adjust the width as needed
                            }),
                          }}
                        />
                        {errors.classSession && (
                          <Form.Text className="text-danger">
                            {errors.classSession}
                          </Form.Text>
                        )}
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
              </Row>
              <br />
              <Row className="mt-3">
                {" "}
                {/* Added margin-top class to this row */}
                <Col md={6}>
                  <Form.Group controlId="startDate">
                    <Form.Label>Start Date</Form.Label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="yyyy-MM-dd"
                      className="form-control detail"
                      minDate={new Date()}
                    />
                    <br />
                    {errors.startDate && (
                      <Form.Text className="text-danger">
                        {errors.startDate}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="endDate">
                    <Form.Label>End Date</Form.Label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      dateFormat="yyyy-MM-dd"
                      className="form-control detail"
                      minDate={new Date()}
                    />
                    <br />
                    {errors.endDate && (
                      <Form.Text className="text-danger">
                        {errors.endDate}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <br />
              <hr />
              <br />
              <Button
                style={{ float: "right" }}
                variant="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <br />
              <br />
              <br />
              <Form.Group
                controlId="searchFilter"
                style={{ width: "50%", height: "10%", float: "right" }}
              >
                <Form.Control
                  type="text"
                  placeholder="Enter search text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Form.Group>
              <br />
              <br />
            </Form>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col>
          <div className="table-container">
            {tableData.length > 0 && (
              <Table
                striped
                bordered
                hover
                responsive
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
                      Class Session
                    </th>
                    <th
                      style={{
                        backgroundColor: "#87CEEB",
                        fontWeight: "bold",
                        color: "black",
                        border: "1px solid #000",
                      }}
                    >
                      Subject
                    </th>
                    <th
                      style={{
                        backgroundColor: "#87CEEB",
                        fontWeight: "bold",
                        color: "black",
                        border: "1px solid #000",
                      }}
                    >
                      Assignment
                    </th>
                    <th
                      style={{
                        backgroundColor: "#87CEEB",
                        fontWeight: "bold",
                        color: "black",
                        border: "1px solid #000",
                      }}
                    >
                      Start Date
                    </th>
                    <th
                      style={{
                        backgroundColor: "#87CEEB",
                        fontWeight: "bold",
                        color: "black",
                        border: "1px solid #000",
                      }}
                    >
                      End Date
                    </th>
                    <th
                      style={{
                        backgroundColor: "#87CEEB",
                        fontWeight: "bold",
                        color: "black",
                        border: "1px solid #000",
                      }}
                    >
                      Edit
                    </th>
                    <th
                      style={{
                        backgroundColor: "#87CEEB",
                        fontWeight: "bold",
                        color: "black",
                        border: "1px solid #000",
                      }}
                    >
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((data, index) => (
                    <tr key={index}>
                      <td style={{ border: "1px solid #000" }}>
                        {data.class_session_id}
                      </td>
                      <td style={{ border: "1px solid #000" }}>
                        {data.subject_id}
                      </td>
                      <td style={{ border: "1px solid #000" }}>
                        {data.assignment_id}
                      </td>
                      <td style={{ border: "1px solid #000" }}>
                        {data.start_date}
                      </td>
                      <td style={{ border: "1px solid #000" }}>
                        {data.end_date}
                      </td>
                      <td style={{ border: "1px solid #000" }}>
                        <FaEdit
                          style={{ cursor: "pointer", marginRight: "10px" }}
                          onClick={() => handleEdit(index)}
                        />
                      </td>
                      <td style={{ border: "1px solid #000" }}>
                        <FaTrash
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Col>
      </Row>
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editClassSession">
              <Form.Label>Edit Class Session:</Form.Label>
              <Select
                options={classSessionOptions}
                value={classSession}
                onChange={(selectedOption) => setClassSession(selectedOption)}
              />
            </Form.Group>
            <Form.Group controlId="editSubject">
              <Form.Label>Edit Subject:</Form.Label>
              <Select
                options={subjectOptions}
                value={subject}
                onChange={(selectedOption) => setSubject(selectedOption)}
              />
            </Form.Group>

            <Form.Group controlId="editAssignment">
              <Form.Label>Edit Assignment:</Form.Label>
              <Select
                options={assignmentOptions}
                value={assignment}
                onChange={(selectedOption) => setAssignment(selectedOption)}
              />
            </Form.Group>
            <Form.Group controlId="editStartDate">
              <Form.Label>Edit Start Date:</Form.Label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                isClearable
                className="form-control detail"
              />
            </Form.Group>
            <Form.Group controlId="editEndDate">
              <Form.Label>Edit End Date:</Form.Label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                isClearable
                className="form-control detail"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserAssign;





