// import { useState, useEffect } from "react";
// import { ApiUrl } from "../../ApiUrl";

// const useFetchStates = (countryCode) => {
//   const [states, setStates] = useState([]);
//   const [loadingStates, setLoading] = useState(false);
//   const [errorStates, setError] = useState(null);

//   useEffect(() => {
//     if (!countryCode) return; // wait until a country is selected

//     const fetchStates = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem("accessToken");
//         const res = await fetch(
//           `${ApiUrl.apiurl}STATE/GetAllState/`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await res.json();
//         if (data.message === "Success" && Array.isArray(data.data)) {
//           setStates(data.data);
//         } else {
//           setStates([]);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStates();
//   }, [countryCode]);

//   return { states, loadingStates, errorStates };
// };

// export default useFetchStates;



// ✅ Updated useFetchStates.js
import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";
import useFetchCountries from "./useFetchCountries";

const useFetchStates = (selectedCountryName) => {
  const [states, setStates] = useState([]);
  const [loadingStates, setLoading] = useState(false);
  const [errorStates, setError] = useState(null);

  // ✅ Get country list to find country ID
  const { countries } = useFetchCountries();

  useEffect(() => {
    if (!selectedCountryName || countries.length === 0) return;

    // 🔥 Find the country ID based on country_name
    const matchedCountry = countries.find(
      (c) => c.country_name.toLowerCase() === selectedCountryName.toLowerCase()
    );

    if (!matchedCountry) {
      console.log("❌ Country ID not found for:", selectedCountryName);
      return;
    }

    const countryId = matchedCountry.id;

    const fetchStates = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const apiURL = `${ApiUrl.apiurl}State/GetStateListBasedOnCountryId/${countryId}`;

        const res = await fetch(apiURL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.message?.toLowerCase() === "success" && Array.isArray(data.data)) {
          setStates(data.data);
        } else {
          setStates([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, [selectedCountryName, countries]);

  return { states, loadingStates, errorStates };
};

export default useFetchStates;

