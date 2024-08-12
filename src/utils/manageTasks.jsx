import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
export async function addTask(
	role,
	userData,
	user,
	currentWorkSpace,
	setCurrentWorkSpace
) {
	if (role !== "admin") return; // Ensure only admin can add tasks

	// Create new Task object
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

	try {
		const teamDocRef = doc(db, "teams", currentWorkSpace.teamId);
		await updateDoc(teamDocRef, {
			...currentWorkSpace,
			tasks: [...currentWorkSpace.tasks, newTask],
		});
		setCurrentWorkSpace({
			...currentWorkSpace,
			tasks: [...currentWorkSpace.tasks, newTask],
		});
	} catch (error) {
		console.error("Error adding task:", error);
	}
}

export async function updateTask(
	taskId,
	updates,
	currentWorkSpace,
	setCurrentWorkSpace
) {
	try {
		const teamDocRef = doc(db, "teams", currentWorkSpace.teamId);
		const updatedTasks = currentWorkSpace.tasks.map((task) => {
			if (task.taskId === taskId) {
				return { ...task, ...updates };
			}
			return task;
		});
		await updateDoc(teamDocRef, {
			...currentWorkSpace,
			tasks: updatedTasks,
		});
		setCurrentWorkSpace({
			...currentWorkSpace,
			tasks: updatedTasks,
		});
	} catch (error) {
		console.error("Error updating task:", error);
	}
}

export async function deleteTask(
	taskId,
	currentWorkSpace,
	setCurrentWorkSpace
) {
	try {
		const teamDocRef = doc(db, "teams", currentWorkSpace.teamId);

		const updatedTasks = currentWorkSpace.tasks.filter(
			(task) => task.taskId !== taskId
		);
		await updateDoc(teamDocRef, {
			...currentWorkSpace,
			tasks: updatedTasks,
		});
		setCurrentWorkSpace({
			...currentWorkSpace,
			tasks: updatedTasks,
		});
	} catch (error) {
		console.error("Error deleting task:", error);
	}
}
