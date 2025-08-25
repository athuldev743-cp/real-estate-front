// src/api/PropertyAPI.js
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

// Get current logged-in user (optional)
export const getCurrentUser = async (token) => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
};

// -------------------- Properties --------------------

// Add a property (requires FormData for image upload)
export const addProperty = async (formData, token) => {
  const res = await fetch(`${BASE_URL}/api/add-property`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  return await res.json();
};

// Get all properties (optionally add search)
export const getProperties = async (searchQuery = "") => {
  const url = searchQuery
    ? `${BASE_URL}/api/properties?search=${encodeURIComponent(searchQuery)}`
    : `${BASE_URL}/api/properties`;
  const res = await fetch(url);
  return await res.json();
};

// Get properties by category
export const getPropertiesByCategory = async (category) => {
  const url = `${BASE_URL}/api/properties?category=${encodeURIComponent(category)}`;
  const res = await fetch(url);
  return await res.json();
};

// Get properties of the current logged-in user
export const getMyProperties = async (token) => {
  const res = await fetch(`${BASE_URL}/api/my-properties`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
};
