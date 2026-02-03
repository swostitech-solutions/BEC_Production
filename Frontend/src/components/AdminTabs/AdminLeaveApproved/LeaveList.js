import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  height: 400,
};

export default function DataTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState("");
  const [description, setDescription] = useState("");
  const [editedRow, setEditedRow] = useState(null);
  const [editedApprovalStatus, setEditedApprovalStatus] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem("dataTableData");
    if (storedData) {
      setRows(JSON.parse(storedData));
    } else {
      // fetch("http://52.66.66.205:9000/staffapplyleavestatuslist/")
      fetch("http://52.66.66.205:9000/")
        .then((response) => response.json())
        .then((data) => {
          setRows(
            data.map((row) => ({
              ...row,
              Action: "",
              AuthorityMessage: "",
            }))
          );
          localStorage.setItem("dataTableData", JSON.stringify(data));
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearch = () => {
    const filteredRows = rows.filter((row) =>
      Object.values(row).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setRows(filteredRows);
    setPage(0);
  };

  const handleOpenModal = (row, isEdit) => {
    if (!isEdit) {
      return; // Do nothing if the button is for approving or denying leave
    }

    setEditedRow(row);
    setEditedApprovalStatus(row.ApprovalStatus);
    setEditedDescription(row.AuthorityMessage);
    setOpen(true); // Open the modal for editing
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleSendApproval = (row, newStatus, authorityMessage) => {
    const { id } = row;

    fetch(`http://52.66.66.205:9000/leaveappliedstatementupdate/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
        authority_reply: authorityMessage,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedRows = rows.map((row) =>
          row.id === id
            ? {
                ...row,
                ApprovalStatus: newStatus,
                AuthorityMessage: authorityMessage,
              }
            : row
        );
        setRows(updatedRows);
        localStorage.setItem("dataTableData", JSON.stringify(updatedRows));
      })
      .catch((error) => {
        console.error("Error sending approval:", error);
      });
  };

  const handleEdit = () => {
    if (editedRow) {
      const { id } = editedRow;

      fetch(`http://52.66.66.205:9000/leaveappliedstatementupdate/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: editedApprovalStatus,
          authority_reply: editedDescription,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const updatedRows = rows.map((row) =>
            row.id === id
              ? {
                  ...row,
                  ApprovalStatus: editedApprovalStatus,
                  AuthorityMessage: editedDescription,
                }
              : row
          );
          setRows(updatedRows);
          localStorage.setItem("dataTableData", JSON.stringify(updatedRows));

          setEditedRow(null);
          setOpen(false);
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    }
  };

  // const handleDelete = (row) => {
  //   console.log(`Deleting row with id: ${row.id}`);

  //   const isConfirmed = window.confirm(
  //     "Are you sure you want to delete this row?"
  //   );
  //   if (isConfirmed) {
  //     const updatedRows = rows.filter((r) => r.id !== row.id);
  //     setRows(updatedRows);
  //     localStorage.setItem("dataTableData", JSON.stringify(updatedRows));
  //   }
  // };

  const handleDelete = (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this row?"
    );
    if (isConfirmed) {
      fetch(`http://52.66.66.205:9000/applyleavedelete/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            const updatedRows = rows.filter((row) => row.id !== id);
            setRows(updatedRows);
            localStorage.setItem("dataTableData", JSON.stringify(updatedRows));
          } else {
            console.error("Failed to delete row:", response.statusText);
          }
        })
        .catch((error) => {
          console.error("Error deleting row:", error);
        });
    }
  };

 

  return (
    <>
      <div>
        <Modal open={open} onClose={handleCloseModal}>
          <Box sx={{ ...style }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {editedRow
                ? "Edit Approval Status and Authority Message"
                : "Approve/Denied Leave"}
            </Typography>
            {!editedRow && (
              <>
                <TextField
                  select
                  label="Approval Status"
                  value={approvalStatus}
                  onChange={(e) => setApprovalStatus(e.target.value)}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                >
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="denied">Denied</MenuItem>
                </TextField>
                <TextField
                  label="Authority Message"
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
              </>
            )}
            {editedRow && (
              <>
                <TextField
                  select
                  label="Approval Status"
                  value={editedApprovalStatus}
                  onChange={(e) => setEditedApprovalStatus(e.target.value)}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                >
                  {/* <MenuItem value="Pending">Pending</MenuItem> */}
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Denied">Denied</MenuItem>
                </TextField>
                <TextField
                  label="Authority Message"
                  multiline
                  rows={4}
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
              </>
            )}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={editedRow ? handleEdit : handleSendApproval}
                size="small"
              >
                {editedRow ? "Update" : "Send"}
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>

      {rows.length > 0 && (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "20px", textAlign: "center" }}
          >
            Staff Leave Approve
          </Typography>
          <Divider />
          <Box height={10} />
          <Stack direction="row" spacing={2} className="my-2 mb-2">
            <TextField
              size="small"
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </Stack>
          <Box height={10} />
          <div style={{ overflowX: "auto" }}>
            <TableContainer sx={{ maxHeight: 430 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="left"
                      style={{
                        minWidth: "10px",
                        width: "100px",
                        fontWeight: "700",
                        fontSize: "17px",
                      }}
                    >
                      Sl. No.
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        minWidth: "150px",
                        width: "200px",
                        fontWeight: "700",
                        fontSize: "17px",
                      }}
                    >
                      Student Name
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        minWidth: "150px",
                        width: "150px",
                        fontWeight: "700",
                        fontSize: "17px",
                      }}
                    >
                      Leave Type
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        minWidth: "150px",
                        width: "150px",
                        fontWeight: "700",
                        fontSize: "17px",
                      }}
                    >
                      Start Date
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        minWidth: "150px",
                        width: "150px",
                        fontWeight: "700",
                        fontSize: "17px",
                      }}
                    >
                      End Date
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        minWidth: "200px",
                        width: "150px",
                        fontWeight: "700",
                        fontSize: "17px",
                      }}
                    >
                      Reason
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        minWidth: "100px",
                        width: "150px",
                        fontWeight: "700",
                        fontSize: "17px",
                      }}
                    >
                      Action
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        minWidth: "400px",
                        width: "200px",
                        fontWeight: "700",
                        fontSize: "17px",
                      }}
                    >
                      Authority Message
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        minWidth: "100px",
                        width: "150px",
                        fontWeight: "700",
                        fontSize: "17px",
                      }}
                    >
                      Edit
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        minWidth: "100px",
                        width: "150px",
                        fontWeight: "700",
                        fontSize: "17px",
                      }}
                    >
                      Delete
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.id}
                        >
                          <TableCell
                            align="left"
                            style={{ minWidth: "100px", width: "100px" }}
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ minWidth: "100px", width: "200px" }}
                          >
                            {row.studentName}
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ minWidth: "100px", width: "150px" }}
                          >
                            {row.leave_type_name}
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ minWidth: "100px", width: "150px" }}
                          >
                            {row.start_date}
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ minWidth: "100px", width: "150px" }}
                          >
                            {row.end_date}
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ minWidth: "100px", width: "150px" }}
                          >
                            {row.leave_reason}
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ minWidth: "100px", width: "150px" }}
                          >
                            <Stack spacing={2} direction="row">
                              <Button
                                variant="contained"
                                color={
                                  row.ApprovalStatus === "Approved"
                                    ? "success"
                                    : row.ApprovalStatus === "Denied"
                                    ? "error"
                                    : "primary"
                                }
                                style={{ marginRight: "8px" }}
                                onClick={() => handleOpenModal(row, false)}
                              >
                                {row.ApprovalStatus
                                  ? `${row.ApprovalStatus.charAt(
                                      0
                                    ).toUpperCase()}${row.ApprovalStatus.slice(
                                      1
                                    )}`
                                  : "Pending"}
                              </Button>
                            </Stack>
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ minWidth: "100px", width: "150px" }}
                          >
                            {row.AuthorityMessage}
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ minWidth: "100px", width: "150px" }}
                          >
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenModal(row, true)}
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ minWidth: "100px", width: "150px" }}
                          >
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(row.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <TablePagination
            rowsPerPageOptions={[7, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </>
  );
}
