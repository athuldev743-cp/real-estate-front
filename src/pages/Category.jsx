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
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
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
          const backendCategory = category.toLowerCase();
          data = await getPropertiesByCategory(backendCategory, searchQuery);
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

    if (minPrice) {
      data = data.filter((p) => p.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      data = data.filter((p) => p.price <= parseInt(maxPrice));
    }
    if (locationFilter) {
      data = data.filter((p) =>
        p.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredProperties(data);
  }, [minPrice, maxPrice, locationFilter, properties]);

  const displayCategoryName = (cat) => {
    if (!cat || cat.toLowerCase() === "all") return "Top Deals";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <div className="category-page">
      {/* Animated Header */}
      <div className="category-header">
        <div className="animated-gradient"></div>
        <div className="light-streaks"></div>
        <h2 className="category-title">{displayCategoryName(category)}</h2>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
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
                      ? p.images[0] // show only first image in card
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
              <p><strong>₹{p.price}</strong></p>
              <p>{p.location}</p>
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
