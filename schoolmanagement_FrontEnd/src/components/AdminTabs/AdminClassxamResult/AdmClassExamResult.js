import React, { useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SelectStudentModal from "../AdminAttendanceEntry/SelectStudentModal";

const AdmAttendanceEntry = () => {
  const [showModal, setShowModal] = useState(false);

  const dateFromRef = useRef(null);
  const dateToRef = useRef(null);
  const messageTypeRef = useRef(null);
  const studentNameRef = useRef(null);
  const initiatedByRef = useRef(null);
  const sectionRef = useRef(null);
  const classRef = useRef(null);

  const handleClear = () => {
    if (dateFromRef.current) dateFromRef.current.value = "";
    if (dateToRef.current) dateToRef.current.value = "";
    if (messageTypeRef.current) messageTypeRef.current.value = "";
    if (studentNameRef.current) studentNameRef.current.value = "";
    if (initiatedByRef.current) initiatedByRef.current.value = "";
    if (sectionRef.current) sectionRef.current.value = "";
    if (classRef.current) classRef.current.value = "";
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
                EXAM RESULT
              </p>
              <div className="row mb-3 mt-3 mx-0 ">
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
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                  >
                    Export to Excel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                  >
                    Export to PDF
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mt-2">
                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="from-class" className="form-label">
                          Class
                        </label>
                        <select
                          id="from-class"
                          className="detail"
                          ref={initiatedByRef}
                        >
                          <option value="">Select class</option>
                          <option value="prenursery">PRENURSERY</option>
                          <option value="nursery">NURSERY</option>
                          <option value="ppi">PPI</option>
                          <option value="ppii">PPII</option>
                          <option value="ppiii">PPIII</option>
                          <option value="test">TEST</option>
                          <option value="kg">KG</option>
                          <option value="i">I</option>
                          <option value="ii">II</option>
                          <option value="iii">III</option>
                          <option value="iv">IV</option>
                          <option value="v">V</option>
                          <option value="vi">VI</option>
                          <option value="vii">VII</option>
                          <option value="viii">VIII</option>
                          <option value="ix">IX</option>
                          <option value="x">X</option>
                          <option value="xi arts">XI ARTS</option>
                          <option value="xi commerce">XI COMMERCE</option>
                          <option value="xii arts">XII ARTS</option>
                          <option value="xii commerce">XII COMMERCE</option>
                        </select>
                      </div>

                      <div className="col-12 col-md-3 mb-0">
                        <label htmlFor="section" className="form-label">
                          Section
                        </label>
                        <select
                          id="section"
                          className="form-select"
                          ref={sectionRef}
                        >
                          <option value="">Select Section</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                        </select>
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="term" className="form-label">
                          Term
                        </label>
                        <select
                          id="term"
                          className="form-select"
                          ref={classRef}
                        >
                          <option value="">Select term</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                        </select>
                      </div>
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="subject" className="form-label">
                          Subject
                        </label>
                        <select
                          id="subject"
                          className="form-select"
                          ref={classRef}
                        >
                          <option value="">Select subject</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                        </select>
                      </div>

                      <SelectStudentModal
                        show={showModal}
                        handleClose={handleCloseModal}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="row">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>Sr.No</th>
                          <th>Student Name</th>
                          <th>School Admission No</th>
                          <th>Barcode</th>
                          <th>Class</th>
                          <th>Section</th>
                          <th>Father Name</th>
                          <th>Mother Name</th>
                          <th>House</th>
                          <th>Club</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody colspan={9}>No Data Found</tbody>
                    </table>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmAttendanceEntry;
