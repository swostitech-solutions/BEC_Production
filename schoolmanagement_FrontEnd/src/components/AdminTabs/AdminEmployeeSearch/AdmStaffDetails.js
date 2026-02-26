
import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StaffBasicInfo from "./StaffBasicInfo";
import AdmAddress from "./AdmAddress";
import DocumentDetails from "./DocumentDetails";
import PreviousExperience from "./PreviousExperience";
import Courses from "./Courses";
import FamilyDetails from "./FamilyDetails";
import EducationalDetails from "./EducationalDetails";
import LanguagesKnown from "./LanguagesKnown";
import { ApiUrl } from "../../../ApiUrl";
import useFetchBloodGroups from "../../hooks/useFetchBloodGroups";
import useFetchNationalities from "../../hooks/useFetchNationalities";
import useFetchReligions from "../../hooks/useFetchReligions";
import useFetchGenderList from "../../hooks/fetchGenderList";

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
  const [addressFormData, setAddressFormData] = useState(null);
  const [basicInfoData, setBasicInfoData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch metadata lists for mapping
  const { bloodGroups } = useFetchBloodGroups();
  const { nationalities } = useFetchNationalities();
  const { religions } = useFetchReligions();
  const { genders } = useFetchGenderList();

  const handleChange = (event, newValue) => setValue(newValue);
  const goToTab = (tabIndex) => setValue(tabIndex);

  // Arrow navigation functions - simple tab switching without validation
  // Validation will occur when user clicks Save/Update buttons
  const maxTabIndex = 7; // 8 tabs total (0-7)
  const handleNext = () => {
    setValue((prevValue) => Math.min(prevValue + 1, maxTabIndex));
  };
  const handlePrevious = () => {
    setValue((prevValue) => Math.max(prevValue - 1, 0));
  };

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
        // Fetch Basic Info (including profile picture)
        try {
          const basicResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationBasicDetailsRetrieve/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`
          );
          if (basicResponse.ok) {
            const basicResult = await basicResponse.json();
            console.log("📝 Basic Info Response:", basicResult);
            if (basicResult.message === "Success" && basicResult.data) {
              console.log("📝 Profile field value:", basicResult.data.profile);

              // Map backend field names to frontend state
              const mappedData = {
                ...basicResult.data,
                employeeId: basicResult.data.id,
                employeeCode: basicResult.data.employee_code,
                firstName: basicResult.data.first_name,
                middleName: basicResult.data.middle_name,
                lastName: basicResult.data.last_name,
                nuid: basicResult.data.nuid,
                dob: basicResult.data.date_of_birth,
                placeOfBirth: basicResult.data.place_of_birth,
                maritalStatus: basicResult.data.marital_status,
                bloodGroup: basicResult.data.blood_group,
                phoneNumber: basicResult.data.phone_number,
                officeEmail: basicResult.data.office_email,
                emergencyContactNumber: basicResult.data.emergency_contact_number,
                motherTongue: basicResult.data.mother_tongue_id,
                employeeType: basicResult.data.employee_type_id,
                gender: basicResult.data.gender_id,
                status: basicResult.data.is_active ? "ACTIVE" : "INACTIVE",
                // Map profile image URL to profilePicture (backend uses 'profile' field)
                profilePicture: basicResult.data.profile || null,
              };

              console.log("📝 Mapped basic info with profilePicture:", mappedData.profilePicture);
              setBasicInfoData(mappedData);
            }
          }
        } catch (err) {
          console.error("Error fetching basic info:", err);
        }

        // Fetch Address Details
        if (employeeTypeId) {
          try {
            const addressResponse = await fetch(
              `${ApiUrl.apiurl}STAFF/RegistrationAddressDetailsRetrieve/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}&employee_type_id=${employeeTypeId}`
            );
            if (addressResponse.ok) {
              const addressResult = await addressResponse.json();
              if (addressResult.message === "Success" && addressResult.data && !addressResult.data.msg) {
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
          console.log("📄 Document Response Status:", docResponse.status);
          if (docResponse.ok && docResponse.status !== 204) {
            const docResult = await docResponse.json();
            console.log("📄 Document Result:", docResult);
            if (docResult.message === "Success" && docResult.data) {
              const docs = Array.isArray(docResult.data) ? docResult.data : [docResult.data];
              console.log("📄 Setting documents:", docs);
              setDocumentDetails(docs);
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

  // ============================================
  // PHASE 1: CREATION (POST) - For NEW Staff
  // ============================================
  const handleSave = async () => {
    // Prevent save if in edit mode
    if (isEditMode) {
      alert("⚠️ Cannot use Save for existing records. Please use Update button.");
      return;
    }

    const userId = sessionStorage.getItem("userId");
    const orgId = localStorage.getItem("orgId");
    const branchId = localStorage.getItem("branchId");

    // Validation: Basic Info is required
    if (!basicInfoData) {
      alert("❌ Please complete the Staff Basic Info tab first!");
      return;
    }

    if (!userId) {
      alert("❌ User session expired. Please login again.");
      return;
    }

    console.log("=== 💾 Starting CREATE New Staff (POST) ===");
    console.log("📊 Current State Data:", {
      basicInfoData,
      addressFormData,
      documentDetails,
      relationDetails,
      educationData,
      courseDetails,
      languageData,
      experienceData,
    });

    let savedSections = [];
    let failedSections = [];
    let employeeId = null;
    let employeeTypeId = null;

    // Helper to robustly map string values to IDs using metadata lists
    const mapVal = (v, list, keyParams = []) => {
      if (!v) return "";
      if (!isNaN(v)) return parseInt(v);
      const s = String(v).toLowerCase().trim();

      if (list && list.length > 0) {
        const found = list.find(item => {
          const keysToCheck = keyParams.length > 0 ? keyParams : Object.keys(item).filter(k => k.includes('name') || k.includes('code') || k.includes('desc'));
          return keysToCheck.some(k => String(item[k]).toLowerCase().trim() === s);
        });
        if (found) return found.id;
      }

      // Fallback to hardcoded map if list search fails (safety net)
      if (s === "o+") return 17;
      if (s === "male") return 5;
      if (s === "female") return 6;
      if (s === "hindu") return 5;
      if (s === "indian") return 3;

      return "";
    };

    try {
      // ========== STEP 1: Create Basic Info (POST) - Get employeeId ==========
      try {
        const basicPayload = new FormData();
        basicPayload.append("organization", orgId);
        basicPayload.append("branch", branchId);
        basicPayload.append("employee_code", basicInfoData.employeeCode || "");
        basicPayload.append("title", basicInfoData.title || "");
        basicPayload.append("first_name", basicInfoData.firstName || "");
        basicPayload.append("middle_name", basicInfoData.middleName || "");
        basicPayload.append("last_name", basicInfoData.lastName || "");
        basicPayload.append("nuid", basicInfoData.nuid || "");
        if (basicInfoData.dob) basicPayload.append("date_of_birth", basicInfoData.dob);
        basicPayload.append("place_of_birth", basicInfoData.placeOfBirth || "");
        basicPayload.append("marital_status", basicInfoData.maritalStatus || "1");
        basicPayload.append("gender", basicInfoData.gender || "");
        basicPayload.append("is_active", "True"); // Default active for new staff
        basicPayload.append("nationality", mapVal(basicInfoData.nationality, nationalities) || 3);
        basicPayload.append("religion", mapVal(basicInfoData.religion, religions) || 5);
        basicPayload.append("email", basicInfoData.email || "");
        basicPayload.append("phone_number", basicInfoData.phoneNumber || "");
        basicPayload.append("office_email", basicInfoData.officeEmail || "");
        basicPayload.append("employee_type", basicInfoData.employeeType || "");
        basicPayload.append("emergency_contact_number", basicInfoData.emergencyContactNumber || "");
        basicPayload.append("mother_tongue", basicInfoData.motherTongue || "");
        basicPayload.append("blood_group", mapVal(basicInfoData.bloodGroup, bloodGroups) || 17);
        basicPayload.append("batch", 1);
        basicPayload.append("created_by", userId);

        if (basicInfoData.profilePicture && basicInfoData.profilePicture instanceof File) {
          basicPayload.append("profile_pic", basicInfoData.profilePicture);
        }

        const basicUrl = `${ApiUrl.apiurl}STAFF/RegistrationCreate/`;
        const basicResponse = await fetch(basicUrl, { method: "POST", body: basicPayload });
        const basicResult = await basicResponse.json();

        if (basicResponse.ok && basicResult.message?.toLowerCase() === "success") {
          savedSections.push("Basic Info");
          employeeId = basicResult.data?.id || basicResult.data?.employee_id || basicResult.id;
          // Backend returns employee_type_code (string) but Address API needs employee_type_id (number)
          // Use the formData employeeType which contains the selected ID from dropdown
          employeeTypeId = basicInfoData.employeeType; // This is the numeric ID like "8"
          localStorage.setItem("employeeId", employeeId);
          localStorage.setItem("employeeTypeId", employeeTypeId);
          console.log("✅ Staff created with ID:", employeeId);
          console.log("✅ Employee Type ID:", employeeTypeId);
        } else {
          failedSections.push("Basic Info");
          alert(`❌ Failed to create staff record: ${basicResult.message || "Unknown error"}`);
          return;
        }
      } catch (error) {
        failedSections.push("Basic Info");
        alert(`❌ Error creating staff record: ${error.message}`);
        return;
      }

      // ========== STEP 2: Save Address (PUT) ==========
      if (addressFormData && addressFormData.formValues && employeeId) {
        try {
          const addressPayload = {
            present_address: addressFormData.formValues.residenceAddress || "",
            present_country: addressFormData.selectedCountry?.value || null,
            present_state: addressFormData.selectedState?.value || null,
            present_city: addressFormData.selectedResidenceDistrict?.value || null,
            present_pincode: addressFormData.formValues.residencePincode || "",
            present_phone_number: addressFormData.formValues.residencePhone || "",
            permanent_address: addressFormData.formValues.permanentAddress || "",
            permanent_country: addressFormData.selectedPermanentCountry?.value || null,
            permanent_state: addressFormData.selectedPermanentState?.value || null,
            permanent_city: addressFormData.selectedPermanentDistrict?.value || null,
            permanent_pincode: addressFormData.formValues.permanentPincode || "",
            permanent_phone_number: addressFormData.formValues.permanentPhone || "",
            created_by: userId,
            updated_by: userId,
          };

          console.log("📍 Address Payload:", addressPayload);
          console.log("📍 Employee Type ID for address:", employeeTypeId);

          const addressUrl = `${ApiUrl.apiurl}STAFF/RegistrationAddressCreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_type_id=${employeeTypeId}&employee_id=${employeeId}`;
          const addressResponse = await fetch(addressUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(addressPayload),
          });
          const addressResult = await addressResponse.json();
          console.log("📍 Address Response:", addressResult);

          if (addressResponse.ok && addressResult.message?.toLowerCase() === "success") {
            savedSections.push("Address");
          } else {
            failedSections.push("Address");
            console.error("❌ Address API Error:", addressResult);
          }
        } catch (error) {
          failedSections.push("Address");
          console.error("❌ Address Exception:", error);
        }
      }

      // ========== STEP 3: Save Documents (PUT) ==========
      if (documentDetails && documentDetails.length > 0 && employeeId) {
        try {
          const formData = new FormData();
          formData.append("created_by", userId);
          const metadata = documentDetails.map((d) => {
            const hasFile = d.documentFile instanceof File;
            if (hasFile) {
              formData.append("document_files", d.documentFile);
            }
            // Map frontend camelCase to backend snake_case
            return {
              document_details_id: d.id || d.document_details_id || 0,
              document_type_id: d.documentType || d.document_type_id || "",
              document_number: d.documentNumber || d.document_number || "",
              valid_from: d.validFrom || d.valid_from || null,
              valid_to: d.validTo || d.valid_to || null,
              is_active: d.enabled !== undefined ? d.enabled : (d.is_active !== undefined ? d.is_active : true),
              has_file: hasFile,  // ✅ tells backend which rows have an uploaded file
              document_file: ""
            };
          });
          formData.append("document_details", JSON.stringify(metadata));

          const docResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationDocumentUploadCreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`,
            { method: "PUT", body: formData }
          );
          const docResult = await docResponse.json();
          if (docResponse.ok && docResult.message?.toLowerCase() === "success") {
            savedSections.push("Documents");
          } else {
            failedSections.push("Documents");
          }
        } catch (error) {
          failedSections.push("Documents");
        }
      }

      // ========== STEP 4: Save Family/Relations (PUT) ==========
      if (relationDetails && relationDetails.length > 0 && employeeId) {
        try {
          console.log("👨‍👩‍👧 Raw relationDetails from state:", relationDetails);

          const mappedFamilyDetails = relationDetails.map((item) => {
            const mapped = {
              family_details_id: item.family_detail_id || item.family_details_id || 0,
              // Backend expects these exact field names (from FamilyDetails component)
              employee_relation: item.employee_relation || "",
              relation_title: item.relation_title || "",
              relation_first_name: item.relation_first_name || "",
              relation_middle_name: item.relation_middle_name || "",
              relation_last_name: item.relation_last_name || "",
              relation_dob: item.relation_dob || "",
              relation_gender: mapVal(item.relation_gender, genders) || 5, // Default to 5 (Male)
              relation_marital_status: item.relation_marital_status || "",
              relation_employed: item.relation_employed || "N",
              relation_occupation: item.relation_occupation || "",
              relation_dependent: item.relation_dependent !== undefined ? item.relation_dependent : 0,
              relation_pf_nominee: item.relation_pf_nominee || "",
              relation_pf_share: item.relation_pf_share || "",
            };
            console.log("👨‍👩‍👧 Input item:", item);
            console.log("👨‍👩‍👧 Mapped to:", mapped);
            return mapped;
          });

          const familyPayload = {
            created_by: userId,
            family_details: mappedFamilyDetails,
          };

          console.log("👨‍👩‍👧 Final Family Payload:", JSON.stringify(familyPayload, null, 2));

          const familyResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationFamilyRelationCreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(familyPayload),
            }
          );
          const familyResult = await familyResponse.json();
          console.log("👨‍👩‍👧 Family Response:", familyResult);

          if (familyResponse.ok && familyResult.message?.toLowerCase() === "success") {
            savedSections.push("Family");
          } else {
            failedSections.push("Family");
            console.error("❌ Family API Error:", familyResult);
          }
        } catch (error) {
          failedSections.push("Family");
          console.error("❌ Family Exception:", error);
        }
      }

      // ========== STEP 5: Save Education (PUT) ==========
      if (educationData && educationData.length > 0 && employeeId) {
        try {
          const formatYearToDate = (year) => (!year || year.length !== 4 ? null : `${year}-01-01`);
          const eduResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationQualificationCreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                created_by: userId,
                qualifications_details: educationData.map((item) => ({
                  employee_qualification_id: item.employee_qualification_id || 0,
                  qualification: item.qualification,
                  highest_qualification: item.highest_qualification || item.highestQualification || "",
                  date_from: item.date_from || formatYearToDate(item.yearFrom),
                  date_to: item.date_to || formatYearToDate(item.yearTo),
                  university: item.university || "",
                  institution: item.institution || "",
                  marks: item.marks || item.div || "",
                })),
              }),
            }
          );
          const eduResult = await eduResponse.json();
          if (eduResponse.ok && eduResult.message?.toLowerCase() === "success") {
            savedSections.push("Education");
          } else {
            failedSections.push("Education");
          }
        } catch (error) {
          failedSections.push("Education");
        }
      }

      // ========== STEP 6: Save Courses (PUT) ==========
      if (courseDetails && courseDetails.length > 0 && employeeId) {
        try {
          const courseResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationCourseCreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                created_by: userId,
                course_details: courseDetails.map((row) => ({
                  course_id: row.course_id || row.employee_course_id || 0,
                  course_name: row.course_name || row.courseName || "",
                  course_place: row.course_place || row.coursePlace || "",
                  date_from: row.date_from || row.dateFrom || "",
                  date_to: row.date_to || row.dateTo || "",
                  valid_upto: row.valid_upto || row.validUpTo || "",
                  course_results: row.course_results || row.grade || "",
                })),
              }),
            }
          );
          const courseResult = await courseResponse.json();
          if (courseResponse.ok && courseResult.message?.toLowerCase() === "success") {
            savedSections.push("Courses");
          } else {
            failedSections.push("Courses");
          }
        } catch (error) {
          failedSections.push("Courses");
        }
      }

      // ========== STEP 7: Save Languages (PUT) ==========
      if (languageData && employeeId) {
        try {
          const langResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationLANGUAGECreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                created_by: userId,
                employee_language_id: languageData.employee_language_id || 0,
                language_code: languageData.language_code || "",
              }),
            }
          );
          const langResult = await langResponse.json();
          if (langResponse.ok && langResult.message?.toLowerCase() === "success") {
            savedSections.push("Languages");
          } else {
            failedSections.push("Languages");
          }
        } catch (error) {
          failedSections.push("Languages");
        }
      }

      // ========== STEP 8: Save Experience (PUT) ==========
      if (experienceData && experienceData.length > 0 && employeeId) {
        try {
          const expResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationEXPERIENCECreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                created_by: parseInt(userId),
                experience_details: experienceData.map((item) => ({
                  experience_id: item.experience_id || 0,
                  previous_company_worked: item.previous_company_worked || item.organization || "",
                  date_from: item.date_from || item.monthYearFrom || "",
                  date_to: item.date_to || item.monthYearTo || "",
                  reason_for_leaving: item.reason_for_leaving || item.reasonForLeaving || "",
                  experience_letter_provided: item.experience_letter_provided || item.experienceLetterProvided || "",
                })),
              }),
            }
          );
          const expResult = await expResponse.json();
          if (expResponse.ok && expResult.message?.toLowerCase() === "success") {
            savedSections.push("Experience");
          } else {
            failedSections.push("Experience");
          }
        } catch (error) {
          failedSections.push("Experience");
        }
      }

      // ========== FINAL: Show Results ==========
      console.log("✅ Saved:", savedSections);
      console.log("❌ Failed:", failedSections);

      if (failedSections.length === 0) {
        alert("✅ Staff created successfully!");
        localStorage.removeItem("employeeId");
        localStorage.removeItem("employeeTypeId");
        window.location.href = "/admin/employee-search";
      } else {
        alert(`⚠️ Staff created with partial data:\n✅ Saved: ${savedSections.join(", ") || "None"}\n❌ Failed: ${failedSections.join(", ")}`);
      }
    } catch (error) {
      console.error("❌ Create Error:", error);
      alert(`❌ Error: ${error.message}\nSaved: ${savedSections.join(", ") || "None"}`);
    }
  };

  // ============================================
  // PHASE 2: UPDATE (PUT) - For EXISTING Staff
  // ============================================
  const handleUpdate = async () => {
    // Only allow update in edit mode
    if (!isEditMode) {
      alert("⚠️ Cannot use Update for new records. Please use Save button.");
      return;
    }

    const employeeId = localStorage.getItem("employeeId");
    const employeeTypeId = localStorage.getItem("employeeTypeId");
    const userId = sessionStorage.getItem("userId");
    const orgId = localStorage.getItem("orgId");
    const branchId = localStorage.getItem("branchId");

    if (!employeeId) {
      alert("❌ Employee ID not found. Cannot update.");
      return;
    }

    if (!userId) {
      alert("❌ User session expired. Please login again.");
      return;
    }

    console.log("=== 💾 Starting UPDATE Existing Staff (PUT) - VERSION 3.0 FIXED ===");
    console.log("📊 Current State Data:", {
      basicInfoData,
      addressFormData,
      documentDetails,
      relationDetails,
      educationData,
      courseDetails,
      languageData,
      experienceData,
    });

    let savedSections = [];
    let failedSections = [];

    // Helper to robustly map string values to IDs using metadata lists
    const mapVal = (v, list, keyParams = []) => {
      if (!v) return "";
      if (!isNaN(v)) return parseInt(v);
      const s = String(v).toLowerCase().trim();

      if (list && list.length > 0) {
        const found = list.find(item => {
          const keysToCheck = keyParams.length > 0 ? keyParams : Object.keys(item).filter(k => k.includes('name') || k.includes('code') || k.includes('desc'));
          return keysToCheck.some(k => String(item[k]).toLowerCase().trim() === s);
        });
        if (found) return found.id;
      }

      // Fallback to hardcoded map if list search fails (safety net)
      if (s === "o+") return 17;
      if (s === "male") return 5;
      if (s === "female") return 6;
      if (s === "hindu") return 5;
      if (s === "indian") return 3;

      return "";
    };

    try {
      // ========== STEP 1: Update Basic Info (POST with ID) ==========
      if (basicInfoData) {
        try {
          console.log("📝 Basic Info Data being sent:", basicInfoData);
          console.log("📝 Profile Picture type:", typeof basicInfoData.profilePicture, basicInfoData.profilePicture);

          const basicPayload = new FormData();
          basicPayload.append("id", employeeId);
          basicPayload.append("organization", orgId);
          basicPayload.append("branch", branchId);
          basicPayload.append("employee_code", basicInfoData.employeeCode || "");
          basicPayload.append("title", basicInfoData.title || "");
          basicPayload.append("first_name", basicInfoData.firstName || "");
          basicPayload.append("middle_name", basicInfoData.middleName || "");
          basicPayload.append("last_name", basicInfoData.lastName || "");
          basicPayload.append("nuid", basicInfoData.nuid || "");
          if (basicInfoData.dob) basicPayload.append("date_of_birth", basicInfoData.dob);
          basicPayload.append("place_of_birth", basicInfoData.placeOf_birth || "");
          basicPayload.append("marital_status", basicInfoData.maritalStatus || "1");
          basicPayload.append("gender", basicInfoData.gender || "");
          // Map status to is_active (backend expects "True"/"False" string or boolean)
          basicPayload.append("is_active", basicInfoData.status === "ACTIVE" ? "True" : "False");

          basicPayload.append("nationality", mapVal(basicInfoData.nationality, nationalities) || 3);
          basicPayload.append("religion", mapVal(basicInfoData.religion, religions) || 5);
          basicPayload.append("email", basicInfoData.email || "");
          basicPayload.append("phone_number", basicInfoData.phoneNumber || "");
          basicPayload.append("office_email", basicInfoData.officeEmail || "");
          basicPayload.append("employee_type", basicInfoData.employeeType || "");
          basicPayload.append("emergency_contact_number", basicInfoData.emergencyContactNumber || "");
          basicPayload.append("mother_tongue", basicInfoData.motherTongue || "");
          basicPayload.append("blood_group", mapVal(basicInfoData.bloodGroup, bloodGroups) || 17);
          basicPayload.append("batch", 1);
          basicPayload.append("created_by", userId);  // Backend requires this even for updates
          basicPayload.append("updated_by", userId);

          // Only append new profile picture file if user uploaded a new one
          if (basicInfoData.profilePicture && basicInfoData.profilePicture instanceof File) {
            basicPayload.append("profile_pic", basicInfoData.profilePicture);
            console.log("📝 Uploading new profile picture file");
          }

          const basicUrl = `${ApiUrl.apiurl}STAFF/RegistrationCreate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`;
          const basicResponse = await fetch(basicUrl, { method: "POST", body: basicPayload });
          const basicResult = await basicResponse.json();
          console.log("📝 Basic Info Update Response:", basicResult);

          if (basicResponse.ok && basicResult.message?.toLowerCase() === "success") {
            savedSections.push("Basic Info");
          } else {
            failedSections.push("Basic Info");
            console.error("❌ Basic Info Update Error:", basicResult);
          }
        } catch (error) {
          failedSections.push("Basic Info");
          console.error("❌ Basic Info Exception:", error);
        }
      }

      // ========== STEP 2: Update Address (PUT) ==========
      if (addressFormData && addressFormData.formValues) {
        try {
          const addressPayload = {
            present_address: addressFormData.formValues.residenceAddress || "",
            present_country: addressFormData.selectedCountry?.value || null,
            present_state: addressFormData.selectedState?.value || null,
            present_city: addressFormData.selectedResidenceDistrict?.value || null,
            present_pincode: addressFormData.formValues.residencePincode || "",
            present_phone_number: addressFormData.formValues.residencePhone || "",
            permanent_address: addressFormData.formValues.permanentAddress || "",
            permanent_country: addressFormData.selectedPermanentCountry?.value || null,
            permanent_state: addressFormData.selectedPermanentState?.value || null,
            permanent_city: addressFormData.selectedPermanentDistrict?.value || null,
            permanent_pincode: addressFormData.formValues.permanentPincode || "",
            permanent_phone_number: addressFormData.formValues.permanentPhone || "",
            created_by: userId,
            updated_by: userId,
          };

          const addressUrl = `${ApiUrl.apiurl}STAFF/RegistrationAddressCreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_type_id=${employeeTypeId}&employee_id=${employeeId}`;
          const addressResponse = await fetch(addressUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(addressPayload),
          });
          const addressResult = await addressResponse.json();
          console.log("📍 Address Update Response:", addressResult);
          if (addressResponse.ok && addressResult.message?.toLowerCase() === "success") {
            savedSections.push("Address");
          } else {
            failedSections.push("Address");
            console.error("❌ Address Update Error:", addressResult);
          }
        } catch (error) {
          failedSections.push("Address");
          console.error("❌ Address Exception:", error);
        }
      }

      // ========== STEP 3: Update Documents (PUT) ==========
      // Always send the update even if list is empty — backend will deactivate removed docs
      if (documentDetails !== null && documentDetails !== undefined) {
        try {
          const formData = new FormData();
          formData.append("created_by", userId);
          formData.append("updated_by", userId);
          const metadata = documentDetails.map((d) => {
            const hasFile = d.documentFile instanceof File;
            if (hasFile) {
              formData.append("document_files", d.documentFile);
            }
            // Map frontend camelCase to backend snake_case
            return {
              document_details_id: d.id || d.document_details_id || 0,
              document_type_id: d.documentType || d.document_type_id || "",
              document_number: d.documentNumber || d.document_number || "",
              valid_from: d.validFrom || d.valid_from || null,
              valid_to: d.validTo || d.valid_to || null,
              is_active: d.enabled !== undefined ? d.enabled : (d.is_active !== undefined ? d.is_active : true),
              has_file: hasFile,  // ✅ tells backend which rows have an uploaded file
              document_file: ""
            };
          });
          formData.append("document_details", JSON.stringify(metadata));

          const docResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationDocumentUploadCreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`,
            { method: "PUT", body: formData }
          );
          const docResult = await docResponse.json();
          console.log("📄 Document Update Response:", docResult);
          if (docResponse.ok && docResult.message?.toLowerCase() === "success") {
            savedSections.push("Documents");
          } else {
            failedSections.push("Documents");
            console.error("❌ Document Update Error:", docResult);
          }
        } catch (error) {
          failedSections.push("Documents");
        }
      }

      // ========== STEP 4: Update Family/Relations (PUT) ==========
      if (relationDetails && relationDetails.length > 0) {
        try {
          console.log("👨‍👩‍👧 Raw relationDetails:", relationDetails);

          const familyResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationFamilyRelationCreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                created_by: userId,
                updated_by: userId,
                family_details: relationDetails.map((item) => {
                  const mapped = {
                    family_details_id: item.family_detail_id || item.family_details_id || 0,
                    employee_relation: item.employee_relation || "",
                    relation_title: item.relation_title || "",
                    relation_first_name: item.relation_first_name || "",
                    relation_middle_name: item.relation_middle_name || "",
                    relation_last_name: item.relation_last_name || "",
                    relation_dob: item.relation_dob || "",
                    relation_gender: mapVal(item.relation_gender || item.relation_gender_id, genders) || 5, // Default to 5 (Male) if mapping fails
                    relation_marital_status: item.relation_marital_status || "",
                    relation_employed: item.relation_employed || "N",
                    relation_occupation: item.relation_occupation || "",
                    relation_dependent: item.relation_dependent !== undefined ? item.relation_dependent : 0,
                    relation_pf_nominee: item.relation_pf_nominee || "",
                    relation_pf_share: item.relation_pf_share || "",
                  };
                  console.log("👨‍👩‍👧 Mapped family item:", mapped);
                  return mapped;
                }),
              }),
            }
          );
          const familyResult = await familyResponse.json();
          console.log("👨‍👩‍👧 Family Update Response:", familyResult);
          if (familyResponse.ok && familyResult.message?.toLowerCase() === "success") {
            savedSections.push("Family");
          } else {
            failedSections.push("Family");
            console.error("❌ Family Update Error:", familyResult);
          }
        } catch (error) {
          failedSections.push("Family");
        }
      }

      // ========== STEP 5: Update Education (PUT) ==========
      if (educationData && educationData.length > 0) {
        try {
          const formatYearToDate = (year) => (!year || year.length !== 4 ? null : `${year}-01-01`);
          const eduResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationQualificationCreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                created_by: userId,
                updated_by: userId,
                qualifications_details: educationData.map((item) => ({
                  employee_qualification_id: item.employee_qualification_id || 0,
                  qualification: item.qualification,
                  highest_qualification: item.highest_qualification || item.highestQualification || "",
                  date_from: item.date_from || formatYearToDate(item.yearFrom),
                  date_to: item.date_to || formatYearToDate(item.yearTo),
                  university: item.university || "",
                  institution: item.institution || "",
                  marks: item.marks || item.div || "",
                })),
              }),
            }
          );
          const eduResult = await eduResponse.json();
          console.log("🎓 Education Update Response:", eduResult);
          if (eduResponse.ok && eduResult.message?.toLowerCase() === "success") {
            savedSections.push("Education");
          } else {
            failedSections.push("Education");
            console.error("❌ Education Update Error:", eduResult);
          }
        } catch (error) {
          failedSections.push("Education");
          console.error("❌ Education Exception:", error);
        }
      }

      // ========== STEP 6: Update Courses (PUT) ==========
      if (courseDetails && courseDetails.length > 0) {
        try {
          const courseResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationCourseCreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                created_by: userId,
                updated_by: userId,
                course_details: courseDetails.map((item) => ({
                  course_id: item.course_id || item.employee_course_id || 0,
                  course_name: item.course_name || item.courseName || "",
                  course_place: item.course_place || item.coursePlace || "",
                  date_from: item.date_from || item.dateFrom || "",
                  date_to: item.date_to || item.dateTo || "",
                  valid_upto: item.valid_upto || item.validUpTo || "",
                  course_results: item.course_results || item.grade || "",
                })),
              }),
            }
          );
          const courseResult = await courseResponse.json();
          console.log("📚 Courses Update Response:", courseResult);
          if (courseResponse.ok && courseResult.message?.toLowerCase() === "success") {
            savedSections.push("Courses");
          } else {
            failedSections.push("Courses");
            console.error("❌ Courses Update Error:", courseResult);
          }
        } catch (error) {
          failedSections.push("Courses");
          console.error("❌ Courses Exception:", error);
        }
      }

      // ========== STEP 7: Update Languages (PUT) ==========
      if (languageData) {
        try {
          const langResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationLANGUAGECreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                created_by: userId,
                updated_by: userId,
                employee_language_id: languageData.employee_language_id || 0,
                language_code: languageData.language_code || "",
              }),
            }
          );
          const langResult = await langResponse.json();
          console.log("🗣️ Languages Update Response:", langResult);
          if (langResponse.ok && langResult.message?.toLowerCase() === "success") {
            savedSections.push("Languages");
          } else {
            failedSections.push("Languages");
            console.error("❌ Languages Update Error:", langResult);
          }
        } catch (error) {
          failedSections.push("Languages");
          console.error("❌ Languages Exception:", error);
        }
      }

      // ========== STEP 8: Update Experience (PUT) ==========
      if (experienceData && experienceData.length > 0) {
        try {
          const expResponse = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationEXPERIENCECreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                created_by: userId,
                updated_by: parseInt(userId),
                experience_details: experienceData.map((item) => ({
                  experience_id: item.experience_id || 0,
                  previous_company_worked: item.previous_company_worked || item.organization || "",
                  date_from: item.date_from || item.monthYearFrom || "",
                  date_to: item.date_to || item.monthYearTo || "",
                  reason_for_leaving: item.reason_for_leaving || item.reasonForLeaving || "",
                  experience_letter_provided: item.experience_letter_provided || item.experienceLetterProvided || "",
                })),
              }),
            }
          );
          const expResult = await expResponse.json();
          console.log("💼 Experience Update Response:", expResult);
          if (expResponse.ok && expResult.message?.toLowerCase() === "success") {
            savedSections.push("Experience");
          } else {
            failedSections.push("Experience");
            console.error("❌ Experience Update Error:", expResult);
          }
        } catch (error) {
          failedSections.push("Experience");
          console.error("❌ Experience Exception:", error);
        }
      }

      // ========== FINAL: Show Results ==========
      console.log("✅ Updated:", savedSections);
      console.log("❌ Failed:", failedSections);

      if (failedSections.length === 0) {
        alert("✅ Staff updated successfully!");
        localStorage.removeItem("employeeId");
        localStorage.removeItem("employeeTypeId");
        window.location.href = "/admin/employee-search";
      } else {
        alert(`⚠️ Partial update:\n✅ Updated: ${savedSections.join(", ") || "None"}\n❌ Failed: ${failedSections.join(", ")}`);
      }
    } catch (error) {
      console.error("❌ Update Error:", error);
      alert(`❌ Error: ${error.message}\nUpdated: ${savedSections.join(", ") || "None"}`);
    }
  };

  const handleClear = () => {
    setExperienceData([]);
    setAddressDetails(null);
    setAddressFormData(null);
    setBasicInfoData(null);
    setDocumentDetails([]);
    setRelationDetails([]);
    setEducationData([]);
    setCourseDetails([]);
    setLanguageData(null);
    localStorage.removeItem("employeeId");
    localStorage.removeItem("employeeTypeId");
    sessionStorage.removeItem("tempFormData");
    sessionStorage.removeItem("tempFrontCover");
    setValue(0);
    alert("Form cleared successfully!");
  };

  const handleClose = () => {
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
            disabled={isEditMode}
          >
            Save
          </button>
          <button
            className="btn btn-primary me-2"
            style={{ width: "150px" }}
            onClick={handleUpdate}
            disabled={!isEditMode}
          >
            Update
          </button>
          <button className="btn btn-secondary me-2" style={{ width: "150px" }} onClick={handleClear}>
            Clear
          </button>
          <button className="btn btn-danger me-2" style={{ width: "150px" }} onClick={handleClose}>
            Close
          </button>
        </div>
      </div>

      <Tabs value={value} onChange={handleChange}>
        <Tab label="Staff Basic Info" {...a11yProps(0)} />
        <Tab label="Address" {...a11yProps(1)} />
        <Tab label="Documents" {...a11yProps(2)} />
        <Tab label="Family" {...a11yProps(3)} />
        <Tab label="Educational" {...a11yProps(4)} />
        <Tab label="Courses" {...a11yProps(5)} />
        <Tab label="Languages Known" {...a11yProps(6)} />
        <Tab label="Previous Experience" {...a11yProps(7)} />
      </Tabs>

      <CustomTabPanel value={value} index={0}>
        <StaffBasicInfo goToTab={goToTab} setAddressDetails={setAddressDetails} setBasicInfoDataInParent={setBasicInfoData} basicInfoData={basicInfoData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <AdmAddress goToTab={goToTab} addressDetails={addressDetails} setDocumentDetailsInParent={setDocumentDetails} setAddressFormDataInParent={setAddressFormData} addressFormData={addressFormData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <DocumentDetails goToTab={goToTab} documentDetails={documentDetails} setRelationDetailsInParent={setRelationDetails} setDocumentDetails={setDocumentDetails} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <FamilyDetails goToTab={goToTab} relationDetails={relationDetails} setEducationDetailsInParent={setEducationData} setRelationDetails={setRelationDetails} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <EducationalDetails goToTab={goToTab} educationData={educationData} setCourseDetailsInParent={setCourseDetails} setEducationData={setEducationData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <Courses goToTab={goToTab} prefilledCourses={courseDetails} setLanguageDataInParent={setLanguageData} setCourseDetails={setCourseDetails} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        <LanguagesKnown goToTab={goToTab} languageData={languageData} setExperienceDataInParent={setExperienceData} setLanguageData={setLanguageData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={7}>
        <PreviousExperience goToTab={goToTab} setExperienceData={setExperienceData} experienceData={experienceData} />
      </CustomTabPanel>

      {/* Arrow Navigation */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <IconButton
          onClick={handlePrevious}
          disabled={value === 0}
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          onClick={handleNext}
          disabled={value === maxTabIndex}
          sx={{ ml: 1 }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
