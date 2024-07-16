import { Loader } from "./Loader";
import { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Login from "./auth/Login";
import Home from "./home/Home";
import Navbar from "./home/Navbar";
import Register from "./auth/Register";
import ResetPassword from "./auth/ResetPassword";
import ChangePassword from "./auth/ChangePassword";

import "./App.css";

export const AuthContext = createContext();
export const WorkSpaceContext = createContext();
export const UsersListContext = createContext();
export const UserDataContext = createContext();

function App() {
	const [user, setUser] = useState(null);
	// const [role, setRole] = useState(null);
	const [loading, setLoading] = useState(true);
	const [userData, setUserData] = useState({});
	const [currentWorkSpace, setCurrentWorkSpace] = useState(null);
	const [expandWorkSpace, setExpandWorkSpace] = useState(false);
	const [teams, setTeams] = useState([]);
	const [usersList, setUsersList] = useState([]);

	useEffect(() => {
		async function getUsersList() {
			const querySnapshot = await getDocs(collection(db, "users"));
			const users = querySnapshot.docs.map((doc) => doc.data());
			setUsersList(users);
		}
		getUsersList();
		// Check if user is authenticated
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				const userDocRef = doc(db, "users", currentUser.uid);
				const userDoc = await getDoc(userDocRef);
				if (userDoc.exists()) {
					const data = userDoc.data();
					setUserData(data);
					setTeams(data.teams);
					setCurrentWorkSpace(data.teams[0].teamId);
				} else {
					setUserData(null);
				}
			} else {
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
		<UserDataContext.Provider value={{ userData, setUserData }}>
			<UsersListContext.Provider value={{ usersList, setUsersList }}>
				<WorkSpaceContext.Provider
					value={{
						currentWorkSpace,
						setCurrentWorkSpace,
					}}
				>
					<AuthContext.Provider value={{ user, setUser }}>
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
										element={
											<Register
												setUser={setUser}
												usersList={usersList}
											/>
										}
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
														usersList={usersList}
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
					</AuthContext.Provider>
				</WorkSpaceContext.Provider>
			</UsersListContext.Provider>
		</UserDataContext.Provider>
	);
}

export default App;
