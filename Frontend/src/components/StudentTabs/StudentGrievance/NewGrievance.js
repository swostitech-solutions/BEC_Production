import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import "./NewGrievance.css";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ApiUrl } from "../../../ApiUrl";

const AdmAttendanceEntry = () => {
  const navigate = useNavigate();
 
  // const placementData = location.state?.placementData || {}; // Retrieve passed data
   const [typeOptions, setTypeOptions] = useState([]);
   const [severityOptions, setSeverityOptions] = useState([]);
   const [priorityOptions, setPriorityOptions] = useState([]);

   const [selectedType, setSelectedType] = useState(null);
   const [selectedSeverity, setSelectedSeverity] = useState(null);
   const [selectedPriority, setSelectedPriority] = useState(null);
   const [grievanceDetails, setGrievanceDetails] = useState("");
   const [isAnonymous, setIsAnonymous] = useState(false);
   const [uploadFile, setUploadFile] = useState(null);
   
   // Student data from API
   const [studentData, setStudentData] = useState({
     batch_id: null,
     course_id: null,
     department_id: null,
     semester_id: null,
     section_id: null,
     academic_year_id: null,
   });
   const [studentDataLoaded, setStudentDataLoaded] = useState(false);
   
   const fileInputRef = useRef(null);

   useEffect(() => {
     const orgId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId") || "";
     const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId") || "";
     const token = localStorage.getItem("accessToken");

     if (!orgId || !branchId) {
       console.error("Missing organization_id or branch_id");
       return;
     }

    const fetchOptions = async (url, setOptions, valueKey, labelKey) => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data && data.message === "success" && data.data && Array.isArray(data.data)) {
          // Log the first item to see the actual field names
          if (data.data.length > 0) {
            console.log(`API response for ${labelKey}:`, data.data[0]);
            console.log(`Available fields:`, Object.keys(data.data[0]));
          }
          
          // Try to find the value and label fields, with fallbacks
          const mappedOptions = data.data.map((item) => {
            // Try primary field name first, then common alternatives
            const value = item[valueKey] ?? 
                         item[valueKey.toLowerCase()] ?? 
                         item[valueKey.replace('_id', 'Id')] ??
                         item.id ?? 
                         item[`${valueKey.split('_')[0]}_id`];
            
            const label = item[labelKey] ?? 
                          item[labelKey.toLowerCase()] ?? 
                          item[labelKey.replace('_', '')] ??
                          item.name ?? 
                          item.description;
            
            if (value === undefined || value === null) {
              console.warn(`Missing value for ${labelKey} option:`, item);
            }
            if (label === undefined || label === null) {
              console.warn(`Missing label for ${labelKey} option:`, item);
            }
            
            return {
              value: value,
              label: label || `Option ${value}`,
            };
          }).filter(option => option.value !== undefined && option.value !== null);
          
          console.log(`Mapped ${labelKey} options:`, mappedOptions);
          setOptions(mappedOptions);
        }
      } catch (error) {
        console.error(`Error fetching ${labelKey} options:`, error);
      }
    };

     fetchOptions(
       `${ApiUrl.apiurl}GrievanceType/list/?organization_id=${orgId}&branch_id=${branchId}`,
       setTypeOptions,
       "grievance_type_id",
       "grievance_type"
     );
     fetchOptions(
       `${ApiUrl.apiurl}GrievanceSeverity/list/?organization_id=${orgId}&branch_id=${branchId}`,
       setSeverityOptions,
       "severity_id",
       "severity_type"
     );
    fetchOptions(
      `${ApiUrl.apiurl}GrievancePriority/list/?organization_id=${orgId}&branch_id=${branchId}`,
      setPriorityOptions,
      "grievance_priority_id",
      "priority_type"
    );
   }, []);

  // Fetch student data from API
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
        const organizationId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId");
        const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");
        const token = localStorage.getItem("accessToken");

        if (!studentId || !organizationId || !branchId || !token) {
          setStudentDataLoaded(true);
          return;
        }

        // Use StudentCourseRecordFilter endpoint to get student course data
        const url = `${ApiUrl.apiurl}StudentCourse/StudentCourseRecordFilter/?organization_id=${organizationId}&branch_id=${branchId}&student_id=${studentId}`;
        
        console.log("Fetching student data from:", url);
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error(`Failed to fetch student data: ${response.status} ${response.statusText}`);
          setStudentDataLoaded(true);
          return;
        }

        const result = await response.json();
        console.log("Student data API response:", result);

        let studentRecord = null;

        // Check if API returned "No Record Found!!"
        if (result.message === "No Record Found!!" || result.message === "No Record Found") {
          console.warn("No student course record found in API");
        } else {
          // Handle different response structures
          if (result.data) {
            if (Array.isArray(result.data) && result.data.length > 0) {
              // StudentCourseRecordFilter returns an array, get the first (most recent) record
              studentRecord = result.data[0];
            } else if (typeof result.data === 'object' && !Array.isArray(result.data)) {
              // Single object response
              studentRecord = result.data;
            }
          } else if (result.message === "Success" && result.data) {
            // Alternative response structure
            studentRecord = result.data;
          }
        }

        // Extract student data from the record
        if (studentRecord) {
          console.log("Extracted student record:", studentRecord);
          console.log("Available fields in student record:", Object.keys(studentRecord));
          
          // Check for alternative field names for section_id
          const sectionId = studentRecord.section_id ?? 
                           studentRecord.section ?? 
                           studentRecord.sectionId ?? 
                           null;
          
          console.log("Section ID found:", sectionId, "from fields:", {
            section_id: studentRecord.section_id,
            section: studentRecord.section,
            sectionId: studentRecord.sectionId
          });
          
          setStudentData({
            batch_id: studentRecord.batch_id ?? studentRecord.batch ?? studentRecord.batchId ?? null,
            course_id: studentRecord.course_id ?? studentRecord.course ?? studentRecord.courseId ?? null,
            department_id: studentRecord.department_id ?? studentRecord.department ?? studentRecord.departmentId ?? null,
            semester_id: studentRecord.semester_id ?? studentRecord.semester ?? studentRecord.semesterId ?? null,
            section_id: sectionId,
            academic_year_id: studentRecord.academic_year_id ?? studentRecord.academic_year ?? studentRecord.academicYearId ?? null,
          });
        } else {
          console.warn("No student record found in API response, checking sessionStorage/localStorage");
          // Fallback: try to get from sessionStorage/localStorage if API didn't return data
          const batchId = sessionStorage.getItem("batch_id") || localStorage.getItem("batchId");
          const courseId = sessionStorage.getItem("course_id") || localStorage.getItem("courseId");
          const departmentId = sessionStorage.getItem("department_id") || localStorage.getItem("departmentId");
          const semesterId = sessionStorage.getItem("semester_id") || localStorage.getItem("semesterId");
          const sectionId = sessionStorage.getItem("section_id") || localStorage.getItem("sectionId");
          
          const academicYearId = sessionStorage.getItem("academic_year_id") || localStorage.getItem("academicYearId");
          
          if (batchId || courseId || departmentId || semesterId || sectionId || academicYearId) {
            console.log("Using fallback values from storage");
            setStudentData({
              batch_id: batchId ? parseInt(batchId) : null,
              course_id: courseId ? parseInt(courseId) : null,
              department_id: departmentId ? parseInt(departmentId) : null,
              semester_id: semesterId ? parseInt(semesterId) : null,
              section_id: sectionId ? parseInt(sectionId) : null,
              academic_year_id: academicYearId ? parseInt(academicYearId) : null,
            });
          } else {
            console.error("No student course data available from API or storage");
          }
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        // On error, try fallback from storage
        const batchId = sessionStorage.getItem("batch_id") || localStorage.getItem("batchId");
        const courseId = sessionStorage.getItem("course_id") || localStorage.getItem("courseId");
        const departmentId = sessionStorage.getItem("department_id") || localStorage.getItem("departmentId");
        const semesterId = sessionStorage.getItem("semester_id") || localStorage.getItem("semesterId");
        const sectionId = sessionStorage.getItem("section_id") || localStorage.getItem("sectionId");
        const academicYearId = sessionStorage.getItem("academic_year_id") || localStorage.getItem("academicYearId");
        
        if (batchId || courseId || departmentId || semesterId || sectionId || academicYearId) {
          setStudentData({
            batch_id: batchId ? parseInt(batchId) : null,
            course_id: courseId ? parseInt(courseId) : null,
            department_id: departmentId ? parseInt(departmentId) : null,
            semester_id: semesterId ? parseInt(semesterId) : null,
            section_id: sectionId ? parseInt(sectionId) : null,
            academic_year_id: academicYearId ? parseInt(academicYearId) : null,
          });
        }
      } finally {
        setStudentDataLoaded(true);
      }
    };

    fetchStudentData();
  }, []);

  const handleSave = async () => {
    // Validation
    if (!selectedType) {
      alert("Please select a grievance type");
      return;
    }
    if (!selectedSeverity) {
      alert("Please select severity");
      return;
    }
    if (!selectedPriority) {
      alert("Please select priority");
      return;
    }
    if (!grievanceDetails.trim()) {
      alert("Please enter grievance details");
      return;
    }

    const token = localStorage.getItem("accessToken");
    const studentId = sessionStorage.getItem("userId") || localStorage.getItem("userId") || "";
    const orgId = sessionStorage.getItem("organization_id") || localStorage.getItem("orgId") || "";
    const branchId = sessionStorage.getItem("branch_id") || localStorage.getItem("branchId") || "";
    
    // Use student data from API, fallback to sessionStorage/localStorage
    // Use nullish coalescing (??) to preserve 0 values
    const batchId = studentData.batch_id ?? sessionStorage.getItem("batch_id") ?? localStorage.getItem("batchId") ?? "";
    const courseId = studentData.course_id ?? sessionStorage.getItem("course_id") ?? localStorage.getItem("courseId") ?? "";
    const departmentId = studentData.department_id ?? sessionStorage.getItem("department_id") ?? localStorage.getItem("departmentId") ?? "";
    const semesterId = studentData.semester_id ?? sessionStorage.getItem("semester_id") ?? localStorage.getItem("semesterId") ?? "";
    const sectionId = studentData.section_id ?? sessionStorage.getItem("section_id") ?? localStorage.getItem("sectionId") ?? "";
    const academicYearId = studentData.academic_year_id ?? sessionStorage.getItem("academic_year_id") ?? localStorage.getItem("academicYearId") ?? sessionStorage.getItem("academicSessionId") ?? localStorage.getItem("academicSessionId") ?? "";

    // Debug logging
    console.log("Student data values before validation:", {
      batch_id: batchId,
      course_id: courseId,
      department_id: departmentId,
      semester_id: semesterId,
      section_id: sectionId,
      academic_year_id: academicYearId,
      studentData: studentData
    });

    // Validate required integer fields
    // Note: section_id might be null/0 for some students, so we'll handle it separately
    const requiredFields = {
      batch_id: batchId,
      course_id: courseId,
      department_id: departmentId,
      semester_id: semesterId,
      academic_year_id: academicYearId,
    };

    const missingFields = [];
    for (const [field, value] of Object.entries(requiredFields)) {
      // Allow 0 as a valid value, but check for null, undefined, empty string, or NaN
      const numValue = typeof value === "string" ? value.trim() : value;
      if (numValue === null || numValue === undefined || numValue === "" || (numValue !== 0 && isNaN(parseInt(numValue)))) {
        missingFields.push(field);
        console.warn(`Missing field: ${field}, value:`, value, "type:", typeof value);
      }
    }

    // Check section_id separately - it might be null/0, but we still need to validate it
    const sectionIdValue = typeof sectionId === "string" ? sectionId.trim() : sectionId;
    if (sectionIdValue === null || sectionIdValue === undefined || sectionIdValue === "" || (sectionIdValue !== 0 && sectionIdValue !== "0" && isNaN(parseInt(sectionIdValue)))) {
      missingFields.push("section_id");
      console.warn(`Missing field: section_id, value:`, sectionId, "type:", typeof sectionId);
    }

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      console.error("Current studentData state:", studentData);
      console.error("Values from storage:", {
        batch_id: sessionStorage.getItem("batch_id") || localStorage.getItem("batchId"),
        course_id: sessionStorage.getItem("course_id") || localStorage.getItem("courseId"),
        department_id: sessionStorage.getItem("department_id") || localStorage.getItem("departmentId"),
        semester_id: sessionStorage.getItem("semester_id") || localStorage.getItem("semesterId"),
        section_id: sessionStorage.getItem("section_id") || localStorage.getItem("sectionId"),
        academic_year_id: sessionStorage.getItem("academic_year_id") || localStorage.getItem("academicYearId") || sessionStorage.getItem("academicSessionId") || localStorage.getItem("academicSessionId"),
      });
      alert(`Unable to submit grievance: Missing required student course information (${missingFields.join(", ")}).\n\nPlease contact your administrator to ensure your course enrollment is properly configured.`);
      return;
    }

    const formData = new FormData();
    
    // Ensure grievance IDs are valid integers
    // Helper function to safely parse integer values
    const parseInteger = (value) => {
      if (value === null || value === undefined) return null;
      if (typeof value === 'number') return isNaN(value) ? null : value;
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? null : parsed;
    };
    
    const grievanceTypeId = parseInteger(selectedType?.value);
    const grievancePriorityId = parseInteger(selectedPriority?.value);
    const grievanceSeverityId = parseInteger(selectedSeverity?.value);
    
    // Debug logging
    console.log("Grievance values:", {
      selectedType: selectedType,
      selectedPriority: selectedPriority,
      selectedSeverity: selectedSeverity,
      grievanceTypeId,
      grievancePriorityId,
      grievanceSeverityId
    });
    
    // Validate: check for null/undefined (0 is a valid value)
    if (grievanceTypeId === null || grievanceTypeId === undefined) {
      console.error("Invalid grievance type:", selectedType);
      alert("Invalid grievance type selected");
      return;
    }
    if (grievancePriorityId === null || grievancePriorityId === undefined) {
      console.error("Invalid grievance priority:", selectedPriority, "parsed value:", grievancePriorityId);
      alert("Invalid grievance priority selected");
      return;
    }
    if (grievanceSeverityId === null || grievanceSeverityId === undefined) {
      console.error("Invalid grievance severity:", selectedSeverity);
      alert("Invalid grievance severity selected");
      return;
    }
    
    formData.append("grievance_type_id", grievanceTypeId);
    formData.append("grievance_priority_id", grievancePriorityId);
    formData.append("grievance_severity_id", grievanceSeverityId);
    formData.append("details", grievanceDetails);
    formData.append("is_anonymous", isAnonymous ? "true" : "false");
    if (uploadFile) {
      formData.append("upload_file", uploadFile);
    }
    formData.append("student_id", studentId);
    formData.append("created_by", studentId);
    formData.append("organization_id", orgId);
    formData.append("branch_id", branchId);
    // Convert to integers to ensure valid values
    // Note: Validation above ensures these are valid numbers
    formData.append("batch_id", parseInt(batchId, 10));
    formData.append("course_id", parseInt(courseId, 10));
    formData.append("department_id", parseInt(departmentId, 10));
    formData.append("semester_id", parseInt(semesterId, 10));
    formData.append("section_id", parseInt(sectionId, 10));
    formData.append("academic_year_id", parseInt(academicYearId, 10));

    try {
      const response = await fetch(`${ApiUrl.apiurl}Grievance/create/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await response.json();
      
      if (response.ok && (result.message === "success" || result.message === "Grievance created successfully")) {
        alert("Grievance submitted successfully!");
        handleClear();
        navigate("/student/grievance");
      } else {
        alert(result.error || result.message || "Failed to submit grievance");
      }
    } catch (error) {
      console.error("Error submitting grievance:", error);
      alert("Submission failed! Please try again.");
    }
  };


  const handleClear = () => {
    setSelectedType(null);
    setSelectedSeverity(null);
    setSelectedPriority(null);
    setGrievanceDetails("");
    setIsAnonymous(false);
    setUploadFile(null);

    // Reset file input field
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-2">
            <div className="card-body">
              <p
                className="text-center fw-bold mb-3"
                style={{ fontSize: "18px" }}
              >
                STUDENT GRIEVANCES
              </p>
              <div className="row mb-3 mt-3  mx-0">
                <div div className="col-12 d-flex flex-wrap gap-2">
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
                    onClick={() => navigate("/student/grievance")}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 form-container custom-section-box">
                  <div className="form-grid mt-4 mx-2  mb-4">
                    {/* Left Column - Labels */}
                    <div className="form-labels">
                      <label>Type </label>
                      <label>Severity </label>
                      <label>Priority </label>
                      <label>Grievance Details</label>
                      <label>Upload </label>
                      <label></label> {/* Empty label for alignment */}
                    </div>

                    {/* Right Column - Input Fields */}
                    <div className="form-inputs">
                      <Select
                        options={typeOptions}
                        classNamePrefix="custom-select"
                        value={selectedType}
                        onChange={setSelectedType}
                      />
                      <Select
                        options={severityOptions}
                        classNamePrefix="custom-select"
                        value={selectedSeverity}
                        onChange={setSelectedSeverity}
                      />
                      <Select
                        options={priorityOptions}
                        classNamePrefix="custom-select"
                        value={selectedPriority}
                        onChange={setSelectedPriority}
                      />

                      <input
                        type="text"
                        name="grievanceDetails"
                        className="input-field"
                        style={{ textAlign: "left" }} // Ensuring text starts from the left
                        value={grievanceDetails}
                        onChange={(e) => setGrievanceDetails(e.target.value)}
                      />

                      <input
                        type="file"
                        name="upload"
                        className="input-field"
                        onChange={(e) => setUploadFile(e.target.files[0])}
                      />

                      {/* Checkbox for Anonymous Submission */}
                      <div className="checkbox-container">
                        <input
                          type="checkbox"
                          id="anonymousCheckbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          ref={fileInputRef}
                        />
                        <label htmlFor="anonymousCheckbox">
                          Submit as Anonymous User
                        </label>
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
export default AdmAttendanceEntry;



