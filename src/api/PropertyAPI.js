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
  return await res.json();
};

// Register user (Step 1: sends email & password, backend sends OTP)
export const registerUser = async (data) => {
  if (!data.email || !data.password) throw new Error("Email and password are required");

  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Registration failed");
  }
  return await res.json();
};

// Verify OTP (Step 2)
export const verifyOTP = async (data) => {
  if (!data.email || !data.otp) throw new Error("Email and OTP are required");

  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "OTP verification failed");
  }
  return await res.json();
};

// Get current logged-in user
export const getCurrentUser = async (token) => {
  if (!token) throw new Error("No token provided");

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

// Add a property (requires login)
export const addProperty = async (formData, token) => {
  if (!token) throw new Error("Authentication required");
  if (!formData) throw new Error("No property data provided");

  const res = await fetch(`${BASE_URL}/api/add-property`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }, // don't set content-type for FormData
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to add property");
  }
  return await res.json();
};

// Get all properties (optional search)
export const getProperties = async (searchQuery = "") => {
  const url = searchQuery
    ? `${BASE_URL}/api/properties?search=${encodeURIComponent(searchQuery)}`
    : `${BASE_URL}/api/properties`;

  const res = await fetch(url);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to fetch properties");
  }
  return await res.json();
};

// Get properties by category
export const getPropertiesByCategory = async (category, searchQuery = "") => {
  if (!category) throw new Error("Category is required");

  const url = `${BASE_URL}/api/category/${encodeURIComponent(category.toLowerCase())}${
    searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""
  }`;

  const res = await fetch(url);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Failed to fetch properties for ${category}`);
  }
  return await res.json();
};

// Get single property by ID
export const getPropertyById = async (id) => {
  if (!id) throw new Error("Property ID is required");

  const res = await fetch(`${BASE_URL}/api/property/${id}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to fetch property");
  }
  return await res.json();
};

// Get current user's properties
export const getMyProperties = async (token) => {
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${BASE_URL}/api/my-properties`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to fetch user properties");
  }
  return await res.json();
};
