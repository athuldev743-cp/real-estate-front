import React, { useEffect, useState } from "react";
import { getMyProperties } from "../api/PropertyAPI"; // fixed import
import Chat from "./Chat";
import "./Account.css";

export default function Account({ userId }) {
  const [properties, setProperties] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getMyProperties(); // fetch current user's properties
        setProperties(data);
      } catch (err) {
        console.error("Error fetching user properties:", err);
      }
    };
    fetchProperties();
  }, []); // no need for userId in dependencies

  return (
    <div className="account-page">
      <h1>My Account</h1>

      <div className="user-properties">
        {properties.map((prop) => (
          <div key={prop._id} className="property-card">
            <h3>{prop.title}</h3>
            <p>Category: {prop.category}</p>
            <p>Location: {prop.location}</p>

            {/* Chat icon for this property */}
            <button
              className="chat-btn"
              onClick={() =>
                setActiveChat(activeChat === prop._id ? null : prop._id)
              }
            >
              💬 Chat
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
