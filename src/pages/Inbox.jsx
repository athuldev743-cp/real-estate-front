export default function Inbox({ onSelectChat, chats: propChats }) {
  const [chats, setChats] = useState(propChats || []);
  const [loading, setLoading] = useState(!propChats);
  const currentUserEmail = localStorage.getItem("email");

  // Update local chats when propChats changes
  useEffect(() => {
    if (propChats) setChats(propChats);
  }, [propChats]);

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
          }}
        >
          <div className="chat-info">
            <div className="chat-header">
              <span className="chat-user">{chat.user_name}</span>
              {chat.last_message?.timestamp && (
                <span className="chat-time">{new Date(chat.last_message.timestamp).toLocaleTimeString()}</span>
              )}
            </div>
            {chat.last_message && <div className="chat-last-msg">{chat.last_message.text}</div>}
          </div>
          {chat.unread_count > 0 && <span className="unread-badge">{chat.unread_count}</span>}
        </div>
      ))}
    </div>
  );
}
