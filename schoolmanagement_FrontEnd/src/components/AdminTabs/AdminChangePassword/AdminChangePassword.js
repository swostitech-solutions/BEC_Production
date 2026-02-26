import React, { useState, useEffect } from "react";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ApiUrl } from "../../../ApiUrl";

const AdminChangePassword = () => {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-populate username from sessionStorage
    const storedUsername = sessionStorage.getItem("username") || "";
    setUsername(storedUsername);
  }, []);

  // Get access token
  const getAccessToken = () => localStorage.getItem("accessToken");

  const validateForm = () => {
    const newErrors = {};

    if (!username || username.trim() === "") {
      newErrors.username = "Username is required.";
    }

    if (!oldPassword || oldPassword.trim() === "") {
      newErrors.oldPassword = "Current password is required.";
    }

    if (!newPassword || newPassword.trim() === "") {
      newErrors.newPassword = "New password is required.";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long.";
    }

    if (!confirmPassword || confirmPassword.trim() === "") {
      newErrors.confirmPassword = "Please confirm your new password.";
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (newPassword && oldPassword && newPassword === oldPassword) {
      newErrors.newPassword = "New password must be different from current password.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    // Clear previous messages
    setSuccessMessage("");
    setErrorMessage("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const requestBody = {
        username: username,
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      };

      const response = await fetch(`${ApiUrl.apiurl}RegisterEmployee/ChangePassword/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.ok && result.message?.toLowerCase().includes("success")) {
        setSuccessMessage("Password changed successfully!");
        handleClear();
        
        // Optionally redirect after 2 seconds
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 2000);
      } else {
        setErrorMessage(result.message || "Failed to change password. Please check your current password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setErrorMessage("An error occurred while changing password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
    setErrorMessage("");
  };

  const handleClose = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white" style={{ borderRadius: "8px 8px 0 0" }}>
              <h4 className="mb-0 text-center">Change Password</h4>
            </div>
            <div className="card-body p-4">
              {/* Success/Error Messages */}
              {successMessage && (
                <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                  <FaCheckCircle className="me-2" size={20} />
                  <div>{successMessage}</div>
                </div>
              )}
              {errorMessage && (
                <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                  <FaTimesCircle className="me-2" size={20} />
                  <div>{errorMessage}</div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ minWidth: "120px" }}
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ minWidth: "120px" }}
                  onClick={handleClear}
                  disabled={loading}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ minWidth: "120px" }}
                  onClick={handleClose}
                  disabled={loading}
                >
                  Close
                </button>
              </div>

              {/* Form */}
              <div className="bg-light p-4 rounded">
                <Row>
                  <Col lg={8} md={10} className="mx-auto">
                    {/* Username Field */}
                    <Form.Group className="mb-4 row">
                      <Form.Label className="col-sm-4 col-form-label fw-bold">
                        Username <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="col-sm-8">
                        <Form.Control
                          type="text"
                          value={username}
                          disabled={true}
                          readOnly
                          autoComplete="off"
                          style={{ backgroundColor: "#e9ecef", cursor: "not-allowed" }}
                          isInvalid={!!errors.username}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Your username cannot be changed
                        </Form.Text>
                      </div>
                    </Form.Group>

                    {/* Current Password Field */}
                    <Form.Group className="mb-4 row">
                      <Form.Label className="col-sm-4 col-form-label fw-bold">
                        Current Password <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="col-sm-8">
                        <InputGroup>
                          <Form.Control
                            type={showOldPassword ? "text" : "password"}
                            value={oldPassword}
                            onChange={(e) => {
                              setOldPassword(e.target.value);
                              if (errors.oldPassword) {
                                setErrors((prev) => ({ ...prev, oldPassword: "" }));
                              }
                            }}
                            disabled={loading}
                            placeholder="Enter your current password"
                            autoComplete="off"
                            isInvalid={!!errors.oldPassword}
                          />
                          <InputGroup.Text
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            style={{ cursor: "pointer", backgroundColor: "#fff" }}
                          >
                            {showOldPassword ? <BsEyeSlash /> : <BsEye />}
                          </InputGroup.Text>
                          <Form.Control.Feedback type="invalid">
                            {errors.oldPassword}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </div>
                    </Form.Group>

                    {/* New Password Field */}
                    <Form.Group className="mb-4 row">
                      <Form.Label className="col-sm-4 col-form-label fw-bold">
                        New Password <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="col-sm-8">
                        <InputGroup>
                          <Form.Control
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              if (errors.newPassword) {
                                setErrors((prev) => ({ ...prev, newPassword: "" }));
                              }
                            }}
                            disabled={loading}
                            placeholder="Enter new password"
                            autoComplete="new-password"
                            isInvalid={!!errors.newPassword}
                          />
                          <InputGroup.Text
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            style={{ cursor: "pointer", backgroundColor: "#fff" }}
                          >
                            {showNewPassword ? <BsEyeSlash /> : <BsEye />}
                          </InputGroup.Text>
                          <Form.Control.Feedback type="invalid">
                            {errors.newPassword}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </div>
                    </Form.Group>

                    {/* Confirm Password Field */}
                    <Form.Group className="mb-3 row">
                      <Form.Label className="col-sm-4 col-form-label fw-bold">
                        Confirm Password <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="col-sm-8">
                        <InputGroup>
                          <Form.Control
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              if (errors.confirmPassword) {
                                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                              }
                            }}
                            disabled={loading}
                            placeholder="Confirm your new password"
                            autoComplete="new-password"
                            isInvalid={!!errors.confirmPassword}
                          />
                          <InputGroup.Text
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{ cursor: "pointer", backgroundColor: "#fff" }}
                          >
                            {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                          </InputGroup.Text>
                          <Form.Control.Feedback type="invalid">
                            {errors.confirmPassword}
                          </Form.Control.Feedback>
                        </InputGroup>
                        {confirmPassword && newPassword === confirmPassword && (
                          <Form.Text className="text-success fw-bold">
                            ✓ Passwords match
                          </Form.Text>
                        )}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChangePassword;
