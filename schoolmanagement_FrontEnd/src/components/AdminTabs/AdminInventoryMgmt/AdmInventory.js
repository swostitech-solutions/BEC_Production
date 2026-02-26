import React, { useState, useEffect } from "react";
import "./AdmInventory.css";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import { ApiUrl } from "../../../ApiUrl";

const InventoryCategoryMaster = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [editingSubCategoryId, setEditingSubCategoryId] = useState(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [inventoryCategories, setInventoryCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get org and branch from sessionStorage with fallback defaults
  const orgId = sessionStorage.getItem("organization_id") || "1";
  const branchId = sessionStorage.getItem("branch_id") || "1";
  const userId = sessionStorage.getItem("userId");

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.get(
        `${ApiUrl.apiurl}Inventory/Category/list/`,
        {
          params: {
            organization_id: orgId,
            branch_id: branchId,
          },
          headers: headers,
        }
      );

      if (response.data.status === "success") {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  // Fetch sub-categories from API
  const fetchSubCategories = async (categoryId = null) => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const params = {
        organization_id: orgId,
        branch_id: branchId,
      };

      if (categoryId) {
        params.category_id = categoryId;
      }

      const response = await axios.get(
        `${ApiUrl.apiurl}Inventory/SubCategory/list/`,
        {
          params: params,
          headers: headers,
        }
      );

      if (response.data.status === "success") {
        setInventoryCategories(response.data.data);
        setFilteredSubCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching sub-categories:", error);
      toast.error("Failed to fetch sub-categories");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  // Handle category dropdown change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);

    const selectedCategory = categories.find(
      (cat) => cat.category_id === parseInt(categoryId)
    );
    setSelectedCategoryName(
      selectedCategory ? selectedCategory.category_name : ""
    );

    if (categoryId) {
      // Filter subcategories for selected category
      fetchSubCategories(categoryId);
    } else {
      fetchSubCategories();
    }
  };

  const handleCheckboxChange = (event) => {
    setIsEnabled(event.target.checked);
  };

  const handleEditClick = (
    subCategoryId,
    subCategoryName,
    isActive,
    categoryId
  ) => {
    setEditingSubCategoryId(subCategoryId);
    setSubCategory(subCategoryName);
    setIsEnabled(isActive);

    const matchedCategory = categories.find(
      (cat) => cat.category_id === categoryId
    );
    if (matchedCategory) {
      setSelectedCategoryId(matchedCategory.category_id);
      setSelectedCategoryName(matchedCategory.category_name);
    } else {
      setSelectedCategoryId("");
    }
  };

  // Save Category
  const handleSave = async () => {
    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    // Validate required IDs
    if (!orgId || !branchId) {
      toast.error("Organization and Branch information is missing. Please log in again.");
      console.error("Missing:", { orgId, branchId });
      return;
    }

    if (!userId) {
      toast.error("User information is missing. Please log in again.");
      console.error("Missing userId:", userId);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const requestData = {
        organization: parseInt(orgId),
        branch: parseInt(branchId),
        category_name: categoryName.trim(),
        created_by: parseInt(userId),
      };

      console.log("Sending category data:", requestData);
      console.log("Organization ID:", orgId, "Branch ID:", branchId, "User ID:", userId);

      const response = await axios.post(
        `${ApiUrl.apiurl}Inventory/Category/create`,
        requestData,
        {
          headers: headers,
        }
      );

      if (response.data.status === "success") {
        toast.success(response.data.message || "Category created successfully");
        setCategoryName("");
        fetchCategories();
      } else {
        toast.error(response.data.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      console.error("Error response data:", error.response?.data);

      // Extract detailed error message
      let errorMessage = "Failed to create category";
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          // Handle validation errors
          const errors = error.response.data.errors;
          if (typeof errors === 'object') {
            errorMessage = Object.entries(errors)
              .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
              .join('; ');
          } else {
            errorMessage = errors;
          }
        }
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Save or Update Sub-Category
  const handleSaveSubCategory = async () => {
    if (!selectedCategoryId) {
      toast.error("Please select a category");
      return;
    }

    if (!subCategory.trim()) {
      toast.error("Please enter a sub-category name");
      return;
    }

    // Validate required IDs
    if (!orgId || !branchId) {
      toast.error("Organization and Branch information is missing. Please log in again.");
      console.error("Missing:", { orgId, branchId });
      return;
    }

    if (!userId) {
      toast.error("User information is missing. Please log in again.");
      console.error("Missing userId:", userId);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      if (editingSubCategoryId) {
        // Update existing sub-category
        const response = await axios.patch(
          `${ApiUrl.apiurl}Inventory/SubCategory/update/${editingSubCategoryId}/`,
          {
            category: parseInt(selectedCategoryId),
            sub_category_name: subCategory.trim(),
            is_active: isEnabled,
            updated_by: parseInt(userId),
          },
          {
            headers: headers,
          }
        );

        if (response.data.status === "success") {
          toast.success(
            response.data.message || "Sub-category updated successfully"
          );
          resetSubCategoryForm();
          fetchSubCategories(); // Fetch all sub-categories instead of filtering
        }
      } else {
        // Create new sub-category
        const response = await axios.post(
          `${ApiUrl.apiurl}Inventory/SubCategory/create`,
          {
            organization: parseInt(orgId),
            branch: parseInt(branchId),
            category: parseInt(selectedCategoryId),
            sub_category_name: subCategory.trim(),
            is_active: isEnabled,
            created_by: parseInt(userId),
          },
          {
            headers: headers,
          }
        );

        if (response.data.status === "success") {
          toast.success(
            response.data.message || "Sub-category created successfully"
          );
          resetSubCategoryForm();
          fetchSubCategories(); // Fetch all sub-categories instead of filtering
        }
      }
    } catch (error) {
      console.error("Error saving sub-category:", error);
      console.error("Error response data:", error.response?.data);

      // Extract detailed error message
      let errorMessage = "Failed to save sub-category";
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          const errors = error.response.data.errors;
          if (typeof errors === 'object') {
            errorMessage = Object.entries(errors)
              .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
              .join('; ');
          } else {
            errorMessage = errors;
          }
        }
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetSubCategoryForm = () => {
    setSubCategory("");
    setEditingSubCategoryId(null);
    setIsEnabled(true);
    setSelectedCategoryId(""); // Reset category dropdown
    setSelectedCategoryName(""); // Reset category name
  };

  return (
    <div className="container-fluid mt-0">
      <h2 className="mb-1 text-center" style={{ fontSize: "x-large" }}>
        INVENTORY CATEGORY
      </h2>
      <div className="card p-4 mb-0">
        <h2 className="mb-1" style={{ fontSize: "x-large" }}>
          Add Inventory Category
        </h2>
        <div className="row align-items-center">
          <div className="col-md-3 mb-0">
            <label style={{ fontWeight: "bold" }}>Enter Category</label>
            <input
              type="text"
              className="form-control detail"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div className="col-md-2 mb-0">
            <button
              className="btn btn-primary mt-3"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div className="row mt-4">
          <h2 className="mb-1" style={{ fontSize: "x-large" }}>
            Add Inventory Sub-Category
          </h2>
          <div className="col-md-3 mb-0">
            <label style={{ fontWeight: "bold" }}>Select Category</label>
            <Select
              className="detail"
              options={[
                { value: "", label: "Select Categories" },
                ...categories.map((cat) => ({
                  value: cat.category_id,
                  label: cat.category_name,
                })),
              ]}
              onChange={(selectedOption) => {
                const event = {
                  target: { value: selectedOption?.value || "" },
                };
                handleCategoryChange(event);
              }}
              value={
                selectedCategoryId
                  ? {
                      value: selectedCategoryId,
                      label:
                        categories.find(
                          (cat) =>
                            cat.category_id === parseInt(selectedCategoryId)
                        )?.category_name || "",
                    }
                  : { value: "", label: "Select Categories" }
              }
            />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-3 mb-0">
            <label style={{ fontWeight: "bold" }}>Sub-Category</label>
            <input
              type="text"
              className="form-control detail"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            />
          </div>
          <div className="col-md-2 mb-0">
            <button
              className="btn btn-primary mt-3"
              onClick={handleSaveSubCategory}
              disabled={loading}
            >
              {loading ? "Saving..." : editingSubCategoryId ? "Update" : "Save"}
            </button>
            {editingSubCategoryId && (
              <button
                className="btn btn-secondary mt-3 ms-2"
                onClick={resetSubCategoryForm}
              >
                Cancel
              </button>
            )}
          </div>
          <label className="ms-3">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={handleCheckboxChange}
            />
            Enabled
          </label>
        </div>

        <h4 className="mt-4">Inventory Category List</h4>
        <div className="table-responsive">
          <table className="table table-bordered ">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Category</th>
                <th>Sub-Category</th>
                <th>Active</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubCategories.length > 0 ? (
                filteredSubCategories.map((subCat, index) => (
                  <tr key={subCat.sub_category_id}>
                    <td>{index + 1}</td>
                    <td>{subCat.category_name}</td>
                    <td>{subCat.sub_category_name}</td>
                    <td>{subCat.is_active ? "Y" : "N"}</td>
                    <td>
                      <button
                        className="btn btn-link"
                        onClick={() =>
                          handleEditClick(
                            subCat.sub_category_id,
                            subCat.sub_category_name,
                            subCat.is_active,
                            subCat.category
                          )
                        }
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No sub-categories available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryCategoryMaster;
