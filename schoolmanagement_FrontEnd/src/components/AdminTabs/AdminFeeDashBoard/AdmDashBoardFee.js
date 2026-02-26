// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "./AdmDashBoardFee.css";
// import Select from "react-select";
// import Container from "react-bootstrap/Container";

// const FeeDashboard = () => {
//   const days = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];

//   const [periodOptions, setPeriodOptions] = useState([]);


//  useEffect(() => {
//    fetch(`${ApiUrl.apiurl}Periods/GetAllPeriods/`)
//      .then((res) => res.json())
//      .then((data) => {
//        if (data?.data) {
//          const options = data.data.map((period) => ({
//            label: period.period_name,
//            value: period.period_name,
//          }));
//          setPeriodOptions(options);
//        }
//      })
//      .catch((error) => {
//        console.error("Error fetching periods:", error);
//      });
//  }, []);


//   // State to manage the selected month
//   const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
//   const [feeData, setFeeData] = useState([]);

//   // Function to get the current month in "Month-Year" format
//   function getCurrentMonth() {
//     const date = new Date();
//     const monthName = date.toLocaleString("default", { month: "long" });
//     const year = date.getFullYear();
//     return `${monthName}-${year}`;
//   }

//   // Function to get month options for the year 2024
//   const getMonthOptions = () => {
//     const options = [];
//     const year = 2024;
//     for (let i = 0; i < 12; i++) {
//       const date = new Date(year, i, 1);
//       const monthName = date.toLocaleString("default", { month: "long" });
//       options.push(
//         <option key={i} value={`${monthName}-${year}`}>
//           {`${monthName}-${year}`}
//         </option>
//       );
//     }
//     return options;
//   };


//    const handleMonthChange = (option) => {
//      setSelectedMonth(option.value);
//    };
//   // Function to get the number of days in the selected month
//   const getDaysInMonth = (monthYear) => {
//     const [monthName, year] = monthYear.split("-");
//     const month = new Date(Date.parse(monthName + " 1, " + year)).getMonth();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     return daysInMonth;
//   };

//   // Function to get the first day of the month
//   const getFirstDayOfMonth = (monthYear) => {
//     const [monthName, year] = monthYear.split("-");
//     const month = new Date(Date.parse(monthName + " 1, " + year)).getMonth();
//     const firstDay = new Date(year, month, 1).getDay();
//     return firstDay;
//   };

//   // Function to generate table days based on the selected month
//   const generateCalendarData = () => {
//     const daysInMonth = getDaysInMonth(selectedMonth);
//     const firstDay = getFirstDayOfMonth(selectedMonth);
//     const calendarData = [];
//     let day = 1;

//     // Initialize calendar with empty strings
//     for (let week = 0; week < 6; week++) {
//       const weekData = [];
//       for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
//         if (week === 0 && dayOfWeek < firstDay) {
//           weekData.push(""); // Empty cell for days before the first of the month
//         } else if (day <= daysInMonth) {
//           const dateString = `${day}-${selectedMonth.split("-")[1]}`;
//           const feeInfo = feeData.find((data) => data.date === dateString);
//           weekData.push({ day, feeReceived: feeInfo ? feeInfo.feeReceived : null });
//           day++;
//         } else {
//           weekData.push(""); // Empty cell for days after the end of the month
//         }
//       }
//       // Only add weeks if they have at least one day in the month
//       if (weekData.some((day) => day !== "")) {
//         calendarData.push(weekData);
//       }
//     }

//     return calendarData;
//   };

//   // const handleMonthChange = (event) => {
//   //   setSelectedMonth(event.target.value);
//   // };

//   // Example fee data: Only one fee deposit date per month
//   useEffect(() => {
//     const exampleFeeData = [
//       { date: "1-2024", feeReceived: 100 },

//       // Add more fee data for other months if needed
//     ];
//     setFeeData(exampleFeeData);
//   }, []);

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12">
//           <div className="card p-0">
//             <div className="card-body">
//               <p
//                 style={{
//                   marginBottom: "0px",
//                   textAlign: "center",
//                   fontSize: "20px",
//                   fontWeight: "700",
//                 }}
//               >
//                 FEE DASHBOARD
//               </p>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   marginTop: "1rem",
//                   marginBottom: "1rem",
//                   gap: "10px", // Space between label and dropdown
//                 }}
//               >
//                 <label htmlFor="month" style={{ margin: 0 }}>
//                   Month
//                 </label>

//                 <Select
//                   id="month"
//                   name="month"
//                   className="detail"
//                   value={
//                     periodOptions.find((opt) => opt.value === selectedMonth) ||
//                     null
//                   }
//                   onChange={handleMonthChange}
//                   options={periodOptions}
//                   classNamePrefix="react-select"
//                   isSearchable={false}
//                   styles={{
//                     container: (provided) => ({
//                       ...provided,
//                       width: "140px",
//                     }),
//                   }}
//                 />
//               </div>

