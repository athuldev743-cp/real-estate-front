import React, { useState } from "react";
import { registerUser, verifyOTP, loginUser, addProperty } from "../api/PropertyAPI";

export default function AuthTest() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [mobileNO, setMobileNO] = useState("");
  const [message, setMessage] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  // Step 1: Register
  const handleRegister = async () => {
    try {
      if (!fullName || !email || !password) return alert("Full Name, Email & Password required");
      const res = await registerUser({ fullName, email, password });
      setMessage(res.message || "OTP sent to your email");
      setShowOtp(true);
    } catch (err) {
      alert(err.message);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    try {
      if (!otp) return alert("Enter OTP");
      const res = await verifyOTP({ email, otp });
      localStorage.setItem("token", res.token);
      localStorage.setItem("fullName", res.fullName);
      setToken(res.token);
      setShowOtp(false);
      alert("Registration successful!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Login
  const handleLogin = async () => {
    try {
      if (!email || !password) return alert("Email & Password required");
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("fullName", res.fullName);
      setToken(res.access_token);
      alert("Logged in!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Add property
  const handleAddProperty = async () => {
    try {
      if (!token) return alert("Login first!");
      if (!mobileNO) return alert("Mobile Number is required");

      const formData = new FormData();
      formData.append("title", "Luxury Villa");
      formData.append("description", "5 BHK near beach");
      formData.append("price", 12000000);
      formData.append("category", "villa");
      formData.append("location", "Goa");
      formData.append("mobileNO", mobileNO);

      // Optional: Add image
      // formData.append("image", selectedFile);

      const res = await addProperty(formData, token);
      alert("Property added: " + res.property.title);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Auth Test</h2>

      <h3>Register</h3>
      <input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} /><br />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
      <button onClick={handleRegister}>Register</button>

      {showOtp && (
        <>
          <h4>Enter OTP</h4>
          <input placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} /><br />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      )}

      <h3>Login</h3>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
      <button onClick={handleLogin}>Login</button>

      <h3>Add Property</h3>
      <input placeholder="Mobile Number" value={mobileNO} onChange={(e) => setMobileNO(e.target.value)} /><br />
      {/* Optional: <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} /> */}
      <button onClick={handleAddProperty}>Add Property</button>

      {message && <p>{message}</p>}
    </div>
  );
}
