import React, { useState, useEffect, useRef } from "react";
import Inbox from "../pages/Inbox";
import Chat from "../pages/Chat";
import "./OwnerDashboard.css";

export default function OwnerDashboard() {
  const [selectedChat, setSelectedChat] = useState({ chatId: null, propertyId: null });
  const [user, setUser] = useState(null);
  const [inbox, setInbox] = useState([]);
  const wsRef = useRef(null);

  // Load current user info
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Fetch inbox
  const fetchInbox = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/chat/inbox`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch inbox");

      const data = await res.json();
      setInbox(data.inbox || []);
    } catch (err) {
      console.error("Error fetching inbox:", err);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  // Real-time inbox updates using PieSocket
  useEffect(() => {
    if (!user) return;

    const apiKey = "3ZvIvBkQHI9tmmL3ufNwIijE2uEPLuCBML43DuSv"; // PieSocket API key
    const wsUrl = `wss://free.blr2.piesocket.com/v3/1?api_key=${apiKey}&notify_self=1`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => console.log("PieSocket connected");
    wsRef.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        // Update inbox if message belongs to any chat
        setInbox((prev) => {
          const idx = prev.findIndex((c) => c.chat_id === msg.chat_id);
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx].last_message = msg;
            updated[idx].unread_count = (updated[idx].unread_count || 0) + 1;
            return updated;
          }
          return prev;
        });
      } catch (err) {
        console.error("Error parsing PieSocket message:", err);
      }
    };

    wsRef.current.onclose = () => console.log("PieSocket disconnected");
    wsRef.current.onerror = (err) => console.error("PieSocket error:", err);

    return () => wsRef.current?.close();
  }, [user]);

  const handleSelectChat = (chatId, propertyId) => {
    // Reset unread count for selected chat
    setInbox((prev) =>
      prev.map((c) =>
        c.chat_id === chatId ? { ...c, unread_count: 0 } : c
      )
    );
    setSelectedChat({ chatId, propertyId });
  };

  if (!user) return <div>Loading user info...</div>;

  return (
    <div className="owner-dashboard">
      <div className="inbox-panel">
        <h2>Inbox</h2>
        <Inbox onSelectChat={handleSelectChat} chats={inbox} />
      </div>

      <div className="chat-panel">
        {selectedChat.chatId ? (
          <Chat
            chatId={selectedChat.chatId}
            userId={user._id || user.email}
            propertyId={selectedChat.propertyId}
            ownerId={user._id || user.email}
          />
        ) : (
          <div className="chat-placeholder">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
}
