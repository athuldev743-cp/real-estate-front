import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getPropertiesByCategory, getProperties } from "../api/PropertyAPI";
import { FaCommentDots } from "react-icons/fa";
import "./Category.css";

export default function Category() {
  const { category } = useParams();
  const searchQuery = new URLSearchParams(useLocation().search).get("search") || "";
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [price, setPrice] = useState(10000000); // default max price
  const [locationFilter, setLocationFilter] = useState("");

  const navigate = useNavigate();

  // Fetch properties
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let data;
        if (category?.toLowerCase() === "all") {
          data = await getProperties(searchQuery);
        } else {
          data = await getPropertiesByCategory(category.toLowerCase(), searchQuery);
        }
        setProperties(data);
        setFilteredProperties(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [category, searchQuery]);

  // Apply filters
  useEffect(() => {
    let data = [...properties];

    // Filter by price
    if (price) {
      data = data.filter((p) => p.price <= price);
    }

    // Filter by location
    if (locationFilter) {
      data = data.filter((p) => {
        const loc = `${p.location || ""} ${p.city || ""} ${p.address || ""}`.toLowerCase();
        return loc.includes(locationFilter.toLowerCase());
      });
    }

    setFilteredProperties(data);
  }, [price, locationFilter, properties]);

  const displayCategoryName = (cat) => {
    if (!cat || cat.toLowerCase() === "all") return "Top Deals";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <div className="category-page">
      <div className="category-header">
        <h2 className="category-title">{displayCategoryName(category)}</h2>
      </div>

      {/* Filters */}
      <div className="filters">
        <label>
          Max Price: ₹{price.toLocaleString()}
          <input
            type="range"
            min={100000}        // 1 lakh
            max={10000000000}   // 100 crore
            step={100000}       // 1 lakh step
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </label>

        <input
          type="text"
          placeholder="Filter by Location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
      </div>

      {/* Properties */}
      {loading ? (
        <p className="loading-text">Loading properties...</p>
      ) : filteredProperties.length > 0 ? (
        <div className="properties-grid">
          {filteredProperties.map((p) => (
            <div key={p._id || p.title} className="property-card">
              <div className="property-image-wrapper">
                <img
                  src={
                    Array.isArray(p.images) && p.images.length > 0
                      ? p.images[0]
                      : p.image_url || "/image/default-property.jpeg"
                  }
                  alt={p.title}
                  className="property-image"
                />
                {p.hasNewMessages && (
                  <div className="chat-badge">
                    <FaCommentDots size={20} />
                  </div>
                )}
              </div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <p><strong>₹{p.price.toLocaleString()}</strong></p>
              <p>{p.location || p.city || p.address || "N/A"}</p>
              <div className="property-actions">
                <button
                  className="view-details-btn"
                  onClick={() => navigate(`/property/${p._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="loading-text">No properties found.</p>
      )}
    </div>
  );
}
