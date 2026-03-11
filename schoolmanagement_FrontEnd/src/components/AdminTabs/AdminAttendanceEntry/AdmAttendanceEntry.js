// import React, { useRef, useState } from "react";
// import { Modal, Button } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import SelectStudentModal from "./SelectStudentModal";
// import useFetchClasses from "../../hooks/useFetchClasses";
// import { useNavigate } from "react-router-dom";


// const AdmAttendanceEntry = () => {
//     const navigate = useNavigate();
//   const dateRef = useRef(null);
//   const fromClassRef = useRef(null);
//   const toClassRef = useRef(null);
//   const admissionNoRef = useRef(null);
//   const barcodeRef = useRef(null);
//   const smsToRef = useRef(null);

//   const [showModal, setShowModal] = useState(false);
//   const { classes, loading, error } = useFetchClasses(); 


//   const handleClear = () => {
//     if (dateRef.current) dateRef.current.value = "";
//     if (fromClassRef.current) fromClassRef.current.value = "";
//     if (toClassRef.current) toClassRef.current.value = "";
//     if (admissionNoRef.current) admissionNoRef.current.value = "";
//     if (barcodeRef.current) barcodeRef.current.value = "";
//     if (smsToRef.current) smsToRef.current.checked = false;
//   };

//   const handleShow = () => setShowModal(true);
//   const handleClose = () => setShowModal(false);


//   return (
//     <div className="container-fluid ">
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
//                 Attendance Entry
//               </p>

//               <div className="row mb-2 mt-3 mx-0">
//                 <div className="col-12">
//                   <button
//                     type="button"
//                     className="btn btn-primary me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                   >
//                     Save
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-secondary me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                     onClick={handleClear}
//                   >
//                     Clear
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-danger me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                     onClick={() => navigate("/admin/dashboard")}
//                   >
//                     Close
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-primary me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                     onClick={handleShow}
//                   >
//                     Select Student

//                   </button>
//                 </div>
//               </div>

//               <div className="row mt-3 mx-2">
//                 <div className="col-12 custom-section-box">
//                   <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
//                     <div className="row flex-grow-1 mb-3 mt-3">
//                       <div className="col-12 col-md-3 ">
//                         <label htmlFor="date" className="form-label">
//                           Date <span style={{ color: "red" }}>*</span>
//                         </label>
//                         <input
//                           type="date"
//                           id="date"
//                           className="form-control detail"
//                           ref={dateRef}
//                         />
//                       </div>

//                       <div className="col-12 col-md-3 mb-3">
//                         <label htmlFor="admitted-class" className="form-label">
//                           From Class<span style={{ color: "red" }}>*</span>
//                         </label>
//                         {loading ? (
//                           <p>Loading classes...</p>
//                         ) : error ? (
//                           <p>Error loading classes: {error}</p>
//                         ) : (
//                           <select id="admitted-class" className="detail">
//                             <option value="">Select Class</option>
//                             {classes.map((classItem) => (
//                               <option key={classItem.id} value={classItem.id}>
//                                 {classItem.classname}
//                               </option>
//                             ))}
//                           </select>
//                         )}
//                       </div>

//                       <div className="col-12 col-md-3 mb-1">
//                         <label htmlFor="admitted-class" className="form-label">
//                           To Class<span style={{ color: "red" }}>*</span>
//                         </label>
//                         {loading ? (
//                           <p>Loading classes...</p>
//                         ) : error ? (
//                           <p>Error loading classes: {error}</p>
//                         ) : (
//                           <select id="admitted-class" className="detail">
//                             <option value="">Select Class</option>
//                             {classes.map((classItem) => (
//                               <option key={classItem.id} value={classItem.id}>
//                                 {classItem.classname}
//                               </option>
//                             ))}
//                           </select>
//                         )}
//                       </div>

//                       {/* <div
//                         className="d-none d-md-block"
//                         style={{
//                           width: "1px",
//                           backgroundColor: "#ccc",
//                           height: "100px",
//                           margin: "0 10px",
//                         }}
//                       ></div> */}

//                       <div className="col-12 col-md-3 mb-1">
//                         <label htmlFor="admission-no" className="form-label">
//                           School Admission No
//                         </label>
//                         <input
//                           type="text"
//                           id="admission-no"
//                           className="form-control detail"
//                           placeholder="Enter admission number"
//                           ref={admissionNoRef}
//                         />
//                       </div>

