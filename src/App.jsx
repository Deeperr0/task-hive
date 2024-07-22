import Loader from "./components/Loader";
import { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Login from "./auth/Login";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Register from "./auth/Register";
import ResetPassword from "./auth/ResetPassword";
import ChangePassword from "./auth/ChangePassword";

import "./App.css";

export const WorkSpaceContext = createContext();
export const CurrentUserContext = createContext();
export const UserDataContext = createContext();
function App() {
	// Authentication of user contains data like whether the email is verified and the email of the user and their uid
	const [user, setUser] = useState(null);

	// Stores the role of the logged in user
	// const [role, setRole] = useState(null);

	const [loading, setLoading] = useState(true);

	const [userData, setUserData] = useState({});

	const [currentWorkSpace, setCurrentWorkSpace] = useState(null);

	// Stores the list of team objects the logged in user is a part of
	// Can use userData.teams instead of using it as a state
	// const [teams, setTeams] = useState([]);
	/*
	Stores the list of user documents each storing the data of a user and it looks like this
	[
	{
		firstName: first name of the user,
		lastName: last name of the user,
		email: email of the user,
		username: "user1",
		teams: 
		[
			{
				created:
				createdById:
				lastUpdated:
				role:
				teamMembers:
				teamId: "team1",
				teamName: "Team 1",
				tasks: [
				{
					taskId: "task1",
					content: "Task 1",
					owner: "user1",
					ownerUid: "uid1",
					status: "Not started",
					deadline: "2022-01-01",
					priority: "Low",
					notes: "Task 1 notes",
					lastUpdated: "2022-01-01"
				}
				]
			}
		]
	}
	]
	 */
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
					// setTeams(data.teams);
					setCurrentWorkSpace(data.teams[0]);
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
			<CurrentUserContext.Provider value={{ user, userData }}>
				<WorkSpaceContext.Provider
					value={{
						currentWorkSpace,
						setCurrentWorkSpace,
					}}
				>
					<Router>
						<div className="container">
							<Navbar
								user={user}
								userData={userData}
								setCurrentWorkSpace={setCurrentWorkSpace}
								currentWorkSpace={currentWorkSpace}
								//TODO: CHECK ON WHY THIS IS WORKING WEIRDLY
								teams={user ? userData.teams : []}
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
									<Route
										path="/"
										element={
											<Home
												user={user}
												userData={userData}
												role={currentWorkSpace ? currentWorkSpace.role : ""}
												setCurrentWorkSpace={setCurrentWorkSpace}
												currentWorkSpace={currentWorkSpace}
												teams={userData.teams}
												usersList={usersList}
											/>
										}
									/>
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
				</WorkSpaceContext.Provider>
			</CurrentUserContext.Provider>
		</UserDataContext.Provider>
	);
}

export default App;
