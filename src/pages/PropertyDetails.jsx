// src/pages/PropertyDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPropertyById,
  getChatByPropertyId,
  addToCart as addToCartAPI,
} from "../api/PropertyAPI";
import Chat from "./Chat";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./PropertyDetails.css";
import { FaShoppingCart } from "react-icons/fa";

export default function PropertyDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatData, setChatData] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  const currentUser = user || {
    fullName: localStorage.getItem("fullName"),
    email: localStorage.getItem("email"),
  };
  const userEmail = currentUser?.email?.trim().toLowerCase() || null;

  useEffect(() => {
    if (!userEmail) navigate("/login");
  }, [userEmail, navigate]);

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

  const isOwner =
    userEmail && property?.owner
      ? userEmail === property.owner.trim().toLowerCase()
      : false;

  // ----- Open chat -----
  const handleChatOpen = async () => {
    if (!property?._id) return;

    try {
      const chat = await getChatByPropertyId(property._id);

      if (!chat.chatId) {
        alert("Chat could not be started for this property.");
        return;
      }

      // Set chat data immediately for initial messages
      setChatData({
        chatId: chat.chatId,
        propertyId: property._id,
        ownerId: property.owner,
        messages: chat.messages || [],
      });

      setChatOpen(true);
    } catch (err) {
      console.error("Failed to open chat:", err);
      alert("Unable to start chat. Try again later.");
    }
  };

  // ----- Close chat -----
  const handleChatClose = () => {
    setChatOpen(false);
    setChatData(null);
  };

  // ----- Add to cart -----
  const addToCart = async () => {
    if (!property?._id) return;

    try {
      const res = await addToCartAPI(property._id);

      if (res?.message === "Added to cart") {
        alert(`${property.title} added to cart!`);
      } else {
        alert("This property might already be in your cart.");
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);

      if (err.response?.status === 401) {
        alert("Your session expired. Please log in again.");
        localStorage.clear();
        navigate("/login");
      } else if (err.response?.status === 404) {
        alert("Property not found.");
      } else if (err.response?.status === 422) {
        alert("This property is already in your cart.");
      } else {
        alert("Failed to add to cart. Try again later.");
      }
    }
  };

  // ----- Lightbox -----
  const openLightbox = (img) => setLightboxImage(img);
  const closeLightbox = () => setLightboxImage(null);

  if (loading) return <p className="center-text">Loading property...</p>;
  if (!property) return <p className="center-text">Property not found.</p>;

  return (
    <div className="property-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Property Header */}
      <div className="property-header">
        <h1>{property.title || "Untitled Property"}</h1>
        <p>{property.category?.toUpperCase() || "N/A"}</p>
      </div>

      <div className="property-main">
        {/* Image Gallery */}
        <div className="property-image-row-container">
          {property.images?.length > 0 ? (
            property.images.map((img, index) => (
              <img
                key={index}
                src={img || "/image/default-property.jpeg"}
                alt={`Property ${index}`}
                className="property-image"
                onClick={() => openLightbox(img)}
              />
            ))
          ) : (
            <img
              src="/image/default-property.jpeg"
              alt="Default Property"
              className="property-image"
              onClick={() => openLightbox("/image/default-property.jpeg")}
            />
          )}
        </div>

        {/* Property Info */}
        <div className="property-info">
          <h2>Property Details</h2>
          <p>{property.description || "No description available."}</p>
          <p className="price">
            <strong>Price:</strong> ₹{property.price || "N/A"}
          </p>
          <p>
            <strong>Category:</strong> {property.category || "N/A"}
          </p>
          <p>
            <strong>Owner:</strong> {property.ownerFullName || property.owner || "N/A"}
          </p>
          <p>
            <strong>Contact Mobile:</strong> {property.mobileNO || "N/A"}
          </p>

          <div className="action-buttons">
            {!isOwner && (
              <button className="chat-btn" onClick={handleChatOpen}>
                💬 Chat with Seller
              </button>
            )}
            {!isOwner && (
              <button className="add-to-cart-btn" onClick={addToCart}>
                <FaShoppingCart /> Add to Cart
              </button>
            )}
          </div>

          {isOwner && <p className="owner-label">You are the owner of this property</p>}
        </div>
      </div>

      {/* Map */}
      {property.latitude && property.longitude && (
        <div className="property-map">
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

      {/* Chat Modal */}
      {chatOpen && chatData && (
        <div className="chat-modal">
          <button className="chat-close-btn" onClick={handleChatClose}>
            ✖
          </button>
          <Chat
            chatId={chatData.chatId}
            userId={userEmail}
            propertyId={chatData.propertyId}
            ownerId={chatData.ownerId}
            initialMessages={chatData.messages} // first messages immediately shown
          />
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <img src={lightboxImage} alt="Full Property" />
        </div>
      )}
    </div>
  );
}
