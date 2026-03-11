// import React, { useEffect, useState, useRef } from "react";
// import {
//   validateAlphanumeric,
//   validateAadhar,
//   validateEmail,
//   validateOnlyLetters,
// } from "../../utils/validation";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./AdmRegistration.css";
// import { useNavigate } from "react-router-dom";
// import useFetchClasses from "../../hooks/useFetchClasses";
// import useFetchReligions from "../../hooks/useFetchReligions";
// import useFetchHouses from "../../hooks/useFetchHouses";
// import useFetchCategories from "../../hooks/useFetchCategories ";
// import useFetchNationalities from "../../hooks/useFetchNationalities";
// import useFetchSections from "../../hooks/useFetchSections";
// import useFetchLanguages from "../../hooks/useFetchLanguages";
// import useFetchBloodGroups from "../../hooks/useFetchBloodGroups";
// import { useParams } from "react-router-dom";
// import { ApiUrl } from "../../../ApiUrl";

// const AdmAttendanceEntry = ({ formData, setFormData }) => {
//   const { id } = useParams();
//   const [studentBasicDetails, setStudentBasicDetails] = useState(null);
//   const navigate = useNavigate();
//   const [isDataLoading, setIsDataLoading] = useState(true);
//   const [isDisabled, setIsDisabled] = useState(false);
//   const [frontCover, setFrontCover] = useState(null);
//   const [errors, setErrors] = React.useState({
//     barcode: "",
//     registration_no: "",
//     school_admission_no: "",
//     username: "",
//     cbse_reg_no: "",
//     first_name: "",
//     middle_name: "",
//     last_name: "",
//     childreninfamily: "",
//     studentaadharno: "",
//     email: "",
//     rollno: "",
//   });
//   const {
//     houses,
//     loading: loadingHouses,
//     error: errorHouses,
//   } = useFetchHouses();
//   const {
//     categories,
//     loading: loadingCategories,
//     error: errorCategories,
//   } = useFetchCategories();
//   const {
//     nationalities,
//     loading: loadingNationalities,
//     error: errorNationalities,
//   } = useFetchNationalities();
//   // const [selectedClass, setSelectedClass] = useState("");
//   const {
//     classes,
//     loading: classLoading,
//     error: classError,
//   } = useFetchClasses();
//   const [selectedClass, setSelectedClass] = useState(
//     localStorage.getItem("selectedClassId") || ""
//   );
//   // const { classes, loading: classLoading, error: classError } = useClasses();
//   const { data: languages, loading, error } = useFetchLanguages();
//   const {
//     sections,
//     loading: sectionLoading,
//     error: sectionError,
//   } = useFetchSections(selectedClass);
//   const {
//     bloodGroups,
//     loading: loadingBloodGroups,
//     error: errorBloodGroups,
//   } = useFetchBloodGroups();
//   const {
//     religions,
//     loading: religionLoading,
//     error: religionError,
//   } = useFetchReligions();
//   useEffect(() => {
//     if (id) {
//       fetch(
//         `${ApiUrl.apiurl}STUDENTREGISTRATIONAPI/GetStudentDetailsBasedOnId/${id}`
//       )
//         .then((response) => response.json())
//         .then((data) => {
//           if (data.message === "success") {
//             if (!formData.first_name) {
//               setFormData({
//                 ...data.data.student_basic_details,
//               });
//               setIsDisabled(true);
//             }
//           } else {
//             setErrors({ api: "Failed to fetch data" });
//           }
//           setIsDataLoading(false);
//         })
//         .catch((error) => {
//           setErrors({ api: error.message });
//           setIsDataLoading(false);
//         });
//     }
//   }, [id, setFormData, formData.first_name]);
//   // const handleFileChange = (e) => {
//   //   const file = e.target.files[0];
//   //   setFormData((prevData) => ({
//   //     ...prevData,
//   //     profile_pic: file,
//   //   }));
//   // };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     // Create a preview URL for the image
//     const imageURL = URL.createObjectURL(file);
//     setFrontCover(imageURL); // Set the image URL for preview

