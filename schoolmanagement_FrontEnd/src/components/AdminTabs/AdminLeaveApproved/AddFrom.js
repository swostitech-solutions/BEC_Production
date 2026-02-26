
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import { MdClose } from "react-icons/md";

const AddForm = ({ closeEvent, onSend }) => {
  const [approvalStatus, setApprovalStatus] = useState("");
  const [approvalMessage, setApprovalMessage] = useState("");

  const handleSend = () => {
    onSend(approvalStatus, approvalMessage);
    closeEvent();
  };

  const handleClose = () => {
    closeEvent();
  };

  return (
    <Box>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" color="danger" onClick={handleClose}>
          <MdClose />
        </Button>
      </div>
      <TextField
        select
        label="Approval Status"
        variant="outlined"
        fullWidth
        value={approvalStatus}
        onChange={(e) => setApprovalStatus(e.target.value)}
        margin="normal"
      >
        <MenuItem value="approved">Approved</MenuItem>
        <MenuItem value="denied">Denied</MenuItem>
      </TextField>
      <TextField
        label="Approval Message"
        variant="outlined"
        fullWidth
        value={approvalMessage}
        onChange={(e) => setApprovalMessage(e.target.value)}
        margin="normal"
        multiline
        rows={6}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSend}
        style={{ marginTop: "16px", marginRight: "8px" }}
      >
        {approvalStatus ? `${approvalStatus.charAt(0).toUpperCase()}${approvalStatus.slice(1)} Action` : "Send"}
      </Button>
    </Box>
  );
};

export default AddForm;
