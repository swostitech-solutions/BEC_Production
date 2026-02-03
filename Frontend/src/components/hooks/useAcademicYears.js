import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";

/**
 * Custom hook to fetch academic years
 * @returns {object} - { academicYears, loading, error, refetch }
 */
const useAcademicYears = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAcademicYears = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("AcademicYear/GetAllAcademicYear/");

      const result = response.data;

      // Handle different response formats
      if (result.message?.toLowerCase() === "success" && Array.isArray(result.data)) {
        setAcademicYears(result.data);
        setError("");
      } else if (Array.isArray(result)) {
        setAcademicYears(result);
        setError("");
      } else if (result.data && Array.isArray(result.data)) {
        setAcademicYears(result.data);
        setError("");
      } else {
        setAcademicYears([]);
        setError(result.message || "No academic years found");
      }
    } catch (err) {
      console.error("Error fetching academic years:", err);
      setError(err.response?.data?.message || err.message || "Error fetching academic years");
      setAcademicYears([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAcademicYears();
  }, [fetchAcademicYears]);

  return {
    academicYears,
    loading,
    error,
    refetch: fetchAcademicYears,
  };
};

export default useAcademicYears;

