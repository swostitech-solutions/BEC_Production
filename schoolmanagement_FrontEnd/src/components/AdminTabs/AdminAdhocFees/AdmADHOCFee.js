
// import React, { useState, useEffect } from "react";
// import "./AdmADHOCFee.css";
// import ReactPaginate from "react-paginate";
// import { ApiUrl } from "../../../ApiUrl";
// import { useNavigate } from "react-router-dom";

// const AdmADHOCFee = () => {
//   const navigate = useNavigate();
//   const [isAllSectionsSelected, setIsAllSectionsSelected] = useState(false);
//   const [showTable, setShowTable] = useState(false);
//   const [selectedFeePeriods, setSelectedFeePeriods] = useState({});
//   const [periods, setPeriods] = useState([]);
//   const [isAllFeePeriodsSelected, setIsAllFeePeriodsSelected] = useState(false);
//   const [isAllElementsSelected, setIsAllElementsSelected] = useState(false);
//   const [selectedElements, setSelectedElements] = useState({});
//   const [elements, setElements] = useState([]);
//   const [amounts, setAmounts] = useState({});
//   const [remarks, setRemarks] = useState({});
//   const [sections, setSections] = useState([]);
//   const [selectedSections, setSelectedSections] = useState({});
//   const [selectedStudent, setSelectedStudent] = useState(false);
//   const [students, setStudents] = useState([]); // Array to store student data
//   const [isAllChecked, setIsAllChecked] = useState(false);
//   const [currentPage, setCurrentPage] = useState(0);
//   const studentsPerPage = 10; // Adjust this number based on your preference
//   const [currentStudents, setCurrentStudents] = useState([]);
//   const [sessions, setSessions] = useState([]); // store sessions
//   const [selectedSessions, setSelectedSessions] = useState({}); // track selected sessions
//   const [isAllSessionsSelected, setIsAllSessionsSelected] = useState(false);
//   const [courses, setCourses] = useState([]);
//   const [selectedCourses, setSelectedCourses] = useState({});
//   const [isAllCoursesSelected, setIsAllCoursesSelected] = useState(false);
//   const [departments, setDepartments] = useState([]); // Fetched branch list
//   const [selectedDepartments, setSelectedDepartments] = useState({});
//   const [isAllDepartmentsSelected, setIsAllDepartmentsSelected] =
//     useState(false);
//   const [academicYears, setAcademicYears] = useState([]);
//   const [selectedAcademicYears, setSelectedAcademicYears] = useState({});
//   const [isAllAcademicYearsSelected, setIsAllAcademicYearsSelected] =
//     useState(false);
//   const [semesters, setSemesters] = useState([]);
//   const [selectedSemesters, setSelectedSemesters] = useState({});
//   const [isAllSemestersSelected, setIsAllSemestersSelected] = useState(false);

//   useEffect(() => {
//     const offset = currentPage * studentsPerPage;
//     setCurrentStudents(students.slice(offset, offset + studentsPerPage));
//   }, [students, currentPage]);

//   const handlePageClick = ({ selected }) => {
//     setCurrentPage(selected);
//   };

//   const offset = currentPage * studentsPerPage;
//   // const currentStudents = students.slice(offset, offset + studentsPerPage);
//   const pageCount = Math.ceil(students.length / studentsPerPage);

//   // Fetch sessions from API
//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const branch_id = sessionStorage.getItem("branch_id");
//         const organization_id = sessionStorage.getItem("organization_id");

//         if (!branch_id || !organization_id) {
//           console.error(
//             "Branch ID or Organization ID not found in session storage."
//           );
//           return;
//         }

//         const response = await fetch(
//           `${ApiUrl.apiurl}Batch/GetBatch/?organization_id=${organization_id}&branch_id=${branch_id}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }

//         const data = await response.json();

//         if (Array.isArray(data)) {
//           const sessionOptions = data.map((item) => ({
//             id: item.id,
//             name: item.batch_description, // Example: "2025-2028"
//           }));
//           setSessions(sessionOptions);
//         } else {
//           console.error("Unexpected response format:", data);
//         }
//       } catch (error) {
//         console.error("Error fetching sessions:", error);
//       }
//     };

//     fetchSessions();
//   }, []);

// useEffect(() => {
//   const selectedIds = Object.keys(selectedSessions)
//     .filter((id) => selectedSessions[id])
//     .map(Number);

//   if (selectedIds.length > 0) {
//     localStorage.setItem("selectedSessionIds", JSON.stringify(selectedIds));
//   } else {
//     localStorage.removeItem("selectedSessionIds");
//   }
// }, [selectedSessions]);

//   // Handle single session selection
//   const handleSessionChange = (id) => {
//     setSelectedSessions((prev) => {
//       const updated = { ...prev, [id]: !prev[id] };
//       const allSelected =
//         sessions.length > 0 && sessions.every((session) => updated[session.id]);
//       setIsAllSessionsSelected(allSelected);
//       return updated;
//     });
//   };

//   // Handle select all sessions
//   const handleSelectAllSessions = () => {
//     if (isAllSessionsSelected) {
//       setSelectedSessions({});
//       setIsAllSessionsSelected(false);
//     } else {
//       const all = {};
//       sessions.forEach((session) => {
//         all[session.id] = true;
//       });
//       setSelectedSessions(all);
//       setIsAllSessionsSelected(true);
//     }
//   };

//   useEffect(() => {
//     const fetchCourses = async () => {
//       const selectedIds = Object.keys(selectedSessions).filter(
//         (id) => selectedSessions[id]
//       );

//       if (selectedIds.length === 0) {
//         setCourses([]);
//         return;
//       }

//       const batch_id = selectedIds[0]; // take first selected session ID
//       const token = localStorage.getItem("accessToken");
//       const organization_id = sessionStorage.getItem("organization_id");
//       const branch_id = sessionStorage.getItem("branch_id");

//       try {
//         const response = await fetch(
//           `${ApiUrl.apiurl}Course/GetCourse/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await response.json();
//         if (Array.isArray(data)) {
//           const courseOptions = data.map((item) => ({
//             id: item.id,
//             name: item.course_name,
//           }));
//           setCourses(courseOptions);
//         }
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//       }
//     };

//     fetchCourses();
//   }, [selectedSessions]);
// useEffect(() => {
//   const selectedIds = Object.keys(selectedCourses)
//     .filter((id) => selectedCourses[id])
//     .map(Number);

//   if (selectedIds.length > 0) {
//     localStorage.setItem("selectedCourseIds", JSON.stringify(selectedIds));
//   } else {
//     localStorage.removeItem("selectedCourseIds");
//   }
// }, [selectedCourses]);

//   // Handle single course checkbox change
//   const handleCourseChange = (id) => {
//     setSelectedCourses((prev) => {
//       const updated = { ...prev, [id]: !prev[id] };
//       const allSelected =
//         courses.length > 0 && courses.every((course) => updated[course.id]);
//       setIsAllCoursesSelected(allSelected);
//       return updated;
//     });
//   };

//   // Handle select all courses
//   const handleSelectAllCourses = () => {
//     if (isAllCoursesSelected) {
//       setSelectedCourses({});
//       setIsAllCoursesSelected(false);
//     } else {
//       const all = {};
//       courses.forEach((course) => {
//         all[course.id] = true;
//       });
//       setSelectedCourses(all);
//       setIsAllCoursesSelected(true);
//     }
//   };

//   useEffect(() => {
//     const fetchDepartments = async () => {
//       // Get the first selected session and course IDs
//       const selectedSessionIds = Object.keys(selectedSessions).filter(
//         (id) => selectedSessions[id]
//       );
//       const selectedCourseIds = Object.keys(selectedCourses).filter(
//         (id) => selectedCourses[id]
//       );

//       if (selectedSessionIds.length === 0 || selectedCourseIds.length === 0) {
//         setDepartments([]);
//         return;
//       }

//       const batch_id = selectedSessionIds[0];
//       const course_id = selectedCourseIds[0];

//       try {
//         const token = localStorage.getItem("accessToken");
//         const organization_id = sessionStorage.getItem("organization_id");
//         const branch_id = sessionStorage.getItem("branch_id");

//         if (!token || !organization_id || !branch_id) {
//           console.warn("Missing required identifiers:", {
//             token: !!token,
//             organization_id,
//             branch_id,
//           });
//           return;
//         }

//         const response = await fetch(
//           `${ApiUrl.apiurl}Department/GetDepartment/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(
//             `Network response not ok: ${response.status} - ${errorText}`
//           );
//         }

//         const result = await response.json();
//         console.log("Department API Response:", result);

//         let departmentOptions = [];

//         if (Array.isArray(result)) {
//           departmentOptions = result.map((item) => ({
//             id: item.id || item.department_id,
//             name:
//               item.department_name ||
//               item.description ||
//               item.department_description ||
//               "Unnamed Department",
//           }));
//         } else if (result.message === "Success" && Array.isArray(result.data)) {
//           departmentOptions = result.data.map((item) => ({
//             id: item.id || item.department_id,
//             name:
//               item.department_name ||
//               item.description ||
//               item.department_description ||
//               "Unnamed Department",
//           }));
//         } else {
//           console.warn("Unexpected API format:", result);
//         }

//         setDepartments(departmentOptions);
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//         setDepartments([]);
//       }
//     };

//     fetchDepartments();
//   }, [selectedSessions, selectedCourses]);
// useEffect(() => {
//   const selectedIds = Object.keys(selectedDepartments)
//     .filter((id) => selectedDepartments[id])
//     .map(Number);

//   if (selectedIds.length > 0) {
//     localStorage.setItem("selectedDepartmentIds", JSON.stringify(selectedIds));
//   } else {
//     localStorage.removeItem("selectedDepartmentIds");
//   }
// }, [selectedDepartments]);

//   // Handle single department checkbox change
//   const handleDepartmentChange = (id) => {
//     setSelectedDepartments((prev) => {
//       const updated = { ...prev, [id]: !prev[id] };
//       const allSelected =
//         departments.length > 0 && departments.every((dep) => updated[dep.id]);
//       setIsAllDepartmentsSelected(allSelected);
//       return updated;
//     });
//   };

//   // Handle select all departments
//   const handleSelectAllDepartments = () => {
//     if (isAllDepartmentsSelected) {
//       setSelectedDepartments({});
//       setIsAllDepartmentsSelected(false);
//     } else {
//       const all = {};
//       departments.forEach((dep) => {
//         all[dep.id] = true;
//       });
//       setSelectedDepartments(all);
//       setIsAllDepartmentsSelected(true);
//     }
//   };

//   useEffect(() => {
//     const fetchAcademicYears = async () => {
//       //  Extract selected IDs from checkbox objects
//       const selectedSessionIds = Object.keys(selectedSessions).filter(
//         (id) => selectedSessions[id]
//       );
//       const selectedCourseIds = Object.keys(selectedCourses).filter(
//         (id) => selectedCourses[id]
//       );
//       const selectedDepartmentIds = Object.keys(selectedDepartments).filter(
//         (id) => selectedDepartments[id]
//       );

