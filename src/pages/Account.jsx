// src/pages/Account.jsx
import React, { useState, useEffect } from "react";
import { getMyProperties, getCart, removeFromCart, getCurrentUser } from "../api/PropertyAPI";
import Inbox from "./Inbox";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaInbox, FaTrash } from "react-icons/fa";
import "./Account.css";

export default function Account({ user, setUser }) {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [showInbox, setShowInbox] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const fullName = localStorage.getItem("fullName");


  useEffect(() => {
  const checkAuth = async () => {
    const userData = await getCurrentUser();
    if (!userData) {
      navigate("/login");
    } else {
      setUser(userData);
    }
  };
  checkAuth();
}, [navigate, setUser]);

  // Fetch user properties
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

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data.items || data || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Re-fetch cart when user focuses back on this page/tab
  useEffect(() => {
    const handleFocus = () => fetchCart();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleRemoveFromCart = async (id) => {
    try {
      await removeFromCart(id);
      fetchCart(); // refresh cart
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const handleCheckout = () => {
    alert("Checkout feature coming soon!");
  };

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
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item._id} className="cart-item">
                  <div
                    className="cart-item-info"
                    onClick={() => navigate(`/property/${item._id}`)}
                  >
                    <strong>{item.title}</strong> - ₹{item.price || "N/A"}
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromCart(item._id)}
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
            <button className="checkout-btn" onClick={handleCheckout}>
              ✅ Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
