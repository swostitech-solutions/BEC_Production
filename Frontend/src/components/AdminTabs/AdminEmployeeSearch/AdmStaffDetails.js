
import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import StaffBasicInfo from "./StaffBasicInfo";
import AdmAddress from "./AdmAddress";
import DocumentDetails from "./DocumentDetails";
import PreviousExperience from "./PreviousExperience";
import Courses from "./Courses";
import FamilyDetails from "./FamilyDetails";
import EducationalDetails from "./EducationalDetails";
import LanguagesKnown from "./LanguagesKnown";
import { ApiUrl } from "../../../ApiUrl";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BasicTabs() {
  const [value, setValue] = useState(0);
  const [experienceData, setExperienceData] = useState([]);
  const [addressDetails, setAddressDetails] = useState(null);
  const [documentDetails, setDocumentDetails] = useState([]);
  const [relationDetails, setRelationDetails] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [courseDetails, setCourseDetails] = useState([]);
  const [languageData, setLanguageData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleChange = (event, newValue) => setValue(newValue);
  const goToTab = (tabIndex) => setValue(tabIndex);

  // Fetch all data when in edit mode
  useEffect(() => {
    const fetchAllData = async () => {
      const employeeId = localStorage.getItem("employeeId");
      const employeeTypeId = localStorage.getItem("employeeTypeId");
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");

      if (!employeeId || !orgId || !branchId) {
        setIsEditMode(false);
        setDataLoaded(true);
        return;
      }

      setIsEditMode(true);

      try {
        // Fetch Address Details
        if (employeeTypeId) {
          try {
            const addressResponse = await fetch(
              `${ApiUrl.apiurl}STAFF/RegistrationAddressDetailsRetrieve/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}&employee_type_id=${employeeTypeId}`
            );
            if (addressResponse.ok) {
              const addressResult = await addressResponse.json();
              if (addressResult.message === "Success" && addressResult.data) {
                setAddressDetails(addressResult.data);
              }
            }
          } catch (err) {
            console.error("Error fetching address:", err);
          }
        }

        // Fetch Document Details
        try {
          const docResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationDocumentDetailsRetrieve/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`
          );
          if (docResponse.ok && docResponse.status !== 204) {
            const docResult = await docResponse.json();
            if (docResult.message === "Success" && docResult.data) {
              setDocumentDetails(Array.isArray(docResult.data) ? docResult.data : [docResult.data]);
            }
          }
        } catch (err) {
          console.error("Error fetching documents:", err);
        }

        // Fetch Family/Relation Details
        try {
          const relationResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationRelationDetailsRetrieve/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`
          );
          if (relationResponse.ok && relationResponse.status !== 204) {
            const relationResult = await relationResponse.json();
            if (relationResult.message === "Success" && relationResult.data) {
              setRelationDetails(Array.isArray(relationResult.data) ? relationResult.data : [relationResult.data]);
            }
          }
        } catch (err) {
          console.error("Error fetching relations:", err);
        }

        // Fetch Education Details
        try {
          const educationResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationEducationDetailsRetrieve/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`
          );
          if (educationResponse.ok && educationResponse.status !== 204) {
            const educationResult = await educationResponse.json();
            if (educationResult.message === "Success" && educationResult.data) {
              setEducationData(Array.isArray(educationResult.data) ? educationResult.data : [educationResult.data]);
            }
          }
        } catch (err) {
          console.error("Error fetching education:", err);
        }

        // Fetch Course Details
        try {
          const courseResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationCourseDetailsRetrieve/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`
          );
          if (courseResponse.ok && courseResponse.status !== 204) {
            const courseResult = await courseResponse.json();
            if (courseResult.message === "Success" && courseResult.data) {
              setCourseDetails(Array.isArray(courseResult.data) ? courseResult.data : [courseResult.data]);
            }
          }
        } catch (err) {
          console.error("Error fetching courses:", err);
        }

        // Fetch Language Details
        try {
          const languageResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationLanguageDetailsRetrieve/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`
          );
          if (languageResponse.ok && languageResponse.status !== 204) {
            const languageResult = await languageResponse.json();
            if (languageResult.message === "Success" && languageResult.data) {
              setLanguageData(languageResult.data);
            }
          }
        } catch (err) {
          console.error("Error fetching language:", err);
        }

        // Fetch Experience Details
        try {
          const experienceResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationExperienceDetailsRetrieve/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`
          );
          if (experienceResponse.ok && experienceResponse.status !== 204) {
            const experienceResult = await experienceResponse.json();
            if (experienceResult.message === "Success" && experienceResult.data) {
              setExperienceData(Array.isArray(experienceResult.data) ? experienceResult.data : [experienceResult.data]);
            }
          }
        } catch (err) {
          console.error("Error fetching experience:", err);
        }

        setDataLoaded(true);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setDataLoaded(true);
      }
    };

    fetchAllData();
  }, []);

  const handleSave = async () => {
    const employeeId = localStorage.getItem("employeeId"); // Get employeeId from localStorage
    const createdBy = sessionStorage.getItem("userId"); // Get userId from sessionStorage

    // Guard: employee must be created first via the Basic Info / Address tabs
    if (!employeeId || employeeId === "null") {
      alert(
        "No staff record found. Please complete the Basic Info and Address tabs first by clicking 'Next' on each tab before saving."
      );
      return;
    }

    const payload = {
      created_by: parseInt(createdBy), // Ensure integer type if API expects int
      experience_details: experienceData.map((item) => ({
        experience_id: 0,
        previous_company_worked: item.organization,
        date_from: item.monthYearFrom,
        date_to: item.monthYearTo,
        reason_for_leaving: item.reasonForLeaving,
        experience_letter_provided: item.experienceLetterProvided,
      })),
    };

    try {
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");

      const response = await fetch(
        `${ApiUrl.apiurl}STAFF/RegistrationEXPERIENCECreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || "Network response was not ok");
      }

      const result = await response.json();
      console.log("API Success:", result);
      alert("Data saved successfully!");
    } catch (error) {
      console.error("API Error:", error);
      alert("Error saving data: " + error.message);
    }
  };

  const handleClear = () => {
    // Clear experience data
    setExperienceData([]);

    // Clear localStorage data
    localStorage.removeItem("employeeId");

    // Clear sessionStorage form data
    sessionStorage.removeItem("tempFormData");
    sessionStorage.removeItem("tempFrontCover");

    // Reset to first tab
    setValue(0);

    alert("Form cleared successfully!");
  };

  const handleClose = () => {
    // Navigate back to employee search page
    window.location.href = "/admin/employee-search";
  };


  return (
    <Box sx={{ width: "100%" }}>
      <div className="row">
        <div className="col-12 d-flex justify-content-around">
          <button
            className="btn btn-primary me-2"
            style={{ width: "150px" }}
            onClick={handleSave}
          >
            Save
          </button>
          <button className="btn btn-secondary me-2" style={{ width: "150px" }} onClick={handleClear}>
            Clear
          </button>
          <button className="btn btn-danger me-2" style={{ width: "150px" }} onClick={handleClose}>
            Close
          </button>
        </div>
      </div>

      <Tabs value={value} onChange={(e) => e.preventDefault()}>
        <Tab label="Staff Basic Info" {...a11yProps(0)} disabled />
        <Tab label="Address" {...a11yProps(1)} disabled />
        <Tab label="Documents" {...a11yProps(2)} disabled />
        <Tab label="Family" {...a11yProps(3)} disabled />
        <Tab label="Educational" {...a11yProps(4)} disabled />
        <Tab label="Courses" {...a11yProps(5)} disabled />
        <Tab label="Languages Known" {...a11yProps(6)} disabled />
        <Tab label="Previous Experience" {...a11yProps(7)} disabled />
      </Tabs>

      <CustomTabPanel value={value} index={0}>
        <StaffBasicInfo goToTab={goToTab} setAddressDetails={setAddressDetails} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <AdmAddress goToTab={goToTab} addressDetails={addressDetails} setDocumentDetailsInParent={setDocumentDetails} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <DocumentDetails goToTab={goToTab} documentDetails={documentDetails} setRelationDetailsInParent={setRelationDetails} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <FamilyDetails goToTab={goToTab} relationDetails={relationDetails} setEducationDetailsInParent={setEducationData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <EducationalDetails goToTab={goToTab} educationData={educationData} setCourseDetailsInParent={setCourseDetails} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <Courses goToTab={goToTab} prefilledCourses={courseDetails} setLanguageDataInParent={setLanguageData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        <LanguagesKnown goToTab={goToTab} languageData={languageData} setExperienceDataInParent={setExperienceData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={7}>
        <PreviousExperience
          goToTab={goToTab}
          setExperienceData={setExperienceData}
          experienceData={experienceData}
        />
      </CustomTabPanel>
    </Box>
  );
}


//22oct
// import React, { useState } from "react";
// import { Box, Tabs, Tab } from "@mui/material";
// import StaffBasicInfo from "./StaffBasicInfo";
// import AdmAddress from "./AdmAddress";
// import DocumentDetails from "./DocumentDetails";
// import PreviousExperience from "./PreviousExperience";
// import Courses from "./Courses";
// import FamilyDetails from "./FamilyDetails";
// import EducationalDetails from "./EducationalDetails";
// import LanguagesKnown from "./LanguagesKnown";
// import { ApiUrl } from "../../../ApiUrl";
// import { useNavigate } from "react-router-dom";
// // import "./AdmStaffDetails.css"

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     "aria-controls": `simple-tabpanel-${index}`,
//   };
// }

// function CustomTabPanel(props) {
//   const { children, value, index, ...other } = props;
//   return (
//     <div role="tabpanel" hidden={value !== index} {...other}>
//       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//     </div>
//   );
// }

// export default function BasicTabs() {
//   const [value, setValue] = useState(0);
//   const [experienceData, setExperienceData] = useState([]); // data from PreviousExperience
//   const [addressDetails, setAddressDetails] = useState(null);
//   const [documentDetails, setDocumentDetails] = useState([]);
//   const [relationDetails, setRelationDetails] = useState([]);
//   const [educationData, setEducationData] = useState([]);
//   const [courseDetails, setCourseDetails] = useState([]);
//   const [languageData, setLanguageData] = useState([]);
//   const [saveEnabled, setSaveEnabled] = useState(false); // ⬅ Save disabled by default
//     const navigate = useNavigate();

//   const handleChange = (event, newValue) => setValue(newValue);
//   const goToTab = (tabIndex) => setValue(tabIndex);

//   const enableSaveButton = () => setSaveEnabled(true);


//   // const handleSave = async () => {
//   //   const employeeId = localStorage.getItem("employeeId"); // Get employeeId from localStorage
//   //   const createdBy = sessionStorage.getItem("userId"); // Get userId from sessionStorage

//   //   const payload = {
//   //     created_by: parseInt(createdBy), // Ensure integer type if API expects int
//   //     experience_details: experienceData.map((item) => ({
//   //       experience_id: 0,
//   //       previous_company_worked: item.organization,
//   //       date_from: item.monthYearFrom,
//   //       date_to: item.monthYearTo,
//   //       reason_for_leaving: item.reasonForLeaving,
//   //       experience_letter_provided: item.experienceLetterProvided,
//   //     })),
//   //   };

//   //   try {
//   //     const response = await fetch(
//   //       `${ApiUrl.apiurl}STAFF/registrationEXPERIENCECreateUpdate/${employeeId}/`, // Dynamic employeeId
//   //       {
//   //         method: "PUT",
//   //         headers: { "Content-Type": "application/json" },
//   //         body: JSON.stringify(payload),
//   //       }
//   //     );

//   //     if (!response.ok) {
//   //       throw new Error("Network response was not ok");
//   //     }

//   //     const result = await response.json();
//   //     console.log("API Success:", result);
//   //     alert("Data saved successfully!");
//   //   } catch (error) {
//   //     console.error("API Error:", error);
//   //     alert("Error saving data!");
//   //   }
//   // };

//   const handleSave = async () => {
//     const employeeId = localStorage.getItem("employeeId");
//     const createdBy = sessionStorage.getItem("userId");

//     const payload = {
//       created_by: parseInt(createdBy),
//       experience_details: experienceData.map((item) => ({
//         experience_id: 0,
//         previous_company_worked: item.organization,
//         date_from: item.monthYearFrom,
//         date_to: item.monthYearTo,
//         reason_for_leaving: item.reasonForLeaving,
//         experience_letter_provided: item.experienceLetterProvided,
//       })),
//     };

//     try {
//       const response = await fetch(
//         `${ApiUrl.apiurl}STAFF/registrationEXPERIENCECreateUpdate/${employeeId}/`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const result = await response.json();
//       console.log("API Success:", result);
//       alert("Data saved successfully!");
//       setSaveEnabled(false); // ⬅️ Disable Save after success
//     } catch (error) {
//       console.error("API Error:", error);
//       alert("Error saving data!");
//     }
//   };


//   return (
//     // <Box sx={{ width: "100%" }}>
//     //   <div className="row">
//     //     <div className="col-12 d-flex justify-content-around">
//     //       <button
//     //         className="btn btn-primary me-2"
//     //         style={{ width: "150px" }}
//     //         onClick={handleSave}
//     //         disabled={!saveEnabled}
//     //       >
//     //         Save
//     //       </button>
//     //       <button className="btn btn-secondary me-2" style={{ width: "150px" }} onClick={handleClear}>
//     //         Clear
//     //       </button>
//     //       <button className="btn btn-danger me-2" style={{ width: "150px" }} onClick={handleClose}>
//     //         Close
//     //       </button>
//     //     </div>
//     //   </div>

//     //   {/* <Tabs value={value} onChange={handleChange} variant="standard">
//     //     <Tab label="Staff Basic Info" {...a11yProps(0)} />
//     //     <Tab label="Address" {...a11yProps(1)} />
//     //     <Tab label="Documents" {...a11yProps(2)} />
//     //     <Tab label="Family" {...a11yProps(3)} />
//     //     <Tab label="Educational" {...a11yProps(4)} />
//     //     <Tab label="Courses" {...a11yProps(5)} />
//     //     <Tab label="Languages Known" {...a11yProps(6)} />
//     //     <Tab label="Previous Experience" {...a11yProps(7)} />
//     //   </Tabs> */}
//     //   <Box sx={{ width: "100%", overflowX: "auto" }}>
//     //     <Tabs
//     //       value={value}
//     //       onChange={handleChange}
//     //       variant="scrollable"
//     //       scrollButtons="auto"
//     //       aria-label="staff tabs"
//     //       sx={{
//     //         whiteSpace: "nowrap", // prevent wrapping
//     //         "& .MuiTabs-flexContainer": {
//     //           flexWrap: "nowrap",
//     //         },
//     //       }}
//     //     >
//     //       <Tab label="Staff Basic Info" sx={{ minWidth: 150 }} />
//     //       <Tab label="Address" sx={{ minWidth: 150 }} />
//     //       <Tab label="Documents" sx={{ minWidth: 150 }} />
//     //       <Tab label="Family" sx={{ minWidth: 150 }} />
//     //       <Tab label="Educational" sx={{ minWidth: 150 }} />
//     //       <Tab label="Courses" sx={{ minWidth: 150 }} />
//     //       <Tab label="Languages Known" sx={{ minWidth: 150 }} />
//     //       <Tab label="Previous Experience" sx={{ minWidth: 150 }} />
//     //     </Tabs>
//     //   </Box>

//     //   <CustomTabPanel value={value} index={0}>
//     //     <StaffBasicInfo
//     //       goToTab={goToTab}
//     //       setAddressDetails={setAddressDetails}
//     //     />
//     //   </CustomTabPanel>
//     //   <CustomTabPanel value={value} index={1}>
//     //     <AdmAddress
//     //       goToTab={goToTab}
//     //       addressDetails={addressDetails}
//     //       setDocumentDetailsInParent={setDocumentDetails}
//     //     />
//     //   </CustomTabPanel>
//     //   <CustomTabPanel value={value} index={2}>
//     //     <DocumentDetails
//     //       goToTab={goToTab}
//     //       documentDetails={documentDetails}
//     //       setRelationDetailsInParent={setRelationDetails}
//     //     />
//     //   </CustomTabPanel>

//     //   <CustomTabPanel value={value} index={3}>
//     //     <FamilyDetails
//     //       goToTab={goToTab}
//     //       relationDetails={relationDetails}
//     //       setEducationDetailsInParent={setEducationData}
//     //     />
//     //   </CustomTabPanel>
//     //   <CustomTabPanel value={value} index={4}>
//     //     <EducationalDetails
//     //       goToTab={goToTab}
//     //       educationData={educationData}
//     //       setCourseDetailsInParent={setCourseDetails}
//     //     />
//     //   </CustomTabPanel>
//     //   <CustomTabPanel value={value} index={5}>
//     //     <Courses
//     //       goToTab={goToTab}
//     //       prefilledCourses={courseDetails}
//     //       setLanguageDataInParent={setLanguageData}
//     //     />
//     //   </CustomTabPanel>
//     //   <CustomTabPanel value={value} index={6}>
//     //     <LanguagesKnown
//     //       goToTab={goToTab}
//     //       languageData={languageData}
//     //       setExperienceDataInParent={setExperienceData}
//     //     />
//     //   </CustomTabPanel>
//     //   <CustomTabPanel value={value} index={7}>
//     //     {/* <PreviousExperience
//     //       goToTab={goToTab}
//     //       setExperienceData={setExperienceData}
//     //       experienceData={experienceData}
//     //     /> */}
//     //     <PreviousExperience
//     //       goToTab={goToTab}
//     //       setExperienceData={(data) => {
//     //         setExperienceData(data);
//     //         enableSaveButton(); //  Updated function name
//     //       }}
//     //       experienceData={experienceData}
//     //     />
//     //   </CustomTabPanel>
//     // </Box>

//     <Box sx={{ width: "100%" }}>
//       <div className="row mb-3 mt-3 mx-0">
//         <div className="col-12 d-flex flex-wrap gap-2">
//           <button
//             className="btn btn-primary me-2"
//             style={{ width: "150px" }}
//             onClick={handleSave}
//             disabled={!saveEnabled}
//           >
//             Save
//           </button>
//           <button className="btn btn-secondary me-2" style={{ width: "150px" }} onClick={handleClear}>
//             Clear
//           </button>
//           <button
//             className="btn btn-danger me-2"
//             style={{ width: "150px" }}
//             onClick={() => navigate("/admin/dashboard")}
//           >
//             Close
//           </button>
//         </div>
//       </div>

//       {/* Tabs section */}
//       <Box sx={{ width: "100%", overflowX: "auto" }}>
//         <Tabs
//           value={value}
//           // prevent manual tab switching
//           onChange={(event, newValue) => {
//             // Only allow programmatic navigation
//             event.preventDefault();
//           }}
//           variant="scrollable"
//           scrollButtons="auto"
//           aria-label="staff tabs"
//           sx={{
//             whiteSpace: "nowrap",
//             "& .MuiTabs-flexContainer": { flexWrap: "nowrap" },
//           }}
//         >
//           <Tab label="Staff Basic Info" sx={{ minWidth: 150 }} disabled />
//           <Tab label="Address" sx={{ minWidth: 150 }} disabled />
//           <Tab label="Documents" sx={{ minWidth: 150 }} disabled />
//           <Tab label="Family" sx={{ minWidth: 150 }} disabled />
//           <Tab label="Educational" sx={{ minWidth: 150 }} disabled />
//           <Tab label="Courses" sx={{ minWidth: 150 }} disabled />
//           <Tab label="Languages Known" sx={{ minWidth: 150 }} disabled />
//           <Tab label="Previous Experience" sx={{ minWidth: 150 }} disabled />
//         </Tabs>
//       </Box>

//       {/* Panels */}
//       <CustomTabPanel value={value} index={0}>
//         <StaffBasicInfo
//           goToTab={goToTab}
//           setAddressDetails={setAddressDetails}
//         />
//       </CustomTabPanel>

//       <CustomTabPanel value={value} index={1}>
//         <AdmAddress
//           goToTab={goToTab}
//           addressDetails={addressDetails}
//           setDocumentDetailsInParent={setDocumentDetails}
//         />
//       </CustomTabPanel>

//       <CustomTabPanel value={value} index={2}>
//         <DocumentDetails
//           goToTab={goToTab}
//           documentDetails={documentDetails}
//           setRelationDetailsInParent={setRelationDetails}
//         />
//       </CustomTabPanel>

//       <CustomTabPanel value={value} index={3}>
//         <FamilyDetails
//           goToTab={goToTab}
//           relationDetails={relationDetails}
//           setEducationDetailsInParent={setEducationData}
//         />
//       </CustomTabPanel>

//       <CustomTabPanel value={value} index={4}>
//         <EducationalDetails
//           goToTab={goToTab}
//           educationData={educationData}
//           setCourseDetailsInParent={setCourseDetails}
//         />
//       </CustomTabPanel>

//       <CustomTabPanel value={value} index={5}>
//         <Courses
//           goToTab={goToTab}
//           prefilledCourses={courseDetails}
//           setLanguageDataInParent={setLanguageData}
//         />
//       </CustomTabPanel>

//       <CustomTabPanel value={value} index={6}>
//         <LanguagesKnown
//           goToTab={goToTab}
//           languageData={languageData}
//           setExperienceDataInParent={setExperienceData}
//         />
//       </CustomTabPanel>

//       <CustomTabPanel value={value} index={7}>
//         <PreviousExperience
//           goToTab={goToTab}
//           setExperienceData={(data) => {
//             setExperienceData(data);
//             enableSaveButton(); // updated logic
//           }}
//           experienceData={experienceData}
//         />
//       </CustomTabPanel>
//     </Box>
//   );
// }

