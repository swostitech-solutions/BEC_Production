// ✅ src/hooks/useFetchCategories.js
import { useState, useEffect } from 'react';
import { ApiUrl } from '../../ApiUrl';

const useFetchCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchCategories = async () => {
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

        const apiUrl = `${ApiUrl.apiurl}CATEGORY/GetAllCategory/`;
        console.log("Category API URL:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Token added here
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Category API Response:", data);

        if (mounted) {
          if (data?.message?.toLowerCase() === "success" && Array.isArray(data.data)) {
            setCategories(data.data);
          } else if (Array.isArray(data)) {
            setCategories(data);
          } else {
            console.warn("Unexpected API structure:", data);
            setCategories([]);
            setError("Invalid data format");
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        if (mounted) setError(err.message || "Error fetching categories");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCategories();

    return () => {
      mounted = false; // cleanup to prevent state updates after unmount
    };
  }, []);

  return { categories, loading, error };
};

export default useFetchCategories;
