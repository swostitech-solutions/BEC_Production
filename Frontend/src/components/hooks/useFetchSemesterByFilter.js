
//  src/hooks/useFetchSemesterByFilter.js
import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchSemesterByFilter = (
  organizationId,
  branchId,
  batchId,
  courseId,
  departmentId,
  academicYearId
) => {
  const [SemesterList, setSemesterList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset list if dependencies are missing
    if (
      !organizationId ||
      !branchId ||
      !batchId ||
      !courseId ||
      !departmentId ||
      !academicYearId
    ) {
      setSemesterList([]);
      return;
    }

    let mounted = true;

    const fetchSemesterList = async () => {
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
        const apiUrl = `${ApiUrl.apiurl}Semester/GetSemester/?organization_id=${organizationId}&branch_id=${branchId}&batch_id=${batchId}&course_id=${courseId}&department_id=${departmentId}&academic_year_id=${academicYearId}`;
        console.log("Semester API URL:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        console.log("Semester API Response:", result);

        if (mounted) {
          //  New API directly returns an array
          if (Array.isArray(result)) {
            setSemesterList(result);
          } else {
            setSemesterList([]);
          }
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSemesterList();

    return () => {
      mounted = false;
    };
  }, [organizationId, branchId, batchId, courseId, departmentId, academicYearId]);

  return { SemesterList, loading, error };
};

export default useFetchSemesterByFilter;