//     setFormData((prevData) => ({
//       ...prevData,
//       profile_pic: file,
//     }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     const fieldsToValidate = [
//       "barcode",
//       "registration_no",
//       "school_admission_no",
//       "username",
//       "cbse_reg_no",
//       "rollno",
//     ];
//     if (fieldsToValidate.includes(name)) {
//       if (value === "" || validateAlphanumeric(value)) {
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [name]: "",
//         }));
//       } else {
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [name]: "Only alphanumeric is allowed",
//         }));
//       }
//     }
//     // Aadhar validation
//     if (name === "studentaadharno") {
//       if (value === "" || validateAadhar(value)) {
//         if (value.length !== 12) {
//           setErrors((prevErrors) => ({
//             ...prevErrors,
//             [name]: "Aadhar number must be exactly 12 digits",
//           }));
//         } else {
//           setErrors((prevErrors) => ({
//             ...prevErrors,
//             [name]: "",
//           }));
//         }
//       } else {
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [name]: "Aadhar number must contain only numbers",
//         }));
//       }
//     }
//     // Email validation
//     if (name === "email") {
//       if (value === "" || validateEmail(value)) {
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [name]: "",
//         }));
//       } else {
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [name]: "Please enter a valid email address",
//         }));
//       }
//     }
//     // Validate only letters for name fields
//     if (
//       name === "first_name" ||
//       name === "middle_name" ||
//       name === "last_name"
//     ) {
//       if (value === "" || validateOnlyLetters(value)) {
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [name]: "",
//         }));
//       } else {
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [name]: "Only letters and spaces are allowed",
//         }));
//       }
//     }

