import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";

function AdmFeeStructure() {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isFeeStructureFrozen, setIsFeeStructureFrozen] = useState(false);
  const [feeStructure, setFeeStructure] = useState([]);
  const admissionNoRef = useRef(null);
  const versionRef = useRef(null);
  const toClassRef = useRef(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disabledPeriods, setDisabledPeriods] = useState(Array(8).fill(true));
  // State for selected class and session
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [frequencyOptions, setFrequencyOptions] = useState([]);
  const [periodOptions, setPeriodOptions] = useState([]);
  const [elementNameOptions, setElementNameOptions] = useState([]);
 const [selectedNewExisting, setSelectedNewExisting] = useState(null);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // State for Academic Year dropdown
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [visibleSemesters, setVisibleSemesters] = useState(0);
  const [feeStructureName, setFeeStructureName] = useState("");
  const [version, setVersion] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  // const [disabledSemesters, setDisabledSemesters] = useState(Array(8).fill(true));
  // Use refs for the fields that don't rely on state
const [formKey, setFormKey] = useState(0);

  const [feeElement, setFeeElement] = useState({
    element_type_id: "",
    name: "",
    frequency: "",
    amount: "",
    semesters: Array(8).fill(""), // ✅ FIX
  });
  const newExistingOptions = [
    { value: "N", label: "New" },
    { value: "E", label: "Existing" },
  ];

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
const handleClear = () => {
  setIsResetting(true);

  //  STOP table & semesters FIRST
  setFeeStructure([]);
  setVisibleSemesters(0);

  //  CLEAR fee element completely
  setFeeElement({
    element_type_id: "",
    name: "",
    frequency: "",
    amount: "",
    semesters: [],
  });

  //  CLEAR TEXT FIELDS
  setFeeStructureName("");
  setVersion("");

  //  CLEAR DROPDOWNS
  setSelectedSession(null);
  setSelectedCourse(null);
  setSelectedDepartment(null);
  setSelectedAcademicYear(null);
  setSelectedSemester(null);
  setSelectedSection(null);
  setSelectedCategory(null);
  setSelectedNewExisting(null);

  //  CLEAR OPTIONS
  setCourses([]);
  setDepartments([]);
  setAcademicYears([]);
  setSemesters([]);
  setSections([]);
  setSemesterOptions([]);

  setIsFeeStructureFrozen(false);

  //  FORCE react-select re-mount
  setFormKey((prev) => prev + 1);

  //  RELEASE RESET LOCK AFTER PAINT
  requestAnimationFrame(() => {
    setIsResetting(false);
  });
};


  useEffect(() => {
    const fetchCourses = async () => {
      // If no session is selected, clear the course list and return
      if (isResetting) return;
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
  }, [selectedSession, isResetting]);

  useEffect(() => {
    const fetchDepartments = async () => {
      // Only call API when both session and course are selected
      if (isResetting) return;
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
  }, [selectedSession, selectedCourse, isResetting]);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      // Only call API when session, course, and department are selected
      if (isResetting) return;
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
  }, [selectedSession, selectedCourse, selectedDepartment, isResetting]);

