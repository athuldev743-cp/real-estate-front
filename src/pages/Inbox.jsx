import React, { useEffect, useState } from "react";

export default function Inbox({ onSelectChat }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInbox = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/inbox`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch inbox");

      const data = await res.json();
      setChats(data.inbox || []);
    } catch (err) {
      console.error("Error fetching inbox:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
    const interval = setInterval(fetchInbox, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading inbox...</div>;
  if (chats.length === 0) return <div>No chats yet.</div>;

  return (
    <div className="inbox">
      {chats.map((chat) => (
        <div
          key={chat.chat_id}
          className="inbox-item"
          onClick={() => onSelectChat(chat.chat_id, chat.property_id)}
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
