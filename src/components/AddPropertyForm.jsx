import React, { useState } from "react";
import { addProperty } from "../api/PropertyAPI";

const AddPropertyForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [category, setCategory] = useState("");
  const [mobileNO, setMobileNO] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files)); // convert FileList to array
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("category", category);
      formData.append("mobileNO", mobileNO);

      images.forEach((img) => formData.append("images", img));

      const result = await addProperty(formData);

      console.log("✅ Property saved successfully:", result);
      alert("Property saved successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setLatitude("");
      setLongitude("");
      setCategory("");
      setMobileNO("");
      setImages([]);
    } catch (err) {
      console.error("❌ Error saving property:", err.message);
      alert("Failed to save property. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="add-property-form">
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
      <input
        type="number"
        placeholder="Latitude"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Longitude"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="">Select Category</option>
        <option value="house">House</option>
        <option value="villa">Villa</option>
        <option value="apartment">Apartment</option>
        <option value="farmlands">Farmlands</option>
        <option value="plots">Plots</option>
        <option value="buildings">Buildings</option>
      </select>
      <input
        type="text"
        placeholder="Mobile Number"
        value={mobileNO}
        onChange={(e) => setMobileNO(e.target.value)}
        required
      />
      <input
        type="file"
        multiple
        onChange={handleImageChange}
        accept="image/*"
        required
      />
      {images.length > 0 && (
        <div className="image-preview">
          {images.map((img, index) => (
            <img
              key={index}
              src={URL.createObjectURL(img)}
              alt={`preview-${index}`}
              width={100}
            />
          ))}
        </div>
      )}
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Property"}
      </button>
    </form>
  );
};

export default AddPropertyForm;
