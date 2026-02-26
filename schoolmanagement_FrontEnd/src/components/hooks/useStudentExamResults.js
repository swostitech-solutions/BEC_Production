import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";

/**
 * Custom hook to fetch student exam results
 * @param {string|number} studentCourseId - The StudentCourse ID (required)
 * @param {object} filters - Filter parameters for results
 * @param {string|number} filters.academic_year_id - Academic Year ID (optional)
 * @param {string|number} filters.semester_id - Semester ID (optional)
 * @param {boolean} filters.enabled - Whether to fetch data (default: true)
 * @returns {object} - { examResults, loading, error, refetch }
 */
const useStudentExamResults = (studentCourseId, filters = {}) => {
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchExamResults = useCallback(async () => {
    // Check if fetching is enabled
    if (filters.enabled === false) {
      return;
    }

    // Check if studentCourseId is provided
    if (!studentCourseId) {
      setExamResults([]);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Build query parameters
      const params = {};

      // Add optional filters
      if (filters.academic_year_id) {
        params.academic_year_id = filters.academic_year_id;
      }
      if (filters.semester_id) {
        params.semester_id = filters.semester_id;
      }

      console.log("Fetching exam results with params:", { studentCourseId, params });

      const response = await api.get(`reportcard/get-result/${studentCourseId}/`, {
        params,
      });

      const result = response.data;
      console.log("Exam Results API Response:", result);

      // Handle different response formats
      if (result.status === "success" && Array.isArray(result.data)) {
        setExamResults(result.data);
        setError("");
      } else if (result.message?.toLowerCase() === "success" && Array.isArray(result.data)) {
        setExamResults(result.data);
        setError("");
      } else if (Array.isArray(result)) {
        setExamResults(result);
        setError("");
      } else if (result.data && Array.isArray(result.data)) {
        setExamResults(result.data);
        setError("");
      } else {
        setExamResults([]);
        setError(result.message || "No exam results found");
      }
    } catch (err) {
      console.error("Error fetching exam results:", err);
      setError(
        err.response?.data?.message || err.message || "Error fetching exam results"
      );
      setExamResults([]);
    } finally {
      setLoading(false);
    }
  }, [studentCourseId, filters.academic_year_id, filters.semester_id, filters.enabled]);

  useEffect(() => {
    fetchExamResults();
  }, [fetchExamResults]);

  return {
    examResults,
    loading,
    error,
    refetch: fetchExamResults,
  };
};

export default useStudentExamResults;

