import React, { useState } from "react";
import Inbox from "./Inbox";
import Chat from "./Chat";
import "./OwnerDashboard.css";

export default function OwnerDashboard() {
  const [selectedChat, setSelectedChat] = useState({
    chatId: null,
    propertyId: null,
  });

  const handleSelectChat = (chatId, propertyId) => {
    setSelectedChat({ chatId, propertyId });
  };

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
            userId={localStorage.getItem("fullName")}
            propertyId={selectedChat.propertyId}
            ownerId={localStorage.getItem("fullName")}
          />
        ) : (
          <div className="chat-placeholder">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
}
