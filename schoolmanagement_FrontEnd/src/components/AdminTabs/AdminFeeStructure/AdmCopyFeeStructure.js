
import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Table,
  Button,
  Alert,
} from "react-bootstrap"; // Added Button and Alert
import Select from "react-select"; // Import react-select
import { FaPlus, FaMinus } from "react-icons/fa";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";
import useFetchSessionList from "../../hooks/fetchSessionList"
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";




const FeeStructure = () => {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState("current");
  const [feeStructureOptions, setFeeStructureOptions] = useState([]);
  const [selectedFeeStructure, setSelectedFeeStructure] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]); // State to store selected classes
  const [showAdditionalTable, setShowAdditionalTable] = useState({});
  const [alertMessage, setAlertMessage] = useState(""); // State for alert message
  const [showAlert, setShowAlert] = useState(false); // State to control alert visibility
  const [feeDetails, setFeeDetails] = useState(null);
  const [copyAllChecked, setCopyAllChecked] = useState(false);
const [selectedBranches, setSelectedBranches] = useState([]);
const [selectedSessions, setSelectedSessions] = useState([]);
const [selectedCourses, setSelectedCourses] = useState([]);
const [selectedAcademicYears, setSelectedAcademicYears] = useState([]);
const [selectedSemesters, setSelectedSemesters] = useState([]);



const organizationId = sessionStorage.getItem("organization_id");
const branchId = sessionStorage.getItem("branch_id");
// For sessions
const {
  BatchList,
  loading: batchLoading,
  error: batchError,
} = useFetchSessionList(organizationId, branchId);
// Suppose you keep track of selected session IDs:


// For courses, you need a batchId (e.g. from selectedSessions — possibly only one batch at a time)
// Here for example: use the first selectedSession ID as batchId (you can adapt logic as needed)
const batchId = selectedSessions.length > 0 ? selectedSessions[0] : null;
const {
  CourseList,
  loading: courseLoading,
  error: courseError,
} = useFetchCourseByFilter(organizationId, batchId);




const courseId = selectedCourses.length > 0 ? selectedCourses[0] : null;

const { BranchList } = useFetchBranch(
  organizationId,
  branchId,
  batchId,
  courseId
);
const departmentId = selectedBranches.length > 0 ? selectedBranches[0] : null;

const { AcademicYearList } = useFetchAcademicYearByFilter(
  organizationId,
  branchId,
  batchId,
  courseId,
  departmentId
);

const handleAcademicYearSelection = (id) => {
  setSelectedAcademicYears((prev) => {
    if (prev.includes(id)) return prev.filter((x) => x !== id);
    return [...prev, id];
  });
};

const academicYearId =
  selectedAcademicYears.length > 0 ? selectedAcademicYears[0] : null;

const { SemesterList } = useFetchSemesterByFilter(
  organizationId,
  branchId,
  batchId,
  courseId,
  departmentId,
  academicYearId
);
const handleSemesterSelection = (id) => {
  setSelectedSemesters((prev) => {
    if (prev.includes(id)) return prev.filter((x) => x !== id);
    return [...prev, id];
  });
};

