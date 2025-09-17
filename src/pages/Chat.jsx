import React, { useState, useEffect, useRef } from "react";
import { sendMessage, getMessages } from "../api/PropertyAPI";
import "./Chat.css";

export default function Chat({ chatId, userId, propertyId, ownerId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // ---------------- Scroll to bottom ----------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------- Fetch messages ----------------
  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const res = await getMessages(chatId); // GET /chat/{chat_id}/messages
        setMessages(res.messages || []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();

    // Optional: poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [chatId]);

  // ---------------- Send message ----------------
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const msgText = input;
    setInput(""); // Clear input immediately

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      { sender: userId, text: msgText, timestamp: Date.now() },
    ]);

    try {
      await sendMessage(chatId, msgText); // POST /chat/{chat_id}/send
    } catch (err) {
      console.error("Failed to send message:", err);
      // Optionally, mark message as failed in UI
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const getSenderLabel = (sender) =>
    sender === userId ? "You" : sender === ownerId ? "Owner" : "Buyer";

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.sender === userId ? "own" : "other"}`}
          >
            <strong>{getSenderLabel(msg.sender)}:</strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
