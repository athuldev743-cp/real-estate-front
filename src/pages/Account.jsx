import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProperties, getNotifications, getMessages } from "../api/PropertyAPI";
import Chat from "./Chat";
import Inbox from "./Inbox";
import { FaShoppingCart, FaInbox } from "react-icons/fa";
import "./Account.css";

export default function Account({ user, setUser }) {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [showInbox, setShowInbox] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // Load cart from localStorage
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const fullName = localStorage.getItem("fullName");

  // Save cart to localStorage whenever it changes
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

  // Fetch notifications periodically
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch inbox chats when inbox panel is opened
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

  const unreadCountFor = (propId) => {
    const notif = notifications.find((n) => n.property_id === propId);
    return notif ? notif.unread_count : 0;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    setUser(null);
    navigate("/login");
  };

  const openChat = async (property) => {
    try {
      const res = await getMessages(property._id);
      setActiveChat({
        chatId: res.chatId,
        propertyId: property._id,
        ownerId: property.ownerId || user._id,
      });
    } catch (err) {
      console.error("Failed to open chat:", err);
    }
  };

  const closeChat = () => setActiveChat(null);

  const handleSelectChat = (chatId, propertyId) => {
    setInbox((prev) =>
      prev.map((c) => (c.chat_id === chatId ? { ...c, unread_count: 0 } : c))
    );
    setActiveChat({ chatId, propertyId, ownerId: user._id });
    setShowInbox(false);
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
      {/* ===== Navbar ===== */}
      <nav className="account-navbar">
        <div className="nav-left">
          <h2>Your Products</h2>
        </div>
        <div className="nav-right">
          <button className="nav-btn" onClick={() => setShowInbox((prev) => !prev)}>
            <FaInbox /> Inbox
            {notifications.length > 0 && (
              <span className="notif-badge">
                {notifications.reduce((acc, n) => acc + n.unread_count, 0)}
              </span>
            )}
          </button>
          <button className="nav-btn" onClick={() => setShowCart(prev => !prev)}>
            <FaShoppingCart /> Cart ({cart.length})
          </button>
          <button className="nav-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* ===== Inbox Panel ===== */}
      {showInbox && (
        <div className="inbox-panel">
          <Inbox chats={inbox} onSelectChat={handleSelectChat} />
        </div>
      )}

      {/* ===== User Products Grid ===== */}
      <div className="user-products-grid">
        {properties.map((prop) => (
          <div key={prop._id} className="property-card">
            <h3>{prop.title}</h3>
            <p>Category: {prop.category}</p>
            <p>Location: {prop.location}</p>
            <div className="property-actions">
              <button className="chat-btn" onClick={() => openChat(prop)}>
                💬 Chat
                {unreadCountFor(prop._id) > 0 && (
                  <span className="notif-badge">{unreadCountFor(prop._id)}</span>
                )}
              </button>
              <button className="add-to-cart-btn" onClick={() => addToCart(prop)}>
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Chat Modal ===== */}
      {activeChat && (
        <div className="chat-modal">
          <button className="chat-close-btn" onClick={closeChat}>
            ✖
          </button>
          <Chat
            chatId={activeChat.chatId}
            userId={user._id}
            propertyId={activeChat.propertyId}
            ownerId={activeChat.ownerId}
          />
        </div>
      )}

      {/* ===== Cart Sidebar ===== */}
      <div className={`cart-sidebar ${showCart ? "open" : ""}`}>
        <h3>🛒 My Cart ({cart.length})</h3>
        <ul>
          {cart.map((item) => (
            <li
              key={item._id}
              className="cart-item"
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
