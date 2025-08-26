import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProperty } from "../api/PropertyAPI";
import "./AddProperty.css";

export default function AddProperty() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    image: null,
  });

  // Redirect if not logged in
  if (!token) {
    navigate("/login");
    return null;
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files.length > 0) {
      setFormData({
        ...formData,
        image: files[0], // ✅ correctly store selected file
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    for (let key in formData) {
      fd.append(key, formData[key]);
    }

    try {
      const res = await addProperty(fd, token);
      if (res.property && res.property._id) {
        alert("Property added successfully!");
        navigate(`/category/${formData.category.toLowerCase()}`); // ✅ redirect to category page
      } else {
        alert(res.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error adding property:", err);
      alert("Failed to add property.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-property-form">
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
        <option value="houses">Houses</option>
        <option value="villas">Villas</option>
        <option value="apartments">Apartments</option>
        <option value="buildings">Buildings</option>
        <option value="plots">Plots</option>
        <option value="farmlands">Farmlands</option>
      </select>
      <input type="file" name="image" onChange={handleChange} required />
      <button type="submit">Add Property</button>
    </form>
  );
}
