import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function AddPropertyForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");

  // Search + Location states
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState([28.6139, 77.2090]); // Default Delhi
  const [searchedLocation, setSearchedLocation] = useState(null); // temporary
  const [selectedLocation, setSelectedLocation] = useState(null); // confirmed

  // Search location handler
  const handleSearch = async (e) => {
    e.preventDefault(); // stop reload
    if (!search) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${search}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
        setSearchedLocation({ lat, lon });
      } else {
        alert("No results found!");
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // Confirm location
  const handleAddLocation = () => {
    if (!searchedLocation) {
      alert("Please search for a location first.");
      return;
    }
    setSelectedLocation(searchedLocation);
    alert("✅ Location added successfully!");
  };

  // Save property handler
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

        {/* Search bar for location */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Search location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {/* Add Location Button */}
        <button
          type="button"
          onClick={handleAddLocation}
          disabled={!searchedLocation}
          style={{ marginTop: "8px" }}
        >
          Add Location
        </button>

        {/* Map Display */}
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

        {/* Show selected location */}
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
