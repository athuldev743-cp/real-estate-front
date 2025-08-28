import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import AddProperty from "./pages/AddProperty";
import Category from "./pages/Category";
import PropertyDetails from "./pages/PropertyDetails";
import Search from "./pages/Search";

// API
import { getCurrentUser } from "./api/PropertyAPI";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getCurrentUser(token)
        .then((res) => setUser(res))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<Home user={user} />} />

      {/* Login/Register routes */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <Register setUser={setUser} />}
      />

      {/* Protected routes */}
      <Route
        path="/account"
        element={user ? <Account user={user} /> : <Navigate to="/login" />}
      />
      <Route
        path="/add-property"
        element={user ? <AddProperty user={user} /> : <Navigate to="/login" />}
      />

      {/* Public routes */}
      <Route path="/category/:category" element={<Category />} />
      <Route
        path="/property/:id"
        element={<PropertyDetails userId={user?._id} />}
      />
      <Route path="/search" element={<Search />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
