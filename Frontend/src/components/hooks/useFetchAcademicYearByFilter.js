
//  src/hooks/useFetchAcademicYearByFilter.js
import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchAcademicYearByFilter = (organizationId, branchId, batchId, courseId, departmentId) => {
  const [AcademicYearList, setAcademicYearList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset list if any dependency is missing
    if (!organizationId || !branchId || !batchId || !courseId || !departmentId) {
      setAcademicYearList([]);
      return;
    }

    let mounted = true;

    const fetchAcademicYears = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        const branchId = sessionStorage.getItem("branch_id");
        const organizationId = sessionStorage.getItem("organization_id");
        if (!token) {
          console.error("Access token not found in localStorage.");
          setError("Unauthorized: Missing access token.");
          return;
        }

        //  Build dynamic API URL
        const apiUrl = `${ApiUrl.apiurl}AcademicYear/GetAcademicYear/?organization_id=${organizationId}&branch_id=${branchId}&batch_id=${batchId}&course_id=${courseId}&department_id=${departmentId}`;
        console.log("Academic Year API URL:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        console.log("Academic Year API Response:", result);

        if (mounted) {
          //  New API returns a direct array
          if (Array.isArray(result)) {
            setAcademicYearList(result);
          } else {
            setAcademicYearList([]);
          }
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAcademicYears();

    return () => {
      mounted = false;
    };
  }, [organizationId, branchId, batchId, courseId, departmentId]);

  return { AcademicYearList, loading, error };
};

export default useFetchAcademicYearByFilter;

