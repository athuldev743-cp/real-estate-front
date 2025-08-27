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
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { label: "House", value: "house" },
    { label: "Villa", value: "villa" },
    { label: "Apartment", value: "apartment" },
    { label: "Farmlands", value: "farmlands" },
    { label: "Plots", value: "plots" },
    { label: "Buildings", value: "buildings" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add a property.");
      return;
    }

    if (!file) {
      setMessage("Please select an image for the property.");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    data.append("image", file);

    setSubmitting(true);
    try {
      const res = await addProperty(data, token);
      console.log(res);
      if (res.detail) setMessage(res.detail);
      else if (res.message) alert(res.message);

      setFormData({ title: "", description: "", price: "", category: "", location: "" });
      setFile(null);
      document.querySelector('input[name="image"]').value = null;
    } catch (err) {
      console.error(err);
      setMessage("Failed to add property. Please try again.");
    } finally {
      setSubmitting(false);
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
            <option key={cat.value} value={cat.value}>
              {cat.label}
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
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Property"}
        </button>
      </form>
    </div>
  );
}
