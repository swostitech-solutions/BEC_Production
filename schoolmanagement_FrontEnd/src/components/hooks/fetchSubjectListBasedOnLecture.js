// ✅ src/hooks/useFetchSubjectListBasedOnLecture.js
import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchSubjectListBasedOnLecture = (
  organizationId,
  branchId,
  batchId,
  courseId,
  departmentId,
  academicYearId,
  semesterId,
  sectionId,
  lectureId,
  date
) => {
  const [SubjectList, setSubjectList] = useState([]);
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
      !sectionId ||
      !lectureId ||
      !date
    ) {
      setSubjectList([]);
      return;
    }

    let mounted = true;

    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Access token not found in localStorage.");
          setError("Unauthorized: Missing access token.");
          return;
        }

        // ✅ Build dynamic API URL
        const apiUrl = `${ApiUrl.apiurl}Subjects/GetSubjectListBasedOnLecture/?organization_id=${organizationId}&branch_id=${branchId}&batch_id=${batchId}&course_id=${courseId}&department_id=${departmentId}&academic_year_id=${academicYearId}&semester_id=${semesterId}&section_id=${sectionId}&lecture_id=${lectureId}&date=${date}`;
        console.log("SubjectListBasedOnLecture API URL:", apiUrl);

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
        console.log("SubjectListBasedOnLecture API Response:", result);

        if (mounted) {
          // ✅ Handle different API response shapes
          if (Array.isArray(result)) {
            setSubjectList(result);
          } else if (
            result.message?.toLowerCase() === "success" &&
            Array.isArray(result.data)
          ) {
            setSubjectList(result.data);
          } else {
            setSubjectList([]);
          }
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSubjects();

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
    lectureId,
    date,
  ]);

  return { SubjectList, loading, error };
};

export default useFetchSubjectListBasedOnLecture;
