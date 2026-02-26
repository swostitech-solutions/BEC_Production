import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";
import ReactPaginate from "react-paginate";

const AdmAttendanceEntry = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("E"); // Stores E, I, B
  const [enabled, setEnabled] = useState(false);
  const [categoryList, setCategoryList] = useState([]); // Stores API data
  const [editingCategoryId, setEditingCategoryId] = useState(null); // Track which category is being edited
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const offset = currentPage * itemsPerPage;
  const paginatedList = categoryList.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(categoryList.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Fetch Category List on Page Load
  useEffect(() => {
    fetchCategoryList();
  }, []);

  const fetchCategoryList = async () => {
    const orgId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");

    // Validate if the orgId and branchId exist in localStorage
    if (!orgId || !branchId) {
      alert("Organization ID or Branch ID is missing in localStorage.");
      return;
    }
 
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}EXPENSE/EXPENSE_INCOME/CategoryList/?organization_id=${orgId}&batch_id=${branchId}`
    );
      const result = await response.json();
      if (response.ok) {
        setCategoryList(result.data || []);
      } else {
        alert(
          "Failed to fetch categories: " + (result.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error fetching category list:", error);
      alert("Error fetching category list. Please try again.");
    }
  };

  // Mapping object for display purposes
 const categoryLabels = [
   { value: "E", label: "EXPENSE" },
   { value: "I", label: "INCOME" },
   { value: "B", label: "BOTH" },
 ];

 const getCategoryLabel = (value) => {
   const category = categoryLabels.find((item) => item.value === value);
   return category ? category.label : value;
 };

  // const handleSave = async () => {
  //   if (!categoryName || !categoryType) {
  //     alert("Please enter Category Name and select a Category Type.");
  //     return;
  //   }

  //   // Retrieve values from localStorage and sessionStorage
  //   const branchId = localStorage.getItem("branchId");
  //   const orgId = localStorage.getItem("orgId");
  //   const userId = sessionStorage.getItem("userId"); // Retrieve userId from sessionStorage

  //   if (!branchId || !orgId || !userId) {
  //     alert(
  //       "Missing required data (branchId, orgId, or userId). Please log in again."
  //     );
  //     return;
  //   }

  //   const requestData = {
  //     expense_category: categoryName,
  //     orgId: parseInt(orgId),
  //     branchId: parseInt(branchId),
  //     enabled: enabled ? "Y" : "N",
  //     category_type: categoryType,
  //     category_flag: "",
  //     is_active: true,
  //     created_by: parseInt(userId),
  //   };

  //   try {
  //     const url = editingCategoryId
  //       ? `${ApiUrl.apiurl}EXPENSE/EXPENSE_INCOME/CategoryUpdate/${editingCategoryId}`
  //       : `${ApiUrl.apiurl}EXPENSE/EXPENSE_INCOME/CategoryCreate/`;

  //     const method = editingCategoryId ? "PUT" : "POST"; // Use PUT for updating

  //     const response = await fetch(url, {
  //       method: method,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(requestData),
  //     });

  //     const result = await response.json();
  //     console.log("API Response:", result);

  //     if (response.ok) {
  //       alert(
  //         "Category " +
  //           (editingCategoryId ? "updated" : "created") +
  //           " successfully!"
  //       );
  //       handleClear(); // Clear form after saving
  //       fetchCategoryList(); // Refresh table data
  //     } else {
  //       alert(
  //         "Failed to process request: " + (result.message || "Unknown error")
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error processing request:", error);
  //     alert("Failed to process request. Please try again.");
  //   }
  // };

  // Populate input fields with selected row data when Edit is clicked

  const handleSave = async () => {
    if (!categoryName || !categoryType) {
      alert("Please enter Category Name and select a Category Type.");
      return;
    }

    // Retrieve values from localStorage and sessionStorage
    const branchId = sessionStorage.getItem("branch_id");
    const orgId = sessionStorage.getItem("organization_id");
    const userId = sessionStorage.getItem("userId"); // Retrieve userId from sessionStorage

    if (!branchId || !orgId || !userId) {
      alert(
        "Missing required data (branchId, orgId, or userId). Please log in again."
      );
      return;
    }

    const requestData = {
      expense_category: categoryName,
      organization: parseInt(orgId),      
      batch: parseInt(branchId),          
      enabled: enabled ? "Y" : "N",
      category_type: categoryType,
      category_flag: "",
      is_active: true,
      created_by: parseInt(userId),
    };

    try {
      const url = editingCategoryId
        ? `${ApiUrl.apiurl}EXPENSE/EXPENSE_INCOME/CategoryUpdate/${editingCategoryId}`
        : `${ApiUrl.apiurl}EXPENSE/EXPENSE_INCOME/CategoryCreate/`;

      const method = editingCategoryId ? "PUT" : "POST"; // Use PUT for updating

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok) {
        alert(
          "Category " +
            (editingCategoryId ? "updated" : "created") +
            " successfully!"
        );
        handleClear(); // Clear form after saving
        fetchCategoryList(); // Refresh table data
      } else {
        alert(
          "Failed to process request: " + (result.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error processing request:", error);
      alert("Failed to process request. Please try again.");
    }
  };

  const handleEdit = (category) => {
    setCategoryName(category.expense_category);
    setCategoryType(category.category_type);
    setEnabled(category.enabled === "Y");
    setEditingCategoryId(category.expense_category_id); // Store the editing category ID
  };

  // const handleClear = () => {
  //   setCategoryName("");
  //   setCategoryType("");
  //   setEnabled(false);
  //   setEditingCategoryId(null); // Reset editing mode
  // };
  const handleClear = () => {
    setCategoryName(""); // Clears the Category Name input field
    setCategoryType(""); // Resets the Category Type
    setEnabled(false); // Unchecks the Enabled checkbox
    setEditingCategoryId(null); // Resets the editing mode (if any)
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
                Expense/Income Category
              </p>

              <div className="row mt-3 mx-2 mb-2 ">
                <div className="col-12 custom-section-box">
                  {/* Category Name Input */}
                  <div className="row mb-3 justify-content-center">
                    <div className="col-12 col-md-6 d-flex align-items-center mt-4  ">
                      <label
                        htmlFor="category-name"
                        className="form-label mb-2 me-2"
                      >
                        Category Name <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="category-name"
                        className="form-control detail"
                        style={{ maxWidth: "250px" }}
                        placeholder="Enter category name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Category Type Selection */}
                  <div className="row mb-3 justify-content-center">
                    {/* <div className="col-12 col-md-6 d-flex align-items-center">
                      <label
                        htmlFor="category-type"
                        className="form-label mb-0 me-2"
                      >
                        Category Type
                      </label>
                      <div className="d-flex">
                        {["E", "I", "B"].map((type, idx) => (
                          <div className="form-check me-3" key={idx}>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="categoryType"
                              value={type}
                              checked={categoryType === type}
                              onChange={(e) => setCategoryType(e.target.value)}
                            />
                            <label className="form-check-label">
                              {type === "E"
                                ? "Expense"
                                : type === "I"
                                ? "Income"
                                : "Both"}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div> */}
                    <div className="col-12 col-md-6">
                      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                        <label
                          htmlFor="category-type"
                          className="form-label mb-2 mb-md-0 me-md-2"
                        >
                          Category Type
                        </label>
                        <div className="d-flex flex-wrap">
                          {categoryLabels.map(({ value, label }, idx) => (
                            <div className="form-check me-3 mb-2" key={idx}>
                              <input
                                className="form-check-input"
                                type="radio"
                                name="categoryType"
                                value={value}
                                checked={categoryType === value}
                                onChange={(e) =>
                                  setCategoryType(e.target.value)
                                }
                              />
                              <label className="form-check-label">
                                {label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enabled Checkbox */}
                  <div className="row mb-3 justify-content-center">
                    <div className="col-12 col-md-6 d-flex align-items-center">
                      <label htmlFor="enabled" className="form-label mb-0 me-2">
                        Enabled
                      </label>
                      <input
                        type="checkbox"
                        id="enabled"
                        className="form-check-input"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                      />
                    </div>
                  </div>

                  {/* Save and Clear Buttons */}
                  <div className="row mb-3 justify-content-center">
                    <div className="col-12 col-md-6 d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-primary me-2"
                        style={{
                          width: "150px",
                        }}
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        style={{
                          width: "150px",
                        }}
                        onClick={handleClear}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expense Category List (Table) */}

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Category Name</th>
                        <th>Category Type</th>
                        <th>Enabled</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedList.map((category, index) => (
                        <tr key={category.expense_category_id}>
                          <td>{offset + index + 1}</td>
                          <td>{category.expense_category}</td>
                          {/* <td>{category.category_type}</td> */}
                          <td>
                            {categoryLabels.find(
                              (label) => label.value === category.category_type
                            )?.label || category.category_type}
                          </td>

                          <td>{category.enabled}</td>
                          <td>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleEdit(category);
                              }}
                              style={{
                                color: "blue",
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                            >
                              Edit
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
        </div>
      </div>
    </div>
  );
};

export default AdmAttendanceEntry;
