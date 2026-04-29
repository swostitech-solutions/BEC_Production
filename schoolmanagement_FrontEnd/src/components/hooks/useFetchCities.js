// // ✅ src/hooks/useFetchCities.js
// import { useState, useEffect } from "react";
// import { ApiUrl } from "../../ApiUrl";

// const useFetchCities = () => {
//   const [cities, setCities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let mounted = true;

//     const fetchCities = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const token = localStorage.getItem("accessToken");
//         if (!token) {
//           console.error("Access token not found in localStorage.");
//           setError("Unauthorized: Missing access token.");
//           setLoading(false);
//           return;
//         }

//         const apiURL = `${ApiUrl.apiurl}CITY/GetAllCity/`;
//         console.log("City API URL:", apiURL);

//         const response = await fetch(apiURL, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // ✅ Token added here
//           },
//         });

//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//         const result = await response.json();
//         console.log("City API Response:", result);

//         if (mounted) {
//           if (result.message?.toLowerCase() === "success" && Array.isArray(result.data)) {
//             setCities(result.data);
//           } else if (Array.isArray(result)) {
//             setCities(result);
//           } else {
//             console.warn("Unexpected API structure:", result);
//             setCities([]);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching cities:", err);
//         if (mounted) setError(err.message || "Failed to fetch cities");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     fetchCities();

//     return () => {
//       mounted = false; // cleanup to prevent memory leaks
//     };
//   }, []);

//   return { cities, loading, error };
// };

// export default useFetchCities;


// ✅ Final Correct useFetchCities.js
import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";
import useFetchStates from "./useFetchStates";

const useFetchCities = (selectedCountryName, selectedStateName) => {
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [errorCities, setErrorCities] = useState(null);

  const { states } = useFetchStates(selectedCountryName);

  const isSameValue = (left, right) =>
    String(left ?? "").trim().toLowerCase() ===
    String(right ?? "").trim().toLowerCase();

  useEffect(() => {
    if (!selectedStateName || states.length === 0) return;

    // 🔥 Find state ID
    const matchedState = states.find(
      (s) =>
        isSameValue(s.state_name, selectedStateName) ||
        isSameValue(s.id, selectedStateName) ||
        isSameValue(s.state_id, selectedStateName)
    );

    if (!matchedState) {
      console.log("❌ No state ID found for:", selectedStateName);
      return;
    }

    const stateId = matchedState.id;

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const apiURL = `${ApiUrl.apiurl}City/GetCityListBasedOnStateId/${stateId}`;

        const token = localStorage.getItem("accessToken");
        const response = await fetch(apiURL, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (
          data.message?.toLowerCase() === "success" &&
          Array.isArray(data.data)
        ) {
          setCities(data.data);
        } else {
          setCities([]);
        }
      } catch (error) {
        setErrorCities(error.message);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [selectedStateName, states]);

  return { cities, loadingCities, errorCities };
};

export default useFetchCities;
