import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Login from "./auth/Login";
import Home from "./home/Home";
import Navbar from "./home/Navbar";
import Register from "./auth/Register";
import ResetPassword from "./auth/ResetPassword";
import ChangePassword from "./auth/ChangePassword";

import "./App.css";

function App() {
  // Track if a user is logged in and stores the user's object from firebase auth
  const [user, setUser] = useState(null);
  // Track user's role (To be removed later)
  const [role, setRole] = useState(null);
  // Tracks page loading
  const [loading, setLoading] = useState(true);
  // Stores user data
  const [userData, setUserData] = useState({});
  const [currentWorkSpace, setCurrentWorkSpace] = useState(null);
  const [expandWorkSpace, setExpandWorkSpace] = useState(false);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("User authenticated:", currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setRole(data.role);
          setTeams(data.teams || []);
          setCurrentWorkSpace(data.teams ? data.teams[0].teamId : null);
        } else {
          console.log("No such user document!");
          setUserData(null);
        }
      } else {
        console.log("No user authenticated");
        setUserData(null);
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
          loggedIn={Boolean(user)}
          user={user}
          userData={userData}
          role={userData.role}
          setCurrentWorkSpace={setCurrentWorkSpace}
          currentWorkSpace={currentWorkSpace}
          setExpandWorkSpace={setExpandWorkSpace}
          expandWorkSpace={expandWorkSpace}
          teams={teams}
        />
        <Routes>
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {user ? (
            role ? (
              <Route
                path="/"
                element={
                  <Home
                    user={user}
                    userData={userData}
                    role={userData.role}
                    setCurrentWorkSpace={setCurrentWorkSpace}
                    currentWorkSpace={currentWorkSpace}
                    setExpandWorkSpace={setExpandWorkSpace}
                    expandWorkSpace={expandWorkSpace}
                    teams={teams}
                  />
                }
              />
            ) : (
              <Route path="/" element={<p>Loading role...</p>} />
            )
          ) : (
            <Route path="/" element={<Login setUser={setUser} />} />
          )}
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
