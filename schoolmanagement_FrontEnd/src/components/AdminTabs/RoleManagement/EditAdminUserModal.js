import React, { useState, useEffect } from "react";
import { Modal, Badge } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ApiUrl } from "../../../ApiUrl";
import "./CreateAdminUser.css";

const EditAdminUserModal = ({ show, handleClose, roleData, staffMap, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    roleName: "",
  });
  const [selectedModules, setSelectedModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Hierarchical module structure (same as CreateNewAdminUser)
  const moduleHierarchy = [
    {
      parent: "dashboard",
      label: "Dashboard",
      children: [
        { code: "dashboard.fee_dashboard", label: "Fee Dashboard" },
        { code: "dashboard.attendance", label: "Attendance Dashboard" },
      ]
    },
    {
      parent: "student",
      label: "Student",
      children: [
        { code: "student.registration", label: "Registration" },
        { code: "student.attendance", label: "Attendance" },
        { code: "student.assignment", label: "Assignment" },
        { code: "student.promotion", label: "Promotion" },
        { code: "student.class", label: "Student Course" },
        { code: "student.confirm", label: "Student Confirm" },
        { code: "student.certificate", label: "Student Certificate" },
        { code: "student.message", label: "Student Message" },
        { code: "student.club", label: "Student Club" },
        { code: "student.circular", label: "Circulars" },
      ]
    },
    {
      parent: "staff",
      label: "Staff",
      children: [
        { code: "staff.registration", label: "Registration" },
      ]
    },
    {
      parent: "fee",
      label: "Fee",
      children: [
        { code: "fee.search", label: "Search" },
        { code: "fee.adhoc", label: "ADHOC Fees" },
        { code: "fee.ledger", label: "Fee Ledger" },
        { code: "fee.student_fee", label: "Student Fee" },
        { code: "fee.structure", label: "Fee Structure" },
      ]
    },
    {
      parent: "library",
      label: "Library",
      children: [
        { code: "library.dashboard", label: "Book Dashboard" },
        { code: "library.category", label: "Book Category" },
        { code: "library.search", label: "Search" },
        { code: "library.configurations", label: "Book Configurations" },
        { code: "library.movements", label: "Issue/Return" },
        { code: "library.barcode", label: "Book Barcode" },
        { code: "library.title_report", label: "Book Title Report" },
        { code: "library.journal_report", label: "Journal Report" },
        { code: "library.accession_report", label: "Book Accession Report" },
        { code: "library.issue_return_report", label: "Issue/Return Report" },
        { code: "library.damaged_report", label: "Lost/Damaged Report" },
        { code: "library.most_circulated", label: "Most Circulated Book Report" },
      ]
    },
    {
      parent: "exam_results",
      label: "Exam Results",
      children: [
        { code: "exam_results.result", label: "Result" },
      ]
    },
    {
      parent: "transport",
      label: "Transport",
      children: [
        { code: "transport.search", label: "Search" },
        { code: "transport.student_fee", label: "Student Transport Fee" },
      ]
    },
    {
      parent: "expense",
      label: "Expense",
      children: [
        { code: "expense.search", label: "Search Expense" },
        { code: "expense.category", label: "Expense/Income Category" },
        { code: "expense.party_master", label: "Party Master" },
        { code: "expense.ledger", label: "Expense Ledger" },
        { code: "expense.profit_loss", label: "Profit & Loss" },
        { code: "expense.day_book", label: "Day Book" },
      ]
    },
    {
      parent: "other_income",
      label: "Other Income",
      children: [
        { code: "other_income.search", label: "Search Income" },
      ]
    },
    {
      parent: "hostel",
      label: "Hostel",
      children: [
        { code: "hostel.search", label: "Search" },
        { code: "hostel.student_details", label: "Student Hostel Details" },
        { code: "hostel.student_fee", label: "Student Hostel Fee" },
      ]
    },
    {
      parent: "timetable",
      label: "TimeTable",
      children: [
        { code: "timetable.class", label: "Class TimeTable" },
        { code: "timetable.teacher", label: "Teacher TimeTable" },
      ]
    },
    {
      parent: "lessonplan",
      label: "LessonPlan",
      children: [
        { code: "lessonplan.lesson_plan", label: "Lesson Plan" },
        { code: "lessonplan.teacher", label: "Teacher Lesson Plan" },
      ]
    },
    {
      parent: "mentor",
      label: "Mentor",
      children: [
        { code: "mentor.search", label: "Search" },
        { code: "mentor.report", label: "Mentor Report" },
      ]
    },
    {
      parent: "academics",
      label: "Academics",
      children: [
        { code: "academics.academic_documents", label: "Academic Documents" },
      ]
    },
    {
      parent: "grievance",
      label: "Grievance",
      children: [
        { code: "grievance.search", label: "Search Grievance" },
      ]
    },
    {
      parent: "visitors",
      label: "Visitors",
      children: [
        { code: "visitors.list", label: "Visitor List" },
      ]
    },
    {
      parent: "mou",
      label: "MOU",
      children: [
        { code: "mou.list", label: "MOU List" },
      ]
    },
    {
      parent: "training_placements",
      label: "Training and Placements",
      children: [
        { code: "training_placements.search", label: "Search" },
      ]
    },
    {
      parent: "inventory",
      label: "Inventory",
      children: [
        { code: "inventory.category", label: "Category" },
        { code: "inventory.search", label: "Search" },
      ]
    },
    {
      parent: "role",
      label: "Role",
      children: [
        { code: "role.create_admin_user", label: "Create New Role" },
        { code: "role.change_password", label: "Change Password", disabled: true },
      ]
    },
  ];

  // Initialize form data when modal opens
  useEffect(() => {
    if (roleData) {
      setFormData({
        roleName: roleData.role_name || "",
      });
      // Ensure role.change_password is always included
      const modules = roleData.accessible_modules || [];
      if (!modules.includes("role.change_password")) {
        setSelectedModules([...modules, "role.change_password"]);
      } else {
        setSelectedModules(modules);
      }
    }
  }, [roleData]);

  // Get access token
  const getAccessToken = () => localStorage.getItem("accessToken");

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle parent module toggle
  const handleParentToggle = (parentModule) => {
    const children = parentModule.children.map(c => c.code);
    const disabledChildren = parentModule.children.filter(c => c.disabled).map(c => c.code);
    const selectableChildren = children.filter(code => !disabledChildren.includes(code));
    const allSelectableSelected = selectableChildren.every(code => selectedModules.includes(code));
    
    setSelectedModules((prev) => {
      if (allSelectableSelected) {
        // Deselect only selectable children, keep disabled ones
        return prev.filter(code => !selectableChildren.includes(code));
      } else {
        // Select all selectable children
        const newCodes = selectableChildren.filter(code => !prev.includes(code));
        return [...prev, ...newCodes];
      }
    });
    
    if (errors.modules) {
      setErrors((prev) => ({ ...prev, modules: "" }));
    }
  };

  // Handle child toggle
  const handleChildToggle = (childCode) => {
    // Find the parent module and check if this child is disabled
    const parentModule = moduleHierarchy.find(parent => 
      parent.children.some(c => c.code === childCode)
    );
    
    if (parentModule) {
      const child = parentModule.children.find(c => c.code === childCode);
      if (child && child.disabled) {
        return; // Don't allow toggling disabled children
      }
    }
    
    setSelectedModules((prev) => {
      if (prev.includes(childCode)) {
        return prev.filter((code) => code !== childCode);
      } else {
        return [...prev, childCode];
      }
    });
    
    if (errors.modules) {
      setErrors((prev) => ({ ...prev, modules: "" }));
    }
  };

  // Check if parent is fully selected
  const isParentFullySelected = (parentModule) => {
    const children = parentModule.children.map(c => c.code);
    return children.length > 0 && children.every(code => selectedModules.includes(code));
  };

  // Check if parent is partially selected
  const isParentPartiallySelected = (parentModule) => {
    const children = parentModule.children.map(c => c.code);
    const disabledChildren = parentModule.children.filter(c => c.disabled).map(c => c.code);
    const selectableChildren = children.filter(code => !disabledChildren.includes(code));
    const selectedCount = selectableChildren.filter(code => selectedModules.includes(code)).length;
    return selectedCount > 0 && selectedCount < selectableChildren.length;
  };

  // Get selected count for parent
  const getSelectedCount = (parentModule) => {
    const children = parentModule.children.map(c => c.code);
    return children.filter(code => selectedModules.includes(code)).length;
  };

  // Handle select all modules
  const handleSelectAll = () => {
    const allSelectableChildCodes = moduleHierarchy.flatMap(parent => 
      parent.children.filter(c => !c.disabled).map(c => c.code)
    );
    const disabledChildCodes = moduleHierarchy.flatMap(parent => 
      parent.children.filter(c => c.disabled).map(c => c.code)
    );
    
    const allSelectableSelected = allSelectableChildCodes.every(code => selectedModules.includes(code));
    
    if (allSelectableSelected) {
      // Deselect all selectable, keep disabled ones
      setSelectedModules(disabledChildCodes);
    } else {
      // Select all (selectable + disabled)
      setSelectedModules([...allSelectableChildCodes, ...disabledChildCodes]);
    }
  };

  // Get total module count
  const getTotalModuleCount = () => {
    return moduleHierarchy.reduce((sum, parent) => sum + parent.children.length, 0);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.roleName.trim()) {
      newErrors.roleName = "Role Name is required";
    }

    if (selectedModules.length === 0) {
      newErrors.modules = "Please select at least one module";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle update
  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`${ApiUrl.apiurl}AdminUser/Update/${roleData.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({
          role_name: formData.roleName,
          accessible_modules: selectedModules,
        }),
      });

      const result = await response.json();

      if (response.ok || result.message?.toLowerCase().includes("success")) {
        setSuccessMessage("Admin user updated successfully!");
        setTimeout(() => {
          onUpdateSuccess();
        }, 1500);
      } else {
        setErrorMessage(result.message || "Failed to update admin user");
      }
    } catch (error) {
      console.error("Error updating admin user:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" backdrop="static">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Edit Admin User</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="alert alert-success d-flex align-items-center">
            <FaCheckCircle className="me-2" />
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-danger d-flex align-items-center">
            <FaTimesCircle className="me-2" />
            {errorMessage}
          </div>
        )}

        <div className="row">
          {/* Left Column - Basic Info */}
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-header bg-light">
                <h6 className="mb-0">User Information</h6>
              </div>
              <div className="card-body">
                {/* Username (Disabled) */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Username <span className="text-muted">(Cannot be changed)</span>
                  </label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={roleData.user_name}
                    disabled
                  />
                </div>

                {/* Role Name (Editable) */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Role Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.roleName ? "is-invalid" : ""}`}
                    name="roleName"
                    value={formData.roleName}
                    onChange={handleInputChange}
                    placeholder="Enter role name"
                  />
                  {errors.roleName && (
                    <div className="invalid-feedback">{errors.roleName}</div>
                  )}
                </div>

                {/* Non Teaching Staff (Disabled) */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Non Teaching Staff <span className="text-muted">(Cannot be changed)</span>
                  </label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={
                      roleData.reference_id && roleData.reference_id !== 0
                        ? staffMap[roleData.reference_id] || "N/A"
                        : "N/A"
                    }
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Module Selection */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  Accessible Modules <span className="text-danger">*</span>
                </h6>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleSelectAll}
                >
                  {(() => {
                    const allSelectableChildCodes = moduleHierarchy.flatMap(parent => 
                      parent.children.filter(c => !c.disabled).map(c => c.code)
                    );
                    const allSelectableSelected = allSelectableChildCodes.every(code => selectedModules.includes(code));
                    return allSelectableSelected ? "Deselect All" : "Select All";
                  })()}
                </button>
              </div>
              <div className="card-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {errors.modules && (
                  <div className="alert alert-danger py-2">{errors.modules}</div>
                )}

                {/* Module Selection */}
                <div className="module-selection">
                  {moduleHierarchy.map((parentModule, index) => {
                    const isFullySelected = isParentFullySelected(parentModule);
                    const isPartiallySelected = isParentPartiallySelected(parentModule);
                    const selectedCount = getSelectedCount(parentModule);
                    const totalCount = parentModule.children.length;

                    return (
                      <div key={index} className="mb-3">
                        {/* Parent Checkbox */}
                        <div className="d-flex align-items-center mb-2">
                          <div className="form-check me-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`parent-${parentModule.parent}`}
                              checked={isFullySelected}
                              ref={(el) => {
                                if (el) el.indeterminate = isPartiallySelected;
                              }}
                              onChange={() => handleParentToggle(parentModule)}
                            />
                            <label
                              className="form-check-label fw-bold"
                              htmlFor={`parent-${parentModule.parent}`}
                            >
                              {parentModule.label}
                            </label>
                          </div>
                          <Badge bg="secondary" className="ms-2">
                            {selectedCount}/{totalCount}
                          </Badge>
                        </div>

                        {/* Children Checkboxes */}
                        <div className="row ms-4">
                          {parentModule.children.map((child, childIndex) => (
                            <div key={childIndex} className="col-md-6 mb-2">
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`child-${child.code}`}
                                  checked={selectedModules.includes(child.code)}
                                  onChange={() => handleChildToggle(child.code)}
                                  disabled={child.disabled || false}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`child-${child.code}`}
                                >
                                  {child.label}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-primary"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <button className="btn btn-secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditAdminUserModal;
