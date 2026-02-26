import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import { ApiUrl } from "../../../ApiUrl";

const AdmNewInventory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Check if we're in edit mode
  const editMode = location.state?.editMode || false;
  const itemData = location.state?.itemData || null;
  const [itemId, setItemId] = useState(itemData?.item_id || null);

  // Get org and branch from sessionStorage with fallback defaults
  const orgId = sessionStorage.getItem("organization_id") || "1";
  const branchId = sessionStorage.getItem("branch_id") || "1";
  const userId = sessionStorage.getItem("userId");

  // Form state
  const [formData, setFormData] = useState({
    purchase_date: "",
    category: "",
    sub_category: "",
    item_name: "",
    item_value: "",
    quantity: "",
    inventory_type: "",
    status: "",  // Used for Asset Code No
    description: "",
  });

  // Dropdown options
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  const inventoryTypeOptions = [
    { value: "Consumable", label: "Consumable" },
    { value: "Non-Consumable", label: "Non-Consumable" },
    { value: "Asset", label: "Asset" },
  ];

  const statusOptions = [
    { value: "Available", label: "Available" },
    { value: "In Use", label: "In Use" },
    { value: "Under Maintenance", label: "Under Maintenance" },
    { value: "Damaged", label: "Damaged" },
    { value: "Disposed", label: "Disposed" },
  ];

  // Fetch categories
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
    }
  };

  // Fetch sub-categories
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
        setSubCategories(response.data.data);
        setFilteredSubCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching sub-categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();

    // If in edit mode, pre-fill the form with item data
    if (editMode && itemData) {
      setFormData({
        purchase_date: itemData.purchase_date || "",
        category: itemData.category || "",
        sub_category: itemData.sub_category || "",
        item_name: itemData.item_name || "",
        item_value: itemData.item_value || "",
        quantity: itemData.quantity || "",
        inventory_type: itemData.inventory_type || "",
        status: itemData.status || "",
        description: itemData.description || "",
      });

      // Fetch subcategories for the selected category
      if (itemData.category) {
        fetchSubCategories(itemData.category);
      }
    }
  }, []);

  // Handle category change
  const handleCategoryChange = (selectedOption) => {
    const categoryId = selectedOption?.value || "";
    setFormData({ ...formData, category: categoryId, sub_category: "" });

    if (categoryId) {
      fetchSubCategories(categoryId);
    } else {
      setFilteredSubCategories(subCategories);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle Save
  const handleSave = async () => {
    // Validation
    if (!formData.purchase_date) {
      toast.error("Please select a purchase date");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.sub_category) {
      toast.error("Please select a sub-category");
      return;
    }
    if (!formData.item_name.trim()) {
      toast.error("Please enter item name");
      return;
    }
    if (!formData.item_value || parseFloat(formData.item_value) < 0) {
      toast.error("Please enter a valid item value");
      return;
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    if (!formData.inventory_type) {
      toast.error("Please select inventory type");
      return;
    }
    if (!formData.status) {
      toast.error("Please enter asset code");
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

      let response;

      if (editMode && itemId) {
        // Update existing item
        response = await axios.patch(
          `${ApiUrl.apiurl}Inventory/Item/update/${itemId}/`,
          {
            category: parseInt(formData.category),
            sub_category: parseInt(formData.sub_category),
            item_name: formData.item_name.trim(),
            item_value: parseFloat(formData.item_value),
            quantity: parseInt(formData.quantity),
            inventory_type: formData.inventory_type,
            status: formData.status,
            purchase_date: formData.purchase_date,
            description: formData.description || "",
            updated_by: parseInt(userId),
          },
          {
            headers: headers,
          }
        );
      } else {
        // Create new item
        response = await axios.post(
          `${ApiUrl.apiurl}Inventory/Item/create`,
          {
            organization: parseInt(orgId),
            branch: parseInt(branchId),
            category: parseInt(formData.category),
            sub_category: parseInt(formData.sub_category),
            item_name: formData.item_name.trim(),
            item_value: parseFloat(formData.item_value),
            quantity: parseInt(formData.quantity),
            inventory_type: formData.inventory_type,
            status: formData.status,
            purchase_date: formData.purchase_date,
            description: formData.description || "",
            created_by: parseInt(userId),
          },
          {
            headers: headers,
          }
        );
      }


      if (response.data.status === "success") {
        const successMessage = editMode
          ? "Inventory Item updated successfully!"
          : "Inventory Item added successfully!";

        alert(successMessage);
        toast.success(
          response.data.message ||
          (editMode ? "Inventory Item updated successfully" : "Inventory Item added successfully")
        );
        handleClear();
        // Navigate to search page
        setTimeout(() => {
          navigate("/admin/inventory-search");
        }, 1500);
      } else {
        toast.error(
          response.data.message ||
          (editMode ? "Failed to update inventory item" : "Failed to add inventory item")
        );
      }
    } catch (error) {
      console.error("Error creating inventory item:", error);
      console.error("Error response data:", error.response?.data);

      // Extract detailed error message
      let errorMessage = "Failed to add inventory item";
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

  const handleClear = () => {
    setFormData({
      purchase_date: "",
      category: "",
      sub_category: "",
      item_name: "",
      item_value: "",
      quantity: "",
      inventory_type: "",
      status: "",  // Asset Code No
    });
    setFilteredSubCategories(subCategories);
  };

  const handleClose = () => {
    navigate("/admin/inventory-search");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                {editMode ? "EDIT INVENTORY" : "ADD INVENTORY"}
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={handleSave}
                    disabled={loading}
                    style={{ width: "150px" }}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    style={{ width: "150px" }}
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{ width: "150px" }}
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Field data */}
              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="purchase-date" className="form-label">
                          Purchase Date
                        </label>
                        <input
                          type="date"
                          id="purchase-date"
                          className="form-control detail"
                          value={formData.purchase_date}
                          onChange={(e) =>
                            handleInputChange("purchase_date", e.target.value)
                          }
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="category" className="form-label">
                          Inventory Category
                        </label>
                        <Select
                          className="detail"
                          id="category"
                          classNamePrefix="react-select"
                          options={[
                            { value: "", label: "Select Category" },
                            ...categories.map((cat) => ({
                              value: cat.category_id,
                              label: cat.category_name,
                            })),
                          ]}
                          value={
                            formData.category
                              ? {
                                value: formData.category,
                                label:
                                  categories.find(
                                    (cat) =>
                                      cat.category_id ===
                                      parseInt(formData.category)
                                  )?.category_name || "Select Category",
                              }
                              : { value: "", label: "Select Category" }
                          }
                          onChange={handleCategoryChange}
                          placeholder="Select"
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="sub-category" className="form-label">
                          Inventory Sub-Category
                        </label>
                        <Select
                          className="detail"
                          id="sub-category"
                          classNamePrefix="react-select"
                          options={[
                            { value: "", label: "Select Sub-Category" },
                            ...filteredSubCategories.map((subCat) => ({
                              value: subCat.sub_category_id,
                              label: subCat.sub_category_name,
                            })),
                          ]}
                          value={
                            formData.sub_category
                              ? {
                                value: formData.sub_category,
                                label:
                                  filteredSubCategories.find(
                                    (subCat) =>
                                      subCat.sub_category_id ===
                                      parseInt(formData.sub_category)
                                  )?.sub_category_name || "Select Sub-Category",
                              }
                              : { value: "", label: "Select Sub-Category" }
                          }
                          onChange={(selectedOption) =>
                            handleInputChange(
                              "sub_category",
                              selectedOption?.value || ""
                            )
                          }
                          placeholder="Select"
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="item-name" className="form-label">
                          Item Name
                        </label>
                        <input
                          type="text"
                          id="item-name"
                          className="form-control detail"
                          placeholder="Enter Name"
                          value={formData.item_name}
                          onChange={(e) =>
                            handleInputChange("item_name", e.target.value)
                          }
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="item-value" className="form-label">
                          Value
                        </label>
                        <input
                          type="number"
                          id="item-value"
                          className="form-control detail"
                          placeholder="Enter Value"
                          value={formData.item_value}
                          onChange={(e) =>
                            handleInputChange("item_value", e.target.value)
                          }
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="quantity" className="form-label">
                          Quantity
                        </label>
                        <input
                          type="number"
                          id="quantity"
                          className="form-control detail"
                          placeholder="Enter Quantity"
                          value={formData.quantity}
                          onChange={(e) =>
                            handleInputChange("quantity", e.target.value)
                          }
                          min="0"
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="inventory-type" className="form-label">
                          Inventory Type
                        </label>
                        <Select
                          className="detail"
                          id="inventory-type"
                          classNamePrefix="react-select"
                          options={inventoryTypeOptions}
                          value={
                            formData.inventory_type
                              ? inventoryTypeOptions.find(
                                (opt) => opt.value === formData.inventory_type
                              )
                              : null
                          }
                          onChange={(selectedOption) =>
                            handleInputChange(
                              "inventory_type",
                              selectedOption?.value || ""
                            )
                          }
                          placeholder="Select"
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="status" className="form-label">
                          Asset Code No
                        </label>
                        <input
                          type="text"
                          id="status"
                          className="form-control detail"
                          placeholder="Enter Asset Code"
                          value={formData.status}
                          onChange={(e) =>
                            handleInputChange("status", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmNewInventory;
