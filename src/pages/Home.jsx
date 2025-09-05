import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import "./Home.css";

export default function Home({ user }) {
  const [searchQuery, setSearchQuery] = useState("");
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
    { id: 1, name: "Plots", value: "plots" },
    { id: 2, name: "Buildings", value: "buildings" },
    { id: 3, name: "House", value: "house" },
    { id: 4, name: "Apartment", value: "apartment" },
    { id: 5, name: "Villa", value: "villa" },
    { id: 6, name: "Farmland", value: "farmlands" },
  ];

  const goToCategory = (value) => {
    navigate(`/category/${value}?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleSearch = () => {
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const handleTopDeals = () => {
    navigate("/category/all");
  };

  const handleAddProperty = () => {
    if (!user) {
      alert("You must be logged in to add a property.");
      navigate("/register");
      return;
    }
    navigate("/add-property");
  };

  const handleAccount = () => {
    if (!user) {
      alert("You must be logged in to view your account.");
      navigate("/register");
      return;
    }
    navigate("/account");
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
            {!user && (
              <li>
                <button
                  className="register-btn"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </li>
            )}
            <li>
              <button className="add-property-btn" onClick={handleAddProperty}>
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

            <button className="my-account-btn" onClick={handleAccount}>
              My Account
            </button>
          </div>

          <div className="mobile-menu">☰</div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="hero"
        style={{
          backgroundImage: "url(/image/bgo3.jpeg), url(/image/default-category.jpeg)",
        }}
      >
        <h1>Find Your Dream Property</h1>
        <p>Plots • Houses • Villas • Apartments</p>
        <div>
          <button className="view-deals-btn" onClick={handleTopDeals}>
            View Top Deals
          </button>
          {!user && (
            <button
              className="view-deals-btn"
              style={{ marginLeft: "20px", backgroundColor: "#28a745" }}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="categories-wrapper">
        {/* Background video */}
        <video className="categories-bg-video" autoPlay muted loop playsInline>
          <source src="/image/belux.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="categories">
          <h2>Categories</h2>
          <div className="categories-grid">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`category-card ${cat.value}`}
                onClick={() => goToCategory(cat.value)}
              >
                <div className="category-overlay">
                  <h3>{cat.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        className="about"
        style={{
          backgroundImage: "url(/image/about-bg.jpeg), url(/image/default-category.jpeg)",
        }}
      >
        <h2>About Us</h2>
        <p>
          At Estateuro, we believe real estate is more than just buying or
          selling property — it’s about creating lifestyles, securing
          investments, and shaping dreams into reality...
        </p>
      </section>

      {/* Contact Section */}
      <section className="contact">
        <h2>Contact Estateuro</h2>
        <p>Email: info@estateuro.com</p>
        <p>Phone: +91 98765 43210</p>
        <p>Address: 123 Main Street, Your City</p>
        <div className="social-media">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <FontAwesomeIcon
              icon={faFacebookF}
              className="social-icon"
              onClick={() => window.open("https://facebook.com", "_blank")}
            />
            <FontAwesomeIcon
              icon={faInstagram}
              className="social-icon"
              onClick={() => window.open("https://instagram.com", "_blank")}
            />
            <FontAwesomeIcon
              icon={faTwitter}
              className="social-icon"
              onClick={() => window.open("https://twitter.com", "_blank")}
            />
            <FontAwesomeIcon
              icon={faLinkedinIn}
              className="social-icon"
              onClick={() => window.open("https://linkedin.com", "_blank")}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
