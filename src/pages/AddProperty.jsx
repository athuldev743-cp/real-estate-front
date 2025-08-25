import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProperty } from "../api/PropertyAPI";
import "./AddProperty.css";

export default function AddProperty() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("plots");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProperty({
        title,
        description,
        price,
        location,
        category: category.toLowerCase(),
        image_url: imageUrl,
      });
      alert("Property added successfully!");
      // redirect to the category page where the property belongs
      navigate(`/category/${category.toLowerCase()}`);
    } catch (err) {
      alert("Failed to add property: " + (err.response?.data?.detail || "Server error"));
    }
  };

  return (
    <div className="add-property-page">
      <h2>Add Property</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="plots">Plots</option>
          <option value="buildings">Buildings</option>
          <option value="houses">Houses</option>
          <option value="apartments">Apartments</option>
          <option value="villas">Villas</option>
          <option value="farmlands">Farmlands</option>
        </select>
        <input placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <button type="submit">Add Property</button>
      </form>
    </div>
  );
}
