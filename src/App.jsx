import React from "react";
import Loader from "./components/ui/Loader";
import { createContext, useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Home from "./components/layout/Home";
import ErrorBoundary from "./utils/ErrorBoundary";
import Navbar from "./components/layout/Navbar";
export const WorkSpaceContext = createContext({});
export const CurrentUserContext = createContext({});
export const UserDataContext = createContext({});
export const RoleContext = createContext("");
const LazyLogin = React.lazy(() => import("./features/auth/Login"));
const LazyRegister = React.lazy(() => import("./features/auth/Register"));
const LazyResetPassword = React.lazy(() =>
	import("./features/auth/ResetPassword")
);
const LazyChangePassword = React.lazy(() =>
	import("./features/auth/ChangePassword")
);
const LazyFeatures = React.lazy(() =>
	import("./components/layout/Features/Features")
);
const LazyAboutUs = React.lazy(() => import("./components/layout/AboutUs"));
const LazyContactUs = React.lazy(() => import("./components/layout/ContactUs"));
const LazyPricing = React.lazy(() => import("./components/layout/Pricing"));
import { toggleMenu } from "./utils/signals/toggleMenu";
import { useSignals } from "@preact/signals-react/runtime";
import { getLatestUpdated } from "./utils/getLatestUpdated";
import fetchTeamsByIds from "./utils/fetchTeamsByIds";
import NotFound from "./components/layout/NotFound";
import TaskDetail from "./components/layout/TaskDetail";
import CreateTask from "./components/layout/CreateTask";

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

	const [currentTab, setCurrentTab] = useState("home");

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
					// TODO Make it show the last accessed team not the last updated
					const lastUpdatedTeamId = getLatestUpdated(teams);
					if (lastUpdatedTeamId) {
						const teamDocRef = doc(db, "teams", lastUpdatedTeamId);
						const teamDoc = await getDoc(teamDocRef);
						if (teamDoc.exists()) {
							setCurrentWorkSpace(teamDoc.data());
							console.log(teamDoc.data());
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
						}}>
						<ErrorBoundary>
							<Router>
								<div className="w-full bg-opacity-10 h-full">
									<Routes>
										<Route
											path="/register"
											element={
												<Suspense fallback={<Loader />}>
													<Navbar user={user} toggleMenu={toggleMenu} />
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
													<Navbar user={user} toggleMenu={toggleMenu} />
													<LazyResetPassword />
												</Suspense>
											}
										/>
										<Route
											path="/"
											element={
												<Home
													currentTab={currentTab}
													setCurrentTab={setCurrentTab}
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
													<Navbar user={user} toggleMenu={toggleMenu} />
													<LazyPricing />
												</Suspense>
											}
										/>
										<Route
											path="/about-us"
											element={
												<Suspense fallback={<Loader />}>
													<Navbar user={user} toggleMenu={toggleMenu} />
													<LazyAboutUs />
												</Suspense>
											}
										/>
										<Route
											path="/contact"
											element={
												<Suspense fallback={<Loader />}>
													<Navbar user={user} toggleMenu={toggleMenu} />
													<LazyContactUs />
												</Suspense>
											}
										/>
										<Route
											path="/change-password"
											element={
												<Suspense fallback={<Loader />}>
													<Navbar user={user} toggleMenu={toggleMenu} />
													<LazyChangePassword />
												</Suspense>
											}
										/>

										<Route
											path="/login"
											element={
												<Suspense fallback={<Loader />}>
													<Navbar user={user} toggleMenu={toggleMenu} />
													<LazyLogin setUser={setUser} />
												</Suspense>
											}
										/>
										<Route
											path="/*"
											element={
												<Suspense fallback={<Loader />}>
													<NotFound />
												</Suspense>
											}
										/>
										<Route
											path="/tasks/:taskId"
											element={
												<>
													<TaskDetail
														currentTab={currentTab}
														setCurrentTab={setCurrentTab}
														user={user}
														userData={userData}
														toggleMenu={toggleMenu}
													/>
												</>
											}
										/>
										<Route
											path="/add-task"
											element={
												<>
													<CreateTask />
												</>
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
