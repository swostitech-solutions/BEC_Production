// ✅ src/hooks/useFetchLectureList.js
import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchLectureList = (
  organizationId,
  branchId,
  batchId,
  courseId,
  departmentId,
  academicYearId,
  semesterId,
  sectionId
) => {
  const [LectureList, setLectureList] = useState([]);
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
      !academicYearId ||
      !semesterId ||
      !sectionId
    ) {
      setLectureList([]);
      return;
    }

    let mounted = true;

    const fetchLectures = async () => {
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

        // ✅ Build dynamic API URL
        // const apiUrl = `${ApiUrl.apiurl}Lecture/GetLectureList/?organization_id=${organizationId}&branch_id=${branchId}&batch_id=${batchId}&course_id=${courseId}&department_id=${departmentId}&academic_year_id=${academicYearId}&semester_id=${semesterId}&section_id=${sectionId}`;
        const apiUrl = `${ApiUrl.apiurl}LecturePeriod/GetLecturePeriodList/?organization_id=${organizationId}&branch_id=${branchId}`;
        console.log("Lecture API URL:", apiUrl);

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
        console.log("Lecture API Response:", result);

        if (mounted) {
          // ✅ The API returns a direct array
          if (Array.isArray(result)) {
            setLectureList(result);
          } else if (
            result.message?.toLowerCase() === "success" &&
            Array.isArray(result.data)
          ) {
            setLectureList(result.data);
          } else {
            setLectureList([]);
          }
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchLectures();

    return () => {
      mounted = false;
    };
  }, [
    organizationId,
    branchId,
    batchId,
    courseId,
    departmentId,
    academicYearId,
    semesterId,
    sectionId,
  ]);

  return { LectureList, loading, error };
};

export default useFetchLectureList;
