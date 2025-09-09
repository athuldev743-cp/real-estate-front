import React, { useState } from "react";
import { registerUser, verifyOTP } from "../api/PropertyAPI";
import "./Register.css";

export default function Register({ setUser }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Register user
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await registerUser({ fullName, email, password, phone });
      if (res.message) {
        setStep(2); // Move to OTP verification
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail || err.message || "Registration failed"
      );
      console.error("Registration error:", err);
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
      if (res.access_token) {
        // Save tokens and user info
        localStorage.setItem("token", res.access_token);
        localStorage.setItem("refresh_token", res.refresh_token);
        localStorage.setItem("fullName", res.fullName);
        localStorage.setItem("email", res.email);
        localStorage.setItem("phone", res.phone);

        setUser({
          fullName: res.fullName,
          email: res.email,
          phone: res.phone,
        });

        // reset
        setOtp("");
        setStep(1);
      } else {
        setError("OTP verification failed.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail || err.message || "OTP verification failed"
      );
      console.error("OTP verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Create Account</h2>
        {error && <div className="error-msg">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleRegister}>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="otp-modal">
            <div className="otp-content">
              <h3>Enter OTP</h3>
              <form onSubmit={handleVerifyOtp}>
                <input
                  id="otp"
                  name="otp"
                  type="number"
                  inputMode="numeric"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <div className="otp-buttons">
                  <button type="submit" disabled={loading}>
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                  <button type="button" onClick={() => setStep(1)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
