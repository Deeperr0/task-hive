import { useState, useEffect, useCallback, useContext } from "react";
import "./TaskCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSave } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { WorkSpaceContext } from "../../App";
import Overlay from "../Overlay";

function debounce(func, wait) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
}

function formatDateToDisplay(dateStr) {
	const date = new Date(dateStr);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${day}-${month}-${year}`;
}

export default function TaskCard({ taskObj, deleteTask, updateTask }) {
	const [localContent, setLocalContent] = useState(taskObj.content);
	const [localDeadline, setLocalDeadline] = useState(taskObj.deadline);
	const [localPriority, setLocalPriority] = useState(taskObj.priority);
	const [localOwner, setLocalOwner] = useState(taskObj.owner);
	const [localNotes, setLocalNotes] = useState(taskObj.notes);
	const [isChanged, setIsChanged] = useState(false);
	const [confirm, setConfirm] = useState(false);
	const [localStatus, setLocalStatus] = useState(taskObj.status);

	const { currentWorkSpace, setCurrentWorkSpace } =
		useContext(WorkSpaceContext);

	useEffect(() => {
		setLocalContent(taskObj.content);
		setLocalDeadline(taskObj.deadline);
		setLocalPriority(taskObj.priority);
		setLocalOwner(taskObj.owner);
		setLocalNotes(taskObj.notes);
	}, [
		taskObj.content,
		taskObj.deadline,
		taskObj.priority,
		taskObj.owner,
		taskObj.notes,
	]);

	const debouncedUpdateStatus = useCallback(
		debounce((taskId, newStatus) => {
			updateTask(taskId, {
				lastUpdated: new Date().toISOString(),
				owner: localOwner,
				ownerUid: taskObj.ownerUid,
				notes: localNotes,
				priority: localPriority,
				deadline: localDeadline,
				content: localContent,
				status: newStatus,
				taskId: taskId,
			});
			setLocalStatus(newStatus);
		}, 1000),
		[]
	);

	function changeSelection(event) {
		let newStatus = event.target.value;
		debouncedUpdateStatus(taskObj.taskId, newStatus);
	}

	function handleDelete() {
		deleteTask(taskObj.taskId);
		setConfirm(false);
	}

	function handleContentChange(event) {
		setLocalContent(event.target.value);
		setIsChanged(true);
	}

	function handleDeadlineChange(event) {
		setLocalDeadline(event.target.value);
		setIsChanged(true);
	}

	function handlePriorityChange(event) {
		setLocalPriority(event.target.value);
		setIsChanged(true);
	}

	function handleOwnerChange(event) {
		setLocalOwner(event.target.value);
		setIsChanged(true);
	}

	function handleNotesChange(event) {
		setLocalNotes(event.target.value);
		setIsChanged(true);
	}

	function handleUpdate() {
		const now = new Date().toISOString();
		const updates = {
			content: localContent,
			deadline: localDeadline,
			priority: localPriority,
			owner: localOwner,
			notes: localNotes,
			lastUpdated: now,
		};
		updateTask(taskObj.taskId, updates);
		setIsChanged(false);
	}

	function checkDeadline() {
		let today = new Date().toISOString().split("T")[0];
		if (today > localDeadline) {
			return 1;
		} else if (today === localDeadline) {
			return 0;
		} else {
			return -1;
		}
	}

	const priorityClass =
		localPriority === "Low"
			? "task--priority-low"
			: localPriority === "Medium"
			? "task--priority-medium"
			: localPriority === "High"
			? "task--priority-high"
			: localPriority === "Critical"
			? "task--priority-critical"
			: "";

	const statusClass =
		localStatus === "Done"
			? "task--status-done"
			: localStatus === "Working on it"
			? "task--status-working"
			: localStatus === "Stuck"
			? "task--status-stuck"
			: localStatus === "Not started"
			? "task--status-not-started"
			: "";

	return (
		<div className="task--card task--row">
			{confirm && (
				<Overlay>
					<p>Are you sure you want to delete this task?</p>
					<button
						onClick={handleDelete}
						className="delete-button"
					>
						Delete
					</button>
					<button
						onClick={() => setConfirm(false)}
						className="cancel-button"
					>
						Cancel
					</button>
				</Overlay>
			)}
			{currentWorkSpace.role === "admin" ? (
				<input
					type="text"
					value={localContent}
					onChange={handleContentChange}
					placeholder="Task Content"
					className="sticky task-column"
				/>
			) : (
				<p className="task--text sticky task-column">{localContent}</p>
			)}
			<p className="task--owner owner-column">
				{currentWorkSpace.role === "admin" ? (
					<select
						value={localOwner}
						onChange={handleOwnerChange}
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
					<p className="task--owner-text">{localOwner}</p>
				)}
			</p>
			<select
				onChange={(e) => changeSelection(e)}
				value={localStatus}
				className={`select-status ${statusClass} status-column`}
			>
				<option
					value="Done"
					className="option-status-done"
				>
					Done
				</option>
				<option
					value="Working on it"
					className="option-status-working"
				>
					Working on it
				</option>
				<option
					value="Stuck"
					className="option-status-stuck"
				>
					Stuck
				</option>
				<option
					value="Not started"
					className="option-status-not-started"
				>
					Not started
				</option>
			</select>
			{currentWorkSpace.role === "admin" ? (
				<input
					type="date"
					value={localDeadline}
					onChange={handleDeadlineChange}
					className={
						taskObj.status == "Done"
							? "deadline-column"
							: checkDeadline() === 1
							? "deadline-column overdue"
							: checkDeadline() === 0
							? "deadline-column today"
							: "deadline-column"
					}
				/>
			) : (
				<p
					className={
						checkDeadline() === 1
							? "deadline-column overdue"
							: checkDeadline() === 0
							? "deadline-column today"
							: "deadline-column"
					}
				>
					{formatDateToDisplay(localDeadline)}
				</p>
			)}
			{currentWorkSpace.role === "admin" ? (
				<select
					value={localPriority}
					onChange={handlePriorityChange}
					className={`select-priority ${priorityClass} priority-column`}
				>
					<option
						value="Low"
						className="option-priority-low"
					>
						Low
					</option>
					<option
						value="Medium"
						className="option-priority-medium"
					>
						Medium
					</option>
					<option
						value="High"
						className="option-priority-high"
					>
						High
					</option>
					<option
						value="Critical"
						className="option-priority-critical"
					>
						Critical
					</option>
				</select>
			) : (
				<p className={`select-priority ${priorityClass} priority-column`}>
					{localPriority}
				</p>
			)}
			<textarea
				value={localNotes}
				onChange={handleNotesChange}
				placeholder="Notes"
				className="notes-column"
			/>
			<div className="buttons buttons-column">
				<button
					onClick={handleUpdate}
					className="task--update"
					disabled={!isChanged}
				>
					<FontAwesomeIcon icon={faSave} />
				</button>
				{currentWorkSpace.role === "admin" && (
					<button
						onClick={() => setConfirm(true)}
						className="task--delete"
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
	updateTask: PropTypes.func,
	deleteTask: PropTypes.func,
};
