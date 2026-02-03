import axios from "axios";
import { ApiUrl } from "../ApiUrl";


const api = axios.create({
  baseURL: ApiUrl.apiurl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // If data is FormData, remove Content-Type header so axios can set it automatically
  // with the correct boundary for multipart/form-data
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

// Handle errors automatically
api.interceptors.response.use(
  (response) => response, // Success - just return response
  (error) => {
    // If token expired or invalid, logout and redirect to login
    if (error.response?.status === 401) {
      console.log("Token expired or invalid");
    }
    return Promise.reject(error);
  }
);

// Export the api instance
export default api;

