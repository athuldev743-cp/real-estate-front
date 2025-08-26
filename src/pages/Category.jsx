// src/pages/Category.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertiesByCategory } from "../api/PropertyAPI";
import "./Category.css";

export default function Category() {
  const { category } = useParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input to reduce API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await getPropertiesByCategory(category.toLowerCase(), debouncedSearch);
        setProperties(response);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [category, debouncedSearch]);

  return (
    <div className="category-page">
      <h2 className="category-title">{category}</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search properties..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {loading ? (
        <p>Loading properties...</p>
      ) : properties.length > 0 ? (
        <div className="properties-grid">
          {properties.map((property) => (
            <div key={property._id} className="property-card">
              <img
                src={property.image_url || "/image/default-property.jpeg"} // fallback image
                alt={property.title}
                className="property-image"
              />
              <h3>{property.title}</h3>
              <p>{property.description}</p>
              <p><strong>₹{property.price}</strong></p>
              <p>{property.location}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No properties found in this category.</p>
      )}
    </div>
  );
}
