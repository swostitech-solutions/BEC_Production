// import React, { useRef, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import SelectStudentModal from "../AdminAttendanceEntry/SelectStudentModal";
// import { useNavigate } from "react-router-dom";  
// import { ApiUrl } from "../../../ApiUrl";

// const AdmAttendanceEntry = () => {
//   const [showModal, setShowModal] = useState(false);
//   const navigate = useNavigate();

//   const dateFromRef = useRef(null);
//   const dateToRef = useRef(null);
//   const messageTypeRef = useRef(null);
//   const studentNameRef = useRef(null);
//   const initiatedByRef = useRef(null);
//   const sectionRef = useRef(null);
//   const classRef = useRef(null);

//   const handleClear = () => {
//     if (dateFromRef.current) dateFromRef.current.value = "";
//     if (dateToRef.current) dateToRef.current.value = "";
//     if (messageTypeRef.current) messageTypeRef.current.value = "";
//     if (studentNameRef.current) studentNameRef.current.value = "";
//     if (initiatedByRef.current) initiatedByRef.current.value = "";
//     if (sectionRef.current) sectionRef.current.value = "";
//     if (classRef.current) classRef.current.value = "";
//   };



//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   const handleNew = () => {
//     navigate("/admbookMaster");  
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12">
//           <div className="card p-0">
//             <div className="card-body">
//               <p
//                 style={{
//                   marginBottom: "0px",
//                   textAlign: "center",
//                   fontSize: "20px",
//                   fontWeight: "700",
//                 }}
//               >
//                 BOOK SEARCH
//               </p>
//               <div className="row mb-2">
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
//                     onClick={handleNew}  
//                   >
//                     New
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
//                     onClick={handleClear}
//                   >
//                     Search
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
//               <div
//                 className="row justify-content-center"
//                 style={{ border: "1px solid #ccc" }}
//               >
//                 <div className="col-12">
//                   <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
//                     <div className="row flex-grow-1">
//                       <div className="col-12 col-md-3 mb-0">
//                         <label htmlFor="book-code" className="form-label">
//                           Book Code
//                         </label>
//                         <div className="d-flex align-items-center">
//                           <input
//                             type="text"
//                             id="book-code"
//                             className="form-control"
//                             placeholder="Enter book code"
//                             ref={studentNameRef}
//                           />
//                         </div>
//                       </div>
//                       <div className="col-12 col-md-3 mb-0">
//                         <label
//                           htmlFor="book-accession-no"
//                           className="form-label"
//                         >
//                           Book Accession No
//                         </label>
//                         <div className="d-flex align-items-center">
//                           <input
//                             type="text"
//                             id="book-accession-no"
//                             className="form-control"
//                             placeholder="Enter book accession no"
//                             ref={studentNameRef}
//                           />
//                         </div>
//                       </div>
//                       <div className="col-12 col-md-3 mb-0">
//                         <label htmlFor="book-title" className="form-label">
//                           Book Title
//                         </label>
//                         <div className="d-flex align-items-center">
//                           <input
//                             type="text"
//                             id="book-title"
//                             className="form-control"
//                             placeholder="Enter book title"
//                             ref={studentNameRef}
//                           />
//                         </div>
//                       </div>
//                       <div className="col-12 col-md-3 mb-0">
//                         <label htmlFor="book-author" className="form-label">
//                           Book Author
//                         </label>
//                         <div className="d-flex align-items-center">
//                           <input
//                             type="text"
//                             id="book-author"
//                             className="form-control"
//                             placeholder="Enter book author"
//                             ref={studentNameRef}
//                           />
//                         </div>
//                       </div>
//                       <div className="col-12 col-md-3 mb-0">
//                         <label htmlFor="category" className="form-label">
//                           Category
//                         </label>
//                         <select
//                           id="category"
//                           className="form-select"
//                           ref={initiatedByRef}
//                         >
//                           <option value="">Select class</option>
//                         </select>
//                       </div>
//                       <div className="col-12 col-md-3 mb-0">
//                         <label htmlFor="sub-category" className="form-label">
//                           Sub Category
//                         </label>
//                         <select
//                           id="sub-category"
//                           className="form-select"
//                           ref={sectionRef}
//                         >
//                           <option value="">Select sub category</option>
//                           <option value="A">A</option>
//                           <option value="B">B</option>
//                           <option value="C">C</option>
//                         </select>
//                       </div>
//                       <div className="col-12 col-md-3 mb-1">
//                         <label htmlFor="location" className="form-label">
//                           Location
//                         </label>
//                         <select
//                           id="location"
//                           className="form-select"
//                           ref={classRef}
//                         >
//                           <option value="">Select location</option>
//                           <option value="A">A</option>
//                           <option value="B">B</option>
//                           <option value="C">C</option>
//                         </select>
//                       </div>
//                       <SelectStudentModal
//                         show={showModal}
//                         handleClose={handleCloseModal}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="row">
//                 <div className="col-12">
//                   <div className="table-responsive">
//                     <table className="table table-bordered table-hover">
//                       <thead>
//                         <tr>
//                           <th>Sr.No</th>
//                           <th>Book Name</th>
//                           <th>Book Code</th>
//                           <th>Accession No</th>
//                           <th>Category</th>
//                           <th>Sub Category</th>
//                           <th>Publisher</th>
//                           <th>Author Name</th>
//                           <th>Publish Year</th>
//                           <th>Location</th>
//                           <th>Edit</th>
//                         </tr>
//                       </thead>
//                       <tbody colspan={9}>No Data Found</tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdmAttendanceEntry;



