import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Placeholder for login logic
    alert(`Logged in as: ${email}`);
    // Navigate somewhere after login
    navigate("/");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Estateuro Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </form>
        <p className="register-link">
          Don't have an account? <span onClick={() => navigate("/add-property")}>Register here</span>
        </p>
      </div>
    </div>
  );
}
