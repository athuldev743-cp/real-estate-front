import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { addProperty } from "../api/PropertyAPI";
import L from "leaflet";

// Helper to recenter map when position changes
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

export default function AddPropertyForm({ user }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");

  const [search, setSearch] = useState("");
  const [position, setPosition] = useState([9.9679, 76.245]);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (user?.phone) setPhone(user.phone);
  }, [user]);

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

  const handleAddLocation = () => {
    if (!searchedLocation) {
      alert("Please search for a location first.");
      return;
    }
    setSelectedLocation(searchedLocation);
    alert("✅ Location added successfully! You can now drag the marker to fine-tune the position.");
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    if (!selectedLocation) {
      alert("Please add a location before submitting property!");
      return;
    }
    if (!category) {
      alert("Please select a category!");
      return;
    }
    if (images.length === 0) {
      alert("Please select at least one image!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("mobileNO", phone);
    formData.append("category", category);
    formData.append("latitude", selectedLocation.lat);
    formData.append("longitude", selectedLocation.lon);
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await addProperty(formData);
      console.log("✅ Property added:", res);
      alert("🏡 Property added successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setPhone(user?.phone || "");
      setSearchedLocation(null);
      setSelectedLocation(null);
      setSearch("");
      setSearchResults([]);
      setSelectedIndex(null);
      setImages([]);
    } catch (err) {
      console.error("❌ Error saving property:", err);
      alert("Failed to save property. Please try again later.");
    }
  };

  return (
    <div className="add-property-page">
      <h2>Add a New Property</h2>
      <form onSubmit={handleAddProperty} className="property-form">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <select value={category} onChange={(e) => setCategory(e.target.value)} required style={{ marginTop: "8px" }}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.value}>{cat.name}</option>
          ))}
        </select>
        <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} style={{ marginTop: "8px" }} />

        <div className="search-form">
          <input type="text" placeholder="Search location..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="button" onClick={handleSearch}>Search</button>
        </div>

        {searchResults.length > 1 && (
          <select value={selectedIndex} onChange={(e) => handleResultSelect(e.target.value)} style={{ marginTop: "8px" }}>
            {searchResults.map((loc, idx) => (
              <option key={loc.place_id} value={idx}>{loc.display_name}</option>
            ))}
          </select>
        )}

        <button type="button" onClick={handleAddLocation} disabled={!searchedLocation} style={{ marginTop: "8px" }}>
          Add Location
        </button>

        <MapContainer center={position} zoom={13} style={{ height: "300px", width: "100%", marginTop: "10px" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RecenterMap position={position} />
          {searchedLocation && <Marker position={[searchedLocation.lat, searchedLocation.lon]}><Popup>Searched Location</Popup></Marker>}
          {selectedLocation && (
            <Marker
              position={[selectedLocation.lat, selectedLocation.lon]}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const { lat, lng } = marker.getLatLng();
                  setSelectedLocation({ lat, lon: lng });
                },
              }}
            >
              <Popup>Drag me to adjust location</Popup>
            </Marker>
          )}
        </MapContainer>

        {selectedLocation && <p>📍 Added: Lat {selectedLocation.lat}, Lng {selectedLocation.lon}</p>}

        <button type="submit" className="add-btn">Add Property</button>
      </form>
    </div>
  );
}
