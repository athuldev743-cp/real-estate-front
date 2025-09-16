// src/pages/EditProperty.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./EditProperty.css";

function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 13);
  }, [position, map]);
  return null;
}

const categories = [
  { id: 1, name: "Plots", value: "plots" },
  { id: 2, name: "Buildings", value: "buildings" },
  { id: 3, name: "House", value: "house" },
  { id: 4, name: "Apartment", value: "apartment" },
  { id: 5, name: "Villa", value: "villa" },
  { id: 6, name: "Farmland", value: "farmlands" },
];

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Property fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Map
  const [position, setPosition] = useState([9.9679, 76.245]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Fetch property
  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/properties/${id}`);
        if (!res.ok) throw new Error("Property not found");
        const data = await res.json();

        setTitle(data.title || "");
        setDescription(data.description || "");
        setPrice(data.price || "");
        setCategory(data.category || "");
        setPhone(data.mobileNO || "");
        setExistingImages(data.images || []);
        if (data.latitude && data.longitude) {
          setSelectedLocation({ lat: data.latitude, lon: data.longitude });
          setPosition([data.latitude, data.longitude]);
        }
      } catch (err) {
        setError("Failed to load property");
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  // Handle new uploads
  const handleImageChange = (e) => {
    setImages([...images, ...Array.from(e.target.files)]);
  };

  const removeNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  // Update property
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!category) return alert("Please select a category!");
      if (!selectedLocation) return alert("Please set a location!");

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("mobileNO", phone);
      formData.append("category", category);
      formData.append("latitude", selectedLocation.lat);
      formData.append("longitude", selectedLocation.lon);

      images.forEach((img) => formData.append("images", img));
      formData.append("existingImages", JSON.stringify(existingImages));

      const res = await fetch(`${process.env.REACT_APP_API_URL}/properties/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");

      alert("✅ Property updated successfully!");
      navigate("/account");
    } catch (err) {
      alert("❌ Error updating property: " + err.message);
    }
  };

  // Delete property
  const handleDelete = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete this property?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/properties/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      alert("🗑️ Property deleted successfully!");
      navigate("/account");
    } catch (err) {
      alert("❌ Error deleting property: " + err.message);
    }
  };

  if (loading) return <p>Loading property...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="edit-property-page">
      <h2>Edit Property</h2>
      <form className="edit-form" onSubmit={handleSubmit}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required />
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" required />

        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.value}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="image-preview-container">
            {existingImages.map((img, idx) => (
              <div key={idx} className="image-preview">
                <img src={img} alt="existing" />
                <button type="button" onClick={() => removeExistingImage(idx)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload New Images */}
        <input type="file" multiple accept="image/*" onChange={handleImageChange} />
        {images.length > 0 && (
          <div className="image-preview-container">
            {images.map((img, idx) => (
              <div key={idx} className="image-preview">
                <img src={URL.createObjectURL(img)} alt="new" />
                <button type="button" onClick={() => removeNewImage(idx)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Map */}
        <MapContainer center={position} zoom={13} style={{ height: "300px", width: "100%", marginTop: "10px" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RecenterMap position={position} />
          {selectedLocation && (
            <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
              <Popup>Selected Location</Popup>
            </Marker>
          )}
        </MapContainer>

        <div className="edit-actions">
          <button type="submit" className="save-btn">💾 Save Changes</button>
          <button type="button" className="delete-btn" onClick={handleDelete}>🗑️ Delete Property</button>
        </div>
      </form>
    </div>
  );
}