//               <div className="col-12">
//                 <div className="table-responsive">
//                   <table
//                     // className="calendar"
//                     // style={{ width: "100%", tableLayout: "fixed" }}
//                     className="table"
//                   >
//                     <thead>
//                       <tr>
//                         {days.map((day) => (
//                           <th key={day}>{day}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {generateCalendarData().map((week, weekIndex) => (
//                         <tr key={weekIndex}>
//                           {week.map((day, dayIndex) => (
//                             <td key={dayIndex} style={{ textAlign: "center" }}>
//                               {day && day.day}
//                               {day && day.feeReceived && (
//                                 <Link to="/paymentdetails">
//                                   <div
//                                     style={{
//                                       fontSize: "0.8em",
//                                       color: "green",
//                                     }}
//                                   >
//                                     Fee: {day.feeReceived}
//                                   </div>
//                                 </Link>
//                               )}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               <div className="details-admin mx-1 ">
//                 <div
//                   className="period-fee-details custom-section-box"
//                   style={{ backgroundColor: "white", fontSize: "14px" }}
//                 >
//                   <h3>Period Fee Details</h3>
//                   <p className="paragraph-dashboard">
//                     Fee till Period:{" "}
//                     <span>
//                       {selectedMonth.split("-")[0].toUpperCase().slice(0, 3)}
//                       {selectedMonth.split("-")[1].slice(-2)}
//                     </span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Dues till {selectedMonth}: <span>0.00</span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Discount till {selectedMonth}: <span>0.00</span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Collectable till {selectedMonth}: <span>0.00</span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Collected till {selectedMonth}: <span>0.00</span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Due till {selectedMonth}: <span>0.00</span>
//                   </p>
//                 </div>

//                 <div
//                   className="session-fee-details  custom-section-box "
//                   style={{ backgroundColor: "white" }}
//                 >
//                   <h3>Session Fee Details</h3>
//                   <p className="paragraph-dashboard">
//                     Session:{" "}
//                     <span>{`${selectedMonth.split("-")[1]}-${
//                       parseInt(selectedMonth.split("-")[1], 10) + 1
//                     }`}</span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Dues: <span>0.00</span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Discount: <span>0.00</span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Collectable: <span>0.00</span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Collected: <span>0.00</span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Balance: <span>0.00</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FeeDashboard;



// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "./AdmDashBoardFee.css";
// import Select from "react-select";
// import Container from "react-bootstrap/Container";

// const FeeDashboard = () => {
//   const days = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];
//   const [sessionFeeDetails, setSessionFeeDetails] = useState({});

//   const [periodOptions, setPeriodOptions] = useState([]);
//   const [selectedPeriod, setSelectedPeriod] = useState(null);
//   // State to manage the selected month
//   const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
//   const [feeData, setFeeData] = useState([]);

//   useEffect(() => {
//     fetch(`${ApiUrl.apiurl}Periods/GetAllPeriods/`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data?.data) {
//           const options = data.data.map((period) => ({
//             label: period.period_name,
//             value: period.period_name,
//             start_date: period.start_date,
//             end_date: period.end_date,
//           }));
//           setPeriodOptions(options);

//           // Optionally set default selected period
//           if (options.length > 0) {
//             setSelectedPeriod(options[0]); // new state
//           }
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching periods:", error);
//       });
//   }, []);

//   useEffect(() => {
//     if (selectedPeriod) {
//       const { start_date, end_date } = selectedPeriod;
//       const academic_year_id = localStorage.getItem("academicSessionId");
//       const org_id = localStorage.getItem("orgId");
//       const branch_id = localStorage.getItem("branchId");

//       const url1 = `${ApiUrl.apiurl}FeesDashBoard/dashboard/?academic_year_id=${academic_year_id}&org_id=${org_id}&branch_id=${branch_id}&from_date=${start_date}&to_date=${end_date}`;

//       fetch(url1)
//         .then((res) => res.json())
//         .then((data) => {
//           if (data?.data) {
//             setFeeData(data.data);
//           } else {
//             setFeeData([]);
//           }
//         })
//         .catch((error) => console.error("Error fetching fee data:", error));

//       const url2 = `${ApiUrl.apiurl}FeesDashBoard/feescalculateBasedOnAcademic/?academic_year_id=${academic_year_id}&org_id=${org_id}&branch_id=${branch_id}`;

//       fetch(url2)
//         .then((res) => res.json())
//         .then((data) => {
//           if (data?.data) {
//             setSessionFeeDetails(data.data);
//           } else {
//             setSessionFeeDetails({});
//           }
//         })
//         .catch((error) =>
//           console.error("Error fetching session fee details:", error)
//         );
//     }
//   }, [selectedPeriod]);

//   // Function to get the current month in "Month-Year" format
//   function getCurrentMonth() {
//     const date = new Date();
//     const monthName = date.toLocaleString("default", { month: "long" });
//     const year = date.getFullYear();
//     return `${monthName}-${year}`;
//   }

//   // Function to get month options for the year 2024
//   const getMonthOptions = () => {
//     const options = [];
//     const year = 2024;
//     for (let i = 0; i < 12; i++) {
//       const date = new Date(year, i, 1);
//       const monthName = date.toLocaleString("default", { month: "long" });
//       options.push(
//         <option key={i} value={`${monthName}-${year}`}>
//           {`${monthName}-${year}`}
//         </option>
//       );
//     }
//     return options;
//   };

