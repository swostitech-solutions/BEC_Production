// ✅ src/hooks/useFetchOrganizationList.js
import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchOrganizationList = () => {
  const [OrganizationList, setOrganizationList] = useState([]); // store API data
  const [error, setError] = useState(null); // store error if any

  useEffect(() => {
    let mounted = true; // prevent state updates if component unmounted

    const fetchOrganizationList = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Access token not found in localStorage.");
          setError("Unauthorized: Missing access token.");
          return;
        }

        const apiUrl = `${ApiUrl.apiurl}Organization/GetAllOrganization/`;
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        console.log("Organization API Response:", result);

        if (mounted) {
          // ✅ Fix case sensitivity in message check
          if (result.message?.toLowerCase() === "no record found!") {
            setOrganizationList([]);
          } else if (result.message?.toLowerCase() === "success" && Array.isArray(result.data)) {
            setOrganizationList(result.data);
          } else {
            // fallback: if data is directly an array
            setOrganizationList(Array.isArray(result) ? result : []);
          }
        }
      } catch (err) {
        if (mounted) {
          console.error("Error fetching organizations:", err);
          setError(err.message);
        }
      }
    };

    fetchOrganizationList();

    return () => {
      mounted = false;
    };
  }, []);

  return { OrganizationList, error };
};

export default useFetchOrganizationList;
