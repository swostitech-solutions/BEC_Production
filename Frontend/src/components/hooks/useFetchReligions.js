// ✅ src/hooks/useFetchReligions.js
import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchReligions = () => {
  const [religions, setReligions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchReligions = async () => {
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

        const apiUrl = `${ApiUrl.apiurl}RELIGION/GetAllReligion/`;
        console.log("Religion API URL:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Added token here
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Religion API Response:", data);

        if (mounted) {
          if (data?.message?.toLowerCase() === "success" && Array.isArray(data.data)) {
            setReligions(data.data);
          } else if (Array.isArray(data)) {
            setReligions(data);
          } else {
            console.warn("Unexpected API structure:", data);
            setError("Invalid data format");
            setReligions([]);
          }
        }
      } catch (error) {
        console.error("Error fetching religions:", error);
        if (mounted) setError(error.message || "Error fetching religions");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchReligions();

    return () => {
      mounted = false; // cleanup to avoid memory leaks
    };
  }, []);

  return { religions, loading, error };
};

export default useFetchReligions;
