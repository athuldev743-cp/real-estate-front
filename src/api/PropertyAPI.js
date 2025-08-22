import axios from "axios";

// Axios instance pointing to your live backend
const API = axios.create({
  baseURL: "https://back-end-lybr.onrender.com",
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
export const registerUser = (data) => API.post("/api/auth/register", data);
export const loginUser = (params) => API.post("/api/auth/login", params);
export const addProperty = (data) => API.post("/add-property", data);

// Get properties (with category and optional search)
export const getProperties = (category = "", search = "") =>
  API.get("/properties/", { params: { category, search } });

export default API;
