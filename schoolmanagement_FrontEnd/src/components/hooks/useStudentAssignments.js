import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";

/**
 * Custom hook to fetch student assignments
 * @param {object} filters - Filter parameters for assignments
 * @param {string|number} filters.course_id - Course ID (required for student view)
 * @param {string|number} filters.section_id - Section ID (required for student view)
 * @param {string|number} filters.semester_id - Semester ID (optional but recommended)
 * @param {string|number} filters.subject_id - Subject ID (optional)
 * @param {string|number} filters.professor_id - Professor ID (optional)
 * @param {string|number} filters.lecture_id - Lecture/Period ID (optional)
 * @param {string} filters.assignment_date - Single date filter (optional, YYYY-MM-DD)
 * @param {boolean} filters.enabled - Whether to fetch data (default: true)
 * @returns {object} - { assignments, loading, error, refetch }
 */
const useStudentAssignments = (filters = {}) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAssignments = useCallback(async () => {
    // Check if fetching is enabled
    if (filters.enabled === false) {
      return;
    }

    // Get organization and branch IDs
    const orgId = localStorage.getItem("orgId") || sessionStorage.getItem("organization_id");
    const branchId = localStorage.getItem("branchId") || sessionStorage.getItem("branch_id");

    if (!orgId || !branchId) {
      setError("Missing organization or branch ID");
      setAssignments([]);
      return;
    }

    // Build query parameters
    const params = {
      organization_id: orgId,
      branch_id: branchId,
    };

    // Add required/recommended filters for student view
    if (filters.course_id) params.course_id = filters.course_id;
    if (filters.section_id) params.section_id = filters.section_id;
    if (filters.semester_id) params.semester_id = filters.semester_id;

    // Add optional filters
    if (filters.subject_id) params.subject_id = filters.subject_id;
    if (filters.professor_id) params.professor_id = filters.professor_id;
    if (filters.lecture_id) params.lecture_id = filters.lecture_id;
    if (filters.assignment_date) params.assignment_date = filters.assignment_date;

    try {
      setLoading(true);
      setError("");

      console.log("Fetching assignments with params:", params);

      const response = await api.get("Assignment/GetAllAssignmentList/", {
        params,
      });

      const result = response.data;
      console.log("Assignments API Response:", result);

      // Handle different response formats
      // Check for "Success" or "success" message
      const isSuccessMessage =
        result.message?.toLowerCase() === "success" ||
        result.message === "Success" ||
        result.status === "success";

      if (isSuccessMessage && Array.isArray(result.data)) {
        setAssignments(result.data);
        setError("");
      } else if (Array.isArray(result)) {
        setAssignments(result);
        setError("");
      } else if (result.data && Array.isArray(result.data)) {
        setAssignments(result.data);
        setError("");
      } else {
        setAssignments([]);
        setError(result.message || "No assignments found");
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError(
        err.response?.data?.message || err.message || "Error fetching assignments"
      );
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, [
    filters.course_id,
    filters.section_id,
    filters.semester_id,
    filters.subject_id,
    filters.professor_id,
    filters.lecture_id,
    filters.assignment_date,
    filters.enabled,
  ]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return {
    assignments,
    loading,
    error,
    refetch: fetchAssignments,
  };
};

export default useStudentAssignments;

