import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchDepartments = (organizationId, branchId, batchId, courseId) => {
  const [DepartmentList, setDepartmentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Basic requirement is just org and branch
    if (!organizationId || !branchId) {
      setDepartmentList([]);
      return;
    }

    let mounted = true;

    const fetchDepartmentList = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Access token not found in localStorage.");
          setError("Unauthorized: Missing access token.");
          return;
        }

        // Build URL dynamically
        // The backend supports ignoring batch/course if not provided
        let apiUrl = `${ApiUrl.apiurl}Department/GetDepartment/?organization_id=${organizationId}&branch_id=${branchId}`;

        if (batchId) apiUrl += `&batch_id=${batchId}`;
        if (courseId) apiUrl += `&course_id=${courseId}`;

        console.log("Fetching Department API URL:", apiUrl);

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
        console.log("Department API Response:", result);

        if (mounted) {
          if (Array.isArray(result)) {
            setDepartmentList(result);
          } else {
            setDepartmentList([]);
          }
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDepartmentList();

    return () => {
      mounted = false;
    };
  }, [organizationId, branchId, batchId, courseId]);

  return { DepartmentList, loading, error };
};

export default useFetchDepartments;
