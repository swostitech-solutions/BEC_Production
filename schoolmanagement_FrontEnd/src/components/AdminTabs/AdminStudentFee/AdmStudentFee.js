

import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SelectStudentModal from "../AdminAttendanceEntry/SelectStudentModal";
import SelectStudentFeeModal from "../FeeStudentModal/SelectStudentFeeModal";
import Select from "react-select";
import { Table, Pagination } from "react-bootstrap";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";

const StudentFee = () => {
  const navigate = useNavigate();
  const academicSessionId = localStorage.getItem("academicSessionId") || "1";
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [periodOptions, setPeriodOptions] = useState([]);
  const [feeStructure, setFeeStructure] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [unpaidElements, setUnpaidElements] = useState([]);

  const [selectedFeeApplied, setSelectedFeeApplied] = useState(null);
  const [elementNameOptions, setElementNameOptions] = useState([]);
  const [feeElement, setFeeElement] = useState({
    name: "",
    element_type_id: null,
    frequency: "",
    amount: "",
    semesters: [], // <- empty array (not Array(8).fill(""))
    adjustment_flag: "N",
    period_month: "",
  });
  const [addedFeeElements, setAddedFeeElements] = useState([]);
  const [frequencyOptions, setFrequencyOptions] = useState([]);
  // const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [disabledPeriods, setDisabledPeriods] = useState(Array(8).fill(true));
  const [selectedOption, setSelectedOption] = useState(null);
  const [periodMonthDisabled, setPeriodMonthDisabled] = React.useState(false);
  // Student basic information
  const [selectedStudent, setSelectedStudent] = useState({
    name: "",
    barcode: "",
    admissionNo: "",
    fatherName: "",
    motherName: "",
    schoolAdmissionNo: "",
  });

  // Store entire student API response
  const [studentDetails, setStudentDetails] = useState();

  // Course / Department / Session etc.
  const [selectedCourse, setSelectedCourse] = useState();
  const [selectedDepartment, setSelectedDepartment] = useState();
  const [selectedSession, setSelectedSession] = useState();
  const [selectedAcademicYear, setSelectedAcademicYear] = useState();
  const [selectedSemester, setSelectedSemester] = useState();
  const [selectedSection, setSelectedSection] = useState();
  const [studentName, setStudentName] = useState("");
  const [visibleSemesters, setVisibleSemesters] = useState(0);
  const [semesterOptions, setSemesterOptions] = useState([]);


  const handleClear = () => {
    setSelectedStudent({
      name: "",
      barcode: "",
      admissionNo: "",
      fatherName: "",
      motherName: "",
      schoolAdmissionNo: "",
    });

    setStudentId(null);
    setFeeStructure([]);
    setUnpaidElements([]);
    setAddedFeeElements([]);

    // RESET SEMESTERS COUNT & DROPDOWNS
    setVisibleSemesters(0);

    // RESET ADD FEE ELEMENT FORM
    setFeeElement({
      name: "",
      element_type_id: null,
      frequency: "",
      amount: "",
      semesters: Array(8).fill(""), // FIX → semester values always exist
      adjustment_flag: "N",
      period_month: "",
    });

    // RESET ALL SELECT DROPDOWNS
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedSession(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
    setSelectedFeeApplied(null);

    // OPTIONAL: disable month/periods
    setDisabledPeriods(Array(8).fill(true));
    setPeriodMonthDisabled(false);

    // PAGE RESET
    setCurrentPage(1);
  };

  const handleUpdateCheckboxChange = (
    itemId,
    isChecked,
    value,
    elementName
  ) => {
    setUnpaidElements((prev) =>
      prev.map((detail) => {
        if (detail.element_name === elementName) {
          return {
            ...detail,
            updateflag: detail.id === itemId ? isChecked : false,
            // Only updateamount for the row where checkbox is checked
            updateamount:
              detail.id === itemId && isChecked
                ? parseFloat(value || 0)
                : detail.updateamount,
          };
        }
        return detail;
      })
    );
  };

  const handleRemoveCheckboxChange = (itemId, isChecked, elementName) => {
    setUnpaidElements((prev) =>
      prev.map((detail) => {
        if (detail.element_name === elementName) {
          return {
            ...detail,
            removeflag: detail.id === itemId ? isChecked : false,
          };
        }
        return detail;
      })
    );
  };

  const handleFeeStructureAmountChange = (itemId, value) => {
    setFeeStructure((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, total_element_period_amount: value }
          : item
      )
    );
  };

  const handleFeeStructureUpdateCheckbox = (itemId, isChecked) => {
    setFeeStructure((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, updateflag: isChecked } : item
      )
    );
  };
  const handleFeeStructureRemoveCheckbox = (itemId, isChecked) => {
    setFeeStructure((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, removeflag: isChecked } : item
      )
    );
  };

  const handleSelectStudent = async (selectedStudent) => {
    try {
      // Safely extract student_id
      const studentId =
        selectedStudent?.fullData?.student ||
        selectedStudent?.studentBasicDetails?.student_id ||
        selectedStudent?.student_id ||
        null;

      if (!studentId) {
        console.error("No valid student ID found in selected student");
        return;
      }

      //  Store student_id for persistence
      localStorage.setItem(
        "selectedClubStudentId",
        JSON.stringify({ student_id: studentId })
      );

      console.log(" Stored student_id in localStorage:", studentId);

      //  Fetch full details from the API
      await fetchStudentDetails(studentId);

      //  Close modal
      handleCloseModal();
    } catch (error) {
      console.error(" Error handling selected student:", error);
    }
  };

  const fetchStudentDetails = async (student_id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const organization_id = sessionStorage.getItem("organization_id");
      const branch_id = sessionStorage.getItem("branch_id");

      if (!student_id || !organization_id || !branch_id || !token) {
        console.error(" Missing identifiers for fetching student data");
        return;
      }

      const url = `${ApiUrl.apiurl}StudentCourse/GetStudentDataBasedId/?student_id=${student_id}&branch_id=${branch_id}&organization_id=${organization_id}`;
      console.log(" Fetching from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch student details");

      const result = await response.json();
      console.log("🔹 API Response:", result);

      if (result.message === "Success" && result.data) {
        const student = result.data;

        setStudentDetails(student);
        setStudentName(student.student_name || "");

        setSelectedStudent({
          name: student.student_name || "",
          barcode: student.barcode || "",
          admissionNo: student.college_admission_no || "",
        });

        setSelectedSession({
          value: student.batch_id,
          label: student.batch,
        });

        setSelectedCourse({
          value: student.course_id,
          label: student.course_name,
        });

        setSelectedDepartment({
          value: student.department_id,
          label: student.department,
        });

        setSelectedAcademicYear({
          value: student.academic_year_id,
          label: student.academic_year,
        });

        setSelectedSemester({
          value: student.semester_id,
          label: student.semester_name,
        });

        setSelectedSection({
          value: student.section_id,
          label: student.section_name,
        });
      } else {
        console.warn(" No data found for student_id:", student_id);
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const handleAmountChange = (id, value) => {
    setFeeStructure((prevFeeStructure) =>
      prevFeeStructure.map((item) =>
        item.id === id
          ? { ...item, total_element_period_amount: parseFloat(value) || 0 }
          : item
      )
    );
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const itemsPerPage = 6; // Number of items per page

  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);


  const handleAddFeeElement = () => {
    // Validation (silent)
    if (
      !feeElement.element_type_id ||
      !feeElement.frequency ||
      !feeElement.amount
    ) {
      return;
    }

    // Build safe periods array matching visibleSemesters
    const periods = Array.from({ length: visibleSemesters }).map(
      (_, i) => feeElement.semesters?.[i] ?? ""
    );

    const newElement = {
      id: Date.now(),
      name: feeElement.name || "",
      frequency: feeElement.frequency,
      frequencyName:
        frequencyOptions.find((o) => o.value === feeElement.frequency)?.label ||
        "",
      amount: feeElement.amount,
      periods, // always an array of length visibleSemesters
    };

    setAddedFeeElements((prev) => [...prev, newElement]);

    // Reset form, keep semesters length in sync with visibleSemesters
    setFeeElement({
      element_type_id: null,
      name: "",
      frequency: "",
      amount: "",
      semesters: Array(visibleSemesters).fill(""),
      adjustment_flag: "N",
      period_month: "",
    });
  };




  useEffect(() => {
    const fetchSemesterbydepartment = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");

        const batch_id = selectedSession?.value || "";
        const course_id = selectedCourse?.value || "";
        const department_id = selectedDepartment?.value || "";

        if (!batch_id || !course_id || !department_id) {
          setSemesterOptions([]);
          return;
        }

        const response = await fetch(
          `${ApiUrl.apiurl}Semester/GetSemesterByDepartment/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (Array.isArray(data)) {
          const options = data.map((item) => ({
            value: item.id,
            label: item.semester_description || item.semester_code,
          }));

          setSemesterOptions(options);
        } else {
          console.error("Unexpected semester API format:", data);
        }
      } catch (error) {
        console.error("Error fetching semesters:", error);
      }
    };

    fetchSemesterbydepartment(); // FIXED
  }, [selectedSession, selectedCourse, selectedDepartment]);

  const handleFrequencyChange = async (selectedOption) => {
    setFeeElement((prev) => ({
      ...prev,
      frequency: selectedOption?.value || "",
    }));

    if (!selectedOption) return;

    const organization_id = sessionStorage.getItem("organization_id");
    const branch_id = sessionStorage.getItem("branch_id");

    try {
      const res = await fetch(
        `${ApiUrl.apiurl}FeeFrequency/GetFeeFrequencyById/?organization_id=${organization_id}&branch_id=${branch_id}&fee_frequency_id=${selectedOption.value}`
      );

      const data = await res.json();
      const count = data.frequency_period;

      setVisibleSemesters(count);
      setFeeElement((prev) => ({
        ...prev,
        semesters: Array(count).fill(""),
      }));
    } catch (error) {
      console.error("Frequency API Error:", error);
    }
  };

  useEffect(() => {
    const fetchFrequencyOptions = async () => {
      // Guard: Need at least Batch (Session) and Course to filter Frequency
      const batch_id = selectedSession?.value;
      const course_id = selectedCourse?.value;
      const department_id = selectedDepartment?.value || "";

      if (!batch_id || !course_id) {
        setFrequencyOptions([]);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");

        if (!token) {
          console.error("Access token not found");
          return;
        }

        // Construct URL with filters (matching AdmFeeStructure implementation)
        let url = `${ApiUrl.apiurl}FeeFrequency/GetAllFrequencyPeriodList/?organization=${organization_id}&branch=${branch_id}&batch=${batch_id}&course=${course_id}`;

        if (department_id) {
          url += `&department=${department_id}`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();

        if (result?.data && Array.isArray(result.data)) {
          const options = result.data.map((option) => ({
            value: option.id,
            label: option.fee_frequency_name,
            fee_frequency_name: option.fee_frequency_name, // keep original fields for reference
            frequency_period: option.frequency_period,
          }));

          setFrequencyOptions(options);
        } else {
          setFrequencyOptions([]);
        }
      } catch (error) {
        console.error("Error fetching frequency options:", error);
        setFrequencyOptions([]);
      }
    };

    fetchFrequencyOptions();
  }, [selectedSession, selectedCourse, selectedDepartment]);

  const handlePeriodMonthChange = (selectedOption) => {
    setFeeElement((prev) => ({
      ...prev,
      period_month: selectedOption ? selectedOption.value : 1, // Set to 1 if null
    }));
  };

  const handleFeeAppliedChange = (option) => {
    setSelectedFeeApplied(option);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minWidth: "100%",
    }),
  };

  const handleChange = (selected) => {
    setSelectedOption(selected);
  };

  // Sample data for the table

  useEffect(() => {
    const fetchFeeElements = async () => {
      try {
        //  Get access token from localStorage
        const token = localStorage.getItem("accessToken");

        if (!token) {
          console.error("Access token not found in localStorage");
          return;
        }

        const response = await fetch(
          `${ApiUrl.apiurl}FeeElementType/GetAllFeeElements/S`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, //  pass token properly
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        //  Adjust mapping based on your backend response structure
        if (result && result.data && Array.isArray(result.data)) {
          const options = result.data.map((element) => ({
            value: element.id,
            label:
              element.elementDescription ||
              element.element_description ||
              "N/A",
          }));
          setElementNameOptions(options);
        } else {
          console.error("Invalid data format:", result);
        }
      } catch (error) {
        console.error("Error fetching fee elements:", error);
      }
    };

    fetchFeeElements();
  }, []);

  const handleSearch = async () => {
    try {
      const id = selectedStudent?.id || "";
      const barcode = selectedStudent?.barcode
        ? String(selectedStudent.barcode).trim()
        : "";
      const admissionNo = selectedStudent?.admissionNo
        ? String(selectedStudent.admissionNo).trim()
        : "";

      if (!id && !barcode && !admissionNo) {
        console.error("Please enter Student ID, Barcode, or Admission No.");
        return;
      }

      // Build correct query params
      const queryParams = new URLSearchParams();
      queryParams.append("flag", "y"); // MUST be lowercase
      queryParams.append("student_course_id", id || "");
      queryParams.append("barcode", barcode || "");
      queryParams.append("college_admission_no", admissionNo || "");

      const url = `${ApiUrl.apiurl}Filter/GetFilterStudentFilterdataBasedOnCondition/?${queryParams.toString()}`;

      console.log("🔍 Fetching student:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      console.log(" Student Filter API Response:", result);

      if (response.ok && result.message === "success!!" && result.data) {
        const studentData = result.data;

        // Store student id
        setStudentId(studentData.studentId);

        // Map all student data through your existing function
        await fetchStudentDetails(studentData.studentId);

        // Extract fee details from same response
        const feeData = studentData.feedetails || [];
        setFeeStructure(feeData);

        // Unique unpaid elements
        const unpaid = feeData
          .filter((item) => parseFloat(item.paid_amount) === 0)
          .reduce((unique, item) => {
            const isDuplicate = unique.some(
              (el) =>
                el.element_name === item.element_name &&
                parseFloat(el.total_element_period_amount) ===
                parseFloat(item.total_element_period_amount)
            );

            if (!isDuplicate) {
              unique.push({
                ...item,
                updateflag: false,
                removeflag: false,
                updateamount: "",
              });
            }

            return unique;
          }, []);

        setUnpaidElements(unpaid);
      } else {
        console.error("No student found.");
        setFeeStructure([]);
        setUnpaidElements([]);
      }
    } catch (error) {
      console.error(" Error searching student:", error);
    }
  };


  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const organization_id = sessionStorage.getItem("organization_id");
      const branch_id = sessionStorage.getItem("branch_id");
      const userId = sessionStorage.getItem("userId");

      if (!token || !organization_id || !branch_id || !userId) {
        alert("Required values are missing.");
        return;
      }

      if (!studentId) {
        alert("Select student first");
        return;
      }

      // ------------------------------------
      // 1️ FIXED studentIndividualFeeDetails
      // ------------------------------------
      // 1️ FIXED studentIndividualFeeDetails — remove invalid rows
      const studentIndividualFeeDetails = feeStructure
        .filter((item) => item.id && item.total_element_period_amount !== null)
        .map((item) => ({
          student_fee_details_id: Number(item.id),
          update_amount: Number(item.total_element_period_amount) || 0,
          update_flag: Boolean(item.updateflag),
          remove_flag: Boolean(item.removeflag),
        }));

      // 2️⃣ FIXED studentFeeDetails — safe mapping
      const studentFeeDetails = unpaidElements.map((item) => ({
        fee_element: item.element_name || "",
        student_id: Number(studentId),
        update_amount: Number(item.updateamount) || 0,
        update_flag: Boolean(item.updateflag),
        remove_flag: Boolean(item.removeflag),
      }));

      // 3️⃣ FIXED addfeeElement — validated frequency & semester values
      const addfeeElement = addedFeeElements
        .filter((el) => el.frequency && el.name)
        .map((el) => {
          const periods = Array.from({ length: 8 }).map(
            (_, i) => Number(el.periods?.[i]) || 0
          );
          return {
            student_id: Number(studentId),
            element_name: el.name,
            frequency_id: Number(el.frequency),
            semester_id: 1,
            organization_id: Number(organization_id),
            branch_id: Number(branch_id),
            amount: Number(el.amount) || 0,
            semester_1: periods[0],
            semester_2: periods[1],
            semester_3: periods[2],
            semester_4: periods[3],
            semester_5: periods[4],
            semester_6: periods[5],
            semester_7: periods[6],
            semester_8: periods[7],
          };
        });


      // ------------------------------------
      // FINAL PAYLOAD
      // ------------------------------------
      const payload = {
        loginUser: userId,
        organization_id: Number(organization_id),
        branch_id: Number(branch_id),
        studentIndividualFeeDetails,
        studentFeeDetails,
        addfeeElement,
      };

      // 🔍 Detect operation type
      const isUpdate =
        studentIndividualFeeDetails.some((item) => item.update_flag) ||
        studentFeeDetails.some((item) => item.update_flag);

      const isRemove =
        studentIndividualFeeDetails.some((item) => item.remove_flag) ||
        studentFeeDetails.some((item) => item.remove_flag);

      const isAdd = addfeeElement.length > 0;

      const response = await fetch(
        `${ApiUrl.apiurl}StudentFeeDetails/StudentFeesManagement/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (isAdd) {
        alert("Fee element added successfully!");
      } else if (isRemove) {
        alert("Fee element removed successfully!");
      } else if (isUpdate) {
        alert("Fee updated successfully!");
      } else {
        alert("Operation completed successfully!");
      }
      handleClear();


      // RESET STATES
      setSelectedStudent({
        name: "",
        barcode: "",
        admissionNo: "",
        fatherName: "",
        motherName: "",
        schoolAdmissionNo: "",
      });

      setFeeStructure([]);
      setUnpaidElements([]);
      setAddedFeeElements([]);
      setFeeElement({
        name: "",
        element_type_id: null,
        frequency: "",
        amount: 0,
        periods: Array(8).fill(""),
        adjustment_flag: "N",
        period_month: "",
      });
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save data. Please try again.");
    }
  };



  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

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
                STUDENT FEE DETAILS
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{ width: "150px" }}
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-4 mb-3">
                        <label htmlFor="student-name" className="form-label">
                          Student Name
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="student-name"
                            className="form-control detail"
                            placeholder="Enter student name"
                            ref={admissionNoRef}
                            value={selectedStudent.name}
                            readOnly
                          />

                          <button
                            type="button"
                            className="btn btn-primary ms-2 mb-0 mt-0"
                            onClick={handleOpenModal}
                            style={{ width: "50px", padding: "3px" }}
                          >
                            ...
                          </button>
                        </div>
                      </div>

                      <SelectStudentFeeModal
                        show={showModal}
                        handleClose={handleCloseModal}
                        onSelectStudent={handleSelectStudent}
                      />

                      <div className="col-12 col-md-4 mb-1">
                        <label htmlFor="student-barcode" className="form-label">
                          Student BarCode
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="student-barcode"
                            className="form-control detail"
                            placeholder="Enter student barcode"
                            ref={barcodeRef}
                            value={selectedStudent.barcode}
                            onChange={(e) =>
                              setSelectedStudent({
                                ...selectedStudent,
                                barcode: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-4 mb-1">
                        <label
                          htmlFor="school-admission-no"
                          className="form-label"
                        >
                          College Admission No
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="school-admission-no"
                            className="form-control detail"
                            placeholder="Enter school admission no"
                            value={selectedStudent.admissionNo || ""}
                            onChange={(e) =>
                              setSelectedStudent({
                                ...selectedStudent,
                                admissionNo: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-4 mb-3">
                        <label htmlFor="session" className="form-label">
                          Session
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="session"
                            className="form-control detail"
                            placeholder="Enter Session"
                            ref={admissionNoRef}
                            value={selectedSession?.label || ""}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-4 mb-3">
                        <label htmlFor="course" className="form-label">
                          Course
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="course"
                            className="form-control detail"
                            placeholder="Enter Course"
                            ref={admissionNoRef}
                            value={selectedCourse?.label || ""}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-4 mb-3">
                        <label htmlFor="branch" className="form-label">
                          Branch
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="branch"
                            className="form-control detail"
                            placeholder="Enter Branch"
                            ref={admissionNoRef}
                            value={selectedDepartment?.label || ""}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-4 mb-3">
                        <label htmlFor="academic-year" className="form-label">
                          Academic Year
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="academic-year"
                            className="form-control detail"
                            placeholder="Enter Academic Year"
                            ref={admissionNoRef}
                            value={selectedAcademicYear?.label || ""}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-4 mb-3">
                        <label htmlFor="semester" className="form-label">
                          Semester
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="semester"
                            className="form-control detail"
                            placeholder="Enter Semester"
                            ref={admissionNoRef}
                            value={selectedSemester?.label || ""}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-4 mb-1">
                        <label htmlFor="period" className="form-label">
                          Section
                        </label>
                        <input
                          type="text"
                          id="period"
                          className="form-control detail"
                          placeholder="Enter section"
                          value={selectedSection?.label || ""}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row for side-by-side tables */}
              <div className="row mt-3">
                <div className="col-md-6 ">
                  <h5>Element Details</h5>
                  <div
                    className="table-responsive"
                    style={{
                      maxHeight: "700px", // Set the maximum height for the scrollable area
                      overflowY: "auto", // Enable vertical scrolling
                    }}
                  >
                    <table className="table table-bordered table-striped">
                      <thead className="table-light">
                        <tr>
                          <th>Period Month</th>
                          <th>Element Name</th>
                          <th>Amount</th>
                          <th>Paid Amount</th>
                          <th>Update Amount</th>
                          <th>Update</th>
                          <th>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feeStructure.length > 0 ? (
                          feeStructure.map((item) => (
                            <tr
                              key={item.id}
                              style={{
                                opacity: item.paid_amount > "0.00" ? 0.5 : 1,
                              }}
                            >
                              <td>{item.semester}</td>
                              <td>{item.element_name}</td>
                              <td>{item.total_element_period_amount}</td>
                              <td>{item.paid_amount}</td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control detail"
                                  value={item.total_element_period_amount}
                                  disabled={parseFloat(item.paid_amount) > 0}
                                  onChange={(e) =>
                                    handleFeeStructureAmountChange(
                                      item.id,
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={item.updateflag || false}
                                  disabled={parseFloat(item.paid_amount) > 0}
                                  onChange={(e) =>
                                    handleFeeStructureUpdateCheckbox(
                                      item.id,
                                      e.target.checked
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={item.removeflag || false}
                                  disabled={parseFloat(item.paid_amount) > 0}
                                  onChange={(e) =>
                                    handleFeeStructureRemoveCheckbox(
                                      item.id,
                                      e.target.checked
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7">No fee structure data available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-section">
                    <h5>Elements</h5>
                    <Table bordered responsive>
                      <thead>
                        <tr>
                          <th>Element Name</th>
                          <th>Element Amount</th>
                          <th>Update Amount</th>
                          <th>Update</th>
                          <th>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {unpaidElements.length > 0 ? (
                          unpaidElements.map((item, index) => (
                            <tr key={index}>
                              {" "}
                              {/* Use index if item.id is undefined */}
                              <td>{item.element_name}</td>{" "}
                              {/* Ensure `element_name` is available */}
                              <td>{item.total_element_period_amount}</td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control detail"
                                  value={item.updateamount || ""}
                                  // Only editable if checkbox selected
                                  onChange={(e) => {
                                    const newValue = e.target.value;
                                    setUnpaidElements((prev) =>
                                      prev.map((detail) =>
                                        detail.id === item.id
                                          ? {
                                            ...detail,
                                            updateamount: newValue,
                                          }
                                          : detail
                                      )
                                    );
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={item.updateflag}
                                  onChange={(e) =>
                                    handleUpdateCheckboxChange(
                                      item.id,
                                      e.target.checked,
                                      item.updateamount,
                                      item.element_name
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={item.removeflag}
                                  onChange={(e) =>
                                    handleRemoveCheckboxChange(
                                      item.id,
                                      e.target.checked,
                                      item.element_name
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7">No unpaid elements found</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>

                  {/* Add Fee Elements Section */}
                  <div
                    className="form-section"
                    style={{
                      border: "1px solid #808080",
                      padding: "20px",
                      margin: "20px 0",
                    }}
                  >
                    <h5>Add Fee Elements</h5>

                    <div className="row g-3">
                      {/* Left Side Fields */}
                      <div className="col-md-6">
                        {/* Element */}
                        <div className="mb-3">
                          <label className="form-label">Element</label>
                          <Select
                            options={elementNameOptions}
                            className="detail"
                            value={
                              elementNameOptions.find(
                                (option) =>
                                  option.value === feeElement.element_type_id
                              ) || null
                            }
                            onChange={(option) =>
                              setFeeElement((prev) => ({
                                ...prev,
                                element_type_id: option.value,
                                name: option.label,
                              }))
                            }
                          />
                        </div>

                        {/* Frequency */}
                        <div className="mb-3">
                          <label className="form-label">Frequency</label>
                          <Select
                            options={frequencyOptions}
                            className="detail"
                            isDisabled={
                              !selectedSession?.value || !selectedCourse?.value
                            }
                            value={
                              frequencyOptions.find(
                                (option) =>
                                  option.value === feeElement.frequency
                              ) || null
                            }
                            onChange={handleFrequencyChange}
                          />
                        </div>

                        {/* Amount */}
                        <div className="mb-3">
                          <label className="form-label">Amount</label>
                          <input
                            type="text"
                            className="form-control detail"
                            placeholder="Amount"
                            value={feeElement.amount}
                            onChange={(e) =>
                              setFeeElement((prev) => ({
                                ...prev,
                                amount:
                                  e.target.value === ""
                                    ? ""
                                    : parseFloat(e.target.value),
                              }))
                            }
                          />
                        </div>

                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleAddFeeElement}
                        >
                          Add
                        </button>
                      </div>

                      {/* Semesters Section */}
                      {visibleSemesters > 0 && (
                        <div className="col-md-6">
                          <h6>Semester</h6>
                          <div className="row g-3">
                            {Array.from({ length: visibleSemesters }).map(
                              (_, idx) => (
                                <div className="col-md-6 mb-3" key={idx}>
                                  <label className="form-label">
                                    Semester{idx + 1}
                                  </label>
                                  <Select
                                    className="detail"
                                    options={
                                      Array.isArray(semesterOptions)
                                        ? semesterOptions
                                        : []
                                    }
                                    value={
                                      (Array.isArray(semesterOptions) &&
                                        semesterOptions.find(
                                          (opt) =>
                                            String(opt.value) ===
                                            String(
                                              feeElement.semesters?.[idx] ?? ""
                                            )
                                        )) ||
                                      null
                                    }
                                    onChange={(opt) => {
                                      const updated = Array.from({
                                        length: visibleSemesters,
                                      }).map(
                                        (_, i) =>
                                          feeElement.semesters?.[i] ?? ""
                                      );
                                      updated[idx] = opt ? opt.value : "";
                                      setFeeElement((prev) => ({
                                        ...prev,
                                        semesters: updated,
                                      }));
                                    }}
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Second Table for Added Fee Elements */}
                </div>

                <div className="additional-element-table">
                  <h5>Additional Element Details</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>Sl. No.</th>
                          <th>Element Name</th>
                          <th>Element Frequency</th>
                          <th>Amount</th>
                          {Array.from({ length: visibleSemesters }).map(
                            (_, idx) => (
                              <th key={idx}>Period {idx + 1}</th>
                            )
                          )}
                          <th>Remove</th> {/* ADD THIS */}
                        </tr>
                      </thead>

                      <tbody>
                        {Array.isArray(addedFeeElements) &&
                          addedFeeElements.length > 0 ? (
                          addedFeeElements.map((element, idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>{element.name}</td>
                              <td>{element.frequencyName}</td>
                              <td>{element.amount}</td>

                              {Array.from({ length: visibleSemesters }).map(
                                (_, pIdx) => {
                                  const safeSemesterOptions = Array.isArray(
                                    semesterOptions
                                  )
                                    ? semesterOptions
                                    : [];
                                  const periodsArray = Array.isArray(
                                    element.periods
                                  )
                                    ? element.periods
                                    : [];
                                  const periodVal = periodsArray[pIdx] ?? "";
                                  const periodName =
                                    safeSemesterOptions.find(
                                      (opt) =>
                                        String(opt.value) === String(periodVal)
                                    )?.label ?? "";
                                  return <td key={pIdx}>{periodName}</td>;
                                }
                              )}

                              <td>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() =>
                                    setAddedFeeElements((prev) =>
                                      prev.filter((_, i) => i !== idx)
                                    )
                                  }
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4 + visibleSemesters}>
                              No elements added
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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

export default StudentFee;