useEffect(() => {
  const fetchSemesters = async () => {
      if (isResetting) return;
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

      const url = `${ApiUrl.apiurl}Semester/GetSemester/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${selectedSession.value}&course_id=${selectedCourse.value}&department_id=${selectedDepartment.value}&academic_year_id=${selectedAcademicYear.value}`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (Array.isArray(result)) {
        setSemesters(
          result.map((item) => ({
            value: item.id,
            label: item.semester_description || item.semester_code,
          }))
        );
      } else {
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
  isResetting,
]);




  useEffect(() => {
    const fetchSections = async () => {
      // Only call API when all required dropdowns are selected
      if (isResetting) return;
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
    isResetting,
  ]);

  useEffect(() => {
    const fetchFrequencyOptions = async () => {
      // Guard clauses - need at least Batch and Course to filter Frequency properly
      if (isResetting) return;
      
      const batch_id = selectedSession?.value;
      const course_id = selectedCourse?.value;
      
      // If we don't have batch/course, we can't filter relevant frequencies
      if (!batch_id || !course_id) {
          setFrequencyOptions([]);
          return;
      }
      
      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const department_id = selectedDepartment?.value || "";

        if (!token) {
          console.error("Access token not found");
          return;
        }

        // Construct URL with filters
        let url = `${ApiUrl.apiurl}FeeFrequency/GetAllFrequencyPeriodList/?organization=${organization_id}&branch=${branch_id}&batch=${batch_id}&course=${course_id}`;
        
        if (department_id) {
            url += `&department=${department_id}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();

        if (result?.data && Array.isArray(result.data)) {
          const options = result.data.map((option) => ({
            value: option.id,
            label: option.fee_frequency_name,
            fee_frequency_name: option.fee_frequency_name,
            frequency_period: option.frequency_period,
          }));

          setFrequencyOptions(options);
        } else {
             setFrequencyOptions([]);
        }
      } catch (error) {
        console.error("Error fetching frequency options:", error);
        setFrequencyOptions([]);
      }
    };

    fetchFrequencyOptions();
  }, [selectedSession, selectedCourse, selectedDepartment, isResetting]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Get token from local storage

        const response = await fetch(
          `${ApiUrl.apiurl}CATEGORY/GetAllCategory/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include token in header
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.message === "Success" && Array.isArray(data.data)) {
          const options = data.data.map((category) => ({
            value: category.id,
            label: category.category_name, // correct mapping
          }));
          setCategoryOptions(options);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFeeElements = async () => {
      try {
        //  Get access token from localStorage
        const token = localStorage.getItem("accessToken");

        if (!token) {
          console.error("Access token not found in localStorage");
          return;
        }

        const response = await fetch(
          `${ApiUrl.apiurl}FeeElementType/GetAllFeeElements/S`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, //  pass token properly
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        //  Adjust mapping based on your backend response structure
        if (result && result.data && Array.isArray(result.data)) {
          const options = result.data.map((element) => ({
            value: element.id,
            label:
              element.elementDescription ||
              element.element_description ||
              "N/A",
          }));
          setElementNameOptions(options);
        } else {
          console.error("Invalid data format:", result);
        }
      } catch (error) {
        console.error("Error fetching fee elements:", error);
      }
    };

    fetchFeeElements();
  }, []);

 useEffect(() => {
   if (isResetting) return;
   const fetchSemesterbydepartment = async () => {
     try {
       const token = localStorage.getItem("accessToken");
       const organization_id = sessionStorage.getItem("organization_id");
       const branch_id = sessionStorage.getItem("branch_id");

       const batch_id = selectedSession?.value || "";
       const course_id = selectedCourse?.value || "";
       const department_id = selectedDepartment?.value || "";

       if (!batch_id || !course_id || !department_id) {
         setSemesterOptions([]);
         return;
       }

       const response = await fetch(
         `${ApiUrl.apiurl}Semester/GetSemesterByDepartment/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}`,
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
         const options = data.map((item) => ({
           value: item.id,
           label: item.semester_description || item.semester_code,
         }));

         setSemesterOptions(options);
       } else {
         console.error("Unexpected semester API format:", data);
       }
     } catch (error) {
       console.error("Error fetching semesters:", error);
     }
   };

   fetchSemesterbydepartment(); // FIXED
 }, [selectedSession, selectedCourse, selectedDepartment, isResetting]);






  // ------------------- FREQUENCY CHANGE -------------------
// const handleFrequencyChange = async (selectedOption) => {
//   if (isResetting) return;

//   setFeeElement((prev) => ({
//     ...prev,
//     frequency: selectedOption?.value || "",
//   }));

//   if (!selectedOption) {
//     setVisibleSemesters(0);
//     return;
//   }

//   const organization_id = sessionStorage.getItem("organization_id");
//   const branch_id = sessionStorage.getItem("branch_id");

//   try {
//     const token = localStorage.getItem("accessToken");

//     if (!token) {
//       console.warn("Access token missing - cannot fetch fee frequency");
//       return;
//     }

//     const url = `${ApiUrl.apiurl}FeeFrequency/GetFeeFrequencyById/?organization_id=${organization_id}&branch_id=${branch_id}&fee_frequency_id=${selectedOption.value}`;

//     const res = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//    if (!res.ok) {
//      throw new Error(`HTTP error! Status: ${res.status}`);
//   }

//     const data = await res.json();
//     const count = Number(data?.frequency_period) || 0;

//     setVisibleSemesters(count);
//     setFeeElement((prev) => ({
//       ...prev,
//       semesters: Array(count).fill(""),
//     }));
//   } catch (error) {
//     console.error("Frequency API Error:", error);
//      setVisibleSemesters(0);
//   }
// };


const handleFrequencyChange = async (selectedOption) => {
  if (isResetting) return;

  // Clear first
  if (!selectedOption) {
    setFeeElement((prev) => ({
      ...prev,
      frequency: "",
      semesters: [],
    }));
    setVisibleSemesters(0);
    return;
  }

  // 🚫 HARD GUARD
  if (!selectedSession?.value || !selectedCourse?.value) {
    console.warn("Session or Course missing", {
      session: selectedSession,
      course: selectedCourse,
    });
    return;
  }

  // ✅ SAFE IDS
  const organization_id = sessionStorage.getItem("organization_id");
  const branch_id = sessionStorage.getItem("branch_id");
  const batch_id = Number(selectedSession.value);
  const course_id = Number(selectedCourse.value);
  const fee_frequency_id = Number(selectedOption.value);

  // Save frequency
  setFeeElement((prev) => ({
    ...prev,
    frequency: fee_frequency_id,
  }));

  console.log("FeeFrequency API PARAMS:", {
    organization_id,
    branch_id,
    batch_id,
    course_id,
    fee_frequency_id,
  });

  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const url = `${ApiUrl.apiurl}FeeFrequency/GetFeeFrequencyById/
      ?organization_id=${organization_id}
      &branch_id=${branch_id}
      &batch_id=${batch_id}
      &course_id=${course_id}
      &fee_frequency_id=${fee_frequency_id}`.replace(/\s+/g, "");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("FeeFrequency Response:", data);

    const periodCount = Number(data.frequency_period) || 0;

    setVisibleSemesters(periodCount);

    setFeeElement((prev) => ({
      ...prev,
      semesters: Array(periodCount).fill(""),
    }));
  } catch (error) {
    console.error("Fee Frequency API failed:", error);
    setVisibleSemesters(0);
  }
};







  // ------------------- ELEMENT CHANGE -------------------
const handleElementChange = (selectedOption) => {
  setFeeElement((prev) => ({
    ...prev,
    element_type_id: selectedOption?.value || "",
    name: selectedOption?.label || "",
  }));
};



const handleAddFeeElement = () => {
  if (!feeElement.element_type_id) {
    alert("Please select Element Name");
    return;
  }
  if (!feeElement.frequency) {
    alert("Please select Frequency");
    return;
  }
if (feeElement.amount === "") {
  alert("Please enter amount");
  return;
}

  const periodsList = [...(feeElement.semesters || [])];

  const selectedElement = elementNameOptions.find(
    (el) => el.value === feeElement.element_type_id
  );

  setFeeStructure((prev) => [
    ...prev,
    {
      element_type_id: feeElement.element_type_id,
      name: selectedElement?.label || "",
      frequency: feeElement.frequency,
      amount: feeElement.amount,
      periods: periodsList, // ⬅ stored properly
    },
  ]);

  setFeeElement({
    element_type_id: "",
    frequency: "",
    amount: "",
    semesters: Array(visibleSemesters).fill(""), // ⬅ Correct reset
  });
};







const handleSave = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const organization_id = sessionStorage.getItem("organization_id");
    const branch_id = sessionStorage.getItem("branch_id");
    const user_id = sessionStorage.getItem("userId");

    if (!token || !organization_id || !branch_id) {
      alert("Missing token / organization / branch");
      return;
    }

    // Validation
    if (!selectedCategory) return alert("Please select a category.");
    if (!selectedSession) return alert("Please select a Session.");
    if (!selectedCourse) return alert("Please select a Course.");
    if (!selectedDepartment) return alert("Please select a Department.");
    if (!selectedAcademicYear) return alert("Please select an Academic Year.");
    if (!selectedSemester) return alert("Please select a Semester.");
    if (!selectedSection) return alert("Please select a Section.");
    if (!selectedNewExisting) return alert("Please select New/Existing.");
    if (!feeStructureName.trim())
      return alert("Please enter Fee Structure Name");
    if (!version.trim()) return alert("Please enter Version");
    if (feeStructure.length === 0)
      return alert("Please add at least one fee element.");

    // Validate fee element rows
    for (let i = 0; i < feeStructure.length; i++) {
      const row = feeStructure[i];
      if (!row.element_type_id)
        return alert(`Missing Element Name in row ${i + 1}`);
      if (!row.frequency) return alert(`Missing Frequency in row ${i + 1}`);
      if (row.amount === "" || row.amount === null || isNaN(row.amount))
        return alert(`Invalid amount in row ${i + 1}`);
    }

    // Payload
    const payload = {
      fee_structure_master_detail: {
        fee_structure_name: feeStructureName.trim(),
        fee_structure_code: feeStructureName.trim(),
        fee_structure_description: feeStructureName.trim(),
        enabled: "Y",
        organization: Number(organization_id),
        branch: Number(branch_id),
        batch: Number(selectedSession.value),
        course: Number(selectedCourse.value),
        department: Number(selectedDepartment.value),
        academic_year: Number(selectedAcademicYear.value),
        semester: Number(selectedSemester.value),
        section: Number(selectedSection.value),
        version_no: version.trim(),
        new_existing: selectedNewExisting.value,
        category: Number(selectedCategory.value),
        created_by: Number(user_id),
      },
      fee_structure_detail: feeStructure.map((item, index) => ({
        id: index + 1,
        adjustment_flag: "N",
        amount: Number(item.amount),
        created_by: Number(user_id),
        element_frequency: Number(item.frequency),
        element_type: Number(item.element_type_id),
        is_active: true,
        semester_1: item.periods?.[0] ? Number(item.periods[0]) : null,
        semester_2: item.periods?.[1] ? Number(item.periods[1]) : null,
        semester_3: item.periods?.[2] ? Number(item.periods[2]) : null,
        semester_4: item.periods?.[3] ? Number(item.periods[3]) : null,
        semester_5: item.periods?.[4] ? Number(item.periods[4]) : null,
        semester_6: item.periods?.[5] ? Number(item.periods[5]) : null,
        semester_7: item.periods?.[6] ? Number(item.periods[6]) : null,
        semester_8: item.periods?.[7] ? Number(item.periods[7]) : null,
      })),
    };

    const response = await fetch(
      `${ApiUrl.apiurl}FeeStructure/FeeStructureCreate/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
if (!response.ok) {
  const errorText = await response.text();
   throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
 }
    const result = await response.json();

  if (result?.message?.toLowerCase().includes("success")) {
    alert(result.message);
    handleClear();
  } else {
    alert(result?.message || "Something went wrong");
  }
  } catch (error) {
    console.error("SAVE ERROR:", error);
    alert("An unexpected error occurred while saving.");
  }
};

  const handleElementTypeChange = (selectedOption) => {
    setFeeElement((prev) => ({
      ...prev,
      element_type_id: selectedOption.value,
    }));
  };

  const handleSessionChange = (selectedOption) => {
    setSelectedSessionId(selectedOption.value);
  };

  return (
    <div>
      {/* Button Section */}
      <div className="row mb-3 mx-0">
        <div className="col-12 mb-3 mt-3 d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-primary me-2"
            style={{
              width: "150px",
            }}
            onClick={handleSave}
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

      <div className="row mt-2 mx-2">
        <div className="col-12 custom-section-box">
          <div className="row">
            {/* Fee Structure Name */}
            <div className="col-12 col-md-3 mb-3">
              <label htmlFor="fee-structure-name" className="form-label">
                Fee Structure Name
              </label>
              <div className="d-flex align-items-center">
                <input
                  type="text"
                  className="form-control detail"
                  placeholder="Enter Fee Structure Name"
                  value={feeStructureName}
                  onChange={(e) => setFeeStructureName(e.target.value)}
                />
              </div>
            </div>

            {/* Session */}
            <div className="col-12 col-md-3 mb-2">
              <label htmlFor="session" className="form-label">
                Session
              </label>

              <Select
                key={`session-${formKey}`}
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
                key={`course-${formKey}`}
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
                Department
              </label>
              <Select
                key={`dept-${formKey}`}
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
                key={`year-${formKey}`}
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
                key={`sem-${formKey}`}
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
                key={`sec-${formKey}`}
                id="section"
                className="detail"
                options={sections}
                value={selectedSection}
                onChange={setSelectedSection}
                placeholder="Select Section"
              />
            </div>

            {/* Category */}
            <div className="col-12 col-md-3 mb-2">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <Select
                key={`cat-${formKey}`}
                id="category"
                className="detail"
                options={categoryOptions}
                value={selectedCategory} // Bind to the selectedCategory state
                placeholder="Select Category"
                classNamePrefix="react-select"
                onChange={(selectedOption) => {
                  setSelectedCategory(selectedOption); // Update selected category
                }}
              />
            </div>
            {/* New/Existing */}
            <div className="col-12 col-md-3 mb-4">
              <label htmlFor="new-existing" className="form-label">
                New/Existing
              </label>
              <Select
                key={`new-${formKey}`}
                id="new-existing"
                className="detail"
                options={newExistingOptions}
                value={selectedNewExisting} // ✅ REQUIRED
                placeholder="Select New/Existing"
                onChange={setSelectedNewExisting}
              />
            </div>

            {/* Version */}
            <div className="col-12 col-md-3 mb-2">
              <label htmlFor="version" className="form-label">
                Version
              </label>
              <input
                type="text"
                className="form-control detail"
                placeholder="Enter Version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Fee Elements Section */}
      <div className="mt-4">
        {/* Add Fee Elements Table */}
        <div className="add-fee-elements">
          <h5>Add Fee Elements</h5>
          <div className="table-responsive">
            <table className="table mt-2 table-bordered">
              <thead>
                <tr>
                  <th style={{ width: "200px" }}>Element Name</th>
                  <th style={{ width: "180px" }}>Frequency</th>
                  <th>Amount</th>

                  {/* Semester Headers - visible only up to visibleSemesters */}
                  {Array.from({ length: visibleSemesters }).map((_, idx) => (
                    <th key={idx}>Semester {idx + 1}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr>
                  {/* Element */}
                  <td>
                    <select
                      className="detail"
                      style={{ width: "200px" }}
                      value={feeElement.element_type_id || null}
                      onChange={(e) => {
                        const selectedOption = elementNameOptions.find(
                          (o) => o.value.toString() === e.target.value
                        );
                        handleElementChange(selectedOption);
                      }}
                    >
                      <option value="">Select Element</option>
                      {elementNameOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Frequency */}
                  <td>
                    <select
                      className="detail"
                      style={{ width: "180px" }}
                      value={feeElement.frequency || ""}
                      disabled={!selectedSession || !selectedCourse}
                      onChange={(e) => {
                        const selectedOption = frequencyOptions.find(
                          (o) => String(o.value) === e.target.value
                        );
                        handleFrequencyChange(selectedOption);
                      }}
                    >
                      <option value="">Select Frequency</option>
                      {frequencyOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Amount */}
                  <td>
                    <input
                      type="number"
                      className="form-control detail"
                      placeholder="Amount"
                      min="0"
                      value={feeElement.amount}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (value === "") {
                          setFeeElement((prev) => ({ ...prev, amount: "" }));
                          return;
                        }

                        const num = Number(value);

                        if (num < 0) return;

                        setFeeElement((prev) => ({
                          ...prev,
                          amount: num,
                        }));
                      }}
                    />
                  </td>

                  {Array.from({ length: visibleSemesters }).map((_, idx) => (
                    <td key={idx}>
                      <select
                        className="form-control"
                        value={feeElement.semesters[idx] || ""}
                        onChange={(e) => {
                          const updated = [...feeElement.semesters];
                          updated[idx] = e.target.value;
                          setFeeElement((prev) => ({
                            ...prev,
                            semesters: updated,
                          }));
                        }}
                      >
                        <option value="">Select Semester</option>
                        {semesterOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>

                {/* Add Button */}
                <tr>
                  <td colSpan={3 + visibleSemesters}>
                    <button
                      className="btn btn-primary"
                      onClick={handleAddFeeElement}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Fee Structure Details */}
        {feeStructure.length > 0 && (
          <div className="fee-structure-details mt-4 mx-2">
            <h5>Fee Structure Details</h5>
            <div className="table-responsive">
              <table className="table mt-2 table-bordered">
                <thead>
                  <tr>
                    <th>Element Name</th>
                    <th>Frequency</th>
                    <th>Amount</th>
                    {Array.from({ length: visibleSemesters }).map((_, idx) => (
                      <th key={idx}>Semester {idx + 1}</th>
                    ))}
                    <th>Action</th> {/* NEW COLUMN */}
                  </tr>
                </thead>

                <tbody>
                  {feeStructure.map((element, index) => (
                    <tr key={index}>
                      <td>{element.name}</td>

                      <td>
                        {
                          frequencyOptions.find(
                            (o) => o.value === element.frequency
                          )?.label
                        }
                      </td>

                      <td>{element.amount}</td>

                      {Array.from({ length: visibleSemesters }).map(
                        (_, pIdx) => {
                          const periodValue = element.periods?.[pIdx] || "";
                          const periodName =
                            semesterOptions.find(
                              (o) =>
                                o.value.toString() === periodValue?.toString()
                            )?.label || "";
                          return <td key={pIdx}>{periodName}</td>;
                        }
                      )}

                      {/* REMOVE button */}
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            const updated = [...feeStructure];
                            updated.splice(index, 1);
                            setFeeStructure(updated);
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdmFeeStructure;





