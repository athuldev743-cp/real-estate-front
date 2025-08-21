import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faTwitter, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";



export default function Home() {
   const [searchQuery, setSearchQuery] = useState(""); 
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollYRef = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollYRef.current) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollYRef.current = window.scrollY;
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  const categories = [
    { id: 1, name: "Plots", image: "/image/plots.jpeg", link: "/plots" },
    { id: 2, name: "Buildings", image: "/image/builldings.jpeg", link: "/buildings" },
    { id: 3, name: "Houses", image: "/image/house.jpeg", link: "/houses" },
    { id: 4, name: "Apartments", image: "/image/appartment.jpeg", link: "/apartments" },
    { id: 5, name: "Villas", image: "/image/villa.jpeg", link: "/villas" },
    { id: 6, name: "Farmlands", image: "/image/farmlands.jpeg", link: "/farmlands" },
  ];

  return (
    <div className="home">
      {/* Navbar */}
      <nav className={`navbar ${showNavbar ? "navbar-show" : "navbar-hide"}`}>
        <div className="nav-content">
          <div className="logo">
            <img src="/image/logo.jpeg" alt="Logo" className="logo-img" />
          </div>
          <ul className="nav-links">
            <li onClick={() => navigate("/top-deals")}>Top Deals</li>
            {categories.map((cat) => (
              <li key={cat.id} onClick={() => navigate(cat.link)}>
                {cat.name}
              </li>
            ))}
            <li>
              <Link to="/add-property">
                <button className="add-property-btn">+ Add Property</button>
              </Link>
            </li>
          </ul>
          <div className="mobile-menu">☰</div>
          <nav className={`navbar ${showNavbar ? "navbar-show" : "navbar-hide"}`}>
  <div className="nav-content">
    <div className="logo">
      <img src="/image/logo.jpeg" alt="Logo" className="logo-img" />
    </div>

    <ul className="nav-links">
      <li onClick={() => navigate("/top-deals")}>Top Deals</li>
      {categories.map((cat) => (
        <li key={cat.id} onClick={() => navigate(cat.link)}>
          {cat.name}
        </li>
      ))}
      <li>
        <Link to="/add-property">
          <button className="add-property-btn">+ Add Property</button>
        </Link>
      </li>
    </ul>

    {/* ADD SEARCH BAR HERE */}
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

        </div>
      </nav>

      {/* Hero Section */}
      <section
  className="hero"
  style={{
    backgroundImage: 'url("/image/backr.jpeg")',
  }}
>
  <h1>Find Your Dream Property</h1>
  <p>Plots • Houses • Villas • Apartments</p>
  <div>
    <Link to="/top-deals">
      <button className="view-deals-btn">View Top Deals</button>
    </Link>
    <button
      className="view-deals-btn"
      style={{ marginLeft: "20px", backgroundColor: "#28a745" }}
      onClick={() => navigate("/Login")}
    >
      Login
    </button>
  </div>
</section>

      {/* Categories Section */}
      <section className="categories">
        <h2>WELCOME</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => navigate(cat.link)}
            >
              <img src={cat.image} alt={cat.name} />
              <div>{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
     <section
  className="about"
  style={{
    backgroundImage: 'url("/image/about-bg.jpeg")',
  }}
>
  <h2>About Us</h2>
  <p style={{ maxWidth: "800px", margin: "20px auto", fontSize: "1.2rem", lineHeight: "1.6" }}>
    At Estateuro, we believe a home is where love grows, trust is nurtured, and families thrive.
    Our mission is to help you find properties that bring comfort, joy, and lasting memories.
    With transparency and care, we connect you to plots, houses, and villas that match your family’s dreams.
    Estateuro is your trusted partner in building a happy, secure future.
  </p>
</section>

      {/* Contact Section */}
      <section className="contact">
        <h2>Contact Estateuro</h2>
        <p>Email: info@estateuro.com</p>
        <p>Phone: +91 98765 43210</p>
        <p>Address: 123 Main Street, Your City</p>

        {/* Social Media Links */}
      {/* Social Media Links */}
<div className="social-media">
  <h3>Follow Us</h3>
  <div className="social-icons">
    <FontAwesomeIcon
      icon={faFacebookF}
      className="social-icon"
      role="link"
      aria-label="Facebook"
      tabIndex={0}
      onClick={() => window.open('https://facebook.com', '_blank', 'noopener,noreferrer')}
    />
    <FontAwesomeIcon
      icon={faInstagram}
      className="social-icon"
      role="link"
      aria-label="Instagram"
      tabIndex={0}
      onClick={() => window.open('https://instagram.com', '_blank', 'noopener,noreferrer')}
    />
    <FontAwesomeIcon
      icon={faTwitter}
      className="social-icon"
      role="link"
      aria-label="Twitter"
      tabIndex={0}
      onClick={() => window.open('https://twitter.com', '_blank', 'noopener,noreferrer')}
    />
    <FontAwesomeIcon
      icon={faLinkedinIn}
      className="social-icon"
      role="link"
      aria-label="LinkedIn"
      tabIndex={0}
      onClick={() => window.open('https://linkedin.com', '_blank', 'noopener,noreferrer')}
    />
  </div>
</div>


        
      </section>
    </div>
  );
}

