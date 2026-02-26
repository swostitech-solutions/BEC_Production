import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";
import ReactPaginate from "react-paginate";
import "./NonTeachingStaffSearch.css";

const NonTeachingStaffSearch = () => {
  const [staffData, setStaffData] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    staffCode: "",
    firstName: "",
    middleName: "",
    lastName: "",
  });

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  const pageCount = Math.ceil(staffData.length / itemsPerPage);

  const getCurrentPageData = () => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return staffData.slice(start, end);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleClear = () => {
    setSearchParams({
      staffCode: "",
      firstName: "",
      middleName: "",
      lastName: "",
    });
    setStaffData([]);
    setCurrentPage(0);
  };

  const handleClose = () => {
    navigate("/admin/dashboard");
  };

  const handleNew = () => {
    sessionStorage.removeItem("nts_id");
    navigate("/admin/non-teaching-staff-details");
  };

  const fetchStaffData = async () => {
    try {
      const orgId =
        sessionStorage.getItem("organization_id") ||
        sessionStorage.getItem("org_id") ||
        localStorage.getItem("orgId") ||
        "";
      const branchId =
        sessionStorage.getItem("branch_id") ||
        localStorage.getItem("branchId") ||
        "";

      const params = new URLSearchParams();
      if (orgId) params.append("organization_id", orgId);
      if (branchId) params.append("branch_id", branchId);

      // Combine all search fields into a single search parameter
      const searchTerms = [
        searchParams.staffCode,
        searchParams.firstName,
        searchParams.middleName,
        searchParams.lastName
      ].filter(term => term && term.trim() !== "").join(" ");
      
      if (searchTerms) {
        params.append("search", searchTerms);
      }

      const response = await fetch(
        `${ApiUrl.apiurl}NON_TEACHING_STAFF/List/?${params.toString()}`
      );

      const result = await response.json();
      if (response.ok && Array.isArray(result.data)) {
        const listData = result.data;
        const missingDobIds = listData
          .filter((item) => !item.date_of_birth && !item.dob)
          .map((item) => item.nts_id);

        if (missingDobIds.length === 0) {
          setStaffData(listData);
          return;
        }

        const details = await Promise.all(
          missingDobIds.map(async (id) => {
            try {
              const detailResponse = await fetch(
                `${ApiUrl.apiurl}NON_TEACHING_STAFF/Details/${id}/`
              );
              const detailResult = await detailResponse.json();
              const isSuccess =
                detailResult.status === "success" ||
                String(detailResult.message || "")
                  .toLowerCase()
                  .includes("success");
              const detailData =
                detailResult.data?.data ||
                detailResult.data?.[0] ||
                detailResult.data ||
                null;
              const dobValue =
                detailData?.date_of_birth ||
                detailData?.dob ||
                detailData?.dateOfBirth ||
                "";
              return isSuccess && detailData
                ? { nts_id: id, date_of_birth: dobValue }
                : { nts_id: id, date_of_birth: "" };
            } catch (err) {
              console.error("Failed to fetch DOB for nts_id:", id, err);
              return { nts_id: id, date_of_birth: "" };
            }
          })
        );

        const dobMap = new Map(details.map((d) => [d.nts_id, d.date_of_birth]));
        const merged = listData.map((item) => ({
          ...item,
          date_of_birth: item.date_of_birth || item.dob || dobMap.get(item.nts_id) || "",
        }));

        setStaffData(merged);
      } else {
        console.error("Failed to fetch non-teaching staff data:", result);
        setStaffData([]);
      }
    } catch (error) {
      console.error("Error fetching non-teaching staff data:", error);
      setStaffData([]);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const handleEdit = (ntsId) => {
    sessionStorage.setItem("nts_id", ntsId);
    navigate("/admin/non-teaching-staff-details");
  };

  return (
    <div className="container-fluid non-teaching-staff-container">
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
                NON-TEACHING STAFF SEARCH
              </p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleNew}
                  >
                    New
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={fetchStaffData}
                  >
                    Search
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
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mt-3 mb-3">
                      <div className="col-md-3 mb-3">
                        <label htmlFor="staff-code" className="form-label">
                          Staff Code
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="staff-code"
                            className="form-control detail"
                            placeholder="Enter staff code"
                            value={searchParams.staffCode}
                            onChange={(e) =>
                              setSearchParams({
                                ...searchParams,
                                staffCode: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-9 mb-3">
                        <label htmlFor="staff-name" className="form-label">
                          Staff Name
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            className="form-control detail ms-2"
                            placeholder="Enter First name"
                            value={searchParams.firstName}
                            onChange={(e) =>
                              setSearchParams({
                                ...searchParams,
                                firstName: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            className="form-control detail ms-2"
                            placeholder="Enter Middle name"
                            value={searchParams.middleName}
                            onChange={(e) =>
                              setSearchParams({
                                ...searchParams,
                                middleName: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            className="form-control detail ms-2"
                            placeholder="Enter Last name"
                            value={searchParams.lastName}
                            onChange={(e) =>
                              setSearchParams({
                                ...searchParams,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sr.No</th>
                          <th>Staff Code</th>
                          <th>Name</th>
                          <th>Date Of Birth</th>
                          <th>Mobile No</th>
                          <th>Email ID</th>
                          <th>Date Of Joining</th>
                          <th>Status</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCurrentPageData().length > 0 ? (
                          getCurrentPageData().map((staff, index) => (
                            <tr key={staff.nts_id}>
                              <td>{currentPage * itemsPerPage + index + 1}</td>
                              <td>{staff.staff_code}</td>
                              <td>{staff.full_name}</td>
                              <td>{staff.date_of_birth || staff.dob || "-"}</td>
                              <td>{staff.phone_number}</td>
                              <td>{staff.email || "-"}</td>
                              <td>{staff.date_of_joining || "-"}</td>
                              <td>{staff.status}</td>
                              <td>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleEdit(staff.nts_id)}
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={9} className="text-center">
                              No Data Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

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
                    containerClassName={
                      "pagination justify-content-center mt-3"
                    }
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    activeClassName={"active"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonTeachingStaffSearch;
