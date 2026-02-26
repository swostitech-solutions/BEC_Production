import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const StudentTimeTable = () => {
  const navigate = useNavigate();
  const [timeTableData, setTimeTableData] = useState([]);
  const [batchId, setBatchId] = useState(null);
  const [academicYearId, setAcademicYearId] = useState(null);
  const [batchIdFetched, setBatchIdFetched] = useState(false);
  const [viewType, setViewType] = useState({ value: "weekly", label: "Weekly" });
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  // Get the start of the week (Monday)
  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }

  // Generate week dates starting from Monday
  const getWeekDates = () => {
    const dates = [];
    const dayNames = ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

    for (let i = 0; i < 6; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push({
        dayName: dayNames[i],
        dayFull: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][i],
        date: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }),
      });
    }
    return dates;
  };

  // Generate month dates (all weekdays in the month)
  const getMonthDates = () => {
    const dates = [];
    const dayNames = ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
    const dayFullNames = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get the first and last day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0); // Last day of the month

    // Iterate through all days in the month
    for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      // Convert Sunday (0) to 6, Monday (1) to 0, etc.
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      // Only include Mon-Sat (skip Sunday)
      if (adjustedDay >= 0 && adjustedDay < 6) {
        dates.push({
          dayName: dayNames[adjustedDay],
          dayFull: dayFullNames[adjustedDay],
          date: date.getDate(),
          month: date.toLocaleString('default', { month: 'short' }),
        });
      }
    }

    return dates;
  };

  const weekDates = getWeekDates();
  const monthDates = getMonthDates();
  const displayDates = viewType.value === "monthly" ? monthDates : weekDates;
  const periods = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];

  useEffect(() => {
    fetchStudentBatchId();
  }, []);

  useEffect(() => {
    if (batchIdFetched) {
      fetchTimeTableData();
    }
  }, [batchId, academicYearId, batchIdFetched]);

  const fetchStudentBatchId = async () => {
    try {
      const studentId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
      const organizationId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
      const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");
      const token = localStorage.getItem("accessToken");

      if (!studentId || !organizationId || !branchId) {
        setBatchId(null);
        setAcademicYearId(null);
        setBatchIdFetched(true);
        return;
      }

      const url = `${ApiUrl.apiurl}StudentCourse/GetStudentDataBasedId/?student_id=${studentId}&branch_id=${branchId}&organization_id=${organizationId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.message === "Success" && result.data) {
          if (result.data.batch_id) {
            setBatchId(result.data.batch_id);
          } else {
            setBatchId(null);
          }
          if (result.data.academic_year_id) {
            setAcademicYearId(result.data.academic_year_id);
          } else {
            setAcademicYearId(null);
          }
        } else {
          setBatchId(null);
          setAcademicYearId(null);
        }
      } else {
        setBatchId(null);
        setAcademicYearId(null);
      }
    } catch (error) {
      setBatchId(null);
      setAcademicYearId(null);
    } finally {
      setBatchIdFetched(true);
    }
  };

  const fetchTimeTableData = async () => {
    try {
      const orgId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId") || "";
      const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId") || "";

      if (!orgId || !branchId) {
        setTimeTableData([]);
        return;
      }

      const params = new URLSearchParams();
      params.append("organization_id", orgId);
      params.append("branch_id", branchId);

      if (batchId !== null && batchId !== undefined && batchId !== "") {
        params.append("batch_id", batchId.toString());
      } else {
        params.append("batch_id", "");
      }

      if (academicYearId !== null && academicYearId !== undefined && academicYearId !== "") {
        params.append("academic_year_id", academicYearId.toString());
      }

      const apiUrl = `${ApiUrl.apiurl}TIME_TABLE/GetSearchedTimeTableList/?${params.toString()}`;

      const token = localStorage.getItem("accessToken");
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.message === "success" && Array.isArray(data.data)) {
        setTimeTableData(data.data);
      } else if (Array.isArray(data)) {
        setTimeTableData(data);
      } else if (data.data && Array.isArray(data.data)) {
        setTimeTableData(data.data);
      } else {
        setTimeTableData([]);
      }
    } catch (error) {
      setTimeTableData([]);
    }
  };

  // Get timetable entries for a specific day
  const getEntriesForDay = (dayFull) => {
    return timeTableData.filter((entry) => {
      const entryDay = (entry.schedule_day || entry.day || entry.day_name || "").toUpperCase();
      return entryDay === dayFull;
    });
  };

  // Get timetable entry for a specific day and period
  const getEntryForCell = (dayFull, periodIndex) => {
    const dayEntries = getEntriesForDay(dayFull);
    // If API doesn't return period info, distribute entries across periods
    if (dayEntries.length > 0 && !dayEntries[0].class_period && !dayEntries[0].period) {
      // Return entry at this index if available
      return dayEntries[periodIndex] || null;
    }
    // If API returns period info, find matching period
    return dayEntries.find((entry) => {
      const entryPeriod = entry.class_period || entry.period || entry.period_no || entry.period_number;
      return entryPeriod === periodIndex + 1;
    });
  };

  const handleClose = () => {
    navigate("/student/dashboards"); // Go back to dashboard
  };

  // Handle week navigation for weekly view
  const handlePreviousWeek = () => {
    const prevWeek = new Date(currentWeekStart);
    prevWeek.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeekStart);
    nextWeek.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(nextWeek);
  };

  // Handle month navigation for monthly view
  const handlePreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const viewOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  return (
    <div
      className="container-fluid p-3"
      style={{
        backgroundColor: "#e8f4fc",
        minHeight: "100vh",
        borderRadius: "8px"
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-danger"
          style={{
            width: "120px",
            borderRadius: "6px",
          }}
          onClick={handleClose}
        >
          Close
        </button>

        <h4
          className="mb-0"
          style={{
            fontWeight: "600",
            color: "#333",
            letterSpacing: "1px"
          }}
        >
          TIME TABLE
        </h4>

        <Select
          options={viewOptions}
          value={viewType}
          onChange={setViewType}
          styles={{
            control: (base) => ({
              ...base,
              minWidth: "120px",
              borderRadius: "4px",
            }),
          }}
        />
      </div>

      {/* Navigation for Weekly and Monthly Views */}
      {(viewType.value === "weekly" || viewType.value === "monthly") && (
        <div className="d-flex justify-content-center align-items-center mb-3">
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={viewType.value === "weekly" ? handlePreviousWeek : handlePreviousMonth}
            style={{ borderRadius: "20px", padding: "6px 16px" }}
          >
            ← Previous
          </button>
          <div
            className="text-center"
            style={{
              minWidth: "200px",
              fontWeight: "600",
              fontSize: "16px",
              color: "#333"
            }}
          >
            {viewType.value === "weekly"
              ? `Week of ${currentWeekStart.toLocaleDateString('default', { month: 'short', day: 'numeric' })}`
              : currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })
            }
          </div>
          <button
            className="btn btn-sm btn-outline-primary ms-2"
            onClick={viewType.value === "weekly" ? handleNextWeek : handleNextMonth}
            style={{ borderRadius: "20px", padding: "6px 16px" }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Timetable Grid */}
      <div className="table-responsive">
        <table
          className="table table-bordered mb-0"
          style={{
            borderCollapse: "separate",
            borderSpacing: "8px",
            border: "none"
          }}
        >
          <thead>
            <tr>
              <th
                className="text-center text-white"
                style={{
                  backgroundColor: "#9e9e9e",
                  borderRadius: "4px",
                  padding: "12px",
                  border: "none",
                  width: "80px"
                }}
              >
                Day
              </th>
              {periods.map((period, index) => (
                <th
                  key={period}
                  className="text-center text-white"
                  style={{
                    backgroundColor: "#9e9e9e",
                    borderRadius: "4px",
                    padding: "12px",
                    border: "none"
                  }}
                >
                  {period}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayDates.map((day, dayIndex) => (
              <tr key={day.dayFull}>
                {/* Day Column */}
                <td
                  className="text-center"
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "4px",
                    padding: "15px 10px",
                    border: "none",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                  }}
                >
                  <div style={{ fontWeight: "600", fontSize: "14px" }}>
                    {day.dayName}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {day.date}{day.month}
                  </div>
                </td>

                {/* Period Columns */}
                {periods.map((period, periodIndex) => {
                  const entry = getEntryForCell(day.dayFull, periodIndex);
                  const isLastPeriod = periodIndex === periods.length - 1;

                  return (
                    <td
                      key={`${day.dayFull}-${period}`}
                      className="text-center"
                      style={{
                        backgroundColor: isLastPeriod ? "#ffcdd2" : "#e8f5e9",
                        borderRadius: "4px",
                        padding: "15px 10px",
                        border: "none",
                        minHeight: "60px",
                        verticalAlign: "middle",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                      }}
                    >
                      {entry ? (
                        <div style={{ fontSize: "11px" }}>
                          <div style={{ fontWeight: "600", color: "#333" }}>
                            {entry.subject_name || entry.subject || "-"}
                          </div>
                          <div style={{ color: "#555", marginTop: "2px" }}>
                            {entry.lecture || entry.class_period || entry.period || "-"}
                          </div>
                          <div style={{ color: "#666", marginTop: "2px" }}>
                            {entry.professor_name || entry.teacher_name || entry.faculty_name || "-"}
                          </div>
                          <div style={{ color: "#888", fontSize: "10px" }}>
                            {entry.course || entry.course_name || "-"} - {entry.section || entry.section_name || "-"}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: "#aaa", fontSize: "11px" }}>-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTimeTable;
