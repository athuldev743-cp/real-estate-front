import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, verifyOTP, resendOTP } from "../api/PropertyAPI"; // ✅ add resendOTP
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

  // ---------------- Step 1: Register ----------------
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Email and password are required");

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await registerUser({ email, password });

      // Always show OTP modal if backend sends OTP
      if (res.message.toLowerCase().includes("otp")) {
        setMessage(res.message);
        setShowOtpModal(true);
      } else {
        setMessage(res.message || "Registration response received");
      }

    } catch (err) {
      setError(err.message || "Registration failed");
      if (err.message?.toLowerCase().includes("otp")) {
        setShowOtpModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Step 2: Verify OTP ----------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return setError("Please enter OTP");

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await verifyOTP({ email, otp });
      localStorage.setItem("token", res.token);
      setMessage(res.message || "Registration successful!");
      setShowOtpModal(false);
      navigate("/account");

    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Resend OTP ----------------
  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await resendOTP({ email });
      setMessage(res.message || "New OTP sent to your email");
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
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
            <button className="resend-btn" onClick={handleResendOtp} disabled={loading}>
              {loading ? "Resending..." : "Resend OTP"}
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