import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SelectStudentModal from "../AdminAttendanceEntry/SelectStudentModal";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import Select from "react-select";
import useFetchBookCategories from "../../hooks/useFetchBookCategories";
import useFetchBookSubCategories from "../../hooks/useFetchBookSubCategories";
import ReactPaginate from "react-paginate";

const AdmBookSearch = () => {
  const [showModal, setShowModal] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [error, setError] = useState("");
  // const { categories } = useFetchBookCategories();
  const [categoryId, setCategoryId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [updatedData, setUpdatedData] = useState(null); // State to store the full API response

  // Define all search parameters
  const [academicYearId, setAcademicYearId] = useState(
    localStorage.getItem("academicSessionId") || ""
  );
  const itemsPerPage = 10; // Adjust items per page as needed
  const [currentPage, setCurrentPage] = useState(0);
  const [bookCode, setBookCode] = useState("");
  const [bookAccessionNo, setBookAccessionNo] = useState("");
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [bookCategory, setBookCategory] = useState("");
  const [bookSubCategory, setBookSubCategory] = useState("");
  const [bookDetails, setBookDetails] = useState(null);
  const [branch, setBranch] = useState("");
  const [location, setLocation] = useState("");
  const [isbn, setIsbn] = useState("");
  const [typeofBooks, setTypeofBooks] = useState("");
  const navigate = useNavigate();
  // const { categories } = useFetchBookCategories();
  const { subCategories } = useFetchBookSubCategories(bookCategory);
  const { categories } = useFetchBookCategories(); // Fetch categories
  const initiatedByRef = useRef();

  const dateFromRef = useRef(null);
  const dateToRef = useRef(null);
  const messageTypeRef = useRef(null);
  const studentNameRef = useRef(null);
  // const initiatedByRef = useRef(null);
  const sectionRef = useRef(null);
  const classRef = useRef(null);

  const handleClear = () => {
    setBookCode("");
    setBookAccessionNo("");
    setBookName("");
    setAuthor("");
    setBookCategory("");
    setBookSubCategory("");
    setBranch("");
    setLocation("");
    setIsbn("");
    setTypeofBooks("");
    setTableData([]); // Clear table data
    setShowTable(false); // Hide table
    setError(""); // Clear any error message
    setCurrentPage(0); // Reset pagination

    // Reset React Select dropdowns
    setSelectedOption(null);
    setSelectedBranch(null);
    setSelectedLocation(null);

    // Reset input fields with useRef
    if (dateFromRef.current) dateFromRef.current.value = "";
    if (dateToRef.current) dateToRef.current.value = "";
    if (messageTypeRef.current) messageTypeRef.current.value = "";
    if (studentNameRef.current) studentNameRef.current.value = "";
    if (initiatedByRef.current) initiatedByRef.current.value = "";
    if (sectionRef.current) sectionRef.current.value = "";
    if (classRef.current) classRef.current.value = "";
  };

  // Map categories to React Select options
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name, // Label for display
  }));
  // Map sub-categories to React Select options
  const subCategoryOptions = subCategories.map((subCategory) => ({
    value: subCategory.id,
    label: subCategory.name, // Label for display
  }));

  // Handle category change
  const handleCategoryChange = (selectedOption) => {
    const selectedCategoryId = selectedOption ? selectedOption.value : null;
    setBookCategory(selectedCategoryId); // Update selected category
    setBookSubCategory(null); // Reset sub-category when category changes
    console.log("Selected Category Value:", selectedCategoryId);
  };
  // Handle sub-category change
  const handleSubCategoryChange = (selectedOption) => {
    setBookSubCategory(selectedOption ? selectedOption.value : null); // Update selected sub-category
    console.log("Selected Sub Category Value:", selectedOption?.value);
  };

  // const handleCloseModal = () => {
  //   setShowModal(false);
  // };

  useEffect(() => {
    const fetchLocations = async () => {
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");
      const token = localStorage.getItem("token"); // Get token

      if (!orgId || !branchId) {
        setError("Organization or branch ID not found in local storage.");
        return;
      }

      try {
        const response = await fetch(
          `${ApiUrl.apiurl}BOOK_LOCATION/GetALLBookLocationList/${orgId}/${branchId}/`
        );
        const data = await response.json();
        console.log("Locations API Response:", data);

        if (data.message === "success") {
          const formattedLocations = data.data.map((loc) => ({
            value: loc.id,
            label: loc.booklocation, // Correct field name from API response
          }));
          setLocations(formattedLocations);
        } else {
          console.error("Failed to fetch locations");
        }
      } catch (error) {
        console.error("Error fetching location list:", error);
      }
    };

    fetchLocations();
  }, []);

  // const handleLocationChange = (selectedOption) => {
  //   setLocation(selectedOption ? selectedOption.value : ""); // Update the location state
  //   // console.log("Selected Location:", selectedOption);
  // };

  useEffect(() => {
    const fetchBranches = async () => {
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");
      // const token = localStorage.getItem("token"); // Token not needed for this endpoint

      if (!orgId || !branchId) {
        setError("Organization or branch ID not found in local storage.");
        return;
      }

      try {
        const response = await fetch(
          `${ApiUrl.apiurl}LIBRARYBRANCH/GetLibraryBranchList/${orgId}/${branchId}/`
        );
        const data = await response.json();
        console.log("Branches API Response:", data);

        if (data.message === "success") {
          const formattedBranches = data.data.map((branch) => ({
            value: branch.library_branch_id,
            label: branch.library_branch_name,
          }));
          setBranches(formattedBranches);
        } else {
          console.error("Failed to fetch branches");
        }
      } catch (error) {
        console.error("Error fetching branch list:", error);
      }
    };

    fetchBranches();
  }, []);


  const handleBranchChange = (selectedOption) => {
    const branchValue = selectedOption ? selectedOption.value : "";
    setBranch(branchValue); // Update selected branch ID
    console.log("Selected Branch:", selectedOption);
    console.log("Branch Value set to:", branchValue);
  };

  const handleLocationChange = (selectedOption) => {
    const locationValue = selectedOption ? selectedOption.value : "";
    setLocation(locationValue); // Save the location ID (value)
    console.log("Selected Location:", selectedOption);
    console.log("Location Value set to:", locationValue);
  };

  const bookJournalOptions = [
    { value: "book", label: "Book" },
    { value: "journal", label: "Journal" },
  ];

  const handleOptionChange = (selectedOption) => {
    setTypeofBooks(selectedOption ? selectedOption.value : "");
  };


  // const handleEdit = async (bookId) => {
  //   try {
  //     const response = await fetch(
  //       `${ApiUrl.apiurl}LIBRARYBOOK/GetBookDetailsBasedOnBookId/${bookId}/`
  //     );
  //     const result = await response.json();

  //     if (response.ok && result.message === "success") {
  //       // Store the entire response data in the updatedData state
  //       setUpdatedData(result.data); // Update state

  //       // Redirect to "/admin/adm-update-book-create" with the data as state
  //       navigate("/admbookMaster", { state: result.data });
  //     } else {
  //       console.error("Failed to fetch book details: " + result.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching book details:", error);
  //   }
  // };



  const handleEdit = async (bookId) => {
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}LIBRARYBOOK/GetBookDetailsBasedOnBookId/${bookId}/`
      );
      const result = await response.json();
      if (response.ok && result.message === "success") {
        console.log("API Response Data:", result.data); // Log API response data
        // Redirect to "/BookForm" with the response data as state
        navigate("/admbookMaster", { state: { data: result.data } });
      } else {
        console.error("Failed to fetch book details: " + result.message);
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };


  // const handleSearch = async () => {
  //   const academicYearId = localStorage.getItem("academicSessionId");

  //   if (!academicYearId) {
  //     console.error("Academic Year ID is not available");
  //     setError("Academic Year ID is missing");
  //     return;
  //   }

  //   const apiUrl = `${
  //     ApiUrl.apiurl
  //   }/LIBRARYBOOK/GetBooksearchList/?academic_year_id=${academicYearId}${
  //     bookCode ? `&book_code=${bookCode}` : ""
  //   }${bookAccessionNo ? `&book_accession_no=${bookAccessionNo}` : ""}${
  //     bookName ? `&book_name=${bookName}` : ""
  //   }${author ? `&author=${author}` : ""}${
  //     bookCategory ? `&book_category=${bookCategory}` : ""
  //   }${bookSubCategory ? `&book_sub_category=${bookSubCategory}` : ""}${
  //     branch ? `&branch=${branch}` : ""
  //   }${location ? `&location=${location}` : ""}${isbn ? `&ISBN=${isbn}` : ""}${
  //     typeofBooks ? `&typeofbooks=${typeofBooks}` : ""
  //   }`;

  //   try {
  //     const response = await fetch(apiUrl);
  //     const result = await response.json();

  //     if (response.ok && result.message === "success") {
  //       setTableData(result.data); // Set the response data to the table data
  //       setShowTable(true); // Show the table if data is received
  //       setError(""); // Clear any previous errors
  //     } else {
  //       setError("Failed to fetch data: " + result.message);
  //       setTableData([]); // Clear table data on failure
  //       setShowTable(false); // Hide the table on failure
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setError("Error fetching data: " + error.message);
  //     setTableData([]); // Clear table data on error
  //     setShowTable(false); // Hide table on error
  //   }
  // };
  const handleSearch = async () => {
    const academicYearId = localStorage.getItem("academicSessionId");

    if (!academicYearId) {
      console.error("Academic Year ID is not available");
      setError("Academic Year ID is missing");
      return;
    }

    // Log all filter values
    console.log("=== SEARCH FILTERS ===");
    console.log("Branch:", branch, "Location:", location);
    console.log("=====================");

    const apiUrl = `${ApiUrl.apiurl
      }LIBRARYBOOK/GetBooksearchList/?academic_year_id=${academicYearId}${bookCode ? `&book_code=${bookCode}` : ""
      }${bookAccessionNo ? `&book_accession_no=${bookAccessionNo}` : ""}${bookName ? `&book_name=${bookName}` : ""
      }${author ? `&author=${author}` : ""}${bookCategory ? `&book_category=${bookCategory}` : ""
      }${bookSubCategory ? `&book_sub_category=${bookSubCategory}` : ""}${isbn ? `&ISBN=${isbn}` : ""}${typeofBooks ? `&typeofbooks=${typeofBooks}` : ""
      }`;

    console.log("API URL:", apiUrl);

    try {
      setCurrentPage(0); // Reset to first page when searching
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (response.ok && result.message === "success" && result.data.length > 0) {
        let filteredData = result.data;

        // Frontend Filtering for Branch
        if (branch) {
          filteredData = filteredData.filter(
            (item) => item.library_branch_id === parseInt(branch)
          );
        }

        // Frontend Filtering for Location
        if (location) {
          filteredData = filteredData.filter(
            (item) => item.locationId === parseInt(location)
          );
        }

        setTableData(filteredData); // Set filtered data
        setShowTable(true); // Show table
        setError(""); // Clear any previous errors
        console.log("Search successful, found", filteredData.length, "results after filtering");
      } else {
        setTableData([]); // Clear table data
        setShowTable(true); // Keep table container visible
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data: " + error.message);
      setTableData([]); // Clear table data on error
      setShowTable(false); // Hide table on error
    }
  };



  const pageCount = Math.ceil(tableData.length / itemsPerPage);

  // Slice data for current page
  const offset = currentPage * itemsPerPage;
  const currentData = tableData.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };


  useEffect(() => {
    console.log("Author state:", author);
  }, [author]);
  const handleNew = () => {
    navigate("/admbookMaster");
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
                BOOK SEARCH
              </p>
              <div className="row mb-2 mt-3 mx-0">
                <div className="col-12 p-2 d-flex flex-wrap gap-2">
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
                    onClick={handleSearch}
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
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box" style={{ backgroundColor: "white" }}>
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="book-code" className="form-label">
                          Book Code
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="book-code"
                            className="form-control detail"
                            placeholder="Enter book code"
                            ref={studentNameRef}
                            value={bookCode}
                            onChange={(e) => setBookCode(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-3 mb-0">
                        <label
                          htmlFor="book-accession-no"
                          className="form-label"
                        >
                          Book Accession No
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="book-accession-no"
                            className="form-control detail"
                            placeholder="Enter book accession no"
                            ref={studentNameRef}
                            value={bookAccessionNo}
                            onChange={(e) => setBookAccessionNo(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-3 mb-0">
                        <label htmlFor="book-title" className="form-label">
                          Book Title
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="book-title"
                            className="form-control detail"
                            placeholder="Enter book title"
                            ref={studentNameRef}
                            value={bookName}
                            onChange={(e) => setBookName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-3 mb-0">
                        <label htmlFor="book-author" className="form-label">
                          Book Author
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="book-author"
                            className="form-control detail"
                            placeholder="Enter book author"
                            ref={studentNameRef}
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="category" className="form-label">
                          Category
                        </label>
                        <Select
                          id="category"
                          className="detail"
                          options={categoryOptions} // Options for category dropdown
                          onChange={handleCategoryChange} // Handle category selection
                          placeholder="Select Category"
                          classNamePrefix="react-select-category"
                          value={
                            bookCategory
                              ? categoryOptions.find(
                                (option) => option.value === bookCategory
                              )
                              : null
                          }
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-0">
                        <label htmlFor="sub-category" className="form-label">
                          Sub Category
                        </label>
                        <Select
                          id="sub-category"
                          className="detail"
                          options={subCategoryOptions} // Options for sub-category dropdown
                          onChange={handleSubCategoryChange} // Handle sub-category selection
                          placeholder={
                            subCategoryOptions.length
                              ? " Sub Category"
                              : "Not Available"
                          }
                          classNamePrefix="react-select-sub-category"
                          value={
                            bookSubCategory
                              ? subCategoryOptions.find(
                                (option) => option.value === bookSubCategory
                              )
                              : null
                          }
                          isDisabled={!subCategoryOptions.length} // Disable if no sub-categories
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="location" className="form-label">
                          Location
                        </label>
                        <Select
                          id="location"
                          className="detail"
                          options={locations}
                          onChange={handleLocationChange}
                          placeholder="Select location"
                          isClearable
                          classNamePrefix="react-select"
                          value={
                            location
                              ? locations.find(
                                (option) => option.value === location
                              ) // Find the selected option by ID
                              : null
                          }
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="branch" className="form-label">
                          Branch
                        </label>
                        <Select
                          id="branch"
                          className="detail"
                          options={branches} // Dropdown options (id mapped to value, name to label)
                          value={
                            branch
                              ? branches.find(
                                (option) => option.value === branch
                              )
                              : null
                          } // Match selected branch ID to options
                          onChange={handleBranchChange} // Handle branch selection
                          placeholder="Select Branch"
                          classNamePrefix="react-select-branch"
                          isClearable // Allow clearing the selection
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="isbn-no" className="form-label">
                          ISBN No
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="isbn-no"
                            className="form-control detail"
                            placeholder="Enter ISBN No"
                            value={isbn}
                            onChange={(e) => setIsbn(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="branch" className="form-label">
                          Book/Journal
                        </label>
                        <Select
                          id="book-journal"
                          className="detail"
                          options={bookJournalOptions}
                          value={
                            typeofBooks
                              ? bookJournalOptions.find(
                                (option) => option.value === typeofBooks
                              )
                              : null
                          }
                          onChange={handleOptionChange}
                          placeholder="Select Book/Journal"
                          classNamePrefix="react-select-book-journal"
                          isClearable
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                {/* <div className="table-responsive">
                    {showTable && (
                      <table className="table table-bordered mt-3">
                        <thead>
                          <tr>
                            <th>Book Code</th>
                            <th>Book Accession No</th>
                            <th>Book Name</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Sub Category</th>
                            <th>Branch</th>
                            <th>Location</th>
                            <th>ISBN</th>
                            <th>Type of Book</th>
                            <th>Publisher</th>
                            <th>publish year</th>
                            <th>Edit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((book, index) => (
                            <tr key={index}>
                              <td>{book.book_code}</td>
                              <td>{book.book_accession_no}</td>
                              <td>{book.book_name}</td>
                              <td>{book.author}</td>
                              <td>{book.book_category}</td>
                              <td>{book.book_sub_category}</td>
                              <td>{book.library_branch}</td>
                              <td>{book.location}</td>
                              <td>{book.ISBN}</td>
                              <td>{book.type}</td>
                              <td>{book.publisher}</td>
                              <td>{book.publish_year}</td>
                              <td></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div> */}
                {/* 
                  <div className="table-responsive">
                    {showTable && (
                      <table className="table table-bordered mt-3">
                        <thead>
                          <tr>
                            <th>Sr No</th> 
                            <th>Book Code</th>
                            <th>Book Accession No</th>
                            <th>Book Title</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Sub Category</th>
                            <th>Branch</th>
                            <th>Location</th>
                            <th>ISBN</th>
                            <th>Type of Book</th>
                            <th>Publisher</th>
                            <th>Publish Year</th>
                            <th>Edit</th> 
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((book, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td> 
                              <td>{book.book_code}</td>
                              <td>{book.bookBarcode}</td>
                              <td>{book.book_name}</td>
                              <td>{book.author}</td>
                              <td>{book.book_category}</td>
                              <td>{book.book_sub_category}</td>
                              <td>{book.library_branch}</td>
                              <td>{book.locationName}</td>
                              <td>{book.ISBN}</td>
                              <td>{book.type}</td>
                              <td>{book.publisher}</td>
                              <td>{book.publish_year}</td>
                              <td>
                               
                                <a
                                  href="#"
                                  className="text-primary"
                                  onClick={() => handleEdit(book.id)} // Call handleEdit with book id
                                >
                                  Edit
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div> */}

                <div className="table-responsive">
                  {showTable && (
                    <>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Sr No</th>
                            <th>Book Code</th>
                            <th>Book Accession No</th>
                            <th>Book Title</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Sub Category</th>
                            <th>Branch</th>
                            <th>Location</th>
                            <th>ISBN</th>
                            <th>Type of Book</th>
                            <th>Publisher</th>
                            <th>Publish Year</th>
                            <th>Edit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.length > 0 ? (
                            currentData.map((book, index) => (
                              <tr key={index}>
                                <td>{offset + index + 1}</td>
                                <td>{book.book_code}</td>
                                <td>{book.bookBarcode}</td>
                                <td>{book.book_name}</td>
                                <td>{book.author}</td>
                                <td>{book.book_category}</td>
                                <td>{book.book_sub_category}</td>
                                <td>{book.library_branch}</td>
                                <td>{book.locationName}</td>
                                <td>{book.ISBN}</td>
                                <td>{book.type}</td>
                                <td>{book.publisher}</td>
                                <td>{book.publish_year}</td>
                                <td>
                                  <a
                                    href="#"
                                    className="text-primary"
                                    onClick={() => handleEdit(book.id)}
                                  >
                                    Edit
                                  </a>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="14"
                                className="text-center text-danger"
                              >
                                No data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      {/* Pagination Component */}
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmBookSearch;