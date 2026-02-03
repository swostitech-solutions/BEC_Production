import {ApiUrl} from "../../ApiUrl"
export const fetchSubjectList = async ({
  academicYearId,
  date,
  teacherId,
  classId,
  sectionId,
}) => {
  try {
    // Construct the full API URL
    const url = `${ApiUrl.apiurl}Teacher/GetSubjectListBasedOnDay/${academicYearId}/${date}/${teacherId}/${classId}/${sectionId}`;

    console.log("Calling API:", url); // Debugging

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API Response:", data); // Debugging

    return data;
  } catch (error) {
    console.error("Error fetching subject list:", error);
    throw error;
  }
};
