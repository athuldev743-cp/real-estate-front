// -------------------- Base URL --------------------
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://back-end-lybr.onrender.com");

console.log("🌍 API Base URL:", BASE_URL);

// -------------------- Token Helpers --------------------
const getAccessToken = () => localStorage.getItem("token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

const saveTokens = ({ access_token, refresh_token }) => {
  if (access_token) localStorage.setItem("token", access_token);
  if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
};

const clearTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("fullName");
  localStorage.removeItem("email");
  localStorage.removeItem("phone");
};

// -------------------- Fetch Wrapper with Auto Refresh --------------------
const authFetch = async (url, options = {}, retry = true) => {
  const token = getAccessToken();
  if (!token) throw new Error("Authentication required");

  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  let res = await fetch(url, options);

  if (res.status === 401 && retry) {
    // try refreshing token
    const refresh_token = getRefreshToken();
    if (!refresh_token) {
      clearTokens();
      throw new Error("Session expired. Please login again.");
    }

    const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    });

    if (!refreshRes.ok) {
      clearTokens();
      throw new Error("Session expired. Please login again.");
    }

    const refreshData = await refreshRes.json();
    saveTokens({
      access_token: refreshData.access_token,
      refresh_token: refreshData.refresh_token,
    });

    // retry original request
    return authFetch(url, options, false);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json();
};

// -------------------- Auth --------------------
export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Registration failed");
  return result;
};

export const verifyOTP = async ({ email, otp }) => {
  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "OTP verification failed");

  saveTokens({ access_token: result.access_token, refresh_token: result.refresh_token });
  localStorage.setItem("fullName", result.fullName);
  localStorage.setItem("email", result.email);
  localStorage.setItem("phone", result.phone);

  return result;
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Login failed");

  saveTokens({ access_token: result.access_token, refresh_token: result.refresh_token });
  localStorage.setItem("fullName", result.fullName);
  localStorage.setItem("email", result.email);
  localStorage.setItem("phone", result.phone);

  return result;
};

export const logoutUser = async () => {
  try {
    await authFetch(`${BASE_URL}/auth/logout`, { method: "POST" });
  } catch (err) {
    console.warn("Logout error:", err.message);
  } finally {
    clearTokens();
  }
};

export const getCurrentUser = async () => {
  try {
    return await authFetch(`${BASE_URL}/auth/me`);
  } catch (err) {
    console.error("getCurrentUser error:", err.message);
    return null;
  }
};

// -------------------- Properties --------------------
export const addProperty = async (formData) => authFetch(`${BASE_URL}/api/add-property`, { method: "POST", body: formData });
export const getProperties = async (searchQuery = "") => {
  const url = searchQuery ? `${BASE_URL}/api/properties?search=${encodeURIComponent(searchQuery)}` : `${BASE_URL}/api/properties`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch properties");
  return res.json();
};
export const getPropertiesByCategory = async (category, searchQuery = "") => {
  if (!category) throw new Error("Category is required");
  const url = `${BASE_URL}/api/category/${encodeURIComponent(category.toLowerCase())}${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch properties for ${category}`);
  return res.json();
};
export const getPropertyById = async (id) => {
  if (!id) throw new Error("Property ID is required");
  const res = await fetch(`${BASE_URL}/api/property/${id}`);
  if (!res.ok) throw new Error("Failed to fetch property");
  return res.json();
};
export const getMyProperties = async () => authFetch(`${BASE_URL}/api/my-properties`);

// -------------------- Chat --------------------
export const getMessages = async (propertyId) => {
  if (!propertyId) throw new Error("Property ID is required");
  return authFetch(`${BASE_URL}/chat/property/${propertyId}`);
};
export const sendMessage = async (chatId, text) => {
  if (!chatId || !text) throw new Error("Chat ID and message text are required");
  return authFetch(`${BASE_URL}/chat/${chatId}/send`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
};
export const getOwnerInbox = async () => authFetch(`${BASE_URL}/chat/inbox`);
export const getOwnerChatMessages = async (chatId) => {
  if (!chatId) throw new Error("Chat ID is required");
  return authFetch(`${BASE_URL}/chat/${chatId}/messages`);
};

// -------------------- Notifications --------------------
export const getNotifications = async () => authFetch(`${BASE_URL}/chat/notifications`);
export const markMessagesAsRead = async (chatId) => authFetch(`${BASE_URL}/chat/mark-read/${chatId}`, { method: "POST" });
