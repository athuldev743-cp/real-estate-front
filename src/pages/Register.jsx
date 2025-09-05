import React, { useState } from "react";
import { registerUser, verifyOtp } from "../api/PropertyAPI";

export default function Register({ setUser }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");   // ✅ added phone state
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser({ fullName, email, password, phone }); // ✅ send phone
      if (res.success) {
        setStep(2);
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyOtp({ email, otp });
      if (res.success) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("fullName", res.fullName);
        localStorage.setItem("email", res.email);
        localStorage.setItem("phone", res.phone);  // ✅ save phone
        setUser({ fullName: res.fullName, email: res.email, phone: res.phone });
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
    }
  };

  return (
    <div className="register-page">
      {step === 1 ? (
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
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
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
      )}
    </div>
  );
}
