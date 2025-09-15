// PropertyAPI.js
// -------------------- Base URL --------------------
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://back-end-lybr.onrender.com");

console.log("🌍 API Base URL:", BASE_URL);

// -------------------- Auth --------------------

// Login user
export const loginUser = async (data) => {
  if (!data.email || !data.password) throw new Error("Email and password are required");

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.detail || "Login failed");

  localStorage.setItem("token", result.access_token);
  localStorage.setItem("refresh_token", result.refresh_token);
  localStorage.setItem("fullName", result.fullName);
  localStorage.setItem("email", result.email);
  localStorage.setItem("phone", result.phone);

  return result;
};

// Register user
export const registerUser = async (data) => {
  if (!data.fullName || !data.email || !data.password)
    throw new Error("Full name, email, and password are required");

  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.detail || "Registration failed");

  return result;
};

// Verify OTP
export const verifyOTP = async ({ email, otp }) => {
  if (!email || !otp) throw new Error("Email and OTP are required");

  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.detail || "OTP verification failed");

  // Save tokens and user info
  localStorage.setItem("token", result.access_token);
  localStorage.setItem("refresh_token", result.refresh_token);
  localStorage.setItem("fullName", result.fullName);
  localStorage.setItem("email", result.email);
  localStorage.setItem("phone", result.phone);

  return result;
};

// -------------------- Token Refresh --------------------
const refreshAccessToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) throw new Error("No refresh token available");

  const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    localStorage.clear();
    throw new Error(result.detail || "Refresh token failed");
  }

  localStorage.setItem("token", result.access_token);
  localStorage.setItem("refresh_token", result.refresh_token);
  localStorage.setItem("fullName", result.fullName);
  localStorage.setItem("email", result.email);
  localStorage.setItem("phone", result.phone);

  return result.access_token;
};

// -------------------- Authenticated Fetch --------------------
const authFetch = async (url, options = {}) => {
  let token = localStorage.getItem("token");
  if (!options.headers) options.headers = {};
  options.headers.Authorization = `Bearer ${token}`;

  let res = await fetch(url, options);

  // If token expired, try refreshing
  if (res.status === 401) {
    try {
      token = await refreshAccessToken();
      options.headers.Authorization = `Bearer ${token}`;
      res = await fetch(url, options);
    } catch (err) {
      throw new Error("Session expired. Please login again.");
    }
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Request failed");
  return data;
};

// -------------------- User --------------------
export const getCurrentUser = async () => {
  try {
    return await authFetch(`${BASE_URL}/auth/me`);
  } catch (err) {
    console.error("getCurrentUser error:", err.message);
    return null;
  }
};

// -------------------- Properties --------------------
// -------------------- Properties --------------------

// Add a new property
export const addProperty = async (formData) =>
  authFetch(`${BASE_URL}/api/add-property`, {
    method: "POST",
    headers: {}, // leave empty for FormData
    body: formData,
  });

// Get all properties (with optional search)
export const getProperties = async (searchQuery = "") => {
  const url = searchQuery
    ? `${BASE_URL}/api/properties?search=${encodeURIComponent(searchQuery)}`
    : `${BASE_URL}/api/properties`;
  return authFetch(url);
};

// Get properties by category (with optional search)
export const getPropertiesByCategory = async (category, searchQuery = "") => {
  if (!category) throw new Error("Category is required");
  const url = `${BASE_URL}/api/category/${encodeURIComponent(category.toLowerCase())}${
    searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""
  }`;
  return authFetch(url);
};

// Get single property by ID
export const getPropertyById = async (id) => {
  if (!id) throw new Error("Property ID is required");
  return authFetch(`${BASE_URL}/api/property/${id}`);
};

// Get properties owned by current user
export const getMyProperties = async () => authFetch(`${BASE_URL}/api/my-properties`);

// -------------------- Chat --------------------
export const getMessages = async (propertyId) => {
  if (!propertyId) throw new Error("Property ID is required");
  return authFetch(`${BASE_URL}/chat/property/${propertyId}`);
};

export const sendMessage = async (chatId, text) => {
  if (!chatId || !text) throw new Error("Chat ID and message text are required");
  return authFetch(`${BASE_URL}/chat/${chatId}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
};

export const getOwnerInbox = async () => authFetch(`${BASE_URL}/chat/inbox`);
export const getOwnerChatMessages = async (chatId) => {
  if (!chatId) throw new Error("Chat ID is required");
  return authFetch(`${BASE_URL}/chat/${chatId}/messages`);
};

// -------------------- Notifications --------------------
export const getNotifications = async () => authFetch(`${BASE_URL}/chat/notifications`);
export const markMessagesAsRead = async (chatId) => {
  if (!chatId) throw new Error("Chat ID is required");
  return authFetch(`${BASE_URL}/chat/mark-read/${chatId}`, { method: "POST" });
};
