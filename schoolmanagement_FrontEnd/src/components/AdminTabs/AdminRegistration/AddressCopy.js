const handleSave = () => {

  const requiredFields = [
    { field: formData.first_name, fieldName: 'First Name' },
 
  ];
  const missingFields = requiredFields.filter(item => !item.field);

 
  
  const incompleteEmergencyContacts = (formData.emegencyContact || []).filter(contact => {
    return !contact.name || !contact.relationship || !contact.Mobile_Number;
  });

  const academicYearFromLocalStorage = localStorage.getItem("academicSessionId");
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
     ...(formData.transport_availed || formData.choice_month || formData.route_id || formData.route_details) && {
      transportDetails: {
        transportavailed: formData.transport_availed, 
        // choiceMonth: formData.choice_month || [], 

        choiceMonth: Array.from({ length: 12 }, (_, index) => {
        const monthId = index + 1; // Months are 1-based (1 to 12)
        return formData.choice_month?.includes(monthId) ? monthId : null;
      }),
        routeId:parseInt (formData.route_id || ""), 
        routedetails:parseInt (formData.route_details || ""), 
      },
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
  if (data.message === "success" || data.student_id || (data.data && data.data.studentBasicDetails && data.data.studentBasicDetails.student_id)) {
    alert("Student registration successful!");

    // Try to retrieve student_id from multiple possible locations in the response
    const studentId = data.student_id || 
                      (data.data && data.data.student_id) || 
                      (data.data && data.data.studentBasicDetails && data.data.studentBasicDetails.student_id);

    // If student_id is found, store it in localStorage
    if (studentId) {
      localStorage.setItem("student_id", studentId);
      console.log("student_id saved to local storage:", studentId);
    } else {
      console.warn("student_id not found in the response. Check the API response format.");
    }
  } else {
    // Handle case where the API response indicates an error
    const errorMessage = data.error || "Student registration failed! Check response for more details.";
    alert(errorMessage);
  }
})
.catch((error) => {
  console.error("Error during registration:", error);
  alert("An error occurred during registration. Please try again later.");
});


};





