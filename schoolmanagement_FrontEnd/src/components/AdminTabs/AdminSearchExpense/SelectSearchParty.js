
//debasmita backup//

// import React, { useState, useEffect } from "react";
// import { Modal, Button, Table } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./SelectSearchParty.css";
// import { ApiUrl } from "../../../ApiUrl";

// const SelectStudentModal = ({ show, handleClose, onSelect }) => {
//   const [formData, setFormData] = useState({
//     party_name: "",
//     party_type: "",
//     gst_no: "",
//     city: "",
//     state: "",
//   });
//   const [searchResults, setSearchResults] = useState([]);
//   const [showTable, setShowTable] = useState(false);
//   const [selectedPartyId, setSelectedPartyId] = useState(null);
//   const orgId = localStorage.getItem("orgId");
//   const branchId = localStorage.getItem("branchId");
//   const [isActive, setIsActive] = useState(true);

//   const handleSearch = async () => {
//     let queryParams = [];
//     let partyTypeValue = "";
//     if (formData.party_type === "Customer") partyTypeValue = "C";
//     else if (formData.party_type === "Supplier") partyTypeValue = "S";
//     if (orgId) queryParams.push(`org_id=${orgId}`);
//     if (branchId) queryParams.push(`branch_id=${branchId}`);
//     if (formData.party_name)
//       queryParams.push(`party_name=${formData.party_name}`);
//     if (formData.gst_no) queryParams.push(`gst_no=${formData.gst_no}`);
//     if (formData.city) queryParams.push(`city=${formData.city}`);
//     if (formData.state) queryParams.push(`state=${formData.state}`);
//     if (partyTypeValue) queryParams.push(`party_type=${partyTypeValue}`);
//     queryParams.push(`is_active=${isActive}`);

//     try {
//       const response = await fetch(
//         `${
//           ApiUrl.apiurl
//         }/EXPENSE/PARTY_MASTER/PartyMasterSearchList/?${queryParams.join("&")}`
//       );
//       const data = await response.json();

//       if (data.message === "success") {
//         setSearchResults(data.data);
//         setShowTable(true);
//       } else {
//         setSearchResults(["No Record Found"]);
//         setShowTable(false);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData({ ...formData, [id]: value });
//   };
//   const handleClear = () => {
//     setFormData({
//       party_name: "",
//       party_type: "",
//       gst_no: "",
//       city: "",
//       state: "",
//     });
//     setSearchResults([]);
//     setShowTable(false);
//     setSelectedPartyId(null);
//     setIsActive(true);
//   };
//   useEffect(() => {
//     if (!show) {
//       handleClear();
//     }
//   }, [show]);

//   const handleSelectParty = (party) => {
//     setSelectedPartyId(party.party_id);
//     onSelect(party);
//   };

//   return (
//     <Modal show={show} size="xl" centered>
//       <Modal.Header closeButton onClick={handleClose}></Modal.Header>
//       <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto" }}>
//         <div className="container p-1">
//           <div className="row">
//             <div className="col-12">
//               <div className="card p-0">
//                 <div className="card-body">
//                   {/* <p style={{ marginBottom: "0px", textAlign: "center", fontSize: "20px" }}>
//                     PARTY SEARCH
//                   </p> */}
//                   <p className="text-center fs-5">PARTY SEARCH</p>
//                   <div className="row mb-2">
//                     <div
//                       className="col-12"
//                       // style={{ border: "1px solid #ccc" }}
//                     >
//                       <button
//                         type="button"
//                         className="btn btn-primary me-2"
//                         onClick={handleSearch}
//                         style={{
//                           width: "150px",
//                         }}
//                       >
//                         Search
//                       </button>
//                       <button
//                         type="button"
//                         className="btn btn-primary me-2"
//                         style={{
//                           width: "150px",
//                         }}
//                         onClick={handleClear}
//                       >
//                         Clear
//                       </button>
//                       <button
//                         type="button"
//                         className="btn btn-danger me-2"
//                         style={{
//                           width: "150px",
//                         }}
//                         onClick={handleClose}
//                       >
//                         Close
//                       </button>
//                     </div>
//                   </div>

