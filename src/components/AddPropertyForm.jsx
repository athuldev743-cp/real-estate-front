import React, { useState } from "react";
import { addProperty } from "../api/PropertyAPI";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../pages/AddProperty.css";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const defaultCenter = [28.6139, 77.209]; // Delhi

function LocationPicker({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function AddPropertyForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(defaultCenter);
  const [mobileNO, setMobileNO] = useState(localStorage.getItem("phone") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleImagesChange = (e) => setImages(e.target.files);

  // 🔎 Search location using Nominatim API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setLocation([lat, lon]);
      } else {
        alert("Location not found. Try another search.");
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("mobileNO", mobileNO);
      formData.append("latitude", location[0]);
      formData.append("longitude", location[1]);

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      await addProperty(formData);

      setTitle("");
      setDescription("");
      setPrice("");
      setImages([]);
      setLocation(defaultCenter);
      setSearchQuery("");
    } catch (err) {
      setError("Failed to add property. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-property-form" onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <input type="file" multiple accept="image/*" onChange={handleImagesChange} />

      {/* 🔎 Location Search */}
      <div style={{ margin: "10px 0" }}>
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", gap: "8px", marginBottom: "10px" }}
        >
          <input
            type="text"
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <button type="submit" style={{ padding: "10px 16px" }}>
            Search
          </button>
        </form>

        <MapContainer
          center={location}
          zoom={12}
          style={{ height: "250px", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={location} />
          <LocationPicker setLocation={setLocation} />
        </MapContainer>
        <p style={{ color: "#fff", textAlign: "center", marginTop: "5px" }}>
          Selected: Lat {location[0].toFixed(4)}, Lng {location[1].toFixed(4)}
        </p>
      </div>

      <input type="text" value={mobileNO} readOnly />

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Property"}
      </button>
    </form>
  );
}
