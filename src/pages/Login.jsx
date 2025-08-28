import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/PropertyAPI";
import "./Login.css";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Email and password are required");

    setLoading(true);
    setError("");
    try {
      const res = await loginUser({ email, password });

      if (!res || !res.access_token) throw new Error(res?.detail || "Login failed");

      // ✅ Save token and fullName
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("fullName", res.fullName);

      // ✅ Update app state
      setUser({ fullName: res.fullName, email });

      navigate("/account");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
      </div>
    </div>
  );
}
