import React, { useState } from "react";
import { addProperty } from "../api/PropertyAPI";
import "../pages/AddProperty.css";

export default function AddPropertyForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [mobileNO, setMobileNO] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const categories = ["house", "villa", "apartment", "farmlands", "plots", "buildings"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate required fields
    if (!title || !description || !price || !category || !location || !mobileNO || !image) {
      setError("All fields are required!");
      return;
    }

    if (!categories.includes(category.toLowerCase())) {
      setError(`Category must be one of: ${categories.join(", ")}`);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in to add a property.");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", Number(price));
      formData.append("category", category.toLowerCase());
      formData.append("location", location);
      formData.append("mobileNO", mobileNO);
      formData.append("image", image);

      const res = await addProperty(formData, token);
      setMessage(res.message || "Property added successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setLocation("");
      setMobileNO("");
      setImage(null);
    } catch (err) {
      setError(err.message || "Failed to add property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-property-form" onSubmit={handleSubmit}>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Mobile Number"
        value={mobileNO}
        onChange={(e) => setMobileNO(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Property"}
      </button>
    </form>
  );
}
