// src/api/PropertyAPI.js
import API from "./axios";

const BACKEND_URL = "https://back-end-lybr.onrender.com";
const VALID_CATEGORIES = ["house", "villa", "apartment", "farmlands", "plots", "buildings"];

// -------------------- Auth --------------------
export const loginUser = async (data) => {
  if (!data.email || !data.password) throw new Error("Email and password are required");
  try {
    // ✅ Updated URL
    const res = await API.post("/api/auth/login", data);
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


// -------------------- Auth: Register --------------------
export const registerUser = async (data) => {
  const { fullName, email, password, phone } = data;
  if (!fullName || !email || !password)
    throw new Error("Full name, email, and password are required");

  try {
    const res = await API.post("/api/auth/register", { fullName, email, password, phone });
    const result = res.data;

    // Store tokens and user info if backend returns them
    if (result.access_token) {
      localStorage.setItem("token", result.access_token);
      localStorage.setItem("refresh_token", result.refresh_token || "");
      localStorage.setItem("fullName", result.fullName);
      localStorage.setItem("email", result.email);
      if (result.phone) localStorage.setItem("phone", result.phone);
    }

    return result;
  } catch (err) {
    console.error("❌ registerUser error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.detail || "Registration failed");
  }
};


export const verifyOTP = async ({ email, otp }) => {
  if (!email || !otp) throw new Error("Email and OTP are required");
  try {
    const res = await API.post("/api/auth/verify-otp", { email, otp });
    const result = res.data;

    localStorage.setItem("token", result.access_token);
    localStorage.setItem("refresh_token", result.refresh_token);
    localStorage.setItem("fullName", result.fullName);
    localStorage.setItem("email", result.email);
    localStorage.setItem("phone", result.phone);

    return result;
  } catch (err) {
    console.error("❌ verifyOTP error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.detail || "OTP verification failed");
  }
};
export const getCurrentUser = async () => {
  try {
    const res = await API.get("/api/auth/me");
    return res.data;
  } catch (err) {
    console.error("❌ getCurrentUser error:", err.response?.data || err.message);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    return null;
  }
};

// -------------------- Properties --------------------
export const addProperty = async (formData) => {
  try {
    const token = localStorage.getItem("token"); // get your JWT or auth token
    if (!token) throw new Error("No token found. Please login.");

    const res = await API.post("/api/add-property", formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // if you’re sending FormData
      },
    });

    return res.data;
  } catch (err) {
    console.error("❌ addProperty error:", err.response?.data || err.message);
    throw err;
  }
};

export const getProperties = async (searchQuery = "") => {
  try {
    const res = await API.get("/api/properties", {
      params: searchQuery ? { search: searchQuery } : {},
    });
    return res.data;
  } catch (err) {
    console.error("❌ getProperties error:", err.response?.data || err.message);
    return [];
  }
};

export const getPropertiesByCategory = async (category, searchQuery = "") => {
  if (!category) throw new Error("Category is required");
  if (!VALID_CATEGORIES.includes(category.toLowerCase())) {
    throw new Error(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`);
  }
  try {
    const res = await API.get(`/api/category/${category.toLowerCase()}`, {
      params: searchQuery ? { search: searchQuery } : {},
    });
    return res.data;
  } catch (err) {
    console.error(`❌ getPropertiesByCategory error: ${category}`, err.response?.data || err.message);
    return [];
  }
};

export const getPropertyById = async (id) => {
  if (!id) throw new Error("Property ID is required");
  try {
    const res = await API.get(`/api/property/${id}`);
    return res.data;
  } catch (err) {
    console.error(`❌ getPropertyById error: ${id}`, err.response?.data || err.message);
    return null;
  }
};

export const getMyProperties = async () => {
  try {
    const res = await API.get("/api/my-properties");
    return res.data || { properties: [] };
  } catch (err) {
    console.error("❌ getMyProperties error:", err.response?.data || err.message);
    return { properties: [] };
  }
};

export const updateProperty = async (id, formData) => {
  if (!id) throw new Error("Property ID is required");
  try {
    const res = await API.put(`/api/property/${id}`, formData);
    return res.data;
  } catch (err) {
    console.error(`❌ updateProperty error: ${id}`, err.response?.data || err.message);
    throw err;
  }
};

export const deleteProperty = async (id) => {
  if (!id) throw new Error("Property ID is required");
  try {
    const res = await API.delete(`/api/property/${id}`);
    return res.data;
  } catch (err) {
    console.error(`❌ deleteProperty error: ${id}`, err.response?.data || err.message);
    return null;
  }
};
// chat

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please login.");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Get or create chat for a property
export const getChatByPropertyId = async (propertyId) => {
  const res = await fetch(`${BACKEND_URL}/api/chat/property/${propertyId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("getChatByPropertyId failed:", text);
    throw new Error("Failed to get chat");
  }
  const data = await res.json();
  return {
    chatId: data.chat_id,
    propertyId: data.property_id,
    ownerId: data.owner,
    buyerId: data.buyer,
    messages: data.messages || [],
  };
};

// Send a message to a chat
export const sendMessage = async (chatId, text) => {
  const res = await fetch(`${BACKEND_URL}/api/chat/${chatId}/send`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const textErr = await res.text();
    console.error("sendMessage failed:", textErr);
    throw new Error("Failed to send message");
  }
  return res.json();
};

// Owner inbox (for properties they own)
export const getOwnerInbox = async () => {
  const res = await fetch(`${BACKEND_URL}/api/chat/inbox`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const textErr = await res.text();
    console.error("getOwnerInbox failed:", textErr);
    throw new Error("Failed to fetch owner inbox");
  }
  const data = await res.json();
  return data.map((chat) => ({
    chatId: chat.chat_id,
    propertyId: chat.property_id,
    buyerId: chat.buyer,
    lastMessage: chat.last_message,
    unreadCount: chat.unread_count,
  }));
};

// Buyer inbox (for properties they bought or messaged)
export const getBuyerInbox = async () => {
  const res = await fetch(`${BACKEND_URL}/api/chat/buyer-inbox`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const textErr = await res.text();
    console.error("getBuyerInbox failed:", textErr);
    throw new Error("Failed to fetch buyer inbox");
  }
  const data = await res.json();
  return data.map((chat) => ({
    chatId: chat.chat_id,
    propertyId: chat.property_id,
    ownerId: chat.owner,
    lastMessage: chat.last_message,
    unreadCount: chat.unread_count,
  }));
};

// Get messages for a specific chat
export const fetchChatMessages = async (chatId) => {
  const res = await fetch(`${BACKEND_URL}/api/chat/${chatId}/messages`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const textErr = await res.text();
    console.error("fetchChatMessages failed:", textErr);
    throw new Error("Failed to fetch chat messages");
  }
  const data = await res.json();
  return data.messages || [];
};



// -------------------- Cart --------------------
export const getCart = async () => {
  try {
    const res = await API.get("/api/cart");
    return res.data.items || [];   // ✅ always return array
  } catch (err) {
    console.error("❌ getCart error:", err.response?.data || err.message);
    return [];
  }
};


export const addToCart = async (propertyId) => {
  if (!propertyId) throw new Error("Property ID is required");
  try {
    const res = await API.post(`/api/cart/${propertyId}`);
    return res.data;
  } catch (err) {
    console.error(`❌ addToCart error: ${propertyId}`, err.response?.data || err.message);
    return null;
  }
};

export const removeFromCart = async (propertyId) => {
  if (!propertyId) throw new Error("Property ID is required");
  try {
    const res = await API.delete(`/api/cart/${propertyId}`);
    return res.data;
  } catch (err) {
    console.error(`❌ removeFromCart error: ${propertyId}`, err.response?.data || err.message);
    return null;
  }
};
