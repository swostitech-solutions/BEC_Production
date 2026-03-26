import React, { useState, useEffect, useMemo, useRef } from "react";
import { Row, Col, Dropdown } from "react-bootstrap";
import Select from "react-select";
import { Link } from "react-router-dom";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaMoneyBillWave,
  FaBell,
  FaCalendarAlt,
  FaFileInvoice,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ApiUrl } from "../../ApiUrl";

const AutoLayoutExample = () => {
  const [accessibleModules, setAccessibleModules] = useState(null);
  const [isRestrictedUser, setIsRestrictedUser] = useState(false);

  // Check user permissions on mount
  useEffect(() => {
    const modulesStr = sessionStorage.getItem("accessible_modules");
    if (modulesStr) {
      try {
        const modules = JSON.parse(modulesStr);
        setAccessibleModules(modules);
        // If user has specific modules set, they are restricted
        setIsRestrictedUser(modules && modules.length > 0);
      } catch (error) {
        console.error("Error parsing accessible modules:", error);
        setAccessibleModules([]);
        setIsRestrictedUser(false);
      }
    } else {
      setIsRestrictedUser(false);
    }
  }, []);

  // Module display names mapping
  const moduleNames = {
    dashboard: "Dashboard",
    student: "Student Management",
    staff: "Staff Management",
    fee: "Fee Management",
    library: "Library",
    exam_results: "Exam Results",
    transport: "Transport",
    expense: "Expense Management",
    other_income: "Other Income",
    hostel: "Hostel Management",
    timetable: "TimeTable",
    lessonplan: "Lesson Plan",
    mentor: "Mentor Management",
    academics: "Academics",
    grievance: "Grievance Management",
    visitors: "Visitors Management",
    mou: "MOU",
    training_placements: "Training and Placements",
    inventory: "Inventory Management",
  };

  const [sessionFeeDetails, setSessionFeeDetails] = useState({});
  const [feeTableData, setFeeTableData] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);

  // Separate state for month and year dropdowns
  const [selectedMonthValue, setSelectedMonthValue] = useState(new Date().getMonth()); // 0-11
  const [selectedYearValue, setSelectedYearValue] = useState(new Date().getFullYear());

  // State for Session Fee Details year dropdown
  const [sessionFeeYear, setSessionFeeYear] = useState(new Date().getFullYear());

  // Month options for dropdown (these never change)
  const monthOptions = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" }
  ];

  // Generate dynamic year options (past 5 years and future 5 years from current year)
  // This automatically adapts to any future year
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push({ value: i, label: i.toString() });
    }
    return years;
  };

  // Year options for both Fee Dashboard and Session Fee Details
  const yearOptions = useMemo(() => generateYearOptions(), []);

  // Dashboard stats from API
  const [dashboardStats, setDashboardStats] = useState({
    total_active_student_count: 0,
    total_active_teacher_count: 0,
    total_present_student_percentage: 0,
  });

  // Notifications data
  const [grievances, setGrievances] = useState([]);
  const [documents, setDocuments] = useState([]);

  // Combined and sorted notifications (most recent first)
  const notifications = useMemo(() => {
    const items = [];
    (grievances || []).forEach((g) => {
      items.push({
        type: "grievance",
        date: g.submitted_date || g.submittedDate || g.submittedAt || null,
        title: `Grievance`,
        msg: g.details || g.remarks || "",
        action: g.ActionTaken,
      });
    });
    (documents || []).forEach((d) => {
      items.push({
        type: "document",
        date: d.uploaded_at || d.uploadedAt || null,
        title: `Document`,
        msg: d.remarks || "",
      });
    });
    return items.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [grievances, documents]);

  // Fetch academic year and set up localStorage if not already set
  useEffect(() => {
    const initializeData = async () => {
      // Get org_id and branch_id from localStorage or sessionStorage
      let org_id = localStorage.getItem("orgId") || sessionStorage.getItem("organization_id");
      let branch_id = localStorage.getItem("branchId") || sessionStorage.getItem("branch_id");

      // Store in localStorage if only available in sessionStorage
      if (!localStorage.getItem("orgId") && org_id) {
        localStorage.setItem("orgId", org_id);
      }
      if (!localStorage.getItem("branchId") && branch_id) {
        localStorage.setItem("branchId", branch_id);
      }

      // Fetch and set academic session if not available
      let academicSessionId = localStorage.getItem("academicSessionId");
      if (!academicSessionId && org_id && branch_id) {
        try {
          const response = await fetch(
            `${ApiUrl.apiurl}AcademicYear/GetAllAcademicYear/?organization_id=${org_id}&branch_id=${branch_id}`
          );
          const data = await response.json();
          if (data?.data?.length > 0) {
            const currentDate = new Date();
            const currentYear = data.data.find((year) => {
              const dateFrom = new Date(year.date_from);
              const dateTo = new Date(year.date_to);
              return currentDate >= dateFrom && currentDate <= dateTo;
            });
            const selectedYear = currentYear || data.data[0];
            localStorage.setItem("academicSessionId", selectedYear.id);
            academicSessionId = selectedYear.id;
          }
        } catch (err) {
          console.error("Error fetching academic years:", err);
        }
      }

      setIsDataReady(true);
    };

    initializeData();
  }, []);

  // Fetch dashboard stats when ready
  useEffect(() => {
    const fetchDashboard = async () => {
      const org_id = localStorage.getItem("orgId") || sessionStorage.getItem("organization_id");
      const branch_id = localStorage.getItem("branchId") || sessionStorage.getItem("branch_id");
      if (!org_id || !branch_id) return;

      try {
        const url = `${ApiUrl.apiurl}DashBoard/GetDashboardData/?organization_id=${org_id}&branch_id=${branch_id}`;
        console.log("Calling Dashboard API:", url);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();
        if (json?.message === "success" && json.data) {
          setDashboardStats({
            total_active_student_count: json.data.total_active_student_count ?? 0,
            total_active_teacher_count: json.data.total_active_teacher_count ?? 0,
            total_present_student_percentage: json.data.total_present_student_percentage ?? 0,
          });
          setGrievances(Array.isArray(json.data.grievance_details) ? json.data.grievance_details : []);
          setDocuments(Array.isArray(json.data.documents) ? json.data.documents : []);
        } else {
          console.warn("Unexpected dashboard response:", json);
        }
      } catch (err) {
        console.error("Dashboard API error:", err);
      }
    };

    if (isDataReady) fetchDashboard();
  }, [isDataReady]);

  // Fetch fee data when month or year changes
  useEffect(() => {
    if (!isDataReady || selectedMonthValue === undefined || selectedYearValue === undefined) return;

    // Clear only fee table data when month/year changes (Session Fee Details is independent)
    setFeeTableData([]);

    const month = selectedMonthValue;
    const year = selectedYearValue;

    // Calculate start_date (first day of month)
    const startDay = 1;
    const start_date = `${year}-${String(month + 1).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;

    // Calculate end_date (last day of month)
    const lastDayDate = new Date(year, month + 1, 0);
    const lastDay = lastDayDate.getDate();
    const end_date = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    const monthName = monthOptions[month].label;
    console.log(` Selected: ${monthName} ${year}`);
    console.log(` Date Range: ${start_date} to ${end_date} (${lastDay} days)`);

    const academic_year_id = localStorage.getItem("academicSessionId");
    const org_id = localStorage.getItem("orgId");
    const branch_id = localStorage.getItem("branchId");

    // Validate required data before making API calls
    if (!academic_year_id || !org_id || !branch_id) {
      console.warn("Missing required data:", { academic_year_id, org_id, branch_id });
      return;
    }

    // Fetch fee table data
    const url1 = `${ApiUrl.apiurl}FeesDashBoard/dashboard/?organization_id=${org_id}&branch_id=${branch_id}&batch_id=${academic_year_id}&from_date=${start_date}&to_date=${end_date}`;
    console.log(" Calling FeesDashBoard/dashboard API:", url1);

    fetch(url1)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(" FeesDashBoard/dashboard response:", data);
        if (Array.isArray(data?.data)) {
          // Data from dashboard API already has correct structure: receipt_date and received_amount
          setFeeTableData(data.data);
        } else {
          setFeeTableData([]);
        }
      })
      .catch((err) => console.error("Fee dashboard error:", err));
  }, [selectedMonthValue, selectedYearValue, isDataReady]);

  // Separate useEffect for Session Fee Details that responds to sessionFeeYear changes
  useEffect(() => {
    if (!isDataReady || sessionFeeYear === undefined) return;

    const academic_year_id = localStorage.getItem("academicSessionId");
    const org_id = localStorage.getItem("orgId");
    const branch_id = localStorage.getItem("branchId");

    if (!academic_year_id || !org_id || !branch_id) {
      console.warn("Missing required data for session fee:", { academic_year_id, org_id, branch_id });
      return;
    }

    // Fetch session fee details with year parameter
    // Backend API requires batch_id, organization_id, branch_id, and year
    const url2 = `${ApiUrl.apiurl}FeesDashBoard/FeesCalculateBasedOnBatch/?organization_id=${org_id}&branch_id=${branch_id}&batch_id=${academic_year_id}&year=${sessionFeeYear}`;
    console.log(" Calling FeesCalculateBasedOnBatch API with year:", url2);

    fetch(url2)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data?.data) {
          const d = data.data;
          const totalCollectable = d.element_amount - d.total_discount_amount;
          const totalBalance = totalCollectable - d.total_paid_amount;

          setSessionFeeDetails({
            totalDues: d.element_amount,
            totalDiscount: d.total_discount_amount,
            totalCollectable,
            totalCollected: d.total_paid_amount,
            totalBalance,
          });
        } else {
          setSessionFeeDetails({});
        }
      })
      .catch((err) => {
        console.error("Session fee error:", err);
        // Set default values on error
        setSessionFeeDetails({
          totalDues: 0,
          totalDiscount: 0,
          totalCollectable: 0,
          totalCollected: 0,
          totalBalance: 0,
        });
      });
  }, [sessionFeeYear, isDataReady]);

  // If user has restricted access, show welcome screen instead of full dashboard
  if (isRestrictedUser && accessibleModules && accessibleModules.length > 0) {
    const organizationName = sessionStorage.getItem("organization_name") || "Sparsh College";
    const userName = sessionStorage.getItem("username") || "User";

    return (
      <div className="container-fluid p-4">
        <Row className="mb-4">
          <Col>
            <div className="card">
              <div className="card-body text-center" style={{ padding: "40px 20px" }}>
                <h2 style={{ fontWeight: 600, color: "#2c3e50", marginBottom: "10px" }}>
                  Welcome to {organizationName}
                </h2>
                <p style={{ fontSize: "16px", color: "#6c757d", marginBottom: "0" }}>
                  Hello, <strong>{userName}</strong>
                </p>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4" style={{ fontWeight: 600, color: "#2c3e50" }}>
                  Your Authorized Modules
                </h5>
                <Row>
                  {accessibleModules.map((moduleCode, index) => (
                    <Col md={4} sm={6} key={index} className="mb-3">
                      <div className="card h-100" style={{
                        borderLeft: "4px solid #4a90e2",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease"
                      }}>
                        <div className="card-body d-flex align-items-center">
                          <FaCheckCircle size={20} style={{ color: "#28a745", marginRight: "12px", flexShrink: 0 }} />
                          <span style={{ fontSize: "15px", fontWeight: 500, color: "#2c3e50" }}>
                            {moduleNames[moduleCode] || moduleCode}
                          </span>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
                <div className="mt-4 p-3" style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  border: "1px solid #dee2e6"
                }}>
                  <p style={{ fontSize: "14px", color: "#6c757d", marginBottom: "0", textAlign: "center" }}>
                    Use the sidebar navigation to access your authorized modules. For additional access, please contact your system administrator.
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Row>
        <Col>
          <div className="card p-0">
            <div className="card-body">
              {/* Summary Cards */}
              <Row className="mb-4">
                <Col md={4}>
                  <div style={summaryCardStyle("#fecaca", "#f87171")}>
                    <FaUserGraduate size={30} />
                    <div>
                      <div style={summaryTextStyle}>Total Students</div>
                      <h2 style={summaryValueStyle}>
                        {dashboardStats.total_active_student_count?.toLocaleString() ||
                          "0"}
                      </h2>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div style={summaryCardStyle("#bfdbfe", "#60a5fa")}>
                    <FaChalkboardTeacher size={30} />
                    <div>
                      <div style={summaryTextStyle}>Teachers</div>
                      <h2 style={summaryValueStyle}>
                        {dashboardStats.total_active_teacher_count?.toLocaleString() ||
                          "0"}
                      </h2>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div style={summaryCardStyle("#bbf7d0", "#4ade80")}>
                    <FaMoneyBillWave size={30} />
                    <div>
                      <div style={summaryTextStyle}>Earnings</div>
                      <h2 style={summaryValueStyle}>
                        ₹
                        {sessionFeeDetails.totalCollected?.toLocaleString() ||
                          "0.00"}
                      </h2>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Progress and Notifications */}
              <Row className="mb-4 align-items-stretch">
                <Col md={6}>
                  <div style={sectionCardStyle}>
                    <div style={cardHeaderStyle}>
                      <span style={{ fontWeight: "600" }}>
                        <FaCalendarAlt
                          style={{ marginRight: "8px", color: "#6b7280" }}
                        />
                        Attendance
                      </span>

                    </div>
                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                      <div
                        style={{ width: 180, height: 180, margin: "0 auto" }}
                      >
                        <CircularProgressbarWithChildren
                          value={
                            dashboardStats.total_present_student_percentage || 0
                          }
                          styles={buildStyles({
                            pathColor: "#ef4444",
                            trailColor: "#e5e7eb",
                          })}
                        >
                          <div
                            style={{
                              fontSize: 20,
                              fontWeight: "bold",
                              marginTop: -5,
                            }}
                          >
                            {`${(
                              dashboardStats.total_present_student_percentage ??
                              0
                            ).toFixed(1)} %`}
                          </div>
                        </CircularProgressbarWithChildren>
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#6b7280",
                          marginTop: "10px",
                        }}
                      ></div>
                    </div>
                  </div>
                </Col>

                <Col md={6}>
                  <div style={sectionCardStyle}>
                    <h6 style={{ fontWeight: "bold" }}>
                      <FaBell
                        style={{ marginRight: "8px", color: "#f59e0b" }}
                      />
                      Notifications
                    </h6>

                    <div
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.7",
                        marginTop: "10px",
                        flexGrow: 1, //  THIS MAKES HEIGHT MATCH
                        overflowY: "auto", //  Scroll if more notifications
                      }}
                    >
                      {notifications && notifications.length > 0 ? (
                        // Render all notifications returned from API
                        notifications.map((item, i) => (
                          <div key={i} style={{ display: "flex", gap: "10px" }}>
                            <span
                              style={{
                                color: "#2563eb",
                                fontWeight: "bold",
                                minWidth: "120px",
                              }}
                            >
                              {item.date
                                ? new Date(item.date).toLocaleString()
                                : ""}
                            </span>
                            <span>
                              <strong>{item.title}</strong>
                              {": "}
                              {item.type === "grievance" ? (
                                <>
                                  {item.msg}{" "}
                                  {item.action ? `(${item.action})` : ""}
                                </>
                              ) : (
                                <>{item.msg}</>
                              )}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div style={{ color: "#6b7280" }}>No notifications</div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Fee Dashboard & Session Fee */}
              <Row>
                <Col md={8} className="mb-4">
                  <div style={sectionCardStyle}>
                    <div style={cardHeaderStyle}>
                      <h6 style={{ fontWeight: "bold" }}>
                        <FaCalendarAlt
                          style={{ marginRight: "8px", color: "#6b7280" }}
                        />
                        Fee Dashboard
                      </h6>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <label htmlFor="month" style={{ margin: 0 }}>
                          Month
                        </label>
                        <Select
                          id="month"
                          value={
                            monthOptions.find(
                              (opt) => opt.value === selectedMonthValue
                            ) || null
                          }
                          onChange={(selected) => {
                            setSelectedMonthValue(selected.value);
                          }}
                          options={monthOptions}
                          classNamePrefix="react-select"
                          isSearchable={false}
                          styles={{
                            container: (provided) => ({
                              ...provided,
                              width: "150px",
                            }),
                          }}
                        />

                        <label
                          htmlFor="year"
                          style={{ margin: 0, marginLeft: "20px" }}
                        >
                          Year
                        </label>
                        <Select
                          id="year"
                          value={
                            yearOptions.find(
                              (opt) => opt.value === selectedYearValue
                            ) || null
                          }
                          onChange={(selected) => {
                            setSelectedYearValue(selected.value);
                          }}
                          options={yearOptions}
                          classNamePrefix="react-select"
                          isSearchable={false}
                          styles={{
                            container: (provided) => ({
                              ...provided,
                              width: "120px",
                            }),
                          }}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        gap: "8px",
                        marginTop: "15px",
                      }}
                    >
                      {(() => {
                        // Calculate days in the selected month
                        const daysInMonth = new Date(
                          selectedYearValue,
                          selectedMonthValue + 1,
                          0
                        ).getDate();
                        return Array.from({ length: daysInMonth }, (_, i) => {
                          const day = i + 1;
                          const match = feeTableData.find(
                            (item) =>
                              new Date(item.receipt_date).getDate() === day
                          );
                          return (
                            <div
                              key={i}
                              style={{
                                height: "70px",
                                background: "#f9fafb",
                                padding: "6px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                boxShadow: "inset 0 0 3px rgba(0,0,0,0.1)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <strong>{day}</strong>
                              {match && match.received_amount ? (
                                <Link
                                  to="/paymentdetails"
                                  state={{ selectedDate: match.receipt_date }}
                                  style={{
                                    fontSize: "12px",
                                    color: "#065f46", // Deep green
                                    marginTop: "4px",
                                    textDecoration: "none",
                                    fontWeight: "600",
                                  }}
                                >
                                  Fee: ₹{match.received_amount}
                                </Link>
                              ) : null}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </Col>

                <Col md={4} className="mb-4">
                  <div style={sectionCardStyle}>
                    <div style={cardHeaderStyle}>
                      <h6 style={{ fontWeight: "bold", marginBottom: 0 }}>
                        <FaFileInvoice
                          style={{ marginRight: "8px", color: "#6b7280" }}
                        />
                        Session Fee Details
                      </h6>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <label htmlFor="sessionYear" style={{ margin: 0, fontSize: "12px", fontWeight: "500", whiteSpace: "nowrap", color: "#6b7280" }}>
                          Year:
                        </label>
                        <Select
                          id="sessionYear"
                          value={yearOptions.find(opt => opt.value === sessionFeeYear) || null}
                          onChange={(selected) => setSessionFeeYear(selected.value)}
                          options={yearOptions}
                          classNamePrefix="react-select"
                          isSearchable={false}
                          menuPlacement="auto"
                          styles={{
                            container: (provided) => ({
                              ...provided,
                              width: "110px",
                            }),
                            control: (provided) => ({
                              ...provided,
                              minHeight: "28px",
                              height: "28px",
                              fontSize: "12px",
                              borderRadius: "4px",
                              borderColor: "#d1d5db",
                              backgroundColor: "white",
                            }),
                            valueContainer: (provided) => ({
                              ...provided,
                              height: "28px",
                              padding: "0 6px",
                              display: "flex",
                              alignItems: "center",
                            }),
                            singleValue: (provided) => ({
                              ...provided,
                              color: "#1f2937",
                              fontSize: "12px",
                              lineHeight: "1",
                              margin: 0,
                            }),
                            input: (provided) => ({
                              ...provided,
                              margin: "0",
                              padding: "0",
                            }),
                            indicatorsContainer: (provided) => ({
                              ...provided,
                              height: "28px",
                            }),
                            indicatorSeparator: () => ({
                              display: "none",
                            }),
                            dropdownIndicator: (provided) => ({
                              ...provided,
                              padding: "2px",
                              color: "#6b7280",
                            }),
                            menu: (provided) => ({
                              ...provided,
                              zIndex: 9999,
                              fontSize: "12px",
                              maxHeight: "200px",
                            }),
                            menuList: (provided) => ({
                              ...provided,
                              maxHeight: "200px",
                              overflowY: "auto",
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              fontSize: "12px",
                              padding: "6px 8px",
                            }),
                          }}
                        />
                      </div>
                    </div>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        fontSize: "14px",
                        lineHeight: "1.8",
                        marginTop: "15px",
                      }}
                    >
                      <li>
                        <strong>Total Dues:</strong> ₹
                        {sessionFeeDetails.totalDues?.toLocaleString() ||
                          "0.00"}
                      </li>
                      <li>
                        <strong>Total Discount:</strong> ₹
                        {sessionFeeDetails.totalDiscount?.toLocaleString() ||
                          "0.00"}
                      </li>
                      <li>
                        <strong>Total Collectable:</strong> ₹
                        {sessionFeeDetails.totalCollectable?.toLocaleString() ||
                          "0.00"}
                      </li>
                      <li>
                        <strong>Total Collected:</strong> ₹
                        {sessionFeeDetails.totalCollected?.toLocaleString() ||
                          "0.00"}
                      </li>
                      <li>
                        <strong>Total Balance:</strong> ₹
                        {sessionFeeDetails.totalBalance?.toLocaleString() ||
                          "0.00"}
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const summaryTextStyle = { fontSize: "16px", fontWeight: 600 };
const summaryValueStyle = { marginTop: "5px", fontWeight: 700 };
const sectionCardStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "16px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  height: "100%", // ✅ IMPORTANT
  display: "flex", // ✅ IMPORTANT
  flexDirection: "column", // ✅ IMPORTANT
};
const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const summaryCardStyle = (startColor, endColor) => ({
  background: `linear-gradient(135deg, ${startColor}, ${endColor})`,
  padding: "20px",
  borderRadius: "16px",
  color: "#1f2937",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  display: "flex",
  alignItems: "center",
  gap: "15px",
});

export default AutoLayoutExample;
