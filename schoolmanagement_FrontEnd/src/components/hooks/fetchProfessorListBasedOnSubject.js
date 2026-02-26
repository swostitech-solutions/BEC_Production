// ✅ src/hooks/useFetchProfessorListBasedOnSubject.js
import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchProfessorListBasedOnSubject = (
  organizationId,
  branchId,
  batchId,
  courseId,
  departmentId,
  academicYearId,
  semesterId,
  sectionId,
  subjectId,
  lectureId,
  date
) => {
  const [ProfessorList, setProfessorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset list if dependencies are missing
    if (
      !organizationId ||
      !branchId ||
      !batchId ||
      !courseId ||
      !departmentId ||
      !academicYearId ||
      !semesterId ||
      !sectionId ||
      !subjectId ||
      !lectureId ||
      !date
    ) {
      setProfessorList([]);
      return;
    }

    let mounted = true;

    const fetchProfessors = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Access token not found in localStorage.");
          setError("Unauthorized: Missing access token.");
          return;
        }

        // ✅ Build dynamic API URL
        const apiUrl = `${ApiUrl.apiurl}Professor/GetProfessorListBasedOnSubject/?organization_id=${organizationId}&branch_id=${branchId}&batch_id=${batchId}&course_id=${courseId}&department_id=${departmentId}&academic_year_id=${academicYearId}&semester_id=${semesterId}&section_id=${sectionId}&subject_id=${subjectId}&lecture_id=${lectureId}&date=${date}`;
        console.log("ProfessorListBasedOnSubject API URL:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        console.log("ProfessorListBasedOnSubject API Response:", result);

        if (mounted) {
          // ✅ Handle all "success" variants and array responses
          if (Array.isArray(result)) {
            setProfessorList(result);
          } else if (
            typeof result.message === "string" &&
            result.message.toLowerCase().includes("success") &&
            Array.isArray(result.data)
          ) {
            setProfessorList(result.data);
          } else if (result.message === "No record found") {
            setProfessorList([]);
            setError("No professor found");
          } else {
            setProfessorList([]);
          }
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProfessors();

    return () => {
      mounted = false;
    };
  }, [
    organizationId,
    branchId,
    batchId,
    courseId,
    departmentId,
    academicYearId,
    semesterId,
    sectionId,
    subjectId,
    lectureId,
    date,
  ]);

  return { ProfessorList, loading, error };
};

export default useFetchProfessorListBasedOnSubject;
