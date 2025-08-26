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
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    for (let key in formData) {
      fd.append(key, formData[key]);
    }

    try {
      const res = await addProperty(fd, token);

      if (res.property?._id) {
        alert("Property added successfully!");
        navigate(`/category/${formData.category.toLowerCase()}`);
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
      <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange} required />
      <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
      <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
      <select name="category" onChange={handleChange} required>
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
