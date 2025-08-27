import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Category from "./pages/Category";
import AddProperty from "./pages/AddProperty";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetails from "./pages/PropertyDetails";
import Account from "./pages/Account";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/category/:category" element={<Category />} />
      <Route path="/top-deals" element={<Category />} />
      <Route path="/add-property" element={<AddProperty />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
      <Route path="/account" element={<Account userId={userId} />} />

    </Routes>
  );
}

