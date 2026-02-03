
// src/hooks/useFetchCourseByFilter.js
import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchCourseByFilter = (organizationId, batchId) => {
  const [CourseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure all required IDs exist
    if (!organizationId || !batchId) {
      console.warn(" Skipping Course fetch: missing organizationId or batchId");
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
        const organizationId = sessionStorage.getItem("organization_id");

        if (!token) {
          console.error(" Access token not found in localStorage.");
          setError("Unauthorized: Missing access token.");
          return;
        }

        //  Make sure IDs are numbers if backend expects numeric query params
        const apiUrl = `${ApiUrl.apiurl}Course/GetCourse/?organization_id=${Number(
          organizationId
        )}&batch_id=${Number(batchId)}&branch_id=${Number(branchId)}`;

        console.log(" Fetching Course List:", apiUrl);

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
        console.log(" Course API Response:", result);

        if (!mounted) return;

        //  Handle flexible API formats
        if (Array.isArray(result.data)) {
          setCourseList(result.data);
        } else if (Array.isArray(result)) {
          setCourseList(result);
        } else {
          console.warn(" Unexpected Course API response structure:", result);
          setCourseList([]);
        }
      } catch (err) {
        if (mounted) {
          console.error(" Error fetching courses:", err);
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
  }, [organizationId, batchId]); // include both dependencies

  return { CourseList, loading, error };
};

export default useFetchCourseByFilter;

