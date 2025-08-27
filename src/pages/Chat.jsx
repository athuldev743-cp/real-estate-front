import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";

export default function Chat({ chatId, userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to backend WebSocket
    ws.current = new WebSocket(
      `wss://back-end-lybr.onrender.com/ws/${chatId}/${userId}`
    );

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // expect { sender, text }
        setMessages((prev) => [...prev, data]);
      } catch {
        // fallback if plain text
        setMessages((prev) => [...prev, { sender: "Server", text: event.data }]);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => ws.current.close();
  }, [chatId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const msg = { sender: userId, text: input };
      ws.current.send(JSON.stringify(msg));
      setMessages((prev) => [...prev, msg]);
    } else {
      console.error("WebSocket not open.");
    }
    setInput("");
  };

  return (
    <div className="chat-container">
      {/* Messages area */}
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

      {/* Input + Send button */}
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
