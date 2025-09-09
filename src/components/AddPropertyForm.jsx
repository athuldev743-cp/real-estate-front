import React, { useState } from "react";
import { addProperty } from "../api/PropertyAPI";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import "../pages/AddProperty.css";

const mapContainerStyle = { width: "100%", height: "250px", borderRadius: "12px" };
const defaultCenter = { lat: 28.6139, lng: 77.209 }; // Default center (Delhi)

export default function AddPropertyForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(defaultCenter);
  const [mobileNO, setMobileNO] = useState(localStorage.getItem("phone") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const handleImagesChange = (e) => setImages(e.target.files);
  const handleMapClick = (e) => setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });

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

      for (let i = 0; i < images.length; i++) formData.append("images", images[i]);

      await addProperty(formData);

      setTitle("");
      setDescription("");
      setPrice("");
      setImages([]);
      setLocation(defaultCenter);
    } catch (err) {
      setError("Failed to add property. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadError) return <p style={{ color: "#ff4c4c" }}>Error loading map</p>;
  if (!isLoaded) return <p style={{ color: "#ffd700" }}>Loading map...</p>;

  return (
    <form className="add-property-form" onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}

      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />

      <input type="file" multiple accept="image/*" onChange={handleImagesChange} />

      <div style={{ margin: "10px 0" }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={location}
          onClick={handleMapClick}
          options={{ styles: [], disableDefaultUI: true }}
        >
          <Marker position={location} />
        </GoogleMap>
        <p style={{ color: "#fff", textAlign: "center", marginTop: "5px" }}>
          Selected: Lat {location.lat.toFixed(4)}, Lng {location.lng.toFixed(4)}
        </p>
      </div>

      <input type="text" value={mobileNO} readOnly />

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Property"}
      </button>
    </form>
  );
}
