import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- for navigation
import { getMyProperties, getNotifications } from "../api/PropertyAPI"; 
import Chat from "./Chat";
import "./Account.css";

export default function Account({ user, setUser }) {
  const [properties, setProperties] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate(); // <-- hook

  // fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const data = await getMyProperties(token); 
        setProperties(data);
      } catch (err) {
        console.error("Error fetching user properties:", err);
      }
    };
    fetchProperties();
  }, []);

  // fetch notifications
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const data = await getNotifications(token);
          setNotifications(data);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 10000);
    return () => clearInterval(interval);
  }, []);

  const unreadCountFor = (propId) => {
    const notif = notifications.find((n) => n.propertyId === propId);
    return notif ? notif.unreadCount : 0;
  };

  const fullName = localStorage.getItem("fullName");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    setUser(null);
  };

  return (
    <div className="account-page">
      <div className="account-header">
        <h1>{fullName || "My Account"}</h1>

        {/* Inbox Icon */}
        <button
          className="inbox-btn"
          title="Go to Inbox"
          onClick={() => navigate("/inbox")}
        >
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

            {/* Chat button with notification badge */}
            <button
              className="chat-btn"
              onClick={() =>
                setActiveChat(activeChat === prop._id ? null : prop._id)
              }
            >
              💬 Chat
              {unreadCountFor(prop._id) > 0 && (
                <span className="notif-badge">{unreadCountFor(prop._id)}</span>
              )}
            </button>

            {/* Chat modal */}
            {activeChat === prop._id && (
              <div className="chat-modal">
                <button
                  className="chat-close-btn"
                  onClick={() => setActiveChat(null)}
                >
                  ✖
                </button>
                <Chat chatId={prop._id} userId={user._id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
