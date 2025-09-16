import React, { useState, useEffect } from "react";
import { getMyProperties } from "../api/PropertyAPI";
import Inbox from "./Inbox";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaInbox } from "react-icons/fa";
import "./Account.css";

export default function Account({ user, setUser }) {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [showInbox, setShowInbox] = useState(false);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [showCart, setShowCart] = useState(false);

  const fullName = localStorage.getItem("fullName");

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch properties
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

  // Fetch inbox chats when Inbox is opened
  useEffect(() => {
    if (!showInbox) return;
    const fetchInbox = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${process.env.REACT_APP_API_URL}/chat/inbox`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch inbox");
        const data = await res.json();
        setInbox(data.chats || []);
      } catch (err) {
        console.error("Error fetching inbox:", err);
      }
    };
    fetchInbox();
  }, [showInbox]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    setUser(null);
  };

  return (
    <div className="account-page">
      {/* ===== Header ===== */}
      <header
        className="account-header"
        style={{ backgroundImage: "url('/image/account-bg.jpeg')" }}
      >
        <div className="header-overlay"></div>
        <div className="header-content">
          <h1>Welcome, {fullName}</h1>
          <div className="header-buttons">
            <button className="nav-btn" onClick={() => setShowInbox((prev) => !prev)}>
              <FaInbox /> Inbox
            </button>
            <button className="nav-btn" onClick={() => setShowCart(true)}>
              <FaShoppingCart /> Cart ({cart.length})
            </button>
            <button className="nav-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ===== Your Products ===== */}
      <section className="your-products">
        <h2>Your Products</h2>
        <div className="user-products-grid">
          {properties.map((prop) => (
            <div key={prop._id} className="property-card">
              {prop.images?.length > 0 && (
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  className="property-image"
                />
              )}
              <h3>{prop.title}</h3>
              <p>Category: {prop.category}</p>
              <p>Location: {prop.location}</p>
             <button
  className="edit-btn"
  onClick={() => navigate(`/property/${prop._id}/edit`)}
>
  ✏️ Edit Property
</button>

            </div>
          ))}
        </div>
      </section>

      {/* ===== Inbox Panel ===== */}
      {showInbox && (
        <div className="inbox-panel">
          <Inbox chats={inbox} onSelectChat={() => {}} />
        </div>
      )}

      {/* ===== Cart Sidebar ===== */}
      <div className={`cart-sidebar ${showCart ? "open" : ""}`}>
        <button className="cart-back-btn" onClick={() => setShowCart(false)}>
          ← Back
        </button>
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
