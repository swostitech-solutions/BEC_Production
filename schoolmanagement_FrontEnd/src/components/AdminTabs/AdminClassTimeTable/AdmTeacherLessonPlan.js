import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";

const AdmTeacherLessonPlan = () => {
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
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [lessonPlanData, setLessonPlanData] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({});  // Track files by row index

  // Custom Hooks with dependencies (matching Lesson Plan page exactly)
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

  // Populate Session dropdown
  useEffect(() => {
    if (BatchList && BatchList.length > 0) {
      console.log("Populating Session dropdown with:", BatchList);
      const options = BatchList.map((session) => ({
        value: session.id,
        label: session.batch_description || session.batch_code || session.batch_name || session.name,
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
        label: course.course_name || course.coursename || course.name,
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
        label: branch.department_description || branch.department_name || branch.name,
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
        label: year.academic_year_description || year.academic_year || year.name,
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
        label: semester.semester_description || semester.semester_name || semester.name,
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

  // Fetch Teachers
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

  // Fetch Subjects - requires all dropdown selections (matching Lesson Plan page)
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
        console.log("Fetching subjects with all parameters");

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
          console.log("Subject options set:", options);
        } else {
          setSubjectOptions([]);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjectOptions([]);
      }
    };

    fetchSubjects();
  }, [selectedSession, selectedCourse, selectedBranch, selectedAcademicYear, selectedSemester]);

  // Fetch Lesson Plan Data - API: GetProfessorLecturePlanList from Postman
  useEffect(() => {
    const fetchLessonPlanData = async () => {
      // Require all 8 dropdowns + teacher selection
      if (
        !selectedMentor ||
        !selectedSession ||
        !selectedCourse ||
        !selectedBranch ||
        !selectedAcademicYear ||
        !selectedSemester ||
        !selectedSection ||
        !selectedSubject
      ) {
        setLessonPlanData([]);
        return;
      }

      const orgId = sessionStorage.getItem("organization_id");
      const branchId = sessionStorage.getItem("branch_id");

      try {
        console.log("Fetching lesson plan data with all parameters");

        // API from Postman: LECTURE_PLAN/GetProfessorLecturePlanList/
        const apiUrl = `${ApiUrl.apiurl}LECTURE_PLAN/GetProfessorLecturePlanList/?organization_id=${orgId}&branch_id=${branchId}&batch_id=${selectedSession.value}&course_id=${selectedCourse.value}&department_id=${selectedBranch.value}&academic_year_id=${selectedAcademicYear.value}&semester_id=${selectedSemester.value}&section_id=${selectedSection.value}&professor_id=${selectedMentor.value}&subject_id=${selectedSubject.value}`;

        console.log("Fetching from:", apiUrl);

        const response = await fetch(apiUrl);
        const responseText = await response.text();

        console.log("Response text:", responseText);

        if (!responseText || responseText.trim() === "") {
          console.log("Empty response from lesson plan API");
          setLessonPlanData([]);
          return;
        }

        const data = JSON.parse(responseText);
        console.log("Lesson Plan Data API response:", data);

        if (data && data.data && Array.isArray(data.data)) {
          setLessonPlanData(data.data);
          console.log("Lesson plan data loaded:", data.data.length, "records");
        } else {
          setLessonPlanData([]);
        }
      } catch (error) {
        console.error("Error fetching lesson plan data:", error);
        setLessonPlanData([]);
      }
    };

    fetchLessonPlanData();
  }, [
    selectedMentor,
    selectedSession,
    selectedCourse,
    selectedBranch,
    selectedAcademicYear,
    selectedSemester,
    selectedSection,
    selectedSubject,
  ]);

  // Initialize updatedData when lessonPlanData changes
  useEffect(() => {
    if (lessonPlanData.length > 0) {
      setUpdatedData(
        lessonPlanData.map((item) => ({
          lecture_plan_id: item.lecture_plan_id || item.LESSON_PLAN_ID,
          taught_date: item.taught_date || item.TaughtDate || "",
          percentage_completed: item.percentage_completed || item.PercentageCompleted || "",
          remarks: item.remarks || "",
          document_file: item.document_file || null,
        }))
      );
    } else {
      setUpdatedData([]);
    }
  }, [lessonPlanData]);

  // Handle input change for each row
  const handleInputChange = (index, field, value) => {
    setUpdatedData((prevData) =>
      prevData.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  // Handle file selection
  const handleFileChange = (index, file) => {
    console.log('File selected for index:', index, 'File:', file);
    setUploadedFiles(prev => ({
      ...prev,
      [index]: file
    }));
  };

  // Handle update API call - API: GetProfessorLecturePlanUpdate from Postman
  const handleUpdate = async (index) => {
    const rowData = updatedData[index];
    if (!rowData) return;

    const { lecture_plan_id, taught_date, percentage_completed, remarks } = rowData;

    if (!taught_date || !percentage_completed || !remarks) {
      alert("Please fill in all fields (Taught Date, % Course Coverage, Remarks) before updating.");
      return;
    }

    const userId = sessionStorage.getItem("userId");
    const orgId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");

    if (!userId) {
      alert("User not logged in. Please log in again.");
      return;
    }

    // Payload structure - use FormData for file upload
    const formData = new FormData();
    formData.append('taught_date', taught_date);
    formData.append('percentage_completed', percentage_completed);
    formData.append('remarks', remarks);
    formData.append('updated_by', parseInt(userId));

    // Add file if uploaded
    if (uploadedFiles[index]) {
      formData.append('document_file', uploadedFiles[index]);
    }

    console.log("Update Payload (FormData):", {
      taught_date,
      percentage_completed,
      remarks,
      updated_by: userId,
      has_file: !!uploadedFiles[index],
      uploadedFiles: uploadedFiles,
      fileAtIndex: uploadedFiles[index]
    });
    console.log("lecture_plan_id:", lecture_plan_id);

    try {
      // API from Postman: LECTURE_PLAN/GetProfessorLecturePlanUpdate/
      const response = await fetch(
        `${ApiUrl.apiurl}LECTURE_PLAN/GetProfessorLecturePlanUpdate/?organization_id=${orgId}&branch_id=${branchId}&lecture_plan_id=${lecture_plan_id}`,
        {
          method: "PUT",
          body: formData,  // Use FormData instead of JSON
        }
      );

      console.log("Update Response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update API Error Response:", errorText);
        alert(`Failed to update. Server error: ${response.status}`);
        return;
      }

      const result = await response.json();
      console.log("Update Response:", result);

      if (result.message === "success") {
        alert("Lesson plan updated successfully!");

        // Refresh the lesson plan data
        const apiUrl = `${ApiUrl.apiurl}LECTURE_PLAN/GetProfessorLecturePlanList/?organization_id=${orgId}&branch_id=${branchId}&batch_id=${selectedSession.value}&course_id=${selectedCourse.value}&department_id=${selectedBranch.value}&academic_year_id=${selectedAcademicYear.value}&semester_id=${selectedSemester.value}&section_id=${selectedSection.value}&professor_id=${selectedMentor.value}&subject_id=${selectedSubject.value}`;

        console.log("Refreshing data from:", apiUrl);

        const refreshResponse = await fetch(apiUrl);
        const refreshText = await refreshResponse.text();

        console.log("Refresh Response Text:", refreshText);

        if (refreshText && refreshText.trim() !== "") {
          const refreshData = JSON.parse(refreshText);
          console.log("Refresh Response Parsed:", refreshData);

          if (refreshData && refreshData.data) {
            setLessonPlanData(refreshData.data);
            // Clear uploaded file for this row after successful update
            setUploadedFiles(prev => {
              const newFiles = { ...prev };
              delete newFiles[index];
              return newFiles;
            });
            console.log("Lesson plan data refreshed successfully");
          }
        }
      } else {
        alert("Failed to update: " + (result.error || result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating lesson plan:", error);
      alert("Error updating lesson plan: " + error.message);
    }
  };

  // Handle Clear button - reset all fields
  const handleClear = () => {
    setSelectedSession(null);
    setSelectedCourse(null);
    setSelectedBranch(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
    setSelectedSubject(null);
    setSelectedMentor(null);
    setLessonPlanData([]);
    setUpdatedData([]);
  };

  // Handle Close button - navigate to dashboard
  const handleClose = () => {
    navigate("/admin/dashboard");
  };

  const handleSessionChange = (selected) => {
    setSelectedSession(selected);
    setSelectedCourse(null);
    setSelectedBranch(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
    setSelectedSubject(null);
  };

  const handleCourseChange = (selected) => {
    setSelectedCourse(selected);
    setSelectedBranch(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
    setSelectedSubject(null);
  };

  const handleBranchChange = (selected) => {
    setSelectedBranch(selected);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
    setSelectedSubject(null);
  };

  const handleAcademicYearChange = (selected) => {
    setSelectedAcademicYear(selected);
    setSelectedSemester(null);
    setSelectedSection(null);
    setSelectedSubject(null);
  };

  const handleSemesterChange = (selected) => {
    setSelectedSemester(selected);
    setSelectedSection(null);
    setSelectedSubject(null);
  };

  const handleSectionChange = (selected) => {
    setSelectedSection(selected);
    setSelectedSubject(null);
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
                TEACHER LESSON PLAN
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
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
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
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
                          onChange={setSelectedMentor}
                          placeholder="Select Teacher"
                          classNamePrefix="teacher-dropdown"
                        />
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
                          onChange={handleSessionChange}
                          placeholder="Select Session"
                          classNamePrefix="session-dropdown"
                        />
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
                          onChange={handleCourseChange}
                          placeholder="Select Course"
                          classNamePrefix="course-dropdown"
                        />
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
                          onChange={handleBranchChange}
                          placeholder="Select Branch"
                          classNamePrefix="branch-dropdown"
                        />
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
                          onChange={handleAcademicYearChange}
                          placeholder="Select Academic Year"
                          classNamePrefix="academicYear-dropdown"
                        />
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
                          onChange={handleSemesterChange}
                          placeholder="Select Semester"
                          classNamePrefix="semester-dropdown"
                        />
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
                          onChange={handleSectionChange}
                          placeholder="Select Section"
                          classNamePrefix="section-dropdown"
                        />
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
                          onChange={setSelectedSubject}
                          placeholder="Select Subject"
                          classNamePrefix="subject-dropdown"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {lessonPlanData.length > 0 && updatedData.length > 0 && (
                <div className="col-12 ">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Lecture No</th>
                          <th>Module No</th>
                          <th>Topics Detail</th>
                          <th>Proposed Date</th>
                          <th>Taught Date</th>
                          <th>% Course Coverage</th>
                          <th>Remarks</th>
                          <th>Document Upload</th>
                          <th>View</th>
                          <th> </th>
                        </tr>
                      </thead>
                      <tbody>
                        {lessonPlanData.map((item, index) => (
                          <tr key={item.lecture_plan_id || index}>
                            <td>{item.lecture_no}</td>
                            <td>{item.module_no}</td>
                            <td>{item.topic_details}</td>
                            <td>{item.proposed_date}</td>
                            <td>
                              <input
                                type="date"
                                className="form-control"
                                value={updatedData[index]?.taught_date || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "taught_date",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={updatedData[index]?.percentage_completed || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "percentage_completed",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={updatedData[index]?.remarks || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "remarks",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="file"
                                className="form-control"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(index, e.target.files[0])}
                              />
                            </td>
                            <td>
                              {item.document_file ? (
                                <a
                                  href={item.document_file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary"
                                  download
                                >
                                  View
                                </a>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              <a
                                href="#"
                                className="text-primary"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleUpdate(index);
                                }}
                              >
                                Update
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmTeacherLessonPlan;

