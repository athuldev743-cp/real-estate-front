import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById } from "../api/PropertyAPI";
import "./PropertyDetails.css";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading property...</p>;
  }

  if (!property) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Property not found.</p>;
  }

  return (
    <div className="property-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="property-header">
        <h1>{property.title}</h1>
        <p>{property.category?.toUpperCase()} • {property.location}</p>
      </div>

      <div className="property-main">
        <div className="property-image-container">
          <img src={property.image_url || "/image/default-property.jpeg"} alt={property.title} />
        </div>

        <div className="property-info">
          <h2>Property Details</h2>
          <p>{property.description}</p>
          <p className="price">Price: ₹{property.price}</p>
          <p className="location">Location: {property.location}</p>
          <p>Category: {property.category}</p>
          <p>Owner: {property.owner}</p>
        </div>
      </div>
    </div>
  );
}
