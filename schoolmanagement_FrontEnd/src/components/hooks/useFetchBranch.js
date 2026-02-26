//  src/hooks/useFetchBranch.js
import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchBranch = (organizationId, branchId, batchId, courseId) => {
  const [BranchList, setBranchList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If any required value is missing, clear list
    if (!organizationId || !branchId || !batchId || !courseId) {
      setBranchList([]);
      return;
    }

    let mounted = true;

    const fetchBranchList = async () => {
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
        const apiUrl = `${ApiUrl.apiurl}Department/GetDepartment/?organization_id=${organizationId}&branch_id=${branchId}&batch_id=${batchId}&course_id=${courseId}`;
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
          //  The new API directly returns an array
          if (Array.isArray(result)) {
            setBranchList(result);
          } else {
            setBranchList([]);
          }
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBranchList();

    return () => {
      mounted = false;
    };
  }, [organizationId, branchId, batchId, courseId]);

  return { BranchList, loading, error };
};

export default useFetchBranch;


