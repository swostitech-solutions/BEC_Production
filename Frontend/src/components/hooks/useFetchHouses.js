// ✅ src/hooks/useFetchHouses.js
import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchHouses = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchHouses = async () => {
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

        const apiUrl = `${ApiUrl.apiurl}CollegeHouse/GetAllHouse/`;
        console.log("House API URL:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Token passed here
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        console.log("House API Response:", result);

        if (mounted) {
          if (result.message?.toLowerCase() === "success" && Array.isArray(result.data)) {
            setHouses(result.data);
          } else if (Array.isArray(result)) {
            setHouses(result);
          } else {
            setHouses([]);
            console.warn("Unexpected API structure:", result);
          }
        }
      } catch (err) {
        if (mounted) {
          console.error("Fetch error:", err);
          setError(err.message || "Error fetching house data");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchHouses();

    return () => {
      mounted = false; // cleanup
    };
  }, []);

  return { houses, loading, error };
};

export default useFetchHouses;
