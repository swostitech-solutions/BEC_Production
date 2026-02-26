import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";

const StdLibrary = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalBorrowed: 0,
    currentlyBorrowed: 0,
    returned: 0,
    overdue: 0,
  });

  useEffect(() => {
    fetchLibraryData();
  }, []);

  const fetchLibraryData = async () => {
    try {
      setError("");
      const studentId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
      const token = localStorage.getItem("accessToken");

      if (!studentId) {
        setError("Session data not found. Please login again.");
        return;
      }


      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }
      // The backend requires flag parameter (default is 'A' for All)
      // 'A' = All books, 'I' = Issued books only (not returned)
      // Note: Removed academic_year_id parameter as it was incorrectly using batch_id

      const apiUrl = `${ApiUrl.apiurl}ISSUEBOOK/BOOKISSUESEARCHLIST/?student_id=${studentId}&flag=A`;

      console.log("Fetching library data from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Library API response:", result);

      if (result.message === "success" && Array.isArray(result.data)) {
        const books = result.data || [];
        setBorrowedBooks(books);

        // Calculate stats
        const currentlyBorrowed = books.filter(
          (book) => !book.return_date
        ).length;
        const returned = books.filter((book) => book.return_date).length;
        const overdue = books.filter((book) => {
          if (!book.return_date && book.due_date) {
            return new Date(book.due_date) < new Date();
          }
          return false;
        }).length;

        setStats({
          totalBorrowed: books.length,
          currentlyBorrowed,
          returned,
          overdue,
        });
      } else if (result.message === "No Record Found" || result.message === "No record Found") {
        // No books found - this is a valid state, not an error
        setBorrowedBooks([]);
        setStats({
          totalBorrowed: 0,
          currentlyBorrowed: 0,
          returned: 0,
          overdue: 0,
        });
      } else {
        console.warn("Unexpected API response:", result);
        setError(result.message || "Failed to fetch library data");
        setBorrowedBooks([]);
      }
    } catch (err) {
      console.error("Error fetching library data:", err);
      setError("Failed to fetch library data: " + err.message);
      setBorrowedBooks([]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (book) => {
    if (book.return_date) {
      return <Badge bg="success">Returned</Badge>;
    }
    if (book.due_date && new Date(book.due_date) < new Date()) {
      return <Badge bg="danger">Overdue</Badge>;
    }
    return <Badge bg="primary">Borrowed</Badge>;
  };

  const statsCards = [
    {
      label: "Total Borrowed",
      value: stats.totalBorrowed,
      bg: "#e3f2fd",
      icon: "📚",
      color: "#1976d2",
    },
    {
      label: "Currently Borrowed",
      value: stats.currentlyBorrowed,
      bg: "#fff3e0",
      icon: "📖",
      color: "#f57c00",
    },
    {
      label: "Returned",
      value: stats.returned,
      bg: "#e8f5e9",
      icon: "✅",
      color: "#388e3c",
    },
    {
      label: "Overdue",
      value: stats.overdue,
      bg: "#ffebee",
      icon: "⚠️",
      color: "#d32f2f",
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4 px-3 mt-3">
                <Button variant="danger" onClick={() => navigate("/student/dashboards")} style={{ width: "120px" }}>
                  Close
                </Button>
                <h4
                  style={{
                    margin: 0,
                    textAlign: "center",
                    fontWeight: "700",
                    color: "#333",
                    flex: 1,
                  }}
                >
                  📚 MY LIBRARY
                </h4>
                <div style={{ width: "120px" }}></div>
              </div>

              {error && (
                <div className="alert alert-danger text-center">{error}</div>
              )}

              {/* Stats Cards */}
              <Row className="mb-4 justify-content-center">
                {statsCards.map((item, idx) => (
                  <Col
                    key={idx}
                    xs={6}
                    md={3}
                    className="mb-3 d-flex justify-content-center"
                  >
                    <Card
                      style={{
                        backgroundColor: item.bg,
                        width: "100%",
                        maxWidth: "200px",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Card.Body className="text-center py-3">
                        <div style={{ fontSize: "28px", marginBottom: "8px" }}>
                          {item.icon}
                        </div>
                        <h3
                          style={{
                            color: item.color,
                            fontWeight: "bold",
                            marginBottom: "4px",
                          }}
                        >
                          {item.value}
                        </h3>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "13px",
                            color: "#666",
                          }}
                        >
                          {item.label}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Borrowed Books Table */}
              <div className="table-responsive">
                <h5
                  style={{
                    marginBottom: "15px",
                    fontWeight: "600",
                    color: "#444",
                  }}
                >
                  Book History
                </h5>
                {borrowedBooks.length > 0 ? (
                  <Table striped bordered hover>
                    <thead style={{ backgroundColor: "#f8f9fa" }}>
                      <tr>
                        <th style={{ width: "50px" }}>#</th>
                        <th>Book Name</th>
                        <th>Barcode</th>
                        <th>Issue Date</th>
                        <th>Due Date</th>
                        <th>Return Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {borrowedBooks.map((book, index) => (
                        <tr key={book.book_issue_id || index}>
                          <td>{index + 1}</td>
                          <td>{book.bookName || book.book_name || "-"}</td>
                          <td>{book.barcode || "-"}</td>
                          <td>{formatDate(book.issue_date)}</td>
                          <td>{formatDate(book.due_date)}</td>
                          <td>{formatDate(book.return_date)}</td>
                          <td>{getStatusBadge(book)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div
                    className="text-center py-5"
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                      📖
                    </div>
                    <h5 style={{ color: "#666" }}>No books borrowed yet</h5>
                    <p style={{ color: "#888" }}>
                      Visit your library to borrow books!
                    </p>
                  </div>
                )}
              </div>

              {/* Library Guidelines */}
              <div
                className="mt-4 p-3"
                style={{
                  backgroundColor: "#e3f2fd",
                  borderRadius: "8px",
                  border: "1px solid #90caf9",
                }}
              >
                <h6
                  style={{
                    color: "#1565c0",
                    fontWeight: "600",
                    marginBottom: "10px",
                  }}
                >
                  📋 Library Guidelines
                </h6>
                <ul
                  style={{
                    marginBottom: 0,
                    fontSize: "14px",
                    color: "#333",
                    paddingLeft: "20px",
                  }}
                >
                  <li>Books must be returned within the due date to avoid penalties.</li>
                  <li>Handle books with care and avoid marking or damaging them.</li>
                  <li>Lost or damaged books must be replaced or compensated.</li>
                  <li>Contact the library staff for any queries or assistance.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StdLibrary;
