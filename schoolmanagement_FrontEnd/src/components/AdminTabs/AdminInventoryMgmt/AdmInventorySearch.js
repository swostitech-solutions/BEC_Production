import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ApiUrl } from "../../../ApiUrl";

const AdmInventorySearch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Get org and branch from sessionStorage with fallback defaults
  const orgId = sessionStorage.getItem("organization_id") || "1";
  const branchId = sessionStorage.getItem("branch_id") || "1";

  // Search filters
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
    category: "",
    sub_category: "",
    item_name: "",
    inventory_type: "",
    status: "",  // Used for Asset Code No
  });

  // Data
  const [inventoryData, setInventoryData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  // Modal state for View
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const inventoryTypeOptions = [
    { value: "", label: "All Types" },
    { value: "Consumable", label: "Consumable" },
    { value: "Non-Consumable", label: "Non-Consumable" },
    { value: "Asset", label: "Asset" },
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
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
    handleSearch(); // Load all data on mount
  }, []);

  // Handle category change
  const handleCategoryChange = (selectedOption) => {
    const categoryId = selectedOption?.value || "";
    setFilters({ ...filters, category: categoryId, sub_category: "" });

    if (categoryId) {
      fetchSubCategories(categoryId);
    } else {
      setFilteredSubCategories(subCategories);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  // Handle Search
  const handleSearch = async () => {
    // Validate that dates are selected
    if (!filters.from_date || !filters.to_date) {
      toast.error("Please select From Date and To Date to search");
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

      const params = {
        organization_id: orgId,
        branch_id: branchId,
      };

      if (filters.category) params.category_id = filters.category;
      if (filters.sub_category) params.sub_category_id = filters.sub_category;
      if (filters.item_name) params.item_name = filters.item_name;
      if (filters.inventory_type) params.inventory_type = filters.inventory_type;
      if (filters.status) params.status = filters.status;  // Asset Code No filter
      if (filters.from_date) params.from_date = filters.from_date;
      if (filters.to_date) params.to_date = filters.to_date;

      const response = await axios.get(
        `${ApiUrl.apiurl}Inventory/Item/list/`,
        {
          params: params,
          headers: headers,
        }
      );

      if (response.data.status === "success") {
        setInventoryData(response.data.data);
        if (response.data.data.length === 0) {
          toast.info("No records found");
        }
      } else {
        setInventoryData([]);
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      toast.error("Failed to fetch inventory data");
      setInventoryData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFilters({
      from_date: "",
      to_date: "",
      category: "",
      sub_category: "",
      item_name: "",
      inventory_type: "",
      status: "",  // Asset Code No
    });
    setFilteredSubCategories(subCategories);
    setInventoryData([]);
  };

  const handleClose = () => {
    navigate("/admin/dashboard");
  };

  const handleNewClick = () => {
    navigate("/admin/inventory-new");
  };

  const handleEdit = (itemId) => {
    // Find the item from inventoryData
    const item = inventoryData.find(inv => inv.item_id === itemId);

    if (!item) {
      toast.error("Item not found");
      return;
    }

    // Navigate to edit page with item data in state
    navigate("/admin/inventory-new", {
      state: {
        editMode: true,
        itemData: item
      }
    });
  };

  const handleView = (itemId) => {
    // Find the item from inventoryData
    const item = inventoryData.find(inv => inv.item_id === itemId);

    if (!item) {
      toast.error("Item not found");
      return;
    }

    // Set selected item and show modal
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedItem(null);
  };


  const handlePDF = () => {
    if (!Array.isArray(inventoryData) || inventoryData.length === 0) {
      alert("No data to export!");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Inventory Report", 80, 20);

    const headers = [
      [
        "Sr No",
        "Category",
        "Sub Category",
        "Name",
        "Quantity",
        "Value",
        "Type",
        "Asset Code No",
      ],
    ];

    const data = inventoryData.map((item, index) => [
      index + 1,
      item.category_name,
      item.sub_category_name,
      item.item_name,
      item.quantity,
      Number(item.item_value).toFixed(2),
      item.inventory_type,
      item.status,  // Asset Code No
    ]);

    const totalValue = inventoryData
      .reduce((sum, item) => sum + Number(item.item_value) * Number(item.quantity), 0)
      .toFixed(2);
    const totalQuantity = inventoryData.reduce(
      (sum, item) => sum + Number(item.quantity),
      0
    );

    data.push(["", "", "", "Total:", totalQuantity, totalValue, "", ""]);

    doc.autoTable({
      startY: 30,
      head: headers,
      body: data,
      theme: "grid",
    });

    doc.save("Inventory_Report.pdf");
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
                SEARCH INVENTORY
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleNewClick}
                  >
                    New Inventory
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={handleSearch}
                    disabled={loading}
                    style={{ width: "150px" }}
                  >
                    {loading ? "Searching..." : "Search"}
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

                  <button
                    type="button"
                    className="btn btn-info me-2"
                    style={{ width: "150px" }}
                    onClick={handlePDF}
                  >
                    Export to PDF
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">


                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="from-date" className="form-label">
                          From Date
                        </label>
                        <input
                          type="date"
                          id="from-date"
                          className="form-control detail"
                          value={filters.from_date}
                          onChange={(e) =>
                            handleInputChange("from_date", e.target.value)
                          }
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="to-date" className="form-label">
                          To Date
                        </label>
                        <input
                          type="date"
                          id="to-date"
                          className="form-control detail"
                          value={filters.to_date}
                          onChange={(e) =>
                            handleInputChange("to_date", e.target.value)
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
                            { value: "", label: "All Categories" },
                            ...categories.map((cat) => ({
                              value: cat.category_id,
                              label: cat.category_name,
                            })),
                          ]}
                          value={
                            filters.category
                              ? {
                                value: filters.category,
                                label:
                                  categories.find(
                                    (cat) =>
                                      cat.category_id === parseInt(filters.category)
                                  )?.category_name || "All Categories",
                              }
                              : { value: "", label: "All Categories" }
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
                            { value: "", label: "All Sub-Categories" },
                            ...filteredSubCategories.map((subCat) => ({
                              value: subCat.sub_category_id,
                              label: subCat.sub_category_name,
                            })),
                          ]}
                          value={
                            filters.sub_category
                              ? {
                                value: filters.sub_category,
                                label:
                                  filteredSubCategories.find(
                                    (subCat) =>
                                      subCat.sub_category_id ===
                                      parseInt(filters.sub_category)
                                  )?.sub_category_name || "All Sub-Categories",
                              }
                              : { value: "", label: "All Sub-Categories" }
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
                          Name
                        </label>
                        <input
                          type="text"
                          id="item-name"
                          className="form-control detail"
                          placeholder="Enter Name"
                          value={filters.item_name}
                          onChange={(e) =>
                            handleInputChange("item_name", e.target.value)
                          }
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
                            filters.inventory_type
                              ? inventoryTypeOptions.find(
                                (opt) => opt.value === filters.inventory_type
                              )
                              : inventoryTypeOptions[0]
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
                          value={filters.status}
                          onChange={(e) =>
                            handleInputChange("status", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table data */}
              <div className="row mt-3">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>Sr No</th>
                          <th>Category</th>
                          <th>Sub Category</th>
                          <th>Name</th>
                          <th>Quantity</th>
                          <th>Value</th>
                          <th>Type</th>
                          <th>Asset Code No</th>
                          <th>Purchase Date</th>
                          <th>View</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryData.length > 0 ? (
                          inventoryData.map((item, index) => (
                            <tr key={item.item_id}>
                              <td>{index + 1}</td>
                              <td>{item.category_name}</td>
                              <td>{item.sub_category_name}</td>
                              <td>{item.item_name}</td>
                              <td>{item.quantity}</td>
                              <td>{Number(item.item_value).toFixed(2)}</td>
                              <td>{item.inventory_type}</td>
                              <td>{item.status}</td>
                              <td>{item.purchase_date || "N/A"}</td>
                              <td>
                                <button
                                  className="btn btn-link p-0 text-decoration-none"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleView(item.item_id);
                                  }}
                                >
                                  View
                                </button>
                              </td>
                              <td>
                                <button
                                  className="btn btn-link p-0 text-decoration-none"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleEdit(item.item_id);
                                  }}
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="11" className="text-center">
                              {loading
                                ? "Loading..."
                                : (!filters.from_date || !filters.to_date)
                                  ? "Please select From Date and To Date to view data"
                                  : "No records found"
                              }
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Summary Row */}
              {inventoryData.length > 0 && (
                <div className="row mt-3">
                  <div className="col-12">
                    <div className="d-flex justify-content-end">
                      <div className="me-4">
                        <h6>
                          Total Quantity:{" "}
                          {inventoryData.reduce(
                            (sum, item) => sum + Number(item.quantity || 0),
                            0
                          )}
                        </h6>
                      </div>
                      <div>
                        <h6>
                          Total Value:{" "}
                          {inventoryData
                            .reduce(
                              (sum, item) =>
                                sum +
                                Number(item.item_value || 0) *
                                Number(item.quantity || 0),
                              0
                            )
                            .toFixed(2)}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Item Modal */}
      <Modal show={showViewModal} onHide={handleCloseViewModal} size="lg" centered>
        <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: '0' }}>
          <Modal.Title style={{ fontWeight: '600', fontSize: '24px' }}>
            Inventory Item Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '20px 30px' }}>
          {selectedItem && (
            <div>
              <div className="row mb-2">
                <div className="col-md-6">
                  <div className="d-flex justify-content-between">
                    <strong style={{ fontWeight: '600' }}>Category:</strong>
                    <span style={{ textAlign: 'right' }}>{selectedItem.category_name || "N/A"}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-between">
                    <strong style={{ fontWeight: '600' }}>Sub-Category:</strong>
                    <span style={{ textAlign: 'right' }}>{selectedItem.sub_category_name || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-md-6">
                  <div className="d-flex justify-content-between">
                    <strong style={{ fontWeight: '600' }}>Item Name:</strong>
                    <span style={{ textAlign: 'right' }}>{selectedItem.item_name || "N/A"}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-between">
                    <strong style={{ fontWeight: '600' }}>Purchase Date:</strong>
                    <span style={{ textAlign: 'right' }}>{selectedItem.purchase_date || "N/A"}</span>
                  </div>
                </div>
              </div>


              <div className="row mb-2">
                <div className="col-md-6">
                  <div className="d-flex justify-content-between">
                    <strong style={{ fontWeight: '600' }}>Inventory Type:</strong>
                    <span style={{ textAlign: 'right' }}>{selectedItem.inventory_type || "N/A"}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-between">
                    <strong style={{ fontWeight: '600' }}>Asset Code No:</strong>
                    <span style={{ textAlign: 'right' }}>{selectedItem.status || "N/A"}</span>
                  </div>
                </div>
              </div>


              <div className="row mb-2">
                <div className="col-md-6">
                  <div className="d-flex justify-content-between">
                    <strong style={{ fontWeight: '600' }}>Quantity:</strong>
                    <span style={{ textAlign: 'right' }}>{selectedItem.quantity || "0"}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-between">
                    <strong style={{ fontWeight: '600' }}>Item Value:</strong>
                    <span style={{ textAlign: 'right' }}>₹ {Number(selectedItem.item_value || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-md-12">
                  <div className="d-flex justify-content-between">
                    <strong style={{ fontWeight: '600' }}>Total Value:</strong>
                    <span style={{ textAlign: 'right' }}>
                      ₹ {(Number(selectedItem.item_value || 0) * Number(selectedItem.quantity || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {selectedItem.description && (
                <div className="row mb-3">
                  <div className="col-md-12">
                    <strong>Description:</strong>
                    <p>{selectedItem.description}</p>
                  </div>
                </div>
              )}


              <div className="row mb-2">
                <div className="col-md-6">
                  <div className="d-flex justify-content-between">
                    <strong style={{ fontWeight: '600' }}>Created At:</strong>
                    <span style={{ textAlign: 'right', fontSize: '14px' }}>
                      {selectedItem.created_at ? new Date(selectedItem.created_at).toLocaleString('en-GB', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
                      }) : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-between">
                    <strong style={{ fontWeight: '600' }}>Last Updated:</strong>
                    <span style={{ textAlign: 'right', fontSize: '14px' }}>
                      {selectedItem.updated_at ? new Date(selectedItem.updated_at).toLocaleString('en-GB', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
                      }) : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ borderTop: 'none', paddingTop: '10px', justifyContent: 'center' }}>
          <Button
            variant="secondary"
            onClick={handleCloseViewModal}
            style={{ minWidth: '120px', marginRight: '10px' }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleCloseViewModal();
              handleEdit(selectedItem?.item_id);
            }}
            style={{ minWidth: '120px' }}
          >
            Edit Item
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdmInventorySearch;
