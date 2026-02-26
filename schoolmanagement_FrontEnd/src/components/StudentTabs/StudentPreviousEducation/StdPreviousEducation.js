import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import useStudentDetails from "../../hooks/useStudentDetails";

function StdPreviousEducation() {
  const navigate = useNavigate();

  // Get student ID from sessionStorage
  const studentId = sessionStorage.getItem("userId");

  // Fetch student details using the hook
  const { studentDetails, error } = useStudentDetails(studentId);

  const handleClose = () => {
    navigate("/student/dashboards");
  };

  const [previousEducation, setPreviousEducation] = useState([]);

  // Extract and map previous education data from API response
  useEffect(() => {
    if (studentDetails) {
      // The hook returns result.data, so previous_education_details is directly accessible
      const education = studentDetails.previous_education_details || [];

      console.log("📚 Raw previous education data:", education);

      if (Array.isArray(education) && education.length > 0) {
        // Map API response to display format
        const mappedEducation = education.map((e) => {
          // Format date - handle both YYYY-MM-DD and ISO datetime formats
          const formatDate = (dateValue) => {
            if (!dateValue) return "-";
            if (typeof dateValue === "string") {
              // If it's a datetime string, extract date part
              return dateValue.includes("T") ? dateValue.split("T")[0] : dateValue;
            }
            return dateValue;
          };

          // Handle transfer certificate - can be null, true, false, "Y", or "N"
          const getTransferCertificate = (value) => {
            if (value === true || value === "Y" || value === "y") return "Yes";
            if (value === false || value === "N" || value === "n") return "No";
            if (value === null || value === undefined || value === "") return "-";
            return "-";
          };

          return {
            id: e.id || "",
            nameOfSchool: e.name_of_institution || "-",
            location: e.location || "-",
            classCompleted: e.course_completed || "-",
            yearFrom: formatDate(e.year_from),
            yearTo: formatDate(e.year_to),
            languageOfInstruction: e.language_of_instruction || "-",
            transferCertificate: getTransferCertificate(e.transfer_certificate),
            result: e.result || "-",
          };
        });

        console.log("✅ Mapped previous education data:", mappedEducation);
        setPreviousEducation(mappedEducation);
      } else {
        console.log("⚠️ No previous education records found");
        setPreviousEducation([]);
      }
    }
  }, [studentDetails]);

  // Error state
  if (error) {
    return (
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-12">
            <Alert variant="danger">
              <Alert.Heading>Error</Alert.Heading>
              <p>{error}</p>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <div className="row mb-3 mt-3 mx-0" style={{ alignItems: "center" }}>
                <div className="col-12 d-flex align-items-center">
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{ width: "120px", marginRight: "15px" }}
                    onClick={handleClose}
                  >
                    Close
                  </button>
                  <p
                    style={{
                      marginBottom: "0px",
                      textAlign: "center",
                      fontSize: "20px",
                      fontWeight: "700",
                      flex: 1,
                    }}
                  >
                    PREVIOUS EDUCATION DETAILS
                  </p>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-secondary">
                      <tr>
                        <th>Sr.No</th>
                        <th>Name of School/Institution</th>
                        <th>Location</th>
                        <th>Class Completed</th>
                        <th>Year From</th>
                        <th>Year To</th>
                        <th>Language of Instruction</th>
                        <th>Transfer Certificate</th>
                        <th>Result</th>
                      </tr>
                    </thead>
                    <tbody style={{ backgroundColor: "#ffffff" }}>
                      {previousEducation.length > 0 ? (
                        previousEducation.map((edu, index) => (
                          <tr key={edu.id || index} style={{ backgroundColor: "#ffffff" }}>
                            <td>{index + 1}</td>
                            <td>{edu.nameOfSchool}</td>
                            <td>{edu.location}</td>
                            <td>{edu.classCompleted}</td>
                            <td>{edu.yearFrom}</td>
                            <td>{edu.yearTo}</td>
                            <td>{edu.languageOfInstruction}</td>
                            <td>{edu.transferCertificate}</td>
                            <td>{edu.result}</td>
                          </tr>
                        ))
                      ) : (
                        <tr style={{ backgroundColor: "#ffffff" }}>
                          <td colSpan="9" className="text-center">
                            No previous education records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StdPreviousEducation;
