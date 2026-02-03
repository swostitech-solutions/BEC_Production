import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";

/**
 * Custom hook to fetch student attendance data
 * @param {object} filters - Filter parameters for attendance
 * @param {string|number} filters.student_id - Student ID (required for single student)
 * @param {string} filters.from_date - Start date (YYYY-MM-DD format, optional)
 * @param {string} filters.to_date - End date (YYYY-MM-DD format, optional)
 * @param {string} filters.date - Single date (YYYY-MM-DD format, optional, alternative to date range)
 * @param {string|number} filters.batch_id - Batch ID (optional)
 * @param {string|number} filters.course_id - Course ID (optional)
 * @param {string|number} filters.department_id - Department ID (optional)
 * @param {string|number} filters.academic_year_id - Academic Year ID (optional)
 * @param {string|number} filters.semester_id - Semester ID (optional)
 * @param {string|number} filters.section_id - Section ID (optional)
 * @param {string|number} filters.lecture_id - Lecture/Period ID (optional)
 * @param {string|number} filters.subject_id - Subject ID (optional)
 * @param {string|number} filters.professor_id - Professor ID (optional)
 * @param {boolean} filters.enabled - Whether to fetch data (default: true)
 * @returns {object} - { attendanceData, loading, error, refetch }
 */
const useStudentAttendance = (filters = {}) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAttendance = useCallback(async () => {
    // Check if fetching is enabled
    if (filters.enabled === false) {
      return;
    }

    // Get organization and branch IDs
    const orgId = localStorage.getItem("orgId") || sessionStorage.getItem("organization_id");
    const branchId = localStorage.getItem("branchId") || sessionStorage.getItem("branch_id");

    if (!orgId || !branchId) {
      setError("Missing organization or branch ID");
      setAttendanceData([]);
      return;
    }

    // Build query parameters
    const params = {
      organization_id: orgId,
      branch_id: branchId,
    };

    // Add student_id if provided
    if (filters.student_id) {
      params.student_id = filters.student_id;
    }

    // Add date filters (either single date or date range)
    // If both dates are absent, don't send date params (API returns all data)
    // If only from_date, send only from_date (API returns from that date onwards)
    // If only to_date, send only to_date (API returns up to that date)
    // If both dates, send both (API returns data in that range)
    if (filters.date) {
      params.date = filters.date;
    } else {
      // Only add from_date if it's provided (not null/undefined)
      if (filters.from_date) {
        params.from_date = filters.from_date;
      }
      // Only add to_date if it's provided (not null/undefined)
      if (filters.to_date) {
        params.to_date = filters.to_date;
      }
    }

    // Add optional filters
    if (filters.batch_id) params.batch_id = filters.batch_id;
    if (filters.course_id) params.course_id = filters.course_id;
    if (filters.department_id) params.department_id = filters.department_id;
    if (filters.academic_year_id) params.academic_year_id = filters.academic_year_id;
    if (filters.semester_id) params.semester_id = filters.semester_id;
    if (filters.section_id) params.section_id = filters.section_id;
    if (filters.lecture_id) params.lecture_id = filters.lecture_id;
    if (filters.subject_id) params.subject_id = filters.subject_id;
    if (filters.professor_id) params.professor_id = filters.professor_id;

    try {
      setLoading(true);
      setError("");

      console.log("Fetching attendance with params:", params);

      const response = await api.get(
        "StudentAttendance/GetSearchAttendanceByDateCourseDepartmentSemesterPeriod/",
        {
          params,
          timeout: 30000, // 30 second timeout
        }
      );

      // Handle 204 No Content status - this is a normal case (no records found)
      // Even if response.data exists with a message, 204 means no content/no records
      if (response.status === 204) {
        setAttendanceData([]);
        setError(""); // No error, just no data
        return;
      }

      // Handle no response
      if (!response) {
        setAttendanceData([]);
        setError("No response received from server. Please try again.");
        return;
      }

      // Get response data - might be object, array, string, or undefined
      const result = response.data;
      console.log("Attendance API Response:", result, "Status:", response.status);

      // Check for "No Record Found" messages FIRST - treat as empty data, not error
      // This handles cases where API returns 200/204 with {"message": "No Record Found"}
      if (result && typeof result === "object" && result.message) {
        const message = result.message.toLowerCase().trim();
        if (
          message === "no record found" ||
          message === "no records found" ||
          message.includes("no record found") ||
          message.includes("no records found") ||
          message.includes("no data found")
        ) {
          setAttendanceData([]);
          setError(""); // No error, just no data
          return;
        }
      }

      // Handle empty response data (but not 204, which we already handled)
      // Empty string or null/undefined might be valid for some APIs
      if ((result === "" || result === null || result === undefined) && response.status !== 204) {
        // Check if status is 2xx - might be valid empty response
        if (response.status >= 200 && response.status < 300) {
          setAttendanceData([]);
          setError(""); // No error, just no data
          return;
        }
        setAttendanceData([]);
        setError("No response received from server. Please try again.");
        return;
      }

      // Handle different response formats
      if (result.message?.toLowerCase() === "success") {
        // Success response with data array
        if (Array.isArray(result.data)) {
          setAttendanceData(result.data);
          setError(""); // Clear error on success
        } else if (result.data === null || result.data === undefined) {
          // Success but no data
          setAttendanceData([]);
          setError(""); // No error, just empty data
        } else {
          // Unexpected data format
          setAttendanceData([]);
          setError("Unexpected response format from server.");
        }
      } else if (Array.isArray(result)) {
        // Direct array response
        setAttendanceData(result);
        setError("");
      } else if (result.data && Array.isArray(result.data)) {
        // Data wrapped in data property
        setAttendanceData(result.data);
        setError("");
      } else if (result.message) {
        // Response with message but no data
        const message = result.message.toLowerCase();
        if (
          message.includes("no record") ||
          message.includes("no records") ||
          message.includes("not found") ||
          message.includes("empty") ||
          message.includes("no data")
        ) {
          setAttendanceData([]);
          setError(""); // No error, just no data
        } else {
          setAttendanceData([]);
          setError(result.message);
        }
      } else {
        // Unknown response format
        setAttendanceData([]);
        setError("Unexpected response format from server.");
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
      
      // Handle different error types
      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        setError("Request timed out. Please check your internet connection and try again.");
      } else if (err.code === "ERR_NETWORK" || err.message?.includes("Network Error")) {
        setError("Network error. Please check your internet connection and try again.");
      } else if (err.response) {
        // API returned an error response
        const status = err.response.status;
        const errorMessage = err.response.data?.message || err.response.data?.error || err.response.statusText;
        
        // Handle 204 No Content as empty data, not error
        if (status === 204) {
          setAttendanceData([]);
          setError(""); // No error, just no data
          return;
        }
        
        // Check for "No Record Found" messages in error response
        const responseMessage = err.response.data?.message?.toLowerCase() || "";
        if (
          responseMessage.includes("no record found") ||
          responseMessage.includes("no records found") ||
          responseMessage.includes("no data found") ||
          responseMessage === "no record found" ||
          responseMessage === "no records found"
        ) {
          setAttendanceData([]);
          setError(""); // No error, just no data
          return;
        }
        
        if (status === 404) {
          setError("Attendance endpoint not found. Please contact support.");
        } else if (status === 401 || status === 403) {
          setError("You don't have permission to access attendance data.");
        } else if (status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(errorMessage || `Error ${status}: Failed to fetch attendance data.`);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError("No response from server. Please check your connection and try again.");
      } else {
        // Something else happened
        setError(err.message || "An unexpected error occurred while fetching attendance data.");
      }
      
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  }, [
    filters.student_id,
    filters.from_date,
    filters.to_date,
    filters.date,
    filters.batch_id,
    filters.course_id,
    filters.department_id,
    filters.academic_year_id,
    filters.semester_id,
    filters.section_id,
    filters.lecture_id,
    filters.subject_id,
    filters.professor_id,
    filters.enabled,
  ]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return {
    attendanceData,
    loading,
    error,
    refetch: fetchAttendance,
  };
};

export default useStudentAttendance;

