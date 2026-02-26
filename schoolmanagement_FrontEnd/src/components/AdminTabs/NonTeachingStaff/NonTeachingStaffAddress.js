import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import "./NonTeachingStaffSearch.css";

const NonTeachingStaffAddress = ({
  goToTab,
  setAddressData,
  addressData,
  isEditMode,
}) => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  const [formData, setFormData] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
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
        setCountries(
          countryData.map((c) => ({ value: c.id, label: c.country_name })) || []
        );
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  // Fetch existing data in edit mode
  useEffect(() => {
    const fetchAddressDetails = async () => {
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
            address_line1: data.address_line1 || "",
            address_line2: data.address_line2 || "",
            city: data.city || "",
            state: data.state || "",
            country: data.country || "",
            pincode: data.pincode || "",
          });
        }
      } catch (error) {
        console.error("Error fetching address details:", error);
      }
    };

    fetchAddressDetails();
  }, [isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSelectChange = (selectedOption, field) => {
    setFormData({
      ...formData,
      [field]: selectedOption ? selectedOption.value : "",
    });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      alert("Please fix the errors in the form");
      return;
    }

    const ntsId = sessionStorage.getItem("nts_id");
    if (!ntsId) {
      alert("Please save basic information first");
      goToTab(0);
      return;
    }

    try {
      const payload = {
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
      };

      const response = await fetch(
        `${ApiUrl.apiurl}NON_TEACHING_STAFF/UpdateAddress/${ntsId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        alert(result.message || "Address information saved successfully");
        if (setAddressData) {
          setAddressData(formData);
        }
        sessionStorage.removeItem("nts_id");
        navigate("/admin/non-teaching-staff");
      } else {
        alert(result.message || "Failed to save address information");
      }
    } catch (error) {
      console.error("Error saving address information:", error);
      alert("Error occurred while saving address information");
    }
  };

  const handlePrevious = () => {
    goToTab(0);
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
              className="btn btn-secondary"
              onClick={handlePrevious}
              style={{ width: "150px" }}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              style={{ width: "150px" }}
            >
              {isEditMode ? "Update" : "Save"} & Close
            </button>
            <button
              type="button"
              className="btn btn-danger"
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
                  <div className="col-md-12 mb-3">
                    <label htmlFor="address-line1" className="form-label">
                      Address Line 1
                    </label>
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
              </div>

              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                <div className="row flex-grow-1 mt-3 mb-3">
                  <div className="col-md-12 mb-3">
                    <label htmlFor="address-line2" className="form-label">
                      Address Line 2
                    </label>
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
              </div>

              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                <div className="row flex-grow-1 mt-3 mb-3">
                  <div className="col-md-3 mb-3">
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>
                    <Select
                      inputId="country"
                      classNamePrefix="country-select"
                      className="detail"
                      options={countries}
                      value={countries.find(
                        (opt) => opt.value === formData.country
                      )}
                      onChange={(selected) =>
                        handleSelectChange(selected, "country")
                      }
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
                      value={states.find(
                        (opt) => opt.value === formData.state
                      )}
                      onChange={(selected) =>
                        handleSelectChange(selected, "state")
                      }
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
                      value={cities.find(
                        (opt) => opt.value === formData.city
                      )}
                      onChange={(selected) =>
                        handleSelectChange(selected, "city")
                      }
                      isClearable
                      placeholder="Select City"
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="pincode" className="form-label">
                      Pincode
                    </label>
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
};

export default NonTeachingStaffAddress;
