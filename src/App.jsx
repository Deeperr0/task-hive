import Loader from "./components/Loader";
import { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Login from "./auth/Login";
import Home from "./components/Home";
import Register from "./auth/Register";
import ResetPassword from "./auth/ResetPassword";
import ChangePassword from "./auth/ChangePassword";
import Features from "./components/Features/Features";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Pricing from "./components/Pricing";

export const WorkSpaceContext = createContext();
export const CurrentUserContext = createContext();
export const UserDataContext = createContext();
export const RoleContext = createContext();
function App() {
	// Authentication of user contains data like whether the email is verified and the email of the user and their uid
	const [user, setUser] = useState(null);

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
			if (currentUser) {
				const userDocRef = doc(db, "users", currentUser.uid);
				const userDoc = await getDoc(userDocRef);
				if (userDoc.exists()) {
					const data = userDoc.data();
					setUserData(data);
					// TODO make it so that it uses the last accessed workspace instead of simply the first one on the list
					const firstTeamId = Object.keys(data.teams)[0];
					const teamDocRef = doc(db, "teams", firstTeamId);
					const teamDoc = await getDoc(teamDocRef);
					if (teamDoc.exists()) {
						setCurrentWorkSpace(teamDoc.data());
					}
					setRole(data.teams[firstTeamId].role);
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
			<div className="flex justify-center items-center h-screen m-auto overflow-hidden">
				<Loader />
			</div>
		);
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
						<Router>
							<div className="w-full bg-customBackground h-full">
								<Routes>
									<Route
										path="/register"
										element={
											<Register
												user={user}
												setUser={setUser}
												usersList={usersList}
											/>
										}
									/>
									<Route path="/reset-password" element={<ResetPassword />} />
									<Route
										path="/"
										element={
											<Home
												user={user}
												userData={userData}
												teams={userData?.teams}
											/>
										}
									/>
									<Route path="/features" element={<Features />} />
									<Route path="/pricing" element={<Pricing />} />
									<Route path="/about-us" element={<AboutUs />} />
									<Route path="/contact" element={<ContactUs />} />
									<Route path="/change-password" element={<ChangePassword />} />

									<Route path="/login" element={<Login setUser={setUser} />} />
								</Routes>
							</div>
						</Router>
					</WorkSpaceContext.Provider>
				</CurrentUserContext.Provider>
			</UserDataContext.Provider>
		</RoleContext.Provider>
	);
}

export default App;
