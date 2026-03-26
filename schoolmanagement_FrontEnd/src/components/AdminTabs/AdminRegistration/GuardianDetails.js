import React from "react";
import useFetchProfession from "../../hooks/useFetchProfession";
import {
  validateAadhar,
  validatePhoneNumber,
  validateEmail,
} from "../../utils/validation";
const ParentDetailsForm = ({ formData, setFormData, requiredErrors = {} }) => {
  const fatherTitleOptions = ["Mr.", "Dr.", "Prof."];
  const motherTitleOptions = ["Mrs.", "Dr.", "Prof."];

  const {
    profession,
    loading: loadingProfession,
    error: errorProfession,
  } = useFetchProfession();
  const [errors, setErrors] = React.useState({
    father_aadharno: "",
    mother_aadharno: "",
    father_contact_number: "",
    mother_contact_number: "",
    mother_email: "",
    father_email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Aadhar validation
    if (name === "father_aadharno" || name === "mother_aadharno") {
      if (value === "" || validateAadhar(value)) {
        if (value.length !== 12) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "Aadhar number must be exactly 12 digits",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "", // Clear error when valid
          }));
        }
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Aadhar number must contain only numbers",
        }));
      }
    }

    // Phone number validation
    if (name === "father_contact_number" || name === "mother_contact_number") {
      if (value === "" || validatePhoneNumber(value)) {
        if (value.length !== 10) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "Phone number must be exactly 10 digits",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
          }));
        }
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Phone number must contain only numbers",
        }));
      }
    }

    // Email validation
    if (name === "father_email" || name === "mother_email") {
      if (value === "" || validateEmail(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Please enter a valid email address",
        }));
      }
    }

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="container-fluid">
      <div
        className="row mb-3"
        style={{ border: "1px solid #ccc", padding: "15px" }}
      >
        <div className="col-12">
          <h6 style={{ fontWeight: "700" }}>Primary Guardian</h6>
        </div>

        <div className="col-12 d-flex align-items-center mb-3">
          <div className="form-check me-3">
            <input
              className="form-check-input"
              type="radio"
              name="primary_guardian"
              id="flexRadioDefault1"
              value="FATHER"   // 🔥 FIXED (uppercase)
              checked={formData.primary_guardian === "FATHER"}   // 🔥 FIXED
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="flexRadioDefault1">
              <span style={{ fontSize: "13px" }}>Father</span>
            </label>
          </div>

          <div className="form-check me-3">
            <input
              className="form-check-input"
              type="radio"
              name="primary_guardian"
              id="flexRadioDefault2"
              value="MOTHER"   // 🔥 FIXED (uppercase)
              checked={formData.primary_guardian === "MOTHER"}   // 🔥 FIXED
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="flexRadioDefault2">
              <span style={{ fontSize: "13px" }}>Mother</span>
            </label>
          </div>
        </div>

        <div className="col-12 col-md-6 mb-2">
          <label htmlFor="father_aadharno" className="form-label">
            Father's Aadhar No
          </label>
          <input
            type="text"
            id="father_aadharno"
            name="father_aadharno"
            className="form-control detail"
            value={formData.father_aadharno}
            placeholder="Enter father's aadhar no"
            maxLength={12}
            onChange={(e) => {
              // Restrict input to only digits (0-9)
              const value = e.target.value.replace(/[^0-9]/g, ""); // This regex removes any non-numeric character
              handleInputChange({ target: { name: "father_aadharno", value } });
            }}
          />
          {errors.father_aadharno && (
            <small style={{ color: "red" }}>{errors.father_aadharno}</small>
          )}
        </div>

        <div className="col-12 col-md-6 mb-2">
          <label htmlFor="mother_aadharno" className="form-label">
            Mother's Aadhar No
          </label>
          <input
            type="text"
            id="mother_aadharno"
            name="mother_aadharno"
            className="form-control detail"
            value={formData.mother_aadharno}
            placeholder="Enter mother's aadhar no"
            maxLength={12}
            onChange={(e) => {
              // Restrict input to only digits (0-9)
              const value = e.target.value.replace(/[^0-9]/g, ""); // This regex removes any non-numeric character
              handleInputChange({ target: { name: "mother_aadharno", value } });
            }}
          />
          {errors.mother_aadharno && (
            <small style={{ color: "red" }}>{errors.mother_aadharno}</small>
          )}
        </div>
      </div>

      {/* Father Details */}
      <div
        className="row mb-3"
        style={{ border: "1px solid #ccc", padding: "15px" }}
      >
        <div className="col-12">
          <h6 style={{ fontWeight: "700" }}>Father Details</h6>
        </div>
        <div className="col-12 col-md-1 mb-2">
          <label htmlFor="father-title" className="form-label">
            Title
          </label>
          <select
            className="form-select detail"
            id="father-title"
            name="fatherTitle"
            value={formData.fatherTitle}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            {!!formData.fatherTitle &&
              !fatherTitleOptions.includes(formData.fatherTitle) && (
                <option value={formData.fatherTitle}>{formData.fatherTitle}</option>
              )}
            {fatherTitleOptions.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
          {requiredErrors.fatherTitle && (
            <small style={{ color: "red" }}>{requiredErrors.fatherTitle}</small>
          )}
        </div>

        <div className="col-12 col-md-3 mb-2">
          <label htmlFor="father_name" className="form-label">
            Father's Name<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            id="father_name"
            name="father_name"
            className="form-control detail"
            placeholder="Enter name"
            value={formData.father_name}
            onChange={handleInputChange}
          />
          {requiredErrors.father_name && (
            <small style={{ color: "red" }}>{requiredErrors.father_name}</small>
          )}
        </div>

        <div className="col-12 col-md-2 mb-2">
          <label htmlFor="father-profession" className="form-label">
            Profession<span style={{ color: "red" }}>*</span>
          </label>
          <select
            className="form-select detail"
            id="father-profession"
            name="father_profession"
            value={formData.father_profession}
            onChange={handleInputChange}
            disabled={loadingProfession}
          >
            <option value="">Select profession</option>
            {loadingProfession && <option>Loading profession...</option>}
            {errorProfession && <option>Error loading profession</option>}
            {!loadingProfession &&
              !errorProfession &&
              profession.map((p) => (
                <option key={p.id} value={p.profession_code}>
                  {p.profession_description}
                </option>
              ))}
          </select>
          {requiredErrors.father_profession && (
            <small style={{ color: "red" }}>{requiredErrors.father_profession}</small>
          )}
        </div>

        {/* Father's Contact Number */}
        <div className="col-12 col-md-3 mb-2">
          <label htmlFor="father-contact" className="form-label">
            Contact Number<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            id="father-contact"
            name="father_contact_number"
            className="form-control detail"
            value={formData.father_contact_number}
            placeholder="Enter contact number"
            // onChange={handleInputChange}
            maxLength={10}
            onChange={(e) => {
              // Restrict input to only digits (0-9)
              const value = e.target.value.replace(/[^0-9]/g, ""); // This regex removes any non-numeric character
              handleInputChange({
                target: { name: "father_contact_number", value },
              });
            }}
          />
          {errors.father_contact_number && (
            <small style={{ color: "red" }}>
              {errors.father_contact_number}
            </small>
          )}
          {!errors.father_contact_number && requiredErrors.father_contact_number && (
            <small style={{ color: "red" }}>{requiredErrors.father_contact_number}</small>
          )}
        </div>
        <div className="col-12 col-md-3 mb-2">
          <label htmlFor="father-email" className="form-label">
            E-Mail
          </label>
          <input
            type="email"
            id="father-email"
            className="form-control detail"
            placeholder="Enter email"
            name="father_email"
            value={formData.father_email}
            onChange={handleInputChange}
          />
          {errors.father_email && (
            <small style={{ color: "red" }}>{errors.father_email}</small>
          )}
        </div>
      </div>

      {/* Mother Details */}
      <div
        className="row mb-3"
        style={{ border: "1px solid #ccc", padding: "15px" }}
      >
        <div className="col-12">
          <h6 style={{ fontWeight: "700" }}>Mother Details</h6>
        </div>
        <div className="col-12 col-md-1 mb-2">
          <label htmlFor="mother-title" className="form-label">
            Title
          </label>
          <select
            className="form-select detail"
            id="mother-title"
            name="motherTitle"
            value={formData.motherTitle}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            {!!formData.motherTitle &&
              !motherTitleOptions.includes(formData.motherTitle) && (
                <option value={formData.motherTitle}>{formData.motherTitle}</option>
              )}
            {motherTitleOptions.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
          {requiredErrors.motherTitle && (
            <small style={{ color: "red" }}>{requiredErrors.motherTitle}</small>
          )}
        </div>
        <div className="col-12 col-md-3 mb-2">
          <label htmlFor="mother_name" className="form-label">
            Mother's Name<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            id="mother_name"
            name="mother_name"
            className="form-control detail"
            placeholder="Enter name"
            value={formData.mother_name}
            onChange={handleInputChange}
          />
          {requiredErrors.mother_name && (
            <small style={{ color: "red" }}>{requiredErrors.mother_name}</small>
          )}
        </div>
        <div className="col-12 col-md-2 mb-2">
          <label htmlFor="mother-profession" className="form-label">
            Profession<span style={{ color: "red" }}>*</span>
          </label>
          <select
            className="form-select detail"
            id="mother-profession"
            name="mother_profession"
            value={formData.mother_profession}
            onChange={handleInputChange}
            disabled={loadingProfession}
          >
            <option value="">Select profession</option>
            {loadingProfession && <option>Loading profession...</option>}
            {errorProfession && <option>Error loading profession</option>}
            {!loadingProfession &&
              !errorProfession &&
              profession.map((p) => (
                <option key={p.id} value={p.profession_code}>
                  {p.profession_description}
                </option>
              ))}
          </select>
          {requiredErrors.mother_profession && (
            <small style={{ color: "red" }}>{requiredErrors.mother_profession}</small>
          )}
        </div>

        <div className="col-12 col-md-3 mb-2">
          <label htmlFor="mother-contact" className="form-label">
            Contact Number<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            id="mother-contact"
            className="form-control detail"
            placeholder="Enter contact number"
            name="mother_contact_number"
            value={formData.mother_contact_number}
            // onChange={handleInputChange}
            maxLength={10}
            onChange={(e) => {
              // Restrict input to only digits (0-9)
              const value = e.target.value.replace(/[^0-9]/g, ""); // This regex removes any non-numeric character
              handleInputChange({
                target: { name: "mother_contact_number", value },
              });
            }}
          />
          {errors.mother_contact_number && (
            <small style={{ color: "red" }}>
              {errors.mother_contact_number}
            </small>
          )}
          {!errors.mother_contact_number && requiredErrors.mother_contact_number && (
            <small style={{ color: "red" }}>{requiredErrors.mother_contact_number}</small>
          )}
        </div>
        {/* Mother's Email */}
        <div className="col-12 col-md-3 mb-2">
          <label htmlFor="mother-email" className="form-label">
            E-Mail
          </label>
          <input
            type="email"
            id="mother-email"
            name="mother_email"
            className="form-control detail"
            value={formData.mother_email}
            placeholder="Enter mother's email"
            onChange={handleInputChange}
          />
          {errors.mother_email && (
            <small style={{ color: "red" }}>{errors.mother_email}</small>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDetailsForm;
