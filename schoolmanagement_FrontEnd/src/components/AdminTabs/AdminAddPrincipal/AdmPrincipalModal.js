import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "./AdmPrincipalModal.css";
import { ApiUrl } from "../../../ApiUrl";

const AdmPrincipalModal = ({ show, handleClose, fetchData }) => {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
    principal_emergency_number: "",
    address: "",
    profile_pic: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleTogglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    fetch(`${ApiUrl.apiurl}/api/Role/GetAllRole/`)
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
    let newValue = files ? files[0] : value;

    // Update formData
    setFormData({
      ...formData,
      [name]: newValue,
    });

    // Validate email if applicable
    if (name === "email") {
      validateEmail(value);
    }

    // Validate phone numbers
    if (name === "phone" || name === "principal_emergency_number") {
      if (value.length > 10) {
        setErrors({
          ...errors,
          [name]: "Number must be exactly 10 digits.",
        });
      } else {
        setErrors({
          ...errors,
          [name]: "",
        });
      }
    } else {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid email address.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation errors
    let validationErrors = {};
    if (!formData.username)
      validationErrors.username = "This field may not be blank.";
    if (!formData.first_name)
      validationErrors.first_name = "This field may not be blank.";
    if (!formData.email)
      validationErrors.email = "This field may not be blank.";
    if (!formData.password)
      validationErrors.password = "This field may not be blank.";
    if (!formData.dob) validationErrors.dob = "This field may not be blank.";
    if (!formData.phone)
      validationErrors.phone = "This field may not be blank.";
    if (!formData.address)
      validationErrors.address = "This field may not be blank.";
    if (!formData.user_type)
      validationErrors.user_type = "This field may not be blank.";

    // Set validation errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Form data to submit
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("admin.username", formData.username);
    formDataToSubmit.append("admin.first_name", formData.first_name);
    formDataToSubmit.append("admin.last_name", formData.last_name);
    formDataToSubmit.append("admin.email", formData.email);
    formDataToSubmit.append("admin.password", formData.password);
    formDataToSubmit.append("principal_contact_number", formData.phone);
    formDataToSubmit.append("admin.dob", formData.dob);
    formDataToSubmit.append(
      "gender",
      formData.gender === "Male"
        ? "M"
        : formData.gender === "Female"
        ? "F"
        : "O"
    );
    formDataToSubmit.append(
      "principal_emergency_number",
      formData.principal_emergency_number
    );
    formDataToSubmit.append("address", formData.address);
    formDataToSubmit.append("admin.user_type", formData.user_type);

    const loginId = localStorage.getItem("loginId");
    if (loginId) {
      formDataToSubmit.append("login_id", loginId);
    }

    if (formData.profile_pic) {
      formDataToSubmit.append("admin.profile_pic", formData.profile_pic);
    }

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}Principal/Principalcreate/`,
        {
          method: "POST",
          body: formDataToSubmit,
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        alert("Principal created successfully!");
        handleClose();
        fetchData();
      } else {
        const errorData = await response.json();
        const errorMessages = Object.entries(errorData.error)
          .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
          .join("\n");
        window.alert(`Failed to add disciple:\n${errorMessages}`);
        console.error("Failed to add disciple:", errorMessages);
      }
    } catch (error) {
      window.alert(`Failed to add disciple: ${error.message}`);
      console.error("Failed to add disciple:", error.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Principal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formProfilePicture">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              name="profile_pic"
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formUserName">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter user name"
              value={formData.username}
              onChange={handleInputChange}
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              placeholder="Enter first name"
              value={formData.first_name}
              onChange={handleInputChange}
              isInvalid={!!errors.first_name}
              onKeyDown={(e) => {
                // Allow letters (a-zA-Z) and spaces only
                if (!/^[a-zA-Z\s]*$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
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
              placeholder="Enter last name"
              value={formData.last_name}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                // Allow letters (a-zA-Z) and spaces only
                if (!/^[a-zA-Z\s]*$/.test(e.key)) {
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
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <div className="password-field-container">
              <Form.Control
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                isInvalid={!!errors.password}
              />
              <div
                className="password-toggle-icon"
                onClick={handleTogglePassword}
              >
                {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleInputChange}
              isInvalid={!!errors.phone}
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength="10"
              onKeyDown={(e) => {
                if (
                  !/[0-9]/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight" &&
                  e.key !== "Tab"
                ) {
                  e.preventDefault();
                }
              }}
              onBlur={() => {
                if (formData.phone.length !== 10) {
                  setErrors({
                    ...errors,
                    phone: "Number must be exactly 10 digits.",
                  });
                }
              }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formUserType">
            <Form.Label>User Type</Form.Label>
            <Form.Select
              name="user_type"
              value={formData.user_type}
              onChange={handleInputChange}
              isInvalid={!!errors.user_type}
            >
              <option value="" disabled>
                Select user type
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.user_type}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formBirthday">
            <Form.Label>Birthday</Form.Label>
            <Form.Control
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              isInvalid={!!errors.dob}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dob}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formGender">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              as="select"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formAlternativeNumber">
            <Form.Label>Alternative Number</Form.Label>
            <Form.Control
              type="text"
              name="principal_emergency_number"
              placeholder="Enter alternative number"
              value={formData.principal_emergency_number}
              onChange={handleInputChange}
              isInvalid={!!errors.principal_emergency_number}
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength="10"
              onKeyDown={(e) => {
                if (
                  !/[0-9]/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight" &&
                  e.key !== "Tab"
                ) {
                  e.preventDefault();
                }
              }}
              onBlur={() => {
                if (formData.principal_emergency_number.length !== 10) {
                  setErrors({
                    ...errors,
                    principal_emergency_number:
                      "Number must be exactly 10 digits.",
                  });
                }
              }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.principal_emergency_number}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleInputChange}
              isInvalid={!!errors.address}
            />
            <Form.Control.Feedback type="invalid">
              {errors.address}
            </Form.Control.Feedback>
          </Form.Group>
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
