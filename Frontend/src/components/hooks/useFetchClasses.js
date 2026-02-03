import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

// Custom hook to fetch the list of classes
const useFetchClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${ApiUrl.apiurl}Course/GetAllCourse/`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        //  API returns an array directly
        if (Array.isArray(result)) {
          setClasses(result);
        } else {
          console.error("Unexpected API structure:", result);
          setClasses([]);
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Failed to load classes.");
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return { classes, loading, error };
};

export default useFetchClasses;
