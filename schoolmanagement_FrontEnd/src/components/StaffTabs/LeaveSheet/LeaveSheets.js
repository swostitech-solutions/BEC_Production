
import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";


const AdmAttendanceEntry = () => {
  const navigate = useNavigate();
  const [sectionId, setSectionId] = useState(null);
  const [classId, setClassId] = useState(null);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  // const [transportData, setTransportData] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const fileInputRef = useRef(null);
  const [selectedSubject, setSelectedSubject] = useState(null);


  const fromClassRef = useRef(null);
  const admissionNoRef = useRef(null);
  const barcodeRef = useRef(null);
  const smsToRef = useRef(null);


  // const handleClear = () => {
  //   setSectionId(null);
  //   setClassId(null);
  //   setSectionOptions([]);
  //   setClassOptions([]);
  //   setSubjectOptions([]);
  //   setUploadedFile(null);
  //   setDocuments([]);
  //   setCurrentPage(0);

  //   if (fromClassRef.current) fromClassRef.current.value = "";
  //   if (admissionNoRef.current) admissionNoRef.current.value = "";
  //   if (barcodeRef.current) barcodeRef.current.value = "";
  //   if (smsToRef.current) smsToRef.current.checked = false;
  //   // Clear Subject (React Select)
  //   setSelectedSubject(null); // Assuming selectedSubject is the state variable for the Subject dropdown

  //   // Clear Upload File
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = ""; // Reset file input
  //   }
  // };


  // Slice data for pagination
  // const offset = currentPage * itemsPerPage;
  // const currentData = transportData.slice(offset, offset + itemsPerPage);
  // const pageCount = Math.ceil(transportData.length / itemsPerPage);



  const handleClear = () => {
    setSectionId(null);
    setClassId(null);
    setUploadedFile(null);
    setSelectedSubject(null);
    setCurrentPage(0);
    setDocuments([]); // Optional: Keep or remove based on your UX decision

    if (fromClassRef.current) fromClassRef.current.value = "";
    if (admissionNoRef.current) admissionNoRef.current.value = "";
    if (barcodeRef.current) barcodeRef.current.value = "";
    if (smsToRef.current) smsToRef.current.checked = false;

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }

    //  REMOVE these (they were the problem):
    // setSectionOptions([]);
    // setClassOptions([]);
    // setSubjectOptions([]);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    const fetchSectionData = async () => {
      if (!classId) {
        setSectionOptions([]); // Clear sections if no class selected
        return;
      }

      console.log("Fetching sections for classId:", classId); // Debugging

      try {
        const response = await fetch(
          `${ApiUrl.apiurl}ClassSectionBind/GetAllSectionBindWithClass/${classId}`
        );
        const data = await response.json();

        console.log("Section API response:", data); // Debugging

        if (data.message === "success") {
          const formattedSections = data.data.map((sectionItem) => ({
            value: sectionItem.id,
            label: sectionItem.sectionname,
          }));
          setSectionOptions(formattedSections);
        } else {
          console.error("Failed to fetch sections: ", data.message);
          setSectionOptions([]);
        }
      } catch (error) {
        console.error("Error fetching section data:", error);
        setSectionOptions([]);
      }
    };

    fetchSectionData();
  }, [classId]);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await fetch(`${ApiUrl.apiurl}Course/GetAllCourse/`);
        const data = await response.json();

        if (data.message === "Success") {
          const formattedClasses = data.data.map((classItem) => ({
            value: classItem.id,
            label: classItem.classname,
          }));
          setClassOptions(formattedClasses);
        } else {
          console.error("Failed to fetch classes: ", data.message);
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    fetchClassData();
  }, []);

  // Retrieve values from local storage
  const academicSessionId = localStorage.getItem("academicSessionId");
  const orgId = localStorage.getItem("orgId");
  const branchId = localStorage.getItem("branchId");
  useEffect(() => {
    const fetchSubjectData = async () => {
      if (!classId || !sectionId) {
        setSubjectOptions([]); // Clear subject dropdown if class or section is not selected
        return;
      }

      try {
        const response = await fetch(
          `${ApiUrl.apiurl}ACADEMIC_DOCUMENTS/GetSubjectListBasedOnClassSection/?academic_year_id=${academicSessionId}&org_id=${orgId}&branch_id=${branchId}&class_id=${classId}&section_id=${sectionId}`
        );
        const data = await response.json();

        if (data.message.toLowerCase() === "success") {
          const formattedSubjects = data.data.map((subjectItem) => ({
            value: subjectItem.id, // Assign subject ID as value
            label: subjectItem.subject_code, // Assign subject_code as label
          }));
          setSubjectOptions(formattedSubjects);
        } else {
          console.error("Failed to fetch subjects: ", data.message);
          setSubjectOptions([]);
        }
      } catch (error) {
        console.error("Error fetching subject data:", error);
        setSubjectOptions([]);
      }
    };

    fetchSubjectData();
  }, [classId, sectionId]);

  const handleSave = async () => {
    if (!classId || !sectionId || !uploadedFile) {
      alert("Please select Class, Section, and upload a file before saving.");
      return;
    }

    const userId = sessionStorage.getItem("userId"); // Get userId from session storage
    if (!userId) {
      alert("User not authenticated.");
      return;
    }

    const formData = new FormData();
    formData.append("class_id", classId);
    formData.append("section_id", sectionId);
    formData.append(
      "subject_id",
      subjectOptions.find((s) => s.value)?.value || ""
    ); // Select the subject if available
    formData.append("upload_file", uploadedFile);
    formData.append("created_by", userId);
    formData.append("academic_year_id", academicSessionId);
    formData.append("org_id", orgId);
    formData.append("branch_id", branchId);

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}ACADEMIC_DOCUMENTS/create/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("File uploaded successfully!");
        fetchDocuments(); // Fetch updated documents immediately
      } else {
        console.error("Upload failed:", data);
        alert(data.error?.upload_file?.[0] || "Failed to upload file.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while uploading the file.");
    }
  };


  // Fetch documents from API
  const fetchDocuments = async () => {
    try {
      const response = await fetch(
        `${ApiUrl.apiurl}ACADEMIC_DOCUMENTS/${academicSessionId}/${orgId}/${branchId}/`
      );

      const data = await response.json();
      if (response.ok) {
        setDocuments(data.data); // Store the fetched documents
      } else {
        console.error("Failed to fetch documents:", data.message);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);


  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}ACADEMIC_DOCUMENTS/deleteACADEMIC_DOCUMENTS/${docId}/`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert("Document deleted successfully!");
        setDocuments(documents.filter((doc) => doc.doc_id !== docId)); // Remove from state
      } else {
        alert("Failed to delete document.");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
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
                ACADEMICS DOCUMENTS UPLOAD
              </p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={fetchDocuments}
                  >
                    Display
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSave}
                  >
                    Save
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
                    onClick={() => navigate("/staff/dashboard")}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1 mt-3">
                      <div className="col-12 col-md-3 mb-3 ">
                        <label htmlFor="class" className="form-label">
                          Class
                        </label>

                        <Select
                          options={classOptions}
                          className="detail"
                          classNamePrefix="react-select"
                          // isClearable={true}
                          placeholder="Select Class"
                          value={
                            classOptions.find(
                              (option) => option.value === classId
                            ) || null
                          } // Match the selected class
                          onChange={(selectedOption) =>
                            setClassId(
                              selectedOption ? selectedOption.value : null
                            )
                          }
                        />
                      </div>

                      <div className="col-md-3">
                        <label htmlFor="section" className="form-label">
                          Section
                        </label>
                        <Select
                          options={sectionOptions}
                          className="detail"
                          classNamePrefix="react-select"
                          // isClearable={true}
                          placeholder="Select Section"
                          value={
                            sectionOptions.find(
                              (option) => option.value === sectionId
                            ) || null
                          }
                          onChange={(selectedOption) => {
                            console.log(
                              "Selected sectionId:",
                              selectedOption ? selectedOption.value : null
                            ); // Debugging
                            setSectionId(
                              selectedOption ? selectedOption.value : null
                            );
                          }}
                        />
                      </div>

                      <div className="col-md-3">
                        <label htmlFor="subject" className="form-label">
                          Subject
                        </label>
                        <Select
                          options={subjectOptions}
                          className="detail"
                          classNamePrefix="react-select"
                          // isClearable={true}
                          placeholder="Select Subject"
                          value={
                            subjectOptions.find(
                              (option) => option.value === selectedSubject
                            ) || null
                          }
                          onChange={(selectedOption) =>
                            setSelectedSubject(
                              selectedOption ? selectedOption.value : null
                            )
                          }
                        />
                      </div>

                      <div className="col-md-3 ">
                        <label htmlFor="upload-photo" className="form-label">
                          Upload photo
                        </label>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="form-control detail"
                          accept="*/*"
                          onChange={(e) => setUploadedFile(e.target.files[0])}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table  table-bordered">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Class</th>
                        <th>Section</th>
                        <th>Subject</th>
                        <th>Attachment</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {documents.length > 0 ? (
                          documents.map((doc, index) => ( */}
                      {Array.isArray(documents) && documents.length > 0 ? (
                        documents.map((doc, index) => (
                          <tr key={doc.doc_id}>
                            <td>{index + 1}</td>
                            <td>{doc.classname}</td>
                            <td>{doc.sectionname}</td>
                            <td>{doc.subjectname}</td>
                            <td>
                              <a
                                href={`data:${doc.doc_type};base64,${doc.doc_binary}`}
                                download={doc.doc_name}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View
                              </a>
                            </td>
                            <td>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDelete(doc.doc_id);
                                }}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Delete
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No documents found.
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

export default AdmAttendanceEntry;
