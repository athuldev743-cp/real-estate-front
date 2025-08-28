import React, { useState, useEffect } from "react";
import Inbox from "./Inbox";
import Chat from "../pages/Chat";
import "./OwnerDashboard.css";

export default function OwnerDashboard() {
  const [selectedChat, setSelectedChat] = useState({ chatId: null, propertyId: null });
  const [user, setUser] = useState(null);

  // Load current user info from localStorage or token
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleSelectChat = (chatId, propertyId) => {
    setSelectedChat({ chatId, propertyId });
  };

  if (!user) return <div>Loading user info...</div>;

  return (
    <div className="owner-dashboard">
      <div className="inbox-panel">
        <h2>Inbox</h2>
        <Inbox onSelectChat={handleSelectChat} />
      </div>

      <div className="chat-panel">
        {selectedChat.chatId ? (
          <Chat
            chatId={selectedChat.chatId}
            userId={user._id || user.email}
            propertyId={selectedChat.propertyId}
            ownerId={user._id || user.email}
          />
        ) : (
          <div className="chat-placeholder">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
}
