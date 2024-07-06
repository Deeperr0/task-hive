import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import "./Navbar.css";

export default function Navbar({ loggedIn, username }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="nav--container">
      <nav>
        <div className="nav--left">
          <h1>TaskHive</h1>
        </div>
        <div className="nav--right">
          <div>
            {loggedIn ? (
              <>
                <button onClick={handleLogout} className="logout">
                  Logout
                </button>
                <h1 className="user-letter">{username}</h1>
              </>
            ) : (
              <FontAwesomeIcon icon={faUser} />
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
