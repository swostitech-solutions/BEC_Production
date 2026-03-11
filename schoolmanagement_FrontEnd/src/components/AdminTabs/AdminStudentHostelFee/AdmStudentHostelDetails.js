import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
// import SelectStudentFeeModal from "../FeeStudentModal/SelectStudentFeeModal";
// import ModalClass from "../AdminStudentClass/ModalClass";
import ModalHostel from "./ModalHostel";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import HostelDetailsEdit from "../AdminStudentHostelFee/HostelDetailsEdit";
import ReactPaginate from "react-paginate";

const AdmStudentHostelDetails = () => {
  const token = localStorage.getItem("accessToken");
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
  const [transportData, setTransportData] = useState([]);
  const [studentTransportDetails, setStudentTransportDetails] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [hostelList, setHostelList] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [blockOptions, setBlockOptions] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [floorList, setFloorList] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [roomList, setRoomList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bedList, setBedList] = useState([]);
  const [selectedBed, setSelectedBed] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudentAcademic, setSelectedStudentAcademic] = useState(null);

  const openStudentModal = () => {
    setShowStudentModal(true);
  };

  const closeStudentModal = () => {
    setShowStudentModal(false);
  };

  const handleClear = () => {
    setStudentName("");
    setStudentId("");
    setSelectedStudentAcademic(null);

    setSelectedSession(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);

    setSelectedHostel(null);
    setSelectedBlock(null);
    setSelectedFloor(null);
    setSelectedRoomType(null);
    setSelectedRoom(null);
    setSelectedBed(null);

    setTransportData([]);
  };

  // Slice data for pagination
  const offset = currentPage * itemsPerPage;
  const currentData = transportData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(transportData.length / itemsPerPage);

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSelectStudent = (data) => {
    const student = data.studentBasicDetails;
    const academic = data.academicDetails;

    const fullName = [student.first_name].filter(Boolean).join(" ");

    setStudentId(student.id);
    setStudentName(fullName);

    // save academic detail separately
    setSelectedStudentAcademic(academic);

    closeStudentModal();
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // get token from local storage
        const branch_id = sessionStorage.getItem("branch_id"); // get branch ID from session storage
        const organization_id = sessionStorage.getItem("organization_id"); // get organization ID from session storage

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
              Authorization: `Bearer ${token}`, // attach token
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const sessionOptions = data.map((item) => ({
            value: item.id,
            label: item.batch_description, // display "2025-2028"
          }));
          setSessions(sessionOptions); // store mapped data in state
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
    const fetchCourses = async () => {
      // If no session is selected, clear the course list and return
      if (!selectedSession?.value) {
        setCourses([]);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value; // Get selected session’s batch_id

        if (!organization_id || !branch_id || !batch_id) {
          console.warn("Missing required parameters:", {
            organization_id,
            branch_id,
            batch_id,
          });
          return;
        }

        console.log(
          `Fetching courses for organization_id=${organization_id}, branch_id=${branch_id}, batch_id=${batch_id}`
        );

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

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const courseOptions = data.map((item) => ({
            value: item.id,
            label: item.course_name,
          }));

          setCourses(courseOptions);
          console.log("Fetched course list successfully:", courseOptions);
        } else {
          console.error("Unexpected API response format:", data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [selectedSession]);

  useEffect(() => {
    const fetchDepartments = async () => {
      // Only call API when both session and course are selected
      if (!selectedSession?.value || !selectedCourse?.value) {
        setDepartments([]);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value; //  batch_id from selected session
        const course_id = selectedCourse.value; //  course_id from selected course

        // Validation
        if (!token || !organization_id || !branch_id) {
          console.warn("Missing required identifiers:", {
            token: !!token,
            organization_id,
            branch_id,
          });
          return;
        }

        console.log(
          `Fetching departments for organization_id=${organization_id}, branch_id=${branch_id}, batch_id=${batch_id}, course_id=${course_id}`
        );

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

        // Map department data
        if (Array.isArray(result)) {
          // Some APIs return raw arrays (no "message" or "data" field)
          const departmentOptions = result.map((item) => ({
            value: item.id || item.department_id,
            label:
              item.department_name ||
              item.description ||
              item.department_description ||
              "Unnamed Department",
          }));
          setDepartments(departmentOptions);
          console.log("Mapped departments:", departmentOptions);
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          const departmentOptions = result.data.map((item) => ({
            value: item.id || item.department_id,
            label:
              item.department_name ||
              item.description ||
              item.department_description ||
              "Unnamed Department",
          }));
          setDepartments(departmentOptions);
          console.log("Mapped departments:", departmentOptions);
        } else {
          console.warn("Unexpected API format:", result);
          setDepartments([]);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, [selectedSession, selectedCourse]);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      // Only call API when session, course, and department are selected
      if (
        !selectedSession?.value ||
        !selectedCourse?.value ||
        !selectedDepartment?.value
      ) {
        setAcademicYears([]);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value; // from session dropdown
        const course_id = selectedCourse.value; // from course dropdown
        const department_id = selectedDepartment.value; // from department dropdown

        //  Validation
        if (!token || !organization_id || !branch_id) {
          console.warn("Missing required parameters:", {
            token: !!token,
            organization_id,
            branch_id,
          });
          return;
        }

        //  Construct correct API URL
        const url = `${ApiUrl.apiurl}AcademicYear/GetAcademicYear/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}`;
        console.log("Fetching Academic Years from:", url);

        //  Fetch data
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

        //  Handle both possible response formats
        if (Array.isArray(result)) {
          const options = result.map((item) => ({
            value: item.id || item.academic_year_id,
            label:
              item.academic_year_description ||
              item.academic_year_code ||
              "Unnamed Year",
          }));
          setAcademicYears(options);
          console.log("Mapped academic years:", options);
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          const options = result.data.map((item) => ({
            value: item.id || item.academic_year_id,
            label:
              item.academic_year_description ||
              item.academic_year_code ||
              "Unnamed Year",
          }));
          setAcademicYears(options);
          console.log("Mapped academic years:", options);
        } else {
          console.warn("Unexpected API format:", result);
          setAcademicYears([]);
        }
      } catch (error) {
        console.error("Error fetching academic years:", error);
        setAcademicYears([]);
      }
    };

    fetchAcademicYears();
  }, [selectedSession, selectedCourse, selectedDepartment]);

  useEffect(() => {
    const fetchSemesters = async () => {
      // Only call API when session, course, department, and academic year are selected
      if (
        !selectedSession?.value ||
        !selectedCourse?.value ||
        !selectedDepartment?.value ||
        !selectedAcademicYear?.value
      ) {
        setSemesters([]);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value;
        const course_id = selectedCourse.value;
        const department_id = selectedDepartment.value;
        const academic_year_id = selectedAcademicYear.value;

        //  Validation
        if (!token || !organization_id || !branch_id) {
          console.warn("Missing required identifiers:", {
            token: !!token,
            organization_id,
            branch_id,
          });
          return;
        }

        //  Correct API endpoint
        const url = `${ApiUrl.apiurl}Semester/GetSemester/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}&academic_year_id=${academic_year_id}`;
        console.log("Fetching Semesters from:", url);

        //  Fetch data
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
        console.log("Semester API Response:", result);

        //  Handle both response formats (array or { message: 'Success', data: [...] })
        if (Array.isArray(result)) {
          const options = result.map((item) => ({
            value: item.id || item.semester_id,
            label:
              item.semester_description ||
              item.semester_code ||
              "Unnamed Semester",
          }));
          setSemesters(options);
          console.log("Mapped Semesters:", options);
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          const options = result.data.map((item) => ({
            value: item.id || item.semester_id,
            label:
              item.semester_description ||
              item.semester_code ||
              "Unnamed Semester",
          }));
          setSemesters(options);
          console.log("Mapped Semesters:", options);
        } else {
          console.warn("Unexpected API format:", result);
          setSemesters([]);
        }
      } catch (error) {
        console.error("Error fetching semesters:", error);
        setSemesters([]);
      }
    };

    fetchSemesters();
  }, [
    selectedSession,
    selectedCourse,
    selectedDepartment,
    selectedAcademicYear,
  ]);

  useEffect(() => {
    const fetchSections = async () => {
      // Only call API when all required dropdowns are selected
      if (
        !selectedSession?.value ||
        !selectedCourse?.value ||
        !selectedDepartment?.value ||
        !selectedAcademicYear?.value ||
        !selectedSemester?.value
      ) {
        setSections([]); // clear section list when dependencies are missing
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const batch_id = selectedSession.value;
        const course_id = selectedCourse.value;
        const department_id = selectedDepartment.value;
        const academic_year_id = selectedAcademicYear.value;
        const semester_id = selectedSemester.value;

        //  Validation
        if (!token || !organization_id || !branch_id) {
          console.warn("Missing required identifiers:", {
            token: !!token,
            organization_id,
            branch_id,
          });
          return;
        }

        //  Construct API URL
        const url = `${ApiUrl.apiurl}Section/GetSection/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}&academic_year_id=${academic_year_id}&semester_id=${semester_id}`;
        console.log("Fetching Sections from:", url);

        //  Fetch data
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, //  Pass auth token
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

        //  Handle both response types (array or object with data)
        if (Array.isArray(result)) {
          const sectionOptions = result.map((item) => ({
            value: item.id || item.section_id,
            label:
              item.section_name ||
              item.section_description ||
              "Unnamed Section",
          }));
          setSections(sectionOptions);
          console.log("Mapped Sections:", sectionOptions);
        } else if (result.message === "Success" && Array.isArray(result.data)) {
          const sectionOptions = result.data.map((item) => ({
            value: item.id || item.section_id,
            label:
              item.section_name ||
              item.section_description ||
              "Unnamed Section",
          }));
          setSections(sectionOptions);
          console.log("Mapped Sections:", sectionOptions);
        } else {
          console.warn("Unexpected API format:", result);
          setSections([]);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        setSections([]);
      }
    };

    fetchSections();
  }, [
    selectedSession,
    selectedCourse,
    selectedDepartment,
    selectedAcademicYear,
    selectedSemester,
  ]);

  const handleSessionChange = (selectedOption) => {
    setSelectedSessionId(selectedOption.value);
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const orgId = localStorage.getItem("orgId");
        const branchId = localStorage.getItem("branchId");

        if (!orgId || !branchId) {
          console.error("Missing orgId or branchId in local storage");
          return;
        }

        const response = await fetch(
          `/api/Transport/routemasterlist/${orgId}/${branchId}/`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch routes");
        }

        const data = await response.json();
        const options = data.map((route) => ({
          value: route.id,
          label: route.transport_name,
        }));

        setRoutes(options);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    fetchRoutes();
  }, []);

  useEffect(() => {
    const fetchHostelList = async () => {
      try {
        const organization_id = sessionStorage.getItem("organization_id") || 1;
        const branch_id = sessionStorage.getItem("branch_id") || 1;

        const url = `${ApiUrl.apiurl}HOSTEL/GetHostelList/?organization_id=${organization_id}&branch_id=${branch_id}`;
        // const response = await fetch(url);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedHostels = data.map((item) => ({
            value: item.id,
            label: item.hostel_name,
          }));
          setHostelList(formattedHostels);
        }
      } catch (error) {
        console.error("Error fetching hostel list:", error);
      }
    };

    fetchHostelList();
  }, []);

  useEffect(() => {
    const fetchHostelBlockList = async () => {
      if (!selectedHostel?.value) {
        setBlockOptions([]);
        setSelectedBlock(null);
        return;
      }

      try {
        const organization_id = sessionStorage.getItem("organization_id") || 1;
        const branch_id = sessionStorage.getItem("branch_id") || 1;
        const hostel_id = selectedHostel.value;

        const url = `${ApiUrl.apiurl}HOSTEL/GetHostelBlockList/?organization_id=${organization_id}&branch_id=${branch_id}&hostel_id=${hostel_id}`;

        // const response = await fetch(url);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedOptions = data.map((item) => ({
            value: item.id,
            label: item.block_name,
          }));
          setBlockOptions(formattedOptions);
        } else {
          setBlockOptions([]);
        }
      } catch (error) {
        console.error("Error fetching block list:", error);
        setBlockOptions([]);
      }
    };

    fetchHostelBlockList();
  }, [selectedHostel]);

  useEffect(() => {
    const fetchFloors = async () => {
      if (!selectedBlock?.value || !selectedHostel?.value) {
        setFloorList([]);
        setSelectedFloor(null);
        return;
      }

      try {
        const organization_id = sessionStorage.getItem("organization_id") || 1;
        const branch_id = sessionStorage.getItem("branch_id") || 1;
        const hostel_id = selectedHostel.value;
        const hostel_block_id = selectedBlock.value;

        const url = `${ApiUrl.apiurl}HOSTEL/GetHostelBlockFloorList/?organization_id=${organization_id}&branch_id=${branch_id}&hostel_id=${hostel_id}&hostel_block_id=${hostel_block_id}`;

        // const response = await fetch(url);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!Array.isArray(data)) {
          setFloorList([]);
          return;
        }

        const formatted = data.map((floor) => ({
          value: floor.id,
          label: floor.floor_number,
        }));

        setFloorList(formatted);
      } catch (error) {
        console.error("Error fetching floors:", error);
        setFloorList([]);
      }
    };

    fetchFloors();
  }, [selectedHostel, selectedBlock]);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      if (!selectedFloor?.value || !selectedHostel?.value) {
        setRoomTypes([]);
        setSelectedRoomType(null);
        return;
      }

      try {
        const organization_id = sessionStorage.getItem("organization_id") || 1;
        const branch_id = sessionStorage.getItem("branch_id") || 1;
        const hostel_id = selectedHostel.value;

        const response = await fetch(
          `${ApiUrl.apiurl}HOSTEL/GetHostelRoomTypeList/?organization_id=${organization_id}&branch_id=${branch_id}&hostel_id=${hostel_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (Array.isArray(result)) {
          const formattedRoomTypes = result.map((item) => ({
            value: item.id,
            label: item.room_type, // AC / Non-AC
          }));
          setRoomTypes(formattedRoomTypes);
        } else {
          setRoomTypes([]);
        }
      } catch (error) {
        console.error("Error fetching Room Types:", error);
        setRoomTypes([]);
      }
    };

    fetchRoomTypes();
  }, [selectedHostel, selectedFloor]);

  useEffect(() => {
    if (
      !selectedHostel?.value ||
      !selectedBlock?.value ||
      !selectedFloor?.value ||
      !selectedRoomType?.value
    ) {
      setRoomList([]);
      return;
    }

    const fetchRoomNumbers = async () => {
      try {
        const organization_id = sessionStorage.getItem("organization_id") || 1;
        const branch_id = sessionStorage.getItem("branch_id") || 1;

        const hostel_id = selectedHostel.value;
        const hostel_block_id = selectedBlock.value;
        const hostel_block_floor_id = selectedFloor.value;
        const room_type_id = selectedRoomType.value;

        const url = `${ApiUrl.apiurl}HOSTEL/GetHostelRoomList/?organization_id=${organization_id}&branch_id=${branch_id}&hostel_id=${hostel_id}&hostel_block_id=${hostel_block_id}&hostel_block_floor_id=${hostel_block_floor_id}&room_type_id=${room_type_id}`;

        // const response = await fetch(url);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedRooms = data.map((item) => ({
            value: item.id,
            label: item.room_number,
          }));
          setRoomList(formattedRooms);
        } else {
          setRoomList([]);
        }
      } catch (error) {
        console.error("Error fetching room list:", error);
        setRoomList([]);
      }
    };

    fetchRoomNumbers();
  }, [selectedHostel, selectedBlock, selectedFloor, selectedRoomType]);

  useEffect(() => {
    const fetchBedList = async () => {
      if (
        !selectedHostel?.value ||
        !selectedBlock?.value ||
        !selectedFloor?.value ||
        !selectedRoomType?.value ||
        !selectedRoom?.value
      ) {
        setBedList([]);
        return;
      }

      try {
        const organization_id = sessionStorage.getItem("organization_id") || 1;
        const branch_id = sessionStorage.getItem("branch_id") || 1;

        const hostel_id = selectedHostel.value;
        const hostel_block_id = selectedBlock.value;
        const hostel_block_floor_id = selectedFloor.value;
        const room_type_id = selectedRoomType.value;
        const room_id = selectedRoom.value;

        const url = `${ApiUrl.apiurl}HOSTEL/GetHostelRoomBedList/?organization_id=${organization_id}&branch_id=${branch_id}&hostel_id=${hostel_id}&hostel_block_id=${hostel_block_id}&hostel_block_floor_id=${hostel_block_floor_id}&room_type_id=${room_type_id}&room_id=${room_id}`;

        // const response = await fetch(url);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedBeds = data.map((item) => ({
            value: item.id,
            label: item.bed_number, // BB-1, BB-2
            isAvailable: item.is_available,
          }));
          setBedList(formattedBeds);
        } else {
          setBedList([]);
        }
      } catch (error) {
        console.error("Error fetching bed list:", error);
        setBedList([]);
      }
    };

    fetchBedList();
  }, [
    selectedHostel,
    selectedBlock,
    selectedFloor,
    selectedRoomType,
    selectedRoom,
  ]);

  useEffect(() => {
    if (!selectedStudentAcademic) return;

    setSelectedSession(
      sessions.find((x) => x.value === selectedStudentAcademic.batch_id) || null
    );
    setSelectedCourse(
      courses.find((x) => x.value === selectedStudentAcademic.course_id) || null
    );
    setSelectedDepartment(
      departments.find(
        (x) => x.value === selectedStudentAcademic.department_id
      ) || null
    );
    setSelectedAcademicYear(
      academicYears.find(
        (x) => x.value === selectedStudentAcademic.academic_year_id
      ) || null
    );
    setSelectedSemester(
      semesters.find((x) => x.value === selectedStudentAcademic.semester_id) ||
        null
    );
    setSelectedSection(
      sections.find((x) => x.value === selectedStudentAcademic.section_id) ||
        null
    );
  }, [
    sessions,
    courses,
    departments,
    academicYears,
    semesters,
    sections,
    selectedStudentAcademic,
  ]);

  const handleSearch = async () => {
    try {
      const organization_id = sessionStorage.getItem("organization_id") || 1;
      const branch_id = sessionStorage.getItem("branch_id") || 1;

      const params = {
        organization_id,
        branch_id,
        student_name: studentName || "",
        session_id: selectedSession?.value || "",
        course_id: selectedCourse?.value || "",
        department_id: selectedDepartment?.value || "",
        academic_year_id: selectedAcademicYear?.value || "",
        semester_id: selectedSemester?.value || "",
        section_id: selectedSection?.value || "",
        hostel_id: selectedHostel?.value || "",
        hostel_block_id: selectedBlock?.value || "",
        floor_no: selectedFloor?.value || "",
        room_type_id: selectedRoomType?.value || "",
        room_id: selectedRoom?.value || "",
        bed_id: selectedBed?.value || "",
        // college_admission_no: selectedStudent?.admissionNo || ""
      };

      const queryString = Object.keys(params)
        .map(
          (key) =>
            `${key}=${encodeURIComponent(params[key]).replace(/%20/g, "+")}`
        )
        .join("&");

      const url = `${ApiUrl.apiurl}HOSTEL/GetStudentHostelList/?${queryString}`;
      console.log("Final API:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ TOKEN PASSED HERE
        },
      });

      const result = await response.json();

      if (result.message === "success") {
        setTransportData(result.data);
      } else {
        setTransportData([]);
      }
    } catch (error) {
      console.error("Error fetching hostel data:", error);
    }
  };

  const handleOpenModal = async (student) => {
    setShowModal(true);

    try {
      const organization_id = sessionStorage.getItem("organization_id") || 1;
      const branch_id = sessionStorage.getItem("branch_id") || 1;

      const response = await fetch(
        `${ApiUrl.apiurl}HOSTEL/HostelDetailsRetrieveByStudent/?organization_id=${organization_id}&branch_id=${branch_id}&student_id=${student.student_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ TOKEN PASSED
          },
        }
      );

      const result = await response.json();

      if (result.message === "success") {
        const d = result.data;

        setStudentId(student.student_id);
        // setStudentName(d.student_name);

        setSelectedHostel(null);
        setSelectedBlock(null);
        setSelectedFloor(null);
        setSelectedRoomType(null);
        setSelectedRoom(null);
        setSelectedBed(null);

        // Just store data for modal use
        setSelectedStudent(result.data);
        setStudentTransportDetails(result.data);
      } else {
        setStudentTransportDetails(null);
      }
    } catch (error) {
      console.error("Error fetching student hostel details:", error);
      setStudentTransportDetails(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setStudentTransportDetails(null);
  };

  useEffect(() => {
    handleSearch();
  }, []);

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
                STUDENT HOSTEL DETAILS
              </p>
              <div className="row mb-2 mt-3 mx-0">
                <div className="col-12  d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={() => navigate("/admin/student-hostel-create")}
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

              <div className="row mt-3 mx-2 mt-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mb-3 mt-3">
                      <div className="col-12 col-md-3 ">
                        <label htmlFor="student-name" className="form-label">
                          Student Name
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            className="form-control detail"
                            placeholder="Enter student name"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn btn-primary ms-2 mb-0 mt-0"
                            onClick={openStudentModal}
                            style={{ width: "50px", padding: "3px" }}
                          >
                            ...
                          </button>
                        </div>
                      </div>

                      <ModalHostel
                        show={showStudentModal}
                        handleClose={closeStudentModal}
                        onSelectStudent={handleSelectStudent}
                      />
                      {/* Session */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="session" className="form-label">
                          Session
                        </label>
                        <Select
                          id="session"
                          options={sessions}
                          className="detail"
                          value={selectedSession}
                          placeholder="Select Session"
                          classNamePrefix="react-select"
                          onChange={(selectedOption) => {
                            setSelectedSession(selectedOption);
                            handleSessionChange(selectedOption);
                          }}
                        />
                      </div>
                      {/* Course */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="admitted-course" className="form-label">
                          Course
                        </label>
                        <Select
                          className="detail"
                          id="admitted-course"
                          options={courses}
                          value={selectedCourse}
                          onChange={setSelectedCourse}
                          placeholder="Select Course"
                        />
                      </div>
                      {/* Branch */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="branch" className="form-label">
                          Branch
                        </label>
                        <Select
                          id="department"
                          className="detail"
                          options={departments}
                          value={selectedDepartment}
                          onChange={setSelectedDepartment}
                          placeholder="Select Department"
                        />
                      </div>
                      {/* Academic Year */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="session" className="form-label">
                          Academic Year
                        </label>

                        <Select
                          id="academic-year"
                          className="detail"
                          placeholder="Select Academic Year"
                          classNamePrefix="react-select"
                          options={academicYears}
                          value={selectedAcademicYear}
                          onChange={(option) => setSelectedAcademicYear(option)}
                        />
                      </div>
                      {/* Semester */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="semester" className="form-label">
                          Semester
                        </label>
                        <Select
                          id="semester"
                          className="detail"
                          placeholder="Select Semester"
                          classNamePrefix="react-select"
                          options={semesters}
                          value={selectedSemester}
                          onChange={(option) => setSelectedSemester(option)}
                        />
                      </div>
                      {/* Section */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="section" className="form-label">
                          Section
                        </label>
                        <Select
                          id="section"
                          className="detail"
                          options={sections}
                          value={selectedSection}
                          onChange={setSelectedSection}
                          placeholder="Select Section"
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="hostel" className="form-label">
                          Hostel Name
                        </label>
                        <Select
                          id="hostel"
                          className="detail"
                          options={hostelList}
                          value={selectedHostel}
                          onChange={(option) => {
                            setSelectedHostel(option);
                            setSelectedBlock(null);
                            setSelectedFloor(null);
                            setSelectedRoomType(null);
                            setSelectedRoom(null);
                            setSelectedBed(null);

                            setBlockOptions([]);
                            setFloorList([]);
                            setRoomTypes([]);
                            setRoomList([]);
                            setBedList([]);
                          }}
                          placeholder="Select Hostel"
                        />
                      </div>
                      {/* Hostel Block */}
                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="hostel-block" className="form-label">
                          Hostel Block
                        </label>
                        <Select
                          id="hostel-block"
                          className="detail"
                          placeholder="Select Block"
                          options={blockOptions}
                          value={selectedBlock}
                          onChange={(option) => {
                            setSelectedBlock(option);
                            setSelectedFloor(null);
                            setSelectedRoomType(null);
                            setSelectedRoom(null);
                            setSelectedBed(null);
                            setFloorList([]);
                            setRoomTypes([]);
                            setRoomList([]);
                            setBedList([]);
                          }}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-3">
                        <label className="form-label">Floor No</label>
                        <Select
                          className="detail"
                          placeholder="Select Floor"
                          options={floorList}
                          value={selectedFloor}
                          onChange={(option) => {
                            setSelectedFloor(option);
                            setSelectedRoomType(null);
                            setSelectedRoom(null);
                            setSelectedBed(null);
                            setRoomTypes([]);
                            setRoomList([]);
                            setBedList([]);
                          }}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-3">
                        <label className="form-label">Room Type</label>
                        <Select
                          className="detail"
                          placeholder="Select Room Type"
                          options={roomTypes}
                          value={selectedRoomType}
                          onChange={(option) => {
                            setSelectedRoomType(option);
                            setSelectedRoom(null);
                            setSelectedBed(null);
                            setRoomList([]);
                            setBedList([]);
                          }}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label className="form-label">Room No</label>
                        <Select
                          className="detail"
                          options={roomList}
                          value={selectedRoom}
                          onChange={(option) => {
                            setSelectedRoom(option);
                            setSelectedBed(null);
                            setBedList([]);
                          }}
                          placeholder="Select Room"
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="section" className="form-label">
                          Bed No.
                        </label>
                        <Select
                          id="BedNo"
                          className="detail"
                          placeholder="Select Bed No"
                          options={bedList}
                          value={selectedBed}
                          onChange={(option) => setSelectedBed(option)}
                          getOptionLabel={(option) =>
                            option.isAvailable
                              ? `${option.label}`
                              : `${option.label} (Not Available)`
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Student Name</th>
                        <th>ONMRC Registration No</th>
                        <th>Admission No</th>
                        <th>Barcode</th>
                        <th>Session</th>
                        <th>Course</th>
                        <th>Department</th>
                        <th>Academic Year</th>
                        <th>Semester</th>
                        <th>Section</th>
                        <th>Hostel Name</th>
                        <th>Block</th>
                        <th>Floor No</th>
                        <th>Room Type</th>
                        <th>Room No</th>
                        <th>Bed No</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.length > 0 ? (
                        currentData.map((student, index) => (
                          <tr key={student.student_id}>
                            <td>{offset + index + 1}</td>
                            <td>{student.student_name}</td>
                            <td>{student.registration_no}</td>
                            <td>{student.college_admission_no || "N/A"}</td>
                            <td>{student.barcode || "N/A"}</td>
                            <td>{student.batch}</td>
                            <td>{student.course_name}</td>
                            <td>{student.department_name}</td>
                            <td>{student.academic_year_code}</td>
                            <td>{student.semester_name || "N/A"}</td>
                            <td>{student.section_name}</td>
                            <td>{student.hostel_name}</td>
                            <td>{student.hostel_block_name}</td>
                            <td>{student.hostel_floor_number}</td>
                            <td>{student.hostel_room_type_name}</td>
                            <td>{student.hostel_room_number}</td>
                            <td>{student.hostel_bed_number}</td>
                            <td>
                              <a
                                href="#"
                                onClick={() => handleOpenModal(student)}
                                className="text-primary text-decoration-none"
                              >
                                Edit
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="17" className="text-center">
                            No Data Available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <HostelDetailsEdit
                    show={showModal}
                    handleClose={handleCloseModal}
                    studentData={studentTransportDetails}
                    transportDetails={studentTransportDetails}
                    routes={routes}
                    onUpdate={handleSearch}
                  />
                  {transportData.length > itemsPerPage && (
                    <ReactPaginate
                      previousLabel="Previous"
                      nextLabel="Next"
                      breakLabel="..."
                      pageCount={pageCount}
                      onPageChange={handlePageClick}
                      forcePage={currentPage}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      containerClassName="pagination justify-content-center mt-3"
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      nextClassName="page-item"
                      nextLinkClassName="page-link"
                      activeClassName="active"
                      breakClassName="page-item"
                      breakLinkClassName="page-link"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmStudentHostelDetails;
