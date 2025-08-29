import React, { useEffect, useState, useRef } from "react";

export default function Inbox({ onSelectChat }) {
  const [chats, setChats] = useState([]);
  const ws = useRef(null);

  const token = localStorage.getItem("token");

  // Function to parse incoming message
  const handleIncomingMessage = (raw) => {
    try {
      const msg = JSON.parse(raw);
      // Update inbox state: increment unread_count or add new chat
      setChats((prev) => {
        const chatIndex = prev.findIndex((c) => c.chat_id === msg.chat_id);
        if (chatIndex >= 0) {
          const updated = [...prev];
          updated[chatIndex] = {
            ...updated[chatIndex],
            last_message: msg,
            unread_count: (updated[chatIndex].unread_count || 0) + 1,
          };
          return updated;
        } else {
          // If chat not in inbox, add it
          return [
            ...prev,
            {
              chat_id: msg.chat_id,
              property_id: msg.property_id,
              last_message: msg,
              unread_count: 1,
            },
          ];
        }
      });
    } catch (err) {
      console.error("Failed to parse incoming PieSocket message:", err);
    }
  };

  useEffect(() => {
    if (!token) return;

    // PieSocket free cluster WebSocket
    const PIE_WS_URL =
      "wss://free.blr2.piesocket.com/v3/1?api_key=3ZvIvBkQHI9tmmL3ufNwIijE2uEPLuCBML43DuSv&notify_self=1";

    ws.current = new WebSocket(PIE_WS_URL);

    ws.current.onopen = () => {
      console.log("PieSocket connected");
    };

    ws.current.onmessage = (event) => {
      handleIncomingMessage(event.data);
    };

    ws.current.onerror = (err) => console.error("PieSocket error:", err);
    ws.current.onclose = () => console.log("PieSocket disconnected");

    return () => ws.current?.close();
  }, [token]);

  if (chats.length === 0) return <div>No chats yet.</div>;

  return (
    <div className="inbox">
      {chats.map((chat) => (
        <div
          key={chat.chat_id}
          className="inbox-item"
          onClick={() => {
            onSelectChat(chat.chat_id, chat.property_id);
            // Reset unread count on click
            setChats((prev) =>
              prev.map((c) =>
                c.chat_id === chat.chat_id ? { ...c, unread_count: 0 } : c
              )
            );
          }}
        >
          <div className="chat-info">
            <div className="chat-property">Property ID: {chat.property_id}</div>
            {chat.last_message && (
              <div className="chat-last-msg">{chat.last_message.text}</div>
            )}
          </div>
          {chat.unread_count > 0 && (
            <span className="unread-badge">{chat.unread_count}</span>
          )}
        </div>
      ))}
    </div>
  );
}
