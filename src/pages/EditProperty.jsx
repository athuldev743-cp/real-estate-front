// src/pages/EditProperty.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProperties, deleteProperty } from "../api/PropertyAPI"; // ✅ import deleteProperty
import "./EditProperty.css";

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProperty() {
      try {
        const data = await getProperties();
        const found = data.find((p) => p._id === id);
        if (!found) {
          setError("Property not found");
        } else {
          setProperty(found);
        }
      } catch (err) {
        setError("Failed to load property");
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    setProperty({ ...property, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/properties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(property),
      });
      if (!res.ok) throw new Error("Update failed");
      alert("✅ Property updated successfully!");
      navigate("/account");
    } catch (err) {
      alert("❌ Error updating property: " + err.message);
    }
  };

  // ✅ New: Delete handler
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await deleteProperty(id);
      alert("✅ Property deleted successfully");
      navigate("/account");
    } catch (err) {
      alert("❌ Error deleting property: " + err.message);
    }
  };

  if (loading) return <p>Loading property...</p>;
  if (error) return <p>{error}</p>;
  if (!property) return <p>No property data</p>;

  return (
    <div className="edit-property-page">
      <h2>Edit Property</h2>
      <form className="edit-form" onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={property.title || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={property.description || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Price:
          <input
            type="number"
            name="price"
            value={property.price || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Location:
          <input
            type="text"
            name="location"
            value={property.location || ""}
            onChange={handleChange}
          />
        </label>

        <div className="edit-buttons">
          <button type="submit">💾 Save Changes</button>
          <button type="button" onClick={handleDelete} className="delete-btn">
            🗑 Delete Property
          </button>
        </div>
      </form>
    </div>
  );
}
