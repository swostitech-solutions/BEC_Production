// import React, { useRef, useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// import { useNavigate } from "react-router-dom";

// import Select from "react-select";
// import { ApiUrl } from "../../../ApiUrl";
// import ReactPaginate from "react-paginate";

// const AdmAttendanceEntry = () => {

//   const navigate = useNavigate();
//   const [tableData, setTableData] = useState([]);
//   const [filters, setFilters] = useState({
//     fromDate: "",
//     toDate: "",
//     module: "",
//     companyName: "",
//   });

//   const [currentPage, setCurrentPage] = useState(0);
//   const itemsPerPage = 10;

//   const offset = currentPage * itemsPerPage;
//   const currentItems = tableData.slice(offset, offset + itemsPerPage);
//   const pageCount = Math.ceil(tableData.length / itemsPerPage);

//   const handlePageClick = (event) => {
//     setCurrentPage(event.selected);
//   };

//   const fromClassRef = useRef(null);
//   const admissionNoRef = useRef(null);
//   const barcodeRef = useRef(null);
//   const smsToRef = useRef(null);

//   const handleClear = () => {
//     setFilters({
//       fromDate: "",
//       toDate: "",
//       module: "",
//       companyName: "",
//     });

//     setTableData([]);

//     if (fromClassRef.current) fromClassRef.current.value = "";
//     if (admissionNoRef.current) admissionNoRef.current.value = "";
//     if (barcodeRef.current) barcodeRef.current.value = "";
//     if (smsToRef.current) smsToRef.current.checked = false;
//   };

//   // Retrieve mandatory fields from localStorage
//   const academicSessionId = localStorage.getItem("academicSessionId") || "1";
//   const orgId = localStorage.getItem("orgId") || "1";
//   const branchId = localStorage.getItem("branchId") || "1";

//   // Function to fetch data
//   const fetchData = async (queryParams = {}) => {
//     try {
//       const searchParams = new URLSearchParams({
//         academic_year_id: academicSessionId,
//         organization_id: orgId,
//         branch_id: branchId,
//         ...queryParams,
//       });

//       const response = await fetch(
//         `${ApiUrl.apiurl}TrainingPlacement/List/?${searchParams}`
//       );

//       if (response.ok) {
//         const data = await response.json();
//         if (data.message === "success") {
//           setTableData(data.data);
//         } else {
//           setTableData([]);
//           alert("No data found!");
//         }
//       } else {
//         alert("Error fetching data. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       alert("Something went wrong. Please check your internet connection.");
//     }
//   };

//   // Fetch data on page load
//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Handle search button click
//   const handleSearch = () => {
//     const queryParams = {
//       ...(filters.fromDate && { from_date: filters.fromDate }),
//       ...(filters.toDate && { to_date: filters.toDate }),
//       ...(filters.module && { module: filters.module }),
//       ...(filters.companyName && { companyname: filters.companyName }),
//     };
//     fetchData(queryParams);
//   };
//   const handleInputChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this record?")) {
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${ApiUrl.apiurl}TrainingPlacement/Delete/?id=${id}`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (response.ok) {
//         setTableData((prevData) => prevData.filter((item) => item.id !== id));
//         alert("Record deleted successfully.");
//       } else {
//         alert("Failed to delete record.");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("Something went wrong. Please try again.");
//     }
//   };

//   const handleEdit = async (id) => {
//     try {
//       const response = await fetch(
//         `${ApiUrl.apiurl}TrainingPlacement/Retrieve/?id=${id}`
//       );

//       if (response.ok) {
//         const data = await response.json();
//         if (data.message === "success") {
//           console.log("Fetched Data:", data.data);

//           // Navigate to /admin/placement and pass data as state
//           navigate("/admin/placement", { state: { placementData: data.data } });
//         } else {
//           alert("No data found!");
//         }
//       } else {
//         alert("Error fetching data. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       alert("Something went wrong. Please check your internet connection.");
//     }
//   };

//   const handleNewClick = () => {
//     navigate("/admin/placement");
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
//                 STUDENT PLACEMENTS/WORKSHOPS/SEMINARS
//               </p>

//               <div className="row mb-3 mt-3 mx-0">
//                 <div className="col-12">
//                   <button
//                     type="button"
//                     className="btn btn-primary me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                     onClick={handleNewClick}
//                   >
//                     New
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-primary me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                     onClick={handleSearch}
//                   >
//                     Search
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-secondary me-2"
//                     onClick={handleClear}
//                     style={{
//                       width: "150px",
//                     }}
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
//                 </div>
//               </div>

//               <div className="row mt-3 mx-2">
//                 <div className="col-12 custom-section-box">
//                   <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
//                     <div className="row flex-grow-1 mb-3 mt-3 ">
//                       <div className="col-12 col-md-3 mb-3">
//                         <label htmlFor="student-name" className="form-label">
//                           Company / Organization Name
//                         </label>
//                         <div className="d-flex align-items-center">
//                           <input
//                             type="text"
//                             name="companyName"
//                             className="form-control detail"
//                             value={filters.companyName}
//                             onChange={handleInputChange}
//                           />
//                         </div>
//                       </div>

//                       <div className="col-md-3 mb-3">
//                         <label style={{ fontWeight: "700" }}>
//                           Training Module
//                         </label>
//                         <input
//                           type="text"
//                           name="module"
//                           className="form-control detail"
//                           value={filters.module}
//                           onChange={handleInputChange}
//                         />
//                       </div>

//                       <div className="col-md-3 mb-3">
//                         <label style={{ fontWeight: "700" }}>From Date</label>
//                         <input
//                           type="date"
//                           name="fromDate"
//                           className="form-control detail"
//                           value={filters.fromDate}
//                           onChange={handleInputChange}
//                         />
//                       </div>

//                       <div className="col-md-3 mb-3">
//                         <label style={{ fontWeight: "700" }}>To Date</label>
//                         <input
//                           type="date"
//                           name="toDate"
//                           className="form-control detail"
//                           value={filters.toDate}
//                           onChange={handleInputChange}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="col-12">
//                 <div className="table-responsive">
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         <th>Sr.No</th>
//                         <th>Company/ Organization Name</th>
//                         <th>Training Module</th>
//                         <th>Duration</th>
//                         <th>From Date</th>
//                         <th>To Date</th>
//                         <th>HR Name</th>
//                         <th>Edit</th>
//                         <th>Delete</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {currentItems.length > 0 ? (
//                         currentItems.map((item, index) => (
//                           <tr key={item.id}>
//                             <td>{offset + index + 1}</td>
//                             <td>{item.company_name}</td>
//                             <td>{item.module}</td>
//                             <td>{item.duration}</td>
//                             <td>{item.from_date}</td>
//                             <td>{item.to_date}</td>
//                             <td>{item.hr_name}</td>
//                             <td>
//                               <a
//                                 href="#"
//                                 onClick={(e) => {
//                                   e.preventDefault();
//                                   handleEdit(item.id);
//                                 }}
//                               >
//                                 Edit
//                               </a>
//                             </td>
//                             <td>
//                               <a href="#" onClick={() => handleDelete(item.id)}>
//                                 Delete
//                               </a>
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan="12" className="text-center">
//                             No data available
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>

//                 {pageCount > 1 && (
//                   <div className="d-flex justify-content-center mt-3">
//                     <ReactPaginate
//                       previousLabel={"Previous"}
//                       nextLabel={"Next"}
//                       breakLabel={"..."}
//                       breakClassName={"page-item"}
//                       breakLinkClassName={"page-link"}
//                       pageCount={pageCount}
//                       marginPagesDisplayed={2}
//                       pageRangeDisplayed={5}
//                       onPageChange={handlePageClick}
//                       containerClassName={"pagination justify-content-center"}
//                       pageClassName={"page-item"}
//                       pageLinkClassName={"page-link"}
//                       previousClassName={"page-item"}
//                       previousLinkClassName={"page-link"}
//                       nextClassName={"page-item"}
//                       nextLinkClassName={"page-link"}
//                       activeClassName={"active"}
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdmAttendanceEntry;





import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { useNavigate } from "react-router-dom";

import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import ReactPaginate from "react-paginate";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch"; // For Department
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";

const AdmAttendanceEntry = () => {
  const navigate = useNavigate();

  // Retrieve mandatory fields from sessionStorage FIRST
  const orgId = sessionStorage.getItem("organization_id") || "1";
  const branchId = sessionStorage.getItem("branch_id") || "1";

  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState({
    companyName: "",
    module: "",
    fromDate: "",
    toDate: "",
    batchId: "",
    courseId: "",
    departmentId: "",
    academicYearId: "",
    semesterId: "",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const { BatchList, loading: batchesLoading } = useFetchSessionList(orgId, branchId);

  // Course hook (depends on batchId)
  const { CourseList, loading: coursesLoading } = useFetchCourseByFilter(
    orgId,
    filters.batchId
  );

  // Department hook (depends on batchId, courseId)
  const { BranchList: DepartmentList, loading: departmentsLoading } = useFetchBranch(
    orgId,
    branchId,
    filters.batchId,
    filters.courseId
  );

  // Academic Year hook (depends on batchId, courseId, departmentId)
  const { AcademicYearList, loading: academicYearsLoading } = useFetchAcademicYearByFilter(
    orgId,
    branchId,
    filters.batchId,
    filters.courseId,
    filters.departmentId
  );

  // Semester hook (depends on batchId, courseId, departmentId, academicYearId)
  const { SemesterList, loading: semestersLoading } = useFetchSemesterByFilter(
    orgId,
    branchId,
    filters.batchId,
    filters.courseId,
    filters.departmentId,
    filters.academicYearId
  );

  const offset = currentPage * itemsPerPage;
  const currentItems = tableData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(tableData.length / itemsPerPage);
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const fromClassRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);

  const handleClear = () => {
    setFilters({
      fromDate: "",
      toDate: "",
      module: "",
      companyName: "",
      batchId: "",
      courseId: "",
      departmentId: "",
      academicYearId: "",
      semesterId: "",
    });

    setTableData([]);

    if (fromClassRef.current) fromClassRef.current.value = "";
    if (admissionNoRef.current) admissionNoRef.current.value = "";
    if (barcodeRef.current) barcodeRef.current.value = "";
    if (smsToRef.current) smsToRef.current.checked = false;
  };

  // Function to fetch data
  const fetchData = async (queryParams = {}, resetPage = false) => {
    try {
      const searchParams = new URLSearchParams({
        organization_id: orgId,
        branch_id: branchId,
        ...queryParams,
      });

      const token = localStorage.getItem("accessToken");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${ApiUrl.apiurl}TrainingPlacement/List/?${searchParams}`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);

        if (data.message === "success") {
          setTableData(data.data);
          if (resetPage) setCurrentPage(0);
        } else {
          setTableData([]);
          // alert("No data found!"); // Removed alert as per user request
        }
      } else {
        if (response.status === 404) {
          setTableData([]);
        } else {
          // const errorData = await response.json();
          console.error("Error response status:", response.status);
          alert("Please check your internet connection.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please check your internet connection.");
    }
  };



  // Fetch data on page load
  useEffect(() => {
    fetchData();
  }, []);

  // Handle search button click
  const handleSearch = () => {
    const queryParams = {
      ...(filters.fromDate && { from_date: filters.fromDate }),
      ...(filters.toDate && { to_date: filters.toDate }),
      ...(filters.module && { module: filters.module }),
      ...(filters.companyName && { company_name: filters.companyName }),
      ...(filters.batchId && { batch_id: filters.batchId }),
      ...(filters.courseId && { course_id: filters.courseId }),
      ...(filters.departmentId && { department_id: filters.departmentId }),
      ...(filters.academicYearId && { academic_year_id: filters.academicYearId }),
      ...(filters.semesterId && { semester_id: filters.semesterId }),
    };
    fetchData(queryParams, true);
  };




  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${ApiUrl.apiurl}TrainingPlacement/Delete/?id=${id}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (response.ok) {
        setTableData((prevData) => prevData.filter((item) => item.id !== id));
        alert("Record deleted successfully.");
      } else {
        alert("Failed to delete record.");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleEdit = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${ApiUrl.apiurl}TrainingPlacement/Retrieve/?id=${id}`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.message === "success") {
          console.log("Fetched Data:", data.data);

          // Navigate to /admin/placement and pass data as state
          navigate("/admin/placement", { state: { placementData: data.data } });
        } else {
          alert("No data found!");
        }
      } else {
        alert("Error fetching data. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Something went wrong. Please check your internet connection.");
    }
  };

  const handleNewClick = () => {
    navigate("/admin/placement");
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
                STUDENT PLACEMENTS/WORKSHOPS/SEMINARS
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleNewClick}
                  >
                    New
                  </button>
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
                    className="btn btn-secondary me-2"
                    onClick={handleClear}
                    style={{
                      width: "150px",
                    }}
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
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mb-3 mt-3 ">
                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="student-name" className="form-label">
                          Company / Organization Name
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            name="companyName"
                            className="form-control detail"
                            value={filters.companyName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="col-md-3 mb-3">
                        <label style={{ fontWeight: "700" }}>
                          Training Module
                        </label>
                        <input
                          type="text"
                          name="module"
                          className="form-control detail"
                          value={filters.module}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <label style={{ fontWeight: "700" }}>From Date</label>
                        <input
                          type="date"
                          name="fromDate"
                          className="form-control detail"
                          value={filters.fromDate}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <label style={{ fontWeight: "700" }}>To Date</label>
                        <input
                          type="date"
                          name="toDate"
                          className="form-control detail"
                          value={filters.toDate}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <label style={{ fontWeight: "700" }}>Session</label>

                        <Select
                          className="detail"
                          options={
                            BatchList?.map((batch) => ({
                              value: batch.id,
                              label: batch.batch_description,
                            })) || []
                          }
                          value={
                            BatchList?.find(
                              (b) => b.id === Number(filters.batchId)
                            )
                              ? {
                                value: filters.batchId,
                                label: BatchList.find(
                                  (b) => b.id === Number(filters.batchId)
                                )?.batch_description,
                              }
                              : null
                          }
                          onChange={(opt) =>
                            setFilters((prev) => ({
                              ...prev,
                              batchId: opt?.value || "",
                              courseId: "",
                              departmentId: "",
                              academicYearId: "",
                              semesterId: "",
                            }))
                          }
                          placeholder="Select Session"
                        />
                      </div>

                      {/* Course Dropdown */}
                      <div className="col-md-3 mb-3">
                        <label style={{ fontWeight: "700" }}>Course</label>
                        <Select
                          className="detail"
                          options={
                            CourseList?.map((course) => ({
                              value: course.id,
                              label: course.course_name,
                            })) || []
                          }
                          value={
                            CourseList?.find(
                              (c) => c.id === Number(filters.courseId)
                            )
                              ? {
                                value: filters.courseId,
                                label: CourseList.find(
                                  (c) => c.id === Number(filters.courseId)
                                )?.course_name,
                              }
                              : null
                          }
                          onChange={(opt) =>
                            setFilters((prev) => ({
                              ...prev,
                              courseId: opt?.value || "",
                              departmentId: "",
                              academicYearId: "",
                              semesterId: "",
                            }))
                          }
                          placeholder="Select Course"
                          isDisabled={!filters.batchId}
                        />
                      </div>

                      {/* Department Dropdown */}
                      <div className="col-md-3 mb-3">
                        <label style={{ fontWeight: "700" }}>Department</label>
                        <Select
                          className="detail"
                          options={
                            DepartmentList?.map((dept) => ({
                              value: dept.id,
                              label: dept.department_description,
                            })) || []
                          }
                          value={
                            DepartmentList?.find(
                              (d) => d.id === Number(filters.departmentId)
                            )
                              ? {
                                value: filters.departmentId,
                                label: DepartmentList.find(
                                  (d) => d.id === Number(filters.departmentId)
                                )?.department_description,
                              }
                              : null
                          }
                          onChange={(opt) =>
                            setFilters((prev) => ({
                              ...prev,
                              departmentId: opt?.value || "",
                              academicYearId: "",
                              semesterId: "",
                            }))
                          }
                          placeholder="Select Department"
                          isDisabled={!filters.courseId}
                        />
                      </div>

                      {/* Academic Year Dropdown */}
                      <div className="col-md-3 mb-3">
                        <label style={{ fontWeight: "700" }}>
                          Academic Year
                        </label>
                        <Select
                          className="detail"
                          options={
                            AcademicYearList?.map((year) => ({
                              value: year.id,
                              label: year.academic_year_description,
                            })) || []
                          }
                          value={
                            AcademicYearList?.find(
                              (y) => y.id === Number(filters.academicYearId)
                            )
                              ? {
                                value: filters.academicYearId,
                                label: AcademicYearList.find(
                                  (y) =>
                                    y.id === Number(filters.academicYearId)
                                )?.academic_year_description,
                              }
                              : null
                          }
                          onChange={(opt) =>
                            setFilters((prev) => ({
                              ...prev,
                              academicYearId: opt?.value || "",
                              semesterId: "",
                            }))
                          }
                          placeholder="Select Academic Year"
                          isDisabled={!filters.departmentId}
                        />
                      </div>

                      {/* Semester Dropdown */}
                      <div className="col-md-3 mb-3">
                        <label style={{ fontWeight: "700" }}>Semester</label>
                        <Select
                          className="detail"
                          options={
                            SemesterList?.map((sem) => ({
                              value: sem.id,
                              label: sem.semester_description,
                            })) || []
                          }
                          value={
                            SemesterList?.find(
                              (s) => s.id === Number(filters.semesterId)
                            )
                              ? {
                                value: filters.semesterId,
                                label: SemesterList.find(
                                  (s) => s.id === Number(filters.semesterId)
                                )?.semester_description,
                              }
                              : null
                          }
                          onChange={(opt) =>
                            setFilters((prev) => ({
                              ...prev,
                              semesterId: opt?.value || "",
                            }))
                          }
                          placeholder="Select Semester"
                          isDisabled={!filters.academicYearId}
                        />
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
                        <th>Sr.No</th>
                        <th>Company/ Organization Name</th>
                        <th>Training Module</th>
                        <th>Duration</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Course</th>
                        <th>Department</th>
                        <th>Academic Year</th>
                        <th>Semester</th>
                        <th>Trainer Name</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                          <tr key={item.id}>
                            <td>{offset + index + 1}</td>
                            <td>{item.company_name}</td>
                            <td>{item.module}</td>
                            <td>{item.duration}</td>
                            <td>{item.from_date}</td>
                            <td>{item.to_date}</td>
                            <td>{item.course_name || "N/A"}</td>
                            <td>{item.department_name || "N/A"}</td>
                            <td>{item.academic_year_description || "N/A"}</td>
                            <td>{item.semester_name || "N/A"}</td>
                            <td>{item.hr_name}</td>
                            <td>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleEdit(item.id);
                                }}
                              >
                                Edit
                              </a>
                            </td>
                            <td>
                              <a href="#" onClick={() => handleDelete(item.id)}>
                                Delete
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="13" className="text-center">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {pageCount > 1 && (
                  <div className="d-flex justify-content-center mt-3">
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
                      containerClassName={"pagination justify-content-center"}
                      pageClassName={"page-item"}
                      pageLinkClassName={"page-link"}
                      previousClassName={"page-item"}
                      previousLinkClassName={"page-link"}
                      nextClassName={"page-item"}
                      nextLinkClassName={"page-link"}
                      activeClassName={"active"}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmAttendanceEntry;


