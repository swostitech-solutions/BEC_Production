import { useState, useEffect } from "react";
import api from "../../utils/api";

/**
 * Custom hook to fetch bank list
 * @returns {object} - { banks, loading, error }
 */
const useBanks = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setLoading(true);
        setError("");

        const orgId = localStorage.getItem("orgId");
        const branchId = localStorage.getItem("branchId");

        if (!orgId || !branchId) {
          setError("Missing organization or branch ID");
          setBanks([]);
          return;
        }

        const response = await api.get("BANK/GetAllBankList/", {
          params: {
            organization_id: orgId,
            branch_id: branchId,
          },
        });

        const result = response.data;

        if (result.message === "No Record Found!" || result.message === "No record found!!") {
          setBanks([]);
          setError("No banks found.");
        } else if (result.data && Array.isArray(result.data)) {
          setBanks(result.data);
          setError("");
        } else if (result.message === "Success" && result.data) {
          setBanks(result.data);
          setError("");
        } else {
          setBanks([]);
          setError("Failed to fetch bank list");
        }
      } catch (err) {
        console.error("Error fetching banks:", err);
        setError("Error fetching banks");
        setBanks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  return { banks, loading, error };
};

export default useBanks;

