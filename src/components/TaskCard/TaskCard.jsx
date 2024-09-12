import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSave } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { RoleContext, WorkSpaceContext } from "../../App";
import Overlay from "../Overlay";
import { updateTask, deleteTask } from "../../utils/manageTasks";

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
		const updates = {
			content: localTaskObj.content,
			deadline: localTaskObj.deadline,
			priority: localTaskObj.priority,
			owner: localTaskObj.owner,
			notes: localTaskObj.notes,
			lastUpdated: now,
		};
		updateTask(taskObj.taskId, updates, currentWorkSpace, setCurrentWorkSpace);
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

	const priorityClass =
		localTaskObj.priority === "Low"
			? "bg-info"
			: localTaskObj.priority === "Medium"
			? "bg-subtleWarning"
			: localTaskObj.priority === "High"
			? "bg-warning"
			: localTaskObj.priority === "Critical"
			? "bg-danger text-customBackground"
			: "";

	const statusClass =
		localTaskObj.status === "Done"
			? "bg-success"
			: localTaskObj.status === "Working on it"
			? "bg-subtleWarning"
			: localTaskObj.status === "Stuck"
			? "bg-danger text-customBackground"
			: localTaskObj.status === "Not started"
			? "bg-info"
			: "";

	return (
		<div className="grid grid-cols-customGrid items-center h-10 text-sm w-[66rem]">
			{confirmDeletion && (
				<Overlay>
					<p className="text-primary-900">
						Are you sure you want to delete this task?
					</p>
					<button
						onClick={handleDelete}
						className="bg-danger text-customBackground rounded-lg p-2"
					>
						Delete
					</button>
					<button onClick={() => setConfirmDeletion(false)}>Cancel</button>
				</Overlay>
			)}
			<div className="sticky left-0 text-customText border-gray-900 " />

			{role === "admin" ? (
				<input
					type="text"
					value={localTaskObj.content}
					onChange={handleContentChange}
					placeholder="Task Content"
					className="text-primary-900 border-gray-900 border-1 h-full pl-2 sticky left-0"
				/>
			) : (
				<p className="border-gray-900 border-1 h-full">
					{localTaskObj.content}
				</p>
			)}

			{role === "admin" ? (
				<select
					value={localTaskObj.owner}
					onChange={handleOwnerChange}
					className="w-full border-gray-900 border-1 h-full text-primary-900"
				>
					{currentWorkSpace.teamMembers.map((user) => (
						<option
							key={user.uid}
							value={user.username}
						>
							{user.username}
						</option>
					))}
				</select>
			) : (
				<p className="border-gray-900 border-1 h-full">{localTaskObj.owner}</p>
			)}

			<select
				onChange={(e) => changeSelection(e)}
				value={localTaskObj.status}
				className={`${statusClass} border-gray-900 border-1 h-full`}
			>
				<option
					value="Done"
					className="bg-success"
				>
					Done
				</option>
				<option
					value="Working on it"
					className="bg-subtleWarning"
				>
					Working on it
				</option>
				<option
					value="Stuck"
					className="bg-danger"
				>
					Stuck
				</option>
				<option
					value="Not started"
					className="bg-info"
				>
					Not started
				</option>
			</select>
			{role === "admin" ? (
				<input
					type="date"
					value={localTaskObj.deadline}
					onChange={handleDeadlineChange}
					className={`border-gray-900 border-1 h-full  
						${
							taskObj.status == "Done"
								? "text-primary-900"
								: checkDeadline() === 1
								? "bg-danger"
								: checkDeadline() === 0
								? "bg-warning"
								: ""
						}`}
				/>
			) : (
				<p
					className={
						checkDeadline() === 1
							? "bg-danger"
							: checkDeadline() === 0
							? "bg-warning"
							: ""
					}
				>
					{formatDateToDisplay(localTaskObj.deadline)}
				</p>
			)}
			{role === "admin" ? (
				<select
					value={localTaskObj.priority}
					onChange={handlePriorityChange}
					className={`w-full border-gray-900 border-1 h-full ${priorityClass}`}
				>
					<option
						value="Low"
						className="bg-info"
					>
						Low
					</option>
					<option
						value="Medium"
						className="bg-subtleWarning"
					>
						Medium
					</option>
					<option
						value="High"
						className="bg-warning"
					>
						High
					</option>
					<option
						value="Critical"
						className="bg-danger"
					>
						Critical
					</option>
				</select>
			) : (
				<p
					className={`border-gray-900 border-1 h-full ${priorityClass} priority-column`}
				>
					{localTaskObj.priority}
				</p>
			)}
			<textarea
				value={localTaskObj.notes}
				onChange={handleNotesChange}
				placeholder="Notes"
				className="h-full border-1 text-primary-900 border-gray-900 pl-2 resize-none placeholder:align-middle"
			/>
			<div className="buttons buttons-column text-primary-900 border-gray-900 flex gap-4 px-4 text-sm">
				<button
					onClick={handleUpdate}
					className="bg-success text-customBackground w-8 h-8 rounded-full disabled:bg-gray-500 hover:bg-successHover transition-all duration-300"
					disabled={!isChanged}
				>
					<FontAwesomeIcon icon={faSave} />
				</button>
				{role === "admin" && (
					<button
						onClick={() => setConfirmDeletion(true)}
						className="bg-danger text-customBackground w-8 h-8 rounded-full hover:bg-[#be3131] transition-all duration-200"
					>
						<FontAwesomeIcon icon={faTrash} />
					</button>
				)}
			</div>
		</div>
	);
}

TaskCard.propTypes = {
	taskObj: PropTypes.object,
};
