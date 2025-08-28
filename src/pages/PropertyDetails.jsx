import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById } from "../api/PropertyAPI";
import Chat from "./Chat"; // WebSocket chat component
import "./PropertyDetails.css";

export default function PropertyDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  // Get user info from prop or localStorage
  const currentUser = user || {
    fullName: localStorage.getItem("fullName"),
    email: localStorage.getItem("email"),
  };

  const userEmail = currentUser?.email?.trim().toLowerCase() || null;

  // Redirect if not logged in
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

  if (loading) return <p className="center-text">Loading property...</p>;
  if (!property) return <p className="center-text">Property not found.</p>;

  // Compare emails in lowercase to avoid mismatch
  const isOwner = userEmail === property.owner?.trim().toLowerCase();

  return (
    <div className="property-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="property-header">
        <h1>{property.title || "Untitled Property"}</h1>
        <p>
          {property.category?.toUpperCase() || "N/A"} • {property.location || "Unknown"}
        </p>
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
          <p className="price">
            <strong>Price:</strong> ₹{property.price || "N/A"}
          </p>
          <p>
            <strong>Location:</strong> {property.location || "Unknown"}
          </p>
          <p>
            <strong>Category:</strong> {property.category || "N/A"}
          </p>
          <p>
            <strong>Owner:</strong> {property.owner || "N/A"}
          </p>
          <p>
            <strong>Contact Mobile:</strong> {property.mobileNO || "N/A"}
          </p>

          {/* Chat button visible only if current user is not the owner */}
          {!isOwner && (
            <button className="chat-btn" onClick={() => setChatOpen(!chatOpen)}>
              💬 Chat with Seller
            </button>
          )}
          {isOwner && <p className="owner-label">You are the owner of this property</p>}
        </div>
      </div>

      {/* Chat Modal */}
      {chatOpen && !isOwner && (
        <div className="chat-modal">
          <Chat chatId={property._id} userId={userEmail} />
        </div>
      )}
    </div>
  );
}