//       //  Ensure all required fields are selected
//       if (
//         selectedSessionIds.length === 0 ||
//         selectedCourseIds.length === 0 ||
//         selectedDepartmentIds.length === 0
//       ) {
//         setAcademicYears([]);
//         return;
//       }

//       //  Pick first selected ID from each (API supports single value)
//       const batch_id = selectedSessionIds[0];
//       const course_id = selectedCourseIds[0];
//       const department_id = selectedDepartmentIds[0];

//       try {
//         const token = localStorage.getItem("accessToken");
//         const organization_id = sessionStorage.getItem("organization_id");
//         const branch_id = sessionStorage.getItem("branch_id");

//         //  Validation
//         if (!token || !organization_id || !branch_id) {
//           console.warn("Missing required parameters:", {
//             token: !!token,
//             organization_id,
//             branch_id,
//           });
//           return;
//         }

//         //  API URL
//         const url = `${ApiUrl.apiurl}AcademicYear/GetAcademicYear/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}`;
//         console.log("Fetching Academic Years from:", url);

//         //  Fetch call
//         const response = await fetch(url, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(
//             `Network response not ok: ${response.status} - ${errorText}`
//           );
//         }

//         const result = await response.json();
//         console.log("Academic Year API Response:", result);

//         //  Map response properly
//         let yearOptions = [];

//         if (Array.isArray(result)) {
//           yearOptions = result.map((item) => ({
//             id: item.id || item.academic_year_id,
//             name:
//               item.academic_year_description ||
//               item.academic_year_code ||
//               "Unnamed Year",
//           }));
//         } else if (result.message === "Success" && Array.isArray(result.data)) {
//           yearOptions = result.data.map((item) => ({
//             id: item.id || item.academic_year_id,
//             name:
//               item.academic_year_description ||
//               item.academic_year_code ||
//               "Unnamed Year",
//           }));
//         } else {
//           console.warn("Unexpected API format:", result);
//         }

//         setAcademicYears(yearOptions);
//         console.log("Mapped Academic Years:", yearOptions);
//       } catch (error) {
//         console.error("Error fetching academic years:", error);
//         setAcademicYears([]);
//       }
//     };

//     fetchAcademicYears();
//   }, [selectedSessions, selectedCourses, selectedDepartments]);

//   const handleAcademicYearChange = (id) => {
//     setSelectedAcademicYears((prev) => {
//       const updated = { ...prev, [id]: !prev[id] };
//       const allSelected =
//         academicYears.length > 0 &&
//         academicYears.every((year) => updated[year.id]);
//       setIsAllAcademicYearsSelected(allSelected);
//       return updated;
//     });
//   };

//   const handleSelectAllAcademicYears = () => {
//     if (isAllAcademicYearsSelected) {
//       setSelectedAcademicYears({});
//       setIsAllAcademicYearsSelected(false);
//     } else {
//       const all = {};
//       academicYears.forEach((year) => {
//         all[year.id] = true;
//       });
//       setSelectedAcademicYears(all);
//       setIsAllAcademicYearsSelected(true);
//     }
//   };

//   useEffect(() => {
//     const fetchSemesters = async () => {
//       const selectedSessionIds = Object.keys(selectedSessions).filter(
//         (id) => selectedSessions[id]
//       );
//       const selectedCourseIds = Object.keys(selectedCourses).filter(
//         (id) => selectedCourses[id]
//       );
//       const selectedDepartmentIds = Object.keys(selectedDepartments).filter(
//         (id) => selectedDepartments[id]
//       );
//       const selectedAcademicYearIds = Object.keys(selectedAcademicYears).filter(
//         (id) => selectedAcademicYears[id]
//       );

//       if (
//         selectedSessionIds.length === 0 ||
//         selectedCourseIds.length === 0 ||
//         selectedDepartmentIds.length === 0 ||
//         selectedAcademicYearIds.length === 0
//       ) {
//         setSemesters([]);
//         return;
//       }

//       const batch_id = selectedSessionIds[0];
//       const course_id = selectedCourseIds[0];
//       const department_id = selectedDepartmentIds[0];
//       const academic_year_id = selectedAcademicYearIds[0];

//       try {
//         const token = localStorage.getItem("accessToken");
//         const organization_id = sessionStorage.getItem("organization_id");
//         const branch_id = sessionStorage.getItem("branch_id");

//         if (!token || !organization_id || !branch_id) {
//           console.warn("Missing required identifiers:", {
//             token: !!token,
//             organization_id,
//             branch_id,
//           });
//           return;
//         }

//         const url = `${ApiUrl.apiurl}Semester/GetSemester/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}&academic_year_id=${academic_year_id}`;
//         const response = await fetch(url, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`HTTP error: ${response.status} - ${errorText}`);
//         }

//         const result = await response.json();

//         let semesterList = [];
//         if (Array.isArray(result)) {
//           semesterList = result;
//         } else if (result.message === "Success" && Array.isArray(result.data)) {
//           semesterList = result.data;
//         }

//         const options = semesterList.map((item) => ({
//           id: item.id || item.semester_id,
//           name:
//             item.semester_description ||
//             item.semester_code ||
//             "Unnamed Semester",
//         }));

//         setSemesters(options);

//         // Optional: reset selectedSemesters when the semester list changes
//         setSelectedSemesters({});
//         setIsAllSemestersSelected(false);
//       } catch (error) {
//         console.error("Error fetching semesters:", error);
//         setSemesters([]);
//         setSelectedSemesters({});
//         setIsAllSemestersSelected(false);
//       }
//     };

//     fetchSemesters();
//   }, [
//     selectedSessions,
//     selectedCourses,
//     selectedDepartments,
//     selectedAcademicYears,
//   ]);

//   // Corrected Select All handler (uses sem.id)
//   const handleSelectAllSemesters = () => {
//     if (isAllSemestersSelected) {
//       // Unselect all
//       setSelectedSemesters({});
//       setIsAllSemestersSelected(false);
//     } else {
//       // Select all using sem.id
//       const newSelection = {};
//       semesters.forEach((sem) => {
//         newSelection[sem.id] = true;
//       });
//       setSelectedSemesters(newSelection);
//       setIsAllSemestersSelected(true);
//     }
//   };

//   // Corrected individual checkbox handler — also keeps Select All in sync
//   const handleSemesterChange = (semesterId) => {
//     setSelectedSemesters((prev) => {
//       const updated = { ...prev, [semesterId]: !prev[semesterId] };

//       // If semesters array is empty avoid dividing by zero
//       const allSelected =
//         semesters.length > 0 && semesters.every((s) => updated[s.id]);
//       setIsAllSemestersSelected(allSelected);

//       return updated;
//     });
//   };

//   useEffect(() => {
//     const fetchSections = async () => {
//       // Extract selected IDs from checkbox objects
//       const selectedSessionIds = Object.keys(selectedSessions).filter(
//         (id) => selectedSessions[id]
//       );
//       const selectedCourseIds = Object.keys(selectedCourses).filter(
//         (id) => selectedCourses[id]
//       );
//       const selectedDepartmentIds = Object.keys(selectedDepartments).filter(
//         (id) => selectedDepartments[id]
//       );
//       const selectedAcademicYearIds = Object.keys(selectedAcademicYears).filter(
//         (id) => selectedAcademicYears[id]
//       );
//       const selectedSemesterIds = Object.keys(selectedSemesters).filter(
//         (id) => selectedSemesters[id]
//       );

//       // Ensure all required fields are selected
//       if (
//         selectedSessionIds.length === 0 ||
//         selectedCourseIds.length === 0 ||
//         selectedDepartmentIds.length === 0 ||
//         selectedAcademicYearIds.length === 0 ||
//         selectedSemesterIds.length === 0
//       ) {
//         setSections([]);
//         return;
//       }

//       // Pick the first selected ID from each (API supports single value)
//       const batch_id = selectedSessionIds[0];
//       const course_id = selectedCourseIds[0];
//       const department_id = selectedDepartmentIds[0];
//       const academic_year_id = selectedAcademicYearIds[0];
//       const semester_id = selectedSemesterIds[0];

//       try {
//         const token = localStorage.getItem("accessToken");
//         const organization_id = sessionStorage.getItem("organization_id");
//         const branch_id = sessionStorage.getItem("branch_id");

//         if (!token || !organization_id || !branch_id) {
//           console.warn("Missing required identifiers:", {
//             token: !!token,
//             organization_id,
//             branch_id,
//           });
//           return;
//         }

//         const url = `${ApiUrl.apiurl}Section/GetSection/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}&academic_year_id=${academic_year_id}&semester_id=${semester_id}`;
//         console.log("Fetching Sections from:", url);

//         const response = await fetch(url, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(
//             `Network response not ok: ${response.status} - ${errorText}`
//           );
//         }

//         const result = await response.json();
//         console.log("Section API Response:", result);

//         let mappedSections = [];

//         if (Array.isArray(result)) {
//           mappedSections = result.map((item) => ({
//             id: item.id || item.section_id,
//             sectionname:
//               item.section_name ||
//               item.section_description ||
//               "Unnamed Section",
//           }));
//         } else if (result.message === "Success" && Array.isArray(result.data)) {
//           mappedSections = result.data.map((item) => ({
//             id: item.id || item.section_id,
//             sectionname:
//               item.section_name ||
//               item.section_description ||
//               "Unnamed Section",
//           }));
//         } else {
//           console.warn("Unexpected API format:", result);
//         }

//         setSections(mappedSections);
//         console.log("Mapped Sections:", mappedSections);
//       } catch (error) {
//         console.error("Error fetching sections:", error);
//         setSections([]);
//       }
//     };

//     fetchSections();
//   }, [
//     selectedSessions,
//     selectedCourses,
//     selectedDepartments,
//     selectedAcademicYears,
//     selectedSemesters,
//   ]);

//   //  Checkbox Handlers
//   const handleSectionChange = (sectionId) => {
//     setSelectedSections((prevSelected) => {
//       const updatedSelection = {
//         ...prevSelected,
//         [sectionId]: !prevSelected[sectionId],
//       };

//       const allSelected =
//         sections.length > 0 &&
//         sections.every((section) => updatedSelection[section.id]);
//       setIsAllSectionsSelected(allSelected);

//       return updatedSelection;
//     });
//   };

//   const handleSelectAllSections = () => {
//     setIsAllSectionsSelected((prevState) => {
//       const newState = !prevState;
//       const newSelectedSections = {};

//       if (newState) {
//         sections.forEach((section) => {
//           newSelectedSections[section.id] = true;
//         });
//       }

//       setSelectedSections(newSelectedSections);
//       return newState;
//     });
//   };

