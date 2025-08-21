import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProperty.css";

export default function AddProperty({ addProperty }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    category: "Plots",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFormData((prev) => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addProperty(formData);
    alert(`Property added to ${formData.category}!`);
    setFormData({ name: "", description: "", image: "", category: "Plots" });
    navigate(`/category/${formData.category.toLowerCase()}`);
  };

  return (
    <div className="add-property-container">
      <div className="add-property-card">
        <h2>Add New Property</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Property Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Property Description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />

          <select name="category" value={formData.category} onChange={handleChange}>
            <option>Plots</option>
            <option>Buildings</option>
            <option>Houses</option>
            <option>Apartments</option>
            <option>Villas</option>
            <option>Farmlands</option>
          </select>

          <button type="submit">Add Property</button>
        </form>

        {formData.image && (
          <div className="preview-container">
            <h4>Preview</h4>
            <img src={formData.image} alt="Preview" />
          </div>
        )}
      </div>
    </div>
  );
}
