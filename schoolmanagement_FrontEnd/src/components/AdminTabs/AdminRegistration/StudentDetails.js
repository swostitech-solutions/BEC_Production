import React, { useEffect, useState, useRef } from "react";
import {
  validateAlphanumeric,
  validateAadhar,
  validateEmail,
  validateOnlyLetters,
} from "../../utils/validation";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdmRegistration.css";
import { useNavigate } from "react-router-dom";
import useFetchReligions from "../../hooks/useFetchReligions";
import useFetchHouses from "../../hooks/useFetchHouses";
import useFetchCategories from "../../hooks/useFetchCategories ";
import useFetchNationalities from "../../hooks/useFetchNationalities";
import useFetchLanguages from "../../hooks/useFetchLanguages";
import useFetchBloodGroups from "../../hooks/useFetchBloodGroups";
import { useParams } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import Select from "react-select";

import useFetchOrganizationList from "../../hooks/useFetchOrganizationList";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";
import useFetchOrganizationBranch from "../../hooks/useFetchBranchByOrganization";
import useFetchGenderList from "../../hooks/fetchGenderList";

const AdmAttendanceEntry = ({
  formData,
  setFormData,
  frontCover,
  setFrontCover,
}) => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [studentBasicDetails, setStudentBasicDetails] = useState(null);
  const navigate = useNavigate();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedSection, setSelectedSection] = useState(
    localStorage.getItem("selectedSectionId") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedOrgBranch, setSelectedOrgBranch] = useState(null); // for Organization Branch
  const [selectedDepartment, setSelectedDepartment] = useState(null); // for Academic Department

  const { OrganizationList, error: orgError } = useFetchOrganizationList();
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const {
    BatchList,
    loading: batchLoading,
    error: batchError,
  } = useFetchSessionList(
    selectedOrganization?.value,
    selectedOrgBranch?.value
  );

  const [selectedSession, setSelectedSession] = useState(null);
  const {
    CourseList,
    loading: courseLoading,
    error: courseError,
  } = useFetchCourseByFilter(
    selectedOrganization?.value, // ✅ pass ID, not object
    selectedSession // batch_id
  );
  const [selectedCourse, setSelectedCourse] = useState(null);
  const {
    BranchList,
    loading: branchLoading,
    error: branchError,
  } = useFetchBranch(
    selectedOrganization?.value, // organization_id
    selectedOrgBranch?.value, // branch_id
    selectedSession, // batch_id
    selectedCourse // course_id
  );
  // ✅ Call hook using correct IDs
  const {
    AcademicYearList,
    loading: academicYearLoading,
    error: academicYearError,
  } = useFetchAcademicYearByFilter(
    selectedOrganization?.value, // organization_id
    selectedOrgBranch?.value, // branch_id
    selectedSession, // batch_id
    selectedCourse, // course_id
    selectedDepartment // department_id
  );

  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const {
    SemesterList,
    loading: semesterLoading,
    error: semesterError,
  } = useFetchSemesterByFilter(
    selectedOrganization?.value, // organization_id
    selectedOrgBranch?.value, // branch_id
    selectedSession, // batch_id
    selectedCourse, // course_id
    selectedDepartment, // department_id
    selectedAcademicYear // academic_year_id
  );

  const [selectedSemester, setSelectedSemester] = useState(null);
  const {
    SectionList,
    loading: sectionFilterLoading,
    error: sectionError,
  } = useFetchSectionByFilter(
    selectedOrganization?.value, // organization_id
    selectedOrgBranch?.value, // branch_id
    selectedSession, // batch_id
    selectedCourse, // course_id
    selectedDepartment, // department_id
    selectedAcademicYear, // academic_year_id
    selectedSemester // semester_id
  );

  const {
    genders,
    loading: genderLoading,
    error: genderError,
  } = useFetchGenderList();
  const [selectedSectionFiltered, setSelectedSectionFiltered] = useState(null);
  const {
    categories,
    loading: loadingCategories,
    error: errorCategories,
  } = useFetchCategories();
  const {
    branches: organizationBranches,
    loading: orgBranchLoading,
    error: orgBranchError,
  } = useFetchOrganizationBranch();
  const [filters, setFilters] = useState({});
  const [selectedBatch, setSelectedBatch] = useState("");
  const [errors, setErrors] = React.useState({
    barcode: "",
    registration_no: "",
    school_admission_no: "",
    username: "",
    cbse_reg_no: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    childreninfamily: "",
    studentaadharno: "",
    email: "",
    rollno: "",
    referred_by: "",
  });
  const {
    houses,
    loading: loadingHouses,
    error: errorHouses,
  } = useFetchHouses();
  const {
    nationalities,
    loading: loadingNationalities,
    error: errorNationalities,
  } = useFetchNationalities();

  const [selectedClass, setSelectedClass] = useState(
    localStorage.getItem("selectedClassId") || ""
  );
  const fileInputRef = useRef(null);

  // useEffect(() => {
  //   // When departments (BranchList) are loaded after selecting course
  //   if (Array.isArray(BranchList) && BranchList.length > 0) {
  //     const firstDept = BranchList[0];

  //     // Set dropdown value
  //     setSelectedDepartment(firstDept.id);

  //     // Update formData for backend
  //     setFormData((prev) => ({
  //       ...prev,
  //       department: firstDept.id,
  //     }));
  //   } else {
  //     // Clear if no departments found
  //     setSelectedDepartment("");
  //     setFormData((prev) => ({
  //       ...prev,
  //       department: "",
  //     }));
  //   }
  // }, [BranchList]);

  // Date 11.28.2025
  useEffect(() => {
    const storedOrgId = sessionStorage.getItem("organization_id");
    const storedBranchId = sessionStorage.getItem("branch_id");

    if (storedOrgId) {
      const orgObj = OrganizationList?.find(
        (o) => Number(o.id) === Number(storedOrgId)
      );

      if (orgObj) {
        setSelectedOrganization({
          value: orgObj.id,
          label: orgObj.organization_description,
        });

        setFormData((prev) => ({
          ...prev,
          organization: orgObj.id,
        }));
      }
    }

    if (storedBranchId) {
      const branchObj = organizationBranches?.find(
        (b) => Number(b.id) === Number(storedBranchId)
      );

      if (branchObj) {
        setSelectedOrgBranch({
          value: branchObj.id,
          label: branchObj.branch_name,
        });

        setFormData((prev) => ({
          ...prev,
          branch: branchObj.id,
        }));
      }
    }
  }, [OrganizationList, organizationBranches]);

  const {
    data: languages,
    loading,
    error,
    loadingLanguages,
    errorLanguages,
  } = useFetchLanguages();

  const {
    bloodGroups,
    loading: loadingBloodGroups,
    error: errorBloodGroups,
  } = useFetchBloodGroups();
  const {
    religions,
    loading: religionLoading,
    error: religionError,
  } = useFetchReligions();

  //11042025
  useEffect(() => {
    if (!id) return;

    const fetchStudent = async () => {
      const orgId = sessionStorage.getItem("organization_id") || 1;
      const branchId = sessionStorage.getItem("branch_id") || 1;
      const token = localStorage.getItem("accessToken");

      const apiUrl = `${ApiUrl.apiurl}StudentRegistrationApi/GetStudentDetailsBasedOnId/?organization_id=${orgId}&branch_id=${branchId}&student_id=${id}`;
      console.log("📡 Fetching Student Details:", apiUrl);

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.message === "success") {
          const s = data.data.student_basic_details;
          const address = data.data.address_details?.[0] || {};

          const updatedFormData = {
            ...s,
            first_name: s.first_name || "",
            middle_name: s.middle_name || "",
            last_name: s.last_name || "",
            date_of_birth: s.date_of_birth || "",
            date_of_admission: s.date_of_admission || "",
            dob: s.date_of_birth || "",
            doj: s.date_of_join || "",
            religion: s.religion_id || "",
            category: s.category_id || "",
            gender: s.gender_id || "",
            nationality: s.nationality_id || "",
            language: s.mother_tongue_id || "",
            course: s.course_id || "",
            department: s.department_id || "",
            academic_year: s.academic_year_id || "",
            semester: s.semester_id || "",
            addmitted_section: s.section_id || "",
            batch: s.batch_id || "",
            branch: s.branch_id || "",
            organization: s.organization_id || "",
            present_address: address.present_address || "",
            permanent_address: address.permanent_address || "",
            student_contact_no:
              s.present_phone_number || address.present_phone_number || "",
            house: s.house_id || "",
            childreninfamily: s.children_in_family || "",
            studentaadharno: s.student_aadhaar_no || "",
          };

          // ✅ Handle profile image to base64 preview
          if (s.profile_pic && typeof s.profile_pic === "string") {
            try {
              const imageResponse = await fetch(s.profile_pic);
              const blob = await imageResponse.blob();
              const base64Data = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              });

              sessionStorage.setItem("profile_pic_base64", base64Data);
              sessionStorage.setItem("profile_pic_name", "profile.jpg");
              sessionStorage.setItem("profile_pic_type", blob.type);
              setFrontCover(base64Data);
              updatedFormData.profile_pic_preview = base64Data;
            } catch (error) {
              console.warn("⚠️ Failed to load profile_pic:", error);
            }
          }

          setFormData((prev) => ({
            ...prev,
            ...updatedFormData,
          }));

          // ✅ Pre-fill dropdowns
          setSelectedOrganization({
            value: s.organization_id,
            label: s.organization_description,
          });
          setSelectedOrgBranch({ value: s.branch_id, label: s.branch_name });
          setSelectedSession(s.batch_id);
          setSelectedCourse(s.course_id);
          setSelectedDepartment(s.department_id);
          setSelectedAcademicYear(s.academic_year_id);
          setSelectedSemester(s.semester_id);
          setSelectedSection(s.section_id);
        }
      } catch (error) {
        console.error("❌ Fetch error:", error);
      }
    };

    fetchStudent();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // ✅ ALLOWED IMAGE TYPES
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG and PNG format is allowed");

      // ❌ Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;

      // Save to sessionStorage
      sessionStorage.setItem("profile_pic_base64", base64Data);
      sessionStorage.setItem("profile_pic_name", file.name);
      sessionStorage.setItem("profile_pic_type", file.type);

      // Set preview
      setFrontCover(base64Data);

      // Save preview to formData
      setFormData((prevData) => ({
        ...prevData,
        profile_pic_preview: base64Data,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // 🚫 Prevent Year > 4 digits for date inputs
    if (["dob", "doj", "date_of_admission"].includes(name)) {
      const yearPart = value.split("-")[0];
      if (yearPart.length > 4) {
        return;
      }
    }

    const fieldsToValidate = [
      "barcode",
      "registration_no",
      "school_admission_no",
      "username",
      "cbse_reg_no",
      "rollno",
    ];
    if (fieldsToValidate.includes(name)) {
      if (value === "" || validateAlphanumeric(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only alphanumeric is allowed",
        }));
      }
    }
    // Aadhar validation
    if (name === "studentaadharno") {
      if (value === "" || validateAadhar(value)) {
        if (value.length !== 12) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "Aadhar number must be exactly 12 digits",
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
          [name]: "Aadhar number must contain only numbers",
        }));
      }
    }
    // Email validation
    if (name === "email") {
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

    if (
      name === "first_name" ||
      name === "middle_name" ||
      name === "last_name" ||
      name === "referred_by"
    ) {
      if (value === "" || validateOnlyLetters(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only letters and spaces are allowed",
        }));
      }
    }

    // Category and Class handling for localStorage/sessionStorage
    if (name === "category") {
      localStorage.setItem("selectedCategoryId", value);
      sessionStorage.setItem("CategoryLogic", "true");
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Clear ClassLogic on page refresh/load
    sessionStorage.removeItem("CategoryLogic");
  }, []);

  // 🔄 Sync category change to localStorage + FeeDetails
  useEffect(() => {
    if (formData.category) {
      setFormData((prev) => ({
        ...prev,
        category: formData.category,
      }));
      localStorage.setItem("selectedCategoryId", formData.category);
    } else {
      localStorage.removeItem("selectedCategoryId");
    }
  }, [formData.category]);

  useEffect(() => {
    const orgId = formData.organization;
    const branchId = formData.branch;
    const batchId = formData.batch;
    const courseId = formData.course;
    const deptId = formData.department;
    const academicYearId = formData.academic_year;

    // ✅ Only process when required IDs are present
    if (orgId && branchId && batchId && courseId && deptId && academicYearId) {
      localStorage.setItem("FeeGroupEnabled", "true");
      localStorage.setItem("selectedOrganizationId", orgId);
      localStorage.setItem("selectedBranchId", branchId);
      localStorage.setItem("selectedBatchId", batchId);
      localStorage.setItem("selectedCourseId", courseId);
      localStorage.setItem("selectedDepartmentId", deptId);
      localStorage.setItem("selectedAcademicYearId", academicYearId);

      // 🔥 Don't overwrite category here — it's handled in category dropdown
      window.dispatchEvent(new Event("feeGroupDependenciesChanged"));
    } else if (
      // ✅ Clear only when key dependencies are removed (not when just category changes)
      !orgId ||
      !branchId ||
      !batchId ||
      !courseId ||
      !deptId ||
      !academicYearId
    ) {
      localStorage.removeItem("FeeGroupEnabled");
      localStorage.removeItem("selectedOrganizationId");
      localStorage.removeItem("selectedBranchId");
      localStorage.removeItem("selectedBatchId");
      localStorage.removeItem("selectedCourseId");
      localStorage.removeItem("selectedDepartmentId");
      localStorage.removeItem("selectedAcademicYearId");

      // ⚠️ Don't remove selectedCategoryId here — keep it intact
      window.dispatchEvent(new Event("feeGroupDependenciesChanged"));
    }
  }, [
    formData.organization,
    formData.branch,
    formData.batch,
    formData.course,
    formData.department,
    formData.academic_year,
  ]);

  const triggerFeeGroupReload = () => {
    window.dispatchEvent(new Event("feeGroupDependenciesChanged"));
  };

  useEffect(() => {
    const handleClearForm = () => {
      console.log("🧹 Clearing StudentDetails dropdowns…");

      const orgId = sessionStorage.getItem("organization_id");
      const branchId = sessionStorage.getItem("branch_id");

      // -------------------------------
      // ✅ RESET ORGANIZATION
      // -------------------------------
      if (orgId && OrganizationList?.length > 0) {
        const orgObj = OrganizationList.find(
          (o) => Number(o.id) === Number(orgId)
        );

        setSelectedOrganization(
          orgObj
            ? { value: orgObj.id, label: orgObj.organization_description }
            : null
        );

        setFormData((prev) => ({
          ...prev,
          organization: orgObj?.id || "",
        }));
      }

      // -------------------------------
      // ✅ RESET BRANCH
      // -------------------------------
      if (branchId && organizationBranches?.length > 0) {
        const branchObj = organizationBranches.find(
          (b) => Number(b.id) === Number(branchId)
        );

        setSelectedOrgBranch(
          branchObj
            ? { value: branchObj.id, label: branchObj.branch_name }
            : null
        );

        setFormData((prev) => ({
          ...prev,
          branch: branchObj?.id || "",
        }));
      }

      // -------------------------------
      // ❗ RESET CHILD DROPDOWNS
      // -------------------------------
      setSelectedSession("");
      setSelectedCourse("");
      setSelectedDepartment("");
      setSelectedAcademicYear("");
      setSelectedSemester("");
      setSelectedSection("");

      setFormData((prev) => ({
        ...prev,
        batch: "",
        course: "",
        department: "",
        academic_year: "",
        semester: "",
        addmitted_section: "",
      }));

      // -------------------------------
      // ❗ CLEAR LOCAL STORAGE KEYS
      // -------------------------------
      localStorage.removeItem("selectedBatchId");
      localStorage.removeItem("selectedCourseId");
      localStorage.removeItem("selectedDepartmentId");
      localStorage.removeItem("selectedAcademicYearId");
      localStorage.removeItem("selectedSemesterId");
      localStorage.removeItem("selectedSectionId");

      // ------------------------------------------------------
      // 🚀 **FIX: CLEAR PROFILE PICTURE FIELD + PREVIEW**
      // ------------------------------------------------------
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // <--- clears "Choose file" text
      }

      setFrontCover(null); // <--- clears preview image

      // Also clear sessionStorage image data
      sessionStorage.removeItem("profile_pic_base64");
      sessionStorage.removeItem("profile_pic_name");
      sessionStorage.removeItem("profile_pic_type");

      console.log(
        "✅ StudentDetails reset complete (including profile picture)"
      );
    };

    window.addEventListener("clearAllStudentFields", handleClearForm);

    return () => {
      window.removeEventListener("clearAllStudentFields", handleClearForm);
    };
  }, [OrganizationList, organizationBranches]);

  return (
    <div className="container-fluid ">
      <div className="row">
        <div className="col-12">
          <div className="card-body">
            <div className=" row mt-3 mx-2">
              <div
                className="col-12 custom-section-box"
                style={{ height: "1000px" }}
              >
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                  <div className="row flex-grow-1 mt-2 ">
                    <div className="col-12 col-md-4 mb-2 ">
                      <label htmlFor="admission-no" className="form-label">
                        Admission No<span style={{ color: "red" }}>*</span>{" "}
                      </label>
                      <input
                        type="text"
                        id="admission-no"
                        className="form-control detail"
                        placeholder="Enter admission no"
                        name="last_name"
                        value={formData.admission_no}
                        onChange={handleInputChange}
                        disabled
                      />{" "}
                    </div>

                    <div className="col-12 col-md-5  ">
                      <label htmlFor="student-name" className="form-label">
                        {" "}
                        Student Name <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="d-flex align-items-center">
                        <input
                          type="text"
                          id="student-name"
                          className="form-control detail"
                          placeholder="Enter First name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.first_name && (
                          <small style={{ color: "red" }}>
                            {errors.first_name}
                          </small>
                        )}
                        <input
                          type="text"
                          id="student-name"
                          className="form-control detail mx-2"
                          placeholder="Enter middle name"
                          name="middle_name"
                          value={formData.middle_name}
                          onChange={handleInputChange}
                        />{" "}
                        {errors.middle_name && (
                          <small style={{ color: "red" }}>
                            {errors.middle_name}
                          </small>
                        )}
                        <input
                          type="text"
                          id="student-name"
                          className="form-control detail mx-2"
                          placeholder="Enter last name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                        />
                        {errors.last_name && (
                          <small style={{ color: "red" }}>
                            {errors.last_name}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-12 col-sm-6 col-md-3 mb-2">
                      <label htmlFor="gender" className="form-label">
                        Gender
                      </label>
                      <Select
                        id="gender"
                        name="gender"
                        className="detail"
                        classNamePrefix="gender-dropdown"
                        placeholder={
                          genderLoading
                            ? "Loading genders..."
                            : genderError
                              ? "Error loading genders"
                              : "Select Gender"
                        }
                        isLoading={genderLoading}
                        isDisabled={genderLoading || !!genderError}
                        options={
                          Array.isArray(genders)
                            ? genders.map((g) => ({
                              value: g.id,
                              label: g.gender_name, // ✅ uses API field
                            }))
                            : []
                        }
                        value={
                          formData?.gender
                            ? genders
                              .map((g) => ({
                                value: g.id,
                                label: g.gender_name,
                              }))
                              .find(
                                (opt) =>
                                  Number(opt.value) ===
                                  Number(formData.gender)
                              ) || null
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleInputChange({
                            target: {
                              name: "gender",
                              value: selectedOption?.value || "",
                            },
                          })
                        }
                      />
                    </div>

                    {/* Organization */}
                    {/* <div className="col-12 col-md-4 mb-4">
                      <label className="form-label">Organization<span style={{ color: "red" }}>*</span></label>
                      <Select
                        className=" detail"
                        isDisabled={true}
                        value={selectedOrganization}
                        onChange={(opt) => {
                          setSelectedOrganization(opt);
                          setFormData((prev) => ({ ...prev, organization: opt?.value || "" }));
                        }}
                        options={OrganizationList?.map((o) => ({
                          value: o.id,
                          label: o.organization_description,
                        })) || []}
                        placeholder="Select Organization"
                      />
                    </div> */}

                    {/* Branch */}
                    {/* <div className="col-12 col-md-4 mb-4">
                      <label className="form-label">Branch<span style={{ color: "red" }}>*</span></label>
                      <Select
                        className=" detail"
                        isDisabled={true}
                        value={selectedOrgBranch}
                        onChange={(opt) => {
                          setSelectedOrgBranch(opt);
                          setFormData((prev) => ({ ...prev, branch: opt?.value || "" }));
                        }}
                        options={organizationBranches?.map((b) => ({
                          value: b.id,
                          label: b.branch_name,
                        })) || []}
                        placeholder="Select Branch"
                      />
                    </div> */}

                    {/* Batch / Session */}
                    <div className="col-12 col-md-4 mb-4">
                      <label className="form-label">
                        Session<span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        className=" detail"
                        isDisabled={false}
                        value={
                          BatchList?.find((b) => b.id === selectedSession)
                            ? {
                              value: selectedSession,
                              label: BatchList.find(
                                (b) => b.id === selectedSession
                              )?.batch_description,
                            }
                            : null
                        }
                        onChange={(opt) => {
                          setSelectedSession(opt?.value || "");
                          setFormData((prev) => ({
                            ...prev,
                            batch: opt?.value || "",
                            feegroup: "",
                            feeappfrom: "",
                          }));
                        }}
                        options={
                          BatchList?.map((b) => ({
                            value: b.id,
                            label: b.batch_description,
                          })) || []
                        }
                        placeholder="Select Session"
                      />
                    </div>

                    {/* Course */}
                    <div className="col-12 col-md-4 mb-4">
                      <label className="form-label">
                        Course<span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        className=" detail"
                        isDisabled={false}
                        value={
                          CourseList?.find((c) => c.id === selectedCourse)
                            ? {
                              value: selectedCourse,
                              label: CourseList.find(
                                (c) => c.id === selectedCourse
                              )?.course_name,
                            }
                            : null
                        }
                        onChange={(opt) => {
                          setSelectedCourse(opt?.value || "");
                          setFormData((prev) => ({
                            ...prev,
                            course: opt?.value || "",
                            feegroup: "",
                            feeappfrom: "",
                          }));
                        }}
                        options={
                          CourseList?.map((c) => ({
                            value: c.id,
                            label: c.course_name,
                          })) || []
                        }
                        placeholder="Select Course"
                      />
                    </div>

                    {/* Department */}
                    <div className="col-12 col-md-4 mb-4">
                      <label className="form-label">
                        Department<span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        className=" detail"
                        isDisabled={false}
                        value={
                          BranchList?.find((d) => d.id === selectedDepartment)
                            ? {
                              value: selectedDepartment,
                              label: BranchList.find(
                                (d) => d.id === selectedDepartment
                              )?.department_description,
                            }
                            : null
                        }
                        onChange={(opt) => {
                          setSelectedDepartment(opt?.value || "");
                          setFormData((prev) => ({
                            ...prev,
                            department: opt?.value || "",
                            feegroup: "",
                            feeappfrom: "",
                          }));
                        }}
                        options={
                          BranchList?.map((d) => ({
                            value: d.id,
                            label: d.department_description,
                          })) || []
                        }
                        placeholder="Select Department"
                      />
                    </div>

                    {/* Academic Year */}
                    <div className="col-12 col-md-4 mb-4">
                      <label className="form-label">
                        Academic Year<span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        className=" detail"
                        isDisabled={false}
                        value={
                          AcademicYearList?.find(
                            (y) => y.id === Number(selectedAcademicYear)
                          )
                            ? {
                              value: selectedAcademicYear,
                              label: AcademicYearList.find(
                                (y) => y.id === Number(selectedAcademicYear)
                              )?.academic_year_description,
                            }
                            : null
                        }
                        onChange={(opt) => {
                          setSelectedAcademicYear(opt?.value || "");
                          setFormData((prev) => ({
                            ...prev,
                            academic_year: opt?.value || "",
                            feegroup: "",
                            feeappfrom: "",
                          }));
                        }}
                        options={
                          AcademicYearList?.map((y) => ({
                            value: y.id,
                            label: y.academic_year_description,
                          })) || []
                        }
                        placeholder="Select Academic Year"
                      />
                    </div>

                    {/* Semester */}
                    <div className="col-12 col-md-4 mb-4">
                      <label className="form-label">
                        Semester<span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        className=" detail"
                        isDisabled={false}
                        value={
                          SemesterList?.find((s) => s.id === selectedSemester)
                            ? {
                              value: selectedSemester,
                              label: SemesterList.find(
                                (s) => s.id === selectedSemester
                              )?.semester_description,
                            }
                            : null
                        }
                        onChange={(opt) => {
                          setSelectedSemester(opt?.value || "");
                          setFormData((prev) => ({
                            ...prev,
                            semester: opt?.value || "",
                            feegroup: "",
                            feeappfrom: "",
                          }));
                        }}
                        options={
                          SemesterList?.map((s) => ({
                            value: s.id,
                            label: s.semester_description,
                          })) || []
                        }
                        placeholder="Select Semester"
                      />
                    </div>

                    {/* Section */}
                    <div className="col-12 col-md-4 mb-4">
                      <label className="form-label">
                        Section<span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        className=" detail"
                        isDisabled={false}
                        value={
                          SectionList?.find((s) => s.id === selectedSection)
                            ? {
                              value: selectedSection,
                              label: SectionList.find(
                                (s) => s.id === selectedSection
                              )?.section_name,
                            }
                            : null
                        }
                        onChange={(opt) => {
                          setSelectedSection(opt?.value || "");
                          setFormData((prev) => ({
                            ...prev,
                            addmitted_section: opt?.value || "",
                            feegroup: "",
                            feeappfrom: "",
                          }));
                        }}
                        options={
                          SectionList?.map((s) => ({
                            value: s.id,
                            label: s.section_name,
                          })) || []
                        }
                        placeholder="Select Section"
                      />
                    </div>

                    <div className="col-12 col-md-4 mb-4">
                      <label htmlFor="date_of_admission" className="form-label">
                        Date Of Admission{" "}
                      </label>
                      <input
                        type="date"
                        id="date_of_admission"
                        className="form-control detail"
                        name="date_of_admission"
                        value={formData.date_of_admission || ""}
                        onChange={handleInputChange}
                        disabled={isDisabled}
                      />
                    </div>

                    <div className="col-12 col-sm-6 col-md-4 mb-2">
                      <label htmlFor="admission-type" className="form-label">
                        Admission Type<span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        id="admission-type"
                        name="admission_type"
                        className="detail"
                        classNamePrefix="react-select"
                        placeholder="Select Admission Type"
                        options={[
                          { value: "Regular", label: "Regular" },
                          { value: "Irregular", label: "Irregular" },
                        ]}
                        value={
                          formData.admission_type
                            ? {
                              value: formData.admission_type,
                              label: formData.admission_type,
                            }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleInputChange({
                            target: {
                              name: "admission_type",
                              value: selectedOption?.value || "",
                            },
                          })
                        }
                      />
                    </div>

                    <div className="col-12 col-md-4 mb-2">
                      <label htmlFor="doj" className="form-label">
                        Date Of Join
                      </label>
                      <input
                        type="date"
                        id="doj"
                        className="form-control detail"
                        name="doj"
                        value={formData.doj || ""}
                        onChange={handleInputChange}
                        disabled={isDisabled}
                      />
                    </div>

                    {/* <div className="col-12 col-md-4 mb-2">
                      <label htmlFor="rollno" className="form-label">
                        Roll No
                      </label>
                      <input
                        type="text"
                        id="rollno"
                        className="form-control detail"
                        placeholder="Enter Roll No"
                        name="college_admission_no"
                        value={formData.enrollment_no || ""}
                        onChange={handleInputChange}
                        disabled
                      />
                      {errors.enrollment_no && (
                        <small style={{ color: "red" }}>{errors.enrollment_no}</small>
                      )}
                    </div> */}

                    <div className="col-12 col-md-4 mb-4">
                      <label htmlFor="barcode" className="form-label">
                        Barcode
                      </label>
                      <input
                        type="text"
                        id="barcode"
                        className="form-control detail"
                        placeholder="Enter barcode"
                        name="barcode"
                        value={formData.barcode}
                        onChange={handleInputChange}
                      // disabled
                      />
                      {errors.barcode && (
                        <small style={{ color: "red" }}>{errors.barcode}</small>
                      )}
                    </div>

                    <div className="col-12 col-md-4 mb-2">
                      <label htmlFor="registration-no" className="form-label">
                        ONMRC Registration No
                      </label>
                      <input
                        type="text"
                        id="registration-no"
                        className="form-control detail"
                        placeholder="Enter ONMRC registration no"
                        name="registration_no"
                        value={formData.registration_no}
                        onChange={handleInputChange}
                      // disabled
                      />
                      {errors.registration_no && (
                        <small style={{ color: "red" }}>
                          {errors.registration_no}
                        </small>
                      )}
                    </div>

                    <div className="col-12 col-md-4 mb-2">
                      <label htmlFor="referred-by" className="form-label">
                        Referred By
                      </label>
                      <input
                        type="text"
                        id="referred-by"
                        className="form-control detail"
                        placeholder="Enter Referred By"
                        name="referred_by"
                        value={formData.referred_by || ""}
                        onChange={handleInputChange}
                      />
                      {errors.referred_by && (
                        <small style={{ color: "red" }}>
                          {errors.referred_by}
                        </small>
                      )}
                    </div>

                    {/* <div className="col-12 col-md-4 mb-2">
                      <label htmlFor="house" className="form-label">
                        House
                      </label>

                      <Select
                        id="house"
                        name="house"
                        className="detail"
                        classNamePrefix="house-dropdown"
                        placeholder={
                          loadingHouses
                            ? "Loading houses..."
                            : errorHouses
                              ? "Error loading houses"
                              : "Select House"
                        }
                        isLoading={loadingHouses}
                        options={
                          Array.isArray(houses)
                            ? houses.map((house) => ({
                              value: house.id, // store id as value
                              label: house.house_name, // show name in dropdown
                            }))
                            : []
                        }
                        value={
                          formData.house
                            ? {
                              value: Number(formData.house),
                              label:
                                formData.house_label ||
                                houses.find(
                                  (h) =>
                                    Number(h.id) === Number(formData.house)
                                )?.house_name ||
                                "Select House",
                            }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleInputChange({
                            target: {
                              name: "house",
                              value: selectedOption?.value || "",
                            },
                          })
                        }
                      />
                    </div> */}

                    <div className="col-12 col-md-4 mb-2">
                      <label htmlFor="religion" className="form-label">
                        Religion
                      </label>
                      <Select
                        id="religion"
                        name="religion"
                        className="detail"
                        classNamePrefix="religion-dropdown"
                        placeholder={
                          loading
                            ? "Loading religions..."
                            : error
                              ? "Error loading religions"
                              : "Select Religion"
                        }
                        isLoading={loading}
                        options={
                          Array.isArray(religions)
                            ? religions.map((religion) => ({
                              value: religion.id, // store id
                              label: religion.religion_name, // show readable name
                            }))
                            : []
                        }
                        value={
                          formData.religion
                            ? {
                              value: Number(formData.religion),
                              label:
                                formData.religion_label ||
                                religions.find(
                                  (r) =>
                                    Number(r.id) === Number(formData.religion)
                                )?.religion_name ||
                                "Select Religion",
                            }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleInputChange({
                            target: {
                              name: "religion",
                              value: selectedOption?.value || "",
                            },
                          })
                        }
                      />
                    </div>

                    <div className="col-12 col-md-4 mb-4">
                      <label htmlFor="category" className="form-label">
                        Category
                      </label>

                      <Select
                        id="category"
                        name="category"
                        className="detail"
                        classNamePrefix="category-dropdown"
                        placeholder={
                          loadingCategories
                            ? "Loading categories..."
                            : errorCategories
                              ? "Error loading categories"
                              : "Select Category"
                        }
                        isLoading={loadingCategories}
                        options={
                          Array.isArray(categories)
                            ? categories.map((cat) => ({
                              value: cat.id,
                              label: cat.category_name,
                            }))
                            : []
                        }
                        value={
                          formData?.category
                            ? {
                              value: formData.category,
                              label:
                                categories.find(
                                  (c) =>
                                    Number(c.id) === Number(formData.category)
                                )?.category_name || "Select Category",
                            }
                            : null
                        }
                        onChange={(selectedOption) => {
                          const value = selectedOption
                            ? selectedOption.value
                            : "";

                          // ✅ Update state normally
                          setFormData((prev) => ({
                            ...prev,
                            category: value,
                            feegroup: "",
                            feeappfrom: "",
                          }));
                          setSelectedCategory(value);
                          setFilters((prev) => ({
                            ...prev,
                            categoryId: value,
                          }));

                          // ✅ Keep previously stored IDs intact
                          const orgId = localStorage.getItem(
                            "selectedOrganizationId"
                          );
                          const yearId = localStorage.getItem(
                            "selectedAcademicYearId"
                          );
                          const courseId =
                            localStorage.getItem("selectedCourseId");

                          if (orgId)
                            localStorage.setItem(
                              "selectedOrganizationId",
                              orgId
                            );
                          if (yearId)
                            localStorage.setItem(
                              "selectedAcademicYearId",
                              yearId
                            );
                          if (courseId)
                            localStorage.setItem("selectedCourseId", courseId);
                          localStorage.setItem(
                            "selectedCategoryId",
                            value || ""
                          );

                          console.log(
                            "💾 LocalStorage after selecting category:",
                            {
                              orgId,
                              yearId,
                              courseId,
                              categoryId: value,
                            }
                          );

                          // ✅ Trigger FeeGroup reload
                          window.dispatchEvent(
                            new Event("feeGroupDependenciesChanged")
                          );
                        }}
                      />
                    </div>

                    <div className="col-12 col-md-4 mb-4">
                      <label htmlFor="language" className="form-label">
                        Mother Tongue
                      </label>
                      <Select
                        id="language"
                        name="language"
                        className="detail"
                        classNamePrefix="language-dropdown"
                        placeholder={
                          loadingLanguages
                            ? "Loading languages..."
                            : errorLanguages
                              ? "Error loading languages"
                              : "Select Mother Tongue"
                        }
                        isLoading={loadingLanguages}
                        options={
                          Array.isArray(languages)
                            ? languages.map((lang) => ({
                              value: lang.id, // send ID to backend
                              label: lang.mother_tongue_name, // ✅ Correct field name from API
                            }))
                            : []
                        }
                        value={
                          formData.language
                            ? {
                              value: formData.language,
                              label:
                                languages.find(
                                  (l) => Number(l.id) === Number(formData.language)
                                )?.mother_tongue_name || "Select Language", // ✅ Correct field name
                            }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleInputChange({
                            target: {
                              name: "language",
                              value: selectedOption?.value || "",
                            },
                          })
                        }
                      />
                    </div>

                    <div className="col-12 col-md-4 mb-4">
                      <label htmlFor="blood_group" className="form-label">
                        Blood Group
                      </label>
                      <Select
                        id="blood_group"
                        name="blood_group_id"
                        className="detail"
                        classNamePrefix="bloodgroup-dropdown"
                        placeholder={
                          loadingBloodGroups
                            ? "Loading blood groups..."
                            : errorBloodGroups
                              ? "Error loading blood groups"
                              : "Select Blood Group"
                        }
                        isLoading={loadingBloodGroups}
                        options={
                          Array.isArray(bloodGroups)
                            ? bloodGroups.map((bg) => ({
                              value: bg.id, // ✅ backend ID
                              label: bg.blood_name, // ✅ readable name
                            }))
                            : []
                        }
                        value={
                          formData.blood_group_id
                            ? {
                              value: formData.blood_group_id,
                              label:
                                formData.blood_group_name ||
                                bloodGroups.find(
                                  (b) =>
                                    b.id === Number(formData.blood_group_id)
                                )?.blood_name ||
                                "",
                            }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleInputChange({
                            target: {
                              name: "blood_group_id",
                              value: selectedOption?.value || "",
                            },
                          })
                        }
                      />
                    </div>

                    <div className="col-12 col-md-4 mb-4">
                      <label htmlFor="nationality" className="form-label">
                        Nationality
                      </label>
                      <Select
                        id="nationality"
                        name="nationality"
                        className="detail"
                        classNamePrefix="nationality-dropdown"
                        placeholder={
                          loadingNationalities
                            ? "Loading nationalities..."
                            : errorNationalities
                              ? "Error loading nationalities"
                              : "Select Nationality"
                        }
                        isLoading={loadingNationalities}
                        options={
                          Array.isArray(nationalities)
                            ? nationalities.map((nat) => ({
                              value: String(nat.id), // ✅ ensure string
                              label: nat.nationality_name,
                            }))
                            : []
                        }
                        value={
                          formData.nationality
                            ? {
                              value: String(formData.nationality),
                              label:
                                nationalities.find(
                                  (n) =>
                                    String(n.id) ===
                                    String(formData.nationality)
                                )?.nationality_name || "Select Nationality",
                            }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleInputChange({
                            target: {
                              name: "nationality",
                              value: selectedOption?.value || "",
                            },
                          })
                        }
                      />
                    </div>

                    <div className="col-12 col-md-4 mb-4">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <Select
                        className="detail"
                        id="status"
                        name="student_status"
                        value={{
                          value: formData.student_status || "ACTIVE",
                          label: formData.student_status || "ACTIVE",
                        }}
                        onChange={(selectedOption) =>
                          handleInputChange({
                            target: {
                              name: "student_status",
                              value: selectedOption?.value || "",
                            },
                          })
                        }
                        options={[
                          { value: "ACTIVE", label: "ACTIVE" },
                          { value: "INACTIVE", label: "INACTIVE" },
                        ]}
                        isDisabled={!isEditMode}
                        styles={{
                          container: (provided) => ({
                            ...provided,
                            width: "100%",
                          }),
                          control: (provided) => ({
                            ...provided,
                            minHeight: "36px",
                            fontSize: "14px",
                          }),
                        }}
                      />
                    </div>

                    <div className="col-12 col-md-4 mb-2">
                      <label htmlFor="email" className="form-label">
                        {" "}
                        Email
                      </label>
                      <input
                        type="text"
                        className="form-control detail"
                        placeholder="Enter live@edu email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      {errors.email && (
                        <small style={{ color: "red" }}>{errors.email}</small>
                      )}
                    </div>

                    <div className="col-12 col-md-4 mb-4">
                      <label htmlFor="date-of-birth" className="form-label">
                        Date Of Birth
                      </label>
                      <input
                        type="date"
                        id="date-of-birth"
                        className="form-control detail"
                        name="dob"
                        value={formData.dob || ""}
                        onChange={handleInputChange}
                        disabled={isDisabled}
                      />
                    </div>

                    <div className="col-12 col-md-4 mb-2">
                      <label
                        htmlFor="children-in-family"
                        className="form-label"
                      >
                        {" "}
                        Children in Family{" "}
                      </label>
                      <input
                        type="text"
                        id="children-in-family"
                        className="form-control detail"
                        placeholder="Enter children in family"
                        name="childreninfamily"
                        value={formData.childreninfamily}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          handleInputChange({
                            target: { name: "childreninfamily", value },
                          });
                        }}
                      />{" "}
                    </div>

                    <div className="col-12 col-md-4 mb-2">
                      <label htmlFor="student-aadhar-no" className="form-label">
                        {" "}
                        Student Aadhar No
                      </label>
                      <input
                        type="text"
                        id="student-aadhar-no"
                        className="form-control detail"
                        placeholder="Enter student aadhar no"
                        name="studentaadharno"
                        value={formData.studentaadharno}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          handleInputChange({
                            target: { name: "studentaadharno", value },
                          });
                        }}
                        maxLength={12}
                      />
                      {errors.studentaadharno && (
                        <small style={{ color: "red" }}>
                          {errors.studentaadharno}
                        </small>
                      )}
                    </div>

                    <div className="col-12 col-md-4 mb-4">
                      <label htmlFor="user-name" className="form-label">
                        User Name
                      </label>
                      <input
                        type="text"
                        id="user-name"
                        className="form-control detail"
                        placeholder="Enter user name"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled
                      />
                      {errors.username && (
                        <small style={{ color: "red" }}>
                          {errors.username}
                        </small>
                      )}
                    </div>

                    <div className="col-12 col-md-4 mb-2">
                      <label htmlFor="remarks" className="form-label">
                        {" "}
                        Remarks
                      </label>
                      <input
                        type="text"
                        id="remarks"
                        className="form-control detail"
                        placeholder="Enter remarks"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-12 col-md-6 mb-3">
                      <label htmlFor="profilePic" className="form-label">
                        Profile Picture
                      </label>

                      {/* ✅ Flex container to align upload input and image preview in one row */}
                      <div className="d-flex align-items-center">
                        {/* File Upload Input */}
                        <input
                          type="file"
                          className="form-control detail"
                          id="profilePic"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          style={{ maxWidth: "65%" }}
                        />

                        {/* Preview Image */}
                        {frontCover && (
                          <div className="ms-3" style={{ marginTop: "-22px" }}>
                            <img
                              src={frontCover}
                              alt="Profile Picture Preview"
                              style={{
                                width: "120px",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
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
