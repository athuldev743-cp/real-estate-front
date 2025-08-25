import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertiesByCategory } from "../api/PropertyAPI";
import "./Category.css";

export default function Category() {
  const { category } = useParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const data = await getPropertiesByCategory(category);
        setProperties(data);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [category]);

  return (
    <div className="category-page">
      <h1>{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
      {loading ? (
        <p>Loading properties...</p>
      ) : properties.length > 0 ? (
        <div className="properties-grid">
          {properties.map((prop) => (
            <div key={prop._id} className="property-card">
              <img src={prop.image_url || "/image/placeholder.jpg"} alt={prop.title} />
              <h3>{prop.title}</h3>
              <p>{prop.description}</p>
              <p>Price: ₹{prop.price}</p>
              <p>Location: {prop.location}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No properties found in this category.</p>
      )}
    </div>
  );
}
