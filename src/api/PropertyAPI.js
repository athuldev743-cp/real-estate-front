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

// ---------------- Add Property ----------------
const handleAddProperty = async (e) => {
  e.preventDefault();

  // ---------------- Validation ----------------
  if (!selectedLocation) {
    alert("Please add a location before submitting property!");
    return;
  }
  if (!category) {
    alert("Please select a category!");
    return;
  }

  try {
    // Create FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("mobileNO", phone); // matches backend
    formData.append("category", category);
    formData.append("latitude", selectedLocation.lat);  // matches backend
    formData.append("longitude", selectedLocation.lon); // matches backend

    // Call API
    const res = await addProperty(formData);
    console.log("✅ Property added:", res);
    alert("🏡 Property added successfully!");

    // ---------------- Reset form ----------------
    setTitle("");
    setDescription("");
    setPrice("");
    setPhone(user?.phone || "");
    setCategory("");
    setSearchedLocation(null);
    setSelectedLocation(null);
    setSearch("");
    setSearchResults([]);
    setSelectedIndex(null);

  } catch (err) {
    console.error("❌ Error saving property:", err);
    alert("Failed to save property. Please try again later.");
  }
};

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
