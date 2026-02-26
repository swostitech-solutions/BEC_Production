import { useState, useEffect } from "react";
import api from "../../utils/api";

/**
 * Custom hook to fetch bank account details based on bank ID
 * @param {string|number} bankId - The bank ID to fetch accounts for
 * @returns {object} - { accounts, loading, error, refetch }
 */
const useBankAccounts = (bankId) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAccounts = async () => {
    if (!bankId) {
      setAccounts([]);
      setError("");
      return Promise.resolve();
    }

    try {
      setLoading(true);
      setError("");

      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");

      if (!orgId || !branchId) {
        setError("Missing organization or branch ID");
        setAccounts([]);
        return Promise.resolve();
      }

      const response = await api.get("AccountDetails/GetAccountDetailsBasedOnBankId/", {
        params: {
          organization_id: orgId,
          branch_id: branchId,
          bank_id: bankId,
        },
      });

      const result = response.data;

      if (result.message === "No Record Found!" || result.message === "No record found!!") {
        setAccounts([]);
        setError("No accounts found for this bank.");
      } else if (result.data && Array.isArray(result.data)) {
        setAccounts(result.data);
        setError("");
      } else if (result.message === "success" && result.data) {
        setAccounts(result.data);
        setError("");
      } else {
        setAccounts([]);
        setError("No accounts found for this bank.");
      }
    } catch (err) {
      console.error("Error fetching account details:", err);
      setError("Error fetching account details");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [bankId]);

  return { accounts, loading, error, refetch: fetchAccounts };
};

export default useBankAccounts;

