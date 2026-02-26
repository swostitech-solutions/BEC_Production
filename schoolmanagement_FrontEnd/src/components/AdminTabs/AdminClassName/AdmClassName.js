// import React, { useEffect, useState } from "react";
// import {
//   TextField,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Card,
//   CardContent,
//   TablePagination,
//   Typography,
//   Modal,
//   Box,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";
// import SearchIcon from "@mui/icons-material/Search";
// import { ApiUrl } from "../../../ApiUrl";

// const FunctionForm = () => {
//   const [className, setClassName] = useState("");
//   const [description, setDescription] = useState("");
//   const [session, setSession] = useState("");
//   const [data, setData] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [editingClassName, setEditingClassName] = useState("");
//   const [editingDescription, setEditingDescription] = useState("");
//   const [editingSession, setEditingSession] = useState("");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSearch = () => {
//     // Placeholder function for search
//     console.log("Search functionality placeholder");
//   };

//   const handleSend = (e) => {
//     e.preventDefault();

//     if (!className.trim() || !description.trim() || !session.trim()) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     const formData = {
//       class_name: className,
//       section_class: session.slice(0, 2),
//       description: description,
//     };

//     fetch(`${ApiUrl.apiurl}classcreate/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to create class");
//         }
//         return response.json();
//       })
//       .then((dataFromServer) => {
//         // Fetch the updated data after successful submission
//         fetch(`${ApiUrl.apiurl}classlist/`)
//           .then((result) => result.json())
//           .then((resp) => {
//             setData(resp);
//             setIsModalOpen(false); // Close the modal after successful submission
//           })
//           .catch((error) => {
//             console.error("Error fetching data:", error);
//           });
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         alert("Failed to create class. Please try again.");
//       });

//     // Clear the form fields
//     setClassName("");
//     setDescription("");
//     setSession("");
//   };

//   const handleEdit = (index) => {
//     const entryToEdit = data[index];
//     setEditingIndex(index);
//     setEditingClassName(entryToEdit.class_name);
//     setEditingDescription(entryToEdit.description);
//     setEditingSession(entryToEdit.section_class);
//     setIsModalOpen(true);
//   };
//   const handleCancelEdit = () => {
//     setEditingIndex(null);
//     setEditingClassName("");
//     setEditingDescription("");
//     setEditingSession("");
//     setIsModalOpen(false);
//   };

//   const handleSaveEdit = () => {
//     const updatedData = [...data];
//     const id = updatedData[editingIndex].id;

//     if (
//       !editingClassName.trim() ||
//       !editingDescription.trim() ||
//       !editingSession.trim()
//     ) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     updatedData[editingIndex] = {
//       id: id,
//       class_name: editingClassName,
//       description: editingDescription,
//       section_class: editingSession,
//     };

//     fetch(`${ApiUrl.apiurl}classupdate/${id}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updatedData[editingIndex]),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to update");
//         }
//         return response.json();
//       })
//       .then((dataFromServer) => {
//         setData(updatedData);
//         setEditingIndex(null);
//         setEditingClassName("");
//         setEditingDescription("");
//         setEditingSession("");
//         setIsModalOpen(false);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   };

//   const handleDeleteById = (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this item?"
//     );
//     if (!confirmDelete) {
//       return;
//     }

