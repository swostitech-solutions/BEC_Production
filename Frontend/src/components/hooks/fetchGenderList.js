// ✅ src/hooks/useFetchGenderList.js
import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchGenderList = () => {
  const [genders, setGenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchGenderList = async () => {
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

        // ✅ Gender API URL
        const apiUrl = `${ApiUrl.apiurl}Gender/GetAllGenderList/`;
        console.log("Gender List API URL:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Token header
          },
        });

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Gender API Response:", data);

        if (mounted) {
          // ✅ Handles both formats: { message, data } or direct array
          if (
            data?.message?.toLowerCase() === "success" &&
            Array.isArray(data.data)
          ) {
            setGenders(data.data);
          } else if (Array.isArray(data)) {
            setGenders(data);
          } else {
            console.warn("Unexpected API structure:", data);
            setGenders([]);
            setError("Invalid data format");
          }
        }
      } catch (err) {
        console.error("Error fetching gender list:", err);
        if (mounted)
          setError(err.message || "Error fetching gender list");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchGenderList();

    return () => {
      mounted = false; // cleanup
    };
  }, []);

  return { genders, loading, error };
};

export default useFetchGenderList;
