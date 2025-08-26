// src/pages/AddProperty.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProperty } from "../api/PropertyAPI";
import "./AddProperty.css";

export default function AddProperty() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    category: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      setMessage("Please upload an image.");
      return;
    }

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Ensure user is logged in
      const res = await addProperty(data, token);

      if (res.message) {
        setMessage(res.message);
        navigate(`/category/${formData.category.toLowerCase()}`);
      } else {
        setMessage("Error adding property.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to add property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-property-page">
      <h2>Add New Property</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="property-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="plots">Plots</option>
          <option value="buildings">Buildings</option>
          <option value="houses">Houses</option>
          <option value="apartments">Apartments</option>
          <option value="villas">Villas</option>
          <option value="farmlands">Farmlands</option>
        </select>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Property"}
        </button>
      </form>
    </div>
  );
}
