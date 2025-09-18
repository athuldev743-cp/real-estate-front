// src/pages/Inbox.jsx
import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import { getOwnerInbox } from "../api/PropertyAPI";
import "./Inbox.css";

export default function InboxPage() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null); // { propertyId, chatId }
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("email");
    setCurrentUserEmail(email);

    const fetchChats = async () => {
      try {
        const data = await getOwnerInbox();
        setChats(data || []);
      } catch (err) {
        console.error("Failed to fetch inbox chats:", err);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleSelectChat = (chat) => {
    if (!chat.property_id) return;
    setSelectedChat({ propertyId: chat.property_id, chatId: chat.chat_id });
  };

  if (loading) return <div>Loading chats...</div>;
  if (!loading && chats.length === 0) return <div>No chats yet.</div>;

  return (
    <div className="inbox-page">
      <div className="inbox-list">
        <h2>Inbox</h2>
        {chats.map((chat) => (
          <div
            key={chat.chat_id}
            className="inbox-item"
            onClick={() => handleSelectChat(chat)}
          >
            <div className="chat-info">
              <div className="chat-header">
                <span className="chat-user">{chat.user_name}</span>
                {chat.last_message?.timestamp && (
                  <span className="chat-time">
                    {new Date(chat.last_message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
              {chat.last_message && (
                <div className="chat-last-msg">{chat.last_message.text}</div>
              )}
            </div>
            {chat.unread_count > 0 && (
              <span className="unread-badge">{chat.unread_count}</span>
            )}
          </div>
        ))}
      </div>

      <div className="chat-container">
        {selectedChat ? (
          <Chat
            chatId={selectedChat.chatId}
            propertyId={selectedChat.propertyId}
            userId={currentUserEmail}
            ownerId={currentUserEmail}
          />
        ) : (
          <div className="no-chat-selected">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
}
