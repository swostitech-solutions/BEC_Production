import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import { ApiUrl } from "../../../ApiUrl";
import "./NonTeachingStaffSearch.css";

export default function NonTeachingStaffDetails() {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [genders, setGenders] = useState([]);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [religions, setReligions] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [frontCover, setFrontCover] = useState(null);
  const fileInputRef = React.useRef(null);

  const [formData, setFormData] = useState({
    nts_id: "",
    org_id:
      sessionStorage.getItem("organization_id") ||
      sessionStorage.getItem("org_id") ||
      localStorage.getItem("orgId") ||
      "",
    branch_id:
      sessionStorage.getItem("branch_id") ||
      localStorage.getItem("branchId") ||
      "",
    staff_code: "",
    title: "Mr",
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    place_of_birth: "",
    marital_status: "",
    gender: "",
    phone_number: "",
    emergency_contact_number: "",
    email: "",
    official_email: "",
    blood_group: "",
    nationality: "",
    religion: "",
    date_of_joining: "",
    status: "Active",
    profile_picture: null,
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  const titleOptions = [
    { value: "Mr", label: "Mr" },
    { value: "Ms", label: "Ms" },
    { value: "Mrs", label: "Mrs" },
    { value: "Dr", label: "Dr" },
  ];

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const maritalStatusOptions = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Divorced", label: "Divorced" },
    { value: "Widowed", label: "Widowed" },
  ];

  // Check if in edit mode
  useEffect(() => {
    const ntsId = sessionStorage.getItem("nts_id");
    setIsEditMode(!!ntsId);
  }, []);

  // Fetch all dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const genderResponse = await fetch(`${ApiUrl.apiurl}Gender/GetAllGenderList/`);
        const genderResult = await genderResponse.json();
        const genderData = genderResult.message === "Success" ? genderResult.data : [];
        setGenders(genderData.map((g) => ({ value: g.id, label: g.gender_name })) || []);

        const bloodResponse = await fetch(`${ApiUrl.apiurl}BLOODGROUP/GetAllBloodGroupList/`);
        const bloodResult = await bloodResponse.json();
        const bloodData = bloodResult.message === "Success" ? bloodResult.data : [];
        setBloodGroups(bloodData.map((b) => ({ value: b.id, label: b.blood_name })) || []);

        const nationalityResponse = await fetch(`${ApiUrl.apiurl}NATIONALITY/GetAllNationality/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const nationalityResult = await nationalityResponse.json();
        const nationalityData = nationalityResult.message === "Success" ? nationalityResult.data : [];
        setNationalities(nationalityData.map((n) => ({ value: n.id, label: n.nationality_name })) || []);

        const religionResponse = await fetch(`${ApiUrl.apiurl}RELIGION/GetAllReligion/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const religionResult = await religionResponse.json();
        const religionData = religionResult.message === "Success" ? religionResult.data : [];
        setReligions(religionData.map((r) => ({ value: r.id, label: r.religion_name })) || []);

        const cityResponse = await fetch(`${ApiUrl.apiurl}CITY/GetAllCity/`);
        const cityResult = await cityResponse.json();
        const cityData = cityResult.message === "Success" ? cityResult.data : [];
        setCities(cityData.map((c) => ({ value: c.id, label: c.cityname })) || []);

        const stateResponse = await fetch(`${ApiUrl.apiurl}STATE/GetAllState/`);
        const stateResult = await stateResponse.json();
        const stateData = stateResult.message === "Success" ? stateResult.data : [];
        setStates(stateData.map((s) => ({ value: s.id, label: s.state_name })) || []);

        const countryResponse = await fetch(`${ApiUrl.apiurl}COUNTRY/GetAllCountry/`);
        const countryResult = await countryResponse.json();
        const countryData = countryResult.message === "Success" ? countryResult.data : [];
        setCountries(countryData.map((c) => ({ value: c.id, label: c.country_name })) || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  // Fetch existing data in edit mode
  useEffect(() => {
    const fetchStaffDetails = async () => {
      const ntsId = sessionStorage.getItem("nts_id");
      if (!ntsId || !isEditMode) return;

      try {
        const response = await fetch(`${ApiUrl.apiurl}NON_TEACHING_STAFF/Details/${ntsId}/`);
        const result = await response.json();

        const isSuccess =
          result.status === "success" ||
          String(result.message || "").toLowerCase().includes("success");
        if (isSuccess && result.data) {
          const data = result.data;
          setFormData({
            nts_id: data.nts_id,
            org_id: data.organization,
            branch_id: data.branch,
            staff_code: data.staff_code || "",
            title: data.title || "Mr",
            first_name: data.first_name || "",
            middle_name: data.middle_name || "",
            last_name: data.last_name || "",
            date_of_birth: data.date_of_birth || "",
            place_of_birth: data.place_of_birth || data.place_of_birth_name || "",
            marital_status: data.marital_status || data.marital_status_name || "",
            gender: data.gender || data.gender_id || "",
            phone_number: data.phone_number || "",
            emergency_contact_number:
              data.emergency_contact_number || data.emergency_contact_no || "",
            email: data.email || "",
            official_email: data.official_email || data.office_email || "",
            blood_group: data.blood_group || data.blood_group_id || "",
            nationality: data.nationality || data.nationality_id || "",
            religion: data.religion || data.religion_id || "",
            date_of_joining: data.date_of_joining || "",
            status: data.status || "Active",
            profile_picture:
              data.profile_pic || data.profile_photo_path || data.profile_picture || null,
            address_line1: data.address_line1 || "",
            address_line2: data.address_line2 || "",
            city: data.city || data.city_id || "",
            state: data.state || data.state_id || "",
            country: data.country || data.country_id || "",
            pincode: data.pincode || "",
          });

          const profilePreview =
            data.profile_pic || data.profile_photo_path || data.profile_picture;
          if (profilePreview) {
            setFrontCover(profilePreview);
          }
        }
      } catch (error) {
        console.error("Error fetching staff details:", error);
      }
    };

    fetchStaffDetails();
  }, [isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSelectChange = (selectedOption, field) => {
    setFormData({ ...formData, [field]: selectedOption ? selectedOption.value : "" });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleFrontCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_picture: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setFrontCover(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.staff_code.trim()) {
      newErrors.staff_code = "Employee code is required";
    }
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Phone number must be 10 digits";
    }
    if (!formData.date_of_joining) {
      newErrors.date_of_joining = "Date of joining is required";
    }
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      alert("Please fill all required fields correctly");
      return;
    }

    try {
      const organizationId =
        formData.org_id ||
        sessionStorage.getItem("organization_id") ||
        localStorage.getItem("orgId") ||
        "";
      const branchId =
        formData.branch_id ||
        sessionStorage.getItem("branch_id") ||
        localStorage.getItem("branchId") ||
        "";
      const createdBy =
        sessionStorage.getItem("userId") ||
        localStorage.getItem("userId") ||
        1;

      const formDataToSend = new FormData();
      formDataToSend.append("organization", organizationId);
      formDataToSend.append("branch", branchId);
      formDataToSend.append("staff_code", formData.staff_code);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("first_name", formData.first_name);
      formDataToSend.append("middle_name", formData.middle_name);
      formDataToSend.append("last_name", formData.last_name);
      formDataToSend.append("date_of_birth", formData.date_of_birth);
      formDataToSend.append("place_of_birth", formData.place_of_birth);
      formDataToSend.append("marital_status", formData.marital_status);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("phone_number", formData.phone_number);
      formDataToSend.append("emergency_contact_number", formData.emergency_contact_number);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("official_email", formData.official_email);
      formDataToSend.append("blood_group", formData.blood_group);
      formDataToSend.append("nationality", formData.nationality);
      formDataToSend.append("religion", formData.religion);
      formDataToSend.append("date_of_joining", formData.date_of_joining);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("created_by", createdBy);
      formDataToSend.append("address_line1", formData.address_line1);
      formDataToSend.append("address_line2", formData.address_line2);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("pincode", formData.pincode);

      if (formData.profile_picture && formData.profile_picture instanceof File) {
        formDataToSend.append("profile_picture", formData.profile_picture);
      }

      const response = await fetch(`${ApiUrl.apiurl}NON_TEACHING_STAFF/Create/`, {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.status === "success") {
        alert(result.message || "Non-Teaching Staff created successfully");
        sessionStorage.removeItem("nts_id");
        navigate("/admin/non-teaching-staff");
      } else {
        alert(result.message || "Failed to create Non-Teaching Staff");
      }
    } catch (error) {
      console.error("Error saving staff:", error);
      alert("Error occurred while saving staff");
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      alert("Please fill all required fields correctly");
      return;
    }

    const ntsId = sessionStorage.getItem("nts_id");
    if (!ntsId) {
      alert("No staff ID found for update");
      return;
    }

    try {
      const organizationId =
        formData.org_id ||
        sessionStorage.getItem("organization_id") ||
        localStorage.getItem("orgId") ||
        "";
      const branchId =
        formData.branch_id ||
        sessionStorage.getItem("branch_id") ||
        localStorage.getItem("branchId") ||
        "";
      const createdBy =
        sessionStorage.getItem("userId") ||
        localStorage.getItem("userId") ||
        1;

      const formDataToSend = new FormData();
      formDataToSend.append("organization", organizationId);
      formDataToSend.append("branch", branchId);
      formDataToSend.append("staff_code", formData.staff_code);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("first_name", formData.first_name);
      formDataToSend.append("middle_name", formData.middle_name);
      formDataToSend.append("last_name", formData.last_name);
      formDataToSend.append("date_of_birth", formData.date_of_birth);
      formDataToSend.append("place_of_birth", formData.place_of_birth);
      formDataToSend.append("marital_status", formData.marital_status);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("phone_number", formData.phone_number);
      formDataToSend.append("emergency_contact_number", formData.emergency_contact_number);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("official_email", formData.official_email);
      formDataToSend.append("blood_group", formData.blood_group);
      formDataToSend.append("nationality", formData.nationality);
      formDataToSend.append("religion", formData.religion);
      formDataToSend.append("date_of_joining", formData.date_of_joining);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("created_by", createdBy);
      formDataToSend.append("address_line1", formData.address_line1);
      formDataToSend.append("address_line2", formData.address_line2);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("pincode", formData.pincode);

      if (formData.profile_picture && formData.profile_picture instanceof File) {
        formDataToSend.append("profile_picture", formData.profile_picture);
      }

      const response = await fetch(`${ApiUrl.apiurl}NON_TEACHING_STAFF/Update/${ntsId}/`, {
        method: "PUT",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.status === "success") {
        alert(result.message || "Non-Teaching Staff updated successfully");
        sessionStorage.removeItem("nts_id");
        navigate("/admin/non-teaching-staff");
      } else {
        alert(result.message || "Failed to update Non-Teaching Staff");
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      alert("Error occurred while updating staff");
    }
  };

  const handleClear = () => {
    setFormData({
      nts_id: "",
      org_id:
        sessionStorage.getItem("organization_id") ||
        sessionStorage.getItem("org_id") ||
        localStorage.getItem("orgId") ||
        "",
      branch_id:
        sessionStorage.getItem("branch_id") ||
        localStorage.getItem("branchId") ||
        "",
      staff_code: "",
      title: "Mr",
      first_name: "",
      middle_name: "",
      last_name: "",
      date_of_birth: "",
      place_of_birth: "",
      marital_status: "",
      gender: "",
      phone_number: "",
      emergency_contact_number: "",
      email: "",
      official_email: "",
      blood_group: "",
      nationality: "",
      religion: "",
      date_of_joining: "",
      status: "Active",
      profile_picture: null,
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    });
    setFrontCover(null);
    setErrors({});
    // Clear file input field
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    sessionStorage.removeItem("nts_id");
    navigate("/admin/non-teaching-staff");
  };

  return (
    <div className="container-fluid mt-4 non-teaching-staff-container">
      <div className="card">
        <div className="card-body">
          {/* Action Buttons at Top */}
          <div className="d-flex justify-content-end gap-2 mb-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isEditMode}
              style={{ width: "150px" }}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdate}
              disabled={!isEditMode}
              style={{ width: "150px" }}
            >
              Update
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClear}
              style={{ width: "150px" }}
            >
              Clear
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleClose}
              style={{ width: "150px" }}
            >
              Close
            </button>
          </div>

          <div className="row mx-2">
            <div className="col-12 custom-section-box">
              <div className="col-12 mb-3">
                <h5 className="text-primary">Basic Information</h5>
                <hr />
              </div>
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                <div className="row flex-grow-1 mt-3 mb-3">
                  <div className="col-md-3 mb-3">
                    <label htmlFor="staff-code" className="form-label">
                      Employee Code <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        id="staff-code"
                        className="form-control detail"
                        placeholder="Enter employee code"
                        name="staff_code"
                        value={formData.staff_code}
                        onChange={handleChange}
                        disabled={isEditMode}
                      />
                    </div>
                    {errors.staff_code && (
                      <div className="text-danger small mt-1">
                        {errors.staff_code}
                      </div>
                    )}
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
                      value={titleOptions.find((opt) => opt.value === formData.title)}
                      onChange={(selected) => handleSelectChange(selected, "title")}
                    />
                  </div>

                  <div className="col-12 col-md-5 mb-3">
                    <label htmlFor="staff-name" className="form-label">
                      Employee Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        id="staff-name"
                        className="form-control detail"
                        placeholder="Enter First name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                      <input
                        type="text"
                        className="form-control detail ms-2"
                        placeholder="Enter middle name"
                        name="middle_name"
                        value={formData.middle_name}
                        onChange={handleChange}
                      />
                      <input
                        type="text"
                        className="form-control detail ms-2"
                        placeholder="Enter last name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </div>
                    {(errors.first_name || errors.last_name) && (
                      <div className="text-danger small mt-1">
                        {errors.first_name || errors.last_name}
                      </div>
                    )}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="dob" className="form-label">
                      Date of Birth<span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        type="date"
                        id="dob"
                        className="form-control detail"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="place-of-birth" className="form-label">
                      Place of Birth
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        id="place-of-birth"
                        className="form-control detail"
                        placeholder="Enter place of birth"
                        name="place_of_birth"
                        value={formData.place_of_birth}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="marital-status" className="form-label">
                      Marital Status
                    </label>
                    <Select
                      inputId="marital-status"
                      classNamePrefix="marital-status-select"
                      className="detail"
                      options={maritalStatusOptions}
                      value={maritalStatusOptions.find((opt) => opt.value === formData.marital_status)}
                      onChange={(selected) => handleSelectChange(selected, "marital_status")}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="blood-group" className="form-label">
                      Blood Group
                    </label>
                    <Select
                      inputId="blood-group"
                      classNamePrefix="blood-group-select"
                      className="detail"
                      options={bloodGroups}
                      value={bloodGroups.find((opt) => opt.value === formData.blood_group)}
                      onChange={(selected) => handleSelectChange(selected, "blood_group")}
                      isClearable
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="nationality" className="form-label">
                      Nationality<span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      inputId="nationality"
                      classNamePrefix="nationality-select"
                      className="detail"
                      options={nationalities}
                      value={nationalities.find((opt) => opt.value === formData.nationality)}
                      onChange={(selected) => handleSelectChange(selected, "nationality")}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="religion" className="form-label">
                      Religion<span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      inputId="religion"
                      classNamePrefix="religion-select"
                      className="detail"
                      options={religions}
                      value={religions.find((opt) => opt.value === formData.religion)}
                      onChange={(selected) => handleSelectChange(selected, "religion")}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="gender" className="form-label">
                      Gender<span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      inputId="gender"
                      classNamePrefix="gender-select"
                      className="detail"
                      options={genders}
                      value={genders.find((opt) => opt.value === formData.gender)}
                      onChange={(selected) => handleSelectChange(selected, "gender")}
                    />
                    {errors.gender && (
                      <div className="text-danger small mt-1">
                        {errors.gender}
                      </div>
                    )}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="email" className="form-label">
                      Email ID
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        type="email"
                        id="email"
                        className="form-control detail"
                        placeholder="Enter email id"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="official-email" className="form-label">
                      Official Email ID
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        type="email"
                        id="official-email"
                        className="form-control detail"
                        placeholder="Enter official email id"
                        name="official_email"
                        value={formData.official_email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="phone" className="form-label">
                      Mobile Number<span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        id="phone"
                        className="form-control detail"
                        placeholder="Enter Mobile Number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        maxLength={10}
                      />
                    </div>
                    {errors.phone_number && (
                      <div className="text-danger small mt-1">
                        {errors.phone_number}
                      </div>
                    )}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="emergency-contact" className="form-label">
                      Emergency Contact Number
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        id="emergency-contact"
                        className="form-control detail"
                        placeholder="Enter Emergency Contact Number"
                        name="emergency_contact_number"
                        value={formData.emergency_contact_number}
                        onChange={handleChange}
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="date-of-joining" className="form-label">
                      Date of Joining<span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        type="date"
                        id="date-of-joining"
                        className="form-control detail"
                        name="date_of_joining"
                        value={formData.date_of_joining}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.date_of_joining && (
                      <div className="text-danger small mt-1">
                        {errors.date_of_joining}
                      </div>
                    )}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <Select
                      inputId="status"
                      classNamePrefix="status-select"
                      className="detail"
                      options={statusOptions}
                      value={statusOptions.find((opt) => opt.value === formData.status)}
                      onChange={(selected) => handleSelectChange(selected, "status")}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="profile-picture" className="form-label">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      id="profile-picture"
                      ref={fileInputRef}
                      onChange={handleFrontCoverChange}
                      className="form-control detail"
                      accept="image/*"
                    />
                    {frontCover && (
                      <Image
                        src={frontCover}
                        alt="Profile Picture Preview"
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

              {/* Address Section */}
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mt-4">
                <div className="row flex-grow-1 mt-3 mb-3">
                  <div className="col-12 mb-3">
                    <h5 className="text-primary">Address Information</h5>
                    <hr />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="address-line1" className="form-label">
                      Address Line 1
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        id="address-line1"
                        className="form-control detail"
                        placeholder="Street, Building, etc."
                        name="address_line1"
                        value={formData.address_line1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="address-line2" className="form-label">
                      Address Line 2
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        id="address-line2"
                        className="form-control detail"
                        placeholder="Area, Locality, etc."
                        name="address_line2"
                        value={formData.address_line2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>
                    <Select
                      inputId="country"
                      classNamePrefix="country-select"
                      className="detail"
                      options={countries}
                      value={countries.find((opt) => opt.value === formData.country)}
                      onChange={(selected) => handleSelectChange(selected, "country")}
                      isClearable
                      placeholder="Select Country"
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="state" className="form-label">
                      State
                    </label>
                    <Select
                      inputId="state"
                      classNamePrefix="state-select"
                      className="detail"
                      options={states}
                      value={states.find((opt) => opt.value === formData.state)}
                      onChange={(selected) => handleSelectChange(selected, "state")}
                      isClearable
                      placeholder="Select State"
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="city" className="form-label">
                      City
                    </label>
                    <Select
                      inputId="city"
                      classNamePrefix="city-select"
                      className="detail"
                      options={cities}
                      value={cities.find((opt) => opt.value === formData.city)}
                      onChange={(selected) => handleSelectChange(selected, "city")}
                      isClearable
                      placeholder="Select City"
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="pincode" className="form-label">
                      Pincode
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        id="pincode"
                        className="form-control detail"
                        placeholder="Enter Pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        maxLength={6}
                      />
                    </div>
                    {errors.pincode && (
                      <div className="text-danger small mt-1">
                        {errors.pincode}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
