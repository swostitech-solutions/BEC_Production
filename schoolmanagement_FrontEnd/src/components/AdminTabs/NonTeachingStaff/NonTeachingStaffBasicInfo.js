import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import "./NonTeachingStaffSearch.css";

const NonTeachingStaffBasicInfo = ({
  goToTab,
  setBasicInfoData,
  basicInfoData,
  isEditMode,
}) => {
  const navigate = useNavigate();
  const [genders, setGenders] = useState([]);
  const [bloodGroups, setBloodGroups] = useState([]);

  const [formData, setFormData] = useState({
    nts_id: "",
    org_id: sessionStorage.getItem("org_id") || "",
    branch_id: sessionStorage.getItem("branch_id") || "",
    staff_code: "",
    title: "Mr",
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    phone_number: "",
    email: "",
    blood_group: "",
    date_of_joining: "",
    date_of_leaving: "",
    status: "Active",
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

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const genderResponse = await fetch(`${ApiUrl.apiurl}Gender/GetAllGenderList/`);
        const genderResult = await genderResponse.json();
        const genderData = genderResult.message === "Success" ? genderResult.data : [];
        setGenders(
          genderData.map((g) => ({ value: g.id, label: g.gender_name })) || []
        );

        const bloodResponse = await fetch(`${ApiUrl.apiurl}BLOODGROUP/GetAllBloodGroupList/`);
        const bloodResult = await bloodResponse.json();
        const bloodData = bloodResult.message === "Success" ? bloodResult.data : [];
        setBloodGroups(
          bloodData.map((b) => ({ value: b.id, label: b.blood_name })) || []
        );
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
        const response = await fetch(
          `${ApiUrl.apiurl}NON_TEACHING_STAFF/Details/${ntsId}/`
        );
        const result = await response.json();

        if (result.status === "success" && result.data) {
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
            gender: data.gender || "",
            phone_number: data.phone_number || "",
            email: data.email || "",
            blood_group: data.blood_group || "",
            date_of_joining: data.date_of_joining || "",
            date_of_leaving: data.date_of_leaving || "",
            status: data.status || "Active",
          });
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.staff_code.trim()) {
      newErrors.staff_code = "Staff code is required";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      alert("Please fill all required fields correctly");
      return;
    }

    try {
      const payload = {
        organization: formData.org_id,
        branch: formData.branch_id,
        staff_code: formData.staff_code,
        title: formData.title,
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        phone_number: formData.phone_number,
        email: formData.email,
        blood_group: formData.blood_group,
        date_of_joining: formData.date_of_joining,
        date_of_leaving: formData.date_of_leaving,
        status: formData.status,
      };

      let url, method;
      if (isEditMode && formData.nts_id) {
        url = `${ApiUrl.apiurl}NON_TEACHING_STAFF/Update/${formData.nts_id}/`;
        method = "PUT";
      } else {
        url = `${ApiUrl.apiurl}NON_TEACHING_STAFF/Create/`;
        method = "POST";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert(result.message || "Basic information saved successfully");
        if (setBasicInfoData) {
          setBasicInfoData(formData);
        }
        
        // If new record, store the ID for next tab
        if (!isEditMode && result.data && result.data.nts_id) {
          sessionStorage.setItem("nts_id", result.data.nts_id);
        }
        
        goToTab(1); // Move to Address tab
      } else {
        alert(result.message || "Failed to save basic information");
      }
    } catch (error) {
      console.error("Error saving basic information:", error);
      alert("Error occurred while saving basic information");
    }
  };

  const handleCancel = () => {
    sessionStorage.removeItem("nts_id");
    navigate("/admin/non-teaching-staff");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          {/* Action Buttons at Top Right */}
          <div className="d-flex justify-content-end gap-2 mb-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              style={{ width: "150px" }}
            >
              {isEditMode ? "Update" : "Save"} & Next
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              style={{ width: "150px" }}
            >
              Cancel
            </button>
          </div>

          <div className="row mx-2">
            <div className="col-12 custom-section-box">
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                <div className="row flex-grow-1 mt-3 mb-3">
                  <div className="col-md-3 mb-3">
                    <label htmlFor="staff-code" className="form-label">
                      Staff Code <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        id="staff-code"
                        className="form-control detail"
                        placeholder="Enter staff code"
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
                      value={titleOptions.find(
                        (opt) => opt.value === formData.title
                      )}
                      onChange={(selected) =>
                        handleSelectChange(selected, "title")
                      }
                    />
                  </div>

                  <div className="col-12 col-md-5 mb-3">
                    <label htmlFor="staff-name" className="form-label">
                      Staff Name <span style={{ color: "red" }}>*</span>
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
              </div>

              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                <div className="row flex-grow-1 mt-3 mb-3">
                  <div className="col-md-3 mb-3">
                    <label htmlFor="blood-group" className="form-label">
                      Blood Group
                    </label>
                    <Select
                      inputId="blood-group"
                      classNamePrefix="blood-group-select"
                      className="detail"
                      options={bloodGroups}
                      value={bloodGroups.find(
                        (opt) => opt.value === formData.blood_group
                      )}
                      onChange={(selected) =>
                        handleSelectChange(selected, "blood_group")
                      }
                      isClearable
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
                      value={genders.find(
                        (opt) => opt.value === formData.gender
                      )}
                      onChange={(selected) =>
                        handleSelectChange(selected, "gender")
                      }
                    />
                    {errors.gender && (
                      <div className="text-danger small mt-1">
                        {errors.gender}
                      </div>
                    )}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="phone" className="form-label">
                      Mobile Number<span style={{ color: "red" }}>*</span>
                    </label>
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
                    {errors.phone_number && (
                      <div className="text-danger small mt-1">
                        {errors.phone_number}
                      </div>
                    )}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="email" className="form-label">
                      Email ID
                    </label>
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
              </div>

              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                <div className="row flex-grow-1 mt-3 mb-3">
                  <div className="col-md-3 mb-3">
                    <label htmlFor="doj" className="form-label">
                      Date of Joining
                    </label>
                    <input
                      type="date"
                      id="doj"
                      className="form-control detail"
                      name="date_of_joining"
                      value={formData.date_of_joining}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="dol" className="form-label">
                      Date of Leaving
                    </label>
                    <input
                      type="date"
                      id="dol"
                      className="form-control detail"
                      name="date_of_leaving"
                      value={formData.date_of_leaving}
                      onChange={handleChange}
                    />
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
                      value={statusOptions.find(
                        (opt) => opt.value === formData.status
                      )}
                      onChange={(selected) =>
                        handleSelectChange(selected, "status")
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
  );
};

export default NonTeachingStaffBasicInfo;