//   const handleClear = () => {
//     // Reset all selection states
//     setSelectedSessions({});
//     setSelectedCourses({});
//     setSelectedDepartments({});
//     setSelectedAcademicYears({});
//     setSelectedSemesters({});
//     setSelectedSections({});
//     setSelectedFeePeriods({});
//     setSelectedElements({});

//     // Reset data lists
//     setCourses([]);
//     setDepartments([]);
//     setAcademicYears([]);
//     setSemesters([]);
//     setSections([]);
//     setPeriods([]);
//     setElements([]);
//     setStudents([]);
//     setCurrentStudents([]);

//     // Reset amounts, remarks, and pagination
//     setAmounts({});
//     setRemarks({});
//     setCurrentPage(0);
//     setShowTable(false);

//     // Reset "Select All" checkboxes
//     setIsAllSessionsSelected(false);
//     setIsAllCoursesSelected(false);
//     setIsAllDepartmentsSelected(false);
//     setIsAllAcademicYearsSelected(false);
//     setIsAllSemestersSelected(false);
//     setIsAllSectionsSelected(false);
//     setIsAllFeePeriodsSelected(false);
//     setIsAllElementsSelected(false);

//     // Reset student-related flags
//     setSelectedStudent(false);
//     setIsAllChecked(false);
//   };


//   useEffect(() => {
//     // fetchFeePeriods();
//     fetchFeeElements();
//   }, []);

// useEffect(() => {
//   const fetchPeriods = async () => {
//     try {
//       const token = localStorage.getItem("accessToken");

//       const organization_id = sessionStorage.getItem("organization_id");
//       const branch_id = sessionStorage.getItem("branch_id");

//       // get FIRST selected batch, course & department
//       const batch_id = Object.keys(selectedSessions).find(
//         (id) => selectedSessions[id]
//       );
//       const course_id = Object.keys(selectedCourses).find(
//         (id) => selectedCourses[id]
//       );
//       const department_id = Object.keys(selectedDepartments).find(
//         (id) => selectedDepartments[id]
//       );

//       if (
//         !token ||
//         !organization_id ||
//         !branch_id ||
//         !batch_id ||
//         !course_id ||
//         !department_id
//       ) {
//         setPeriods([]);
//         return;
//       }

//       const url = `http://31.97.63.174:9000/api/Semester/GetSemesterByDepartment/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}`;

//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch periods");
//       }

//       const data = await response.json();
//       console.log("Period API Response:", data);

//       // ✅ API returns array directly
//       if (Array.isArray(data)) {
//         const mappedPeriods = data.map((period) => ({
//           id: period.id,
//           period_name:
//             period.semester_description ||
//             period.semester_code ||
//             "Unnamed Period",
//         }));

//         setPeriods(mappedPeriods);

//         // initialize checkbox state
//         const initialSelection = {};
//         mappedPeriods.forEach((p) => {
//           initialSelection[p.id] = false;
//         });

//         setSelectedFeePeriods(initialSelection);
//         setIsAllFeePeriodsSelected(false);
//       } else {
//         setPeriods([]);
//       }
//     } catch (error) {
//       console.error("Error fetching periods:", error);
//       setPeriods([]);
//     }
//   };

//   fetchPeriods();
// }, [selectedSessions, selectedCourses, selectedDepartments]);


//   const fetchFeeElements = async () => {
//     try {
//       const response = await fetch(
//         `${ApiUrl.apiurl}FeeElementType/GetAllFeeElements/A`
//       );
//       const result = await response.json();

//       if (result.message === "success" && Array.isArray(result.data)) {
//         const elements = result.data.map((element) => ({
//           id: element.id,
//           element_name: element.element_name || "",
//           element_description: element.element_description || "",
//         }));

//         setElements(elements);

//         // Initialize all elements as unselected
//         const initialSelectedElements = {};
//         elements.forEach((element) => {
//           initialSelectedElements[element.id] = false;
//         });

//         setSelectedElements(initialSelectedElements);
//       } else {
//         console.error("Failed to fetch fee elements:", result.message);
//       }
//     } catch (error) {
//       console.error("Error fetching fee elements:", error);
//     }
//   };

//   const handleAmountChange = (e, element) => {
//     setAmounts({
//       ...amounts,
//       [element]: e.target.value,
//     });
//   };

//   const handleRemarkChange = (e, element) => {
//     setRemarks({
//       ...remarks,
//       [element]: e.target.value,
//     });
//   };

//   // API call to fetch classes
// const handleSearch = async () => {
//   const selectedSessionIds = Object.keys(selectedSessions)
//     .filter((id) => selectedSessions[id])
//     .map(Number);
//   const selectedCourseIds = Object.keys(selectedCourses)
//     .filter((id) => selectedCourses[id])
//     .map(Number);
//   const selectedDepartmentIds = Object.keys(selectedDepartments)
//     .filter((id) => selectedDepartments[id])
//     .map(Number);
//   const selectedAcademicYearIds = Object.keys(selectedAcademicYears)
//     .filter((id) => selectedAcademicYears[id])
//     .map(Number);
//   const selectedSemesterIds = Object.keys(selectedSemesters)
//     .filter((id) => selectedSemesters[id])
//     .map(Number);
//   const selectedSectionIds = Object.keys(selectedSections)
//     .filter((id) => selectedSections[id])
//     .map(Number);

//   const organization_id = sessionStorage.getItem("organization_id");
//   const branch_id = sessionStorage.getItem("branch_id");

//   if (
//     !organization_id ||
//     !branch_id ||
//     selectedSessionIds.length === 0 ||
//     selectedCourseIds.length === 0 ||
//     selectedDepartmentIds.length === 0 ||
//     selectedAcademicYearIds.length === 0 ||
//     selectedSemesterIds.length === 0 ||
//     selectedSectionIds.length === 0
//   ) {
//     alert("Please select all required filters before searching.");
//     setShowTable(false);
//     return;
//   }

//   try {
//     const url = `${
//       ApiUrl.apiurl
//     }Filter/GetStudentBasedCourseSection/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${selectedSessionIds.join(
//       ","
//     )}&course_ids=${selectedCourseIds.join(
//       ","
//     )}&department_ids=${selectedDepartmentIds.join(
//       ","
//     )}&academic_year_id=${selectedAcademicYearIds.join(
//       ","
//     )}&semester_ids=${selectedSemesterIds.join(
//       ","
//     )}&section_ids=${selectedSectionIds.join(",")}`;

//     console.log("Fetching students from:", url);

//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const result = await response.json();
//     console.log("Student API Response:", result);

//     if (
//       result.message?.toLowerCase() === "success" &&
//       Array.isArray(result.data)
//     ) {
//       setStudents(result.data);
//       setCurrentPage(0);
//       setShowTable(true);

//       //  CLEAR FILTER FIELDS AFTER SUCCESS
//       setSelectedSessions({});
//       setIsAllSessionsSelected(false);
//       setSelectedCourses({});
//       setIsAllCoursesSelected(false);
//       setSelectedDepartments({});
//       setIsAllDepartmentsSelected(false);
//       setSelectedAcademicYears({});
//       setIsAllAcademicYearsSelected(false);
//       setSelectedSemesters({});
//       setIsAllSemestersSelected(false);
//       setSelectedSections({});
//       setIsAllSectionsSelected(false);

//       console.log("Filters cleared after successful search ✅");
//     } else {
//       console.error("Failed to fetch student data:", result.message);
//       setShowTable(false);
//     }
//   } catch (error) {
//     console.error("Error fetching student data:", error);
//     alert("An error occurred while fetching student data. Please try again.");
//   }
// };



//   // const handleSectionChange = (sectionId) => {
//   //   setSelectedSections((prevState) => ({
//   //     ...prevState,
//   //     [sectionId]: !prevState[sectionId], // Toggle selected state for the given section
//   //   }));
//   // };

//   // const handleClear = () => {
//   //   console.log("Clear button clicked");
//   // };

//   const handleShow = () => {
//     console.log("Select Student button clicked");
//   };

//   const handleSelectAllStudents = (event) => {
//     const newChecked = event.target.checked;
//     setIsAllChecked(newChecked);

//     const updatedStudents = students.map((student) => ({
//       ...student,
//       checked: newChecked, // Set all checkboxes to the same selected state
//     }));

//     setStudents(updatedStudents); // Update state with the new student list
//   };

//   const handleCheckboxChange = (student_id) => {
//     const updatedStudents = students.map(
//       (students) =>
//         students.student_id === student_id
//           ? { ...students, checked: !students.checked } // Toggle checked state for the specific student
//           : students // Keep other students unchanged
//     );

//     setStudents(updatedStudents); // Update the state with the modified students array
//   };

//   // const handleSelectAllSections = () => {
//   //   const newValue = !isAllSectionsSelected;
//   //   setIsAllSectionsSelected(newValue);
//   //   const updatedSections = {};
//   //   sections.forEach((section) => {
//   //     updatedSections[section.id] = newValue; // Set all sections to selected or not
//   //   });
//   //   setSelectedSections(updatedSections);
//   // };
//   const handleSelectAllFeePeriods = () => {
//     if (isAllFeePeriodsSelected) {
//       // Unselect all
//       setSelectedFeePeriods({});
//       setIsAllFeePeriodsSelected(false);
//     } else {
//       // Select all using period.id
//       const newSelection = {};
//       periods.forEach((period) => {
//         newSelection[period.id] = true;
//       });
//       setSelectedFeePeriods(newSelection);
//       setIsAllFeePeriodsSelected(true);
//     }
//   };

//   const handleFeePeriodChange = (periodId) => {
//     setSelectedFeePeriods((prev) => {
//       const updated = { ...prev, [periodId]: !prev[periodId] };

//       // Check if all are selected
//       const allSelected =
//         periods.length > 0 && periods.every((p) => updated[p.id]);
//       setIsAllFeePeriodsSelected(allSelected);

//       return updated;
//     });
//   };

//   // Handle Select All for Elements (New logic for "Element")
//   const handleSelectAllElements = (e) => {
//     const isSelected = e.target.checked; // Check if the "Select All" checkbox is selected or not.
//     setIsAllElementsSelected(isSelected);

//     // Update the selectedElements by element.id, not element_name.
//     const updatedElements = elements.reduce((acc, element) => {
//       acc[element.id] = isSelected; // Set the checkbox state for each element
//       return acc;
//     }, {});

//     setSelectedElements(updatedElements); // Set the updated selection for all elements
//   };

//   const handleElementChange = (elementId) => {
//     setSelectedElements((prevState) => ({
//       ...prevState,
//       [elementId]: !prevState[elementId], // Toggle the selection state for the specific element
//     }));
//   };
//   const handleAssign = async () => {
//     const selectedStudentIds = students
//       .filter((student) => student.checked)
//       .map((student) => student.student_id);

//     const selectedPeriodIds = Object.keys(selectedFeePeriods)
//       .filter((periodId) => selectedFeePeriods[periodId])
//       .map((periodId) => parseInt(periodId, 10));

