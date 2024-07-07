import React, { useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), { role: "user" });

      // Automatically log in the user after registration
      const loginUser = await signInWithEmailAndPassword(auth, email, password);
      setUser(loginUser.user);
      navigate("/"); // Redirect to the home page after successful login
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <form onSubmit={handleRegister} className="register-container">
      <h2 className="register-title">Register</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        autoFocus
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        minLength={6}
        maxLength={20}
      />
      <button type="submit" className="register-button">
        Register
      </button>
    </form>
  );
}
