import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetchCountries from "../../hooks/useFetchCountries";
import useFetchCities from "../../hooks/useFetchCities";
import useFetchStates from "../../hooks/useFetchStates";
import { ApiUrl } from "../../../ApiUrl";
import Select from "react-select";
import {
  validateAadhar,
  validatePhoneNumber,
  validateEmail,
} from "../../utils/validation";

const ParentDetailsForm = ({ formData, setFormData }) => {
  const { countries, loadingCountries, errorCountries } = useFetchCountries();
  const { cities, loadingCities, errorCities } = useFetchCities(
    formData.present_country,
    formData.present_state
  );
  const { states, loadingStates, errorStates } = useFetchStates(formData.present_country);

  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [errors, setErrors] = useState({
    present_phone_number: "",
    permanent_phone_number: "",
  });

  // 10282025
  const fetchStudentData = async () => {
    try {
      const organization_id = sessionStorage.getItem("organization_id") || 1;
      const branch_id = sessionStorage.getItem("branch_id") || 1;

      const apiUrl = `${ApiUrl.apiurl}StudentRegistrationApi/GetStudentDetailsBasedOnId/?organization_id=${organization_id}&branch_id=${branch_id}&student_id=${id}`;
      console.log("📡 Fetching Student Data From:", apiUrl);

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Fetched Student Data:", result);

      if (
        result &&
        result.data &&
        Array.isArray(result.data.address_details) &&
        result.data.address_details.length > 0
      ) {
        const address = result.data.address_details[0];

        // 🔥 Normalization helper
        const normalize = (v) => (v ? v.trim().toLowerCase() : "");

        // 🔥 MATCH API VALUES WITH DROPDOWN OPTION VALUES
        const matchedPresentCountry =
          countries.find(
            (c) =>
              normalize(c.country_name) ===
              normalize(address.present_country)
          )?.country_name || address.present_country || "";

        const matchedPresentState =
          states.find(
            (s) =>
              normalize(s.state_name) === normalize(address.present_state)
          )?.state_name || address.present_state || "";

        const matchedPresentCity =
          cities.find(
            (c) => normalize(c.cityname) === normalize(address.present_city)
          )?.cityname || address.present_city || "";

        const matchedPermanentCountry =
          countries.find(
            (c) =>
              normalize(c.country_name) ===
              normalize(address.permanent_country)
          )?.country_name || address.permanent_country || "";

        const matchedPermanentState =
          states.find(
            (s) =>
              normalize(s.state_name) === normalize(address.permanent_state)
          )?.state_name || address.permanent_state || "";

        const matchedPermanentCity =
          cities.find(
            (c) =>
              normalize(c.cityname) === normalize(address.permanent_city)
          )?.cityname || address.permanent_city || "";

        // 🔥 UPDATE formData (Now Select boxes will show values)
        setFormData((prev) => ({
          ...prev,
          
          // Present
          present_address: address.present_address || "",
          present_country: matchedPresentCountry,
          present_state: matchedPresentState,
          present_city: matchedPresentCity,
          present_pincode: address.present_pincode || "",
          present_phone_number: address.present_phone_number || "",

          // Permanent
          permanent_address: address.permanent_address || "",
          permanent_country: matchedPermanentCountry,
          permanent_state: matchedPermanentState,
          permanent_city: matchedPermanentCity,
          permanent_pincode: address.permanent_pincode || "",
          permanent_phone_number: address.permanent_phone_number || "",
        }));
      } else {
        console.error("⚠️ No address details found for the student.");
      }

      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching student data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && countries.length) {
      fetchStudentData();
    }
  }, [id, countries.length]);

  const handleCheckboxChange = () => {
    setIsSameAddress((prev) => {
      const newSameAddress = !prev;
      if (newSameAddress) {
        setFormData((prevData) => ({
          ...prevData,
          permanent_address: prevData.present_address,
          permanent_city: prevData.present_city,
          permanent_state: prevData.present_state,
          permanent_country: prevData.present_country,
          permanent_pincode: prevData.present_pincode,
          permanent_phone_number: prevData.present_phone_number,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          permanent_address: "",
          // permanent_district: "",
          permanent_city: "",
          permanent_state: "",
          permanent_country: "",
          permanent_pincode: "",
          permanent_phone_number: "",
        }));
      }

      return newSameAddress;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Create a copy of current errors state to update it
    const updatedErrors = { ...errors };
    if (name === "present_phone_number" || name === "permanent_phone_number") {
      if (!validatePhoneNumber(value)) {
        updatedErrors[name] = "Phone number must contain only numbers.";
      } else if (value.length < 10) {
        updatedErrors[name] = "Phone number must be exactly 10 digits.";
      } else {
        updatedErrors[name] = ""; // Clear error if valid
      }
    }
    setErrors(updatedErrors); // Update the error state
    // Update form data state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="container-fluid">
      <div className="row ">
        <div className="col-12">
          <div className="row mt-3 mx-2 custom-section-box">
            {/* Present Address Fields */}
            <div className="col-12 col-md-6">
              <div className="row">
                <div className="col-12">
                  <h6
                    style={{
                      fontWeight: "700",
                      border: "1px solid #ccc",
                      textAlign: "center",
                      padding: "10px",
                      backgroundColor: "#007BFF",
                    }}
                  >
                    Residence Address
                  </h6>

                  <div className="col-12 mb-2">
                    <label htmlFor="present_address" className="form-label">
                      Address <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="present_address"
                      name="present_address"
                      className="form-control detail"
                      placeholder="Enter address"
                      value={formData.present_address || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-6 mb-2">
                    <label htmlFor="present_country" className="form-label">
                      Country<span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      id="present_country"
                      name="present_country"
                      className="detail"
                      classNamePrefix="country-dropdown"
                      placeholder={
                        loadingCountries
                          ? "Loading countries..."
                          : errorCountries
                            ? "Error loading countries"
                            : "Select Country"
                      }
                      isLoading={loadingCountries}
                      options={
                        Array.isArray(countries)
                          ? countries.map((country) => ({
                            value: country.country_name,
                            label: country.country_name,
                          }))
                          : []
                      }
                      value={
                        countries
                          .map(c => ({
                            value: c.country_name,
                            label: c.country_name,
                          }))
                          .find(
                            option =>
                              option.value.toLowerCase() ===
                              (formData.present_country || "").toLowerCase()
                          ) || null
                      }
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: {
                            name: "present_country",
                            value: selectedOption?.value || "",
                          },
                        })
                      }
                    />
                  </div>

                  <div className="col-6 mb-2">
                    <label htmlFor="present_state" className="form-label">
                      State<span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      id="present_state"
                      name="present_state"
                      className="detail"
                      classNamePrefix="state-dropdown"
                      placeholder={
                        loadingStates
                          ? "Loading states..."
                          : errorStates
                            ? "Error loading states"
                            : "Select State"
                      }
                      isLoading={loadingStates}
                      options={
                        Array.isArray(states)
                          ? states.map((state) => ({
                            value: state.state_name,
                            label: state.state_name,
                          }))
                          : []
                      }
                      value={
                        formData.present_state
                          ? { value: formData.present_state, label: formData.present_state }
                          : null
                      }
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: {
                            name: "present_state",
                            value: selectedOption?.value || "",
                          },
                        })
                      }
                    />
                  </div>

                  <div className="col-6 mb-2">
                    <label htmlFor="present_city" className="form-label">
                      City / District<span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      id="present_city"
                      name="present_city"
                      className="detail"
                      classNamePrefix="city-dropdown"
                      placeholder={
                        loadingCities
                          ? "Loading cities..."
                          : errorCities
                            ? "Error loading cities"
                            : "Select City / District"
                      }
                      isLoading={loadingCities}
                      options={
                        Array.isArray(cities)
                          ? cities.map((city) => ({
                            value: city.city_name,
                            label: city.city_name,
                          }))
                          : []
                      }
                      value={
                        formData.present_city
                          ? { value: formData.present_city, label: formData.present_city }
                          : null
                      }
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: {
                            name: "present_city",
                            value: selectedOption?.value || "",
                          },
                        })
                      }
                    />
                  </div>

                  <div className="col-6 mb-2">
                    <label htmlFor="present_pincode" className="form-label">
                      Pincode <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="present_pincode"
                      name="present_pincode"
                      className="form-control detail"
                      placeholder="Enter pincode"
                      value={formData.present_pincode || ""}
                      onChange={(e) => {
                        // Restrict input to only digits (0-9)
                        const value = e.target.value.replace(/[^0-9]/g, ""); 
                        handleInputChange({
                          target: { name: "present_pincode", value },
                        });
                      }}
                      maxLength={6}
                      required
                    />
                  </div>
                  <div className="col-6 mb-2">
                    <label htmlFor="present_phone_number" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="present_phone_number"
                      name="present_phone_number"
                      className="form-control detail"
                      placeholder="Enter phone number"
                      value={formData.present_phone_number || ""}
                      maxLength={10} // restrict to 10 digits
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, ""); 
                        if (value.length <= 10) {
                          handleInputChange({
                            target: { name: "present_phone_number", value },
                          });
                        }
                      }}
                    />
                    {formData.present_phone_number &&
                      formData.present_phone_number.length > 0 &&
                      formData.present_phone_number.length < 10 && (
                        <small style={{ color: "red", fontSize: "0.8em" }}>
                          Phone number must be 10 digits.
                        </small>
                      )}
                  </div>

                  <div className="col-6 mb-2">
                    <input
                      type="checkbox"
                      id="same-address"
                      checked={isSameAddress}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="same-address" className="form-label">
                      Permanent address is same as Residence
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Permanent Address Fields */}
            <div className="col-12 col-md-6">
              <h6
                style={{
                  fontWeight: "700",
                  border: "1px solid #ccc",
                  textAlign: "center",
                  padding: "10px",
                  backgroundColor: "#007BFF",
                }}
              >
                Permanent Address
              </h6>
              <div className="col-12 mb-2">
                <label htmlFor="permanent_address" className="form-label">
                  Address <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  id="permanent_address"
                  name="permanent_address"
                  className="form-control detail"
                  placeholder="Enter permanent address"
                  value={formData.permanent_address || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-6 mb-2">
                <label htmlFor="permanent_country" className="form-label">
                  Country <span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  id="permanent_country"
                  name="permanent_country"
                  className="detail"
                  classNamePrefix="country-dropdown"
                  placeholder={
                    loadingCountries
                      ? "Loading countries..."
                      : errorCountries
                        ? "Error loading countries"
                        : "Select Country"
                  }
                  isLoading={loadingCountries}
                  options={
                    Array.isArray(countries)
                      ? countries.map((country) => ({
                        value: country.country_name,
                        label: country.country_name,
                      }))
                      : []
                  }
                  value={
                    countries
                      .map(c => ({
                        value: c.country_name,
                        label: c.country_name,
                      }))
                      .find(
                        option =>
                          option.value.toLowerCase() ===
                          (formData.permanent_country || "").toLowerCase()
                      ) || null
                  }
                  onChange={(selectedOption) =>
                    handleInputChange({
                      target: {
                        name: "permanent_country",
                        value: selectedOption?.value || "",
                      },
                    })
                  }
                />
              </div>
              <div className="col-6 mb-2">
                <label htmlFor="permanent_state" className="form-label">
                  State <span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  id="permanent_state"
                  name="permanent_state"
                  className="detail"
                  classNamePrefix="state-dropdown"
                  placeholder={
                    loadingStates
                      ? "Loading states..."
                      : errorStates
                        ? "Error loading states"
                        : "Select State"
                  }
                  isLoading={loadingStates}
                  options={
                    Array.isArray(states)
                      ? states.map((state) => ({
                        value: state.state_name,
                        label: state.state_name,
                      }))
                      : []
                  }
                  value={
                    formData.permanent_state
                      ? { value: formData.permanent_state, label: formData.permanent_state }
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleInputChange({
                      target: {
                        name: "permanent_state",
                        value: selectedOption?.value || "",
                      },
                    })
                  }
                />
              </div>

              <div className="col-6 mb-2">
                <label htmlFor="permanent_city" className="form-label">
                  City / District<span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  id="permanent_city"
                  name="permanent_city"
                  className="detail"
                  classNamePrefix="city-dropdown"
                  placeholder={
                    loadingCities
                      ? "Loading cities..."
                      : errorCities
                        ? "Error loading cities"
                        : "Select City / District"
                  }
                  isLoading={loadingCities}
                  options={
                    Array.isArray(cities)
                      ? cities.map((city) => ({
                        value: city.city_name,
                        label: city.city_name,
                      }))
                      : []
                  }
                  value={
                    formData.permanent_city
                      ? { value: formData.permanent_city, label: formData.permanent_city }
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleInputChange({
                      target: {
                        name: "permanent_city",
                        value: selectedOption?.value || "",
                      },
                    })
                  }
                />
              </div>

              <div className="col-6 mb-2">
                <label htmlFor="permanent_pincode" className="form-label">
                  Pincode <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  id="permanent_pincode"
                  name="permanent_pincode"
                  className="form-control detail"
                  placeholder="Enter pincode"
                  value={formData.permanent_pincode || ""}
                  // onChange={handleInputChange}
                  onChange={(e) => {
                    // Restrict input to only digits (0-9)
                    const value = e.target.value.replace(/[^0-9]/g, ""); // This regex removes any non-numeric character
                    handleInputChange({
                      target: { name: "permanent_pincode", value },
                    });
                  }}
                  maxLength={6}
                  required
                />
              </div>
              <div className="col-6 mb-2">
                <label htmlFor="permanent_phone_number" className="form-label">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="permanent_phone_number"
                  name="permanent_phone_number"
                  className="form-control detail"
                  placeholder="Enter phone number"
                  value={formData.permanent_phone_number || ""}
                  // onChange={handleInputChange}

                  onChange={(e) => {
                    // Restrict input to only digits (0-9)
                    const value = e.target.value.replace(/[^0-9]/g, ""); // This regex removes any non-numeric character
                    handleInputChange({
                      target: { name: "permanent_phone_number", value },
                    });
                  }}
                  maxLength={10}
                />

                {errors.permanent_phone_number && (
                  <span
                    style={{
                      color: "red",
                      fontSize: "0.8em",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    {errors.permanent_phone_number}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDetailsForm;