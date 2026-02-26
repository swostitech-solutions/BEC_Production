import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ApiUrl } from "../../../ApiUrl";
import EditAdminUserModal from "./EditAdminUserModal";
import "./CreateAdminUser.css";

const CreateAdminUser = () => {
  const navigate = useNavigate();

  // State management
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [staffMap, setStaffMap] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Get access token and org/branch
  const getAccessToken = () => localStorage.getItem("accessToken");
  const getOrgId = () => sessionStorage.getItem("org_id") || localStorage.getItem("orgId");
  const getBranchId = () => sessionStorage.getItem("branch_id") || localStorage.getItem("branchId");

  // Fetch existing roles on component mount
  useEffect(() => {
    fetchStaffList();
    fetchRoles();
  }, []);

  // Update filtered roles when roles change or search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRoles(roles);
    } else {
      const filtered = roles.filter((role) => {
        const roleNameMatch = role.role_name?.toLowerCase().includes(searchTerm.toLowerCase());
        return roleNameMatch;
      });
      setFilteredRoles(filtered);
    }
  }, [roles, searchTerm]);

  // Fetch staff list to map reference_id to names
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
          // Create a map of employee id -> name
          const map = {};
          result.data.forEach((staff) => {
            map[staff.id] = staff.employee_name;
          });
          setStaffMap(map);
        }
      }
    } catch (error) {
      console.error("Error fetching staff list:", error);
    }
  };

  // Fetch all admin user roles
  const fetchRoles = async (searchQuery = "") => {
    try {
      const orgId = getOrgId();
      const branchId = getBranchId();

      let url = `${ApiUrl.apiurl}AdminUser/List/`;
      if (searchQuery) {
        url += `?search=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          setRoles(result.data);
          // filteredRoles will be updated by useEffect
        }
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Handle close
  const handleClose = () => {
    navigate("/admin/dashboard");
  };

  // Handle new button - navigate to new page
  const handleNew = () => {
    navigate("/admin/create-admin-user/new");
  };

  // Handle search
  const handleSearch = () => {
    fetchRoles(searchTerm);
  };

  // Handle clear
  const handleClear = () => {
    setSearchTerm("");
    fetchRoles();
  };

  // Handle edit button
  const handleEdit = (role) => {
    setSelectedRole(role);
    setShowEditModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowEditModal(false);
    setSelectedRole(null);
  };

  // Handle successful update
  const handleUpdateSuccess = () => {
    fetchRoles(); // Refresh the table
    handleModalClose();
  };

  // Format modules for display
  const formatModulesDisplay = (modules) => {
    if (!modules || modules.length === 0) {
      return "All Modules";
    }

    // Group modules by parent
    const parentGroups = {};
    modules.forEach(module => {
      // Check if it's child module (contains dot)
      if (module.includes('.')) {
        const parent = module.split('.')[0];
        if (!parentGroups[parent]) {
          parentGroups[parent] = [];
        }
        parentGroups[parent].push(module);
      } else {
        // Old format - parent only (backward compatibility)
        if (!parentGroups[module]) {
          parentGroups[module] = ['all'];
        }
      }
    });

    // Format for display
    const formattedItems = Object.keys(parentGroups).map(parent => {
      const count = parentGroups[parent].includes('all')
        ? 'All'
        : parentGroups[parent].length;
      // Capitalize first letter
      const parentName = parent.charAt(0).toUpperCase() + parent.slice(1).replace(/_/g, ' ');
      return `${parentName} (${count})`;
    });

    return formattedItems.join(', ');
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
                  ADMIN USER MANAGEMENT
                </p>

                {/* Action Buttons */}
                <div className="row mb-3 mt-3 mx-0">
                  <div className="col-12 d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-primary me-2"
                      onClick={handleNew}
                    >
                      New
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary me-2"
                      onClick={handleSearch}
                    >
                      Search
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

                {/* Search Input Section (White Box) */}
                <div className="row mt-3 mx-2">
                  <div className="col-12 custom-section-box">
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                      <div className="row flex-grow-1 mt-2">
                        <div className="col-12 col-md-6 mb-2">
                          <label htmlFor="searchTerm" className="form-label">
                            Search by Role Name
                          </label>
                          <input
                            type="text"
                            id="searchTerm"
                            name="searchTerm"
                            className="form-control detail"
                            placeholder="Search by role name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSearch();
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Roles Table */}
                <div className="row mt-3">
                  <div className="col-12">
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover table-sm">
                        <thead className="table-dark">
                          <tr>
                            <th scope="col">S.No</th>
                            <th scope="col">Role Name</th>
                            <th scope="col">User Name</th>
                            <th scope="col">Non Teaching Staff</th>
                            <th scope="col" style={{ width: "350px", maxWidth: "350px" }}>Modules Access</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRoles.filter(role => role.role_name && role.role_name.trim() !== "").length > 0 ? (
                            filteredRoles.filter(role => role.role_name && role.role_name.trim() !== "").map((role, index) => (
                              <tr key={role.id}>
                                <td>{index + 1}</td>
                                <td>{role.role_name}</td>
                                <td>{role.user_name}</td>
                                <td>
                                  {role.reference_id && role.reference_id !== 0
                                    ? staffMap[role.reference_id] || "N/A"
                                    : "N/A"}
                                </td>
                                <td style={{ maxWidth: "350px", whiteSpace: "normal", wordWrap: "break-word" }}>
                                  {formatModulesDisplay(role.accessible_modules)}
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-primary me-2"
                                    onClick={() => handleEdit(role)}
                                    title="Edit Role"
                                  >
                                    <FaEdit /> Edit
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">
                                No roles found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedRole && (
        <EditAdminUserModal
          show={showEditModal}
          handleClose={handleModalClose}
          roleData={selectedRole}
          staffMap={staffMap}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default CreateAdminUser;
