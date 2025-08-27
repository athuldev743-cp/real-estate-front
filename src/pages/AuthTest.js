import React, { useState } from "react";
import { registerUser, loginUser, addProperty } from "../api/PropertyAPI";

function AuthTest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await registerUser({ email, password });
      alert("User registered! Check email for OTP.");
    } catch (error) {
      console.error("Register error:", error);
      alert(error.message || "Registration failed.");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.token); // or res.access_token
      alert("Logged in!");
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Login failed.");
    }
  };

  const handleAddProperty = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Login first!");

      const formData = new FormData();
      formData.append("title", "Luxury Villa");
      formData.append("description", "5 BHK near beach");
      formData.append("price", 12000000);
      formData.append("category", "villa");
      formData.append("location", "Goa");

      await addProperty(formData, token);
      alert("Property added!");
    } catch (error) {
      console.error("Add property error:", error);
      alert(error.message || "Failed to add property.");
    }
  };

  return (
    <div>
      <h1>Auth Test</h1>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleAddProperty}>Add Property</button>
    </div>
  );
}

export default AuthTest;
