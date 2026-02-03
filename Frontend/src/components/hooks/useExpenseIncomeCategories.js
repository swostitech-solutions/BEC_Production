import { useState, useEffect } from "react";
import api from "../../utils/api";

/**
 * Custom hook to fetch expense or income categories
 * @param {string} flag - 'E' for expense, 'I' for income
 * @returns {object} - { categories, loading, error }
 */
const useExpenseIncomeCategories = (flag = "E") => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const orgId = localStorage.getItem("orgId");
        const batchId = localStorage.getItem("academicSessionId"); // This is batch_id

        if (!orgId || !batchId) {
          setError("Missing organization or batch ID");
          setCategories([]);
          return;
        }

        const response = await api.get("EXPENSE/EXPENSE_INCOME/ListBasedOnCategory/", {
          params: {
            organization_id: orgId,
            batch_id: batchId,
            flag: flag,
          },
        });

        const data = response.data;

        if (data.message === "success" && Array.isArray(data.data)) {
          // Return original data structure for backward compatibility
          // Also includes value/label for React Select if needed
          const formatted = data.data.map((category) => ({
            ...category, // Original data (expense_category_id, expense_category, etc.)
            value: category.expense_category_id, // For React Select compatibility
            label: category.expense_category, // For React Select compatibility
          }));
          setCategories(formatted);
        } else {
          setCategories([]);
          setError("No categories found");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to fetch categories");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [flag]);

  return { categories, loading, error };
};

export default useExpenseIncomeCategories;

