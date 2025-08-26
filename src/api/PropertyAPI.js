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

// Register user
export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
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
  const res = await fetch(`${BASE_URL}/add-property`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData, // FormData automatically sets multipart/form-data
  });
  return await res.json();
};

// Get all properties (optional search query)
export const getProperties = async (searchQuery = "") => {
  const url = searchQuery
    ? `${BASE_URL}/properties?search=${encodeURIComponent(searchQuery)}`
    : `${BASE_URL}/properties`;
  const res = await fetch(url);
  return await res.json();
};

// Get properties by category (optional search query)
export const getPropertiesByCategory = async (category, searchQuery = "") => {
  const url = `${BASE_URL}/category/${encodeURIComponent(category)}${
    searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""
  }`;
  const res = await fetch(url);
  return await res.json();
};

// Get a single property by ID
export const getPropertyById = async (id) => {
  const res = await fetch(`${BASE_URL}/property/${id}`);
  if (!res.ok) throw new Error("Failed to fetch property");
  return await res.json();
};

// Get current user's properties
export const getMyProperties = async (token) => {
  const res = await fetch(`${BASE_URL}/my-properties`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
};
