import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { InputGroup } from "react-bootstrap";
import { BsEye, BsEyeSlash, BsChevronDown, BsChevronRight } from "react-icons/bs";
import { ApiUrl } from "../../../ApiUrl";
import "./CreateAdminUser.css";

const CreateNewAdminUser = () => {
  const navigate = useNavigate();

  // State management
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roleName: "",
    userName: "",
    password: "",
    confirmPassword: "",
    linkedStaff: null,
  });
  const [selectedModules, setSelectedModules] = useState(["role.change_password"]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedParents, setExpandedParents] = useState({});

  // Hierarchical module structure matching the sidebar
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
        { code: "mentor.assign", label: "Assign Mentor" },
        { code: "mentor.follow_ups", label: "Follow Ups" },
        { code: "mentor.student_details", label: "Student Details" },
      ]
    },
    {
      parent: "academics",
      label: "Academics",
      children: [
        { code: "academics.document_upload", label: "Document Upload" },
      ]
    },
    {
      parent: "grievance",
      label: "Grievance",
      children: [
        { code: "grievance.student", label: "Student Grievances" },
      ]
    },
    {
      parent: "visitors",
      label: "Visitors",
      children: [
        { code: "visitors.list", label: "Visitors List" },
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
        { code: "training_placements.training", label: "Training" },
      ]
    },
    {
      parent: "inventory",
      label: "Inventory Management",
      children: [
        { code: "inventory.category", label: "Inventory Category" },
        { code: "inventory.search", label: "Inventory Search" },
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

  // Get organization and branch from session/local storage
  const getOrgId = () => sessionStorage.getItem("org_id") || localStorage.getItem("orgId");
  const getBranchId = () => sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");
  const getAccessToken = () => localStorage.getItem("accessToken");

  // Fetch staff list on component mount
  useEffect(() => {
    fetchStaffList();
  }, []);

  // Fetch staff list (All staff except Teaching Staff)
  const fetchStaffList = async () => {
    try {
      const orgId = getOrgId();
      const branchId = getBranchId();

      const response = await fetch(
        `${ApiUrl.apiurl}STAFF/RegistrationstaffList/?organization_id=${orgId}&branch_id=${branchId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          const staffOptions = result.data
            .filter((staff) => {
              const empType = staff.employee_type?.toLowerCase().replace(/-/g, " ").trim();
              // Exclude only "teaching staff" — allow all other employee types
              return empType !== "teaching staff" && empType !== "teaching";
            })
            .map((staff) => ({
              value: staff.id,
              label: staff.employee_name,
            }));
          setStaffList(staffOptions);
        }
      }
    } catch (error) {
      console.error("Error fetching staff list:", error);
    }
  };

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

  // Handle dropdown change
  const handleDropdownChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      linkedStaff: selectedOption,
    }));
    if (errors.linkedStaff) {
      setErrors((prev) => ({ ...prev, linkedStaff: "" }));
    }
  };

  // Handle module toggle
  const handleModuleToggle = (moduleCode) => {
    setSelectedModules((prev) => {
      if (prev.includes(moduleCode)) {
        return prev.filter((code) => code !== moduleCode);
      } else {
        return [...prev, moduleCode];
      }
    });
    if (errors.modules) {
      setErrors((prev) => ({ ...prev, modules: "" }));
    }
  };

  // Handle parent module toggle (select/deselect all children)
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
        // Select all selectable children (disabled ones are already selected by default)
        const newCodes = selectableChildren.filter(code => !prev.includes(code));
        return [...prev, ...newCodes];
      }
    });

    if (errors.modules) {
      setErrors((prev) => ({ ...prev, modules: "" }));
    }
  };

  // Handle child toggle with parent auto-deselect
  const handleChildToggle = (parentModule, childCode) => {
    // Check if this child is disabled - if so, don't allow toggle
    const child = parentModule.children.find(c => c.code === childCode);
    if (child && child.disabled) {
      return; // Don't allow toggling disabled children
    }

    setSelectedModules((prev) => {
      if (prev.includes(childCode)) {
        // Deselecting child - remove it
        return prev.filter((code) => code !== childCode);
      } else {
        // Selecting child - add it
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

  // Toggle parent expansion
  const toggleParentExpansion = (parentCode) => {
    setExpandedParents(prev => ({
      ...prev,
      [parentCode]: !prev[parentCode]
    }));
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

    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required";
    } else if (formData.userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.linkedStaff) {
      newErrors.linkedStaff = "Staff is required";
    }

    if (selectedModules.length === 0) {
      newErrors.modules = "Please select at least one module";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const orgId = getOrgId();
      const branchId = getBranchId();

      const response = await fetch(`${ApiUrl.apiurl}AdminUser/Create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({
          user_name: formData.userName,
          password: formData.password,
          role_name: formData.roleName,
          organization_id: parseInt(orgId),
          branch_id: parseInt(branchId),
          reference_id: formData.linkedStaff ? formData.linkedStaff.value : null,
          accessible_modules: selectedModules,
        }),
      });

      const result = await response.json();

      if (response.ok || result.message?.toLowerCase().includes("success")) {
        setSuccessMessage("Admin user created successfully!");
        setTimeout(() => {
          navigate("/admin/create-admin-user");
        }, 2000);
      } else {
        setErrorMessage(result.message || "Failed to create admin user");
      }
    } catch (error) {
      console.error("Error creating admin user:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle clear
  const handleClear = () => {
    setFormData({
      roleName: "",
      userName: "",
      password: "",
      confirmPassword: "",
      linkedStaff: null,
    });
    setSelectedModules([]);
    setErrors({});
    setSuccessMessage("");
    setErrorMessage("");
  };

  // Handle close
  const handleClose = () => {
    navigate("/admin/create-admin-user");
  };

  return (
    <div className="create-admin-user-container">
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
                  CREATE NEW USER ROLE
                </p>

                {/* Action Buttons */}
                <div className="row mb-3 mt-3 mx-0">
                  <div className="col-12 d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-primary me-2"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={handleClear}
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger me-2"
                      onClick={handleClose}
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Success/Error Messages */}
                {successMessage && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {successMessage}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setSuccessMessage("")}
                    ></button>
                  </div>
                )}

                {errorMessage && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {errorMessage}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setErrorMessage("")}
                    ></button>
                  </div>
                )}

                {/* Form Section + Module Access (Single White Box) */}
                <div className="row mt-3 mx-2">
                  <div className="col-12 custom-section-box">
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                      <div className="row flex-grow-1 mt-2">
                        {/* Column 1: Role Name + Username + Non Teaching Staff */}
                        <div className="col-12 col-md-6">
                          <div className="form-group mb-2">
                            <label htmlFor="roleName" className="form-label">
                              Role Name <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              id="roleName"
                              className={`form-control detail ${errors.roleName ? "is-invalid" : ""}`}
                              name="roleName"
                              value={formData.roleName}
                              onChange={handleInputChange}
                              placeholder="Enter role name (e.g., Admin Manager, HR Admin)"
                            />
                            {errors.roleName && (
                              <div className="invalid-feedback">{errors.roleName}</div>
                            )}
                          </div>

                          <div className="form-group mb-2">
                            <label htmlFor="userName" className="form-label">
                              Username <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              id="userName"
                              className={`form-control detail ${errors.userName ? "is-invalid" : ""}`}
                              name="userName"
                              value={formData.userName}
                              onChange={handleInputChange}
                              placeholder="Enter username (min 3 characters)"
                              autoComplete="off"
                            />
                            {errors.userName && (
                              <div className="invalid-feedback">{errors.userName}</div>
                            )}
                          </div>

                          <div className="form-group mb-2">
                            <label htmlFor="linkedStaff" className="form-label">
                              Staff <span className="text-danger">*</span>
                            </label>
                            <Select
                              id="linkedStaff"
                              options={staffList}
                              value={formData.linkedStaff}
                              onChange={handleDropdownChange}
                              placeholder="Select Staff"
                              isClearable
                              className={errors.linkedStaff ? "is-invalid" : ""}
                              classNamePrefix="detail"
                            />
                            {errors.linkedStaff && (
                              <div className="text-danger small mt-1">
                                {errors.linkedStaff}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Column 2: Password + Confirm Password */}
                        <div className="col-12 col-md-6">
                          <div className="form-group mb-2">
                            <label htmlFor="password" className="form-label">
                              Password <span className="text-danger">*</span>
                            </label>
                            <InputGroup hasValidation>
                              <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className={`form-control detail ${errors.password ? "is-invalid" : ""}`}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter password (min 6 characters)"
                                autoComplete="new-password"
                              />
                              <InputGroup.Text
                                style={{
                                  cursor: "pointer",
                                  backgroundColor: "#fff",
                                  borderColor: errors.password ? "#dc3545" : "#ced4da",
                                }}
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <BsEyeSlash size={18} />
                                ) : (
                                  <BsEye size={18} />
                                )}
                              </InputGroup.Text>
                              {errors.password && (
                                <div className="invalid-feedback" style={{ display: "block" }}>
                                  {errors.password}
                                </div>
                              )}
                            </InputGroup>
                          </div>

                          <div className="form-group mb-2">
                            <label htmlFor="confirmPassword" className="form-label">
                              Confirm Password <span className="text-danger">*</span>
                            </label>
                            <InputGroup hasValidation>
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                className={`form-control detail ${errors.confirmPassword ? "is-invalid" : ""}`}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Re-enter password"
                                autoComplete="new-password"
                              />
                              <InputGroup.Text
                                style={{
                                  cursor: "pointer",
                                  backgroundColor: "#fff",
                                  borderColor: errors.confirmPassword ? "#dc3545" : "#ced4da",
                                }}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <BsEyeSlash size={18} />
                                ) : (
                                  <BsEye size={18} />
                                )}
                              </InputGroup.Text>
                              {errors.confirmPassword && (
                                <div className="invalid-feedback" style={{ display: "block" }}>
                                  {errors.confirmPassword}
                                </div>
                              )}
                            </InputGroup>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Module Access Permissions Section */}
                    <hr className="my-4" />

                    <h5 className="mb-2">Module Access Permissions</h5>
                    <small className="text-muted d-block mb-3">
                      Select specific submenu items this admin user can access
                    </small>

                    {errors.modules && (
                      <div className="alert alert-danger" role="alert">
                        {errors.modules}
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mb-3">
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
                      <span className="badge bg-primary">
                        {selectedModules.length} of {getTotalModuleCount()} selected
                      </span>
                    </div>

                    {/* Collapsible Module List - Two Columns */}
                    <div className="row">
                      {/* Left Column */}
                      <div className="col-md-6" style={{ borderRight: "2px solid #dee2e6", paddingRight: "20px" }}>
                        {moduleHierarchy.slice(0, Math.ceil(moduleHierarchy.length / 2)).map((parentModule) => {
                          const isFullySelected = isParentFullySelected(parentModule);
                          const isPartiallySelected = isParentPartiallySelected(parentModule);
                          const selectedCount = getSelectedCount(parentModule);
                          const totalCount = parentModule.children.length;
                          const isExpanded = expandedParents[parentModule.parent];

                          return (
                            <div
                              key={parentModule.parent}
                              className="mb-3"
                              style={{
                                border: "1px solid #dee2e6",
                                borderRadius: "4px",
                                padding: "10px",
                                backgroundColor: isExpanded ? "#f8f9fa" : "#fff"
                              }}
                            >
                              {/* Parent Module with Arrow */}
                              <div className="d-flex align-items-center">
                                <input
                                  className="form-check-input me-2"
                                  type="checkbox"
                                  id={`parent-${parentModule.parent}`}
                                  checked={isFullySelected}
                                  ref={(el) => {
                                    if (el) el.indeterminate = isPartiallySelected;
                                  }}
                                  onChange={() => handleParentToggle(parentModule)}
                                  style={{ flexShrink: 0 }}
                                />
                                <label
                                  className="form-check-label fw-bold flex-grow-1 mb-0"
                                  htmlFor={`parent-${parentModule.parent}`}
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleParentExpansion(parentModule.parent);
                                  }}
                                >
                                  {parentModule.label}
                                  <span className="badge bg-secondary ms-2" style={{ fontSize: "11px" }}>
                                    {selectedCount}/{totalCount}
                                  </span>
                                </label>
                                <span
                                  className="module-expand-arrow"
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "8px",
                                    color: "#000",
                                    fontWeight: "bold",
                                    flexShrink: 0,
                                    display: "flex",
                                    alignItems: "center"
                                  }}
                                  onClick={() => toggleParentExpansion(parentModule.parent)}
                                >
                                  {isExpanded ? <BsChevronDown size={16} /> : <BsChevronRight size={16} />}
                                </span>
                              </div>

                              {/* Child Modules - Show only when expanded */}
                              {isExpanded && (
                                <div className="mt-2 pt-2" style={{ borderTop: "1px solid #dee2e6" }}>
                                  {parentModule.children.map((child) => (
                                    <div key={child.code} className="ms-3 mb-1">
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`child-${child.code}`}
                                          checked={selectedModules.includes(child.code)}
                                          onChange={() => handleChildToggle(parentModule, child.code)}
                                          disabled={child.disabled || false}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={`child-${child.code}`}
                                          style={{ fontSize: "14px" }}
                                        >
                                          {child.label}
                                        </label>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Right Column */}
                      <div className="col-md-6" style={{ paddingLeft: "20px" }}>
                        {moduleHierarchy.slice(Math.ceil(moduleHierarchy.length / 2)).map((parentModule) => {
                          const isFullySelected = isParentFullySelected(parentModule);
                          const isPartiallySelected = isParentPartiallySelected(parentModule);
                          const selectedCount = getSelectedCount(parentModule);
                          const totalCount = parentModule.children.length;
                          const isExpanded = expandedParents[parentModule.parent];

                          return (
                            <div
                              key={parentModule.parent}
                              className="mb-3"
                              style={{
                                border: "1px solid #dee2e6",
                                borderRadius: "4px",
                                padding: "10px",
                                backgroundColor: isExpanded ? "#f8f9fa" : "#fff"
                              }}
                            >
                              {/* Parent Module with Arrow */}
                              <div className="d-flex align-items-center">
                                <input
                                  className="form-check-input me-2"
                                  type="checkbox"
                                  id={`parent-${parentModule.parent}`}
                                  checked={isFullySelected}
                                  ref={(el) => {
                                    if (el) el.indeterminate = isPartiallySelected;
                                  }}
                                  onChange={() => handleParentToggle(parentModule)}
                                  style={{ flexShrink: 0 }}
                                />
                                <label
                                  className="form-check-label fw-bold flex-grow-1 mb-0"
                                  htmlFor={`parent-${parentModule.parent}`}
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleParentExpansion(parentModule.parent);
                                  }}
                                >
                                  {parentModule.label}
                                  <span className="badge bg-secondary ms-2" style={{ fontSize: "11px" }}>
                                    {selectedCount}/{totalCount}
                                  </span>
                                </label>
                                <span
                                  className="module-expand-arrow"
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "8px",
                                    color: "#000",
                                    fontWeight: "bold",
                                    flexShrink: 0,
                                    display: "flex",
                                    alignItems: "center"
                                  }}
                                  onClick={() => toggleParentExpansion(parentModule.parent)}
                                >
                                  {isExpanded ? <BsChevronDown size={16} /> : <BsChevronRight size={16} />}
                                </span>
                              </div>

                              {/* Child Modules - Show only when expanded */}
                              {isExpanded && (
                                <div className="mt-2 pt-2" style={{ borderTop: "1px solid #dee2e6" }}>
                                  {parentModule.children.map((child) => (
                                    <div key={child.code} className="ms-3 mb-1">
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`child-${child.code}`}
                                          checked={selectedModules.includes(child.code)}
                                          onChange={() => handleChildToggle(parentModule, child.code)}
                                          disabled={child.disabled || false}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={`child-${child.code}`}
                                          style={{ fontSize: "14px" }}
                                        >
                                          {child.label}
                                        </label>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
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

export default CreateNewAdminUser;
