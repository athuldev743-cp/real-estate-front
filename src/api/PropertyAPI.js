const BASE_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://back-end-lybr.onrender.com");

console.log("🌍 API Base URL:", BASE_URL);


// -------------------- Auth --------------------
export const loginUser = async (data) => {
  if (!data.email || !data.password) throw new Error("Email and password are required");
  try {
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
  } catch (err) {
    console.error("❌ loginUser error:", err);
    throw err;
  }
};

export const registerUser = async (data) => {
  if (!data.fullName || !data.email || !data.password)
    throw new Error("Full name, email, and password are required");
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.detail || "Registration failed");
    return result;
  } catch (err) {
    console.error("❌ registerUser error:", err);
    throw err;
  }
};
// -------------------- Verify OTP --------------------
export const verifyOTP = async ({ email, otp }) => {
  if (!email || !otp) throw new Error("Email and OTP are required");
  try {
    const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.detail || "OTP verification failed");

    localStorage.setItem("token", result.access_token);
    localStorage.setItem("refresh_token", result.refresh_token);
    localStorage.setItem("fullName", result.fullName);
    localStorage.setItem("email", result.email);
    localStorage.setItem("phone", result.phone);
    return result;
  } catch (err) {
    console.error("❌ verifyOTP error:", err);
    throw err;
  }
};


// -------------------- Token Refresh --------------------
const refreshAccessToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) throw new Error("No refresh token available");

  try {
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
  } catch (err) {
    console.error("❌ refreshAccessToken error:", err);
    localStorage.clear();
    throw new Error("Session expired. Please login again.");
  }
};

// -------------------- Authenticated Fetch --------------------
const authFetch = async (url, options = {}) => {
  let token = localStorage.getItem("token");

  const defaultHeaders = {};
  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }
  options.headers = {
    ...defaultHeaders,
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  try {
    let res = await fetch(url, options);

    if (res.status === 401) {
      token = await refreshAccessToken();
      options.headers.Authorization = `Bearer ${token}`;
      res = await fetch(url, options);
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error(`❌ API Error [${res.status}] ${url}`, data);
      throw new Error(data.detail || `Request failed with ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`❌ Network/API error on ${url}:`, err);
    throw new Error("Network error or server unreachable");
  }
};

// -------------------- User --------------------
export const getCurrentUser = async () => {
  try {
    return await authFetch(`${BASE_URL}/auth/me`, { method: "GET" });
  } catch (err) {
    console.error("❌ getCurrentUser error:", err);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    return null;
  }
};

// -------------------- Properties --------------------
export const addProperty = async (formData) =>
  authFetch(`${BASE_URL}/api/add-property`, { method: "POST", body: formData });

export const getProperties = async (searchQuery = "") => {
  try {
    const url = searchQuery
      ? `${BASE_URL}/api/properties?search=${encodeURIComponent(searchQuery)}`
      : `${BASE_URL}/api/properties`;
    return await authFetch(url);
  } catch {
    return [];
  }
};

const VALID_CATEGORIES = ["house", "villa", "apartment", "farmlands", "plots", "buildings"];

export const getPropertiesByCategory = async (category, searchQuery = "") => {
  if (!category) throw new Error("Category is required");

  if (!VALID_CATEGORIES.includes(category.toLowerCase())) {
    console.error(`❌ Invalid category requested: ${category}`);
    throw new Error(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`);
  }

  try {
    const url = `${BASE_URL}/api/category/${encodeURIComponent(category.toLowerCase())}${
      searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""
    }`;
    return await authFetch(url);
  } catch (err) {
    console.error(`❌ Failed to fetch properties for category ${category}:`, err);
    throw err;
  }
};





export const getPropertyById = async (id) => {
  if (!id) throw new Error("Property ID is required");
  try {
    return await authFetch(`${BASE_URL}/api/property/${id}`);
  } catch {
    return null;
  }
};

export const getMyProperties = async () => {
  try {
    return await authFetch(`${BASE_URL}/api/my-properties`);
  } catch {
    return [];
  }
};

// -------------------- Chat (REST only) --------------------
export const getMessages = async (propertyId) => {
  if (!propertyId) throw new Error("Property ID is required");
  try {
    return await authFetch(`${BASE_URL}/chat/property/${propertyId}`);
  } catch {
    return { chatId: null, messages: [] };
  }
};

export const sendMessage = async (chatId, text) => {
  if (!chatId || !text) throw new Error("Chat ID and message text are required");
  try {
    return await authFetch(`${BASE_URL}/chat/${chatId}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch {
    return null;
  }
};

export const getOwnerInbox = async () => {
  try {
    return await authFetch(`${BASE_URL}/chat/inbox`);
  } catch {
    return [];
  }
};

export const getOwnerChatMessages = async (chatId) => {
  if (!chatId) throw new Error("Chat ID is required");
  try {
    return await authFetch(`${BASE_URL}/chat/${chatId}/messages`);
  } catch {
    return [];
  }
};

// -------------------- Delete --------------------
export const deleteProperty = async (id) => {
  if (!id) throw new Error("Property ID is required");
  try {
    return await authFetch(`${BASE_URL}/api/property/${id}`, { method: "DELETE" });
  } catch {
    return null;
  }
};

// -------------------- Cart --------------------
export const getCart = async () => {
  try {
    return await authFetch(`${BASE_URL}/api/cart`);
  } catch {
    return [];
  }
};

export const addToCart = async (propertyId) => {
  if (!propertyId) throw new Error("Property ID is required");
  try {
    return await authFetch(`${BASE_URL}/api/cart/${propertyId}`, { method: "POST" });
  } catch {
    return null;
  }
};

export const removeFromCart = async (propertyId) => {
  if (!propertyId) throw new Error("Property ID is required");
  try {
    return await authFetch(`${BASE_URL}/api/cart/${propertyId}`, { method: "DELETE" });
  } catch {
    return null;
  }
};
