import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, verifyOTP } from "../api/PropertyAPI";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await registerUser({ email, password });
      setMessage(res.message);
      setStep(2);
      setShowOtpModal(true); // show OTP popup
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await verifyOTP({ email, otp });
      setMessage(res.message);
      setStep(1);
      setShowOtpModal(false);
      navigate("/login");
    } catch (err) {
      setError(err.message || "OTP verification failed");
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

        {step === 1 && (
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
        )}
      </div>

      {showOtpModal && (
        <div className="otp-modal">
          <div className="otp-content">
            <h3>Enter OTP</h3>
            <input
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
              maxLength={6}
              required
              autoFocus
            />
            <button onClick={handleVerifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              className="close-btn"
              onClick={() => !loading && setShowOtpModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
