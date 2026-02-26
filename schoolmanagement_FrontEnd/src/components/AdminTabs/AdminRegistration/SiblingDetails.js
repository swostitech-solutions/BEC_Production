import React, { useState, useEffect } from "react";
import "./AdmOtherDetails.css";
import { useParams } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import { Button } from "react-bootstrap";
import Modal from "./Modal"; // Assuming you have a Modal component for selecting students

const AdmOtherDetails = ({ formData, setFormData }) => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null); // To track which row is selected
  const [selectedStudent, setSelectedStudent] = useState(null); // To store the selected student

  // Ensure there's at least one empty row for sibling details on initial load
  useEffect(() => {
    if (!formData.sibilingsDetails || formData.sibilingsDetails.length === 0) {
      setFormData((prevData) => ({
        ...prevData,
        sibilingsDetails: [
          {
            admissionNo: "",
            studentName: "",
            class: "",
            section: "",
            siblings_id: "",
          },
        ],
      }));
    }
  }, [formData.sibilingsDetails, setFormData]);

  // useEffect(() => {
  //   const fetchSiblingDetails = async () => {
  //     try {
  //       const response = await fetch(
  //         `${ApiUrl.apiurl}STUDENTREGISTRATIONAPI/GetStudentDetailsBasedOnId/${id}`
  //       );
  //       const data = await response.json();

  //       // const siblingsData = data?.data?.sibilings_details;
  //       const siblingsData = data?.data?.sibilings_details || data?.data?.sibilingsDetails || [];

  //       if (
  //         Array.isArray(siblingsData) &&
  //         (!formData.sibilingsDetails || formData.sibilingsDetails.length === 0)
  //       ) {
  //         const siblings = siblingsData.map((sibling) => ({
  //           admissionNo: sibling.admission_no || "",
  //           studentName: `${sibling.first_name || ""} ${sibling.middle_name || ""
  //             } ${sibling.last_name || ""}`.trim(),
  //           class: sibling.classname || "",
  //           section: sibling.section || "",
  //           siblings_id: sibling.id || "",
  //         }));

  //         setFormData((prevData) => ({
  //           ...prevData,
  //           sibilingsDetails:
  //             siblings.length > 0
  //               ? siblings
  //               : [
  //                 {
  //                   admissionNo: "",
  //                   studentName: "",
  //                   class: "",
  //                   section: "",
  //                   siblings_id: "",
  //                 },
  //               ],
  //         }));
  //       }
  //     } catch (error) {
  //       console.error("Error fetching sibling details:", error);
  //     }
  //   };

  //   if (id && formData.sibilingsDetails == null) {
  //     fetchSiblingDetails();
  //   }
  // }, [id, formData.sibilingsDetails, setFormData]);

  useEffect(() => {
    const fetchSiblingDetails = async () => {
      const token = localStorage.getItem("accessToken"); // ✅ token

      try {
        const response = await fetch(
          `${ApiUrl.apiurl}STUDENTREGISTRATIONAPI/GetStudentDetailsBasedOnId/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ token passed
            },
          }
        );

        const data = await response.json();

        const siblingsData =
          data?.data?.sibilings_details || data?.data?.sibilingsDetails || [];

        if (
          Array.isArray(siblingsData) &&
          (!formData.sibilingsDetails || formData.sibilingsDetails.length === 0)
        ) {
          const siblings = siblingsData.map((sibling) => ({
            admissionNo: sibling.admission_no || "",
            studentName: `${sibling.first_name || ""} ${
              sibling.middle_name || ""
            } ${sibling.last_name || ""}`.trim(),
            class: sibling.classname || "",
            section: sibling.section || "",
            siblings_id: sibling.id || "",
          }));

          setFormData((prevData) => ({
            ...prevData,
            sibilingsDetails:
              siblings.length > 0
                ? siblings
                : [
                    {
                      admissionNo: "",
                      studentName: "",
                      class: "",
                      section: "",
                      siblings_id: "",
                    },
                  ],
          }));
        }
      } catch (error) {
        console.error("Error fetching sibling details:", error);
      }
    };

    if (id && formData.sibilingsDetails == null) {
      fetchSiblingDetails();
    }
  }, [id, formData.sibilingsDetails, setFormData]);

  // Function to handle adding a new row
  const handleAddRow = () => {
    // Validate required fields before adding a new row in sibling details
    const incompleteSiblings = formData.sibilingsDetails.filter(
      (detail) =>
        !detail.admissionNo ||
        !detail.studentName ||
        !detail.class ||
        !detail.section
    );

    if (incompleteSiblings.length > 0) {
      alert(
        "Please fill in all required fields (Admission No, Student Name, Class, Section) for sibling details before adding a new one."
      );
      return; // Prevent adding a new row
    }

    // If validation passes, add a new row
    setFormData((prevData) => ({
      ...prevData,
      sibilingsDetails: [
        ...prevData.sibilingsDetails,
        {
          admissionNo: "",
          studentName: "",
          class: "",
          section: "",
          siblings_id: "",
        },
      ],
    }));
  };

  // Function to handle removing a row
  const handleRemoveRow = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      sibilingsDetails: prevData.sibilingsDetails.filter((_, i) => i !== index),
    }));
  };

  // Function to handle input changes in the sibling details table
  const handleInputChange = (index, field, value) => {
    const updatedSiblings = [...formData.sibilingsDetails];
    updatedSiblings[index][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      sibilingsDetails: updatedSiblings,
    }));
  };

  // Function to handle opening the modal to select a student
  const handleOpenModal = (index) => {
    setSelectedRowIndex(index); // Track which row is being selected
    setShowModal(true);
  };

  // Function to handle selecting a student and closing the modal
  const handleSelectStudent = (student) => {
    const updatedSiblings = [...formData.sibilingsDetails];
    updatedSiblings[selectedRowIndex] = {
      admissionNo: student.college_admission_no,
      studentName: student.student_name,
      class: student.course_name,
      section: student.section,
      sibling_id: student.student_id, // ✅ correct key (was siblings_id)
    };
    setFormData((prevData) => ({
      ...prevData,
      sibilingsDetails: updatedSiblings,
    }));
    setSelectedStudent(student);
    setShowModal(false); // Close modal after selection
  };

  return (
    <div className="container-fluid form-container">
      <div className="table-responsive">
        <table className="table" style={{ backgroundColor: "#87CEEB" }}>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Admission No</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.sibilingsDetails &&
              formData.sibilingsDetails.map((detail, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      value={detail.admissionNo}
                      onChange={(e) =>
                        handleInputChange(index, "admissionNo", e.target.value)
                      }
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={detail.studentName}
                      onChange={(e) =>
                        handleInputChange(index, "studentName", e.target.value)
                      }
                      readOnly
                    />
                    <Button
                      style={{ marginLeft: "16px" }}
                      variant="primary"
                      onClick={() => handleOpenModal(index)}
                    >
                      Select Student
                    </Button>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={detail.class}
                      onChange={(e) =>
                        handleInputChange(index, "class", e.target.value)
                      }
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={detail.section}
                      onChange={(e) =>
                        handleInputChange(index, "section", e.target.value)
                      }
                      readOnly
                    />
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveRow(index)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-end">
        <Button variant="primary" onClick={handleAddRow}>
          Add Student
        </Button>
      </div>

      {/* Modal for selecting a student */}
      <Modal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSelectStudent={handleSelectStudent}
      />
    </div>
  );
};

export default AdmOtherDetails;
