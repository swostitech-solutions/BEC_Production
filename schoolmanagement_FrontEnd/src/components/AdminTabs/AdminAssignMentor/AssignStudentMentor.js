
import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import SelectStudentMentorModal from "../AdminAssignMentor/StudentMentorModal/SelectStudentMentorModal";
import { ApiUrl } from "../../../ApiUrl";
const AssignStudentMentor = () => {
  const location = useLocation();
  const selectedStudents = location.state?.selectedStudents || [];
  const passedMentor = location.state?.selectedMentor || null;

  console.log("Selected Students (from navigation state):", selectedStudents);
  console.log("Selected Mentor (from navigation state):", passedMentor);

  const [mentors, setMentors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [show, setShow] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [registrationNo, setRegistrationNo] = useState("");
  const [barcode, setBarcode] = useState("");
  const [students, setStudents] = useState([]);
  // const [selectedStudents, setSelectedStudents] = useState([]);
  const navigate = useNavigate();
  const dateRef = useRef(null);
  const fromClassRef = useRef(null);
  const toClassRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);


  // 🔹 On mount, if we were navigated here with only student IDs, fetch their full details
  useEffect(() => {
    const fetchInitialStudents = async () => {
      try {
        if (!selectedStudents || selectedStudents.length === 0) return;

        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");
        const token = localStorage.getItem("accessToken");

        if (!organization_id || !branch_id) {
          console.error(
            "Missing organization_id or branch_id in session storage for initial mentor-student fetch"
          );
          return;
        }

        if (!token) {
          console.error(
            "Missing access token in local storage for initial mentor-student fetch"
          );
          return;
        }

        // Collect unique student_ids from navigation state
        const uniqueIds = Array.from(
          new Set(
            selectedStudents
              .map((s) => s.student_id || s.id)
              .filter((id) => !!id)
          )
        );

        if (uniqueIds.length === 0) {
          console.warn(
            "No valid student_id found in navigation state for AssignStudentMentor"
          );
          return;
        }

        const fetched = [];
        const fetchedStudentIds = new Set(); // Track student_ids within this fetch to avoid duplicates

        for (const sid of uniqueIds) {
          const params = new URLSearchParams({
            organization_id,
            branch_id,
            student_id: String(sid),
          });

          const url = `${ApiUrl.apiurl}StudentCourse/StudentCourseRecordFilter/?${params.toString()}`;
          console.log("Fetching initial mentor student record from:", url);

          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.error(
              `Failed to fetch student course record for student_id=${sid}`,
              response.status
            );
            continue;
          }

          const result = await response.json();

          if (result.message === "success!!" && Array.isArray(result.data)) {
            result.data.forEach((student) => {
              // Get the student_id for deduplication
              const studentId = student.student_id || student.id;
              
              // Skip if we've already added this student_id in this fetch
              if (studentId && fetchedStudentIds.has(studentId)) {
                return;
              }
              
              // Mark this student_id as fetched
              if (studentId) {
                fetchedStudentIds.add(studentId);
              }
              
              // Normalize keys to match table fallback shape
              fetched.push({
                ...student,
                studentname: student.student_name || student.studentname,
                registration_no:
                  student.college_admission_no ||
                  student.enrollment_no ||
                  student.registration_no,
                classname: student.class_name || student.classname,
                sectionname: student.section_name || student.sectionname,
                father_name: student.father_name || student.father_name,
                mother_name: student.mother_name || student.mother_name,
              });
            });
          }
        }

        if (fetched.length > 0) {
          // Check assignments for fetched students
          const studentsWithAssignments = await checkStudentAssignments(fetched);
          
          setStudents((prev) => {
            // Avoid duplicates by student_id - check both prev and fetched
            const existingIds = new Set(
              prev.map(
                (s) =>
                  s.student_id ||
                  s.id ||
                  s.studentBasicDetails?.id
              ).filter(Boolean)
            );
            
            // Only add students that aren't already in prev
            const newStudents = studentsWithAssignments.filter(
              (s) => {
                const sid = s.student_id || s.id;
                return sid && !existingIds.has(sid);
              }
            );
            
            const merged = [...prev, ...newStudents];
            console.log(
              "Initial merged students for AssignStudentMentor:",
              merged
            );
            return merged;
          });
        }
      } catch (error) {
        console.error(
          "Error fetching initial student details for AssignStudentMentor:",
          error
        );
      }
    };

    fetchInitialStudents();
    // Only run on first mount with initial navigation state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClear = () => {
    // Reset form inputs
    setSelectedMentor(null);
    setStudentName("");
    setStudentId("");
    setRegistrationNo("");
    setBarcode("");

    // Reset fetched students
    setStudents([]);

    // Optionally clear modal selection
    setShow(false);
    setShowModal(false);

    // Clear any referenced DOM elements
    if (dateRef.current) dateRef.current.value = "";
    if (fromClassRef.current) fromClassRef.current.value = "";
    if (toClassRef.current) toClassRef.current.value = "";
    if (admissionNoRef.current) admissionNoRef.current.value = "";
    if (barcodeRef.current) barcodeRef.current.value = "";
    if (smsToRef.current) smsToRef.current.checked = false;
  };

  const handleSelectStudent = async (selectedStudentsFromModal) => {
    // Make mentor selection compulsory
    if (!selectedMentor || !selectedMentor.value) {
      alert("Please select a mentor first before adding students.");
      handleClose(); // Close the modal
      return;
    }

    // Handle both single student and array of students
    const studentsArray = Array.isArray(selectedStudentsFromModal) 
      ? selectedStudentsFromModal 
      : [selectedStudentsFromModal];
    
    if (studentsArray.length === 0) return;

    // Normalize students to have consistent structure
    const normalizedStudents = studentsArray.map((s) => {
      const studentId = s.studentBasicDetails?.id || s.student_id || s.id;
      return {
        ...s,
        student_id: studentId,
        id: studentId,
        student_name: s.studentBasicDetails?.student_name || s.student_name || s.studentname,
        studentname: s.studentBasicDetails?.student_name || s.student_name || s.studentname,
        registration_no: s.studentBasicDetails?.school_admission_no || s.fullData?.enrollment_no || s.fullData?.college_admission_no || s.registration_no || s.college_admission_no,
        college_admission_no: s.studentBasicDetails?.school_admission_no || s.fullData?.college_admission_no || s.college_admission_no,
        barcode: s.studentBasicDetails?.barcode || s.barcode,
        classname: s.studentBasicDetails?.classname || s.studentBasicDetails?.course_name || s.classname || s.class_name,
        sectionname: s.studentBasicDetails?.sectionname || s.sectionname || s.section_name,
        father_name: s.studentBasicDetails?.father_name || s.father_name || "",
        mother_name: s.studentBasicDetails?.mother_name || s.mother_name || "",
      };
    });

    // Check assignments for selected students
    const studentsWithAssignments = await checkStudentAssignments(normalizedStudents);

    // Add students to the students state, avoiding duplicates
    setStudents((prev) => {
      const existingIds = new Set(
        prev.map((s) => s.student_id || s.id || s.studentBasicDetails?.id).filter(Boolean)
      );
      
      const newStudents = studentsWithAssignments.filter((s) => {
        const sid = s.student_id || s.id;
        return sid && !existingIds.has(sid);
      });
      
      return [...prev, ...newStudents];
    });

    // Update display name to show count of selected students
    const count = studentsArray.length;
    setStudentName(`${count} student(s) added`);

    handleClose(); // Close the modal
  };

  const handleRemoveStudent = async (studentToRemove) => {
    const studentIdToRemove = studentToRemove.student_id || studentToRemove.id || studentToRemove.studentBasicDetails?.id;
    
    if (!studentIdToRemove) {
      console.warn("Cannot remove student: no valid ID found");
      return;
    }

    // If this is an existing assignment, delete it from the server
    if (studentToRemove.isExistingAssignment && studentToRemove.assignment_id) {
      const confirmation = window.confirm(
        "Are you sure you want to delete this mentor-student assignment?"
      );
      if (!confirmation) return;

      try {
        const token = localStorage.getItem("accessToken");
        const apiUrl = `${ApiUrl.apiurl}Mentor/studentmentorAssign/${studentToRemove.assignment_id}/`;

        console.log("Deleting mentor-student assignment with ID:", studentToRemove.assignment_id);

        const response = await fetch(apiUrl, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const result = await response.json();
        console.log("Delete Response:", result);

        if (response.ok && result.message?.toLowerCase().includes("success")) {
          alert("Assignment deleted successfully!");
          // Remove from UI
          setStudents((prev) => 
            prev.filter((s) => {
              const sid = s.student_id || s.id || s.studentBasicDetails?.id;
              return sid !== studentIdToRemove;
            })
          );
        } else {
          alert(`Failed to delete assignment: ${result.message || result.error || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error deleting assignment:", error);
        alert("An error occurred while deleting the assignment: " + error.message);
      }
    } else {
      // Just remove from local state (not yet assigned)
      setStudents((prev) => 
        prev.filter((s) => {
          const sid = s.student_id || s.id || s.studentBasicDetails?.id;
          return sid !== studentIdToRemove;
        })
      );
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const isStudentNameDisabled = !selectedMentor;

  // Helper function to check if students are already assigned to the selected mentor
  // Uses batching to prevent UI crashes when processing large numbers of students
  const checkStudentAssignments = async (studentList) => {
    if (!studentList || studentList.length === 0) return studentList;
    
    // If no mentor is selected, return students as-is (will show as Pending)
    if (!selectedMentor || !selectedMentor.value) {
      return studentList;
    }

    const organization_id = sessionStorage.getItem("organization_id");
    const branch_id = sessionStorage.getItem("branch_id");
    const academicYearId = localStorage.getItem("academicSessionId");
    const token = localStorage.getItem("accessToken");

    if (!organization_id || !branch_id || !academicYearId) {
      return studentList;
    }

    const selectedMentorId = selectedMentor.value;
    
    // Batch size - process 10 students at a time to prevent overwhelming the browser
    const BATCH_SIZE = 10;
    const batches = [];
    
    // Split students into batches
    for (let i = 0; i < studentList.length; i += BATCH_SIZE) {
      batches.push(studentList.slice(i, i + BATCH_SIZE));
    }

    const updatedStudents = [];

    // Process batches sequentially to avoid overwhelming the browser
    for (const batch of batches) {
      try {
        // Process each batch with Promise.allSettled to handle partial failures gracefully
        const batchResults = await Promise.allSettled(
          batch.map(async (student) => {
            const studentId = student.student_id || student.id || student.studentBasicDetails?.id;
            
            if (!studentId) {
              return student;
            }

            try {
              const params = new URLSearchParams({
                organization_id,
                branch_id,
                academic_year_id: academicYearId,
                student_id: String(studentId),
              });

              const apiUrl = `${ApiUrl.apiurl}Mentor/mentorsWithStudents/?${params.toString()}`;
              
              // Add timeout to prevent hanging requests (5 seconds)
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 5000);
              
              const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                  Authorization: token ? `Bearer ${token}` : "",
                  "Content-Type": "application/json",
                },
                signal: controller.signal,
              });

              clearTimeout(timeoutId);

              if (response.ok) {
                const data = await response.json();
                
                if (data.message === "success" && Array.isArray(data.data) && data.data.length > 0) {
                  // Find if the student is assigned to the SELECTED mentor
                  const mentorWithStudent = data.data.find(
                    (mentor) =>
                      mentor.employee_id === selectedMentorId &&
                      mentor.assigned_students &&
                      mentor.assigned_students.some(
                        (s) => s.student_id === studentId
                      )
                  );

                  if (mentorWithStudent) {
                    const assignedStudent = mentorWithStudent.assigned_students.find(
                      (s) => s.student_id === studentId
                    );

                    if (assignedStudent) {
                      // Student is already assigned to the selected mentor, update with assignment info
                      return {
                        ...student,
                        isExistingAssignment: true,
                        assignment_id: assignedStudent.assignment_id,
                        assignment_date: assignedStudent.assignment_date,
                        status: assignedStudent.status || "ACTIVE",
                        assignedMentor: mentorWithStudent.mentor_name,
                      };
                    }
                  }
                }
              }
            } catch (error) {
              // Handle errors gracefully - don't crash the UI
              if (error.name === 'AbortError') {
                console.warn(`Request timeout for student ${studentId}`);
              } else {
                console.error(`Error checking assignment for student ${studentId}:`, error);
              }
              // Return student as-is on error (will show as Pending)
              return student;
            }

            // If no assignment found to the selected mentor, return student as-is (will show as Pending)
            return student;
          })
        );

        // Extract results from Promise.allSettled - handle both fulfilled and rejected promises
        batchResults.forEach((result, resultIndex) => {
          if (result.status === 'fulfilled') {
            updatedStudents.push(result.value);
          } else {
            // If a promise was rejected, use the original student from the batch to prevent UI crash
            console.error('Promise rejected in batch processing:', result.reason);
            // Use the student at the same index in the batch
            if (batch[resultIndex]) {
              updatedStudents.push(batch[resultIndex]);
            }
          }
        });
      } catch (error) {
        // If entire batch fails, add all students from batch as-is
        console.error('Error processing batch:', error);
        updatedStudents.push(...batch);
      }
    }

    return updatedStudents;
  };

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const branchId = localStorage.getItem("branchId");
        const orgId = localStorage.getItem("orgId");

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

  // Pre-select mentor from navigation state after mentors are loaded
  useEffect(() => {
    if (passedMentor && mentors.length > 0 && !selectedMentor) {
      // Find the mentor in the mentors list that matches the passed mentor
      const mentorToSelect = mentors.find(
        (mentor) => mentor.value === passedMentor.value
      );
      
      if (mentorToSelect) {
        setSelectedMentor(mentorToSelect);
        console.log("Pre-selected mentor from navigation state:", mentorToSelect);
      } else {
        console.warn(
          "Mentor from navigation state not found in mentors list:",
          passedMentor
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentors, passedMentor]);

  // Re-check student assignments when mentor changes
  useEffect(() => {
    const updateStudentAssignments = async () => {
      if (!selectedMentor || !selectedMentor.value || students.length === 0) {
        return;
      }

      // Re-check assignments for all current students with the new mentor
      const updatedStudents = await checkStudentAssignments(students);
      setStudents(updatedStudents);
    };

    updateStudentAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMentor]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Search for existing assignments of the selected mentor
  const handleSearch = async () => {
    if (!selectedMentor || !selectedMentor.value) {
      alert("Please select a mentor to search for their assigned students.");
      return;
    }

    const orgId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");
    const academicYearId = localStorage.getItem("academicSessionId");

    let queryParams = [];
    if (orgId) queryParams.push(`organization_id=${orgId}`);
    if (branchId) queryParams.push(`branch_id=${branchId}`);
    if (academicYearId) queryParams.push(`academic_year_id=${academicYearId}`);

    const apiUrl = `${ApiUrl.apiurl}Mentor/mentorsWithStudents/?${queryParams.join("&")}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.message === "success" && Array.isArray(data.data)) {
        // Filter by selected mentor
        const mentorData = data.data.find(
          (mentor) => mentor.employee_id === selectedMentor.value
        );

        if (mentorData && mentorData.assigned_students && mentorData.assigned_students.length > 0) {
          // Map the assigned students to match our table format
          const assignedStudents = mentorData.assigned_students.map((student) => ({
            student_id: student.student_id,
            student_name: student.student_name,
            registration_no: student.admission_no || student.college_admission_no,
            college_admission_no: student.college_admission_no,
            barcode: student.barcode,
            classname: student.course_name,
            sectionname: student.section_name,
            father_name: student.father_name || "",
            mother_name: student.mother_name || "",
            assignment_id: student.assignment_id,
            assignment_date: student.assignment_date,
            status: student.status,
            isExistingAssignment: true, // Flag to identify existing assignments
          }));

          setStudents(assignedStudents);
          setStudentName(`${assignedStudents.length} student(s) found`);
        } else {
          setStudents([]);
          setStudentName("");
          alert("No students assigned to this mentor yet.");
        }
      } else {
        setStudents([]);
        alert("No data found for the selected mentor.");
      }
    } catch (error) {
      console.error("Error searching for mentor assignments:", error);
      alert("Failed to search for mentor assignments.");
    }
  };

  const fetchStudentDetails = async () => {
    // Make mentor selection compulsory
    if (!selectedMentor || !selectedMentor.value) {
      alert("Please select a mentor first before adding students.");
      return;
    }

    if (!registrationNo && !barcode) {
      alert("Please enter at least one value (Registration No or Barcode).");
      return;
    }

    try {
      const organization_id = sessionStorage.getItem("organization_id");
      const branch_id = sessionStorage.getItem("branch_id");
      const token = localStorage.getItem("accessToken");

      if (!organization_id || !branch_id) {
        alert("Missing organization or branch information. Please refresh the page.");
        return;
      }

      // Build query parameters
      const params = new URLSearchParams({
        organization_id,
        branch_id,
      });

      // Add college_admission_no if provided
      if (registrationNo) {
        params.append("college_admission_no", registrationNo);
      }

      // Add barcode if provided
      if (barcode) {
        params.append("barcode", barcode);
      }

      const apiUrl = `${ApiUrl.apiurl}StudentCourse/StudentCourseRecordFilter/?${params.toString()}`;
      console.log("Fetching student details from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.message === "success!!" && Array.isArray(data.data) && data.data.length > 0) {
        // Map the API response to match component's expected format
        const studentData = data.data.map((student) => ({
          student_id: student.student_id,
          id: student.id,
          student_name: student.student_name,
          studentname: student.student_name,
          registration_no: student.college_admission_no || student.enrollment_no,
          college_admission_no: student.college_admission_no,
          barcode: student.barcode,
          classname: student.course_name,
          class_name: student.course_name,
          sectionname: student.section_name,
          section_name: student.section_name,
          father_name: student.father_name || "",
          mother_name: student.mother_name || "",
          organization_id: student.organization_id,
          branch_id: student.branch_id,
        }));

        // Check assignments for fetched students
        const studentsWithAssignments = await checkStudentAssignments(studentData);

        // Merge fetched students, avoiding duplicates by student_id
        setStudents((prev) => {
          const existingIds = new Set(
            prev.map((s) => s.student_id || s.id).filter(Boolean)
          );

          const newStudents = studentsWithAssignments.filter(
            (newStudent) => {
              const sid = newStudent.student_id || newStudent.id;
              return sid && !existingIds.has(sid);
            }
          );

          if (newStudents.length === 0) {
            alert("Student(s) already added to the list.");
            return prev;
          }

          const merged = [...prev, ...newStudents];
          console.log("Merged Students:", merged);
          
          // Clear input fields after successful fetch
          setRegistrationNo("");
          setBarcode("");
          if (admissionNoRef.current) admissionNoRef.current.value = "";
          if (barcodeRef.current) barcodeRef.current.value = "";

          return merged;
        });
      } else {
        alert("Student not found. Please check the Registration No or Barcode.");
        // Clear input fields
        setRegistrationNo("");
        setBarcode("");
        if (admissionNoRef.current) admissionNoRef.current.value = "";
        if (barcodeRef.current) barcodeRef.current.value = "";
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      alert("Failed to fetch student details. Please try again.");
    }
  };



  const handleAssign = async () => {
    const createdBy = sessionStorage.getItem("userId");
    const branchId = localStorage.getItem("branchId");
    const orgId = localStorage.getItem("orgId");
    const academicYearId = localStorage.getItem("academicSessionId");

    if (!selectedMentor || !selectedMentor.value) {
      alert("Please select a mentor.");
      return;
    }

    // Prefer fully-fetched students; fall back to navigation state if empty
    const allSelectedStudents =
      students.length > 0 ? students : selectedStudents;

    if (allSelectedStudents.length === 0) {
      alert("Please select at least one student.");
      return;
    }

    // Extract student_id properly (including modal-selected and barcode-fetched students)
    const studentIds = allSelectedStudents
      .map(
        (student) =>
          student?.studentBasicDetails?.id || // From modal selection
          student?.student_id || // From API fetch
          student?.fullData?.student_id || // From modal's fullData
          student?.id ||
          student?.value
      )
      .filter(Boolean);

    if (studentIds.length === 0) {
      alert("No valid students found. Check console for details.");
      console.log(
        "All Selected Students (For Debugging):",
        allSelectedStudents
      );
      return;
    }

    // Payload Construction
    const payload = {
      teacher_id: selectedMentor.value,
      student_id: studentIds,
      academic_year_id: academicYearId,
      org_id: orgId,
      branch_id: branchId,
      date: new Date().toISOString().split("T")[0],
      created_by: createdBy,
    };

    console.log("Payload Sent to API:", payload);

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}Mentor/studentmentorAssign/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("Mentor assign response:", result);

      if (result.message === "No new student assignments created") {
        // Handle case where students are already assigned
        let alertMessage = "The following student(s) are already assigned to this mentor:\n\n";
        
        if (result.skipped && Array.isArray(result.skipped) && result.skipped.length > 0) {
          result.skipped.forEach((skipped, index) => {
            alertMessage += `${index + 1}. ${skipped.student_name || `Student ID: ${skipped.student_id}`}\n`;
            if (skipped.reason) {
              alertMessage += `   Reason: ${skipped.reason}\n`;
            }
          });
        } else {
          alertMessage = result.reason || "All students are already assigned to this mentor or invalid student IDs.";
        }
        
        alert(alertMessage);
      } else if (result.message === "Already Exists") {
        alert(
          "Mentor already assigned to one or more of the selected students."
        );
      } else if (
        result.message === "Success" ||
        result.message === "success" ||
        result.message === "Saved Successfully"
      ) {
        alert("Students assigned successfully!");

        // Clear the students table after successful assignment
        setStudents([]);
        setStudentName("");
      } else {
        alert(`Unexpected response: ${result.message}`);
      }
    } catch (error) {
      console.error("Assignment failed:", error);
      alert("Failed to assign students.");
    }
  };

  // Prefer fully-fetched students for display; fall back to navigation state
  const rowsToRender =
    students.length > 0 ? students : selectedStudents;

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
                ASSIGN STUDENT MENTOR
              </p>
              <div className="row mb-2 mt-3 mx-0">
                <div
                  className="col-12 p-2 d-flex flex-wrap gap-2"
                  // style={{ border: "1px solid #ccc" }}
                >
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleAssign}
                  >
                    Assign Mentor
                  </button>
              
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handleClear}
                    style={{
                      width: "150px",
                    }}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={() => navigate("/admin/assign-mentor")}
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mt-2">
                      <div className="col-12 col-md-3 mb- 3 ">
                        <label
                          htmlFor="mentor"
                          className="form-label me-2"
                          style={{ whiteSpace: "nowrap", minWidth: "80px" }}
                        >
                          Mentor
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

                      <div className="col-12 col-md-3 mb-3 mt-4">
                        <input
                          type="text"
                          id="student-name"
                          className="form-control detail"
                          placeholder="Add Multiple Student(s)"
                          value={studentName}
                          onClick={() => {
                            if (!isStudentNameDisabled) handleShow(); // Open modal on input click
                          }}
                          onChange={(e) => setStudentName(e.target.value)}
                          disabled={isStudentNameDisabled} // Disable if no mentor is selected
                          readOnly // Prevent cursor from appearing in the field
                          style={{
                            cursor: isStudentNameDisabled
                              ? "not-allowed"
                              : "pointer",
                            backgroundColor: isStudentNameDisabled
                              ? "#0d6efd"
                              : "#0d6efd",
                            caretColor: "transparent", // Hide text cursor
                          }}
                        />
                      </div>

                      <SelectStudentMentorModal
                        show={show}
                        handleClose={handleClose}
                        onSelectStudent={handleSelectStudent}
                      />

                      {/* <div className="row">
                        <div className="col-12 col-md-3 mb-3">
                          <label
                            htmlFor="school-admission-number"
                            className="form-label "
                          >
                            RegistrationNo
                          </label>
                          <div className="d-flex flex-grow-1">
                            <input
                              type="text"
                              id="school-admission-number"
                              className="form-control detail " 
                              placeholder="Enter admission no"
                              ref={admissionNoRef}
                              value={registrationNo}
                              onChange={(e) =>
                                setRegistrationNo(e.target.value)
                              }
                            />
                          </div>

                          <div className="col-12 col-md-3 mb-3">
                            <label
                              htmlFor="school-barcode"
                              className="form-label "
                            >
                              School BarCode
                            </label>
                            <div className="d-flex flex-grow-1">
                              <input
                                type="text"
                                id="school-barcode"
                                className="form-control detail" 
                                placeholder="Enter school barcode"
                                ref={admissionNoRef}
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-12 col-md-3 mb-3">
                            <div className="d-flex flex-grow-1">
                              <input
                                type="text"
                                id="other-input"
                                className="form-control detail " 
                                placeholder="Add Students"
                                onClick={fetchStudentDetails}
                                ref={admissionNoRef}
                              />
                            </div>
                          </div>
                        </div>
                      </div> */}

                      <div className="row">
                        <div className="col-12 col-md-4 mb-3">
                          <label
                            htmlFor="school-admission-number"
                            className="form-label"
                          >
                            Registration No
                          </label>
                          <input
                            type="text"
                            id="school-admission-number"
                            className="form-control detail"
                            placeholder="Enter admission no"
                            ref={admissionNoRef}
                            value={registrationNo}
                            onChange={(e) => setRegistrationNo(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                fetchStudentDetails();
                              }
                            }}
                            disabled={!selectedMentor || !selectedMentor.value}
                          />
                        </div>

                        <div className="col-12 col-md-4 mb-3">
                          <label
                            htmlFor="school-barcode"
                            className="form-label"
                          >
                            BarCode
                          </label>
                          <input
                            type="text"
                            id="school-barcode"
                            className="form-control detail"
                            placeholder="Enter school barcode"
                            ref={barcodeRef}
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                fetchStudentDetails();
                              }
                            }}
                            disabled={!selectedMentor || !selectedMentor.value}
                          />
                        </div>

                        <div className="col-12 col-md-4 mb-3 mt-4">
                          {/* <input
                            type="text"
                            id="other-input"
                            className="form-control detail"
                            placeholder="Add Students"
                            onClick={fetchStudentDetails}
                            ref={admissionNoRef}
                            
                          /> */}

                          <input
                            type="text"
                            id="other-input"
                            className="form-control detail text-white"
                            placeholder="Add Students"
                            onClick={fetchStudentDetails}
                            ref={admissionNoRef}
                            readOnly
                            disabled={!selectedMentor || !selectedMentor.value}
                            style={{
                              backgroundColor: !selectedMentor || !selectedMentor.value ? "#6c757d" : "#0d6efd",
                              borderColor: !selectedMentor || !selectedMentor.value ? "#6c757d" : "#0d6efd",
                              cursor: !selectedMentor || !selectedMentor.value ? "not-allowed" : "pointer",
                              maxWidth: "150px",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered ">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Student Name</th>
                        <th>Admission No</th>
                        <th>BarCode</th>
                        <th>Course</th>
                        <th>Section</th>
                        <th>Father Name</th>
                        <th>Mother Name</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowsToRender.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="text-center">
                            No students selected.
                          </td>
                        </tr>
                      ) : (
                        rowsToRender.map((student, index) => {
                          // Use a unique identifier for the key
                          const studentKey = student.student_id || student.id || student.studentBasicDetails?.id || `student-${index}`;
                          const isExisting = student.isExistingAssignment;
                          return (
                            <tr key={studentKey}>
                              <td>{index + 1}</td>
                              <td>
                                {student.studentBasicDetails
                                  ? (student.studentBasicDetails.student_name ||
                                    `${student.studentBasicDetails.first_name || ""} ${student.studentBasicDetails.middle_name || ""} ${student.studentBasicDetails.last_name || ""}`.trim())
                                  : (student.student_name || student.studentname)}
                              </td>
                              <td>
                                {student.studentBasicDetails
                                  ? (student.studentBasicDetails.school_admission_no || 
                                     student.fullData?.enrollment_no || 
                                     student.fullData?.college_admission_no)
                                  : (student.registration_no || student.college_admission_no)}
                              </td>
                              <td>
                                {student.studentBasicDetails
                                  ? student.studentBasicDetails.barcode
                                  : student.barcode}
                              </td>
                              <td>
                                {student.studentBasicDetails
                                  ? (student.studentBasicDetails.classname || student.studentBasicDetails.course_name)
                                  : (student.classname || student.class_name)}
                              </td>
                              <td>
                                {student.studentBasicDetails
                                  ? student.studentBasicDetails.sectionname
                                  : (student.sectionname || student.section_name)}
                              </td>
                              <td>
                                {student.studentBasicDetails
                                  ? student.studentBasicDetails.father_name
                                  : student.father_name}
                              </td>
                              <td>
                                {student.studentBasicDetails
                                  ? student.studentBasicDetails.mother_name
                                  : student.mother_name}
                              </td>
                              <td>
                                {isExisting ? (
                                  <span
                                    className={`badge ${
                                      student.status === "ACTIVE"
                                        ? "bg-success"
                                        : "bg-secondary"
                                    }`}
                                  >
                                    {student.status || "Assigned"}
                                  </span>
                                ) : (
                                  <span className="badge bg-warning text-dark">
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td>
                                <button
                                  className={`btn ${isExisting ? "btn-danger" : "btn-outline-danger"} btn-sm`}
                                  onClick={() => handleRemoveStudent(student)}
                                  title={isExisting ? "Delete Assignment" : "Remove from list"}
                                >
                                  {isExisting ? "Delete" : "Remove"}
                                </button>
                              </td>
                            </tr>
                          );
                        })
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
  );
};
export default AssignStudentMentor;
