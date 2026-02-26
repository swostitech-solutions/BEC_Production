import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";

/**
 * Custom hook to fetch student details based on student ID
 * @param {string|number} studentId - The student ID to fetch details for
 * @returns {object} - { studentDetails, loading, error, refetch }
 */
const useStudentDetails = (studentId) => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStudentDetails = useCallback(async () => {
    if (!studentId) {
      setStudentDetails(null);
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
        setStudentDetails(null);
        return;
      }

      const response = await api.get("StudentRegistrationApi/GetStudentDetailsBasedOnId/", {
        params: {
          organization_id: orgId,
          branch_id: branchId,
          student_id: studentId,
        },
      });

      const result = response.data;

      if (result.message === "success" && result.data) {
        setStudentDetails(result.data);
        setError("");
      } else {
        setStudentDetails(null);
        setError(result.message || "Failed to fetch student details");
      }
    } catch (err) {
      console.error("Error fetching student details:", err);
      setError(err.response?.data?.message || "Error fetching student details");
      setStudentDetails(null);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudentDetails();
  }, [fetchStudentDetails]);

  return {
    studentDetails,
    loading,
    error,
    refetch: fetchStudentDetails,
  };
};

export default useStudentDetails;

