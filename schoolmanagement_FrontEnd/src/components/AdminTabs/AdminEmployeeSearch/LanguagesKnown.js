import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApiUrl } from "../../../ApiUrl";

const App = ({ goToTab, languageData, setExperienceDataInParent, setLanguageData }) => {
  const languages = ["HINDI", "ENGLISH", "SANSKRIT", "URDU"];

  // Mapping language to code dynamically
  const languageCodes = {
    HINDI: "1",
    ENGLISH: "2",
    SANSKRIT: "3",
    URDU: "4",
  };

  // Initialize selectedLanguages from parent if available (handles when user navigates back)
  const [selectedLanguages, setSelectedLanguages] = useState(() => {
    if (languageData && languageData.language_code) {
      const codes = (languageData.language_code || "").toString().split(",");
      return languages.filter((lang) =>
        codes.some((c) => {
          const found = Object.entries(languageCodes).find(
            ([_, code]) => (code || "").toString() === c.trim()
          );
          return found && found[0] === lang;
        })
      );
    }
    return [];
  });

  const [languageId, setLanguageId] = useState(() => {
    return languageData?.employee_language_id || 0;
  });

  const handleLanguageClick = (language) => {
    let newLanguages;
    if (selectedLanguages.includes(language)) {
      newLanguages = selectedLanguages.filter((lang) => lang !== language);
    } else {
      newLanguages = [...selectedLanguages, language];
    }
    setSelectedLanguages(newLanguages);

    if (setLanguageData) {
      const codemap = { HINDI: "1", ENGLISH: "2", SANSKRIT: "3", URDU: "4" };
      const codes = newLanguages.map(lang => codemap[lang]).join(",");
      setLanguageData({
        employee_language_id: languageId || 0,
        language_code: codes
      });
    }
  };


  useEffect(() => {
    if (languageData && languageData.language_code) {
      // Handle CSV string or single value
      const codes = (languageData.language_code || "").toString().split(",");
      const foundLanguages = languages.filter((lang) =>
        codes.some((c) => {
          const found = Object.entries(languageCodes).find(
            ([_, code]) => (code || "").toString() === c.trim()
          );
          return found && found[0] === lang;
        })
      ); if (foundLanguages.length > 0) {
        setSelectedLanguages(foundLanguages);
      }
      setLanguageId(languageData.employee_language_id || 0);
    }
  }, [languageData]);

  // Sync with Parent removed (handled in handler)

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

  // Navigate to next tab - NO API calls here
  // Data is already synced to parent via handleLanguageClick
  const handleNextClick = () => {
    if (selectedLanguages.length === 0) {
      alert("Please select at least one language before proceeding.");
      return;
    }
    goToTab(7); // Navigate to next tab
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
              className={`list-group-item ${selectedLanguages.includes(language) ? "active text-white" : ""
                }`}
              style={{ cursor: "pointer" }}
              onClick={() => handleLanguageClick(language)}
            >
              {language}
            </li>
          ))}
        </ul>
      </div>

      {selectedLanguages.length > 0 && (
        <div className="mt-3">
          <strong>Selected Languages: </strong> {selectedLanguages.join(", ")}
        </div>
      )}
    </div>
  );
};

export default App;
//
