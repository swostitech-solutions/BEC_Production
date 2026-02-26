import { ApiUrl } from "../../ApiUrl";

export const fetchInitiatedByList = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const organizationId = sessionStorage.getItem("organization_id") || 1;
    const branchId = sessionStorage.getItem("branch_id") || 1;

    const apiURL = `${ApiUrl.apiurl}MessageInitiated/GetAllMessageInitiatedList/?organization_id=${organizationId}&branch_id=${branchId}`;

    const response = await fetch(apiURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const result = await response.json();

    if (result.message === "Success" && Array.isArray(result.data)) {
      return result.data;
    }
    return [];
  } catch (err) {
    console.error("Error fetching initiated by list:", err);
    return [];
  }
};
