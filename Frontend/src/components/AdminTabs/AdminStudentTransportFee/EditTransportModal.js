// import React, { useState, useEffect } from "react";
// import { Modal, Button } from "react-bootstrap";
// import Select from "react-select";
// import { ApiUrl } from "../../../ApiUrl";
// const EditTransportModal = ({
//   show,
//   handleClose,
//   // studentData,
//   transportDetails,
//   routes,
// }) => {
//   const [selectedRoute, setSelectedRoute] = useState(null);
//   const [selectedPickup, setSelectedPickup] = useState("");
//   const [amount, setAmount] = useState("");
//   const [transportAvailed, setTransportAvailed] = useState(false);
//   const [selectedMonths, setSelectedMonths] = useState([]);
//   const [route, setRoute] = useState([]);
//   const [months, setMonths] = useState([]);
//   const [pickupPoints, setPickupPoints] = useState([]);
//   const [selectedPickups, setSelectedPickups] = useState(null);
//   const [amounts, setAmounts] = useState("");
//   const [monthStatus, setMonthStatus] = useState([]);
//   const [routeOptions, setRouteOptions] = useState([]);
//   const [selectedSemesters, setSelectedSemesters] = useState([]);
//   const [studentName, setStudentName] = useState("");
//   const [admissionNo, setAdmissionNo] = useState("");
//   const [barcode, setBarcode] = useState("");
//   const [fatherName, setFatherName] = useState("");
//   const [motherName, setMotherName] = useState("");
//   const [collegeAdmissionNo, setCollegeAdmissionNo] = useState("");
//   const [studentData, setStudentData] = useState({});





// const handleSemesterToggle = (sem) => {
//   setSelectedSemesters((prev) =>
//     prev.includes(sem) ? prev.filter((s) => s !== sem) : [...prev, sem]
//   );
// };


// useEffect(() => {
//   const fetchRoutes = async () => {
//     const organization_id = sessionStorage.getItem("organization_id");
//     const branch_id = sessionStorage.getItem("branch_id");
//     const token = localStorage.getItem("accessToken");

//     if (!organization_id || !branch_id) {
//       console.error("Missing organization_id or branch_id");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${ApiUrl.apiurl}Transport/routemasterlist/?organization_id=${organization_id}&branch_id=${branch_id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to fetch routes");

//       const data = await response.json();

//       const formattedRoutes = data.map((route) => ({
//         value: route.id,
//         label: route.transport_name,
//       }));

//       setRouteOptions(formattedRoutes);

//       if (transportDetails?.routeId) {
//         const matchedRoute = formattedRoutes.find(
//           (r) => r.value === transportDetails.routeId
//         );
//         setSelectedRoute(matchedRoute || null);
//       }
//     } catch (error) {
//       console.error("Error fetching routes:", error);
//     }
//   };

//   if (show) fetchRoutes();
// }, [show, transportDetails]);

// useEffect(() => {
//   if (!selectedRoute) return;

//   const fetchPickupPoints = async () => {
//     const organization_id = sessionStorage.getItem("organization_id");
//     const branch_id = sessionStorage.getItem("branch_id");
//     const token = localStorage.getItem("accessToken");

//     if (!organization_id || !branch_id) {
//       console.error("Missing organization_id or branch_id");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${ApiUrl.apiurl}Transport/GetAllPickupPointBasedOnRoute/?route_id=${selectedRoute.value}&organization_id=${organization_id}&branch_id=${branch_id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to fetch pickup points");

//       const data = await response.json();

//       const formattedPickupPoints = (data.data || []).map((point) => ({
//         value: point.routeDetailsId,
//         label: point.pickup_point_name,
//         amount: point.amount,
//       }));

//       setPickupPoints(formattedPickupPoints);

//       if (transportDetails?.pickupPointName) {
//         const matchedPickup = formattedPickupPoints.find(
//           (p) => p.label === transportDetails.pickupPointName
//         );

//         if (matchedPickup) {
//           setSelectedPickup(matchedPickup);
//           setAmount(matchedPickup.amount);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching pickup points:", error);
//     }
//   };

//   fetchPickupPoints();
// }, [selectedRoute, transportDetails]);

// useEffect(() => {
//   if (!transportDetails || Object.keys(transportDetails).length === 0) return;

