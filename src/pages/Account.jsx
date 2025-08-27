import React, { useEffect, useState } from "react";
import { getMyProperties, getNotifications } from "../api/PropertyAPI"; 
import Chat from "./Chat";
import "./Account.css";

export default function Account({ userId }) {
  const [properties, setProperties] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getMyProperties(); 
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
        const token = localStorage.getItem("token"); // assuming you store JWT in localStorage
        if (token) {
          const data = await getNotifications(token);
          setNotifications(data); // should be array of { propertyId, unreadCount }
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifs();

    // poll every 10s for updates
    const interval = setInterval(fetchNotifs, 10000);
    return () => clearInterval(interval);
  }, []);

  const unreadCountFor = (propId) => {
    const notif = notifications.find((n) => n.propertyId === propId);
    return notif ? notif.unreadCount : 0;
  };

  return (
    <div className="account-page">
      <h1>My Account</h1>

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
                <Chat chatId={prop._id} userId={userId} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
