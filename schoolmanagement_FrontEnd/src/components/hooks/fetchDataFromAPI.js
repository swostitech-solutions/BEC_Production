// // utility.js (you can place this function in a separate utility file for reusability)
// export const fetchDataFromAPI = async (endpoint, params) => {
//     try {
//       const url = buildUrl(endpoint, params);
//       const response = await fetch(url);
  
//       if (!response.ok) {
//         throw new Error('Failed to fetch data');
//       }
  
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       return null;
//     }
//   };
  
//   // Helper function to construct the URL based on endpoint and parameters
//   const buildUrl = (endpoint, params) => {
//     let url = endpoint;
    
//     // Iterate through the parameters and append them to the URL
//     Object.keys(params).forEach(key => {
//       if (params[key]) {
//         url = url.replace(`<${key}>`, params[key]);
//       }
//     });
  
//     return url;
//   };




const fetchDataFromAPI = async (url, params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${url}?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
  