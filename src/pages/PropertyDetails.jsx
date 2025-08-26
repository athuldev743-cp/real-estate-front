import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertiesByCategory, getProperties } from "../api/PropertyAPI";
import "./PropertyDetails.css"; // Create a CSS file if you want custom styling

export default function PropertyDetails() {
  const { id } = useParams(); // property _id
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProperty() {
      setLoading(true);
      try {
        // Option 1: Fetch all properties and find by id
        const allProps = await getProperties(""); // get all
        const found = allProps.find((p) => p._id === id);
        if (found) setProperty(found);
        else console.error("Property not found");
      } catch (err) {
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  if (loading) return <p>Loading property...</p>;
  if (!property) return <p>Property not found.</p>;

  return (
    <div className="property-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="property-details-card">
        <img
          src={property.image_url || "/image/default-property.jpeg"}
          alt={property.title}
          className="property-image"
        />
        <h2>{property.title}</h2>
        <p>{property.description}</p>
        <p>
          <strong>Price:</strong> ₹{property.price}
        </p>
        <p>
          <strong>Location:</strong> {property.location}
        </p>
        <p>
          <strong>Category:</strong> {property.category}
        </p>
        <p>
          <strong>Owner:</strong> {property.owner || "N/A"}
        </p>
      </div>
    </div>
  );
}
