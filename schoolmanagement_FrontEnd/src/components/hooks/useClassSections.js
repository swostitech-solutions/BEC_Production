// hooks/useClassSections.js
import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl"; 

const useClassSections = () => {
  const [classSections, setClassSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassSections = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${ApiUrl.apiurl}ClassSectionBind/GetAllClassSectionBind/`);
        const result = await response.json();
        setClassSections(result.data); // Assume 'data' contains the array
      } catch (err) {
        setError("Failed to load class sections.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassSections();
  }, []);

  return { classSections, loading, error };
};

export default useClassSections;