//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };
//   const handleClassChange = (e) => {
//     const classId = e.target.value;
//     setSelectedClass(classId);
//     setFormData((prevData) => ({
//       ...prevData,
//       addmitted_class: classId,
//     }));
//     localStorage.setItem("selectedClassId", classId);
//   };
//   const handleSectionChange = (e) => {
//     const sectionId = e.target.value;
//     setFormData((prevData) => ({
//       ...prevData,
//       addmitted_section: sectionId,
//     }));
//   };
//   return (
//     <div className="container-fluid ">
//       <div className="row">
//         <div className="col-12">
//           <div className="card-body">
//             <div
//               className="row mb-3"
//               style={{ border: "1px solid #ccc", padding: "0px" }}
//             >
//               <div className="col-12">
//                 <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
//                   <div className="row flex-grow-1">
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="admission-no" className="form-label">
//                         Admission No<span style={{ color: "red" }}>*</span>{" "}
//                       </label>
//                       <input
//                         type="text"
//                         id="admission-no"
//                         className="form-control"
//                         placeholder="Enter admission no"
//                         name="last_name"
//                         value={formData.admission_no}
//                         onChange={handleInputChange}
//                         disabled
//                       />{" "}
//                     </div>
//                     <div className="col-12 col-md-3 mb-2">
//                       <label htmlFor="parent-id" className="form-label">
//                         Parent ID<span style={{ color: "red" }}>*</span>{" "}
//                       </label>
//                       <input
//                         type="text"
//                         id="parent-id"
//                         className="form-control"
//                         placeholder="Enter parent id"
//                         disabled
//                       />
//                     </div>
//                     <div className="col-12 col-md-5 mb-0">
//                       <label htmlFor="student-name" className="form-label">
//                         {" "}
//                         Student Name <span style={{ color: "red" }}>*</span>
//                       </label>
//                       <div className="d-flex align-items-center">
//                         <input
//                           type="text"
//                           id="student-name"
//                           className="form-control me-2"
//                           placeholder="Enter First name"
//                           name="first_name"
//                           value={formData.first_name}
//                           onChange={handleInputChange}
//                           required
//                         />
//                         <span style={{ color: "red" }}>*</span>
//                         {errors.first_name && (
//                           <small style={{ color: "red" }}>
//                             {errors.first_name}
//                           </small>
//                         )}
//                         <input
//                           type="text"
//                           id="student-name"
//                           className="form-control me-2"
//                           placeholder="Enter middle name"
//                           name="middle_name"
//                           value={formData.middle_name}
//                           onChange={handleInputChange}
//                         />{" "}
//                         {errors.middle_name && (
//                           <small style={{ color: "red" }}>
//                             {errors.middle_name}
//                           </small>
//                         )}
//                         <input
//                           type="text"
//                           id="student-name"
//                           className="form-control me-2"
//                           placeholder="Enter last name"
//                           name="last_name"
//                           value={formData.last_name}
//                           onChange={handleInputChange}
//                         />
//                         {errors.last_name && (
//                           <small style={{ color: "red" }}>
//                             {errors.last_name}
//                           </small>
//                         )}
//                       </div>
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="admitted-class" className="form-label">
//                         Admitted Class<span style={{ color: "red" }}>*</span>
//                       </label>
//                       {classLoading ? (
//                         <p>Loading classes...</p>
//                       ) : classError ? (
//                         <p>Error loading classes: {classError}</p>
//                       ) : (
//                         <select
//                           id="admitted-class"
//                           className="form-select"
//                           value={formData.classId}
//                           onChange={handleClassChange}
//                           required
//                         >
//                           <option value="">Select Class</option>
//                           {classes.map((classItem) => (
//                             <option key={classItem.id} value={classItem.id}>
//                               {classItem.classname}
//                             </option>
//                           ))}
//                         </select>
//                       )}
//                     </div>
//                     {/* Admitted Section */}
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="admitted-section" className="form-label">
//                         Admitted Section<span style={{ color: "red" }}>*</span>
//                       </label>
//                       {sectionLoading ? (
//                         <p>Loading sections...</p>
//                       ) : sectionError ? (
//                         <p>Error loading sections: {sectionError}</p>
//                       ) : (
//                         <select
//                           id="admitted-section"
//                           className="form-select"
//                           value={formData.sectionId}
//                           onChange={handleSectionChange}
//                           required
//                         >
//                           <option value="">Select Section</option>
//                           {sections.map((section) => (
//                             <option
//                               key={section.section_id}
//                               value={section.section_id}
//                             >
//                               {section.sectionname}
//                             </option>
//                           ))}
//                         </select>
//                       )}
//                     </div>
//                     <div className="col-12 col-sm-6 col-md-4 mb-2">
//                       <label htmlFor="gender" className="form-label">
//                         Gender<span style={{ color: "red" }}>*</span>{" "}
//                       </label>
//                       <select
//                         id="gender"
//                         name="gender"
//                         value={formData.gender}
//                         className="form-select"
//                         onChange={handleInputChange}
//                         required
//                       >
//                         <option value="">Select Gender</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                       </select>
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="date_of_admission" className="form-label">
//                         Date Of Admission{" "}
//                         <span style={{ color: "red" }}>*</span>
//                       </label>
//                       <input
//                         type="date"
//                         id="date_of_admission"
//                         className="form-control"
//                         name="date_of_admission"
//                         value={formData.date_of_admission || ""}
//                         onChange={handleInputChange}
//                         disabled={isDisabled}
//                       />
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="doj" className="form-label">
//                         Date Of Join <span style={{ color: "red" }}>*</span>
//                       </label>
//                       <input
//                         type="date"
//                         id="doj"
//                         className="form-control"
//                         name="doj"
//                         value={formData.doj || ""}
//                         onChange={handleInputChange}
//                         disabled={isDisabled}
//                       />
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="rollno" className="form-label">
//                         {" "}
//                         Roll No{" "}
//                       </label>
//                       <input
//                         type="text"
//                         id="rollno"
//                         className="form-control"
//                         placeholder="Enter roll-no"
//                         name="rollno"
//                         value={formData.rollno}
//                         onChange={handleInputChange}
//                       />
//                       {errors.rollno && (
//                         <small style={{ color: "red" }}>{errors.rollno}</small>
//                       )}{" "}
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="barcode" className="form-label">
//                         {" "}
//                         Barcode{" "}
//                       </label>
//                       <input
//                         type="text"
//                         id="barcode"
//                         className="form-control"
//                         placeholder="Enter barcode"
//                         name="barcode"
//                         value={formData.barcode}
//                         onChange={handleInputChange}
//                       />
//                       {errors.barcode && (
//                         <small style={{ color: "red" }}>{errors.barcode}</small>
//                       )}
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="registration-no" className="form-label">
//                         {" "}
//                         Registration No{" "}
//                       </label>
//                       <input
//                         type="text"
//                         id="registration-no"
//                         className="form-control"
//                         placeholder="Enter registration no"
//                         name="registration_no"
//                         value={formData.registration_no}
//                         onChange={handleInputChange}
//                       />
//                       {errors.registration_no && (
//                         <small style={{ color: "red" }}>
//                           {errors.registration_no}
//                         </small>
//                       )}
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label
//                         htmlFor="school-admission-no"
//                         className="form-label"
//                       >
//                         {" "}
//                         School Admission No{" "}
//                       </label>
//                       <input
//                         type="text"
//                         id="school-admission-no"
//                         className="form-control"
//                         placeholder="Enter school admission no"
//                         name="school_admission_no"
//                         value={formData.school_admission_no}
//                         onChange={handleInputChange}
//                       />
//                       {errors.school_admission_no && (
//                         <small style={{ color: "red" }}>
//                           {errors.school_admission_no}
//                         </small>
//                       )}
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="cbse-regn-no" className="form-label">
//                         {" "}
//                         CBSE Regn. No.{" "}
//                       </label>
//                       <input
//                         type="text"
//                         id="cbse-regn-no"
//                         className="form-control"
//                         placeholder="Enter CBSE regn. no."
//                         name="cbse_reg_no"
//                         value={formData.cbse_reg_no}
//                         onChange={handleInputChange}
//                       />
//                       {errors.cbse_reg_no && (
//                         <small style={{ color: "red" }}>
//                           {errors.cbse_reg_no}
//                         </small>
//                       )}
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="house" className="form-label">
//                         House<span style={{ color: "red" }}>*</span>{" "}
//                       </label>
//                       <select
//                         id="house"
//                         className="form-select"
//                         name="house"
//                         value={formData.house}
//                         onChange={handleInputChange}
//                       >
//                         <option value="">Select house</option>
//                         {loadingHouses && <option>Loading houses...</option>}
//                         {errorHouses && <option>Error loading houses</option>}
//                         {!loadingHouses &&
//                           !errorHouses &&
//                           houses.map((house) => (
//                             <option key={house.id} value={house.id}>
//                               {" "}
//                               {house.housename}{" "}
//                             </option>
//                           ))}{" "}
//                       </select>{" "}
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="religion" className="form-label">
//                         Religion<span style={{ color: "red" }}>*</span>{" "}
//                       </label>
//                       {religionLoading ? (
//                         <p>Loading religions...</p>
//                       ) : religionError ? (
//                         <p>Error loading religions: {religionError}</p>
//                       ) : (
//                         <select
//                           id="religion"
//                           className="form-select"
//                           name="religion"
//                           value={formData.religion}
//                           onChange={handleInputChange}
//                         >
//                           <option value="">Select Religion</option>
//                           {religions.map((religion) => (
//                             <option
//                               key={religion.id}
//                               value={religion.religioncode}
//                             >
//                               {" "}
//                               {religion.religiondescription}{" "}
//                             </option>
//                           ))}{" "}
//                         </select>
//                       )}{" "}
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="category" className="form-label">
//                         Category<span style={{ color: "red" }}>*</span>{" "}
//                       </label>
//                       {loadingCategories ? (
//                         <p>Loading categories...</p>
//                       ) : errorCategories ? (
//                         <p>Error loading categories: {errorCategories}</p>
//                       ) : (
//                         <select
//                           id="category"
//                           className="form-select"
//                           name="category"
//                           value={formData.category}
//                           onChange={handleInputChange}
//                         >
//                           <option value="">Select category</option>
//                           {categories.map((category) => (
//                             <option
//                               key={category.id}
//                               value={category.categorycode}
//                             >
//                               {" "}
//                               {category.categoryname}{" "}
//                             </option>
//                           ))}{" "}
//                         </select>
//                       )}{" "}
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="mother-tongue" className="form-label">
//                         {" "}
//                         Mother Tongue{" "}
//                       </label>
//                       <select
//                         id="mother-tongue"
//                         className="form-select"
//                         name="nativelanguage"
//                         value={formData.nativelanguage}
//                         onChange={handleInputChange}
//                       >
//                         <option value="">Select mother tongue</option>
//                         {loading && <option>Loading...</option>}
//                         {error && <option>Error fetching languages</option>}
//                         {!loading &&
//                           !error &&
//                           Array.isArray(languages) &&
//                           languages.map((language) => (
//                             <option
//                               key={language.id}
//                               value={language.languagecode}
//                             >
//                               {" "}
//                               {language.languagedesc}{" "}
//                             </option>
//                           ))}
//                         {!loading && !error && !Array.isArray(languages) && (
//                           <option>No languages available</option>
//                         )}{" "}
//                       </select>
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="blood-group" className="form-label">
//                         Blood Group <span style={{ color: "red" }}>*</span>{" "}
//                       </label>
//                       <select
//                         className="form-select"
//                         id="blood-group"
//                         name="bloodgroup"
//                         value={formData.bloodgroup}
//                         onChange={handleInputChange}
//                       >
//                         <option value="">Select</option>
//                         {loadingBloodGroups ? (
//                           <option>Loading...</option>
//                         ) : errorBloodGroups ? (
//                           <option>{errorBloodGroups}</option>
//                         ) : (
//                           bloodGroups.map((group) => (
//                             <option key={group.id} value={group.bloodcode}>
//                               {" "}
//                               {group.blooddesc}{" "}
//                             </option>
//                           ))
//                         )}{" "}
//                       </select>{" "}
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="nationality" className="form-label">
//                         {" "}
//                         Nationality<span style={{ color: "red" }}>*</span>{" "}
//                       </label>
//                       <select
//                         id="nationality"
//                         className="form-select"
//                         name="nationality"
//                         value={formData.nationality}
//                         onChange={handleInputChange}
//                       >
//                         <option value="">Select nationality</option>
//                         {loadingNationalities && <option>Loading...</option>}
//                         {errorNationalities && (
//                           <option>{errorNationalities}</option>
//                         )}
//                         {!loadingNationalities &&
//                           !errorNationalities &&
//                           nationalities.map((nationality) => (
//                             <option
//                               key={nationality.id}
//                               value={nationality.nationalitycode}
//                             >
//                               {nationality.nationalitycode}{" "}
//                             </option>
//                           ))}{" "}
//                       </select>{" "}
//                     </div>
//                     {/* <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="status" className="form-label">
//                         {" "}
//                         Status<span style={{ color: "red" }}>*</span>{" "}
//                       </label>
//                       <select
//                         id="status"
//                         className="form-select"
//                         value={formData.student_status}
//                         onChange={handleInputChange}
//                         name="student_status"
//                       >
//                         <option value="">Select status</option>
//                         <option value="ACTIVE">ACTIVE</option>
//                         <option value="INACTIVE">INACTIVE</option>
//                       </select>
//                     </div> */}
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="status" className="form-label">
//                         Status<span style={{ color: "red" }}>*</span>
//                       </label>
//                       <select
//                         id="status"
//                         className="form-select"
//                         value={formData.student_status || "ACTIVE"} // Set default value to "ACTIVE"
//                         onChange={handleInputChange}
//                         name="student_status"
//                         disabled // Disable the select field
//                       >
//                         <option value="ACTIVE">ACTIVE</option>
//                         <option value="INACTIVE">INACTIVE</option>
//                       </select>
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="email" className="form-label">
//                         {" "}
//                         Live@Edu Email{" "}
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Enter live@edu email"
//                         id="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                       />
//                       {errors.email && (
//                         <small style={{ color: "red" }}>{errors.email}</small>
//                       )}
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="date-of-birth" className="form-label">
//                         Date Of Birth <span style={{ color: "red" }}>*</span>
//                       </label>
//                       <input
//                         type="date"
//                         id="date-of-birth"
//                         className="form-control"
//                         name="dob"
//                         value={formData.dob || ""}
//                         onChange={handleInputChange}
//                         required
//                         disabled={isDisabled}
//                       />
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label
//                         htmlFor="children-in-family"
//                         className="form-label"
//                       >
//                         {" "}
//                         Children in Family{" "}
//                       </label>
//                       <input
//                         type="text"
//                         id="children-in-family"
//                         className="form-control"
//                         placeholder="Enter children in family"
//                         name="childreninfamily"
//                         value={formData.childreninfamily}
//                         // onChange={handleInputChange}
//                         onChange={(e) => {
//                           // Restrict input to only digits (0-9)
//                           const value = e.target.value.replace(/[^0-9]/g, ""); // This regex removes any non-numeric character
//                           handleInputChange({
//                             target: { name: "childreninfamily", value },
//                           });
//                         }}
//                         // maxLength={12}
//                       />{" "}
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="student-aadhar-no" className="form-label">
//                         {" "}
//                         Student Aadhar No{" "}
//                       </label>
//                       <input
//                         type="text"
//                         id="student-aadhar-no"
//                         className="form-control"
//                         placeholder="Enter student aadhar no"
//                         name="studentaadharno"
//                         value={formData.studentaadharno}
//                         // onChange={handleInputChange}
//                         onChange={(e) => {
//                           // Restrict input to only digits (0-9)
//                           const value = e.target.value.replace(/[^0-9]/g, ""); // This regex removes any non-numeric character
//                           handleInputChange({
//                             target: { name: "studentaadharno", value },
//                           });
//                         }}
//                         maxLength={12}
//                       />
//                       {errors.studentaadharno && (
//                         <small style={{ color: "red" }}>
//                           {errors.studentaadharno}
//                         </small>
//                       )}
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="user-name" className="form-label">
//                         {" "}
//                         User Name{" "}
//                       </label>
//                       <input
//                         type="text"
//                         id="user-name"
//                         className="form-control"
//                         placeholder="Enter user name"
//                         name="username"
//                         value={formData.username}
//                         onChange={handleInputChange}
//                       />
//                       {errors.username && (
//                         <small style={{ color: "red" }}>
//                           {errors.username}
//                         </small>
//                       )}
//                     </div>
//                     <div className="col-12 col-md-4 mb-2">
//                       <label htmlFor="remarks" className="form-label">
//                         {" "}
//                         Remarks{" "}
//                       </label>
//                       <input
//                         type="text"
//                         id="remarks"
//                         className="form-control"
//                         placeholder="Enter remarks"
//                         name="remarks"
//                         value={formData.remarks}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                     <div className="col-12 col-md-6 col-lg-3">
//                       <label htmlFor="profilePic" className="form-label">
//                         Profile Picture
//                       </label>
//                       <input
//                         type="file"
//                         name="profile_pic"
//                         id="profilePic"
//                         accept="image/*"
//                         onChange={handleFileChange}
//                       />
//                     </div>
//                     {/* Image preview below the input field */}
//                     {frontCover && (
//                       <div className="mt-3">
//                         <img
//                           src={frontCover}
//                           alt="Profile Picture Preview"
//                           style={{
//                             width: "120px",
//                             height: "150px",
//                             objectFit: "cover",
//                           }}
//                         />
//                       </div>
//                     )}{" "}
//                   </div>{" "}
//                 </div>{" "}
//               </div>{" "}
//             </div>{" "}
//           </div>{" "}
//         </div>{" "}
//       </div>{" "}
//     </div>
//   );
// };
// export default AdmAttendanceEntry;

