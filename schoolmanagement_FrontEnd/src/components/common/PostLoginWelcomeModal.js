import React from "react";
import { Button, Modal } from "react-bootstrap";
import "./PostLoginWelcomeModal.css";

const PostLoginWelcomeModal = ({ show, onHide }) => {
  const details = {
    person:
      sessionStorage.getItem("display_name") ||
      sessionStorage.getItem("username") ||
      "User",
    role:
      sessionStorage.getItem("role_name") ||
      sessionStorage.getItem("userRole") ||
      "Member",
    username: sessionStorage.getItem("username") || "-",
    branch: sessionStorage.getItem("branch_name") || "-",
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
      dialogClassName="bec-welcome-modal-dialog"
      contentClassName="bec-welcome-modal-content"
    >
      <Modal.Body className="bec-welcome-modal-body">
        <div className="bec-welcome-profile">
          <p className="bec-welcome-kicker">BEC ERP Portal</p>
          <h2>Introducing Bhubaneswar Engineering College ERP Management System</h2>
          <p className="bec-welcome-subtitle">
            Your account is ready. Continue to access your ERP workspace.
          </p>
        </div>

        <div className="bec-welcome-usercard">
          <div className="bec-welcome-avatar">{details.person.charAt(0).toUpperCase()}</div>
          <div>
            <p className="bec-welcome-label">Person</p>
            <h3>{details.person}</h3>
            <p className="bec-welcome-role-text">{details.role}</p>
          </div>
        </div>

        <div className="bec-welcome-grid">
          <div className="bec-welcome-card">
            <span>Role</span>
            <strong>{details.role}</strong>
          </div>
          <div className="bec-welcome-card">
            <span>Username</span>
            <strong>{details.username}</strong>
          </div>
          <div className="bec-welcome-card">
            <span>Branch</span>
            <strong>{details.branch}</strong>
          </div>
        </div>

        <div className="bec-welcome-footer">
          <p>Use the sidebar modules to continue with your ERP workspace.</p>
          <Button className="bec-welcome-button" onClick={onHide}>
            Continue
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PostLoginWelcomeModal;
