import React, { useEffect, useState, useRef } from "react";

// Helper to format timestamp
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hr ago`;
  return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function Inbox({ onSelectChat }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const ws = useRef(null);

  const token = localStorage.getItem("token");
  const currentUserEmail = localStorage.getItem("email");
  const PIE_WS_URL = process.env.REACT_APP_WS_URL;

  // Handle incoming PieSocket message
  const handleIncomingMessage = (raw) => {
    try {
      const msg = JSON.parse(raw);
      if (!msg.chatId) return;

      setChats((prev) => {
        const chatIndex = prev.findIndex((c) => c.chat_id === msg.chatId);
        if (chatIndex >= 0) {
          const updated = [...prev];
          updated[chatIndex] = {
            ...updated[chatIndex],
            last_message: msg,
            unread_count: (updated[chatIndex].unread_count || 0) + (msg.sender !== currentUserEmail ? 1 : 0),
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              chat_id: msg.chatId,
              property_id: msg.propertyId,
              user_name: msg.sender === currentUserEmail ? "You" : "Owner",
              last_message: msg,
              unread_count: msg.sender !== currentUserEmail ? 1 : 0,
            },
          ];
        }
      });
    } catch (err) {
      console.error("Failed to parse PieSocket message:", err);
    }
  };

  // Fetch existing chats from backend
  useEffect(() => {
    if (!token) return;

    const fetchChats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/inbox`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch inbox");
        const data = await res.json();

        const formatted = data.chats.map((chat) => ({
          ...chat,
          user_name: chat.participants.find((e) => e !== currentUserEmail) || "Owner",
          last_message: chat.last_message || null,
          unread_count: chat.messages.filter((m) => !m.read && m.sender !== currentUserEmail).length,
        }));

        setChats(formatted);
      } catch (err) {
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [token]);

  // PieSocket WebSocket for real-time updates
  useEffect(() => {
    if (!token || !PIE_WS_URL) return;

    ws.current = new WebSocket(PIE_WS_URL);

    ws.current.onopen = () => console.log("PieSocket connected");
    ws.current.onmessage = (event) => handleIncomingMessage(event.data);
    ws.current.onerror = (err) => console.error("PieSocket error:", err);
    ws.current.onclose = () => console.log("PieSocket disconnected");

    return () => ws.current?.close();
  }, [token, PIE_WS_URL]);

  if (loading) return <div>Loading chats...</div>;
  if (chats.length === 0) return <div>No chats yet.</div>;

  return (
    <div className="inbox">
      {chats.map((chat) => (
        <div
          key={chat.chat_id}
          className="inbox-item"
          onClick={() => {
            onSelectChat(chat.chat_id, chat.property_id);
            setChats((prev) =>
              prev.map((c) => (c.chat_id === chat.chat_id ? { ...c, unread_count: 0 } : c))
            );
          }}
        >
          <div className="chat-info">
            <div className="chat-header">
              <span className="chat-user">{chat.user_name}</span>
              {chat.last_message?.timestamp && (
                <span className="chat-time">{formatTime(chat.last_message.timestamp)}</span>
              )}
            </div>
            {chat.last_message && (
              <div className="chat-last-msg">{chat.last_message.text}</div>
            )}
          </div>
          {chat.unread_count > 0 && <span className="unread-badge">{chat.unread_count}</span>}
        </div>
      ))}
    </div>
  );
}