// // import React, { useEffect, useState } from "react";
// // import * as XLSX from "xlsx";
// // import { ApiUrl } from "../../../ApiUrl";
// // // Function to flatten the nested objects
// // const flattenData = (data) => {
// //   const flattened = {};

// //   // Flatten studentBasicDetails
// //   const { studentBasicDetails, ...rest } = data;
// //   Object.keys(studentBasicDetails).forEach((key) => {
// //     flattened[`studentBasicDetails_${key}`] = studentBasicDetails[key];
// //   });

// //   // Flatten other sections
// //   Object.keys(rest).forEach((key) => {
// //     if (Array.isArray(rest[key])) {
// //       // Handle arrays (we will flatten them into a string)
// //       flattened[`array_${key}`] = JSON.stringify(rest[key]);
// //     } else {
// //       flattened[key] = rest[key];
// //     }
// //   });

// //   return flattened;
// // };

// // const ExportToExcelButton = () => {
// //   const [studentData, setStudentData] = useState([]);

// //   useEffect(() => {
// //     const fetchFullStudentData = async () => {
// //       try {
// //         const academicSessionId = localStorage.getItem("academicSessionId");
// //         if (!academicSessionId) {
// //           console.error("No academic session ID found in local storage");
// //           return;
// //         }

// //         const response = await fetch(`${ApiUrl.apiurl}STUDENTREGISTRATIONAPI/GetAllSTUDENTList/${academicSessionId}`);
// //         if (!response.ok) {
// //           throw new Error("Error fetching student data");
// //         }

