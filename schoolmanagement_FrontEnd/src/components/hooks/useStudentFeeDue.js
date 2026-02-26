import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";

/**
 * Custom hook to fetch student fee due amounts (current + previous semesters)
 * @param {object} filters - Filter parameters for fee due
 * @param {string|number} filters.student_id - Student ID (required)
 * @param {string|number} filters.fee_applied_from - Semester ID to check dues from (required)
 * @param {boolean} filters.enabled - Whether to fetch data (default: true)
 * @returns {object} - { feeDue, loading, error, refetch }
 */
const useStudentFeeDue = (filters = {}) => {
  const [feeDue, setFeeDue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFeeDue = useCallback(async () => {
    // Check if fetching is enabled
    if (filters.enabled === false) {
      return;
    }

    // Check if required parameters are provided
    if (!filters.student_id || !filters.fee_applied_from) {
      setFeeDue(null);
      setError("");
      return;
    }

    // Get organization and branch IDs
    const orgId = localStorage.getItem("orgId") || sessionStorage.getItem("organization_id");
    const branchId = localStorage.getItem("branchId") || sessionStorage.getItem("branch_id");

    if (!orgId || !branchId) {
      setError("Missing organization or branch ID");
      setFeeDue(null);
      return;
    }

    // Build query parameters
    // studentIds needs to be a JSON array of strings: ["15"] → %5B%2215%22%5D when URL encoded
    const params = {
      organization_id: orgId,
      branch_id: branchId,
      studentIds: JSON.stringify([String(filters.student_id)]), // JSON array of strings format
      fee_applied_from: filters.fee_applied_from,
    };

    try {
      setLoading(true);
      setError("");

      console.log("Fetching fee due with params:", params);

      const response = await api.get("FeeLedger/GetStudentFeeDueReceiptStudentId/", {
        params,
      });

      const result = response.data;
      console.log("Fee Due API Response:", result);

      // Handle different response formats
      const isSuccessMessage =
        result.message?.toLowerCase() === "success" ||
        result.message === "Success" ||
        result.status === "success";

      if (isSuccessMessage && Array.isArray(result.data) && result.data.length > 0) {
        // Get the first student's due data
        setFeeDue(result.data[0]);
        setError("");
      } else if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        setFeeDue(result.data[0]);
        setError("");
      } else {
        setFeeDue(null);
        setError(result.message || "No due amount found");
      }
    } catch (err) {
      console.error("Error fetching fee due:", err);
      setError(
        err.response?.data?.message || err.message || "Error fetching fee due"
      );
      setFeeDue(null);
    } finally {
      setLoading(false);
    }
  }, [filters.student_id, filters.fee_applied_from, filters.enabled]);

  useEffect(() => {
    fetchFeeDue();
  }, [fetchFeeDue]);

  return {
    feeDue,
    loading,
    error,
    refetch: fetchFeeDue,
  };
};

export default useStudentFeeDue;