//                       <div className="col-12 col-md-3 mb-1">
//                         <label htmlFor="barcode" className="form-label">
//                           Barcode
//                         </label>
//                         <input
//                           type="text"
//                           id="barcode"
//                           className="form-control detail"
//                           placeholder="Enter barcode"
//                           ref={barcodeRef}
//                         />
//                       </div>
//                       <div className="col-12 col-md-3 mb-1">
//                         <span className="me-3" style={{ fontWeight: "700" }}>
//                           Send SMS to:
//                         </span>
//                         <div className="d-flex flex-row me-2">
//                           <div className="form-check me-3">
//                             <input
//                               className="form-check-input"
//                               type="radio"
//                               name="flexRadioDefault"
//                               id="flexRadioDefault1"
//                               ref={smsToRef} // Attach ref
//                             />
//                             <label
//                               className="form-check-label"
//                               htmlFor="flexRadioDefault1"
//                             >
//                               Father
//                             </label>
//                           </div>
//                           <div className="form-check me-3">
//                             <input
//                               className="form-check-input"
//                               type="radio"
//                               name="flexRadioDefault"
//                               id="flexRadioDefault2"
//                               defaultChecked
//                               ref={smsToRef} // Attach ref
//                             />
//                             <label
//                               className="form-check-label"
//                               htmlFor="flexRadioDefault2"
//                             >
//                               Mother
//                             </label>
//                           </div>
//                           <div className="form-check">
//                             <input
//                               className="form-check-input"
//                               type="radio"
//                               name="flexRadioDefault"
//                               id="flexRadioDefault3"
//                               ref={smsToRef}
//                             />
//                             <label
//                               className="form-check-label"
//                               htmlFor="flexRadioDefault3"
//                             >
//                               Both
//                             </label>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="mb-3 me-2 d-flex align-items-center">
//                         <button
//                           type="button"
//                           className="btn btn-primary me-2"
//                           style={{
//                             "--bs-btn-padding-y": ".25rem",
//                             "--bs-btn-padding-x": ".5rem",
//                             "--bs-btn-font-size": ".75rem",
//                             width: "70px",
//                             marginTop: "15px",
//                           }}
//                         >
//                           Add
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="col-12">
//                 <div className="table-responsive">
//                   <table className="table table-bordered ">
//                     <thead>
//                       <tr>
//                         <th>Sl.No</th>
//                         <th>Class</th>
//                         <th>Section</th>
//                         <th>Roll No</th>
//                         <th>School Admission No</th>
//                         <th>BarCode</th>
//                         <th>Student Name</th>
//                         <th>Primary Guardian</th>
//                         <th>Father Mobile No</th>
//                         <th>Mother Mobile No</th>
//                         <th>Mark Attendance</th>
//                         <th>Remarks</th>
//                         <th>Remove</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr>
//                         {/* <td>1</td>
//                           <td>John Doe</td>
//                           <td>Present</td> */}
//                       </tr>
//                       {/* Add more rows as needed */}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               <SelectStudentModal show={showModal} handleClose={handleClose} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdmAttendanceEntry;




