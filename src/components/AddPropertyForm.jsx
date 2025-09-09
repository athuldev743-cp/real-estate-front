// src/components/AddPropertyForm.jsx
import React, { useState } from "react";
import { addProperty } from "../api/PropertyAPI";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../pages/AddProperty.css";

// Fix default Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const defaultCenter = { lat: 28.6139, lng: 77.209 }; // Delhi

function LocationMarker({ location, setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return location ? <Marker position={location} /> : null;
}

export default function AddPropertyForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("house");
  const [location, setLocation] = useState(defaultCenter);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNO, setMobileNO] = useState(localStorage.getItem("phone") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImagesChange = (e) => setImages(e.target.files);

  // 🔍 Search with Nominatim (OpenStreetMap)
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
        setLocation({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        });
      } else {
        alert("Location not found");
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
      formData.append("latitude", location.lat);
      formData.append("longitude", location.lng);
      formData.append("category", category);

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      await addProperty(formData);

      // reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("house");
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
        id="title"
        name="title"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        id="description"
        name="description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <input
        id="price"
        name="price"
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <select
        id="category"
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="house">House</option>
        <option value="villa">Villa</option>
        <option value="apartment">Apartment</option>
        <option value="farmlands">Farmlands</option>
        <option value="plots">Plots</option>
        <option value="buildings">Buildings</option>
      </select>

      <input
        id="images"
        name="images"
        type="file"
        multiple
        accept="image/*"
        onChange={handleImagesChange}
      />

      {/* 🔍 Search bar */}
      <form onSubmit={handleSearch} className="search-bar">
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Map */}
      <div style={{ margin: "10px 0", height: "250px" }}>
        <MapContainer
          center={location}
          zoom={12}
          style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <LocationMarker location={location} setLocation={setLocation} />
        </MapContainer>
        <p style={{ color: "#fff", textAlign: "center", marginTop: "5px" }}>
          Selected: Lat {location.lat.toFixed(4)}, Lng {location.lng.toFixed(4)}
        </p>
      </div>

      <input
        id="mobileNO"
        name="mobileNO"
        type="text"
        value={mobileNO}
        readOnly
      />

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Property"}
      </button>
    </form>
  );
}
