import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById, getMessages } from "../api/PropertyAPI";
import Chat from "./Chat";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./PropertyDetails.css";
import { FaShoppingCart } from "react-icons/fa";

export default function PropertyDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const galleryRef = useRef(null); // Ref for gallery scrolling

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatData, setChatData] = useState(null);

  // Cart state
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Current user info
  const currentUser = user || {
    fullName: localStorage.getItem("fullName"),
    email: localStorage.getItem("email"),
  };
  const userEmail = currentUser?.email?.trim().toLowerCase() || null;

  // Redirect to login if not logged in
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

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const isOwner = userEmail === property?.owner?.trim().toLowerCase();

  // Open chat
  const handleChatOpen = async () => {
    try {
      const res = await getMessages(property._id);
      setChatData({
        chatId: res.chatId,
        propertyId: property._id,
        ownerId: property.owner,
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

  // Add to cart
  const addToCart = () => {
    if (!cart.find((item) => item._id === property._id)) {
      setCart([...cart, property]);
      alert(`${property.title} added to cart!`);
    } else {
      alert("This property is already in your cart.");
    }
  };

  // Scroll gallery
  const scrollGallery = (dir) => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
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
        {/* ---------- Image Gallery Row ---------- */}
        <div className="property-image-container">
          <button className="gallery-arrow left" onClick={() => scrollGallery("left")}>◀</button>

          <div className="property-images-row" ref={galleryRef}>
            {property.images && property.images.length > 0 ? (
              property.images.map((img, index) => (
                <img
                  key={index}
                  src={img || "/image/default-property.jpeg"}
                  alt={`Property ${index}`}
                  className="property-image"
                />
              ))
            ) : (
              <img
                src="/image/default-property.jpeg"
                alt="Default Property"
                className="property-image"
              />
            )}
          </div>

          <button className="gallery-arrow right" onClick={() => scrollGallery("right")}>▶</button>
        </div>

        {/* ---------- Property Info ---------- */}
        <div className="property-info">
          <h2>Property Details</h2>
          <p>{property.description || "No description available."}</p>
          <p className="price"><strong>Price:</strong> ₹{property.price || "N/A"}</p>
          <p><strong>Category:</strong> {property.category || "N/A"}</p>
          <p><strong>Owner:</strong> {property.ownerFullName || property.owner || "N/A"}</p>
          <p><strong>Contact Mobile:</strong> {property.mobileNO || "N/A"}</p>

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

      {/* ---------- Map ---------- */}
      {property.latitude && property.longitude && (
        <div className="property-map">
          <MapContainer
            center={[property.latitude, property.longitude]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[property.latitude, property.longitude]}>
              <Popup>{property.title}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {/* ---------- Chat Modal ---------- */}
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
