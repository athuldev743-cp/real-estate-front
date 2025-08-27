const BASE_URL = process.env.REACT_APP_API_URL;

// -------------------- Auth --------------------

// Login user
export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Login failed");
  return result;
};

// Register user (Step 1: sends email & password, backend sends OTP)
export const registerUser = async (data) => {
  if (!data.email || !data.password) throw new Error("Email and password are required");

  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Registration failed");
  return result; // usually contains message about OTP sent
};

// Verify OTP (Step 2: user enters OTP)
export const verifyOTP = async (data) => {
  if (!data.email || !data.otp) throw new Error("Email and OTP are required");

  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "OTP verification failed");
  return result; // usually contains message about success
};

// Get current logged-in user
export const getCurrentUser = async (token) => {
  if (!token) throw new Error("No token provided");
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Failed to fetch user");
  return result;
};

// -------------------- Properties --------------------

// Add a property (only for logged-in users)
export const addProperty = async (formData, token) => {
  if (!token) throw new Error("Authentication required");
  if (!formData) throw new Error("No property data provided");

  const res = await fetch(`${BASE_URL}/api/add-property`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Failed to add property");
  return result;
};

// Get all properties (optional search query)
export const getProperties = async (searchQuery = "") => {
  const url = searchQuery
    ? `${BASE_URL}/api/properties?search=${encodeURIComponent(searchQuery)}`
    : `${BASE_URL}/api/properties`;
  const res = await fetch(url);
  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || `Failed to fetch properties`);
  return result;
};

// Get properties by category (optional search query)
export const getPropertiesByCategory = async (category, searchQuery = "") => {
  if (!category) throw new Error("Category is required");
  const backendCategory = category.toLowerCase();
  const url = `${BASE_URL}/api/category/${encodeURIComponent(
    backendCategory
  )}${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`;
  const res = await fetch(url);
  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || `Failed to fetch properties for ${category}`);
  return result;
};

// Get a single property by ID
export const getPropertyById = async (id) => {
  if (!id) throw new Error("Property ID is required");
  const res = await fetch(`${BASE_URL}/api/property/${id}`);
  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Failed to fetch property");
  return result;
};

// Get current user's properties
export const getMyProperties = async (token) => {
  if (!token) throw new Error("Authentication required");
  const res = await fetch(`${BASE_URL}/api/my-properties`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Failed to fetch user properties");
  return result;
};
