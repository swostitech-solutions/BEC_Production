import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";
import Select from "react-select";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";
import useFetchBranch from "../../hooks/useFetchBranch";
import useFetchAcademicYearByFilter from "../../hooks/useFetchAcademicYearByFilter";
import useFetchSemesterByFilter from "../../hooks/useFetchSemesterByFilter";
import useFetchSectionByFilter from "../../hooks/useFetchSectionByFilter";

const AdmTeacherTimeTable = () => {
  // Get org and branch from sessionStorage
  const organizationId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [timeTableData, setTimeTableData] = useState([]);
  const [organizedData, setOrganizedData] = useState([]);

  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sessionOptions, setSessionOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);

  // Fetch dropdown data using hooks
  const { BatchList } = useFetchSessionList(organizationId, branchId);
  const { CourseList } = useFetchCourseByFilter(organizationId, selectedSession?.value);
  const { BranchList } = useFetchBranch(
    organizationId,
    branchId,
    selectedSession?.value,
    selectedCourse?.value
  );
  const { AcademicYearList } = useFetchAcademicYearByFilter(
    organizationId,
    branchId,
    selectedSession?.value,
    selectedCourse?.value,
    selectedBranch?.value
  );
  const { SemesterList } = useFetchSemesterByFilter(
    organizationId,
    branchId,
    selectedSession?.value,
    selectedCourse?.value,
    selectedBranch?.value,
    selectedAcademicYear?.value
  );
  const { SectionList } = useFetchSectionByFilter(
    organizationId,
    branchId,
    selectedSession?.value,
    selectedCourse?.value,
    selectedBranch?.value,
    selectedAcademicYear?.value,
    selectedSemester?.value
  );

  // Debug: Log selected values
  useEffect(() => {
    console.log("🔍 Teacher TT Selected values:", {
      session: selectedSession,
      course: selectedCourse,
      branch: selectedBranch,
      academicYear: selectedAcademicYear,
      semester: selectedSemester,
      section: selectedSection,
      subject: selectedSubject,
    });
  }, [selectedSession, selectedCourse, selectedBranch, selectedAcademicYear, selectedSemester, selectedSection, selectedSubject]);

  // Populate Session dropdown
  useEffect(() => {
    if (BatchList && BatchList.length > 0) {
      const options = BatchList.map((batch) => ({
        value: batch.id,
        label: batch.batch_description || batch.batch_code || batch.batch_name || batch.name,
      }));
      setSessionOptions([{ value: "", label: "Select Session" }, ...options]);
    } else {
      setSessionOptions([{ value: "", label: "Select Session" }]);
    }
  }, [BatchList]);

  // Populate Course dropdown
  useEffect(() => {
    if (CourseList && CourseList.length > 0) {
      const options = CourseList.map((course) => ({
        value: course.id,
        label: course.coursename || course.course_name || course.name,
      }));
      setCourseOptions([{ value: "", label: "Select Course" }, ...options]);
    } else {
      setCourseOptions([{ value: "", label: "Select Course" }]);
    }
  }, [CourseList]);

  // Populate Branch dropdown
  useEffect(() => {
    if (BranchList && BranchList.length > 0) {
      const options = BranchList.map((branch) => ({
        value: branch.id,
        label: branch.department_description || branch.department_code || branch.department_name || branch.name,
      }));
      setBranchOptions([{ value: "", label: "Select Branch" }, ...options]);
    } else {
      setBranchOptions([{ value: "", label: "Select Branch" }]);
    }
  }, [BranchList]);

  // Populate Academic Year dropdown
  useEffect(() => {
    if (AcademicYearList && AcademicYearList.length > 0) {
      const options = AcademicYearList.map((year) => ({
        value: year.id,
        label: year.academic_year_description || year.academic_year_code || year.academic_year_name || year.name,
      }));
      setAcademicYearOptions([{ value: "", label: "Select Academic Year" }, ...options]);
    } else {
      setAcademicYearOptions([{ value: "", label: "Select Academic Year" }]);
    }
  }, [AcademicYearList]);

  // Populate Semester dropdown
  useEffect(() => {
    if (SemesterList && SemesterList.length > 0) {
      const options = SemesterList.map((sem) => ({
        value: sem.id,
        label: sem.semester_description || sem.semester_code || sem.semester_name || sem.name || sem.term_desc,
      }));
      setSemesterOptions([{ value: "", label: "Select Semester" }, ...options]);
    } else {
      setSemesterOptions([{ value: "", label: "Select Semester" }]);
    }
  }, [SemesterList]);

  // Populate Section dropdown
  useEffect(() => {
    console.log("SectionList updated:", SectionList);
    if (SectionList && SectionList.length > 0) {
      const options = SectionList.map((section) => ({
        value: section.id,
        label: section.section_description || section.section_code || section.section_name || section.sectionname || section.name,
      }));
      setSectionOptions([{ value: "", label: "Select Section" }, ...options]);
      console.log("Section options set:", options);
    } else {
      console.log("No Section data available yet");
      setSectionOptions([{ value: "", label: "Select Section" }]);
    }
  }, [SectionList]);

  // Fetch Teachers/Mentors
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        if (!organizationId || !branchId) {
          console.error("Missing organization_id or branch_id in sessionStorage");
          return;
        }

        const response = await fetch(
          `${ApiUrl.apiurl}Teacher/GetEmployeeList/?orgId=${organizationId}&branchId=${branchId}`
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
  }, [organizationId, branchId]);

  // Fetch Subjects based on Course and Semester (with all required dependencies)
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedSession || !selectedCourse || !selectedBranch || !selectedAcademicYear || !selectedSemester) {
        console.log("Subject fetch waiting for dependencies");
        setSubjectOptions([{ value: "", label: "Select Subject" }]);
        return;
      }

      const searchParams = new URLSearchParams({
        organization_id: organizationId,
        branch_id: branchId,
        batch_id: selectedSession.value,
        course_id: selectedCourse.value,
        department_id: selectedBranch.value,
        academic_year_id: selectedAcademicYear.value,
        semester_id: selectedSemester.value,
        subject_group_id: 1,
      });

      try {
        const apiUrl = `${ApiUrl.apiurl}Subjects/GetSubjectListBasedOnCourseAndSemester/?${searchParams}`;
        console.log("Fetching Subjects from:", apiUrl);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Subject API Response:", data);

        if (data && data.data && Array.isArray(data.data)) {
          const options = data.data.map((subject) => ({
            value: subject.id,
            label: subject.subject_name || subject.subjectcode || subject.name,
          }));
          setSubjectOptions([
            { value: "", label: "Select Subject" },
            ...options,
          ]);
          console.log("Subject options set:", options);
        } else {
          console.log("No subjects found in response");
          setSubjectOptions([{ value: "", label: "Select Subject" }]);
        }
      } catch (error) {
        console.error("Error fetching subject data:", error);
        setSubjectOptions([{ value: "", label: "Select Subject" }]);
      }
    };

    fetchSubjects();
  }, [selectedSession, selectedCourse, selectedBranch, selectedAcademicYear, selectedSemester, organizationId, branchId]);


  // useEffect(() => {
  //   fetchTimeTableData();
  // }, []);

  // const fetchTimeTableData = async () => {
  //   try {
  //     const orgId = localStorage.getItem("orgId") || "";
  //     const branchId = localStorage.getItem("branchId") || "";
  //     const academicYearId = localStorage.getItem("academicSessionId") || "";

  //     const response = await fetch(
  //       `${ApiUrl.apiurl}TIME_TABLE/GetSearchedTimeTableList/?academic_year_id=${academicYearId}&org_id=${orgId}&branch_id=${branchId}`
  //     );
  //     const data = await response.json();

  //     if (data.message === "success" && Array.isArray(data.data)) {
  //       setTimeTableData(data.data);
  //     } else {
  //       setTimeTableData([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching timetable data:", error);
  //     setTimeTableData([]);
  //   }
  // };

  // Days of the week for the table header

  // Generate calendar on mount
  useEffect(() => {
    generateCalendar();
  }, []);

  const generateCalendar = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    let calendar = [];
    let week = new Array(7).fill(null);

    for (let i = 0; i < firstDay.getDay(); i++) {
      week[i] = null; // Empty cells before the first day
    }

    for (let date = 1; date <= lastDay.getDate(); date++) {
      const dayOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        date
      ).getDay();
      week[dayOfWeek] = { date, dayOfWeek }; // Store date and day index

      if (dayOfWeek === 6 || date === lastDay.getDate()) {
        calendar.push(week);
        week = new Array(7).fill(null);
      }
    }

    setOrganizedData(calendar);
  };

  // Fetch timetable when teacher or filters change
  useEffect(() => {
    const fetchTimeTableData = async () => {
      if (!selectedMentor) {
        setTimeTableData([]);
        return;
      }

      try {
        const params = new URLSearchParams({
          organization_id: organizationId,
          branch_id: branchId,
        });

        // Add optional filters using correct backend parameter names
        if (selectedSession?.value) params.append("batch_id", selectedSession.value);
        if (selectedCourse?.value) params.append("course_id", selectedCourse.value);
        if (selectedBranch?.value) params.append("department_id", selectedBranch.value);
        if (selectedAcademicYear?.value) params.append("academic_year_id", selectedAcademicYear.value);
        if (selectedSemester?.value) params.append("semester_id", selectedSemester.value);
        if (selectedSection?.value) params.append("section_id", selectedSection.value);
        if (selectedMentor?.value) params.append("professor_id", selectedMentor.value);
        if (selectedSubject?.value) params.append("subject_id", selectedSubject.value);

        const response = await fetch(
          `${ApiUrl.apiurl}TIME_TABLE/GetTimeTableEntryDifSearchBasisList/?${params.toString()}`
        );

        if (!response.ok) {
          console.error(`Teacher Timetable API Error: ${response.status}`);
          setTimeTableData([]);
          return;
        }

        const data = await response.json();
        console.log("Teacher Timetable API Response:", data);
        if (data && data.message === "success" && Array.isArray(data.data)) {
          setTimeTableData(data.data);
        } else {
          setTimeTableData([]);
        }
      } catch (error) {
        console.error("Error fetching timetable data:", error);
        setTimeTableData([]);
      }
    };

    fetchTimeTableData();
  }, [
    selectedMentor,
    selectedSession,
    selectedCourse,
    selectedBranch,
    selectedAcademicYear,
    selectedSemester,
    selectedSection,
    selectedSubject,
    organizationId,
    branchId,
  ]);

  // Convert schedule_day (e.g., "MONDAY") to day index (0 = Sunday, 6 = Saturday)
  const getDayIndex = (day) => {
    return daysOfWeek.findIndex((d) => d.toUpperCase() === day.toUpperCase());
  };

  const daysOfWeek = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  // Organizing data by day
  // const organizedData = daysOfWeek.map((day) =>
  //   timeTableData.filter((entry) => entry.schedule_day === day)
  // );

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
                TEACHER TIME TABLE
              </p>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="teacher" className="form-label">
                          Teacher
                        </label>
                        <Select
                          id="mentor"
                          options={mentors}
                          className="detail"
                          value={selectedMentor}
                          onChange={setSelectedMentor}
                          placeholder="Select Mentor"
                          classNamePrefix="mentor-dropdown"
                        />
                      </div>
                      <div className="col-md-3 ">
                        <label htmlFor="session" className="form-label">
                          Session
                        </label>
                        <Select
                          options={sessionOptions}
                          className="detail"
                          value={selectedSession}
                          onChange={setSelectedSession}
                          placeholder="Select Session"
                          isClearable
                        />
                      </div>
                      <div className="col-md-3 ">
                        <label htmlFor="course" className="form-label">
                          Course
                        </label>
                        <Select
                          options={courseOptions}
                          className="detail"
                          value={selectedCourse}
                          onChange={setSelectedCourse}
                          placeholder="Select Course"
                          isClearable
                        />
                      </div>
                      <div className="col-md-3 ">
                        <label htmlFor="branch" className="form-label">
                          Department
                        </label>
                        <Select
                          options={branchOptions}
                          className="detail"
                          value={selectedBranch}
                          onChange={setSelectedBranch}
                          placeholder="Select Branch"
                          isClearable
                        />
                      </div>
                      <div className="col-md-3 ">
                        <label htmlFor="academicYear" className="form-label">
                          Academic Year
                        </label>
                        <Select
                          options={academicYearOptions}
                          className="detail"
                          value={selectedAcademicYear}
                          onChange={setSelectedAcademicYear}
                          placeholder="Select Academic Year"
                          isClearable
                        />
                      </div>
                      <div className="col-md-3 ">
                        <label htmlFor="semester" className="form-label">
                          Semester
                        </label>
                        <Select
                          options={semesterOptions}
                          className="detail"
                          value={selectedSemester}
                          onChange={setSelectedSemester}
                          placeholder="Select Semester"
                          isClearable
                        />
                      </div>

                      <div className="col-md-3">
                        <label htmlFor="section" className="form-label">
                          Section
                        </label>
                        <Select
                          options={sectionOptions}
                          className="detail"
                          classNamePrefix="section-dropdown"
                          placeholder="Select Section"
                          isDisabled={!selectedSemester}
                          value={selectedSection}
                          onChange={setSelectedSection}
                          isClearable
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="subject" className="form-label">
                          Subject
                        </label>
                        <Select
                          options={subjectOptions}
                          className="detail"
                          classNamePrefix="subject-dropdown"
                          placeholder="Select Subject"
                          isDisabled={!selectedSemester}
                          value={selectedSubject}
                          onChange={setSelectedSubject}
                          isClearable
                        />
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
                        {daysOfWeek.map((day) => (
                          <th
                            key={day}
                            className="text-center bg-primary text-white"
                          >
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {organizedData.map((week, i) => (
                        <tr key={i}>
                          {week.map((cell, j) => (
                            <td
                              key={j}
                              className="text-center"
                              style={{ minHeight: "100px" }}
                            >
                              {cell ? <strong>{cell.date}</strong> : ""}
                              <div>
                                {cell &&
                                  timeTableData
                                    .filter(
                                      (entry) =>
                                        getDayIndex(entry.day) ===
                                        cell.dayOfWeek
                                    )
                                    .map((entry, index) => (
                                      <div key={index} className="p-1 border mt-1 bg-light">
                                        <strong>Course:</strong> {entry.course}<br />
                                        <strong>Department:</strong> {entry.department}<br />
                                        <strong>Section:</strong> {entry.section}<br />
                                        <strong>Period:</strong> {entry.lecture_period}<br />
                                        <strong>Subject:</strong> {entry.subject}<br />
                                        <strong>Teacher:</strong> {entry.professor}<br />
                                        <strong>Semester:</strong> {entry.semester}
                                      </div>
                                    ))}
                                {cell && timeTableData.filter(
                                  (entry) => getDayIndex(entry.day) === cell.dayOfWeek
                                ).length === 0 && (
                                    <div className="text-muted mt-2">No classes</div>
                                  )}
                              </div>
                            </td>
                          ))}
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

export default AdmTeacherTimeTable;
