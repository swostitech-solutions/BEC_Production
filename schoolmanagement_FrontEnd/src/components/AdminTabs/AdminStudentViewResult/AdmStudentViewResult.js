import React, { useState } from "react";
import { Container, Row, Col, Button, Table, Form } from "react-bootstrap";
import Select from "react-select";
const StdResults = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false); // State to control table visibility
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };
  const handleButtonClick = () => {
    if (selectedOption) {
      // Example data for demonstration; you would fetch or set actual data here
      const sampleData = [
        { year: "2024", examName: "Half Yearly" },
        { year: "2024", examName: "Annual" },
      ];
      setTableData(sampleData);
      setShowTable(true); // Show the table when the button is clicked
    } else {
      alert("Please select a year.");
    }
  };
  const handleEdit = (index) => {
    // Handle edit functionality here
    console.log("Edit button clicked for index:", index);
  };
  const handleDelete = (index) => {
    // Handle delete functionality here
    console.log("Delete button clicked for index:", index);
  };
  const options = [
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
  ];
  // Filtered data based on search query
  const filteredData = tableData.filter(
    (data) =>
      data.year.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.examName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <Container
      fluid
      style={{
        border: "none",
        borderRadius: "5px",
        padding: "20px",
        backgroundColor: "#F0F0F0",
        maxWidth: "80%", // Adjusted width to fit elements better
        marginTop: "10px",
      }}
      className="page-container"
    >
      <Row className="align-items-center justify-content-center">
        <Col md={12} className="text-center">
          <h2
            className="header-title"
            style={{ fontSize: "2.0rem", marginBottom: "30px" }}
          >
            Result
          </h2>{" "}
          {/* Increased header size */}
        </Col>
        <Col md={12}>
          <Row className="align-items-center justify-content-center">
            <Col md={4} className="d-flex align-items-center">
              <label
                htmlFor="year-select"
                className="dropdown-label"
                style={{ marginRight: "10px" }}
              >
                Select Year:
              </label>
              <Select
                id="year-select"
                value={selectedOption}
                onChange={handleSelectChange}
                options={options}
                placeholder="Year"
                className="unique-select-dropdown"
                styles={{
                  container: (provided) => ({
                    ...provided,
                    flex: 1,
                    maxWidth: "300px", // Adjusted size of dropdown
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999, // Ensure dropdown menu appears above other elements
                  }),
                }}
              />
            </Col>
            <Col md={2} className="text-center">
              <Button
                variant="primary"
                onClick={handleButtonClick}
                className="unique-submit-button"
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Col>
        {showTable && (
          <>
            <Col md={12} className="mt-4">
              <hr
                style={{
                  width: "100%",
                  borderColor: "#000",
                  borderWidth: "2px",
                  margin: "20px 0",
                  marginBottom: "30px",
                }}
              />{" "}
              {/* Dark black line */}
              <Row className="justify-content-end mb-3">
                <Col md={4} className="d-flex justify-content-end">
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ maxWidth: "300px" }} // Adjusted size
                  />
                </Col>
              </Row>
              <Table
                striped
                bordered
                hover
                responsive
                className="result-table-text-center"
                style={{ border: "1px solid #222" }}
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
                      Year
                    </th>
                    <th
                      style={{
                        backgroundColor: "#87CEEB",
                        fontWeight: "bold",
                        color: "black",
                        border: "1px solid #000",
                      }}
                    >
                      Exam Name
                    </th>
                    <th
                      style={{
                        backgroundColor: "#87CEEB",
                        fontWeight: "bold",
                        color: "black",
                        border: "1px solid #000",
                      }}
                    >
                      Result
                    </th>
                    <th
                      style={{
                        backgroundColor: "#87CEEB",
                        fontWeight: "bold",
                        color: "black",
                        border: "1px solid #000",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((data, index) => (
                      <tr key={index}>
                        <td style={{ border: "1px solid #000" }}>{data.year}</td>
                        <td style={{ border: "1px solid #000" }}>
                          {data.examName}
                        </td>
                        <td style={{ border: "1px solid #000" }}>
                          <a
                            href="#"
                            onClick={() =>
                              alert(
                                "Download PDF functionality will be implemented."
                              )
                            }
                            className="pdf-link"
                          >
                            Result PDF
                          </a>
                        </td>
                        <td style={{ border: "1px solid #000" }}>
                          <Button
                            variant="warning"
                            onClick={() => handleEdit(index)}
                          >
                            Edit
                          </Button>{" "}
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(index)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </>
        )}
      </Row>
    </Container>
  );
};
export default StdResults;