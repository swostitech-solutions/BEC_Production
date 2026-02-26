import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";

/**
 * Custom hook to fetch student fee ledger (outstanding/pending fees)
 * @param {object} filters - Filter parameters for fee ledger
 * @param {string|number} filters.student_id - Student ID (required)
 * @param {string|number} filters.semester_id - Semester ID (optional)
 * @param {boolean} filters.enabled - Whether to fetch data (default: true)
 * @returns {object} - { feeLedger, loading, error, refetch }
 */
const useStudentFeeLedger = (filters = {}) => {
  const [feeLedger, setFeeLedger] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFeeLedger = useCallback(async () => {
    // Check if fetching is enabled
    if (filters.enabled === false) {
      return;
    }

    // Check if student_id is provided
    if (!filters.student_id) {
      setFeeLedger([]);
      setError("");
      return;
    }

    // Get organization and branch IDs
    const orgId = localStorage.getItem("orgId") || sessionStorage.getItem("organization_id");
    const branchId = localStorage.getItem("branchId") || sessionStorage.getItem("branch_id");

    if (!orgId || !branchId) {
      setError("Missing organization or branch ID");
      setFeeLedger([]);
      return;
    }

    // Build query parameters
    const params = {
      organization_id: orgId,
      branch_id: branchId,
      student_id: filters.student_id,
    };

    // Add optional filters
    if (filters.semester_id) params.semester_id = filters.semester_id;

    try {
      setLoading(true);
      setError("");

      console.log("Fetching fee ledger with params:", params);

      const response = await api.get("FeeLedger/GetFeeLedgerBasedOnCondition/", {
        params,
      });

      const result = response.data;
      console.log("Fee Ledger API Response:", result);

      // Handle different response formats
      const isSuccessMessage =
        result.message?.toLowerCase() === "success" ||
        result.message === "Success" ||
        result.message === "success!!" ||
        result.status === "success";

      if (isSuccessMessage && Array.isArray(result.data)) {
        // Map the response to match expected structure
        // API returns: total_fees, total_paid, discount_fees, remaining_fees
        const mappedData = result.data.map((record) => ({
          id: record.studentId || record.student_id,
          student_id: record.studentId || record.student_id,
          student_name: record.student_name,
          semester_id: record.semester_id,
          semester_name: record.semester_name || record.semester,
          fee_applied_from: record.semester_name || record.semester,
          // Map API fields to expected component fields
          element_amount: record.total_fees || 0,
          paid_amount: record.total_paid || 0,
          discount: record.discount_fees || 0,
          balance_amount: record.remaining_fees || 0,
          // Keep original fields for reference
          total_fees: record.total_fees || 0,
          total_paid: record.total_paid || 0,
          discount_fees: record.discount_fees || 0,
          remaining_fees: record.remaining_fees || 0,
          // Additional fields
          academic_year_id: record.academic_year_id,
          academic_year_code: record.academic_year_code,
          course_id: record.course_id,
          course_name: record.course_name,
          section_id: record.section_id,
          section_name: record.section_name,
        }));
        setFeeLedger(mappedData);
        setError("");
      } else if (Array.isArray(result)) {
        // Direct array response
        const mappedData = result.map((record) => ({
          id: record.studentId || record.student_id,
          element_amount: record.total_fees || 0,
          paid_amount: record.total_paid || 0,
          discount: record.discount_fees || 0,
          balance_amount: record.remaining_fees || 0,
          ...record,
        }));
        setFeeLedger(mappedData);
        setError("");
      } else if (result.data && Array.isArray(result.data)) {
        const mappedData = result.data.map((record) => ({
          id: record.studentId || record.student_id,
          element_amount: record.total_fees || 0,
          paid_amount: record.total_paid || 0,
          discount: record.discount_fees || 0,
          balance_amount: record.remaining_fees || 0,
          ...record,
        }));
        setFeeLedger(mappedData);
        setError("");
      } else {
        setFeeLedger([]);
        setError(result.message || "No fee ledger data found");
      }
    } catch (err) {
      console.error("Error fetching fee ledger:", err);
      setError(
        err.response?.data?.message || err.message || "Error fetching fee ledger"
      );
      setFeeLedger([]);
    } finally {
      setLoading(false);
    }
  }, [filters.student_id, filters.semester_id, filters.enabled]);

  useEffect(() => {
    fetchFeeLedger();
  }, [fetchFeeLedger]);

  return {
    feeLedger,
    loading,
    error,
    refetch: fetchFeeLedger,
  };
};

export default useStudentFeeLedger;

