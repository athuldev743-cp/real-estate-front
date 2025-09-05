import React, { useState } from "react";
import { addProperty } from "../api/PropertyAPI";
import "./AddPropertyForm.css";

export default function AddPropertyForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [mobileNO, setMobileNO] = useState(localStorage.getItem("phone") || ""); // ✅ auto-fill

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProperty({ title, description, price, location, imageUrl, mobileNO });
      setTitle("");
      setDescription("");
      setPrice("");
      setLocation("");
      setImageUrl("");
    } catch (err) {
      console.error("Failed to add property:", err);
    }
  };

  return (
    <form className="add-property-form" onSubmit={handleSubmit}>
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
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="Mobile Number"
        value={mobileNO}
        readOnly   // ✅ user can’t edit
      />
      <button type="submit">Add Property</button>
    </form>
  );
}
