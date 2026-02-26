// import React, { useState } from "react";
// import AdmFeeStructure from "../../components/AdminTabs/AdminFeeStructure/AdmFeeStructure";
// import AdmCopyFeeStructure from "../../components/AdminTabs/AdminFeeStructure/AdmCopyFeeStructure";

// const FeeStructure = () => {
//   const [selectedTab, setSelectedTab] = useState("feeStructure");

//   const handleTabChange = (e) => {
//     setSelectedTab(e.target.value);
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12">
//           {/* Card Layout */}
//           <div className="card p-0">
//             <div className="card-body">
//               {/* Header */}
//               <p
//                 style={{
//                   marginBottom: "0px",
//                   textAlign: "center",
//                   fontSize: "20px",
//                   fontWeight: "700",
//                 }}
//               >
//                 Fee Structure
//               </p>

//               {/* Buttons Row */}
//               <div className="row mb-4">
//                 {" "}
//                 {/* Added more margin here */}
//                 <div className="col-12" style={{ border: "1px solid #ccc" }}>
//                   <button
//                     type="button"
//                     className="btn btn-primary me-2"
//                     style={{
//                       "--bs-btn-padding-y": ".25rem",
//                       "--bs-btn-padding-x": ".5rem",
//                       "--bs-btn-font-size": ".75rem",
//                       width: "150px",
//                     }}
//                   >
//                     Save
//                   </button>

//                   <button
//                     type="button"
//                     className="btn btn-primary me-2"
//                     style={{
//                       "--bs-btn-padding-y": ".25rem",
//                       "--bs-btn-padding-x": ".5rem",
//                       "--bs-btn-font-size": ".75rem",
//                       width: "150px",
//                     }}
//                   >
//                     Clear
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-primary me-2"
//                     style={{
//                       "--bs-btn-padding-y": ".25rem",
//                       "--bs-btn-padding-x": ".5rem",
//                       "--bs-btn-font-size": ".75rem",
//                       width: "150px",
//                     }}
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>

//               {/* Radio Buttons for Tabs - Inline Row */}
//               <div className="row mb-3">
//                 <div
//                   className="col-12 d-flex align-items-center"
//                   style={{ marginTop: "10px", marginBottom: "10px" }}
//                 >
//                   {" "}
//                   {/* Added top margin here */}
//                   <div className="form-check form-check-inline">
//                     <input
//                       type="radio"
//                       className="form-check-input"
//                       id="feeStructureTab"
//                       value="feeStructure"
//                       checked={selectedTab === "feeStructure"}
//                       onChange={handleTabChange}
//                     />
//                     <label
//                       className="form-check-label"
//                       htmlFor="feeStructureTab"
//                     >
//                       Fee Structure
//                     </label>
//                   </div>
//                   <div className="form-check form-check-inline">
//                     <input
//                       type="radio"
//                       className="form-check-input"
//                       id="copyFeeStructureTab"
//                       value="copyFeeStructure"
//                       checked={selectedTab === "copyFeeStructure"}
//                       onChange={handleTabChange}
//                     />
//                     <label
//                       className="form-check-label"
//                       htmlFor="copyFeeStructureTab"
//                     >
//                       Copy Fee Structure
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {/* Conditional Rendering of Tabs */}
//               <div>
//                 {selectedTab === "feeStructure" && <AdmFeeStructure />}
//                 {selectedTab === "copyFeeStructure" && <AdmCopyFeeStructure />}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FeeStructure;


import React, { useState } from "react";
import AdmFeeStructure from "../../components/AdminTabs/AdminFeeStructure/AdmFeeStructure";
import AdmCopyFeeStructure from "../../components/AdminTabs/AdminFeeStructure/AdmCopyFeeStructure";

const FeeStructure = () => {
  const [selectedTab, setSelectedTab] = useState("feeStructure");

  const handleTabChange = (e) => {
    setSelectedTab(e.target.value);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          {/* Card Layout */}
          <div className="card p-0">
            <div className="card-body">
              {/* Header */}
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                   Fee Structure
              </p>

              {/* Radio Buttons for Tabs - Inline Row */}
              <div className="row mb-3">
                <div
                  className="col-12 d-flex align-items-center"
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="feeStructureTab"
                      value="feeStructure"
                      checked={selectedTab === "feeStructure"}
                      onChange={handleTabChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="feeStructureTab"
                    >
                        New Fee Structure
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="copyFeeStructureTab"
                      value="copyFeeStructure"
                      checked={selectedTab === "copyFeeStructure"}
                      onChange={handleTabChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="copyFeeStructureTab"
                    >
                      Copy Fee Structure
                    </label>
                  </div>
                </div>
              </div>

              {/* Conditional Rendering of Tabs */}
              <div>
                {selectedTab === "feeStructure" && <AdmFeeStructure />}
                {selectedTab === "copyFeeStructure" && <AdmCopyFeeStructure />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeStructure;




