
import React, { useState, useEffect } from "react";
import "./AdmBookCategory.css";
import useBookCategories from "../../hooks/useBookCategories";
import { ApiUrl } from "../../../ApiUrl";
import Select from "react-select";
import { Spinner, Alert } from "react-bootstrap";
import ReactPaginate from "react-paginate";


const BookCategoryMaster = () => {
  const { categories, loading, error, fetchCategories } = useBookCategories();
  const [categoryName, setCategoryName] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [message, setMessage] = useState("");
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [editingSubCategoryId, setEditingSubCategoryId] = useState(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [bookCategories, setBookCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const itemsPerPage = 10;

  const offset = currentPage * itemsPerPage;
  const paginatedSubCategories = bookCategories.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(bookCategories.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  useEffect(() => {
    fetchAllCategoriesWithSubCategories();
  }, []);
  const fetchAllCategoriesWithSubCategories = async () => {
    try {
      setInitialLoading(true);
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        console.error("Access token not found in sessionStorage.");
        setInitialLoading(false);
        return;
      }
      const response = await fetch(
        `${ApiUrl.apiurl}BookSubCategory/GetAllBookCategoryWithSubCategoryList/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data && data.message === "Success") {
        setBookCategories(data.data); // Set all categories and subcategories on page load
        setFilteredSubCategories(data.data); // Show all data initially
      } else {
        console.error("Failed to fetch categories:", data.message);
      }
    } catch (error) {
      console.error("An error occurred while fetching categories:", error);
    } finally {
      setInitialLoading(false);
    }
  };



  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    const selectedCategory = (categories || []).find(
      (cat) => cat.id === parseInt(categoryId)
    );
    setSelectedCategoryName(
      selectedCategory ? selectedCategory.category_name : ""
    );
    // Only set the selected category for creating subcategory, don't filter the table
  };
  const fetchSubCategories = async (categoryId) => {
    try {
      setLoadingSubCategories(true);
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        console.error("Access token not found in sessionStorage.");
        return;
      }
      const response = await fetch(
        `${ApiUrl.apiurl}BookSubCategory/GetBookSubCategoryBasedOnCategory/${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data && data.message === "Success") {
        setFilteredSubCategories(data.data);
      } else {
        console.error("Failed to fetch subcategories.");
        setFilteredSubCategories([]);
      }
    } catch (error) {
      console.error("An error occurred while fetching subcategories:", error);
    } finally {
      setLoadingSubCategories(false);
    }
  };
  const handleCheckboxChange = (event) => {
    setIsEnabled(event.target.checked);
  };
  const handleSaveSubCategory = async () => {
    const orgId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      setMessage("Error: Unauthorized - Missing access token.");
      return;
    }
    if (!subCategory) {
      setMessage("Error: Sub-category name cannot be empty.");
      return;
    }
    const data = {
      CategoryId: selectedCategoryId,
      SubCategoryName: subCategory,
      Subcategory_description: "cricket",
      org_id: orgId,
      branch_id: branchId,
      is_active: isEnabled ? "Y" : "N",
      created_by: 1,
    };
    try {
      let response;
      if (editingSubCategoryId) {
        // Update existing sub-category
        response = await fetch(
          `${ApiUrl.apiurl}BookSubCategory/BookSubCategoryupdate/${editingSubCategoryId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          }
        );
        if (response.ok) {
          alert("Sub-category updated successfully!");
        }
      } else {
        // Create new sub-category
        response = await fetch(
          `${ApiUrl.apiurl}BookSubCategory/create/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          }
        );
        if (response.ok) {
          alert("Sub-category created successfully!");
        }
      }
      const result = await response.json();
      if (response.ok) {
        setMessage(result.message);
        setSubCategory("");
        setEditingSubCategoryId(null); // Clear edit mode after saving
        // Refresh all categories and subcategories to show complete list
        await fetchAllCategoriesWithSubCategories();
      } else {
        setMessage("Error: " + result.message);
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };
  const handleEditClick = (
    subCategoryId,
    subCategoryName,
    isActive,
    categoryName
  ) => {
    setEditingSubCategoryId(subCategoryId);
    setSubCategory(subCategoryName);
    // Handle both boolean and string values for isActive
    setIsEnabled(isActive === true || isActive === "Y");

    // Find categoryId from categoryName
    const matchedCategory = (categories || []).find(
      (cat) => cat.category_name?.toLowerCase() === categoryName?.toLowerCase()
    );

    if (matchedCategory) {
      setSelectedCategoryId(matchedCategory.id);
      setSelectedCategoryName(matchedCategory.category_name);
      // Don't filter the table when editing, just set the selected category
    } else {
      console.warn("Category name not found in categories list");
      setSelectedCategoryId("");
    }
  };


  const handleSave = async () => {
    // Get and validate token first
    let token = sessionStorage.getItem("accessToken");
    if (!token) {
      token = localStorage.getItem("accessToken");
    }
    
    if (!token || token.trim() === "") {
      setMessage("Error: Unauthorized - Missing or invalid access token.");
      return;
    }

    const orgId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");

    if (!orgId || !branchId) {
      setMessage("Error: Organization ID or Branch ID not found.");
      return;
    }

    if (!categoryName || categoryName.trim() === "") {
      setMessage("Error: Category name cannot be empty.");
      return;
    }

    if (
      (categories || []).some(
        (category) =>
          category.category_name?.toLowerCase() === categoryName?.toLowerCase()
      )
    ) {
      alert("Category already exists.");
      return;
    }

    const data = {
      category_name: categoryName.trim(),
      category_description: "",
      org_id: orgId,
      branch_id: branchId,
      is_active: true,
      created_by: 1,
    };

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}BookCategory/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok && response.status === 401) {
        setMessage("Error: Unauthorized - Access token has expired or is invalid.");
        return;
      }

      const result = await response.json();

      if (response.ok) {
        alert("Category created successfully!");
        fetchCategories();
        // Refresh all categories and subcategories to show complete list in table
        await fetchAllCategoriesWithSubCategories();
        setCategoryName("");
        setMessage("");
      } else {
        setMessage("Error: " + (result.message || "Failed to create category"));
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      setMessage("Error: " + (error.message || "An unexpected error occurred"));
    }
  };

  if (error) {
    return (
      <div className="container-fluid mt-0">
        <div className="row">
          <div className="col-12">
            <div className="card p-0">
              <div className="card-body">
                <h2 className="mb-1 text-center" style={{ fontSize: "x-large" }}>
                  BOOK CATEGORY MASTER
                </h2>
                <div className="mt-4">
                  <Alert variant="danger">{error}</Alert>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-0">
      <h2 className="mb-1 text-center" style={{ fontSize: "x-large" }}>
        BOOK CATEGORY MASTER
      </h2>
      <div className="card p-4 mb-0">
        <h2 className="mb-1" style={{ fontSize: "x-large" }}>
          Add Book Category
        </h2>
        <div className="row align-items-center">
          <div className="col-md-3 mb-0">
            <label style={{ fontWeight: "bold" }}>Enter Category</label>
            <input
              type="text"
              className="form-control"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div className="col-md-2 mb-0">
            <button className="btn btn-primary mt-3" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
        <div className="row">
          <h2 className="mb-1" style={{ fontSize: "x-large" }}>
            Add BookSub-Category
          </h2>
          <div className="col-md-3 mb-0">
            <label style={{ fontWeight: "bold" }}>Select Category</label>
            <Select

              options={[
                { value: "", label: "Select Categories" },
                ...(categories || []).map((cat) => ({
                  value: cat.id,
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
                      (categories || []).find(
                        (cat) => cat.id === parseInt(selectedCategoryId)
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
              className="form-control"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            />
          </div>
          <div className="col-md-2 mb-0">
            <button
              className="btn btn-primary mt-3"
              onClick={handleSaveSubCategory}
            >
              Save
            </button>
          </div>
          <label>
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={handleCheckboxChange}
            />
            Enabled
          </label>
        </div>
        <h4>Book Category List</h4>
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
              {paginatedSubCategories.length > 0 ? (
                paginatedSubCategories.map((subCategory, index) => (
                  <tr key={subCategory.id}>
                    <td>{offset + index + 1}</td>
                    <td>{subCategory.categoryName}</td>
                    <td>{subCategory.Subcategory_name}</td>
                    <td>{subCategory.is_active ? "Y" : "N"}</td>
                    <td>
                      <button
                        className="btn btn-link"
                        onClick={() =>
                          handleEditClick(
                            subCategory.id,
                            subCategory.Subcategory_name,
                            subCategory.is_active,
                            subCategory.categoryName
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
          {pageCount > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                activeClassName={"active"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCategoryMaster;