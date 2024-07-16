import { useEffect, useState } from "react";
import {
	collection,
	getDocs,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
	query,
	where,
	getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Tasks from "./Tasks";
import "./Project.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function Project({
	user,
	role,
	currentTeam,
	userData,
	usersList,
}) {
	const [tasks, setTasks] = useState([]);
	// const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filteredTasks, setFilteredTasks] = useState([]);
	const [priorityFilter, setPriorityFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [userToAdd, setUserToAdd] = useState("");
	const [chosenRole, setChosenRole] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const userTasks =
			userData.teams.find((team) => team.teamId === currentTeam)?.tasks || [];
		setTasks(userTasks);
		setFilteredTasks(userTasks); // Ensure filteredTasks is also set
		setLoading(false);
	}, [userData, currentTeam]);

	useEffect(() => {
		function applyFilters() {
			let filtered = tasks;
			if (priorityFilter) {
				filtered = filtered.filter(
					(task) => task.priority.toLowerCase() === priorityFilter.toLowerCase()
				);
			}
			if (statusFilter) {
				filtered = filtered.filter(
					(task) => task.status.toLowerCase() === statusFilter.toLowerCase()
				);
			}
			setFilteredTasks(filtered);
		}

		applyFilters();
	}, [priorityFilter, statusFilter, tasks]);
		applyFilters();
	}, [priorityFilter, statusFilter, tasks]);

	if (loading) {
		return <Loader />;
	}

	async function addTask() {
		if (role !== "admin") return; // Ensure only admin can add tasks

		const newTask = {
			taskId: `task-${Date.now()}`, // Generate a unique task ID
			content: "New Task",
			owner: user.email,
			ownerUid: user.uid,
			status: "Not started",
			deadline: new Date().toISOString().split("T")[0],
			priority: "Low",
			notes: "",
			lastUpdated: new Date().toISOString(),
		};

		try {
			await Promise.all(
				usersList.map(async (userItem) => {
					if (userItem.teams.some((team) => team.teamId === currentTeam)) {
						const q = query(
							collection(db, "users"),
							where("username", "==", userItem.username)
						);
						const qSnapshot = await getDocs(q);
						const userDoc = qSnapshot.docs[0]; // Assuming there's only one user with this username

						if (userDoc) {
							const userData = userDoc.data();
							const updatedTeams = userData.teams.map((team) => {
								if (team.teamId === currentTeam) {
									team.tasks.push(newTask);
								}
								return team;
							});

							const userDocRef = doc(db, "users", userDoc.id);
							await updateDoc(userDocRef, { teams: updatedTeams });
							if (userItem.uid === user.uid) {
								setTasks((prevTasks) => [...prevTasks, newTask]);
								setFilteredTasks((prevFilteredTasks) => [
									...prevFilteredTasks,
									newTask,
								]);
							}
						}
					}
				})
			);
		} catch (error) {
			console.error("Error adding task:", error);
		}
	}
	async function updateTask(taskId, updates) {
		try {
			await Promise.all(
				usersList.map(async (userItem) => {
					if (userItem.teams.some((team) => team.teamId === currentTeam)) {
						const q = query(
							collection(db, "users"),
							where("username", "==", userItem.username)
						);
						const qSnapshot = await getDocs(q);
						const userDoc = qSnapshot.docs[0]; // Assuming there's only one user with this username

						if (userDoc) {
							const userData = userDoc.data();
							const updatedTeams = userData.teams.map((team) => {
								if (team.teamId === currentTeam) {
									const updatedTasks = team.tasks.map((task) => {
										if (task.taskId === taskId) {
											// Update task immutably
											return { ...task, ...updates };
										}
										return task;
									});
									// Update team immutably
									return { ...team, tasks: updatedTasks };
								}
								return team;
							});

							const userDocRef = doc(db, "users", userDoc.id);
							await updateDoc(userDocRef, { teams: updatedTeams });

							// Update local state if the current user is affected
							if (userItem.email === user.email) {
								setTasks(
									updatedTeams.find((team) => team.teamId === currentTeam)
										?.tasks || []
								);
								// Filter tasks based on current filters
								const filtered = applyCurrentFilters(updatedTeams);
								setFilteredTasks(filtered);
							}
						}
					}
				})
			);
		} catch (error) {
			console.error("Error updating task:", error);
		}
	}

	// Helper function to apply current priority and status filters
	function applyCurrentFilters(teams) {
		let filtered =
			teams.find((team) => team.teamId === currentTeam)?.tasks || [];
		if (priorityFilter) {
			filtered = filtered.filter(
				(task) => task.priority.toLowerCase() === priorityFilter.toLowerCase()
			);
		}
		if (statusFilter) {
			filtered = filtered.filter(
				(task) => task.status.toLowerCase() === statusFilter.toLowerCase()
			);
		}
		return filtered;
	}

	// async function updateStatus(taskId, newStatus) {
	// 	await updateTask(taskId, {
	// 		status: newStatus,
	// 		lastUpdated: new Date().toISOString(),
	// 	});
	// }

	async function deleteTask(taskId) {
		try {
			await Promise.all(
				usersList.map(async (userItem) => {
					if (userItem.teams.some((team) => team.teamId === currentTeam)) {
						const q = query(
							collection(db, "users"),
							where("username", "==", userItem.username)
						);
						const qSnapshot = await getDocs(q);
						const userDoc = qSnapshot.docs[0]; // Assuming there's only one user with this username

						if (userDoc) {
							const userData = userDoc.data();
							const updatedTeams = userData.teams.map((team) => {
								if (team.teamId === currentTeam) {
									const updatedTasks = team.tasks.filter(
										(task) => task.taskId !== taskId
									);
									return { ...team, tasks: updatedTasks };
								}
								return team;
							});

							const userDocRef = doc(db, "users", userDoc.id);
							await updateDoc(userDocRef, { teams: updatedTeams });

							// Update local state if the current user is affected
							if (userItem.email === user.email) {
								setTasks(
									updatedTeams.find((team) => team.teamId === currentTeam)
										?.tasks || []
								);
								const filtered = applyCurrentFilters(updatedTeams);
								setFilteredTasks(filtered);
							}
						}
					}
				})
			);
		} catch (error) {
			console.error("Error deleting task:", error);
		}
	}

	//TODO:MAKE IT SO THAT THE ADMIN CAN CHOOSE ROLE OF ADDED USER
	async function addUser(chosenRole) {
		const userOneRef = doc(db, "users", user.uid);
		const userOne = await getDoc(userOneRef);
		const userOneData = userOne.data();
		const currentTeamObj = userOneData.teams.find(
			(team) => team.teamId === currentTeam
		);
		const q = query(collection(db, "users"), where("email", "==", userToAdd));
		const querySnapshot = await getDocs(q);
		const user2 = querySnapshot.docs[0];
		console.log(user2.data());
		if (
			userData.teams
				.filter((team) => team.teamId === currentTeam)[0]
				.teamMembers.filter((member) => member.email === user2.data().email)
				.length > 0
		) {
			return;
		}
		currentTeamObj.teamMembers.push({
			username: user2.data().username,
			uid: user2.id,
			email: user2.data().email,
		});
		currentTeamObj.role = chosenRole;
		console.log(currentTeamObj);
		const updatedTeamMembers = currentTeamObj.teamMembers;
		// Update current team object with new members
		const updatedTeams = userOneData.teams.map((team) => {
			if (team.teamId === currentTeam) {
				return { ...team, teamMembers: updatedTeamMembers };
			}
			return team;
		});
		await updateDoc(userOneRef, { teams: updatedTeams });
		const user2Ref = doc(db, "users", user2.id);
		await updateDoc(user2Ref, { teams: arrayUnion(currentTeamObj) });
		// const currentTeamObj = userData.teams.find(
		//   (team) => team.teamId === currentTeam
		// );
		// try {
		//   // Check if the user exists in Firestore
		//   const q = query(collection(db, "users"), where("email", "==", userToAdd));
		//   const querySnapshot = await getDocs(q);
		//   if (querySnapshot.empty) {
		//     navigate("/register"); // User not found, navigate to register page or handle accordingly
		//     return;
		//   }
		//   querySnapshot.forEach(async (doc) => {
		//     console.log(doc.data());
		//     const userData = doc.data();
		//     const userId = doc.id;
		//     // Update current team in the user's document
		//     const updatedUserTeams = [...userData.teams, currentTeamObj];
		//     const userDocRef = doc(db, "users", userId); // Corrected: use doc()
		//     await updateDoc(userDocRef, { teams: updatedUserTeams });
		//     // Update current user's teams with the added user
		//     const updatedCurrentTeams = usersList.map((userItem) => {
		//       if (userItem.email === userToAdd) {
		//         // Corrected: compare with userToAdd
		//         // Add user to current team's members
		//         currentTeamObj.teamMembers.push(userData.email);
		//         // Add current team to the user's teams
		//         userItem.teams.push(currentTeamObj);
		//       }
		//       return userItem;
		//     });
		//     // Update Firestore with the modified current user's teams
		//     const currentUserDocRef = doc(db, "users", user.uid); // Corrected: use doc()
		//     await updateDoc(currentUserDocRef, { teams: updatedCurrentTeams });
		//     // Clear userToAdd state after successful addition
		//     setUserToAdd("");
		//   });
		// } catch (error) {
		//   console.error("Error adding user:", error);
		// }
	}

	return (
		<div className="project">
			<div className="add-user-container hidden">
				<h2 className="add-user-title">Add User</h2>
				<div className="add-user-inputs">
					<input
						type="text"
						placeholder="Enter user email"
						value={userToAdd}
						onChange={(e) => setUserToAdd(e.target.value)}
					/>
					<select onChange={(e) => setChosenRole(e.target.value)}>
						<option value="admin">Admin</option>
						<option value="user">User</option>
					</select>
					<button onClick={() => addUser(chosenRole)}>Add</button>
				</div>
			</div>
			<h2 className="project-title">Project Tasks</h2>
			{userData.teams.find((team) => team.teamId === currentTeam).role ===
				"admin" && (
				<div className="add-buttons">
					<button
						onClick={addTask}
						className="add-button"
					>
						New task
					</button>
					<button
						className="add-user"
						onClick={addUser}
					>
						Add user
					</button>
				</div>
			)}
			<div className="filters-container">
				<h2 className="filters-title">Filters</h2>
				<div className="filters">
					<div>
						<p>Priority</p>
						<select onChange={(e) => setPriorityFilter(e.target.value)}>
							<option value="">All</option>
							<option value="Low">Low</option>
							<option value="Medium">Medium</option>
							<option value="High">High</option>
							<option value="Critical">Critical</option>
						</select>
					</div>
					<div>
						<p>Status</p>
						<select onChange={(e) => setStatusFilter(e.target.value)}>
							<option value="">All</option>
							<option value="Not started">Not started</option>
							<option value="Working on it">Working on it</option>
							<option value="Stuck">Stuck</option>
						</select>
					</div>
				</div>
			</div>
			{}
			<Tasks
				name="To do"
				tasksList={tasks.filter((task) => task.status !== "Done")}
				updateTask={updateTask} // Pass updateTask function
				deleteTask={deleteTask}
				role={userData.teams.find((team) => team.teamId === currentTeam).role}
				users={
					userData.teams.find((team) => team.teamId === currentTeam)?.users ||
					[]
				} // Pass users list to Tasks component
				currentUserUid={user.uid} // Pass current user UID to Tasks component
				// updateStatus={updateStatus} // Pass updateStatus function
				usersList={usersList}
				userData={userData}
			/>
			<Tasks
				name="Done"
				tasksList={tasks.filter((task) => task.status === "Done")}
				updateTask={updateTask} // Pass updateTask function
				deleteTask={deleteTask}
				role={role}
				users={
					userData.teams.find((team) => team.teamId === currentTeam)?.users ||
					[]
				} // Pass users list to Tasks component
				currentUserUid={user.uid} // Pass current user UID to Tasks component
				usersList={usersList}
				userData={userData}
			/>
		</div>
	);
}

Project.propTypes = {
	user: PropTypes.object.isRequired,
	role: PropTypes.string.isRequired,
	userData: PropTypes.object.isRequired,
	currentTeam: PropTypes.string.isRequired,
	usersList: PropTypes.array.isRequired,
};
