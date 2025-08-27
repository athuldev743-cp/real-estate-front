import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, verifyOTP } from "../api/PropertyAPI";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState(""); // optional if backend supports
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: register, 2: OTP verification
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Step 1: Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await registerUser({ name, email, password });
      setMessage(res.message || "OTP sent to your email");
      setStep(2);
      setShowOtpModal(true);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await verifyOTP({ email, otp });
      // Save token returned by backend
      if (res.token) localStorage.setItem("token", res.token);
      setMessage(res.message || "OTP verified successfully");
      setStep(1);
      setShowOtpModal(false);
      navigate("/"); // redirect to home after successful OTP
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
              type="text"
              placeholder="Full Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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

      {/* OTP Modal */}
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
            <button
              className="close-btn"
              onClick={() => setShowOtpModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
