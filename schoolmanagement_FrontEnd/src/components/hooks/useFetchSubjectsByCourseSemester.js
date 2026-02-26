import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

// Hook: fetch subjects based on course/semester + optional filters
// Endpoint: GET Subjects/GetSubjectListBasedOnCourseAndSemester/
// Required: organization_id, branch_id, batch_id
// Optional: course_id, department_id, semester_id, academic_year_id, subject_group_id
const useFetchSubjectsByCourseSemester = (
  organizationId,
  branchId,
  batchId,
  courseId,
  departmentId,
  semesterId,
  academicYearId,
  subjectGroupId
) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Required parameters must be present
    if (!organizationId || !branchId || !batchId) {
      setSubjects([]);
      return;
    }

    let mounted = true;

    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Access token not found in localStorage.");
          setError("Unauthorized: Missing access token.");
          return;
        }

        const params = new URLSearchParams();
        params.append("organization_id", organizationId);
        params.append("branch_id", branchId);
        params.append("batch_id", batchId);

        if (courseId) params.append("course_id", courseId);
        if (departmentId) params.append("department_id", departmentId);
        if (semesterId) params.append("semester_id", semesterId);
        if (academicYearId) params.append("academic_year_id", academicYearId);
        if (subjectGroupId) params.append("subject_group_id", subjectGroupId);

        const apiUrl = `${ApiUrl.apiurl}Subjects/GetSubjectListBasedOnCourseAndSemester/?${params.toString()}`;
        console.log("Subjects API URL:", apiUrl);

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

        const result = await response.json();
        console.log("Subjects API Response:", result);

        if (!mounted) return;

        if (Array.isArray(result.data)) {
          setSubjects(result.data);
        } else if (Array.isArray(result)) {
          setSubjects(result);
        } else {
          setSubjects([]);
        }
      } catch (err) {
        if (mounted) {
          console.error("Error fetching subjects:", err);
          setError(err.message || "Error fetching subjects");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSubjects();

    return () => {
      mounted = false;
    };
  }, [
    organizationId,
    branchId,
    batchId,
    courseId,
    departmentId,
    semesterId,
    academicYearId,
    subjectGroupId,
  ]);

  return { subjects, loading, error };
};

export default useFetchSubjectsByCourseSemester;


