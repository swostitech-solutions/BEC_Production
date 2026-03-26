import React, { useState } from "react";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import api from "../../../utils/api";

const StudentChangePassword = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  // Load username from sessionStorage on component mount
  React.useEffect(() => {
    const storedUsername = sessionStorage.getItem("username") || sessionStorage.getItem("email") || "";
    setUsername(storedUsername);
  }, []);

  // Comprehensive frontend validation
  const validateForm = () => {
    const newErrors = {};

    // Validate username
    if (!username || username.trim() === "") {
      newErrors.username = "Username is required. Please login again.";
    }

    // Validate old password
    if (!oldPassword || oldPassword.trim() === "") {
      newErrors.oldPassword = "Current password is required.";
    }

    // Validate new password
    if (!newPassword || newPassword.trim() === "") {
      newErrors.newPassword = "New password is required.";
    }

    // Validate confirm password
    if (!confirmPassword || confirmPassword.trim() === "") {
      newErrors.confirmPassword = "Please confirm your new password.";
    }

    // Check if passwords match
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "New password and confirm password do not match.";
    }

    // Check if new password is different from old password
    if (oldPassword && newPassword && oldPassword === newPassword) {
      newErrors.newPassword = "New password must be different from current password.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    // Clear previous errors
    setErrors({});
    setSubmitMessage({ type: "", text: "" });

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // API request body as per Student-Panel-Change-Password API
      const requestBody = {
        username: username,
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      };

      const response = await api.post("RegisterEmployee/ChangePassword/", requestBody);

      if (response.data.message?.toLowerCase() === "success") {
        setSubmitMessage({ type: "success", text: "Password changed successfully!" });
        handleClear();
      } else {
        const backendData = response.data || {};
        const mappedErrors = {};

        if (backendData.old_password) mappedErrors.oldPassword = backendData.old_password;
        if (backendData.new_password) mappedErrors.newPassword = backendData.new_password;
        if (backendData.confirm_password) mappedErrors.confirmPassword = backendData.confirm_password;
        if (Object.keys(mappedErrors).length > 0) {
          setErrors((prev) => ({ ...prev, ...mappedErrors }));
        }

        setSubmitMessage({
          type: "danger",
          text: backendData.message || "Failed to change password.",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred while changing password.";
      const backendData = error.response?.data || {};
      const mappedErrors = {};

      if (backendData.old_password) mappedErrors.oldPassword = backendData.old_password;
      if (backendData.new_password) mappedErrors.newPassword = backendData.new_password;
      if (backendData.confirm_password) mappedErrors.confirmPassword = backendData.confirm_password;
      if (Object.keys(mappedErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...mappedErrors }));
      }

      setSubmitMessage({ type: "danger", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    setSubmitMessage({ type: "", text: "" });
  };

  const handleClose = () => {
    navigate("/student/dashboards");
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

              {submitMessage.text && (
                <div className={`alert alert-${submitMessage.type}`} role="alert">
                  {submitMessage.text}
                </div>
              )}

              {/* 🔲 Bottom grey box for form */}
              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box  ">
                  <Row className="row mt-3 ">
                    <Col md={6}>
                      <Form.Group className="mb-3 row">
                        <Form.Label className="col-sm-4 col-form-label">
                          Username
                        </Form.Label>
                        <div className="col-sm-8">
                          <Form.Control
                            type="text"
                            value={username}
                            disabled
                            readOnly
                            placeholder="Username"
                            style={{ backgroundColor: "#e9ecef" }}
                          />
                          {errors.username && (
                            <small className="text-danger">{errors.username}</small>
                          )}
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3 row">
                        <Form.Label className="col-sm-4 col-form-label">
                          Old Password<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="col-sm-8">
                          <InputGroup hasValidation>
                            <Form.Control
                              type={showOldPassword ? "text" : "password"}
                              value={oldPassword}
                              onChange={(e) => {
                                setOldPassword(e.target.value);
                                if (errors.oldPassword) {
                                  setErrors({ ...errors, oldPassword: "" });
                                }
                              }}
                              disabled={loading}
                              placeholder="Enter current password"
                            />
                            <InputGroup.Text
                              style={{
                                cursor: loading ? "not-allowed" : "pointer",
                                backgroundColor: "#fff",
                                borderColor: errors.oldPassword ? "#dc3545" : "#ced4da",
                              }}
                              onClick={() => !loading && setShowOldPassword(!showOldPassword)}
                            >
                              {showOldPassword ? (
                                <BsEyeSlash size={18} />
                              ) : (
                                <BsEye size={18} />
                              )}
                            </InputGroup.Text>
                          </InputGroup>
                          {errors.oldPassword && (
                            <small className="text-danger">{errors.oldPassword}</small>
                          )}
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3 row">
                        <Form.Label className="col-sm-4 col-form-label">
                          New Password<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="col-sm-8">
                          <InputGroup hasValidation>
                            <Form.Control
                              type={showNewPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (errors.newPassword) {
                                  setErrors({ ...errors, newPassword: "" });
                                }
                              }}
                              disabled={loading}
                              placeholder="Enter new password"
                            />
                            <InputGroup.Text
                              style={{
                                cursor: loading ? "not-allowed" : "pointer",
                                backgroundColor: "#fff",
                                borderColor: errors.newPassword ? "#dc3545" : "#ced4da",
                              }}
                              onClick={() => !loading && setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? (
                                <BsEyeSlash size={18} />
                              ) : (
                                <BsEye size={18} />
                              )}
                            </InputGroup.Text>
                          </InputGroup>
                          {errors.newPassword && (
                            <small className="text-danger">{errors.newPassword}</small>
                          )}
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3 row">
                        <Form.Label className="col-sm-4 col-form-label">
                          Confirm Password
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="col-sm-8">
                          <InputGroup hasValidation>
                            <Form.Control
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (errors.confirmPassword) {
                                  setErrors({ ...errors, confirmPassword: "" });
                                }
                              }}
                              disabled={loading}
                              placeholder="Confirm new password"
                            />
                            <InputGroup.Text
                              style={{
                                cursor: loading ? "not-allowed" : "pointer",
                                backgroundColor: "#fff",
                                borderColor: errors.confirmPassword ? "#dc3545" : "#ced4da",
                              }}
                              onClick={() => !loading && setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <BsEyeSlash size={18} />
                              ) : (
                                <BsEye size={18} />
                              )}
                            </InputGroup.Text>
                          </InputGroup>
                          {errors.confirmPassword && (
                            <small className="text-danger">{errors.confirmPassword}</small>
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
    </div>
  );
};

export default StudentChangePassword;