// //         const data = await response.json();
// //         if (data.data) {
// //           const flattenedData = data.data.map((student) => flattenData(student));
// //           setStudentData(flattenedData); // Store the flattened data
// //         } else {
// //           console.warn("No data found for the given academic session ID");
// //         }
// //       } catch (error) {
// //         console.error("Fetch error:", error);
// //       }
// //     };

// //     fetchFullStudentData();
// //   }, []);

// //   // Function to export data to Excel
// //   const handleExportToExcel = () => {
// //     if (!studentData || studentData.length === 0) {
// //       alert("No data available to export");
// //       return;
// //     }

// //     const worksheet = XLSX.utils.json_to_sheet(studentData); // Convert the flattened JSON to worksheet
// //     const workbook = XLSX.utils.book_new(); // Create a new workbook
// //     XLSX.utils.book_append_sheet(workbook, worksheet, "Students"); // Append worksheet to workbook

// //     // Save the workbook as an Excel file
// //     XLSX.writeFile(workbook, "StudentData.xlsx");
// //   };

// //   return (
// //     <button
// //       type="button"
// //       className="btn btn-primary me-2"
// //       style={{
// //         "--bs-btn-padding-y": ".25rem",
// //         "--bs-btn-padding-x": ".5rem",
// //         "--bs-btn-font-size": ".75rem",
// //         width: "150px",
// //       }}
// //       onClick={handleExportToExcel} // Attach the export function here
// //     >
// //       Export To Excel
// //     </button>
// //   );
// // };

