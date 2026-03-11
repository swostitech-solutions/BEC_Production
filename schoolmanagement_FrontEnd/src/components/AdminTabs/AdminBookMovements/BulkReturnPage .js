import React, { useState } from "react";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import SelectBookSearch from "./SelectBookSearch";
import { useNavigate } from "react-router-dom";

const LibraryTable = () => {
  const [rows, setRows] = useState([1, 2, 3, 4, 5]);
  const [isStudentModalVisible, setStudentModalVisible] = useState(false);
  const navigate = useNavigate();

  const updateBookCode = (id, event) => {
    // Handle the input change for bookCode
  };

  const showStudentModal = () => {
    setStudentModalVisible(true);
  };

  const hideStudentModal = () => {
    setStudentModalVisible(false);
  };

  const addSingleRow = () => {
    setRows([...rows, rows.length + 1]);
  };

  const addTenRows = () => {
    const newRows = [...Array(10)].map((_, i) => rows.length + i + 1);
    setRows([...rows, ...newRows]);
  };

  const handleCloseModal = () => {
    navigate("/admin/book-movements");
  };

  return (
    <div className="container-fluid ">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <div className="row mb-2">
                <p
                  style={{
                    marginBottom: "0px",
                    textAlign: "center",
                    fontSize: "20px",
                    fontWeight: "700",
                  }}
                >
                  BULK RETURN
                </p>
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                  >
                    Issue Book
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Book Accession No</th>
                      <th>Book Code</th>
                      <th>Book Name</th>
                      <th>Student/Teacher Name</th>
                      <th>Class</th>
                      <th>Section</th>
                      <th>Admission No</th>
                      <th>Issue Date</th>
                      <th>Return Date</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={index}>
                        <td>{row}</td>
                        <td>
                          <Form.Control type="text" />
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <InputGroup>
                              <Form.Control
                                type="text"
                                onChange={(e) => updateBookCode(row.id, e)}
                                style={{ width: "100px" }}
                              />
                            </InputGroup>
                            <button
                              type="button"
                              className="btn btn-primary ms-2 mb-0 mt-0"
                              onClick={showStudentModal}
                            >
                              ...
                            </button>
                          </div>
                          <SelectBookSearch
                            isVisible={isStudentModalVisible}
                            onClose={hideStudentModal}
                          />
                        </td>

                        <td>
                          <Form.Control type="text" />
                        </td>
                        <td>
                          <Form.Control type="text" />
                        </td>
                        <td>
                          <Form.Control type="text" />
                        </td>
                        <td>
                          <Form.Control type="text" />
                        </td>
                        <td>
                          <Form.Control type="text" />
                        </td>
                        <td>
                          <Form.Control type="text" />
                        </td>
                        <td>
                          <Form.Control type="date" defaultValue="2024-08-29" />
                        </td>
                        <td>
                          <Button variant="link">Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  button
                  type="button"
                  class="btn btn-primary me-2"
                  onClick={addSingleRow}
                >
                  Add Single Row
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  onClick={addTenRows}
                >
                  Add 10 Rows
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryTable;
