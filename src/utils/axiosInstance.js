import axios from "axios";
import { BASE_URL } from "./apiPaths";
console.log("API base URL:", import.meta.env.VITE_API_BASE_URL);


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    // "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//REQUEST INTERCEPTER
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTER
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        window.location.href = "/";
      } else if (error.response.status === 500) {
        console.error("Server Error: ", error);
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request Timeout");
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
