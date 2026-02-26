import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";

/**
 * Custom hook to fetch student payment receipts/history
 * @param {object} filters - Filter parameters for receipts
 * @param {string|number} filters.student_id - Student ID (required)
 * @param {string|number} filters.academic_year_id - Academic Year ID (optional)
 * @param {string} filters.from_date - Start date (YYYY-MM-DD, optional)
 * @param {string} filters.to_date - End date (YYYY-MM-DD, optional)
 * @param {boolean} filters.enabled - Whether to fetch data (default: true)
 * @returns {object} - { receipts, loading, error, refetch }
 */
const useStudentFeeReceipts = (filters = {}) => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReceipts = useCallback(async () => {
    // Check if fetching is enabled
    if (filters.enabled === false) {
      return;
    }

    // Check if student_id is provided
    if (!filters.student_id) {
      setReceipts([]);
      setError("");
      return;
    }

    // Get organization and branch IDs
    const orgId = localStorage.getItem("orgId") || sessionStorage.getItem("organization_id");
    const branchId = localStorage.getItem("branchId") || sessionStorage.getItem("branch_id");

    if (!orgId || !branchId) {
      setError("Missing organization or branch ID");
      setReceipts([]);
      return;
    }

    // Build query parameters
    const params = {
      organization_id: orgId,
      branch_id: branchId,
      student_id: filters.student_id,
    };

    // Add optional filters
    if (filters.academic_year_id) params.academic_year_id = filters.academic_year_id;
    if (filters.from_date) params.from_date = filters.from_date;
    if (filters.to_date) params.to_date = filters.to_date;

    try {
      setLoading(true);
      setError("");

      console.log("Fetching fee receipts with params:", params);

      const response = await api.get("FeeReceipt/GetFilterFeeReceipts/", {
        params,
      });

      const result = response.data;
      console.log("Fee Receipts API Response:", result);

      // Handle different response formats
      const isSuccessMessage =
        result.message?.toLowerCase() === "success" ||
        result.message === "Success" ||
        result.status === "success";

      if (isSuccessMessage && Array.isArray(result.data)) {
        setReceipts(result.data);
        setError("");
      } else if (Array.isArray(result)) {
        setReceipts(result);
        setError("");
      } else if (result.data && Array.isArray(result.data)) {
        setReceipts(result.data);
        setError("");
      } else {
        setReceipts([]);
        setError(result.message || "No receipts found");
      }
    } catch (err) {
      console.error("Error fetching fee receipts:", err);
      setError(
        err.response?.data?.message || err.message || "Error fetching fee receipts"
      );
      setReceipts([]);
    } finally {
      setLoading(false);
    }
  }, [
    filters.student_id,
    filters.academic_year_id,
    filters.from_date,
    filters.to_date,
    filters.enabled,
  ]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  return {
    receipts,
    loading,
    error,
    refetch: fetchReceipts,
  };
};

export default useStudentFeeReceipts;

