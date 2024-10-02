import AddUser from "../AddUser";
import Filters from "../Filters";
import { useContext, useState } from "react";
import Tasks from "../Tasks";
import PropTypes from "prop-types";
import { RoleContext, WorkSpaceContext } from "../../App";
import useFilterTasks from "../../hooks/useFilterTasks";
import { addTask } from "../../utils/manageTasks";
export default function Project({ user, userData }) {
	const { currentWorkSpace, setCurrentWorkSpace } =
		useContext(WorkSpaceContext);
	const [priorityFilter, setPriorityFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [toggleAddUser, setToggleAddUser] = useState(false);
	const { role } = useContext(RoleContext);
	const filteredTasks = useFilterTasks(
		priorityFilter,
		statusFilter,
		currentWorkSpace
	);

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
						className="bg-accent-500 hover:bg-accent-600 text-customBackground py-2 px-3 rounded-lg transition-all duration-300"
					>
						New task
					</button>
					<button
						className="bg-accent-500 hover:bg-accent-600 text-customBackground py-2 px-3 rounded-lg transition-all duration-300"
						onClick={() => setToggleAddUser(true)}
					>
						Add user
					</button>
				</div>
			)}
			<Filters
				setPriorityFilter={setPriorityFilter}
				setStatusFilter={setStatusFilter}
			/>
			<div className="flex flex-col lg:flex-row gap-4 w-full">
				<Tasks
					name="To do"
					tasksList={
						role === "admin"
							? filteredTasks
									.filter((task) => task.status == "Not started")
									.filter((task) => task.ownerUid === user.uid)
							: []
					}
				/>
				<Tasks
					name="In progress"
					tasksList={filteredTasks
						.filter((task) => task.status === "Working on it")
						.filter((task) => task.ownerUid === user.uid)}
				/>
				<Tasks
					name="Stuck"
					tasksList={filteredTasks
						.filter((task) => task.status === "Stuck")
						.filter((task) => task.ownerUid === user.uid)}
				/>
				<Tasks
					name="Done"
					tasksList={filteredTasks
						.filter((task) => task.status === "Done")
						.filter((task) => task.ownerUid === user.uid)}
				/>
			</div>
		</div>
	);
}

Project.propTypes = {
	user: PropTypes.object.isRequired,
	userData: PropTypes.object.isRequired,
};
