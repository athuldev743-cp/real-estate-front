import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function AddPropertyForm({ user }) {
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");

  // Location states
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState([28.6139, 77.2090]); // Default Delhi
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Autofill phone number from logged-in user
  useEffect(() => {
    if (user?.phone) setPhone(user.phone);
  }, [user]);

  // ---------------- Search location using backend proxy ----------------
  const handleSearch = async () => {
    if (!search) return;

    try {
      const res = await fetch(`/api/search-location?q=${encodeURIComponent(search)}`);
      const data = await res.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
        setSearchedLocation({ lat: parseFloat(lat), lon: parseFloat(lon) });
      } else {
        alert("No results found!");
      }
    } catch (err) {
      console.error("Search error:", err);
      alert("Failed to fetch location. Try again.");
    }
  };

  // ---------------- Confirm location ----------------
  const handleAddLocation = () => {
    if (!searchedLocation) {
      alert("Please search for a location first.");
      return;
    }
    setSelectedLocation(searchedLocation);
    alert("✅ Location added successfully!");
  };

  // ---------------- Add property ----------------
  const handleAddProperty = (e) => {
    e.preventDefault();
    if (!selectedLocation) {
      alert("Please add a location before submitting property!");
      return;
    }

    const newProperty = {
      title,
      description,
      price,
      phone,
      location: selectedLocation,
    };

    console.log("Property added:", newProperty);
    alert("🏡 Property added successfully!");

    // Reset form
    setTitle("");
    setDescription("");
    setPrice("");
    setSearchedLocation(null);
    setSelectedLocation(null);
    setSearch("");
  };

  return (
    <div className="add-property-page">
      <h2>Add a New Property</h2>

      <form onSubmit={handleAddProperty} className="property-form">
        <input
          type="text"
          id="title"
          name="title"
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
          type="number"
          id="price"
          name="price"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="text"
          id="phone"
          name="phone"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        {/* ---------------- Search location ---------------- */}
        <div className="search-form">
          <input
            type="text"
            id="location-search"
            placeholder="Search location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* ---------------- Add Location Button ---------------- */}
        <button
          type="button"
          onClick={handleAddLocation}
          disabled={!searchedLocation}
          style={{ marginTop: "8px" }}
        >
          Add Location
        </button>

        {/* ---------------- Map Display ---------------- */}
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "300px", width: "100%", marginTop: "10px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {searchedLocation && (
            <Marker position={[searchedLocation.lat, searchedLocation.lon]}>
              <Popup>Searched Location</Popup>
            </Marker>
          )}

          {selectedLocation && (
            <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
              <Popup>Added Location</Popup>
            </Marker>
          )}
        </MapContainer>

        {/* ---------------- Show selected location ---------------- */}
        {selectedLocation && (
          <p>
            📍 Added: Lat {selectedLocation.lat}, Lng {selectedLocation.lon}
          </p>
        )}

        <button type="submit" className="add-btn">
          Add Property
        </button>
      </form>
    </div>
  );
}
