import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProperties } from "../api/PropertyAPI";
import { FaShoppingCart } from "react-icons/fa";


import "./Account.css";

export default function Account({ user, setUser }) {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const fullName = localStorage.getItem("fullName");

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch user's properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getMyProperties();
        setProperties(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    };
    fetchProperties();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    setUser(null);
    navigate("/login");
  };

  const addToCart = (property) => {
    if (!cart.find((item) => item._id === property._id)) {
      setCart([...cart, property]);
      alert(`${property.title} added to cart!`);
    } else {
      alert("This property is already in your cart.");
    }
  };

  return (
    <div className="account-page">
      {/* ===== Header ===== */}
      <header className="account-header">
        <div className="header-overlay"></div>
        <div className="header-content">
          <h1>Welcome, {fullName || "User"}</h1>
          <div className="header-buttons">
            <button className="nav-btn" onClick={() => setShowCart(prev => !prev)}>
              <FaShoppingCart /> Cart ({cart.length})
            </button>
            <button className="nav-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ===== Your Products Section ===== */}
      <section className="your-products">
        <h2>Your Products</h2>
        <div className="user-products-grid">
          {properties.map((prop) => (
            <div key={prop._id} className="property-card">
              <h3>{prop.title}</h3>
              <p>Category: {prop.category}</p>
              <p>Location: {prop.location}</p>
              <div className="property-actions">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit-property/${prop._id}`)}
                >
                  Edit Property
                </button>
                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(prop)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Cart Sidebar ===== */}
      <div className={`cart-sidebar ${showCart ? "open" : ""}`}>
        <button className="cart-back-btn" onClick={() => setShowCart(false)}>← Back</button>
        <h3>🛒 My Cart ({cart.length})</h3>
        <ul>
          {cart.map((item) => (
            <li
              key={item._id}
              onClick={() => navigate(`/property/${item._id}`)}
            >
              {item.title} - ₹{item.price || "N/A"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
