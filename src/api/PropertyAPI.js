const BASE_URL = process.env.REACT_APP_API_URL;

// Get properties by category (frontend fix: matches backend route)
export const getPropertiesByCategory = async (category) => {
  const url = `${BASE_URL}/api/properties-by-category?category=${encodeURIComponent(category)}`;
  const res = await fetch(url);
  return await res.json();
};

// Add property
export const addProperty = async (formData, token) => {
  const res = await fetch(`${BASE_URL}/api/add-property`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  return await res.json();
};

// Optional: other API functions...
