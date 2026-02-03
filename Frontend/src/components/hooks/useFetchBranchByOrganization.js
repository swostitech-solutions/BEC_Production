import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchOrganizationBranch = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchBranches = async () => {
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

        const apiUrl = `${ApiUrl.apiurl}OrganizationBranch/GetAllOrganizationBranch/`;
        console.log("Organization Branch API URL:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, //  Added token
          },
        });

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Organization Branch API Response:", data);

        if (mounted) {
          if (
            data?.message?.toLowerCase() === "success" &&
            Array.isArray(data.data)
          ) {
            setBranches(data.data);
          } else if (Array.isArray(data)) {
            setBranches(data);
          } else {
            console.warn("Unexpected API structure:", data);
            setBranches([]);
            setError("Invalid data format");
          }
        }
      } catch (err) {
        console.error("Error fetching organization branches:", err);
        if (mounted) setError(err.message || "Error fetching organization branches");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBranches();

    return () => {
      mounted = false; // cleanup to prevent state updates after unmount
    };
  }, []);

  return { branches, loading, error };
};

export default useFetchOrganizationBranch;