//     fetch(`${ApiUrl.apiurl}classdelete/${id}`, {
//       method: "DELETE",
//     })
//       .then(() => {
//         const updatedData = data.filter((entry) => entry.id !== id);
//         setData(updatedData);
//         setEditingIndex(null);
//         setEditingClassName("");
//         setEditingDescription("");
//         setEditingSession("");
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   useEffect(() => {
//     fetch(`${ApiUrl.apiurl}classlist/`)
//       .then((result) => result.json())
//       .then((resp) => {
//         setData(resp);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//       });
//   }, []);

//   return (
//     <Card
//       style={{ width: "100%", margin: "auto", marginTop: "1px", height: "20%" }}
//     >
//       <Typography
//         variant="h5"
//         gutterBottom
//         style={{ textAlign: "center", fontWeight: "bold" }}
//       >
//         Class Name
//       </Typography>
//       <CardContent>
       
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: 1,
//           }}
//         >
//           <Button
//             onClick={() => setIsModalOpen(true)}
//             variant="contained"
//             color="primary"
//           >
//             Add Class
//           </Button>
//           <TextField
//             placeholder="Search..."
//             variant="outlined"
//             size="small"
//             InputProps={{
//               endAdornment: (
//                 <IconButton onClick={handleSearch} size="small">
//                   <SearchIcon />
//                 </IconButton>
//               ),
//             }}
//           />
//         </div>

//         <Modal
//           open={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           aria-labelledby="modal-title"
//           aria-describedby="modal-description"
//         >
//           <Box
//             sx={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               width: 400,
//               bgcolor: "background.paper",
//               boxShadow: 24,
//               p: 4,
//             }}
//           >
//             <Typography id="modal-title" variant="h6" component="h2">
//               {editingIndex !== null ? "Edit Class" : "Add Class"}
//             </Typography>
//             <form
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//               }}
//             >
//               <TextField
//                 label="Class Name"
//                 value={editingIndex !== null ? editingClassName : className}
//                 onChange={(e) =>
//                   editingIndex !== null
//                     ? setEditingClassName(e.target.value)
//                     : setClassName(e.target.value)
//                 }
//                 size="small"
//                 margin="normal"
//                 fullWidth
//               />
//               <TextField
//                 label="Description"
//                 value={editingIndex !== null ? editingDescription : description}
//                 onChange={(e) =>
//                   editingIndex !== null
//                     ? setEditingDescription(e.target.value)
//                     : setDescription(e.target.value)
//                 }
//                 size="small"
//                 margin="normal"
//                 fullWidth
//               />
//               <TextField
//                 label="Session"
//                 value={editingIndex !== null ? editingSession : session}
//                 onChange={(e) =>
//                   editingIndex !== null
//                     ? setEditingSession(e.target.value)
//                     : setSession(e.target.value)
//                 }
//                 size="small"
//                 margin="normal"
//                 fullWidth
//               />
//               <Button
//                 onClick={editingIndex !== null ? handleSaveEdit : handleSend}
//                 variant="contained"
//                 color="primary"
//                 style={{ marginTop: 8 }}
//               >
//                 {editingIndex !== null ? "Update" : "Send"}
//               </Button>
//               {editingIndex !== null && (
//                 <Button
//                   onClick={handleCancelEdit}
//                   variant="contained"
//                   color="secondary"
//                   style={{ marginTop: 8 }}
//                 >
//                   Cancel
//                 </Button>
//               )}
//             </form>
//           </Box>
//         </Modal>

//         {data.length > 0 && (
//           <div>
//             <TableContainer
//               component={Paper}
//               style={{ maxHeight: "350px", overflowY: "auto" }}
//             >
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell style={{ minWidth: "50px" }}>S.No</TableCell>
//                     <TableCell>Class Name</TableCell>
//                     <TableCell>Description</TableCell>
//                     <TableCell>Session</TableCell>
//                     <TableCell>Actions</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {data
//                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                     .map((entry, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{entry.class_name}</TableCell>
//                         <TableCell>{entry.description}</TableCell>
//                         <TableCell>{entry.section_class}</TableCell>
//                         <TableCell>
//                           <IconButton
//                             onClick={() => handleEdit(index)}
//                             style={{ color: "green" }}
//                           >
//                             <EditIcon />
//                           </IconButton>
//                           <IconButton
//                             onClick={() => handleDeleteById(entry.id)}
//                             style={{ color: "red" }}
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             <TablePagination
//               rowsPerPageOptions={[5, 10, 25]}
//               component="div"
//               count={data.length}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={(event, newPage) =>
//                 handleChangePage(event, newPage)
//               }
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default FunctionForm;


import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Modal,
  Table,
  Pagination,
  Container
} from "react-bootstrap";
import { ApiUrl } from "../../../ApiUrl";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const FunctionForm = () => {
  const [className, setClassName] = useState("");
  const [description, setDescription] = useState("");
  const [session, setSession] = useState("");
  const [data, setData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingClassName, setEditingClassName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingSession, setEditingSession] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = () => {
    // Placeholder function for search
    console.log("Search functionality placeholder");
  };

  const handleSend = (e) => {
    e.preventDefault();

    if (!className.trim() || !description.trim() || !session.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = {
      class_name: className,
      section_class: session.slice(0, 2),
      description: description,
    };

    fetch(`${ApiUrl.apiurl}classcreate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create class");
        }
        return response.json();
      })
      .then(() => {
        // Fetch the updated data after successful submission
        fetch(`${ApiUrl.apiurl}classlist/`)
          .then((result) => result.json())
          .then((resp) => {
            setData(resp);
            setIsModalOpen(false); // Close the modal after successful submission
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to create class. Please try again.");
      });

    // Clear the form fields
    setClassName("");
    setDescription("");
    setSession("");
  };

  const handleEdit = (index) => {
    const entryToEdit = data[index];
    setEditingIndex(index);
    setEditingClassName(entryToEdit.class_name);
    setEditingDescription(entryToEdit.description);
    setEditingSession(entryToEdit.section_class);
    setIsModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingClassName("");
    setEditingDescription("");
    setEditingSession("");
    setIsModalOpen(false);
  };

  const handleSaveEdit = () => {
    const updatedData = [...data];
    const id = updatedData[editingIndex].id;

    if (
      !editingClassName.trim() ||
      !editingDescription.trim() ||
      !editingSession.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    updatedData[editingIndex] = {
      id: id,
      class_name: editingClassName,
      description: editingDescription,
      section_class: editingSession,
    };

    fetch(`${ApiUrl.apiurl}classupdate/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData[editingIndex]),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update");
        }
        return response.json();
      })
      .then(() => {
        setData(updatedData);
        setEditingIndex(null);
        setEditingClassName("");
        setEditingDescription("");
        setEditingSession("");
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDeleteById = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) {
      return;
    }

    fetch(`${ApiUrl.apiurl}classdelete/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedData = data.filter((entry) => entry.id !== id);
        setData(updatedData);
        setEditingIndex(null);
        setEditingClassName("");
        setEditingDescription("");
        setEditingSession("");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetch(`${ApiUrl.apiurl}classlist/`)
      .then((result) => result.json())
      .then((resp) => {
        setData(resp);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <Container style={{ width: "100%", margin: "auto", marginTop: "1px" }}>
      <Card.Body style={{ border: "1px solid #ccc", backgroundColor: "#F0F0F0" }}>
        <h5 style={{ textAlign: "center", fontWeight: "bold" }}>Class Name</h5>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Button onClick={() => setIsModalOpen(true)} variant="primary">
            Add Class
          </Button>
          <Form.Control
            type="text"
            placeholder="Search..."
            style={{ width: "30%" }}
            onChange={handleSearch}
          />
        </div>
  
        <Modal
          show={isModalOpen}
          onHide={() => setIsModalOpen(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingIndex !== null ? "Edit Class" : "Add Class"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={editingIndex !== null ? handleSaveEdit : handleSend}>
              <Form.Group className="mb-3">
                <Form.Label style={{border:"1px solid black"}}>Class Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingIndex !== null ? editingClassName : className}
                  onChange={(e) =>
                    editingIndex !== null
                      ? setEditingClassName(e.target.value)
                      : setClassName(e.target.value)
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{border:"1px solid black"}}>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editingIndex !== null ? editingDescription : description}
                  onChange={(e) =>
                    editingIndex !== null
                      ? setEditingDescription(e.target.value)
                      : setDescription(e.target.value)
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{border:"1px solid black"}}>Session</Form.Label>
                <Form.Control
                  type="text"
                  value={editingIndex !== null ? editingSession : session}
                  onChange={(e) =>
                    editingIndex !== null
                      ? setEditingSession(e.target.value)
                      : setSession(e.target.value)
                  }
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                {editingIndex !== null ? "Update" : "Send"}
              </Button>
              {editingIndex !== null && (
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
            </Form>
          </Modal.Body>
        </Modal>
  
        {data.length > 0 && (
          <div>
            <Table striped bordered hover responsive>
              <thead style={{backgroundColor:"#87CEEB"}}>
                <tr style={{backgroundColor:"#87CEEB"}}>
                  <th style={{backgroundColor:"#87CEEB",border:"1px solid black"}}>S.No</th>
                  <th style={{backgroundColor:"#87CEEB",border:"1px solid black"}}>Class Name</th>
                  <th style={{backgroundColor:"#87CEEB",border:"1px solid black"}}>Description</th>
                  <th style={{backgroundColor:"#87CEEB",border:"1px solid black"}}>Session</th>
                  <th style={{backgroundColor:"#87CEEB",border:"1px solid black"}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((entry, index) => (
                    <tr key={index} style={{border:"1px solid black"}}>
                      <td style={{border:"1px solid black"}}>{index + 1}</td>
                      <td style={{border:"1px solid black"}}>{entry.class_name}</td>
                      <td style={{border:"1px solid black"}}>{entry.description}</td>
                      <td style={{border:"1px solid black"}}>{entry.section_class}</td>
                      <td style={{border:"1px solid black"}}>
                        <EditIcon
                          style={{ cursor: "pointer", color: "blue" }}
                          // onClick={() => handleEditById(entry.id)}
                        />
                        <DeleteIcon
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={() => handleDeleteById(entry.id)}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
  
            <div className="d-flex justify-content-end">
              <Pagination>
                <Pagination.Prev
                  onClick={() =>
                    handleChangePage(page > 0 ? page - 1 : page)
                  }
                  disabled={page === 0}
                />
                <Pagination.Item active>{page + 1}</Pagination.Item>
                <Pagination.Next
                  onClick={() =>
                    handleChangePage(
                      page < Math.ceil(data.length / rowsPerPage) - 1
                        ? page + 1
                        : page
                    )
                  }
                  disabled={page === Math.ceil(data.length / rowsPerPage) - 1}
                />
              </Pagination>
            </div>
          </div>
        )}
      </Card.Body>
    </Container>
  );
  
};

export default FunctionForm;

