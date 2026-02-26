import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import SelectStudentModal from "../AdminAttendanceEntry/SelectStudentModal";
import Select from "react-select";
import useFetchCountries from "../../hooks/useFetchCountries";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

const AdmAttendanceEntry = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { countries } = useFetchCountries();
  const [selectedCountry, setSelectedCountry] = useState(null); // To track selected country
  const [selectedState, setSelectedState] = useState(null); // To track selected state
  const [states, setStates] = useState([]); // To store states based on the selected country
  const [cities, setCities] = useState([]); // To store cities based on the selected state
  const [gstNo, setGstNo] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [partyName, setPartyName] = useState("");
  const [customerSupplier, setCustomerSupplier] = useState(""); // Customer, Supplier, Both
  const [enabled, setEnabled] = useState(true);
  const [address, setAddress] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  // const orgId = localStorage.getItem("orgId"); // Assuming orgId is stored in localStorage
  // const branchId = localStorage.getItem("branchId"); // Assuming branchId is stored in localStorage
  const [partyList, setPartyList] = useState([]);
  // const [selectedPartyId, setSelectedPartyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [partyId, setPartyId] = useState(null); // Track the party id

  const [errors, setErrors] = useState({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const dateRef = useRef(null);
  const fromClassRef = useRef(null);
  const toClassRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);

  const handleClear = () => {
    // Reset input field refs
    if (dateRef.current) dateRef.current.value = "";
    if (fromClassRef.current) fromClassRef.current.value = "";
    if (toClassRef.current) toClassRef.current.value = "";
    if (admissionNoRef.current) admissionNoRef.current.value = "";
    if (barcodeRef.current) barcodeRef.current.value = "";
    if (smsToRef.current) smsToRef.current.checked = false;

    // Reset state variables
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setGstNo("");
    setPhone("");
    setEmail("");
    setPartyName("");
    setCustomerSupplier("");
    setEnabled(true);
    setAddress("");
    setPartyId(null);
    setCurrentPage(0);
  };

  // Pagination handler
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // Calculate paginated data
  const offset = currentPage * itemsPerPage;
  const currentPartyList = partyList.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(partyList.length / itemsPerPage);

  // Run once when the component mounts

  // Run once when the component mounts

  // Fetch cities based on selected state
  const fetchCities = async (stateId) => {
    if (!stateId) {
      setCities([]);
      return [];
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token not found in localStorage.");
      setCities([]);
      return [];
    }

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}City/GetCityListBasedOnStateId/${stateId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        const cityOptions = result.data.map((city) => ({
          value: city.id,
          label: city.city_name,
        }));
        setCities(cityOptions);
        return cityOptions;
      } else {
        setCities([]);
        return [];
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
      setCities([]);
      return [];
    }
  };

  // Function to fetch states based on selected country
  const fetchStates = async (countryId) => {
    if (!countryId) {
      setStates([]);
      return [];
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token not found in localStorage.");
      setStates([]);
      return [];
    }

    try {
      // http://localhost:8000/api/State/GetStateListBasedOnCountryId/1
      const response = await fetch(
        `${ApiUrl.apiurl}State/GetStateListBasedOnCountryId/${countryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      console.log("State API Response:", result);
      if (response.ok && result.message?.toLowerCase() === "success" && Array.isArray(result.data)) {
        const stateOptions = result.data.map((state) => ({
          value: state.id,
          label: state.state_name, // Using state_name from API response
        }));
        setStates(stateOptions);
        return stateOptions;
      } else {
        setStates([]); // If there's an error, clear the state options
        return [];
      }
    } catch (err) {
      console.error("Error fetching states:", err);
      setStates([]); // Handle error and clear states
      return [];
    }
  };

  // Call the fetchStates function when a country is selected
  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    fetchStates(selectedOption.value); // Fetch states for the selected country
    setSelectedState(null); // Reset the selected state and cities
    setCities([]);
  };

  // Handle state change
  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    setSelectedCity(null); // Reset selected city when state changes
    if (selectedOption) {
      fetchCities(selectedOption.value); // Fetch cities for the selected state
    } else {
      setCities([]); // Clear cities if no state is selected
    }
  };

  // Mapping countries to the format required by React Select
  const countryOptions = countries.map((country) => ({
    value: country.id,
    label: country.country_name, // Using country_name for better readability, or use country.country_code for "IND"
  }));

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Fetch party list function
  const fetchPartyList = async () => {
    const orgId = localStorage.getItem("orgId");
    const branchId = localStorage.getItem("branchId");
    const token = localStorage.getItem("accessToken");

    if (!orgId || !branchId) {
      alert("Organization ID and Branch ID are required.");
      return;
    }

    if (!token) {
      console.error("Access token not found in localStorage.");
      return;
    }

    // http://localhost:8000/api/EXPENSE/PARTY_MASTER/PartyMasterList/?organization_id=1&batch_id=1
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}EXPENSE/PARTY_MASTER/PartyMasterList/?organization_id=${orgId}&batch_id=${branchId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      console.log("Party List API Response:", result);
      if (response.ok) {
        setPartyList(result.data || []); // Set the data in state
      } else {
        alert("Error fetching party list.");
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to fetch party list. Please try again.");
    }
  };

  // Fetch party list when the component is mounted
  useEffect(() => {
    fetchPartyList(); // Call fetchPartyList function on component mount
  }, []); // This runs once when the component mounts

  // const handleSave = async () => {
  //   // Get the userId from sessionStorage, orgId and branchId from localStorage
  //   const userId = sessionStorage.getItem("userId"); // Assuming userId is saved in sessionStorage
  //   const orgId = localStorage.getItem("orgId"); // Assuming orgId is saved in localStorage
  //   const branchId = localStorage.getItem("branchId"); // Assuming branchId is saved in localStorage

  //   // Validate if the values exist
  //   if (!userId || !orgId || !branchId) {
  //     alert("Required values are missing from storage.");
  //     return;
  //   }

  //   const payload = {
  //     party_name: partyName,
  //     customer_supplier: customerSupplier,
  //     enabled: enabled ? 1 : 0,
  //     address: address,
  //     city_name: selectedCity ? selectedCity.value : null, // Send city ID
  //     state_code: selectedState ? selectedState.value : null, // Send state ID
  //     country_code: selectedCountry ? selectedCountry.value : null, // Send country ID
  //     orgId: orgId, // Use orgId from localStorage
  //     branchId: branchId, // Use branchId from localStorage
  //     gst_no: gstNo,
  //     phone: 2147483647, // Use the phone value
  //     email_id: email,
  //     is_active: 1, // Assuming active by default
  //     created_by: userId, // Use userId from sessionStorage
  //   };

  //   try {
  //     const response = await fetch(
  //       `${ApiUrl.apiurl}EXPENSE/PARTY_MASTER/PartyMasterCreate/`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     const result = await response.json();

  //     if (response.ok) {
  //       alert("Party Master created successfully!");
  //     } else {
  //       alert("Error: " + JSON.stringify(result.error)); // Display actual API errors
  //     }
  //   } catch (error) {
  //     console.error("API Error:", error);
  //     alert("Failed to save party details. Please try again.");
  //   }
  // };

  const validateFields = () => {
    const newErrors = {};

    if (!partyName || partyName.trim() === "") {
      newErrors.partyName = "Party Name is required.";
    }

    if (!customerSupplier || customerSupplier.trim() === "") {
      newErrors.customerSupplier = "Customer/Supplier selection is required.";
    }

    if (!selectedCountry) {
      newErrors.selectedCountry = "Country is required.";
    }

    if (!selectedState) {
      newErrors.selectedState = "State is required.";
    }

    if (!selectedCity) {
      newErrors.selectedCity = "City is required.";
    }

    if (email && email.trim() !== "" && !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format.";
    }

    if (phone && phone.trim() !== "" && !/^\d{10}$/.test(phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;

    if (!isValid) {
      // Show which fields are missing
      const missingFields = Object.keys(newErrors).map(key => {
        const fieldNames = {
          partyName: "Party Name",
          customerSupplier: "Customer/Supplier",
          selectedCountry: "Country",
          selectedState: "State",
          selectedCity: "City",
          email: "Email",
          phone: "Phone"
        };
        return fieldNames[key] || key;
      });
      console.log("Validation failed. Missing/Invalid fields:", missingFields);
    }

    return isValid; // Return true if no errors
  };

  // const handleSave = async () => {
  //   // Get the userId from sessionStorage, orgId and branchId from localStorage
  //   const userId = sessionStorage.getItem("userId");
  //   const orgId = localStorage.getItem("orgId");
  //   const branchId = localStorage.getItem("branchId");

  //   // Validate if the values exist
  //   if (!userId || !orgId || !branchId) {
  //     alert("Required values are missing from storage.");
  //     return;
  //   }

  //   const payload = {
  //     party_name: partyName,
  //     customer_supplier: customerSupplier,
  //     enabled: enabled ? "Y" : "N",
  //     address: address,
  //     city_name: selectedCity ? selectedCity.value : null, // Send city ID
  //     state_code: selectedState ? selectedState.value : null, // Send state ID
  //     country_code: selectedCountry ? selectedCountry.value : null, // Send country ID
  //     orgId: orgId, // Use orgId from localStorage
  //     branchId: branchId, // Use branchId from localStorage
  //     gst_no: gstNo,
  //     phone: phone, // Use the phone value
  //     email_id: email,
  //     is_active: 1, // Assuming active by default
  //     created_by: userId, // Use userId from sessionStorage
  //   };

  //   try {
  //     // If partyId exists, update the data; else, create a new record
  //     const apiUrl = partyId
  //       ? `${ApiUrl.apiurl}EXPENSE/PARTY_MASTER/PARTYMASTERUpdate/${partyId}`
  //       : `${ApiUrl.apiurl}EXPENSE/PARTY_MASTER/PartyMasterCreate/`;

  //     const method = partyId ? "PUT" : "POST"; // Use PUT for update, POST for create

  //     const response = await fetch(apiUrl, {
  //       method: method,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     const result = await response.json();

  //     if (response.ok) {
  //       alert(
  //         "Party Master " + (partyId ? "updated" : "created") + " successfully!"
  //       );
  //       // After the update or creation, refetch the party list
  //       fetchPartyList(); // Call the function to fetch the updated party list
  //     } else {
  //       alert("Error: " + JSON.stringify(result.error)); // Display actual API errors
  //     }
  //   } catch (error) {
  //     console.error("API Error:", error);
  //     alert("Failed to save party details. Please try again.");
  //   }
  // };

  const handleSave = async (e) => {
    // Prevent any default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("=== Save button clicked ===");
    console.log("Form values:", {
      partyName,
      customerSupplier,
      enabled,
      selectedCountry,
      selectedState,
      selectedCity,
      address,
      phone,
      email,
      gstNo,
    });

    // Set loading state
    setLoading(true);

    try {
      // Validate fields first
      const isValid = validateFields();
      console.log("Validation result:", isValid);
      console.log("Validation errors:", errors);

      if (!isValid) {
        const errorMessages = Object.values(errors).filter(msg => msg);
        if (errorMessages.length > 0) {
          alert("Please fix the following errors:\n" + errorMessages.join("\n"));
        } else {
          alert("Please fill in all required fields correctly.");
        }
        setLoading(false);
        return; // Stop execution if validation fails
      }

      const userId = sessionStorage.getItem("userId");
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");
      const token = localStorage.getItem("accessToken");

      console.log("Storage values:", { userId, orgId, branchId, hasToken: !!token });


      if (!token) {
        alert("Authorization token not found. Please login again.");
        setLoading(false);
        return;
      }

      // Convert to integers and validate
      const userIdInt = parseInt(userId);
      const orgIdInt = parseInt(orgId);
      const branchIdInt = parseInt(branchId);



      // Prepare payload according to backend API requirements
      // Note: Backend expects 'batch_id' not 'batch'
      const payload = {
        party_name: partyName.trim(),
        customer_supplier: customerSupplier,
        enabled: enabled ? "Y" : "N",
        address: address ? address.trim() : "",
        city: selectedCity ? parseInt(selectedCity.value) : null,
        state: selectedState ? parseInt(selectedState.value) : null,
        country: selectedCountry ? parseInt(selectedCountry.value) : null,
        organization: orgIdInt,
        batch: branchIdInt, // Backend expects 'batch_id' not 'batch'
        gst_no: gstNo ? gstNo.trim() : "",
        phone: phone ? phone.trim() : "",
        email_id: email ? email.trim() : "",
        created_by: userIdInt,
      };





      const apiUrl = partyId
        ? `${ApiUrl.apiurl}EXPENSE/PARTY_MASTER/PARTYMASTERUpdate/${partyId}`
        : `${ApiUrl.apiurl}EXPENSE/PARTY_MASTER/PartyMasterCreate/`;

      const method = partyId ? "PUT" : "POST";

      console.log("API URL:", apiUrl);
      console.log("Method:", method);

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("API Response Status:", response.status);
      console.log("API Response:", result);

      if (response.ok && result.message === "success") {
        alert(
          "Party Master " + (partyId ? "updated" : "created") + " successfully!"
        );
        // Clear form after successful save
        handleClear();
        // Reset partyId for new entry
        setPartyId(null);
        // Refresh party list
        fetchPartyList();
        setLoading(false);
      } else {
        // Handle different error formats
        const errorMessage = result.error
          ? (typeof result.error === 'string' ? result.error : JSON.stringify(result.error))
          : result.message || "Failed to save party details.";
        alert("Error: " + errorMessage);
        setLoading(false);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to save party details. Please try again. Error: " + error.message);
      setLoading(false);
    }
  };

  const handleEditClick = (partyId) => {
    setPartyId(partyId);
    fetchPartyData(partyId); // Fetch the data for the clicked party
  };
  // Fetch party data when editing a party
  const fetchPartyData = async (partyId) => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Authorization token not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}EXPENSE/PARTY_MASTER/PartyMasterRetrieve?party_id=${partyId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (response.ok && result.data) {
        const partyData = result.data;
        // Set the form fields with the response data
        setPartyName(partyData.party_name);
        setCustomerSupplier(partyData.customer_supplier);
        setEnabled(partyData.enabled === "Y");
        setAddress(partyData.address);
        setPhone(partyData.phone);
        setEmail(partyData.email_id);
        setGstNo(partyData.gst_no);

        // Set country first, then fetch states
        if (partyData.countrycodeId) {
          const countryOption = {
            value: partyData.countrycodeId,
            label: partyData.country_code,
          };
          setSelectedCountry(countryOption);

          // Fetch states for the selected country and wait for it to complete
          const stateOptions = await fetchStates(partyData.countrycodeId);

          // After states are fetched, set the state
          if (partyData.stateCodeId && stateOptions.length > 0) {
            const stateOption = stateOptions.find(
              (state) => state.value === partyData.stateCodeId
            ) || {
              value: partyData.stateCodeId,
              label: partyData.state || "Unknown State",
            };
            setSelectedState(stateOption);

            // Fetch cities for the selected state and wait for it to complete
            const cityOptions = await fetchCities(partyData.stateCodeId);

            // After cities are fetched, set the city
            if (partyData.cityId && cityOptions.length > 0) {
              const cityOption = cityOptions.find(
                (city) => city.value === partyData.cityId
              ) || {
                value: partyData.cityId,
                label: partyData.city_name,
              };
              setSelectedCity(cityOption);
            }
          }
        }
      } else {
        alert("Error fetching party data.");
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to fetch party details.");
    }
    setLoading(false);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                PARTY MASTER
              </p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12  d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
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
                    onClick={() => navigate("/admin/dashboard")} // Redirect on click
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* <div className="row mb-2">
                <div
                  className="col-12"
                  style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                >
                  <span style={{ fontWeight: 700 }}>Add/Edit Party</span>
                </div>
              </div> */}

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-0">
                        <label htmlFor="party-name" className="form-label">
                          Party Name<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control detail"
                          placeholder="Enter party name details"
                          value={partyName}
                          onChange={(e) => setPartyName(e.target.value)}
                        />
                        {errors.partyName && (
                          <div className="text-danger">{errors.partyName}</div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 mb-3">
                        <label className="form-label mb-2">
                          Customer/Supplier<span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="d-flex flex-row flex-wrap gap-3">
                          <div className="form-check">
                            <input
                              className="form-check-input details"
                              type="radio"
                              name="customerSupplier"
                              id="flexRadioDefault1"
                              value="Customer"
                              checked={customerSupplier === "Customer"}
                              onChange={(e) =>
                                setCustomerSupplier(e.target.value)
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexRadioDefault1"
                            >
                              Customer
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input details"
                              type="radio"
                              name="customerSupplier"
                              id="flexRadioDefault2"
                              value="Supplier"
                              checked={customerSupplier === "Supplier"}
                              onChange={(e) =>
                                setCustomerSupplier(e.target.value)
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexRadioDefault2"
                            >
                              Supplier
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input details"
                              type="radio"
                              name="customerSupplier"
                              id="flexRadioDefault3"
                              value="Both"
                              checked={customerSupplier === "Both"}
                              onChange={(e) =>
                                setCustomerSupplier(e.target.value)
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexRadioDefault3"
                            >
                              Both
                            </label>
                          </div>
                        </div>
                        {errors.customerSupplier && (
                          <div className="text-danger">{errors.customerSupplier}</div>
                        )}
                      </div>
                      <div className="col-12 col-md-2 mb-3">
                        <label className="form-label mb-2">Status</label>
                        <div className="d-flex align-items-center">
                          <span className="me-2 fw-bold">Enabled</span>
                          <div className="form-check m-0">
                            <input
                              className="form-check-input details"
                              type="checkbox"
                              id="flexCheckDefault"
                              checked={enabled}
                              onChange={() => setEnabled(!enabled)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="phone" className="form-label">
                          Phone
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            className="form-control detail"
                            placeholder="Enter Phone"
                            value={phone}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                              if (value.length <= 10) {
                                setPhone(value);
                              }
                            }}
                          />
                          {errors.phone && (
                            <div className="text-danger">{errors.phone}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="address" className="form-label">
                          Address
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            className="form-control detail"
                            placeholder="Enter address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Other fields here */}

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="country" className="form-label">
                          Country<span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                          id="country"
                          options={countryOptions}
                          value={selectedCountry}
                          // className="react-select-container details"
                          className="detail"
                          classNamePrefix="react-select"
                          placeholder="Select country"
                          onChange={handleCountryChange} // On country change, fetch states
                        />
                        {errors.selectedCountry && (
                          <div className="text-danger">
                            {errors.selectedCountry}
                          </div>
                        )}
                      </div>

                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="state" className="form-label">
                          State<span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                          id="state"
                          options={states}
                          onChange={handleStateChange}
                          value={selectedState}
                          className="detail"
                          classNamePrefix="react-select"
                          placeholder="Select state"
                          isDisabled={!selectedCountry} // Disable state dropdown if no country selected
                        />
                        {errors.selectedState && (
                          <div className="text-danger">
                            {errors.selectedState}
                          </div>
                        )}
                      </div>

                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="city" className="form-label">
                          City<span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                          id="city"
                          className="detail"
                          options={cities}
                          value={selectedCity}
                          onChange={setSelectedCity}
                          isDisabled={!selectedState} // Disable city dropdown if no state selected
                          classNamePrefix="react-select"
                          placeholder="Select city"
                        />
                        {errors.selectedCity && (
                          <div className="text-danger">
                            {errors.selectedCity}
                          </div>
                        )}
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="address" className="form-label">
                          Email
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="  Email"
                            className="form-control detail"
                            placeholder="Enter Email"
                            ref={admissionNoRef}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="address" className="form-label">
                          GST No.
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="GST No"
                            className="form-control detail"
                            placeholder="Enter GST No"
                            ref={admissionNoRef}
                            value={gstNo}
                            onChange={(e) => setGstNo(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Other fields here */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Party Name</th>
                        <th>Customer/Supplier</th>
                        <th>GST No.</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Country</th>
                        <th>Phone No.</th>
                        <th>E-Mail</th>
                        <th>Active</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPartyList.length > 0 ? (
                        currentPartyList.map((party, index) => (
                          <tr key={party.party_id}>
                            <td>{offset + index + 1}</td>
                            <td>{party.party_name}</td>
                            <td>{party.customer_supplier}</td>
                            <td>{party.gst_no}</td>
                            <td>{party.address}</td>
                            <td>{party.city_name}</td>
                            <td>{party.state}</td>
                            <td>{party.country_code}</td>
                            <td>{party.phone}</td>
                            <td>{party.email_id}</td>
                            <td>{party.enabled === "Y" ? "Y" : "N"}</td>
                            <td>
                              {/* Edit link */}
                              <a
                                href="#"
                                onClick={() => handleEditClick(party.party_id)}
                              >
                                Edit
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="12" className="text-center">
                            No records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {pageCount > 1 && (
                  <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    activeClassName={"active"}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmAttendanceEntry;

