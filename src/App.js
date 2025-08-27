import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Category from "./pages/Category";
import AddProperty from "./pages/AddProperty";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetails from "./pages/PropertyDetails";
import Account from "./pages/Account";
import { getCurrentUser } from "./api/PropertyAPI";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getCurrentUser(token)
        .then((data) => setUser(data))
        .catch((err) => {
          console.error("Failed to fetch user:", err);
          localStorage.removeItem("token"); // remove invalid token
          setUser(null);
        });
    }
    // No token? just let them see Home page
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home user={user} />} />
      <Route path="/search" element={<Search user={user} />} />
      <Route path="/category/:category" element={<Category user={user} />} />
      <Route path="/top-deals" element={<Category user={user} />} />
      <Route path="/add-property" element={<AddProperty user={user} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/property/:id" element={<PropertyDetails user={user} />} />
      <Route path="/account" element={<Account user={user} />} />
      {/* Redirect unknown routes to Home */}
      <Route path="*" element={<Home user={user} />} />
    </Routes>
  );
}
