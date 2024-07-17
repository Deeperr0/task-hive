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
export const RoleContext = createContext();

function App() {
	// Authentication of user contains data like whether the email is verified and the email of the user and their uid
	const [user, setUser] = useState(null);

	// Stores the role of the logged in user
	//TODO: MAKE IT SO CHANGING THE CURRENT TEAM ALSO CHANGES THE ROLE
	const [role, setRole] = useState(null);

	const [loading, setLoading] = useState(true);

	const [userData, setUserData] = useState({});

	//TODO: MAYBE PUT THE CURRENT TEAM IN THE LOCAL STATE INSTEAD OF JUST THE TEAM'S ID
	const [currentWorkSpace, setCurrentWorkSpace] = useState(null);

	//TODO: MOVE THIS STATE TO BE A LOCAL STATE FOR THE SIDE MENU
	const [expandWorkSpace, setExpandWorkSpace] = useState(false);

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
			console.log("Users list:", users);
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
					console.log("Teams", data.teams);
					setCurrentWorkSpace(data.teams[0].teamId);
					setRole(data.teams[0].role);
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
		<RoleContext.Provider value={{ role, setRole }}>
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
										teams={userData.teams}
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
											role ? (
												<Route
													path="/"
													element={
														<Home
															user={user}
															userData={userData}
															role={role}
															setCurrentWorkSpace={setCurrentWorkSpace}
															currentWorkSpace={currentWorkSpace}
															setExpandWorkSpace={setExpandWorkSpace}
															expandWorkSpace={expandWorkSpace}
															teams={userData.teams}
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
		</RoleContext.Provider>
	);
}

export default App;
