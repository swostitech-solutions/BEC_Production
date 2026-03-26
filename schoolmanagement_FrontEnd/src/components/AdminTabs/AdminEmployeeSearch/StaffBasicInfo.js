import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Image } from "react-bootstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import useFetchNationalities from "../../hooks/useFetchNationalities";
import useFetchBloodGroups from "../../hooks/useFetchBloodGroups";
import useFetchReligions from "../../hooks/useFetchReligions";
import useFetchLanguages from "../../hooks/useFetchLanguages";
import { ApiUrl } from "../../../ApiUrl";
import { useLocation } from "react-router-dom";

const StaffInfo = ({
  goToTab,
  setAddressDetails,
  setBasicInfoDataInParent,
  basicInfoData,
  requiredErrors = {},
  setRequiredErrors,
}) => {
  // const [frontCover, setFrontCover] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeDetails } = location.state || {};
  const [addressData, setAddressData] = useState(null);

  const { nationalities } = useFetchNationalities();
  const { bloodGroups } = useFetchBloodGroups();
  const { religions } = useFetchReligions();
  const { data: languages } = useFetchLanguages();
  const [employeeTypeOptions, setEmployeeTypeOptions] = useState([]);
  const [genders, setGenders] = useState([]);

  const [formData, setFormData] = useState(() => {
    // Initialize from basicInfoData if available (for when user returns to tab)
    if (basicInfoData && Object.keys(basicInfoData).length > 0 && basicInfoData.firstName) {
      return basicInfoData;
    }
    // Otherwise use default empty state
    return {
      employeeId: "",
      orgId: "",
      branchId: "",
      location: "JAYDEV VIHAR",
      employeeCode: "",
      nuid: "",
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      placeOfBirth: "",
      maritalStatus: "",
      bloodGroup: "",
      nationality: "",
      religion: "",
      gender: "",
      motherTongue: "",
      employeeType: "",
      email: "",
      officeEmail: "",
      phoneNumber: "",
      emergencyContactNumber: "",
      status: "ACTIVE",
      createdBy: "",
      profilePicture: null,
    };
  });

  // Validation errors for phone fields
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [emergencyContactError, setEmergencyContactError] = useState("");

  // Initialize frontCover from basicInfoData if available
  // Priority: preview from new upload > existing DB path
  const [frontCover, setFrontCover] = useState(() => {
    if (basicInfoData) {
      // profilePicturePreview holds the base64 of a newly uploaded pic
      if (basicInfoData.profilePicturePreview && typeof basicInfoData.profilePicturePreview === 'string') {
        return basicInfoData.profilePicturePreview;
      }
      const picUrl = basicInfoData.profile_photo_path || basicInfoData.profilePicture;
      if (picUrl && typeof picUrl === 'string' && picUrl.length > 0) {
        return picUrl;
      }
    }
    return null;
  });

  // Use ref to track if we've initialized from basicInfoData to prevent infinite loop
  const hasInitialized = React.useRef(false);

  // Update formData and frontCover when basicInfoData changes (only once in edit mode)
 useEffect(() => {
   if (hasInitialized.current) return;

   // ✅ WAIT until all dropdown data is loaded
   if (
     !employeeDetails ||
     bloodGroups.length === 0 ||
     nationalities.length === 0 ||
     religions.length === 0 ||
     languages.length === 0
   ) {
     return;
   }

   console.log("🔥 Mapping after dropdown data loaded");

   const bloodGroupObj = bloodGroups.find(
     (bg) =>
       bg.id === parseInt(employeeDetails.blood_group) ||
       (bg.blood_name || "").toLowerCase().trim() ===
         (employeeDetails.blood_group || "").toString().toLowerCase().trim(),
   );

   const nationalityObj = nationalities.find(
     (n) =>
       n.id === parseInt(employeeDetails.nationality) ||
       (n.nationality_name || "").toLowerCase().trim() ===
         (employeeDetails.nationality || "").toString().toLowerCase().trim(),
   );

   const religionObj = religions.find(
     (r) =>
       r.id === parseInt(employeeDetails.religion) ||
       (r.religion_name || "").toLowerCase().trim() ===
         (employeeDetails.religion || "").toString().toLowerCase().trim(),
   );

   const motherTongueObj = languages.find(
     (l) =>
       l.id === parseInt(employeeDetails.mother_tongue) ||
       (l.mother_tongue_name || "").toLowerCase().trim() ===
         (employeeDetails.mother_tongue || "").toString().toLowerCase().trim(),
   );

   hasInitialized.current = true;

   setFormData((prev) => ({
     ...prev,
     employeeId: employeeDetails.id || "",
     employeeCode: employeeDetails.employee_code || "",
     title: employeeDetails.title || "",
     firstName: employeeDetails.first_name || "",
     middleName: employeeDetails.middle_name || "",
     lastName: employeeDetails.last_name || "",
     dob: employeeDetails.date_of_birth || "",
     placeOfBirth: employeeDetails.place_of_birth || "",
     maritalStatus: employeeDetails.marital_status || "",

     // ✅ FIXED mapping
     bloodGroup: bloodGroupObj ? bloodGroupObj.id : "",
     nationality: nationalityObj ? nationalityObj.id : "",
     religion: religionObj ? religionObj.id : "",
     motherTongue: motherTongueObj ? motherTongueObj.id : "",

     gender: employeeDetails.gender_id
       ? parseInt(employeeDetails.gender_id)
       : "",

     employeeType:
       employeeDetails.employee_type_id || employeeDetails.employee_type || "",

     email: employeeDetails.email || "",
     officeEmail: employeeDetails.office_email || "",
     phoneNumber: employeeDetails.phone_number || "",
     emergencyContactNumber: employeeDetails.emergency_contact_number || "",

     status: employeeDetails.is_active ? "ACTIVE" : "INACTIVE",
     profilePicture: employeeDetails.profile || "",
   }));

   setFrontCover(employeeDetails.profile || "");
 }, [employeeDetails, bloodGroups, nationalities, religions, languages]);

  // Sync data to parent whenever formData or frontCover changes
  useEffect(() => {
    if (setBasicInfoDataInParent) {
      // Send the File object (formData.profilePicture) not the base64 preview (frontCover)
      // frontCover is only for preview display, formData.profilePicture is the actual File for upload
      setBasicInfoDataInParent(formData);
    }
  }, [formData, setBasicInfoDataInParent]);


  useEffect(() => {
    // If the component has already initialized from the full database fetch (basicInfoData),
    // DO NOT allow the location.state (employeeDetails) to overwrite the verified data!
    if (hasInitialized.current) {
        return;
    }

    if (employeeDetails) {
      const bloodGroupObj = bloodGroups.find(
        (bg) =>
          bg.id === parseInt(employeeDetails.blood_group) ||
          (bg.blood_name || "").toLowerCase().trim() === (employeeDetails.blood_group || "").toString().toLowerCase().trim() ||
          (bg.blood_code || "").toLowerCase().trim() === (employeeDetails.blood_group || "").toString().toLowerCase().trim() ||
          (bg.blood_group_name || "").toLowerCase().trim() === (employeeDetails.blood_group || "").toString().toLowerCase().trim()
      );
      const nationalityObj = nationalities.find(
        (n) =>
          n.id === parseInt(employeeDetails.nationality) ||
          (n.nationality_name || "").toLowerCase().trim() === (employeeDetails.nationality || "").toString().toLowerCase().trim() ||
          (n.nationality_code || "").toLowerCase().trim() === (employeeDetails.nationality || "").toString().toLowerCase().trim()
      );

      const religionObj = religions.find(
        (r) =>
          r.id === parseInt(employeeDetails.religion) ||
          (r.religion_name || "").toLowerCase().trim() === (employeeDetails.religion || "").toString().toLowerCase().trim() ||
          (r.religion_code || "").toLowerCase().trim() === (employeeDetails.religion || "").toString().toLowerCase().trim()
      );
      const motherTongueObj = languages.find(
        (l) =>
          l.id === parseInt(employeeDetails.mother_tongue) ||
          (l.mother_tongue_name || "").toLowerCase().trim() === (employeeDetails.mother_tongue || "").toString().toLowerCase().trim() ||
          (l.mother_tongue_code || "").toLowerCase().trim() === (employeeDetails.mother_tongue || "").toString().toLowerCase().trim()
      );

      // Map gender text to ID
      const genderOptions = [
        { value: "1", label: "Male" },
        { value: "2", label: "Female" },
      ];
      let genderValue = employeeDetails.gender || "";
      // If gender is text like "Male" or "Female", convert to ID
      if (genderValue && isNaN(genderValue)) {
        const genderObj = genderOptions.find(
          (g) => g.label.toLowerCase() === genderValue.toLowerCase()
        );
        genderValue = genderObj ? genderObj.value : genderValue;
      }

      //  Directly use employee_type_id
      setFormData(prev => ({
        ...prev,
        employeeId: employeeDetails.id || "",
        employeeCode: employeeDetails.employee_code || "",
        nuid: employeeDetails.nuid || "",
        title: employeeDetails.title || "",
        firstName: employeeDetails.first_name || "",
        middleName: employeeDetails.middle_name || "",
        lastName: employeeDetails.last_name || "",
        dob: employeeDetails.date_of_birth || employeeDetails.dob || "",
        placeOfBirth: employeeDetails.place_of_birth || "",
        maritalStatus: employeeDetails.marital_status || "",
        bloodGroup: bloodGroupObj ? bloodGroupObj.id : "",
        nationality: nationalityObj ? nationalityObj.id : "",
        religion: religionObj ? religionObj.id : "",
        gender: employeeDetails.gender_id ? parseInt(employeeDetails.gender_id) : "",
        motherTongue: employeeDetails.mother_tongue_id ? parseInt(employeeDetails.mother_tongue_id) : "",

        //  Directly assign employee_type_id
        employeeType: employeeDetails.employee_type_id || employeeDetails.employee_type || "",

        email: employeeDetails.email || "",
        officeEmail: employeeDetails.office_email || "",
        phoneNumber: employeeDetails.phone_number || "",
        emergencyContactNumber: employeeDetails.emergency_contact_number || "",
        status: employeeDetails.hasOwnProperty('is_active') 
                  ? (employeeDetails.is_active ? "ACTIVE" : "INACTIVE") 
                  : (employeeDetails.status ? String(employeeDetails.status).toUpperCase() : "ACTIVE"),
        profilePicture: employeeDetails.profile || "",
      }));

      // Set profile image preview
      setFrontCover(employeeDetails.profile || "");
    }
  }, [
    employeeDetails,
    bloodGroups,
    nationalities,
    religions,
    languages,
    employeeTypeOptions,
  ]);


  const titleOptions = [
    { value: "MR", label: "MR" },
    { value: "Ms", label: "Ms" },
    { value: "Mrs", label: "Mrs" },
  ];

  const maritalStatusOptions = [
    { value: "1", label: "Single" },
    { value: "2", label: "Married" },
  ];

  const handleFrontCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setFrontCover(base64); // Preview as base64
        // Also persist the preview in formData so parent stores it
        // and it can be restored when user navigates back to this tab
        setFormData((prev) => ({
          ...prev,
          profilePicture: file,
          profilePicturePreview: base64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearRequiredError = (fieldName) => {
    if (!setRequiredErrors || !requiredErrors[fieldName]) return;
    setRequiredErrors((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  };

  useEffect(() => {
    fetch(`${ApiUrl.apiurl}Staff/EmployeeTypeList/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Success") {
          const options = data.data.map((item) => ({
            value: item.id, // new field in your response
            label: item.employee_type_description, // updated label
          }));
          setEmployeeTypeOptions(options);
        }
      })
      .catch((err) => {
        console.error("Error fetching employee types:", err);
      });
  }, []);

  // Fetch genders from API
  useEffect(() => {
    fetch(`${ApiUrl.apiurl}Gender/GetAllGenderList/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Success") {
          setGenders(data.data || []);
        }
      })
      .catch((err) => {
        console.error("Error fetching genders:", err);
      });
  }, []);

  const handleNext = async () => {
    const requiredFields = [
      "dob",
      "bloodGroup",
      "nationality",
      "religion",
      "motherTongue",
      "employeeType",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in: ${missingFields.join(", ")}`);
      return;
    }

    // Validate Mobile Number
    if (!formData.phoneNumber || formData.phoneNumber.trim() === "") {
      alert("Mobile Number is required.");
      setPhoneNumberError("Mobile Number is required.");
      return;
    }
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      alert("Mobile Number must be exactly 10 digits.");
      setPhoneNumberError("Mobile Number must be exactly 10 digits.");
      return;
    }

    // Validate Email ID
   if (!formData.email || formData.email.trim() === "") {
     setRequiredErrors((prev) => ({
       ...prev,
       email: "Email ID is required.",
     }));
     return;
   }
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
  setRequiredErrors((prev) => ({
    ...prev,
    email: "Please enter a valid Email ID.",
  }));
  return;
}

    try {
      // Data is already synced to parent via useEffect - no need for sessionStorage
      // (sessionStorage has size limits and fails with large base64 images)

      const employeeId = formData.employeeId;
      const employeeTypeId = formData.employeeType; // This already contains employee_type_id
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");

      // Debug logging
      console.log("=== handleNext Debug ===");
      console.log("formData:", formData);
      console.log("employeeId:", employeeId);
      console.log("employeeTypeId:", employeeTypeId);
      console.log("orgId:", orgId);
      console.log("branchId:", branchId);

      // If both are valid, call the second API
      if (employeeId && employeeTypeId) {
        const secondApiUrl = `${ApiUrl.apiurl}STAFF/RegistrationAddressDetailsRetrieve/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}&employee_type_id=${employeeTypeId}`;
        console.log("Calling address API:", secondApiUrl);
        const secondResponse = await fetch(secondApiUrl);

        if (!secondResponse.ok) {
          throw new Error("Failed to fetch address details");
        }

        const secondResult = await secondResponse.json();
        console.log("Address Details:", secondResult);

        if (secondResult.message === "Success") {
          setAddressData(secondResult.data);
          setAddressDetails(secondResult.data); // Pass to parent
        } else {
          console.warn("Address API responded without success:", secondResult);
        }
      } else {
        console.warn("Skipping address API. Missing employeeId or employeeTypeId.");
        console.warn("employeeId is:", employeeId, "employeeTypeId is:", employeeTypeId);
      }

      // Proceed to next tab regardless of API result
      goToTab(1);
    } catch (error) {
      console.error("Error in handleNext:", error);
      alert("Error while proceeding to next tab: " + error.message);
      goToTab(1); // Proceed anyway if error occurs
    }
  };




  return (
    <div className="container-fluid ">
      <div className="row">
        <div className="col-12">
          <div className="card-body">
            <div className="row  mx-2">
              <div className="col-12 custom-section-box">
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                  <div className="row flex-grow-1 mt-3  mb-3">
                    <div className="col-md-3 mb-3">
                      <label htmlFor="employee-code" className="form-label">
                        Employee Code
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="d-flex align-items-center">
                        <input
                          type="text"
                          id="employee-code"
                          className="form-control detail"
                          placeholder="Enter employee code"
                          value={formData.employeeCode}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              employeeCode: e.target.value,
                            });
                            clearRequiredError("employeeCode");
                          }}
                        />
                      </div>
                      {requiredErrors.employeeCode && (
                        <small className="text-danger">
                          {requiredErrors.employeeCode}
                        </small>
                      )}
                    </div>

                    <div className="col-md-3 mb-3">
                      <label htmlFor="nuid-code" className="form-label">
                        NUID
                      </label>
                      <div className="d-flex align-items-center">
                        <input
                          type="text"
                          id="nuid-code"
                          className="form-control detail"
                          placeholder="Enter NUID Code"
                          value={formData.nuid}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nuid: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-1 mb-3">
                      <label htmlFor="select" className="form-label">
                        Select
                      </label>
                      <Select
                        inputId="select"
                        classNamePrefix="title-select"
                        className="detail"
                        options={titleOptions}
                        value={
                          titleOptions.find(
                            (option) =>
                              option.value.toLowerCase() ===
                              formData.title.toLowerCase(),
                          ) || null
                        }
                        onChange={(selected) =>
                          setFormData({ ...formData, title: selected.value })
                        }
                      />
                    </div>

                    <div className="col-12 col-md-5 mb-3 ">
                      <label htmlFor="employee-name" className="form-label">
                        Employee Name
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="d-flex align-items-center">
                        <input
                          type="text"
                          id="employee-name"
                          className="form-control detail"
                          placeholder="Enter First name"
                          value={formData.firstName}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            });
                            clearRequiredError("firstName");
                          }}
                        />
                        <input
                          type="text"
                          className="form-control detail ms-2"
                          placeholder="Enter middle name"
                          value={formData.middleName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              middleName: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          className="form-control detail ms-2"
                          placeholder="Enter last name"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                      {requiredErrors.firstName && (
                        <small className="text-danger">
                          {requiredErrors.firstName}
                        </small>
                      )}
                    </div>

                    <div className="col-md-3 mb-3">
                      <label htmlFor="birth-date" className="form-label">
                        Date Of Birth
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="d-flex align-items-center">
                        <input
                          type="date"
                          id="dob"
                          className="form-control detail"
                          value={formData.dob}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              dob: e.target.value,
                            });
                            clearRequiredError("dob");
                          }}
                        />
                      </div>
                      {requiredErrors.dob && (
                        <small className="text-danger">
                          {requiredErrors.dob}
                        </small>
                      )}
                    </div>

                    <div className="col-md-3 mb-3">
                      <label htmlFor="birth-place" className="form-label">
                        Place of Birth
                      </label>
                      <div className="d-flex align-items-center">
                        <input
                          type="text"
                          id="birth-place"
                          className="form-control detail"
                          placeholder="Enter place of birth"
                          value={formData.placeOfBirth}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              placeOfBirth: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-md-3 mb-3">
                      <label htmlFor="birth-place" className="form-label">
                        Marital Status
                      </label>
                      <Select
                        inputId="marital-status"
                        classNamePrefix="marital-status-select"
                        className="detail"
                        options={maritalStatusOptions}
                        value={maritalStatusOptions.find(
                          (option) => option.value === formData.maritalStatus,
                        )}
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            maritalStatus: selectedOption.value, // store ID (value)
                          })
                        }
                      />
                    </div>

                    <div className="col-md-3 mb-3">
                      <label htmlFor="blood-group" className="form-label">
                        Blood Group
                      </label>

                      <Select
                        inputId="blood-group"
                        classNamePrefix="marital-status-select"
                        className="detail"
                        options={bloodGroups.map((item) => ({
                          value: item.id,
                          label: item.blood_name,
                        }))}
                        value={bloodGroups
                          .map((item) => ({
                            value: item.id,
                            label: item.blood_name,
                          }))
                          .find(
                            (option) => option.value === formData.bloodGroup,
                          )}
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            bloodGroup: selectedOption.value, // store ID (value)
                          })
                        }
                      />
                    </div>

                    <div className="col-md-3 mb-3">
                      <label htmlFor="nationality" className="form-label">
                        Nationality
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        inputId="nationality"
                        classNamePrefix="marital-status-select"
                        className="detail"
                        options={nationalities.map((item) => ({
                          value: item.id,
                          label: item.nationality_name,
                        }))}
                        value={nationalities
                          .map((item) => ({
                            value: item.id,
                            label: item.nationality_name,
                          }))
                          .find(
                            (option) => option.value === formData.nationality,
                          )}
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            nationality: selectedOption.value, // store ID
                          });
                          clearRequiredError("nationality");
                        }}
                      />
                      {requiredErrors.nationality && (
                        <small className="text-danger">
                          {requiredErrors.nationality}
                        </small>
                      )}
                    </div>

                    <div className="col-md-3 mb-3">
                      <label htmlFor="religion" className="form-label">
                        Religion
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        inputId="religion"
                        classNamePrefix="marital-status-select"
                        className="detail"
                        options={religions.map((item) => ({
                          value: item.id,
                          label: item.religion_name,
                        }))}
                        value={religions
                          .map((item) => ({
                            value: item.id,
                            label: item.religion_name,
                          }))
                          .find((option) => option.value === formData.religion)}
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            religion: selectedOption.value,
                          });
                          clearRequiredError("religion");
                        }}
                      />
                      {requiredErrors.religion && (
                        <small className="text-danger">
                          {requiredErrors.religion}
                        </small>
                      )}
                    </div>

                    <div className="col-md-3 mb-3">
                      <label htmlFor="gender" className="form-label">
                        Gender
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        inputId="gender"
                        classNamePrefix="marital-status-select"
                        className="detail"
                        options={genders.map((item) => ({
                          value: item.id,
                          label: item.gender_name,
                        }))}
                        value={genders
                          .map((item) => ({
                            value: item.id,
                            label: item.gender_name,
                          }))
                          .find((option) => option.value === formData.gender)}
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            gender: selectedOption.value,
                          });
                          clearRequiredError("gender");
                        }}
                      />
                      {requiredErrors.gender && (
                        <small className="text-danger">
                          {requiredErrors.gender}
                        </small>
                      )}
                    </div>

                    <div className="col-md-3 mb-3">
                      <label htmlFor="mother-tongue" className="form-label">
                        Mother Tongue
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        inputId="mother-tongue"
                        classNamePrefix="marital-status-select"
                        className="detail"
                        options={languages.map((item) => ({
                          value: item.id,
                          label: item.mother_tongue_name,
                        }))}
                        value={languages
                          .map((item) => ({
                            value: item.id,
                            label: item.mother_tongue_name,
                          }))
                          .find(
                            (option) => option.value === formData.motherTongue,
                          )}
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            motherTongue: selectedOption.value,
                          });
                          clearRequiredError("motherTongue");
                        }}
                      />
                      {requiredErrors.motherTongue && (
                        <small className="text-danger">
                          {requiredErrors.motherTongue}
                        </small>
                      )}
                    </div>

                    <div className="col-md-3 mb-3">
                      <label htmlFor="employee-type" className="form-label">
                        Employee Type
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        inputId="employee-type"
                        classNamePrefix="employee-type-select"
                        className="detail"
                        options={employeeTypeOptions}
                        value={employeeTypeOptions.find(
                          (option) => option.value === formData.employeeType,
                        )}
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            employeeType: selectedOption.value, // store ID (value)
                          });
                          clearRequiredError("employeeType");
                        }}
                      />
                      {requiredErrors.employeeType && (
                        <small className="text-danger">
                          {requiredErrors.employeeType}
                        </small>
                      )}
                    </div>

                    <div className="col-md-3 mb-3">
                      <label htmlFor="status" className="form-label">
                        Status <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        inputId="status"
                        classNamePrefix="marital-status-select"
                        className="detail"
                        options={[
                          { value: "ACTIVE", label: "ACTIVE" },
                          { value: "INACTIVE", label: "INACTIVE" },
                        ]}
                        value={{
                          value: formData.status || "ACTIVE",
                          label: formData.status || "ACTIVE",
                        }}
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            status: selectedOption.value,
                          })
                        }
                        isDisabled={!formData.employeeId}
                      />
                    </div>

                    <div className="col-md-3 mb-3">
                      <label htmlFor="email-id" className="form-label">
                        Email ID <span style={{ color: "red" }}>*</span>
                      </label>

                      <div className="d-flex align-items-center">
                        <input
                          type="email"
                          id="email-id"
                          className={`form-control detail${requiredErrors.email ? " is-invalid" : ""}`}
                          placeholder="Enter email id"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            clearRequiredError("email");
                          }}
                        />
                      </div>

                      {requiredErrors.email && (
                        <small className="text-danger">
                          {requiredErrors.email}
                        </small>
                      )}
                    </div>

                    <div className="col-md-3 mb-3">
                      <label htmlFor="official-email-id" className="form-label">
                        Official Email ID
                      </label>
                      <div className="d-flex align-items-center">
                        <input
                          type="email"
                          id="official-email-id"
                          className="form-control detail"
                          placeholder="Enter official email id"
                          value={formData.officeEmail}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              officeEmail: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-md-3 mb-3">
                      <label htmlFor="mobile-number" className="form-label">
                        Mobile Number
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="d-flex align-items-center">
                        <input
                          type="text"
                          id="mobile-number"
                          className={`form-control detail${phoneNumberError || requiredErrors.phoneNumber ? " is-invalid" : ""}`}
                          placeholder="Enter Mobile Number"
                          value={formData.phoneNumber}
                          maxLength={10}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setFormData({ ...formData, phoneNumber: val });
                            clearRequiredError("phoneNumber");
                            if (val && val.length !== 10) {
                              setPhoneNumberError(
                                "Mobile number must be exactly 10 digits.",
                              );
                            } else {
                              setPhoneNumberError("");
                            }
                          }}
                        />
                      </div>
                      {(requiredErrors.phoneNumber || phoneNumberError) && (
                        <div
                          style={{
                            color: "red",
                            fontSize: "12px",
                            marginTop: "4px",
                          }}
                        >
                          {requiredErrors.phoneNumber || phoneNumberError}
                        </div>
                      )}
                    </div>

                    <div className="col-md-3 mb-3">
                      <label
                        htmlFor="emergency-contact-number"
                        className="form-label"
                      >
                        Emergency Contact Number
                      </label>
                      <div className="d-flex align-items-center">
                        <input
                          type="text"
                          id="emergency-contact-number"
                          className={`form-control detail${emergencyContactError ? " is-invalid" : ""}`}
                          placeholder="Enter Emergency Contact Number"
                          value={formData.emergencyContactNumber}
                          maxLength={10}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setFormData({
                              ...formData,
                              emergencyContactNumber: val,
                            });
                            if (val && val.length !== 10) {
                              setEmergencyContactError(
                                "Emergency contact must be exactly 10 digits.",
                              );
                            } else {
                              setEmergencyContactError("");
                            }
                          }}
                        />
                      </div>
                      {emergencyContactError && (
                        <div
                          style={{
                            color: "red",
                            fontSize: "12px",
                            marginTop: "4px",
                          }}
                        >
                          {emergencyContactError}
                        </div>
                      )}
                    </div>

                    <div className="col-md-3 mb-3">
                      <label htmlFor="profile-picture" className="form-label">
                        Profile Picture
                      </label>
                      <input
                        type="file"
                        onChange={handleFrontCoverChange}
                        className="form-control detail"
                      />

                      {frontCover &&
                        typeof frontCover === "string" &&
                        frontCover.length > 0 && (
                          <Image
                            src={frontCover}
                            alt="Front Cover Preview"
                            thumbnail
                            style={{
                              marginTop: "10px",
                              width: "120px",
                              height: "150px",
                              objectFit: "cover",
                            }}
                          />
                        )}
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

export default StaffInfo;
