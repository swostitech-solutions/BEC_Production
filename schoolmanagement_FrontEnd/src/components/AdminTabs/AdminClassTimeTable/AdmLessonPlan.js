import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "./AdmLessonPlan.css";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";

const AdmLessonPlan = () => {
  const navigate = useNavigate();

  // Get org and branch from sessionStorage
  const organizationId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");

  // Dropdown States - MUST be defined before hooks
  const [sessionOptions, setSessionOptions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [branchOptions, setBranchOptions] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);

  const [semesterOptions, setSemesterOptions] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);

  const [sectionOptions, setSectionOptions] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);

  const [subjectOptions, setSubjectOptions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [topicOptions, setTopicOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [rowErrors, setRowErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");

  // Custom Hooks with dependencies
  const { BatchList, loading: loadingBatch } = useFetchSessionList(organizationId, branchId);
  const { CourseList, loading: loadingCourse } = useFetchCourseByFilter(
    organizationId,
    selectedSession?.value
  );
  const { BranchList, loading: loadingDept } = useFetchBranch(
    organizationId,
    branchId,
    selectedSession?.value,
    selectedCourse?.value
  );
  const { AcademicYearList, loading: loadingAY } = useFetchAcademicYearByFilter(
    organizationId,
    branchId,
    selectedSession?.value,
    selectedCourse?.value,
    selectedBranch?.value
  );
  const { SemesterList, loading: loadingSem } = useFetchSemesterByFilter(
    organizationId,
    branchId,
    selectedSession?.value,
    selectedCourse?.value,
    selectedBranch?.value,
    selectedAcademicYear?.value
  );
  const { SectionList, loading: loadingSec } = useFetchSectionByFilter(
    organizationId,
    branchId,
    selectedSession?.value,
    selectedCourse?.value,
    selectedBranch?.value,
    selectedAcademicYear?.value,
    selectedSemester?.value
  );

  const [rows, setRows] = useState([
    { lectureNo: "", moduleNo: "", topic: "", proposedDate: "" },
  ]);

  // State for filters

  const dateFromRef = useRef(null);
  const dateToRef = useRef(null);
  const messageTypeRef = useRef(null);
  const studentNameRef = useRef(null);
  const initiatedByRef = useRef(null);
  const sectionRef = useRef(null);
  const classRef = useRef(null);

  const handleClear = () => {
    if (dateFromRef.current) dateFromRef.current.value = "";
    if (dateToRef.current) dateToRef.current.value = "";
    if (messageTypeRef.current) messageTypeRef.current.value = "";
    if (studentNameRef.current) studentNameRef.current.value = "";
    if (initiatedByRef.current) initiatedByRef.current.value = "";
    if (sectionRef.current) sectionRef.current.value = "";
    if (classRef.current) classRef.current.value = "";

    // Reset state values if using controlled components
    setSelectedSession(null);
    setSelectedCourse(null);
    setSelectedBranch(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
    setSelectedSubject(null);
    setSelectedMentor(null);
    setRows([{ lectureNo: "", moduleNo: "", topic: "", proposedDate: "" }]);
    setErrors({});
    setRowErrors({});
    setStatusMessage("");
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      { lectureNo: "", moduleNo: "", topic: "", proposedDate: "" },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
    setRowErrors((prev) => ({
      ...prev,
      [index]: {
        ...(prev[index] || {}),
        [field]: "",
      },
    }));
  };

  // Populate Session dropdown
  useEffect(() => {
    if (BatchList && BatchList.length > 0) {
      console.log("Populating Session dropdown with:", BatchList);
      const options = BatchList.map((batch) => ({
        value: batch.id,
        label: batch.batch_description || batch.batch_code || batch.batch_name || batch.name,
      }));
      setSessionOptions(options);
      console.log("Session options set:", options);
    } else {
      setSessionOptions([]);
    }
  }, [BatchList]);

  // Populate Course dropdown
  useEffect(() => {
    if (CourseList && CourseList.length > 0) {
      console.log("Populating Course dropdown with:", CourseList);
      const options = CourseList.map((course) => ({
        value: course.id,
        label: course.coursename || course.course_name || course.name,
      }));
      setCourseOptions(options);
      console.log("Course options set:", options);
    } else {
      setCourseOptions([]);
    }
  }, [CourseList]);

  // Populate Branch dropdown
  useEffect(() => {
    if (BranchList && BranchList.length > 0) {
      console.log("Populating Branch dropdown with:", BranchList);
      const options = BranchList.map((branch) => ({
        value: branch.id,
        label: branch.department_description || branch.department_code || branch.department_name || branch.name,
      }));
      setBranchOptions(options);
      console.log("Branch options set:", options);
    } else {
      setBranchOptions([]);
    }
  }, [BranchList]);

  // Populate Academic Year dropdown
  useEffect(() => {
    if (AcademicYearList && AcademicYearList.length > 0) {
      console.log("Populating Academic Year dropdown with:", AcademicYearList);
      const options = AcademicYearList.map((year) => ({
        value: year.id,
        label: year.academic_year_description || year.academic_year_code || year.academic_year_desc || year.name,
      }));
      setAcademicYearOptions(options);
      console.log("Academic Year options set:", options);
    } else {
      setAcademicYearOptions([]);
    }
  }, [AcademicYearList]);

  // Populate Semester dropdown
  useEffect(() => {
    if (SemesterList && SemesterList.length > 0) {
      console.log("Populating Semester dropdown with:", SemesterList);
      const options = SemesterList.map((semester) => ({
        value: semester.id,
        label: semester.semester_description || semester.semester_code || semester.term_desc || semester.name,
      }));
      setSemesterOptions(options);
      console.log("Semester options set:", options);
    } else {
      setSemesterOptions([]);
    }
  }, [SemesterList]);

  // Populate Section dropdown
  useEffect(() => {
    if (SectionList && SectionList.length > 0) {
      console.log("Populating Section dropdown with:", SectionList);
      const options = SectionList.map((section) => ({
        value: section.id,
        label: section.section_description || section.section_code || section.sectionname || section.name,
      }));
      setSectionOptions(options);
      console.log("Section options set:", options);
    } else {
      setSectionOptions([]);
    }
  }, [SectionList]);

  useEffect(() => {
    if (!selectedSemester) {
      setSelectedSection(null);
      return;
    }

    if (!Array.isArray(sectionOptions) || sectionOptions.length === 0) {
      return;
    }

    const hasSelected = selectedSection?.value
      ? sectionOptions.some(
          (section) => Number(section.value) === Number(selectedSection.value)
        )
      : false;

    if (hasSelected) {
      return;
    }

    setSelectedSection(sectionOptions[0]);
  }, [selectedSemester, sectionOptions]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const orgId = sessionStorage.getItem("organization_id");
        const branchId = sessionStorage.getItem("branch_id");

        if (!orgId || !branchId) {
          console.error("Missing organization_id or branch_id in sessionStorage");
          return;
        }

        const response = await fetch(
          `${ApiUrl.apiurl}Teacher/GetEmployeeList/?orgId=${orgId}&branchId=${branchId}`
        );
        const data = await response.json();
        if (data && data.data) {
          const formattedMentors = data.data.map((mentor) => ({
            value: mentor.id,
            label: mentor.employeeName,
          }));
          setMentors(formattedMentors);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };

    fetchMentors();
  }, []);

  // Fetch Subjects - requires all dropdown selections
  useEffect(() => {
    const fetchSubjects = async () => {
      const orgId = sessionStorage.getItem("organization_id");
      const branchId = sessionStorage.getItem("branch_id");
      const subjectGroupId = 1;

      if (!selectedSession || !selectedCourse || !selectedBranch || !selectedAcademicYear || !selectedSemester) {
        setSubjectOptions([]);
        return;
      }

      const searchParams = new URLSearchParams({
        organization_id: orgId,
        branch_id: branchId,
        batch_id: selectedSession.value,
        course_id: selectedCourse.value,
        department_id: selectedBranch.value,
        academic_year_id: selectedAcademicYear.value,
        semester_id: selectedSemester.value,
        subject_group_id: subjectGroupId,
      });

      try {
        const response = await fetch(
          `${ApiUrl.apiurl}Subjects/GetSubjectListBasedOnCourseAndSemester/?${searchParams}`
        );
        const data = await response.json();
        console.log("Subjects API Response:", data);

        if (data.message === "success" && data.data) {
          const options = data.data.map((subject) => ({
            value: subject.id,
            label: subject.subjectcode,
          }));
          setSubjectOptions(options);
        } else {
          setSubjectOptions([]);
        }
      } catch (error) {
        console.error("Error fetching subject data:", error);
        setSubjectOptions([]);
      }
    };

    fetchSubjects();
  }, [selectedSession, selectedCourse, selectedBranch, selectedAcademicYear, selectedSemester]);

  // Fetch Topics (Lectures) when required filters are selected
  useEffect(() => {
    const fetchTopics = async () => {
      if (!selectedSession || !selectedCourse || !selectedBranch || !selectedAcademicYear || !selectedSemester || !selectedSection || !selectedSubject) {
        setTopicOptions([]);
        return;
      }

      const orgId = sessionStorage.getItem("organization_id");
      const branchId = sessionStorage.getItem("branch_id");

      const params = new URLSearchParams({
        organization_id: orgId,
        branch_id: branchId,
        batch_id: selectedSession.value,
        course_id: selectedCourse.value,
        department_id: selectedBranch.value,
        academic_year_id: selectedAcademicYear.value,
        semester_id: selectedSemester.value,
        section_id: selectedSection.value,
        subject_id: selectedSubject.value,
      });

      try {
        console.log("Fetching Topics from:", `${ApiUrl.apiurl}LECTURE_PLAN/GetLectureList/?${params.toString()}`);
        const response = await fetch(
          `${ApiUrl.apiurl}LECTURE_PLAN/GetLectureList/?${params.toString()}`
        );

        if (!response.ok) {
          console.error(`Topics API Error: ${response.status} ${response.statusText}`);
          setTopicOptions([{ value: "", label: "Select Topic" }]);
          return;
        }

        const text = await response.text();
        console.log("Topics API Raw Response:", text);

        if (!text || text.trim() === "") {
          console.log("Empty response from Topics API - no topics configured");
          setTopicOptions([{ value: "", label: "No Topics Available" }]);
          return;
        }

        const data = JSON.parse(text);
        console.log("Topics API Response:", data);

        if (data.message === "success" && data.data && data.data.length > 0) {
          const options = data.data.map((topic) => ({
            value: topic.topicId,
            label: topic.topic_name,
          }));
          setTopicOptions([{ value: "", label: "Select Topic" }, ...options]);
        } else {
          setTopicOptions([{ value: "", label: "Select Topic" }]);
        }
      } catch (error) {
        console.error("Error fetching topic data:", error);
        setTopicOptions([{ value: "", label: "Select Topic" }]);
      }
    };

    fetchTopics();
  }, [selectedSession, selectedCourse, selectedBranch, selectedAcademicYear, selectedSemester, selectedSection, selectedSubject]);


  const handleSave = async () => {
    const orgId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");
    const userId = sessionStorage.getItem("userId");

    const newErrors = {};
    if (!selectedMentor) newErrors.teacher = "Teacher is required.";
    if (!selectedSession) newErrors.session = "Session is required.";
    if (!selectedCourse) newErrors.course = "Course is required.";
    if (!selectedBranch) newErrors.branch = "Department is required.";
    if (!selectedAcademicYear) newErrors.academicYear = "Academic Year is required.";
    if (!selectedSemester) newErrors.semester = "Semester is required.";
    if (!selectedSection) newErrors.section = "Section is required.";
    if (!selectedSubject) newErrors.subject = "Subject is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStatusMessage("");

    const newRowErrors = {};
    rows.forEach((row, index) => {
      const hasAnyValue = row.lectureNo || row.moduleNo || row.topic || row.proposedDate;
      if (hasAnyValue || rows.length === 1) {
        const rowError = {};
        if (!row.lectureNo) rowError.lectureNo = "Lecture No is required.";
        if (!row.moduleNo) rowError.moduleNo = "Module No is required.";
        if (!row.topic) rowError.topic = "Topic is required.";
        if (!row.proposedDate) rowError.proposedDate = "Proposed Date is required.";
        if (Object.keys(rowError).length > 0) {
          newRowErrors[index] = rowError;
        }
      }
    });

    if (Object.keys(newRowErrors).length > 0) {
      setRowErrors(newRowErrors);
      return;
    }

    setRowErrors({});

    const validRows = rows.filter(
      (row) => row.lectureNo && row.moduleNo && row.topic && row.proposedDate
    );

    if (validRows.length === 0) {
      setStatusMessage("Error: Please enter at least one complete row.");
      return;
    }

    const payload = {
      organization_id: parseInt(orgId),
      branch_id: parseInt(branchId),
      batch_id: selectedSession.value,
      course_id: selectedCourse.value,
      department_id: selectedBranch.value,
      academic_year_id: selectedAcademicYear.value,
      semester_id: selectedSemester.value,
      section_id: selectedSection.value,
      subject_id: selectedSubject.value,
      professor_id: selectedMentor.value,
      lecture_details: validRows.map((row) => ({
        lecture_no: parseInt(row.lectureNo),
        module_no: parseInt(row.moduleNo),
        topic_id: parseInt(row.topic),
        propose_date: row.proposedDate,
      })),
      created_by: parseInt(userId),
    };

    console.log("Save Payload:", payload);

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}LECTURE_PLAN/LecturePlanCreate/?organization_id=${orgId}&branch_id=${branchId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("Response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        setStatusMessage(`Error: Failed to create lesson plan. Server error: ${response.status}`);
        return;
      }

      const result = await response.json();
      console.log("Save Response:", result);

      if (result.message === "success" || result.message?.toLowerCase().includes("successfully")) {
        setStatusMessage("Lesson Plan Created Successfully!");

        // Reset the form
        setSelectedSession(null);
        setSelectedCourse(null);
        setSelectedBranch(null);
        setSelectedAcademicYear(null);
        setSelectedSemester(null);
        setSelectedSection(null);
        setSelectedSubject(null);
        setSelectedMentor(null);
        setRows([{ lectureNo: "", moduleNo: "", topic: "", proposedDate: "" }]);
      } else {
        setStatusMessage("Error: Failed to create lesson plan: " + (result.error || result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving lesson plan:", error);
      setStatusMessage("Error: Error saving lesson plan: " + error.message);
    }
  };


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <p
                style={{
                  marginBottom: "10px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                LESSON PLAN
              </p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    style={{ width: "150px" }}
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
                {statusMessage && (
                  <div className={`mt-2 small ${statusMessage.startsWith("Error:") ? "text-danger" : "text-success"}`}>
                    {statusMessage}
                  </div>
                )}
              </div>
              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="teacher" className="form-label">
                          Teacher
                        </label>
                        <Select
                          id="teacher"
                          options={mentors}
                          className="detail"
                          value={selectedMentor}
                          onChange={(option) => {
                            setSelectedMentor(option);
                            setErrors((prev) => ({ ...prev, teacher: "" }));
                          }}
                          placeholder="Select Teacher"
                          classNamePrefix="teacher-dropdown"
                        />
                        {errors.teacher && <div className="text-danger small mt-1">{errors.teacher}</div>}
                      </div>

                      <div className="col-md-3 mb-3">
                        <label htmlFor="session" className="form-label">
                          Session
                        </label>
                        <Select
                          id="session"
                          options={sessionOptions}
                          className="detail"
                          value={selectedSession}
                          onChange={(option) => {
                            setSelectedSession(option);
                            setErrors((prev) => ({ ...prev, session: "" }));
                          }}
                          placeholder="Select Session"
                          classNamePrefix="session-dropdown"
                        />
                        {errors.session && <div className="text-danger small mt-1">{errors.session}</div>}
                      </div>

                      <div className="col-md-3 mb-3">
                        <label htmlFor="course" className="form-label">
                          Course
                        </label>
                        <Select
                          id="course"
                          options={courseOptions}
                          className="detail"
                          value={selectedCourse}
                          onChange={(option) => {
                            setSelectedCourse(option);
                            setErrors((prev) => ({ ...prev, course: "" }));
                          }}
                          placeholder="Select Course"
                          classNamePrefix="course-dropdown"
                        />
                        {errors.course && <div className="text-danger small mt-1">{errors.course}</div>}
                      </div>

                      <div className="col-md-3 mb-3">
                        <label htmlFor="branch" className="form-label">
                          Department
                        </label>
                        <Select
                          id="branch"
                          options={branchOptions}
                          className="detail"
                          value={selectedBranch}
                          onChange={(option) => {
                            setSelectedBranch(option);
                            setErrors((prev) => ({ ...prev, branch: "" }));
                          }}
                          placeholder="Select Branch"
                          classNamePrefix="branch-dropdown"
                        />
                        {errors.branch && <div className="text-danger small mt-1">{errors.branch}</div>}
                      </div>

                      <div className="col-md-3 mb-3">
                        <label htmlFor="academicYear" className="form-label">
                          Academic Year
                        </label>
                        <Select
                          id="academicYear"
                          options={academicYearOptions}
                          className="detail"
                          value={selectedAcademicYear}
                          onChange={(option) => {
                            setSelectedAcademicYear(option);
                            setErrors((prev) => ({ ...prev, academicYear: "" }));
                          }}
                          placeholder="Select Academic Year"
                          classNamePrefix="academic-year-dropdown"
                        />
                        {errors.academicYear && <div className="text-danger small mt-1">{errors.academicYear}</div>}
                      </div>

                      <div className="col-md-3 mb-3">
                        <label htmlFor="semester" className="form-label">
                          Semester
                        </label>
                        <Select
                          id="semester"
                          options={semesterOptions}
                          className="detail"
                          value={selectedSemester}
                          onChange={(option) => {
                            setSelectedSemester(option);
                            setErrors((prev) => ({ ...prev, semester: "" }));
                          }}
                          placeholder="Select Semester"
                          classNamePrefix="semester-dropdown"
                        />
                        {errors.semester && <div className="text-danger small mt-1">{errors.semester}</div>}
                      </div>

                      <div className="col-md-3 mb-3">
                        <label htmlFor="section" className="form-label">
                          Section
                        </label>
                        <Select
                          id="section"
                          options={sectionOptions}
                          className="detail"
                          value={selectedSection}
                          onChange={() => {}}
                          placeholder={
                            !selectedSemester
                              ? "Select Semester first"
                              : sectionOptions.length > 0
                                ? "Section auto selected"
                                : "Loading Section..."
                          }
                          classNamePrefix="section-dropdown"
                          isDisabled={true}
                          isClearable={false}
                        />
                        {errors.section && <div className="text-danger small mt-1">{errors.section}</div>}
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="subject" className="form-label">
                          Subject
                        </label>
                        <Select
                          id="subject"
                          options={subjectOptions}
                          className="detail"
                          value={selectedSubject}
                          onChange={(option) => {
                            setSelectedSubject(option);
                            setErrors((prev) => ({ ...prev, subject: "" }));
                          }}
                          placeholder="Select Subject"
                          classNamePrefix="subject-dropdown"
                        />
                        {errors.subject && <div className="text-danger small mt-1">{errors.subject}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Lecture No</th>
                        <th>Module No</th>
                        <th>Topic</th>
                        <th>Proposed Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              className="form-control detail"
                              value={row.lectureNo}
                              onChange={(e) =>
                                handleChange(index, "lectureNo", e.target.value)
                              }
                            />
                            {rowErrors[index]?.lectureNo && (
                              <div className="text-danger small mt-1">{rowErrors[index].lectureNo}</div>
                            )}
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control detail"
                              value={row.moduleNo}
                              onChange={(e) =>
                                handleChange(index, "moduleNo", e.target.value)
                              }
                            />
                            {rowErrors[index]?.moduleNo && (
                              <div className="text-danger small mt-1">{rowErrors[index].moduleNo}</div>
                            )}
                          </td>
                          {/* <td>
                            <select
                              className="detail"
                              value={row.topic}
                              onChange={(e) =>
                                handleChange(index, "topic", e.target.value)
                              }
                              disabled={!selectedSubject}
                            >
                              {topicOptions.map((topic, i) => (
                                <option key={i} value={topic.value}>
                                  {topic.label}
                                </option>
                              ))}
                            </select>
                          </td> */}

                          <td>
                            <select
                              className="detail topic-select"
                              value={row.topic}
                              onChange={(e) =>
                                handleChange(index, "topic", e.target.value)
                              }
                              disabled={!selectedSubject}
                            >
                              {topicOptions.map((topic, i) => (
                                <option key={i} value={topic.value}>
                                  {topic.label}
                                </option>
                              ))}
                            </select>
                            {rowErrors[index]?.topic && (
                              <div className="text-danger small mt-1">{rowErrors[index].topic}</div>
                            )}
                          </td>

                          <td>
                            <input
                              type="date"
                              className="form-control detail"
                              value={row.proposedDate}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "proposedDate",
                                  e.target.value
                                )
                              }
                            />
                            {rowErrors[index]?.proposedDate && (
                              <div className="text-danger small mt-1">{rowErrors[index].proposedDate}</div>
                            )}
                          </td>
                          <td>
                            {index === rows.length - 1 && (
                              <button
                                className="btn btn-primary"
                                onClick={handleAddRow}
                              >
                                Add
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmLessonPlan;