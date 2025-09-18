// src/api/PropertyAPI.js
import axios from "axios";

const BACKEND_URL = "https://back-end-lybr.onrender.com";
const VALID_CATEGORIES = ["house", "villa", "apartment", "farmlands", "plots", "buildings"];

const API = axios.create({
  baseURL: BACKEND_URL,
});

// -------------------- Auth --------------------
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please login.");
  return { Authorization: `Bearer ${token}` };
};

export const loginUser = async (data) => {
  if (!data.email || !data.password) throw new Error("Email and password are required");
  const res = await API.post("/api/auth/login", data);
  const result = res.data;
  localStorage.setItem("token", result.access_token);
  localStorage.setItem("refresh_token", result.refresh_token);
  localStorage.setItem("fullName", result.fullName);
  localStorage.setItem("email", result.email);
  localStorage.setItem("phone", result.phone || "");
  return result;
};

export const registerUser = async (data) => {
  const { fullName, email, password, phone } = data;
  if (!fullName || !email || !password) throw new Error("Full name, email, and password are required");
  const res = await API.post("/api/auth/register", { fullName, email, password, phone });
  const result = res.data;
  if (result.access_token) {
    localStorage.setItem("token", result.access_token);
    localStorage.setItem("refresh_token", result.refresh_token || "");
    localStorage.setItem("fullName", result.fullName);
    localStorage.setItem("email", result.email);
    if (result.phone) localStorage.setItem("phone", result.phone);
  }
  return result;
};

export const verifyOTP = async ({ email, otp }) => {
  if (!email || !otp) throw new Error("Email and OTP are required");
  const res = await API.post("/api/auth/verify-otp", { email, otp });
  const result = res.data;
  localStorage.setItem("token", result.access_token);
  localStorage.setItem("refresh_token", result.refresh_token);
  localStorage.setItem("fullName", result.fullName);
  localStorage.setItem("email", result.email);
  localStorage.setItem("phone", result.phone || "");
  return result;
};

export const getCurrentUser = async () => {
  try {
    const res = await API.get("/api/auth/me", { headers: getAuthHeaders() });
    return res.data;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    return null;
  }
};

// -------------------- Properties --------------------
export const addProperty = async (formData) => {
  const res = await API.post("/api/add-property", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getProperties = async (searchQuery = "") => {
  const res = await API.get("/api/properties", { params: searchQuery ? { search: searchQuery } : {} });
  return res.data;
};

export const getPropertiesByCategory = async (category, searchQuery = "") => {
  if (!VALID_CATEGORIES.includes(category.toLowerCase())) throw new Error(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`);
  const res = await API.get(`/api/category/${category.toLowerCase()}`, { params: searchQuery ? { search: searchQuery } : {} });
  return res.data;
};

export const getPropertyById = async (id) => {
  const res = await API.get(`/api/property/${id}`);
  return res.data;
};

export const getMyProperties = async () => {
  const res = await API.get("/api/my-properties", { headers: getAuthHeaders() });
  return res.data || { properties: [] };
};

export const updateProperty = async (id, formData) => {
  const res = await API.put(`/api/property/${id}`, formData, { headers: getAuthHeaders() });
  return res.data;
};

export const deleteProperty = async (id) => {
  const res = await API.delete(`/api/property/${id}`, { headers: getAuthHeaders() });
  return res.data;
};

// -------------------- Chat API --------------------
export const getChatByPropertyId = async (propertyId) => {
  const res = await API.get(`/api/chat/property/${propertyId}`, { headers: getAuthHeaders() });
  return {
    chatId: res.data.chat_id,
    propertyId: res.data.property_id,
    ownerId: res.data.owner,
    buyerId: res.data.buyer,
    messages: res.data.messages || [],
  };
};

export const sendMessage = async (chatId, text) => {
  const res = await API.post(`/api/chat/${chatId}/send`, { text }, { headers: getAuthHeaders() });
  return res.data;
};

export const getOwnerInbox = async () => {
  const res = await API.get("/api/chat/inbox", { headers: getAuthHeaders() });
  return res.data.map(chat => ({
    chatId: chat.chat_id,
    propertyId: chat.property_id,
    buyerId: chat.buyer,
    lastMessage: chat.last_message,
    unreadCount: chat.unread_count,
  }));
};

export const getBuyerInbox = async () => {
  const res = await API.get("/api/chat/buyer-inbox", { headers: getAuthHeaders() });
  return res.data.map(chat => ({
    chatId: chat.chat_id,
    propertyId: chat.property_id,
    ownerId: chat.owner,
    lastMessage: chat.last_message,
    unreadCount: chat.unread_count,
  }));
};

export const fetchChatMessages = async (chatId) => {
  const res = await API.get(`/api/chat/${chatId}/messages`, { headers: getAuthHeaders() });
  return res.data.messages || [];
};

// -------------------- Cart --------------------
export const getCart = async () => {
  const res = await API.get("/api/cart", { headers: getAuthHeaders() });
  return res.data.items || [];
};

export const addToCart = async (propertyId) => {
  const res = await API.post(`/api/cart/${propertyId}`, {}, { headers: getAuthHeaders() });
  return res.data;
};

export const removeFromCart = async (propertyId) => {
  const res = await API.delete(`/api/cart/${propertyId}`, { headers: getAuthHeaders() });
  return res.data;
};
