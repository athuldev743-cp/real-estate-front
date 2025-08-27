import React, { useState } from "react";
import { addProperty } from "../api/PropertyAPI";

export default function AddPropertyForm() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append("image", file);

    try {
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
    <form className="property-form" onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange} required />
      <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
      <input type="text" name="category" placeholder="Category" onChange={handleChange} required />
      <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
      <input type="file" name="image" onChange={handleFileChange} required />
      <button type="submit">Add Property</button>
    </form>
  );
}
