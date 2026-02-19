import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdmRegistration.css";
import { useNavigate } from "react-router-dom";
import useFetchOrganizationList from "../../hooks/useFetchOrganizationList";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";
import useFetchCategories from "../../hooks/useFetchCategories ";
import useFetchOrganizationBranch from "../../hooks/useFetchBranchByOrganization";
import useFetchGenderList from "../../hooks/fetchGenderList";

import Select from "react-select";
import { Link } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate";

const AdmAttendanceEntry = ({ formData, setFormData }) => {
  const navigate = useNavigate();
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
    error: categoryError,
  } = useFetchCategories();
  const {
    branches: organizationBranches,
    loading: orgBranchLoading,
    error: orgBranchError,
  } = useFetchOrganizationBranch();

  const [studentData, setStudentData] = useState([]);
  const [fullStudentData, setFullStudentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const rowsPerPage = 10;
  // Calculate total pages
  const totalPages = Math.ceil(studentData.length / rowsPerPage);
  // Get the current rows for the table
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = studentData.slice(indexOfFirstRow, indexOfLastRow);
  const [filters, setFilters] = useState({
    studentName: "",
    classId: "",
    section: "",
    admissionNo: "",
    barcode: "",
    fatherName: "",
    motherName: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
  });
  const [reportType, setReportType] = useState("");
  const [error, setError] = useState(null);

  // 03-12-2025
  useEffect(() => {
    const organizationId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");

    if (organizationId) {
      setSelectedOrganization({ value: organizationId, label: "" });
    }

    if (branchId) {
      setSelectedOrgBranch({ value: branchId, label: "" });
    }
  }, []);

  useEffect(() => {
    const fetchFullStudentData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Access token not found in localStorage.");
          return;
        }

        const organizationId = sessionStorage.getItem("organization_id");
        const branchId = sessionStorage.getItem("branch_id");

        if (!organizationId || !branchId) {
          console.error(
            "Organization ID or Branch ID not found in session storage"
          );
          return;
        }

        const academicYearId = localStorage.getItem("academicYearId") || 1;
        if (!academicYearId) {
          console.error("No academic year ID found in local storage");
          return;
        }

        const apiUrl = `${ApiUrl.apiurl}StudentRegistrationApi/GetAllSTUDENTList/?organization_id=${organizationId}&branch_id=${branchId}&academic_year_id=${academicYearId}`;

        console.log("Fetch Full Student API URL:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
          setFullStudentData(data.data);
          setStudentData(data.data);
        } else {
          console.warn("No data found for the given parameters");
          setFullStudentData([]);
          setStudentData([]);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchFullStudentData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Allow only letters & spaces for these fields
    if (name === "fatherName" || name === "motherName") {
      const regex = /^[A-Za-z\s]*$/; // only alphabets & spaces

      if (!regex.test(value)) return; // stop update if invalid
    }
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleCancelCloseButton = () => {
    navigate("/admin/dashboard");
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Access token not found in localStorage.");
        setError("Unauthorized: Missing access token.");
        return;
      }

      // 🔹 Added organization & branch from sessionStorage
      const organizationId = sessionStorage.getItem("organization_id");
      const branchId = sessionStorage.getItem("branch_id");

      const params = new URLSearchParams();

      const appendIfValid = (key, value) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value);
        }
      };

      // ✅ Academic filters (overridden by session storage values)
      appendIfValid("organization_id", organizationId);
      appendIfValid("branch_id", branchId);

      appendIfValid("batch_id", filters.batchId);
      appendIfValid("course_id", filters.courseId);
      appendIfValid("academic_year_id", filters.academicYearId);
      appendIfValid("semester_id", filters.semesterId);
      appendIfValid("section_id", filters.sectionId);

      // 🔍 Student search filters
      appendIfValid("classId", filters.classId);
      appendIfValid("student_name", filters.studentName);
      appendIfValid("admission_no", filters.admissionNo);
      appendIfValid("father_name", filters.fatherName);
      appendIfValid("mother_name", filters.motherName);
      appendIfValid("student_status", filters.status);
      appendIfValid("gender", filters.gender);
      appendIfValid("barcode", filters.barcode);

      // 📅 Date filters
      appendIfValid("from_date", fromDate);
      appendIfValid("to_date", toDate);

      // Default fallback
      if (![...params.keys()].length) {
        params.append("academic_year_id", 1);
      }

      const apiUrl = `${ApiUrl.apiurl
        }StudentRegistrationApi/GetAllSTUDENTList/?${params.toString()}`;
      console.log("Search API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      console.log("Search API Response:", data);

      if (!data.data || data.data.length === 0) {
        setFullStudentData([]);
        setStudentData([]);
        setError("No data found for the selected filters");
        return;
      }

      setFullStudentData(data.data);
      setStudentData(data.data);
      setCurrentPage(1);
      setError(null);
    } catch (error) {
      console.error("Search fetch error:", error);
      setStudentData([]);
      setError("Error fetching data");
    }
  };

  const flattenStudentData = (data) => {
    return data.map((student, index) => {
      const basic = student.studentBasicDetails || {};
      const address =
        (student.addressDetails && student.addressDetails[0]) || {};
      console.log("Excel Data");
      console.log(address);
      const fee = (student.feeDetails && student.feeDetails[0]) || {};

      return {
        SerialNo: index + 1,
        AdmissionNo: basic.admission_no,
        FirstName: basic.first_name,
        LastName: basic.last_name,
        Organization: basic.organization_description,
        Branch: basic.branch_name,
        Batch: basic.batch_description,
        Course: basic.course_name,
        Department: basic.department_description,
        AcademicYear: basic.academic_year_description,
        Semester: basic.semester_description,
        Section: basic.section_name,
        Gender: basic.gender_name,
        DOB: basic.date_of_birth,
        Email: basic.email,
        StudentAdharNo: basic.student_aadhaar_no,
        FatherName: basic.father_name,
        FatherContactNo: basic.father_contact_number,
        FatherAdharNo: basic.father_aadhaar_no,
        MotherName: basic.mother_name,
        MotherContactNo: basic.mother_contact_number,
        MotherAdharNo: basic.mother_aadhaar_no,
        PresentAddress: address.present_address,
        PresentCity: address.present_city,
        PresentState: address.present_state,
        PresentCountry: address.present_country,
        PresentPincode: address.present_pincode,
        PermanentAddress: address.permanent_address,
        PermanentCity: address.permanent_city,
        PermanentState: address.permanent_state,
        PermanentCountry: address.permanent_country,
        PermanentPincode: address.permanent_pincode,
      };
    });
  };

  const handleClear = () => {
    // ✅ Clear all filter values
    setFilters({
      studentName: "",
      classId: "",
      section: "",
      admissionNo: "",
      barcode: "",
      fatherName: "",
      motherName: "",
      gender: "",
      status: "",
      courseId: "",
      branchId: "",
      academicYearId: "",
      semesterId: "",
      sectionId: "",
      organizationId: "",
      sessionId: "",
    });

    // ✅ Clear all dropdown selections
    // setSelectedOrganization(null);
    // setSelectedOrgBranch(null);
    const organizationId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");

    setSelectedOrganization({ value: organizationId, label: "" });
    setSelectedOrgBranch({ value: branchId, label: "" });
    setSelectedSession(null);
    setSelectedCourse(null);
    setSelectedBranch(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSectionFiltered(null);

    // ✅ Clear dates
    setFromDate("");
    setToDate("");

    // ✅ Reset data back to full list
    setStudentData(fullStudentData);

    // ✅ Reset pagination
    setCurrentPage(1);

    // ✅ Optional: clear any errors or messages
    setError(null);

    // ✅ Clear formData if applicable (profile pic, etc.)
    try {
      sessionStorage.removeItem("profile_pic_name");
      sessionStorage.removeItem("profile_pic_type");

      setFormData((prev) => ({
        ...prev,
        profile_pic: null,
        profile_pic_preview: "",
      }));

      const fileInput = document.getElementById("profilePic");
      if (fileInput) fileInput.value = "";

      const previewImg = document.querySelector(
        'img[alt="Profile Picture Preview"]'
      );
      if (previewImg) previewImg.removeAttribute("src");
    } catch (err) {
      console.warn("Error clearing profile pic:", err);
    }
  };

  // Export to Excel function
  const exportToExcel = () => {
    if (fullStudentData && fullStudentData.length > 0) {
      const flattened = flattenStudentData(fullStudentData);
      const worksheet = XLSX.utils.json_to_sheet(flattened);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "StudentData");
      XLSX.writeFile(workbook, "Registration_Data.xlsx");
    } else {
      alert("No data available to export!");
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1); // react-paginate is 0-based, so add 1
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
                STUDENT SEARCH
              </p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={() => navigate("/admstudentregistration")}
                  >
                    New
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={handleCancelCloseButton}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={exportToExcel}
                  >
                    Export To Excel
                  </button>
                </div>
              </div>
              <div className="row mt-3 mx-2">
                <div
                  className="col-12 custom-section-box"
                  style={{ height: "300px" }}
                >
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mt-2">
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="studentName" className="form-label">
                          Student Name
                        </label>
                        <input
                          type="text"
                          id="studentName"
                          name="studentName"
                          className="form-control detail"
                          placeholder="Enter student name"
                          value={filters.studentName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="admissionNo" className="form-label">
                          Admission No
                        </label>
                        <input
                          type="text"
                          id="admissionNo"
                          name="admissionNo"
                          className="form-control detail"
                          placeholder="Enter admission number"
                          value={filters.admissionNo}
                          onChange={handleInputChange}
                        />{" "}
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="barcode" className="form-label">
                          Student Barcode
                        </label>
                        <input
                          type="text"
                          id="barcode"
                          name="barcode"
                          className="form-control detail"
                          placeholder="Enter barcode"
                          value={filters.barcode}
                          onChange={handleInputChange}
                        />{" "}
                      </div>
                      {/* <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="admitted-organization" className="form-label">
                          Organization
                        </label>
                        <Select
                          className="detail"
                          id="admitted-organization"
                          classNamePrefix="detail"
                          placeholder="Select Organization"
                          isLoading={!OrganizationList.length && !orgError}
                          options={OrganizationList.map((org) => ({
                            value: org.id,
                            label: org.organization_description,
                          }))}
                          value={selectedOrganization} // use object directly
                          onChange={(selectedOption) => {
                            setSelectedOrganization(selectedOption); // store object {value, label}
                            setSelectedBranch(null);                 // reset branch
                            setSelectedSession(null);                // reset batch
                            setFilters((prev) => ({ ...prev, organizationId: selectedOption?.value }));
                          }}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="organization-branch" className="form-label">
                          Branch
                        </label>
                        <Select
                          id="organization-branch"
                          placeholder={orgBranchLoading ? "Loading branches..." : "Select Branch"}
                          isDisabled={!selectedOrganization || orgBranchLoading || organizationBranches.length === 0}
                          options={organizationBranches.map((branch) => ({
                            value: branch.branch_id,
                            label: branch.branch_name,
                          }))}
                          value={selectedOrgBranch}
                          onChange={(option) => {
                            setSelectedOrgBranch(option);
                            setSelectedSession(null); // ✅ reset Session when org branch changes
                          }}
                        />
                      </div> */}
                      {/* 🔹 Session Dropdown */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="admitted-batch" className="form-label">
                          Session
                        </label>
                        <Select
                          id="admitted-batch"
                          classNamePrefix="detail"
                          placeholder={
                            !selectedOrganization || !selectedOrgBranch
                              ? "Select Branch first"
                              : batchLoading
                                ? "Loading Session..."
                                : "Select Session"
                          }
                          isDisabled={batchLoading}
                          isLoading={batchLoading}
                          options={BatchList.map((batch) => ({
                            value: batch.id,
                            label: batch.batch_description,
                          }))}
                          value={
                            selectedSession
                              ? {
                                value: selectedSession,
                                label:
                                  BatchList.find(
                                    (b) => b.id === selectedSession
                                  )?.batch_description || "",
                              }
                              : null
                          }
                          onChange={(selectedOption) => {
                            const value = selectedOption
                              ? selectedOption.value
                              : null;
                            setSelectedSession(value);
                            setFilters((prev) => ({
                              ...prev,
                              sessionId: value,
                            }));
                          }}
                        />
                      </div>
                      {/* 🔹 Course Dropdown */}
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="admitted-class" className="form-label">
                          Course
                        </label>
                        <Select
                          id="admitted-class"
                          className="detail"
                          classNamePrefix="detail"
                          placeholder={
                            !selectedSession
                              ? "Select Session first"
                              : "Select Course"
                          }
                          isDisabled={!selectedOrganization || !selectedSession}
                          isLoading={courseLoading}
                          options={CourseList.map((course) => ({
                            value: course.id,
                            label: `${course.course_name}`,
                          }))}
                          value={
                            CourseList.map((course) => ({
                              value: course.id,
                              label: course.course_name,
                            })).find(
                              (option) => option.value === selectedCourse
                            ) || null
                          }
                          onChange={(selectedOption) => {
                            const value = selectedOption
                              ? selectedOption.value
                              : null;
                            setSelectedCourse(value);
                            setFilters((prev) => ({
                              ...prev,
                              courseId: value,
                            }));
                            // ✅ Removed the line that resets branch (no hiding anymore)
                          }}
                        />
                      </div>
                      {/* 🔹 Department Dropdown */}
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="department" className="form-label">
                          Department
                        </label>
                        <Select
                          id="department"
                          className="detail"
                          classNamePrefix="detail"
                          placeholder={
                            !selectedCourse
                              ? "Select Course first"
                              : "Select Department"
                          }
                          isDisabled={
                            !selectedOrganization ||
                            !selectedSession ||
                            !selectedCourse
                          }
                          isLoading={branchLoading}
                          options={
                            BranchList.map((dept) => ({
                              value: dept.id,
                              label: `${dept.department_code} - ${dept.department_description}`,
                            })) || []
                          }
                          value={
                            BranchList.map((dept) => ({
                              value: dept.id,
                              label: `${dept.department_code} - ${dept.department_description}`,
                            })).find(
                              (option) => option.value === selectedDepartment
                            ) || null
                          }
                          onChange={(selectedOption) => {
                            const value = selectedOption
                              ? selectedOption.value
                              : null;
                            setSelectedDepartment(value);
                            setFilters((prev) => ({
                              ...prev,
                              branchId: value,
                            }));
                          }}
                        />
                      </div>
                      {/* 🔹 Academic Year Dropdown */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="academic-year" className="form-label">
                          Academic Year
                        </label>
                        <Select
                          id="academic-year"
                          className="detail"
                          classNamePrefix="detail"
                          placeholder={
                            !selectedDepartment
                              ? "Select Department first"
                              : "Select Academic Year"
                          }
                          isDisabled={
                            !selectedOrganization ||
                            !selectedSession ||
                            !selectedCourse ||
                            !selectedDepartment
                          }
                          isLoading={academicYearLoading}
                          options={
                            AcademicYearList.map((year) => ({
                              value: year.id,
                              label: `${year.academic_year_description}`,
                            })) || []
                          }
                          value={
                            AcademicYearList.map((year) => ({
                              value: year.id,
                              label: `${year.academic_year_description}`,
                            })).find(
                              (option) => option.value === selectedAcademicYear
                            ) || null
                          }
                          onChange={(selectedOption) => {
                            const value = selectedOption
                              ? selectedOption.value
                              : "";
                            setSelectedAcademicYear(value);
                            setFilters((prev) => ({
                              ...prev,
                              academicYearId: value,
                            }));
                          }}
                        />
                      </div>
                      {/* 🔹 Semester Dropdown */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="semester" className="form-label">
                          Semester
                        </label>
                        <Select
                          id="semester"
                          className="detail"
                          classNamePrefix="detail"
                          placeholder={
                            !selectedAcademicYear
                              ? "Select Academic Year first"
                              : "Select Semester"
                          }
                          isDisabled={
                            !selectedOrganization ||
                            !selectedSession ||
                            !selectedCourse ||
                            !selectedDepartment ||
                            !selectedAcademicYear
                          }
                          isLoading={semesterLoading}
                          options={
                            SemesterList.map((sem) => ({
                              value: sem.id,
                              label: `${sem.semester_description}`,
                            })) || []
                          }
                          value={
                            SemesterList.map((sem) => ({
                              value: sem.id,
                              label: `${sem.semester_description}`,
                            })).find(
                              (option) => option.value === selectedSemester
                            ) || null
                          }
                          onChange={(selectedOption) => {
                            const value = selectedOption
                              ? selectedOption.value
                              : "";
                            setSelectedSemester(value);
                            setFilters((prev) => ({
                              ...prev,
                              semesterId: value,
                            }));
                          }}
                        />
                      </div>
                      {/* 🔹 Section Dropdown */}
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="section" className="form-label">
                          Section
                        </label>
                        <Select
                          id="section"
                          className="detail"
                          classNamePrefix="detail"
                          placeholder={
                            !selectedSemester
                              ? "Select Semester first"
                              : "Select Section"
                          }
                          isDisabled={
                            !selectedOrganization ||
                            !selectedSession ||
                            !selectedCourse ||
                            !selectedDepartment ||
                            !selectedAcademicYear ||
                            !selectedSemester
                          }
                          isLoading={sectionFilterLoading}
                          options={
                            SectionList.map((sec) => ({
                              value: sec.id,
                              label: `${sec.section_name}`,
                            })) || []
                          }
                          value={
                            SectionList.map((sec) => ({
                              value: sec.id,
                              label: `${sec.section_name}`,
                            })).find(
                              (option) =>
                                option.value === selectedSectionFiltered
                            ) || null
                          }
                          onChange={(selectedOption) => {
                            const value = selectedOption
                              ? selectedOption.value
                              : "";
                            setSelectedSectionFiltered(value);
                            setFilters((prev) => ({
                              ...prev,
                              sectionId: value,
                            }));
                          }}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="fatherName" className="form-label">
                          Father's Name
                        </label>
                        <input
                          type="text"
                          id="fatherName"
                          name="fatherName"
                          className="form-control detail"
                          placeholder="Enter father's name"
                          value={filters.fatherName}
                          onChange={handleInputChange}
                        />{" "}
                      </div>
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="motherName" className="form-label">
                          Mother's Name
                        </label>
                        <input
                          type="text"
                          id="motherName"
                          name="motherName"
                          className="form-control detail"
                          placeholder="Enter mother's name"
                          value={filters.motherName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
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
                                label: g.gender_name,
                              }))
                              : []
                          }
                          value={
                            Array.isArray(genders)
                              ? genders
                                .map((g) => ({
                                  value: g.id,
                                  label: g.gender_name,
                                }))
                                .find(
                                  (opt) =>
                                    Number(opt.value) ===
                                    Number(filters.gender)
                                ) || null
                              : null
                          }
                          onChange={(selectedOption) => {
                            const value = selectedOption
                              ? selectedOption.value
                              : "";
                            setFilters((prev) => ({
                              ...prev,
                              gender: value, // ✅ updates gender filter value
                            }));
                          }}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="from-date" className="form-label">
                          From Date
                        </label>
                        <input
                          type="date"
                          id="from-date"
                          className="form-control detail"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="to-date" className="form-label">
                          To Date
                        </label>
                        <input
                          type="date"
                          id="to-date"
                          className="form-control detail"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="status" className="form-label">
                          Status
                        </label>
                        <Select
                          id="status"
                          className="detail"
                          classNamePrefix="status-select"
                          options={[
                            { value: "", label: "Select Status" },
                            { value: "ACTIVE", label: "ACTIVE" },
                            { value: "INACTIVE", label: "INACTIVE" },
                          ]}
                          value={[
                            { value: "", label: "Select Status" },
                            { value: "ACTIVE", label: "ACTIVE" },
                            { value: "INACTIVE", label: "INACTIVE" },
                          ].find((option) => option.value === filters.status)}
                          onChange={(selectedOption) =>
                            setFilters((prevFilters) => ({
                              ...prevFilters,
                              status: selectedOption
                                ? selectedOption.value
                                : "",
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover table-sm">
                      <thead className="table-dark">
                        <tr>
                          <th scope="col">Sl No.</th>
                          <th scope="col">Student Name</th>
                          <th scope="col">College Admission No</th>
                          <th scope="col">Admission No</th>
                          <th scope="col">Session</th>
                          <th scope="col">Course</th>
                          <th scope="col">Department</th>
                          <th scope="col">Academic Year</th>
                          <th scope="col">Semester</th>
                          <th scope="col">Section</th>
                          <th scope="col">Father's Name</th>
                          <th scope="col">Mother's Name</th>
                          <th scope="col">Barcode</th>
                          <th scope="col">Category</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRows.length > 0 ? (
                          currentRows.map((student, index) => {
                            const { studentBasicDetails } = student;
                            return (
                              <tr key={index}>
                                <td>{indexOfFirstRow + index + 1}</td>
                                <td>{`${studentBasicDetails.first_name || ""} ${studentBasicDetails.middle_name || ""
                                  } ${studentBasicDetails.last_name || ""}`}</td>
                                <td>
                                  {studentBasicDetails.college_admission_no}
                                </td>
                                <td>{studentBasicDetails.admission_no}</td>
                                <td>
                                  {studentBasicDetails.batch_description || "—"}
                                </td>
                                <td>
                                  {studentBasicDetails.course_name || "—"}
                                </td>
                                <td>
                                  {studentBasicDetails.department_description ||
                                    "—"}
                                </td>
                                <td>
                                  {studentBasicDetails.academic_year_description ||
                                    "—"}
                                </td>
                                <td>
                                  {studentBasicDetails.semester_description ||
                                    "—"}
                                </td>
                                <td>
                                  {studentBasicDetails.section_name || "—"}
                                </td>
                                <td>{studentBasicDetails.father_name}</td>
                                <td>{studentBasicDetails.mother_name}</td>
                                <td>{studentBasicDetails.barcode}</td>
                                <td>{studentBasicDetails.category_name}</td>
                                <td>
                                  <Link
                                    to={`/admstudentregistration/${studentBasicDetails.id}?organization_id=${studentBasicDetails.organization}&branch_id=${studentBasicDetails.branch}`}
                                    className="btn btn-sm btn-primary"
                                  >
                                    Edit
                                  </Link>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="15" style={{ textAlign: "center" }}>
                              No Data Available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {/* Pagination controls */}
                    <ReactPaginate
                      previousLabel={"Previous"}
                      nextLabel={"Next"}
                      breakLabel={"..."}
                      breakClassName={"page-item"}
                      breakLinkClassName={"page-link"}
                      pageCount={totalPages}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageChange}
                      containerClassName={"pagination justify-content-center"}
                      pageClassName={"page-item"}
                      pageLinkClassName={"page-link"}
                      previousClassName={"page-item"}
                      previousLinkClassName={"page-link"}
                      nextClassName={"page-item"}
                      nextLinkClassName={"page-link"}
                      activeClassName={"active"}
                      forcePage={currentPage - 1} // keep sync with state
                    />
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
