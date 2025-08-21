import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddProperty from "./pages/AddProperty";
import Category from "./pages/Category";
import Login from "./pages/Login";

function App() {
  // Properties state for all categories
  const [properties, setProperties] = useState({
    plots: [],
    buildings: [],
    houses: [],
    apartments: [],
    villas: [],
    farmlands: [],
  });

  // Function to add a new property
  const addProperty = (property) => {
    const key = property.category.toLowerCase();
    setProperties((prev) => ({
      ...prev,
      [key]: [...prev[key], property],
    }));
  };

  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<Home />} />

      {/* Add property page */}
      <Route path="/add-property" element={<AddProperty addProperty={addProperty} />} />

      {/* Dynamic route for categories */}
      <Route path="/category/:category" element={<Category properties={properties} />} />

      {/* Login page */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
