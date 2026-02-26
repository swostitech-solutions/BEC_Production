// ✅ src/hooks/useFetchLanguages.js
import { useState, useEffect } from 'react';
import { ApiUrl } from "../../ApiUrl";

const useFetchLanguages = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchLanguages = async () => {
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

        const url = `${ApiUrl.apiurl}MOTHERTONGUE/GetAllMotherTongueList/`;
        console.log("MotherTongue API URL:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Token added here
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        console.log("Language API Response:", result);

        if (mounted) {
          if (result.message?.toLowerCase() === "success" && Array.isArray(result.data)) {
            setData(result.data);
          } else if (Array.isArray(result)) {
            setData(result);
          } else {
            console.warn("Unexpected API response:", result);
            setData([]);
          }
        }
      } catch (err) {
        console.error("Error fetching languages:", err);
        if (mounted) setError(err.message || "Error fetching language data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchLanguages();

    return () => {
      mounted = false; // cleanup to avoid memory leaks
    };
  }, []);

  return { data, loading, error };
};

export default useFetchLanguages;
