// PropertyAPI.js
import API from "./axios";

const VALID_CATEGORIES = ["house", "villa", "apartment", "farmlands", "plots", "buildings"];

// -------------------- Auth --------------------
export const loginUser = async (data) => {
  if (!data.email || !data.password) throw new Error("Email and password are required");
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
  if (!data.fullName || !data.email || !data.password)
    throw new Error("Full name, email, and password are required");
  try {
    const res = await API.post("/auth/register", data);
    return res.data;
  } catch (err) {
    console.error("❌ registerUser error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.detail || "Registration failed");
  }
};

export const verifyOTP = async ({ email, otp }) => {
  if (!email || !otp) throw new Error("Email and OTP are required");
  try {
    const res = await API.post("/auth/verify-otp", { email, otp });
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
export const addProperty = async (formData) => {
  try {
    const res = await API.post("/api/add-property", formData);
    return res.data;
  } catch (err) {
    console.error("❌ addProperty error:", err.response?.data || err.message);
    throw err;
  }
};

export const getProperties = async (searchQuery = "") => {
  try {
    const res = await API.get("/api/properties", { params: searchQuery ? { search: searchQuery } : {} });
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
    return res.data.properties || [];
  } catch (err) {
    console.error("❌ getMyProperties error:", err.response?.data || err.message);
    return [];
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

// -------------------- Chat --------------------
export const getMessages = async (propertyId) => {
  if (!propertyId) throw new Error("Property ID is required");
  try {
    const res = await API.get(`/chat/property/${propertyId}`);
    return res.data;
  } catch (err) {
    console.error(`❌ getMessages error: ${propertyId}`, err.response?.data || err.message);
    return { chatId: null, messages: [] };
  }
};

export const sendMessage = async (chatId, text) => {
  if (!chatId || !text) throw new Error("Chat ID and message text are required");
  try {
    const res = await API.post(`/chat/${chatId}/send`, { text });
    return res.data;
  } catch (err) {
    console.error(`❌ sendMessage error: ${chatId}`, err.response?.data || err.message);
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
  if (!chatId) throw new Error("Chat ID is required");
  try {
    const res = await API.get(`/chat/${chatId}/messages`);
    return res.data.messages || [];
  } catch (err) {
    console.error(`❌ getOwnerChatMessages error: ${chatId}`, err.response?.data || err.message);
    return [];
  }
};

// -------------------- Cart --------------------
export const getCart = async () => {
  try {
    const res = await API.get("/api/cart");
    return res.data || [];
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
