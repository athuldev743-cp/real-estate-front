import React, { useState, useEffect, useRef } from "react";
import { sendMessage, markMessagesAsRead } from "../api/PropertyAPI";
import "./Chat.css";

export default function Chat({ chatId, userId, propertyId, ownerId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const messageQueue = useRef([]);

  const parseMessage = (raw) => {
    try {
      const msg = JSON.parse(raw);
      return {
        sender: msg.sender || "Unknown",
        text: msg.text || "",
        timestamp: msg.timestamp || Date.now(),
        read: msg.read ?? false,
      };
    } catch {
      // fallback for unexpected plain text
      return {
        sender: "Unknown",
        text: raw,
        timestamp: Date.now(),
        read: false,
      };
    }
  };

  // ---------------- WebSocket Setup ----------------
  useEffect(() => {
    if (!chatId || !userId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const wsUrl = `wss://back-end-lybr.onrender.com/ws/${chatId}/${propertyId}?token=${token}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      // Send queued messages
      messageQueue.current.forEach((msg) => ws.current.send(JSON.stringify(msg)));
      messageQueue.current = [];
    };

    ws.current.onmessage = (event) => {
      const msg = parseMessage(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    ws.current.onclose = () => console.log("WebSocket disconnected");
    ws.current.onerror = (err) => console.error("WebSocket error:", err);

    return () => ws.current?.close();
  }, [chatId, userId, propertyId]);

  // ---------------- Scroll to bottom ----------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------- Send message ----------------
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const msg = {
      sender: userId,
      text: input,
      timestamp: Date.now(),
      read: false,
    };

    // WebSocket send or queue
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    } else {
      messageQueue.current.push(msg);
      console.warn("Message queued, WebSocket not open yet.");
    }

    // Save to backend via API
    try {
      await sendMessage(chatId, input);
    } catch (err) {
      console.error("Failed to send message via API:", err);
    }

    setInput("");
  };

  // ---------------- Mark messages as read (debounced) ----------------
  useEffect(() => {
    if (!chatId || !ownerId || messages.length === 0) return;

    const timeout = setTimeout(async () => {
      if (userId === ownerId) {
        try {
          await markMessagesAsRead(chatId);
        } catch (err) {
          console.error("Failed to mark messages as read:", err);
        }
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [messages, chatId, userId, ownerId]);

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.sender === userId ? "own" : "other"}`}
          >
            <strong>{msg.sender === userId ? "You" : msg.sender}:</strong> {msg.text}
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
