import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
const PasswordResetPopup = ({ show, onHide, onResetPassword }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const handleResetPassword = () => {
    // Check if passwords match before resetting
    if (password === confirmPassword) {
      // Perform password reset logic here
      // You can validate passwords, make API calls, etc.
      // Call the onResetPassword function with the new password
      if (onResetPassword) {
        onResetPassword(password);
      }
      // Close the modal
      onHide();
    } else {
      // If passwords do not match, set the state to show an alert
      setPasswordsMatch(false);
    }
  };
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Password Reset</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          {!passwordsMatch && (
            <Alert variant="danger">
              Passwords do not match. Please enter the same password in both
              fields.
            </Alert>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleResetPassword}>
          Reset Password
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default PasswordResetPopup;






