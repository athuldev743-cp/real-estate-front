import React, { useState, useEffect, useRef } from "react";
import { sendMessage as sendMsgAPI } from "../api/PropertyAPI";
import "./Chat.css";

export default function Chat({ chatId, userId, propertyId, ownerId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const messageQueue = useRef([]);

  const PIE_SOCKET_URL = process.env.REACT_APP_WS_URL;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------- WebSocket Setup ----------------
  useEffect(() => {
    if (!chatId || !userId) return;

    ws.current = new WebSocket(PIE_SOCKET_URL);

    ws.current.onopen = () => {
      console.log("PieSocket connected");
      messageQueue.current.forEach((msg) => ws.current.send(JSON.stringify(msg)));
      messageQueue.current = [];
    };

    ws.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.chatId === chatId) {
          setMessages((prev) => [...prev, msg]);
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.current.onerror = (err) => console.error("WebSocket error:", err);
    ws.current.onclose = () => console.log("WebSocket disconnected");

    return () => ws.current?.close();
  }, [chatId, userId]);

  // ---------------- Send Message ----------------
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const msg = {
      chatId,
      propertyId,
      sender: userId,
      text: input,
      timestamp: Date.now(),
    };

    // Send via WebSocket
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    } else {
      messageQueue.current.push(msg);
    }

    // Save to backend
    try {
      await sendMsgAPI(chatId, input);
    } catch (err) {
      console.error("Failed to save message:", err);
    }

    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  const getSenderLabel = (sender) => (sender === userId ? "You" : sender === ownerId ? "Owner" : "Buyer");

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender === userId ? "own" : "other"}`}>
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
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
