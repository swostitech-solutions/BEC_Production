import React, { useState, useEffect } from "react";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import api from "../../../utils/api";

const StaffChangePassword = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-populate username from sessionStorage (staff uses email)
    const staffEmail = sessionStorage.getItem("email") || sessionStorage.getItem("username") || "";
    setUsername(staffEmail);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!username || username.trim() === "") {
      newErrors.username = "Username is required.";
    }

    if (!oldPassword || oldPassword.trim() === "") {
      newErrors.oldPassword = "Old password is required.";
    }

    if (!newPassword || newPassword.trim() === "") {
      newErrors.newPassword = "New password is required.";
    }

    if (!confirmPassword || confirmPassword.trim() === "") {
      newErrors.confirmPassword = "Confirm password is required.";
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "New password and confirm password do not match.";
    }

    if (newPassword && oldPassword && newPassword === oldPassword) {
      newErrors.newPassword = "New password must be different from old password.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
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

      const response = await api.post("RegisterEmployee/ChangePassword/", requestBody);

      if (response.data.message?.toLowerCase() === "success") {
        alert("Password changed successfully!");
        handleClear();
      } else {
        alert(response.data.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred while changing password.";
      alert(errorMessage);
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
  };

  const handleClose = () => {
    navigate("/staff/dashboard");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                CHANGE PASSWORD
              </p>

              {/* 🔲 Top white box for buttons */}
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleClear}
                    disabled={loading}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Close
                  </button>
                </div>
              </div>
              {/* 🔲 Bottom grey box for form */}
              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box  ">
                  <Row className="row mt-3 ">
                    <Col md={6}>
                      <Form.Group className="mb-3 row">
                        <Form.Label className="col-sm-4 col-form-label">
                          Username<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="col-sm-8">
                          <Form.Control
                            type="text"
                            value={username}
                            disabled={true}
                            readOnly
                            style={{ backgroundColor: "#e9ecef" }}
                            isInvalid={!!errors.username}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.username}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3 row">
                        <Form.Label className="col-sm-4 col-form-label">
                          Old Password<span className="text-danger">*</span>
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
                              placeholder="Enter current password"
                              isInvalid={!!errors.oldPassword}
                            />
                            <InputGroup.Text
                              onClick={() => setShowOldPassword(!showOldPassword)}
                              style={{ cursor: "pointer" }}
                            >
                              {showOldPassword ? <BsEyeSlash /> : <BsEye />}
                            </InputGroup.Text>
                            <Form.Control.Feedback type="invalid">
                              {errors.oldPassword}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3 row">
                        <Form.Label className="col-sm-4 col-form-label">
                          New Password<span className="text-danger">*</span>
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
                              isInvalid={!!errors.newPassword}
                            />
                            <InputGroup.Text
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              style={{ cursor: "pointer" }}
                            >
                              {showNewPassword ? <BsEyeSlash /> : <BsEye />}
                            </InputGroup.Text>
                            <Form.Control.Feedback type="invalid">
                              {errors.newPassword}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3 row">
                        <Form.Label className="col-sm-4 col-form-label">
                          Confirm Password
                          <span className="text-danger">*</span>
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
                              placeholder="Confirm new password"
                              isInvalid={!!errors.confirmPassword}
                            />
                            <InputGroup.Text
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              style={{ cursor: "pointer" }}
                            >
                              {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                            </InputGroup.Text>
                            <Form.Control.Feedback type="invalid">
                              {errors.confirmPassword}
                            </Form.Control.Feedback>
                          </InputGroup>
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
    </div>
  );
};

export default StaffChangePassword;