//   const handleMonthChange = (option) => {
//     setSelectedMonth(option.value);
//   };
//   // Function to get the number of days in the selected month
//   const getDaysInMonth = (monthYear) => {
//     const [monthName, year] = monthYear.split("-");
//     const month = new Date(Date.parse(monthName + " 1, " + year)).getMonth();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     return daysInMonth;
//   };

//   // Function to get the first day of the month
//   const getFirstDayOfMonth = (monthYear) => {
//     const [monthName, year] = monthYear.split("-");
//     const month = new Date(Date.parse(monthName + " 1, " + year)).getMonth();
//     const firstDay = new Date(year, month, 1).getDay();
//     return firstDay;
//   };

//   // Function to generate table days based on the selected month
//  const generateCalendarData = () => {
//    const [monthStr, year] = selectedMonth.split("-");
//    const monthIndex = new Date(Date.parse(`${monthStr} 1, 2000`)).getMonth(); // Month index (0-11)
//    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
//    const firstDay = new Date(year, monthIndex, 1).getDay();

//    const calendarData = [];
//    let day = 1;

//    // Initialize calendar with empty strings
//    for (let week = 0; week < 6; week++) {
//      const weekData = [];
//      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
//        if (week === 0 && dayOfWeek < firstDay) {
//          weekData.push(""); // Empty cell for days before the first of the month
//        } else if (day <= daysInMonth) {
//          // Format the date as YYYY-MM-DD
//          const paddedMonth = String(monthIndex + 1).padStart(2, "0");
//          const paddedDay = String(day).padStart(2, "0");
//          const formattedDate = `${year}-${paddedMonth}-${paddedDay}`;

//          const feeInfo = feeData.find((data) => data.date === formattedDate);
//          weekData.push({
//            day,
//            feeReceived: feeInfo ? feeInfo.feeReceived : null,
//          });
//          day++;
//        } else {
//          weekData.push(""); // Empty cell after end of month
//        }
//      }

//      if (weekData.some((day) => day !== "")) {
//        calendarData.push(weekData);
//      }
//    }

//    return calendarData;
//  };


//   // const handleMonthChange = (event) => {
//   //   setSelectedMonth(event.target.value);
//   // };

//   // Example fee data: Only one fee deposit date per month
//   // useEffect(() => {
//   //   const exampleFeeData = [
//   //     { date: "1-2024", feeReceived: 100 },

//   //     // Add more fee data for other months if needed
//   //   ];
//   //   setFeeData(exampleFeeData);
//   // }, []);

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12">
//           <div className="card p-0">
//             <div className="card-body">
//               <p
//                 style={{
//                   marginBottom: "0px",
//                   textAlign: "center",
//                   fontSize: "20px",
//                   fontWeight: "700",
//                 }}
//               >
//                 FEE DASHBOARD
//               </p>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   marginTop: "1rem",
//                   marginBottom: "1rem",
//                   gap: "10px", // Space between label and dropdown
//                 }}
//               >
//                 <label htmlFor="month" style={{ margin: 0 }}>
//                   Month
//                 </label>

//                 <Select
//                   id="month"
//                   name="month"
//                   className="detail"
//                   value={
//                     periodOptions.find((opt) => opt.value === selectedMonth) ||
//                     null
//                   }
//                   onChange={handleMonthChange}
//                   options={periodOptions}
//                   classNamePrefix="react-select"
//                   isSearchable={false}
//                   styles={{
//                     container: (provided) => ({
//                       ...provided,
//                       width: "140px",
//                     }),
//                   }}
//                 />
//               </div>

