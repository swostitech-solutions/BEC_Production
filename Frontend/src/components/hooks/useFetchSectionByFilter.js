// // ✅ src/hooks/useFetchSectionByFilter.js
// import { useState, useEffect } from "react";
// import { ApiUrl } from "../../ApiUrl";

// const useFetchSectionByFilter = (
//   organizationId,
//   batchId,
//   courseId,
//   departmentId,
//   academicYearId,
//   semesterId
// ) => {
//   const [SectionList, setSectionList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // reset if dependencies missing
//     if (!organizationId || !batchId || !courseId || !departmentId || !academicYearId || !semesterId) {
//       setSectionList([]);
//       return;
//     }

//     let mounted = true;

//     const fetchSections = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const token = localStorage.getItem("accessToken");
//         if (!token) {
//           console.error("Access token not found in localStorage.");
//           setError("Unauthorized: Missing access token.");
//           return;
//         }

//         const apiUrl = `${ApiUrl.apiurl}Section/GetAllSectionByFilter/?organization_id=${organizationId}&batch_id=${batchId}&course_id=${courseId}&department_id=${departmentId}&academic_year_id=${academicYearId}&semester_id=${semesterId}`;
//         console.log("Section API URL:", apiUrl);

//         const response = await fetch(apiUrl, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//         const result = await response.json();
//         console.log("Section API Response:", result);

//         if (mounted) {
//           if (result.message?.toLowerCase() === "success" && Array.isArray(result.data)) {
//             setSectionList(result.data);
//           } else if (Array.isArray(result)) {
//             setSectionList(result);
//           } else {
//             setSectionList([]);
//           }
//         }
//       } catch (err) {
//         if (mounted) setError(err.message);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     fetchSections();

//     return () => {
//       mounted = false;
//     };
//   }, [organizationId, batchId, courseId, departmentId, academicYearId, semesterId]);

//   return { SectionList, loading, error };
// };

// export default useFetchSectionByFilter;



// ✅ src/hooks/useFetchSectionByFilter.js
import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchSectionByFilter = (
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
    // Reset list if dependencies are missing
    if (
      !organizationId ||
      !branchId ||
      !batchId ||
      !courseId ||
      !departmentId ||
      !academicYearId ||
      !semesterId
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
        const branchId = sessionStorage.getItem("branch_id");
        const organizationId = sessionStorage.getItem("organization_id");
        if (!token) {
          console.error("Access token not found in localStorage.");
          setError("Unauthorized: Missing access token.");
          return;
        }

        // ✅ Build dynamic API URL
        const apiUrl = `${ApiUrl.apiurl}Section/GetSection/?organization_id=${organizationId}&branch_id=${branchId}&batch_id=${batchId}&course_id=${courseId}&department_id=${departmentId}&academic_year_id=${academicYearId}&semester_id=${semesterId}`;
        console.log("Section API URL:", apiUrl);

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
        console.log("Section API Response:", result);

        if (mounted) {
          // ✅ The new API returns a direct array
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
  }, [
    organizationId,
    branchId,
    batchId,
    courseId,
    departmentId,
    academicYearId,
    semesterId,
  ]);

  return { SectionList, loading, error };
};

export default useFetchSectionByFilter;

