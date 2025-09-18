// src/pages/Account.jsx
import React, { useState, useEffect } from "react";
import {
  getMyProperties,
  getCart,
  removeFromCart,
  getCurrentUser,
  getOwnerInbox,
} from "../api/PropertyAPI";
import Inbox from "./Inbox";
import Chat from "./Chat";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaInbox, FaTrash } from "react-icons/fa";
import "./Account.css";

export default function Account({ user, setUser }) {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [showInbox, setShowInbox] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null); // { propertyId, chatId }
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingInbox, setLoadingInbox] = useState(false);
  const [loadingCart, setLoadingCart] = useState(true);

  const fullName = user?.fullName || "User";

  // ----------------- AUTH CHECK -----------------
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        if (!userData) {
          localStorage.clear();
          return navigate("/login");
        }
        setUser(userData);
      } catch (err) {
        console.error("❌ Auth error:", err);
        localStorage.clear();
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate, setUser]);

  // ----------------- FETCH PROPERTIES -----------------
  useEffect(() => {
    const fetchProperties = async () => {
      setLoadingProperties(true);
      try {
        const data = await getMyProperties();
        setProperties(data.properties || []);
      } catch (err) {
        console.error("❌ Error fetching properties:", err);
        setProperties([]);
      } finally {
        setLoadingProperties(false);
      }
    };
    fetchProperties();
  }, []);

  // ----------------- FETCH INBOX (with polling) -----------------
  useEffect(() => {
    let interval;
    const fetchInbox = async () => {
      setLoadingInbox(true);
      try {
        const data = await getOwnerInbox();
        setInbox(data || []);
      } catch (err) {
        console.error("❌ Error fetching inbox:", err);
        setInbox([]);
      } finally {
        setLoadingInbox(false);
      }
    };

    if (showInbox) {
      fetchInbox();
      interval = setInterval(fetchInbox, 5000); // poll every 5 sec
    }

    return () => clearInterval(interval);
  }, [showInbox]);

  // ----------------- FETCH CART -----------------
  const fetchCart = async () => {
    setLoadingCart(true);
    try {
      const data = await getCart(); // returns array
      setCart(data);
    } catch (err) {
      console.error("❌ Error fetching cart:", err);
      setCart([]);
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    fetchCart();
    const handleFocus = () => fetchCart();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleRemoveFromCart = async (id) => {
    try {
      await removeFromCart(id);
      fetchCart();
    } catch (err) {
      console.error("❌ Error removing from cart:", err);
    }
  };

  const handleCheckout = () => alert("Checkout feature coming soon!");
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const handleSelectChat = (chat) => {
    setSelectedChat({ propertyId: chat.property_id, chatId: chat.chat_id });
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
        {loadingProperties ? (
          <p>Loading properties...</p>
        ) : properties.length === 0 ? (
          <p>No properties added yet.</p>
        ) : (
          <div className="user-products-grid">
            {properties.map((prop) => (
              <div key={prop._id} className="property-card">
                {prop.images?.length > 0 ? (
                  <img src={prop.images[0]} alt={prop.title || "Property"} className="property-image" />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <h3>{prop.title || "Untitled"}</h3>
                <p>Category: {prop.category || "N/A"}</p>
                <p>Location: {prop.location || "N/A"}</p>
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/property/${prop._id}/edit`)}
                >
                  ✏️ Edit Property
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== Inbox Panel ===== */}
      {showInbox && (
        <div className="inbox-panel">
          {loadingInbox ? (
            <p>Loading inbox...</p>
          ) : inbox.length === 0 ? (
            <p>No chats yet.</p>
          ) : (
            <Inbox chats={inbox} onSelectChat={handleSelectChat} />
          )}
        </div>
      )}

      {/* ===== Chat Panel ===== */}
      {selectedChat && (
        <div className="chat-panel">
          <Chat
            chatId={selectedChat.chatId}
            propertyId={selectedChat.propertyId}
            userId={user?.email}
            ownerId={user?.email}
          />
        </div>
      )}

      {/* ===== Cart Sidebar ===== */}
      <div className={`cart-sidebar ${showCart ? "open" : ""}`}>
        <button className="cart-back-btn" onClick={() => setShowCart(false)}>← Back</button>
        <h3>🛒 My Cart ({cart.length})</h3>
        {loadingCart ? (
          <p>Loading cart...</p>
        ) : cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item._id} className="cart-item">
                  <div className="cart-item-info" onClick={() => navigate(`/property/${item._id}`)}>
                    <strong>{item.title}</strong> - ₹{item.price || "N/A"}
                  </div>
                  <button className="remove-btn" onClick={() => handleRemoveFromCart(item._id)}>
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
