import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertiesByCategory } from "../api/PropertyAPI";
import "./Category.css";

export default function Category() {
  const { category } = useParams(); // from /category/:category
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProperties = async () => {
      try {
        setLoading(true);
        // fetch from backend
        const data = await getPropertiesByCategory(category);
        console.log("Fetched properties:", data);
        setProperties(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProperties();
  }, [category]);

  return (
    <div className="category-page">
      <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : properties.length > 0 ? (
        <div className="properties-grid">
          {properties.map((prop) => (
            <div key={prop._id} className="property-card">
              <img
                src={prop.image_url || prop.image}
                alt={prop.title}
                className="property-image"
              />
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