// // export default ExportToExcelButton;











import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdmRegistration.css";
import { useNavigate } from "react-router-dom";
import useFetchClasses from "../../hooks/useFetchClasses";
import useFetchSections from "../../hooks/useFetchSections";
import { useParams } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";

const AdmAttendanceEntry = ({ formData, setFormData }) => {
  const { id } = useParams();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const {
    classes,
    loading: classLoading,
    error: classError,
  } = useFetchClasses();
  const {
    sections,
    loading: sectionLoading,
    error: sectionError,
  } = useFetchSections(formData.addmitted_class || "");

  useEffect(() => {
    if (id) {
      fetch(
        `${ApiUrl.apiurl}STUDENTREGISTRATIONAPI/GetStudentDetailsBasedOnId/${id}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "success") {
            if (!formData.first_name) {
              setFormData({
                ...data.data.student_basic_details,
              });
            }
          } else {
            setErrors({ api: "Failed to fetch data" });
          }
          setIsDataLoading(false);
        })
        .catch((error) => {
          setErrors({ api: error.message });
          setIsDataLoading(false);
        });
    }
  }, [id, setFormData, formData.first_name]);

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      addmitted_class: classId,
      addmitted_section: "", // Reset section when class changes
    }));
  };

  const handleSectionChange = (e) => {
    const sectionId = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      addmitted_section: sectionId,
    }));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card-body">
            <div
              className="row mb-3"
              style={{ border: "1px solid #ccc", padding: "0px" }}
            >
              <div className="col-12">
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                  <div className="row flex-grow-1">
                    <div className="col-12 col-md-4 mb-2">
                      <label htmlFor="admitted-class" className="form-label">
                        Admitted Class<span style={{ color: "red" }}>*</span>
                      </label>
                      {classLoading ? (
                        <p>Loading classes...</p>
                      ) : classError ? (
                        <p>Error loading classes: {classError}</p>
                      ) : (
                        <select
                          id="admitted-class"
                          className="form-select"
                          value={formData.addmitted_class || ""}
                          onChange={handleClassChange}
                          required
                        >
                          <option value="">Select Class</option>
                          {classes.map((classItem) => (
                            <option key={classItem.id} value={classItem.id}>
                              {classItem.classname}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="col-12 col-md-4 mb-2">
                      <label htmlFor="admitted-section" className="form-label">
                        Admitted Section<span style={{ color: "red" }}>*</span>
                      </label>
                      {sectionLoading ? (
                        <p>Loading sections...</p>
                      ) : sectionError ? (
                        <p>Error loading sections: {sectionError}</p>
                      ) : (
                        <select
                          id="admitted-section"
                          className="form-select"
                          value={formData.addmitted_section || ""}
                          onChange={handleSectionChange}
                          required
                        >
                          <option value="">Select Section</option>
                          {sections.map((section) => (
                            <option
                              key={section.section_id}
                              value={section.section_id}
                            >
                              {section.sectionname}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    {/* Add more fields here as required */}
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

export default AdmAttendanceEntry;
