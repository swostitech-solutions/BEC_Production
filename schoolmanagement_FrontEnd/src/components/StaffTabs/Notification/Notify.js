

import React from "react";
import { Container, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const NotificationCard = ({ onClose }) => {
  const location = useLocation();
  const notification =
    location.state?.notification || "Notification details not found";

  return (
    <div className="staff-notification">
      <Container
        style={{
          width: "50%",
          marginTop: "5%",
          height: "500px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#F0F0F0",
        }}
        className="staff-notifications"
      >
        <div className="staff-notify">
          <div>{notification}</div>
        </div>
      </Container>
      {/* <Button
        variant="primary"
        onClick={onClose}
        className="mt-3"
      >
        Close
      </Button> */}
    </div>
  );
};

export default NotificationCard;