import React, { useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import SelectStudentModal from "./SelectStudentModal";
import useFetchClasses from "../../hooks/useFetchClasses";
import { useNavigate } from "react-router-dom";


const AdmAttendanceEntry = () => {
  // const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState({
    name: "",
    barcode: "",
    admissionNo: "",
    fatherName: "",
    motherName: "",
    schoolAdmissionNo: "",
  });
  const [sectionId, setSectionId] = useState(null);
  const [classId, setClassId] = useState(null);

  // const navigate = useNavigate();
  const dateRef = useRef(null);
  const fromClassRef = useRef(null);
  const toClassRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);


  const { classes, loading, error } = useFetchClasses();


  const handleClear = () => {
    if (dateRef.current) dateRef.current.value = "";
    if (fromClassRef.current) fromClassRef.current.value = "";
    if (toClassRef.current) toClassRef.current.value = "";
    if (admissionNoRef.current) admissionNoRef.current.value = "";
    if (barcodeRef.current) barcodeRef.current.value = "";
    if (smsToRef.current) smsToRef.current.checked = false;
  };
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);


  const handleSelectStudent = (selectedStudent) => {
    const fullName = [
      selectedStudent.studentBasicDetails.first_name || "",
      selectedStudent.studentBasicDetails.middle_name || "",
      selectedStudent.studentBasicDetails.last_name || "",
    ]
      .filter(Boolean)
      .join(" ");

    // Set studentId when selecting a student (we will use this for the search)
    setStudentId(selectedStudent.studentBasicDetails.id || "");
    setStudentName(fullName); // Set student name for display (not used for search)
    setClassId(selectedStudent.studentBasicDetails.addmitted_class || null);
    setSectionId(selectedStudent.studentBasicDetails.addmitted_section || null);


  };

  return (
    <div className="container-fluid ">
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
                Attendance Entry
              </p>

              <div className="row mb-2 mt-3 mx-0">
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleShow}
                  >
                    Select Student
                  </button>

                  <SelectStudentModal
                    show={show}
                    onSelectStudent={handleSelectStudent} //  Must pass this
                    handleClose={handleClose} // Pass close function
                  />
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mb-3 mt-3">
                      <div className="col-12 col-md-3 ">
                        <label htmlFor="date" className="form-label">
                          Date <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="date"
                          id="date"
                          className="form-control detail"
                          ref={dateRef}
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="admitted-class" className="form-label">
                          From Class<span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading classes...</p>
                        ) : error ? (
                          <p>Error loading classes: {error}</p>
                        ) : (
                          <select id="admitted-class" className="detail">
                            <option value="">Select Class</option>
                            {classes.map((classItem) => (
                              <option key={classItem.id} value={classItem.id}>
                                {classItem.classname}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="admitted-class" className="form-label">
                          To Class<span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading classes...</p>
                        ) : error ? (
                          <p>Error loading classes: {error}</p>
                        ) : (
                          <select id="admitted-class" className="detail">
                            <option value="">Select Class</option>
                            {classes.map((classItem) => (
                              <option key={classItem.id} value={classItem.id}>
                                {classItem.classname}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      {/* <div
                        className="d-none d-md-block"
                        style={{
                          width: "1px",
                          backgroundColor: "#ccc",
                          height: "100px",
                          margin: "0 10px",
                        }}
                      ></div> */}

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="admission-no" className="form-label">
                          School Admission No
                        </label>
                        <input
                          type="text"
                          id="admission-no"
                          className="form-control detail"
                          placeholder="Enter admission number"
                          ref={admissionNoRef}
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="barcode" className="form-label">
                          Barcode
                        </label>
                        <input
                          type="text"
                          id="barcode"
                          className="form-control detail"
                          placeholder="Enter barcode"
                          ref={barcodeRef}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-1">
                        <span className="me-3" style={{ fontWeight: "700" }}>
                          Send SMS to:
                        </span>
                        <div className="d-flex flex-row me-2">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault1"
                              ref={smsToRef} // Attach ref
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexRadioDefault1"
                            >
                              Father
                            </label>
                          </div>
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault2"
                              defaultChecked
                              ref={smsToRef} // Attach ref
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexRadioDefault2"
                            >
                              Mother
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault3"
                              ref={smsToRef}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexRadioDefault3"
                            >
                              Both
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 me-2 d-flex align-items-center">
                        <button
                          type="button"
                          className="btn btn-primary me-2"
                          style={{
                            "--bs-btn-padding-y": ".25rem",
                            "--bs-btn-padding-x": ".5rem",
                            "--bs-btn-font-size": ".75rem",
                            width: "70px",
                            marginTop: "15px",
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered ">
                    <thead>
                      <tr>
                        <th>Sl.No</th>
                        <th>Class</th>
                        <th>Section</th>
                        <th>Roll No</th>
                        <th>School Admission No</th>
                        <th>BarCode</th>
                        <th>Student Name</th>
                        <th>Primary Guardian</th>
                        <th>Father Mobile No</th>
                        <th>Mother Mobile No</th>
                        <th>Mark Attendance</th>
                        <th>Remarks</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {/* <td>1</td>
                          <td>John Doe</td>
                          <td>Present</td> */}
                      </tr>
                      {/* Add more rows as needed */}
                    </tbody>
                  </table>
                </div>
              </div>

              <SelectStudentModal show={showModal} handleClose={handleClose} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmAttendanceEntry;

