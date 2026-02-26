import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  FormControl,
  Col,
  Pagination,
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ApiUrl } from "../../../ApiUrl";

const MyTable = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [roll, setRoll] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${ApiUrl.apiurl}Role/GetAllRole/`
        );
        if (response.ok) {
          const result = await response.json();
          if (result && Array.isArray(result.data)) {
            setData(result.data);
          } else {
            console.error("Fetched data is not an array:", result);
          }
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setEditIndex(null);
    setRoll("");
  };

  const handleRollChange = (e) => setRoll(e.target.value);
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleSubmit = async () => {
    const loginId = localStorage.getItem("loginId");

    if (!loginId) {
      alert("Login ID not found in local storage");
      return;
    }

    const requestData = {
      login_id: parseInt(loginId, 10),
      name: roll,
    };

    try {
      let response;
      if (editIndex !== null) {
        const itemId = data[editIndex].id;
        response = await fetch(`${ApiUrl.apiurl}Role/updateRole/${itemId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
        if (response.ok) {
          const updatedItem = await response.json();
          alert("Roll field updated successfully");
          setData(
            data.map((item, index) =>
              index === editIndex ? updatedItem : item
            )
          );
        } else {
          const errorData = await response.json();
          alert("Error updating roll field: " + JSON.stringify(errorData));
        }
      } else {
        response = await fetch(`${ApiUrl.apiurl}Role/Rolecreate/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
        if (response.ok) {
          const newItem = await response.json();
          alert("Roll field submitted successfully");
          setData([...data, newItem]);
        } else {
          const errorData = await response.json();
          alert("Error submitting roll field: " + JSON.stringify(errorData));
        }
      }
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting roll field");
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setRoll(data[index].name);
    handleShow();
  };

  const handleDelete = async (index) => {
    const itemId = data[index].id;
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}Role/deleteRole/${itemId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Item deleted successfully");
        setData(data.filter((_, i) => i !== index));
      } else {
        const errorData = await response.json();
        alert("Error deleting item: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting item");
    }
  };

  // Filtered Data
  const filteredData = data.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 gap-2" >
        <Col xs="auto">
          <Button
            variant="primary"
            className="mb-3"
            onClick={() => {
              setRoll("");
              handleShow();
            }}
          >
            Add Role
          </Button>
        </Col>
        <Col xs="auto">
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search Role"
              value={search}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Col>
      </div>
      <Table striped bordered hover >
        <thead >
          <tr >
            <th style={{border:"1px solid black"}}>Sl. No.</th>
            <th style={{border:"1px solid black"}}>Roll</th>
            <th className="text-center" style={{border:"1px solid black"}}>Actions</th>
          </tr>
        </thead>
        <tbody >
          {currentItems.map((item, index) => (
            <tr key={indexOfFirstItem + index}>
              <td style={{border:"1px solid black"}}>{indexOfFirstItem + index + 1}</td>
              <td style={{border:"1px solid black"}}>{item.name || "N/A"}</td>
              <td className="text-center" style={{border:"1px solid black",padding:"0px"}}>
                <Button
                  variant="outline-primary"
                  className="mx-2"
                  onClick={() => handleEdit(indexOfFirstItem + index)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  className="mx-2"
                  onClick={() => handleDelete(indexOfFirstItem + index)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        <Pagination.Prev
          onClick={() =>
            setCurrentPage((prevPage) =>
              prevPage > 1 ? prevPage - 1 : prevPage
            )
          }
          disabled={currentPage === 1}
        />
        {Array.from(
          { length: Math.ceil(filteredData.length / itemsPerPage) },
          (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          )
        ).slice(Math.max(currentPage - 2, 0), currentPage + 2)}{" "}
        {/* Adjust to show a range of page numbers */}
        <Pagination.Next
          onClick={() =>
            setCurrentPage((nextPage) =>
              nextPage < Math.ceil(filteredData.length / itemsPerPage)
                ? nextPage + 1
                : nextPage
            )
          }
          disabled={
            currentPage === Math.ceil(filteredData.length / itemsPerPage)
          }
        />
      </Pagination>

      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editIndex !== null ? "Edit Roll Field" : "Add Roll Field"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formRoll">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter roll"
                value={roll}
                onChange={handleRollChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editIndex !== null ? "Update Roll" : "Save Roll"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyTable;
