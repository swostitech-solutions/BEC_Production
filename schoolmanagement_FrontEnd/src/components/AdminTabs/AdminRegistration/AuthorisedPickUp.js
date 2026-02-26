import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import {
  validateAadhar,
  validatePhoneNumber,
  validateEmail,
} from "../../utils/validation";

const AuthorisedPickUp = ({ formData, setFormData }) => {
  const { id } = useParams(); // Get student ID from the URL
  const [errors, setErrors] = useState([]);

  // Ensure blank row when cleared
  useEffect(() => {
    if (!formData.authorizedpickup || formData.authorizedpickup.length === 0) {
      const blankRow = [{ name: "", relationship: "", Mobile_Number: "", remark: "", address: "", email: "" }];
      setAuthorisedPickups(blankRow);
      setFormData((prevData) => ({
        ...prevData,
        authorizedpickup: blankRow,
      }));
    } else {
      setAuthorisedPickups(formData.authorizedpickup);
    }
  }, [formData.authorizedpickup, setFormData]);

  // Initialize state based on formData, ensuring formData and authorizedpickup are defined
  const [authorisedPickups, setAuthorisedPickups] = useState(
    formData?.authorizedpickup && formData.authorizedpickup.length > 0
      ? formData.authorizedpickup
      : [{ name: "", relationship: "", Mobile_Number: "", remark: "", address: "", email: "" }]
  );

  // 12-17-2025
  // useEffect(() => {
  //   const fetchAuthorizedPickups = async () => {
  //     try {
  //       // ✅ Get organization_id and branch_id from sessionStorage
  //       const organization_id = sessionStorage.getItem("organization_id") || 1;
  //       const branch_id = sessionStorage.getItem("branch_id") || 1;
  //       const token = localStorage.getItem("accessToken"); // ✅ token

  //       // ✅ Construct the updated API URL
  //       const apiUrl = `${ApiUrl.apiurl}StudentRegistrationApi/GetStudentDetailsBasedOnId/?organization_id=${organization_id}&branch_id=${branch_id}&student_id=${id}`;

  //       console.log("📡 Fetching Authorized Pickup Data From:", apiUrl);

  //       const response = await fetch(apiUrl, {
  //         headers: {
  //           Authorization: `Bearer ${token}`, // ✅ token passed
  //         },
  //       });

  //       const data = await response.json();

  //       if (
  //         data?.data?.authorized_pickup &&
  //         (!formData?.authorizedpickup || formData.authorizedpickup.length === 0)
  //       ) {
  //         const updatedPickups = data.data.authorized_pickup.map((item) => ({
  //           name: item.name || "",
  //           relationship: item.relationship || "",
  //           Mobile_Number: item.mobile_number || "",
  //           remark: item.remark || "",
  //           isNew: false, // Mark as existing row
  //         }));

  //         // ✅ Update both local state and formData
  //         setAuthorisedPickups(updatedPickups);
  //         setFormData((prevData) => ({
  //           ...prevData,
  //           authorizedpickup: updatedPickups,
  //         }));
  //       }
  //     } catch (error) {
  //       console.error("❌ Error fetching authorized pickups:", error);
  //     }
  //   };

  //   if (id) {
  //     fetchAuthorizedPickups();
  //   }
  // }, [id, formData?.authorizedpickup?.length, setFormData]);

  // 16-01-2026
  useEffect(() => {
    const fetchAuthorizedPickups = async () => {
      try {
        const organization_id = sessionStorage.getItem("organization_id") || 1;
        const branch_id = sessionStorage.getItem("branch_id") || 1;
        const token = localStorage.getItem("accessToken");

        const apiUrl = `${ApiUrl.apiurl}StudentRegistrationApi/GetStudentDetailsBasedOnId/?organization_id=${organization_id}&branch_id=${branch_id}&student_id=${id}`;

        console.log("📡 Fetching Authorized Pickup Data From:", apiUrl);

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data?.data?.authorized_pickup) {
          const updatedPickups = data.data.authorized_pickup.map((item) => ({
            name: item.name || "",
            relationship: item.relationship || "",
            Mobile_Number: item.mobile_number || "",
            remark: item.remark || "",
            address: item.address || "",
            email: item.email || "",
            isNew: false,
          }));

          setAuthorisedPickups(updatedPickups);
          setFormData((prevData) => ({
            ...prevData,
            authorizedpickup: updatedPickups,
          }));
        }
      } catch (error) {
        console.error("❌ Error fetching authorized pickups:", error);
      }
    };

    // 🔒 Only fetch when:
    // 1. student id exists
    // 2. authorizedpickup is empty
    if (id && (!formData?.authorizedpickup || formData.authorizedpickup.length === 0)) {
      fetchAuthorizedPickups();
    }
  }, [id]);   // ✅ ONLY id in dependency

  // Function to handle adding a new row with validation
  const handleAddRow = () => {
    const incompletePickups = authorisedPickups.filter(
      (pickup) => !pickup.name || !pickup.relationship || !pickup.Mobile_Number || !pickup.address || !pickup.email
    );

    if (incompletePickups.length > 0) {
      alert(
        "Please fill in all required fields (Name, Relationship, Mobile No, Address, Email) before adding a new one."
      );
      return;
    }

    setAuthorisedPickups([
      ...authorisedPickups,
      { name: "", relationship: "", Mobile_Number: "", remark: "", address: "", email: "", isNew: true },
    ]);
  };

  //New Code 01082025
  const handleRemoveRow = (index) => {
    if (!authorisedPickups[index].isNew) {
      alert("Only newly added rows can be removed.");
      return;
    }
    const updatedRows = authorisedPickups.filter((_, i) => i !== index);
    setAuthorisedPickups(updatedRows);
    setFormData({ ...formData, authorizedpickup: updatedRows });
  };

  // Function to handle input changes
  const handleInputChange = (index, field, value) => {
    const updatedRows = [...authorisedPickups];
    updatedRows[index][field] = value;

    const updatedErrors = [...errors];
    if (typeof updatedErrors[index] !== "object" || updatedErrors[index] === null) {
      updatedErrors[index] = { mobile: typeof updatedErrors[index] === "string" ? updatedErrors[index] : "", email: "" };
    }

    // Validation for Mobile_Number field
    if (field === "Mobile_Number") {
      if (!validatePhoneNumber(value)) {
        updatedErrors[index].mobile = "Phone number must contain only numbers.";
      } else if (value.length < 10) {
        updatedErrors[index].mobile = "Phone number must be exactly 10 digits.";
      } else {
        updatedErrors[index].mobile = ""; // Clear error if valid
      }
      setErrors(updatedErrors); // Update error state
    }

    // Validation for Email field
    if (field === "email") {
      if (value && !validateEmail(value)) {
        updatedErrors[index].email = "Please enter a valid email address.";
      } else {
        updatedErrors[index].email = ""; // Clear error if valid
      }
      setErrors(updatedErrors); // Update error state
    }

    setAuthorisedPickups(updatedRows);
    setFormData({ ...formData, authorizedpickup: updatedRows }); // Update formData
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
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
              Mobile No<span className="red-text">*</span>
            </th>
            <th>
              Address<span className="red-text">*</span>
            </th>
            <th>
              EmailId<span className="red-text">*</span>
            </th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authorisedPickups.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>

              {/* ✅ Name - Only alphabets and spaces */}
              <td>
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^A-Za-z\s]/g, ""); // only letters & spaces
                    handleInputChange(index, "name", value);
                  }}
                  required
                />
              </td>

              {/* ✅ Relationship - Only alphabets and spaces */}
              <td>
                <input
                  type="text"
                  value={row.relationship}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^A-Za-z\s]/g, ""); // only letters & spaces
                    handleInputChange(index, "relationship", value);
                  }}
                  required
                />
              </td>

              {/* ✅ Mobile Number - Only digits, 10 max */}
              <td>
                <input
                  type="text"
                  value={row.Mobile_Number}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                    handleInputChange(index, "Mobile_Number", value);
                  }}
                  maxLength={10}
                  required
                />
                {errors[index]?.mobile && (
                  <span
                    style={{
                      color: "red",
                      fontSize: "0.8em",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    {errors[index].mobile}
                  </span>
                )}
              </td>

              <td>
                <input
                  type="text"
                  value={row.address}
                  onChange={(e) =>
                    handleInputChange(index, "address", e.target.value)
                  }
                  required
                />
              </td>

              <td>
                <input
                  type="email"
                  value={row.email}
                  onChange={(e) =>
                    handleInputChange(index, "email", e.target.value)
                  }
                  required
                />
                {errors[index]?.email && (
                  <span
                    style={{
                      color: "red",
                      fontSize: "0.8em",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    {errors[index].email}
                  </span>
                )}
              </td>

              <td>
                <input
                  type="text"
                  value={row.remark}
                  onChange={(e) =>
                    handleInputChange(index, "remark", e.target.value)
                  }
                />
              </td>

              <td>
                <button
                  type="button"
                  className="btn btn-danger add-row"
                  onClick={() => handleRemoveRow(index)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddRow}
        >
          Add New Guardian
        </button>
      </div>
    </div>
  );
};

export default AuthorisedPickUp;
