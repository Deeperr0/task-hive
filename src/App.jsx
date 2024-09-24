import React from "react";
import Loader from "./components/Loader";
import { createContext, useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Home from "./components/Home";
import ErrorBoundary from "./utils/ErrorBoundary";
import Navbar from "./components/Navbar";
export const WorkSpaceContext = createContext({});
export const CurrentUserContext = createContext({});
export const UserDataContext = createContext({});
export const RoleContext = createContext("");
const LazyLogin = React.lazy(() => import("./auth/Login"));
const LazyRegister = React.lazy(() => import("./auth/Register"));
const LazyResetPassword = React.lazy(() => import("./auth/ResetPassword"));
const LazyChangePassword = React.lazy(() => import("./auth/ChangePassword"));
const LazyFeatures = React.lazy(() => import("./components/Features/Features"));
const LazyAboutUs = React.lazy(() => import("./components/AboutUs"));
const LazyContactUs = React.lazy(() => import("./components/ContactUs"));
const LazyPricing = React.lazy(() => import("./components/Pricing"));
import { toggleMenu } from "./signals/toggleMenu";
import { useSignals } from "@preact/signals-react/runtime";
import { getLatestUpdated } from "./utils/getLatestUpdated";
import fetchTeamsByIds from "./utils/fetchTeamsByIds";

function App() {
	useSignals();
	// Authentication of user. Contains data like whether the email is verified and the email of the user and their uid
	const [user, setUser] = useState(null);

	const [loading, setLoading] = useState(true);

	// Stores the data of the logged in user including their username and the teams they are a part of
	const [userData, setUserData] = useState({});

	// Stores the current work space of the logged in user
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
		teams: {
			teamId: {
				role: role of the user "admin" or "user",
			}
		}
	]
	 */
	// Fetches the list of users
	const [usersList, setUsersList] = useState([]);

	// Stores the role of the logged in user
	const [role, setRole] = useState(null);

	useEffect(() => {
		async function getUsersList() {
			const querySnapshot = await getDocs(collection(db, "users"));
			const users = querySnapshot.docs.map((doc) => doc.data());
			setUsersList(users);
		}
		getUsersList();
		// Check if user is authenticated
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			// If user is authenticated, fetch user data
			if (currentUser) {
				const userDocRef = doc(db, "users", currentUser.uid);
				const userDoc = await getDoc(userDocRef);
				if (userDoc.exists()) {
					const data = userDoc.data();
					const teamIds = Object.keys(data.teams); // Get the team IDs

					// Fetch only the teams for the current user
					const teams = await fetchTeamsByIds(teamIds);

					const lastUpdatedTeamId = getLatestUpdated(teams);
					if (lastUpdatedTeamId) {
						const teamDocRef = doc(db, "teams", lastUpdatedTeamId);
						const teamDoc = await getDoc(teamDocRef);
						if (teamDoc.exists()) {
							setCurrentWorkSpace(teamDoc.data());
						}
					}
					setUserData(data);
					setRole(data.teams[lastUpdatedTeamId].role);
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
		return <Loader />;
	}
	return (
		<RoleContext.Provider value={{ role, setRole }}>
			<UserDataContext.Provider value={{ userData, setUserData }}>
				<CurrentUserContext.Provider value={{ user, userData }}>
					<WorkSpaceContext.Provider
						value={{
							currentWorkSpace,
							setCurrentWorkSpace,
						}}
					>
						<ErrorBoundary>
							<Router>
								<div className="w-full bg-opacity-10 h-full">
									<Navbar
										user={user}
										toggleMenu={toggleMenu}
									/>
									<Routes>
										<Route
											path="/register"
											element={
												<Suspense fallback={<Loader />}>
													<LazyRegister
														user={user}
														setUser={setUser}
														usersList={usersList}
													/>
												</Suspense>
											}
										/>
										<Route
											path="/reset-password"
											element={
												<Suspense fallback={<Loader />}>
													<LazyResetPassword />
												</Suspense>
											}
										/>
										<Route
											path="/"
											element={
												<Home
													user={user}
													userData={userData}
													toggleMenu={toggleMenu}
												/>
											}
										/>
										<Route
											path="/pricing"
											element={
												<Suspense fallback={<Loader />}>
													<LazyPricing />
												</Suspense>
											}
										/>
										<Route
											path="/about-us"
											element={
												<Suspense fallback={<Loader />}>
													<LazyAboutUs />
												</Suspense>
											}
										/>
										<Route
											path="/contact"
											element={
												<Suspense fallback={<Loader />}>
													<LazyContactUs />
												</Suspense>
											}
										/>
										<Route
											path="/change-password"
											element={
												<Suspense fallback={<Loader />}>
													<LazyChangePassword />
												</Suspense>
											}
										/>

										<Route
											path="/login"
											element={
												<Suspense fallback={<Loader />}>
													<LazyLogin setUser={setUser} />
												</Suspense>
											}
										/>
									</Routes>
								</div>
							</Router>
						</ErrorBoundary>
					</WorkSpaceContext.Provider>
				</CurrentUserContext.Provider>
			</UserDataContext.Provider>
		</RoleContext.Provider>
	);
}

export default App;
