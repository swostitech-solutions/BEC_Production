import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      hidden={value !== index}
      style={{ display: value === index ? "block" : "none" }}
      {...other}
    >
      <Box sx={{ p: 3 }}>{children}</Box>
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
  const location = useLocation();
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [value, setValue] = React.useState(0);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const maxTabIndex = isEditMode ? 7 : 8;
  const [isTransportAvailed, setIsTransportAvailed] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState({});
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedPickUpPoint, setSelectedPickUpPoint] = useState("");
  const [frontCover, setFrontCover] = useState(null);
  const fileInputRef = React.useRef(null);
  const profilePicRef = React.useRef(null); // ✅ holds base64 in memory (avoids storage quota errors)

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
    transport_availed: "",
    route_id: "",
    choice_semester: "",
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
    setValue((prevValue) => Math.min(prevValue + 1, maxTabIndex));
  };

  const handlePrevious = () => {
    setValue((prevValue) => Math.max(prevValue - 1, 0));
  };
  const handleNewClick = () => {
    navigate("/admin/registration");
  };

  useEffect(() => {
    const clearSessionOnRefresh = () => {
      profilePicRef.current = null; // clear in-memory ref
      sessionStorage.removeItem("profile_pic_name");
      sessionStorage.removeItem("profile_pic_type");
    };

    window.addEventListener("beforeunload", clearSessionOnRefresh);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("beforeunload", clearSessionOnRefresh);
    };
  }, []);

  //10272025
  const handleClearForm = () => {
    // 🔹 Reset all form fields including organization-related dropdowns
    setFormData({
      organization: "", // ✅ clear Organization
      branch: "", // ✅ clear Branch
      batch: "", // ✅ clear Batch
      course: "", // ✅ clear Course
      department: "", // ✅ clear Department
      academic_year: "", // ✅ clear Academic Year
      semester: "", // ✅ clear Semester
      addmitted_section: "", // ✅ clear Section

      first_name: "",
      middle_name: "",
      last_name: "",
      addmitted_class: "",
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
      profile_pic_preview: "", // ✅ clear preview
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
      transport_availed: false,
      route_id: "",
      choice_semester: [],
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
      emegencyContact: [
        { name: "", relationship: "", Mobile_Number: "", remark: "" },
      ],
      authorizedpickup: [
        { name: "", relationship: "", Mobile_Number: "", remark: "" },
      ],
      documentsDetails: [],
      previousEducationDetails: [],
    });

    // 🔹 Reset input file (profile image)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // 🔹 Reset local state variables
    setIsTransportAvailed(false);
    setSelectedMonths({});
    setSelectedRoute("");
    setSelectedPickUpPoint("");
    setFrontCover(null);

    // 🔹 Clear all stored selections used across modules
    localStorage.removeItem("selectedOrganizationId");
    localStorage.removeItem("selectedBranchId");
    localStorage.removeItem("selectedBatchId");
    localStorage.removeItem("selectedCourseId");
    localStorage.removeItem("selectedDepartmentId");
    localStorage.removeItem("selectedAcademicYearId");
    localStorage.removeItem("selectedSemesterId");
    localStorage.removeItem("selectedSectionId");
    localStorage.removeItem("selectedCategoryId");
    localStorage.removeItem("selectedClassId");

    // 🔹 Clear Fee Group enable flag and related session storage
    sessionStorage.removeItem("FeeGroupEnabled");
    sessionStorage.setItem("CategoryLogic", "false");

    // 🔹 Notify other components (like FeeDetails.js) to refresh/clear data
    window.dispatchEvent(new Event("feeGroupDependenciesChanged"));

    console.log(
      "🧹 All fields, dropdowns, and local/session storage cleared successfully"
    );

    // 🔹 Optional: scroll to top for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Notify StudentDetails to reset dropdowns
    window.dispatchEvent(new Event("clearAllStudentFields"));
  };

  const formatToISODate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString();
  };

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      setIsDataLoading(true);

      const organization_id = sessionStorage.getItem("organization_id");
      const branch_id = sessionStorage.getItem("branch_id");
      const token = localStorage.getItem("accessToken"); // 🔹 Get token from sessionStorage

      const apiUrl = `${ApiUrl.apiurl}StudentRegistrationApi/GetStudentDetailsBasedOnId/?organization_id=${organization_id}&branch_id=${branch_id}&student_id=${id}`;
      console.log("📡 Fetching student details from:", apiUrl);

      fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // 🔹 Token added here
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.message === "success") {
            const student = data.data.student_basic_details;
            const address = data.data.address_details?.[0] || {};
            const documents = data.data.documents_details || [];
            const education = data.data.previous_education_details || [];
            const emergency = data.data.emergency_contact || [];
            const authorized = data.data.authorized_pickup || [];
            // const siblings = data.data.sibilingsDetails || [];
            const siblings = data.data.sibilings_details || [];
            const term = data.data.term_details || {};

            // ✅ Proper dropdown mapping
            const formatted = {
              academic_year: student.academic_year_id?.toString() || "",
              admission_no: student.admission_no || "",
              first_name: student.first_name || "",
              middle_name: student.middle_name || "",
              last_name: student.last_name || "",
              organization: student.organization_id?.toString() || "",
              branch: student.branch_id?.toString() || "",
              course: student.course_id?.toString() || "",
              department: student.department_id?.toString() || "",
              semester: student.semester_id || "",
              addmitted_section: student.section_id?.toString() || "",
              admission_type: student.admission_type || "",

              gender: student.gender_id?.toString() || "",
              gender_label: student.gender_name || "",
              house: student.house_id ?? "",
              house_label: student.house_name || "",
              religion: student.religion_id ?? "",
              religion_label: student.religion_name || "",
              category: student.category_id?.toString() || "",
              nativelanguage: student.mother_tongue_id?.toString() || "",
              nationality: student.nationality_id?.toString() || "",
              blood_group_id: student.blood_group_id || "",
              blood_group_name: student.blood_group_name || "",

              date_of_admission: student.date_of_admission || "",
              dob: student.date_of_birth || "",
              doj: student.date_of_join || "",
              email: student.email || "",
              remarks: student.remarks || "",
              childreninfamily: student.children_in_family || "",
              studentaadharno: student.student_aadhaar_no || "",
              username: student.username || "",
              barcode: student.barcode || "",
              registration_no: student.registration_no || "",
              father_name: student.father_name || "",
              mother_name: student.mother_name || "",
              father_profession: student.father_profession || "",
              mother_profession: student.mother_profession || "",
              father_contact_number: student.father_contact_number || "",
              mother_contact_number: student.mother_contact_number || "",
              // father_aadharno: student.father_aadhaar_no || "",
              // mother_aadharno: student.mother_aadhaar_no || "",
              father_aadharno:
                student.father_aadhaar_no !== null &&
                  student.father_aadhaar_no !== undefined
                  ? String(student.father_aadhaar_no)
                  : "",

              mother_aadharno:
                student.mother_aadhaar_no !== null &&
                  student.mother_aadhaar_no !== undefined
                  ? String(student.mother_aadhaar_no)
                  : "",

              father_email: student.father_email || "",
              mother_email: student.mother_email || "",
              primary_guardian: student.primary_guardian || "",
              student_status: student.status || "",
              profile_pic: student.profile_pic || "",

              // ✅ Address Details Fix
              present_address: address.present_address || "",
              present_city: address.present_city || "",
              present_state: address.present_state || "",
              present_country: address.present_country || "",
              present_pincode: address.present_pincode || "",
              // present_phone_number: address.present_phone_number || "",
              permanent_address: address.permanent_address || "",
              permanent_city: address.permanent_city || "",
              permanent_state: address.permanent_state || "",
              permanent_country: address.permanent_country || "",
              permanent_pincode: address.permanent_pincode || "",
              // permanent_phone_number: address.permanent_phone_number || "",

              present_phone_number:
                address.present_phone_number !== null &&
                  address.present_phone_number !== undefined
                  ? address.present_phone_number
                  : "",
              permanent_phone_number:
                address.permanent_phone_number !== null &&
                  address.permanent_phone_number !== undefined
                  ? address.permanent_phone_number
                  : "",

              documentsDetails: documents.map((d, index) => {
                const fullUrl = d.document_url?.startsWith("http")
                  ? d.document_url
                  : `${ApiUrl.apiurl}${d.document_pic || ""}`;

                // Fetch preview in base64 & store in sessionStorage
                try {
                  if (fullUrl) {
                    fetch(fullUrl)
                      .then((res) => res.blob())
                      .then((blob) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64Preview = reader.result;
                          sessionStorage.setItem(
                            `document_pic_base64_${index}`,
                            base64Preview
                          );
                          sessionStorage.setItem(
                            `document_pic_name_${index}`,
                            d.document_type || `document_${index}`
                          );
                          sessionStorage.setItem(
                            `document_pic_type_${index}`,
                            blob.type
                          );
                        };
                        reader.readAsDataURL(blob);
                      });
                  }
                } catch (err) {
                  console.warn("⚠️ Error loading document preview:", err);
                }

                return {
                  document_no: d.document_no || "",
                  document_type: d.document_type || "",
                  document_pic: fullUrl || "",
                  preview_url: fullUrl || "",
                  start_from: d.start_from || "",
                  end_to: d.end_to || "",
                };
              }),

              previousEducationDetails: education.map((e) => ({
                id: e.id || "",
                nameofschool: e.name_of_institution || "",
                location: e.location || "",
                class_completed: e.course_completed || "",
                year_from: e.year_from ? e.year_from.split("T")[0] : "",
                year_to: e.year_to ? e.year_to.split("T")[0] : "",
                language_of_instruction: e.language_of_instruction || "",
                transfer_certificate:
                  e.transfer_certificate === true ||
                    e.transfer_certificate === "Y"
                    ? "Y"
                    : e.transfer_certificate === "N"
                      ? "N"
                      : "",
                result: e.result || "",
                isNew: false,
              })),
              emegencyContact: emergency.map((e) => ({
                name: e.name,
                relationship: e.relationship,
                Mobile_Number: e.mobile_number,
                remark: e.remark,
              })),
              authorizedpickup: authorized.map((a) => ({
                name: a.name,
                relationship: a.relationship,
                Mobile_Number: a.mobile_number,
                remark: a.remark,
              })),
              sibilingsDetails: (data.data.sibilings_details || []).map(
                (s) => ({
                  sibling_id: s.id || null,
                  admissionNo: s.admission_no || "",
                  studentName: `${s.first_name || ""} ${s.middle_name || ""} ${s.last_name || ""
                    }`.trim(),
                  class: s.course_name || "",
                  section: s.section || "",
                })
              ),
            };

            setFormData((prev) => ({ ...prev, ...formatted }));
          } else {
            console.error("❌ Failed to fetch student details.");
          }
        })
        .catch((err) => console.error("Error:", err))
        .finally(() => setIsDataLoading(false));
    }
  }, [id]);

  // ─── Pre-submit validation for Tabs 1–4 ──────────────────────────────────
  const validateTabsOneThroughFour = () => {
    const errs = [];

    // ── TAB 1: Student Details ───────────────────────────────────────────────
    if (!formData.first_name?.trim())
      errs.push("• First Name is required. (Student tab)");
    if (!formData.gender)
      errs.push("• Gender is required. (Student tab)");
    if (!formData.dob)
      errs.push("• Date of Birth is required. (Student tab)");
    if (!formData.date_of_admission)
      errs.push("• Date of Admission is required. (Student tab)");
    if (!formData.doj)
      errs.push("• Date of Join is required. (Student tab)");
    if (!formData.religion)
      errs.push("• Religion is required. (Student tab)");
    if (!formData.category)
      errs.push("• Category is required. (Student tab)");
    if (!formData.house)
      errs.push("• House is required. (Student tab)");
    if (!formData.nationality)
      errs.push("• Nationality is required. (Student tab)");
    if (!formData.blood_group_id)
      errs.push("• Blood Group is required. (Student tab)");
    if (!formData.email?.trim())
      errs.push("• Email is required. (Student tab)");

    // Academic hierarchy
    const batchId =
      formData.batch || sessionStorage.getItem("batch_id");
    const courseId =
      formData.course || sessionStorage.getItem("course_id");
    const deptId =
      formData.department || sessionStorage.getItem("department_id");
    const semesterId =
      formData.semester || sessionStorage.getItem("semester_id");
    const sectionId =
      formData.addmitted_section || sessionStorage.getItem("section_id");
    const academicYearId =
      formData.academic_year ||
      sessionStorage.getItem("academic_year_id") ||
      localStorage.getItem("selectedAcademicYearId");

    if (!batchId) errs.push("• Session / Batch is required. (Student tab)");
    if (!courseId) errs.push("• Course is required. (Student tab)");
    if (!deptId) errs.push("• Department is required. (Student tab)");
    if (!academicYearId) errs.push("• Academic Year is required. (Student tab)");
    if (!semesterId) errs.push("• Semester is required. (Student tab)");
    if (!sectionId) errs.push("• Section is required. (Student tab)");

    // ── TAB 2: Guardian Details ──────────────────────────────────────────────
    if (!formData.father_name?.trim())
      errs.push("• Father's Name is required. (Guardian tab)");
    if (!formData.father_profession?.trim())
      errs.push("• Father's Profession is required. (Guardian tab)");
    if (!formData.mother_name?.trim())
      errs.push("• Mother's Name is required. (Guardian tab)");
    if (!formData.mother_profession?.trim())
      errs.push("• Mother's Profession is required. (Guardian tab)");

    // ── TAB 3: Address Details ───────────────────────────────────────────────
    if (!formData.present_address?.trim())
      errs.push("• Residence Address is required. (Address tab)");
    if (!formData.present_country?.trim())
      errs.push("• Residence Country is required. (Address tab)");
    if (!formData.present_state?.trim())
      errs.push("• Residence State is required. (Address tab)");
    if (!formData.present_city?.trim())
      errs.push("• Residence City / District is required. (Address tab)");
    if (!formData.present_pincode?.trim())
      errs.push("• Residence Pincode is required. (Address tab)");
    else if (String(formData.present_pincode).trim().length !== 6)
      errs.push("• Residence Pincode must be exactly 6 digits. (Address tab)");

    if (!formData.permanent_address?.trim())
      errs.push("• Permanent Address is required. (Address tab)");
    if (!formData.permanent_country?.trim())
      errs.push("• Permanent Country is required. (Address tab)");
    if (!formData.permanent_state?.trim())
      errs.push("• Permanent State is required. (Address tab)");
    if (!formData.permanent_city?.trim())
      errs.push("• Permanent City / District is required. (Address tab)");
    if (!formData.permanent_pincode?.trim())
      errs.push("• Permanent Pincode is required. (Address tab)");
    else if (String(formData.permanent_pincode).trim().length !== 6)
      errs.push("• Permanent Pincode must be exactly 6 digits. (Address tab)");

    // ── TAB 4: Fee Details (create only – fee group is locked on edit) ───────
    if (!id) {
      if (!formData.feegroup)
        errs.push("• Fee Group is required. (Fee tab)");
      if (!formData.feeappfrom)
        errs.push("• Fee Applied From (Semester) is required. (Fee tab)");
    }

    return errs;
  };

  const handleSave = async () => {
    // ── Pre-submit validation ────────────────────────────────────────────────
    const validationErrors = validateTabsOneThroughFour();
    if (validationErrors.length > 0) {
      alert(
        "⚠️ Please fix the following before saving:\n\n" +
        validationErrors.join("\n")
      );
      return;
    }
    // ────────────────────────────────────────────────────────────────────────
    const organization_id = sessionStorage.getItem("organization_id");
    const branch_id = sessionStorage.getItem("branch_id");
    const academicYearId =
      sessionStorage.getItem("academic_year_id") ||
      localStorage.getItem("selectedAcademicYearId") ||
      localStorage.getItem("academicSessionId") ||
      "";
    const batchId = sessionStorage.getItem("batch_id");
    const courseId = sessionStorage.getItem("course_id");
    const departmentId = sessionStorage.getItem("department_id");
    const semesterId = sessionStorage.getItem("semester_id");
    const sectionId = sessionStorage.getItem("section_id");
    const userId = sessionStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");

    try {
      const student_basic_detail = {
        academic_year: formData.academic_year || academicYearId,
        organization: organization_id,
        branch: branch_id,
        batch: formData.batch || batchId || "",
        course: formData.course || courseId || "",
        department: formData.department || departmentId || "",
        semester: formData.semester || semesterId || "",
        section: formData.addmitted_section || sectionId || "",
        admission_no: null,
        first_name: formData.first_name,
        middle_name: formData.middle_name || "",
        last_name: formData.last_name,
        gender: formData.gender,
        date_of_admission: formData.date_of_admission,
        admission_type: formData.admission_type || "Regular",
        date_of_join: formData.doj,
        barcode: formData.barcode || "",
        registration_no: formData.registration_no || "",
        college_admission_no: null,
        house: formData.house,
        religion: formData.religion,
        category: formData.category,
        mother_tongue: parseInt(formData.language) || null,
        blood: parseInt(formData.blood_group_id) || null,
        nationality: formData.nationality,
        email: formData.email,
        date_of_birth: formData.dob,
        children_in_family: formData.childreninfamily || "",
        student_aadhaar_no: formData.studentaadharno,
        user_name: formData.username,
        remarks: formData.remarks,
        profile_pic: null,
        father_name: formData.father_name,
        father_profession: formData.father_profession,
        father_contact_number: formData.father_contact_number,
        father_email: formData.father_email || "",
        father_aadhaar_no: formData.father_aadharno,
        mother_name: formData.mother_name,
        mother_profession: formData.mother_profession,
        mother_contact_number: formData.mother_contact_number,
        mother_email: formData.mother_email || "",
        mother_aadhaar_no: formData.mother_aadharno,
        created_by: userId,
        status: formData.student_status || "ACTIVE",
      };

      const fee_detail = {
        fee_group: parseInt(formData.feegroup) || 1,
        fee_applied_from: parseInt(formData.feeappfrom) || 1,
      };

      const transport_detail = {
        transport_availed: formData.transport_availed || false,
        choice_semester: formData.choice_semester || [],
        route_id: formData.route_id || 1,
        route_detail: formData.route_details || 1,
      };

      const address_detail = {
        usertype: "student",
        present_address: formData.present_address,
        present_pincode: formData.present_pincode,
        // present_city: formData.present_city,
        present_city: formData.present_district || formData.present_city || "",
        present_state: formData.present_state,
        present_country: formData.present_country,
        present_phone_number: formData.present_phone_number,
        permanent_address: formData.permanent_address,
        permanent_pincode: formData.permanent_pincode,
        // permanent_city: formData.permanent_city,
        permanent_city:
          formData.permanent_district || formData.permanent_city || "",
        permanent_state: formData.permanent_state,
        permanent_country: formData.permanent_country,
        permanent_phone_number: formData.permanent_phone_number,
      };

      const sibling_detail =
        Array.isArray(formData.sibilingsDetails) &&
          formData.sibilingsDetails.length > 0
          ? formData.sibilingsDetails
            // ✅ Filter out rows with no sibling_id or sibling value
            .filter(
              (s) =>
                s &&
                (s.sibling_id || s.sibling) && // must have a valid sibling reference
                String(s.sibling_id || s.sibling).trim() !== ""
            )
            .map((s) => ({
              sibling: s.sibling_id || s.sibling,
              student: null,
              is_active: true,
              created_by: userId,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }))
          : [];

      const emergency_contact = (formData.emegencyContact || []).map((c) => ({
        name: c.name,
        relationship: c.relationship,
        mobile_number: c.Mobile_Number,
        remark: c.remark,
      }));

      const authorized_pickup = (formData.authorizedpickup || []).map((a) => ({
        name: a.name,
        relationship: a.relationship,
        mobile_number: a.Mobile_Number,
        remark: a.remark,
      }));

      const document_detail = (formData.documentsDetails || []).map((d) => ({
        document_no: d.document_no,
        document_type: d.document_type,
        start_from: d.start_from ? d.start_from : null,
        end_to: d.end_to ? d.end_to : null,
      }));

      const previous_education_detail = (
        formData.previousEducationDetails || []
      ).map((e) => ({
        name_of_institution: e.nameofschool,
        location: e.location,
        course_completed: e.class_completed,
        year_from: e.year_from,
        year_to: e.year_to,
        language_of_instruction: e.language_of_instruction,
        transfer_certificate: e.transfer_certificate,
        result: e.result,
      }));

      const formPayload = new FormData();
      formPayload.append(
        "student_basic_detail",
        JSON.stringify(student_basic_detail)
      );
      formPayload.append("fee_detail", JSON.stringify(fee_detail));
      formPayload.append("transport_detail", JSON.stringify(transport_detail));
      formPayload.append("address_detail", JSON.stringify(address_detail));
      formPayload.append("sibling_detail", JSON.stringify(sibling_detail));
      formPayload.append(
        "emergency_contact",
        JSON.stringify(emergency_contact)
      );
      formPayload.append(
        "authorized_pickup",
        JSON.stringify(authorized_pickup)
      );
      formPayload.append("document_detail", JSON.stringify(document_detail));
      formPayload.append(
        "previous_education_detail",
        JSON.stringify(previous_education_detail)
      );

      // Attach profile image if exists (from in-memory ref, not sessionStorage)
      const base64Data = profilePicRef.current;
      const fileName = sessionStorage.getItem("profile_pic_name");
      const fileType = sessionStorage.getItem("profile_pic_type");

      if (base64Data && fileName && fileType) {
        const res = await fetch(base64Data);
        const blob = await res.blob();
        const file = new File([blob], fileName, { type: fileType });
        formPayload.append("profile_pic", file);
      }

      // Document images
      (formData.documentsDetails || []).forEach((doc, i) => {
        if (doc.document_pic && typeof doc.document_pic !== "string") {
          formPayload.append(`document_pic[${i}]`, doc.document_pic);
        }
      });

      const response = await fetch(
        `${ApiUrl.apiurl}StudentRegistration/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formPayload,
        }
      );

      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (_) {
        // Server returned an HTML error page (e.g. Render 502, Django debug page)
        console.error("Non-JSON response from server:", responseText.slice(0, 300));
        alert(
          `❌ Server returned an unexpected response (HTTP ${response.status}).\n` +
          "Please check the server logs or contact support."
        );
        return;
      }
      console.log("API Response:", result);

      if (
        result.message === "success" ||
        result.message === "Student Registered Successfully."
      ) {
        alert("✅ Student Registered successfully!");
        setFormData({});
        profilePicRef.current = null; // clear in-memory ref
        sessionStorage.removeItem("profile_pic_name");
        sessionStorage.removeItem("profile_pic_type");
        navigate("/admin/registration");
      } else {
        const errMsg =
          result.message || result.error || JSON.stringify(result);
        alert("❌ Failed: " + errMsg);
        console.error("Save Failed:", result);
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Something went wrong while saving student data.");
    }
  };

  const handleUpdate = async () => {
    // ── Pre-submit validation ────────────────────────────────────────────────
    const validationErrors = validateTabsOneThroughFour();
    if (validationErrors.length > 0) {
      alert(
        "⚠️ Please fix the following before updating:\n\n" +
        validationErrors.join("\n")
      );
      return;
    }
    // ────────────────────────────────────────────────────────────────────────
    const token = localStorage.getItem("accessToken");
    const userId = sessionStorage.getItem("userId");
    const studentId = id || formData.id; // from URL params
    const apiUrl = `${ApiUrl.apiurl}StudentRegistrationApi/UpdateStudentRecord/?student_id=${studentId}`;
    console.log("📡 Updating student record:", apiUrl);

    try {
      const student_basic_detail = {
        academic_year: formData.academic_year || 1,
        organization: formData.organization || "1",
        admission_type: formData.admission_type || "Regular",
        semester: formData.semester || "1",
        department: formData.department || "1",
        branch: formData.branch || "1",
        batch: formData.batch || "1",
        admission_no: formData.admission_no || null,
        first_name: formData.first_name || "",
        middle_name: formData.middle_name || "",
        last_name: formData.last_name || "",
        course: formData.course || "1",
        section: formData.addmitted_section || "1",
        gender: formData.gender || "1",
        date_of_admission: formData.date_of_admission || "",
        date_of_join: formData.doj || "",
        barcode: formData.barcode || "",
        registration_no: formData.registration_no || "",
        // college_admission_no: null,
        school_admission_no: null,
        house: formData.house || "",
        religion: formData.religion || "",
        category: formData.category || "",
        mother_tongue: formData.language || "",
        blood: formData.blood_group_id || "",
        nationality: formData.nationality || "",
        email: formData.email || "",
        date_of_birth: formData.dob || "",
        children_in_family: formData.childreninfamily || "",
        student_aadhaar_no: formData.studentaadharno || "",
        user_name: formData.username || "",
        remarks: formData.remarks || "",
        profile_pic: null,
        father_name: formData.father_name || "",
        father_profession: formData.father_profession || "",
        father_contact_number: formData.father_contact_number || "",
        father_email: formData.father_email || "",
        father_aadhaar_no: formData.father_aadharno || "",
        mother_name: formData.mother_name || "",
        mother_profession: formData.mother_profession || "",
        mother_contact_number: formData.mother_contact_number || "",
        mother_email: formData.mother_email || "",
        mother_aadhaar_no: formData.mother_aadharno || "",
        created_by: userId || "1",
      };

      const address_detail = {
        usertype: "student",
        present_address: formData.present_address || "",
        present_pincode: formData.present_pincode || "",
        present_city: formData.present_city || "",
        present_state: formData.present_state || "",
        present_country: formData.present_country || "",
        present_phone_number: formData.present_phone_number || "",
        permanent_address: formData.permanent_address || "",
        permanent_pincode: formData.permanent_pincode || "",
        permanent_city: formData.permanent_city || "",
        permanent_state: formData.permanent_state || "",
        permanent_country: formData.permanent_country || "",
        permanent_phone_number: formData.permanent_phone_number || "",
      };

      // ✅ Convert Mobile_Number → mobile_number
      const emergency_contact = (formData.emegencyContact || []).map((c) => ({
        name: c.name || "",
        relationship: c.relationship || "",
        mobile_number: c.Mobile_Number || c.mobile_number || "",
        remark: c.remark || "",
      }));

      const authorized_pickup = (formData.authorizedpickup || []).map((a) => ({
        name: a.name || "",
        relationship: a.relationship || "",
        mobile_number: a.Mobile_Number || a.mobile_number || "",
        remark: a.remark || "",
      }));

      const sibling_detail = Array.isArray(formData.sibilingsDetails)
        ? formData.sibilingsDetails
          .filter((s) => s && (s.sibling_id || s.sibling)) // remove empty items
          .map((s) => ({
            sibling: s.sibling_id || s.sibling,
            created_by: userId || "1",
          }))
        : [];

      // ✅ Proper document and education mapping
      const document_detail = JSON.stringify(
        formData.documentsDetails?.length
          ? formData.documentsDetails.map((d) => ({
            document_no: d.document_no || "",
            document_type: d.document_type || "",
            start_from: d.start_from || null,
            end_to: d.end_to || null,
          }))
          : []
      );

      const previous_education_detail = JSON.stringify(
        formData.previousEducationDetails?.length
          ? formData.previousEducationDetails.map((e) => ({
            name_of_institution: e.nameofschool || "",
            location: e.location || "",
            course_completed: e.class_completed || "",
            year_from: e.year_from || "",
            year_to: e.year_to || "",
            language_of_instruction: e.language_of_instruction || "",
            transfer_certificate: e.transfer_certificate || "",
            result: e.result || "",
          }))
          : []
      );

      // ✅ Build final payload
      const formPayload = new FormData();
      formPayload.append(
        "student_basic_detail",
        JSON.stringify(student_basic_detail)
      );
      formPayload.append("address_detail", JSON.stringify(address_detail));
      // formPayload.append("sibling_detail", JSON.stringify([]));
      formPayload.append("sibling_detail", JSON.stringify(sibling_detail));
      formPayload.append(
        "emergency_contact",
        JSON.stringify(emergency_contact)
      );
      formPayload.append(
        "authorized_pickup",
        JSON.stringify(authorized_pickup)
      );
      formPayload.append("document_detail", document_detail);
      formPayload.append(
        "previous_education_detail",
        previous_education_detail
      );

      // ✅ Handle profile image (from in-memory ref, not sessionStorage)
      const base64Data = profilePicRef.current;
      const fileName = sessionStorage.getItem("profile_pic_name");
      const fileType = sessionStorage.getItem("profile_pic_type");

      if (base64Data && fileName && fileType) {
        const res = await fetch(base64Data);
        const blob = await res.blob();
        const file = new File([blob], fileName, { type: fileType });
        formPayload.append("profile_pic", file);
      }

      // ✅ Handle document images (supports 3 cases)
      for (
        let index = 0;
        index < (formData.documentsDetails || []).length;
        index++
      ) {
        const doc = formData.documentsDetails[index];
        try {
          // 1️⃣ New file selected
          if (doc.document_pic && typeof doc.document_pic !== "string") {
            formPayload.append(`document_pic[${index}]`, doc.document_pic);
          }
          // 2️⃣ From sessionStorage (base64)
          else {
            const base64Data = sessionStorage.getItem(
              `document_pic_base64_${index}`
            );
            const fileName = sessionStorage.getItem(
              `document_pic_name_${index}`
            );
            const fileType = sessionStorage.getItem(
              `document_pic_type_${index}`
            );

            if (base64Data && fileName && fileType) {
              const res = await fetch(base64Data);
              const blob = await res.blob();
              formPayload.append(
                `document_pic[${index}]`,
                new File([blob], fileName, { type: fileType })
              );
              continue;
            }

            // 3️⃣ From API URL (fallback)
            const fileUrl = doc.preview_url || doc.document_pic || "";
            if (fileUrl) {
              const finalUrl = fileUrl.startsWith("http")
                ? fileUrl
                : `${ApiUrl.apiurl}${fileUrl}`;
              const res = await fetch(finalUrl);
              const blob = await res.blob();
              const ext = blob.type.split("/")[1] || "pdf";
              formPayload.append(
                `document_pic[${index}]`,
                new File([blob], `document_${index}.${ext}`, {
                  type: blob.type,
                })
              );
            }
          }
        } catch (error) {
          console.warn(`⚠️ Error attaching document_pic[${index}]:`, error);
        }
      }

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formPayload,
      });

      const updateResponseText = await response.text();
      let result;
      try {
        result = JSON.parse(updateResponseText);
      } catch (_) {
        console.error("Non-JSON update response:", updateResponseText.slice(0, 300));
        alert(
          `❌ Server returned an unexpected response (HTTP ${response.status}).\n` +
          "Please check the server logs or contact support."
        );
        return;
      }
      console.log("✅ Update Response:", result);

      if (
        result.message === "Student Updated Successfully!!" ||
        result.message === "success"
      ) {
        alert("✅ Student record updated successfully!");
        // ✅ Clear form and memory ref
        setFormData({});
        profilePicRef.current = null; // clear in-memory ref
        sessionStorage.removeItem("profile_pic_name");
        sessionStorage.removeItem("profile_pic_type");

        // ✅ Redirect to registration page
        navigate("/admin/registration");
      } else {
        const updateErrMsg = result.message || result.error || JSON.stringify(result);
        alert("❌ Failed to update student record: " + updateErrMsg);
      }
    } catch (error) {
      console.error("❌ Update error:", error);
      alert("Something went wrong while updating student data.");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <h4
          style={{ textAlign: "center", marginTop: "5px", fontWeight: "700" }}
        >
          STUDENT REGISTRATION{" "}
        </h4>

        <div className="row mt-3 mb-3">
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
              style={{ width: "150px" }}
              onClick={() => window.location.reload()} // ✅ reload page
            >
              New
            </button>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "150px" }}
              onClick={() => window.location.reload()} // ✅ reload page
            >
              Admission Form
            </button>
          </div>
        </div>

        {/* // new code 08182025 */}
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Student" {...a11yProps(0)} />
          {!isEditMode && <Tab label="Fee" {...a11yProps(1)} />}
          <Tab label="Address" {...a11yProps(isEditMode ? 1 : 2)} />
          <Tab label="Guardian" {...a11yProps(isEditMode ? 2 : 3)} />
          <Tab label="Sibling" {...a11yProps(isEditMode ? 3 : 4)} />
          <Tab label="Emergency Contact" {...a11yProps(isEditMode ? 4 : 5)} />
          <Tab label="Authorised PickUp" {...a11yProps(isEditMode ? 5 : 6)} />
          <Tab label="Documents Submitted" {...a11yProps(isEditMode ? 6 : 7)} />
          <Tab label="Previous Education " {...a11yProps(isEditMode ? 7 : 8)} />
        </Tabs>
      </Box>

      {/* // new code 08182025 */}
      <CustomTabPanel value={value} index={0}>
        <StudentDetails
          formData={formData}
          setFormData={setFormData}
          frontCover={frontCover}
          setFrontCover={setFrontCover}
          fileInputRef={fileInputRef}
          profilePicRef={profilePicRef}
        />
      </CustomTabPanel>

      {!isEditMode && (
        <CustomTabPanel value={value} index={1}>
          {/* <AdmDesignComponent formData={formData} setFormData={setFormData} /> */}
          <AdmDesignComponent
            formData={formData}
            setFormData={setFormData}
            batch_id={formData.batch}
            course_id={formData.course}
            department_id={formData.department}
          />
        </CustomTabPanel>
      )}

      <CustomTabPanel value={value} index={isEditMode ? 1 : 2}>
        <AdmPersonalDetails formData={formData} setFormData={setFormData} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={isEditMode ? 2 : 3}>
        <GuardianDetails formData={formData} setFormData={setFormData} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={isEditMode ? 3 : 4}>
        <AdmOtherDetails formData={formData} setFormData={setFormData} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={isEditMode ? 4 : 5}>
        <EmergencyContact formData={formData} setFormData={setFormData} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={isEditMode ? 5 : 6}>
        <AuthorisedPickUp formData={formData} setFormData={setFormData} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={isEditMode ? 6 : 7}>
        <DocumentsSubmitted formData={formData} setFormData={setFormData} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={isEditMode ? 7 : 8}>
        <PreviousEducationDetails
          formData={formData}
          setFormData={setFormData}
        />
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
          disabled={value === maxTabIndex}
          sx={{ ml: 1 }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
