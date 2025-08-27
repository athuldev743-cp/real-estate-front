import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/PropertyAPI";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Simple email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    // Frontend validation
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      await registerUser({ email, password });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Register</h2>
        {message && <div className="error-message">{message}</div>}
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}
