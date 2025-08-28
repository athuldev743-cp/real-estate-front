import React, { useState, useEffect } from "react";
import { getOwnerInbox } from "../api/PropertyAPI";
import "./Inbox.css";

export default function Inbox({ onSelectChat }) {
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch inbox from backend
  const fetchInbox = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getOwnerInbox(token);
      setInbox(data.inbox || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch inbox:", err);
      setError("Failed to load inbox.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
    // Optionally refresh inbox every 10 seconds
    const interval = setInterval(fetchInbox, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="inbox">Loading inbox...</div>;
  if (error) return <div className="inbox error">{error}</div>;
  if (!inbox.length) return <div className="inbox">No messages yet.</div>;

  return (
    <div className="inbox">
      {inbox.map((chat) => (
        <div
          key={chat.chat_id}
          className={`chat-item ${chat.unread_count > 0 ? "unread" : ""}`}
          onClick={() => onSelectChat(chat.chat_id, chat.property_id)}
        >
          <div className="chat-property">Property ID: {chat.property_id}</div>
          <div className="chat-last-message">
            {chat.last_message
              ? `${chat.last_message.sender}: ${chat.last_message.text}`
              : "No messages yet"}
          </div>
          {chat.unread_count > 0 && (
            <div className="chat-unread-count">{chat.unread_count}</div>
          )}
        </div>
      ))}
    </div>
  );
}
