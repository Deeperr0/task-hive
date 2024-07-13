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

import "./App.css";
import ChangePassword from "./auth/ChangePassword";

function App() {
	// Track if a user is logged in and stores the user's object from firebase auth
	const [user, setUser] = useState(null);

	// Track user's role (To be removed later)
	const [role, setRole] = useState(null);

	// Tracks page loading
	const [loading, setLoading] = useState(true);

	// Stores user data
	const [userData, setUserData] = useState({});
	useEffect(() => {
		// Listen for auth state changes
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			// Check if user is authenticated
			if (currentUser) {
				// Print message
				console.log("User authenticated:", currentUser);
				// Get user's role from firebase using the user's uid
				const userDocRef = doc(db, "users", currentUser.uid);
				// Retrieve the user's doc
				const userDoc = await getDoc(userDocRef);
				if (userDoc.exists()) {
					setUserData(userDoc.data());
					setRole(userDoc.data().role);
				} else {
					console.log("No such user document!");
					setUserData(null);
				}
			} else {
				console.log("No user authenticated");
				setUserData(null);
			}
			setUser(currentUser);
			console.log("user", currentUser);
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
					username={user ? user.email[0].toUpperCase() : ""}
				/>
				<Routes>
					<Route
						path="/register"
						element={<Register setUser={setUser} />}
					/>
					<Route
						path="/reset-password"
						element={<ResetPassword />}
					/>
					{user ? (
						role ? (
							<Route
								path="/"
								element={
									<Home
										user={user}
										userData={userData}
										role={userData.role}
									/>
								}
							/>
						) : (
							<Route
								path="/"
								element={<p>Loading role...</p>}
							/>
						)
					) : (
						<Route
							path="/"
							element={<Login setUser={setUser} />}
						/>
					)}
					<Route
						path="/change-password"
						element={<ChangePassword />}
					/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
