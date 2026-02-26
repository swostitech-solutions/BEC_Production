import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StudentDetails from "./StudentDetails";
import AdmDesignComponent from "./FeeDetails";
import AdmPersonalDetails from "./AddressDetails";
import GuardianDetails from "./GuardianDetails";
import AdmOtherDetails from "./SiblingDetails";
import EmergencyContact from "./EmergencyContact";
import AuthorisedPickUp from "./AuthorisedPickUp";
import DocumentsSubmitted from "./DocumentsSubmitted";
import PreviousEducationDetails from "./PreviousEducationDetails";
import { ApiUrl } from "../../../ApiUrl";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export default function BasicTabs() {
  const { id } = useParams();
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [value, setValue] = React.useState(0);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isTransportAvailed, setIsTransportAvailed] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState({});
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedPickUpPoint, setSelectedPickUpPoint] = useState("");

  const [formData, setFormData] = React.useState({
    academic_year: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    addmitted_class: "",
    addmitted_section: "",
    gender: "",
    date_of_admission: "",
    dob: "",
    doj: "",
    father_name: "",
    mother_name: "",
    studentaadharno: "",
    email: "",
    registration_no: "",
    school_admission_no: "",
    cbse_reg_no: "",
    house: "",
    religion: "",
    category: "",
    nativelanguage: "",
    bloodgroup: "",
    nationality: "",
    childreninfamily: "",
    studentaadharno: "",
    username: "",
    remarks: "",
    profile_pic: "",
    father_aadharno: "",
    mother_aadharno: "",
    barcode: "",
    father_name: "",
    mother_name: "",
    fatherTitle: "",
    motherTitle: "",
    father_profession: "",
    mother_profession: "",
    father_contact_number: "",
    mother_contact_number: "",
    father_email: "",
    mother_email: "",
    rollno: "",
    student_status: "",
    primary_guardian: "",
    feeappfrom: "",
    feegroup: "",
    transport_availed: "",
    route_id: "",
    choice_month: "",
    present_address: "",
    present_city: "",
    present_state: "",
    present_country: "",
    present_pincode: "",
    present_phone_number: "",
    permanent_address: "",
    permanent_city: "",
    permanent_state: "",
    permanent_country: "",
    permanent_pincode: "",
    permanent_phone_number: "",
    sibilingsDetails: [],
    emegencyContact: [],
    authorizedpickup: [],
    documentsDetails: [],
    previousEducationDetails: [],
  });
  const numberOfTabs = 9;
  const navigate = useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleNext = () => {
    setValue((prevValue) => Math.min(prevValue + 1, numberOfTabs - 1));
  };
  const handlePrevious = () => {
    setValue((prevValue) => Math.max(prevValue - 1, 0));
  };
  const handleNewClick = () => {
    navigate("/admin/registration");
  };

  const handleClearForm = () => {
    setFormData({
      academic_year: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      addmitted_class: "",
      addmitted_section: "",
      gender: "",
      date_of_admission: "",
      dob: "",
      doj: "",
      father_name: "",
      mother_name: "",
      studentaadharno: "",
      email: "",
      registration_no: "",
      school_admission_no: "",
      cbse_reg_no: "",
      house: "",
      religion: "",
      category: "",
      nativelanguage: "",
      bloodgroup: "",
      nationality: "",
      childreninfamily: "",
      username: "",
      remarks: "",
      profile_pic: "",
      father_aadharno: "",
      mother_aadharno: "",
      barcode: "",
      fatherTitle: "",
      motherTitle: "",
      father_profession: "",
      mother_profession: "",
      father_contact_number: "",
      mother_contact_number: "",
      father_email: "",
      mother_email: "",
      rollno: "",
      student_status: "",
      primary_guardian: "",
      feeappfrom: "",
      feegroup: "",
      transportavailed: "",
      route_id: "",
      choice_month: [],
      present_address: "",
      present_city: "",
      present_state: "",
      present_country: "",
      present_pincode: "",
      present_phone_number: "",
      permanent_address: "",
      permanent_city: "",
      permanent_state: "",
      permanent_country: "",
      permanent_pincode: "",
      permanent_phone_number: "",
      sibilingsDetails: [],
      emegencyContact: [],
      authorizedpickup: [],
      documentsDetails: [],
      previousEducationDetails: [],
    });

    setIsTransportAvailed(false);
    setSelectedMonths({});
    setSelectedRoute("");
    setSelectedPickUpPoint("");
  };

  const formatToISODate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString();
  };

  useEffect(() => {
    if (id) {
      fetch(
        `${ApiUrl.apiurl}STUDENTREGISTRATIONAPI/GetStudentDetailsBasedOnId/${id}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "success") {
            setFormData({
              ...data.data,
            });
            setIsEditMode(true);
          } else {
            setErrors({ api: "Failed to fetch data" });
            setIsEditMode(false);
          }
          setIsDataLoading(false);
        })
        .catch((error) => {
          setErrors({ api: error.message });
          setIsEditMode(false);
          setIsDataLoading(false);
        });
    } else {
      setIsEditMode(false);
    }
  }, [id]);

  // const handleSave = () => {
  //   // Validate required fields
  //   const requiredFields = [
  //     { field: formData.first_name, fieldName: 'First Name' },
  //     { field: formData.addmitted_class, fieldName: 'Admitted Class' },
  //     { field: formData.addmitted_section, fieldName: 'Admitted Section' },
  //     { field: formData.date_of_admission, fieldName: 'Date Of Admission' },
  //     { field: formData.dob, fieldName: 'Date Of Birth' },
  //     { field: formData.doj, fieldName: 'Date Of Join' },
  //     { field: formData.house, fieldName: 'House' },
  //     { field: formData.religion, fieldName: 'Religion' },
  //     { field: formData.category, fieldName: 'Category' },
  //     { field: formData.father_profession, fieldName: 'Father Profession' },
  //     { field: formData.father_contact_number, fieldName: 'Father Contact Number' },
  //     { field: formData.mother_profession, fieldName: 'Mother Profession' },
  //     { field: formData.mother_contact_number, fieldName: 'Mother Contact Number' },
  //     { field: formData.primary_guardian, fieldName: 'Primary Guardian' },
  //     { field: formData.gender, fieldName: 'Gender' },
  //     { field: formData.feegroup, fieldName: 'Fee Group' },
  //     { field: formData.feeappfrom, fieldName: 'Fee App From' },
  //     { field: formData.present_state, fieldName: 'Present State' },
  //     { field: formData.present_country, fieldName: 'Present Country' },
  //     { field: formData.present_pincode, fieldName: 'Present Pincode' },
  //     { field: formData.permanent_address, fieldName: 'Permanent Address' },
  //     { field: formData.permanent_district, fieldName: 'Permanent City' },
  //     { field: formData.permanent_state, fieldName: 'Permanent State' },
  //     { field: formData.permanent_country, fieldName: 'Permanent Country' },
  //     { field: formData.permanent_pincode, fieldName: 'Permanent Pincode' },
  //     { field: formData.present_address, fieldName: 'Present Address' },
  //     { field: formData.present_district, fieldName: 'Present City' },
  //   ];

  //   // Check if any required field is missing
  //   const missingFields = requiredFields.filter(item => !item.field);

  //   if (missingFields.length > 0) {
  //     const missingFieldNames = missingFields.map(item => item.fieldName).join(', ');
  //     alert(`Please fill in the required fields: ${missingFieldNames}`);
  //     return; // Stop execution if validation fails
  //   }

  //   // Validate emergency contacts for required fields
  //   const incompleteEmergencyContacts = (formData.emegencyContact || []).filter(contact => {
  //     return !contact.name || !contact.relationship || !contact.Mobile_Number;
  //   });

  //   if (incompleteEmergencyContacts.length > 0) {
  //     alert('Please fill in all required fields for Emergency Contacts (Name, Relationship, Phone No).');
  //     return; // Stop execution if validation fails
  //   }

  //   // Validate authorized pickups for required fields
  //   const incompleteAuthorisedPickups = (formData.authorizedpickup || []).filter(pickup => {
  //     return !pickup.name || !pickup.relationship || !pickup.Mobile_Number;
  //   });

  //   if (incompleteAuthorisedPickups.length > 0) {
  //     alert('Please fill in all required fields for Authorised Pickups (Name, Relationship, Mobile No).');
  //     return; // Stop execution if validation fails
  //   }

  //   // Validate documentsDetails
  //   const incompleteDocuments = (formData.documentsDetails || []).filter(doc => {
  //     return !doc.document_no || !doc.document_type || !doc.start_from || !doc.end_to;
  //   });

  //   if (incompleteDocuments.length > 0) {
  //     alert('Please fill in all required fields for Documents (Document No., Document Type, Start Year, End Year).');
  //     return; // Stop execution if validation fails
  //   }

  //   const academicYearFromLocalStorage = localStorage.getItem("academicSessionId");
  //   const userIdFromSession = sessionStorage.getItem("userId");

  //   // Construct the payload
  //   const payload = {
  //     studentBasicDetails: {
  //       academic_year: academicYearFromLocalStorage,
  //       admission_no: null,
  //       first_name: formData.first_name,
  //       middle_name: formData.middle_name || "",
  //       last_name: formData.last_name,
  //       addmitted_class: formData.addmitted_class,
  //       addmitted_section: formData.addmitted_section,
  //       gender: formData.gender,
  //       date_of_admission: formatToISODate(formData.date_of_admission),
  //       doj: formData.doj,
  //       barcode: formData.barcode || "",
  //       registration_no: formData.registration_no || "",
  //       school_admission_no: formData.school_admission_no || null,
  //       cbse_reg_no: formData.cbse_reg_no || null,
  //       house: formData.house,
  //       religion: formData.religion,
  //       category: formData.category,
  //       nativelanguage: formData.nativelanguage || "",
  //       bloodgroup: formData.bloodgroup || "",
  //       nationality: formData.nationality,
  //       email: formData.email || "",
  //       dob: formData.dob,
  //       childreninfamily: formData.childreninfamily || null,
  //       studentaadharno: formData.studentaadharno || "",
  //       username: formData.username || "",
  //       remarks: formData.remarks || "",
  //       profile_pic: null, // Removed image upload temporarily
  //       father_name: `${formData.fatherTitle} ${formData.father_name}`,
  //       father_profession: formData.father_profession,
  //       father_contact_number: formData.father_contact_number,
  //       father_email: formData.father_email || "",
  //       father_aadharno: formData.father_aadharno || "",
  //       mother_name: `${formData.motherTitle} ${formData.mother_name}`,
  //       mother_profession: formData.mother_profession,
  //       mother_contact_number: formData.mother_contact_number,
  //       mother_email: formData.mother_email || "",
  //       mother_aadharno: formData.mother_aadharno || "",
  //       created_by: userIdFromSession,
  //       selected_student_id: selectedStudentId,
  //     },
  //     sibilingsDetails: formData.sibilingsDetails.map(sibling => ({
  //       siblings_id: sibling.siblings_id || null,
  //     })),
  //     emegencyContact: (formData.emegencyContact || []).map(contact => ({
  //       name: contact.name,
  //       relationship: contact.relationship,
  //       Mobile_Number: contact.Mobile_Number,
  //       remark: contact.remark,
  //     })) || [],
  //     authorizedpickup: (formData.authorizedpickup || []).map(pickup => ({
  //       name: pickup.name,
  //       relationship: pickup.relationship,
  //       Mobile_Number: pickup.Mobile_Number,
  //       remark: pickup.remark,
  //     })) || [],
  //     documentsDetails: (formData.documentsDetails || []).map(document => ({
  //       document_no: document.document_no,
  //       document_type: document.document_type,
  //       document_pic: null,
  //       start_from: document.start_from,
  //       end_to: document.end_to,
  //     })) || [],
  //     previousEducationDetails: (formData.previousEducationDetails || []).map(education => ({
  //       nameofschool: education.nameofschool,
  //       location: education.location,
  //       class_completed: education.class_completed,
  //       year_from: education.year_from,
  //       year_to: education.year_to,
  //       language_of_instruction: education.language_of_instruction,
  //       transfer_certificate: education.transfer_certificate,
  //       result: education.result,
  //     })) || [],
  //     feeDetails: {
  //       feegroup: formData.feegroup,
  //       feeappform: formData.feeappfrom,
  //     },
  //     transportDetails: {
  //       transportavailed: formData.transport_availed, // Boolean value
  //       choiceMonth: formData.choice_month || [], // Month choices
  //       routeId: formData.route_id || "", // Route ID
  //       routedetails: formData.route_details || "", // Route details
  //     },
  //     addressDetails: {
  //       usertype: "student",
  //       present_address: formData.present_address || "",
  //       present_pincode: formData.present_pincode || "",
  //       present_district: formData.present_district || "",
  //       present_state: formData.present_state || "",
  //       present_country: formData.present_country || "",
  //       present_phone_number: formData.present_phone_number || "",
  //       permanent_address: formData.permanent_address || "",
  //       permanent_pincode: formData.permanent_pincode || "",
  //       permanent_district: formData.permanent_district || "",
  //       permanent_state: formData.permanent_state || "",
  //       permanent_country: formData.permanent_country || "",
  //       permanent_phone_number: formData.permanent_phone_number || "",
  //     },
  //   };

  //   // Perform the API call using fetch
  //   fetch(`${ApiUrl.apiurl}STUDENTREGISTRATIONAPI/create/`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(payload),
  //   })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log("API Response:", data);
  //     if (data.message === "success" || data.student_id) {
  //       alert("Student registration successful!");
  //     } else {
  //       alert("Student registration failed! Check response for more details.");
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("Error during registration:", error);
  //   });
  // };

  // Function to format date to ISO string
  // const formatToISODate = (date) => {
  //   const parsedDate = new Date(date);
  //   return isNaN(parsedDate) ? "" : parsedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  // };

  const handleSave = () => {
    const requiredFields = [
      { field: formData.first_name, fieldName: "First Name" },
      { field: formData.addmitted_class, fieldName: "Admitted Class" },
      { field: formData.addmitted_section, fieldName: "Admitted Section" },
      { field: formData.date_of_admission, fieldName: "Date Of Admission" },
      { field: formData.dob, fieldName: "Date Of Birth" },
      { field: formData.doj, fieldName: "Date Of Join" },
      { field: formData.house, fieldName: "House" },
      { field: formData.religion, fieldName: "Religion" },
      { field: formData.category, fieldName: "Category" },
      { field: formData.father_profession, fieldName: "Father Profession" },
      {
        field: formData.father_contact_number,
        fieldName: "Father Contact Number",
      },
      { field: formData.mother_profession, fieldName: "Mother Profession" },
      {
        field: formData.mother_contact_number,
        fieldName: "Mother Contact Number",
      },
      { field: formData.primary_guardian, fieldName: "Primary Guardian" },
      { field: formData.gender, fieldName: "Gender" },
      { field: formData.feegroup, fieldName: "Fee Group" },
      { field: formData.feeappfrom, fieldName: "Fee App From" },
      { field: formData.present_state, fieldName: "Present State" },
      { field: formData.present_country, fieldName: "Present Country" },
      { field: formData.present_pincode, fieldName: "Present Pincode" },
      { field: formData.permanent_address, fieldName: "Permanent Address" },
      { field: formData.permanent_district, fieldName: "Permanent City" },
      { field: formData.permanent_state, fieldName: "Permanent State" },
      { field: formData.permanent_country, fieldName: "Permanent Country" },
      { field: formData.permanent_pincode, fieldName: "Permanent Pincode" },
      { field: formData.present_address, fieldName: "Present Address" },
      { field: formData.present_district, fieldName: "Present City" },
      { field: formData.rollno, fieldName: "Roll No" },
    ];

    const missingFields = requiredFields.filter((item) => !item.field);

    if (missingFields.length > 0) {
      const missingFieldNames = missingFields
        .map((item) => item.fieldName)
        .join(", ");
      alert(`Please fill in the required fields: ${missingFieldNames}`);
      return;
    }

    const incompleteEmergencyContacts = (formData.emegencyContact || []).filter(
      (contact) => {
        return !contact.name || !contact.relationship || !contact.Mobile_Number;
      }
    );

    if (incompleteEmergencyContacts.length > 0) {
      alert(
        "Please fill in all required fields for Emergency Contacts (Name, Relationship, Phone No)."
      );
      return; // Stop execution if validation fails
    }

    const incompleteAuthorisedPickups = (
      formData.authorizedpickup || []
    ).filter((pickup) => {
      return !pickup.name || !pickup.relationship || !pickup.Mobile_Number;
    });

    if (incompleteAuthorisedPickups.length > 0) {
      alert(
        "Please fill in all required fields for Authorised Pickups (Name, Relationship, Mobile No)."
      );
      return; // Stop execution if validation fails
    }

    const incompleteDocuments = (formData.documentsDetails || []).filter(
      (doc) => {
        return (
          !doc.document_no ||
          !doc.document_type ||
          !doc.start_from ||
          !doc.end_to
        );
      }
    );

    if (incompleteDocuments.length > 0) {
      alert(
        "Please fill in all required fields for Documents (Document No., Document Type, Start Year, End Year)."
      );
      return; // Stop execution if validation fails
    }

    // Validate Date Of Birth to ensure it is at least 2 years in the past
    const dob = new Date(formData.dob);
    const today = new Date();
    const minDOB = new Date(today.setFullYear(today.getFullYear() - 2));

    if (dob > minDOB) {
      alert("Date of Birth must be at least 2 years prior to today's date.");
      return; // Stop execution if validation fails
    }

    const academicYearFromLocalStorage =
      localStorage.getItem("academicSessionId");
    const userIdFromSession = sessionStorage.getItem("userId");

    // Construct the payload
    const payload = {
      studentBasicDetails: {
        academic_year: academicYearFromLocalStorage,
        admission_no: null,
        first_name: formData.first_name,
        middle_name: formData.middle_name || "",
        last_name: formData.last_name,
        addmitted_class: formData.addmitted_class,
        addmitted_section: formData.addmitted_section,
        gender: formData.gender,
        date_of_admission: formatToISODate(formData.date_of_admission),
        doj: formData.doj,
        // rollno: formData.rollno || "",
        barcode: formData.barcode || "",
        registration_no: formData.registration_no || "",
        school_admission_no: formData.school_admission_no || null,
        cbse_reg_no: formData.cbse_reg_no || null,
        house: formData.house,
        religion: formData.religion,
        category: formData.category,
        nativelanguage: formData.nativelanguage || "",
        bloodgroup: formData.bloodgroup || "",
        nationality: formData.nationality,
        email: formData.email || "",
        dob: formData.dob,
        childreninfamily: formData.childreninfamily || null,
        studentaadharno: formData.studentaadharno || "",
        username: formData.username || "",
        remarks: formData.remarks || "",
        profile_pic: null,
        father_name: `${formData.fatherTitle} ${formData.father_name}`,
        father_profession: formData.father_profession,
        father_contact_number: formData.father_contact_number,
        father_email: formData.father_email || "",
        father_aadharno: formData.father_aadharno || "",
        mother_name: `${formData.motherTitle} ${formData.mother_name}`,
        mother_profession: formData.mother_profession,
        mother_contact_number: formData.mother_contact_number,
        mother_email: formData.mother_email || "",
        mother_aadharno: formData.mother_aadharno || "",
        created_by: userIdFromSession,
        selected_student_id: selectedStudentId,
      },
      sibilingsDetails: formData.sibilingsDetails.map((sibling) => ({
        siblings_id: sibling.siblings_id || null,
      })),
      emegencyContact:
        (formData.emegencyContact || []).map((contact) => ({
          name: contact.name,
          relationship: contact.relationship,
          Mobile_Number: contact.Mobile_Number,
          remark: contact.remark,
        })) || [],
      authorizedpickup:
        (formData.authorizedpickup || []).map((pickup) => ({
          name: pickup.name,
          relationship: pickup.relationship,
          Mobile_Number: pickup.Mobile_Number,
          remark: pickup.remark,
        })) || [],
      documentsDetails:
        (formData.documentsDetails || []).map((document) => ({
          document_no: document.document_no,
          document_type: document.document_type,
          document_pic: null,
          start_from: document.start_from,
          end_to: document.end_to,
        })) || [],
      previousEducationDetails:
        (formData.previousEducationDetails || []).map((education) => ({
          nameofschool: education.nameofschool,
          location: education.location,
          class_completed: education.class_completed,
          year_from: education.year_from,
          year_to: education.year_to,
          language_of_instruction: education.language_of_instruction,
          transfer_certificate: education.transfer_certificate,
          result: education.result,
        })) || [],
      feeDetails: {
        feegroup: parseInt(formData.feegroup),
        feeappform: parseInt(formData.feeappfrom),
        // Remove or rename incorrect field if `period_month` was mistakenly added
      },
      // transportDetails: {
      //   transportavailed: formData.transport_availed,
      //   choiceMonth: formData.choice_month || [],
      //   routeId: formData.route_id || "",
      //   routedetails: formData.route_details || "",
      // },

      // Include transportDetails only if it has relevant data
      ...((formData.transport_availed ||
        formData.choice_month ||
        formData.route_id ||
        formData.route_details) && {
        transportDetails: {
          transportavailed: formData.transport_availed,
          // choiceMonth: formData.choice_month || [],

          choiceMonth: Array.from({ length: 12 }, (_, index) => {
            const monthId = index + 1; // Months are 1-based (1 to 12)
            return formData.choice_month?.includes(monthId) ? monthId : null;
          }),

          routeId: parseInt(formData.route_id || ""),
          routedetails: parseInt(formData.route_details || ""),
        },
      }),

      addressDetails: {
        usertype: "student",
        present_address: formData.present_address || "",
        present_pincode: formData.present_pincode || "",
        present_district: formData.present_district || "",
        present_state: formData.present_state || "",
        present_country: formData.present_country || "",
        present_phone_number: formData.present_phone_number || "",
        permanent_address: formData.permanent_address || "",
        permanent_pincode: formData.permanent_pincode || "",
        permanent_district: formData.permanent_district || "",
        permanent_state: formData.permanent_state || "",
        permanent_country: formData.permanent_country || "",
        permanent_phone_number: formData.permanent_phone_number || "",
      },
    };

    fetch(`${ApiUrl.apiurl}STUDENTREGISTRATIONAPI/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);

        // Check if the response indicates success and contains the student_id
        if (
          data.message === "success" ||
          data.student_id ||
          (data.data &&
            data.data.studentBasicDetails &&
            data.data.studentBasicDetails.student_id)
        ) {
          alert("Student registration successful!");

          // Try to retrieve student_id from multiple possible locations in the response
          const studentId =
            data.student_id ||
            (data.data && data.data.student_id) ||
            (data.data &&
              data.data.studentBasicDetails &&
              data.data.studentBasicDetails.student_id);

          // If student_id is found, store it in localStorage
          if (studentId) {
            localStorage.setItem("student_id", studentId);
            console.log("student_id saved to local storage:", studentId);
          } else {
            console.warn(
              "student_id not found in the response. Check the API response format."
            );
          }
        } else {
          // Handle case where the API response indicates an error
          const errorMessage =
            data.error ||
            "Student registration failed! Check response for more details.";
          alert(errorMessage);
        }
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        alert("An error occurred during registration. Please try again later.");
      });
  };

  // const handleUpdate = () => {
  //   const academicYearFromLocalStorage = localStorage.getItem("academicSessionId");
  //   // const academicSessionId = parseInt(localStorage.getItem("academic_year"), 10) || null;
  //   const updatedby =parseInt( sessionStorage.getItem("userId"));
  //   console.log(updatedby,"hi")

  //   const updatedData = {
  //     studentBasicDetails: {
  //       academic_year: academicYearFromLocalStorage,
  //       admission_no: formData.admission_no,
  //       first_name: formData.first_name,
  //       middle_name: formData.middle_name,
  //       last_name: formData.last_name,
  //       addmitted_class: formData.classId,
  //       addmitted_section: formData.sectionId,
  //       gender: formData.gender,
  //       doj: formData.doj,
  //       date_of_admission: formatToISODate(formData.date_of_admission),
  //       dob: formData.dob,
  //       barcode: formData.barcode,
  //       registration_no: formData.registration_no || "",
  //       school_admission_no: formData.school_admission_no,
  //       cbse_reg_no: formData.cbse_reg_no,
  //       house: formData.house,
  //       religion: formData.religion,
  //       category: formData.category,
  //       nativelanguage: formData.nativelanguage,
  //       rollno: formData.rollno,
  //       primary_guardian: formData.primary_guardian,
  //       student_status: formData.student_status,
  //       bloodgroup: formData.bloodgroup,
  //       nationality: formData.nationality,
  //       email: formData.email,
  //       childreninfamily: formData.childreninfamily,
  //       studentaadharno: formData.studentaadharno,
  //       username: formData.username,
  //       remarks: formData.remarks,
  //       profile_pic: formData.profile_pic,
  //       father_name: formData.father_name,
  //       father_profession: formData.father_profession,
  //       father_contact_number: formData.father_contact_number,
  //       father_email: formData.father_email,
  //       father_aadharno: formData.father_aadharno,
  //       mother_name: formData.mother_name,
  //       mother_profession: formData.mother_profession,
  //       mother_contact_number: formData.mother_contact_number,
  //       mother_email: formData.mother_email,
  //       mother_aadharno: formData.mother_aadharno,
  //       is_active: true,
  //       updated_by: updatedby
  //     },
  //     addressDetails: {
  //       present_address: formData.present_address,
  //       present_pincode: formData.present_pincode,
  //       present_district: formData.present_district,
  //       present_state: formData.present_state,
  //       present_country: formData.present_country,
  //       present_phone_number: formData.present_phone_number,
  //       permanent_address: formData.permanent_address,
  //       permanent_pincode: formData.permanent_pincode,
  //       permanent_district: formData.permanent_district,
  //       permanent_state: formData.permanent_state,
  //       permanent_country: formData.permanent_country,
  //       permanent_phone_number: formData.permanent_phone_number,
  //     },

  //     sibilingsDetails: formData.sibilingsDetails.map(sibling => ({
  //       siblings_id: sibling.siblings_id || null,
  //     })),
  //     emegencyContact: (formData.emegencyContact || []).map(contact => ({
  //       name: contact.name,
  //       relationship: contact.relationship,
  //       Mobile_Number: contact.Mobile_Number,
  //       remark: contact.remark,
  //     })) || [],
  //     authorizedpickup: (formData.authorizedpickup || []).map(pickup => ({
  //       name: pickup.name,
  //       relationship: pickup.relationship,
  //       Mobile_Number: pickup.Mobile_Number,
  //       remark: pickup.remark,
  //     })) || [],
  //     documentsDetails: (formData.documentsDetails || []).map(document => ({
  //       document_no: document.document_no,
  //       document_type: document.document_type,
  //       document_pic: null,
  //       start_from: document.start_from,
  //       end_to: document.end_to,
  //     })) || [],
  //     previousEducationDetails: (formData.previousEducationDetails || []).map(education => ({
  //       nameofschool: education.nameofschool,
  //       location: education.location,
  //       class_completed: education.class_completed,
  //       year_from: education.year_from,
  //       year_to: education.year_to,
  //       language_of_instruction: education.language_of_instruction,
  //       transfer_certificate: education.transfer_certificate,
  //       result: education.result,
  //     })) || [],

  //   };

  //   const apiUrl = `${ApiUrl.apiurl}STUDENTREGISTRATIONAPI/updatestudentrecord/${id}`;

  //   fetch(apiUrl, {
  //     method: "PUT",
  //     headers: {
  //         "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(updatedData),
  //   })
  //     .then((response) => {
  //         if (!response.ok) {
  //             throw new Error("Failed to update student details");
  //         }
  //         return response.json();
  //     })
  //     .then((data) => {
  //         if (data.message === "Student Updated Successfully!!") {
  //             alert("Student details updated successfully!");
  //             navigate("/admin/registration");
  //         } else {
  //             alert("Error: " + (data.message || "Failed to update student details."));
  //         }
  //     })
  //     .catch((error) => {
  //         alert("Error: " + error.message);
  //     });
  // };

  // const handleUpdate = () => {
  //   const academicYearFromLocalStorage = localStorage.getItem("academicSessionId");
  //   const updatedby = parseInt(sessionStorage.getItem("userId"));
  //   console.log(updatedby, "hi");

  //   const updatedData = {
  //     studentBasicDetails: {
  //       academic_year: academicYearFromLocalStorage,
  //       admission_no: formData.admission_no,
  //       first_name: formData.first_name,
  //       middle_name: formData.middle_name,
  //       last_name: formData.last_name,
  //       addmitted_class: formData.classId,
  //       addmitted_section: formData.sectionId,
  //       gender: formData.gender,
  //       doj: formData.doj,
  //       date_of_admission: formatToISODate(formData.date_of_admission),
  //       dob: formData.dob,
  //       barcode: formData.barcode,
  //       registration_no: formData.registration_no || "",
  //       school_admission_no: formData.school_admission_no,
  //       cbse_reg_no: formData.cbse_reg_no,
  //       house: formData.house,
  //       religion: formData.religion,
  //       category: formData.category,
  //       nativelanguage: formData.nativelanguage,
  //       rollno: formData.rollno,
  //       primary_guardian: formData.primary_guardian,
  //       student_status: formData.student_status,
  //       bloodgroup: formData.bloodgroup,
  //       nationality: formData.nationality,
  //       email: formData.email,
  //       childreninfamily: formData.childreninfamily,
  //       studentaadharno: formData.studentaadharno,
  //       username: formData.username,
  //       remarks: formData.remarks,
  //       profile_pic: formData.profile_pic,
  //       father_name: formData.father_name,
  //       father_profession: formData.father_profession,
  //       father_contact_number: formData.father_contact_number,
  //       father_email: formData.father_email,
  //       father_aadharno: formData.father_aadharno,
  //       mother_name: formData.mother_name,
  //       mother_profession: formData.mother_profession,
  //       mother_contact_number: formData.mother_contact_number,
  //       mother_email: formData.mother_email,
  //       mother_aadharno: formData.mother_aadharno,
  //       is_active: true,
  //       updated_by: updatedby,
  //     },
  //     addressDetails: {
  //       present_address: formData.present_address,
  //       present_pincode: formData.present_pincode,
  //       present_district: formData.present_district,
  //       present_state: formData.present_state,
  //       present_country: formData.present_country,
  //       present_phone_number: formData.present_phone_number,
  //       permanent_address: formData.permanent_address,
  //       permanent_pincode: formData.permanent_pincode,
  //       permanent_district: formData.permanent_district,
  //       permanent_state: formData.permanent_state,
  //       permanent_country: formData.permanent_country,
  //       permanent_phone_number: formData.permanent_phone_number,
  //     },
  //     sibilingsDetails: Array.isArray(formData.sibilingsDetails)
  //       ? formData.sibilingsDetails.map(sibling => ({
  //           siblings_id: sibling.siblings_id || null,
  //         }))
  //       : [],
  //     emegencyContact: Array.isArray(formData.emegencyContact)
  //       ? formData.emegencyContact.map(contact => ({
  //           name: contact.name,
  //           relationship: contact.relationship,
  //           Mobile_Number: contact.Mobile_Number,
  //           remark: contact.remark,
  //         }))
  //       : [],
  //     authorizedpickup: Array.isArray(formData.authorizedpickup)
  //       ? formData.authorizedpickup.map(pickup => ({
  //           name: pickup.name,
  //           relationship: pickup.relationship,
  //           Mobile_Number: pickup.Mobile_Number,
  //           remark: pickup.remark,
  //         }))
  //       : [],
  //     documentsDetails: Array.isArray(formData.documentsDetails)
  //       ? formData.documentsDetails.map(document => ({
  //           document_no: document.document_no,
  //           document_type: document.document_type,
  //           document_pic: null,
  //           start_from: document.start_from,
  //           end_to: document.end_to,
  //         }))
  //       : [],
  //     previousEducationDetails: Array.isArray(formData.previousEducationDetails)
  //       ? formData.previousEducationDetails.map(education => ({
  //           nameofschool: education.nameofschool,
  //           location: education.location,
  //           class_completed: education.class_completed,
  //           year_from: education.year_from,
  //           year_to: education.year_to,
  //           language_of_instruction: education.language_of_instruction,
  //           transfer_certificate: education.transfer_certificate,
  //           result: education.result,
  //         }))
  //       : [],
  //   };

  //   const apiUrl = `${ApiUrl.apiurl}STUDENTREGISTRATIONAPI/updatestudentrecord/${id}`;

  //   fetch(apiUrl, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(updatedData),
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Failed to update student details");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       if (data.message === "Student Updated Successfully!!") {
  //         alert("Student details updated successfully!");
  //         navigate("/admin/registration");
  //       } else {
  //         alert("Error: " + (data.message || "Failed to update student details."));
  //       }
  //     })
  //     .catch((error) => {
  //       alert("Error: " + error.message);
  //     });
  // };

  const handleUpdate = () => {
    // Retrieve values from localStorage and sessionStorage
    const academicYearFromLocalStorage =
      localStorage.getItem("academicSessionId");
    const updatedby = parseInt(sessionStorage.getItem("userId"));

    // Required fields validation for addressDetails
    const requiredAddressFields = [
      "present_address",
      "present_pincode",
      "present_district",
      "present_state",
      "present_country",
      "permanent_address",
      "permanent_pincode",
      "permanent_district",
      "permanent_state",
      "permanent_country",
    ];

    // Check for missing required fields in addressDetails
    const missingFields = requiredAddressFields.filter(
      (field) => !formData[field]
    );

    if (missingFields.length > 0) {
      alert(
        `Please fill out the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      return; // Exit function if required fields are missing
    }

    // Prepare the updated data object
    const updatedData = {
      studentBasicDetails: {
        academic_year: academicYearFromLocalStorage,
        admission_no: formData.admission_no,
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        addmitted_class: formData.classId,
        addmitted_section: formData.sectionId,
        gender: formData.gender,
        doj: formData.doj,
        date_of_admission: formatToISODate(formData.date_of_admission),
        dob: formData.dob,
        barcode: formData.barcode,
        registration_no: formData.registration_no || "",
        school_admission_no: formData.school_admission_no,
        cbse_reg_no: formData.cbse_reg_no,
        house: formData.house,
        religion: formData.religion,
        category: formData.category,
        nativelanguage: formData.nativelanguage,
        rollno: formData.rollno,
        primary_guardian: formData.primary_guardian,
        student_status: formData.student_status,
        bloodgroup: formData.bloodgroup,
        nationality: formData.nationality,
        email: formData.email,
        childreninfamily: formData.childreninfamily,
        studentaadharno: formData.studentaadharno,
        username: formData.username,
        remarks: formData.remarks,
        profile_pic: formData.profile_pic,
        father_name: formData.father_name,
        father_profession: formData.father_profession,
        father_contact_number: formData.father_contact_number,
        father_email: formData.father_email,
        father_aadharno: formData.father_aadharno,
        mother_name: formData.mother_name,
        mother_profession: formData.mother_profession,
        mother_contact_number: formData.mother_contact_number,
        mother_email: formData.mother_email,
        mother_aadharno: formData.mother_aadharno,
        is_active: true,
        updated_by: updatedby,
      },
      addressDetails: {
        present_address: formData.present_address,
        present_pincode: formData.present_pincode,
        present_district: formData.present_district,
        present_state: formData.present_state,
        present_country: formData.present_country,
        present_phone_number: formData.present_phone_number,
        permanent_address: formData.permanent_address,
        permanent_pincode: formData.permanent_pincode,
        permanent_district: formData.permanent_district,
        permanent_state: formData.permanent_state,
        permanent_country: formData.permanent_country,
        permanent_phone_number: formData.permanent_phone_number,
      },
      sibilingsDetails: Array.isArray(formData.sibilingsDetails)
        ? formData.sibilingsDetails.map((sibling) => ({
            siblings_id: sibling.siblings_id || null,
          }))
        : [],
      emegencyContact: Array.isArray(formData.emegencyContact)
        ? formData.emegencyContact.map((contact) => ({
            name: contact.name,
            relationship: contact.relationship,
            Mobile_Number: contact.Mobile_Number,
            remark: contact.remark,
          }))
        : [],
      authorizedpickup: Array.isArray(formData.authorizedpickup)
        ? formData.authorizedpickup.map((pickup) => ({
            name: pickup.name,
            relationship: pickup.relationship,
            Mobile_Number: pickup.Mobile_Number,
            remark: pickup.remark,
          }))
        : [],
      documentsDetails: Array.isArray(formData.documentsDetails)
        ? formData.documentsDetails.map((document) => ({
            document_no: document.document_no,
            document_type: document.document_type,
            document_pic: null,
            start_from: document.start_from,
            end_to: document.end_to,
          }))
        : [],
      previousEducationDetails: Array.isArray(formData.previousEducationDetails)
        ? formData.previousEducationDetails.map((education) => ({
            nameofschool: education.nameofschool,
            location: education.location,
            class_completed: education.class_completed,
            year_from: education.year_from,
            year_to: education.year_to,
            language_of_instruction: education.language_of_instruction,
            transfer_certificate: education.transfer_certificate,
            result: education.result,
          }))
        : [],
    };

    const apiUrl = `${ApiUrl.apiurl}STUDENTREGISTRATIONAPI/updatestudentrecord/${id}`;

    // API call to update student record
    fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(JSON.stringify(errorData.message));
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "Student Updated Successfully!!") {
          alert("Student details updated successfully!");
          navigate("/admin/registration");
        } else {
          alert(
            "Error: " + (data.message || "Failed to update student details.")
          );
        }
      })
      .catch((error) => {
        const errorMsg = JSON.parse(error.message);
        let message = "Error: ";
        if (
          errorMsg.studentBasicDetails &&
          errorMsg.studentBasicDetails.registration_no
        ) {
          message += "Registration number already exists. ";
        }
        if (errorMsg.addressDetails) {
          message += "Some address fields are missing.";
        }
        alert(message);
      });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <h4
          style={{ textAlign: "center", marginTop: "5px", fontWeight: "700" }}
        >
          STUDENT REGISTRATION{" "}
        </h4>
        <div
          className="row"
          style={{ border: "1px solid #ccc", padding: "0px", margin: "0px" }}
        >
          <div className="col-12 d-flex justify-content-around">
            <button
              type="button"
              className="btn btn-primary"
              style={{
                width: "150px",
              }}
              onClick={handleSave}
              disabled={isEditMode}
            >
              {" "}
              Save{" "}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{
                width: "150px",
              }}
              onClick={handleUpdate}
              disabled={!isEditMode}
            >
              {" "}
              Update{" "}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{
                width: "150px",
              }}
              onClick={handleClearForm}
            >
              {" "}
              Clear{" "}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              style={{
                width: "150px",
              }}
              onClick={handleNewClick}
            >
              {" "}
              Close{" "}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{
                width: "150px",
              }}
            >
              {" "}
              New{" "}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{
                width: "150px",
              }}
            >
              {" "}
              Admission Form{" "}
            </button>
          </div>
        </div>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Student" {...a11yProps(0)} />
          <Tab label="Fee" {...a11yProps(1)} disabled={isEditMode} />
          <Tab label="Address" {...a11yProps(2)} />
          <Tab label="Guardian" {...a11yProps(3)} />
          <Tab label="Sibling" {...a11yProps(4)} />
          <Tab label="Emergency Contact" {...a11yProps(5)} />
          <Tab label="Authorised PickUp" {...a11yProps(6)} />
          <Tab label="Documents Submitted" {...a11yProps(7)} />
          <Tab label="Previous Education " {...a11yProps(8)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <StudentDetails formData={formData} setFormData={setFormData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {" "}
        <AdmDesignComponent
          formData={formData}
          setFormData={setFormData}
        />{" "}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        {" "}
        <GuardianDetails formData={formData} setFormData={setFormData} />{" "}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <AdmPersonalDetails formData={formData} setFormData={setFormData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        {" "}
        <AdmOtherDetails formData={formData} setFormData={setFormData} />{" "}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        {" "}
        <EmergencyContact formData={formData} setFormData={setFormData} />{" "}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        {" "}
        <AuthorisedPickUp formData={formData} setFormData={setFormData} />{" "}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={7}>
        {" "}
        <DocumentsSubmitted
          formData={formData}
          setFormData={setFormData}
        />{" "}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={8}>
        {" "}
        <PreviousEducationDetails
          formData={formData}
          setFormData={setFormData}
        />{" "}
      </CustomTabPanel>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <IconButton
          onClick={handlePrevious}
          disabled={value === 0}
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />{" "}
        </IconButton>
        <IconButton
          onClick={handleNext}
          disabled={value === numberOfTabs - 1}
          sx={{ ml: 1 }}
        >
          <ArrowForwardIcon />{" "}
        </IconButton>
      </Box>
    </Box>
  );
}
