import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, verifyOTP } from "../api/PropertyAPI";
import "./Register.css";

export default function Register({ setUser }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Step 1: Register
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) return setError("Full name, email, and password are required");

    setLoading(true);
    setError("");
    try {
      const res = await registerUser({ email, password });
      setMessage(res.message || "OTP sent to your email");
      setShowOtpModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return setError("Please enter OTP");

    setLoading(true);
    setError("");
    try {
      const res = await verifyOTP({ email, otp });

      // ✅ Store token and fullName locally
      localStorage.setItem("token", res.token);
      localStorage.setItem("fullName", res.fullName);

      // ✅ Update app state
      setUser({ fullName: res.fullName, email });

      setMessage(res.message || "Registration successful!");
      setShowOtpModal(false);
      navigate("/"); // redirect to Home
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Register</h2>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
        </form>
      </div>

      {showOtpModal && (
        <div className="otp-modal">
          <div className="otp-content">
            <h3>Enter OTP</h3>
            <input type="text" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <button onClick={handleVerifyOtp} disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</button>
            <button className="close-btn" onClick={() => setShowOtpModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
