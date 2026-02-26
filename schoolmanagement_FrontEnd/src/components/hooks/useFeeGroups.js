// ✅ src/hooks/useFeeGroups.js
import { useState, useEffect, useCallback } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFeeGroups = () => {
  const [feeGroups, setFeeGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeeStructure = useCallback(async () => {
    const organizationId = localStorage.getItem("selectedOrganizationId");
    const academicYearId = localStorage.getItem("selectedAcademicYearId");
    const courseId = localStorage.getItem("selectedCourseId");
    const categoryId = localStorage.getItem("selectedCategoryId");
    const token = localStorage.getItem("accessToken");

    // ✅ Must have org + academic year, and at least course or category
    if (!organizationId || !academicYearId || (!courseId && !categoryId)) {
      console.log("⚠️ Missing required fields for Fee Group fetch");
      setFeeGroups([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // ✅ Build URL dynamically based on available filters
      let url = `${ApiUrl.apiurl}FeeStructure/GetAllFeeStructureBasedOnCourse/?organization_id=${organizationId}&academic_year_id=${academicYearId}`;
      if (courseId) url += `&course_id=${courseId}`;
      if (categoryId) url += `&category_code=${categoryId}`;

      console.log("📡 Fetching Fee Groups:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(`Failed to fetch Fee Groups (${response.status})`);

      const data = await response.json();
      console.log("✅ Fee Group Response:", data);

      setFeeGroups(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("❌ Fee Group Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const handleReload = () => {
      console.log("🔁 Fee Group dependencies changed — fetching...");
      fetchFeeStructure();
    };

    window.addEventListener("feeGroupDependenciesChanged", handleReload);
    fetchFeeStructure();

    return () => window.removeEventListener("feeGroupDependenciesChanged", handleReload);
  }, [fetchFeeStructure]);

  return { feeGroups, loading, error };
};

export default useFeeGroups;
