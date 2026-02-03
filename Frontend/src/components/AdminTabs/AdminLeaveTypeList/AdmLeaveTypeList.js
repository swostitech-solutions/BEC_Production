import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Modal,
  FormControl,
  Table,
  Pagination,
} from "react-bootstrap";
import { ApiUrl } from "../../../ApiUrl";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./AdmLeaveTypeList.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const EditNameModal = ({ show, handleClose, handleSubmit, initialValue }) => {
  const [name, setName] = useState(initialValue);

  useEffect(() => {
    setName(initialValue);
  }, [initialValue]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(name);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{initialValue ? "Edit Name" : "Add Name"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {initialValue ? "Update" : "Add"}
          </Button>
          <Button variant="danger" onClick={handleClose} className="ms-2">
            Close
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const NameForm = () => {
  const [nameData, setnameData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apiUrl = `${ApiUrl.apiurl}leavetypelist/`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("API request failed");
      }
      const responseData = await response.json();
      setnameData(
        responseData.map((entry, index) => ({
          ...entry,
          serialNumber: index + 1,
        }))
      );
    } catch (error) {
      console.error("Error fetching API data:", error.message);
    }
  };

  const handleEditById = (id) => {
    setEditingId(id);
    handleShowModal();
  };

  const handleSubmit = async (name) => {
    try {
      let apiUrl = `${ApiUrl.apiurl}leavetypecreate/`;
      let method = "POST";
      if (editingId !== null) {
        apiUrl = `${ApiUrl.apiurl}leavetypeupdate/${editingId}`;
        method = "PATCH";
      }

      const response = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leave_type_name: name }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const responseData = await response.json();

      if (editingId !== null) {
        const updatednameData = nameData.map(
          (entry) =>
            entry.id === editingId ? { ...entry, leave_type_name: name } : entry
        );
        setnameData(updatednameData);
      } else {
        setnameData([
          ...nameData,
          { ...responseData, serialNumber: nameData.length + 1 },
        ]);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error making API request:", error.message);
    }
  };

  const handleDeleteById = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (confirmed) {
      fetch(`${ApiUrl.apiurl}leavetypedelete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            fetchData();
          } else {
            console.error("Failed to delete item");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = nameData.filter((entry) =>
    entry.leave_type_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container style={{ backgroundColor: "#F5F5DC" }}>
      <h1>Leave Information</h1>
      <div className="d-flex justify-content-between mb-2">
        <div className="d-flex">
          <Button variant="outline-primary" onClick={handleShowModal}>
            Add Leave
          </Button>
        </div>
        <div className="d-flex justify-content-end">
          <FormControl
            type="text"
            placeholder="Search"
            className="w-35 mb-2"
            onChange={handleSearch}
          />
        </div>
      </div>
      <EditNameModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSubmit={handleSubmit}
        initialValue={
          editingId !== null
            ? nameData.find((entry) => entry.id === editingId).leave_type_name
            : ""
        }
      />
      {nameData.length > 0 && (
        <>
          <Table
            striped
            bordered
            hover
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    fontWeight: 700,
                    color: "black",
                    border: "1px solid #080404",
                    backgroundColor:"#87CEEB"
                  }}
                >
                  Sl.No
                </th>
                <th
                  style={{
                    fontWeight: 700,
                    color: "black",
                    border: "1px solid #080404",
                    backgroundColor:"#87CEEB"
                  }}
                >
                  Name
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
                .slice((page - 1) * perPage, page * perPage)
                .map((entry, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #080404" }}>
                      {entry.serialNumber}
                    </td>
                    <td style={{ border: "1px solid #080404" }}>
                      {entry.leave_type_name}
                    </td>
                    <td >
                      <EditIcon
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => handleEditById(entry.id)}
                      />
                      <DeleteIcon
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={() => handleDeleteById(entry.id)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-end"> {/* Align Pagination to the Right */}
            <Pagination>
              {Array.from(
                { length: Math.ceil(filteredData.length / perPage) },
                (_, index) => (
                  <Pagination.Item
                    key={index}
                    active={index + 1 === page}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                )
              )}
            </Pagination>
          </div>
        </>
      )}
    </Container>
  );
  
};

export default NameForm;