//                   {/* Search Fields */}
//                   <div className="row">
//                     <div className="col-md-4 mb-2">
//                       <label className="form-label">Party Name</label>
//                       <input
//                         type="text"
//                         id="party_name"
//                         className="form-control detail"
//                         placeholder="Enter party name"
//                         value={formData.party_name}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                     <div className="col-md-4 mb-2">
//                       <label className="form-label">GST Number</label>
//                       <input
//                         type="text"
//                         id="gst_no"
//                         className="form-control detail"
//                         placeholder="Enter GST number"
//                         value={formData.gst_no}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                     <div className="col-md-4 mb-2">
//                       <label className="form-label">Party Type</label>
//                       <select
//                         id="party_type"
//                         className="form-select"
//                         value={formData.party_type}
//                         onChange={handleInputChange}
//                       >
//                         <option value="">Select party type</option>
//                         <option value="Customer">Customer</option>
//                         <option value="Supplier">Supplier</option>
//                       </select>
//                     </div>
//                     <div className="col-md-4 mb-2">
//                       <label className="form-label">City</label>
//                       <input
//                         type="text"
//                         id="city"
//                         className="form-control detail"
//                         placeholder="Enter city"
//                         value={formData.city}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                     <div className="col-md-4 mb-2">
//                       <label className="form-label">State</label>
//                       <input
//                         type="text"
//                         id="state"
//                         className="form-control detail"
//                         placeholder="Enter state"
//                         value={formData.state}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                     <div className="col-12 col-md-3 mb-1">
//                       <span className="me-3" style={{ fontWeight: "700" }}>
//                         {/* Send SMS to: */}
//                       </span>
//                       <div className="d-flex flex-row me-2">
//                         <div className="form-check">
//                           {/* <input
//                             className="form-check-input"
//                             type="checkbox"
//                             // name="flexRadioDefault"
//                             id="flexRadioDefault3"
//                             onChange={() => setIsActive(!isActive)}
//                           /> */}
//                           <input
//                             className="form-check-input"
//                             type="checkbox"
//                             id="activeFilter"
//                             checked={isActive}
//                             onChange={() => setIsActive(!isActive)}
//                           />
//                           <label
//                             className="form-check-label"
//                             htmlFor="flexRadioDefault3"
//                           >
//                             Active
//                           </label>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Results Table */}
//                   {showTable && (
//                     <div className="row mt-2">
//                       <div className="table-responsive">
//                         <Table className="table table-bordered table-striped">
//                           <thead>
//                             <tr>
//                               <th>Party Name</th>
//                               <th>Party Type</th>
//                               <th>Address</th>
//                               <th>City</th>
//                               <th>State</th>
//                               <th>GST No</th>
//                               <th>Phone</th>
//                               <th>Email ID</th>
//                               <th>Active</th>
//                               <th>Select</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {searchResults.map((party) => (
//                               <tr key={party.party_id}>
//                                 <td>{party.party_name}</td>
//                                 <td>{party.party_type}</td>
//                                 <td>{party.address}</td>
//                                 <td>{party.city}</td>
//                                 <td>{party.state}</td>
//                                 <td>{party.gst_no}</td>
//                                 <td>{party.phone}</td>
//                                 <td>{party.email_id}</td>
//                                 <td>{party.is_active ? "Yes" : "No"}</td>
//                                 <td>
//                                   <input
//                                     type="radio"
//                                     name="selectedParty"
//                                     checked={selectedPartyId === party.party_id}
//                                     onChange={() => handleSelectParty(party)}
//                                   />
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </Table>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default SelectStudentModal;



import React, { useState, useEffect } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SelectSearchParty.css";
import { ApiUrl } from "../../../ApiUrl";

