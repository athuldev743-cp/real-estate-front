import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getProperties } from "../api/PropertyAPI";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function Category() {
  const { category } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";

  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getProperties(category, debouncedSearchQuery);
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
      }
    }
    fetchData();
  }, [category, debouncedSearchQuery]);

  return (
    <div className="category-page">
      <h2 className="category-title">{category ? category.toUpperCase() : "All Properties"}</h2>

      <input
        type="text"
        placeholder="Search properties..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="category-search-bar"
      />

      <div className="properties-list">
        {properties.length > 0 ? (
          properties.map((prop) => (
            <div key={prop._id} className="property-card">
              <img
                src={prop.image ? `${prop.image.replace("http://127.0.0.1:8000", "/")}` : "/image/placeholder.jpg"}
                alt={prop.title || prop.name}
                className="property-image"
              />
              <h3>{prop.title || prop.name}</h3>
              <p>{prop.description}</p>
              <p>Price: ₹{prop.price}</p>
              <p>Location: {prop.location}</p>
            </div>
          ))
        ) : (
          <p>No properties found.</p>
        )}
      </div>
    </div>
  );
}

export default Category;
