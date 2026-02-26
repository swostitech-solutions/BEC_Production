import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ApiUrl } from "../../../ApiUrl";

const AdmPrincipalModal = ({ show, handleClose, user }) => {
  const [formData, setFormData] = useState({
    admin: {
      first_name: "",
      last_name: "",
      email: "",
      dob: "",
      profile_pic: "",
    },
    principal_contact_number: "",
    principal_emergency_number: "",
    address: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      // Populate form data when user prop changes
      setFormData({
        admin: {
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          dob: user.dob || "",
          profile_pic: user.profile_pic || "",
        },
        principal_contact_number: user.principal_contact_number || "",
        principal_emergency_number: user.principal_emergency_number || "",
        address: user.address || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  const validateForm = () => {
    let validationErrors = {};

    // Mandatory fields
    if (!formData.admin.first_name) validationErrors.first_name = "This field may not be blank.";
    if (!formData.admin.email) validationErrors.email = "This field may not be blank.";
    if (!formData.principal_contact_number) validationErrors.principal_contact_number = "This field may not be blank.";
    if (!formData.admin.dob) validationErrors.dob = "This field may not be blank.";
    if (!formData.address) validationErrors.address = "This field may not be blank.";

    // Validate contact numbers
    if (formData.principal_contact_number && !/^\d{10}$/.test(formData.principal_contact_number)) {
      validationErrors.principal_contact_number = "Principal contact number must be 10 digits.";
    }
    if (formData.principal_emergency_number && !/^\d{10}$/.test(formData.principal_emergency_number)) {
      validationErrors.principal_emergency_number = "Principal emergency number must be 10 digits.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.admin) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        admin: {
          ...prevFormData.admin,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      admin: {
        ...prevFormData.admin,
        profile_pic: file,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }
    try {
      const loginId = localStorage.getItem('loginId');
      const url = user 
        ? `${ApiUrl.apiurl}Principal/updatePrincipal/${user.id}/`
        : `${ApiUrl.apiurl}Principal/addPrincipal/`;
  
      const method = user ? "PUT" : "POST";
  
      const formDataToSend = new FormData();
      formDataToSend.append('login_id', loginId);
      for (const key in formData) {
        if (key === "admin") {
          for (const subKey in formData.admin) {
            formDataToSend.append(`admin.${subKey}`, formData.admin[subKey]);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
  
      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });
  
      if (response.ok) {
        alert(user ? "Principal updated successfully!" : "Principal added successfully!");
        handleClose();
        window.location.reload(); // Reload the page to reflect updates
      } else {
        const errorData = await response.json();
        alert(`Failed to ${user ? "update" : "add"} principal: ${errorData.message}`);
      }
    } catch (error) {
      alert(`Failed to ${user ? "update" : "add"} principal: ${error.message}`);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{user ? "Edit Principal" : "Add Principal"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              value={formData.admin.first_name}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (
                  !/[a-zA-Z]/.test(e.key) && // Allow only letters
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight" &&
                  e.key !== "Tab"
                ) {
                  e.preventDefault();
                }
              }}
              onPaste={(e) => {
                const pastedData = e.clipboardData.getData('text');
                if (!/^[a-zA-Z]*$/.test(pastedData)) { // Allow only letters
                  e.preventDefault();
                }
              }}
              isInvalid={!!errors.first_name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.first_name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="last_name"
              value={formData.admin.last_name}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (
                  !/[a-zA-Z]/.test(e.key) && // Allow only letters
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight" &&
                  e.key !== "Tab"
                ) {
                  e.preventDefault();
                }
              }}
              onPaste={(e) => {
                const pastedData = e.clipboardData.getData('text');
                if (!/^[a-zA-Z]*$/.test(pastedData)) { // Allow only letters
                  e.preventDefault();
                }
              }}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.admin.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formDob">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dob"
              value={formData.admin.dob}
              onChange={handleChange}
              isInvalid={!!errors.dob}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dob}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formProfilePic">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              name="profile_pic"
              onChange={handleFileChange}
            />
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Principal Contact Number</Form.Label>
            <Form.Control
              type="text"
              name="principal_contact_number"
              value={formData.principal_contact_number}
              onChange={handleChange}
              isInvalid={!!errors.principal_contact_number}
            />
            <Form.Control.Feedback type="invalid">
              {errors.principal_contact_number}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formEmergencyPhone">
            <Form.Label>Principal Emergency Number</Form.Label>
            <Form.Control
              type="text"
              name="principal_emergency_number"
              value={formData.principal_emergency_number}
              onChange={handleChange}
              isInvalid={!!errors.principal_emergency_number}
            />
            <Form.Control.Feedback type="invalid">
              {errors.principal_emergency_number}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              isInvalid={!!errors.address}
            />
            <Form.Control.Feedback type="invalid">
              {errors.address}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formGender">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {user ? "Update" : "Add"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AdmPrincipalModal;
