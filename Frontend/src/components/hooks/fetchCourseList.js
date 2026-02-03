// src/hooks/fetchCourseList.js
import { useState, useEffect } from "react";

const useFetchCourseList = () => {
  const [courseList, setCourseList] = useState([]); // always start as array
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "${ApiUrl.apiurl}Course/GetAllCourse/"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Course API Response:", data);

        // Defensive: ensure we always set an array
        if (mounted) {
          // Handle both data.data and direct array responses
          if (Array.isArray(data.data)) {
            setCourseList(data.data);
          } else if (Array.isArray(data)) {
            setCourseList(data);
          } else {
            setCourseList([]);
          }
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        if (mounted) {
          setError(err.message || "Failed to fetch courses");
          setCourseList([]); // ensure array on error
        }
      }
    };

    fetchCourses();

    return () => {
      mounted = false;
    };
  }, []);

  return { courseList, error };
};

export default useFetchCourseList;
