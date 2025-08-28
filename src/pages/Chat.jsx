import React, { useState, useEffect, useRef } from "react";
import { markMessagesAsRead } from "../api/PropertyAPI";
import "./Chat.css";

export default function Chat({ chatId, userId, propertyId, ownerId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  // ---------------- Get JWT token from localStorage ----------------
  const token = localStorage.getItem("access_token");

  // ---------------- Connect WebSocket ----------------
  useEffect(() => {
    if (!chatId || !userId || !token) return;

    // Construct URL with query parameter
    const wsUrl = `wss://back-end-lybr.onrender.com/ws/${chatId}/${propertyId}?token=${token}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => console.log("WebSocket connected");

    ws.current.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data); // Expect JSON {sender, text, read}
      } catch {
        // Fallback for plain text
        const [sender, ...textParts] = event.data.split(": ");
        data = { sender, text: textParts.join(": ") };
      }
      setMessages((prev) => [...prev, data]);
    };

    ws.current.onclose = () => console.log("WebSocket disconnected");
    ws.current.onerror = (err) => console.error("WebSocket error:", err);

    return () => ws.current?.close();
  }, [chatId, userId, propertyId, token]);

  // ---------------- Auto scroll to bottom ----------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------- Send message ----------------
  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = { sender: userId, text: input };

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
      setMessages((prev) => [...prev, msg]);
    } else {
      console.error("WebSocket not open.");
    }

    setInput("");
  };

  // ---------------- Mark messages as read (owner) ----------------
  useEffect(() => {
    const markRead = async () => {
      if (userId === ownerId && chatId) {
        try {
          await markMessagesAsRead(chatId);
        } catch (err) {
          console.error("Failed to mark messages as read:", err);
        }
      }
    };
    markRead();
  }, [messages, chatId, userId, ownerId]);

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.sender === userId ? "own" : "other"}`}
          >
            <strong>{msg.sender === userId ? "You" : msg.sender}:</strong>{" "}
            {msg.text}
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
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
