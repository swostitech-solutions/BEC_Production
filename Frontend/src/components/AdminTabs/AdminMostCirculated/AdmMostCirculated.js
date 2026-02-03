import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx"; // Import XLSX for exporting to Excel
import { Button, Modal } from "react-bootstrap";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";

const AdmMostCirculated = () => {
   const navigate = useNavigate();
  const dateRef = useRef(null);
  const fromClassRef = useRef(null);
  const toClassRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [circulatedBooks, setCirculatedBooks] = useState([]); // State to store fetched books data

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchMostCirculatedBooks = async () => {
      const academicYearId = localStorage.getItem("academicSessionId") || "";

      try {
        const response = await fetch(
          `${ApiUrl.apiurl}LIBRARYBOOK/MostCirculatedBooklist/${academicYearId}`
        );
        const result = await response.json();

        if (result.message === "success") {
          setCirculatedBooks(result.data); // Set the fetched data
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchMostCirculatedBooks();
  }, []); // Empty dependency array means this will run once when the component mounts

  // Handle clear button click to reset form fields
  const handleClear = () => {
     setCirculatedBooks([]);
  };

  // Get top 10 books
  const top10Books = circulatedBooks.slice(0, 10);

  // Export the data to Excel
  const exportToExcel = () => {

      if (!top10Books || top10Books.length === 0) {
        alert("No data available to export!");
        return;
      }
    // Prepare the data to be exported to Excel (top 10 only)
    const exportData = top10Books.map((book, index) => ({
      "Sr.No": index + 1,
      Title: book.book_name,
      Author: book.author,
      Circulated: book.issue_count,
    }));

    // Convert the data to a worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Most Circulated Books");

    // Write the Excel file
    XLSX.writeFile(wb, "most_circulated_books.xlsx");
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

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
                MOST CIRCULATED BOOK REPORT
              </p>

              <div className="row mb-3 mt-3 mx-0 ">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={exportToExcel} // Attach the export function to the button
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
                    style={{
                      width: "150px",
                    }}
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered ">
                    <thead>
                      <tr>
                        <th style={{ width: "10px" }}>Sl.No</th>
                        <th style={{ width: "600px" }}>Title</th>
                        <th style={{ width: "600px" }}>Author</th>
                        <th>Circulated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {top10Books.length > 0 ? (
                        top10Books.map((book, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{book.book_name}</td>
                            <td>{book.author}</td>
                            <td>{book.issue_count}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No Data Available
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
  );
};

export default AdmMostCirculated;
