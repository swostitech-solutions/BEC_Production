import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Grid } from "@mui/material";
import { ApiUrl } from "../../../ApiUrl";
import SearchIcon from "@mui/icons-material/Search";

const FormWithTable = () => {
  const [subjectValue, setSubjectValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    const filteredResults = tableData.filter((entry) =>
      entry.subject_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setTableData(filteredResults);
    setPage(0);
  };

  const handleSend = async () => {
    if (!subjectValue.trim()) {
      alert("Please fill in the subject field.");
      return;
    }

    try {
      let subjectData = {
        subject_name: subjectValue,
        description: descriptionValue,
      };

      if (editIndex !== null) {
        const updatedTableData = [...tableData];
        const subjectId = updatedTableData[editIndex].id;
        const apiUrl = `${ApiUrl.apiurl}subjectupdate/${subjectId}`;

        const response = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subjectData),
        });

        if (!response.ok) {
          throw new Error("Failed to update subject");
        }

        updatedTableData[editIndex] = {
          ...updatedTableData[editIndex],
          ...subjectData,
        };
        setTableData(updatedTableData);
        setEditIndex(null);
      } else {
        const response = await fetch(`${ApiUrl.apiurl}subjectcreate/`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subjectData),
        });

        if (!response.ok) {
          throw new Error("Failed to add subject");
        }

        const responseData = await response.json();
        setTableData([...tableData, responseData]);
      }

      setSubjectValue("");
      setDescriptionValue("");
      setOpenDialog(false);
    } catch (error) {
      console.error("Error adding/editing subject:", error.message);
      // Handle errors here
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setSubjectValue(tableData[index].subject_name);
    setDescriptionValue(tableData[index].description);
    setOpenDialog(true);
  };

  const handleDelete = async (index) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this row?");

    if (!shouldDelete) {
      return;
    }

    const subjectId = tableData[index].id; // Assuming the API response includes an 'id' field for each subject
    const apiUrl = `${ApiUrl.apiurl}subjectdelete/${subjectId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete subject");
      }

      const updatedTableData = [...tableData];
      updatedTableData.splice(index, 1);
      setTableData(updatedTableData);
    } catch (error) {
      console.error("Error deleting subject:", error.message);
      // Handle errors here
    }
  };

  const handleCloseDialog = () => {
    setSearchTerm("");
    setSubjectValue("");
    setDescriptionValue("");
    setEditIndex(null);
    setOpenDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchData = async () => {
    try {
      const apiUrl = `${ApiUrl.apiurl}subjectlist/`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("API request failed");
      }
      const responseData = await response.json();
      setTableData(responseData); // Corrected line
    } catch (error) {
      console.error("Error fetching API data:", error.message);
      // Handle errors here
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card
      style={{ width: "100%", margin: "auto", marginTop: "1px", height: "30%" }}
    >
      <Typography
        component="h1"
        variant="h5"
        sx={{ textAlign: "center", marginBottom: 0, fontWeight: 700 }}
      >
        Subject
      </Typography>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <TextField
              placeholder="Search..."
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch} size="small">
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenDialog(true)}
            >
              Add Subject
            </Button>
          </Grid>
        </Grid>

        {tableData.length > 0 && (
          <div>
            <TableContainer
              component={Paper}
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sl. No.</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.subject_name}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>
                          <IconButton
                            style={{ color: "green" }}
                            onClick={() => handleEdit(index)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            style={{ color: "red" }}
                            onClick={() => handleDelete(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={tableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {editIndex !== null ? "Edit Row" : "Add Row"}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              id="edit-subject"
              label="Subject"
              value={subjectValue}
              onChange={(e) => setSubjectValue(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              id="edit-description"
              label="Description"
              value={descriptionValue}
              onChange={(e) => setDescriptionValue(e.target.value)}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSend} color="primary">
              {editIndex !== null ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default FormWithTable;
