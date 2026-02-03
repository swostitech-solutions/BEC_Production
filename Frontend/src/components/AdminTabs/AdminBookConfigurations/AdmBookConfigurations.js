import React, { useState, useEffect } from "react";
import "./AdmBooKConfigurations.css";
import { ApiUrl } from "../../../ApiUrl";

const LibrarySettings = () => {
  const [settings, setSettings] = useState({
    penaltyEnabled: " ",
    daysToReturn: " ",
    penaltyPerDay: " ",
    sendMessageEnabled: " ",
    daysPriorMessage: " ",
    maxBooksStudent: " ",
    maxBooksTeacher: " ",
  });

  useEffect(() => {
    fetchLibrarySettings();
  }, []);

  const fetchLibrarySettings = async () => {
    try {
      const orgId = localStorage.getItem("orgId") || "";
      const branchId = localStorage.getItem("branchId") || "";

      const response = await fetch(
        `${ApiUrl.apiurl}LIBRARYBOOK/LibraryParameterConfigurationList/?org_id=${orgId}&branch_id=${branchId}`
      );
      const result = await response.json();

      if (result.message === "success" && result.data) {
        setSettings({
          penaltyEnabled:
            result.data.ENABLE_LIBRARY_PENALITY === "YES" ? "Yes" : "No",
          daysToReturn: result.data.LIBRARY_BOOK_RETURN_DAYS,
          penaltyPerDay: result.data.LIBRARY_PENALITY_PER_DAY,
          sendMessageEnabled:
            result.data.LIBRARY_BOOK_RETURN_MESSAGE_SEND === "YES"
              ? "Yes"
              : "No",
          daysPriorMessage: result.data.LIBRARY_BOOK_RETURN_MESSAGE_DAYS_PRIOR,
          maxBooksStudent: result.data.MAX_BOOKS_ISSUED_STUDENT,
          maxBooksTeacher: result.data.MAX_BOOKS_ISSUED_TEACHER,
        });
      }
    } catch (error) {
      console.error("Error fetching library settings:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSave = async () => {
    try {
      const orgId = localStorage.getItem("orgId") || "";
      const branchId = localStorage.getItem("branchId") || "";

      const updatedData = {
        ENABLE_LIBRARY_PENALITY:
          settings.penaltyEnabled === "Yes" ? "YES" : "NO",
        LIBRARY_BOOK_RETURN_DAYS: settings.daysToReturn,
        LIBRARY_PENALITY_PER_DAY: settings.penaltyPerDay,
        LIBRARY_BOOK_RETURN_MESSAGE_SEND:
          settings.sendMessageEnabled === "Yes" ? "YES" : "NO",
        LIBRARY_BOOK_RETURN_MESSAGE_DAYS_PRIOR: settings.daysPriorMessage,
        MAX_BOOKS_ISSUED_STUDENT: settings.maxBooksStudent,
        MAX_BOOKS_ISSUED_TEACHER: settings.maxBooksTeacher,
        org_id: orgId,
        branch_id: branchId,
      };

      const response = await fetch(
        `${ApiUrl.apiurl}LIBRARYBOOK/LibraryParameterConfigurationUpdate/`,
        {
          method: "PUT", // or "PATCH"
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const result = await response.json();

      if (result.message === "success") {
        alert("Library settings updated successfully!");
        fetchLibrarySettings(); // Refresh settings after update
      } else {
        alert("Failed to update settings. Please try again.");
      }
    } catch (error) {
      console.error("Error updating library settings:", error);
    }
  };

  const handleClear = () => {
    setSettings({
      penaltyEnabled: "No",
      daysToReturn: "",
      penaltyPerDay: "",
      sendMessageEnabled: "No",
      daysPriorMessage: "",
      maxBooksStudent: "",
      maxBooksTeacher: "",
    });
  };

  // return (
  //   <div className="library-settings-container">
  //     <h2 className="library-title">LIBRARY SETTINGS</h2>
  //     <div className="library-settings-box">
  //       <h3 className="config-title">Configurations</h3>

  //       <div className="settings-section">
  //         <label className="settings-label">
  //           Enable Penalty on Return after Due Date
  //         </label>
  //         <div className="radio-group">
  //           <input
  //             type="radio"
  //             name="penaltyEnabled"
  //             value="Yes"
  //             checked={settings.penaltyEnabled === "Yes"}
  //             onChange={handleChange}
  //           />{" "}
  //           Yes
  //           <input
  //             type="radio"
  //             name="penaltyEnabled"
  //             value="No"
  //             checked={settings.penaltyEnabled === "No"}
  //             onChange={handleChange}
  //           />{" "}
  //           No
  //         </div>
  //       </div>

  //       <div className="settings-section">
  //         <label className="settings-label">
  //           Number of Days to Return Book *
  //         </label>
  //         <input
  //           type="number"
  //           className="input-field"
  //           name="daysToReturn"
  //           value={settings.daysToReturn}
  //           onChange={handleChange}
  //         />
  //       </div>

  //       <div className="settings-section">
  //         <label className="settings-label">Penalty per day *</label>
  //         <input
  //           type="number"
  //           className="input-field"
  //           name="penaltyPerDay"
  //           value={settings.penaltyPerDay}
  //           onChange={handleChange}
  //         />
  //       </div>

  //       <div className="settings-section">
  //         <label className="settings-label">
  //           Enable Send Message for Book Return Due Date
  //         </label>
  //         <div className="radio-group">
  //           <input
  //             type="radio"
  //             name="sendMessageEnabled"
  //             value="Yes"
  //             checked={settings.sendMessageEnabled === "Yes"}
  //             onChange={handleChange}
  //           />{" "}
  //           Yes
  //           <input
  //             type="radio"
  //             name="sendMessageEnabled"
  //             value="No"
  //             checked={settings.sendMessageEnabled === "No"}
  //             onChange={handleChange}
  //           />{" "}
  //           No
  //         </div>
  //       </div>

  //       <div className="settings-section">
  //         <label className="settings-label">
  //           Number Of Days prior to Send Message *
  //         </label>
  //         <input
  //           type="number"
  //           className="input-field"
  //           name="daysPriorMessage"
  //           value={settings.daysPriorMessage}
  //           onChange={handleChange}
  //         />
  //       </div>

  //       <div className="settings-section">
  //         <label className="settings-label">
  //           Max. Books Allowed to be Issued to Student *
  //         </label>
  //         <input
  //           type="number"
  //           className="input-field"
  //           name="maxBooksStudent"
  //           value={settings.maxBooksStudent}
  //           onChange={handleChange}
  //         />
  //       </div>

  //       <div className="settings-section">
  //         <label className="settings-label">
  //           Max. Books Allowed to be Issued to Teacher *
  //         </label>
  //         <input
  //           type="number"
  //           className="input-field"
  //           name="maxBooksTeacher"
  //           value={settings.maxBooksTeacher}
  //           onChange={handleChange}
  //         />
  //       </div>

  //       <button className="save-button" onClick={handleSave}>
  //         Save
  //       </button>
  //     </div>
  //   </div>
  // );

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
                LIBRARY SETTINGS
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{ width: "150px" }}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    style={{ width: "150px" }}
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <h6 
                    style={{ 
                      fontWeight: "600", 
                      marginBottom: "20px",
                      borderBottom: "2px solid #B88C5A",
                      paddingBottom: "8px",
                      display: "inline-block"
                    }}
                  >
                    Configurations
                  </h6>
                  <div className="row">
                    <div className="col-12 col-md-6 mb-4">
                      <label className="form-label">
                        Enable Penalty on Return after Due Date
                      </label>
                      <div className="d-flex gap-3">
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="penaltyEnabled"
                            id="penaltyYes"
                            value="Yes"
                            checked={settings.penaltyEnabled === "Yes"}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="penaltyYes">
                            Yes
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="penaltyEnabled"
                            id="penaltyNo"
                            value="No"
                            checked={settings.penaltyEnabled === "No"}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="penaltyNo">
                            No
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-6 mb-4">
                      <label className="form-label">
                        Enable Send Message for Book Return Due Date
                      </label>
                      <div className="d-flex gap-3">
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="sendMessageEnabled"
                            id="messageYes"
                            value="Yes"
                            checked={settings.sendMessageEnabled === "Yes"}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="messageYes">
                            Yes
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="sendMessageEnabled"
                            id="messageNo"
                            value="No"
                            checked={settings.sendMessageEnabled === "No"}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="messageNo">
                            No
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-3 mb-4">
                      <label className="form-label">
                        Number of Days to Return Book
                      </label>
                      <input
                        type="number"
                        className="form-control detail"
                        name="daysToReturn"
                        value={settings.daysToReturn}
                        onChange={handleChange}
                        min="1"
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-4">
                      <label className="form-label">
                        Penalty per Day (Rs.)
                      </label>
                      <input
                        type="number"
                        className="form-control detail"
                        name="penaltyPerDay"
                        value={settings.penaltyPerDay}
                        onChange={handleChange}
                        min="0"
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-4">
                      <label className="form-label">
                        Days Prior to Send Message
                      </label>
                      <input
                        type="number"
                        className="form-control detail"
                        name="daysPriorMessage"
                        value={settings.daysPriorMessage}
                        onChange={handleChange}
                        min="1"
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-4">
                      <label className="form-label">
                        Max. Books for Student
                      </label>
                      <input
                        type="number"
                        className="form-control detail"
                        name="maxBooksStudent"
                        value={settings.maxBooksStudent}
                        onChange={handleChange}
                        min="1"
                      />
                    </div>

                    <div className="col-12 col-md-3 mb-4">
                      <label className="form-label">
                        Max. Books for Teacher
                      </label>
                      <input
                        type="number"
                        className="form-control detail"
                        name="maxBooksTeacher"
                        value={settings.maxBooksTeacher}
                        onChange={handleChange}
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarySettings;
