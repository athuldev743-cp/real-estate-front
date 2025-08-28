const BASE_URL = process.env.REACT_APP_API_URL;

// -------------------- Auth --------------------

// Login user
export const loginUser = async (data) => {
  if (!data.email || !data.password) throw new Error("Email and password are required");

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Login failed");
  }

  const result = await res.json();
  localStorage.setItem("token", result.access_token);
  localStorage.setItem("fullName", result.fullName);
  return result;
};

// Register user (Step 1)
export const registerUser = async (data) => {
  if (!data.fullName || !data.email || !data.password) 
    throw new Error("Full name, email, and password are required");

  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Registration failed");
  }

  return await res.json(); // { message }
};

// Verify OTP and auto-login
export const verifyOTP = async ({ email, otp }) => {
  if (!email || !otp) throw new Error("Email and OTP are required");

  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "OTP verification failed");
  }

  const result = await res.json();
  localStorage.setItem("token", result.token);
  localStorage.setItem("fullName", result.fullName);
  return result;
};

// Get current user (requires token)
export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to fetch user");
  }
  return await res.json();
};

// -------------------- Properties --------------------

// Add property (FormData, requires login)
export const addProperty = async (formData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${BASE_URL}/api/add-property`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }, // no content-type for FormData
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to add property");
  }
  return await res.json();
};

// Get all properties (with optional search)
export const getProperties = async (searchQuery = "") => {
  const url = searchQuery
    ? `${BASE_URL}/api/properties?search=${encodeURIComponent(searchQuery)}`
    : `${BASE_URL}/api/properties`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch properties");
  return await res.json();
};

// Get properties by category
export const getPropertiesByCategory = async (category, searchQuery = "") => {
  if (!category) throw new Error("Category is required");

  const url = `${BASE_URL}/api/category/${encodeURIComponent(category.toLowerCase())}${
    searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""
  }`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch properties for ${category}`);
  return await res.json();
};

// Get single property by ID
export const getPropertyById = async (id) => {
  if (!id) throw new Error("Property ID is required");

  const res = await fetch(`${BASE_URL}/api/property/${id}`);
  if (!res.ok) throw new Error("Failed to fetch property");
  return await res.json();
};

// Get logged-in user's properties
export const getMyProperties = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${BASE_URL}/api/my-properties`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch your properties");
  return await res.json();
};

// -------------------- Chat --------------------

// Send a chat message (backup REST method)
export const sendMessage = async (propertyId, message) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");
  if (!propertyId || !message) throw new Error("Property ID and message are required");

  const res = await fetch(`${BASE_URL}/api/chat/${propertyId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) throw new Error("Failed to send message");
  return await res.json();
};

// Get chat messages (backup REST method)
export const getMessages = async (propertyId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");
  if (!propertyId) throw new Error("Property ID is required");

  const res = await fetch(`${BASE_URL}/api/chat/${propertyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch messages");
  return await res.json();
};

// -------------------- Notifications --------------------

// Get unread notifications for logged-in user
export const getNotifications = async (token) => {
  const res = await fetch(`${BASE_URL}/user/notifications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Notification fetch error response:", errorText);
    throw new Error("Failed to fetch notifications");
  }

  return await res.json();
};
