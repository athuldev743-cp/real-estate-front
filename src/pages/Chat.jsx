// src/pages/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import { fetchChatMessages, sendMessage } from "../api/PropertyAPI";
import "./Chat.css";

export default function Chat({ chatId, propertyId, userId, ownerId, buyerId, initialMessages = [] }) {
  const [messages, setMessages] = useState(Array.isArray(initialMessages) ? initialMessages : []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(messages.length === 0);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll messages every 5s
  useEffect(() => {
    if (!chatId) return;

    let interval;

    const fetchMessages = async () => {
      try {
        const msgs = await fetchChatMessages(chatId);
        if (Array.isArray(msgs)) {
          setMessages((prev) => {
            if (prev.length !== msgs.length) return msgs;
            return prev;
          });
        }
      } catch (err) {
        console.error("❌ Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };

    if (messages.length === 0) fetchMessages();
    interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval);
  }, [chatId]);

  // Send message
  const handleSendMessage = async () => {
    if (!input.trim() || !chatId) return;

    const msgText = input.trim();
    const timestamp = new Date().toISOString();
    setInput("");

    // Optimistic update
    setMessages((prev) => [
      ...prev,
      { sender: userId, text: msgText, timestamp, status: "sending" },
    ]);

    try {
      await sendMessage(chatId, msgText);
      setMessages((prev) =>
        prev.map((m) => (m.timestamp === timestamp ? { ...m, status: "sent" } : m))
      );
    } catch (err) {
      console.error("❌ Failed to send message:", err);
      setMessages((prev) =>
        prev.map((m) => (m.timestamp === timestamp ? { ...m, status: "failed" } : m))
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  // Label messages
  const getSenderLabel = (sender) => {
    if (sender === userId) return "You";
    if (sender === ownerId) return "Owner";
    if (sender === buyerId) return "Buyer";
    return sender;
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {loading ? (
          <div className="loading-msg">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">No messages yet</div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.sender === userId ? "own" : "other"}`}
            >
              <strong>{getSenderLabel(msg.sender)}:</strong> {msg.text}{" "}
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
          placeholder={chatId ? "Type a message..." : "Select a property first"}
          onKeyDown={handleKeyPress}
          disabled={!chatId}
        />
        <button onClick={handleSendMessage} disabled={!chatId}>
          Send
        </button>
      </div>
    </div>
  );
}
