import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getPropertiesByCategory, getProperties } from "../api/PropertyAPI";
import "./Category.css";

export default function Category() {
  const { category } = useParams();
  const searchQuery = new URLSearchParams(useLocation().search).get("search") || "";
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let data;
        if (category === "all") {
          data = await getProperties(searchQuery);
        } else {
          data = await getPropertiesByCategory(category, searchQuery);
        }
        setProperties(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [category, searchQuery]);

  return (
    <div className="category-page">
      <h2 className="category-title">{category === "all" ? "Top Deals" : category}</h2>
      {loading ? (
        <p>Loading properties...</p>
      ) : properties.length > 0 ? (
        <div className="properties-grid">
          {properties.map((p) => (
            <div key={p._id || p.title} className="property-card">
              <img
                src={p.image_url || "/image/default-property.jpeg"}
                alt={p.title}
                className="property-image"
              />
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <p><strong>₹{p.price}</strong></p>
              <p>{p.location}</p>
              <button
                className="view-details-btn"
                onClick={() => {
                  if (p._id) navigate(`/property/${p._id}`);
                  else console.error("Property ID missing!", p);
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No properties found.</p>
      )}
    </div>
  );
}
