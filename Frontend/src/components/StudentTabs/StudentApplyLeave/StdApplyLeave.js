

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StdApplyLeave.css";
import Container from "react-bootstrap/Container";

const FeeDashboard = () => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // A lighter shade of light blue
  const lighterLightBlue = "#E0FFFF";
  // Choose a new color for the details sections
  const lighterLightGreen = "#E8F5E9";

  // State to manage the selected month
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [feeData, setFeeData] = useState([]);

  // Function to get the current month in "Month-Year" format
  function getCurrentMonth() {
    const date = new Date();
    const monthName = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${monthName}-${year}`;
  }

  // Function to get month options for the year 2024
  const getMonthOptions = () => {
    const options = [];
    const year = 2024;
    for (let i = 0; i < 12; i++) {
      const date = new Date(year, i, 1);
      const monthName = date.toLocaleString("default", { month: "long" });
      options.push(
        <option key={i} value={`${monthName}-${year}`}>
          {`${monthName}-${year}`}
        </option>
      );
    }
    return options;
  };

  // Function to get the number of days in the selected month
  const getDaysInMonth = (monthYear) => {
    const [monthName, year] = monthYear.split("-");
    const month = new Date(Date.parse(monthName + " 1, " + year)).getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return daysInMonth;
  };

  // Function to get the first day of the month
  const getFirstDayOfMonth = (monthYear) => {
    const [monthName, year] = monthYear.split("-");
    const month = new Date(Date.parse(monthName + " 1, " + year)).getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay;
  };

  // Function to generate table days based on the selected month
  const generateCalendarData = () => {
    const daysInMonth = getDaysInMonth(selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedMonth);
    const calendarData = [];
    let day = 1;

    // Initialize calendar with empty strings
    for (let week = 0; week < 6; week++) {
      const weekData = [];
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (week === 0 && dayOfWeek < firstDay) {
          weekData.push(""); // Empty cell for days before the first of the month
        } else if (day <= daysInMonth) {
          const dateString = `${day}-${selectedMonth.split("-")[1]}`;
          const feeInfo = feeData.find((data) => data.date === dateString);
          weekData.push({ day, feeReceived: feeInfo ? feeInfo.feeReceived : null });
          day++;
        } else {
          weekData.push(""); // Empty cell for days after the end of the month
        }
      }
      // Only add weeks if they have at least one day in the month
      if (weekData.some((day) => day !== "")) {
        calendarData.push(weekData);
      }
    }

    return calendarData;
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Example fee data: Only one fee deposit date per month
  useEffect(() => {
    const exampleFeeData = [
      { date: "1-2024", feeReceived: 100 },
     
      // Add more fee data for other months if needed
    ];
    setFeeData(exampleFeeData);
  }, []);

  return (
    <Container className="fee-dashboard" style={{ backgroundColor: "#F0F0F0" }}>
      <div className="header">FEE DASHBOARD</div>
      <div className="month-selector">
        <label htmlFor="month">Month</label>
        <select
          id="month"
          name="month"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {getMonthOptions()}
        </select>
      </div>
      <table className="calendar">
        <thead>
          <tr>
            {days.map((day) => (
              <th key={day} style={{ backgroundColor: "#87CEEB" }}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {generateCalendarData().map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) => (
                <td key={dayIndex} style={{ textAlign: "center" }}>
                  {day && day.day}
                  {day && day.feeReceived && (
                    <Link to="/student/payment-details">
                      <div style={{ fontSize: "0.8em", color: "green" }}>
                        Fee: {day.feeReceived}
                      </div>
                    </Link>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="details">
        <div
          className="period-fee-details"
          style={{ backgroundColor: lighterLightGreen }}
        >
          <h3>Period Fee Details</h3>
          <p>
            Fee till Period:{" "}
            <span>
              {selectedMonth.split("-")[0].toUpperCase().slice(0, 3)}
              {selectedMonth.split("-")[1].slice(-2)}
            </span>
          </p>
          <p>
            Total Dues till {selectedMonth}: <span>0.00</span>
          </p>
          <p>
            Total Discount till {selectedMonth}: <span>0.00</span>
          </p>
          <p>
            Total Collectable till {selectedMonth}: <span>0.00</span>
          </p>
          <p>
            Total Collected till {selectedMonth}: <span>0.00</span>
          </p>
          <p>
            Total Due till {selectedMonth}: <span>0.00</span>
          </p>
        </div>
        <div
          className="session-fee-details"
          style={{ backgroundColor: lighterLightGreen }}
        >
          <h3>Session Fee Details</h3>
          <p>
            Session:{" "}
            <span>{`${selectedMonth.split("-")[1]}-${
              parseInt(selectedMonth.split("-")[1], 10) + 1
            }`}</span>
          </p>
          <p>
            Total Dues: <span>0.00</span>
          </p>
          <p>
            Total Discount: <span>0.00</span>
          </p>
          <p>
            Total Collectable: <span>0.00</span>
          </p>
          <p>
            Total Collected: <span>0.00</span>
          </p>
          <p>
            Total Balance: <span>0.00</span>
          </p>
        </div>
      </div>
    </Container>
  );
};

export default FeeDashboard;