//   // Save student_id + barcode
//   setStudentData((prev) => ({
//     ...prev,
//     student_id: transportDetails.student_id,
//     barcode: transportDetails.barcode, // ✅ FIX: store barcode
//     admission_no: transportDetails.admission_no,
//     student_name: transportDetails.student_name,
//   }));

//   // Transport Availed
//   setTransportAvailed(Boolean(transportDetails.transport_avail));

//   // Semester selection
//   if (Array.isArray(transportDetails.choice_semester)) {
//     const selected = transportDetails.choice_semester
//       .filter((s) => String(s.flag).toLowerCase() === "yes")
//       .map((s) => Number(s.semester_id));

//     setSelectedSemesters(selected);
//   }

//   // Route
//   const matchedRoute =
//     routeOptions.find(
//       (r) => Number(r.value) === Number(transportDetails.routeId)
//     ) || null;

//   setSelectedRoute(matchedRoute);

//   // Pickup point
//   if (transportDetails.pickup_point_id != null) {
//     setSelectedPickup({
//       value: Number(transportDetails.pickup_point_id),
//       label: transportDetails.pickup_point_name || "",
//       amount: transportDetails.amount,
//     });
//     setAmount(transportDetails.amount);
//   } else {
//     setSelectedPickup(null);
//     setAmount("");
//   }
// }, [transportDetails, routeOptions]);



  
// // const handleSaveChanges = async () => {
// //   if (!studentData?.student_id) {
// //     alert("Student ID is missing!");
// //     return;
// //   }

// //   const userId = sessionStorage.getItem("userId");
// //   if (!userId) {
// //     alert("User ID is missing in session!");
// //     return;
// //   }

// //   const token = localStorage.getItem("accessToken");
// //   if (!token) {
// //     alert("Access token missing!");
// //     return;
// //   }

// //   // Choice semesters array
// //   const selectedSemesterIds = selectedSemesters.map((id) => Number(id));

// //   const payload = {
// //     student_id: studentData.student_id, //  now populated
// //     transport_avail: transportAvailed,
// //     choice_semesters: selectedSemesterIds,
// //     route_id: selectedRoute?.value || null,
// //     pickup_point_id: selectedPickup?.value || null,
// //     amount: parseFloat(amount),
// //     created_by: Number(userId),
// //   };

// //   console.log("Final Payload Sent:", payload);

// //   try {
// //     const response = await fetch(
// //       `${ApiUrl.apiurl}Transport/UpdateStudentTransport/`,
// //       {
// //         method: "PUT",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify(payload),
// //       }
// //     );

// //     if (!response.ok) throw new Error("Failed to update transport details");

// //     alert("Transport details updated successfully!");
// //     handleClose();
// //     // window.location.reload();
// //   } catch (error) {
// //     console.error("Error updating transport:", error);
// //     alert("Failed to update transport details. Please try again.");
// //   }
// // };

// const handleSaveChanges = async () => {
//   if (!studentData?.student_id) {
//     alert("Student ID is missing!");
//     return;
//   }

//   const userId = sessionStorage.getItem("userId");
//   if (!userId) {
//     alert("User ID is missing in session!");
//     return;
//   }

//   const token = localStorage.getItem("accessToken");
//   if (!token) {
//     alert("Access token missing!");
//     return;
//   }

//   // 🔹 Original semesters from API
//   const originalSemesters = Array.isArray(transportDetails?.choice_semester)
//     ? transportDetails.choice_semester
//         .filter((s) => String(s.flag).toLowerCase() === "yes")
//         .map((s) => Number(s.semester_id))
//     : [];

//   // 🔹 Current selected semesters
//   const currentSemesters = selectedSemesters.map(Number);

//   // 🔹 Total semesters count
//   const totalSemesters = transportDetails?.total_semesters || 0;

//   let semestersToSend = [];

//   // 🔹 If all semesters selected → send empty array
//   if (currentSemesters.length === totalSemesters) {
//     semestersToSend = [];
//   } else {
//     // 🔹 Send only newly selected semesters
//     semestersToSend = currentSemesters.filter(
//       (sem) => !originalSemesters.includes(sem)
//     );
//   }

//   const payload = {
//     student_id: studentData.student_id,
//     transport_avail: transportAvailed,
//     choice_semesters: semestersToSend, // ✅ FIXED LOGIC
//     route_id: selectedRoute?.value || null,
//     pickup_point_id: selectedPickup?.value || null,
//     amount: parseFloat(amount),
//     created_by: Number(userId),
//   };

