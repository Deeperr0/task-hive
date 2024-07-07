import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Login from "./auth/Login";
import Home from "./home/Home";
import Navbar from "./home/Navbar";
import Register from "./auth/Register";
import ResetPassword from "./auth/ResetPassword";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("User authenticated:", currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          console.log("User role:", userDoc.data().role);
          setRole(userDoc.data().role);
        } else {
          console.log("No such user document!");
          setRole(null);
        }
      } else {
        console.log("No user authenticated");
        setRole(null);
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      {console.log(user)}
      <div className="container">
        <Navbar
          loggedIn={!!user}
          username={!!user ? user.email[0].toUpperCase() : ""}
        />
        <Routes>
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {user ? (
            role ? (
              <Route path="/" element={<Home user={user} role={role} />} />
            ) : (
              <Route path="/" element={<p>Loading role...</p>} />
            )
          ) : (
            <Route path="/" element={<Login setUser={setUser} />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
