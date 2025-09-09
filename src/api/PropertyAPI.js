// -------------------- Base URL --------------------
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:8000" // fallback for dev
    : "https://back-end-lybr.onrender.com"); // fallback for prod

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
  localStorage.setItem("fullName", result.fullName);
  localStorage.setItem("email", result.email);

  return result;
};

// Register User
export const registerUser = async (data) => {
  if (!data.fullName || !data.email || !data.password) {
    throw new Error("Full name, email, and password are required");
  }

  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(result.detail || "Registration failed");
  }

  return result;
};

// Verify OTP
export const verifyOTP = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(result.detail || "OTP verification failed");
  }

  // Store token and user info
  localStorage.setItem("token", result.access_token || result.token);
  localStorage.setItem("fullName", result.fullName);
  localStorage.setItem("email", result.email);
  localStorage.setItem("phone", result.phone);

  return result;
};

// -------------------- User --------------------
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please log in.");

    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to fetch user data");
    }

    return await res.json();
  } catch (err) {
    console.error("getCurrentUser error:", err.message);
    return null;
  }
};

// -------------------- Properties --------------------
export const addProperty = async (formData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${BASE_URL}/api/add-property`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }, // don't set Content-Type for FormData
    body: formData,
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.detail || "Failed to add property");
  return result;
};

export const getProperties = async (searchQuery = "") => {
  const url = searchQuery
    ? `${BASE_URL}/api/properties?search=${encodeURIComponent(searchQuery)}`
    : `${BASE_URL}/api/properties`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch properties");
  return await res.json();
};

export const getPropertiesByCategory = async (category, searchQuery = "") => {
  if (!category) throw new Error("Category is required");

  const url = `${BASE_URL}/api/category/${encodeURIComponent(category.toLowerCase())}${
    searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""
  }`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch properties for ${category}`);
  return await res.json();
};

export const getPropertyById = async (id) => {
  if (!id) throw new Error("Property ID is required");

  const res = await fetch(`${BASE_URL}/api/property/${id}`);
  if (!res.ok) throw new Error("Failed to fetch property");
  return await res.json();
};

export const getMyProperties = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${BASE_URL}/api/my-properties`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch your properties");
  return await res.json();
};

// -------------------- Chat Helpers --------------------
const handleAuthFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");

  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.clear();
      throw new Error("Unauthorized. Please login again.");
    }
    const errorText = await res.text();
    throw new Error(errorText || "Request failed");
  }

  return await res.json();
};

export const getMessages = async (propertyId) => {
  if (!propertyId) throw new Error("Property ID is required");

  const data = await handleAuthFetch(`${BASE_URL}/chat/property/${propertyId}`);
  return { chatId: data.chatId, messages: data.messages || [] };
};

export const sendMessage = async (chatId, text) => {
  if (!chatId || !text) throw new Error("Chat ID and message text are required");
  return handleAuthFetch(`${BASE_URL}/chat/${chatId}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
};

export const getOwnerInbox = async () => handleAuthFetch(`${BASE_URL}/chat/inbox`);

export const getOwnerChatMessages = async (chatId) => {
  if (!chatId) throw new Error("Chat ID is required");
  return handleAuthFetch(`${BASE_URL}/chat/${chatId}/messages`);
};

// -------------------- Notifications --------------------
export const getNotifications = async () => handleAuthFetch(`${BASE_URL}/chat/notifications`);

export const markMessagesAsRead = async (chatId) => {
  if (!chatId) throw new Error("Chat ID is required");
  return handleAuthFetch(`${BASE_URL}/chat/mark-read/${chatId}`, { method: "POST" });
};