//   console.log("Final Payload Sent:", payload);

//   try {
//     const response = await fetch(
//       `${ApiUrl.apiurl}Transport/UpdateStudentTransport/`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       }
//     );

//     if (!response.ok) throw new Error("Failed to update transport details");

//     alert("Transport details updated successfully!");
//     handleClose();
//   } catch (error) {
//     console.error("Error updating transport:", error);
//     alert("Failed to update transport details. Please try again.");
//   }
// };



//   const handleTransportAvailedChange = () => {
//     if (transportAvailed) {
//       // User is trying to uncheck
//       const hasNoFlag = monthStatus.some((month) => month.flag === "No");

//       if (hasNoFlag) {
//         alert(
//           "Transport can't be unavailed as one or more months are locked (flag: No)."
//         );
//         return;
//       }

//       // All flags are "Yes", uncheck all months
//       const updatedMonths = monthStatus.map((month) => ({
//         ...month,
//         checked: false,
//       }));
//       setMonthStatus(updatedMonths);
//     }

//     setTransportAvailed(!transportAvailed);
//   };
  
  
//   return (
//     <Modal show={show} onHide={handleClose} size="lg" centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Edit Transport Details</Modal.Title>
//       </Modal.Header>
//       <Modal.Body style={{ maxHeight: "75vh", overflowY: "auto" }}>
//         {/* Search Section */}
//         <div className="container-fluid">
//           <div className="d-flex flex-wrap gap-2 mb-3">
//             <button
//               type="button"
//               className="btn btn-primary"
//               onClick={handleSaveChanges}
//             >
//               Save
//             </button>
//             <button type="button" className="btn btn-secondary me-2">
//               Clear
//             </button>
//             <button
//               onClick={handleClose}
//               type="button"
//               className="btn btn-danger"
//               data-bs-dismiss="modal"
//             >
//               Close
//             </button>
//           </div>
//           {/* Student Info */}
//           <div className="border p-3 rounded">
//             <div className="row g-2">
//               <div className="col-md-4">
//                 <label className="form-label">Student Name</label>
//                 <input
//                   type="text"
//                   className="form-control detail"
//                   value={transportDetails?.student_name || ""}
//                   readOnly
//                   disabled
//                 />
//               </div>

//               <div className="col-md-4">
//                 <label className="form-label">Admission No</label>
//                 <input
//                   type="text"
//                   className="form-control detail"
//                   value={transportDetails?.admission_no || ""}
//                   readOnly
//                   disabled
//                 />
//               </div>

//               <div className="col-md-4">
//                 <label className="form-label">Student Barcode</label>
//                 <input
//                   type="text"
//                   className="form-control detail"
//                   value={studentData.barcode || ""}
//                   readOnly
//                   disabled
//                 />
//               </div>
//             </div>

//             <div className="row g-2 mt-2">
//               <div className="col-md-4">
//                 <label className="form-label">Father Name</label>
//                 <input
//                   type="text"
//                   className="form-control detail"
//                   value={transportDetails?.father_name || ""}
//                   readOnly
//                   disabled
//                 />
//               </div>

//               <div className="col-md-4">
//                 <label className="form-label">Mother Name</label>
//                 <input
//                   type="text"
//                   className="form-control detail"
//                   value={transportDetails?.mother_name || ""}
//                   readOnly
//                   disabled
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Transport Details */}
//           <div className="border p-3 rounded mt-3">
//             <fieldset className="p-3">
//               <legend className="fw-bold">Student Transport Details</legend>
//               <div className="d-flex justify-content-end">
//                 <label className="form-check-label fw-bold">
//                   <input
//                     type="checkbox"
//                     className="form-check-input me-2"
//                     checked={transportAvailed}
//                     // onChange={(e) => setTransportAvailed(e.target.checked)}
//                     onChange={handleTransportAvailedChange}
//                   />
//                   Transport Availed
//                 </label>
//               </div>
//               {/* Semester Selection */}
//               <div className="row g-2 mt-3">
//                 {Array.from(
//                   { length: transportDetails?.total_semesters || 0 },
//                   (_, index) => {
//                     const sem = index + 1;
//                     return (
//                       <div key={sem} className="col-6 col-md-3">
//                         <label className="form-check-label">
//                           <input
//                             type="checkbox"
//                             className="form-check-input me-2"
//                             checked={selectedSemesters.includes(sem)}
//                             onChange={() => handleSemesterToggle(sem)}
//                             disabled={!transportAvailed}
//                           />
//                           Semester {sem}
//                         </label>
//                       </div>
//                     );
//                   }
//                 )}
//               </div>

