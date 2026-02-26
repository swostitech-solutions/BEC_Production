import React, { useState, useEffect } from "react";
import { Table, Button, Col, Form, Pagination, FormControl, InputGroup } from "react-bootstrap";
import AdmPrincipalModal from "./AdmPrincipalModal";
import EditPrincipalModal from "./EditPrincipalModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./AdmAddPrincipal.css";
import { ApiUrl } from "../../../ApiUrl";

const UserTableContainer = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ApiUrl.apiurl}Principal/GetAllPrincipal/`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && Array.isArray(data.data)) {
        setUsers(data.data);
      } else if (data && data.results && Array.isArray(data.results)) {
        setUsers(data.results);
      } else {
        console.error("Unexpected data format:", data);
        setError("Unexpected data format.");
      }
    } catch (error) {
      console.error("Error fetching principals:", error);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    handleShowEditModal();
  };

  const handleSave = async (updatedUser) => {
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}Principal/updatePrincipal/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (response.ok) {
        alert("Principal updated successfully!");
        fetchData(); // Fetch updated data
      } else {
        const errorData = await response.json();
        window.alert(`Failed to update principal: ${errorData.message}`);
      }
    } catch (error) {
      window.alert(`Failed to update principal: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this principal?")) {
      try {
        const response = await fetch(
          `${ApiUrl.apiurl}Principal/deletePrincipal/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
          }
        );

        if (response.ok) {
          alert("Principal deleted successfully!");
          fetchData(); // Fetch updated data
        } else {
          const errorData = await response.json();
          window.alert(`Failed to delete principal: ${errorData.message}`);
        }
      } catch (error) {
        window.alert(`Failed to delete principal: ${error.message}`);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };
  
  // Filtered Data
  const filteredData = users.filter((user) => {
    const searchTerm = search.toLowerCase();
    return (
      (user.username && user.username.toLowerCase().includes(searchTerm)) ||
      (user.first_name && user.first_name.toLowerCase().includes(searchTerm)) ||
      (user.last_name && user.last_name.toLowerCase().includes(searchTerm)) ||
      (user.email && user.email.toLowerCase().includes(searchTerm)) ||
      (user.principal_contact_number && user.principal_contact_number.toLowerCase().includes(searchTerm)) ||
      (user.user_type && user.user_type.toLowerCase().includes(searchTerm)) ||
      (user.dob && user.dob.toLowerCase().includes(searchTerm)) ||
      (user.gender && user.gender.toLowerCase().includes(searchTerm)) ||
      (user.principal_emergency_number && user.principal_emergency_number.toLowerCase().includes(searchTerm)) ||
      (user.address && user.address.toLowerCase().includes(searchTerm))
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="user-table-container px-3">
      <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
        <Col xs="auto">
          <Button
            variant="outline-primary"
            onClick={handleShowModal}
            className="add-principal-btn"
          >
            Add Principal
          </Button>
        </Col>
        <Col xs="auto">
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search Roll"
              value={search}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Col>
      </div>
      <div className="table-scrollable">
        <Table striped bordered hover responsive>
          <thead>
            <tr className="table-header">
              <th style={{ border: "1px solid black" }}>S.No.</th>
              <th style={{ border: "1px solid black" }}>Profile Picture</th>
              <th style={{ border: "1px solid black" }}>User Name</th>
              <th style={{ border: "1px solid black" }}>First Name</th>
              <th style={{ border: "1px solid black" }}>Last Name</th>
              <th style={{ border: "1px solid black" }}>Email</th>
              <th style={{ border: "1px solid black" }}>Phone</th>
              <th style={{ border: "1px solid black" }}>User Type</th>
              <th style={{ border: "1px solid black" }}>Birthday</th>
              <th style={{ border: "1px solid black" }}>Gender</th>
              <th style={{ border: "1px solid black" }}>Alternative Number</th>
              <th style={{ border: "1px solid black" }}>Address</th>
              <th style={{ border: "1px solid black" }}>Action</th>
            </tr>
          </thead>
          <tbody >
            {currentItems.map((user, index) => (
              <tr key={indexOfFirstItem + index}>
                <td style={{ border: "1px solid black" }}>{indexOfFirstItem + index + 1}</td>
                <td style={{ border: "1px solid black" }}>
                  {user.profile_pic ? (
                    <img
                      src={user.profile_pic}
                      alt="Profile"
                      width="50"
                      height="50"
                    />
                  ) : (
                    <div>No Image</div>
                  )}
                </td>
                <td style={{ border: "1px solid black" }}>{user.username}</td>
                <td style={{ border: "1px solid black" }}>{user.first_name}</td>
                <td style={{ border: "1px solid black" }}>{user.last_name}</td>
                <td style={{ border: "1px solid black" }}>{user.email}</td>
                <td style={{ border: "1px solid black" }}>{user.principal_contact_number}</td>
                <td style={{ border: "1px solid black" }}>{user.user_type}</td>
                <td style={{ border: "1px solid black" }}>{user.dob}</td>
                <td style={{ border: "1px solid black" }}>{user.gender}</td>
                <td style={{ border: "1px solid black" }}>{user.principal_emergency_number}</td>
                <td style={{ border: "1px solid black" }}>{user.address}</td>
                <td style={{ border: "1px solid black" }}>
                  <Button
                    variant="primary"
                    onClick={() => handleEdit(user)}
                    style={{ marginRight: "10px" }}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(user.id)}
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
          ).slice(Math.max(currentPage - 2, 0), currentPage + 2)}
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
      </div>

      <AdmPrincipalModal
        show={showModal}
        handleClose={() => {
          handleCloseModal();
          fetchData(); // Fetch updated data after closing the modal
        }}
        fetchData={fetchData} // Pass fetchData to the modal
      />
      
      <EditPrincipalModal 
        show={showEditModal}
        handleClose={handleCloseEditModal}
        user={selectedUser}
        handleSave={handleSave}
      />
    </div>
  );
};

export default UserTableContainer;
