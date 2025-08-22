import axios from "axios";

// Axios instance pointing to your live backend on Render
const API = axios.create({
  baseURL: "https://back-end-lybr.onrender.com", // your Render backend URL
});

// Optional: attach token if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ---------------- API FUNCTIONS ----------------

// Register user
export const registerUser = (data) => API.post("/api/auth/register", data);

// Login user
export const loginUser = (params) => API.post("/api/auth/login", params);

// Add property
export const addProperty = (data) => API.post("/add-property", data);

// Get properties (category + optional search)
export const getProperties = (category = "", search = "") =>
  API.get("/properties/", { params: { category, search } });

export default API;
