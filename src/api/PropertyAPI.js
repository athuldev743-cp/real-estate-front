// src/api/PropertyAPI.js
const BASE_URL = process.env.REACT_APP_API_URL;

// -------------------- Auth --------------------

// Login user
export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

// Register user
export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

// Get current logged-in user
export const getCurrentUser = async (token) => {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
};

// -------------------- Properties --------------------

// Add a property (only logged-in users)
export const addProperty = async (formData, token) => {
  const res = await fetch(`${BASE_URL}/add-property`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  return await res.json();
};

// Get all properties (with optional search query)
export const getProperties = async (searchQuery = "") => {
  const url = searchQuery
    ? `${BASE_URL}/properties?search=${encodeURIComponent(searchQuery)}`
    : `${BASE_URL}/properties`;
  const res = await fetch(url);
  return await res.json();
};

// Get properties by category (with optional search query)
export const getPropertiesByCategory = async (category, searchQuery = "") => {
  const url = `${BASE_URL}/category/${encodeURIComponent(category)}${
    searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""
  }`;
  const res = await fetch(url);
  return await res.json();
};

// Get current user's properties
export const getMyProperties = async (token) => {
  const res = await fetch(`${BASE_URL}/my-properties`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
};
