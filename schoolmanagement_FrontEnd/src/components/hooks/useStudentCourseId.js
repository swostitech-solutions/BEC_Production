import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";

/**
 * Custom hook to fetch student course ID from student ID
 * @param {string|number} studentId - The student ID
 * @returns {object} - { studentCourseId, loading, error, refetch }
 */
const useStudentCourseId = (studentId) => {
  const [studentCourseId, setStudentCourseId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStudentCourseId = useCallback(async () => {
    if (!studentId) {
      setStudentCourseId(null);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const orgId = localStorage.getItem("orgId") || sessionStorage.getItem("organization_id");
      const branchId = localStorage.getItem("branchId") || sessionStorage.getItem("branch_id");

      if (!orgId || !branchId) {
        setError("Missing organization or branch ID");
        setStudentCourseId(null);
        return;
      }

      const response = await api.get("StudentCourse/GetStudentDataBasedId/", {
        params: {
          organization_id: orgId,
          branch_id: branchId,
          student_id: studentId,
        },
      });

      const result = response.data;

      if (result.message === "Success" && result.data) {
        // The API returns student course data, which should include an id field
        // This id is typically the student_course_id
        const courseId = result.data.id || result.data.student_course_id || null;
        setStudentCourseId(courseId);
        setError("");
      } else {
        setStudentCourseId(null);
        setError(result.message || "Failed to fetch student course ID");
      }
    } catch (err) {
      console.error("Error fetching student course ID:", err);
      setError(err.response?.data?.message || "Error fetching student course ID");
      setStudentCourseId(null);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudentCourseId();
  }, [fetchStudentCourseId]);

  return {
    studentCourseId,
    loading,
    error,
    refetch: fetchStudentCourseId,
  };
};

export default useStudentCourseId;

