import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddProperty from "./pages/AddProperty";
import Category from "./pages/Category";
import Login from "./pages/Login";
import AuthTest from "./pages/AuthTest";
import Register from "./pages/Register"; 
import Search from "./pages/Search";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-property" element={<AddProperty />} />
      <Route path="/category/:category" element={<Category />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth-test" element={<AuthTest />} />
      <Route path="/Register" element={<Register />} /> 
      <Route path="/search" element={<Search />} />
    </Routes>
  );
}

export default App;
