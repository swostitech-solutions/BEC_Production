import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  ListGroup,
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";

const StaffStudentBind = () => {
  const [classSessions, setClassSessions] = useState([]);
  const [classSession, setClassSession] = useState(null);
  const [studentInput, setStudentInput] = useState([]); // Changed from subjectInput to studentInput
  const [students, setStudents] = useState([]); // Changed from subjects to students
  const [submittedData, setSubmittedData] = useState([]);
  const [error, setError] = useState(null);
  const [attachedStudents, setAttachedStudents] = useState([]); // Changed from attachedSubjects to attachedStudents
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Validation state
  const [classSessionError, setClassSessionError] = useState("");
  const [studentError, setStudentError] = useState(""); // Changed from subjectError to studentError

  useEffect(() => {
    fetchStudents(); // Changed from fetchSubjects to fetchStudents
    fetchAttachedStudents(); // Changed from fetchAttachedSubjects to fetchAttachedStudents
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

  const fetchStudents = async () => {
    // Changed from fetchSubjects to fetchStudents
    try {
      const response = await fetch(`${ApiUrl.apiurl}availablestudentlist/`); // API URL changed for students
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      const formattedData = data.map((student) => ({
        value: student.id,
        label: `${student.name}`,
      }));
      setStudents(formattedData); // Changed from setSubjects to setStudents
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchAttachedStudents = async () => {
    // Changed from fetchAttachedSubjects to fetchAttachedStudents
    try {
      const response = await fetch(`${ApiUrl.apiurl}attachedstudentlist/`); // API URL changed for attached students
      if (!response.ok) {
        throw new Error("Failed to fetch attached students");
      }
      const data = await response.json();
      setAttachedStudents(data); // Changed from setAttachedSubjects to setAttachedStudents
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
      const studentIdToDelete = attachedStudents[index].id; // Changed from subjectIdToDelete to studentIdToDelete
      const response = await fetch(
        `${ApiUrl.apiurl}attachedstudentdetached/${studentIdToDelete}`, // API URL changed for deleting students
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete attached student");
      }

      const updatedAttachedStudents = attachedStudents.filter(
        (student) => student.id !== studentIdToDelete
      );
      setAttachedStudents(updatedAttachedStudents); // Changed from setAttachedSubjects to setAttachedStudents
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async () => {
    let hasError = false;

    // Reset previous error messages
    setClassSessionError("");
    setStudentError(""); // Changed from setSubjectError to setStudentError

    // Validate class session
    if (!classSession) {
      setClassSessionError("Please select a class session.");
      hasError = true;
    }

    // Validate student input
    if (studentInput.length === 0) {
      // Changed from subjectInput to studentInput
      setStudentError("Please select at least one student."); // Changed error message
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const response = await fetch(`${ApiUrl.apiurl}attach_student_to_class/`, {
        // API URL changed for submitting students
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classes: classSession.value,
          student: studentInput, // Changed from subjectInput to studentInput
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.student[0]); // Changed from errorResponse.subject to errorResponse.student
      }

      const newData = {
        classSession,
        students: studentInput.map((id) => ({ value: id })), // Changed from subjects to students
      };
      setSubmittedData([...submittedData, newData]);
      setClassSession(null);
      setStudentInput([]); // Clear the student input after submission
      fetchAttachedStudents(); // Changed from fetchAttachedSubjects to fetchAttachedStudents
      setIsFormSubmitted(true); // Show the table after form submission
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredStudents = attachedStudents.filter(
    // Changed from filteredSubjects to filteredStudents
    (data) =>
      data.student
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
        Class Bind With Student
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
            <Form.Group controlId="studentInput">
              {" "}
              {/* Changed from subjectInput to studentInput */}
              <Row>
                <Col md={4} className="align-self-center">
                  <Form.Label
                    style={{ marginBottom: "0", marginLeft: "100px" }}
                  >
                    Student: {/* Changed from Subject to Student */}
                  </Form.Label>
                </Col>
                <Col md={8}>
                  <Select
                    options={students} // Changed from subjects to students
                    value={students.filter((student) =>
                      studentInput.includes(student.value)
                    )}
                    onChange={(selectedOptions) =>
                      setStudentInput(
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
                  {studentError && ( // Changed from subjectError to studentError
                    <Form.Text className="text-danger">
                      {studentError}{" "}
                      {/* Changed from subjectError to studentError */}
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
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Class</th>
              <th>Attached Student(s)</th>{" "}
              {/* Changed from Attached Subject(s) to Attached Student(s) */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(
              (
                data,
                index // Changed from filteredSubjects to filteredStudents
              ) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{data.classes}</td>
                  <td>{data.student.join(", ")}</td>{" "}
                  {/* Changed from data.subject to data.student */}
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => handleEdit(index)}
                      className="mr-2"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(index)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default StaffStudentBind;