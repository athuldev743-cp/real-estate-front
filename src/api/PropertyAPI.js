// PropertyAPI.js
import axios from "axios";

// -------------------- Axios instance --------------------
const API = axios.create({
  baseURL: "https://back-end-lybr.onrender.com/api", // your backend base URL
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// -------------------- Auth --------------------
export const loginUser = async (data) => {
  try {
    const res = await API.post("/auth/login", data);
    const result = res.data;
    localStorage.setItem("token", result.access_token);
    localStorage.setItem("refresh_token", result.refresh_token);
    localStorage.setItem("fullName", result.fullName);
    localStorage.setItem("email", result.email);
    localStorage.setItem("phone", result.phone);
    return result;
  } catch (err) {
    console.error("❌ loginUser error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.detail || "Login failed");
  }
};

export const registerUser = async (data) => {
  try {
    const res = await API.post("/auth/register", data);
    return res.data;
  } catch (err) {
    console.error("❌ registerUser error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.detail || "Registration failed");
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await API.get("/auth/me");
    return res.data;
  } catch (err) {
    console.error("❌ getCurrentUser error:", err.response?.data || err.message);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    return null;
  }
};

// -------------------- Properties --------------------
const VALID_CATEGORIES = ["house", "villa", "apartment", "farmlands", "plots", "buildings"];

export const addProperty = async (formData) => {
  try {
    const res = await API.post("/add-property", formData);
    return res.data;
  } catch (err) {
    console.error("❌ addProperty error:", err.response?.data || err.message);
    throw err;
  }
};

export const getMyProperties = async () => {
  try {
    const res = await API.get("/my-properties");
    return res.data; // { properties: [...] }
  } catch (err) {
    console.error("❌ getMyProperties error:", err.response?.data || err.message);
    return { properties: [] };
  }
};

export const getPropertiesByCategory = async (category, searchQuery = "") => {
  if (!VALID_CATEGORIES.includes(category.toLowerCase()))
    throw new Error(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`);
  try {
    const res = await API.get(`/category/${category.toLowerCase()}`, {
      params: searchQuery ? { search: searchQuery } : {},
    });
    return res.data;
  } catch (err) {
    console.error("❌ getPropertiesByCategory error:", err.response?.data || err.message);
    return [];
  }
};

export const getPropertyById = async (id) => {
  try {
    const res = await API.get(`/property/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ getPropertyById error:", err.response?.data || err.message);
    return null;
  }
};

export const updateProperty = async (id, formData) => {
  try {
    const res = await API.put(`/property/${id}`, formData);
    return res.data;
  } catch (err) {
    console.error("❌ updateProperty error:", err.response?.data || err.message);
    throw err;
  }
};

export const deleteProperty = async (id) => {
  try {
    const res = await API.delete(`/property/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ deleteProperty error:", err.response?.data || err.message);
    return null;
  }
};

// -------------------- Cart --------------------
export const getCart = async () => {
  try {
    const res = await API.get("/cart");
    return res.data || [];
  } catch (err) {
    console.error("❌ getCart error:", err.response?.data || err.message);
    return [];
  }
};

export const addToCart = async (propertyId) => {
  try {
    const res = await API.post(`/cart/${propertyId}`);
    return res.data;
  } catch (err) {
    console.error("❌ addToCart error:", err.response?.data || err.message);
    return null;
  }
};

export const removeFromCart = async (propertyId) => {
  try {
    const res = await API.delete(`/cart/${propertyId}`);
    return res.data;
  } catch (err) {
    console.error("❌ removeFromCart error:", err.response?.data || err.message);
    return null;
  }
};

// -------------------- Chat --------------------
export const getMessages = async (propertyId) => {
  try {
    const res = await API.get(`/chat/property/${propertyId}`);
    return res.data;
  } catch (err) {
    console.error("❌ getMessages error:", err.response?.data || err.message);
    return { chatId: null, messages: [] };
  }
};

export const sendMessage = async (chatId, text) => {
  try {
    const res = await API.post(`/chat/${chatId}/send`, { text });
    return res.data;
  } catch (err) {
    console.error("❌ sendMessage error:", err.response?.data || err.message);
    return null;
  }
};

export const getOwnerInbox = async () => {
  try {
    const res = await API.get("/chat/inbox");
    return res.data.chats || [];
  } catch (err) {
    console.error("❌ getOwnerInbox error:", err.response?.data || err.message);
    return [];
  }
};

export const getOwnerChatMessages = async (chatId) => {
  try {
    const res = await API.get(`/chat/${chatId}/messages`);
    return res.data.messages || [];
  } catch (err) {
    console.error("❌ getOwnerChatMessages error:", err.response?.data || err.message);
    return [];
  }
};

export default API;

