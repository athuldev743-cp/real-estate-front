import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProperties } from "../api/PropertyAPI";
import "./Category.css";

function Category() {
  const { category } = useParams(); // e.g. "apartments", "buildings"
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProperties(category); // ✅ fetch based on route
        setProperties(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    };
    fetchData();
  }, [category]);

  return (
    <div className="category-container">
      <h1>{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
      <div className="property-grid">
        {properties.length > 0 ? (
          properties.map((prop) => (
            <div key={prop.id} className="property-card">
              {prop.image && <img src={prop.image} alt={prop.title} />}
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
    </div>
  );
}

export default Category;
