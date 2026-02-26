import React, { useState } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const AdmNotification = () => {
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    subject: "",
    message: "",
    document: null,
    selectedOptions: [],
  });

  const [tableData, setTableData] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      document: file,
    }));
  };

  const handleSend = () => {
    if (
      formData.name &&
      formData.year &&
      formData.subject &&
      formData.message
    ) {
      setTableData([...tableData, { ...formData }]);
      alert("Form data sent successfully!");
      setFormData({
        name: "",
        year: "",
        subject: "",
        message: "",
        document: null,
        selectedOptions: [],
      });
      setSelectAllChecked(false);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleSelectAll = () => {
    const allOptions = Array.from(
      { length: 20 },
      (_, index) => `Option${index + 1}`
    );
    setFormData((prevData) => ({
      ...prevData,
      selectedOptions: selectAllChecked ? [] : allOptions,
    }));
    setTimeout(() => {
      setSelectAllChecked((prev) => !prev);
    }, 0);
  };

  const handleDownload = (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handlePopupOpen = (message) => {
    setPopupMessage(message);
    setOpenPopup(true);
  };

  const handlePopupClose = () => {
    setOpenPopup(false);
  };

  return (
    <Card style={{ maxWidth: 1500, margin: "auto", marginTop: 10 }}>
      <Typography
        variant="h6"
        component="h6"
        sx={{ textAlign: "center", fontWeight: 700 }}
      >
        Notification
      </Typography>
      <CardContent>
        <form>
          <InputLabel id="name-label">Name</InputLabel>
          <Select
            labelId="name-label"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            defaultValue="Small"
            size="small"
          >
            {Array.from({ length: 20 }, (_, index) => (
              <MenuItem key={index} value={`Option${index + 1}`}>
                {`Option${index + 1}`}
              </MenuItem>
            ))}
          </Select>

          <InputLabel id="year-label">Year</InputLabel>
          <Select
            labelId="year-label"
            label="Year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            fullWidth
            margin="normal"
            defaultValue="Small"
            size="small"
            // style={{ width: '50%' }}
          >
            <MenuItem value="2021">2021</MenuItem>
            <MenuItem value="2022">2022</MenuItem>
            <MenuItem value="2023">2023</MenuItem>
          </Select>

          <InputLabel id="select-all-label">Select All</InputLabel>
          <Select
            labelId="select-all-label"
            label="Select All"
            multiple
            value={formData.selectedOptions}
            onChange={(e) =>
              handleChange({
                target: { name: "selectedOptions", value: e.target.value },
              })
            }
            fullWidth
            margin="normal"
            renderValue={(selected) =>
              selected.length === 20 ? "All" : selected.join(", ")
            }
            defaultValue="Small"
            size="small"
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectAllChecked}
                  onChange={handleSelectAll}
                />
              }
              label="Select All"
            />
            {Array.from({ length: 20 }, (_, index) => (
              <MenuItem key={index} value={`Option${index + 1}`}>
                <Checkbox
                  checked={formData.selectedOptions.includes(
                    `Option${index + 1}`
                  )}
                />
                {`Option${index + 1}`}
              </MenuItem>
            ))}
          </Select>

          {/* Add Subject TextField below the Select All field */}
          <InputLabel id="subject-label">Subject</InputLabel>
          <TextField
            label="Subject"
            variant="outlined"
            placeholder="Enter your subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            fullWidth
            margin="normal"
            defaultValue="Small"
            size="small"
          />

          <InputLabel id="subject-label">Message</InputLabel>
          <TextField
            label="Message"
            variant="outlined"
            multiline
            rows={3}
            placeholder="Enter your message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            fullWidth
            margin="normal"
            // style={{ width: '50%' }}
          />

          <input
            accept="*"
            id="document-upload"
            type="file"
            onChange={handleDocumentChange}
            style={{ display: "none" }}
          />

          <label htmlFor="document-upload">
            <Button variant="contained" color="primary" component="span">
              Upload Document
            </Button>
          </label>

          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={handleSend}
          >
            Send
          </Button>
        </form>

        {tableData.length > 0 && (
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      backgroundColor: "blue",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "blue",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    Year
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "blue",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    Subject
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "blue",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    Selected Options
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "blue",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    Document
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "blue",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    Message
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{data.name}</TableCell>
                    <TableCell>{data.year}</TableCell>
                    <TableCell>{data.subject}</TableCell>
                    <TableCell>
                      {data.selectedOptions.length === 20
                        ? "All"
                        : data.selectedOptions.join(", ")}
                    </TableCell>
                    <TableCell>
                      {data.document && (
                        <>
                          {data.document.name}{" "}
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleDownload(data.document)}
                          >
                            Download
                          </Button>
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handlePopupOpen(data.message)}
                      >
                        View Message
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={openPopup} onClose={handlePopupClose}>
          <DialogTitle>Message</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <div style={{ whiteSpace: "pre-wrap" }}>{popupMessage}</div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePopupClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdmNotification;
