// src/pages/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import { fetchChatMessages, sendMessage, getChatByPropertyId } from "../api/PropertyAPI";
import "./Chat.css";

export default function Chat({ chatId, propertyId, userId, ownerId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState(chatId || null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-fetch chatId from propertyId if not provided
  useEffect(() => {
    if (!activeChatId && propertyId) {
      const fetchChatId = async () => {
        try {
          const chat = await getChatByPropertyId(propertyId);
          setActiveChatId(chat.chatId);
        } catch (err) {
          console.error("Failed to get chatId from propertyId:", err);
          setError("Unable to load chat.");
        }
      };
      fetchChatId();
    }
  }, [propertyId, activeChatId]);

  // Poll messages every 5 seconds
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    let interval;
    const fetchMessages = async () => {
      try {
        const msgs = await fetchChatMessages({ chatId: activeChatId });
        setMessages(msgs || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setError("Failed to fetch messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval);
  }, [activeChatId]);

  // Send a new message
  const handleSendMessage = async () => {
    if (!input.trim() || !activeChatId) return;

    const msgText = input;
    const timestamp = new Date().toISOString();
    setInput("");

    // Optimistic update
    setMessages((prev) => [
      ...prev,
      { sender: userId, text: msgText, timestamp, status: "sending" },
    ]);

    try {
      await sendMessage(activeChatId, msgText);
      setMessages((prev) =>
        prev.map((m) =>
          m.timestamp === timestamp ? { ...m, status: "sent" } : m
        )
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.timestamp === timestamp ? { ...m, status: "failed" } : m
        )
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const getSenderLabel = (sender) =>
    sender === userId ? "You" : sender === ownerId ? "Owner" : "Buyer";

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="chat-container">
      <div className="messages">
        {loading ? (
          <div className="loading-msg">Loading messages...</div>
        ) : error ? (
          <div className="error-msg">{error}</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">No messages yet</div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.sender === userId ? "own" : "other"}`}
            >
              <strong>{getSenderLabel(msg.sender)}:</strong> {msg.text}{" "}
              <span className="msg-time">{formatTime(msg.timestamp)}</span>
              {msg.status === "sending" && <span className="status sending">⏳</span>}
              {msg.status === "failed" && <span className="status failed">❌</span>}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={activeChatId ? "Type a message..." : "Select a property first"}
          onKeyDown={handleKeyPress}
          disabled={!activeChatId}
          aria-label="Chat input"
        />
        <button onClick={handleSendMessage} disabled={!activeChatId} aria-label="Send message">
          Send
        </button>
      </div>
    </div>
  );
}
