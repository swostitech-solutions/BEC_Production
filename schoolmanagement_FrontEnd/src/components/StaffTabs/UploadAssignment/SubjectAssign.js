


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
import "react-datepicker/dist/react-datepicker.css";

const SubjectAssign = () => {
  const [assignmentOptions, setAssignmentOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [subject, setSubject] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAssignment, setEditAssignment] = useState(null);
  const [editSubject, setEditSubject] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAssignments();
    fetchSubjects();
    fetchAssignToSubjectList();
  }, []);

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

  const fetchAssignToSubjectList = async () => {
    try {
      // Mocking API call, replace with your actual fetch logic
      const data = [
        { id: 1, assignment_name: "Assignment 1", subject_name: "Subject 1" },
        { id: 2, assignment_name: "Assignment 2", subject_name: "Subject 2" },
        { id: 3, assignment_name: "Assignment 3", subject_name: "Subject 3" },
      ];
      setTableData(data);
    } catch (error) {
      console.error("Error fetching AssignToSubject list:", error);
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Mocking API call, replace with your actual fetch logic
        console.log("Assignment:", assignment);
        console.log("Subject:", subject);

        // Assuming API response is successful and returns new item
        const newItem = {
          id: tableData.length + 1,
          assignment_name: assignment.label,
          subject_name: subject.label,
        };

        setTableData([...tableData, newItem]);
        resetForm();
        alert("Subject assigned successfully!");
      } catch (error) {
        console.error("Error creating AssignToSubject:", error);
      }
    } else {
      // Optional: Uncomment the line below if you want to alert the user
      // alert("Please select Assignment and Subject before submitting.");
    }
  };

  const handleEdit = (index) => {
    const selectedItem = tableData[index];
    setEditAssignment({
      value: selectedItem.assignment_id,
      label: selectedItem.assignment_name,
    });
    setEditSubject({
      value: selectedItem.subject_id,
      label: selectedItem.subject_name,
    });
    setEditIndex(index);
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (validateEditForm()) {
      try {
        // Mocking API call, replace with your actual fetch logic
        console.log("Updated Assignment:", editAssignment);
        console.log("Updated Subject:", editSubject);
        setShowEditModal(false);
        setEditAssignment(null);
        setEditSubject(null);
        setEditIndex(null);
      } catch (error) {
        console.error("Error updating AssignToSubject:", error);
      }
    } else {
      alert("Please enter Assignment and Subject before submitting.");
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditAssignment(null);
    setEditSubject(null);
    setEditIndex(null);
  };

  const handleDelete = async (index) => {
    try {
      // Mocking API call, replace with your actual fetch logic
      console.log("Deleted item:", tableData[index]);
      const updatedData = tableData.filter((_, i) => i !== index);
      setTableData(updatedData);
    } catch (error) {
      console.error("Error deleting AssignToSubject:", error);
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!assignment) {
      errors.assignment = "Please select an assignment.";
      isValid = false;
    }

    if (!subject) {
      errors.subject = "Please select a subject.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const validateEditForm = () => {
    const errors = {};
    let isValid = true;

    if (!editAssignment) {
      errors.editAssignment = "Please select an assignment.";
      isValid = false;
    }

    if (!editSubject) {
      errors.editSubject = "Please select a subject.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const resetForm = () => {
    setAssignment(null);
    setSubject(null);
    setErrors({});
  };

  const filteredTableData = tableData.filter((data) => {
    const lowercasedSearchQuery = searchQuery.toLowerCase();
    return (
      data.assignment_name.toLowerCase().includes(lowercasedSearchQuery) ||
      data.subject_name.toLowerCase().includes(lowercasedSearchQuery)
    );
  });

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
      <h1 style={{ textAlign: "center", marginBottom: "50px" }}>
        Subject Assign
      </h1>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Form.Group
            controlId="assignment"
            className="input-select-staff-view-attendance"
          >
            <Row>
              <Col md={4} className="align-self-center">
                <Form.Label className="mb-1" style={{ marginBottom: "2px", marginLeft:"80px" }}>
                  Assignment
                </Form.Label>
              </Col>
              <Col md={8} style={{ display: "flex", alignItems: "center" }}>
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={assignmentOptions}
                  value={assignment}
                  onChange={(selectedOption) => setAssignment(selectedOption)}
                  menuPlacement="auto"
                  styles={{
                    container: (provided) => ({
                      ...provided,
                      width: "100%",
                    }),
                    control: (provided) => ({
                      ...provided,
                      minHeight: "32px", // Reduce height if needed
                    }),
                  }}
                />
                {errors.assignment && (
                  <Form.Text className="text-danger">
                    {errors.assignment}
                  </Form.Text>
                )}
              </Col>
            </Row>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group
            controlId="subject"
            className="input-select-staff-view-attendance"
          >
            <Row>
              <Col md={4} className="align-self-center">
                <Form.Label className="mb-1" style={{ marginBottom: "2px",marginLeft:"100px" }}>
                  Subject
                </Form.Label>
              </Col>
              <Col md={8} style={{ display: "flex", alignItems: "center" }}>
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={subjectOptions}
                  value={subject}
                  onChange={(selectedOption) => setSubject(selectedOption)}
                  menuPlacement="auto"
                  styles={{
                    container: (provided) => ({
                      ...provided,
                      width: "100%",
                    }),
                    control: (provided) => ({
                      ...provided,
                      minHeight: "32px", // Reduce height if needed
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
      </Row>
      <br />
      <hr style={{ borderTop: "1px solid #000" }} />
      <Button
        style={{ width: "100px", height: "40px", float: "right" }}
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
      <br />
      {filteredTableData.length > 0 && (
        <div>
          <Table
            striped
            bordered
            hover
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
              {filteredTableData.map((data, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #000" }}>
                    {data.assignment_name}
                  </td>
                  <td style={{ border: "1px solid #000" }}>
                    {data.subject_name}
                  </td>
                  <td style={{ border: "1px solid #000" }}>
                    <Button variant="info" onClick={() => handleEdit(index)}>
                      Edit
                    </Button>
                  </td>
                  <td style={{ border: "1px solid #000" }}>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header>
          <Modal.Title>Edit Assignment and Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editAssignment">
              <Form.Label className="mb-1" style={{ marginBottom: "5px" }}>
                Assignment:
              </Form.Label>
              <Select
                options={assignmentOptions}
                value={editAssignment}
                onChange={(selectedOption) => setEditAssignment(selectedOption)}
              />
            </Form.Group>
            <Form.Group controlId="editSubject">
              <Form.Label className="mb-1" style={{ marginBottom: "5px" }}>
                Subject:
              </Form.Label>
              <Select
                options={subjectOptions}
                value={editSubject}
                onChange={(selectedOption) => setEditSubject(selectedOption)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Discard
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SubjectAssign;