const handleBranchSelection = (id) => {
  setSelectedBranches((prev) => {
    if (prev.includes(id)) return prev.filter((x) => x !== id);
    return [...prev, id];
  });
};

  // Handler for sessions:
  const handleSessionSelection = (id) => {
    setSelectedSessions((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  };

  // Handler for courses:
  const handleCourseSelection = (id) => {
    setSelectedCourses((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  };

  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     try {
  //       const token = localStorage.getItem("accessToken"); // optional
  //       const response = await fetch(
  //         "${ApiUrl.apiurl}Course/GetAllCourse/",
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: token ? `Bearer ${token}` : "",
  //           },
  //         }
  //       );

  //       const data = await response.json();
  //       if (data.message === "Success" && Array.isArray(data.data)) {
  //         const mappedCourses = data.data.map((course) => ({
  //           id: course.id,
  //           name: course.course_name,
  //           description: course.description,
  //         }));
  //         setCourses(mappedCourses);
  //       } else {
  //         setCourses([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching courses:", error);
  //       setCourses([]);
  //     }
  //   };

  //   fetchCourses();
  // }, []);

  // Toggle function for plus icon click
  const handleToggle = (index) => {
    setShowAdditionalTable((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const fetchFeeDetails = async (feeStructureId) => {
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}FEESTRUCTURE/GetFeeDetailsBasedOnFeeStructure/${feeStructureId}`
      );
      const data = await response.json();
      if (data.message === "success") {
        setFeeDetails(data.data);
      } else {
        setFeeDetails(null);
      }
    } catch (error) {
      console.error("Error fetching fee details:", error);
      setFeeDetails(null);
    }
  };
  // Fetch fee structure based on academic year ID
  const fetchFeeStructure = async (academicYearId) => {
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}FeeStructure/GetFeeStructureBasedOnAcademicYear/${academicYearId}`
      );
      const data = await response.json();
      if (data.message === "Success") {
        const options = data.data.map((item) => ({
          value: item.id,
          label: item.fee_structure_desc,
        }));
        setFeeStructureOptions(options);
      } else {
        setFeeStructureOptions([]);
      }
    } catch (error) {
      console.error("Error fetching fee structure:", error);
      setFeeStructureOptions([]);
    }
  };

  // Fetch previous academic year based on current academicYearId
  const fetchPreviousAcademicYear = async (academicYearId, orgId, branchId) => {
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}AcademicYear/GetPreviousAcademicYear/${academicYearId}/${orgId}/${branchId}`
      );
      const data = await response.json();
      if (data.message === "success" && data.data.length > 0) {
        const previousYearId = data.data[0].id; // Get the previous year's academic ID
        return previousYearId;
      }
    } catch (error) {
      console.error("Error fetching previous academic year:", error);
      return null;
    }
  };

  // Effect to handle session change and fetch fee structure
  useEffect(() => {
    let academicSessionId = localStorage.getItem("academicSessionId");
    const orgId = localStorage.getItem("orgId");
    const branchId = localStorage.getItem("branchId");

    if (academicSessionId && orgId && branchId) {
      let academicYearId = parseInt(academicSessionId);

      if (selectedSession === "previous") {
        fetchPreviousAcademicYear(academicYearId, orgId, branchId).then(
          (previousYearId) => {
            if (previousYearId) {
              fetchFeeStructure(previousYearId);
            }
          }
        );
      } else {
        fetchFeeStructure(academicYearId);
      }
    }
  }, [selectedSession]);



  const handleSave = async () => {
    let academicSessionId = localStorage.getItem("academicSessionId");
    const orgId = localStorage.getItem("orgId");
    const branchId = localStorage.getItem("branchId");
    const userId = sessionStorage.getItem("userId");
    let academicYearId = parseInt(academicSessionId);
    let feeStructureId = selectedFeeStructure?.value; // default from selection

    // Handle "previous" session logic
    if (selectedSession === "previous") {
      const previousYearId = await fetchPreviousAcademicYear(
        academicYearId,
        orgId,
        branchId
      );

      if (previousYearId) {
        academicYearId = previousYearId;
        feeStructureId = previousYearId; // override if previous selected
      } else {
        setAlertMessage("Error fetching previous academic year.");
        setShowAlert(true);
        return;
      }
    }

    const requestBody = {
      loginUser: parseInt(userId),
      academicyearId: academicYearId,
      feestructureId: feeStructureId,
      classIds: selectedClasses,
    };

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}FEESTRUCTURECOPY/copyfeestructure/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (data.message === "Fees applied successfully on selected classes!!") {
        alert(data.message);
      } else {
        setAlertMessage("Failed to apply fee structure.");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error applying fee structure:", error);
      setAlertMessage("Error applying fee structure.");
      setShowAlert(true);
    }
  };

  const handleClear = () => {
    setSelectedSession("current"); // Reset session selection
    setFeeStructureOptions([]); // Clear fee structure options
    setSelectedFeeStructure(null); // Clear selected fee structure
    setSelectedClasses([]); // Clear selected classes
    setShowAdditionalTable({}); // Hide additional table
    setAlertMessage(""); // Clear alert message
    setShowAlert(false); // Hide alert
    setFeeDetails(null); // Clear fee details
  };

  return (
    <div>
      <div className="row mb-3 mx-0">
        <div className="col-12 mb-3 mt-3 d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-primary me-2"
            style={{
              width: "150px",
            }}
            onClick={handleSave} // Attach the save function
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
        </div>
      </div>

      <div className="row mt-3 mx-2">
        <Form>
          <Row className="custom-section-box ">
            <Col md={8}>
              <Row className="mb-4 mt -5">
                <Col xs={12} md={6} className="mb-3 mb-md-0 mt -5">
                  <Form.Check
                    type="radio"
                    label="Previous Session Fee Structure"
                    name="session"
                    checked={selectedSession === "previous"}
                    // onChange={() => setSelectedSession("previous")}
                    onChange={() => {
                      setSelectedSession("previous");
                      setCopyAllChecked(false); // reset checkbox when session changes
                    }}
                  />
                  <Form.Check
                    type="radio"
                    label="Current Session Fee Structure"
                    name="session"
                    checked={selectedSession === "current"}
                    // onChange={() => setSelectedSession("current")}
                    onChange={() => {
                      setSelectedSession("current");
                      setCopyAllChecked(false); // reset checkbox when session changes
                    }}
                    className="mt-3"
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  {selectedSession && (
                    <>
                      <Form.Label>
                        {selectedSession === "previous"
                          ? "Previous Session Fee Structure"
                          : "Current Session Fee Structure"}
                      </Form.Label>
                      <Select
                        options={feeStructureOptions}
                        placeholder="Select"
                        isDisabled={
                          selectedSession === "previous" && copyAllChecked
                        }
                        onChange={(option) => {
                          setSelectedFeeStructure(option);
                          fetchFeeDetails(option.value); // Fetch fee details when a fee structure is selected
                        }}
                      />
                    </>
                  )}
                </Col>
              </Row>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Session</Form.Label>
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "scroll",
                    border: "1px solid #ddd",
                    padding: "10px",
                  }}
                >
                  {BatchList.length > 0 ? (
                    BatchList.map((session) => (
                      <Form.Check
                        key={session.id}
                        type="checkbox"
                        label={session.batch_code || session.batch_description}
                        checked={selectedSessions.includes(session.id)}
                        onChange={() => handleSessionSelection(session.id)}
                        style={{ marginBottom: "10px" }}
                      />
                    ))
                  ) : (
                    <p style={{ color: "gray", fontSize: "14px" }}>
                      No sessions available
                    </p>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Course</Form.Label>
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "scroll",
                    border: "1px solid #ddd",
                    padding: "10px",
                  }}
                >
                  {CourseList.length > 0 ? (
                    CourseList.map((course) => (
                      <Form.Check
                        key={course.id}
                        type="checkbox"
                        label={course.course_name || course.course_code}
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => handleCourseSelection(course.id)}
                        style={{ marginBottom: "10px" }}
                      />
                    ))
                  ) : (
                    <p style={{ color: "gray", fontSize: "14px" }}>
                      No courses available
                    </p>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Branch</Form.Label>

                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "scroll",
                    border: "1px solid #ddd",
                    padding: "10px",
                  }}
                >
                  {BranchList.length > 0 ? (
                    BranchList.map((branch) => (
                      <Form.Check
                        key={branch.id}
                        type="checkbox"
                        label={branch.department_description}
                        checked={selectedBranches.includes(branch.id)}
                        onChange={() => handleBranchSelection(branch.id)}
                        style={{ marginBottom: "10px" }}
                      />
                    ))
                  ) : (
                    <p style={{ color: "gray", fontSize: "14px" }}>
                      No branches available
                    </p>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Academic Year</Form.Label>

                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "scroll",
                    border: "1px solid #ddd",
                    padding: "10px",
                  }}
                >
                  {AcademicYearList.length > 0 ? (
                    AcademicYearList.map((year) => (
                      <Form.Check
                        key={year.id}
                        type="checkbox"
                        label={
                          year.academic_year_description ||
                          year.academic_year_code
                        }
                        checked={selectedAcademicYears.includes(year.id)}
                        onChange={() => handleAcademicYearSelection(year.id)}
                        style={{ marginBottom: "10px" }}
                      />
                    ))
                  ) : (
                    <p style={{ color: "gray", fontSize: "14px" }}>
                      No academic years available
                    </p>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Semester</Form.Label>

                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "scroll",
                    border: "1px solid #ddd",
                    padding: "10px",
                  }}
                >
                  {SemesterList.length > 0 ? (
                    SemesterList.map((sem) => (
                      <Form.Check
                        key={sem.id}
                        type="checkbox"
                        label={sem.semester_code || sem.semester_description}
                        checked={selectedSemesters.includes(sem.id)}
                        onChange={() => handleSemesterSelection(sem.id)}
                        style={{ marginBottom: "10px" }}
                      />
                    ))
                  ) : (
                    <p style={{ color: "gray", fontSize: "14px" }}>
                      No semesters available
                    </p>
                  )}
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Conditionally render table based on dropdown selection */}
      {feeDetails && (
        <div
          style={{
            marginTop: "20px",
            border: "2px solid #ddd",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <h5>Selected Session Fee Structure Details</h5>
          <Table responsive bordered>
            <thead>
              <tr>
                <th></th>
                <th>Fee Structure Name</th>
                <th>Class</th>
                <th>Version</th>
                <th>Category</th>
                <th>New/Existing</th>
              </tr>
            </thead>
            <tbody>
              {/* Main Fee Structure Details */}
              <tr>
                <td>
                  <FaPlus
                    onClick={() => handleToggle(0)} // Assuming you manage the showAdditionalTable state using index 0
                    style={{ cursor: "pointer" }}
                  />
                </td>
                <td>
                  {feeDetails.feemasterStructureDetails.fee_structure_desc}
                </td>
                <td>{feeDetails.feemasterStructureDetails.classname}</td>
                {/* <td>
                  {feeDetails.feemasterStructureDetails.enabled === "1"
                    ? "Yes"
                    : "No"}
                </td> */}
                <td>{feeDetails.feemasterStructureDetails.version_no}</td>
                {/* <td>2023-06-22</td>
                <td>2024-07-31</td>{" "} */}
                {/* These dates are static, change if needed */}
                {/* <td>
                  {feeDetails.feemasterStructureDetails.category_code === "1"
                    ? "Regular"
                    : "Other"}
                </td> */}
                <td>{feeDetails.feemasterStructureDetails.category_code}</td>
                {/* <td>
                  {feeDetails.feemasterStructureDetails.new_existing === "y"
                    ? "New"
                    : "Existing"}
                </td> */}

                <td>
                  {feeDetails.feemasterStructureDetails.new_existing === "N"
                    ? "NEW"
                    : feeDetails.feemasterStructureDetails.new_existing === "E"
                    ? "Existing"
                    : ""}
                </td>
              </tr>

              {/* Additional Table for Fee Structure Details */}
              {showAdditionalTable[0] && (
                <tr>
                  <td colSpan="9">
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Element Name</th>
                          <th>Frequency</th>
                          <th>Amount</th>
                          <th>Period 1</th>
                          <th>Period 2</th>
                          <th>Period 3</th>
                          <th>Period 4</th>
                          <th>Period 5</th>
                          <th>Period 6</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feeDetails.feestructureDetails.map(
                          (feeDetail, index) => (
                            <tr key={index}>
                              <td>{feeDetail.element_type_name}</td>
                              <td>{feeDetail.element_frequency_name}</td>
                              <td>{feeDetail.amount}</td>
                              <td>{feeDetail.period_1}</td>
                              <td>{feeDetail.period_2}</td>
                              <td>{feeDetail.period_3}</td>
                              <td>{feeDetail.period_4}</td>
                              <td>{feeDetail.period_5}</td>
                              <td>{feeDetail.period_6}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default FeeStructure;















































