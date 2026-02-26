import React, { useEffect, useState } from "react";
import "./AdmOtherDetails.css";
import { useParams } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import {
  validateAadhar,
  validatePhoneNumber,
  validateEmail,
} from "../../utils/validation";

const AdmOtherDetails = ({ formData, setFormData }) => {
  const { id } = useParams();
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (!formData.emegencyContact || formData.emegencyContact.length === 0) {
      setFormData((prevData) => ({
        ...prevData,
        emegencyContact: [
          { name: "", relationship: "", Mobile_Number: "", remark: "" },
        ],
      }));
    }
  }, [formData.emegencyContact, setFormData]);

  //10-28-2025
  // useEffect(() => {
  //   const fetchEmergencyContacts = async () => {
  //     try {
  //       // ✅ Get org & branch IDs from sessionStorage
  //       const organization_id = sessionStorage.getItem("organization_id") || 1;
  //       const branch_id = sessionStorage.getItem("branch_id") || 1;

  //       // ✅ Build API URL dynamically
  //       const apiUrl = `${ApiUrl.apiurl}StudentRegistrationApi/GetStudentDetailsBasedOnId/?organization_id=${organization_id}&branch_id=${branch_id}&student_id=${id}`;

  //       console.log("📡 Fetching Emergency Contacts From:", apiUrl);

  //       const response = await fetch(apiUrl);
  //       const data = await response.json();

  //       // ✅ Set emergency contacts only if empty
  //       if (
  //         data?.data?.emergency_contact &&
  //         (!formData.emegencyContact || formData.emegencyContact.length === 0)
  //       ) {
  //         const emergencyData = data.data.emergency_contact.map((contact) => ({
  //           name: contact.name || "",
  //           relationship: contact.relationship || "",
  //           Mobile_Number: contact.mobile_number || "",
  //           remark: contact.remark || "",
  //         }));

  //         setFormData((prevData) => ({
  //           ...prevData,
  //           emegencyContact:
  //             emergencyData.length > 0
  //               ? emergencyData
  //               : [
  //                 {
  //                   name: "",
  //                   relationship: "",
  //                   Mobile_Number: "",
  //                   remark: "",
  //                 },
  //               ],
  //         }));

  //         console.log("✅ Emergency Contacts Loaded:", emergencyData);
  //       }
  //     } catch (error) {
  //       console.error("❌ Error fetching emergency contacts:", error);
  //     }
  //   };

  //   if (id) {
  //     fetchEmergencyContacts();
  //   }
  // }, [id, formData.emegencyContact, setFormData]);

  // 12-17-2025
  useEffect(() => {
    const fetchEmergencyContacts = async () => {
      try {
        // ✅ Get org & branch IDs from sessionStorage
        const organization_id = sessionStorage.getItem("organization_id") || 1;
        const branch_id = sessionStorage.getItem("branch_id") || 1;
        const token = localStorage.getItem("accessToken"); // ✅ token

        // ✅ Build API URL dynamically
        const apiUrl = `${ApiUrl.apiurl}StudentRegistrationApi/GetStudentDetailsBasedOnId/?organization_id=${organization_id}&branch_id=${branch_id}&student_id=${id}`;

        console.log("📡 Fetching Emergency Contacts From:", apiUrl);

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token passed
          },
        });

        const data = await response.json();

        // ✅ Set emergency contacts only if empty
        if (
          data?.data?.emergency_contact &&
          (!formData.emegencyContact || formData.emegencyContact.length === 0)
        ) {
          const emergencyData = data.data.emergency_contact.map((contact) => ({
            name: contact.name || "",
            relationship: contact.relationship || "",
            Mobile_Number: contact.mobile_number || "",
            remark: contact.remark || "",
          }));

          setFormData((prevData) => ({
            ...prevData,
            emegencyContact:
              emergencyData.length > 0
                ? emergencyData
                : [
                    {
                      name: "",
                      relationship: "",
                      Mobile_Number: "",
                      remark: "",
                    },
                  ],
          }));

          console.log("✅ Emergency Contacts Loaded:", emergencyData);
        }
      } catch (error) {
        console.error("❌ Error fetching emergency contacts:", error);
      }
    };

    if (id) {
      fetchEmergencyContacts();
    }
  }, [id, formData.emegencyContact, setFormData]);

  // Function to handle adding a new row with validation
  const handleAddRow = () => {
    // Validate required fields before adding a new row
    const incompleteContacts = formData.emegencyContact.filter(
      (contact) =>
        !contact.name || !contact.relationship || !contact.Mobile_Number
    );

    if (incompleteContacts.length > 0) {
      alert(
        "Please fill in all required fields (Name, Relationship, Phone No) for emergency contacts before adding a new one."
      );
      return; // Prevent adding a new row
    }

    // If validation passes, add a new row
    setFormData((prevData) => ({
      ...prevData,
      emegencyContact: [
        ...prevData.emegencyContact,
        { name: "", relationship: "", Mobile_Number: "", remark: "" },
      ],
    }));
  };

  // Function to handle removing a row
  const handleRemoveRow = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      emegencyContact: prevData.emegencyContact.filter((_, i) => i !== index),
    }));
  };

  // Function to handle input changes in the table
  const handleInputChange = (index, field, value) => {
    const updatedContacts = [...formData.emegencyContact];
    updatedContacts[index][field] = value;

    // Validation for Mobile_Number field
    if (field === "Mobile_Number") {
      const updatedErrors = [...errors];

      if (!validatePhoneNumber(value)) {
        updatedErrors[index] = "Phone number must contain only numbers.";
      } else if (value.length < 10) {
        updatedErrors[index] = "Phone number must be exactly 10 digits.";
      } else {
        updatedErrors[index] = ""; // Clear error if valid
      }

      setErrors(updatedErrors); // Update error state
    }

    setFormData((prevData) => ({
      ...prevData,
      emegencyContact: updatedContacts,
    }));
  };

  return (
    <div className="container-fluid form-container">
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>
                Name<span className="red-text">*</span>
              </th>
              <th>
                Relationship<span className="red-text">*</span>
              </th>
              <th>
                Phone No<span className="red-text">*</span>
              </th>
              <th>Remarks</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {formData.emegencyContact &&
              formData.emegencyContact.map((contact, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>

                  {/* ✅ Name (only alphabets & spaces allowed) */}
                  <td>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        ); // allow letters and spaces only
                        handleInputChange(index, "name", value);
                      }}
                      required
                    />
                  </td>

                  {/* ✅ Relationship (only alphabets & spaces allowed) */}
                  <td>
                    <input
                      type="text"
                      value={contact.relationship}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        ); // allow letters and spaces only
                        handleInputChange(index, "relationship", value);
                      }}
                      required
                    />
                  </td>

                  {/* ✅ Phone Number (only digits, 10 characters max) */}
                  <td>
                    <input
                      type="text"
                      value={contact.Mobile_Number}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                        handleInputChange(index, "Mobile_Number", value);
                      }}
                      maxLength={10}
                      required
                    />
                    {errors[index] && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "0.8em",
                          marginTop: "4px",
                          display: "block",
                        }}
                      >
                        {errors[index]}
                      </span>
                    )}
                  </td>

                  <td>
                    <input
                      type="text"
                      value={contact.remark}
                      onChange={(e) =>
                        handleInputChange(index, "remark", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveRow(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-end">
        <button className="btn btn-primary" onClick={handleAddRow}>
          Add New Row
        </button>
      </div>
    </div>
  );
};

export default AdmOtherDetails;