const SelectStudentModal = ({ show, handleClose, onSelect }) => {
  const [formData, setFormData] = useState({
    party_name: "",
    party_type: "",
    gst_no: "",
    city: "",
    state: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [selectedPartyId, setSelectedPartyId] = useState(null);
  const orgId = localStorage.getItem("orgId");
  const branchId = localStorage.getItem("branchId");
  const [isActive, setIsActive] = useState(true);

  const handleSearch = async () => {
    let queryParams = [];
    let partyTypeValue = "";
    if (formData.party_type === "Customer") partyTypeValue = "C";
    else if (formData.party_type === "Supplier") partyTypeValue = "S";
    if (orgId) queryParams.push(`org_id=${orgId}`);
    if (branchId) queryParams.push(`branch_id=${branchId}`);
    if (formData.party_name)
      queryParams.push(`party_name=${formData.party_name}`);
    if (formData.gst_no) queryParams.push(`gst_no=${formData.gst_no}`);
    if (formData.city) queryParams.push(`city=${formData.city}`);
    if (formData.state) queryParams.push(`state=${formData.state}`);
    if (partyTypeValue) queryParams.push(`party_type=${partyTypeValue}`);
    queryParams.push(`is_active=${isActive}`);

    try {
      const response = await fetch(
        `${ApiUrl.apiurl
        }EXPENSE/PARTY_MASTER/PartyMasterSearchList/?${queryParams.join("&")}`
      );
      const data = await response.json();

      if (data.message === "success") {
        setSearchResults(data.data);
        setShowTable(true);
      } else {
        setSearchResults(["No Record Found"]);
        setShowTable(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  const handleClear = () => {
    setFormData({
      party_name: "",
      party_type: "",
      gst_no: "",
      city: "",
      state: "",
    });
    setSearchResults([]);
    setShowTable(false);
    setSelectedPartyId(null);
    setIsActive(true);
  };
  useEffect(() => {
    if (!show) {
      handleClear();
    }
  }, [show]);

  const handleSelectParty = (party) => {
    setSelectedPartyId(party.party_id);
    onSelect(party);
  };

  return (
    <Modal show={show} size="xl" centered>
      <Modal.Header closeButton onClick={handleClose}></Modal.Header>
      <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <div className="container p-1">
          <div className="row">
            <div className="col-12">
              <div className="card p-0">
                <div className="card-body">
                  {/* <p style={{ marginBottom: "0px", textAlign: "center", fontSize: "20px" }}>
                    PARTY SEARCH
                  </p> */}
                  <p className="text-center fs-5">PARTY SEARCH</p>
                  <div className="row mb-2">
                    <div
                      className="col-12 d-flex flex-wrap gap-2"
                    // style={{ border: "1px solid #ccc" }}
                    >
                      <button
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={handleSearch}
                        style={{
                          width: "150px",
                        }}
                      >
                        Search
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary me-2"
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

                  {/* Search Fields */}
                  <div className="row">
                    <div className="col-md-4 mb-2">
                      <label className="form-label">Party Name</label>
                      <input
                        type="text"
                        id="party_name"
                        className="form-control detail"
                        placeholder="Enter party name"
                        value={formData.party_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label className="form-label">GST Number</label>
                      <input
                        type="text"
                        id="gst_no"
                        className="form-control detail"
                        placeholder="Enter GST number"
                        value={formData.gst_no}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label className="form-label">Party Type</label>
                      <select
                        id="party_type"
                        className="form-select"
                        value={formData.party_type}
                        onChange={handleInputChange}
                      >
                        <option value="">Select party type</option>
                        <option value="Customer">Customer</option>
                        <option value="Supplier">Supplier</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-2">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        id="city"
                        className="form-control detail"
                        placeholder="Enter city"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        id="state"
                        className="form-control detail"
                        placeholder="Enter state"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-1">
                      <span className="me-3" style={{ fontWeight: "700" }}>
                        {/* Send SMS to: */}
                      </span>
                      <div className="d-flex flex-row me-2">
                        <div className="form-check">
                          {/* <input
                            className="form-check-input"
                            type="checkbox"
                            // name="flexRadioDefault"
                            id="flexRadioDefault3"
                            onChange={() => setIsActive(!isActive)}
                          /> */}
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="activeFilter"
                            checked={isActive}
                            onChange={() => setIsActive(!isActive)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault3"
                          >
                            Active
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results Table */}
                  {showTable && (
                    <div className="row mt-2">
                      <div className="table-responsive">
                        <Table className="table table-bordered table-striped">
                          <thead>
                            <tr>
                              <th>Party Name</th>
                              <th>Party Type</th>
                              <th>Address</th>
                              <th>City</th>
                              <th>State</th>
                              <th>GST No</th>
                              <th>Phone</th>
                              <th>Email ID</th>
                              <th>Active</th>
                              <th>Select</th>
                            </tr>
                          </thead>
                          <tbody>
                            {searchResults.map((party) => (
                              <tr key={party.party_id}>
                                <td>{party.party_name}</td>
                                <td>{party.party_type}</td>
                                <td>{party.address}</td>
                                <td>{party.city}</td>
                                <td>{party.state}</td>
                                <td>{party.gst_no}</td>
                                <td>{party.phone}</td>
                                <td>{party.email_id}</td>
                                <td>{party.is_active ? "Yes" : "No"}</td>
                                <td>
                                  <input
                                    type="radio"
                                    name="selectedParty"
                                    checked={selectedPartyId === party.party_id}
                                    onChange={() => handleSelectParty(party)}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SelectStudentModal;