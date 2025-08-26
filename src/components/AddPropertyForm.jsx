// src/pages/AddPropertyForm.jsx
import React, { useState } from "react";
import { addProperty } from "../api/PropertyAPI"; // use the function we wrote

export default function AddPropertyForm() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("location", formData.location);
      data.append("image", file);

      // get token from localStorage (after login)
      const token = localStorage.getItem("token");

      const res = await addProperty(data, token);

      console.log(res);
      alert("Property added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add property");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        name="category"
        placeholder="Category"
        value={formData.category}
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
      <input type="file" name="image" onChange={handleFileChange} required />
      <button type="submit">Add Property</button>
    </form>
  );
}
