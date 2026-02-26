import { ApiUrl } from "../../ApiUrl";

export const fetchClassList = async () => {
  const academicYearId = localStorage.getItem("academicSessionId");
  const assignmentDate = localStorage.getItem("assignmentDate");
  const teacherId = localStorage.getItem("selectedTeacherId");

  // Handle missing data
  if (!academicYearId || !assignmentDate || !teacherId) {
    console.error("Missing required data in localStorage:", {
      academicYearId,
      assignmentDate,
      teacherId,
    });
    // alert("Some required information is missing. Please try again.");
    return []; // Return empty array or handle it based on your application logic
  }

  const apiUrl = `${ApiUrl.apiurl}Teacher/GetClassListBasedOnDay/${academicYearId}/${assignmentDate}/${teacherId}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch class list");
    }
    const data = await response.json();
    console.log(data,"kkkk")
    return data.data || []; 
  } catch (error) {
    console.error("Error fetching class list:", error);
    throw error; 
  }
};
