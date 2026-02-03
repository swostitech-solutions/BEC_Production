import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const NotificationCard = styled(Card)({
  marginBottom: "16px",
  cursor: "pointer", // Change cursor to pointer to indicate clickable cards
});

const closeButtonStyle = {
  marginLeft: "auto", // Aligns the button to the right
};

function NotificationsModal({ open, onClose, notifications }) {
  const navigate = useNavigate();

  const handleCardClick = (notification) => {
    navigate("/staff/notification", { state: { notification } });
    onClose(); // Close the modal after navigation
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="notification-modal-title"
      aria-describedby="notification-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="notification-modal-title" variant="h6" component="h2">
          Notifications
        </Typography>
        <Box id="notification-modal-description">
          {notifications.map((notification, index) => (
            <NotificationCard
              key={index}
              onClick={() => handleCardClick(notification)}
            >
              <CardContent>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {notification}
                </Typography>
              </CardContent>
            </NotificationCard>
          ))}
          <Button
            variant="contained"
            color="danger"
            onClick={handleClose}
            sx={closeButtonStyle}
            style={{ float: "right" }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default NotificationsModal;
