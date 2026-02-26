// AdmPrincipalModal.js
import React, { useState,useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AdmStaffModal = ({ show, handleClose }) => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Fetch roles from the API
    fetch('http://52.66.66.205:9000/rolelist/')
      .then(response => response.json())
      .then(data => setRoles(data))
      .catch(error => console.error('Error fetching roles:', error));
  }, []);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Staff</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formProfilePicture">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control type="file" />
          </Form.Group>
          <Form.Group controlId="formUserName">
            <Form.Label>User Name</Form.Label>
            <Form.Control type="text" placeholder="Enter user name" />
          </Form.Group>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder="Enter first name" />
          </Form.Group>
          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" placeholder="Enter last name" />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" placeholder="Enter phone number" />
          </Form.Group>
          <Form.Group controlId="formUserType">
            <Form.Label>User Type</Form.Label>
            <Form.Select as="select"  defaultValue="">
              <option value="" disabled>
                Select user type
              </option>
              {roles.map((role, index) => (
                <option key={index} value={role.id}>
                  {role.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="formBirthday">
            <Form.Label>Birthday</Form.Label>
            <Form.Control type="date" />
          </Form.Group>
          <Form.Group controlId="formGender">
            <Form.Label>Gender</Form.Label>
            <Form.Select as="select" defaultValue="">
              <option value="" disabled>
                Select gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="formAlternativeNumber">
            <Form.Label>Alternative Number</Form.Label>
            <Form.Control type="text" placeholder="Enter alternative number" />
          </Form.Group>
          <Form.Group controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" placeholder="Enter address"  as="textarea"
                  row={10}/>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdmStaffModal;
