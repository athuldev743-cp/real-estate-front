import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, verifyOTP } from "../api/PropertyAPI";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
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
    if (!email || !password) return setError("Email and password are required");

    setLoading(true);
    setError("");
    try {
      const res = await registerUser({ email, password });
      setMessage(res.message || "OTP sent to your email");
      setShowOtpModal(true); // show OTP modal
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
      setMessage(res.message || "Registration successful!");
      localStorage.setItem("token", res.token); // save token
      setShowOtpModal(false);
      navigate("/account"); // ✅ redirect directly to account (already logged in)
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
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>

      {showOtpModal && (
        <div className="otp-modal">
          <div className="otp-content">
            <h3>Enter OTP</h3>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button onClick={handleVerifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button className="close-btn" onClick={() => setShowOtpModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
