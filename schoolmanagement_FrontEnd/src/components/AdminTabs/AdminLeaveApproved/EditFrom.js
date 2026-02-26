// EditForm.jsx
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const EditForm = ({ closeEvent, editedRow, onSend }) => {
  const [approvalStatus, setApprovalStatus] = useState(editedRow?.ApprovalStatus || "");
  const [approvalMessage, setApprovalMessage] = useState(editedRow?.AuthorityMessage || "");

  useEffect(() => {
    // Update local state when the editedRow changes
    setApprovalStatus(editedRow?.ApprovalStatus || "");
    setApprovalMessage(editedRow?.AuthorityMessage || "");
  }, [editedRow]); // Add editedRow to the dependency array

  const handleSend = () => {
    // Validate the input if needed

    // Call the parent component's onSend function
    onSend(approvalStatus, approvalMessage);
  };

  return (
    <div>
      <h2>Edit Form</h2>
      <div>
        <TextField
          label="Approval Status"
          variant="outlined"
          fullWidth
          value={approvalStatus}
          onChange={(e) => setApprovalStatus(e.target.value)}
        />
      </div>
      <div>
        <TextField
          label="Approval Message"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={approvalMessage}
          onChange={(e) => setApprovalMessage(e.target.value)}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <Button variant="contained" color="primary" onClick={handleSend}>
          Save
        </Button>
        <Button variant="contained" color="default" onClick={closeEvent}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditForm;
