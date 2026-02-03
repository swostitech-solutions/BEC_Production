import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";

const SelectStaffModal = ({ isVisible, onClose, onSelectEmployee }) => {
  const navigate = useNavigate();
  const orgId = localStorage.getItem("orgId") || 1;
  const branchId = localStorage.getItem("branchId") || 1;

  const [searchParams, setSearchParams] = useState({
    employeeName: "",
    employeeCode: "",
    employeeType: "",
    department: "",
    designation: "",
  });
  const [employeeData, setEmployeeData] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch all employees when modal opens to get departments and designations
  useEffect(() => {
    if (isVisible) {
      fetchAllEmployees();
    }
  }, [isVisible]);

  const fetchAllEmployees = async () => {
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}Teacher/GetEmployeeList/?orgId=${orgId}&branchId=${branchId}`
      );
      const result = await response.json();
      if (result.message === "success" && result.data) {
        setAllEmployees(result.data);
        console.log("Fetched employee data:", result.data);
        // Extract unique departments and designations - check multiple possible field names
        const uniqueDepartments = [...new Set(result.data.map(emp => {
          return emp.departmentName || emp.department_name || emp.department || "";
        }).filter(Boolean))];
        const uniqueDesignations = [...new Set(result.data.map(emp => {
          return emp.designationName || emp.designation_name || emp.designation || "";
        }).filter(Boolean))];
        console.log("Extracted departments:", uniqueDepartments);
        console.log("Extracted designations:", uniqueDesignations);
        setDepartments(uniqueDepartments.sort());
        setDesignations(uniqueDesignations.sort());
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  // Filter departments and designations based on employee type
  useEffect(() => {
    if (!searchParams.employeeType) {
      // If no employee type selected, show all departments and designations
      const uniqueDepartments = [...new Set(allEmployees.map(emp => {
        return emp.departmentName || emp.department_name || emp.department || "";
      }).filter(Boolean))];
      const uniqueDesignations = [...new Set(allEmployees.map(emp => {
        return emp.designationName || emp.designation_name || emp.designation || "";
      }).filter(Boolean))];
      setDepartments(uniqueDepartments.sort());
      setDesignations(uniqueDesignations.sort());
    } else {
      // Filter by employee type
      const filtered = allEmployees.filter(emp => {
        const empType = emp.employee_type || emp.employeeType || emp.type || "";
        if (searchParams.employeeType === "Teacher") {
          return empType === "Teacher" || empType === "teacher" || empType === "TEACHER";
        } else if (searchParams.employeeType === "Admin") {
          return empType === "Admin" || empType === "admin" || empType === "ADMIN";
        }
        return true;
      });
      const uniqueDepartments = [...new Set(filtered.map(emp => {
        return emp.departmentName || emp.department_name || emp.department || "";
      }).filter(Boolean))];
      const uniqueDesignations = [...new Set(filtered.map(emp => {
        return emp.designationName || emp.designation_name || emp.designation || "";
      }).filter(Boolean))];
      setDepartments(uniqueDepartments.sort());
      setDesignations(uniqueDesignations.sort());
      
      // Clear department and designation if they're not in filtered list
      if (searchParams.department && !uniqueDepartments.includes(searchParams.department)) {
        setSearchParams(prev => ({ ...prev, department: "" }));
      }
      if (searchParams.designation && !uniqueDesignations.includes(searchParams.designation)) {
        setSearchParams(prev => ({ ...prev, designation: "" }));
      }
    }
  }, [searchParams.employeeType, allEmployees]);

  const handleInputChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}Teacher/GetEmployeeList/?orgId=${orgId}&branchId=${branchId}`
      );
      const result = await response.json();
      if (result.message === "success") {
        // Update allEmployees with fetched data
        const allData = result.data || [];
        setAllEmployees(allData);
        
        // Extract and set departments and designations from all fetched data
        const uniqueDepartments = [...new Set(allData.map(emp => {
          return emp.departmentName || emp.department_name || emp.department || "";
        }).filter(Boolean))];
        const uniqueDesignations = [...new Set(allData.map(emp => {
          return emp.designationName || emp.designation_name || emp.designation || "";
        }).filter(Boolean))];
        setDepartments(uniqueDepartments.sort());
        setDesignations(uniqueDesignations.sort());
        
        console.log("Search - All employee data:", allData);
        console.log("Search - Extracted departments:", uniqueDepartments);
        console.log("Search - Extracted designations:", uniqueDesignations);
        
        let filteredData = allData;
        if (searchParams.employeeName) {
          filteredData = filteredData.filter((emp) =>
            (emp.employeeName || emp.employee_name || "")
              .toLowerCase()
              .includes(searchParams.employeeName.toLowerCase())
          );
        }
        if (searchParams.employeeCode) {
          filteredData = filteredData.filter((emp) =>
            (emp.employee_code || emp.employeeCode || "")
              .toLowerCase()
              .includes(searchParams.employeeCode.toLowerCase())
          );
        }
        if (searchParams.employeeType) {
          filteredData = filteredData.filter((emp) => {
            const empType = emp.employee_type || emp.employeeType || emp.type || "";
            return empType === searchParams.employeeType || 
                   empType.toLowerCase() === searchParams.employeeType.toLowerCase();
          });
        }
        if (searchParams.department) {
          filteredData = filteredData.filter((emp) => {
            const dept = emp.departmentName || emp.department_name || emp.department || "";
            return dept === searchParams.department;
          });
        }
        if (searchParams.designation) {
          filteredData = filteredData.filter((emp) => {
            const desig = emp.designationName || emp.designation_name || emp.designation || "";
            return desig === searchParams.designation;
          });
        }
        setEmployeeData(filteredData);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
    setLoading(false);
  };

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    if (onSelectEmployee) {
      onSelectEmployee(employee);
    }
    onClose();
  };

  const handleClear = () => {
    setSearchParams({
      employeeName: "",
      employeeCode: "",
      employeeType: "",
      department: "",
      designation: "",
    });
    setEmployeeData([]);
  };

  const handleNew = () => {
    navigate("/AdmStaffDetails");
  };

  return (
    <Modal
      show={isVisible}
      onHide={onClose}
      size="xl"
      centered
      backdrop={"static"}
    >
      <Modal.Header closeButton>
        {/* <Modal.Title>Employee Search</Modal.Title> */}
      </Modal.Header>
      <Modal.Body>
        <div className="container-fluid">
          {/* <div className="row mb-3">
            <div className="col-12 d-flex justify-content-start">
              <Button className="me-2" onClick={handleNew}>New</Button>
              <Button className="me-2" onClick={handleSearch} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
              <Button className="me-2" onClick={handleClear}>Clear</Button>
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3">
              <Form.Label>Teacher Name</Form.Label>
              <Form.Control
                type="text"
                name="employeeName"
                value={searchParams.employeeName}
                onChange={handleInputChange}
                placeholder="Enter employee name"
              />
            </div>
            <div className="col-md-3">
              <Form.Label>Teacher Code</Form.Label>
              <Form.Control
                type="text"
                name="employeeCode"
                value={searchParams.employeeCode}
                onChange={handleInputChange}
                placeholder="Enter employee code"
              />
            </div>
            <div className="col-md-3">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={searchParams.department}
                onChange={handleInputChange}
                placeholder="Enter department"
              />
            </div>
            <div className="col-md-3">
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="text"
                name="designation"
                value={searchParams.designation}
                onChange={handleInputChange}
                placeholder="Enter designation"
              />
            </div>
          </div>

          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Teacher Name</th>
                  <th>Teacher Code</th>
                  <th>Department</th>
                  <th>Designation</th>
                </tr>
              </thead>
              <tbody>
                {employeeData.length > 0 ? (
                  employeeData.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.employeeName}</td>
                      <td>{employee.employee_code}</td>
                      <td>{employee.departmentName}</td>
                      <td>{employee.designationName}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No Data Found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div> */}

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
                  <div className="row mb-3">
                    <div className="col-12 d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ width: "150px" }}
                        onClick={handleSearch}
                      >
                        Search
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ width: "150px" }}
                        onClick={handleClear}
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        style={{ width: "150px" }}
                        onClick={onClose}
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  {/* Search Fields */}
                  <div className="row mt-3 p-2">
                    <div className="col-12 col-md-4 mb-3">
                      <label htmlFor="employee-name" className="form-label mb-1">
                        Teacher Name
                      </label>
                      <input
                        type="text"
                        id="employee-name"
                        className="form-control"
                        name="employeeName"
                        value={searchParams.employeeName}
                        onChange={handleInputChange}
                        placeholder="Enter teacher name"
                        style={{ height: "38px" }}
                      />
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                      <label htmlFor="employee-code" className="form-label mb-1">
                        Teacher Code
                      </label>
                      <input
                        type="text"
                        id="employee-code"
                        className="form-control"
                        name="employeeCode"
                        value={searchParams.employeeCode}
                        onChange={handleInputChange}
                        placeholder="Enter teacher code"
                        style={{ height: "38px" }}
                      />
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                      <label htmlFor="employee-type" className="form-label mb-1">
                        Employee Type
                      </label>
                      <select
                        id="employee-type"
                        className="form-select"
                        name="employeeType"
                        value={searchParams.employeeType}
                        onChange={handleInputChange}
                        style={{ height: "38px" }}
                      >
                        <option value="">All Types</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="row p-2">
                    <div className="col-12 col-md-6 mb-3">
                      <label htmlFor="department" className="form-label mb-1">
                        Department
                      </label>
                      <select
                        id="department"
                        className="form-select"
                        name="department"
                        value={searchParams.department}
                        onChange={handleInputChange}
                        style={{ height: "38px" }}
                      >
                        <option value="">All Departments</option>
                        {departments.map((dept, index) => (
                          <option key={index} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                      <label htmlFor="designation" className="form-label mb-1">
                        Designation
                      </label>
                      <select
                        id="designation"
                        className="form-select"
                        name="designation"
                        value={searchParams.designation}
                        onChange={handleInputChange}
                        style={{ height: "38px" }}
                      >
                        <option value="">All Designations</option>
                        {designations.map((desig, index) => (
                          <option key={index} value={desig}>
                            {desig}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Students Table */}
                  <div className="row">
                    <div className="col-12">
                      <div className="table-responsive">
                        <table className="table table-bordered ">
                          <thead>
                            <tr>
                              {/* <th>Sr.No</th> */}
                              <th>Teacher Name</th>
                              <th>Teacher Code</th>
                              <th>Department</th>
                              <th>Designation</th>
                              <th>Select</th>
                            </tr>
                          </thead>
                          <tbody>
                            {employeeData.length > 0 ? (
                              employeeData.map((employee, index) => (
                                <tr key={employee.id}>
                                  <td>{employee.employeeName || employee.employee_name || ""}</td>
                                  <td>{employee.employee_code || employee.employeeCode || ""}</td>
                                  <td>{employee.departmentName || employee.department_name || employee.department || ""}</td>
                                  <td>{employee.designationName || employee.designation_name || employee.designation || ""}</td>
                                  <td>
                                    <input
                                      type="radio"
                                      name="selectedEmployee"
                                      // checked={selectedStudent === student}
                                      onChange={() =>
                                        handleSelectEmployee(employee)
                                      }
                                    />
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center">
                                  No Data Found
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
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SelectStaffModal;
