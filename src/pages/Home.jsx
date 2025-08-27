import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { getPropertiesByCategory } from "../api/PropertyAPI";
import "./Home.css";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollYRef = useRef(0);
  const navigate = useNavigate();

  // Navbar hide/show on scroll
  useEffect(() => {
    const controlNavbar = () => {
      setShowNavbar(window.scrollY <= lastScrollYRef.current);
      lastScrollYRef.current = window.scrollY;
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  const categories = [
    { id: 1, name: "Plots" },
    { id: 2, name: "Buildings" },
    { id: 3, name: "Houses" },
    { id: 4, name: "Apartments" },
    { id: 5, name: "Villas" },
    { id: 6, name: "Farmlands" },
  ];

  const fetchCategory = async (category) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      const data = await getPropertiesByCategory(category.toLowerCase(), searchQuery);
      setProperties(data);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (selectedCategory) {
      fetchCategory(selectedCategory);
    } else {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="home">
      {/* Navbar */}
      <nav className={`navbar ${showNavbar ? "navbar-show" : "navbar-hide"}`}>
        <div className="nav-content">
          <div className="logo">
            <img
              src="/image/logo.jpeg"
              alt="Logo"
              className="logo-img"
              onError={(e) => (e.target.src = "/image/default-category.jpeg")}
            />
          </div>
          <ul className="nav-links">
            {categories.map((cat) => (
              <li key={cat.id} onClick={() => fetchCategory(cat.name)}>
                {cat.name}
              </li>
            ))}
            <li>
              <button
                className="register-btn"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </li>
            <li>
              <button
                className="add-property-btn"
                onClick={() => navigate("/add-property")}
              >
                + Add Property
              </button>
            </li>
          </ul>
          <div className="nav-search">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button onClick={handleSearch} className="search-btn">
              Search
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="hero"
        style={{
          backgroundImage: `url("/image/backr.jpeg"), url("/image/default-category.jpeg")`,
        }}
      >
        <h1>Find Your Dream Property</h1>
        <p>Plots • Houses • Villas • Apartments</p>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h2>Categories</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => fetchCategory(cat.name)}
            >
              <img
                src={`/image/${cat.name.toLowerCase()}.jpeg`}
                alt={cat.name}
                onError={(e) => (e.target.src = "/image/default-category.jpeg")}
              />
              <div>{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Properties Section */}
      {selectedCategory && (
        <section className="properties">
          <h2>{selectedCategory} Properties</h2>
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
                </div>
              ))}
            </div>
          ) : (
            <p>No properties found.</p>
          )}
        </section>
      )}
    </div>
  );
}
