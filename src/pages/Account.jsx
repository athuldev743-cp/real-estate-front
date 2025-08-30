import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProperties, getNotifications, getMessages } from "../api/PropertyAPI";
import Chat from "./Chat";
import "./Account.css";

export default function Account({ user, setUser }) {
  const [properties, setProperties] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // { chatId, propertyId, ownerId }
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fullName = localStorage.getItem("fullName");

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

  // Fetch unread notifications
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

  const unreadCountFor = (propId) => {
    const notif = notifications.find((n) => n.property_id === propId);
    return notif ? notif.unread_count : 0;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    setUser(null);
  };

  // Open chat: get or create chatId from backend
  const openChat = async (property) => {
    try {
      const res = await getMessages(property._id); // returns { chatId, messages }
      setActiveChat({
        chatId: res.chatId,
        propertyId: property._id,
        ownerId: property.ownerId || user._id, // make sure property includes ownerId
      });
    } catch (err) {
      console.error("Failed to open chat:", err);
    }
  };

  const closeChat = () => setActiveChat(null);

  return (
    <div className="account-page">
      <div className="account-header">
        <h1>{fullName || "My Account"}</h1>
        <button className="inbox-btn" title="Go to Inbox" onClick={() => navigate("/inbox")}>
          📥
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="user-properties">
        {properties.map((prop) => (
          <div key={prop._id} className="property-card">
            <h3>{prop.title}</h3>
            <p>Category: {prop.category}</p>
            <p>Location: {prop.location}</p>

            <button
              className="chat-btn"
              onClick={() => openChat(prop)}
            >
              💬 Chat
              {unreadCountFor(prop._id) > 0 && (
                <span className="notif-badge">{unreadCountFor(prop._id)}</span>
              )}
            </button>
          </div>
        ))}
      </div>

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
    </div>
  );
} 