//     const feeElementIds = Object.keys(selectedElements)
//       .filter((elementId) => selectedElements[elementId])
//       .map((elementId) => ({
//         element_id: parseInt(elementId, 10),
//         amount: amounts[elementId] || "",
//         remarks: remarks[elementId] || "",
//       }))
//       .filter((element) => !isNaN(element.element_id));

//     //  Validations
//     if (selectedStudentIds.length === 0) {
//       alert("Please select at least one student.");
//       return;
//     }

//     if (selectedPeriodIds.length === 0) {
//       alert("Please select at least one fee period.");
//       return;
//     }

//     if (feeElementIds.length === 0) {
//       alert("Please select at least one fee element.");
//       return;
//     }

//     for (let feeElement of feeElementIds) {
//       if (feeElement.amount === "" || isNaN(feeElement.amount)) {
//         alert("Amount is missing or invalid for one of the fee elements.");
//         return;
//       }
//       if (feeElement.remarks.trim() === "") {
//         alert("Remarks are missing for one of the fee elements.");
//         return;
//       }
//     }

//     //  Get created_by from session storage
//     const createdBy = sessionStorage.getItem("userId");
//     if (!createdBy) {
//       alert("User ID not found in session storage. Please log in again.");
//       return;
//     }

//     const assignedData = {
//       studentIds: selectedStudentIds,
//       periodIds: selectedPeriodIds,
//       feeElementIds: feeElementIds,
//       created_by: parseInt(createdBy, 10),
//     };

//     console.log("Payload to API:", assignedData);

//     try {
//       const token = localStorage.getItem("accessToken");
//       if (!token) {
//         alert("Access token not found. Please log in again.");
//         return;
//       }

//       const response = await fetch(`${ApiUrl.apiurl}ADHOC/StudentFeesCreate/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(assignedData),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         console.log("Assigned Data Response:", result);
//         alert("Data assigned successfully!");

//         //  Clear all selections after success
//         setStudents([]);
//         setSelectedFeePeriods({});
//         setSelectedElements({});
//         setAmounts({});
//         setRemarks({});
//       } else {
//         console.error("Failed to assign data:", result);
//         alert(result.message || "An error occurred while assigning data.");
//       }
//     } catch (error) {
//       console.error("Error while assigning data:", error);
//       alert("An unexpected error occurred. Please try again.");
//     }
//   };

//   return (
//     <div
//       className="container-fluid"
//       style={{
//         border: "1px solid #ccc",
//         borderRadius: "5px",
//         padding: "15px",
//         marginTop: "10px",
//         width: "98%",
//         height: "100%",
//         backgroundColor: "rgba(55, 123, 241, 0.1)",
//       }}
//     >
//       {/* Header Section */}
//       <div
//         className="header-container"
//         style={{ textAlign: "center", marginBottom: "20px" }}
//       >
//         <h2 style={{ fontSize: "24px", color: "#333" }}>ADHOC FEES</h2>
//       </div>

//       {/* Buttons Section */}
//       <div className="row mb-3 mt-3 mx-0">
//         <div className="col-12 d-flex flex-wrap gap-2">
//           <button
//             type="button"
//             className="btn btn-primary me-2"
//             style={{
//               width: "150px",
//             }}
//             onClick={handleAssign}
//           >
//             Assign
//           </button>
//           <button
//             type="button"
//             className="btn btn-primary me-2"
//             style={{
//               width: "150px",
//             }}
//             onClick={handleSearch}
//           >
//             Search
//           </button>
//           <button
//             type="button"
//             className="btn btn-secondary"
//             style={{
//               width: "150px",
//             }}
//             onClick={handleClear}
//           >
//             Clear
//           </button>
//           <button
//             type="button"
//             className="btn btn-danger me-2"
//             style={{
//               width: "150px",
//             }}
//             onClick={() => navigate("/admin/dashboard")}
//           >
//             Close
//           </button>
//         </div>
//       </div>

//       {/* Sections: Class, Section, Fee Period, Element */}
//       <div
//         className="fee-collection-container mx-2"
//         style={{
//           border: "1px solid #ccc",
//           borderRadius: "5px",
//           marginTop: "10px",
//           display: "flex",
//           flexWrap: "wrap",
//           overflowX: "auto",
//           background: "white",
//         }}
//       >
//         <div
//           className="fee-collection-class col-small"
//           style={{ flex: "1 1 200px", margin: "10px" }}
//         >
//           <span>Session</span>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               marginBottom: "10px",
//             }}
//           >
//             <input
//               type="checkbox"
//               id="select-all-sessions"
//               checked={isAllSessionsSelected}
//               onChange={handleSelectAllSessions}
//               style={{ cursor: "pointer" }}
//             />
//             <label
//               htmlFor="select-all-classes"
//               style={{
//                 marginLeft: "5px",
//                 cursor: "pointer",
//                 userSelect: "none",
//               }}
//             >
//               Select All Sessions
//             </label>
//           </div>
//           <div
//             className="section-content"
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               maxHeight: "150px",
//               overflowY: "auto",
//             }}
//           >
//             {sessions.map((session) => (
//               <div
//                 key={session.id}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "5px",
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   id={`session-${session.id}`}
//                   checked={selectedSessions[session.id] || false}
//                   onChange={() => handleSessionChange(session.id)}
//                   style={{ cursor: "pointer" }}
//                 />
//                 <label
//                   htmlFor={`session-${session.id}`}
//                   style={{
//                     marginLeft: "5px",
//                     cursor: "pointer",
//                     userSelect: "none",
//                   }}
//                 >
//                   {session.name}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div
//           className="fee-collection-class col-small"
//           style={{ flex: "1 1 200px", margin: "10px" }}
//         >
//           <span>Course</span>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               marginBottom: "10px",
//             }}
//           >
//             <input
//               type="checkbox"
//               id="select-all-courses"
//               checked={isAllCoursesSelected}
//               onChange={handleSelectAllCourses}
//               style={{ cursor: "pointer" }}
//             />
//             <label
//               htmlFor="select-all-courses"
//               style={{
//                 marginLeft: "5px",
//                 cursor: "pointer",
//                 userSelect: "none",
//               }}
//             >
//               Select All Courses
//             </label>
//           </div>
//           <div
//             className="section-content"
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               maxHeight: "150px",
//               overflowY: "auto",
//             }}
//           >
//             {courses.map((course) => (
//               <div
//                 key={course.id}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "5px",
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   id={`course-${course.id}`}
//                   checked={selectedCourses[course.id] || false}
//                   onChange={() => handleCourseChange(course.id)}
//                   style={{ cursor: "pointer" }}
//                 />
//                 <label
//                   htmlFor={`course-${course.id}`}
//                   style={{
//                     marginLeft: "5px",
//                     cursor: "pointer",
//                     userSelect: "none",
//                   }}
//                 >
//                   {course.name}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div
//           className="fee-collection-class col-small"
//           style={{ flex: "1 1 200px", margin: "10px" }}
//         >
//           <span>Department</span>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               marginBottom: "10px",
//             }}
//           >
//             <input
//               type="checkbox"
//               id="select-all-departments"
//               checked={isAllDepartmentsSelected}
//               onChange={handleSelectAllDepartments}
//               style={{ cursor: "pointer" }}
//             />
//             <label
//               htmlFor="select-all-departments"
//               style={{
//                 marginLeft: "5px",
//                 cursor: "pointer",
//                 userSelect: "none",
//               }}
//             >
//               Select All Departments
//             </label>
//           </div>
//           <div
//             className="section-content"
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               maxHeight: "150px",
//               overflowY: "auto",
//             }}
//           >
//             {departments.map((dep) => (
//               <div
//                 key={dep.id}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "5px",
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   id={`dep-${dep.id}`}
//                   checked={selectedDepartments[dep.id] || false}
//                   onChange={() => handleDepartmentChange(dep.id)}
//                   style={{ cursor: "pointer" }}
//                 />
//                 <label
//                   htmlFor={`dep-${dep.id}`}
//                   style={{
//                     marginLeft: "5px",
//                     cursor: "pointer",
//                     userSelect: "none",
//                   }}
//                 >
//                   {dep.name}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div
//           className="fee-collection-class col-small"
//           style={{ flex: "1 1 200px", margin: "10px" }}
//         >
//           <span>Academic year</span>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               marginBottom: "10px",
//             }}
//           >
//             <input
//               type="checkbox"
//               id="select-all-academic-years"
//               checked={isAllAcademicYearsSelected}
//               onChange={handleSelectAllAcademicYears}
//               style={{ cursor: "pointer" }}
//             />
//             <label
//               htmlFor="select-all-academic-years"
//               style={{
//                 marginLeft: "5px",
//                 cursor: "pointer",
//                 userSelect: "none",
//               }}
//             >
//               Select All Academic Years
//             </label>
//           </div>
//           <div
//             className="section-content"
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               maxHeight: "150px",
//               overflowY: "auto",
//             }}
//           >
//             {academicYears.map((year) => (
//               <div
//                 key={year.id}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "5px",
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   id={`year-${year.id}`}
//                   checked={selectedAcademicYears[year.id] || false}
//                   onChange={() => handleAcademicYearChange(year.id)}
//                   style={{ cursor: "pointer" }}
//                 />
//                 <label
//                   htmlFor={`year-${year.id}`}
//                   style={{
//                     marginLeft: "5px",
//                     cursor: "pointer",
//                     userSelect: "none",
//                   }}
//                 >
//                   {year.name}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div
//           className="fee-collection-class col-small"
//           style={{ flex: "1 1 200px", margin: "10px" }}
//         >
//           <span>Semester</span>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               marginBottom: "10px",
//             }}
//           >
//             <input
//               type="checkbox"
//               id="select-all-semesters"
//               checked={isAllSemestersSelected}
//               onChange={handleSelectAllSemesters}
//               style={{ cursor: "pointer" }}
//             />
//             <label
//               htmlFor="select-all-semesters"
//               style={{
//                 marginLeft: "5px",
//                 cursor: "pointer",
//                 userSelect: "none",
//               }}
//             >
//               Select All semesters
//             </label>
//           </div>
//           <div
//             className="section-content"
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               maxHeight: "150px",
//               overflowY: "auto",
//             }}
//           >
//             {semesters.map((sem) => (
//               <div
//                 key={sem.id}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "5px",
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   id={`semester-${sem.id}`}
//                   checked={selectedSemesters[sem.id] || false}
//                   onChange={() => handleSemesterChange(sem.id)}
//                   style={{ cursor: "pointer" }}
//                 />
//                 <label
//                   htmlFor={`semester-${sem.id}`}
//                   style={{
//                     marginLeft: "5px",
//                     cursor: "pointer",
//                     userSelect: "none",
//                   }}
//                 >
//                   {sem.name}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div
//           className="fee-collection-sections col-small"
//           style={{ flex: "1 1 200px", margin: "10px" }}
//         >
//           <span>Sections</span>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               marginBottom: "10px",
//             }}
//           >
//             <input
//               type="checkbox"
//               id="select-all-sections"
//               checked={isAllSectionsSelected}
//               onChange={handleSelectAllSections}
//               style={{ cursor: "pointer" }}
//             />
//             <label
//               htmlFor="select-all-sections"
//               style={{
//                 marginLeft: "5px",
//                 cursor: "pointer",
//                 userSelect: "none",
//               }}
//             >
//               Select All Sections
//             </label>
//           </div>
//           <div
//             className="section-content"
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               maxHeight: "150px",
//               overflowY: "auto",
//             }}
//           >
//             {sections.map((section) => (
//               <div
//                 key={section.id}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "5px",
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   id={`section-${section.id}`}
//                   checked={selectedSections[section.id] || false}
//                   onChange={() => handleSectionChange(section.id)}
//                   style={{ cursor: "pointer" }}
//                 />
//                 <label
//                   htmlFor={`section-${section.id}`}
//                   style={{
//                     marginLeft: "5px",
//                     cursor: "pointer",
//                     userSelect: "none",
//                   }}
//                 >
//                   {section.sectionname}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div
//           className="fee-collection-period col-small"
//           style={{ flex: "1 1 200px", margin: "10px" }}
//         >
//           <span>Fee Period</span>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               marginBottom: "10px",
//             }}
//           >
//             <input
//               type="checkbox"
//               id="select-all-fee-periods"
//               checked={isAllFeePeriodsSelected}
//               onChange={handleSelectAllFeePeriods}
//               style={{ cursor: "pointer" }}
//             />
//             <label
//               htmlFor="select-all-fee-periods"
//               style={{
//                 marginLeft: "5px",
//                 cursor: "pointer",
//                 userSelect: "none",
//               }}
//             >
//               Select All Fee Periods
//             </label>
//           </div>
//           <div
//             className="section-content"
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               maxHeight: "150px",
//               overflowY: "auto",
//             }}
//           >
//             {periods.map((period) => (
//               <div
//                 key={period.id}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "5px",
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   id={`fee-period-${period.id}`}
//                   checked={selectedFeePeriods[period.id] || false}
//                   onChange={() => handleFeePeriodChange(period.id)}
//                   style={{ cursor: "pointer" }}
//                 />
//                 <label
//                   htmlFor={`fee-period-${period.id}`}
//                   style={{
//                     marginLeft: "5px",
//                     cursor: "pointer",
//                     userSelect: "none",
//                   }}
//                 >
//                   {period.period_name}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div
//           className="fee-collection-element col-large"
//           style={{ flex: "1 1 400px", margin: "10px", overflowX: "auto" }}
//         >
//           <span>Element</span>
//           <div className="element-content">
//             <table className="table table-bordered" style={{ width: "100%" }}>
//               <thead>
//                 <tr>
//                   <th>
//                     <input
//                       type="checkbox"
//                       checked={isAllElementsSelected}
//                       onChange={handleSelectAllElements}
//                     />
//                   </th>
//                   <th>Element Name</th>
//                   <th>Amount</th>
//                   <th>Remark</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {elements.map((element) => (
//                   <tr key={element.id}>
//                     <td>
//                       <input
//                         type="checkbox"
//                         checked={selectedElements[element.id] || false}
//                         onChange={() => handleElementChange(element.id)}
//                       />
//                     </td>
//                     <td>{element.element_name}</td>
//                     <td>
//                       <input
//                         type="number"
//                         value={amounts[element.id] || ""}
//                         onChange={(e) => handleAmountChange(e, element.id)}
//                         style={{ width: "100%" }}
//                       />
//                     </td>
//                     <td>
//                       <input
//                         type="text"
//                         value={remarks[element.id] || ""}
//                         onChange={(e) => handleRemarkChange(e, element.id)}
//                         style={{ width: "100%" }}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//       <div className="container-fluid mt-4">
//         <div className="table-responsive">
//           {showTable && students.length > 0 ? (
//             <table className=" table  table-bordered">
//               <thead>
//                 <tr>
//                   <th>
//                     <input
//                       type="checkbox"
//                       checked={isAllChecked}
//                       onChange={handleSelectAllStudents}
//                     />
//                   </th>
//                   <th>Course Name</th>
//                   <th>Branch</th>
//                   <th>Name</th>
//                   <th>Academic Year</th>
//                   <th>Semester</th>
//                   <th>Section</th>
//                   <th>Admission Number</th>
//                   <th>Father Name</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentStudents.map((student) => (
//                   <tr key={student.student_id}>
//                     <td>
//                       <input
//                         type="checkbox"
//                         checked={student.checked || false}
//                         onChange={() =>
//                           handleCheckboxChange(student.student_id)
//                         }
//                       />
//                     </td>
//                     <td>{student.course_name}</td>
//                     <td>{student.department}</td>
//                     <td>{student.student_name}</td>
//                     <td>{student.academic_year}</td>
//                     <td>{student.semester}</td>
//                     <td>{student.section}</td>
//                     <td>{student.college_admission_no}</td>
//                     <td>{student.father_name}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             showTable && <p>No data available </p>
//           )}
//           <ReactPaginate
//             previousLabel={"Previous"}
//             nextLabel={"Next"}
//             breakLabel={"..."}
//             breakClassName={"page-item"}
//             breakLinkClassName={"page-link"}
//             pageCount={pageCount}
//             marginPagesDisplayed={2}
//             pageRangeDisplayed={5}
//             onPageChange={handlePageClick}
//             containerClassName={"pagination justify-content-center"}
//             pageClassName={"page-item"}
//             pageLinkClassName={"page-link"}
//             previousClassName={"page-item"}
//             previousLinkClassName={"page-link"}
//             nextClassName={"page-item"}
//             nextLinkClassName={"page-link"}
//             activeClassName={"active"}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };
// export default AdmADHOCFee;




