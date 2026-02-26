// ✅ src/hooks/useFetchBloodGroups.js
import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchBloodGroups = () => {
  const [bloodGroups, setBloodGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchBloodGroups = async () => {
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

        const apiURL = `${ApiUrl.apiurl}BLOODGROUP/GetAllBloodGroupList/`;
        console.log("Blood Group API URL:", apiURL);

        const response = await fetch(apiURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Token added here
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        console.log("Blood Group API Response:", result);

        if (mounted) {
          if (result.message?.toLowerCase() === "success" && Array.isArray(result.data)) {
            setBloodGroups(result.data);
          } else if (Array.isArray(result)) {
            setBloodGroups(result);
          } else {
            console.warn("Unexpected API structure:", result);
            setBloodGroups([]);
          }
        }
      } catch (err) {
        console.error("Error fetching blood groups:", err);
        if (mounted) setError(err.message || "Failed to fetch blood groups");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBloodGroups();

    return () => {
      mounted = false; // cleanup to prevent memory leaks
    };
  }, []);

  return { bloodGroups, loading, error };
};

export default useFetchBloodGroups;
