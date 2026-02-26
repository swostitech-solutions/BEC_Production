
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,

} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";

const StaffStudentBind = () => {
  const [classSessions, setClassSessions] = useState([]);
  const [classSession, setClassSession] = useState(null);
  const [subjectInput, setSubjectInput] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [submittedData, setSubmittedData] = useState([]);
  const [error, setError] = useState(null);
  const [attachedSubjects, setAttachedSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Validation state
  const [classSessionError, setClassSessionError] = useState("");
  const [subjectError, setSubjectError] = useState("");

  useEffect(() => {
    // fetchClassSessions();
    fetchSubjects();
    fetchAttachedSubjects();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${ApiUrl.apiurl}api/Course/GetAllCourse/`);
        const responseData = await response.json();

        if (
          responseData.message === "success" &&
          Array.isArray(responseData.data)
        ) {
          const classes = responseData.data.map((classInfo) => ({
            value: `${classInfo.class_name} - ${classInfo.section_class}`,
            label: `${classInfo.class_name} - ${classInfo.section_class}`,
          }));
          setClassSessions(classes);
        } else {
          console.error("Unexpected data format:", responseData);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);




  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${ApiUrl.apiurl}availablesubjectlist/`);
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }
      const data = await response.json();
      const formattedData = data.map((subject) => ({
        value: subject.id,
        label: `${subject.name}`,
      }));
      setSubjects(formattedData);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchAttachedSubjects = async () => {
    try {
      const response = await fetch(`${ApiUrl.apiurl}attachedsubjectlist/`);
      if (!response.ok) {
        throw new Error("Failed to fetch attached subjects");
      }
      const data = await response.json();
      setAttachedSubjects(data);
      setIsFormSubmitted(true); // Set form submitted to true after fetching data
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (index) => {
    // Handle edit functionality here
  };

  const handleDelete = async (index) => {
    try {
      const subjectIdToDelete = attachedSubjects[index].id;
      const response = await fetch(
        `${ApiUrl.apiurl}attachedsubjectdetached/${subjectIdToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete attached subject");
      }

      const updatedAttachedSubjects = attachedSubjects.filter(
        (subject) => subject.id !== subjectIdToDelete
      );
      setAttachedSubjects(updatedAttachedSubjects);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async () => {
    let hasError = false;

    // Reset previous error messages
    setClassSessionError("");
    setSubjectError("");

    // Validate class session
    if (!classSession) {
      setClassSessionError("Please select a class session.");
      hasError = true;
    }

    // Validate subject input
    if (subjectInput.length === 0) {
      setSubjectError("Please select at least one subject.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const response = await fetch(`${ApiUrl.apiurl}attach_subject_to_class/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classes: classSession.value,
          subject: subjectInput,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.subject[0]);
      }

      const newData = {
        classSession,
        subjects: subjectInput.map((id) => ({ value: id })),
      };
      setSubmittedData([...submittedData, newData]);
      setClassSession(null);
      setSubjectInput([]); // Clear the subject input after submission
      fetchAttachedSubjects();
      setIsFormSubmitted(true); // Show the table after form submission
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredSubjects = attachedSubjects.filter(
    (data) =>
      data.subject
        .join(", ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      data.classes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container
      fluid
      style={{
        border: "2px solid #ccc",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "20px",
        width: "98%",
      }}
    >
      {/* <ListGroup.Item
        className="subject-assign"
        style={{
          marginBottom: "40px",
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center", // Align form section header to the right
        }}
      >
       Class Bind With Subject
      </ListGroup.Item> */}
      <Form>
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group controlId="classSessionInput">
              <Row>
                <Col md={4} className="align-self-center">
                  <Form.Label style={{ marginBottom: "0", marginLeft: "70px" }}>
                    Class Session:
                  </Form.Label>
                </Col>
                <Col md={8}>
                  <Select
                    options={classSessions}
                    value={classSession}
                    onChange={(selectedOption) =>
                      setClassSession(selectedOption)
                    }
                    menuPlacement="auto"
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: "100%",
                      }),
                    }}
                  />
                  {classSessionError && (
                    <Form.Text className="text-danger">
                      {classSessionError}
                    </Form.Text>
                  )}
                </Col>
              </Row>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="subjectInput">
              <Row>
                <Col md={4} className="align-self-center">
                  <Form.Label
                    style={{ marginBottom: "0", marginLeft: "100px" }}
                  >
                    Subject:
                  </Form.Label>
                </Col>
                <Col md={8}>
                  <Select
                    options={subjects}
                    value={subjects.filter((subject) =>
                      subjectInput.includes(subject.value)
                    )}
                    onChange={(selectedOptions) =>
                      setSubjectInput(
                        selectedOptions.map((option) => option.value)
                      )
                    }
                    isMulti
                    menuPlacement="auto"
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: "100%",
                      }),
                    }}
                  />
                  {subjectError && (
                    <Form.Text className="text-danger">
                      {subjectError}
                    </Form.Text>
                  )}
                </Col>
              </Row>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <Button
              style={{ float: "right" }}
              variant="primary"
              onClick={handleSubmit}
              block
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>

      {isFormSubmitted && (
        <>
          <hr style={{ borderTop: "5px solid #ccc", margin: "20px 0" }} />

          <Row className="mb-4">
            <Col md={12}>
              <Form.Control
                style={{ width: "50%", float: "right" }}
                type="text"
                placeholder="Search by subject name or class"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
          </Row>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th
                  style={{
                    backgroundColor: "#87CEEB",
                    fontWeight: "bold",
                    color: "black",
                    border: "1px solid #000",
                    textAlign: "center", // Align table header to the right
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
                    textAlign: "center", // Align table header to the right
                  }}
                >
                  Classes
                </th>
                <th
                  style={{
                    backgroundColor: "#87CEEB",
                    fontWeight: "bold",
                    color: "black",
                    border: "1px solid #000",
                    textAlign: "center", // Align table header to the right
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((data, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #000", textAlign: "center" }}>
                    {data.subject.join(", ")}
                  </td>
                  <td style={{ border: "1px solid #000", textAlign: "center" }}>
                    {data.classes}
                  </td>
                  <td style={{ border: "1px solid #000", textAlign: "center" }}>
                    <Button
                      variant="info"
                      className="mr-2"
                      onClick={() => handleEdit(index)}
                    >
                      <FaEdit /> Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(index)}
                    >
                      <FaTrash /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default StaffStudentBind;
