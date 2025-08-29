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

  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.detail || "Login failed");

  localStorage.setItem("token", result.access_token);
  localStorage.setItem("fullName", result.fullName);
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

  return result; // { message }
};

// Verify OTP and auto-login
export const verifyOTP = async ({ email, otp }) => {
  if (!email || !otp) throw new Error("Email and OTP are required");

  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.detail || "OTP verification failed");

  localStorage.setItem("token", result.access_token || result.token);
  localStorage.setItem("fullName", result.fullName);
  return result;
};

// -------------------- Get current logged-in user --------------------
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
      console.error("getCurrentUser fetch failed:", text);
      throw new Error(text || "Failed to fetch user data");
    }

    const data = await res.json().catch(() => ({}));
    return data;
  } catch (err) {
    console.error("getCurrentUser error:", err.message);
    return null;
  }
};

// -------------------- Properties --------------------

// Add property
export const addProperty = async (formData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${BASE_URL}/api/add-property`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }, // Do NOT set Content-Type for FormData
    body: formData,
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.detail || "Failed to add property");
  return result;
};

// Get all properties
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

// Get or create chat for a property
export const getMessages = async (propertyId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");
  if (!propertyId) throw new Error("Property ID is required");

  // This endpoint should return { chatId, messages: [...] }
  const res = await fetch(`${BASE_URL}/chat/property/${propertyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Failed to fetch messages:", errorText);
    throw new Error("Failed to fetch messages");
  }

  const result = await res.json();
  // { chatId, messages }
  return result;
};

// Send a chat message
export const sendMessage = async (chatId, text) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");
  if (!chatId || !text) throw new Error("Chat ID and message text are required");

  const res = await fetch(`${BASE_URL}/chat/${chatId}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Failed to send message:", errorText);
    throw new Error("Failed to send message");
  }

  return await res.json(); // { status: "ok", message: {...} }
};

// -------------------- Owner Inbox --------------------

// Get all chats for owner (inbox)
export const getOwnerInbox = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${BASE_URL}/chat/inbox`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch inbox");
  return await res.json();
};

// Get all messages of a specific chat
export const getOwnerChatMessages = async (chatId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");
  if (!chatId) throw new Error("Chat ID is required");

  const res = await fetch(`${BASE_URL}/chat/${chatId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch chat messages");
  return await res.json(); // { messages: [...] }
};

// -------------------- Notifications --------------------

// Get unread notifications
export const getNotifications = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${BASE_URL}/chat/notifications`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Notification fetch error:", errorText);
    throw new Error("Failed to fetch notifications");
  }

  return await res.json(); // { notifications: [...] }
};

// Mark chat messages as read
export const markMessagesAsRead = async (chatId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${BASE_URL}/chat/mark-read/${chatId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Mark read error:", errorText);
    throw new Error("Failed to mark messages as read");
  }

  return await res.json(); // { status: "ok" }
};
