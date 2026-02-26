import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchBranchList = (organizationId, branchId, batchId, courseId) => {
  const [BranchList, setBranchList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!organizationId || !branchId ||
      (!batchId || (Array.isArray(batchId) && batchId.length === 0)) ||
      (!courseId || (Array.isArray(courseId) && courseId.length === 0))) {
      setBranchList([]);
      return;
    }

    let mounted = true;

    const fetchBranchList = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("Unauthorized: Missing access token.");
          return;
        }

        let url = `${ApiUrl.apiurl}Department/GetDepartment/?organization_id=${organizationId}&branch_id=${branchId}`;

        if (Array.isArray(batchId) && batchId.length > 0) {
          url += `&batch_ids=[${batchId.join(",")}]`;
        } else if (batchId) {
          url += `&batch_id=${batchId}`;
        }

        if (Array.isArray(courseId) && courseId.length > 0) {
          url += `&course_ids=[${courseId.join(",")}]`;
        } else if (courseId) {
          url += `&course_id=${courseId}`;
        }

        console.log("Fetching Department API URL:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();

        if (mounted) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId, branchId, JSON.stringify(batchId), JSON.stringify(courseId)]);

  return { BranchList, loading, error };
};

export default useFetchBranchList;
