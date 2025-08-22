import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddProperty from "./pages/AddProperty";
import Category from "./pages/Category";
import Login from "./pages/Login";
import AuthTest from "./pages/AuthTest";

function App() {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<Home />} />

      {/* Add property page */}
      <Route path="/add-property" element={<AddProperty />} />

      {/* Dynamic category page */}
      <Route path="/category/:category" element={<Category />} />

      {/* Login page */}
      <Route path="/login" element={<Login />} />

      {/* Auth test page */}
      <Route path="/auth-test" element={<AuthTest />} />
    </Routes>
  );
}

export default App;
