import React, { useState, useEffect, useRef } from "react";
import { markMessagesAsRead } from "../api/PropertyAPI";
import "./Chat.css";

export default function Chat({ chatId, userId, propertyId, ownerId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const messageQueue = useRef([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!chatId || !userId || !token) return;

    const wsUrl = `wss://back-end-lybr.onrender.com/ws/${chatId}/${propertyId}?token=${token}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      messageQueue.current.forEach((msg) => ws.current.send(JSON.stringify(msg)));
      messageQueue.current = [];
    };

    ws.current.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        const [sender, ...textParts] = event.data.split(": ");
        data = { sender, text: textParts.join(": ") };
      }
      setMessages((prev) => [...prev, data]);
    };

    ws.current.onclose = () => console.log("WebSocket disconnected");
    ws.current.onerror = (err) => console.error("WebSocket error:", err);

    return () => ws.current?.close();
  }, [chatId, userId, propertyId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const msg = { sender: userId, text: input };

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    } else {
      messageQueue.current.push(msg);
      console.warn("Message queued, WebSocket not open yet.");
    }

    try {
      const res = await fetch(
        `https://back-end-lybr.onrender.com/chat/${chatId}/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sender: userId,
            property_id: propertyId,
            text: input,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to save message");
    } catch (err) {
      console.error("Error saving message:", err);
    }

    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  useEffect(() => {
    const markRead = async () => {
      if (userId === ownerId && chatId && messages.length > 0) {
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
          <div key={idx} className={`message ${msg.sender === userId ? "own" : "other"}`}>
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
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
