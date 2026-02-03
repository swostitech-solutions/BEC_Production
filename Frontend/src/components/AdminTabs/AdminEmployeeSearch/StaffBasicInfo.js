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

const StaffInfo = ({ goToTab, setAddressDetails }) => {
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

  const [formData, setFormData] = useState({
    employeeId: "",
    orgId: "",
    branchId: "",
    location: "JAYDEV VIHAR",
    employeeCode: "",
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    placeOfBirth: "",
    maritalStatus: "", // dropdown value (ID)
    bloodGroup: "", // dropdown value (ID)
    nationality: "", // dropdown value (ID)
    religion: "", // dropdown value (ID)
    gender: "", // dropdown value (ID)
    motherTongue: "", // dropdown value (ID)
    employeeType: "", // dropdown value (ID)
    email: "",
    officeEmail: "",
    phoneNumber: "",
    emergencyContactNumber: "",
    createdBy: "",
  });

  const [frontCover, setFrontCover] = useState(null); // for the profile picture


  useEffect(() => {
    if (employeeDetails) {
      const bloodGroupObj = bloodGroups.find(
        (bg) =>
          (bg.blood_name || "").toLowerCase() ===
          (employeeDetails.blood_group || "").toLowerCase()
      );
      const nationalityObj = nationalities.find(
        (n) =>
          (n.nationality_name || "").toLowerCase() ===
          (employeeDetails.nationality || "").toLowerCase()
      );
      const religionObj = religions.find(
        (r) =>
          (r.religion_name || "").toLowerCase() ===
          (employeeDetails.religion || "").toLowerCase()
      );
      const motherTongueObj = languages.find(
        (l) =>
          (l.language_desc || "").toLowerCase() ===
          (employeeDetails.mother_tongue || "").toLowerCase()
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
      setFormData({
        employeeId: employeeDetails.id || "",
        employeeCode: employeeDetails.employee_code || "",
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
        gender: genderValue,
        motherTongue: motherTongueObj ? motherTongueObj.id : "",

        //  Directly assign employee_type_id
        employeeType: employeeDetails.employee_type_id || employeeDetails.employee_type || "",

        email: employeeDetails.email || "",
        officeEmail: employeeDetails.office_email || "",
        phoneNumber: employeeDetails.phone_number || "",
        emergencyContactNumber: employeeDetails.emergency_contact_number || "",
        profilePicture: employeeDetails.profile || "",
      });
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
    { value: "mr", label: "MR" },
    { value: "ms", label: "Ms" },
    { value: "mrs", label: "Mrs" },
  ];

  const maritalStatusOptions = [
    { value: "1", label: "Single" },
    { value: "2", label: "Married" },
  ];
  const genderOptions = [
    { value: "1", label: "Male" },
    { value: "2", label: "Female" },
  ];

  const handleFrontCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFrontCover(reader.result); // Preview as base64
      };
      reader.readAsDataURL(file);

      // If needed, store the actual file to upload later
      setFormData((prev) => ({
        ...prev,
        profilePicture: file,
      }));
    }
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


  const handleNext = async () => {
    const requiredFields = [
      "bloodGroup",
      "nationality",
      "religion",
      "motherTongue",
      "employeeType",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Please select: ${missingFields.join(", ")}`);
      return;
    }

    try {
      // Save form data and image
      sessionStorage.setItem("tempFormData", JSON.stringify(formData));
      if (frontCover) {
        sessionStorage.setItem("tempFrontCover", frontCover);
      }

      const employeeId = formData.employeeId;
      const employeeTypeId = formData.employeeType; // This already contains employee_type_id
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");

      // If both are valid, call the second API
      if (employeeId && employeeTypeId) {
        const secondApiUrl = `${ApiUrl.apiurl}STAFF/RegistrationAddressDetailsRetrieve/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}&employee_type_id=${employeeTypeId}`;
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
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              employeeCode: e.target.value,
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
                              formData.title.toLowerCase()
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
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
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
                    </div>

                    <div className="col-md-3 mb-3">
                      <label htmlFor="birth-date" className="form-label">
                        Date of Birth
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="d-flex align-items-center">
                        <input
                          type="date"
                          id="employee-code"
                          className="form-control detail"
                          value={formData.dob}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dob: e.target.value,
                            })
                          }
                        />
                      </div>
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
                          (option) => option.value === formData.maritalStatus
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
                            (option) => option.value === formData.bloodGroup
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
                            (option) => option.value === formData.nationality
                          )}
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            nationality: selectedOption.value, // store ID
                          })
                        }
                      />
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
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            religion: selectedOption.value,
                          })
                        }
                      />
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
                        options={genderOptions}
                        value={genderOptions.find(
                          (option) => option.value === formData.gender
                        )}
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            gender: selectedOption.value,
                          })
                        }
                      />
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
                          label: item.language_desc,
                        }))}
                        value={languages
                          .map((item) => ({
                            value: item.id,
                            label: item.language_desc,
                          }))
                          .find(
                            (option) => option.value === formData.motherTongue
                          )}
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            motherTongue: selectedOption.value,
                          })
                        }
                      />
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
                          (option) => option.value === formData.employeeType
                        )}
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            employeeType: selectedOption.value, // store ID (value)
                          })
                        }
                      />
                    </div>

                    <div className="col-md-3 mb-3">
                      <label htmlFor="email-id" className="form-label">
                        Email ID
                      </label>
                      <div className="d-flex align-items-center">
                        <input
                          type="text"
                          id="email-id"
                          className="form-control detail"
                          placeholder="Enter email id"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-md-3 mb-3">
                      <label htmlFor="official-email-id" className="form-label">
                        Official Email ID
                      </label>
                      <div className="d-flex align-items-center">
                        <input
                          type="text"
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
                          className="form-control detail"
                          placeholder="Enter Mobile Number"
                          value={formData.phoneNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phoneNumber: e.target.value,
                            })
                          }
                        />
                      </div>
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
                          className="form-control detail"
                          placeholder="Enter Emergency Contact Number"
                          value={formData.emergencyContactNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              emergencyContactNumber: e.target.value,
                            })
                          }
                        />
                      </div>
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

                      {frontCover && (
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
                    <div className="d-flex justify-content-end mb-3">
                      <button
                        className="btn btn-primary border"
                        onClick={() => {
                          handleNext(); // Call your existing async logic
                          // goToTab(1); // Also navigate to next tab immediately (optional)
                        }}
                      >
                        Next
                      </button>
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
