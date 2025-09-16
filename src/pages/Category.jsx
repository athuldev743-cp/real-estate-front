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

  // Price filter
  const MIN = 100000;       // 1 Lakh
  const MAX = 1000000000;   // 100 Crore
  const [priceRange, setPriceRange] = useState([MIN, MAX]);

  // Location filter
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
    data = data.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    if (locationFilter) {
      data = data.filter((p) =>
        p.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    setFilteredProperties(data);
  }, [priceRange, locationFilter, properties]);

  const handleMinChange = (e) => {
    const val = Number(e.target.value);
    if (val <= priceRange[1]) setPriceRange([val, priceRange[1]]);
  };

  const handleMaxChange = (e) => {
    const val = Number(e.target.value);
    if (val >= priceRange[0]) setPriceRange([priceRange[0], val]);
  };

  const displayCategoryName = (cat) => {
    if (!cat || cat.toLowerCase() === "all") return "Top Deals";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <div className="category-page">
      {/* Header */}
      <div className="category-header">
        <div className="animated-gradient"></div>
        <div className="light-streaks"></div>
        <h2 className="category-title">{displayCategoryName(category)}</h2>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="dual-slider">
          <label>Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}</label>
          <div className="slider-container">
            <input
              type="range"
              min={MIN}
              max={MAX}
              step={100000}
              value={priceRange[0]}
              onChange={handleMinChange}
              className="range-min"
            />
            <input
              type="range"
              min={MIN}
              max={MAX}
              step={100000}
              value={priceRange[1]}
              onChange={handleMaxChange}
              className="range-max"
            />
            <div className="slider-track"></div>
          </div>
        </div>

        <input
          type="text"
          placeholder="Filter by Location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
      </div>

      {/* Properties Grid */}
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
