// import React, { useRef, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Select from "react-select"; // Importing React Select
// import SelectStudentModal from "../AdminAttendanceEntry/SelectStudentModal";
// import  useCourses from "../../hooks/useFetchClasses";

// const AdmBook = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBook, setSelectedBook] = useState(null); // State to track selected book
//   const {
//     classes,
//     loading: classLoading,
//     error: classError,
//   } =  useCourses();

//   const dateRef = useRef(null);
//   const bookNameRef = useRef(null);
//   const bookCodeRef = useRef(null);
//   const subCategoryRef = useRef(null);
//   const bookAccessionNoRef = useRef(null);

//   // Define the options for the category and sub-category dropdowns
//   const categoryOptions = [
//     { value: "Fiction", label: "Fiction" },
//     { value: "Non-Fiction", label: "Non-Fiction" },
//     // Add more options as needed
//   ];

//   const statusOptions = [
//     { value: "Science", label: "Science" },
//     { value: "Math", label: "Math" },
//     { value: "Literature", label: "Literature" },
//     // Add more options as needed
//   ];

//   // Sample data for the table, replace with your actual data
//   const bookData = [
//     {
//       id: 1,
//       code: "B001",
//       name: "Book One",
//       barcode: "123456",
//       category: "Fiction",
//       subcategory: "Science",
//     },
//     {
//       id: 2,
//       code: "B002",
//       name: "Book Two",
//       barcode: "654321",
//       category: "Non-Fiction",
//       subcategory: "Math",
//     },
//     // Add more rows as needed
//   ];

//   const handleClear = () => {
//     if (dateRef.current) dateRef.current.value = "";
//     if (bookNameRef.current) bookNameRef.current.value = "";
//     if (bookCodeRef.current) bookCodeRef.current.value = "";
//     if (subCategoryRef.current) subCategoryRef.current.value = "";
//     if (bookAccessionNoRef.current) bookAccessionNoRef.current.value = "";
//   };

//   const handleOpenModal = () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   const handleSelectBook = (id) => {
//     setSelectedBook(id); // Update selected book
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12">

//           <div className="card">
//             <div className="card-body">
//               <p className="text-center fw-bold" style={{ fontSize: "20px" }}>
//                 BOOK SEARCH
//               </p>

//               {/* Button Group */}
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
//                     onClick={handleClear}
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

//               {/* Form Fields */}
//               <div className="row">
//                 <div className="col-12" style={{ border: "1px solid #ccc" }}>
//                   <div className="row">
//                     <div className="col-12 col-md-3 mb-1">
//                       <label htmlFor="book-name" className="form-label">
//                         Book Name
//                       </label>
//                       <input
//                         type="text"
//                         id="book-name"
//                         className="form-control"
//                         placeholder="Enter book name"
//                         ref={bookNameRef}
//                       />
//                     </div>

//                     <SelectStudentModal
//                       show={showModal}
//                       handleClose={handleCloseModal}
//                     />

//                     <div className="col-12 col-md-3 mb-2">
//                       <label htmlFor="book-code" className="form-label">
//                         Book Code
//                       </label>
//                       <input
//                         type="text"
//                         id="book-code"
//                         className="form-control"
//                         placeholder="Enter Book Code"
//                         ref={bookCodeRef}
//                       />
//                     </div>

//                     {/* Replace Category Select with React Select */}
//                     <div className="col-12 col-md-3 mb-2">
//                       <label htmlFor="category" className="form-label">
//                         Category
//                       </label>
//                       <Select
//                         id="category"
//                         options={categoryOptions}
//                         placeholder="Select Category"
//                         isClearable
//                         classNamePrefix="react-select"
//                         onChange={(selectedOption) => {
//                           console.log("Selected Category: ", selectedOption);
//                         }}
//                       />
//                     </div>

//                     <div className="col-12 col-md-3 mb-2">
//                       <label htmlFor="sub-category" className="form-label">
//                         Sub Category
//                       </label>
//                       <Select
//                         id="sub-category"
//                         options={statusOptions}
//                         placeholder="Select Sub Category"
//                         isClearable
//                         classNamePrefix="react-select"
//                         onChange={(selectedOption) => {
//                           console.log(
//                             "Selected Sub Category: ",
//                             selectedOption
//                           );
//                         }}
//                       />
//                     </div>

