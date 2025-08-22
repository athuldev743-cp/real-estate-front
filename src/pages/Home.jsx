import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProperties } from "../api/PropertyAPI";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faTwitter, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNavbar, setShowNavbar] = useState(true);
  const [properties, setProperties] = useState([]);
  const lastScrollYRef = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const controlNavbar = () => {
      setShowNavbar(window.scrollY <= lastScrollYRef.current);
      lastScrollYRef.current = window.scrollY;
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  const categories = [
    { id: 1, name: "Plots", link: "/category/plots" },
    { id: 2, name: "Builldings", link: "/category/buildings" },
    { id: 3, name: "House", link: "/category/houses" },
    { id: 4, name: "Appartment", link: "/category/apartments" },
    { id: 5, name: "Villa", link: "/category/villas" },
    { id: 6, name: "Farmlands", link: "/category/farmlands" },
  ];

  const goToCategory = (link) => {
    navigate(`${link}?search=${encodeURIComponent(searchQuery)}`);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getProperties("", searchQuery);
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    }
    fetchData();
  }, [searchQuery]);

  return (
    <div className="home">
      <nav className={`navbar ${showNavbar ? "navbar-show" : "navbar-hide"}`}>
        <div className="nav-content">
          <div className="logo">
            <img src="/image/logo.jpeg" alt="Logo" className="logo-img" />
          </div>
          <ul className="nav-links">
            <li onClick={() => navigate("/top-deals")}>Top Deals</li>
            {categories.map((cat) => (
              <li key={cat.id} onClick={() => goToCategory(cat.link)}>
                {cat.name}
              </li>
            ))}
            <li>
              <button className="add-property-btn" onClick={() => navigate("/add-property")}>
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
          </div>

          <div className="mobile-menu">☰</div>
        </div>
      </nav>

      <section className="hero" style={{ backgroundImage: 'url("/image/backr.jpeg")' }}>
        <h1>Find Your Dream Property</h1>
        <p>Plots • Houses • Villas • Apartments</p>
        <div>
          <button className="view-deals-btn" onClick={() => navigate("/top-deals")}>View Top Deals</button>
          <button
            className="view-deals-btn"
            style={{ marginLeft: "20px", backgroundColor: "#28a745" }}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </section>

      <section className="categories">
        <h2>Categories</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card" onClick={() => goToCategory(cat.link)}>
              <img src={`/image/${cat.name.toLowerCase()}.jpeg`} alt={cat.name} />
              <div>{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="properties-section">
        <h2>Available Properties</h2>
        <div className="properties-grid">
          {properties.length > 0 ? (
            properties.map((prop) => (
              <div key={prop._id} className="property-card">
                <img
                  src={prop.image ? `${prop.image.replace("http://127.0.0.1:8000", "/")}` : "/image/placeholder.jpg"}
                  alt={prop.title}
                  className="property-image"
                />
                <h3>{prop.title}</h3>
                <p>{prop.description}</p>
                <p>Price: ₹{prop.price}</p>
                <p>Location: {prop.location}</p>
              </div>
            ))
          ) : (
            <p>No properties found.</p>
          )}
        </div>
      </section>

      <section className="about" style={{ backgroundImage: 'url("/image/about-bg.jpeg")' }}>
        <h2>About Us</h2>
        <p style={{ maxWidth: "800px", margin: "20px auto", fontSize: "1.2rem", lineHeight: "1.6" }}>
          At Estateuro, we believe a home is where love grows, trust is nurtured, and families thrive.
          Our mission is to help you find properties that bring comfort, joy, and lasting memories.
        </p>
      </section>

      <section className="contact">
        <h2>Contact Estateuro</h2>
        <p>Email: info@estateuro.com</p>
        <p>Phone: +91 98765 43210</p>
        <p>Address: 123 Main Street, Your City</p>

        <div className="social-media">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <FontAwesomeIcon icon={faFacebookF} className="social-icon" onClick={() => window.open('https://facebook.com','_blank')} />
            <FontAwesomeIcon icon={faInstagram} className="social-icon" onClick={() => window.open('https://instagram.com','_blank')} />
            <FontAwesomeIcon icon={faTwitter} className="social-icon" onClick={() => window.open('https://twitter.com','_blank')} />
            <FontAwesomeIcon icon={faLinkedinIn} className="social-icon" onClick={() => window.open('https://linkedin.com','_blank')} />
          </div>
        </div>
      </section>
    </div>
  );
}
