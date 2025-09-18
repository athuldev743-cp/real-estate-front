// src/pages/Inbox.jsx
import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import { getOwnerInbox, getBuyerInbox } from "../api/PropertyAPI";
import "./Inbox.css";

export default function Inbox({ isOwner = true }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("email");
    setCurrentUserEmail(email);

    const fetchChats = async () => {
      try {
        const data = isOwner ? await getOwnerInbox() : await getBuyerInbox();
        setChats(data || []);
      } catch (err) {
        console.error("Failed to fetch inbox chats:", err);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [isOwner]);

  const handleSelectChat = (chat) => {
    setSelectedChat({
      chatId: chat.chatId,
      propertyId: chat.propertyId,
      ownerId: chat.ownerId || currentUserEmail,
      buyerId: chat.buyerId || currentUserEmail,
      initialMessages: chat.messages || [], // Pass last messages instantly
    });
  };

  if (loading) return <div>Loading chats...</div>;
  if (!loading && chats.length === 0) return <div>No chats yet.</div>;

  return (
    <div className="inbox-page">
      <div className="inbox-list">
        <h2>Inbox</h2>
        {chats.map((chat) => {
          const displayName = isOwner ? chat.buyerId : chat.ownerId;
          const lastMsgText = chat.lastMessage?.text || "No messages yet";
          const lastMsgTime = chat.lastMessage?.timestamp
            ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";
          return (
            <div
              key={chat.chatId}
              className="inbox-item"
              onClick={() => handleSelectChat(chat)}
            >
              <div className="chat-info">
                <div className="chat-header">
                  <span className="chat-user">{displayName}</span>
                  {lastMsgTime && <span className="chat-time">{lastMsgTime}</span>}
                </div>
                <div className="chat-last-msg">{lastMsgText}</div>
              </div>
              {chat.unreadCount > 0 && (
                <span className="unread-badge">{chat.unreadCount}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="chat-container">
        {selectedChat ? (
          <Chat
            chatId={selectedChat.chatId}
            userId={currentUserEmail}
            ownerId={selectedChat.ownerId}
            initialMessages={selectedChat.initialMessages} // show last messages instantly
          />
        ) : (
          <div className="no-chat-selected">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
}
