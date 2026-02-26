import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button,Form,Col } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import AdmStudentModal from './AdmStudentModal';

const UserTable = ({ users }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleEdit = (userId) => {
    // Handle the edit action here
    console.log(`Edit user ${userId}`);
  };

  const handleDelete = (userId) => {
    // Handle the delete action here
    console.log(`Delete user ${userId}`);
  };

  return (
    <div className="user-table-container">
      <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
        <Col xs="auto">
          <Button
            variant="outline-primary"
            onClick={handleShowModal}
            className="add-principal-btn"
          >
            Add Student
          </Button>
        </Col>
        <Col xs="auto">
          <Form.Control
            type="text"
            placeholder="Search..."
            // onChange={handleSearch}
          />
        </Col>
      </div>
      <div className="table-scrollable">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Profile Picture</th>
              <th>User Name</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Parents Name</th>
              <th>User Type</th>
              <th>Birthday</th>
              <th>Gender</th>
              <th>Parents Number</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td><img src={user.profilePicture} alt="Profile" width="50" height="50"/></td>
                <td>{user.userName}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.userType}</td>
                <td>{user.birthday}</td>
                <td>{user.gender}</td>
                <td>{user.alternativeNumber}</td>
                <td>{user.address}</td>
                <td>
                  <Button variant="primary" onClick={() => handleEdit(user.id)} style={{ marginRight: '10px' }}>
                    <FaEdit />
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(user.id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <AdmStudentModal show={showModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default UserTable;

