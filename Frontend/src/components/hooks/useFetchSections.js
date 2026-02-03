// import { useState, useEffect } from "react";
// import {ApiUrl} from "../../ApiUrl"

// // Custom hook to fetch sections based on the selected class ID
// const useSections = (classId) => {
//   const [sections, setSections] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!classId) return; 

//     const fetchSections = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `${ApiUrl.apiurl}ClassSectionBind/GetAllSectionBindWithClass/${classId}`
//         );
//         const result = await response.json();
//         setSections(result.data);
//         // console.log("result:",result.data)
//       } catch (err) {
//         setError("Failed to load sections.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSections();
//   }, [classId]);

//   return { sections, loading, error };
// };

// export default useSections;


import { useState, useEffect } from "react";
import { ApiUrl } from "../../ApiUrl";

// Custom hook to fetch sections based on the selected class ID
const useSections = (classId) => {
  const [sections, setSections] = useState([]); // always initialized as array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!classId) {
      // Reset when no class selected
      setSections([]);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchSections = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${ApiUrl.apiurl}ClassSectionBind/GetAllSectionBindWithClass/${classId}`
        );
        const result = await response.json();
        setSections(result?.data || []); // always set an array
      } catch (err) {
        setError("Failed to load sections.");
        setSections([]); //  empty array even if error
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [classId]);

  return { sections, loading, error };
};

export default useSections;

