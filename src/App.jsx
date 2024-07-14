import { Loader } from "./Loader";
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
	const [user, setUser] = useState(null);
	// const [role, setRole] = useState(null);
	const [loading, setLoading] = useState(true);
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
					setTeams(data.teams || []);
					setCurrentWorkSpace(data.teams[0].teamId);
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
		return (
			<div id="loader-container">
				<Loader />
			</div>
		);
	}
	return (
		<Router>
			<div className="container">
				<Navbar
					user={user}
					userData={userData}
					setCurrentWorkSpace={setCurrentWorkSpace}
					currentWorkSpace={currentWorkSpace}
					setExpandWorkSpace={setExpandWorkSpace}
					expandWorkSpace={expandWorkSpace}
					teams={teams}
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
					{user != null ? (
						userData.role ? (
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
							<Route
								path="/"
								element={<Loader />}
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
