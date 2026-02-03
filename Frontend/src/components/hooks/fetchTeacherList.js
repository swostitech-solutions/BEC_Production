// import { ApiUrl } from "../../ApiUrl";

// export const fetchTeacherList = async (academicYearId, assignmentDate) => {
//   if (!academicYearId || !assignmentDate) {
//     throw new Error("Missing parameters: academicYearId or assignmentDate");
//   }

//   // 🔥 Add token
//   const token = localStorage.getItem("accessToken");

//   const apiUrl = `${ApiUrl.apiurl}Teacher/GetTeacherListBasedOnDay/${academicYearId}/${assignmentDate}`;

//   try {
//     const response = await fetch(apiUrl, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`, // 🔒 Token added
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch teacher list");
//     }

//     const data = await response.json();
//     return data.data || [];
//   } catch (error) {
//     console.error("Error fetching teacher list:", error);
//     throw error;
//   }
// };

import { ApiUrl } from "../../ApiUrl";

export const fetchTeacherList = async ({
  organization_id,
  branch_id,
  batch_id,
  course_id,
  department_id,
  academic_year_id,
  semester_id,
  section_id,
  subject_id,
  lecture_id,
  date,
}) => {
  // 🔍 Validation
  if (
    !organization_id ||
    !branch_id ||
    !batch_id ||
    !course_id ||
    !department_id ||
    !academic_year_id ||
    !semester_id ||
    !section_id ||
    !subject_id ||
    !lecture_id ||
    !date
  ) {
    throw new Error("Missing required parameters for professor list API");
  }

  const token = localStorage.getItem("accessToken");

  // 🔥 Build Dynamic API URL
  const apiUrl = `${ApiUrl.apiurl}Professor/GetProfessorListBasedOnSubject/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}&academic_year_id=${academic_year_id}&semester_id=${semester_id}&section_id=${section_id}&subject_id=${subject_id}&lecture_id=${lecture_id}&date=${date}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch professor list");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching professor list:", error);
    throw error;
  }
};
