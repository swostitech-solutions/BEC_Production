import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";


const useFetchBookCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchBookCategories = async () => {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        console.error("Access token not found in sessionStorage.");
        return;
      }
      const apiURL = `${ApiUrl.apiurl}BookCategory/GetAllBookCategoryList/`;
      try {
        const response = await fetch(apiURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (response.ok && result.data) {
          const formattedData = result.data.map((category) => ({
            id: category.id,
            name: category.category_name,
            description: category.category_description,
            orgId: category.orgId,
            organizationCode: category.organization_code,
            batchId: category.batch_id,
            batchDescription: category.batch_description,
            isActive: category.is_active,
          }));
          setCategories(formattedData);
        }
      } catch (err) {
        // Silently handle errors by leaving categories empty
        console.error("Error fetching book categories:", err);
      }
    };
    fetchBookCategories();
  }, []);

  return { categories };
};

export default useFetchBookCategories;
