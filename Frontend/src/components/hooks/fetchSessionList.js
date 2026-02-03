// // ✅ src/hooks/useFetchSessionList.js
// import { useState, useEffect } from "react";
// import { ApiUrl } from "../../ApiUrl";

// const useFetchSessionList = (organizationId, branchId) => {
//   const [BatchList, setBatchList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Require both IDs to fetch
//     if (!organizationId || !branchId) {
//       setBatchList([]);
//       return;
//     }

//     let mounted = true;

//     const fetchBatchList = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const token = localStorage.getItem("accessToken");
//         const branchId = sessionStorage.getItem("branch_id");
//         const organizationId = sessionStorage.getItem("organization_id");
//         if (!token) {
//           console.error("Access token not found in localStorage.");
//           setError("Unauthorized: Missing access token.");
//           return;
//         }

//         // ✅ New API endpoint with branch_id and organization_id
//         const apiUrl = `${ApiUrl.apiurl}Batch/GetBatch/?branch_id=${branchId}&organization_id=${organizationId}`;
//         console.log("Batch API URL:", apiUrl);

//         const response = await fetch(apiUrl, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//         const result = await response.json();
//         console.log("Batch API Response:", result);

//         if (mounted) {
//           if (Array.isArray(result)) {
//             setBatchList(result);
//           } else if (Array.isArray(result.data)) {
//             setBatchList(result.data);
//           } else {
//             console.warn("Unexpected API structure:", result);
//             setBatchList([]);
//           }
//         }
//       } catch (err) {
//         if (mounted) {
//           console.error("Error fetching batch list:", err);
//           setError(err.message || "Error fetching batch list");
//         }
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     fetchBatchList();

//     return () => {
//       mounted = false;
//     };
//   }, [organizationId, branchId]);

//   return { BatchList, loading, error };
// };

// export default useFetchSessionList;

// ✅ src/hooks/useFetchSessionList.js
import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchSessionList = (organizationId, branchId) => {
  const [BatchList, setBatchList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch when IDs are available
    if (!organizationId || !branchId) {
      console.warn(" Missing organizationId or branchId, skipping batch fetch.");
      setBatchList([]);
      return;
    }

    let mounted = true;

    const fetchBatchList = async () => {
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

        // ✅ API endpoint
        const apiUrl = `${ApiUrl.apiurl}Batch/GetBatch/?branch_id=${branchId}&organization_id=${organizationId}`;
        console.log("📡 Fetching Batch list from:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        console.log("✅ Batch API Response:", result);

        if (!mounted) return;

        // ✅ Handle different backend structures
        if (Array.isArray(result.data)) {
          setBatchList(result.data);
        } else if (Array.isArray(result)) {
          setBatchList(result);
        } else {
          console.warn("⚠️ Unexpected Batch API structure:", result);
          setBatchList([]);
        }
      } catch (err) {
        if (mounted) {
          console.error("❌ Error fetching batch list:", err);
          setError(err.message || "Error fetching batch list");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBatchList();

    return () => {
      mounted = false;
    };
  }, [organizationId, branchId]);

  return { BatchList, loading, error };
};

export default useFetchSessionList;

