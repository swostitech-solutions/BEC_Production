import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchSectionList = (
  organizationId,
  branchId,
  batchId,
  courseId,
  departmentId,
  academicYearId,
  semesterId
) => {
  const [SectionList, setSectionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (
      !organizationId ||
      !branchId ||
      (!batchId || (Array.isArray(batchId) && batchId.length === 0)) ||
      (!courseId || (Array.isArray(courseId) && courseId.length === 0)) ||
      (!departmentId || (Array.isArray(departmentId) && departmentId.length === 0)) ||
      (!academicYearId || (Array.isArray(academicYearId) && academicYearId.length === 0)) ||
      (!semesterId || (Array.isArray(semesterId) && semesterId.length === 0))
    ) {
      setSectionList([]);
      return;
    }

    let mounted = true;

    const fetchSections = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("Unauthorized: Missing access token.");
          return;
        }

        let url = `${ApiUrl.apiurl}Section/GetSection/?organization_id=${organizationId}&branch_id=${branchId}`;

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

        if (Array.isArray(departmentId) && departmentId.length > 0) {
          url += `&department_ids=[${departmentId.join(",")}]`;
        } else if (departmentId) {
          url += `&department_id=${departmentId}`;
        }

        if (Array.isArray(academicYearId) && academicYearId.length > 0) {
          url += `&academic_year_ids=[${academicYearId.join(",")}]`;
        } else if (academicYearId) {
          url += `&academic_year_id=${academicYearId}`;
        }

        if (Array.isArray(semesterId) && semesterId.length > 0) {
          url += `&semester_ids=[${semesterId.join(",")}]`;
        } else if (semesterId) {
          url += `&semester_id=${semesterId}`;
        }

        console.log("Section API URL:", url);

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
            setSectionList(result);
          } else {
            setSectionList([]);
          }
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSections();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    organizationId,
    branchId,
    JSON.stringify(batchId),
    JSON.stringify(courseId),
    JSON.stringify(departmentId),
    JSON.stringify(academicYearId),
    JSON.stringify(semesterId),
  ]);

  return { SectionList, loading, error };
};

export default useFetchSectionList;
