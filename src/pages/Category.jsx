// src/pages/Category.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProperties } from "../api/PropertyAPI";
import "./Category.css";

export default function Category() {
  const { category } = useParams(); // e.g. "apartments", "buildings"
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const data = await getProperties(category);
        setProperties(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [category]);

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="category-container">
      <h1>{categoryTitle}</h1>

      {loading ? (
        <p>Loading properties...</p>
      ) : (
        <div className="property-grid">
          {properties.length > 0 ? (
            properties.map((prop) => (
              <div key={prop._id || prop.title} className="property-card">
                <img
                  src={prop.image || "/image/placeholder.jpg"}
                  alt={prop.title}
                  className="property-image"
                />
                <h2>{prop.title}</h2>
                <p>{prop.description}</p>
                <p><b>Price:</b> ₹{prop.price}</p>
                <p><b>Location:</b> {prop.location}</p>
              </div>
            ))
          ) : (
            <p>No properties found in this category.</p>
          )}
        </div>
      )}
    </div>
  );
}
