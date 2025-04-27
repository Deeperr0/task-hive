import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSave } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { RoleContext, WorkSpaceContext } from "../../../App";
import Overlay from "../Overlay";
import { updateTask, deleteTask } from "../../../utils/manageTasks";

function formatDateToDisplay(dateStr) {
	const date = new Date(dateStr);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${day}-${month}-${year}`;
}

export default function TaskCard({ taskObj }) {
	const [localTaskObj, setLocalTaskObj] = useState(taskObj);
	const [isChanged, setIsChanged] = useState(false);
	const [confirmDeletion, setConfirmDeletion] = useState(false);
	const { currentWorkSpace, setCurrentWorkSpace } =
		useContext(WorkSpaceContext);
	const { role } = useContext(RoleContext);
	useEffect(() => {
		setLocalTaskObj(taskObj);
	}, [
		taskObj,
		taskObj.content,
		taskObj.deadline,
		taskObj.priority,
		taskObj.owner,
		taskObj.notes,
	]);

	function changeSelection(event) {
		let newStatus = event.target.value;
		updateTask(
			taskObj.taskId,
			{
				lastUpdated: new Date().toISOString(),
				owner: localTaskObj.owner,
				ownerUid: taskObj.ownerUid,
				notes: localTaskObj.notes,
				priority: localTaskObj.priority,
				deadline: localTaskObj.deadline,
				content: localTaskObj.content,
				status: newStatus,
				taskId: taskObj.taskId,
			},
			currentWorkSpace,
			setCurrentWorkSpace
		);
		setLocalTaskObj((prev) => ({ ...prev, status: newStatus }));
	}

	function handleDelete() {
		deleteTask(taskObj.taskId, currentWorkSpace, setCurrentWorkSpace);
		setConfirmDeletion(false);
	}

	function handleContentChange(event) {
		setLocalTaskObj((prev) => ({ ...prev, content: event.target.value }));
		setIsChanged(true);
	}

	function handleDeadlineChange(event) {
		setLocalTaskObj((prev) => ({ ...prev, deadline: event.target.value }));
		setIsChanged(true);
	}

	function handlePriorityChange(event) {
		setLocalTaskObj((prev) => ({ ...prev, priority: event.target.value }));
		setIsChanged(true);
	}

	function handleOwnerChange(event) {
		setLocalTaskObj((prev) => ({ ...prev, owner: event.target.value }));
		setIsChanged(true);
	}

	function handleNotesChange(event) {
		setLocalTaskObj((prev) => ({ ...prev, notes: event.target.value }));
		setIsChanged(true);
	}

	function handleUpdate() {
		const now = new Date().toISOString();
		if (role === "admin") {
			const updates = {
				content: localTaskObj.content,
				deadline: localTaskObj.deadline,
				priority: localTaskObj.priority,
				owner: localTaskObj.owner,
				notes: localTaskObj.notes,
				lastUpdated: now,
			};
			updateTask(
				taskObj.taskId,
				updates,
				currentWorkSpace,
				setCurrentWorkSpace
			);
		} else {
			const updates = {
				notes: localTaskObj.notes,
				lastUpdated: now,
			};
			updateTask(
				taskObj.taskId,
				updates,
				currentWorkSpace,
				setCurrentWorkSpace
			);
		}

		setIsChanged(false);
	}

	function checkDeadline() {
		let today = new Date().toISOString().split("T")[0];
		if (today > localTaskObj.deadline) {
			return 1;
		} else if (today === localTaskObj.deadline) {
			return 0;
		} else {
			return -1;
		}
	}

	return (
		<div>
			{confirmDeletion && (
				<Overlay>
					<p>Are you sure you want to delete this task?</p>
					<button
						onClick={handleDelete}
						className="bg-danger text-accent-50 rounded-lg p-2">
						Delete
					</button>
					<button onClick={() => setConfirmDeletion(false)}>Cancel</button>
				</Overlay>
			)}
			<div className="flex h-fit group/card">
				<div
					className={`w-1 shrink-0 h-auto group-hover/card:w-2 transition-all duration-200 ease-out ${
						localTaskObj.status === "Not started"
							? "bg-info"
							: localTaskObj.status === "Working on it"
							? "bg-warning"
							: localTaskObj.status === "Done"
							? "bg-success"
							: localTaskObj.status === "Stuck"
							? "bg-danger"
							: ""
					}`}></div>
				<div
					className={`flex flex-col 
					items-start text-sm w-full 
					border-y-2 border-y-white/10 
					p-3 [&_input]:w-10/12 [&_textarea]:w-10/12 
					[&_select]:w-10/12 transition-all 
					[&_input]:shrink-0 [&_textarea]:shrink-0 
					[&_select]:shrink-0
					[&_select]:bg-transparent
					[&_input]:bg-transparent [&_textarea]:bg-transparent
					[&_select]:text-white
					[&_input]:text-white [&_textarea]:text-white`}>
					{role === "admin" ? (
						<div className="flex gap-2 w-9/12">
							<p className="w-16 shrink-0">Task:</p>
							<input
								type="text"
								value={localTaskObj.content}
								onChange={handleContentChange}
								placeholder="Task Content"
								className="  border-gray-900 border-1 h-full pl-1"
							/>
						</div>
					) : (
						<div className="flex gap-2 w-9/12">
							<p className="w-16 shrink-0">Task:</p>
							<p className="border-gray-900 border-1 h-full">
								{localTaskObj.content}
							</p>
						</div>
					)}

					{role === "admin" && (
						<div className="flex gap-2 w-9/12">
							<p className="w-16 shrink-0">Owner:</p>
							<select
								value={localTaskObj.owner}
								onChange={handleOwnerChange}
								className="w-full border-gray-900 border-1 h-full  ">
								{currentWorkSpace.teamMembers.map((user) => (
									<option key={user.uid} value={user.username}>
										{user.username}
									</option>
								))}
							</select>
						</div>
					)}
					<div className="flex gap-2 w-9/12">
						<p className="w-16 shrink-0">Status:</p>
						<select
							onChange={(e) => changeSelection(e)}
							value={localTaskObj.status}
							className={`  border-gray-900 border-1 h-full [&_option]:text-primary-900`}>
							<option value="Done">Done</option>
							<option value="Working on it">Working on it</option>
							<option value="Stuck">Stuck</option>
							<option value="Not started">Not started</option>
						</select>{" "}
					</div>
					{role === "admin" ? (
						<div className="flex gap-2 w-9/12">
							<p className="w-16 shrink-0">Deadline:</p>
							<input
								type="date"
								value={localTaskObj.deadline}
								onChange={handleDeadlineChange}
								className={`border-gray-900 border-1 h-full   pl-1`}
							/>
						</div>
					) : (
						<div className="flex gap-2 w-9/12">
							<p className="w-16 shrink-0">Deadline:</p>
							<p className=" ">{formatDateToDisplay(localTaskObj.deadline)}</p>
						</div>
					)}
					{role === "admin" ? (
						<div className="flex gap-2 w-9/12">
							<p className="w-16 shrink-0">Priority:</p>
							<select
								value={localTaskObj.priority}
								onChange={handlePriorityChange}
								className={`w-full border-gray-900 border-1 h-full [&_option]:text-primary-900`}>
								<option value="Low">Low</option>
								<option value="Medium">Medium</option>
								<option value="High">High</option>
								<option value="Critical">Critical</option>
							</select>
						</div>
					) : (
						<div className="flex gap-2 w-9/12">
							<p className="w-16 shrink-0">Priority:</p>
							<p className={`border-gray-900 border-1 h-full`}>
								{localTaskObj.priority}
							</p>
						</div>
					)}
					<div className="flex gap-2 w-9/12">
						<p className="w-16 shrink-0">Notes:</p>
						<textarea
							value={localTaskObj.notes}
							onChange={handleNotesChange}
							placeholder="Notes"
							className="h-full border-1   border-gray-900 pl-1 resize-none placeholder:align-middle"
						/>
					</div>
					<div className="flex justify-center   border-gray-900 gap-4 px-4 text-sm w-full mt-4">
						<button
							onClick={handleUpdate}
							className="bg-success text-accent-50 w-8 h-8 rounded-full disabled:bg-gray-500 hover:bg-successHover transition-all duration-300"
							disabled={!isChanged}>
							<FontAwesomeIcon icon={faSave} />
						</button>
						{role === "admin" && (
							<button
								onClick={() => setConfirmDeletion(true)}
								className="bg-danger text-accent-50 w-8 h-8 rounded-full hover:bg-[#be3131] transition-all duration-200">
								<FontAwesomeIcon icon={faTrash} />
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

TaskCard.propTypes = {
	taskObj: PropTypes.object,
};
