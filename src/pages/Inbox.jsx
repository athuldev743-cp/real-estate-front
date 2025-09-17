// src/pages/Inbox.jsx
import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import { getInboxChats } from "../api/PropertyAPI"; // your backend API call
import "./Inbox.css";

export default function InboxPage() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null); // { chatId, propertyId }
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("email");
    setCurrentUserEmail(email);

    const fetchChats = async () => {
      try {
        const data = await getInboxChats();
        // Backend should return: [{ chat_id, property_id, user_name, last_message, unread_count }]
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

  const handleSelectChat = (chatId, propertyId) => {
    setSelectedChat({ chatId, propertyId });
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
            onClick={() => handleSelectChat(chat.chat_id, chat.property_id)}
          >
            <div className="chat-info">
              <div className="chat-header">
                <span className="chat-user">{chat.user_name}</span>
                {chat.last_message?.timestamp && (
                  <span className="chat-time">
                    {new Date(chat.last_message.timestamp).toLocaleTimeString()}
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
            ownerId={currentUserEmail} // Owner email
          />
        ) : (
          <div className="no-chat-selected">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
}
