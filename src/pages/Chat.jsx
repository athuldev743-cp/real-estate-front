import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";

export default function Chat({ chatId, userId, propertyId, ownerId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const messageQueue = useRef([]);

  const PIE_SOCKET_URL =
    "wss://free.blr2.piesocket.com/v3/1?api_key=3ZvIvBkQHI9tmmL3ufNwIijE2uEPLuCBML43DuSv&notify_self=1";

  const parseMessage = (raw) => {
    try {
      const msg = JSON.parse(raw);
      return {
        chatId: msg.chatId || "",
        sender: msg.sender || "Unknown",
        text: msg.text || "",
        timestamp: msg.timestamp || Date.now(),
      };
    } catch {
      return {
        chatId: "",
        sender: "Unknown",
        text: raw,
        timestamp: Date.now(),
      };
    }
  };

  // ---------------- WebSocket Setup ----------------
  useEffect(() => {
    if (!chatId || !userId) return;

    ws.current = new WebSocket(PIE_SOCKET_URL);

    ws.current.onopen = () => {
      console.log("PieSocket WebSocket connected");
      messageQueue.current.forEach((msg) => ws.current.send(JSON.stringify(msg)));
      messageQueue.current = [];
    };

    ws.current.onmessage = (event) => {
      const msg = parseMessage(event.data);
      if (msg.chatId === chatId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    ws.current.onclose = () => console.log("WebSocket disconnected");
    ws.current.onerror = (err) => console.error("WebSocket error:", err);

    return () => ws.current?.close();
  }, [chatId, userId]);

  // ---------------- Scroll to bottom ----------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const msg = {
      chatId,
      propertyId,
      sender: userId,
      text: input,
      timestamp: Date.now(),
    };

    // Send via PieSocket
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    } else {
      messageQueue.current.push(msg);
    }

    // Save to backend for owner inbox
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/chat/${chatId}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text: input }),
      });
    } catch (err) {
      console.error("Failed to save message:", err);
    }

    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  // ---------------- Label Helper ----------------
  const getSenderLabel = (sender) => {
    if (sender === userId) return "You";
    if (sender === ownerId) return "Owner";
    return "Buyer";
  };

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
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
