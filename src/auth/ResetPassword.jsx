// ResetPassword.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import "./ResetPassword.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (event) => {
    event.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setMessage("Error sending password reset email.");
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Send Reset Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