//                     <div className="col-12 col-md-3 mb-2">
//                       <label htmlFor="book-accession-no" className="form-label">
//                         Book Accession No
//                       </label>
//                       <input
//                         type="text"
//                         id="book-accession-no"
//                         className="form-control"
//                         placeholder="Enter Book Accession No"
//                         ref={bookAccessionNoRef}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Table */}
//               <div className="row">
//                 <div className="col-12">
//                   <div className="table-responsive">
//                     <table className="table table-bordered table-hover">
//                       <thead>
//                         <tr>
//                           <th>Sr No</th>
//                           <th>Book Code</th>
//                           <th>Book Name</th>
//                           <th>BarCode</th>
//                           <th>Category</th>
//                           <th>Sub-category</th>
//                           <th>Select</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {bookData.map((book, index) => (
//                           <tr key={book.id}>
//                             <td>{index + 1}</td>
//                             <td>{book.code}</td>
//                             <td>{book.name}</td>
//                             <td>{book.barcode}</td>
//                             <td>{book.category}</td>
//                             <td>{book.subcategory}</td>
//                             <td>
//                               <input
//                                 type="radio"
//                                 name="bookSelect"
//                                 checked={selectedBook === book.id}
//                                 onChange={() => handleSelectBook(book.id)}
//                               />
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
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

// export default AdmBook;


// import React, { useRef, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Select from "react-select"; // Importing React Select
// import SelectStudentModal from "../AdminAttendanceEntry/SelectStudentModal";
// import  useCourses from "../../hooks/useFetchClasses";

// const AdmBook = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBook, setSelectedBook] = useState(null); // State to track selected book
//   const {
//     classes,
//     loading: classLoading,
//     error: classError,
//   } =  useCourses();

//   const dateRef = useRef(null);
//   const bookNameRef = useRef(null);
//   const bookCodeRef = useRef(null);
//   const subCategoryRef = useRef(null);
//   const bookAccessionNoRef = useRef(null);

//   // Define the options for the category and sub-category dropdowns
//   const categoryOptions = [
//     { value: "Fiction", label: "Fiction" },
//     { value: "Non-Fiction", label: "Non-Fiction" },
//     // Add more options as needed
//   ];

//   const statusOptions = [
//     { value: "Science", label: "Science" },
//     { value: "Math", label: "Math" },
//     { value: "Literature", label: "Literature" },
//     // Add more options as needed
//   ];

//   // Sample data for the table, replace with your actual data
//   const bookData = [
//     {
//       id: 1,
//       code: "B001",
//       name: "Book One",
//       barcode: "123456",
//       category: "Fiction",
//       subcategory: "Science",
//     },
//     {
//       id: 2,
//       code: "B002",
//       name: "Book Two",
//       barcode: "654321",
//       category: "Non-Fiction",
//       subcategory: "Math",
//     },
//     // Add more rows as needed
//   ];

//   const handleClear = () => {
//     if (dateRef.current) dateRef.current.value = "";
//     if (bookNameRef.current) bookNameRef.current.value = "";
//     if (bookCodeRef.current) bookCodeRef.current.value = "";
//     if (subCategoryRef.current) subCategoryRef.current.value = "";
//     if (bookAccessionNoRef.current) bookAccessionNoRef.current.value = "";
//   };

//   const handleOpenModal = () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   const handleSelectBook = (id) => {
//     setSelectedBook(id); // Update selected book
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12">

//           <div className="card">
//             <div className="card-body">
//               <p className="text-center fw-bold" style={{ fontSize: "20px" }}>
//                 BOOK SEARCH
//               </p>

//               {/* Button Group */}
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
//                     onClick={handleClear}
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