import React, { useState, useEffect } from "react";
import "./AdmADHOCFee.css";
import ReactPaginate from "react-paginate";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";

const AdmADHOCFee = () => {
  const navigate = useNavigate();
  const [isAllSectionsSelected, setIsAllSectionsSelected] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [selectedFeePeriods, setSelectedFeePeriods] = useState({});
  const [periods, setPeriods] = useState([]);
  const [isAllFeePeriodsSelected, setIsAllFeePeriodsSelected] = useState(false);
  const [isAllElementsSelected, setIsAllElementsSelected] = useState(false);
  const [selectedElements, setSelectedElements] = useState({});
  const [elements, setElements] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [remarks, setRemarks] = useState({});
  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(false);
  const [students, setStudents] = useState([]); // Array to store student data
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const studentsPerPage = 10; // Adjust this number based on your preference
  const [currentStudents, setCurrentStudents] = useState([]);
  const [sessions, setSessions] = useState([]); // store sessions
  const [selectedSessions, setSelectedSessions] = useState({}); // track selected sessions
  const [isAllSessionsSelected, setIsAllSessionsSelected] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState({});
  const [isAllCoursesSelected, setIsAllCoursesSelected] = useState(false);
  const [departments, setDepartments] = useState([]); // Fetched branch list
  const [selectedDepartments, setSelectedDepartments] = useState({});
  const [isAllDepartmentsSelected, setIsAllDepartmentsSelected] =
    useState(false);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYears, setSelectedAcademicYears] = useState({});
  const [isAllAcademicYearsSelected, setIsAllAcademicYearsSelected] =
    useState(false);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemesters, setSelectedSemesters] = useState({});
  const [isAllSemestersSelected, setIsAllSemestersSelected] = useState(false);

  useEffect(() => {
    const offset = currentPage * studentsPerPage;
    setCurrentStudents(students.slice(offset, offset + studentsPerPage));
  }, [students, currentPage]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * studentsPerPage;
  // const currentStudents = students.slice(offset, offset + studentsPerPage);
  const pageCount = Math.ceil(students.length / studentsPerPage);

  // Fetch sessions from API
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const branch_id = sessionStorage.getItem("branch_id");
        const organization_id = sessionStorage.getItem("organization_id");

        if (!branch_id || !organization_id) {
          console.error(
            "Branch ID or Organization ID not found in session storage."
          );
          return;
        }

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

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const sessionOptions = data.map((item) => ({
            id: item.id,
            name: item.batch_description, // Example: "2025-2028"
          }));
          setSessions(sessionOptions);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    const selectedIds = Object.keys(selectedSessions)
      .filter((id) => selectedSessions[id])
      .map(Number);

    if (selectedIds.length > 0) {
      localStorage.setItem("selectedSessionIds", JSON.stringify(selectedIds));
    } else {
      localStorage.removeItem("selectedSessionIds");
    }
  }, [selectedSessions]);

  // Handle single session selection
  const handleSessionChange = (id) => {
    setSelectedSessions((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      const allSelected =
        sessions.length > 0 && sessions.every((session) => updated[session.id]);
      setIsAllSessionsSelected(allSelected);
      return updated;
    });
  };

  // Handle select all sessions
  const handleSelectAllSessions = () => {
    if (isAllSessionsSelected) {
      setSelectedSessions({});
      setIsAllSessionsSelected(false);
    } else {
      const all = {};
      sessions.forEach((session) => {
        all[session.id] = true;
      });
      setSelectedSessions(all);
      setIsAllSessionsSelected(true);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const selectedIds = Object.keys(selectedSessions).filter(
        (id) => selectedSessions[id]
      );

      if (selectedIds.length === 0) {
        setCourses([]);
        return;
      }

      const batch_id = selectedIds[0]; // take first selected session ID
      const token = localStorage.getItem("accessToken");
      const organization_id = sessionStorage.getItem("organization_id");
      const branch_id = sessionStorage.getItem("branch_id");

      try {
        const response = await fetch(
          `${ApiUrl.apiurl}Course/GetCourse/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}`,
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
          const courseOptions = data.map((item) => ({
            id: item.id,
            name: item.course_name,
          }));
          setCourses(courseOptions);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [selectedSessions]);
  useEffect(() => {
    const selectedIds = Object.keys(selectedCourses)
      .filter((id) => selectedCourses[id])
      .map(Number);

    if (selectedIds.length > 0) {
      localStorage.setItem("selectedCourseIds", JSON.stringify(selectedIds));
    } else {
      localStorage.removeItem("selectedCourseIds");
    }
  }, [selectedCourses]);

  // Handle single course checkbox change
  const handleCourseChange = (id) => {
    setSelectedCourses((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      const allSelected =
        courses.length > 0 && courses.every((course) => updated[course.id]);
      setIsAllCoursesSelected(allSelected);
      return updated;
    });
  };

  // Handle select all courses
  const handleSelectAllCourses = () => {
    if (isAllCoursesSelected) {
      setSelectedCourses({});
      setIsAllCoursesSelected(false);
    } else {
      const all = {};
      courses.forEach((course) => {
        all[course.id] = true;
      });
      setSelectedCourses(all);
      setIsAllCoursesSelected(true);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      // Get the first selected session and course IDs
      const selectedSessionIds = Object.keys(selectedSessions).filter(
        (id) => selectedSessions[id]
      );
      const selectedCourseIds = Object.keys(selectedCourses).filter(
        (id) => selectedCourses[id]
      );

      if (selectedSessionIds.length === 0 || selectedCourseIds.length === 0) {
        setDepartments([]);
        return;
      }

      const batch_id = selectedSessionIds[0];
      const course_id = selectedCourseIds[0];

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");

        if (!token || !organization_id || !branch_id) {
          console.warn("Missing required identifiers:", {
            token: !!token,
            organization_id,
            branch_id,
          });
          return;
        }

        const response = await fetch(
          `${ApiUrl.apiurl}Department/GetDepartment/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Network response not ok: ${response.status} - ${errorText}`
          );
        }

        const result = await response.json();
        console.log("Department API Response:", result);

        let departmentOptions = [];

        if (Array.isArray(result)) {
          departmentOptions = result.map((item) => ({
            id: item.id || item.department_id,
            name:
              item.department_name ||
              item.description ||
              item.department_description ||
              "Unnamed Department",
          }));
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          departmentOptions = result.data.map((item) => ({
            id: item.id || item.department_id,
            name:
              item.department_name ||
              item.description ||
              item.department_description ||
              "Unnamed Department",
          }));
        } else {
          console.warn("Unexpected API format:", result);
        }

        setDepartments(departmentOptions);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, [selectedSessions, selectedCourses]);
  useEffect(() => {
    const selectedIds = Object.keys(selectedDepartments)
      .filter((id) => selectedDepartments[id])
      .map(Number);

    if (selectedIds.length > 0) {
      localStorage.setItem(
        "selectedDepartmentIds",
        JSON.stringify(selectedIds)
      );
    } else {
      localStorage.removeItem("selectedDepartmentIds");
    }
  }, [selectedDepartments]);

  // Handle single department checkbox change
  const handleDepartmentChange = (id) => {
    setSelectedDepartments((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      const allSelected =
        departments.length > 0 && departments.every((dep) => updated[dep.id]);
      setIsAllDepartmentsSelected(allSelected);
      return updated;
    });
  };

  // Handle select all departments
  const handleSelectAllDepartments = () => {
    if (isAllDepartmentsSelected) {
      setSelectedDepartments({});
      setIsAllDepartmentsSelected(false);
    } else {
      const all = {};
      departments.forEach((dep) => {
        all[dep.id] = true;
      });
      setSelectedDepartments(all);
      setIsAllDepartmentsSelected(true);
    }
  };

  useEffect(() => {
    const fetchAcademicYears = async () => {
      //  Extract selected IDs from checkbox objects
      const selectedSessionIds = Object.keys(selectedSessions).filter(
        (id) => selectedSessions[id]
      );
      const selectedCourseIds = Object.keys(selectedCourses).filter(
        (id) => selectedCourses[id]
      );
      const selectedDepartmentIds = Object.keys(selectedDepartments).filter(
        (id) => selectedDepartments[id]
      );

      //  Ensure all required fields are selected
      if (
        selectedSessionIds.length === 0 ||
        selectedCourseIds.length === 0 ||
        selectedDepartmentIds.length === 0
      ) {
        setAcademicYears([]);
        return;
      }

      //  Pick first selected ID from each (API supports single value)
      const batch_id = selectedSessionIds[0];
      const course_id = selectedCourseIds[0];
      const department_id = selectedDepartmentIds[0];

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");

        //  Validation
        if (!token || !organization_id || !branch_id) {
          console.warn("Missing required parameters:", {
            token: !!token,
            organization_id,
            branch_id,
          });
          return;
        }

        //  API URL
        const url = `${ApiUrl.apiurl}AcademicYear/GetAcademicYear/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}`;
        console.log("Fetching Academic Years from:", url);

        //  Fetch call
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Network response not ok: ${response.status} - ${errorText}`
          );
        }

        const result = await response.json();
        console.log("Academic Year API Response:", result);

        //  Map response properly
        let yearOptions = [];

        if (Array.isArray(result)) {
          yearOptions = result.map((item) => ({
            id: item.id || item.academic_year_id,
            name:
              item.academic_year_description ||
              item.academic_year_code ||
              "Unnamed Year",
          }));
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          yearOptions = result.data.map((item) => ({
            id: item.id || item.academic_year_id,
            name:
              item.academic_year_description ||
              item.academic_year_code ||
              "Unnamed Year",
          }));
        } else {
          console.warn("Unexpected API format:", result);
        }

        setAcademicYears(yearOptions);
        console.log("Mapped Academic Years:", yearOptions);
      } catch (error) {
        console.error("Error fetching academic years:", error);
        setAcademicYears([]);
      }
    };

    fetchAcademicYears();
  }, [selectedSessions, selectedCourses, selectedDepartments]);

  const handleAcademicYearChange = (id) => {
    setSelectedAcademicYears((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      const allSelected =
        academicYears.length > 0 &&
        academicYears.every((year) => updated[year.id]);
      setIsAllAcademicYearsSelected(allSelected);
      return updated;
    });
  };

  const handleSelectAllAcademicYears = () => {
    if (isAllAcademicYearsSelected) {
      setSelectedAcademicYears({});
      setIsAllAcademicYearsSelected(false);
    } else {
      const all = {};
      academicYears.forEach((year) => {
        all[year.id] = true;
      });
      setSelectedAcademicYears(all);
      setIsAllAcademicYearsSelected(true);
    }
  };

  useEffect(() => {
    const fetchSemesters = async () => {
      const selectedSessionIds = Object.keys(selectedSessions).filter(
        (id) => selectedSessions[id]
      );
      const selectedCourseIds = Object.keys(selectedCourses).filter(
        (id) => selectedCourses[id]
      );
      const selectedDepartmentIds = Object.keys(selectedDepartments).filter(
        (id) => selectedDepartments[id]
      );
      const selectedAcademicYearIds = Object.keys(selectedAcademicYears).filter(
        (id) => selectedAcademicYears[id]
      );

      if (
        selectedSessionIds.length === 0 ||
        selectedCourseIds.length === 0 ||
        selectedDepartmentIds.length === 0 ||
        selectedAcademicYearIds.length === 0
      ) {
        setSemesters([]);
        return;
      }

      const batch_id = selectedSessionIds[0];
      const course_id = selectedCourseIds[0];
      const department_id = selectedDepartmentIds[0];
      const academic_year_id = selectedAcademicYearIds[0];

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");

        if (!token || !organization_id || !branch_id) {
          console.warn("Missing required identifiers:", {
            token: !!token,
            organization_id,
            branch_id,
          });
          return;
        }

        const url = `${ApiUrl.apiurl}Semester/GetSemester/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}&academic_year_id=${academic_year_id}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();

        let semesterList = [];
        if (Array.isArray(result)) {
          semesterList = result;
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          semesterList = result.data;
        }

        const options = semesterList.map((item) => ({
          id: item.id || item.semester_id,
          name:
            item.semester_description ||
            item.semester_code ||
            "Unnamed Semester",
        }));

        setSemesters(options);

        // Optional: reset selectedSemesters when the semester list changes
        setSelectedSemesters({});
        setIsAllSemestersSelected(false);
      } catch (error) {
        console.error("Error fetching semesters:", error);
        setSemesters([]);
        setSelectedSemesters({});
        setIsAllSemestersSelected(false);
      }
    };

    fetchSemesters();
  }, [
    selectedSessions,
    selectedCourses,
    selectedDepartments,
    selectedAcademicYears,
  ]);

  // Corrected Select All handler (uses sem.id)
  const handleSelectAllSemesters = () => {
    if (isAllSemestersSelected) {
      // Unselect all
      setSelectedSemesters({});
      setIsAllSemestersSelected(false);
    } else {
      // Select all using sem.id
      const newSelection = {};
      semesters.forEach((sem) => {
        newSelection[sem.id] = true;
      });
      setSelectedSemesters(newSelection);
      setIsAllSemestersSelected(true);
    }
  };

  // Corrected individual checkbox handler — also keeps Select All in sync
  const handleSemesterChange = (semesterId) => {
    setSelectedSemesters((prev) => {
      const updated = { ...prev, [semesterId]: !prev[semesterId] };

      // If semesters array is empty avoid dividing by zero
      const allSelected =
        semesters.length > 0 && semesters.every((s) => updated[s.id]);
      setIsAllSemestersSelected(allSelected);

      return updated;
    });
  };

  useEffect(() => {
    const fetchSections = async () => {
      // Extract selected IDs from checkbox objects
      const selectedSessionIds = Object.keys(selectedSessions).filter(
        (id) => selectedSessions[id]
      );
      const selectedCourseIds = Object.keys(selectedCourses).filter(
        (id) => selectedCourses[id]
      );
      const selectedDepartmentIds = Object.keys(selectedDepartments).filter(
        (id) => selectedDepartments[id]
      );
      const selectedAcademicYearIds = Object.keys(selectedAcademicYears).filter(
        (id) => selectedAcademicYears[id]
      );
      const selectedSemesterIds = Object.keys(selectedSemesters).filter(
        (id) => selectedSemesters[id]
      );

      // Ensure all required fields are selected
      if (
        selectedSessionIds.length === 0 ||
        selectedCourseIds.length === 0 ||
        selectedDepartmentIds.length === 0 ||
        selectedAcademicYearIds.length === 0 ||
        selectedSemesterIds.length === 0
      ) {
        setSections([]);
        return;
      }

      // Pick the first selected ID from each (API supports single value)
      const batch_id = selectedSessionIds[0];
      const course_id = selectedCourseIds[0];
      const department_id = selectedDepartmentIds[0];
      const academic_year_id = selectedAcademicYearIds[0];
      const semester_id = selectedSemesterIds[0];

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");

        if (!token || !organization_id || !branch_id) {
          console.warn("Missing required identifiers:", {
            token: !!token,
            organization_id,
            branch_id,
          });
          return;
        }

        const url = `${ApiUrl.apiurl}Section/GetSection/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}&academic_year_id=${academic_year_id}&semester_id=${semester_id}`;
        console.log("Fetching Sections from:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Network response not ok: ${response.status} - ${errorText}`
          );
        }

        const result = await response.json();
        console.log("Section API Response:", result);

        let mappedSections = [];

        if (Array.isArray(result)) {
          mappedSections = result.map((item) => ({
            id: item.id || item.section_id,
            sectionname:
              item.section_name ||
              item.section_description ||
              "Unnamed Section",
          }));
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          mappedSections = result.data.map((item) => ({
            id: item.id || item.section_id,
            sectionname:
              item.section_name ||
              item.section_description ||
              "Unnamed Section",
          }));
        } else {
          console.warn("Unexpected API format:", result);
        }

        setSections(mappedSections);
        console.log("Mapped Sections:", mappedSections);
      } catch (error) {
        console.error("Error fetching sections:", error);
        setSections([]);
      }
    };

    fetchSections();
  }, [
    selectedSessions,
    selectedCourses,
    selectedDepartments,
    selectedAcademicYears,
    selectedSemesters,
  ]);

  //  Checkbox Handlers
  const handleSectionChange = (sectionId) => {
    setSelectedSections((prevSelected) => {
      const updatedSelection = {
        ...prevSelected,
        [sectionId]: !prevSelected[sectionId],
      };

      const allSelected =
        sections.length > 0 &&
        sections.every((section) => updatedSelection[section.id]);
      setIsAllSectionsSelected(allSelected);

      return updatedSelection;
    });
  };

  const handleSelectAllSections = () => {
    setIsAllSectionsSelected((prevState) => {
      const newState = !prevState;
      const newSelectedSections = {};

      if (newState) {
        sections.forEach((section) => {
          newSelectedSections[section.id] = true;
        });
      }

      setSelectedSections(newSelectedSections);
      return newState;
    });
  };

  const handleClear = () => {
    // Reset all selection states
    setSelectedSessions({});
    setSelectedCourses({});
    setSelectedDepartments({});
    setSelectedAcademicYears({});
    setSelectedSemesters({});
    setSelectedSections({});
    setSelectedFeePeriods({});
    setSelectedElements({});

    // Reset data lists
    setCourses([]);
    setDepartments([]);
    setAcademicYears([]);
    setSemesters([]);
    setSections([]);
    setPeriods([]);
    setElements([]);
    setStudents([]);
    setCurrentStudents([]);

    // Reset amounts, remarks, and pagination
    setAmounts({});
    setRemarks({});
    setCurrentPage(0);
    setShowTable(false);

    // Reset "Select All" checkboxes
    setIsAllSessionsSelected(false);
    setIsAllCoursesSelected(false);
    setIsAllDepartmentsSelected(false);
    setIsAllAcademicYearsSelected(false);
    setIsAllSemestersSelected(false);
    setIsAllSectionsSelected(false);
    setIsAllFeePeriodsSelected(false);
    setIsAllElementsSelected(false);

    // Reset student-related flags
    setSelectedStudent(false);
    setIsAllChecked(false);
  };

  useEffect(() => {
    // fetchFeePeriods();
    fetchFeeElements();
  }, []);

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");

        // get FIRST selected batch, course & department
        const batch_id = Object.keys(selectedSessions).find(
          (id) => selectedSessions[id]
        );
        const course_id = Object.keys(selectedCourses).find(
          (id) => selectedCourses[id]
        );
        const department_id = Object.keys(selectedDepartments).find(
          (id) => selectedDepartments[id]
        );

        if (
          !token ||
          !organization_id ||
          !branch_id ||
          !batch_id ||
          !course_id ||
          !department_id
        ) {
          setPeriods([]);
          return;
        }

        const url = `${ApiUrl.apiurl}Semester/GetSemesterByDepartment/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch periods");
        }

        const data = await response.json();
        console.log("Period API Response:", data);

        // ✅ API returns array directly
        if (Array.isArray(data)) {
          const mappedPeriods = data.map((period) => ({
            id: period.id,
            period_name:
              period.semester_description ||
              period.semester_code ||
              "Unnamed Period",
          }));

          setPeriods(mappedPeriods);

          // initialize checkbox state
          const initialSelection = {};
          mappedPeriods.forEach((p) => {
            initialSelection[p.id] = false;
          });

          setSelectedFeePeriods(initialSelection);
          setIsAllFeePeriodsSelected(false);
        } else {
          setPeriods([]);
        }
      } catch (error) {
        console.error("Error fetching periods:", error);
        setPeriods([]);
      }
    };

    fetchPeriods();
  }, [selectedSessions, selectedCourses, selectedDepartments]);

  const fetchFeeElements = async () => {
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}FeeElementType/GetAllFeeElements/A`
      );
      const result = await response.json();

      if (result.message === "success" && Array.isArray(result.data)) {
        const elements = result.data.map((element) => ({
          id: element.id,
          element_name: element.element_name || "",
          element_description: element.element_description || "",
        }));

        setElements(elements);

        // Initialize all elements as unselected
        const initialSelectedElements = {};
        elements.forEach((element) => {
          initialSelectedElements[element.id] = false;
        });

        setSelectedElements(initialSelectedElements);
      } else {
        console.error("Failed to fetch fee elements:", result.message);
      }
    } catch (error) {
      console.error("Error fetching fee elements:", error);
    }
  };

  const handleAmountChange = (e, element) => {
    setAmounts({
      ...amounts,
      [element]: e.target.value,
    });
  };

  const handleRemarkChange = (e, element) => {
    setRemarks({
      ...remarks,
      [element]: e.target.value,
    });
  };

  // API call to fetch classes
  const handleSearch = async () => {
    const selectedSessionIds = Object.keys(selectedSessions)
      .filter((id) => selectedSessions[id])
      .map(Number);
    const selectedCourseIds = Object.keys(selectedCourses)
      .filter((id) => selectedCourses[id])
      .map(Number);
    const selectedDepartmentIds = Object.keys(selectedDepartments)
      .filter((id) => selectedDepartments[id])
      .map(Number);
    const selectedAcademicYearIds = Object.keys(selectedAcademicYears)
      .filter((id) => selectedAcademicYears[id])
      .map(Number);
    const selectedSemesterIds = Object.keys(selectedSemesters)
      .filter((id) => selectedSemesters[id])
      .map(Number);
    const selectedSectionIds = Object.keys(selectedSections)
      .filter((id) => selectedSections[id])
      .map(Number);

    const organization_id = sessionStorage.getItem("organization_id");
    const branch_id = sessionStorage.getItem("branch_id");

    if (
      !organization_id ||
      !branch_id ||
      selectedSessionIds.length === 0 ||
      selectedCourseIds.length === 0 ||
      selectedDepartmentIds.length === 0 ||
      selectedAcademicYearIds.length === 0 ||
      selectedSemesterIds.length === 0 ||
      selectedSectionIds.length === 0
    ) {
      alert("Please select all required filters before searching.");
      setShowTable(false);
      return;
    }

    try {
      const url = `${ApiUrl.apiurl
        }Filter/GetStudentBasedCourseSection/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${selectedSessionIds.join(
          ","
        )}&course_ids=${selectedCourseIds.join(
          ","
        )}&department_ids=${selectedDepartmentIds.join(
          ","
        )}&academic_year_id=${selectedAcademicYearIds.join(
          ","
        )}&semester_ids=${selectedSemesterIds.join(
          ","
        )}&section_ids=${selectedSectionIds.join(",")}`;

      console.log("Fetching students from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Student API Response:", result);

      if (
        result.message?.toLowerCase() === "success" &&
        Array.isArray(result.data)
      ) {
        setStudents(result.data);
        setCurrentPage(0);
        setShowTable(true);
      } else {
        console.error("Failed to fetch student data:", result.message);
        setShowTable(false);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      alert("An error occurred while fetching student data. Please try again.");
    }
  };

  // const handleSectionChange = (sectionId) => {
  //   setSelectedSections((prevState) => ({
  //     ...prevState,
  //     [sectionId]: !prevState[sectionId], // Toggle selected state for the given section
  //   }));
  // };

  // const handleClear = () => {
  //   console.log("Clear button clicked");
  // };

  const handleShow = () => {
    console.log("Select Student button clicked");
  };

  const handleSelectAllStudents = (event) => {
    const newChecked = event.target.checked;
    setIsAllChecked(newChecked);

    const updatedStudents = students.map((student) => ({
      ...student,
      checked: newChecked, // Set all checkboxes to the same selected state
    }));

    setStudents(updatedStudents); // Update state with the new student list
  };

  const handleCheckboxChange = (student_id) => {
    const updatedStudents = students.map(
      (students) =>
        students.student_id === student_id
          ? { ...students, checked: !students.checked } // Toggle checked state for the specific student
          : students // Keep other students unchanged
    );

    setStudents(updatedStudents); // Update the state with the modified students array
  };

  // const handleSelectAllSections = () => {
  //   const newValue = !isAllSectionsSelected;
  //   setIsAllSectionsSelected(newValue);
  //   const updatedSections = {};
  //   sections.forEach((section) => {
  //     updatedSections[section.id] = newValue; // Set all sections to selected or not
  //   });
  //   setSelectedSections(updatedSections);
  // };
  const handleSelectAllFeePeriods = () => {
    if (isAllFeePeriodsSelected) {
      // Unselect all
      setSelectedFeePeriods({});
      setIsAllFeePeriodsSelected(false);
    } else {
      // Select all using period.id
      const newSelection = {};
      periods.forEach((period) => {
        newSelection[period.id] = true;
      });
      setSelectedFeePeriods(newSelection);
      setIsAllFeePeriodsSelected(true);
    }
  };

  const handleFeePeriodChange = (periodId) => {
    setSelectedFeePeriods((prev) => {
      const updated = { ...prev, [periodId]: !prev[periodId] };

      // Check if all are selected
      const allSelected =
        periods.length > 0 && periods.every((p) => updated[p.id]);
      setIsAllFeePeriodsSelected(allSelected);

      return updated;
    });
  };

  // Handle Select All for Elements (New logic for "Element")
  const handleSelectAllElements = (e) => {
    const isSelected = e.target.checked; // Check if the "Select All" checkbox is selected or not.
    setIsAllElementsSelected(isSelected);

    // Update the selectedElements by element.id, not element_name.
    const updatedElements = elements.reduce((acc, element) => {
      acc[element.id] = isSelected; // Set the checkbox state for each element
      return acc;
    }, {});

    setSelectedElements(updatedElements); // Set the updated selection for all elements
  };

  const handleElementChange = (elementId) => {
    setSelectedElements((prevState) => ({
      ...prevState,
      [elementId]: !prevState[elementId], // Toggle the selection state for the specific element
    }));
  };
  const handleAssign = async () => {
    const selectedStudentIds = students
      .filter((student) => student.checked)
      .map((student) => student.student_id);

    const selectedPeriodIds = Object.keys(selectedFeePeriods)
      .filter((periodId) => selectedFeePeriods[periodId])
      .map((periodId) => parseInt(periodId, 10));

    const feeElementIds = Object.keys(selectedElements)
      .filter((elementId) => selectedElements[elementId])
      .map((elementId) => ({
        element_id: parseInt(elementId, 10),
        amount: amounts[elementId] || "",
        remarks: remarks[elementId] || "",
      }))
      .filter((element) => !isNaN(element.element_id));

    //  Validations
    if (selectedStudentIds.length === 0) {
      alert("Please select at least one student.");
      return;
    }

    if (selectedPeriodIds.length === 0) {
      alert("Please select at least one fee period.");
      return;
    }

    if (feeElementIds.length === 0) {
      alert("Please select at least one fee element.");
      return;
    }

    for (let feeElement of feeElementIds) {
      if (feeElement.amount === "" || isNaN(feeElement.amount)) {
        alert("Amount is missing or invalid for one of the fee elements.");
        return;
      }
      if (feeElement.remarks.trim() === "") {
        alert("Remarks are missing for one of the fee elements.");
        return;
      }
    }

    //  Get created_by from session storage
    const createdBy = sessionStorage.getItem("userId");
    if (!createdBy) {
      alert("User ID not found in session storage. Please log in again.");
      return;
    }

    const assignedData = {
      studentIds: selectedStudentIds,
      periodIds: selectedPeriodIds,
      feeElementIds: feeElementIds,
      created_by: parseInt(createdBy, 10),
    };

    console.log("Payload to API:", assignedData);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Access token not found. Please log in again.");
        return;
      }

      const response = await fetch(`${ApiUrl.apiurl}ADHOC/StudentFeesCreate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(assignedData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Assigned Data Response:", result);
        alert("Adhoc Fees added Successfully");

        // ✅ CLEAR EVERYTHING HERE (ONLY AFTER ASSIGN)
        setStudents([]);
        setShowTable(false);

        setSelectedSessions({});
        setIsAllSessionsSelected(false);

        setSelectedCourses({});
        setIsAllCoursesSelected(false);

        setSelectedDepartments({});
        setIsAllDepartmentsSelected(false);

        setSelectedAcademicYears({});
        setIsAllAcademicYearsSelected(false);

        setSelectedSemesters({});
        setIsAllSemestersSelected(false);

        setSelectedSections({});
        setIsAllSectionsSelected(false);

        setSelectedFeePeriods({});
        setSelectedElements({});
        setAmounts({});
        setRemarks({});

      } else {
        console.error("Failed to assign data:", result);
        alert(result.message || "An error occurred while assigning data.");
      }
    } catch (error) {
      console.error("Error while assigning data:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div
      className="container-fluid"
      style={{
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "15px",
        marginTop: "10px",
        width: "98%",
        height: "100%",
        backgroundColor: "rgba(55, 123, 241, 0.1)",
      }}
    >
      {/* Header Section */}
      <div
        className="header-container"
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        <h2 style={{ fontSize: "24px", color: "#333" }}>ADHOC FEES</h2>
      </div>

      {/* Buttons Section */}
      <div className="row mb-3 mt-3 mx-0">
        <div className="col-12 d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-primary me-2"
            style={{
              width: "150px",
            }}
            onClick={handleAssign}
          >
            Assign
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
            className="btn btn-secondary"
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

      {/* Sections: Class, Section, Fee Period, Element */}
      <div
        className="fee-collection-container mx-2"
        style={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          marginTop: "10px",
          display: "flex",
          flexWrap: "wrap",
          overflowX: "auto",
          background: "white",
        }}
      >
        <div
          className="fee-collection-class col-small"
          style={{ flex: "1 1 200px", margin: "10px" }}
        >
          <span>Session</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <input
              type="checkbox"
              id="select-all-sessions"
              checked={isAllSessionsSelected}
              onChange={handleSelectAllSessions}
              style={{ cursor: "pointer" }}
            />
            <label
              htmlFor="select-all-classes"
              style={{
                marginLeft: "5px",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              Select All Sessions
            </label>
          </div>
          <div
            className="section-content"
            style={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {sessions.map((session) => (
              <div
                key={session.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <input
                  type="checkbox"
                  id={`session-${session.id}`}
                  checked={selectedSessions[session.id] || false}
                  onChange={() => handleSessionChange(session.id)}
                  style={{ cursor: "pointer" }}
                />
                <label
                  htmlFor={`session-${session.id}`}
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  {session.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div
          className="fee-collection-class col-small"
          style={{ flex: "1 1 200px", margin: "10px" }}
        >
          <span>Course</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <input
              type="checkbox"
              id="select-all-courses"
              checked={isAllCoursesSelected}
              onChange={handleSelectAllCourses}
              style={{ cursor: "pointer" }}
            />
            <label
              htmlFor="select-all-courses"
              style={{
                marginLeft: "5px",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              Select All Courses
            </label>
          </div>
          <div
            className="section-content"
            style={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {courses.map((course) => (
              <div
                key={course.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <input
                  type="checkbox"
                  id={`course-${course.id}`}
                  checked={selectedCourses[course.id] || false}
                  onChange={() => handleCourseChange(course.id)}
                  style={{ cursor: "pointer" }}
                />
                <label
                  htmlFor={`course-${course.id}`}
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  {course.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div
          className="fee-collection-class col-small"
          style={{ flex: "1 1 200px", margin: "10px" }}
        >
          <span>Department</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <input
              type="checkbox"
              id="select-all-departments"
              checked={isAllDepartmentsSelected}
              onChange={handleSelectAllDepartments}
              style={{ cursor: "pointer" }}
            />
            <label
              htmlFor="select-all-departments"
              style={{
                marginLeft: "5px",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              Select All Departments
            </label>
          </div>
          <div
            className="section-content"
            style={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {departments.map((dep) => (
              <div
                key={dep.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <input
                  type="checkbox"
                  id={`dep-${dep.id}`}
                  checked={selectedDepartments[dep.id] || false}
                  onChange={() => handleDepartmentChange(dep.id)}
                  style={{ cursor: "pointer" }}
                />
                <label
                  htmlFor={`dep-${dep.id}`}
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  {dep.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div
          className="fee-collection-class col-small"
          style={{ flex: "1 1 200px", margin: "10px" }}
        >
          <span>Academic year</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <input
              type="checkbox"
              id="select-all-academic-years"
              checked={isAllAcademicYearsSelected}
              onChange={handleSelectAllAcademicYears}
              style={{ cursor: "pointer" }}
            />
            <label
              htmlFor="select-all-academic-years"
              style={{
                marginLeft: "5px",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              Select All Academic Years
            </label>
          </div>
          <div
            className="section-content"
            style={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {academicYears.map((year) => (
              <div
                key={year.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <input
                  type="checkbox"
                  id={`year-${year.id}`}
                  checked={selectedAcademicYears[year.id] || false}
                  onChange={() => handleAcademicYearChange(year.id)}
                  style={{ cursor: "pointer" }}
                />
                <label
                  htmlFor={`year-${year.id}`}
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  {year.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div
          className="fee-collection-class col-small"
          style={{ flex: "1 1 200px", margin: "10px" }}
        >
          <span>Semester</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <input
              type="checkbox"
              id="select-all-semesters"
              checked={isAllSemestersSelected}
              onChange={handleSelectAllSemesters}
              style={{ cursor: "pointer" }}
            />
            <label
              htmlFor="select-all-semesters"
              style={{
                marginLeft: "5px",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              Select All semesters
            </label>
          </div>
          <div
            className="section-content"
            style={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {semesters.map((sem) => (
              <div
                key={sem.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <input
                  type="checkbox"
                  id={`semester-${sem.id}`}
                  checked={selectedSemesters[sem.id] || false}
                  onChange={() => handleSemesterChange(sem.id)}
                  style={{ cursor: "pointer" }}
                />
                <label
                  htmlFor={`semester-${sem.id}`}
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  {sem.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div
          className="fee-collection-sections col-small"
          style={{ flex: "1 1 200px", margin: "10px" }}
        >
          <span>Sections</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <input
              type="checkbox"
              id="select-all-sections"
              checked={isAllSectionsSelected}
              onChange={handleSelectAllSections}
              style={{ cursor: "pointer" }}
            />
            <label
              htmlFor="select-all-sections"
              style={{
                marginLeft: "5px",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              Select All Sections
            </label>
          </div>
          <div
            className="section-content"
            style={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {sections.map((section) => (
              <div
                key={section.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <input
                  type="checkbox"
                  id={`section-${section.id}`}
                  checked={selectedSections[section.id] || false}
                  onChange={() => handleSectionChange(section.id)}
                  style={{ cursor: "pointer" }}
                />
                <label
                  htmlFor={`section-${section.id}`}
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  {section.sectionname}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div
          className="fee-collection-period col-small"
          style={{ flex: "1 1 200px", margin: "10px" }}
        >
          <span>Fee Period</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <input
              type="checkbox"
              id="select-all-fee-periods"
              checked={isAllFeePeriodsSelected}
              onChange={handleSelectAllFeePeriods}
              style={{ cursor: "pointer" }}
            />
            <label
              htmlFor="select-all-fee-periods"
              style={{
                marginLeft: "5px",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              Select All Fee Periods
            </label>
          </div>
          <div
            className="section-content"
            style={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {periods.map((period) => (
              <div
                key={period.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <input
                  type="checkbox"
                  id={`fee-period-${period.id}`}
                  checked={selectedFeePeriods[period.id] || false}
                  onChange={() => handleFeePeriodChange(period.id)}
                  style={{ cursor: "pointer" }}
                />
                <label
                  htmlFor={`fee-period-${period.id}`}
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  {period.period_name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div
          className="fee-collection-element col-large"
          style={{ flex: "1 1 400px", margin: "10px", overflowX: "auto" }}
        >
          <span>Element</span>
          <div className="element-content">
            <table className="table table-bordered" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={isAllElementsSelected}
                      onChange={handleSelectAllElements}
                    />
                  </th>
                  <th>Element Name</th>
                  <th>Amount</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {elements.map((element) => (
                  <tr key={element.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedElements[element.id] || false}
                        onChange={() => handleElementChange(element.id)}
                      />
                    </td>
                    <td>{element.element_name}</td>
                    <td>
                      <input
                        type="number"
                        value={amounts[element.id] || ""}
                        onChange={(e) => handleAmountChange(e, element.id)}
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={remarks[element.id] || ""}
                        onChange={(e) => handleRemarkChange(e, element.id)}
                        style={{ width: "100%" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        {showTable && students.length > 0 ? (
          <table className=" table  table-bordered">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={isAllChecked}
                    onChange={handleSelectAllStudents}
                  />
                </th>
                <th>Course Name</th>
                <th>Branch</th>
                <th>Name</th>
                <th>Academic Year</th>
                <th>Semester</th>
                <th>Section</th>
                <th>Admission Number</th>
                <th>Father Name</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.student_id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={student.checked || false}
                      onChange={() =>
                        handleCheckboxChange(student.student_id)
                      }
                    />
                  </td>
                  <td>{student.course_name}</td>
                  <td>{student.department}</td>
                  <td>{student.student_name}</td>
                  <td>{student.academic_year}</td>
                  <td>{student.semester}</td>
                  <td>{student.section}</td>
                  <td>{student.college_admission_no}</td>
                  <td>{student.father_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          showTable && <p>No data available </p>
        )}
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

    </div>
  );
};
export default AdmADHOCFee;