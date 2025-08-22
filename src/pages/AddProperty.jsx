// src/pages/AddProperty.jsx
import React, { useState } from "react";
import { addProperty } from "../api/PropertyAPI";  // ✅ Correct import
import "./AddProperty.css";

function AddProperty({ onPropertyAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const categories = ["Plots", "Buildings", "Houses", "Apartments", "Villas", "Farmlands"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !price || !category || !location || !image) {
      alert("Please fill all fields and select an image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("location", location);
      formData.append("image", image);

      await addProperty(formData);
      alert("Property added successfully!");

      // reset fields
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setLocation("");
      setImage(null);

      if (onPropertyAdded) onPropertyAdded(); // refresh list
    } catch (error) {
      console.error("Error adding property:", error);
      alert("Failed to add property.");
    }
  };

  return (
    <div className="add-property-container">
      <h1>Add New Property</h1>
      <form onSubmit={handleSubmit} className="add-property-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit">Add Property</button>
      </form>
    </div>
  );
}

export default AddProperty;