//               {/* Form Fields */}
//               <div className="row">
//                 <div className="col-12" style={{ border: "1px solid #ccc" }}>
//                   <div className="row">
//                     <div className="col-12 col-md-3 mb-1">
//                       <label htmlFor="book-name" className="form-label">
//                         Book Name
//                       </label>
//                       <input
//                         type="text"
//                         id="book-name"
//                         className="form-control"
//                         placeholder="Enter book name"
//                         ref={bookNameRef}
//                       />
//                     </div>

//                     <SelectStudentModal
//                       show={showModal}
//                       handleClose={handleCloseModal}
//                     />

//                     <div className="col-12 col-md-3 mb-2">
//                       <label htmlFor="book-code" className="form-label">
//                         Book Code
//                       </label>
//                       <input
//                         type="text"
//                         id="book-code"
//                         className="form-control"
//                         placeholder="Enter Book Code"
//                         ref={bookCodeRef}
//                       />
//                     </div>

//                     {/* Replace Category Select with React Select */}
//                     <div className="col-12 col-md-3 mb-2">
//                       <label htmlFor="category" className="form-label">
//                         Category
//                       </label>
//                       <Select
//                         id="category"
//                         options={categoryOptions}
//                         placeholder="Select Category"
//                         isClearable
//                         classNamePrefix="react-select"
//                         onChange={(selectedOption) => {
//                           console.log("Selected Category: ", selectedOption);
//                         }}
//                       />
//                     </div>

//                     <div className="col-12 col-md-3 mb-2">
//                       <label htmlFor="sub-category" className="form-label">
//                         Sub Category
//                       </label>
//                       <Select
//                         id="sub-category"
//                         options={statusOptions}
//                         placeholder="Select Sub Category"
//                         isClearable
//                         classNamePrefix="react-select"
//                         onChange={(selectedOption) => {
//                           console.log(
//                             "Selected Sub Category: ",
//                             selectedOption
//                           );
//                         }}
//                       />
//                     </div>

//                     <div className="col-12 col-md-3 mb-2">
//                       <label htmlFor="book-accession-no" className="form-label">
//                         Book Accession No
//                       </label>
//                       <input
//                         type="text"
//                         id="book-accession-no"
//                         className="form-control"
//                         placeholder="Enter Book Accession No"
//                         ref={bookAccessionNoRef}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Table */}
//               <div className="row">
//                 <div className="col-12">
//                   <div className="table-responsive">
//                     <table className="table table-bordered table-hover">
//                       <thead>
//                         <tr>
//                           <th>Sr No</th>
//                           <th>Book Code</th>
//                           <th>Book Name</th>
//                           <th>BarCode</th>
//                           <th>Category</th>
//                           <th>Sub-category</th>
//                           <th>Select</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {bookData.map((book, index) => (
//                           <tr key={book.id}>
//                             <td>{index + 1}</td>
//                             <td>{book.code}</td>
//                             <td>{book.name}</td>
//                             <td>{book.barcode}</td>
//                             <td>{book.category}</td>
//                             <td>{book.subcategory}</td>
//                             <td>
//                               <input
//                                 type="radio"
//                                 name="bookSelect"
//                                 checked={selectedBook === book.id}
//                                 onChange={() => handleSelectBook(book.id)}
//                               />
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
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

// export default AdmBook;

// import React, { useState, useRef, useEffect } from "react";
// import Select from "react-select";
// import useFetchBookCategories from "../../hooks/useFetchBookCategories";
// import useFetchBookSubCategories from "../../hooks/useFetchBookSubCategories";

// const AdmBook = ({ show, handleClose, selectedRowId, onSelectBook }) => {
//   // Always call hooks at the top
//   const [bookData, setBookData] = useState([]);
//   const { categories } = useFetchBookCategories();
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const { subCategories } = useFetchBookSubCategories(selectedCategory?.value);

//   const [selectedBook, setSelectedBook] = useState(null);

//   // Form field refs
//   const bookNameRef = useRef();
//   const bookCodeRef = useRef();
//   const bookAccessionNoRef = useRef();

//   // Map categories to the format required by React Select
//   const categoryOptions = categories.map((category) => ({
//     value: category.id, // Use id as the value
//     label: category.name, // Use name as the label
//   }));