//               {/* Transport Selection */}
//               <div className="row g-2 mt-3">
//                 <div className="col-md-4">
//                   <label className="form-label fw-bold">Route</label>
//                   <Select
//                     options={routeOptions}
//                     className="detail"
//                     value={selectedRoute}
//                     onChange={(option) => {
//                       setSelectedRoute(option);
//                       setSelectedPickup(null);
//                       setAmount("");
//                     }}
//                     isDisabled={!transportAvailed}
//                     placeholder="Select a route"
//                   />
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label fw-bold">Pickup Point</label>
//                   <Select
//                     options={pickupPoints}
//                     className="detail"
//                     value={selectedPickup}
//                     onChange={(option) => {
//                       setSelectedPickup(option);
//                       setAmount(option.amount);
//                     }}
//                     isDisabled={!selectedRoute || !transportAvailed}
//                     placeholder="Select a pickup point"
//                   />
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label fw-bold">Amount</label>
//                   <input
//                     type="text"
//                     className="form-control detail"
//                     value={amount}
//                     readOnly
//                     disabled
//                   />
//                 </div>
//               </div>
//             </fieldset>
//           </div>
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// };
// export default EditTransportModal;


import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
const EditTransportModal = ({
  show,
  handleClose,
  // studentData,
  transportDetails,
  routes,
}) => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedPickup, setSelectedPickup] = useState("");
  const [amount, setAmount] = useState("");
  const [transportAvailed, setTransportAvailed] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [route, setRoute] = useState([]);
  const [months, setMonths] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [selectedPickups, setSelectedPickups] = useState(null);
  const [amounts, setAmounts] = useState("");
  const [monthStatus, setMonthStatus] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);
  const [selectedSemesters, setSelectedSemesters] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [barcode, setBarcode] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [collegeAdmissionNo, setCollegeAdmissionNo] = useState("");
  const [studentData, setStudentData] = useState({});
  const [lockedSemesters, setLockedSemesters] = useState([]);


  const handleSemesterToggle = (sem) => {
    setSelectedSemesters((prev) =>
      prev.includes(sem) ? prev.filter((s) => s !== sem) : [...prev, sem]
    );
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      const organization_id = sessionStorage.getItem("organization_id");
      const branch_id = sessionStorage.getItem("branch_id");
      const token = localStorage.getItem("accessToken");

      if (!organization_id || !branch_id) {
        console.error("Missing organization_id or branch_id");
        return;
      }

      try {
        const response = await fetch(
          `${ApiUrl.apiurl}Transport/routemasterlist/?organization_id=${organization_id}&branch_id=${branch_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch routes");

        const data = await response.json();

        const formattedRoutes = data.map((route) => ({
          value: route.id,
          label: route.transport_name,
        }));

        setRouteOptions(formattedRoutes);

        if (transportDetails?.routeId) {
          const matchedRoute = formattedRoutes.find(
            (r) => r.value === transportDetails.routeId
          );
          setSelectedRoute(matchedRoute || null);
        }
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    if (show) fetchRoutes();
  }, [show, transportDetails]);

  useEffect(() => {
    if (!selectedRoute) return;

    const fetchPickupPoints = async () => {
      const organization_id = sessionStorage.getItem("organization_id");
      const branch_id = sessionStorage.getItem("branch_id");
      const token = localStorage.getItem("accessToken");

      if (!organization_id || !branch_id) {
        console.error("Missing organization_id or branch_id");
        return;
      }

      try {
        const response = await fetch(
          `${ApiUrl.apiurl}Transport/GetAllPickupPointBasedOnRoute/?route_id=${selectedRoute.value}&organization_id=${organization_id}&branch_id=${branch_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch pickup points");

        const data = await response.json();

        const formattedPickupPoints = (data.data || []).map((point) => ({
          value: point.routeDetailsId,
          label: point.pickup_point_name,
          amount: point.amount,
        }));

        setPickupPoints(formattedPickupPoints);

        if (transportDetails?.pickupPointName) {
          const matchedPickup = formattedPickupPoints.find(
            (p) => p.label === transportDetails.pickupPointName
          );

          if (matchedPickup) {
            setSelectedPickup(matchedPickup);
            setAmount(matchedPickup.amount);
          }
        }
      } catch (error) {
        console.error("Error fetching pickup points:", error);
      }
    };

    fetchPickupPoints();
  }, [selectedRoute, transportDetails]);

 useEffect(() => {
   if (!transportDetails || Object.keys(transportDetails).length === 0) return;

   // Save student details
   setStudentData((prev) => ({
     ...prev,
     student_id: transportDetails.student_id,
     barcode: transportDetails.barcode,
     admission_no: transportDetails.admission_no,
     student_name: transportDetails.student_name,
   }));

   setTransportAvailed(Boolean(transportDetails.transport_avail));

   // ✅ Original semesters from API (locked)
   if (Array.isArray(transportDetails.choice_semester)) {
     const original = transportDetails.choice_semester
       .filter((s) => String(s.flag).toLowerCase() === "yes")
       .map((s) => Number(s.semester_id));

     setSelectedSemesters(original); // preselect
     setLockedSemesters(original); // lock these
   }

   // Route
   const matchedRoute =
     routeOptions.find(
       (r) => Number(r.value) === Number(transportDetails.routeId)
     ) || null;
   setSelectedRoute(matchedRoute);

   // Pickup
   if (transportDetails.pickup_point_id != null) {
     setSelectedPickup({
       value: Number(transportDetails.pickup_point_id),
       label: transportDetails.pickup_point_name || "",
       amount: transportDetails.amount,
     });
     setAmount(transportDetails.amount);
   } else {
     setSelectedPickup(null);
     setAmount("");
   }
 }, [transportDetails, routeOptions]);


  // const handleSaveChanges = async () => {
  //   if (!studentData?.student_id) {
  //     alert("Student ID is missing!");
  //     return;
  //   }

  //   const userId = sessionStorage.getItem("userId");
  //   if (!userId) {
  //     alert("User ID is missing in session!");
  //     return;
  //   }

  //   const token = localStorage.getItem("accessToken");
  //   if (!token) {
  //     alert("Access token missing!");
  //     return;
  //   }

  //   // Choice semesters array
  //   const selectedSemesterIds = selectedSemesters.map((id) => Number(id));

  //   const payload = {
  //     student_id: studentData.student_id, //  now populated
  //     transport_avail: transportAvailed,
  //     choice_semesters: selectedSemesterIds,
  //     route_id: selectedRoute?.value || null,
  //     pickup_point_id: selectedPickup?.value || null,
  //     amount: parseFloat(amount),
  //     created_by: Number(userId),
  //   };

  //   console.log("Final Payload Sent:", payload);

  //   try {
  //     const response = await fetch(
  //       `${ApiUrl.apiurl}Transport/UpdateStudentTransport/`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     if (!response.ok) throw new Error("Failed to update transport details");

  //     alert("Transport details updated successfully!");
  //     handleClose();
  //     // window.location.reload();
  //   } catch (error) {
  //     console.error("Error updating transport:", error);
  //     alert("Failed to update transport details. Please try again.");
  //   }
  // };

  const handleSaveChanges = async () => {
    if (!studentData?.student_id) {
      alert("Student ID is missing!");
      return;
    }

    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      alert("User ID is missing in session!");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Access token missing!");
      return;
    }

    // 🔹 Original semesters from API
    const originalSemesters = Array.isArray(transportDetails?.choice_semester)
      ? transportDetails.choice_semester
          .filter((s) => String(s.flag).toLowerCase() === "yes")
          .map((s) => Number(s.semester_id))
      : [];

    // 🔹 Current selected semesters
    const currentSemesters = selectedSemesters.map(Number);

    // 🔹 Total semesters count
    const totalSemesters = transportDetails?.total_semesters || 0;

    let semestersToSend = [];

    // 🔹 If all semesters selected → send empty array
    if (currentSemesters.length === totalSemesters) {
      semestersToSend = [];
    } else {
      // 🔹 Send only newly selected semesters
      semestersToSend = currentSemesters.filter(
        (sem) => !originalSemesters.includes(sem)
      );
    }

    const payload = {
      student_id: studentData.student_id,
      transport_avail: transportAvailed,
      choice_semesters: semestersToSend, // ✅ FIXED LOGIC
      route_id: selectedRoute?.value || null,
      pickup_point_id: selectedPickup?.value || null,
      amount: parseFloat(amount),
      created_by: Number(userId),
    };

    console.log("Final Payload Sent:", payload);

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}Transport/UpdateStudentTransport/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to update transport details");

      alert("Transport details updated successfully!");
      handleClose();
    } catch (error) {
      console.error("Error updating transport:", error);
      alert("Failed to update transport details. Please try again.");
    }
  };

  const handleTransportAvailedChange = () => {
    if (transportAvailed) {
      // User is trying to uncheck
      const hasNoFlag = monthStatus.some((month) => month.flag === "No");

      if (hasNoFlag) {
        alert(
          "Transport can't be unavailed as one or more months are locked (flag: No)."
        );
        return;
      }

      // All flags are "Yes", uncheck all months
      const updatedMonths = monthStatus.map((month) => ({
        ...month,
        checked: false,
      }));
      setMonthStatus(updatedMonths);
    }

    setTransportAvailed(!transportAvailed);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Transport Details</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "75vh", overflowY: "auto" }}>
        {/* Search Section */}
        <div className="container-fluid">
          <div className="d-flex flex-wrap gap-2 mb-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveChanges}
            >
              Save
            </button>
            <button type="button" className="btn btn-secondary me-2">
              Clear
            </button>
            <button
              onClick={handleClose}
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
          {/* Student Info */}
          <div className="border p-3 rounded">
            <div className="row g-2">
              <div className="col-md-4">
                <label className="form-label">Student Name</label>
                <input
                  type="text"
                  className="form-control detail"
                  value={transportDetails?.student_name || ""}
                  readOnly
                  disabled
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Admission No</label>
                <input
                  type="text"
                  className="form-control detail"
                  value={transportDetails?.admission_no || ""}
                  readOnly
                  disabled
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Student Barcode</label>
                <input
                  type="text"
                  className="form-control detail"
                  value={studentData.barcode || ""}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="row g-2 mt-2">
              <div className="col-md-4">
                <label className="form-label">Father Name</label>
                <input
                  type="text"
                  className="form-control detail"
                  value={transportDetails?.father_name || ""}
                  readOnly
                  disabled
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Mother Name</label>
                <input
                  type="text"
                  className="form-control detail"
                  value={transportDetails?.mother_name || ""}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Transport Details */}
          <div className="border p-3 rounded mt-3">
            <fieldset className="p-3">
              <legend className="fw-bold">Student Transport Details</legend>
              <div className="d-flex justify-content-end">
                <label className="form-check-label fw-bold">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={transportAvailed}
                    // onChange={(e) => setTransportAvailed(e.target.checked)}
                    onChange={handleTransportAvailedChange}
                  />
                  Transport Availed
                </label>
              </div>
              {/* Semester Selection */}
              <div className="row g-2 mt-3">
                {Array.from(
                  { length: transportDetails?.total_semesters || 0 },
                  (_, index) => {
                    const sem = index + 1;

                    const isLocked = lockedSemesters.includes(sem);

                    return (
                      <div key={sem} className="col-6 col-md-3">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            className="form-check-input me-2"
                            checked={selectedSemesters.includes(sem)}
                            onChange={() => handleSemesterToggle(sem)}
                            disabled={!transportAvailed || isLocked} // ✅ LOCKED HERE
                          />
                          Semester {sem}
                        </label>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Transport Selection */}
              <div className="row g-2 mt-3">
                <div className="col-md-4">
                  <label className="form-label fw-bold">Route</label>
                  <Select
                    options={routeOptions}
                    className="detail"
                    value={selectedRoute}
                    onChange={(option) => {
                      setSelectedRoute(option);
                      setSelectedPickup(null);
                      setAmount("");
                    }}
                    isDisabled={!transportAvailed}
                    placeholder="Select a route"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Pickup Point</label>
                  <Select
                    options={pickupPoints}
                    className="detail"
                    value={selectedPickup}
                    onChange={(option) => {
                      setSelectedPickup(option);
                      setAmount(option.amount);
                    }}
                    isDisabled={!selectedRoute || !transportAvailed}
                    placeholder="Select a pickup point"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Amount</label>
                  <input
                    type="text"
                    className="form-control detail"
                    value={amount}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default EditTransportModal;