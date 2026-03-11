import React from "react";
import { Container, Form, Row, Col, Table } from "react-bootstrap";
import Select from "react-select";
import "./StaffAddStudentData.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const gradeOptions = [
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "B1", label: "B1" },
  { value: "B2", label: "B2" },
  { value: "C1", label: "C1" },
  { value: "C2", label: "C2" },
];

const AddStudentExamData = () => {
  // Event handler functions

  const handleSearch = () => {
    html2canvas(document.querySelector(".exam-data-container")).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, -heightLeft, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("student-exam-data.pdf");
      }
    );
  };

  const handleClear = () => {
    console.log("Clear button clicked");
  };

  const handleClose = () => {
    console.log("Close button clicked");
  };

  return (
    <Container
      fluid
      style={{
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "15px",
        marginTop: "30px",
        width: "98%",
      }}
    >
      <div className="exam-data-container">
        <h2 className="title">ADD STUDENT EXAM DATA</h2>

        {/* New Button Group Layout */}
        {/* <div className="button-group">
          <div className="col-12" style={{ border: "1px solid #ccc" }}>
            <Button
              variant="primary"
              style={{ width: "180px", marginRight: "30%" }} // Add space after Save button
              onClick={handleSearch}
            >
              Save
            </Button>
            <Button
              variant="primary"
              style={{ width: "180px", marginRight: "30%" }} // Add space after Clear button
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button
              variant="danger"
              style={{ width: "180px" }} // No extra space needed after Close button
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div> */}

        <div className="row mb-2">
          <div className="col-12">
            <button
              type="button"
              className="btn btn-primary me-2"
              style={{
                width: "150px",
              }}
              onClick={handleSearch}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-primary me-2"
              style={{
                width: "150px",
              }}
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              type="button"
              className="btn btn-danger me-2"
              style={{
                width: "150px",
              }}
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>

        {/* Student Information Section with Border */}
        <div
          className="student-info-box"
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          <Row>
            <Col>
              <p>
                Term: <span>Term 1</span>
              </p>
              <p>
                Admission No: <span>2239</span>
              </p>
              <p>
                Class: <span>PP-II</span>
              </p>
              <p>
                Name: <span>AARAV KHATRI</span>
              </p>
              <p>
                Mother's Name: <span>Ms. JYOTI ANTIL</span>
              </p>
            </Col>
            <Col>
              <p>
                Session: <span>2024-25</span>
              </p>
              <p>
                Roll No: <span>Jasmine</span>
              </p>
              <p>
                Section: <span>Jasmine</span>
              </p>
              <p>
                Date of Birth: <span>06-May-2020</span>
              </p>
              <p>
                Father/Guardian's Name: <span>Mr. ASHISH</span>
              </p>
            </Col>
          </Row>

          {/* Health Status Section - Below Student Information */}
          <div className="health-status-box" style={{ marginTop: "20px" }}>
            <Table bordered={false} className="health-status-table">
              <tbody>
                <tr>
                  <td className="table-header">Health Status:</td>
                  <td>
                    <div className="input-container">
                      <label className="input-label">Height</label>
                      <Form.Control className="small-input" type="text" />
                      <span>cms</span>
                    </div>
                  </td>
                  <td>
                    <div className="input-container">
                      <label className="input-label">Weight</label>
                      <Form.Control className="small-input" type="text" />
                      <span>kgs</span>
                    </div>
                  </td>
                  <td>
                    <div className="date-input-container">
                      <label className="input-label">As on Date</label>
                      <Form.Control className="small-input" type="date" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>

        {/* Marks Table - Added below Health Status Table */}
        <Table
          bordered
          responsive="sm" // Makes the table responsive for small screens and up
          className="marks-table"
          style={{ marginTop: "20px" }}
        >
          <thead>
            <tr>
              <th
                style={{
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: "#87CEEB",
                  border: "1px solid #000",
                  textAlign: "center",
                }}
              >
                Main Subjects
              </th>
              <th
                style={{
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: "#87CEEB",
                  border: "1px solid #000",
                  textAlign: "center",
                }}
              >
                Periodic Assessment (10)
              </th>
              <th
                style={{
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: "#87CEEB",
                  border: "1px solid #000",
                  textAlign: "center",
                }}
              >
                Notebook Maintenance (5)
              </th>
              <th
                style={{
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: "#87CEEB",
                  border: "1px solid #000",
                  textAlign: "center",
                }}
              >
                Subject Enrichment (5)
              </th>
              <th
                style={{
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: "#87CEEB",
                  border: "1px solid #000",
                  textAlign: "center",
                }}
              >
                Half Yearly (80)
              </th>
              <th
                style={{
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: "#87CEEB",
                  border: "1px solid #000",
                  textAlign: "center",
                }}
              >
                Total of Term I (100)
              </th>
              <th
                style={{
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: "#87CEEB",
                  border: "1px solid #000",
                  textAlign: "center",
                }}
              >
                Grade
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                English
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="10.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="5.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="5.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="80.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="100.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="text" placeholder="A1" />
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                Hindi
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="5.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="5.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="5.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="80.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="100.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="text" placeholder="A1" />
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                Maths
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="5.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="5.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="79.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="94.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="100.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="text" placeholder="A1" />
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                EVS
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="6.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="3.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="74.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="86.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="number" placeholder="86.00" />
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Form.Control type="text" placeholder="A2" />
              </td>
            </tr>
          </tbody>
        </Table>

        {/* Additional Table for Secondary and Grade */}
        <Table responsive
          bordered
          className="secondary-grade-table"
          style={{ marginTop: "20px" }}
        >
          <thead>
            <tr>
              <th
                style={{
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: "#87CEEB",
                  border: "1px solid #000",
                  textAlign: "center",
                }}
              >
                Subject
              </th>
              <th
                style={{
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: "#87CEEB",
                  border: "1px solid #000",
                  textAlign: "center",
                }}
              >
                Grade
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                General Knowledge
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Select
                  options={gradeOptions}
                  className="grade-select"
                  classNamePrefix="react-select"
                  styles={{
                    container: (provided) => ({
                      ...provided,
                      width: "100px",
                    }),
                    control: (provided) => ({
                      ...provided,
                      minHeight: "30px",
                      height: "30px",
                      fontSize: "0.75rem",
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                      height: "30px",
                      padding: "0 6px",
                    }),
                    indicatorSeparator: () => ({
                      display: "none",
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      padding: "0 8px",
                    }),
                  }}
                />
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                Computer
              </td>
              <td style={{ border: "1px solid #000", textAlign: "center" }}>
                <Select
                  options={gradeOptions}
                  className="grade-select"
                  classNamePrefix="react-select"
                  styles={{
                    container: (provided) => ({
                      ...provided,
                      width: "100px",
                    }),
                    control: (provided) => ({
                      ...provided,
                      minHeight: "30px",
                      height: "30px",
                      fontSize: "0.75rem",
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                      height: "30px",
                      padding: "0 6px",
                    }),
                    indicatorSeparator: () => ({
                      display: "none",
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      padding: "0 8px",
                    }),
                  }}
                />
              </td>
            </tr>

            {/* New Table for Club and Grade */}
            <div className="table-responsive">
              <Table
                bordered
                className="club-grade-table"
                style={{ marginTop: "10px", width: "100%" }} // Set table width to 100%
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        backgroundColor: "#87CEEB",
                        border: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      Club
                    </th>
                    <th
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        backgroundColor: "#87CEEB",
                        border: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{ border: "1px solid #000", textAlign: "center" }}
                    >
                      Carrom
                    </td>
                    <td
                      style={{ border: "1px solid #000", textAlign: "center" }}
                    >
                      <Select
                        options={gradeOptions}
                        className="grade-select"
                        classNamePrefix="react-select"
                        styles={{
                          container: (provided) => ({
                            ...provided,
                            width: "100px",
                          }),
                          control: (provided) => ({
                            ...provided,
                            minHeight: "30px",
                            height: "30px",
                            fontSize: "0.75rem",
                          }),
                          valueContainer: (provided) => ({
                            ...provided,
                            height: "30px",
                            padding: "0 6px",
                          }),
                          indicatorSeparator: () => ({
                            display: "none",
                          }),
                          dropdownIndicator: (provided) => ({
                            ...provided,
                            padding: "0 8px",
                          }),
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </tbody>
        </Table>

        <div className="table-responsive">
          <Table
            bordered
            className="secondary-grade-table"
            style={{ marginTop: "20px" }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    width: "61.5%",
                    color: "black",
                    fontWeight: "bold",
                    backgroundColor: "#87CEEB",
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  Subject
                </th>
                <th
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    backgroundColor: "#87CEEB",
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #000", textAlign: "center" }}>
                  General Knowledge
                </td>
                <td style={{ border: "1px solid #000", textAlign: "center" }}>
                  <Select
                    options={gradeOptions}
                    className="grade-select"
                    classNamePrefix="react-select"
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: "100px",
                      }),
                      control: (provided) => ({
                        ...provided,
                        minHeight: "30px",
                        height: "30px",
                        fontSize: "0.75rem",
                      }),
                      valueContainer: (provided) => ({
                        ...provided,
                        height: "30px",
                        padding: "0 6px",
                      }),
                      indicatorSeparator: () => ({
                        display: "none",
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        padding: "0 8px",
                      }),
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #000", textAlign: "center" }}>
                  Computer
                </td>
                <td style={{ border: "1px solid #000", textAlign: "center" }}>
                  <Select
                    options={gradeOptions}
                    className="grade-select"
                    classNamePrefix="react-select"
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: "100px",
                      }),
                      control: (provided) => ({
                        ...provided,
                        minHeight: "30px",
                        height: "30px",
                        fontSize: "0.75rem",
                      }),
                      valueContainer: (provided) => ({
                        ...provided,
                        height: "30px",
                        padding: "0 6px",
                      }),
                      indicatorSeparator: () => ({
                        display: "none",
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        padding: "0 8px",
                      }),
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </div>

        {/* New Box with Three Input Fields */}
        <div className="three-input-box" style={{ marginTop: "20px" }}>
          <h4>Term-1-Attendance</h4>
          <Row>
            <Col md={4}>
              <Form.Group controlId="input1">
                <Form.Label>ACTUAL ATTENDANCE</Form.Label>
                <Form.Control type="text" placeholder="Enter a value " />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="input2">
                <Form.Label> POSSIBLE ATTENDANCE</Form.Label>
                <Form.Control type="text" placeholder="Enter a value " />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="input3">
                <Form.Label>HOLIDAY HOMEWORK</Form.Label>
                <Select
                  options={[
                    { value: "option1", label: "Option 1" },
                    { value: "option2", label: "Option 2" },
                    { value: "option3", label: "Option 3" },
                  ]}
                  placeholder="Select an option"
                  classNamePrefix="react-select"
                  styles={{
                    container: (provided) => ({
                      ...provided,
                      minWidth: "150px",
                    }),
                    control: (provided) => ({
                      ...provided,
                      minHeight: "30px",
                      height: "36px",
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                      height: "30px",
                      padding: "0 6px",
                    }),
                    indicatorSeparator: () => ({
                      display: "none",
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      padding: "0 8px",
                    }),
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Additional Details Section */}
        <div className="additional-details-box" style={{ marginTop: "20px" }}>
          <Form.Group
            controlId="additionalField1"
            style={{ marginTop: "20px" }}
          >
            <Form.Label>
              RECORD OF PARTICIPATION IN CO-CURRICULAR ACTIVITIES
            </Form.Label>
            <Form.Control type="text" placeholder="Enter a value" />
          </Form.Group>

          {/* New Fields */}
          <Form.Group
            controlId="additionalField1"
            style={{ marginTop: "20px" }}
          >
            <Form.Label>CLASS-TEACHER'S REMARKS</Form.Label>
            <Form.Control type="text" placeholder="Enter a value" />
          </Form.Group>

          <Form.Group
            controlId="additionalField2"
            style={{ marginTop: "10px" }}
          >
            <Form.Label>ACTIVITIES</Form.Label>
            <Form.Control type="text" placeholder="Enter a value" />
          </Form.Group>

          <Form.Group
            controlId="additionalField3"
            style={{ marginTop: "10px" }}
          >
            <Form.Label>COMPETITION</Form.Label>
            <Form.Control type="text" placeholder="Enter a value" />
          </Form.Group>
        </div>
      </div>
    </Container>
  );
};

export default AddStudentExamData;
