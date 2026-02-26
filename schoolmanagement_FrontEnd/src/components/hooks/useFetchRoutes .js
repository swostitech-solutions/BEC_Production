import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchRoutes = (isTransportAvailed) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      if (!isTransportAvailed) {
        setRoutes([]);
        setLoading(false);
        return;
      }

      try {
        const orgId = sessionStorage.getItem("organization_id") || 1;
        const branchId = sessionStorage.getItem("branch_id") || 1;
        const token = localStorage.getItem("token");

        const url = `${ApiUrl.apiurl}Transport/routemasterlist/?organization_id=${orgId}&branch_id=${branchId}`;
        console.log("Fetching Routes URL:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }), // add token only if present
          },
        });

        if (!response.ok) {
          const text = await response.text();
          console.error("❌ Route fetch failed:", text);
          throw new Error(`Failed to fetch routes: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Route API response:", data);

        if (Array.isArray(data)) {
          setRoutes(data);
        } else if (data?.data && Array.isArray(data.data)) {
          setRoutes(data.data);
        } else {
          setRoutes([]);
        }
        setError(null);
      } catch (err) {
        console.error("Route Fetch Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [isTransportAvailed]);

  return { routes, loading, error };
};

export default useFetchRoutes;
