// src/pages/Inbox.jsx
import React from "react";
import "./Inbox.css";

export default function Inbox({ chats, onSelectChat }) {
  if (!chats || chats.length === 0) return <p>No chats yet.</p>;

  return (
    <div className="inbox-list">
      <h2>Inbox</h2>
      {chats.map((chat) => (
        <div
          key={chat.chat_id}
          className="inbox-item"
          onClick={() => onSelectChat(chat)}
        >
          <div className="chat-info">
            <div className="chat-header">
              <span className="chat-user">{chat.user_name}</span>
              {chat.last_message?.timestamp && (
                <span className="chat-time">
                  {new Date(chat.last_message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
  );
}
