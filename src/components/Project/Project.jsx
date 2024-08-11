import AddUser from "../AddUser";
import Filters from "../Filters";
import { useContext, useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import Tasks from "../Tasks";
import PropTypes from "prop-types";
import { WorkSpaceContext } from "../../App";
import useFilterTasks from "../../hooks/useFilterTasks";
import getUserDoc from "../../utils/getUserDoc";

export default function Project({ user, userData, usersList }) {
	const { currentWorkSpace, setCurrentWorkSpace } =
		useContext(WorkSpaceContext);
	const [priorityFilter, setPriorityFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [toggleAddUser, setToggleAddUser] = useState(false);

	const filteredTasks = useFilterTasks(
		priorityFilter,
		statusFilter,
		currentWorkSpace
	);

	async function addTask() {
		if (currentWorkSpace.role !== "admin") return; // Ensure only admin can add tasks

		// Create new Task object
		// Consider using a constructor for better performance
		const newTask = {
			taskId: `task-${Date.now()}`,
			content: "New Task",
			owner: userData.username,
			ownerUid: user.uid,
			status: "Not started",
			deadline: new Date().toISOString().split("T")[0],
			priority: "Low",
			notes: "",
			lastUpdated: new Date().toISOString(),
		};

		// Add new task to all users in the team
		// Consider making teams a seperate collection and only storing a reference to them in the user document
		try {
			await Promise.all(
				usersList.map(async (userItem) => {
					if (
						userItem.teams.some(
							(team) => team.teamId === currentWorkSpace.teamId
						)
					) {
						const userDoc = await getUserDoc(userItem.username);

						if (!userDoc) {
							return;
						}
						const userData = userDoc.data();
						const updatedTeams = userData.teams.map((team) => {
							if (team.teamId === currentWorkSpace.teamId) {
								return {
									...team,
									tasks: [...team.tasks, newTask],
								};
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
				})
			);
		} catch (error) {
			console.error("Error adding task:", error);
		}
	}

	// Updating task in all users in the team
	async function updateTask(taskId, updates) {
		try {
			await Promise.all(
				usersList.map(async (userItem) => {
					if (
						userItem.teams.some(
							(team) => team.teamId === currentWorkSpace.teamId
						)
					) {
						const userDoc = await getUserDoc(userItem.username);
						if (!userDoc) {
							return;
						}
						const userData = userDoc.data();
						const updatedTeams = userData.teams.map((team) => {
							if (team.teamId === currentWorkSpace.teamId) {
								const updatedTasks = team.tasks.map((task) => {
									if (task.taskId === taskId) {
										return { ...task, ...updates };
									}
									return task;
								});
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
				})
			);
		} catch (error) {
			console.error("Error updating task:", error);
		}
	}

	// Delete task from all the users in the team
	async function deleteTask(taskId) {
		try {
			await Promise.all(
				usersList.map(async (userItem) => {
					if (
						userItem.teams.some(
							(team) => team.teamId === currentWorkSpace.teamId
						)
					) {
						const userDoc = await getUserDoc(userItem.username);
						if (!userDoc) {
							return;
						}
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
				})
			);
		} catch (error) {
			console.error("Error deleting task:", error);
		}
	}

	return (
		<div className="flex flex-col items-start gap-4 pt-4">
			{toggleAddUser && (
				<AddUser
					toggleAddUser={toggleAddUser}
					setToggleAddUser={setToggleAddUser}
					user={user}
					currentWorkSpace={currentWorkSpace}
				/>
			)}

			<h2 className="text-primaryText text-2xl">Project Tasks</h2>
			{currentWorkSpace?.role === "admin" && (
				<div className="flex gap-4 w-fit">
					<button
						onClick={addTask}
						className="bg-accentShade1 text-customBackground py-2 px-3 rounded-lg">
						New task
					</button>
					<button
						className="bg-accentShade1 text-customBackground py-2 px-3 rounded-lg"
						onClick={() => setToggleAddUser(true)}>
						Add user
					</button>
				</div>
			)}
			<Filters
				setPriorityFilter={setPriorityFilter}
				setStatusFilter={setStatusFilter}
			/>
			<Tasks
				name="To do"
				tasksList={
					currentWorkSpace?.role === "admin"
						? filteredTasks.filter((task) => task.status != "Done")
						: filteredTasks
								.filter((task) => task.status != "Done")
								.filter((task) => task.ownerUid === user.uid)
				}
				updateTask={updateTask}
				deleteTask={deleteTask}
			/>
			<Tasks
				name="Done"
				tasksList={
					currentWorkSpace?.tasks
						? currentWorkSpace.tasks
								.filter((task) => task.status === "Done")
								.filter((task) => task.ownerUid === user.uid)
						: []
				}
				updateTask={updateTask}
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
