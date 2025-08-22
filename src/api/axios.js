import axios from "axios";

const API = axios.create({
  baseURL: "https://back-end-lybr.onrender.com",
});

// Attach token automatically if present
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API; // <--- default export
