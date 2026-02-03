import { useState, useEffect } from 'react';
import { ApiUrl } from "../../ApiUrl";

const useFetchNationalities = () => {
  const [nationalities, setNationalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Access token not found in localStorage.");
          setError("Unauthorized: Missing access token.");
          return;
        }

        const response = await fetch(`${ApiUrl.apiurl}NATIONALITY/GetAllNationality/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Token added
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.message?.toLowerCase() === "success" && Array.isArray(data.data)) {
          setNationalities(data.data);
        } else if (Array.isArray(data)) {
          setNationalities(data);
        } else {
          console.warn("Unexpected API response structure:", data);
          setNationalities([]);
        }

      } catch (err) {
        setError(err.message || "Failed to fetch nationalities");
      } finally {
        setLoading(false);
      }
    };

    fetchNationalities();
  }, []);

  return { nationalities, loading, error };
};

export default useFetchNationalities;
