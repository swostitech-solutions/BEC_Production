import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Card, Spinner, Table } from "react-bootstrap";
import { ApiUrl } from "../../../ApiUrl";

const AdmBookDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState({
    totalMembers: 0,
    totalBooks: 0,
    totalTitles: 0,
    booksIssued: 0,
    booksReturned: 0,
    students: 0,
    staff: 0,
  });
  const [recentIssues, setRecentIssues] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("accessToken");
      const academicYearId = sessionStorage.getItem("academicSessionId") || "1";
      const orgId = sessionStorage.getItem("organization_id");
      const branchId = sessionStorage.getItem("branch_id");

      if (!token) {
        console.error("Access token not found in sessionStorage.");
        setError("Unauthorized: Missing access token.");
        setLoading(false);
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Fetch Library Statistics
      const statsUrl = `${ApiUrl.apiurl}LibraryStatistics/?academic_year_id=${academicYearId}&organization_id=${orgId}&branch_id=${branchId}`;

      const statsResponse = await fetch(statsUrl, { method: "GET", headers });
      const statsResult = await statsResponse.json();

      if (statsResponse.ok && (statsResult.message === "success" || statsResult.message === "Library statistics retrieved successfully")) {
        const data = statsResult.data;
        setDashboardData({
          totalMembers: data.totalMembers || 0,
          totalBooks: data.totalBooks || 0,
          totalTitles: data.totalTitles || 0,
          booksIssued: data.totalBookIssues
            || 0,
          booksReturned: data.totalBooksReturned
            || 0,
          students: data.totalMembersBreakdown?.students || 0,
          staff: data.totalMembersBreakdown?.staff || 0,
        });
      }

      // Fetch recent book issues
      // flag=A means "All" (both issued and returned books)
      const issuesUrl = `${ApiUrl.apiurl}ISSUEBOOK/BOOKISSUESEARCHLIST/?academic_year_id=${academicYearId}&flag=A`;
      const issuesResponse = await fetch(issuesUrl, { method: "GET", headers });
      const issuesResult = await issuesResponse.json();

      if (issuesResponse.ok && issuesResult.message === "success") {
        // Get only the 10 most recent issues
        // Sort by issue_date descending, then by book_issue_id descending
        const allIssues = issuesResult.data || [];
        const sortedIssues = allIssues.sort((a, b) => {
          const dateDiff = new Date(b.issue_date) - new Date(a.issue_date);
          if (dateDiff !== 0) return dateDiff;
          return (b.book_issue_id || 0) - (a.book_issue_id || 0);
        });
        const recent = sortedIssues.slice(0, 10);
        setRecentIssues(recent);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Users",
      value: dashboardData.totalMembers,
      sub: "Total No Of Members",
      bg: "#e0f7fa",
      icon: "👤",
      color: "#00838f",
    },
    {
      label: "Books",
      value: dashboardData.totalBooks,
      sub: "Total No Of Books",
      bg: "#e8f5e9",
      icon: "📚",
      color: "#2e7d32",
    },
    {
      label: "Titles",
      value: dashboardData.totalTitles,
      sub: "Total No Of Titles",
      bg: "#fff3e0",
      icon: "📖",
      color: "#ef6c00",
    },
    {
      label: "Books Issued",
      value: dashboardData.booksIssued,
      sub: "Total No Of Books Issued",
      bg: "#ffebee",
      icon: "📕",
      color: "#c62828",
    },
    {
      label: "Books Returned",
      value: dashboardData.booksReturned,
      sub: "Total No Of Books Returned",
      bg: "#e3f2fd",
      icon: "✅",
      color: "#1565c0",
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <h4
                style={{
                  marginBottom: "20px",
                  textAlign: "center",
                  fontWeight: "700",
                  color: "#333",
                }}
              >
                📚 LIBRARY DASHBOARD
              </h4>

              {/* Library Photo Banner */}
              <Row className="mb-4 justify-content-center">
                <Col md={12}>
                  <div
                    style={{
                      width: "100%",
                      height: "250px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    <img
                      src="/Assets/library.jpg"
                      alt="Library"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </Col>
              </Row>

              {error && (
                <div className="alert alert-warning text-center">{error}</div>
              )}

              {/* Stats Cards */}
              <Row className="mt-3 mb-4 justify-content-center">
                {stats.map((item, idx) => (
                  <Col
                    key={idx}
                    className="mb-3 d-flex justify-content-center"
                  >
                    <Card
                      style={{
                        backgroundColor: item.bg,
                        width: "180px",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        transition: "transform 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "translateY(-5px)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "translateY(0)")
                      }
                    >
                      <Card.Body className="text-center">
                        <div style={{ fontSize: "30px" }}>{item.icon}</div>
                        <h3
                          style={{
                            color: item.color,
                            fontWeight: "bold",
                            marginBottom: "4px",
                          }}
                        >
                          {item.value}
                        </h3>
                        <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                          {item.sub}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Member Breakdown */}
              <Row className="mb-4 justify-content-center">
                <Col md={6}>
                  <Card
                    style={{
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Card.Body>
                      <h5
                        style={{
                          fontWeight: "600",
                          marginBottom: "15px",
                          color: "#333",
                        }}
                      >
                        👥 Member Breakdown
                      </h5>
                      <Row>
                        <Col xs={6}>
                          <div
                            className="p-3 text-center"
                            style={{
                              backgroundColor: "#e8f5e9",
                              borderRadius: "8px",
                            }}
                          >
                            <h4 style={{ color: "#2e7d32", marginBottom: "5px" }}>
                              {dashboardData.students}
                            </h4>
                            <small style={{ color: "#666" }}>Students</small>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div
                            className="p-3 text-center"
                            style={{
                              backgroundColor: "#e3f2fd",
                              borderRadius: "8px",
                            }}
                          >
                            <h4 style={{ color: "#1565c0", marginBottom: "5px" }}>
                              {dashboardData.staff}
                            </h4>
                            <small style={{ color: "#666" }}>Staff</small>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Recent Issues Table */}
              <Card
                style={{
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body>
                  <h5
                    style={{
                      fontWeight: "600",
                      marginBottom: "15px",
                      color: "#333",
                    }}
                  >
                    📋 Recent Book Issues
                  </h5>
                  {recentIssues.length > 0 ? (
                    <Table bordered size="sm">
                      <thead style={{ backgroundColor: "#f8f9fa" }}>
                        <tr>
                          <th>Sl No.</th>
                          <th>Book Name</th>
                          <th>Borrower</th>
                          <th>Type</th>
                          <th>Issue Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentIssues.map((issue, index) => (
                          <tr key={issue.book_issue_id || index}>
                            <td>{index + 1}</td>
                            <td>{issue.book_name || issue.bookName || "-"}</td>
                            <td>{issue.student_name || issue.name || issue.professor_name || "-"}</td>
                            <td>
                              <span
                                className={`badge ${issue.student_id
                                  ? "bg-success"
                                  : "bg-primary"
                                  }`}
                              >
                                {issue.student_id ? "Student" : "Staff"}
                              </span>
                            </td>
                            <td>{formatDate(issue.issue_date)}</td>
                            <td>
                              <span
                                className={`badge ${issue.return_date
                                  ? "bg-secondary"
                                  : "bg-warning text-dark"
                                  }`}
                              >
                                {issue.return_date ? "Returned" : "Issued"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-center py-4" style={{ color: "#888" }}>
                      No recent book issues found
                    </div>
                  )}
                </Card.Body>
              </Card>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmBookDashboard;