//   // Format subcategories for React Select
//   const subCategoryOptions = subCategories.map((subCategory) => ({
//     value: subCategory.id,
//     label: subCategory.name,
//   }));

//   const handleSelectBook = (book) => {
//     const bookId = book.id;

//     // Store the selected book ID in local storage
//     localStorage.setItem("selectedBookId", bookId);

//     // Set the selected book state
//     setSelectedBook(book);

//     // Call the callback function to pass the selected book data to the parent component
//     if (onSelectBook) {
//       onSelectBook(book); // Passing selected book object to parent component
//     }

//     // Close the modal after selection
//     handleClose();
//   };

//   useEffect(() => {
//     fetch(`${ApiUrl.apiurl}LIBRARYBOOK/GetAllBooksDetails`)
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.message === "success" && Array.isArray(data.data)) {
//           setBookData(data.data);
//         }
//       })
//       .catch((error) => console.error("Error fetching data:", error));
//   }, []);

//   // Handle search and clear functionalities
//   const handleClear = () => {
//     bookNameRef.current.value = "";
//     bookCodeRef.current.value = "";
//     bookAccessionNoRef.current.value = "";
//   };

//   // Early return to prevent rendering when `show` is false
//   if (!show) return null;

//   return (
//     <div className="modal show" style={{ display: "block" }} role="dialog">
//       <div className="modal-dialog modal-lg" style={{ maxWidth: "80%" }}>
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">BOOK SEARCH</h5>
//             <button
//               type="button"
//               className="btn-close"
//               onClick={handleClose}
//               aria-label="Close"
//             ></button>
//           </div>
//           <div className="modal-body">
//             <div className="container-fluid">
//               <div className="row">
//                 <div className="col-12">
//                   <div className="card">
//                     <div className="card-body">
//                       {/* Button Group */}
//                       <div className="row mb-2">
//                         <div
//                           className="col-12"
//                           style={{ border: "1px solid #ccc" }}
//                         >
//                           <div className="d-flex">
//                             <button
//                               type="button"
//                               className="btn btn-primary me-2"
//                               style={{
//                                 "--bs-btn-padding-y": ".25rem",
//                                 "--bs-btn-padding-x": ".5rem",
//                                 "--bs-btn-font-size": ".75rem",
//                                 width: "150px",
//                               }}
//                             >
//                               Search
//                             </button>
//                             <button
//                               type="button"
//                               className="btn btn-primary me-2"
//                               style={{
//                                 "--bs-btn-padding-y": ".25rem",
//                                 "--bs-btn-padding-x": ".5rem",
//                                 "--bs-btn-font-size": ".75rem",
//                                 width: "150px",
//                               }}
//                               onClick={handleClear}
//                             >
//                               Clear
//                             </button>
//                             <button
//                               type="button"
//                               className="btn btn-primary me-2"
//                               style={{
//                                 "--bs-btn-padding-y": ".25rem",
//                                 "--bs-btn-padding-x": ".5rem",
//                                 "--bs-btn-font-size": ".75rem",
//                                 width: "150px",
//                               }}
//                               onClick={handleClose}
//                             >
//                               Close
//                             </button>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Form Fields */}
//                       <div className="row">
//                         <div
//                           className="col-12"
//                           style={{ border: "1px solid #ccc" }}
//                         >
//                           <div className="row">
//                             <div className="col-12 col-md-3 mb-1">
//                               <label htmlFor="book-name" className="form-label">
//                                 Book Name
//                               </label>
//                               <input
//                                 type="text"
//                                 id="book-name"
//                                 className="form-control"
//                                 placeholder="Enter book name"
//                                 ref={bookNameRef}
//                               />
//                             </div>
//                             <div className="col-12 col-md-3 mb-2">
//                               <label htmlFor="book-code" className="form-label">
//                                 Book Code
//                               </label>
//                               <input
//                                 type="text"
//                                 id="book-code"
//                                 className="form-control"
//                                 placeholder="Enter Book Code"
//                                 ref={bookCodeRef}
//                               />
//                             </div>
//                             <div className="col-12 col-md-3 mb-2">
//                               <label htmlFor="category" className="form-label">
//                                 Category
//                               </label>
//                               <Select
//                                 id="category"
//                                 options={categoryOptions}
//                                 placeholder="Select Category"
//                                 isClearable
//                                 classNamePrefix="react-select"
//                                 onChange={(selectedOption) =>
//                                   setSelectedCategory(selectedOption)
//                                 }
//                               />
//                             </div>
//                             <div className="col-12 col-md-3 mb-2">
//                               <label
//                                 htmlFor="sub-category"
//                                 className="form-label"
//                               >
//                                 Sub Category
//                               </label>
//                               <Select
//                                 id="sub-category"
//                                 options={subCategoryOptions}
//                                 placeholder="Select Sub Category"
//                                 isClearable
//                                 classNamePrefix="react-select"
//                                 isDisabled={!selectedCategory} // Disable if no category is selected
//                               />
//                             </div>
//                             <div className="col-12 col-md-3 mb-2">
//                               <label
//                                 htmlFor="book-accession-no"
//                                 className="form-label"
//                               >
//                                 Book Accession No
//                               </label>
//                               <input
//                                 type="text"
//                                 id="book-accession-no"
//                                 className="form-control"
//                                 placeholder="Enter Book Accession No"
//                                 ref={bookAccessionNoRef}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Table */}
//                       <div className="row">
//                         <div className="col-12">
//                           <div className="table-responsive">
//                             <table className="table table-bordered table-hover">
//                               <thead>
//                                 <tr>
//                                   <th>Sr No</th>
//                                   <th>Book Code</th>
//                                   <th>Book Name</th>
//                                   <th>BarCode</th>
//                                   <th>Category</th>
//                                   <th>Sub-category</th>
//                                   <th>Select</th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {bookData.map((book, index) => {
//                                   const {
//                                     bookCode,
//                                     bookName,
//                                     barcode,
//                                     categoryName,
//                                     subcategoryName,
//                                   } = book;

//                                   return (
//                                     <tr key={book.id}>
//                                       <td>{index + 1}</td>
//                                       <td>{bookCode}</td>
//                                       <td>{bookName}</td>
//                                       <td>{barcode}</td>
//                                       <td>{categoryName}</td>
//                                       <td>{subcategoryName}</td>
//                                       <td>
//                                         <input
//                                           type="radio"
//                                           name="bookSelect"
//                                           checked={selectedBook === book.id}
//                                           onChange={() =>
//                                             handleSelectBook(book)
//                                           }
//                                         />
//                                       </td>
//                                     </tr>
//                                   );
//                                 })}
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
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

// export default AdmBook;

import React, { useState, useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import useFetchBookCategories from "../../hooks/useFetchBookCategories";
import useFetchBookSubCategories from "../../hooks/useFetchBookSubCategories";
import { ApiUrl } from "../../../ApiUrl";

const AdmBook = ({ show, handleClose, selectedRowId, onSelectBook, onlyAvailable = false }) => {
  const [bookData, setBookData] = useState([]);
  const [fullBookData, setFullBookData] = useState([]); // Original data for filtering
  const { categories } = useFetchBookCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { subCategories } = useFetchBookSubCategories(selectedCategory?.value);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const bookNameRef = useRef();
  const bookCodeRef = useRef();
  const bookAccessionNoRef = useRef();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Pagination calculations
  const offset = currentPage * itemsPerPage;
  const currentItems = bookData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(bookData.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Reset to first page when book data changes
  useEffect(() => {
    setCurrentPage(0);
  }, [bookData]);

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const subCategoryOptions = subCategories.map((subCategory) => ({
    value: subCategory.id,
    label: subCategory.name,
  }));

  const handleSelectBook = (book) => {
    const bookId = book.id;
    localStorage.setItem("selectedBookId", bookId);
    setSelectedBook(book);
    console.log("=== Book being passed to parent ===", book);
    if (onSelectBook) {
      // Pass the complete book object with all availability fields
      onSelectBook({
        id: book.id,
        bookCode: book.bookCode,
        bookName: book.bookName,
        barcode: book.barcode,
        categoryId: book.categoryId,
        categoryName: book.categoryName,
        subcategoryId: book.subcategoryId,
        subcategoryName: book.subcategoryName,
        bookBarcodeStatus: book.bookBarcodeStatus,
        availableCopies: book.availableCopies,
        totalCopies: book.totalCopies,
        isAvailable: book.isAvailable,
      });
    }
    handleClose();
  };

  // Fetch book data when modal opens, reset filters when modal closes
  // Singleton Lock to prevent duplicate instances
  const [isPrimaryInstance, setIsPrimaryInstance] = useState(false);

  useEffect(() => {
    // Check if a lock exists
    if (!window.admBookListLock) {
      window.admBookListLock = true;
      setIsPrimaryInstance(true); // We are the primary
    }

    return () => {
      // Cleanup lock only if we were the primary
      // Note: In StrictMode, this might run and clear lock, allowing 2nd mount to take it.
      // But it helps prevent simultaneous permanent instances.
      if (isPrimaryInstance) {
        window.admBookListLock = false; // Release lock
      }
      // Safety fallback: always clear on unmount if we think we held it
      window.admBookListLock = false;
    };
  }, []);

  // Fetch book data when modal opens, reset filters when modal closes
  useEffect(() => {
    if (show) {
      // Modal opened - fetch fresh data and reset filters
      // Use onlyAvailable prop to determine whether to show only available books or all books
      fetch(`${ApiUrl.apiurl}LIBRARYBOOK/GetAllBooksDetails?onlyAvailable=${onlyAvailable}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("=== API Response in AdmBook ===", data);
          if (data.message === "success" && Array.isArray(data.data)) {
            console.log("First book object:", data.data[0]);
            setBookData(data.data);
            setFullBookData(data.data);
          }
        })
        .catch((error) => console.error("Error fetching data:", error));

      // Reset filter states when modal opens
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setSelectedBook(null);

      // Clear refs (need to do this after render, so use timeout)
      setTimeout(() => {
        if (bookNameRef.current) bookNameRef.current.value = "";
        if (bookCodeRef.current) bookCodeRef.current.value = "";
        if (bookAccessionNoRef.current) bookAccessionNoRef.current.value = "";
      }, 0);
    }
  }, [show]);

  // Search/Filter function
  const handleSearch = () => {
    const bookName = bookNameRef.current?.value?.toLowerCase() || "";
    const bookCode = bookCodeRef.current?.value?.toLowerCase() || "";
    const bookAccessionNo = bookAccessionNoRef.current?.value || "";
    const categoryId = selectedCategory?.value;
    const subCategoryId = selectedSubCategory?.value;

    const filteredData = fullBookData.filter((book) => {
      // Filter by book name
      const nameMatch = !bookName ||
        book.bookName?.toLowerCase().includes(bookName);

      // Filter by book code
      const codeMatch = !bookCode ||
        book.bookCode?.toString().toLowerCase().includes(bookCode);

      // Filter by barcode/accession no
      const barcodeMatch = !bookAccessionNo ||
        book.barcode?.toString().includes(bookAccessionNo);

      // Filter by category
      const categoryMatch = !categoryId ||
        book.categoryId === categoryId ||
        book.category_id === categoryId ||
        book.categoryName?.toLowerCase() === selectedCategory?.label?.toLowerCase();

      // Filter by sub-category
      const subCategoryMatch = !subCategoryId ||
        book.subcategoryId === subCategoryId ||
        book.subcategory_id === subCategoryId ||
        book.subcategoryName?.toLowerCase() === selectedSubCategory?.label?.toLowerCase();

      return nameMatch && codeMatch && barcodeMatch && categoryMatch && subCategoryMatch;
    });

    setBookData(filteredData);
  };

  const handleClear = () => {
    // Clear input fields
    if (bookNameRef.current) bookNameRef.current.value = "";
    if (bookCodeRef.current) bookCodeRef.current.value = "";
    if (bookAccessionNoRef.current) bookAccessionNoRef.current.value = "";

    // Clear dropdown selections
    setSelectedCategory(null);
    setSelectedSubCategory(null);

    // Reset to full data
    setBookData(fullBookData);
  };


  //  Prevent modal from rendering twice
  //  Prevent modal from rendering twice check removed - let Modal handle it
  // if (!show) return null;

  // Singleton Pattern enforcement
  // if (!isPrimaryInstance) return null; // Using this might cause initial flash issues or strict mode issues

  // Alternative: Just render. The lock is experimental. 
  // Let's rely on standard conditional rendering for now if this lock makes it disappear completely.
  // But user complained about TWO.

  // Lets use the lock.
  if (!isPrimaryInstance) return null;

  return (
    <Modal
      show={show}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop={false}
      style={{ background: 'transparent' }}
    >
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title>BOOK SEARCH</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card p-0">
                <div className="card-body">
                  <div className="row mb-2 mt-3">
                    <div className="col-12">
                      <button
                        type="button"
                        className="btn btn-primary me-2"
                        style={{ width: "150px" }}
                        onClick={handleSearch}
                      >
                        Search
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
                    </div>
                  </div>

                  {/* Filter Fields */}
                  <div className="row mt-3 mx-2">
                    <div className="col-12" style={{ border: "1px solid #ccc", padding: "10px", backgroundColor: "white" }}>
                      <div className="row mt-3 mb-3">
                        <div className="col-12 col-md-3 mb-2">
                          <label htmlFor="book-name" className="form-label">
                            Book Name
                          </label>
                          <input
                            type="text"
                            id="book-name"
                            className="form-control detail"
                            placeholder="Enter book name"
                            ref={bookNameRef}
                          />
                        </div>
                        <div className="col-12 col-md-3 mb-2">
                          <label htmlFor="book-code" className="form-label">
                            Book Code
                          </label>
                          <input
                            type="text"
                            id="book-code"
                            className="form-control detail"
                            placeholder="Enter Book Code"
                            ref={bookCodeRef}
                          />
                        </div>
                        <div className="col-12 col-md-3 mb-2">
                          <label htmlFor="category" className="form-label">
                            Category
                          </label>
                          <Select
                            id="category"
                            options={categoryOptions}
                            className="detail"
                            placeholder="Select Category"
                            isClearable
                            classNamePrefix="react-select"
                            value={selectedCategory}
                            onChange={(selectedOption) =>
                              setSelectedCategory(selectedOption)
                            }
                          />
                        </div>
                        <div className="col-12 col-md-3 mb-2">
                          <label htmlFor="sub-category" className="form-label">
                            Sub Category
                          </label>
                          <Select
                            id="sub-category"
                            className="detail"
                            options={subCategoryOptions}
                            placeholder="Select Sub Category"
                            isClearable
                            classNamePrefix="react-select"
                            isDisabled={!selectedCategory}
                            value={selectedSubCategory}
                            onChange={(selectedOption) =>
                              setSelectedSubCategory(selectedOption)
                            }
                          />
                        </div>
                        <div className="col-12 col-md-3 mb-2">
                          <label htmlFor="book-accession-no" className="form-label">
                            Book Accession No
                          </label>
                          <input
                            type="text"
                            id="book-accession-no"
                            className="form-control detail"
                            placeholder="Enter Book Accession No"
                            ref={bookAccessionNoRef}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Books Table */}
                  <div className="table-responsive mt-3">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>Sr No</th>
                          <th>Book Code</th>
                          <th>Book Name</th>
                          <th>BarCode</th>
                          <th>Category</th>
                          <th>Sub-category</th>
                          <th>Select</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookData.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center">
                              No books found
                            </td>
                          </tr>
                        ) : (
                          currentItems.map((book, index) => (
                            <tr key={book.id}>
                              <td>{offset + index + 1}</td>
                              <td>{book.bookCode}</td>
                              <td>{book.bookName}</td>
                              <td>{book.barcode}</td>
                              <td>{book.categoryName}</td>
                              <td>{book.subcategoryName}</td>
                              <td>
                                <input
                                  type="radio"
                                  name="bookSelect"
                                  checked={selectedBook?.id === book.id}
                                  onChange={() => handleSelectBook(book)}
                                />
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Component */}
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
                        forcePage={currentPage}
                      />
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

export default AdmBook;






