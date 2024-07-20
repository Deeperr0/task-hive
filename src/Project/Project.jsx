import { useContext, useEffect, useState } from "react";
import {
	collection,
	getDocs,
	updateDoc,
	doc,
	query,
	where,
	getDoc,
	arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import Tasks from "../SideMenu/Tasks";
import "./Project.css";
import PropTypes from "prop-types";
import Loader from "../Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { WorkSpaceContext } from "../App";
import Overlay from "../Overlay/Overlay";

export default function Project({ user, userData, usersList }) {
	const { currentWorkSpace, setCurrentWorkSpace } =
		useContext(WorkSpaceContext);
	const [loading, setLoading] = useState(true);
	const [filteredTasks, setFilteredTasks] = useState([]);
	const [priorityFilter, setPriorityFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [userToAdd, setUserToAdd] = useState("");
	const [chosenRole, setChosenRole] = useState("");
	const [toggleAddUser, setToggleAddUser] = useState(false);

	useEffect(() => {
		setLoading(false);
	}, [currentWorkSpace]);

	useEffect(() => {
		function applyFilters() {
			let filtered = currentWorkSpace.tasks;
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
	}, [priorityFilter, statusFilter, currentWorkSpace]);

	if (loading) {
		return <Loader />;
	}

	async function addTask() {
		setLoading(true);
		if (currentWorkSpace.role !== "admin") return; // Ensure only admin can add tasks

		const newTask = {
			taskId: `task-${Date.now()}`, // Generate a unique task ID
			content: "New Task",
			owner: userData.username,
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
					if (
						userItem.teams.some(
							(team) => team.teamId === currentWorkSpace.teamId
						)
					) {
						const q = query(
							collection(db, "users"),
							where("username", "==", userItem.username)
						);
						const qSnapshot = await getDocs(q);
						const userDoc = qSnapshot.docs[0]; // Assuming there's only one user with this username

						if (userDoc) {
							const userData = userDoc.data();
							const updatedTeams = userData.teams.map((team) => {
								if (team.teamId === currentWorkSpace.teamId) {
									team.tasks.push(newTask);
								}
								return team;
							});

							const userDocRef = doc(db, "users", userDoc.id);
							await updateDoc(userDocRef, { teams: updatedTeams });
							setCurrentWorkSpace(
								updatedTeams.filter(
									(team) => team.teamId === currentWorkSpace.teamId
								)[0]
							);
						}
					}
				})
			);
		} catch (error) {
			console.error("Error adding task:", error);
		}
		setLoading(false);
	}
	async function updateTask(taskId, updates) {
		try {
			await Promise.all(
				usersList.map(async (userItem) => {
					if (
						userItem.teams.some(
							(team) => team.teamId === currentWorkSpace.teamId
						)
					) {
						const q = query(
							collection(db, "users"),
							where("username", "==", userItem.username)
						);
						const qSnapshot = await getDocs(q);
						const userDoc = qSnapshot.docs[0]; // Assuming there's only one user with this username
						if (userDoc) {
							const userData = userDoc.data();
							const updatedTeams = userData.teams.map((team) => {
								if (team.teamId === currentWorkSpace.teamId) {
									const updatedTasks = team.tasks.map((task) => {
										if (task.taskId === taskId) {
											// Update task immutably
											return { ...task, ...updates };
										}
										return task;
									});
									// Update team immutably
									setCurrentWorkSpace({
										...currentWorkSpace,
										tasks: updatedTasks,
									});
									return { ...team, tasks: updatedTasks };
								}
								return team;
							});

							const userDocRef = doc(db, "users", userDoc.id);
							await updateDoc(userDocRef, { teams: updatedTeams });
						}
					}
				})
			);
		} catch (error) {
			console.error("Error updating task:", error);
		}
	}

	async function deleteTask(taskId) {
		try {
			await Promise.all(
				usersList.map(async (userItem) => {
					if (
						userItem.teams.some(
							(team) => team.teamId === currentWorkSpace.teamId
						)
					) {
						const q = query(
							collection(db, "users"),
							where("username", "==", userItem.username)
						);
						const qSnapshot = await getDocs(q);
						const userDoc = qSnapshot.docs[0]; // Assuming there's only one user with this username

						if (userDoc) {
							const userData = userDoc.data();
							const updatedTeams = userData.teams.map((team) => {
								if (team.teamId === currentWorkSpace.teamId) {
									const updatedTasks = team.tasks.filter(
										(task) => task.taskId !== taskId
									);
									return { ...team, tasks: updatedTasks };
								}
								return team;
							});

							const userDocRef = doc(db, "users", userDoc.id);
							await updateDoc(userDocRef, { teams: updatedTeams });
							setCurrentWorkSpace(
								updatedTeams.filter(
									(team) => team.teamId === currentWorkSpace.teamId
								)[0]
							);
						}
					}
				})
			);
		} catch (error) {
			console.error("Error deleting task:", error);
		}
	}

	async function addUser(chosenRole) {
		const userOneRef = doc(db, "users", user.uid);
		const userOne = await getDoc(userOneRef);
		const userOneData = userOne.data();
		const currentWorkSpaceObj = userOneData.teams.find(
			(team) => team.teamId === currentWorkSpace
		);
		const q = query(collection(db, "users"), where("email", "==", userToAdd));
		const querySnapshot = await getDocs(q);
		const user2 = querySnapshot.docs[0];
		if (
			currentWorkSpace.teamMembers.filter(
				(member) => member.email === user2.data().email
			).length > 0
		) {
			return;
		}
		currentWorkSpaceObj.teamMembers.push({
			username: user2.data().username,
			uid: user2.id,
			email: user2.data().email,
		});
		currentWorkSpaceObj.role = chosenRole;
		console.log(currentWorkSpaceObj);
		const updatedTeamMembers = currentWorkSpaceObj.teamMembers;
		// Update current team object with new members
		const updatedTeams = userOneData.teams.map((team) => {
			if (team.teamId === currentWorkSpace.teamId) {
				return { ...team, teamMembers: updatedTeamMembers };
			}
			return team;
		});
		await updateDoc(userOneRef, { teams: updatedTeams });
		const user2Ref = doc(db, "users", user2.id);
		await updateDoc(user2Ref, { teams: arrayUnion(currentWorkSpaceObj) });
	}

	return (
		<div className="project">
			{toggleAddUser && (
				<Overlay>
					<div className="add-user-close">
						<FontAwesomeIcon
							icon={faArrowLeft}
							onClick={() => setToggleAddUser(false)}
						/>
					</div>

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
				</Overlay>
			)}

			<h2 className="project-title">Project Tasks</h2>
			{currentWorkSpace.role === "admin" && (
				<div className="add-buttons">
					<button
						onClick={addTask}
						className="add-button"
					>
						New task
					</button>
					<button
						className="add-user"
						onClick={() => setToggleAddUser(true)}
					>
						Add user
					</button>
				</div>
			)}
			<div className="filters-container">
				<h2 className="filters-title">Filters: </h2>
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
			<Tasks
				name="To do"
				tasksList={
					currentWorkSpace.role == "admin"
						? filteredTasks.filter((task) => task.status != "Done")
						: filteredTasks
								.filter((task) => task.status != "Done")
								.filter((task) => task.ownerUid == user.uid)
				}
				updateTask={updateTask} // Pass updateTask function
				deleteTask={deleteTask}
			/>
			<Tasks
				name="Done"
				tasksList={currentWorkSpace.tasks
					.filter((task) => task.status === "Done")
					.filter((task) => task.ownerUid == user.uid)}
				updateTask={updateTask} // Pass updateTask function
				deleteTask={deleteTask}
			/>
		</div>
	);
}

Project.propTypes = {
	user: PropTypes.object.isRequired,
	userData: PropTypes.object.isRequired,
	usersList: PropTypes.array.isRequired,
};
