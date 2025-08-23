import axios from "axios";

// Set API URL from env or fallback to deployed backend
const API_URL = process.env.REACT_APP_API_URL || "https://back-end-lybr.onrender.com";

// Map frontend-friendly category names → backend DB values
const categoryMap = {
  apartments: "Appartment",
  buildings: "Builldings",
  houses: "Houses",
  plots: "Plots",
  villas: "Villa",
  farmlands: "Farmlands",
};

// Get properties by category
export const getProperties = async (category) => {
  try {
    const backendCategory = categoryMap[category.toLowerCase()] || category;
    const res = await axios.get(`${API_URL}/api/properties`, {
      params: { category: backendCategory },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching properties:", error.response || error);
    throw error.response?.data || { detail: "Server error" };
  }
};

// Add new property
export const addProperty = async (formData) => {
  try {
    const res = await axios.post(`${API_URL}/api/add-property`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error adding property:", error.response || error);
    throw error.response?.data || { detail: "Server error" };
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    return res.data;
  } catch (error) {
    console.error("Error registering user:", error.response || error);
    throw error.response?.data || { detail: "Server error" };
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, credentials);
    return res.data;
  } catch (error) {
    console.error("Error logging in:", error.response || error);
    throw error.response?.data || { detail: "Server error" };
  }
};
