import AddUser from "../../teams/AddUser";
import Filters from "../../ui/Filters";
import { useContext, useState } from "react";
import Tasks from "../Tasks";
import PropTypes from "prop-types";
import { RoleContext, WorkSpaceContext } from "../../../App";
import useFilterTasks from "../../../hooks/useFilterTasks";
import { addTask } from "../../../utils/manageTasks";
export default function Project({ user, userData }) {
	// Stores the current work space of the logged in user
	const { currentWorkSpace, setCurrentWorkSpace } =
		useContext(WorkSpaceContext);
	// Stores the chosen priority filter (if any)
	const [priorityFilter, setPriorityFilter] = useState("");
	// Toggles the AddUser Overlay form to add a user to the project
	const [toggleAddUser, setToggleAddUser] = useState(false);
	// Stores the role of the logged in user (admins have more permissions)
	const { role } = useContext(RoleContext);
	// Filters the tasks based on the priority
	const filteredTasks = useFilterTasks(priorityFilter, currentWorkSpace);

	return (
		<div className="flex flex-col items-start gap-4 pt-4">
			{/* Conditionally renders the AddUser form */}
			{toggleAddUser && (
				<AddUser
					toggleAddUser={toggleAddUser}
					setToggleAddUser={setToggleAddUser}
					user={user}
					currentWorkSpace={currentWorkSpace}
				/>
			)}
			<h2 className="text-primaryText text-2xl">Project Tasks</h2>
			{/* Admins can add new tasks and add new Users */}
			{role === "admin" && (
				<div className="flex gap-4 w-fit">
					<button
						onClick={() =>
							addTask(
								role,
								userData,
								user,
								currentWorkSpace,
								setCurrentWorkSpace
							)
						}
						className="bg-accent-500 hover:bg-accent-600 text-customBackground py-2 px-3 rounded-lg transition-all duration-300">
						New task
					</button>
					<button
						className="bg-accent-500 hover:bg-accent-600 text-customBackground py-2 px-3 rounded-lg transition-all duration-300"
						onClick={() => setToggleAddUser(true)}>
						Add user
					</button>
				</div>
			)}
			<Filters setPriorityFilter={setPriorityFilter} />
			<div className="flex flex-col lg:flex-row gap-4 w-full">
				{/*
					TODO possibly make it possible to submit a request to add a new task
					so that for example a team member can // assign a task to another team
					member (the task has to be first approved by the admin before it is
					added) and then the admin can accept or reject the request
				*/}
				{/* Admins have all the tasks rendered not only the ones assigned to them*/}

				<Tasks
					name="To do"
					tasksList={
						role === "admin"
							? filteredTasks.filter((task) => task.status == "Not started")
							: filteredTasks
									.filter((task) => task.status == "Not started")
									.filter((task) => task.owner === userData.username)
					}
				/>
				<Tasks
					name="In progress"
					tasksList={
						role === "admin"
							? filteredTasks.filter((task) => task.status === "Working on it")
							: filteredTasks
									.filter((task) => task.status === "Working on it")
									.filter((task) => task.owner === userData.username)
					}
				/>
				<Tasks
					name="Stuck"
					tasksList={
						role === "admin"
							? filteredTasks.filter((task) => task.status === "Stuck")
							: filteredTasks
									.filter((task) => task.status === "Stuck")
									.filter((task) => task.owner === userData.username)
					}
				/>
				<Tasks
					name="Done"
					tasksList={
						role === "admin"
							? filteredTasks.filter((task) => task.status === "Done")
							: filteredTasks
									.filter((task) => task.status === "Done")
									.filter((task) => task.owner === userData.username)
					}
				/>
			</div>
		</div>
	);
}

Project.propTypes = {
	user: PropTypes.object.isRequired,
	userData: PropTypes.object.isRequired,
};
