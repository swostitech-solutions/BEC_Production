import { useEffect, useState } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchPickupPoints = (routeId) => {
  const [pickupPoints, setPickupPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPickupPoints = async () => {
      if (!routeId) {
        setPickupPoints([]);
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken"); // ✅ token key consistency

        if (!token) {
          throw new Error("Authorization token not found in local storage");
        }

        // 🔥 Get organization_id & branch_id
        const orgId = sessionStorage.getItem("organization_id") || 1;
        const branchId = sessionStorage.getItem("branch_id") || 1;

        // 🔥 Updated URL with parameters
        const url = `${ApiUrl.apiurl}Transport/GetAllPickupPointBasedOnRoute/?route_id=${routeId}&organization_id=${orgId}&branch_id=${branchId}`;
        console.log("📡 Fetching pickup points from:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Added token header
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch pick-up points. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Pickup points data:", data);
        setPickupPoints(data.data || []);
      } catch (err) {
        console.error("❌ Error fetching pickup points:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPickupPoints();
  }, [routeId]);

  return { pickupPoints, loading, error };
};

export default useFetchPickupPoints;
