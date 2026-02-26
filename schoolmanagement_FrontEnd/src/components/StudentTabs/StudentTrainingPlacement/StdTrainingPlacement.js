import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import ReactPaginate from "react-paginate";
import "./StdTrainingPlacement.css";

const StdTrainingPlacement = () => {
  const navigate = useNavigate();

  const orgId = sessionStorage.getItem("organization_id") || "1";
  const branchId = sessionStorage.getItem("branch_id") || "1";

  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const offset = currentPage * itemsPerPage;
  const currentItems = tableData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(tableData.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const fetchData = async () => {
    try {
      const searchParams = new URLSearchParams({
        organization_id: orgId,
        branch_id: branchId,
      });

      const token = localStorage.getItem("accessToken");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${ApiUrl.apiurl}TrainingPlacement/List/?${searchParams}`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.message === "success") {
          setTableData(data.data);
        } else {
          setTableData([]);
        }
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = () => {
    navigate("/student/dashboards");
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
                TRAINING & PLACEMENT
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{ width: "120px" }}
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-primary">
                      <tr>
                        <th>Sr.No</th>
                        <th>Company/Organization</th>
                        <th>Training Module</th>
                        <th>Duration</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Course</th>
                        <th>Department</th>
                        <th>Participants</th>
                        <th>HR Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                          <tr key={item.id}>
                            <td>{offset + index + 1}</td>
                            <td>{item.company_name}</td>
                            <td>{item.module}</td>
                            <td>{item.duration}</td>
                            <td>{item.from_date}</td>
                            <td>{item.to_date}</td>
                            <td>{item.course_name || "N/A"}</td>
                            <td>{item.department_name || "N/A"}</td>
                            <td>{item.participants || "N/A"}</td>
                            <td>{item.hr_name || "N/A"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="10" className="text-center">
                            No training & placement data available
                          </td>
                        </tr>
                      )}
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

export default StdTrainingPlacement;

