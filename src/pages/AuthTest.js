import React, { useState } from "react";
import { registerUser, loginUser, addProperty } from "../api/PropertyAPI"; // updated import

function AuthTest() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await registerUser({ username, password });
      alert("User registered!");
    } catch (error) {
      console.error("Register error:", error);
      alert("Registration failed.");
    }
  };

  const handleLogin = async () => {
    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);
      const res = await loginUser(params);
      localStorage.setItem("token", res.data.access_token);
      alert("Logged in!");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed.");
    }
  };

  const handleAddProperty = async () => {
    try {
      await addProperty({
        title: "Luxury Villa",
        description: "5 BHK near beach",
        price: 12000000,
        category: "villa",
        location: "Goa",
      });
      alert("Property added!");
    } catch (error) {
      console.error("Add property error:", error);
      alert("Failed to add property.");
    }
  };

  return (
    <div>
      <h1>Auth Test</h1>
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleAddProperty}>Add Property</button>
    </div>
  );
}

export default AuthTest;
