import React, { useState } from "react";
import { addProperty } from "../api/PropertyAPI";
import "../pages/AddProperty.css";

export default function AddPropertyForm() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
  });
  const [message, setMessage] = useState("");

  const categories = ["Plots", "Buildings", "Houses", "Apartments", "Villas", "Farmlands"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!file) {
      setMessage("Please select an image for the property.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("location", formData.location);
    data.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const res = await addProperty(data, token);
      console.log(res);
      alert("Property added successfully!");
      setFormData({ title: "", description: "", price: "", category: "", location: "" });
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Failed to add property. Please try again.");
    }
  };

  return (
    <div className="add-property-page">
      <h2>Add New Property</h2>
      {message && <div className="message">{message}</div>}
      <form className="property-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Property Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Property Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price in ₹"
          value={formData.price}
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
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
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
    </div>
  );
}
