import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Pagination,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { ApiUrl } from "../../../ApiUrl";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./DateCalculator.css";
const DateCalculator = () => {
  const [date, setDate] = useState("");
  const [additionalText, setAdditionalText] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingDate, setEditingDate] = useState("");
  const [editingAdditionalText, setEditingAdditionalText] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    fetchDataFromServer();
  }, []);

  const fetchDataFromServer = () => {
    fetch(`${ApiUrl.apiurl}holidaylist/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((dataFromServer) => {
        setData(dataFromServer);
        setFilteredData(dataFromServer);
      })
      .catch((error) => {
        console.error("Error fetching data from server:", error);
      });
  };

  const handleSend = (e) => {
    e.preventDefault();

    if (!date.trim() || !additionalText.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    if (additionalText.length > 255) {
      alert("Message should not exceed 255 characters.");
      return;
    }

    let calendarData = {
      date: date,
      Holiday_Name: additionalText,
    };

    fetch(`${ApiUrl.apiurl}holidaycreate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(calendarData),
    })
      .then((response) => response.json())
      .then((dataFromServer) => {
        setData((prevData) => [...prevData, dataFromServer]);
        setFilteredData((prevData) => [...prevData, dataFromServer]);
        console.log("Response from server:", dataFromServer);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    setDate("");
    setAdditionalText("");
    handleCloseAddModal();
  };

  const handleEdit = async () => {
    try {
      if (editingIndex === null) {
        console.error("No item selected for editing");
        return;
      }

      console.log("Editing item with id:", data[editingIndex].id); // Log the id before making the API call

      const editedData = {
        id: data[editingIndex].id, // Ensure the id is included in the edited data
        date: editingDate,
        Holiday_Name: editingAdditionalText,
      };

      const apiUrl = `${ApiUrl.apiurl}holidayupdate/${data[editingIndex].id}`;
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      // Update the data state with the updated item
      const updatedData = [...data];
      updatedData[editingIndex] = editedData;
      setData(updatedData);

      // Update the filteredData state as well if needed
      setFilteredData(updatedData);

      handleCloseEditModal();
    } catch (error) {
      console.error("Error making API request:", error.message);
    }
  };

  const handleDeleteById = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) {
      return;
    }

    fetch(`${ApiUrl.apiurl}holidaydelete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          const updatedData = data.filter((item) => item.id !== id);
          setData(updatedData);
          setFilteredData(updatedData);
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSearch = () => {
    const filteredResults = data.filter((entry) =>
      entry.Holiday_Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(filteredResults);
    setPage(0);
  };

  const handleOpenAddModal = () => {
    setOpenEditModal(false); // Close the Edit modal
    setOpenAddModal(true); // Open the Add modal
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleOpenEditModal = (index) => {
    setEditingIndex(index);
    setEditingDate(data[index].date);
    setEditingAdditionalText(data[index].Holiday_Name);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
 

  return (
    <Container  style={{ border: "1px solid #ccc", backgroundColor: "#F5F5DC" }}>
      <Row>
        <Col>
          <h1 className="text-center">Holiday Calendar</h1>
          <div className="d-flex justify-content-between mb-2">
            <div className="d-flex">
              <Button variant="outline-primary" onClick={handleOpenAddModal}
              
              >
                + Add
              </Button>
            </div>
            <div className="d-flex justify-content-end">
              <Form.Control
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-35 mb-2"
              />
            </div>
          </div>

          <Table striped bordered hove
          
          >
            <thead response >
              <tr response >
                <th
                  style={{
                    fontWeight: 700,
                    color: "black",
                    border: "1px solid #080404",
                    backgroundColor:"#87CEEB"
                  }}
                >
                  Sl. No
                </th>
                <th
                  style={{
                    fontWeight: 700,
                    color: "black",
                    border: "1px solid #080404",
                    backgroundColor:"#87CEEB"
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    fontWeight: 700,
                    color: "black",
                    border: "1px solid #080404",
                    backgroundColor:"#87CEEB"
                  }}
                >
                  Message
                </th>
                <th
                  style={{
                    fontWeight: 700,
                    color: "black",
                    border: "1px solid #080404",
                    backgroundColor:"#87CEEB"
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody style={{ border: "1px solid #080404" }}>
              {filteredData
                .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                .map((row, index) => (
                  <tr key={index} style={{}}>
                    <td style={{ border: "1px solid #080404" }}>
                      {page * rowsPerPage + index + 1}
                    </td>
                    <td style={{ border: "1px solid #080404" }}>{row.date}</td>
                    <td style={{ border: "1px solid #080404" }}>
                      {row.Holiday_Name}
                    </td>
                    <td className="action-cell">
                      <EditIcon
                        onClick={() => handleOpenEditModal(index)}
                        style={{ cursor: "pointer", color: "blue" }}
                      />
                      <DeleteIcon
                        onClick={() => handleDeleteById(row.id)}
                        style={{ cursor: "pointer", color: "red" }}
                        
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-end">
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
              />
              {Array.from({
                length: Math.ceil(filteredData.length / rowsPerPage),
              }).map((_, index) => (
                <Pagination.Item
                  key={index}
                  active={index === page}
                  onClick={() => handlePageChange(index)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(page + 1)}
                disabled={
                  page === Math.ceil(filteredData.length / rowsPerPage) - 1
                }
              />
            </Pagination>
          </div>
        </Col>
      </Row>
      <Modal show={openAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="message">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={additionalText}
                onChange={(e) => setAdditionalText(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ border: "1px solid #080404" }}>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSend}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={openEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={editingDate}
                onChange={(e) => setEditingDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="message">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editingAdditionalText}
                onChange={(e) => setEditingAdditionalText(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="danger" onClick={handleEdit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DateCalculator;







