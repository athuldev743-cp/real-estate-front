import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById, getMessages } from "../api/PropertyAPI";
import Chat from "./Chat";
import "./PropertyDetails.css";

export default function PropertyDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatData, setChatData] = useState(null);

  const currentUser = user || {
    fullName: localStorage.getItem("fullName"),
    email: localStorage.getItem("email"),
  };
  const userEmail = currentUser?.email?.trim().toLowerCase() || null;

  // Redirect to login if no user
  useEffect(() => {
    if (!userEmail) navigate("/login");
  }, [userEmail, navigate]);

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error("Error fetching property details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const isOwner = userEmail === property?.owner_email?.trim().toLowerCase();

  // In handleChatOpen
const handleOpenChat = async () => {
  if (!property.ownerId) {
    alert("Cannot start chat: Property owner not set yet.");
    return;
  }

  try {
    const res = await getMessages(property._id); // returns { chatId, messages }
    setActiveChat({
      chatId: res.chatId,
      propertyId: property._id,
      ownerId: property.ownerId,
    });
  } catch (err) {
    console.error("Failed to open chat:", err);
    alert("Unable to start chat. Try again later.");
  }
};


  const handleChatClose = () => {
    setChatOpen(false);
    setChatData(null);
  };

  if (loading) return <p className="center-text">Loading property...</p>;
  if (!property) return <p className="center-text">Property not found.</p>;

  return (
    <div className="property-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="property-header">
        <h1>{property.title || "Untitled Property"}</h1>
        <p>{property.category?.toUpperCase() || "N/A"} • {property.location || "Unknown"}</p>
      </div>

      <div className="property-main">
        <div className="property-image-container">
          <img
            src={property.image_url || "/image/default-property.jpeg"}
            alt={property.title}
            className="property-image"
          />
        </div>

        <div className="property-info">
          <h2>Property Details</h2>
          <p>{property.description || "No description available."}</p>
          <p className="price"><strong>Price:</strong> ₹{property.price || "N/A"}</p>
          <p><strong>Location:</strong> {property.location || "Unknown"}</p>
          <p><strong>Category:</strong> {property.category || "N/A"}</p>
          <p><strong>Owner:</strong> {property.owner_email || "N/A"}</p>
          <p><strong>Contact Mobile:</strong> {property.mobileNO || "N/A"}</p>

          {!isOwner && (
            <button className="chat-btn" onClick={handleChatOpen}>
              💬 Chat with Seller
            </button>
          )}
          {isOwner && <p className="owner-label">You are the owner of this property</p>}
        </div>
      </div>

      {chatOpen && chatData && (
        <div className="chat-modal">
          <button className="chat-close-btn" onClick={handleChatClose}>✖</button>
          <Chat
            chatId={chatData.chatId}
            userId={userEmail} 
            propertyId={chatData.propertyId}
            ownerId={chatData.ownerId} 
          />
        </div>
      )}
    </div>
  );
}
