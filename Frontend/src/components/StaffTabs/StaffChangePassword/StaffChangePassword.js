import React, { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const StaffChangePassword = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    if (newPassword === oldPassword) {
      alert("New password must be different from old password.");
      return;
    }

    // Get user_id from sessionStorage
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const requestBody = {
        user_id: parseInt(userId),
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      };

      // Backend API will be implemented later
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
                          Old Password<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="col-sm-8">
                          <Form.Control
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            disabled={loading}
                            placeholder="Enter current password"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3 row">
                        <Form.Label className="col-sm-4 col-form-label">
                          New Password<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="col-sm-8">
                          <Form.Control
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={loading}
                            placeholder="Enter new password"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3 row">
                        <Form.Label className="col-sm-4 col-form-label">
                          Confirm Password
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="col-sm-8">
                          <Form.Control
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                              setConfirmPassword(e.target.value)
                            }
                            disabled={loading}
                            placeholder="Confirm new password"
                          />
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
