
import React, { useState, useEffect } from "react";
import Select from "react-select";
import useFetchCountries from "../../hooks/useFetchCountries";
import { ApiUrl } from "../../../ApiUrl"; // Adjust path
import { useLocation } from "react-router-dom";

const ParentDetailsForm = ({
  goToTab,
  addressDetails,
  setDocumentDetailsInParent,
  setAddressFormDataInParent,
  addressFormData, // Data from parent to restore on tab return
}) => {
  // State to store form values - initialize from parent data if available
  // Validation errors for phone fields
  const [phoneErrors, setPhoneErrors] = useState({ residencePhone: "", permanentPhone: "" });

  const [formValues, setFormValues] = useState(() => {
    if (addressFormData && addressFormData.formValues) {
      return addressFormData.formValues;
    }
    return {
      residenceAddress: "",
      residenceCity: "",
      residenceState: "",
      residenceCountry: "Select",
      residencePincode: "",
      residencePhone: "",
      permanentAddress: "",
      permanentCity: "",
      permanentState: "",
      permanentCountry: "",
      permanentPincode: "",
      permanentPhone: "",
      sameAsResidence: false,
    };
  });

  const { countries } = useFetchCountries();

  // Initialize dropdown selections from parent data if available
  const [selectedCountry, setSelectedCountry] = useState(() =>
    addressFormData?.selectedCountry || null
  );
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(() =>
    addressFormData?.selectedState || null
  );
  const [cities, setCities] = useState([]);

  // Separate state arrays for permanent address
  const [permanentStates, setPermanentStates] = useState([]);
  const [permanentCities, setPermanentCities] = useState([]);

  const [selectedResidenceDistrict, setSelectedResidenceDistrict] = useState(() =>
    addressFormData?.selectedResidenceDistrict || null
  );
  const [selectedPermanentState, setSelectedPermanentState] = useState(() =>
    addressFormData?.selectedPermanentState || null
  );
  const [selectedPermanentDistrict, setSelectedPermanentDistrict] = useState(() =>
    addressFormData?.selectedPermanentDistrict || null
  );
  const [selectedPermanentCountry, setSelectedPermanentCountry] = useState(() =>
    addressFormData?.selectedPermanentCountry || null
  );

  const [fetchedAddressDetails, setFetchedAddressDetails] = useState(null);

  // Fetch address data in edit mode if employeeId exists
  useEffect(() => {
    const fetchAddressInEditMode = async () => {
      const employeeId = localStorage.getItem("employeeId");
      const employeeTypeId = localStorage.getItem("employeeTypeId");
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");

      if (employeeId && employeeTypeId && !addressDetails) {
        try {
          const response = await fetch(
            `${ApiUrl.apiurl}STAFF/RegistrationAddressDetailsRetrieve/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}&employee_type_id=${employeeTypeId}`
          );
          const result = await response.json();
          // Check if data exists AND doesn't contain error message
          if (result.message === "Success" && result.data && !result.data.msg) {
            setFetchedAddressDetails(result.data);
          } else {
            console.log("No address data found, using empty form");
            setFetchedAddressDetails(null);
          }
        } catch (error) {
          console.error("Error fetching address in edit mode:", error);
        }
      }
    };

    fetchAddressInEditMode();
  }, []);

  useEffect(() => {
    const initializeResidenceLocation = async () => {
      const addrData = addressDetails || fetchedAddressDetails;
      if (addrData && countries.length > 0) {
        console.log("=== Initializing Address Data ===");
        console.log("Address Data received:", addrData);
        console.log("Countries available:", countries);
        console.log("present_country value:", addrData.present_country, "type:", typeof addrData.present_country);
        console.log("present_phone_number value:", addrData.present_phone_number, "type:", typeof addrData.present_phone_number);
        console.log("permanent_phone_number value:", addrData.permanent_phone_number, "type:", typeof addrData.permanent_phone_number);

        const newFormValues = {
          residenceAddress: addrData.present_address || "",
          residencePincode: addrData.present_pincode || "",
          residencePhone: addrData.present_phone_number || "",
          permanentAddress: addrData.permanent_address || "",
          permanentPincode: addrData.permanent_pincode || "",
          permanentPhone: addrData.permanent_phone_number || "",
        };

        console.log("Setting form values:", newFormValues);

        setFormValues((prev) => ({
          ...prev,
          ...newFormValues,
        }));

        // Country (Residence) - Backend may return country_code OR country ID
        let matchedCountry = null;

        if (addrData.present_country) {
          // Try matching by country_code first (e.g., "IND", "USA")
          matchedCountry = countries.find(
            (c) =>
              c.country_code?.toLowerCase() ===
              addrData.present_country?.toLowerCase()
          );

          console.log("Matched by country_code:", matchedCountry);

          // If not found by code, try matching by ID (e.g., "1", "2")
          if (!matchedCountry) {
            matchedCountry = countries.find(
              (c) => c.id === parseInt(addrData.present_country) || c.id.toString() === addrData.present_country
            );
            console.log("Matched by ID:", matchedCountry);
          }
        }

        console.log("Final Matched Country:", matchedCountry);

        if (matchedCountry) {
          const countryObj = {
            value: matchedCountry.id,
            label: matchedCountry.country_name,
          };
          setSelectedCountry(countryObj);

          // Fetch states
          const stateRes = await fetch(
            `${ApiUrl.apiurl}State/GetStateListBasedOnCountryId/${countryObj.value}`
          );
          const stateJson = await stateRes.json();

          if (stateJson.message === "success") {
            setStates(stateJson.data); // Populate states dropdown
            console.log("States fetched:", stateJson.data);
            console.log("present_state value:", addrData.present_state, "type:", typeof addrData.present_state);

            let matchedState = null;

            if (addrData.present_state) {
              // Try matching by state_code first
              matchedState = stateJson.data.find(
                (s) =>
                  s.state_code?.toLowerCase() ===
                  addrData.present_state?.toLowerCase()
              );

              console.log("Matched by state_code:", matchedState);

              // If not found by code, try matching by ID
              if (!matchedState) {
                matchedState = stateJson.data.find(
                  (s) => s.id === parseInt(addrData.present_state) || s.id.toString() === addrData.present_state
                );
                console.log("Matched by state ID:", matchedState);
              }
            }

            console.log("Final Matched State:", matchedState);
            if (matchedState) {
              const stateObj = {
                value: matchedState.id,
                label: matchedState.state_name,
              };
              setSelectedState(stateObj);

              // Fetch cities
              const cityRes = await fetch(
                `${ApiUrl.apiurl}City/GetCityListBasedOnStateId/${stateObj.value}`
              );
              const cityJson = await cityRes.json();

              if (cityJson.message === "success") {
                setCities(cityJson.data); // Populate cities dropdown
                console.log("Cities fetched:", cityJson.data);
                console.log("present_city value:", addrData.present_city, "type:", typeof addrData.present_city);

                let matchedCity = null;

                if (addrData.present_city) {
                  // Try matching by city_name first
                  matchedCity = cityJson.data.find(
                    (c) =>
                      c.city_name?.toLowerCase() ===
                      addrData.present_city?.toLowerCase()
                  );

                  console.log("Matched by city_name:", matchedCity);

                  // If not found by name, try matching by ID
                  if (!matchedCity) {
                    matchedCity = cityJson.data.find(
                      (c) => c.id === parseInt(addrData.present_city) || c.id.toString() === addrData.present_city
                    );
                    console.log("Matched by city ID:", matchedCity);
                  }
                }

                console.log("Final Matched City:", matchedCity);
                if (matchedCity) {
                  setSelectedResidenceDistrict({
                    value: matchedCity.id,
                    label: matchedCity.city_name,
                  });
                }
              }
            }
          }
        }

        // Now set Permanent Address Details
        let matchedPermanentCountry = null;

        if (addrData.permanent_country) {
          matchedPermanentCountry = countries.find(
            (c) =>
              c.country_code?.toLowerCase() ===
              addrData.permanent_country?.toLowerCase()
          );

          if (!matchedPermanentCountry) {
            matchedPermanentCountry = countries.find(
              (c) => c.id === parseInt(addrData.permanent_country) || c.id.toString() === addrData.permanent_country
            );
          }
        }

        console.log("Matched Permanent Country:", matchedPermanentCountry);
        if (matchedPermanentCountry) {
          const permCountryObj = {
            value: matchedPermanentCountry.id,
            label: matchedPermanentCountry.country_name,
          };
          setSelectedPermanentCountry(permCountryObj);

          // Fetch permanent states
          try {
            const permStateRes = await fetch(
              `${ApiUrl.apiurl}State/GetStateListBasedOnCountryId/${permCountryObj.value}`
            );
            const permStateJson = await permStateRes.json();

            if (permStateJson.message === "success") {
              setPermanentStates(permStateJson.data);
              console.log("Permanent States fetched:", permStateJson.data);

              let matchedPermState = null;

              if (addrData.permanent_state) {
                matchedPermState = permStateJson.data.find(
                  (s) =>
                    s.state_code?.toLowerCase() ===
                    addrData.permanent_state?.toLowerCase()
                );

                if (!matchedPermState) {
                  matchedPermState = permStateJson.data.find(
                    (s) => s.id === parseInt(addrData.permanent_state) || s.id.toString() === addrData.permanent_state
                  );
                }
              }

              console.log("Matched Permanent State:", matchedPermState);
              if (matchedPermState) {
                const permStateObj = {
                  value: matchedPermState.id,
                  label: matchedPermState.state_name,
                };
                setSelectedPermanentState(permStateObj);

                // Fetch permanent cities
                const permCityRes = await fetch(
                  `${ApiUrl.apiurl}City/GetCityListBasedOnStateId/${permStateObj.value}`
                );
                const permCityJson = await permCityRes.json();

                if (permCityJson.message === "success") {
                  setPermanentCities(permCityJson.data);
                  console.log("Permanent Cities fetched:", permCityJson.data);

                  let matchedPermCity = null;

                  if (addrData.permanent_city) {
                    matchedPermCity = permCityJson.data.find(
                      (c) =>
                        c.city_name?.toLowerCase() ===
                        addrData.permanent_city?.toLowerCase()
                    );

                    if (!matchedPermCity) {
                      matchedPermCity = permCityJson.data.find(
                        (c) => c.id === parseInt(addrData.permanent_city) || c.id.toString() === addrData.permanent_city
                      );
                    }
                  }

                  console.log("Matched Permanent City:", matchedPermCity);
                  if (matchedPermCity) {
                    setSelectedPermanentDistrict({
                      value: matchedPermCity.id,
                      label: matchedPermCity.city_name,
                    });
                  }
                }
              }
            }
          } catch (err) {
            console.error("Error fetching permanent address location:", err);
          }
        }
      }
    };

    initializeResidenceLocation();
  }, [addressDetails, fetchedAddressDetails, countries]);

  // Fetch states when a country is selected
  useEffect(() => {
    if (selectedCountry) {
      const fetchStates = async () => {
        try {
          const apiURL = `${ApiUrl.apiurl}State/GetStateListBasedOnCountryId/${selectedCountry.value}`;
          const response = await fetch(apiURL);
          const result = await response.json();

          if (result.message === "success") {
            setStates(result.data); // Set states data
          }
        } catch (err) {
          // You said no error handling required
        }
      };

      fetchStates();
    }
  }, [selectedCountry]);


  // Fetch cities when a state is selected
  useEffect(() => {
    if (selectedState) {
      const fetchCities = async () => {
        try {
          const apiURL = `${ApiUrl.apiurl}City/GetCityListBasedOnStateId/${selectedState.value}`;
          const response = await fetch(apiURL);
          const result = await response.json();

          if (result.message === "success") {
            setCities(result.data); // Set the cities data
          }
        } catch (err) {
          // No error handling required as per your request
        }
      };

      fetchCities();
    }
  }, [selectedState]);


  // Fetch permanent states when permanent country is selected
  useEffect(() => {
    if (selectedPermanentCountry) {
      const fetchPermanentStates = async () => {
        try {
          const apiURL = `${ApiUrl.apiurl}State/GetStateListBasedOnCountryId/${selectedPermanentCountry.value}`;
          const response = await fetch(apiURL);
          const result = await response.json();

          if (result.message === "success") {
            setPermanentStates(result.data);
          }
        } catch (err) {
          // No error handling required
        }
      };

      fetchPermanentStates();
    }
  }, [selectedPermanentCountry]);

  // Fetch permanent cities when permanent state is selected
  useEffect(() => {
    if (selectedPermanentState) {
      const fetchPermanentCities = async () => {
        try {
          const apiURL = `${ApiUrl.apiurl}City/GetCityListBasedOnStateId/${selectedPermanentState.value}`;
          const response = await fetch(apiURL);
          const result = await response.json();

          if (result.message === "success") {
            setPermanentCities(result.data);
          }
        } catch (err) {
          // No error handling required
        }
      };

      fetchPermanentCities();
    }
  }, [selectedPermanentState]);

  // Sync address form data to parent on every change
  useEffect(() => {
    if (setAddressFormDataInParent) {
      setAddressFormDataInParent({
        formValues,
        selectedCountry,
        selectedState,
        selectedResidenceDistrict,
        selectedPermanentCountry,
        selectedPermanentState,
        selectedPermanentDistrict,
      });
    }
  }, [formValues, selectedCountry, selectedState, selectedResidenceDistrict,
    selectedPermanentCountry, selectedPermanentState, selectedPermanentDistrict,
    setAddressFormDataInParent]);


  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Validation for Pincode
    if (id === "residencePincode" || id === "permanentPincode") {
      if (value.length > 6) return; // Do not allow more than 6 digits
    }

    // Validation for Phone
    if (id === "residencePhone" || id === "permanentPhone") {
      if (value.length > 10) return; // Do not allow more than 10 digits
    }

    // Allow only numeric input for Pincode and Phone
    if (
      [
        "residencePincode",
        "permanentPincode",
        "residencePhone",
        "permanentPhone",
      ].includes(id)
    ) {
      if (!/^\d*$/.test(value)) return; // Block non-numeric characters
    }

    // Show inline error for phone fields if not exactly 10 digits
    if (id === "residencePhone" || id === "permanentPhone") {
      setPhoneErrors((prev) => ({
        ...prev,
        [id]: value && value.length !== 10 ? "Phone number must be exactly 10 digits." : "",
      }));
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = () => {
    setFormValues((prevValues) => {
      const isChecked = !prevValues.sameAsResidence;

      // If checked, copy residence fields to permanent fields
      return {
        ...prevValues,
        sameAsResidence: isChecked,
        ...(isChecked && {
          permanentAddress: prevValues.residenceAddress,
          permanentCity: prevValues.residenceCity,
          permanentState: prevValues.residenceState,
          permanentCountry: prevValues.residenceCountry,
          permanentPincode: prevValues.residencePincode,
          permanentPhone: prevValues.residencePhone,
        }),
      };
    });

    // Also copy the selected dropdown objects (for Select components)
    if (!formValues.sameAsResidence) {
      setSelectedPermanentState(selectedState);
      setSelectedPermanentDistrict(selectedResidenceDistrict);
      setSelectedPermanentCountry(selectedCountry); // if permanent country dropdown is using this
    } else {
      // If unchecked, reset them
      setSelectedPermanentState(null);
      setSelectedPermanentDistrict(null);
      setSelectedPermanentCountry(null);
    }
  };


  const handleAddressSubmit = async () => {
    try {
      const createdBy = sessionStorage.getItem("userId") || "1"; // Default to 1 if not found
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");

      const tempFormData = JSON.parse(sessionStorage.getItem("tempFormData"));
      const frontCover = sessionStorage.getItem("tempFrontCover");

      if (!tempFormData || !orgId || !branchId) {
        alert("Missing required details from Tab 1 or user session.");
        return;
      }

      // Validate required fields
      if (!tempFormData.phoneNumber || tempFormData.phoneNumber.trim() === "") {
        alert("Phone number is required! Please go back to Basic Info and fill it.");
        return;
      }

      // CHECK IF WE'RE IN EDIT MODE OR CREATE MODE
      let employee_id = localStorage.getItem("employeeId");
      let employee_type_id = tempFormData.employeeType;
      const isEditMode = !!employee_id; // If employeeId exists, we're editing

      // ONLY CREATE STAFF IF IN CREATE MODE (employeeId doesn't exist)
      if (!isEditMode) {
        console.log("=== CREATE MODE: Creating new staff ===");

        // Step 1: Create Staff Profile
        const staffCreateUrl = `${ApiUrl.apiurl}STAFF/RegistrationCreate/`;
        const formData = new FormData();

        // Required fields matching backend serializer
        formData.append("organization", orgId);
        formData.append("branch", branchId);
        formData.append("batch", 1); // Default batch - required by backend
        formData.append("employee_code", tempFormData.employeeCode);
        formData.append("title", tempFormData.title);
        formData.append("first_name", tempFormData.firstName);
        formData.append("middle_name", tempFormData.middleName || "");
        formData.append("last_name", tempFormData.lastName);
        // Only send date_of_birth if it exists
        if (tempFormData.dob && tempFormData.dob !== "") {
          formData.append("date_of_birth", tempFormData.dob);
        }
        formData.append("place_of_birth", tempFormData.placeOfBirth || "");
        formData.append("marital_status", tempFormData.maritalStatus || "unmarried");
        formData.append("gender", tempFormData.gender);
        formData.append("nationality", tempFormData.nationality);
        formData.append("religion", tempFormData.religion);
        formData.append("email", tempFormData.email || "");
        formData.append("phone_number", tempFormData.phoneNumber);
        formData.append("office_email", tempFormData.officeEmail || "");
        formData.append("employee_type", tempFormData.employeeType);
        formData.append("emergency_contact_number", tempFormData.emergencyContactNumber || "");
        formData.append("mother_tongue", tempFormData.motherTongue || "");
        formData.append("blood_group", tempFormData.bloodGroup || "");
        formData.append("created_by", createdBy);

        // Convert base64 to File object if image exists
        if (frontCover && frontCover.startsWith('data:image')) {
          try {
            const response = await fetch(frontCover);
            const blob = await response.blob();
            const file = new File([blob], "profile.jpg", { type: blob.type });
            formData.append("profile_pic", file);
          } catch (err) {
            console.error("Error converting image:", err);
          }
        }

        // Debug: Log what we're sending
        console.log("=== STAFF CREATE API CALL ===");
        console.log("URL:", staffCreateUrl);
        console.log("FormData being sent:");
        for (let pair of formData.entries()) {
          console.log(`  ${pair[0]}:`, pair[1]);
        }

        const staffResponse = await fetch(staffCreateUrl, {
          method: "POST",
          body: formData,
        });

        const staffText = await staffResponse.text();
        let staffResult = {};

        console.log("Staff API Response Status:", staffResponse.status);
        console.log("Staff API Response Text:", staffText);

        try {
          staffResult = staffText ? JSON.parse(staffText) : {};
        } catch (err) {
          console.error("Failed to parse staff create response:", staffText);
          alert("Invalid response from staff creation API. Check console for details.");
          return;
        }

        if (!staffResponse.ok || staffResult.message?.toLowerCase() !== "success") {
          console.error("Staff Creation Failed:", staffResult);
          // Show detailed error message
          const errorMsg = staffResult.error || staffResult.message || "Failed to create staff.";
          alert(`Staff Creation Failed: ${errorMsg}\n\nCheck browser console for more details.`);
          return;
        }

        console.log("Staff API Response:", staffResult); // Debug log

        const { employee_id: newEmployeeId, employee_type } = staffResult.data || {};
        employee_id = newEmployeeId;
        console.log("Extracted values:", { employee_id, employee_type_id, employee_type }); // Debug log

        if (!employee_id) {
          console.error("Full response data:", staffResult.data); // Error log
          alert("Missing employee ID from response.");
          return;
        }

        localStorage.setItem("employeeId", employee_id);
        localStorage.setItem("employeeType", employee_type);
        localStorage.setItem("employeeTypeId", employee_type_id);
      } else {
        console.log("=== EDIT MODE: Skipping staff creation, employee_id exists:", employee_id);
        // Get employee_type_id from localStorage (already saved during edit mode initialization)
        employee_type_id = localStorage.getItem("employeeTypeId") || tempFormData.employeeType;
      }

      // Step 2: Save/Update Address (works for both Create and Edit modes)
      const addressUrl = `${ApiUrl.apiurl}STAFF/RegistrationAddressCreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_type_id=${employee_type_id}&employee_id=${employee_id}`;

      // Validate pincodes (6 digits required)
      if (formValues.residencePincode && formValues.residencePincode.length !== 6) {
        alert("Present address pincode must be exactly 6 digits!");
        return;
      }
      if (formValues.permanentPincode && formValues.permanentPincode.length !== 6) {
        alert("Permanent address pincode must be exactly 6 digits!");
        return;
      }

      console.log("=== PHONE NUMBER DEBUG ===");
      console.log("formValues.residencePhone:", formValues.residencePhone, "type:", typeof formValues.residencePhone);
      console.log("formValues.permanentPhone:", formValues.permanentPhone, "type:", typeof formValues.permanentPhone);

      const requestData = {
        present_address: formValues.residenceAddress,
        present_country: selectedCountry?.value || null,
        present_state: selectedState?.value || null,
        present_city: selectedResidenceDistrict?.value || null, // Backend expects 'city' not 'district'
        present_pincode: formValues.residencePincode,
        present_phone_number: formValues.residencePhone || "",

        permanent_address: formValues.permanentAddress,
        permanent_country: selectedPermanentCountry?.value || null,
        permanent_state: selectedPermanentState?.value || null,
        permanent_city: selectedPermanentDistrict?.value || null, // Backend expects 'city' not 'district'
        permanent_pincode: formValues.permanentPincode || "",
        permanent_phone_number: formValues.permanentPhone || "",

        created_by: createdBy,
      };

      console.log("Address Request URL:", addressUrl); // Debug
      console.log("Address Request Data:", requestData); // Debug
      console.log("Phone numbers being sent - present:", requestData.present_phone_number, "permanent:", requestData.permanent_phone_number);

      const addressResponse = await fetch(addressUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const addressText = await addressResponse.text();
      let addressResult = {};

      try {
        addressResult = addressText ? JSON.parse(addressText) : {};
      } catch (err) {
        console.error("Failed to parse address API response:", addressText);
        alert("Invalid response from address API.");
        return;
      }

      if (
        !addressResponse.ok ||
        addressResult.message?.toLowerCase() !== "success"
      ) {
        console.error("Address API Error Response:", addressResult); // Debug
        alert(addressResult.message || "Failed to save address.");
        return;
      }

      console.log("Address saved successfully:", addressResult);

      // Step 3: Retrieve Document Details
      const documentUrl = `${ApiUrl.apiurl}STAFF/RegistrationDocumentDetailsRetrieve/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employee_id}`;
      console.log("Fetching Documents from:", documentUrl);
      const docResponse = await fetch(documentUrl);
      console.log("Document Fetch Status:", docResponse.status);

      if (docResponse.status === 204) {
        console.warn("Document API returned 204 No Content");
        goToTab(2);
        return;
      }

      const docText = await docResponse.text();
      let docResult = {};

      try {
        docResult = docText ? JSON.parse(docText) : {};
      } catch (err) {
        console.error("Failed to parse document API response:", docText);
        alert("Invalid response from document API.");
        return;
      }

      if (docResponse.ok && docResult.message?.toLowerCase() === "success") {
        const documentData = docResult.data;

        if (
          documentData &&
          typeof documentData === "object" &&
          Object.keys(documentData).length > 0
        ) {
          if (setDocumentDetailsInParent) {
            setDocumentDetailsInParent(documentData); // Send to parent component
          }
        } else {
          console.warn("No document data found.");
        }

        goToTab(2); // Proceed to document tab
      } else {
        alert(docResult.message || "Failed to load document data.");
      }
    } catch (error) {
      console.error("Error in handleAddressSubmit:", error);
      alert("An error occurred: " + error.message);
    }
  };




  return (
    <div className="container-fluid">
      {/* Address Details */}
      <div className="row ">
        <div className="col-12">
          <div className="row mt-3 mx-2 custom-section-box">
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
                </div>

                <div className="col-12 mb-2">
                  <label htmlFor="residenceAddress" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    id="residenceAddress"
                    className="form-control detail"
                    placeholder="Enter address"
                    value={formValues.residenceAddress}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-6 mb-2">
                  <label htmlFor="country" className="form-label">
                    Country<span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    inputId="country"
                    className="detail"
                    classNamePrefix="residence-city-select"
                    options={countries.map((country) => ({
                      value: country.id,
                      label: country.country_name,
                    }))}
                    value={selectedCountry}
                    onChange={(selectedOption) =>
                      setSelectedCountry(selectedOption)
                    }
                  />
                </div>

                <div className="col-6 mb-2">
                  <label htmlFor="state" className="form-label">
                    State <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    inputId="state"
                    className="detail"
                    classNamePrefix="residence-state-select"
                    options={states.map((state) => ({
                      value: state.id,
                      label: state.state_name,
                    }))}
                    onChange={(selectedOption) =>
                      setSelectedState(selectedOption)
                    }
                    value={selectedState}
                    isDisabled={!selectedCountry} // Disable if no country is selected
                  />
                </div>

                <div className="col-6 mb-2">
                  <label htmlFor="residenceCity" className="form-label">
                    City/District<span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    inputId="residenceCity"
                    className="detail"
                    classNamePrefix="residence-city-select"
                    options={cities.map((city) => ({
                      value: city.id,
                      label: city.city_name,
                    }))}
                    onChange={(selectedOption) =>
                      setSelectedResidenceDistrict(selectedOption)
                    }
                    value={selectedResidenceDistrict}
                    isDisabled={!selectedState}
                  />
                </div>

                <div className="col-6 mb-2">
                  <label htmlFor="residencePincode" className="form-label">
                    Pincode<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="residencePincode"
                    className="form-control detail"
                    placeholder="Enter pincode"
                    value={formValues.residencePincode}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-6 mb-2">
                  <label htmlFor="residencePhone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="residencePhone"
                    className={`form-control detail${phoneErrors.residencePhone ? " is-invalid" : ""}`}
                    placeholder="Enter phone number"
                    value={formValues.residencePhone || ""}
                    onChange={handleInputChange}
                  />
                  {phoneErrors.residencePhone && (
                    <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                      {phoneErrors.residencePhone}
                    </div>
                  )}
                </div>
                <div className="col-12 mb-2">
                  <input
                    type="checkbox"
                    id="sameAsResidence"
                    checked={formValues.sameAsResidence}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="sameAsResidence" className="form-label">
                    Permanent address is same as Residence
                  </label>
                </div>
              </div>
            </div>

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
                    Permanent Address
                  </h6>
                </div>
                <div className="col-12 mb-2">
                  <label htmlFor="permanentAddress" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    id="permanentAddress"
                    className="form-control detail"
                    placeholder="Enter address"
                    value={formValues.permanentAddress}
                    onChange={handleInputChange}
                    disabled={formValues.sameAsResidence}
                  />
                </div>
                <div className="col-6 mb-2">
                  <label htmlFor="country" className="form-label">
                    Country
                  </label>
                  <Select
                    inputId="country"
                    className="detail"
                    classNamePrefix="permanent-country-select"
                    options={countries.map((country) => ({
                      value: country.id,
                      label: country.country_name,
                    }))}
                    value={selectedPermanentCountry}
                    onChange={(selectedOption) =>
                      setSelectedPermanentCountry(selectedOption)
                    }
                    isDisabled={formValues.sameAsResidence}
                  />
                </div>

                <div className="col-6 mb-2">
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <Select
                    inputId="permanentState"
                    className="detail"
                    classNamePrefix="permanent-state-select"
                    options={permanentStates.map((state) => ({
                      value: state.id,
                      label: state.state_name,
                    }))}
                    onChange={(selectedOption) =>
                      setSelectedPermanentState(selectedOption)
                    }
                    value={selectedPermanentState}
                    isDisabled={!selectedPermanentCountry || formValues.sameAsResidence}
                  />
                </div>

                <div className="col-6 mb-2">
                  <label htmlFor="residenceCity" className="form-label">
                    City/District
                  </label>
                  <Select
                    inputId="permanentCity"
                    className="detail"
                    classNamePrefix="permanent-city-select"
                    options={permanentCities.map((city) => ({
                      value: city.id,
                      label: city.city_name,
                    }))}
                    onChange={(selectedOption) =>
                      setSelectedPermanentDistrict(selectedOption)
                    }
                    value={selectedPermanentDistrict}
                    isDisabled={!selectedPermanentState || formValues.sameAsResidence}
                  />
                </div>

                <div className="col-6 mb-2">
                  <label htmlFor="permanentPincode" className="form-label">
                    Pincode
                  </label>
                  <input
                    type="text"
                    id="permanentPincode"
                    className="form-control detail"
                    placeholder="Enter pincode"
                    value={formValues.permanentPincode}
                    onChange={handleInputChange}
                    disabled={formValues.sameAsResidence}
                  />
                </div>
                <div className="col-6 mb-2">
                  <label htmlFor="permanentPhone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="permanentPhone"
                    className={`form-control detail${phoneErrors.permanentPhone ? " is-invalid" : ""}`}
                    placeholder="Enter phone number"
                    value={formValues.permanentPhone || ""}
                    onChange={handleInputChange}
                    disabled={formValues.sameAsResidence}
                  />
                  {phoneErrors.permanentPhone && (
                    <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                      {phoneErrors.permanentPhone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDetailsForm;