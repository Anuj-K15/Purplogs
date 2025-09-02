import axios from "axios";

// Get the base URL from environment variables or use the default (localhost in development)
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create axios instance with default config
const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 60000, // 60 seconds timeout (increased from 30 seconds)
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include auth token in headers
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to the authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error) => {
    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED') {
      console.error("Request Timeout:", error.message);
      return Promise.reject({
        status: "timeout",
        message: "Request timed out. The server might be starting up or under heavy load. Please try again in a moment.",
      });
    }
    
    // Handle network errors
    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject({
        status: "network_error",
        message: "Network error. Please check your connection and verify the server is running.",
      });
    }

    // Handle authentication errors (401)
    if (error.response.status === 401) {
      // Clear localStorage on authentication failures
      localStorage.removeItem("token");
    }

    // Return the error for further handling in components
    return Promise.reject(error);
  }
);

export default api;
