import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchBookSubCategories = (categoryId) => {
  const [subCategories, setSubCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message
  useEffect(() => {
    if (!categoryId) {
      setSubCategories([]);
      setErrorMessage(""); // Clear previous messages
      return;
    }
    const fetchBookSubCategories = async () => {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        console.error("Access token not found in sessionStorage.");
        setErrorMessage("Unauthorized: Missing access token.");
        return;
      }
      const apiURL = `${ApiUrl.apiurl}BookSubCategory/GetBookSubCategoryBasedOnCategory/${categoryId}`;
      try {
        const response = await fetch(apiURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (response.ok) {
          if (result.message === "No Record Found!") {
            console.log("No Record Found!");
            setErrorMessage("No Record Found!");
            setSubCategories([]); // Clear subCategories if no records
          } else if (result.message === "Success" && result.data.length > 0) {
            setErrorMessage(""); // Clear error message
            const formattedData = result.data.map((subCategory) => ({
              id: subCategory.id,
              categoryId: subCategory.categoryId,
              categoryName: subCategory.categoryName,
              name: subCategory.Subcategory_name,
              description: subCategory.Subcategory_description,
              isActive: subCategory.is_active,
            }));
            setSubCategories(formattedData);
          }
        } else {
          console.error("Error fetching subcategories:", result.message);
          setErrorMessage("Failed to fetch subcategories.");
          setSubCategories([]); // Clear subCategories in case of error
        }
      } catch (err) {
        console.error("Error fetching book subcategories:", err);
        setErrorMessage("An error occurred while fetching data.");
        setSubCategories([]); // Clear subCategories if an error occurs
      }
    };
    fetchBookSubCategories();
  }, [categoryId]);
  return { subCategories, errorMessage };
};
export default useFetchBookSubCategories;