//               <div className="col-12">
//                 <div className="table-responsive">
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         {days.map((day) => (
//                           <th key={day}>{day}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {generateCalendarData().map((week, weekIndex) => (
//                         <tr key={weekIndex}>
//                           {week.map((day, dayIndex) => (
//                             <td key={dayIndex} style={{ textAlign: "center" }}>
//                               {day && day.day}
//                               {day && day.feeReceived && (
//                                 <Link to="/paymentdetails">
//                                   <div
//                                     style={{
//                                       fontSize: "0.8em",
//                                       color: "green",
//                                     }}
//                                   >
//                                     Fee: {day.feeReceived}
//                                   </div>
//                                 </Link>
//                               )}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               <div className="details-admin mx-1">
//                 <div
//                   className="session-fee-details custom-section-box"
//                   style={{ backgroundColor: "white" }}
//                 >
//                   <h3>Session Fee Details</h3>
//                   <p className="paragraph-dashboard">
//                     Session:{" "}
//                     <span>{`${selectedMonth.split("-")[1]}-${
//                       parseInt(selectedMonth.split("-")[1], 10) + 1
//                     }`}</span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Dues:{" "}
//                     <span>{sessionFeeDetails.totalDues || "0.00"}</span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Discount:{" "}
//                     <span>{sessionFeeDetails.totalDiscount || "0.00"}</span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Collectable:{" "}
//                     <span>{sessionFeeDetails.totalCollectable || "0.00"}</span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Collected:{" "}
//                     <span>{sessionFeeDetails.totalCollected || "0.00"}</span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Balance:{" "}
//                     <span>{sessionFeeDetails.totalBalance || "0.00"}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FeeDashboard;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "./AdmDashBoardFee.css";
// import Select from "react-select";
// import { ApiUrl } from "../../../ApiUrl";

// const FeeDashboard = () => {
//   const days = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];
//   const [sessionFeeDetails, setSessionFeeDetails] = useState({});
//   const [periodOptions, setPeriodOptions] = useState([]);
//   const [selectedPeriod, setSelectedPeriod] = useState(null);
//   const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
//   const [feeData, setFeeData] = useState([]);

//   // useEffect(() => {
//   //   fetch(`${ApiUrl.apiurl}Periods/GetAllPeriods/`)
//   //     .then((res) => res.json())
//   //     .then((data) => {
//   //       if (data?.data) {
//   //         const options = data.data.map((period) => ({
//   //           label: period.period_name,
//   //           value: period.period_name,
//   //           start_date: period.period_start_date, // No format here
//   //           end_date: period.period_end_date, // No format here
//   //         }));
//   //         setPeriodOptions(options);
//   //         if (options.length > 0) setSelectedPeriod(options[0]);
//   //       }
//   //     })
//   //     .catch((error) => console.error("Error fetching periods:", error));
//   // }, []);

//   // useEffect(() => {
//   //   if (selectedPeriod) {
//   //     const { start_date, end_date } = selectedPeriod;
//   //     const academic_year_id = localStorage.getItem("academicSessionId");
//   //     const org_id = localStorage.getItem("orgId");
//   //     const branch_id = localStorage.getItem("branchId");

//   //     const url1 = `${ApiUrl.apiurl}FeesDashBoard/dashboard/?academic_year_id=${academic_year_id}&org_id=${org_id}&branch_id=${branch_id}&from_date=${start_date}&to_date=${end_date}`;

//   //     fetch(url1)
//   //       .then((res) => res.json())
//   //       .then((data) => {
//   //         if (data?.data) setFeeData(data.data);
//   //         else setFeeData([]);
//   //       })
//   //       .catch((error) => console.error("Error fetching fee data:", error));

//   //     const url2 = `${ApiUrl.apiurl}FeesDashBoard/feescalculateBasedOnAcademic/?academic_year_id=${academic_year_id}&org_id=${org_id}&branch_id=${branch_id}`;

//   //     fetch(url2)
//   //       .then((res) => res.json())
//   //       .then((data) => {
//   //         if (data?.data) setSessionFeeDetails(data.data);
//   //         else setSessionFeeDetails({});
//   //       })
//   //       .catch((error) =>
//   //         console.error("Error fetching session fee details:", error)
//   //       );
//   //   }
//   // }, [selectedPeriod]);

//   useEffect(() => {
//     fetch(`${ApiUrl.apiurl}Periods/GetAllPeriods/`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data?.data) {
//           const options = data.data.map((period) => {
//             const label = period.period_name;
//             const value = period.period_name;
//             return {
//               label,
//               value,
//               start_date: period.period_start_date,
//               end_date: period.period_end_date,
//             };
//           });

//           setPeriodOptions(options);

//           // Try to select the current month
//           const currentMonthLabel = getCurrentMonth();
//           const currentOption = options.find(
//             (opt) => opt.value === currentMonthLabel
//           );

//           if (currentOption) {
//             setSelectedPeriod(currentOption);
//             setSelectedMonth(currentOption.value);
//           } else {
//             setSelectedPeriod(options[0]);
//             setSelectedMonth(options[0]?.value);
//           }
//         }
//       })
//       .catch((error) => console.error("Error fetching periods:", error));
//   }, []);

//   useEffect(() => {
//     if (selectedPeriod) {
//       const { start_date, end_date } = selectedPeriod;
//       const academic_year_id = localStorage.getItem("academicSessionId");
//       const org_id = localStorage.getItem("orgId");
//       const branch_id = localStorage.getItem("branchId");

//       const url1 = `${ApiUrl.apiurl}FeesDashBoard/dashboard/?academic_year_id=${academic_year_id}&org_id=${org_id}&branch_id=${branch_id}&from_date=${start_date}&to_date=${end_date}`;

//       fetch(url1)
//         .then((res) => res.json())
//         .then((data) => {
//           if (data?.data) setFeeData(data.data);
//           else setFeeData([]);
//         })
//         .catch((error) => console.error("Error fetching fee data:", error));

//       const url2 = `${ApiUrl.apiurl}FeesDashBoard/feescalculateBasedOnAcademic/?academic_year_id=${academic_year_id}&org_id=${org_id}&branch_id=${branch_id}`;

//       fetch(url2)
//         .then((res) => res.json())
//         .then((data) => {
//           if (data?.data) {
//             const sessionData = data.data;
//             const totalCollectable =
//               sessionData.element_amount - sessionData.total_discount_amount;
//             const totalBalance =
//               totalCollectable - sessionData.total_paid_amount;

//             setSessionFeeDetails({
//               totalDues: sessionData.element_amount,
//               totalDiscount: sessionData.total_discount_amount,
//               totalCollectable: totalCollectable,
//               totalCollected: sessionData.total_paid_amount,
//               totalBalance: totalBalance,
//               session: sessionData.sesion,
//             });
//           } else {
//             setSessionFeeDetails({});
//           }
//         })
//         .catch((error) =>
//           console.error("Error fetching session fee details:", error)
//         );
//     }
//   }, [selectedPeriod]);

//   function getCurrentMonth() {
//     const date = new Date();
//     const monthName = date.toLocaleString("default", { month: "long" });
//     const year = date.getFullYear();
//     return `${monthName}-${year}`;
//   }

//   // Before generateCalendarData
//   const currentYear = selectedPeriod
//     ? new Date(selectedPeriod.start_date).getFullYear()
//     : new Date().getFullYear();
//   const currentMonth = selectedPeriod
//     ? new Date(selectedPeriod.start_date).getMonth()
//     : new Date().getMonth();

//   // Your generateCalendarData() follows after this

//   // const generateCalendarData = () => {
//   //   const startDate = new Date(currentYear, currentMonth, 1);
//   //   const endDate = new Date(currentYear, currentMonth + 1, 0);
//   //   const daysInMonth = endDate.getDate();

//   //   const calendar = [];
//   //   let week = [];

//   //   for (let i = 1; i <= daysInMonth; i++) {
//   //     const date = new Date(currentYear, currentMonth, i);
//   //     const dayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)

//   //     if (i === 1 && dayOfWeek !== 0) {
//   //       for (let j = 0; j < dayOfWeek; j++) {
//   //         week.push(null); // Empty cells before first day
//   //       }
//   //     }

//   //     const formattedDate = date.toLocaleDateString("en-CA"); // Gives 'YYYY-MM-DD' in local time
//   //     // 'YYYY-MM-DD'

//   //     const feeEntry = feeData.find(
//   //       (entry) => entry.receipt_date === formattedDate
//   //     );

//   //     week.push({
//   //       day: i,
//   //       feeReceived: feeEntry ? feeEntry.received_amount : null,
//   //     });

//   //     if (dayOfWeek === 6 || i === daysInMonth) {
//   //       calendar.push(week);
//   //       week = [];
//   //     }
//   //   }

//   //   return calendar;
//   // };

//   const generateCalendarData = () => {
//     if (!selectedPeriod?.start_date || !selectedPeriod?.end_date) return [];

//     const calendarData = [];
//     const start = new Date(selectedPeriod.start_date);
//     const end = new Date(selectedPeriod.end_date);

//     // Convert feeData to a map for fast lookup
//     const feeMap = {};
//     feeData.forEach((item) => {
//       const key = new Date(item.receipt_date).toLocaleDateString("en-CA"); // Ensure same format
//       feeMap[key] = item.received_amount;
//     });

//     let currentDate = new Date(start);
//     currentDate.setHours(0, 0, 0, 0); // Normalize time

//     // Start from the Sunday of the first week
//     const firstDayOfWeek = currentDate.getDay();
//     currentDate.setDate(currentDate.getDate() - firstDayOfWeek);

//     while (currentDate <= end || currentDate.getDay() !== 0) {
//       const week = [];

//       for (let i = 0; i < 7; i++) {
//         const dateCopy = new Date(currentDate);
//         const dateStr = dateCopy.toLocaleDateString("en-CA"); // Local YYYY-MM-DD

//         if (
//           dateCopy < new Date(selectedPeriod.start_date) ||
//           dateCopy > new Date(selectedPeriod.end_date)
//         ) {
//           week.push(null);
//         } else {
//           week.push({
//             day: dateCopy.getDate(),
//             date: dateStr,
//             feeReceived: feeMap[dateStr] || null,
//           });
//         }

//         currentDate.setDate(currentDate.getDate() + 1);
//       }

//       calendarData.push(week);
//     }

//     return calendarData;
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12">
//           <div className="card p-0">
//             <div className="card-body">
//               <p
//                 style={{
//                   marginBottom: "0px",
//                   textAlign: "center",
//                   fontSize: "20px",
//                   fontWeight: "700",
//                 }}
//               >
//                 FEE DASHBOARD
//               </p>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   marginTop: "1rem",
//                   marginBottom: "1rem",
//                   gap: "10px",
//                 }}
//               >
//                 <label htmlFor="month" style={{ margin: 0 }}>
//                   Month
//                 </label>
//                 <Select
//                   id="month"
//                   name="month"
//                   className="detail"
//                   value={
//                     periodOptions.find((opt) => opt.value === selectedMonth) ||
//                     null
//                   }
//                   onChange={(selected) => {
//                     setSelectedPeriod(selected);
//                     setSelectedMonth(selected.value);
//                   }}
//                   options={periodOptions}
//                   classNamePrefix="react-select"
//                   isSearchable={false}
//                   styles={{
//                     container: (provided) => ({ ...provided, width: "200px" }),
//                   }}
//                 />
//               </div>

//               {/* <div className="col-12">
//                 <div className="table-responsive">
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         {days.map((day) => (
//                           <th key={day}>{day}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {generateCalendarData().map((week, weekIndex) => (
//                         <tr key={weekIndex}>
//                           {week.map((day, dayIndex) => (
//                             <td key={dayIndex} style={{ textAlign: "center" }}>
//                               {day && day.day}
//                               {day && day.feeReceived !== null && (
//                                 <Link to="/paymentdetails">
//                                   <div
//                                     style={{
//                                       fontSize: "0.8em",
//                                       color: "green",
//                                     }}
//                                   >
//                                     Fee: {day.feeReceived}
//                                   </div>
//                                 </Link>
//                               )}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div> */}

//               <div className="col-12">
//                 <div className="table-responsive">
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         {days.map((day) => (
//                           <th key={day}>{day}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {generateCalendarData().map((week, weekIndex) => (
//                         <tr key={weekIndex}>
//                           {week.map((day, dayIndex) => (
//                             <td key={dayIndex} style={{ textAlign: "center" }}>
//                               {day && day.day}
//                               {day && day.feeReceived !== null && (
//                                 <Link
//                                   to="/paymentdetails"
//                                   state={{ selectedDate: day.date }}
//                                 >
//                                   <div
//                                     style={{
//                                       fontSize: "0.8em",
//                                       color: "green",
//                                       cursor: "pointer",
//                                     }}
//                                   >
//                                     Fee: {day.feeReceived}
//                                   </div>
//                                 </Link>
//                               )}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               <div className="details-admin mx-1">
//                 <div
//                   className="session-fee-details custom-section-box"
//                   style={{ backgroundColor: "white" }}
//                 >
//                   <h3>Session Fee Details</h3>
//                   <p className="paragraph-dashboard">
//                     Session: <span>{sessionFeeDetails.session || "N/A"}</span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Dues:{" "}
//                     <span>
//                       {sessionFeeDetails.totalDues?.toFixed(2) || "0.00"}
//                     </span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Discount:{" "}
//                     <span>
//                       {sessionFeeDetails.totalDiscount?.toFixed(2) || "0.00"}
//                     </span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Collectable:{" "}
//                     <span>
//                       {sessionFeeDetails.totalCollectable?.toFixed(2) || "0.00"}
//                     </span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Collected:{" "}
//                     <span>
//                       {sessionFeeDetails.totalCollected?.toFixed(2) || "0.00"}
//                     </span>
//                   </p>
//                   <p className="paragraph-dashboard">
//                     Total Balance:{" "}
//                     <span>
//                       {sessionFeeDetails.totalBalance?.toFixed(2) || "0.00"}
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FeeDashboard;



import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "./AdmDashBoardFee.css";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";

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
  const [sessionFeeDetails, setSessionFeeDetails] = useState({});
  const [isDataReady, setIsDataReady] = useState(false);
  const [periodOptions, setPeriodOptions] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [feeData, setFeeData] = useState([]);

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

  // useEffect(() => {
  //   fetch(`${ApiUrl.apiurl}Periods/GetAllPeriods/`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data?.data) {
  //         const options = data.data.map((period) => ({
  //           label: period.period_name,
  //           value: period.period_name,
  //           start_date: period.period_start_date, // No format here
  //           end_date: period.period_end_date, // No format here
  //         }));
  //         setPeriodOptions(options);
  //         if (options.length > 0) setSelectedPeriod(options[0]);
  //       }
  //     })
  //     .catch((error) => console.error("Error fetching periods:", error));
  // }, []);

  // useEffect(() => {
  //   if (selectedPeriod) {
  //     const { start_date, end_date } = selectedPeriod;
  //     const academic_year_id = localStorage.getItem("academicSessionId");
  //     const org_id = localStorage.getItem("orgId");
  //     const branch_id = localStorage.getItem("branchId");

  //     const url1 = `${ApiUrl.apiurl}FeesDashBoard/dashboard/?academic_year_id=${academic_year_id}&org_id=${org_id}&branch_id=${branch_id}&from_date=${start_date}&to_date=${end_date}`;

  //     fetch(url1)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data?.data) setFeeData(data.data);
  //         else setFeeData([]);
  //       })
  //       .catch((error) => console.error("Error fetching fee data:", error));

  //     const url2 = `${ApiUrl.apiurl}FeesDashBoard/feescalculateBasedOnAcademic/?academic_year_id=${academic_year_id}&org_id=${org_id}&branch_id=${branch_id}`;

  //     fetch(url2)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data?.data) setSessionFeeDetails(data.data);
  //         else setSessionFeeDetails({});
  //       })
  //       .catch((error) =>
  //         console.error("Error fetching session fee details:", error)
  //       );
  //   }
  // }, [selectedPeriod]);

  // Initialize with current month and year
  // This useEffect is no longer needed as selectedMonthValue and selectedYearValue are initialized directly.
  // useEffect(() => {
  //   const now = new Date();
  //   const currentMonth = monthOptions[now.getMonth()];
  //   const currentYear = yearOptions.find(y => y.value === now.getFullYear()) || yearOptions[1]; // Default to 2025 if current year not in list

  //   setSelectedPeriod({
  //     label: `${currentMonth.label}-${currentYear.value}`,
  //     value: `${currentMonth.label}-${currentYear.value}`,
  //     month: currentMonth.value,
  //     year: currentYear.value
  //   });
  //   setSelectedMonth(`${currentMonth.label}-${currentYear.value}`);

  //   // Build period options from month/year combinations
  //   const options = monthOptions.map(month =>
  //     yearOptions.map(year => ({
  //       label: `${month.label}-${year.value}`,
  //       value: `${month.label}-${year.value}`,
  //       month: month.value,
  //       year: year.value
  //     }))
  //   ).flat();

  //   setPeriodOptions(options);
  // }, []);

  useEffect(() => {
    if (selectedMonthValue !== undefined && selectedYearValue !== undefined) {
      const month = selectedMonthValue;
      const year = selectedYearValue;

      // Calculate start_date (first day of month)
      // Format date manually to avoid timezone issues with toISOString()
      const startDay = 1;
      const start_date = `${year}-${String(month + 1).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;

      // Calculate end_date (last day of month)
      // Get the last day by going to next month day 0
      const lastDayDate = new Date(year, month + 1, 0);
      const lastDay = lastDayDate.getDate();
      const end_date = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      const monthName = monthOptions[month].label;
      console.log(`📅 Selected: ${monthName} ${year}`);
      console.log(`📅 Date Range: ${start_date} to ${end_date} (${lastDay} days)`);

      // Get values from localStorage
      const org_id = localStorage.getItem("orgId");
      const branch_id = localStorage.getItem("branchId");
      const academic_year_id = localStorage.getItem("academicSessionId");

      const url1 = `${ApiUrl.apiurl}FeesDashBoard/dashboard/?organization_id=${org_id}&branch_id=${branch_id}&batch_id=${academic_year_id}&from_date=${start_date}&to_date=${end_date}`;
      console.log("💰 Calling FeesDashBoard/dashboard API:", url1);

      fetch(url1)
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ FeesDashBoard/dashboard response:", data);
          if (data?.data) setFeeData(data.data);
          else setFeeData([]);
        })
        .catch((error) => console.error("❌ Error fetching fee data:", error));

      const url2 = `${ApiUrl.apiurl}FeesDashBoard/FeesCalculateBasedOnBatch/?organization_id=${org_id}&branch_id=${branch_id}&batch_id=${academic_year_id}`;
      console.log("📊 Calling FeesCalculateBasedOnBatch API:", url2);

      fetch(url2)
        .then((res) => res.json())
        .then((data) => {
          if (data?.data) {
            const sessionData = data.data;
            const totalCollectable =
              sessionData.element_amount - sessionData.total_discount_amount;
            const totalBalance =
              totalCollectable - sessionData.total_paid_amount;

            setSessionFeeDetails({
              totalDues: sessionData.element_amount,
              totalDiscount: sessionData.total_discount_amount,
              totalCollectable: totalCollectable,
              totalCollected: sessionData.total_paid_amount,
              totalBalance: totalBalance,
              batch: sessionData.batch,
            });
          } else {
            setSessionFeeDetails({});
          }
        })
        .catch((error) =>
          console.error("Error fetching session fee details:", error)
        );
    }
  }, [selectedMonthValue, selectedYearValue]);

  // Initialize data ready state
  useEffect(() => {
    setIsDataReady(true);
  }, []);

  // Separate useEffect for Session Fee Details that responds to sessionFeeYear changes
  useEffect(() => {
    if (!isDataReady || sessionFeeYear === undefined) return;

    const org_id = localStorage.getItem("orgId");
    const branch_id = localStorage.getItem("branchId");
    const academic_year_id = localStorage.getItem("academicSessionId");

    if (!org_id || !branch_id || !academic_year_id) {
      console.warn("Missing required data for session fee:", { org_id, branch_id, academic_year_id });
      return;
    }

    // Fetch session fee details with year parameter
    // Backend API requires batch_id, organization_id, branch_id, and year
    const url2 = `${ApiUrl.apiurl}FeesDashBoard/FeesCalculateBasedOnBatch/?organization_id=${org_id}&branch_id=${branch_id}&batch_id=${academic_year_id}&year=${sessionFeeYear}`;
    console.log("📊 Calling FeesCalculateBasedOnBatch API with year:", url2);

    fetch(url2)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data?.data) {
          const sessionData = data.data;
          const totalCollectable =
            sessionData.element_amount - sessionData.total_discount_amount;
          const totalBalance =
            totalCollectable - sessionData.total_paid_amount;

          setSessionFeeDetails({
            totalDues: sessionData.element_amount,
            totalDiscount: sessionData.total_discount_amount,
            totalCollectable: totalCollectable,
            totalCollected: sessionData.total_paid_amount,
            totalBalance: totalBalance,
          });
        } else {
          setSessionFeeDetails({});
        }
      })
      .catch((error) => {
        console.error("Error fetching session fee details:", error);
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

  function getCurrentMonth() {
    const date = new Date();
    const monthName = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${monthName}-${year}`;
  }

  // Before generateCalendarData
  const currentYear = selectedYearValue || new Date().getFullYear();
  const currentMonth = selectedMonthValue !== undefined ? selectedMonthValue : new Date().getMonth();

  // Your generateCalendarData() follows after this

  // const generateCalendarData = () => {
  //   const startDate = new Date(currentYear, currentMonth, 1);
  //   const endDate = new Date(currentYear, currentMonth + 1, 0);
  //   const daysInMonth = endDate.getDate();

  //   const calendar = [];
  //   let week = [];

  //   for (let i = 1; i <= daysInMonth; i++) {
  //     const date = new Date(currentYear, currentMonth, i);
  //     const dayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)

  //     if (i === 1 && dayOfWeek !== 0) {
  //       for (let j = 0; j < dayOfWeek; j++) {
  //         week.push(null); // Empty cells before first day
  //       }
  //     }

  //     const formattedDate = date.toLocaleDateString("en-CA"); // Gives 'YYYY-MM-DD' in local time
  //     // 'YYYY-MM-DD'

  //     const feeEntry = feeData.find(
  //       (entry) => entry.receipt_date === formattedDate
  //     );

  //     week.push({
  //       day: i,
  //       feeReceived: feeEntry ? feeEntry.received_amount : null,
  //     });

  //     if (dayOfWeek === 6 || i === daysInMonth) {
  //       calendar.push(week);
  //       week = [];
  //     }
  //   }

  //   return calendar;
  // };

  const generateCalendarData = () => {
    if (selectedMonthValue === undefined || selectedYearValue === undefined) return [];

    const calendarData = [];

    // Calculate start and end of the selected month
    const start = new Date(selectedYearValue, selectedMonthValue, 1);
    const end = new Date(selectedYearValue, selectedMonthValue + 1, 0);

    // Ensure time part is reset
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Convert feeData to a map for quick access
    const feeMap = {};
    feeData.forEach((item) => {
      // Match API response from FeesDashBoard/dashboard: 'receipt_date' and 'received_amount'
      // Only process valid dates
      if (!item.receipt_date) return;

      const key = new Date(item.receipt_date).toLocaleDateString("en-CA");
      const amount = item.received_amount || 0;

      // Aggregate amounts if multiple receipts exist for the same day
      if (feeMap[key]) {
        feeMap[key] += amount;
      } else {
        feeMap[key] = amount;
      }
    });

    let currentDate = new Date(start);

    // Fill the first week with empty cells if month doesn't start on Sunday
    const firstWeek = [];
    const startDayOfWeek = currentDate.getDay(); // 0 (Sun) to 6 (Sat)

    for (let i = 0; i < startDayOfWeek; i++) {
      firstWeek.push(null);
    }

    // Start adding actual dates
    while (currentDate <= end) {
      const dateCopy = new Date(currentDate);
      const dateStr = dateCopy.toLocaleDateString("en-CA");

      firstWeek.push({
        day: dateCopy.getDate(),
        date: dateStr,
        feeReceived: feeMap[dateStr] || null,
      });

      if (firstWeek.length === 7) {
        calendarData.push(firstWeek.slice());
        firstWeek.length = 0; // reset for next week
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Push the last week if it's not complete
    if (firstWeek.length > 0) {
      // Fill remaining cells with null
      while (firstWeek.length < 7) {
        firstWeek.push(null);
      }
      calendarData.push(firstWeek);
    }

    return calendarData;
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                FEE DASHBOARD
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "1rem",
                  marginBottom: "1rem",
                  gap: "10px",
                }}
              >
                <label htmlFor="month" style={{ margin: 0 }}>
                  Month
                </label>
                <Select
                  id="month"
                  name="month"
                  className="detail"
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
                    container: (provided) => ({ ...provided, width: "150px" }),
                  }}
                />

                <label htmlFor="year" style={{ margin: 0, marginLeft: "20px" }}>
                  Year
                </label>
                <Select
                  id="year"
                  name="year"
                  className="detail"
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
                    container: (provided) => ({ ...provided, width: "120px" }),
                  }}
                />
              </div>

              {/* <div className="col-12">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        {days.map((day) => (
                          <th key={day}>{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {generateCalendarData().map((week, weekIndex) => (
                        <tr key={weekIndex}>
                          {week.map((day, dayIndex) => (
                            <td key={dayIndex} style={{ textAlign: "center" }}>
                              {day && day.day}
                              {day && day.feeReceived !== null && (
                                <Link to="/paymentdetails">
                                  <div
                                    style={{
                                      fontSize: "0.8em",
                                      color: "green",
                                    }}
                                  >
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
                </div>
              </div> */}

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        {days.map((day) => (
                          <th key={day}>{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {generateCalendarData().map((week, weekIndex) => (
                        <tr key={weekIndex}>
                          {week.map((day, dayIndex) => (
                            <td key={dayIndex} style={{ textAlign: "center" }}>
                              {day && day.day}
                              {day && day.feeReceived !== null && (
                                <Link
                                  to="/paymentdetails"
                                  state={{ selectedDate: day.date }}
                                >
                                  <div
                                    style={{
                                      fontSize: "0.8em",
                                      color: "green",
                                      cursor: "pointer",
                                    }}
                                  >
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
                </div>
              </div>

              {/* Year Selector - Outside details-admin to avoid CSS conflicts */}
              <div style={{ marginBottom: "12px", display: "flex", justifyContent: "center", paddingRight: "225px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <label htmlFor="sessionYear" style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: "#374151" }}>
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
                        minHeight: "32px",
                        height: "32px",
                      }),
                      valueContainer: (provided) => ({
                        ...provided,
                        padding: "0 8px",
                      }),
                      menu: (provided) => ({
                        ...provided,
                        maxHeight: "200px",
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: "200px",
                      }),
                    }}
                  />
                </div>
              </div>

              <div className="details-admin mx-1">
                <div
                  className="session-fee-details custom-section-box"
                  style={{ backgroundColor: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
                >


                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <h3 style={{ margin: 0, fontWeight: "bold", fontSize: "16px" }}>Session Fee Details</h3>
                  </div>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      fontSize: "14px",
                      lineHeight: "1.8",
                      margin: 0,
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeDashboard;
