import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/PropertyAPI";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser({ email, password });

      // Save token to localStorage
      localStorage.setItem("token", res.access_token);

      alert("Login successful!");
      navigate("/"); // redirect to home
    } catch (err) {
      // Handle unverified email separately
      if (err.message.includes("Email not verified")) {
        setError(
          "Your email is not verified. Please check your inbox for the OTP."
        );
      } else {
        setError("Login failed: Invalid email or password");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
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
        <div className="register-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register here</span>
        </div>
      </div>
    </div>
  );
}
