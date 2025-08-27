import React, { useState, useEffect, useRef } from "react";

export default function Chat({ chatId, userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    // Correct WebSocket URL: wss:// + /ws/ path
    ws.current = new WebSocket(`wss://back-end-lybr.onrender.com/ws/${chatId}/${userId}`);

    ws.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => ws.current.close();
  }, [chatId, userId]);

  const sendMessage = () => {
    if (!input) return;
    ws.current.send(input);
    setMessages((prev) => [...prev, `You: ${input}`]);
    setInput("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          flex: 1,
          padding: "10px",
          overflowY: "auto",
          borderBottom: "1px solid #ccc",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "5px 0" }}>
            {msg}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", padding: "10px", gap: "5px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
