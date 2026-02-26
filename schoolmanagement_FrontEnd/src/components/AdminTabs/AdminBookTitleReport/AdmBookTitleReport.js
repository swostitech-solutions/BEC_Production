import React, { useRef, useState,useEffect } from "react";
import useFetchBookCategories from "../../hooks/useFetchBookCategories";
import useFetchBookSubCategories from "../../hooks/useFetchBookSubCategories";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";

import jsPDF from "jspdf"; // Import jsPDF for PDF export
import * as XLSX from "xlsx";
import "jspdf-autotable";
import { ApiUrl } from "../../../ApiUrl";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";


const AdmBookTitleReport = () => {
   const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
   const { categories } = useFetchBookCategories();
   const [selectedCategory, setSelectedCategory] = useState(null);
   const { subCategories } = useFetchBookSubCategories(selectedCategory?.value);
   const [selectedSubCategory, setSelectedSubCategory] = useState(null);
     const [tableData, setTableData] = useState([]);
      const [bookTitle, setBookTitle] = useState("");
      const [bookAuthor, setBookAuthor] = useState("");
      const [currentPage, setCurrentPage] = useState(0);
      const itemsPerPage = 10;

  const pageCount = Math.ceil(tableData.length / itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = tableData.slice(offset, offset + itemsPerPage);
     useEffect(() => {
       fetchBookTitleReport(); // Load table data when page opens
     }, []);

     const fetchBookTitleReport = async (search = false) => {
       const academicYearId = localStorage.getItem("academicSessionId") || "";
       const orgId = localStorage.getItem("branchId") || "";
       const branchId = localStorage.getItem("orgId") || "";

       let apiUrl =  `${ApiUrl.apiurl}LIBRARYBOOK/GetAllBookTitleReport?academic_year_id=${academicYearId}&org_id=${orgId}&branch_id=${branchId}`;

       if (search) {
         if (bookTitle) apiUrl += `&book_name=${bookTitle}`;
         if (bookAuthor) apiUrl += `&book_author=${bookAuthor}`;
         if (selectedBranch) apiUrl += `&library_branch_id=${selectedBranch.value}`;
         if (selectedCategory)
           apiUrl += `&categoryId=${selectedCategory.value}`;
         if (selectedSubCategory)
           apiUrl += `&subcategoryId=${selectedSubCategory.value}`;
       }

       try {
         const response = await fetch(apiUrl);
         const result = await response.json();

         if (response.ok && result.message === "success") {
           setTableData(result.data);
           setCurrentPage(0);
         } else {
           setTableData([]);
            setCurrentPage(0);
         }
       } catch (error) {
         console.error("Error fetching book title report:", error);
         setTableData([]);
          setCurrentPage(0);
       }
     };


  const exportToExcel = () => {
       if (!tableData || tableData.length === 0) {
    alert("No data available to export!");
    return;
  }
    const ws = XLSX.utils.json_to_sheet(
      tableData.map((book, index) => ({
        "Sl.No": index + 1,
        "Book Name": book.book_name,
        "Author Name": book.author_name,
        Category: book.categoryName,
        "Sub Category": book.subcategory_name,
        "Accession No": book.barcodeList.join(", "),
        "No. of Copies": book.no_of_book_copies,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Books Data");
    XLSX.writeFile(wb, "books_data.xlsx");
  };



    const exportToPDF = () => {

           if (!tableData || tableData.length === 0) {
             alert("No data available to export!");
             return;
           }

      const doc = new jsPDF();
      const columns = [
        "Sl.No",
        "Book Name",
        "Author Name",
        "Category",
        "Sub Category",
        "Accession No",
        "No. of Copies",
      ];

      const rows = tableData.map((book, index) => [
        index + 1, // Sl.No
        book.book_name,
        book.author_name,
        book.categoryName,
        book.subcategory_name,
        book.barcodeList.join(", "),
        book.no_of_book_copies,
      ]);

      // Use autoTable to add table to PDF
      doc.autoTable({
        head: [columns], // Table header
        body: rows, // Table data
        startY: 20, // Start the table below the title
        theme: "grid", // Grid style for borders
        margin: { top: 10 }, // Adjust margins
        styles: {
          cellPadding: 2, // Cell padding
          fontSize: 10, // Font size
          overflow: "linebreak", // Handle overflow text
        },
      });

      // Save the PDF
      doc.save("books_data.pdf");
    };

  useEffect(() => {
    const orgId = localStorage.getItem("branchId");
    const branchId = localStorage.getItem("orgId");

    if (!orgId || !branchId) {
      console.error("Missing orgId or branchId in local storage");
      return;
    }

    const fetchBranches = async () => {
      try {
        const response = await fetch(
           `${ApiUrl.apiurl}LIBRARYBRANCH/GetLibraryBranchList/${orgId}/${branchId}/`
        );
        const data = await response.json();

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

  const handleClear = () => {
    setBookTitle("");
    setBookAuthor("");
    setSelectedBranch(null);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setTableData([]); // Clear the table data
  };
  return (
    <div className="container-fluid ">
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
                BOOK TITLE REPORT
              </p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={() => fetchBookTitleReport(true)}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={exportToPDF}
                  >
                    Export to PDF
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={exportToExcel}
                  >
                    Export to Excel
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
                    style={{ width: "150px" }}
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="book-title" className="form-label">
                          Book Title
                        </label>
                        <input
                          type="text"
                          id="book-title"
                          className="form-control detail"
                          placeholder="Enter book title"
                          value={bookTitle}
                          onChange={(e) => setBookTitle(e.target.value)}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="book-author" className="form-label">
                          {" "}
                          Book Author{" "}
                        </label>
                        <input
                          type="text"
                          id="book-author"
                          className="form-control detail"
                          placeholder="Enter author"
                          value={bookAuthor}
                          onChange={(e) => setBookAuthor(e.target.value)}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-2">
                        <label htmlFor="Branch" className="form-label">
                          {" "}
                          Branch{" "}
                        </label>
                        <Select
                          id="branch"
                          className="detail"
                          classNamePrefix="branch-select"
                          options={branches}
                          value={selectedBranch}
                          onChange={setSelectedBranch}
                          placeholder="Select Branch"
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="category" className="form-label">
                          Category
                        </label>
                        <Select
                          id="category"
                          className="detail"
                          classNamePrefix="category-select"
                          options={categories.map((cat) => ({
                            value: cat.id,
                            label: cat.name,
                          }))}
                          value={selectedCategory}
                          onChange={(selectedOption) => {
                            setSelectedCategory(selectedOption);
                            setSelectedSubCategory(null); // Reset subcategory when category changes
                          }}
                          placeholder="Select Category"
                          isClearable
                        />
                      </div>

                      {/* Sub-Category Dropdown */}
                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="sub-category" className="form-label">
                          Sub-Category
                        </label>
                        <Select
                          id="sub-category"
                          className="detail"
                          classNamePrefix="subcategory-select"
                          options={subCategories.map((subCat) => ({
                            value: subCat.id,
                            label: subCat.name,
                          }))}
                          value={selectedSubCategory}
                          onChange={setSelectedSubCategory}
                          placeholder="Select Sub-Category"
                          isDisabled={!selectedCategory} // Disable if no category is selected
                          isClearable
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sl.No</th>
                        <th>Book Name</th>
                        <th>Author Name</th>
                        <th>Category</th>
                        <th>Sub Category</th>
                        <th>Accession No</th>
                        <th>No. of Copies</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((book, index) => (
                          <tr key={book.id}>
                            <td>{offset + index + 1}</td>
                            <td>{book.book_name}</td>
                            <td>{book.author_name}</td>
                            <td>{book.categoryName}</td>
                            <td>{book.subcategory_name}</td>
                            <td>{book.barcodeList.join(", ")}</td>
                            <td>{book.no_of_book_copies}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No Data Available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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
  );
};
export default AdmBookTitleReport;
