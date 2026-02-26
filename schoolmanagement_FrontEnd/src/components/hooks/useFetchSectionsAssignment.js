import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

const useFetchSectionsAssignment = (selectedClassId) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedClassId) return; // Exit early if no class ID

    const fetchSections = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${ApiUrl.apiurl}ClassSectionBind/GetAllSectionBindWithClass/${selectedClassId}`
        );
        const result = await response.json();

        console.log("API Result:", result);

        if (result && result.data) {
          setSections(result.data); // Update sections
        } else {
          setError("No sections found.");
        }
      } catch (err) {
        setError("Failed to load sections.");
        console.error("Error fetching sections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [selectedClassId]);

  return { sections, loading, error };
};

export default useFetchSectionsAssignment;
