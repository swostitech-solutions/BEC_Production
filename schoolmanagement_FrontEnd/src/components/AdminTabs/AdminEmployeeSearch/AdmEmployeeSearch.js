import React, { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "bootstrap/dist/css/bootstrap.min.css";
import SelectStudentModal from "../AdminAttendanceEntry/SelectStudentModal";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import ReactPaginate from "react-paginate";

const AdmAttendanceEntry = () => {

  const [employeeData, setEmployeeData] = useState([]);
  const [employeeTypeOptions, setEmployeeTypeOptions] = useState([]);
  const navigate = useNavigate(); // Initialize the navigate function
  const [editData, setEditData] = useState(null);
  const [searchParams, setSearchParams] = useState({
    employeeCode: "",
    firstName: "",
    middleName: "",
    lastName: "",
    employeeType: null, // for react-select
  });

  // Function to properly format name with correct prefix capitalization
  const formatEmployeeName = (name) => {
    if (!name) return "";

    // Split name into parts
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "";

    // Check if first part is a prefix
    const firstPart = parts[0].toLowerCase();
    const prefixMap = {
      'mr': 'Mr.',
      'mr.': 'Mr.',
      'ms': 'Ms',
      'ms.': 'Ms',
      'mrs': 'Mrs',
      'mrs.': 'Mrs',
      'dr': 'Dr.',
      'dr.': 'Dr.'
    };

    // If first part is a prefix, format it properly
    if (prefixMap[firstPart]) {
      const formattedPrefix = prefixMap[firstPart];
      const restOfName = parts.slice(1).map(part =>
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      ).join(' ');
      return `${formattedPrefix} ${restOfName}`;
    }

    // If no prefix found, just capitalize each word
    return parts.map(part =>
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    ).join(' ');
  };



  const dateFromRef = useRef(null);
  const dateToRef = useRef(null);
  const messageTypeRef = useRef(null);
  const studentNameRef = useRef(null);
  const initiatedByRef = useRef(null);
  const sectionRef = useRef(null);
  const classRef = useRef(null);
  const itemsPerPage = 10; // You can change this value
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployeeData = useMemo(() => {
    if (!searchQuery) return employeeData;
    const lowerQuery = searchQuery.toLowerCase().trim();
    return employeeData.filter((employee) => {
      const searchStr = `
        ${employee.employee_code || ""}
        ${formatEmployeeName(employee.employee_name) || ""}
        ${employee.date_of_birth || ""}
        ${employee.phone_number || ""}
        ${employee.email || ""}
        ${employee.date_of_joining || ""}
      `.toLowerCase();

      const empType = (employee.employee_type || "").toLowerCase();
      let typeMatch = false;

      // Handle the specific issue: searching "teaching" returns "non teaching"
      if (lowerQuery.includes("teach") && !lowerQuery.includes("non")) {
        // If query relates to 'teach' but not 'non', only match types that START with 'teach'
        typeMatch = empType.startsWith("teach");
      } else {
        typeMatch = empType.includes(lowerQuery);
      }

      return searchStr.includes(lowerQuery) || typeMatch;
    });
  }, [employeeData, searchQuery]);

  // Calculate total pages
  const pageCount = Math.ceil(filteredEmployeeData.length / itemsPerPage);

  // Pagination Safety Guard (0-indexed)
  useEffect(() => {
    if (pageCount > 0 && currentPage >= pageCount) {
      setCurrentPage(pageCount - 1); // Fallback to last valid page
    } else if (pageCount === 0 && currentPage !== 0) {
      setCurrentPage(0); // Reset to page 0 if data is completely empty
    }
  }, [pageCount, currentPage]);

  // Reset pagination precisely when global user search query changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  // Get current page data
  const getCurrentPageData = () => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredEmployeeData.slice(start, end);
  };

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleClear = () => {
    // Clear all search fields
    setSearchParams({
      employeeCode: "",
      firstName: "",
      middleName: "",
      lastName: "",
      employeeType: null,
    });
    setSearchQuery("");

    // Clear the employee data table
    setEmployeeData([]);
    setCurrentPage(0);
  };

  const handleClose = () => {
    // Navigate back to admin dashboard or home
    navigate("/admin/dashboard");
  };

  const handleNew = () => {
    // Clear any existing employee data from localStorage
    localStorage.removeItem("employeeId");
    localStorage.removeItem("employeeType");
    localStorage.removeItem("employeeTypeId");
    sessionStorage.removeItem("tempFormData");
    sessionStorage.removeItem("tempFrontCover");

    navigate("/AdmStaffDetails");
  };

  useEffect(() => {
    const fetchEmployeeTypes = async () => {
      try {
        const response = await fetch(
          `${ApiUrl.apiurl}Staff/EmployeeTypeList/`
        );
        const result = await response.json();

        if (response.ok && result.data) {
          // Map API response to react-select format
          const formattedOptions = result.data.map((item) => ({
            value: item.id,
            label: item.employee_type_description,
          }));
          setEmployeeTypeOptions(formattedOptions);
        } else {
          console.error("Failed to load employee types:", result);
        }
      } catch (error) {
        console.error("Error fetching employee types:", error);
      }
    };

    fetchEmployeeTypes();
  }, []);


  const fetchEmployeeData = async () => {
    try {
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");

      const params = new URLSearchParams({
        organization_id: orgId,
        branch_id: branchId,
      });

      // Optional search params
      if (searchParams.employeeCode)
        params.append("employee_code", searchParams.employeeCode);
      if (searchParams.firstName)
        params.append("first_name", searchParams.firstName);
      if (searchParams.middleName)
        params.append("middle_name", searchParams.middleName);
      if (searchParams.lastName)
        params.append("last_name", searchParams.lastName);
      if (searchParams.employeeType?.value)
        params.append("employee_type", searchParams.employeeType.value);

      const response = await fetch(
        `${ApiUrl.apiurl}STAFF/RegistrationstaffList/?${params.toString()}`
      );

      const result = await response.json();
      if (response.ok && result.data) {
        console.log("Employee Data:", result.data); // Debug log
        setEmployeeData(result.data);
      } else {
        console.error("Failed to fetch employee data:", result);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeData(); // Load all data when page opens
  }, []);


  // const handleEdit = async (employeeId) => {
  //   try {
  //     const response = await fetch(
  //       `${ApiUrl.apiurl}STAFF/registrationBasicDetailsRetreive/${employeeId}/`
  //     );
  //     const result = await response.json();

  //     if (response.ok && result.data) {
  //       setEditData(result.data); // Set response in state
  //       navigate("/AdmStaffDetails", {
  //         state: { employeeDetails: result.data },
  //       }); // Pass via location state
  //     } else {
  //       console.error("Failed to fetch employee details:", result);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching employee details:", error);
  //   }
  // };

  const handleEdit = async (employeeId) => {
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}STAFF/RegistrationBasicDetailsRetrieve/?organization_id=${localStorage.getItem("orgId")}&branch_id=${localStorage.getItem("branchId")}&employee_id=${employeeId}`
      );
      const result = await response.json();

      if (response.ok && result.data) {
        // Optional if needed
        localStorage.setItem("employeeId", result.data.id);
        localStorage.setItem("employeeType", result.data.employee_type);
        localStorage.setItem("employeeTypeId", result.data.employee_type_id); //  Save this

        //  Set response in state and navigate
        setEditData(result.data);
        navigate("/AdmStaffDetails", {
          state: { employeeDetails: result.data },
        });
      } else {
        console.error("Failed to fetch employee details:", result);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
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
                EMPLOYEE SEARCH
              </p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleNew} // Add the onClick event to trigger navigation
                  >
                    New
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={fetchEmployeeData}
                  >
                    Search
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
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mt-3  mb-3">
                      <div className="col-md-3 mb-3">
                        <label htmlFor="employee-code" className="form-label">
                          Employee Code
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="employee-code"
                            className="form-control detail"
                            placeholder="Enter employee code"
                            value={searchParams.employeeCode}
                            onChange={(e) =>
                              setSearchParams({
                                ...searchParams,
                                employeeCode: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-5 mb-3 ">
                        <label htmlFor="student-name" className="form-label">
                          Employee Name
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            className="form-control detail ms-2"
                            placeholder="Enter First name"
                            value={searchParams.firstName}
                            onChange={(e) =>
                              setSearchParams({
                                ...searchParams,
                                firstName: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            className="form-control detail ms-2"
                            placeholder="Enter Middle name"
                            value={searchParams.middleName}
                            onChange={(e) =>
                              setSearchParams({
                                ...searchParams,
                                middleName: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            className="form-control detail ms-2"
                            placeholder="Enter Last name"
                            value={searchParams.lastName}
                            onChange={(e) =>
                              setSearchParams({
                                ...searchParams,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="employee-type" className="form-label">
                          Employee Type
                        </label>
                        <Select
                          inputId="employee-type"
                          className="detail"
                          classNamePrefix="employee-type-select"
                          options={employeeTypeOptions}
                          value={searchParams.employeeType}
                          onChange={(selectedOption) =>
                            setSearchParams({
                              ...searchParams,
                              employeeType: selectedOption,
                            })
                          }
                        />
                      </div>

                      {/* Full-width Search Bar inside container */}
                      <div className="col-12 mt-4 mb-2">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control detail"
                            placeholder="Search: name, employee code, type, email, phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          {searchQuery && (
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => setSearchQuery("")}
                            >
                              X
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sr.No</th>
                          <th>Employee Code</th>
                          <th>Name</th>
                          <th>Employee Type</th>
                          <th>Date Of Birth</th>
                          <th>Mobile No</th>
                          <th>Email ID</th>
                          <th>Date Of Joining</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCurrentPageData().length > 0 ? (
                          getCurrentPageData().map((employee, index) => (
                            <tr key={employee.employee_id}>
                              <td>{currentPage * itemsPerPage + index + 1}</td>
                              <td>{employee.employee_code}</td>
                              <td>{formatEmployeeName(employee.employee_name)}</td>
                              <td>{employee.employee_type}</td>
                              <td>{employee.date_of_birth}</td>
                              <td>{employee.phone_number}</td>
                              <td>{employee.email}</td>
                              <td>{employee.date_of_joining}</td>
                              <td>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleEdit(employee.id)}
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={9} className="text-center">
                              No Data Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={
                      "pagination justify-content-center mt-3"
                    }
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    activeClassName={"active"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmAttendanceEntry;
