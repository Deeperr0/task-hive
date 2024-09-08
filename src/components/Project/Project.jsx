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
						className="bg-accentShade1 hover:bg-accentShade1Hover text-customBackground py-2 px-3 rounded-lg transition-all duration-300"
					>
						New task
					</button>
					<button
						className="bg-accentShade1 hover:bg-accentShade1Hover text-customBackground py-2 px-3 rounded-lg transition-all duration-300"
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
			<Tasks
				name="To do"
				tasksList={
					role === "admin"
						? filteredTasks.filter((task) => task.status != "Done")
						: filteredTasks
								.filter((task) => task.status != "Done")
								.filter((task) => task.ownerUid === user.uid)
				}
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
			/>
		</div>
	);
}

Project.propTypes = {
	user: PropTypes.object.isRequired,
	userData: PropTypes.object.isRequired,
};
