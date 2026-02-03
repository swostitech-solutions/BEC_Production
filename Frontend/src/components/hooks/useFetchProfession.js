import { useState, useEffect } from 'react';
import { ApiUrl } from "../../ApiUrl";

const useFetchProfession = () => {
  const [profession, setProfession] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfession = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Access token not found in localStorage.");
          setError("Unauthorized: Missing access token.");
          return;
        }

        const response = await fetch(`${ApiUrl.apiurl}PROFESSION/GetAllProfession/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Added Bearer token here
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.message?.toLowerCase() === "success" && Array.isArray(data.data)) {
          setProfession(data.data);
        } else if (Array.isArray(data)) {
          setProfession(data);
        } else {
          console.warn("Unexpected API response structure:", data);
          setProfession([]);
        }

      } catch (err) {
        setError(err.message || "Failed to fetch professions");
      } finally {
        setLoading(false);
      }
    };

    fetchProfession();
  }, []);

  return { profession, loading, error };
};

export default useFetchProfession;
