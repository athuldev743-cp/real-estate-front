import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProperties } from "../api/PropertyAPI";
import "./Search.css";

export default function Search() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = new URLSearchParams(useLocation().search).get("query") || "";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const data = await getProperties(query);
        setProperties(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [query]);

  return (
    <div className="search-page">
      <h1>Search Results for "{query}"</h1>
      {loading ? (
        <p>Loading properties...</p>
      ) : properties.length > 0 ? (
        <div className="properties-grid">
          {properties.map((prop) => (
            <div key={prop._id || prop.title} className="property-card">
              <img
                src={prop.image || "/image/placeholder.jpg"}
                alt={prop.title}
                className="property-image"
              />
              <h3>{prop.title}</h3>
              <p>{prop.description}</p>
              <p className="price">Price: ₹{prop.price}</p>
              <p className="location">Location: {prop.location}</p>
              <button
                className="view-details-btn"
                onClick={() => {
                  if (prop._id) navigate(`/property/${prop._id}`);
                  else console.error("Property ID missing!", prop);
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
