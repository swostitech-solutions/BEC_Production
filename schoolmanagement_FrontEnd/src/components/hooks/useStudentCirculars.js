import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";

/**
 * Custom hook to fetch student circulars based on their class information
 * @param {object} filters - Filter parameters for circulars
 * @param {string|number} filters.course_id - Course ID (required)
 * @param {string|number} filters.semester_id - Semester ID (optional, omit for all semesters)
 * @param {string|number} filters.section_id - Section ID (required)
 * @param {string|number} filters.batch_id - Batch ID (optional)
 * @param {boolean} filters.enabled - Whether to fetch data (default: true)
 * @returns {object} - { circulars, loading, error, refetch }
 */
const useStudentCirculars = (filters = {}) => {
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCirculars = useCallback(async () => {
    // Check if fetching is enabled
    if (filters.enabled === false) {
      return;
    }

    // Get organization and branch IDs
    const orgId = localStorage.getItem("orgId") || sessionStorage.getItem("organization_id");
    const branchId = localStorage.getItem("branchId") || sessionStorage.getItem("branch_id");

    if (!orgId || !branchId) {
      setError("Missing organization or branch ID");
      setCirculars([]);
      return;
    }

    // Check required filters
    if (!filters.course_id || !filters.section_id) {
      setCirculars([]);
      setError("");
      return;
    }

    // Build query parameters
    const params = {
      organization_id: orgId,
      branch_id: branchId,
    };

    // Add batch_id if provided
    if (filters.batch_id) {
      params.batch_id = filters.batch_id;
    }

    // Add JSON array parameters (API expects JSON arrays)
    // Encode as JSON arrays: [1] becomes %5B1%5D when URL encoded
    params.course_ids = JSON.stringify([filters.course_id]);
    params.section_ids = JSON.stringify([filters.section_id]);

    // Add semester_id if provided (optional - omit for all semesters)
    if (filters.semester_id) {
      params.semester_ids = JSON.stringify([filters.semester_id]);
    }

    try {
      setLoading(true);
      setError("");

      console.log("Fetching circulars with params:", params);

      const response = await api.get("CircularMessage/GetAllCircularMessageList/", {
        params,
        // Axios will automatically URL-encode the JSON strings
      });

      const result = response.data;
      console.log("Circulars API Response:", result);

      // Handle different response formats
      const isSuccessMessage =
        result.message?.toLowerCase() === "success" ||
        result.message === "Success" ||
        result.status === "success";

      if (isSuccessMessage && Array.isArray(result.data)) {
        setCirculars(result.data);
        setError("");
      } else if (Array.isArray(result)) {
        setCirculars(result);
        setError("");
      } else if (result.data && Array.isArray(result.data)) {
        setCirculars(result.data);
        setError("");
      } else {
        setCirculars([]);
        setError(result.message || "No circulars found");
      }
    } catch (err) {
      console.error("Error fetching circulars:", err);
      setError(
        err.response?.data?.message || err.message || "Error fetching circulars"
      );
      setCirculars([]);
    } finally {
      setLoading(false);
    }
  }, [
    filters.course_id,
    filters.semester_id,
    filters.section_id,
    filters.batch_id,
    filters.enabled,
  ]);

  useEffect(() => {
    fetchCirculars();
  }, [fetchCirculars]);

  return {
    circulars,
    loading,
    error,
    refetch: fetchCirculars,
  };
};

export default useStudentCirculars;

