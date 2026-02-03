import React, { useState } from "react";
import { Form, Button, Table, Container } from "react-bootstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const ResultPublishs = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    admissionNo: "",
    studentBarcode: "",
    fatherName: "",
    motherName: "",
    class: "",
    section: "",
    rollNo: "",
    schoolAdmissionNo: "",
    status: "ACTIVE",
  });

  const [isViewClicked, setIsViewClicked] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData({
      ...formData,
      [name]: selectedOption ? selectedOption.value : "",
    });
  };

  const classOptions = [
    { value: "PP-II", label: "PP-II" },
    { value: "PP-I", label: "PP-I" },
  ];

  const sectionOptions = [
    { value: "Jasmine", label: "Jasmine" },
    { value: "Rose", label: "Rose" },
  ];

  const termOptions = [
    { value: "Term 1", label: "Term 1" },
    { value: "Term 2", label: "Term 2" },
  ];

  const statusOptions = [
    { value: "ACTIVE", label: "ACTIVE" },
    { value: "INACTIVE", label: "INACTIVE" },
  ];

  const handleSearch = () => {
    setIsViewClicked(true);
  };

  const handleClear = () => {
    setFormData({
      studentName: "",
      admissionNo: "",
      studentBarcode: "",
      fatherName: "",
      motherName: "",
      class: "",
      section: "",
      rollNo: "",
      schoolAdmissionNo: "",
      status: "ACTIVE",
    });
    setIsViewClicked(false);
  };

  const handleClose = () => {
    setIsViewClicked(false);
  };
  const handleAddDataClick = () => {
    navigate("/staff/staff-add-student-data");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                STUDENT SEARCH
              </p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 ">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
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
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div
                  className="col-12 custom-section-box"
                  style={{
                    minHeight: "140px",
                    padding: "20px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                  }}
                >
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-4 mb-1">
                        <label htmlFor="date" className="form-label">
                          Student Name{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="student-name"
                          className="form-control detail"
                        />
                      </div>
                      <div className="col-12 col-md-4 mb-1">
                        <label htmlFor="teacher" className="form-label">
                          Admission No<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="teacher-no"
                          className="form-control detail"
                        />
                      </div>
                      <div className="col-12 col-md-4 mb-1">
                        <label htmlFor="class" className="form-label">
                          Student Barcode<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="student-barcode"
                          className="form-control detail"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-4 mb-1">
                        <label htmlFor="class" className="form-label">
                          Class<span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                          id="class"
                          className="form-select"
                        >
                          <option value="">Select Class</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10</option>
                          <option value="LKG">LKG</option>
                          <option value="UKG">UKG</option>
                        </select>
                      </div>
                      <div className="col-12 col-md-4 mb-1">
                        <label htmlFor="subject" className="form-label">
                          Section<span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                          id="section"
                          className="form-select"
                        >
                          <option value="">Select Section</option>
                        </select>
                      </div>
                      <div className="col-12 col-md-4 mb-1">
                        <label htmlFor="class" className="form-label">
                          Roll No<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="student-barcode"
                          className="form-control detail"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-4 mb-1">
                        <label htmlFor="date" className="form-label">
                          Father Name{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="fathher-name"
                          className="form-control detail"
                        />
                      </div>
                      <div className="col-12 col-md-4 mb-1">
                        <label htmlFor="teacher" className="form-label">
                          Mother Name<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="mother-name"
                          className="form-control detail"
                        />
                      </div>
                      <div className="col-12 col-md-4 mb-1">
                        <label htmlFor="class" className="form-label">
                          Registration No<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="registration-no"
                          className="form-control detail"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-4 mb-1">
                        <label htmlFor="date" className="form-label">
                          Status{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                          id="status"
                          className="form-select"
                        >
                          <option value="">Select Status</option>
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="INACTIVE">INACTIVE</option>
                        </select>
                      </div>
                      <div className="col-12 col-md-4 mb-1">

                      </div>
                      <div className="col-12 col-md-4 mb-1">

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sl.No</th>
                        <th>Class</th>
                        <th>Section</th>
                        <th>Student Name</th>
                        <th>Admission No</th>
                        <th>Roll No</th>
                        <th>Barcode</th>
                        <th>Father Name</th>
                        <th>Mother Name</th>
                        <th>Select Term</th>
                        <th>Add Exam Data</th>
                        <th>View Exam Report</th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ResultPublishs;
