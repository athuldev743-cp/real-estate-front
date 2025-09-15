import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { addProperty } from "../api/PropertyAPI";

// Helper to recenter map when position changes
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 13);
  }, [position, map]);
  return null;
}

// Category list
const categories = [
  { id: 1, name: "Plots", value: "plots" },
  { id: 2, name: "Buildings", value: "buildings" },
  { id: 3, name: "House", value: "house" },
  { id: 4, name: "Apartment", value: "apartment" },
  { id: 5, name: "Villa", value: "villa" },
  { id: 6, name: "Farmland", value: "farmlands" },
];

export default function AddPropertyForm({ user }) {
  // ---------------- Form states ----------------
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");

  // ---------------- Location states ----------------
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState([9.9679, 76.245]); // Kochi default
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // ---------------- Autofill phone ----------------
  useEffect(() => {
    if (user?.phone) setPhone(user.phone);
  }, [user]);

  // ---------------- Search location ----------------
  const handleSearch = async () => {
    if (!search.trim()) {
      alert("Please enter a location to search!");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/search-location?q=${encodeURIComponent(search)}`
      );
      if (!res.ok) throw new Error("Failed to fetch locations");
      const data = await res.json();
      if (data.length === 0) {
        alert("No results found!");
        return;
      }

      setSearchResults(data);
      setSelectedIndex(0);

      // Automatically select first result
      const { lat, lon } = data[0];
      setPosition([parseFloat(lat), parseFloat(lon)]);
      setSearchedLocation({ lat: parseFloat(lat), lon: parseFloat(lon) });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch location. Try again.");
    }
  };

  const handleResultSelect = (index) => {
    setSelectedIndex(index);
    const { lat, lon } = searchResults[index];
    setPosition([parseFloat(lat), parseFloat(lon)]);
    setSearchedLocation({ lat: parseFloat(lat), lon: parseFloat(lon) });
  };

  // ---------------- Add Property ----------------
  const handleAddProperty = async (e) => {
    e.preventDefault();
    if (!searchedLocation) {
      alert("Please search for a location before submitting property!");
      return;
    }
    if (!category) {
      alert("Please select a category!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("mobileNO", phone); // API expects mobileNO
    formData.append("category", category);
    formData.append("latitude", searchedLocation.lat); // API expects latitude
    formData.append("longitude", searchedLocation.lon); // API expects longitude

    try {
      const res = await addProperty(formData);
      console.log("✅ Property added:", res);
      alert("🏡 Property added successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setPhone(user?.phone || "");
      setCategory("");
      setSearchedLocation(null);
      setSearch("");
      setSearchResults([]);
      setSelectedIndex(null);
    } catch (err) {
      console.error("❌ Error saving property:", err);
      alert("Failed to save property. Please try again later.");
    }
  };

  return (
    <div className="add-property-page">
      <h2>Add a New Property</h2>
      <form onSubmit={handleAddProperty} className="property-form">
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

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={{ marginTop: "8px" }}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.value}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Search Location */}
        <div className="search-form">
          <input
            type="text"
            placeholder="Search location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Dropdown for multiple search results */}
        {searchResults.length > 1 && (
          <select
            value={selectedIndex}
            onChange={(e) => handleResultSelect(e.target.value)}
            style={{ marginTop: "8px" }}
          >
            {searchResults.map((loc, idx) => (
              <option key={loc.place_id} value={idx}>
                {loc.display_name}
              </option>
            ))}
          </select>
        )}

        {/* Map */}
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "300px", width: "100%", marginTop: "10px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RecenterMap position={position} />
          {searchedLocation && (
            <Marker position={[searchedLocation.lat, searchedLocation.lon]}>
              <Popup>Property Location</Popup>
            </Marker>
          )}
        </MapContainer>

        {searchedLocation && (
          <p>
            📍 Location: Lat {searchedLocation.lat}, Lng {searchedLocation.lon}
          </p>
        )}

        <button type="submit" className="add-btn">
          Add Property
        </button>
      </form>
    </div>
  );
}
