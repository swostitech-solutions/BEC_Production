// API URL Configuration
// Reads from .env file - REACT_APP_API_URL
// Fallback to Render production if not set (safer for production deployments)
export const ApiUrl = {
  apiurl: process.env.REACT_APP_API_URL || "https://schoolmanagement-backend-tqnd.onrender.com/api/",
};

// Available URLs:
// Local Backend: http://127.0.0.1:8000/api/
// Render Backend: https://schoolmanagement-backend-tqnd.onrender.com/api/
// Set via REACT_APP_API_URL in .env file
