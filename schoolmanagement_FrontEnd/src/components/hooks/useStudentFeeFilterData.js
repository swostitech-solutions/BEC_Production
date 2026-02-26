import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";

/**
 * Custom hook to fetch student fee data from GetFilterStudentFilterdataBasedOnCondition API
 * @param {string|number} collegeAdmissionNo - The college admission number
 * @returns {object} - { studentData, feedetails, loading, error, refetch }
 */
const useStudentFeeFilterData = (collegeAdmissionNo) => {
  const [studentData, setStudentData] = useState(null);
  const [feedetails, setFeedetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStudentFeeData = useCallback(async () => {
    if (!collegeAdmissionNo) {
      setStudentData(null);
      setFeedetails([]);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const orgId =
        localStorage.getItem("orgId") ||
        sessionStorage.getItem("organization_id");
      const branchId =
        localStorage.getItem("branchId") ||
        sessionStorage.getItem("branch_id");

      if (!orgId || !branchId) {
        setError("Missing organization or branch ID");
        setStudentData(null);
        setFeedetails([]);
        return;
      }

      const response = await api.get(
        "Filter/GetFilterStudentFilterdataBasedOnCondition/",
        {
          params: {
            flag: "y",
            college_admission_no: collegeAdmissionNo,
            organization_id: orgId,
            branch_id: branchId,
          },
        }
      );

      const result = response.data;

      if (result.message === "success!!" && result.data) {
        setStudentData(result.data);
        setFeedetails(result.data.feedetails || []);
        setError("");
      } else {
        setStudentData(null);
        setFeedetails([]);
        setError(result.message || "Failed to fetch student fee data");
      }
    } catch (err) {
      console.error("Error fetching student fee data:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error fetching student fee data"
      );
      setStudentData(null);
      setFeedetails([]);
    } finally {
      setLoading(false);
    }
  }, [collegeAdmissionNo]);

  useEffect(() => {
    fetchStudentFeeData();
  }, [fetchStudentFeeData]);

  return {
    studentData,
    feedetails,
    loading,
    error,
    refetch: fetchStudentFeeData,
  };
};

export default useStudentFeeFilterData;

