import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AdmBook from "./AdmBook";
import { useNavigate } from "react-router-dom";
import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";
import { ApiUrl } from "../../../ApiUrl";

const AdmBookBarcode = () => {
  // const [rows, setRows] = useState(
  //   Array.from({ length: 6 }, (_, index) => ({ id: index + 1 }))
  // );

  const [rows, setRows] = useState(() =>
    Array.from({ length: 30 }, (_, index) => ({
      id: Date.now() + index, // unique id
      bookCode: "",
      bookName: "",
      barcode: "",
      categoryName: "",
      subcategoryName: "",
    }))
  );

  // const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const navigate = useNavigate();

  const handleClear = () => {
    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        bookCode: "",
        bookName: "",
        barcode: "",
        categoryName: "",
        subcategoryName: "",
      }))
    );
  };
  //  const handleAddRow = () => {
  //    const newRow = {
  //      id: rows.length + 1,
  //      bookCode: "",
  //      bookName: "",
  //      barcode: "",
  //      categoryName: "",
  //      subcategoryName: "",
  //    };
  //    setRows([...rows, newRow]);
  //  };

  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        id: Date.now(), // unique id
        bookCode: "",
        bookName: "",
        barcode: "",
        categoryName: "",
        subcategoryName: "",
      },
    ]);
  };


  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = (rowId) => {
    setSelectedRowId(rowId);
    setShowModal(true);
  };

  const handleBookSelection = (selectedBook) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === selectedRowId
          ? {
            ...row,
            bookCode: selectedBook.bookCode || "",
            bookName: selectedBook.bookName || "",
            barcode: selectedBook.barcode || "",
            categoryName: selectedBook.categoryName || "",
            subcategoryName: selectedBook.subcategoryName || "",
          }
          : row
      )
    );
    setShowModal(false);
  };

  const handleBarcodeChange = async (e, rowId) => {
    const enteredBarcode = e.target.value;

    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId ? { ...row, barcode: enteredBarcode } : row
      )
    );

    if (enteredBarcode.trim() === "") return;

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}LIBRARYBOOK/GetAllBooksDetails?barcodeNo=${enteredBarcode}`
      );
      const data = await response.json();

      if (data.message === "success" && data.data && data.data.length > 0) {
        const matchedBook = data.data[0];

        if (matchedBook) {
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.id === rowId
                ? {
                  ...row,
                  barcode: matchedBook.barcode || enteredBarcode,
                  bookCode: matchedBook.bookCode || "",
                  bookName: matchedBook.bookName || "",
                  categoryName: matchedBook.categoryName || "",
                  subcategoryName: matchedBook.subcategoryName || "",
                }
                : row
            )
          );
        }
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };


  const generateBarcode = () => {
    const barcodeNumbers = rows
      .map((row) => (row.barcode ? String(row.barcode).trim() : ""))
      .filter((barcode) => barcode !== "");

    if (barcodeNumbers.length === 0) {
      alert("No barcode numbers available. Please enter barcode numbers.");
      return;
    }

    const pdf = new jsPDF();
    let yPos = 10;

    barcodeNumbers.forEach((barcode, index) => {
      const canvas = document.createElement("canvas");
      const width = 200;
      const height = 80;
      canvas.width = width;
      canvas.height = height;

      JsBarcode(canvas, barcode, {
        format: "CODE128",
        lineColor: "#000000",
        width: 2,
        height: 40,
        displayValue: true,
        fontOptions: "bold",
        font: "Arial",
        fontSize: 16,
        textMargin: 0,
        margin: 0,
      });

      const barcodeImage = canvas.toDataURL("image/png");
      const imgWidthMM = width * 0.264583;
      const imgHeightMM = height * 0.264583;

      pdf.addImage(barcodeImage, "PNG", 20, yPos, imgWidthMM, imgHeightMM);
      yPos += imgHeightMM + 5;

      if (index !== barcodeNumbers.length - 1 && yPos > 250) {
        pdf.addPage();
        yPos = 10;
      }
    });

    // Get blob URL and open in new tab
    const pdfUrl = pdf.output("bloburl");
    window.open(pdfUrl, "_blank");
  };




  // const handleDeleteRow = (rowId) => {
  //   setRows((prevRows) =>
  //     prevRows.map((row) =>
  //       row.id === rowId
  //         ? {
  //             ...row,
  //             bookCode: "",
  //             bookName: "",
  //             barcode: "",
  //             categoryName: "",
  //             subcategoryName: "",
  //           }
  //         : row
  //     )
  //   );
  // };

  const handleDeleteRow = (rowId) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
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
                BOOK BARCODE
              </p>

              {/* Button Group */}
              <div className="row mb-4">
                <div
                  className="col-12"
                  style={{ border: "1px solid #ccc", padding: "10px" }}
                >
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={generateBarcode}
                  >
                    Generate Barcode
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleClear}
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Table - Hide when modal is open */}
              {!showModal && (
                <div className="row">
                  <div className="col-12">
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>Sr No</th>
                            <th>Book Code</th>
                            <th>Book Name</th>
                            <th>Book Accession No</th>
                            <th>Category</th>
                            <th>Sub-Category</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row, index) => (
                            <tr key={row.id}>
                              <td>{index + 1}</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Book Code"
                                    value={row.bookCode || ""}
                                    readOnly
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-primary ms-2"
                                    style={{ width: "35px", height: "30px", padding: 0 }}
                                    onClick={() => handleOpenModal(row.id)}
                                  >
                                    ...
                                  </button>
                                </div>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Book Name"
                                  value={row.bookName || ""}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Accession No"
                                  value={row.barcode || ""}
                                  onChange={(e) => handleBarcodeChange(e, row.id)}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Category"
                                  value={row.categoryName || ""}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Sub-Category"
                                  value={row.subcategoryName || ""}
                                  readOnly
                                />
                              </td>
                              <td>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDeleteRow(row.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan="7" className="text-end">
                              <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleAddRow}
                              >
                                Add New Row
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Single Modal Instance */}
              <AdmBook
                show={showModal}
                handleClose={handleCloseModal}
                selectedRowId={selectedRowId}
                onSelectBook={handleBookSelection}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmBookBarcode;

