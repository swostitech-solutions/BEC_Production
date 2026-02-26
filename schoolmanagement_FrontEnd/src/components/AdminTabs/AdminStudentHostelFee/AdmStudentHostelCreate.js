import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
// import SelectStudentFeeModal from "../FeeStudentModal/SelectStudentFeeModal";
// import ModalClass from "../AdminStudentClass/ModalClass";
import ModalHostel from "./ModalHostel";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import HostelEdit from "../AdminStudentHostelFee/HostelEdit";
import ReactPaginate from "react-paginate";

const AdmStudentHostelCreate = () => {
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
  const [hostelAvailed, setHostelAvailed] = useState(false);
  const [sectionId, setSectionId] = useState(null);
  const [classId, setClassId] = useState(null);
  //  const [classOptions, setClassOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [transportData, setTransportData] = useState([]);
  const [showStudentSearchModal, setShowStudentSearchModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentTransportDetails, setStudentTransportDetails] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const fromClassRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);
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

  const [blockList, setBlockList] = useState([]);
  const [roomTypeList, setRoomTypeList] = useState([]);

  // Student Modal Controls
  const [showStudentModal, setShowStudentModal] = useState(false);

  const openStudentModal = () => {
    setShowStudentModal(true);
  };

  const closeStudentModal = () => {
    setShowStudentModal(false);
  };

  const handleClear = () => {
    setStudentName("");
    setClassId(null);
    setSectionId(null);
    setTransportData([]); // Clear table data
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

    const fullName = [
      student.first_name,
      student.middle_name,
      student.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    setStudentId(student.id);
    setStudentName(fullName);
    setHostelAvailed(student.hostel_availed);

    // STEP 1 → Set SESSION immediately
    setSelectedSession({
      value: academic.batch_id,
      label: data.raw.batch_code,
    });

    // STEP 2 → Load COURSE after session fetch completes
    setTimeout(() => {
      setSelectedCourse({
        value: academic.course_id,
        label: data.raw.course_name,
      });
    }, 300);

    // STEP 3 → Load Department
    setTimeout(() => {
      setSelectedDepartment({
        value: academic.department_id,
        label: data.raw.department_code,
      });
    }, 600);

    // STEP 4 → Load Academic Year
    setTimeout(() => {
      setSelectedAcademicYear({
        value: academic.academic_year_id,
        label: data.raw.academic_year_code,
      });
    }, 900);

    // STEP 5 → Load Semester
    setTimeout(() => {
      setSelectedSemester({
        value: academic.semester_id,
        label: data.raw.semester_name,
      });
    }, 1200);

    // STEP 6 → Load Section
    setTimeout(() => {
      setSelectedSection({
        value: academic.section_id,
        label: data.raw.section_name,
      });
    }, 1500);

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
    if (!selectedHostel?.value) {
      setBlockOptions([]);
      return;
    }

    const fetchHostelBlockList = async () => {
      try {
        const organization_id = sessionStorage.getItem("organization_id") || 1;
        const branch_id = sessionStorage.getItem("branch_id") || 1;
        const hostel_id = selectedHostel.value;

        const res = await fetch(
          `${ApiUrl.apiurl}HOSTEL/GetHostelBlockList/?organization_id=${organization_id}&branch_id=${branch_id}&hostel_id=${hostel_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ TOKEN PASSED
            },
          }
        );
        const data = await res.json();

        setBlockOptions(
          data.map((item) => ({
            value: item.id,
            label: item.block_name,
          }))
        );
      } catch (error) {
        console.error("Error fetching block list:", error);
        setBlockOptions([]);
      }
    };

    fetchHostelBlockList();
  }, [selectedHostel]);

  useEffect(() => {
    if (!selectedHostel?.value || !selectedBlock?.value) {
      setFloorList([]);
      return;
    }

    const fetchFloors = async () => {
      try {
        const organization_id = sessionStorage.getItem("organization_id") || 1;
        const branch_id = sessionStorage.getItem("branch_id") || 1;

        const url = `${ApiUrl.apiurl}HOSTEL/GetHostelBlockFloorList/?organization_id=${organization_id}&branch_id=${branch_id}&hostel_id=${selectedHostel.value}&hostel_block_id=${selectedBlock.value}`;

        // const response = await fetch(url);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        setFloorList(
          data.map((floor) => ({
            value: floor.id,
            label: floor.floor_number,
          }))
        );
      } catch (error) {
        console.error("Error fetching floors:", error);
        setFloorList([]);
      }
    };

    fetchFloors();
  }, [selectedHostel, selectedBlock]);

  useEffect(() => {
    if (!selectedHostel?.value) {
      setRoomTypes([]);
      return;
    }

    const fetchRoomTypes = async () => {
      try {
        const organization_id = sessionStorage.getItem("organization_id") || 1;
        const branch_id = sessionStorage.getItem("branch_id") || 1;

        const response = await fetch(
          `${ApiUrl.apiurl}HOSTEL/GetHostelRoomTypeList/?organization_id=${organization_id}&branch_id=${branch_id}&hostel_id=${selectedHostel.value}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ TOKEN PASSED
            },
          }
        );
        const data = await response.json();

        setRoomTypes(
          data.map((item) => ({
            value: item.id,
            label: item.room_type,
          }))
        );
      } catch (error) {
        console.error("Error fetching Room Types:", error);
        setRoomTypes([]);
      }
    };

    fetchRoomTypes();
  }, [selectedHostel]);

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

  const handleSearch = async () => {
    try {
      const academicSessionId = localStorage.getItem("academicSessionId") || "";
      const orgId = localStorage.getItem("orgId") || "";
      const branchId = localStorage.getItem("branchId") || "";

      if (!academicSessionId || !orgId || !branchId) {
        console.error("Mandatory fields are missing.");
        return;
      }

      const queryParams = new URLSearchParams({
        academic_year_id: academicSessionId,
        org_id: orgId,
        branch_id: branchId,
      });

      if (studentId) queryParams.append("student_id", studentId);
      if (classId) queryParams.append("class_id", classId);
      if (sectionId) queryParams.append("section_id", sectionId);

      const response = await fetch(
        `${ApiUrl.apiurl}HOSTEL/GetStudentHostelList/?${queryParams.toString()}`
      );

      const data = await response.json();

      if (data.message === "success") {
        setTransportData(data.data);
      } else {
        console.error("Failed to fetch transport data: ", data.message);
        setTransportData([]);
      }
    } catch (error) {
      console.error("Error fetching transport data:", error);
      setTransportData([]);
    }
  };

  const handleOpenModal = async (student) => {
    setShowModal(true);
    setSelectedStudent(student);

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}HOSTEL/HostelDetailsRetereiveByStudent/${student.student_id}`
      );
      const data = await response.json();
      if (data.message === "success") {
        setStudentTransportDetails(data.data);
      } else {
        console.error("Failed to fetch transport details:", data.message);
        setStudentTransportDetails(null);
      }
    } catch (error) {
      console.error("Error fetching transport details:", error);
      setStudentTransportDetails(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setStudentTransportDetails(null);
  };

  const resetForm = () => {
    // Student info
    setStudentId(null);
    setStudentName("");

    // Academic details
    setSelectedSession(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);

    // Hostel dropdowns
    setSelectedHostel(null);
    setSelectedBlock(null);
    setSelectedFloor(null);
    setSelectedRoomType(null);
    setSelectedRoom(null);
    setSelectedBed(null);

    // Lists
    setBlockList([]);
    setRoomTypeList([]);
    setFloorList([]);
    setRoomList([]);
    setBedList([]);
  };

  const handleSave = async () => {
    try {
      const organization_id =
        Number(sessionStorage.getItem("organization_id")) || 1;
      const branch_id = Number(sessionStorage.getItem("branch_id")) || 1;
      const created_by = Number(localStorage.getItem("user_id")) || 1;

      if (!studentId) {
        alert("Please select a student.");
        return;
      }
      if (
        !selectedHostel?.value ||
        !selectedBlock?.value ||
        !selectedFloor?.value ||
        !selectedRoomType?.value ||
        !selectedRoom?.value ||
        !selectedBed?.value
      ) {
        alert("Please select all hostel fields.");
        return;
      }

      // ===== CHOICE SEMESTER IDS =====
      let choice_semesters = [];
      if (selectedSemester?.value) {
        choice_semesters = [selectedSemester.value];
      }

      const payload = {
        organization_id,
        branch_id,

        hostel_id: selectedHostel.value,
        hostel_block_id: selectedBlock.value,
        hostel_block_floor_id: selectedFloor.value,
        room_type_id: selectedRoomType.value,
        room_id: selectedRoom.value,
        bed_id: selectedBed.value,
        choice_semester_ids: choice_semesters,
        student_id: studentId,
        // hostel_avail: true,
        hostel_avail: hostelAvailed,
        created_by,
      };

      console.log("Sending Payload:", payload);

      const response = await fetch(
        `${ApiUrl.apiurl}HOSTEL/StudentHostelAssign/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ TOKEN PASSED
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("API Save Response:", result);

      if (result?.message?.toLowerCase() === "success") {
        alert("✅ Hostel Assigned Successfully!");
        // Reset form after success
        resetForm();
      } else {
        alert("Failed to Assign Hostel");
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      alert("Error while saving hostel data");
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
                STUDENT HOSTEL DETAILS CREATE
              </p>
              <div className="row mb-2 mt-3 mx-0">
                <div className="col-12  d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ width: "150px" }}
                    onClick={resetForm}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={() => navigate("/admin/student-hostel-details")}
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
                        <label htmlFor="section" className="form-label">
                          Hostel Name
                        </label>
                        <Select
                          id="hostel"
                          className="detail"
                          options={hostelList}
                          value={selectedHostel}
                          onChange={(option) => setSelectedHostel(option)}
                          placeholder="Select Hostel"
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="section" className="form-label">
                          Hostel Block
                        </label>
                        <Select
                          id="hostel-block"
                          className="detail"
                          placeholder="Select Block"
                          options={blockOptions}
                          value={selectedBlock}
                          onChange={(option) => setSelectedBlock(option)}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="section" className="form-label">
                          Floor No
                        </label>
                        <Select
                          options={floorList}
                          value={selectedFloor}
                          onChange={(option) => setSelectedFloor(option)}
                          placeholder="Select Floor No"
                          className="detail"
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="section" className="form-label">
                          Room Type
                        </label>
                        <Select
                          className="detail"
                          placeholder="Select Room Type"
                          options={roomTypes}
                          value={selectedRoomType}
                          onChange={(option) => setSelectedRoomType(option)}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="section" className="form-label">
                          Room No
                        </label>
                        <Select
                          className="detail"
                          options={roomList}
                          value={selectedRoom}
                          onChange={(option) => setSelectedRoom(option)}
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
                          isOptionDisabled={(option) =>
                            option.isAvailable === false
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmStudentHostelCreate;
