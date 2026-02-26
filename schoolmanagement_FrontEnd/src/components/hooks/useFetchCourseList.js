import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchCourseList = (organizationId, batchId) => {
  const [CourseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure all required IDs exist
    if (!organizationId || (!batchId || (Array.isArray(batchId) && batchId.length === 0))) {
      setCourseList([]);
      return;
    }

    let mounted = true;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        const branchId = sessionStorage.getItem("branch_id");

        if (!token) {
          setError("Unauthorized: Missing access token.");
          return;
        }

        let url = `${ApiUrl.apiurl}Course/GetCourse/?organization_id=${Number(organizationId)}&branch_id=${Number(branchId)}`;

        if (Array.isArray(batchId)) {
          if (batchId.length > 0) {
            url += `&batch_ids=[${batchId.join(",")}]`;
          } else {
            setCourseList([]);
            return;
          }
        } else if (batchId) {
          url += `&batch_id=${Number(batchId)}`;
        }

        console.log(" Fetching Course List:", url);

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
          if (Array.isArray(result.data)) {
            setCourseList(result.data);
          } else if (Array.isArray(result)) {
            setCourseList(result);
          } else {
            setCourseList([]);
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Error fetching courses");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCourses();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId, JSON.stringify(batchId)]);

  return { CourseList, loading, error };
};

export default useFetchCourseList;
