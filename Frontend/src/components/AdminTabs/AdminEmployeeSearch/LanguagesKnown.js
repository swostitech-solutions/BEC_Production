import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";

const App = ({ goToTab, languageData, setExperienceDataInParent }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const languages = ["HINDI", "ENGLISH", "SANSKRIT", "URDU"];

  // Mapping language to code dynamically
  const languageCodes = {
    HINDI: "1",
    ENGLISH: "2",
    SANSKRIT: "3",
    URDU: "4",
  };

  const handleLanguageClick = (language) => {
    setSelectedLanguage(language);
  };


  useEffect(() => {
    if (languageData && languageData.language_code) {
      const codeToLanguage = Object.entries(languageCodes).find(
        ([_, code]) => code === languageData.language_code
      );

      if (codeToLanguage) {
        setSelectedLanguage(codeToLanguage[0]); // Set language name like "ENGLISH"
      }
    }
  }, [languageData]);

  // const handleNextClick = async () => {
  //   if (!selectedLanguage) {
  //     alert("Please select a language before proceeding.");
  //     return;
  //   }

  //   const employeeId = localStorage.getItem("employeeId");
  //   const createdBy = sessionStorage.getItem("userId");

  //   const payload = {
  //     employee_language_id: 0, // adjust if needed dynamically
  //     language_code: languageCodes[selectedLanguage], // get code based on selected language
  //     created_by: parseInt(createdBy),
  //   };

  //   try {
  //     const response = await fetch(
  //       `${ApiUrl.apiurl}STAFF/registrationLANGUAGECreateUpdate/${employeeId}/`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log("Language API Response:", data);
  //       alert("Language saved successfully!");
  //       goToTab(7); // Move to next tab only after successful API call
  //     } else {
  //       const errorData = await response.json();
  //       console.error("Language API Error:", errorData);
  //       alert("Failed to save language.");
  //     }
  //   } catch (error) {
  //     console.error("Network Error:", error);
  //     alert("Network error occurred.");
  //   }
  // };

  const handleNextClick = async () => {
    // if (!selectedLanguage) {
    //   alert("Please select a language before proceeding.");
    //   return;
    // }

    const employeeId = localStorage.getItem("employeeId");
    const createdBy = sessionStorage.getItem("userId");

    if (!employeeId || !createdBy) {
      alert("Employee ID or User ID is missing.");
      return;
    }

    const payload = {
      employee_language_id: 0,
      language_code: languageCodes[selectedLanguage],
      created_by: parseInt(createdBy),
    };

    try {
      // Step 1: Save selected language
      const orgId = localStorage.getItem("orgId");
      const branchId = localStorage.getItem("branchId");

      const langSaveUrl = `${ApiUrl.apiurl}STAFF/RegistrationLANGUAGECreateUpdate/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`;
      const langSaveResponse = await fetch(langSaveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const langSaveText = await langSaveResponse.text();
      let langSaveResult = {};

      try {
        langSaveResult = langSaveText ? JSON.parse(langSaveText) : {};
      } catch (err) {
        console.error("Failed to parse language save response:", langSaveText);
        alert("Invalid response from language save API.");
        return;
      }

      if (
        !langSaveResponse.ok ||
        langSaveResult.message?.toLowerCase() !== "success"
      ) {
        alert(langSaveResult.message || "Language submission failed.");
        return;
      }

      console.log("Language Save Success:", langSaveResult);

      // Step 2: Fetch experience data
      const experienceUrl = `${ApiUrl.apiurl}STAFF/RegistrationExperienceDetailsRetrieve/?organization_id=${orgId}&branch_id=${branchId}&employee_id=${employeeId}`;
      const experienceResponse = await fetch(experienceUrl);

      if (experienceResponse.status === 204) {
        console.warn("Experience API returned 204 No Content");
        goToTab(7); // Proceed anyway
        return;
      }

      const experienceText = await experienceResponse.text();
      let experienceResult = {};

      try {
        experienceResult = experienceText ? JSON.parse(experienceText) : {};
      } catch (err) {
        console.error("Failed to parse experience response:", experienceText);
        alert("Invalid response from experience API.");
        return;
      }

      console.log("Experience API Success:", experienceResult);

      if (
        experienceResponse.ok &&
        experienceResult.message?.toLowerCase() === "success"
      ) {
        // Optional: Pass experience data to parent if needed
        setExperienceDataInParent(experienceResult.data);

        goToTab(7); // Proceed to next tab
      } else {
        alert(
          experienceResult.message || "Failed to retrieve experience data."
        );
      }
    } catch (error) {
      console.error("Error in handleNextClick:", error);
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div className="container-fluid my-4">
      <div
        style={{
          maxHeight: "500px",
          overflowY: "auto",
          width: "100%", // Increased width to 100%
          border: "1px solid black",
        }}
      >
        <ul className="list-group">
          {languages.map((language, index) => (
            <li
              key={index}
              className={`list-group-item ${selectedLanguage === language ? "active text-white" : ""
                }`}
              style={{ cursor: "pointer" }}
              onClick={() => handleLanguageClick(language)}
            >
              {language}
            </li>
          ))}
        </ul>
      </div>

      <div className="d-flex justify-content-end mb-3 mt-3">
        <button
          className="btn btn-primary border"
          onClick={handleNextClick} // API call on Next
        >
          Next
        </button>
      </div>

      {selectedLanguage && (
        <div className="mt-3">
          <strong>Selected Language: </strong> {selectedLanguage}
        </div>
      )}
    </div>
  );
};

export default App;
//
