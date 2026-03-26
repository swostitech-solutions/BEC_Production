import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";

const toNumber = (value) => Number(value || 0);
const getDiscountAmount = (item) => Math.abs(toNumber(item.discount_fees));
const getActualPaidAmount = (item) => toNumber(item.total_paid) - getDiscountAmount(item);
const getRemainingAmount = (item) => toNumber(item.total_fees) - toNumber(item.total_paid);

function AdmFeeReport() {
  const navigate = useNavigate();

  // Filter States
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  // Options States
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [sections, setSections] = useState([]);

  // Data States
  const [reportData, setReportData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  // Initialization: Fetch Sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const branch_id = sessionStorage.getItem("branch_id");
        const organization_id = sessionStorage.getItem("organization_id");

        if (!branch_id || !organization_id) return;

        const response = await fetch(
          `${ApiUrl.apiurl}Batch/GetBatch/?organization_id=${organization_id}&branch_id=${branch_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (Array.isArray(data)) {
          setSessions(data.map((item) => ({ value: item.id, label: item.batch_description })));
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };
    fetchSessions();
  }, []);

  // Fetch Courses based on Session
  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedSession?.value) {
        setCourses([]);
        return;
      }
      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const response = await fetch(
          `${ApiUrl.apiurl}Course/GetCourse/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${selectedSession.value}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setCourses(data.map((item) => ({ value: item.id, label: item.course_name })));
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [selectedSession]);

  // Fetch Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!selectedSession?.value || !selectedCourse?.value) {
        setDepartments([]);
        return;
      }
      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const response = await fetch(
          `${ApiUrl.apiurl}Department/GetDepartment/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${selectedSession.value}&course_id=${selectedCourse.value}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        const deps = Array.isArray(data) ? data : data.data || [];
        setDepartments(deps.map((item) => ({
          value: item.id || item.department_id,
          label: item.department_description || item.department_name || item.description || "Unnamed",
        })));
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, [selectedSession, selectedCourse]);

  // Fetch Academic Years
  useEffect(() => {
    const fetchAcademicYears = async () => {
      if (!selectedSession || !selectedCourse || !selectedDepartment) {
        setAcademicYears([]);
        return;
      }
      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const url = `${ApiUrl.apiurl}AcademicYear/GetAcademicYear/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${selectedSession.value}&course_id=${selectedCourse.value}&department_id=${selectedDepartment.value}`;
        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json();
        const years = Array.isArray(data) ? data : data.data || [];
        setAcademicYears(years.map((item) => ({
          value: item.id || item.academic_year_id,
          label: item.academic_year_description || item.academic_year_code,
        })));
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchAcademicYears();
  }, [selectedSession, selectedCourse, selectedDepartment]);

  // Fetch Semesters
  useEffect(() => {
    const fetchSemesters = async () => {
      if (!selectedSession || !selectedCourse || !selectedDepartment) {
        setSemesters([]);
        return;
      }
      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const url = `${ApiUrl.apiurl}Semester/GetSemesterByDepartment/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${selectedSession.value}&course_id=${selectedCourse.value}&department_id=${selectedDepartment.value}`;
        
        let urlWithAca = url;
        if (selectedAcademicYear) {
          urlWithAca += `&academic_year_id=${selectedAcademicYear.value}`;
        }
        
        const response = await fetch(urlWithAca, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json();
        setSemesters((Array.isArray(data) ? data : []).map((item) => ({
          value: item.id,
          label: item.semester_description || item.semester_code,
        })));
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchSemesters();
  }, [selectedSession, selectedCourse, selectedDepartment, selectedAcademicYear]);

  // Fetch Sections
  useEffect(() => {
    const fetchSections = async () => {
      if (!selectedSession || !selectedCourse || !selectedDepartment || !selectedAcademicYear || !selectedSemester) {
        setSections([]);
        return;
      }
      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const url = `${ApiUrl.apiurl}Section/GetSection/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${selectedSession.value}&course_id=${selectedCourse.value}&department_id=${selectedDepartment.value}&academic_year_id=${selectedAcademicYear.value}&semester_id=${selectedSemester.value}`;
        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json();
        const secs = Array.isArray(data) ? data : data.data || [];
        setSections(secs.map((item) => ({
          value: item.id || item.section_id,
          label: item.section_name || item.section_description,
        })));
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchSections();
  }, [selectedSession, selectedCourse, selectedDepartment, selectedAcademicYear, selectedSemester]);

  const handleSearch = async () => {
    const organization_id = sessionStorage.getItem("organization_id");
    const branch_id = sessionStorage.getItem("branch_id");

    const params = new URLSearchParams({
      organization_id,
      branch_id,
    });

    if (selectedSession) params.append("batch_id", selectedSession.value);
    if (selectedCourse) params.append("course_id", selectedCourse.value);
    if (selectedDepartment) params.append("department_id", selectedDepartment.value);
    if (selectedAcademicYear) params.append("academic_year_id", selectedAcademicYear.value);
    if (selectedSemester) params.append("semester_id", selectedSemester.value);
    if (selectedSection) params.append("section_id", selectedSection.value);
    params.append("show_fees", "A");

    // Using the same endpoint as AdmFeeLedger for simplified table view
    const apiUrl = `${ApiUrl.apiurl}FeeLedger/GetFeeLedgerBasedOnCondition/?${params.toString()}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.message === "success!!") {
        setReportData(result.data);
        setShowTable(true);
        setCurrentPage(0);
      } else {
        setReportData([]);
        setShowTable(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setReportData([]);
      setShowTable(false);
    }
  };

  const handleClear = () => {
    setSelectedSession(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
    setShowTable(false);
    setReportData([]);
    setCurrentPage(0);
  };

  const dynamicHeaders = useMemo(() => {
    const headersMap = {};
    
    reportData.forEach((student) => {
      if (student.semester_wise_details) {
        Object.keys(student.semester_wise_details).forEach((sem) => {
          if (!headersMap[sem]) headersMap[sem] = new Set();
          Object.keys(student.semester_wise_details[sem]).forEach((elem) => {
            if (elem !== "DISCOUNT") {
              headersMap[sem].add(elem);
            }
          });
        });
      }
    });

    const headers = [];
    const sems = Object.keys(headersMap).sort();
    
    sems.forEach((sem) => {
      const elems = Array.from(headersMap[sem]).sort();
      elems.forEach((elem) => {
        headers.push({ sem, elem }); 
      });
    });

    return headers;
  }, [reportData]);

  const exportToExcel = () => {
    if (reportData.length > 0) {
      const exportRows = reportData.map((item, index) => {
        const row = {
          "Sl No": index + 1,
          "Student Name": item.student_name || "",
          "Session": item.batch_name || "",
          "Course": item.course_name || "",
          "Section": item.section_name || "",
          "Father Name": item.fatherName || "",
          "Mother Name": item.motherName || "",
        };

        dynamicHeaders.forEach(({sem, elem}) => {
          const detail = item.semester_wise_details?.[sem]?.[elem];
          row[`${sem} - ${elem} (Amount)`] = detail ? detail.amount : 0;
          row[`${sem} - ${elem} (Paid)`] = detail ? detail.paid : 0;
          row[`${sem} - ${elem} (Balance)`] = detail ? detail.balance : 0;
        });

        row["Total Fees"] = item.total_fees || 0;
        row["Fees Paid"] = getActualPaidAmount(item);
        row["Discount"] = item.discount_fees || 0;
        row["Remarks"] = item.remarks || "-";
        row["Balance"] = getRemainingAmount(item);

        return row;
      });

      const ws = XLSX.utils.json_to_sheet(exportRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "FeeReports");
      XLSX.writeFile(wb, "Fee_Report_Data.xlsx");
    } else {
      alert("No data available to export!");
    }
  };

  const handlePageClick = (data) => setCurrentPage(data.selected);
  const offset = currentPage * itemsPerPage;
  const currentItems = reportData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(reportData.length / itemsPerPage);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <p style={{ marginBottom: "0px", textAlign: "center", fontSize: "20px", fontWeight: "700" }}>
                FEE REPORT
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button type="button" className="btn btn-primary" style={{ width: "150px" }} onClick={handleSearch}>
                    Search
                  </button>
                  <button type="button" className="btn btn-secondary" style={{ width: "150px" }} onClick={handleClear}>
                    Clear
                  </button>
                  <button type="button" className="btn btn-danger" style={{ width: "150px" }} onClick={() => navigate("/admin/dashboard")}>
                    Close
                  </button>
                  <button type="button" className="btn btn-success" style={{ width: "150px" }} onClick={exportToExcel}>
                    Export to Excel
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="row flex-grow-1">
                    
                    <div className="col-12 col-md-4 mb-3">
                      <label className="form-label">Session</label>
                      <Select
                        className="react-select detail"
                        classNamePrefix="react-select"
                        options={sessions}
                        value={selectedSession}
                        onChange={(opt) => {
                          setSelectedSession(opt);
                          setSelectedCourse(null);
                          setSelectedDepartment(null);
                          setSelectedAcademicYear(null);
                          setSelectedSemester(null);
                          setSelectedSection(null);
                        }}
                        placeholder="Select Session"
                        isClearable
                      />
                    </div>

                    <div className="col-12 col-md-4 mb-3">
                      <label className="form-label">Course</label>
                      <Select
                        className="react-select detail"
                        classNamePrefix="react-select"
                        options={courses}
                        value={selectedCourse}
                        onChange={(opt) => {
                          setSelectedCourse(opt);
                          setSelectedDepartment(null);
                          setSelectedAcademicYear(null);
                          setSelectedSemester(null);
                          setSelectedSection(null);
                        }}
                        placeholder="Select Course"
                        isClearable
                        isDisabled={!selectedSession}
                      />
                    </div>

                    <div className="col-12 col-md-4 mb-3">
                      <label className="form-label">Department</label>
                      <Select
                        className="react-select detail"
                        classNamePrefix="react-select"
                        options={departments}
                        value={selectedDepartment}
                        onChange={(opt) => {
                          setSelectedDepartment(opt);
                          setSelectedAcademicYear(null);
                          setSelectedSemester(null);
                          setSelectedSection(null);
                        }}
                        placeholder="Select Department"
                        isClearable
                        isDisabled={!selectedCourse}
                      />
                    </div>

                    {/* 
                    <div className="col-12 col-md-4 mb-3">
                      <label className="form-label">Academic Year</label>
                      <Select
                        className="react-select detail"
                        classNamePrefix="react-select"
                        options={academicYears}
                        value={selectedAcademicYear}
                        onChange={(opt) => {
                          setSelectedAcademicYear(opt);
                          setSelectedSemester(null);
                          setSelectedSection(null);
                        }}
                        placeholder="Select Academic Year"
                        isClearable
                        isDisabled={!selectedDepartment}
                      />
                    </div>

                    <div className="col-12 col-md-4 mb-3">
                      <label className="form-label">Semester</label>
                      <Select
                        className="react-select detail"
                        classNamePrefix="react-select"
                        options={semesters}
                        value={selectedSemester}
                        onChange={(opt) => {
                          setSelectedSemester(opt);
                          setSelectedSection(null);
                        }}
                        placeholder="Select Semester"
                        isClearable
                        isDisabled={!selectedAcademicYear}
                      />
                    </div>

                    <div className="col-12 col-md-4 mb-3">
                      <label className="form-label">Section</label>
                      <Select
                        className="react-select detail"
                        classNamePrefix="react-select"
                        options={sections}
                        value={selectedSection}
                        onChange={setSelectedSection}
                        placeholder="Select Section"
                        isClearable
                        isDisabled={!selectedSemester}
                      />
                    </div> 
                    */}

                  </div>
                </div>
              </div>

              {showTable && (
                <div className="fee-details-table mt-4 mx-2">
                  {reportData.length > 0 ? (
                    currentItems.map((item, index) => {
                      const studentHeaders = [];
                      if (item.semester_wise_details) {
                        Object.keys(item.semester_wise_details).sort().forEach(sem => {
                          Object.keys(item.semester_wise_details[sem]).sort().forEach(elem => {
                            if (elem !== "DISCOUNT") {
                              studentHeaders.push({ sem, elem });
                            }
                          });
                        });
                      }

                      return (
                        <div key={index} className="card mt-3 mb-4 shadow-sm" style={{ border: "2px solid #ddd" }}>
                          <div className="card-header bg-light text-dark d-flex flex-wrap justify-content-between align-items-center">
                            <div>
                              <strong style={{ fontSize: "1.5rem" }}>{offset + index + 1}. {item.student_name || "-"}</strong> 
                              <span className="ms-3 badge bg-primary" style={{ fontSize: "1.2rem", padding: "6px 10px" }}>{item.batch_name || "-"}</span>
                              <span className="ms-2 badge bg-primary" style={{ fontSize: "1.2rem", padding: "6px 10px" }}>{item.course_name || "-"}</span>
                              <span className="ms-2 badge bg-primary" style={{ fontSize: "1.2rem", padding: "6px 10px" }}>{item.department_description || "-"}</span>
                            </div>
                            <div>
                              <span style={{ fontSize: "1.1rem" }}><strong>Father:</strong> {item.fatherName || "-"} | <strong>Mother:</strong> {item.motherName || "-"}</span>
                            </div>
                          </div>
                          
                          <div className="card-body p-0 table-responsive rounded">
                            <table className="table table-bordered mb-0 align-middle text-center m-0">
                              <thead className="table-light">
                                <tr>
                                  {studentHeaders.map((header, idx) => (
                                    <th key={`h-${idx}`} colSpan="3" className="border-bottom">
                                      {header.sem} <br/> <small>{header.elem}</small>
                                    </th>
                                  ))}
                                  {studentHeaders.length === 0 && (
                                    <th rowSpan="2" className="border-bottom align-middle py-3">Fee Breakdowns</th>
                                  )}
                                  <th rowSpan="2" className="align-middle" style={{ width: "100px" }}>Total Fees</th>
                                  <th rowSpan="2" className="align-middle" style={{ width: "100px" }}>Fees Paid</th>
                                  <th rowSpan="2" className="align-middle" style={{ width: "100px" }}>Discount</th>
                                  <th rowSpan="2" className="align-middle" style={{ minWidth: "180px" }}>Remarks</th>
                                  <th rowSpan="2" className="align-middle" style={{ width: "100px" }}>Balance</th>
                                </tr>
                                {studentHeaders.length > 0 && (
                                  <tr>
                                    {studentHeaders.map((_, idx) => (
                                      <React.Fragment key={`sub-${idx}`}>
                                        <th style={{ minWidth: "80px", color: "inherit", backgroundColor: "transparent" }}>Total</th>
                                        <th style={{ minWidth: "80px", color: "inherit", backgroundColor: "transparent" }}>Paid</th>
                                        <th style={{ minWidth: "80px", color: "inherit", backgroundColor: "transparent" }}>Bal</th>
                                      </React.Fragment>
                                    ))}
                                  </tr>
                                )}
                              </thead>
                              <tbody>
                                <tr>
                                  {studentHeaders.map((header, idx) => {
                                    const detail = item.semester_wise_details?.[header.sem]?.[header.elem];
                                    return (
                                      <React.Fragment key={`data-${idx}`}>
                                        <td>{detail ? detail.amount : "-"}</td>
                                        <td>{detail ? detail.paid : "-"}</td>
                                        <td>{detail ? detail.balance : "-"}</td>
                                      </React.Fragment>
                                    );
                                  })}
                                  {studentHeaders.length === 0 && (
                                    <td className="text-muted border-end-0">No specific fees applied</td>
                                  )}
                                  <td className="fw-bold">{item.total_fees || 0}</td>
                                  <td className="fw-bold text-success">{getActualPaidAmount(item)}</td>
                                  <td className="fw-bold text-info">{item.discount_fees || 0}</td>
                                  <td>{item.remarks || "-"}</td>
                                  <td className="fw-bold text-danger">{getRemainingAmount(item)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="alert alert-warning text-center mt-3">
                      No fee records found.
                    </div>
                  )}
                  {reportData.length > 0 && (
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
                      containerClassName={"pagination justify-content-center mt-3"}
                      pageClassName={"page-item"}
                      pageLinkClassName={"page-link"}
                      previousClassName={"page-item"}
                      previousLinkClassName={"page-link"}
                      nextClassName={"page-item"}
                      nextLinkClassName={"page-link"}
                      activeClassName={"active"}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdmFeeReport;
