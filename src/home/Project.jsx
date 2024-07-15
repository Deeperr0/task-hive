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
import { Loader } from "../Loader";

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
			console.log(usersList);
			console.log("Current team:", currentTeam);

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
											return { ...task, ...updates };
										}
										return task;
									});
									return { ...team, tasks: updatedTasks };
								}
								return team;
							});

							const userDocRef = doc(db, "users", userDoc.id);
							await updateDoc(userDocRef, { teams: updatedTeams });

							if (userItem.uid === user.uid) {
								setTasks(
									updatedTeams.find((team) => team.teamId === currentTeam)
										?.tasks || []
								);
							}
						}
					}
				})
			);
		} catch (error) {
			console.error("Error updating task:", error);
		}
	}

	// async function updateStatus(taskId, newStatus) {
	// 	await updateTask(taskId, {
	// 		status: newStatus,
	// 		lastUpdated: new Date().toISOString(),
	// 	});
	// }

	async function deleteTask(taskId) {
		try {
			const taskDocRef = doc(db, "tasks", taskId);
			await deleteDoc(taskDocRef);

			setTasks((prevTasks) =>
				prevTasks.filter((task) => task.taskId !== taskId)
			);
			setFilteredTasks((prevFilteredTasks) =>
				prevFilteredTasks.filter((task) => task.taskId !== taskId)
			);
		} catch (error) {
			console.error("Error deleting task:", error);
		}
	}

	return (
		<div className="project">
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
						onClick={() => navigate("/register")}
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
			{
				//TODO: MAKE IT SO THAT ONLY THE ADMIN SEES ALL THE TASKS
			}
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
