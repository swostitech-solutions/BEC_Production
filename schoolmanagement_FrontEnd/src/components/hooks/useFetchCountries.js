// ✅ src/hooks/useFetchCountries.js
import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchCountries = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Access token not found in localStorage.");
          setError("Unauthorized: Missing access token.");
          setLoading(false);
          return;
        }

        const apiURL = `${ApiUrl.apiurl}COUNTRY/GetAllCountry/`;
        console.log("Country API URL:", apiURL);

        const response = await fetch(apiURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Token added here
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        console.log("Country API Response:", result);

        if (mounted) {
          if (result.message?.toLowerCase() === "success" && Array.isArray(result.data)) {
            setCountries(result.data);
          } else if (Array.isArray(result)) {
            setCountries(result);
          } else {
            console.warn("Unexpected API structure:", result);
            setCountries([]);
          }
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
        if (mounted) setError(err.message || "Failed to fetch countries");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCountries();

    return () => {
      mounted = false; // cleanup
    };
  }, []);

  return { countries, loading, error };
};

export default useFetchCountries;
