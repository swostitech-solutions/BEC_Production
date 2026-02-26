import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ApiUrl } from "../../../ApiUrl";

const AdmPrincipalModal = ({ show, handleClose, onAdd }) => {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    user_type: "",
    dob: "",
    gender: "",
    alternative_number: "",
    address: "",
    profile_picture:"",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch(`${ApiUrl.apiurl}api/Role/GetAllRole/`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setRoles(data.data);
        } else {
          console.error("Fetched data.data is not an array:", data.data);
        }
      })
      .catch((error) => console.error("Error fetching roles:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let validationErrors = {};
    if (!formData.username) validationErrors.username = "This field may not be blank.";
    if (!formData.first_name) validationErrors.first_name = "This field may not be blank.";
    if (!formData.email) validationErrors.email = "This field may not be blank.";
    if (!formData.password) validationErrors.password = "This field may not be blank.";
    if (!formData.dob) validationErrors.dob = "This field may not be blank.";
    if (!formData.phone) validationErrors.phone = "This field may not be blank.";
    if (!formData.address) validationErrors.address = "This field may not be blank.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("admin.username", formData.username);
    formDataToSubmit.append("admin.first_name", formData.first_name);
    formDataToSubmit.append("admin.last_name", formData.last_name);
    formDataToSubmit.append("admin.email", formData.email);
    formDataToSubmit.append("admin.password", formData.password);
    formDataToSubmit.append("principal_contact_number", formData.phone);
    formDataToSubmit.append("admin.dob", formData.dob);
    formDataToSubmit.append("gender", formData.gender === "Male" ? "M" : formData.gender === "Female" ? "F" : "O");
    formDataToSubmit.append("alternative_number", formData.alternative_number);
    formDataToSubmit.append("address", formData.address);
    formDataToSubmit.append("admin.user_type", formData.user_type);

    const loginId = localStorage.getItem('loginId');
    if (loginId) {
      formDataToSubmit.append("login_id", loginId);
    }

    if (formData.profile_picture) {
      formDataToSubmit.append("admin.profile_picture", formData.profile_picture);
    }

    fetch(`${ApiUrl.apiurl}Principal/Principalcreate/`, {
      method: "POST",
      body: formDataToSubmit,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setErrors(data.message);
          alert("Error: " + data.message);
        } else {
          console.log("Principal created successfully:", data);
          alert("Principal created successfully!");
          onAdd(data); // Pass the new principal data to the parent component
          handleClose();
        }
      })
      .catch((error) => {
        console.error("Error creating principal:", error);
        alert("An error occurred while creating the principal. Please try again.");
      });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Principal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Form fields */}
          {/* ... */}
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AdmPrincipalModal;
