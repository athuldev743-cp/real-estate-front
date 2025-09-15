import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById, getMessages } from "../api/PropertyAPI";
import Chat from "./Chat";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./PropertyDetails.css";

export default function PropertyDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatData, setChatData] = useState(null);

  // Current user info
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

  // Check if current user is owner
  const isOwner = userEmail === property?.owner?.trim().toLowerCase();

  // Open chat with property owner
  const handleChatOpen = async () => {
    try {
      const res = await getMessages(property._id); // returns { chatId, messages }
      setChatData({
        chatId: res.chatId,
        propertyId: property._id,
        ownerId: property.owner, // email of owner
      });
      setChatOpen(true);
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
        <p>{property.category?.toUpperCase() || "N/A"}</p>
      </div>

      <div className="property-main">
        <div className="property-image-container">
          <img
            src={property.images?.[0] || "/image/default-property.jpeg"}
            alt={property.title}
            className="property-image"
          />
        </div>

        <div className="property-info">
          <h2>Property Details</h2>
          <p>{property.description || "No description available."}</p>
          <p className="price"><strong>Price:</strong> ₹{property.price || "N/A"}</p>
          <p><strong>Category:</strong> {property.category || "N/A"}</p>
          <p><strong>Owner:</strong> {property.ownerFullName || property.owner || "N/A"}</p>
          <p><strong>Contact Mobile:</strong> {property.mobileNO || "N/A"}</p>

          {!isOwner && (
            <button className="chat-btn" onClick={handleChatOpen}>
              💬 Chat with Seller
            </button>
          )}
          {isOwner && <p className="owner-label">You are the owner of this property</p>}
        </div>
      </div>

      {/* Map for buyers */}
      {property.latitude && property.longitude && (
        <div className="property-map" style={{ height: "300px", width: "100%", marginTop: "20px" }}>
          <MapContainer
            center={[property.latitude, property.longitude]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[property.latitude, property.longitude]}>
              <Popup>{property.title}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

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
