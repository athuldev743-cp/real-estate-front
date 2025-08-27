const BASE_URL = process.env.REACT_APP_API_URL;

// -------------------- Auth --------------------

// Login user
export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

// Register user (Step 1: sends email & password, backend sends OTP)
export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.detail || "Registration failed");
  }
  return result;
};

// Verify OTP (Step 2: user enters OTP)
export const verifyOTP = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.detail || "OTP verification failed");
  }
  return result;
};

// Get current logged-in user
export const getCurrentUser = async (token) => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
};

// -------------------- Properties --------------------

// Add a property (only for logged-in users)
export const addProperty = async (formData, token) => {
  const res = await fetch(`${BASE_URL}/api/add-property`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  return await res.json();
};

// Get all properties (optional search query)
export const getProperties = async (searchQuery = "") => {
  const url = searchQuery
    ? `${BASE_URL}/api/properties?search=${encodeURIComponent(searchQuery)}`
    : `${BASE_URL}/api/properties`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch properties: ${res.status}`);
  return await res.json();
};

// Get properties by category (optional search query)
export const getPropertiesByCategory = async (category, searchQuery = "") => {
  const backendCategory = category.toLowerCase();
  const url = `${BASE_URL}/api/category/${encodeURIComponent(
    backendCategory
  )}${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch properties: ${res.status}`);
  return await res.json();
};

// Get a single property by ID
export const getPropertyById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/property/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch property: ${res.status}`);
  return await res.json();
};

// Get current user's properties
export const getMyProperties = async (token) => {
  const res = await fetch(`${BASE_URL}/api/my-properties`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
};
